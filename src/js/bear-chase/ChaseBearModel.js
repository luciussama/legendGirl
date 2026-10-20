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
    this.material = own(new T.MeshStandardMaterial({ map: texture, vertexColors: true, roughness: 1, metalness: 0 }));
    this.pelvis = this.joint(this.root, 'Quadril', 0, .47, 0);
    this.torso = this.joint(this.pelvis, 'Peito', 0, .34, 0);
    this.volume(this.torso, 'fur', [0, 0, 0], [.44, .53, .34]);
    // A barriga mantém pelúcia ocre; creme fica restrito a focinho, orelhas e palmas.
    this.volume(this.torso, 'fur', [0, -.07, -.24], [.33, .39, .14], '#eee0c5');
    this.seam(this.torso, [[0,.34,.325],[0,.16,.35],[0,-.1,.345],[0,-.35,.27]], .005);
    for (let i = 0; i < 7; i++) this.seam(this.torso, [[-.018,.23-i*.067,.35],[.018,.22-i*.067,.35]], .003);

    this.head = this.joint(this.torso, 'Cabeça', 0, .60, -.025);
    this.volume(this.head, 'fur', [0, 0, 0], [.455, .39, .35]);
    this.ears = [];
    for (const side of [-1, 1]) {
      const ear = this.joint(this.head, 'Orelha', side*.35, .30, .005);
      this.volume(ear, 'fur', [0,0,0], [.145,.15,.105]);
      this.volume(ear, 'shade', [0,0,-.081], [.10,.104,.031], '#e2be93');
      this.ears.push(ear);
      this.volume(this.head, 'dark', [side*.16,.025,-.325], [.040,.055,.029]);
      this.volume(this.head, 'glint', [side*.168,.044,-.349], [.010,.014,.006]);
    }
    this.volume(this.head, 'cream', [0,-.12,-.326], [.23,.15,.115]);
    this.volume(this.head, 'dark', [0,-.066,-.43], [.073,.049,.032]);
    this.seam(this.head, [[0,-.095,-.444],[0,-.15,-.442],[-.052,-.171,-.424]], .005);
    this.seam(this.head, [[0,-.15,-.442],[.052,-.171,-.424]], .005);

    this.bow = [];
    this.volume(this.torso, 'ribbon', [0,.30,-.345], [.067,.065,.048]);
    for (const side of [-1, 1]) {
      const flap = this.joint(this.torso, 'Laço', side*.055,.30,-.344);
      this.ribbon(flap, side);
      this.volume(flap, 'ribbon', [side*.027,-.095,.005], [.045,.092,.025], '#e2c7b5', [0,0,side*.22]);
      this.bow.push(flap);
    }
    this.arms = [];
    this.legs = [];
    for (const side of [-1, 1]) {
      const shoulder = this.joint(this.torso, 'Ombro', side*.39,.18,0);
      this.volume(shoulder, 'fur', [side*.018,-.15,0], [.15,.25,.16]);
      const elbow = this.joint(shoulder, 'Cotovelo', side*.025,-.235,0);
      this.volume(elbow, 'fur', [0,-.11,-.015], [.145,.20,.15]);
      this.arms.push({ shoulder, elbow });
      const hip = this.joint(this.pelvis, 'Coxa', side*.235,0,0);
      this.volume(hip, 'fur', [0,-.115,0], [.18,.205,.18]);
      const knee = this.joint(hip, 'Joelho', 0,-.24,0);
      this.volume(knee, 'fur', [0,-.105,0], [.16,.185,.16]);
      const ankle = this.joint(knee, 'Tornozelo', 0,-.24,0);
      this.volume(ankle, 'fur', [0,0,-.065], [.195,.125,.24]);
      this.volume(ankle, 'cream', [0,-.105,-.083], [.139,.029,.17]);
      this.seam(ankle, [[-.09,-.122,-.12],[0,-.128,-.20],[.09,-.122,-.12]], .004);
      this.legs.push({ hip, knee, ankle });
    }
    this.bake();
    this.body = this.torso.children.find(object => object.isMesh);
    this.animation = new ChaseBearAnimation(this);
    this.root.userData.authoring = 'Urso da arena: pelúcia ocre, focinho curto, laço vermelho e apoios articulados. Costas interpretadas.';
  }

  /** Cria um pivô nomeado; partes imóveis desse pivô serão mescladas para reduzir chamadas de desenho. */
  joint(parent, name, x, y, z) {
    const group = new T.Group(); group.name = name; group.position.set(x,y,z); parent.add(group); return group;
  }

  /** Acrescenta um volume macio, sem compartilhar a geometria colorida da menina. */
  volume(parent, region, position, scale, tint = '#ffffff', rotation = [0,0,0]) {
    const geometry = new T.SphereGeometry(1,32,24);
    geometry.scale(...scale);
    geometry.applyQuaternion(new T.Quaternion().setFromEuler(new T.Euler(...rotation)));
    geometry.translate(...position);
    this.collect(parent, geometry, region, tint);
  }

  /** Modela costura curta sobre a pelúcia, sem contornos técnicos ou planos sobrepostos. */
  seam(parent, points, radius) {
    const path = new T.CatmullRomCurve3(points.map(point => new T.Vector3(...point)));
    this.collect(parent, new T.TubeGeometry(path,24,radius,5,false), 'shade', '#76563f');
  }

  /** Modela uma aba de laço com tecido dobrado em leque, preservando a silhueta da referência. */
  ribbon(parent, side) {
    const shape = new T.Shape();
    shape.moveTo(0,-.02); shape.quadraticCurveTo(side*.08,-.055,side*.16,-.075);
    shape.quadraticCurveTo(side*.19,0,side*.16,.075);
    shape.quadraticCurveTo(side*.08,.055,0,.02); shape.closePath();
    const geometry = new T.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:3,curveSegments:12});
    geometry.translate(0,0,-.025);
    geometry.computeBoundingBox();
    const box=geometry.boundingBox,span=box.getSize(new T.Vector3()),positions=geometry.attributes.position,uv=geometry.attributes.uv;
    for(let i=0;i<uv.count;i++) uv.setXY(i,(positions.getX(i)-box.min.x)/span.x,(positions.getY(i)-box.min.y)/span.y);
    this.collect(parent,geometry,'ribbon','#ffffff');
  }

  /** Remapeia UVs para um quadrante com margem; grava a tinta local antes de mesclar as partes. */
  collect(parent, source, region, tint) {
    const geometry = source.index ? source.toNonIndexed() : source.clone(); source.dispose();
    const uv = geometry.attributes.uv;
    const regions = { fur:[0,1], cream:[1,1], ribbon:[0,0], shade:[1,0], dark:[1,0], glint:[1,1] };
    const [column,row] = regions[region];
    for (let i=0;i<uv.count;i++) uv.setXY(i,column*.5+.009+uv.getX(i)*.482,row*.5+.009+uv.getY(i)*.482);
    const color = new T.Color(region==='dark'?'#211a15':region==='glint'?'#ffffff':tint);
    const colors = new Float32Array(geometry.attributes.position.count*3);
    for (let i=0;i<colors.length;i+=3) { colors[i]=color.r; colors[i+1]=color.g; colors[i+2]=color.b; }
    geometry.setAttribute('color',new T.BufferAttribute(colors,3));
    if (!this.parts.has(parent)) this.parts.set(parent,[]);
    this.parts.get(parent).push(geometry);
  }

  /** Mescla somente partes do mesmo pivô; joelhos, cotovelos e acessórios continuam articuláveis. */
  bake() {
    for (const [parent, parts] of this.parts) {
      const geometry = this.own(new T.BufferGeometry());
      for (const [name,size] of [['position',3],['normal',3],['uv',2],['color',3]]) {
        const count = parts.reduce((sum,part)=>sum+part.attributes[name].array.length,0);
        const values = new Float32Array(count); let offset=0;
        for (const part of parts) { values.set(part.attributes[name].array,offset); offset+=part.attributes[name].array.length; }
        geometry.setAttribute(name,new T.BufferAttribute(values,size));
      }
      geometry.computeBoundingSphere();
      parent.add(new T.Mesh(geometry,this.material));
      for (const part of parts) part.dispose();
    }
    this.parts.clear();
  }

  /** Delega a pose de apresentação; captura, colisões e lançamento continuam na simulação existente. */
  apply(state) { this.animation.apply(state); }
}
