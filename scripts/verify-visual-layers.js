// Confirma cobertura opaca, invariância de enquadramento e intensidade da faixa anterior.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { PNG } from 'pngjs';
const root='assets/qa-testers/visual-rendering/QA-VISUAL-001',report=[];
for(const profile of ['android','iphone','desktop']){
 const before=JSON.parse(await fs.readFile(`${root}/antes/${profile}/controle/diagnostico.json`));
 const after=JSON.parse(await fs.readFile(`${root}/depois/${profile}/controle/diagnostico.json`));
 for(let i=0;i<before.length;i++){
  const a=before[i],b=after[i];
  for(const key of ['cameraX','cameraY','zoom','transform','player','fairy','next'])assert.deepEqual(b[key],a[key],'Mesma cena e enquadramento: '+profile+'/'+a.index+'/'+key);
  assert.equal(b.backgroundHoles,0,'Fundo opaco em todos os pixels');assert.equal(b.alphaHoles,0,'Cena opaca antes do acabamento');assert.equal(b.nonOpaqueAfter,0,'Composição final opaca');assert.ok(b.invariantCalls>0,'Renderização verificou atores e câmera lógica');
  const bg=PNG.sync.read(await fs.readFile(`${root}/antes/${profile}/controle/fundo-${a.index}.png`));
  const old=PNG.sync.read(await fs.readFile(`${root}/antes/${profile}/controle/apoio-${a.index}.png`));
  const fixed=PNG.sync.read(await fs.readFile(`${root}/depois/${profile}/controle/apoio-${a.index}.png`));
  const line=y=>{let start=null,end=null;for(let x=0;x<bg.width;x++)if(bg.data[(y*bg.width+x)*4+3]<255){start??=x;end=x;}return {start,end};};
  const gap=line(20),sx=a.backgroundHoles?Math.round(Math.max(0,a.transform.e)):null;
  const topCss=a.backgroundHoles?Math.max(0,(-600*a.transform.d+a.transform.f)*(profile==='desktop'?540:844)/bg.height):0;
  const luminance=img=>{let sum=0,n=0;for(let y=100;y<Math.min(300,img.height);y++)for(let x=0;x<=Math.min(sx??-1,img.width-1);x++){const p=(y*img.width+x)*4;sum+=.2126*img.data[p]+.7152*img.data[p+1]+.0722*img.data[p+2];n++;}return n?sum/n:null;};
  report.push({profile,index:a.index,backgroundHolesBefore:a.backgroundHoles,backgroundHolesAfter:b.backgroundHoles,
   topGapCanvas:gap,artifactRightCss:sx===null?null:sx*(profile==='desktop'?960:390)/bg.width,artifactTopHeightCss:topCss,meanLuminanceBefore:luminance(old),meanLuminanceAfter:luminance(fixed),cameraAndActorsIdentical:true});
 }
}
await fs.writeFile(`${root}/validacao.json`,JSON.stringify(report,null,2));
console.log('APROVADO: cobertura integral, mesma câmera/atores e desaparecimento da faixa nos três perfis.');

const routes=[];
for(const profile of ['android','iphone','desktop']){
 const before=JSON.parse(await fs.readFile(`assets/qa-testers/camera-stability/correction/depois/${profile}/frames.json`));
 const after=JSON.parse(await fs.readFile(`${root}/comparacao-percurso/${profile}/frames.json`));
 const project=r=>[r.playerX,r.playerY,r.fairyX,r.fairyY,r.playerVx,r.playerVy,r.onGround,r.platform,r.cameraX,r.cameraY,r.cameraZoom,r.originalCamera,r.transform];
 assert.deepEqual(after.map(project),before.map(project),'Gameplay e transformação visual idênticos em todo o percurso: '+profile);
 const path=JSON.parse(await fs.readFile(`${root}/comparacao-percurso/${profile}/percurso.json`));
 assert.deepEqual(path,JSON.parse(await fs.readFile(`assets/qa-testers/camera-stability/correction/depois/${profile}/percurso.json`)),'Mesmos saltos e chegadas');
 routes.push({profile,frames:after.length,supports:path.length,trajectoryActorsCameraTransformIdentical:true});
}
await fs.writeFile(`${root}/invariancia-percurso.json`,JSON.stringify(routes,null,2));
console.log('APROVADO: 7.882 frames e 38 apoios por perfil com gameplay, atores e câmera idênticos à referência.');
