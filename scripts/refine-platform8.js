import fs from 'node:fs';
import { PNG } from 'pngjs';

// Reads the current sprite and produces a pristinely refined sprite
const srcPath = 'assets/art/dark-room/sprites/block_castle.png';
const src = PNG.sync.read(fs.readFileSync(srcPath));
const W = src.width, H = src.height;

const out = new PNG({ width: W, height: H });
// Start transparent
out.data.fill(0);

// Helper functions
function getSrc(x, y) {
  if (x < 0 || x >= W || y < 0 || y >= H) return [0, 0, 0, 0];
  const idx = (y * W + x) * 4;
  return [src.data[idx], src.data[idx+1], src.data[idx+2], src.data[idx+3]];
}

// 1. Identify outside background by flood filling from outer borders
const isOuterBg = new Uint8Array(W * H);
const q = [];

function isWhiteLike(x, y) {
  const [r, g, b, a] = getSrc(x, y);
  if (a < 20) return true;
  return (r > 185 && g > 185 && b > 180);
}

for (let x = 0; x < W; x++) {
  if (isWhiteLike(x, 0)) { isOuterBg[x] = 1; q.push(x, 0); }
  if (isWhiteLike(x, H - 1)) { isOuterBg[(H - 1) * W + x] = 1; q.push(x, H - 1); }
}
for (let y = 0; y < H; y++) {
  if (isWhiteLike(0, y) && !isOuterBg[y * W]) { isOuterBg[y * W] = 1; q.push(0, y); }
  if (isWhiteLike(W - 1, y) && !isOuterBg[y * W + W - 1]) { isOuterBg[y * W + W - 1] = 1; q.push(W - 1, y); }
}

let head = 0;
while (head < q.length) {
  const cx = q[head++], cy = q[head++];
  for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
    const nx = cx + dx, ny = cy + dy;
    if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
      const nIdx = ny * W + nx;
      if (!isOuterBg[nIdx] && isWhiteLike(nx, ny)) {
        isOuterBg[nIdx] = 1;
        q.push(nx, ny);
      }
    }
  }
}

// 2. Process every pixel
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4;
    const [r, g, b, a] = getSrc(x, y);

    // Completely clear stray sheet artifact at right
    if (x >= 196) continue;

    // Clear outer background
    if (isOuterBg[y * W + x]) continue;

    // Clear trapped white paper fill inside dome (y < 175)
    if (y < 175) {
      // Check if this pixel is near-white paper fill
      const isWhitePaper = (r > 185 && g > 185 && b > 180 && Math.abs(r - g) < 20 && Math.abs(r - b) < 20);
      if (isWhitePaper) {
        // Soft glass specular highlight vs raw paper:
        // The glass dome arc has a delicate sheen along the curvature:
        // Dist from center x=100.5
        const dxFromCenter = Math.abs(x - 100.5);
        const isDomeArch = (dxFromCenter > 60 && dxFromCenter < 78 && y > 25 && y < 165);
        if (isDomeArch) {
          // Subtle, delicate crystal glass glint
          out.data[idx] = 210;
          out.data[idx+1] = 230;
          out.data[idx+2] = 245;
          out.data[idx+3] = 45; // very subtle translucent sheen
        }
        continue;
      }
    }

    // Clear bottom white blocks around legs (y > 280)
    if (y > 280) {
      if (r > 175 && g > 175 && b > 165) continue;
      // Also, clear cut-off leg fragments below y=285 so the continuous turned legs attach cleanly
      if (y > 285) continue;
    }

    // De-fringe anti-aliasing against white background:
    // If a pixel has high luminance and borders an empty area, adjust its alpha to remove white halo
    let hasEmptyNeighbor = false;
    for (const [ndx, ndy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nx = x + ndx, ny = y + ndy;
      if (nx < 0 || nx >= W || ny < 0 || ny >= H || isOuterBg[ny * W + nx]) {
        hasEmptyNeighbor = true;
        break;
      }
    }

    if (hasEmptyNeighbor && r > 180 && g > 180 && b > 175) {
      // If it's a glass rim pixel
      if (y < 175) {
        out.data[idx] = Math.min(200, r);
        out.data[idx+1] = Math.min(220, g);
        out.data[idx+2] = Math.min(235, b);
        out.data[idx+3] = 90; // soft translucent edge
      } else {
        // Wood edge de-fringing
        out.data[idx] = 90;
        out.data[idx+1] = 50;
        out.data[idx+2] = 30;
        out.data[idx+3] = 160;
      }
      continue;
    }

    // Copy original subject pixel
    out.data[idx] = r;
    out.data[idx+1] = g;
    out.data[idx+2] = b;
    out.data[idx+3] = a;
  }
}

// 3. Add clean wooden mounting blocks at the base of the drawer (y = 280..285)
// for the legs to emerge naturally from:
// Left block: x = 36..52
// Right block: x = 149..165
for (let y = 280; y <= 285; y++) {
  for (let x = 36; x <= 52; x++) {
    const idx = (y * W + x) * 4;
    const isEdge = (x === 36 || x === 52 || y === 285);
    out.data[idx] = isEdge ? 45 : 75;
    out.data[idx+1] = isEdge ? 22 : 40;
    out.data[idx+2] = isEdge ? 14 : 25;
    out.data[idx+3] = 255;
  }
  for (let x = 149; x <= 165; x++) {
    const idx = (y * W + x) * 4;
    const isEdge = (x === 149 || x === 165 || y === 285);
    out.data[idx] = isEdge ? 45 : 85;
    out.data[idx+1] = isEdge ? 22 : 48;
    out.data[idx+2] = isEdge ? 14 : 30;
    out.data[idx+3] = 255;
  }
}

// Save refined sprite to block_castle.png and also music_box.png
const outBuf = PNG.sync.write(out);
fs.writeFileSync(srcPath, outBuf);
console.log(`Successfully updated ${srcPath} (${W}x${H})`);

// Also save to assets/art/dark-room/sprites/music_box_refined.png for evidence/comparison
fs.writeFileSync('tmp/music_box_refined.png', outBuf);
