import {createGardenState,restoreGardenState,stepGarden,retryGarden} from './GardenSimulation.js';
import {GardenRenderer} from './GardenRenderer.js';
import {GardenInput} from './GardenInput.js';
import {GardenAudio} from './GardenAudio.js';
/** Fase isolada: o host fornece canvas, pausa, áudio e dificuldade, sem compartilhar corpos. */
export class GardenPhase {
  constructor({canvas,audio,enabled=()=>true,difficulty='NORMAL',campaign=false}){
    this.canvas=canvas;this.enabled=enabled;this.difficulty=difficulty;this.campaign=campaign;this.state=createGardenState(difficulty);this.ready=false;this.error=null;this.disposed=false;this.paused=false;
    this.onBlur=()=>this.setPaused(true);this.onFocus=()=>{if(this.enabled())this.setPaused(false);};
    this.onVisibility=()=>{if(document.hidden)this.onBlur();else this.onFocus();};
    this.renderer=new GardenRenderer(canvas);this.audio=new GardenAudio(audio);this.input=new GardenInput(canvas,()=>this.ready&&!this.paused&&this.enabled()&&this.state.stage!=='INTRO',()=>this.renderer.controls(),()=>this.audio.unlock());
  }
  get active(){return !this.disposed;}
  async start(saved=null){try{if(saved)this.state=restoreGardenState(saved.state??saved,this.difficulty);await this.renderer.load();if(this.disposed)return;this.ready=true;this.input.install();window.addEventListener('blur',this.onBlur);window.addEventListener('focus',this.onFocus);document.addEventListener('visibilitychange',this.onVisibility);}catch(error){this.error='Não foi possível abrir o jardim: '+error.message;this.input.destroy();}}
  update(dt=1){if(!this.ready||this.disposed||this.paused||!this.enabled()&&!['FALLING','GAME_OVER'].includes(this.state.stage)){this.input.clear();this.audio.update(this.state,true);return;}const input=this.input.sample();for(const event of stepGarden(this.state,input,Math.max(0,dt)/60,this.difficulty))this.audio.event(event.type);this.audio.update(this.state);}
  render(){this.audio.update(this.state,!this.ready||this.disposed||Boolean(this.error)||this.paused||!this.enabled()&&!['FALLING','GAME_OVER'].includes(this.state.stage));this.renderer.render(this.state,{ready:this.ready,error:this.error,touch:this.input.touch,paused:this.paused});}
  setPaused(value){this.paused=Boolean(value);this.input.clear();this.audio.update(this.state,this.paused||!this.ready||this.disposed||Boolean(this.error));}
  snapshot(){return{version:1,state:JSON.parse(JSON.stringify(this.state))};}
  retry(){const retried=retryGarden(this.state,this.difficulty);if(retried)this.setPaused(false);return retried;}
  destroy(){if(this.disposed)return;this.disposed=true;window.removeEventListener('blur',this.onBlur);window.removeEventListener('focus',this.onFocus);document.removeEventListener('visibilitychange',this.onVisibility);this.input.destroy();this.audio.destroy();this.renderer.destroy();}
}
