import { CHASE_CONFIG as C, clamp } from './ChaseConfig.js';
import { chaseIntensity, smoothProgress } from './ChasePacing.js';
import { isChaseDefeat, CHASE_FALL_DURATION } from './ChaseHealth.js';

/**
 * Calcula a câmera no referencial da pista; o renderer converte os pontos para a sala curva.
 * Aproximação e oscilação são determinísticas, preservando pausa e restauração do jogo.
 * O pequeno aumento de campo de visão conserva leitura periférica ao aproximar a câmera.
 */
export function chaseCameraFrame(state, portrait, aspect) {
  const intensity = chaseIntensity(state.distance);
  const ending = ['CAUGHT', 'CHEST_RETURN', 'COMPLETE'].includes(state.stage);
  const cutscene = ['BEAR_DOWN', 'GIRL_APPROACH', 'BEAR_RISE', 'CHASE_START'].includes(state.stage);
  const t = !ending ? 0 : state.stage === 'CAUGHT' ? clamp(state.age / C.stages.CAUGHT, 0, 1) : 1;
  const blend = smoothProgress(t);
  const fov = 57 + intensity * (portrait ? 5 : 3);
  let baseZ = portrait ? 9 - 2.2 * intensity : 7.5 - 2.4 * intensity;
  const baseY = portrait ? 5.2 - .8 * intensity : 3.9 - .65 * intensity;
  const near = cutscene ? 0 : smoothProgress((12 - state.gap) / 10.8);
  const actorsCenter = (state.x + (state.bearX ?? 0)) / 2;
  // No retrato, uma perseguição em faixas distintas precisa de folga para manter os dois atores visíveis.
  const actorSpan = Math.abs(state.x - (state.bearX ?? 0)) + 1.7;
  const framingZ = actorSpan / (2 * Math.tan(fov * Math.PI / 360) * aspect) * 1.08 - state.gap * .25;
  if (portrait) baseZ = Math.max(baseZ, framingZ);
  const center = (state.x + 4.74) / 2;
  const targetZ = (-state.gap - .3) / 2;
  const halfWidth = (Math.abs(4.74 - state.x) + 1.6) / 2;
  const fitZ = Math.max(baseZ, targetZ + halfWidth / (Math.tan(fov * Math.PI / 360) * aspect) * 1.22 + 1);
  // O balanço acompanha as passadas e não continua oscilando com o jogo pausado.
  const moving = state.stage === 'RUNNING' ? smoothProgress(state.age / .75) : ending ? 1 - blend : 0;
  const amplitude = (.018 + .022 * intensity) * moving * (1 - .55 * clamp(state.stumble / .65, 0, 1));
  const bob = Math.sin(state.distance * Math.PI) * amplitude;
  const follow = .28 + (portrait ? .38 : .28) * intensity;
  const defeat = isChaseDefeat(state.stage) ? smoothProgress(state.stage === 'GAME_OVER' ? 1 : state.age / CHASE_FALL_DURATION) : 0;
  return {
    fov,
    position: {
      x: (state.x * follow * (1 - near) + actorsCenter * near + (cutscene ? 1.8 : 0)) * (1 - blend) + center * blend,
      y: baseY + bob,
      z: baseZ + (fitZ - baseZ) * blend,
    },
    target: {
      s: state.distance + ((8 - 3 * intensity) * (1 - blend) - targetZ * blend) * (1 - defeat) + defeat,
      x: ((state.x * (.35 + (portrait ? .37 : .27) * intensity) * (1 - near) + actorsCenter * near) * (1 - blend) + center * blend) * (1 - defeat) + state.x * defeat,
      y: ((1.2 - .5 * intensity) * (1 - blend) + 1.2 * blend + bob * .2) * (1 - defeat) + .25 * defeat,
    },
  };
}
