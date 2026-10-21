import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {scan,attemptFrom} from './fisica.js';
import {createChaseState,stepChase,restoreChaseState} from '../../../../src/js/bear-chase/ChaseSimulation.js';
import {chasePattern} from '../../../../src/js/bear-chase/ChasePatterns.js';
import {corridors,targetFor} from './corredor.js';
import {arenaDifficulty} from '../../../../src/js/toy-room/ArenaDifficulty.js';
import {ARENA_TUNING} from '../../../../src/js/toy-room/ArenaPlayerController.js';
import {ARENA_ENEMIES} from '../../../../src/js/toy-room/ArenaEnemies.js';
const dir='docs/diario-ia/qa/balanceamento-20261020/';
const data=s=>'data:text/javascript;base64,'+Buffer.from(s).toString('base64');
const absolute=p=>pathToFileURL(process.cwd()+'/'+p).href;
// Executa as fontes anteriores imutáveis, em vez de atualizar os números esperados do EASY.
const oldConfig=data(fs.readFileSync(dir+'config-anterior.txt','utf8'));
let helper=fs.readFileSync(dir+'fisica.js','utf8').replace("'../../../../src/js/config.js'",JSON.stringify(oldConfig)).replace("'../../../../src/js/state/GameDifficulty.js'",JSON.stringify(absolute('src/js/state/GameDifficulty.js'))).replace("fs.readFileSync('src/js/game.js','utf8')",`fs.readFileSync('${dir}game-anterior.txt','utf8')`);
const old=await import(data(helper));let comparisons=0;
for(const p of [false,true])for(const dt of [.5,1,1.2])for(let i=0;i<(p?16:22);i++){
 assert.deepEqual(scan(i,p,undefined,dt,'EASY'),old.scan(i,p,undefined,dt,'EASY'),'EASY preserva janela anterior');
 for(const x of [100,400,900,1408,1800,2300,3500,4300]){assert.deepEqual(attemptFrom(i,p,x,dt,'EASY'),old.attemptFrom(i,p,x,dt,'EASY'));comparisons++;}
}
const oldChase=await import(data(fs.readFileSync(dir+'chase-anterior.txt','utf8').replace(/from '(\.\/[^']+)'/g,(_,p)=>'from '+JSON.stringify(absolute('src/js/bear-chase/'+p.slice(2))))));
const a=createChaseState(),b=oldChase.createChaseState();let ticks=0;
while(a.stage!=='COMPLETE'&&ticks++<12000){const input=Math.max(-1,Math.min(1,(targetFor(a)-a.x)*4));assert.deepEqual(stepChase(a,input,1/60,'EASY'),oldChase.stepChase(b,input,1/60,'EASY'));assert.deepEqual(a,b);}
assert.equal(a.stage,'COMPLETE');assert.equal(a.hits,0);
for(const p of [.699999,.7,.799999,.8,1])for(let lane=0;lane<3;lane++){
 const pattern=chasePattern(p,'NORMAL',lane),free=corridors(pattern.obstacles);
 assert.equal(pattern.obstacles.length,p<.7?2:p<.8?3:4);
 if(p>=.7){assert.equal(free.length,1,'Um corredor sem fuga lateral');assert.ok(Math.abs(free[0][1]-free[0][0]-(p<.8?.63:.33))<1e-8);}
 assert.ok(chasePattern(p,'EASY',lane).obstacles.length<=2);
}
const save=createChaseState();save.obstacles=[{id:1,x:0,z:10,age:0,width:1.15,kind:'blocks',fromX:0,fromZ:15,fitWidth:true}];assert.deepEqual(restoreChaseState(save),save);save.obstacles[0].fitWidth='sim';assert.throws(()=>restoreChaseState(save));
assert.equal(arenaDifficulty('NORMAL').tuning,ARENA_TUNING);assert.equal(arenaDifficulty('NORMAL').enemies,ARENA_ENEMIES);
const easy=arenaDifficulty('EASY');assert.equal(easy.tuning.swordRange,ARENA_TUNING.swordRange*1.3);assert.equal(easy.tuning.swordContactScale,ARENA_TUNING.swordContactScale*1.3);
for(const [name,p]of Object.entries(ARENA_ENEMIES)){const q=easy.enemies[name];assert.equal(q.hp,p.hp);assert.equal(q.speed,p.speed*.8);assert.ok(q.chargeSpeed<p.chargeSpeed&&q.idleTime>p.idleTime&&q.retreatTime>p.retreatTime&&q.recovery>p.recovery);assert.equal(q.pressureChain,false);}
console.log('APROVADO:',JSON.stringify({comparacoesDeTrajetoriasEasy:comparisons,quadrosPerseguicaoEasyIdenticos:ticks,corredorNormal70:.63,corredorNormal80:.33,alcanceEasy:1.3}));
