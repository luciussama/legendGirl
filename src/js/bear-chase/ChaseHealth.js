/** Duração da queda antes de congelar a tentativa encerrada, em segundos de jogo. */
export const CHASE_FALL_DURATION = 1.1;

/** Centraliza o limite de tropeços: seis no fácil e três nas demais dificuldades. */
export function chaseMaxLives(difficulty = 'NORMAL') { return difficulty === 'EASY' ? 6 : 3; }

/** Deriva as vidas do contador existente, sem duplicar dados no snapshot. */
export function chaseLives(state, difficulty = 'NORMAL') {
  return Math.max(0, chaseMaxLives(difficulty) - state.hits);
}

/** Identifica etapas de derrota sem confundi-las com a captura bem-sucedida do urso. */
export function isChaseDefeat(stage) { return stage === 'FALLING' || stage === 'GAME_OVER'; }
