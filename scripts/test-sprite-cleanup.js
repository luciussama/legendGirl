import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {RoomEnvironmentRenderer} from '../src/js/toy-room/RoomEnvironmentRenderer.js';
const selection=JSON.parse(await fs.readFile('docs/sprite-review/selecoes-exclusao.json','utf8'));
const catalog=JSON.parse(await fs.readFile('docs/sprite-review/catalogo.json','utf8'));
const removed=new Set(selection.selectedForDeletion.map(item=>item.path));
for(const file of removed)await assert.rejects(fs.access(file),'A imagem marcada foi retirada: '+file);
for(const item of catalog.items.filter(item=>item.kind==='file'&&selection.decisions[item.id]==='current')){
 const bytes=await fs.readFile(item.path);
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),item.sha256,'Arte aprovada preservada: '+item.path);
}
const manifest=JSON.parse(await fs.readFile('assets/manifest.json','utf8'));
for(const source of Object.values(manifest.images))assert.ok(!removed.has(source.replace(/^\.\//,'')),'Manifesto sem imagem removida.');
const calls=[];const renderer=new RoomEnvironmentRenderer();renderer.renderPerspectiveFloor=()=>calls.push('piso-ilustrado');
renderer.renderBackground({fillRect:()=>calls.push('base')},1200,1600,{environmentSheet:{},introductionFloorOnly:true});
assert.deepEqual(calls,['base','piso-ilustrado'],'A base não cobre o piso ilustrado após excluir o SVG.');
const context=new Proxy({}, {get:(_target,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):key==='measureText'?()=>({width:20}):()=>{},set:()=>true});
renderer.renderBackground(context,1200,1600,{environmentSheet:{}});
console.log('APROVADO: imagens escolhidas removidas, artes aprovadas intactas, manifesto sem referências ausentes e piso ilustrado preservado.');
