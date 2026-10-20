import assert from 'node:assert/strict';
import {createChaseState,restoreChaseState,stepChase} from '../../../../src/js/bear-chase/ChaseSimulation.js';
import {chaseLives,chaseMaxLives,CHASE_FALL_DURATION} from '../../../../src/js/bear-chase/ChaseHealth.js';

for(const difficulty of ['NORMAL','EASY']) {
 const maximum=chaseMaxLives(difficulty),s=createChaseState();Object.assign(s,{stage:'RUNNING',distance:20,gap:29,nextDrop:1000});
 assert.equal(maximum,difficulty==='EASY'?6:3);assert.equal(chaseLives(s,difficulty),maximum);
 for(let hit=1;hit<=maximum;hit++) {
  s.immunity=0;
  s.obstacles=[0,1].map(id=>({id,x:s.x,z:s.distance+.05,age:1,width:1.15,kind:'blocks',fromX:0,fromZ:s.distance+5}));
  const events=stepChase(s,0,1/60,difficulty);
  assert.equal(s.hits,hit,'Dois objetos no mesmo contato retiram somente uma vida.');assert.equal(chaseLives(s,difficulty),maximum-hit);
  assert.equal(events.filter(e=>e.type==='obstacleHit').length,1);
  assert.equal(s.chestApplied,false);
  if(hit<maximum){assert.equal(s.stage,'RUNNING');stepChase(s,0,1/60,difficulty);assert.equal(s.hits,hit,'Invulnerabilidade preserva recuperação.');}
  else{assert.equal(s.stage,'FALLING');assert.equal(s.age,0);assert.ok(events.some(e=>e.stage==='FALLING'));assert.equal(events.some(e=>e.type==='toyThrown'||e.type==='step'||e.type==='chestReturned'),false);}
  assert.deepEqual(restoreChaseState(JSON.parse(JSON.stringify(s))),s);
 }
 const frozenDistance=s.distance,frozenX=s.x,saved=restoreChaseState(s);let events=[];
 for(let i=0;i<Math.ceil(CHASE_FALL_DURATION*60)+2;i++){const a=stepChase(s,1,1/60,difficulty),b=stepChase(saved,1,1/60,difficulty);assert.deepEqual(a,b);events.push(...a);}
 assert.deepEqual(s,saved);assert.equal(s.stage,'GAME_OVER');assert.equal(s.distance,frozenDistance);assert.equal(s.x,frozenX);assert.equal(s.chestApplied,false);assert.equal(events.filter(e=>e.stage==='GAME_OVER').length,1);
 const terminal=JSON.stringify(s);for(let i=0;i<300;i++)assert.deepEqual(stepChase(s,-1,1/60,difficulty),[]);assert.equal(JSON.stringify(s),terminal);
 const legacy={...createChaseState(),stage:'RUNNING',hits:maximum+2};stepChase(legacy,0,1/60,difficulty);assert.equal(legacy.stage,'FALLING');
 const idle=createChaseState();for(let i=0;i<14000&&idle.stage!=='GAME_OVER';i++)stepChase(idle,0,1/60,difficulty);assert.equal(idle.stage,'GAME_OVER');assert.equal(idle.hits,maximum);
}
assert.throws(()=>restoreChaseState({...createChaseState(),hits:-1}));assert.throws(()=>restoreChaseState({...createChaseState(),hits:.5}));
console.log('APROVADO: três vidas no normal, seis no fácil, contato único por grupo, imunidade, queda/derrota sem captura, movimento congelado, save/RNG e derrota real sem desviar.');
