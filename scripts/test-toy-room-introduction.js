import assert from 'node:assert/strict';
import { ToyRoomIntroduction, TOY_ROOM_INTRO_STAGES } from '../src/js/cinematics/ToyRoomIntroduction.js';
import { POETIC_LINES } from '../src/js/narrative/PoeticNarrator.js';
const events=[];let completions=0;
const intro=new ToyRoomIntroduction({onEvent:e=>events.push(e),onComplete:()=>completions++});
assert.equal(intro.active,false);
assert.equal(intro.start(),true);assert.equal(intro.start(),false);
assert.deepEqual(events,['PHASE1_COMPLETE']);
for(const stage of TOY_ROOM_INTRO_STAGES){assert.equal(intro.stage.id,stage.id);intro.update(stage.duration*60+0.0001)}
assert.equal(intro.active,false);assert.equal(completions,1);
intro.update(10000);assert.equal(completions,1);assert.deepEqual(events,['PHASE1_COMPLETE','TOY_ROOM_START']);
intro.start();intro.cancel();intro.update(10000);assert.equal(completions,1);
const reflectionStart=TOY_ROOM_INTRO_STAGES.slice(0,4).reduce((sum,s)=>sum+s.duration,0);
intro.time=reflectionStart+3.09;assert.equal(intro.dialogue,POETIC_LINES.toyRoomPlay);
intro.time=reflectionStart+3.11;assert.equal(intro.dialogue,'');
intro.time=reflectionStart+3.89;assert.equal(intro.dialogue,'');
intro.time=reflectionStart+3.91;assert.equal(intro.dialogue,POETIC_LINES.toyRoomPlace);
intro.time=reflectionStart+6.99;assert.equal(intro.dialogue,POETIC_LINES.toyRoomPlace);
intro.time=23.299;
for(const canvas of [{width:960,height:540},{width:390,height:844},{width:915,height:412}]){
  const frame=intro.cameraFrame(canvas);
  assert(frame.zoom*1600<=canvas.width && frame.zoom*1200<=canvas.height,'Sala inteira cabe no enquadramento final');
}
console.log('Aprovado: sequência, disparo único, conclusão única e cancelamento sem estado preso.');
