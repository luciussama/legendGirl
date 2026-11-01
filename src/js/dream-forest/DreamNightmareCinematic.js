import {drawRoachDust,roachScreenShake} from './DreamRoachEffects.js';
import {DREAM_NIGHTMARE_ART as ART} from './DreamNightmareArt.js';
import {dreamRoachPose,dreamRoachPoint,drawDreamRoach,drawDreamRoachReach} from './DreamRoach.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
/** Decupagem autorada; câmera e atores pertencem à cena, sem coordenadas da exploração. */
export function nightmareCinematicShot(age,portrait=false){
 const shot=age<2.2?'walk':age<3.1?'reaction':age<4.1?'eyes':'capture';
 const progress=shot==='walk'?smooth(age/2.2):shot==='reaction'?smooth((age-2.2)/.9):shot==='eyes'?smooth((age-3.1)):smooth((age-4.1)/1.9);
 return{shot,progress,focusX:shot==='eyes'?768:portrait?(shot==='walk'?720+100*progress:shot==='capture'?840-50*smooth((age-5.8)/.2):820):790,focusY:shot==='reaction'?640:shot==='capture'&&portrait?650:512,zoom:shot==='reaction'?(portrait?1.12+progress*.04:1.3+progress*.08):shot==='eyes'?1+progress*.1:1.02+progress*.035};
}
export function drawNightmareCinematicGirl(ctx,image,index,x,base,height,time,{walking=false,tilt=0}={}){const f=ART.cinematicGirl.frames[index],scale=height/ART.cinematicGirl.referenceHeight;ctx.save();ctx.translate(x,base+(walking?Math.sin(time*Math.PI*4)*2:0));ctx.rotate(tilt);ctx.scale(scale,scale*(walking?1:1+Math.sin(time*1.6)*.002));ctx.translate(-f.anchorX,-f.h);
 // A caixa da cabeça pode cruzar a sola da célula vizinha; recortar pelo componente original.
 if(f.topMask){ctx.beginPath();ctx.moveTo(0,24);ctx.lineTo(0,f.h);ctx.lineTo(f.w,f.h);ctx.lineTo(f.w,24);for(let i=23;i>=0;i--)ctx.lineTo(f.topMask[i][1]+1,i+1);for(let i=0;i<24;i++)ctx.lineTo(f.topMask[i][0],i);ctx.closePath();ctx.clip();}
 ctx.filter='brightness(.72) saturate(.85)';ctx.drawImage(image,f.x,f.y,f.w,f.h,0,0,f.w,f.h);ctx.restore();}
/** Planos na altura dos olhos, revelação da criatura e captura em primeiro plano. */
export function renderNightmareCinematic(ctx,canvas,s,images,rig){
 const {width,height}=canvas,age=s.age,t=s.nightmare.time,shot=nightmareCinematicShot(age,height>width),bg=images.get(ART.cinematicForest.file),actor=images.get(ART.cinematicGirl.file),scale=Math.max(width/1536,height/1024)*shot.zoom;
 const stompAge=age>=5.65?age-5.65:-1,shake=age>=3.1?roachScreenShake(t,140,stompAge):{x:0,y:0};
 ctx.save();ctx.translate(shake.x*width/(canvas.clientWidth||width),shake.y*width/(canvas.clientWidth||width));ctx.fillStyle='#02040a';ctx.fillRect(0,0,width,height);ctx.translate(width/2,height/2);ctx.scale(scale,scale);const halfW=width/scale/2,halfH=height/scale/2,focusX=Math.max(halfW,Math.min(1536-halfW,shot.focusX)),focusY=Math.max(halfH,Math.min(1024-halfH,shot.focusY));ctx.translate(-focusX,-focusY);
 ctx.drawImage(bg,0,0,1536,1024);ctx.fillStyle='rgba(0,3,12,.28)';ctx.fillRect(0,0,1536,1024);
 if(shot.shot==='walk'||shot.shot==='reaction'){
  const x=shot.shot==='walk'?720+100*shot.progress:820;ctx.save();ctx.filter='blur(9px)';ctx.fillStyle='rgba(0,0,0,.58)';ctx.beginPath();ctx.ellipse(x,916,90,13,0,0,Math.PI*2);ctx.fill();ctx.restore();
  drawNightmareCinematicGirl(ctx,actor,shot.shot==='walk'?Math.floor(age*3)%2:2,x,920,475,t,{walking:shot.shot==='walk'});
 }else{
  const close=shot.shot==='eyes',q=shot.progress,p={x:close?768:height>width?730-15*q:620-160*q,y:close?430:280+q*90,width:close?3000:height>width?1500+200*q:2000+q*650,pose:dreamRoachPose(t,140),velocity:140};
  ctx.save();ctx.globalAlpha=close?1:.6+.4*q;drawDreamRoach(ctx,rig,p,{reaching:!close&&age>4.4});ctx.restore();
  for(const [u,v]of ART.roach.eyes){const eye=dreamRoachPoint(p,u,v,{head:true}),r=close?90:58,g=ctx.createRadialGradient(eye.x,eye.y,2,eye.x,eye.y,r);g.addColorStop(0,'rgba(255,237,172,.9)');g.addColorStop(.18,'rgba(255,191,75,.45)');g.addColorStop(1,'rgba(255,161,40,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(eye.x,eye.y,r,0,Math.PI*2);ctx.fill();}
  if(!close){drawRoachDust(ctx,rig,p,t,{stompAge,stompPoint:{x:840,y:940}});const lift=smooth((age-5.8)/.2),x=840-50*lift,base=940-100*lift;drawNightmareCinematicGirl(ctx,actor,3,x,base,height>width?440:475,t,{tilt:-.12*lift});drawDreamRoachReach(ctx,rig,p,{x:x-30,y:base-190},smooth((age-4.4)/1.6));}
 }
 ctx.restore();
 // Escurece apenas as bordas do plano; o instante do contato permanece visível até o corte.
 ctx.save();const shade=ctx.createRadialGradient(width*.5,height*.5,Math.min(width,height)*.25,width*.5,height*.5,Math.max(width,height)*.72);shade.addColorStop(0,'rgba(0,0,0,0)');shade.addColorStop(1,'rgba(0,1,7,.72)');ctx.fillStyle=shade;ctx.fillRect(0,0,width,height);ctx.restore();
}
