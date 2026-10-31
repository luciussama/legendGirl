import {DREAM_MUD_LAKES,mudActor,mudLakeAt,mudWaterline} from './DreamMud.js';
import {STEALTH_PLATFORMS,stealthGround,stealthPose} from './DreamStealthLevel.js';
import {prepareDreamRoach,drawDreamRoach,drawDreamRoachReach,destroyDreamRoach} from './DreamRoach.js';
import {DREAM_NIGHTMARE_ART as ART} from './DreamNightmareArt.js';
import {NIGHTMARE,NIGHTMARE_ROCKS,NIGHTMARE_INTRO,NIGHTMARE_WAKE,nightmarePatrol,nightmareLights,nightmareBeam,nightmareVisibility} from './DreamNightmare.js';
import {GARDEN_ART} from '../garden/GardenArt.js';
import {FEAR_FILES,FEAR_FRAMES} from '../garden/GardenFearArt.js';
import {CHAPTER_ART} from '../chapters/ChapterArt.js';
import {renderPoeticNarration} from '../narrative/PoeticNarrator.js';
import {getDialogueSafeArea} from '../ui/DialogueSafeArea.js';
import {beginDialogueFrame,endDialogueFrame} from '../narrative/DialogueFlow.js';
import {nightmareControls} from './DreamInput.js';
const root=new URL('../../../assets/art/',import.meta.url);
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};

/** Cena próxima em Canvas 2D; feixes e sombras usam as silhuetas da simulação, sem WebGL. */
export class DreamNightmareRenderer{
  constructor(canvas,shared){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.images=new Map();this.shared=shared;this.ready=false;this.disposed=false;this.loading=null;this.dark=new Map();}
  /** Carga ocorre somente ao entrar no último trecho, também ao restaurar um save nele. */
  load(){if(this.disposed)return Promise.resolve();if(this.loading)return this.loading;this.loading=(async()=>{
    const files=[ART.roach.file,ART.rocks.file,ART.wake.file,ART.fright.file,ART.stealth.file,ART.shelters.file,ART.hills.file,ART.lakes.file,ART.swim.file,ART.bankClimb.file,'dream-forest/chao-floresta-sombria-v1.png','dream-forest/floresta-azul-v1.png','garden/runtime/menina-corrida-v1.png','garden/runtime/menina-acoes-v1.png','garden/'+FEAR_FILES['menina-acoes-v1'],'garden/cinematic/piquenique-sem-yuna-v1.png','chapters/yuna-sono-v1.png','chapters/nanda-gestos-v1.png','toy-room/stage3/illustrated-fairy-v1.png'];
    await Promise.all(files.map(async file=>{let image=this.shared.get(file);if(!image){image=new Image();image.src=new URL(file,root).href;await image.decode();}if(!this.disposed)this.images.set(file,image);}));
    if(this.disposed)return;
    this.roach=prepareDreamRoach(this.images.get(ART.roach.file));
    const floor=this.images.get('dream-forest/chao-floresta-sombria-v1.png');this.floor=document.createElement('canvas');this.floor.width=floor.width;this.floor.height=floor.height;const groundPaint=this.floor.getContext('2d');groundPaint.drawImage(floor,0,0);groundPaint.globalCompositeOperation='destination-in';const blend=groundPaint.createLinearGradient(0,0,0,floor.height);blend.addColorStop(0,'rgba(0,0,0,0)');blend.addColorStop(.22,'#000');blend.addColorStop(1,'#000');groundPaint.fillStyle=blend;groundPaint.fillRect(0,0,floor.width,floor.height);const edges=groundPaint.createLinearGradient(0,0,floor.width,0);edges.addColorStop(0,'rgba(0,0,0,0)');edges.addColorStop(.12,'#000');edges.addColorStop(.88,'#000');edges.addColorStop(1,'rgba(0,0,0,0)');groundPaint.fillStyle=edges;groundPaint.fillRect(0,0,floor.width,floor.height);
    for(const file of ['garden/runtime/menina-corrida-v1.png','garden/runtime/menina-acoes-v1.png']){const image=this.images.get(file),canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);ctx.globalCompositeOperation='source-atop';ctx.fillStyle='rgba(12,25,46,.22)';ctx.fillRect(0,0,canvas.width,canvas.height);this.dark.set(file,canvas);}
    {const image=this.images.get(ART.stealth.file);this.warm=document.createElement('canvas');this.warm.width=image.width;this.warm.height=image.height;const ctx=this.warm.getContext('2d');ctx.drawImage(image,0,0);ctx.globalCompositeOperation='source-atop';ctx.fillStyle='rgba(255,210,132,.6)';ctx.fillRect(0,0,image.width,image.height);}
    {const f=ART.shelters.frames[2];this.hillCap=document.createElement('canvas');this.hillCap.width=f.w;this.hillCap.height=110;const ctx=this.hillCap.getContext('2d');ctx.drawImage(this.images.get(ART.shelters.file),f.x,f.y,f.w,110,0,0,f.w,110);ctx.globalCompositeOperation='destination-in';const fade=ctx.createLinearGradient(0,60,0,110);fade.addColorStop(0,'#000');fade.addColorStop(1,'transparent');ctx.fillStyle=fade;ctx.fillRect(0,0,f.w,110);}
    {const f=ART.hills.frames[0];this.hillPaint=document.createElement('canvas');this.hillPaint.width=f.w;this.hillPaint.height=f.h;const ctx=this.hillPaint.getContext('2d');ctx.drawImage(this.images.get(ART.hills.file),f.x,f.y,f.w,f.h,0,0,f.w,f.h);ctx.globalCompositeOperation='destination-in';const fade=ctx.createLinearGradient(0,0,0,f.h);fade.addColorStop(0,'#000');fade.addColorStop(.62,'#000');fade.addColorStop(1,'transparent');ctx.fillStyle=fade;ctx.fillRect(0,0,f.w,f.h);}
    this.ready=true;
  })().catch(e=>{this.error='Não foi possível abrir a floresta escura: '+e.message;throw e;});return this.loading;}
  /** Escala e altura constantes por viewport durante a furtividade; apenas a entrada faz o corte. */
  frame(s){const {width,height}=this.canvas,base=Math.min(width/650,height/960),scale=base*(s.stage==='NIGHTMARE_FALL'?.55+.45*smooth(s.age/1.8):1),left=Math.max(0,s.nightmare.x-width*.42/scale);return{scale,left,top:height*.82-NIGHTMARE.ground*scale};}
  /** A pose desenhada tem a mesma escala e as mesmas amostras opacas usadas pela detecção. */
  girl(ctx,s){const n=s.nightmare,fear=['NIGHTMARE_FINAL','NIGHTMARE_STRIKE','GAME_OVER'].includes(s.stage),moving=Math.abs(n.vx)>1;
    const wet=s.stage==='STEALTH'?mudActor(n):null;
    if(wet){const f=wet.frame;ctx.save();ctx.translate(wet.x,wet.y);ctx.scale(wet.facing*wet.scale,wet.scale);ctx.drawImage(this.images.get(wet.set.file),f.x,f.y,f.w,f.h,-wet.anchorX,-wet.anchorY,f.w,f.h);ctx.restore();return;}
    let set=GARDEN_ART.sets[moving?'menina-corrida-v1':'menina-acoes-v1'],index=moving?Math.floor(n.animTime)%8:7,file='garden/'+set.file,frame=set.frames[index],image=this.dark.get(file),referenceHeight=GARDEN_ART.referenceHeight;
    if(fear){if(s.stage==='NIGHTMARE_FINAL'&&s.age<2.7){file='garden/'+FEAR_FILES['menina-acoes-v1'];frame=FEAR_FRAMES['menina-acoes-v1'][[0,1,3,4][Math.floor(n.animTime)%4]];image=this.images.get(file);}else{const f=ART.fright.frames[s.stage==='NIGHTMARE_FINAL'&&s.age>4.4?1:0];frame={...f,anchorX:f.w/2};image=this.images.get(ART.fright.file);referenceHeight=ART.fright.referenceHeight;}}
    if(['STEALTH','NIGHTMARE_REVEAL'].includes(s.stage)){const f=ART.stealth.frames[stealthPose(n)];frame={...f,anchorX:f.w/2};image=this.images.get(ART.stealth.file);referenceHeight=ART.stealth.referenceHeight;}
    let x=n.x,y=n.y,angle=0;
    if(s.stage==='NIGHTMARE_FALL'){y-=620*(1-smooth(s.age/1.65));angle=-.14*(1-smooth(s.age/1.65));}
    if(s.stage==='NIGHTMARE_STRIKE'&&s.age>.72){const q=smooth((s.age-.72)/.7);x+=100*q;y-=Math.sin(q*Math.PI)*45;angle=q*.65;}
    ctx.save();ctx.translate(x,y);ctx.scale(n.facing,1);ctx.rotate(angle);const scale=NIGHTMARE.bodyHeight/referenceHeight;ctx.drawImage(image,frame.x,frame.y,frame.w,frame.h,-frame.anchorX*scale,-frame.h*scale,frame.w*scale,frame.h*scale);if(s.stage==='STEALTH'&&n.exposure>0){ctx.globalAlpha=Math.min(.85,n.exposure/.12);ctx.drawImage(this.warm,frame.x,frame.y,frame.w,frame.h,-frame.anchorX*scale,-frame.h*scale,frame.w*scale,frame.h*scale);}ctx.restore();
  }
  /** Pata pintada em primeiro plano alcança a menina no instante do golpe ou da captura final. */
  reach(ctx,s){const q=s.stage==='NIGHTMARE_FINAL'?smooth((s.age-4.4)/1.6):smooth((s.age-.15)/.57);drawDreamRoachReach(ctx,this.roach,nightmarePatrol(s.nightmare,s.stage,s.age),{x:s.nightmare.x,y:s.nightmare.y-65},q);}
  /** Fundo escuro, barata monumental e cones recortados; pedras ficam no plano intermediário e a menina permanece visível no caminho da frente. */
  forest(s,touch){const ctx=this.ctx,canvas=this.canvas,{width,height}=canvas,n=s.nightmare,frame=this.frame(s),background=this.images.get('dream-forest/floresta-azul-v1.png');
    const bgScale=Math.max(width/background.width,height/background.height);ctx.drawImage(background,(width-background.width*bgScale)/2,(height-background.height*bgScale)/2,background.width*bgScale,background.height*bgScale);ctx.fillStyle='rgba(1,5,15,.86)';ctx.fillRect(0,0,width,height);
    ctx.save();ctx.translate(-frame.left*frame.scale,frame.top);ctx.scale(frame.scale,frame.scale);
    const p=nightmarePatrol(n,s.stage,s.age),reaching=s.stage==='NIGHTMARE_FINAL'&&s.age>4.4||s.stage==='NIGHTMARE_STRIKE'&&s.age>.15;
    if(n.roachAppeared){ctx.globalAlpha=s.stage==='NIGHTMARE_REVEAL'?.8*smooth(s.age/3):.8;drawDreamRoach(ctx,this.roach,p,{reaching});ctx.globalAlpha=1;}
    const tile=1550,stride=1240;for(let i=Math.floor(frame.left/stride)-1;i<=Math.ceil((frame.left+width/frame.scale)/stride);i++)ctx.drawImage(this.floor,i*stride,450,tile,700);
    ctx.fillStyle='rgba(4,11,22,.28)';ctx.fillRect(frame.left,520,width/frame.scale,1000);
    const environment=this.images.get(ART.shelters.file),ledge=ART.shelters.frames[2],lakes=this.images.get(ART.lakes.file);
    for(const platform of STEALTH_PLATFORMS){
      // Massa contínua de terra, com a mesma crista física; sem ilha ou raízes suspensas.
      ctx.save();ctx.beginPath();ctx.moveTo(platform.from-90,850);ctx.lineTo(platform.from,stealthGround(platform.from));for(let x=platform.from+6;x<=platform.to+120;x+=6)ctx.lineTo(x,stealthGround(x));ctx.lineTo(platform.to+220,1150);ctx.lineTo(platform.from-180,1150);ctx.closePath();ctx.clip();ctx.drawImage(this.hillPaint,platform.from-100,platform.y-30,platform.to-platform.from+320,1180-platform.y);ctx.restore();
      ctx.drawImage(this.hillCap,platform.from-35,platform.y-22,platform.to-platform.from+70,110/ledge.h*235);
    }
    for(const lake of DREAM_MUD_LAKES){if(lake.paintX+lake.w<frame.left||lake.paintX>frame.left+width/frame.scale)continue;const f=ART.lakes.frames[lake.frame];ctx.drawImage(lakes,f.x,f.y,f.w,f.h,lake.paintX,lake.top,lake.w,lake.h);}
    const lights=nightmareLights(n,s.difficulty,s.stage,s.age);
    for(const light of lights){
      const beam=nightmareBeam(light),gradient=ctx.createRadialGradient(light.x,light.y,10,light.x,light.y,1500);gradient.addColorStop(0,'rgba(255,220,156,.5)');gradient.addColorStop(.5,'rgba(231,211,162,.28)');gradient.addColorStop(1,'rgba(189,199,179,0)');ctx.fillStyle=gradient;ctx.beginPath();beam.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill();
      const glow=ctx.createRadialGradient(light.x,light.y,0,light.x,light.y,25);glow.addColorStop(0,'#fff5cf');glow.addColorStop(.2,'#ffd385');glow.addColorStop(1,'rgba(255,177,59,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(light.x,light.y,25,0,Math.PI*2);ctx.fill();
    }
    // A sombra cai no piso próximo, antes da menina: o abrigo não apaga sua silhueta.
    for(const light of lights){
      ctx.save();ctx.beginPath();ctx.rect(frame.left,NIGHTMARE.rockGround-4,width/frame.scale,700);ctx.clip();ctx.beginPath();ctx.moveTo(light.x,light.y);for(const a of [light.angle-light.half,light.angle+light.half])ctx.lineTo(light.x+Math.cos(a)*NIGHTMARE.range,light.y+Math.sin(a)*NIGHTMARE.range);ctx.closePath();ctx.clip();ctx.fillStyle='rgba(0,3,12,.28)';
      for(const rock of NIGHTMARE_ROCKS){const sorted=rock.polygon.map(p=>({p,a:Math.atan2(p.y-light.y,p.x-light.x)})).sort((a,b)=>a.a-b.a),a=sorted[0],b=sorted.at(-1);if(b.a-a.a>Math.PI)continue;ctx.beginPath();ctx.moveTo(a.p.x,a.p.y);ctx.lineTo(b.p.x,b.p.y);ctx.lineTo(light.x+Math.cos(b.a)*NIGHTMARE.range,light.y+Math.sin(b.a)*NIGHTMARE.range);ctx.lineTo(light.x+Math.cos(a.a)*NIGHTMARE.range,light.y+Math.sin(a.a)*NIGHTMARE.range);ctx.closePath();ctx.fill();}
      ctx.restore();
    }
    const stones=this.images.get(ART.rocks.file);
    for(const r of NIGHTMARE_ROCKS){if(r.x+r.w/2<frame.left-30||r.x-r.w/2>frame.left+width/frame.scale+30)continue;const source=r.kind==='rock'?ART.rocks:ART.shelters,f=source.frames[r.frame];ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(r.x,r.base+4,r.w*.48,12,0,0,Math.PI*2);ctx.fill();ctx.drawImage(r.kind==='rock'?stones:environment,f.x,f.y,f.w,f.h,r.x-r.w/2,r.base-r.h,r.w,r.h);}
    // Yuna está do lado do jogador: nem pedra nem sombra voltam a cobrir a sua pintura.
    if(n.mudMode==='dry'&&!mudLakeAt(n.x)){const ground=stealthGround(n.x);ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(n.x,ground+2,32,6,0,0,Math.PI*2);ctx.fill();}
    this.girl(ctx,s);
    // A margem e a lama frontal são da mesma pintura; ocultam o corpo conforme o trajeto curvo.
    for(const lake of DREAM_MUD_LAKES){if(lake.paintX+lake.w<frame.left||lake.paintX>frame.left+width/frame.scale)continue;const f=ART.lakes.frames[lake.frame];ctx.save();ctx.beginPath();lake.path.forEach(([u,v],i)=>i?ctx.lineTo(lake.paintX+u*lake.w,lake.top+v*lake.h):ctx.moveTo(lake.paintX+u*lake.w,lake.top+v*lake.h));ctx.lineTo(lake.to,lake.top+lake.h);ctx.lineTo(lake.from,lake.top+lake.h);ctx.closePath();ctx.clip();ctx.drawImage(lakes,f.x,f.y,f.w,f.h,lake.paintX,lake.top,lake.w,lake.h);ctx.restore();}
    if(s.stage==='STEALTH'&&n.mudMode!=='dry'){const lake=DREAM_MUD_LAKES.find(l=>l.id===n.mudLakeId),surface=mudWaterline(lake,n.x),stroke=1+Math.min(1,Math.abs(n.vx)/78);ctx.strokeStyle='rgba(156,168,159,.35)';ctx.lineWidth=1.3;for(let i=0;i<2;i++){ctx.beginPath();ctx.ellipse(n.x-n.facing*(10+i*14),surface+4+i*2,12*stroke+i*8+Math.sin(n.time*3)*2,3+i,0,.12,Math.PI*1.8);ctx.stroke();}}

    if(s.stage==='NIGHTMARE_STRIKE'||s.stage==='NIGHTMARE_FINAL')this.reach(ctx,s);
    ctx.restore();
    const rect=canvas.getBoundingClientRect(),bar=document.querySelector('.top-controls-bar')?.getBoundingClientRect(),safe=getDialogueSafeArea(canvas),css=width/(canvas.clientWidth||width),titleY=Math.max(safe.top+24*css,bar?(bar.bottom-rect.top)*height/rect.height+24*css:0);
    ctx.textAlign='center';ctx.fillStyle='#c5c9d0';ctx.font=`${Math.min(17*css,width/27)}px Georgia,serif`;
    if(s.stage==='STEALTH'){const hidden=nightmareVisibility(n,s.difficulty).covered;ctx.fillText(n.mudMode==='climb'?'Apoie as mãos e suba a margem.':n.mudMode==='enter'?'A lama cede sob os pés.':n.mudMode==='swim'?(n.mudDepth>.94?'Sob a lama. Nade com ◀ / ▶; na margem, ↑ ou Espaço.':'Nade com ◀ / ▶. Pare para afundar; ↓ mantém o mergulho.'):hidden?'Junto ao abrigo. Espere a luz passar.':n.x>4400?'O lago é fundo. Entre devagar e nade até a margem.':'Espere a luz passar. Espaço para subir o relevo.',width/2,titleY,width-32*css);}
    if(s.stage==='NIGHTMARE_FINAL'&&s.age<4)ctx.fillText('Não havia mais onde se esconder.',width/2,titleY,width-32*css);
    if(s.stage==='NIGHTMARE_STRIKE'&&s.age>.72)ctx.fillText('A luz encontrou Yuna.',width/2,titleY,width-32*css);
    if(s.stage==='NIGHTMARE_INTRO')renderPoeticNarration(ctx,canvas,NIGHTMARE_INTRO[n.introIndex].text,{heading:NIGHTMARE_INTRO[n.introIndex].speaker,onAdvance:this.onAdvance,topInset:titleY-safe.top});
    if(s.stage==='STEALTH'&&touch)for(const name of ['left','right','down','jump']){const b=nightmareControls(canvas)[name];ctx.fillStyle='rgba(3,8,18,.85)';ctx.strokeStyle='#6f7b89';ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#e2dfd8';ctx.font=`${(name==='jump'||name==='down'?10:22)*css}px sans-serif`;ctx.fillText({left:'◀',right:'▶',down:'MERG.',jump:n.mudMode==='dry'?'PULAR':'SUBIR'}[name],b.x,b.y+7*css);}
    if(s.stage==='NIGHTMARE_FINAL'&&s.age>5.7){ctx.fillStyle=`rgba(0,0,0,${smooth((s.age-5.7)/.3)})`;ctx.fillRect(0,0,width,height);}
  }
  /** A captura corta diretamente para a mesma toalha; o grito precede o despertar de Nanda. */
  wake(s){const ctx=this.ctx,canvas=this.canvas,{width,height}=canvas,n=s.nightmare,safe=getDialogueSafeArea(canvas),css=width/(canvas.clientWidth||width),portrait=height>width;
    const zoom=s.stage==='NIGHTMARE_WAKE'?1+.025*(1-smooth(s.age/2)):1,scale=Math.max(width/1652,height/952)*zoom,half=width/scale/2,focus=Math.max(half,Math.min(1652-half,portrait?830:1030));
    ctx.save();ctx.scale(scale,scale);ctx.translate(width/scale/2-focus,0);ctx.drawImage(this.images.get('garden/cinematic/piquenique-sem-yuna-v1.png'),0,0,1652,952);
    const index=s.stage==='COMPLETE'?2:n.wakeIndex<1?0:n.wakeIndex===1?1:2,f=ART.wake.frames[index],actorScale=340/CHAPTER_ART.sleep.referenceHeight,shake=s.stage==='NIGHTMARE_WAKE'&&s.age<.4?Math.sin(s.age*38)*(1-s.age/.4)*3:0;
    ctx.drawImage(this.images.get(ART.wake.file),f.x,f.y,f.w,f.h,895-f.w*actorScale/2+shake,735-f.h*actorScale,f.w*actorScale,f.h*actorScale);
    const awake=n.fairyAwake?(s.stage==='COMPLETE'?1:smooth((s.age-.55)/1.4)):0,alpha=ctx.globalAlpha;
    if(awake<1){const f=CHAPTER_ART.fairy.frames[1],k=140/CHAPTER_ART.fairy.referenceHeight;ctx.globalAlpha=alpha*(1-awake);ctx.drawImage(this.images.get('chapters/nanda-gestos-v1.png'),f.x,f.y,f.w,f.h,700-f.w*k/2,710-f.h*k,f.w*k,f.h*k);ctx.globalAlpha=alpha;}
    if(awake>0){const image=this.images.get('toy-room/stage3/illustrated-fairy-v1.png'),h=145,k=h/image.height,beat=.75+.25*Math.abs(Math.sin(n.time*18));ctx.save();ctx.globalAlpha=awake;ctx.translate(700,650-120*awake+Math.sin(n.time*2)*4);const left=image.width*.24,right=image.width*.77;ctx.drawImage(image,left,0,right-left,image.height,(-image.width/2+left)*k,-h/2,(right-left)*k,h);ctx.drawImage(image,0,0,left,image.height,(-image.width/2+left-left*beat)*k,-h/2,left*k*beat,h);ctx.drawImage(image,right,0,image.width-right,image.height,(-image.width/2+right)*k,-h/2,(image.width-right)*k*beat,h);ctx.restore();}
    ctx.restore();
    if(s.stage==='NIGHTMARE_WAKE'&&n.wakeIndex>=0){const card=NIGHTMARE_WAKE[n.wakeIndex],rect=canvas.getBoundingClientRect(),bar=document.querySelector('.top-controls-bar')?.getBoundingClientRect(),topInset=portrait&&bar?(bar.bottom-rect.top)*height/rect.height-safe.top+12*css:0;renderPoeticNarration(ctx,canvas,card.text,{heading:card.speaker,onAdvance:this.onAdvance,topInset});}
  }
  render(s,{paused=false,touch=false,onAdvance=()=>{}}={}){const ctx=this.ctx,{width,height}=this.canvas;this.onAdvance=onAdvance;beginDialogueFrame(this.canvas);try{ctx.fillStyle='#030711';ctx.fillRect(0,0,width,height);if(!this.ready){ctx.fillStyle='#d7d1bf';ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillText(this.error||'Entrando na floresta escura…',width/2,height/2,width-30);return;}if(s.stage==='NIGHTMARE_WAKE'||s.stage==='COMPLETE')this.wake(s);else this.forest(s,touch);if(paused){ctx.fillStyle='rgba(2,5,14,.5)';ctx.fillRect(0,0,width,height);ctx.fillStyle='#ede5d6';ctx.font='20px sans-serif';ctx.textAlign='center';ctx.fillText('Pausa',width/2,height/2);}}finally{endDialogueFrame(this.canvas);}}
  destroy(){this.disposed=true;destroyDreamRoach(this.roach);this.roach=null;if(this.floor){this.floor.width=1;this.floor.height=1;}this.floor=null;if(this.warm){this.warm.width=1;this.warm.height=1;}this.warm=null;for(const c of [this.hillCap,this.hillPaint])if(c){c.width=1;c.height=1;}this.hillCap=null;this.hillPaint=null;this.images.clear();for(const c of this.dark.values()){c.width=1;c.height=1;}this.dark.clear();this.ready=false;}
}
