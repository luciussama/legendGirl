import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { battleAnimationFrame, BATTLE_TUNING } from '../src/js/toy-room/ToyRoomBattle.js';
const root = 'assets/art/toy-room/battle';
const before = JSON.parse(await fs.readFile(`${root}/polish/baseline-manifest.json`, 'utf8'));
const after = JSON.parse(await fs.readFile(`${root}/remediation/manifest.json`, 'utf8'));
const allowed = new Set(['robot/Rocket Punch', 'train/Steam Blast', 'robot/Laser Beam']);
for (const [actor, data] of Object.entries(before.actors)) for (const [name, old] of Object.entries(data.animations)) {
  const current = after.actors[actor].animations[name];
  if (!allowed.has(`${actor}/${name}`)) assert.deepEqual(current, old, `Alteração fora do passe autorizado: ${actor}/${name}`);
  assert.equal(current.frames.length, old.frames.length, 'A quantidade de poses não muda o tempo de reprodução.');
  assert.equal(current.loop, old.loop);
  assert.ok(current.frames.every((f, i) => f.displayScale === old.frames[i].displayScale), 'A escala do ator foi preservada.');
}
const animation = after.actors.dinosaur.animations.Rush;
const enemy = { actor: 'dinosaur', state: 'ATTACK', attack: 'Rush', elapsed: 0 };
const duration = BATTLE_TUNING.windup + BATTLE_TUNING.active + BATTLE_TUNING.recovery;
const timeline = Array.from({ length: duration }, (_, elapsed) => battleAnimationFrame(animation, { ...enemy, elapsed }, duration));
assert.deepEqual([...new Set(timeline)], [0, 1, 2, 3, 4, 5], 'As seis poses aparecem em ordem.');
const active = timeline.slice(BATTLE_TUNING.windup, BATTLE_TUNING.windup + BATTLE_TUNING.active);
assert.deepEqual([...new Set(active)], [2, 3], 'A investida alterna duas poses durante o deslocamento ativo.');
assert.equal(active.filter(frame => frame === 2).length, 9);
assert.equal(battleAnimationFrame(animation, { ...enemy, elapsed: duration }, duration), 5);
console.log('APROVADO: alterações isoladas de arte, escalas preservadas e progressão do Rush dentro das janelas originais.');
