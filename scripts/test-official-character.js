import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import jpeg from 'jpeg-js';
import {PNG} from 'pngjs';
import {OFFICIAL_FRAMES as frames, OFFICIAL_SOURCE_SHA256} from '../src/js/assets/officialCharacter.js';
import {BabyRenderer} from '../src/js/entities/BabyRenderer.js';
const bytes=fs.readFileSync('assets/art/dark-room/official-sprites.png');
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),OFFICIAL_SOURCE_SHA256);
const source=bytes[0]===255?jpeg.decode(bytes):PNG.sync.read(bytes);
const atlas=PNG.sync.read(fs.readFileSync('assets/art/dark-room/sprites/official-character.png'));
let checked=0;
for(const list of Object.values(frames))for(const f of list){
  for(let y=0;y<f.h;y++)for(let x=0;x<f.w;x++){
    const a=((f.y+y)*atlas.width+f.x+x)*4,s=((f.source[1]+y)*source.width+f.source[0]+x)*4;
    if(atlas.data[a+3]){assert.deepEqual([...atlas.data.subarray(a,a+3)],[...source.data.subarray(s,s+3)]);checked++;}
  }
}
const renderer=new BabyRenderer(), assets={get:key=>key==='official-character'?atlas:null};
for(const [pose,list] of Object.entries(frames))for(let i=0;i<list.length;i++){
 let draws=0;const ctx={save(){},restore(){},translate(){},scale(){},drawImage(image,...args){draws++;assert.equal(image,atlas);assert.deepEqual(args.slice(0,4),[list[i].x,list[i].y,list[i].w,list[i].h]);}};
 renderer.renderPose(ctx,assets,pose,i,100,200,50);assert.equal(draws,1);
}
const review=new PNG({width:1000,height:1500});review.data.fill(255);
let row=0;
for(const pose of ['idle','run','jump','jump_short','high_jump','fall','dash','teleport','damage','collect']){
 const list=frames[pose];let left=0;
 for(const f of list){const scale=pose==='teleport'?1:2;
 for(let y=0;y<f.h*scale;y++)for(let x=0;x<f.w*scale;x++){
 const a=((f.y+Math.floor(y/scale))*atlas.width+f.x+Math.floor(x/scale))*4;
 const d=((row+y)*review.width+left+x)*4;if(row+y>=1500||left+x>=1000)continue;
 const bg=((Math.floor(x/8)+Math.floor(y/8))%2)?90:65;
 for(let c=0;c<3;c++)review.data[d+c]=atlas.data[a+3]?atlas.data[a+c]:bg;
 }left+=f.w*scale+8;
 }row+=pose==='teleport'?130:Math.max(...list.map(f=>f.h))*2+8;
}
fs.writeFileSync('tmp/official-character-review/crops.png',PNG.sync.write(review));
console.log(`PASS: ${checked} opaque pixels identical to source; all official poses draw atlas crops.`);
