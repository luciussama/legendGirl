import * as T from '../../vendor/three/three.module.js';
import { routePoint, routeFrame } from './ChaseRoute.js';

/** Sala contínua, construída uma vez e ancorada em distâncias absolutas do percurso. */
export class ChaseRoom {
  /** Separa superfícies estáticas da seleção de adereços, sem reciclar índices visíveis. */
  constructor(owner) {
    this.owner=owner;this.root=new T.Group();owner.scene.add(this.root);this.decorations=[];
    this.surface(owner.materials.floor,-5.5,0,5.5,0,'piso');
    this.surface(owner.materials.ceiling,5.5,6,-5.5,6,'teto');
    for(const side of [-1,1]){
      this.surface(owner.materials.wall,side*5.5,0,side*5.5,6,'parede');
      this.surface(owner.materials.trim,side*5.47,0,side*5.47,.7,'rodapé');
    }
    const end=new T.Mesh(owner.own(new T.PlaneGeometry(11,6)),owner.materials.wall);this.add(end,760,0,0,3);
    const kinds=['wardrobe','shelf','armchair','fortress','table','rocking-horse'];
    const toys=['teddy','robot','duck','drum','jack','bunny','blocks','train'];
    for(let i=0,s=6;s<710;i++,s+=17+(i%4)*2){
      const side=i%2?1:-1,id=kinds[(i*7+Math.floor(i/5))%kinds.length];
      this.add(owner.propCatalog.create(id),s,side*4.95,-side*Math.PI/2);
      if(i%2===0){const toy=owner.propCatalog.create(toys[(i+Math.floor(i/3))%toys.length]);toy.scale.setScalar(.65);this.add(toy,s+3.5,side*4.9,-side*Math.PI/2);}
    }
    for(let i=0,s=14;s<745;i++,s+=25){
      const side=i%2?1:-1;
      const win=new T.Mesh(owner.own(new T.PlaneGeometry(2.4,3.2)),owner.roomMaterials.window);
      this.add(win,s,side*5.43,-side*Math.PI/2,3.2);
    }
    for(const s of [22,126,244,370,508,650]){
      const rug=new T.Mesh(owner.own(new T.PlaneGeometry(3,4.2,2,8)),owner.roomMaterials.rug);
      // O tapete acompanha a inclinação local; nunca demarca hitbox ou rota de desvio.
      rug.rotation.x=-Math.PI/2;this.add(rug,s,0,0,.018,true);
    }
  }
  /** Cria uma faixa com amostras de um metro e UVs contínuas; não há emendas móveis. */
  surface(material,l0,h0,l1,h1,name) {
    const positions=[],uvs=[],indices=[];
    for(let s=-32;s<=800;s++){
      for(const [l,h,u] of [[l0,h0,0],[l1,h1,1]]){const p=routePoint(s,l,h);positions.push(p.x,p.y,p.z);uvs.push(u,s/(name==='piso'?6:5));}
      const i=(s+32)*2;if(s<800)indices.push(i,i+1,i+2,i+1,i+3,i+2);
    }
    const g=this.owner.own(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();g.computeBoundingSphere();
    const mesh=new T.Mesh(g,material);mesh.name=name+' contínuo';this.root.add(mesh);
  }
  /** Fixa um objeto na coordenada do traçado; o mesmo s sempre resolve a mesma identidade e pose. */
  add(object,s,lateral,yaw,height=0,rug=false) {
    const p=routePoint(s,lateral,height),f=routeFrame(s);object.position.set(p.x,p.y,p.z);
    object.rotation.order='YXZ';
    if(rug)object.rotation.set(-Math.PI/2+f.pitch,f.yaw,0);
    else if(object.userData.propId){object.rotation.set(f.pitch,f.yaw,0);object.rotateY(yaw);}
    else object.rotation.set(0,f.yaw+yaw,0);
    object.userData.routeDistance=s;object.userData.lateral=lateral;object.userData.decorative=true;
    this.root.add(object);this.decorations.push(object);
  }
  /** Oculta somente o que está longe, antes da neblina; nunca muda tipo ou posição durante a aproximação. */
  update(distance) {for(const o of this.decorations)o.visible=o.userData.routeDistance>distance-22&&o.userData.routeDistance<distance+112;}
}
