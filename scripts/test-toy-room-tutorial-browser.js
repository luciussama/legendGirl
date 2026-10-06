import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const profile=process.argv[2]||'desktop';
const mobile=profile==='mobile',gamepad=profile==='gamepad',width=mobile?390:960,height=mobile?844:540;
const directory=`docs/qa/toy-room-tutorial/${profile}`;await fs.mkdir(directory,{recursive:true});
const page=await(await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let seq=0;const pending=new Map(),exceptions=[];
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.method==='Runtime.exceptionThrown')exceptions.push(m.params);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}};
const send=(method,params={})=>new Promise(r=>{const id=++seq;pending.set(id,r);ws.send(JSON.stringify({id,method,params}));});
const ev=async expression=>{const m=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(m.error||m.result.exceptionDetails)throw Error(JSON.stringify(m));return m.result.result.value;};
const capture=async name=>{const m=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(`${directory}/${name}.png`,Buffer.from(m.result.data,'base64'));};
try{
 await send('Page.enable');await send('Runtime.enable');
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
 await send('Emulation.setUserAgentOverride',{userAgent:mobile?'Mozilla/5.0 (Linux; Android 14) Mobile':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'});
 await send('Page.navigate',{url:'http://127.0.0.1:3001/index.html'});
 for(let i=0;i<200;i++){if(await ev('Boolean(window.game?.assets?.ready || window.game)'))break;await new Promise(r=>setTimeout(r,100));}
 await new Promise(r=>setTimeout(r,700));
 if(gamepad)await ev(`window.testPad={index:0,connected:true,mapping:'standard',axes:[0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>[testPad]})`);
 await ev(`localStorage.clear();window.order=[];document.getElementById('gameCanvas').addEventListener('TOY_ROOM_START',()=>order.push('start'));document.getElementById('btn-skip-phase2').click()`);
 assert.equal(await ev('game.toyRoomIntroduction.active'),true,'Botão começa pela introdução');
 await ev('game.toyRoomIntroduction.update(23.3*60+1)');
 await new Promise(r=>setTimeout(r,150));
 const start=await ev(`(()=>{window.phase=game.state.toyRoomInstance.instance;game.setPaused(true);return {order,tutorial:phase.tutorial.active,state:phase.gameplayState,message:phase.tutorial.message};})()`);
 assert.deepEqual(start.order,['start']);assert(start.tutorial);assert.equal(start.state,'TOY_ROOM_TUTORIAL');
 assert.match(start.message,mobile?/TOQUE E ARRASTE/:gamepad?/ANALÓGICO ESQUERDO/:/W A S D/);await capture('01-movimento');
 await ev(`(()=>{if(${gamepad})testPad.axes=[0.8,0];else if(${mobile}){const r=phase.canvas.getBoundingClientRect();phase.onPointerDown({pointerType:'touch',clientX:r.left+30,clientY:r.top+200,pointerId:1});phase.onPointerMove({clientX:r.left+70,clientY:r.top+200,pointerId:1});}else phase.handleKeyDown({code:'KeyD'});phase.update(2);if(${gamepad})testPad.axes=[0,0];else phase.handleKeyUp({code:'KeyD'});phase.onPointerUp({pointerId:1});for(let i=0;i<80;i++)phase.update(1);phase.render();})()`);
 assert.equal(await ev('phase.tutorial.step'),'pickup');await capture('02-coleta');
 const guide=await ev(`({target:phase.tutorial.target.id,nearest:phase.tutorial.nearest().id,message:phase.tutorial.message})`);assert.equal(guide.target,guide.nearest);
 assert.match(guide.message,mobile?/BOTÃO PEGAR/:gamepad?/PRESSIONE X/:/PRESSIONE E/);
 if(gamepad){
  assert.equal(await ev(`phase.handleKeyDown({code:'KeyD'});phase.update(1);phase.handleKeyUp({code:'KeyD'});phase.tutorial.device`),'DESKTOP_KEYBOARD_MOUSE');
  assert.equal(await ev(`testPad.axes=[0.8,0];phase.update(1);testPad.axes=[0,0];phase.tutorial.device`),'GAMEPAD');
 }
 const targetChange=await ev(`(()=>{const previous=phase.tutorial.target.id;phase.player.x=1140;phase.player.y=540;for(let i=0;i<31;i++)phase.update(1);const before={x:phase.fairy.x,y:phase.fairy.y};phase.update(1);return {previous,next:phase.tutorial.target.id,nearest:phase.tutorial.nearest().id,step:Math.hypot(phase.fairy.x-before.x,phase.fairy.y-before.y)};})()`);
 assert.notEqual(targetChange.previous,targetChange.next);assert.equal(targetChange.next,targetChange.nearest);assert(targetChange.step<100);
 await ev('for(let i=0;i<80;i++)phase.update(1);phase.render()');await capture('03-novo-alvo');
 const completed=await ev(`(()=>{const t=phase.tutorial.target;phase.player.x=t.x;phase.player.y=t.y;phase.lastActionTime=-Infinity;if(${gamepad})testPad.buttons[2]={pressed:true,value:1};else if(${mobile}){const r=phase.canvas.getBoundingClientRect();phase.onPointerDown({pointerType:'touch',clientX:r.right-50,clientY:r.bottom-50,pointerId:2});}else phase.handleKeyDown({code:'KeyE',preventDefault(){}});phase.update(1);phase.render();game.saveProgress();return {carried:phase.player.carriedItem?.id,completed:phase.toyRoomTutorialCompleted,active:phase.tutorial.active,snapshot:phase.snapshot()};})()`);
 assert(completed.carried);assert(completed.completed);assert.equal(completed.active,false);await capture('04-concluido');
 await send('Page.reload');await new Promise(r=>setTimeout(r,500));
 await ev(`document.getElementById('btn-start-phase1').click()`);await new Promise(r=>setTimeout(r,250));
 const restored=await ev('({mode:game.isToyRoomMode(),completed:game.state.toyRoomInstance.instance.toyRoomTutorialCompleted,active:game.state.toyRoomInstance.instance.tutorial.active})');
 assert(restored.mode&&restored.completed&&!restored.active,'Recarga conserva conclusão');
 await ev('game.newCampaign();game.startToyRoomIntroduction();game.toyRoomIntroduction.update(23.3*60+1)');
 await new Promise(r=>setTimeout(r,100));
 const fresh=await ev('({completed:game.state.toyRoomInstance.instance.toyRoomTutorialCompleted,active:game.state.toyRoomInstance.instance.tutorial.active})');
 assert.equal(fresh.completed,false);assert.equal(fresh.active,true,'Nova campanha apresenta tutorial novamente');
 assert.equal(exceptions.length,0);
 await fs.writeFile(`${directory}/resultado.json`,JSON.stringify({start,guide,targetChange,completed:completed.completed,restored,fresh,exceptions},null,2)+'\n');
 console.log(`APROVADO: ${profile}, botão real, movimento, coleta, guia e persistência após recarga.`);
}finally{ws.close();}
