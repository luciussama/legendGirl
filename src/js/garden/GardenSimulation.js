import {advanceGardenDefeats} from './GardenDefeatPresentation.js';
import {createGardenEncounters,restoreGardenEncounters,tickGardenBee,tickGardenWorm,tickGardenBeetles,resetGardenPanic,GARDEN_BEETLES,sweptGardenContact} from './GardenEncounters.js';
import {GARDEN_OPENING_DURATION,GARDEN_OPENING,GARDEN_ENDING} from './GardenNarrative.js';
import {gardenContactHeight,gardenGirlPose} from './GardenContact.js';
import {GARDEN as C,GARDEN_HOME,GARDEN_ENEMIES,GARDEN_CHECKPOINTS,GARDEN_LEGACY_CHECKPOINTS,GARDEN_TERRAINS,GARDEN_PLATFORM_BY_ID,GARDEN_WATERS,gardenPlatforms,gardenTerrainAt,gardenSurfaceY,cloudStatus} from './GardenLevel.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const stages=['INTRO','RUNNING','RESCUING','DISORIENTED','COMPLETE','FALLING','GAME_OVER'];
/** A perseguição usa o chão de origem completo, sem atravessar rios ou buracos. */
function enemyRange(enemy){
  const support=GARDEN_PLATFORM_BY_ID.get(enemy.supportId);
  return support?{left:support.x+45,right:support.x+support.w-45}:enemy;
}
/** Domínio puro em segundos, incluindo fada, terrenos, nuvens e recuperação EASY. */
export function createGardenState(difficulty='NORMAL'){
  return {version:11,story:{openingIndex:0,endingIndex:0,openingDone:false,endingDone:false,seenOpening:false,seenEnding:false,cardAge:0},storyHeld:false,presentation:{beetleHintSeen:false,hintRemaining:0,hurtRemaining:0,hurtDirection:1},encounters:createGardenEncounters(),difficulty:difficulty==='EASY'?'EASY':'NORMAL',stage:'INTRO',age:0,time:0,hp:difficulty==='EASY'?6:3,checkpoint:120,defeated:0,
    jumpHeld:false,jumpBuffer:0,coyote:0,immunity:0,jumps:0,clouds:{},trail:['entrada'],safeGround:'entrada',recovery:null,
    player:{animationTime:0,balancePose:null,x:GARDEN_HOME.steps[0].x,y:GARDEN_HOME.steps[0].y,vx:0,vy:0,facing:1,onGround:true,support:'entrada',terrain:'wood',airSpeed:C.speed,discomfort:0},
    fairy:{x:120,y:C.ground-135,mode:'follow',idle:0,progressX:120,guideAge:0,target:null},
    enemies:GARDEN_ENEMIES.map(e=>({...e,hp:e.type==='caterpillar'?2:1,direction:-1,alive:true,defeatAge:0,stompLock:0,hopAge:0,routeIndex:0,attackPhase:'patrol',attackAge:0,retreatDirection:1}))};
}
/** A reação visível não altera o deslocamento nem acrescenta danos durante a imunidade. */
function hurtPlayer(s,source,events){
  s.hp--;s.immunity=2;s.player.vy=-280;s.player.onGround=false;s.player.support=null;
  s.presentation.hurtRemaining=.48;
  s.presentation.hurtDirection=Math.sign(s.player.x-source.x)||-s.player.facing;
  events.push({type:'hurt',enemy:source.id});
  if(s.hp<=0){defeat(s,'hurt',events);return true;}
  return false;
}
function recoverTarget(s,kind){
  if(kind==='hurt'){
    const history=s.trail.map(id=>GARDEN_PLATFORM_BY_ID.get(id)).filter(p=>p&&p.type!=='cloud');
    const target=history[Math.max(0,history.length-3)];if(target)return{x:clamp(s.player.x,target.x+50,target.x+target.w-50),y:gardenContactHeight(target,s.player,clamp(s.player.x,target.x+50,target.x+target.w-50)),id:target.id};
  }
  const ground=GARDEN_PLATFORM_BY_ID.get(s.safeGround)||GARDEN_PLATFORM_BY_ID.get('entrada');
  return{x:clamp(s.player.x,ground.x+60,ground.x+ground.w-60),y:gardenContactHeight(ground,s.player,clamp(s.player.x,ground.x+60,ground.x+ground.w-60)),id:ground.id};
}
function beginRecovery(s,kind,events){
  const panic=s.encounters.panic;
  s.recovery={from:{x:s.player.x,y:Math.min(s.player.y,730)},to:recoverTarget(s,kind),kind};
  if(panic){const encounter=GARDEN_BEETLES.find(b=>b.id===panic.id),ground=GARDEN_PLATFORM_BY_ID.get(s.recovery.to.id),x=clamp(encounter.x-80,ground.x+60,ground.x+ground.w-60);if(x<s.recovery.to.x){s.recovery.to.x=x;s.recovery.to.y=gardenContactHeight(ground,s.player,x);}}
  resetGardenPanic(s,s.recovery.to.x);
  s.stage=kind==='hurt'?'DISORIENTED':'RESCUING';s.age=0;s.fairy.mode='rescue';s.fairy.target=null;
  s.hp=6;s.jumpBuffer=0;s.coyote=0;s.player.vx=0;s.player.vy=0;events.push({type:kind==='hurt'?'dazed':'rescue'});
}
function defeat(s,kind,events){
  if(s.difficulty==='EASY'){beginRecovery(s,kind,events);return;}
  resetGardenPanic(s,s.checkpoint);
  s.hp=0;s.stage='FALLING';s.age=0;s.player.onGround=false;s.player.support=null;s.player.vy=kind==='hurt'?-260:Math.max(120,s.player.vy);s.player.vx=kind==='hurt'?-s.player.facing*80:0;if(kind!=='hurt')events.push({type:kind});
}
/** Uma tentativa nova conserva os inimigos vencidos e retoma chão firme no checkpoint. */
export function retryGarden(s,difficulty=s.difficulty){
  if(s.stage!=='GAME_OVER')return false;
  const enemies=s.enemies.map(e=>({...e})),encounters=structuredClone(s.encounters),checkpoint=s.checkpoint,presentation={...s.presentation},story={...s.story};
  Object.assign(s,createGardenState(difficulty));s.story=story;s.presentation={...presentation,hurtRemaining:0,hurtDirection:1};s.stage='RUNNING';s.checkpoint=checkpoint;s.enemies=enemies;s.encounters=encounters;s.defeated=enemies.filter(e=>!e.alive).length+encounters.bees.filter(e=>!e.alive).length;
  const ground=[...GARDEN_PLATFORM_BY_ID.values()].find(p=>p.ground&&checkpoint>=p.x&&checkpoint<=p.x+p.w);
  Object.assign(s.player,{x:checkpoint,y:ground?gardenContactHeight(ground,s.player,checkpoint):C.ground,support:ground?.id??'entrada',terrain:ground?.type??'wood'});
  resetGardenPanic(s,checkpoint);s.safeGround=s.player.support;s.trail=[s.player.support];s.immunity=3;s.fairy.x=checkpoint;s.fairy.progressX=checkpoint;return true;
}
/** Migra o mapa antigo para o início seguro; conclusão antiga chega ao piquenique novo. */
export function restoreGardenState(saved,difficulty='NORMAL'){
  if(!saved||![1,2,3,4,5,6,7,8,9,10,11].includes(saved.version)||!stages.includes(saved.stage))throw new TypeError('Save do jardim inválido.');
  const finite=values=>values.every(Number.isFinite);
  if(!saved.player||!finite([saved.age,saved.time,saved.hp,saved.checkpoint,saved.player.x,saved.player.y,saved.player.vx,saved.player.vy])||saved.time<0||saved.age<0)throw new TypeError('Estado do jardim incompatível.');
  const out=createGardenState(difficulty);
  if(saved.version===1){if(saved.stage==='COMPLETE'){out.stage='COMPLETE';Object.assign(out.player,{x:C.goal,y:C.ground,support:'arvore'});}return out;}
  // As revisões longas v2/v3 retomam o setor equivalente no mapa de cinco minutos, preservando inimigos vencidos.
  if(saved.version>=2&&saved.version<=5){
    if(!GARDEN_LEGACY_CHECKPOINTS.has(`${saved.version}:${saved.checkpoint}`)||!Array.isArray(saved.enemies))throw new TypeError('Estado antigo do jardim incompatível.');
    out.stage=saved.stage==='COMPLETE'?'COMPLETE':saved.stage==='INTRO'?'INTRO':'RUNNING';out.checkpoint=GARDEN_LEGACY_CHECKPOINTS.get(`${saved.version}:${saved.checkpoint}`);out.hp=clamp(Math.floor(saved.hp),1,difficulty==='EASY'?6:3);
    const x=out.stage==='COMPLETE'?C.goal:out.checkpoint,ground=[...GARDEN_PLATFORM_BY_ID.values()].find(p=>p.ground&&x>=p.x&&x<p.x+p.w);
    Object.assign(out.player,{x,y:gardenContactHeight(ground,out.player,x),support:ground.id,terrain:ground.type});out.safeGround=ground.id;out.trail=[ground.id];Object.assign(out.fairy,{x,y:gardenContactHeight(ground,out.player,x)-135,progressX:x});
    for(const old of saved.enemies)if(!old||typeof old.id!=='string'||!Number.isInteger(old.hp)||old.hp<0||old.hp>2||old.alive!==(old.hp>0))throw new TypeError('Inimigo antigo inválido.');
    out.enemies=out.enemies.map(e=>{const currentId=e.id.replace('-gramado-lagarta','-lagarta').replace('-clareira-lagarta','-lagarta-da-saida').replace('-caminho-formiga','-formiga'),legacyId=saved.version>=4?currentId:currentId.replace(/^trecho-(\d+)/,(_,n)=>'trecho-'+(Math.floor(Number(n)/2)*5+(Number(n)%2?3:0))),old=saved.enemies.find(v=>v.id===legacyId);return old&&old.hp<=e.hp?{...e,hp:old.hp,alive:old.alive}:e;});out.defeated=out.enemies.filter(e=>!e.alive).length;return out;
  }
  if(saved.player.x<0||saved.player.x>C.width||Math.abs(saved.player.y)>10000||!GARDEN_CHECKPOINTS.includes(saved.checkpoint)||!Array.isArray(saved.enemies)||saved.enemies.length!==out.enemies.length)throw new TypeError('Estado do jardim incompatível.');
  if(saved.presentation)out.presentation={beetleHintSeen:saved.presentation.beetleHintSeen===true,hintRemaining:clamp(Number(saved.presentation.hintRemaining)||0,0,6),hurtRemaining:clamp(Number(saved.presentation.hurtRemaining)||0,0,.48),hurtDirection:saved.presentation.hurtDirection===-1?-1:1};
  out.stage=saved.stage;out.time=saved.time;out.age=saved.age;out.hp=clamp(Math.floor(saved.hp),0,difficulty==='EASY'?6:3);out.checkpoint=saved.checkpoint;
  out.immunity=clamp(Number.isFinite(saved.immunity)?saved.immunity:0,0,4);out.jumps=Number.isSafeInteger(saved.jumps)&&saved.jumps>=0?saved.jumps:0;
  if(!saved.clouds||typeof saved.clouds!=='object'||Array.isArray(saved.clouds))throw new TypeError('Nuvens salvas inválidas.');
  for(const [id,time]of Object.entries(saved.clouds)){if(GARDEN_PLATFORM_BY_ID.get(id)?.type!=='cloud'||!Number.isFinite(time)||time<0||time>saved.time)throw new TypeError('Relógio de nuvem inválido.');out.clouds[id]=time;}
  const supports=gardenPlatforms(out.time,out);
  out.player={...out.player,animationTime:out.time,balancePose:saved.player.balancePose&&['menina-corrida-v1','menina-acoes-v1','menina-desconforto-v1','menina-pedrinhas-v2'].includes(saved.player.balancePose.set)&&Number.isInteger(saved.player.balancePose.index)&&saved.player.balancePose.index>=0&&saved.player.balancePose.index<(saved.player.balancePose.set==='menina-pedrinhas-v2'?4:8)?{set:saved.player.balancePose.set,index:saved.player.balancePose.index}:null,x:saved.player.x,y:saved.player.y,vx:clamp(saved.player.vx,-500,500),vy:clamp(saved.player.vy,-1000,1800),facing:saved.player.facing===-1?-1:1,onGround:Boolean(saved.player.onGround),support:supports.some(p=>p.id===saved.player.support)?saved.player.support:null,terrain:Object.hasOwn(GARDEN_TERRAINS,saved.player.terrain)?saved.player.terrain:'soil',airSpeed:clamp(Number(saved.player.airSpeed)||C.speed,100,480),discomfort:clamp(Number(saved.player.discomfort)||0,0,1)};
  out.trail=Array.isArray(saved.trail)?saved.trail.filter(id=>GARDEN_PLATFORM_BY_ID.has(id)).slice(-8):['entrada'];
  out.safeGround=GARDEN_PLATFORM_BY_ID.get(saved.safeGround)?.ground?saved.safeGround:'entrada';
  out.enemies=out.enemies.map((e,i)=>{const value=saved.enemies[i];if(!value||value.id!==e.id||typeof value.alive!=='boolean'||!finite([value.x,value.y,value.defeatAge,value.hp,value.hopAge])||value.x<enemyRange(e).left-60||value.x>enemyRange(e).right+60||Math.abs(value.y-e.baseY)>400||value.defeatAge<0||value.hp<0||value.hp>(e.type==='ant'?1:2)||!Number.isInteger(value.hp)||value.alive!==(value.hp>0)||value.hopAge<0)throw new TypeError('Inimigo salvo inválido.');return{...e,baseY:e.route?e.baseY:gardenSurfaceY(GARDEN_PLATFORM_BY_ID.get(e.supportId),value.x),x:value.x,y:value.y,hp:value.hp,alive:value.alive,direction:value.direction===1?1:-1,defeatAge:value.defeatAge,hopAge:value.hopAge,stompLock:clamp(Number(value.stompLock)||0,0,1),routeIndex:Number.isSafeInteger(value.routeIndex)?clamp(value.routeIndex,0,(e.route?.length??1)-1):0,attackPhase:['patrol','retreat','windup','charge'].includes(value.attackPhase)?value.attackPhase:'patrol',attackAge:clamp(Number(value.attackAge)||0,0,4),retreatDirection:value.retreatDirection===-1?-1:1};});
  out.defeated=out.enemies.filter(e=>!e.alive).length;
  if(saved.fairy&&finite([saved.fairy.x,saved.fairy.y,saved.fairy.idle,saved.fairy.progressX,saved.fairy.guideAge]))out.fairy={...out.fairy,x:clamp(saved.fairy.x,0,C.width),y:clamp(saved.fairy.y,-100,850),idle:clamp(saved.fairy.idle,0,20),progressX:clamp(saved.fairy.progressX,0,C.width),guideAge:clamp(saved.fairy.guideAge,0,5),mode:saved.fairy.mode==='guide'?'guide':'follow',target:supports.some(p=>p.id===saved.fairy.target)?saved.fairy.target:null};
  if(['RESCUING','DISORIENTED'].includes(out.stage)){
    const r=saved.recovery;if(!r||!r.from||!r.to||!finite([r.from.x,r.from.y,r.to.x,r.to.y])||!GARDEN_PLATFORM_BY_ID.has(r.to.id)||!['hurt','fall'].includes(r.kind))throw new TypeError('Resgate salvo inválido.');
    const target=GARDEN_PLATFORM_BY_ID.get(r.to.id);if(r.to.x<target.x||r.to.x>target.x+target.w||Math.abs(r.to.y-gardenContactHeight(target,out.player,r.to.x))>.001||r.from.x<0||r.from.x>C.width||Math.abs(r.from.y)>10000||target.type==='cloud')throw new TypeError('Destino de resgate inválido.');
    out.recovery={from:{x:r.from.x,y:r.from.y},to:{x:r.to.x,y:r.to.y,id:target.id},kind:r.kind};out.fairy.mode='rescue';
  }
  if(saved.version>=7)out.encounters=restoreGardenEncounters(saved.encounters,saved.version);
  if(out.encounters.panic&&out.stage!=='RUNNING')throw new TypeError('Pânico fora da jogabilidade.');
  if(difficulty==='EASY'&&out.stage==='GAME_OVER')beginRecovery(out,'fall',[]);
  out.defeated+=out.encounters.bees.filter(e=>!e.alive).length;
  if(saved.version>=8){
    const story=saved.story;
    if(!story||!Number.isInteger(story.openingIndex)||story.openingIndex<0||story.openingIndex>=GARDEN_OPENING.length||!Number.isInteger(story.endingIndex)||story.endingIndex<0||story.endingIndex>=GARDEN_ENDING.length||!Number.isFinite(story.cardAge)||story.cardAge<0||['openingDone','endingDone','seenOpening','seenEnding'].some(k=>typeof story[k]!=='boolean'))throw new TypeError('Leitura salva do jardim inválida.');
    out.story={...story};
    // A conclusão anterior ganha o novo desfecho sem repetir o percurso nem as falas já lidas.
    if(saved.version<=10&&out.stage==='COMPLETE'&&out.story.endingDone){out.story.endingIndex=10;out.story.cardAge=0;out.story.endingDone=false;out.story.seenEnding=false;}
  }else{
    const end=out.stage==='COMPLETE',cards=end?GARDEN_ENDING:GARDEN_OPENING;
    let elapsed=0,index=0;while(index<cards.length-1&&elapsed+cards[index].duration<=saved.age){elapsed+=cards[index++].duration;}
    out.story[end?'endingIndex':'openingIndex']=index;out.story.cardAge=Math.max(0,saved.age-elapsed);
    if(out.stage!=='INTRO'||saved.version===6||saved.age>=GARDEN_OPENING_DURATION){out.story.openingDone=true;out.story.seenOpening=true;if(out.stage==='INTRO')out.age=saved.version===6?saved.age:Math.max(0,saved.age-GARDEN_OPENING_DURATION);}
    if(end&&saved.age>=GARDEN_ENDING.reduce((n,c)=>n+c.duration,0)){out.story.endingDone=true;out.story.seenEnding=true;}
  }
  return out;
}
function fairyTick(s,dt,platforms){
  const f=s.fairy,p=s.player;
  if(f.idle>6||f.mode==='guide')platforms=gardenPlatforms(s.time,s,p.x,4000);
  if(p.x>f.progressX+35){f.progressX=p.x;f.idle=0;}else f.idle+=dt;
  if(f.mode==='guide'){
    f.guideAge+=dt;if(f.guideAge>3||f.idle<.2||!platforms.some(v=>v.id===f.target)){f.mode='follow';f.guideAge=0;f.idle=0;f.target=null;}
  }else if(f.idle>7&&s.stage==='RUNNING'){
    const next=platforms.filter(v=>v.x+v.w>p.x+80&&v.x>p.x-20).sort((a,b)=>a.x-b.x)[0];
    if(next){f.mode='guide';f.target=next.id;f.guideAge=0;}
  }
  const target=f.mode==='guide'?platforms.find(v=>v.id===f.target):null;
  const x=target?target.x+target.w/2:p.x+Math.sin(s.time*2)*13,y=target?gardenSurfaceY(target,x)-55:p.y-C.playerHeight-42+Math.sin(s.time*3)*6;
  const mix=1-Math.exp(-dt*4);f.x+=(x-f.x)*mix;f.y+=(y-f.y)*mix;
}
function enemyTick(e,s,dt){
  const old={x:e.x,y:e.y};e.stompLock=Math.max(0,e.stompLock-dt);
  if(!e.alive)return old;
  e.hopAge+=dt;
  if(e.route){
    const period=e.period*.85*(s.difficulty==='EASY'?1.2:1),a=(e.hopAge+e.phase)%period/period;
    const count=e.route.length,cycle=Math.floor((e.hopAge+e.phase)/period)%(2*(count-1)),index=cycle<count-1?cycle:2*(count-1)-cycle;
    const next=cycle<count-1?index+1:index-1,from=e.route[index],to=e.route[next];e.routeIndex=index;e.direction=to.x>from.x?1:-1;
    const t=clamp((a-.25)/.65,0,1);e.x=from.x+(to.x-from.x)*t;e.y=from.y+(to.y-from.y)*t-Math.sin(t*Math.PI)*128;
  }else{
    const angry=e.hp===1&&e.type==='caterpillar',range=enemyRange(e),distance=s.player.x-e.x;
    const engaged=Math.abs(distance)<(angry?680:360)&&Math.abs(s.player.y-e.y)<230;
    let speed=angry?Math.max(155,e.speed*2.7):e.speed*(e.type==='ant'?1.5:1.3);
    const bounds=angry||e.type==='ant'?range:{left:e.left,right:e.right};
    if(angry){
      e.attackAge+=dt;
      if(e.attackPhase==='retreat'){
        e.direction=e.retreatDirection;speed=300;
        const edge=e.direction>0?bounds.right-e.x:e.x-bounds.left;
        if(e.attackAge>.35&&(Math.abs(distance)>175||edge<6)||e.attackAge>1.15){e.attackPhase='windup';e.attackAge=0;}
      }else if(e.attackPhase==='windup'){
        e.direction=distance<0?-1:1;speed=0;
        if(e.attackAge>.26){e.attackPhase='charge';e.attackAge=0;}
      }else if(e.attackPhase==='charge'){
        speed=250;
        if(e.attackAge>1.3||e.direction*distance<-65){e.attackPhase='retreat';e.attackAge=0;e.retreatDirection=e.direction;}
      }else if(engaged&&Math.abs(distance)>15)e.direction=distance<0?-1:1;
    }else if(engaged&&Math.abs(distance)>15)e.direction=distance<0?-1:1;
    e.x+=e.direction*speed*dt*(s.difficulty==='EASY'?.8:1);
    if(e.x<bounds.left||e.x>bounds.right){
      e.x=clamp(e.x,bounds.left,bounds.right);e.direction*=-1;
      if(angry&&e.attackPhase==='retreat'){e.attackPhase='windup';e.attackAge=0;}
    }
    const home=GARDEN_PLATFORM_BY_ID.get(e.supportId);e.baseY=gardenSurfaceY(home,e.x);e.y=e.baseY;
    if(e.type==='ant'){const period=e.period*.8,phase=(e.hopAge+e.phase)%period;e.y-=phase<.8?Math.sin(phase/.8*Math.PI)*110:0;}

  }
  return old;
}
function tick(s,input,dt,events){
  s.time+=dt;s.age+=dt;s.player.animationTime=s.time;
  advanceGardenDefeats(s,dt);
  s.presentation.hurtRemaining=Math.max(0,(s.presentation.hurtRemaining||0)-dt);
  if(s.stage==='RUNNING'){
    s.presentation.hintRemaining=Math.max(0,s.presentation.hintRemaining-dt);
    const next=GARDEN_BEETLES.find(b=>!s.encounters.consumed.includes(b.id)&&b.x>=s.player.x&&b.x-s.player.x<780);
    if(next&&!s.presentation.beetleHintSeen){s.presentation.beetleHintSeen=true;s.presentation.hintRemaining=6;}
  }
  const advance=Boolean(input.advance)&&!s.storyHeld;s.storyHeld=Boolean(input.advance);
  const intro=s.stage==='INTRO',ending=s.stage==='COMPLETE',reading=intro&&!s.story.openingDone||ending&&!s.story.endingDone;
  if(reading){
    const cards=intro?GARDEN_OPENING:GARDEN_ENDING,indexKey=intro?'openingIndex':'endingIndex',doneKey=intro?'openingDone':'endingDone',seenKey=intro?'seenOpening':'seenEnding';
    s.story.cardAge+=dt;
    if(advance||s.story.cardAge>=cards[s.story[indexKey]].duration||input.skip&&s.story[seenKey]){
      if(input.skip&&s.story[seenKey]||s.story[indexKey]===cards.length-1){s.story[indexKey]=cards.length-1;s.story[doneKey]=true;s.story[seenKey]=true;if(intro)s.age=0;events.push({type:'scene-seen',scene:intro?'opening':'ending'});}
      else{s.story[indexKey]++;s.story.cardAge=0;}
    }
    fairyTick(s,dt,[]);return;
  }
  if(s.stage==='INTRO'){
    const t=clamp(s.age/3,0,1)*3,index=Math.min(2,Math.floor(t)),mix=t-index,a=GARDEN_HOME.steps[index],b=GARDEN_HOME.steps[index+1];
    Object.assign(s.player,{x:a.x+(b.x-a.x)*mix,y:a.y+(b.y-a.y)*mix,vx:(b.x-a.x),facing:1});
    if(s.age>=3){s.stage='RUNNING';s.age=0;s.player.vx=0;s.jumpHeld=Boolean(input.jump);}fairyTick(s,dt,[]);return;
  }
  if(s.stage==='FALLING'||s.stage==='GAME_OVER'){
    for(const e of s.enemies)if(Math.abs(e.x-s.player.x)<1100)enemyTick(e,s,dt);
    if(s.stage==='FALLING'){s.player.vy=Math.min(1500,s.player.vy+C.gravity*dt);s.player.y+=s.player.vy*dt;s.player.x=clamp(s.player.x+s.player.vx*dt,22,C.width-22);if(s.age>=2.4){s.stage='GAME_OVER';s.age=0;events.push({type:'gameover'});}}
    return;
  }
  if(s.stage==='RESCUING'||s.stage==='DISORIENTED'){
    const r=s.recovery,t=clamp(s.age/1.6,0,1),mix=t*t*(3-2*t);
    s.player.x=r.from.x+(r.to.x-r.from.x)*mix;s.player.y=r.from.y+(r.to.y-r.from.y)*mix-Math.sin(t*Math.PI)*130;
    s.fairy.x=s.player.x;s.fairy.y=s.player.y-125;
    if(t>=1){Object.assign(s.player,{x:r.to.x,y:r.to.y,vx:0,vy:0,onGround:true,support:r.to.id,terrain:GARDEN_PLATFORM_BY_ID.get(r.to.id).type});s.stage='RUNNING';s.age=0;s.recovery=null;s.immunity=4;s.hp=6;s.fairy.mode='follow';s.fairy.idle=0;s.fairy.progressX=s.player.x;s.trail=s.trail.filter(id=>{const p=GARDEN_PLATFORM_BY_ID.get(id);return p&&p.x<=s.player.x;});s.jumpHeld=Boolean(input.jump);}
    return;
  }
  if(s.stage!=='RUNNING'){fairyTick(s,dt,[]);return;}
  const p=s.player;
  for(const [id,armed]of Object.entries(s.clouds)){const duration=s.difficulty==='EASY'?3.8:2.8;if(s.time-armed>=duration+4)delete s.clouds[id];}
  const oldPlatforms=gardenPlatforms(s.time-dt,s,p.x,650),platforms=gardenPlatforms(s.time,s,p.x,650);
  const pressed=Boolean(input.jump)&&!s.jumpHeld,released=!input.jump&&s.jumpHeld;s.jumpHeld=Boolean(input.jump);
  s.jumpBuffer=pressed?.14:Math.max(0,s.jumpBuffer-dt);s.coyote=p.onGround?.12:Math.max(0,s.coyote-dt);s.immunity=Math.max(0,s.immunity-dt);
  const support=platforms.find(v=>v.id===p.support),from=oldPlatforms.find(v=>v.id===p.support);
  if(p.onGround&&!support){p.onGround=false;s.coyote=0;}
  if(p.onGround&&support){p.terrain=gardenTerrainAt(support,p.x);if(from){p.x+=support.x-from.x;p.y+=support.y-from.y;}const top=gardenContactHeight(support,p);if(Number.isFinite(top))p.y=top;}
  if(p.onGround&&support&&p.balancePose){const held=p.balancePose;p.balancePose=null;if(!Number.isFinite(gardenContactHeight(support,p)))p.balancePose=held;}
  tickGardenBeetles(s,dt,events);
  const previous={x:p.x,y:p.y};
  if(s.jumpBuffer>0&&s.coyote>0){
    const gravel=p.terrain==='gravel',variation=[.88,1.1,.96,1.16][s.jumps%4];
    p.vy=-C.jump*(gravel?variation:1);p.airSpeed=gravel?410*[1.04,.9,1.1,.95][s.jumps%4]:(GARDEN_TERRAINS[p.terrain]?.speed??C.speed);
    // Ao saltar da grama, o ar devolve mobilidade sem cancelar a marcha lenta em terra.
    if(p.terrain==='grass')p.airSpeed=C.speed;
    s.jumps++;p.balancePose=null;p.onGround=false;p.support=null;s.jumpBuffer=0;s.coyote=0;events.push({type:'jump'});
  }
  if(released&&p.vy<0)p.vy*=.55;
  const axis=s.encounters.panic?1:clamp(Number(input.x)||0,-1,1),speed=p.onGround?(GARDEN_TERRAINS[p.terrain]?.speed??C.speed):p.airSpeed;
  const desired=axis*speed;
  if(axis===0||p.terrain==='gravel')p.vx=desired;else p.vx+=clamp(desired-p.vx,-2400*dt,2400*dt);
  if(Math.abs(axis)>.1)p.facing=axis<0?-1:1;
  p.discomfort+=(Number(p.terrain==='grass'||p.terrain==='gravel')-p.discomfort)*Math.min(1,dt*8);
  p.x=clamp(p.x+p.vx*dt,22,C.width-22);
  p.vy=Math.min(1800,p.vy+C.gravity*dt);
  const walking=p.onGround&&support&&p.vy>=0,walkingHeight=walking?gardenContactHeight(support,p):Infinity;
  const nextY=(walking&&Number.isFinite(walkingHeight)&&Math.abs(walkingHeight-p.y)<24?walkingHeight:p.y)+p.vy*dt;
  // A lateral considera a altura no instante do contato, inclusive nas quinas do salto.
  for(const wall of platforms.filter(v=>v.ground)){
    const dx=p.x-previous.x;
    const edge=dx>0?wall.x-C.halfFoot:wall.x+wall.w+C.halfFoot;
    const fraction=dx===0?-1:(edge-previous.x)/dx;
    if(fraction<0||fraction>1||previous.y+(nextY-previous.y)*fraction<=wall.y)continue;
    p.x=edge;p.vx=0;
  }
  const contactPlayer=walking?{...p,onGround:true}:p;
  p.y=nextY;p.onGround=false;p.support=null;
  if(p.vy>=0){
    const landings=platforms.map(v=>{
      const old=oldPlatforms.find(o=>o.id===v.id)??v,height=gardenContactHeight(v,contactPlayer,p.x);
      if(!Number.isFinite(height))return null;
      if(walking&&(support.id===v.id||support.ground&&v.ground)&&Math.abs(height-previous.y)<24)return{platform:v,fraction:0,height};
      let oldHeight=gardenContactHeight(old,contactPlayer,previous.x);
      if(!Number.isFinite(oldHeight))oldHeight=gardenContactHeight(old,contactPlayer,p.x);
      if(!Number.isFinite(oldHeight))oldHeight=old.y+height-v.y;
      const oldRelative=previous.y-oldHeight,newRelative=p.y-height;
      if(oldRelative>2||newRelative<0)return null;
      const fraction=clamp(-oldRelative/Math.max(.0001,newRelative-oldRelative),0,1);
      const x=previous.x+(p.x-previous.x)*fraction,at={...v,x:old.x+(v.x-old.x)*fraction,y:old.y+(v.y-old.y)*fraction};
      return Number.isFinite(gardenContactHeight(at,contactPlayer,x))?{platform:v,fraction,height}:null;
    }).filter(Boolean).sort((a,b)=>a.fraction-b.fraction||a.height-b.height);
    const land=landings[0]?.platform;
    if(land){const landingPose=gardenGirlPose(contactPlayer);p.balancePose=null;p.y=landings[0].height;p.vy=0;p.onGround=true;p.support=land.id;p.terrain=gardenTerrainAt(land,p.x);if(land.hill||!land.ground){let exact=gardenContactHeight(land,p);if(!Number.isFinite(exact)&&!land.ground){p.balancePose=landingPose;exact=gardenContactHeight(land,p);}if(Number.isFinite(exact))p.y=exact;}if(land.type==='cloud'&&s.clouds[land.id]===undefined)s.clouds[land.id]=s.time;if(!land.rotating&&land.type!=='cloud'&&s.trail.at(-1)!==land.id){s.trail.push(land.id);s.trail=s.trail.slice(-8);}if(land.ground)s.safeGround=land.id;}
  }
  for(const e of s.enemies){
    if(Math.abs(e.x-p.x)>1100)continue;
    const old=enemyTick(e,s,dt);if(!e.alive)continue;
    const top=e.y-e.h,oldTop=old.y-e.h,oldRelative=previous.y-oldTop,newRelative=p.y-top;
    if(!e.stompLock&&oldRelative<=5&&newRelative>=0&&newRelative>oldRelative&&p.vy>=0){
      const fraction=clamp(-oldRelative/Math.max(.001,newRelative-oldRelative),0,1),x=previous.x+(p.x-previous.x)*fraction,enemyX=old.x+(e.x-old.x)*fraction;
      if(Math.abs(x-enemyX)<e.w/2+C.halfFoot){e.hp--;e.stompLock=.24;e.alive=e.hp>0;e.defeatAge=0;if(!e.alive)s.defeated++;else{const range=enemyRange(e),preferred=Math.abs(e.x-p.x)>8?Math.sign(e.x-p.x):p.facing;e.attackPhase='retreat';e.attackAge=0;e.retreatDirection=(preferred>0?range.right-e.x:e.x-range.left)>190?preferred:-preferred;e.direction=e.retreatDirection;}p.y=top;p.vy=-480;p.onGround=false;p.support=null;s.coyote=0;events.push({type:e.alive?'enrage':'stomp',enemy:e.id});continue;}
    }
    if(!s.immunity&&Math.abs(p.x-e.x)<e.w/2+16&&p.y>top+8&&p.y-C.playerHeight<e.y-6){if(hurtPlayer(s,e,events))return;}
  }
  for(const bee of s.encounters.bees){
    if(Math.abs(bee.homeX-p.x)>1000)continue;
    const old=tickGardenBee(bee,s,dt);if(!bee.alive)continue;
    const top=bee.y-bee.h+3,oldRelative=previous.y-(old.y-bee.h+3),newRelative=p.y-top;
    if(p.vy>=0&&oldRelative<=5&&newRelative>=0&&newRelative>oldRelative){
      const fraction=clamp(-oldRelative/Math.max(.001,newRelative-oldRelative),0,1),x=previous.x+(p.x-previous.x)*fraction,bx=old.x+(bee.x-old.x)*fraction;
      if(Math.abs(x-bx)<bee.w/2+C.halfFoot){bee.alive=false;bee.hp=0;bee.defeatAge=0;s.defeated++;p.y=top;p.vy=-480;p.onGround=false;p.support=null;s.coyote=0;events.push({type:'stomp',enemy:bee.id});continue;}
    }
    if(!s.immunity&&sweptGardenContact(previous,p,old,bee)){if(hurtPlayer(s,bee,events))return;}
  }
  for(const worm of s.encounters.worms){
    tickGardenWorm(worm,s,dt);
    if(worm.h>4&&!s.immunity&&sweptGardenContact(previous,p,worm,worm)){
      if(hurtPlayer(s,worm,events))return;
    }
  }
  if(p.y>C.waterY&&GARDEN_WATERS.some(v=>p.x>v.x&&p.x<v.x+v.w)||p.y>C.height+100){defeat(s,'fall',events);return;}
  if(p.onGround){const checkpoint=GARDEN_CHECKPOINTS.filter(x=>p.x>=x).at(-1);if(checkpoint>s.checkpoint){s.checkpoint=checkpoint;s.hp=s.difficulty==='EASY'?6:3;events.push({type:'checkpoint'});}}
  fairyTick(s,dt,platforms);
  if(p.onGround&&p.x>=C.goal){s.encounters.panic=null;s.encounters.exit=null;s.stage='COMPLETE';s.age=0;s.story.endingIndex=0;s.story.endingDone=false;s.story.cardAge=0;p.vx=0;events.push({type:'complete'});}
}
/** A simulação não usa relógio do navegador nem aleatoriedade; pausa não chama este método. */
export function stepGarden(state,input={},seconds=1/60,difficulty=state.difficulty){
  state.difficulty=difficulty==='EASY'?'EASY':'NORMAL';
  if(state.difficulty==='EASY'&&state.stage==='GAME_OVER')beginRecovery(state,'fall',[]);
  const events=[];let remaining=Math.max(0,Math.min(.2,Number.isFinite(seconds)?seconds:0));
  while(remaining>1e-9){const dt=Math.min(C.step,remaining);tick(state,input,dt,events);remaining-=dt;}return events;
}
