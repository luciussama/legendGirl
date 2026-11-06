import * as T from '../../vendor/three/three.module.js';
import { GIRL_PALETTE } from './chaseGirlPalette.js';

/** Menina da arena reinterpretada em volume; a autoria traseira não é sprite aprovado. */
export class ChaseGirlModel {
  /** Distribui as proporções ilustradas entre cabeça, tronco e membros articulados. */
  constructor(own) {
    this.own = own;
    this.root = new T.Group();
    this.root.name = 'Menina3D';
    this.materials = Object.fromEntries(
      Object.entries(GIRL_PALETTE).map(([name, color]) => [
        name,
        own(
          new T.MeshStandardMaterial({
            color,
            vertexColors: true,
            roughness: 1,
            metalness: 0,
          }),
        ),
      ]),
    );
    this.sphere = this.shade(new T.SphereGeometry(1, 24, 16));
    this.proportions = Object.freeze({
      thigh: 0.22,
      shin: 0.22,
      upperArm: 0.18,
      forearm: 0.2,
      soleHeight: 0.119,
    });
    this.pelvis = this.joint(this.root, 'Quadril', 0, 0.63, 0);
    this.torso = this.joint(this.pelvis, 'Tronco', 0, 0.2, 0);
    this.volume(this.torso, 'cream', [0, 0.12, 0], [0.21, 0.235, 0.14]);
    this.volume(this.torso, 'cream', [0, 0.135, -0.1], [0.15, 0.19, 0.065]);
    this.volume(this.torso, 'rose', [0, -0.015, 0], [0.22, 0.035, 0.15]);
    this.skirt = this.joint(this.pelvis, 'Saia', 0, 0.13, 0);
    // Vestido creme inteiro, com babado rosa e bordado ao redor da barra.
    this.cloth(
      this.skirt,
      'pink',
      [
        [0.35, -0.19],
        [0.365, -0.16],
        [0.345, -0.115],
      ],
      true,
    );
    this.cloth(
      this.skirt,
      'rose',
      [
        [0.355, -0.19],
        [0.37, -0.175],
        [0.36, -0.16],
      ],
      true,
    );
    this.cloth(
      this.skirt,
      'cream',
      [
        [0.35, -0.145],
        [0.33, -0.09],
        [0.26, 0.04],
        [0.207, 0.1],
      ],
      true,
    );
    this.buildDressDetails();
    this.head = this.joint(this.torso, 'Cabeca', 0, 0.335, 0);
    this.head.scale.setScalar(0.86);
    this.volume(this.head, 'skin', [0, 0.09, -0.045], [0.31, 0.32, 0.27]);
    // Bochechas e queixo fazem uma face curta e larga, sem focinho esférico.

    for (const side of [-1, 1])
      this.volume(this.head, 'skin', [side * 0.323, 0.1, 0], [0.047, 0.065, 0.045]);
    this.buildHair();
    this.buildFace();
    this.arms = [];
    this.legs = [];
    for (const side of [-1, 1]) {
      const shoulder = this.joint(
        this.torso,
        side < 0 ? 'OmbroE' : 'OmbroD',
        side * 0.235,
        0.21,
        0,
      );
      this.buildSleeve(shoulder);
      this.limb(shoulder, 'skin', this.proportions.upperArm, 0.045, 0.052);
      const elbow = this.joint(shoulder, 'Cotovelo', 0, -this.proportions.upperArm, 0);
      this.limb(elbow, 'skin', this.proportions.forearm, 0.047, 0.052);
      this.volume(elbow, 'skin', [0, 0, 0], [0.046, 0.046, 0.046]);
      const hand = this.volume(
        elbow,
        'skin',
        [0, -this.proportions.forearm - 0.005, -0.007],
        [0.058, 0.056, 0.05],
      );
      this.arms.push({
        shoulder,
        elbow,
        hand,
      });
      const hip = this.joint(this.pelvis, side < 0 ? 'PernaE' : 'PernaD', side * 0.115, -0.035, 0);
      this.limb(hip, 'skin', this.proportions.thigh, 0.066, 0.078);
      const knee = this.joint(hip, 'Joelho', 0, -this.proportions.thigh, 0);
      this.limb(knee, 'skin', this.proportions.shin, 0.049, 0.06);
      this.volume(knee, 'skin', [0, 0, 0], [0.062, 0.056, 0.062]);
      const ankle = this.joint(knee, 'Tornozelo', 0, -this.proportions.shin, 0);
      this.volume(ankle, 'boot', [0, -0.035, -0.045], [0.083, 0.075, 0.135]);
      this.volume(ankle, 'boot', [0, 0.015, 0.005], [0.065, 0.075, 0.07]);
      this.volume(ankle, 'sole', [0, -0.095, -0.055], [0.087, 0.024, 0.143]);
      this.volume(ankle, 'cream', [0, 0.05, 0], [0.07, 0.028, 0.069]);
      this.legs.push({
        hip,
        knee,
        ankle,
        thigh: this.proportions.thigh,
        shin: this.proportions.shin,
      });
    }
    this.buildSword();
    this.batchDetails(this.root);
    this.root.userData.authoring =
      'Revisão 5: conjunto cabeça/cabelo mais contido, tronco e membros alongados, franja curva e botas apoiadas pela sola; vestido e identidade girl-v2 preservados. Costas interpretadas em volume.';
  }
  /** Agrupa detalhes rígidos do mesmo material por articulação, preservando os pivôs animados. */
  batchDetails(parent) {
    for (const child of [...parent.children]) if (!child.isMesh) this.batchDetails(child);
    const groups = new Map();
    for (const mesh of parent.children)
      if (mesh.isMesh && !mesh.isInstancedMesh) {
        if (!groups.has(mesh.material)) groups.set(mesh.material, []);
        groups.get(mesh.material).push(mesh);
      }
    for (const [material, meshes] of groups) {
      if (meshes.length < 2) continue;
      const values = {
        position: [],
        normal: [],
        color: [],
      };
      for (const mesh of meshes) {
        mesh.updateMatrix();
        const g = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
        g.applyMatrix4(mesh.matrix);
        for (const name of Object.keys(values)) values[name].push(...g.attributes[name].array);
        g.dispose();
        parent.remove(mesh);
      }
      const geometry = this.own(new T.BufferGeometry());
      for (const [name, array] of Object.entries(values))
        geometry.setAttribute(name, new T.Float32BufferAttribute(array, 3));
      const merged = new T.Mesh(geometry, material);
      merged.name = 'DetalhesAgrupados';
      parent.add(merged);
    }
  }
  /** Grava sombreamento pintado nos vértices para preservar tons sem lavagem pelas luzes da sala. */
  shade(geometry) {
    const normals = geometry.attributes.normal,
      colors = [];
    for (let i = 0; i < normals.count; i++) {
      const light = T.MathUtils.clamp(
        0.95 + normals.getY(i) * 0.04 - normals.getX(i) * 0.025 - normals.getZ(i) * 0.02,
        0.85,
        1,
      );
      colors.push(light, light * 0.985, light * 0.98);
    }
    geometry.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
    return this.own(geometry);
  }
  /** Acrescenta um pivô nomeado mantendo poses e malhas independentes da simulação. */
  joint(parent, name, x, y, z) {
    const group = new T.Group();
    group.name = name;
    group.position.set(x, y, z);
    parent.add(group);
    return group;
  }
  /** Instancia volume de pele ou detalhe com geometria compartilhada. */
  volume(parent, material, position, scale) {
    const mesh = new T.Mesh(this.sphere, this.materials[material]);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    parent.add(mesh);
    return mesh;
  }
  /** Constrói membro contínuo e afunilado em vez de duas contas ovais separadas. */
  limb(parent, material, length, end, start) {
    const geometry = new T.LatheGeometry(
      [
        [0, 0],
        [start, 0.005],
        [start * 0.95, -length * 0.28],
        [end, -length * 0.85],
        [0, -length],
      ]
        .reverse()
        .map(([r, y]) => new T.Vector2(r, y)),
      16,
    );
    const mesh = new T.Mesh(this.shade(geometry), this.materials[material]);
    parent.add(mesh);
    return mesh;
  }
  /** Forma a manga bufante clara com gomos macios, franzido e punho salmão estreito. */
  buildSleeve(parent) {
    const geometry = new T.SphereGeometry(1, 32, 20),
      p = geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        y = p.getY(i),
        z = p.getZ(i),
        angle = Math.atan2(z, x);
      const gathering = 1 + 0.045 * Math.cos(angle * 8) * (1 - y * y);
      p.setXYZ(i, x * gathering, y, z * gathering);
    }
    geometry.computeVertexNormals();
    const sleeve = new T.Mesh(this.shade(geometry), this.materials.cream);
    sleeve.name = 'MangaBufante';
    sleeve.position.set(0, -0.035, 0);
    sleeve.scale.set(0.108, 0.105, 0.105);
    parent.add(sleeve);
    const cuffGeometry = new T.TorusGeometry(0.073, 0.012, 8, 32);
    const cuff = new T.Mesh(this.shade(cuffGeometry), this.materials.pink);
    cuff.name = 'PunhoDaManga';
    cuff.rotation.x = Math.PI / 2;
    cuff.position.y = -0.115;
    parent.add(cuff);
  }
  /** Reconstrói o franzido junto à cintura e pregas que abrem suavemente na saia. */
  cloth(parent, material, profile, full) {
    const columns = 96,
      rows = 20,
      positions = [],
      indices = [],
      gathers = [];
    const low = profile[0][1],
      high = profile.at(-1)[1];
    for (let row = 0; row <= rows; row++)
      for (let col = 0; col <= columns; col++) {
        const h = row / rows,
          y = T.MathUtils.lerp(low, high, h);
        let segment = 0;
        while (segment < profile.length - 2 && profile[segment + 1][1] < y) segment++;
        const t =
          (y - profile[segment][1]) /
          Math.max(0.0001, profile[segment + 1][1] - profile[segment][1]);
        const radius = T.MathUtils.lerp(profile[segment][0], profile[segment + 1][0], t);
        const a = full
          ? (col / columns) * Math.PI * 2
          : Math.PI * 0.7 + (col / columns) * Math.PI * 0.6;
        const waist = Math.exp(-(((y - 0.035) / 0.075) ** 2)),
          amplitude = 0.004 + 0.02 * waist;
        const fold = Math.cos(a * 12),
          r = radius + fold * amplitude;
        positions.push(
          Math.sin(a) * r,
          y + Math.cos(a * 12) * 0.004 * (1 - h),
          Math.cos(a) * r * 0.78,
        );
        gathers.push(1 - 0.15 * waist * Math.pow((1 - fold) / 2, 5));
        if (row < rows && col < columns) {
          const n = row * (columns + 1) + col,
            b = n + columns + 1;
          indices.push(n, n + 1, b, n + 1, b + 1, b);
        }
      }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    this.shade(geometry);
    const colors = geometry.attributes.color;
    for (let i = 0; i < gathers.length; i++)
      colors.setXYZ(
        i,
        colors.getX(i) * gathers[i],
        colors.getY(i) * gathers[i],
        colors.getZ(i) * gathers[i],
      );
    const mesh = new T.Mesh(geometry, this.materials[material]);
    mesh.name = 'TecidoFranzido_' + material;
    parent.add(mesh);
    return mesh;
  }
  /** Extruda um contorno de mecha/peça com bordas chanfradas para uma silhueta autoral. */
  silhouette(parent, material, points, depth, position) {
    const shape = new T.Shape();
    const last = points.at(-1);
    shape.moveTo((last[0] + points[0][0]) / 2, (last[1] + points[0][1]) / 2);
    for (let i = 0; i < points.length; i++) {
      const next = points[(i + 1) % points.length];
      shape.quadraticCurveTo(
        ...points[i],
        (points[i][0] + next[0]) / 2,
        (points[i][1] + next[1]) / 2,
      );
    }
    shape.closePath();
    const g = new T.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSize: 0.018,
      bevelThickness: 0.02,
      bevelSegments: 3,
      curveSegments: 8,
      steps: 1,
    });
    const mesh = new T.Mesh(this.shade(g), this.materials[material]);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }
  /** Varre uma mecha curva afunilada para conservar volume nas vistas laterais e traseiras. */
  sweep(parent, material, points, radii) {
    const curve = new T.CatmullRomCurve3(points.map((p) => new T.Vector3(...p)));
    const frames = curve.computeFrenetFrames(32, false),
      positions = [],
      indices = [];
    for (let i = 0; i <= 32; i++) {
      const t = i / 32,
        p = curve.getPointAt(t),
        f = t * (radii.length - 1),
        k = Math.min(radii.length - 2, Math.floor(f));
      const radius = T.MathUtils.lerp(radii[k], radii[k + 1], f - k);
      for (let j = 0; j <= 12; j++) {
        const angle = (j / 12) * Math.PI * 2;
        const v = p
          .clone()
          .addScaledVector(frames.normals[i], Math.cos(angle) * radius)
          .addScaledVector(frames.binormals[i], Math.sin(angle) * radius);
        positions.push(v.x, v.y, v.z);
        if (i < 32 && j < 12) {
          const a = i * 13 + j,
            b = a + 13;
          indices.push(a, a + 1, b, a + 1, b + 1, b);
        }
      }
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    parent.add(new T.Mesh(this.shade(g), this.materials[material]));
  }
  /** Modela franja e duas marias-chiquinhas curtas, com laços e pontas articuladas. */
  buildHair() {
    const positions = [],
      indices = [],
      rows = 16,
      columns = 48;
    for (let row = 0; row <= rows; row++)
      for (let col = 0; col <= columns; col++) {
        const phi = (col / columns) * Math.PI * 2,
          theta = (row / rows) * (1.18 + (Math.cos(phi) + 1) * 0.56);
        positions.push(
          Math.sin(theta) * Math.sin(phi) * 0.35,
          0.17 + Math.cos(theta) * 0.32,
          Math.sin(theta) * Math.cos(phi) * 0.3,
        );
        if (row < rows && col < columns) {
          const a = row * (columns + 1) + col,
            b = a + columns + 1;
          indices.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
    const cap = new T.BufferGeometry();
    cap.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    cap.setIndex(indices);
    cap.computeVertexNormals();
    this.head.add(new T.Mesh(this.shade(cap), this.materials.hair));
    this.curveFringe(
      this.silhouette(
        this.head,
        'hair',
        [
          [-0.32, 0.2],
          [-0.28, 0.37],
          [-0.13, 0.44],
          [0.1, 0.44],
          [0.29, 0.31],
          [0.28, 0.13],
          [0.13, 0.19],
          [0.18, 0.29],
          [0.04, 0.22],
          [-0.03, 0.12],
          [-0.07, 0.24],
          [-0.23, 0.12],
        ],
        0.055,
        [0, 0, -0.285],
      ),
    );
    this.curveFringe(
      this.silhouette(
        this.head,
        'lock',
        [
          [-0.24, 0.32],
          [-0.12, 0.4],
          [0.1, 0.38],
          [0.18, 0.32],
          [0.01, 0.33],
          [-0.09, 0.26],
        ],
        0.015,
        [0, 0, -0.312],
      ),
    );
    for (const side of [-1, 1]) {
      this.sweep(
        this.head,
        'hair',
        [
          [side * 0.29, 0.2, -0.08],
          [side * 0.305, 0.08, -0.12],
          [side * 0.305, -0.045, -0.1],
          [side * 0.35, -0.015, -0.08],
        ],
        [0.055, 0.06, 0.045, 0.008],
      );
    }
    this.pigtails = [];
    for (const side of [-1, 1]) {
      const tail = this.joint(
        this.head,
        side < 0 ? 'MariaChiquinhaE' : 'MariaChiquinhaD',
        side * 0.29,
        0.29,
        0.1,
      );
      this.sweep(
        tail,
        'hair',
        [
          [0, 0.025, 0],
          [side * 0.09, -0.01, 0.08],
          [side * 0.13, -0.14, 0.15],
          [side * 0.1, -0.29, 0.14],
          [side * 0.02, -0.31, 0.13],
        ],
        [0.07, 0.125, 0.13, 0.1, 0.025],
      );
      this.sweep(
        tail,
        'lock',
        [
          [side * 0.035, 0.03, 0.015],
          [side * 0.13, -0.06, 0.08],
          [side * 0.16, -0.17, 0.13],
          [side * 0.09, -0.27, 0.12],
        ],
        [0.015, 0.027, 0.027, 0.003],
      );
      const tip = this.joint(tail, 'PontaDoCabelo', side * 0.02, -0.31, 0.13);
      this.sweep(
        tip,
        'hair',
        [
          [0, 0, 0],
          [side * 0.04, -0.035, 0.005],
          [side * 0.11, 0.015, 0.02],
        ],
        [0.07, 0.05, 0.002],
      );
      this.bow(tail, [0, 0.055, -0.04], 0.075);
      this.pigtails.push({
        tail,
        tip,
        side,
      });
    }
    // Referências preservadas para ferramentas de revisão anteriores.
    this.ponytail = this.pigtails[0].tail;
    this.tailTip = this.pigtails[0].tip;
  }
  /** Faz a franja acompanhar a curvatura das têmporas, evitando a placa reta vista de perfil. */
  curveFringe(mesh) {
    const positions = mesh.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++)
      positions.setZ(i, positions.getZ(i) + 0.13 * (positions.getX(i) / 0.32) ** 2);
    mesh.geometry.computeVertexNormals();
  }
  /** Constrói laço de tecido com duas alças e nó central. */
  bow(parent, position, size) {
    const pivot = this.joint(parent, 'LacoRosa', ...position);
    for (const side of [-1, 1]) {
      const loop = this.volume(
        pivot,
        'pink',
        [side * size * 0.65, 0, 0],
        [size * 0.75, size * 0.48, size * 0.28],
      );
      loop.rotation.z = side * 0.28;
    }
    this.volume(pivot, 'rose', [0, 0, -size * 0.12], [size * 0.24, size * 0.28, size * 0.3]);
  }
  /** Repete o bordado em uma só chamada de desenho e acrescenta o laço traseiro. */
  buildDressDetails() {
    const count = 24,
      petals = 5,
      flowerGeometry = this.shade(new T.SphereGeometry(1, 6, 4));
    const flowers = new T.InstancedMesh(flowerGeometry, this.materials.pink, count * petals);
    flowers.name = 'BordadoDaBarra';
    const transform = new T.Object3D();
    let index = 0;
    for (let i = 0; i < count; i++)
      for (let j = 0; j < petals; j++) {
        const a = (i / count) * Math.PI * 2,
          b = (j / petals) * Math.PI * 2;
        const radius = 0.345 + Math.cos(a * 12) * 0.007;
        transform.position.set(
          Math.sin(a) * (radius + Math.sin(b) * 0.009),
          -0.115 + Math.cos(b) * 0.01,
          Math.cos(a) * (radius + Math.sin(b) * 0.009) * 0.78,
        );
        transform.scale.set(0.008, 0.008, 0.006);
        transform.updateMatrix();
        flowers.setMatrixAt(index++, transform.matrix);
      }
    this.skirt.add(flowers);
    this.bow(this.torso, [0, -0.015, 0.16], 0.105);
    this.bow(this.torso, [0, 0.255, -0.145], 0.045);
  }
  /** Desenha olhos menos circulares, nariz discreto e sobrancelhas da expressão de corrida. */
  buildFace() {
    for (const side of [-1, 1]) {
      this.volume(this.head, 'white', [side * 0.135, 0.1, -0.304], [0.074, 0.062, 0.015]);
      this.volume(this.head, 'eye', [side * 0.13, 0.09, -0.319], [0.034, 0.054, 0.01]);
      this.volume(this.head, 'white', [side * 0.13 - 0.009, 0.112, -0.33], [0.011, 0.013, 0.004]);
      const brow = this.volume(
        this.head,
        'hair',
        [side * 0.13, 0.183, -0.283],
        [0.072, 0.016, 0.016],
      );
      brow.rotation.z = side * 0.17;
    }
    this.volume(this.head, 'skin', [0, 0.025, -0.33], [0.028, 0.029, 0.022]);
    this.volume(this.head, 'rose', [0, -0.073, -0.3], [0.04, 0.007, 0.006]);
  }
  /** Recria a espada de madeira e a guarda azulada usada nos quadros de corrida da arena. */
  buildSword() {
    const hand = this.arms[1].elbow;
    const sword = this.joint(hand, 'EspadaDeMadeira', 0, -this.proportions.forearm, -0.045);
    sword.rotation.x = 0.9;
    this.sword = sword;
    this.silhouette(
      sword,
      'cream',
      [
        [-0.025, 0],
        [-0.038, -0.43],
        [0, -0.51],
        [0.038, -0.43],
        [0.025, 0],
      ],
      0.018,
      [0, -0.06, 0],
    );
    this.volume(sword, 'guard', [0, -0.05, 0], [0.105, 0.022, 0.028]);
    this.volume(sword, 'boot', [0, 0.015, 0], [0.024, 0.07, 0.025]);
  }
}
