import assert from 'node:assert/strict';
import {trainDrive} from '../src/js/toy-room/BattlePresentation.js';
const centers=[{x:697,y:748},{x:1100,y:781}],length=Math.hypot(403,33);
for(let t=0;t<=42;t+=.25) {
 const drive=trainDrive(t),[a,b]=drive.pins;
 assert.ok(Math.abs(Math.hypot(b.x-a.x,b.y-a.y)-length)<1e-8,'A biela não muda de comprimento.');
 drive.pins.forEach((p,i)=>assert.ok(Math.abs(Math.hypot(p.x-centers[i].x,p.y-centers[i].y)-45)<1e-8,'O pino permanece preso ao raio excêntrico.'));
 assert.ok(Math.abs((a.x-centers[0].x)-(b.x-centers[1].x))<1e-8,'Fases horizontais sincronizadas.');
 assert.ok(Math.abs((a.y-centers[0].y)-(b.y-centers[1].y))<1e-8,'Fases verticais sincronizadas.');
}
for(let i=0;i<2;i++)for(const axis of['x','y'])assert.ok(Math.abs(trainDrive(0).pins[i][axis]-trainDrive(42).pins[i][axis])<1e-8,'O ciclo fecha.');
console.log('APROVADO: 169 amostras da transmissão; raio, fase, comprimento da biela e fechamento do ciclo constantes.');
