/** Pequena trilha original de jardim; segue pausa, mudo e volume do host e libera suas vozes. */
export class GardenAudio {
  constructor(host){this.host=host;this.voices=new Set();this.beat=-1;this.paused=false;}
  unlock(){this.host?.initAudio?.();}
  tone(frequency,duration=.25,volume=.035,slide=frequency){const ctx=this.host?.getAudioContext?.();if(!ctx||ctx.state!=='running'||this.paused||this.host?.isMuted?.())return;const oscillator=ctx.createOscillator(),gain=ctx.createGain();oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,ctx.currentTime);oscillator.frequency.exponentialRampToValueAtTime(slide,ctx.currentTime+duration);gain.gain.setValueAtTime(volume*(this.host?.getMasterVolume?.()??1),ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);oscillator.connect(gain);gain.connect(ctx.destination);const voice={oscillator,gain};this.voices.add(voice);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();this.voices.delete(voice);};oscillator.start();oscillator.stop(ctx.currentTime+duration);}
  update(state,paused=false){this.paused=paused;if(paused||this.host?.isMuted?.()){this.clear();return;}const beat=Math.floor(state.time/.48);if(beat===this.beat)return;this.beat=beat;if(state.stage==='GAME_OVER')return;const notes=[523.25,659.25,783.99,659.25,587.33,698.46,880,783.99,659.25,587.33,523.25,392,440,523.25,587.33,659.25];this.tone(notes[beat%notes.length],.42,.025);if(beat%8===3)this.tone(1800,.14,.012,2600);}
  event(type){if(type==='jump')this.tone(420,.13,.045,780);else if(type==='stomp')this.tone(680,.12,.055,1000);else if(type==='hurt'||type==='fall')this.tone(280,.2,.04,150);else if(type==='checkpoint'||type==='complete')this.tone(1046,.5,.04,1318);}
  clear(){for(const voice of this.voices){voice.oscillator.onended=null;try{voice.oscillator.stop();}catch{}voice.oscillator.disconnect();voice.gain.disconnect();}this.voices.clear();}
  destroy(){this.clear();}
}
