import { getMobileUILayout } from '../ui/MobileUILayout.js';
import { TOY_ROOM_INPUT } from './ToyRoomInputBindings.js';

/** Desenha a orientação com dados do quadro, sem receber o tutorial nem a sala. */
export function renderToyRoomTutorial(ctx, canvas, frame, { fairy, cameraX, cameraY, message, step, device }) {
  const x=frame.x+(fairy.x-cameraX)*frame.zoom;
  const y=frame.y+(fairy.y-cameraY)*frame.zoom;
  const scale=canvas.width/(canvas.getBoundingClientRect?.().width||canvas.width);
  const font=Math.max(12*scale,Math.min(17*scale,canvas.width/25));
  const layout=getMobileUILayout(canvas);
  const safe={left:layout.safeLeft,right:layout.safeRight,top:layout.safeTop,bottom:layout.safeBottom};
  const width=Math.min(safe.right-safe.left-24*scale,360*scale);
  ctx.save();ctx.font=`bold ${font}px Georgia, serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  const lines=[];let line='';
  for(const word of message.split(' ')){
    const candidate=line?line+' '+word:word;
    if(line&&ctx.measureText(candidate).width>width-24*scale){lines.push(line);line=word;}else line=candidate;
  }
  lines.push(line);
  const height=(lines.length*font*1.35)+42*scale;
  const left=Math.max(safe.left+12*scale,Math.min(safe.right-width-12*scale,x-width/2));
  const minTop=Math.min(layout.hudBottom+8*scale,safe.bottom-height-12*scale);
  const top=Math.max(safe.top+12*scale,minTop,Math.min(safe.bottom-height-160*scale,y-height-28*scale));
  ctx.fillStyle='rgba(57,35,22,0.94)';ctx.beginPath();ctx.roundRect(left,top,width,height,12*scale);ctx.fill();
  ctx.fillStyle='#fff4cb';lines.forEach((text,i)=>ctx.fillText(text,left+width/2,top+18*scale+i*font*1.35));
  ctx.font=`${Math.min(font,13*scale)}px Georgia, serif`;
  ctx.fillText('Pegue um brinquedo e leve ao baú.',left+width/2,top+height-17*scale);
  // O ponteiro pertence à fala da guia e não delimita superfícies ou áreas físicas.
  if(step==='pickup'){
    ctx.fillStyle='#fde4a2';ctx.beginPath();ctx.moveTo(x-5*scale,y+22*scale);ctx.lineTo(x+5*scale,y+22*scale);ctx.lineTo(x,y+31*scale);ctx.fill();
    ctx.font=`bold ${13*scale}px Georgia, serif`;
    ctx.fillStyle='#fff4cb';ctx.strokeStyle='#392316';ctx.lineWidth=4*scale;
    const action=device==='MOBILE_TOUCH'?'PEGAR ↓':`${device==='GAMEPAD'?TOY_ROOM_INPUT.gamepadLabel:TOY_ROOM_INPUT.actionLabel} · PEGAR ↓`;
    const actionX=layout.action.x,actionY=layout.action.y-layout.action.radius-16*scale;
    ctx.strokeText(action,actionX,actionY);
    ctx.fillText(action,actionX,actionY);
  }
  ctx.restore();
}
