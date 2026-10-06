import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidence = path.join(root, 'docs/qa/toy-room-etapa2/correcao1');
const original = await fs.readFile(path.join(evidence, 'ToyRoomPhase-antes.txt'), 'utf8');
const oldEntities = await fs.readFile(path.join(evidence, 'ToyRoomEntities-antes.txt'), 'utf8');
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

  await evaluate(`(() => {
    window.sheets = [];
    for (const after of [false, true]) {
      const sheet = makeCanvas(1600, 1920), ctx = sheet.getContext('2d');
      ctx.fillStyle = '#b68549'; ctx.fillRect(0, 0, 1600, 1920);
      const labels = ['Parada', 'Andando', 'Corrida: ciclo visual', 'Virando à esquerda', 'Antes de coletar', 'Após coletar', 'Carregando em movimento', 'Após guardar'];
      for (let row = 0; row < 8; row++) for (let index = 0; index < 8; index++) {
        const x = 95 + index * 198, y = row * 240 + 160;
        const toy = { ...initial.toys[index], x, y: y - 38, isCarried: true };
        const carried = row !== 4 && row !== 7;
        const p = { ...initial.player, x, y, facing: row === 3 ? 'left' : 'right', isMoving: [1,2,6].includes(row), animTime: row === 2 ? 4.5 : row === 6 ? 8 : 0, carriedItem: carried ? toy : null };
        ctx.fillStyle = '#fff4d6'; ctx.font = '14px Georgia'; ctx.fillText(toy.name, x - 85, row * 240 + 24); ctx.fillText(labels[row], x - 85, row * 240 + 46);
        (after ? entities : oldEntities).renderPlayer(ctx, p, options);
        if (!after && carried) toyRenderer.renderToy(ctx, toy, x, y, true, 0, options);
        if (row === 4) toyRenderer.renderToy(ctx, { ...toy, x: x + 48, y: y + 15, isCarried: false }, x - 100, y, true, 0, options);
        if (row === 7) { ctx.font = '12px Georgia'; ctx.fillText('Item no baú', x - 30, y + 48); }
      }
      sheets.push(sheet);
    }
    return true;
  })()`);
  await capture('estados-antes', 'sheets[0].toDataURL().split(",")[1]');
  await capture('estados-depois', 'sheets[1].toDataURL().split(",")[1]');

  const headCheck = await evaluate(`(() => {
    const canvas = makeCanvas(180,180), ctx = canvas.getContext('2d'), results = [];
    for (const toy of initial.toys) for (const facing of ['left','right']) for (const moving of [false,true]) {
      const p = { ...initial.player, x:90, y:90, facing, isMoving:moving, animTime:4.5, carriedItem:{...toy,isCarried:true,isOrganized:true} };
      ctx.clearRect(0,0,180,180); entities.renderPlayer(ctx,p,options); const a=ctx.getImageData(0,0,180,180).data;
      p.carriedItem.isOrganized=false; ctx.clearRect(0,0,180,180); entities.renderPlayer(ctx,p,options); const b=ctx.getImageData(0,0,180,180).data;
      let overlap=0;
      // Região superior da pose: cabelo e rosto, excluindo pescoço e braços.
      const bob=moving?Math.sin(p.animTime*1.8)*.7:0;
      for(let y=38+Math.ceil(bob);y<69+Math.floor(bob);y++) for(let x=50;x<130;x++) {
        const i=(y*180+x)*4;
        if(a[i+3]>128 && (a[i]!==b[i] || a[i+1]!==b[i+1] || a[i+2]!==b[i+2])) overlap++;
      }
      results.push({brinquedo:toy.id,direcao:facing,movimento:moving,pixelsSobrepostos:overlap});
    }
    return results;
  })()`);
  assert(headCheck.every(check => check.pixelsSobrepostos === 0), 'Brinquedo sobrepondo a região superior da cabeça: ' + JSON.stringify(headCheck));
  await fs.writeFile(path.join(evidence,'cabeca-validacao.json'),JSON.stringify(headCheck,null,2)+'\n');

  for (const [label,width,height,mobile] of [['desktop',960,580,false],['android-paisagem',915,412,true],['celular-retrato',390,844,true]]) {
    await evaluate(`phase.restore(initial);phase.canvas.width=${width};phase.canvas.height=${height};phase.mobilePresentation=${mobile};phase.player.x=800;phase.player.y=640;phase.player.carriedItem=phase.toys[3];phase.toys[3].isCarried=true;phase.cameraX=Math.max(0,Math.min(1600-${width},800-${width}/2));phase.cameraY=Math.max(0,Math.min(1200-${height},640-${height}/2));phase.introAlpha=0;phase.introBannerTimer=0;phase.fairy.x=776;phase.fairy.y=608;phase.render()`);
    await capture(label,'phase.canvas.toDataURL().split(",")[1]');
  }

  const timing = await evaluate(`(async () => {
    const sample = async old => {
      const c = makeCanvas(), ctx = c.getContext('2d'), values = [], intervals = []; let previous;
      const p = { ...initial.player, x: 480, y: 300, isMoving: true, carriedItem: { ...initial.toys[0], x: 480, y: 262, isCarried: true } };
      for (let i = 0; i < 120; i++) {
        const stamp = await new Promise(requestAnimationFrame), start = performance.now(); ctx.clearRect(0, 0, 960, 580); p.animTime = i * .22;
        (old ? oldEntities : entities).renderPlayer(ctx, p, options);
        if (old) toyRenderer.renderToy(ctx, p.carriedItem, p.x, p.y, true, 0, options);
        if (i > 20) { values.push(performance.now() - start); intervals.push(stamp - previous); } previous = stamp;
      }
      values.sort((a,b)=>a-b); intervals.sort((a,b)=>a-b);
      return { medianaRenderMs: values[49], p90RenderMs: values[89], medianaIntervaloMs: intervals[49] };
    };
    return { antes: await sample(true), depois: await sample(false) };
  })()`);
  assert(timing.depois.medianaIntervaloMs <= timing.antes.medianaIntervaloMs + 1, 'Regressão na cadência');
  assert(timing.depois.p90RenderMs <= timing.antes.p90RenderMs + .3, 'Regressão no custo de transporte');
  await fs.writeFile(path.join(evidence, 'validacao.json'), JSON.stringify({ ...result, verificacoesDaCabeca:headCheck.length, performance: timing }, null, 2) + '\n');
  console.log('Transporte validado: oito coletas, oito solturas, oito organizações, 960 quadros de movimento e 4.941 amostras de colisão.');
} catch (error) {
  console.error(error); process.exitCode = 1;
} finally { ws.close(); }
