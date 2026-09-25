import assert from 'node:assert/strict';
import { GameState } from '../src/js/state/GameState.js';
import { ParticleSystem } from '../src/js/effects/ParticleSystem.js';

const state = new GameState({ width: 960, height: 580 }, null);
const particles = new ParticleSystem({
  babyJumpDust: state.babyJumpDust, speedRibbons: state.speedRibbons
});
particles.spawnBabyJumpPuff(100, 200);
particles.spawnEscapeRibbons(state.baby, 3, { ribbonRate: 1, trailIntensity: 2 }, 0);
assert(state.babyJumpDust.length > 0);
assert(state.speedRibbons.length > 0);
state.finishPlotTwistAndStartTutorial();
assert(state.isPhase3);
assert.equal(state.babyJumpDust, particles.babyJumpDust);
assert.equal(state.speedRibbons, particles.speedRibbons);
assert.equal(particles.babyJumpDust.length, 0);
assert.equal(particles.speedRibbons.length, 0);

// Fresh trails still render in phase 3 and expire instead of accumulating.
particles.spawnPhase3Ribbons(state.baby, 0, { ribbonRate: 1, trailIntensity: 2 }, 0);
particles.spawnBabyJumpPuff(100, 200);
assert(particles.speedRibbons.length > 0);
const babyBefore = { ...state.baby };
for (let i = 0; i < 240; i++) particles.update(0.5);
assert.equal(particles.babyJumpDust.length, 0);
assert.equal(particles.speedRibbons.length, 0);
assert.deepEqual(state.baby, babyBefore);
console.log('PASS: phase 3 clears old shared trails; new effects expire without changing player physics.');
