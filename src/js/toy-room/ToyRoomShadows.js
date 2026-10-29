import { roomEnvironmentRenderer } from './RoomEnvironmentRenderer.js';
import { toyRenderer } from './ToyRenderer.js';
import { toyRoomEntities } from './ToyRoomEntities.js';
import { getToyRoomFloorLight } from './ToyRoomLighting.js';
import { createToyRoomInitialEntities } from './ToyRoomInitialEntities.js';
import { createToyRoomEnvironmentAssets } from './ToyRoomEnvironmentAssets.js';

const stores = new WeakMap();
const COLOR = '#493442';
const PAD = 64;

function canvas(width, height) {
  const result = document.createElement('canvas');
  result.width = Math.ceil(width); result.height = Math.ceil(height); return result;
}

function contactStamp() {
  const result = canvas(128, 64), ctx = result.getContext('2d');
  ctx.translate(64, 32); ctx.scale(64, 32);
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  gradient.addColorStop(0, 'rgba(62,40,43,1)');
  gradient.addColorStop(.42, 'rgba(62,40,43,.7)');
  gradient.addColorStop(1, 'rgba(62,40,43,0)');
  ctx.fillStyle = gradient; ctx.fillRect(-1, -1, 2, 2); return result;
}

/** Mede a pintura uma vez. Alfa suave já pintado não vira silhueta sólida projetada. */
function makeCaster(width, height, draw, rootX = 0, rootY = null) {
  const image = canvas(width + PAD * 2, height + PAD * 2), ctx = image.getContext('2d', { willReadFrequently: true });
  ctx.translate(PAD, PAD); draw(ctx);
  const pixels = ctx.getImageData(0, 0, image.width, image.height);
  let left = image.width, right = 0, top = image.height, bottom = 0, softBottom = 0;
  for (let y = 0; y < image.height; y++) for (let x = 0; x < image.width; x++) {
    const i = (y * image.width + x) * 4, alpha = pixels.data[i + 3];
    if (alpha >= 24) softBottom = Math.max(softBottom, y + 1);
    if (alpha >= 200) {
      left = Math.min(left, x); right = Math.max(right, x + 1);
      top = Math.min(top, y); bottom = Math.max(bottom, y + 1);
    }
  }
  if (right <= left || bottom <= top) return null;
  const columns = new Uint8Array(image.width);
  const band = Math.max(3, Math.min(12, (bottom - top) * .09));
  for (let y = Math.floor(bottom - band); y < bottom; y++) for (let x = left; x < right; x++)
    if (pixels.data[(y * image.width + x) * 4 + 3] >= 200) columns[x] = 1;
  const contacts = [];
  for (let x = left; x < right; x++) {
    if (!columns[x]) continue;
    const start = x; let end = x + 1;
    while (end < right && (columns[end] || columns[end + 1] || columns[end + 2])) end++;
    let supportY = 0;
    for (let sx = start; sx < end; sx++) for (let sy = Math.floor(bottom - band); sy < bottom; sy++)
      if (pixels.data[(sy * image.width + sx) * 4 + 3] >= 200) supportY = Math.max(supportY, sy + 1 - PAD);
    if (end - start >= 3) contacts.push({ x: (start + end) / 2 - PAD, y: supportY, radius: (end - start) / 2 });
    x = end;
  }
  // A máscara mantém apenas o objeto opaco; descarta a penumbra pintada da base.
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 255;
    pixels.data[i + 3] = pixels.data[i + 3] >= 200 ? 255 : 0;
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.putImageData(pixels, 0, 0);
  const base = rootY ?? bottom - PAD;
  const projectionHeight = (base + PAD - top) * .7;
  const margin = 12, projection = canvas(right - left + margin * 2, projectionHeight + margin * 2);
  const pctx = projection.getContext('2d');
  pctx.translate(margin + PAD + rootX - left, margin);
  pctx.scale(1, -.7);
  pctx.drawImage(image, -PAD - rootX, -PAD - base);
  pctx.setTransform(1, 0, 0, 1, 0, 0);
  pctx.globalCompositeOperation = 'source-in'; pctx.fillStyle = COLOR;
  pctx.fillRect(0, 0, projection.width, projection.height);
  const blurred = canvas(projection.width, projection.height), bctx = blurred.getContext('2d');
  bctx.filter = 'blur(3px)'; bctx.drawImage(projection, 0, 0); bctx.filter = 'none';
  bctx.globalCompositeOperation = 'destination-in';
  const fade = bctx.createLinearGradient(0, margin, 0, margin + projectionHeight);
  fade.addColorStop(0, 'rgba(0,0,0,.95)'); fade.addColorStop(.55, 'rgba(0,0,0,.7)');
  fade.addColorStop(1, 'rgba(0,0,0,0)'); bctx.fillStyle = fade; bctx.fillRect(0, 0, blurred.width, blurred.height);
  return { image: blurred, rootX: margin + PAD + rootX - left, rootY: margin,
    x: rootX, y: base, contacts, paintedContact: softBottom - bottom > 2,
    width: right - left, height: bottom - top };
}

function store(scene) {
  if (!scene.assets || typeof document === 'undefined') return null;
  let data = stores.get(scene.assets);
  if (!data) { data = { casters: new Map(), contact: contactStamp() }; stores.set(scene.assets, data); }
  return data;
}

function caster(data, scene, type, item) {
  const key = type + ':' + (type === 'player' ? item.carriedItem?.type || 'free' : item.type + ':' + item.w + ':' + item.h);
  if (data.casters.has(key)) return data.casters.get(key);
  const options = { assets: scene.assets, environmentChest: scene.environmentChest, environmentTable: scene.environmentTable,
    environmentTeddy: scene.environmentTeddy, environmentTrain: scene.environmentTrain, groundShadows: false };
  let value;
  if (type === 'furniture') value = makeCaster(item.w, item.h,
    ctx => roomEnvironmentRenderer.renderFurniture(ctx, { ...item, x: 0, y: 0 }, options), item.w / 2);
  else if (type === 'toy') value = makeCaster(100, 110,
    ctx => toyRenderer.renderToy(ctx, { ...item, x: 0, y: 0 }, -10000, -10000, true, 0, options));
  else value = makeCaster(120, 130, ctx => toyRoomEntities.renderPlayer(ctx,
    { ...item, x: 0, y: 0, facing: 'right', isMoving: false, runBlend: 0, animTime: 0 }, options), 0, 28);
  if (value) data.casters.set(key, value); return value;
}

/** Prepara também todas as cargas na entrada da sala; o loop não lê pixels nem cria máscaras. */
export function prepareToyRoomShadows(assets) {
  const scene = { assets, ...createToyRoomInitialEntities(), ...createToyRoomEnvironmentAssets(assets) };
  const data = store(scene); if (!data || data.prepared) return;
  let complete = true;
  for (const { type, item } of getToyRoomShadowItems(scene)) complete = Boolean(caster(data, scene, type, item)) && complete;
  for (const toy of scene.toys)
    complete = Boolean(caster(data, scene, 'player', { ...scene.player, carriedItem: toy })) && complete;
  data.prepared = complete;
}

/** Descrição pura dos emissores ativos: carregar/guardar retira a sombra independente imediatamente. */
export function getToyRoomShadowItems(scene) {
  return [
    ...scene.furniture.map(item => ({ type: 'furniture', item })),
    ...scene.toys.filter(item => !item.isCarried && !item.isOrganized).map(item => ({ type: 'toy', item })),
    { type: 'player', item: scene.player }
  ];
}

/** Passe exclusivo do piso: sobre tapetes e trilhos, sob todos os corpos ordenados por profundidade. */
export function renderToyRoomShadows(ctx, scene) {
  const data = store(scene); if (!ctx || !data) return;
  ctx.save(); ctx.beginPath(); ctx.rect(54, 240, scene.ROOM_W - 108, scene.ROOM_H - 294); ctx.clip();
  for (const { type, item } of getToyRoomShadowItems(scene)) {
    const shape = caster(data, scene, type, item); if (!shape) continue;
    const x = item.x + shape.x, y = item.y + shape.y;
    const light = getToyRoomFloorLight(x, y), facing = type === 'player' && item.facing === 'left' ? -1 : 1;
    ctx.save(); ctx.translate(x, y);
    ctx.transform(facing, 0, light.slope * light.stretch, light.stretch, 0, 0);
    ctx.globalAlpha *= light.opacity;
    ctx.drawImage(shape.image, -shape.rootX, -shape.rootY); ctx.restore();
    if (type === 'player') {
      ctx.save(); ctx.globalAlpha *= .34;
      ctx.drawImage(data.contact, item.x - 20, item.y + 23, 40, 10); ctx.restore();
    } else for (const contact of shape.contacts) {
      const radius = Math.max(5, contact.radius * 1.12);
      const height = Math.max(3, Math.min(7, radius * .2));
      ctx.save(); ctx.globalAlpha *= shape.paintedContact ? .14 : .3;
      ctx.drawImage(data.contact, item.x + contact.x - radius, item.y + contact.y - height, radius * 2, height * 2); ctx.restore();
    }
  }
  ctx.restore();
}
