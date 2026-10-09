import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(root, 'docs/character-reference-atlas');
const canonical = JSON.parse(fs.readFileSync(path.join(outputRoot, 'canonical-reference.json'), 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readPng = relativePath => PNG.sync.read(fs.readFileSync(path.join(outputRoot, relativePath)));
const sourceBytes = fs.readFileSync(path.join(root, canonical.source.atlasPath));
assert.equal(hash(sourceBytes), canonical.source.atlasSha256, 'Hash do atlas runtime mudou.');
const atlas = PNG.sync.read(sourceBytes);
const framesByName = new Map(canonical.outputs.frames.map(frame => [frame.name, frame]));

assert.equal(canonical.inventory.frameCount, canonical.outputs.individualFrameCount);
assert.ok(canonical.outputs.frames.length > 0);
for (const frame of canonical.outputs.frames) {
  const outputBytes = fs.readFileSync(path.join(outputRoot, frame.path));
  assert.equal(hash(outputBytes), frame.pngSha256, `Hash divergente: ${frame.path}`);
  const output = PNG.sync.read(outputBytes);
  assert.deepEqual([output.width, output.height],
    [frame.dimensions.width, frame.dimensions.height], `Dimensões divergentes: ${frame.name}`);
  assert.equal(hash(output.data), frame.rgbaSha256, `RGBA divergente: ${frame.name}`);
  const { x, y, width, height } = frame.sourceFrame.atlas;
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const from = ((y + py) * atlas.width + x + px) * 4;
      const to = (py * width + px) * 4;
      assert.deepEqual(output.data.subarray(to, to + 4), atlas.data.subarray(from, from + 4),
        `Pixel alterado em ${frame.name} (${px},${py})`);
    }
  }
}

for (const [basename, sheet] of Object.entries(canonical.outputs.sheets)) {
  const [base, double, quadruple] = sheet.files;
  const baseImage = readPng(base.path);
  for (const scaled of [double, quadruple]) {
    const image = readPng(scaled.path);
    assert.deepEqual([image.width, image.height],
      [baseImage.width * scaled.scale, baseImage.height * scaled.scale],
      `Dimensões inválidas em ${scaled.path}`);
    for (let y = 0; y < baseImage.height; y++) {
      for (let x = 0; x < baseImage.width; x++) {
        const expected = (y * baseImage.width + x) * 4;
        for (let dy = 0; dy < scaled.scale; dy++) {
          for (let dx = 0; dx < scaled.scale; dx++) {
            const actual = ((y * scaled.scale + dy) * image.width +
              x * scaled.scale + dx) * 4;
            for (let channel = 0; channel < 4; channel++) {
              if (image.data[actual + channel] !== baseImage.data[expected + channel]) {
                throw new Error(`Escala não nearest-neighbor em ${basename}, fator ${scaled.scale}`);
              }
            }
          }
        }
      }
    }
  }
}

for (const output of canonical.outputs.hashes) {
  const bytes = fs.readFileSync(path.join(outputRoot, output.path));
  assert.equal(hash(bytes), output.sha256, `Hash de saída divergente: ${output.path}`);
}
assert.equal(canonical.validation.integrationAllowed, false);
assert.equal(canonical.validation.artApproval, 'PENDING');
console.log(`PASS: ${canonical.outputs.frames.length} recortes RGBA exatos; 21 pranchas nearest-neighbor íntegras.`);
