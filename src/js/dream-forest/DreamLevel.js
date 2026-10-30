import {DREAM_INSECTS} from './DreamArt.js';
/** Geometria do sonho em Canvas 2D; todas as posições móveis são funções do tempo salvo. */
export const DREAM = Object.freeze({version:3,height:900,grassRoot:1800,gravity:900,speed:230,jump:470,climbSpeed:145,bodyHeight:88,bodyRadius:16,cell:600});
export const DREAM_SECTIONS = Object.freeze([
  {name:'Onde a grama toca a lua',kind:'grass',count:24},
  {name:'O sopro entre as folhas',kind:'wind',count:25},
  {name:'Carapaças à deriva',kind:'beetle',count:4,span:9020},
  {name:'Asas sobre o abismo',kind:'bee',count:22},
  {name:'Fios entre as nuvens',kind:'web',count:6},
  {name:'Os galhos que o vento embala',kind:'branch',count:2}
]);
const objects=[];let cursor=0;
for(const [section,def] of DREAM_SECTIONS.entries()){
  def.start=cursor;
  if(def.kind==='web'){
    objects.push({id:'rest-4',kind:'leaf',x:cursor,y:650,w:360,h:120,checkpoint:true,section});
    cursor+=540;
    for(let i=0;i<def.count;i++){objects.push({id:'web-'+i,kind:'web',x:cursor,y:-500,w:0,h:1500,period:9,phase:-i*1.8,section,spiderW:140,spiderH:84});cursor+=310;}
    cursor=objects.at(-1).x+220;continue;
  }
  if(def.kind==='branch'){
    objects.push({id:'rest-5',kind:'branch',x:cursor,y:570,w:560,h:200,checkpoint:true,section,amplitude:14,period:9,phase:.5});cursor+=620;
    for(let i=0;i<def.count;i++){objects.push({id:'branch-'+i,kind:'branch',x:cursor,y:[535,590][i],w:460,h:180,section,amplitude:26,period:8+i,phase:1.2+i*1.3});cursor+=520;}
    continue;
  }
  objects.push({id:'rest-'+section,kind:'leaf',x:cursor,y:650,w:360,h:120,checkpoint:true,section});
  cursor+=420;
  for(let i=0;i<def.count;i++){
  let kind=def.kind==='beetle'?'beetle':def.kind==='bee'?(i%3===0?'bee':'grass'):def.kind==='worm'?(i%4===0?'worm':'grass'):def.kind==='mixed'?['grass','grass','grass','ant','grass','bee'][i%6]:'grass';
  const moving=kind!=='grass',cycle=i%6,width=moving?(kind==='beetle'?300:kind==='worm'?310:250):30;
  objects.push({id:'dream-'+section+'-'+i,kind,x:cursor,y:kind==='beetle'?[500,300,540,360][i]:moving?460+cycle*20:180+cycle*33,w:width,h:moving?width*DREAM_INSECTS[kind].frame.h/DREAM_INSECTS[kind].frame.w:350+cycle*10,amplitude:kind==='grass'?(def.kind==='wind'?75:44):kind==='beetle'?74:35,period:kind==='beetle'?7.5:kind==='bee'?6.5:8.5,phase:section*.7+i*1.37,section});
  if(def.kind==='mixed'&&i%6===1){objects.push({...objects.at(-1),id:'dream-'+section+'-'+i+'-b',x:cursor+205,y:210+cycle*24,phase:section*.7+i*1.37+.8});cursor+=410;}
  else cursor+=kind==='beetle'?def.span/def.count:moving?300:196;
  }
  cursor+=0;
}
objects.push({id:'dream-finish',kind:'branch',x:cursor,y:550,w:560,h:200,checkpoint:true,section:5,finish:true,amplitude:18,period:9,phase:2});
for(const [index,o] of objects.entries())if(o.kind==='beetle'){
  const next=objects[index+1],n=Number(o.id.split('-').at(-1));
  o.flight=Object.freeze({toX:next.x-o.w-100,toY:next.kind==='leaf'?next.y-o.h*.7:next.y+35,duration:[12,14,13,14][n],delay:.65,arc:[-170,140,-190,100][n],wave:[65,-70,75,-65][n],next:next.id});
}
export const DREAM_OBJECTS=Object.freeze(objects.map(o=>Object.freeze(o)));
export const DREAM_WIDTH=cursor+600;
export const DREAM_BY_ID=new Map(DREAM_OBJECTS.map(o=>[o.id,o]));
const cells=new Map();
for(const o of DREAM_OBJECTS)for(let c=Math.floor((o.x-150)/DREAM.cell);c<=Math.floor((Math.max(o.x,o.flight?.toX??o.x)+o.w+150)/DREAM.cell);c++){if(!cells.has(c))cells.set(c,[]);cells.get(c).push(o);}
/** Consulta espacial independente do viewport e da renderização. */
export function dreamNearby(left,right){const found=new Set();for(let c=Math.floor(left/DREAM.cell);c<=Math.floor(right/DREAM.cell);c++)for(const o of cells.get(c)||[])found.add(o);return [...found];}
/** Resolve vento e voo curvo pelo relógio salvo e pelo instante de embarque de cada besouro. */
export function dreamObjectFrame(o,time,rides={}){
  if(o.kind==='web'){
    const age=((time+o.phase)%o.period+o.period)%o.period,smooth=t=>(1-Math.cos(Math.PI*t))/2;
    let spiderY,spiderPhase;
    if(age<1.8){spiderY=-180+880*smooth(age/1.8);spiderPhase='DESCENDING';}
    else if(age<5.2){spiderY=700;spiderPhase='LOW';}
    else if(age<7){spiderY=700-880*smooth((age-5.2)/1.8);spiderPhase='ASCENDING';}
    else{spiderY=-180;spiderPhase='HIGH';}
    return{...o,sway:0,spiderY,spiderPhase};
  }
  if(o.kind==='branch'){const angle=time*Math.PI*2/o.period+o.phase;return{...o,anchorX:o.x,x:o.x+Math.sin(angle)*o.amplitude,y:o.y+Math.sin(angle*.85)*12,sway:0};}
  if(o.flight){
    const started=rides[o.id],active=Number.isFinite(started),age=active?Math.max(0,time-started):0,progress=active?Math.max(0,Math.min(1,(age-o.flight.delay)/o.flight.duration)):0,q=progress**3*(progress*(progress*6-15)+10);
    return{...o,x:o.x+(o.flight.toX-o.x)*q,y:o.y+(o.flight.toY-o.y)*q+Math.sin(Math.PI*q)*o.flight.arc+Math.sin(2*Math.PI*q)*o.flight.wave+Math.sin(time*2+o.phase)*2,sway:0,flightProgress:progress,flightPhase:!active?'WAITING':age<o.flight.delay?'TAKEOFF':progress<1?'FLYING':'ARRIVED',flightEnergy:!active?.3:progress===1?.6:Math.min(1,.3+age/.65)};
  }
  const angle=time*Math.PI*2/o.period+o.phase||0;
  return{...o,x:o.x+(o.kind==='grass'||o.kind==='leaf'?0:Math.sin(angle)*o.amplitude),y:o.y+(o.kind==='bee'?Math.sin(angle)*100:o.kind==='worm'?Math.sin(angle)*34:0),sway:o.kind==='grass'?Math.sin(time*.9+o.phase)*o.amplitude+Math.sin(time*.37)*15:0};
}
/** A grama é ancorada na base e curva na ponta; desenho e pegada usam esta mesma função. */
export function dreamGrassX(frame,y){const u=Math.max(0,Math.min(1,(y-frame.y)/frame.h));return frame.x+frame.sway*(1-u)*(1-u);}
/** Superfície natural da folha ou contorno medido dos insetos, nunca uma régua desenhada. */
export function dreamSurface(frame,x,profiles={}){
  const u=Math.max(0,Math.min(1,(x-frame.x)/frame.w));
  if(frame.kind==='branch')return frame.y+12*Math.sin(Math.PI*u)+5*(2*u-1);
  if(frame.kind==='leaf')return frame.y+30*Math.pow((u-.5)*2,2);
  const profile=profiles[frame.kind];if(!profile)return frame.y+frame.h*(.12+.35*Math.pow((u-.5)*2,2));
  return frame.y+frame.h*profile[Math.min(profile.length-1,Math.round(u*(profile.length-1)))];
}
