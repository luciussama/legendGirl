import assert from 'node:assert/strict';
import {createChaseState,restoreChaseState,stepChase} from '../../../../src/js/bear-chase/ChaseSimulation.js';
import {chasePacing} from '../../../../src/js/bear-chase/ChasePacing.js';
import {CHASE_CONFIG as C} from '../../../../src/js/bear-chase/ChaseConfig.js';
import {corridors,targetFor} from '../balanceamento-20261020/corredor.js';
const results=[];
for(const difficulty of ['NORMAL','EASY'])for(const seed of [1,2,23,729,1729,4294967295])for(const latency of [1,18,24]){
 const s=createChaseState();s.seed=seed;const groups=[];let ticks=0,target=0;
 while(s.stage!=='COMPLETE'&&ticks++<12000){
  if(ticks%latency===0)target=targetFor(s,.5);
  const events=stepChase(s,Math.max(-1,Math.min(1,(target-s.x)*4)),C.step,difficulty);
  const thrown=events.filter(e=>e.type==='toyThrown').map(e=>s.obstacles.find(o=>o.id===e.id));
  if(thrown.length){
   const free=corridors(thrown);assert.equal(free.length>0,true);
   const progress=s.distance/C.length,expected=difficulty==='EASY'||progress<.7?(progress>.35?2:1):progress<.85?3:2;
   assert.equal(thrown.length,expected,'Quantidade real por lançamento e progresso');assert.ok(thrown.length<=3,'Nunca gerar quatro brinquedos');
   groups.push({distance:s.distance,time:s.time,z:thrown[0].z,flight:thrown[0].flight,side:s.dropSide,free});
  }
  for(const g of groups)if(g.reaction===undefined&&s.distance>=g.z-.5)g.reaction=s.time-g.time-g.flight;
  if(ticks%997===0){const a=structuredClone(s),b=restoreChaseState(JSON.parse(JSON.stringify(s)));for(let i=0;i<120;i++){const input=Math.max(-1,Math.min(1,(targetFor(a)-a.x)*4));assert.deepEqual(stepChase(a,input,C.step,difficulty),stepChase(b,input,C.step,difficulty));}assert.deepEqual(a,b);}
 }
 assert.equal(s.stage,'COMPLETE',JSON.stringify({difficulty,seed,latency,stage:s.stage,hits:s.hits}));assert.equal(s.hits,0,'Desvios viáveis com latência de até 400 ms');
 const final=groups.filter(g=>g.distance>=C.length*.85);
 if(difficulty==='NORMAL'){
  assert.ok(final.length>=7,'Pressão contínua no final');assert.ok(final[0].distance<C.length*.85+.25,'Primeiro par já na entrada dos 15% finais');
  for(let i=1;i<final.length;i++){
   assert.ok(Math.abs(final[i].time-final[i-1].time-1)<1e-8,'Um lançamento por segundo sem pausas de emboscada');
   assert.equal(Math.abs(final[i].side-final[i-1].side),1,'Alterna uma faixa de cada vez');
   assert.equal(final[i].free.some(([a,b])=>final[i-1].free.some(([c,d])=>Math.min(b,d)>Math.max(a,c))),false,'Não existe posição parada segura para dois pares consecutivos');
  }
  assert.ok(final.at(-1).z>710,'Último par exige desvio perto da chegada');
  assert.ok(final.every(g=>g.reaction>=.85),'Preserva reação após o brinquedo pousar');
  assert.ok(final.every(g=>g.z<=C.length-.5),'Sem lançamentos além da chegada');
 }
 results.push({difficulty,seed,latencyMs:latency/60*1000,finalGroups:final.length,lastZ:final.at(-1)?.z,minimumReaction:Math.min(...final.map(g=>g.reaction)),hits:s.hits});
}
for(const x of [-3.6,-2.4,0,2.4,3.6]){
 const s=createChaseState();Object.assign(s,{stage:'RUNNING',distance:612-1e-4,time:60,age:60,nextDrop:0,x,gap:chasePacing(612).gap});for(let i=0;i<1800&&s.stage==='RUNNING';i++)stepChase(s,0,C.step,'NORMAL');assert.ok(s.hits>0,'Ficar parado, inclusive nas bordas, não resolve a sequência final');
}
console.log('APROVADO: 36 percursos completos, 6 sementes, latência até 400 ms, cadência constante, alternância obrigatória, aviso final, RNG/save e limite de três.',JSON.stringify(results));
