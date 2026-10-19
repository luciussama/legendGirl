import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const page=await(await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
let id=0;const pending=new Map();
ws.onmessage=({data})=>{const m=JSON.parse(data);if(pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const output='docs/diario-ia/qa-resultados/camera-retorno-fixa';await fs.mkdir(output,{recursive:true});
const results=[];
try {
 await send('Page.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});
 for(const [profile,width,height,mobile]of [['desktop',960,540,false],['android',390,844,true],['iphone',390,844,true]]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
  await send('Emulation.setUserAgentOverride',{userAgent:profile==='android'?'Mozilla/5.0 (Linux; Android 14) Mobile':profile==='iphone'?'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'});
  await send('Page.navigate',{url:'http://127.0.0.1:3000/tests/dark-room-playthrough.html?cameraQa=1'});
  for(let i=0;i<200&&!await evaluate('Boolean(window.review)');i++)await new Promise(r=>setTimeout(r,100));assert.ok(await evaluate('Boolean(window.review)'));
  await evaluate(`document.head.insertAdjacentHTML('beforeend','<meta name="viewport" content="width=device-width,initial-scale=1"><style>canvas{width:100vw;height:100dvh}p{display:none}</style>')`);
  await evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
  const report=await evaluate(`(async()=>{
   const {phase3Platforms}=await import('/src/js/config.js');const {getPhase3ScrollFrame}=await import('/src/js/controllers/CameraPresentation.js');
   const g=review.game,r=g.review,c=document.querySelector('canvas');let checked=0,visible=0;
   window.cameraQaRecord=sample=>{window.__cameraSample=sample;};
   for(let index=0;index<phase3Platforms.length;index++){
    const p=phase3Platforms[index];r.prepare(index,p.x+(p.w-38)/2,true);
    const saved=r.saveManual();saved.state.cameraX=g.state.baby.x-(c.width>600?c.width-250:c.width-160);r.restoreManual(saved);r.renderManual();
    const reference=window.__cameraSample.transform;
    for(const [dy,onGround,platform,zoom]of [[0,true,index,1],[-70,false,index,1],[-140,false,index,1],[0,true,index+1,1],[-70,false,index+1,1.25],[0,true,index,1]]){
     const variant=structuredClone(saved);Object.assign(variant.state.baby,{y:saved.state.baby.y+dy,onGround,currentPlatformIndex:platform});variant.state.fairy.y+=dy*2;
     variant.state.cameraY=dy;variant.state.targetCameraY=dy;variant.state.cameraZoom=zoom;r.restoreManual(variant);
     const before=JSON.stringify(g.state.baby);r.renderManual();
     if(before!==JSON.stringify(g.state.baby))throw Error('Render alterou a personagem');
     const matrix=window.__cameraSample.transform;
     for(const key of ['a','b','c','d','e','f'])if(Math.abs(matrix[key]-reference[key])>1e-8)throw Error('Enquadramento varia com salto/pouso: '+JSON.stringify({index,dy,key,matrix,reference}));
     checked++;
    }
    r.restoreManual(saved);r.renderManual();
    const m=window.__cameraSample.transform,b=g.state.baby;
    const top=m.d*b.y+m.f,feet=m.d*(b.y+b.h)+m.f;
    if(top<0||feet>c.height)throw Error('Personagem fora da tela no apoio '+index+': '+JSON.stringify({top,feet,height:c.height}));visible++;
   }
   for(let x=4000;x>-2000;x-=20){const a=getPhase3ScrollFrame({x,width:c.width,height:c.height});const b=getPhase3ScrollFrame({x:x-1,width:c.width,height:c.height});if(Math.abs(b.y-a.y)>.1)throw Error('Trajeto visual descontínuo');}
   return {checked,visible,width:c.width,height:c.height};
  })()`);
  results.push({profile,...report});
  for(const index of [0,7,15]){
   await evaluate(`(async()=>{const {phase3Platforms}=await import('/src/js/config.js');const p=phase3Platforms[${index}],r=review.game.review,c=document.querySelector('canvas');r.prepare(${index},p.x+(p.w-38)/2,true);const saved=r.saveManual();saved.state.cameraX=review.game.state.baby.x-(c.width>600?c.width-250:c.width-160);r.restoreManual(saved);r.renderManual();})()`);
   const raw=Buffer.from(await evaluate("document.querySelector('canvas').toDataURL().split(',')[1]"),'base64');await fs.writeFile(output+'/'+profile+'-'+index+'.png',raw);await fs.writeFile('/tmp/legendgirl-camera-'+profile+'-'+index+'.png',raw);
  }
 }
 await fs.writeFile(output+'/resultado.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));console.log('APROVADO: 288 variações de salto/pouso mantêm a matriz fixa; 48 apoios visíveis e trajetória contínua em três perfis.');
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
