import {DreamSilence} from './DreamSilence.js';
import {dreamOpeningBeat} from './DreamOpening.js';
import {GardenAudio} from '../garden/GardenAudio.js';
/** Trilha do sonho, pulsos de tensão e grito sintetizado; pausa, mudo e volume pertencem ao host. */
export class DreamAudio extends GardenAudio{
  constructor(host){super(host,{track:new URL('../../../assets/audio/Misty Blues.mp3',import.meta.url),label:'do sonho',wingScene:'dream'});this.trackScene='dream';this.silence=new DreamSilence();}
  /** Vocalização curta de susto, com formantes de voz; disparada somente na captura autorada. */
  scream(){const ctx=this.host?.getAudioContext?.();if(this.disposed||!ctx||ctx.state!=='running'||this.paused||this.host?.isMuted?.())return;const start=ctx.currentTime,volume=this.host?.getMasterVolume?.()??1;
    for(const formant of [1050,2450]){const oscillator=ctx.createOscillator(),mouth=ctx.createBiquadFilter(),gain=ctx.createGain();oscillator.type='sawtooth';oscillator.frequency.setValueAtTime(670,start);oscillator.frequency.linearRampToValueAtTime(920,start+.1);oscillator.frequency.exponentialRampToValueAtTime(430,start+.7);mouth.type='bandpass';mouth.frequency.value=formant;mouth.Q.value=2.4;gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.085*volume+.0001,start+.035);gain.gain.setValueAtTime(.055*volume+.0001,start+.3);gain.gain.exponentialRampToValueAtTime(.0001,start+.74);oscillator.connect(mouth);mouth.connect(gain);gain.connect(ctx.destination);const voice={oscillator,gain};this.voices.add(voice);oscillator.onended=()=>{oscillator.disconnect();mouth.disconnect();gain.disconnect();this.voices.delete(voice);};oscillator.start(start);oscillator.stop(start+.76);}
  }
  /** A origem da trilha deriva do estágio salvo; a retomada conserva o instante da faixa correta. */
  selectTrack(state){if(this.disposed)return;const opening=state.stage==='OPENING',transition=opening&&dreamOpeningBeat(state).shot==='leave'&&state.story.opening.age>=2.8,scene=opening&&!transition?'silence':!state.nightmare?'dream':state.stage==='NIGHTMARE_WAKE'||state.stage==='COMPLETE'?'picnic':'nightmare';if(scene===this.trackScene)return;this.trackScene=scene;if(scene==='silence'){this.wantsMusic=false;this.music.pause();return;}this.music.src=new URL(scene==='picnic'?'../../../assets/audio/Blues Shuffle Loop.mp3':scene==='nightmare'?'../../../assets/audio/Bug attack.mp3':'../../../assets/audio/Misty Blues.mp3',import.meta.url).href;this.music.loop=true;}
  /** A faixa acompanha o trecho e repete livremente; não governa nenhum relógio de cena. */
  update(state,paused=false){if(this.disposed)return;this.selectTrack(state);const opening=state.stage==='OPENING',o=state.story.opening,mix=opening&&dreamOpeningBeat(state).shot==='leave'?Math.max(0,Math.min(1,(o.age-2.8)/1.2)):0,muted=Boolean(this.host?.isMuted?.());
    if(opening){this.paused=paused;this.music.muted=muted;this.music.volume=(this.host?.getMasterVolume?.()??1)*.35*mix;this.wantsMusic=this.trackScene==='dream'&&!paused&&!muted;if(this.wantsMusic)this.playMusic();else this.music.pause();this.samples.stop();if(paused||muted)this.clear();else this.silence.update(this.host?.getAudioContext?.(),(this.host?.getMasterVolume?.()??1)*.5*(1-mix));return;}
    this.silence.stop();super.update(state,paused);
  }

  /** Pausa, mudo e descarte encerram também os nós do zunido da abertura. */
  clear(){super.clear();this.silence?.stop();}
  event(type,event={}){if(type==='roach-step')this.tone(55,.22,.055,28);else if(type==='roach-stomp')this.tone(62,.42,.12,24);else if(type==='nightmare-scream'){this.clear();this.scream();}else if(type==='nightmare-detected')this.tone(140,.35,.045,65);else if(type==='nightmare-start')this.clear();else super.event(type,event);}
}
