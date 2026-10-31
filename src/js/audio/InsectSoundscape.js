import {dreamNearby,dreamObjectFrame} from '../dream-forest/DreamLevel.js';
/** Emissores acompanham os corpos e os estados reais de voo, sem mudar a simulação. */
export function insectEmitters(state,scene='garden'){
  if(!state?.player||state.nightmare)return [];
  if(scene==='dream')return dreamNearby(state.player.x-850,state.player.x+850).filter(o=>o.kind==='bee'||o.kind==='beetle').map(o=>{const f=dreamObjectFrame(o,state.time,state.rides);return{id:o.id,kind:o.kind==='bee'?'bee':'beetle',x:f.x+f.w/2,y:f.y+f.h/2,energy:f.flightEnergy??.8};});
  const e=state.encounters;if(!e)return [];
  const emitters=e.bees.filter(b=>b.alive).map(b=>({id:b.id,kind:b.phase==='dive'?'dive':'bee',x:b.x,y:b.y,energy:b.phase==='dive'?1:.65}));
  const beetle=e.panic??e.exit;if(beetle)emitters.push({id:'besouro-encontro',kind:'beetle',x:beetle.x,y:beetle.y,energy:e.panic?1:1-beetle.age});
  return emitters;
}
/** No máximo três insetos próximos; distância vertical também atenua a camada de asas. */
export function audibleInsects(state,scene){
  const p=state.player;if(!p)return [];
  return insectEmitters(state,scene).map(e=>{const dx=e.x-p.x,distance=Math.hypot(dx,(e.y-(p.y-44))*.8);return{...e,volume:.26*e.energy*Math.max(0,1-distance/800)**2,pan:Math.max(-.85,Math.min(.85,dx/600)),rate:e.kind==='beetle'?.84+.18*e.energy:1+.12*e.energy};}).filter(e=>e.volume>.001).sort((a,b)=>b.volume-a.volume).slice(0,3);
}
