// Requer servidor local :3000 e Chrome de teste com depuração remota :9222.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
const ws = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
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
const profile=process.argv[2]||'android';
const profiles={android:{width:390,height:844,mobile:true,ua:'Mozilla/5.0 (Linux; Android 14) Mobile'},
  iphone:{width:390,height:844,mobile:true,ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile'},
  desktop:{width:960,height:540,mobile:false,ua:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}};
assert.ok(profiles[profile],'Perfil de teste válido');
const device=profiles[profile];
const directory='docs/qa-gameplay-001/final'+(profile==='android'?'':'/'+profile);
await fs.mkdir(directory,{recursive:true});
try {
  await send('Page.enable');await send('Runtime.enable');
  await send('Emulation.setUserAgentOverride',{userAgent:device.ua});
  await send('Emulation.setDeviceMetricsOverride',{width:device.width,height:device.height,deviceScaleFactor:1,mobile:device.mobile});
  await send('Page.navigate',{url:'http://127.0.0.1:3000/tests/dark-room-playthrough.html'});
  for(let i=0;i<200;i++){if(await evaluate('Boolean(window.review)'))break;await new Promise(r=>setTimeout(r,100));}
  await evaluate(`document.head.insertAdjacentHTML('beforeend','<meta name="viewport" content="width=device-width,initial-scale=1"><style>canvas{width:100vw;height:100dvh}p{display:none}</style>')`);
  await evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
  await evaluate('window.review.game.review.beginManual()');
  const report=[];
  async function capture(name){const {data}=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(`${directory}/${name}.png`,Buffer.from(data,'base64'));}
  async function settle(){return evaluate(`(()=>{
    const r=window.review.game.review;
    for(let i=0;i<5000;i++){
      const s=r.inspectManual();
      if(s.over)throw Error('Falha durante narrativa: '+JSON.stringify(s));
      if(s.mode==='toy-room')return s;
      if(s.standby||(s.plot&&s.plotStep>=4))r.actionManual();
      if(!s.opening&&!s.standby&&!s.transition&&!s.cutscene&&!s.plot&&!s.tutorial&&!s.portal)return s;
      r.frameManual(i%30===0);
    }throw Error('Narrativa não terminou');
  })()`);}
  await settle();await capture('01-inicio');
  for(const phase3 of [false]){
    for(let target=0;target<21;target++){
      const result=await evaluate(`(()=>{
        const r=window.review.game.review,saved=r.saveManual();
        for(let delay=0;delay<240;delay++){
          r.restoreManual(saved);
          for(let f=0;f<delay;f++)r.frameManual(false);
          if(r.inspectManual().over)break;
          r.actionManual();
          for(let f=0;f<250;f++){
            r.frameManual(f%15===0);const s=r.inspectManual();
            if(s.over)break;
            if(s.baby.onGround){
              if(s.baby.currentPlatformIndex===${target})return {target:${target},phase3:${phase3},delay,frames:f+1,x:s.baby.x,y:s.baby.y};
              break;
            }
          }
        }
        throw Error('Sem continuação do percurso: alvo '+${target}+' fase3='+${phase3}+' origem='+JSON.stringify(saved.state.baby));
      })()`);
      report.push(result);console.log(JSON.stringify(result));
      await settle();
      if([9,21,15].includes(target))await capture(`apoio-${phase3?'retorno':'ida'}-${target}`);
    }
    const results=await evaluate(`(()=>{
      const r=window.review.game.review,origin=r.saveManual(),rows=[];
      for(let delay=0;delay<100;delay++){
        r.restoreManual(origin);for(let i=0;i<delay;i++)r.frameManual();
        const takeoff=r.inspectManual();if(takeoff.over)break;
        r.actionManual();let landing=null,final;
        for(let i=0;i<240;i++){
          r.frameManual(i%20===0);final=r.inspectManual();
          if(final.over||final.plot)break;
          if(final.baby.onGround&&final.baby.currentPlatformIndex===21&&!landing)landing={x:final.baby.x,frame:i};
        }
        rows.push({delay,launchX:takeoff.baby.x,launchY:takeoff.baby.y,landing,plot:final.plot,
          over:final.over,finalX:final.baby.x,finalY:final.baby.y,cameraX:r.saveManual().state.cameraX});
      }
      return rows;
    })()`);
    await fs.writeFile(`${directory}/ultimo-salto.json`,JSON.stringify(results,null,2)+'\n');
    console.log(JSON.stringify(results.filter(r=>r.landing),null,2));
  }
}finally{ws.close();}
