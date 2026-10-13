/** Ilustrações atuais nos mesmos espaços decorativos; não participam da física. */
export const CURRENT_SCENERY = {
  toy_soldier: {key:'current-scenery-toy-soldier',width:36,height:44},
  fluffy_rug: {key:'dark-room-sprite-mandala-rug',width:140,height:54,offset:-12},
  cardboard_box_floor: {key:'current-scenery-cardboard-box-floor',width:56,height:40},
  wooden_horse: {key:'toy-room-rocking-horse-v1',width:52,height:40},
  spilled_crayons: {key:'current-scenery-spilled-crayons',width:50,height:35},
  toy_car: {key:'current-scenery-toy-car',width:48,height:40},
  striped_socks: {key:'current-scenery-striped-socks',width:38,height:34},
  dropped_sweater: {key:'current-scenery-dropped-sweater',width:48,height:25},
  paper_airplane: {key:'current-scenery-paper-airplane',width:38,height:40},
  scattered_blocks: {key:'toy-room-stacking-blocks-v1',width:52,height:42},
  dinosaur_felt: {key:'current-scenery-dinosaur-felt',width:40,height:30},
  slinky: {key:'current-scenery-slinky',width:44,height:22},
  wooden_spinning_top: {key:'dark-room-modern-spinning-top',width:36,height:44},
  plush_bunny: {key:'toy-room-cotton-bunny-v1',width:38,height:40},
  puzzle_pieces: {key:'current-scenery-puzzle-pieces',width:44,height:30},
  toy_train: {key:'toy-room-environment-sheet',region:{x:689,y:76,width:116,height:88},width:40,height:30},
  jack_in_box: {key:'toy-room-fairy-jack-box-v1',width:42,height:50}
};

export function drawCurrentScenery(ctx,assets,type,x,floorY) {
  const spec=CURRENT_SCENERY[type];
  if(!spec)return false;
  const image=spec.region?assets?.getRegion(spec.key,spec.region):assets?.get(spec.key);
  // Ausência de arte não reativa a assinatura antiga; o carregamento é validado antes do jogo.
  if(!image)return true;
  let width=spec.width,height=spec.height;
  if(type!=='fluffy_rug'){
    const scale=Math.min(width/image.width,height/image.height);
    width=image.width*scale;height=image.height*scale;
  }
  ctx.drawImage(image,Math.round(x-width/2),Math.round(floorY+(spec.offset??4-height)),width,height);
  return true;
}
