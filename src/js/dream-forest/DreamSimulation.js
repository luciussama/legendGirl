import {beginDreamNightmare,stepDreamNightmare,validateNightmare,advanceNightmareDialogue,migrateNightmare} from './DreamNightmare.js';
import {beginDreamGlide,stepDreamGlide} from './DreamGlider.js';
import {dreamSpiderContact,dreamWebCanGrab} from './DreamWeb.js';
import {DREAM as C,DREAM_BY_ID,DREAM_OBJECTS,DREAM_SECTIONS,DREAM_WIDTH,dreamNearby,dreamObjectFrame,dreamGrassX,dreamSurface} from './DreamLevel.js';
import {DREAM_PROFILES} from './DreamArt.js';
export const DREAM_INTRO=Object.freeze([
  'O jardim cresceu por dentro do sono.\nUma folha podia esconder a lua.',
  'Ao tocar as gramas, Yuna se agarra.\nW/S ou ▲/▼ escala; Espaço ou PULAR salta.',
  'Suba no lombo e espere o voo.\nSalte quando o próximo apoio estiver perto.'
]);
/** Cada transporte guarda somente o instante de embarque; a trajetória deriva do relógio salvo. */
function createDreamRides(){return Object.fromEntries(DREAM_OBJECTS.filter(o=>o.flight).map(o=>[o.id,null]));}
function boardDreamBeetle(s,id,events){if(DREAM_BY_ID.get(id)?.flight&&s.rides[id]===null){s.rides[id]=s.time;events.push({type:'beetle-boarded',id});}}
function placeDreamCheckpoint(s){const o=dreamObjectFrame(DREAM_BY_ID.get(s.checkpoint),s.time,s.rides);Object.assign(s.player,{x:o.x+o.w*.45,y:dreamSurface(o,o.x+o.w*.45),vx:0,vy:0,support:o.id,climb:null,lock:null,lockTime:0,jumpHeld:true});}
/** Estado puro, sem Canvas, áudio ou entradas persistidas. */
export function createDreamState(difficulty='NORMAL'){return{version:5,nightmare:null,glider:null,hits:0,fallCause:null,rides:createDreamRides(),difficulty:difficulty==='EASY'?'EASY':'NORMAL',stage:'INTRO',time:0,age:0,story:{index:0,age:0},checkpoint:'rest-0',progress:0,falls:0,player:{x:130,y:650,vx:0,vy:0,facing:1,support:'rest-0',climb:null,lock:null,lockTime:0,jumpHeld:false,animTime:0}};}
/** Valida referências/limites e reconstrói apenas dados; snapshots inválidos não criam corpos fora do mapa. */
export function restoreDreamState(saved,difficulty){
  if(!saved||![1,2,3,4,5].includes(saved.version)||!['INTRO','RUNNING','FALLING','GAME_OVER','RESCUING','COMPLETE','GLIDE_APPROACH','GLIDE_GUST','GLIDE_LANDING','GLIDING','GLIDE_FALLING','NIGHTMARE_FALL','NIGHTMARE_INTRO','NIGHTMARE_REVEAL','STEALTH','NIGHTMARE_STRIKE','NIGHTMARE_FINAL','NIGHTMARE_WAKE'].includes(saved.stage)||!DREAM_BY_ID.get(saved.checkpoint)?.checkpoint)throw TypeError('Sonho salvo inválido.');
  const p=saved.player;if(!p||![p.x,p.y,p.vx,p.vy,p.animTime,saved.time,saved.age,saved.progress,saved.falls].every(Number.isFinite)||p.x<0||p.x>(saved.version<3?39214:DREAM_WIDTH)||p.y<(saved.version>=4?-2000:0)||p.y>3000||saved.time<0||saved.age<0||saved.progress<0||saved.progress>1||!Number.isSafeInteger(saved.falls)||saved.falls<0||Math.abs(p.vx)>1500||Math.abs(p.vy)>2500||![-1,1].includes(p.facing)||!Number.isInteger(saved.story?.index)||saved.story.index<0||saved.story.index>=DREAM_INTRO.length||!Number.isFinite(saved.story.age)||saved.story.age<0||p.climb?.side!==undefined&&![-1,1].includes(p.climb.side))throw TypeError('Corpo ou leitura salva do sonho inválidos.');
  const out=structuredClone(saved);out.version=5;out.difficulty=difficulty==='EASY'?'EASY':'NORMAL';
  if(saved.version===1){
    out.rides=createDreamRides();
    const id=p.support||p.climb?.id||p.lock||'',oldMixed=/^dream-5-(1|7|13|19|25)$/.test(id),changedSection=p.x>DREAM_SECTIONS[2].start+360&&p.x<DREAM_SECTIONS[3].start;
    if(changedSection||oldMixed||id.startsWith('dream-2-')){out.checkpoint=oldMixed?'rest-5':'rest-2';placeDreamCheckpoint(out);out.stage='RUNNING';out.age=0;}
  }
  if(saved.version<3){
    out.hits=0;out.fallCause=null;
    const id=p.support||p.climb?.id||p.lock||'';
    if(p.x>=DREAM_SECTIONS[4].start+360||/^dream-[45]-/.test(id)||saved.checkpoint==='rest-5'||saved.stage==='COMPLETE'){
      out.checkpoint='rest-4';placeDreamCheckpoint(out);out.stage='RUNNING';out.age=0;out.progress=out.player.x/(DREAM_WIDTH-300);
    }
  }
  if(saved.version<4){out.glider=null;if(saved.version===3&&(p.x>=27758||saved.stage==='COMPLETE')){out.checkpoint='rest-5';placeDreamCheckpoint(out);beginDreamGlide(out);}}
  if(out.stage.startsWith('GLIDE')||out.stage==='GLIDING'||out.stage==='COMPLETE'&&out.glider){if(!out.glider||!Number.isFinite(out.glider.cameraY)||Math.abs(out.glider.cameraY)>3000||out.checkpoint!=='rest-5')throw TypeError('Planador salvo inválido.');if(out.stage==='GLIDE_LANDING'&&(!Number.isFinite(out.glider.landing?.x)||!Number.isFinite(out.glider.landing?.y)))throw TypeError('Pouso salvo inválido.');}
  if(!Number.isSafeInteger(out.hits)||out.hits<0||out.hits>out.falls||![null,'spider','thorn','roach'].includes(out.fallCause))throw TypeError('Dano salvo do sonho inválido.');
  const expected=createDreamRides();
  if(!out.rides||Array.isArray(out.rides)||typeof out.rides!=='object'||Object.keys(out.rides).length!==Object.keys(expected).length||Object.keys(out.rides).some(id=>!Object.hasOwn(expected,id))||Object.values(out.rides).some(start=>start!==null&&(!Number.isFinite(start)||start<0||start>out.time)))throw TypeError('Viagem de besouro salva inválida.');
  const body=out.player,attached=body.climb&&DREAM_BY_ID.get(body.climb.id),maxGrip=['grass','web'].includes(attached?.kind)?(C.height+100-64-attached.y)/attached.h:1;
  if(body.support&&(!DREAM_BY_ID.has(body.support)||['grass','web'].includes(DREAM_BY_ID.get(body.support).kind))||body.climb&&(!attached||!Number.isFinite(body.climb.u)||body.climb.u<(attached?.kind==='web'?(100-attached.y)/attached.h:0)||body.climb.u>maxGrip||['leaf','branch','plateau'].includes(attached.kind))||body.lock&&!DREAM_BY_ID.has(body.lock)||!Number.isFinite(body.lockTime)||body.lockTime<0||body.lockTime>.4)throw TypeError('Apoio salvo do sonho inválido.');
  if(saved.version<5){out.nightmare=null;if(saved.version===4&&saved.stage==='COMPLETE')beginDreamNightmare(out);}
  migrateNightmare(out);
  if(out.nightmare)validateNightmare(out);else if(out.stage.startsWith('NIGHTMARE_')||out.stage==='STEALTH'||out.stage==='COMPLETE')throw TypeError('Trecho do pesadelo ausente.');
  out.player.jumpHeld=false;return out;
}
/** Um gesto adianta uma fala; o fim libera a travessia sem herdar um salto. */
export function advanceDreamDialogue(s){if(s.nightmare)return advanceNightmareDialogue(s);if(s.stage==='COMPLETE'&&s.age<7){s.age=7;return true;}if(s.stage!=='INTRO')return false;if(s.story.index<DREAM_INTRO.length-1){s.story.index++;s.story.age=0;}else{s.stage='RUNNING';s.age=0;s.player.jumpHeld=true;}return true;}
/** Retoma a folha no relógio corrente e recoloca os transportes necessários ao alcance. */
export function retryDream(s){if(s.nightmare){if(s.stage!=='GAME_OVER')return false;beginDreamNightmare(s,{retry:true,checkpoint:s.nightmare.checkpoint});return true;}if(!['GAME_OVER','RESCUING'].includes(s.stage))return false;const checkpoint=DREAM_BY_ID.get(s.checkpoint);for(const o of DREAM_OBJECTS)if(o.flight&&o.x>=checkpoint.x)s.rides[o.id]=null;placeDreamCheckpoint(s);s.stage='RUNNING';s.age=0;s.fallCause=null;return true;}
/** Um contato solta a teia, emite dano uma vez e conserva a queda também no EASY. */
function hitDreamSpider(s,near,events){
  if(s.stage!=='RUNNING')return false;
  for(const o of near)if(o.kind==='web'){
    const f=dreamObjectFrame(o,s.time,s.rides);
    if(dreamSpiderContact(f,s.player)){
      const p=s.player;s.hits++;s.falls++;s.fallCause='spider';s.stage='FALLING';s.age=0;p.support=null;p.climb=null;p.lock=o.id;p.lockTime=.38;p.vx=p.x<f.x?-170:170;p.vy=-150;events.push({type:'hurt',id:o.id},{type:'fall'});return true;
    }
  }
  return false;
}
/** Integra movimentos e colisões em passos de até 1/120 s, com o mesmo contorno usado na pintura. */
export function stepDream(s,input={},seconds=0){
  if(s.nightmare)return stepDreamNightmare(s,input,seconds);
  const events=[];let remaining=Math.max(0,Math.min(.2,seconds));
  if(s.stage==='GAME_OVER')return events;
 if(s.stage==='COMPLETE'){const o=DREAM_BY_ID.get(s.player.support),before=o&&dreamObjectFrame(o,s.time,s.rides);s.time+=remaining;s.age+=remaining;if(o?.kind==='branch'){const after=dreamObjectFrame(o,s.time,s.rides);s.player.x+=after.x-before.x;s.player.y=dreamSurface(after,s.player.x);}return events;}
  if(s.stage==='INTRO'){s.story.age+=remaining;if(input.advance||s.story.age>=7)advanceDreamDialogue(s);return events;}
  while(remaining>1e-8){if(s.stage==='GAME_OVER'||s.stage==='COMPLETE')break;const dt=Math.min(1/120,remaining);remaining-=dt;const previousTime=s.time;s.time+=dt;s.age+=dt;const p=s.player;
  if(s.stage.startsWith('GLIDE')||s.stage==='GLIDING'){const branch=dreamObjectFrame(DREAM_BY_ID.get('rest-5'),s.time,s.rides);stepDreamGlide(s,input,dt,branch,dreamSurface,events,dreamObjectFrame(DREAM_BY_ID.get('dream-finish'),s.time,s.rides));if(s.stage==='COMPLETE'){beginDreamNightmare(s);events.splice(0,events.length,...events.filter(e=>e.type!=='complete'));events.push({type:'nightmare-start'});return events;}s.progress=Math.max(s.progress,Math.min(1,p.x/(DREAM_WIDTH-300)));continue;}
  if(s.stage==='RUNNING'&&p.support==='rest-5'){beginDreamGlide(s);continue;}
  if(s.stage==='FALLING'){if(s.fallCause==='spider')p.x=Math.max(20,Math.min(DREAM_WIDTH-20,p.x+p.vx*dt));p.vy=Math.min(2000,p.vy+C.gravity*dt);p.y=Math.min(C.height+400,p.y+p.vy*dt);if(s.age>=1.6){s.stage=s.difficulty==='EASY'&&s.fallCause==='spider'?'RESCUING':'GAME_OVER';s.age=0;}continue;}
  if(s.stage==='RESCUING'){if(s.age>=1.1){retryDream(s);events.push({type:'checkpoint'});}continue;}
  const near=dreamNearby(p.x-500,p.x+600),x=Math.max(-1,Math.min(1,Number(input.x)||0)),y=Math.max(-1,Math.min(1,Number(input.y)||0)),jump=Boolean(input.jump)&&!p.jumpHeld;p.jumpHeld=Boolean(input.jump);p.lockTime=Math.max(0,p.lockTime-dt);if(x)p.facing=x<0?-1:1;
  if(hitDreamSpider(s,near,events))continue;
  if(p.support){boardDreamBeetle(s,p.support,events);const o=DREAM_BY_ID.get(p.support),a=dreamObjectFrame(o,previousTime,s.rides),b=dreamObjectFrame(o,s.time,s.rides);p.x+=b.x-a.x;p.y+=b.y-a.y;}
  if(p.climb){const o=DREAM_BY_ID.get(p.climb.id),f=dreamObjectFrame(o,s.time,s.rides),old=dreamObjectFrame(o,previousTime,s.rides);const limit=['grass','web'].includes(o.kind)?Math.max(p.climb.u,(C.height-64-f.y)/f.h):.96;p.climb.u=Math.max(o.kind==='web'?(100-f.y)/f.h:o.kind==='grass'?.04:0,Math.min(limit,p.climb.u+y*C.climbSpeed*dt/f.h));
   if(o.kind==='grass'||o.kind==='web'){const grip=f.y+p.climb.u*f.h,side=p.climb.side??-p.facing;p.facing=-side;p.x=dreamGrassX(f,grip)+side*19;p.y=grip+64;p.vx=(dreamGrassX(f,grip)-dreamGrassX(old,grip))/dt;}
   else{p.x=f.x+(p.climb.side<0?.16:.84)*f.w;p.y=f.y+p.climb.u*f.h;p.vx=(f.x-old.x)/dt;const top=dreamSurface(f,p.x,DREAM_PROFILES);if(p.y<=top+2){p.y=top;p.support=f.id;p.climb=null;boardDreamBeetle(s,f.id,events);}}
   p.vy=0;p.animTime+=Math.abs(y)*dt*8;
   if(hitDreamSpider(s,near,events))continue;
   if(jump){if(x)p.facing=x<0?-1:1;p.lock=o.id;p.lockTime=.38;p.climb=null;p.support=null;p.vx=p.facing*280+Math.max(-60,Math.min(60,p.vx));p.vy=-(s.difficulty==='EASY'?C.jump+25:C.jump);events.push({type:'jump'});}else continue;
  }
  if(p.support&&jump){p.vx=x*C.speed;p.support=null;p.vy=-(s.difficulty==='EASY'?C.jump+25:C.jump);events.push({type:'jump'});}
  const oldX=p.x,oldY=p.y;p.vx=p.support?x*C.speed:p.vx+Math.max(-900*dt,Math.min(900*dt,x*C.speed-p.vx));p.x=Math.max(20,Math.min(DREAM_WIDTH-20,p.x+p.vx*dt));p.animTime+=Math.abs(p.vx)*dt/32;
  if(p.support){const f=dreamObjectFrame(DREAM_BY_ID.get(p.support),s.time,s.rides);if(p.x>=f.x+f.w*.12&&p.x<=f.x+f.w*.88){p.y=dreamSurface(f,p.x,DREAM_PROFILES);p.vy=0;}else p.support=null;}
  if(!p.support){p.vy+=C.gravity*dt;p.y+=p.vy*dt;
   for(const o of near){const f=dreamObjectFrame(o,s.time,s.rides);if(o.kind==='grass'||o.kind==='web'){
     const grip=p.y-64;if(p.lockTime&&p.lock===o.id)continue;
     const stemX=dreamGrassX(f,grip),before=dreamObjectFrame(o,previousTime,s.rides),from=oldX-dreamGrassX(before,oldY-64),to=p.x-stemX;
     // Cada haste é elegível por contato, inclusive abaixo da lâmina e depois de perder a anterior.
     if((o.kind==='web'?dreamWebCanGrab(f,grip):grip>=f.y+10&&grip<=C.height+100-64)&&(Math.abs(to)<=C.bodyRadius+28||from*to<0)){p.facing=to>0?-1:1;p.x=stemX-p.facing*19;p.climb={id:o.id,u:(grip-f.y)/f.h,side:-p.facing};p.support=null;p.vy=0;events.push({type:'grip'});break;}
    }else{const top=dreamSurface(f,p.x,DREAM_PROFILES),before=dreamObjectFrame(o,previousTime,s.rides),oldTop=dreamSurface(before,oldX,DREAM_PROFILES);if(p.vy>=0&&p.x>=f.x+f.w*.12&&p.x<=f.x+f.w*.88&&oldY<=oldTop+3&&p.y>=top){p.y=top;p.vy=0;p.support=o.id;boardDreamBeetle(s,o.id,events);if(o.checkpoint&&s.checkpoint!==o.id){s.checkpoint=o.id;events.push({type:'checkpoint'});}if(o.finish){s.stage='COMPLETE';s.age=0;p.vx=0;p.vy=0;events.push({type:'complete'});}break;}
     if(!['leaf','branch','plateau'].includes(o.kind)&&!(p.lockTime&&p.lock===o.id)&&p.y>top+10&&p.y<f.y+f.h*.96){const side=oldX<f.x+f.w*.5?-1:1,edge=f.x+(side<0?.16:.84)*f.w;if(Math.abs(p.x-edge)<22){p.climb={id:o.id,u:Math.max(.04,Math.min(.96,(p.y-f.y)/f.h)),side};p.support=null;p.facing=-side;p.vy=0;events.push({type:'grip'});break;}}
    }
   }
  }
  if(hitDreamSpider(s,near,events))continue;
  s.progress=Math.max(s.progress,Math.min(1,p.x/(DREAM_WIDTH-300)));
  if(p.y>C.height+100){s.fallCause=null;s.falls++;s.stage=s.difficulty==='EASY'?'RESCUING':'FALLING';s.age=0;p.climb=null;p.support=null;events.push({type:'fall'});}
  }
  return events;
}
