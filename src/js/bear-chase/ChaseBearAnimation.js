import { CHASE_CONFIG as C, clamp } from './chaseConfig.js';

/** Encena peso e articulação da pelúcia sem criar eventos nem modificar o estado da perseguição. */
export class ChaseBearAnimation {
  /** Guarda somente o rig; poses dependem do estado, permitindo pausa e restauração determinísticas. */
  constructor(model) {
    this.model = model;
  }

  /** Resolve coxa/joelho e nivela a pata para alcançar um apoio no referencial do quadril. */
  legPose(leg, z, footY, hipHeight) {
    const length = 0.24,
      drop = hipHeight - footY,
      distance = Math.min(length * 1.999, Math.hypot(drop, z));
    const knee = -Math.acos(
      clamp((distance * distance - 2 * length * length) / (2 * length * length), -1, 1),
    );
    leg.hip.rotation.x = Math.atan2(-z, drop) - knee / 2;
    leg.knee.rotation.x = knee;
    leg.ankle.rotation.x = -leg.hip.rotation.x - knee;
  }

  /** Aplica queda, recuperação, corrida com apoios e recolhimento mantendo os tempos narrativos. */
  apply(state) {
    const m = this.model,
      down = ['BEAR_DOWN', 'GIRL_APPROACH'].includes(state.stage);
    const progress =
      state.stage === 'BEAR_RISE' ? clamp(state.age / C.stages.BEAR_RISE, 0, 1) : down ? 0 : 1;
    const rise = progress * progress * (3 - 2 * progress);
    const running = ['RUNNING', 'CHASE_START'].includes(state.stage);
    // Cadência pesada por deslocamento; a largada tem ritmo limitado e chega à corrida sem salto de fase.
    const phase =
      state.stage === 'CHASE_START'
        ? state.age * 9
        : C.stages.CHASE_START * 9 +
          ((state.distance + state.gap - C.initialGap) * Math.PI * 2) / 5.8;
    const wave = Math.sin(phase),
      pulse = Math.cos(phase * 2);
    const effort = running ? 1 : 0,
      breathe = Math.sin(state.time * 2.4) * 0.004;
    const bob = running ? 0.04 * Math.sin(phase) ** 2 : breathe;
    m.root.position.set(state.bearX + (1 - rise) * 0.65, 0.03 + (1 - rise) * 0.2, -state.gap);
    m.root.rotation.set(0, 0, (1 - rise) * 1.45);
    m.root.scale.setScalar(1.15);
    m.pelvis.position.set(wave * 0.018 * effort, 0.47 + bob, 0);
    m.pelvis.rotation.set(0, wave * 0.08 * effort, Math.cos(phase) * 0.04 * effort);
    m.torso.rotation.set(
      -0.13 * effort + pulse * 0.025 * effort,
      -wave * 0.12 * effort,
      -Math.cos(phase) * 0.025 * effort,
    );
    m.torso.scale.set(
      1 - pulse * 0.012 * effort,
      1 + pulse * 0.018 * effort,
      1 - pulse * 0.008 * effort,
    );
    // Cabeça estabiliza o olhar; a espiada para trás entra e sai sem giro brusco do pescoço.
    const glance = running ? Math.max(0, Math.sin(state.time * 0.9)) ** 8 : 0;
    m.head.rotation.set(
      0.06 * effort + Math.sin(phase * 2 - 0.5) * 0.025 * effort,
      glance * 1.8 + wave * 0.04 * effort,
      Math.cos(phase - 0.4) * 0.025 * effort,
    );
    for (let i = 0; i < 2; i++) {
      const cycle = (((phase / (Math.PI * 2) + i * 0.5) % 1) + 1) % 1;
      const stance = cycle < 0.38,
        t = stance ? cycle / 0.38 : (cycle - 0.38) / 0.62;
      const z = stance ? -0.27 + t * 0.54 : 0.27 - 0.54 * (t * t * (3 - 2 * t));
      const footY = 0.125 + (stance ? 0 : Math.sin(t * Math.PI) * 0.19);
      if (running) this.legPose(m.legs[i], z, footY, 0.5 + bob);
      else {
        m.legs[i].hip.rotation.x = 0;
        m.legs[i].knee.rotation.x = 0;
        m.legs[i].ankle.rotation.x = 0;
      }
      const opposite = Math.cos(phase + i * Math.PI);
      m.arms[i].shoulder.rotation.set(
        0.12 - opposite * 0.45 * effort,
        0,
        (i === 0 ? -0.1 : 0.1) + wave * 0.025 * effort,
      );
      m.arms[i].elbow.rotation.x = 0.25 + Math.sin(phase + i * Math.PI - 0.4) * 0.18 * effort;
      m.ears[i].rotation.set(
        Math.sin(phase * 2 - 0.7) * 0.06 * effort,
        0,
        Math.sin(phase - 0.5 + i) * 0.05 * effort,
      );
      m.bow[i].rotation.set(
        Math.sin(phase * 2 - 0.8) * 0.1 * effort,
        0,
        Math.sin(phase - 1 + i) * 0.07 * effort,
      );
    }
    // O lançamento tem impulso e retorno contínuos, sem travar o braço em uma pose única.
    const age = Math.min(...state.obstacles.map((obstacle) => obstacle.age));
    const throwWeight = age >= 0 && age < 0.65 ? Math.sin((Math.PI * age) / 0.65) : 0;
    m.arms[0].shoulder.rotation.x -= throwWeight * 1.45;
    m.arms[0].elbow.rotation.x += throwWeight * 0.65;
    m.torso.rotation.y += throwWeight * 0.16;
    m.root.visible = state.stage !== 'COMPLETE';
    if (state.stage === 'CHEST_RETURN') {
      const p = clamp(state.age / C.stages.CHEST_RETURN, 0, 1);
      m.root.position.y = Math.sin(p * Math.PI) * 1.5;
      m.root.scale.setScalar(1.15 * (1 - 0.95 * p));
      m.root.visible = p < 0.96;
    }
  }
}
