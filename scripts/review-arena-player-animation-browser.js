// Requer servidor local :3001 e Chrome isolado com depuração remota :9222.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const output='docs/qa/arena-player-animation';await fs.mkdir(output,{recursive:true});
const pages=await(await fetch('http://127.0.0.1:9222/json')).json();
const ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
let id=0;const pending=new Map(),errors=[];
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
try {
 await send('Runtime.enable');await send('Emulation.setUserAgentOverride',{userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'});
 await send('Emulation.setDeviceMetricsOverride',{width:960,height:1060,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://127.0.0.1:3001/tests/arena-player-animation.html'});
 let ready=false;for(let i=0;i<200;i++){if(await evaluate('document.body?.dataset.ready==="true"')){ready=true;break;}await new Promise(r=>setTimeout(r,100));}assert.ok(ready,'Página de animação carregada.');await evaluate('playerAnimationReview.pause()');
 const report=[];
 for(const frame of [1,3,4,6,8,13,18,26,28,30,32,34,36,86,88,90]) {
  const result=await evaluate(`(()=>{playerAnimationReview.sampleAt(${frame});const samples=playerAnimationReview.inspect();return {frame:${frame},samples,images:playerAnimationReview.panels.map(p=>({pose:p.pose,png:p.canvas.toDataURL().split(',')[1]}))};})()`);
  for(const {pose,png}of result.images)await fs.writeFile(`${output}/${pose}-${frame}.png`,Buffer.from(png,'base64'));delete result.images;
  for(const {sample}of result.samples)assert.ok(Math.abs(sample.layers.reduce((sum,l)=>sum+l.weight,0)-1)<1e-8,'Mistura mantém a massa visual.');report.push(result);
 }
 assert.equal(errors.length,0,'Sem exceções na animação real.');
 await evaluate('playerAnimationReview.sampleAt(36)');const shot=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(output+'/comparacao.png',Buffer.from(shot.data,'base64'));
 await fs.writeFile(output+'/quadros.json',JSON.stringify(report,null,2)+'\n');
 console.log('APROVADO: 16 instantes de repouso, corrida, agachamento e ataque renderizados sem erros, com registro dos quadros e seus pesos.');
}finally{ws.close();}
