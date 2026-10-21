import assert from 'node:assert/strict';
import {createBabyState,getApproachJumpSpeed,platforms} from '../../../../src/js/config.js';
import {attemptFrom} from './fisica.js';
const results=[];
for(const dt of [.5,1,1.2])for(const difficulty of ['NORMAL','EASY'])for(const x of [1408,1412,1416,1420]) {
 const before=attemptFrom(8,false,x,dt,difficulty,.3266);
 assert.notEqual(before.landed,8,'Reproduz o alcance insuficiente da velocidade regressiva');
 const after=attemptFrom(8,false,x,dt,difficulty);
 assert.equal(after.landed,8,'Saída normal das gavetas alcança a bailarina: '+JSON.stringify({dt,difficulty,x,after}));
 const p=platforms[8],left=p.standRegion?.x??p.x,right=left+(p.standRegion?.w??p.w);
 assert.ok(after.feetX>=left+6&&after.feetX<=right-6,'Pés pousam dentro da superfície, sem depender da borda do corpo');
 assert.ok(after.airVx>=createBabyState().baseVx,'Salto não perde a velocidade horizontal de corrida');
 results.push({dt,difficulty,x,before,after});
}
for(let index=-1;index<9;index++)assert.ok(getApproachJumpSpeed(index)>=createBabyState().baseVx,'Nenhum salto de aproximação freia artificialmente abaixo da corrida');
console.log(JSON.stringify(results,null,2));console.log('APROVADO: regressão reproduzida com 0,3266; 24 travessias normais alcançam a bailarina com pés apoiados e sem frenagem aérea.');
