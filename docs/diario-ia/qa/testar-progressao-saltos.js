import assert from 'node:assert/strict';
import {scan} from './fisica-janelas-saltos.js';
const results=[];
for(const phase3 of [false,true])for(const difficulty of ['NORMAL','EASY'])for(const dt of [.5,1,1.2]) {
 const rows=[];
 for(let target=0;target<(phase3?16:10);target++) {
  const result=scan(target,phase3,undefined,dt,difficulty);assert.ok(result.count>=8,'Saídas viáveis para alvo '+target);
  rows.push({target,...result,ms:Math.round(result.ms)});
 }
 if(difficulty==='NORMAL') {
  for(let i=1;i<rows.length;i++)assert.ok(rows[i].ms<=rows[i-1].ms+20,'Progressão não pode voltar a oferecer janela generosa: '+JSON.stringify({phase3,dt,previous:rows[i-1],current:rows[i]}));
  assert.ok(rows.at(-1).ms>=80,'Final conserva margem de reação utilizável');
  if(phase3){assert.ok(rows[0].ms<550,'Retorno já começa mais exigente');assert.ok(rows.at(-1).ms<=160,'Final do retorno exige precisão');}
  else assert.ok(rows[0].ms>1000&&rows[1].ms>750,'Dois primeiros saltos continuam generosos');
 }
 results.push({phase3,difficulty,dt,rows});
}
console.log(JSON.stringify(results,null,2));console.log('APROVADO: progressão de 26 saltos, NORMAL/EASY e três passos de tempo; inícios acessíveis e retorno exigente com saídas viáveis.');
