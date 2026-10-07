// Instrumentação exclusiva de QA: usa a campanha real, sem atalhos na versão distribuída.
const output = document.getElementById('result');
const frame = document.getElementById('campaign');
const events = [];
const check = (condition, message) => { if (!condition) throw Error(message); };
const yieldFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
try {
  while (!frame.contentWindow.review) await yieldFrame();
  const {game} = frame.contentWindow.review, r = game.review;
  function settle() {
    for (let i=0;i<5000;i++) {
      const s=r.inspectManual();
      check(!s.over,'Falha durante a narrativa');
      if(s.mode==='toy-room')return;
      if(s.firstJump) {
        r.actionManual();
        for(let f=0;f<250;f++){r.frameManual();if(r.inspectManual().baby.onGround)break;}
        continue;
      }
      if(s.standby||(s.plot&&s.plotStep>=4))r.actionManual();
      if(!s.opening&&!s.standby&&!s.transition&&!s.cutscene&&!s.plot&&!s.tutorial&&!s.portal&&!s.toyIntro)return;
      r.frameManual(i%60===0);
    }
    throw Error('Narrativa não terminou');
  }
  function jumpTo(target, phase3) {
    const saved=r.saveManual();
    for(let delay=0;delay<240;delay++) {
      r.restoreManual(saved);
      for(let f=0;f<delay;f++)r.frameManual();
      if(r.inspectManual().over)break;
      r.actionManual();
      for(let f=0;f<250;f++) {
        r.frameManual();const s=r.inspectManual();
        if(s.over)break;
        if(s.baby.onGround) {
          if(s.baby.currentPlatformIndex===target)return {target,phase3,delay,frames:f+1};
          break;
        }
      }
    }
    throw Error(`Sem continuação até apoio ${target}, retorno=${phase3}`);
  }
  function walk(room, tx, ty, radius) {
    const free=(x,y)=>{const p=room.resolveCollisions(x,y,24);return Math.abs(p.x-x)<0.1&&Math.abs(p.y-y)<0.1;};
    const start=[Math.round(room.player.x/20),Math.round(room.player.y/20)],key=p=>p.join(',');
    const queue=[start],seen=new Map([[key(start),null]]);let end;
    for(let i=0;i<queue.length;i++) {
      const p=queue[i];if(Math.hypot(p[0]*20-tx,p[1]*20-ty)<radius){end=p;break;}
      for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const n=[p[0]+dx,p[1]+dy];if(seen.has(key(n))||!free(n[0]*20,n[1]*20))continue;
        seen.set(key(n),p);queue.push(n);
      }
    }
    check(end,'Sem caminho até brinquedo/caixa');
    const path=[];for(let p=end;p;p=seen.get(key(p)))path.unshift(p);
    for(const [gx,gy]of path)for(let f=0;f<100;f++) {
      const dx=gx*20-room.player.x,dy=gy*20-room.player.y,d=Math.hypot(dx,dy);if(d<2)break;
      check(f<99,'Movimento bloqueado');
      room.touchState.active=true;room.touchState.vectorX=dx/Math.max(d,4);room.touchState.vectorY=dy/Math.max(d,4);room.update(1);
    }
    room.touchState.active=false;room.update(1);
  }
  for(const difficulty of ['NORMAL','EASY']) {
    output.textContent=`Executando ${difficulty}: abertura e tutorial…`;
    await yieldFrame();
    r.beginManual();game.state.gameDifficulty=difficulty;
    settle();events.push({difficulty,etapa:'abertura e tutorial'});
    for(const phase3 of [false,true]) {
      for(let target=0;target<(phase3?16:22);target++) {
        const result=jumpTo(target,phase3);events.push({difficulty,...result});settle();
        if(target%5===0){output.textContent=`Executando ${difficulty}: apoio ${target}, retorno=${phase3}`;await yieldFrame();}
      }
      if(phase3)r.actionManual();
      for(let i=0;i<600;i++) {
        const s=r.inspectManual();if(s.plot||s.portal||s.mode==='toy-room')break;
        r.frameManual(i%60===0);check(!r.inspectManual().over,'Falha ao chegar ao portal');
        check(i<599,'Portal não iniciou');
      }
      settle();events.push({difficulty,etapa:phase3?'verdadeiro portal':'porta falsa'});
    }
    for(let i=0;i<180;i++)r.frameManual();
    check(game.isToyRoomMode(),'Toy Room deve ser alcançada');
    const room=r.roomManual();check(room.gameDifficulty===difficulty,'Mudança de fase conserva dificuldade');
    game.saveProgress();
    const saved=JSON.parse(frame.contentWindow.localStorage.getItem('legendGirl.campaign.v1'));
    check(saved.state.gameDifficulty===difficulty,'Save de produção conserva dificuldade');
    // Restaurar pelo start real também recria a sala usando a dificuldade salva.
    game.start(difficulty==='EASY'?'NORMAL':'EASY');
    check(r.roomManual().gameDifficulty===difficulty,'Restore real prevalece sobre escolha nova');
    const restoredRoom=r.roomManual();
    for(const toy of restoredRoom.toys) {
      walk(restoredRoom,toy.x,toy.y,60);restoredRoom.lastActionTime=-10000;restoredRoom.triggerAction();
      check(restoredRoom.player.carriedItem,'Coleta manual necessária');
      const chest=restoredRoom.furniture.find(f=>f.id==='toy-chest');
      walk(restoredRoom,chest.x+chest.w/2,chest.y+chest.h/2,130);restoredRoom.lastActionTime=-10000;restoredRoom.triggerAction();
      check(toy.isOrganized,`Brinquedo ${toy.id} deve ser guardado`);
    }
    check(restoredRoom.victoryBannerActive&&restoredRoom.organizedCount===8,'Progressão completa na Toy Room');
    events.push({difficulty,etapa:'Toy Room concluída; save/restore reais',brinquedos:8});
  }
  output.textContent='APROVADO: NORMAL e FÁCIL — abertura, tutorial, 38 apoios por modo, castelo, porta falsa, verdadeiro portal, Toy Room, save e restore. 8 brinquedos guardados por modo.\n'+JSON.stringify(events,null,2);
  document.body.dataset.result='passed';
} catch(error) {
  output.textContent='FALHA: '+error.stack+'\n'+JSON.stringify(events,null,2);
  document.body.dataset.result='failed';
}
