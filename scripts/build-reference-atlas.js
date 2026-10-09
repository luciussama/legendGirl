import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';
import { OFFICIAL_FRAMES } from '../src/js/assets/officialCharacter.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(root, 'docs/character-reference-atlas');
const lockPath = path.join(outputRoot, 'source-lock.json');
const discoveredPath = path.join(outputRoot, 'discovered-source.json');
const evidencePath = path.join(outputRoot, 'discovery-evidence.json');
const outputRootRelative = path.relative(root, outputRoot);
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const resolveRepoPath = value => path.join(root, value);
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const lock = readJson(lockPath);
const discovered = readJson(discoveredPath);
const evidence = readJson(evidencePath);
assert(lock.status === 'PASS' && discovered.status === 'PASS', 'A descoberta 01A.0 precisa estar PASS.');
assert(lock.atlasPath === discovered.path && lock.atlasSha256 === discovered.sha256,
  'A fonte descoberta diverge da trava.');
assert(lock.metadataPath === discovered.metadataPath && lock.metadataSha256 === discovered.metadataSha256,
  'Os metadados descobertos divergem da trava.');
assert(lock.discoveryEvidence === 'docs/character-reference-atlas/discovery-evidence.json',
  'A trava não referencia as evidências esperadas.');

const atlasBytes = fs.readFileSync(resolveRepoPath(lock.atlasPath));
const metadataBytes = fs.readFileSync(resolveRepoPath(lock.metadataPath));
assert(hash(atlasBytes) === lock.atlasSha256, 'Hash do atlas diverge da trava; interrompendo.');
assert(hash(metadataBytes) === lock.metadataSha256, 'Hash dos metadados diverge da trava; interrompendo.');
const atlas = PNG.sync.read(atlasBytes);
const sourcePath = evidence.sourceBoard.path;
const sourceBytes = fs.readFileSync(resolveRepoPath(sourcePath));
assert(hash(sourceBytes) === evidence.sourceBoard.sha256, 'Hash da prancha fonte diverge das evidências.');
const source = sourceBytes[0] === 0xff ? jpeg.decode(sourceBytes) : PNG.sync.read(sourceBytes);

const rgbaFor = frame => {
  assert(Number.isInteger(frame.x) && Number.isInteger(frame.y) &&
    Number.isInteger(frame.w) && Number.isInteger(frame.h) &&
    frame.x >= 0 && frame.y >= 0 && frame.w > 0 && frame.h > 0 &&
    frame.x + frame.w <= atlas.width && frame.y + frame.h <= atlas.height,
  'Recorte oficial fora dos limites do atlas.');
  assert(Number.isFinite(frame.anchorX) && Number.isFinite(frame.anchorY), 'Âncora inválida.');
  assert(Array.isArray(frame.source) && frame.source.length === 4 &&
    frame.source.every(Number.isInteger) && frame.source[0] >= 0 && frame.source[1] >= 0 &&
    frame.source[2] === frame.w && frame.source[3] === frame.h &&
    frame.source[0] + frame.source[2] <= source.width &&
    frame.source[1] + frame.source[3] <= source.height,
  'Coordenadas de origem inválidas.');

  const pixels = new PNG({ width: frame.w, height: frame.h });
  PNG.bitblt(atlas, pixels, frame.x, frame.y, frame.w, frame.h, 0, 0);
  let minX = frame.w, minY = frame.h, maxX = -1, maxY = -1;
  let opaquePixels = 0, translucentPixels = 0, transparentPixels = 0;
  let opaqueBorderPixels = 0, borderPixels = 0;
  for (let y = 0; y < frame.h; y++) {
    for (let x = 0; x < frame.w; x++) {
      const alpha = pixels.data[(y * frame.w + x) * 4 + 3];
      if (x === 0 || y === 0 || x === frame.w - 1 || y === frame.h - 1) {
        borderPixels++;
        if (alpha > 0) opaqueBorderPixels++;
      }
      if (alpha === 255) {
        opaquePixels++;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      } else if (alpha > 0) {
        translucentPixels++;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      } else {
        transparentPixels++;
      }
    }
  }
  assert(maxX >= minX && opaquePixels + translucentPixels > 0,
    'Frame vazio ou totalmente transparente.');
  return {
    pixels,
    rgbaSha256: hash(pixels.data),
    alpha: { opaquePixels, translucentPixels, transparentPixels },
    edgeAlphaEvidence: { opaqueBorderPixels, borderPixels },
    boundingBox: { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
  };
};

const records = [];
const framesByState = {};
const pixelOwners = new Map();
for (const [state, frames] of Object.entries(OFFICIAL_FRAMES)) {
  assert(Array.isArray(frames) && frames.length > 0, `Estado sem frames: ${state}`);
  framesByState[state] = [];
  for (let index = 0; index < frames.length; index++) {
    const frame = frames[index];
    const extracted = rgbaFor(frame);
    const name = `${state}_${index}`;
    const relativePath = `frames/${state}/${name}.png`;
    const pngBytes = PNG.sync.write(extracted.pixels);
    fs.mkdirSync(path.dirname(resolveRepoPath(`${outputRootRelative}/${relativePath}`)), { recursive: true });
    fs.writeFileSync(resolveRepoPath(`${outputRootRelative}/${relativePath}`), pngBytes);
    const aliasOf = pixelOwners.get(extracted.rgbaSha256) || null;
    if (!aliasOf) pixelOwners.set(extracted.rgbaSha256, name);
    const record = {
      name,
      state,
      index,
      path: relativePath,
      sourceFrame: {
        atlas: { x: frame.x, y: frame.y, width: frame.w, height: frame.h },
        originalBoard: {
          x: frame.source[0],
          y: frame.source[1],
          width: frame.source[2],
          height: frame.source[3]
        }
      },
      dimensions: { width: frame.w, height: frame.h },
      anchor: { x: frame.anchorX, y: frame.anchorY },
      rgbaSha256: extracted.rgbaSha256,
      pngSha256: hash(pngBytes),
      alpha: extracted.alpha,
      edgeAlphaEvidence: extracted.edgeAlphaEvidence,
      boundingBox: extracted.boundingBox,
      ...(aliasOf ? { exactPixelAliasOf: aliasOf } : {})
    };
    records.push(record);
    framesByState[state].push({ record, pixels: extracted.pixels });
  }
}

const background = [244, 240, 227, 255];
const gap = 8;
const columns = 9;
const contactSheet = items => {
  assert(items.length > 0, 'Não há frames para montar a prancha.');
  const cellWidth = Math.max(...items.map(item => item.pixels.width));
  const cellHeight = Math.max(...items.map(item => item.pixels.height));
  const rows = Math.ceil(items.length / columns);
  const sheet = new PNG({
    width: columns * cellWidth + (columns + 1) * gap,
    height: rows * cellHeight + (rows + 1) * gap
  });
  for (let i = 0; i < sheet.width * sheet.height; i++) {
    sheet.data.set(background, i * 4);
  }
  const layout = [];
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = gap + column * cellWidth + Math.floor((cellWidth - item.pixels.width) / 2);
    const y = gap + row * cellHeight + cellHeight - item.record.anchor.y;
    PNG.bitblt(item.pixels, sheet, 0, 0, item.pixels.width, item.pixels.height, x, y);
    layout.push({ name: item.record.name, row, column, x, y });
  }
  return { sheet, layout };
};

const comparisonSheet = items => {
  assert(items.length > 0, 'Não há frames para montar a comparação.');
  const pairWidth = Math.max(...items.map(item => item.pixels.width));
  const cellHeight = Math.max(...items.map(item => item.pixels.height));
  const pairGap = 4;
  const cardGap = 8;
  const pairColumns = 6;
  const cardWidth = pairWidth * 2 + pairGap;
  const rows = Math.ceil(items.length / pairColumns);
  const sheet = new PNG({
    width: pairColumns * cardWidth + (pairColumns + 1) * cardGap,
    height: rows * cellHeight + (rows + 1) * cardGap
  });
  for (let i = 0; i < sheet.width * sheet.height; i++) {
    sheet.data.set(background, i * 4);
  }
  const layout = [];
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    const column = index % pairColumns;
    const row = Math.floor(index / pairColumns);
    const cardX = cardGap + column * cardWidth;
    const cardY = cardGap + row * cellHeight;
    const { x: sx, y: sy, width: sw, height: sh } = item.record.sourceFrame.originalBoard;
    const sourceCrop = new PNG({ width: sw, height: sh });
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const from = ((sy + y) * source.width + sx + x) * source.data.length / (source.width * source.height);
        const to = (y * sw + x) * 4;
        sourceCrop.data[to] = source.data[from];
        sourceCrop.data[to + 1] = source.data[from + 1];
        sourceCrop.data[to + 2] = source.data[from + 2];
        sourceCrop.data[to + 3] = 255;
      }
    }
    const sourceY = cardY + cellHeight - sourceCrop.height;
    const atlasY = cardY + cellHeight - item.record.anchor.y;
    PNG.bitblt(sourceCrop, sheet, 0, 0, sw, sh, cardX + Math.floor((pairWidth - sw) / 2), sourceY);
    PNG.bitblt(item.pixels, sheet, 0, 0, item.pixels.width, item.pixels.height,
      cardX + pairWidth + pairGap + Math.floor((pairWidth - item.pixels.width) / 2), atlasY);
    layout.push({
      name: item.record.name,
      row,
      column,
      source: { x: cardX, y: sourceY, width: sw, height: sh },
      extracted: { x: cardX + pairWidth + pairGap, y: atlasY }
    });
  }
  return { sheet, layout };
};

const scaleNearest = (input, factor) => {
  if (factor === 1) return input;
  const output = new PNG({ width: input.width * factor, height: input.height * factor });
  for (let y = 0; y < input.height; y++) {
    for (let x = 0; x < input.width; x++) {
      const from = (y * input.width + x) * 4;
      for (let dy = 0; dy < factor; dy++) {
        for (let dx = 0; dx < factor; dx++) {
          const to = ((y * factor + dy) * output.width + x * factor + dx) * 4;
          output.data.set(input.data.subarray(from, from + 4), to);
        }
      }
    }
  }
  return output;
};

const sheetDefinitions = [
  ['01-idle-sheet', framesByState.idle || []],
  ['02-run-sheet', framesByState.run || []],
  ['03-jump-sheet', [
    ...(framesByState.jump || []),
    ...(framesByState.jump_short || []),
    ...(framesByState.high_jump || [])
  ]],
  ['04-fall-sheet', framesByState.fall || []],
  ['05-collect-sheet', framesByState.collect || []],
  ['06-all-frames-sheet', Object.values(framesByState).flat()],
  ['07-reference-comparison', Object.values(framesByState).flat()]
];
const sheetLayouts = {};
const sheetArtifacts = {};
for (const [basename, items] of sheetDefinitions) {
  const result = basename === '07-reference-comparison'
    ? comparisonSheet(items)
    : contactSheet(items);
  sheetLayouts[basename] = result.layout;
  sheetArtifacts[basename] = [];
  for (const scale of [1, 2, 4]) {
    const suffix = scale === 1 ? '' : `-${scale * 100}`;
    const relativePath = `${basename}${suffix}.png`;
    const image = scaleNearest(result.sheet, scale);
    const bytes = PNG.sync.write(image);
    fs.writeFileSync(resolveRepoPath(`${outputRootRelative}/${relativePath}`), bytes);
    sheetArtifacts[basename].push({
      path: relativePath,
      scale,
      width: image.width,
      height: image.height,
      sha256: hash(bytes)
    });
  }
}

const sourceUsage = fs.readFileSync(resolveRepoPath('assets/manifest.json'), 'utf8');
assert(sourceUsage.includes(lock.atlasPath), 'O manifesto deixou de referenciar a fonte travada.');
const finalAtlasHash = hash(fs.readFileSync(resolveRepoPath(lock.atlasPath)));
const finalMetadataHash = hash(fs.readFileSync(resolveRepoPath(lock.metadataPath)));
const finalSourceBoardHash = hash(fs.readFileSync(resolveRepoPath(sourcePath)));
assert(finalAtlasHash === lock.atlasSha256 && finalMetadataHash === lock.metadataSha256 &&
  finalSourceBoardHash === evidence.sourceBoard.sha256,
'A fonte, os metadados ou a prancha mudaram durante a extração.');

const stateInventory = Object.entries(framesByState).map(([state, entries]) => {
  const runtimeHits = [];
  for (const file of ['src/js/entities/BabyRenderer.js', 'src/js/toy-room/ToyCarryPresentation.js']) {
    const lines = fs.readFileSync(resolveRepoPath(file), 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (line.includes(`'${state}'`) || line.includes(`"${state}"`) ||
        line.includes(`OFFICIAL_FRAMES.${state}`) || line.includes(`OFFICIAL_FRAMES['${state}']`)) {
        runtimeHits.push({ path: file, line: index + 1 });
      }
    });
  }
  return {
    state,
    frameCount: entries.length,
    animationType: entries.length > 1 ? 'sequence' : 'isolated_frame',
    exactAliases: entries
      .filter(entry => entry.record.exactPixelAliasOf)
      .map(entry => ({ name: entry.record.name, aliasOf: entry.record.exactPixelAliasOf })),
    runtimeEvidence: runtimeHits
  };
});
const familyQueries = ['walk_up', 'walk_down', 'carry', 'sword', 'attack'];
const familyDiscovery = familyQueries.map(name => {
  const matches = Object.keys(OFFICIAL_FRAMES)
    .filter(state => state === name || state.startsWith(`${name}_`));
  return { query: name, matchingStateKeys: matches, discovery: matches.length ? 'FOUND' : 'NOT_FOUND' };
});
const runtimeEvidence = (file, snippet) => {
  const lines = fs.readFileSync(resolveRepoPath(file), 'utf8').split(/\r?\n/);
  const line = lines.findIndex(value => value.includes(snippet));
  return line < 0 ? null : { path: file, line: line + 1 };
};
const collectLocomotionEvidence = [
  runtimeEvidence('src/js/entities/BabyRenderer.js',
    'baby.isCollecting && baby.onGround && Math.abs(baby.vx) <= 0.05'),
  runtimeEvidence('src/js/toy-room/ToyCarryPresentation.js',
    "player.isMoving ? 'run' : toy ? 'collect' : 'idle'")
].filter(Boolean);
const pngRecords = records.map(({ path: framePath, pngSha256 }) => ({ path: framePath, sha256: pngSha256 }));
const canonical = {
  schemaVersion: '1.0',
  cycleId: lock.cycleId,
  generatedAt: new Date().toISOString(),
  mode: 'DISCOVERY',
  source: {
    atlasPath: lock.atlasPath,
    atlasSha256: lock.atlasSha256,
    atlasDimensions: { width: atlas.width, height: atlas.height },
    metadataPath: lock.metadataPath,
    metadataSha256: lock.metadataSha256,
    sourceBoardPath: sourcePath,
    sourceBoardSha256: evidence.sourceBoard.sha256,
    sourceBoardFormat: evidence.sourceBoard.actualFormat,
    generatorPath: evidence.generator.path
  },
  inventory: {
    stateCount: stateInventory.length,
    frameCount: records.length,
    states: stateInventory,
    familyDiscovery
  },
  runtimeAudit: {
    collectionDuringMovement: {
      atlasCollectFrames: framesByState.collect?.length || 0,
      behavior: 'A pose collect isolada é usada quando a personagem está parada; durante movimento horizontal a seleção conserva o ciclo temporal RUN, e no ar conserva JUMP/FALL.',
      evidence: collectLocomotionEvidence
    }
  },
  outputs: {
    individualFrameCount: records.length,
    frames: records,
    sheets: Object.fromEntries(sheetDefinitions.map(([basename]) => [
      basename,
      {
        files: sheetArtifacts[basename],
        layout: sheetLayouts[basename]
      }
    ])),
    hashes: [
      ...pngRecords,
      ...Object.values(sheetArtifacts).flat()
    ]
  },
  validation: {
    sourceHashesUnchanged: true,
    framesWithinSourceBounds: true,
    allFramesContainVisiblePixels: true,
    pixelsCopiedWithoutFiltering: true,
    sheetScaling: 'nearest-neighbor',
    integrationAllowed: false,
    artApproval: 'PENDING'
  }
};
canonical.findings = [
  {
    id: 'REF-001',
    status: 'OBSERVATION',
    statement: 'A prancha de origem tem assinatura JPEG apesar da extensão .png; sua compressão é uma limitação herdada e foi preservada.'
  },
  {
    id: 'REF-002',
    status: 'OBSERVATION',
    statement: 'A inspeção visual das pranchas mostra resíduos de cor do papel/fundo original em áreas próximas à personagem. Nenhum pixel foi limpo nesta fase.'
  },
  {
    id: 'REF-003',
    status: 'OBSERVATION',
    statement: 'Estados com um frame e aliases exatos foram registrados por pixels, sem serem tratados como ciclos novos.'
  }
];
fs.writeFileSync(path.join(outputRoot, 'canonical-reference.json'),
  `${JSON.stringify(canonical, null, 2)}\n`);

const counts = stateInventory.map(item => `| \`${item.state}\` | ${item.frameCount} | ${item.animationType} | ${item.exactAliases.map(alias => `${alias.name} → ${alias.aliasOf}`).join(', ') || '—'} |`).join('\n');
const families = familyDiscovery
  .map(item => `| \`${item.query}\` | ${item.discovery} | ${item.matchingStateKeys.join(', ') || '—'} |`)
  .join('\n');
const report = `# Auditoria da referência canônica

- Ciclo: \`${lock.cycleId}\`
- Fase/modo: \`01A\` / \`DISCOVERY\`
- Resultado técnico da geração: \`PASS\`
- Fonte: \`${lock.atlasPath}\` (SHA-256 \`${lock.atlasSha256}\`)
- Metadados: \`${lock.metadataPath}\` (SHA-256 \`${lock.metadataSha256}\`)
- Estados catalogados: ${stateInventory.length}
- Recortes individuais produzidos: ${records.length}
- Pranchas produzidas: sete composições em 100%, 200% e 400% nearest-neighbor
- Produção de novos sprites: zero
- Integração: bloqueada
- Aprovação artística do usuário: pendente

## Inventário observado

| Estado | Frames | Tipo de evidência do atlas | Aliases exatos por pixels |
|---|---:|---|---|
${counts}

Sequências no atlas não certificam, sozinhas, ciclos de gameplay completos ou uso em runtime. As ocorrências e limitações estão registradas em \`canonical-reference.json\`.

O recorte-fonte \`collect\` é uma pose de ação individual, mas não é usado como imagem congelada durante locomoção: quando coleta e se move, o runtime conserva o ciclo RUN; no ar, conserva JUMP/FALL. A tabela acima descreve contagem no atlas, não animação do comportamento em jogo. Evidências de código estão registradas em \`canonical-reference.json\`.

## Descoberta das famílias direcionais e estados de produção

As chaves foram procuradas dinamicamente em \`OFFICIAL_FRAMES\`; os resultados não foram presumidos.

| Consulta | Descoberta | Chaves encontradas |
|---|---|---|
${families}

O atlas de referência atual contém recortes nomeados de estados e poses; isso não cria uma família CARRY, SWORD ou ATTACK. Direções não encontradas permanecem evidência ausente, não são sintetizadas.

## Integridade

Cada saída individual copia RGBA diretamente do atlas runtime, sem repintura, remoção de fundo ou transformação. Os recortes passaram verificações de coordenadas, âncoras finitas e conteúdo visível. As pranchas usam fundo neutro e espaçamento apenas para apresentação. As versões ampliadas usam nearest-neighbor. A comparação coloca o trecho da prancha JPEG ao lado do recorte RGBA; diferenças de compressão/formato não são tratadas como divergência do atlas.

Hashes, coordenadas, dimensões, âncoras, bounding boxes e evidências por frame estão em \`canonical-reference.json\`. Fonte, metadados e prancha fonte foram verificados novamente após a geração e permaneceram inalterados.

## Achados preservados da fonte

- A prancha de origem tem assinatura JPEG apesar da extensão \`.png\`; os valores RGB herdados, inclusive limitações de compressão, foram preservados.
- A inspeção das pranchas mostra resíduos de cor do papel/fundo original dentro de recortes em torno da personagem. Eles permanecem intactos nesta fase. A evidência de alpha nas bordas de cada recorte foi registrada por frame, sem reprovar automaticamente pixels de personagem que tocam a borda.
- \`INTERACT\` e \`COLLECT\` têm um recorte cada no inventário atual. \`PUSH\` e \`CLIMB\` são pixel a pixel aliases de \`idle_0\`; \`lying_down\` e \`crouch\` também repetem frames já existentes. A extração os documenta, não os promove a ciclos novos.

## Limites e gate

Esta entrega documenta a referência. Não limpa resíduos na fonte, não redesenha sprites nem aprova visualmente famílias futuras. Após a auditoria, uma correção funcional solicitada pelo usuário garantiu que \`COLLECT\` não congele durante movimento: a seleção preserva RUN/JUMP/FALL. Isso não cria novos sprites nem altera a fonte de arte. O gate exige aprovação explícita do usuário antes da auditoria 01 e, separadamente, da auditoria factual 01B. Nenhuma produção CARRY/SWORD/ATTACK ou integração é autorizada por este PASS técnico.
`;
fs.writeFileSync(path.join(outputRoot, 'reference-audit.md'), report);
console.log(`PASS: ${records.length} recortes e 7 pranchas em 3 escalas; hashes da fonte preservados.`);
