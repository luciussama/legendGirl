import * as T from '../../vendor/three/three.module.js';
import { ChaseBearAnimation } from './ChaseBearAnimation.js';

/** Pelúcia articulada fiel ao urso da arena; geometria e animação têm responsabilidades próprias. */
export class ChaseBearModel {
  /** Recebe recursos da cena e o atlas pictórico; não modifica as artes da arena. */
  constructor(own, texture) {
    this.own = own;
    this.root = new T.Group();
    this.root.name = 'Urso3D';
    this.parts = new Map();
    this.material = own(
      new T.MeshStandardMaterial({
        map: texture,
        vertexColors: true,
        roughness: 1,
        metalness: 0,
      }),
    );
    this.pelvis = this.joint(this.root, 'Quadril', 0, 0.47, 0);
    this.torso = this.joint(this.pelvis, 'Peito', 0, 0.34, 0);
    this.volume(this.torso, 'fur', [0, 0, 0], [0.44, 0.53, 0.34]);
    // A barriga mantém pelúcia ocre; creme fica restrito a focinho, orelhas e palmas.
    this.volume(this.torso, 'fur', [0, -0.07, -0.24], [0.33, 0.39, 0.14], '#eee0c5');
    this.seam(
      this.torso,
      [
        [0, 0.34, 0.325],
        [0, 0.16, 0.35],
        [0, -0.1, 0.345],
        [0, -0.35, 0.27],
      ],
      0.005,
    );
    for (let i = 0; i < 7; i++)
      this.seam(
        this.torso,
        [
          [-0.018, 0.23 - i * 0.067, 0.35],
          [0.018, 0.22 - i * 0.067, 0.35],
        ],
        0.003,
      );

    this.head = this.joint(this.torso, 'Cabeça', 0, 0.6, -0.025);
    this.volume(this.head, 'fur', [0, 0, 0], [0.455, 0.39, 0.35]);
    this.ears = [];
    for (const side of [-1, 1]) {
      const ear = this.joint(this.head, 'Orelha', side * 0.35, 0.3, 0.005);
      this.volume(ear, 'fur', [0, 0, 0], [0.145, 0.15, 0.105]);
      this.volume(ear, 'shade', [0, 0, -0.081], [0.1, 0.104, 0.031], '#e2be93');
      this.ears.push(ear);
      this.volume(this.head, 'dark', [side * 0.16, 0.025, -0.325], [0.04, 0.055, 0.029]);
      this.volume(this.head, 'glint', [side * 0.168, 0.044, -0.349], [0.01, 0.014, 0.006]);
    }
    this.volume(this.head, 'cream', [0, -0.12, -0.326], [0.23, 0.15, 0.115]);
    this.volume(this.head, 'dark', [0, -0.066, -0.43], [0.073, 0.049, 0.032]);
    this.seam(
      this.head,
      [
        [0, -0.095, -0.444],
        [0, -0.15, -0.442],
        [-0.052, -0.171, -0.424],
      ],
      0.005,
    );
    this.seam(
      this.head,
      [
        [0, -0.15, -0.442],
        [0.052, -0.171, -0.424],
      ],
      0.005,
    );

    this.bow = [];
    this.volume(this.torso, 'ribbon', [0, 0.3, -0.345], [0.067, 0.065, 0.048]);
    for (const side of [-1, 1]) {
      const flap = this.joint(this.torso, 'Laço', side * 0.055, 0.3, -0.344);
      this.ribbon(flap, side);
      this.volume(flap, 'ribbon', [side * 0.027, -0.095, 0.005], [0.045, 0.092, 0.025], '#e2c7b5', [
        0,
        0,
        side * 0.22,
      ]);
      this.bow.push(flap);
    }
    this.arms = [];
    this.legs = [];
    for (const side of [-1, 1]) {
      const shoulder = this.joint(this.torso, 'Ombro', side * 0.39, 0.18, 0);
      this.volume(shoulder, 'fur', [side * 0.018, -0.15, 0], [0.15, 0.25, 0.16]);
      const elbow = this.joint(shoulder, 'Cotovelo', side * 0.025, -0.235, 0);
      this.volume(elbow, 'fur', [0, -0.11, -0.015], [0.145, 0.2, 0.15]);
      this.arms.push({
        shoulder,
        elbow,
      });
      const hip = this.joint(this.pelvis, 'Coxa', side * 0.235, 0, 0);
      this.volume(hip, 'fur', [0, -0.115, 0], [0.18, 0.205, 0.18]);
      const knee = this.joint(hip, 'Joelho', 0, -0.24, 0);
      this.volume(knee, 'fur', [0, -0.105, 0], [0.16, 0.185, 0.16]);
      const ankle = this.joint(knee, 'Tornozelo', 0, -0.24, 0);
      this.volume(ankle, 'fur', [0, 0, -0.065], [0.195, 0.125, 0.24]);
      this.volume(ankle, 'cream', [0, -0.105, -0.083], [0.139, 0.029, 0.17]);
      this.seam(
        ankle,
        [
          [-0.09, -0.122, -0.12],
          [0, -0.128, -0.2],
          [0.09, -0.122, -0.12],
        ],
        0.004,
      );
      this.legs.push({
        hip,
        knee,
        ankle,
      });
    }
    this.bake();
    this.body = this.torso.children.find((object) => object.isMesh);
    this.animation = new ChaseBearAnimation(this);
    this.root.userData.authoring =
      'Urso da arena: pelúcia ocre, focinho curto, laço vermelho e apoios articulados. Costas interpretadas.';
  }

  /** Cria um pivô nomeado; partes imóveis desse pivô serão mescladas para reduzir chamadas de desenho. */
  joint(parent, name, x, y, z) {
    const group = new T.Group();
    group.name = name;
    group.position.set(x, y, z);
    parent.add(group);
    return group;
  }

  /** Acrescenta um volume macio, sem compartilhar a geometria colorida da menina. */
  volume(parent, region, position, scale, tint = '#ffffff', rotation = [0, 0, 0]) {
    const geometry = new T.SphereGeometry(1, 32, 24);
    geometry.scale(...scale);
    geometry.applyQuaternion(new T.Quaternion().setFromEuler(new T.Euler(...rotation)));
    geometry.translate(...position);
    this.collect(parent, geometry, region, tint);
  }

  /** Modela costura curta sobre a pelúcia, sem contornos técnicos ou planos sobrepostos. */
  seam(parent, points, radius) {
    const path = new T.CatmullRomCurve3(points.map((point) => new T.Vector3(...point)));
    this.collect(parent, new T.TubeGeometry(path, 24, radius, 5, false), 'shade', '#76563f');
  }

  /** Modela uma aba de laço com tecido dobrado em leque, preservando a silhueta da referência. */
  ribbon(parent, side) {
    const shape = new T.Shape();
    shape.moveTo(0, -0.02);
    shape.quadraticCurveTo(side * 0.08, -0.055, side * 0.16, -0.075);
    shape.quadraticCurveTo(side * 0.19, 0, side * 0.16, 0.075);
    shape.quadraticCurveTo(side * 0.08, 0.055, 0, 0.02);
    shape.closePath();
    const geometry = new T.ExtrudeGeometry(shape, {
      depth: 0.025,
      bevelEnabled: true,
      bevelSize: 0.008,
      bevelThickness: 0.008,
      bevelSegments: 3,
      curveSegments: 12,
    });
    geometry.translate(0, 0, -0.025);
    geometry.computeBoundingBox();
    const box = geometry.boundingBox,
      span = box.getSize(new T.Vector3()),
      positions = geometry.attributes.position,
      uv = geometry.attributes.uv;
    for (let i = 0; i < uv.count; i++)
      uv.setXY(
        i,
        (positions.getX(i) - box.min.x) / span.x,
        (positions.getY(i) - box.min.y) / span.y,
      );
    this.collect(parent, geometry, 'ribbon', '#ffffff');
  }

  /** Remapeia UVs para um quadrante com margem; grava a tinta local antes de mesclar as partes. */
  collect(parent, source, region, tint) {
    const geometry = source.index ? source.toNonIndexed() : source.clone();
    source.dispose();
    const uv = geometry.attributes.uv;
    const regions = {
      fur: [0, 1],
      cream: [1, 1],
      ribbon: [0, 0],
      shade: [1, 0],
      dark: [1, 0],
      glint: [1, 1],
    };
    const [column, row] = regions[region];
    for (let i = 0; i < uv.count; i++)
      uv.setXY(
        i,
        column * 0.5 + 0.009 + uv.getX(i) * 0.482,
        row * 0.5 + 0.009 + uv.getY(i) * 0.482,
      );
    const color = new T.Color(
      region === 'dark' ? '#211a15' : region === 'glint' ? '#ffffff' : tint,
    );
    const colors = new Float32Array(geometry.attributes.position.count * 3);
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    geometry.setAttribute('color', new T.BufferAttribute(colors, 3));
    if (!this.parts.has(parent)) this.parts.set(parent, []);
    this.parts.get(parent).push(geometry);
  }

  /** Mescla somente partes do mesmo pivô; joelhos, cotovelos e acessórios continuam articuláveis. */
  bake() {
    for (const [parent, parts] of this.parts) {
      const geometry = this.own(new T.BufferGeometry());
      for (const [name, size] of [
        ['position', 3],
        ['normal', 3],
        ['uv', 2],
        ['color', 3],
      ]) {
        const count = parts.reduce((sum, part) => sum + part.attributes[name].array.length, 0);
        const values = new Float32Array(count);
        let offset = 0;
        for (const part of parts) {
          values.set(part.attributes[name].array, offset);
          offset += part.attributes[name].array.length;
        }
        geometry.setAttribute(name, new T.BufferAttribute(values, size));
      }
      geometry.computeBoundingSphere();
      parent.add(new T.Mesh(geometry, this.material));
      for (const part of parts) part.dispose();
    }
    this.parts.clear();
  }

  /** Delega a pose de apresentação; captura, colisões e lançamento continuam na simulação existente. */
  apply(state) {
    this.animation.apply(state);
  }
}
