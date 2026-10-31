import {drawDreamSpider} from './DreamSpiderPuppet.js';
import {dreamGrassX} from './DreamLevel.js';
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
  // As pontas da bifurcação dissolvem sobre a mesma casca que prolonga o tronco.
  const trunk=DREAM_BRANCH.trunk,join=canvas(trunk.w,trunk.h),jc=join.getContext('2d');jc.drawImage(branchImage,trunk.x,trunk.y,trunk.w,trunk.h,0,0,trunk.w,trunk.h);jc.globalCompositeOperation='destination-in';const feather=jc.createLinearGradient(0,0,0,trunk.h);feather.addColorStop(0,'transparent');feather.addColorStop(.07,'white');feather.addColorStop(.93,'white');feather.addColorStop(1,'transparent');jc.fillStyle=feather;jc.fillRect(0,0,trunk.w,trunk.h);branches.set('trunk',join);
  // Uma faixa por linha elimina bordas de amostragem entre peças repetidas da casca.
  for(const [name,start] of [['barkUpper',20],['barkLower',700]]){const bark=canvas(300,4096),bc=bark.getContext('2d');for(let y=0;y<bark.height;y++){const sy=start+(1-Math.cos(y*Math.PI/240))*.5*170;bc.drawImage(branchImage,0,sy,300,1,0,y,300,1);}branches.set(name,bark);}
  // Reutiliza pigmento e borda pintados: a faixa segue a mesma haste física.
  const grass=canvas(80,1024),gc=grass.getContext('2d'),a=DREAM_LEAF.frame;
  const rotated=canvas(a.h,a.w),rc=rotated.getContext('2d');rc.translate(0,a.w);rc.rotate(-Math.PI/2);rc.drawImage(leafImage,a.x,a.y,a.w,a.h,0,0,a.w,a.h);
  const pixels=rc.getImageData(0,0,rotated.width,rotated.height).data;
  for(let y=0;y<1024;y++){const sy=Math.min(a.w-1,Math.floor(y/1023*(a.w-1)));let left=0,right=a.h-1;while(left<right&&pixels[(sy*a.h+left)*4+3]<24)left++;while(right>left&&pixels[(sy*a.h+right)*4+3]<24)right--;const span=right-left+1,w=Math.max(3,span/a.h*66);gc.drawImage(rotated,left,sy,span,1,40-w/2,y,w,1.2);}
  rotated.width=0;
  const stem=canvas(48,512),sc=stem.getContext('2d'),st=DREAM_LEAF.stem,raw=canvas(st.w,st.h),sr=raw.getContext('2d');sr.drawImage(leafImage,st.x,st.y,st.w,st.h,0,0,st.w,st.h);const alpha=sr.getImageData(0,0,st.w,st.h).data;
  for(let y=0;y<512;y++){const sy=Math.min(st.h-1,Math.floor(y/512*st.h));let l=0,r=st.w-1;while(l<r&&alpha[(sy*st.w+l)*4+3]<64)l++;while(r>l&&alpha[(sy*st.w+r)*4+3]<64)r--;const w=24+18*y/512;sc.drawImage(raw,l,sy,r-l+1,1,24-w/2,y,w,1.2);}
  raw.width=0;
  return{leaves,branches,grass,stem};
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
  const naturalScale=125/a.w,origin=f.y-275*naturalScale;
  // A bifurcação conserva proporções; somente casca sem galhos prolonga o tronco.
  const upper=cache.branches.get('barkUpper'),lower=cache.branches.get('barkLower'),extent=upper.height*naturalScale;
  ctx.drawImage(upper,f.anchorX-108,origin+62*naturalScale-extent,125,extent);
  ctx.drawImage(lower,f.anchorX-108,origin+(a.h-62)*naturalScale,125,extent);
  ctx.drawImage(cache.branches.get('trunk'),f.anchorX-108,origin,125,a.h*naturalScale);
  ctx.drawImage(bitmap,f.x,f.y-32*scale,f.w,bitmap.height*scale);
}
/** Fio real de seda, retrátil com a aranha; não há superfície de apoio no inseto. */
export function drawDreamWeb(ctx,image,f,time,puppet){
  ctx.save();ctx.strokeStyle='rgba(210,225,235,.85)';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(f.x,f.spiderY+5);ctx.stroke();
  ctx.strokeStyle='rgba(248,245,232,.35)';ctx.lineWidth=.8;ctx.beginPath();for(let y=f.y;y<f.spiderY;y+=12)ctx.lineTo(f.x+Math.sin(y*.11)*1.7,y);ctx.stroke();
  if(puppet)drawDreamSpider(ctx,puppet,f,time);else{const a=DREAM_SPIDER.frame;ctx.drawImage(image,a.x,a.y,a.w,a.h,f.x-f.spiderW/2,f.spiderY,f.spiderW,f.spiderH);}ctx.restore();
}

/** Pigmentos e pequenas irregularidades da folha acompanham o eixo da grama no vento. */
export function drawDreamGrass(ctx,image,cache,f,bottom){
  const join=f.y+f.h-32,length=bottom-join,steps=256,bend=5+Math.sin(f.phase||f.x)*3;
  for(let i=0;i<steps;i++){const u=i/steps,y=join+length*u,below=Math.max(0,y-f.y-f.h),x=dreamGrassX(f,y)+Math.sin(Math.min(1,below/1200)*Math.PI)*bend,w=7+Math.min(1,below/1000)*13;ctx.drawImage(cache.stem,0,u*512,48,512/steps,x-w/2,y,w,length/steps+.4);}
  const variant=Math.sin(f.phase||f.x),width=42+variant*5,bitmap=cache.grass;
  for(let i=0;i<512;i++){const u=i/512,y=f.y+f.h*u,x=dreamGrassX(f,y);ctx.drawImage(bitmap,0,u*1024,80,2,x-width/2,y,width,f.h/512+.35);}
}

/** Faixa de floresta sem espelhamento: a névoa dissolve as bordas da pintura. */
export function prepareDreamBackdrop(image){
  const c=canvas(image.width,image.height),ctx=c.getContext('2d');ctx.drawImage(image,0,0);ctx.globalCompositeOperation='destination-in';const fade=ctx.createLinearGradient(0,0,c.width,0);fade.addColorStop(0,'transparent');fade.addColorStop(.17,'white');fade.addColorStop(.83,'white');fade.addColorStop(1,'transparent');ctx.fillStyle=fade;ctx.fillRect(0,0,c.width,c.height);return c;
}
export function drawDreamBackdrop(ctx,image,width,height,x){
  const scale=Math.max(width/image.width,height/image.height),w=image.width*scale,h=image.height*scale,step=w*.74,offset=-((x*.10)%step);
  ctx.fillStyle='#10283b';ctx.fillRect(0,0,width,height);
  for(let i=-1;i<Math.ceil(width/step)+2;i++)ctx.drawImage(image,offset+i*step,(height-h)/2,w,h);
}
