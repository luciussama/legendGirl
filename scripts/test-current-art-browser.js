// Requer servidor :3001 e Chrome local com CDP :9222.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const pages=await(await fetch('http://127.0.0.1:9222/json')).json();
const ws=new WebSocket(pages.find(page=>page.type==='page').webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
let id=0;const pending=new Map(),errors=[],failed=[];
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Network.responseReceived'&&m.params.response.status>=400&&!m.params.response.url.endsWith('/favicon.ico'))failed.push(m.params.response.url);if(pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const output='docs/qa/assinaturas-atuais';await fs.mkdir(output,{recursive:true});
try{
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://127.0.0.1:3001/tests/dark-room-playthrough.html?verify&run='+Date.now()});await wait(400);
 let result;for(let i=0;i<240;i++){result=await evaluate('({result:document.body.dataset.result,message:document.querySelector("#feedback")?.textContent})');if(result.result)break;await wait(100);}
 assert.equal(result.result,'passed',result.message);
 const scenery=await evaluate(`(async()=>{
 const {AssetManager}=await import('/src/js/assets/AssetManager.js');const assets=new AssetManager({manifestUrl:'/assets/manifest.json'});await assets.loadManifest();assets.manifest.images=Object.fromEntries(Object.entries(assets.manifest.images).map(([key,p])=>[key,new URL(p,location.origin+'/').href]));await assets.preload();
 const {CURRENT_SCENERY,drawCurrentScenery}=await import('/src/js/assets/currentScenery.js');
 const results=[];const gallery=document.createElement('div');gallery.style.cssText='display:flex;flex-wrap:wrap;background:#35283e;padding:12px;gap:12px';
 for(const type of Object.keys(CURRENT_SCENERY)){const canvas=document.createElement('canvas');canvas.width=180;canvas.height=110;const ctx=canvas.getContext('2d');drawCurrentScenery(ctx,assets,type,90,90);const visible=ctx.getImageData(0,0,180,110).data.some((value,i)=>i%4===3&&value>0);results.push({type,visible});const card=document.createElement('div');card.append(canvas,document.createTextNode(type));gallery.append(card);}
 document.body.prepend(gallery);return {items:results,statuses:[...assets.statuses]};})()`);
 assert.ok(scenery.items.every(item=>item.visible),'Todos os 17 cenários apresentam arte no navegador.');assert.ok(scenery.statuses.every(([,status])=>status==='ready'),'Todos os recursos carregam.');
 assert.deepEqual(errors,[],'Sem exceções JavaScript.');assert.deepEqual(failed,[],'Sem falhas HTTP de recursos.');
 const shot=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(output+'/cenarios.png',Buffer.from(shot.data,'base64'));await fs.writeFile(output+'/resultado.json',JSON.stringify({result,scenery,errors,failed},null,2)+'\n');
 console.log('APROVADO: 114 saltos, pausa no castelo, plataformas, 17 cenários ilustrados e recursos sem falhas no navegador.');
}finally{ws.close();}
