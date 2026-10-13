import { getMobileUILayout } from '../ui/MobileUILayout.js';
import { roomEnvironmentRenderer } from './RoomEnvironmentRenderer.js';
import { renderRocketPunch, renderBattleCrouch, BATTLE_CROUCH_FRAME, BATTLE_TRAIN_BODY, battlePlayerJumpOffset, laserProjection, renderTrainWalk, rocketPunchTouchesPlayer } from './BattlePresentation.js';
import { babyRenderer } from '../entities/BabyRenderer.js';

export const BATTLE_ORDER = ['train', 'robot', 'dinosaur', 'bear'];
export const BATTLE_PLAYER_VISUAL_SCALE = 2;
const NAMES = { train: 'Trem', robot: 'Robô', dinosaur: 'Dinossauro', bear: 'Urso' };
const ATTACKS = { train: ['Steam Blast', 'Front Charge'], robot: ['Laser Beam', 'Rocket Punch'],
  dinosaur: ['Bite', 'Rush'], bear: ['Bear Hug', 'Belly Charge', 'Toy Leap'] };
// Parâmetros provisórios autorizados para avaliação, em quadros de 60 Hz.
export const BATTLE_TUNING = { left: 160, right: 1440, ground: 690, speed: 4,
  jumpSpeed: 8.5, gravity: 0.3, swordRange: 112, swordCooldown: 26,
  windup: 54, active: 18, recovery: 36, immunity: 48, hitRecovery: 28, death: 60 };
export const BATTLE_TRANSITION_DURATION = 120;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

/** Distribui as poses do Rush pelas janelas existentes, sem alterar a simulação. */
export function battleAnimationFrame(animation, enemy, duration) {
  if (animation.loop) return Math.floor(enemy.elapsed / 7) % animation.frames.length;
  if (enemy.actor === 'dinosaur' && enemy.state === 'ATTACK' && enemy.attack === 'Rush' && animation.frames.length === 6) {
    const { windup, active, recovery } = BATTLE_TUNING;
    if (enemy.elapsed < windup) return clamp(Math.floor(enemy.elapsed / windup * 2), 0, 1);
    if (enemy.elapsed < windup + active) return 2 + clamp(Math.floor((enemy.elapsed - windup) / active * 2), 0, 1);
    return 4 + clamp(Math.floor((enemy.elapsed - windup - active) / recovery * 2), 0, 1);
  }
  return clamp(Math.floor(enemy.elapsed / duration * animation.frames.length), 0, animation.frames.length - 1);
}

/** Transfere um coração por impacto válido, descartando cura excedente. */
export function transferHeart(victim, attacker) {
  if (victim.hp <= 0 || attacker.hp <= 0) return false;
  victim.hp = Math.max(0, victim.hp - 1);
  attacker.hp = Math.min(attacker.maxHp, attacker.hp + 1);
  return true;
}

export class ToyRoomBattle {
  constructor(room, { loadAssets = true } = {}) {
    this.room = room;
    this.state = null;
    this.images = new Map();
    this.manifest = null;
    this.error = null;
    this.ready = !loadAssets;
    this.readyPromise = loadAssets ? this.load().catch(error => { this.error = error.message; }) : Promise.resolve();
  }

  async load() {
    const root = new URL('../../../assets/art/toy-room/battle/', import.meta.url);
    const response = await fetch(new URL('remediation/manifest.json', root));
    if (!response.ok) throw Error('Não foi possível carregar o manifesto de combate.');
    this.manifest = await response.json();
    const files = new Set(Object.values(this.manifest.actors).flatMap(actor =>
      Object.values(actor.animations).flatMap(animation => animation.frames.map(frame => frame.file))));
    files.add(BATTLE_CROUCH_FRAME.file);
    files.add(BATTLE_TRAIN_BODY.file);
    await Promise.all([...files].map(file => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => { this.images.set(file, image); resolve(); };
      image.onerror = () => reject(Error(`Sprite de combate ausente: ${file}`));
      image.src = new URL(file, root).href;
    })));
    if (!this.room.assets?.get('official-character') || this.room.story.attackFrames.some(frame => !frame))
      throw Error('Os sprites da menina ou do ataque de espada estão ausentes.');
    this.ready = true;
  }

  activate() {
    if (this.state) return;
    this.room.clearInput();
    this.room.tutorial.active = false;
    this.room.player.carriedItem = null;
    this.room.story.state.pendingReturns = [];
    this.room.story.state.recurrenceActive = false;
    Object.assign(this.room.player, { x: 430, y: BATTLE_TUNING.ground - 28, facing: 'right', isMoving: false });
    this.state = { mode: 'BATTLE', index: 0, elapsed: 0, upHeld: false, cooldown: 0,
      immunity: 0, attackTime: 0, swordHit: false, jump: 0, jumpVelocity: 0,
      crouching: false, player: { hp: 3, maxHp: 3 }, enemy: null, history: [], ending: 0,
      hitPause: 0, impact: null, combatShake: null, playerHitTime: 0, playerHitDirection: 0,
      playerStepTimer: 0, enemyStepTimer: 0, wasJumping: false };
    this.playCombatSound('arena_start');
    this.spawn();
    this.beginTransition(null);
    this.room.gameplayState = 'TOY_ROOM_BATTLE';
  }

  spawn() {
    this.state.transition = null;
    const s = this.state, actor = BATTLE_ORDER[s.index], maxHp = actor === 'bear' ? 4 : 2;
    s.enemy = { actor, hp: maxHp, maxHp, x: 1120, facing: -1, state: 'IDLE', elapsed: 0,
      attackIndex: 0, attack: null, landed: false, enrage: false, enrageShown: false,
      walkSoundTimer: 0 };
  }

  // A caixa mantém sua ilustração; na arena fica visível ao lado do combate.
  arenaChest() {
    const chest = this.room.furniture.find(item => item.id === 'toy-chest');
    return { ...chest, x: 1240, y: BATTLE_TUNING.ground - 180 };
  }

  beginTransition(outgoing) {
    const s = this.state;
    s.transition = { elapsed: 0, outgoing: outgoing ? { ...outgoing } : null,
      incoming: s.index < BATTLE_ORDER.length ? { ...s.enemy } : null };
    s.attackTime = 0;
    this.room.story.state.attackElapsed = 0;
    this.room.clearInput();
    if (outgoing) this.playCombatSound('enemy_return');
    if (s.transition.incoming) this.playCombatSound('enemy_entry');
  }

  transitionPlacement(incoming) {
    const transition = this.state.transition, chest = this.arenaChest();
    const progress = clamp(transition.elapsed / BATTLE_TRANSITION_DURATION, 0, 1);
    const smooth = progress * progress * (3 - 2 * progress);
    const actor = incoming ? transition.incoming : transition.outgoing;
    const boxX = chest.x + chest.w / 2, boxY = chest.y + 100;
    const fromX = incoming ? boxX : actor.x, toX = incoming ? actor.x : boxX;
    const fromY = incoming ? boxY : BATTLE_TUNING.ground;
    const toY = incoming ? BATTLE_TUNING.ground : boxY;
    return { ...actor, x: fromX + (toX - fromX) * smooth,
      y: fromY + (toY - fromY) * smooth - Math.sin(progress * Math.PI) * 65,
      facing: actor.facing, state: incoming ? 'APPROACH' : 'DEATH',
      elapsed: incoming ? transition.elapsed : BATTLE_TUNING.death,
      carried: !incoming, progress, transportScale: incoming ? 0.2 + smooth * 0.8 : 1 - smooth * 0.8 };
  }

  input() {
    const r = this.room, k = r.keysDown;
    let x = Number(Boolean(k.KeyD || k.ArrowRight)) - Number(Boolean(k.KeyA || k.ArrowLeft));
    let y = Number(Boolean(k.KeyS || k.ArrowDown)) - Number(Boolean(k.KeyW || k.ArrowUp));
    if (r.gamepadState.active) { x = r.gamepadState.x; y = r.gamepadState.y; }
    if (r.touchState.active) { x = r.touchState.vectorX; y = r.touchState.vectorY; }
    return { x: Math.abs(x) > 0.18 ? x : 0, up: y < -0.35, down: y > 0.35 };
  }

  attack() {
    const s = this.state;
    if (!s || !this.ready || this.error) return false;
    if (s.mode === 'VICTORY' || s.mode === 'DEFEAT') {
      if (s.ending < 90) return false;
      this.room.onReturnToTitle?.();
      return true;
    }
    if (s.mode !== 'BATTLE' || s.transition || s.cooldown > 0) return false;
    if (!this.room.story.attack()) return false;
    s.cooldown = BATTLE_TUNING.swordCooldown;
    s.attackTime = 12;
    s.swordHit = false;
    this.playCombatSound('player_attack');
    return true;
  }

  playCombatSound(sound) {
    const s = this.state;
    this.room.audio?.playCombatSound?.(sound);
    if (s) s.history.push({ event: 'SOUND', sound, frame: Math.floor(s.elapsed) });
  }

  setEnemyState(state) {
    const enemy = this.state.enemy;
    enemy.state = state;
    enemy.elapsed = 0;
    if (state === 'ENRAGE') this.playCombatSound('bear_enrage');
  }

  beginEnemyAttack(attack) {
    const enemy = this.state.enemy;
    enemy.attack = attack;
    enemy.attackIndex++;
    enemy.landed = false;
    this.setEnemyState('ATTACK');
    const sounds = {
      'Steam Blast': 'train_steam', 'Front Charge': 'train_charge',
      'Laser Beam': 'robot_laser', 'Rocket Punch': 'robot_punch',
      Bite: 'dinosaur_bite', Rush: 'dinosaur_rush',
      'Bear Hug': 'bear_hug', 'Belly Charge': 'bear_charge', 'Toy Leap': 'bear_leap'
    };
    this.playCombatSound(sounds[attack]);
  }

  startImpact(target, x, y, direction, heavy) {
    const s = this.state;
    s.impact = { target, x, y, direction, elapsed: 0, duration: 14, heavy };
    s.combatShake = { elapsed: 0, duration: 10, strength: heavy ? 4 : 2 };
    s.hitPause = heavy ? 2 : 1;
    s.history.push({ event: 'IMPACT', target, frame: Math.floor(s.elapsed), heavy });
  }

  update(dt) {
    if (!this.state) return;
    // Subpassos limitados preservam as janelas de colisão durante uma atualização lenta.
    let remaining = clamp(Number.isFinite(dt) ? dt : 1, 0, 12);
    while (remaining > 0) {
      if (this.state.hitPause > 0) {
        const paused = Math.min(1, remaining, this.state.hitPause);
        this.state.hitPause -= paused;
        remaining -= paused;
      } else {
        const step = Math.min(1, remaining);
        this.step(step);
        remaining -= step;
      }
    }
  }

  step(dt) {
    const s = this.state, r = this.room, e = s.enemy, t = BATTLE_TUNING;
    if (!this.ready || this.error) return;
    if (s.mode !== 'BATTLE') { s.ending += dt; return; }
    if (s.impact) {
      s.impact.elapsed += dt;
      if (s.impact.elapsed >= s.impact.duration) s.impact = null;
    }
    if (s.combatShake) {
      s.combatShake.elapsed += dt;
      if (s.combatShake.elapsed >= s.combatShake.duration) s.combatShake = null;
    }
    s.playerHitTime = Math.max(0, s.playerHitTime - dt);
    if (s.transition) {
      s.transition.elapsed = Math.min(BATTLE_TRANSITION_DURATION, s.transition.elapsed + dt);
      if (s.transition.elapsed >= BATTLE_TRANSITION_DURATION) {
        const incoming = s.transition.incoming;
        s.transition = null;
        r.clearInput(); s.upHeld = false;
        if (!incoming) { s.mode = 'VICTORY'; s.ending = 0; this.playCombatSound('victory'); }
      }
      r.player.isMoving = false;
      return;
    }
    s.elapsed += dt;
    s.cooldown = Math.max(0, s.cooldown - dt);
    s.immunity = Math.max(0, s.immunity - dt);
    s.attackTime = Math.max(0, s.attackTime - dt);
    r.story.state.attackElapsed = s.attackTime;
    const input = this.input();
    if (input.up && !s.upHeld && s.jump === 0) {
      s.jumpVelocity = t.jumpSpeed;
      this.playCombatSound('player_jump');
    }
    s.upHeld = input.up;
    const wasAirborne = s.jump > 0;
    if (s.jumpVelocity !== 0 || s.jump > 0) {
      s.jump += s.jumpVelocity * dt; s.jumpVelocity -= t.gravity * dt;
      if (s.jump <= 0) {
        s.jump = 0; s.jumpVelocity = 0;
        if (wasAirborne) this.playCombatSound('player_land');
      }
    }
    s.crouching = input.down && s.jump === 0;
    if (input.x) r.player.facing = input.x > 0 ? 'right' : 'left';
    r.player.isMoving = Boolean(input.x && !s.crouching);
    r.player.x = clamp(r.player.x + (s.crouching ? 0 : input.x * t.speed * dt), t.left + 35, t.right - 35);
    r.player.y = t.ground - 28;
    r.player.animTime += dt * 0.22;
    s.playerStepTimer = Math.max(0, s.playerStepTimer - dt);
    if (r.player.isMoving && s.playerStepTimer === 0) {
      this.playCombatSound('player_walk');
      s.playerStepTimer = 14;
    }
    e.elapsed += dt;
    if (s.attackTime > 0 && s.attackTime <= 8 && !s.swordHit && e.hp > 0) {
      const dx = e.x - r.player.x, facing = r.story.state.attackDirection;
      if (dx * facing >= -20 && Math.abs(dx) < t.swordRange && s.jump < 85) {
        s.swordHit = true;
        transferHeart(e, s.player);
        s.history.push({ event: 'PLAYER_HIT', enemy: e.actor, playerHp: s.player.hp, enemyHp: e.hp });
        const impactX = (r.player.x + e.x) / 2, impactY = t.ground - 42;
        this.startImpact('enemy', impactX, impactY, facing, e.actor === 'bear');
        this.playCombatSound(`${e.actor}_hit`);
        this.playCombatSound('heart_gain');
        this.playCombatSound('heart_loss');
        if (e.hp === 0) this.playCombatSound(`${e.actor}_death`);
        this.setEnemyState(e.hp === 0 ? 'DEATH' : 'HIT');
        if (e.hp === 1 && e.actor === 'bear') e.enrage = true;
      }
    }
    if (e.state === 'DEATH') {
      if (e.elapsed >= t.death) {
        s.history.push({ event: 'DEFEATED', enemy: e.actor });
        ++s.index;
        if (s.index < BATTLE_ORDER.length) this.spawn();
        this.beginTransition(e);
      }
      return;
    }
    if (e.state === 'HIT') {
      if (e.elapsed >= t.hitRecovery) this.setEnemyState('RETREAT');
      return;
    }
    if (e.enrage && !e.enrageShown && e.state !== 'ATTACK') {
      e.enrageShown = true; this.setEnemyState('ENRAGE');
    }
    if (e.state === 'ENRAGE') { if (e.elapsed >= 48) this.setEnemyState('APPROACH'); return; }
    const dx = r.player.x - e.x, distance = Math.abs(dx);
    if (e.state !== 'ATTACK') e.facing = dx < 0 ? -1 : 1;
    if (e.state === 'IDLE') { if (e.elapsed >= 45) this.setEnemyState('APPROACH'); }
    else if (e.state === 'APPROACH') {
      const attacks = ATTACKS[e.actor], attack = attacks[e.attackIndex % attacks.length];
      const reach = ['Steam Blast', 'Laser Beam', 'Rocket Punch'].includes(attack) ? 270 : 125;
      if (distance > reach) {
        e.x = clamp(e.x + e.facing * (e.enrage ? 2.6 : 2) * dt, t.left + 40, t.right - 40);
        e.walkSoundTimer = Math.max(0, e.walkSoundTimer - dt);
        if (e.walkSoundTimer === 0) {
          this.playCombatSound(`${e.actor}_walk`);
          e.walkSoundTimer = 22;
        }
      } else this.beginEnemyAttack(attack);
    } else if (e.state === 'RETREAT') {
      e.x = clamp(e.x - e.facing * 1.5 * dt, t.left + 40, t.right - 40);
      if (e.elapsed >= 30) this.setEnemyState('IDLE');
    } else if (e.state === 'ATTACK') {
      const active = e.elapsed >= t.windup && e.elapsed < t.windup + t.active;
      const charge = ['Front Charge', 'Rush', 'Belly Charge'].includes(e.attack);
      if (active && charge) e.x = clamp(e.x + e.facing * 5 * dt, t.left + 40, t.right - 40);
      const damaging = e.attack === 'Toy Leap' ? e.elapsed >= 84 && e.elapsed < 96 : active;
      if (damaging && !e.landed && s.immunity === 0) {
        const range = e.attack === 'Laser Beam' ? 340 : e.attack === 'Rocket Punch' ? 280 : e.attack === 'Steam Blast' ? 280 : e.attack === 'Toy Leap' ? 118 : 110;
        const signed = (r.player.x - e.x) * e.facing;
        const dodge = s.jump > 65 || (s.crouching && e.attack === 'Laser Beam');
        const rocketContact = e.attack === 'Rocket Punch' && this.manifest
          ? rocketPunchTouchesPlayer(
            this.manifest.actors.robot.animations['Rocket Punch'].frames[3],
            this.manifest.actors.robot.animations.Idle.frames[0], e.elapsed, signed,
            {state:s,player:r.player,attackDirection:r.story.state.attackDirection,enemyFacing:e.facing})
          : null;
        const inRange = e.attack === 'Rocket Punch' && rocketContact !== null
          ? signed >= -35 && rocketContact
          : signed >= -35 && signed < range;
        if (!dodge && inRange) {
          e.landed = true;
          transferHeart(s.player, e);
          s.immunity = t.immunity;
          s.history.push({ event: 'ENEMY_HIT', enemy: e.actor, playerHp: s.player.hp, enemyHp: e.hp });
          const heavy = e.actor === 'bear';
          s.playerHitTime = 18;
          s.playerHitDirection = e.facing;
          s.attackTime = 0;
          r.story.state.attackElapsed = 0;
          s.crouching = false;
          this.startImpact('player', r.player.x, t.ground - 40, e.facing, heavy);
          this.playCombatSound('player_hit');
          this.playCombatSound(`${e.actor}_hit`);
          this.playCombatSound('heart_loss');
          this.playCombatSound('heart_gain');
          if (s.player.hp === 0) {
            this.playCombatSound('player_death');
            this.playCombatSound('defeat');
            s.mode = 'DEFEAT'; s.ending = 0; r.clearInput(); return;
          }
        }
      }
      if (e.elapsed >= t.windup + t.active + t.recovery) this.setEnemyState('RETREAT');
    }
  }

  enemyPose(e = this.state.enemy) {
    return e.state === 'DEATH' ? 'Death' : e.state === 'HIT' ? 'Hit' : e.state === 'ENRAGE' ? 'Enrage'
      : e.state === 'ATTACK' ? e.attack : ['APPROACH', 'RETREAT'].includes(e.state) ? 'Walk' : 'Idle';
  }

  render() {
    const r = this.room, ctx = r.ctx, layout = getMobileUILayout(r.canvas), s = this.state, t = BATTLE_TUNING;
    ctx.save(); ctx.clearRect(0, 0, r.canvas.width, r.canvas.height);
    const stageTop = layout.hudBottom + 72 * layout.scale;
    const stageBottom = layout.safeBottom - 16 * layout.scale;
    const scale = Math.max(0.05, Math.min(layout.usableWidth / 1440, Math.max(1,stageBottom-stageTop) / 400));
    const shake = s.combatShake;
    const shakeProgress = shake ? shake.elapsed / shake.duration : 1;
    const shakeX = shake ? Math.sin(shake.elapsed * 2.7) * shake.strength * (1 - shakeProgress) : 0;
    const shakeY = shake ? Math.cos(shake.elapsed * 2.1) * shake.strength * 0.35 * (1 - shakeProgress) : 0;
    const ox = layout.centerX - 800 * scale + shakeX * scale;
    const oy = (stageTop + stageBottom) / 2 - 550 * scale;
    const stageOy = oy + shakeY * scale;
    ctx.save(); ctx.translate(ox, stageOy); ctx.scale(scale, scale);
    roomEnvironmentRenderer.renderBackground(ctx, r.ROOM_W, r.ROOM_H, {
      assets: r.assets, environmentSheet: r.environmentFloorTile, environmentRug: r.environmentRug,
      environmentDoor: r.environmentDoor, environmentDetails: r.environmentDetails });
    for (const furniture of r.furniture.filter(item => item.id !== 'toy-chest')) roomEnvironmentRenderer.renderFurniture(ctx, furniture, {
      assets:r.assets,environmentChest:r.environmentChest,environmentTable:r.environmentTable });
    if (this.ready && !this.error) {
      const drawEnemy = e => {
        const pose = this.enemyPose(e), animation = this.manifest.actors[e.actor].animations[pose];
        const duration = e.state === 'ATTACK' ? t.windup + t.active + t.recovery : e.state === 'DEATH' ? t.death : e.state === 'HIT' ? t.hitRecovery : 48;
        const index = battleAnimationFrame(animation, e, duration);
        const f = animation.frames[index], image = this.images.get(f.file);
        const reference = this.manifest.actors[e.actor].animations.Idle.frames[0];
        const height = {train:90,robot:100,dinosaur:100,bear:130}[e.actor];
        const factor = f.displayScale * height / ((reference.height - 24) * reference.displayScale) * (e.transportScale ?? 1);
        const hitProgress = s.impact?.target === 'enemy' ? Math.min(1, s.impact.elapsed / 8) : 1;
        const recoil = s.impact?.target === 'enemy' ? -e.facing * (1 - hitProgress) * 7 : 0;
        ctx.save();
        if (e.state === 'HIT' && Math.floor(e.elapsed / 2) % 2 === 0) ctx.globalAlpha = 0.48;
        ctx.translate(e.x + recoil, e.y ?? t.ground); ctx.scale(e.facing, 1);
        // O derrotado é transportado inerte; não representa caminhada congelada.
        if (e.carried) ctx.rotate(Math.sin(e.progress * Math.PI * 2) * 0.12);
        if (e.actor === 'train' && pose === 'Walk') {
          renderTrainWalk(ctx,this.images.get(BATTLE_TRAIN_BODY.file),this.images.get(animation.frames[0].file),e.elapsed,e.transportScale ?? 1);
        } else if (e.state === 'ATTACK' && e.attack === 'Rocket Punch' && e.elapsed >= 44 && e.elapsed < 90) {
          const armFrame = animation.frames[3];
          renderRocketPunch(ctx, this.images.get(armFrame.file), armFrame, reference, e.elapsed, (r.player.x - e.x) * e.facing,
            {state:s,player:r.player,attackDirection:r.story.state.attackDirection,enemyFacing:e.facing});
        } else ctx.drawImage(image, -f.anchor.x * factor, -f.anchor.y * factor, f.width * factor, f.height * factor);
        ctx.restore();
      };
      if (s.transition) {
        if (s.transition.outgoing) drawEnemy(this.transitionPlacement(false));
        if (s.transition.incoming) drawEnemy(this.transitionPlacement(true));
      } else if (s.mode !== 'VICTORY') drawEnemy(s.enemy);
      const e = s.enemy;
      // O efeito mostra a região ofensiva na mesma janela em que a colisão é ativa.
      if(!s.transition && e.state==='ATTACK' && e.elapsed>=t.windup && e.elapsed<t.windup+t.active) {
        if(e.attack==='Laser Beam') {
          const beam=laserProjection(s,r.player,e,r.story.state.attackDirection);
          ctx.strokeStyle='#ff6666';ctx.lineWidth=8;ctx.lineCap='butt';ctx.beginPath();
          ctx.moveTo(e.x+e.facing*beam.start,t.ground-beam.height);ctx.lineTo(e.x+e.facing*beam.end,t.ground-beam.height);ctx.stroke();
          ctx.strokeStyle='#fff2dd';ctx.lineWidth=3;ctx.stroke();
        } else if(e.attack==='Steam Blast') {
          ctx.fillStyle='rgba(255,241,214,.6)';
          for(let i=0;i<9;i++) {ctx.beginPath();ctx.arc(e.x+e.facing*(20+i*30),t.ground-45+Math.sin(e.elapsed*.3+i)*8,18+i*1.2,0,Math.PI*2);ctx.fill();}
        }
      }
      // A frente da caixa encobre a entrada/saída, sem dissolver os brinquedos.
      roomEnvironmentRenderer.renderFurniture(ctx, this.arenaChest(), {
        assets:r.assets, environmentChest:r.environmentChest });
      // Ampliação exclusiva da protagonista, com os pés como referência estável.
      ctx.save(); ctx.translate(r.player.x, t.ground - battlePlayerJumpOffset(s,r.player,r.story.state.attackDirection));
      ctx.scale(BATTLE_PLAYER_VISUAL_SCALE, BATTLE_PLAYER_VISUAL_SCALE);
      ctx.translate(-r.player.x, -t.ground);
      const playerReaction = s.playerHitTime > 0;
      const reactionOffset = playerReaction ? s.playerHitDirection * Math.min(4, s.playerHitTime) : 0;
      ctx.translate(reactionOffset, 0);
      if (playerReaction && Math.floor(s.playerHitTime / 2) % 2 === 0) ctx.globalAlpha = 0.48;
      if (s.mode === 'DEFEAT') babyRenderer.renderPose(ctx, r.assets, 'lying_down', 0, r.player.x, t.ground, 80, r.player.facing === 'left' ? -1 : 1);
      else if (s.crouching) renderBattleCrouch(ctx,this.images.get(BATTLE_CROUCH_FRAME.file),r.player,s.attackTime,r.story.state.attackDirection);
      else if (!r.story.renderAttackSprite(ctx)) {
        const pose = playerReaction ? 'damage' : s.jump > 0 ? (s.jumpVelocity > 0 ? 'jump' : 'fall') : s.crouching ? 'crouch' : r.player.isMoving ? 'run' : 'idle';
        babyRenderer.renderPose(ctx, r.assets, pose, Math.floor(s.elapsed / 6), r.player.x, t.ground, 80, r.player.facing === 'left' ? -1 : 1);
        r.story.renderHeldObject(ctx);
      }
      ctx.restore();
      if (s.impact) this.renderImpact(ctx, s.impact);
    }
    ctx.restore();
    const ui = layout.scale, x = layout.safeLeft + 16 * ui, y = layout.hudBottom;
    ctx.fillStyle = 'rgba(25,16,38,.92)'; ctx.fillRect(layout.safeLeft, y - 26 * ui, layout.usableWidth, 90 * ui);
    ctx.font = `bold ${16 * ui}px system-ui`; ctx.fillStyle = '#fff2db'; ctx.textAlign = 'left';
    const hearts = (hp, max) => '♥'.repeat(hp) + '♡'.repeat(max - hp);
    ctx.fillText(`Menina ${hearts(s.player.hp, 3)}`, x, y);
    ctx.fillText(`${NAMES[s.enemy.actor]} ${hearts(s.enemy.hp, s.enemy.maxHp)} · ${Math.min(4, s.index + 1)}/4`, x, y + 24 * ui);
    if (s.transition) {
      const incoming = s.transition.incoming, outgoing = s.transition.outgoing;
      const text = incoming && outgoing ? `${NAMES[outgoing.actor]} volta · ${NAMES[incoming.actor]} entra`
        : incoming ? `${NAMES[incoming.actor]} entra na arena…` : 'Urso volta para a caixa…';
      ctx.textAlign = 'center'; ctx.fillText(text, layout.centerX, y + 48 * ui, layout.usableWidth - 24 * ui);
    } else if (s.enemy.state === 'ATTACK') {
      ctx.textAlign = 'center'; ctx.fillText(s.enemy.attack, layout.centerX, y + 48 * ui);
    }
    if (r.isTouchDevice || r.mobilePresentation) {
      const a = layout.action; ctx.fillStyle = '#593952'; ctx.beginPath(); ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2); ctx.fill();
      ctx.textAlign = 'center'; ctx.fillStyle = '#fff2db'; ctx.fillText('ESPADA', a.x, a.y + 6 * ui);
      if (r.touchState.active) {
        const p = r.touchState; ctx.fillStyle = 'rgba(255,240,210,.3)'; ctx.beginPath();
        ctx.arc(p.startX, p.startY, layout.joystickRadius, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(p.startX + p.vectorX * 40 * a.scale, p.startY + p.vectorY * 40 * a.scale, 20 * a.scale, 0, Math.PI * 2); ctx.fill();
      }
    }
    let message = this.error ? `Falha: ${this.error}` : !this.ready ? 'Carregando combate…' : s.mode === 'VICTORY' ? 'Todos os brinquedos foram derrotados!'
      : s.mode === 'DEFEAT' ? 'Seus corações acabaram.' : '';
    if (message) {
      ctx.fillStyle = 'rgba(25,16,38,.95)'; ctx.fillRect(layout.safeLeft, layout.centerY - 45 * ui, layout.usableWidth, 110 * ui);
      ctx.textAlign = 'center'; ctx.fillStyle = '#fff2db'; ctx.font = `${18 * ui}px system-ui`;
      ctx.fillText(message, layout.centerX, layout.centerY, layout.usableWidth - 24 * ui);
      if (['VICTORY', 'DEFEAT'].includes(s.mode) && s.ending >= 90)
        ctx.fillText('Pressione ataque para voltar ao início.', layout.centerX, layout.centerY + 32 * ui, layout.usableWidth - 24 * ui);
    }
    ctx.restore();
  }

  renderImpact(ctx, impact) {
    const progress = Math.min(1, impact.elapsed / impact.duration);
    const alpha = 1 - progress;
    const size = (impact.heavy ? 12 : 8) + progress * (impact.heavy ? 19 : 13);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = impact.heavy ? '#ffd27a' : '#fff2c2';
    ctx.lineWidth = impact.heavy ? 3 : 2;
    ctx.beginPath();
    ctx.arc(impact.x, impact.y, size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = impact.heavy ? '#ffb75e' : '#fff2c2';
    for (let index = 0; index < 8; index++) {
      const angle = index * Math.PI / 4;
      const distance = size + 3 + (index % 2) * 3;
      ctx.beginPath();
      ctx.arc(impact.x + Math.cos(angle) * distance,
        impact.y + Math.sin(angle) * distance, impact.heavy ? 2.6 : 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  snapshot() { return this.state ? JSON.parse(JSON.stringify(this.state)) : null; }
  restore(saved) {
    this.state = saved ? JSON.parse(JSON.stringify(saved)) : null;
    if (this.state) this.state.upHeld = false;
  }
}
