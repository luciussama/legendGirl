import { PropParts } from './ChasePropResources.js';

/** Estante baixa de duas fileiras, com livros volumétricos e estrutura de carvalho. */
export class BookshelfProp {
  /** Constrói o móvel largo da referência, apoiado em Y=0 e com a frente em +Z. */
  constructor(resources) {
    const p = new PropParts(), wood = resources.pictorialMaterial('cabinet', 0);
    const trim = resources.pictorialMaterial('cabinet', 1), top = resources.pictorialMaterial('cabinet', 2);
    const brass = resources.pictorialMaterial('cabinet', 3);
    const paper = resources.material('papel-livros', '#e6cb95');
    const covers = [0, 3, 2, 1].map(region => resources.pictorialMaterial('blocks', region));
    p.box(wood, [0, .52, -.275], [2.25, .90, .075]);
    for (const x of [-1.095, 1.095]) p.box(trim, [x, .53, 0], [.13, .94, .57], .023);
    for (const y of [.10, .53]) p.box(wood, [0, y, 0], [2.32, .09, .63], .02);
    p.box(top, [0, 1.015, 0], [2.43, .105, .68], .03);
    for (const x of [-1.04, 1.04]) p.box(trim, [x, .045, .025], [.17, .09, .51]);
    for (let row = 0; row < 2; row++) {
      const floor = .145 + row * .43;
      for (let book = 0; book < 15; book++) {
        const x = -.97 + book * .137, h = .27 + [0, .065, .025, .05][(book + row) % 4];
        const cover = covers[(book + row * 2) % covers.length], width = .105;
        // Miolo, capas e lombada são sólidos; filetes dourados fazem parte da encadernação.
        p.box(paper, [x, floor + h / 2, .02], [width - .016, h - .018, .33], .004);
        for (const dx of [-width / 2, width / 2]) p.box(cover, [x + dx, floor + h / 2, .025], [.014, h, .37], .004);
        p.box(cover, [x, floor + h / 2, .212], [width + .014, h, .04], .008);
        for (const dy of [.045, h - .045]) p.box(brass, [x, floor + dy, .237], [width - .012, .014, .009], .002);
      }
    }
    this.prototype = resources.bake(p.parts, 'Estante baixa — duas fileiras de livros', true);
  }
  /** Clona só a hierarquia, compartilhando atlas, materiais e geometrias do catálogo. */
  create() { return this.prototype.clone(true); }
}
