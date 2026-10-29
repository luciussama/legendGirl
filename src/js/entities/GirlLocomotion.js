import { GIRL_V2_FRAMES } from '../assets/illustratedGirl.js';

const TAU = Math.PI * 2;
const caches = new WeakMap();
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const smooth = value => value * value * (3 - 2 * value);

/** Trajetória periódica: apoio recua no chão; retorno dobra o joelho e eleva o pé. */
export function sampleGirlLocomotion(distance, carrying = false, amount = 1) {
  const reach = 39, stance = .4;
  const stride = reach * 2 / stance;
  const phase = ((distance / stride) % 1 + 1) % 1;
  const blend = smooth(clamp(amount, 0, 1));
  const bob = -Math.pow(Math.sin(phase * TAU), 2) * (carrying ? 1.5 : 3) * blend;
  const legs = [0, .5].map((offset, index) => {
    const t = (phase + offset) % 1, planted = t < stance;
    const u = planted ? t / stance : (t - stance) / (1 - stance);
    const restX = index ? 7 : -17;
    // Hermite conserva também a velocidade na emenda do ciclo, inclusive no contato.
    const tangent = -2 * reach * (1 - stance) / stance;
    const swingX = -reach + 2 * reach * smooth(u) + tangent * (2 * u * u * u - 3 * u * u + u);
    const x = restX + (planted ? reach * (1 - 2 * u) : swingX) * blend;
    const y = planted ? 0 : -Math.pow(Math.sin(Math.PI * u), 2) * (carrying ? 17 : 30) * blend;
    const ankle = { x, y: y - 23 };
    const hip = { x: index ? 7 : -9, y: -65 + bob };
    const dx = ankle.x - hip.x, dy = ankle.y - hip.y;
    const length = Math.hypot(dx, dy), upper = 36, lower = 31;
    const cosine = clamp((upper * upper + length * length - lower * lower) / (2 * upper * length), -1, 1);
    const along = upper * cosine, across = upper * Math.sqrt(1 - cosine * cosine);
    const knee = { x: hip.x + dx * .54 + ((dx * along + dy * across) / length - dx * .54) * blend,
      y: hip.y + dy * .54 + ((dy * along - dx * across) / length - dy * .54) * blend };
    return { hip, knee, ankle, planted, soleY: y,
      footAngle: planted ? 0 : -.5 * Math.pow(Math.sin(Math.PI * u), 2) * blend };
  });
  return { phase, stride, bob, legs };
}

function canvas(width, height) {
  const image = document.createElement('canvas'); image.width = width; image.height = height;
  return image;
}

/** Reutiliza camadas já preparadas; a leitura dos pixels do corpo ocorre uma vez por pose. */
function prepare(assets) {
  if (typeof document === 'undefined' || !assets?.get) return null;
  if (caches.has(assets)) return caches.get(assets);
  if (!assets.get(GIRL_V2_FRAMES.idle[0].key)) return null;
  const data = { bodies: new Map(), restingLegs: new Map(), parts: null };
  caches.set(assets, data); return data;
}

/** Recorta pela última borda rosa da saia, preservando seu contorno e removendo as pernas antigas. */
function bodyLayer(data, assets, frame) {
  const id = frame.key + ':' + frame.x + ':' + frame.y;
  if (data.bodies.has(id)) return data.bodies.get(id);
  const image = assets.get(frame.key); if (!image) return null;
  const layer = canvas(frame.w, frame.h), ctx = layer.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);
  const pixels = ctx.getImageData(0, 0, frame.w, frame.h);
  for (let x = 0; x < frame.w; x++) {
    let hem = 175;
    for (let y = 175; y < Math.min(197, frame.h); y++) {
      const i = (y * frame.w + x) * 4;
      if (pixels.data[i + 3] > 32 && pixels.data[i] > pixels.data[i + 1] + 12
        && pixels.data[i + 2] >= pixels.data[i + 1] - 2) hem = y;
    }
    for (let y = hem + 1; y < frame.h; y++) pixels.data[(y * frame.w + x) * 4 + 3] = 0;
  }
  ctx.putImageData(pixels, 0, 0); data.bodies.set(id, layer); return layer;
}

/** Camada complementar para assentar nos pixels originais ao final da transição. */
function restingLegLayer(data, assets, frame) {
  if (data.restingLegs.has(frame.key)) return data.restingLegs.get(frame.key);
  const body = bodyLayer(data, assets, frame), image = assets.get(frame.key);
  if (!body || !image) return null;
  const layer = canvas(frame.w, frame.h), ctx = layer.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);
  const pixels = ctx.getImageData(0, 0, frame.w, frame.h);
  const top = body.getContext('2d').getImageData(0, 0, frame.w, frame.h).data;
  for (let i = 3; i < pixels.data.length; i += 4) if (top[i]) pixels.data[i] = 0;
  ctx.putImageData(pixels, 0, 0); data.restingLegs.set(frame.key, layer); return layer;
}

/** Reaproveita a pele do repouso e uma bota original inteiramente visível na corrida. */
function legParts(data, assets) {
  if (data.parts) return data.parts;
  const idle = GIRL_V2_FRAMES.idle[0], run = GIRL_V2_FRAMES.run[0];
  const idleImage = assets.get(idle.key), runImage = assets.get(run.key);
  if (!idleImage || !runImage) return null;
  const skin = canvas(32, 64), skinCtx = skin.getContext('2d');
  skinCtx.drawImage(idleImage, idle.x + 87, idle.y + 198, 18, 19, 0, 0, 32, 64);
  const skinPattern = skinCtx.createPattern(skin, 'repeat');
  skinPattern.setTransform(new DOMMatrix().translate(-16, -6));
  // Este sapato está isolado na prancha original: nenhum fragmento da outra perna.
  const source = canvas(64, 48), sourceCtx = source.getContext('2d');
  sourceCtx.beginPath(); sourceCtx.moveTo(0, 9); sourceCtx.lineTo(38, 0);
  sourceCtx.lineTo(64, 0); sourceCtx.lineTo(64, 48); sourceCtx.lineTo(0, 48);
  sourceCtx.closePath(); sourceCtx.clip();
  sourceCtx.drawImage(runImage, run.x + 83, run.y + 212, 64, 47, 0, 0, 64, 47);
  const boot = canvas(96, 80), bootCtx = boot.getContext('2d', { willReadFrequently: true });
  bootCtx.translate(40, 35); bootCtx.rotate(.38); bootCtx.scale(.85, .85);
  bootCtx.drawImage(source, -22, -21);
  const pixels = bootCtx.getImageData(0, 0, boot.width, boot.height).data;
  let bottom = 0;
  for (let y = 0; y < boot.height; y++) for (let x = 0; x < boot.width; x++) {
    if (pixels[(y * boot.width + x) * 4 + 3] >= 32) bottom = Math.max(bottom, y + 1);
  }
  data.parts = { skinPattern, boot, bootX: 40, bootY: bottom - 23 };
  return data.parts;
}

/** Uma única superfície contínua evita emendas e fragmentos nas dobras dos joelhos. */
function drawLeg(ctx, parts, leg, index) {
  ctx.save(); ctx.translate(leg.hip.x, leg.hip.y);
  const xs = [0, leg.knee.x - leg.hip.x, leg.ankle.x - leg.hip.x];
  const left = Math.min(...xs) - 14, width = Math.max(...xs) - left + 14;
  parts.skinPattern.setTransform(new DOMMatrix().translate(left, -16).scale(width / 32, 1));
  ctx.beginPath(); ctx.moveTo(0, 0);
  ctx.lineTo(leg.knee.x - leg.hip.x, leg.knee.y - leg.hip.y);
  ctx.lineTo(leg.ankle.x - leg.hip.x, leg.ankle.y - leg.hip.y);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = '#763e29'; ctx.lineWidth = index ? 26 : 24; ctx.stroke();
  ctx.strokeStyle = parts.skinPattern; ctx.lineWidth = index ? 22 : 20; ctx.stroke();
  ctx.restore();
  ctx.save(); ctx.translate(leg.ankle.x, leg.ankle.y); ctx.rotate(leg.footAngle);
  ctx.drawImage(parts.boot, -parts.bootX, -parts.bootY); ctx.restore();
}

/** Desenha em coordenadas da pintura (256 px), na origem dos pés, já orientada pelo chamador. */
export function drawGirlLocomotion(ctx, assets, frame, distance, carrying = false, amount = 1) {
  const data = prepare(assets); if (!data) return false;
  const restingFrame = carrying ? GIRL_V2_FRAMES.carry[0] : GIRL_V2_FRAMES.idle[0];
  if (amount <= 0) {
    const original = assets.get(restingFrame.key); if (!original) return false;
    ctx.drawImage(original, restingFrame.x, restingFrame.y, restingFrame.w, restingFrame.h,
      -restingFrame.anchorX, -restingFrame.anchorY, restingFrame.w, restingFrame.h);
    return true;
  }
  const body = bodyLayer(data, assets, frame); if (!body) return false;
  const pose = sampleGirlLocomotion(distance, carrying, amount);
  const parts = legParts(data, assets); if (!parts) return false;
  const legBlend = smooth(clamp(amount * 4, 0, 1));
  if (legBlend < 1) {
    const original = restingLegLayer(data, assets, restingFrame); if (!original) return false;
    ctx.save(); ctx.globalAlpha *= 1 - legBlend;
    ctx.drawImage(original, -restingFrame.anchorX, -restingFrame.anchorY); ctx.restore();
  }
  ctx.save(); ctx.globalAlpha *= legBlend;
  pose.legs.forEach((leg, index) => drawLeg(ctx, parts, leg, index));
  ctx.restore();
  const idleFrame = GIRL_V2_FRAMES.idle[0];
  const idle = !carrying ? bodyLayer(data, assets, idleFrame) : null;
  if (idle) {
    // Uma única cabeça: só braços/roupa transitam entre repouso e corrida.
    // O registro pelo rosto evita duplicar olhos/cabelo durante a parada.
    const offset = (frame.faceX - frame.anchorX) - (idleFrame.faceX - idleFrame.anchorX);
    ctx.save(); ctx.beginPath(); ctx.rect(-200, -400, 400, 247 + pose.bob); ctx.clip();
    ctx.drawImage(idle, -idleFrame.anchorX + offset * amount, -idleFrame.anchorY + pose.bob);
    ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(-200, -153 + pose.bob, 400, 180); ctx.clip();
    ctx.save(); ctx.globalAlpha *= 1 - amount;
    ctx.drawImage(idle, -idleFrame.anchorX, -idleFrame.anchorY + pose.bob); ctx.restore();
  }
  ctx.save(); ctx.globalAlpha *= idle ? amount : 1;
  ctx.drawImage(body, -frame.anchorX, -frame.anchorY + pose.bob); ctx.restore();
  if (idle) ctx.restore();
  return true;
}

/** Conversão dos relógios legados para distância da pintura, sem alterar a simulação. */
export function girlLocomotionDistance(animTime, height, room = false) {
  return (animTime || 0) / (room ? .22 / 3.8 : .15 / 1.42) * 256 / height;
}

/** Entrada compartilhada dos dois modos de exploração; só transforma a pintura. */
export function renderGirlRun(ctx, assets, actor, centerX, feetY, height, facing, visualScale = 1, room = false) {
  if (!ctx || !prepare(assets)) return false;
  const frame = GIRL_V2_FRAMES.run[0], amount = actor.runBlend ?? 1;
  const distance = girlLocomotionDistance(actor.animTime, height * visualScale, room);
  ctx.save(); ctx.translate(centerX, feetY); ctx.scale(facing * height / 256 * visualScale, height / 256 * visualScale);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  const drawn = drawGirlLocomotion(ctx, assets, frame, distance, false, amount);
  ctx.restore(); return drawn;
}
