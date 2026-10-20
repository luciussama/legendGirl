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
 const result=await evaluate(`(async()=>{
 const c=game.state.toyRoomInstance.instance.chase,r=c.renderer;
 const {createChaseState}=await import('/src/js/bear-chase/ChaseSimulation.js');
 const {routePoint}=await import('/src/js/bear-chase/ChaseRoute.js');
 const T=await import('/src/vendor/three/three.module.js');
 game.setPaused(false);c.state=createChaseState();c.setPaused(false);const original=c.input.sample;
 let maxInfo=null;let target=0,ticks=0,maxCalls=0,previous=null,switches=0,maxJump=0;const shots=[];
 const marks=[76,80,84,88,92,148,208,225,274,290,338,404,468,538,603,660,690,710,716];
 c.input.sample=()=>Math.max(-1,Math.min(1,(target-c.state.x)*4));
 try{
 while(c.state.stage!=='COMPLETE'&&ticks++<15000){
 if(ticks%18===0){target=0;const near=c.state.obstacles.filter(o=>o.z>=c.state.distance-.5&&!o.hit).sort((a,b)=>a.z-b.z)[0];if(near){const group=c.state.obstacles.filter(o=>Math.abs(o.z-near.z)<.01&&!o.hit);target=[-2.4,0,2.4].filter(x=>group.every(o=>Math.abs(x-o.x)>1.1)).sort((a,b)=>Math.abs(a-c.state.x)-Math.abs(b-c.state.x))[0]??0;}}
 c.update(1);
 if(ticks%60===0||(marks.length&&c.state.distance>=marks[0])){c.render();if(r.renderer.info.render.calls>maxCalls){maxCalls=r.renderer.info.render.calls;maxInfo={distance:c.state.distance,stage:c.state.stage,gap:c.state.gap,obstacles:c.state.obstacles.length};}if(marks.length&&c.state.distance>=marks[0]){const s=marks.shift();shots.push({distance:s,data:c.canvas.toDataURL()});}}
 }
 game.setPaused(true);
 for(let s=0;s<=720;s+=.25){
 r.lighting.update({...c.state,distance:s,gap:23},false);
 const current=r.lighting.windows.find(w=>w.castShadow),now=current?{id:current.userData.windowDistance,value:current.shadow.intensity}:null;
 if(previous&&now&&previous.id!==now.id){switches++;if(Math.max(previous.value,now.value)>.02)throw Error('Troca abrupta da sombra de janela.');}
 if(previous&&now&&previous.id===now.id)maxJump=Math.max(maxJump,Math.abs(previous.value-now.value));
 if(r.lighting.windows.some(w=>w.map!==r.lighting.cookie))throw Error('Máscara de janela mudou durante a corrida.');
 previous=now||previous;
 }
 // Amostra o piso jogável dentro do mapa frontal em entradas, meios e saídas de curvas.
 let outside=0,total=0;const outsidePoints=[];
 for(const s of [60,82,100,148,208,225,274,290,338,404,468,538,603,680]){
 r.lighting.update({...c.state,distance:s,gap:23},false);r.scene.updateMatrixWorld(true);const l=r.lighting.front;l.shadow.updateMatrices(l);
 for(const ds of [-4,0,10,23,35])for(const x of [-3,0,3]){const p=routePoint(s+ds,x,.1),v=new T.Vector3(p.x,p.y,p.z).applyMatrix4(l.shadow.matrix);total++;if(v.x<0||v.x>1||v.y<0||v.y>1||v.z<0||v.z>1){outside++;outsidePoints.push({s,ds,x,uv:v.toArray()});}}
 }
 return {stage:c.state.stage,hits:c.state.hits,ticks,maxCalls,maxInfo,maxJump,switches,outside,outsidePoints,total,shots};
 }finally{c.input.sample=original;game.setPaused(true);}
 })()`);
 const captures=[];for(const shot of result.shots){const bytes=Buffer.from(shot.data.split(',')[1],'base64'),file='/tmp/ritmo-gameplay-'+shot.distance+'.png';await fs.writeFile(file,bytes);captures.push({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});}delete result.shots;
 console.log('GAMEPLAY',JSON.stringify(result),'CAPTURAS',JSON.stringify(captures));
 assert.equal(result.stage,'COMPLETE');assert.ok(result.maxCalls<310,'Custo de desenho: '+result.maxCalls);assert.equal(result.outside,0,'Piso próximo deve permanecer no mapa frontal');assert.ok(result.maxJump<.06);assert.ok(result.switches>20);assert.deepEqual(exceptions,[]);assert.deepEqual(failed,[]);
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
