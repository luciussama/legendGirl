import assert from 'node:assert/strict';
import {scan} from './fisica.js';
import {getApproachJumpSpeed,createBabyState} from '../../../../src/js/config.js';
const results=[];
for(const phase3 of [false,true])for(const difficulty of ['NORMAL','EASY'])for(const dt of [.5,1,1.2]) {
 const rows=[];
 for(let target=0;target<(phase3?16:22);target++) {
  const result=scan(target,phase3,undefined,dt,difficulty);if(difficulty==='NORMAL')assert.ok(result.ms<scan(target,phase3,undefined,dt,'EASY').ms,'NORMAL exige mais precisão em cada apoio');assert.ok(result.count>=8,'Saídas viáveis para alvo '+target);
  rows.push({target,...result,ms:Math.round(result.ms)});
 }
 if(difficulty==='NORMAL') {
  if(phase3)for(let i=1;i<rows.length;i++)assert.ok(rows[i].ms<=rows[i-1].ms+50,'Progressão do retorno não pode voltar a oferecer janela generosa: '+JSON.stringify({phase3,dt,previous:rows[i-1],current:rows[i]}));
  assert.ok(rows.at(-1).ms>=80,'Final conserva margem de reação utilizável');
  if(phase3){assert.ok(rows[0].ms<550,'Retorno já começa mais exigente');assert.ok(rows.at(-1).ms<=160,'Final do retorno exige precisão');}
  else {
   assert.ok(rows[0].ms>=900&&rows[1].ms>=450,'Introdução conserva margem antes dos saltos precisos');
   for(let index=-1;index<9;index++)assert.ok(getApproachJumpSpeed(index)>=createBabyState().baseVx,'Aproximação não pode criar frenagem aérea para estreitar janelas');
  }
 }
 results.push({phase3,difficulty,dt,rows});
}
console.log(JSON.stringify(results,null,2));console.log('APROVADO: aproximação sem frenagem artificial e progressão pós-clímax; 38 saltos, NORMAL/EASY e três passos de tempo.');
