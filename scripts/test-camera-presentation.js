import assert from 'node:assert/strict';
import { CameraPresentation } from '../src/js/controllers/CameraPresentation.js';
const view=new CameraPresentation();
const scene={x:500,y:-120,playerX:900,groundLead:380,targetY:0,onGround:true,active:true,narrative:false,
 width:960,height:540,cssWidth:960,cssHeight:540,zoom:1};
let previous=view.frame({...scene,tick:0}),settled=null;
for(let tick=1;tick<=60;tick++){
 const y=view.frame({...scene,playerX:900+tick*2,x:500+tick*2,tick});
 assert.ok(Math.abs(y.y-previous.y)<=540*.05,'Sem salto vertical acima de 5%');
 assert.ok(Math.abs(y.x-previous.x)<=960*.05,'Sem salto horizontal acima de 5%');
 if(settled===null&&Math.abs(y.y)<=.5&&Math.abs((900+tick*2-y.x)-380)<=.5)settled=tick;
 previous=y;
}
assert.ok(settled*1000/60<=300,'Recuperação do pouso em até 300 ms');
assert.equal(previous.y,0,'A interpolação vertical encerra as microcorreções');
assert.equal(1020-previous.x,380,'A interpolação horizontal encerra as microcorreções');
const saved=view.snapshot();assert.deepEqual(view.frame({...scene,tick:60}),previous,'Pausa não avança a apresentação');
view.reset();view.restore(saved);assert.deepEqual(view.snapshot(),saved,'Checkpoint conserva o histórico visual');
const narrative = view.frame({...scene,x:450,y:-90,tick:61,narrative:true});
assert.ok(Math.abs(narrative.x-previous.x)<=960*.03,'Reposicionamento narrativo suavizado');
for(let tick=62;tick<=120;tick++)view.frame({...scene,x:450,y:-90,tick,narrative:true});
assert.deepEqual(view.frame({...scene,x:450,y:-90,tick:121,narrative:true}),{x:450,y:-90},'Enquadramento narrativo converge');
console.log('Apresentação da câmera: limites, estabilização, pausa e checkpoint aprovados.');

const transition=new CameraPresentation();
transition.mobileFrame({target:{zoom:1.18,x:-60,y:0},enabled:true,stable:false,anticipate:false,tick:0,width:540,height:960});
let previousZoom=1.18;
for(let tick=1;tick<=120;tick++){
  const frame=transition.mobileFrame({target:{zoom:.8,x:54,y:96},enabled:true,stable:true,anticipate:false,tick,width:540,height:960});
  assert.ok(Math.abs(frame.zoom/previousZoom-1)<=.02,'Entrada do enquadramento sem salto de zoom');
  previousZoom=frame.zoom;
}
assert.equal(previousZoom,.8,'A entrada converge à escala estável');
