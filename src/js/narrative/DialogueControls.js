import {isDialogueModal} from './DialogueFlow.js';

/** Espaço reservado dentro da moldura; pular cena tem um alvo separado do avanço de fala. */
export function dialogueControlsHeight(scale=1,canSkip=false){return(canSkip?48:30)*scale;}

/** Comandos de leitura compartilhados, sem desenhar outro painel sobre a ilustração. */
export function drawDialogueControls(ctx,canvas,{left,top,width,scale=1,canSkip=false,color='#846467',buttonColor='#fff5e5'}={}){
 const height=dialogueControlsHeight(scale,canSkip),buttonWidth=canSkip?104*scale:0,gap=canSkip?12*scale:0;
 const textWidth=Math.max(1,width-buttonWidth-gap),center=left+textWidth/2;
 const modal=isDialogueModal(canvas),hint=modal?'Clique/toque ou Enter adianta':'Clique/toque no quadro adianta';
 ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;
 ctx.font=`600 ${11*scale}px sans-serif`;ctx.fillText('Avança sozinho',center,top+height/2-6*scale,textWidth);
 ctx.font=`${10.5*scale}px sans-serif`;ctx.fillText(hint,center,top+height/2+7*scale,textWidth);
 let skip=null;
 if(canSkip){
  const x=left+width-buttonWidth,y=top+(height-40*scale)/2;
  ctx.fillStyle=buttonColor;ctx.strokeStyle=color;ctx.lineWidth=scale;
  ctx.beginPath();ctx.roundRect(x,y,buttonWidth,40*scale,8*scale);ctx.fill();ctx.stroke();
  ctx.fillStyle=color;ctx.font=`600 ${12*scale}px sans-serif`;ctx.fillText('Pular cena',x+buttonWidth/2,y+14*scale,buttonWidth-12*scale);
  ctx.font=`${10*scale}px sans-serif`;ctx.fillText('já vista · S',x+buttonWidth/2,y+29*scale,buttonWidth-12*scale);
  skip={x,y:y-2*scale,w:buttonWidth,h:44*scale};
 }
 ctx.restore();return{skip,height};
}
