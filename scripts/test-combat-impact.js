import assert from 'node:assert/strict';
import {ToyRoomPhase} from '../src/js/toy-room/ToyRoomPhase.js';

const soundsFor = room => room.audioEvents.map(entry => entry.sound);
function makeRoom() {
  const room = new ToyRoomPhase({width:960,height:540,getContext:()=>({}),removeEventListener(){}},null,null,()=>{},{bindInputs:false, arenaEnabled:false});
  room.audioEvents = [];
  room.audio = {playCombatSound:sound=>room.audioEvents.push({sound,frame:room.battle.state?.elapsed ?? 0})};
  room.story.state.swordEquipped = true;
  room.update();
  room.battle.state.transition = null;
  return room;
}

const playerAttack = makeRoom();
const {battle} = playerAttack, swordState = battle.state;
playerAttack.player.x = 1080;
playerAttack.player.facing = 'right';
assert.equal(battle.attack(),true);
assert.ok(soundsFor(playerAttack).includes('player_attack'));
for (let frame=0; frame<4; frame++) battle.update(1);
assert.equal(swordState.enemy.hp,1);
assert.equal(swordState.enemy.state,'HIT');
assert.deepEqual(swordState.history.filter(event=>event.event==='IMPACT').at(-1),
  {event:'IMPACT',target:'enemy',frame:4,heavy:false});
assert.equal(playerAttack.audioEvents.at(-3).sound,'train_hit');
assert.equal(playerAttack.audioEvents.at(-3).frame,4);
assert.equal(swordState.hitPause,1);
assert.equal(swordState.impact.elapsed,0);
const frameBeforePause = swordState.elapsed;
battle.update(1);
assert.equal(swordState.elapsed,frameBeforePause,'A pausa de impacto suspende a simulação por um quadro.');
playerAttack.destroy();

const trainHit = makeRoom();
const trainState = trainHit.battle.state, train = trainState.enemy;
train.facing=-1;
trainHit.player.x=train.x-80;
trainHit.battle.beginEnemyAttack('Steam Blast');
train.elapsed=53;
trainHit.battle.update(1);
assert.equal(trainState.player.hp,2);
assert.ok(soundsFor(trainHit).includes('train_steam'));
assert.ok(soundsFor(trainHit).includes('player_hit'));
assert.ok(trainState.history.some(event=>event.event==='IMPACT'&&event.target==='player'&&event.frame===1));
assert.equal(trainState.playerHitTime,18);
assert.equal(trainState.hitPause,1);
trainHit.destroy();

const bearHit = makeRoom();
const bearState = bearHit.battle.state;
bearState.index=3;
bearHit.battle.spawn();
const bear=bearState.enemy;
bear.facing=-1;
bearHit.player.x=bear.x-110;
bearHit.battle.beginEnemyAttack('Toy Leap');
bear.elapsed=83;
bearHit.battle.update(1);
assert.equal(bearState.player.hp,2);
assert.equal(bearState.hitPause,2,'Golpe do Urso recebe pausa maior sem criar atordoamento permanente.');
assert.equal(bearState.combatShake.strength,4);
assert.ok(soundsFor(bearHit).includes('bear_leap'));
assert.ok(soundsFor(bearHit).includes('bear_hit'));
bearHit.destroy();

const attacks = [
  ['Steam Blast','train_steam'],['Front Charge','train_charge'],
  ['Laser Beam','robot_laser'],['Rocket Punch','robot_punch'],
  ['Bite','dinosaur_bite'],['Rush','dinosaur_rush'],
  ['Bear Hug','bear_hug'],['Belly Charge','bear_charge'],['Toy Leap','bear_leap']
];
const signatures = makeRoom();
for (const [attack,sound] of attacks) {
  signatures.battle.beginEnemyAttack(attack);
  assert.equal(signatures.audioEvents.at(-1).sound,sound,`${attack} tem assinatura sonora própria.`);
}
signatures.battle.setEnemyState('ENRAGE');
assert.equal(signatures.audioEvents.at(-1).sound,'bear_enrage');
signatures.destroy();

console.log('APROVADO: sincronização de dano/áudio/reação, pausa, tremor, nove assinaturas de ataque e justiça visual de Toy Leap.');
