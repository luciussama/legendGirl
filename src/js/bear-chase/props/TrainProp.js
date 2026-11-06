import { PropParts } from './ChasePropResources.js';

/** Locomotiva de madeira pintada e vagão verde, derivados da prancha atual. */
export class TrainProp {
  /** Constrói uma matriz visual compartilhada; a frente aponta para +Z e o apoio fica em Y=0. */
  constructor(resources) {
    const p = new PropParts();
    const blue = resources.pictorialMaterial('train', 0);
    const red = resources.pictorialMaterial('train', 1);
    const green = resources.pictorialMaterial('train', 2);
    const dark = resources.pictorialMaterial('train', 3, '#735139');
    const wood = resources.pictorialMaterial('train', 3);
    const gold = resources.pictorialMaterial('train', 3, '#d6b56c');
    // A cabine é vazada: pilares e peitoris sustentam o teto, sem janelas pretas coladas.
    p.box(red, [0, 0.24, 0.22], [0.48, 0.13, 1.02]);
    p.cylinder(blue, [0, 0.43, 0.44], 0.19, 0.19, 0.53, [Math.PI / 2, 0, 0], 20, true);
    p.cylinder(gold, [0, 0.43, 0.716], 0.155, 0.155, 0.035, [Math.PI / 2, 0, 0]);
    p.cylinder(blue, [0, 0.43, 0.739], 0.112, 0.112, 0.017, [Math.PI / 2, 0, 0]);
    p.cylinder(gold, [0, 0.43, 0.752], 0.055, 0.055, 0.024, [Math.PI / 2, 0, 0]);
    p.cylinder(red, [0, 0.71, 0.51], 0.072, 0.062, 0.25);
    p.cylinder(red, [0, 0.85, 0.51], 0.095, 0.095, 0.045);
    p.cylinder(dark, [0, 0.876, 0.51], 0.058, 0.058, 0.007);
    p.box(red, [0, 0.39, -0.09], [0.43, 0.24, 0.38]);
    p.box(wood, [0, 0.515, -0.09], [0.37, 0.035, 0.3]);
    for (const x of [-0.195, 0.195])
      for (const z of [-0.25, 0.065]) p.box(red, [x, 0.64, z], [0.055, 0.29, 0.055]);
    p.box(red, [0, 0.71, -0.25], [0.4, 0.13, 0.05]);
    p.box(blue, [0, 0.816, -0.09], [0.54, 0.075, 0.46], 0.025);
    // Engate e caçamba têm fundo e paredes reais, incluindo a vista traseira interpretada.
    p.box(dark, [0, 0.21, -0.39], [0.09, 0.065, 0.18]);
    p.box(green, [0, 0.285, -0.66], [0.45, 0.09, 0.47]);
    for (const x of [-0.21, 0.21]) p.box(green, [x, 0.46, -0.66], [0.05, 0.3, 0.47]);
    for (const z of [-0.87, -0.45]) p.box(green, [0, 0.46, z], [0.44, 0.3, 0.05]);
    p.box(green, [0, 0.32, -0.66], [0.35, 0.04, 0.35]);
    for (const z of [0.54, -0.16, -0.67]) {
      const radius = z === -0.67 ? 0.115 : 0.155;
      p.cylinder(dark, [0, radius, z], 0.038, 0.038, 0.6, [0, 0, Math.PI / 2]);
      for (const side of [-1, 1]) {
        p.cylinder(dark, [side * 0.285, radius, z], radius, radius, 0.075, [0, 0, Math.PI / 2]);
        p.cylinder(wood, [side * 0.327, radius, z], radius * 0.83, radius * 0.83, 0.018, [
          0,
          0,
          Math.PI / 2,
        ]);
        p.ring(gold, [side * 0.339, radius, z], radius * 0.62, 0.012, [0, Math.PI / 2, 0]);
        p.cylinder(gold, [side * 0.35, radius, z], 0.037, 0.037, 0.026, [0, 0, Math.PI / 2]);
      }
    }
    // Grade frontal em madeira pintada, com dentes individuais da referência.
    p.box(red, [0, 0.2, 0.79], [0.43, 0.065, 0.12]);
    for (let i = -2; i <= 2; i++) p.box(gold, [i * 0.075, 0.26, 0.83], [0.027, 0.12, 0.03], 0.005);
    this.prototype = resources.bake(p.parts, 'Trem — piloto da prancha atual', true);
    this.prototype.scale.setScalar(0.72);
  }
  /** Instancia somente a hierarquia; geometria e materiais pertencem ao proprietário externo. */
  create() {
    return this.prototype.clone(true);
  }
}
