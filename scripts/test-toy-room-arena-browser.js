// Requer servidor local :3001 e Chrome isolado com depuração remota :9222.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const output='docs/qa/toy-room-arena';await fs.mkdir(output,{recursive:true});
const pages=await(await fetch('http://127.0.0.1:9222/json')).json();
const page=pages.find(p=>p.type==='page');assert.ok(page,'Página de teste disponível.');
const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
let id=0;const pending=new Map(),exceptions=[],failedRequests=[];
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.method==='Runtime.exceptionThrown')exceptions.push(m.params.exceptionDetails);if(m.method==='Network.responseReceived'&&m.params.response.status>=400)failedRequests.push({url:m.params.response.url,status:m.params.response.status});if(pending.has(m.id)){const {resolve,reject}=pending.get(m.id);pending.delete(m.id);m.error?reject(Error(JSON.stringify(m.error))):resolve(m.result);}};
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
try {
 await send('Runtime.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});
 for(const [profile,width,height,mobile]of [['desktop',960,540,false],['android',390,844,true],['android-paisagem',844,390,true]]) {
  exceptions.length=0;failedRequests.length=0;
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
  await send('Emulation.setUserAgentOverride',{userAgent:mobile?'Mozilla/5.0 (Linux; Android 14) Mobile':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'});
  await send('Page.navigate',{url:'http://127.0.0.1:3001/tests/toy-room-arena.html'});
  let ready=false;for(let i=0;i<200;i++){if(await evaluate('document.body?.dataset.ready === "true"')){ready=true;break;}await new Promise(r=>setTimeout(r,100));}assert.ok(ready,'Recursos da arena carregados.');
  const result=await evaluate(`(async()=>{
    arenaTest.pause();const {room,assets}=arenaTest;
    const {runToyRoomQA}=await import('/tests/toy-room-qa-runner.js');const {runBattleGameplay}=await import('/tests/battle-gameplay-runner.js');
    const shots={},renderTimes=[],sources=new Set(),checkpoints=[];
    const original=room.render.bind(room);let inspecting=false;
    const originalDraw=CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage=function(img,...args){if(this.canvas===room.canvas&&room.arena.active&&img.src)sources.add(new URL(img.src).pathname);return originalDraw.call(this,img,...args);};
    room.render=(options={})=>{
      if(options.arenaBackdrop){original(options);return;}
      const before=JSON.stringify(room.snapshot());const t=performance.now();original();if(room.arena.active){room.ctx.getImageData(0,0,room.canvas.width,room.canvas.height);renderTimes.push(performance.now()-t);}
      const after=JSON.stringify(room.snapshot());if(before!==after)throw Error('Render alterou estado persistido.');
      const a=room.arena.state,s=room.battle.state;const label=a.status==='TRANSFORMING'?'transformacao':a.status==='RETURNING'?(a.realityRestored?'realidade':'retorno'):s?'arena-'+s.enemy.actor+'-'+(s.transition?'entrada':s.enemy.state==='ENRAGE'?'furia':s.attackTime>0?'ataque':'movimento'):room.player.carriedItem?'transporte':'exploracao';
      if(!shots[label])shots[label]=room.canvas.toDataURL().split(',')[1];
      if(!inspecting&&room.arena.active&&!checkpoints.includes(a.status)) {inspecting=true;const saved=JSON.parse(JSON.stringify(room.snapshot()));room.restore(saved);checkpoints.push(a.status);inspecting=false;}
    };
    try {
      room.render();const exploration=runToyRoomQA(room,{draw:true});
      const start=room.snapshot();while(room.battle.state.transition)room.update();
      room.keysDown={ArrowUp:true};room.update();room.keysDown={};for(let i=0;i<20;i++)room.update();room.render();shots.salto=room.canvas.toDataURL().split(',')[1];
      room.restore(start);while(room.battle.state.transition)room.update();room.keysDown={ArrowDown:true};room.update();room.render();shots['agachamento-entrada']=room.canvas.toDataURL().split(',')[1];for(let i=0;i<8;i++)room.update();room.render();shots.agachamento=room.canvas.toDataURL().split(',')[1];room.restore(start);
      const battle=runBattleGameplay(room,{draw:true,restore:true});room.render();shots.vitoria=room.canvas.toDataURL().split(',')[1];
      for(let i=0;i<400;i++){room.update();if(i%15===0)room.render();}room.render();shots.final=room.canvas.toDataURL().split(',')[1];
      if(!room.arena.state.completed||room.battle.state||!room.story.state.arenaCompleted)throw Error('Retorno não concluiu.');
      const saved=JSON.parse(JSON.stringify(room.snapshot()));room.restore(saved);room.update();if(room.battle.state)throw Error('Save pós-retorno reiniciou arena.');
      room.restore(start);while(room.battle.state.transition)room.update();
      for(let i=0;i<4000&&room.battle.state.mode==='BATTLE';i++){const dx=room.battle.state.enemy.x-room.player.x;room.keysDown=Math.abs(dx)>60?{[dx>0?'ArrowRight':'ArrowLeft']:true}:{};room.update();if(i%30===0)room.render();}
      if(room.battle.state.mode!=='DEFEAT')throw Error('Derrota não alcançada.');room.render();shots.derrota=room.canvas.toDataURL().split(',')[1];
      for(let i=0;i<100;i++)room.update();room.handleKeyDown({code:'Space',repeat:false});room.handleKeyUp({code:'Space'});
      if(room.battle.state.mode!=='BATTLE'||room.battle.state.player.hp!==3)throw Error('Nova tentativa falhou.');
      room.restore(saved);room.render();
      const sorted=renderTimes.sort((a,b)=>a-b);return {exploration,battle,retry:true,returned:room.arena.state.completed,resources:[...assets.statuses],sources:[...sources],checkpoints,performance:{samples:sorted.length,median:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.floor(sorted.length*.95)]},shots};
    }finally{CanvasRenderingContext2D.prototype.drawImage=originalDraw;room.destroy();}
  })()`);
  for(const [name,data]of Object.entries(result.shots))await fs.writeFile(`${output}/${profile}-${name}.png`,Buffer.from(data,'base64'));delete result.shots;
  assert.equal(result.returned,true);assert.ok(result.sources.some(path=>path.includes('/girl/runtime/')),'Quadros detalhados realmente desenhados.');
  assert.equal(result.resources.filter(([,status])=>status!=='ready').length,0,'Sem recursos ausentes.');
  assert.equal(exceptions.length,0,'Sem exceções JavaScript.');assert.equal(failedRequests.filter(r=>!r.url.endsWith('/favicon.ico')).length,0,'Sem falhas HTTP de recursos.');
  result.exceptions=exceptions;result.failedRequests=failedRequests;
  await fs.writeFile(`${output}/${profile}.json`,JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({perfil:profile,exploracao:result.exploration,combate:result.battle,retorno:result.returned,render:result.performance}));
 }
}finally{ws.close();}
