import {BRINQUEDAO_ART as ART} from './BrinquedaoArt.js';
import {BRINQUEDAO_INSIDE as C,BRINQUEDAO_TUBES,brinquedaoTubePose} from './BrinquedaoTubes.js';
import {brinquedaoFishSpecs,brinquedaoFishPose} from './BrinquedaoFish.js';
import {drawBrinquedaoGirl,drawBrinquedaoFairy} from './BrinquedaoCinematic.js';
import {drawBrinquedaoBallsFront} from './BrinquedaoTerrain.js';
import {drawMobileGameControls} from '../ui/TouchGameControls.js';
import {getDialogueSafeArea} from '../ui/DialogueSafeArea.js';
const meshes=BRINQUEDAO_TUBES.map((t,index)=>Array.from({length:Math.ceil(t.length/8)},(_,n)=>brinquedaoTubePose(index,n*8/t.length)));
function crops(image,set){return set.frames.map(f=>{const canvas=document.createElement('canvas');canvas.width=f.w;canvas.height=f.h;const ctx=canvas.getContext('2d');ctx.beginPath();f.rowMask.forEach((r,y)=>y?ctx.lineTo(r[0],y):ctx.moveTo(r[0],y));for(let y=f.rowMask.length-1;y>=0;y--)ctx.lineTo(f.rowMask[y][1]+1,y+1);ctx.closePath();ctx.clip();ctx.drawImage(image,f.x,f.y,f.w,f.h,0,0,f.w,f.h);return{canvas};});}
/** Recortes completos; o cilindro pintado é deformado no desenho, preservando o PNG original. */
export function prepareBrinquedaoInterior(images){return[...crops(images.get(ART.insideTubes.file),ART.insideTubes),...crops(images.get(ART.fish.file),ART.fish)];}
/** Entrada visível no antigo terraço final justifica a passagem para o ambiente coberto. */
export function drawBrinquedaoInteriorDoor(ctx,parts){const image=parts[1].canvas,w=240;ctx.drawImage(image,35380-w/2,-1250-w*image.height/image.width+12,w,w*image.height/image.width);}
function fish(ctx,parts,spec,pose){const image=parts[2+(spec.id%2)*2+(pose.u<.5?0:1)].canvas,w=96,k=w/image.width;ctx.save();ctx.translate(pose.x,pose.y);ctx.rotate(pose.angle*pose.facing);ctx.scale(pose.facing,1);ctx.drawImage(image,-image.width*.6*k,-image.height*.6*k,w,image.height*k);ctx.restore();}
function pad(ctx,parts,x,width){const image=parts[0].canvas,h=200,k=h/image.height,surface=parts[0].surface[Math.floor(image.width/2)];ctx.drawImage(image,x,850-surface*k,width,h);}
function poolBack(ctx,r,i){const image=r.parts[2].canvas;ctx.drawImage(image,240,800,2120,250);pad(ctx,r.parts,0,320);pad(ctx,r.parts,2280,320);
 const shaft=r.insideParts[0].canvas;ctx.drawImage(shaft,shaft.width*.16,0,shaft.width*.68,shaft.height,-900,235,1040,210);ctx.drawImage(shaft,shaft.width*.16,0,shaft.width*.68,shaft.height,2460,635,1100,210);const mouth=r.insideParts[1].canvas,w=230,h=w*mouth.height/mouth.width;ctx.drawImage(mouth,25,450-h,w,h);ctx.drawImage(mouth,2390,870-h,w,h);
 for(const spec of brinquedaoFishSpecs(i.section,i.leg)){const pose=brinquedaoFishPose(spec,i.poolTime);if(pose.warning){ctx.fillStyle='#ffd65d';for(let n=0;n<4;n++){ctx.beginPath();ctx.arc(pose.warningX+(n-1.5)*14,884-Math.abs(Math.sin(i.poolTime*20+n))*9,7,0,Math.PI*2);ctx.fill();}}if(pose.active)fish(ctx,r.insideParts,spec,pose);}
}
function poolFront(ctx,r,i){drawBrinquedaoBallsFront(ctx,r.parts,{from:240,to:2360,y:900},i.poolTime,i.player);}
function tube(ctx,r,index,center,worldW,worldH){const image=r.insideParts[0].canvas,sw=image.width*.68;
 for(const p of meshes[index]){if(Math.abs(p.x-center.x)>worldW*.75+180||Math.abs(p.y-center.y)>worldH*.75+180)continue;const sx=image.width*.16+(p.distance%680)/680*sw;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.drawImage(image,sx,0,Math.max(1,sw*8/680),image.height,-1,-105,10,210);ctx.restore();}
}
/** Interior em camadas: a velocidade real dos tubos contrasta com repouso e leitura dos saltos dos peixes. */
export function renderBrinquedaoInterior(r,s,{touch=false,paused=false}={}){const {canvas,ctx}=r,{width,height}=canvas,i=s.interior,safe=getDialogueSafeArea(canvas),css=width/(canvas.clientWidth||width),portrait=height>width,reserve=portrait?205*css:40*css,k=Math.min((safe.right-safe.left)/850,(safe.bottom-safe.top-reserve)/1050),worldW=width/k,worldH=height/k,index=i.section*3+i.leg,pose=brinquedaoTubePose(index,i.u),drop=Math.min(1,i.age/.7),anchor=safe.top+(safe.bottom-safe.top-reserve)*.52;
 const bg=r.images.get(ART.insideBackground.file),bk=Math.max(width/bg.width,height/bg.height)*1.05;ctx.save();ctx.filter='blur(1.2px)';ctx.drawImage(bg,(width-bg.width*bk)/2-Math.sin((i.mode==='tube'?pose.x:i.player.x)/900)*20,(height-bg.height*bk)/2,bg.width*bk,bg.height*bk);ctx.restore();ctx.fillStyle='rgba(255,248,216,.17)';ctx.fillRect(0,0,width,height);
 let left,top;if(i.mode==='tube'){left=pose.x-worldW*.42;top=anchor-pose.y*k;}else{const fixed=safe.bottom-reserve-950*k;left=(i.player.x-worldW*.42)*(1-drop)+Math.max(0,Math.min(C.poolWidth-worldW,i.player.x-worldW*.4))*drop;top=(anchor+100*k-i.player.y*k)*(1-drop)+fixed*drop;}
 ctx.save();ctx.translate(-left*k,top);ctx.scale(k,k);
 if(i.mode==='tube'){
  const end=brinquedaoTubePose(index,1);if(i.u>.85){ctx.save();ctx.translate(end.x-140,end.y-350);poolBack(ctx,r,i);poolFront(ctx,r,i);ctx.restore();}
  tube(ctx,r,index,pose,worldW,worldH);ctx.save();ctx.translate(pose.x,pose.y);ctx.rotate(pose.angle);if(i.u>.98)r.girl(ctx,{...s,player:{...i.player,x:0,y:100,support:null,mode:'air',vy:300}});else drawBrinquedaoGirl(ctx,r.images,3,0,48,96,{seat:true,time:i.time});ctx.restore();
  const fairy=brinquedaoTubePose(index,Math.max(0,i.u-.009));drawBrinquedaoFairy(ctx,r.images.get('toy-room/stage3/illustrated-fairy-v1.png'),fairy.x,fairy.y,43,i.time);
  ctx.save();ctx.globalAlpha=.16;tube(ctx,r,index,pose,worldW,worldH);ctx.restore();
 }else{
  poolBack(ctx,r,i);ctx.save();if(i.invulnerable>0&&i.hits>0)ctx.globalAlpha=.5+.5*Math.abs(Math.sin(i.time*22));r.girl(ctx,{...s,player:{...i.player,support:i.player.grounded?'piscina-interna':null,mode:i.player.grounded?'balls':'air'}});ctx.restore();poolFront(ctx,r,i);drawBrinquedaoFairy(ctx,r.images.get('toy-room/stage3/illustrated-fairy-v1.png'),i.player.x-100,i.player.y-135,49,i.time);
 }ctx.restore();
 const rect=canvas.getBoundingClientRect(),bar=document.querySelector('.top-controls-bar')?.getBoundingClientRect(),y=Math.max(safe.top+22*css,bar?(bar.bottom-rect.top)*height/rect.height+24*css:0),boxW=Math.min(safe.right-safe.left-20*css,580*css);ctx.fillStyle='rgba(255,250,230,.94)';ctx.beginPath();ctx.roundRect((width-boxW)/2,y-20*css,boxW,91*css,14*css);ctx.fill();ctx.textAlign='center';ctx.fillStyle='#426b54';ctx.font=`bold ${17*css}px Georgia`;ctx.fillText(`DENTRO DO BRINQUEDÃO · ${i.section+1}/3`,width/2,y,boxW-20*css);ctx.font=`${13*css}px sans-serif`;ctx.fillText(i.mode==='tube'?`Tubo ${i.leg+1}/3 · curvas rápidas`:`Piscina ${i.leg+1}/3 · espere os peixinhos mergulharem`,width/2,y+24*css,boxW-18*css);ctx.fillStyle=i.hits?'#be684f':'#d86d67';ctx.font=`bold ${21*css}px sans-serif`;ctx.fillText((i.hits===0?'♥ ♥':i.hits===1?'♥ ♡':'♡ ♡')+'  ·  dois acertos: Game Over',width/2,y+53*css,boxW-18*css);
 if(touch&&s.stage==='INTERIOR')drawMobileGameControls(ctx,canvas,r.controls());if(paused){ctx.fillStyle='rgba(31,58,48,.38)';ctx.fillRect(0,0,width,height);ctx.fillStyle='#fff9df';ctx.font='22px Georgia';ctx.fillText('Pausa',width/2,height/2);}
}
