/** Percurso em pixels de mundo. Materiais definem gameplay, sem alterar a câmera. */
export const GARDEN = Object.freeze({version:4,get width(){return GARDEN_WIDTH;},get goal(){return GARDEN_GOAL;},height:720,ground:590,playerHeight:92,halfFoot:12,speed:220,jump:720,gravity:1600,step:1/120,waterY:650,targetMinutes:8});
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
// Seis paisagens, dois percursos diferentes em cada uma; encontro/altura/ritmo crescem gradualmente.
const chapters=['Canteiros de margaridas','O caminho das hortênsias','Riachos de água clara','Entre salgueiros','O jardim das borboletas','A alameda da grande árvore'];
let cursor=7350;
for(let region=0;region<6;region++)for(let motif=0;motif<2;motif++){
  const index=region*2+motif,id='trecho-'+index,start=cursor,progress=index/11;
  sections.push({id,x:start,name:chapters[region]+' · '+(motif+1),chapter:region+1});checkpoints.push(start+120);
  const path=ground(id+'-caminho',cursor,1250+motif*65);cursor+=path.w;
  if(index>0)enemy(id+'-formiga','ant',path,progress);
  const grass=ground(id+'-gramado',cursor,2300+region*40,'grass');cursor+=grass.w;
  if(index%2===0)enemy(id+'-lagarta','caterpillar',grass,progress);
  const approach=ground(id+'-margem',cursor,420+motif*30);cursor+=approach.w;
  if(index%3===1)enemy(id+'-margem-formiga','ant',approach,progress);
  const gap=100+region*5+motif*3;
  cursor=river(id+'-rio',cursor+gap,3+motif%3,gap,22+region*4,index===3||index===7||index===10)+gap;
  const exit=ground(id+'-clareira',cursor,760+motif*70);cursor+=exit.w;
  if(index>2)enemy(id+'-lagarta-da-saida','caterpillar',exit,progress);
  if(index===3||index===8){ground(id+'-grama-alta',cursor,650+region*45,'grass');cursor+=650+region*45;}
  if(index===5||index===9){ground(id+'-pedrinhas',cursor,690,'gravel');cursor+=690;}
  sections.at(-1).end=cursor;
}
export const GARDEN_FINAL_START = cursor;
ground('descanso-final',cursor,450);checkpoints.push(cursor+120);cursor+=570;
for(let i=0;i<4;i++)add('nuvem-final-'+i,cursor+i*265,170,'cloud',530-(i%2)*36,{group:'final'});
cursor+=4*265;ground('arvore',cursor,1450);cursor+=1450;
export const GARDEN_GOAL=cursor-680;
export const GARDEN_WIDTH=cursor;
// Relevos de terra maciça: cada perfil volta à cota da margem e varia ao longo da fase.
for(let i=platforms.length-1;i>=0;i--){
  const p=platforms[i];if(!p.ground||p.type==='wood'||['primeiros-bichinhos','descanso-final','arvore'].includes(p.id)||p.w<600)continue;
  const match=p.id.match(/^trecho-(\d+)/),n=match?Number(match[1]):0,amplitude=45+Math.floor(n/2)*5;
  let profile=[0,-amplitude,-amplitude*2,-amplitude,0];
  if(n%3===1)profile=[0,-amplitude,0,-amplitude,0];
  if(n%3===2)profile=[0,-amplitude,-amplitude*2,-amplitude,-amplitude,0];
  // Clareiras curtas reservam um topo largo: inimigos não bloqueiam uma subida alta na borda.
  if(match&&p.w<1100)profile=[0,-amplitude,0];
  if(p.type==='gravel')profile=[0,-70,0];
  const weights=p.type==='gravel'?[.45,.25,.3]:profile.map(()=>1/profile.length);
  let x=p.x;
  const pieces=profile.map((height,j)=>{const end=j===profile.length-1?p.x+p.w:x+p.w*weights[j],piece={...p,id:j?p.id+'-relevo-'+j:p.id,x,w:end-x,y:p.y+height};x=end;return piece;});
  platforms.splice(i,1,...pieces);
  // Cada inseto mantém a identidade e pousa no patamar que contém sua posição inicial.
  for(const e of enemies)if(e.supportId===p.id){const home=pieces.find(v=>e.x>=v.x&&e.x<v.x+v.w)||pieces[0];Object.assign(e,{x:Math.max(home.x+70,Math.min(home.x+home.w-70,e.x)),supportId:home.id,y:home.y,baseY:home.y,left:home.x+70,right:home.x+home.w-70});}
}
export const GARDEN_PLATFORMS=Object.freeze(platforms.map(Object.freeze));
export const GARDEN_ENEMIES=Object.freeze(enemies.map(Object.freeze));
export const GARDEN_WATERS=Object.freeze(waters.map(Object.freeze));
export const GARDEN_SECTIONS=Object.freeze(sections.map(Object.freeze));
export const GARDEN_CHECKPOINTS=Object.freeze(checkpoints);
// Checkpoints v2/v3 preservados como dados de migração, sem reutilizar coordenadas antigas no novo chão.
const previousCheckpoints=[[120,120],[7470,7470],[12530,12930],[18030,18830],[24626,25826],[30907,32507],[37597,39597],[42717,45117],[48282,51082],[54993,58193],[61334,64934],[68134,72134],[73314,77714],[78944,83744],[85770,90970],[92171,97771],[99081,105081],[104321,110721],[110016,116816],[116957,124157],[123418,131018],[130438,138438],[135738,144138],[141498,150298],[148554,157754],[155075,164675],[162205,172205],[167565,177965],[173390,184190],[180561,191761],[187142,198742],[194382,206382]];
export const GARDEN_LEGACY_CHECKPOINTS=new Map(previousCheckpoints.flatMap((pair,i)=>{
  const target=i===0?0:i===previousCheckpoints.length-1?checkpoints.length-1:1+Math.floor((i-1)/5)*2+Number((i-1)%5>=3);
  return pair.map((x,version)=>[`${version+2}:${x}`,checkpoints[target]]);
}));
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
