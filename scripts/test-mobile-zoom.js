import assert from 'node:assert/strict';
import { getMobileZoomFrame, isMobileDevice } from '../src/js/controllers/MobileZoom.js';
for (const userAgent of ['Android','iPhone','iPad']) assert.ok(isMobileDevice({userAgent}), 'Dispositivo móvel reconhecido');
assert.ok(isMobileDevice({platform:'MacIntel',maxTouchPoints:5}), 'iPadOS reconhecido');
assert.equal(isMobileDevice({userAgent:'Desktop',platform:'MacIntel',maxTouchPoints:0}),false,'Desktop preservado');
const scene={enabled:true,width:540,height:960,bounds:{left:60,right:450,top:400,bottom:700},anchor:{x:90,y:690}};
let frame=getMobileZoomFrame(scene);
assert.equal(frame.zoom,1.18,'Ampliação moderada de 18%');
assert.ok(scene.bounds.left*frame.zoom+frame.x>=24,'Personagem dentro da margem');
assert.ok(scene.bounds.right*frame.zoom+frame.x<=516,'Próximo apoio dentro da margem');
frame=getMobileZoomFrame({...scene,bounds:{...scene.bounds,right:520}});
assert.ok(frame.zoom>1&&frame.zoom<1.18,'Zoom reduzido quando necessário à antecipação');
assert.deepEqual(getMobileZoomFrame({...scene,enabled:false}),{zoom:1,x:0,y:0},'Desktop sem transformação');
assert.equal(getMobileZoomFrame({...scene,bounds:{...scene.bounds,right:700}}).zoom,1,'Sem fechar um enquadramento já amplo');


// A região de antecipação muda abruptamente nos pousos; a fase 3 mantém a mesma escala.
const stableReference=getMobileZoomFrame({...scene,stable:true});
for (const right of [450,520,700,1100]) {
  assert.deepEqual(getMobileZoomFrame({...scene,stable:true,bounds:{...scene.bounds,right}}),
    stableReference,'A troca do próximo apoio não altera o enquadramento estável');
  const stable=getMobileZoomFrame({...scene,stable:true,anticipate:true,bounds:{...scene.bounds,right}});
  assert.equal(stable.zoom,0.8,'Campo amplo permanece constante na subida');
  assert.equal(stable.x,172.8,'Antecipação independe da troca de apoio');
}
const edge=getMobileZoomFrame({...scene,stable:true,anticipate:true,anchor:{x:550,y:690}});
assert.ok(550*edge.zoom+edge.x+19*edge.zoom<=scene.width-24,'A personagem permanece inteira na saída do tutorial');
console.log('Zoom móvel: ampliação, estabilidade e antecipação aprovadas.');
