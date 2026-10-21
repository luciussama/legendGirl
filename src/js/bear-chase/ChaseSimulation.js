import { CHASE_CONFIG as C, clamp, damp } from './ChaseConfig.js';

import { routeFrame, ROUTE_AMBUSHES } from './ChaseRoute.js';
import { chasePacing } from './ChasePacing.js';
import { chaseLives, CHASE_FALL_DURATION } from './ChaseHealth.js';
import { chasePattern } from './ChasePatterns.js';

const STAGES = ['BEAR_DOWN', 'GIRL_APPROACH', 'BEAR_RISE', 'CHASE_START', 'RUNNING', 'CAUGHT', 'CHEST_RETURN', 'COMPLETE'];

/** Cria somente dados serializáveis; nenhuma entidade da sala é compartilhada. */
export function createChaseState() {
  return { version: C.version, stage: 'BEAR_DOWN', time: 0, age: 0, distance: 0,
    x: 0, bearX: .6, gap: 6, fairy: { x: -.6, y: 2.6, z: -.6 },
    obstacles: [], serial: 0, seed: 729, nextDrop: 5, dropSide: 0,
    stumble: 0, immunity: 0, hits: 0, checkpoint: 0, girlStride: 0, bearStride: 0,
    chestApplied: false };
}

/** Valida snapshots recebidos antes de restaurar valores no domínio. */
export function restoreChaseState(saved) {
  if (!saved || saved.version !== C.version || ![...STAGES, 'FALLING', 'GAME_OVER'].includes(saved.stage))
    throw new TypeError('Save da perseguição inválido ou incompatível.');
  const state = structuredClone(saved);
  for (const key of ['time', 'age', 'distance', 'x', 'bearX', 'gap', 'nextDrop', 'seed', 'serial',
    'dropSide', 'stumble', 'immunity', 'hits', 'checkpoint', 'girlStride', 'bearStride']) {
    if (!Number.isFinite(state[key])) throw new TypeError('Campo inválido na perseguição: ' + key);
  }
  if (!Number.isInteger(state.hits) || state.hits < 0 || state.age < 0 ||
      state.distance < 0 || state.distance > C.length || Math.abs(state.x) > C.halfWidth ||
      !Array.isArray(state.obstacles) || state.obstacles.length > 32 || !state.fairy ||
      !['x', 'y', 'z'].every(key => Number.isFinite(state.fairy[key])) ||
      typeof state.chestApplied !== 'boolean' || state.chestApplied !== (state.stage === 'COMPLETE') ||
      state.obstacles.some(o => !['id', 'x', 'z', 'age', 'width', 'fromX', 'fromZ'].every(key => Number.isFinite(o[key])) ||
        (o.flight !== undefined && (!Number.isFinite(o.flight) || o.flight < .2 || o.flight > C.flight)) ||
        (o.fitWidth !== undefined && typeof o.fitWidth !== 'boolean') ||
        o.width <= 0 || !['blocks', 'train', 'bunny'].includes(o.kind)))
    throw new TypeError('Geometria inválida no save da perseguição.');
  state.x = clamp(state.x, -C.halfWidth, C.halfWidth);
  return state;
}

/** Avança o gerador local e reproduz os mesmos padrões após salvar/restaurar. */
function random(state) {
  state.seed = (Math.imul(state.seed, 1664525) + 1013904223) >>> 0;
  return state.seed / 4294967296;
}

/** Testa colisão varrida no trecho percorrido, incluindo o deslocamento lateral. */
export function hitsObstacle(obstacle, fromX, toX, fromZ, toZ) {
  if (obstacle.age < (obstacle.flight ?? C.flight) || obstacle.hit || obstacle.z + .5 < fromZ || obstacle.z - .5 > toZ) return false;
  const t = clamp((obstacle.z - fromZ) / Math.max(.00001, toZ - fromZ), 0, 1);
  return Math.abs(fromX + (toX - fromX) * t - obstacle.x) < C.radius + obstacle.width / 2;
}

/** Coloca um grupo com corredor livre, tempo de aviso e distância entre padrões. */
function dropPattern(state, events, pacing, speed, ambushZ = null, difficulty = 'NORMAL') {
  const progress = state.distance / C.length;
  const finalPressure = difficulty !== 'EASY' && progress >= C.finalPressureStart;
  const randomLane = Math.floor(random(state) * 3);
  let safeLane = ambushZ === null ? randomLane : routeFrame(ambushZ).curvature >= 0 ? 2 : 0;
  // Nos trechos rápidos, a próxima saída exige no máximo uma mudança de faixa.
  if (finalPressure) safeLane = state.dropSide === 1 ? (randomLane === 0 ? 0 : 2) : 1;
  else if (progress > .5 && Math.abs(safeLane - state.dropSide) > 1) safeLane = 1;
  const pattern = chasePattern(progress, difficulty, safeLane);
  // A cadência final usa saídas vizinhas, alcançáveis antes do próximo par.
  state.nextDrop = state.time + (finalPressure ? C.finalDropInterval : pacing.interval);
  const forecastSpeed = chasePacing(state.distance + 30).speed * 1.12;
  const minimumLead = Math.max(C.minDropGap - 1, Math.max(speed, forecastSpeed) * (pacing.flight + pacing.reaction));
  // No final, o urso lança adiante mesmo enquanto a menina se aproxima dele.
  // O último grupo termina dentro da pista e conserva o aviso completo após pousar.
  const lead = finalPressure ? Math.max(state.gap - 1, minimumLead + .5) : state.gap - 1;
  const z = ambushZ ?? (finalPressure ? state.distance + lead : state.distance + state.gap - 1);
  if (z - state.distance < minimumLead || z > C.length - (finalPressure ? .5 : 25)) return;
  for (const { x, width } of pattern.obstacles) {
    const obstacle = { id: ++state.serial, x, z, age: 0, flight: pacing.flight, width,
      kind: ['blocks', 'train', 'bunny'][Math.floor(random(state) * 3)], hit: false,
      fromX: state.bearX, fromZ: state.distance + state.gap };
    if (pattern.tight) obstacle.fitWidth = true;
    state.obstacles.push(obstacle);
    events.push({ type: 'toyThrown', id: obstacle.id });
  }
  state.dropSide = pattern.side;
}

/** Amortece alvos alternados da fada atrás/acima da menina, com profundidade real. */
function followFairy(state, dt) {
  const side = Math.sin(state.time * .57 + Math.sin(state.time * .17));
  state.fairy.x = damp(state.fairy.x, state.x + side * .95, 2.2, dt);
  state.fairy.y = damp(state.fairy.y, 2.65 + Math.sin(state.time * 2.1) * .16, 3, dt);
  state.fairy.z = damp(state.fairy.z, -.35 - (1 - Math.abs(side)) * .35, 2, dt);
}

/** Muda de etapa uma vez e emite eventos independentes dos serviços audiovisuais. */
function advanceStage(state, events) {
  state.stage = STAGES[STAGES.indexOf(state.stage) + 1];
  state.age = 0;
  events.push({ type: 'stage', stage: state.stage });
  if (state.stage === 'RUNNING') { state.gap = C.initialGap; state.nextDrop = state.time + 2; }
  if (state.stage === 'COMPLETE' && !state.chestApplied) {
    state.chestApplied = true; events.push({ type: 'chestReturned' });
  }
}

/** Integra um passo fixo em segundos e devolve eventos; não acessa DOM, áudio ou GPU. */
export function stepChase(state, input, dt = C.step, difficulty = 'NORMAL') {
  const events = [];
  if (state.stage === 'COMPLETE' || state.stage === 'GAME_OVER') return events;
  // Saves antigos com muitos tropeços obedecem ao limite assim que a corrida é retomada.
  if (state.stage === 'RUNNING' && chaseLives(state, difficulty) === 0) {
    state.stage = 'FALLING'; state.age = 0;
    return [{ type: 'stage', stage: 'FALLING' }];
  }
  state.time += dt; state.age += dt;
  if (state.stage === 'FALLING') {
    if (state.age >= CHASE_FALL_DURATION) {
      state.stage = 'GAME_OVER'; state.age = 0;
      events.push({ type: 'stage', stage: 'GAME_OVER' });
    }
    return events;
  }
  followFairy(state, dt);
  if (state.stage !== 'RUNNING') {
    if (state.stage === 'GIRL_APPROACH') {
      state.gap = 6 - 3 * clamp(state.age / C.stages.GIRL_APPROACH, 0, 1);
      state.girlStride += dt;
      if (state.girlStride >= .65) { state.girlStride -= .65; events.push({ type: 'step', actor: 'menina' }); }
    }
    if (state.stage === 'CHASE_START') state.gap = 3 + (C.initialGap - 3) * clamp(state.age / C.stages.CHASE_START, 0, 1);
    if (state.age >= C.stages[state.stage]) advanceStage(state, events);
    return events;
  }
  state.immunity = Math.max(0, state.immunity - dt);
  state.stumble = Math.max(0, state.stumble - dt);
  const fromX = state.x, fromZ = state.distance;
  const terrain = routeFrame(state.distance);
  // A aceleração do percurso soma-se à influência das rampas; tropeços ainda reduzem o avanço.
  const pacing = chasePacing(state.distance, difficulty);
  const speed = pacing.speed * clamp(1-terrain.slope*.9,.84,1.12) * (state.stumble > 0 ? .58 : 1);
  const drift = -terrain.curvature * speed * speed * (difficulty === 'EASY' ? .25 : .55);
  state.x = clamp(state.x + (clamp(input || 0, -1, 1) * C.lateralSpeed + drift) * dt, -C.halfWidth, C.halfWidth);
  state.distance = Math.min(C.length, state.distance + speed * dt);
  // A menina ganha terreno gradualmente; a aproximação final mantém a condição de captura existente.
  const approachPacing = chasePacing(state.distance, difficulty);
  const targetGap = approachPacing.gap;
  state.gap = damp(state.gap, targetGap + (state.stumble > 0 ? 1 : 0), 2.5 + 9.5 * approachPacing.closing, dt);
  state.bearX = damp(state.bearX, C.lanes[state.dropSide] * .65, 1.4, dt);
  for (const obstacle of state.obstacles) {
    obstacle.age += dt;
    if (!state.immunity && hitsObstacle(obstacle, fromX, state.x, fromZ, state.distance)) {
      obstacle.hit = true; state.hits++; state.stumble = .65;
      state.immunity = difficulty === 'EASY' ? 2 : 1.3;
      events.push({ type: 'obstacleHit' });
      if (chaseLives(state, difficulty) === 0) {
        state.stage = 'FALLING'; state.age = 0;
        events.push({ type: 'stage', stage: 'FALLING' });
        return events;
      }
    }
  }
  state.obstacles = state.obstacles.filter(o => o.z > state.distance - 8);
  const ambush=ROUTE_AMBUSHES.find(z=>fromZ<z-20&&state.distance>=z-20);
  const finalPressure = difficulty !== 'EASY' && state.distance >= C.length * C.finalPressureStart;
  if (finalPressure) {
    if (fromZ < C.length * C.finalPressureStart || state.time + 1e-9 >= state.nextDrop)
      dropPattern(state, events, pacing, speed, null, difficulty);
  }
  else if(ambush!==undefined) {dropPattern(state,events,pacing,speed,ambush,difficulty);state.nextDrop=state.time+Math.max(1.75,pacing.interval);}
  else if(state.time>=state.nextDrop&&!ROUTE_AMBUSHES.some(z=>Math.abs(state.distance-(z-20))<22))dropPattern(state,events,pacing,speed,null,difficulty);
  const checkpoint = Math.floor(state.distance / C.segmentLength) * C.segmentLength;
  if (checkpoint > state.checkpoint && checkpoint < C.length) {
    state.checkpoint = checkpoint; events.push({ type: 'checkpointReached' });
  }
  state.girlStride += speed * dt / 2;
  state.bearStride += speed * dt / 2.9;
  for (const [key, actor] of [['girlStride', 'menina'], ['bearStride', 'urso']]) {
    if (state[key] >= 1) { state[key] %= 1; events.push({ type: 'step', actor }); }
  }
  if (state.distance >= C.length && state.gap <= 1.6) advanceStage(state, events);
  return events;
}
