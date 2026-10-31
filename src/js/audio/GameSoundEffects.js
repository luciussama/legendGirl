/** Amostras fornecidas pelo usuário; a coleção original de asas nunca é carregada no jogo. */
export const GAME_SOUNDS=Object.freeze({
  jump:new URL('../../../assets/audio/effects/jump-girl.wav',import.meta.url),
  mud:new URL('../../../assets/audio/effects/mud-impact.wav',import.meta.url),
  bee:new URL('../../../assets/audio/effects/wings-bee-v2.wav',import.meta.url),
  beetle:new URL('../../../assets/audio/effects/wings-insects-v2.wav',import.meta.url),
  dive:new URL('../../../assets/audio/effects/wings-bee-v2.wav',import.meta.url)
});
const caches=new WeakMap();
/** Compartilha decodificação por contexto; nunca agenda efeitos atrasados após o carregamento. */
export function preloadGameSounds(ctx,names=Object.keys(GAME_SOUNDS)){
  if(!ctx)return Promise.resolve([]);
  let cache=caches.get(ctx);if(!cache){cache=new Map();caches.set(ctx,cache);}
  return Promise.all(names.map(name=>{
    if(!cache.has(name)){
      const entry={buffer:null};cache.set(name,entry);
      entry.promise=fetch(GAME_SOUNDS[name]).then(r=>{if(!r.ok)throw Error(`HTTP ${r.status}`);return r.arrayBuffer();}).then(data=>ctx.decodeAudioData(data)).then(buffer=>{entry.buffer=buffer;return true;}).catch(error=>{console.warn(`Não foi possível carregar o som ${name}:`,error);return false;});
    }
    return cache.get(name).promise;
  }));
}
/** Vozes curtas e asas contínuas, com canais limitados, panorâmica e encerramento explícito. */
export class GameSoundEffects{
  constructor(){this.voices=new Map();this.fading=new Set();this.serial=0;}
  play(ctx,destination,name,{volume=.65,rate=1,loop=false,channel=null,pan=0}={}){
    const buffer=caches.get(ctx)?.get(name)?.buffer;
    if(!ctx||ctx.state!=='running'||!buffer)return false;
    const key=channel??`efeito-${this.serial++}`;
    if(channel&&this.voices.has(key))return true;
    const same=[...this.voices].filter(([,v])=>!v.loop&&v.name===name);
    if(!loop&&same.length>=3)this.stop(same[0][0]);
    const source=ctx.createBufferSource(),gain=ctx.createGain(),panner=ctx.createStereoPanner();
    source.buffer=buffer;source.loop=loop;source.playbackRate.value=rate;
    gain.gain.setValueAtTime(loop?0:volume,ctx.currentTime);if(loop)gain.gain.linearRampToValueAtTime(volume,ctx.currentTime+.09);
    panner.pan.value=pan;source.connect(gain);gain.connect(panner);panner.connect(destination);
    const voice={source,gain,panner,loop,name,ctx};this.voices.set(key,voice);
    source.onended=()=>{this.fading.delete(voice);source.disconnect();gain.disconnect();panner.disconnect();if(this.voices.get(key)===voice)this.voices.delete(key);};
    source.start(ctx.currentTime,loop?(this.serial++*.731)%buffer.duration:0);return true;
  }
  update(channel,volume,pan=0,rate=1){const v=this.voices.get(channel);if(!v)return;v.gain.gain.cancelAndHoldAtTime(v.ctx.currentTime);v.gain.gain.setTargetAtTime(volume,v.ctx.currentTime,.06);v.panner.pan.setTargetAtTime(pan,v.ctx.currentTime,.06);v.source.playbackRate.setTargetAtTime(rate,v.ctx.currentTime,.1);}
  stop(channel=null,fade=0){if(channel===null&&!fade)for(const v of this.fading){try{v.source.stop();}catch{}}for(const [key,v] of this.voices){if(channel!==null&&key!==channel)continue;this.voices.delete(key);try{if(fade){this.fading.add(v);v.gain.gain.cancelAndHoldAtTime(v.ctx.currentTime);v.gain.gain.setTargetAtTime(0,v.ctx.currentTime,fade/4);v.source.stop(v.ctx.currentTime+fade);}else v.source.stop();}catch{v.source.disconnect();v.gain.disconnect();v.panner.disconnect();}}}
}
