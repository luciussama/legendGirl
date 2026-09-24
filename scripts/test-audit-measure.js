import fs from 'node:fs';
import { PNG } from 'pngjs';
import { platforms, phase3Platforms } from '../src/js/config.js';
import { PlatformRenderer } from '../src/js/environment/PlatformRenderer.js';
import { SoftwareCanvas } from './software-canvas.js';

// Mock AssetManager that returns PNGs using pngjs
const manifest = JSON.parse(fs.readFileSync('assets/manifest.json', 'utf8'));
const imageCache = new Map();

for (const [k, relPath] of Object.entries(manifest.images)) {
  const filePath = relPath.replace(/^\.\//, '');
  if (filePath.endsWith('.png') && fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath);
      const png = PNG.sync.read(data);
      imageCache.set(k, png);
    } catch (e) {
      // ignore
    }
  }
}

const mockAssets = {
  get(key) {
    return imageCache.get(key) || null;
  },
  getRegion(key, region) {
    const sheet = imageCache.get(key);
    if (!sheet) return null;
    const sub = new PNG({ width: region.width, height: region.height });
    for (let y = 0; y < region.height; y++) {
      for (let x = 0; x < region.width; x++) {
        const sIdx = ((region.y + y) * sheet.width + (region.x + x)) * 4;
        const dIdx = (y * region.width + x) * 4;
        sub.data[dIdx] = sheet.data[sIdx];
        sub.data[dIdx + 1] = sheet.data[sIdx + 1];
        sub.data[dIdx + 2] = sheet.data[sIdx + 2];
        sub.data[dIdx + 3] = sheet.data[sIdx + 3];
      }
    }
    return sub;
  }
};

const renderer = new PlatformRenderer({ assets: mockAssets });
const entries = [
  ...platforms.map((p, index) => ({ p, index, phase: index < 10 ? 1 : 2 })),
  ...phase3Platforms.map((p, index) => ({ p, index, phase: 3 }))
];

console.log('Testing all 38 platforms in software canvas...');
let totalValid = 0, totalSuspect = 0, totalInvalid = 0;

for (let entry = 0; entry < entries.length; entry++) {
  const { p, index, phase } = entries[entry];
  const s = {
    x: p.standRegion?.x ?? p.x,
    y: p.surfaceTopY ?? p.standRegion?.y ?? p.y,
    w: p.standRegion?.w ?? p.w
  };

  const canvas = new SoftwareCanvas(900, 640);
  canvas.translate(0, 200 - s.y);
  renderer.renderPlatforms(canvas, { width: 900, height: 640 }, s.x - 350, {
    platforms: [p],
    isPhase3: phase === 3,
    assets: mockAssets,
    tick: 0
  });

  const pixels = canvas.getImageData(0, 0, 900, 640).data;
  const alpha = (x, y) => {
    if (x < 0 || x >= 900 || y < 0 || y >= 640) return 0;
    return pixels[(y * 900 + x) * 4 + 3];
  };

  const columns = [];
  for (let k = 0; k < s.w; k++) {
    let nearest = null;
    for (let d = 0; d <= 32 && nearest === null; d++) {
      for (const dy of d ? [d, -d] : [0]) {
        if (alpha(350 + k, 200 + dy) >= 128) {
          nearest = dy;
          break;
        }
      }
    }
    columns.push(nearest);
  }

  const near = columns.filter(v => v !== null && Math.abs(v) <= 1).length;
  const coverage = (100 * near) / s.w;
  const emptyCols = columns.filter(v => v === null).length;

  let status = 'Válida';
  if (emptyCols > 0 || coverage < 50) {
    status = 'Inválida';
    totalInvalid++;
  } else if (coverage < 95) {
    status = 'Suspeita';
    totalSuspect++;
  } else {
    totalValid++;
  }

  console.log(`[F${phase} P${String(index).padStart(2)}] ${p.style.padEnd(23)}: ${coverage.toFixed(1).padStart(5)}% near, empty: ${emptyCols} -> ${status}`);
}

console.log(`Summary: ${totalValid} Válidas, ${totalSuspect} Suspeitas, ${totalInvalid} Inválidas.`);
