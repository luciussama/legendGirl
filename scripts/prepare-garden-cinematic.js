// Mede camadas ilustradas sem mudar suas proporções nem a física do jardim.
import fs from 'node:fs';
import {PNG} from 'pngjs';
const root='assets/art/garden';
function connectedCrops(props,count,rows){
const seen=new Uint8Array(props.width*props.height),queue=new Int32Array(seen.length),components=[];
for(let pixel=0;pixel<seen.length;pixel++){
 if(seen[pixel]||props.data[pixel*4+3]<24)continue;let head=0,tail=1;queue[0]=pixel;seen[pixel]=1;
 let x0=props.width,y0=props.height,x1=0,y1=0,area=0;
 while(head<tail){const n=queue[head++],x=n%props.width,y=Math.floor(n/props.width);area++;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x+1);y1=Math.max(y1,y+1);
  for(const next of [x?n-1:-1,x+1<props.width?n+1:-1,y?n-props.width:-1,y+1<props.height?n+props.width:-1])if(next>=0&&!seen[next]&&props.data[next*4+3]>=24){seen[next]=1;queue[tail++]=next;}
 }
components.push({x:Math.max(0,x0-2),y:Math.max(0,y0-2),w:Math.min(props.width,x1+2)-Math.max(0,x0-2),h:Math.min(props.height,y1+2)-Math.max(0,y0-2),area,pixels:queue.slice(0,tail)});
}
components.sort((a,b)=>b.area-a.area);const objects=components.slice(0,count);if(objects.length!==count||objects.some(p=>p.area<1000))throw Error('Objetos do jardim desconectados ou ausentes.');
objects.sort((a,b)=>Math.floor((a.y+a.h/2)/(props.height/rows))-Math.floor((b.y+b.h/2)/(props.height/rows))||a.x-b.x);
return objects.map(({area,...frame})=>frame);
}
function measure(image,box){
  const [left,top,right,bottom]=box;let x0=right,y0=bottom,x1=left,y1=top;
  for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)if(image.data[(y*image.width+x)*4+3]>16){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  if(x0>=x1)throw Error('Camada ilustrada vazia.');
  let headLeft=x1,headRight=x0;
  for(let y=Math.round(y0+(y1-y0)*.1);y<y0+(y1-y0)*.25;y++)for(let x=x0;x<=x1;x++)if(image.data[(y*image.width+x)*4+3]>32){headLeft=Math.min(headLeft,x);headRight=Math.max(headRight,x);}
  return{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1,anchorX:(headLeft+headRight)/2-x0};
}
const actors=PNG.sync.read(fs.readFileSync(root+'/cinematic/atuacao-yuna-nanda-v1.png'));
if(actors.width!==1536||actors.height!==1024||actors.data[3]!==0)throw Error('Prancha de atuação inesperada ou sem alfa.');
// Os retângulos de duas poses podem se cruzar: copia apenas seu componente alfa.
const atlas=new PNG({width:2560,height:1280});
const frames=connectedCrops(actors,8,2).map((f,index)=>{
  const isolated=new PNG({width:actors.width,height:actors.height});
  for(const pixel of f.pixels){const px=pixel%actors.width,py=Math.floor(pixel/actors.width);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){
    const x=px+dx,y=py+dy;if(x<0||y<0||x>=actors.width||y>=actors.height)continue;
    const k=(y*actors.width+x)*4;actors.data.copy(isolated.data,k,k,k+4);
  }}
  const crop=measure(isolated,[f.x,f.y,f.x+f.w,f.y+f.h]),x=index%4*640+4,y=Math.floor(index/4)*640+4;
  PNG.bitblt(isolated,atlas,crop.x,crop.y,crop.w,crop.h,x,y);return{...crop,x,y};
});
fs.writeFileSync(root+'/runtime/cinematic-atuacao-v1.png',PNG.sync.write(atlas));
const bee=PNG.sync.read(fs.readFileSync(root+'/source/abelha-camadas-v2.png'));
if(bee.data[3]!==0)throw Error('A abelha precisa de fundo transparente.');
const layers=[measure(bee,[0,0,bee.width/2,bee.height]),measure(bee,[bee.width/2,0,bee.width,bee.height])];
fs.writeFileSync('src/js/garden/GardenCinematicArt.js','// Gerado por prepare-garden-cinematic.js; fontes e prompts preservados.\nexport const GARDEN_ACTING='+JSON.stringify({file:'runtime/cinematic-atuacao-v1.png',referenceHeight:frames[0].h,frames})+';\nexport const GARDEN_BEE_LAYERS='+JSON.stringify({file:'source/abelha-camadas-v2.png',body:layers[0],wings:layers[1]})+';\n');
const path=root+'/manifest.json',manifest=JSON.parse(fs.readFileSync(path));
manifest.images=manifest.images.filter(f=>!f.startsWith('narrative/')&&f!=='cinematic/atuacao-yuna-nanda-v1.png');
for(const f of ['cinematic/casa-sem-atores-v1.png','cinematic/piquenique-sem-yuna-v1.png','runtime/cinematic-atuacao-v1.png','source/abelha-camadas-v2.png'])if(!manifest.images.includes(f))manifest.images.push(f);
fs.writeFileSync(path,JSON.stringify(manifest,null,2)+'\n');
console.log('Preparadas oito atuações, duas pinturas de cenário e abelha com corpo/asas separados.');
