// Diagnóstico de correspondência visual; não altera colisões, HP ou balanceamento.
import fs from 'node:fs/promises';
import { rocketPunchProjection, BATTLE_CROUCH_FRAME, BATTLE_LASER_HEIGHT } from '../src/js/toy-room/BattlePresentation.js';
import { PNG } from 'pngjs';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';
import { OFFICIAL_FRAMES } from '../src/js/assets/officialCharacter.js';
import { BATTLE_PLAYER_VISUAL_SCALE } from '../src/js/toy-room/ToyRoomBattle.js';
const root = 'assets/art/toy-room/battle';
const manifest = JSON.parse(await fs.readFile(`${root}/remediation/manifest.json`, 'utf8'));
const reference = manifest.actors.robot.animations.Idle.frames[0];
const rocket = manifest.actors.robot.animations['Rocket Punch'].frames[3];
const png = PNG.sync.read(await fs.readFile(`${root}/${rocket.file}`));
let right = 0;
for (let y = 0; y < png.height; y++) for (let x = 0; x < png.width; x++)
  if (png.data[(y * png.width + x) * 4 + 3] >= 128) right = Math.max(right, x);
const factor = rocket.displayScale * 100 / ((reference.height - 24) * reference.displayScale);
const originalExtent = (right - rocket.anchor.x) * factor;
const projection = rocketPunchProjection(rocket,reference,54,250);
const rocketExtent = projection.tip;
const baseline = JSON.parse(await fs.readFile(`${root}/polish/baseline-manifest.json`, 'utf8'));
const oldRocket = baseline.actors.robot.animations['Rocket Punch'].frames[3];
const oldPNG = PNG.sync.read(await fs.readFile(`${root}/${oldRocket.file}`));
let oldRight = 0;
for (let y = 0; y < oldPNG.height; y++) for (let x = 0; x < oldPNG.width; x++)
  if (oldPNG.data[(y * oldPNG.width + x) * 4 + 3] >= 128) oldRight = Math.max(oldRight, x);
const baselineExtent = (oldRight - oldRocket.anchor.x) * oldRocket.displayScale * 100 / ((reference.height - 24) * reference.displayScale);
const idle = OFFICIAL_FRAMES.idle[0];
const playerHalfWidth = idle.w / 2 * (80 / 50 + 1 / idle.h) * BATTLE_PLAYER_VISUAL_SCALE;
const room = new ToyRoomPhase({ width: 960, height: 540, getContext: () => ({}), removeEventListener() {} }, null, null, () => {}, { bindInputs: false });
room.story.state.swordEquipped = true; room.update();
room.battle.state.index = 1; room.battle.spawn();
const enemy = room.battle.state.enemy;
enemy.attack = 'Rocket Punch'; room.battle.setEnemyState('ATTACK'); enemy.elapsed = 53;
room.player.x = enemy.x - 250; room.update();
const crouch = BATTLE_CROUCH_FRAME;
const crouchScale = crouch.displayHeight / crouch.h;
const official = PNG.sync.read(await fs.readFile(`${root}/${crouch.file}`));
const laserHeight = BATTLE_LASER_HEIGHT;
const row = Math.floor(crouch.y + crouch.h - laserHeight / crouchScale);
let intersectingPixels = 0;
if (row >= crouch.y && row < crouch.y + crouch.h) for (let x = crouch.x; x < crouch.x + crouch.w; x++)
  if (official.data[(row * official.width + x) * 4 + 3] >= 128) intersectingPixels++;
room.battle.state.player.hp = 3; room.battle.state.immunity = 0;
enemy.attack = 'Laser Beam'; enemy.landed = false; room.battle.setEnemyState('ATTACK'); enemy.elapsed = 53;
room.keysDown = { ArrowDown: true }; room.update();
const result = {
  scale: BATTLE_PLAYER_VISUAL_SCALE,
  rocket: { frame: rocket.file, distance: 250, visibleExtent: rocketExtent, baselineVisibleExtent: baselineExtent,
    playerHalfWidth, visibleGap: 250 - playerHalfWidth - rocketExtent,
    hpAfterAttack: room.battle.state.history.find(e => e.event === 'ENEMY_HIT')?.playerHp,
    originalExtent, result: rocketExtent + playerHalfWidth >= 250 && room.battle.state.history.find(e => e.event === 'ENEMY_HIT')?.playerHp === 2 ? 'PASS' : 'MISMATCH' },
  laser: { beamHeight: laserHeight, crouchHeight: crouch.h * crouchScale,
    intersectingPixels, hpAfterCrouch: room.battle.state.player.hp,
    result: intersectingPixels === 0 && room.battle.state.player.hp === 3 ? 'PASS' : 'MISMATCH' }
};
console.log(JSON.stringify(result, null, 2));
if (process.argv.includes('--write')) await fs.writeFile('docs/battle-mode/hitbox-fairness-evidence.json', JSON.stringify(result, null, 2) + '\n');
room.destroy();
if (process.argv.includes('--strict') && [result.rocket, result.laser].some(item => item.result === 'MISMATCH')) process.exitCode = 1;
