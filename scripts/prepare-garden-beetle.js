// Mede as duas camadas originais sem modificar a pintura nem as regras do encontro.
import fs from 'node:fs';
import {PNG} from 'pngjs';
const file='source/besouro-camadas-v2.png',root='assets/art/garden',image=PNG.sync.read(fs.readFileSync(root+'/'+file));
function measure(left,right){let x0=right,y0=image.height,x1=left,y1=0;for(let y=0;y<image.height;y++)for(let x=left;x<right;x++)if(image.data[(y*image.width+x)*4+3]>24){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}if(x1<=x0)throw Error('Camada do besouro vazia.');return{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1};}
const split=Math.floor(image.width*.57),body=measure(0,split),wings=measure(split,image.width);
fs.writeFileSync('src/js/garden/GardenBeetleArt.js','// Gerado por prepare-garden-beetle.js.\nexport const GARDEN_BEETLE='+JSON.stringify({file,body,wings})+';\n');
const path=root+'/manifest.json',manifest=JSON.parse(fs.readFileSync(path));if(!manifest.images.includes(file))manifest.images.push(file);fs.writeFileSync(path,JSON.stringify(manifest,null,2)+'\n');
console.log('Besouro: corpo estável e asas isoladas preparados.');
