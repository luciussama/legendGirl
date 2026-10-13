/** Validação de publicação, sem criar relatórios ou instrumentação de QA no projeto. */
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
for(const match of fs.readFileSync('index.html','utf8').matchAll(/(?:src|href)=["']([^"']+)["']/g)){
 const value=match[1];if(/^(#|data:|https?:|\/\/|mailto:)/.test(value))continue;
 if(value.startsWith('/'))throw Error('Recurso incompatível com subpasta: '+value);
 const file=path.resolve(root,value.split(/[?#]/)[0]);if(!file.startsWith(root+path.sep)||!fs.existsSync(file))throw Error('Recurso de publicação ausente: '+value);
}
console.log('Publicação validada: recursos locais existentes e caminhos relativos.');
