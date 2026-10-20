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
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {width:1200,height:750,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:'http://127.0.0.1:3000/?debug=1'});
  for(let i=0;i<100;i++){if(await evaluate('Boolean(window.game)'))break;await new Promise(r=>setTimeout(r,100));}
  const result=await evaluate(`(async()=>{
    const T=await import('/src/vendor/three/three.module.js');
    const {ChaseGirlModel}=await import('/src/js/bear-chase/ChaseGirlModel.js');
    const {ChaseGirlAnimation}=await import('/src/js/bear-chase/ChaseGirlAnimation.js');
    const scene=new T.Scene();scene.background=new T.Color('#efe4d6');
    const resources=new Set();const m=new ChaseGirlModel(r=>{resources.add(r);return r;});scene.add(m.root);
    scene.add(new T.HemisphereLight('#ffffff','#b3a19b',1.8));
    const key=new T.DirectionalLight('#ffffff',2.4);key.position.set(-3,6,-4);scene.add(key);
    const fill=new T.DirectionalLight('#ffffff',.8);fill.position.set(3,3,5);scene.add(fill);
    const renderer=new T.WebGLRenderer({antialias:true});renderer.setSize(1200,750);renderer.setScissorTest(true);
    document.body.replaceChildren(renderer.domElement);renderer.domElement.style='position:fixed;inset:0;width:1200px;height:750px';
    const animator=new ChaseGirlAnimation(m),camera=new T.PerspectiveCamera(32,400/750,.1,30);
    let meshes=0,planes=0;m.root.traverse(o=>{if(o.isMesh){meshes++;if(o.geometry.type==='PlaneGeometry')planes++;}});
    const box=new T.Box3().setFromObject(m.root),size=box.getSize(new T.Vector3());
    const base={stage:'RUNNING',distance:1,time:12,age:12,x:0,immunity:0,stumble:0};
    animator.apply(base);m.root.updateMatrixWorld(true);const pose=JSON.stringify(m.root.toJSON());animator.apply(base);m.root.updateMatrixWorld(true);
    const stable=pose===JSON.stringify(m.root.toJSON());
    animator.apply({...base,distance:2});m.root.updateMatrixWorld(true);const changed=pose!==JSON.stringify(m.root.toJSON());
    for(let i=0;i<3;i++){
      animator.apply({...base,distance:i===2?2.5:0,stage:i===2?'RUNNING':'BEAR_DOWN'});
      camera.position.set(...[[0,1.3,-4.4],[0,1.3,4.4],[3,1.5,3.4]][i]);camera.lookAt(0,1,0);
      renderer.setViewport(i*400,0,400,750);renderer.setScissor(i*400,0,400,750);renderer.render(scene,camera);
    }
    return {meshes,planes,size:size.toArray(),resources:resources.size,stable,changed,calls:renderer.info.render.calls};
  })()`);
  assert.equal(result.planes,0);assert.ok(result.meshes>40);assert.ok(result.size[2]>.5);
  assert.ok(result.stable&&result.changed);assert.ok(result.resources<50);
  const capture=await send('Page.captureScreenshot',{format:'png'});const bytes=Buffer.from(capture.data,'base64');
  const file='/tmp/legendgirl-menina-3d.png';await fs.writeFile(file,bytes);
  console.log('APROVADO: menina volumétrica, poses determinísticas, animação articulada e recursos compartilhados.',JSON.stringify(result));
  console.log('CAPTURA',JSON.stringify({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')}));
  assert.deepEqual(exceptions,[]);
} finally {ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
