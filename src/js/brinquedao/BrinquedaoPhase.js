import {GardenInput} from '../garden/GardenInput.js';
import {isMobileDevice} from '../controllers/MobileZoom.js';
import {BrinquedaoAudio} from './BrinquedaoAudio.js';
import {BrinquedaoRenderer} from './BrinquedaoRenderer.js';
import {createBrinquedaoState,restoreBrinquedaoState,stepBrinquedao,recoverBrinquedao} from './BrinquedaoSimulation.js';
import {advanceBrinquedaoStory} from './BrinquedaoStory.js';
/** Fase isolada com circuito próprio, pausa, leitura, áudio e persistência de campanha. */
export class BrinquedaoPhase{
 constructor({canvas,audio,enabled=()=>true,difficulty='NORMAL',campaign=false}){this.canvas=canvas;this.enabled=enabled;this.campaign=campaign;this.difficulty=difficulty;this.state=createBrinquedaoState(difficulty);this.ready=false;this.error=null;this.disposed=false;this.paused=false;this.renderer=new BrinquedaoRenderer(canvas);this.audio=new BrinquedaoAudio(audio);this.input=new GardenInput(canvas,()=>this.ready&&!this.error&&!this.paused&&this.enabled(),()=>this.renderer.controls(),()=>this.audio.unlock(),()=>this.reading());this.onBlur=()=>this.setPaused(true);this.onFocus=()=>{if(this.enabled())this.setPaused(false);};this.onVisibility=()=>document.hidden?this.onBlur():this.onFocus();}
 get active(){return !this.disposed;}
 reading(){return this.state.stage==='INTRO'||this.state.stage==='COMPLETE'&&!this.state.story.endingDone?{seen:false}:null;}
 advanceDialogue(){if(!this.ready||this.paused||!this.enabled())return false;const changed=advanceBrinquedaoStory(this.state);if(changed){this.input.clear();this.input.blockJumpUntilRelease=true;}return changed;}
 async start(saved=null){try{if(saved)this.state=restoreBrinquedaoState(saved.state??saved,this.difficulty);await this.renderer.load();if(this.disposed)return;this.ready=true;this.input.install();window.addEventListener('blur',this.onBlur);window.addEventListener('focus',this.onFocus);document.addEventListener('visibilitychange',this.onVisibility);if(Number.isFinite(saved?.musicTime)&&saved.musicTime>=0)this.audio.music.currentTime=saved.musicTime;}catch(e){this.error='Não foi possível abrir o Brinquedão: '+e.message;this.input.destroy();}}
 update(dt=1){if(!this.ready||this.error||this.disposed||this.paused||!this.enabled()){this.input.clear();this.audio.update(this.state,true);return;}const wasIntro=this.state.stage==='INTRO';for(const event of stepBrinquedao(this.state,this.input.sample(),Math.max(0,dt)/60))this.audio.event(event.type);if(wasIntro&&this.state.stage!=='INTRO'){this.input.clear();this.input.blockJumpUntilRelease=true;}this.audio.update(this.state);}
 render(){this.audio.update(this.state,!this.ready||Boolean(this.error)||this.paused||this.disposed||!this.enabled());this.renderer.render(this.state,{ready:this.ready,error:this.error,paused:this.paused,touch:this.input.touch||isMobileDevice(),onAdvance:()=>this.advanceDialogue()});}
 setPaused(value){this.paused=Boolean(value);this.input.clear();this.audio.update(this.state,this.paused||!this.ready||this.disposed);}
 snapshot(){return{version:1,state:structuredClone(this.state),musicTime:Number.isFinite(this.audio.music.currentTime)?this.audio.music.currentTime:0};}
 retry(){if(!['RECOVER','GAME_OVER'].includes(this.state.stage))return false;recoverBrinquedao(this.state);return true;}
 destroy(){if(this.disposed)return;this.disposed=true;window.removeEventListener('blur',this.onBlur);window.removeEventListener('focus',this.onFocus);document.removeEventListener('visibilitychange',this.onVisibility);this.input.destroy();this.audio.destroy();this.renderer.destroy();}
}
