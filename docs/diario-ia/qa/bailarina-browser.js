import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const broken=process.argv.includes('--expect-broken');
const page=await(await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
let id=0;const pending=new Map();
ws.onmessage=({data})=>{const m=JSON.parse(data);if(pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const output='docs/diario-ia/qa-resultados/bailarina-'+(broken?'antes':'depois');await fs.mkdir(output,{recursive:true});
const results=[];
try {
 await send('Page.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});
 for(const [profile,width,height,mobile]of [['desktop',960,540,false],['android',390,844,true],['paisagem',844,390,true]]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});await send('Emulation.setUserAgentOverride',{userAgent:mobile?'Mozilla/5.0 (Linux; Android 14) Mobile':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'});
  await send('Emulation.setTouchEmulationEnabled',{enabled:mobile});
  await send('Page.navigate',{url:'http://127.0.0.1:3000/tests/dark-room-playthrough.html'});
  for(let i=0;i<200&&!await evaluate('Boolean(window.review)');i++)await new Promise(r=>setTimeout(r,100));assert.ok(await evaluate('Boolean(window.review)'));
  await evaluate(`window.__stepping=false;window.__frames=0;const tick=()=>{if(window.__stepping){window.review.game.review.frameManual(true);window.__frames++;}requestAnimationFrame(tick);};requestAnimationFrame(tick);`);
  for(const x of [1408,1412,1416]) {
   await evaluate(`(()=>{window.__stepping=false;window.__frames=0;const g=review.game;g.review.prepare(7,${x});g.state.gameplayState='GAMEPLAY_NORMAL';g.state.firstJumpTutorialCompleted=true;g.state.lastJumpTime=-10000;g.review.renderManual();})()`);
   if(mobile){const p=await evaluate('(()=>{const c=document.querySelector("canvas").getBoundingClientRect();return {x:c.left+Math.min(c.width,innerWidth)*.5,y:c.top+Math.min(c.height,innerHeight)*.5};})()');await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:p.x,y:p.y}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
   else {await send('Input.dispatchKeyEvent',{type:'keyDown',code:'Space',key:' ',windowsVirtualKeyCode:32});await send('Input.dispatchKeyEvent',{type:'keyUp',code:'Space',key:' ',windowsVirtualKeyCode:32});}
   const start=await evaluate('({accepted:!review.game.state.baby.onGround,airVx:review.game.state.baby.vx,x:review.game.state.baby.x})');assert.equal(start.accepted,true,'Entrada real inicia o salto');await evaluate('window.__stepping=true');
   let landed;for(let i=0;i<150;i++){landed=await evaluate('({onGround:review.game.state.baby.onGround,index:review.game.state.baby.currentPlatformIndex,x:review.game.state.baby.x,frames:window.__frames})');if(landed.onGround)break;await new Promise(r=>setTimeout(r,20));}
   await evaluate('window.__stepping=false');assert.equal(landed.index,broken?7:8,'Destino após uma tentativa normal: '+JSON.stringify({profile,x,start,landed}));
   if(!broken)assert.ok(start.airVx>=1.42,'Sem frenagem ao decolar');results.push({profile,x,start,landed});
   if(x===1412){const shot=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(output+'/'+profile+'.png',Buffer.from(shot.data,'base64'));if(!broken)await fs.writeFile('/tmp/legendgirl-bailarina-'+profile+'.png',Buffer.from(shot.data,'base64'));}
  }
 }
 await fs.writeFile(output+'/resultado.json',JSON.stringify(results,null,2));console.log('APROVADO: '+(broken?'regressão reproduzida; salto volta às gavetas':'nove saltos por teclado/toque reais alcançam a bailarina')+' em desktop e dois perfis móveis, sem busca pelo melhor quadro.');
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
