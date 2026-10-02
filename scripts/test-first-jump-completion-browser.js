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

try{
 await send('Page.enable');await send('Runtime.enable');
 await send('Page.navigate',{url:'http://127.0.0.1:3000/tests/first-jump-tutorial.html'});
 for(let i=0;i<200;i++){if(await evaluate('Boolean(window.review)'))break;await new Promise(r=>setTimeout(r,100));}
 assert.ok(await evaluate('Boolean(window.review)'),'Fixture inicializada');
 const results=await evaluate(`(()=>{
  const g=window.review.game,r=g.review,input=g.input.controller,results=[];
  const finishOpening=()=>{r.beginManual();for(let i=0;i<2251;i++)r.frameManual(false);input.lastInputTime=-10000;r.frameManual(true);};
  const check=(condition,message)=>{if(!condition)throw Error(message);};
  for(const kind of ['touch','keyboard','mouse','gamepad']){
   finishOpening();check(!g.state.firstJumpTutorialCompleted&&g.state.gameplayState==='FIRST_JUMP_TUTORIAL','Novo save deve mostrar tutorial');
   const pad={connected:true,index:0,id:'Xbox Controller',buttons:Array.from({length:4},()=>({pressed:false,value:0}))};
   Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[pad]});input.prevTutorialButtonA.clear();input.prevGamepadButtonX.clear();
   input.handleKeyDown({code:'ArrowUp',key:'ArrowUp',repeat:false,cancelable:false});
   pad.buttons[2]={pressed:true,value:1};input.pollGamepad();pad.buttons[2]={pressed:false,value:0};input.pollGamepad();
   check(!g.state.firstJumpTutorialCompleted,'Seta para cima e X não podem concluir tutorial');
   g.setPaused(true);g.doJump('keyboard');g.setPaused(false);
   g.state.baby.onGround=false;g.doJump('keyboard');g.state.baby.onGround=true;
   check(!g.state.firstJumpTutorialCompleted,'Pausa ou ausência de solo não podem concluir');
   if(kind==='gamepad'){input.prevTutorialButtonA.set(0,true);pad.buttons[0]={pressed:true,value:1};input.pollGamepad();check(!g.state.firstJumpTutorialCompleted,'A já segurado não deve iniciar salto automático');pad.buttons[0]={pressed:false,value:0};input.pollGamepad();}
   input.lastInputTime=-10000;
   if(kind==='touch'||kind==='mouse')input.handlePointerDown({pointerType:kind,isPrimary:true,cancelable:false,target:null,button:0});
   if(kind==='keyboard')input.handleKeyDown({code:'Space',key:' ',repeat:false,cancelable:false});
   if(kind==='gamepad'){pad.buttons[0]={pressed:true,value:1};input.pollGamepad();}
   check(g.state.firstJumpTutorialCompleted&&g.state.gameplayState==='GAMEPLAY_NORMAL','Salto válido não concluiu: '+kind);
   check(!g.state.baby.onGround&&g.state.baby.vy===g.state.baby.jumpPower&&!g.state.baby.controlsLocked,'Impulso original e movimento devem estar liberados');
   const saved=JSON.parse(localStorage.getItem('legendGirl.campaign.v1'));check(saved.state.firstJumpTutorialCompleted,'Conclusão não persistiu');
   r.frameManual(true);check(window.firstJumpTutorialLayout===null,'Tutorial e seta ainda desenhados');
   const x=g.state.baby.x;r.frameManual(false);check(g.state.baby.x>x,'Movimento normal não retomou');
   g.retry();r.frameManual(true);check(g.state.firstJumpTutorialCompleted&&g.state.gameplayState!=='FIRST_JUMP_TUTORIAL','Nova tentativa reapresentou tutorial');
   r.restoreManual({state:saved.state,opening:saved.opening,cameraPresentation:null});r.frameManual(true);
   check(g.state.firstJumpTutorialCompleted&&window.firstJumpTutorialLayout===null,'Save restaurado reapresentou tutorial');
   finishOpening();check(!g.state.firstJumpTutorialCompleted&&window.firstJumpTutorialLayout!==null,'Novo save deve reapresentar tutorial');
   results.push({entrada:kind,primeiraExecucao:true,saltoOriginal:true,conclusaoPersistida:true,tentativaSemTutorial:true,restauracaoSemTutorial:true,novoSaveComTutorial:true});
  }
  return results;
 })()`);
 await fs.mkdir('assets/qa-testers/current-logs',{recursive:true});await fs.writeFile('assets/qa-testers/current-logs/first-jump-completion.json',JSON.stringify(results,null,2));
 console.log('APROVADO: quatro entradas válidas, rejeição de entradas inválidas, salto original, conclusão persistida, retry/restore sem tutorial e novo save com tutorial.');
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
