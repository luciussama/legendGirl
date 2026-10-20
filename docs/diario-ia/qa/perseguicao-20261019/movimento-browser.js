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
  await send('Runtime.enable');await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:1200,height:1120,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:'http://127.0.0.1:3000/docs/diario-ia/qa/perseguicao-20261019/comparacao.html'});
  let ready=false;for(let n=0;n<150;n++){if(await evaluate('Boolean(window.comparison)')){ready=true;break;}await new Promise(r=>setTimeout(r,100));}
  assert.ok(ready,'Estudo de animação deve carregar.');
  const before=await evaluate('comparison.state.distance');
  await new Promise(r=>setTimeout(r,650));
  const after=await evaluate('comparison.state.distance');
  assert.ok(after-before>1,'Comparação deve iniciar animada e avançar por requestAnimationFrame real.');
  await evaluate(`document.querySelector('#motion').click()`);
  const frozen=await evaluate('comparison.state.distance');await new Promise(r=>setTimeout(r,120));
  assert.equal(await evaluate('comparison.state.distance'),frozen,'Congelar deve preservar a pose.');
  const metrics=await evaluate(`(async()=>{
    const T=await import('/src/vendor/three/three.module.js');
    const {ChaseGirlAnimation}=await import('/src/js/bear-chase/ChaseGirlAnimation.js');
    const model=comparison.model,animator=new ChaseGirlAnimation(model),base=structuredClone(comparison.state);
    const values={body:[],hip:[],chest:[],leftArm:[],rightArm:[],elbow:[],hair:[],tip:[],skirt:[]};let support=0,minFoot=1;
    const poses=[];
    for(let n=0;n<120;n++){
      const cycle=n/120,state={...base,stage:'RUNNING',age:20,time:60+cycle*.5,distance:cycle*4,x:0,immunity:0};
      animator.apply(state);model.root.updateMatrixWorld(true);
      values.body.push(model.torso.getWorldPosition(new T.Vector3()).y);
      values.hip.push(model.pelvis.rotation.y);values.chest.push(model.torso.rotation.y);
      values.leftArm.push(model.arms[0].shoulder.rotation.x);values.rightArm.push(model.arms[1].shoulder.rotation.x);
      values.elbow.push(model.arms[0].elbow.rotation.x);values.hair.push(model.ponytail.rotation.x);values.tip.push(model.tailTip.rotation.x);values.skirt.push(model.skirt.rotation.x);
      for(let i=0;i<2;i++){
        const foot=new T.Vector3(0,-.119,-.055);model.legs[i].ankle.localToWorld(foot);minFoot=Math.min(minFoot,foot.y);
        if((cycle+i*.5)%1<.5)support=Math.max(support,Math.abs(foot.y));
      }
      if(n%15===0)poses.push({cycle,body:model.root.position.y,leftArm:model.arms[0].shoulder.rotation.x,rightArm:model.arms[1].shoulder.rotation.x});
    }
    const ranges=Object.fromEntries(Object.entries(values).map(([k,v])=>[k,Math.max(...v)-Math.min(...v)]));
    const counter=values.hip.reduce((sum,value,i)=>sum+value*values.chest[i],0);
    const saved=JSON.stringify(base);animator.apply(base);model.root.updateMatrixWorld(true);const pose=JSON.stringify(model.root.toJSON());
    animator.apply(base);model.root.updateMatrixWorld(true);const stable=pose===JSON.stringify(model.root.toJSON());
    return {ranges,support,minFoot,counter,stable,unchanged:JSON.stringify(base)===saved,poses};
  })()`);
  assert.ok(metrics.ranges.body>.065,'O tronco deve subir e descer de forma legível.');
  assert.ok(metrics.ranges.leftArm>.7&&metrics.ranges.rightArm>.4&&metrics.ranges.elbow>.5,'Braços e cotovelos precisam articular.');
  assert.ok(metrics.ranges.hip>.2&&metrics.ranges.chest>.3&&metrics.counter<0,'Quadril e ombros devem contrabalançar.');
  assert.ok(metrics.ranges.hair>.2&&metrics.ranges.tip>.4&&metrics.ranges.skirt>.15,'Cabelo e saia devem ter resposta própria.');
  assert.ok(metrics.support<.02&&metrics.minFoot>-.02,'A oscilação não deve enterrar os pés.');
  assert.ok(metrics.stable&&metrics.unchanged,'Pose congelada deve ser repetível sem alterar o domínio.');
  await evaluate(`document.querySelector('#zoom').value='2.5';document.querySelector('#angle').value='side';document.querySelector('#motion').click()`);
  const captures=[];
  for(let n=0;n<4;n++){
    await new Promise(r=>setTimeout(r,85));const shot=await send('Page.captureScreenshot',{format:'png'}),bytes=Buffer.from(shot.data,'base64');
    const file='/tmp/legendgirl-movimento-'+n+'.png';await fs.writeFile(file,bytes);
    captures.push({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
  }
  console.log('CAPTURAS',JSON.stringify(captures));
  assert.ok(new Set(captures.map(c=>c.sha256)).size===4,'Os quadros reais devem mostrar poses diferentes.');
  assert.deepEqual(exceptions,[]);
  console.log('APROVADO: reprodução real, oscilação corporal, contrarrotação, braços, cotovelos, resposta secundária, apoio e congelamento.',JSON.stringify(metrics));
} finally {ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
