// Prepara atlas em resolução de jogo; preserva as pranchas de arte e os sprites oficiais anteriores.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const ROOT = 'assets/art/characters/girl-v2';
const REFERENCE_HEIGHT = 256;
const definitions = [
  ['locomocao', 'locomocao.png', 8, 4, 2, 460],
  ['saltos', 'saltos.png', 8, 4, 2, 460],
  ['acoes', 'acoes.png', 8, 4, 2, 460],
  ['arena-base', 'arena-base-v3.png', 12, 4, 3, 336],
  ['arena-acoes', 'arena-acoes-v2.png', 12, 4, 3, 310],
  ['arena-defesa', 'arena-defesa-v2.png', 6, 3, 2, 472],
  ['arena-dano', 'arena-dano.png', 6, 3, 2, 460],
  ['arena-agachar', 'arena-agachar.png', 4, 2, 2, 510],
  ['carry', '../../../toy-room/stage2/carry-v2/poses.png', 4, 4, 1, 609]
];

/** Separa figuras conectadas, inclusive quando uma pose horizontal ultrapassa a divisão nominal da célula. */
function components(image, expected) {
  const { width, height, data } = image, labels = new Int32Array(width * height);
  const queue = new Int32Array(width * height), found = [];
  let id = 0;
  for (let pixel = 0; pixel < labels.length; pixel++) {
    if (labels[pixel] || data[pixel * 4 + 3] < 24) continue;
    const item = { id: ++id, area: 0, x: width, y: height, right: 0, bottom: 0 };
    let head = 0, tail = 1; queue[0] = pixel; labels[pixel] = id;
    while (head < tail) {
      const p = queue[head++], x = p % width, y = Math.floor(p / width);
      item.area++; item.x = Math.min(item.x, x); item.y = Math.min(item.y, y);
      item.right = Math.max(item.right, x + 1); item.bottom = Math.max(item.bottom, y + 1);
      for (const next of [x ? p - 1 : -1, x + 1 < width ? p + 1 : -1, y ? p - width : -1, y + 1 < height ? p + width : -1]) {
        if (next < 0 || labels[next] || data[next * 4 + 3] < 24) continue;
        labels[next] = id; queue[tail++] = next;
      }
    }
    found.push(item);
  }
  found.sort((a, b) => b.area - a.area);
  const selected = found.slice(0, expected);
  if (selected.length !== expected || selected.some(p => p.area < 1000)) throw Error('Quantidade de poses inválida.');
  if (found[expected]?.area > selected.at(-1).area * .15) throw Error('Parte relevante desconectada: revisar a prancha.');
  return { selected, labels };
}

/** Redução bilinear em alfa pré-multiplicado evita franjas do RGB oculto sob a transparência. */
function resizeFigure(image, labels, figure, scale) {
  const x0 = Math.max(0, figure.x - 2), y0 = Math.max(0, figure.y - 2);
  const sw = Math.min(image.width, figure.right + 2) - x0;
  const sh = Math.min(image.height, figure.bottom + 2) - y0;
  const width = Math.max(1, Math.round(sw * scale)), height = Math.max(1, Math.round(sh * scale));
  const out = new PNG({ width, height });
  const belongs = (x, y) => {
    const label = labels[y * image.width + x];
    if (label === figure.id) return true;
    if (image.data[(y * image.width + x) * 4 + 3] >= 24) return false;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < image.width && ny >= 0 && ny < image.height && labels[ny * image.width + nx] === figure.id) return true;
    }
    return false;
  };
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const sx = x0 + (x + .5) / scale - .5, sy = y0 + (y + .5) / scale - .5;
    const ix = Math.floor(sx), iy = Math.floor(sy), fx = sx - ix, fy = sy - iy;
    const color = [0, 0, 0]; let alpha = 0;
    for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
      const px = ix + dx, py = iy + dy;
      if (px < 0 || py < 0 || px >= image.width || py >= image.height || !belongs(px, py)) continue;
      const offset = (py * image.width + px) * 4;
      const weight = (dx ? fx : 1 - fx) * (dy ? fy : 1 - fy), a = image.data[offset + 3] * weight;
      alpha += a; for (let c = 0; c < 3; c++) color[c] += image.data[offset + c] * a;
    }
    const offset = (y * width + x) * 4;
    for (let c = 0; c < 3; c++) out.data[offset + c] = alpha ? Math.round(color[c] / alpha) : 0;
    out.data[offset + 3] = Math.round(alpha);
  }
  return out;
}

function measure(image) {
  let bottom = 0, left = image.width, right = 0;
  for (let y = 0; y < image.height; y++) for (let x = 0; x < image.width; x++) if (image.data[(y * image.width + x) * 4 + 3]) bottom = y + 1;
  // O centro da saia/tronco registra o corpo sem oscilar com a passada das botas.
  const centers = [];
  for (let y = Math.floor(image.height * .67); y < image.height * .77; y++) {
    let a = image.width, b = -1;
    for (let x = 0; x < image.width; x++) if (image.data[(y * image.width + x) * 4 + 3] >= 96) { a = Math.min(a, x); b = Math.max(b, x); }
    if (b >= a) centers.push((a + b) / 2);
  }
  centers.sort((a, b) => a - b);
  const anchorX = centers[Math.floor(centers.length / 2)] ?? image.width / 2;
  for (let y = Math.floor(bottom - image.height * .16); y < bottom; y++) for (let x = 0; x < image.width; x++) if (image.data[(y * image.width + x) * 4 + 3] >= 96) {
    left = Math.min(left, x); right = Math.max(right, x + 1);
  }
  let skinX = 0, skinCount = 0;
  for (let y = 0; y < Math.min(image.height, 122); y++) for (let x = 0; x < image.width; x++) {
    const i = (y * image.width + x) * 4, [r, g, b, a] = image.data.subarray(i, i + 4);
    if (a > 128 && r > 180 && g > 100 && b > 70 && r > g + 20 && g > b + 15 && b < 210) { skinX += x; skinCount++; }
  }
  return { anchorX, faceX: skinCount ? skinX / skinCount : anchorX, anchorY: bottom, feet: { left: left - anchorX, right: right - anchorX } };
}

fs.mkdirSync(ROOT + '/runtime', { recursive: true });
const sets = {};
for (const [name, file, count, columns, rows, referenceHeight] of definitions) {
  const source = path.normalize(ROOT + '/source/' + file);
  const image = PNG.sync.read(fs.readFileSync(source));
  const { selected, labels } = components(image, count);
  selected.sort((a, b) => Math.floor((a.y + a.bottom) / 2 / (image.height / rows)) - Math.floor((b.y + b.bottom) / 2 / (image.height / rows)) || a.x - b.x);
  const figures = selected.map(p => resizeFigure(image, labels, p, REFERENCE_HEIGHT / referenceHeight));
  const cellW = Math.max(320, Math.ceil((Math.max(...figures.map(p => p.width)) + 24) / 32) * 32);
  const cellH = Math.max(320, Math.ceil((Math.max(...figures.map(p => p.height)) + 24) / 32) * 32);
  const sheet = new PNG({ width: cellW * columns, height: cellH * rows });
  const frames = figures.map((p, i) => {
    const x = i % columns * cellW + 12, y = Math.floor(i / columns) * cellH + 12;
    PNG.bitblt(p, sheet, 0, 0, p.width, p.height, x, y);
    return { x, y, w: p.width, h: p.height, ...measure(p) };
  });
  const output = ROOT + '/runtime/' + name + '.png'; fs.writeFileSync(output, PNG.sync.write(sheet));
  sets[name] = { key: 'girl-v2-' + name, file: output, source, frames };
  console.log('Preparado:', name, frames.length, 'poses;', sheet.width, '×', sheet.height);
}
const frame = (name, indexes) => indexes.map(i => ({ ...sets[name].frames[i], key: sets[name].key, file: sets[name].file }));
const frames = {
  idle: frame('locomocao', [0,0,0,1,1,1,0,0,0]),
  run: frame('locomocao', [2,3,4,4,5,6,7,7,2]),
  jump: frame('saltos', [0,0,1,1,2,2]), jump_short: frame('saltos', [0,1]), high_jump: frame('saltos', [2]),
  fall: frame('saltos', [3,3,4,4,5,5]), dash: frame('saltos', [6]), crouch: frame('saltos', [7]),
  collect: frame('acoes', [0]), push: frame('acoes', [1,1,1]), climb: frame('acoes', [2]), interact: frame('acoes', [3,3]),
  lying_down: frame('acoes', [4]), teleport: frame('acoes', [5,6]), damage: frame('acoes', [7]), carry: frame('carry', [0,1,2,3]),
  sword_idle: frame('arena-base', [0,1,2,3]), sword_run: frame('arena-base', [4,5,6,7]),
  sword_crouch: frame('arena-agachar', [3]), sword_crouchCycle: frame('arena-agachar', [0,1,2,3]),
  sword_attack: frame('arena-acoes', [0,1,2,3,4]), sword_jump: frame('arena-acoes', [5,6]), sword_fall: frame('arena-acoes', [7,8]),
  sword_damage: frame('arena-dano', [0,1,2,3,4,5]), sword_guard: frame('arena-defesa', [0,1,2,3,4,5])
};
const footBounds = {};
for (const [name, list] of Object.entries(frames)) footBounds[name] = {
  left: Math.min(...list.map(f => f.feet.left)), right: Math.max(...list.map(f => f.feet.right))
};
fs.writeFileSync(ROOT + '/frames.json', JSON.stringify({ referenceHeight: REFERENCE_HEIGHT, sets }, null, 2) + '\n');
fs.writeFileSync('src/js/assets/illustratedGirl.js', '// Gerado por scripts/prepare-illustrated-girl.js; só contém metadados visuais.\n' +
  'export const GIRL_V2_REFERENCE_HEIGHT = 256;\n' + 'export const GIRL_V2_SETS = ' + JSON.stringify(sets) + ';\n' +
  'export const GIRL_V2_FRAMES = ' + JSON.stringify(frames) + ';\n' + 'export const GIRL_V2_FOOT_BOUNDS = ' + JSON.stringify(footBounds) + ';\n');
