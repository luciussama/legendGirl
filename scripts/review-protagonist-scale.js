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
const directory='assets/qa-testers/current-screenshots/escala';
await fs.mkdir(directory,{recursive:true});
try {
  await send('Page.enable');
  for(const [profile,width,height,ua] of [['desktop',960,540,'Desktop'],['android',390,844,'Android']]) {
    await send('Emulation.setUserAgentOverride',{userAgent:'Mozilla/5.0 ('+ua+')'});
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:profile!=='desktop'});
    await send('Page.navigate',{url:'http://127.0.0.1:3001/tests/dark-room-playthrough.html'});
    for(let i=0;i<200;i++){if(await evaluate('Boolean(window.review)'))break;await new Promise(r=>setTimeout(r,100));}
    await evaluate(`document.head.insertAdjacentHTML('beforeend','<meta name="viewport" content="width=device-width,initial-scale=1"><style>canvas{width:100vw;height:100dvh}p{display:none}</style>')`);
    await evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
    for(const after of [true]) {
      const result=await evaluate(`(async()=>{
        const {babyRenderer}=await import('/src/js/entities/BabyRenderer.js');
        const original=babyRenderer.renderPose;
        const calls=[];
        babyRenderer.renderPose=function(...args){
          calls.push({pose:args[2],frame:args[3],feet:args[5],height:args[6],scale:${after}?args[8]:1});
          if(!${after})args[8]=1;
          return original.apply(this,args);
        };
        try{window.review.show(2,false);}finally{babyRenderer.renderPose=original;}
        return calls;
      })()`);
      assert.equal(result.at(-1).scale,after?1.08:1,'Escala esperada na fase 1');
      const {data}=await send('Page.captureScreenshot',{format:'png'});
      await fs.writeFile(`${directory}/${profile}-atual.png`,Buffer.from(data,'base64'));
    }
  }
  console.log('Estado atual da protagonista capturada em desktop e Android emulado.');
}finally{ws.close();}
