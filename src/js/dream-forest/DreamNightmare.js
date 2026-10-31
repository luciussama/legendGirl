import {DREAM_MUD_LAKES,createMudState,enterDreamMud,stepDreamMud,mudActor,mudOccludesPoint,mudLakeAt,mudWaterline} from './DreamMud.js';
import {STEALTH_LEVEL,STEALTH_COVERS,stealthGround,stealthMudAt,stealthPose,stealthCheckpoint} from './DreamStealthLevel.js';
import {dreamRoachPose,dreamRoachPoint} from './DreamRoach.js';
import {DREAM_NIGHTMARE_ART as ART} from './DreamNightmareArt.js';

export const NIGHTMARE=Object.freeze({...STEALTH_LEVEL,rockGround:825,bodyHeight:160,range:2100,revealDuration:8});
export const NIGHTMARE_INTRO=Object.freeze([
 {speaker:'Yuna',text:'Será que os bichos foram embora?',duration:6},
 {speaker:'Narrador',text:'Um cheiro repugnante aparece no ar. Cheiro de comida que ninguém quer, cheiro de luz apagada, cheiro de vontade de ir pra casa, cheiro de tristeza.',duration:14}
].map(Object.freeze));
export const NIGHTMARE_WAKE=Object.freeze([
  {speaker:'Narrador',text:'O susto saiu num grito.\nNanda abriu os olhos.',duration:5},
  {speaker:'Nanda',text:'Yuna… estou aqui.',duration:5},
  {speaker:'Narrador',text:'Era a toalha. Era o sol.\nO pesadelo tinha ficado do outro lado do sono.',duration:7}
].map(Object.freeze));
/** Compatibilidade do nome: agora inclui pedras e troncos que realmente bloqueiam luz. */
export const NIGHTMARE_ROCKS=STEALTH_COVERS;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
const angleDifference=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));

/** Patrulha determinística: posição e mira dependem apenas do relógio salvo, nunca do viewport. */
export function nightmarePatrol(n,stage='STEALTH',age=0){
  const final=stage==='NIGHTMARE_FINAL',strike=stage==='NIGHTMARE_STRIKE',reveal=stage==='NIGHTMARE_REVEAL',approach=smooth(age/NIGHTMARE.revealDuration);
  const x=final||strike?n.x-160*(1-smooth(age/4)):n.x+180*Math.sin(n.time*.4-1.2);
  const scale=reveal?.32+.68*approach:final?1+smooth((age-2.6)/3)*.35:strike?1+smooth(age/1.3)*.25:1,velocity=final||strike?n.vx:n.vx+72*Math.cos(n.time*.4-1.2),pose=dreamRoachPose(n.time,velocity);
  return{x,y:(reveal?50+190*approach:240)+pose.lift,width:1900*scale,aim:final||strike?n.x:x+720*Math.sin(n.time*.6-1),scale,pose};
}
/** Os olhos medidos na pintura são também a origem exata dos dois feixes físicos. */
export function nightmareLights(n,difficulty='NORMAL',stage='STEALTH',age=0){
  if(!n.roachAppeared||['NIGHTMARE_FALL','NIGHTMARE_INTRO'].includes(stage))return[];
  const p=nightmarePatrol(n,stage,age);
  return ART.roach.eyes.map(([u,v])=>{const {x,y}=dreamRoachPoint(p,u,v,{head:true});return{x,y,angle:Math.atan2(NIGHTMARE.ground-y,p.aim-x),half:difficulty==='EASY'?.17:.21};});
}
/** Primeira interseção do raio com a silhueta opaca; o mesmo cálculo recorta a luz desenhada. */
export function nightmareRayEnd(light,angle,limit=NIGHTMARE.range){
  const dx=Math.cos(angle),dy=Math.sin(angle);let distance=limit;
  for(const rock of NIGHTMARE_ROCKS){
    if(rock.x+rock.w/2<Math.min(light.x,light.x+dx*limit)||rock.x-rock.w/2>Math.max(light.x,light.x+dx*limit))continue;
    const poly=rock.polygon;
    for(let i=0;i<poly.length;i++){
      const a=poly[i],b=poly[(i+1)%poly.length],sx=b.x-a.x,sy=b.y-a.y,den=dx*sy-dy*sx;
      if(Math.abs(den)<1e-9)continue;
      const ax=a.x-light.x,ay=a.y-light.y,t=(ax*sy-ay*sx)/den,u=(ax*dy-ay*dx)/den;
      if(t>=0&&t<distance&&u>=0&&u<=1)distance=t;
    }
  }
  return{x:light.x+dx*distance,y:light.y+dy*distance,distance};
}
/** Polígono visível inclui as tangentes das pedras, impedindo vazamentos entre amostras. */
export function nightmareBeam(light){
  const angles=[];for(let i=0;i<=24;i++)angles.push(light.angle-light.half+2*light.half*i/24);
  for(const rock of NIGHTMARE_ROCKS)for(const p of rock.polygon){const a=light.angle+angleDifference(Math.atan2(p.y-light.y,p.x-light.x),light.angle);if(Math.abs(a-light.angle)<light.half)angles.push(a-.00002,a,a+.00002);}
  angles.sort((a,b)=>a-b);return[{x:light.x,y:light.y},...angles.map(a=>nightmareRayEnd(light,a))];
}
/** Cabelo, tronco e pés contam; uma pedra protege somente os trechos realmente na sombra. */
export function nightmareVisibility(n,difficulty='NORMAL',{onlyLight=false}={}){
  const actor=mudActor(n),lights=nightmareLights(n,difficulty),points=actor?actor.set.bodies[actor.index]:ART.stealth.bodies[stealthPose(n)];
  let lit=false,covered=true;
  for(const light of lights)for(const [x,y] of points){const point=actor?{x:actor.x+x*actor.facing,y:actor.y+y}:{x:n.x+x*n.facing,y:n.y+y};if(mudOccludesPoint(point))continue;const dx=point.x-light.x,dy=point.y-light.y,distance=Math.hypot(dx,dy),angle=Math.atan2(dy,dx),inside=Math.abs(angleDifference(angle,light.angle))<=light.half&&distance<NIGHTMARE.range;if(onlyLight&&!inside)continue;const blocked=nightmareRayEnd(light,angle,distance+1).distance<distance-.00001;covered&&=blocked;if(!blocked&&inside){lit=true;if(onlyLight)return{lit:true,covered:false};}}

  return{lit,covered};
}
/** A queda é um corte narrativo; a exploração aérea e o seu jogador permanecem preservados. */
export function beginDreamNightmare(s,{retry=false,checkpoint=0}={}){
  const spawn=retry?stealthCheckpoint(checkpoint):{x:NIGHTMARE.entry-90,mudDepth:0};
  s.nightmare={...createMudState(),version:7,exposure:0,time:0,x:spawn.x,y:stealthGround(spawn.x),vy:0,grounded:true,jumpHeld:true,mudDepth:spawn.mudDepth,checkpoint:retry?checkpoint:0,roachAppeared:retry,vx:0,facing:1,animTime:0,introIndex:0,introAge:0,arrivalAge:0,wakeIndex:-1,wakeAge:0,fairyAwake:false,screamPlayed:false,strikeSound:false,completed:false};
  if(spawn.mudLakeId)enterDreamMud(s.nightmare,DREAM_MUD_LAKES.find(l=>l.id===spawn.mudLakeId),{submerged:true});
  s.stage=retry?'STEALTH':'NIGHTMARE_FALL';s.age=0;s.fallCause=null;
}
/** Migra o trecho curto para o primeiro abrigo; desfechos já iniciados continuam no fim novo. */
export function migrateNightmare(s){const n=s.nightmare;if(!n||n.version===7)return;if(![1,2,3,4,5,6].includes(n.version))throw TypeError('Versão desconhecida do pesadelo.');
 if(![n.x,n.time,n.vx,n.animTime].every(Number.isFinite)||n.time<0||n.x<40||n.x>NIGHTMARE.width)throw TypeError('Pesadelo anterior inválido.');
 if(n.version===6){validateNightmare({...s,nightmare:{...n,version:7}});n.version=7;if(n.mudMode==='enter'&&s.stage==='STEALTH'){const lake=DREAM_MUD_LAKES.find(l=>l.id===n.mudLakeId);enterDreamMud(n,lake,{submerged:true});n.exposure=0;}return;}
 if(n.version<3&&n.x>3300)throw TypeError('Posição anterior fora do trecho curto.');
 if(n.version===5){n.version=6;n.mudStartDepth=n.mudDepth;if(n.mudMode==='swim'){const lake=DREAM_MUD_LAKES.find(l=>l.id===n.mudLakeId);if(lake)n.x=Math.max(lake.from+75,Math.min(lake.to-75,n.x));}if(n.mudMode==='climb')n.mudAge+=.35;migrateNightmare(s);return;}
 const version=n.version,late=['NIGHTMARE_FINAL','NIGHTMARE_STRIKE','NIGHTMARE_WAKE','GAME_OVER','COMPLETE'].includes(s.stage);
 if(version<3){n.x=late?NIGHTMARE.exit+Math.max(0,n.x-2850):NIGHTMARE.entry;Object.assign(n,{y:850,vy:0,grounded:true,jumpHeld:true,mudDepth:0,checkpoint:0,roachAppeared:!['NIGHTMARE_FALL','NIGHTMARE_INTRO'].includes(s.stage),arrivalAge:0,exposure:0});}
 if(version===3)n.exposure=0;
 if(!Number.isFinite(n.y)||n.y<0||n.y>1250)throw TypeError('Altura anterior inválida.');
 Object.assign(n,createMudState());n.version=7;
 const lake=mudLakeAt(n.x);if(lake&&s.stage==='STEALTH')enterDreamMud(n,lake,{submerged:true});else{n.mudDepth=0;if(n.grounded)n.y=stealthGround(n.x);}
}
/** Retorna somente quadros que podem ser adiantados; queda e captura final mantêm a atuação. */
export function nightmareReading(s){return s.nightmare&&(s.stage==='NIGHTMARE_INTRO'||s.stage==='NIGHTMARE_WAKE'&&s.nightmare.wakeIndex>=0)?{seen:false}:null;}
/** Um gesto avança um quadro e jamais pula a captura ou o instante obrigatório do grito. */
export function advanceNightmareDialogue(s){
  const n=s.nightmare;if(!n)return false;
  if(s.stage==='NIGHTMARE_INTRO'){n.introIndex++;n.introAge=0;if(n.introIndex===NIGHTMARE_INTRO.length){n.introIndex--;n.roachAppeared=true;n.vx=0;s.stage='NIGHTMARE_REVEAL';s.age=0;}return true;}
  if(s.stage==='NIGHTMARE_WAKE'&&n.wakeIndex>=0){n.wakeAge=0;if(n.wakeIndex<NIGHTMARE_WAKE.length-1)n.wakeIndex++;else{n.completed=true;s.stage='COMPLETE';s.age=0;s.progress=1;}return true;}
  return false;
}
/** Valida o domínio próprio, inclusive saves no golpe, captura e despertar, sem repetir efeitos. */
export function validateNightmare(s){
  const n=s.nightmare,stages=['NIGHTMARE_FALL','NIGHTMARE_INTRO','NIGHTMARE_REVEAL','STEALTH','NIGHTMARE_STRIKE','NIGHTMARE_FINAL','NIGHTMARE_WAKE','GAME_OVER','COMPLETE'];
  if(!n||n.version!==7||!stages.includes(s.stage)||![n.time,n.x,n.vx,n.animTime,n.introAge,n.wakeAge,n.y,n.vy,n.mudDepth,n.arrivalAge,n.exposure,n.mudAge,n.mudStartX,n.mudStartY,n.mudEntryTarget,n.swimDistance,n.mudStartDepth].every(Number.isFinite)||n.exposure<0||n.exposure>1||n.y<0||n.y>1250||Math.abs(n.vy)>1600||n.mudDepth<0||n.mudDepth>1||!Number.isInteger(n.checkpoint)||n.checkpoint<0||n.checkpoint>3||n.arrivalAge<0||n.time<0||n.time>s.time+.01||n.x<40||n.x>NIGHTMARE.width||Math.abs(n.vx)>(s.stage==='NIGHTMARE_FINAL'?300:NIGHTMARE.speed)||n.animTime<0||n.introAge<0||n.wakeAge<0||![-1,1].includes(n.facing)||!Number.isInteger(n.introIndex)||n.introIndex<0||n.introIndex>=NIGHTMARE_INTRO.length||!Number.isInteger(n.wakeIndex)||n.wakeIndex< -1||n.wakeIndex>=NIGHTMARE_WAKE.length||['fairyAwake','screamPlayed','strikeSound','completed','grounded','jumpHeld','roachAppeared'].some(k=>typeof n[k]!=='boolean'))throw TypeError('Pesadelo salvo inválido.');
  if(!['dry','enter','swim','climb'].includes(n.mudMode)||n.mudAge<0||n.swimDistance<0||n.mudStartDepth<0||n.mudStartDepth>1||![-1,0,1].includes(n.mudSide)||n.mudMode==='dry'&&n.mudLakeId!==null||n.mudMode!=='dry'&&(!DREAM_MUD_LAKES.some(l=>l.id===n.mudLakeId)||n.grounded)||n.mudMode==='climb'&&(!n.mudSide||n.mudAge>1.91))throw TypeError('Travessia de lama salva incoerente.');
  if(n.mudMode!=='dry'){const lake=DREAM_MUD_LAKES.find(l=>l.id===n.mudLakeId);if(!['STEALTH','NIGHTMARE_STRIKE','GAME_OVER'].includes(s.stage)||n.mudStartX<lake.from-2||n.mudStartX>lake.to+2||n.mudStartY<0||n.mudStartY>1250||n.mudEntryTarget<lake.from+84||n.mudEntryTarget>lake.to-84||n.x<lake.from-13||n.x>lake.to+13||!n.mudSide||n.mudMode==='enter'&&n.mudAge>1.11||n.mudMode==='swim'&&(n.x<lake.from+74.9||n.x>lake.to-74.9||n.mudDepth<.679))throw TypeError('Corpo salvo fora do lago ou da margem.');}
  if(n.roachAppeared===['NIGHTMARE_FALL','NIGHTMARE_INTRO'].includes(s.stage))throw TypeError('Aparição da barata salva incoerente.');
  const waking=s.stage==='NIGHTMARE_WAKE'||s.stage==='COMPLETE';
  if(waking!==n.screamPlayed||n.completed!==(s.stage==='COMPLETE')||!waking&&(n.fairyAwake||n.wakeIndex!==-1)||s.stage==='NIGHTMARE_WAKE'&&n.fairyAwake!==(s.age>=.55)||s.stage==='COMPLETE'&&!n.fairyAwake)throw TypeError('Despertar salvo incoerente.');
}
/** Caminhada furtiva, golpe fatal e captura autorada; tudo usa segundos e subpassos, sem timers. */
export function stepDreamNightmare(s,input={},seconds=0){
  const events=[],n=s.nightmare;if(s.stage==='GAME_OVER')return events;
  if(input.advance)advanceNightmareDialogue(s);
  let remaining=clamp(seconds,0,.2);
  while(remaining>1e-8){
    if(s.stage==='GAME_OVER')break;
    const dt=Math.min(1/120,remaining),before=s.age;remaining-=dt;s.time+=dt;s.age+=dt;if(s.stage!=='NIGHTMARE_INTRO')n.time+=dt;
    if(s.stage==='NIGHTMARE_FALL'){if(s.age>=1.8){s.stage='NIGHTMARE_INTRO';s.age=0;}continue;}
    if(s.stage==='NIGHTMARE_INTRO'){n.introAge+=dt;n.arrivalAge+=dt;const old=n.x;n.x=NIGHTMARE.entry-90+90*smooth(n.arrivalAge/3);n.vx=(n.x-old)/dt;n.animTime+=Math.abs(n.x-old)/30;n.facing=n.arrivalAge<3?1:Math.sin(n.arrivalAge*1.4)<0?-1:1;if(n.introAge>=NIGHTMARE_INTRO[n.introIndex].duration)advanceNightmareDialogue(s);continue;}
    if(s.stage==='NIGHTMARE_REVEAL'){n.arrivalAge+=dt;const old=n.x;n.x=NIGHTMARE.entry-90+90*smooth(n.arrivalAge/3);n.vx=(n.x-old)/dt;n.animTime+=Math.abs(n.x-old)/30;n.facing=n.arrivalAge<3?1:-1;if(s.age>=NIGHTMARE.revealDuration){s.stage='STEALTH';s.age=0;n.facing=1;n.jumpHeld=Boolean(input.jump);}continue;}
    if(s.stage==='NIGHTMARE_STRIKE'){if(before<.72&&s.age>=.72&&!n.strikeSound){n.strikeSound=true;events.push({type:'hurt'});}if(s.age>=1.45){s.stage='GAME_OVER';s.age=0;}continue;}
    if(s.stage==='NIGHTMARE_FINAL'){
      const previous=n.x;n.x+=350*(smooth(s.age/2.7)-smooth(before/2.7));n.y=stealthGround(n.x);n.vx=(n.x-previous)/dt;n.animTime+=Math.abs(n.x-previous)/30;n.facing=s.age>2.7?-1:1;
      if(s.age>=6){s.stage='NIGHTMARE_WAKE';s.age=0;n.vx=0;n.screamPlayed=true;events.push({type:'nightmare-scream'});}continue;
    }
    if(s.stage==='NIGHTMARE_WAKE'){
      if(s.age>=.55)n.fairyAwake=true;
      if(n.wakeIndex<0){if(s.age>=1.5){n.wakeIndex=0;n.wakeAge=0;}}else{n.wakeAge+=dt;if(n.wakeAge>=NIGHTMARE_WAKE[n.wakeIndex].duration)advanceNightmareDialogue(s);}continue;
    }
    if(s.stage==='COMPLETE')continue;
    const old=n.x,oldY=n.y,mudBefore=n.mudMode,mudAgeBefore=n.mudAge;
    if(!stepDreamMud(n,input,dt)){
      const x=clamp(Number(input.x)||0,-1,1);n.vx=x*NIGHTMARE.speed;
      if(input.jump&&!n.jumpHeld&&n.grounded){n.vy=-NIGHTMARE.jumpSpeed;n.grounded=false;events.push({type:'jump'});}n.jumpHeld=Boolean(input.jump);
      let nextX=clamp(n.x+n.vx*dt,60,NIGHTMARE.exit),ground=stealthGround(nextX);
      if(n.grounded&&n.y-ground>12){nextX=n.x;n.vx=0;ground=stealthGround(n.x);}
      const lake=mudLakeAt(nextX);
      if(lake&&n.y>=mudWaterline(lake,nextX)-35){n.x=nextX;enterDreamMud(n,lake,{side:n.vx<0?-1:1});}
      else{if(n.grounded)n.y=ground;else{n.vy+=NIGHTMARE.gravity*dt;n.y+=n.vy*dt;if(ground<n.y-3&&ground<stealthGround(old)-12){nextX=old;n.vx=0;ground=stealthGround(old);}if(n.vy>=0&&oldY<=ground+4&&n.y>=ground){n.y=ground;n.vy=0;n.grounded=true;}}n.x=nextX;
        const wet=mudLakeAt(n.x);if(wet&&n.y>=mudWaterline(wet,n.x)-35)enterDreamMud(n,wet,{side:x<0?-1:1});}
      n.animTime+=Math.abs(n.x-old)/30;if(x)n.facing=x<0?-1:1;
    }
    // Dispara pelos cruzamentos do relógio salvo, sem repetir ao renderizar ou retomar no meio do salto.
    if(mudBefore==='enter'&&n.mudMode==='enter'){
      const lake=DREAM_MUD_LAKES.find(l=>l.id===n.mudLakeId);
      if(mudAgeBefore<.12&&n.mudAge>=.12&&n.mudStartY>=mudWaterline(lake,n.mudStartX)-24)events.push({type:'jump',mudTakeoff:true});
      if(mudAgeBefore<.68&&n.mudAge>=.68)events.push({type:'mud-impact'});
    }
    if(n.x>=2380&&n.grounded&&Math.abs(n.x-2380)<70)n.checkpoint=Math.max(n.checkpoint,1);
    if(n.mudMode==='swim'&&n.mudDepth>=.94){const lake=DREAM_MUD_LAKES.find(l=>l.id===n.mudLakeId);n.checkpoint=Math.max(n.checkpoint,lake.index>=2?3:2);}
    if(n.grounded&&n.mudMode==='dry'&&n.x>=DREAM_MUD_LAKES.at(-1).to+11.9){s.stage='NIGHTMARE_FINAL';s.age=0;n.vx=0;n.exposure=0;continue;}
    const illuminated=nightmareVisibility(n,s.difficulty,{onlyLight:true}).lit;
    n.exposure=illuminated?n.exposure+dt:0;
    // Só a iluminação contínua causa golpe. Pular por si só não é uma condição de derrota.
    if(n.exposure>=(s.difficulty==='EASY'?.24:.12)){s.stage='NIGHTMARE_STRIKE';s.age=0;n.vx=0;n.vy=0;s.hits++;s.falls++;s.fallCause='roach';events.push({type:'nightmare-detected'});}


  }
  return events;
}
