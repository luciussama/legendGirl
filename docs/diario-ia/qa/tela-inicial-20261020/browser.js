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
const captures=[];
try{
 await send('Runtime.enable');await send('Page.enable');await send('Network.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:1920,height:1080,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:process.env.TITLE_QA_URL});
 await until('Boolean(window.game&&document.querySelector("#title-scene").getContext("2d").getImageData(0,0,1,1).data[3])');
 assert.equal(await evaluate('document.querySelector("#btn-load-game").disabled'),true);
 const animatedA=await evaluate('document.querySelector("#title-scene").toDataURL()');await new Promise(r=>setTimeout(r,400));assert.notEqual(await evaluate('document.querySelector("#title-scene").toDataURL()'),animatedA,'Pernas devem animar.');
 for(const[width,height]of[[1920,1080],[390,844],[844,390]]){
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<900});await new Promise(r=>setTimeout(r,200));
  const layout=await evaluate(`(()=>{const ids=['btn-start-phase1','btn-load-game','btn-easy-mode','btn-title-options'];return ids.map(id=>{const e=document.getElementById(id),r=e.getBoundingClientRect();return{id,x:r.x,y:r.y,w:r.width,h:r.height,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===e};});})()`);
  for(const r of layout){assert.ok(r.x>=0&&r.y>=0&&r.x+r.w<=width+1&&r.y+r.h<=height+1,JSON.stringify({width,height,r}));assert.ok(r.hit);assert.ok(r.h>=43);}
  captures.push(await capture(width+'x'+height));await click('#btn-title-options');assert.equal(await evaluate('document.querySelector("#title-options-dialog").open'),true);assert.equal(await evaluate('document.querySelector("#graphics-quality").disabled'),true);assert.equal(await evaluate('game.state.gameStarted'),false);
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape'});await until('!document.querySelector("#title-options-dialog").open');
 }
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await new Promise(r=>setTimeout(r,100));const still=await evaluate('document.querySelector("#title-scene").toDataURL()');await new Promise(r=>setTimeout(r,250));assert.equal(await evaluate('document.querySelector("#title-scene").toDataURL()'),still,'Movimento reduzido deve manter quadro estático.');
 await click('#btn-easy-mode');assert.equal(await evaluate('document.querySelector("#game-difficulty").value'),'EASY');await click('#btn-start-phase1');await until('game.state.gameStarted');assert.equal(await evaluate('game.state.gameDifficulty'),'EASY');assert.equal(await evaluate('document.querySelector("#start-overlay").classList.contains("hidden")'),true);
 await evaluate('game.setPaused(true);game.saveProgress()');await send('Page.reload');await until('Boolean(window.game&&document.querySelector("#title-scene").getContext("2d").getImageData(0,0,1,1).data[3])');assert.equal(await evaluate('document.querySelector("#btn-load-game").disabled'),false);
 await click('#btn-start-phase1');assert.equal(await evaluate('document.querySelector("#restart-campaign-dialog").open'),true);const saved=await evaluate('localStorage.getItem("legendGirl.campaign.v1")');await click('#restart-campaign-dialog button[value="cancel"]');assert.equal(await evaluate('localStorage.getItem("legendGirl.campaign.v1")'),saved);assert.equal(await evaluate('game.state.gameStarted'),false);
 await click('#btn-load-game');await until('game.state.gameStarted');assert.equal(await evaluate('game.state.gameDifficulty'),'EASY','Carregar deve preservar dificuldade salva.');
 await evaluate('game.setPaused(true);game.restartToTitle()');await new Promise(r=>setTimeout(r,500));await click('#btn-start-phase1');await click('#btn-confirm-new-campaign');await until('game.state.gameStarted');assert.equal(await evaluate('game.state.gameDifficulty'),'NORMAL','Novo jogo deve usar a escolha atual do menu.');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('APROVADO: tela Full HD, três formatos, botões com hit testing real, animação/redução de movimento, opções, fácil, novo jogo com confirmação, cancelamento sem apagar e carregamento com dificuldade preservada.',JSON.stringify({captures}));
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+tab.id);}
