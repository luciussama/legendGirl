import {DREAM_GLIDE_THORNS,dreamGliderPose} from './DreamGlider.js';
import {DREAM_GLIDER_ART} from './DreamGliderArt.js';
/** Galhos espinhosos pintados, enraizados fora da tela; nenhuma régua de contato. */
export function drawDreamGlideThorns(ctx,images,left,right,top,bottom){const d=DREAM_GLIDER_ART.thorn,image=images.get(d.file);for(const o of DREAM_GLIDE_THORNS){if(o.x+o.w<left||o.x>right)continue;ctx.save();ctx.translate(o.x,o.y+(o.side>0?o.h:0));ctx.scale(1,o.side>0?-1:1);const extension=o.side<0?Math.max(0,o.y-top):Math.max(0,bottom-o.y-o.h),tile=80*o.h/d.height;for(let k=0;k<Math.ceil(extension/tile)+1;k++){ctx.save();ctx.translate(0,-k*tile);if(k%2===0){ctx.scale(1,-1);ctx.drawImage(image,0,0,d.width,80,0,0,o.w,tile+.3);}else ctx.drawImage(image,0,0,d.width,80,0,-tile,o.w,tile+.3);ctx.restore();}ctx.drawImage(image,0,0,d.width,d.height,0,0,o.w,o.h);ctx.restore();}}
/** Folha única ainda presa ao galho; recorte da própria pintura que Yuna vai segurar. */
export function drawDreamLaunchLeaf(ctx,images,branch,time){const d=DREAM_GLIDER_ART.girl,image=images.get(d.file);ctx.save();ctx.translate(branch.x+branch.w*.84,branch.y-18);ctx.rotate(-.15+Math.sin(time*2)*.025);ctx.drawImage(image,0,0,d.width,460,-80,-62,160,62);ctx.restore();}
/** Mãos e haste estão na mesma pintura, que inclina inteira com o movimento vertical. */
export function drawDreamGlider(ctx,images,state){const d=DREAM_GLIDER_ART.girl,pose=dreamGliderPose(state.player);ctx.save();ctx.translate(state.player.x,state.player.y);ctx.rotate(pose.angle+(state.stage==='GLIDE_GUST'?Math.sin(state.age*24)*.035:0));ctx.scale(pose.scale,pose.scale);ctx.drawImage(images.get(d.file),-pose.anchorX,-pose.anchorY);ctx.restore();}
/** Registra a terra pintada em um topo plano; o pouso final não reutiliza uma árvore. */
export function prepareDreamPlateau(image){
 // A faixa superior contém névoa azul semitransparente; o corte começa na terra opaca, sem deformar colunas.
 const top=Math.round(image.height*.17),bitmap=document.createElement('canvas');bitmap.width=image.width;bitmap.height=image.height-top;bitmap.getContext('2d').drawImage(image,0,top,image.width,image.height-top,0,0,bitmap.width,bitmap.height);return bitmap;
}
/** Uma massa larga de planalto se prolonga para a floresta, com a crista na altura do pouso. */
export function drawDreamPlateau(ctx,bitmap,frame){if(bitmap)ctx.drawImage(bitmap,frame.x-100,frame.y,2100,1200);}
/** A folha escapa das mãos depois de tocar o solo e repousa ao lado de Yuna. */
export function drawDreamLandingLeaf(ctx,images,state){if(state.stage!=='GLIDE_LANDING'||state.age<2.4)return;const q=Math.min(1,(state.age-2.4)/.8),ease=q*q*(3-2*q),d=DREAM_GLIDER_ART.girl;ctx.save();ctx.translate(state.player.x+60*ease,state.player.y-148+140*ease);ctx.rotate(.25*ease);ctx.drawImage(images.get(d.file),0,0,d.width,460,-81,0,193,58*(1-.6*ease));ctx.restore();}
