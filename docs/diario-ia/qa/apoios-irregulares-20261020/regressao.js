import assert from 'node:assert/strict';
import {platforms,phase3Platforms,createBabyState} from '../../../../src/js/config.js';
import * as atual from './fisica.js';
process.env.QA_GAME_SOURCE='docs/diario-ia/qa/apoios-irregulares-20261020/game-anterior.txt';
const anterior=await import('./fisica.js?anterior');
delete process.env.QA_GAME_SOURCE;
let comparacoes=0,ampliados=0;
for(const fase3 of [false,true]) for(const modo of ['NORMAL','EASY']) {
 if(fase3&&modo==='NORMAL')continue; // Retorno NORMAL tem regressão própria de contato contínuo.
 const grupo=fase3?phase3Platforms:platforms;
 for(const [i,p] of grupo.entries()) {
  const apoio=p.standRegion||p,topo=p.surfaceTopY??apoio.y;
  const assistido=!fase3&&modo==='NORMAL'&&['messy_blocks','toy_drum','satin_cushion'].includes(p.style);
  for(let centro=apoio.x-25;centro<=apoio.x+apoio.w+25;centro+=2) for(const profundidade of [-1,0,8,16,18,20,21,25]) for(const vy of [-1,0,5]) {
   const menina={...createBabyState(),x:centro-19,y:topo+profundidade-44,vy,onGround:false,currentPlatformIndex:-1};
   const antes=anterior.landingAt({...menina},fase3,modo),depois=atual.landingAt({...menina},fase3,modo);
   if(!assistido) assert.equal(depois,antes,`Colisão preservada: ${modo}, fase3=${fase3}, apoio=${i}`);
   else {
    if(antes===i) assert.equal(depois,i,'Ajuda preserva pousos já aceitos');
    if(antes!==i&&depois===i) ampliados++;
    if(vy<0||profundidade<0||profundidade>20) assert.notEqual(depois,i,'Não aceita subida ou contato fora da tolerância');
   }
   comparacoes++;
  }
 }
}
const trajetorias=[];
for(const dt of [0.5,1,1.5]) for(const modo of ['NORMAL','EASY']) for(const fase3 of [false,true]) {
 if(fase3&&modo==='NORMAL')continue;
 const grupo=fase3?phase3Platforms:platforms;
 for(let alvo=0;alvo<grupo.length;alvo++) {
  const antes=anterior.scan(alvo,fase3,undefined,dt,modo),depois=atual.scan(alvo,fase3,undefined,dt,modo);
  // Novos pousos nos três apoios também ampliam as saídas possíveis destes apoios.
  const afetado=!fase3&&modo==='NORMAL'&&alvo>=4&&alvo<=7;
  if(!afetado) assert.deepEqual(depois,antes,`Trajetória preservada: ${modo}, fase3=${fase3}, alvo=${alvo}, dt=${dt}`);
  else {
   assert.ok(depois.count>=antes.count,'Ajuda não reduz a janela de salto');
   assert.ok(depois.count>0,'Salto assistido permanece viável');
   trajetorias.push({alvo,dt,antes,depois});
  }
 }
}
assert.ok(ampliados>0,'A assistência precisa recuperar pousos antes rejeitados');
for(const alvo of [4,5,6]) assert.ok(trajetorias.some(t=>t.alvo===alvo&&t.depois.count>t.antes.count),'Cada apoio precisa ganhar margem real');
console.log(JSON.stringify({resultado:'aprovado',comparacoes,ampliados,trajetorias},null,2));
