/** Extracts existing pixels only. Never generates or redraws character artwork. */
import fs from 'node:fs';
import crypto from 'node:crypto';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const sourcePath = 'assets/art/dark-room/official-sprites.png';
const bytes = fs.readFileSync(sourcePath);
const source = bytes[0] === 0xff ? jpeg.decode(bytes) : PNG.sync.read(bytes);
if (source.width !== 1024 || source.height !== 682) throw new Error('Expected official 1024×682 sheet; review crop coordinates for other sizes.');
const rows = (edges, top, bottom) => edges.slice(0, -1).map((x, i) => [x + 2, top, edges[i + 1] - 2, bottom]);
const cells = {
  idle: rows([562,610,659,707,755,803,852,900,948,994], 62, 114),
  run: rows([562,610,659,707,755,803,852,900,948,994], 137, 194),
  jump: rows([562,610,657,704,751,799,846], 217, 293),
  jump_short: [[855,246,896,293],[900,233,943,292]],
  high_jump: [[953,248,992,293]],
  fall: rows([562,610,657,704,751,799,846], 317, 377),
  dash: [[900,427,997,503]],
  teleport: [[690,533,752,660],[761,533,814,593]],
  damage: [[552,556,609,658]],
  collect: [[619,556,676,658]],
  interact: [[560,430,596,502]],
};
const atlas = new PNG({width: 1024, height: 1024});
const frames = {};
let dx = 0, dy = 0, rowHeight = 0;
for (const [state, rects] of Object.entries(cells)) {
  frames[state] = rects.map(([left, top, right, bottom]) => {
    const w = right-left, h = bottom-top;
    const pixels = new PNG({width:w,height:h});
    PNG.bitblt(source,pixels,left,top,w,h,0,0);
    // Flood only parchment connected to the crop border. RGB values of retained
    // pixels are copied verbatim; no repainting, palette changes or decontamination.
    const border=[];
    for(let x=0;x<w;x++){border.push(x,(h-1)*w+x);}
    for(let y=1;y<h-1;y++){border.push(y*w,y*w+w-1);}
    const bg = [0,1,2].map(c => border.map(p=>pixels.data[p*4+c]).sort((a,b)=>a-b)[Math.floor(border.length/2)]);
    const visited = new Uint8Array(w*h), queue = [];
    const add = (x,y) => {
      if(x<0||y<0||x>=w||y>=h) return;
      const p=y*w+x, k=p*4;
      if(visited[p]) return;
      visited[p]=1;
      if(Math.hypot(...bg.map((v,c)=>pixels.data[k+c]-v)) > 52) return;
      pixels.data[k+3]=0; queue.push(p);
    };
    for(let x=0;x<w;x++){add(x,0);add(x,h-1);}
    for(let y=0;y<h;y++){add(0,y);add(w-1,y);}
    for(let i=0;i<queue.length;i++){const x=queue[i]%w,y=Math.floor(queue[i]/w);add(x-1,y);add(x+1,y);add(x,y-1);add(x,y+1);}
    let x0=w,y0=h,x1=0,y1=0;
    for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(pixels.data[(y*w+x)*4+3]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
    const tw=x1-x0+1,th=y1-y0+1;
    if(dx+tw>1024){dx=0;dy+=rowHeight+2;rowHeight=0;}
    PNG.bitblt(pixels,atlas,x0,y0,tw,th,dx,dy);
    const frame={x:dx,y:dy,w:tw,h:th,anchorX:tw/2,anchorY:th,source:[left+x0,top+y0,tw,th]};
    if(state==='dash') frame.anchorX=966-(left+x0);
    if(state==='teleport'){frame.anchorX=(left===690?723:787)-(left+x0);frame.anchorY=(left===690?621:582)-(top+y0);}
    dx+=tw+2;rowHeight=Math.max(rowHeight,th);
    return frame;
  });
}
// No supplied lying, pushing-without-box or rear-walking frames: reuse official
// poses without transforming anatomy or synthesizing missing animation.
frames.lying_down=[frames.fall[5]];
frames.crouch=[frames.jump[0]];
frames.push=[frames.idle[0]];
frames.climb=[frames.idle[0]];
const output='assets/art/dark-room/sprites/official-character.png';
fs.writeFileSync(output,PNG.sync.write(atlas));
fs.writeFileSync('src/js/assets/officialCharacter.js',`// Extracted from the official sheet by scripts/generate-dream-girl-sprites.js\nexport const OFFICIAL_SOURCE_SHA256 = '${crypto.createHash('sha256').update(bytes).digest('hex')}';\nexport const OFFICIAL_FRAMES = ${JSON.stringify(frames,null,2)};\n`);
console.log(`Extracted official frames to ${output}`);
