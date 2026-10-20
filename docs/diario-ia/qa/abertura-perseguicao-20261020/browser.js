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

 await evaluate('game.setPaused(true)');const captures=[],rows=[];
 for(const [width,height]of [[1280,800],[390,844],[844,390]]){
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<900});await new Promise(r=>setTimeout(r,180));
  for(const [stage,age]of [['BEAR_DOWN',.5],['GIRL_APPROACH',1.5],['GIRL_APPROACH',2.8],['GIRL_APPROACH',3.15],['GIRL_APPROACH',3.59],['BEAR_RISE',.1],['BEAR_RISE',.25],['BEAR_RISE',.7],['BEAR_RISE',.95],['BEAR_RISE',1.25],['CHASE_START',0],['CHASE_START',.5],['RUNNING',1]]){
   const row=await evaluate(`(async()=>{const c=game.state.toyRoomInstance.instance.chase;Object.assign(c.state,{stage:'${stage}',age:${age},time:3+${age}});let calls=0;const original=c.renderer.render;c.renderer.render=function(...args){calls++;return original.apply(this,args);};const before=JSON.stringify(c.state);try{c.render();const first=c.canvas.toDataURL();c.render();const second=c.canvas.toDataURL();const snap=c.snapshot();c.restore(snap);c.render();return {stage:'${stage}',age:${age},calls,stable:first===second&&first===c.canvas.toDataURL(),state:before===JSON.stringify(c.state),frames:c.intro.frames,reachFrames:c.intro.reachFrames,pose:c.intro.pose(c.canvas,c.state),data:first};}finally{c.renderer.render=original;}})()`);
   assert.equal(row.calls,['BEAR_DOWN','GIRL_APPROACH','BEAR_RISE'].includes(stage)?0:3,'Render 3D somente após urso levantar.');assert.ok(row.stable&&row.state,'Pausa/save devem preservar a imagem e o domínio.');assert.equal(row.frames.length,8);assert.equal(row.reachFrames.length,4);if(stage==='GIRL_APPROACH'&&age===3.59){assert.equal(row.pose.girlFrame,2);assert.ok(row.pose.reaching);assert.equal(row.pose.bearFrame,4);assert.ok(row.pose.handGap>0&&row.pose.handGap<row.pose.unit*.02,'Mão deve quase tocar o urso caído.');}if(stage==='BEAR_RISE'&&age===.1){assert.equal(row.pose.girlFrame,2);assert.equal(row.pose.bearFrame,4);}if(stage==='BEAR_RISE'&&age===.25){assert.equal(row.pose.girlFrame,3);assert.equal(row.pose.bearFrame,5);}if(stage==='BEAR_RISE'&&age===.95)assert.ok(row.pose.flee>0);
   const bytes=Buffer.from(row.data.split(',')[1],'base64'),file='/tmp/abertura-perseguicao-'+width+'-'+stage+'-'+age+'.png';await fs.writeFile(file,bytes);captures.push({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});delete row.data;rows.push({width,height,...row});
  }
 }
 const transition=await evaluate(`(async()=>{const {chaseIntroFade,isChaseIntro}=await import('/src/js/bear-chase/ChaseIntroRenderer.js');return {end:chaseIntroFade({stage:'BEAR_RISE',age:1.25}),start:chaseIntroFade({stage:'CHASE_START',age:0}),revealed:chaseIntroFade({stage:'CHASE_START',age:.4}),running:isChaseIntro('RUNNING')};})()`);
 assert.deepEqual(transition,{end:1,start:1,revealed:0,running:false});
 assert.deepEqual(exceptions,[]);assert.deepEqual(failed,[]);
 console.log('APROVADO: 39 cenas em três formatos, zero apresentações WebGL na cutscene, doze poses, quase toque antes da reação, fuga, pausa/save determinísticos e corte coberto.',JSON.stringify({rows,captures,transition}));
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
