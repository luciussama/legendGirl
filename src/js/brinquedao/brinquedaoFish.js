import { BRINQUEDAO_TRACKS, brinquedaoSurface } from './brinquedaoLevel.js';

export const BRINQUEDAO_FISH_ATTACK = Object.freeze({
  range: 150,
  maxLunge: 320,
  lead: 0.26,
  height: 180,
  activeFrom: 0.36,
  activeTo: 0.64,
});

/** Dois peixes por ponte usam posições fixas; só saltam quando Yuna se aproxima. */
export function brinquedaoFishSpecs(bridge) {
  return [0.34, 0.72].map((u, id) => ({
    id: bridge.id + '-' + id,
    bridgeId: bridge.id,
    x: bridge.from + (bridge.to - bridge.from) * u,
    y: bridge.y,
    period: 2.7 + id * 0.35,
    air: 0.64,
    facing: id ? -1 : 1,
  }));
}

/** O alvo é fixado no início; o salto curto intercepta o caminho sem perseguir a personagem. */
export function updateBrinquedaoFishAttack(s) {
  const attack = s.obstacles.fishAttack;
  if (attack.id !== null) {
    const spec = BRINQUEDAO_TRACKS.filter((t) => t.kind === 'fish-bridge')
      .flatMap(brinquedaoFishSpecs)
      .find((f) => f.id === attack.id);
    if (s.time - attack.startedAt >= spec.air) {
      attack.id = null;
      attack.startedAt = null;
      attack.targetX = null;
    }
    return false;
  }
  if (s.stage !== 'RUNNING' || s.time < attack.nextAt || brinquedaoFishImpactAge(s) <= 1.6)
    return false;
  const p = s.player,
    candidates = [];
  for (const bridge of BRINQUEDAO_TRACKS.filter((t) => t.kind === 'fish-bridge')) {
    if (
      (p.support !== bridge.id && p.support !== null) ||
      p.x < bridge.from - BRINQUEDAO_FISH_ATTACK.range ||
      p.x > bridge.to + BRINQUEDAO_FISH_ATTACK.range
    )
      continue;
    const surface = brinquedaoSurface(bridge, Math.max(bridge.from, Math.min(bridge.to, p.x)));
    if (Math.abs(p.y - surface) > 220) continue;
    for (const spec of brinquedaoFishSpecs(bridge))
      if (Math.abs(p.x - spec.x) <= BRINQUEDAO_FISH_ATTACK.range)
        candidates.push({
          bridge,
          spec,
        });
  }
  candidates.sort((a, b) => Math.abs(a.spec.x - p.x) - Math.abs(b.spec.x - p.x));
  const candidate = candidates[0];
  if (!candidate) return false;
  const { bridge, spec } = candidate,
    predicted = p.x + p.vx * BRINQUEDAO_FISH_ATTACK.lead,
    delta = Math.max(
      -BRINQUEDAO_FISH_ATTACK.maxLunge,
      Math.min(BRINQUEDAO_FISH_ATTACK.maxLunge, predicted - spec.x),
    );
  attack.id = spec.id;
  attack.startedAt = s.time;
  attack.targetX = Math.max(bridge.from + 35, Math.min(bridge.to - 35, spec.x + delta));
  attack.nextAt = s.time + spec.period;
  return true;
}

/** A pose percorre apenas a investida curta e não aparece atravessando a tela. */
export function brinquedaoFishPose(spec, time, depth = 1600, attack = null) {
  if (
    attack?.id !== spec.id ||
    !Number.isFinite(attack.startedAt) ||
    !Number.isFinite(attack.targetX)
  )
    return {
      id: spec.id,
      x: spec.x,
      y: spec.y + depth,
      active: false,
      visible: false,
      u: 0,
      facing: spec.facing,
      angle: 0,
    };
  const age = time - attack.startedAt,
    visible = age >= 0 && age <= spec.air,
    u = Math.max(0, Math.min(1, age / spec.air)),
    q = u * u * (3 - 2 * u),
    delta = attack.targetX - spec.x;
  return {
    id: spec.id,
    x: spec.x + delta * q,
    y: spec.y + 100 - Math.sin(u * Math.PI) * BRINQUEDAO_FISH_ATTACK.height,
    active:
      visible && u >= BRINQUEDAO_FISH_ATTACK.activeFrom && u <= BRINQUEDAO_FISH_ATTACK.activeTo,
    visible,
    u,
    facing: Math.sign(delta) || spec.facing,
    angle: -Math.cos(u * Math.PI) * 0.38,
  };
}

/** Apenas o corpo durante o salto causa o arremesso; cauda e aviso não causam contato. */
export function brinquedaoFishTouches(player, fish) {
  if (!fish.active) return false;
  const x = Math.max(player.x - 17, Math.min(player.x + 17, fish.x)),
    y = Math.max(player.y - 86, Math.min(player.y - 6, fish.y));
  return ((x - fish.x) / 31) ** 2 + ((y - fish.y) / 24) ** 2 <= 1;
}
export function brinquedaoFishImpactAge(s) {
  return s.obstacles.fishImpact.at === null ? Infinity : s.time - s.obstacles.fishImpact.at;
}
