import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PNG } from 'pngjs';
import { BabyRenderer } from '../src/js/entities/BabyRenderer.js';
import { createBabyState, platforms } from '../src/js/config.js';

// Mede o pixel opaco mais baixo da imagem de origem usando a transformação real de drawImage.
const renderer = new BabyRenderer();
const atlas = PNG.sync.read(fs.readFileSync('assets/art/dark-room/sprites/official-character.png'));
const assets = {get: key => key === 'official-character' ? atlas : null};
let checks = 0;
for (const p of platforms) for (const facing of [-1, 1]) for (let frame = 0; frame < 120; frame++) {
  const supportY = p.surfaceTopY ?? p.standRegion?.y ?? p.y;
  const baby = {...createBabyState(), x:100, y:supportY-44, facing,
    vx: frame % 2 ? 1.65 : 0, onGround:true, animTime:frame / 6};
  const before = {...baby};
  let feetY=0, bottom=null;
  const ctx={save(){},restore(){},scale(){},translate(x,y){feetY=y;},
    drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh){
      let last=-1;
      for(let y=0;y<sh;y++)for(let x=0;x<sw;x++)if(image.data[((sy+y)*image.width+sx+x)*4+3])last=y;
      bottom=feetY+dy+(last+1)*dh/sh;
      assert(Math.abs(dw/sw-dh/sh)<1e-10,'A escala uniforme preserva a anatomia');
    }};
  renderer.render(ctx,baby,{tick:frame},0,{assets});
  assert.notEqual(bottom,null);
  assert(Math.abs(bottom-supportY)<1e-8,`${p.style}, direção ${facing}, quadro ${frame}: contato do sapato`);
  assert.deepEqual(baby,before,'A renderização não deve alterar a física');
  checks++;
}
console.log(`APROVADO: ${checks} contatos dos pés do sprite oficial nas plataformas e nas duas direções.`);
