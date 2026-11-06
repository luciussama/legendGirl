import * as T from '../../../vendor/three/three.module.js';
import { PropParts } from './ChasePropResources.js';
import { oval, profile, rounded, curve, rod, outline } from './decorativeGeometry.js';

/** Ursinho sentado, com cabeça larga, patas grandes, focinho caramelo e bordados da fonte. */
function teddy(p, m) {
  oval(p, m.fur, [0, 0.36, 0], [0.255, 0.29, 0.19]);
  oval(p, m.fur, [0, 0.76, 0.015], [0.265, 0.24, 0.215]);
  for (const side of [-1, 1]) {
    oval(p, m.fur, [side * 0.205, 0.94, 0.005], [0.105, 0.105, 0.073]);
    oval(p, m.pad, [side * 0.205, 0.944, 0.068], [0.065, 0.065, 0.018]);
    oval(p, m.fur, [side * 0.255, 0.36, 0.055], [0.098, 0.215, 0.1], [0, 0, -side * 0.2]);
    oval(p, m.fur, [side * 0.18, 0.125, 0.17], [0.15, 0.125, 0.175]);
    oval(p, m.pad, [side * 0.18, 0.13, 0.32], [0.105, 0.086, 0.025]);
    oval(p, m.dark, [side * 0.087, 0.8, 0.218], [0.024, 0.029, 0.019]);
    oval(p, m.glint, [side * 0.092, 0.81, 0.234], [0.006, 0.007, 0.004]);
    const bow = outline([
      ['M', 0, 0],
      ['Q', side * 0.15, 0.09, side * 0.145, 0.015],
      ['Q', side * 0.14, -0.09, 0, 0],
      ['Z'],
    ]);
    profile(p, m.saddle, bow, 0.033, [0, 0.55, 0.2], 0.004);
  }
  oval(p, m.pad, [0, 0.687, 0.207], [0.138, 0.1, 0.065]);
  oval(p, m.dark, [0, 0.72, 0.268], [0.044, 0.029, 0.017]);
  curve(
    p,
    m.thread,
    [
      [0, 0.7, 0.273],
      [0, 0.67, 0.275],
      [-0.045, 0.65, 0.259],
    ],
    0.005,
  );
  curve(
    p,
    m.thread,
    [
      [0, 0.67, 0.275],
      [0.045, 0.65, 0.259],
    ],
    0.005,
  );
  oval(p, m.saddle, [0, 0.55, 0.222], [0.032, 0.04, 0.026]);
  for (let i = 0; i < 6; i++)
    rod(p, m.thread, [-0.012, 0.22 + i * 0.035, 0.182], [0.012, 0.23 + i * 0.035, 0.19], 0.003);
}
/** Robô de lata: cabeça arredondada, rosto de latão, membros articulados e chave de corda. */
function robot(p, m) {
  rounded(p, m.teal, [0, 0.51, 0], [0.35, 0.34, 0.25], 0.055, 0.018);
  rounded(p, m.brass, [0, 0.51, 0.135], [0.29, 0.28, 0.025], 0.035, 0.003);
  rounded(p, m.teal, [0, 0.51, 0.151], [0.25, 0.24, 0.02], 0.025, 0.003);
  rounded(p, m.teal, [0, 0.87, 0], [0.43, 0.29, 0.3], 0.07, 0.018);
  rounded(p, m.brass, [0, 0.87, 0.16], [0.34, 0.2, 0.023], 0.045, 0.003);
  for (const side of [-1, 1]) {
    p.cylinder(m.brass, [side * 0.24, 0.87, 0], 0.075, 0.075, 0.055, [0, 0, Math.PI / 2]);
    p.cylinder(m.saddle, [side * 0.27, 0.87, 0], 0.05, 0.05, 0.02, [0, 0, Math.PI / 2]);
    oval(p, m.dark, [side * 0.09, 0.895, 0.18], [0.022, 0.028, 0.014]);
    oval(p, m.glint, [side * 0.095, 0.904, 0.193], [0.005, 0.006, 0.003]);
    oval(p, m.brass, [side * 0.23, 0.65, 0], [0.075, 0.075, 0.075]);
    rounded(p, m.teal, [side * 0.265, 0.54, 0], [0.09, 0.15, 0.11], 0.035);
    oval(p, m.brass, [side * 0.265, 0.43, 0], [0.057, 0.057, 0.057]);
    rounded(p, m.teal, [side * 0.265, 0.34, 0.015], [0.085, 0.13, 0.1], 0.025);
    oval(p, m.saddle, [side * 0.265, 0.25, 0.025], [0.061, 0.06, 0.057]);
    rounded(p, m.teal, [side * 0.105, 0.265, 0], [0.105, 0.16, 0.12], 0.025);
    p.cylinder(m.brass, [side * 0.105, 0.175, 0], 0.06, 0.06, 0.065, [Math.PI / 2, 0, 0]);
    rounded(p, m.teal, [side * 0.105, 0.11, 0.025], [0.105, 0.1, 0.13], 0.02);
    rounded(p, m.saddle, [side * 0.105, 0.035, 0.065], [0.19, 0.07, 0.27], 0.025);
    rounded(p, m.teal, [side * 0.105, 0.075, 0.05], [0.17, 0.035, 0.24], 0.02, 0.005);
  }
  curve(
    p,
    m.dark,
    [
      [-0.045, 0.847, 0.18],
      [0, 0.832, 0.184],
      [0.045, 0.847, 0.18],
    ],
    0.005,
  );
  p.cylinder(m.brass, [0, 0.55, 0.175], 0.07, 0.07, 0.023, [Math.PI / 2, 0, 0]);
  p.cylinder(m.saddle, [0, 0.55, 0.19], 0.047, 0.047, 0.018, [Math.PI / 2, 0, 0]);
  for (const y of [0.4, 0.43, 0.46])
    rounded(p, m.brass, [0, y, 0.178], [0.13, 0.014, 0.016], 0.004, 0.002);
  rod(p, m.brass, [0, 1.02, 0], [0, 1.12, 0], 0.014);
  oval(p, m.brass, [0, 1.13, 0], [0.035, 0.035, 0.035]);
  rod(p, m.brass, [0.16, 0.51, -0.1], [0.32, 0.51, -0.1], 0.021);
  for (const y of [0.46, 0.57]) p.ring(m.brass, [0.32, y, -0.1], 0.044, 0.015, [0, Math.PI / 2, 0]);
}
/** Patinho de perfil: corpo baixo e largo, cauda levantada, bico bipartido e asas esculpidas. */
function duck(p, m) {
  oval(p, m.rubber, [-0.035, 0.245, 0], [0.37, 0.245, 0.265]);
  oval(p, m.rubber, [0.2, 0.565, 0], [0.245, 0.245, 0.222]);
  oval(p, m.rubber, [-0.345, 0.355, 0], [0.19, 0.075, 0.13], [0, 0, -0.8]);
  oval(p, m.rubber, [-0.45, 0.45, 0], [0.07, 0.06, 0.085]);
  oval(p, m.beak, [0.425, 0.493, 0], [0.125, 0.052, 0.113]);
  oval(p, m.beak, [0.425, 0.452, 0], [0.105, 0.028, 0.09]);
  curve(
    p,
    m.beakShade,
    [
      [0.54, 0.47, 0],
      [0.49, 0.467, 0.09],
      [0.4, 0.469, 0.103],
    ],
    0.004,
  );
  for (const side of [-1, 1]) {
    oval(p, m.dark, [0.29, 0.6, side * 0.202], [0.026, 0.033, 0.012]);
    oval(p, m.glint, [0.299, 0.613, side * 0.212], [0.007, 0.009, 0.004]);
    oval(p, m.rubber, [-0.14, 0.275, side * 0.235], [0.205, 0.125, 0.055], [0, 0, -0.2]);
    for (let i = 0; i < 3; i++)
      curve(
        p,
        m.rubberShade,
        [
          [-0.29 + i * 0.02, 0.325 - i * 0.038, side * 0.274],
          [-0.16, 0.27 - i * 0.03, side * 0.293],
          [0.025, 0.29 - i * 0.031, side * 0.27],
        ],
        0.009,
      );
  }
  p.cylinder(m.brass, [0.2, 0.802, 0], 0.12, 0.13, 0.045);
  p.ring(m.brass, [0.2, 0.83, 0], 0.12, 0.013, [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3,
      x = 0.2 + Math.cos(a) * 0.095,
      z = Math.sin(a) * 0.095,
      y = 0.91 + (i === 0 ? 0.025 : 0);
    p.cylinder(m.brass, [x, (0.83 + y) / 2, z], 0.018, 0.035, y - 0.83);
    oval(p, m.brass, [x, y, z], [0.035, 0.035, 0.035]);
  }
}
/** Tambor de madeira pintada, pele tensionada e cordas alternadas presas aos aros. */
function drum(p, m) {
  p.cylinder(m.drum, [0, 0.255, 0], 0.325, 0.31, 0.43, [0, 0, 0], 48);
  p.cylinder(m.skin, [0, 0.486, 0], 0.315, 0.315, 0.022, [0, 0, 0], 48);
  for (const y of [0.04, 0.465]) {
    p.cylinder(m.brass, [0, y, 0], 0.344, 0.344, 0.045, [0, 0, 0], 48);
    p.ring(m.brass, [0, y + 0.023, 0], 0.326, 0.018, [Math.PI / 2, 0, 0]);
  }
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6,
      b = ((i + 1) * Math.PI) / 6,
      y = i % 2 ? 0.09 : 0.425,
      yy = i % 2 ? 0.425 : 0.09;
    rod(
      p,
      m.brass,
      [Math.cos(a) * 0.335, y, Math.sin(a) * 0.335],
      [Math.cos(b) * 0.335, yy, Math.sin(b) * 0.335],
      0.012,
    );
    oval(p, m.brass, [Math.cos(a) * 0.338, y, Math.sin(a) * 0.338], [0.024, 0.024, 0.024]);
  }
}
/** Bobo com gola recortada e gorro curvo, ligado por mola à caixa roxa com losango e rebites. */
function jack(p, m) {
  rounded(p, m.purple, [0, 0.25, 0], [0.54, 0.5, 0.46], 0.018, 0.01);
  for (const x of [-0.26, 0.26])
    for (const z of [-0.22, 0.22])
      rounded(p, m.brass, [x, 0.25, z], [0.025, 0.5, 0.025], 0.004, 0.002);
  for (const y of [0.025, 0.485]) rounded(p, m.brass, [0, y, 0], [0.56, 0.035, 0.48], 0.01, 0.004);
  const diamond = outline([
    ['M', 0, 0.105],
    ['L', 0.095, 0],
    ['L', 0, -0.105],
    ['L', -0.095, 0],
    ['Z'],
  ]);
  profile(p, m.brass, diamond, 0.018, [0, 0.25, 0.24], 0.003);
  for (const x of [-0.22, 0.22])
    for (const y of [0.08, 0.42]) oval(p, m.brass, [x, y, 0.238], [0.014, 0.014, 0.012]);
  rounded(p, m.purple, [0, 0.66, -0.26], [0.53, 0.33, 0.035], 0.015, 0.004);
  for (const x of [-0.26, 0.26])
    rounded(p, m.brass, [x, 0.66, -0.23], [0.02, 0.34, 0.02], 0.004, 0.002);
  const spring = [];
  for (let i = 0; i <= 100; i++) {
    const a = (i * Math.PI * 6) / 100;
    spring.push([Math.cos(a) * 0.075, 0.5 + i * 0.0027, Math.sin(a) * 0.075]);
  }
  curve(p, m.brass, spring, 0.012);
  oval(p, m.pink, [0, 0.83, 0], [0.145, 0.125, 0.11]);
  oval(p, m.face, [0, 1.035, 0.02], [0.155, 0.15, 0.13]);
  for (const side of [-1, 1]) {
    curve(
      p,
      m.pink,
      [
        [side * 0.08, 0.87, 0],
        [side * 0.18, 0.845, 0.01],
        [side * 0.25, 0.94, 0.025],
      ],
      0.035,
    );
    oval(p, m.face, [side * 0.25, 0.95, 0.025], [0.047, 0.047, 0.04]);
    oval(p, m.dark, [side * 0.05, 1.065, 0.143], [0.018, 0.022, 0.011]);
    oval(p, m.pink, [side * 0.09, 1.015, 0.134], [0.03, 0.023, 0.009]);
    const hat = outline([
      ['M', side * 0.01, 1.15],
      ['Q', side * 0.12, 1.39, side * 0.235, 1.19],
      ['Q', side * 0.25, 1.15, side * 0.2, 1.14],
      ['Q', side * 0.16, 1.24, side * 0.12, 1.13],
      ['Z'],
    ]);
    profile(p, side < 0 ? m.pink : m.saddle, hat, 0.14, [0, 0, 0.01], 0.012);
    oval(p, m.brass, [side * 0.22, 1.17, 0.015], [0.034, 0.034, 0.034]);
  }
  for (let i = 0; i < 7; i++) {
    const a = (i * Math.PI * 2) / 7;
    oval(
      p,
      m.brass,
      [Math.cos(a) * 0.13, 0.92 + Math.sin(a) * 0.035, Math.sin(a) * 0.09],
      [0.036, 0.025, 0.025],
    );
  }
  oval(p, m.saddle, [0, 1.03, 0.159], [0.027, 0.028, 0.022]);
  curve(
    p,
    m.dark,
    [
      [-0.045, 0.99, 0.14],
      [0, 0.973, 0.15],
      [0.045, 0.99, 0.14],
    ],
    0.004,
  );
}
/** Poltrona larga: encosto em arco, almofada, braços enrolados, vivo costurado e capitonê. */
function armchair(p, m) {
  for (const x of [-0.46, 0.46])
    for (const z of [-0.32, 0.32])
      p.cylinder(m.oak, [x, 0.075, z], 0.095, 0.1, 0.15, [0, 0, 0], 28);
  rounded(p, m.fabric, [0, 0.32, 0.01], [1.17, 0.34, 0.92], 0.09, 0.035);
  rounded(p, m.fabric, [0, 0.51, 0.09], [0.94, 0.22, 0.79], 0.1, 0.045);
  const back = outline([
    ['M', -0.56, 0.36],
    ['L', -0.56, 0.9],
    ['C', -0.56, 1.58, 0.56, 1.58, 0.56, 0.9],
    ['L', 0.56, 0.36],
    ['Z'],
  ]);
  profile(p, m.fabric, back, 0.25, [0, 0, -0.33], 0.035);
  curve(
    p,
    m.piping,
    [
      [-0.51, 0.54, -0.175],
      [-0.51, 0.96, -0.175],
      [-0.34, 1.29, -0.175],
      [0, 1.39, -0.175],
      [0.34, 1.29, -0.175],
      [0.51, 0.96, -0.175],
      [0.51, 0.54, -0.175],
    ],
    0.009,
  );
  for (const side of [-1, 1]) {
    rounded(p, m.fabric, [side * 0.55, 0.54, 0.04], [0.29, 0.62, 0.88], 0.12, 0.035);
    p.cylinder(m.fabric, [side * 0.55, 0.78, 0.04], 0.166, 0.166, 0.86, [Math.PI / 2, 0, 0], 36);
    p.ring(m.piping, [side * 0.55, 0.78, 0.476], 0.14, 0.009);
    curve(
      p,
      m.piping,
      [
        [side * 0.64, 0.65, 0.48],
        [side * 0.64, 0.39, 0.48],
        [side * 0.59, 0.24, 0.48],
      ],
      0.007,
    );
  }
  curve(
    p,
    m.piping,
    [
      [-0.44, 0.51, 0.49],
      [-0.3, 0.47, 0.5],
      [0.3, 0.47, 0.5],
      [0.44, 0.51, 0.49],
    ],
    0.007,
  );
  for (const x of [-0.21, 0.21])
    for (const y of [0.85, 1.13]) {
      oval(p, m.piping, [x, y, -0.18], [0.026, 0.026, 0.015]);
      for (const side of [-1, 1])
        curve(
          p,
          m.fabricShade,
          [
            [x + side * 0.065, y + 0.07, -0.182],
            [x + side * 0.025, y + 0.025, -0.178],
            [x, y, -0.175],
          ],
          0.003,
        );
    }
}
/** Cavalinho esculpido de perfil: pescoço integrado, crina contínua, sela e patins de madeira maciça. */
function horse(p, m) {
  for (const side of [-1, 1]) {
    const rocker = outline([
      ['M', -0.94, 0.26],
      ['Q', 0, -0.13, 0.94, 0.26],
      ['L', 0.96, 0.35],
      ['Q', 0, -0.015, -0.96, 0.35],
      ['Z'],
    ]);
    profile(p, m.horse, rocker, 0.105, [0, 0, side * 0.27], 0.012);
    for (const x of [-0.43, 0.43]) {
      rounded(p, m.horse, [x, 0.48, side * 0.23], [0.12, 0.58, 0.12], 0.045, 0.015);
      p.parts[p.parts.length - 1].rotation[2] = Math.sign(x) * 0.4;
      p.cylinder(m.brass, [x, 0.25, side * 0.335], 0.035, 0.035, 0.016, [Math.PI / 2, 0, 0]);
    }
  }
  const body = outline([
    ['M', 0.45, 0.65],
    ['C', 0.0, 0.52, -0.36, 0.55, -0.44, 0.67],
    ['Q', -0.49, 0.79, -0.5, 1.03],
    ['L', -0.69, 1.0],
    ['Q', -0.88, 0.97, -0.84, 1.12],
    ['L', -0.65, 1.28],
    ['Q', -0.6, 1.38, -0.49, 1.3],
    ['Q', -0.34, 1.25, -0.32, 1.11],
    ['L', -0.25, 0.93],
    ['Q', -0.01, 0.84, 0.27, 0.94],
    ['Q', 0.59, 1.0, 0.52, 0.77],
    ['Q', 0.5, 0.68, 0.45, 0.65],
    ['Z'],
  ]);
  profile(p, m.horse, body, 0.37, [0, 0, 0], 0.035);
  oval(p, m.horse, [0.02, 0.745, 0], [0.465, 0.205, 0.222]);
  const muzzle = outline([
    ['M', -0.81, 1.03],
    ['Q', -0.87, 1.13, -0.76, 1.18],
    ['L', -0.67, 1.15],
    ['L', -0.7, 1.02],
    ['Q', -0.77, 0.97, -0.81, 1.03],
    ['Z'],
  ]);
  profile(p, m.face, muzzle, 0.415, [0, 0, 0], 0.018);
  const mane = outline([
    ['M', -0.48, 1.31],
    ['Q', -0.3, 1.34, -0.28, 1.16],
    ['Q', -0.18, 1.11, -0.21, 1.01],
    ['Q', -0.1, 0.94, -0.18, 0.85],
    ['L', -0.31, 0.86],
    ['Q', -0.39, 1.05, -0.42, 1.18],
    ['Z'],
  ]);
  profile(p, m.mane, mane, 0.4, [0, 0, 0], 0.017);
  const tail = outline([
    ['M', 0.39, 0.86],
    ['C', 0.67, 1.16, 0.72, 0.75, 0.98, 0.93],
    ['Q', 1.11, 1.04, 1.08, 0.91],
    ['C', 0.93, 0.58, 0.64, 0.53, 0.44, 0.66],
    ['Z'],
  ]);
  profile(p, m.mane, tail, 0.18, [0, 0, 0], 0.018);
  const forelock = outline([
    ['M', -0.63, 1.27],
    ['Q', -0.74, 1.37, -0.57, 1.4],
    ['Q', -0.4, 1.35, -0.52, 1.25],
    ['Z'],
  ]);
  profile(p, m.mane, forelock, 0.415, [0, 0, 0], 0.012);
  oval(p, m.teal, [0.07, 0.9, 0], [0.31, 0.07, 0.23]);
  oval(p, m.saddle, [0.07, 0.935, 0], [0.27, 0.065, 0.2]);
  for (const side of [-1, 1]) {
    oval(p, m.horse, [-0.5, 1.36, side * 0.105], [0.048, 0.12, 0.035], [0, 0, -0.25]);
    oval(p, m.mane, [-0.5, 1.37, side * 0.129], [0.022, 0.068, 0.009], [0, 0, -0.25]);
    oval(p, m.dark, [-0.63, 1.2, side * 0.2], [0.023, 0.029, 0.012]);
    oval(p, m.glint, [-0.635, 1.21, side * 0.21], [0.006, 0.007, 0.003]);
    oval(p, m.dark, [-0.79, 1.095, side * 0.221], [0.014, 0.019, 0.009]);
    curve(
      p,
      m.saddle,
      [
        [-0.73, 1.18, side * 0.19],
        [-0.68, 1.1, side * 0.2],
        [-0.67, 1.02, side * 0.18],
      ],
      0.014,
    );
    curve(
      p,
      m.saddle,
      [
        [-0.69, 1.1, side * 0.2],
        [-0.55, 1.16, side * 0.2],
        [-0.49, 1.26, side * 0.18],
      ],
      0.009,
    );
    p.cylinder(m.brass, [-0.69, 1.08, side * 0.217], 0.021, 0.021, 0.013, [Math.PI / 2, 0, 0]);
    p.cylinder(m.brass, [0.29, 0.89, side * 0.222], 0.026, 0.026, 0.018, [Math.PI / 2, 0, 0]);
  }
  rod(p, m.horse, [-0.48, 1.12, -0.28], [-0.48, 1.12, 0.28], 0.029);
}
/** Mesa com tampo espesso, borda torneada e suportes curvos cruzados largos como no original. */
function table(p, m) {
  p.cylinder(m.table, [0, 0.85, 0], 0.55, 0.56, 0.13, [0, 0, 0], 64);
  p.ring(m.oak, [0, 0.795, 0], 0.54, 0.022, [Math.PI / 2, 0, 0]);
  p.cylinder(m.oak, [0, 0.045, 0], 0.42, 0.44, 0.09, [0, 0, 0], 48);
  p.ring(m.horse, [0, 0.08, 0], 0.41, 0.018, [Math.PI / 2, 0, 0]);
  for (const side of [-1, 1])
    for (const z of [-0.2, 0.2]) {
      const support = outline([
        ['M', side * 0.33, 0.09],
        ['Q', -side * 0.01, 0.34, -side * 0.26, 0.77],
        ['L', -side * 0.36, 0.77],
        ['Q', -side * 0.16, 0.34, side * 0.22, 0.09],
        ['Z'],
      ]);
      profile(p, m.tableSupport, support, 0.09, [0, 0, z], 0.013);
    }
  for (const z of [-0.25, 0.25])
    p.cylinder(m.brass, [0, 0.4, z], 0.042, 0.042, 0.014, [Math.PI / 2, 0, 0]);
}
/** Constrói oito objetos distintos; atlas, GPU e ciclo de vida continuam pertencendo ao catálogo. */
export function decorativeFactories(resources) {
  const mat = (region, tint) => resources.pictorialMaterial('decorative', region, tint);
  const m = {
    horse: mat(0),
    mane: mat(1),
    saddle: mat(2),
    teal: mat(3),
    rubber: mat(4),
    rubberShade: mat(4, '#e2bd68'),
    beak: mat(5),
    beakShade: mat(5, '#9f6547'),
    robot: mat(6),
    brass: mat(7),
    fur: mat(8),
    pad: mat(9),
    purple: mat(10),
    pink: mat(11),
    fabric: mat(12),
    fabricShade: mat(12, '#a67c79'),
    piping: mat(12, '#c7a392'),
    skin: mat(13),
    drum: mat(14),
    table: mat(15),
    tableSupport: mat(2, '#966e52'),
    oak: mat(0, '#b39369'),
    face: mat(13, '#e5c49b'),
    dark: resources.material('decorativos-bordado-escuro', '#302118'),
    thread: resources.material('ursinho-linha', '#603d24'),
    glint: resources.material('decorativos-brilho-olhos', '#fff0bf'),
  };
  return Object.fromEntries(
    Object.entries({
      teddy,
      robot,
      duck,
      drum,
      jack,
      armchair,
      'rocking-horse': horse,
      table,
    }).map(([id, build]) => {
      const p = new PropParts();
      build(
        p,
        id === 'robot'
          ? {
              ...m,
              teal: m.robot,
            }
          : m,
      );
      const prototype = resources.bake(p.parts, id + ' — revisão fiel às fontes', true);
      if (id === 'duck') prototype.scale.x = 0.88;
      if (id === 'teddy') prototype.scale.x = 1.08;
      prototype.position.y = -new T.Box3().setFromObject(prototype).min.y;
      return [
        id,
        {
          /** Instancia mantendo materiais e malhas compartilhados. */
          create() {
            return prototype.clone(true);
          },
        },
      ];
    }),
  );
}
