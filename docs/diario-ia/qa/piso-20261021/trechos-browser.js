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
 await send('Runtime.enable');await send('Page.enable');await send('Network.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:1280,height:800,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://127.0.0.1:3000/?debug=1'});
 for(let i=0;i<180;i++){if(await evaluate('Boolean(window.game?.startDebugPhase)'))break;await new Promise(r=>setTimeout(r,100));}
 await evaluate(`document.querySelector('#debug-phase-select').value='bear-chase';document.querySelector('#debug-phase-select').dispatchEvent(new Event('change',{bubbles:true}));`);
 for(let i=0;i<240;i++){const c=await evaluate('(()=>{const c=game.state.toyRoomInstance?.instance.chase;return {ready:c?.ready,error:c?.error};})()');if(c.error)throw Error(c.error);if(c.ready)break;await new Promise(r=>setTimeout(r,100));}
 await evaluate('game.setPaused(true)');
 const rows=[];
 for(const distance of [0,14,39,82,126,165,208,244,290,355,420,485,555,620,680]){
  const result=await evaluate(`(()=>{const c=game.state.toyRoomInstance.instance.chase,r=c.renderer,floor=r.room.root.children.find(o=>o.name==='piso contínuo');Object.assign(c.state,{stage:'RUNNING',distance:${distance},x:0,gap:23,time:25,age:25});c.render();const image=c.canvas.toDataURL('image/png').split(',')[1];const read=()=>{const ctx=c.ctx,w=c.canvas.width,h=c.canvas.height;let rgb=[0,0,0];for(const [x,y]of [[.3,.75],[.7,.75],[.4,.85],[.6,.85]]){const p=ctx.getImageData(Math.floor(x*w),Math.floor(y*h),1,1).data;for(let i=0;i<3;i++)rgb[i]+=p[i]/4;}return rgb;};const normal=read();const receive=floor.receiveShadow;floor.receiveShadow=false;c.render();const noShadows=read();floor.receiveShadow=receive;return {image,normal,noShadows};})()`);
  const raw=Buffer.from(result.image,'base64'),path='/tmp/legendgirl-piso-trecho-'+distance+'.png';await fs.writeFile(path,raw);delete result.image;rows.push({distance,...result,path,bytes:raw.length,sha256:crypto.createHash('sha256').update(raw).digest('hex')});
 }
 console.log('TRECHOS',JSON.stringify(rows));
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
