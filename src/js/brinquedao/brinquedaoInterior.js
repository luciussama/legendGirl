import { BRINQUEDAO_TUBES } from './brinquedaoTubes.js';
import {
  BRINQUEDAO_GAUNTLET as C,
  brinquedaoTriangleTouches,
  brinquedaoBlockSolid,
  brinquedaoReboundPose,
  BRINQUEDAO_REBOUNDS,
} from './brinquedaoGauntlet.js';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const body = () => ({
  x: 140,
  y: C.floor,
  vx: C.launchSpeed,
  vy: 0,
  facing: 1,
  grounded: true,
  jumpHeld: true,
  animTime: 0,
});
/** Quatro tubos, salto em velocidade, ricochete automático e ponte que desaba. */
export function createBrinquedaoInterior() {
  return {
    version: 3,
    leg: 0,
    mode: 'tube',
    u: 0,
    time: 0,
    age: 0,
    checkpoint: 0,
    complete: false,
    bumps: 0,
    bounce: 0,
    bridgeStarted: null,
    player: body(),
  };
}
export function beginBrinquedaoInterior(s) {
  s.interior = createBrinquedaoInterior();
  s.stage = 'INTERIOR';
  s.age = 0;
  s.player.vx = 0;
  s.player.vy = 0;
  s.progress = 0.55;
}

function enterTube(i, leg) {
  i.leg = leg;
  i.checkpoint = leg;
  i.mode = 'tube';
  i.u = 0;
  i.age = 0;
  i.bridgeStarted = null;
  i.player = body();
}
/** Retry da ponte refaz o terceiro tubo; a colisão no triângulo refaz a primeira corrida. */
export function retryBrinquedaoInterior(s) {
  const i = s.interior;
  enterTube(i, i.checkpoint);
  s.stage = 'INTERIOR';
  s.age = 0;
}

function finish(s, events) {
  const i = s.interior;
  i.mode = 'finish';
  i.complete = true;
  i.age = 0;
  i.player = {
    ...body(),
    x: 880,
    vx: 0,
  };
  s.stage = 'COMPLETE';
  s.age = 0;
  s.progress = 1;
  s.story.endingDone = false;
  events.push({
    type: 'complete',
  });
}
/** Entrada e física seguem o mesmo relógio dos tubos; não há piscinas nem inimigos no interior. */
export function stepBrinquedaoInterior(s, input, seconds) {
  const i = s.interior,
    events = [],
    axis = clamp(Number(input.x) || 0, -1, 1),
    jump = Boolean(input.jump);
  let remaining = seconds;
  while (remaining > 1e-8 && s.stage === 'INTERIOR') {
    const dt = Math.min(1 / 180, remaining);
    remaining -= dt;
    s.time += dt;
    s.age += dt;
    i.time += dt;
    i.age += dt;
    const p = i.player;
    if (i.mode === 'tube') {
      const t = BRINQUEDAO_TUBES[i.leg];
      i.u = Math.min(
        1,
        i.u + (t.speed * (1 + 0.12 * Math.sin(i.u * Math.PI * 4 + i.leg)) * dt) / t.length,
      );
      s.progress = 0.55 + (0.45 * (i.leg + i.u * 0.65)) / 4;
      if (i.u >= 1) {
        i.age = 0;
        i.player = body();
        if (i.leg === 3) {
          finish(s, events);
          break;
        }
        i.mode = i.leg === 0 ? 'sprint' : i.leg === 1 ? 'ricochet' : 'blocks';
        i.bounce = 0;
        events.push({
          type: i.mode === 'ricochet' ? 'side-spring' : 'slide',
        });
      }
      continue;
    }
    if (i.mode === 'hit') {
      p.x += p.vx * dt;
      p.vy += C.gravity * dt;
      p.y = Math.min(C.floor, p.y + p.vy * dt);
      if (i.age >= 0.8) enterTube(i, 0);
      continue;
    }
    if (i.mode === 'ricochet') {
      const duration = 0.65;
      Object.assign(p, brinquedaoReboundPose(i.bounce, Math.min(1, i.age / duration)), {
        grounded: false,
      });
      p.animTime += dt * 16;
      if (i.age >= duration) {
        i.bounce++;
        i.age = 0;
        events.push({
          type: 'side-spring',
        });
        if (i.bounce >= BRINQUEDAO_REBOUNDS.length - 1) {
          enterTube(i, 2);
          events.push({
            type: 'tube-start',
          });
        }
      }
      s.progress =
        0.55 + (0.45 * (1 + 0.65 + (0.35 * i.bounce) / (BRINQUEDAO_REBOUNDS.length - 1))) / 4;
      continue;
    }
    if (jump && !p.jumpHeld && p.grounded) {
      p.vy = -C.jump;
      p.grounded = false;
      events.push({
        type: 'jump',
      });
    }
    p.jumpHeld = jump;
    if (axis) p.vx = clamp(p.vx + axis * C.acceleration * dt, -C.runSpeed, C.runSpeed);
    else p.vx = Math.sign(p.vx) * Math.max(0, Math.abs(p.vx) - C.drag * dt);
    p.x = clamp(p.x + p.vx * dt, 40, C.runWidth);
    p.animTime += (Math.abs(p.vx) * dt) / 28;
    if (Math.abs(p.vx) > 5) p.facing = Math.sign(p.vx);
    const b = C.blocks,
      tile = Math.floor(((p.x - b.from) / (b.to - b.from)) * b.count),
      onBlocks = i.mode === 'blocks' && p.x >= b.from && p.x < b.to;
    if (onBlocks && i.bridgeStarted === null) i.bridgeStarted = s.time;
    const solid = !onBlocks || brinquedaoBlockSolid(i, tile, s.time, s.difficulty);
    if (p.grounded && !solid) {
      p.grounded = false;
      p.vy = 0;
      events.push({
        type: 'bridge-fall',
      });
    }
    if (p.grounded) p.y = C.floor;
    else {
      const oldY = p.y;
      p.vy = Math.min(1600, p.vy + C.gravity * dt);
      p.y += p.vy * dt;
      if (solid && p.vy >= 0 && oldY <= C.floor + 2 && p.y >= C.floor) {
        p.y = C.floor;
        p.vy = 0;
        p.grounded = true;
      }
    }
    if (i.mode === 'sprint' && brinquedaoTriangleTouches(p)) {
      i.bumps++;
      i.mode = 'hit';
      i.age = 0;
      p.vx = -430;
      p.vy = -440;
      p.grounded = false;
      events.push({
        type: 'hurt',
      });
      continue;
    }
    if (i.mode === 'blocks' && p.y > C.floor + 470) {
      s.stage = 'GAME_OVER';
      s.age = 0;
      s.failures++;
      p.vx = 0;
      p.vy = 0;
      events.push({
        type: 'fall',
      });
      break;
    }
    s.progress = 0.55 + (0.45 * (i.leg + 0.65 + (0.35 * p.x) / C.runWidth)) / 4;
    if (p.x >= C.runWidth - 50 && p.grounded) {
      enterTube(i, i.leg + 1);
      events.push({
        type: 'tube-start',
      });
    }
  }
  return events;
}
/** Não há atores de perseguição; persistem os modos, a onda de queda e os seis voos automáticos. */
export function validateBrinquedaoInterior(s) {
  const i = s.interior;
  if (!i) {
    if (['INTERIOR', 'COMPLETE'].includes(s.stage)) throw TypeError('Interior salvo ausente.');
    return;
  }
  if (
    i.version !== 3 ||
    !Number.isInteger(i.leg) ||
    i.leg < 0 ||
    i.leg > 3 ||
    !['tube', 'sprint', 'ricochet', 'blocks', 'hit', 'finish'].includes(i.mode) ||
    ![i.u, i.time, i.age].every(Number.isFinite) ||
    i.u < 0 ||
    i.u > 1 ||
    i.time < 0 ||
    i.time > s.time + 0.001 ||
    i.age < 0 ||
    i.age > i.time + 0.001 ||
    !Number.isInteger(i.checkpoint) ||
    i.checkpoint < 0 ||
    i.checkpoint > 3 ||
    !Number.isSafeInteger(i.bumps) ||
    i.bumps < 0 ||
    !Number.isInteger(i.bounce) ||
    i.bounce < 0 ||
    i.bounce > 6 ||
    (i.bridgeStarted !== null &&
      (!Number.isFinite(i.bridgeStarted) || i.bridgeStarted < 0 || i.bridgeStarted > s.time)) ||
    i.complete !== (s.stage === 'COMPLETE') ||
    !['INTERIOR', 'COMPLETE', 'GAME_OVER'].includes(s.stage)
  )
    throw TypeError('Corrida interna salva inválida.');
  if (
    (i.mode === 'sprint' && i.leg !== 0) ||
    (i.mode === 'hit' && i.leg !== 0) ||
    (i.mode === 'ricochet' && (i.leg !== 1 || i.bounce > 5)) ||
    (i.mode === 'blocks' && i.leg !== 2) ||
    (i.mode === 'finish' && (i.leg !== 3 || !i.complete)) ||
    (s.stage === 'GAME_OVER' && i.mode !== 'blocks')
  )
    throw TypeError('Desafio e tubo salvos incompatíveis.');
  const p = i.player;
  if (
    !p ||
    ![p.x, p.y, p.vx, p.vy, p.animTime].every(Number.isFinite) ||
    p.x < -350 ||
    p.x > C.runWidth ||
    p.y < 0 ||
    p.y > 2400 ||
    Math.abs(p.vx) > 1800 ||
    Math.abs(p.vy) > 1800 ||
    p.animTime < 0 ||
    ![-1, 1].includes(p.facing) ||
    typeof p.grounded !== 'boolean' ||
    typeof p.jumpHeld !== 'boolean'
  )
    throw TypeError('Corpo interno salvo inválido.');
}
