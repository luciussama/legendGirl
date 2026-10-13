import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PNG} from 'pngjs';
import {ToyRoomPhase} from '../src/js/toy-room/ToyRoomPhase.js';
import {battleAnimationFrame} from '../src/js/toy-room/ToyRoomBattle.js';
import {BATTLE_PLAYER_BOUNDS} from '../src/js/toy-room/BattlePlayerBounds.js';

const root = 'assets/art/toy-room/battle/';
const manifest = JSON.parse(fs.readFileSync(`${root}remediation/manifest.json`, 'utf8'));

function inspect(distance) {
  const room = new ToyRoomPhase({width:960,height:540,getContext:()=>({}),removeEventListener(){}},null,null,()=>{},{bindInputs:false});
  room.story.state.swordEquipped = true;
  room.update();
  room.battle.state.index = 3;
  room.battle.spawn();
  const {state} = room.battle, enemy = state.enemy;
  enemy.facing = 1;
  room.player.x = enemy.x + distance;
  room.player.facing = 'left';
  enemy.attack = 'Toy Leap';
  room.battle.setEnemyState('ATTACK');
  enemy.elapsed = 83;
  state.elapsed = -1;
  room.update();

  const animation = manifest.actors.bear.animations['Toy Leap'];
  const frame = animation.frames[battleAnimationFrame(animation, enemy, 108)];
  const reference = manifest.actors.bear.animations.Idle.frames[0];
  const image = PNG.sync.read(fs.readFileSync(root + frame.file));
  let edge = 0;
  for (let y = 0; y < image.height; y++) for (let x = 0; x < image.width; x++) {
    if (image.data[(y * image.width + x) * 4 + 3] >= 128) edge = Math.max(edge, x + 1);
  }
  const scale = frame.displayScale * 130 / ((reference.height - 24) * reference.displayScale);
  const body = BATTLE_PLAYER_BOUNDS.idle[0];
  const girlNearEdge = -Math.max(...body.rows.filter(Boolean).map(row => row[1]));
  const visibleGap = distance + girlNearEdge - (edge - frame.anchor.x) * scale;
  const result = {distance, playerHp:state.player.hp, visibleGap, impactEffectRendered:Boolean(state.impact)};
  room.destroy();
  return result;
}

const beyondVisibleReach = inspect(154.9);
const withinVisibleReach = inspect(110);
assert.equal(beyondVisibleReach.playerHp, 3, 'Toy Leap não deve causar dano além do alcance visível.');
assert.ok(beyondVisibleReach.visibleGap > 0, 'O caso de borda precisa manter separação visual positiva.');
assert.equal(withinVisibleReach.playerHp, 2, 'Toy Leap deve causar dano quando os sprites se sobrepõem.');
const report = {
  attack:'Toy Leap',
  beyondVisibleReach,
  withinVisibleReach,
  result:'PASS'
};
fs.mkdirSync('docs/battle-mode/certification-evidence/DEFECT-008',{recursive:true});
fs.writeFileSync('docs/battle-mode/certification-evidence/DEFECT-008/toy-leap-contact.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
