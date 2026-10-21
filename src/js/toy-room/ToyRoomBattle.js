import { updateArenaSpecial } from './ArenaSpecialAttack.js';
import { PlayerController } from './PlayerController.js';
import { loadBattleManifest, loadBattleImages } from './BattleAssets.js';
import { BATTLE_ORDER, BATTLE_TUNING, BATTLE_TRANSITION_DURATION } from './BattleConfig.js';
export { BATTLE_ORDER, BATTLE_PLAYER_VISUAL_SCALE, BATTLE_TUNING, BATTLE_TRANSITION_DURATION } from './BattleConfig.js';
import { selectArenaEnemyAttack, updateArenaEnemyAI } from './ArenaEnemyAI.js';
import { ARENA_SWORD, arenaEnemyImpactEnd, arenaEnemyGuarding } from './ArenaCombatRules.js';
import { rocketPunchTouchesPlayer } from './BattlePresentation.js';
import { renderBattle, renderBattleImpact } from './BattleRenderer.js';
export { battleAnimationFrame } from './BattleRenderer.js';

const ATTACKS = { train: ['Steam Blast', 'Front Charge'], robot: ['Laser Beam', 'Rocket Punch'],
  dinosaur: ['Bite', 'Rush'], bear: ['Bear Hug', 'Belly Charge', 'Toy Leap'] };
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

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
    this.tuning = BATTLE_TUNING;
    this.playerController = new PlayerController();
    this.state = null;
    this.images = new Map();
    this.manifest = null;
    this.error = null;
    this.ready = !loadAssets;
    this.readyPromise = loadAssets ? this.load().catch(error => { this.error = error.message; }) : Promise.resolve();
  }

  async load() {
    this.manifest = await loadBattleManifest();
    await loadBattleImages(this.manifest, this.images);
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
      crouching: false, guarding: false, player: { hp: 3, maxHp: 3 }, enemy: null, history: [], ending: 0,
      hitPause: 0, impact: null, combatShake: null, playerHitTime: 0, playerHitDirection: 0,
      specialUsed: false, specialAttack: null,
      playerStepTimer: 0, enemyStepTimer: 0, wasJumping: false };
    this.playCombatSound('arena_start');
    this.spawn();
    this.beginTransition(null);
    this.room.gameplayState = 'TOY_ROOM_BATTLE';
  }

  spawn() {
    this.state.transition = null;
    const s = this.state, actor = BATTLE_ORDER[s.index], maxHp = this.presentation?.enemies?.[actor]?.hp ?? (actor === 'bear' ? 4 : 2);
    s.enemy = { actor, hp: maxHp, maxHp, x: 1120, facing: -1, state: 'IDLE', elapsed: 0,
      attackIndex: 0, attack: null, landed: false, enrage: false, enrageShown: false,
      walkSoundTimer: 0 };
  }

  getEnemyCollisionDistance(actor) {
    const profile=this.presentation?.enemies?.[actor];
    if(profile) return 56+profile.bodyWidth/2+4;
    switch (actor) {
      case 'bear': return 58;
      case 'dinosaur': return 56;
      case 'robot': return 52;
      case 'train': return 54;
      default: return 54;
    }
  }

  getSwordRange(actor = this.state.enemy.actor) {
    return this.presentation
      ? Math.max(this.tuning.swordRange, (this.getEnemyCollisionDistance(actor) + 40) * (this.tuning.swordContactScale ?? 1))
      : this.tuning.swordRange;
  }

  swordContactPoint(dx, facing) {
    const s = this.state, profile = this.presentation?.enemies?.[s.enemy.actor];
    const reach = (s.crouching ? 118 : 165) * (this.presentation ? this.tuning.swordContactScale ?? 1.1 : 1.1);
    const surface = Math.max(70, Math.abs(dx) - (profile?.bodyWidth ?? 0) / 2 + 35);
    return { x: this.room.player.x + facing * Math.min(reach, surface),
      y: this.tuning.ground - (s.crouching ? 52 : 112) - s.jump };
  }

  resolveActorBodies(side) {
    const s=this.state,e=s?.enemy,p=this.presentation?.enemies?.[e?.actor];
    if(!p||s.transition||e.hp<=0||s.jump>=p.bodyHeight)return;
    const player=this.room.player,distance=this.getEnemyCollisionDistance(e.actor);
    if(side*(e.x-player.x)>=distance)return;
    const middle=(e.x+player.x)/2;
    player.x=middle-side*distance/2;e.x=middle+side*distance/2;
    const low=Math.min(player.x-56,e.x-p.bodyWidth/2),high=Math.max(player.x+56,e.x+p.bodyWidth/2);
    const shift=low<this.tuning.left?this.tuning.left-low:high>this.tuning.right?this.tuning.right-high:0;
    player.x+=shift;e.x+=shift;
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
    const origin = this.presentation?.transportOrigin?.();
    const boxX = origin?.x ?? chest.x + chest.w / 2, boxY = origin?.y ?? chest.y + 100;
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
    const touchButtons = r.arenaTouchButtons ?? {};
    const touchVector=[...(r.arenaTouchPointers?.values()??[])].find(value=>value&&typeof value==='object');
    if(touchVector){x=touchVector.x;y=touchVector.y;}
    else if (touchButtons.left || touchButtons.right)
      x = Number(touchButtons.right) - Number(touchButtons.left);
    return {
      x: Math.abs(x) > 0.18 ? x : 0,
      up: y < -0.35 || Boolean(r.gamepadState.jump || touchButtons.up),
      down: y > 0.35 || Boolean(touchButtons.down)
    };
  }

  attack() {
    const s = this.state;
    if (!s || !this.ready || this.error) return false;
    if (s.mode === 'VICTORY' || s.mode === 'DEFEAT') {
      if (s.ending < 90) return false;
      this.room.onReturnToTitle?.();
      return true;
    }
    if (s.mode !== 'BATTLE' || s.transition || s.specialAttack || s.cooldown > 0
      || (this.presentation && s.playerHitTime > 0)) return false;
    this.faceEnemy();
    if (!this.room.story.attack()) return false;
    s.guarding = false;
    s.cooldown = this.tuning.swordCooldown;
    s.attackTime = this.tuning.swordDuration ?? 12;
    s.swordHit = false;
    this.playCombatSound('player_attack');
    return true;
  }

  /** A direção da arena acompanha o adversário, inclusive quando ele surge do outro lado. */
  faceEnemy() {
    const s = this.state, player = this.room.player;
    if (!this.presentation || !s?.enemy || s.enemy.x === player.x) return;
    player.facing = s.enemy.x > player.x ? 'right' : 'left';
    const direction = player.facing === 'right' ? 1 : -1;
    this.room.story.state.attackDirection = direction;
    if (s.playerAnimation) s.playerAnimation.attackDirection = direction;
  }

  playCombatSound(sound) {
    const s = this.state;
    if (this.presentation?.onSound) this.presentation.onSound(sound);
    else this.room.audio?.playCombatSound?.(sound);
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
    enemy.lastAIChoice = attack;
    enemy.recentAIChoices = [...(enemy.recentAIChoices ?? []), attack].slice(-2);
    enemy.attackIndex++;
    enemy.landed = false;
    enemy.blocked = false;
    this.setEnemyState('ATTACK');
    const sounds = {
      'Steam Blast': 'train_steam', 'Front Charge': 'train_charge',
      'Laser Beam': 'robot_laser', 'Rocket Punch': 'robot_punch',
      Bite: 'dinosaur_bite', Rush: 'dinosaur_rush',
      'Bear Hug': 'bear_hug', 'Belly Charge': 'bear_charge', 'Toy Leap': 'bear_leap'
    };
    this.playCombatSound(sounds[attack]);
  }

  /** A resposta tem preparação visível; a abertura vem após o impacto, nunca por insistência. */
  enemyGuarding() {
    return Boolean(this.presentation && arenaEnemyGuarding(this.state.enemy, this.tuning));
  }

  beginEnemyResponse() {
    const e = this.state.enemy;
    e.facing = this.room.player.x < e.x ? -1 : 1;
    e.responseAttack = true;
    const distance = Math.abs(this.room.player.x - e.x);
    this.beginEnemyAttack(selectArenaEnemyAttack(this, distance, ATTACKS[e.actor]) ?? ATTACKS[e.actor][0]);
  }

  startImpact(target, x, y, direction, heavy) {
    const s = this.state;
    s.impact = { target, x, y, direction, elapsed: 0, duration: 14, heavy };
    s.combatShake = { elapsed: 0, duration: 10, strength: this.presentation ? (heavy ? 5 : 3) : heavy ? 4 : 2 };
    s.hitPause = this.presentation ? (heavy ? 5 : 3) : heavy ? 2 : 1;
    this.presentation?.onImpact?.(x, y, heavy);
    s.history.push({ event: 'IMPACT', target, frame: Math.floor(s.elapsed), heavy });
  }

  update(dt) {
    if (!this.state) return;
    // Subpassos limitados preservam as janelas de colisão durante uma atualização lenta.
    let remaining = clamp(Number.isFinite(dt) ? dt : 1, 0, 12);
    while (remaining > 0) {
      if (this.state.specialAttack) {
        const step = Math.min(1, remaining);
        updateArenaSpecial(this, step);
        remaining -= step;
      } else if (this.state.hitPause > 0) {
        const paused = Math.min(1, remaining, this.state.hitPause);
        this.state.hitPause -= paused;
        remaining -= paused;
      } else {
        const step = Math.min(1, remaining);
        const enemy=this.state.enemy,side=(enemy.x-this.room.player.x)>=0?1:-1,previousX=enemy.x;
        this.bodySide=side;
        this.step(step);
        this.resolveActorBodies(side);
        this.faceEnemy();
        if(this.presentation&&!this.state.transition&&enemy===this.state.enemy&&
            ['APPROACH','RETREAT','EVADE','ATTACK'].includes(enemy.state)&&Math.abs(enemy.x-previousX)>0.05) {
          enemy.walkSoundTimer=Math.max(0,(enemy.walkSoundTimer||0)-step);
          if(enemy.walkSoundTimer===0){this.playCombatSound(`${enemy.actor}_walk`);enemy.walkSoundTimer=this.presentation.enemies[enemy.actor].stepTime;}
        }
        this.presentation?.updateAnimation?.(step);
        remaining -= step;
      }
    }
  }

  step(dt) {
    const s = this.state, r = this.room, e = s.enemy;
    const profile=this.presentation?.enemies?.[e.actor];
    const t=profile?{...this.tuning,recovery:profile.recovery}:this.tuning;
    if (!this.ready || this.error) return;
    this.faceEnemy();
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
      s.guarding = false;
      return;
    }
    s.elapsed += dt;
    s.cooldown = Math.max(0, s.cooldown - dt);
    s.immunity = Math.max(0, s.immunity - dt);
    s.attackTime = Math.max(0, s.attackTime - dt);
    r.story.state.attackElapsed = s.attackTime;
    this.playerController.update(this, dt);
    e.elapsed += dt;
    if(this.presentation)this.resolveActorBodies(this.bodySide??(r.player.x<=e.x?1:-1));
    const aiHandled=this.presentation&&updateArenaEnemyAI(this,dt);
    // Na arena, corpos apenas se separam: encostar ou surgir perto não é um golpe.
    // O caminho legado conserva suas regras próprias de contato.
    if (!this.presentation && e && e.hp > 0 && e.state !== 'DEATH' && e.state !== 'HIT' && e.state !== 'ATTACK' && e.state !== 'RETREAT' && e.state !== 'EVADE' && !s.transition && s.jump < 60) {
      const minDist = this.getEnemyCollisionDistance(e.actor);
      if (Math.abs(r.player.x - e.x) <= minDist + 2 && s.immunity === 0) {
        transferHeart(s.player, e);
        s.immunity = t.immunity;
        s.history.push({ event: 'ENEMY_HIT', enemy: e.actor, playerHp: s.player.hp, enemyHp: e.hp, contact: true });
        s.playerHitTime = 22;
        s.playerHitDirection = r.player.x <= e.x ? -1 : 1;
        s.playerKnockback = t.knockbackDistance ? t.knockbackDistance * 0.18 / (1 - Math.pow(0.82, 21)) : 11;
        s.attackTime = 0;
        r.story.state.attackElapsed = 0;
        s.crouching = false;
        const heavy = e.actor === 'bear';
        this.startImpact('player', r.player.x, t.ground - 40, s.playerHitDirection, heavy);
        this.playCombatSound('player_hit');
        this.playCombatSound('heart_loss');
        this.playCombatSound('heart_gain');
        if (s.player.hp === 0) {
          this.playCombatSound('player_death');
          this.playCombatSound('defeat');
          s.mode = 'DEFEAT'; s.ending = 0; r.clearInput(); return;
        }
      }
    }
    const swordDuration = t.swordDuration ?? ARENA_SWORD.duration;
    const swordActive = this.presentation
      ? s.attackTime <= swordDuration - (t.swordWindup ?? ARENA_SWORD.windup)
        && s.attackTime > swordDuration - (t.swordWindup ?? ARENA_SWORD.windup) - (t.swordActive ?? ARENA_SWORD.active)
      : s.attackTime > 0 && s.attackTime <= 8;
    if (swordActive && !s.swordHit && e.hp > 0 && !(this.presentation && e.state === 'ENRAGE')) {
      const dx = e.x - r.player.x, facing = r.story.state.attackDirection;
      const swordRange = this.getSwordRange(e.actor);
      if (dx * facing >= -20 && Math.abs(dx) < swordRange && s.jump < 85) {
        s.swordHit = true;
        if (this.enemyGuarding()) {
          s.cooldown = Math.max(s.cooldown, t.blockRecovery ?? ARENA_SWORD.blockRecovery);
          s.history.push({ event: 'SWORD_BLOCKED', enemy: e.actor, frame: Math.floor(s.elapsed) });
          const contact = this.swordContactPoint(dx, facing);
          this.presentation.onBlock?.(contact.x, contact.y, facing);
          this.playCombatSound('sword_block');
        } else {
          transferHeart(e, s.player);
          e.pressureChain = 0;
          s.history.push({ event: 'PLAYER_HIT', enemy: e.actor, playerHp: s.player.hp, enemyHp: e.hp });
          const contact = this.presentation ? this.swordContactPoint(dx, facing) : { x: (r.player.x + e.x) / 2, y: t.ground - 42 };
          const impactX = contact.x, impactY = contact.y;
          this.startImpact('enemy', impactX, impactY, facing, e.actor === 'bear');
          if (this.presentation) this.playCombatSound('sword_impact');
          this.playCombatSound(`${e.actor}_hit`);
          this.playCombatSound('heart_gain');
          this.playCombatSound('heart_loss');
          if (e.hp === 0) this.playCombatSound(`${e.actor}_death`);
          this.setEnemyState(e.hp === 0 ? 'DEATH' : 'HIT');
          e.knockbackVelocity = facing * (t.knockbackDistance ? t.knockbackDistance * 0.15 / (1 - Math.pow(0.85, t.hitRecovery + 1)) : e.actor === 'bear' ? 8.5 : 11.5);
          if (e.hp === 1 && e.actor === 'bear') e.enrage = true;
        }
      }
    }
    if (e.state === 'DEATH') {
      if (e.knockbackVelocity) {
        const travel = t.knockbackDistance ? (1 - Math.pow(0.85, dt)) / 0.15 : dt;
        e.x = clamp(e.x + e.knockbackVelocity * travel, t.left + 40, t.right - 40);
        e.knockbackVelocity *= Math.pow(0.85, dt);
        if (Math.abs(e.knockbackVelocity) < 0.1) e.knockbackVelocity = 0;
      }
      if (e.elapsed >= t.death) {
        s.history.push({ event: 'DEFEATED', enemy: e.actor });
        ++s.index;
        if (s.index < BATTLE_ORDER.length) this.spawn();
        this.beginTransition(e);
      }
      return;
    }
    if (e.state === 'HIT') {
      if (e.knockbackVelocity) {
        const travel = t.knockbackDistance ? (1 - Math.pow(0.85, dt)) / 0.15 : dt;
        e.x = clamp(e.x + e.knockbackVelocity * travel, t.left + 40, t.right - 40);
        e.knockbackVelocity *= Math.pow(0.85, dt);
        if (Math.abs(e.knockbackVelocity) < 0.1) e.knockbackVelocity = 0;
      }
      if (e.elapsed >= t.hitRecovery) {
        e.knockbackVelocity = 0;
        if (profile && e.actor !== 'train') this.beginEnemyResponse();
        else this.setEnemyState('RETREAT');
      }
      return;
    }
    if(aiHandled)return;
    if (e.enrage && !e.enrageShown && e.state !== 'ATTACK') {
      e.enrageShown = true; this.setEnemyState('ENRAGE');
    }
    if (e.state === 'ENRAGE') { if (e.elapsed >= 48) this.setEnemyState('APPROACH'); return; }
    const dx = r.player.x - e.x, distance = Math.abs(dx);
    if (e.state !== 'ATTACK') e.facing = dx < 0 ? -1 : 1;
    if (e.state === 'IDLE') { if (e.elapsed >= (profile?.idleTime??45)) this.setEnemyState('APPROACH'); }
    else if (e.state === 'APPROACH') {
      const attacks = ATTACKS[e.actor];
      const attack = selectArenaEnemyAttack(this, distance, attacks) ?? attacks[e.attackIndex % attacks.length];
      const reach = Math.max((['Steam Blast', 'Laser Beam', 'Rocket Punch'].includes(attack) ? 270 : 125) * (t.attackScale ?? 1),this.presentation?this.getEnemyCollisionDistance(e.actor)+45:0);
      if (distance > reach) {
        e.x = clamp(e.x + e.facing * (this.presentation?.enemies?.[e.actor]?.speed ?? (e.enrage ? 2.6 : 2)) * (this.presentation && e.enrage ? 1.25 : 1) * dt, t.left + 40, t.right - 40);
        if (!this.presentation && s.jump <= 55) {
          const minDist = this.getEnemyCollisionDistance(e.actor);
          if (e.x > r.player.x && e.x < r.player.x + minDist) e.x = r.player.x + minDist;
          else if (e.x < r.player.x && e.x > r.player.x - minDist) e.x = r.player.x - minDist;
        }
        if(!this.presentation)e.walkSoundTimer = Math.max(0, e.walkSoundTimer - dt);
        if (!this.presentation && e.walkSoundTimer === 0) {
          this.playCombatSound(`${e.actor}_walk`);
          e.walkSoundTimer = 22;
        }
      } else this.beginEnemyAttack(attack);
    } else if (e.state === 'RETREAT') {
      e.x = clamp(e.x - e.facing * 1.5 * dt, t.left + 40, t.right - 40);
      if (e.elapsed >= (profile?.retreatTime??30)) this.setEnemyState('IDLE');
    } else if (e.state === 'ATTACK') {
      const impactEnd = arenaEnemyImpactEnd(e, t);
      // Um erro de defesa permite só uma continuação, com nova antecipação completa.
      if (profile && profile.pressureChain !== false && e.actor !== 'train' && e.landed && e.elapsed >= impactEnd && !e.pressureChain) {
        e.pressureChain = 1;
        this.beginEnemyResponse();
        return;
      }
      const active = e.elapsed >= t.windup && e.elapsed < t.windup + t.active;
      const charge = ['Front Charge', 'Rush', 'Belly Charge'].includes(e.attack);
      if (active && charge) {
        e.x = clamp(e.x + e.facing * (this.presentation?.enemies?.[e.actor]?.chargeSpeed ?? 5) * dt, t.left + 40, t.right - 40);
        if (!this.presentation && s.jump <= 55) {
          const minDist = this.getEnemyCollisionDistance(e.actor);
          if (e.x > r.player.x && e.x < r.player.x + minDist) e.x = r.player.x + minDist;
          else if (e.x < r.player.x && e.x > r.player.x - minDist) e.x = r.player.x - minDist;
        }
      }
      const damaging = e.attack === 'Toy Leap' ? e.elapsed >= 84 && e.elapsed < 96 : active;
      if (damaging && !e.landed && !e.blocked && s.immunity === 0) {
        const range = Math.max((e.attack === 'Laser Beam' ? 340 : e.attack === 'Rocket Punch' ? 280 : e.attack === 'Steam Blast' ? 280 : e.attack === 'Toy Leap' ? 118 : 110) * (t.attackScale ?? 1),this.presentation?this.getEnemyCollisionDistance(e.actor)+15:0);
        const signed = (r.player.x - e.x) * e.facing;
        const dodge = this.presentation?.enemyContact ? !this.presentation.enemyContact(s,e) : s.jump > 65 || (s.crouching && e.attack === 'Laser Beam');
        const rocketContact = e.attack === 'Rocket Punch' && this.manifest && !this.presentation
          ? rocketPunchTouchesPlayer(
            this.manifest.actors.robot.animations['Rocket Punch'].frames[3],
            this.manifest.actors.robot.animations.Idle.frames[0], e.elapsed, signed,
            {state:s,player:r.player,attackDirection:r.story.state.attackDirection,enemyFacing:e.facing})
          : null;
        const inRange = e.attack === 'Rocket Punch' && rocketContact !== null
          ? signed >= -35 && rocketContact
          : signed >= -35 && signed < range;
        if (!dodge && inRange) {
          if (this.presentation && s.guarding) {
            e.blocked = true;
            const facing = r.player.facing === 'right' ? 1 : -1;
            this.presentation.onBlock?.(r.player.x + facing * 85, t.ground - 110);
            this.playCombatSound('sword_block');
            s.history.push({ event: 'PLAYER_BLOCK', enemy: e.actor, frame: Math.floor(s.elapsed) });
          } else {
            e.landed = true;
            transferHeart(s.player, e);
            s.immunity = t.immunity;
            s.history.push({ event: 'ENEMY_HIT', enemy: e.actor, playerHp: s.player.hp, enemyHp: e.hp });
            const heavy = e.actor === 'bear';
            s.playerHitTime = 22;
            s.playerHitDirection = e.facing;
            s.playerKnockback = t.knockbackDistance ? t.knockbackDistance * 0.18 / (1 - Math.pow(0.82, 21)) : 11;
            s.attackTime = 0;
            r.story.state.attackElapsed = 0;
            s.crouching = false;
            this.startImpact('player', r.player.x, t.ground - 40, e.facing, heavy);
            this.playCombatSound('player_hit');
            this.playCombatSound('heart_loss');
            this.playCombatSound('heart_gain');
            if (s.player.hp === 0) {
              this.playCombatSound('player_death');
              this.playCombatSound('defeat');
              s.mode = 'DEFEAT'; s.ending = 0; r.clearInput(); return;
            }
          }
        }
      }
      const attackEnd = (profile ? impactEnd : t.windup + t.active) + t.recovery;
      if (e.elapsed >= attackEnd) {
        e.responseAttack = false;
        e.pressureChain = 0;
        this.setEnemyState('RETREAT');
      }
    }
  }

  enemyPose(e = this.state.enemy) {
    return e.state === 'DEATH' ? 'Death' : e.state === 'HIT' ? 'Hit' : e.state === 'ENRAGE' ? 'Enrage'
      : e.state === 'ATTACK' ? e.attack : ['APPROACH', 'RETREAT', 'EVADE'].includes(e.state) ? 'Walk' : 'Idle';
  }

  render() { return renderBattle(this); }

  renderImpact(ctx, impact) { return renderBattleImpact(ctx, impact); }

  snapshot() { return this.state ? JSON.parse(JSON.stringify(this.state)) : null; }
  restore(saved) {
    this.state = saved ? JSON.parse(JSON.stringify(saved)) : null;
    if (this.state) { this.state.upHeld = false; this.state.guarding = false; }
  }
}
