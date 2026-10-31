import {DREAM_SPIDER} from './DreamArt.js';
const LEFT=[
  {root:[515,505],points:[[515,505],[500,355],[465,275],[418,275],[260,342],[135,493],[106,621],[134,699],[170,665],[182,548],[302,430],[426,343],[448,472]]},
  {root:[544,589],points:[[544,589],[492,455],[457,397],[403,383],[286,451],[200,596],[166,751],[179,844],[222,890],[243,854],[218,749],[265,637],[352,530],[453,476],[500,592]]},
  {root:[564,649],points:[[564,649],[504,573],[464,522],[423,510],[369,570],[327,679],[329,788],[392,873],[470,921],[489,906],[436,849],[399,767],[425,664],[451,595],[511,655]]},
  {root:[552,645],points:[[552,600],[520,600],[498,633],[517,704],[560,757],[616,797],[651,791],[657,766],[620,707],[572,663]]}
];
/** Recorta somente membros já pintados; preserva corpo, relógio, fio e alcance físico. */
export function prepareDreamSpider(image){
  const a=DREAM_SPIDER.frame,body=document.createElement('canvas');body.width=a.w;body.height=a.h;const bc=body.getContext('2d');bc.drawImage(image,a.x,a.y,a.w,a.h,0,0,a.w,a.h);
  const parts=[];
  for(let side=0;side<2;side++)for(let index=0;index<4;index++){
    const leg=LEFT[index],mirror=p=>[side?1490-p[0]:p[0],p[1]],points=leg.points.map(mirror),root=mirror(leg.root),x=Math.min(...points.map(p=>p[0]))-2,y=Math.min(...points.map(p=>p[1]))-2,w=Math.ceil(Math.max(...points.map(p=>p[0]))-x+2),h=Math.ceil(Math.max(...points.map(p=>p[1]))-y+2),bitmap=document.createElement('canvas');bitmap.width=w;bitmap.height=h;const ctx=bitmap.getContext('2d');
    const path=(c,ox,oy)=>{c.beginPath();points.forEach(([px,py],i)=>i?c.lineTo(px-ox,py-oy):c.moveTo(px-ox,py-oy));c.closePath();};
    ctx.save();path(ctx,x,y);ctx.clip();ctx.drawImage(image,-x,-y);ctx.restore();bc.save();bc.globalCompositeOperation='destination-out';path(bc,a.x,a.y);bc.fill();bc.restore();parts.push({bitmap,x,y,root,index,side});
  }
  return{body,parts};
}
/** Quatro pares alternam recolhimento e alcance, como quem trabalha a seda ao subir. */
export function drawDreamSpider(ctx,puppet,f,time){
  const a=DREAM_SPIDER.frame,scale=f.spiderW/a.w;ctx.save();ctx.translate(f.x-f.spiderW/2,f.spiderY);ctx.scale(scale,f.spiderH/a.h);ctx.translate(-a.x,-a.y);
  for(const p of puppet.parts){const beat=Math.sin(time*4.4+p.index*1.05+f.phase),angle=(p.side?-1:1)*(.065*beat+.025*Math.sin(time*2.1+p.index));ctx.save();ctx.translate(...p.root);ctx.rotate(angle);ctx.drawImage(p.bitmap,p.x-p.root[0],p.y-p.root[1]);ctx.restore();}
  ctx.drawImage(puppet.body,a.x,a.y);ctx.restore();
}
