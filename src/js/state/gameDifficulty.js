// Apenas EASY ativa assistência; saves antigos e valores desconhecidos usam NORMAL.
export const normalizeDifficulty = (value) => (value === 'EASY' ? 'EASY' : 'NORMAL');
export const EASY_LANDING_MARGIN = 4;
export const EASY_LANDING_DEPTH = 24;
export function easyLanding(player, x, width, y) {
  return (
    player.x + player.w > x - EASY_LANDING_MARGIN &&
    player.x < x + width + EASY_LANDING_MARGIN &&
    player.y + player.h >= y &&
    player.y + player.h <= y + EASY_LANDING_DEPTH &&
    player.vy >= 0
  );
}
export function toyGuideBlend(difficulty, dt) {
  return 1 - Math.pow(difficulty === 'EASY' ? 0.8 : 0.88, dt);
}
