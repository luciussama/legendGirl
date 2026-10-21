import assert from 'node:assert/strict';
import fs from 'node:fs';
import { platforms, phase3Platforms, createBabyState } from '../../../../src/js/config.js';
import { easyLanding, toyGuideBlend } from '../../../../src/js/state/GameDifficulty.js';
import { createDefaultStateVariables } from '../../../../src/js/state/StateVariables.js';
import { createCampaignProgress, captureState, restoreState, CAMPAIGN_STORAGE_KEY } from '../../../../src/js/state/CampaignProgress.js';
import { ToyRoomPhase } from '../../../../src/js/toy-room/ToyRoomPhase.js';

const values = new Map();
const storage = {getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
const opening = {active:false,completed:true,time:37.5,cues:[]};
for (const difficulty of ['NORMAL','EASY']) for (const phase of ['bedroom','toy-room']) {
  const state = createDefaultStateVariables();
  state.gameDifficulty=difficulty;state.currentPhaseMode=phase;state.gameplayState='GAMEPLAY_NORMAL';
  const room = new ToyRoomPhase({width:960,height:540,getContext:()=>({}),addEventListener(){}},null,null,null,
    {bindInputs:false,gameDifficulty:difficulty});
  const progress=createCampaignProgress(storage);
  progress.write({state:captureState(state),opening,toyRoom:phase==='toy-room'?room.snapshot():null});
  const saved=createCampaignProgress(storage).read();
  assert(saved,'Save válido nas duas fases');
  const restored=createDefaultStateVariables();restoreState(restored,saved.state);
  assert.equal(restored.gameDifficulty,difficulty,'Save, restore e nova instância preservam escolha');
  room.restore(room.snapshot());assert.equal(room.gameDifficulty,difficulty);
  room.toyRoomTutorialCompleted=true;
  const fairyX = room.fairy.x;
  room.update(1);
  assert.equal(room.organizedCount,0,'Guia não organiza brinquedos automaticamente');
  const guide=room.guideToy;
  assert(guide,'Exploração continua com brinquedos disponíveis');
  assert.equal(room.fairy.x,fairyX+(room.fairy.targetX-fairyX)*toyGuideBlend(difficulty,1),'Guia usa a interpolação escolhida');
}
const legacy=JSON.parse(values.get(CAMPAIGN_STORAGE_KEY));delete legacy.state.gameDifficulty;
values.set(CAMPAIGN_STORAGE_KEY,JSON.stringify(legacy));
assert.equal(createCampaignProgress(storage).read().state.gameDifficulty,'NORMAL','Save antigo permanece NORMAL');
legacy.state.gameDifficulty='INVALID';values.set(CAMPAIGN_STORAGE_KEY,JSON.stringify(legacy));
assert.equal(createCampaignProgress(storage).read().state.gameDifficulty,'NORMAL','Valor inválido não ativa ajuda');

console.log('APROVADO: persistência das dificuldades, legado e ajuda na exploração.');
