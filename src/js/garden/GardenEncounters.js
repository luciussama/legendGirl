import {GARDEN_PLATFORM_BY_ID,gardenSurfaceY} from './GardenLevel.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
// Encontros distribuídos em chão amplo, fora dos primeiros saltos e das rodas.
const homes=['primeiros-bichinhos','trecho-0-clareira','trecho-2-clareira','trecho-6-clareira-relevo-1','trecho-8-clareira'];
const wormHomes=['pedrinhas-da-roda','trecho-2-pedrinhas','trecho-6-pedrinhas','trecho-8-pedrinhas'];
export const GARDEN_BEETLES=Object.freeze([
  {id:'besouro-riacho-1',x:GARDEN_PLATFORM_BY_ID.get('trecho-0-margem').x+120},
  {id:'besouro-riacho-2',x:GARDEN_PLATFORM_BY_ID.get('trecho-4-margem').x+120},
  {id:'besouro-nuvens-finais',x:GARDEN_PLATFORM_BY_ID.get('nuvem-final-0').x-240}
].map(Object.freeze));
export function createGardenEncounters(){
  return {consumed:[],panic:null,exit:null,bees:homes.map((id,i)=>{const p=GARDEN_PLATFORM_BY_ID.get(id),x=p.x+p.w*.5,y=gardenSurfaceY(p,x)-180;return{id:'abelha-'+i,type:'bee',supportId:id,homeX:x,homeY:y,otherX:Math.max(p.x+60,x-360),otherY:y,perch:0,arcDepth:0,duration:1.25,x,y,w:62,h:32,alive:true,hp:1,phase:'patrol',age:0,cooldown:.8,defeatAge:0,fromX:x,fromY:y,targetX:x,targetY:y,direction:-1};}),worms:wormHomes.map((id,i)=>{const p=GARDEN_PLATFORM_BY_ID.get(id),x=p.x+Math.min(180,p.w*.65);return{id:'minhoca-'+i,type:'worm',supportId:id,x,y:gardenSurfaceY(p,x),w:32,h:0,exposure:0,emerging:false,alive:true};})};
}
/** O buraco é decorativo: o chão não desaparece quando a minhoca emerge. */
export function tickGardenWorm(e,s,dt){
  const distance=Math.abs(s.player.x-e.x);
  if(distance<280)e.emerging=true;else if(distance>360)e.emerging=false;
  e.exposure=clamp(e.exposure+(e.emerging?1:-1)*dt/.22,0,1);e.h=Math.max(0,e.exposure*72-9);
}
/** O besouro é inofensivo: só a direção muda, durante seis segundos ativos. */
export function tickGardenBeetles(s,dt,events){
  const e=s.encounters,p=s.player;
  if(e.exit){e.exit.age+=dt;e.exit.x-=240*dt;e.exit.y-=170*dt;if(e.exit.age>=1)e.exit=null;}
  if(e.panic){
    const q=e.panic;q.remaining=Math.max(0,q.remaining-dt);q.elapsed=6-q.remaining;
    const mix=1-Math.exp(-dt*8);q.x+=(p.x-135-q.x)*mix;q.y+=(p.y-70+Math.sin(s.time*16)*6-q.y)*mix;
    if(q.remaining<=1e-8){e.exit={x:q.x,y:q.y,age:0};events.push({type:'calm',enemy:q.id});e.panic=null;}
    return;
  }
  const next=GARDEN_BEETLES.find(b=>!e.consumed.includes(b.id)&&p.onGround&&p.x>=b.x&&p.x<b.x+220);
  if(next){e.consumed.push(next.id);e.exit=null;e.panic={id:next.id,remaining:6,elapsed:0,x:p.x-160,y:p.y-70};events.push({type:'panic',enemy:next.id});}
}
/** Nova tentativa rearma os encontros à frente; não dispara durante o resgate. */
export function resetGardenPanic(s,targetX){
  const e=s.encounters;e.panic=null;e.exit=null;e.consumed=e.consumed.filter(id=>GARDEN_BEETLES.find(b=>b.id===id).x<targetX-220);
  for(const bee of e.bees)if(bee.alive){Object.assign(bee,{x:bee.homeX,y:bee.homeY,perch:0,phase:'patrol',age:0,cooldown:1,arcDepth:0,duration:1.25});}
}
/** Rasantes alternam A/B: repouso fixo no ar e parábola baixa em ambos os sentidos. */
export function tickGardenBee(e,s,dt){
  const old={x:e.x,y:e.y};
  if(!e.alive){e.defeatAge+=dt;return old;}
  e.age+=dt;e.cooldown=Math.max(0,e.cooldown-dt);
  if(e.phase==='patrol'){
    // Repouso significa posição fixa; o bater das asas continua no renderizador.
    if(!e.cooldown&&Math.abs(s.player.x-e.x)<320&&Math.abs(s.player.y-e.y)<330){e.phase='prepare';e.age=0;e.direction=(e.perch===0?e.otherX:e.homeX)<e.x?-1:1;}
  }else if(e.phase==='prepare'){
    if(e.age>=.5){
      e.phase='dive';e.age=0;e.fromX=e.x;e.fromY=e.y;e.targetX=e.perch===0?e.otherX:e.homeX;e.targetY=e.perch===0?e.otherY:e.homeY;e.duration=1.25;
      const ground=GARDEN_PLATFORM_BY_ID.get(e.supportId),middle=(e.fromX+e.targetX)/2;
      e.arcDepth=Math.max(0,gardenSurfaceY(ground,middle)-12-(e.fromY+e.targetY)/2);
    }
  }else if(e.phase==='dive'){
    const t=clamp(e.age/e.duration,0,1);e.x=e.fromX+(e.targetX-e.fromX)*t;e.y=e.fromY+(e.targetY-e.fromY)*t+4*t*(1-t)*e.arcDepth;
    if(t===1){e.x=e.targetX;e.y=e.targetY;e.perch=1-e.perch;e.phase='patrol';e.age=0;e.cooldown=1.8;}
  }
  return old;
}
/** Varredura relativa evita atravessar um corpo em movimento entre dois quadros. */
export function sweptGardenContact(previous,player,old,enemy){
  const a=[previous.x-old.x,previous.y-old.y],b=[player.x-enemy.x,player.y-enemy.y],min=[-enemy.w/2-16,-enemy.h+8],max=[enemy.w/2+16,86];
  let enter=0,leave=1;
  for(let i=0;i<2;i++){const d=b[i]-a[i];if(Math.abs(d)<1e-9){if(a[i]<min[i]||a[i]>max[i])return false;}else{const t0=(min[i]-a[i])/d,t1=(max[i]-a[i])/d;enter=Math.max(enter,Math.min(t0,t1));leave=Math.min(leave,Math.max(t0,t1));}}
  return enter<=leave;
}
export function restoreGardenEncounters(saved,version=9){
  const out=createGardenEncounters();
  if(!saved||!Array.isArray(saved.bees)||saved.bees.length!==out.bees.length)throw new TypeError('Encontros do jardim inválidos.');
  out.bees=out.bees.map((e,i)=>{
    const b=saved.bees[i],numbers=['x','y','age','cooldown','defeatAge','fromX','fromY','targetX','targetY'];
    if(!b||b.id!==e.id||typeof b.alive!=='boolean'||b.hp!==(b.alive?1:0)||!['patrol','prepare','dive','return'].includes(b.phase)||numbers.some(k=>!Number.isFinite(b[k]))||Math.abs(b.x-e.homeX)>700||Math.abs(b.y-e.homeY)>400||b.age<0||b.age>100000||b.cooldown<0||b.cooldown>2||b.defeatAge<0||Math.abs(b.fromX-e.homeX)>700||Math.abs(b.targetX-e.homeX)>700||Math.abs(b.fromY-e.homeY)>400||Math.abs(b.targetY-e.homeY)>400)throw new TypeError('Abelha salva inválida.');
    const bee={...e,...Object.fromEntries(numbers.map(k=>[k,b[k]])),alive:b.alive,hp:b.hp,phase:b.phase,direction:b.direction===1?1:-1};
    if(version>=9){
      if(![0,1].includes(b.perch)||!['otherX','otherY','arcDepth','duration'].every(k=>Number.isFinite(b[k]))||Math.abs(b.otherX-e.otherX)>.001||Math.abs(b.otherY-e.otherY)>.001||b.arcDepth<0||b.arcDepth>500||b.duration<.1||b.duration>1.25||b.phase==='return')throw new TypeError('Trajeto alternado da abelha inválido.');
      Object.assign(bee,{perch:b.perch,otherX:b.otherX,otherY:b.otherY,arcDepth:b.arcDepth,duration:b.duration});
    }else if(['dive','return'].includes(bee.phase)){
      // Migra um voo antigo a partir da posição atual, sem desaparecer no restore.
      const returning=bee.phase==='return';Object.assign(bee,{phase:'dive',perch:returning?1:0,fromX:bee.x,fromY:bee.y,targetX:returning?e.homeX:e.otherX,targetY:e.homeY,duration:Math.max(.1,(returning?.85:1.25)-bee.age),age:0});
      bee.arcDepth=Math.max(0,gardenSurfaceY(GARDEN_PLATFORM_BY_ID.get(e.supportId),(bee.fromX+bee.targetX)/2)-12-(bee.fromY+bee.targetY)/2);
    }
    return bee;
  });
  if(saved.worms!==undefined){
    if(!Array.isArray(saved.worms)||saved.worms.length!==out.worms.length)throw new TypeError('Minhocas salvas inválidas.');
    out.worms=out.worms.map((e,i)=>{const w=saved.worms[i];if(!w||w.id!==e.id||typeof w.emerging!=='boolean'||!Number.isFinite(w.exposure)||w.exposure<0||w.exposure>1)throw new TypeError('Minhoca salva inválida.');return{...e,emerging:w.emerging,exposure:w.exposure,h:Math.max(0,w.exposure*72-9)};});
  }
  if(saved.consumed!==undefined){
    if(!Array.isArray(saved.consumed)||new Set(saved.consumed).size!==saved.consumed.length||saved.consumed.some(id=>!GARDEN_BEETLES.some(b=>b.id===id)))throw new TypeError('Encontros consumidos inválidos.');out.consumed=[...saved.consumed];
  }
  if(saved.panic){
    const p=saved.panic;if(!out.consumed.includes(p.id)||!['x','y','remaining','elapsed'].every(k=>Number.isFinite(p[k]))||p.remaining<=0||p.remaining>6||Math.abs(p.elapsed+p.remaining-6)>.001||p.x<0||p.x>50000||Math.abs(p.y)>2000)throw new TypeError('Pânico salvo inválido.');out.panic={id:p.id,remaining:p.remaining,elapsed:p.elapsed,x:p.x,y:p.y};
  }
  if(saved.exit){const e=saved.exit;if(!['x','y','age'].every(k=>Number.isFinite(e[k]))||e.age<0||e.age>1||e.x<0||e.x>50000||Math.abs(e.y)>2000)throw new TypeError('Saída de besouro inválida.');out.exit={x:e.x,y:e.y,age:e.age};}
  return out;
}
