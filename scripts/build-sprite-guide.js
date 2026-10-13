/** Gera o mapa atual de arte sem sobrescrever a seleção histórica de limpeza. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildCatalog} from '../tools/sprite-review/catalog.js';
import {CURRENT_SCENERY} from '../src/js/assets/currentScenery.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const catalog=await buildCatalog(root);
const selected=JSON.parse(await fs.readFile(path.join(root,'docs/sprite-review/selecoes-exclusao.json'),'utf8'));
const removed=new Set(selected.selectedCode.map(item=>item.id));
const items=catalog.items.filter(item=>item.kind!=='code'||!removed.has(item.id));
const manifest=JSON.parse(await fs.readFile(path.join(root,'assets/manifest.json'),'utf8'));
// Resolve os nomes dinâmicos de cenários que a busca literal não consegue associar ao renderer.
for(const [type,spec]of Object.entries(CURRENT_SCENERY)){
 const file=manifest.images[spec.key]?.replace(/^\.\//,'');const item=items.find(item=>item.kind==='file'&&item.path===file);
 if(item){item.usage='runtime';item.references.push({file:'src/js/assets/currentScenery.js',line:1,type:'runtime',symbol:type});}
}
const fileItems=items.filter(item=>item.kind==='file'),regions=items.filter(item=>item.kind==='region'),code=items.filter(item=>item.kind==='code');
const out=path.join(root,'docs/sprites');await fs.mkdir(out,{recursive:true});
const relative=file=>'../../'+file;
const refs=item=>item.references.map(ref=>'['+ref.file+':'+ref.line+']('+relative(ref.file)+')'+(ref.symbol?' ('+ref.symbol+')':'')).join('<br>')||'Nenhuma referência estática localizada; avaliar caminhos dinâmicos.';
const header='# Mapa completo de arquivos de arte\n\nGerado por `npm run docs:sprites`. Referências são estáticas e não certificam uso efetivo. O guia de edição descreve consumidores dinâmicos e fontes de verdade. Os números de linha são referências da geração; confirme com `rg` após alterações.\n\n';
const table='| Arquivo / prévia | Dimensões | Chaves do manifesto | Uso encontrado | Onde aparece |\n| --- | --- | --- | --- | --- |\n'+fileItems.map(item=>'| ['+item.path+']('+relative(item.path)+') | '+(item.width&&item.height?item.width+' × '+item.height:'não identificado')+' | '+(item.aliases.join(', ')||'manifesto dedicado / referência direta / apoio')+' | '+item.usage+' | '+refs(item)+' |').join('\n')+'\n';
await fs.writeFile(path.join(out,'MAPA-SPRITES.md'),header+table);
await fs.writeFile(path.join(out,'RECORTES.md'),'# Recortes de pranchas\n\nGerado por `npm run docs:sprites`. Cada linha é uma região da imagem, não um arquivo independente. Ao editar, preservar coordenadas ou atualizar os metadados e os consumidores.\n\n| Prancha | Pose ou elemento | x, y, largura, altura | Referências |\n| --- | --- | --- | --- |\n'+regions.map(item=>'| ['+item.path+']('+relative(item.path)+') | '+item.title+' | '+Object.values(item.region).join(', ')+' | '+refs(item)+' |').join('\n')+'\n');
await fs.writeFile(path.join(out,'DESENHOS-EM-CODIGO.md'),'# Desenhos remanescentes em código\n\nGerado por `npm run docs:sprites`. Exclui as 46 assinaturas removidas pela revisão. Este levantamento cobre as famílias catalogadas; efeitos, shaders Canvas e auxiliares de outras famílias ainda precisam de inspeção no código.\n\n| Módulo | Função / variante | Referências |\n| --- | --- | --- |\n'+code.map(item=>'| ['+item.path+']('+relative(item.path)+') | '+item.signature.symbol+' / '+item.signature.variant+' | '+refs(item)+' |').join('\n')+'\n');
await fs.writeFile(path.join(out,'inventario.json'),JSON.stringify({schemaVersion:1,counts:{files:fileItems.length,regions:regions.length,code:code.length},items},null,2)+'\n');
console.log('Mapa de arte atualizado: '+fileItems.length+' arquivos, '+regions.length+' recortes e '+code.length+' assinaturas remanescentes.');
