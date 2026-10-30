import {gardenDefeatFrame} from './GardenDefeatPresentation.js';
import {beginDialogueFrame,endDialogueFrame} from '../narrative/DialogueFlow.js';
import {drawGardenBeetle} from './GardenBeetleRenderer.js';
import {drawGardenBee} from './GardenBeeRenderer.js';
import {GARDEN_PICNIC} from './GardenPicnicArt.js';
import {renderGardenCinematic} from './GardenCinematic.js';
import {FEAR_FILES,FEAR_FRAMES} from './GardenFearArt.js';
import {INSECT_FRAMES} from './GardenInsectArt.js';
import {gardenGirlPose} from './GardenContact.js';
import {GARDEN as C,GARDEN_HOME,gardenPlatforms,gardenSurfaceY,GARDEN_CHECKPOINTS,GARDEN_WHEEL,GARDEN_WHEELS,GARDEN_WATERS,GARDEN_SECTIONS,GARDEN_PLATFORM_BY_ID,cloudStatus,gardenSection} from './GardenLevel.js';
import {AQUATIC_FRAMES} from './GardenVisualArt.js';
import {GARDEN_ART} from './GardenArt.js';
import {getDialogueSafeArea} from '../ui/DialogueSafeArea.js';
import {renderPoeticNarration} from '../narrative/PoeticNarrator.js';
import {gardenControls} from './GardenInput.js';
const root=new URL('../../../assets/art/garden/',import.meta.url);
const surfaceOffset={soil:18,grass:90,gravel:10,wood:10};
const riverBedY=C.waterY+75;
const fairyFile='../toy-room/stage3/illustrated-fairy-v1.png';
// A pintura encosta nas margens; os limites fatais continuam em GARDEN_WATERS.
const waterPaint=GARDEN_WATERS.map(water=>{
  const grounds=[...GARDEN_PLATFORM_BY_ID.values()].filter(p=>p.ground);
  const before=grounds.filter(p=>p.x+p.w<=water.x).sort((a,b)=>(b.x+b.w)-(a.x+a.w))[0];
  const after=grounds.filter(p=>p.x>=water.x+water.w).sort((a,b)=>a.x-b.x)[0];
  const left=before&&water.x-before.x-before.w<80?before.x+before.w:water.x;
  const right=after&&after.x-water.x-water.w<80?after.x:water.x+water.w;
  return {...water,x:left-10,w:right-left+20};
});
/** Ilustrações de produção, sem desenhar superfícies auxiliares de contato. */
export class GardenRenderer {
  constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.images=new Map();this.patterns=new Map();this.sceneryItems=this.sceneryLayout();this.disposed=false;}
  async load(){
    const response=await fetch(new URL('manifest.json',root));if(!response.ok)throw Error('Manifesto do jardim indisponível.');
    const manifest=await response.json(),required=['../chapters/yuna-sono-v1.png','../chapters/nanda-gestos-v1.png','cenario-v1.png','source/parede-vegetal-v1.png','runtime/vida-aquatica-v1.png','runtime/insetos-v1.png','cinematic/casa-sem-atores-v1.png','cinematic/piquenique-sem-yuna-v1.png','runtime/cinematic-atuacao-v1.png','source/abelha-camadas-v2.png','source/besouro-camadas-v2.png',GARDEN_PICNIC.file,...Object.values(FEAR_FILES),...Object.values(GARDEN_ART.sets).map(s=>s.file),fairyFile];
    if(!Array.isArray(manifest.images)||required.some(file=>!manifest.images.includes(file)))throw Error('Manifesto do jardim incompleto.');
    await Promise.all(manifest.images.map(async file=>{const image=new Image();image.src=new URL(file,root).href;await image.decode();if(!image.naturalWidth)throw Error('Arte vazia no jardim: '+file);if(!this.disposed)this.images.set(file,image);}));
    if(!this.disposed){const warm=document.createElement('canvas').getContext('2d');for(const p of GARDEN_PLATFORM_BY_ID.values())if(p.hill){this.groundSurface(warm,p,true,true);if(p.type==='grass')this.groundSurface(warm,{...p,type:'soil'},true,true);for(const patch of p.grassPatches??[])this.groundSurface(warm,{...p,type:'grass',patchX:p.x+p.w*patch.start,patchWidth:p.w*(patch.end-patch.start)},true,true);}}
  }
  controls(){return gardenControls(this.canvas,getDialogueSafeArea(this.canvas));}
  /** Somente x acompanha a menina; pulo, terreno e apoio não mudam altura ou escala. */
  frame(state){const {width,height}=this.canvas,safe=getDialogueSafeArea(this.canvas),scale=Math.min((safe.right-safe.left)/680,(safe.bottom-safe.top)/690),worldWidth=width/scale;return{scale,ox:Math.max(0,Math.min(C.width-worldWidth,state.player.x-worldWidth*.36)),oy:(height>width?height*.70:height*.81)-C.ground*scale};}
  sprite(ctx,set,index,x,y,height,flip=1,fear=false,agitation=0,reaction=0){
    const def=GARDEN_ART.sets[set],f=(fear?FEAR_FRAMES[set]:def.frames)[index],image=this.images.get(fear?FEAR_FILES[set]:def.file);if(!image)return;
    const scale=height/GARDEN_ART.referenceHeight;ctx.save();ctx.translate(x,y);ctx.scale(flip,1);
    if(fear||reaction){
      // Só o tronco oscila: pernas e sapatos conservam a posição física exata.
      const cut=Math.floor(f.h*.58),base=(-f.anchorY+cut)*scale;
      ctx.drawImage(image,f.x,f.y+cut,f.w,f.h-cut,-f.anchorX*scale,base,f.w*scale,(f.h-cut)*scale);
      ctx.translate(0,base);ctx.rotate(agitation+reaction);ctx.drawImage(image,f.x,f.y,f.w,cut,-f.anchorX*scale,-cut*scale,f.w*scale,cut*scale);
    }else ctx.drawImage(image,f.x,f.y,f.w,f.h,-f.anchorX*scale,-f.anchorY*scale,f.w*scale,f.h*scale);
    ctx.restore();
  }
  prop(ctx,index,x,y,w,h,setName='objetos'){const set=GARDEN_ART.sets[setName],f=set.frames[index],image=this.images.get(set.file);if(image)ctx.drawImage(image,f.x,f.y,f.w,f.h,x,y,w,h??w*f.h/f.w);}
  /** Só o miolo da pintura se repete; a massa do chão não tem laterais internas. */
  groundPattern(type){
    if(this.patterns.has(type))return this.patterns.get(type);
    if(type==='soil'||type==='riverbed'){const image=this.images.get(type==='soil'?'source/parede-vegetal-v1.png':'source/terra-continua-v1.png');if(!image)return null;const tile=document.createElement('canvas');tile.width=tile.height=320;tile.getContext('2d').drawImage(image,0,0,320,320);const pattern=this.ctx.createPattern(tile,'repeat');this.patterns.set(type,pattern);return pattern;}
    const set=GARDEN_ART.sets.objetos,frame=set.frames[type==='wood'?1:type==='rock'?2:0],image=this.images.get(set.file);
    if(!image)return null;
    const tile=document.createElement('canvas');
    const sw=Math.round(frame.w*.55),sh=Math.round(frame.h*.3);
    tile.width=sw*2;tile.height=sh*2;const paint=tile.getContext('2d');
    // Madeira e pedra usam detalhes nativos, preparados uma vez na carga.
    for(const flipX of [0,1])for(const flipY of [0,1]){
      paint.save();paint.translate(flipX?tile.width:0,flipY?tile.height:0);paint.scale(flipX?-1:1,flipY?-1:1);
      paint.drawImage(image,frame.x+frame.w*.22,frame.y+frame.h*.45,sw,sh,0,0,sw,sh);paint.restore();
    }
    const pattern=this.ctx.createPattern(tile,'repeat');this.patterns.set(type,pattern);return pattern;
  }
  /** O mesmo contorno recorta a vegetação e exclui água frontal. */
  groundOutline(ctx,p,bottom){
    const all=[...GARDEN_PLATFORM_BY_ID.values()],joinedLeft=all.some(v=>v.ground&&v!==p&&Math.abs(v.x+v.w-p.x)<1),joinedRight=all.some(v=>v.ground&&v!==p&&Math.abs(v.x-p.x-p.w)<1);
    ctx.moveTo(p.x,p.y-150-(p.hill??0));ctx.lineTo(p.x+p.w,p.y-150-(p.hill??0));
    for(let y=p.y-10;y<=bottom;y+=28)ctx.lineTo(p.x+p.w+(joinedRight?0:Math.sin(y*.11+p.x)*3-3),y);
    ctx.lineTo(p.x+p.w,bottom+20);ctx.lineTo(p.x,bottom+20);
    for(let y=bottom;y>=p.y-10;y-=28)ctx.lineTo(p.x+(joinedLeft?0:Math.sin(y*.09+p.x)*3+3),y);
    ctx.closePath();return{joinedLeft:joinedLeft&&all.some(v=>v.ground&&Math.abs(v.x+v.w-p.x)<1&&v.y===p.y),joinedRight:joinedRight&&all.some(v=>v.ground&&Math.abs(v.x-p.x-p.w)<1&&v.y===p.y)};
  }
  /** Folhagem baixa dissolvida na parede vegetal; grama sem placa terrosa. */
  surfaceTile(type,part='middle'){
    const key='surface-'+type+'-'+part;if(this.patterns.has(key))return this.patterns.get(key);
    const setName=type==='grass'||type==='gravel'?'ambiente':'objetos',index=type==='grass'?1:type==='gravel'?2:type==='wood'?1:0;
    const set=GARDEN_ART.sets[setName],f=set.frames[index],image=this.images.get(set.file);if(!image)return null;
    const tile=document.createElement('canvas'),h=type==='wood'?80:type==='soil'?60:110;tile.width=part==='middle'?220:48;tile.height=h;
    const ctx=tile.getContext('2d'),sx=f.x+f.w*(part==='left'?0:part==='right'?.8:.2),sw=f.w*(part==='middle'?.6:.2);
    if(type==='gravel')for(let i=0;i<3;i++)ctx.drawImage(image,f.x+f.w*.2,f.y,f.w*.2,f.h,i*tile.width/3,0,tile.width/3,h);
    else ctx.drawImage(image,sx,f.y,sw,type==='soil'?f.h*.55:f.h,0,0,tile.width,h);
    // A grama conserva só plantas: elimina sua antiga placa de terra na carga.
    if(type==='grass'){const pixels=ctx.getImageData(0,0,tile.width,h);for(let y=45;y<h;y++)for(let x=0;x<tile.width;x++){const k=(y*tile.width+x)*4,r=pixels.data[k],g=pixels.data[k+1],b=pixels.data[k+2];if(g<r*1.04||g<b*1.12)pixels.data[k+3]=0;}ctx.putImageData(pixels,0,0);}
    const fade=ctx.createLinearGradient(0,0,0,h);fade.addColorStop(0,'#fff');fade.addColorStop(type==='grass'?.74:.4,'#fff');fade.addColorStop(type==='grass'?.85:1,'rgba(255,255,255,0)');ctx.globalCompositeOperation='destination-in';ctx.fillStyle=fade;ctx.fillRect(0,0,tile.width,h);
    this.patterns.set(key,tile);return tile;
  }
  /** Apenas a pintura acompanha o apoio físico; a câmera e os saltos permanecem intactos. */
  groundSurface(ctx,p,joinedLeft,joinedRight){
    const tile=this.surfaceTile(p.type);if(!tile)return;const y=p.y-surfaceOffset[p.type],cap=48;
    if(p.hill){
      const paintLeft=p.patchX??p.x,paintWidth=p.patchWidth??p.w,key='curve-'+p.id+'-'+p.type+'-'+p.w+'-'+p.hill+'-'+(p.waves??1)+'-'+paintLeft+'-'+paintWidth;
      let curve=this.patterns.get(key);
      if(!curve){
        curve=document.createElement('canvas');curve.width=Math.ceil(paintWidth)+2;curve.height=Math.ceil(p.hill+tile.height+2);
        const paint=curve.getContext('2d');
        for(let x=0;x<paintWidth;x+=2){const width=Math.min(2,paintWidth-x),sx=(((paintLeft+x)%220)+220)%220;if(p.patchWidth)paint.globalAlpha=Math.max(0,Math.min(1,(x+1)/12,(paintWidth-x)/12));
          paint.drawImage(tile,sx,0,Math.min(width+.25,220-sx),tile.height,x,gardenSurfaceY(p,paintLeft+x+width/2)-p.y+p.hill,width+.25,tile.height);
        }
        this.patterns.set(key,curve);
      }
      ctx.drawImage(curve,paintLeft,p.y-p.hill-surfaceOffset[p.type]);return;
    }

    const start=p.x+(joinedLeft?0:cap),end=p.x+p.w-(joinedRight?0:cap);
    ctx.save();ctx.beginPath();ctx.rect(start,y,Math.max(0,end-start),tile.height);ctx.clip();
    for(let x=Math.floor(p.x/220)*220;x<p.x+p.w;x+=220)ctx.drawImage(tile,x,y,220,tile.height);
    ctx.restore();
    for(const [open,side]of [[!joinedLeft,-1],[!joinedRight,1]])if(open){const endTile=this.surfaceTile(p.type,side<0?'left':'right');ctx.drawImage(endTile,side<0?p.x:p.x+p.w-cap,y,cap,tile.height);}
  }
  /** A parede vegetal é pintada de uma vez, sem frestas entre patamares. */
  terrainBodies(ctx,platforms,bottom){
    for(const wood of [false,true]){
      const grounds=platforms.filter(p=>p.ground&&(p.type==='wood')===wood);if(!grounds.length)continue;
      ctx.save();ctx.beginPath();for(const p of grounds)this.groundOutline(ctx,p,bottom);ctx.clip();ctx.beginPath();
      for(const p of grounds){ctx.moveTo(p.x-.6,p.y+2);if(p.hill){for(let x=p.x;x<p.x+p.w;x+=8)ctx.lineTo(x,gardenSurfaceY(p,x)+2);}ctx.lineTo(p.x+p.w+.6,p.y+2);ctx.lineTo(p.x+p.w+.6,bottom+20);ctx.lineTo(p.x-.6,bottom+20);ctx.closePath();}
      ctx.clip();ctx.fillStyle=wood?'#89532f':'#335a22';ctx.fillRect(grounds[0].x-2,0,grounds.at(-1).x+grounds.at(-1).w-grounds[0].x+4,bottom+20);
      const pattern=this.groundPattern(wood?'wood':'soil');if(pattern){ctx.globalAlpha=wood?.65:1;ctx.fillStyle=pattern;ctx.fillRect(grounds[0].x-2,0,grounds.at(-1).x+grounds.at(-1).w-grounds[0].x+4,bottom+20);}ctx.restore();
    }
  }
  terrain(ctx,p,bottom,body=true){
    if(p.ground){
      if(body)this.terrainBodies(ctx,[p],bottom);
      ctx.save();ctx.beginPath();const {joinedLeft,joinedRight}=this.groundOutline(ctx,p,bottom);ctx.clip();if(p.type==='grass')this.groundSurface(ctx,{...p,type:'soil'},joinedLeft,joinedRight);this.groundSurface(ctx,p,joinedLeft,joinedRight);for(const patch of p.grassPatches??[])this.groundSurface(ctx,{...p,type:'grass',patchX:p.x+p.w*patch.start,patchWidth:p.w*(patch.end-patch.start)},true,true);ctx.restore();
    }else if(p.aerial&&p.type==='gravel'){
      const set=GARDEN_ART.sets.objetos,f=set.frames[0],image=this.images.get(set.file);ctx.save();ctx.beginPath();ctx.moveTo(p.x,p.y-15);ctx.lineTo(p.x+p.w,p.y-15);ctx.lineTo(p.x+p.w,p.y+30);ctx.quadraticCurveTo(p.x+p.w*.8,p.y+72,p.x+p.w*.5,p.y+65);ctx.quadraticCurveTo(p.x+p.w*.2,p.y+72,p.x,p.y+30);ctx.closePath();ctx.clip();
      if(image)ctx.drawImage(image,f.x,f.y+f.h*.45,f.w,f.h*.55,p.x,p.y+3,p.w,65);this.groundSurface(ctx,p,true,true);ctx.restore();
    }else{if(p.type==='stone')this.rockFoot(ctx,p,bottom);this.prop(ctx,{wood:1,stone:2,cloud:3}[p.type],p.x,p.y-(p.type==='wood'?8:p.type==='stone'?3:6),p.w,p.type==='wood'?53:p.type==='stone'?70:60);}
  }

  /** Recortes aquáticos são decoração, nunca apoios ou colisores. */
  aquaticSprite(ctx,index,x,y,w,h,flip=1){
    const image=this.images.get('runtime/vida-aquatica-v1.png'),f=AQUATIC_FRAMES[index];if(!image)return;
    ctx.save();ctx.translate(x,y);ctx.scale(flip,1);ctx.drawImage(image,f.x,f.y,f.w,f.h,flip<0?-w:0,0,w,h??w*f.h/f.w);ctx.restore();
  }
  /** Pilar contínuo do tampo até o leito; a parte submersa recebe a água frontal. */
  rockFoot(ctx,p){
    const top=p.y+26,height=riverBedY-top+12;
    const image=this.images.get('runtime/vida-aquatica-v1.png'),f=AQUATIC_FRAMES[0];if(image)ctx.drawImage(image,f.x,f.y+f.h*.16,f.w,f.h*.84,p.x+p.w*.03,top,p.w*.94,height);
  }
  /** Poucos peixes por rio; plantas e leito estáticos, sem partículas ou filtros. */
  riverLife(ctx,s,water,left,right,bottom){
    const x0=Math.max(water.x,left),x1=Math.min(water.x+water.w,right);if(x1<=x0)return;
    ctx.save();ctx.beginPath();ctx.rect(x0,C.waterY-30,x1-x0,bottom-C.waterY+30);ctx.clip();
    const bed=ctx.createLinearGradient(0,riverBedY-5,0,riverBedY+35);bed.addColorStop(0,'#669a8e');bed.addColorStop(1,'#467d7b');ctx.fillStyle=bed;ctx.fillRect(x0,riverBedY,x1-x0,bottom-riverBedY);
    const gravel=this.groundPattern('riverbed');if(gravel){ctx.globalAlpha=.22;ctx.fillStyle=gravel;ctx.fillRect(x0,riverBedY,x1-x0,bottom-riverBedY);ctx.globalAlpha=1;}
    const edge=ctx.createLinearGradient(0,riverBedY-8,0,riverBedY+12);edge.addColorStop(0,'rgba(85,157,161,0)');edge.addColorStop(.5,'rgba(85,157,161,.6)');edge.addColorStop(1,'rgba(85,157,161,0)');ctx.fillStyle=edge;ctx.fillRect(x0,riverBedY-8,x1-x0,20);
    const count=Math.max(2,Math.min(5,Math.floor(water.w/220)));
    for(let i=0;i<count;i++){
      const anchor=water.x+water.w*(i+1)/(count+1),phase=s.time*.35+i*2.1+water.x*.01,x=anchor+Math.sin(phase)*35,y=C.waterY+6+(i%3)*17+Math.sin(phase*1.7)*3;
      if(x>=left-30&&x<=right+30){const flip=Math.cos(phase)<0?-1:1;ctx.globalAlpha=.82;this.aquaticSprite(ctx,1+i%3,x,y,24,11,flip);}
    }
    ctx.globalAlpha=.65;
    for(let x=water.x+65,i=0;x<water.x+water.w-30;x+=210,i++)if(x>left-40&&x<right+40)this.aquaticSprite(ctx,4+i%2,x,riverBedY-(i%2?30:44),i%2?25:21,i%2?30:44);
    ctx.restore();
  }
  /** Água de primeiro plano envolve bases/margens em vez de deixar rochas flutuando. */
  waterFront(ctx,s,left,right,bottom,platforms){
    ctx.save();
    for(const ground of platforms.filter(p=>p.ground)){
      ctx.beginPath();ctx.rect(left,C.waterY-40,right-left,bottom-C.waterY+60);this.groundOutline(ctx,ground,bottom);ctx.clip('evenodd');
    }
    for(const water of waterPaint){if(water.x+water.w<left||water.x>right)continue;
      const wash=ctx.createLinearGradient(0,C.waterY-30,0,C.waterY+70);wash.addColorStop(0,'rgba(112,213,217,.38)');wash.addColorStop(1,'rgba(50,137,169,.38)');ctx.fillStyle=wash;ctx.fillRect(water.x-5,C.waterY-30,water.w+10,bottom-C.waterY+30);
      this.riverLife(ctx,s,water,left,right,bottom);
      for(const p of platforms.filter(p=>p.type==='stone'&&p.x>=water.x&&p.x<=water.x+water.w)){
        ctx.strokeStyle='rgba(232,255,249,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(p.x+p.w/2,C.waterY-27+Math.sin(s.time+p.x)*2,p.w*.4,4,0,0,Math.PI);ctx.stroke();
      }
    }
    ctx.restore();
  }
  /** A troca de material usa o mesmo recorte dissolvido, sem reintroduzir placas de raízes. */
  groundJoins(ctx,platforms){
    for(const p of platforms.filter(p=>p.ground)){
      const previous=[...GARDEN_PLATFORM_BY_ID.values()].find(v=>v.ground&&Math.abs(v.x+v.w-p.x)<1);if(!previous||previous.type===p.type||previous.y!==p.y)continue;
      const tile=this.surfaceTile(previous.type);if(!tile)continue;const y=p.y-surfaceOffset[previous.type];
      for(let i=0;i<12;i++){ctx.save();ctx.globalAlpha=1-i/12;ctx.beginPath();ctx.rect(p.x+i*5,p.y-145,5,270);ctx.clip();for(let x=Math.floor(p.x/220)*220;x<p.x+65;x+=220)ctx.drawImage(tile,x,y);ctx.restore();}
    }
  }
  /** Vegetação contínua, translúcida e fixa no mundo, inclusive durante o salto. */
  grassFront(ctx,s,platforms){
    for(const ground of platforms.filter(v=>v.ground&&(v.type==='grass'||v.grassPatches))){
      ctx.save();ctx.globalAlpha=.45;
      const all=[...GARDEN_PLATFORM_BY_ID.values()],joinedLeft=all.some(v=>v.ground&&v!==ground&&Math.abs(v.x+v.w-ground.x)<1),joinedRight=all.some(v=>v.ground&&v!==ground&&Math.abs(v.x-ground.x-ground.w)<1);
      if(ground.grassPatches){for(const patch of ground.grassPatches)this.groundSurface(ctx,{...ground,type:'grass',patchX:ground.x+ground.w*patch.start,patchWidth:ground.w*(patch.end-patch.start)},true,true);}else this.groundSurface(ctx,ground,joinedLeft,joinedRight);ctx.restore();
    }
  }

  effort(ctx,s){
    const p=s.player;if(p.terrain!=='gravel'||p.discomfort<.4||s.stage!=='RUNNING'||Math.abs(p.vx)<15)return;
    for(let i=0;i<3;i++){
      const t=(s.time*1.4+i*.32)%1,x=p.x+p.facing*(23+i*5),y=p.y-80+t*13;ctx.save();ctx.globalAlpha=Math.sin(t*Math.PI)*.9;ctx.fillStyle='#8ed5e3';ctx.strokeStyle='#f6ffff';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x,y-5);ctx.bezierCurveTo(x+5,y,x+4,y+4,x,y+4);ctx.bezierCurveTo(x-4,y+4,x-4,y,x,y-5);ctx.fill();ctx.stroke();ctx.restore();
    }
  }

  /** Toda a base da decoração deve caber em um único patamar; altura cabe na paisagem móvel. */
  sceneryLayout(){
    const grounds=[...GARDEN_PLATFORM_BY_ID.values()].filter(p=>p.ground),trees=[],flowers=[],butterflies=[];
    for(let cell=0;cell*290<C.goal-650;cell++){
      const x=cell*290+Math.sin(cell*9)*70,p=grounds.find(p=>x>=p.x&&x<p.x+p.w);if(!p)continue;
      const chapter=gardenSection(x).chapter,quiet=GARDEN_WATERS.some(w=>x>w.x-220&&x<w.x+w.w+220),treeEvery=[9,8,6,10,5,9,7][chapter%7];
      if(cell%treeEvery===0&&x>1500&&p.w>=200&&!p.hill&&!quiet){
        const width=Math.min(175+(chapter%3)*25+(cell%2)*18,p.w-32),height=width*446/417,cx=Math.max(p.x+16+width/2,Math.min(p.x+p.w-16-width/2,x));
        if(!trees.length||cx-width/2>trees.at(-1).x+trees.at(-1).w+100)trees.push({x:cx-width/2,y:p.y+4-height,w:width,h:height,groundId:p.id});
      }
      const count=quiet?0:[3,5,4,2,2,3,4][chapter%7],spacing=[15,10,12,22,26,19,14][chapter%7];
      for(let j=0;j<count;j++){const px=x+j*spacing;if(px-8<p.x||px+8>p.x+p.w)continue;flowers.push({x:px,y:gardenSurfaceY(p,px)+1,height:12+(cell+j+chapter)%4*(chapter===2?5:3),chapter,j});}
      if(!quiet&&cell%(chapter===5?2:5)===0)butterflies.push({x,y:p.y-130,cell,chapter:gardenSection(x).chapter});
    }
    return{trees,flowers,butterflies};
  }
  scenery(ctx,s,left,right){
    const palettes=[['#f5dc8b','#e887a2'],['#f8f0b6','#f2b3c0'],['#b9a6da','#d6c7ed'],['#fff0ad','#e5a5ac'],['#aad5b1','#e2b9da'],['#f5c68b','#df93c3'],['#d7b4da','#f9e5a5']];
    for(const tree of this.sceneryItems.trees)if(tree.x+tree.w>=left&&tree.x<=right)this.prop(ctx,8,tree.x,tree.y,tree.w,tree.h);
    for(const flower of this.sceneryItems.flowers){if(flower.x<left||flower.x>right)continue;const {x,y,height,chapter,j}=flower,py=y-height;ctx.save();ctx.globalAlpha=.84;ctx.strokeStyle='#658648';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,py);ctx.stroke();ctx.fillStyle=palettes[chapter%7][j%2];for(let petal=0;petal<5;petal++){ctx.beginPath();ctx.ellipse(x+Math.cos(petal*1.26)*4,py+Math.sin(petal*1.26)*4,3,4,petal*1.26,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#d8a348';ctx.beginPath();ctx.arc(x,py,2,0,Math.PI*2);ctx.fill();if(chapter===2){ctx.fillStyle=palettes[chapter%7][1];for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(x+(k%2?3:-3),py-3-Math.floor(k/2)*4,3,0,Math.PI*2);ctx.fill();}}ctx.restore();}
    for(const b of this.sceneryItems.butterflies){if(b.x<left||b.x>right)continue;const x=b.x+Math.sin(s.time*.7+b.cell)*28,y=b.y-Math.cos(s.time+b.cell)*22;ctx.fillStyle=palettes[b.chapter%7][1];ctx.beginPath();ctx.ellipse(x-4,y,5,8*Math.abs(Math.sin(s.time*5))+.5,-.5,0,Math.PI*2);ctx.ellipse(x+4,y,5,8*Math.abs(Math.sin(s.time*5))+.5,.5,0,Math.PI*2);ctx.fill();}
  }
  fairy(ctx,s){
    const f=s.fairy,image=this.images.get(fairyFile);if(!image)return;
    const glow=ctx.createRadialGradient(f.x,f.y,2,f.x,f.y,35);glow.addColorStop(0,'rgba(255,245,175,.44)');glow.addColorStop(1,'rgba(255,245,175,0)');ctx.fillStyle=glow;ctx.fillRect(f.x-35,f.y-35,70,70);
    const height=58,width=height*image.width/image.height;ctx.drawImage(image,f.x-width/2,f.y-height/2,width,height);
    if(f.mode==='rescue'){ctx.strokeStyle='rgba(255,225,135,.55)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(f.x,f.y+20);ctx.quadraticCurveTo(f.x+25,s.player.y-60,s.player.x,s.player.y-40);ctx.stroke();}
  }
  insect(ctx,index,x,y,width,height,direction=1){
    const f=INSECT_FRAMES[index],image=this.images.get('runtime/insetos-v1.png');if(!image)return;
    const scale=Math.min(width/f.w,height/f.h);ctx.save();ctx.translate(x,y);ctx.scale(direction,1);ctx.drawImage(image,f.x,f.y,f.w,f.h,-f.w*scale/2,-f.h*scale,f.w*scale,f.h*scale);ctx.restore();
  }
  /** A cena possui atores e planos independentes da simulação jogável. */
  /** Mantém o quadro de fala abaixo dos controles globais também no celular. */
  message(ctx,text,options){
    const canvas=this.canvas,safe=getDialogueSafeArea(canvas),css=canvas.width/(canvas.clientWidth||canvas.width),rect=canvas.getBoundingClientRect?.(),bar=globalThis.document?.querySelector?.('.top-controls-bar')?.getBoundingClientRect();
    const top=Math.max(safe.top,bar&&rect?.height?(bar.bottom-rect.top)*canvas.height/rect.height+10*css:0),width=safe.right-safe.left;
    ctx.save();ctx.translate(safe.left,top);renderPoeticNarration(ctx,{width,height:canvas.height-top,clientWidth:width/css},text,{...options,advanceCanvas:canvas});ctx.restore();
  }
  narrative(ctx,s){this.storyControls=renderGardenCinematic(ctx,this.canvas,s,this.images);}
  render(s,{ready=true,error=null,touch=false,paused=false}={}){
    beginDialogueFrame(this.canvas);try{
    const ctx=this.ctx,canvas=this.canvas,{width,height}=canvas;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#bfe7ed';ctx.fillRect(0,0,width,height);
    if(!ready||error){this.message(ctx,error||'Abrindo o portão do jardim…',{heading:'UM DIA NO JARDIM',interactive:false});ctx.restore();return;}
    if(s.stage==='COMPLETE'&&(s.age>=.65||s.story?.endingDone)||s.stage==='INTRO'&&!s.story?.openingDone){this.narrative(ctx,s);ctx.restore();return;}
    const f=this.frame(s),left=f.ox-250,right=f.ox+width/f.scale+250,bottom=(height-f.oy)/f.scale+150,background=this.images.get('cenario-v1.png');
    if(background){const bgHeight=Math.max(height,width*background.height/background.width)*1.35,bgWidth=bgHeight*background.width/background.height;const parallax=Math.max(0,Math.min(1,f.ox/(C.width-width/f.scale)));ctx.drawImage(background,-parallax*(bgWidth-width),height-bgHeight,bgWidth,bgHeight);}
    ctx.save();ctx.translate(-f.ox*f.scale,f.oy);ctx.scale(f.scale,f.scale);
    const haze=ctx.createLinearGradient(0,C.ground-250,0,C.ground+330);haze.addColorStop(0,'rgba(242,246,218,0)');haze.addColorStop(.48,'rgba(242,246,218,.18)');haze.addColorStop(1,'rgba(242,246,218,0)');ctx.fillStyle=haze;ctx.fillRect(left,C.ground-250,right-left,580);
    for(const water of waterPaint){if(water.x+water.w<left||water.x>right)continue;const gradient=ctx.createLinearGradient(0,640,0,800);gradient.addColorStop(0,'#7bd9db');gradient.addColorStop(1,'#347caa');ctx.fillStyle=gradient;ctx.fillRect(water.x-5,C.waterY-35,water.w+10,bottom-C.waterY+45);ctx.strokeStyle='rgba(234,255,255,.65)';ctx.lineWidth=2;for(let x=Math.max(water.x,left);x<Math.min(water.x+water.w,right);x+=58){ctx.beginPath();ctx.ellipse(x+Math.sin(s.time+x)*8,C.waterY-20+Math.sin(x)*7,17,2,0,0,Math.PI);ctx.stroke();}}
    for(const w of GARDEN_WHEELS)if(left<w.x+260&&right>w.x-260){const wheel=gardenPlatforms(s.time,s,w.x,200).filter(p=>p.wheelId===w.id);ctx.strokeStyle='#a7794d';ctx.lineWidth=8;for(const p of wheel){ctx.beginPath();ctx.moveTo(w.x,w.y);ctx.lineTo(p.x+p.w/2,p.y+10);ctx.stroke();}ctx.fillStyle='#b78d59';ctx.beginPath();ctx.arc(w.x,w.y,16,0,Math.PI*2);ctx.fill();}
    // Nuvens ausentes são omitidas tanto da imagem quanto da lista de apoio físico.
    const platforms=gardenPlatforms(s.time,s,(left+right)/2,(right-left)/2);
    this.terrainBodies(ctx,platforms,bottom);
    for(const p of platforms){ctx.save();if(p.type==='cloud')ctx.globalAlpha=cloudStatus(p,s).alpha;this.terrain(ctx,p,bottom,false);ctx.restore();}
    this.groundJoins(ctx,platforms);this.waterFront(ctx,s,left,right,bottom,platforms);
    this.scenery(ctx,s,left,right);
    if(left<680)this.prop(ctx,0,GARDEN_HOME.x,GARDEN_HOME.y,GARDEN_HOME.w,GARDEN_HOME.h,'ambiente');
    for(const checkpoint of GARDEN_CHECKPOINTS.slice(1)){if(checkpoint<left||checkpoint>right)continue;ctx.fillStyle='#805a3f';const ground=GARDEN_PLATFORM_BY_ID.get(gardenPlatforms(s.time,s,checkpoint,1).find(p=>p.ground&&checkpoint>=p.x&&checkpoint<p.x+p.w)?.id),y=gardenSurfaceY(ground,checkpoint);ctx.fillRect(checkpoint-5,y-49,7,49);ctx.fillStyle=s.checkpoint>=checkpoint?'#f4b85f':'#b6d284';ctx.beginPath();ctx.moveTo(checkpoint+2,y-48);ctx.lineTo(checkpoint+33,y-36);ctx.lineTo(checkpoint+2,y-24);ctx.fill();}
    if(right>C.goal-750){
      // Raízes e toalha têm intervalos separados; a âncora atravessa o plano do tecido.
      this.prop(ctx,8,C.goal-380,C.ground+4-360,360*417/446,360);
      const picnic=GARDEN_PICNIC,image=this.images.get(picnic.file),width=400,scale=width/picnic.w;
      if(image)ctx.drawImage(image,picnic.x,picnic.y,picnic.w,picnic.h,C.goal+5,C.ground-picnic.groundAnchorY*scale,width,picnic.h*scale);
    }
    for(const e of s.enemies){
      const support=GARDEN_PLATFORM_BY_ID.get(e.supportId),pose=gardenDefeatFrame(e,support?gardenSurfaceY(support,e.x):e.baseY);
      if(!pose.visible||pose.x<left-100||pose.x>right+100)continue;
      ctx.save();ctx.globalAlpha=pose.alpha;ctx.translate(pose.x,pose.y);ctx.rotate(pose.rotation);ctx.scale(e.direction,pose.squash);
      const frame=e.alive?Math.floor(s.time*(e.type==='caterpillar'&&e.hp===1?12:7))%2:0;
      if(e.type==='caterpillar'&&(e.hp===1||!e.alive))this.prop(ctx,frame,-e.w/2,-e.h,e.w,e.h,'lagartaVermelha');
      else this.prop(ctx,(e.type==='ant'?4:6)+frame,-e.w/2,-e.h,e.w,e.h);
      ctx.restore();
    }
    for(const worm of s.encounters?.worms??[]){
      if(Math.abs(worm.x-s.player.x)>1100)continue;
      const f=INSECT_FRAMES[4],image=this.images.get('runtime/insetos-v1.png'),near=Math.max(0,Math.min(1,(500-Math.abs(worm.x-s.player.x))/180));
      if(near>0&&worm.exposure<.8){ctx.save();ctx.fillStyle='#92704c';for(let i=0;i<5;i++){const x=worm.x+(i-2)*10,y=worm.y-2-Math.abs(Math.sin(s.time*13+i))*near*5;ctx.beginPath();ctx.ellipse(x,y,3.5,2.2,i*.3,0,Math.PI*2);ctx.fill();}ctx.restore();}
      if(image){const scale=72/f.h;ctx.drawImage(image,f.x,f.y+f.h*.82,f.w,f.h*.18,worm.x-f.w*scale/2,worm.y-4,f.w*scale,f.h*.18*scale);}
      if(worm.exposure>0){ctx.save();ctx.beginPath();ctx.rect(worm.x-60,worm.y-80,120,87);ctx.clip();this.insect(ctx,4+Math.floor(s.time*3)%2,worm.x,worm.y+9+(1-worm.exposure)*72,100,72);ctx.restore();}
    }
    for(const bee of s.encounters?.bees??[]){if(Math.abs(bee.x-s.player.x)>1100)continue;drawGardenBee(ctx,this.images,bee,s.time);}
    const beetle=s.encounters?.panic??s.encounters?.exit;
    if(beetle){ctx.save();ctx.globalAlpha=s.encounters.panic?1:Math.max(0,1-beetle.age);const t=Math.max(0,Math.min(1,(beetle.elapsed??1)/.85)),entry=t*t*(3-2*t),x=(f.ox-100)*(1-entry)+beetle.x*entry;drawGardenBeetle(ctx,this.images,{...beetle,x},s.time);ctx.restore();}
    const p=s.player;let {set,index}=gardenGirlPose(p,s.time);
    const hurt=Math.max(0,s.presentation?.hurtRemaining??0),hurtProgress=1-hurt/.48;
    const recoil=hurt>0?Math.sin(Math.min(1,hurtProgress/.16)*Math.PI/2)*Math.pow(hurt/.48,.8)*.38*(s.presentation.hurtDirection??1):0;
    if(!hurt&&s.immunity>0&&Math.floor(s.time*10)%2===0)ctx.globalAlpha=.5;
    if(s.stage==='COMPLETE'){set='menina-acoes-v1';index=s.age<1.5?5:6;}else if(s.stage==='FALLING'||s.stage==='GAME_OVER'||s.stage==='DISORIENTED'){set='menina-acoes-v1';index=4;}
    ctx.save();ctx.translate(p.x,p.y);if(set==='menina-pedrinhas-v2')ctx.rotate(Math.sin(s.time*11)*.045);this.sprite(ctx,set,index,0,0,C.playerHeight,p.facing,Boolean(s.encounters?.panic),Math.sin(s.time*11)*.045,recoil*p.facing);ctx.restore();ctx.globalAlpha=1;
    if(hurt>.28){
      // Marca o contato no corpo; nunca altera a câmera ou a superfície dos pés.
      const t=hurtProgress/.42,x=p.x-(s.presentation.hurtDirection??1)*23,y=p.y-58;
      ctx.save();ctx.globalAlpha=Math.max(0,1-t);ctx.strokeStyle='#fff8d6';ctx.lineWidth=3;ctx.fillStyle='#f5bd53';
      ctx.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5,r=(i%2?4:11)*(1+t*.6),px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);}ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();
    }
    if(s.encounters?.panic){ctx.fillStyle='#a5e5f5';ctx.strokeStyle='#579cb8';ctx.lineWidth=.6;for(let i=0;i<3;i++){const t=(s.time*3+i/3)%1,x=p.x-p.facing*(18+t*24),y=p.y-78-t*18;ctx.beginPath();ctx.ellipse(x,y,1.5+2*t,3.2+2*t,-.6*p.facing,0,Math.PI*2);ctx.fill();ctx.stroke();}}
    this.grassFront(ctx,s,platforms);this.effort(ctx,s);this.fairy(ctx,s);ctx.restore();
    const safe=getDialogueSafeArea(canvas),css=width/(canvas.clientWidth||width),u=Math.max(css,Math.min(width/680,height/500)),narration=['INTRO','FALLING','GAME_OVER','RESCUING','DISORIENTED'].includes(s.stage)||s.player.x<500;
    if(!narration&&!s.encounters?.panic&&!(s.presentation?.hintRemaining>0)){
      const rect=canvas.getBoundingClientRect?.(),toolbar=globalThis.document?.querySelector?.('.top-controls-bar')?.getBoundingClientRect();
      const barBottom=toolbar&&rect?.height?(toolbar.bottom-rect.top)*height/rect.height:0;
      const x=safe.left+10*css,y=Math.max(safe.top+10*css,barBottom+10*css),w=Math.min(355*css,safe.right-x-10*css);
      ctx.save();ctx.fillStyle='#fff7e7';ctx.strokeStyle='#729c6b';ctx.lineWidth=css;ctx.beginPath();ctx.roundRect(x,y,w,64*css,12*css);ctx.fill();ctx.stroke();
      ctx.fillStyle='#9b4e58';ctx.font=`bold ${18*css}px Georgia`;ctx.fillText(s.difficulty==='EASY'?'♥ ∞':'♥'.repeat(s.hp),x+12*css,y+24*css);
      ctx.font=`bold ${12*css}px Georgia`;ctx.fillStyle='#426951';ctx.textAlign='right';ctx.fillText(Math.min(100,Math.floor(p.x/C.goal*100))+'% do caminho',x+w-12*css,y+24*css);ctx.textAlign='left';ctx.fillText(gardenSection(p.x).name,x+12*css,y+49*css,w-24*css);ctx.restore();
    }
    const mobile=touch||height>width||globalThis.matchMedia?.('(pointer: coarse)').matches;
    if(mobile){for(const [name,b]of Object.entries(this.controls())){ctx.fillStyle='rgba(255,248,225,.88)';ctx.strokeStyle='#6a9971';ctx.lineWidth=2*u;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#3d6e51';ctx.font=`bold ${name==='jump'?Math.min(17*css,b.r*.45):27*u}px Georgia`;ctx.textAlign='center';ctx.fillText(name==='left'?'◀':name==='right'?'▶':'PULAR',b.x,b.y+7*u);}ctx.textAlign='left';}
    if(s.stage==='INTRO')this.message(ctx,'Yuna desce a escada. Nanda vai junto.\nUm pedacinho de cada vez, até o piquenique.',{heading:'UM DIA NO JARDIM'});
    else if(s.stage==='GAME_OVER'||s.stage==='FALLING'&&s.age>=1.1){
      ctx.save();ctx.fillStyle='rgba(32,35,44,.23)';ctx.fillRect(0,0,width,height);ctx.font=`bold ${54*u}px Georgia`;ctx.textAlign='center';ctx.fillStyle='#fff7e7';ctx.shadowColor='#354b3c';ctx.shadowBlur=8;ctx.fillText('Game Over',width/2,height*.43);ctx.restore();
    }
    else if(s.stage==='RESCUING')this.message(ctx,'Nanda leva você de volta ao chão seguro.',{heading:'ESTOU AQUI'});
    else if(s.stage==='DISORIENTED')this.message(ctx,'Um instante para se encontrar de novo…',{heading:'COM CALMA'});
    else if(s.stage==='RUNNING'&&(s.encounters?.panic||s.presentation?.hintRemaining>0))this.message(ctx,s.encounters?.panic?'calma, Yuna, é só um besouro. Ele não vai te fazer mal':'Quando Yuna se assusta, ela corre sozinha. Controle apenas o pulo.',{heading:s.encounters?.panic?'NANDA':'UM SUSTO NO CAMINHO'});
    else if(s.stage==='RUNNING'&&p.x<500)this.message(ctx,mobile?'Use ◀ ▶ para andar e PULAR para saltar.':'A/D ou ← → para andar • Espaço para pular',{heading:'ATÉ O PIQUENIQUE'});
    if(s.stage==='COMPLETE'){ctx.save();ctx.globalAlpha=Math.min(1,s.age/.65);this.narrative(ctx,s);ctx.restore();}
    if(s.stage==='INTRO'&&s.story?.openingDone&&s.age<.45){ctx.save();ctx.fillStyle='#edf1df';ctx.globalAlpha=1-s.age/.45;ctx.fillRect(0,0,width,height);ctx.restore();}
    if(paused){ctx.fillStyle='rgba(30,57,47,.12)';ctx.fillRect(0,0,width,height);}ctx.restore();
    }finally{endDialogueFrame(this.canvas);}
  }
  destroy(){this.disposed=true;this.images.clear();this.patterns.clear();}
}
