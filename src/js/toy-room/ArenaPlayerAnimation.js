import { ARENA_GIRL_ANIMATION_FRAMES as FRAMES } from './ArenaGirlAnimationFrames.js';

export const ARENA_ATTACK_VISUAL_DURATION = 24;
const clamp01 = value => Math.max(0,Math.min(1,value));
const smooth = value => { const t=clamp01(value); return t*t*(3-2*t); };
export function createPlayerAnimation(state = {}, player = {}) {
  const pose=state.mode==='DEFEAT'||state.playerHitTime>0?'damage':state.crouching?'crouch'
    :state.attackTime>0?'attack':state.jump>0?(state.jumpVelocity>0?'jump':'fall'):player.isMoving?'run':'idle';
  return {
    time:0,pose,poseTime:pose==='crouch'?6:0,previousPose:pose,previousTime:0,blendTime:8,
    attackAge:state.attackTime>0?12-state.attackTime:ARENA_ATTACK_VISUAL_DURATION,
    attackDirection:player.facing==='left'?-1:1,attackSerial:0,landingAge:12,wasAirborne:state.jump>0
  };
}
export function beginArenaPlayerAttack(state, direction) {
  state.playerAnimation ??= createPlayerAnimation(state);
  state.playerAnimation.attackAge=0;
  state.playerAnimation.attackDirection=direction;
  state.playerAnimation.attackSerial++;
}

/** Relógio visual em subpassos de simulação; renderização e recarga não o avançam. */
export function updateArenaPlayerAnimation(state, player, dt) {
  const a=state.playerAnimation ??= createPlayerAnimation(state,player);
  const previousAttackAge=a.attackAge;
  a.time+=dt; a.attackAge=Math.min(ARENA_ATTACK_VISUAL_DURATION,a.attackAge+dt);
  a.landingAge=Math.min(12,a.landingAge+dt);
  const airborne=state.jump>0;
  if(a.wasAirborne&&!airborne)a.landingAge=0;
  a.wasAirborne=airborne;
  if(state.playerHitTime>0||state.mode==='DEFEAT'||state.transition)a.attackAge=ARENA_ATTACK_VISUAL_DURATION;
  let pose=state.mode==='DEFEAT'||state.playerHitTime>0?'damage'
    :state.crouching?'crouch':a.attackAge<12?'attack'
    :airborne?(state.jumpVelocity>0?'jump':'fall')
    :a.landingAge<10?'landing'
    :player.isMoving?'run':a.attackAge<ARENA_ATTACK_VISUAL_DURATION?'recovery':'idle';
  if(!['damage','attack','jump','fall','crouch'].includes(pose)
    &&(a.pose==='crouch'||(a.pose==='standUp'&&a.poseTime<8)))pose='standUp';
  if(pose!==a.pose) {
    a.previousPose=a.pose;a.previousTime=a.poseTime;a.pose=pose;a.poseTime=0;a.blendTime=0;
  }
  a.poseTime+=dt;a.blendTime=Math.min(8,a.blendTime+dt);
  return !['damage'].includes(pose)&&previousAttackAge<4&&a.attackAge>=4;
}
const layer = (pose,index=0,weight=1) => ({frame:FRAMES[pose][index],weight});
const pair = (from,to,weight) => [{...from,weight:1-weight},{...to,weight}].filter(p=>p.weight>1e-6);

function cycle(pose,time,durations) {
  const frames=FRAMES[pose],duration=durations.reduce((a,b)=>a+b,0);
  let phase=((time%duration)+duration)%duration,index=0;
  while(phase>=durations[index]){phase-=durations[index];index++;}
  // A passagem ocupa só o fim de cada apoio; evita deixar duas poses sobrepostas o ciclo inteiro.
  const blend=smooth((phase/durations[index]-.68)/.32);
  return pair(layer(pose,index),layer(pose,(index+1)%frames.length),blend);
}
function poseLayers(pose,time,a,state) {
  if(pose==='run')return cycle('run',time,[6,5,6,5]);
  if(pose==='idle')return cycle('idle',time,[24,24,24,24]);
  if(pose==='crouch') {
    // Sob um golpe já ativo, a pose baixa responde no mesmo quadro da esquiva lógica.
    const e=state.enemy,active=e?.state==='ATTACK'&&e.elapsed>=54&&e.elapsed<96;
    if(active||time>=6)return [layer('crouch')];
    const index=Math.min(2,Math.floor(time/2)),u=(time%2)/2;
    return pair(layer('crouchCycle',index),layer('crouchCycle',index+1),smooth((u-.75)/.25));
  }
  if(pose==='standUp') {
    if(time<6) {
      const index=Math.max(1,3-Math.floor(time/2)),u=(time%2)/2;
      return pair(layer('crouchCycle',index),layer('crouchCycle',index-1),smooth((u-.75)/.25));
    }
    return pair(layer('crouchEnter'),layer('idle'),smooth((time-6)/2));
  }
  if(pose==='landing')return pair(layer('crouchEnter'),layer('idle'),smooth(a.landingAge/10));
  if(pose==='attack') {
    const age=a.attackAge;
    if(age<2)return pair(layer('attack',0),layer('attack',1),smooth(age/2));
    return [layer('attack',age<4?1:age<7?3:age<9?2:4)];
  }
  if(pose==='recovery')return a.attackAge<17
    ?pair(layer('attack',4),layer('attack',1),smooth((a.attackAge-12)/5))
    :pair(layer('attack',1),layer('idle'),smooth((a.attackAge-17)/7));
  if(pose==='jump'||pose==='fall')return [layer(pose,0)];
  // Impacto curto, recuo com pausa no pico e recuperação dentro dos 22 quadros de reação.
  const damageAge=state.mode==='DEFEAT'?8:Math.max(0,Math.min(21,22-(state.playerHitTime || 0)));
  const index=damageAge<2?0:damageAge<5?1:damageAge<9?2:damageAge<14?3:damageAge<19?4:5;
  return [layer('damage',index)];
}

/** Amostra pura: escala nunca depende da altura do quadro ou do estado de agachamento. */
export function sampleArenaPlayerAnimation(state, player) {
  const a=state.playerAnimation ?? createPlayerAnimation(state,player);
  // O impacto tem prioridade já no hitstop, antes do próximo avanço do relógio visual.
  let pose=state.mode==='DEFEAT'||state.playerHitTime>0?'damage':a.pose;
  let layers=poseLayers(pose,a.poseTime,a,state);
  const transition=smooth(a.blendTime/6);
  if(transition<1&&!['attack','crouch','damage','landing','recovery','standUp'].includes(pose)
    &&!['attack','crouch','damage','landing','recovery','standUp'].includes(a.previousPose)) {
    layers=[...poseLayers(a.previousPose,a.previousTime,a,state).map(l=>({...l,weight:l.weight*(1-transition)})),
      ...layers.map(l=>({...l,weight:l.weight*transition}))];
  }
  const age=a.attackAge, attacking=pose!=='damage'&&age<12;
  const recoil=attacking?(age<4?-6*Math.sin(age/4*Math.PI):age<9?7*Math.sin((age-4)/5*Math.PI):2):0;
  const isDamaged = pose === 'damage' && state.playerHitTime > 0;
  const hitProgress = isDamaged ? state.playerHitTime / 22 : 0;
  const damageRecoil = isDamaged ? -Math.sin(hitProgress * Math.PI) * 14 : 0;
  const damageLean = isDamaged ? -state.playerHitDirection * Math.sin(hitProgress * Math.PI) * 0.12 : 0;
  const lean=pose==='run'?Math.sin(a.poseTime/22*Math.PI*2)*.012
    :pose==='idle'?Math.sin(a.poseTime/96*Math.PI*2)*.008
    :attacking?(age<4?-.035:age<9?.025:0):0;
  const registrationX=layers.reduce((total,l)=>total+l.weight*(l.frame.faceX-l.frame.anchorX)*l.frame.sourceFacing*l.frame.pixelUnit,0);
  return {pose,layers,registrationX,attackAge:age,attackSerial:a.attackSerial,
    facing:attacking||pose==='recovery'?a.attackDirection:(player.facing==='left'?-1:1),
    offsetX:recoil+damageRecoil,rotation:lean+damageLean,
    bob:pose==='run'?-Math.abs(Math.sin(a.poseTime/22*Math.PI*2))*1.5:0,
    slash:attacking&&age>=4&&age<10?{progress:(age-4)/6,alpha:Math.sin((age-4)/6*Math.PI),crouching:state.crouching}:null};
}
