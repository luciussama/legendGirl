/** Ampliação da fantasia, relativa às medidas visuais da exploração. */
export const ARENA_SCALE = Object.freeze({ player: 2.5, enemy: 2.5, monumentMin: 2, monumentMax: 3.2 });
export const ARENA_PLAYER_HEIGHT = 80 * ARENA_SCALE.player;
export function arenaActorBounds(x, ground, jump = 0, height = ARENA_PLAYER_HEIGHT, width = height * 1.3) {
  return { left: x - width / 2, right: x + width / 2, top: ground - jump - height, bottom: ground - jump };
}
