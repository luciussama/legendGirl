import {GardenAudio} from '../garden/GardenAudio.js';
/** Trilha enviada pelo usuário; entra com o convite de Nanda e acompanha o circuito em loop. */
export class BrinquedaoAudio extends GardenAudio{
 constructor(host){super(host,{track:new URL('../../../assets/audio/Brinquedao.mp3',import.meta.url),label:'do Brinquedão'});}
 update(state,paused=false){super.update(state,paused||state.stage==='GAME_OVER'||state.stage==='INTRO'&&state.story.index<3);}
 updateWings(){/* O brinquedão não recebe emissores de insetos de outras fases. */}
 event(type){if(type==='tube-start'){this.tone(320,.3,.025,1100);return;}if(type==='side-spring'){this.tone(130,.23,.055,580);return;}if(type==='spring'){this.tone(110,.24,.055,490);return;}if(type==='elastic-wall'){this.tone(95,.27,.055,620);return;}if(type==='sky-launch'){this.tone(360,.32,.025,1100);return;}if(type==='bridge-creak'){this.tone(180,.12,.02,95);return;}if(type==='bridge-fall'){this.tone(95,.15,.02,45);return;}if(type==='balls')this.tone(280,.16,.035,530);else if(type==='soft-landing')this.tone(250,.2,.025,180);else super.event(type);}
}
