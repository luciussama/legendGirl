import {mobileGameControls} from '../ui/TouchGameControls.js';
import {isMobileDevice} from '../controllers/MobileZoom.js';
import {DREAM,DREAM_BY_ID} from './DreamLevel.js';
import {GardenInput,gardenControls} from '../garden/GardenInput.js';
import {getDialogueSafeArea} from '../ui/DialogueSafeArea.js';
/** D-pad de oito direções e pulo amplo no mobile; desktop conserva os alvos anteriores. */
export function dreamControls(canvas,{stage=null,mobile=isMobileDevice()}={}){
  const safe=getDialogueSafeArea(canvas);
  if(mobile)return mobileGameControls(canvas,safe);
  const base=gardenControls(canvas,safe,{mobile:false}),r=Math.max(23,base.left.r),x=safe.left+r*3.3,y=safe.bottom-r*3.3;
  return{left:{x:x-r*2.1,y,r},right:{x:x+r*2.1,y,r},up:{x,y:y-r*2.1,r},down:{x,y:y+r*2.1,r},jump:{...base.jump,r:Math.max(28,base.jump.r)}};
}

/** D-pad compartilhado no mobile; quatro comandos inferiores no desktop. */
export function nightmareControls(canvas){const safe=getDialogueSafeArea(canvas);if(isMobileDevice())return mobileGameControls(canvas,safe);const r=Math.max(24,Math.min((safe.right-safe.left)/11,canvas.height/10,42)),y=safe.bottom-r*1.3;return{left:{x:safe.left+r*1.3,y,r},right:{x:safe.left+r*3.7,y,r},down:{x:safe.right-r*3.7,y,r},jump:{x:safe.right-r*1.3,y,r}};}

/** Só no celular: prepara a altura do salto na seda, sem substituir direção vertical ou salto manuais. */
export function dreamMobileWebInput(state,input,{mobile=isMobileDevice(),seconds=1/60}={}){
  const web=state.player.climb&&DREAM_BY_ID.get(state.player.climb.id),dt=Math.min(.2,Math.max(0,Number(seconds)||0));
  if(!mobile||state.stage!=='RUNNING'||web?.kind!=='web'||input.y||input.jump||!dt)return input;
  const remaining=web.y+state.player.climb.u*web.h-250;
  return remaining>0?{...input,y:-Math.min(1,remaining/(DREAM.climbSpeed*dt))}:input;
}

/** Reaproveita liberação de ponteiros e listeners do jardim; acrescenta eixo vertical para agarrar/escalar. */
export class DreamInput extends GardenInput{
  constructor(canvas,enabled,unlock,scene){super(canvas,enabled,()=>dreamControls(canvas),unlock,scene);const down=this.down;this.down=e=>{if(this.enabled()&&!this.scene()&&['ArrowDown','KeyS'].includes(e.code)){e.preventDefault();this.keys.add(e.code);this.unlock();}else down(e);};}
  sample(){const input=super.sample();if(!this.enabled()||this.scene())return{...input,y:0};const has=name=>[...this.pointers.values()].some(value=>value.split('-').includes(name));let y=Number(this.keys.has('ArrowDown')||this.keys.has('KeyS')||has('down'))-Number(this.keys.has('ArrowUp')||this.keys.has('KeyW')||has('up'));let jump=this.keys.has('Space')||has('jump');let pads=[];try{pads=navigator.getGamepads?.()||[];}catch{/* Teclado e toque permanecem disponíveis. */}for(const p of pads)if(p?.connected){if(Math.abs(p.axes[1]||0)>.2)y=p.axes[1];if(p.buttons[12]?.pressed)y=-1;if(p.buttons[13]?.pressed)y=1;jump||=Boolean(p.buttons[0]?.pressed||p.buttons[2]?.pressed);}return{...input,y,jump:this.blockJumpUntilRelease?false:jump};}
}
