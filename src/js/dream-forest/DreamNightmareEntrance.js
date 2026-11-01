import {DREAM_NIGHTMARE_ART as ART} from './DreamNightmareArt.js';
import {NIGHTMARE_INTRO} from './DreamNightmare.js';
import {dreamRoachPose,drawDreamRoach} from './DreamRoach.js';
import {drawRoachDust,roachScreenShake} from './DreamRoachEffects.js';
import {drawNightmareCinematicGirl} from './DreamNightmareCinematic.js';
import {renderPoeticNarration} from '../narrative/PoeticNarrator.js';
import {getDialogueSafeArea} from '../ui/DialogueSafeArea.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
/** Chegada em terra, olhares, saída das árvores, susto e corrida até o primeiro abrigo. */
export function nightmareEntranceMoment(s){const age=s.age;if(s.stage==='NIGHTMARE_FALL')return{shot:'arrival',progress:smooth(age/1.8)};if(s.stage==='NIGHTMARE_INTRO')return{shot:s.nightmare.introIndex?'smell':'look',progress:smooth(s.nightmare.introAge/3)};return{shot:age<2.4?'emerge':age<3.8?'reaction':age<5.2?'escape':'hide',progress:smooth((age-3.8)/1.4)};}
function foregroundTrees(ctx,image){ctx.save();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(430,0);ctx.lineTo(325,310);ctx.lineTo(360,560);ctx.lineTo(520,820);ctx.lineTo(530,1024);ctx.lineTo(0,1024);ctx.closePath();ctx.moveTo(1180,0);ctx.lineTo(1536,0);ctx.lineTo(1536,1024);ctx.lineTo(1250,1024);ctx.lineTo(1120,760);ctx.lineTo(1190,480);ctx.closePath();ctx.clip();ctx.drawImage(image,0,0,1536,1024);ctx.restore();}
/** Planos em camadas, fora do enquadramento jogável, conservando a moldura de leitura do projeto. */
export function renderNightmareEntrance(ctx,canvas,s,images,rig,{onAdvance=()=>{}}={}){
 const {width,height}=canvas,n=s.nightmare,m=nightmareEntranceMoment(s),portrait=height>width,reveal=s.stage==='NIGHTMARE_REVEAL',escape=m.shot==='escape'||m.shot==='hide',x=escape?850+190*m.progress:m.shot==='arrival'?720+100*m.progress:s.stage==='NIGHTMARE_INTRO'?820+30*smooth(n.arrivalAge/3):850,focus=portrait?x:820,scale=Math.max(width/1536,height/1024),bg=images.get(ART.cinematicForest.file),shake=reveal?roachScreenShake(n.time,140):{x:0,y:0};
 ctx.save();ctx.translate(width/2+shake.x*width/(canvas.clientWidth||width),height/2+shake.y*width/(canvas.clientWidth||width));ctx.scale(scale,scale);const half=width/scale/2,halfH=height/scale/2,focusY=Math.max(halfH,Math.min(1024-halfH,portrait?512:620));ctx.translate(-Math.max(half,Math.min(1536-half,focus)),-focusY);ctx.drawImage(bg,0,0,1536,1024);
 if(reveal){const q=smooth(s.age/2.4),p={x:560+70*q,y:300+25*q,width:1000+900*q,pose:dreamRoachPose(n.time,140),velocity:140};ctx.save();ctx.globalAlpha=smooth(s.age/1.3);drawDreamRoach(ctx,rig,p);drawRoachDust(ctx,rig,p,n.time);ctx.restore();foregroundTrees(ctx,bg);}
 const image=images.get(ART.cinematicGirl.file),standingHeight=!portrait&&s.stage==='NIGHTMARE_INTRO'?300:440;
 if(m.shot==='hide'){const f=ART.stealth.frames[0],k=standingHeight/ART.stealth.referenceHeight;ctx.save();ctx.filter='brightness(.72)';ctx.drawImage(images.get(ART.stealth.file),f.x,f.y,f.w,f.h,x-f.w*k/2,950-f.h*k,f.w*k,f.h*k);ctx.restore();}
 else{const walking=m.shot==='arrival'||m.shot==='escape'||s.stage==='NIGHTMARE_INTRO'&&n.arrivalAge<3,index=walking?Math.floor((m.shot==='escape'?s.age*9:n.arrivalAge*3))%2:m.shot==='reaction'?(s.age<2.9?2:3):2;drawNightmareCinematicGirl(ctx,image,index,x,920,standingHeight,n.time+n.introAge,{walking});}
 if(reveal){const f=ART.rocks.frames[0];ctx.drawImage(images.get(ART.rocks.file),f.x,f.y,f.w,f.h,860,660,440,290);}
 ctx.restore();
 if(s.stage==='NIGHTMARE_INTRO'){const card=NIGHTMARE_INTRO[n.introIndex],safe=getDialogueSafeArea(canvas),rect=canvas.getBoundingClientRect(),bar=document.querySelector('.top-controls-bar')?.getBoundingClientRect(),css=width/(canvas.clientWidth||width),topInset=bar?Math.max(0,(bar.bottom-rect.top)*height/rect.height+12*css-safe.top):0;renderPoeticNarration(ctx,canvas,card.text,{heading:card.speaker,onAdvance,topInset});}
}
