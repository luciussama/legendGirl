import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidence = path.join(root, 'docs/qa/toy-room-etapa3/altos');
const fixtures=path.join(root,'tests/fixtures/toy-room-etapa3/altos');
await fs.mkdir(evidence,{recursive:true});
const stage = process.argv[2] || 'criticos';
assert(/^[a-z0-9-]+$/.test(stage), 'Nome do grupo inválido.');
const frozen = {};
for (const name of ['RoomEnvironmentRenderer', 'ToyRenderer', 'ToyRoomUI']) frozen[name] = await fs.readFile(path.join(fixtures, name + '-antes.txt'), 'utf8');
const original = await fs.readFile(path.join(fixtures, 'ToyRoomPhase-antes.txt'), 'utf8');
const oldEntities = await fs.readFile(path.join(fixtures, 'ToyRoomEntities-antes.txt'), 'utf8');
const absoluteImports = source => source.replaceAll("'../", "'http://127.0.0.1:8765/src/js/").replaceAll("'./", "'http://127.0.0.1:8765/src/js/toy-room/");
const pages = await (await fetch('http://127.0.0.1:9223/json')).json();
const ws = new WebSocket(pages.find(page => page.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => { ws.onopen = resolve; });
let sequence = 0;
const pending = new Map();
ws.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  if (pending.has(message.id)) {
    pending.get(message.id)(message.result);
    pending.delete(message.id);
  }
};
const send = (method, params = {}) => new Promise(resolve => {
  const id = ++sequence;
  pending.set(id, resolve);
  ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
};
const capture = async (name, expression) => fs.writeFile(path.join(evidence, name + '.png'),
  Buffer.from(await evaluate(expression), 'base64'));

try {
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Page.navigate', { url: 'http://127.0.0.1:8765/index.html' });
  await new Promise(resolve => setTimeout(resolve, 300));
  const result = await evaluate(`(async () => {
    const { AssetManager } = await import('/src/js/assets/AssetManager.js');
    const { ToyRoomPhase } = await import('/src/js/toy-room/ToyRoomPhase.js');
    const baseline = await import('data:text/javascript;base64,${Buffer.from(absoluteImports(original)).toString('base64')}');
    window.oldEntities = (await import('data:text/javascript;base64,${Buffer.from(absoluteImports(oldEntities)).toString('base64')}')).toyRoomEntities;
    window.entities = (await import('/src/js/toy-room/ToyRoomEntities.js')).toyRoomEntities;
    window.toyRenderer = (await import('/src/js/toy-room/ToyRenderer.js')).toyRenderer;
    const assets = new AssetManager(); await assets.loadManifest(); await assets.preload();
    const failures = [...assets.statuses].filter(([key, status]) => status !== 'ready');
    if (failures.length) throw Error(JSON.stringify(failures));
    window.makeCanvas = (w = 960, h = 580) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
    window.phase = new ToyRoomPhase(makeCanvas(), null, null, null, { assets });
    const before = new baseline.ToyRoomPhase(makeCanvas(), null, null, null, { assets });
    phase.mobilePresentation = before.mobilePresentation = false;
    const untouched = ['update', 'triggerAction', 'resolveCollisions', 'snapshot', 'restore'];
    for (const method of untouched) if (phase[method].toString() !== before[method].toString()) throw Error('Mecânica alterada: ' + method);
    const initial = phase.snapshot(); before.restore(initial);
    const assert = (ok, message) => { if (!ok) throw Error(message); };
    let collisionChecks = 0;
    for (let x = 0; x <= 1600; x += 20) for (let y = 0; y <= 1200; y += 20) {
      assert(JSON.stringify(phase.resolveCollisions(x, y, 20)) === JSON.stringify(before.resolveCollisions(x, y, 20)), 'Colisão divergente'); collisionChecks++;
    }
    const deterministic = p => JSON.stringify({ player: p.player, toys: p.toys, furniture: p.furniture, organizedCount: p.organizedCount, victory: p.victoryBannerActive });
    const random = Math.random;
    const seeded = operation => { let seed = 7; Math.random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); try { operation(); } finally { Math.random = random; } };
    let pickups = 0, drops = 0, stores = 0, movementChecks = 0;
    for (let index = 0; index < 8; index++) {
      for (const p of [phase, before]) { p.restore(initial); p.player.x = p.toys[index].x; p.player.y = p.toys[index].y; seeded(() => p.triggerAction()); }
      assert(phase.player.carriedItem?.id === phase.toys[index].id, 'Coleta incorreta'); pickups++;
      for (const key of ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']) {
        for (let frame = 0; frame < 30; frame++) {
          for (const p of [phase, before]) { p.keysDown = { [key]: true }; seeded(() => p.update(1)); }
          assert(deterministic(phase) === deterministic(before), 'Movimento divergente'); movementChecks++;
          const state = JSON.stringify(phase.snapshot()); phase.render(); assert(JSON.stringify(phase.snapshot()) === state, 'Render alterou estado');
        }
      }
      for (const p of [phase, before]) { p.keysDown = {}; p.player.x = 800; p.player.y = 650; p.lastActionTime = 0; seeded(() => p.triggerAction()); }
      assert(!phase.player.carriedItem && deterministic(phase) === deterministic(before), 'Soltura divergente'); drops++;
    }
    phase.restore(initial); before.restore(initial);
    for (let index = 0; index < 8; index++) {
      for (const p of [phase, before]) {
        p.player.x = p.toys[index].x; p.player.y = p.toys[index].y; p.lastActionTime = 0; seeded(() => p.triggerAction());
        const chest = p.furniture.find(f => f.id === 'toy-chest'); p.player.x = chest.x + chest.w / 2; p.player.y = chest.y + chest.h / 2;
        p.lastActionTime = 0; seeded(() => p.triggerAction());
      }
      assert(phase.toys[index].isOrganized && deterministic(phase) === deterministic(before), 'Guardar divergente'); stores++;
    }
    assert(phase.victoryBannerActive && phase.organizedCount === 8, 'Progressão incorreta');
    phase.restore(initial); window.initial = initial; window.assets = assets;
    window.options = { assets, environmentTeddy: phase.environmentTeddy, environmentTrain: phase.environmentTrain };
    return { recursos: [...assets.statuses].length, collisionChecks, pickups, drops, stores, movementChecks, estadoPreservado: true, metodosDeGameplayIdenticos: true, observacao: 'A fase possui velocidade única ponderada pelo peso; corrida é validada como ciclo visual de movimento, sem criar nova mecânica.' };
  })()`);


  await evaluate(`(async()=>{
    window.env=(await import('/src/js/toy-room/RoomEnvironmentRenderer.js')).roomEnvironmentRenderer;
    window.ui=(await import('/src/js/toy-room/ToyRoomUI.js')).toyRoomUI;
    window.oldEnv=(await import('data:text/javascript;base64,${Buffer.from(frozen.RoomEnvironmentRenderer).toString('base64')}')).roomEnvironmentRenderer;
    window.oldToy=(await import('data:text/javascript;base64,${Buffer.from(frozen.ToyRenderer).toString('base64')}')).toyRenderer;
    window.oldUI=(await import('data:text/javascript;base64,${Buffer.from(frozen.ToyRoomUI).toString('base64')}')).toyRoomUI;
    window.current={furniture:env.renderFurniture,toy:toyRenderer.renderToy,ui:ui.renderUI,fairy:entities.renderFairy};
    window.useBefore=before=>{env.renderFurniture=before?oldEnv.renderFurniture:current.furniture;toyRenderer.renderToy=before?oldToy.renderToy:current.toy;ui.renderUI=before?oldUI.renderUI:current.ui;entities.renderFairy=before?oldEntities.renderFairy:current.fairy};
    phase.restore(initial);phase.canvas.width=1600;phase.canvas.height=1200;phase.cameraX=0;phase.cameraY=0;phase.introAlpha=0;phase.introBannerTimer=0;phase.sunMotes=[];phase.sparkles=[];phase.confetti=[];phase.footstepPuffs=[];phase.fairy.particles=[];
    return true;
  })()`);
  await evaluate('useBefore(true);phase.render()');
  await evaluate('window.beforePixels=phase.ctx.getImageData(0,0,1600,1200).data');
  await capture(stage+'-antes','phase.canvas.toDataURL().split(",")[1]');
  await evaluate('useBefore(false);phase.render()');
  await capture(stage+'-depois','phase.canvas.toDataURL().split(",")[1]');
  const pixels = await evaluate(`(()=>{
    const after=phase.ctx.getImageData(0,0,1600,1200).data;let changed=0,outside=0;
    for(let y=0;y<1200;y++)for(let x=0;x<1600;x++){
      const i=(y*1600+x)*4;if(beforePixels[i]===after[i]&&beforePixels[i+1]===after[i+1]&&beforePixels[i+2]===after[i+2]&&beforePixels[i+3]===after[i+3])continue;changed++;
      const authorized=(x>=368&&x<=612&&y>=170&&y<=274)||(x>=728&&x<=892&&y>=170&&y<=274)||(x>=1228&&x<=1472&&y>=785&&y<=984)||initial.toys.filter(t=>['robot','duck','blocks','drum','jack'].includes(t.type)).some(t=>x>=t.x-40&&x<=t.x+40&&y>=t.y-55&&y<=t.y+45)||(x>=initial.fairy.x-30&&x<=initial.fairy.x+30&&y>=initial.fairy.y-30&&y<=initial.fairy.y+30);
      if(!authorized)outside++;
    }
    return{pixelsAlterados:changed,pixelsForaDoEscopo:outside};
  })()`);
  assert.equal(pixels.pixelsForaDoEscopo,0,'Pixels alterados fora dos grupos de prioridade alta.');
  const performance = await evaluate(`(async()=>{
    const sample=async before=>{useBefore(before);phase.canvas.width=1600;phase.canvas.height=1200;phase.cameraX=0;phase.cameraY=0;const draw=[],intervals=[];let previous;
      for(let i=0;i<90;i++){const stamp=await new Promise(requestAnimationFrame),start=performance.now();phase.render();if(i>15){draw.push(performance.now()-start);intervals.push(stamp-previous);}previous=stamp;}
      draw.sort((a,b)=>a-b);intervals.sort((a,b)=>a-b);return{medianaRenderMs:draw[Math.floor(draw.length/2)],p90RenderMs:draw[Math.floor(draw.length*.9)],medianaIntervaloMs:intervals[Math.floor(intervals.length/2)]};};
    const before=await sample(true),after=await sample(false);return{canvas:{largura:1600,altura:1200},antes:before,depois:after};
  })()`);
  assert(performance.depois.medianaIntervaloMs<=performance.antes.medianaIntervaloMs+1,'Regressão na cadência');
  assert(performance.depois.p90RenderMs<=performance.antes.p90RenderMs+.5,'Regressão no desenho da sala');
  const carrying = await evaluate(`(()=>{
    useBefore(false);const c=makeCanvas(180,180),ctx=c.getContext('2d');let checks=0;
    for(const toy of initial.toys)for(const facing of ['left','right'])for(const isMoving of [false,true]){
      const p={...initial.player,x:90,y:90,facing,isMoving,animTime:4.5,carriedItem:{...toy,isCarried:true,isOrganized:true}};
      ctx.clearRect(0,0,180,180);entities.renderPlayer(ctx,p,options);const a=ctx.getImageData(0,0,180,180).data;
      p.carriedItem.isOrganized=false;ctx.clearRect(0,0,180,180);entities.renderPlayer(ctx,p,options);const b=ctx.getImageData(0,0,180,180).data;
      const bob=isMoving?Math.sin(p.animTime*1.8)*.7:0;
      for(let y=38+Math.ceil(bob);y<69+Math.floor(bob);y++)for(let x=50;x<130;x++){
        const i=(y*180+x)*4;if(a[i+3]>128&&(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2]))throw Error('Carga cobre cabeça: '+toy.id);
      }
      checks++;
    }return{verificacoes:checks,nenhumaSobreposicaoDaCabeca:true};
  })()`);
  const hud = await evaluate(`(()=>{
    const checks=[];
    for(const [width,height]of [[960,580],[1366,768],[390,844],[360,640],[320,568],[915,412],[640,360]])for(let count=0;count<=8;count++){
      const c=makeCanvas(width,height),ctx=c.getContext('2d'),texts=[];let card;
      const rectangle=ctx.roundRect.bind(ctx),text=ctx.fillText.bind(ctx);
      ctx.roundRect=(x,y,w,h,r)=>{if(!card)card={x,y,w,h};return rectangle(x,y,w,h,r)};
      ctx.fillText=(value,x,y)=>{if(value.includes('Brinquedos')||value.startsWith('Arrumados:'))texts.push({value,x,y,width:ctx.measureText(value).width,font:ctx.font});return text(value,x,y)};
      ui.renderUI(ctx,c,{organizedCount:count,totalToys:8,player:{},introAlpha:0,introBannerTimer:0});
      // Controles HTML ativos: dois botões de 42 px, uma lacuna de 10 px e margem de 14 px.
      const controlsLeft=width-160;
      if(card.x+card.w>controlsLeft-10)throw Error('HUD invade faixa de controles em '+width);
      if(card.y+card.h>80)throw Error('HUD invade faixa de introdução');
      for(const t of texts)if(t.x+t.width>card.x+card.w-15||t.y>card.y+card.h)throw Error('Texto excede card: '+width+' '+t.value);
      checks.push({width,height,count,card,texts});
    }return checks;
  })()`);
  await fs.writeFile(path.join(evidence,stage+'-hud.json'),JSON.stringify(hud,null,2)+'\n');
  await fs.writeFile(path.join(evidence,stage+'-validacao.json'),JSON.stringify({...result,pixels,performance,carrying,verificacoesHUD:hud.length},null,2)+'\n');
  console.log('Grupo '+stage+' aprovado: estado, navegação, colisões, oito coletas/solturas/armazenamentos e cadência preservados.');
}catch(error){console.error(error);process.exitCode=1;}finally{ws.close();}
