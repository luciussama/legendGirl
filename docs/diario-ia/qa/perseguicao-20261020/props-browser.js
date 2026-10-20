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
 await send('Emulation.setDeviceMetricsOverride',{width:1200,height:1130,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:(process.env.PILOT_REVIEW_URL||'http://127.0.0.1:3000')+'/docs/diario-ia/qa/perseguicao-20261020/props.html'});
 let ready=false;for(let i=0;i<150;i++){if(await evaluate('Boolean(window.propsReview)')){ready=true;break;}await new Promise(r=>setTimeout(r,100));}
 assert.ok(ready,'Painel dos pilotos deve carregar.');
 const result=await evaluate(`(async()=>{
  const c=window.propsReview,T=await import('/src/vendor/three/three.module.js'),results={};
  for(const id of ['train','cabinet']){
   const a=c.prototypes[id].create(),b=c.prototypes[id].create();a.updateMatrixWorld(true);
   const box=new T.Box3().setFromObject(a),size=box.getSize(new T.Vector3());let cards=0,transparent=0,shared=true,triangles=0;
   a.traverse(o=>{if(o.isMesh){if(o.geometry.type==='PlaneGeometry')cards++;if(o.material.transparent)transparent++;triangles+=o.geometry.attributes.position.count/3;}});
   for(let i=0;i<a.children.length;i++)if(a.children[i].geometry!==b.children[i].geometry||a.children[i].material!==b.children[i].material)shared=false;
   results[id]={size:size.toArray(),minY:box.min.y,cards,transparent,shared,calls:a.children.length,triangles};
  }
  const before=[c.resources.resources.size,c.ref.resources.size,c.room.resources.size],state=JSON.stringify(c.state);
  for(let i=0;i<60;i++)c.select(i%2?'train':'cabinet');
  const after=[c.resources.resources.size,c.ref.resources.size,c.room.resources.size];
  return {results,before,after,statePreserved:JSON.stringify(c.state)===state};
 })()`);
 for(const [id,r] of Object.entries(result.results)){
  assert.ok(r.size.every(n=>n>.2),id+': volume deve existir nos três eixos.');assert.ok(Math.abs(r.minY)<.001,id+': apoio deve ficar em Y=0.');
  assert.equal(r.cards,0);assert.equal(r.transparent,0);assert.ok(r.shared);assert.ok(r.calls<=6,id+': partes estáticas devem ser mescladas por material.');
 }
 assert.deepEqual(result.after,result.before,'Trocar objetos não pode acumular recursos.');assert.ok(result.statePreserved);
 const captures=[];
 for(const id of ['train','cabinet'])for(const view of ['three','front','side','back']){
  await evaluate(`document.querySelector('#prop').value='${id}';document.querySelector('#angle').value='${view}';new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))`);
  const shot=await send('Page.captureScreenshot',{format:'png'}),bytes=Buffer.from(shot.data,'base64');
  const file='/tmp/legendgirl-piloto-'+id+'-'+view+'.png';await fs.writeFile(file,bytes);
  captures.push({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
 }
 const placement=await evaluate(`(async()=>{const T=await import('/src/vendor/three/three.module.js');const box=new T.Box3().setFromObject(propsReview.roomModel);return {minX:box.min.x,maxX:box.max.x,rotation:propsReview.roomModel.rotation.y};})()`);
 assert.ok(placement.minX>4.3&&placement.maxX<5.5,'Armário decorativo deve ficar junto à parede e fora da rota central.');
 await evaluate(`document.querySelector('#launch').click();new Promise(r=>setTimeout(r,220))`);
 const flight=await evaluate(`({y:propsReview.roomModel.position.y,z:propsReview.roomModel.position.z})`);
 assert.ok(flight.y>1,'Trem deve subir na trajetória visual.');
 await evaluate(`document.querySelector('#zoom').value='1';new Promise(r=>setTimeout(r,600))`);
 for(const [width,height]of [[390,844],[844,390]]){
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
  assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'Painel deve caber no viewport.');
 }
 assert.deepEqual(exceptions,[]);assert.deepEqual(failed,[]);
 const disposed=await evaluate(`(()=>{propsReview.dispose();propsReview.dispose();return {pilots:propsReview.resources.resources.size,room:propsReview.room.resources.size,reference:propsReview.ref.resources.size};})()`);
 assert.deepEqual(disposed,{pilots:0,room:0,reference:0});
 console.log('CAPTURAS',JSON.stringify(captures));
 console.log('APROVADO: volume, apoio, faces opacas, compartilhamento, troca sem acúmulo, estado preservado, quatro vistas, lançamento, viewport e descarte.',JSON.stringify({result,placement,flight,disposed}));
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
