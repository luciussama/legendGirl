import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');

/** Aplica somente escolhas explícitas para arquivos; recortes e código exigem edição específica. */
export async function applySelections({root,catalog,selection,apply=false,includeReferenced=false}) {
 if(selection.catalogVersion!==catalog.version)throw Error('O catálogo da seleção não corresponde à análise atual.');
 const byId=new Map(catalog.items.map(i=>[i.id,i])),targets=[];
 for(const proposed of selection.selectedForDeletion||[]){
  const item=byId.get(proposed.id);
  if(!item||item.kind!=='file'||selection.decisions?.[item.id]!=='old'||item.path!==proposed.path||item.sha256!==proposed.sha256)throw Error('O plano contém uma exclusão não autorizada pelas escolhas.');
  const full=path.resolve(root,item.path);if(!full.startsWith(path.resolve(root)+path.sep))throw Error('Caminho fora do projeto.');
  const stat=await fs.lstat(full);if(!stat.isFile()||stat.isSymbolicLink())throw Error('O alvo precisa ser um arquivo regular do projeto.');
  if(hash(await fs.readFile(full))!==item.sha256)throw Error('Arquivo alterado desde a revisão: '+item.path);
  if(catalog.items.some(r=>r.kind==='region'&&r.parentId===item.id&&selection.decisions?.[r.id]==='current'))throw Error('A prancha tem um recorte marcado como atual: '+item.path);
  targets.push(item);
 }
 const referenced=targets.filter(i=>i.usage==='runtime'||i.usage==='preload');
 if(apply&&!includeReferenced&&referenced.length)throw Error('Há arquivos referenciados pelo jogo ou manifesto. Migre as referências antes de excluir, ou autorize explicitamente com --include-referenced.');
 const report={applied:false,files:targets.map(i=>({path:i.path,sha256:i.sha256,usage:i.usage})),regions:selection.selectedRegions||[],code:selection.selectedCode||[],referenced:referenced.map(i=>i.path)};
 if(!apply||!targets.length)return report;
 const batch=new Date().toISOString().replaceAll(':','-')+'-'+crypto.randomBytes(4).toString('hex');
 const quarantine=path.join(root,'.sprite-review-quarantine',batch),moved=[];
 try{
  for(const item of targets){const source=path.join(root,item.path),destination=path.join(quarantine,item.path);await fs.mkdir(path.dirname(destination),{recursive:true});await fs.rename(source,destination);moved.push({source,destination,path:item.path,sha256:item.sha256});}
  report.applied=true;report.quarantine=path.relative(root,quarantine);report.moved=moved.map(i=>({path:i.path,sha256:i.sha256}));
  await fs.writeFile(path.join(quarantine,'registro.json'),JSON.stringify(report,null,2)+'\n');
 }catch(error){for(const item of moved.reverse()){await fs.mkdir(path.dirname(item.source),{recursive:true});await fs.rename(item.destination,item.source);}throw error;}
 return report;
}
