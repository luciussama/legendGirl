import * as T from '../../vendor/three/three.module.js';
import { ChaseBearModel } from './ChaseBearModel.js';
import { PICTORIAL_ATLASES } from './props/PictorialMaterialAssets.js';
import { ToyChestProp } from './props/ToyChestProp.js';
import { ChasePropCatalog } from './props/ChasePropCatalog.js';
import { ChaseToyModels } from './ChaseToyModels.js';
import { ChaseGirlModel } from './ChaseGirlModel.js';
import { ChaseGirlAnimation } from './ChaseGirlAnimation.js';
import { CHASE_CONFIG as C, clamp } from './ChaseConfig.js';

import { ChaseLighting } from './ChaseLighting.js';
import { ChaseRoom } from './ChaseRoom.js';
import { routePoint, routeFrame } from './ChaseRoute.js';

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
    this.scene.fog = new T.Fog('#f3dfb8', 48, 100);
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
      ...Object.fromEntries(Object.values(PICTORIAL_ATLASES).map(({ key, path }) => [key, path])),
      bearAtlas: 'toy-room/bear-chase/materials/urso-atlas-v2.png',
      env: 'toy-room/environment-sheet.png',
      wall: 'toy-room/stage1/wallpaper-v1.png', trim: 'toy-room/stage1/oak-trim-v1.png',
      rug: 'toy-room/stage1/rectangular-rug-v1.png', window: 'toy-room/stage1/window-curtains-v1.png',
      fairy: 'toy-room/stage3/illustrated-fairy-v1.png', cabinet: 'toy-room/stage3/oak-cabinet-v1.png',
      bunny: 'toy-room/stage3/cotton-bunny-v1.png', armchair: 'toy-room/stage3/armchair-v1.png',
    };
    const loaded = await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await imageFile(path)]));
    if (this.disposed) return;
    const images = Object.fromEntries(loaded);
    this.propCatalog = new ChasePropCatalog(images, this.resources);
    this.toyModels = new ChaseToyModels(this.propCatalog);
    this.floor = this.texture(images.env, { x: 27, y: 151, w: 186, h: 48 });
    this.floor.wrapS = this.floor.wrapT = T.RepeatWrapping; this.floor.repeat.set(9, 2);
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
    this.fairy = this.actor(this.texture(images.fairy), .63, .7);
    this.chest = this.propCatalog.create('chest'); this.chest.visible = false; this.scene.add(this.chest);
    this.chest.rotation.y = -Math.PI / 2;
    this.lighting=new ChaseLighting(this);
    this.ready = true;
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
      const t = clamp(obstacle.age / C.flight, 0, 1);
      const lateral=obstacle.fromX+(obstacle.x-obstacle.fromX)*t;
      const distance=obstacle.fromZ+(obstacle.z-obstacle.fromZ)*t;
      mesh.rotation.set(0,0,0);
      this.placeOnRoute(mesh,distance,lateral,(1-t)*1.2+Math.sin(t*Math.PI)*1.4,true);
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
    const cutscene = ['BEAR_DOWN', 'GIRL_APPROACH', 'BEAR_RISE', 'CHASE_START'].includes(state.stage);
    const portrait = canvas.height > canvas.width;
    this.presentCamera(state, portrait, cutscene);
    this.room.update(state.distance);
    this.girlAnimation.apply(state);
    this.placeOnRoute(this.girl,state.distance,state.x,this.girl.position.y,true);
    this.contactShadow.rotation.set(-Math.PI/2,0,0);
    this.placeOnRoute(this.contactShadow,state.distance,state.x,.025,true);
    this.bearModel.apply(state);
    this.fairy.position.set(state.fairy.x, 2.05 + (state.fairy.y - 2.65), .55 + Math.abs(state.fairy.z));
    this.fairy.rotation.y=0;
    this.placeOnRoute(this.fairy,state.distance-.55-Math.abs(state.fairy.z),state.fairy.x,this.fairy.position.y);
    this.fairy.rotation.z = Math.sin(state.time * 3) * .08;
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
  /** Enquadra o baú lateral no final, incluindo menina/urso em retrato, sem alterar o estado lógico. */
  presentCamera(state, portrait, cutscene) {
    const ending = ['CAUGHT', 'CHEST_RETURN', 'COMPLETE'].includes(state.stage);
    const t = !ending ? 0 : state.stage === 'CAUGHT' ? clamp(state.age / C.stages.CAUGHT, 0, 1) : 1;
    const blend = t * t * (3 - 2 * t), center = (state.x + 4.74) / 2;
    const targetZ = (-state.gap - .3) / 2, baseZ = portrait ? 9 : 7.5;
    const halfWidth = (Math.abs(4.74 - state.x) + 1.6) / 2;
    const fitZ = Math.max(baseZ, targetZ + halfWidth / (Math.tan(this.camera.fov * Math.PI / 360) * this.camera.aspect) * 1.22 + 1);
    this.camera.position.set((state.x * .28 + (cutscene ? 1.8 : 0)) * (1 - blend) + center * blend,
      portrait ? 5.2 : 3.9, baseZ + (fitZ - baseZ) * blend);
    const local=this.camera.position.clone();
    const cam=routePoint(state.distance-local.z,local.x,local.y);
    this.camera.position.set(cam.x,cam.y,cam.z);
    const look=routePoint(state.distance+8*(1-blend)-targetZ*blend,
      state.x*.35*(1-blend)+center*blend,1.2);
    this.camera.lookAt(look.x,look.y,look.z);
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
