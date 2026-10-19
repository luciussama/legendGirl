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
  await send('Emulation.setDeviceMetricsOverride',{width:1200,height:1120,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:'http://127.0.0.1:3000/docs/diario-ia/qa/perseguicao-20261019/comparacao.html'});
  let ready=false;for(let i=0;i<150;i++){if(await evaluate('Boolean(window.comparison)')){ready=true;break;}await new Promise(r=>setTimeout(r,100));}
  assert.ok(ready,'Comparação deve carregar as quatro apresentações.');
  await evaluate(`document.querySelector('#motion').click()`);
  const result=await evaluate(`(async()=>{
    const {GIRL_PALETTE}=await import('/src/js/bear-chase/ChaseGirlPalette.js');
    const {ChaseGirlAnimation}=await import('/src/js/bear-chase/ChaseGirlAnimation.js');
    const T=await import('/src/vendor/three/three.module.js');
    const c=window.comparison,animator=new ChaseGirlAnimation(c.model),errors=[];let support=0;
    const original=structuredClone(c.state);
    for(let i=0;i<80;i++){
      const cycle=i/80,s={...original,time:40+cycle*.5,distance:cycle*4,x:0,immunity:0};animator.apply(s);c.model.root.updateMatrixWorld(true);
      for(let leg=0;leg<2;leg++)if((cycle+leg*.5)%1<.5){
        const foot=new T.Vector3(0,-.119,-.055);c.model.legs[leg].ankle.localToWorld(foot);support=Math.max(support,Math.abs(foot.y));
      }
    }
    animator.apply({...original,time:50,x:0});animator.apply({...original,time:50+1/60,x:.1});
    const steering=Math.abs(c.model.root.rotation.y);
    for(let i=2;i<100;i++)animator.apply({...original,time:50+i/60,x:.1});
    const settled=Math.abs(c.model.root.rotation.y);
    for(const [name,color]of Object.entries(GIRL_PALETTE))if('#'+c.model.materials[name].color.getHexString()!==color)errors.push(name);
    const train=c.room.toyModels.train();let cards=0;train.traverse(o=>{if(o.isMesh&&o.geometry.type==='PlaneGeometry')cards++;});
    return {support,steering,settled,errors,cards,fairyZ:c.room.fairy.position.z,resources:c.room.resources.size,bearVolume:new T.Box3().setFromObject(c.room.bear).getSize(new T.Vector3()).z};
  })()`);
  assert.ok(result.support<.02,'Apoio dos pés deve ficar no piso: '+result.support);
  assert.ok(result.steering>.01&&result.settled<.01,'Desvio deve responder à velocidade e retornar ao eixo.');
  assert.deepEqual(result.errors,[]);assert.equal(result.cards,0);assert.ok(result.fairyZ>0&&result.bearVolume>.5);
  const shot=await send('Page.captureScreenshot',{format:'png'}),bytes=Buffer.from(shot.data,'base64');
  const file='/tmp/legendgirl-comparacao-v2.png';await fs.writeFile(file,bytes);
  console.log('CAPTURA',JSON.stringify({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')}));
  await evaluate(`document.querySelector('#zoom').value='2.5';document.querySelector('#angle').value='side';new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))`);
  const detail=await send('Page.captureScreenshot',{format:'png'}),detailBytes=Buffer.from(detail.data,'base64');
  const detailFile='/tmp/legendgirl-detalhes-r3.png';await fs.writeFile(detailFile,detailBytes);
  console.log('CAPTURA',JSON.stringify({file:detailFile,bytes:detailBytes.length,sha256:crypto.createHash('sha256').update(detailBytes).digest('hex')}));
  assert.deepEqual(exceptions,[]);assert.deepEqual(failed,[]);
  console.log('APROVADO: comparação neutra/quarto, paleta rastreável, pés apoiados, desvio, trem volumétrico, fada atrás e urso 3D.',JSON.stringify(result));
} finally {ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
