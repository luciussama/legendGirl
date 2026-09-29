import fs from 'node:fs/promises';

// Requer servidor local na porta 3000 e Chrome de teste na porta 9222.
await fs.mkdir('tmp/qa-002', { recursive: true });

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

const etapa = process.argv[2] || 'antes';
try {
  await send('Page.enable');
  await send('Network.setCacheDisabled', {cacheDisabled:true});
  await send('Emulation.setDeviceMetricsOverride', {width:960,height:580,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate', {url:'http://127.0.0.1:3000/tests/dark-room-playthrough.html'});
  for(let i=0;i<100;i++) { if(await evaluate('document.body?.dataset.ready === "true"')) break; await new Promise(r=>setTimeout(r,100)); }
  const resultados=[];
  for(const index of [4,5,6,7]) {
    for(const dt of [0.5,1,1.2]) resultados.push(await evaluate(`window.review.run(${index},${dt})`));
    await evaluate(`window.review.show(${index},false); window.review.game.state.tick=150; window.review.game.state.fairy.x=window.review.game.state.baby.x-220; window.review.game.review.draw()`);
    await fs.writeFile(`tmp/qa-002/${index}-${etapa}.png`,await captureScreenshot());
  }
  await fs.writeFile(`tmp/qa-002/${etapa}-playtest.json`,JSON.stringify(resultados,null,2));
  console.log(JSON.stringify({etapa,resultados}));
} finally {ws.close();}
