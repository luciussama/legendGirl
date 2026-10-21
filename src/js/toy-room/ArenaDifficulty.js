import { ARENA_ENEMIES } from './ArenaEnemies.js';
import { ARENA_TUNING } from './ArenaPlayerController.js';

const EASY_TUNING = Object.freeze({ ...ARENA_TUNING,
  swordRange: ARENA_TUNING.swordRange * 1.3,
  swordContactScale: ARENA_TUNING.swordContactScale * 1.3
});
const EASY_ENEMIES = Object.freeze(Object.fromEntries(Object.entries(ARENA_ENEMIES).map(([actor, p]) =>
  [actor, Object.freeze({ ...p, speed: p.speed * .8, chargeSpeed: p.chargeSpeed * .85,
    idleTime: p.idleTime * 1.7, retreatTime: p.retreatTime * 1.5, recovery: p.recovery * 1.55,
    evadeCooldown: p.evadeCooldown === undefined ? undefined : p.evadeCooldown * 1.6,
    pressureChain: false })])));

/** Mantém o NORMAL original; no EASY amplia alcance e aumenta pausas sem alterar HP ou telegráficos. */
export function arenaDifficulty(difficulty = 'NORMAL') {
  return difficulty === 'EASY' ? { tuning: EASY_TUNING, enemies: EASY_ENEMIES }
    : { tuning: ARENA_TUNING, enemies: ARENA_ENEMIES };
}
