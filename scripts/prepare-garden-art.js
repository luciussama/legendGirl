// Prepara recortes com alfa a partir das pranchas de produção, sem alterar as fontes.
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
 components.push({x:Math.max(0,x0-2),y:Math.max(0,y0-2),w:Math.min(props.width,x1+2)-Math.max(0,x0-2),h:Math.min(props.height,y1+2)-Math.max(0,y0-2),area});
}
components.sort((a,b)=>b.area-a.area);const objects=components.slice(0,count);if(objects.length!==count||objects.some(p=>p.area<1000))throw Error('Objetos do jardim desconectados ou ausentes.');
objects.sort((a,b)=>Math.floor((a.y+a.h/2)/(props.height/rows))-Math.floor((b.y+b.h/2)/(props.height/rows))||a.x-b.x);
return objects.map(({area,...frame})=>frame);
}
const sets={};fs.mkdirSync(root+'/runtime',{recursive:true});
for(const [name,reference,count=8,columns=4]of [['menina-corrida-v1',0],['menina-acoes-v1',7],['menina-desconforto-v1',7],['menina-pedrinhas-v2',1,4,2]]){
 const source=PNG.sync.read(fs.readFileSync(root+'/source/'+name+'.png')),regions=connectedCrops(source,count,count/columns),ratio=256/regions[reference].h;
 const cell=384,out=new PNG({width:cell*columns,height:cell*count/columns});
 const frames=regions.map((f,index)=>{
  const w=Math.round(f.w*ratio),h=Math.round(f.h*ratio);if(w>cell-20||h>cell-20)throw Error('Pose do jardim excedeu a célula.');
  const x=index%columns*cell+10,y=Math.floor(index/columns)*cell+10;
  for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){
   const sx=f.x+(xx+.5)/ratio-.5,sy=f.y+(yy+.5)/ratio-.5,ix=Math.floor(sx),iy=Math.floor(sy),fx=sx-ix,fy=sy-iy;let alpha=0;const rgb=[0,0,0];
   for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const px=ix+dx,py=iy+dy;if(px<f.x||py<f.y||px>=f.x+f.w||py>=f.y+f.h)continue;const k=(py*source.width+px)*4,a=source.data[k+3]*(dx?fx:1-fx)*(dy?fy:1-fy);alpha+=a;for(let c=0;c<3;c++)rgb[c]+=source.data[k+c]*a;}
   const k=((y+yy)*out.width+x+xx)*4;for(let c=0;c<3;c++)out.data[k+c]=alpha?Math.round(rgb[c]/alpha):0;out.data[k+3]=Math.round(alpha);
  }
  let bottom=0;for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(out.data[((y+yy)*out.width+x+xx)*4+3])bottom=yy+1;
  return {x,y,w,h,anchorX:w/2,anchorY:bottom};
 });
 fs.writeFileSync(root+'/runtime/'+name+'.png',PNG.sync.write(out));sets[name]={file:'runtime/'+name+'.png',frames};
}
// A copa da árvore pode ultrapassar a grade nominal: o alfa conectado conserva a silhueta inteira.
const props=PNG.sync.read(fs.readFileSync(root+'/source/objetos-v1.png'));
sets.objetos={file:'source/objetos-v1.png',frames:connectedCrops(props,9,3)};
// Componentes conectados preservam a casa/grama que ultrapassam a divisão nominal da prancha.
const scenery=PNG.sync.read(fs.readFileSync(root+'/source/ambiente-v2.png'));
sets.ambiente={file:'source/ambiente-v2.png',frames:connectedCrops(scenery,4,2)};
const red=PNG.sync.read(fs.readFileSync(root+'/source/lagarta-vermelha-v1.png'));
sets.lagartaVermelha={file:'source/lagarta-vermelha-v1.png',frames:connectedCrops(red,2,1)};
fs.writeFileSync(root+'/manifest.json',JSON.stringify({version:1,images:['cenario-v1.png',...Object.values(sets).map(s=>s.file),'../toy-room/stage3/illustrated-fairy-v1.png']},null,2)+'\n');
const metadata={referenceHeight:256,sets};fs.writeFileSync(root+'/frames.json',JSON.stringify(metadata,null,2)+'\n');
fs.writeFileSync('src/js/garden/GardenArt.js','// Gerado por scripts/prepare-garden-art.js; fontes e prompts preservados.\nexport const GARDEN_ART = '+JSON.stringify(metadata)+';\n');
console.log('Jardim: 28 poses, nove objetos, quatro elementos de ambiente, duas poses de lagarta vermelha e metadados preparados.');
