/** Percurso em pixels de mundo. Materiais definem gameplay, sem alterar a câmera. */
export const GARDEN = Object.freeze({version:7,get width(){return GARDEN_WIDTH;},get goal(){return GARDEN_GOAL;},height:720,ground:590,playerHeight:92,halfFoot:35,speed:220,jump:720,gravity:1600,step:1/120,waterY:650,targetMinutes:5});
// A escada usa pontos da pintura; a base fica assentada na madeira.
export const GARDEN_HOME=Object.freeze({x:30,y:201,w:500,h:401,steps:Object.freeze([{x:338,y:540},{x:432,y:546},{x:476,y:574},{x:530,y:590}])});
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
export const GARDEN_WHEEL = Object.freeze({id:'roda',x:5050,y:465,rx:150,ry:115,speed:.38});
for(let i=0;i<3;i++)add('nuvem-inicial-'+i,5350+i*265,170,'cloud',450+(i%2)*30,{group:'initial'});
const firstFight=ground('primeiros-bichinhos',6080,1270);enemy('primeira-lagarta','caterpillar',{...firstFight,x:6200,w:440});enemy('primeira-formiga','ant',{...firstFight,x:6740,w:460});
// Seis composições próprias: cada paisagem combina relevo, material e encontros de maneira diferente.
const wheelList=[GARDEN_WHEEL];let aerial=null;
const chapters=['Canteiros de margaridas','O caminho das hortênsias','Riachos de água clara','Entre salgueiros','O jardim das borboletas','A alameda da grande árvore'];
let cursor=7350;
const layouts=[
  [['caminho',1000,'soil',170],['gramado',2200,'grass'],['margem',300,'soil'],['rio',3],['clareira',650,'soil']],
  [['caminho',800,'soil'],['gramado',2400,'grass',180],['pedrinhas',650,'gravel'],['clareira',900,'soil']],
  [['caminho',700,'soil'],['gramado',1700,'grass'],['margem',300,'soil'],['rio',5],['clareira',850,'soil'],['colina',1400,'soil',210]],
  [['caminho',650,'soil'],['gramado',2600,'grass',200],['pedrinhas',500,'gravel'],['clareira',1300,'soil']],
  [['caminho',1000,'soil'],['pedrinhas',600,'gravel'],['gramado',2250,'grass'],['margem',300,'soil'],['rio',4],['clareira',650,'soil']],
  [['caminho',850,'soil'],['gramado',2400,'grass',160],['margem',300,'soil'],['rio',5],['clareira',850,'soil']]
];
for(let region=0;region<layouts.length;region++){
  const index=region*2;
  if(index===6){
    const start=cursor;ground('aereo-entrada',start,360);checkpoints.push(start+120);
    for(let i=0;i<3;i++)wheelList.push(Object.freeze({id:'aerea-'+(i+1),x:start+610+i*480,y:465,rx:150,ry:115,speed:[.38,-.36,.34][i],phase:i*.6}));
    const pieces=[['nuvem-0',1840,170,'cloud',470],['nuvem-1',2100,170,'cloud',435],['ilha-0',2360,180,'gravel',470],['nuvem-2',2630,170,'cloud',430],['nuvem-3',2890,170,'cloud',465],['ilha-1',3150,190,'gravel',440],['nuvem-4',3440,170,'cloud',450],['nuvem-5',3710,170,'cloud',490]];
    for(const [id,x,w,type,y]of pieces)add('aereo-'+id,start+x,w,type,y,{aerial:true,group:'aerial'});
    ground('aereo-saida',start+4000,360);checkpoints.push(start+4120);cursor=start+4360;aerial=Object.freeze({x:start,end:cursor,entry:'aereo-entrada',exit:'aereo-saida'});sections.push({id:'aereo',x:start,end:cursor,name:'Por cima do jardim',chapter:3});
  }
  const id='trecho-'+index,start=cursor,progress=region/5;
  sections.push({id,x:start,name:chapters[region],chapter:region+1});checkpoints.push(start+120);
  for(const [part,width,type,hill]of layouts[region]){
    if(part==='rio'){
      const gap=110+region*4;cursor=river(id+'-rio',cursor+gap,width,gap,26+region*4,region>=2)+gap;
      continue;
    }
    const p=ground(id+'-'+part,cursor,width,type);cursor+=width;
    if(hill){p.hill=hill;p.waves=region===3||region===5?2:1;if(type==='grass'){p.type='soil';p.grassPatches=[{start:.17,end:.23},{start:.47,end:.54},{start:.77,end:.83}];}}
    else if(part==='caminho')p.profile=region%2?[0,-55,-110,-55,0]:[0,-60,-60,0];
    else if(part==='clareira'){if(region===1)p.hill=85;else p.profile=region===3?[0,-60,-60,0]:[0];}
    if(part==='gramado'||part==='clareira'||part==='colina')enemy(id+'-'+part+'-lagarta','caterpillar',p,progress);
    if(part==='caminho'||part==='pedrinhas'||part==='gramado'){
      enemy(id+'-'+part+'-formiga','ant',{...p,x:p.x+80,w:p.w*.5},progress);
      if(p.w>=1400)enemy(id+'-'+part+'-formiga-2','ant',{...p,x:p.x+p.w*.45,w:p.w*.5},progress);
    }
  }
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
  const p=platforms[i];if(!p.ground||p.type==='wood'||['primeiros-bichinhos','descanso-final','arvore'].includes(p.id)||p.w<600||p.hill)continue;
  const match=p.id.match(/^trecho-(\d+)/),n=match?Number(match[1]):0,amplitude=45+Math.floor(n/2)*5;
  let profile=[0,-amplitude,-amplitude*2,-amplitude,0];
  if(n%3===1)profile=[0,-amplitude,0,-amplitude,0];
  if(n%3===2)profile=[0,-amplitude,-amplitude*2,-amplitude,-amplitude,0];
  // Clareiras curtas reservam um topo largo: inimigos não bloqueiam uma subida alta na borda.
  if(match&&p.w<1100)profile=[0,-amplitude,0];
  if(p.type==='gravel')profile=[0,-70,0];
  if(p.profile)profile=p.profile;
  const weights=p.type==='gravel'?[.45,.25,.3]:profile.map(()=>1/profile.length);
  let x=p.x;
  const pieces=profile.map((height,j)=>{const end=j===profile.length-1?p.x+p.w:x+p.w*weights[j],piece={...p,id:j?p.id+'-relevo-'+j:p.id,x,w:end-x,y:p.y+height};x=end;return piece;});
  const merged=[];for(const piece of pieces){const last=merged.at(-1);if(last&&last.y===piece.y)last.w+=piece.w;else merged.push(piece);}
  platforms.splice(i,1,...merged);
  // Cada inseto mantém a identidade e pousa no patamar que contém sua posição inicial.
  for(const e of enemies)if(e.supportId===p.id){const home=merged.find(v=>e.x>=v.x&&e.x<v.x+v.w)||merged[0];Object.assign(e,{x:Math.max(home.x+70,Math.min(home.x+home.w-70,e.x)),supportId:home.id,y:home.y,baseY:home.y,left:home.x+70,right:home.x+home.w-70});}
}
for(const e of enemies)if(!e.route){const p=platforms.find(p=>p.id===e.supportId);e.y=e.baseY=gardenSurfaceY(p,e.x);}
export const GARDEN_WHEELS=Object.freeze(wheelList);
export const GARDEN_AERIAL=aerial;
export const GARDEN_PLATFORMS=Object.freeze(platforms.map(Object.freeze));
export const GARDEN_ENEMIES=Object.freeze(enemies.map(Object.freeze));
export const GARDEN_WATERS=Object.freeze(waters.map(Object.freeze));
export const GARDEN_SECTIONS=Object.freeze(sections.map(Object.freeze));
export const GARDEN_CHECKPOINTS=Object.freeze(checkpoints);
// Checkpoints v2/v3 preservados como dados de migração, sem reutilizar coordenadas antigas no novo chão.
const previousCheckpoints=[[120,120],[7470,7470],[12530,12930],[18030,18830],[24626,25826],[30907,32507],[37597,39597],[42717,45117],[48282,51082],[54993,58193],[61334,64934],[68134,72134],[73314,77714],[78944,83744],[85770,90970],[92171,97771],[99081,105081],[104321,110721],[110016,116816],[116957,124157],[123418,131018],[130438,138438],[135738,144138],[141498,150298],[148554,157754],[155075,164675],[162205,172205],[167565,177965],[173390,184190],[180561,191761],[187142,198742],[194382,206382]];
const previousV4=[120,7470,13080,19130,24800,31610,37340,44210,50000,56245,62925,69925,75835,82210];
const sectorCheckpoint=i=>i<0?120:i>=12?GARDEN_FINAL_START+120:sections.find(s=>s.id==='trecho-'+(Math.floor(i/2)*2)).x+120;
const previousV5=[120,7470,12630,18230,23450,29810,35090,41510,45510,45870,51210,57005,63235,69785,75245,81170];
export const GARDEN_LEGACY_CHECKPOINTS=new Map([
  ...previousCheckpoints.flatMap((pair,i)=>pair.map((x,version)=>[`${version+2}:${x}`,sectorCheckpoint(i===0?-1:i===previousCheckpoints.length-1?12:Math.floor((i-1)/5)*2+Number((i-1)%5>=3))])),
  ...previousV4.map((x,i)=>[`4:${x}`,sectorCheckpoint(i===0?-1:i===previousV4.length-1?12:i-1)]),
  ...previousV5.map((x,i)=>[`5:${x}`,i===7?aerial.x+120:i===8?aerial.end-240:sectorCheckpoint(i===0?-1:i===15?12:i<7?i-1:i-3)])
]);
export const GARDEN_PLATFORM_BY_ID=new Map(platforms.map(p=>[p.id,p]));
const buckets=new Map();for(const p of platforms)for(let k=Math.floor(p.x/1024);k<=Math.floor((p.x+p.w)/1024);k++){if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push(p);}
/** Consulta espacial evita varrer todo o jardim em cada subpasso de física. */
export function gardenPlatforms(time=0,state=null,center=null,radius=1000){
  const list=center===null?platforms:[...new Set(Array.from({length:Math.ceil(radius*2/1024)+2},(_,i)=>buckets.get(Math.floor((center-radius)/1024)+i)??[]).flat())].filter(p=>p.x+p.w>=center-radius&&p.x<=center+radius);
  const visible=list.filter(p=>p.type!=='cloud'||cloudStatus(p,state,time).solid);
  for(const w of GARDEN_WHEELS)if(center===null||Math.abs(center-w.x)<radius+250)for(let i=0;i<4;i++){const angle=time*w.speed+(w.phase??0)+i*Math.PI/2;visible.push({id:w.id+'-'+i,type:'wood',rotating:true,wheelId:w.id,x:w.x+Math.cos(angle)*w.rx-72,y:w.y+Math.sin(angle)*w.ry,w:144});}
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

/** Altura real da superfície; os morros arredondados são iguais na pintura e na física. */
export function gardenSurfaceY(platform,x){
  if(!platform)return GARDEN.ground;
  const t=Math.max(0,Math.min(1,(x-platform.x)/platform.w));
  return platform.y-(platform.hill??0)*Math.sin(Math.PI*(platform.waves??1)*t)**2;
}

/** Grama sensorial só existe nas pequenas faixas realmente ilustradas sobre os morros. */
export function gardenTerrainAt(platform,x){
  return platform?.grassPatches?.some(p=>x>=platform.x+platform.w*p.start&&x<=platform.x+platform.w*p.end)?'grass':platform?.type??'soil';
}
