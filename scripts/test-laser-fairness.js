import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PNG } from 'pngjs';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';
import { BATTLE_PLAYER_BOUNDS } from '../src/js/toy-room/BattlePlayerBounds.js';
import { battlePlayerFrame, laserProjection, battlePlayerJumpOffset } from '../src/js/toy-room/BattlePresentation.js';

function execute(distance, crouch, index, jump = 0) {
  const room = new ToyRoomPhase({ width: 960, height: 540, getContext: () => ({}), removeEventListener() {} },
    null, null, () => {}, { bindInputs: false });
  room.story.state.swordEquipped = true;
  room.update();
  room.battle.state.index = 1;
  room.battle.spawn();
  const state = room.battle.state, enemy = state.enemy;
  enemy.facing = index % 2 ? -1 : 1;
  enemy.attack = 'Laser Beam';
  room.battle.setEnemyState('ATTACK');
  enemy.elapsed = 53;
  room.player.x = enemy.x + enemy.facing * distance;
  room.player.facing = index % 3 ? 'right' : 'left';
  state.elapsed = index * 6;
  state.jump = jump;
  state.jumpVelocity = jump ? 0.3 : 0;
  state.crouching = crouch;
  room.keysDown = crouch ? { ArrowDown: true } : {};

  const frame = battlePlayerFrame(state, room.player, room.story.state.attackDirection);
  const sprite = PNG.sync.read(fs.readFileSync(`assets/art/toy-room/battle/${frame.file}`));
  const beam = laserProjection(state, room.player, enemy, room.story.state.attackDirection);
  const feetY = 690 - battlePlayerJumpOffset(state, room.player, room.story.state.attackDirection);
  const start = enemy.x + enemy.facing * beam.start, end = enemy.x + enemy.facing * beam.end;
  const minX = Math.min(start, end), maxX = Math.max(start, end);
  let visibleContact = false;
  for (let y = 0; y < frame.height && !visibleContact; y++) {
    for (let x = 0; x < frame.width; x++) {
      if (sprite.data[(y * frame.width + x) * 4 + 3] < 128) continue;
      const rowTop = feetY + (y - frame.anchorY) * frame.pixelHeight;
      const rowBottom = rowTop + frame.pixelHeight;
      const pixelA = room.player.x + frame.facing * (x - frame.anchorX) * frame.pixelHeight;
      const pixelB = pixelA + frame.facing * frame.pixelHeight;
      if (rowTop < 690 - beam.height + beam.halfHeight &&
          rowBottom > 690 - beam.height - beam.halfHeight &&
          Math.min(pixelA, pixelB) < maxX && Math.max(pixelA, pixelB) > minX) {
        visibleContact = true;
        break;
      }
    }
  }
  room.update();
  assert.equal(state.player.hp === 2, visibleContact,
    `Laser divergente: distância ${distance}, agachada ${crouch}, salto ${jump}, índice ${index}.`);
  room.destroy();
}

for (let i = 0; i < 100; i++) execute(50 + i * 2.4, false, i);
for (let i = 0; i < 100; i++) execute(50 + i * 2.4, true, i);
for (let i = 0; i < 100; i++) execute(i < 50 ? 340 + (i % 2 ? 0.02 : -0.02) : -35 + (i % 2 ? 0.02 : -0.02), false, i);
for (const jump of [60, 64.5, 65.1, 90]) for (let i = 0; i < BATTLE_PLAYER_BOUNDS.jump.length; i++) {
  execute(250, false, i, jump);
}
console.log('APROVADO: Laser Beam — 100 impactos em pé, 100 esquivas agachadas, 100 contatos de borda e amostras de salto; conteúdo alfa concorda com dano.');
