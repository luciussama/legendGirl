import assert from 'node:assert/strict';
import {createAudioSystem} from '../../../src/js/audio.js';
import {ArenaAudioProfile} from '../../../src/js/toy-room/ArenaAudioProfile.js';
import {ToyRoomPhase} from '../../../src/js/toy-room/ToyRoomPhase.js';
import {ARENA_TUNING} from '../../../src/js/toy-room/ArenaPlayerController.js';
class AudioElement {constructor(src){this.src=src;this.currentTime=0;this.volume=1;this.paused=true;this.pauses=0;this.loads=0;}addEventListener(){}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;this.pauses++;}load(){this.loads++;}}
globalThis.Audio=AudioElement;
const audio=createAudioSystem();audio.startToyRoomMusic();audio.setToyRoomMusicTrack('sword');
const element=audio.getToyRoomAudioElement();element.currentTime=37;const src=element.src,loads=element.loads,pauses=element.pauses;
const profile=new ArenaAudioProfile(audio);profile.transform();profile.enter();profile.update(48);
assert.equal(element.src,src);assert.equal(element.currentTime,37);assert.equal(element.loads,loads);assert.equal(element.pauses,pauses);assert.equal(element.paused,false);
assert.ok(Math.abs(element.volume-.58*1.4)<1e-9,'Volume intensificado sem troca de faixa');
audio.setMuted(true);assert.equal(element.volume,0);profile.enter();assert.equal(element.volume,0);audio.setMuted(false);
audio.setMasterVolume(.5);assert.ok(Math.abs(element.volume-.58*1.4*.5)<1e-9,'Volume escolhido preservado');
profile.leave({resume:false});assert.ok(Math.abs(element.volume-.58*.5)<1e-9);
const makeRoom=()=>new ToyRoomPhase({width:960,height:540,getContext:()=>({}),removeEventListener(){}},null,null,()=>{},{bindInputs:false,arenaEnabled:true});
for(const dt of [.5,1,3])for(const actor of ['train','robot','dinosaur','bear']){
 const room=makeRoom();room.story.state.swordEquipped=true;for(let i=0;i<180;i++)room.update();
 const b=room.battle,s=b.state;while(s.transition)b.update();
 const e=s.enemy;e.actor=actor;e.hp=3;e.maxHp=4;e.state='WALK';e.elapsed=0;e.x=800;e.facing=-1;
 room.player.x=e.x-b.getEnemyCollisionDistance(actor)-1;s.immunity=0;
 b.update(1);assert.equal(s.player.hp,3,'Contato corporal não retira vida');
 e.state='ATTACK';e.attack=actor==='train'?'Steam Blast':actor==='robot'?'Laser Beam':actor==='dinosaur'?'Bite':'Bear Hug';e.elapsed=54;e.landed=false;e.blocked=false;e.facing=-1;
 const start=room.player.x;b.update(1);assert.ok(s.playerHitTime>0,'Golpe ativo causou dano');
 e.state='HIT';e.elapsed=-100;e.knockbackVelocity=0;
 while(s.playerHitTime>0)b.update(dt);
 assert.ok(Math.abs(Math.abs(room.player.x-start)-ARENA_TUNING.knockbackDistance)<5,'Menina recua dois passos');
 // Golpe real de espada com o inimigo ao alcance e sem contato corporal.
 s.immunity=100;s.cooldown=0;s.playerHitTime=0;s.playerKnockback=0;e.x=800;e.state='WALK';e.elapsed=0;
 room.player.x=650;room.player.facing='right';const before=e.x;
 let hitOrigin;const setState=b.setEnemyState.bind(b);b.setEnemyState=state=>{if(state==='HIT')hitOrigin=e.x;return setState(state);};
 assert.equal(b.attack(),true);for(let i=0;i<10&&e.state!=='HIT';i++)b.update(1);
 assert.equal(e.state,'HIT');const initial=hitOrigin;while(e.state==='HIT')b.update(dt);
 const travelled=e.x-initial;
 assert.ok(travelled>155&&travelled<180,'Inimigo recua cerca de dois passos: '+travelled);
 assert.ok(e.x-room.player.x>before-650,'Distância entre atores aumentou');room.destroy();
}
console.log('APROVADO: mesma faixa e posição de reprodução, intensidade/mudo/volume; recuo de dois passos da menina e quatro inimigos em três taxas de atualização.');
