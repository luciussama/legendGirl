import {DREAM_CLIMB_CYCLE as ART,DREAM_CLIMB_CONTACTS} from './DreamArt.js';
import {DREAM as C,DREAM_BY_ID,dreamObjectFrame,dreamGrassX} from './DreamLevel.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
/** Contato visual com a pintura do corpo, sem usar asas móveis ou mudar a colisão. */
export function dreamClimbContact(frame,y,side){
  if(['grass','web'].includes(frame.kind))return{x:dreamGrassX(frame,y),y};
  const rows=DREAM_CLIMB_CONTACTS[frame.kind],at=(y-frame.y)/frame.w;let best=rows[0];
  for(const row of rows)if(Math.abs(row[0]-at)<Math.abs(best[0]-at))best=row;
  return{x:frame.x+best[side<0?1:2]*frame.w-side*1.5,y:frame.y+best[0]*frame.w};
}
/** Borda ilustrada usada apenas pela animação de puxar o corpo para cima do inseto. */
function topContact(frame,x){const u=(x-frame.x)/frame.w,rows=DREAM_CLIMB_CONTACTS[frame.kind],row=rows.find(r=>u>=r[1]&&u<=r[2]);return row?{x,y:frame.y+row[0]*frame.w}:dreamClimbContact(frame,frame.y,-1);}
/** O deslocamento na escalada governa o ciclo; vento e espera não fazem braços/pernas marcharem. */
export function dreamClimbPose(player,frame){
  const grip=frame.y+player.climb.u*frame.h,side=player.climb.side??-player.facing,stem=['grass','web'].includes(frame.kind),top=stem?null:topContact(frame,player.x),remaining=top?player.y-top.y:Infinity;
  const phase=(((-player.climb.u*frame.h)%ART.stride)+ART.stride)%ART.stride/ART.stride;
  let index=Math.floor(phase*4);
  if(remaining<58)index=remaining<26?5:4;
  const source=ART.frames[index],point=index>=4?top:dreamClimbContact(frame,stem?grip:player.y-64,side),upper=index>=4?point:dreamClimbContact(frame,(stem?grip:player.y-64)-18,side),angle=index>=4?0:clamp(Math.atan2(upper.x-point.x,Math.max(1,point.y-upper.y)),-.22,.22);
  return{index,source,point,angle:angle+(index<4?side*.28*Math.sin(phase*Math.PI*2)**2:0),facing:-side,scale:C.bodyHeight/ART.referenceHeight};
}
/** A mão pintada é a âncora do sprite; a física e a pose em pé continuam independentes. */
export function drawDreamClimb(ctx,image,state){
  const p=state.player,frame=dreamObjectFrame(DREAM_BY_ID.get(p.climb.id),state.time,state.rides),pose=dreamClimbPose(p,frame),f=pose.source;
  ctx.save();ctx.translate(pose.point.x,pose.point.y);ctx.rotate(pose.angle);ctx.scale(pose.facing*pose.scale,pose.scale);ctx.drawImage(image,f.x,f.y,f.w,f.h,-f.hand[0],-f.hand[1],f.w,f.h);ctx.restore();
}
