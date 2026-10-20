import * as T from '../../../vendor/three/three.module.js';
import { PropParts } from './ChasePropResources.js';

/** Castelo de blocos de madeira, com portais vazados e torres apoiadas em colunas. */
export class BlockCastleProp {
  /** Conserva duas torres, telhados vermelho/azul, ameias verdes e o portal central. */
  constructor(resources) {
    const p = new PropParts(), red = resources.pictorialMaterial('blocks', 0);
    const yellow = resources.pictorialMaterial('blocks', 1), green = resources.pictorialMaterial('blocks', 2);
    const blue = resources.pictorialMaterial('blocks', 3), orange = resources.pictorialMaterial('blocks', 1, '#ea9d6c');
    for (const [index, x] of [-.78, .78].entries()) {
      p.box(blue, [x, .085, 0], [.66, .17, .61], .02);
      for (const dx of [-.19, .19]) p.cylinder(yellow, [x + dx, .315, .02], .092, .092, .29);
      p.box(orange, [x, .51, 0], [.72, .13, .63]);
      this.portal(p, index ? red : blue, [x, .575, 0], .56, .45, .48, .15, .27);
      this.portal(p, yellow, [x, 1.025, 0], .56, .43, .48, .14, .26);
      const shape = new T.Shape(); shape.moveTo(-.37, 0); shape.lineTo(.37, 0); shape.lineTo(0, .44); shape.closePath();
      const roof = new T.ExtrudeGeometry(shape, { depth: .61, bevelEnabled: false }); roof.translate(0, 0, -.305);
      const positions = roof.getAttribute('position'), uv = roof.getAttribute('uv');
      for (let i = 0; i < uv.count; i++) uv.setXY(i, positions.getX(i) / .74 + .5, positions.getY(i) / .44);
      p.add(roof, index ? blue : red, [x, 1.455, 0]);
    }
    this.centralWall(p, orange, yellow, green);
    for (const x of [-.40, .40]) p.box(green, [x, .095, .01], [.22, .19, .45]);
    for (let i = 0; i < 5; i++) {
      const x = -.40 + i * .20;
      p.box(green, [x, 1.005, 0], [.195, .13, .40], .008);
      if (i % 2 === 0) p.box(green, [x, 1.13, 0], [.17, .13, .40], .008);
    }
    this.prototype = resources.bake(p.parts, 'Castelo de blocos — portais vazados', true);
  }
  /** Monta juntas reais entre tijolos e cunhas do arco, conservando o portal vazado da ilustração. */
  centralWall(parts, orange, yellow, green) {
    // Os espaços de montagem fazem a separação surgir do volume, sem linhas desenhadas sobre a pintura.
    for (const side of [-1, 1]) {
      for (let row = 0; row < 3; row++)
        parts.box(orange, [side * .407, .19 + row * .205, -.015], [.156, .190, .37], .012);
      parts.box(green, [side * .365, .315, .035], [.19, .41, .41], .018);
    }
    for (let i = 0; i < 5; i++) {
      const width = i % 2 ? .175 : .180;
      parts.box(orange, [-.4 + i * .20, .875, 0], [width, .18, .38], .013);
    }
    // Cinco peças radiais douradas abraçam a abertura, como blocos individuais encaixados.
    for (let i = 0; i < 5; i++) {
      const start = i * Math.PI / 5 + .018, end = (i + 1) * Math.PI / 5 - .018;
      const shape = new T.Shape();
      shape.absarc(0, .40, .405, start, end, false);
      shape.lineTo(.27 * Math.cos(end), .40 + .27 * Math.sin(end));
      shape.absarc(0, .40, .27, end, start, true); shape.closePath();
      const geometry = new T.ExtrudeGeometry(shape, { depth: .40, bevelEnabled: true,
        bevelSize: .006, bevelThickness: .006, bevelSegments: 1, curveSegments: 8 });
      geometry.translate(0, 0, -.20);
      const pos = geometry.getAttribute('position'), uv = geometry.getAttribute('uv');
      for (let n = 0; n < uv.count; n++) uv.setXY(n, pos.getX(n) / .82 + .5, pos.getY(n) / .82);
      parts.add(geometry, yellow, [0, .10, .025]);
    }
  }
  /** Esculpe um bloco com arco atravessando toda a profundidade, sem uma janela preta colada. */
  portal(parts, material, position, width, height, depth, radius, openingHeight) {
    const shape = new T.Shape(); shape.moveTo(-width / 2, 0); shape.lineTo(-width / 2, height);
    shape.lineTo(width / 2, height); shape.lineTo(width / 2, 0); shape.lineTo(radius, 0);
    shape.lineTo(radius, openingHeight - radius); shape.absarc(0, openingHeight - radius, radius, 0, Math.PI, false);
    shape.lineTo(-radius, 0); shape.closePath();
    const geometry = new T.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 12 });
    geometry.translate(0, 0, -depth / 2);
    const pos = geometry.getAttribute('position'), uv = geometry.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / width + .5, pos.getY(i) / height);
    parts.add(geometry, material, position);
  }
  /** Instancia outra montagem sem duplicar os recursos pintados. */
  create() { return this.prototype.clone(true); }
}
