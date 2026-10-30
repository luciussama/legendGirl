import {DREAM_GLIDE_THORNS,dreamGliderPose} from './DreamGlider.js';
import {DREAM_GLIDER_ART} from './DreamGliderArt.js';
/** Galhos espinhosos pintados, enraizados fora da tela; nenhuma régua de contato. */
export function drawDreamGlideThorns(ctx,images,left,right,top,bottom){const d=DREAM_GLIDER_ART.thorn,image=images.get(d.file);for(const o of DREAM_GLIDE_THORNS){if(o.x+o.w<left||o.x>right)continue;ctx.save();ctx.translate(o.x,o.y+(o.side>0?o.h:0));ctx.scale(1,o.side>0?-1:1);const extension=o.side<0?Math.max(0,o.y-top):Math.max(0,bottom-o.y-o.h),tile=80*o.h/d.height;for(let y=-tile;y>=-extension-tile;y-=tile)ctx.drawImage(image,0,0,d.width,80,0,y,o.w,tile+.3);ctx.drawImage(image,0,0,d.width,d.height,0,0,o.w,o.h);ctx.restore();}}
/** Folha única ainda presa ao galho; recorte da própria pintura que Yuna vai segurar. */
export function drawDreamLaunchLeaf(ctx,images,branch,time){const d=DREAM_GLIDER_ART.girl,image=images.get(d.file);ctx.save();ctx.translate(branch.x+branch.w*.84,branch.y-18);ctx.rotate(-.15+Math.sin(time*2)*.025);ctx.drawImage(image,0,0,d.width,460,-80,-62,160,62);ctx.restore();}
/** Mãos e haste estão na mesma pintura, que inclina inteira com o movimento vertical. */
export function drawDreamGlider(ctx,images,state){const d=DREAM_GLIDER_ART.girl,pose=dreamGliderPose(state.player);ctx.save();ctx.translate(state.player.x,state.player.y);ctx.rotate(pose.angle+(state.stage==='GLIDE_GUST'?Math.sin(state.age*24)*.035:0));ctx.scale(pose.scale,pose.scale);ctx.drawImage(images.get(d.file),-pose.anchorX,-pose.anchorY);ctx.restore();}
