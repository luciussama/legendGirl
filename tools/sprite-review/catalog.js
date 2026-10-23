import {platforms,roomScenery} from '../../src/js/config.js';
import {darkRoomAtlas} from '../../src/js/assets/darkRoomAtlas.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {PNG} from 'pngjs';
import jpeg from 'jpeg-js';
import {OFFICIAL_FRAMES} from '../../src/js/assets/officialCharacter.js';
import {GIRL_V2_SETS} from '../../src/js/assets/illustratedGirl.js';
import {ARENA_GIRL_ANIMATION_FRAMES} from '../../src/js/toy-room/ArenaGirlAnimationFrames.js';
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const imagePattern=/\.(png|jpe?g|svg|webp|gif|avif)$/i;
const sourcePattern=/\.(js|json|html|css|py|md|txt)$/i;
const ignored=p=>p.startsWith('tools/sprite-review/')||p.startsWith('docs/sprite-review/')||p.startsWith('docs/diario-ia/')||p.startsWith('docs/sprites/')||p.includes('node_modules/')||p.startsWith('docs/qa/')||p.startsWith('assets/qa-testers/');
const normalize=s=>s.replaceAll('\\','/').replace(/^\.\//,'').replace(/^\//,'');
export const itemId=(file,region=null,signature=null)=>hash(JSON.stringify([file,region,signature])).slice(0,24);
export async function buildCatalog(root) {
 const files=execFileSync('rg',['--files','--hidden','-g','!.git/**','-g','!node_modules/**','-g','!docs/diario-ia/**'],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(p=>p&&!ignored(p)).sort();
 const sources=[];
 for(const file of files.filter(p=>sourcePattern.test(p))) {
  const stat=await fs.stat(path.join(root,file));if(stat.size>1500000)continue;
  const text=await fs.readFile(path.join(root,file),'utf8');sources.push({file,text,lines:text.split('\n'),runtime:file.startsWith('src/')||file==='index.html'});
 }
 const manifest=JSON.parse(await fs.readFile(path.join(root,'assets/manifest.json'),'utf8'));
 const aliases=new Map();for(const [key,value]of Object.entries(manifest.images||{})){
  const file=normalize(value);if(!aliases.has(file))aliases.set(file,[]);aliases.get(file).push(key);
 }
 const manifests=sources.filter(s=>s.file.endsWith('.json')&&s.file.startsWith('assets/')&&!/prompts|proveniencia/i.test(s.file));
 const activeManifests=new Set(manifests.filter(m=>sources.some(s=>s.runtime&&s.text.includes(path.basename(path.dirname(m.file))+'/'+path.basename(m.file)))).map(m=>m.file));
 const items=[];
 for(const file of files.filter(p=>imagePattern.test(p))) {
  const buffer=await fs.readFile(path.join(root,file)),ext=path.extname(file).slice(1).toLowerCase();
  let width=null,height=null;
  try {if(ext==='png'){const p=PNG.sync.read(buffer);width=p.width;height=p.height;}else if(['jpg','jpeg'].includes(ext)){const p=jpeg.decode(buffer,{useTArray:true});width=p.width;height=p.height;}else if(ext==='svg'){const text=buffer.toString(),v=text.match(/viewBox=["']\s*([\d.\-]+)\s+([\d.\-]+)\s+([\d.]+)\s+([\d.]+)/);if(v){width=Number(v[3]);height=Number(v[4]);}}}catch{}
  const keys=aliases.get(file)||[],refs=[];
  for(const source of sources){
   const suffix=file.split('/').slice(-3).join('/');
   source.lines.forEach((line,index)=>{
    const alias=keys.find(key=>source.runtime&&line.includes(`'${key}'`)||source.runtime&&line.includes(`"${key}"`));
    const literal=source.runtime||source.file.endsWith('.json')||source.file.startsWith('tests/')||source.file.startsWith('scripts/');
    if(literal&&(line.includes(file)||line.includes(suffix)||alias))refs.push({file:source.file,line:index+1,type:source.runtime?'runtime':activeManifests.has(source.file)?'manifesto-runtime':source.file==='assets/manifest.json'?'preload':'apoio',alias:alias||null});
   });
  }
  const hints=[];
  if(ext==='svg')hints.push('Arte vetorial: compare o estilo com as ilustrações atuais.');
  if(/baseline|rejected|antes|old|legacy/i.test(file))hints.push('O caminho indica referência anterior ou versão rejeitada.');
  if(/toy-room\/player[^/]*\.(svg|png)$/.test(file))hints.push('Família anterior da protagonista da Toy Room.');
  if(width&&height&&Math.max(width,height)<100)hints.push('Recorte pequeno: verificar detalhamento ao ampliar.');
  const usage=refs.some(r=>['runtime','manifesto-runtime'].includes(r.type))?'runtime':refs.some(r=>r.type==='preload')?'preload':refs.length?'apoio':'nao-localizado';
  items.push({id:itemId(file),kind:'file',path:file,title:path.basename(file),format:ext,width,height,bytes:buffer.length,sha256:hash(buffer),aliases:keys,usage,references:refs,hints,family:file.split('/').slice(0,-1).join('/')});
 }
 const addRegion=(file,pose,index,r)=>{
  file=path.posix.normalize(file);
  const parent=items.find(i=>i.path===file&&i.kind==='file');if(!parent)return;
  const region={x:r.x||0,y:r.y||0,width:r.width||r.w,height:r.height||r.h};
  if(!Object.values(region).every(Number.isFinite)||region.width<=0||region.height<=0)return;
  const id=itemId(file,region);if(items.some(i=>i.id===id))return;
  items.push({...parent,id,kind:'region',title:`${pose} · quadro ${index+1}`,region,parentId:parent.id,hints:[...parent.hints,'Recorte individual: remover exige recompor a prancha e ajustar os metadados; não exclui a imagem inteira.']});
 };
 for(const [name,r]of Object.entries(darkRoomAtlas))addRegion('assets/art/dark-room/production-spritesheet.png',name,0,r);
 for(let index=0;index<8;index++)addRegion('assets/art/toy-room/sword-attack-sheet.png','ataque de espada anterior',index,{x:index*144,y:288,width:144,height:192});
 for(const source of sources.filter(s=>s.runtime))for(const match of source.text.matchAll(/getRegion\(\s*['"]([^'"]+)['"]\s*,\s*\{([^}]+)\}/g)){
  const file=normalize(manifest.images?.[match[1]]||'');if(!file)continue;
  const region={};for(const fieldMatch of match[2].matchAll(/\b(x|y|width|height)\s*:\s*(\d+)/g))region[fieldMatch[1]]=Number(fieldMatch[2]);
  if(['x','y','width','height'].every(key=>key in region))addRegion(file,match[1],0,region);
 }
 for(const frames of Object.values(ARENA_GIRL_ANIMATION_FRAMES))for(const frame of frames){
  const parent=items.find(i=>i.kind==='file'&&i.path===path.posix.normalize('assets/art/toy-room/battle/'+frame.file));if(!parent)continue;
  parent.usage='runtime';if(!parent.references.some(r=>r.file==='src/js/toy-room/ArenaGirlAnimationFrames.js'))parent.references.push({file:'src/js/toy-room/ArenaGirlAnimationFrames.js',line:1,type:'runtime',alias:'metadados resolvidos'});
 }
 for(const [pose,frames]of Object.entries(OFFICIAL_FRAMES))frames.forEach((r,i)=>addRegion('assets/art/dark-room/sprites/official-character.png',pose,i,r));
 for(const [pose,set]of Object.entries(GIRL_V2_SETS))set.frames.forEach((r,i)=>addRegion(set.file,pose,i,r));
 for(const [pose,frames]of Object.entries(ARENA_GIRL_ANIMATION_FRAMES))frames.filter(f=>f.x||f.y||f.file.includes('animation-v2')).forEach((r,i)=>addRegion('assets/art/toy-room/battle/'+r.file,pose,i,r));
 const signatures=[
  ...[...new Set(platforms.map(p=>p.style))].map(type=>({file:'src/js/environment/PlatformRenderer.js',symbol:'renderPlatforms',variant:type,preview:'platform',title:'Plataforma procedural · '+type})),
  ...[...new Set(roomScenery.map(p=>p.type))].map(type=>({file:'src/js/environment/BackgroundRenderer.js',symbol:'renderScenery',variant:type,preview:'scenery',title:'Decoração procedural · '+type})),
  ...['baby','fairy'].flatMap(type=>['normal','happy','shocked','annoyed','determined'].map(mood=>({file:'src/js/ui/DialogueRenderer.js',symbol:'drawPortrait',variant:type+':'+mood,preview:'portrait',title:'Retrato desenhado por código · '+type+' · '+mood}))),

  ...['teddy','train','robot','bunny','duck','blocks','drum','jack'].map(type=>({file:'src/js/toy-room/ToyRenderer.js',symbol:'renderToy',variant:type,preview:'toy',title:`Desenho por código · ${type}`})),
  ...['chest','shelf','armchair','fortress','table','rocking-horse','wardrobe'].map(type=>({file:'src/js/toy-room/RoomEnvironmentRenderer.js',symbol:'renderFurniture',variant:type,preview:'furniture',title:`Mobília por código · ${type}`})),
  {file:'src/js/toy-room/RoomEnvironmentRenderer.js',symbol:'renderBackground',variant:'sem-assets',preview:'room-background',title:'Sala desenhada por código, sem ilustrações carregadas'},
  {file:'src/js/toy-room/ToyRoomEntities.js',symbol:'renderFairy',variant:'sem-assets',preview:'toy-fairy',title:'Fada geométrica da Toy Room'},
  {file:'src/js/entities/FairyRenderer.js',symbol:'render',variant:'normal',preview:'dark-fairy',title:'Fada desenhada por código da primeira fase'}
 ];
 for(const signature of signatures){const source=sources.find(s=>s.file===signature.file);if(!source)continue;const line=source.lines.findIndex(l=>l.includes(signature.symbol+'('))+1;items.push({id:itemId(signature.file,null,signature.variant+signature.symbol),kind:'code',path:signature.file,title:signature.title,signature:{symbol:signature.symbol,variant:signature.variant,preview:signature.preview},sha256:hash(source.text),family:'Assinaturas desenhadas por código',usage:'runtime',references:[{file:signature.file,line,type:'runtime'}],hints:['Trecho de um renderer compartilhado: classificar este desenho não autoriza excluir o módulo JavaScript inteiro.']});}
 const version=hash(JSON.stringify(items));
 return {schemaVersion:1,version,generatedAt:new Date().toISOString(),scope:'Imagens do repositório não ignoradas pelo Git, recortes conhecidos e desenhos procedurais da Toy Room e da fada.',limitations:['Referências calculadas estaticamente; ausência de referência não prova que um arquivo esteja sem uso.','Capturas ignoradas pelo Git e dependências externas não são recursos do catálogo.','O estilo antigo é decidido pela revisão humana; os indícios não selecionam exclusões.'],counts:{files:items.filter(i=>i.kind==='file').length,regions:items.filter(i=>i.kind==='region').length,code:items.filter(i=>i.kind==='code').length},items};
}
