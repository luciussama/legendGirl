import {createReviewStore} from '../tools/sprite-review/store.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildCatalog} from '../tools/sprite-review/catalog.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const catalog=await buildCatalog(root);await fs.mkdir(path.join(root,'docs/sprite-review'),{recursive:true});
await fs.writeFile(path.join(root,'docs/sprite-review/catalogo.json'),JSON.stringify(catalog,null,2)+'\n');
console.log(`Catálogo gerado: ${catalog.counts.files} imagens, ${catalog.counts.regions} recortes e ${catalog.counts.code} assinaturas por código.`);

const selectionPath=path.join(root,'docs/sprite-review/selecoes-exclusao.json');
const store=createReviewStore({catalogPath:path.join(root,'docs/sprite-review/catalogo.json'),selectionPath});
try{await fs.writeFile(selectionPath,JSON.stringify(await store.read(),null,2)+'\n',{flag:'wx'});}catch(error){if(error.code!=='EEXIST')throw error;}
