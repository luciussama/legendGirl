// Prepara recortes ilustrados; o fundo alfa e a escala por espécie são preservados.
import fs from 'node:fs';
import {PNG} from 'pngjs';
const root='assets/art/garden',source=PNG.sync.read(fs.readFileSync(root+'/source/insetos-v1.png'));
const boxes=[[0,0,535,500],[535,0,489,500],[1024,0,512,500],[0,500,625,524],[625,500,405,524],[1030,500,506,524]];
const frames=boxes.map(([left,top,w,h],index)=>{
 let x0=left+w,y0=top+h,x1=left,y1=top;
 for(let y=top;y<top+h;y++)for(let x=left;x<left+w;x++)if(source.data[(y*source.width+x)*4+3]>8){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
 if(x1<=x0)throw Error('Recorte de inseto vazio: '+index);
 return{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1};
});
const atlas=new PNG({width:2048,height:1024}),out=[];
for(let i=0;i<frames.length;i++){const f=frames[i],x=i%3*680+4,y=Math.floor(i/3)*512+4;PNG.bitblt(source,atlas,f.x,f.y,f.w,f.h,x,y);out.push({x,y,w:f.w,h:f.h});}
fs.writeFileSync(root+'/runtime/insetos-v1.png',PNG.sync.write(atlas));
fs.writeFileSync('src/js/garden/GardenInsectArt.js','// Gerado por prepare-garden-insects.js; insetos aprovados em atlas transparente.\nexport const INSECT_FRAMES='+JSON.stringify(out)+';\n');
console.log('Preparados 2 voos de abelha, 2 de besouro e 2 minhocas com base natural.');
