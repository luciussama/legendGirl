import * as T from '../../vendor/three/three.module.js';

/** Recursos compartilhados de brinquedos volumétricos, com descarte pelo renderer. */
export class ChaseToyModels {
  /** Prepara trem de madeira sem depender do fundo opaco de um recorte de atlas. */
  constructor(own) {
    this.box=own(new T.BoxGeometry(1,1,1));this.wheel=own(new T.CylinderGeometry(1,1,1,16));
    this.materials=Object.fromEntries(Object.entries({red:'#aa4e39',blue:'#467889',green:'#6a844e',wood:'#c69b62',dark:'#543a2b'}).map(([k,color])=>[k,own(new T.MeshBasicMaterial({color}))]));
  }
  /** Monta um trem reutilizando cubos e rodas; dimensões visuais conservam o contrato do obstáculo. */
  train() {
    const root=new T.Group();
    for(const [color,p,s] of [['blue',[0,-.05,0],[.90,.18,.42]],['red',[-.18,.17,0],[.43,.32,.35]],['green',[.28,.25,0],[.30,.48,.38]],['blue',[.28,.51,0],[.41,.08,.48]],['dark',[-.29,.44,0],[.12,.24,.12]]]){
      const mesh=new T.Mesh(this.box,this.materials[color]);mesh.position.set(...p);mesh.scale.set(...s);root.add(mesh);
    }
    for(const x of [-.28,.28])for(const z of [-.235,.235]){
      const wheel=new T.Mesh(this.wheel,this.materials.wood);wheel.scale.set(.14,.06,.14);wheel.rotation.x=Math.PI/2;wheel.position.set(x,-.18,z);root.add(wheel);
    }
    return root;
  }
}
