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
    p.box(dark, [0, .61, -.015], [1.92, .96, .63], .025);
    p.box(top, [0, 1.14, 0], [2.12, .115, .81], .035);
    p.box(edge, [0, 1.065, .015], [2.00, .055, .73]);
    p.box(wood, [0, .17, .015], [2.04, .14, .74], .023);
    for (const x of [-.90, .90]) for (const z of [-.265, .275]) p.box(edge, [x, .07, z], [.17, .14, .18], .022);
    for (const x of [-.947, .947]) p.box(wood, [x, .62, .365], [.12, .86, .08], .016);
    p.box(edge, [0, .62, .355], [.045, .87, .085], .006);
    for (const x of [-.46, .46]) {
      p.box(dark, [x, .62, .337], [.855, .86, .07], .008);
      // Portas rebaixadas: painel interno, quadro externo e bisel intermediário reais.
      p.box(wood, [x, .62, .388], [.59, .59, .055], .014);
      for (const dx of [-.365, .365]) p.box(edge, [x + dx, .62, .405], [.12, .84, .09], .013);
      for (const y of [.25, .99]) p.box(wood, [x, y, .405], [.84, .11, .09], .013);
      for (const dx of [-.305, .305]) p.box(edge, [x + dx, .62, .406], [.035, .63, .04], .006);
      for (const y of [.31, .93]) p.box(edge, [x, y, .406], [.62, .035, .04], .006);
      const handleX = x < 0 ? -.12 : .12;
      p.cylinder(dark, [handleX, .62, .468], .059, .059, .023, [Math.PI / 2, 0, 0]);
      p.cylinder(brass, [handleX, .62, .484], .043, .043, .021, [Math.PI / 2, 0, 0]);
      p.ring(brass, [handleX, .599, .510], .048, .012);
      p.cylinder(brass, [handleX, .65, .514], .018, .018, .025, [Math.PI / 2, 0, 0]);
      const hingeX = x < 0 ? -.90 : .90;
      for (const y of [.39, .84]) p.cylinder(brass, [hingeX, y, .433], .017, .017, .15);
    }
    // Laterais e fundo seguem o material conhecido; suas proporções são interpretação da fonte.
    for (const x of [-.976, .976]) {
      p.box(wood, [x, .62, -.025], [.045, .72, .49], .011);
      for (const z of [-.29, .25]) p.box(edge, [x, .62, z], [.06, .86, .075], .01);
      for (const y of [.23, 1.00]) p.box(edge, [x, y, -.025], [.06, .08, .57], .01);
    }
    p.box(wood, [0, .62, -.35], [1.79, .74, .045]);
    p.box(edge, [0, .62, -.382], [.065, .85, .035], .005);
    this.prototype = resources.bake(p.parts, 'Armário baixo de carvalho — piloto');
  }
  /** Cria outra instância sem duplicar malhas, texturas ou materiais do proprietário externo. */
  create() { return this.prototype.clone(true); }
}
