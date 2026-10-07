import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';
import { roomEnvironmentRenderer } from '../src/js/toy-room/RoomEnvironmentRenderer.js';

const directory='docs/qa/toy-room-identificacao';
// O import antigo da placa é retirado apenas para instanciar a referência histórica;
// a renderização antiga não participa desta comparação das mecânicas.
const source=(await fs.readFile(`${directory}/ToyRoomPhase-antes.txt`,'utf8'))
  .replace('nearestToyGuide, renderChestLabel','nearestToyGuide')
  .replaceAll("'../",`'${new URL('../src/js/',import.meta.url).href}`)
  .replaceAll("'./",`'${new URL('../src/js/toy-room/',import.meta.url).href}`);
const {ToyRoomPhase:Before}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const canvas={width:960,height:540,getContext:()=>({}),addEventListener(){}};
const before=new Before(canvas,null,null,null,{bindInputs:false});
const after=new ToyRoomPhase(canvas,null,null,null,{bindInputs:false});
const methods=['triggerAction','resolveCollisions','update','snapshot','restore','startTutorial'];
for(const method of methods) assert.equal(Before.prototype[method].toString(),ToyRoomPhase.prototype[method].toString(),`${method} preservado`);
assert.deepEqual(before.furniture,after.furniture,'Geometria e posição dos móveis preservadas');
assert.deepEqual(before.toys,after.toys,'Brinquedos preservados');
assert.deepEqual(before.snapshot(),after.snapshot(),'Save inicial preservado');
const atlas=await fs.readFile('assets/art/toy-room/environment-sheet.png');
const reference=JSON.parse(await fs.readFile(`${directory}/navegador.json`,'utf8'));
assert.equal(createHash('sha256').update(atlas).digest('hex'),reference.atlasSHA256,'Atlas do restante da sala preservado');
const sprite=PNG.sync.read(await fs.readFile('assets/art/toy-room/chest-brinquedos-v1.png'));
assert.equal(sprite.data[3],0,'Sprite sem fundo opaco');
const texts=[], ctx=new Proxy({fillText:text=>texts.push(text)}, {get:(target,key)=>target[key]||(()=>{})});
roomEnvironmentRenderer.renderFurniture(ctx,after.furniture[0],{});
assert.deepEqual(texts,['BRINQUEDOS'],'Fallback mantém apenas a inscrição no móvel');
const phaseSource=await fs.readFile('src/js/toy-room/ToyRoomPhase.js','utf8');
const orientation=await fs.readFile('src/js/toy-room/ToyRoomOrientation.js','utf8');
assert(!phaseSource.includes('renderChestLabel')&&!orientation.includes('renderChestLabel'),'Marcador removido');
await fs.writeFile(`${directory}/escopo.json`,JSON.stringify({metodosIdenticos:methods,moveisIdenticos:true,
  brinquedosIdenticos:true,snapshotInicialIdentico:true,atlasPreservado:true,marcadorRemovido:true,
  fallbackIntegrado:true,spriteTransparente:true},null,2)+'\n');
console.log('APROVADO: mecânicas, save, tutorial, posições e atlas preservados; marcador removido e fallback integrado.');
