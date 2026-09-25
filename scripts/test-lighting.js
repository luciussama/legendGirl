import assert from 'node:assert/strict';
import { LightingSystem } from '../src/js/environment/LightingSystem.js';
import { createBabyState, createFairyState } from '../src/js/config.js';

function context() {
  const calls=[], stack=[];
  const ctx={ calls,globalCompositeOperation:'source-over',globalAlpha:1,
    save(){stack.push([this.globalCompositeOperation,this.globalAlpha]);},
    restore(){[this.globalCompositeOperation,this.globalAlpha]=stack.pop();},
    setTransform(...v){calls.push(['transform',...v]);},
    getTransform(){return {a:1.3,b:0,c:0,d:1.3,e:-40,f:73};},
    translate(){},scale(){},clearRect(){calls.push(['clear',this.globalCompositeOperation]);},
    fillRect(){calls.push(['fill',this.globalCompositeOperation,this.fillStyle]);},
    createRadialGradient(...args){assert(args.every(Number.isFinite));return {addColorStop(){}};},
    createLinearGradient(...args){assert(args.every(Number.isFinite));return {addColorStop(){}};},
    beginPath(){},arc(){},fill(){},moveTo(){},lineTo(){},closePath(){},drawImage(){}
  };
  return ctx;
}
const mask=context(),scene=context(),canvas={width:960,height:540};
const lighting=new LightingSystem({darkCanvas:{...canvas,getContext:()=>mask}});
const baby=createBabyState(),fairy=createFairyState();
for(const flags of [{},{isPhase3:true},{plotTwistActive:true},{isStandbyActive:true}]){
  const state={tick:150,...flags}, before=JSON.stringify({state,baby,fairy});
  for(let frame=0;frame<3;frame++){
    mask.calls.length=0;
    lighting.apply(scene,canvas,state,baby,fairy,400,-90);
    const clear=mask.calls.findIndex(c=>c[0]==='clear');
    assert.equal(mask.calls[clear][1],'source-over','Mask must rebuild rather than erase itself');
    assert.equal(mask.calls[clear+1][1],'source-over');
    assert(mask.calls.some(c=>JSON.stringify(c)===JSON.stringify(['transform',1.3,0,0,1.3,-40,73])), 'Light follows exact camera transform');
    assert.equal(scene.globalCompositeOperation,'source-over');
    assert.equal(JSON.stringify({state,baby,fairy}),before,'Lighting cannot mutate gameplay');
  }
}
console.log('PASS: darkness rebuilt every frame; camera alignment and read-only lighting in all phase modes.');
