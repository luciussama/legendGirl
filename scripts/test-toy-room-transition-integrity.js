import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createAudioSystem } from '../src/js/audio.js';

const directory='docs/qa/toy-room-transicao';
const before=await fs.readFile('tests/fixtures/toy-room-transicao/ToyRoomPhase-antes.txt','utf8');
const after=await fs.readFile('src/js/toy-room/ToyRoomPhase.js','utf8');
await fs.mkdir(directory,{recursive:true});
function method(source,name){
  const start=source.indexOf(`\n  ${name}(`);
  assert(start>=0,name);
  const rest=source.slice(start+1), next=rest.slice(1).search(/\n  [a-zA-Z]+\(/);
  return next<0?rest:rest.slice(0,next+1);
}
const unchanged=['resolveCollisions'];
for(const name of unchanged)assert.equal(method(after,name),method(before,name),`${name} preservado`);

globalThis.Audio=class {
  constructor(src){this.src=src;this.paused=true;this.volume=1;this.currentTime=0;this.loadCount=0;}
  addEventListener(){}
  play(){this.paused=false;return Promise.resolve();}
  pause(){this.paused=true;}
  load(){this.loadCount++;}
};
const audio=createAudioSystem();
audio.setMasterVolume(0.4);audio.startToyRoomMusic({fade:0});
const element=audio.getToyRoomAudioElement();assert.equal(element.volume,0);
audio.setToyRoomMusicFade(0.5);assert(Math.abs(element.volume-0.116)<1e-9);
audio.setMuted(true);assert.equal(element.volume,0);
audio.setToyRoomMusicFade(1);assert.equal(element.volume,0);
audio.setMuted(false);assert(Math.abs(element.volume-0.232)<1e-9);
audio.pauseMusic();assert.equal(element.paused,true);
audio.resumeMusic();assert.equal(element.paused,false);
audio.setToyRoomMusicTrack('sword');
assert(element.src.includes('Circular%20Dissonance%20(1).mp3'),'Seleciona a trilha da espada.');
assert.equal(element.currentTime,0,'A trilha nova começa do início.');
assert.equal(element.loadCount,1);
assert.equal(element.paused,false,'A troca de trilha continua a reprodução.');
assert(Math.abs(element.volume-0.232)<1e-9,'A troca preserva o volume escolhido.');
audio.setMuted(true);assert.equal(element.volume,0,'A nova trilha respeita o modo mudo.');
audio.setMuted(false);
audio.startToyRoomMusic();
assert(element.src.includes('The%20Circle%20Game.mp3'),'Uma nova Toy Room retorna à trilha padrão.');
audio.stopAllAudio();assert.equal(element.paused,true);
await fs.writeFile(`${directory}/integridade-mecanicas.json`,JSON.stringify({metodosPreservados:unchanged,volumeEscolhido:0.4,volumeFinal:element.volume,mudoEPausa:'aprovados'},null,2)+'\n');
console.log('Aprovado: troca de trilha, volume, mute, pausa, retomada e retorno à música padrão.');
