import { CHASE_CONFIG as C, clamp } from './ChaseConfig.js';

/** Interpola uma transição sem mudanças bruscas na velocidade ou na distância do urso. */
export function smoothProgress(value) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

/** Resolve a intensidade pelo percurso; não depende de tempo de quadro, câmera ou estado mutável. */
export function chaseIntensity(distance) {
  return smoothProgress((distance / C.length - .15) / .85);
}

/**
 * Centraliza velocidade, aproximação e ritmo de lançamentos.
 * O urso mantém espaço para lançar até a última aproximação; os últimos metros
 * fecham a distância de captura. O FÁCIL conserva mais tempo para reagir.
 */
export function chasePacing(distance, difficulty = 'NORMAL') {
  const progress = clamp(distance / C.length, 0, 1);
  const intensity = chaseIntensity(distance);
  const speed = C.speed * (1 + .5 * intensity);
  const approach = smoothProgress(progress / .94);
  const closing = smoothProgress((progress - .94) / .06);
  return {
    intensity, speed, closing,
    gap: (C.initialGap - (difficulty === 'EASY' ? 7 : 10) * approach) * (1 - closing) + 1.2 * closing,
    interval: 3.5 - 1.75 * intensity,
    flight: C.flight - .27 * intensity,
    reaction: difficulty === 'EASY' ? 1.15 : .95,
  };
}
