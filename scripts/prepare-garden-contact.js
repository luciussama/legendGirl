// Mede sapatos e superfícies nas fontes reais; não modifica nenhuma imagem.
import fs from 'node:fs';
import {PNG} from 'pngjs';
import {GARDEN_ART as art} from '../src/js/garden/GardenArt.js';
const root='assets/art/garden/',images=new Map();
const image=file=>{if(!images.has(file))images.set(file,PNG.sync.read(fs.readFileSync(root+file)));return images.get(file);};
const feet={},bounds={left:Infinity,right:-Infinity},gravelBounds={left:Infinity,right:-Infinity};
for(const [name,set]of Object.entries(art.sets).filter(([key])=>key.startsWith('menina'))){
 const png=image(set.file),scale=92/art.referenceHeight;
 feet[name]=set.frames.map((f,index)=>{
  let left=Infinity,right=-Infinity;
  for(let y=Math.floor(f.h*.78);y<f.h;y++)for(let x=0;x<f.w;x++){
   const k=((f.y+y)*png.width+f.x+x)*4,[r,g,b,a]=png.data.subarray(k,k+4);
   const pink=r>110&&r-g>18&&b>g*.95,white=r>180&&g>170&&b>160;
   if(a>=160&&(pink||white)){left=Math.min(left,(x-f.anchorX)*scale);right=Math.max(right,(x+1-f.anchorX)*scale);}
  }
  if(!Number.isFinite(left))throw Error('Sapatos não encontrados: '+name+' '+index);
  const playable=name!=='menina-acoes-v1'||index>=1&&index<=3;
  if(playable){const target=name==='menina-pedrinhas-v2'?gravelBounds:bounds;target.left=Math.min(target.left,left);target.right=Math.max(target.right,right);}
  return{left:Number(left.toFixed(3)),right:Number(right.toFixed(3))};
 });
}
const surfaces={};
for(const [type,index,height,offset]of [['wood',1,53,8],['stone',2,70,3],['cloud',3,60,6]]){
 const set=art.sets.objetos,f=set.frames[index],png=image(set.file),columns=[];
 for(let x=0;x<f.w;x++){
  let top=null;
  for(let y=0;y<f.h*.55;y++){
   const k=((f.y+y)*png.width+f.x+x)*4,[r,g,b,a]=png.data.subarray(k,k+4);
   // Folhas decorativas não substituem o tampo de madeira ou de pedra.
   if(a<160||type!=='cloud'&&g>r*1.08)continue;
   top=Number((y/f.h*height-offset).toFixed(3));break;
  }
  columns.push(top);
 }
 surfaces[type]={columns,height,offset};
}
const data={referenceHeight:92,alpha:160,bounds:{left:Math.floor(bounds.left*1000)/1000,right:Math.ceil(bounds.right*1000)/1000},gravelBounds,feet,surfaces};
fs.writeFileSync('src/js/garden/GardenContactData.js','// Gerado por scripts/prepare-garden-contact.js; pixels das artes de produção.\nexport const GARDEN_CONTACT = '+JSON.stringify(data)+';\n');
console.log('Contato do jardim: 28 poses medidas, três superfícies por coluna e envelope dos sapatos '+JSON.stringify(data.bounds)+'.');
