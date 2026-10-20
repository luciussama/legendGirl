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
  await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: (process.env.PILOT_REVIEW_URL || 'http://127.0.0.1:3000')+'/?debug=1' });
  let ready = false;
  for (let n = 0; n < 150; n++) {
    if (await evaluate('Boolean(window.game?.startDebugPhase)')) { ready = true; break; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'API local do jogo deve carregar.');
  await evaluate(`localStorage.setItem('legendGirl.campaign.v1',JSON.stringify({teste:'preservar'})); window.beforeSave=localStorage.getItem('legendGirl.campaign.v1'); document.querySelector('#debug-phase-select').value='bear-chase';document.querySelector('#debug-phase-select').dispatchEvent(new Event('change',{bubbles:true}));`);
  ready = false;
  for (let n = 0; n < 180; n++) {
    const state = await evaluate(`(()=>{const c=game.state.toyRoomInstance?.instance.chase;return {ready:c?.ready,error:c?.error};})()`);
    if (state.error) throw Error(state.error);
    if (state.ready) { ready = true; break; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'Renderer 3D deve carregar todas as artes.');
  await evaluate('game.setPaused(true)');
  const maps=await evaluate(`(()=>{
    const c=game.state.toyRoomInstance.instance.chase.renderer.propCatalog,results={},unique=new Set();let bytes=0;
    for(const id of ['train','blocks','bunny','wardrobe','shelf','fortress','chest']){
      const root=c.create(id),textures=new Set();let checked=0;
      root.traverse(o=>{if(!o.isMesh||!o.material.map||!(o.material.userData.atlasRect||o.material.userData.atlasRects?.length))return;
        const m=o.material,uv=o.geometry.getAttribute('uv'),rects=m.userData.atlasRect?[m.userData.atlasRect]:m.userData.atlasRects;
        for(let i=0;i<uv.count;i++)if(!rects.some(([x,y,w,h])=>uv.getX(i)>=x-1e-6&&uv.getX(i)<=x+w+1e-6&&uv.getY(i)>=y-1e-6&&uv.getY(i)<=y+h+1e-6))throw Error('UV fora da região de '+id);
        textures.add(m.map.uuid);checked++;
        if(!unique.has(m.map.uuid)){unique.add(m.map.uuid);let width=m.map.image.width,height=m.map.image.height;while(true){bytes+=width*height*4;if(width===1&&height===1)break;width=Math.max(1,width>>1);height=Math.max(1,height>>1);}}
      });
      results[id]={textures:textures.size,texturedMeshes:checked};
    }
    return {results,atlasCount:unique.size,estimatedRGBA8WithMipmaps:bytes};
  })()`);
  assert.equal(maps.atlasCount,4,'Um atlas completo por objeto, sem cópia GPU por quadrante.');
  for(const [id,r]of Object.entries(maps.results)){assert.ok(r.textures>=1&&r.textures<=2,id);assert.ok(r.texturedMeshes>=1,id+': regiões devem consumir atlas reais.');}
  assert.ok(maps.estimatedRGBA8WithMipmaps<36*1024*1024,'Atlases devem caber no orçamento estimado de 36 MiB RGBA8 com mipmaps.');
  console.log('MAPAS PICTÓRICOS',JSON.stringify(maps));
  const catalog = await evaluate(`(async()=>{
    const T=await import('/src/vendor/three/three.module.js');
    const renderer=game.state.toyRoomInstance.instance.chase.renderer, c=renderer.propCatalog;
    const before=renderer.resources.size,original=JSON.stringify(game.state.toyRoomInstance.instance.chase.state),models={};
    for(const id of ['train','blocks','bunny','wardrobe','shelf','fortress','chest']){
      const a=c.create(id),b=c.create(id),box=new T.Box3().setFromObject(a),size=box.getSize(new T.Vector3());
      let planes=0,shared=true;const first=[],second=[];a.traverse(o=>{if(o.isMesh){first.push(o);if(o.geometry.type==='PlaneGeometry')planes++;}});b.traverse(o=>{if(o.isMesh)second.push(o);});
      for(let i=0;i<first.length;i++)if(first[i].geometry!==second[i].geometry||first[i].material!==second[i].material)shared=false;
      const disposed=[];for(const mesh of first)mesh.geometry.addEventListener('dispose',()=>disposed.push(id));
      renderer.scene.add(a,b);c.release(a);renderer.renderer.render(renderer.scene,renderer.camera);c.release(b);
      models[id]={size:size.toArray(),minY:box.min.y,planes,shared,prematureDisposal:disposed.length};
    }
    const placements=[];renderer.scene.updateMatrixWorld(true);
    for(const segment of renderer.segments)for(const o of segment.children)if(o.userData.decorative){const b=new T.Box3().setFromObject(o);placements.push({min:b.min.x,max:b.max.x,id:o.userData.propId||'anterior'});}
    const state=game.state.toyRoomInstance.instance.chase.state;
    for(let i=0;i<80;i++){
      const obstacles=[{id:12345,kind:['train','blocks','bunny'][i%3],x:2.4,z:193,fromX:0,fromZ:199,age:2,hit:false}];
      // O mesmo ID pode mudar de tipo após restauração; troca-se a instância, sem descartar recursos comuns.
      renderer.updateToys({...state,obstacles});
      if(renderer.toys.get(12345).userData.propId!==obstacles[0].kind)throw Error('ID reutilizado precisa mostrar o tipo restaurado.');
    }
    renderer.updateToys({...state,obstacles:[]});
    return {models,placements,before,after:renderer.resources.size,statePreserved:original===JSON.stringify(state),catalogResources:c.resources.resources.size};
  })()`);
  for(const [id,m]of Object.entries(catalog.models)){
    assert.equal(m.planes,0,id+': precisa de volume real.');assert.ok(m.shared,id+': instâncias precisam compartilhar recursos.');assert.equal(m.prematureDisposal,0);
    assert.ok(Math.abs(m.minY)<.001,id+': apoio no piso.');assert.ok(m.size.every(n=>n>.2));
    if(['train','blocks','bunny'].includes(id))assert.ok(m.size[0]<=1.15,id+': desenho deve caber na largura lógica existente.');
  }
  assert.ok(catalog.placements.length>=24);for(const p of catalog.placements){assert.ok((p.min>4.3&&p.max<5.5)||(p.max< -4.3&&p.min> -5.5),'Móvel deve ficar junto à parede: '+JSON.stringify(p));}
  assert.equal(catalog.before,catalog.after,'Entrada/remoção não pode acumular recursos.');assert.ok(catalog.statePreserved);assert.ok(catalog.after<300);
  console.log('CATÁLOGO',JSON.stringify(catalog));
  const single = await evaluate(`(()=>{const c=game.state.toyRoomInstance.instance.chase;c.state.stage='RUNNING';c.state.distance=180;c.state.age=18;c.state.gap=26;c.state.x=0;c.canvas.width=1280;c.canvas.height=800;c.state.obstacles=[{id:800,x:2.4,z:193,age:2,width:1.15,kind:'blocks',hit:false,fromX:0,fromZ:199}];c.render();return {calls:c.renderer.renderer.info.render.calls,resources:c.renderer.resources.size,geometries:c.renderer.renderer.info.memory.geometries};})()`);
  assert.ok(single.calls<=310,'Custo de desenho no cenário comparável não deve superar a baseline.');
  console.log('CENÁRIO COMPARÁVEL À BASELINE',JSON.stringify(single));
  const loss = await evaluate(`(async()=>{const c=game.state.toyRoomInstance.instance.chase,r=c.renderer,ext=r.renderer.getContext().getExtension('WEBGL_lose_context');if(!ext)return {supported:false};const before=JSON.stringify(c.state);await new Promise(resolve=>{r.renderer.domElement.addEventListener('webglcontextlost',resolve,{once:true});ext.loseContext();});game.setPaused(false);c.update(6);const frozen=JSON.stringify(c.state)===before;game.setPaused(true);await new Promise(resolve=>{r.renderer.domElement.addEventListener('webglcontextrestored',resolve,{once:true});setTimeout(()=>ext.restoreContext(),100);});c.render();return {supported:true,frozen,restored:!r.contextLost,calls:r.renderer.info.render.calls};})()`);
  assert.ok(loss.supported&&loss.frozen&&loss.restored&&loss.calls>0,'Perda/restauração WebGL deve preservar o estado e recuperar o quadro.');
  console.log('RECUPERAÇÃO WEBGL',JSON.stringify(loss));
  const results = [];
  for (const [width, height, mobile] of [[1280,800,false],[390,844,true],[844,390,true]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
    const result = await evaluate(`(()=>{
      const c=game.state.toyRoomInstance.instance.chase;
      c.canvas.width=${width};c.canvas.height=${height};
      c.state.stage='RUNNING';c.state.age=18;c.state.distance=180;c.state.gap=26;c.state.x=0;
      c.state.obstacles=['train','blocks','bunny'].map((kind,i)=>({id:800+i,x:(i-1)*2.4,z:184+i*1.8,age:2,width:1.15,kind,hit:false,fromX:0,fromZ:199}));
      c.render();const info=c.renderer.renderer.info;const gl=c.renderer.renderer.getContext();
      const pixels=c.ctx.getImageData(0,0,c.canvas.width,c.canvas.height).data;let count=0;
      for(let i=0;i<pixels.length;i+=128)if(pixels[i]!==243||pixels[i+1]!==223||pixels[i+2]!==184)count++;
      const saved=c.snapshot();c.restore(saved);const restored=JSON.stringify(c.state)===JSON.stringify(saved.state);
      const before=JSON.stringify(c.state);c.update(12);const frozen=before===JSON.stringify(c.state);
      return {width:${width},height:${height},calls:info.render.calls,textures:info.memory.textures,geometries:info.memory.geometries,
        webgl2:gl instanceof WebGL2RenderingContext,drawnPixels:count,restored,frozen};})()`);
    assert.ok(result.webgl2 && result.drawnPixels > 200 && result.calls > 0, JSON.stringify(result));
    assert.ok(result.restored && result.frozen, 'Pause e snapshot não podem avançar estado.');
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const bytes = Buffer.from(screenshot.data, 'base64');
    const file = '/tmp/legendgirl-e5-jogo-' + width + '.png'; await fs.writeFile(file, bytes);
    console.log('CAPTURA', JSON.stringify({ file, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') }));
    results.push(result);
  }
  const endings=[];
  for(const [width,height]of [[1280,800],[390,844],[844,390]]){
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<height});
    const end=await evaluate(`(async()=>{
      const T=await import('/src/vendor/three/three.module.js'),c=game.state.toyRoomInstance.instance.chase,r=c.renderer;
      c.canvas.width=${width};c.canvas.height=${height};const original=c.snapshot(),rows=[];
      for(const x of [-3.6,0,3.6])for(const [stage,age]of [['CAUGHT',1.3],['CHEST_RETURN',1.4],['CHEST_RETURN',2.7],['COMPLETE',0]]){
        Object.assign(c.state,{stage,age,x,distance:720,gap:1.2,obstacles:[]});const before=JSON.stringify(c.state);c.render();
        const box=new T.Box3().setFromObject(r.chest),lid=r.chest.getObjectByName('tampa');let inside=true;
        for(const xx of [box.min.x,box.max.x])for(const yy of [box.min.y,box.max.y])for(const zz of [box.min.z,box.max.z]){const p=new T.Vector3(xx,yy,zz).project(r.camera);if(Math.abs(p.x)>1||Math.abs(p.y)>1)inside=false;}
        let clearance=true;for(const segment of r.segments)for(const o of segment.children)if(o.userData.decorative&&o.visible&&o.position.x>0){const position=new T.Vector3();o.getWorldPosition(position);if(Math.abs(position.z-r.chest.position.z)<4)clearance=false;}
        rows.push({clearance,stage,age,x,lid:lid.rotation.x,visible:r.chest.visible,minX:box.min.x,maxX:box.max.x,inside,statePreserved:before===JSON.stringify(c.state),bearX:r.bear.position.x});
      }
      Object.assign(c.state,{stage:'CHEST_RETURN',age:1.4,x:0,distance:720,gap:1.2,obstacles:[]});c.render();c.endingQAOriginal=original;return rows;
    })()`);
    for(const r of end){assert.ok(r.clearance&&r.visible&&r.inside&&r.statePreserved,'Baú final deve caber na câmera: '+JSON.stringify({width,height,...r}));assert.ok(r.minX>4.3&&r.maxX<5.5,'Tampa deve permanecer dentro do quarto e fora da rota: '+JSON.stringify(r));if(r.stage==='COMPLETE')assert.equal(r.lid,0);}
    const shot=await send('Page.captureScreenshot',{format:'png'}),bytes=Buffer.from(shot.data,'base64'),file='/tmp/legendgirl-e5-final-'+width+'.png';await fs.writeFile(file,bytes);console.log('CAPTURA FINAL',JSON.stringify({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')}));
    await evaluate(`(()=>{const c=game.state.toyRoomInstance.instance.chase;c.restore(c.endingQAOriginal);delete c.endingQAOriginal;})()`);
    endings.push({width,height,scenarios:end.length});
  }
  console.log('SEQUÊNCIA FINAL',JSON.stringify(endings));
  await evaluate(`(()=>{const c=game.state.toyRoomInstance.instance.chase;game.setPaused(false);c.state.stage='RUNNING';c.state.distance=20;c.state.obstacles=[];c.state.x=0;})()`);
  await send('Input.dispatchKeyEvent', { type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39 });
  const input = await evaluate(`(()=>{const c=game.state.toyRoomInstance.instance.chase;const before=c.state.x;for(let i=0;i<10;i++)c.update(1);return {before,after:c.state.x};})()`);
  await send('Input.dispatchKeyEvent', { type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39 });
  assert.ok(input.after > input.before, 'Teclado real deve deslocar a menina.');
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 2 });
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 100, y: 220, id: 1 }] });
  const touched = await evaluate('game.state.toyRoomInstance.instance.chase.input.sample()');
  assert.equal(touched, -1, 'Toque real na lateral esquerda deve desviar.');
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  assert.equal(await evaluate('game.state.toyRoomInstance.instance.chase.input.sample()'), 0);
  await evaluate('game.setPaused(true)');
  await evaluate('game.state.toyRoomInstance.instance.chase.audio.loading');
  const audio = await evaluate(`(()=>{const c=game.state.toyRoomInstance.instance.chase;
    game.setMuted(true);c.render();return {buffers:c.audio.buffers.size,volume:c.audio.music.volume,paused:c.audio.music.paused};})()`);
  assert.equal(audio.buffers,12);assert.equal(audio.volume,0);assert.equal(audio.paused,true);
  const full = await evaluate(`(async()=>{
    const c=game.state.toyRoomInstance.instance.chase;
    const {createChaseState}=await import('/src/js/bear-chase/ChaseSimulation.js');
    c.state=createChaseState();game.setPaused(false);c.input.sample=()=>{
      const next=c.state.obstacles.filter(o=>o.z>=c.state.distance-.1).sort((a,b)=>a.z-b.z)[0];
      if(!next)return 0;const group=c.state.obstacles.filter(o=>Math.abs(o.z-next.z)<.01);
      const choices=[-2.4,0,2.4].filter(x=>group.every(o=>Math.abs(o.x-x)>1)).sort((a,b)=>Math.abs(a-c.state.x)-Math.abs(b-c.state.x));
      return Math.abs(choices[0]-c.state.x)<.05?0:Math.sign(choices[0]-c.state.x);};
    let maximum=0;
    for(let i=0;i<7500&&c.state.stage!=='COMPLETE';i++){c.update(1);if(i%60===0)c.render();maximum=Math.max(maximum,c.renderer.resources.size);}
    c.render();game.setPaused(true);return {stage:c.state.stage,hits:c.state.hits,chest:c.state.chestApplied,maximum,remainingToys:c.renderer.toys.size};
  })()`);
  assert.equal(full.stage,'COMPLETE');assert.equal(full.hits,0);assert.equal(full.chest,true);
  assert.ok(full.maximum<300,'Recursos GPU devem permanecer limitados durante o percurso.');
  assert.equal(await evaluate(`localStorage.getItem('legendGirl.campaign.v1')===beforeSave`), true, 'Prévia não deve sobrescrever campanha.');
  await evaluate(`(()=>{const c=game.state.toyRoomInstance.instance.chase;window.previousChase=c;game.startDebugPhase('toy-room');})()`);
  const disposed = await evaluate('({disposed:previousChase.disposed,resources:previousChase.renderer.resources.size,pointers:previousChase.input.pointers.size})');
  assert.deepEqual(disposed, {disposed:true,resources:0,pointers:0});
  assert.deepEqual(exceptions,[]);assert.deepEqual(failed,[]);
  console.log('APROVADO: prévia no jogo real, WebGL 2, três formatos, pause/save, teclado/toque, 12 passos, mudo, percurso simulado completo, save de campanha preservado e descarte.',JSON.stringify({results,audio,full,disposed}));
} finally {
  ws.close(); await fetch('http://127.0.0.1:9222/json/close/' + page.id);
}
