import {GARDEN_CONTACT as data} from './GardenContactData.js';
import {gardenSurfaceY} from './GardenLevel.js';
const tables=new Map(Object.entries(data.surfaces).map(([type,profile])=>{
 const rows=[profile.columns.map(v=>v===null?Infinity:v)];
 for(let size=2;size<=rows[0].length;size*=2){const prior=rows.at(-1),half=size/2;rows.push(prior.slice(0,prior.length-half).map((v,i)=>Math.min(v,prior[i+half])));}
 return[type,rows];
}));
/** Envelope dos sapatos completos, estável entre poses; espelha junto com a menina. */
export function gardenFeet(player,x=player.x){
 const b=player.terrain==='gravel'&&player.discomfort>.4?data.gravelBounds:data.bounds;
 return player.facing===-1?{left:x-b.right,right:x-b.left}:{left:x+b.left,right:x+b.right};
}
/** Superfície sob os sapatos, medida por coluna da pintura. Transparência não vira apoio. */
export function gardenContactHeight(platform,player,x=player.x){
 const feet=gardenFeet(player,x),left=Math.max(platform.x,feet.left),right=Math.min(platform.x+platform.w,feet.right);
 if(right-left<.05)return Infinity;
 const profile=data.surfaces[platform.type];
 if(!platform.ground&&profile){
  const rows=tables.get(platform.type),n=rows[0].length,{set,index}=gardenGirlPose(player);let top=Infinity;
  for(const sole of data.soles[set][index]){
    const sx=x+(player.facing===-1?-sole.x:sole.x),a=Math.max(platform.x,sx-1),b=Math.min(platform.x+platform.w,sx+1);if(a>=b)continue;
    const start=Math.max(0,Math.floor((a-platform.x)/platform.w*n)),end=Math.min(n-1,Math.ceil((b-platform.x)/platform.w*n)-1),length=end-start+1;
    if(length<1)continue;const level=Math.floor(Math.log2(length)),height=Math.min(rows[level][start],rows[level][end-(1<<level)+1]);top=Math.min(top,platform.y+height-sole.dy);
  }
  return top;
 }
 if(platform.hill){const {set,index}=gardenGirlPose(player);let exact=Infinity;for(const sole of data.soles[set][index]){const sx=x+(player.facing===-1?-sole.x:sole.x);if(sx>=platform.x&&sx<=platform.x+platform.w)exact=Math.min(exact,gardenSurfaceY(platform,sx)-sole.dy);}return exact;}
 return Math.min(gardenSurfaceY(platform,left),gardenSurfaceY(platform,right));
}

/** A física e o renderer escolhem a mesma pose, inclusive na marcha sensorial. */
export function gardenGirlPose(player,time=player.animationTime??0){
 if(player.onGround&&player.balancePose)return player.balancePose;
 let set=player.onGround?'menina-corrida-v1':'menina-acoes-v1';
 let index=player.onGround?(Math.abs(player.vx)>15?2+Math.floor(time*11)%6:Math.floor(time*2)%2):player.vy<-180?1:player.vy<80?2:3;
 if(player.discomfort>.4){set='menina-desconforto-v1';index=!player.onGround?6:Math.abs(player.vx)<10?7:player.terrain==='grass'?Math.floor(time*5)%4:4+Math.floor(time*16)%2;}
 if(player.terrain==='gravel'&&player.discomfort>.4&&player.onGround&&Math.abs(player.vx)>15){set='menina-pedrinhas-v2';index=Math.floor(time*9)%4;}
 return{set,index};
}
