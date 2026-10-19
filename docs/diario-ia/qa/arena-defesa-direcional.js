import assert from 'node:assert/strict';
import {ArenaCamera} from '../../../src/js/toy-room/ArenaCamera.js';
import {ToyRoomBattle} from '../../../src/js/toy-room/ToyRoomBattle.js';
import {ARENA_ENEMIES} from '../../../src/js/toy-room/ArenaEnemies.js';
import {ARENA_TUNING,ArenaPlayerController} from '../../../src/js/toy-room/ArenaPlayerController.js';
import {arenaEnemyContact} from '../../../src/js/toy-room/ArenaCombatContact.js';
import {updateArenaPlayerAnimation,sampleArenaPlayerAnimation,createPlayerAnimation} from '../../../src/js/toy-room/ArenaPlayerAnimation.js';
import {calculateMobileUILayout,arenaMobileControlsLayout,arenaDirectionVector,hitArenaMobileControl} from '../../../src/js/ui/MobileUILayout.js';
function make(actor,side=1) {
 const room={player:{x:600,facing:side===1?'left':'right',animTime:0},keysDown:{},gamepadState:{},touchState:{},tutorial:{},furniture:[],clearInput(){this.keysDown={};},story:{state:{swordEquipped:true,attackElapsed:0},attack(){this.state.attackElapsed=18;this.state.attackDirection=room.player.facing==='left'?-1:1;return true;}}};
 const battle=new ToyRoomBattle(room,{loadAssets:false});battle.tuning=ARENA_TUNING;battle.playerController=new ArenaPlayerController();battle.presentation={enemies:ARENA_ENEMIES,enemyContact:arenaEnemyContact};battle.activate();battle.state.index=['train','robot','dinosaur','bear'].indexOf(actor);battle.spawn();battle.state.transition=null;room.player.x=600;battle.state.enemy.x=600+side*200;return battle;
}
for(const actor of ['train','robot','dinosaur','bear'])for(const side of [-1,1]) {
 const b=make(actor,side),s=b.state,e=s.enemy,r=b.room;
 // Nascer sobre a menina deve separar corpos sem retirar corações.
 e.x=r.player.x;e.state='IDLE';e.elapsed=0;b.update(1);
 assert.equal(s.player.hp,3,`${actor}: contato corporal não causa dano`);
 assert.ok(!s.history.some(x=>x.contact),'Nenhum evento de golpe por contato');
 for(const attack of ({train:['Steam Blast','Front Charge'],robot:['Laser Beam','Rocket Punch'],dinosaur:['Bite','Rush'],bear:['Bear Hug','Belly Charge','Toy Leap']})[actor]) {
  e.x=600+side*(b.getEnemyCollisionDistance(actor)+5);r.player.x=600;e.state='ATTACK';e.attack=attack;e.facing=-side;e.elapsed=attack==='Toy Leap'?84:54;e.landed=false;e.blocked=false;s.immunity=0;s.player.hp=3;s.hitPause=0;s.playerHitTime=0;s.attackTime=0;s.jump=0;s.jumpVelocity=0;
  r.keysDown={[side===1?'ArrowLeft':'ArrowRight']:true};b.update(.5);
  assert.equal(r.player.facing,side===1?'right':'left','Recuo mantém o rosto voltado ao inimigo');
  assert.equal(s.guarding,true,'Recuar no chão ativa defesa');
  assert.equal(s.player.hp,3,`${actor}/${attack}: defesa conserva vida`);
  assert.equal(e.blocked,true,`${actor}/${attack}: ataque bloqueado`);
  const count=s.history.filter(x=>x.event==='PLAYER_BLOCK').length;b.update(2);assert.equal(s.history.filter(x=>x.event==='PLAYER_BLOCK').length,count,'Um efeito por golpe');
 }
 const saved=b.snapshot();b.restore(saved);assert.equal(b.state.guarding,false,'Restore solta controle transitório');assert.equal(b.state.enemy.blocked,true,'Restore conserva golpe já bloqueado');
}
for(const actor of ['train','robot','dinosaur','bear']) {
 const b=make(actor),s=b.state,e=s.enemy;e.x=600+b.getEnemyCollisionDistance(actor)+5;e.state='ATTACK';e.attack=actor==='robot'?'Laser Beam':actor==='train'?'Steam Blast':actor==='dinosaur'?'Bite':'Belly Charge';e.elapsed=54;e.facing=-1;b.update(.5);
 assert.equal(s.player.hp,2,'Golpe ativo sem defesa continua causando dano: '+actor);
}
const b=make('robot');b.room.keysDown={ArrowLeft:true,ArrowUp:true};b.update(1);assert.ok(b.state.jump>0);assert.equal(b.state.guarding,false,'Diagonal para trás salta sem defender no ar');assert.equal(b.room.player.facing,'right');
b.room.keysDown={};b.room.player.x=b.state.enemy.x+200;b.faceEnemy();assert.equal(b.room.player.facing,'left','Trocar de lado atualiza a orientação');b.attack();assert.equal(b.room.story.state.attackDirection,-1,'Golpe aponta para o inimigo');
const state={mode:'BATTLE',jump:0,jumpVelocity:0,crouching:false,attackTime:0,playerHitTime:0,guarding:true,playerAnimation:createPlayerAnimation()},player={facing:'right'};
for(let i=0;i<12;i++){updateArenaPlayerAnimation(state,player,1);const sample=sampleArenaPlayerAnimation(state,player);assert.equal(sample.pose,'guard');assert.ok(Math.abs(sample.layers.reduce((sum,l)=>sum+l.weight,0)-1)<1e-8);assert.equal(sample.slash,null);}
assert.equal(state.playerAnimation.guardAmount,1);state.guarding=false;updateArenaPlayerAnimation(state,player,1);assert.ok(state.playerAnimation.guardAmount>0&&state.playerAnimation.guardAmount<1,'Saída não é instantânea');for(let i=0;i<12;i++)updateArenaPlayerAnimation(state,player,1);assert.equal(state.playerAnimation.pose,'idle');
for(const [width,height,scale]of [[320,568,1],[390,844,1],[844,390,1],[780,1688,2]]) {
 const layout=calculateMobileUILayout({width,height},{left:0,top:0,right:width,bottom:height},scale,true),c=arenaMobileControlsLayout(layout),p=c.dpad;
 assert.ok(p.x-p.hitRadius>=0&&p.y-p.hitRadius>=0&&p.x+p.hitRadius<=width&&p.y+p.hitRadius<=height,'Direcional cabe na área segura');
 assert.deepEqual(arenaDirectionVector(layout,p.x,p.y),{x:0,y:0});
 const diagonal=arenaDirectionVector(layout,p.x+50*c.unit,p.y-50*c.unit);assert.ok(diagonal.x>.18&&diagonal.y<-.18,'Diagonal combina avanço e salto');assert.equal(hitArenaMobileControl(layout,p.x+50*c.unit,p.y-50*c.unit),'dpad');
 const drag=arenaDirectionVector(layout,p.x-200*c.unit,p.y);assert.equal(drag.x,-1,'Arraste além da borda mantém intensidade limitada');
 assert.equal(hitArenaMobileControl(layout,c.sword.x,c.sword.y),'sword');assert.ok(c.sword.x-c.sword.width/2>p.x+p.hitRadius,'Ação e direcional não se sobrepõem');
}
console.log('APROVADO: contato sem dano nos quatro inimigos, defesa nos dois lados, dano ativo preservado, salto diagonal, orientação, save/load, entrada/saída animada e direcional em quatro tamanhos.');

const landscape=calculateMobileUILayout({width:844,height:390},{left:0,top:0,right:844,bottom:390},1,true);
const camera=new ArenaCamera(),mobileRoom={mobilePresentation:true,player:{x:430}},combat={enemy:{x:1120,actor:'train'},jump:0};
const frame=camera.frame(landscape,mobileRoom,combat),controls=arenaMobileControlsLayout(landscape);
assert.ok(frame.left>controls.dpad.x+controls.dpad.hitRadius&&frame.right<controls.sword.x-controls.sword.width/2,'Enquadramento em paisagem reserva os dois conjuntos de controles');
assert.ok(frame.envelope.left*frame.scale+frame.ox>=frame.left&&frame.envelope.right*frame.scale+frame.ox<=frame.right,'Atores cabem entre os controles');
