import {GARDEN_BEETLE as ART} from '../garden/GardenBeetleArt.js';
/** Juntas na pintura original, sem substituir a identidade do besouro nem o contorno do lombo. */
const JOINTS=[
  {name:'hind',pivot:[265,345],points:[[270,306],[309,347],[228,444],[89,574],[0,582],[0,485],[150,372]]},
  {name:'middle',pivot:[430,373],points:[[434,337],[478,371],[374,527],[279,603],[187,603],[224,521],[326,409]]},
  {name:'front',pivot:[575,470],points:[[576,437],[627,471],[527,591],[466,626],[373,626],[401,558],[480,491]]},
  {name:'head',pivot:[710,385],points:[[518,280],[715,237],[791,161],[996,161],[996,553],[651,568],[510,474]]}
];
function polygon(ctx,points){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();}
function canvas(width,height){const c=document.createElement('canvas');c.width=width;c.height=height;return c;}
/** Separa cabeça e patas em cache uma vez; o dorso rígido mantém os pixels usados pelo apoio. */
export function prepareDreamBeetle(image){
  if(!image)return null;
  const b=ART.body,body=canvas(b.w,b.h),paint=body.getContext('2d');paint.drawImage(image,b.x,b.y,b.w,b.h,0,0,b.w,b.h);
  const parts=JOINTS.map(j=>{const left=Math.max(0,Math.floor(Math.min(...j.points.map(p=>p[0])))),top=Math.max(0,Math.floor(Math.min(...j.points.map(p=>p[1])))),right=Math.min(b.w,Math.ceil(Math.max(...j.points.map(p=>p[0])))),bottom=Math.min(b.h,Math.ceil(Math.max(...j.points.map(p=>p[1])))),bitmap=canvas(right-left,bottom-top),ctx=bitmap.getContext('2d');ctx.translate(-left,-top);polygon(ctx,j.points);ctx.clip();ctx.drawImage(image,b.x,b.y,b.w,b.h,0,0,b.w,b.h);return{...j,left,top,bitmap};});
  paint.globalCompositeOperation='destination-out';for(const j of JOINTS){polygon(paint,j.points);paint.fill();}paint.globalCompositeOperation='source-over';return{body,parts};
}
/** Movimento secundário contínuo: asas rápidas no voo, patas alternadas e cabeça/antenas vivas. */
export function dreamBeetlePose(time,energy=.3){const beat=time*Math.PI*2*(4+energy*3);return{wings:[Math.sin(beat),Math.sin(beat+.85)],legs:[0,2.2,4.4].map(phase=>Math.sin(time*(3+energy*4)+phase)*(.06+energy*.13)),head:Math.sin(time*2.5)*.022+Math.sin(time*.8)*.012,energy};}
function part(ctx,p,angle){ctx.save();ctx.translate(...p.pivot);ctx.rotate(angle);ctx.drawImage(p.bitmap,p.left-p.pivot[0],p.top-p.pivot[1]);ctx.restore();}
/** O apoio permanece no casco; asas membranosas e membros articulam em torno dele. */
export function drawDreamBeetle(ctx,image,parts,frame,time){
  if(!image||!parts)return;const b=ART.body,w=ART.wings,pose=dreamBeetlePose(time,frame.flightEnergy??.3);
  ctx.save();ctx.translate(frame.x,frame.y);ctx.scale(frame.w/b.w,frame.h/b.h);
  for(let i=0;i<2;i++){ctx.save();ctx.translate(550+i*25,315+i*18);ctx.rotate(-.16+i*.22+pose.wings[i]*.18*pose.energy);ctx.scale(1,.18+(.35+.35*pose.wings[i])*(.4+pose.energy*.6));ctx.globalAlpha=.66+i*.12;ctx.drawImage(image,w.x,w.y,w.w,w.h,-655,-220,655,655*w.h/w.w);ctx.restore();}
  for(let i=0;i<3;i++)part(ctx,parts.parts[i],pose.legs[i]);
  ctx.drawImage(parts.body,0,0);part(ctx,parts.parts[3],pose.head);ctx.restore();
}
