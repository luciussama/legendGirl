import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const tab=await(await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json();const ws=new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});let id=0;const pending=new Map(),errors=[],failed=[];
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);if(m.method==='Network.responseReceived'&&m.params.response.status>=400&&!m.params.response.url.endsWith('favicon.ico'))failed.push(m.params.response.url);if(pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
/** Executa um comando no Chrome com prazo limitado. */
function send(method,params={}){return new Promise((resolve,reject)=>{const serial=++id,timer=setTimeout(()=>reject(Error('Tempo excedido: '+method)),25000);pending.set(serial,{resolve:r=>{clearTimeout(timer);resolve(r);},reject:e=>{clearTimeout(timer);reject(e);}});ws.send(JSON.stringify({id:serial,method,params}));});}
/** Consulta o jogo sem ocultar erros da avaliação. */
async function evaluate(expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
/** Aguarda uma condição sem bloquear a página. */
async function until(expression){for(let i=0;i<200;i++){if(await evaluate(expression))return;await new Promise(r=>setTimeout(r,100));}throw Error('Condição não alcançada: '+expression);}
/** Clica no centro real do botão, para verificar alinhamento e eventos de ponteiro. */
async function click(selector){const p=await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',clickCount:1});}
/** Registra a captura temporária com tamanho e hash, sem versionar o bitmap. */
async function capture(name){const raw=await send('Page.captureScreenshot',{format:'png'}),bytes=Buffer.from(raw.data,'base64'),file='/tmp/tela-inicial-'+name+'.png';await fs.writeFile(file,bytes);return{file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};}
const difficulty=process.argv[2]||'NORMAL';assert.ok(['NORMAL','EASY'].includes(difficulty));const resume=process.argv.includes('--resume');
const wait=ms=>new Promise(r=>setTimeout(r,ms));const held=new Set(),events=[],captures=[];
const keyValue={Space:' ',KeyE:'e',KeyP:'p',KeyM:'m'};
const virtual={End:35,Space:32,ArrowLeft:37,ArrowRight:39,ArrowUp:38,ArrowDown:40,KeyE:69,KeyP:80,KeyM:77};
/** Envia somente teclado nativo; não escreve controles internos nem avança a simulação. */
async function key(code,type){await send('Input.dispatchKeyEvent',{type,code,key:keyValue[code]||code,windowsVirtualKeyCode:virtual[code]});}
async function tap(code){await key(code,'keyDown');await key(code,'keyUp');}
async function keys(next){const wanted=new Set(next);for(const k of held)if(!wanted.has(k)){await key(k,'keyUp');held.delete(k)}for(const k of wanted)if(!held.has(k)){await key(k,'keyDown');held.add(k)}}
async function record(event,details={}){const e={event,seconds:+((Date.now()-start)/1000).toFixed(2),difficulty,...details};events.push(e);console.log(JSON.stringify(e));await fs.writeFile('/tmp/legendgirl-cadencia-status.json',JSON.stringify(e));}
async function shot(name){const x=await capture('real-'+difficulty+'-'+name);captures.push(x);console.log('CAPTURA',JSON.stringify(x));}
let start=Date.now(),lastAction=0,lastStatus=0,lastStage='',deaths=0,path=[],targetId='',lastPlan=0,lastAttack=0,finished=false,checkedReload=false,testedArenaDefeat=false;
try{
 await send('Runtime.enable');await send('Page.enable');await send('Network.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:1200,height:720,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:'http://127.0.0.1:3000/'});await until('Boolean(window.game)');await evaluate('localStorage.clear()');await send('Page.reload');await until('Boolean(window.game)');await evaluate('game.assetsReady');
 await wait(500);if(difficulty==='EASY')await click('#btn-easy-mode');await click('#btn-start-phase1');await until('game.state.gameStarted');await wait(500);await click('#btn-debug-phase-toggle');await evaluate("document.querySelector('#debug-phase-select').focus()");
 await send('Input.dispatchKeyEvent',{type:'char',key:'p',text:'p',unmodifiedText:'p',code:'KeyP',windowsVirtualKeyCode:80});console.log('SELETOR',await evaluate("JSON.stringify({value:document.querySelector('#debug-phase-select').value,focus:document.activeElement.id,hidden:document.querySelector('#debug-phase-panel').hidden,mode:game.state.currentPhaseMode,chase:game.state.toyRoomInstance?.instance.chase?.error})"));await until('Boolean(game.state.toyRoomInstance?.instance.chase?.ready)');
 const groups=new Map(),shots=new Set();let complete=false,lastReport=0;
 while(Date.now()-start<180000){
  const c=await evaluate(`(()=>{const c=game.state.toyRoomInstance.instance.chase;return{stage:c.state.stage,distance:c.state.distance,time:c.state.time,x:c.state.x,hits:c.state.hits,error:c.error,difficulty:c.difficulty,obstacles:c.state.obstacles.map(o=>({id:o.id,x:o.x,z:o.z,width:o.width,age:o.age}))}})()`);if(c.error)throw Error(c.error);assert.equal(c.difficulty,difficulty);
  if(Date.now()-lastReport>5000){await record('progresso',c);lastReport=Date.now()}
  for(const o of c.obstacles)if(!groups.has(o.z)){const group=c.obstacles.filter(x=>x.z===o.z);groups.set(o.z,{distance:c.distance,time:c.time,count:group.length});}
  if(c.stage==='RUNNING'){
   const next=c.obstacles.filter(o=>o.z>=c.distance-.1).sort((a,b)=>a.z-b.z)[0];let target=0;
   if(next){let free=[[-3.6,3.6]];for(const o of c.obstacles.filter(o=>o.z===next.z)){const l=o.x-o.width/2-.36,r=o.x+o.width/2+.36;free=free.flatMap(([a,b])=>r<=a||l>=b?[[a,b]]:[[a,Math.min(b,l)],[Math.max(a,r),b]].filter(([x,y])=>y>x));}target=free.map(([a,b])=>(a+b)/2).sort((a,b)=>Math.abs(a-c.x)-Math.abs(b-c.x))[0];}
   const dx=target-c.x;await keys(Math.abs(dx)<.055?[]:[dx>0?'ArrowRight':'ArrowLeft']);
   const mark=c.distance>=.94*720?'pares-finais':c.distance>=.88*720?'pares':c.distance>=.74*720?'tres':null;if(mark&&!shots.has(mark)){await shot('cadencia-'+mark);shots.add(mark)}
  }else await keys([]);
  assert.notEqual(c.stage,'GAME_OVER','Perseguição nativa precisa terminar');
  if(c.stage==='COMPLETE'){await shot('cadencia-final');await record('conclusao',c);assert.equal(c.hits,0);complete=true;break}
  await wait(12);
 }
 assert.ok(complete);assert.ok([...groups.values()].every(g=>g.count<=3));if(difficulty==='NORMAL')assert.ok([...groups.values()].filter(g=>g.distance>=612&&g.count===2).length>=7);
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('APROVADO: perseguição completa em tempo real com teclas nativas; acesso pelo seletor da interface; sem escrita no estado, avanço manual ou rollback.',JSON.stringify({difficulty,groups:[...groups.values()],events,captures}));
}finally{await keys([]);ws.close();await fetch('http://127.0.0.1:9222/json/close/'+tab.id);}
