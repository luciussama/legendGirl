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
    this.ellipsoid(p, pink, [0, 0.32, 0], [0.235, 0.3, 0.185]);
    this.ellipsoid(p, pink, [0, 0.67, 0.025], [0.235, 0.22, 0.2]);
    this.ellipsoid(p, cream, [0, 0.29, 0.164], [0.145, 0.185, 0.035]);
    for (const side of [-1, 1]) {
      this.ellipsoid(p, pink, [side * 0.17, 0.91, 0.01], [0.079, 0.205, 0.06], -side * 0.31);
      this.ellipsoid(p, inner, [side * 0.17, 0.915, 0.058], [0.05, 0.157, 0.018], -side * 0.31);
      this.ellipsoid(p, pink, [side * 0.205, 0.37, 0.1], [0.082, 0.16, 0.082], side * 0.25);
      this.ellipsoid(p, pink, [side * 0.15, 0.1, 0.14], [0.125, 0.1, 0.14]);
      this.ellipsoid(p, cream, [side * 0.15, 0.105, 0.251], [0.088, 0.072, 0.025]);
      this.ellipsoid(p, cream, [side * 0.062, 0.602, 0.207], [0.084, 0.065, 0.044]);
      this.ellipsoid(p, dark, [side * 0.09, 0.713, 0.2], [0.019, 0.025, 0.014]);
      this.ellipsoid(p, cream, [side * 0.095, 0.722, 0.211], [0.005, 0.006, 0.004]);
    }
    this.ellipsoid(p, nose, [0, 0.625, 0.258], [0.033, 0.022, 0.018]);
    this.ellipsoid(p, cream, [0, 0.235, -0.19], [0.09, 0.09, 0.085]);
    // Pontos curtos acompanham a barriga e a testa; não são marcações de colisão.
    for (let i = 0; i < 7; i++)
      p.box(seam, [0, 0.2 + i * 0.036, 0.195], [0.006, 0.017, 0.008], 0.001);
    for (let i = 0; i < 4; i++)
      p.box(seam, [0, 0.758 + i * 0.027, 0.21 - i * 0.012], [0.006, 0.012, 0.006], 0.001);
    p.box(dark, [0, 0.586, 0.254], [0.007, 0.028, 0.006], 0.001);
    this.prototype = resources.bake(p.parts, 'Coelho de algodão — pelúcia rosa', true);
    this.prototype.scale.setScalar(0.95);
  }
  /** Esculpe um volume elipsoidal fechado, sem cartões e com normais suaves. */
  ellipsoid(parts, material, position, scale, tilt = 0) {
    const geometry = new T.SphereGeometry(1, 20, 14);
    geometry.scale(...scale);
    parts.add(geometry, material, position, [0, 0, tilt]);
  }
  /** Instancia uma hierarquia que compartilha material e geometria com os demais coelhos. */
  create() {
    return this.prototype.clone(true);
  }
}
