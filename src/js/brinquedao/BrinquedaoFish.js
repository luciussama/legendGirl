/** Peixes das pontes saltam em pontos fixos. Sua trajetória nunca depende da menina. */
export function brinquedaoFishSpecs(bridge){return[.34,.72].map((u,id)=>({id:bridge.id+'-'+id,x:bridge.from+(bridge.to-bridge.from)*u,y:bridge.y,period:2.7+id*.35,air:1.05,offset:id*1.4+(bridge.from%997)/600,facing:id?-1:1}));}
/** Mantém o salto de contato e prolonga a entrada/saída até abaixo da tela, sem aparições no aviso. */
export function brinquedaoFishPose(spec,time,depth=1600){
 const clock=((time+spec.offset)%spec.period+spec.period)%spec.period,active=clock<spec.air,lead=.6,local=clock>=spec.period-lead?clock-spec.period:clock,u=local/spec.air;
 const tail=local<0?-local:Math.max(0,local-spec.air),speed=250*Math.PI/spec.air,extra=Math.max(0,depth-speed*lead)/(lead*lead);
 const y=active?spec.y+100-Math.sin(u*Math.PI)*250:spec.y+100+speed*tail+extra*tail*tail;
 return{id:spec.id,x:spec.x+Math.sin(u*Math.PI*2)*40,y,active,visible:local>=-lead&&local<=spec.air+lead,u,facing:spec.facing,angle:-Math.cos(Math.max(0,Math.min(1,u))*Math.PI)*.45};
}
/** Apenas o corpo durante o salto causa o arremesso; cauda e aviso não causam contato. */
export function brinquedaoFishTouches(player,fish){if(!fish.active)return false;const x=Math.max(player.x-17,Math.min(player.x+17,fish.x)),y=Math.max(player.y-86,Math.min(player.y-6,fish.y));return((x-fish.x)/31)**2+((y-fish.y)/24)**2<=1;}
export function brinquedaoFishImpactAge(s){return s.obstacles.fishImpact.at===null?Infinity:s.time-s.obstacles.fishImpact.at;}

/** Apenas a aproximação visual usa as bordas laterais; o arco ativo e a colisão são idênticos. */
export function brinquedaoFishEntryPose(spec,time,bounds){
 const p=brinquedaoFishPose(spec,time);if(!p.visible||p.active||!bounds)return p;
 const before=p.u<0,t=Math.max(0,Math.min(1,before?(p.u*spec.air+.6)/.6:(p.u*spec.air-spec.air)/.6)),h00=2*t*t*t-3*t*t+1,h10=t*t*t-2*t*t+t,h01=-2*t*t*t+3*t*t,h11=t*t*t-t*t;
 const edge=spec.facing>0?bounds.left-150:bounds.right+150,end=spec.facing>0?bounds.right+150:bounds.left-150,base=spec.y+100,dy=250*Math.PI/spec.air*.6,dx=40*2*Math.PI/spec.air*.6;
 const startY=Math.min(base,bounds.floor-160),v=Math.max(0,Math.min(1,before?(t-.6)/.4:t/.4)),a=2*v*v*v-3*v*v+1,b=v*v*v-2*v*v+v,c=-2*v*v*v+3*v*v,d=v*v*v-v*v;
 // A aproximação fica acima dos botões até alcançar o corredor central no modo paisagem.
 const y=before?a*startY+c*base-d*dy*.4:a*base+b*dy*.4+c*startY;
 return{...p,x:before?h00*edge+h01*spec.x+h11*dx:h00*spec.x+h10*dx+h01*end,y};
}
