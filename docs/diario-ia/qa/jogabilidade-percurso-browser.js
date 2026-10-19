// Requer servidor local :3000 e Chrome de teste com depuração remota :9222.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const signatures=[];const assetFiles={};
async function inventory(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const p=dir+'/'+entry.name;if(entry.isDirectory())await inventory(p);else assetFiles[p]=hash(await fs.readFile(p));}}
await inventory('assets');await inventory('src/assets');await inventory('src/audio');
const page=await(await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(page.webSocketDebuggerUrl);
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
const profile=process.argv[2]||'android';
const profiles={android:{width:390,height:844,mobile:true,ua:'Mozilla/5.0 (Linux; Android 14) Mobile'},
  iphone:{width:390,height:844,mobile:true,ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile'},
  desktop:{width:960,height:540,mobile:false,ua:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}};
assert.ok(profiles[profile],'Perfil de teste válido');
const device=profiles[profile];
const difficulty=process.argv[3]??'NORMAL';assert.ok(['NORMAL','EASY'].includes(difficulty));
const directory='docs/diario-ia/qa-resultados/jogabilidade/'+profile+'/'+difficulty;
await fs.mkdir(directory,{recursive:true});
try {
  await send('Page.enable');await send('Runtime.enable');
  await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});
  await send('Page.addScriptToEvaluateOnNewDocument',{source:`let seed=123456789;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};Object.defineProperty(performance,'now',{value:()=>100000});localStorage.clear();window.__refactSources=new Set();window.__refactErrors=[];window.addEventListener('error',e=>window.__refactErrors.push(e.message));const draw=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(image,...args){if(image.src)window.__refactSources.add(new URL(image.src,location.href).pathname);return draw.call(this,image,...args);};`});
  await send('Emulation.setUserAgentOverride',{userAgent:device.ua});
  await send('Emulation.setDeviceMetricsOverride',{width:device.width,height:device.height,deviceScaleFactor:1,mobile:device.mobile});
  await send('Page.navigate',{url:'http://127.0.0.1:3000/tests/dark-room-playthrough.html'});
  for(let i=0;i<200;i++){if(await evaluate('Boolean(window.review)'))break;await new Promise(r=>setTimeout(r,100));}
  await evaluate(`document.head.insertAdjacentHTML('beforeend','<meta name="viewport" content="width=device-width,initial-scale=1"><style>canvas{width:100vw;height:100dvh}p{display:none}</style>')`);
  await evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
  await evaluate(`window.review.game.review.beginManual();window.review.game.state.gameDifficulty='${difficulty}'`);
  const report=[];
  async function capture(name){
    const data=await evaluate("document.querySelector('canvas').toDataURL().split(',')[1]");
    const raw=Buffer.from(data,'base64');await fs.writeFile(`${directory}/${name}.png`,raw);
    signatures.push({name,sha256:hash(raw),bytes:raw.length});
  }
  async function settle(){return evaluate(`(()=>{
    const r=window.review.game.review;
    for(let i=0;i<5000;i++){
      const s=r.inspectManual();
      if(s.over)throw Error('Falha durante narrativa: '+JSON.stringify(s));
      if(s.mode==='toy-room')return s;
      // O primeiro salto desbloqueia o movimento antes do percurso de plataformas.
      if(s.firstJump){
        r.actionManual();
        for(let f=0;f<250;f++){r.frameManual(f%15===0);if(r.inspectManual().baby.onGround)break;}
        continue;
      }
      if(s.standby||(s.plot&&s.plotStep>=4))r.actionManual();
      if(!s.opening&&!s.standby&&!s.transition&&!s.cutscene&&!s.plot&&!s.tutorial&&!s.portal&&!s.toyIntro)return s;
      r.frameManual(i%30===0);
    }throw Error('Narrativa não terminou');
  })()`);}
  await capture('00-abertura');await settle();await capture('01-inicio');
  for(const phase3 of [false,true]){
    for(let target=0;target<(phase3?16:22);target++){
      const result=await evaluate(`(()=>{
        const r=window.review.game.review,saved=r.saveManual();
        for(let delay=0;delay<240;delay++){
          r.restoreManual(saved);
          for(let f=0;f<delay;f++)r.frameManual(false);
          if(r.inspectManual().over)break;
          r.actionManual();
          for(let f=0;f<250;f++){
            r.frameManual(f%15===0);const s=r.inspectManual();
            if(s.over)break;
            if(s.baby.onGround){
              if(s.baby.currentPlatformIndex===${target})return {target:${target},phase3:${phase3},delay,frames:f+1,x:s.baby.x,y:s.baby.y};
              break;
            }
          }
        }
        throw Error('Sem continuação do percurso: alvo '+${target}+' fase3='+${phase3}+' origem='+JSON.stringify(saved.state.baby));
      })()`);
      report.push(result);console.log(JSON.stringify(result));
      await settle();
      await capture(`apoio-${phase3?'retorno':'ida'}-${target}`);
    }
    await evaluate(`(()=>{const r=window.review.game.review;if(${phase3})r.actionManual();for(let i=0;i<600;i++){const s=r.inspectManual();if(s.plot||s.portal||s.mode==='toy-room')return;r.frameManual(i%15===0);if(r.inspectManual().over)throw Error('Falha ao caminhar até o portal');}throw Error('Portal não iniciou');})()`);
    await settle();if(phase3)await evaluate('(()=>{for(let i=0;i<180;i++)window.review.game.review.frameManual(i===179);})()');await capture(phase3?'04-sala-brinquedos':'03-retorno');
  }
  assert.equal(await evaluate('window.review.game.isToyRoomMode()'),true,'Campanha alcançou a sala de brinquedos');
  const whole=await evaluate(`(async()=>{
    const room=window.review.game.review.roomManual();
    await Promise.all([room.battle.readyPromise,room.arena.readyPromise]);
    if(room.battle.error||room.arena.assetError)throw Error(room.battle.error||room.arena.assetError);
    const {runToyRoomQA}=await import('/tests/toy-room-qa-runner.js');
    const {runBattleGameplay}=await import('/tests/battle-gameplay-runner.js');
    const shots={},states=[],labels=new Set();let frames=0;
    const update=room.update.bind(room),render=room.render.bind(room);
    room.update=(...args)=>{update(...args);frames++;if(frames%30===0)states.push(room.snapshot());};
    room.render=(options={})=>{render(options);if(options.arenaBackdrop)return;
      const a=room.arena.state,s=room.battle.state;
      const label=a.status==='TRANSFORMING'?'transformacao':a.status==='RETURNING'?(a.realityRestored?'realidade':'retorno'):s?'arena-'+s.enemy.actor+'-'+(s.transition?'entrada':s.enemy.state==='ENRAGE'?'furia':s.attackTime>0?'ataque':s.enemy.state):room.player.carriedItem?'transporte':room.story.state.investigationStage;
      if(!labels.has(label)){labels.add(label);shots[label]=room.canvas.toDataURL().split(',')[1];}
    };
    room.render();const exploration=runToyRoomQA(room,{draw:true});
    const battle=runBattleGameplay(room,{draw:true,restore:true});
    for(let i=0;i<400;i++){room.update();if(i%15===0)room.render();}
    if(!room.arena.state.completed||room.battle.state||!room.story.state.arenaCompleted)throw Error('Retorno não concluiu.');
    const saved=room.snapshot();room.restore(saved);room.update();room.render();
    if(room.battle.state)throw Error('Save pós-retorno reiniciou arena.');
    return {exploration,battle,states,final:room.snapshot(),shots,frames};
  })()`);
  for(const [name,data]of Object.entries(whole.shots)){
    const raw=Buffer.from(data,'base64');await fs.writeFile(directory+'/'+name+'.png',raw);
    signatures.push({name,sha256:hash(raw),bytes:raw.length});
  }
  delete whole.shots;
  const sources=await evaluate('[...window.__refactSources].sort()');
  const errors=await evaluate('window.__refactErrors');assert.deepEqual(errors,[]);
  const statuses=await evaluate('[...window.review.game.assets.statuses]');assert.ok(statuses.every(([,s])=>s==='ready'));
  const result={profile,difficulty,report,signatures,assetFiles,sources,whole,statuses,errors};
  await fs.writeFile(directory+'/resultado.json',JSON.stringify(result,null,2)+'\n');
  if(process.env.REFACT_CAPTURE){await fs.writeFile(process.env.REFACT_CAPTURE,JSON.stringify(result));await fs.cp(directory,process.env.REFACT_CAPTURE+'.evidencias',{recursive:true});}
  console.log(JSON.stringify({perfil:profile,dificuldade:difficulty,apoios:report.length,imagens:signatures.length,assets:Object.keys(assetFiles).length,frames:whole.frames,exploracao:whole.exploration,combate:whole.battle,retorno:whole.final.toyRoomArena.status}));
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
