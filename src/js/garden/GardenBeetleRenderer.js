import {GARDEN_BEETLE as ART} from './GardenBeetleArt.js';
/** Corpo e carapaças conservam a mesma pintura e âncora durante todo o voo. */
export function drawGardenBeetle(ctx,images,beetle,time){
  const image=images.get(ART.file);if(!image)return;
  const b=ART.body,w=ART.wings,scale=94/b.w,beat=Math.sin(time*Math.PI*2*6);
  ctx.save();ctx.translate(beetle.x,beetle.y);
  ctx.save();ctx.translate(-8,-29);ctx.rotate(.05*beat);ctx.scale(1,.55+.3*beat);
  ctx.drawImage(image,w.x,w.y,w.w,w.h,-64,-26,66,66*w.h/w.w);ctx.restore();
  ctx.drawImage(image,b.x,b.y,b.w,b.h,-47,-45,94,b.h*scale);ctx.restore();
}
