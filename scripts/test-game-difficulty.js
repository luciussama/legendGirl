import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { platforms, phase3Platforms, createBabyState } from '../src/js/config.js';
import { easyLanding, toyGuideBlend } from '../src/js/state/GameDifficulty.js';
import { createDefaultStateVariables } from '../src/js/state/StateVariables.js';
import { createCampaignProgress, captureState, restoreState, CAMPAIGN_STORAGE_KEY } from '../src/js/state/CampaignProgress.js';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';

const current = fs.readFileSync('src/js/game.js', 'utf8');
const before = execFileSync('git', ['show', 'HEAD:src/js/game.js'], {encoding:'utf8'});
function landing(source) {
  const start = source.indexOf('    const activePlatforms = isPhase3 ? phase3Platforms : platforms;');
  const end = source.indexOf('    if (landedIdx !== -1) {', start);
  assert(start > 0 && end > start);
  return new Function('baby', 'platforms', 'phase3Platforms', 'isPhase3', 'isEscapeMode', 'state', 'easyLanding',
    source.slice(start, end) + '\nreturn landedIdx;');
}
const oldLanding = landing(before), newLanding = landing(current);
let comparisons = 0, assisted = 0;
for (const phase3 of [false, true]) {
  const group = phase3 ? phase3Platforms : platforms;
  for (const p of group) {
    const x = p.standRegion?.x ?? p.x, w = p.standRegion?.w ?? p.w;
    const y = p.surfaceTopY ?? p.standRegion?.y ?? p.y;
    for (const bx of [x-43,x-41,x-38,x-37,x,x+w-1,x+w,x+w+3,x+w+4,x+w+8]) {
      for (const depth of [-1,0,1,16,17,24,25]) for (const vy of [-4,0,4,12]) {
        const baby = {...createBabyState(),x:bx,y:y-createBabyState().h+depth,vy,onGround:false,currentPlatformIndex:0};
        const oldBaby = {...baby}, normalBaby = {...baby}, easyBaby = {...baby};
        const oldResult = oldLanding(oldBaby, platforms, phase3Platforms, phase3, false);
        const normalResult = newLanding(normalBaby, platforms, phase3Platforms, phase3, false, {gameDifficulty:'NORMAL'}, easyLanding);
        assert.equal(normalResult, oldResult, 'NORMAL seleciona exatamente o mesmo apoio da referência');
        assert.deepEqual(normalBaby, oldBaby, 'NORMAL conserva todas as coordenadas e velocidades');
        const easyResult = newLanding(easyBaby, platforms, phase3Platforms, phase3, false, {gameDifficulty:'EASY'}, easyLanding);
        if (easyResult !== -1 && oldResult === -1) assisted++;
        assert.equal(easyBaby.x, baby.x, 'Assistência não desloca horizontalmente a personagem');
        if (vy < 0) assert.equal(easyResult,-1,'Subida não permite pouso');
        comparisons++;
      }
    }
  }
}
assert(assisted > 0, 'FÁCIL recupera erros pequenos que NORMAL rejeita');
assert.equal(toyGuideBlend('NORMAL', 1), 1-Math.pow(0.88,1));
assert(toyGuideBlend('EASY',1)>toyGuideBlend('NORMAL',1));

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

// O salto e a narrativa de produção devem permanecer textualmente iguais à referência.
for (const [start,end] of [
  ['  function doJump(inputSource) {','  // --- SISTEMA DE POEIRA MÁGICA DA FADA ---'],
  ['    baby.x += baby.vx * dt;','    // Rastro de poeira'],
]) {
  const section=s=>s.slice(s.indexOf(start),s.indexOf(end,s.indexOf(start)));
  assert.equal(section(current),section(before),'Salto e integração física preservados');
}
console.log(`APROVADO: ${comparisons} comparações com NORMAL anterior; ${assisted} erros pequenos recuperados; duas fases, save/restore/recarga, legado, guia real e saltos preservados.`);
