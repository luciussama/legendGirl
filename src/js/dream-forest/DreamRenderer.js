import {drawDreamClimb} from './DreamClimb.js';
import {prepareDreamIllustrations,drawDreamLeaf,drawDreamBee,drawDreamBranch,drawDreamWeb} from './DreamIllustratedSprites.js';
import {prepareDreamBeetle,drawDreamBeetle} from './DreamBeetle.js';
import {DREAM as C,DREAM_WIDTH,DREAM_SECTIONS,DREAM_BY_ID,dreamNearby,dreamObjectFrame,dreamGrassX} from './DreamLevel.js';
import {DREAM_CLIMB_CYCLE,DREAM_INSECTS,DREAM_LEAF,DREAM_BEE,DREAM_BRANCH,DREAM_SPIDER} from './DreamArt.js';
import {GARDEN_ART} from '../garden/GardenArt.js';
import {renderPoeticNarration} from '../narrative/PoeticNarrator.js';
import {beginDialogueFrame,endDialogueFrame} from '../narrative/DialogueFlow.js';
import {getDialogueSafeArea} from '../ui/DialogueSafeArea.js';
import {dreamControls} from './DreamInput.js';
import {DREAM_INTRO} from './DreamSimulation.js';
const root=new URL('../../../assets/art/',import.meta.url);
/** Canvas 2D: fundo pintado, recortes existentes e poucos objetos visíveis; sem filtros ou iluminação por pixel. */
export class DreamRenderer{
  constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.images=new Map();this.disposed=false;this.frames=0;}
  async load(){const files=[DREAM_LEAF.file,DREAM_BEE.file,DREAM_BRANCH.file,DREAM_SPIDER.file,'dream-forest/floresta-azul-v1.png',DREAM_CLIMB_CYCLE.file,...new Set(Object.values(DREAM_INSECTS).map(d=>'garden/'+d.file)),'garden/runtime/menina-corrida-v1.png','garden/runtime/menina-acoes-v1.png'];await Promise.all(files.map(async file=>{const image=new Image();image.src=new URL(file,root).href;await image.decode();if(!this.disposed)this.images.set(file,image);}));if(!this.disposed){this.beetleParts=prepareDreamBeetle(this.images.get('garden/source/besouro-camadas-v2.png'));this.illustrations=prepareDreamIllustrations(this.images.get(DREAM_LEAF.file),this.images.get(DREAM_BRANCH.file));}}
  /** Quadro vertical fixo por viewport; apenas a rolagem lateral acompanha Yuna. */
  frame(state){const {width,height}=this.canvas,safe=getDialogueSafeArea(this.canvas),scale=Math.min((safe.right-safe.left)/760,(safe.bottom-safe.top)/920),worldWidth=width/scale;return{scale,left:Math.max(0,Math.min(DREAM_WIDTH-worldWidth,state.player.x-worldWidth*.32)),top:(height-C.height*scale)/2};}
  /** Sprite registrado no relevo físico anterior, com caule pintado até fora da tela. */
  leaf(ctx,f,bottom=C.grassRoot){drawDreamLeaf(ctx,this.images.get(DREAM_LEAF.file),this.illustrations,f,bottom);}
  /** Caule contínuo: a base fica além da tela, sem encurtar a parte escalável da planta. */
  stem(ctx,f,bottom){const top=f.y+f.h-8,shade=ctx.createLinearGradient(f.x-10,top,f.x+18,bottom);shade.addColorStop(0,'#426f68');shade.addColorStop(.5,'#285357');shade.addColorStop(1,'#153c46');ctx.fillStyle=shade;ctx.beginPath();ctx.moveTo(f.x-3,top);ctx.bezierCurveTo(f.x-7,top+(bottom-top)*.25,f.x-15,bottom-100,f.x-20,bottom);ctx.lineTo(f.x+20,bottom);ctx.bezierCurveTo(f.x+15,bottom-100,f.x+7,top+(bottom-top)*.25,f.x+3,top);ctx.closePath();ctx.fill();}
  /** Haste preenchida e nervura natural, sem sobrepor indicador de colisão. */
  grass(ctx,f,bottom=C.grassRoot){this.stem(ctx,f,bottom);const n=12,shade=ctx.createLinearGradient(f.x-12,f.y,f.x+18,f.y+f.h);shade.addColorStop(0,'#b1d3ad');shade.addColorStop(.35,'#689c92');shade.addColorStop(1,'#214f5b');ctx.fillStyle=shade;ctx.beginPath();for(let i=0;i<=n;i++){const y=f.y+f.h*i/n,x=dreamGrassX(f,y),w=Math.sin(Math.PI*i/n)*12+2;ctx.lineTo(x-w,y);}for(let i=n;i>=0;i--){const y=f.y+f.h*i/n,x=dreamGrassX(f,y),w=Math.sin(Math.PI*i/n)*12+2;ctx.lineTo(x+w,y);}ctx.closePath();ctx.fill();ctx.strokeStyle='#a0cbc0';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=n;i++){const y=f.y+f.h*i/n;ctx.lineTo(dreamGrassX(f,y),y);}ctx.stroke();}
  insect(ctx,f,time){if(f.kind==='bee'){drawDreamBee(ctx,this.images.get(DREAM_BEE.file),f,time);return;}const d=DREAM_INSECTS[f.kind],image=this.images.get('garden/'+d.file);if(!image)return;if(f.kind==='beetle'){drawDreamBeetle(ctx,image,this.beetleParts,f,time);return;}const a=d.frame;ctx.drawImage(image,a.x,a.y,a.w,a.h,f.x,f.y,f.w,f.h);}
  girl(ctx,s){const p=s.player,height=C.bodyHeight;if(p.climb){drawDreamClimb(ctx,this.images.get(DREAM_CLIMB_CYCLE.file),s);return;}ctx.save();if(s.fallCause==='spider'&&s.stage==='FALLING')ctx.globalAlpha=Math.sin(s.age*45)>0?.45:1;ctx.translate(p.x,p.y);ctx.scale(p.facing,1);
  {const set=GARDEN_ART.sets[s.stage==='COMPLETE'||p.support&&Math.abs(p.vx)<1?'menina-acoes-v1':p.support?'menina-corrida-v1':'menina-acoes-v1'],frame=set.frames[s.stage==='COMPLETE'||p.support&&Math.abs(p.vx)<1?7:p.support?(Math.abs(p.vx)>1?Math.floor(p.animTime)%8:0):p.vy<0?1:3],image=this.images.get('garden/'+set.file),scale=height/frame.h;ctx.drawImage(image,frame.x,frame.y,frame.w,frame.h,-frame.w*scale/2,-height,frame.w*scale,height);}
  ctx.restore();}
  render(state,{ready=true,error=null,paused=false,onAdvance=()=>{},touch=false}={}){const canvas=this.canvas,ctx=this.ctx,{width,height}=canvas;beginDialogueFrame(canvas);try{
  this.frames++;const frame=this.frame(state),safe=getDialogueSafeArea(canvas),background=this.images.get('dream-forest/floresta-azul-v1.png');ctx.fillStyle='#0c1a35';ctx.fillRect(0,0,width,height);
  if(background){const scale=Math.max(width/background.width,height/background.height),w=background.width*scale,offset=-(w-width)/2-(state.player.x*.10)%(w*2);for(let i=-1;i<3;i++){ctx.save();ctx.translate(offset+i*w+(i%2?w:0),height/2);if(i%2)ctx.scale(-1,1);ctx.drawImage(background,0,-background.height*scale/2,w,background.height*scale);ctx.restore();}}
  if(!ready||error){ctx.fillStyle='#e2e9f1';ctx.font='18px sans-serif';ctx.textAlign='center';ctx.fillText(error||'A floresta está acordando…',width/2,height/2,width-40);return;}
  ctx.save();ctx.translate(-frame.left*frame.scale,frame.top);ctx.scale(frame.scale,frame.scale);let count=0;
  for(const o of dreamNearby(frame.left-400,frame.left+width/frame.scale+400)){const f=dreamObjectFrame(o,state.time,state.rides);if(f.x+f.w<frame.left-200||f.x>frame.left+width/frame.scale+200)continue;if(f.kind==='grass')this.grass(ctx,f,Math.max(C.grassRoot,(height-frame.top)/frame.scale+200));else if(f.kind==='leaf')this.leaf(ctx,f,Math.max(C.grassRoot,(height-frame.top)/frame.scale+200));else if(f.kind==='web')drawDreamWeb(ctx,this.images.get(DREAM_SPIDER.file),f,state.time);else if(f.kind==='branch')drawDreamBranch(ctx,this.images.get(DREAM_BRANCH.file),this.illustrations,f,Math.max(C.grassRoot,(height-frame.top)/frame.scale+200),-frame.top/frame.scale-150);else this.insect(ctx,f,state.time);count++;}
  if(state.stage!=='RESCUING')this.girl(ctx,state);ctx.restore();this.visibleObjects=count;
  // Brumas e vaga-lumes são limitados a poucas formas, sem sombras dinâmicas nem buffers por quadro.
  ctx.fillStyle='rgba(100,142,198,.08)';ctx.fillRect(0,height*.68,width,height*.32);for(let i=0;i<14;i++){ctx.globalAlpha=.25+.25*Math.sin(state.time+i);ctx.fillStyle='#b7d9d5';ctx.beginPath();ctx.arc((i*139-state.player.x*.06+Math.sin(state.time*.4+i)*15+width*10)%width,height*(.18+(i%6)*.12),1.6,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
  const section=[...DREAM_SECTIONS].reverse().find(d=>state.player.x>=d.start)||DREAM_SECTIONS[0],font=Math.min(18,width/30);ctx.font=`${font}px Georgia,serif`;ctx.textAlign='center';ctx.fillStyle='#e1dfe8';const rect=canvas.getBoundingClientRect(),bar=globalThis.document?.querySelector('.top-controls-bar')?.getBoundingClientRect(),titleY=Math.max(safe.top+22,bar?(bar.bottom-rect.top)*height/rect.height+22:0);ctx.fillText(section.name,width/2,titleY,width-45);
  const riding=DREAM_BY_ID.get(state.player.support||state.player.climb?.id),rideFrame=riding?.flight?dreamObjectFrame(riding,state.time,state.rides):null;
  if(rideFrame&&state.stage==='RUNNING'){ctx.font=`${Math.max(11,font*.8)}px sans-serif`;ctx.fillText(rideFrame.flightPhase==='ARRIVED'?'O próximo apoio está perto. Prepare o salto.':'Deixe o besouro levar você até o próximo apoio.',width/2,titleY+24,width-40);}
  if(section.kind==='web'&&state.stage==='RUNNING'){ctx.font=`${Math.max(11,font*.8)}px sans-serif`;ctx.fillText('Escale as teias. Evite tocar nas aranhas.',width/2,titleY+24,width-40);}
  if(state.stage==='INTRO')renderPoeticNarration(ctx,canvas,DREAM_INTRO[state.story.index],{heading:'JARDIM DOS SONHOS',advanceCanvas:canvas,onAdvance});
  else if(state.stage==='COMPLETE'&&state.age<7)renderPoeticNarration(ctx,canvas,'Entre as folhas, o vento encontrou\num lugar para descansar.',{heading:'ENTRE OS GALHOS',advanceCanvas:canvas,onAdvance});
  else if(state.stage==='FALLING'){ctx.fillStyle='#e8d9ed';ctx.fillText(state.fallCause==='spider'?'A aranha alcançou Yuna!':'O sonho perdeu o chão…',width/2,height*.45,width-40);}
  if(touch&&state.stage==='RUNNING'){for(const [name,b] of Object.entries(dreamControls(canvas))){ctx.fillStyle='rgba(9,22,45,.72)';ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(186,217,224,.55)';ctx.stroke();ctx.fillStyle='#e0eded';ctx.font=`${name==='jump'?12:22}px sans-serif`;ctx.fillText({left:'◀',right:'▶',up:'▲',down:'▼',jump:'PULAR'}[name],b.x,b.y+6);}}
  if(state.stage==='RESCUING'){ctx.fillStyle=`rgba(15,30,65,${Math.sin(Math.min(1,state.age/1.1)*Math.PI)*.9})`;ctx.fillRect(0,0,width,height);}
  if(paused){ctx.fillStyle='rgba(8,16,34,.5)';ctx.fillRect(0,0,width,height);ctx.fillStyle='#edf2f7';ctx.fillText('Pausa',width/2,height/2);}
  }finally{endDialogueFrame(canvas);}}
  destroy(){this.disposed=true;if(this.beetleParts){this.beetleParts.body.width=0;for(const p of this.beetleParts.parts)p.bitmap.width=0;}this.beetleParts=null;if(this.illustrations){for(const bitmap of [...this.illustrations.leaves.values(),...this.illustrations.branches.values()])bitmap.width=0;}this.illustrations=null;this.images.clear();}
}
