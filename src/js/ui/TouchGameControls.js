/** D-pad contínuo de oito direções e salto amplo, medidos em pixels CSS reais. */
export function mobileGameControls(canvas,safe){
 const rect=canvas.getBoundingClientRect?.(),sx=canvas.width/(rect?.width||canvas.width),sy=canvas.height/(rect?.height||canvas.height),w=(safe.right-safe.left)/sx,h=(safe.bottom-safe.top)/sy,size=Math.min(192,Math.max(168,Math.min(w*.46,h*.48))),cell=size/3,left=safe.left+12*sx,top=safe.bottom-(size+12)*sy,pad={left,top,width:size*sx,height:size*sy},out={};
 for(let row=0;row<3;row++)for(let col=0;col<3;col++){if(row===1&&col===1)continue;const names=[row===0?'up':row===2?'down':null,col===0?'left':col===2?'right':null].filter(Boolean),x=left+(col+.5)*cell*sx,y=top+(row+.5)*cell*sy;out[names.join('-')]={x,y,r:cell*.45*Math.min(sx,sy),pad,hitBox:{left:left+col*cell*sx,right:left+(col+1)*cell*sx,top:top+row*cell*sy,bottom:top+(row+1)*cell*sy}};}
 const r=48,x=safe.right-(r+12)*sx,y=safe.bottom-(r+20)*sy;out.jump={x,y,r:44*Math.min(sx,sy),hitBox:{left:x-r*sx,right:x+r*sx,top:y-r*sy,bottom:y+r*sy}};return out;
}
/** Desenha uma cruz unida com diagonais na área de toque; cores acompanham cada fase. */
export function drawMobileGameControls(ctx,canvas,controls,{dark=false,jumpLabel='PULAR'}={}){
 const first=Object.values(controls).find(b=>b.pad);if(!first)return false;const p=first.pad,cx=p.left+p.width/2,cy=p.top+p.height/2,cw=p.width/3,ch=p.height/3,css=canvas.width/(canvas.clientWidth||canvas.width);ctx.save();ctx.fillStyle=dark?'rgba(8,20,39,.78)':'rgba(255,248,225,.88)';ctx.strokeStyle=dark?'rgba(186,217,224,.65)':'#6a9971';ctx.lineWidth=2*css;
 ctx.beginPath();ctx.roundRect(p.left,p.top,p.width,p.height,22*css);ctx.fill();ctx.stroke();ctx.fillStyle=dark?'rgba(152,187,204,.15)':'rgba(106,153,113,.18)';ctx.fillRect(cx-cw/2,p.top,cw,p.height);ctx.fillRect(p.left,cy-ch/2,p.width,ch);ctx.fillStyle=dark?'#e0eded':'#3d6e51';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`bold ${24*css}px sans-serif`;
 for(const [name,b] of Object.entries(controls)){if(!b.pad)continue;ctx.globalAlpha=name.includes('-')?.65:1;ctx.fillText({'up':'▲','down':'▼','left':'◀','right':'▶','up-left':'↖','up-right':'↗','down-left':'↙','down-right':'↘'}[name],b.x,b.y);}
 const b=controls.jump;ctx.globalAlpha=1;ctx.fillStyle=dark?'rgba(8,20,39,.82)':'rgba(255,248,225,.9)';ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle=dark?'#e0eded':'#3d6e51';ctx.font=`bold ${14*css}px sans-serif`;ctx.fillText(jumpLabel,b.x,b.y);ctx.restore();return true;
}
