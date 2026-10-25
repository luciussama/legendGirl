// Extrai a prancha gerada e remove somente o fundo técnico magenta.
import fs from 'node:fs';
import {PNG} from 'pngjs';
const root='assets/art/garden',source=PNG.sync.read(fs.readFileSync(root+'/source/vida-aquatica-v1.png'));
const sprites=[];
for(let cell=0;cell<6;cell++){
 const x0=Math.floor(cell%3*source.width/3),x1=Math.floor((cell%3+1)*source.width/3),y0=Math.floor(Math.floor(cell/3)*source.height/2),y1=Math.floor((Math.floor(cell/3)+1)*source.height/2);
 let left=x1,top=y1,right=x0,bottom=y0;
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const k=(y*source.width+x)*4,r=source.data[k],g=source.data[k+1],b=source.data[k+2];
  if(r>g*1.5+40&&b>g*1.5+40){source.data[k+3]=0;continue;}
  left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
 }
 if(right<=left)throw Error('Elemento aquático ausente: '+cell);
 const w=right-left+1,h=bottom-top+1; sprites.push({left,top,w,h});
}
// Preserva resolução da pintura e margem transparente de dois pixels por recorte.
const out=new PNG({width:1536,height:1024}),frames=[];
for(let i=0;i<sprites.length;i++){
 const f=sprites[i],x=i%3*512+4,y=Math.floor(i/3)*512+4;
 if(f.w>504||f.h>504)throw Error('Recorte aquático excede célula.');
 PNG.bitblt(source,out,f.left,f.top,f.w,f.h,x,y);frames.push({x,y,w:f.w,h:f.h});
}
fs.writeFileSync(root+'/runtime/vida-aquatica-v1.png',PNG.sync.write(out));
fs.writeFileSync('src/js/garden/GardenVisualArt.js','// Gerado por prepare-garden-visuals.js; recortes apenas decorativos.\nexport const AQUATIC_FRAMES = '+JSON.stringify(frames)+';\n');
console.log('Seis recortes aquáticos preparados; nenhuma geometria física alterada.');
