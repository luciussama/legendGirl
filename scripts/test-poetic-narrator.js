import assert from 'node:assert/strict';
import { POETIC_LINES, getPauseNarration, renderPoeticNarration } from '../src/js/narrative/PoeticNarrator.js';
import { OPENING_DIALOGUE } from '../src/js/cinematics/OpeningSequence.js';
import { ToyRoomIntroduction } from '../src/js/cinematics/ToyRoomIntroduction.js';

for (const line of Object.values(POETIC_LINES)) {
  assert(!/ansios|medo|sobrecarreg|previsibilidade|autis|percebeu que|aprendeu que|a lição|o importante|sentia/i.test(line),'Narrador sem explicação ou diagnóstico');
}
for(const state of [{},{cutsceneActive:false},{plotTwistActive:true,plotTwistStep:1},
  {plotTwistActive:true,plotTwistStep:3},{cutsceneActive:true,cutsceneStep:2},
  {isStandbyActive:true,cutsceneActive:true,cutsceneStep:1,cutsceneTimer:0}]) assert.equal(getPauseNarration(state),null,'Sem narrador fora das pausas selecionadas');
assert.equal(getPauseNarration({cutsceneActive:true,cutsceneStep:1,cutsceneTimer:209}),POETIC_LINES.castle);
assert.equal(getPauseNarration({cutsceneActive:true,cutsceneStep:1,cutsceneTimer:210}),null);
assert.equal(getPauseNarration({plotTwistActive:true,plotTwistStep:5,plotTwistTimer:179}),POETIC_LINES.falseDoor);
assert.equal(getPauseNarration({plotTwistActive:true,plotTwistStep:5,plotTwistTimer:180}),null);
const windows=OPENING_DIALOGUE.filter(line=>line[3]==='narrator').map(([from,to,text])=>({text,seconds:to-from}));
windows.push({text:POETIC_LINES.castle,seconds:3.5},{text:POETIC_LINES.falseDoor,seconds:3},
  {text:POETIC_LINES.toyRoomPlay,seconds:3.1},{text:POETIC_LINES.toyRoomPlace,seconds:3.1},
  {text:POETIC_LINES.ending,seconds:6});
for(const {text,seconds} of windows) assert(text.split(/\s+/).length/seconds<=3,'Até três palavras por segundo nas janelas narrativas');
const intro=new ToyRoomIntroduction();intro.time=18.4;const line=intro.dialogue;intro.time=19.2;assert.equal(intro.dialogue,line,'Fala de Nanda estável durante TR_007');
for (const [width,height] of [[960,540],[390,844],[915,412],[320,568]]) {
  const ctx=new Proxy({measureText:text=>({width:text.length*9})},{get:(o,k)=>o[k]||(()=>{})});
  for(const text of Object.values(POETIC_LINES)) {
    const layout=renderPoeticNarration(ctx,{width,height},text);
    assert(layout.x-layout.width/2>=0 && layout.x+layout.width/2<=width,'Legenda dentro da tela');
    assert(layout.y>=0 && layout.y+layout.height<=height,'Legenda sem corte vertical');
  }
}
console.log('APROVADO: vozes, limites de presença, janelas de leitura, troca de falas e quatro tamanhos de tela.');
