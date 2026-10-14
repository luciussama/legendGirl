// Recorta as poses geradas e exporta no canvas nativo, sem criar desenhos novos.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';
const root = 'assets/art/toy-room/battle';
const sizes = { girl:[296,303], train:[201,139], robot:[148,236], dinosaur:[218,205], bear:[144,177] };
const manifest = { version:2, tool:'image_gen', status:'Integrado; sprites aprovados pelo responsável em 14/10/2026', actors:{} };
function components(png) {
  const seen=new Uint8Array(png.width*png.height), labels=new Int32Array(seen.length), queue=new Int32Array(seen.length), result=[];
  for(let start=0;start<seen.length;start++) {
    if(seen[start]||png.data[start*4+3]<64)continue;
    let head=0,tail=1;queue[0]=start;seen[start]=1;
    let left=png.width,top=png.height,right=0,bottom=0;
    while(head<tail) {
      const n=queue[head++],x=n%png.width,y=Math.floor(n/png.width);
      left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
      for(const next of [x>0?n-1:-1,x<png.width-1?n+1:-1,y>0?n-png.width:-1,y<png.height-1?n+png.width:-1]) {
        if(next<0||seen[next]||png.data[next*4+3]<64)continue;
        seen[next]=1;queue[tail++]=next;
      }
    }
    if(tail<1500)continue;
    const id=result.length+1;for(let k=0;k<tail;k++)labels[queue[k]]=id;
    result.push({id,left,top,right,bottom});
  }
  if(result.length!==6)throw Error(`Esperados seis quadros separados; encontrados ${result.length}.`);
  // Propaga o pertencimento às bordas antialiasadas transparentes em até três pixels.
  for(let pass=0;pass<3;pass++)for(let n=0;n<labels.length;n++) {
    if(labels[n]||png.data[n*4+3]===0)continue;
    const x=n%png.width,y=Math.floor(n/png.width);
    for(const k of [x>0?n-1:-1,x<png.width-1?n+1:-1,y>0?n-png.width:-1,y<png.height-1?n+png.width:-1])if(k>=0&&labels[k]){labels[n]=labels[k];break;}
  }
  result.sort((a,b)=>(a.top+a.bottom)-(b.top+b.bottom));
  return { labels, ordered:[...result.slice(0,3).sort((a,b)=>a.left-b.left),...result.slice(3).sort((a,b)=>a.left-b.left)] };
}
for(const [actor,[width,height]] of Object.entries(sizes)) {
  const source=`damage-v2/sources/${actor}-damage-sheet.png`;
  const png=PNG.sync.read(await fs.readFile(`${root}/${source}`));
  const {labels,ordered}=components(png);
  const maxWidth=Math.max(...ordered.map(c=>c.right-c.left+7));
  const maxHeight=Math.max(...ordered.map(c=>c.bottom-c.top+7));
  const anchorY=actor==='girl'?height:height-12;
  const scale=Math.min((width-4)/maxWidth,(anchorY-4)/maxHeight);
  const frames=[];await fs.mkdir(`${root}/damage-v2/${actor}`,{recursive:true});
  for(const [i,c]of ordered.entries()) {
    const out=new PNG({width,height});
    const cx=(c.left+c.right)/2,base=c.bottom;
    for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
      const sx=cx+(x-width/2)/scale,sy=base+(y-(anchorY-4))/scale;
      const ix=Math.round(sx),iy=Math.round(sy);
      if(ix<0||iy<0||ix>=png.width||iy>=png.height||labels[iy*png.width+ix]!==c.id)continue;
      const dst=(y*width+x)*4;
      if(actor==='girl')png.data.copy(out.data,dst,(iy*png.width+ix)*4,(iy*png.width+ix)*4+4);
      else {
        // Amostragem bilinear com alpha pré-multiplicado: bordas sem halo na resolução nativa.
        const x0=Math.floor(sx),y0=Math.floor(sy),fx=sx-x0,fy=sy-y0;let alpha=0;const rgb=[0,0,0];
        for(const [dx,dy,w]of [[0,0,(1-fx)*(1-fy)],[1,0,fx*(1-fy)],[0,1,(1-fx)*fy],[1,1,fx*fy]]) {
          const xx=x0+dx,yy=y0+dy;if(xx<0||yy<0||xx>=png.width||yy>=png.height||labels[yy*png.width+xx]!==c.id)continue;
          const n=(yy*png.width+xx)*4,a=png.data[n+3]/255*w;alpha+=a;
          for(let k=0;k<3;k++)rgb[k]+=png.data[n+k]*a;
        }
        out.data[dst+3]=Math.round(alpha*255);for(let k=0;k<3;k++)out.data[dst+k]=alpha?Math.round(rgb[k]/alpha):0;
      }
    }
    // Resíduos de alpha quase invisíveis do gerador não pertencem ao contorno do sprite.
    for(let n=0;n<out.data.length;n+=4)if(out.data[n+3]<8)out.data.fill(0,n,n+4);
    const file=`damage-v2/${actor}/${String(i+1).padStart(2,'0')}.png`;
    const bytes=PNG.sync.write(out);await fs.writeFile(`${root}/${file}`,bytes);
    frames.push({file,width,height,anchor:{x:width/2,y:anchorY},displayScale:1,source,sha256:createHash('sha256').update(bytes).digest('hex')});
  }
  manifest.actors[actor]={frames,loop:false};console.log(`${actor}: seis quadros ${width}x${height}, escala comum ${scale.toFixed(4)}.`);
}
await fs.writeFile(`${root}/damage-v2/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
await fs.writeFile('src/js/toy-room/DamageSpriteFrames.js',
  '// Gerado por scripts/prepare-damage-sprites.js; quadros de dor na resolução nativa.\n'+
  'export const DAMAGE_SPRITE_FRAMES = '+JSON.stringify(manifest.actors,null,2)+';\n');
