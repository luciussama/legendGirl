import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const page = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let serial = 0;
const pending = new Map(), exceptions = [], failed = [];
ws.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
  if (message.method === 'Network.responseReceived' && message.params.response.status >= 400 && !message.params.response.url.endsWith('/favicon.ico')) failed.push(message.params.response.url);
  if (pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id); pending.delete(message.id);
    message.error ? reject(Error(JSON.stringify(message.error))) : resolve(message.result);
  }
};
/** Executa um comando no Chrome isolado, com timeout para não bloquear a sessão. */
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++serial; const timer = setTimeout(() => { pending.delete(id); reject(Error('Tempo excedido: ' + method)); }, 25000);
    pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
/** Consulta a fixture ou o jogo local, devolvendo erros de execução explicitamente. */
async function evaluate(expression) {
  const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw Error(JSON.stringify(response.exceptionDetails));
  return response.result.value;
}

try {
 await send('Runtime.enable');await send('Page.enable');await send('Network.enable');
 await send('Emulation.setDeviceMetricsOverride',{width:1200,height:1220,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:process.env.PILOT_REVIEW_URL+'/docs/diario-ia/qa/perseguicao-20261020/props.html'});
 let ready=false;for(let i=0;i<240;i++){if(await evaluate('Boolean(window.propsReview)')){ready=true;break;}await new Promise(r=>setTimeout(r,100));}assert.ok(ready,'Painel deve carregar com o novo atlas.');
 const ids=['teddy','robot','duck','drum','jack','armchair','rocking-horse','table'],results=[],captures=[];
 for(const id of ids){
  for(const angle of ['three','front','side','back']){
   await evaluate(`document.querySelector('#prop').value='${id}';document.querySelector('#angle').value='${angle}';new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))`);
   if(angle==='three')results.push(await evaluate(`(async()=>{const c=propsReview,T=await import('/src/vendor/three/three.module.js'),info=c.presentation['${id}'];c.model.updateMatrixWorld(true);let left=Infinity,right=-Infinity,bottom=Infinity,top=-Infinity,atlasMeshes=0,uvValid=true;const v=new T.Vector3();
   c.model.traverse(o=>{if(!o.isMesh)return;const pos=o.geometry.attributes.position;for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld).project(c.camera);left=Math.min(left,v.x);right=Math.max(right,v.x);bottom=Math.min(bottom,v.y);top=Math.max(top,v.y);}if(o.material.userData.pictorialAsset==='decorative'){atlasMeshes++;const uv=o.geometry.attributes.uv,rects=o.material.userData.atlasRects;for(let i=0;i<uv.count;i++)if(!rects.some(([u,v,w,h])=>uv.getX(i)>=u-1e-6&&uv.getX(i)<=u+w+1e-6&&uv.getY(i)>=v-1e-6&&uv.getY(i)<=v+h+1e-6))uvValid=false;}});
   const box=new T.Box3().setFromObject(c.model),size=box.getSize(new T.Vector3()),ratio=(right-left)*540/((top-bottom)*340),sourceRatio=info.crop?info.crop[2]/info.crop[3]:info.source.width/info.source.height;
   return {id:'${id}',size:size.toArray(),ratio,sourceRatio,deviation:Math.abs(ratio/sourceRatio-1),atlasMeshes,uvValid,ground:box.min.y};})()`));
   const shot=await send('Page.captureScreenshot',{format:'png'}),bytes=Buffer.from(shot.data,'base64'),file='/tmp/legendgirl-fidelidade-'+id+'-'+angle+'.png';await fs.writeFile(file,bytes);captures.push({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
  }
  await evaluate(`document.querySelector('#zoom').value='1';document.querySelector('#angle').value='three';new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))`);
  const shot=await send('Page.captureScreenshot',{format:'png'}),bytes=Buffer.from(shot.data,'base64'),file='/tmp/legendgirl-fidelidade-'+id+'-gameplay.png';await fs.writeFile(file,bytes);captures.push({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
  await evaluate(`document.querySelector('#zoom').value='2.5'`);
 }
 console.log('PROPORÇÕES E MATERIAIS',JSON.stringify(results));console.log('CAPTURAS',JSON.stringify(captures));
 for(const r of results){assert.ok(r.uvValid&&r.atlasMeshes>0,r.id+': deve usar as regiões próprias do atlas.');assert.ok(Math.abs(r.ground)<.001,r.id+': apoio inferior');assert.ok(r.deviation<.30,r.id+': proporção projetada deve se aproximar da arte original: '+JSON.stringify(r));}
 assert.deepEqual(exceptions,[]);assert.deepEqual(failed,[]);
 console.log('APROVADO: oito objetos com materiais próprios, UVs contidas, proporções comparadas, quatro vistas e escala de gameplay.');
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
