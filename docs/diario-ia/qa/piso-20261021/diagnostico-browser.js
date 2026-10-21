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
 const info=await evaluate(`(async()=>{const c=game.state.toyRoomInstance.instance.chase,r=c.renderer;Object.assign(c.state,{stage:'RUNNING',distance:39,x:0,gap:23,time:25,age:25});c.render();const mat=r.materials.floor,img=mat.map.image,ctx=img.getContext('2d'),data=ctx.getImageData(0,0,img.width,img.height).data;let mean=[0,0,0,0];for(let i=0;i<data.length;i++)mean[i%4]+=data[i]/(img.width*img.height);const floor=r.room.root.children.find(o=>o.name==='piso contínuo');return {map:!!mat.map,size:[img.width,img.height],mean,uv:floor.geometry.attributes.uv.array.slice(0,8),normal:floor.geometry.attributes.normal.array.slice(0,6),color:mat.color.getHexString(),metalness:mat.metalness,roughness:mat.roughness,side:mat.side,repeat:mat.map.repeat,filter:mat.map.minFilter};})()`);
 console.log('DIAGNÓSTICO',JSON.stringify(info));
 const shot=await send('Page.captureScreenshot',{format:'png'}),raw=Buffer.from(shot.data,'base64');await fs.writeFile('/tmp/legendgirl-piso-antes.png',raw);console.log('CAPTURA',JSON.stringify({path:'/tmp/legendgirl-piso-antes.png',sha256:crypto.createHash('sha256').update(raw).digest('hex'),bytes:raw.length}));
 const probe=await evaluate(`(async()=>{const c=game.state.toyRoomInstance.instance.chase,r=c.renderer,T=await import('/src/vendor/three/three.module.js'),floor=r.room.root.children.find(o=>o.name==='piso contínuo'),old=floor.material;floor.material=new T.MeshBasicMaterial({map:old.map,side:T.DoubleSide});c.render();floor.material.dispose();floor.material=old;return true;})()`);
 const shot2=await send('Page.captureScreenshot',{format:'png'}),raw2=Buffer.from(shot2.data,'base64');await fs.writeFile('/tmp/legendgirl-piso-sem-luz.png',raw2);console.log('CAPTURA',JSON.stringify({path:'/tmp/legendgirl-piso-sem-luz.png',sha256:crypto.createHash('sha256').update(raw2).digest('hex'),bytes:raw2.length}));
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
