import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIRECTIONS = ['right', 'left', 'up', 'down'];
const LOCOMOTION_COUNTS = { idle: 2, run: 9, jump: 6, fall: 6 };
const ATTACK_ANIMATIONS = ['prepare', 'mid', 'finish'];
const VALID_MODES = ['DISCOVERY', 'PARTIAL', 'COMPLETE'];
const VALID_RESULTS = ['PASS', 'FAIL', 'PENDING'];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const finite = value => Number.isFinite(value);
const unique = values => new Set(values).size === values.length;
const relativePath = (base, value) => path.resolve(base, value);
const exists = file => {
  try {
    return fs.statSync(file).isFile();
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
};

const itemResult = (name, result, details = {}) => ({ name, result, ...details });

function readSourceLock(manifest, repoRoot, results) {
  const pathValue = manifest.sourceLockPath;
  if (typeof pathValue !== 'string' || pathValue.length === 0) {
    results.push(itemResult('source-lock', 'FAIL', { message: 'sourceLockPath obrigatório ausente.' }));
    return null;
  }

  const lockFile = relativePath(repoRoot, pathValue);
  if (!exists(lockFile)) {
    results.push(itemResult('source-lock', 'FAIL', { path: pathValue, message: 'Trava da fonte não encontrada.' }));
    return null;
  }

  const lock = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
  if (lock.status !== 'PASS' || typeof lock.atlasPath !== 'string' ||
    typeof lock.atlasSha256 !== 'string' || typeof lock.metadataPath !== 'string' ||
    typeof lock.metadataSha256 !== 'string' || typeof lock.cycleId !== 'string' ||
    typeof lock.discoveryEvidence !== 'string') {
    results.push(itemResult('source-lock', 'FAIL', { path: pathValue, message: 'Trava incompleta ou não aprovada.' }));
    return null;
  }
  if (manifest.cycleId !== lock.cycleId) {
    results.push(itemResult('source-cycle', 'FAIL', {
      path: pathValue,
      message: 'Ciclo do manifesto diverge do ciclo da fonte travada.'
    }));
    return null;
  }
  const atlasFile = relativePath(repoRoot, lock.atlasPath);
  const metadataFile = relativePath(repoRoot, lock.metadataPath);
  if (!exists(atlasFile) || !exists(metadataFile)) {
    results.push(itemResult('source-lock', 'FAIL', {
      path: pathValue,
      message: 'Atlas ou metadados travados não existem.'
    }));
    return null;
  }
  const atlasSha256 = hash(fs.readFileSync(atlasFile));
  const metadataSha256 = hash(fs.readFileSync(metadataFile));
  if (atlasSha256 !== lock.atlasSha256 || metadataSha256 !== lock.metadataSha256) {
    results.push(itemResult('source-lock', 'FAIL', {
      path: pathValue,
      atlasSha256,
      metadataSha256,
      message: 'Hash do atlas ou metadados diverge da trava.'
    }));
    return null;
  }

  const discoveredFile = path.join(path.dirname(lockFile), 'discovered-source.json');
  if (!exists(discoveredFile)) {
    results.push(itemResult('source-discovery', 'FAIL', { message: 'Registro da descoberta ausente.' }));
    return null;
  }
  const discovered = JSON.parse(fs.readFileSync(discoveredFile, 'utf8'));
  if (discovered.status !== 'PASS' || discovered.path !== lock.atlasPath ||
    discovered.sha256 !== lock.atlasSha256 ||
    discovered.metadataPath !== lock.metadataPath ||
    discovered.metadataSha256 !== lock.metadataSha256) {
    results.push(itemResult('source-discovery', 'FAIL', {
      path: path.relative(repoRoot, discoveredFile),
      message: 'Descoberta e trava não identificam a mesma fonte.'
    }));
    return null;
  }
  const evidenceFile = relativePath(repoRoot, lock.discoveryEvidence);
  if (!exists(evidenceFile)) {
    results.push(itemResult('discovery-evidence', 'FAIL', {
      path: lock.discoveryEvidence,
      message: 'Evidências da descoberta não encontradas.'
    }));
    return null;
  }
  const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));
  if (evidence.cycleId !== lock.cycleId ||
    evidence.runtimeAtlas?.sha256 !== lock.atlasSha256 ||
    evidence.runtimeAtlas?.metadataSha256 !== lock.metadataSha256) {
    results.push(itemResult('discovery-evidence', 'FAIL', {
      path: lock.discoveryEvidence,
      message: 'Evidências não correspondem ao ciclo e aos hashes da trava.'
    }));
    return null;
  }

  results.push(itemResult('source-lock', 'PASS', {
    path: pathValue,
    atlasPath: lock.atlasPath,
    atlasSha256,
    metadataPath: lock.metadataPath,
    metadataSha256
  }));
  return { lock, lockFile };
}

function readCanonicalReference(source, repoRoot, results) {
  const file = path.join(path.dirname(source.lockFile), 'canonical-reference.json');
  if (!exists(file)) {
    results.push(itemResult('canonical-reference', 'PENDING', {
      message: 'Referência canônica ainda não foi gerada.'
    }));
    return null;
  }
  const canonical = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (canonical.source?.atlasPath !== source.lock.atlasPath ||
    canonical.source?.atlasSha256 !== source.lock.atlasSha256 ||
    canonical.source?.metadataSha256 !== source.lock.metadataSha256) {
    results.push(itemResult('canonical-reference', 'FAIL', {
      path: path.relative(repoRoot, file),
      message: 'Referência canônica está desatualizada para a fonte travada.'
    }));
    return null;
  }
  results.push(itemResult('canonical-reference', 'PASS', {
    path: path.relative(repoRoot, file),
    frameCount: canonical.outputs?.frames?.length || 0
  }));
  return canonical;
}

function requiredNamesFor(manifest) {
  const state = manifest.state;
  const directions = manifest.requiredDirections;
  const animations = manifest.requiredAnimations;
  if (state === 'STATE_CARRY' || state === 'STATE_SWORD') {
    const prefix = state === 'STATE_CARRY' ? 'carry' : 'sword';
    const names = [];
    for (const direction of directions) {
      for (const animation of animations) {
        const count = LOCOMOTION_COUNTS[animation];
        for (let index = 0; index < count; index++) {
          names.push(`${prefix}_${direction}_${animation}_${index}`);
        }
      }
    }
    return names;
  }
  if (state === 'STATE_ATTACK') {
    return directions.flatMap(direction =>
      animations.map(animation => `attack_${direction}_${animation}`));
  }
  return [];
}

function validateHeader(manifest, results) {
  for (const key of ['schemaVersion', 'cycleId', 'phase', 'mode', 'state', 'sourceLockPath']) {
    if (typeof manifest[key] !== 'string' || manifest[key].length === 0) {
      results.push(itemResult(`manifest.${key}`, 'FAIL', { message: `${key} obrigatório ausente.` }));
    }
  }
  if (!VALID_MODES.includes(manifest.mode)) {
    results.push(itemResult('manifest.mode', 'FAIL', { message: 'Modo inválido.' }));
  }
  if (!Array.isArray(manifest.requiredDirections) || !Array.isArray(manifest.requiredAnimations) ||
    !Array.isArray(manifest.requiredNames) || !Array.isArray(manifest.futureItems) ||
    !Array.isArray(manifest.entries) || !Array.isArray(manifest.requiredArtifacts)) {
    results.push(itemResult('manifest.scope', 'FAIL', {
      message: 'Escopo deve declarar requiredDirections, requiredAnimations, requiredNames, futureItems, entries e requiredArtifacts.'
    }));
    return false;
  }
  if (!unique(manifest.requiredDirections) || manifest.requiredDirections.some(direction => !DIRECTIONS.includes(direction))) {
    results.push(itemResult('manifest.requiredDirections', 'FAIL', { message: 'Direções inválidas ou repetidas.' }));
  }
  if (!unique(manifest.requiredAnimations)) {
    results.push(itemResult('manifest.requiredAnimations', 'FAIL', { message: 'Animações requeridas repetidas.' }));
  }

  if (manifest.mode === 'DISCOVERY') {
    if (manifest.requiredDirections.length || manifest.requiredAnimations.length ||
      manifest.requiredNames.length || manifest.entries.length) {
      results.push(itemResult('manifest.discovery-scope', 'FAIL', {
        message: 'DISCOVERY deve declarar zero sprites e escopo de produção vazio.'
      }));
    }
    if (manifest.requiredArtifacts.length === 0) {
      results.push(itemResult('manifest.requiredArtifacts', 'FAIL', {
        message: 'DISCOVERY deve declarar os artefatos documentais obrigatórios.'
      }));
    }
  } else {
    const allowedAnimations = manifest.state === 'STATE_ATTACK'
      ? ATTACK_ANIMATIONS
      : Object.keys(LOCOMOTION_COUNTS);
    if (!['STATE_CARRY', 'STATE_SWORD', 'STATE_ATTACK'].includes(manifest.state)) {
      results.push(itemResult('manifest.state', 'FAIL', { message: 'Estado de produção desconhecido.' }));
    }
    if (manifest.requiredDirections.length === 0 ||
      manifest.requiredAnimations.length === 0 ||
      manifest.requiredAnimations.some(animation => !allowedAnimations.includes(animation))) {
      results.push(itemResult('manifest.scope', 'FAIL', {
        message: 'A produção exige direções e animações válidas declaradas explicitamente.'
      }));
    }
    if (manifest.mode === 'COMPLETE' &&
      (manifest.requiredDirections.length !== DIRECTIONS.length ||
        DIRECTIONS.some(direction => !manifest.requiredDirections.includes(direction)) ||
        manifest.requiredAnimations.length !== allowedAnimations.length ||
        allowedAnimations.some(animation => !manifest.requiredAnimations.includes(animation)))) {
      results.push(itemResult('manifest.complete-scope', 'FAIL', {
        message: 'COMPLETE deve declarar as quatro direções e todas as animações contratuais.'
      }));
    }
    if (manifest.mode === 'COMPLETE' && manifest.futureItems.length > 0) {
      results.push(itemResult('manifest.futureItems', 'FAIL', {
        message: 'COMPLETE não pode declarar artefatos futuros pendentes.'
      }));
    }
    if (manifest.mode === 'PARTIAL' && manifest.requiredDirections.length < DIRECTIONS.length &&
      manifest.futureItems.length === 0) {
      results.push(itemResult('manifest.futureItems', 'FAIL', {
        message: 'PARTIAL deve declarar explicitamente as direções ou entregas futuras.'
      }));
    }
    const requiredNames = requiredNamesFor(manifest);
    if (requiredNames.length !== manifest.requiredNames.length ||
      !unique(manifest.requiredNames) ||
      requiredNames.some(name => !manifest.requiredNames.includes(name))) {
      results.push(itemResult('manifest.requiredNames', 'FAIL', {
        message: 'Nomes obrigatórios não correspondem ao contrato e ao escopo declarado.',
        expectedCount: requiredNames.length,
        declaredCount: manifest.requiredNames.length
      }));
    }
    if (manifest.mode === 'COMPLETE' && manifest.requiredNames.length !==
      (manifest.state === 'STATE_ATTACK' ? 12 : 92)) {
      results.push(itemResult('manifest.complete-count', 'FAIL', {
        message: 'COMPLETE exige 92 frames por família CARRY/SWORD ou 12 ATTACK.'
      }));
    }
    if (manifest.mode === 'PARTIAL' && manifest.state !== 'STATE_ATTACK' &&
      manifest.requiredNames.length !== manifest.requiredDirections.length * 23) {
      results.push(itemResult('manifest.partial-count', 'FAIL', {
        message: 'PARTIAL exige 23 frames completos por cada direção declarada.'
      }));
    }
    if (manifest.mode === 'PARTIAL' && manifest.state === 'STATE_ATTACK' &&
      manifest.requiredNames.length !== manifest.requiredDirections.length * 3) {
      results.push(itemResult('manifest.partial-count', 'FAIL', {
        message: 'ATTACK PARTIAL exige prepare, mid e finish por direção declarada.'
      }));
    }
  }
  return true;
}

function validateRequiredArtifacts(manifest, manifestDirectory, results) {
  if (!Array.isArray(manifest.requiredArtifacts)) return;
  for (const artifact of manifest.requiredArtifacts) {
    if (typeof artifact !== 'string' || artifact.length === 0) {
      results.push(itemResult('required-artifact', 'FAIL', { message: 'Caminho de artefato obrigatório inválido.' }));
      continue;
    }
    const file = relativePath(manifestDirectory, artifact);
    if (!exists(file)) {
      results.push(itemResult(artifact, 'FAIL', { message: 'Artefato obrigatório ausente.' }));
      continue;
    }
    const bytes = fs.readFileSync(file);
    results.push(itemResult(artifact, 'PASS', { sha256: hash(bytes) }));
  }
}

function validateEntry(entry, index, manifest, manifestDirectory, canonical, results) {
  const label = typeof entry?.name === 'string' ? entry.name : `entry[${index}]`;
  const failures = [];
  const fail = message => failures.push(message);
  if (!isObject(entry)) {
    results.push(itemResult(label, 'FAIL', { messages: ['Entrada inválida.'] }));
    return null;
  }
  for (const key of ['name', 'path', 'direction', 'animation', 'sha256']) {
    if (typeof entry[key] !== 'string' || entry[key].length === 0) fail(`${key} obrigatório ausente.`);
  }
  if (!Array.isArray(manifest.requiredNames) || !manifest.requiredNames.includes(entry.name)) {
    fail('Entrada não pertence a requiredNames.');
  }
  if (!Array.isArray(manifest.requiredDirections) || !manifest.requiredDirections.includes(entry.direction)) {
    fail('Direção fora do escopo declarado.');
  }
  if (!Array.isArray(manifest.requiredAnimations) || !manifest.requiredAnimations.includes(entry.animation)) {
    fail('Animação fora do escopo declarado.');
  }
  if (manifest.state === 'STATE_CARRY' && !entry.name.startsWith('carry_')) fail('Prefixo incompatível com STATE_CARRY.');
  if (manifest.state === 'STATE_SWORD' && !entry.name.startsWith('sword_')) fail('Prefixo incompatível com STATE_SWORD.');
  if (manifest.state === 'STATE_ATTACK' && !entry.name.startsWith('attack_')) fail('Prefixo incompatível com STATE_ATTACK.');
  if (['STATE_CARRY', 'STATE_SWORD'].includes(manifest.state)) {
    const prefix = manifest.state === 'STATE_CARRY' ? 'carry' : 'sword';
    const expectedIndex = Number(entry.index);
    const expectedName = `${prefix}_${entry.direction}_${entry.animation}_${expectedIndex}`;
    if (!Number.isInteger(expectedIndex) ||
      expectedIndex < 0 || expectedIndex >= LOCOMOTION_COUNTS[entry.animation] ||
      entry.name !== expectedName) {
      fail('Nome, índice, direção e animação não correspondem ao contrato.');
    }
    if (entry.sourceFrame !== `${entry.animation}_${expectedIndex}`) {
      fail('O frame deve herdar o índice oficial equivalente da mesma animação.');
    }
  } else if (manifest.state === 'STATE_ATTACK' &&
    entry.name !== `attack_${entry.direction}_${entry.animation}`) {
    fail('Nome ATTACK não corresponde à direção e ao estágio declarado.');
  }
  const expectedIdentityMode = ['up', 'down'].includes(entry.direction)
    ? 'directional_exception'
    : 'strict';
  if (entry.identityMode !== expectedIdentityMode) {
    fail(`identityMode deve ser ${expectedIdentityMode} para ${entry.direction}.`);
  }

  const imagePath = typeof entry.path === 'string' ? relativePath(manifestDirectory, entry.path) : '';
  if (!imagePath || !exists(imagePath)) {
    fail('PNG obrigatório ausente.');
    results.push(itemResult(label, 'FAIL', { messages: failures, path: entry.path }));
    return null;
  }
  const imageBytes = fs.readFileSync(imagePath);
  const imageHash = hash(imageBytes);
  if (imageHash !== entry.sha256) fail('Hash do PNG diverge do manifesto.');

  let image;
  try {
    image = PNG.sync.read(imageBytes);
  } catch (error) {
    results.push(itemResult(label, 'FAIL', {
      messages: [...failures, `PNG inválido: ${error.message}`],
      path: entry.path,
      sha256: imageHash
    }));
    return null;
  }
  if (image.width <= 0 || image.height <= 0) fail('Dimensões inválidas.');
  if (entry.dimensions?.width !== image.width || entry.dimensions?.height !== image.height) {
    fail('Dimensões reais divergem dos metadados.');
  }
  const anchor = entry.anchor?.final;
  const baseAnchor = entry.anchor?.base;
  const sourceOffset = entry.anchor?.sourceOffset;
  if (!isObject(anchor) || !finite(anchor.x) || !finite(anchor.y)) {
    fail('Âncora final resolvida obrigatória; TBD não é aceito.');
  }
  if (!isObject(baseAnchor) || !finite(baseAnchor.x) || !finite(baseAnchor.y) ||
    !isObject(sourceOffset) || !finite(sourceOffset.x) || !finite(sourceOffset.y)) {
    fail('baseAnchor e sourceOffset numéricos são obrigatórios.');
  }
  if (isObject(anchor) && finite(anchor.x) && finite(anchor.y) &&
    (anchor.x < 0 || anchor.y < 0 || anchor.x > image.width || anchor.y > image.height)) {
    fail('Âncora final fora dos limites do PNG.');
  }

  let visible = 0, transparent = 0, partialAlpha = 0;
  let minX = image.width, minY = image.height, maxX = -1, maxY = -1;
  let allBlack = true, allWhite = true;
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const pixel = (y * image.width + x) * 4;
      const alpha = image.data[pixel + 3];
      if (alpha === 0) {
        transparent++;
        continue;
      }
      if (alpha < 255) partialAlpha++;
      visible++;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      const [red, green, blue] = image.data.subarray(pixel, pixel + 3);
      if (red !== 0 || green !== 0 || blue !== 0) allBlack = false;
      if (red !== 255 || green !== 255 || blue !== 255) allWhite = false;
    }
  }
  if (visible === 0) fail('PNG totalmente transparente.');
  if (visible > 0 && allBlack) fail('Conteúdo visível totalmente preto.');
  if (visible > 0 && allWhite) fail('Conteúdo visível totalmente branco.');

  let reference = null;
  if (canonical && typeof entry.sourceFrame === 'string') {
    reference = canonical.outputs.frames.find(frame => frame.name === entry.sourceFrame) || null;
    if (!reference) fail(`Frame herdado não encontrado na referência: ${entry.sourceFrame}.`);
    else if (baseAnchor?.x !== reference.anchor.x || baseAnchor?.y !== reference.anchor.y) {
      fail('baseAnchor diverge da âncora do frame oficial herdado.');
    }
  } else {
    fail('sourceFrame é obrigatório e requer referência canônica vigente.');
  }
  if (!isObject(entry.inheritance) ||
    entry.inheritance.sourceFrame !== entry.sourceFrame ||
    !['none', 'mirror-x', 'directional-adaptation'].includes(entry.inheritance.transform)) {
    fail('Metadados de herança ausentes ou inválidos.');
  }
  const expectedTransform = entry.direction === 'left' ? 'mirror-x'
    : ['up', 'down'].includes(entry.direction) ? 'directional-adaptation'
      : 'none';
  if (entry.inheritance?.transform !== expectedTransform) {
    fail(`Transformação deve ser ${expectedTransform} para ${entry.direction}.`);
  }
  if (isObject(anchor) && isObject(baseAnchor) && isObject(sourceOffset) &&
    finite(anchor.x) && finite(anchor.y) && finite(baseAnchor.x) && finite(baseAnchor.y) &&
    finite(sourceOffset.x) && finite(sourceOffset.y) &&
    (sourceOffset.x !== anchor.x - baseAnchor.x || sourceOffset.y !== anchor.y - baseAnchor.y)) {
    fail('sourceOffset não corresponde à diferença entre baseAnchor e âncora final.');
  }
  if (['up', 'down'].includes(entry.direction)) {
    if (entry.inheritance?.transform !== 'directional-adaptation') {
      fail('UP/DOWN exigem adaptação direcional declarada.');
    }
    if (!entry.mask?.path || !entry.mask?.sha256) {
      fail('UP/DOWN exigem máscara por frame.');
    }
  }

  const maskResult = validateSidecar(entry.mask, manifestDirectory, 'máscara', failures,
    { width: image.width, height: image.height });
  const layerResults = [];
  if (entry.layers !== undefined && !Array.isArray(entry.layers)) {
    fail('layers deve ser uma lista.');
  } else {
    for (const layer of entry.layers || []) {
      layerResults.push(validateSidecar(layer, manifestDirectory, 'camada', failures));
    }
  }

  const boundingBox = visible ? {
    x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1
  } : null;
  const details = {
    path: entry.path,
    sha256: imageHash,
    rgbaSha256: hash(image.data),
    dimensions: { width: image.width, height: image.height },
    alpha: { visiblePixels: visible, transparentPixels: transparent, partialAlphaPixels: partialAlpha },
    boundingBox,
    mask: maskResult,
    layers: layerResults
  };
  results.push(itemResult(label, failures.length ? 'FAIL' : 'PASS', {
    ...details,
    ...(failures.length ? { messages: failures } : {})
  }));
  return {
    name: entry.name,
    direction: entry.direction,
    animation: entry.animation,
    index: entry.index,
    sha256: imageHash,
    rgbaSha256: hash(image.data),
    sourceFrame: entry.sourceFrame,
    result: failures.length ? 'FAIL' : 'PASS',
    boundingBox
  };
}

function validateSidecar(sidecar, manifestDirectory, label, failures, expectedDimensions = null) {
  if (sidecar === undefined || sidecar === null) return null;
  if (!isObject(sidecar) || typeof sidecar.path !== 'string' || typeof sidecar.sha256 !== 'string') {
    failures.push(`${label} inválida.`);
    return { result: 'FAIL' };
  }
  const file = relativePath(manifestDirectory, sidecar.path);
  if (!exists(file)) {
    failures.push(`${label} ausente.`);
    return { path: sidecar.path, result: 'FAIL' };
  }
  const bytes = fs.readFileSync(file);
  const actual = hash(bytes);
  if (actual !== sidecar.sha256) {
    failures.push(`Hash da ${label} diverge do manifesto.`);
    return { path: sidecar.path, sha256: actual, result: 'FAIL' };
  }
  if (label === 'máscara') {
    let mask;
    try {
      mask = PNG.sync.read(bytes);
    } catch (error) {
      failures.push(`PNG da máscara inválido: ${error.message}`);
      return { path: sidecar.path, sha256: actual, result: 'FAIL' };
    }
    if (mask.width !== expectedDimensions.width || mask.height !== expectedDimensions.height) {
      failures.push('Dimensões da máscara divergem do frame.');
      return { path: sidecar.path, sha256: actual, result: 'FAIL' };
    }
    const uniquePixels = new Set();
    let visiblePixels = 0;
    for (let pixel = 0; pixel < mask.data.length; pixel += 4) {
      const rgba = `${mask.data[pixel]},${mask.data[pixel + 1]},${mask.data[pixel + 2]},${mask.data[pixel + 3]}`;
      uniquePixels.add(rgba);
      if (mask.data[pixel + 3] > 0) visiblePixels++;
    }
    if (uniquePixels.size < 2 || visiblePixels === 0 ||
      visiblePixels === mask.width * mask.height) {
      failures.push('Máscara vazia, uniforme ou cobrindo o frame inteiro.');
      return { path: sidecar.path, sha256: actual, result: 'FAIL' };
    }
    return {
      path: sidecar.path,
      sha256: actual,
      result: 'PASS',
      dimensions: { width: mask.width, height: mask.height },
      visiblePixels,
      uniqueColors: uniquePixels.size
    };
  }
  return { path: sidecar.path, sha256: actual, result: 'PASS' };
}

function checkEntrySet(manifest, validatedEntries, results) {
  const declaredNames = manifest.requiredNames;
  const actualNames = (Array.isArray(manifest.entries) ? manifest.entries : [])
    .map(entry => entry?.name).filter(name => typeof name === 'string');
  if (!unique(actualNames)) {
    results.push(itemResult('entry-uniqueness', 'FAIL', { message: 'Nomes de sprites duplicados.' }));
  } else {
    results.push(itemResult('entry-uniqueness', 'PASS', { count: actualNames.length }));
  }
  const declaredPaths = (Array.isArray(manifest.entries) ? manifest.entries : [])
    .map(entry => entry?.path).filter(value => typeof value === 'string');
  if (!unique(declaredPaths)) {
    results.push(itemResult('path-uniqueness', 'FAIL', { message: 'Mais de um nome aponta ao mesmo arquivo.' }));
  } else {
    results.push(itemResult('path-uniqueness', 'PASS', { count: declaredPaths.length }));
  }
  for (const name of declaredNames) {
    const item = validatedEntries.find(entry => entry.name === name);
    if (!item) {
      results.push(itemResult(name, 'FAIL', { message: 'Sprite obrigatório ausente ou inválido.' }));
    }
  }
  for (const entry of Array.isArray(manifest.entries) ? manifest.entries : []) {
    if (entry?.name && !declaredNames.includes(entry.name)) {
      results.push(itemResult(entry.name, 'FAIL', { message: 'Sprite fora do escopo declarado.' }));
    }
  }

  const validEntries = validatedEntries.filter(entry => entry.result === 'PASS');
  const groups = new Map();
  for (const entry of validEntries) {
    const key = `${entry.direction}:${entry.animation}`;
    const group = groups.get(key) || [];
    group.push(entry);
    groups.set(key, group);
  }
  for (const [key, group] of groups) {
    if (group.length > 1 && new Set(group.map(entry => entry.rgbaSha256)).size === 1) {
      results.push(itemResult(`cycle:${key}`, 'FAIL', {
        message: 'A sequência inteira reutiliza os mesmos pixels RGBA; pose única não constitui ciclo.',
        frames: group.map(entry => entry.name)
      }));
    } else if (group.length > 1 && new Set(group.map(entry => entry.sourceFrame)).size === 1) {
      results.push(itemResult(`cycle:${key}`, 'FAIL', {
        message: 'A sequência herda a mesma pose oficial em todos os índices.',
        frames: group.map(entry => entry.name)
      }));
    } else if (group.length > 1) {
      results.push(itemResult(`cycle:${key}`, 'PASS', {
        distinctFrameHashes: new Set(group.map(entry => entry.sha256)).size,
        distinctRgbaHashes: new Set(group.map(entry => entry.rgbaSha256)).size,
        distinctSourceFrames: new Set(group.map(entry => entry.sourceFrame)).size
      }));
    }
  }
}

export function validateManifest(manifest, options = {}) {
  const repoRoot = options.repoRoot || root;
  const manifestDirectory = options.manifestDirectory || repoRoot;
  const results = [];
  if (!isObject(manifest)) {
    return {
      schemaVersion: '1.0',
      phase: 'UNKNOWN',
      mode: 'DISCOVERY',
      state: 'UNKNOWN',
      result: 'FAIL',
      phaseResult: 'FAIL',
      integrationAllowed: false,
      items: [itemResult('manifest', 'FAIL', { message: 'Manifesto deve ser um objeto JSON.' })],
      completeness: { result: 'PENDING', complete: false }
    };
  }

  validateHeader(manifest, results);
  const source = readSourceLock(manifest, repoRoot, results);
  const canonical = source ? readCanonicalReference(source, repoRoot, results) : null;
  validateRequiredArtifacts(manifest, manifestDirectory, results);
  const validatedEntries = [];
  for (let index = 0; index < (Array.isArray(manifest.entries) ? manifest.entries.length : 0); index++) {
    const entry = validateEntry(manifest.entries[index], index, manifest, manifestDirectory,
      canonical, results);
    if (entry) validatedEntries.push(entry);
  }
  if (Array.isArray(manifest.entries) && Array.isArray(manifest.requiredNames)) {
    checkEntrySet(manifest, validatedEntries, results);
  }

  const futureResults = (Array.isArray(manifest.futureItems) ? manifest.futureItems : []).map((future, index) =>
    itemResult(`future[${index}]`, 'PENDING', {
      item: typeof future === 'string' ? future : future?.name || future
    }));
  results.push(...futureResults);

  const failures = results.filter(item => item.result === 'FAIL');
  const technicalResult = failures.length ? 'FAIL' : 'PASS';
  const scopeValid = technicalResult === 'PASS' &&
    (!manifest.requiredNames?.length || manifest.requiredNames.every(name =>
      validatedEntries.some(entry => entry.name === name && entry.result === 'PASS')));
  const requiredTotal = manifest.state === 'STATE_ATTACK' ? 12 : 92;
  const complete = manifest.mode === 'COMPLETE' && scopeValid &&
    validatedEntries.filter(entry => entry.result === 'PASS').length === requiredTotal;
  let completenessResult = complete ? 'PASS' : 'PENDING';
  if (manifest.mode === 'COMPLETE' && !complete && technicalResult === 'PASS') completenessResult = 'FAIL';
  const phaseResult = technicalResult === 'FAIL'
    ? 'FAIL'
    : manifest.mode === 'DISCOVERY' || scopeValid ? 'PASS' : 'FAIL';

  const completeness = {
    state: manifest.state || 'UNKNOWN',
    mode: manifest.mode || 'DISCOVERY',
    scopedRequired: manifest.requiredNames?.length || 0,
    scopedValid: validatedEntries.filter(entry => entry.result === 'PASS').length,
    familyRequired: manifest.state === 'STATE_ATTACK' ? 12 :
      ['STATE_CARRY', 'STATE_SWORD'].includes(manifest.state) ? 92 : 0,
    familyComplete: complete,
    result: completenessResult
  };
  return {
    schemaVersion: '1.0',
    cycleId: manifest.cycleId || 'UNKNOWN',
    phase: manifest.phase || 'UNKNOWN',
    mode: VALID_MODES.includes(manifest.mode) ? manifest.mode : 'DISCOVERY',
    state: manifest.state || 'UNKNOWN',
    scope: {
      requiredDirections: manifest.requiredDirections || [],
      requiredAnimations: manifest.requiredAnimations || [],
      requiredNames: manifest.requiredNames || [],
      futureItems: manifest.futureItems || []
    },
    result: phaseResult,
    phaseResult,
    technicalResult,
    visualReviewResult: 'PENDING',
    integrationAllowed: false,
    completeness,
    hashes: {
      sourceLockPath: manifest.sourceLockPath || null,
      atlasSha256: source?.lock.atlasSha256 || null,
      metadataSha256: source?.lock.metadataSha256 || null,
      packageEntries: validatedEntries.map(entry => ({
        name: entry.name,
        sha256: entry.sha256,
        rgbaSha256: entry.rgbaSha256
      }))
    },
    items: results,
    validatedEntries
  };
}

function toMarkdown(report) {
  const rows = report.items.map(item =>
    `| \`${String(item.name).replaceAll('|', '\\|')}\` | ${item.result} | ${item.message || item.messages?.join('; ') || '—'} |`).join('\n');
  return `# Relatório do validador de estados

- Ciclo/fase: \`${report.cycleId}\` / \`${report.phase}\`
- Estado/modo: \`${report.state}\` / \`${report.mode}\`
- Resultado da fase: \`${report.phaseResult}\`
- Resultado técnico: \`${report.technicalResult}\`
- Revisão visual: \`${report.visualReviewResult}\`
- Completude final: \`${report.completeness.result}\` (${report.completeness.scopedValid}/${report.completeness.scopedRequired} no escopo; família ${report.completeness.familyRequired} frames)
- Integração permitida: \`${report.integrationAllowed}\`

| Item | Resultado | Evidência |
|---|---|---|
${rows}
`;
}

export function writeReports(report, outputDirectory) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, 'validator-report.json'),
    `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(outputDirectory, 'validator-report.md'), toMarkdown(report));
  const summary = {
    schemaVersion: report.schemaVersion,
    cycleId: report.cycleId,
    phase: report.phase,
    mode: report.mode,
    state: report.state,
    result: report.result,
    phaseResult: report.phaseResult,
    technicalResult: report.technicalResult,
    visualReviewResult: report.visualReviewResult,
    completeness: report.completeness,
    integrationAllowed: false,
    itemCounts: Object.fromEntries(VALID_RESULTS.map(result => [
      result,
      report.items.filter(item => item.result === result).length
    ]))
  };
  fs.writeFileSync(path.join(outputDirectory, 'validator-summary.json'),
    `${JSON.stringify(summary, null, 2)}\n`);
}

function parseArguments(args) {
  const options = {};
  for (let index = 0; index < args.length; index++) {
    const option = args[index];
    if (!['--manifest', '--output-dir'].includes(option) || !args[index + 1]) {
      throw new Error('Uso: node scripts/character-state-validator.js --manifest <caminho> --output-dir <diretório>');
    }
    const key = option === '--manifest' ? 'manifestPath' : 'outputDirectory';
    options[key] = args[++index];
  }
  if (!options.manifestPath || !options.outputDirectory) {
    throw new Error('Uso: node scripts/character-state-validator.js --manifest <caminho> --output-dir <diretório>');
  }
  return options;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = parseArguments(process.argv.slice(2));
  const manifestPath = path.resolve(options.manifestPath);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const report = validateManifest(manifest, {
    repoRoot: root,
    manifestDirectory: path.dirname(manifestPath)
  });
  writeReports(report, path.resolve(options.outputDirectory));
  console.log(`${report.phaseResult}: ${report.state} / ${report.mode}; integração bloqueada.`);
  if (report.technicalResult === 'FAIL') process.exitCode = 1;
}
