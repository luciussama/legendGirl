import * as T from '../../vendor/three/three.module.js';
import { ChaseBearModel } from './ChaseBearModel.js';
import { PICTORIAL_ATLASES } from './props/PictorialMaterialAssets.js';
import { ToyChestProp } from './props/ToyChestProp.js';
import { ChasePropCatalog } from './props/ChasePropCatalog.js';
import { ChaseToyModels } from './ChaseToyModels.js';
import { ChaseGirlModel } from './ChaseGirlModel.js';
import { ChaseGirlAnimation } from './ChaseGirlAnimation.js';
import { ChaseFairyModel } from './ChaseFairyModel.js';
import { CHASE_CONFIG as C, clamp } from './ChaseConfig.js';

import { ChaseLighting } from './ChaseLighting.js';
import { ChaseRoom } from './ChaseRoom.js';
import { chaseCameraFrame } from './ChaseCamera.js';
import { routePoint, routeFrame } from './ChaseRoute.js';

const ART = new URL('../../../assets/art/', import.meta.url);

/** Carrega uma imagem local com falha explícita, sem recorrer a artes aposentadas. */
async function imageFile(path) {
  const image = new Image(); image.src = new URL(path, ART).href;
  try { await image.decode(); } catch { throw new Error('Arte da perseguição ausente ou inválida: ' + path); }
  if (!image.naturalWidth || !image.naturalHeight) throw new Error('Arte da perseguição vazia: ' + path);
  return image;
}

/** Constrói somente uma janela da sala estendida com perspectiva e profundidade reais. */
export class ChaseRenderer3D {
  /** Cria canvas WebGL separado; a composição final continua no canvas 2D do host. */
  constructor() {
    this.renderer = new T.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(1); this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.scene = new T.Scene(); this.scene.background = new T.Color('#f3dfb8');
    this.scene.fog = new T.Fog('#f3dfb8', 48, 100);
    this.camera = new T.PerspectiveCamera(57, 1, .1, 130);
    this.resources = new Set(); this.segments = []; this.toys = new Map();
    this.frames = {}; this.disposed = false; this.chest = null;
    this.ready = false;
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
  /**
   * Prepara a madeira repetida como bytes RGBA e níveis completos de redução.
   * Evita depender do upload de canvas e da geração de mipmaps sRGB pelo driver.
   * Mantém o recorte original, a orientação e o tamanho das tábuas no mundo.
   * @param {HTMLImageElement} image Prancha existente do ambiente.
   * @returns {T.DataTexture} Textura de propriedade do renderer, liberada no descarte.
   */
  floorTexture(image) {
    const source = document.createElement('canvas');
    source.width = 256; source.height = 64;
    const context = source.getContext('2d');
    context.drawImage(image, 27, 151, 186, 48, 0, 0, source.width, source.height);
    this.floorSource = source;
    const levels = [];
    for (let width = source.width, height = source.height; ; width = Math.max(1, width / 2), height = Math.max(1, height / 2)) {
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(source, 0, 0, width, height);
      const pixels = ctx.getImageData(0, 0, width, height).data;
      const data = new Uint8Array(pixels.length), stride = width * 4;
      // DataTexture recebe bytes sem flipY do DOM: inverte as linhas explicitamente.
      for (let y = 0; y < height; y++) data.set(pixels.subarray(y * stride, (y + 1) * stride), (height - y - 1) * stride);
      levels.push({ data, width, height });
      if (width === 1 && height === 1) break;
    }
    const texture = this.own(new T.DataTexture(levels[0].data, source.width, source.height));
    texture.mipmaps = levels; texture.generateMipmaps = false;
    texture.colorSpace = T.SRGBColorSpace;
    texture.minFilter = T.LinearMipmapLinearFilter; texture.magFilter = T.LinearFilter;
    texture.wrapS = texture.wrapT = T.RepeatWrapping; texture.repeat.set(9, 2);
    texture.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
    return texture;
  }
  /** Confere a amostragem real do piso na GPU antes de construir/liberar o mapa. */
  floorIsVisible() {
    const target = new T.WebGLRenderTarget(8, 8);
    const material = new T.MeshBasicMaterial({ map: this.floor, toneMapped: false });
    const geometry = new T.PlaneGeometry(2, 2), scene = new T.Scene();
    const camera = new T.OrthographicCamera(-1, 1, 1, -1, .1, 2); camera.position.z = 1;
    scene.add(new T.Mesh(geometry, material));
    const previous = this.renderer.getRenderTarget();
    try {
      this.renderer.initTexture(this.floor);
      this.renderer.setRenderTarget(target); this.renderer.render(scene, camera);
      const pixels = new Uint8Array(8 * 8 * 4);
      this.renderer.readRenderTargetPixels(target, 0, 0, 8, 8, pixels);
      let visible = 0;
      for (let i = 0; i < pixels.length; i += 4)
        if (pixels[i] > 10 && pixels[i] > pixels[i + 2] * 1.2 && pixels[i + 3] > 200) visible++;
      return this.renderer.getContext().getError() === 0 && visible >= 48;
    } finally {
      this.renderer.setRenderTarget(previous); target.dispose(); material.dispose(); geometry.dispose();
    }
  }
  /** Se o driver rejeitar a cadeia manual, tenta a mesma madeira sem mipmaps. */
  prepareFloor() {
    this.floorMode = 'mipmaps';
    if (this.floorIsVisible()) return;
    const previous = this.floor;
    const texture = this.own(new T.CanvasTexture(this.floorSource));
    texture.colorSpace = T.SRGBColorSpace; texture.generateMipmaps = false;
    texture.minFilter = texture.magFilter = T.LinearFilter; texture.anisotropy = 1;
    texture.wrapS = texture.wrapT = T.RepeatWrapping; texture.repeat.set(9, 2);
    this.floor = texture; previous.dispose(); this.resources.delete(previous);
    this.floorMode = 'linear';
    if (!this.floorIsVisible()) throw new Error('O piso de madeira não pôde ser preparado no dispositivo.');
  }
  /** Envia todos os mapas e compila materiais antes da primeira apresentação do 3D. */
  async prepareVisualResources() {
    if (this.disposed) return;
    const gl = this.renderer.getContext();
    if (gl.isContextLost()) throw new Error('Contexto 3D indisponível durante o carregamento.');
    for (const texture of this.resources) {
      if (!texture.isTexture) continue;
      const image = texture.image;
      if (!image || !image.width || !image.height) throw new Error('Textura visual da perseguição incompleta.');
      this.renderer.initTexture(texture);
      if (gl.getError() !== gl.NO_ERROR) throw new Error('Falha ao enviar uma textura visual da perseguição.');
    }
    await this.renderer.compileAsync(this.scene, this.camera);
    if (gl.isContextLost() || gl.getError() !== gl.NO_ERROR) throw new Error('Falha ao preparar os materiais da perseguição.');
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
      ...Object.fromEntries(Object.values(PICTORIAL_ATLASES).map(({ key, path }) => [key, path])),
      bearAtlas: 'toy-room/bear-chase/materials/urso-atlas-v2.png',
      env: 'toy-room/environment-sheet.png',
      wall: 'toy-room/stage1/wallpaper-v1.png', trim: 'toy-room/stage1/oak-trim-v1.png',
      rug: 'toy-room/stage1/rectangular-rug-v1.png', window: 'toy-room/stage1/window-curtains-v1.png',
      cabinet: 'toy-room/stage3/oak-cabinet-v1.png',
      bunny: 'toy-room/stage3/cotton-bunny-v1.png', armchair: 'toy-room/stage3/armchair-v1.png',
    };
    // O piso é validado primeiro; nenhum mapa é construído com esse recurso pendente.
    const env = await imageFile(paths.env);
    if (this.disposed) return;
    this.floor = this.floorTexture(env); this.prepareFloor();
    const loaded = await Promise.all(Object.entries(paths).filter(([key]) => key !== 'env')
      .map(async ([key, path]) => [key, await imageFile(path)]));
    if (this.disposed) return;
    const images = { env, ...Object.fromEntries(loaded) };
    this.propCatalog = new ChasePropCatalog(images, this.resources);
    this.toyModels = new ChaseToyModels(this.propCatalog);
    this.wall = this.texture(images.wall); this.wall.wrapS = this.wall.wrapT = T.RepeatWrapping; this.wall.repeat.set(1, 1);
    this.trim = this.texture(images.trim); this.trim.wrapS = T.RepeatWrapping; this.trim.repeat.set(1, 1);
    this.decoration = { rug: this.texture(images.rug), window: this.texture(images.window) };
    this.materials = { floor: this.material(this.floor), wall: this.material(this.wall), trim: this.material(this.trim),
      wood: this.material(null, '#9d5c32'), ceiling: this.material(null, '#fff0d8') };
    // Superfícies opacas não participam da ordenação de transparência da sala inteira.
    for(const key of ['floor','wall','trim','ceiling']){
      const previous=this.materials[key];
      this.materials[key]=this.own(new T.MeshStandardMaterial({map:previous.map,color:previous.color,
        roughness:1,metalness:0,side:T.DoubleSide,alphaTest:key==='trim'?.12:0}));
      previous.dispose();this.resources.delete(previous);
    }
    this.prepareRoomResources();
    this.room = new ChaseRoom(this);
    this.girlModel = new ChaseGirlModel(resource => this.own(resource));
    this.girlAnimation = new ChaseGirlAnimation(this.girlModel);
    this.girl = this.girlModel.root; this.scene.add(this.girl);
    const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=64;
    const shadowCtx=shadowCanvas.getContext('2d'),gradient=shadowCtx.createRadialGradient(32,32,3,32,32,32);
    gradient.addColorStop(0,'rgba(65,35,25,.26)');gradient.addColorStop(1,'rgba(65,35,25,0)');
    shadowCtx.fillStyle=gradient;shadowCtx.fillRect(0,0,64,64);
    this.contactShadow=this.mesh(this.scene,new T.PlaneGeometry(.85,.55),this.material(this.texture(shadowCanvas)),0,.025,0);
    this.contactShadow.rotation.x=-Math.PI/2;this.contactShadow.material.alphaTest=0;this.contactShadow.material.depthWrite=false;
    this.bearModel=new ChaseBearModel(resource=>this.own(resource),this.texture(images.bearAtlas));
    this.bear=this.bearModel.root;this.scene.add(this.bear);
    this.fairyModel = new ChaseFairyModel(resource => this.own(resource));
    this.fairy = this.fairyModel.root; this.scene.add(this.fairy);
    this.chest = this.propCatalog.create('chest'); this.chest.visible = false; this.scene.add(this.chest);
    this.chest.rotation.y = -Math.PI / 2;
    this.lighting=new ChaseLighting(this);
    await this.prepareVisualResources();
    if (!this.disposed) this.ready = true;
  }
  /** Prepara materiais de adereços; superfícies contínuas pertencem ao construtor da sala. */
  prepareRoomResources() {
    this.roomMaterials={window:this.material(this.decoration.window),rug:this.own(new T.MeshStandardMaterial({map:this.decoration.rug,roughness:1,metalness:0,side:T.DoubleSide,transparent:true,alphaTest:.12}))};
  }
  /** Posiciona uma entidade no traçado preservando sua pose local e a altura de animação. */
  placeOnRoute(object, distance, lateral, height=0, alignSlope=false) {
    const p=routePoint(distance,lateral,height),f=routeFrame(distance);
    object.position.set(p.x,p.y,p.z);object.rotation.order='YXZ';object.rotation.y+=f.yaw;
    if(alignSlope)object.rotation.x+=f.pitch;
  }
  /** Reutiliza meshes de brinquedos e aplica a trajetória visível de lançamento. */
  updateToys(state) {
    const live = new Set();
    for (const obstacle of state.obstacles) {
      live.add(obstacle.id);
      let mesh = this.toys.get(obstacle.id);
      // Restauração pode reutilizar um ID com outro tipo; troca só a instância visual.
      if (mesh && mesh.userData.propId !== obstacle.kind) { this.propCatalog.release(mesh); mesh = null; }
      if (!mesh) {
        mesh = this.propCatalog.create(obstacle.kind);
        this.lighting.prepareObject(mesh);
        this.scene.add(mesh); this.toys.set(obstacle.id, mesh);
      }
      const t = clamp(obstacle.age / (obstacle.flight ?? C.flight), 0, 1);
      const lateral=obstacle.fromX+(obstacle.x-obstacle.fromX)*t;
      const distance=obstacle.fromZ+(obstacle.z-obstacle.fromZ)*t;
      // Grupos densos usam a largura real do modelo, preservando proporções e o vão visível.
      mesh.scale.setScalar(obstacle.fitWidth ? obstacle.width / mesh.userData.visualWidth : 1);
      mesh.rotation.set(0,0,0);
      const centeredLateral = lateral - (obstacle.fitWidth ? mesh.userData.visualCenterX * mesh.scale.x : 0);
      this.placeOnRoute(mesh,distance,centeredLateral,(1-t)*1.2+Math.sin(t*Math.PI)*1.4,true);
      mesh.visible = !obstacle.hit;
    }
    for (const [id, mesh] of this.toys) if (!live.has(id)) {
      this.propCatalog.release(mesh); this.toys.delete(id);
    }
  }
  /** Compõe o quadro WebGL no canvas 2D, preservando controles e HUD existentes. */
  render(ctx, canvas, state) {
    if (!this.ready || this.contextLost) return;
    const width = Math.min(canvas.width, 1440), height = Math.round(width * canvas.height / canvas.width);
    if (this.renderer.domElement.width !== width || this.renderer.domElement.height !== height) {
      this.renderer.setSize(width, height, false); this.camera.aspect = width / height; this.camera.updateProjectionMatrix();
    }
    const portrait = canvas.height > canvas.width;
    this.presentCamera(state, portrait);
    this.room.update(state.distance);
    this.girlAnimation.apply(state);
    this.placeOnRoute(this.girl,state.distance,state.x,this.girl.position.y,true);
    this.contactShadow.rotation.set(-Math.PI/2,0,0);
    this.placeOnRoute(this.contactShadow,state.distance,state.x,.025,true);
    this.bearModel.apply(state);
    this.fairyModel.apply(state, this.girlModel);
    this.chest.visible = ['CAUGHT', 'CHEST_RETURN', 'COMPLETE'].includes(state.stage);
    this.chest.position.set(4.74, 0, -state.gap - .3);
    const progress = state.stage === 'CHEST_RETURN' ? clamp(state.age / C.stages.CHEST_RETURN, 0, 1) : 0;
    const opening = state.stage === 'CAUGHT' ? clamp(state.age / .6, 0, 1)
      : state.stage === 'CHEST_RETURN' ? 1 - clamp((progress - .78) / .22, 0, 1) : 0;
    ToyChestProp.setOpening(this.chest, opening);
    if (state.stage === 'CHEST_RETURN') {
      const t = 1 - (1 - progress) ** 3;
      this.bear.position.x = state.bearX + (4.74 - state.bearX) * t;
      this.bear.position.z = -state.gap - .3 * t;
    }
    this.placeOnRoute(this.bear,state.distance-this.bear.position.z,this.bear.position.x,this.bear.position.y,true);
    this.chest.rotation.set(0,-Math.PI/2,0);
    this.placeOnRoute(this.chest,state.distance+state.gap+.3,4.74,0);
    this.updateToys(state);
    this.lighting.update(state,portrait);
    this.renderer.render(this.scene, this.camera);
    ctx.drawImage(this.renderer.domElement, 0, 0, canvas.width, canvas.height);
  }
  /** Aplica a câmera progressiva no traçado e preserva o enquadramento do baú, sem alterar o domínio. */
  presentCamera(state, portrait) {
    const frame = chaseCameraFrame(state, portrait, this.camera.aspect);
    if (this.camera.fov !== frame.fov) {
      this.camera.fov = frame.fov;
      this.camera.updateProjectionMatrix();
    }
    const { position, target } = frame;
    const camera = routePoint(state.distance - position.z, position.x, position.y);
    this.camera.position.set(camera.x, camera.y, camera.z);
    const look = routePoint(target.s, target.x, target.y);
    this.camera.lookAt(look.x, look.y, look.z);
  }
  /** Descarta somente materiais, geometrias e texturas desta instância. */
  destroy() {
    if (this.disposed) return; this.disposed = true;
    this.lighting?.dispose();
    this.propCatalog?.dispose();
    for (const resource of this.resources) resource.dispose();
    this.resources.clear(); this.toys.clear(); this.scene.clear();
    this.renderer.domElement.removeEventListener('webglcontextlost', this.onLost);
    this.renderer.domElement.removeEventListener('webglcontextrestored', this.onRestored);
    this.renderer.dispose(); this.renderer.forceContextLoss();
  }
}
