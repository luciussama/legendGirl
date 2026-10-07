import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const out = 'docs/qa/toy-room-identificacao';
await fs.mkdir(out, {recursive:true});
const httpPort = process.env.TOY_REVIEW_HTTP_PORT || '3001';
const cdp = `http://127.0.0.1:${process.env.TOY_REVIEW_CDP_PORT || '9222'}`;
const page = await (await fetch(`${cdp}/json/new?about:blank`, {method:'PUT'})).json();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(resolve => ws.onopen = resolve);
let seq = 0;
const pending = new Map(), exceptions = [], results = [];
ws.onmessage = ({data}) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params);
  if (pending.has(message.id)) {pending.get(message.id)(message);pending.delete(message.id);}
};
const send = (method, params={}) => new Promise(resolve => {
  const id = ++seq; pending.set(id,resolve); ws.send(JSON.stringify({id,method,params}));
});
const evaluate = async expression => {
  const message = await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
  if (message.error || message.result.exceptionDetails) throw Error(JSON.stringify(message));
  return message.result.result.value;
};
const capture = async name => {
  const response = await send('Page.captureScreenshot',{format:'png'});
  await fs.writeFile(`${out}/${name}.png`,Buffer.from(response.result.data,'base64'));
};
try {
  await send('Page.enable'); await send('Runtime.enable');
  for (const [profile,width,height,mobile] of [
    ['desktop',1280,720,false],['mobile-retrato',390,844,true],
    ['mobile-paisagem',915,412,true],['mobile-retrato-320',320,568,true]
  ]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
    await send('Emulation.setUserAgentOverride',{userAgent:mobile
      ? 'Mozilla/5.0 (Linux; Android 14) Mobile' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'});
    await send('Page.navigate',{url:`http://127.0.0.1:${httpPort}/index.html`});
    let ready = false;
    for (let i=0;i<200;i++) {
      ready = await evaluate('Boolean(window.game?.state && document.getElementById("btn-skip-phase2"))');
      if (ready) break;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    assert(ready,'Jogo inicializado');
    await new Promise(resolve=>setTimeout(resolve,900));
    await evaluate('game.assetsReady');
    await evaluate(`localStorage.clear();document.getElementById('btn-skip-phase2').click();game.toyRoomIntroduction.update(23.3*60+1)`);
    for (let i=0;i<100;i++) {
      if (await evaluate('Boolean(game.state.toyRoomInstance?.instance)')) break;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    const entry = await evaluate(`(()=>{
      window.phase=game.state.toyRoomInstance.instance;
      phase.render();return {tutorial:phase.tutorial.active,furniture:phase.furniture,toys:phase.toys};
    })()`);
    assert(entry.tutorial,'Entrada mantém o tutorial');
    await capture(`${profile}-entrada`);
    // Aguarda a transição existente do panorama para o enquadramento jogável.
    await evaluate(`(async()=>{
      for(let i=0;i<180;i++)await new Promise(requestAnimationFrame);
      game.setPaused(true);phase.render();
    })()`);
    await capture(`${profile}-tutorial`);
    const pickup = await evaluate(`(()=>{
      phase.keysDown.KeyD=true;phase.update(2);phase.keysDown.KeyD=false;
      const toy=phase.tutorial.target;phase.player.x=toy.x;phase.player.y=toy.y;
      phase.lastActionTime=-Infinity;phase.triggerAction();
      return {carried:phase.player.carriedItem?.id,tutorial:phase.tutorial.active};
    })()`);
    assert(pickup.carried && !pickup.tutorial,'Coleta real conclui o tutorial');
    // A aproximação é uma montagem de teste; o enquadramento é atualizado pela câmera existente.
    const geometry = await evaluate(`(()=>{
      phase.player.x=1135;phase.player.y=400;
      for(let i=0;i<100;i++)phase.update(1);
      phase.render();
      const c=phase.canvas,r=c.getBoundingClientRect();
      return {canvas:{width:c.width,height:c.height},css:{width:r.width,height:r.height},
        chest:phase.furniture.find(f=>f.id==='toy-chest'),camera:{x:phase.cameraX,y:phase.cameraY},
        sprite:{width:phase.environmentChest.width,height:phase.environmentChest.height},
        mobile:phase.mobilePresentation};
    })()`);
    assert(geometry.sprite.width>138,'Sprite identificado carregado');
    await capture(`${profile}-caixa`);
    await evaluate(`(()=>{
      const c=document.createElement('canvas');c.width=198;c.height=137;
      c.getContext('2d').drawImage(phase.environmentChest,0,0,198,137);
      window.reducedChest=c;
    })()`);
    const detail = await evaluate('reducedChest.toDataURL().split(",")[1]');
    await fs.writeFile(`${out}/caixa-resolucao-gameplay.png`,Buffer.from(detail,'base64'));
    const storage = await evaluate(`(()=>{
      const chest=phase.furniture.find(f=>f.id==='toy-chest');
      phase.player.x=chest.x+chest.w/2;phase.player.y=chest.y+chest.h+32;
      phase.lastActionTime=-Infinity;phase.triggerAction();phase.render();
      return {count:phase.organizedCount,carried:phase.player.carriedItem};
    })()`);
    assert.equal(storage.count,1); assert.equal(storage.carried,null);
    await capture(`${profile}-armazenamento`);
    const victory = await evaluate(`(()=>{
      for(const toy of phase.toys.filter(t=>!t.isOrganized)) {
        phase.player.x=toy.x;phase.player.y=toy.y;phase.lastActionTime=-Infinity;phase.triggerAction();
        const chest=phase.furniture.find(f=>f.id==='toy-chest');
        phase.player.x=chest.x+chest.w/2;phase.player.y=chest.y+chest.h+32;
        phase.lastActionTime=-Infinity;phase.triggerAction();
      }
      phase.render();return {count:phase.organizedCount,total:phase.toys.length,victory:phase.victoryBannerActive};
    })()`);
    assert.equal(victory.count,victory.total); assert(victory.victory);
    await capture(`${profile}-conclusao`);
    const preservation = await evaluate(`(()=>{
      const before=JSON.stringify(phase.snapshot());phase.render();
      return JSON.stringify(phase.snapshot())===before;
    })()`);
    assert(preservation,'Renderização não altera estado');
    results.push({profile,width,height,entryTutorial:entry.tutorial,pickup,geometry,storage,victory,renderPreservesState:preservation});
  }
  assert.equal(exceptions.length,0,'Nenhuma exceção no navegador');
  const phaseSource=await fs.readFile('src/js/toy-room/ToyRoomPhase.js','utf8');
  const guideSource=await fs.readFile('src/js/toy-room/ToyRoomOrientation.js','utf8');
  assert(!phaseSource.includes('renderChestLabel')&&!guideSource.includes('renderChestLabel'),'Marcador flutuante removido');
  assert(!guideSource.includes('CAIXA DE BRINQUEDOS'),'Texto flutuante removido');
  const hash = async filename=>createHash('sha256').update(await fs.readFile(filename)).digest('hex');
  await fs.writeFile(`${out}/navegador.json`,JSON.stringify({results,exceptions,
    atlasSHA256:await hash('assets/art/toy-room/environment-sheet.png'),
    spriteSHA256:await hash('assets/art/toy-room/chest-brinquedos-v1.png'),
    floatingMarkerRemoved:true},null,2)+'\n');
  console.log('APROVADO: quatro formatos, entrada, tutorial, coleta, armazenamento, conclusão, capturas e estado preservado.');
} finally {
  ws.close();await fetch(`${cdp}/json/close/${page.id}`).catch(()=>{});
}
