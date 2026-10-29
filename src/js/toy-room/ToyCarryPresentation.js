import { babyRenderer } from '../entities/BabyRenderer.js';
import { GIRL_V2_FRAMES, GIRL_V2_REFERENCE_HEIGHT } from '../assets/illustratedGirl.js';
import { toyRenderer } from './ToyRenderer.js';
import { drawGirlLocomotion, girlLocomotionDistance, sampleGirlLocomotion } from '../entities/GirlLocomotion.js';

// Medidas exclusivamente visuais; não alteram coleta, peso, velocidade ou colisões.
export const CARRY_PROFILES = Object.freeze({
  teddy: { scale: .32, maxWidth: 22, maxHeight: 27 },
  train: { scale: .40, maxWidth: 31, maxHeight: 24 },
  robot: { scale: .48, maxWidth: 20, maxHeight: 27 },
  bunny: { scale: .42, maxWidth: 20, maxHeight: 27 },
  duck: { scale: .55, maxWidth: 25, maxHeight: 23 },
  blocks: { scale: .55, maxWidth: 23, maxHeight: 26 },
  drum: { scale: .65, maxWidth: 25, maxHeight: 20 },
  jack: { scale: .48, maxWidth: 22, maxHeight: 27 }
});
const caches = new WeakMap();

/** Recorta a arte efetiva do item uma vez por carregador; margens transparentes não deslocam a pegada. */
function carriedSprite(toy, options) {
  if (typeof document === 'undefined' || !options.assets) return null;
  let cache = caches.get(options.assets);
  if (!cache) { cache = new Map(); caches.set(options.assets, cache); }
  if (cache.has(toy.type)) return cache.get(toy.type);
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  toyRenderer.renderToy(ctx, { ...toy, x: 128, y: 128, isCarried: true, isOrganized: false }, 128, 128, true, 0, options);
  const pixels = ctx.getImageData(0, 0, 256, 256).data;
  let x0 = 256, y0 = 256, x1 = 0, y1 = 0;
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) if (pixels[(y * 256 + x) * 4 + 3] >= 16) {
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + 1); y1 = Math.max(y1, y + 1);
  }
  const sprite = x1 > x0 ? { image: canvas, x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
  cache.set(toy.type, sprite); return sprite;
}

/** Corpo e braço distante → brinquedo apoiado nas palmas → antebraço e dedos próximos. */
export function renderToyCarry(ctx, player, options = {}) {
  const toy = player.carriedItem; if (!toy) return;
  const facing = player.facing === 'left' ? -1 : 1;
  const moving = player.isMoving || player.runBlend > 0;
  const frameIndex = 0;
  const frame = GIRL_V2_FRAMES.carry[frameIndex], image = options.assets?.get(frame.key);
  if (!image) {
    // A seleção anterior permanece disponível durante a ausência dos novos recursos.
    babyRenderer.renderPose(ctx, options.assets, player.isMoving ? 'run' : 'idle',
      Math.floor((player.animTime || 0) * .9), player.x, player.y + 28, 80, facing);
    const profile = CARRY_PROFILES[toy.type] || CARRY_PROFILES.teddy;
    ctx.save(); ctx.translate(player.x, player.y - 8); ctx.scale(facing, 1); ctx.scale(profile.scale, profile.scale);
    toyRenderer.renderToy(ctx, { ...toy, x: 0, y: 0, isCarried: true }, 0, 0, true, 0, options); ctx.restore(); return;
  }
  const unit = 80 / GIRL_V2_REFERENCE_HEIGHT;
  const distance = girlLocomotionDistance(player.animTime, 80, true), amount = player.runBlend ?? 1;
  const bob = moving ? sampleGirlLocomotion(distance, true, amount).bob : 0;
  ctx.save(); ctx.translate(player.x, player.y + 28); ctx.scale(facing, 1);
  const drawBody = () => {
    if (moving) {
      ctx.save(); ctx.scale(unit, unit);
      const drawn = drawGirlLocomotion(ctx, options.assets, frame, distance, true, amount);
      ctx.restore(); if (drawn) return;
    }
    ctx.drawImage(image, frame.x, frame.y, frame.w, frame.h,
      -frame.anchorX * unit, -frame.anchorY * unit, frame.w * unit, frame.h * unit);
  };
  drawBody();
  const sprite = carriedSprite(toy, options), profile = CARRY_PROFILES[toy.type] || CARRY_PROFILES.teddy;
  const handX = (frame.w * .965 - frame.anchorX) * unit;
  const handY = (frame.h * .52 - frame.anchorY + bob) * unit;
  if (sprite) {
    const scale = Math.min(profile.maxWidth / sprite.w, profile.maxHeight / sprite.h);
    const width = sprite.w * scale, height = sprite.h * scale;
    // Contato discreto entre a base do brinquedo e as palmas, sem sombra de chão.
    ctx.save(); ctx.fillStyle = 'rgba(87,45,25,.18)'; ctx.beginPath();
    ctx.ellipse(handX, handY + .3, width * .34, .8, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.w, sprite.h,
      handX - width / 2, handY - height + 3, width, height);
  }
  // Recorte da própria pintura: os dedos envolvem a frente do item, sem braços procedurais.
  const outline = [[.516,.512],[.622,.54],[.798,.542],[.886,.519],[.933,.517],[.966,.504],
    [1,.507],[.987,.539],[.925,.555],[.793,.57],[.604,.57],[.539,.55]];
  ctx.save(); ctx.beginPath();
  outline.forEach(([x, y], i) => {
    const px = (frame.w * x - frame.anchorX) * unit, py = (frame.h * y - frame.anchorY + bob) * unit;
    if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
  });
  ctx.closePath(); ctx.clip(); drawBody(); ctx.restore(); ctx.restore();
}
