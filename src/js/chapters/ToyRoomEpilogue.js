import {CHAPTER_ART} from './ChapterArt.js';
import {renderChapterCard} from './ChapterCard.js';
import {renderPoeticNarration} from '../narrative/PoeticNarrator.js';
import {getDialogueSafeArea} from '../ui/DialogueSafeArea.js';
const smooth=value=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
export const TOY_ROOM_EPILOGUE=Object.freeze([
 {speaker:'NANDA',text:'Ufa, conseguimos. Guardamos os brinquedos a tempo. Agora podemos brincar.',duration:7,pose:0},
 {speaker:'UM QUARTO INTEIRO',text:'A menina sorriu.\nDe canto a canto, passeou os olhos pelo quarto.',duration:6,pose:1},
 {speaker:'UM QUARTO INTEIRO',text:'Onde antes havia brinquedos, agora havia espaço.\nO sorriso ficou pequeno. Uma pergunta cresceu no lugar.',duration:7,pose:2},
 {speaker:'MENINA',text:'Mas… agora todos os brinquedos estão guardados.\nComo vamos brincar? Vamos pegar os brinquedos de novo?',duration:8,pose:2},
 {duration:4.5,facepalm:true,pose:2},
 {duration:5,chapter:true}
]);
/** Desfecho autorado da organização; mantém leitura, atuação e retomada fora da física. */
export class ToyRoomEpilogue{
 constructor({assets,audio,onComplete=()=>{},saved,campaign=true}={}){
  this.assets=assets;this.audio=audio;this.onComplete=onComplete;this.campaign=campaign;this.active=true;this.index=0;this.age=0;this.time=0;
  if(saved){if(saved.version!==1||!Number.isInteger(saved.index)||saved.index<0||saved.index>=TOY_ROOM_EPILOGUE.length||!Number.isFinite(saved.age)||saved.age<0||!Number.isFinite(saved.time)||saved.time<0)throw new TypeError('Cena de organização salva inválida.');Object.assign(this,{index:saved.index,age:saved.age,time:saved.time});}
  audio?.startToyRoomMusic?.({fade:0});
 }
 get beat(){return TOY_ROOM_EPILOGUE[this.index];}
 snapshot(){return{version:1,index:this.index,age:this.age,time:this.time};}
 /** O plano silencioso do facepalm conserva sua duração; adiantar texto não o atravessa. */
 advanceDialogue(){if(!this.active||(!this.beat.text&&!this.beat.chapter))return false;this.next();return true;}
 next(){if(this.index===TOY_ROOM_EPILOGUE.length-1){this.active=false;this.onComplete();}else{this.index++;this.age=0;}}
 update(dt){if(!this.active)return;const seconds=Math.max(0,dt)/60;this.time+=seconds;this.age+=seconds;this.audio?.setToyRoomMusicFade?.(Math.min(1,this.time));if(this.age>=this.beat.duration)this.next();}
 /** Enquadra a atuação sobre a mesma pintura já arrumada; o último plano aproxima Nanda. */
 render(ctx,canvas){
  const beat=this.beat;if(beat.chapter){renderChapterCard(ctx,canvas,{image:this.assets?.get('chapter-garden'),number:2,title:'DIA DE PIQUENIQUE NO JARDIM',age:this.age,onAdvance:()=>this.advanceDialogue()});return;}
  const {width,height}=canvas,css=width/(canvas.clientWidth||width),safe=getDialogueSafeArea(canvas),rect=canvas.getBoundingClientRect?.(),bar=globalThis.document?.querySelector?.('.top-controls-bar')?.getBoundingClientRect(),inset=Math.max(safe.top,bar&&rect?(bar.bottom-rect.top)*height/rect.height+12*css:0);
  const virtual={width:safe.right-safe.left,height:height-inset,clientWidth:(safe.right-safe.left)/css},key=[width,height,css,inset,globalThis.document?.fonts?.status].join(':');
  if(this.measureKey!==key){this.measureContext??=globalThis.document?.createElement('canvas').getContext('2d');this.textBottom=inset+140*css;if(this.measureContext)for(const b of TOY_ROOM_EPILOGUE.filter(b=>b.text)){const box=renderPoeticNarration(this.measureContext,virtual,b.text,{heading:b.speaker});this.textBottom=Math.max(this.textBottom,inset+box.y+box.height+12*css);}this.measureKey=key;}
  const textBottom=this.textBottom;
  const baseScale=Math.max(width/1672,height/940),baseScreen=height/2+(850-470)*baseScale,factor=Math.min(1,Math.max(.3,(baseScreen-textBottom-10*css)/(440*baseScale))),close=beat.facepalm?smooth(this.age/beat.duration):0,fairyX=height>width?945:1020,targetZoom=Math.max(2.5,(height-inset-40*css)*.56/(140*factor*baseScale)),scale=baseScale*(1+close*(targetZoom-1)),focusX=836+(fairyX-836)*close,focusY=470+(610-70*factor-470)*close;
  ctx.save();ctx.fillStyle='#37231e';ctx.fillRect(0,0,width,height);ctx.save();ctx.translate(width/2,height/2+inset/2*close);ctx.scale(scale,scale);ctx.translate(-focusX,-focusY);
  const room=this.assets?.get('chapter-clean-room');if(room)ctx.drawImage(room,0,0,1672,940);
  const girl=this.assets?.get('chapter-girl-room'),set=CHAPTER_ART.girl;
  const drawGirl=(index,alpha)=>{const f=set.frames[index],s=440*factor/set.referenceHeight;ctx.save();ctx.globalAlpha=alpha;const breath=1+Math.sin(this.time*(index===0?4.8:2))*(index===0?.009:.003);if(girl)ctx.drawImage(girl,f.x,f.y,f.w,f.h,760-f.anchorX*s,850-f.h*s*breath,f.w*s,f.h*s*breath);ctx.restore();};
  const blend=this.index===2?smooth(this.age/2):1;if(this.index===2&&blend<1)drawGirl(1,1-blend);drawGirl(beat.pose,blend);
  const fairy=beat.facepalm?this.assets?.get('chapter-fairy'):this.assets?.get('toy-room-illustrated-fairy-v1'),frame=beat.facepalm?CHAPTER_ART.fairy.frames[0]:fairy?{x:0,y:0,w:fairy.width,h:fairy.height}:null;
  if(fairy&&frame){const h=140*factor,s=h/frame.h,y=610+Math.sin(this.time*2.4)*5;ctx.drawImage(fairy,frame.x,frame.y,frame.w,frame.h,fairyX-frame.w*s/2,y-h,frame.w*s,h);}
  ctx.restore();if(beat.text){ctx.save();ctx.translate(safe.left,inset);renderPoeticNarration(ctx,virtual,beat.text,{heading:beat.speaker,advanceCanvas:canvas,onAdvance:()=>this.advanceDialogue()});ctx.restore();}
  const fade=Math.max(0,1-this.time/.6);if(fade){ctx.fillStyle=`rgba(20,13,20,${fade})`;ctx.fillRect(0,0,width,height);}ctx.restore();
 }
}
