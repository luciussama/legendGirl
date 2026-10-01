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
const profile=process.argv[2]||'android';
const profiles={android:{width:390,height:844,mobile:true,ua:'Mozilla/5.0 (Linux; Android 14) Mobile'},
  iphone:{width:390,height:844,mobile:true,ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile'},
  desktop:{width:960,height:540,mobile:false,ua:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}};
assert.ok(profiles[profile],'Perfil de teste válido');
const device=profiles[profile];
const directory='assets/qa-testers/current-screenshots/percurso'+(profile==='android'?'':'/'+profile);
await fs.mkdir(directory,{recursive:true});
try {
  await send('Page.enable');await send('Runtime.enable');
  await send('Emulation.setUserAgentOverride',{userAgent:device.ua});
  await send('Emulation.setDeviceMetricsOverride',{width:device.width,height:device.height,deviceScaleFactor:1,mobile:device.mobile});
  await send('Page.navigate',{url:'http://127.0.0.1:3000/tests/dark-room-playthrough.html'});
  for(let i=0;i<200;i++){if(await evaluate('Boolean(window.review)'))break;await new Promise(r=>setTimeout(r,100));}
  await evaluate(`document.head.insertAdjacentHTML('beforeend','<meta name="viewport" content="width=device-width,initial-scale=1"><style>canvas{width:100vw;height:100dvh}p{display:none}</style>')`);
  await evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
  await evaluate('window.review.game.review.beginManual()');
  const report=[];
  async function capture(name){const {data}=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(`${directory}/${name}.png`,Buffer.from(data,'base64'));}
  async function settle(){return evaluate(`(()=>{
    const r=window.review.game.review;
    for(let i=0;i<5000;i++){
      const s=r.inspectManual();
      if(s.over)throw Error('Falha durante narrativa: '+JSON.stringify(s));
      if(s.mode==='toy-room')return s;
      if(s.standby||(s.plot&&s.plotStep>=4))r.actionManual();
      if(!s.opening&&!s.standby&&!s.transition&&!s.cutscene&&!s.plot&&!s.tutorial&&!s.portal)return s;
      r.frameManual(i%30===0);
    }throw Error('Narrativa não terminou');
  })()`);}
  await settle();await capture('01-inicio');
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
      if([9,21,15].includes(target))await capture(`apoio-${phase3?'retorno':'ida'}-${target}`);
    }
    await evaluate(`(()=>{const r=window.review.game.review;if(${phase3})r.actionManual();for(let i=0;i<600;i++){const s=r.inspectManual();if(s.plot||s.portal||s.mode==='toy-room')return;r.frameManual(i%15===0);if(r.inspectManual().over)throw Error('Falha ao caminhar até o portal');}throw Error('Portal não iniciou');})()`);
    await settle();if(phase3)await evaluate('(()=>{for(let i=0;i<180;i++)window.review.game.review.frameManual(i===179);})()');await capture(phase3?'04-sala-brinquedos':'03-retorno');
  }
  assert.equal(await evaluate('window.review.game.isToyRoomMode()'),true,'Campanha alcançou a sala de brinquedos');
  const toys=await evaluate(`(()=>{
    const room=window.review.game.review.roomManual(),events=[];
    const free=(x,y)=>{const p=room.resolveCollisions(x,y,24);return Math.abs(p.x-x)<0.1&&Math.abs(p.y-y)<0.1;};
    const walk=(tx,ty,radius)=>{
      const start=[Math.round(room.player.x/20),Math.round(room.player.y/20)],key=p=>p.join(',');
      const queue=[start],seen=new Map([[key(start),null]]);let end;
      for(let i=0;i<queue.length;i++){
        const p=queue[i];if(Math.hypot(p[0]*20-tx,p[1]*20-ty)<radius){end=p;break;}
        for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
          const n=[p[0]+dx,p[1]+dy];if(seen.has(key(n))||!free(n[0]*20,n[1]*20))continue;
          seen.set(key(n),p);queue.push(n);
        }
      }
      if(!end)throw Error('Sem caminho até '+tx+','+ty);
      const path=[];for(let p=end;p;p=seen.get(key(p)))path.unshift(p);
      for(const [gx,gy] of path)for(let f=0;f<100;f++){
        const dx=gx*20-room.player.x,dy=gy*20-room.player.y,d=Math.hypot(dx,dy);if(d<2)break;
        if(f===99)throw Error('Movimento bloqueado');
        room.touchState.active=true;room.touchState.vectorX=dx/Math.max(d,4);room.touchState.vectorY=dy/Math.max(d,4);
        room.update(1);if(f%10===0)room.render();
      }
      room.touchState.active=false;room.update(1);
    };
    for(const toy of room.toys){
      walk(toy.x,toy.y,60);room.lastActionTime=-10000;room.triggerAction();
      if(!room.player.carriedItem)throw Error('Não pegou o brinquedo '+toy.id);
      const chest=room.furniture.find(f=>f.id==='toy-chest');
      walk(chest.x+chest.w/2,chest.y+chest.h/2,130);room.lastActionTime=-10000;room.triggerAction();
      if(!toy.isOrganized)throw Error('Não guardou '+toy.id);events.push(toy.id);
    }
    room.render();if(!room.victoryBannerActive)throw Error('Vitória não ativou');return events;
  })()`);
  await capture('05-sala-concluida');
  await fs.writeFile(`${directory}/brinquedos.json`,JSON.stringify(toys,null,2)+'\n');
  await fs.writeFile(`${directory}/percurso.json`,JSON.stringify(report,null,2)+'\n');
  console.log('Percurso completo aprovado: 38 apoios, portais e 8 brinquedos guardados — '+profile+'.');
}finally{ws.close();}
