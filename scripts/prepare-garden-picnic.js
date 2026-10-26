// Recorta a nova composição lateral sem modificar o original ou os apoios físicos.
import fs from 'node:fs';
import {PNG} from 'pngjs';
const root='assets/art/garden',image=PNG.sync.read(fs.readFileSync(root+'/source/piquenique-lateral-v3.png'));
if(image.data[3]!==0)throw Error('O piquenique precisa de fundo transparente.');
let left=image.width,top=image.height,right=0,bottom=0;
for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)if(image.data[(y*image.width+x)*4+3]>8){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
const w=right-left+1,h=bottom-top+1,out=new PNG({width:w+8,height:h+8});
PNG.bitblt(image,out,left,top,w,h,4,4);
const art={file:'runtime/piquenique-lateral-v3.png',x:4,y:4,w,h,groundAnchorY:Math.round(h*.85)};
fs.writeFileSync(root+'/'+art.file,PNG.sync.write(out));
fs.writeFileSync('src/js/garden/GardenPicnicArt.js','// Gerado por prepare-garden-picnic.js; a âncora fica no plano da toalha.\nexport const GARDEN_PICNIC='+JSON.stringify(art)+';\n');
const path=root+'/manifest.json',manifest=JSON.parse(fs.readFileSync(path));if(!manifest.images.includes(art.file))manifest.images.push(art.file);fs.writeFileSync(path,JSON.stringify(manifest,null,2)+'\n');
console.log('Piquenique lateral preparado com âncora no plano do chão.');
