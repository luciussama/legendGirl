// Requires the dev server on :3000 and a dedicated Chrome with --remote-debugging-port=9222.
import fs from 'node:fs/promises';
const target=Number(process.argv[2]??0);
const pages=await (await fetch('http://127.0.0.1:9222/json')).json();
const page=pages.find(p=>p.type==='page');
if(!page)throw Error('No test Chrome page');
const ws=new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
let sequence=0;const pending=new Map();
ws.onmessage=({data})=>{const m=JSON.parse(data);if(pending.has(m.id)){const {resolve,reject}=pending.get(m.id);pending.delete(m.id);m.error?reject(Error(JSON.stringify(m.error))):resolve(m.result);}};
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
async function evaluate(expression){const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
try{
  await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:960,height:580,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:'http://127.0.0.1:3000/tests/dark-room-playthrough.html'});
  for(let i=0;i<100;i++){if(await evaluate('document.body?.dataset.ready === "true"'))break;await new Promise(r=>setTimeout(r,100));}
  if(!await evaluate('Boolean(window.review)'))throw Error('Review page did not initialize');
  const results=[];
  // Gate every earlier platform before proceeding to the requested one.
  for(let i=0;i<=target;i++)for(const dt of [0.5,1,1.2])results.push(await evaluate(`window.review.run(${i},${dt})`));
  await fs.mkdir('tmp/dark-room/review',{recursive:true});
  for(const debug of [false,true]){
    await evaluate(`window.review.show(${target},${debug})`);
    const {data}=await send('Page.captureScreenshot',{format:'png'});
    await fs.writeFile(`tmp/dark-room/review/${String(target).padStart(2,'0')}-${debug?'hitbox':'scene'}.png`,Buffer.from(data,'base64'));
  }
  await fs.writeFile('tmp/dark-room/review/results.json',JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify({passed:results.length,last:results.slice(-3)},null,2));
}finally{ws.close();}
