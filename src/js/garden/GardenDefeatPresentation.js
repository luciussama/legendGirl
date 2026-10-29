const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
/** Corpos derrotados são apenas apresentação; suas coordenadas físicas não se movem. */
export function gardenDefeatFrame(enemy,groundY=enemy.baseY){
  if(enemy.alive)return{visible:true,alpha:1,x:enemy.x,y:enemy.y,rotation:0,squash:1};
  const age=Math.max(0,enemy.defeatAge),airborne=enemy.type==='bee'||Boolean(enemy.route)||Number.isFinite(groundY)&&enemy.y<groundY-4;
  if(airborne)return{visible:age<1.6,alpha:clamp((1.6-age)/.35,0,1),x:enemy.x+enemy.direction*45*age,y:enemy.y-150*age+680*age*age,rotation:enemy.direction*(Math.min(1,age/.22)*1.2+age*2),squash:1};
  const impact=clamp(age/.14,0,1),settle=impact*impact*(3-2*impact);
  return{visible:age<1.6,alpha:clamp((1.6-age)/.55,0,1),x:enemy.x,y:enemy.y,rotation:0,squash:1-.58*settle};
}
/** O relógio continua fora da vizinhança e nas cenas, mas congela com a pausa do host. */
export function advanceGardenDefeats(state,seconds){
  for(const enemy of [...state.enemies,...state.encounters.bees])if(!enemy.alive)enemy.defeatAge+=seconds;
}
