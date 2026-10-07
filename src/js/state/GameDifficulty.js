// Apenas EASY ativa assistência; saves antigos e valores desconhecidos usam NORMAL.
export const normalizeDifficulty = value => value === 'EASY' ? 'EASY' : 'NORMAL';
export const EASY_LANDING_MARGIN = 4;
export const EASY_LANDING_DEPTH = 24;
export function easyLanding(baby, x, width, y) {
  return baby.x + baby.w > x - EASY_LANDING_MARGIN &&
    baby.x < x + width + EASY_LANDING_MARGIN &&
    baby.y + baby.h >= y && baby.y + baby.h <= y + EASY_LANDING_DEPTH &&
    baby.vy >= 0;
}
export function toyGuideBlend(difficulty, dt) {
  return 1 - Math.pow(difficulty === 'EASY' ? 0.80 : 0.88, dt);
}
