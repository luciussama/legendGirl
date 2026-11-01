import {BRINQUEDAO_SIDE_MATS} from './BrinquedaoRecovery.js';
import {BRINQUEDAO_ART as ART} from './BrinquedaoArt.js';
import {BRINQUEDAO_TRACKS} from './BrinquedaoLevel.js';
import {BRINQUEDAO_ELASTIC} from './BrinquedaoExtension.js';
/** Recorta componentes completos em memória; a fonte pintada permanece intacta. */
export function prepareBrinquedaoAttractions(image){return ART.attractions.frames.map(f=>{const canvas=document.createElement('canvas');canvas.width=f.w;canvas.height=f.h;const ctx=canvas.getContext('2d');ctx.beginPath();f.rowMask.forEach((r,y)=>y?ctx.lineTo(r[0],y):ctx.moveTo(r[0],y));for(let y=f.rowMask.length-1;y>=0;y--)ctx.lineTo(f.rowMask[y][1]+1,y+1);ctx.closePath();ctx.clip();ctx.drawImage(image,f.x,f.y,f.w,f.h,0,0,f.w,f.h);const pixels=ctx.getImageData(0,0,f.w,f.h).data,surface=[];for(let x=0;x<f.w;x++){let y=0;while(y<f.h&&pixels[(y*f.w+x)*4+3]<160)y++;surface.push(y+20);}return{canvas,surface};});}
/** Castelos ficam sob os terraços, com ameias e entradas visíveis ao redor dos apoios. */
export function drawBrinquedaoCastles(ctx,parts,left,right){const image=parts[1].canvas;for(const p of BRINQUEDAO_TRACKS)if(p.kind==='castle'&&p.to>=left-100&&p.from<=right+100){const w=p.to-p.from+80,k=w/image.width;ctx.drawImage(image,p.from-40,p.y-image.height*.4*k,w,image.height*k);}}
/** Lona comprime e recupera pelo instante do impacto, sem alterar a posição física dos pés. */
export function drawBrinquedaoSpring(ctx,image,p,s){const age=s.obstacles.springs[p.id]===null?100:s.time-s.obstacles.springs[p.id],compression=age<.3?Math.sin(age/.3*Math.PI)*.07:0,w=p.to-p.from,k=w/image.width,h=image.height*k;ctx.save();ctx.translate(0,p.y);ctx.scale(1,1-compression);ctx.drawImage(image,p.from,-image.height*.31*k,w,h);ctx.restore();}
/** Painel oblíquo recebe a descida e devolve o impulso para a rampa visível à direita. */
export function drawBrinquedaoElastic(ctx,parts,s,left,right){const p=BRINQUEDAO_ELASTIC;if(p.x<left-200||p.x>right+200)return;const image=parts[2].canvas,age=s.obstacles.wall===null?100:s.time-s.obstacles.wall,compress=age<.25?Math.sin(age/.25*Math.PI)*.12:0;ctx.save();ctx.translate(p.x,p.y+70);ctx.scale(1-compress,1);ctx.drawImage(image,-170,-90,225,225*image.height/image.width);ctx.restore();}

/** Camas verticais nas extremidades usam a mesma lona pintada, com molas e apoios voltados para fora. */
export function drawBrinquedaoSideMats(ctx,parts,s,left,right){const image=parts[0].canvas;for(const wall of BRINQUEDAO_SIDE_MATS){if(wall.x<left-100||wall.x>right+100)continue;const age=s.obstacles.bumpers[wall.id]===null?100:s.time-s.obstacles.bumpers[wall.id],compression=age<.24?Math.sin(age/.24*Math.PI)*.16:0,k=(wall.bottom-wall.top)/image.width;ctx.save();ctx.translate(wall.x,(wall.top+wall.bottom)/2);ctx.rotate(-wall.side*Math.PI/2);ctx.scale(1,1-compression);ctx.drawImage(image,-image.width*k/2,-image.height*.31*k,image.width*k,image.height*k);ctx.restore();}}
