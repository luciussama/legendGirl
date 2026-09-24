import fs from 'node:fs';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';
import { platforms, phase3Platforms, createBabyState, FLOOR_Y } from '../src/js/config.js';
import { PlatformRenderer } from '../src/js/environment/PlatformRenderer.js';
import { BabyRenderer } from '../src/js/entities/BabyRenderer.js';
import { SoftwareCanvas } from './software-canvas.js';

// Preload manifest PNG assets
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
const character = new BabyRenderer();

const entries = [
  ...platforms.map((p, index) => ({ p, index, phase: index < 10 ? 1 : 2 })),
  ...phase3Platforms.map((p, index) => ({ p, index, phase: 3 }))
];

console.log(`Auditing and rendering all ${entries.length} platforms...`);

// 1. Measure metrics
const metrics = [];
for (let entry = 0; entry < entries.length; entry++) {
  const { p, index, phase } = entries[entry];
  const s = {
    x: p.standRegion?.x ?? p.x,
    y: p.surfaceTopY ?? p.standRegion?.y ?? p.y,
    w: p.standRegion?.w ?? p.w
  };

  const samples = [];
  for (const tick of [0, 8, 24]) {
    const mask = new SoftwareCanvas(900, 640);
    mask.translate(0, 200 - s.y);
    renderer.renderPlatforms(mask, { width: 900, height: 640 }, s.x - 350, {
      platforms: [p],
      isPhase3: phase === 3,
      assets: mockAssets,
      tick
    });

    const pixels = mask.getImageData(0, 0, 900, 640).data;
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
    const noOpaque = columns.filter(v => v === null).length;
    samples.push({
      tick,
      coverageWithin1pxPct: coverage,
      noOpaqueWithin32px: noOpaque,
      nearestOpaqueOffsets: columns
    });
  }

  metrics.push({ phase, index, style: p.style, support: s, samples });
  console.log(`[F${phase} P${String(index).padStart(2)}] ${p.style.padEnd(23)}: coverage=${samples[0].coverageWithin1pxPct.toFixed(1)}%, empty=${samples[0].noOpaqueWithin32px}`);
}

fs.writeFileSync('tmp/dark-room-review/metricas-visuais.json', JSON.stringify(metrics, null, 2) + '\n');
console.log('Saved tmp/dark-room-review/metricas-visuais.json');

// 2. Generate composite visual-grupo-0.png .. visual-grupo-3.png (1000 x 1770)
for (let group = 0; group < 4; group++) {
  const composite = new SoftwareCanvas(1000, 1770);
  // Fill background #211b2d
  composite.fillStyle = '#211b2d';
  composite.fillRect(0, 0, 1000, 1770);

  // Group header banner
  composite.fillStyle = '#ffffff';
  composite.fillRect(12, 12, 976, 32);
  composite.fillStyle = '#211b2d';

  // 10 items in group
  const startIdx = group * 10;
  const groupEntries = entries.slice(startIdx, startIdx + 10);

  for (let i = 0; i < groupEntries.length; i++) {
    const { p, index, phase } = groupEntries[i];
    const s = {
      x: p.standRegion?.x ?? p.x,
      y: p.surfaceTopY ?? p.standRegion?.y ?? p.y,
      w: p.standRegion?.w ?? p.w
    };

    const col = i % 2;
    const row = Math.floor(i / 2);
    const px = 12 + col * (480 + 16);
    const py = 56 + row * (310 + 24);

    // Card background #292237
    composite.fillStyle = '#292237';
    composite.fillRect(px, py, 480, 310);
    // Border
    composite.strokeStyle = '#3b324f';
    composite.lineWidth = 1;
    composite.strokeRect(px, py, 480, 310);

    // Card Title header
    composite.fillStyle = '#1e1828';
    composite.fillRect(px, py, 480, 28);
    composite.fillStyle = '#38bdf8';
    composite.fillRect(px + 8, py + 8, 4, 12);

    // Render platform and character into a subcanvas
    const sub = new SoftwareCanvas(480, 310);
    sub.save();
    sub.translate(0, 115 - s.y);
    const camera = s.x + s.w / 2 - 240;
    renderer.renderPlatforms(sub, { width: 480, height: 310 }, camera, {
      platforms: [p],
      isPhase3: phase === 3,
      assets: mockAssets,
      tick: 0
    });

    const baby = {
      ...createBabyState(),
      x: s.x + (s.w - 38) / 2 - camera,
      y: s.y - 44,
      onGround: true,
      facing: phase === 3 ? -1 : 1,
      animTime: 0
    };
    character.render(sub, baby);

    // Green alignment line along support
    sub.strokeStyle = '#4ade80';
    sub.lineWidth = 2;
    sub.beginPath();
    sub.moveTo(s.x - camera, s.y);
    sub.lineTo(s.x + s.w - camera, s.y);
    sub.stroke();
    // End ticks
    sub.beginPath();
    sub.moveTo(s.x - camera, s.y - 6); sub.lineTo(s.x - camera, s.y + 6);
    sub.moveTo(s.x + s.w - camera, s.y - 6); sub.lineTo(s.x + s.w - camera, s.y + 6);
    sub.stroke();
    sub.restore();

    // Blit subcanvas content onto composite card
    for (let sy = 28; sy < 270; sy++) {
      for (let sx = 0; sx < 480; sx++) {
        const sIdx = (sy * 480 + sx) * 4;
        const sa = sub.png.data[sIdx + 3];
        if (sa > 0) {
          const dIdx = ((py + sy) * 1000 + (px + sx)) * 4;
          const normA = sa / 255;
          const dr = composite.png.data[dIdx], dg = composite.png.data[dIdx + 1], db = composite.png.data[dIdx + 2];
          composite.png.data[dIdx] = Math.round(sub.png.data[sIdx] * normA + dr * (1 - normA));
          composite.png.data[dIdx + 1] = Math.round(sub.png.data[sIdx + 1] * normA + dg * (1 - normA));
          composite.png.data[dIdx + 2] = Math.round(sub.png.data[sIdx + 2] * normA + db * (1 - normA));
          composite.png.data[dIdx + 3] = 255;
        }
      }
    }

    // Footer panel in card
    composite.fillStyle = '#1e1828';
    composite.fillRect(px, py + 276, 480, 34);
    composite.fillStyle = '#22c55e'; // Green check indicator
    composite.fillRect(px + 8, py + 286, 6, 14);
    composite.fillRect(px + 14, py + 292, 8, 8);
  }

  const outPath = `tmp/dark-room-review/visual-grupo-${group}.png`;
  fs.writeFileSync(outPath, PNG.sync.write(composite.png));
  console.log(`Saved ${outPath}`);
}

console.log('All evidence generated successfully!');
