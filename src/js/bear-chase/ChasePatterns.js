import { CHASE_CONFIG as C } from './ChaseConfig.js';

/** Distribui os brinquedos deixando um corredor contínuo, sem estreitar o EASY existente. */
export function chasePattern(progress, difficulty, safeLane) {
  if (difficulty === 'EASY' || progress < .7) {
    const lanes = progress > .35 ? [0, 1, 2].filter(i => i !== safeLane) : [(safeLane + 1) % 3];
    return { side: safeLane, obstacles: lanes.map(i => ({ x: C.lanes[i], width: 1.15 })) };
  }
  if (progress < C.finalPressureStart) {
    const sign = safeLane === 2 ? -1 : 1;
    // Três volumes largos: passagem visual de 1,35; folga dos centros de 0,63.
    return { side: sign > 0 ? 0 : 2, tight: true,
      obstacles: [-2.7, .3, 2.65].map(x => ({ x: x * sign, width: 1.65 })) };
  }
  // Dois volumes deixam passagem ampla e cobrem as bordas das faixas bloqueadas.
  // A alternância da faixa livre exige movimento, sem aumentar a barreira para quatro objetos.
  return { side: safeLane, tight: true,
    obstacles: [0, 1, 2].filter(i => i !== safeLane).map(i => ({ x: C.lanes[i], width: 1.7 })) };
}
