import * as T from '../../vendor/three/three.module.js';
import { CHASE_CONFIG as C, clamp } from './ChaseConfig.js';

/** Urso de pelúcia volumétrico, orientado para a fuga em vez de um cartão frontal. */
export class ChaseBearModel {
  /** Compartilha geometria com a protagonista, mantendo materiais e pivôs próprios. */
  constructor(own,sphere) {
    this.root=new T.Group();this.materials={};this.sphere=sphere;
    for(const [k,color]of Object.entries({fur:'#ac713f',muzzle:'#d5a46a',dark:'#36221c',ribbon:'#a43e35'}))this.materials[k]=own(new T.MeshStandardMaterial({color,roughness:1,vertexColors:true}));
    this.body=this.part(this.root,'fur',[0,.82,0],[.43,.55,.32]);
    this.part(this.root,'muzzle',[0,.83,-.29],[.30,.36,.065]);
    this.head=new T.Group();this.head.position.set(0,1.42,-.04);this.root.add(this.head);
    this.part(this.head,'fur',[0,0,0],[.36,.34,.30]);
    for(const side of [-1,1]){
      this.part(this.head,'fur',[side*.29,.25,0],[.14,.145,.10]);
      this.part(this.head,'muzzle',[side*.29,.25,-.075],[.085,.09,.035]);
      this.part(this.head,'dark',[side*.13,.035,-.275],[.035,.042,.025]);
      const bow=this.part(this.root,'ribbon',[side*.095,1.12,-.31],[.11,.07,.035]);bow.rotation.z=side*.3;
    }
    this.part(this.head,'muzzle',[0,-.12,-.27],[.19,.135,.12]);
    this.part(this.head,'dark',[0,-.055,-.37],[.068,.047,.03]);
    this.legs=[];this.arms=[];
    for(const side of [-1,1]){
      const leg=new T.Group();leg.position.set(side*.24,.43,0);this.root.add(leg);
      this.part(leg,'fur',[0,-.13,0],[.17,.25,.16]);this.part(leg,'fur',[0,-.29,-.075],[.18,.145,.22]);this.legs.push(leg);
      const arm=new T.Group();arm.position.set(side*.38,1.05,0);this.root.add(arm);
      this.part(arm,'fur',[side*.04,-.19,0],[.14,.30,.14]);this.arms.push(arm);
    }
  }
  /** Instancia uma parte de pelúcia com geometria compartilhada. */
  part(parent,material,p,s) {
    const mesh=new T.Mesh(this.sphere,this.materials[material]);mesh.position.set(...p);mesh.scale.set(...s);parent.add(mesh);return mesh;
  }
  /** Encena queda, levantar, fuga, olhar para trás e recolhimento, sem decidir a captura. */
  apply(state) {
    const down=['BEAR_DOWN','GIRL_APPROACH'].includes(state.stage),rise=state.stage==='BEAR_RISE';
    const t=rise?clamp(state.age/C.stages.BEAR_RISE,0,1):down?0:1;
    this.root.position.set(state.bearX+(1-t)*.65,.03+(1-t)*.20,-state.gap);
    this.root.rotation.set(0,0,(1-t)*1.45);this.root.scale.setScalar(1.15);
    const run=['RUNNING','CHASE_START'].includes(state.stage),phase=state.time*9;
    for(let i=0;i<2;i++){
      const wave=run?Math.sin(phase+i*Math.PI):0;
      this.legs[i].rotation.x=wave*.65;this.arms[i].rotation.x=-wave*.6;
    }
    const throwing=state.obstacles.some(o=>o.age<.4);
    if(throwing)this.arms[0].rotation.x=-1.8;
    this.head.rotation.y=run?Math.max(0,Math.sin(state.time*.9))**8*2.6:0;
    this.root.visible=state.stage!=='COMPLETE';
    if(state.stage==='CHEST_RETURN'){
      const p=clamp(state.age/C.stages.CHEST_RETURN,0,1);
      this.root.position.y=Math.sin(p*Math.PI)*1.5;this.root.scale.setScalar(1.15*(1-.95*p));this.root.visible=p<.96;
    }
  }
}
