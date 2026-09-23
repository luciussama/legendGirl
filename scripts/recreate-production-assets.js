/**
 * scripts/recreate-production-assets.js
 * Processes the 5 newly generated AAA storybook sheets, isolates each asset
 * with clean alpha transparency (unmultiplying white edges for zero halo),
 * exports each individual sprite to assets/art/dark-room/sprites/,
 * packs them into the master production spritesheet and updates the atlas.
 */

import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const SHEETS = [
  {
    path: 'src/assets/images/dr_platforms_a_1790109919135.jpg',
    items: [
      { name: 'giant_bear', alias: 'giant_bear', crop: [32, 56, 352, 432] },
      { name: 'open_books', alias: 'open_books', crop: [400, 152, 280, 304] },
      { name: 'vanity_table', alias: 'vanity_table', crop: [696, 32, 304, 480] },
      { name: 'cardboard_box', alias: 'cardboard_box', crop: [16, 584, 424, 352] },
      { name: 'messy_blocks', alias: 'messy_blocks', crop: [440, 664, 240, 256] },
      { name: 'toy_drum', alias: 'toy_drum', crop: [704, 624, 296, 304] }
    ]
  },
  {
    path: 'src/assets/images/dr_platforms_b_1790109930444.jpg',
    items: [
      { name: 'satin_cushion', alias: 'satin_cushion', crop: [8, 80, 408, 304] },
      { name: 'music_box', alias: 'music_box', crop: [408, 40, 304, 352] },
      { name: 'block_castle', alias: 'block_castle', crop: [744, 64, 264, 328] },
      { name: 'stepped_dresser', alias: 'stepped_dresser', crop: [40, 408, 440, 576] },
      { name: 'train_trestle', alias: 'train_trestle', crop: [488, 408, 464, 352] },
      { name: 'wall_shelf', alias: 'wall_shelf', crop: [592, 704, 392, 288] }
    ]
  },
  {
    path: 'src/assets/images/dr_platforms_c_1790109940179.jpg',
    items: [
      { name: 'mushroom_lamp', alias: 'mushroom_lamp', crop: [56, 48, 288, 344] },
      { name: 'dollhouse_roof', alias: 'dollhouse_roof', crop: [376, 24, 592, 344] },
      { name: 'wardrobe_portal', alias: 'wardrobe_portal', crop: [72, 408, 560, 200] },
      { name: 'spinning_globe', alias: 'spinning_globe', crop: [720, 368, 216, 312] },
      { name: 'floating_books', alias: 'floating_books', crop: [64, 640, 496, 328] },
      { name: 'kite_frame', alias: 'kite_frame', crop: [576, 688, 416, 280] }
    ]
  },
  {
    path: 'src/assets/images/dr_platforms_d_1790109949739.jpg',
    items: [
      { name: 'chandelier_crystals', alias: 'chandelier_crystals', crop: [112, 8, 296, 336] },
      { name: 'curtain_rod', alias: 'curtain_rod', crop: [496, 40, 496, 352] },
      { name: 'cuckoo_clock', alias: 'cuckoo_clock', crop: [80, 360, 200, 336] },
      { name: 'salto_final_sign', alias: 'salto_final_sign', crop: [632, 400, 328, 304] },
      { name: 'grand_portal_pedestal', alias: 'grand_portal_pedestal', crop: [248, 632, 520, 368] }
    ]
  },
  {
    path: 'src/assets/images/dr_scenery_props_1790109959135.jpg',
    items: [
      { name: 'mandala_rug', alias: 'mandala_rug', crop: [56, 24, 472, 472] },
      { name: 'false_door', alias: 'false_door', crop: [648, 40, 296, 384] },
      { name: 'floor_tiles', alias: 'floor_tiles', crop: [56, 520, 464, 472] },
      { name: 'retro_robot', alias: 'retro_robot', crop: [776, 448, 176, 312] },
      { name: 'plush_bunny', alias: 'plush_bunny', crop: [544, 728, 224, 264] }
    ]
  }
];

function isWhite(r, g, b, threshold = 238) {
  return r >= threshold && g >= threshold && b >= threshold;
}

function extractSprite(sheetData, sheetW, sheetH, crop) {
  const [cx, cy, cw, ch] = crop;
  const isOutside = new Uint8Array(cw * ch);
  const queue = [];

  // Seed boundary of crop
  for (let x = 0; x < cw; x++) {
    for (const y of [0, ch - 1]) {
      const idx = ((cy + y) * sheetW + (cx + x)) * 4;
      if (isWhite(sheetData[idx], sheetData[idx + 1], sheetData[idx + 2])) {
        isOutside[y * cw + x] = 1;
        queue.push(x, y);
      }
    }
  }
  for (let y = 0; y < ch; y++) {
    for (const x of [0, cw - 1]) {
      if (!isOutside[y * cw + x]) {
        const idx = ((cy + y) * sheetW + (cx + x)) * 4;
        if (isWhite(sheetData[idx], sheetData[idx + 1], sheetData[idx + 2])) {
          isOutside[y * cw + x] = 1;
          queue.push(x, y);
        }
      }
    }
  }

  // Flood fill outside
  let qHead = 0;
  while (qHead < queue.length) {
    const qx = queue[qHead++];
    const qy = queue[qHead++];
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nx = qx + dx;
      const ny = qy + dy;
      if (nx >= 0 && nx < cw && ny >= 0 && ny < ch) {
        const nIdx = ny * cw + nx;
        if (!isOutside[nIdx]) {
          const sIdx = ((cy + ny) * sheetW + (cx + nx)) * 4;
          if (isWhite(sheetData[sIdx], sheetData[sIdx + 1], sheetData[sIdx + 2])) {
            isOutside[nIdx] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  // Build RGBA with unmultiplied alpha along the edge
  const rawRgba = new Uint8Array(cw * ch * 4);
  let minX = cw, maxX = 0, minY = ch, maxY = 0;
  let hasContent = false;

  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const nIdx = y * cw + x;
      const sIdx = ((cy + y) * sheetW + (cx + x)) * 4;
      const dIdx = nIdx * 4;
      const r = sheetData[sIdx];
      const g = sheetData[sIdx + 1];
      const b = sheetData[sIdx + 2];

      if (isOutside[nIdx]) {
        rawRgba[dIdx] = 0;
        rawRgba[dIdx + 1] = 0;
        rawRgba[dIdx + 2] = 0;
        rawRgba[dIdx + 3] = 0;
      } else {
        // Check if on boundary for anti-aliasing
        let nearOutside = false;
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= cw || ny < 0 || ny >= ch || isOutside[ny * cw + nx]) {
            nearOutside = true;
            break;
          }
        }

        let alpha = 255;
        let outR = r, outG = g, outB = b;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (nearOutside && brightness > 210) {
          // Smooth alpha transition to prevent any white edge halo
          alpha = Math.max(0, Math.min(255, Math.round(255 * (1 - (brightness - 210) / 45))));
          if (alpha > 0) {
            // Unmultiply white
            const aNorm = alpha / 255;
            outR = Math.min(255, Math.max(0, Math.round((r - 255 * (1 - aNorm)) / aNorm)));
            outG = Math.min(255, Math.max(0, Math.round((g - 255 * (1 - aNorm)) / aNorm)));
            outB = Math.min(255, Math.max(0, Math.round((b - 255 * (1 - aNorm)) / aNorm)));
          }
        }

        rawRgba[dIdx] = outR;
        rawRgba[dIdx + 1] = outG;
        rawRgba[dIdx + 2] = outB;
        rawRgba[dIdx + 3] = alpha;

        if (alpha > 10) {
          hasContent = true;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }
  }

  if (!hasContent) {
    return { width: cw, height: ch, data: rawRgba };
  }

  // Trim transparent padding with 2px safety border
  const pad = 2;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(cw - 1, maxX + pad);
  maxY = Math.min(ch - 1, maxY + pad);

  const tw = maxX - minX + 1;
  const th = maxY - minY + 1;
  const trimmed = new Uint8Array(tw * th * 4);

  for (let y = 0; y < th; y++) {
    const srcRow = ((minY + y) * cw + minX) * 4;
    const dstRow = (y * tw) * 4;
    trimmed.set(rawRgba.subarray(srcRow, srcRow + tw * 4), dstRow);
  }

  return { width: tw, height: th, data: trimmed };
}

function savePng(filename, width, height, data) {
  const png = new PNG({ width, height });
  png.data = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, PNG.sync.write(png));
}

async function run() {
  console.log('Recreating individual production assets from generated sheets...');
  const outDir = 'assets/art/dark-room/sprites';
  fs.mkdirSync(outDir, { recursive: true });

  const extractedSprites = [];

  for (const sheet of SHEETS) {
    console.log(`Loading sheet: ${sheet.path}...`);
    const imgData = fs.readFileSync(sheet.path);
    const decoded = jpeg.decode(imgData, { useTArray: true });
    const { width: sw, height: sh, data } = decoded;

    for (const item of sheet.items) {
      console.log(`  Extracting ${item.name}...`);
      const sprite = extractSprite(data, sw, sh, item.crop);
      const outPath = path.join(outDir, `${item.name}.png`);
      savePng(outPath, sprite.width, sprite.height, sprite.data);
      extractedSprites.push({
        name: item.name,
        alias: item.alias,
        width: sprite.width,
        height: sprite.height,
        data: sprite.data,
        file: outPath
      });
      console.log(`    Saved ${outPath} (${sprite.width}x${sprite.height})`);
    }
  }

  // Pack into clean master spritesheet
  console.log(`Packing ${extractedSprites.length} assets into master production spritesheet...`);
  const SHEET_W = 1600;
  const pad = 8;
  let curX = pad;
  let curY = pad;
  let rowH = 0;

  const placedSprites = [];
  for (const s of extractedSprites) {
    if (curX + s.width + pad > SHEET_W) {
      curX = pad;
      curY += rowH + pad;
      rowH = 0;
    }
    placedSprites.push({
      ...s,
      x: curX,
      y: curY
    });
    curX += s.width + pad;
    rowH = Math.max(rowH, s.height);
  }

  const SHEET_H = curY + rowH + pad;
  console.log(`Master spritesheet dimensions: ${SHEET_W}x${SHEET_H}`);

  const masterRgba = new Uint8Array(SHEET_W * SHEET_H * 4);
  for (const s of placedSprites) {
    for (let y = 0; y < s.height; y++) {
      const srcIdx = (y * s.width) * 4;
      const dstIdx = ((s.y + y) * SHEET_W + s.x) * 4;
      masterRgba.set(s.data.subarray(srcIdx, srcIdx + s.width * 4), dstIdx);
    }
  }

  const masterPath = 'assets/art/dark-room/production-spritesheet.png';
  savePng(masterPath, SHEET_W, SHEET_H, masterRgba);
  savePng('assets/art/dark-room/environment-assets.png', SHEET_W, SHEET_H, masterRgba);
  console.log(`Saved master spritesheets to ${masterPath} and environment-assets.png`);

  // Build Atlas Dictionary
  const atlas = {};
  for (const s of placedSprites) {
    atlas[s.alias] = {
      x: s.x,
      y: s.y,
      width: s.width,
      height: s.height,
      file: `assets/art/dark-room/sprites/${s.name}.png`
    };
    if (s.name !== s.alias) {
      atlas[s.name] = atlas[s.alias];
    }
  }

  // Aliases for complete engine compatibility
  const aliases = {
    wardrobe_ledge: 'wardrobe_portal',
    true_portal: 'grand_portal_pedestal',
    trueExitDoor: 'grand_portal_pedestal',
    fake_exit_poster: 'false_door',
    exitDoor: 'false_door',
    room_door: 'false_door',
    rug: 'mandala_rug',
    rugs: 'mandala_rug',
    fluffy_rug: 'mandala_rug',
    room_scenery: 'retro_robot'
  };
  for (const [k, target] of Object.entries(aliases)) {
    if (atlas[target] && !atlas[k]) {
      atlas[k] = atlas[target];
    }
  }

  // Write JSON atlas
  fs.writeFileSync('assets/art/dark-room/darkRoomAtlas.json', JSON.stringify({
    sheet: masterPath,
    width: SHEET_W,
    height: SHEET_H,
    sprites: atlas
  }, null, 2));
  console.log('Saved assets/art/dark-room/darkRoomAtlas.json');

  // Write JS atlas
  const jsAtlas = `/**
 * darkRoomAtlas.js
 * Dicionário canônico de produção com todos os sprites isolados
 * e transparentes gerados a partir do pacote de arte dark-room.
 */

export const SHEET_WIDTH = ${SHEET_W};
export const SHEET_HEIGHT = ${SHEET_H};
export const SPRITESHEET_PATH = 'assets/art/dark-room/production-spritesheet.png';

export const darkRoomAtlas = ${JSON.stringify(atlas, null, 2)};

export function validateAtlasRegion(region, sheetW = SHEET_WIDTH, sheetH = SHEET_HEIGHT) {
  if (!region || typeof region !== 'object') return false;
  const { x, y, width, height } = region;
  if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') return false;
  if (x < 0 || y < 0 || width <= 0 || height <= 0) return false;
  if (x + width > sheetW || y + height > sheetH) return false;
  return true;
}

export function getDarkRoomAtlasRegion(key) {
  if (!key || typeof key !== 'string') return null;
  const direct = darkRoomAtlas[key];
  if (direct) return direct;
  const lower = key.toLowerCase();
  if (darkRoomAtlas[lower]) return darkRoomAtlas[lower];
  const underscore = lower.replace(/-/g, '_');
  if (darkRoomAtlas[underscore]) return darkRoomAtlas[underscore];
  return null;
}
`;
  fs.writeFileSync('src/js/assets/darkRoomAtlas.js', jsAtlas);
  console.log('Updated src/js/assets/darkRoomAtlas.js');
}

run().catch(console.error);
