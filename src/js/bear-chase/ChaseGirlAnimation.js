/** Coordena peso, contrabalanço e movimento secundário sem alterar o domínio da corrida. */
export class ChaseGirlAnimation {
  /** Guarda rig e amostras de deslocamento usadas somente pela inclinação de apresentação. */
  constructor(model) { this.model=model;this.lastX=0;this.lastTime=null;this.lean=0; }
  /** Resolve quadril/joelho e compensa o tornozelo para apoiar o pé durante a oscilação corporal. */
  legPose(leg,z,y,hipHeight) {
    const length=.18,drop=hipHeight-y,distance=Math.min(length*1.999,Math.hypot(drop,z));
    const knee=-Math.acos(Math.max(-1,Math.min(1,(distance*distance-2*length*length)/(2*length*length))));
    leg.hip.rotation.x=Math.atan2(-z,drop)-knee/2;
    leg.knee.rotation.x=knee;
    leg.ankle.rotation.x=-leg.hip.rotation.x-knee;
  }
  /** Aplica o mesmo ciclo aos apoios, quadril, ombros e acessórios, com atrasos próprios para cada massa. */
  apply(state) {
    const m=this.model,run=state.stage==='RUNNING',walk=state.stage==='GIRL_APPROACH',moving=run||walk;
    const phase=run?state.distance*Math.PI/2:state.age*Math.PI/.65;
    const dt=this.lastTime===null?0:state.time-this.lastTime;
    if(dt>0&&dt<.25){const velocity=(state.x-this.lastX)/dt;this.lean+=(Math.max(-1,Math.min(1,velocity/6))-this.lean)*(1-Math.exp(-dt*12));}
    if(dt<0||dt>.25||!moving)this.lean=0;
    this.lastTime=state.time;this.lastX=state.x;
    const stride=Math.sin(phase),step=Math.cos(phase*2-.30),effort=run?1:walk?.38:0;
    const breathe=Math.sin(state.time*2.2);
    // Dois impulsos por ciclo: o corpo comprime no apoio e recupera altura entre passos.
    const rootY=run?-.132+.080*Math.sin(phase-.15)**2:walk?-.095+.024*Math.sin(phase)**2:-.035+breathe*.004;
    const stumble=Math.min(1,Math.max(0,state.stumble||0)/.3);
    m.root.position.set(state.x,rootY,0);m.root.rotation.set(0,-this.lean*.17,0);
    m.root.visible=!(state.immunity>0&&Math.floor(state.time*14)%2===0);
    const hipRoll=Math.cos(phase)*.045*effort;
    m.pelvis.position.x=stride*.024*effort;
    m.pelvis.rotation.set(0,stride*.12*effort,hipRoll);
    const torsoPitch=(run?-.18:walk?-.035:0)+step*.045*effort-stumble*.28;
    const torsoRoll=-hipRoll*.75-this.lean*.16+stumble*.12;
    m.torso.rotation.set(torsoPitch,-stride*.17*effort,torsoRoll);
    // A cabeça estabiliza o olhar enquanto peito e quadril transferem o peso.
    m.head.rotation.set(-torsoPitch*.48,-m.torso.rotation.y*.42,-torsoRoll*.55);
    m.skirt.rotation.set(Math.sin(phase*2-.65)*.085*effort,-stride*.035*effort,Math.sin(phase-.55)*.045*effort-this.lean*.04);
    m.skirt.position.y=.15+Math.sin(phase*2-.8)*.009*effort;
    m.skirt.scale.set(1+Math.sin(phase*2-.7)*.018*effort,1,1+(1-step)*.025*effort);
    m.ponytail.rotation.set((run?-.12:0)+Math.sin(phase*2-.85)*(moving?.13:.018),Math.sin(phase-.6)*(moving?.18:.01),Math.sin(phase-.8)*.065*effort+this.lean*.12);
    m.tailTip.rotation.set(Math.sin(phase*2-1.5)*(moving?.24:.015),Math.sin(phase-1.1)*.09*effort,Math.sin(phase-1.4)*.07*effort);
    for(let i=0;i<2;i++){
      const cycle=((phase/(Math.PI*2)+i*.5)%1+1)%1;
      const stance=cycle<.5,t=stance?cycle*2:(cycle-.5)*2;
      const reach=run?.15:.09;
      const z=stance?-reach+t*reach*2:reach-Math.sin(t*Math.PI/2)**2*reach*2;
      const footY=.12+(stance?0:Math.sin(t*Math.PI)*(run?.17:.065));
      const hipHeight=.515+rootY+Math.sin(hipRoll)*m.legs[i].hip.position.x;
      if(moving)this.legPose(m.legs[i],z,footY,hipHeight);
      else{m.legs[i].hip.rotation.x=0;m.legs[i].knee.rotation.x=0;m.legs[i].ankle.rotation.x=0;}
      const wave=Math.cos(phase+i*Math.PI),swordArm=i===1;
      // O braço livre contrabalança a passada; a mão da espada tem arco menor e cotovelo flexível.
      const shoulder=moving?(swordArm?.32:.15)-wave*(swordArm?.24:.42)*effort-stumble*.25:.12;
      m.arms[i].shoulder.rotation.set(shoulder,Math.sin(phase-.35)*(swordArm?.055:.09)*effort,
        swordArm?-.23+wave*.055*effort:-.12-wave*.07*effort);
      m.arms[i].elbow.rotation.set(moving?.95+Math.sin(phase+i*Math.PI-.45)*(swordArm?.14:.28)*effort:.8,0,swordArm?0:-.035*effort);
    }
    m.sword.rotation.x=moving?.9+Math.sin(phase-.65)*.065*effort:1.1;
  }
}
