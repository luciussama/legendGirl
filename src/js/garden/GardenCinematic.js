import {GARDEN_ACTING as ART} from './GardenCinematicArt.js';
import {GARDEN_OPENING,GARDEN_ENDING,GARDEN_OPENING_DURATION} from './GardenNarrative.js';
import {getDialogueSafeArea} from '../ui/DialogueSafeArea.js';
import {renderPoeticNarration} from '../narrative/PoeticNarrator.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const dialogueMeasurements=new WeakMap();
/** Reserva somente o espaço dos atores; a pintura continua por trás de todo o quadro. */
function dialogueBottom(canvas,textCanvas,end){
  const key=[textCanvas.width,textCanvas.clientWidth,textCanvas.height,end,globalThis.document?.fonts?.status].join(':');
  let cache=dialogueMeasurements.get(canvas);
  if(cache?.key!==key){
    const measure=document.createElement('canvas').getContext('2d');
    const bottom=Math.max(...(end?GARDEN_ENDING:GARDEN_OPENING).map(card=>{const box=renderPoeticNarration(measure,textCanvas,card.text+'\n ',{heading:card.speaker});return box.y+box.height;}));
    cache={key,bottom};dialogueMeasurements.set(canvas,cache);
  }
  return cache.bottom;
}
/** Planos e atuação usam o relógio narrativo; nunca reposicionam a câmera jogável. */
export function gardenCinematicMoment(state){
  const end=state.stage==='COMPLETE',cards=end?GARDEN_ENDING:GARDEN_OPENING;
  if(state.story){const index=state.story[end?'endingIndex':'openingIndex'];return{end,index,card:cards[index],time:state.story.cardAge};}
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
/** Mantém âncora/escala e interpola o gesto somente na breve passagem da mordida. */
function actorPair(ctx,images,a,b,x,base,height,time){
 const cycle=time%3.4,blend=smooth((cycle-.8)/.28)*(1-smooth((cycle-2.2)/.28)),alpha=ctx.globalAlpha;
 ctx.save();ctx.globalAlpha=alpha*(1-blend);actor(ctx,images,a,x,base,height,time,false);ctx.globalAlpha=alpha*blend;actor(ctx,images,b,x,base,height,time,false);ctx.restore();
}
function fairy(ctx,images,time,x,y,height=145){
  const image=images.get('../toy-room/stage3/illustrated-fairy-v1.png');if(!image)return;
  const scale=height/image.height,left=image.width*.24,right=image.width*.77,beat=.72+.28*Math.abs(Math.sin(time*18));
  ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(time*3)*.035);
  ctx.shadowColor='#ffdb84';ctx.shadowBlur=10;
  ctx.drawImage(image,left,0,right-left,image.height,(-image.width/2+left)*scale,-height/2,(right-left)*scale,height);ctx.shadowBlur=0;
  ctx.drawImage(image,0,0,left,image.height,(-image.width/2+left-left*beat)*scale,-height/2,left*scale*beat,height);
  ctx.drawImage(image,right,0,image.width-right,image.height,(-image.width/2+right)*scale,-height/2,(image.width-right)*scale*beat,height);
  ctx.restore();
}
/** Composição em camadas na altura dos olhos, como ToyRoomIntroduction. */
export function renderGardenCinematic(ctx,canvas,state,images){
  const m=gardenCinematicMoment(state),{width,height}=canvas,safe=getDialogueSafeArea(canvas),css=width/(canvas.clientWidth||width);
  ctx.save();
  const rect=canvas.getBoundingClientRect?.(),toolbar=globalThis.document?.querySelector?.('.top-controls-bar')?.getBoundingClientRect();
  const toolbarBottom=toolbar&&rect?.height?(toolbar.bottom-rect.top)*height/rect.height:0;
  const inset=Math.max(safe.top,toolbarBottom>0?toolbarBottom+12*css:0);
  const lowLandscape=width>height&&(canvas.clientHeight||height)<480;
  const textCanvas={width:safe.right-safe.left,height:height-inset,clientWidth:(safe.right-safe.left)/(css*(lowLandscape?.8:1))};
  const maxBottom=inset+dialogueBottom(canvas,textCanvas,m.end)+12*css;
  const v={x:0,y:0,w:width,h:height};
  const portrait=height>width,p=smooth(m.time/m.card.duration),t=state.time;
  const close=m.end?(m.index>=2&&m.index<=7):(m.index===1||m.index>=4&&m.index<=7);
  const zoom=1+(close?.035:0)+p*.015;
  const scale=Math.max(v.w/1652,v.h/952)*zoom;
  let focusX=m.end?(portrait?940:1030):(portrait?680:710),focusY=v.h/scale/2;
  const base=m.end?735:700,maxActorHeight=m.end?440*Math.max(...ART.frames.slice(3,6).map(f=>f.h))/ART.referenceHeight:440;
  const actorFactor=Math.min(1,Math.max(.35,(base*scale-maxBottom-12*css)/(maxActorHeight*scale)));
  // No retrato, o plano de chegada apresenta os convidados antes de chegar a Yuna.
  if(m.end&&m.index===0)focusX=portrait?1250-310*p:focusX+45*(1-p);
  const halfW=v.w/scale/2,halfH=v.h/scale/2;
  focusX=Math.max(halfW,Math.min(1652-halfW,focusX));focusY=Math.max(halfH,Math.min(952-halfH,focusY));
  ctx.save();ctx.beginPath();ctx.rect(v.x,v.y,v.w,v.h);ctx.clip();
  ctx.translate(v.x+v.w/2,v.y+v.h/2);ctx.scale(scale,scale);ctx.translate(-focusX,-focusY);
  const background=images.get(m.end?'cinematic/piquenique-sem-yuna-v1.png':'cinematic/casa-sem-atores-v1.png');
  if(background)ctx.drawImage(background,0,0,1652,952);
  if(!m.end){
    const x=590; // Plano fixo: a descida acontece no mapa após um corte, sem pose deslizando.
    const pose=m.index>=8?2:m.index>=4?1:0;
    actor(ctx,images,pose,x,700,440*actorFactor,t);
    const approach=smooth(state.age/4),look=m.index>=4&&m.index<=7;
    const fairyHeight=145*actorFactor,fy=Math.max(370+Math.sin(t*2.4)*9,(maxBottom+fairyHeight*scale/2+12*css)/scale);
    fairy(ctx,images,t,875+(1-approach)*140+(look?-32:Math.sin(t*.8)*24)-(portrait?55:0),fy,fairyHeight);
    // O inseto atravessa o olhar, enquanto a menina encolhe os ombros.
    if(m.index===4){const q=smooth(m.time/5);ctx.save();ctx.globalAlpha=Math.sin(q*Math.PI)*.8;ctx.fillStyle='#d9a85f';ctx.translate(730+q*180,430-Math.sin(q*Math.PI)*70);ctx.rotate(Math.sin(t*9)*.12);ctx.beginPath();ctx.ellipse(-4,-4,8,4,-.5,0,Math.PI*2);ctx.ellipse(5,-4,8,4,.5,0,Math.PI*2);ctx.fill();ctx.restore();}
  }else{
    const settling=smooth(state.age/2),base=735-12*(1-settling),eating=m.index>=5;
    // A âncora da cabeça e a base comuns impedem saltos entre as poses de comer.
    if(eating)actorPair(ctx,images,4,5,895,base,440*actorFactor,t);else actor(ctx,images,3,895,base,440*actorFactor,t);
    if(m.index<=4){const q=m.index===4?smooth(m.time/2):0;fairy(ctx,images,t,760+25*q,520+135*q,145*actorFactor);}
    else{
      actorPair(ctx,images,6,7,790,710,210*actorFactor,t+.4);
    }
  }
  ctx.restore();
  const done=state.story?.[m.end?'endingDone':'openingDone'],seen=state.story?.[m.end?'seenEnding':'seenOpening'];
  ctx.save();ctx.translate(safe.left,inset);const box=renderPoeticNarration(ctx,textCanvas,m.card.text+(done?'':'\n '),{heading:m.card.speaker});
  let skipBox=null;
  if(!done){
    const y=box.y+box.height-18*css;
    ctx.font=`600 ${12*css}px Georgia`;ctx.fillStyle='#846467';ctx.textAlign='center';
    ctx.fillText('Toque ou Enter para continuar',box.x-(seen?35*css:0),y,box.width-(seen?120:35)*css);
    if(seen){const x=box.x+box.width/2-45*css;ctx.fillText('Pular (S)',x,y);skipBox={x:safe.left+x-35*css,y:inset+y-17*css,w:70*css,h:28*css};}
  }
  ctx.restore();
  const alpha=Math.min(1,state.age/.45);
  if(alpha<1){ctx.fillStyle=`rgba(237,241,223,${1-alpha})`;ctx.fillRect(0,0,width,height);}
  ctx.restore();
  return{skip:skipBox};
}
