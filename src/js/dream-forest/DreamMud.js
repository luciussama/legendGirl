import {DREAM_NIGHTMARE_ART as ART} from './DreamNightmareArt.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
/** Lagos têm extensão, profundidade visual e trajetos próprios sobre a lama pintada. */
export const DREAM_MUD_LAKES=Object.freeze([
 {x:4400,w:850,h:330,path:[[.14,.65],[.32,.62],[.55,.58],[.73,.55],[.86,.5]]},
 {x:5310,w:1020,h:410,path:[[.12,.49],[.3,.44],[.47,.4],[.65,.44],[.88,.62]]},
 {x:6430,w:700,h:300,path:[[.12,.66],[.35,.68],[.52,.58],[.7,.4],[.88,.36]]},
 {x:7210,w:1410,h:430,path:[[.12,.65],[.3,.68],[.5,.6],[.7,.49],[.82,.39],[.91,.31]]}
].map((p,index)=>Object.freeze({...p,id:'mud-lake-'+index,index,frame:index,paintX:p.x,x:p.x+(p.path[0][0]+p.path.at(-1)[0])*p.w/2,top:870-p.h*.55,from:p.x+p.path[0][0]*p.w,to:p.x+p.path.at(-1)[0]*p.w,path:Object.freeze(p.path.map(Object.freeze))})));
/** Superfície projetada do trajeto curvo, comum ao corpo, à lama frontal e à oclusão. */
export function mudWaterline(lake,x){const u=clamp((x-lake.paintX)/lake.w,lake.path[0][0],lake.path.at(-1)[0]);let i=1;while(i<lake.path.length-1&&u>lake.path[i][0])i++;const a=lake.path[i-1],b=lake.path[i],t=(u-a[0])/(b[0]-a[0]);return lake.top+(a[1]+(b[1]-a[1])*t)*lake.h;}
/** O trajeto atravessa a área líquida da pintura, sem usar o retângulo inteiro como água. */
export function mudLakeAt(x){return DREAM_MUD_LAKES.find(l=>x>=l.from&&x<=l.to)??null;}
export function mudBankY(lake,side){return mudWaterline(lake,side<0?lake.from:lake.to)-18;}
/** Há fundo sob a lama e terra nas margens; o lago não é um vão sem chão. */
export function mudGround(x){const lake=mudLakeAt(x);if(lake)return mudWaterline(lake,x)+185;for(const l of DREAM_MUD_LAKES){if(x>=l.from-90&&x<l.from){const t=smooth((x-l.from+90)/90);return 850+(mudBankY(l,-1)-850)*t;}if(x>l.to&&x<=l.to+90){const t=smooth((x-l.to)/90);return mudBankY(l,1)+(850-mudBankY(l,1))*t;}}return null;}
export function createMudState(){return{mudMode:'dry',mudLakeId:null,mudAge:0,mudSide:0,mudStartX:0,mudStartY:850,mudEntryTarget:0,mudStartDepth:0,swimDistance:0};}
/** A entrada começa pelo contato dos pés; nenhum botão de mergulho é necessário. */
export function enterDreamMud(n,lake,{side=n.facing,submerged=false}={}){const direction=side<0?-1:1;n.mudLakeId=lake.id;n.mudMode=submerged?'swim':'enter';n.mudAge=0;n.mudSide=direction;n.mudStartX=n.x;n.mudStartY=n.y;n.mudEntryTarget=direction>0?lake.from+85:lake.to-85;n.swimDistance=0;n.grounded=false;n.vy=0;n.vx=0;if(submerged){n.x=clamp(n.x,lake.from+85,lake.to-85);n.mudDepth=1;n.y=mudWaterline(lake,n.x)+156.8;}}
/** Nadar desloca o corpo; parado ele afunda, e segurar baixo permite nadar submerso. */
export function stepDreamMud(n,input,dt){if(n.mudMode==='dry')return false;const lake=DREAM_MUD_LAKES.find(l=>l.id===n.mudLakeId),old=n.x;n.mudAge+=dt;n.jumpHeld=Boolean(input.jump);n.grounded=false;n.vy=0;
 if(n.mudMode==='enter'){const q=smooth(n.mudAge/1.1);n.x=n.mudStartX+(n.mudEntryTarget-n.mudStartX)*q;n.y=n.mudStartY+(mudWaterline(lake,n.x)+115-n.mudStartY)*q;n.mudDepth=q;if(q===1){n.mudMode='swim';n.mudAge=0;}}
 else if(n.mudMode==='climb'){const q=smooth(n.mudAge/1.9),bank=n.mudSide<0?lake.from:lake.to;n.x=n.mudStartX+(bank+n.mudSide*12-n.mudStartX)*q;n.y=n.mudStartY+(mudBankY(lake,n.mudSide)-n.mudStartY)*q;n.mudDepth=1-q;n.facing=n.mudSide;
  if(q===1){n.mudMode='dry';n.mudLakeId=null;n.mudDepth=0;n.grounded=true;n.y=mudGround(n.x)??850;n.mudAge=0;n.mudSide=0;}}
 else{const direction=clamp(Number(input.x)||0,-1,1),down=input.y>.3,target=down||Math.abs(direction)<.05?1:.68;n.mudDepth+=clamp(target-n.mudDepth,-dt*.6,dt*(down?1.8:.65));n.x=clamp(n.x+direction*(down?78:105)*dt,lake.from+75,lake.to-75);n.y=mudWaterline(lake,n.x)+80+Math.max(0,n.mudDepth-.68)*240;if(direction)n.facing=direction<0?-1:1;n.swimDistance+=Math.abs(n.x-old);
  const side=n.x<=lake.from+77?-1:n.x>=lake.to-77?1:0,wants=side&&(direction*side>.1||input.jump||input.y<-.3);if(wants&&!down){n.mudMode='climb';n.mudAge=0;n.mudSide=side;n.mudStartX=n.x;n.mudStartY=n.y;n.mudStartDepth=n.mudDepth;}}
 n.vx=(n.x-old)/dt;n.animTime+=Math.abs(n.x-old)/30;return true;
}
/** Pose compartilhada: pés na entrada, linha de água no nado e mão na escalada existente. */
export function mudActor(n){if(!n.mudMode||n.mudMode==='dry')return null;const lake=DREAM_MUD_LAKES.find(l=>l.id===n.mudLakeId);let set,index,x=n.x,y=n.y,anchor,kind;
 if(n.mudMode==='climb'&&n.mudAge>=.35){set=ART.bankClimb;const q=clamp((n.mudAge-.35)/1.55,0,1);index=q<.65?Math.min(3,Math.floor(q/.65*4)):q<.82?4:5;const f=set.frames[index],scale=160/set.referenceHeight;anchor=f.hand;x=n.mudSide<0?lake.from:lake.to;y=mudBankY(lake,n.mudSide)-15+19*(1-smooth((n.mudAge-.35)/.25))-smooth((q-.82)/.18)*Math.max(0,(f.h-f.hand[1])*scale-15);kind='climb';}
 else if(n.mudMode==='enter'&&n.mudAge<.65){set=ART.stealth;index=0;const f=set.frames[0];anchor=[f.w/2,f.h];kind='enter';}
 else{set=ART.swim;index=Math.floor(n.swimDistance/24)%4;const f=set.frames[index];anchor=f.water;const depth=n.mudMode==='climb'?Math.max(0,n.mudStartDepth-.68)*240*(1-smooth(n.mudAge/.35)):Math.max(0,n.mudDepth-.68)*240;y=mudWaterline(lake,n.x)+depth+Math.sin(n.time*2.4)*1.5*(1-n.mudDepth)+(n.mudMode==='enter'?20*(1-smooth((n.mudAge-.65)/.45)):0);kind='swim';}
 return{set,index,frame:set.frames[index],x,y,scale:160/set.referenceHeight,anchorX:anchor[0],anchorY:anchor[1],facing:n.facing,kind,lake};
}
/** A lama encobre somente os pixels abaixo da mesma superfície desenhada no primeiro plano. */
export function mudOccludesPoint(point){const lake=mudLakeAt(point.x);return Boolean(lake&&point.y>=mudWaterline(lake,point.x));}
/** Checkpoint da parte molhada reaparece dentro do lago, já afundada e protegida. */
export function mudCheckpoint(index){const lake=DREAM_MUD_LAKES[index<3?0:2];return{x:lake.from+100,mudDepth:1,mudLakeId:lake.id};}
