/** Peixes das pontes saltam em pontos fixos. Sua trajetória nunca depende da menina. */
export function brinquedaoFishSpecs(bridge){return[.34,.72].map((u,id)=>({id:bridge.id+'-'+id,x:bridge.from+(bridge.to-bridge.from)*u,y:bridge.y,period:2.7+id*.35,air:1.05,offset:id*1.4+(bridge.from%997)/600,facing:id?-1:1}));}
export function brinquedaoFishPose(spec,time){const clock=(time+spec.offset)%spec.period,active=clock<spec.air,u=active?clock/spec.air:0;return{id:spec.id,x:spec.x+Math.sin(u*Math.PI*2)*40,y:spec.y+100-Math.sin(u*Math.PI)*250,active,warning:clock>spec.period-.45,warningX:spec.x,u,facing:spec.facing,angle:-Math.cos(u*Math.PI)*.45};}
/** Apenas o corpo durante o salto causa o arremesso; cauda e aviso não causam contato. */
export function brinquedaoFishTouches(player,fish){if(!fish.active)return false;const x=Math.max(player.x-17,Math.min(player.x+17,fish.x)),y=Math.max(player.y-86,Math.min(player.y-6,fish.y));return((x-fish.x)/31)**2+((y-fish.y)/24)**2<=1;}
export function brinquedaoFishImpactAge(s){return s.obstacles.fishImpact.at===null?Infinity:s.time-s.obstacles.fishImpact.at;}
