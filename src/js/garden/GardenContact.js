import {GARDEN_CONTACT as data} from './GardenContactData.js';
import {gardenSurfaceY} from './GardenLevel.js';
const tables=new Map(Object.entries(data.surfaces).map(([type,profile])=>{
 const rows=[profile.columns.map(v=>v===null?Infinity:v)];
 for(let size=2;size<=rows[0].length;size*=2){const prior=rows.at(-1),half=size/2;rows.push(prior.slice(0,prior.length-half).map((v,i)=>Math.min(v,prior[i+half])));}
 return[type,rows];
}));
/** Envelope dos sapatos completos, estável entre poses; espelha junto com a menina. */
export function gardenFeet(player,x=player.x){
 const b=player.terrain==='gravel'&&player.onGround&&Math.abs(player.vx)>15?data.gravelBounds:data.bounds;
 return player.facing===-1?{left:x-b.right,right:x-b.left}:{left:x+b.left,right:x+b.right};
}
/** Superfície sob os sapatos, medida por coluna da pintura. Transparência não vira apoio. */
export function gardenContactHeight(platform,player,x=player.x){
 const feet=gardenFeet(player,x),left=Math.max(platform.x,feet.left),right=Math.min(platform.x+platform.w,feet.right);
 if(right-left<.05)return Infinity;
 const profile=data.surfaces[platform.type];
 if(!platform.ground&&profile){
  const rows=tables.get(platform.type),n=rows[0].length,start=Math.max(0,Math.floor((left-platform.x)/platform.w*n)),end=Math.min(n-1,Math.ceil((right-platform.x)/platform.w*n)-1),length=end-start+1;
  if(length<1)return Infinity;const level=Math.floor(Math.log2(length));return platform.y+Math.min(rows[level][start],rows[level][end-(1<<level)+1]);
 }
 let top=Math.min(gardenSurfaceY(platform,left),gardenSurfaceY(platform,right));
 if(platform.hill){const waves=platform.waves??1;for(let i=0;i<waves;i++){const crest=platform.x+(i+.5)*platform.w/waves;if(crest>=left&&crest<=right)top=Math.min(top,platform.y-platform.hill);}}
 return top;
}
