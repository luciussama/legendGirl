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
 await evaluate('game.setPaused(true)');const rows=[],captures=[];
 for(const [width,height]of [[1280,800],[390,844],[844,390]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<900});await new Promise(r=>setTimeout(r,180));
 for(const [distance,x]of [[30,0],[550,0],[660,0],[660,-3.6],[660,3.6],[690,0],[690,-3.6],[690,3.6],[710,0],[710,-3.6],[710,3.6]]){
 const row=await evaluate(`(async()=>{const c=game.state.toyRoomInstance.instance.chase,r=c.renderer,T=await import('/src/vendor/three/three.module.js'),{chasePacing}=await import('/src/js/bear-chase/ChasePacing.js');Object.assign(c.state,{stage:'RUNNING',distance:${distance},x:${x},bearX:0,gap:chasePacing(${distance}).gap,time:50,age:40,obstacles:[]});const saved=JSON.stringify(c.state);c.render();r.scene.updateMatrixWorld(true);r.camera.updateMatrixWorld(true);const projections={};for(const [name,root]of [['girl',r.girl],['bear',r.bear]]){const b=new T.Box3().setFromObject(root),points=[];for(const xx of [b.min.x,b.max.x])for(const yy of [b.min.y,b.max.y])for(const zz of [b.min.z,b.max.z])points.push(new T.Vector3(xx,yy,zz).project(r.camera));projections[name]={minX:Math.min(...points.map(p=>p.x)),maxX:Math.max(...points.map(p=>p.x)),minY:Math.min(...points.map(p=>p.y)),maxY:Math.max(...points.map(p=>p.y)),height:Math.max(...points.map(p=>p.y))-Math.min(...points.map(p=>p.y))};}return {distance:${distance},x:${x},width:${width},height:${height},gap:c.state.gap,fov:r.camera.fov,calls:r.renderer.info.render.calls,projections,state:saved===JSON.stringify(c.state),data:c.canvas.toDataURL()};})()`);
 const bytes=Buffer.from(row.data.split(',')[1],'base64'),file='/tmp/ritmo-'+width+'-'+distance+'-'+x+'.png';await fs.writeFile(file,bytes);captures.push({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});delete row.data;rows.push(row);
 const g=row.projections.girl,b=row.projections.bear;assert.ok(g.minX>-1&&g.maxX<1&&g.minY>-1&&g.maxY<1,'Menina deve continuar inteira no quadro: '+JSON.stringify(row));assert.ok(b.minX>-1&&b.maxX<1&&b.minY>-1&&b.maxY<1,'Urso deve permanecer visível: '+JSON.stringify(row));assert.ok(row.state&&row.calls<310);
 }
 const start=rows.find(r=>r.width===width&&r.distance===30),end=rows.find(r=>r.width===width&&r.distance===710&&r.x===0);assert.ok(end.projections.girl.height>start.projections.girl.height*1.1,'Ampliação da menina: '+JSON.stringify({width,start,end}));assert.ok(end.projections.bear.height>start.projections.bear.height*2);
 }
 console.log('APROVADO: aproximação projetada real, atores enquadrados nas laterais, estado preservado e três formatos.',JSON.stringify({rows,captures}));assert.deepEqual(exceptions,[]);assert.deepEqual(failed,[]);
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
