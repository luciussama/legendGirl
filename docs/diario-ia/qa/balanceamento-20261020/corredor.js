import { CHASE_CONFIG as C } from '../../../../src/js/bear-chase/ChaseConfig.js';
/** Interseção livre para o centro do corpo; inclui raio, largura dos brinquedos e limites da pista. */
export function corridors(group) {
 let free=[[-C.halfWidth,C.halfWidth]];
 for(const o of group){const l=o.x-o.width/2-C.radius,r=o.x+o.width/2+C.radius;free=free.flatMap(([a,b])=>r<=a||l>=b?[[a,b]]:[[a,Math.min(b,l)],[Math.max(a,r),b]].filter(([x,y])=>y>x));}
 return free;
}
export function targetFor(state,margin=.1) {
 const next=state.obstacles.filter(o=>o.z>=state.distance-margin&&!o.hit).sort((a,b)=>a.z-b.z)[0];
 if(!next)return 0;
 const options=corridors(state.obstacles.filter(o=>Math.abs(o.z-next.z)<.01&&!o.hit)).map(([l,r])=>(l+r)/2);
 return options.sort((a,b)=>Math.abs(a-state.x)-Math.abs(b-state.x))[0];
}
