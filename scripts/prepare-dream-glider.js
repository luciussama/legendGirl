import fs from 'node:fs';
import {PNG} from 'pngjs';
/** Amostras de alfa opaco compartilham a silhueta pintada com as colisões do planador. */
function measure(file,columns,rows){const png=PNG.sync.read(fs.readFileSync('assets/art/dream-forest/'+file)),mask=[];for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){const px=Math.min(png.width-1,Math.floor((x+.5)*png.width/columns)),py=Math.min(png.height-1,Math.floor((y+.5)*png.height/rows));mask.push(png.data[(py*png.width+px)*4+3]>=200?1:0);}return{file:'dream-forest/'+file,width:png.width,height:png.height,columns,rows,mask:mask.join('')};}
const data={girl:measure('yuna-planador-v1.png',48,48),thorn:measure('galho-espinhos-v1.png',48,160)};
fs.writeFileSync('src/js/dream-forest/DreamGliderArt.js','// Gerado por scripts/prepare-dream-glider.js; não editar máscaras manualmente.\nexport const DREAM_GLIDER_ART=Object.freeze('+JSON.stringify(data)+');\n');
console.log('Silhuetas do planador e dos espinhos preparadas.');
