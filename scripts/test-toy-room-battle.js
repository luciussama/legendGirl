import assert from 'node:assert/strict';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';
import { transferHeart, BATTLE_TUNING } from '../src/js/toy-room/ToyRoomBattle.js';
import { battlePlayerFrame } from '../src/js/toy-room/BattlePresentation.js';
import { runToyRoomQA } from '../tests/toy-room-qa-runner.js';
import { runBattleGameplay } from '../tests/battle-gameplay-runner.js';
const makeRoom = () => new ToyRoomPhase({width:960,height:540,getContext:()=>({})},null,null,()=>{}, {bindInputs:false});
const idleState={playerHitTime:0,attackTime:0,crouching:false,jump:0,jumpVelocity:0,isMoving:false,elapsed:0};
for(const [direction,expected] of [['left',1],['right',-1]]) {
  assert.equal(battlePlayerFrame(idleState,{facing:direction,isMoving:false},1).facing,expected,
    `A pose parada deve apontar para ${direction}.`);
}
assert.equal(battlePlayerFrame({...idleState,attackTime:12},{facing:'right'},1).facing,1,
  'A pose de ataque mantém sua orientação própria para a direita.');
assert.equal(battlePlayerFrame({...idleState,attackTime:12},{facing:'left'},-1).facing,-1,
  'A pose de ataque mantém sua orientação própria para a esquerda.');
for (const victimMax of [2,3,4]) for (const attackerMax of [2,3,4]) {
  const victim={hp:victimMax,maxHp:victimMax}, attacker={hp:attackerMax,maxHp:attackerMax};
  assert.ok(transferHeart(victim,attacker)); assert.equal(victim.hp,victimMax-1); assert.equal(attacker.hp,attackerMax);
  attacker.hp--; assert.ok(transferHeart(victim,attacker)); assert.equal(attacker.hp,attackerMax);
  victim.hp=0; assert.equal(transferHeart(victim,attacker),false);
}
for (const dt of [0.5,1,3]) {
  const room=makeRoom(); runToyRoomQA(room,{dt});
  console.log(JSON.stringify(runBattleGameplay(room,{dt,restore:true})));
}
const room=makeRoom(); room.story.state.swordEquipped=true; room.story.state.investigationStage='EQUIPPED'; room.update();
let returns=0;room.onReturnToTitle=()=>returns++;
// A menina fica no caminho do ataque real: sem manipular HP para testar derrota e cura do inimigo.
for(let i=0;i<3000 && room.battle.state.mode==='BATTLE';i++) {
  const e=room.battle.state.enemy; room.player.x=e.x+e.facing*75; room.update();
}
assert.equal(room.battle.state.mode,'DEFEAT'); assert.equal(room.battle.state.player.hp,0);
assert.equal(room.battle.state.enemy.hp,2);
for(let i=0;i<100;i++)room.update();room.triggerAction();assert.equal(returns,1,'A derrota permite voltar ao título.');
const winner=makeRoom();winner.story.state.swordEquipped=true;winner.update();winner.onReturnToTitle=()=>returns++;
runBattleGameplay(winner);for(let i=0;i<100;i++)winner.update();winner.triggerAction();assert.equal(returns,2,'A vitória permite voltar ao título.');
const jump=makeRoom(); jump.story.state.swordEquipped=true; jump.update();
while(jump.battle.state.transition) jump.update();
jump.keysDown={ArrowUp:true}; jump.update(); assert.ok(jump.battle.state.jump>0);
for(let i=0;i<80;i++)jump.update(); assert.equal(jump.battle.state.jump,0,'Cima mantido não repete salto.');
jump.keysDown={ArrowDown:true}; jump.update(); assert.ok(jump.battle.state.crouching);
assert.equal(jump.player.y,BATTLE_TUNING.ground-28);
// Cada repertório é exercitado pela IA real; a fixture apenas escolhe o confronto inicial.
for(let index=0;index<4;index++) {
 const r=makeRoom(); r.story.state.swordEquipped=true;r.update();r.battle.state.index=index;r.battle.spawn();
 const attacks=new Set();
 for(let i=0;i<2000 && r.battle.state.mode==='BATTLE';i++) {
  const e=r.battle.state.enemy;
  if(e.attack)attacks.add(e.attack);
  const dx=e.x-r.player.x;r.keysDown=Math.abs(dx)>90?{[dx>0?'ArrowRight':'ArrowLeft']:true}:{};
  if(e.state==='ATTACK'&&e.elapsed>(e.attack==='Toy Leap'?60:25)&&e.elapsed<(e.attack==='Toy Leap'?90:55))r.keysDown.ArrowUp=true;
  r.update();
 }
 assert.equal(attacks.size,index===3?3:2,`Repertório incompleto no confronto ${index}.`);
 assert.equal(r.battle.state.mode,'BATTLE','A esquiva dos ataques deve permitir reação sem dano inevitável.');
}
const healing=makeRoom();healing.story.state.swordEquipped=true;healing.update();
while(healing.battle.state.transition) healing.update();
healing.battle.state.enemy.hp=1;healing.battle.state.player.hp=2;
healing.battle.state.enemy.attack='Steam Blast';healing.battle.setEnemyState('ATTACK');
healing.battle.state.enemy.elapsed=BATTLE_TUNING.windup-1;
healing.player.x=healing.battle.state.enemy.x-80;healing.update();
assert.equal(healing.battle.state.enemy.hp,2);assert.equal(healing.battle.state.player.hp,1);
const boss=makeRoom();boss.story.state.swordEquipped=true;boss.update();
boss.battle.state.index=3;boss.battle.spawn();boss.battle.state.enemy.hp=2;
boss.player.x=boss.battle.state.enemy.x-80;boss.player.facing='right';boss.triggerAction();
for(let i=0;i<5;i++)boss.update();
assert.equal(boss.battle.state.enemy.hp,1);
assert.ok(boss.battle.state.enemy.enrage,'O último coração ativa a fúria.');
const persisted=boss.snapshot();boss.restore(persisted);
for(let i=0;i<30;i++)boss.update();
assert.equal(boss.battle.state.enemy.hp,1,'Carregar o impacto não duplica dano.');
assert.equal(boss.battle.state.enemy.state,'ENRAGE');
console.log('APROVADO: percurso real, HP, limites, transferência, derrota, vitória, salto, agachamento, câmera e save/load.');
