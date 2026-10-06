// Teste integrado no servidor :8765 e Chrome isolado com CDP :9223.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const output='docs/qa/remocao-exportacao';
const page=await(await fetch('http://127.0.0.1:9223/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let seq=0;const pending=new Map(),errors=[];ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id)}};
const send=(method,params={})=>new Promise(r=>{const id=++seq;pending.set(id,r);ws.send(JSON.stringify({id,method,params}))});
const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const key=async(code,key)=>{await send('Input.dispatchKeyEvent',{type:'keyDown',code,key,windowsVirtualKeyCode:code==='KeyE'?69:39});await wait(40);await send('Input.dispatchKeyEvent',{type:'keyUp',code,key,windowsVirtualKeyCode:code==='KeyE'?69:39})};
const results=[];
try{
await send('Runtime.enable');
for(const [name,width,height]of[['desktop',960,580],['retrato',390,844],['paisagem',915,412]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://127.0.0.1:8765/'});await wait(1200);
 await ev("localStorage.clear()");await send('Page.reload',{ignoreCache:true});await wait(1200);await ev('game.assetsReady');
 assert.equal(await ev("document.querySelectorAll('[id*=download],[id*=zip],[class*=download]').length"),0);
 await ev("document.getElementById('btn-start-phase1').click()");await wait(300);assert.equal(await ev('game.state.gameStarted'),true);
 await ev("document.getElementById('btn-pause-toggle').click()");assert.equal(await ev('game.isPaused()'),true);
 await ev("document.getElementById('btn-pause-toggle').click()");assert.equal(await ev('game.isPaused()'),false);
 const muted=await ev('game.isMuted()');await ev("document.getElementById('btn-sound-toggle').click()");assert.equal(await ev('game.isMuted()'),!muted);
 // O acesso direto de QA permanece funcional. As posições preparadas isolam os estados de ação.
 await ev('game.startToyRoomPhase()');await wait(200);assert.equal(await ev('game.isToyRoomMode()'),true);
 await ev('window.phase=game.state.toyRoomInstance.instance');await wait(4500);const scene=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(`${output}/${name}-sala.png`,Buffer.from(scene.data,'base64'));
 const x=await ev('phase.player.x');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await wait(220);await send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});assert(await ev('phase.player.x')>x);
 for(let i=0;i<8;i++){
  await ev(`phase.player.x=phase.toys[${i}].x;phase.player.y=phase.toys[${i}].y;phase.lastActionTime=0`);await wait(80);await key('KeyE','e');assert.equal(await ev(`phase.player.carriedItem===phase.toys[${i}]`),true);
  await ev("(()=>{const chest=phase.furniture.find(f=>f.id==='toy-chest');phase.player.x=chest.x+chest.w/2;phase.player.y=chest.y+chest.h+45;phase.lastActionTime=0})()");await key('KeyE','e');assert.equal(await ev('phase.organizedCount'),i+1);
 }
 assert.equal(await ev('phase.victoryBannerActive'),true);await ev('game.saveProgress()');
 const shot=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(`${output}/${name}-vitoria.png`,Buffer.from(shot.data,'base64'));
 await send('Page.reload',{ignoreCache:true});await wait(1200);await ev('game.assetsReady');assert.equal(await ev("document.getElementById('btn-start-phase1').textContent"),'CONTINUAR');await ev("document.getElementById('btn-start-phase1').click()");await wait(150);assert.equal(await ev('game.state.toyRoomInstance.instance.organizedCount'),8);
 results.push({tela:name,inicio:true,pausa:true,som:true,movimento:true,coletas:8,armazenamentos:8,vitoria:true,saveRestaurado:true});
}
assert.equal(errors.length,0,'Erros JavaScript na aplicação');
for(const route of ['/api/zip-info','/api/download-zip','/download','/baixar.html','/o-quarto-dos-brinquedos.zip'])assert.equal((await fetch('http://127.0.0.1:8765'+route)).status,404);
await fs.writeFile(output+'/ponta-a-ponta.json',JSON.stringify({resultados:results,errosJavaScript:errors,rotasAntigas:404,metodo:'Entrada por interface, teclado CDP real, posições de ação preparadas; não é percurso completo entre todos os brinquedos.'},null,2));console.log('APROVADO: três telas, início, pausa, som, movimento, 24 coletas/armazenamentos, vitória, recarga e rotas removidas.');
}finally{ws.close()}
