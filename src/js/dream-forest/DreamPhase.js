import {GardenAudio} from '../garden/GardenAudio.js';
import {DreamInput} from './DreamInput.js';
import {DreamRenderer} from './DreamRenderer.js';
import {createDreamState,restoreDreamState,advanceDreamDialogue,stepDream,retryDream} from './DreamSimulation.js';
/** Sonho lateral isolado: carga sob demanda, ciclo de vida e origem de campanha próprios. */
export class DreamPhase{
  constructor({canvas,audio,enabled=()=>true,difficulty='NORMAL',campaign=false}){this.canvas=canvas;this.enabled=enabled;this.campaign=campaign;this.difficulty=difficulty;this.state=createDreamState(difficulty);this.ready=false;this.error=null;this.disposed=false;this.paused=false;this.renderer=new DreamRenderer(canvas);this.audio=new GardenAudio(audio,{track:new URL('../../../assets/audio/Misty Blues.mp3',import.meta.url),label:'do sonho'});this.input=new DreamInput(canvas,()=>this.ready&&!this.paused&&this.enabled(),()=>this.audio.unlock(),()=>this.reading());this.onBlur=()=>this.setPaused(true);this.onFocus=()=>{if(this.enabled())this.setPaused(false);};this.onVisibility=()=>document.hidden?this.onBlur():this.onFocus();}
  get active(){return !this.disposed;}
  reading(){return this.state.stage==='INTRO'||this.state.stage==='COMPLETE'&&this.state.age<7?{seen:false}:null;}
  advanceDialogue(){if(!this.ready||this.paused||!this.enabled())return false;const advanced=advanceDreamDialogue(this.state);if(advanced){this.input.clear();this.input.blockJumpUntilRelease=true;}return advanced;}
  async start(saved=null){try{if(saved)this.state=restoreDreamState(saved.state??saved,this.difficulty);await this.renderer.load();if(this.disposed)return;this.ready=true;this.input.install();window.addEventListener('blur',this.onBlur);window.addEventListener('focus',this.onFocus);document.addEventListener('visibilitychange',this.onVisibility);if(Number.isFinite(saved?.musicTime)&&saved.musicTime>=0)this.audio.music.currentTime=saved.musicTime;}catch(e){this.error='Não foi possível abrir o sonho: '+e.message;this.input.destroy();}}
  update(dt=1){if(!this.ready||this.disposed||this.paused||!this.enabled()){this.input.clear();this.audio.update(this.state,true);return;}for(const event of stepDream(this.state,this.input.sample(),Math.max(0,dt)/60))this.audio.event(event.type);this.audio.update(this.state);}
  render(){this.audio.update(this.state,!this.ready||this.disposed||this.paused||Boolean(this.error)||!this.enabled());this.renderer.render(this.state,{ready:this.ready,error:this.error,paused:this.paused,onAdvance:()=>this.advanceDialogue(),touch:this.input.touch||this.canvas.clientWidth<900});}
  setPaused(value){this.paused=Boolean(value);this.input.clear();this.audio.update(this.state,this.paused||!this.ready||this.disposed);}
  snapshot(){return{version:1,state:structuredClone(this.state),musicTime:Number.isFinite(this.audio.music.currentTime)?this.audio.music.currentTime:0};}
  retry(){return retryDream(this.state);}
  destroy(){if(this.disposed)return;this.disposed=true;window.removeEventListener('blur',this.onBlur);window.removeEventListener('focus',this.onFocus);document.removeEventListener('visibilitychange',this.onVisibility);this.input.destroy();this.audio.destroy();this.renderer.destroy();}
}
