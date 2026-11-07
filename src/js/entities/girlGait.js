const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (t) => t * t * (3 - 2 * t);
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);

/** Interpola chaves com velocidade nula nos extremos, inclusive no fechamento do ciclo. */
function curve(t, keys) {
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [a, av] = keys[i - 1],
        [b, bv] = keys[i];
      return av + (bv - av) * smooth(clamp((t - a) / (b - a), 0, 1));
    }
  }
  return keys.at(-1)[1];
}

/** A pintura é lateral: pernas e tronco conservam o mesmo perfil em qualquer deslocamento no piso. */
export function girlGaitDirection() {
  // O espelhamento do ator escolhe esquerda/direita; o movimento vertical não gira só as pernas.
  return {
    x: 1,
    y: 0,
  };
}

/** Atuação contínua por distância; o pé apoiado recua exatamente o deslocamento no piso. */
export function sampleGirlLocomotion(
  distance,
  carrying = false,
  amount = 1,
  direction = {
    x: 1,
    y: 0,
  },
) {
  const stride = 300,
    phase = (((distance / stride) % 1) + 1) % 1;
  const blend = smooth(clamp(amount, 0, 1));
  const length = Math.hypot(direction.x, direction.y) || 1;
  const dx = direction.x / length,
    dy = direction.y / length;
  // Em profundidade, o apoio é mais curto; evita alongar a perna frontal além da anatomia.
  const stance = 0.14 + 0.16 * Math.pow(Math.abs(dx), 4),
    reach = (stride * stance) / 2;
  const step = (phase * 2) % 1,
    toeOff = stance * 2;
  const bob =
    (7 +
      curve(step, [
        [0, 0],
        [0.12, carrying ? 3 : 5],
        [toeOff, carrying ? -1 : -2],
        [(toeOff + 1) / 2, carrying ? -5 : -8],
        [1, 0],
      ])) *
    blend;
  const pelvisX = Math.sin(phase * TAU) * (carrying ? 1 : 2) * blend;
  const torsoAngle =
    ((carrying ? -0.018 : 0.045) * dx + Math.sin(phase * TAU) * (carrying ? 0.012 : 0.026)) * blend;
  const legs = [0, 0.5].map((offset, index) => {
    const t = (phase + offset) % 1,
      planted = t < stance;
    const u = planted ? t / stance : (t - stance) / (1 - stance);
    const brake = 0.08,
      travel = stride * (1 - stance),
      end = reach + (travel * brake) / 2;
    let along;
    if (planted) along = reach - stride * t;
    else if (u < brake) along = -reach - travel * (u - (u * u) / (2 * brake));
    else if (u > 1 - brake) {
      const v = 1 - u;
      along = reach + travel * (v - (v * v) / (2 * brake));
    } else along = -end + 2 * end * smoother((u - brake) / (1 - 2 * brake));
    const lift = planted
      ? 0
      : curve(u, [
          [0, 0],
          [0.12, carrying ? 12 : 16],
          [0.45, carrying ? 17 : 24],
          [0.82, carrying ? 13 : 18],
          [1, 0],
        ]) * blend;
    const groundY = along * dy * blend;
    const soleY = groundY - lift;
    const ankle = {
      x: (index ? 7 : -17) + along * dx * blend,
      y: soleY - 23,
    };
    const hip = {
      x: (index ? 10 : -12) + pelvisX,
      y: -65 + bob,
    };
    const ax = ankle.x - hip.x,
      ay = ankle.y - hip.y;
    const span = Math.hypot(ax, ay),
      upper = 34,
      lower = 34;
    const cosine = clamp((upper * upper + span * span - lower * lower) / (2 * upper * span), -1, 1);
    const alongBone = upper * cosine,
      across = upper * Math.sqrt(1 - cosine * cosine);
    const knee = {
      x: hip.x + ax * 0.54 + ((ax * alongBone + ay * across) / span - ax * 0.54) * blend,
      y: hip.y + ay * 0.54 + ((ay * alongBone - ax * across) / span - ay * 0.54) * blend,
    };
    // A vista da sala encurta a projeção do joelho em profundidade, sem fazê-lo girar em torno do quadril.
    const side = Math.abs(dx);
    const projectedX = hip.x + ax * 0.52 + (index ? 1 : -1) * lift * 0.1;
    const projectedY = hip.y + ay * 0.52 - lift * 0.06;
    knee.x = projectedX + (knee.x - projectedX) * side;
    knee.y = projectedY + (knee.y - projectedY) * side;
    const footAngle =
      (planted
        ? curve(u, [
            [0, -0.12],
            [0.22, 0],
            [0.65, 0],
            [1, 0.2],
          ])
        : curve(u, [
            [0, 0.2],
            [0.35, -0.38],
            [0.78, -0.24],
            [1, -0.12],
          ])) *
      blend *
      (0.35 + 0.65 * Math.abs(dx));
    return {
      hip,
      knee,
      ankle,
      planted,
      soleY,
      groundY,
      footAngle,
      lift,
      phase: t,
    };
  });
  return {
    phase,
    stride,
    stance,
    bob,
    pelvisX,
    torsoAngle,
    headAngle: -torsoAngle * 0.7 + Math.sin(phase * TAU - 0.4) * 0.006 * blend,
    headY: -bob * 0.24 + Math.sin(phase * TAU - 0.3) * 0.7 * blend,
    skirtAngle: Math.sin(phase * TAU - 0.6) * (carrying ? 0.014 : 0.025) * blend,
    armSwing: Math.sin(phase * TAU) * 0.22 * blend * (0.6 + 0.4 * Math.abs(dx)),
    hairAngle: Math.sin(phase * TAU - 0.9) * 0.012 * blend,
    legs,
  };
}
