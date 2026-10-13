/** Ciclo de 28 quadros: apoio próximo, passagem, apoio distante, passagem. */
export function robotWalkRig(elapsed) {
  const phase=elapsed/28*Math.PI*2, angle=(1-Math.cos(phase))*Math.PI/4;
  const near={x:213,y:392,angle,shorten:1-.2*Math.max(0,-Math.sin(phase)),ankle:[280,474],bottom:553};
  const far={x:155,y:395,angle:-angle,shorten:1-.2*Math.max(0,Math.sin(phase)),ankle:[94,470],bottom:540};
  for(const leg of[near,far]){
    const dx=leg.ankle[0]-leg.x,dy=leg.ankle[1]-leg.y;
    leg.footX=leg.x+Math.cos(leg.angle)*dx-Math.sin(leg.angle)*dy;
    leg.footY=leg.y+(Math.sin(leg.angle)*dx+Math.cos(leg.angle)*dy)*leg.shorten;
  }
  const floor=Math.max(near.footY+near.bottom-near.ankle[1],far.footY+far.bottom-far.ankle[1]);
  return {near,far,floor,phase};
}
export function renderRobotWalk(ctx,image,frame,reference,elapsed,transportScale=1) {
  const factor=frame.displayScale*100/((reference.height-24)*reference.displayScale)*transportScale;
  const rig=robotWalkRig(elapsed);
  const shapes={near:[[190,378],[240,390],[279,427],[312,470],[215,470],[192,451],[165,419]],
    far:[[150,375],[190,395],[160,430],[147,470],[35,470],[72,436],[104,414]]};
  ctx.save();ctx.scale(factor,factor);ctx.translate(-frame.anchor.x,-rig.floor);
  for(const name of['far','near']) {
    const leg=rig[name],polygon=shapes[name];
    ctx.save();ctx.translate(leg.x,leg.y);ctx.scale(1,leg.shorten);ctx.rotate(leg.angle);ctx.translate(-leg.x,-leg.y);
    ctx.beginPath();polygon.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();ctx.drawImage(image,0,0);ctx.restore();
    const boot=name==='near'?{x:210,y:470,w:180,h:83}:{x:15,y:465,w:150,h:80};
    ctx.drawImage(image,boot.x,boot.y,boot.w,boot.h,leg.footX+boot.x-leg.ankle[0],leg.footY+boot.y-leg.ankle[1],boot.w,boot.h);
  }
  ctx.save();ctx.beginPath();ctx.rect(0,0,frame.width,395);ctx.clip();ctx.drawImage(image,0,0);ctx.restore();
  ctx.restore();
}
