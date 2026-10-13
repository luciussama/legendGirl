import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {PNG} from 'pngjs';
import {CURRENT_SCENERY,drawCurrentScenery} from '../src/js/assets/currentScenery.js';
const selected=JSON.parse(await fs.readFile('docs/sprite-review/selecoes-exclusao.json','utf8'));
const manifest=JSON.parse(await fs.readFile('assets/manifest.json','utf8'));
const platforms=await fs.readFile('src/js/environment/PlatformRenderer.js','utf8');
const scenery=await fs.readFile('src/js/environment/BackgroundRenderer.js','utf8');
for(const item of selected.selectedCode){
 const {variant,preview}=item.signature;
 if(preview==='platform')assert.ok(!platforms.includes("case '"+variant+"':"),'Desenho antigo removido da plataforma: '+variant);
 if(preview==='scenery'){
  assert.ok(CURRENT_SCENERY[variant],'Cenário com substituto: '+variant);
  const fallback=scenery.slice(scenery.indexOf('      switch (item.type)'));
  assert.ok(!fallback.includes("case '"+variant+"':"),'Desenho antigo removido do cenário: '+variant);
 }
}
const calls=[];const assets={get:()=>({width:180,height:160}),getRegion:()=>({width:120,height:90})};
for(const type of Object.keys(CURRENT_SCENERY)){
 assert.equal(drawCurrentScenery({drawImage:(_image,...args)=>calls.push(args)},assets,type,100,500),true);
 const args=calls.at(-1);assert.ok(args.every(Number.isFinite),'Posicionamento válido: '+type);
 assert.ok(args[2]>0&&args[3]>0,'Dimensões válidas: '+type);
}
assert.equal(calls.length,17,'Todos os cenários selecionados desenham arte atual.');
for(const spec of Object.values(CURRENT_SCENERY))assert.ok(manifest.images[spec.key],'Recurso pré-carregado: '+spec.key);
for(const [key,path]of Object.entries(manifest.images).filter(([key])=>key.startsWith('current-scenery-'))){
 const png=PNG.sync.read(await fs.readFile(path));
 const alpha=[];for(let i=3;i<png.data.length;i+=4)alpha.push(png.data[i]);
 assert.ok(alpha.some(value=>value===0)&&alpha.some(value=>value>0),'Sprite visível com transparência real: '+key);
}
console.log('APROVADO: alternativas antigas removidas, 17 cenários com substitutos, recursos pré-carregados, proporções válidas e transparência real.');
