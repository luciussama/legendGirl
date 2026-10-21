import assert from 'node:assert/strict';
import {ToyRoomBattle} from '../../../../src/js/toy-room/ToyRoomBattle.js';
import {ARENA_ENEMIES} from '../../../../src/js/toy-room/ArenaEnemies.js';
import {ARENA_TUNING,ArenaPlayerController} from '../../../../src/js/toy-room/ArenaPlayerController.js';
import {arenaEnemyContact} from '../../../../src/js/toy-room/ArenaCombatContact.js';
import {selectArenaEnemyAttack} from '../../../../src/js/toy-room/ArenaEnemyAI.js';
import {beginArenaPlayerAttack,updateArenaPlayerAnimation} from '../../../../src/js/toy-room/ArenaPlayerAnimation.js';
import {arenaDifficulty} from '../../../../src/js/toy-room/ArenaDifficulty.js';
function make(actor,corner=false,difficulty='NORMAL') {
 const r={player:{x:430,facing:'right',animTime:0},keysDown:{},gamepadState:{},touchState:{},tutorial:{},furniture:[],clearInput(){this.keysDown={};},story:{state:{swordEquipped:true,attackElapsed:0},attack(){if(this.state.attackElapsed>0)return false;this.state.attackElapsed=18;this.state.attackDirection=r.player.facing==='left'?-1:1;return true;}}};
 const b=new ToyRoomBattle(r,{loadAssets:false});b.tuning=arenaDifficulty(difficulty).tuning;b.playerController=new ArenaPlayerController();b.presentation={enemies:arenaDifficulty(difficulty).enemies,enemyContact:arenaEnemyContact,onSound(sound){if(sound==='player_attack')beginArenaPlayerAttack(b.state,r.story.state.attackDirection);},updateAnimation(dt){updateArenaPlayerAnimation(b.state,r.player,dt);}};b.activate();if(actor){b.state.index=['train','robot','dinosaur','bear'].indexOf(actor);b.spawn();b.state.transition=null;if(corner){b.state.enemy.x=1440-ARENA_ENEMIES[actor].bodyWidth/2;r.player.x=b.state.enemy.x-b.getEnemyCollisionDistance(actor);}}
 return b;
}
function play({actor,policy='smart',interval=1,dt=1,corner=false,offset=0,restore=false,difficulty='NORMAL'}){
 const b=make(actor,corner,difficulty);let f=offset;const counts={};
 for(;f<18000&&b.state.mode==='BATTLE';f+=dt){
 const s=b.state,e=s.enemy,p=b.room.player,side=e.x>=p.x?1:-1,range=b.getSwordRange(e.actor);
 b.room.keysDown={};if(!s.transition){
 const toward=side>0?'ArrowRight':'ArrowLeft';
 if(policy==='spam'){b.room.keysDown[toward]=true;if(Math.floor(f)%interval===0)b.attack();}
 else {
 const contact=['Laser Beam','Rocket Punch'].includes(e.attack);
 if(Math.abs(e.x-p.x)>Math.min(range-12,b.getEnemyCollisionDistance(e.actor)+25))b.room.keysDown[toward]=true;
 if(e.state==='ATTACK'){
 const end=e.attack==='Toy Leap'?96:72;
 if(contact&&e.elapsed<end)b.room.keysDown.ArrowDown=true;
 if(!contact){const jumpAt=e.attack==='Toy Leap'?48:24;if(e.elapsed>=jumpAt&&e.elapsed<jumpAt+5&&s.jump===0)b.room.keysDown.ArrowUp=true;}
 if(e.elapsed>=end&&s.jump<85)b.attack();
 }else if(e.state!=='HIT'&&e.state!=='ENRAGE'&&Math.abs(e.x-p.x)<range-5&&s.jump<85)b.attack();
 }
 }
 b.update(dt);if(restore&&Math.floor(f)%97===0){const saved=b.snapshot();b.restore(saved);}
 }
 for(const a of ['train','robot','dinosaur','bear'])counts[a]={acertos:b.state.history.filter(x=>x.event==='PLAYER_HIT'&&x.enemy===a).length,danos:b.state.history.filter(x=>x.event==='ENEMY_HIT'&&x.enemy===a).length,bloqueios:b.state.history.filter(x=>x.event==='SWORD_BLOCKED'&&x.enemy===a).length};
 return {actor,policy,interval,dt,corner,offset,restore,resultado:b.state.mode,hp:b.state.player.hp,segundos:+((f-offset)/60).toFixed(2),counts};
}


for(const difficulty of ['NORMAL','EASY'])for(const dt of [.5,1,3])for(const actor of [undefined,'robot','dinosaur','bear']){
 const r=play({difficulty,dt,actor,restore:true});console.log(JSON.stringify({...r,difficulty}));assert.equal(r.resultado,'VICTORY','Esquiva e contra-ataque vencem nos dois modos');
}
for(const actor of ['train','robot','dinosaur','bear']){const n=make(actor),e=make(actor,false,'EASY');assert.ok(Math.abs(e.getSwordRange(actor)/n.getSwordRange(actor)-1.3)<1e-8);}
console.log('APROVADO: 24 percursos de arena com save/restore; alcance efetivo cresce 30% contra os quatro inimigos.');
