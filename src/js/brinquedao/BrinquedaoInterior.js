import {BRINQUEDAO_INSIDE as C,BRINQUEDAO_TUBES,brinquedaoInsideFloor} from './BrinquedaoTubes.js';
import {brinquedaoFishSpecs,brinquedaoFishPose,brinquedaoFishTouches} from './BrinquedaoFish.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
/** Nove alternâncias de velocidade/cuidado, com dois acertos para perder a tentativa. */
export function createBrinquedaoInterior(){return{version:1,section:0,leg:0,mode:'tube',u:0,time:0,age:0,poolTime:0,hits:0,invulnerable:0,checkpoint:0,complete:false,player:{x:140,y:450,vx:0,vy:300,facing:1,grounded:false,jumpHeld:true,animTime:0}};}
export function beginBrinquedaoInterior(s){s.interior=createBrinquedaoInterior();s.stage='INTERIOR';s.age=0;s.player.vx=0;s.player.vy=0;s.progress=.55;}
/** Retry reabre a piscina atual numa borda segura, com a vida da tentativa restaurada. */
export function retryBrinquedaoInterior(s){const i=s.interior,index=i.checkpoint;i.section=Math.floor(index/3);i.leg=index%3;i.mode='pool';i.u=1;i.age=0;i.poolTime=0;i.hits=0;i.invulnerable=1.2;i.complete=false;i.player={x:140,y:850,vx:0,vy:0,facing:1,grounded:true,jumpHeld:true,animTime:0};s.stage='INTERIOR';s.age=0;}
/** Tubos conduzem o corpo pela curva; piscinas devolvem direção, repouso e salto ao jogador. */
export function stepBrinquedaoInterior(s,input,seconds){const events=[],i=s.interior,axis=clamp(Number(input.x)||0,-1,1),jump=Boolean(input.jump);let remaining=seconds;
 while(remaining>1e-8&&s.stage==='INTERIOR'){const dt=Math.min(1/180,remaining);remaining-=dt;s.time+=dt;s.age+=dt;i.time+=dt;i.age+=dt;i.invulnerable=Math.max(0,i.invulnerable-dt);const p=i.player,index=i.section*3+i.leg;
  if(i.mode==='tube'){const tube=BRINQUEDAO_TUBES[index];i.u=Math.min(1,i.u+tube.speed*(axis<0?.85:1)*dt/tube.length);s.progress=.55+.45*(index+i.u*.48)/9;if(i.u>=1){i.mode='pool';i.age=0;i.poolTime=0;i.checkpoint=index;Object.assign(p,{x:140,y:450,vx:160,vy:300,grounded:false,jumpHeld:true});events.push({type:'balls'});}continue;}
  i.poolTime+=dt;const oldY=p.y;if(jump&&!p.jumpHeld&&p.grounded){p.vy=-C.jump;p.grounded=false;events.push({type:'jump'});}p.jumpHeld=jump;
  const goal=axis*C.walk,change=(p.grounded?700:520)*dt;p.vx+=clamp(goal-p.vx,-change,change);p.x=clamp(p.x+p.vx*dt,50,C.poolWidth-35);if(Math.abs(p.vx)>5)p.facing=Math.sign(p.vx);p.animTime+=Math.abs(p.vx)*dt/28;
  if(p.grounded)p.y=brinquedaoInsideFloor(p.x);else{p.vy=Math.min(1200,p.vy+C.gravity*dt);p.y+=p.vy*dt;const floor=brinquedaoInsideFloor(p.x);if(p.vy>=0&&oldY<=floor+3&&p.y>=floor){p.y=floor;p.vy=0;p.grounded=true;}}
  if(i.invulnerable<=0){for(const spec of brinquedaoFishSpecs(i.section,i.leg)){if(!brinquedaoFishTouches(p,brinquedaoFishPose(spec,i.poolTime)))continue;i.hits++;i.invulnerable=1.4;p.vx=-p.facing*240;p.vy=-310;p.grounded=false;events.push({type:'hurt'});if(i.hits>=2){s.stage='GAME_OVER';s.age=0;s.failures++;p.vx=0;p.vy=0;}break;}}
  s.progress=.55+.45*(index+(i.mode==='pool'?.48+.52*p.x/C.poolWidth:i.u*.48))/9;
  if(s.stage==='INTERIOR'&&p.x>=C.poolWidth-60&&p.grounded){if(index===8){i.complete=true;s.stage='COMPLETE';s.age=0;s.progress=1;s.story.endingDone=false;events.push({type:'complete'});}else{i.leg++;if(i.leg===3){i.section++;i.leg=0;}i.mode='tube';i.u=0;i.age=0;p.jumpHeld=true;events.push({type:'tube-start'});}}
 }
 return events;
}
/** Referências e relógios são dados; imagem, trajetória amostrada e áudio não entram no save. */
export function validateBrinquedaoInterior(s){const i=s.interior;if(!i){if(['INTERIOR','COMPLETE'].includes(s.stage))throw TypeError('Interior salvo ausente.');return;}
 if(i.version!==1||!Number.isInteger(i.section)||i.section<0||i.section>2||!Number.isInteger(i.leg)||i.leg<0||i.leg>2||!['tube','pool'].includes(i.mode)||![i.u,i.time,i.age,i.poolTime,i.invulnerable].every(Number.isFinite)||i.u<0||i.u>1||i.time<0||i.time>s.time+.001||i.age<0||i.age>i.time+.001||i.poolTime<0||i.poolTime>i.time+.001||i.invulnerable<0||i.invulnerable>1.4||!Number.isInteger(i.hits)||i.hits<0||i.hits>2||!Number.isInteger(i.checkpoint)||i.checkpoint<0||i.checkpoint>8||typeof i.complete!=='boolean'||!['INTERIOR','GAME_OVER','COMPLETE'].includes(s.stage))throw TypeError('Seção interna salva inválida.');
 const p=i.player;if(!p||![p.x,p.y,p.vx,p.vy,p.animTime].every(Number.isFinite)||p.x<50||p.x>C.poolWidth||p.y<0||p.y>1000||Math.abs(p.vx)>400||Math.abs(p.vy)>1500||p.animTime<0||![-1,1].includes(p.facing)||typeof p.grounded!=='boolean'||typeof p.jumpHeld!=='boolean'||i.complete!==(s.stage==='COMPLETE')||i.hits===2&&s.stage!=='GAME_OVER'||s.stage==='GAME_OVER'&&i.hits!==2)throw TypeError('Corpo ou dano interno salvo inválido.');
}
