import fs from 'node:fs';
import {platforms,phase3Platforms,createBabyState,getEscapeStats,getPhase3Stats,getApproachJumpSpeed,FLOOR_Y} from '../../../src/js/config.js';
import {easyLanding} from '../../../src/js/state/GameDifficulty.js';
const source=fs.readFileSync('src/js/game.js','utf8');
const section=(start,end)=>{const a=source.indexOf(start),b=source.indexOf(end,a+start.length);if(a<0||b<a)throw Error('Trecho de física ausente');return source.slice(a,b);};
const jump=new Function('baby','platforms','state','getEscapeStats','getPhase3Stats','getApproachJumpSpeed',`
 const opening={active:false},isPaused=false;const audio={initAudio(){},playJumpSound(){},playLongJumpSound(){}};
 const fairy={x:0,y:0,vy:0};const performance={now:()=>1000};function spawnBabyJumpPuff(){}function spawnFairySparkles(){}
 ${section('  function doJump(inputSource) {','  // --- SISTEMA DE POEIRA MÁGICA DA FADA ---')}
 doJump('keyboard');`);
const move=new Function('baby','dt',section('    baby.x += baby.vx * dt;','    // Rastro de poeira'));
const land=new Function('baby','platforms','phase3Platforms','state','easyLanding',section('    const activePlatforms = state.isPhase3 ? phase3Platforms : platforms;','    if (landedIdx !== -1) {')+'return landedIdx;');
const surface=p=>({x:p.standRegion?.x??p.x,w:p.standRegion?.w??p.w,y:p.surfaceTopY??p.standRegion?.y??p.y});
function stateFor(target,phase3,difficulty='NORMAL'){return {gameplayState:'GAMEPLAY_NORMAL',gameStarted:true,lastJumpTime:0,isPhase3:phase3,isEscapeMode:!phase3&&target>=10,escapeLevel:Math.max(0,target-10),phase3Level:Math.max(0,target-1),gameDifficulty:difficulty};}
export function scan(target,phase3,speed,dt=1,difficulty='NORMAL') {
 const group=phase3?phase3Platforms:platforms;
 const from=target?surface(group[target-1]):phase3?{x:4170,w:470,y:FLOOR_Y}:{x:60,w:160,y:FLOOR_Y};
 const run=phase3?Math.abs(getPhase3Stats(Math.max(0,target-1)).runVx):target>=11?getEscapeStats(target-10).runVx:1.42;
 const hits=[];
 for(let x=Math.ceil(from.x-(target?37:0));x<from.x+from.w;x++) {
  const b={...createBabyState(),x,y:from.y-44,currentPlatformIndex:target-1,longJumpUnlocked:!phase3&&target>=10,isEscaping:!phase3&&target>=10};
  const s=stateFor(target,phase3,difficulty);jump(b,platforms,s,getEscapeStats,getPhase3Stats,getApproachJumpSpeed);if(speed!==undefined)b.vx=(phase3?-1:1)*speed;
  for(let i=0;i<240;i++){move(b,dt);const hit=land(b,platforms,phase3Platforms,s,easyLanding);if(hit>=0){if(hit===target)hits.push(x);break;}if(b.y>FLOOR_Y+100)break;}
 }
 return {count:hits.length,ms:hits.length/run*1000/60,first:hits[0],last:hits.at(-1)};
}

/** Executa uma tentativa a partir de uma posição concreta, sem busca pelo melhor quadro. */
export function attemptFrom(target,phase3,x,dt=1,difficulty='NORMAL',speed) {
 const group=phase3?phase3Platforms:platforms,from=target?surface(group[target-1]):{x:60,w:160,y:FLOOR_Y};
 const baby={...createBabyState(),x,y:from.y-44,currentPlatformIndex:target-1,longJumpUnlocked:!phase3&&target>=10,isEscaping:!phase3&&target>=10};
 const state=stateFor(target,phase3,difficulty);jump(baby,platforms,state,getEscapeStats,getPhase3Stats,getApproachJumpSpeed);if(speed!==undefined)baby.vx=(phase3?-1:1)*speed;
 const airVx=baby.vx;let landed=-1,frames=0;
 for(;frames<240;frames++){move(baby,dt);landed=land(baby,platforms,phase3Platforms,state,easyLanding);if(landed>=0||baby.y>FLOOR_Y+100)break;}
 return {landed,frames,airVx,x:baby.x,y:baby.y,feetX:baby.x+baby.w/2};
}
