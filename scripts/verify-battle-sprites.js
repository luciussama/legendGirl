import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PNG} from 'pngjs';
const root='assets/art/toy-room/battle';
const manifest=JSON.parse(await fs.readFile(`${root}/${process.argv.includes('--corrections')?'corrections/manifest.json':'manifest.json'}`,'utf8'));
const expected={train:['Idle','Walk','Steam Blast','Front Charge','Hit','Death'],robot:['Idle','Walk','Laser Beam','Rocket Punch','Hit','Death'],dinosaur:['Idle','Walk','Bite','Rush','Hit','Death'],bear:['Idle','Walk','Bear Hug','Belly Charge','Toy Leap','Hit','Enrage','Death']};
let count=0;
for(const [actor,names] of Object.entries(expected)){
 assert.deepEqual(Object.keys(manifest.actors[actor].animations).sort(),[...names].sort(),`${actor}: repertório exato.`);
 for(const [name,animation] of Object.entries(manifest.actors[actor].animations)){
  assert(animation.frames.length>=4,`${actor}/${name}: mínimo de quatro desenhos progressivos.`);
  const normalized=[];
  for(const frame of animation.frames){
   const p=PNG.sync.read(await fs.readFile(`${root}/${frame.file}`));
   assert.equal(p.width,frame.width);assert.equal(p.height,frame.height);
   assert.equal(createHash('sha256').update(p.data).digest('hex'),frame.sha256);
   let visible=0,left=p.width,top=p.height,right=0,bottom=0;
   for(let y=0;y<p.height;y++)for(let x=0;x<p.width;x++)if(p.data[(y*p.width+x)*4+3]>=8){visible++;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
   assert(visible>1500,`${frame.file}: desenho vazio/incompleto.`);
   assert(left>=10&&top>=10&&right<p.width-10&&bottom<p.height-10,`${frame.file}: margem transparente ausente.`);
   const clipped=new PNG({width:right-left+1,height:bottom-top+1});
   PNG.bitblt(p,clipped,left,top,clipped.width,clipped.height,0,0);
   normalized.push(createHash('sha256').update(clipped.data).digest('hex'));
   assert(Number.isFinite(frame.anchor.x)&&Number.isFinite(frame.anchor.y));count++;
  }
  assert.equal(new Set(normalized).size,animation.frames.length,`${actor}/${name}: desenho congelado repetido, mesmo após retirar deslocamento e padding.`);
 }
}
console.log(`APROVADO: ${count} PNGs, 26 sequências, repertórios exatos, transparência, margens e desenhos sem duplicação exata após normalizar o recorte. Progressão e identidade exigem inspeção visual adicional.`);
