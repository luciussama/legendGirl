import { GIRL_V2_FRAMES, GIRL_V2_REFERENCE_HEIGHT } from '../assets/illustratedGirl.js';
import { dialogueRenderer } from '../ui/DialogueRenderer.js';
import { getMobileUILayout } from '../ui/MobileUILayout.js';
import { renderPoeticNarration } from '../narrative/PoeticNarrator.js';

const SWORD_ATTACK_FRAME_SIZE = { width: 144, height: 192, y: 288 };
const SWORD_ATTACK_FRAME_COUNT = 8;

/** Resolve os mesmos oito recortes; não gera nem substitui arte. */
export function createStoryAttackFrames(assets) {
  const illustrated = assets?.get('girl-v2-arena-acoes');
  if (illustrated) return [0,1,1,3,3,2,4,4].map(index => ({
    image: illustrated, illustrated: GIRL_V2_FRAMES.sword_attack[index]
  }));
  return Array.from({ length: SWORD_ATTACK_FRAME_COUNT }, (_, index) =>
    assets?.getRegion('toy-room-sword-attack-sheet', {
      x: index * SWORD_ATTACK_FRAME_SIZE.width,
      y: SWORD_ATTACK_FRAME_SIZE.y,
      width: SWORD_ATTACK_FRAME_SIZE.width,
      height: SWORD_ATTACK_FRAME_SIZE.height
    }) || null);
}

export function drawToySword(ctx, x, y, angle, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#765139';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#e8c990';
  ctx.beginPath();
  ctx.moveTo(-4, 1);
  ctx.lineTo(-5, -25);
  ctx.lineTo(0, -41);
  ctx.lineTo(5, -25);
  ctx.lineTo(4, 1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#83c5c8';
  ctx.beginPath();
  ctx.roundRect(-12, -2, 24, 5, 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#c77768';
  ctx.beginPath();
  ctx.roundRect(-3, 2, 6, 12, 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/** Desenha com os dados do quadro, sem avançar a narrativa ou alterar os atores. */
export function renderStoryWorldObject(ctx, state) {
  if (state.sword?.visible) drawToySword(ctx, state.sword.x, state.sword.y, 0.6, 0.8);
}

export function renderStoryAttackSprite(ctx, { state, player, attackFrames, attackDuration }) {
  if (!state.swordEquipped || state.attackElapsed <= 0) return false;
  const progress = 1 - state.attackElapsed / attackDuration;
  const frameIndex = Math.min(SWORD_ATTACK_FRAME_COUNT - 1,
    Math.floor(progress * SWORD_ATTACK_FRAME_COUNT));
  const frame = attackFrames[frameIndex];
  if (!frame) return false;

  if (frame.illustrated) {
    const f = frame.illustrated, scale = 80 / GIRL_V2_REFERENCE_HEIGHT;
    ctx.save(); ctx.translate(player.x, player.y + 28);
    if (state.attackDirection < 0) ctx.scale(-1, 1);
    ctx.drawImage(frame.image, f.x, f.y, f.w, f.h, -f.anchorX * scale, -f.anchorY * scale, f.w * scale, f.h * scale);
    ctx.restore(); return true;
  }
  const width = 72;
  const height = 96;
  ctx.save();
  ctx.translate(player.x, 0);
  if (state.attackDirection < 0) ctx.scale(-1, 1);
  ctx.drawImage(frame, -width / 2, player.y + 28 - height, width, height);
  ctx.restore();
  return true;
}

export function renderStoryHeldObject(ctx, { state, player, attackFrames, attackDuration }) {
  if (!state.swordEquipped && state.investigationStage !== 'PICKUP') return;
  if (renderStoryAttackSprite(ctx, { state, player, attackFrames, attackDuration })) return;
  // Nas novas poses a espada já está pintada nas mãos, inclusive em repouso/corrida.
  if (attackFrames.some(frame => frame?.illustrated)) return;

  const elapsed = state.attackElapsed > 0
    ? attackDuration - state.attackElapsed
    : 0;
  const direction = state.swordEquipped
    ? (state.attackElapsed > 0
      ? (state.attackDirection < 0 ? Math.PI : 0) +
        (elapsed / attackDuration - 0.5) * 1.7 * state.attackDirection
      : (player.facing === 'left' ? Math.PI : 0))
    : -Math.PI / 2;
  const handX = player.x + Math.cos(direction) * 24;
  const handY = player.y - 13 + Math.sin(direction) * 12;
  const shoulderX = player.x + Math.cos(direction) * 9;
  const shoulderY = player.y - 13 + Math.sin(direction) * 5;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#95613f';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(shoulderX, shoulderY);
  ctx.lineTo(handX, handY);
  ctx.stroke();
  ctx.strokeStyle = '#e7b58b';
  ctx.lineWidth = 6;
  ctx.stroke();
  drawToySword(ctx, handX, handY, direction + Math.PI / 2, 0.72);
  ctx.restore();
}

export function renderStoryBeat(ctx, canvas, beat, { mobile, assets, tick }) {
  if (!beat.speaker) {
    renderPoeticNarration(ctx, canvas, beat.text, { separateScene: true });
    return;
  }
  const layout = mobile ? getMobileUILayout(canvas) : null;
  // Não reprojeta a cena: os controles mantêm as coordenadas usadas pelo input.
  const bottom = layout ? layout.action.y - layout.action.radius - 12 * layout.action.scale : undefined;
  dialogueRenderer.renderDialogue(ctx, canvas, {
    speaker: beat.speaker === 'NANDA' ? 'fairy' : 'baby',
    speakerName: beat.speaker, text: beat.text, tick
  }, { assets, separateScene: false, bottom });
}
