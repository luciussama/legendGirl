import {GARDEN_BEE_LAYERS as ART} from './GardenCinematicArt.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
/** Uma única pintura do corpo: apenas as asas articuladas mudam durante o voo. */
export function drawGardenBee(ctx,images,bee,time){
  const image=images.get(ART.file);if(!image)return;
  const body=ART.body,wing=ART.wings,scale=84/body.w;
  const tilt=bee.phase==='prepare'?.22*smooth(bee.age/.5):bee.phase==='dive'?.22*(1-smooth(bee.age/.4)):0;
  ctx.save();ctx.translate(bee.x,bee.y);ctx.scale(bee.direction,1);ctx.rotate(tilt);
  if(!bee.alive)ctx.globalAlpha*=Math.max(0,1-bee.defeatAge/.35);
  ctx.save();ctx.translate(-8,-29);
  const beat=Math.sin(time*Math.PI*2*6.5),spread=.58+.34*beat;
  ctx.rotate(-.12+.09*beat);ctx.scale(1,spread);
  // A raiz das asas é fixa no dorso; não se usa a caixa variável das poses antigas.
  ctx.drawImage(image,wing.x,wing.y,wing.w,wing.h,-66*.57,-66*wing.h/wing.w,66,66*wing.h/wing.w);
  ctx.restore();
  ctx.drawImage(image,body.x,body.y,body.w,body.h,-42,-46,84,body.h*scale);
  ctx.restore();
}
