// Diagnóstico do retorno: executa impulso, movimento e pouso extraídos da produção.
// As posições iniciais são preparadas; não representa uma partida humana contínua.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {PNG} from 'pngjs';
import {phase3Platforms,platforms,createBabyState,getEscapeStats,getPhase3Stats,getApproachJumpSpeed,FLOOR_Y} from '../../../../src/js/config.js';
import {OFFICIAL_FRAMES} from '../../../../src/js/assets/officialCharacter.js';
import {BabyRenderer} from '../../../../src/js/entities/BabyRenderer.js';
import {easyLanding} from '../../../../src/js/state/GameDifficulty.js';
const source=fs.readFileSync('src/js/game.js','utf8');
const section=(start,end)=>{const a=source.indexOf(start),b=source.indexOf(end,a+start.length);assert(a>=0&&b>a,'Trecho real de produção ausente');return source.slice(a,b);};
const jump=new Function('baby','state','getPhase3Stats',`
 const platforms=[],opening={active:false},isPaused=false,audio={initAudio(){},playLongJumpSound(){}},fairy={vy:0},performance={now:()=>1000};
 function spawnBabyJumpPuff(){} function spawnFairySparkles(){}
 ${section('  function doJump(inputSource) {','  // --- SISTEMA DE POEIRA MÁGICA DA FADA ---')}
 doJump('keyboard');`);
const move=new Function('baby','dt',section('    baby.x += baby.vx * dt;','    // Rastro de poeira'));
const land=new Function('baby','platforms','phase3Platforms','state','easyLanding','dt = 1',section('    const activePlatforms = state.isPhase3 ? phase3Platforms : platforms;','    if (landedIdx !== -1) {')+'return landedIdx;');
const oldSource=fs.readFileSync('docs/diario-ia/qa/pousos-retorno-20261021/game-antes-correcao.txt','utf8');
const a=oldSource.indexOf('    const activePlatforms = state.isPhase3 ? phase3Platforms : platforms;'),b=oldSource.indexOf('    if (landedIdx !== -1) {',a);
const oldLand=new Function('baby','platforms','phase3Platforms','state','easyLanding','dt',oldSource.slice(a,b)+'return landedIdx;');
const s={isPhase3:true,gameDifficulty:'NORMAL',isEscapeMode:false};
const synthetic={x:100,w:60,y:200};
const contact=(center,feet,vy,vx=0,onGround=false,dt=1)=>land({...createBabyState(),x:center-19,y:feet-44,vy,vx,onGround},[],[synthetic],s,easyLanding,dt);
assert.equal(contact(101,201,4),0,'Borda com apoio dos pés aceita');
assert.equal(contact(99,201,4),0,'Centro fora, sapatos sobre o topo aceitos');
assert.equal(contact(90,202,4),0,'Faixa dos pés tem apoio suficiente');
assert.equal(contact(86,202,4),-1,'Contato menor que 2 px rejeitado');
assert.equal(contact(130,198,-4),-1,'Subida rejeitada');
assert.equal(contact(130,205,4),-1,'Entrada por baixo rejeitada');
assert.equal(contact(160,211,4,-20),-1,'Entrada lateral já abaixo do topo rejeitada');
assert.equal(contact(130,240,50),0,'Cruzamento em passo longo não atravessa o topo');
assert.equal(contact(150,204,4,-40),-1,'Sobreposição apenas após cruzar o topo não captura a lateral');
assert.equal(contact(80,200.28,.28,-3,true),-1,'Caminhada para fora do apoio não gera chão extra');
assert.equal(contact(130,200.28,.28,-3,true),0,'Menina apoiada conserva contato');

let attempts=0,recovered=0,expectedContacts=0,preservedEasy=0;
const rows=[];
for(const dt of [.5,1,1.2])for(let target=0;target<phase3Platforms.length;target++){
 const p=phase3Platforms[target],from=target?phase3Platforms[target-1]:{x:4170,w:470,y:FLOOR_Y};
 let viable=0,recoveredHere=0;
 for(let center=from.x+(target?4.5:19);center<from.x+from.w-(target?4:19);center+=.5){
  attempts++;
  const baby={...createBabyState(),x:center-19,y:from.y-44,currentPlatformIndex:target-1,facing:-1};
  const state={...s,gameplayState:'GAMEPLAY_NORMAL',gameStarted:true,lastJumpTime:0,phase3Level:Math.max(0,target-1)};
  jump(baby,state,getPhase3Stats);
  let hit=-1,oldHit=-1;
  const legacy={...baby};
  for(let frame=0;frame<240;frame++){
   const prevY=baby.y+baby.h,prevX=baby.x;
   move(baby,dt);
   hit=land(baby,platforms,phase3Platforms,state,easyLanding,dt);
   if(baby.vy>=0&&prevY<=p.y&&baby.y+baby.h>=p.y){
    const fraction=(p.y-prevY)/(baby.y+baby.h-prevY),x=prevX+19+(baby.x-prevX)*fraction;
    if(Math.min(x+15,p.x+p.w)-Math.max(x-15,p.x)>=2){
     assert.equal(hit,target,'Contato descendente com apoio real não pode ser perdido');expectedContacts++;
    }
   }
   // EASY conserva exatamente a decisão antiga para o mesmo corpo/quadro.
   const easyState={...state,gameDifficulty:'EASY'};
   assert.equal(land({...baby},platforms,phase3Platforms,easyState,easyLanding,dt),oldLand({...baby},platforms,phase3Platforms,easyState,easyLanding,dt));preservedEasy++;
   if(hit>=0||baby.y+baby.h>FLOOR_Y+100)break;
  }
  for(let frame=0;frame<240;frame++){move(legacy,dt);oldHit=oldLand(legacy,platforms,phase3Platforms,state,easyLanding,dt);if(oldHit>=0||legacy.y+legacy.h>FLOOR_Y+100)break;}
  if(hit===target){viable++;if(oldHit!==target){recovered++;recoveredHere++;}}
  if(dt===1&&target===0&&center===4217.5){assert.notEqual(oldHit,target,'Reproduz caso concreto antigo');assert.equal(hit,target,'Corrige caso concreto da primeira pilha');}
  if(dt===1&&target===1&&center===4076){assert.notEqual(oldHit,target);assert.equal(hit,target,'Corrige caso concreto da boneca');}
 }
 assert.ok(viable>0&&recoveredHere>0,'Cada apoio precisa de trajetórias viáveis e correções reais');
 rows.push({dt,target,viable,recovered:recoveredHere});
}
console.log(JSON.stringify({resultado:'aprovado',attempts,recovered,expectedContacts,preservedEasy,rows},null,2));
