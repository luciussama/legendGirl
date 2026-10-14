/** Janelas da espada e sinais compartilhados entre simulação, animação e HUD. */
export const ARENA_SWORD = Object.freeze({ duration: 18, windup: 6, active: 6, cooldown: 36, blockRecovery: 48 });
export const arenaEnemyImpactEnd = (enemy, tuning = { windup: 54, active: 18 }) =>
  enemy.attack === 'Toy Leap' ? 96 : tuning.windup + tuning.active;

export function arenaEnemyGuarding(enemy, tuning) {
  if (enemy.actor === 'train') return false;
  if (enemy.state === 'HIT') return true;
  return enemy.state === 'ATTACK'
    && ((enemy.elapsed < arenaEnemyImpactEnd(enemy, tuning) && (enemy.responseAttack || enemy.elapsed >= 18))
      || (enemy.landed && !enemy.pressureChain));
}
