import {brinquedaoBridgeSolid} from './BrinquedaoObstacles.js';
import {drawBrinquedaoSpring} from './BrinquedaoAttractions.js';
import {BRINQUEDAO_ART as ART} from './BrinquedaoArt.js';
import {brinquedaoSurface,brinquedaoNearby} from './BrinquedaoLevel.js';
/** Extrai apenas o componente medido, sem pixels de módulos vizinhos. */
export function prepareBrinquedaoParts(image,slide){const parts=ART.kit.frames.map((f,index)=>{const canvas=document.createElement('canvas');canvas.width=f.w;canvas.height=f.h;const ctx=canvas.getContext('2d');if(f.rowMask){ctx.beginPath();f.rowMask.forEach((r,y)=>y?ctx.lineTo(r[0],y):ctx.moveTo(r[0],y));for(let y=f.rowMask.length-1;y>=0;y--)ctx.lineTo(f.rowMask[y][1]+1,y+1);ctx.closePath();ctx.clip();}ctx.drawImage(image,f.x,f.y,f.w,f.h,0,0,f.w,f.h);const pixels=ctx.getImageData(0,0,f.w,f.h).data,surface=[];for(let x=0;x<f.w;x++){let found=Math.floor(f.h*.74);for(let y=Math.floor(f.h*.56);y<f.h-20;y++){let count=0,total=0;for(let yy=y;yy<y+18;yy+=3)for(let xx=Math.max(0,x-4);xx<=Math.min(f.w-1,x+4);xx+=2){total++;if(pixels[(yy*f.w+xx)*4+3]>160)count++;}if(count/total>.9){found=y+3;break;}}surface.push(found);}const smooth=surface.map((v,x)=>{const values=surface.slice(Math.max(0,x-12),x+13).sort((a,b)=>a-b);return values[Math.floor(values.length/2)];});return{canvas,index,surface:smooth};});
 const canvas=document.createElement('canvas');canvas.width=slide.width;canvas.height=slide.height;const ctx=canvas.getContext('2d');ctx.drawImage(slide,0,0);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data,surface=[];
 for(let x=0;x<canvas.width;x++){let y=0;while(y<canvas.height&&pixels[(y*canvas.width+x)*4+3]<160)y++;surface.push(y+22);}const smooth=surface.map((v,x)=>{const a=surface.slice(Math.max(0,x-6),x+7).sort((a,b)=>a-b);return a[Math.floor(a.length/2)];});parts.push({canvas,surface:smooth});return parts;}
function pillar(ctx,x,y,parts){const bottom=x>=14800?2200:1140;if(y>bottom-30)return;const image=parts[4].canvas;ctx.save();ctx.beginPath();ctx.roundRect(x-16,y,32,bottom-y,15);ctx.clip();ctx.drawImage(image,image.width*.087,image.height*.31,image.width*.039,image.height*.53,x-16,y,32,bottom-y);ctx.restore();}
/** Madeira, redes e acolchoados são material real do brinquedo, sem marcações auxiliares de salto. */
export function drawBrinquedaoTerrain(ctx,parts,left,right,s,attractions){for(const p of brinquedaoNearby(left-150,right+150)){
 if(p.kind==='spring'){for(const x of[p.from+50,p.to-50])pillar(ctx,x,p.y+100,parts);drawBrinquedaoSpring(ctx,attractions[0].canvas,p,s);continue;}
 if(p.kind==='balls'){const image=parts[2].canvas;ctx.drawImage(image,p.from-30,p.y-100,p.to-p.from+60,250);continue;}
 if(p.kind==='fragile'&&p.id.endsWith('-0'))pillar(ctx,p.from,brinquedaoSurface(p,p.from)+30,parts);if(p.kind==='fragile'&&p.id.endsWith('-3'))pillar(ctx,p.to,brinquedaoSurface(p,p.to)+30,parts);
 if(p.kind!=='fragile')for(let x=p.from+70;x<p.to-30;x+=360)pillar(ctx,x,brinquedaoSurface(p,x)+50,parts);
 if(p.kind==='slide'||p.kind==='reverse'){
  const margin=.08,k=.78;
  for(let x=Math.max(p.from,left-6);x<p.to&&x<right+6;x+=4){const u=(x-p.from)/(p.to-p.from),up=p.kind==='reverse'||p.bowlDepth&&u>.5,part=up&&!p.bowlDepth?attractions[3]:parts[4],image=part.canvas,sw=image.width*(1-2*margin),sample=p.bowlDepth?(u>.5?2-u*2:u*2):u,sx=Math.min(image.width-2,Math.floor(image.width*margin+sw*sample));const sh=Math.min(image.height,part.surface[sx]+145);ctx.drawImage(image,sx,0,Math.max(1,sw*4/(p.to-p.from)),sh,x,brinquedaoSurface(p,x)-part.surface[sx]*k,4.5,sh*k);}continue;
 }
 const fallen=p.kind==='fragile'&&!brinquedaoBridgeSolid(s,p),age=fallen?s.time-s.obstacles.bridges[p.id]-p.delay*(s.difficulty==='EASY'?1.6:1):0;if(fallen&&age>1.5)continue;ctx.save();if(fallen){ctx.translate(p.from,p.y+400*age*age);ctx.rotate(age*.32);ctx.translate(-p.from,-p.y);ctx.globalAlpha=Math.max(0,1-age/1.5);}
 const part=parts[['bridge','fragile'].includes(p.kind)?1:0],image=part.canvas,margin=.15,sw=image.width*(1-2*margin),height=p.kind==='fragile'?145:p.kind==='bridge'?215:250,k=height/image.height;
 // Registra o topo pintado no apoio físico; postes e rede permanecem atrás dos pés.
 for(let x=Math.max(p.from,left-6);x<p.to&&x<right+6;x+=4){const u=(x-p.from)/(p.to-p.from),sx=Math.min(image.width-2,Math.floor(image.width*margin+sw*u)),y=brinquedaoSurface(p,x)-part.surface[sx]*k;ctx.drawImage(image,sx,0,Math.max(1,sw*4/(p.to-p.from)),image.height,x,y,4.5,height);}
 ctx.restore();
}}
/** A frente opaca da piscina cobre a parte do corpo entre as bolas, sem parecer água. */
export function drawBrinquedaoBallsFront(ctx,parts,p,time,player){ctx.save();ctx.beginPath();ctx.rect(p.from-30,p.y-16,p.to-p.from+60,230);ctx.clip();ctx.drawImage(parts[2].canvas,p.from-30,p.y-100,p.to-p.from+60,250);ctx.restore();if(player.x<p.from||player.x>p.to)return;const energy=Math.min(1,Math.abs(player.vx)/400);for(let i=0;i<8;i++){const q=(time*1.7+i*.17)%1,x=player.x+(i-3.5)*12-player.facing*q*18,y=p.y-10-Math.sin(q*Math.PI)*30*energy,r=5+i%3;ctx.fillStyle=['#ef7158','#f5ca50','#47bcb2','#5c98d0'][i%4];ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,225,.6)';ctx.beginPath();ctx.arc(x-r*.3,y-r*.3,r*.28,0,Math.PI*2);ctx.fill();}}
