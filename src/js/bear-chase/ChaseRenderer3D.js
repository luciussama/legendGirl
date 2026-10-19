import * as T from '../../vendor/three/three.module.js';
import { ChaseBearModel } from './ChaseBearModel.js';
import { ChaseToyModels } from './ChaseToyModels.js';
import { ChaseGirlModel } from './ChaseGirlModel.js';
import { ChaseGirlAnimation } from './ChaseGirlAnimation.js';
import { CHASE_CONFIG as C, clamp } from './ChaseConfig.js';

const ART = new URL('../../../assets/art/', import.meta.url);

/** Carrega uma imagem local com falha explícita, sem recorrer a artes aposentadas. */
function imageFile(path) {
  return new Promise((resolve, reject) => {
    const image = new Image(); image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Arte da perseguição ausente: ' + path));
    image.src = new URL(path, ART).href;
  });
}

/** Constrói somente uma janela da sala estendida com perspectiva e profundidade reais. */
export class ChaseRenderer3D {
  /** Cria canvas WebGL separado; a composição final continua no canvas 2D do host. */
  constructor() {
    this.renderer = new T.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(1); this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.scene = new T.Scene(); this.scene.background = new T.Color('#f3dfb8');
    this.scene.fog = new T.Fog('#f3dfb8', 36, 115);
    this.camera = new T.PerspectiveCamera(57, 1, .1, 130);
    this.resources = new Set(); this.segments = []; this.toys = new Map();
    this.frames = {}; this.disposed = false; this.chest = null;
    this.contextLost = false;
    this.onLost = event => { event.preventDefault(); this.contextLost = true; };
    this.onRestored = () => { this.contextLost = false; };
    this.renderer.domElement.addEventListener('webglcontextlost', this.onLost);
    this.renderer.domElement.addEventListener('webglcontextrestored', this.onRestored);
  }
  /** Marca recursos GPU de propriedade desta cena para descarte explícito. */
  own(resource) { this.resources.add(resource); return resource; }
  /** Converte uma imagem ou recorte em textura; não altera o arquivo de origem. */
  texture(image, crop = null) {
    let source = image;
    if (crop) {
      source = document.createElement('canvas'); source.width = crop.w; source.height = crop.h;
      source.getContext('2d').drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    }
    const texture = this.own(new T.Texture(source)); texture.colorSpace = T.SRGBColorSpace;
    texture.needsUpdate = true; texture.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    return texture;
  }
  /** Cria material ilustrado sem alterar paleta por iluminação física especular. */
  material(texture, color = '#ffffff') {
    return this.own(new T.MeshBasicMaterial({ map: texture || null, color, side: T.DoubleSide,
      transparent: Boolean(texture), alphaTest: texture ? .12 : 0 }));
  }
  /** Acrescenta uma superfície ou objeto com geometria realmente tridimensional. */
  mesh(parent, geometry, material, x, y, z) {
    const mesh = new T.Mesh(this.own(geometry), material); mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  }
  /** Cria um plano de personagem com âncora inferior e proporções nativas. */
  actor(texture, width, height) {
    const actor = this.mesh(this.scene, new T.PlaneGeometry(width, height), this.material(texture), 0, height / 2, 0);
    actor.userData.height = height; return actor;
  }
  /** Carrega somente as referências visuais usadas pela janela da prova. */
  async load() {
    const paths = {
      env: 'toy-room/environment-sheet.png',
      wall: 'toy-room/stage1/wallpaper-v1.png', trim: 'toy-room/stage1/oak-trim-v1.png',
      rug: 'toy-room/stage1/rectangular-rug-v1.png', window: 'toy-room/stage1/window-curtains-v1.png',
      shelf: 'toy-room/stage3/bookshelf-v1.png', castle: 'toy-room/stage3/block-castle-v1.png',
      fairy: 'toy-room/stage3/illustrated-fairy-v1.png', blocks: 'toy-room/stage3/stacking-blocks-v1.png',
      bunny: 'toy-room/stage3/cotton-bunny-v1.png', chest: 'toy-room/chest-brinquedos-v1.png',
    };
    const loaded = await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await imageFile(path)]));
    if (this.disposed) return;
    const images = Object.fromEntries(loaded);
    this.frames.toys = { blocks: this.texture(images.blocks), bunny: this.texture(images.bunny),
      train: null };
    this.floor = this.texture(images.env, { x: 27, y: 151, w: 186, h: 48 });
    this.floor.wrapS = this.floor.wrapT = T.RepeatWrapping; this.floor.repeat.set(5, 12);
    this.wall = this.texture(images.wall); this.wall.wrapS = this.wall.wrapT = T.RepeatWrapping; this.wall.repeat.set(3, 1.5);
    this.trim = this.texture(images.trim); this.trim.wrapS = T.RepeatWrapping; this.trim.repeat.set(3, 1);
    this.decoration = { rug: this.texture(images.rug), window: this.texture(images.window),
      shelf: this.texture(images.shelf), castle: this.texture(images.castle), chest: this.texture(images.chest) };
    this.materials = { floor: this.material(this.floor), wall: this.material(this.wall), trim: this.material(this.trim),
      wood: this.material(null, '#9d5c32'), ceiling: this.material(null, '#fff0d8') };
    for (let i = 0; i < 12; i++) this.segments.push(this.buildSegment(i));
    this.girlModel = new ChaseGirlModel(resource => this.own(resource));
    this.girlAnimation = new ChaseGirlAnimation(this.girlModel);
    this.girl = this.girlModel.root; this.scene.add(this.girl);
    this.scene.add(new T.HemisphereLight('#ffffff', '#b3a19b', 1.8));
    const key = new T.DirectionalLight('#ffffff', 2.4); key.position.set(-3, 6, -4); this.scene.add(key);
    const fill = new T.DirectionalLight('#ffffff', .8); fill.position.set(3, 3, 5); this.scene.add(fill);
    const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=64;
    const shadowCtx=shadowCanvas.getContext('2d'),gradient=shadowCtx.createRadialGradient(32,32,3,32,32,32);
    gradient.addColorStop(0,'rgba(65,35,25,.26)');gradient.addColorStop(1,'rgba(65,35,25,0)');
    shadowCtx.fillStyle=gradient;shadowCtx.fillRect(0,0,64,64);
    this.contactShadow=this.mesh(this.scene,new T.PlaneGeometry(.85,.55),this.material(this.texture(shadowCanvas)),0,.025,0);
    this.contactShadow.rotation.x=-Math.PI/2;this.contactShadow.material.alphaTest=0;
    this.bearModel=new ChaseBearModel(resource=>this.own(resource),this.girlModel.sphere);
    this.bear=this.bearModel.root;this.scene.add(this.bear);
    this.fairy = this.actor(this.texture(images.fairy), .63, .7);
    this.chest = this.actor(this.decoration.chest, 2.4, 1.65); this.chest.visible = false;
    this.toyModels = new ChaseToyModels(resource => this.own(resource));
    this.ready = true;
  }
  /** Monta um módulo do mesmo quarto, sem linhas ou marcações auxiliares de caminho. */
  buildSegment(index) {
    const group = new T.Group(); this.scene.add(group);
    const floor = this.mesh(group, new T.PlaneGeometry(11, 12), this.materials.floor, 0, 0, 0); floor.rotation.x = -Math.PI / 2;
    for (const side of [-1, 1]) {
      const wall = this.mesh(group, new T.PlaneGeometry(12, 6), this.materials.wall, side * 5.5, 3, 0);
      wall.rotation.y = side * Math.PI / 2;
      const trim = this.mesh(group, new T.PlaneGeometry(12, .7), this.materials.trim, side * 5.47, .35, 0);
      trim.rotation.y = side * Math.PI / 2;
      const win = this.mesh(group, new T.PlaneGeometry(2.4, 3.2), this.material(this.decoration.window), side * 5.43, 3.2, -2 + (side > 0 ? 2.8 : 0));
      win.rotation.y = -side * Math.PI / 2; win.visible = (index + (side > 0 ? 1 : 0)) % 3 !== 0;
      // Estruturas com volume ficam nas laterais; a ilustração conserva detalhes da sala.
      const furniture = (index + (side > 0 ? 1 : 0)) % 3 === 0 ? this.decoration.castle : this.decoration.shelf;
      this.mesh(group, new T.BoxGeometry(1.40, 2.25, .22), this.materials.trim, side * 4.55, 1.125, 3.76);
      const picture=this.mesh(group, new T.PlaneGeometry(1.5, 2.5), this.material(furniture), side * 4.55, 1.25, 3.9);
      picture.position.z += side > 0 ? -2.5 : 0;
      group.children[group.children.length-2].position.z += side > 0 ? -2.5 : 0;
    }
    if (index % 2 === 0) {
      const rug = this.mesh(group, new T.PlaneGeometry(3, 4.2), this.material(this.decoration.rug), (index % 4 === 0 ? -.65 : .5), .015, 0);
      rug.rotation.x = -Math.PI / 2;
    }
    // O teto existe no mesmo volume, embora a câmera olhe predominantemente para o piso.
    const ceiling = this.mesh(group, new T.PlaneGeometry(11, 12), this.materials.ceiling, 0, 6, 0); ceiling.rotation.x = Math.PI / 2;
    return group;
  }
  /** Reutiliza meshes de brinquedos e aplica a trajetória visível de lançamento. */
  updateToys(state) {
    const live = new Set();
    for (const obstacle of state.obstacles) {
      live.add(obstacle.id);
      let mesh = this.toys.get(obstacle.id);
      if (!mesh) {
        mesh = obstacle.kind === 'train' ? this.toyModels.train() : this.actor(this.frames.toys[obstacle.kind], 1.1, 1.05);
        this.scene.add(mesh); this.toys.set(obstacle.id, mesh);
      }
      const t = clamp(obstacle.age / C.flight, 0, 1);
      mesh.position.set(obstacle.fromX + (obstacle.x - obstacle.fromX) * t,
        (obstacle.kind === 'train' ? .32 : .525) + (1 - t) * 1.2 + Math.sin(t * Math.PI) * 1.4,
        state.distance - (obstacle.fromZ + (obstacle.z - obstacle.fromZ) * t));
      mesh.visible = !obstacle.hit;
    }
    for (const [id, mesh] of this.toys) if (!live.has(id)) {
      this.scene.remove(mesh);
      if (mesh.isMesh) { mesh.material.dispose(); mesh.geometry.dispose();
        this.resources.delete(mesh.material); this.resources.delete(mesh.geometry); } this.toys.delete(id);
    }
  }
  /** Compõe o quadro WebGL no canvas 2D, preservando controles e HUD existentes. */
  render(ctx, canvas, state) {
    if (!this.ready || this.contextLost) return;
    const width = Math.min(canvas.width, 1440), height = Math.round(width * canvas.height / canvas.width);
    if (this.renderer.domElement.width !== width || this.renderer.domElement.height !== height) {
      this.renderer.setSize(width, height, false); this.camera.aspect = width / height; this.camera.updateProjectionMatrix();
    }
    const cutscene = ['BEAR_DOWN', 'GIRL_APPROACH', 'BEAR_RISE', 'CHASE_START'].includes(state.stage);
    const portrait = canvas.height > canvas.width;
    this.camera.position.set(state.x * .28 + (cutscene ? 1.8 : 0), portrait ? 5.2 : 3.9, portrait ? 9 : 7.5);
    this.camera.lookAt(state.x * .35, 1.2, -8);
    const base = Math.floor(state.distance / 12);
    for (let i = 0; i < this.segments.length; i++) this.segments[i].position.z = state.distance - (base + i - 2) * 12;
    this.girlAnimation.apply(state);
    this.contactShadow.position.x=state.x;
    this.bearModel.apply(state);
    this.fairy.position.set(state.fairy.x, 2.05 + (state.fairy.y - 2.65), .55 + Math.abs(state.fairy.z));
    this.fairy.rotation.z = Math.sin(state.time * 3) * .08;
    this.chest.visible = ['CAUGHT', 'CHEST_RETURN', 'COMPLETE'].includes(state.stage);
    this.chest.position.set(0, .825, -state.gap - .3);
    this.updateToys(state);
    this.renderer.render(this.scene, this.camera);
    ctx.drawImage(this.renderer.domElement, 0, 0, canvas.width, canvas.height);
  }
  /** Descarta somente materiais, geometrias e texturas desta instância. */
  destroy() {
    this.disposed = true;
    for (const resource of this.resources) resource.dispose();
    this.resources.clear(); this.toys.clear(); this.scene.clear();
    this.renderer.domElement.removeEventListener('webglcontextlost', this.onLost);
    this.renderer.domElement.removeEventListener('webglcontextrestored', this.onRestored);
    this.renderer.dispose(); this.renderer.forceContextLoss();
  }
}
