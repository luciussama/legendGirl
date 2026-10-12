import assert from 'node:assert/strict';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';
import { toyRoomEntities } from '../src/js/toy-room/ToyRoomEntities.js';
import { babyRenderer } from '../src/js/entities/BabyRenderer.js';
import { toyRenderer } from '../src/js/toy-room/ToyRenderer.js';

let axes = [0, 0];
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
  getGamepads: () => [{ index: 0, connected: true, mapping: 'standard', axes, buttons: [] }]
} });
const createPhase = () => {
  const canvas = { width: 960, height: 540, getContext: () => ({}), addEventListener() {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 960, height: 540 }) };
  const phase = new ToyRoomPhase(canvas, null, null, null, { bindInputs: false });
  phase.tutorial.active = false;
  phase.toyRoomTutorialCompleted = true;
  phase.player.x = 700;
  phase.player.y = 700;
  return phase;
};
const vectors = [[-1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1],
  [1, 0], [0, -1], [0, 1], [1, -1], [1, 1]];
const originalPose = babyRenderer.renderPose;
const originalToy = toyRenderer.renderToy;
const poses = [];
babyRenderer.renderPose = (...args) => poses.push({ pose: args[2], facing: args[7] });
toyRenderer.renderToy = () => {};
const scales = [], hands = [];
const ctx = new Proxy({ scale: (x, y) => scales.push([x, y]),
  lineTo: (x, y) => hands.push([x, y]) }, { get: (target, key) => target[key] ?? (() => {}) });
try {
  for (const device of ['teclado', 'joystick', 'gamepad']) {
    axes = [0, 0];
    const phase = createPhase();
    const input = (x, y) => {
      phase.keysDown = {};
      axes = [0, 0];
      if (phase.touchState.active) phase.onPointerUp({ pointerId: 1 });
      if (device === 'teclado') {
        if (x) phase.handleKeyDown({ code: x < 0 ? 'ArrowLeft' : 'ArrowRight' });
        if (y) phase.handleKeyDown({ code: y < 0 ? 'ArrowUp' : 'ArrowDown' });
      } else if (device === 'gamepad') axes = [x, y];
      else if (x || y) {
        phase.onPointerDown({ pointerId: 1, pointerType: 'touch', clientX: 200, clientY: 300 });
        phase.onPointerMove({ pointerId: 1, clientX: 200 + x * 60, clientY: 300 + y * 60 });
      }
      phase.update(1);
    };
    let expectedFacing = 'right';
    for (const [x, y] of vectors) {
      input(x, y);
      if (x) expectedFacing = x < 0 ? 'left' : 'right';
      assert.equal(phase.player.facing, expectedFacing, `${device}: orientação em (${x}, ${y}).`);
      const actualX = device === 'joystick' ? phase.touchState.vectorX : x;
      const actualY = device === 'joystick' ? phase.touchState.vectorY : y;
      const expectedDirection = Math.abs(actualX) > Math.abs(actualY)
        ? (actualX < 0 ? 'left' : 'right') : (actualY < 0 ? 'up' : 'down');
      assert.equal(phase.player.direction, expectedDirection,
        `${device}: direção lógica independente.`);
      toyRoomEntities.renderPlayer(ctx, phase.player);
      assert.deepEqual(poses.at(-1), { pose: 'run', facing: expectedFacing === 'left' ? -1 : 1 });
      input(0, 0);
      assert.equal(phase.player.facing, expectedFacing, `${device}: repouso preserva orientação.`);
      toyRoomEntities.renderPlayer(ctx, phase.player);
      assert.equal(poses.at(-1).pose, 'idle');
      assert.equal(poses.at(-1).facing, expectedFacing === 'left' ? -1 : 1);
    }
    for (const sign of [-1, 1]) {
      input(sign, 0); input(0, 0); input(0, -1);
      assert.equal(phase.player.facing, sign < 0 ? 'left' : 'right', `${device}: horizontal → repouso → cima.`);
      const loaded = createPhase();
      loaded.restore(JSON.parse(JSON.stringify(phase.snapshot())));
      assert.equal(loaded.player.facing, phase.player.facing, 'Save/load preserva orientação vertical.');
      assert.equal(loaded.player.direction, 'up');
      phase.player.carriedItem = phase.toys[0];
      phase.player.carriedItem.isCarried = true;
      toyRoomEntities.renderPlayer(ctx, phase.player);
      assert.equal(poses.at(-1).facing, sign, 'Carregamento usa a mesma orientação do sprite.');
      assert(scales.some(([x, y]) => x === sign && y === 1));
      const toy = phase.player.carriedItem;
      phase.lastActionTime = -Infinity;
      phase.triggerAction();
      assert.equal(toy.x, phase.player.x + sign * 42, 'Soltura ocorre à frente da orientação visual.');
      assert.equal(toy.y, phase.player.y);
      phase.story.state.swordEquipped = true;
      phase.story.state.attackElapsed = 0;
      hands.length = 0;
      phase.story.renderHeldObject(ctx);
      assert.equal(hands[0][0], phase.player.x + sign * 24, 'Espada em repouso acompanha o sprite.');
      assert(phase.story.attack());
      assert.equal(phase.story.state.attackDirection, sign, 'Ataque acompanha orientação preservada.');
      phase.story.attackFrames = Array(8).fill({});
      scales.length = 0;
      assert(phase.story.renderAttackSprite(ctx));
      assert.equal(scales.some(([x]) => x === -1), sign < 0, 'Animação do ataque orientada corretamente.');
      phase.story.state.attackElapsed = 0;
      phase.story.state.swordEquipped = false;
    }
  }
  for (const [facing, angle, expected] of [['up', -Math.PI / 2, 'right'],
    ['up', -3 * Math.PI / 4, 'left'], ['left', Math.PI, 'left']]) {
    const phase = createPhase();
    const saved = phase.snapshot();
    delete saved.player.direction;
    saved.player.facing = facing;
    saved.player.facingAngle = angle;
    phase.restore(saved);
    assert.equal(phase.player.direction, facing, 'Save antigo preserva direção lógica.');
    assert.equal(phase.player.facing, expected, 'Save antigo migra orientação para esquerda/direita.');
  }
} finally {
  babyRenderer.renderPose = originalPose;
  toyRenderer.renderToy = originalToy;
}
console.log('APROVADO: teclado, joystick e gamepad em oito direções; repouso, carregamento, soltura, espada, ataque e saves atuais/antigos.');
