/** Regressões das derrotas, migração e retomada local, executadas temporariamente pelo diário. */
import assert from 'node:assert/strict';
import { recordCampaignDefeat, clearCampaignDefeat } from '../../../../src/js/state/CampaignDefeats.js';
import { createDefaultStateVariables } from '../../../../src/js/state/StateVariables.js';
import { captureState, createCampaignProgress } from '../../../../src/js/state/CampaignProgress.js';
import { BearChasePhase } from '../../../../src/js/bear-chase/BearChasePhase.js';
import { createChaseState, stepChase } from '../../../../src/js/bear-chase/ChaseSimulation.js';
import { ToyRoomPhase } from '../../../../src/js/toy-room/ToyRoomPhase.js';
import { renderChaseHUD } from '../../../../src/js/bear-chase/ChaseHUD.js';
const state = createDefaultStateVariables();
for (let i = 1; i <= 6; i++) {
 assert.equal(recordCampaignDefeat(state),true);
 assert.equal(state.defeatCount,i);
 assert.equal(state.easyOfferPending,i % 3 === 0);
 assert.equal(recordCampaignDefeat(state),false,'Mesmo fim de tentativa não conta por quadro');
 state.easyOfferPending = false;
 assert.equal(recordCampaignDefeat(state),false,'Recusar não conta a derrota outra vez');
 clearCampaignDefeat(state);
}
state.gameDifficulty='EASY';
for(let i=0;i<6;i++){recordCampaignDefeat(state);assert.equal(state.easyOfferPending,false);clearCampaignDefeat(state);}
const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
const progress=createCampaignProgress(storage);
const saved={state:captureState(createDefaultStateVariables()),opening:{active:false,completed:true,time:0,cues:[]},platforms:[],toyRoom:null};
for(const key of ['defeatCount','defeatPending','easyOfferPending'])delete saved.state[key];
progress.write(saved);
assert.equal(progress.read().state.defeatCount,0,'Save antigo permanece válido');
const pending=progress.read();Object.assign(pending.state,{defeatCount:3,defeatPending:true,easyOfferPending:true});progress.write(pending);
const restored=progress.read().state;recordCampaignDefeat(restored);assert.equal(restored.defeatCount,3);assert.equal(restored.easyOfferPending,true);
for(const count of [-1,1.5,NaN,'3']) {progress.write({...pending,state:{...pending.state,defeatCount:count}});assert.equal(progress.read(),null,'Contagem inválida rejeitada');}
const chase=Object.create(BearChasePhase.prototype);
Object.assign(chase,{state:createChaseState(),difficulty:'EASY',input:{clear(){}},audio:{setPaused(){},unlock(){},restore(s){this.saved=s;}}});
Object.assign(chase.state,{stage:'GAME_OVER',distance:400,x:-1.2,hits:3,time:42,seed:990});
const reached=structuredClone(chase.state);
assert.equal(chase.retry({resume:true}),true);assert.equal(chase.state.distance,reached.distance);assert.equal(chase.state.x,reached.x);assert.equal(chase.state.seed,reached.seed);assert.equal(chase.state.hits,0);assert.equal(chase.state.stage,'RUNNING');
stepChase(chase.state,0,1/60,'EASY');assert.equal(chase.state.stage,'RUNNING');
chase.state.stage='GAME_OVER';assert.equal(chase.retry(),true);assert.equal(chase.state.stage,'BEAR_DOWN');assert.equal(chase.state.distance,0);assert.equal(chase.state.hits,0);assert.equal(chase.retry(),false);
const room=Object.create(ToyRoomPhase.prototype);
Object.assign(room,{gameDifficulty:'NORMAL',chase:null,clearInput(){},story:{state:{attackElapsed:7}},battle:{state:{mode:'DEFEAT',index:3,player:{hp:0,maxHp:3},enemy:{actor:'bear',hp:5},history:[{event:'ENEMY_HIT'}]},tuning:{immunity:48}},arena:{active:true,state:{},configurePresentation(){this.configured=true;}}});
room.setDifficulty('EASY');assert.equal(room.arena.configured,true);
assert.equal(room.retryDefeat({resume:true}),true);assert.equal(room.battle.state.index,3);assert.equal(room.battle.state.enemy.hp,5);assert.equal(room.battle.state.player.hp,3);assert.equal(room.battle.state.history.length,1);
let reports=0;room.updateActiveMode=()=>{};room.onDefeat=()=>reports++;room.battle.state.mode='DEFEAT';
room.update(1);room.update(1);assert.equal(reports,1);room.retryDefeat({resume:true});room.battle.state.mode='DEFEAT';room.update(1);assert.equal(reports,2);
room.chase={active:true,state:{stage:'FALLING'}};room.battle.state=null;room.update(1);assert.equal(reports,2,'Queda ainda não é nova derrota');room.chase.state.stage='GAME_OVER';room.update(1);room.update(1);assert.equal(reports,3);
const messages=[];const ctx=new Proxy({fillText:t=>messages.push(t)},{get:(o,k)=>k in o?o[k]:()=>{}});
renderChaseHUD(ctx,{width:960,height:540},{stage:'GAME_OVER',hits:3},null,null,'NORMAL');assert.ok(messages.includes('A menina não alcançou o urso. Tentar novamente?'));
console.log('Derrotas: contagem única, oferta a cada três, recusa/EASY, saves antigos e pendentes, retomadas de arena/fuga e mensagem exata aprovados.');
