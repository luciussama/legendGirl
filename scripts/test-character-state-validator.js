import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { validateManifest, writeReports } from './character-state-validator.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canonicalPath = path.join(root, 'docs/character-reference-atlas/canonical-reference.json');
const canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
const referenceByName = new Map(canonical.outputs.frames.map(frame => [frame.name, frame]));
const animations = { idle: 2, run: 9, jump: 6, fall: 6 };
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'character-state-validator-'));

const expectedNames = (directions, prefix = 'carry') => directions.flatMap(direction =>
  Object.entries(animations).flatMap(([animation, count]) =>
    Array.from({ length: count }, (_, index) => `${prefix}_${direction}_${animation}_${index}`)));

function createLocomotionPackage(base, directions, mode = 'PARTIAL', state = 'STATE_CARRY') {
  const prefix = state === 'STATE_SWORD' ? 'sword' : 'carry';
  const entries = [];
  for (const direction of directions) {
    for (const original of base.entries) {
      const entry = structuredClone(original);
      entry.name = entry.name.replace(/^carry_/, `${prefix}_`).replace('_right_', `_${direction}_`);
      entry.direction = direction;
      entry.identityMode = ['up', 'down'].includes(direction) ? 'directional_exception' : 'strict';
      entry.inheritance.transform = direction === 'left' ? 'mirror-x'
        : ['up', 'down'].includes(direction) ? 'directional-adaptation' : 'none';
      entry.path = `${entry.name}.png`;
      const imagePath = path.join(tempDirectory, entry.path);
      fs.copyFileSync(path.join(tempDirectory, original.path), imagePath);
      entry.sha256 = hash(fs.readFileSync(imagePath));
      delete entry.mask;
      if (['up', 'down'].includes(direction)) {
        const mask = new PNG({ width: entry.dimensions.width, height: entry.dimensions.height });
        const center = (Math.floor(mask.height / 2) * mask.width +
          Math.floor(mask.width / 2)) * 4;
        mask.data.set([255, 255, 255, 255], center);
        const bytes = PNG.sync.write(mask);
        entry.mask = { path: `${entry.name}-mask.png`, sha256: hash(bytes) };
        fs.writeFileSync(path.join(tempDirectory, entry.mask.path), bytes);
      }
      entries.push(entry);
    }
  }
  return {
    ...structuredClone(base),
    mode,
    state,
    requiredDirections: directions,
    requiredNames: expectedNames(directions, prefix),
    futureItems: mode === 'COMPLETE' ? [] : ['direções ou homologação futuras'],
    entries
  };
}

function createCompleteAttackManifest(base) {
  const directions = ['right', 'left', 'up', 'down'];
  const requiredAnimations = ['prepare', 'mid', 'finish'];
  const entries = [];
  for (const direction of directions) {
    for (const [index, animation] of requiredAnimations.entries()) {
      const source = base.entries.find(entry => entry.animation === 'run' && entry.index === index);
      const entry = structuredClone(source);
      const sourceFrame = `run_${index}`;
      const reference = referenceByName.get(sourceFrame);
      entry.name = `attack_${direction}_${animation}`;
      entry.path = `${entry.name}.png`;
      entry.direction = direction;
      entry.animation = animation;
      entry.sourceFrame = sourceFrame;
      entry.identityMode = ['up', 'down'].includes(direction) ? 'directional_exception' : 'strict';
      entry.inheritance = {
        sourceFrame,
        transform: direction === 'left' ? 'mirror-x'
          : ['up', 'down'].includes(direction) ? 'directional-adaptation' : 'none'
      };
      entry.anchor = {
        base: { x: reference.anchor.x, y: reference.anchor.y },
        final: { x: reference.anchor.x, y: reference.anchor.y },
        sourceOffset: { x: 0, y: 0 }
      };
      const sourcePath = path.join(tempDirectory, source.path);
      fs.copyFileSync(sourcePath, path.join(tempDirectory, entry.path));
      entry.sha256 = hash(fs.readFileSync(path.join(tempDirectory, entry.path)));
      delete entry.mask;
      if (['up', 'down'].includes(direction)) {
        const mask = new PNG({ width: entry.dimensions.width, height: entry.dimensions.height });
        const center = (Math.floor(mask.height / 2) * mask.width +
          Math.floor(mask.width / 2)) * 4;
        mask.data.set([255, 255, 255, 255], center);
        const bytes = PNG.sync.write(mask);
        entry.mask = { path: `${entry.name}-mask.png`, sha256: hash(bytes) };
        fs.writeFileSync(path.join(tempDirectory, entry.mask.path), bytes);
      }
      entries.push(entry);
    }
  }
  return {
    ...structuredClone(base),
    mode: 'COMPLETE',
    state: 'STATE_ATTACK',
    requiredDirections: directions,
    requiredAnimations,
    requiredNames: directions.flatMap(direction =>
      requiredAnimations.map(animation => `attack_${direction}_${animation}`)),
    futureItems: [],
    entries
  };
}

function createPartialManifest() {
  const directions = ['right'];
  const names = expectedNames(directions);
  const entries = names.map((name, index) => {
    const match = name.match(/^carry_(right)_(idle|run|jump|fall)_(\d+)$/);
    const [, direction, animation, indexText] = match;
    const frameIndex = Number(indexText);
    const sourceFrame = `${animation}_${frameIndex}`;
    const reference = referenceByName.get(sourceFrame);
    const sourcePng = PNG.sync.read(fs.readFileSync(path.join(root, 'docs/character-reference-atlas', reference.path)));
    sourcePng.data[0] = (sourcePng.data[0] + index + 1) % 254 + 1;
    sourcePng.data[1] = (sourcePng.data[1] + index + 1) % 254 + 1;
    const bytes = PNG.sync.write(sourcePng);
    const relative = `${name}.png`;
    fs.writeFileSync(path.join(tempDirectory, relative), bytes);
    return {
      name,
      path: relative,
      direction,
      animation,
      index: frameIndex,
      sha256: hash(bytes),
      dimensions: { width: sourcePng.width, height: sourcePng.height },
      anchor: {
        base: { x: reference.anchor.x, y: reference.anchor.y },
        final: { x: reference.anchor.x, y: reference.anchor.y },
        sourceOffset: { x: 0, y: 0 }
      },
      identityMode: 'strict',
      sourceFrame,
      inheritance: { sourceFrame, transform: 'none' }
    };
  });
  return {
    schemaVersion: '1.0',
    cycleId: canonical.cycleId,
    phase: '02B.0.2',
    mode: 'PARTIAL',
    state: 'STATE_CARRY',
    sourceLockPath: 'docs/character-reference-atlas/source-lock.json',
    requiredDirections: directions,
    requiredAnimations: Object.keys(animations),
    requiredNames: names,
    futureItems: ['CARRY left, up, down'],
    requiredArtifacts: [],
    entries
  };
}

try {
  const discovery = validateManifest({
    schemaVersion: '1.0',
    cycleId: canonical.cycleId,
    phase: '01.1',
    mode: 'DISCOVERY',
    state: 'SOURCE_REFERENCE',
    sourceLockPath: 'docs/character-reference-atlas/source-lock.json',
    requiredDirections: [],
    requiredAnimations: [],
    requiredNames: [],
    futureItems: ['produções futuras'],
    requiredArtifacts: [
      'docs/character-reference-atlas/discovery-evidence.json',
      'docs/character-reference-atlas/canonical-reference.json'
    ],
    entries: []
  }, { repoRoot: root, manifestDirectory: root });
  assert.equal(discovery.phaseResult, 'PASS');
  assert.equal(discovery.completeness.result, 'PENDING');
  assert.equal(discovery.items.find(item => item.name === 'future[0]').result, 'PENDING');
  assert.equal(discovery.integrationAllowed, false);

  const partial = createPartialManifest();
  const report = validateManifest(partial, { repoRoot: root, manifestDirectory: tempDirectory });
  assert.equal(report.phaseResult, 'PASS');
  assert.equal(report.technicalResult, 'PASS');
  assert.equal(report.completeness.scopedRequired, 23);
  assert.equal(report.completeness.familyComplete, false);
  assert.equal(report.completeness.result, 'PENDING');
  assert.equal(report.integrationAllowed, false);

  for (const directions of [
    ['right', 'left'],
    ['right', 'left', 'up'],
    ['right', 'left', 'up', 'down']
  ]) {
    const scoped = createLocomotionPackage(partial, directions);
    const scopedReport = validateManifest(scoped, {
      repoRoot: root,
      manifestDirectory: tempDirectory
    });
    assert.equal(scopedReport.technicalResult, 'PASS');
    assert.equal(scopedReport.completeness.scopedRequired, directions.length * 23);
    assert.equal(scopedReport.completeness.result, 'PENDING');
  }

  const completeCarry = createLocomotionPackage(partial,
    ['right', 'left', 'up', 'down'], 'COMPLETE');
  const completeCarryReport = validateManifest(completeCarry, {
    repoRoot: root,
    manifestDirectory: tempDirectory
  });
  assert.equal(completeCarryReport.phaseResult, 'PASS');
  assert.equal(completeCarryReport.completeness.result, 'PASS');
  assert.equal(completeCarryReport.integrationAllowed, false);

  const completeSword = createLocomotionPackage(partial,
    ['right', 'left', 'up', 'down'], 'COMPLETE', 'STATE_SWORD');
  const completeSwordReport = validateManifest(completeSword, {
    repoRoot: root,
    manifestDirectory: tempDirectory
  });
  assert.equal(completeSwordReport.phaseResult, 'PASS');
  assert.equal(completeSwordReport.completeness.result, 'PASS');

  const completeAttack = createCompleteAttackManifest(partial);
  const completeAttackReport = validateManifest(completeAttack, {
    repoRoot: root,
    manifestDirectory: tempDirectory
  });
  assert.equal(completeAttackReport.phaseResult, 'PASS');
  assert.equal(completeAttackReport.completeness.result, 'PASS');

  const up = structuredClone(partial);
  up.requiredDirections = ['up'];
  up.requiredNames = up.requiredNames.map(name => name.replace('carry_right_', 'carry_up_'));
  up.futureItems = ['CARRY left and down'];
  up.entries = up.entries.map(entry => {
    entry.name = entry.name.replace('carry_right_', 'carry_up_');
    entry.direction = 'up';
    entry.identityMode = 'directional_exception';
    entry.inheritance.transform = 'directional-adaptation';
    const frameMask = new PNG({ width: entry.dimensions.width, height: entry.dimensions.height });
    const center = (Math.floor(frameMask.height / 2) * frameMask.width +
      Math.floor(frameMask.width / 2)) * 4;
    frameMask.data.set([255, 255, 255, 255], center);
    const bytes = PNG.sync.write(frameMask);
    const maskPath = `${entry.name}-mask.png`;
    fs.writeFileSync(path.join(tempDirectory, maskPath), bytes);
    entry.mask = { path: maskPath, sha256: hash(bytes) };
    return entry;
  });
  assert.equal(validateManifest(up, {
    repoRoot: root,
    manifestDirectory: tempDirectory
  }).technicalResult, 'PASS');
  const invalidMask = structuredClone(up);
  const firstMask = invalidMask.entries[0].mask;
  const fullMask = new PNG({
    width: invalidMask.entries[0].dimensions.width,
    height: invalidMask.entries[0].dimensions.height
  });
  for (let pixel = 0; pixel < fullMask.data.length; pixel += 4) {
    fullMask.data.set([255, 255, 255, 255], pixel);
  }
  const fullMaskBytes = PNG.sync.write(fullMask);
  fs.writeFileSync(path.join(tempDirectory, firstMask.path), fullMaskBytes);
  invalidMask.entries[0].mask.sha256 = hash(fullMaskBytes);
  const invalidMaskReport = validateManifest(invalidMask, {
    repoRoot: root,
    manifestDirectory: tempDirectory
  });
  assert.equal(invalidMaskReport.technicalResult, 'FAIL');
  assert.ok(invalidMaskReport.items.some(item =>
    item.name === invalidMask.entries[0].name && item.messages?.some(message => message.includes('Máscara'))));

  const missing = structuredClone(partial);
  missing.requiredNames.pop();
  missing.entries.pop();
  assert.equal(validateManifest(missing, {
    repoRoot: root,
    manifestDirectory: tempDirectory
  }).technicalResult, 'FAIL');

  const frozenRun = structuredClone(partial);
  const runEntries = frozenRun.entries.filter(entry => entry.animation === 'run');
  const repeatedImage = new PNG({ width: 40, height: 60 });
  for (let y = 14; y < 46; y++) {
    for (let x = 13; x < 27; x++) {
      if ((x + y) % 3 !== 0) {
        const pixel = (y * repeatedImage.width + x) * 4;
        repeatedImage.data[pixel] = 148;
        repeatedImage.data[pixel + 1] = 76;
        repeatedImage.data[pixel + 2] = 119;
        repeatedImage.data[pixel + 3] = 255;
      }
    }
  }
  const repeatedBytes = [
    PNG.sync.write(repeatedImage, { filterType: 0 }),
    PNG.sync.write(repeatedImage, { filterType: 4 })
  ];
  assert.notEqual(hash(repeatedBytes[0]), hash(repeatedBytes[1]));
  const repeatedReference = referenceByName.get('run_0');
  for (const [index, entry] of runEntries.entries()) {
    const bytes = repeatedBytes[index % repeatedBytes.length];
    fs.writeFileSync(path.join(tempDirectory, entry.path), bytes);
    entry.sha256 = hash(bytes);
    entry.dimensions = { width: repeatedImage.width, height: repeatedImage.height };
    entry.anchor.base = { x: referenceByName.get(entry.sourceFrame).anchor.x,
      y: referenceByName.get(entry.sourceFrame).anchor.y };
    entry.anchor.final = { x: 20, y: 56 };
    entry.anchor.sourceOffset = {
      x: entry.anchor.final.x - entry.anchor.base.x,
      y: entry.anchor.final.y - entry.anchor.base.y
    };
  }
  const frozenReport = validateManifest(frozenRun, {
    repoRoot: root,
    manifestDirectory: tempDirectory
  });
  assert.equal(frozenReport.technicalResult, 'FAIL');
  assert.ok(frozenReport.items.some(item =>
    item.name === 'cycle:right:run' && item.result === 'FAIL'),
  JSON.stringify(frozenReport.items.filter(item => item.name.startsWith('cycle:') ||
    item.name.startsWith('carry_right_run_'))));

  const outputDirectory = path.join(tempDirectory, 'reports');
  writeReports(report, outputDirectory);
  for (const name of ['validator-report.json', 'validator-report.md', 'validator-summary.json']) {
    assert.ok(fs.statSync(path.join(outputDirectory, name)).isFile());
  }
  console.log('PASS: DISCOVERY, pacotes PARTIAL/COMPLETE, ATTACK, máscaras, ausência e ciclos congelados.');
} finally {
  fs.rmSync(tempDirectory, { recursive: true, force: true });
}
