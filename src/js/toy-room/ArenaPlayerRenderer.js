import { ARENA_GIRL_ANIMATION_FRAMES, ARENA_GIRL_REFERENCE_HEIGHT } from './ArenaGirlAnimationFrames.js';
import { sampleArenaPlayerAnimation } from './ArenaPlayerAnimation.js';
import { ARENA_PLAYER_HEIGHT } from './ArenaScale.js';

/** Poses articuladas, orientação coerente e escala corporal comum, ancoradas pelos pés. */
export class ArenaPlayerRenderer {
  constructor() { this.images=new Map();this.ready=typeof Image==='undefined';this.blendCanvas=null; }
  async load() {
    if(this.ready)return;
    const files=new Set(Object.values(ARENA_GIRL_ANIMATION_FRAMES).flat().map(frame=>frame.file));
    await Promise.all([...files].map(file=>new Promise((resolve,reject)=>{
      const image=new Image();
      image.onload=()=>{this.images.set(file,image);resolve();};
      image.onerror=()=>reject(new Error(`Sprite detalhada da arena ausente: ${file}`));
      image.src=new URL('../../../assets/art/toy-room/battle/'+file,import.meta.url).href;
    })));
    this.ready=true;
  }
  render(ctx,room,state,ground) {
    const sample=sampleArenaPlayerAnimation(state,room.player);
    ctx.save();ctx.translate(room.player.x,ground-state.jump);
    if(state.mode==='DEFEAT'){ctx.rotate(-.9);ctx.translate(-40,-25);}
    const reaction=state.playerHitTime>0&&Math.floor(state.playerHitTime/2)%2===0?.8:1;
    const blended=sample.layers.filter(l=>l.weight>1e-6).length>1;
    if(blended&&!this.blendCanvas) {
      this.blendCanvas=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(512,340)
        :typeof document!=='undefined'?document.createElement('canvas'):null;
      if(this.blendCanvas){this.blendCanvas.width=512;this.blendCanvas.height=340;}
    }
    const target=blended&&this.blendCanvas?this.blendCanvas.getContext('2d'):ctx;
    if(target!==ctx) {
      target.clearRect(0,0,512,340);target.save();target.translate(220,300);
      // Soma ponderada em buffer: a passagem não dissolve a menina contra o cenário.
      target.globalCompositeOperation='lighter';
    }
    for(const {frame,weight}of sample.layers) {
      const image=this.images.get(frame.file);if(!image||weight<=0)continue;
      const scale=ARENA_PLAYER_HEIGHT/ARENA_GIRL_REFERENCE_HEIGHT*frame.pixelUnit;
      target.save();target.globalAlpha*=weight*(target===ctx?reaction:1);
      const faceX=(frame.faceX-frame.anchorX)*frame.sourceFacing*frame.pixelUnit;
      const alignment=(sample.registrationX-faceX)*ARENA_PLAYER_HEIGHT/ARENA_GIRL_REFERENCE_HEIGHT;
      target.translate((sample.offsetX+alignment)*sample.facing,sample.bob);
      target.scale(sample.facing*frame.sourceFacing,1);target.rotate(sample.rotation);
      target.drawImage(image,frame.x,frame.y,frame.width,frame.height,
        -frame.anchorX*scale,-frame.anchorY*scale,frame.width*scale,frame.height*scale);
      target.restore();
    }
    if(target!==ctx){target.restore();ctx.globalAlpha*=reaction;ctx.drawImage(this.blendCanvas,-220,-300);}
    if(sample.slash&&state.mode==='BATTLE')this.renderSwordArc(ctx,sample);
    ctx.restore();
  }
  renderSwordArc(ctx,sample) {
    const {progress,alpha,crouching}=sample.slash;
    const radius=(crouching?98:135)*1.1,cy=crouching?-35:-100;
    ctx.save();ctx.scale(sample.facing,1);ctx.translate(18,cy);
    const end=(crouching?-.55:-.95)+progress*(crouching?.9:1.2),start=end-.65;
    ctx.globalAlpha*=alpha*.9;ctx.strokeStyle='#ffe9ae';ctx.lineWidth=11;
    ctx.beginPath();ctx.arc(0,0,radius,start,end);ctx.stroke();
    ctx.globalAlpha*=.9;ctx.strokeStyle='#fff8e2';ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(0,0,radius-7,start+.15,end);ctx.stroke();ctx.restore();
  }
}
