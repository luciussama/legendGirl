import assert from 'node:assert/strict';
import { CameraController } from '../src/js/controllers/CameraController.js';
import { createDefaultStateVariables } from '../src/js/state/StateVariables.js';
import { platforms, getEscapeStats, exitDoor } from '../src/js/config.js';
const last=platforms.length-1;
for(const dt of [0.5,1,1.2]) for(const width of [540,960]) {
  const state=createDefaultStateVariables(),stats=getEscapeStats(11);
  Object.assign(state,{isEscapeMode:true,isStandbyActive:false,currentScrollSpeed:stats.scrollSpeed,targetScrollSpeed:stats.scrollSpeed});
  Object.assign(state.baby,{x:4612.708,y:104,currentPlatformIndex:last,onGround:true,vx:stats.runVx,vy:0});
  const camera=new CameraController({x:4608});
  let failed=false;
  for(let i=0;i<160&&state.baby.x<exitDoor.x-10;i++){
    state.baby.x+=stats.runVx*dt;
    const before={...state.baby};
    camera.update(dt,state,{width,height:960},{escapeEndPlatformIndex:last,onLagBehind(){failed=true;}});
    assert.deepEqual(state.baby,before,'A correção da câmera não modifica a personagem');
  }
  assert.ok(state.baby.x>=exitDoor.x-10&&!failed,'Pouso final permite chegar ao gatilho da porta');
  state.baby.currentPlatformIndex=last-1;
  camera.x=state.baby.x+30;
  camera.update(dt,state,{width,height:960},{escapeEndPlatformIndex:last,onLagBehind(){failed=true;}});
  assert.ok(failed,'Penalidade de atraso preservada antes do pedestal final');
}
console.log('Pedestal final: aproximação da porta aprovada; física e pressão dos trechos anteriores preservadas.');
