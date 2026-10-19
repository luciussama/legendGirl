import assert from 'node:assert/strict';
import {ToyRoomPhase} from '../../../src/js/toy-room/ToyRoomPhase.js';
import {getMobileUILayout,arenaMobileControlsLayout} from '../../../src/js/ui/MobileUILayout.js';
let pad=null;
Object.defineProperty(globalThis,'navigator',{configurable:true,value:{userAgent:'QA desktop',getGamepads:()=>pad?[pad]:[]}});
function make(difficulty,actor,side) {
 pad=null;let enabled=true;
 const listeners=new Map();const canvas={width:960,height:540,clientWidth:960,getContext:()=>({}),getBoundingClientRect:()=>({left:0,top:0,width:960,height:540}),addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener(){},setPointerCapture(){},releasePointerCapture(){}};
 const r=new ToyRoomPhase(canvas,null,null,()=>{},{bindInputs:false,gameDifficulty:difficulty,isInputEnabled:()=>enabled});
 r.tutorial.finish();r.story.state.investigationStage='EQUIPPED';r.story.state.swordEquipped=true;
 for(let i=0;i<500&&r.arena.state.status!=='COMBAT';i++)r.update();
 assert.equal(r.arena.state.status,'COMBAT');const b=r.battle;b.state.index=['train','robot','dinosaur','bear'].indexOf(actor);b.spawn();b.state.transition=null;r.player.x=700;b.state.enemy.x=700+side*300;b.state.enemy.state='IDLE';b.state.enemy.elapsed=-10000;
 return {r,b,pause:()=>{enabled=false;},resume:()=>{enabled=true;}};
}
function controls(r,device) {
 const c=arenaMobileControlsLayout(getMobileUILayout(r.canvas));
 const event=(x,y,id=1)=>({clientX:x,clientY:y,pointerId:id,pointerType:'touch',cancelable:true,preventDefault(){},stopPropagation(){}});
 let pressed=false;
 const release=()=>{r.handleKeyUp({code:'ArrowLeft'});r.handleKeyUp({code:'ArrowRight'});r.handleKeyUp({code:'ArrowUp'});r.handleKeyUp({code:'ArrowDown'});r.handleKeyUp({code:'Space'});if(pad)pad.buttons=Array.from({length:16},()=>({pressed:false,value:0}));r.onPointerUp({});pressed=false;};
 const move=(x,y=0)=>{
  release();
  if(device==='teclado'){if(x)r.handleKeyDown({code:x>0?'ArrowRight':'ArrowLeft'});if(y)r.handleKeyDown({code:y<0?'ArrowUp':'ArrowDown'});}
  else if(device==='gamepad') {pad={index:0,connected:true,mapping:'standard',axes:[0,0],buttons:Array.from({length:16},()=>({pressed:false,value:0}))};for(const i of [x>0?15:x<0?14:null,y<0?0:y>0?13:null].filter(i=>i!==null))pad.buttons[i]={pressed:true,value:1};}
  else {r.onPointerDown(event(c.dpad.x+x*50*c.unit,c.dpad.y+y*50*c.unit));pressed=true;}
 };
 const attack=()=>{if(device==='teclado')r.handleKeyDown({code:'Space',repeat:false});else if(device==='gamepad'){pad??={index:0,connected:true,mapping:'standard',axes:[0,0],buttons:[]};pad.buttons[2]={pressed:true,value:1};r.pollGamepad();}else r.onPointerDown(event(c.sword.x,c.sword.y,2));};
 return {move,release,attack,drag:(x,y)=>{assert.ok(pressed);r.onPointerMove(event(c.dpad.x+x*50*c.unit,c.dpad.y+y*50*c.unit));}};
}
let scenarios=0;
for(const difficulty of ['NORMAL','EASY'])for(const device of ['teclado','gamepad','toque'])for(const actor of ['train','robot','dinosaur','bear'])for(const side of [-1,1]) {
 const {r,b,pause,resume}=make(difficulty,actor,side),input=controls(r,device);
 input.move(-side);r.update();assert.equal(b.state.guarding,true,`${device}/${actor}: recuar defende`);assert.equal(r.player.facing,side>0?'right':'left');
 const saved=r.snapshot();input.release();r.restore(saved);r.update();assert.equal(b.state.guarding,false,'Restore sem entrada não mantém proteção');assert.equal(r.gameDifficulty,difficulty);
 const x=r.player.x;input.move(side,-1);r.update();assert.ok(b.state.jump>0&&side*(r.player.x-x)>0,'Diagonal combina salto e avanço');assert.equal(b.state.guarding,false,'Sem defesa aérea');
 input.attack();assert.ok(b.state.cooldown>0,'Espada funciona com direcional/salto');
 input.release();for(let i=0;i<100;i++)r.update();assert.equal(b.state.jump,0,'Salto volta ao chão');
 input.move(0,1);r.update();assert.equal(b.state.crouching,true,'Agachar funciona em todas as entradas');input.release();r.update();assert.equal(b.state.crouching,false);
 if(device==='toque'){input.move(-side);input.drag(side,-1);r.update();assert.ok(b.state.jump>0,'Arraste do mesmo polegar muda de defesa para salto diagonal');r.onPointerUp({pointerId:1,type:'pointercancel'});assert.ok(!Object.values(r.arenaTouchButtons).some(Boolean),'Cancelamento libera diagonal');}
 input.release();r.update();pause();const before=JSON.stringify(r.snapshot());r.handleKeyDown({code:'Space'});r.update();assert.equal(JSON.stringify(r.snapshot()),before,'Pausa não avança simulação nem aceita golpe');resume();
 input.move(-side);r.update();r.clearInput();input.release();r.update();assert.equal(b.state.guarding,false,'Perda de foco libera defesa');assert.equal(r.player.isMoving,false);
 if(device==='gamepad'){input.move(side);r.update();pad=null;r.update();assert.equal(r.gamepadState.active,false,'Desconexão libera movimento');assert.equal(r.player.isMoving,false);}
 r.destroy();scenarios++;
}
console.log(`APROVADO: ${scenarios} combinações de dificuldade, entrada, inimigo e lado; defesa, salto diagonal, espada simultânea, agachamento, restauração, pausa, foco e desconexão.`);
