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

/** Aguarda carregamento real sem avançar artificialmente o relógio da fase. */
async function until(expression) {
  for (let i = 0; i < 200; i++) {
    if (await evaluate(expression)) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw Error('Condição não atingida: ' + expression);
}
/** Registra capturas regeneráveis por caminho, hash e tamanho, sem guardar bitmaps no projeto. */
async function capture(name) {
  const screenshot = await send('Page.captureScreenshot', {format:'png'});
  const bytes=Buffer.from(screenshot.data,'base64'),file='/tmp/legendgirl-retomada-'+name+'.png';
  await fs.writeFile(file,bytes);
  console.log('CAPTURA',JSON.stringify({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')}));
}
try {
  await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable');
  await send('Page.navigate', {url:'http://127.0.0.1:3000/?debug=1'});
  await until('Boolean(window.game)');
  await evaluate('localStorage.clear()');
  await send('Page.reload'); await until('Boolean(window.game)');
  assert.equal(await evaluate("document.querySelector('#btn-load-game').disabled"), true);
  await evaluate("document.querySelector('#btn-easy-mode').click()");
  assert.equal(await evaluate("document.querySelector('#game-difficulty').value"), 'EASY');
  await evaluate("document.querySelector('#btn-start-phase1').focus()");
  await send('Input.dispatchKeyEvent', {type:'keyDown',key:'ArrowDown',code:'ArrowDown'});
  assert.equal(await evaluate('document.activeElement.id'), 'btn-easy-mode');
  await send('Input.dispatchKeyEvent', {type:'keyUp',key:'ArrowDown',code:'ArrowDown'});
  await evaluate("document.querySelector('#btn-title-options').click()");
  assert.equal(await evaluate("document.querySelector('#title-options-dialog').open"), true);
  await send('Input.dispatchKeyEvent', {type:'keyDown',key:'Escape',code:'Escape'});
  await send('Input.dispatchKeyEvent', {type:'keyUp',key:'Escape',code:'Escape'});
  assert.equal(await evaluate("document.querySelector('#title-options-dialog').open"), false);
  await evaluate("window.progressQuery=game.hasProgress;game.hasProgress=()=>true;document.querySelector('#btn-start-phase1').click()");
  assert.equal(await evaluate("document.querySelector('#restart-campaign-dialog').open"), true);
  await evaluate("document.querySelector('#restart-campaign-dialog button[value=cancel]').click();game.hasProgress=progressQuery");
  assert.equal(await evaluate('game.state.gameStarted'), false);
  const layouts=[];
  for (const [width,height,mobile] of [[1920,1080,false],[390,844,true],[844,390,true],[320,568,true]]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
    await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
    const result=await evaluate(`(()=>{const buttons=[...document.querySelectorAll('.title-actions button,#btn-title-options')];return {width:${width},height:${height},valid:buttons.every(b=>{const r=b.getBoundingClientRect();return r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight}),canvas:document.querySelector('#title-scene').width};})()`);
    assert.ok(result.valid,JSON.stringify(result));layouts.push(result);
    await capture('menu-'+width);
  }
  const runs=[];
  for (const [width,height,mobile] of [[1280,800,false],[390,844,true],[844,390,true]]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
    await evaluate("document.querySelector('#debug-phase-select').value='arena';document.querySelector('#debug-phase-select').dispatchEvent(new Event('change',{bubbles:true}));game.setPaused(true);window.room=game.state.toyRoomInstance.instance;room.isInputEnabled=()=>true");
    await until('room.battle.ready && room.arena.playerRenderer.ready');
    const handoff=await evaluate(`(()=>{
      room.update(1); room.battle.state.mode='VICTORY';room.arena.beginReturn();
      room.update(12);room.update(12);const before=room.chase===null;
      room.update(6);window.chase=room.chase;chase.setPaused(false);chase.render();
      return {before,campaign:chase.campaign,stage:chase.state.stage,age:chase.state.age,installed:Boolean(chase.input.installed),pixel:[...chase.ctx.getImageData(20,20,1,1).data],banner:room.victoryBannerActive};})()`);
    assert.ok(handoff.before && handoff.campaign && !handoff.installed && !handoff.banner);
    assert.equal(handoff.stage,'BEAR_DOWN');assert.equal(handoff.age,0);assert.deepEqual(handoff.pixel,[20,14,19,255]);
    await until('chase.ready || chase.error');
    assert.equal(await evaluate('chase.error'),null);
    const reveal=await evaluate(`(()=>{let draws=0;const original=chase.renderer.render.bind(chase.renderer);chase.renderer.render=(...args)=>{draws++;return original(...args)};
      for(let i=0;i<25;i++){chase.update(1);chase.render()}
      return {stage:chase.state.stage,age:chase.state.age,draws,installed:chase.input.installed,fade:chase.handoffFade,webgl2:chase.renderer.renderer.getContext() instanceof WebGL2RenderingContext};})()`);
    assert.equal(reveal.stage,'BEAR_DOWN');assert.ok(reveal.age<.04);assert.equal(reveal.draws,0);assert.ok(reveal.installed&&reveal.fade===0&&reveal.webgl2);
    await capture('abertura-'+width);
    await evaluate('window.saved=room.snapshot();window.abandoned=chase;room.restore(saved);window.chase=room.chase');
    await until('chase.ready || chase.error');
    assert.equal(await evaluate('chase.error'),null);
    assert.equal(await evaluate('abandoned.disposed && abandoned.renderer.resources.size===0'),true);
    assert.equal(await evaluate('JSON.stringify(chase.snapshot().state)===JSON.stringify(saved.toyRoomChaseCampaign.state)'),true);
    const completion=await evaluate(`(()=>{chase.setPaused(false);const stages=new Set();chase.input.sample=()=>{
      const next=chase.state.obstacles.filter(o=>o.z>=chase.state.distance-.1).sort((a,b)=>a.z-b.z)[0];if(!next)return 0;
      const group=chase.state.obstacles.filter(o=>Math.abs(o.z-next.z)<.01);
      const choices=[-2.4,0,2.4].filter(x=>group.every(o=>Math.abs(o.x-x)>1)).sort((a,b)=>Math.abs(a-chase.state.x)-Math.abs(b-chase.state.x));
      return Math.abs(choices[0]-chase.state.x)<.05?0:Math.sign(choices[0]-chase.state.x)};
      for(let i=0;i<8000&&chase.state.stage!=='COMPLETE';i++){chase.update(1);stages.add(chase.state.stage);if(i%120===0)chase.render()}
      chase.render();return {stage:chase.state.stage,hits:chase.state.hits,chest:chase.state.chestApplied,stages:[...stages],calls:chase.renderer.renderer.info.render.calls};})()`);
    assert.equal(completion.stage,'COMPLETE');assert.equal(completion.hits,0);assert.ok(completion.chest);
    for(const stage of ['GIRL_APPROACH','BEAR_RISE','CHASE_START','RUNNING'])assert.ok(completion.stages.includes(stage),stage);
    runs.push({width,height,handoff,reveal,completion});
  }
  const recovery=await evaluate(`(()=>{room.chase.destroy();room.chase=null;room.createChasePhase=()=>{throw Error('Falha simulada de WebGL')};room.startChaseCampaign();return {chase:room.chase,mode:room.gameplayState,open:document.querySelector('#chase-error-dialog').open,text:document.querySelector('#chase-error-message').textContent};})()`);
  assert.equal(recovery.chase,null);assert.equal(recovery.mode,'TOY_ROOM_GAMEPLAY');assert.ok(recovery.open&&recovery.text.includes('Falha simulada'));
  await evaluate("document.querySelector('#chase-error-dialog button').click()");
  assert.equal(await evaluate("document.querySelector('#chase-error-dialog').open"),false);
  assert.deepEqual(exceptions,[]);assert.deepEqual(failed,[]);
  console.log('APROVADO: menu em quatro formatos, teclado, modo fácil, opções, cancelamento; transição real do controlador com WebGL 2 em três formatos, preto, bloqueio de entrada, revelação 2D, save/restore, percurso até baú e erro visível recuperável.',JSON.stringify({layouts,runs,recovery}));
} finally {ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
