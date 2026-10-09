import { babyRenderer } from '../entities/BabyRenderer.js';
import { toyRenderer } from './ToyRenderer.js';

// Dimensões visuais próprias: não participam de colisões, coleta ou movimento.
export const CARRY_PROFILES = Object.freeze({
  teddy: { scale: 0.32 },
  train: { scale: 0.40 },
  robot: { scale: 0.48 },
  bunny: { scale: 0.42 },
  duck: { scale: 0.55 },
  blocks: { scale: 0.55 },
  drum: { scale: 0.65 },
  jack: { scale: 0.48 }
});

/** Mantém a personagem oficial inteira e compõe o brinquedo em camada própria. */
export function renderToyCarry(ctx, player, options = {}) {
  const toy = player.carriedItem;
  if (!toy) return;

  const frameIndex = Math.floor((player.animTime || 0) * 0.9);
  const facing = player.facing === 'left' ? -1 : 1;
  const bob = player.isMoving ? Math.sin((player.animTime || 0) * 1.8) * 0.7 : 0;
  babyRenderer.renderPose(ctx, options.assets, player.isMoving ? 'run' : 'idle',
    frameIndex, player.x, player.y + 28 + bob, 80, facing);

  const profile = CARRY_PROFILES[toy.type] || CARRY_PROFILES.teddy;
  ctx.save();
  ctx.translate(player.x, player.y + bob);
  ctx.scale(facing, 1);

  ctx.save();
  ctx.translate(0, -8);
  ctx.scale(profile.scale, profile.scale);
  toyRenderer.renderToy(ctx, { ...toy, x: 0, y: 0, isCarried: true }, 0, 0, true,
    0, options);
  ctx.restore();
  ctx.restore();
}
