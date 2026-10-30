import {offerDialogue,setDialogueBounds} from '../narrative/DialogueFlow.js';
import {drawDialogueControls} from '../narrative/DialogueControls.js';
import {getDialogueSafeArea} from '../ui/DialogueSafeArea.js';
/** Gravura de abertura: a leitura pertence à cena, sem atualizar a fase por trás dela. */
export function renderChapterCard(ctx,canvas,{image,number,title,age=0,duration=5,onAdvance}={}){
 const {width,height}=canvas,safe=getDialogueSafeArea(canvas),css=width/(canvas.clientWidth||width);
 ctx.save();ctx.fillStyle='#201b20';ctx.fillRect(0,0,width,height);
 if(image){const scale=Math.max(width/image.width,height/image.height)*(1+Math.min(1,age/duration)*.025);ctx.drawImage(image,(width-image.width*scale)/2,(height-image.height*scale)/2,image.width*scale,image.height*scale);}
 const shade=ctx.createLinearGradient(0,0,0,height);shade.addColorStop(0,'rgba(20,13,20,.42)');shade.addColorStop(.5,'rgba(20,13,20,.50)');shade.addColorStop(1,'rgba(20,13,20,.72)');ctx.fillStyle=shade;ctx.fillRect(0,0,width,height);
 const text=`CAPÍTULO ${number} - ${title}`,available=Math.max(100,safe.right-safe.left-40*css),font=Math.min(40*css,Math.max(23*css,available/17));
 ctx.font=`600 ${font}px Georgia,serif`;const lines=[];let line='';for(const word of text.split(' ')){const next=line?line+' '+word:word;if(ctx.measureText(next).width>available&&line){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);
 const lineHeight=font*1.4,centerX=(safe.left+safe.right)/2,centerY=(safe.top+safe.bottom)/2;
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff0d6';ctx.shadowColor='#24151e';ctx.shadowBlur=8*css;
 lines.forEach((value,i)=>ctx.fillText(value,centerX,centerY+(i-(lines.length-1)/2)*lineHeight));ctx.shadowBlur=0;
 if(offerDialogue(canvas,text,onAdvance)){const top=Math.min(safe.bottom-40*css,centerY+lines.length*lineHeight/2+24*css);drawDialogueControls(ctx,canvas,{left:safe.left+20*css,top,width:available,scale:css,color:'#f1dbc0'});setDialogueBounds(canvas,ctx,0,0,width,height);}
 const fade=Math.max(0,1-age/.5,(age-duration+.5)/.5);if(fade>0){ctx.fillStyle=`rgba(20,13,20,${Math.min(1,fade)})`;ctx.fillRect(0,0,width,height);}ctx.restore();
}
