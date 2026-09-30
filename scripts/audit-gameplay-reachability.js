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
const directory='docs/qa-gameplay-001';
await fs.mkdir(directory,{recursive:true});
const rows=[],failures=[];
try {
  await send('Page.enable');
  for(const [profile,width,height,ua] of [['desktop',960,540,'Desktop'],['android',390,844,'Android'],['iphone',390,844,'iPhone']]) {
    await send('Emulation.setUserAgentOverride',{userAgent:'Mozilla/5.0 ('+ua+')'});
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:profile!=='desktop'});
    await send('Page.navigate',{url:'http://127.0.0.1:3000/tests/dark-room-playthrough.html'});
    for(let i=0;i<200;i++){if(await evaluate('Boolean(window.review)'))break;await new Promise(r=>setTimeout(r,100));}
    await evaluate(`document.head.insertAdjacentHTML('beforeend','<meta name="viewport" content="width=device-width,initial-scale=1"><style>canvas{width:100vw;height:100dvh}p{display:none}</style>')`);
    await evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
    for(const dt of [0.5,1,1.2]) {
      for(let target=1;target<=9;target++) {
        const row=await evaluate(`(()=>{
          const {game,platforms}=window.review,p=platforms[${target}-1],s=p.standRegion||p;
          const min=Math.ceil(s.x-game.state.baby.w+1),max=Math.ceil(s.x+s.w)-1,success=[];
          for(let x=min;x<=max;x++){
            game.review.prepare(${target}-1,x);game.review.step(0);
            if(!game.state.baby.onGround)continue;
            game.review.jump();
            for(let f=0;f<300;f++){
              game.review.step(${dt});const b=game.state.baby;
              if(game.isGameOver())break;
              if(b.onGround){if(b.currentPlatformIndex===${target})success.push(x);break;}
            }
          }
          return {from:${target}-1,to:${target},dt:${dt},tested:max-min+1,success:success.length,
            first:success[0]??null,last:success.at(-1)??null,windowMs:success.length/1.42*1000/60};
        })()`);
        rows.push({profile,...row});if(!row.success)failures.push({profile,...row});
      }
      for(const phase3 of [false,true])for(let target=phase3?0:10;target<(phase3?16:22);target++){
        try {rows.push({profile,...await evaluate(`window.review.run(${target},${dt},${phase3})`)});}
        catch(error){failures.push({profile,target,phase3,dt,error:error.message});}
      }
    }
    console.log(profile+': inspeção concluída.');
  }
  await fs.writeFile(`${directory}/alcance.json`,JSON.stringify({rows,failures},null,2)+'\n');
  console.log(JSON.stringify({cases:rows.length,failures},null,2));
  assert.equal(failures.length,0,'Todos os trechos devem ter uma saída alcançável');
}finally{ws.close();}
