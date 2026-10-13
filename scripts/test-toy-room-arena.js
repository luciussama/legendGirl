import { arenaEnemyContact } from '../src/js/toy-room/ArenaCombatContact.js';
import { ARENA_ENEMIES } from '../src/js/toy-room/ArenaEnemies.js';
import { runBattleGameplay } from '../tests/battle-gameplay-runner.js';
import { arenaHUDLayout } from '../src/js/toy-room/ArenaHUD.js';
import { ArenaAudioProfile } from '../src/js/toy-room/ArenaAudioProfile.js';
import { ImpactFX } from '../src/js/toy-room/ImpactFX.js';
import { ARENA_TUNING } from '../src/js/toy-room/ArenaPlayerController.js';
import { BATTLE_TUNING } from '../src/js/toy-room/ToyRoomBattle.js';
import { ArenaCamera } from '../src/js/toy-room/ArenaCamera.js';
import { calculateMobileUILayout } from '../src/js/ui/MobileUILayout.js';
import { ARENA_SCALE, arenaActorBounds } from '../src/js/toy-room/ArenaScale.js';
import { BATTLE_GIRL_FRAMES } from '../src/js/toy-room/BattleGirlFrames.js';
import { ToyRoomArenaBuilder } from '../src/js/toy-room/ToyRoomArenaBuilder.js';
import assert from 'node:assert/strict';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';
import { ToyRoomArenaPhase } from '../src/js/toy-room/ToyRoomArenaPhase.js';
export const makeRoom = (options = {}, audio = null) => new ToyRoomPhase(
  { width: 960, height: 540, getContext: () => ({}), removeEventListener() {} },
  audio, null, () => {}, { bindInputs: false, arenaEnabled: false, ...options });
const room = makeRoom();
room.story.state.swordEquipped = true;
const arena = new ToyRoomArenaPhase(room);
assert.equal(arena.active, false);
assert.equal(arena.start(), true);
assert.equal(arena.start(), false, 'A entrada não pode duplicar a fase.');
assert.equal(arena.active, true);
assert.equal(room.battle.state, null);
for (let i = 0; i < 180; i++) arena.update();
assert.ok(room.battle.state);
assert.equal(arena.finish(), true);
assert.equal(arena.active, false);
assert.equal(room.battle.state, null);
assert.equal(arena.start(), false, 'A fase concluída não reinicia sozinha.');
console.log('APROVADO: inicialização e finalização da fase imaginária.');

const transforming = makeRoom({ arenaEnabled: true });
transforming.story.state.swordEquipped = true;
transforming.update();
assert.equal(transforming.arena.state.status, 'TRANSFORMING');
transforming.keysDown = { ArrowRight: true };
const x = transforming.player.x;
for (let i = 0; i < 60; i++) transforming.update();
assert.equal(transforming.player.x, x, 'A transformação bloqueia o movimento.');
const saved = transforming.snapshot();
const restored = makeRoom({ arenaEnabled: true }); restored.restore(saved);
assert.equal(restored.arena.state.elapsed, transforming.arena.state.elapsed);
for (let i = 0; i < 180; i++) restored.update();
assert.equal(restored.arena.state.status, 'COMBAT');
assert.ok(restored.battle.state);
console.log('APROVADO: transformação reproduzível e retomada sem travamento.');

const builder = new ToyRoomArenaBuilder(), original = JSON.stringify(room.furniture);
const built = builder.build(room);
assert.deepEqual(builder.build(room), built, 'O layout é determinístico.');
assert.equal(JSON.stringify(room.furniture), original, 'A sala original permanece intacta.');
assert.equal(built.structures.find(s => s.sourceId === 'bookshelf').role, 'fortaleza');
assert.equal(built.structures.find(s => s.sourceId === 'toy-chest').role, 'templo');
assert.ok(built.structures.every(s => [s.x,s.y,s.w,s.h].every(Number.isFinite) && s.w > 0 && s.h > 0));
assert.throws(() => builder.build({ furniture: [] }), /Referência obrigatória/);
console.log('APROVADO: arena derivada do layout sem mutar a sala.');

assert.ok(ARENA_SCALE.player >= 2 && ARENA_SCALE.player <= 3);
assert.ok(BATTLE_GIRL_FRAMES.idle.every(f => f.height >= 300), 'A arena usa quadros detalhados.');
const bounds = arenaActorBounds(430, 690);
assert.equal(bounds.bottom, 690); assert.equal(bounds.top, 490);
assert.ok(restored.battle.presentation.enemyScale >= 2);
assert.equal(restored.player.y, 662, 'A escala visual não altera o plano lógico.');
console.log('APROVADO: escala heroica e sprites detalhadas sem alteração das colisões.');

const camera = new ArenaCamera();
const cp = { x: 500 }, ce = { x: 900, actor: 'bear' };
for (let i = 0; i < 500; i++) camera.update(1, cp, ce);
const settled = camera.x; camera.update(1, cp, ce);
assert.ok(Math.abs(camera.x - settled) < 1e-6, 'Sem jitter em repouso.');
for (const [w,h,mobile] of [[960,540,false],[390,844,true],[844,390,true]]) {
  const layout = calculateMobileUILayout({}, {left:0,right:w,top:0,bottom:h},1,mobile);
  const f = camera.frame(layout, {player:cp,mobilePresentation:mobile}, {enemy:ce,jump:100});
  for (const x of [f.envelope.left, f.envelope.right]) assert.ok(x*f.scale+f.ox >= -1 && x*f.scale+f.ox <= w+1, 'Atores enquadrados.');
  assert.ok(f.envelope.top*f.scale+f.oy >= f.top-1, 'Cabeça sem clipping.');
  assert.ok(690*f.scale+f.oy <= f.bottom+1, 'Pés sem clipping.');
}
const copy = new ArenaCamera();copy.restore(camera.snapshot());assert.deepEqual(copy.snapshot(),camera.snapshot());
console.log('APROVADO: câmera suave, responsiva e sem clipping dos atores.');

const hero = makeRoom({arenaEnabled:true});hero.story.state.swordEquipped=true;
for(let i=0;i<305;i++)hero.update();
hero.keysDown={ArrowRight:true};const before=hero.player.x;hero.update();
assert.ok(Math.abs(hero.player.x-before-ARENA_TUNING.speed)<1e-8);
hero.keysDown={ArrowUp:true};hero.update();let high=0;
for(let i=0;i<100;i++){hero.update();high=Math.max(high,hero.battle.state.jump);}
assert.ok(high>150, 'Pulo heroico mais alto.');
assert.equal(BATTLE_TUNING.speed,4,'Configuração legado preservada.');
assert.equal(BATTLE_TUNING.swordRange,112);
console.log('APROVADO: física própria, corrida, salto e alcance sem mutação legado.');

const effects = new ImpactFX();for(let i=0;i<1000;i++)effects.emit('impact',400,650,true);
assert.ok(effects.particles.length<=80,'Orçamento de partículas limitado.');
const savedFX=effects.snapshot();const fxCopy=new ImpactFX();fxCopy.restore(savedFX);assert.deepEqual(fxCopy.snapshot(),savedFX);
effects.update(60);assert.equal(effects.particles.length,0);assert.equal(effects.flash,0);
hero.arena.fx.particles=[];hero.keysDown={};hero.battle.state.cooldown=0;hero.story.state.attackElapsed=0;
hero.triggerAction();assert.ok(hero.arena.fx.particles.some(p=>p.kind==='trail'),'Ataque real emite trilha.');
console.log('APROVADO: efeitos sincronizados, persistentes e com orçamento limitado.');

const audioEvents=[];const profile=new ArenaAudioProfile({setToyRoomMusicFade:v=>audioEvents.push(['fade',v]),playCombatSound:s=>audioEvents.push(['son',s]),stopToyRoomMusic:()=>audioEvents.push(['stop']),startToyRoomMusic:()=>audioEvents.push(['theme']),playArenaMusicBeat:b=>audioEvents.push(['beat',b]),stopArenaMusic:()=>audioEvents.push(['silence'])});
profile.transform();profile.enter();profile.update(48);profile.leave();profile.update(100);
assert.deepEqual(audioEvents.filter(e=>e[0]==='beat'),[['beat',0],['beat',1]]);
assert.ok(audioEvents.some(e=>e[0]==='stop'));assert.ok(audioEvents.some(e=>e[0]==='theme'));
assert.equal(audioEvents.at(-1)[1],1,'Volume restaurado ao retornar.');
console.log('APROVADO: trilha própria e troca de perfil sem timers órfãos.');

for (const [w,h] of [[320,568],[390,844],[844,390],[1920,1080]]) {
 const layout=calculateMobileUILayout({}, {left:8,right:w-8,top:12,bottom:h-12},1,true);
 const boxes=arenaHUDLayout(layout);
 for(const b of [boxes.player,boxes.enemy]) {assert.ok(b.width>0);assert.ok(b.x>=layout.safeLeft);assert.ok(b.x+b.width<=layout.safeRight);assert.ok(b.y+b.height<layout.action.y-layout.action.radius);}
 assert.ok(boxes.player.x+boxes.player.width<boxes.enemy.x,'Barras de vida não se sobrepõem.');
}
console.log('APROVADO: HUD heroico dentro da safe area e separado dos controles.');

for (const dt of [0.5,1,3]) {
 const r=makeRoom({arenaEnabled:true});r.story.state.swordEquipped=true;
 for(let i=0;i<Math.ceil(190/dt);i++)r.update(dt);
 assert.equal(r.battle.state.enemy.hp,ARENA_ENEMIES.train.hp);
 const result=runBattleGameplay(r,{dt,restore:true});assert.equal(result.result,'PASS');
 assert.deepEqual(result.order,['train','robot','dinosaur','bear']);
}
console.log('APROVADO: brinquedos heroicos derrotáveis em três taxas de atualização.');

const guardian=makeRoom({arenaEnabled:true});guardian.story.state.swordEquipped=true;
for(let i=0;i<190;i++)guardian.update();guardian.battle.state.index=3;guardian.battle.spawn();
guardian.player.x=guardian.battle.state.enemy.x-100;guardian.player.facing='right';
for(let i=0;i<1000&&guardian.battle.state.enemy.hp>4;i++){guardian.triggerAction();guardian.update();}
assert.ok(guardian.arena.boss.introduced);assert.equal(guardian.battle.state.enemy.maxHp,8);
guardian.update();assert.ok(guardian.battle.state.enemy.enrage,'A meia vida desperta o guardião.');
const checkpoint=guardian.snapshot();const resumed=makeRoom({arenaEnabled:true});resumed.restore(checkpoint);
assert.ok(resumed.arena.boss.introduced);assert.equal(resumed.battle.state.enemy.hp,guardian.battle.state.enemy.hp);
for(let i=0;i<2000&&resumed.battle.state.mode==='BATTLE';i++){const dx=resumed.battle.state.enemy.x-resumed.player.x;resumed.keysDown=Math.abs(dx)>100?{[dx>0?'ArrowRight':'ArrowLeft']:true}:{};resumed.player.facing=dx>0?'right':'left';resumed.triggerAction();resumed.update();}
assert.equal(resumed.battle.state.mode,'VICTORY');assert.equal(resumed.battle.state.history.filter(e=>e.event==='DEFEATED').at(-1).enemy,'bear');
console.log('APROVADO: chefe com fúria, efeitos, derrota e retomada sem softlock.');

const returning=makeRoom({arenaEnabled:true});const startPosition={x:returning.player.x,y:returning.player.y};
returning.story.state.swordEquipped=true;for(let i=0;i<190;i++)returning.update();runBattleGameplay(returning);
for(let i=0;i<400;i++)returning.update();
assert.equal(returning.arena.state.status,'COMPLETE');assert.equal(returning.battle.state,null);
assert.deepEqual({x:returning.player.x,y:returning.player.y},startPosition);
assert.equal(returning.organizedCount,returning.toys.length);assert.ok(returning.story.state.arenaCompleted);
for(let i=0;i<200;i++)returning.update();assert.equal(returning.battle.state,null,'Arena concluída não reinicia.');
returning.keysDown={ArrowRight:true};const realityX=returning.player.x;returning.update();assert.ok(returning.player.x>realityX,'Exploração volta a responder.');
console.log('APROVADO: retorno automático com posição, progresso e exploração preservados.');

const roundTrip = r => {
 const saved=JSON.parse(JSON.stringify(r.snapshot()));const copy=makeRoom({arenaEnabled:true});copy.restore(saved);
 assert.deepEqual(copy.arena.snapshot(),r.arena.snapshot(),'Checkpoint da arena reconstituído.');
 assert.equal(copy.organizedCount,r.organizedCount);assert.deepEqual(copy.toys,r.toys);
 if(r.battle.state)assert.equal(copy.battle.state.enemy.hp,r.battle.state.enemy.hp);
 return copy;
};
let persistent=makeRoom({arenaEnabled:true});roundTrip(persistent);
persistent.story.state.swordEquipped=true;persistent.update();for(let i=0;i<70;i++)persistent.update();persistent=roundTrip(persistent);
for(let i=0;i<110;i++)persistent.update();persistent=roundTrip(persistent);
while(persistent.battle.state.transition)persistent.update();persistent=roundTrip(persistent);
persistent.keysDown={ArrowRight:true};for(let i=0;i<40;i++)persistent.update();persistent.keysDown={};persistent.triggerAction();persistent.update();persistent=roundTrip(persistent);
runBattleGameplay(persistent,{restore:true});persistent=roundTrip(persistent);
while(persistent.arena.state.status!=='RETURNING')persistent.update();persistent=roundTrip(persistent);
for(let i=0;i<100;i++)persistent.update();persistent=roundTrip(persistent);
for(let i=0;i<90;i++)persistent.update();persistent=roundTrip(persistent);
assert.ok(persistent.arena.state.completed);assert.ok(persistent.story.state.arenaCompleted);
const beforeArena=makeRoom().snapshot();persistent.restore(beforeArena);assert.equal(persistent.arena.state.status,'IDLE','Restaurar save anterior limpa a arena concluída.');
const legacy=makeRoom();legacy.story.state.swordEquipped=true;legacy.update();const oldSave=legacy.snapshot();
const migrated=makeRoom({arenaEnabled:true});migrated.restore(oldSave);
assert.equal(migrated.arena.state.status,'COMBAT');assert.equal(migrated.battle.state.enemy.hp,oldSave.toyRoomBattle.enemy.hp);
runBattleGameplay(migrated);for(let i=0;i<400;i++)migrated.update();assert.equal(migrated.arena.state.status,'COMPLETE');
console.log('APROVADO: persistência de todos os estados, rollback e migração de saves antigos.');

assert.equal(arenaEnemyContact({jump:0,crouching:true},{attack:'Laser Beam'}),false);
assert.equal(arenaEnemyContact({jump:70,crouching:false},{attack:'Laser Beam'}),true,'Salto baixo ainda cruza o feixe visível.');
assert.equal(arenaEnemyContact({jump:155,crouching:false},{attack:'Laser Beam'}),false);
assert.equal(arenaEnemyContact({jump:160,crouching:false},{attack:'Rocket Punch'}),false);
console.log('APROVADO: esquivas concordam com a altura dos golpes heroicos.');

let enabled=true;const controls=makeRoom({arenaEnabled:true,isInputEnabled:()=>enabled});
controls.story.state.swordEquipped=true;for(let i=0;i<310;i++)controls.update();
controls.handleKeyDown({code:'ArrowRight'});const keyX=controls.player.x;controls.update();assert.ok(controls.player.x>keyX);
controls.handleKeyUp({code:'ArrowRight'});controls.canvas.getBoundingClientRect=()=>({left:0,top:0,width:960,height:540});
controls.onPointerDown({clientX:100,clientY:430,pointerId:1,pointerType:'touch'});
controls.onPointerMove({clientX:170,clientY:430,pointerId:1});const touchX=controls.player.x;controls.update();assert.ok(controls.player.x>touchX,'Joystick movimenta na arena.');
controls.onPointerUp({pointerId:1});
const navDescriptor=Object.getOwnPropertyDescriptor(globalThis,'navigator');
try {
 const buttons=Array.from({length:16},()=>({pressed:false,value:0}));
 const pad={index:0,connected:true,mapping:'standard',axes:[1,0],buttons};
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getGamepads:()=>[pad]}});
 const padX=controls.player.x;controls.update();assert.ok(controls.player.x>padX,'Gamepad movimenta na arena.');
 buttons[2].pressed=true;const oldEvents=controls.battle.state.history.filter(e=>e.event==='SOUND'&&e.sound==='player_attack').length;
 controls.update();controls.update();assert.equal(controls.battle.state.history.filter(e=>e.event==='SOUND'&&e.sound==='player_attack').length,oldEvents+1,'Botão mantido não repete ataque.');
 enabled=false;controls.update(0);const paused=controls.snapshot();controls.update(3);assert.deepEqual(controls.snapshot(),paused,'Pausa preserva transformação e simulação.');assert.equal(controls.touchState.active,false);
} finally {if(navDescriptor)Object.defineProperty(globalThis,'navigator',navDescriptor);else delete globalThis.navigator;}
const loser=makeRoom({arenaEnabled:true});loser.story.state.swordEquipped=true;for(let i=0;i<310;i++)loser.update();
for(let i=0;i<3000&&loser.battle.state.mode==='BATTLE';i++){const dx=loser.battle.state.enemy.x-loser.player.x;loser.keysDown=Math.abs(dx)>60?{[dx>0?'ArrowRight':'ArrowLeft']:true}:{};loser.update();}
assert.equal(loser.battle.state.mode,'DEFEAT');for(let i=0;i<100;i++)loser.update();loser.triggerAction();assert.equal(loser.battle.state.mode,'BATTLE');assert.equal(loser.battle.state.player.hp,3,'Derrota permite nova tentativa sem softlock.');
console.log('APROVADO: teclado, joystick, gamepad, pausa e nova tentativa na arena.');

for(let index=0;index<4;index++) {
 const fighter=makeRoom({arenaEnabled:true});fighter.story.state.swordEquipped=true;for(let i=0;i<190;i++)fighter.update();
 fighter.battle.state.index=index;fighter.battle.spawn();const attacks=new Set();
 for(let frame=0;frame<3000&&fighter.battle.state.mode==='BATTLE';frame++){
  const e=fighter.battle.state.enemy;if(e.attack)attacks.add(e.attack);
  const dx=e.x-fighter.player.x;fighter.keysDown=Math.abs(dx)>95?{[dx>0?'ArrowRight':'ArrowLeft']:true}:{};
  if(e.state==='ATTACK'&&e.elapsed>(e.attack==='Toy Leap'?60:25)&&e.elapsed<(e.attack==='Toy Leap'?90:55))fighter.keysDown.ArrowUp=true;
  fighter.update();
 }
 assert.equal(attacks.size,index===3?3:2,`Repertório heroico completo: ${index}.`);
 assert.equal(fighter.battle.state.mode,'BATTLE','Todos os golpes heroicos permitem esquiva e reação.');
}
console.log('APROVADO: repertórios heroicos completos, com esquivas reais da nova física.');
