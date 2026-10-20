/** Parâmetros da prova de 90 segundos; a extensão final depende da revisão visual. */
export const CHASE_CONFIG = Object.freeze({
  version: 1, step: 1 / 60, length: 720, speed: 8, lateralSpeed: 6,
  halfWidth: 3.6, radius: .36, lanes: [-2.4, 0, 2.4],
  segmentLength: 120, initialGap: 29, minDropGap: 17, flight: .65,
  stages: { BEAR_DOWN: 1.2, GIRL_APPROACH: 3.6, BEAR_RISE: 1.25, CHASE_START: 1.1,
    CAUGHT: 1.4, CHEST_RETURN: 2.8 },
});

/** Limita um valor escalar sem depender de biblioteca de desenho. */
export function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }

/** Aplica amortecimento exponencial em segundos, independente da taxa de quadros. */
export function damp(from, to, speed, dt) { return from + (to - from) * (1 - Math.exp(-speed * dt)); }
