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
const land=new Function('baby','platforms','phase3Platforms','state','easyLanding',section('    const activePlatforms = state.isPhase3 ? phase3Platforms : platforms;','    if (landedIdx !== -1) {')+'return landedIdx;');
const png=PNG.sync.read(fs.readFileSync('assets/art/dark-room/sprites/official-character.png'));
const shoes=OFFICIAL_FRAMES.fall.map(f=>{
 let left=Infinity,right=-Infinity;
 for(let y=f.h-5;y<f.h;y++)for(let x=0;x<f.w;x++)if(png.data[((f.y+y)*png.width+f.x+x)*4+3]>128){left=Math.min(left,x);right=Math.max(right,x+1);}
 const scale=44/50+1/f.h;
 // O retorno espelha a menina para a esquerda, como GameState e o renderer.
 return {left:-(right-f.anchorX)*scale,right:-(left-f.anchorX)*scale};
});
const renderer=new BabyRenderer();
const results=[];let attempts=0;
for(const dt of [0.5,1,1.2])for(let target=0;target<phase3Platforms.length;target++){
 const p=phase3Platforms[target],from=target?phase3Platforms[target-1]:{x:4170,w:470,y:FLOOR_Y};
 const cases=[];let successes=0,verticalSkipped=0;
 // Exige que a saída também seja válida no NORMAL; nada de lançar fora do apoio.
 for(let center=from.x+(target?4.5:19);center<from.x+from.w-(target?4:19);center+=0.5){
  attempts++;
  const baby={...createBabyState(),x:center-19,y:from.y-44,currentPlatformIndex:target-1,facing:-1};
  const state={gameplayState:'GAMEPLAY_NORMAL',gameStarted:true,lastJumpTime:0,isPhase3:true,phase3Level:Math.max(0,target-1),gameDifficulty:'NORMAL'};
  jump(baby,state,getPhase3Stats);
  let rejected=null,hit=-1;
  for(let frame=0;frame<240;frame++){
   const previousFeet=baby.y+baby.h,previousX=baby.x;
   move(baby,dt);const feet=baby.y+baby.h;
   hit=land(baby,platforms,phase3Platforms,state,easyLanding);
   if(baby.vy>=0&&previousFeet<=p.y&&feet>=p.y){
    const fraction=(p.y-previousFeet)/(feet-previousFeet);
    const crossingCenter=previousX+19+(baby.x-previousX)*fraction;
    const nowCenter=baby.x+19,animation=renderer.resolveAnimationState(baby,state),shoe=shoes[animation.frame];
    const overlap=Math.max(0,Math.min(nowCenter+shoe.right,p.x+p.w)-Math.max(nowCenter+shoe.left,p.x));
    if(feet-p.y>16) verticalSkipped++;
    if(hit!==target&&overlap>=2) rejected={launchCenter:center,frame,center:nowCenter,crossingCenter,platform:{x:p.x,right:p.x+p.w,y:p.y},depth:feet-p.y,vy:baby.vy,overlap,shoeLeft:nowCenter+shoe.left,shoeRight:nowCenter+shoe.right,centerInside:nowCenter>=p.x&&nowCenter<=p.x+p.w};
   }
   if(hit>=0||feet>FLOOR_Y+100)break;
  }
  if(hit===target)successes++;
  else if(rejected) cases.push(rejected);
 }
 results.push({dt,target,style:p.style,successes,rejectedWithShoeContact:cases.length,rejectedWithCenterInside:cases.filter(c=>c.centerInside).length,verticalSkipped,example:cases.find(c=>c.centerInside)||cases[0]||null});
}
assert(results.every(r=>r.successes>0),'Todos os saltos precisam continuar possíveis');
assert(results.some(r=>r.rejectedWithCenterInside>0),'Reprodução de centro sobre a superfície rejeitado');
console.log(JSON.stringify({resultado:'diagnóstico reproduzido',attempts,shoes,results},null,2));
