import * as T from '../../../vendor/three/three.module.js';
import { PropParts } from './ChasePropResources.js';

/** Torre de quatro blocos pintados, respeitando ordem, contato e silhueta da fonte. */
export class BlocksProp {
  /** Modela peças encaixadas e telhado triangular com espessura real; apoio em Y=0. */
  constructor(resources) {
    const p = new PropParts();
    const red = resources.pictorialMaterial('blocks', 0);
    const yellow = resources.pictorialMaterial('blocks', 1);
    const green = resources.pictorialMaterial('blocks', 2);
    const blue = resources.pictorialMaterial('blocks', 3);
    p.box(red, [0, .13, 0], [.67, .26, .46], .02);
    p.box(yellow, [0, .39, 0], [.52, .26, .39], .018);
    p.box(green, [0, .65, 0], [.32, .26, .31], .014);
    const shape = new T.Shape(); shape.moveTo(-.26, .78); shape.lineTo(.26, .78);
    shape.lineTo(0, 1.05); shape.closePath();
    const roof = new T.ExtrudeGeometry(shape, { depth: .30, bevelEnabled: false, steps: 1 });
    roof.translate(0, 0, -.15);
    // O telhado ocupa a região azul inteira, sem extrapolar para quadrantes vizinhos.
    const positions = roof.getAttribute('position'), uv = roof.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setXY(i, positions.getX(i) / .52 + .5,
      (positions.getY(i) - .78) / .27);
    p.add(roof, blue, [0, 0, 0]);
    this.prototype = resources.bake(p.parts, 'Blocos pintados — torre da fonte atual', true);
  }
  /** Clona a hierarquia conservando os recursos estáticos do catálogo. */
  create() { return this.prototype.clone(true); }
}
