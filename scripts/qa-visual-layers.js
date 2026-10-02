// Requer servidor local :3000 e Chrome de teste com depuração remota :9222.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
// Cada captura usa uma aba isolada para preservar a integridade dos logs.
const page = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', {method:'PUT'})).json();
const ws = new WebSocket(page.webSocketDebuggerUrl);
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

const label=process.argv[2]||'antes';
const variants=label==='antes'?['controle','sem-parallax','sem-sombras','sem-luz-dinamica','sem-background-secundario','sem-vinheta','sem-canvas-efeitos','sem-mascara','sem-pos-processamento','sem-particulas']:['controle'];
const root='assets/qa-testers/visual-rendering/QA-VISUAL-001/'+label;
const profiles={android:{width:390,height:844,mobile:true,ua:'Mozilla/5.0 (Linux; Android 14) Mobile'},iphone:{width:390,height:844,mobile:true,ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile'},desktop:{width:960,height:540,mobile:false,ua:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}};
try{
 await send('Page.enable');await send('Runtime.enable');await send('Page.addScriptToEvaluateOnNewDocument',{source:"window.qaErrors=[];window.addEventListener('error',e=>window.qaErrors.push(e.message));window.addEventListener('unhandledrejection',e=>window.qaErrors.push(String(e.reason)));"});
 for(const [profile,device] of Object.entries(profiles))for(const variant of variants){
  await send('Emulation.setUserAgentOverride',{userAgent:device.ua});
  await send('Emulation.setDeviceMetricsOverride',{...device,deviceScaleFactor:1});
  await send('Page.navigate',{url:`http://127.0.0.1:3000/tests/dark-room-visual-layers.html?cameraQa=1&visual=${variant}${label==='antes'?'&backgroundBefore=1':''}`});
  for(let i=0;i<200;i++){if(await evaluate('Boolean(window.review)'))break;const errors=await evaluate('window.qaErrors||[]');if(errors.length)throw Error(errors.join(';'));await new Promise(r=>setTimeout(r,100));}
  assert.ok(await evaluate('Boolean(window.review)'),'Fixture inicializada: '+variant);
  await evaluate("document.head.insertAdjacentHTML('beforeend','<meta name=viewport content=width=device-width><style>canvas{width:100vw;height:100dvh}p{display:none}</style>');window.dispatchEvent(new Event('resize'))");
  const directory=`${root}/${profile}/${variant}`;await fs.mkdir(directory,{recursive:true});const report=[];
  for(const index of [0,9,15]){
   const result=await evaluate(`(()=>{const r=window.review.game.review;const pose=r.mobileFrame(true,${index},true);const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    const prior=window.visualQa.beforeFinish?.data,bg=window.visualQa.backgroundPixels.data;let alphaHoles=0,gray=0,backgroundHoles=0;const columns=[];
    for(let x=0;x<canvas.width;x++){let holes=0;for(let y=0;y<canvas.height;y++){const i=(y*canvas.width+x)*4;if(bg[i+3]<255)backgroundHoles++;if(prior&&prior[i+3]<255){holes++;alphaHoles++;}if(pixels[i+3]<255)gray++;}if(holes)columns.push({x,holes});}
    return {...pose,backgroundHoles,alphaHoles,nonOpaqueAfter:gray,columns,invariantCalls:window.visualQa.invariantCalls,canvasPng:canvas.toDataURL('image/png').split(',')[1]};})()`);
   const {canvasPng,...diagnostic}=result;report.push({index,...diagnostic});const bg=await evaluate('window.visualQa.backgroundPng');await fs.writeFile(`${directory}/fundo-${index}.png`,Buffer.from(bg,'base64'));await fs.writeFile(`${directory}/apoio-${index}.png`,Buffer.from(canvasPng,'base64')); 
  }
  await fs.writeFile(`${directory}/diagnostico.json`,JSON.stringify(report,null,2));console.log(profile+' / '+variant+' concluído');
 }
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
