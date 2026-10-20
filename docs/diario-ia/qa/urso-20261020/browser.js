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
 await send('Emulation.setDeviceMetricsOverride',{width:1280,height:800,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:process.env.PILOT_REVIEW_URL+'/?debug=1'});
 for(let i=0;i<180;i++){if(await evaluate('Boolean(window.game?.startDebugPhase)'))break;await new Promise(r=>setTimeout(r,100));}
 await evaluate(`document.querySelector('#debug-phase-select').value='bear-chase';document.querySelector('#debug-phase-select').dispatchEvent(new Event('change',{bubbles:true}));`);
 let ready=false;for(let i=0;i<240;i++){const c=await evaluate('(()=>{const c=game.state.toyRoomInstance?.instance.chase;return {ready:c?.ready,error:c?.error};})()');if(c.error)throw Error(c.error);if(c.ready){ready=true;break;}await new Promise(r=>setTimeout(r,100));}assert.ok(ready);
 await evaluate('game.setPaused(true)');const captures=[];
 for(const angle of [0,Math.PI/2,Math.PI]){
 const data=await evaluate(`(async()=>{const c=game.state.toyRoomInstance.instance.chase,r=c.renderer,T=await import('/src/vendor/three/three.module.js');const scene=new T.Scene();scene.background=new T.Color('#e6dfd1');scene.add(new T.HemisphereLight('#ffffff','#b7a78f',1.8));const light=new T.DirectionalLight('#ffffff',2);light.position.set(-3,5,-4);scene.add(light);const m=r.bearModel;m.apply({...c.state,stage:'CAUGHT',time:0,age:0,gap:0,bearX:0});m.root.rotation.y=${angle};scene.add(m.root);const camera=new T.PerspectiveCamera(37,1,.1,20);camera.position.set(2.8,1.9,-4.5);camera.lookAt(0,1,0);r.renderer.setSize(420,420,false);r.renderer.render(scene,camera);const snapshot=document.createElement('canvas');snapshot.width=snapshot.height=420;snapshot.getContext('2d').drawImage(r.renderer.domElement,0,0);
 const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=530;const ctx=canvas.getContext('2d');ctx.fillStyle='#e6dfd1';ctx.fillRect(0,0,1000,530);ctx.fillStyle='#422a1b';ctx.font='24px sans-serif';ctx.fillText('Referência original',60,45);ctx.fillText('Urso 3D · luz neutra',500,45);const image=new Image();image.src='/assets/art/toy-room/battle/bear/idle/01.png';await image.decode();ctx.imageSmoothingEnabled=false;ctx.drawImage(image,75,120,274,328);ctx.drawImage(snapshot,480,65,420,420);const data=canvas.toDataURL();r.scene.add(m.root);c.render();return data;})()`);
 const bytes=Buffer.from(data.split(',')[1],'base64'),file='/tmp/urso-neutro-'+angle.toFixed(2)+'.png';await fs.writeFile(file,bytes);captures.push({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
 }
 for(const distance of [82,208,338]){
 const data=await evaluate(`(()=>{const c=game.state.toyRoomInstance.instance.chase;Object.assign(c.state,{stage:'RUNNING',distance:${distance},gap:12,x:0,time:${distance/8},age:30});c.render();return c.canvas.toDataURL();})()`);const bytes=Buffer.from(data.split(',')[1],'base64'),file='/tmp/urso-quarto-'+distance+'.png';await fs.writeFile(file,bytes);captures.push({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
 }
 const rig=await evaluate(`(async()=>{const c=game.state.toyRoomInstance.instance.chase,m=c.renderer.bearModel,T=await import('/src/vendor/three/three.module.js');const saved=JSON.stringify(c.state);let contactError=0;const torso=[],head=[],elbow=[],ears=[];for(let i=0;i<100;i++){const distance=100+i*5.8/100,state={...c.state,stage:'RUNNING',distance,time:i/60,gap:23,bearX:0,obstacles:[]};m.apply(state);m.root.updateMatrixWorld(true);const phase=1.1*9/(Math.PI*2)+(distance+23-29)/5.8;for(let j=0;j<2;j++){const cycle=((phase+j*.5)%1+1)%1;if(cycle<.38){const p=m.legs[j].ankle.localToWorld(new T.Vector3(0,-.125,0));contactError=Math.max(contactError,Math.abs(p.y));}}torso.push(m.torso.rotation.x);head.push(m.head.rotation.x);elbow.push(m.arms[0].elbow.rotation.x);ears.push(m.ears[0].rotation.x);}
 const range=a=>Math.max(...a)-Math.min(...a);const start={...c.state,stage:'CHASE_START',age:1.1,distance:0,gap:29,time:7.15,obstacles:[]};m.apply(start);const launch=JSON.stringify(m.root.toJSON());m.apply({...start,stage:'RUNNING',age:0});const continuous=launch===JSON.stringify(m.root.toJSON());m.apply(c.state);const first=m.root.toJSON();m.apply(c.state);const second=m.root.toJSON();let meshes=0;m.root.traverse(o=>{if(o.isMesh)meshes++;});return{contactError,torso:range(torso),head:range(head),elbow:range(elbow),ears:range(ears),meshes,texture:!!m.material.map,continuous,deterministic:JSON.stringify(first)===JSON.stringify(second),state:saved===JSON.stringify(c.state),resources:c.renderer.resources.size};})()`);
 console.log('RIG',JSON.stringify(rig),'CAPTURAS',JSON.stringify(captures));assert.ok(rig.texture&&rig.continuous&&rig.deterministic&&rig.state);assert.ok(rig.contactError<.035);assert.ok(rig.torso>.04&&rig.head>.04&&rig.elbow>.3&&rig.ears>.1);assert.ok(rig.meshes<=20&&rig.resources<300);assert.deepEqual(exceptions,[]);assert.deepEqual(failed,[]);
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
