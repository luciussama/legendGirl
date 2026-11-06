import * as T from '../../../vendor/three/three.module.js';
import { PropParts } from './ChasePropResources.js';

/** Baú vermelho/amarelo de brinquedos, com tampa curva articulada e interior sólido. */
export class ToyChestProp {
  /** Prepara corpo e tampa independentes; o catálogo continua proprietário dos recursos. */
  constructor(resources) {
    const p = new PropParts(),
      red = resources.pictorialMaterial('blocks', 0);
    const yellow = resources.pictorialMaterial('blocks', 1),
      blue = resources.pictorialMaterial('blocks', 3);
    const inside = resources.pictorialMaterial('cabinet', 0, '#8d623f');
    p.box(inside, [0, 0.18, 0], [1.7, 0.12, 0.69]);
    p.box(red, [0, 0.54, -0.36], [1.82, 0.74, 0.1]);
    p.box(yellow, [0, 0.54, 0.36], [1.72, 0.73, 0.1], 0.018);
    for (const x of [-0.88, 0.88]) {
      this.sidePanel(p, red, x);
      for (const z of [-0.32, 0.32]) p.box(yellow, [x, 0.085, z], [0.18, 0.17, 0.18]);
      p.box(red, [x, 0.52, 0.37], [0.12, 0.77, 0.09]);
    }
    p.box(yellow, [0, 0.17, 0.395], [1.86, 0.09, 0.1]);
    p.cylinder(blue, [0, 0.56, 0.423], 0.135, 0.135, 0.035, [Math.PI / 2, 0, 0]);
    const body = resources.bake(p.parts, 'Corpo do baú — painel amarelo e medalhão azul', true);
    const lidParts = new PropParts(),
      shape = new T.Shape();
    shape.moveTo(-0.97, 0);
    // A seção arqueada fica na frente do baú, com o barril orientado ao longo da profundidade.
    shape.absellipse(0, 0, 0.97, 0.63, Math.PI, 0, true);
    shape.closePath();
    const roof = new T.ExtrudeGeometry(shape, {
      depth: 0.82,
      bevelEnabled: false,
      curveSegments: 32,
    });
    const pos = roof.getAttribute('position'),
      uv = roof.getAttribute('uv'),
      normals = roof.getAttribute('normal');
    // As cabeceiras usam o arco inteiro; o dorso usa profundidade, evitando veios esticados nas tampas laterais.
    for (let i = 0; i < uv.count; i++)
      uv.setXY(
        i,
        pos.getX(i) / 1.94 + 0.5,
        Math.abs(normals.getZ(i)) > 0.8 ? pos.getY(i) / 0.63 : pos.getZ(i) / 0.82,
      );
    lidParts.add(roof, red, [0, 0, 0]);
    const lid = new T.Group();
    lid.name = 'tampa';
    lid.position.set(0, 0.92, -0.41);
    lid.add(resources.bake(lidParts.parts, 'Tampa curva vermelha', true));
    lid.add(this.inscription(resources));
    this.prototype = new T.Group();
    this.prototype.name = 'Baú de brinquedos';
    this.prototype.add(body, lid);
    // A profundidade mantém folga para abrir a tampa junto à parede, sem ocupar a rota.
    this.prototype.scale.z = 0.9;
  }
  /** Constrói a lateral com recorte inferior em arco, preservando o desenho da fonte. */
  sidePanel(parts, material, x) {
    const s = new T.Shape();
    s.moveTo(-0.41, 0.15);
    s.lineTo(-0.41, 0.92);
    s.lineTo(0.41, 0.92);
    s.lineTo(0.41, 0.15);
    s.lineTo(0.19, 0.15);
    s.absarc(0, 0.15, 0.19, 0, Math.PI, false);
    s.lineTo(-0.41, 0.15);
    s.closePath();
    const g = new T.ExtrudeGeometry(s, {
      depth: 0.1,
      bevelEnabled: false,
      curveSegments: 16,
    });
    g.translate(0, 0, -0.05);
    g.rotateY(Math.PI / 2);
    const pos = g.getAttribute('position'),
      uv = g.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getZ(i) / 0.82 + 0.5, pos.getY(i) / 0.92);
    parts.add(g, material, [x, 0, 0]);
  }
  /** Desenha a inscrição original em superfície curva, como tinta sobre a tampa, sem cartão de móvel. */
  inscription(resources) {
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 103px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f1d49a';
    ctx.fillText('BRINQUEDOS', 384, 83, 735);
    const texture = resources.own(new T.CanvasTexture(canvas));
    texture.colorSpace = T.SRGBColorSpace;
    const material = resources.own(
      new T.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.15,
        side: T.DoubleSide,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      }),
    );
    const surface = new T.PlaneGeometry(1.64, 0.31, 28, 8);
    const geometry = resources.own(new T.BufferGeometry().copy(surface));
    surface.dispose();
    const pos = geometry.getAttribute('position');
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i),
        y = 0.634 * Math.sqrt(Math.max(0, 1 - (x / 0.97) ** 2));
      pos.setXYZ(i, x, y, 0.5 + pos.getY(i));
    }
    geometry.computeVertexNormals();
    return new T.Mesh(geometry, material);
  }
  /** Cria instância com pivô próprio; tampa e corpo mantêm recursos compartilhados. */
  create() {
    return this.prototype.clone(true);
  }
  /** Aplica só abertura visual de 0 a 1, sem decidir captura, evento ou estado da campanha. */
  static setOpening(root, value) {
    const lid = root.getObjectByName('tampa');
    if (!lid) return;
    const opening = Math.max(0, Math.min(1, value));
    lid.rotation.x = -opening * 1.12;
    // A dobradiça articulada avança a tampa ao abrir, dando folga ao arco mais alto junto à parede.
    lid.position.z = -0.41 + 0.18 * opening;
  }
}
