import * as T from '../../../vendor/three/three.module.js';
import { PropParts } from './ChasePropResources.js';

/** Coelho sentado de pelúcia rosa, com focinho creme, orelhas separadas e costuras. */
export class BunnyProp {
  /** Constrói volumes macios foscos; a frente aponta para +Z e os pés apoiam em Y=0. */
  constructor(resources) {
    const p = new PropParts();
    const pink = resources.pictorialMaterial('bunny', 0);
    const inner = resources.pictorialMaterial('bunny', 2);
    const cream = resources.pictorialMaterial('bunny', 1);
    const seam = resources.pictorialMaterial('bunny', 3);
    const dark = resources.material('pelucia-bordado', '#382720');
    const nose = resources.material('pelucia-nariz', '#a35b50');
    this.ellipsoid(p, pink, [0, .32, 0], [.235, .30, .185]);
    this.ellipsoid(p, pink, [0, .67, .025], [.235, .22, .20]);
    this.ellipsoid(p, cream, [0, .29, .164], [.145, .185, .035]);
    for (const side of [-1, 1]) {
      this.ellipsoid(p, pink, [side * .17, .91, .01], [.079, .205, .06], -side * .31);
      this.ellipsoid(p, inner, [side * .17, .915, .058], [.050, .157, .018], -side * .31);
      this.ellipsoid(p, pink, [side * .205, .37, .10], [.082, .16, .082], side * .25);
      this.ellipsoid(p, pink, [side * .15, .10, .14], [.125, .10, .14]);
      this.ellipsoid(p, cream, [side * .15, .105, .251], [.088, .072, .025]);
      this.ellipsoid(p, cream, [side * .062, .602, .207], [.084, .065, .044]);
      this.ellipsoid(p, dark, [side * .09, .713, .200], [.019, .025, .014]);
      this.ellipsoid(p, cream, [side * .095, .722, .211], [.005, .006, .004]);
    }
    this.ellipsoid(p, nose, [0, .625, .258], [.033, .022, .018]);
    this.ellipsoid(p, cream, [0, .235, -.19], [.09, .09, .085]);
    // Pontos curtos acompanham a barriga e a testa; não são marcações de colisão.
    for (let i = 0; i < 7; i++) p.box(seam, [0, .20 + i * .036, .195], [.006, .017, .008], .001);
    for (let i = 0; i < 4; i++) p.box(seam, [0, .758 + i * .027, .21 - i * .012], [.006, .012, .006], .001);
    p.box(dark, [0, .586, .254], [.007, .028, .006], .001);
    this.prototype = resources.bake(p.parts, 'Coelho de algodão — pelúcia rosa', true);
    this.prototype.scale.setScalar(.95);
  }
  /** Esculpe um volume elipsoidal fechado, sem cartões e com normais suaves. */
  ellipsoid(parts, material, position, scale, tilt = 0) {
    const geometry = new T.SphereGeometry(1, 20, 14); geometry.scale(...scale);
    parts.add(geometry, material, position, [0, 0, tilt]);
  }
  /** Instancia uma hierarquia que compartilha material e geometria com os demais coelhos. */
  create() { return this.prototype.clone(true); }
}
