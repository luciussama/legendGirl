import {beginBrinquedaoInterior,retryBrinquedaoInterior,stepBrinquedaoInterior,validateBrinquedaoInterior} from './BrinquedaoInterior.js';
import {brinquedaoRicochetAge,hitBrinquedaoSideMat} from './BrinquedaoRecovery.js';
import {BRINQUEDAO as C,BRINQUEDAO_TRACKS,BRINQUEDAO_BY_ID,BRINQUEDAO_CHECKPOINTS,BRINQUEDAO_STEPS,brinquedaoMainAt,brinquedaoSurface,brinquedaoSlope} from './BrinquedaoLevel.js';
import {BRINQUEDAO_INTRO,advanceBrinquedaoStory} from './BrinquedaoStory.js';
import {brinquedaoDeathY} from './BrinquedaoExtension.js';
import {createBrinquedaoObstacles,validateBrinquedaoObstacles,brinquedaoBridgeSolid,contactBrinquedao,hitBrinquedaoElastic,launchBrinquedaoSky} from './BrinquedaoObstacles.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
/** Domínio4: física independente, relógios das atrações e derrota por sair da estrutura. */
export function createBrinquedaoState(difficulty='NORMAL'){
 const p=brinquedaoMainAt(120);
 return{version:4,interior:null,difficulty:difficulty==='EASY'?'EASY':'NORMAL',stage:'INTRO',time:0,age:0,checkpoint:0,returns:0,failures:0,progress:0,obstacles:createBrinquedaoObstacles(),story:{index:0,age:0,endingDone:false},player:{x:120,y:brinquedaoSurface(p,120),vx:0,vy:0,facing:1,support:p.id,mode:'walk',animTime:0,jumpHeld:false,coyote:0,buffer:0}};
}
/** Saves1/2/3 preservam percurso e relógios; a chegada externa antiga abre o interior. */
export function restoreBrinquedaoState(saved,difficulty){
 if(!saved||![1,2,3,4].includes(saved.version))throw TypeError('Brinquedão salvo inválido.');
 const s=structuredClone(saved);
 if(s.version===1){if(s.player?.x>14800||s.checkpoint>3)throw TypeError('Percurso antigo do Brinquedão inválido.');s.version=2;s.obstacles=createBrinquedaoObstacles();s.failures=0;s.progress=Math.max(0,Math.min(1,(s.player?.x??0)/(C.width-220)));if(s.stage==='COMPLETE'){s.stage='RUNNING';s.age=0;s.story.endingDone=false;}}
 if(s.version===2){const fresh=createBrinquedaoObstacles();if(!s.obstacles||!s.obstacles.springs)throw TypeError('Atrações antigas salvas inválidas.');s.obstacles={...fresh,...s.obstacles,springs:{...fresh.springs,...s.obstacles.springs},bumpers:fresh.bumpers,ricochets:0,recoveryLandings:0};s.version=3;}
 if(s.version===3){s.version=4;s.interior=null;s.progress*=.55;if(s.stage==='COMPLETE')beginBrinquedaoInterior(s);}
 if(!['INTRO','RUNNING','RECOVER','GAME_OVER','COMPLETE','INTERIOR'].includes(s.stage)||![s.time,s.age,s.progress].every(Number.isFinite)||s.time<0||s.age<0||s.progress<0||s.progress>1||!Number.isInteger(s.checkpoint)||s.checkpoint<0||s.checkpoint>=BRINQUEDAO_CHECKPOINTS.length||![s.returns,s.failures].every(v=>Number.isSafeInteger(v)&&v>=0))throw TypeError('Brinquedão salvo inválido.');
 const p=s.player,t=s.story;
 if(!p||![p.x,p.y,p.vx,p.vy,p.animTime,p.coyote,p.buffer].every(Number.isFinite)||p.x<0||p.x>C.width||p.y< -4000||p.y>2400||Math.abs(p.vx)>C.elasticSpeed+1||Math.abs(p.vy)>2700||p.animTime<0||p.coyote<0||p.coyote>.1||p.buffer<0||p.buffer>.13||![-1,1].includes(p.facing)||!['walk','air','slide','balls'].includes(p.mode)||typeof p.jumpHeld!=='boolean'||p.support!==null&&!BRINQUEDAO_BY_ID.has(p.support)||!t||!Number.isInteger(t.index)||t.index<0||t.index>=BRINQUEDAO_INTRO.length||!Number.isFinite(t.age)||t.age<0||typeof t.endingDone!=='boolean')throw TypeError('Corpo ou história do Brinquedão inválidos.');
 const track=BRINQUEDAO_BY_ID.get(p.support);
 if((p.mode==='air')!==(p.support===null)||p.mode==='slide'&&!['slide','reverse'].includes(track?.kind)||p.mode==='balls'&&track?.kind!=='balls')throw TypeError('Apoio e modo do Brinquedão incompatíveis.');
 if(track&&(p.x<track.from-1||p.x>track.to+1||Math.abs(p.y-brinquedaoSurface(track,p.x))>2))throw TypeError('Corpo fora do apoio salvo do Brinquedão.');
 if(track?.kind==='spring')throw TypeError('Lona salva sem impulso de contato.');s.difficulty=difficulty==='EASY'?'EASY':'NORMAL';validateBrinquedaoObstacles(s);validateBrinquedaoInterior(s);return s;
}
/** Retry volta ao último terraço alcançado e rearma apenas as pontes seguintes. */
export function recoverBrinquedao(s){
 if(s.interior){retryBrinquedaoInterior(s);return;}
 const x=BRINQUEDAO_CHECKPOINTS[s.checkpoint],track=brinquedaoMainAt(x);
 Object.assign(s.player,{x,y:brinquedaoSurface(track,x),vx:0,vy:0,support:track.id,mode:'walk',coyote:0,buffer:0,jumpHeld:true});
 for(const p of BRINQUEDAO_TRACKS)if(p.kind==='fragile'&&p.to>=x)s.obstacles.bridges[p.id]=null;
 s.stage='RUNNING';s.age=0;
}
/** Subpassos preservam contato das lonas, limites das pontes e controle direcional no ar. */
export function stepBrinquedao(s,input={},seconds=0){
 const events=[],total=clamp(Number(seconds)||0,0,.2);
 if(s.stage==='GAME_OVER')return events;
 if(s.stage==='INTERIOR')return stepBrinquedaoInterior(s,input,total);
 if(s.stage==='INTRO'){s.story.age+=total;if(input.advance||s.story.age>=BRINQUEDAO_INTRO[s.story.index].duration)advanceBrinquedaoStory(s);return events;}
 if(s.stage==='COMPLETE'){s.age+=total;s.time+=total;if(s.age>=6)s.story.endingDone=true;return events;}
 if(s.stage==='RECOVER'){s.age+=total;if(s.age>=.75)recoverBrinquedao(s);return events;}
 const p=s.player,axis=clamp(Number(input.x)||0,-1,1),jump=Boolean(input.jump);
 if(jump&&!p.jumpHeld)p.buffer=.12;p.jumpHeld=jump;
 let remaining=total;
 while(remaining>1e-8){
  const dt=Math.min(1/180,remaining);remaining-=dt;s.time+=dt;s.age+=dt;
  const previous={x:p.x,y:p.y};let support=BRINQUEDAO_BY_ID.get(p.support);
  if(support&&!brinquedaoBridgeSolid(s,support)){p.support=null;p.mode='air';p.coyote=0;support=null;events.push({type:'bridge-fall'});}
  p.buffer=Math.max(0,p.buffer-dt);p.coyote=support? (support.kind==='reverse'?0:.1):Math.max(0,p.coyote-dt);
  if(p.buffer>0&&(support||p.coyote>0)&&support?.kind!=='reverse'){p.vy=-C.jump;p.support=null;p.buffer=0;p.coyote=0;p.mode='air';events.push({type:'jump'});}
  const oldSpeed=Math.abs(p.vx),ground=BRINQUEDAO_BY_ID.get(p.support),slope=ground?brinquedaoSlope(ground,p.x):0;
  if(axis&&ground?.kind!=='reverse'){const brake=Math.sign(axis)!==Math.sign(p.vx)&&Math.abs(p.vx)>20?1.7:1;p.vx+=axis*C.acceleration*brake*dt*(brinquedaoRicochetAge(s)<.18?.32:1);}
  else if(!axis){const drag=ground?.kind==='reverse'?35:ground?.bowlDepth?60:ground?260:35;p.vx=Math.sign(p.vx)*Math.max(0,Math.abs(p.vx)-drag*dt);}
  if(ground)p.vx+=C.gravity*slope/(1+slope*slope)*dt*.65;
  const cap=ground?.bowlDepth?1550:ground?.kind==='reverse'?C.elasticSpeed:ground?.kind==='slide'?C.slideSpeed:ground?.kind==='balls'?420:Math.max(C.maxSpeed,oldSpeed-120*dt);
  p.vx=clamp(p.vx,-Math.min(C.elasticSpeed,cap),Math.min(C.elasticSpeed,cap));
  if(ground?.kind==='balls')p.vx*=Math.exp(-1.15*dt);
  p.x=clamp(p.x+p.vx*dt,0,C.width);
  for(const step of BRINQUEDAO_STEPS)if(previous.x<=step.x-12&&p.x>step.x-12&&p.y>step.top-3&&p.y-C.bodyHeight<step.bottom+100){p.x=step.x-12;p.vx=0;}
  if(Math.abs(p.vx)>5)p.facing=Math.sign(p.vx);p.animTime+=Math.abs(p.vx)*dt/28;
  if(hitBrinquedaoSideMat(s,previous,events)){/* A lona lateral devolve embalo antes de retomar o controle completo. */}
  else if(hitBrinquedaoElastic(s,previous,events)){/* Contato oblíquo troca queda/descida por energia para a rampa. */}
  else if(ground?.kind==='reverse'&&p.x>ground.to){launchBrinquedaoSky(s,events);}
  else if(ground&&p.x>=ground.from&&p.x<=ground.to){p.y=brinquedaoSurface(ground,p.x);p.vy=0;p.mode=ground.kind==='balls'?'balls':['slide','reverse'].includes(ground.kind)&&Math.abs(p.vx)>160?'slide':'walk';}
  else{
   const connected=ground&&(!ground.upper||ground.recovery)&&BRINQUEDAO_TRACKS.find(t=>t!==ground&&p.x>=t.from&&p.x<=t.to&&Math.abs(brinquedaoSurface(t,p.x)-p.y)<=26&&brinquedaoBridgeSolid(s,t));
   if(connected)contactBrinquedao(s,connected,events);
   else{
    p.support=null;p.mode='air';p.vy=Math.min(1800,p.vy+C.gravity*dt);p.y+=p.vy*dt;
    if(p.vy>=0){const candidates=BRINQUEDAO_TRACKS.filter(t=>p.x>=t.from&&p.x<=t.to&&brinquedaoBridgeSolid(s,t)&&previous.y<=brinquedaoSurface(t,previous.x)+2&&p.y>=brinquedaoSurface(t,p.x)).sort((a,b)=>brinquedaoSurface(a,p.x)-brinquedaoSurface(b,p.x));if(candidates.length)contactBrinquedao(s,candidates[0],events);}
   }
  }
  s.progress=Math.max(s.progress,Math.min(.55,.55*p.x/(C.width-220)));
  // Só terraços realmente alcançados viram checkpoint; sobrevoar uma torre não basta.
  const checkpoint=BRINQUEDAO_CHECKPOINTS.findLastIndex(x=>p.x>=x&&(x<14800||p.support===brinquedaoMainAt(x)?.id));
  if(checkpoint>s.checkpoint){s.checkpoint=checkpoint;events.push({type:'checkpoint'});}
  if(p.x<14800&&p.y>1450){s.stage='RECOVER';s.age=0;s.returns++;events.push({type:'soft-landing'});break;}
  if(p.x>=14800&&p.y>brinquedaoDeathY(p.x)){s.stage='GAME_OVER';s.age=0;s.failures++;p.vx=0;p.vy=0;events.push({type:'fall'});break;}
  if(p.x>=C.width-220&&p.support){beginBrinquedaoInterior(s);events.push({type:'tube-start'});break;}
 }
 return events;
}
