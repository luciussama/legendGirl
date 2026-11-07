import { CHASE_FALL_DURATION, isChaseDefeat } from './chaseHealth.js';
import * as T from '../../vendor/three/three.module.js';

/** Coordena peso, contrabalanço e movimento secundário sem alterar o domínio da corrida. */
export class ChaseGirlAnimation {
  /** Guarda rig e amostras de deslocamento usadas somente pela inclinação de apresentação. */
  constructor(model) {
    this.model = model;
    this.lastX = 0;
    this.lastTime = null;
    this.lean = 0;
    this.target = new T.Vector3();
    this.direction = new T.Vector3();
    this.down = new T.Vector3(0, -1, 0);
    this.axis = new T.Vector3(1, 0, 0);
    this.bend = new T.Quaternion();
    this.rootRotation = new T.Quaternion();
    this.parentRotation = new T.Quaternion();
  }
  /** Resolve os comprimentos reais no espaço do quadril e mantém a sola paralela ao piso. */
  legPose(leg, z, y) {
    const m = this.model;
    m.root.updateWorldMatrix(true, false);
    m.pelvis.updateWorldMatrix(true, false);
    this.target.set(leg.hip.position.x, y - m.root.position.y, z);
    m.root.localToWorld(this.target);
    m.pelvis.worldToLocal(this.target);
    this.direction.copy(this.target).sub(leg.hip.position);
    const { thigh, shin } = leg,
      distance = T.MathUtils.clamp(
        this.direction.length(),
        Math.abs(thigh - shin) + 0.00001,
        thigh + shin - 0.00001,
      );
    const knee = -Math.acos(
      T.MathUtils.clamp(
        (distance * distance - thigh * thigh - shin * shin) / (2 * thigh * shin),
        -1,
        1,
      ),
    );
    const hip = Math.acos(
      T.MathUtils.clamp(
        (thigh * thigh + distance * distance - shin * shin) / (2 * thigh * distance),
        -1,
        1,
      ),
    );
    leg.hip.quaternion
      .setFromUnitVectors(this.down, this.direction.normalize())
      .multiply(this.bend.setFromAxisAngle(this.axis, hip));
    leg.knee.rotation.x = knee;
    leg.knee.updateWorldMatrix(true, false);
    leg.knee.getWorldQuaternion(this.parentRotation);
    m.root.getWorldQuaternion(this.rootRotation);
    leg.ankle.quaternion.copy(this.parentRotation.invert()).multiply(this.rootRotation);
  }
  /** Aplica o mesmo ciclo aos apoios, quadril, ombros e acessórios, com atrasos próprios para cada massa. */
  apply(state) {
    const m = this.model,
      run = state.stage === 'RUNNING' || isChaseDefeat(state.stage),
      walk = state.stage === 'GIRL_APPROACH',
      moving = run || walk;
    const phase = run ? (state.distance * Math.PI) / 2 : (state.age * Math.PI) / 0.65;
    const dt = this.lastTime === null ? 0 : state.time - this.lastTime;
    if (dt > 0 && dt < 0.25) {
      const velocity = (state.x - this.lastX) / dt;
      this.lean += (Math.max(-1, Math.min(1, velocity / 6)) - this.lean) * (1 - Math.exp(-dt * 12));
    }
    if (dt < 0 || dt > 0.25 || !moving) this.lean = 0;
    this.lastTime = state.time;
    this.lastX = state.x;
    const stride = Math.sin(phase),
      step = Math.cos(phase * 2 - 0.3),
      effort = run ? 1 : walk ? 0.38 : 0;
    const breathe = Math.sin(state.time * 2.2);
    // Dois impulsos por ciclo: o corpo comprime no apoio e recupera altura entre passos.
    const rootY = run
      ? -0.132 + 0.08 * Math.sin(phase - 0.15) ** 2
      : walk
        ? -0.095 + 0.024 * Math.sin(phase) ** 2
        : -0.041 + breathe * 0.004;
    const stumble = Math.min(1, Math.max(0, state.stumble || 0) / 0.3);
    m.root.position.set(state.x, rootY, 0);
    m.root.rotation.set(0, -this.lean * 0.17, 0);
    m.root.visible = !(state.immunity > 0 && Math.floor(state.time * 14) % 2 === 0);
    const hipRoll = Math.cos(phase) * 0.045 * effort;
    m.pelvis.position.x = stride * 0.024 * effort;
    m.pelvis.rotation.set(0, stride * 0.12 * effort, hipRoll);
    const torsoPitch = (run ? -0.18 : walk ? -0.035 : 0) + step * 0.045 * effort - stumble * 0.28;
    const torsoRoll = -hipRoll * 0.75 - this.lean * 0.16 + stumble * 0.12;
    m.torso.rotation.set(torsoPitch, -stride * 0.17 * effort, torsoRoll);
    // A cabeça estabiliza o olhar enquanto peito e quadril transferem o peso.
    m.head.rotation.set(-torsoPitch * 0.48, -m.torso.rotation.y * 0.42, -torsoRoll * 0.55);
    m.skirt.rotation.set(
      Math.sin(phase * 2 - 0.65) * 0.085 * effort,
      -stride * 0.035 * effort,
      Math.sin(phase - 0.55) * 0.045 * effort - this.lean * 0.04,
    );
    m.skirt.position.y = 0.13 + Math.sin(phase * 2 - 0.8) * 0.009 * effort;
    m.skirt.scale.set(
      1 + Math.sin(phase * 2 - 0.7) * 0.018 * effort,
      1,
      1 + (1 - step) * 0.025 * effort,
    );
    for (const { tail, tip, side } of m.pigtails) {
      tail.rotation.set(
        (run ? -0.12 : 0) + Math.sin(phase * 2 - 0.85) * (moving ? 0.13 : 0.018),
        Math.sin(phase - 0.6) * (moving ? 0.13 : 0.01),
        side * Math.sin(phase - 0.8) * 0.08 * effort + this.lean * 0.12,
      );
      tip.rotation.set(
        Math.sin(phase * 2 - 1.5) * (moving ? 0.24 : 0.015),
        Math.sin(phase - 1.1) * 0.09 * effort,
        side * Math.sin(phase - 1.4) * 0.07 * effort,
      );
    }
    for (let i = 0; i < 2; i++) {
      const cycle = (((phase / (Math.PI * 2) + i * 0.5) % 1) + 1) % 1;
      const stance = cycle < 0.5,
        t = stance ? cycle * 2 : (cycle - 0.5) * 2;
      const reach = run ? 0.19 : walk ? 0.09 : 0;
      const z = stance
        ? -reach + t * reach * 2
        : reach - Math.sin((t * Math.PI) / 2) ** 2 * reach * 2;
      const footY =
        m.proportions.soleHeight +
        (moving && !stance ? Math.sin(t * Math.PI) * (run ? 0.17 : 0.065) : 0);
      this.legPose(m.legs[i], z, footY);
      const wave = Math.cos(phase + i * Math.PI),
        swordArm = i === 1;
      // O braço livre contrabalança a passada; a mão da espada tem arco menor e cotovelo flexível.
      const shoulder = moving
        ? (swordArm ? 0.32 : 0.15) - wave * (swordArm ? 0.24 : 0.42) * effort - stumble * 0.25
        : 0.12;
      m.arms[i].shoulder.rotation.set(
        shoulder,
        Math.sin(phase - 0.35) * (swordArm ? 0.055 : 0.09) * effort,
        swordArm ? -0.23 + wave * 0.055 * effort : -0.12 - wave * 0.07 * effort,
      );
      m.arms[i].elbow.rotation.set(
        moving
          ? 0.95 + Math.sin(phase + i * Math.PI - 0.45) * (swordArm ? 0.14 : 0.28) * effort
          : 0.8,
        0,
        swordArm ? 0 : -0.035 * effort,
      );
    }
    m.sword.rotation.x = moving ? 0.9 + Math.sin(phase - 0.65) * 0.065 * effort : 1.1;
    if (isChaseDefeat(state.stage)) this.fall(state);
  }

  /** Encena a queda para a frente e mantém a menina no chão após esgotar as vidas. */
  fall(state) {
    const m = this.model;
    const t = state.stage === 'GAME_OVER' ? 1 : Math.min(1, state.age / CHASE_FALL_DURATION);
    const progress = t * t * (3 - 2 * t);
    m.root.visible = true;
    m.root.rotation.set(-Math.PI * 0.48 * progress, 0, 0.08 * Math.sin(t * Math.PI));
    m.root.position.y += 0.46 * progress;
    m.torso.rotation.set(-0.18 * (1 - progress), 0, 0);
    m.head.rotation.set(0, 0, 0);
    m.pelvis.rotation.set(0, 0, 0);
    m.skirt.rotation.set(0, 0, 0);
    // O cabelo cai para o lado, em vez de permanecer espetado acima das costas.
    for (const { tail, tip, side } of m.pigtails) {
      tail.rotation.set(0, side * 0.5 * progress, side * 0.22 * progress);
      tip.rotation.set(0, 0, 0);
    }
    for (const leg of m.legs) {
      leg.hip.rotation.x *= 1 - progress;
      leg.knee.rotation.x *= 1 - progress;
      leg.ankle.rotation.x *= 1 - progress;
    }
    for (const arm of m.arms) {
      arm.shoulder.rotation.x = -Math.PI * progress;
      arm.elbow.rotation.x = 0.8 * (1 - progress);
    }
    m.sword.rotation.x *= 1 - progress;
  }
}
