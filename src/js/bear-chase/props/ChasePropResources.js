import * as T from '../../../vendor/three/three.module.js';
import { PICTORIAL_ATLASES } from './PictorialMaterialAssets.js';

/** Materiais e malhas compartilhados pelo catálogo, com propriedade GPU explícita. */
export class ChasePropResources {
  /** Mantém a propriedade GPU fora dos modelos e recebe a imagem original do armário. */
  constructor(woodImage, externalResources = null, pictorialImages = {}) {
    this.resources = new Set(); this.materials = new Map();
    this.pictorialImages = pictorialImages;
    this.woodImage = woodImage; this.externalResources = externalResources; this.textures = new Map();
  }
  /** Registra um recurso uma única vez para descarte pelo proprietário da cena. */
  own(resource) { this.resources.add(resource); this.externalResources?.add(resource); return resource; }
  /** Extrai somente madeira sem ferragens, bordas, perspectiva global ou sombra de chão. */
  woodTexture(painted) {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d'); ctx.drawImage(this.woodImage, 55, 78, 60, 52, 0, 0, 128, 128);
    if (painted) {
      const pixels = ctx.getImageData(0, 0, 128, 128);
      for (let i = 0; i < pixels.data.length; i += 4) {
        const value = Math.round(180 + pixels.data[i] * .29);
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
      }
      ctx.putImageData(pixels, 0, 0);
    }
    const texture = this.own(new T.CanvasTexture(canvas)); texture.colorSpace = T.SRGBColorSpace;
    texture.wrapS = texture.wrapT = T.RepeatWrapping; texture.anisotropy = 4; return texture;
  }
  /** Aproveita fibras de uma região limpa da pelúcia original, sem olhos, sombra global ou costura. */
  fabricTexture(image) {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d'); ctx.drawImage(image, 45, 75, 8, 10, 0, 0, 64, 64);
    const pixels = ctx.getImageData(0, 0, 64, 64);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const value = Math.round(190 + pixels.data[i] * .25);
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value; pixels.data[i + 3] = 255;
    }
    ctx.putImageData(pixels, 0, 0);
    const texture = this.own(new T.CanvasTexture(canvas)); texture.colorSpace = T.SRGBColorSpace;
    texture.wrapS = texture.wrapT = T.RepeatWrapping; texture.repeat.set(3, 3); return texture;
  }
  /** Cria materiais foscos de paleta regional; o veio vem da fonte, sem ruído aleatório. */
  material(name, color, wood = false, texture = null) {
    if (wood && !this.textures.has(wood)) this.textures.set(wood, this.woodTexture(wood === 'painted'));
    if (!this.materials.has(name)) this.materials.set(name, this.own(new T.MeshStandardMaterial({
      color, map: texture || (wood ? this.textures.get(wood) : null),
      roughness: .95, metalness: 0, envMapIntensity: 0,
    })));
    return this.materials.get(name);
  }
  /** Seleciona uma região do atlas do próprio objeto; a malha recebe UVs com margem contra vazamento. */
  pictorialMaterial(asset, region, tint = '#ffffff') {
    const descriptor = PICTORIAL_ATLASES[asset], image = this.pictorialImages[descriptor?.key];
    if (!image) throw new Error('Atlas pictórico ausente: ' + asset);
    const textureKey = 'atlas:' + asset, materialKey = textureKey + ':' + region + ':' + tint;
    if (!this.textures.has(textureKey)) {
      const texture = this.own(new T.Texture(image)); texture.colorSpace = T.SRGBColorSpace;
      texture.anisotropy = 4; texture.needsUpdate = true; this.textures.set(textureKey, texture);
    }
    if (!this.materials.has(materialKey)) {
      const material = this.own(new T.MeshStandardMaterial({ map: this.textures.get(textureKey),
        color: tint, roughness: .95, metalness: 0, envMapIntensity: 0 }));
      const pad = 8 / Math.min(image.width, image.height), col = region % 2, row = Math.floor(region / 2);
      material.userData.atlasRect = [col * .5 + pad, (1 - row) * .5 + pad, .5 - 2 * pad, .5 - 2 * pad];
      material.userData.pictorialAsset = asset; material.userData.pictorialRegion = region;
      this.materials.set(materialKey, material);
    }
    return this.materials.get(materialKey);
  }
  /** Mescla peças imóveis por material ou atlas, preserva tintas por vértice e descarta as cópias intermediárias. */
  bake(parts, name, combineAtlas = false) {
    const root = new T.Group(); root.name = name;
    const batches = new Map();
    for (const { geometry, material, position, rotation } of parts) {
      const g = geometry.index ? geometry.toNonIndexed() : geometry;
      const matrix = new T.Matrix4().compose(new T.Vector3(...position),
        new T.Quaternion().setFromEuler(new T.Euler(...rotation)), new T.Vector3(1, 1, 1));
      g.applyMatrix4(matrix);
      if (material.userData.atlasRect) {
        const [u, v, w, h] = material.userData.atlasRect, uv = g.getAttribute('uv');
        for (let i = 0; i < uv.count; i++) uv.setXY(i, u + Math.max(0, Math.min(1, uv.getX(i))) * w,
          v + Math.max(0, Math.min(1, uv.getY(i))) * h);
      }
      let outputMaterial = material;
      if (combineAtlas) {
        const color = new Float32Array(g.getAttribute('position').count * 3);
        for (let i = 0; i < color.length; i += 3) { color[i] = material.color.r; color[i + 1] = material.color.g; color[i + 2] = material.color.b; }
        g.setAttribute('color', new T.BufferAttribute(color, 3)); outputMaterial = this.combinedMaterial(material);
      }
      if (!batches.has(outputMaterial)) batches.set(outputMaterial, []);
      batches.get(outputMaterial).push(g); if (g !== geometry) geometry.dispose();
    }
    for (const [material, geometries] of batches) {
      const merged = this.own(new T.BufferGeometry());
      for (const key of ['position', 'normal', 'uv', ...(combineAtlas ? ['color'] : [])]) {
        const values = geometries.flatMap(g => Array.from(g.getAttribute(key).array));
        merged.setAttribute(key, new T.Float32BufferAttribute(values, key === 'uv' ? 2 : 3));
      }
      merged.computeBoundingBox(); merged.computeBoundingSphere();
      root.add(new T.Mesh(merged, material)); for (const g of geometries) g.dispose();
    }
    root.userData.anchor = 'apoio inferior'; return root;
  }
  /** Compartilha material por atlas nos móveis estáticos; tintas locais ficam nas cores de vértice. */
  combinedMaterial(source) {
    const key = 'combined:' + (source.map?.uuid || 'solid') + ':' + source.roughness;
    if (!this.materials.has(key)) {
      const material = this.own(source.clone()); material.color.set('#ffffff'); material.vertexColors = true;
      material.userData = { pictorialAsset: source.userData.pictorialAsset, atlasRects: [] };
      this.materials.set(key, material);
    }
    const material = this.materials.get(key), rect = source.userData.atlasRect;
    if (rect && !material.userData.atlasRects.some(r => r.every((v, i) => v === rect[i]))) material.userData.atlasRects.push([...rect]);
    return material;
  }
  /** Libera as malhas/texturas compartilhadas somente quando o catálogo é encerrado. */
  dispose() {
    for (const resource of this.resources) { resource.dispose(); this.externalResources?.delete(resource); }
    this.resources.clear(); this.materials.clear(); this.textures.clear(); this.woodImage = null; this.pictorialImages = {};
  }
}

/** Acumula peças para construção local; não conhece colisões, fase, RNG ou câmera. */
export class PropParts {
  /** Inicia uma lista de peças estáticas, antes da mesclagem por material. */
  constructor() { this.parts = []; }
  /** Registra geometria local com transformação explícita em unidades da cena. */
  add(geometry, material, position, rotation = [0, 0, 0]) {
    this.parts.push({ geometry, material, position, rotation }); return this;
  }
  /** Modela uma peça de madeira com arestas arredondadas reais, sem contorno sobreposto. */
  box(material, position, size, radius = .015) {
    const [w, h, d] = size, r = Math.min(radius, w / 4, h / 4, d / 4);
    const shape = new T.Shape(); shape.moveTo(-w / 2 + r, -h / 2 + r);
    shape.lineTo(w / 2 - r, -h / 2 + r); shape.lineTo(w / 2 - r, h / 2 - r);
    shape.lineTo(-w / 2 + r, h / 2 - r); shape.closePath();
    const g = new T.ExtrudeGeometry(shape, { depth: d - 2 * r, bevelEnabled: true,
      bevelThickness: r, bevelSize: r, bevelSegments: 2, steps: 1, curveSegments: 1 });
    g.translate(0, 0, -d / 2 + r);
    // UVs por face evitam que coordenadas do extrusor estiquem ou repitam o veio nos triângulos.
    const positions = g.getAttribute('position'), normals = g.getAttribute('normal'), uv = g.getAttribute('uv');
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
      const nx = Math.abs(normals.getX(i)), ny = Math.abs(normals.getY(i)), nz = Math.abs(normals.getZ(i));
      if (nz >= nx && nz >= ny) uv.setXY(i, x / w + .5, y / h + .5);
      else if (ny >= nx) uv.setXY(i, x / w + .5, z / d + .5);
      else uv.setXY(i, z / d + .5, y / h + .5);
    }
    if (position[0] < 0) for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
    return this.add(g, material, position);
  }
  /** Constrói cilindros fechados, incluindo rodas, eixos, caldeira e ferragens. */
  cylinder(material, position, top, bottom, height, rotation = [0, 0, 0], segments = 20, axialGrain = false) {
    const geometry = new T.CylinderGeometry(top, bottom, height, segments);
    if (axialGrain) {
      const uv = geometry.getAttribute('uv');
      for (let i = 0; i < uv.count; i++) { const u = uv.getX(i); uv.setXY(i, uv.getY(i), 1 - u); }
    }
    return this.add(geometry, material, position, rotation);
  }
  /** Constrói um aro volumétrico para detalhes que precisam ser legíveis pelas laterais. */
  ring(material, position, radius, tube, rotation = [0, 0, 0]) {
    return this.add(new T.TorusGeometry(radius, tube, 6, 20), material, position, rotation);
  }
}
