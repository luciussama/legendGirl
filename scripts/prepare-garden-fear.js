// Conserva as solas originais e troca apenas a atuação superior da personagem.
import fs from 'node:fs';
import {PNG} from 'pngjs';
import {GARDEN_ART} from '../src/js/garden/GardenArt.js';
const root='assets/art/garden',source=PNG.sync.read(fs.readFileSync(root+'/source/menina-medo-v1.png'));
const faces=[];
for(let i=0;i<8;i++){
 const x0=Math.floor(i%4*source.width/4),x1=Math.floor((i%4+1)*source.width/4),y0=Math.floor(Math.floor(i/4)*source.height/2),y1=Math.floor((Math.floor(i/4)+1)*source.height/2);
 let left=x1,top=y1,right=x0,bottom=y0;
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(source.data[(y*source.width+x)*4+3]>32){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 faces.push({x:left,y:top,w:right-left+1,h:bottom-top+1});
}
const files={};
for(const[name,set]of Object.entries(GARDEN_ART.sets)){
 if(!name.startsWith('menina-'))continue;
 const original=PNG.sync.read(fs.readFileSync(root+'/'+set.file)),out=PNG.sync.read(fs.readFileSync(root+'/'+set.file));
 for(let i=0;i<set.frames.length;i++){
  const f=set.frames[i],face=faces[name==='menina-corrida-v1'?i:2+i%6],limit=Math.floor(f.h*.39),fade=4;
  for(let y=0;y<limit;y++)for(let x=0;x<f.w;x++){
   const sx=Math.min(source.width-1,Math.floor(face.x+x/f.w*face.w)),sy=Math.min(source.height-1,Math.floor(face.y+y/f.h*face.h)),src=(sy*source.width+sx)*4,dst=((f.y+y)*out.width+f.x+x)*4,mix=Math.min(1,(limit-y)/fade);
   for(let c=0;c<4;c++)out.data[dst+c]=Math.round(source.data[src+c]*mix+original.data[dst+c]*(1-mix));
  }
 }
 const file='runtime/medo-'+name+'.png';fs.writeFileSync(root+'/'+file,PNG.sync.write(out));files[name]=file;
 // Confere todos os pixels abaixo da área de atuação, incluindo a sola.
 for(const f of set.frames)for(let y=Math.floor(f.h*.39);y<f.h;y++)for(let x=0;x<f.w;x++){const k=((f.y+y)*out.width+f.x+x)*4;for(let c=0;c<4;c++)if(out.data[k+c]!==original.data[k+c])throw Error('Pixels dos pés alterados.');}
}
fs.writeFileSync('src/js/garden/GardenFearArt.js','// Gerado por prepare-garden-fear.js; pés idênticos às poses físicas originais.\nexport const FEAR_FILES='+JSON.stringify(files)+';\n');
console.log('Atuação de medo preparada; Corpo inferior e solas preservadas pixel a pixel em '+Object.keys(files).length+' pranchas.');
