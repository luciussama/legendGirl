import * as T from '../../vendor/three/three.module.js';
import { routePoint } from './ChaseRoute.js';

/** Luz do quarto por composição: preenchimento indireto, janelas e luz frontal do urso. */
export class ChaseLighting {
  /** Mantém três projetores reutilizáveis e uma luz principal, sem acoplar iluminação ao domínio. */
  constructor(owner) {
    this.owner=owner;this.lights=[];this.disposed=false;
    owner.renderer.shadowMap.enabled=true;owner.renderer.shadowMap.type=T.PCFShadowMap;
    this.bounce=new T.HemisphereLight('#c9d8ef','#957453',1.05);owner.scene.add(this.bounce);
    this.front=new T.DirectionalLight('#fff1d9',1.65);this.front.castShadow=true;
    Object.assign(this.front.shadow.camera,{left:-22,right:22,top:65,bottom:-65,near:.5,far:180});
    this.front.shadow.bias=-.00025;this.front.shadow.normalBias=.035;this.front.shadow.radius=3;
    owner.scene.add(this.front,this.front.target);this.lights.push(this.front);
    this.reflected=new T.DirectionalLight('#dce9ff',.35);owner.scene.add(this.reflected,this.reflected.target);
    this.cookie=this.windowMask();this.windows=[];
    for(let i=0;i<3;i++){
      const light=new T.SpotLight('#ffe7ba',100,27,.69,.45,2);light.castShadow=false;light.map=this.cookie;
      light.shadow.bias=-.0002;light.shadow.normalBias=.025;light.shadow.radius=2;
      light.shadow.camera.near=.3;light.shadow.camera.far=30;
      owner.scene.add(light,light.target);this.windows.push(light);this.lights.push(light);
    }
    this.resize(false);
    owner.scene.traverse(o=>{if(!o.isMesh)return;const solid=!o.material.transparent;
      o.castShadow=solid;o.receiveShadow=solid||o.material.isMeshStandardMaterial;
      if(o.name==='teto contínuo')o.castShadow=false;
    });
    // A fada ilustrada mantém transparência sem projetar o retângulo da sua prancha.
    owner.fairy.castShadow=false;owner.fairy.receiveShadow=false;
  }
  /** Cria uma máscara técnica de quatro vidraças, projetada sobre o piso e os volumes. */
  windowMask() {
    const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#000';ctx.fillRect(0,0,256,256);
    ctx.fillStyle='#fff';ctx.beginPath();ctx.roundRect(32,16,192,224,[64,64,8,8]);ctx.fill();
    ctx.fillStyle='#000';ctx.fillRect(123,12,10,232);ctx.fillRect(28,124,200,9);
    const texture=this.owner.own(new T.CanvasTexture(canvas));texture.colorSpace=T.SRGBColorSpace;return texture;
  }
  /** Ajusta apenas resolução dos mapas; não reduz alcance ou sombras conforme a distância percorrida. */
  resize(portrait) {
    const frontSize=portrait?1024:2048,windowSize=portrait?512:1024;
    for(const light of this.lights){const size=light===this.front?frontSize:windowSize;
      if(light.shadow.mapSize.x===size)continue;
      light.shadow.dispose();light.shadow.map=null;light.shadow.mapPass=null;light.shadow.mapSize.set(size,size);light.shadow.needsUpdate=true;
    }
  }
  /** Posiciona uma luz no mesmo referencial contínuo da sala, incluindo sua altura sobre a rampa. */
  place(light,s,x,height,targetS,targetX,targetHeight=0) {
    const p=routePoint(s,x,height),t=routePoint(targetS,targetX,targetHeight);
    light.position.set(p.x,p.y,p.z);light.target.position.set(t.x,t.y,t.z);light.target.updateMatrixWorld();
  }
  /** Atualiza luz frontal e janelas fixas com entrada/saída suave, sem trocar manchas iluminadas à vista. */
  update(state,portrait) {
    this.resize(portrait);
    const bearS=state.distance+state.gap;
    this.place(this.reflected,state.distance-6,2,4.5,state.distance+6,0,1);
    // A luz alta vem de além do urso: mantém a sombra para trás sem raspar nas paredes das curvas.
    this.place(this.front,bearS+12,-1,28,bearS-8,0);
    const windows=this.owner.room.decorations.filter(o=>o.userData.windowIndex!==undefined);
    for(let slot=0;slot<3;slot++){
      let index=slot;while(index<windows.length&&windows[index].userData.routeDistance<state.distance-22)index+=3;
      const light=this.windows[slot],win=windows[index];
      if(!win){light.intensity=0;light.visible=false;continue;}
      const s=win.userData.routeDistance,side=Math.sign(win.userData.lateral),delta=s-state.distance;
      const fadeIn=T.MathUtils.smoothstep(53-delta,0,16),fadeOut=T.MathUtils.smoothstep(delta+22,0,14);
      light.intensity=100*fadeIn*fadeOut;light.visible=light.intensity>.01;
      this.place(light,s,side*5.2,3.65,s+5,-side*1.7,.15);
      light.userData.windowDistance=s;
    }
    // A máscara fica em todas as janelas; trocar a janela dominante não altera o desenho da luz.
    // A sombra perde força antes do ponto médio e retorna depois dele, mantendo só um mapa local ativo.
    const dominant=this.windows.filter(l=>l.visible).sort((a,b)=>Math.abs(a.userData.windowDistance-state.distance-6)-Math.abs(b.userData.windowDistance-state.distance-6))[0];
    for(const light of this.windows){
      const separation=Math.abs(light.userData.windowDistance-state.distance-6);
      light.shadow.intensity=light===dominant?1-T.MathUtils.smoothstep(separation,6,12.5):0;
      light.castShadow=light.shadow.intensity>.0001;
    }
  }
  /** Marca brinquedos criados durante a corrida; instâncias permanecem donas somente de sua hierarquia. */
  prepareObject(root) {root.traverse(o=>{if(o.isMesh){o.castShadow=!o.material.transparent;o.receiveShadow=true;}});}
  /** Libera mapas de sombra explicitamente; materiais e máscara pertencem ao proprietário da cena. */
  dispose() {if(this.disposed)return;this.disposed=true;for(const light of this.lights){light.shadow.dispose();light.removeFromParent();light.target.removeFromParent();}this.bounce.removeFromParent();this.reflected.removeFromParent();this.reflected.target.removeFromParent();}
}
