import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const broken=process.argv.includes('--expect-broken');
const page=await(await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
let id=0;const pending=new Map();
ws.onmessage=({data})=>{const m=JSON.parse(data);if(pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const results=[];
try {
 await send('Page.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});
 const centers=[4217.5,4076,3884.5,3674,3445.5,3198.5,2929,2638,2322.5,1982,1616,1226,803,350.5,-134.5,-645];
 for(const [profile,width,height,mobile] of [['desktop',960,540,false],['retrato',390,844,true],['paisagem',844,390,true]]){
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
  await send('Emulation.setTouchEmulationEnabled',{enabled:mobile});
  await send('Page.navigate',{url:'http://127.0.0.1:3000/tests/dark-room-playthrough.html'});
  for(let i=0;i<200&&!await evaluate('Boolean(window.review)');i++)await new Promise(r=>setTimeout(r,100));
  assert.ok(await evaluate('Boolean(window.review)'),'Página real de QA pronta');
  for(const dt of [.5,1,1.2])for(const [target,center]of centers.entries()){
   await evaluate(`(()=>{const g=review.game;g.review.prepare(${target-1},${center-19},true);Object.assign(g.state,{gameplayState:'GAMEPLAY_NORMAL',firstJumpTutorialCompleted:true,gameDifficulty:'NORMAL'});g.state.baby.facing=-1;g.review.renderManual();})()`);
   await new Promise(r=>setTimeout(r,180)); // Respeita o debounce real entre comandos nativos.
   if(mobile){const p=await evaluate('(()=>{const c=document.querySelector("canvas").getBoundingClientRect();return {x:c.left+Math.min(c.width,innerWidth)*.5,y:c.top+Math.min(c.height,innerHeight)*.5};})()');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:p.x,y:p.y}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
   else {await send('Input.dispatchKeyEvent',{type:'keyDown',code:'Space',key:' ',windowsVirtualKeyCode:32});await send('Input.dispatchKeyEvent',{type:'keyUp',code:'Space',key:' ',windowsVirtualKeyCode:32});}
   assert.equal(await evaluate('review.game.state.baby.onGround'),false,'Entrada nativa inicia salto: '+JSON.stringify({profile,target,dt}));
   const result=await evaluate(`(()=>{const g=review.game;let frames=0;while(!g.state.baby.onGround&&!g.state.isGameOver&&frames++<240)g.review.step(${dt});const b=g.state.baby;const result={target:${target},dt:${dt},frames,index:b.currentPlatformIndex,onGround:b.onGround,over:g.state.isGameOver,x:b.x,feet:b.y+b.h};for(let i=0;i<8;i++){b.vx=0;g.review.step(${dt});if(!b.onGround)throw Error('Apoio perdido após o pouso');}g.review.renderManual();return result;})()`);
   assert.equal(result.index,target,JSON.stringify({profile,...result}));assert.equal(result.onGround,true);assert.equal(result.over,false);results.push({profile,...result});
  }
 }
 console.log(JSON.stringify({resultado:'aprovado',cenas:results.length,results},null,2));
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
