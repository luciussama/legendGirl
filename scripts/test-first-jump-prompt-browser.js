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

const directory='assets/qa-testers/current-screenshots/first-jump-tutorial';await fs.mkdir(directory,{recursive:true});
try{
 await send('Page.enable');await send('Runtime.enable');
 const results=[];
 for(const kind of ['touch','keyboard','mouse','gamepad']){
  const mobile=kind==='touch';await send('Emulation.setUserAgentOverride',{userAgent:mobile?'Mozilla/5.0 (Linux; Android 14) Mobile':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'});
  await send('Emulation.setDeviceMetricsOverride',{width:mobile?390:960,height:mobile?844:540,deviceScaleFactor:1,mobile});
  await send('Page.navigate',{url:'http://127.0.0.1:3000/tests/first-jump-tutorial.html'});
  for(let i=0;i<200;i++){if(await evaluate('Boolean(window.review)'))break;await new Promise(r=>setTimeout(r,100));}
  assert.ok(await evaluate('Boolean(window.review)'),'Fixture inicializada');
  await evaluate("document.head.insertAdjacentHTML('beforeend','<meta name=viewport content=width=device-width><style>canvas{width:100vw;height:100dvh}p{display:none}</style>');window.dispatchEvent(new Event('resize'))");
  const result=await evaluate(`(async()=>{
   const g=window.review.game,r=g.review;r.beginManual();window.dispatchEvent(new Event('resize'));for(let i=0;i<2251;i++)r.frameManual(false);
   const pad={connected:true,index:0,id:'Xbox Controller',buttons:Array.from({length:4},()=>({pressed:false,value:0}))};
   Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>${kind==='gamepad'?'[pad]':'[]'}});
   g.setPaused(true); // Esta revisão de layout mantém o salto suspenso.
   const input=g.input.controller,before=JSON.stringify({baby:g.state.baby,camera:g.camera.x,tick:g.state.tick});
   if('${kind}'==='touch'||'${kind}'==='mouse')input.handlePointerDown({pointerType:'${kind==='touch'?'touch':'mouse'}',isPrimary:true,cancelable:false,target:null});
   if('${kind}'==='keyboard')input.handleKeyDown({code:'Space',key:' ',repeat:false,cancelable:false});
   if('${kind}'==='gamepad'){pad.buttons[0]={pressed:true,value:1};input.pollGamepad();}
   r.frameManual(true);const layout=window.firstJumpTutorialLayout;
   if(before!==JSON.stringify({baby:g.state.baby,camera:g.camera.x,tick:g.state.tick}))throw Error('Entrada alterou gameplay no tutorial');
   if(!layout||layout.device!=='${kind}')throw Error('Mensagem incorreta para ${kind}');
   const box=layout.box,top=Math.min(...layout.player.map(p=>p.y));
   if(box.y+box.height>=top||box.y+box.height>=layout.target.y)throw Error('Prompt encobre personagem ou destino');
   const feedbackSamples=[layout.feedback.scale];
   for(let i=0;i<2;i++){await new Promise(resolve=>setTimeout(resolve,180));r.frameManual(true);feedbackSamples.push(window.firstJumpTutorialLayout.feedback.scale);}
   if(Math.max(...feedbackSamples)-Math.min(...feedbackSamples)<.001)throw Error('Pulsação visual não avança durante a espera');
   if(before!==JSON.stringify({baby:g.state.baby,camera:g.camera.x,tick:g.state.tick}))throw Error('Animação visual alterou a simulação');
   return {...window.firstJumpTutorialLayout,feedbackSamples,canvasPng:document.querySelector('canvas').toDataURL('image/png').split(',')[1]};
  })()`);
  const {canvasPng,...layout}=result;await fs.writeFile(`${directory}/${kind}.png`,Buffer.from(canvasPng,'base64'));results.push(layout);
 }
 await fs.writeFile('assets/qa-testers/current-logs/first-jump-tutorial.json',JSON.stringify(results,null,2));console.log('APROVADO: touch, teclado, mouse e Xbox; mensagens específicas sem cobrir personagem/destino nem liberar gameplay.');
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
