// Prepara atuação completa; os sapatos de apoio continuam sendo os quadros físicos.
import fs from 'node:fs';
import {PNG} from 'pngjs';
import {GARDEN_ART} from '../src/js/garden/GardenArt.js';
const root='assets/art/garden',source=PNG.sync.read(fs.readFileSync(root+'/source/menina-medo-v2.png'));
const poses=[];
for(let i=0;i<8;i++){
 const a=Math.floor(i%4*source.width/4),b=Math.floor((i%4+1)*source.width/4),c=Math.floor(Math.floor(i/4)*source.height/2),d=Math.floor((Math.floor(i/4)+1)*source.height/2);
 let left=b,top=d,right=a,bottom=c;
 for(let y=c;y<d;y++)for(let x=a;x<b;x++)if(source.data[(y*source.width+x)*4+3]>32){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 poses.push({x:left,y:top,w:right-left+1,h:bottom-top+1});
}
const files={},frames={};
for(const[name,set]of Object.entries(GARDEN_ART.sets)){
 if(!name.startsWith('menina-'))continue;
 const original=PNG.sync.read(fs.readFileSync(root+'/'+set.file)),out=new PNG({width:2048,height:1024});
 frames[name]=set.frames.map((f,i)=>{
  const pose=poses[(name==='menina-corrida-v1'?i+6:i+2)%8],pad=90,w=f.w+pad*2,x=i%4*512+4,y=Math.floor(i/4)*512+4;
  // A pose completa é registrada pela sola mais baixa, sem combinar membros
  // de pinturas diferentes. A referência física continua no atlas original.
  const soleCenter=(img,box)=>{let sum=0,count=0;for(let py=box.h-5;py<box.h;py++)for(let px=0;px<box.w;px++)if(img.data[((box.y+py)*img.width+box.x+px)*4+3]>64){sum+=px;count++;}return count?sum/count:box.w/2;};
  const targetSole=soleCenter(original,f),sourceSole=soleCenter(source,pose),scaleY=f.h/pose.h,scaleX=Math.min(scaleY,(f.w+65)/pose.w),start=pad+f.anchorX-pose.w*.5*scaleX;
  for(let py=0;py<f.h;py++)for(let px=0;px<w;px++){
   const t=py/f.h,q=Math.max(0,Math.min(1,(t-.62)/.32)),shift=(targetSole-(start-pad+sourceSole*scaleX))*q*q*(3-2*q);
   const sx=Math.floor(pose.x+(px-start-shift)/scaleX),sy=Math.min(source.height-1,Math.floor(pose.y+py/scaleY));
   if(sx<pose.x||sx>=pose.x+pose.w)continue;const src=(sy*source.width+sx)*4,k=((y+py)*out.width+x+px)*4;source.data.copy(out.data,k,src,src+4);
  }
  return{x,y,w,h:f.h,anchorX:f.anchorX+pad,anchorY:f.anchorY};
 });
 const file='runtime/medo-v2-'+name+'.png';fs.writeFileSync(root+'/'+file,PNG.sync.write(out));files[name]=file;
}
fs.writeFileSync('src/js/garden/GardenFearArt.js','// Gerado por prepare-garden-fear.js; atuação completa e apoio original.\nexport const FEAR_FILES='+JSON.stringify(files)+';\nexport const FEAR_FRAMES='+JSON.stringify(frames)+';\n');
const path=root+'/manifest.json',manifest=JSON.parse(fs.readFileSync(path));manifest.images=manifest.images.filter(f=>!f.startsWith('runtime/medo-')||f.startsWith('runtime/medo-v2-'));for(const file of Object.values(files))if(!manifest.images.includes(file))manifest.images.push(file);fs.writeFileSync(path,JSON.stringify(manifest,null,2)+'\n');
console.log('Quatro pranchas de medo completo preparadas; envelope visual adaptado às solas físicas originais.');
