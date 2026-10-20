import * as T from '../../../vendor/three/three.module.js';
import { PropParts } from './ChasePropResources.js';

/** Baú vermelho/amarelo de brinquedos, com tampa curva articulada e interior sólido. */
export class ToyChestProp {
  /** Prepara corpo e tampa independentes; o catálogo continua proprietário dos recursos. */
  constructor(resources) {
    const p = new PropParts(), red = resources.pictorialMaterial('blocks', 0);
    const yellow = resources.pictorialMaterial('blocks', 1), blue = resources.pictorialMaterial('blocks', 3);
    const inside = resources.pictorialMaterial('cabinet', 0, '#8d623f');
    p.box(inside, [0, .18, 0], [1.70, .12, .69]);
    p.box(red, [0, .54, -.36], [1.82, .74, .10]);
    p.box(yellow, [0, .54, .36], [1.72, .73, .10], .018);
    for (const x of [-.88, .88]) {
      this.sidePanel(p, red, x);
      for (const z of [-.32, .32]) p.box(yellow, [x, .085, z], [.18, .17, .18]);
      p.box(red, [x, .52, .37], [.12, .77, .09]);
    }
    p.box(yellow, [0, .17, .395], [1.86, .09, .10]);
    p.cylinder(blue, [0, .56, .423], .135, .135, .035, [Math.PI / 2, 0, 0]);
    const body = resources.bake(p.parts, 'Corpo do baú — painel amarelo e medalhão azul', true);
    const lidParts = new PropParts(), shape = new T.Shape(); shape.moveTo(-.97, 0);
    // A seção arqueada fica na frente do baú, com o barril orientado ao longo da profundidade.
    shape.absellipse(0, 0, .97, .63, Math.PI, 0, true); shape.closePath();
    const roof = new T.ExtrudeGeometry(shape, { depth: .82, bevelEnabled: false, curveSegments: 32 });
    const pos = roof.getAttribute('position'), uv = roof.getAttribute('uv'), normals = roof.getAttribute('normal');
    // As cabeceiras usam o arco inteiro; o dorso usa profundidade, evitando veios esticados nas tampas laterais.
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / 1.94 + .5,
      Math.abs(normals.getZ(i)) > .8 ? pos.getY(i) / .63 : pos.getZ(i) / .82);
    lidParts.add(roof, red, [0, 0, 0]);
    const lid = new T.Group(); lid.name = 'tampa'; lid.position.set(0, .92, -.41);
    lid.add(resources.bake(lidParts.parts, 'Tampa curva vermelha', true));
    lid.add(this.inscription(resources));
    this.prototype = new T.Group(); this.prototype.name = 'Baú de brinquedos';
    this.prototype.add(body, lid);
    // A profundidade mantém folga para abrir a tampa junto à parede, sem ocupar a rota.
    this.prototype.scale.z = .90;
  }
  /** Constrói a lateral com recorte inferior em arco, preservando o desenho da fonte. */
  sidePanel(parts, material, x) {
    const s = new T.Shape(); s.moveTo(-.41, .15); s.lineTo(-.41, .92); s.lineTo(.41, .92);
    s.lineTo(.41, .15); s.lineTo(.19, .15); s.absarc(0, .15, .19, 0, Math.PI, false);
    s.lineTo(-.41, .15); s.closePath();
    const g = new T.ExtrudeGeometry(s, { depth: .10, bevelEnabled: false, curveSegments: 16 });
    g.translate(0, 0, -.05); g.rotateY(Math.PI / 2);
    const pos = g.getAttribute('position'), uv = g.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getZ(i) / .82 + .5, pos.getY(i) / .92);
    parts.add(g, material, [x, 0, 0]);
  }
  /** Desenha a inscrição original em superfície curva, como tinta sobre a tampa, sem cartão de móvel. */
  inscription(resources) {
    const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 160;
    const ctx = canvas.getContext('2d'); ctx.font = 'bold 103px sans-serif'; ctx.textAlign = 'center';
    ctx.textBaseline = 'middle'; ctx.fillStyle = '#f1d49a'; ctx.fillText('BRINQUEDOS', 384, 83, 735);
    const texture = resources.own(new T.CanvasTexture(canvas)); texture.colorSpace = T.SRGBColorSpace;
    const material = resources.own(new T.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: .15,
      side: T.DoubleSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }));
    const surface = new T.PlaneGeometry(1.64, .31, 28, 8);
    const geometry = resources.own(new T.BufferGeometry().copy(surface)); surface.dispose();
    const pos = geometry.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = .634 * Math.sqrt(Math.max(0, 1 - (x / .97) ** 2));
      pos.setXYZ(i, x, y, .50 + pos.getY(i));
    }
    geometry.computeVertexNormals(); return new T.Mesh(geometry, material);
  }
  /** Cria instância com pivô próprio; tampa e corpo mantêm recursos compartilhados. */
  create() { return this.prototype.clone(true); }
  /** Aplica só abertura visual de 0 a 1, sem decidir captura, evento ou estado da campanha. */
  static setOpening(root, value) {
    const lid = root.getObjectByName('tampa');
    if (!lid) return;
    const opening = Math.max(0, Math.min(1, value));
    lid.rotation.x = -opening * 1.12;
    // A dobradiça articulada avança a tampa ao abrir, dando folga ao arco mais alto junto à parede.
    lid.position.z = -.41 + .18 * opening;
  }
}
