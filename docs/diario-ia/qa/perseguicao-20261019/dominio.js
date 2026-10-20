import assert from 'node:assert/strict';
import { createChaseState, restoreChaseState, stepChase, hitsObstacle } from '../../../../src/js/bear-chase/ChaseSimulation.js';
import { CHASE_CONFIG as C } from '../../../../src/js/bear-chase/ChaseConfig.js';

/** Escolhe um corredor livre no próximo grupo; não modifica obstáculos ou atores. */
function steer(state) {
  const next = state.obstacles.filter(o => o.z >= state.distance - .1).sort((a, b) => a.z - b.z)[0];
  if (!next) return 0;
  const group = state.obstacles.filter(o => Math.abs(o.z - next.z) < .01);
  const lanes = C.lanes.filter(x => group.every(o => Math.abs(o.x - x) > 1));
  const target = lanes.sort((a, b) => Math.abs(a - state.x) - Math.abs(b - state.x))[0];
  return Math.abs(target - state.x) < .05 ? 0 : Math.sign(target - state.x);
}

const results = [];
for (const difficulty of ['NORMAL', 'EASY']) {
  for (const frame of [.5, 1, 1.2, 3]) {
    let s = createChaseState(), accumulated = 0, steps = 0, chest = 0, largestPool = 0, copies = 0;
    const stages = [s.stage];
    for (let n = 0; n < 40000 && s.stage !== 'COMPLETE'; n++) {
      accumulated += frame / 60;
      while (accumulated + 1e-9 >= C.step) {
        const previous = s.stage;
        const events = stepChase(s, steer(s), C.step, difficulty);
        chest += events.filter(e => e.type === 'chestReturned').length;
        if (s.stage !== previous) stages.push(s.stage);
        if (s.stage !== 'COMPLETE') assert.equal(s.chestApplied, false, 'Urso não pode ir ao baú antes do fim.');
        const groups = new Map();
        for (const o of s.obstacles) {
          if (!groups.has(o.z)) groups.set(o.z, []);
          groups.get(o.z).push(o);
        }
        for (const group of groups.values()) assert.ok(C.lanes.some(x => group.every(o => Math.abs(o.x - x) > 1)), 'Grupo precisa deixar rota livre.');
        largestPool = Math.max(largestPool, s.obstacles.length);
        if (++steps % 701 === 0) {
          const saved = JSON.parse(JSON.stringify(s)); const restored = restoreChaseState(saved);
          assert.deepEqual(restored, s, 'Save deve preservar cada etapa.');
          const a = structuredClone(s), b = structuredClone(restored);
          for (let k = 0; k < 240; k++) {
            const input = steer(a);
            assert.deepEqual(stepChase(a, input, C.step, difficulty), stepChase(b, input, C.step, difficulty));
          }
          assert.deepEqual(a, b, 'Restauração deve reproduzir RNG, obstáculos e voo.');
          s = restored; copies++;
        }
        accumulated -= C.step;
      }
    }
    assert.equal(s.stage, 'COMPLETE'); assert.equal(s.distance, C.length);
    assert.equal(s.hits, 0, 'A política de desvio deve conseguir terminar sem colisões.');
    assert.equal(chest, 1); assert.equal(s.chestApplied, true);
    assert.deepEqual(stepChase(s, 1), [], 'Conclusão não pode ser reaplicada.');
    assert.deepEqual(stages, ['BEAR_DOWN', 'GIRL_APPROACH', 'BEAR_RISE', 'CHASE_START', 'RUNNING', 'CAUGHT', 'CHEST_RETURN', 'COMPLETE']);
    assert.ok(largestPool <= 12, 'Objetos ativos não podem crescer com a duração.');
    results.push({ difficulty, frame, seconds: Number(s.time.toFixed(2)), hits: s.hits, largestPool, copies });
  }
}
assert.ok(hitsObstacle({ age: 1, x: 0, z: 2, width: 1 }, 0, 0, 0, 4), 'Colisão varrida não atravessa brinquedo.');
assert.equal(hitsObstacle({ age: .1, x: 0, z: 2, width: 1 }, 0, 0, 0, 4), false, 'Brinquedo em voo não provoca contato no piso.');
const bad = createChaseState(); bad.x = Infinity;
assert.throws(() => restoreChaseState(bad));
assert.throws(() => restoreChaseState({ ...createChaseState(), stage: 'INEXISTENTE' }));
let idle = createChaseState(); for (let i = 0; i < 10000; i++) stepChase(idle, 0);
assert.ok(idle.hits > 0, 'Ficar parado deve reproduzir impacto e recuperação.');
console.log('APROVADO: sequência, 8 percursos sem dano, RNG/save, colisão varrida, rotas e limite de objetos.', JSON.stringify(results));
