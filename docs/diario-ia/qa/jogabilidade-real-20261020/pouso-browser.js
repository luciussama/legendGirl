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
/** Envia teclas ao navegador; o piloto só consulta posição e apoio. */
async function tap(code){const key=code==='Space'?' ':code;for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,code,key,windowsVirtualKeyCode:code==='Space'?32:code==='ArrowDown'?40:code==='Home'?36:undefined})}
const wait=ms=>new Promise(r=>setTimeout(r,ms)),results=[];
const read='({x:game.state.baby.x,y:game.state.baby.y,index:game.state.baby.currentPlatformIndex,ground:game.isGrounded(),tutorial:game.state.gameplayState})';
try{
 await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1200,height:720,deviceScaleFactor:1,mobile:false});
 for(const difficulty of ['NORMAL','EASY']){
  await send('Page.navigate',{url:'http://127.0.0.1:3000/'});await until('Boolean(window.game)');await evaluate('localStorage.clear()');await send('Page.reload');await until('Boolean(window.game)');await evaluate('game.assetsReady');
  await wait(500);if(difficulty==='EASY')await click('#btn-easy-mode');await click('#btn-start-phase1');await wait(500);
  await click('#btn-debug-phase-toggle');await send('Input.dispatchKeyEvent',{type:'char',key:'q',text:'q',unmodifiedText:'q',code:'KeyQ',windowsVirtualKeyCode:81});await until('game.state.gameplayState==="FIRST_JUMP_TUTORIAL"');
  const muted=await evaluate('game.isMuted()');await click('#btn-sound-toggle');assert.equal(await evaluate('game.isMuted()'),!muted);await click('#btn-sound-toggle');assert.equal(await evaluate('game.isMuted()'),muted);
  await tap('Space');
  const start=Date.now();let jumped=false,launched=false,result;
  while(Date.now()-start<20000){const s=await evaluate(read);
   if(!jumped&&s.ground&&s.index===-1&&s.x>=203){await tap('Space');jumped=true}
   else if(jumped&&!launched&&s.ground&&s.index===0&&s.x>=269.3){await tap('Space');launched=true;console.log('SAIDA',JSON.stringify({difficulty,...s}))}
   else if(launched&&s.ground){result={difficulty,...s};break}
   await wait(8);
  }
  assert.ok(result,'É necessário observar um pouso pela física real');const image=await capture('pouso-real-'+difficulty);results.push({...result,image});console.log('POUSO',JSON.stringify(results.at(-1)));
  await until('game.state.isGameOver');await click('#btn-restart');await until('!document.querySelector("#start-overlay").classList.contains("hidden")');
  console.log('APROVADO: botão Voltar ao início após queda real em '+difficulty);
 }
 console.log('DIAGNÓSTICO DE ENTRADAS REAIS',JSON.stringify(results));assert.deepEqual(errors,[]);
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+tab.id)}
