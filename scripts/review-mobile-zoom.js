// Requer servidor local :3000 e Chrome de teste com depuração remota :9222.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
const ws = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let sequence = 0;
const pending = new Map();
ws.onmessage = ({data}) => { const m = JSON.parse(data); if (pending.has(m.id)) {
  const {resolve,reject} = pending.get(m.id); pending.delete(m.id);
  m.error ? reject(Error(JSON.stringify(m.error))) : resolve(m.result);
}};
const send = (method, params = {}) => new Promise((resolve,reject) => {
  const id = ++sequence; pending.set(id,{resolve,reject}); ws.send(JSON.stringify({id,method,params}));
});
async function evaluate(expression) {
  const result = await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
  if(result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const directory='assets/qa-testers/current-screenshots/zoom';
await fs.mkdir(directory,{recursive:true});
try {
  await send('Page.enable');
  const results=[];
  for(const [name,w,h,ua] of [
    ['android-pequeno',360,640,'Android'],['android-grande',412,915,'Android'],
    ['iphone',390,844,'iPhone'],['tablet',768,1024,'iPad']
  ]) for(const landscape of [false,true]) {
    const width=landscape?h:w,height=landscape?w:h;
    const scenario=name+(landscape?'-paisagem':'-retrato');
    await send('Emulation.setUserAgentOverride',{userAgent:'Mozilla/5.0 ('+ua+') Mobile'});
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
    await send('Page.navigate',{url:'http://127.0.0.1:3000/tests/dark-room-playthrough.html'});
    for(let i=0;i<200;i++) {
      if(await evaluate('Boolean(window.review)')) break;
      await new Promise(r=>setTimeout(r,100));
    }
    await evaluate(`document.head.insertAdjacentHTML('beforeend','<meta name="viewport" content="width=device-width,initial-scale=1"><style>canvas{width:100vw;height:100dvh}p{display:none}</style>')`);
    await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
    for(const phase3 of [false,true]) for(let index=-1;index<(phase3?15:21);index++) {
      await evaluate('window.review.game.review.setMobileZoom(false)');
      const before=await evaluate(`window.review.game.review.mobileFrame(true,${index},${phase3})`);
      await evaluate('window.review.game.review.setMobileZoom(true)');
      const after=await evaluate(`window.review.game.review.mobileFrame(true,${index},${phase3})`);
      const t=after.transform;
      const x=value=>(value-after.cameraX)*t.a+t.e;
      const y=value=>value*t.d+t.f;
      assert.ok(after.zoom>=1&&after.zoom<=1.18001,'Zoom moderado');
      assert.ok(x(after.player.x)>=0&&x(after.player.x+after.player.w)<=after.width,scenario+': personagem visível');
      assert.ok(y(after.player.y)>=0&&y(after.player.y+after.player.h)<=after.height,scenario+': personagem visível verticalmente');
      assert.ok(x(after.fairy.x-20)>=0&&x(after.fairy.x+20)<=after.width,scenario+': fada visível');
      assert.ok(y(after.fairy.y-20)>=0&&y(after.fairy.y+20)<=after.height,scenario+': fada visível verticalmente');
      const p=after.next, support=p.standRegion||p, sy=p.surfaceTopY??support.y;
      const landingWidth=Math.min(support.w,96), landingX=phase3?support.x+support.w-landingWidth:support.x;
      if(after.zoom>1) {
        assert.ok(x(landingX)>=-0.01&&x(landingX+landingWidth)<=after.width+0.01,scenario+': região de chegada visível '+index+' fase3='+phase3);
        assert.ok(y(sy)>=0&&y(sy)<=after.height,scenario+': altura do próximo apoio visível');
      } else assert.deepEqual(after.transform,before.transform,'Saltos largos preservam o campo de visão original');
      if(ua==='Android') assert.ok((after.height-y(after.player.y+after.player.h))*height/after.height>=71.9,'Margem inferior Android preservada');
      results.push({cenario:scenario,phase3,index,zoom:after.zoom,alturaAntes:before.player.h*height/before.height,alturaDepois:after.player.h*after.zoom*height/after.height});
      if(index===0&&!phase3) {
        const {data}=await send('Page.captureScreenshot',{format:'png'});
        await fs.writeFile(`${directory}/${scenario}-atual.png`,Buffer.from(data,'base64'));
      }
    }
    const toy=await evaluate(`(async()=>{
      const {ToyRoomPhase}=await import('/src/js/toy-room/ToyRoomPhase.js');
      const {roomEnvironmentRenderer}=await import('/src/js/toy-room/RoomEnvironmentRenderer.js');
      const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
      const room=new ToyRoomPhase(canvas,null,null,()=>{},{assets:window.review.game.assets});
      room.introAlpha=0;room.introBannerTimer=0;
      room.cameraX=Math.max(0,room.player.x-canvas.width/2);
      room.cameraY=Math.max(0,room.player.y-canvas.height/2);
      const before=JSON.stringify(room.snapshot()),original=roomEnvironmentRenderer.renderBackground;
      let matrix;
      roomEnvironmentRenderer.renderBackground=function(...args){matrix=ctx.getTransform();return original.apply(this,args);};
      try{room.render();}finally{roomEnvironmentRenderer.renderBackground=original;room.destroy();}
      return {zoom:matrix.a,unchanged:before===JSON.stringify(room.snapshot()),
        playerX:room.player.x*matrix.a+matrix.e,playerY:room.player.y*matrix.d+matrix.f,
        fairyX:room.fairy.x*matrix.a+matrix.e,fairyY:room.fairy.y*matrix.d+matrix.f,
        width:canvas.width,height:canvas.height};
    })()`);
    assert.ok(toy.zoom>1&&toy.zoom<=1.18001,'Sala de brinquedos ampliada');
    assert.ok(toy.unchanged,'Renderização da sala preserva estado');
    for(const who of ['player','fairy']) assert.ok(toy[who+'X']>30&&toy[who+'X']<toy.width-30&&toy[who+'Y']>60&&toy[who+'Y']<toy.height-30,'Personagens da sala visíveis');
    const {data}=await send('Page.captureScreenshot',{format:'png'});
    await fs.writeFile(`${directory}/${scenario}-sala.png`,Buffer.from(data,'base64'));
  }
  await fs.writeFile(`${directory}/resultados.json`,JSON.stringify(results,null,2)+'\n');
  console.log('Zoom móvel: '+results.length+' enquadramentos validados; capturas atuais geradas.');
} finally {ws.close();}
