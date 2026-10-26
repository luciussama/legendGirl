import {GARDEN_ACTING as ART} from './GardenCinematicArt.js';
import {GARDEN_OPENING,GARDEN_ENDING,GARDEN_OPENING_DURATION} from './GardenNarrative.js';
import {getDialogueSafeArea} from '../ui/DialogueSafeArea.js';
import {renderPoeticNarration} from '../narrative/PoeticNarrator.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
/** Planos e atuação usam o relógio narrativo; nunca reposicionam a câmera jogável. */
export function gardenCinematicMoment(state){
  const end=state.stage==='COMPLETE',cards=end?GARDEN_ENDING:GARDEN_OPENING;
  let elapsed=0;
  for(let index=0;index<cards.length;index++){
    const card=cards[index];if(state.age<elapsed+card.duration)return{end,index,card,time:state.age-elapsed};elapsed+=card.duration;
  }
  return{end,index:cards.length-1,card:cards.at(-1),time:state.age-elapsed+cards.at(-1).duration};
}
function actor(ctx,images,index,x,base,height,time,breath=true){
  const image=images.get(ART.file),f=ART.frames[index];if(!image)return;
  const scale=height/ART.referenceHeight,breathe=breath?1+Math.sin(time*2.1)*.003:1;
  ctx.drawImage(image,f.x,f.y,f.w,f.h,x-f.anchorX*scale,base-f.h*scale*breathe,f.w*scale,f.h*scale*breathe);
}
function fairy(ctx,images,time,x,y){
  const image=images.get('../toy-room/stage3/illustrated-fairy-v1.png');if(!image)return;
  const scale=145/image.height,left=image.width*.24,right=image.width*.77,beat=.72+.28*Math.abs(Math.sin(time*18));
  ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(time*3)*.035);
  ctx.shadowColor='#ffdb84';ctx.shadowBlur=10;
  ctx.drawImage(image,left,0,right-left,image.height,(-image.width/2+left)*scale,-72,(right-left)*scale,145);ctx.shadowBlur=0;
  ctx.drawImage(image,0,0,left,image.height,(-image.width/2+left-left*beat)*scale,-72,left*scale*beat,145);
  ctx.drawImage(image,right,0,image.width-right,image.height,(-image.width/2+right)*scale,-72,(image.width-right)*scale*beat,145);
  ctx.restore();
}
/** Composição em camadas na altura dos olhos, como ToyRoomIntroduction. */
export function renderGardenCinematic(ctx,canvas,state,images){
  const m=gardenCinematicMoment(state),{width,height}=canvas,safe=getDialogueSafeArea(canvas),css=width/(canvas.clientWidth||width);
  ctx.save();ctx.fillStyle='#edf1df';ctx.fillRect(0,0,width,height);
  const rect=canvas.getBoundingClientRect?.(),toolbar=globalThis.document?.querySelector?.('.top-controls-bar')?.getBoundingClientRect();
  const toolbarBottom=toolbar&&rect?.height?(toolbar.bottom-rect.top)*height/rect.height:0;
  const inset=Math.max(safe.top,toolbarBottom>0?toolbarBottom+12*css:0);
  const lowLandscape=width>height&&(canvas.clientHeight||height)<480;
  const textCanvas={width:safe.right-safe.left,height:height-inset,clientWidth:(safe.right-safe.left)/(css*(lowLandscape?.8:1))};
  ctx.save();ctx.translate(safe.left,inset);
  const box=renderPoeticNarration(ctx,textCanvas,m.card.text,{heading:m.card.speaker});ctx.restore();
  const v={x:safe.left,y:inset+box.y+box.height+12*css,w:safe.right-safe.left,h:Math.max(1,safe.bottom-inset-box.y-box.height-12*css)};
  const portrait=height>width,p=smooth(m.time/m.card.duration),t=state.age;
  const close=m.end?(m.index>=2&&m.index<=7):(m.index===1||m.index>=4&&m.index<=7);
  const zoom=1+(close?.13:0)+p*.035;
  const scale=Math.max(v.w/1652,v.h/952,Math.min(v.w/(portrait?660:1450),v.h/650)*zoom);
  let focusX=m.end?(portrait?940:1030):(close?690:710),focusY=m.end?575:470;
  // No retrato, o plano de chegada apresenta os convidados antes de chegar a Yuna.
  if(m.end&&m.index===0)focusX=portrait?1250-310*p:focusX+45*(1-p);
  const halfW=v.w/scale/2,halfH=v.h/scale/2;
  focusX=Math.max(halfW,Math.min(1652-halfW,focusX));focusY=Math.max(halfH,Math.min(952-halfH,focusY));
  ctx.save();ctx.beginPath();ctx.rect(v.x,v.y,v.w,v.h);ctx.clip();
  ctx.translate(v.x+v.w/2,v.y+v.h/2);ctx.scale(scale,scale);ctx.translate(-focusX,-focusY);
  const background=images.get(m.end?'cinematic/piquenique-sem-yuna-v1.png':'cinematic/casa-sem-atores-v1.png');
  if(background)ctx.drawImage(background,0,0,1652,952);
  if(!m.end){
    const entry=smooth(t/3),leaving=smooth((t-44)/6),x=590-65*(1-entry)+leaving*65;
    const pose=m.index>=8?2:m.index>=4?1:0;
    actor(ctx,images,pose,x,700,440,t);
    const approach=smooth((t-2)/4),look=m.index>=4&&m.index<=7;
    fairy(ctx,images,t,875+(1-approach)*140+(look?-32:Math.sin(t*.8)*24),370+Math.sin(t*2.4)*9);
    // O inseto atravessa o olhar, enquanto a menina encolhe os ombros.
    if(m.index===4){const q=smooth(m.time/5);ctx.save();ctx.globalAlpha=Math.sin(q*Math.PI)*.8;ctx.fillStyle='#d9a85f';ctx.translate(730+q*180,430-Math.sin(q*Math.PI)*70);ctx.rotate(Math.sin(t*9)*.12);ctx.beginPath();ctx.ellipse(-4,-4,8,4,-.5,0,Math.PI*2);ctx.ellipse(5,-4,8,4,.5,0,Math.PI*2);ctx.fill();ctx.restore();}
  }else{
    const settling=smooth(t/2),base=735-12*(1-settling),eating=m.index>=5;
    // A âncora da cabeça e a base comuns impedem saltos entre as poses de comer.
    actor(ctx,images,eating?(Math.sin(t*1.4)>.35?5:4):3,895,base,440,t);
    if(t<22){const q=smooth((t-17)/5);fairy(ctx,images,t,760+25*q,520+135*q);}
    else{
      const bite=Math.sin(t*1.35)>.3;
      actor(ctx,images,bite?7:6,790,710,210,t);
    }
  }
  ctx.restore();
  const alpha=Math.min(1,state.age/.45,m.end?1:(GARDEN_OPENING_DURATION-state.age)/.45);
  if(alpha<1){ctx.fillStyle=`rgba(237,241,223,${1-alpha})`;ctx.fillRect(0,0,width,height);}
  ctx.restore();
}
