import * as T from '../../vendor/three/three.module.js';
import { GIRL_PALETTE } from './ChaseGirlPalette.js';

/** Menina da arena reinterpretada em volume; a autoria traseira não é sprite aprovado. */
export class ChaseGirlModel {
  /** Modela roupa em regiões distintas, corpo compacto e mechas desenhadas em volume. */
  constructor(own) {
    this.own = own; this.root = new T.Group(); this.root.name = 'Menina3D';
    this.materials = Object.fromEntries(Object.entries(GIRL_PALETTE).map(([name,color]) =>
      [name, own(new T.MeshStandardMaterial({color,vertexColors:true,roughness:1,metalness:0}))]));
    this.sphere = this.shade(new T.SphereGeometry(1, 24, 16));
    this.pelvis = this.joint(this.root,'Quadril',0,.55,0);
    this.torso = this.joint(this.pelvis,'Tronco',0,.20,0);
    this.volume(this.torso,'pink',[0,.12,0],[.21,.21,.14]);
    this.volume(this.torso,'cream',[0,.135,-.10],[.15,.17,.065]);
    this.volume(this.torso,'rose',[0,-.015,0],[.22,.035,.15]);
    this.skirt = this.joint(this.pelvis,'Saia',0,.15,0);
    // A saia salmão ocupa toda a base; o painel creme é um tecido separado, não a peça inteira.
    this.cloth(this.skirt,'pink',[[.34,-.18],[.35,-.15],[.32,-.09],[.26,.03],[.205,.10]],true);
    this.cloth(this.skirt,'rose',[[.345,-.185],[.355,-.16],[.35,-.135]],true);
    this.cloth(this.skirt,'cream',[[.342,-.115],[.315,-.065],[.26,.04],[.207,.10]],false);
    this.head = this.joint(this.torso,'Cabeca',0,.35,0);
    this.volume(this.head,'skin',[0,.09,-.045],[.335,.345,.285]);
    // Bochechas e queixo fazem uma face curta e larga, sem focinho esférico.

    for(const side of [-1,1]) this.volume(this.head,'skin',[side*.323,.10,0],[.047,.065,.045]);
    this.buildHair(); this.buildFace();
    this.arms=[];this.legs=[];
    for(const side of [-1,1]) {
      const shoulder=this.joint(this.torso,side<0?'OmbroE':'OmbroD',side*.235,.21,0);
      this.buildSleeve(shoulder);
      this.limb(shoulder,'skin',.15,.045,.052);
      const elbow=this.joint(shoulder,'Cotovelo',0,-.15,0);
      this.limb(elbow,'skin',.17,.047,.052);
      this.volume(elbow,'skin',[0,0,0],[.046,.046,.046]);
      const hand=this.volume(elbow,'skin',[0,-.175,-.007],[.058,.056,.050]);
      this.arms.push({shoulder,elbow,hand});
      const hip=this.joint(this.pelvis,side<0?'PernaE':'PernaD',side*.115,-.035,0);
      this.limb(hip,'skin',.18,.066,.078);
      const knee=this.joint(hip,'Joelho',0,-.18,0);
      this.limb(knee,'skin',.18,.049,.06);
      this.volume(knee,'skin',[0,0,0],[.062,.056,.062]);
      const ankle=this.joint(knee,'Tornozelo',0,-.18,0);
      this.volume(ankle,'boot',[0,-.035,-.045],[.083,.105,.135]);
      this.volume(ankle,'sole',[0,-.095,-.055],[.087,.024,.143]);
      this.volume(ankle,'cream',[0,.05,0],[.07,.028,.069]);
      this.legs.push({hip,knee,ankle});
    }
    this.buildSword();
    this.root.userData.authoring='Revisão 3: braços compactos, mangas bufantes, franzido superior e rabo longo. Paleta amostrada preservada; costas interpretadas.';
  }
  /** Grava sombreamento pintado nos vértices para preservar tons sem lavagem pelas luzes da sala. */
  shade(geometry) {
    const normals=geometry.attributes.normal, colors=[];
    for(let i=0;i<normals.count;i++) {
      const light=T.MathUtils.clamp(.95+normals.getY(i)*.04-normals.getX(i)*.025-normals.getZ(i)*.02,.85,1);
      colors.push(light,light*.985,light*.98);
    }
    geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3)); return this.own(geometry);
  }
  /** Acrescenta um pivô nomeado mantendo poses e malhas independentes da simulação. */
  joint(parent,name,x,y,z) {
    const group=new T.Group();group.name=name;group.position.set(x,y,z);parent.add(group);return group;
  }
  /** Instancia volume de pele ou detalhe com geometria compartilhada. */
  volume(parent,material,position,scale) {
    const mesh=new T.Mesh(this.sphere,this.materials[material]);mesh.position.set(...position);mesh.scale.set(...scale);parent.add(mesh);return mesh;
  }
  /** Constrói membro contínuo e afunilado em vez de duas contas ovais separadas. */
  limb(parent,material,length,end,start) {
    const geometry=new T.LatheGeometry([[0,0],[start,.005],[start*.95,-length*.28],[end,-length*.85],[0,-length]].reverse().map(([r,y])=>new T.Vector2(r,y)),16);
    const mesh=new T.Mesh(this.shade(geometry),this.materials[material]);parent.add(mesh);return mesh;
  }
  /** Forma a manga bufante clara com gomos macios, franzido e punho salmão estreito. */
  buildSleeve(parent) {
    const geometry=new T.SphereGeometry(1,32,20),p=geometry.attributes.position;
    for(let i=0;i<p.count;i++){
      const x=p.getX(i),y=p.getY(i),z=p.getZ(i),angle=Math.atan2(z,x);
      const gathering=1+.045*Math.cos(angle*8)*(1-y*y);
      p.setXYZ(i,x*gathering,y,z*gathering);
    }
    geometry.computeVertexNormals();
    const sleeve=new T.Mesh(this.shade(geometry),this.materials.cream);
    sleeve.name='MangaBufante';sleeve.position.set(0,-.035,0);sleeve.scale.set(.108,.105,.105);parent.add(sleeve);
    const cuffGeometry=new T.TorusGeometry(.073,.012,8,32);
    const cuff=new T.Mesh(this.shade(cuffGeometry),this.materials.pink);
    cuff.name='PunhoDaManga';cuff.rotation.x=Math.PI/2;cuff.position.y=-.115;parent.add(cuff);
  }
  /** Reconstrói o franzido junto à cintura e pregas que abrem suavemente na saia. */
  cloth(parent,material,profile,full) {
    const columns=96,rows=20,positions=[],indices=[],gathers=[];
    const low=profile[0][1],high=profile.at(-1)[1];
    for(let row=0;row<=rows;row++)for(let col=0;col<=columns;col++){
      const h=row/rows,y=T.MathUtils.lerp(low,high,h);
      let segment=0;while(segment<profile.length-2&&profile[segment+1][1]<y)segment++;
      const t=(y-profile[segment][1])/Math.max(.0001,profile[segment+1][1]-profile[segment][1]);
      const radius=T.MathUtils.lerp(profile[segment][0],profile[segment+1][0],t);
      const a=full?col/columns*Math.PI*2:Math.PI*.70+col/columns*Math.PI*.60;
      const waist=Math.exp(-(((y-.035)/.075)**2)),amplitude=.004+.020*waist;
      const fold=Math.cos(a*12),r=radius+fold*amplitude;
      positions.push(Math.sin(a)*r,y+Math.cos(a*12)*.004*(1-h),Math.cos(a)*r*.78);
      gathers.push(1-.15*waist*Math.pow((1-fold)/2,5));
      if(row<rows&&col<columns){const n=row*(columns+1)+col,b=n+columns+1;indices.push(n,n+1,b,n+1,b+1,b);}
    }
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
    this.shade(geometry);const colors=geometry.attributes.color;
    for(let i=0;i<gathers.length;i++)colors.setXYZ(i,colors.getX(i)*gathers[i],colors.getY(i)*gathers[i],colors.getZ(i)*gathers[i]);
    const mesh=new T.Mesh(geometry,this.materials[material]);mesh.name='TecidoFranzido_'+material;parent.add(mesh);return mesh;
  }
  /** Extruda um contorno de mecha/peça com bordas chanfradas para uma silhueta autoral. */
  silhouette(parent,material,points,depth,position) {
    const shape=new T.Shape();const last=points.at(-1);shape.moveTo((last[0]+points[0][0])/2,(last[1]+points[0][1])/2);
    for(let i=0;i<points.length;i++){const next=points[(i+1)%points.length];shape.quadraticCurveTo(...points[i],(points[i][0]+next[0])/2,(points[i][1]+next[1])/2);}shape.closePath();
    const g=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:.018,bevelThickness:.02,bevelSegments:3,curveSegments:8,steps:1});
    const mesh=new T.Mesh(this.shade(g),this.materials[material]);mesh.position.set(...position);parent.add(mesh);return mesh;
  }
  /** Varre uma mecha curva afunilada para conservar volume nas vistas laterais e traseiras. */
  sweep(parent,material,points,radii) {
    const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));
    const frames=curve.computeFrenetFrames(32,false),positions=[],indices=[];
    for(let i=0;i<=32;i++){
      const t=i/32,p=curve.getPointAt(t),f=t*(radii.length-1),k=Math.min(radii.length-2,Math.floor(f));
      const radius=T.MathUtils.lerp(radii[k],radii[k+1],f-k);
      for(let j=0;j<=12;j++){
        const angle=j/12*Math.PI*2;
        const v=p.clone().addScaledVector(frames.normals[i],Math.cos(angle)*radius).addScaledVector(frames.binormals[i],Math.sin(angle)*radius);
        positions.push(v.x,v.y,v.z);
        if(i<32&&j<12){const a=i*13+j,b=a+13;indices.push(a,a+1,b,a+1,b+1,b);}
      }
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();
    parent.add(new T.Mesh(this.shade(g),this.materials[material]));
  }
  /** Modela touca, franja oblíqua e rabo único da família de sprites da arena. */
  buildHair() {
    const positions=[],indices=[],rows=16,columns=48;
    for(let row=0;row<=rows;row++)for(let col=0;col<=columns;col++){
      const phi=col/columns*Math.PI*2,theta=row/rows*(1.18+(Math.cos(phi)+1)*.56);
      positions.push(Math.sin(theta)*Math.sin(phi)*.35,.17+Math.cos(theta)*.32,Math.sin(theta)*Math.cos(phi)*.30);
      if(row<rows&&col<columns){const a=row*(columns+1)+col,b=a+columns+1;indices.push(a,b,a+1,a+1,b,b+1);}
    }
    const cap=new T.BufferGeometry();cap.setAttribute('position',new T.Float32BufferAttribute(positions,3));cap.setIndex(indices);cap.computeVertexNormals();
    this.head.add(new T.Mesh(this.shade(cap),this.materials.hair));
    this.silhouette(this.head,'hair',[[-.32,.20],[-.28,.37],[-.13,.44],[.10,.44],[.29,.31],[.28,.13],[.13,.19],[.18,.29],[.04,.22],[-.03,.12],[-.07,.24],[-.23,.12]],.055,[0,0,-.285]);
    this.silhouette(this.head,'lock',[[-.24,.32],[-.12,.40],[.10,.38],[.18,.32],[.01,.33],[-.09,.26]],.015,[0,0,-.312]);
    for(const side of [-1,1]) {
      const tuft=this.silhouette(this.head,'hair',[[-.04,.14],[.05,.19],[.07,-.04],[0,-.11],[-.045,-.04]],.09,[side*.30,.01,-.03]);tuft.rotation.z=side*.08;
    }
    this.ponytail=this.joint(this.head,'RaboDeCavalo',-.14,.35,.23);
    this.ponytail.scale.set(.92,1,.68);
    // O rabo projeta-se para trás e para o lado; a massa não fica escondida na touca.
    this.sweep(this.ponytail,'hair',[[0,.06,.02],[-.035,.02,.22],[-.12,-.13,.43],[-.16,-.29,.58],[-.10,-.36,.66]],[.09,.155,.175,.15,.10]);
    this.sweep(this.ponytail,'lock',[[-.035,.09,.08],[-.07,.06,.25],[-.17,-.10,.44],[-.20,-.25,.58]],[.018,.043,.045,.008]);
    this.tailTip=this.joint(this.ponytail,'PontaDoCabelo',-.10,-.34,.63);
    this.sweep(this.tailTip,'hair',[[0,0,0],[-.055,-.06,.08],[-.06,-.04,.17],[.025,.015,.21]],[.11,.10,.06,.003]);
    this.sweep(this.tailTip,'hair',[[.035,0,0],[.10,-.055,.08],[.16,-.025,.12]],[.075,.06,.003]);
    this.volume(this.ponytail,'pink',[0,.075,.01],[.115,.045,.08]);
  }
  /** Desenha olhos menos circulares, nariz discreto e sobrancelhas da expressão de corrida. */
  buildFace() {
    for(const side of [-1,1]) {
      this.volume(this.head,'white',[side*.135,.10,-.304],[.074,.062,.015]);
      this.volume(this.head,'eye',[side*.13,.09,-.319],[.034,.054,.01]);
      this.volume(this.head,'white',[side*.13-.009,.112,-.33],[.011,.013,.004]);
      const brow=this.volume(this.head,'hair',[side*.13,.183,-.283],[.072,.016,.016]);brow.rotation.z=side*.17;
    }
    this.volume(this.head,'skin',[0,.025,-.33],[.028,.029,.022]);
    this.volume(this.head,'rose',[0,-.073,-.30],[.040,.007,.006]);
  }
  /** Recria a espada de madeira e a guarda azulada usada nos quadros de corrida da arena. */
  buildSword() {
    const hand=this.arms[1].elbow;
    const sword=this.joint(hand,'EspadaDeMadeira',0,-.16,-.045);sword.rotation.x=.9;this.sword=sword;
    this.silhouette(sword,'cream',[[-.025,0],[-.038,-.43],[0,-.51],[.038,-.43],[.025,0]],.018,[0,-.06,0]);
    this.volume(sword,'guard',[0,-.05,0],[.105,.022,.028]);
    this.volume(sword,'boot',[0,.015,0],[.024,.07,.025]);
  }
}
