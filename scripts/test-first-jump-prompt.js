import assert from 'node:assert/strict';
import { getFirstJumpFeedback, getFirstJumpTutorialDevice, FIRST_JUMP_MESSAGES, renderFirstJumpTutorial } from '../src/js/ui/FirstJumpTutorial.js';
const noPad={getGamepads:()=>[],userAgent:''},xbox={getGamepads:()=>[{connected:true,id:'Xbox Controller'}],userAgent:''};
for(const [input,expected] of [[{nav:noPad,coarse:true},'touch'],[{nav:noPad,coarse:false},'keyboard'],[{nav:xbox},'gamepad'],[{nav:xbox,device:'mouse'},'mouse'],[{nav:xbox,device:'keyboard'},'keyboard'],[{nav:noPad,device:'gamepad',coarse:false},'keyboard']]){
 assert.equal(getFirstJumpTutorialDevice(input),expected,'Detecção específica da entrada');
}
assert.equal(FIRST_JUMP_MESSAGES.touch,'TOQUE NA TELA PARA PULAR');
assert.equal(FIRST_JUMP_MESSAGES.keyboard,'PRESSIONE ESPAÇO');assert.equal(FIRST_JUMP_MESSAGES.mouse,'CLIQUE COM O MOUSE');assert.equal(FIRST_JUMP_MESSAGES.gamepad,'PRESSIONE A');
const ctx=new Proxy({measureText:text=>({width:text.length*9})},{get:(o,k)=>o[k]??(()=>{})});
for(const width of [540,960]){
 const canvas={width,height:width===540?1169:540};
 const baby={x:60,y:426,w:38,h:44},state={gameplayState:'FIRST_JUMP_TUTORIAL'},platform={x:220,y:410,w:120};
 const before=JSON.stringify({baby,state,platform});
 const layout=renderFirstJumpTutorial(ctx,canvas,{baby,state,platform,cameraX:0,transform:{a:1,b:0,c:0,d:1,e:0,f:0},device:'mouse'});
 assert.equal(layout.text,'CLIQUE COM O MOUSE');assert.ok(layout.box.y+layout.box.height<baby.y,'Painel não cobre a menina');
 assert.ok(layout.box.y+layout.box.height<platform.y,'Painel não cobre o destino');assert.equal(layout.target.x,280,'Seta aponta ao centro do primeiro apoio');
 assert.equal(JSON.stringify({baby,state,platform}),before,'Prompt não altera gameplay');
}
assert.equal(renderFirstJumpTutorial(ctx,{width:960,height:540},{state:{gameplayState:'GAMEPLAY_NORMAL'}}),null,'Prompt exclusivo do tutorial');
console.log('APROVADO: mensagens de touch/teclado/mouse/Xbox, troca e desconexão, ancoragem e estado preservado.');

const high=getFirstJumpFeedback(400),low=getFirstJumpFeedback(1200);
assert.ok(high.scale>1&&low.scale<1,'Escala pulsa sem depender do tick');
assert.ok(high.glow>low.glow&&high.bob!==low.bob,'Brilho e seta têm pulsação suave');
assert.deepEqual(getFirstJumpFeedback(400,true),getFirstJumpFeedback(1200,true),'Movimento reduzido mantém apresentação estável');
console.log('APROVADO: relógio visual independente, escala/brilho/seta pulsantes e preferência por movimento reduzido.');
