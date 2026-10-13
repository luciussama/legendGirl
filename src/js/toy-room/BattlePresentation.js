import { BATTLE_PLAYER_BOUNDS, BATTLE_ROCKET_GLOVE_BOUNDS } from './BattlePlayerBounds.js';
import { drawToySword } from './ToyRoomStory.js';
import { OFFICIAL_FRAMES } from '../assets/officialCharacter.js';

// Envelope frontal da protagonista em 2×; mantém o alcance lógico já existente.
export const BATTLE_PLAYER_HALF_WIDTH = OFFICIAL_FRAMES.idle[0].w / 2 * (80 / 50 + 1 / OFFICIAL_FRAMES.idle[0].h) * 2;

/** Estende apenas a mola e desloca a luva; a referência do torso não acompanha o punho. */
export function rocketPunchProjection(frame, reference, elapsed, signedDistance, target=null) {
  const factor = frame.displayScale * 100 / ((reference.height - 24) * reference.displayScale);
  const source = { root:240, glove:460, right:559, top:185, height:92 };
  const maxTip = 280 - BATTLE_PLAYER_HALF_WIDTH;
  const minLeft = BATTLE_PLAYER_HALF_WIDTH - 35;
  const gloveWidth = (source.right - source.glove) * factor;
  const tip = Math.max(minLeft + gloveWidth, Math.min(maxTip, signedDistance - BATTLE_PLAYER_HALF_WIDTH + 10));
  const neutralTip = (source.right - frame.anchor.x) * factor;
  const progress = elapsed < 54 ? Math.max(0, Math.min(1, (elapsed - 44) / 10))
    : elapsed >= 72 ? Math.max(0, 1 - (elapsed - 72) / 18) : 1;
  let visibleTip = neutralTip + (tip - neutralTip) * progress, verticalShift=0;
  if(target) {
    const body=playerModel(target.state,target.player,target.attackDirection);
    const jump=battlePlayerJumpOffset(target.state,target.player,target.attackDirection);
    const glove=BATTLE_ROCKET_GLOVE_BOUNDS;
    const first=glove.rows.findIndex(Boolean),highest=(glove.anchorY-first)*factor;
    const dy=highest-89;
    let min=Infinity,max=-Infinity;
    for(let gy=0;gy<glove.rows.length;gy++) {
      const g=glove.rows[gy];if(!g)continue;
      const gt=(gy-glove.anchorY)*factor+dy,gb=gt+factor;
      const firstRow=Math.max(0,Math.floor((gt+body.anchorY+jump)/body.pixelHeight));
      const lastRow=Math.min(body.rows.length-1,Math.floor((gb+body.anchorY+jump)/body.pixelHeight));
      for(let py=firstRow;py<=lastRow;py++) {
        const b=body.rows[py];if(!b)continue;
        const bt=py*body.pixelHeight-body.anchorY-jump,bb=bt+body.pixelHeight;
        if(gt>=bb || gb<=bt)continue;
        const left=body.facing*target.enemyFacing<0?-b[1]:b[0],right=body.facing*target.enemyFacing<0?-b[0]:b[1];
        min=Math.min(min,g[0]*factor-right);max=Math.max(max,g[1]*factor-left);
      }
    }
    if(Number.isFinite(max)) {
      // Projeta a arte até a silhueta efetiva; os limites lógicos permanecem -35 e 280.
      const shift=Math.max(-35-min+1e-6,Math.min(280-max,signedDistance+10-max));
      visibleTip=neutralTip+shift*progress;
    }
    verticalShift=dy*progress;
  }
  return { factor, source, tip:visibleTip, left:visibleTip-gloveWidth,
    root:(source.root-frame.anchor.x)*factor, maxTip, gloveWidth,verticalShift };
}

export function rocketPunchTouchesPlayer(frame, reference, elapsed, signedDistance, target) {
  const projection = rocketPunchProjection(frame, reference, elapsed, signedDistance, target);
  const body = playerModel(target.state, target.player, target.attackDirection);
  const jump = battlePlayerJumpOffset(target.state, target.player, target.attackDirection);
  const glove = BATTLE_ROCKET_GLOVE_BOUNDS;
  const facing = body.facing * target.enemyFacing;
  const sourceAnchor = frame.anchor.x - 460;
  for (let gloveY = 0; gloveY < glove.rows.length; gloveY++) {
    const gloveRow = glove.rows[gloveY];
    if (!gloveRow) continue;
    const top = (gloveY - glove.anchorY) * projection.factor + projection.verticalShift;
    const bottom = top + projection.factor;
    const firstBodyRow = Math.max(0, Math.floor((top + body.anchorY + jump) / body.pixelHeight));
    const lastBodyRow = Math.min(body.rows.length - 1, Math.floor((bottom + body.anchorY + jump) / body.pixelHeight));
    for (let bodyY = firstBodyRow; bodyY <= lastBodyRow; bodyY++) {
      const bodyRow = body.rows[bodyY];
      if (!bodyRow) continue;
      const bodyTop = bodyY * body.pixelHeight - body.anchorY - jump;
      const bodyBottom = bodyTop + body.pixelHeight;
      if (top >= bodyBottom || bottom <= bodyTop) continue;
      const bodyLeft = facing < 0 ? -bodyRow[1] : bodyRow[0];
      const bodyRight = facing < 0 ? -bodyRow[0] : bodyRow[1];
      const gloveLeft = projection.left + (gloveRow[0] + sourceAnchor) * projection.factor;
      const gloveRight = projection.left + (gloveRow[1] + sourceAnchor) * projection.factor;
      if (gloveLeft < signedDistance + bodyRight && gloveRight > signedDistance + bodyLeft) return true;
    }
  }
  return false;
}

export function renderRocketPunch(ctx, image, frame, reference, elapsed, signedDistance,target=null) {
  const p=rocketPunchProjection(frame,reference,elapsed,signedDistance,target), {factor,source}=p;
  const x=-frame.anchor.x*factor, y=-frame.anchor.y*factor;
  // Recorta a faixa da mola/luva; cabeça, torso, pernas e escala não mudam.
  ctx.save();ctx.beginPath();ctx.rect(x,y,frame.width*factor,frame.height*factor);
  ctx.rect((300-frame.anchor.x)*factor,(source.top-frame.anchor.y)*factor,(frame.width-300)*factor,25*factor);
  ctx.rect((source.root-frame.anchor.x)*factor,(210-frame.anchor.y)*factor,
    (frame.width-source.root)*factor,(source.height-25)*factor);ctx.clip('evenodd');
  ctx.drawImage(image,x,y,frame.width*factor,frame.height*factor);ctx.restore();
  const armY=(source.top-frame.anchor.y)*factor+p.verticalShift;
  const armHeight=source.height*factor,rootY=(source.top-frame.anchor.y)*factor+armHeight/2;
  ctx.save();ctx.translate(p.root,rootY);ctx.rotate(Math.atan2(p.verticalShift,p.left-p.root));
  ctx.drawImage(image,source.root,210,source.glove-source.root,42,
    0,-21*factor,Math.max(.01,Math.hypot(p.left-p.root,p.verticalShift)),42*factor);ctx.restore();
  ctx.drawImage(image,source.glove,source.top,frame.width-source.glove,source.height,
    p.left,armY,(frame.width-source.glove)*factor,source.height*factor);
}

// A pose baixa possui geometria própria; a personagem mantém proporções naturais.
export const BATTLE_LASER_HEIGHT = 85;
export const BATTLE_CROUCH_FRAME = { file:'certification/girl-low-crouch-v1.png', x:329,y:357,w:973,h:634,displayHeight:80 };
export const BATTLE_JUMP_VISUAL_SCALE = (BATTLE_LASER_HEIGHT + 4 - 3.24) / 65;
export function renderBattleCrouch(ctx,image,player,attackTime,attackDirection) {
  const f=BATTLE_CROUCH_FRAME, height=f.displayHeight/2, width=height*f.w/f.h;
  ctx.save();ctx.translate(player.x,690);ctx.scale(player.facing==='left'?-1:1,1);
  ctx.drawImage(image,f.x,f.y,f.w,f.h,-width/2,-height,width,height);ctx.restore();
  const progress=attackTime>0?1-attackTime/12:0.5;
  const facing=attackTime>0?attackDirection:player.facing==='left'?-1:1;
  const angle=(facing<0?Math.PI:0)+(progress-0.5)*1.7*facing;
  drawToySword(ctx,player.x+facing*15,690-10,angle+Math.PI/2,0.72);
}

/** Metadados do mesmo quadro apresentado, incluindo orientação e ponto dos pés. */
function playerModel(state,player,attackDirection) {
  const pose=state.crouching?'crouch':state.attackTime>0?'attack':state.jump>0?(state.jumpVelocity>0?'jump':'fall'):player.isMoving?'run':'idle';
  const frames=BATTLE_PLAYER_BOUNDS[pose];
  const index=pose==='crouch'?0:pose==='attack'?Math.min(7,Math.floor((1-state.attackTime/12)*8)):Math.floor(state.elapsed/6)%frames.length;
  return { ...frames[index], facing:pose==='attack'?attackDirection:player.facing==='left'?-1:1 };
}
export function battlePlayerJumpOffset(state,player,attackDirection) {
  const frame=playerModel(state,player,attackDirection);
  return state.jump*(BATTLE_LASER_HEIGHT+4-frame.footPadding)/65;
}
export function laserProjection(state,player,enemy,attackDirection) {
  const frame=playerModel(state,player,attackDirection);
  const jump=battlePlayerJumpOffset(state,player,attackDirection);
  const bounds=[];
  const top=BATTLE_LASER_HEIGHT+4-jump, bottom=BATTLE_LASER_HEIGHT-4-jump;
  for(let y=0;y<frame.rows.length;y++){
    const row=frame.rows[y],rowTop=frame.anchorY-y*frame.pixelHeight,rowBottom=rowTop-frame.pixelHeight;
    if(row && rowTop>=bottom && rowBottom<=top)bounds.push(row);
  }
  const fallback=BATTLE_PLAYER_BOUNDS.idle[0];
  const rows=bounds.length?bounds:[fallback.rows[Math.floor((fallback.anchorY-BATTLE_LASER_HEIGHT)/fallback.pixelHeight)]];
  let left=Math.min(...rows.map(row=>row[0])),right=Math.max(...rows.map(row=>row[1]));
  if(frame.facing*enemy.facing<0)[left,right]=[-right,-left];
  return {start:-35+right,end:340+left,height:BATTLE_LASER_HEIGHT,halfHeight:4,bodyLeft:left,bodyRight:right};
}

export const BATTLE_TRAIN_BODY = {file:'certification/train-body-v1.png',width:1575,height:998,anchor:{x:800,y:950}};
/** Ambos os pinos descrevem o mesmo círculo: a distância entre eles permanece constante. */
export function trainDrive(elapsed) {
  const phase=elapsed/42*Math.PI*2,dx=45*Math.cos(phase),dy=45*Math.sin(phase);
  return {phase,pins:[{x:697+dx,y:748+dy},{x:1100+dx,y:781+dy}]};
}
export function renderTrainWalk(ctx,body,parts,elapsed,transportScale=1) {
  const f=BATTLE_TRAIN_BODY,scale=90/916*transportScale,drive=trainDrive(elapsed);
  ctx.save();ctx.scale(scale,scale);ctx.translate(-f.anchor.x,-f.anchor.y);ctx.drawImage(body,0,0);
  // A superfície pintada das rodas gira sob a mesma biela, sem substituir a arte por formas.
  for(const wheel of[{x:157,y:773,r:69},{x:379,y:790,r:70},{x:697,y:748,r:120},{x:1100,y:781,r:102}]) {
    ctx.save();ctx.translate(wheel.x,wheel.y);ctx.beginPath();ctx.arc(0,0,wheel.r,0,Math.PI*2);ctx.clip();
    ctx.rotate(drive.phase);ctx.drawImage(body,wheel.x-wheel.r,wheel.y-wheel.r,wheel.r*2,wheel.r*2,-wheel.r,-wheel.r,wheel.r*2,wheel.r*2);ctx.restore();
  }
  const [a,b]=drive.pins,length=Math.hypot(b.x-a.x,b.y-a.y);
  ctx.save();ctx.translate(a.x,a.y);ctx.rotate(Math.atan2(b.y-a.y,b.x-a.x));
  ctx.drawImage(parts,247,235,95,13,0,-19,length,38);ctx.restore();
  for(const p of drive.pins) {
    ctx.save();ctx.translate(p.x,p.y);ctx.beginPath();ctx.arc(0,0,32,0,Math.PI*2);ctx.clip();
    ctx.drawImage(parts,219,228,26,26,-32,-32,64,64);ctx.restore();
  }
  ctx.restore();
}
