import {DREAM_MUD_LAKES,mudLakeAt,mudGround,mudCheckpoint} from './DreamMud.js';
import {DREAM_NIGHTMARE_ART as ART} from './DreamNightmareArt.js';
/** Percurso próprio da perseguição; nenhuma coordenada do sonho aéreo é alterada. */
export const STEALTH_LEVEL=Object.freeze({entry:220,exit:8750,width:9300,ground:850,speed:125,gravity:1500,jumpSpeed:680,mudStart:4400});
/** Elevações de terra contínua: subida íngreme, topo natural e descida de volta ao caminho. */
export const STEALTH_PLATFORMS=Object.freeze([{from:2520,to:2980,y:775},{from:3240,to:3700,y:750},{from:3960,to:4280,y:785}].map(Object.freeze));
/** Nunca há vazio sob Yuna. Os pés usam o contorno pintado do topo e a terra sustenta as laterais. */
export function stealthGround(x){
 const wet=mudGround(x);if(wet!==null)return wet;
 const platform=STEALTH_PLATFORMS.find(p=>x>=p.from&&x<=p.to+120);if(!platform)return STEALTH_LEVEL.ground;
 const a=ART.shelters.frames[2].surface,w=platform.to-platform.from+70;
 const top=position=>{const t=Math.max(0,Math.min(64,(position-platform.from+35)/w*64)),i=Math.min(63,Math.floor(t));return platform.y-22+(a[i]+(a[i+1]-a[i])*(t-i))*235;};
 if(x<=platform.to)return top(x);
 const t=(x-platform.to)/120,q=t*t*(3-2*t);return top(platform.to)*(1-q)+STEALTH_LEVEL.ground*q;
}
/** Pedras, cepos e troncos ficam logo atrás de Yuna, com contato visual próximo. */
export const STEALTH_COVERS=Object.freeze([...Array.from({length:12},(_,i)=>{
 const kind=i<6?'rock':'trunk',frame=i<6?i%3:(i-6)%2,source=kind==='rock'?ART.rocks:ART.shelters,w=kind==='rock'?[250,282,240][frame]:[270,310][frame],h=kind==='rock'?[245,220,240][frame]:[215,185][frame],x=220+i*360,ground=stealthGround(x),base=ground-25;
 return Object.freeze({id:'stealth-cover-'+i,index:i,kind,x,w,h,frame,base,polygon:Object.freeze(source.frames[frame].outline.map(([u,v])=>Object.freeze({x:x-w/2+u*w,y:base-h+v*h})))});
}),...DREAM_MUD_LAKES.slice(0,-1).map((lake,i)=>{const x=(lake.to+DREAM_MUD_LAKES[i+1].from)/2,w=260,h=205,base=stealthGround(x)-25,frame=i%2;return Object.freeze({id:'mud-bank-cover-'+i,index:12+i,kind:'trunk',x,w,h,base,frame,polygon:Object.freeze(ART.shelters.frames[frame].outline.map(([u,v])=>Object.freeze({x:x-w/2+u*w,y:base-h+v*h})))});})]);
export const STEALTH_MUD=DREAM_MUD_LAKES;
/** Compatibilidade: agora devolve o lago atravessável, com margem e trajeto próprios. */
export function stealthMudAt(x){return mudLakeAt(x);}
/** Índice da atuação furtiva compartilhado entre pintura e amostras físicas. */
export function stealthPose(n){return !n.grounded?5:Math.abs(n.vx)>1?1+Math.floor(n.animTime)%4:0;}
/** Checkpoints de setor evitam repetir o prólogo e a música a cada derrota. */
export function stealthCheckpoint(index){return index===0?{x:220,mudDepth:0}:index===1?{x:2380,mudDepth:0}:mudCheckpoint(index);}
