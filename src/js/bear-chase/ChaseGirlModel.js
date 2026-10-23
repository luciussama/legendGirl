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
    this.volume(this.torso,'cream',[0,.12,0],[.21,.21,.14]);
    this.volume(this.torso,'cream',[0,.135,-.10],[.15,.17,.065]);
    this.volume(this.torso,'rose',[0,-.015,0],[.22,.035,.15]);
    this.skirt = this.joint(this.pelvis,'Saia',0,.15,0);
    // Vestido creme inteiro, com babado rosa e bordado ao redor da barra.
    this.cloth(this.skirt,'pink',[[.35,-.19],[.365,-.16],[.345,-.115]],true);
    this.cloth(this.skirt,'rose',[[.355,-.19],[.37,-.175],[.36,-.16]],true);
    this.cloth(this.skirt,'cream',[[.35,-.145],[.33,-.09],[.26,.04],[.207,.10]],true);
    this.buildDressDetails();
    this.head = this.joint(this.torso,'Cabeca',0,.35,0);
    this.volume(this.head,'skin',[0,.09,-.045],[.31,.32,.27]);
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
    this.batchDetails(this.root);
    this.root.userData.authoring='Revisão 4: vestido creme bordado, babado e faixa rosa, duas marias-chiquinhas com laços; proporções da menina ilustrada girl-v2. Costas interpretadas em volume.';
  }
  /** Agrupa detalhes rígidos do mesmo material por articulação, preservando os pivôs animados. */
  batchDetails(parent) {
    for(const child of [...parent.children])if(!child.isMesh)this.batchDetails(child);
    const groups=new Map();
    for(const mesh of parent.children)if(mesh.isMesh&&!mesh.isInstancedMesh) {
      if(!groups.has(mesh.material))groups.set(mesh.material,[]);groups.get(mesh.material).push(mesh);
    }
    for(const [material,meshes] of groups) {
      if(meshes.length<2)continue;
      const values={position:[],normal:[],color:[]};
      for(const mesh of meshes) {
        mesh.updateMatrix();const g=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry.clone();g.applyMatrix4(mesh.matrix);
        for(const name of Object.keys(values))values[name].push(...g.attributes[name].array);
        g.dispose();parent.remove(mesh);
      }
      const geometry=this.own(new T.BufferGeometry());
      for(const [name,array]of Object.entries(values))geometry.setAttribute(name,new T.Float32BufferAttribute(array,3));
      const merged=new T.Mesh(geometry,material);merged.name='DetalhesAgrupados';parent.add(merged);
    }
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
  /** Modela franja e duas marias-chiquinhas curtas, com laços e pontas articuladas. */
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
    this.pigtails=[];
    for(const side of [-1,1]) {
      const tail=this.joint(this.head,side<0?'MariaChiquinhaE':'MariaChiquinhaD',side*.29,.29,.10);
      this.sweep(tail,'hair',[[0,.025,0],[side*.09,-.01,.08],[side*.13,-.14,.15],[side*.10,-.29,.14],[side*.02,-.31,.13]],[.07,.125,.13,.10,.025]);
      this.sweep(tail,'lock',[[side*.035,.03,.015],[side*.13,-.06,.08],[side*.16,-.17,.13],[side*.09,-.27,.12]],[.015,.027,.027,.003]);
      const tip=this.joint(tail,'PontaDoCabelo',side*.02,-.31,.13);
      this.sweep(tip,'hair',[[0,0,0],[side*.04,-.035,.005],[side*.11,.015,.02]],[.07,.05,.002]);
      this.bow(tail,[0,.055,-.04],.075);
      this.pigtails.push({tail,tip,side});
    }
    // Referências preservadas para ferramentas de revisão anteriores.
    this.ponytail=this.pigtails[0].tail;this.tailTip=this.pigtails[0].tip;
  }
  /** Constrói laço de tecido com duas alças e nó central. */
  bow(parent,position,size) {
    const pivot=this.joint(parent,'LacoRosa',...position);
    for(const side of [-1,1]) {
      const loop=this.volume(pivot,'pink',[side*size*.65,0,0],[size*.75,size*.48,size*.28]);
      loop.rotation.z=side*.28;
    }
    this.volume(pivot,'rose',[0,0,-size*.12],[size*.24,size*.28,size*.3]);
  }
  /** Repete o bordado em uma só chamada de desenho e acrescenta o laço traseiro. */
  buildDressDetails() {
    const count=24, petals=5, flowerGeometry=this.shade(new T.SphereGeometry(1,6,4));
    const flowers=new T.InstancedMesh(flowerGeometry,this.materials.pink,count*petals);
    flowers.name='BordadoDaBarra';const transform=new T.Object3D();let index=0;
    for(let i=0;i<count;i++)for(let j=0;j<petals;j++) {
      const a=i/count*Math.PI*2,b=j/petals*Math.PI*2;
      const radius=.345+Math.cos(a*12)*.007;
      transform.position.set(Math.sin(a)*(radius+Math.sin(b)*.009),-.115+Math.cos(b)*.01,Math.cos(a)*(radius+Math.sin(b)*.009)*.78);
      transform.scale.set(.008,.008,.006);transform.updateMatrix();flowers.setMatrixAt(index++,transform.matrix);
    }
    this.skirt.add(flowers);this.bow(this.torso,[0,-.015,.16],.105);
    this.bow(this.torso,[0,.255,-.145],.045);
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
