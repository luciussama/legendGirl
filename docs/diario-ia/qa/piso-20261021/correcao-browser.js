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
 const setup=await evaluate(`(()=>{const c=game.state.toyRoomInstance.instance.chase,r=c.renderer,t=r.floor;return {data:t.isDataTexture,generate:t.generateMipmaps,levels:t.mipmaps.map(m=>({width:m.width,height:m.height,bytes:m.data.length,alpha:m.data[3]})),repeat:[t.repeat.x,t.repeat.y],resources:r.resources.size};})()`);
 assert.equal(setup.data,true,'Piso enviado como bytes RGBA');assert.equal(setup.generate,false,'Piso não depende de generateMipmap');assert.equal(setup.levels.length,9);assert.deepEqual(setup.levels.at(-1),{width:1,height:1,bytes:4,alpha:255});
 for(const m of setup.levels)assert.equal(m.bytes,m.width*m.height*4);
 console.log('TEXTURA',JSON.stringify(setup));
 const rows=[];
 for(const [width,height]of [[1280,800],[390,844],[844,390]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<900});await new Promise(r=>setTimeout(r,180));
 for(const distance of [0,14,39,82,126,165,208,244,290,355,420,485,555,620,680]){
  const result=await evaluate(`(async()=>{const T=await import('/src/vendor/three/three.module.js');const c=game.state.toyRoomInstance.instance.chase,r=c.renderer,floor=r.room.root.children.find(o=>o.name==='piso contínuo');Object.assign(c.state,{stage:'RUNNING',distance:${distance},x:0,gap:23,time:25,age:25});c.render();const image=c.canvas.toDataURL('image/png').split(',')[1];const read=()=>{const ctx=c.ctx,w=c.canvas.width,h=c.canvas.height,meshes=[];r.scene.traverseVisible(o=>{if(o.isMesh)meshes.push(o);});const ray=new T.Raycaster();let rgb=[0,0,0],count=0;for(const y of [.55,.6,.65,.7,.75,.8])for(const x of [.2,.3,.4,.5,.6,.7,.8]){ray.setFromCamera(new T.Vector2(x*2-1,1-y*2),r.camera);const hit=ray.intersectObjects(meshes,false)[0];if(hit?.object!==floor)continue;const p=ctx.getImageData(Math.floor(x*w),Math.floor(y*h),1,1).data;for(let i=0;i<3;i++)rgb[i]+=p[i];count++;}if(count<4)throw Error('Amostras insuficientes de piso sem adereços: '+count);return rgb.map(v=>v/count);};const normal=read();const receive=floor.receiveShadow;floor.receiveShadow=false;c.render();const noShadows=read();floor.receiveShadow=receive;return {image,normal,noShadows};})()`);
  assert.ok(result.normal[0]>60&&result.normal[0]>result.normal[1]*1.15&&result.normal[1]>result.normal[2]*1.4,'Madeira precisa aparecer no chão: '+JSON.stringify({distance,...result,image:undefined}));
  const raw=Buffer.from(result.image,'base64'),path='/tmp/legendgirl-piso-corrigido-'+width+'-'+distance+'.png';await fs.writeFile(path,raw);delete result.image;rows.push({width,height,distance,...result,path,bytes:raw.length,sha256:crypto.createHash('sha256').update(raw).digest('hex')});
 }
 }
 console.log('TRECHOS',JSON.stringify(rows));
 const gpu=await evaluate(`(()=>{const r=game.state.toyRoomInstance.instance.chase.renderer;return {error:r.renderer.getContext().getError(),calls:r.renderer.info.render.calls};})()`);assert.equal(gpu.error,0);assert.ok(gpu.calls<310);const disposed=await evaluate('(()=>{const r=game.state.toyRoomInstance.instance.chase.renderer;r.destroy();r.destroy();return r.resources.size;})()');assert.equal(disposed,0);console.log('APROVADO: madeira visível em 45 cenas, mipmaps completos, nenhum erro WebGL e descarte zero.',JSON.stringify(gpu));
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
