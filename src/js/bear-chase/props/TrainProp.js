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
    p.box(red, [0, .24, .22], [.48, .13, 1.02]);
    p.cylinder(blue, [0, .43, .44], .19, .19, .53, [Math.PI / 2, 0, 0], 20, true);
    p.cylinder(gold, [0, .43, .716], .155, .155, .035, [Math.PI / 2, 0, 0]);
    p.cylinder(blue, [0, .43, .739], .112, .112, .017, [Math.PI / 2, 0, 0]);
    p.cylinder(gold, [0, .43, .752], .055, .055, .024, [Math.PI / 2, 0, 0]);
    p.cylinder(red, [0, .71, .51], .072, .062, .25);
    p.cylinder(red, [0, .85, .51], .095, .095, .045);
    p.cylinder(dark, [0, .876, .51], .058, .058, .007);
    p.box(red, [0, .39, -.09], [.43, .24, .38]);
    p.box(wood, [0, .515, -.09], [.37, .035, .30]);
    for (const x of [-.195, .195]) for (const z of [-.25, .065]) p.box(red, [x, .64, z], [.055, .29, .055]);
    p.box(red, [0, .71, -.25], [.40, .13, .05]);
    p.box(blue, [0, .816, -.09], [.54, .075, .46], .025);
    // Engate e caçamba têm fundo e paredes reais, incluindo a vista traseira interpretada.
    p.box(dark, [0, .21, -.39], [.09, .065, .18]);
    p.box(green, [0, .285, -.66], [.45, .09, .47]);
    for (const x of [-.21, .21]) p.box(green, [x, .46, -.66], [.05, .30, .47]);
    for (const z of [-.87, -.45]) p.box(green, [0, .46, z], [.44, .30, .05]);
    p.box(green, [0, .32, -.66], [.35, .04, .35]);
    for (const z of [.54, -.16, -.67]) {
      const radius = z === -.67 ? .115 : .155;
      p.cylinder(dark, [0, radius, z], .038, .038, .60, [0, 0, Math.PI / 2]);
      for (const side of [-1, 1]) {
        p.cylinder(dark, [side * .285, radius, z], radius, radius, .075, [0, 0, Math.PI / 2]);
        p.cylinder(wood, [side * .327, radius, z], radius * .83, radius * .83, .018, [0, 0, Math.PI / 2]);
        p.ring(gold, [side * .339, radius, z], radius * .62, .012, [0, Math.PI / 2, 0]);
        p.cylinder(gold, [side * .35, radius, z], .037, .037, .026, [0, 0, Math.PI / 2]);
      }
    }
    // Grade frontal em madeira pintada, com dentes individuais da referência.
    p.box(red, [0, .20, .79], [.43, .065, .12]);
    for (let i = -2; i <= 2; i++) p.box(gold, [i * .075, .26, .83], [.027, .12, .03], .005);
    this.prototype = resources.bake(p.parts, 'Trem — piloto da prancha atual', true);
    this.prototype.scale.setScalar(.72);
  }
  /** Instancia somente a hierarquia; geometria e materiais pertencem ao proprietário externo. */
  create() { return this.prototype.clone(true); }
}
