import { PropParts } from './ChasePropResources.js';

/** Armário baixo de carvalho: duas portas, molduras, ferragens e painéis completos. */
export class OakCabinetProp {
  /** Constrói o móvel apoiado em Y=0, com portas orientadas para +Z. */
  constructor(resources) {
    const p = new PropParts();
    const wood = resources.pictorialMaterial('cabinet', 0);
    const edge = resources.pictorialMaterial('cabinet', 1);
    const dark = resources.pictorialMaterial('cabinet', 0, '#ba9e7f');
    const brass = resources.pictorialMaterial('cabinet', 3);
    const top = resources.pictorialMaterial('cabinet', 2);
    // Caixa fechada com painéis laterais e traseiro; nenhuma face depende de um cartão.
    p.box(dark, [0, 0.61, -0.015], [1.92, 0.96, 0.63], 0.025);
    p.box(top, [0, 1.14, 0], [2.12, 0.115, 0.81], 0.035);
    p.box(edge, [0, 1.065, 0.015], [2.0, 0.055, 0.73]);
    p.box(wood, [0, 0.17, 0.015], [2.04, 0.14, 0.74], 0.023);
    for (const x of [-0.9, 0.9])
      for (const z of [-0.265, 0.275]) p.box(edge, [x, 0.07, z], [0.17, 0.14, 0.18], 0.022);
    for (const x of [-0.947, 0.947]) p.box(wood, [x, 0.62, 0.365], [0.12, 0.86, 0.08], 0.016);
    p.box(edge, [0, 0.62, 0.355], [0.045, 0.87, 0.085], 0.006);
    for (const x of [-0.46, 0.46]) {
      p.box(dark, [x, 0.62, 0.337], [0.855, 0.86, 0.07], 0.008);
      // Portas rebaixadas: painel interno, quadro externo e bisel intermediário reais.
      p.box(wood, [x, 0.62, 0.388], [0.59, 0.59, 0.055], 0.014);
      for (const dx of [-0.365, 0.365])
        p.box(edge, [x + dx, 0.62, 0.405], [0.12, 0.84, 0.09], 0.013);
      for (const y of [0.25, 0.99]) p.box(wood, [x, y, 0.405], [0.84, 0.11, 0.09], 0.013);
      for (const dx of [-0.305, 0.305])
        p.box(edge, [x + dx, 0.62, 0.406], [0.035, 0.63, 0.04], 0.006);
      for (const y of [0.31, 0.93]) p.box(edge, [x, y, 0.406], [0.62, 0.035, 0.04], 0.006);
      const handleX = x < 0 ? -0.12 : 0.12;
      p.cylinder(dark, [handleX, 0.62, 0.468], 0.059, 0.059, 0.023, [Math.PI / 2, 0, 0]);
      p.cylinder(brass, [handleX, 0.62, 0.484], 0.043, 0.043, 0.021, [Math.PI / 2, 0, 0]);
      p.ring(brass, [handleX, 0.599, 0.51], 0.048, 0.012);
      p.cylinder(brass, [handleX, 0.65, 0.514], 0.018, 0.018, 0.025, [Math.PI / 2, 0, 0]);
      const hingeX = x < 0 ? -0.9 : 0.9;
      for (const y of [0.39, 0.84]) p.cylinder(brass, [hingeX, y, 0.433], 0.017, 0.017, 0.15);
    }
    // Laterais e fundo seguem o material conhecido; suas proporções são interpretação da fonte.
    for (const x of [-0.976, 0.976]) {
      p.box(wood, [x, 0.62, -0.025], [0.045, 0.72, 0.49], 0.011);
      for (const z of [-0.29, 0.25]) p.box(edge, [x, 0.62, z], [0.06, 0.86, 0.075], 0.01);
      for (const y of [0.23, 1.0]) p.box(edge, [x, y, -0.025], [0.06, 0.08, 0.57], 0.01);
    }
    p.box(wood, [0, 0.62, -0.35], [1.79, 0.74, 0.045]);
    p.box(edge, [0, 0.62, -0.382], [0.065, 0.85, 0.035], 0.005);
    this.prototype = resources.bake(p.parts, 'Armário baixo de carvalho — piloto');
  }
  /** Cria outra instância sem duplicar malhas, texturas ou materiais do proprietário externo. */
  create() {
    return this.prototype.clone(true);
  }
}
