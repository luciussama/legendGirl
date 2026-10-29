import {gardenDefeatFrame} from './GardenDefeatPresentation.js';
import {GARDEN_BEE_LAYERS as ART} from './GardenCinematicArt.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
/** Uma única pintura do corpo: apenas as asas articuladas mudam durante o voo. */
export function drawGardenBee(ctx,images,bee,time){
  const image=images.get(ART.file),pose=gardenDefeatFrame(bee);if(!image||!pose.visible)return;
  const body=ART.body,wing=ART.wings,scale=84/body.w;
  const tilt=!bee.alive?pose.rotation:bee.phase==='prepare'?.48*smooth(bee.age/.5):bee.phase==='dive'?.48*(1-smooth(bee.age/.4)):0;
  ctx.save();ctx.translate(pose.x,pose.y);ctx.rotate(bee.alive?tilt*bee.direction:tilt);ctx.scale(bee.direction,1);
  ctx.globalAlpha*=pose.alpha;
  ctx.save();ctx.translate(-8,-29);
  const beat=bee.alive?Math.sin(time*Math.PI*2*6.5):0,spread=!bee.alive?.22:bee.phase==='prepare'?.9+.1*beat:.58+.34*beat;
  ctx.rotate(-.12+.09*beat);ctx.scale(1,spread);
  // A raiz das asas é fixa no dorso; não se usa a caixa variável das poses antigas.
  ctx.drawImage(image,wing.x,wing.y,wing.w,wing.h,-66*.57,-66*wing.h/wing.w,66,66*wing.h/wing.w);
  ctx.restore();
  ctx.drawImage(image,body.x,body.y,body.w,body.h,-42,-46,84,body.h*scale);
  ctx.restore();
}
