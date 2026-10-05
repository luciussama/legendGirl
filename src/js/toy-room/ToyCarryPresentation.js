import { babyRenderer } from '../entities/BabyRenderer.js';
import { OFFICIAL_FRAMES } from '../assets/officialCharacter.js';
import { toyRenderer } from './ToyRenderer.js';

// Dimensões visuais próprias: não participam de colisões, coleta ou movimento.
export const CARRY_PROFILES = Object.freeze({
  teddy: { scale: 0.32, x: 31, bottom: 52 },
  train: { scale: 0.40, x: 36, bottom: 34 },
  robot: { scale: 0.48, x: 29, bottom: 26 },
  bunny: { scale: 0.42, x: 31, bottom: 26 },
  duck: { scale: 0.55, x: 31, bottom: 22 },
  blocks: { scale: 0.55, x: 29, bottom: 22 },
  drum: { scale: 0.65, x: 32, bottom: 16 },
  jack: { scale: 0.48, x: 29, bottom: 26 }
});

/** Composição da pose, objeto apoiado e dedos em primeiro plano. */
export function renderToyCarry(ctx, player, options = {}) {
  const image = options.assets?.get('toy-room-carry-pose-v1');
  const toy = player.carriedItem;
  if (!image || !toy) {
    // Durante uma falha de recurso, preserva a visibilidade da carga anterior.
    babyRenderer.renderPose(ctx, options.assets, toy ? 'collect' : player.isMoving ? 'run' : 'idle',
      Math.floor((player.animTime || 0) * 0.9), player.x, player.y + 28, 80,
      player.facing === 'left' ? -1 : 1);
    if (toy) toyRenderer.renderToy(ctx, toy, player.x, player.y, true, 0, options);
    return;
  }
  const profile = CARRY_PROFILES[toy.type] || CARRY_PROFILES.teddy;
  const bob = player.isMoving ? Math.sin((player.animTime || 0) * 1.8) * 0.7 : 0;
  ctx.save();
  ctx.translate(player.x, player.y + bob);
  ctx.scale(player.facing === 'left' ? -1 : 1, 1);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const poseScale = 80 / 256;
  const forearmWidth = 72 * poseScale + 4;
  const drawPose = bottom => {
    // Pequena extensão dos antebraços mantém as palmas sob a carga sem tocar o cabelo.
    ctx.drawImage(image, 0, 0, 167, 120, -27, -52, 167 * poseScale, 120 * poseScale);
    ctx.drawImage(image, 0, 120, 95, 31, -27, -52 + 120 * poseScale, 95 * poseScale, 31 * poseScale);
    ctx.drawImage(image, 95, 120, 72, 31, -27 + 95 * poseScale, -52 + 120 * poseScale, forearmWidth, 31 * poseScale);
    ctx.drawImage(image, 0, 151, 167, bottom - 151, -27, -52 + 151 * poseScale, 167 * poseScale, (bottom - 151) * poseScale);
  };

  // As pernas oficiais continuam animadas; a parte superior sustenta a carga.
  if (player.isMoving) {
    const frame = OFFICIAL_FRAMES.run[Math.floor((player.animTime || 0) * 0.9) % OFFICIAL_FRAMES.run.length];
    const atlas = options.assets?.get('official-character');
    const scale = 80 / 50 + 1 / frame.h;
    if (atlas) ctx.drawImage(atlas, frame.x, frame.y + frame.h - 14, frame.w, 14,
      -frame.anchorX * scale, 28 - 14 * scale, frame.w * scale, 14 * scale);
    drawPose(202);
  } else {
    drawPose(256);
  }

  // A base de cada brinquedo repousa nas palmas, fora da silhueta do rosto.
  ctx.save();
  ctx.translate(profile.x, -8 - profile.bottom * profile.scale);
  ctx.scale(profile.scale, profile.scale);
  toyRenderer.renderToy(ctx, { ...toy, x: 0, y: 0, isCarried: true }, 0, 0, true,
    0, options);
  ctx.restore();

  // Reutiliza os dedos pintados da pose para mostrar contato sobre a borda inferior.
  ctx.drawImage(image, 126, 139, 38, 11,
    -27 + 95 * poseScale + 31 * forearmWidth / 72, -52 + 139 * poseScale,
    38 * forearmWidth / 72, 11 * poseScale);
  ctx.restore();
}
