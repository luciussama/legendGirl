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
 await send('Page.navigate',{url:process.env.PILOT_REVIEW_URL+'/?debug=1'});
 for(let i=0;i<180;i++){if(await evaluate('Boolean(window.game?.startDebugPhase)'))break;await new Promise(r=>setTimeout(r,100));}
 await evaluate(`document.querySelector('#debug-phase-select').value='bear-chase';document.querySelector('#debug-phase-select').dispatchEvent(new Event('change',{bubbles:true}));`);
 let ready=false;for(let i=0;i<240;i++){const c=await evaluate('(()=>{const c=game.state.toyRoomInstance?.instance.chase;return {ready:c?.ready,error:c?.error};})()');if(c.error)throw Error(c.error);if(c.ready){ready=true;break;}await new Promise(r=>setTimeout(r,100));}assert.ok(ready);
 await evaluate('game.setPaused(true)');const results=[],captures=[];
 for(const [width,height]of [[1280,800],[390,844],[844,390]]){
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<900});await new Promise(r=>setTimeout(r,180));
  for(const distance of [14,39,82,290]){
   const row=await evaluate(`(async()=>{const c=game.state.toyRoomInstance.instance.chase,r=c.renderer,T=await import('/src/vendor/three/three.module.js');Object.assign(c.state,{stage:'RUNNING',distance:${distance},x:0,gap:23,time:25,age:25});const saved=JSON.stringify(c.state);c.render();const on=c.ctx.getImageData(0,0,c.canvas.width,c.canvas.height).data.slice(),calls=r.renderer.info.render.calls,update=r.lighting.update;
   const receivers=[];r.scene.traverse(o=>{if(o.isMesh){receivers.push([o,o.receiveShadow]);o.receiveShadow=false;}});r.lighting.update=()=>{};c.render();const off=c.ctx.getImageData(0,0,c.canvas.width,c.canvas.height).data;let changed=0,darkened=0;for(let i=0;i<on.length;i+=16){const a=on[i]+on[i+1]+on[i+2],b=off[i]+off[i+1]+off[i+2];if(Math.abs(a-b)>9)changed++;if(a+9<b)darkened++;}
   for(const [o,receive] of receivers)o.receiveShadow=receive;r.lighting.update=update;c.render();r.scene.updateMatrixWorld(true);
   const center=r.bearModel.body.getWorldPosition(new T.Vector3()),light=r.lighting.front,dir=light.target.position.clone().sub(light.position).normalize(),floor=r.room.root.children.find(o=>o.name==='piso contínuo'),ray=new T.Raycaster(center,dir,0,30),hit=ray.intersectObject(floor)[0];
   const route=await import('/src/js/bear-chase/ChaseRoute.js'),a=route.routePoint(c.state.distance+c.state.gap),b=route.routePoint(c.state.distance+c.state.gap+1),forward=new T.Vector3(b.x-a.x,b.y-a.y,b.z-a.z).normalize();
   const meshes=[];r.girl.traverse(o=>{if(o.isMesh)meshes.push(o);});const lights=r.lighting.lights.filter(l=>l.castShadow&&l.visible),maps=r.lighting.lights.filter(l=>l.shadow.map).map(l=>[l.shadow.map.width,l.shadow.map.height]);
   return {distance:${distance},width:${width},height:${height},changed,darkened,calls,resources:r.resources.size,activeShadows:lights.length,maps,front:light.position.clone().sub(center).dot(forward),backShadow:hit?hit.point.clone().sub(center).dot(forward):null,characters:meshes.every(m=>m.castShadow&&m.receiveShadow),floor:r.materials.floor.isMeshStandardMaterial,state:saved===JSON.stringify(c.state)};})()`);
   results.push(row);assert.ok(row.changed>50&&row.darkened>50,'Sombras devem alterar pixels reais: '+JSON.stringify(row));assert.ok(row.front>0&&row.backShadow<0,'Luz do urso deve vir da frente e sombra ir para trás: '+JSON.stringify(row));assert.ok(row.characters&&row.floor&&row.state);assert.ok(row.activeShadows<=2&&row.resources<300&&row.calls<310);
   const shot=await send('Page.captureScreenshot',{format:'png'}),bytes=Buffer.from(shot.data,'base64'),file='/tmp/legendgirl-luz-'+width+'-'+distance+'.png';await fs.writeFile(file,bytes);captures.push({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
  }
 }
 const continuity=await evaluate(`(()=>{const c=game.state.toyRoomInstance.instance.chase,l=c.renderer.lighting,previous=new Map();let jumps=0;for(let s=0;s<=720;s+=.5){l.update({...c.state,distance:s,gap:23},false);for(const w of l.windows){const old=previous.get(w.uuid);if(old&&old.s!==w.userData.windowDistance&&(old.intensity>1||w.intensity>1))jumps++;previous.set(w.uuid,{s:w.userData.windowDistance,intensity:w.intensity});}}return {jumps};})()`);assert.equal(continuity.jumps,0,'Janelas só podem reciclar luz quando apagadas.');
 const disposed=await evaluate('(()=>{const r=game.state.toyRoomInstance.instance.chase.renderer;r.destroy();r.destroy();return r.resources.size;})()');assert.equal(disposed,0);
 assert.deepEqual(exceptions,[]);assert.deepEqual(failed,[]);console.log('CAPTURAS',JSON.stringify(captures));console.log('APROVADO: pixels de sombra, materiais receptores, luz frontal e sombra traseira do urso, três formatos, continuidade, estado e descarte.',JSON.stringify({results,continuity}));
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
