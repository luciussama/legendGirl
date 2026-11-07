import { PropParts } from './ChasePropResources.js';

/** Estante baixa de duas fileiras, com livros volumétricos e estrutura de carvalho. */
export class BookshelfProp {
  /** Constrói o móvel largo da referência, apoiado em Y=0 e com a frente em +Z. */
  constructor(resources) {
    const p = new PropParts(),
      wood = resources.pictorialMaterial('cabinet', 0);
    const trim = resources.pictorialMaterial('cabinet', 1),
      top = resources.pictorialMaterial('cabinet', 2);
    const brass = resources.pictorialMaterial('cabinet', 3);
    const paper = resources.material('papel-livros', '#e6cb95');
    const covers = [0, 3, 2, 1].map((region) => resources.pictorialMaterial('blocks', region));
    p.box(wood, [0, 0.52, -0.275], [2.25, 0.9, 0.075]);
    for (const x of [-1.095, 1.095]) p.box(trim, [x, 0.53, 0], [0.13, 0.94, 0.57], 0.023);
    for (const y of [0.1, 0.53]) p.box(wood, [0, y, 0], [2.32, 0.09, 0.63], 0.02);
    p.box(top, [0, 1.015, 0], [2.43, 0.105, 0.68], 0.03);
    for (const x of [-1.04, 1.04]) p.box(trim, [x, 0.045, 0.025], [0.17, 0.09, 0.51]);
    for (let row = 0; row < 2; row++) {
      const floor = 0.145 + row * 0.43;
      for (let book = 0; book < 15; book++) {
        const x = -0.97 + book * 0.137,
          h = 0.27 + [0, 0.065, 0.025, 0.05][(book + row) % 4];
        const cover = covers[(book + row * 2) % covers.length],
          width = 0.105;
        // Miolo, capas e lombada são sólidos; filetes dourados fazem parte da encadernação.
        p.box(paper, [x, floor + h / 2, 0.02], [width - 0.016, h - 0.018, 0.33], 0.004);
        for (const dx of [-width / 2, width / 2])
          p.box(cover, [x + dx, floor + h / 2, 0.025], [0.014, h, 0.37], 0.004);
        p.box(cover, [x, floor + h / 2, 0.212], [width + 0.014, h, 0.04], 0.008);
        for (const dy of [0.045, h - 0.045])
          p.box(brass, [x, floor + dy, 0.237], [width - 0.012, 0.014, 0.009], 0.002);
      }
    }
    this.prototype = resources.bake(p.parts, 'Estante baixa — duas fileiras de livros', true);
  }
  /** Clona só a hierarquia, compartilhando atlas, materiais e geometrias do catálogo. */
  create() {
    return this.prototype.clone(true);
  }
}
