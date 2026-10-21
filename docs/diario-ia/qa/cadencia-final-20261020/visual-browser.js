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
 await send('Page.navigate',{url:'http://127.0.0.1:3000/?debug=1'});
 for(let i=0;i<200;i++){if(await evaluate('Boolean(window.game?.startDebugPhase)'))break;await new Promise(r=>setTimeout(r,100));}
 await evaluate("game.startDebugPhase('bear-chase')");
 let ready=false;for(let i=0;i<240;i++){const v=await evaluate('(()=>{const c=game.state.toyRoomInstance?.instance.chase;return {ready:c?.ready,error:c?.error}})()');if(v.error)throw Error(v.error);if(v.ready){ready=true;break}await new Promise(r=>setTimeout(r,100));}assert.ok(ready);
 await evaluate('game.setPaused(true)');const rows=[],captures=[];
 for(const [width,height]of [[1280,800],[390,844],[844,390]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<900});await new Promise(r=>setTimeout(r,200));
 for(const progress of [.7,.85,.94])for(const lane of [0,1,2]){
 const row=await evaluate(`(async()=>{const c=game.state.toyRoomInstance.instance.chase,r=c.renderer,{chasePattern}=await import('/src/js/bear-chase/ChasePatterns.js'),T=await import('/src/vendor/three/three.module.js');const p=chasePattern(${progress},'NORMAL',${lane});Object.assign(c.state,{stage:'RUNNING',distance:${progress}*720,x:${lane-1}*1.2,bearX:0,gap:20,time:60,age:40,obstacles:p.obstacles.map((o,i)=>({...o,id:i,kind:['blocks','train','bunny'][i%3],z:${progress}*720+12,fromZ:${progress}*720+12,fromX:o.x,age:1,flight:.4,fitWidth:true}))});const before=JSON.stringify(c.state);c.render();const measured=c.state.obstacles.map(o=>{const root=r.toys.get(o.id),copy=root.clone(true);copy.position.set(0,0,0);copy.rotation.set(0,0,0);copy.updateMatrixWorld(true);return{expected:o.width,actual:new T.Box3().setFromObject(copy).getSize(new T.Vector3()).x,scale:root.scale.toArray(),center:new T.Box3().setFromObject(copy).getCenter(new T.Vector3()).x,offset:root.userData.visualCenterX*root.scale.x,kind:o.kind};});return{width:${width},height:${height},progress:${progress},lane:${lane},calls:r.renderer.info.render.calls,unchanged:before===JSON.stringify(c.state),measured,data:c.canvas.toDataURL()};})()`);
 for(const m of row.measured){assert.ok(Math.abs(m.expected-m.actual)<1e-5,JSON.stringify(m));assert.ok(Math.abs(m.center-m.offset)<1e-6);assert.equal(m.scale[0],m.scale[1]);assert.equal(m.scale[1],m.scale[2]);}assert.ok(row.unchanged);assert.ok(row.calls<310,'Orçamento original de desenho: '+JSON.stringify({...row,data:undefined}));
 if(lane===1){const bytes=Buffer.from(row.data.split(',')[1],'base64'),file='/tmp/cadencia-final-'+width+'-'+progress+'.png';await fs.writeFile(file,bytes);captures.push({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});}delete row.data;rows.push(row);
 }
 }
 const gameplay=await evaluate(`(async()=>{const c=game.state.toyRoomInstance.instance.chase,{createChaseState}=await import('/src/js/bear-chase/ChaseSimulation.js'),{targetFor}=await import('/docs/diario-ia/qa/balanceamento-20261020/corredor.js');game.setPaused(false);const result=[];for(const difficulty of ['NORMAL','EASY']){c.difficulty=difficulty;c.state=createChaseState();c.setPaused(false);c.input.sample=()=>Math.max(-1,Math.min(1,(targetFor(c.state)-c.state.x)*4));let frames=0,maxCalls=0,maxToys=0,groups=new Set();while(c.state.stage!=='COMPLETE'&&frames++<10000){c.update(1);maxToys=Math.max(maxToys,c.state.obstacles.length);if(c.state.obstacles.length)groups.add(c.state.obstacles.filter(o=>o.z===c.state.obstacles.at(-1).z).length);if(frames%30===0){c.render();maxCalls=Math.max(maxCalls,c.renderer.renderer.info.render.calls);}}result.push({difficulty,frames,stage:c.state.stage,hits:c.state.hits,maxCalls,maxToys,groups:[...groups]});}game.setPaused(true);return result;})()`);
 for(const r of gameplay){assert.equal(r.stage,'COMPLETE');assert.equal(r.hits,0);assert.ok(r.maxCalls<310,JSON.stringify(r));assert.equal(r.groups.includes(4),false);assert.equal(r.groups.includes(3),r.difficulty==='NORMAL');}
 // A apresentação da arena recebe o perfil escolhido inclusive depois de restaurar.
 const arena=await evaluate(`(async()=>{const {ToyRoomPhase}=await import('/src/js/toy-room/ToyRoomPhase.js');game.setPaused(false);const result=[];for(const difficulty of ['NORMAL','EASY']){const room=new ToyRoomPhase(document.createElement('canvas'),null,null,null,{bindInputs:false,gameDifficulty:difficulty});room.arena.configurePresentation();const first={range:room.battle.getSwordRange('bear'),idle:room.battle.presentation.enemies.bear.idleTime};room.arena.configurePresentation();result.push({difficulty,...first,restored:room.battle.getSwordRange('bear')});room.destroy();}return result;})()`);
 assert.ok(Math.abs(arena[1].range/arena[0].range-1.3)<1e-8);assert.ok(arena[1].idle>arena[0].idle);assert.ok(arena.every(r=>r.range===r.restored));
 assert.deepEqual(exceptions,[]);assert.deepEqual(failed,[]);
 console.log('APROVADO: três formatos, escala uniforme e largura visual dos grupos, estado preservado, dois percursos controlados sem dano, perfil da arena e orçamento GPU.',JSON.stringify({rows,gameplay,arena,captures}));
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
