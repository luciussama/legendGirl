import { gardenDefeatFrame } from './gardenDefeatPresentation.js';
import { GARDEN_BEE_LAYERS as ART } from './gardenCinematicArt.js';
const smooth = (t) => {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
};
/** Uma única pintura do corpo: apenas as asas articuladas mudam durante o voo. */
export function drawGardenBee(ctx, images, bee, time) {
  const image = images.get(ART.file),
    pose = gardenDefeatFrame(bee);
  if (!image || !pose.visible) return;
  const body = ART.body,
    wing = ART.wings,
    scale = 84 / body.w;
  const tilt = !bee.alive
    ? pose.rotation
    : bee.phase === 'prepare'
      ? 0.48 * smooth(bee.age / 0.5)
      : bee.phase === 'dive'
        ? 0.48 * (1 - smooth(bee.age / 0.4))
        : 0;
  ctx.save();
  ctx.translate(pose.x, pose.y);
  ctx.rotate(bee.alive ? tilt * bee.direction : tilt);
  ctx.scale(bee.direction, 1);
  ctx.globalAlpha *= pose.alpha;
  ctx.save();
  ctx.translate(-8, -29);
  const beat = bee.alive ? Math.sin(time * Math.PI * 2 * 6.5) : 0,
    spread = !bee.alive ? 0.22 : bee.phase === 'prepare' ? 0.9 + 0.1 * beat : 0.58 + 0.34 * beat;
  ctx.rotate(-0.12 + 0.09 * beat);
  ctx.scale(1, spread);
  // A raiz das asas é fixa no dorso; não se usa a caixa variável das poses antigas.
  ctx.drawImage(
    image,
    wing.x,
    wing.y,
    wing.w,
    wing.h,
    -66 * 0.57,
    (-66 * wing.h) / wing.w,
    66,
    (66 * wing.h) / wing.w,
  );
  ctx.restore();
  ctx.drawImage(image, body.x, body.y, body.w, body.h, -42, -46, 84, body.h * scale);
  ctx.restore();
}
