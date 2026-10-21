import assert from 'node:assert/strict';
import {scan,attemptFrom} from '../fisica-janelas-saltos.js';
import {ToyRoomPhase} from '../../../../src/js/toy-room/ToyRoomPhase.js';
import {ARENA_ENEMIES} from '../../../../src/js/toy-room/ArenaEnemies.js';
import {ARENA_TUNING} from '../../../../src/js/toy-room/ArenaPlayerController.js';
const windows=[];
const regressions=[];
for(const dt of [.5,1,1.2])for(let x=260;x<280;x++){
 const normal=attemptFrom(1,false,x,dt,'NORMAL'),easy=attemptFrom(1,false,x,dt,'EASY');
 if(normal.landed===1&&easy.landed!==1)regressions.push({dt,x,normal,easy});
}
for(const phase3 of [false,true])for(let target=0;target<(phase3?16:22);target++){
 const normal=scan(target,phase3,undefined,1,'NORMAL'),easy=scan(target,phase3,undefined,1,'EASY');
 windows.push({phase3,target,normalMs:Math.round(normal.ms),easyMs:Math.round(easy.ms),extraMs:Math.round(easy.ms-normal.ms),normalPositions:normal.count,easyPositions:easy.count});
}
/** Compara simulações controladas; este diagnóstico não é o percurso de teclado em tempo real. */
function make(difficulty){const room=new ToyRoomPhase({width:960,height:540,getContext:()=>({}),addEventListener(){},removeEventListener(){}},null,null,null,{bindInputs:false,gameDifficulty:difficulty});
 room.story.state.swordEquipped=true;room.story.state.investigationStage='EQUIPPED';room.arena.start();room.battle.activate();return room;}
const pairs=[];
for(const policy of ['avancar-e-atacar','esquivar']){
 const rooms=[make('NORMAL'),make('EASY')];let frames=0;
 for(;frames<18000;frames++){
  for(const r of rooms){const b=r.battle,s=b.state,e=s.enemy;let attack=false;
   r.keysDown={};const distance=Math.abs(e.x-r.player.x),toward=e.x>=r.player.x?'ArrowRight':'ArrowLeft';
   if(policy==='avancar-e-atacar'){r.keysDown[toward]=true;attack=s.cooldown===0}
   else{if(distance>Math.min(b.getSwordRange()-12,b.getEnemyCollisionDistance(e.actor)+25))r.keysDown[toward]=true;
    if(e.state==='ATTACK'){const end=e.attack==='Toy Leap'?96:72,crouch=['Laser Beam','Rocket Punch'].includes(e.attack),jumpAt=e.attack==='Toy Leap'?48:24;
     if(crouch&&e.elapsed<end)r.keysDown.ArrowDown=true;if(!crouch&&e.elapsed>=jumpAt&&e.elapsed<jumpAt+14&&s.jump===0)r.keysDown.ArrowUp=true;
     attack=e.elapsed>=end&&!b.enemyGuarding()&&s.jump<85&&distance<b.getSwordRange()&&s.cooldown===0;
    }else attack=!['HIT','ENRAGE'].includes(e.state)&&s.jump<85&&distance<b.getSwordRange()-5&&s.cooldown===0;
   }
   if(attack)b.attack();r.story.update(1);r.arena.boss.update(1,b);b.update(1);
  }
  assert.deepEqual(rooms[0].battle.snapshot(),rooms[1].battle.snapshot(),'Estados da arena divergem entre NORMAL/EASY no quadro '+frames);
  assert.equal(rooms[0].player.x,rooms[1].player.x);
  if(rooms[0].battle.state.mode!=='BATTLE')break;
 }
 pairs.push({policy,frames:frames+1,result:rooms[0].battle.state.mode,hp:rooms[0].battle.state.player.hp,history:rooms[0].battle.state.history.filter(e=>['PLAYER_HIT','ENEMY_HIT','DEFEATED'].includes(e.event))});
 for(const r of rooms)r.destroy();
}
console.log('AUDITORIA',JSON.stringify({windows,regressions,arena:{tuning:ARENA_TUNING,enemies:ARENA_ENEMIES,pairs}}));
console.log('APROVADO: 38 janelas quantificadas por modo; arena comparada quadro a quadro com entradas iguais em NORMAL/EASY. Este é diagnóstico de simulação, separado da jogabilidade real.');
