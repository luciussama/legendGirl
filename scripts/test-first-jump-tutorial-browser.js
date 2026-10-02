// Requer servidor local :3000 e Chrome de teste com depuração remota :9222.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
// Cada captura usa uma aba isolada para preservar a integridade dos logs.
const page = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', {method:'PUT'})).json();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let sequence = 0;
const pending = new Map();
ws.onmessage = ({data}) => { const m = JSON.parse(data); if (pending.has(m.id)) {
  const {resolve,reject} = pending.get(m.id); pending.delete(m.id);
  m.error ? reject(Error(JSON.stringify(m.error))) : resolve(m.result);
}};
const send = (method, params = {}) => new Promise((resolve,reject) => {
  const id = ++sequence; pending.set(id,{resolve,reject}); ws.send(JSON.stringify({id,method,params}));
});
async function evaluate(expression) {
  const result = await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
  if(result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}

try {
 await send('Page.enable');await send('Runtime.enable');
 await send('Page.navigate',{url:'http://127.0.0.1:3000/tests/dark-room-playthrough.html'});
 for(let i=0;i<200;i++){if(await evaluate('Boolean(window.review)'))break;await new Promise(r=>setTimeout(r,100));}
 assert.ok(await evaluate('Boolean(window.review)'),'Fixture inicializada');
 const result=await evaluate(`(()=>{
  const game=window.review.game,r=game.review;r.beginManual();
  for(let i=0;i<2249;i++)r.frameManual(true);
  if(!r.inspectManual().opening||game.state.gameplayState!=='CUTSCENE')throw Error('A abertura deve permanecer ativa até seu término');
  r.frameManual(true);r.frameManual(true);
  if(r.inspectManual().opening||game.state.gameplayState!=='FIRST_JUMP_TUTORIAL')throw Error('Tutorial não iniciou ao concluir a abertura');
  const snapshot=()=>JSON.stringify({baby:game.state.baby,fairy:game.state.fairy,cameraX:game.state.cameraX,cameraY:game.state.cameraY,cameraZoom:game.state.cameraZoom,
   targetCameraY:game.state.targetCameraY,targetCameraZoom:game.state.targetCameraZoom,tick:game.state.tick,firstPlatformCleared:game.state.firstPlatformCleared,
   escapeLevel:game.state.escapeLevel,phase3Level:game.state.phase3Level,isPhase3:game.state.isPhase3,mode:game.state.currentPhaseMode,
   platforms:window.review.platforms,camera:{x:game.camera.x,y:game.camera.y,zoom:game.camera.zoom}});
  const before=snapshot();for(let i=0;i<600;i++){if(i%60===0)r.actionManual();r.frameManual(i%60===0);}
  if(snapshot()!==before)throw Error('Tutorial avançou movimento, câmera, física ou progressão');
  if(!game.state.baby.controlsLocked||!game.state.baby.onGround)throw Error('Personagem não permanece no chão com entrada bloqueada');
  return {estado:game.state.gameplayState,framesObservados:600,meninaParada:true,cameraParada:true,saltosBloqueados:true,fasePreservada:true};
 })()`);
 console.log('APROVADO: '+JSON.stringify(result));
} finally {ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
