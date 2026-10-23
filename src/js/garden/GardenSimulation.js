import {GARDEN as C,GARDEN_ENEMIES,GARDEN_CHECKPOINTS,GARDEN_LEGACY_CHECKPOINTS,GARDEN_TERRAINS,GARDEN_PLATFORM_BY_ID,GARDEN_WATERS,gardenPlatforms,cloudStatus} from './GardenLevel.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const stages=['INTRO','RUNNING','RESCUING','DISORIENTED','COMPLETE','GAME_OVER'];
/** A perseguição usa o chão de origem completo, sem atravessar rios ou buracos. */
function enemyRange(enemy){
  const support=GARDEN_PLATFORM_BY_ID.get(enemy.supportId);
  return support?{left:support.x+45,right:support.x+support.w-45}:enemy;
}
/** Domínio puro em segundos, incluindo fada, terrenos, nuvens e recuperação EASY. */
export function createGardenState(difficulty='NORMAL'){
  return {version:4,difficulty:difficulty==='EASY'?'EASY':'NORMAL',stage:'INTRO',age:0,time:0,hp:difficulty==='EASY'?6:3,checkpoint:120,defeated:0,
    jumpHeld:false,jumpBuffer:0,coyote:0,immunity:0,jumps:0,clouds:{},trail:['entrada'],safeGround:'entrada',recovery:null,
    player:{x:120,y:C.ground,vx:0,vy:0,facing:1,onGround:true,support:'entrada',terrain:'wood',airSpeed:C.speed,discomfort:0},
    fairy:{x:120,y:C.ground-135,mode:'follow',idle:0,progressX:120,guideAge:0,target:null},
    enemies:GARDEN_ENEMIES.map(e=>({...e,hp:e.type==='caterpillar'?2:1,direction:-1,alive:true,defeatAge:0,stompLock:0,hopAge:0,routeIndex:0}))};
}
function recoverTarget(s,kind){
  if(kind==='hurt'){
    const history=s.trail.map(id=>GARDEN_PLATFORM_BY_ID.get(id)).filter(p=>p&&p.type!=='cloud');
    const target=history[Math.max(0,history.length-3)];if(target)return{x:clamp(s.player.x,target.x+50,target.x+target.w-50),y:target.y,id:target.id};
  }
  const ground=GARDEN_PLATFORM_BY_ID.get(s.safeGround)||GARDEN_PLATFORM_BY_ID.get('entrada');
  return{x:clamp(s.player.x,ground.x+60,ground.x+ground.w-60),y:ground.y,id:ground.id};
}
function beginRecovery(s,kind,events){
  s.recovery={from:{x:s.player.x,y:Math.min(s.player.y,730)},to:recoverTarget(s,kind),kind};
  s.stage=kind==='hurt'?'DISORIENTED':'RESCUING';s.age=0;s.fairy.mode='rescue';s.fairy.target=null;
  s.hp=6;s.jumpBuffer=0;s.coyote=0;s.player.vx=0;s.player.vy=0;events.push({type:kind==='hurt'?'dazed':'rescue'});
}
function defeat(s,kind,events){
  if(s.difficulty==='EASY'){beginRecovery(s,kind,events);return;}
  s.hp=0;s.stage='GAME_OVER';s.age=0;events.push({type:kind});
}
/** Uma tentativa nova conserva os inimigos vencidos e retoma chão firme no checkpoint. */
export function retryGarden(s,difficulty=s.difficulty){
  if(s.stage!=='GAME_OVER')return false;
  const enemies=s.enemies.map(e=>({...e})),checkpoint=s.checkpoint;
  Object.assign(s,createGardenState(difficulty));s.stage='RUNNING';s.checkpoint=checkpoint;s.enemies=enemies;s.defeated=enemies.filter(e=>!e.alive).length;
  const ground=[...GARDEN_PLATFORM_BY_ID.values()].find(p=>p.ground&&checkpoint>=p.x&&checkpoint<=p.x+p.w);
  Object.assign(s.player,{x:checkpoint,y:ground?.y??C.ground,support:ground?.id??'entrada',terrain:ground?.type??'wood'});
  s.safeGround=s.player.support;s.trail=[s.player.support];s.immunity=3;s.fairy.x=checkpoint;s.fairy.progressX=checkpoint;return true;
}
/** Migra o mapa antigo para o início seguro; conclusão antiga chega ao piquenique novo. */
export function restoreGardenState(saved,difficulty='NORMAL'){
  if(!saved||![1,2,3,4].includes(saved.version)||!stages.includes(saved.stage))throw new TypeError('Save do jardim inválido.');
  const finite=values=>values.every(Number.isFinite);
  if(!saved.player||!finite([saved.age,saved.time,saved.hp,saved.checkpoint,saved.player.x,saved.player.y,saved.player.vx,saved.player.vy])||saved.time<0||saved.age<0)throw new TypeError('Estado do jardim incompatível.');
  const out=createGardenState(difficulty);
  if(saved.version===1){if(saved.stage==='COMPLETE'){out.stage='COMPLETE';Object.assign(out.player,{x:C.goal,y:C.ground,support:'arvore'});}return out;}
  // As revisões longas v2/v3 retomam o setor equivalente no mapa de oito minutos, preservando inimigos vencidos.
  if(saved.version===2||saved.version===3){
    if(!GARDEN_LEGACY_CHECKPOINTS.has(`${saved.version}:${saved.checkpoint}`)||!Array.isArray(saved.enemies))throw new TypeError('Estado antigo do jardim incompatível.');
    out.stage=saved.stage==='COMPLETE'?'COMPLETE':saved.stage==='INTRO'?'INTRO':'RUNNING';out.checkpoint=GARDEN_LEGACY_CHECKPOINTS.get(`${saved.version}:${saved.checkpoint}`);out.hp=clamp(Math.floor(saved.hp),1,difficulty==='EASY'?6:3);
    const x=out.stage==='COMPLETE'?C.goal:out.checkpoint,ground=[...GARDEN_PLATFORM_BY_ID.values()].find(p=>p.ground&&x>=p.x&&x<p.x+p.w);
    Object.assign(out.player,{x,y:ground.y,support:ground.id,terrain:ground.type});out.safeGround=ground.id;out.trail=[ground.id];Object.assign(out.fairy,{x,y:ground.y-135,progressX:x});
    for(const old of saved.enemies)if(!old||typeof old.id!=='string'||!Number.isInteger(old.hp)||old.hp<0||old.hp>2||old.alive!==(old.hp>0))throw new TypeError('Inimigo antigo inválido.');
    out.enemies=out.enemies.map(e=>{const legacyId=e.id.replace(/^trecho-(\d+)/,(_,n)=>'trecho-'+(Math.floor(Number(n)/2)*5+(Number(n)%2?3:0))),old=saved.enemies.find(v=>v.id===legacyId);return old&&old.hp<=e.hp?{...e,hp:old.hp,alive:old.alive}:e;});out.defeated=out.enemies.filter(e=>!e.alive).length;return out;
  }
  if(saved.player.x<0||saved.player.x>C.width||Math.abs(saved.player.y)>10000||!GARDEN_CHECKPOINTS.includes(saved.checkpoint)||!Array.isArray(saved.enemies)||saved.enemies.length!==out.enemies.length)throw new TypeError('Estado do jardim incompatível.');
  out.stage=saved.stage;out.time=saved.time;out.age=saved.age;out.hp=clamp(Math.floor(saved.hp),0,difficulty==='EASY'?6:3);out.checkpoint=saved.checkpoint;
  out.immunity=clamp(Number.isFinite(saved.immunity)?saved.immunity:0,0,4);out.jumps=Number.isSafeInteger(saved.jumps)&&saved.jumps>=0?saved.jumps:0;
  if(!saved.clouds||typeof saved.clouds!=='object'||Array.isArray(saved.clouds))throw new TypeError('Nuvens salvas inválidas.');
  for(const [id,time]of Object.entries(saved.clouds)){if(GARDEN_PLATFORM_BY_ID.get(id)?.type!=='cloud'||!Number.isFinite(time)||time<0||time>saved.time)throw new TypeError('Relógio de nuvem inválido.');out.clouds[id]=time;}
  const supports=gardenPlatforms(out.time,out);
  out.player={...out.player,x:saved.player.x,y:saved.player.y,vx:clamp(saved.player.vx,-500,500),vy:clamp(saved.player.vy,-1000,1800),facing:saved.player.facing===-1?-1:1,onGround:Boolean(saved.player.onGround),support:supports.some(p=>p.id===saved.player.support)?saved.player.support:null,terrain:Object.hasOwn(GARDEN_TERRAINS,saved.player.terrain)?saved.player.terrain:'soil',airSpeed:clamp(Number(saved.player.airSpeed)||C.speed,100,480),discomfort:clamp(Number(saved.player.discomfort)||0,0,1)};
  out.trail=Array.isArray(saved.trail)?saved.trail.filter(id=>GARDEN_PLATFORM_BY_ID.has(id)).slice(-8):['entrada'];
  out.safeGround=GARDEN_PLATFORM_BY_ID.get(saved.safeGround)?.ground?saved.safeGround:'entrada';
  out.enemies=out.enemies.map((e,i)=>{const value=saved.enemies[i];if(!value||value.id!==e.id||typeof value.alive!=='boolean'||!finite([value.x,value.y,value.defeatAge,value.hp,value.hopAge])||value.x<enemyRange(e).left-60||value.x>enemyRange(e).right+60||Math.abs(value.y-e.baseY)>400||value.defeatAge<0||value.hp<0||value.hp>(e.type==='ant'?1:2)||!Number.isInteger(value.hp)||value.alive!==(value.hp>0)||value.hopAge<0)throw new TypeError('Inimigo salvo inválido.');return{...e,x:value.x,y:value.y,hp:value.hp,alive:value.alive,direction:value.direction===1?1:-1,defeatAge:value.defeatAge,hopAge:value.hopAge,stompLock:clamp(Number(value.stompLock)||0,0,1),routeIndex:Number.isSafeInteger(value.routeIndex)?clamp(value.routeIndex,0,(e.route?.length??1)-1):0};});
  out.defeated=out.enemies.filter(e=>!e.alive).length;
  if(saved.fairy&&finite([saved.fairy.x,saved.fairy.y,saved.fairy.idle,saved.fairy.progressX,saved.fairy.guideAge]))out.fairy={...out.fairy,x:clamp(saved.fairy.x,0,C.width),y:clamp(saved.fairy.y,-100,850),idle:clamp(saved.fairy.idle,0,20),progressX:clamp(saved.fairy.progressX,0,C.width),guideAge:clamp(saved.fairy.guideAge,0,5),mode:saved.fairy.mode==='guide'?'guide':'follow',target:supports.some(p=>p.id===saved.fairy.target)?saved.fairy.target:null};
  if(['RESCUING','DISORIENTED'].includes(out.stage)){
    const r=saved.recovery;if(!r||!r.from||!r.to||!finite([r.from.x,r.from.y,r.to.x,r.to.y])||!GARDEN_PLATFORM_BY_ID.has(r.to.id)||!['hurt','fall'].includes(r.kind))throw new TypeError('Resgate salvo inválido.');
    const target=GARDEN_PLATFORM_BY_ID.get(r.to.id);if(r.to.x<target.x||r.to.x>target.x+target.w||r.to.y!==target.y||r.from.x<0||r.from.x>C.width||Math.abs(r.from.y)>10000||target.type==='cloud')throw new TypeError('Destino de resgate inválido.');
    out.recovery={from:{x:r.from.x,y:r.from.y},to:{x:r.to.x,y:r.to.y,id:target.id},kind:r.kind};out.fairy.mode='rescue';
  }
  if(difficulty==='EASY'&&out.stage==='GAME_OVER')beginRecovery(out,'fall',[]);
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
  const x=target?target.x+target.w/2:p.x+Math.sin(s.time*2)*13,y=target?target.y-55:p.y-C.playerHeight-42+Math.sin(s.time*3)*6;
  const mix=1-Math.exp(-dt*4);f.x+=(x-f.x)*mix;f.y+=(y-f.y)*mix;
}
function enemyTick(e,s,dt){
  const old={x:e.x,y:e.y};e.stompLock=Math.max(0,e.stompLock-dt);
  if(!e.alive){e.defeatAge+=dt;return old;}
  e.hopAge+=dt;
  if(e.route){
    const period=e.period*.85*(s.difficulty==='EASY'?1.2:1),a=(e.hopAge+e.phase)%period/period;
    const count=e.route.length,cycle=Math.floor((e.hopAge+e.phase)/period)%(2*(count-1)),index=cycle<count-1?cycle:2*(count-1)-cycle;
    const next=cycle<count-1?index+1:index-1,from=e.route[index],to=e.route[next];e.routeIndex=index;e.direction=to.x>from.x?1:-1;
    const t=clamp((a-.25)/.65,0,1);e.x=from.x+(to.x-from.x)*t;e.y=from.y+(to.y-from.y)*t-Math.sin(t*Math.PI)*128;
  }else{
    const angry=e.hp===1&&e.type==='caterpillar',range=enemyRange(e),distance=s.player.x-e.x;
    const engaged=Math.abs(distance)<(angry?680:310)&&Math.abs(s.player.y-e.baseY)<230;
    if(engaged&&Math.abs(distance)>15)e.direction=distance<0?-1:1;
    const bounds=angry||e.type==='ant'?range:{left:e.left,right:e.right};
    const speed=angry?Math.max(125,e.speed*2.4):e.speed*(e.type==='ant'?1.3:1.15);
    e.x+=e.direction*speed*dt*(s.difficulty==='EASY'?.8:1);
    if(e.x<bounds.left||e.x>bounds.right){e.x=clamp(e.x,bounds.left,bounds.right);e.direction*=-1;}
    if(e.type==='ant'){const period=e.period*.85,phase=(e.hopAge+e.phase)%period;e.y=e.baseY-(phase<.8?Math.sin(phase/.8*Math.PI)*110:0);}
  }
  return old;
}
function tick(s,input,dt,events){
  s.time+=dt;s.age+=dt;
  if(s.stage==='INTRO'){if(s.age>=3){s.stage='RUNNING';s.age=0;s.jumpHeld=Boolean(input.jump);}fairyTick(s,dt,[]);return;}
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
  if(p.onGround&&support){p.terrain=support.type;if(from){p.x+=support.x-from.x;p.y+=support.y-from.y;}}
  const previous={x:p.x,y:p.y};
  if(s.jumpBuffer>0&&s.coyote>0){
    const gravel=p.terrain==='gravel',variation=[.88,1.1,.96,1.16][s.jumps%4];
    p.vy=-C.jump*(gravel?variation:1);p.airSpeed=gravel?410*[1.04,.9,1.1,.95][s.jumps%4]:(GARDEN_TERRAINS[p.terrain]?.speed??C.speed);
    // Ao saltar da grama, o ar devolve mobilidade sem cancelar a marcha lenta em terra.
    if(p.terrain==='grass')p.airSpeed=C.speed;
    s.jumps++;p.onGround=false;p.support=null;s.jumpBuffer=0;s.coyote=0;events.push({type:'jump'});
  }
  if(released&&p.vy<0)p.vy*=.55;
  const axis=clamp(Number(input.x)||0,-1,1),speed=p.onGround?(GARDEN_TERRAINS[p.terrain]?.speed??C.speed):p.airSpeed;
  const desired=axis*speed;
  if(axis===0||p.terrain==='gravel')p.vx=desired;else p.vx+=clamp(desired-p.vx,-2400*dt,2400*dt);
  if(Math.abs(axis)>.1)p.facing=axis<0?-1:1;
  p.discomfort+=(Number(p.terrain==='grass'||p.terrain==='gravel')-p.discomfort)*Math.min(1,dt*8);
  p.x=clamp(p.x+p.vx*dt,22,C.width-22);
  // Faces de terra são sólidas: é preciso elevar os pés antes de atravessar um patamar.
  for(const wall of platforms.filter(v=>v.ground)){
    if(p.y<=wall.y+2)continue;
    if(p.vx>0&&previous.x+C.halfFoot<=wall.x+.01&&p.x+C.halfFoot>wall.x){p.x=wall.x-C.halfFoot;p.vx=0;}
    else if(p.vx<0&&previous.x-C.halfFoot>=wall.x+wall.w-.01&&p.x-C.halfFoot<wall.x+wall.w){p.x=wall.x+wall.w+C.halfFoot;p.vx=0;}
  }
  p.vy=Math.min(1800,p.vy+C.gravity*dt);p.y+=p.vy*dt;p.onGround=false;p.support=null;
  if(p.vy>=0){
    const landings=platforms.map(v=>{const old=oldPlatforms.find(o=>o.id===v.id)??v,oldRelative=previous.y-old.y,newRelative=p.y-v.y;if(oldRelative>2||newRelative<0)return null;const fraction=clamp(-oldRelative/Math.max(.0001,newRelative-oldRelative),0,1),x=previous.x+(p.x-previous.x)*fraction,left=old.x+(v.x-old.x)*fraction;const inset=v.ground?0:v.w*.06;return x>=left+inset&&x<=left+v.w-inset?{platform:v,fraction}:null;}).filter(Boolean).sort((a,b)=>a.fraction-b.fraction);
    const land=landings[0]?.platform;
    if(land){p.y=land.y;p.vy=0;p.onGround=true;p.support=land.id;p.terrain=land.type;if(land.type==='cloud'&&s.clouds[land.id]===undefined)s.clouds[land.id]=s.time;if(!land.rotating&&land.type!=='cloud'&&s.trail.at(-1)!==land.id){s.trail.push(land.id);s.trail=s.trail.slice(-8);}if(land.ground)s.safeGround=land.id;}
  }
  for(const e of s.enemies){
    if(Math.abs(e.x-p.x)>1100)continue;
    const old=enemyTick(e,s,dt);if(!e.alive)continue;
    const top=e.y-e.h,oldTop=old.y-e.h,oldRelative=previous.y-oldTop,newRelative=p.y-top;
    if(!e.stompLock&&oldRelative<=5&&newRelative>=0&&newRelative>oldRelative&&p.vy>=0){
      const fraction=clamp(-oldRelative/Math.max(.001,newRelative-oldRelative),0,1),x=previous.x+(p.x-previous.x)*fraction,enemyX=old.x+(e.x-old.x)*fraction;
      if(Math.abs(x-enemyX)<e.w/2+C.halfFoot){e.hp--;e.stompLock=.24;e.alive=e.hp>0;e.defeatAge=0;if(!e.alive)s.defeated++;p.y=top;p.vy=-480;p.onGround=false;p.support=null;s.coyote=0;events.push({type:e.alive?'enrage':'stomp',enemy:e.id});continue;}
    }
    if(!s.immunity&&Math.abs(p.x-e.x)<e.w/2+16&&p.y>top+8&&p.y-C.playerHeight<e.y-6){s.hp--;s.immunity=2;p.vy=-280;p.onGround=false;p.support=null;events.push({type:'hurt'});if(s.hp<=0){defeat(s,'hurt',events);return;}}
  }
  if(p.y>C.waterY&&GARDEN_WATERS.some(v=>p.x>v.x&&p.x<v.x+v.w)||p.y>C.height+100){defeat(s,'fall',events);return;}
  if(p.onGround){const checkpoint=GARDEN_CHECKPOINTS.filter(x=>p.x>=x).at(-1);if(checkpoint>s.checkpoint){s.checkpoint=checkpoint;s.hp=s.difficulty==='EASY'?6:3;events.push({type:'checkpoint'});}}
  fairyTick(s,dt,platforms);
  if(p.onGround&&p.x>=C.goal){s.stage='COMPLETE';s.age=0;p.vx=0;events.push({type:'complete'});}
}
/** A simulação não usa relógio do navegador nem aleatoriedade; pausa não chama este método. */
export function stepGarden(state,input={},seconds=1/60,difficulty=state.difficulty){
  state.difficulty=difficulty==='EASY'?'EASY':'NORMAL';
  if(state.difficulty==='EASY'&&state.stage==='GAME_OVER')beginRecovery(state,'fall',[]);
  const events=[];let remaining=Math.max(0,Math.min(.2,Number.isFinite(seconds)?seconds:0));
  while(remaining>1e-9){const dt=Math.min(C.step,remaining);tick(state,input,dt,events);remaining-=dt;}return events;
}
