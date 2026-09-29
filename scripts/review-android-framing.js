// Requer servidor local :3000 e Chrome de teste com depuração remota :9222.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
const ws = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let sequence = 0;
const pending = new Map();
ws.onmessage = ({data}) => { const m = JSON.parse(data); if (pending.has(m.id)) {
  const {resolve,reject} = pending.get(m.id); pending.delete(m.id);
  m.error ? reject(Error(JSON.stringify(m.error))) : resolve(m.result);
}};
const send = (method, params = {}) => new Promise((resolve,reject) => {
  const id = ++sequence; pending.set(id,{resolve,reject}); ws.send(JSON.stringify({id,method,params}));
});
async function evaluate(expression) {
  const result = await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
  if(result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const directory = 'docs/qa-mobile-001';
await fs.mkdir(directory,{recursive:true});
try {
  await send('Page.enable');
  await send('Emulation.setUserAgentOverride',{userAgent:'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'});
  const results=[];
  for(const [name,width,height,inset] of [['gestos',390,844,24],['barra',390,800,48],['paisagem',844,390,24]]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
    await send('Page.navigate',{url:'http://127.0.0.1:3000/tests/dark-room-playthrough.html'});
    for(let i=0;i<200;i++) {
      if(await evaluate('Boolean(window.review)')) break;
      await new Promise(r=>setTimeout(r,100));
    }
    await evaluate(`document.head.insertAdjacentHTML('beforeend','<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>canvas{width:100vw;height:100dvh}p{display:none}</style>')`);
    await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
    await evaluate(`document.querySelector('[data-android-safe-area]').style.paddingBottom='${inset}px'`);
    for(const after of [false,true]) {
      const state = await evaluate(`window.review.game.review.mobileFrame(${after})`);
      if(after) assert.ok(state.topAfter >= 0, 'Conteúdo jogável preservado no topo');
      const {data}=await send('Page.captureScreenshot',{format:'png'});
      const file=`${directory}/${name}-${after?'depois':'antes'}.png`;
      await fs.writeFile(file,Buffer.from(data,'base64'));
      results.push({cenario:name,depois:after,inset,...state,arquivo:file});
    }
    for(const phase3 of [false,true]) for(let index=0;index<(phase3?16:22);index++) {
      const frame=await evaluate(`window.review.game.review.mobileFrame(true,${index},${phase3})`);
      assert.ok(frame.topAfter >= 0, `Apoio ${index}: topo visível`);
      assert.ok(frame.playerFeetAfter <= frame.height-72*frame.height/height, `Apoio ${index}: margem inferior`);
    }
  }
  await fs.writeFile(`${directory}/resultados.json`,JSON.stringify(results,null,2)+'\n');
  console.log('Capturas Android antes/depois concluídas: gestos, barra e paisagem.');
} finally { ws.close(); }
