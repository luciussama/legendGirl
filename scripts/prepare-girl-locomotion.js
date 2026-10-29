// Prepara peças isoladas para a articulação visual; não recalibra os pés físicos.
import fs from 'node:fs';
import { PNG } from 'pngjs';

const root = 'assets/art/characters/girl-v2';
const input = PNG.sync.read(fs.readFileSync(root + '/source/pernas-articuladas-v1.png'));
const output = new PNG({ width: 768, height: 256 });
const parts = [];
for (let row = 0; row < 2; row++) {
  const leg = [];
  for (let column = 0; column < 3; column++) {
    const x0 = column * input.width / 3, y0 = row * input.height / 2;
    let left = input.width, top = input.height, right = 0, bottom = 0;
    for (let y = y0; y < y0 + input.height / 2; y++) for (let x = x0; x < x0 + input.width / 3; x++) {
      if (input.data[(y * input.width + x) * 4 + 3] < 160) continue;
      left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x + 1); bottom = Math.max(bottom, y + 1);
    }
    if (right <= left || bottom <= top) throw Error('Peça ausente na prancha de pernas.');
    const width = right - left, height = bottom - top;
    const scale = Math.min(108 / width, 108 / height);
    const w = Math.round(width * scale), h = Math.round(height * scale);
    const x = (row * 3 + column) * 128 + 10, y = 10;
    // Reamostragem em alfa pré-multiplicado, preservando o alfa da geração.
    for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) {
      const sx = left + (dx + .5) / scale - .5, sy = top + (dy + .5) / scale - .5;
      const ix = Math.floor(sx), iy = Math.floor(sy), fx = sx - ix, fy = sy - iy;
      const color = [0,0,0]; let alpha = 0;
      for (let oy = 0; oy < 2; oy++) for (let ox = 0; ox < 2; ox++) {
        const px = Math.max(left, Math.min(right - 1, ix + ox)), py = Math.max(top, Math.min(bottom - 1, iy + oy));
        const at = (py * input.width + px) * 4, weight = (ox ? fx : 1 - fx) * (oy ? fy : 1 - fy);
        const a = input.data[at + 3] * weight; alpha += a;
        for (let c = 0; c < 3; c++) color[c] += input.data[at + c] * a;
      }
      const to = ((y + dy) * output.width + x + dx) * 4;
      for (let c = 0; c < 3; c++) output.data[to + c] = alpha ? Math.round(color[c] / alpha) : 0;
      output.data[to + 3] = Math.round(alpha);
    }
    leg.push({ x, y, w, h });
  }
  parts.push(leg);
}
const file = root + '/runtime/pernas-articuladas-v1.png';
fs.writeFileSync(file, PNG.sync.write(output));
fs.writeFileSync('src/js/assets/GirlLocomotionArt.js', '// Gerado por prepare-girl-locomotion.js; metadados exclusivamente visuais.\n'
  + 'export const GIRL_LOCOMOTION_ART = ' + JSON.stringify({ key: 'girl-v2-pernas-articuladas-v1', file, legs: parts }) + ';\n');
console.log('Articulação preparada: seis peças; atlas768×256.');
