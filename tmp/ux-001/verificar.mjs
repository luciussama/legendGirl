import fs from 'node:fs/promises';
const pages=await(await fetch('http://127.0.0.1:9222/json')).json();
const ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map();
ws.onmessage=({data})=>{const m=JSON.parse(data);if(pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id);}};
const send=(method,params={})=>new Promise(r=>{pending.set(++id,r);ws.send(JSON.stringify({id,method,params}));});
const run=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
await send('Page.enable');
const results=[];
for(const [name,width,height] of [['computador',960,580],['celular',390,844],['paisagem',667,375]]){
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://127.0.0.1:3000/'});
 await new Promise(r=>setTimeout(r,900));
 results.push(await run(`(()=>{const b=document.querySelector('#btn-start-phase1').getBoundingClientRect();const t=document.querySelector('.top-controls-bar').getBoundingClientRect();return {tela:'${name}',largura:b.width,altura:b.height,centralizado:Math.abs(b.x+b.width/2-innerWidth/2)<2,semSobreposicao:b.top>t.bottom,acoesCentrais:document.querySelectorAll('.start-card button,.start-card a').length}})()`));
 const shot=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(`tmp/ux-001/${name}.png`,Buffer.from(shot.data,'base64'));
}
await run("document.querySelector('#btn-download-zip').click()");
results.push({zipAbreModal:await run("!document.querySelector('#download-modal').classList.contains('hidden')")});
await run("document.querySelector('#modal-btn-close-x').click();document.querySelector('#btn-start-phase1').click()");
results.push({comecarOcultaInicio:await run("document.querySelector('#start-overlay').classList.contains('hidden')"),atalhoOcultoDuranteJogo:await run("getComputedStyle(document.querySelector('#btn-skip-phase2')).display==='none'")});
await send('Page.reload');await new Promise(r=>setTimeout(r,900));
await run("document.querySelector('#btn-skip-phase2').click()");
results.push({pularOcultaInicio:await run("document.querySelector('#start-overlay').classList.contains('hidden')")});
await fs.writeFile('tmp/ux-001/validacao.json',JSON.stringify(results,null,2));console.log(results);ws.close();
