import {DREAM_LEAF,DREAM_BEE,DREAM_BRANCH,DREAM_SPIDER} from './DreamArt.js';
const SIZE=1024;
function canvas(width,height){const c=document.createElement('canvas');c.width=width;c.height=height;return c;}
function sample(values,u){const t=Math.max(0,Math.min(1,u))*(values.length-1),i=Math.floor(t);return values[i]+(values[Math.min(i+1,values.length-1)]-values[i])*(t-i);}
/** Registra a pintura na superfície anterior, sem recalcular colisões ou desenhar marcações de apoio. */
export function prepareDreamIllustrations(leafImage,branchImage){
  const leaves=new Map();
  for(const width of [360,500]){
    const a=DREAM_LEAF.frame,scale=SIZE/a.w,bitmap=canvas(SIZE,300),ctx=bitmap.getContext('2d');
    for(let x=0;x<SIZE;x++){const u=x/(SIZE-1),top=sample(DREAM_LEAF.tops,u),target=30*Math.pow((u-.5)*2,2)*SIZE/width;ctx.drawImage(leafImage,a.x+u*(a.w-1),a.y,a.w/SIZE,a.h,x,target+(a.y-top)*scale,1,a.h*scale);}
    leaves.set(width,bitmap);
  }
  const branches=new Map();
  for(const width of [460,560]){
    const a=DREAM_BRANCH.frame,scale=SIZE/a.w,bitmap=canvas(SIZE,400),ctx=bitmap.getContext('2d');
    for(let x=0;x<SIZE;x++){const u=x/(SIZE-1),top=sample(DREAM_BRANCH.tops,u),target=(12*Math.sin(Math.PI*u)+5*(2*u-1))*SIZE/width;ctx.drawImage(branchImage,a.x+u*(a.w-1),a.y,a.w/SIZE,a.h,x,32+target+(a.y-top)*scale,1,a.h*scale);}
    branches.set(width,bitmap);
  }
  return{leaves,branches};
}
/** Folha e caule pintados, com a base prolongada até fora do enquadramento. */
export function drawDreamLeaf(ctx,image,cache,f,bottom){
  const bitmap=cache.leaves.get(f.w),a=DREAM_LEAF.stem,scale=f.w/SIZE,join=f.y+52;
  ctx.drawImage(image,a.x,a.y,a.w,a.h,f.x+f.w*DREAM_LEAF.stemAnchor-13,join,27,bottom-join);
  ctx.drawImage(bitmap,f.x,f.y,f.w,bitmap.height*scale);
}
/** Batimento contínuo em torno da raiz, independente do movimento físico do apoio. */
export function dreamBeeWingPose(time){const beat=Math.sin(time*Math.PI*2*7);return{angle:-.15+beat*.14,spread:.22+(beat+1)*.36};}
/** A abelhinha do bem conserva o corpo e o cotonete; apenas as asas batem. */
export function drawDreamBee(ctx,image,f,time){
  const a=DREAM_BEE.wings,pose=dreamBeeWingPose(time),width=f.w*.88,height=width*a.h/a.w;
  ctx.save();ctx.translate(f.x+f.w*.42,f.y+f.h*.35);ctx.rotate(pose.angle);ctx.scale(1,pose.spread);ctx.drawImage(image,a.x,a.y,a.w,a.h,-width*.5,-height,width,height);ctx.restore();
  const b=DREAM_BEE.body,back=DREAM_BEE.back,scale=f.w/back.w;ctx.drawImage(image,b.x,b.y,b.w,b.h,f.x+(b.x-back.x)*scale,f.y+(b.y-back.y)*scale,b.w*scale,b.h*scale);
}

/** O tronco permanece ancorado; o galho ilustrado acompanha o vento e a superfície física. */
export function drawDreamBranch(ctx,image,cache,f,bottom,top){
  const a=DREAM_BRANCH.trunk,bitmap=cache.branches.get(f.w),scale=f.w/SIZE;
  ctx.drawImage(image,a.x,a.y,a.w,a.h,f.anchorX-108,top,125,bottom-top);
  ctx.drawImage(bitmap,f.x,f.y-32*scale,f.w,bitmap.height*scale);
}
/** Fio real de seda, retrátil com a aranha; não há superfície de apoio no inseto. */
export function drawDreamWeb(ctx,image,f,time){
  ctx.save();ctx.strokeStyle='rgba(210,225,235,.85)';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(f.x,f.spiderY+5);ctx.stroke();
  ctx.strokeStyle='rgba(248,245,232,.35)';ctx.lineWidth=.8;ctx.beginPath();for(let y=f.y;y<f.spiderY;y+=12)ctx.lineTo(f.x+Math.sin(y*.11)*1.7,y);ctx.stroke();
  const a=DREAM_SPIDER.frame,pulse=1+Math.sin(time*3+f.phase)*.012;ctx.translate(f.x,f.spiderY+f.spiderH*.5);ctx.scale(pulse,pulse);ctx.drawImage(image,a.x,a.y,a.w,a.h,-f.spiderW*.5,-f.spiderH*.5,f.spiderW,f.spiderH);ctx.restore();
}
