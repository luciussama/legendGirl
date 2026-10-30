import fs from 'node:fs';
import {PNG} from 'pngjs';
import {GARDEN_BEETLE} from '../src/js/garden/GardenBeetleArt.js';
import {INSECT_FRAMES} from '../src/js/garden/GardenInsectArt.js';
/** Recortes próprios de escalada e contornos reais dos insetos reaproveitados. Não modifica pixels. */
const file='assets/art/dream-forest/yuna-escalada-v1.png',png=PNG.sync.read(fs.readFileSync(file)),frames=[];
for(let cell=0;cell<4;cell++){
 let left=png.width,top=png.height,right=0,bottom=0;
 for(let x=Math.floor(cell*png.width/4);x<Math.floor((cell+1)*png.width/4);x++)for(let y=0;y<png.height;y++)if(png.data[(y*png.width+x)*4+3]>32){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 if(right<=left)throw Error('Pose de escalada vazia.');frames.push({x:left,y:top,w:right-left+1,h:bottom-top+1});
}
const definitions={beetle:{file:'source/besouro-camadas-v2.png',frame:GARDEN_BEETLE.body},bee:{file:'runtime/insetos-v1.png',frame:INSECT_FRAMES[0]},ant:{file:'runtime/insetos-v1.png',frame:INSECT_FRAMES[1]},worm:{file:'runtime/insetos-v1.png',frame:INSECT_FRAMES[3]}};
const profiles={};
for(const [name,d] of Object.entries(definitions)){
 const p=PNG.sync.read(fs.readFileSync('assets/art/garden/'+d.file)),f=d.frame;
 profiles[name]=Array.from({length:101},(_,i)=>{const x=f.x+Math.min(f.w-1,Math.round(i*(f.w-1)/100));for(let y=0;y<f.h;y++)if(p.data[((f.y+y)*p.width+x)*4+3]>96)return Math.round(y/f.h*10000)/10000;return .65;});
}
fs.writeFileSync('src/js/dream-forest/DreamArt.js','// Gerado por scripts/prepare-dream-art.js; preserve os PNGs e regenere após trocar fontes.\nexport const DREAM_CLIMB='+JSON.stringify(frames)+';\nexport const DREAM_INSECTS='+JSON.stringify(definitions)+';\nexport const DREAM_PROFILES='+JSON.stringify(profiles)+';\n');
console.log('Recortes de escalada e contornos de quatro insetos preparados.');
// Somente metadados: as fontes ilustradas e os contornos físicos anteriores ficam intactos.
function bounds(image,left,top,right,bottom){let x0=right,y0=bottom,x1=left,y1=top;for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)if(image.data[(y*image.width+x)*4+3]>96){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}if(x1<=x0||y1<=y0)throw Error('Camada ilustrada vazia.');return{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1};}
function tops(image,frame,startY=frame.y){return Array.from({length:257},(_,i)=>{const x=frame.x+Math.round((frame.w-1)*i/256);for(let y=startY;y<frame.y+frame.h;y++)if(image.data[(y*image.width+x)*4+3]>96)return y;return frame.y+frame.h;});}
const leafImage=PNG.sync.read(fs.readFileSync('assets/art/dream-forest/folha-plataforma-v1.png')),leafFrame=bounds(leafImage,0,0,leafImage.width,400);
const leaf={file:'dream-forest/folha-plataforma-v1.png',frame:{...leafFrame,h:400-leafFrame.y},tops:tops(leafImage,leafFrame),stem:{x:850,y:400,w:130,h:leafImage.height-400},stemAnchor:.49};
const beeImage=PNG.sync.read(fs.readFileSync('assets/art/dream-forest/abelhinha-do-bem-v1.png'));
const bee={file:'dream-forest/abelhinha-do-bem-v1.png',body:bounds(beeImage,0,0,1160,beeImage.height),wings:bounds(beeImage,1160,0,beeImage.width,beeImage.height),back:{x:170,y:65,w:850,h:650}};
fs.appendFileSync('src/js/dream-forest/DreamArt.js','export const DREAM_LEAF='+JSON.stringify(leaf)+';\nexport const DREAM_BEE='+JSON.stringify(bee)+';\n');
console.log('Preparados metadados da folha pintada e da abelhinha do bem, sem alterar a física.');
const spiderImage=PNG.sync.read(fs.readFileSync('assets/art/dream-forest/aranhinha-v1.png')),branchImage=PNG.sync.read(fs.readFileSync('assets/art/dream-forest/galho-vento-v1.png'));
const spider={file:'dream-forest/aranhinha-v1.png',frame:bounds(spiderImage,0,0,spiderImage.width,spiderImage.height)};
const branchFrame=bounds(branchImage,380,180,branchImage.width,720);
const branch={file:'dream-forest/galho-vento-v1.png',frame:branchFrame,tops:tops(branchImage,branchFrame),trunk:{x:0,y:0,w:300,h:branchImage.height}};
fs.appendFileSync('src/js/dream-forest/DreamArt.js','export const DREAM_SPIDER='+JSON.stringify(spider)+';\nexport const DREAM_BRANCH='+JSON.stringify(branch)+';\n');
console.log('Preparados recortes e âncoras das aranhas e galhos ilustrados.');
/** Componentes completos evitam cortar sapatos quando a pose atravessa a divisão nominal de uma célula. */
function climbComponents(image){
 const seen=new Uint8Array(image.width*image.height),queue=new Int32Array(seen.length),parts=[];
 for(let pixel=0;pixel<seen.length;pixel++){
  if(seen[pixel]||image.data[pixel*4+3]<32)continue;let head=0,tail=1,x0=image.width,y0=image.height,x1=0,y1=0;queue[0]=pixel;seen[pixel]=1;
  while(head<tail){const n=queue[head++],x=n%image.width,y=Math.floor(n/image.width);x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);
   for(const next of [x?n-1:-1,x+1<image.width?n+1:-1,y?n-image.width:-1,y+1<image.height?n+image.width:-1])if(next>=0&&!seen[next]&&image.data[next*4+3]>=32){seen[next]=1;queue[tail++]=next;}
  }
  if(tail>3000)parts.push({x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,area:tail});
 }
 if(parts.length!==6)throw Error('A prancha de escalada precisa de seis poses completas e separadas.');
 return parts.sort((a,b)=>Number(a.y>image.height*.4)-Number(b.y>image.height*.4)||a.x-b.x).map(({area,...f})=>f);
}
function climbHand(image,f,index){
 if(index===5)return[159,312]; // Centro da mão baixa, separado do sapato dianteiro.
 const minY=index===5?.64:index===4?.35:.18,maxY=index===5?.88:index===4?.7:(index===0||index===2)?.36:.48;
 const pixels=[];let right=0;
 for(let y=Math.floor(f.h*minY);y<f.h*maxY;y++)for(let x=Math.floor(f.w*.6);x<f.w;x++){
  const k=((f.y+y)*image.width+f.x+x)*4,[r,g,b,a]=image.data.subarray(k,k+4);
  if(a>96&&r>140&&g/r>.55&&g/r<.9&&b/r<.82){pixels.push([x,y]);right=Math.max(right,x);}
 }
 const edge=pixels.filter(([x])=>x>=right-5);if(!edge.length)throw Error('Mão de escalada não identificada.');
 const ys=[...new Set(edge.map(p=>p[1]))].sort((a,b)=>a-b),groups=[];
 for(const y of ys){if(!groups.length||y-groups.at(-1).at(-1)>3)groups.push([]);groups.at(-1).push(y);}
 const group=groups.at(-1),points=edge.filter(p=>group.includes(p[1])),handRight=Math.max(...points.map(p=>p[0]));
 return[handRight+1,Math.round(group.reduce((sum,y)=>sum+y,0)/group.length)];
}
const climbImage=PNG.sync.read(fs.readFileSync('assets/art/dream-forest/yuna-escalada-v2.png')),climbFrames=climbComponents(climbImage).map((f,i)=>({...f,hand:climbHand(climbImage,f,i)}));
const climb={file:'dream-forest/yuna-escalada-v2.png',referenceHeight:Math.max(...climbFrames.slice(0,4).map(f=>f.h)),stride:72,frames:climbFrames};
// Estes contornos são exclusivamente visuais; DREAM_PROFILES permanece a fonte física anterior.
const contacts={};
for(const kind of ['beetle','bee']){
 const file=kind==='beetle'?'assets/art/garden/source/besouro-camadas-v2.png':'assets/art/dream-forest/abelhinha-do-bem-v1.png',p=PNG.sync.read(fs.readFileSync(file)),a=kind==='beetle'?GARDEN_BEETLE.body:bee.body,origin=kind==='beetle'?{x:a.x,y:a.y,w:a.w}:bee.back;
 contacts[kind]=Array.from({length:257},(_,i)=>{
  const y=a.y+Math.round(i*(a.h-1)/256),leftLimit=kind==='bee'?bee.back.x+10:a.x;let longest=null,start=null;
  for(let x=Math.max(a.x,leftLimit);x<=a.x+a.w;x++){
   const solid=x<a.x+a.w&&p.data[(y*p.width+x)*4+3]>96;
   if(solid&&start===null)start=x;
   if(!solid&&start!==null){if(!longest||x-start>longest[1]-longest[0])longest=[start,x-1];start=null;}
  }
  if(!longest||longest[1]-longest[0]<a.w*.035)return null;
  return[(y-origin.y)/origin.w,(longest[0]-origin.x)/origin.w,(longest[1]-origin.x)/origin.w].map(v=>Math.round(v*100000)/100000);
 }).filter(Boolean);
}
fs.appendFileSync('src/js/dream-forest/DreamArt.js','export const DREAM_CLIMB_CYCLE='+JSON.stringify(climb)+';\nexport const DREAM_CLIMB_CONTACTS='+JSON.stringify(contacts)+';\n');
console.log('Preparadas seis poses completas, âncoras das mãos e contornos visuais de escalada.');
