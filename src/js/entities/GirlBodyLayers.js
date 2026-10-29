const caches = new WeakMap();

function canvas(width, height) {
  const layer = document.createElement('canvas'); layer.width = width; layer.height = height; return layer;
}

function polygon(ctx, points) {
  ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
}

/** Camadas recortadas da pintura existente; o cache nunca entra no estado salvo. */
function layers(assets, frame, body, carrying) {
  let cache = caches.get(assets); if (!cache) { cache = new Map(); caches.set(assets, cache); }
  const key = `${frame.key}:${frame.x}:${frame.y}`; if (cache.has(key)) return cache.get(key);
  const idle = frame.key === 'girl-v2-locomocao' && frame.x < 100;
  const skirtTop = carrying ? 150 : 143;
  const arms = carrying ? [] : idle ? [
    { points: [[105,126],[119,125],[124,145],[131,160],[136,166],[136,175],[128,179],[122,173],[117,160],[108,144]], pivot: [114,130] },
    { points: [[56,124],[74,126],[71,150],[70,159],[77,165],[77,178],[70,184],[57,182],[50,174],[51,153],[53,135]], pivot: [64,128] }
  ] : [
    { points: [[111,124],[124,126],[133,121],[138,113],[154,112],[160,120],[160,143],[149,149],[131,153],[117,152],[106,142],[105,132]], pivot: [117,130] },
    { points: [[38,117],[55,121],[50,143],[54,151],[53,162],[46,167],[32,167],[27,158],[28,142],[33,124]], pivot: [46,124] }
  ];
  const copy = () => { const c = canvas(frame.w, frame.h); c.getContext('2d').drawImage(body, 0, 0); return c; };
  const torso = copy(), torsoCtx = torso.getContext('2d');
  torsoCtx.clearRect(0, 0, frame.w, frame.anchorY - 156);
  torsoCtx.clearRect(0, skirtTop + 6, frame.w, frame.h);
  torsoCtx.globalCompositeOperation = 'destination-out';
  arms.forEach(a => { polygon(torsoCtx, a.points); torsoCtx.fill(); });
  const armLayers = arms.map(a => {
    const image = copy(), ctx = image.getContext('2d'); ctx.globalCompositeOperation = 'destination-in';
    polygon(ctx, a.points); ctx.fill(); return { image, pivot: a.pivot };
  });
  const skirt = copy(); skirt.getContext('2d').clearRect(0, 0, frame.w, skirtTop);
  const head = copy(), headCtx = head.getContext('2d');
  headCtx.clearRect(0, frame.anchorY - 152, frame.w, frame.h);
  const hairPoints = [[0,26],[31,20],[47,34],[46,51],[42,64],[42,85],[31,107],[6,109],[0,96]];
  const hair = canvas(frame.w, frame.h), hairCtx = hair.getContext('2d'); hairCtx.drawImage(head, 0, 0);
  hairCtx.globalCompositeOperation = 'destination-in'; polygon(hairCtx, hairPoints); hairCtx.fill();
  headCtx.save(); headCtx.beginPath(); headCtx.rect(0, 0, 41, frame.h); headCtx.clip();
  headCtx.globalCompositeOperation = 'destination-out'; polygon(headCtx, hairPoints); headCtx.fill(); headCtx.restore();
  const result = { frame, torso, skirt, arms: armLayers, head, hair };
  cache.set(key, result); return result;
}

/** Transformação compartilhada pelo tronco, mãos e objeto transportado. */
export function applyGirlBodyTransform(ctx, pose) {
  ctx.translate(pose.pelvisX, pose.bob - 65); ctx.rotate(pose.torsoAngle); ctx.translate(0, 65);
}

function image(ctx, layer, frame) { ctx.drawImage(layer, -frame.anchorX, -frame.anchorY); }

function arm(ctx, parts, index, angle) {
  const a = parts.arms[index]; if (!a) return;
  const x = a.pivot[0] - parts.frame.anchorX, y = a.pivot[1] - parts.frame.anchorY;
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.translate(-x, -y);
  image(ctx, a.image, parts.frame); ctx.restore();
}

function clothes(ctx, parts, pose, alpha) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha *= alpha;
  arm(ctx, parts, 0, -pose.armSwing);
  image(ctx, parts.torso, parts.frame);
  ctx.save(); ctx.translate(14, -116); ctx.rotate(pose.skirtAngle); ctx.translate(-14, 116);
  image(ctx, parts.skirt, parts.frame); ctx.restore();
  arm(ctx, parts, 1, pose.armSwing); ctx.restore();
}

/** Cabeça estabilizada, braços em oposição e vestido com pequeno atraso em relação ao apoio. */
export function drawGirlUpperBody(ctx, assets, frame, body, idleFrame, idleBody, pose, amount, carrying) {
  const moving = layers(assets, frame, body, carrying);
  const resting = carrying ? moving : layers(assets, idleFrame, idleBody, false);
  ctx.save(); applyGirlBodyTransform(ctx, pose);
  if (!carrying) clothes(ctx, resting, pose, 1 - amount);
  clothes(ctx, moving, pose, carrying ? 1 : amount);
  // Uma única cabeça, com registro contínuo pelo rosto; não mistura olhos de duas poses.
  const offset = carrying ? 0 : ((frame.faceX - frame.anchorX) - (idleFrame.faceX - idleFrame.anchorX)) * amount;
  const head = resting, pivotX = carrying ? 13 : 7 + offset;
  ctx.save(); ctx.translate(offset, pose.headY);
  ctx.translate(pivotX - offset, -154); ctx.rotate(pose.headAngle); ctx.translate(-pivotX + offset, 154);
  ctx.save(); ctx.translate(44 - head.frame.anchorX, 44 - head.frame.anchorY); ctx.rotate(pose.hairAngle);
  ctx.translate(-44 + head.frame.anchorX, -44 + head.frame.anchorY); image(ctx, head.hair, head.frame); ctx.restore();
  image(ctx, head.head, head.frame); ctx.restore(); ctx.restore();
}
