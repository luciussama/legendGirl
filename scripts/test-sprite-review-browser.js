// Usa servidor isolado :3003, JSON temporário e Chrome de teste :9222.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const output='docs/qa/sprite-review';await fs.mkdir(output,{recursive:true});
const pages=await(await fetch('http://127.0.0.1:9222/json')).json();const ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});let id=0;const pending=new Map(),errors=[];
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
async function ready(){for(let i=0;i<200;i++){if(await evaluate('document.body?.dataset.ready==="true"&&Boolean(window.spriteReview)'))return;await new Promise(r=>setTimeout(r,100));}throw Error('Página de revisão não inicializou.');}
try{
 await send('Runtime.enable');await send('Page.enable');await evaluate('if(document.body)document.body.dataset.ready="false";window.spriteReview=null');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://127.0.0.1:3003/tools/sprite-review/'});await ready();
 const baseline=await evaluate('fetch("/api/sprite-review/selections").then(r=>r.json())');
 const inventory=await evaluate('({counts:spriteReview.catalog.counts,total:spriteReview.catalog.items.length})');
 const previews=await evaluate('spriteReview.catalog.items.filter(i=>i.kind==="code").map(i=>{const c=spriteReview.procedural(i);return {id:i.id,title:i.title,error:c.dataset.previewError==="true",visible:c.getContext?c.getContext("2d").getImageData(0,0,c.width,c.height).data.some((v,j)=>j%4===3&&v>0):false};})');
 assert.ok(previews.every(p=>!p.error&&p.visible),'Todas as assinaturas por código possuem prévia visual.');
 const screenshot=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(output+'/pagina.png',Buffer.from(screenshot.data,'base64'));
 const chosen=await evaluate('(()=>{const card=[...document.querySelectorAll(".card")].find(c=>spriteReview.catalog.items.find(i=>i.id===c.dataset.id).kind==="file");card.querySelector("input[value=old]").click();return card.dataset.id;})()');
 for(let i=0;i<100;i++){if(await evaluate('document.querySelector("#save-status").textContent.startsWith("Salvo automaticamente")'))break;await new Promise(r=>setTimeout(r,50));}
 const disk=JSON.parse(await fs.readFile('/tmp/legendgirl-sprite-review-test-selection.json','utf8'));assert.equal(disk.decisions[chosen],'old');assert.ok(disk.selectedForDeletion.some(i=>i.id===chosen));
 await evaluate('document.body.dataset.ready="false";window.spriteReview=null');await send('Page.reload',{ignoreCache:true});await ready();assert.equal(await evaluate('spriteReview.decisions['+JSON.stringify(chosen)+']'),'old','A classificação sobrevive à recarga.');
 const changes=await evaluate('(async()=>{for(const kind of ["region","code"]){document.querySelector("#kind").value=kind;document.querySelector("#kind").dispatchEvent(new Event("change"));const card=document.querySelector(".card");card.querySelector("input[value=old]").click();await spriteReview.save();}return spriteReview.exportDocument();})()');
 assert.ok(changes.selectedRegions.length>=1);assert.ok(changes.selectedCode.length>=1);assert.ok(changes.selectedForDeletion.every(i=>!i.path.endsWith('.js')));
 const allImages=await evaluate('(async()=>{const failures=[];for(const item of spriteReview.catalog.items.filter(i=>i.kind==="file")){const image=new Image();image.src="/"+item.path;try{await image.decode();}catch(e){failures.push(item.path);}}return failures;})()');
 assert.deepEqual(allImages,[],'Todas as imagens do catálogo carregam.');
 await evaluate('(async()=>{const state=await fetch("/api/sprite-review/selections").then(r=>r.json());await fetch("/api/sprite-review/selections",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({catalogVersion:spriteReview.catalog.version,revision:state.revision,decisions:'+JSON.stringify(baseline.decisions)+'})});localStorage.removeItem("legendGirl.spriteReview.choices.v1");})()');
 assert.equal(errors.length,0,'Nenhuma exceção JavaScript na revisão.');
 await fs.writeFile(output+'/resultado.json',JSON.stringify({inventory,previews,chosen,choicesPersisted:true,imageFailures:allImages,errors},null,2)+'\n');
 console.log('APROVADO: catálogo completo, prévias procedurais, seleção pela interface, JSON em disco, recarga e alvos específicos de recorte/código.');
}finally{ws.close();}
