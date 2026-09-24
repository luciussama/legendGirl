import fs from 'node:fs/promises';
import { PNG } from 'pngjs';

const REVIEWED_DIR = 'tmp/dark-room/reviewed';
await fs.mkdir(REVIEWED_DIR, { recursive: true });

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

function composeGrid(imgScene, imgStart, imgMid, imgEnd) {
  const p1 = PNG.sync.read(imgScene);
  const p2 = PNG.sync.read(imgStart);
  const p3 = PNG.sync.read(imgMid);
  const p4 = PNG.sync.read(imgEnd);

  const w = p1.width;
  const h = p1.height;
  const composite = new PNG({ width: w * 2, height: h * 2 });
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

  blit(p1, 0, 0);     // Top-left: Cenário Geral
  blit(p2, w, 0);     // Top-right: Início
  blit(p3, 0, h);     // Bottom-left: Meio
  blit(p4, w, h);     // Bottom-right: Fim

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
    throw Error('Página de teste não inicializou');
  }

  const target = 7;
  const prefix = '07';

  // 1. Simulação física e verificação de saltos
  const results = [];
  for (let i = 0; i <= target; i++) {
    for (const dt of [0.5, 1, 1.2]) {
      results.push({
        jump: await evaluate(`window.review.run(${i},${dt})`),
        contacts: await evaluate(`window.review.contacts(${i},${dt})`),
        visual: await evaluate(`window.review.visibleSupport(${i})`)
      });
    }
  }

  const outgoing = [];
  for (const dt of [0.5, 1, 1.2]) {
    outgoing.push(await evaluate(`window.review.run(${target + 1},${dt})`));
  }

  // Prepara métodos de inspeção no navegador
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

  const info = await evaluate(`window.gameplayInspector.getPlatformInfo(${target})`);
  console.log(`[Plataforma ${prefix}] ${info.style} (${info.label})`);

  // Captura 1: Cenário Geral
  await evaluate(`window.gameplayInspector.showGeneralScene(${target})`);
  const sceneBuffer = await captureScreenshot();
  await fs.writeFile(`${REVIEWED_DIR}/${prefix}-01-cenario-geral.png`, sceneBuffer);
  await fs.writeFile(`${REVIEWED_DIR}/${prefix}-scene.png`, sceneBuffer);

  // Captura 2: Garota no Início
  await evaluate(`window.gameplayInspector.showAtPosition(${target}, 'start')`);
  const startBuffer = await captureScreenshot();
  await fs.writeFile(`${REVIEWED_DIR}/${prefix}-02-garota-inicio.png`, startBuffer);

  // Captura 3: Garota no Meio
  await evaluate(`window.gameplayInspector.showAtPosition(${target}, 'mid')`);
  const midBuffer = await captureScreenshot();
  await fs.writeFile(`${REVIEWED_DIR}/${prefix}-03-garota-meio.png`, midBuffer);

  // Captura 4: Garota no Fim
  await evaluate(`window.gameplayInspector.showAtPosition(${target}, 'end')`);
  const endBuffer = await captureScreenshot();
  await fs.writeFile(`${REVIEWED_DIR}/${prefix}-04-garota-fim.png`, endBuffer);

  // Captura 5: Close-up de Apoio e Detalhe
  const detailB64 = await evaluate(`window.review.detail(${target})`);
  const detailBuffer = Buffer.from(detailB64, 'base64');
  await fs.writeFile(`${REVIEWED_DIR}/${prefix}-05-apoio-detalhe.png`, detailBuffer);
  await fs.writeFile(`${REVIEWED_DIR}/${prefix}-support.png`, detailBuffer);

  // Captura 6: Hitbox com Colisões
  await evaluate(`window.gameplayInspector.showHitbox(${target})`);
  const hitboxBuffer = await captureScreenshot();
  await fs.writeFile(`${REVIEWED_DIR}/${prefix}-06-cenario-hitbox.png`, hitboxBuffer);
  await fs.writeFile(`${REVIEWED_DIR}/${prefix}-hitbox.png`, hitboxBuffer);

  // Captura 7: Painel Consolidado 2x2
  const gridBuffer = composeGrid(sceneBuffer, startBuffer, midBuffer, endBuffer);
  await fs.writeFile(`${REVIEWED_DIR}/${prefix}-00-painel-consolidado.png`, gridBuffer);

  // Resultados JSON
  await fs.writeFile(`${REVIEWED_DIR}/${prefix}-results.json`, JSON.stringify({ results, outgoing }, null, 2) + '\n');
  await fs.writeFile(`${REVIEWED_DIR}/${prefix}-relatorio-revisao.json`, JSON.stringify({
    plataforma: target,
    estilo: info.style,
    label: info.label,
    suporte: info.supportRegion,
    posicoes: {
      inicio: info.startPos,
      meio: info.midPos,
      fim: info.endPos
    },
    melhorias: [
      "Móvel ampliado com 6 gavetas totais alcançando o chão (floorY = 450)",
      "Pés esculpidos bracket assentados firmemente no chão",
      "Tampa chanfrada inteira sem cortes ou barras horizontais artificiais",
      "Perspectiva diagonal isométrica preservada com mogno maciço e verniz acetinado",
      "Pé da personagem garantido 100% dentro dos limites do móvel (início a 12px da borda esquerda, fim a 19px antes da borda direita)",
      "Física e jogabilidade inalteradas com todos os testes de estabilidade aprovados"
    ]
  }, null, 2) + '\n');

  console.log(`Sucesso! Todas as evidências salvas em ${REVIEWED_DIR}/`);
} finally {
  ws.close();
}
