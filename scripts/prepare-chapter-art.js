import fs from 'node:fs';
import {PNG} from 'pngjs';
const root='assets/art/chapters';
/** Mede cada célula pelo alfa; conserva os pixels originais e registra âncoras de apresentação. */
function frames(file,columns){
 const image=PNG.sync.read(fs.readFileSync(root+'/'+file)),out=[],edges=[0];
 // A ferramenta pode deslocar uma pose dentro da célula; a separação segue o vão transparente.
 const ink=Array.from({length:image.width},()=>0);
 for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)if(image.data[(y*image.width+x)*4+3]>24)ink[x]++;
 for(let i=1;i<columns;i++){
  const center=i*image.width/columns,range=image.width/columns*.2,from=Math.floor(center-range),to=Math.ceil(center+range);let best=null,start=null;
  for(let x=from;x<=to+1;x++){if(x<=to&&ink[x]<=2){start??=x;}else if(start!==null){if(!best||x-start>best.end-best.start)best={start,end:x};start=null;}}
  edges.push(best?Math.floor((best.start+best.end)/2):Math.floor(center));
 }
 edges.push(image.width);
 for(let column=0;column<columns;column++){
  let left=image.width,top=image.height,right=-1,bottom=-1;
  const from=edges[column],to=edges[column+1];
  for(let y=0;y<image.height;y++)for(let x=from;x<to;x++)if(image.data[(y*image.width+x)*4+3]>24){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  if(right<left)throw Error('Célula de atuação vazia: '+file+'/'+column);
  out.push({x:left,y:top,w:right-left+1,h:bottom-top+1,anchorX:(right-left+1)/2});
 }
 return{file,referenceHeight:Math.max(...out.map(f=>f.h)),frames:out};
}
const art={girl:frames('menina-quarto-v1.png',3),fairy:frames('nanda-gestos-v1.png',2),sleep:frames('yuna-sono-v1.png',2)};
fs.writeFileSync('src/js/chapters/ChapterArt.js','// Gerado por scripts/prepare-chapter-art.js; pinturas originais preservadas.\nexport const CHAPTER_ART='+JSON.stringify(art)+';\n');
console.log('Recortes dos capítulos reconstruídos: sete poses, pixels e proporções preservados.');
