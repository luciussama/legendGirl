// Script de inspeção visual e gameplay sobre todas as plataformas (0 a 21)
// Não altera código do jogo nem apaga arquivos existentes em tmp/.
// Salva novas evidências em tmp/dark-room/gameplay-inspection/

import fs from 'node:fs/promises';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';

const OUTPUT_DIR = 'tmp/dark-room/gameplay-inspection';
await fs.mkdir(OUTPUT_DIR, { recursive: true });

const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
const page = pages.find(p => p.type === 'page');
if (!page) throw Error('Nenhuma página ativa do Chrome encontrada na porta 9222');

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });

let sequence = 0;
const pending = new Map();
ws.onmessage = ({ data }) => {
  const m = JSON.parse(data);
  if (pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? reject(Error(JSON.stringify(m.error))) : resolve(m.result);
  }
};

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params }));
});

async function evaluate(expression) {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw Error(JSON.stringify(r.exceptionDetails));
  return r.result.value;
}

async function captureScreenshot() {
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  return Buffer.from(data, 'base64');
}

// Utilitário para compor 4 imagens em grade 2x2 de alta resolução
function composeGrid(imgScene, imgStart, imgMid, imgEnd) {
  const p1 = PNG.sync.read(imgScene);
  const p2 = PNG.sync.read(imgStart);
  const p3 = PNG.sync.read(imgMid);
  const p4 = PNG.sync.read(imgEnd);

  const w = p1.width;
  const h = p1.height;
  const composite = new PNG({ width: w * 2, height: h * 2 });

  // Preenche fundo com cor escura temática
  composite.data.fill(20);

  function blit(src, startX, startY) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const srcIdx = (w * y + x) << 2;
        const dstIdx = (composite.width * (startY + y) + (startX + x)) << 2;
        composite.data[dstIdx] = src.data[srcIdx];
        composite.data[dstIdx + 1] = src.data[srcIdx + 1];
        composite.data[dstIdx + 2] = src.data[srcIdx + 2];
        composite.data[dstIdx + 3] = src.data[srcIdx + 3];
      }
    }
  }

  blit(p1, 0, 0);         // Top-left: Cenário Geral
  blit(p2, w, 0);         // Top-right: Garota Início
  blit(p3, 0, h);         // Bottom-left: Garota Meio
  blit(p4, w, h);         // Bottom-right: Garota Fim

  return PNG.sync.write(composite);
}

try {
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 960,
    height: 580,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Page.navigate', { url: 'http://127.0.0.1:3000/tests/dark-room-playthrough.html' });

  for (let i = 0; i < 100; i++) {
    if (await evaluate('document.body?.dataset.ready === "true"')) break;
    await new Promise(r => setTimeout(r, 100));
  }
  if (!await evaluate('Boolean(window.review)')) {
    throw Error('Página de teste de revisão não inicializou');
  }

  // Prepara métodos de inspeção no ambiente do navegador
  await evaluate(`
    window.gameplayInspector = {
      getPlatformInfo(index) {
        const p = window.review.platforms[index];
        const s = {
          x: p.standRegion?.x ?? p.x,
          w: p.standRegion?.w ?? p.w,
          y: p.surfaceTopY ?? p.standRegion?.y ?? p.y
        };
        return {
          index,
          style: p.style,
          label: p.label || p.style,
          platformRect: { x: p.x, y: p.y, w: p.w, h: p.h },
          supportRegion: s,
          startPos: { x: s.x, y: s.y - 44 },
          midPos: { x: s.x + (s.w - 38) / 2, y: s.y - 44 },
          endPos: { x: s.x + s.w - 38, y: s.y - 44 }
        };
      },
      showGeneralScene(index) {
        const info = this.getPlatformInfo(index);
        window.review.game.review.prepare(index, info.midPos.x);
        window.DEBUG_COLLISIONS = false;
        window.review.game.review.draw();
      },
      showAtPosition(index, posKey) {
        const info = this.getPlatformInfo(index);
        const targetX = posKey === 'start' ? info.startPos.x : (posKey === 'end' ? info.endPos.x : info.midPos.x);
        window.review.game.review.prepare(index, targetX);
        window.DEBUG_COLLISIONS = false;
        window.review.game.review.draw();
      },
      showHitbox(index) {
        const info = this.getPlatformInfo(index);
        window.review.game.review.prepare(index, info.midPos.x);
        window.DEBUG_COLLISIONS = true;
        window.review.game.review.draw();
      }
    };
  `);

  const platformsCount = await evaluate('window.review.platforms.length');
  console.log(`Iniciando inspeção visual para todas as ${platformsCount} plataformas (0 a ${platformsCount - 1})...`);

  const inspectionReport = [];

  for (let idx = 0; idx < platformsCount; idx++) {
    const info = await evaluate(`window.gameplayInspector.getPlatformInfo(${idx})`);
    const prefix = String(idx).padStart(2, '0');
    console.log(`[Plataforma ${prefix}] ${info.style} (${info.label}) - Suporte: x=${info.supportRegion.x}, w=${info.supportRegion.w}, y=${info.supportRegion.y}`);

    // 1. Cenário como um Geral
    await evaluate(`window.gameplayInspector.showGeneralScene(${idx})`);
    const sceneBuffer = await captureScreenshot();
    await fs.writeFile(`${OUTPUT_DIR}/${prefix}-01-cenario-geral.png`, sceneBuffer);

    // 2. Garota no Início da Plataforma
    await evaluate(`window.gameplayInspector.showAtPosition(${idx}, 'start')`);
    const startBuffer = await captureScreenshot();
    await fs.writeFile(`${OUTPUT_DIR}/${prefix}-02-garota-inicio.png`, startBuffer);

    // 3. Garota no Meio da Plataforma
    await evaluate(`window.gameplayInspector.showAtPosition(${idx}, 'middle')`);
    const midBuffer = await captureScreenshot();
    await fs.writeFile(`${OUTPUT_DIR}/${prefix}-03-garota-meio.png`, midBuffer);

    // 4. Garota no Fim da Plataforma
    await evaluate(`window.gameplayInspector.showAtPosition(${idx}, 'end')`);
    const endBuffer = await captureScreenshot();
    await fs.writeFile(`${OUTPUT_DIR}/${prefix}-04-garota-fim.png`, endBuffer);

    // 5. Apoio detalhado (Close-up comparativo dos 3 pontos com sapato/marcador)
    const detailBase64 = await evaluate(`window.review.detail(${idx})`);
    const supportBuffer = Buffer.from(detailBase64, 'base64');
    await fs.writeFile(`${OUTPUT_DIR}/${prefix}-05-apoio-detalhe.png`, supportBuffer);

    // 6. Hitbox do cenário (visualização física com caixas de colisão)
    await evaluate(`window.gameplayInspector.showHitbox(${idx})`);
    const hitboxBuffer = await captureScreenshot();
    await fs.writeFile(`${OUTPUT_DIR}/${prefix}-06-cenario-hitbox.png`, hitboxBuffer);

    // 7. Painel consolidado 2x2 (Cenário Geral | Início | Meio | Fim)
    const compositeBuffer = composeGrid(sceneBuffer, startBuffer, midBuffer, endBuffer);
    await fs.writeFile(`${OUTPUT_DIR}/${prefix}-00-painel-consolidado.png`, compositeBuffer);

    inspectionReport.push({
      index: idx,
      style: info.style,
      label: info.label,
      geometry: info.platformRect,
      support: info.supportRegion,
      positions: {
        start: info.startPos,
        middle: info.midPos,
        end: info.endPos
      },
      files: [
        `${prefix}-00-painel-consolidado.png`,
        `${prefix}-01-cenario-geral.png`,
        `${prefix}-02-garota-inicio.png`,
        `${prefix}-03-garota-meio.png`,
        `${prefix}-04-garota-fim.png`,
        `${prefix}-05-apoio-detalhe.png`,
        `${prefix}-06-cenario-hitbox.png`
      ]
    });
  }

  await fs.writeFile(
    `${OUTPUT_DIR}/relatorio-inspecao.json`,
    JSON.stringify({ timestamp: new Date().toISOString(), totalPlatforms: platformsCount, platforms: inspectionReport }, null, 2) + '\n'
  );

  console.log(`Inspeção concluída com sucesso! Todas as evidências salvas em ${OUTPUT_DIR}/`);
} finally {
  ws.close();
}
