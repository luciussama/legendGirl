/** Percurso em pixels de mundo. Materiais definem gameplay, sem alterar a câmera. */
export const GARDEN = Object.freeze({version:2,get width(){return GARDEN_WIDTH;},get goal(){return GARDEN_GOAL;},height:720,ground:590,playerHeight:92,halfFoot:36,speed:220,jump:720,gravity:1600,step:1/120,waterY:650,targetMinutes:20});
export const GARDEN_TERRAINS = Object.freeze({wood:{speed:220,jump:720},soil:{speed:220,jump:720},stone:{speed:220,jump:720},cloud:{speed:220,jump:720},grass:{speed:100,jump:720},gravel:{speed:410,jump:720}});
const platforms=[],enemies=[],waters=[],sections=[],checkpoints=[120];
const add=(id,x,w,type='soil',y=590,extra={})=>{const p={id,x,w,type,y,...extra};platforms.push(p);return p;};
const ground=(id,x,w,type='soil')=>add(id,x,w,type,590,{ground:true});
const enemy=(id,type,p,progress=0)=>enemies.push({id,type,supportId:p.id,x:p.x+p.w*.6,y:p.y,baseY:p.y,left:p.x+70,right:p.x+p.w-70,w:type==='ant'?56:82,h:type==='ant'?35:42,speed:(type==='ant'?43:30)+progress*19,period:3.2-progress*.7,phase:enemies.length*.71});
function river(id,x,count,gap=122,rise=32,ant=false){
  const stones=[];for(let i=0;i<count;i++)stones.push(add(`${id}-pedra-${i}`,x+i*(160+gap),160,'stone',550-(i%2)*rise));
  const end=stones.at(-1).x+160;waters.push({id,x:x-gap,w:end-x+gap*2});
  if(ant){const route=stones.slice(1,Math.min(5,stones.length)).map(p=>({x:p.x+p.w/2,y:p.y}));enemies.push({id:id+'-formiga-do-rio',type:'ant',x:route[0].x,y:route[0].y,baseY:route[0].y,left:route[0].x,right:route.at(-1).x,w:56,h:35,speed:60,period:2.5,phase:0,route});}
  return end;
}
// A introdução ensina cada superfície antes de combinar os desafios.
sections.push({id:'saida',x:0,end:7350,name:'O portão de casa',chapter:0});
ground('entrada',0,680,'wood');add('suspensa-1',790,175,'wood',535);add('suspensa-2',1070,175,'wood',520);
ground('primeira-grama',1330,980,'grass');river('primeiro-riacho',2440,3,115,26);
ground('grama-da-margem',3200,750,'grass');ground('pedrinhas-da-roda',3950,850,'gravel');
export const GARDEN_WHEEL = Object.freeze({x:5050,y:465,rx:150,ry:115,speed:.38});
for(let i=0;i<3;i++)add('nuvem-inicial-'+i,5350+i*265,170,'cloud',450+(i%2)*30,{group:'initial'});
const firstFight=ground('primeiros-bichinhos',6080,1270);enemy('primeira-lagarta','caterpillar',{...firstFight,x:6200,w:440});enemy('primeira-formiga','ant',{...firstFight,x:6740,w:460});
// Seis paisagens, cinco percursos diferentes em cada uma; encontro/altura/ritmo crescem gradualmente.
const chapters=['Canteiros de margaridas','O caminho das hortênsias','Riachos de água clara','Entre salgueiros','O jardim das borboletas','A alameda da grande árvore'];
let cursor=7350;
for(let region=0;region<6;region++)for(let motif=0;motif<5;motif++){
  const index=region*5+motif,id='trecho-'+index,start=cursor,progress=index/29;
  sections.push({id,x:start,name:chapters[region]+' · '+(motif+1),chapter:region+1});checkpoints.push(start+120);
  const path=ground(id+'-caminho',cursor,1250+motif*65);cursor+=path.w;
  if(index>0)enemy(id+'-formiga','ant',path,progress);
  const grass=ground(id+'-gramado',cursor,1750+region*40,'grass');cursor+=grass.w;
  if(index%2===0)enemy(id+'-lagarta','caterpillar',grass,progress);
  const approach=ground(id+'-margem',cursor,420+motif*30);cursor+=approach.w;
  if(index%3===1)enemy(id+'-margem-formiga','ant',approach,progress);
  const gap=100+region*5+motif*3;
  cursor=river(id+'-rio',cursor+gap,3+motif%3,gap,22+region*4,index===4||index===13||index===24)+gap;
  const exit=ground(id+'-clareira',cursor,760+motif*70);cursor+=exit.w;
  if(index>2)enemy(id+'-lagarta-da-saida','caterpillar',exit,progress);
  if(motif===2||motif===4){ground(id+'-grama-alta',cursor,650+region*45,'grass');cursor+=650+region*45;}
  if(motif===3){ground(id+'-pedrinhas',cursor,690,'gravel');cursor+=690;}
  sections.at(-1).end=cursor;
}
export const GARDEN_FINAL_START = cursor;
ground('descanso-final',cursor,450);checkpoints.push(cursor+120);cursor+=570;
for(let i=0;i<4;i++)add('nuvem-final-'+i,cursor+i*265,170,'cloud',530-(i%2)*36,{group:'final'});
cursor+=4*265;ground('arvore',cursor,1450);cursor+=1450;
export const GARDEN_GOAL=cursor-680;
export const GARDEN_WIDTH=cursor;
export const GARDEN_PLATFORMS=Object.freeze(platforms.map(Object.freeze));
export const GARDEN_ENEMIES=Object.freeze(enemies.map(Object.freeze));
export const GARDEN_WATERS=Object.freeze(waters.map(Object.freeze));
export const GARDEN_SECTIONS=Object.freeze(sections.map(Object.freeze));
export const GARDEN_CHECKPOINTS=Object.freeze(checkpoints);
export const GARDEN_PLATFORM_BY_ID=new Map(platforms.map(p=>[p.id,p]));
const buckets=new Map();for(const p of platforms)for(let k=Math.floor(p.x/1024);k<=Math.floor((p.x+p.w)/1024);k++){if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push(p);}
/** Consulta espacial evita varrer todo o jardim em cada subpasso de física. */
export function gardenPlatforms(time=0,state=null,center=null,radius=1000){
  const list=center===null?platforms:[...new Set(Array.from({length:Math.ceil(radius*2/1024)+2},(_,i)=>buckets.get(Math.floor((center-radius)/1024)+i)??[]).flat())].filter(p=>p.x+p.w>=center-radius&&p.x<=center+radius);
  const visible=list.filter(p=>p.type!=='cloud'||cloudStatus(p,state,time).solid);
  if(center===null||Math.abs(center-GARDEN_WHEEL.x)<radius+250){const w=GARDEN_WHEEL;for(let i=0;i<4;i++){const angle=time*w.speed+i*Math.PI/2;visible.push({id:'roda-'+i,type:'wood',rotating:true,x:w.x+Math.cos(angle)*w.rx-72,y:w.y+Math.sin(angle)*w.ry,w:144});}}
  return visible;
}
/** A nuvem arma no primeiro pouso; desaparece e retorna, sem flashes fora dela. */
export function cloudStatus(platform,state,time=state?.time??0){
  const armed=state?.clouds?.[platform.id];if(armed===undefined)return{solid:true,alpha:1,elapsed:0};
  const elapsed=Math.max(0,time-armed),duration=state?.difficulty==='EASY'?3.8:2.8;
  if(elapsed>=duration&&elapsed<duration+4)return{solid:false,alpha:0,elapsed};
  if(elapsed>=duration+4)return{solid:true,alpha:1,elapsed};
  const t=elapsed/duration,phase=elapsed*(1.5+3*t);return{solid:true,alpha:Math.sin(phase*Math.PI*2)>0?1:.28,elapsed};
}
export function gardenSection(x){return sections.find(s=>x>=s.x&&x<s.end)??sections.at(-1);}
