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

function composeGrid(img1, img2, img3, img4) {
  const p1 = PNG.sync.read(img1);
  const p2 = PNG.sync.read(img2);
  const p3 = PNG.sync.read(img3);
  const p4 = PNG.sync.read(img4);

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

  blit(p1, 0, 0);     // Top-left: Espera
  blit(p2, w, 0);     // Top-right: Decolagem
  blit(p3, 0, h);     // Bottom-left: Voo / Arco
  blit(p4, w, h);     // Bottom-right: Pouso no trem

  return PNG.sync.write(composite);
}

try {
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 960,
    height: 540,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Page.navigate', { url: 'http://127.0.0.1:3000/tests/dark-room-playthrough.html' });

  for (let i = 0; i < 100; i++) {
    if (await evaluate('document.body?.dataset.ready === "true" || Boolean(window.review)')) break;
    await new Promise(r => setTimeout(r, 100));
  }
  if (!await evaluate('Boolean(window.review)')) {
    throw Error('Página de teste não inicializou');
  }

  // Prepara estado inicial no castelo (Plataforma 9)
  await evaluate(`
    (() => {
      const game = window.review.game;
      // Prepara menininha no topo estreito do castelo de blocos (Plataforma 9)
      game.review.prepare(9, 1636);
      game.state.baby.vx = 0;
      game.state.baby.vy = 0;
      game.state.baby.onGround = true;
      game.review.draw();
    })()
  `);

  // 1. Captura 1: Espera em prontidão no topo do castelo
  const imgWait = await captureScreenshot();
  await fs.writeFile(`${REVIEWED_DIR}/09-10-01-castelo-espera-prontidao.png`, imgWait);

  // 2. Aciona o pulo calibrado (Decolagem)
  await evaluate(`
    (() => {
      const game = window.review.game;
      game.review.jump();
      game.review.step(1);
      game.review.draw();
    })()
  `);
  const imgTakeoff = await captureScreenshot();
  await fs.writeFile(`${REVIEWED_DIR}/09-10-02-salto-decolagem.png`, imgTakeoff);

  // 3. Meio do voo parabólico (aproximadamente frame 26)
  await evaluate(`
    (() => {
      const game = window.review.game;
      for (let f = 0; f < 25; f++) {
        game.review.step(1);
      }
      game.review.draw();
    })()
  `);
  const imgFlight = await captureScreenshot();
  await fs.writeFile(`${REVIEWED_DIR}/09-10-03-salto-voo-parabola.png`, imgFlight);

  // 4. Pouso perfeito na plataforma 10 (Trilho de trem)
  await evaluate(`
    (() => {
      const game = window.review.game;
      for (let f = 0; f < 30; f++) {
        game.review.step(1);
        if (game.state.baby.onGround) break;
      }
      game.review.draw();
    })()
  `);
  const imgLanding = await captureScreenshot();
  await fs.writeFile(`${REVIEWED_DIR}/09-10-04-pouso-trilho-trem.png`, imgLanding);

  // 5. Painel consolidado
  const gridBuffer = composeGrid(imgWait, imgTakeoff, imgFlight, imgLanding);
  await fs.writeFile(`${REVIEWED_DIR}/09-10-00-painel-transicao-fuga.png`, gridBuffer);

  // 6. Relatório com telemetria exata
  const report = await evaluate(`
    (() => {
      const b = window.review.game.state.baby;
      const p10 = window.review.platforms[10];
      return {
        timestamp: new Date().toISOString(),
        mechanic: 'Efeito de gameplay escondido para transição da Parte 2',
        platformSource: {
          index: 9,
          name: window.review.platforms[9].name,
          style: window.review.platforms[9].style,
          standRegion: window.review.platforms[9].standRegion
        },
        platformTarget: {
          index: 10,
          name: p10.name,
          style: p10.style,
          x: p10.x,
          w: p10.w,
          surfaceY: p10.surfaceTopY ?? p10.y
        },
        babyFinalState: {
          x: b.x,
          y: b.y,
          vx: b.vx,
          vy: b.vy,
          onGround: b.onGround,
          currentPlatformIndex: b.currentPlatformIndex,
          feetContactY: b.y + b.h
        },
        successGuarantee: b.currentPlatformIndex === 10 && b.onGround && Math.abs(b.y + b.h - (p10.surfaceTopY ?? p10.y)) < 0.01
      };
    })()
  `);
  await fs.writeFile(`${REVIEWED_DIR}/09-10-relatorio-transicao.json`, JSON.stringify(report, null, 2));

  console.log('Capturas geradas com sucesso em', REVIEWED_DIR);
  console.log(JSON.stringify(report, null, 2));
} finally {
  ws.close();
}
