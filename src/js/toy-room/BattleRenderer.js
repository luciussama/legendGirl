import { BATTLE_TUNING, BATTLE_PLAYER_VISUAL_SCALE } from './BattleConfig.js';
import { arenaEnemyImpactEnd } from './ArenaCombatRules.js';
import { getMobileUILayout } from '../ui/MobileUILayout.js';
import { roomEnvironmentRenderer } from './RoomEnvironmentRenderer.js';
import { renderRocketPunch, renderBattleCrouch, BATTLE_CROUCH_FRAME, BATTLE_TRAIN_BODY, battlePlayerJumpOffset, laserProjection, renderTrainWalk } from './BattlePresentation.js';
import { babyRenderer } from '../entities/BabyRenderer.js';

const NAMES = { train: 'Trem', robot: 'Robô', dinosaur: 'Dinossauro', bear: 'Urso' };
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

/** Distribui as poses do Rush pelas janelas existentes, sem alterar a simulação. */
export function battleAnimationFrame(animation, enemy, duration, tuning = BATTLE_TUNING) {
  if (animation.loop) return Math.floor(enemy.elapsed / 7) % animation.frames.length;
  if (enemy.actor === 'dinosaur' && enemy.state === 'ATTACK' && enemy.attack === 'Rush' && animation.frames.length === 6) {
    const { windup, active, recovery } = tuning;
    if (enemy.elapsed < windup) return clamp(Math.floor(enemy.elapsed / windup * 2), 0, 1);
    if (enemy.elapsed < windup + active) return 2 + clamp(Math.floor((enemy.elapsed - windup) / active * 2), 0, 1);
    return 4 + clamp(Math.floor((enemy.elapsed - windup - active) / recovery * 2), 0, 1);
  }
  return clamp(Math.floor(enemy.elapsed / duration * animation.frames.length), 0, animation.frames.length - 1);
}

/** Apresenta o combate existente sem avançar a simulação. */
export function renderBattle(battle) {
  const r = battle.room, ctx = r.ctx, layout = getMobileUILayout(r.canvas), s = battle.state, t = battle.tuning;
  ctx.save(); ctx.clearRect(0, 0, r.canvas.width, r.canvas.height);
  const stageTop = layout.hudBottom + 72 * layout.scale;
  const stageBottom = layout.safeBottom - 16 * layout.scale;
  const frame = battle.presentation?.cameraFrame?.(layout);
  const scale = frame?.scale ?? Math.max(0.05, Math.min(layout.usableWidth / 1440, Math.max(1,stageBottom-stageTop) / 400));
  const shake = s.combatShake;
  const shakeProgress = shake ? shake.elapsed / shake.duration : 1;
  const shakeX = shake ? Math.sin(shake.elapsed * 2.7) * shake.strength * (1 - shakeProgress) : 0;
  const shakeY = shake ? Math.cos(shake.elapsed * 2.1) * shake.strength * 0.35 * (1 - shakeProgress) : 0;
  const ox = frame?.ox ?? layout.centerX - 800 * scale + shakeX * scale;
  const oy = (stageTop + stageBottom) / 2 - 550 * scale;
  const stageOy = frame?.oy ?? oy + shakeY * scale;
  ctx.save(); ctx.translate(ox, stageOy); ctx.scale(scale, scale);
  if (battle.presentation?.renderBackground) battle.presentation.renderBackground(ctx);
  else {
  roomEnvironmentRenderer.renderBackground(ctx, r.ROOM_W, r.ROOM_H, {
    assets: r.assets, environmentSheet: r.environmentFloorTile, environmentRug: r.environmentRug,
    environmentDoor: r.environmentDoor, environmentDetails: r.environmentDetails });
  for (const furniture of r.furniture.filter(item => item.id !== 'toy-chest')) roomEnvironmentRenderer.renderFurniture(ctx, furniture, {
    assets:r.assets,environmentChest:r.environmentChest,environmentTable:r.environmentTable });
  }
  if (battle.ready && !battle.error) {
    const drawEnemy = e => {
      battle.presentation?.renderEnemyPresence?.(ctx, e, e.y ?? t.ground);
      const pose = battle.enemyPose(e), animation = battle.manifest.actors[e.actor].animations[pose];
      const enemyTuning = battle.presentation ? { ...t, recovery: battle.presentation.enemies[e.actor].recovery } : t;
      const duration = e.state === 'ATTACK' ? (battle.presentation ? arenaEnemyImpactEnd(e, t) : t.windup + t.active) + enemyTuning.recovery : e.state === 'DEATH' ? t.death : e.state === 'HIT' ? t.hitRecovery : 48;
      const index = battleAnimationFrame(animation, e, duration, enemyTuning);
      const f = animation.frames[index], image = battle.images.get(f.file);
      const reference = battle.manifest.actors[e.actor].animations.Idle.frames[0];
      const height = {train:90,robot:100,dinosaur:100,bear:130}[e.actor] * (battle.presentation?.enemyScale ?? 1);
      const factor = f.displayScale * height / ((reference.height - 24) * reference.displayScale) * (e.transportScale ?? 1);
      const hitProgress = s.impact?.target === 'enemy' ? Math.min(1, s.impact.elapsed / 8) : 1;
      const reacting = battle.presentation && !e.carried && (e.state === 'HIT' || e.state === 'DEATH');
      // Reação apoiada nos pés durante a recuperação existente, inclusive junto às bordas.
      // Só a pintura inclina/comprime: posição, recuo físico e relógios não mudam.
      const reaction = reacting ? Math.max(0, 1 - e.elapsed / t.hitRecovery) : 0;
      const direction = Math.sign(e.knockbackVelocity || (s.impact?.target === 'enemy' ? s.impact.direction : 0) || -e.facing);
      const space = direction > 0 ? t.right - 40 - e.x : e.x - t.left - 40;
      const lean = reaction * clamp(space / 40, 0, 1);
      const recoil = reacting ? direction * Math.min(Math.max(0, space), 12 * reaction)
        : s.impact?.target === 'enemy' ? -e.facing * (1 - hitProgress) * 7 : 0;
      ctx.save();
      if (!battle.presentation && e.state === 'HIT' && Math.floor(e.elapsed / 2) % 2 === 0) ctx.globalAlpha = 0.8;
      ctx.translate(e.x + recoil, e.y ?? t.ground);
      if (reacting) { ctx.rotate(direction * .14 * lean); ctx.scale(1 + .07 * reaction, 1 - .09 * reaction); }
      ctx.scale(e.facing, 1);
      // O derrotado é transportado inerte; não representa caminhada congelada.
      if (e.carried) ctx.rotate(Math.sin(e.progress * Math.PI * 2) * 0.12);
      if (e.actor === 'train' && pose === 'Walk') {
        renderTrainWalk(ctx,battle.images.get(BATTLE_TRAIN_BODY.file),battle.images.get(animation.frames[0].file),e.elapsed,(e.transportScale ?? 1) * (battle.presentation?.enemyScale ?? 1));
      } else if (e.state === 'ATTACK' && e.attack === 'Rocket Punch' && e.elapsed >= 44 && e.elapsed < 90) {
        const armFrame = animation.frames[3];
        if (battle.presentation) {
          const heroScale = battle.presentation.enemyScale;
          ctx.save(); ctx.scale(heroScale,heroScale);
          renderRocketPunch(ctx,battle.images.get(armFrame.file),armFrame,reference,e.elapsed,((r.player.x-e.x)*e.facing+20)/heroScale);ctx.restore();
        } else renderRocketPunch(ctx, battle.images.get(armFrame.file), armFrame, reference, e.elapsed, (r.player.x - e.x) * e.facing,
          {state:s,player:r.player,attackDirection:r.story.state.attackDirection,enemyFacing:e.facing});
      } else ctx.drawImage(image, -f.anchor.x * factor, -f.anchor.y * factor, f.width * factor, f.height * factor);
      ctx.restore();
    };
    if (s.transition) {
      if (s.transition.outgoing) drawEnemy(battle.transitionPlacement(false));
      if (s.transition.incoming) drawEnemy(battle.transitionPlacement(true));
    } else if (s.mode !== 'VICTORY') drawEnemy(s.enemy);
    const e = s.enemy;
    // O efeito mostra a região ofensiva na mesma janela em que a colisão é ativa.
    if(!s.specialAttack && !s.transition && e.state==='ATTACK' && e.elapsed>=t.windup && e.elapsed<t.windup+t.active) {
      if(e.attack==='Laser Beam') {
        const beam=battle.presentation ? {start:40,end:340*(t.attackScale ?? 1),height:145} : laserProjection(s,r.player,e,r.story.state.attackDirection);
        ctx.strokeStyle='#ff6666';ctx.lineWidth=8;ctx.lineCap='butt';ctx.beginPath();
        ctx.moveTo(e.x+e.facing*beam.start,t.ground-beam.height);ctx.lineTo(e.x+e.facing*beam.end,t.ground-beam.height);ctx.stroke();
        ctx.strokeStyle='#fff2dd';ctx.lineWidth=3;ctx.stroke();
      } else if(e.attack==='Steam Blast') {
        ctx.fillStyle='rgba(255,241,214,.6)';
        for(let i=0;i<9;i++) {ctx.beginPath();ctx.arc(e.x+e.facing*(20+i*30)*(t.attackScale ?? 1),t.ground-45+Math.sin(e.elapsed*.3+i)*8,18+i*1.2,0,Math.PI*2);ctx.fill();}
      }
    }
    // A frente da caixa encobre a entrada/saída, sem dissolver os brinquedos.
    if (!battle.presentation) roomEnvironmentRenderer.renderFurniture(ctx, battle.arenaChest(), {
      assets:r.assets, environmentChest:r.environmentChest });
    battle.presentation?.renderForeground?.(ctx);
    if (battle.presentation?.renderPlayer) battle.presentation.renderPlayer(ctx, s, t.ground);
    else {
    // Ampliação exclusiva da protagonista, com os pés como referência estável.
    ctx.save(); ctx.translate(r.player.x, t.ground - battlePlayerJumpOffset(s,r.player,r.story.state.attackDirection));
    ctx.scale(BATTLE_PLAYER_VISUAL_SCALE, BATTLE_PLAYER_VISUAL_SCALE);
    ctx.translate(-r.player.x, -t.ground);
    const playerReaction = s.playerHitTime > 0;
    const reactionOffset = playerReaction ? s.playerHitDirection * Math.min(4, s.playerHitTime) : 0;
    ctx.translate(reactionOffset, 0);
    if (playerReaction && Math.floor(s.playerHitTime / 2) % 2 === 0) ctx.globalAlpha = 0.48;
    if (s.mode === 'DEFEAT') babyRenderer.renderPose(ctx, r.assets, 'lying_down', 0, r.player.x, t.ground, 80, r.player.facing === 'left' ? -1 : 1);
    else if (s.crouching && r.assets?.get('girl-v2-arena-base')) babyRenderer.renderPose(ctx, r.assets, 'sword_crouch', 0, r.player.x, t.ground, 80, r.player.facing === 'left' ? -1 : 1);
    else if (s.crouching) renderBattleCrouch(ctx,battle.images.get(BATTLE_CROUCH_FRAME.file),r.player,s.attackTime,r.story.state.attackDirection);
    else if (!r.story.renderAttackSprite(ctx)) {
      const pose = playerReaction ? 'damage' : s.jump > 0 ? (s.jumpVelocity > 0 ? 'jump' : 'fall') : s.crouching ? 'crouch' : r.player.isMoving ? 'run' : 'idle';
      babyRenderer.renderPose(ctx, r.assets, (r.assets?.get('girl-v2-arena-base') ? 'sword_' : '') + pose, Math.floor(s.elapsed / 6), r.player.x, t.ground, 80, r.player.facing === 'left' ? -1 : 1);
      r.story.renderHeldObject(ctx);
    }
    ctx.restore();
    }
    if (s.impact) battle.renderImpact(ctx, s.impact);
    battle.presentation?.renderFX?.(ctx);
  }
  ctx.restore();
  if (battle.presentation?.renderHUD) { battle.presentation.renderHUD(ctx, layout, s); ctx.restore(); return; }
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
  let message = battle.error ? `Falha: ${battle.error}` : !battle.ready ? 'Carregando combate…' : s.mode === 'VICTORY' ? 'Todos os brinquedos foram derrotados!'
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


export function renderBattleImpact(ctx, impact) {
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

