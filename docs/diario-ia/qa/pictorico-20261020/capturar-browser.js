import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const page = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let serial = 0;
const pending = new Map(), exceptions = [], failed = [];
ws.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
  if (message.method === 'Network.responseReceived' && message.params.response.status >= 400 && !message.params.response.url.endsWith('/favicon.ico')) failed.push(message.params.response.url);
  if (pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id); pending.delete(message.id);
    message.error ? reject(Error(JSON.stringify(message.error))) : resolve(message.result);
  }
};
/** Executa um comando no Chrome isolado, com timeout para não bloquear a sessão. */
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++serial; const timer = setTimeout(() => { pending.delete(id); reject(Error('Tempo excedido: ' + method)); }, 25000);
    pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
/** Consulta a fixture ou o jogo local, devolvendo erros de execução explicitamente. */
async function evaluate(expression) {
  const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw Error(JSON.stringify(response.exceptionDetails));
  return response.result.value;
}

try {
 await send('Runtime.enable');await send('Page.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:1200,height:1130,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:process.env.PILOT_REVIEW_URL+'/docs/diario-ia/qa/perseguicao-20261020/props.html'});
 let ready=false;for(let i=0;i<150;i++){if(await evaluate('Boolean(window.propsReview)')){ready=true;break;}await new Promise(r=>setTimeout(r,100));}
 assert.ok(ready,'Painel atual deve carregar para capturar a referência 3D.');
 await evaluate(`document.querySelector('#prop').value='cabinet';document.querySelector('#angle').value='three';new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))`);
 const rect=await evaluate(`(()=>{const r=document.querySelector('#neutral').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,scale:1};})()`);
 const result=await send('Page.captureScreenshot',{format:'png',clip:rect}),bytes=Buffer.from(result.data,'base64');
 const file='/tmp/legendgirl-armario-atual-pictorico.png';await fs.writeFile(file,bytes);
 console.log('REFERÊNCIA 3D ATUAL',JSON.stringify({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')}));
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
