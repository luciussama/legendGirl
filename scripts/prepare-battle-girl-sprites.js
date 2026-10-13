import crypto from 'node:crypto';
import fs from 'node:fs';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const sourcePath = 'assets/art/toy-room/battle/girl/Girl fighting concept2.jpg';
const outputDirectory = 'assets/art/toy-room/battle/girl/runtime';
const source = jpeg.decode(fs.readFileSync(sourcePath), { useTArray: true });

const definitions = {
  idle: [
    [28, 60, 296, 304], [364, 58, 298, 305],
    [710, 60, 298, 304], [1048, 58, 297, 304]
  ],
  run: [[399, 1135, 291, 311], [58, 1136, 290, 310]],
  jump: [[714, 726, 266, 340], [1084, 728, 264, 345]],
  fall: [[1084, 728, 264, 345], [714, 726, 266, 340]],
  crouch: [[1450, 752, 282, 333]],
  attack: [
    [62, 418, 262, 306], [388, 414, 298, 308],
    [738, 410, 358, 310], [1128, 418, 384, 302],
    [1540, 414, 358, 306]
  ],
  damage: [[62, 418, 262, 306]]
};

function isBackground(red, green, blue) {
  return blue - red >= 5 && blue - green >= 3 && red > 55;
}

function extractFrame([left, top, width, height]) {
  const pixels = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    const sourceStart = ((top + y) * source.width + left) * 4;
    pixels.data.set(source.data.subarray(sourceStart, sourceStart + width * 4), y * width * 4);
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      if (isBackground(pixels.data[offset], pixels.data[offset + 1], pixels.data[offset + 2])) {
        pixels.data[offset + 3] = 0;
      }
    }
  }

  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels.data[(y * width + x) * 4 + 3] < 128) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < minX || maxY < minY) throw new Error(`Quadro vazio na região ${left},${top}.`);

  const frame = new PNG({ width: maxX - minX + 1, height: maxY - minY + 1 });
  PNG.bitblt(pixels, frame, minX, minY, frame.width, frame.height, 0, 0);
  return frame;
}

const frames = {};
for (const [pose, regions] of Object.entries(definitions)) {
  frames[pose] = regions.map((region, index) => {
    const frame = extractFrame(region);
    const name = `${pose}-${String(index + 1).padStart(2, '0')}.png`;
    fs.mkdirSync(outputDirectory, { recursive: true });
    fs.writeFileSync(`${outputDirectory}/${name}`, PNG.sync.write(frame));
    return {
      file: `girl/runtime/${name}`,
      width: frame.width,
      height: frame.height,
      anchorX: frame.width / 2,
      anchorY: frame.height
    };
  });
}

fs.writeFileSync('src/js/toy-room/BattleGirlFrames.js',
  `// Recortes da arte conceitual de combate, extraídos sem redesenhar os quadros.\n` +
  `export const BATTLE_GIRL_SOURCE_SHA256 = '${crypto.createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex')}';\n` +
  `export const BATTLE_GIRL_FRAMES = ${JSON.stringify(frames, null, 2)};\n`);

console.log(`Quadros da arte conceitual extraídos para ${outputDirectory}.`);
