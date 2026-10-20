import assert from 'node:assert/strict';
import { createChaseState, restoreChaseState, stepChase, hitsObstacle } from '../../../../src/js/bear-chase/ChaseSimulation.js';
import { chasePacing } from '../../../../src/js/bear-chase/ChasePacing.js';
import { chaseCameraFrame } from '../../../../src/js/bear-chase/ChaseCamera.js';

let previous = chasePacing(0);
for (let distance=1;distance<=720;distance++) {
  const now=chasePacing(distance);
  assert.ok(now.speed>=previous.speed&&now.gap<=previous.gap&&now.interval<=previous.interval&&now.flight<=previous.flight,'Progressão contínua e coerente.');
  assert.ok(now.speed-previous.speed<.03&&previous.gap-now.gap<.7,'Sem degrau de velocidade ou aproximação.');
  previous=now;
}
assert.equal(chasePacing(0).speed,8);assert.equal(chasePacing(720).speed,12);
const results=[];
for(const difficulty of ['NORMAL','EASY'])for(const decisionSteps of [1,18,24]) {
 const s=createChaseState(),throws=[],groups=new Map();let ticks=0,target=0,chest=0,stoppedFrames=0;
 while(s.stage!=='COMPLETE'&&ticks++<12000) {
  if(ticks%decisionSteps===0){const near=s.obstacles.filter(o=>o.z>=s.distance-.5&&!o.hit).sort((a,b)=>a.z-b.z)[0];target=0;if(near){const group=s.obstacles.filter(o=>Math.abs(o.z-near.z)<.01&&!o.hit);target=[-2.4,0,2.4].filter(x=>group.every(o=>Math.abs(x-o.x)>1.1)).sort((a,b)=>Math.abs(a-s.x)-Math.abs(b-s.x))[0]??0;}}
  const events=stepChase(s,Math.max(-1,Math.min(1,(target-s.x)*4)),1/60,difficulty);
  if(s.stage==='RUNNING'&&s.distance===720)stoppedFrames++;
  chest+=events.filter(e=>e.type==='chestReturned').length;
  for(const e of events.filter(e=>e.type==='toyThrown')) {
   const o=s.obstacles.find(o=>o.id===e.id);
   if(!groups.has(o.z)){const item={s:s.distance,z:o.z,time:s.time,gap:s.gap,lead:o.z-s.distance,flight:o.flight,reaction:null};groups.set(o.z,item);throws.push(item);}
  }
  for(const item of groups.values())if(item.reaction===null&&s.distance>=item.z-.5)item.reaction=s.time-item.time-item.flight;
  if(ticks%1100===0){const restored=restoreChaseState(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored,s);const a=structuredClone(s),b=restored;for(let i=0;i<50;i++)assert.deepEqual(stepChase(a,0),stepChase(b,0));assert.deepEqual(a,b);}
 }
 assert.equal(s.stage,'COMPLETE');assert.equal(s.hits,0,'Desvio deve ser viável com latência: '+JSON.stringify({difficulty,decisionSteps,hits:s.hits}));assert.equal(chest,1);assert.ok(stoppedFrames<=1,'Não deve congelar a passada esperando a captura no fim da pista.');
 const early=throws.filter(o=>o.s<250),late=throws.filter(o=>o.s>550),mean=(a,key)=>a.reduce((n,o)=>n+o[key],0)/a.length;
 assert.ok(late.length>=2,'Deve haver lançamentos no trecho final: '+JSON.stringify({difficulty,decisionSteps,throws}));assert.ok(mean(late,'lead')<mean(early,'lead'));assert.ok(mean(late,'flight')<mean(early,'flight'));
 const minReaction=Math.min(...throws.map(o=>o.reaction).filter(x=>x!==null));assert.ok(minReaction>=(difficulty==='EASY'?1.05:.85),'Margem real até o contato, após pouso.');
 results.push({difficulty,latency:decisionSteps/60,seconds:s.time,hits:s.hits,stoppedFrames,groups:throws.length,lastThrow:throws.at(-1).s,earlyLead:mean(early,'lead'),lateLead:mean(late,'lead'),minReaction});
}
const old=createChaseState();old.obstacles=[{id:1,x:0,z:10,age:0,width:1.15,kind:'blocks',fromX:0,fromZ:15}];assert.deepEqual(restoreChaseState(old),old);
assert.equal(hitsObstacle({...old.obstacles[0],age:.4,flight:.38},0,0,9,11),true);
assert.equal(hitsObstacle({...old.obstacles[0],age:.4},0,0,9,11),false);
assert.throws(()=>restoreChaseState({...old,obstacles:[{...old.obstacles[0],flight:NaN}]}));
for(const [portrait,aspect]of [[false,1.6],[true,390/844],[false,844/390]]) {
 const initial=chaseCameraFrame({stage:'RUNNING',distance:0,age:25,gap:29,x:0,stumble:0},portrait,aspect);
 const endState={stage:'RUNNING',distance:720,age:70,gap:1.6,x:0,stumble:0};const final=chaseCameraFrame(endState,portrait,aspect);
 assert.ok(final.position.z<initial.position.z&&final.position.y<initial.position.y);
 assert.deepEqual(chaseCameraFrame(endState,portrait,aspect),final,'Pausa e restauração preservam o quadro.');
 assert.deepEqual(chaseCameraFrame({...endState,stage:'CAUGHT',age:0},portrait,aspect),final,'Captura começa na mesma câmera.');
 const sample=[];for(let i=0;i<100;i++){const d=650+i/50,f=chaseCameraFrame({...endState,distance:d},portrait,aspect);const base=(portrait?5.2:3.9)-(portrait?.8:.65)*chasePacing(d).intensity;sample.push(f.position.y-base);}
 assert.ok(Math.max(...sample)-Math.min(...sample)>.06);assert.ok(sample.every(y=>Math.abs(y)<=.041));
}
console.log('APROVADO: aceleração, câmera contínua, balanço limitado, margens reais de reação, voo por objeto, save antigo e seis percursos sem dano.',JSON.stringify(results));
