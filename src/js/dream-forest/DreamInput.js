import {GardenInput,gardenControls} from '../garden/GardenInput.js';
import {getDialogueSafeArea} from '../ui/DialogueSafeArea.js';
/** Direcional de escalada e salto separados, com alvos de toque simultâneos. */
export function dreamControls(canvas){const safe=getDialogueSafeArea(canvas),base=gardenControls(canvas,safe),r=Math.max(23,base.left.r),x=safe.left+r*3.3,y=safe.bottom-r*3.3;return{left:{x:x-r*2.1,y,r},right:{x:x+r*2.1,y,r},up:{x,y:y-r*2.1,r},down:{x,y:y+r*2.1,r},jump:{...base.jump,r:Math.max(28,base.jump.r)}};}

/** Reaproveita liberação de ponteiros e listeners do jardim; acrescenta eixo vertical para agarrar/escalar. */
export class DreamInput extends GardenInput{
  constructor(canvas,enabled,unlock,scene){super(canvas,enabled,()=>dreamControls(canvas),unlock,scene);const down=this.down;this.down=e=>{if(this.enabled()&&!this.scene()&&['ArrowDown','KeyS'].includes(e.code)){e.preventDefault();this.keys.add(e.code);this.unlock();}else down(e);};}
  sample(){const input=super.sample();if(!this.enabled()||this.scene())return{...input,y:0};const has=name=>[...this.pointers.values()].includes(name);let y=Number(this.keys.has('ArrowDown')||this.keys.has('KeyS')||has('down'))-Number(this.keys.has('ArrowUp')||this.keys.has('KeyW')||has('up'));let jump=this.keys.has('Space')||has('jump');let pads=[];try{pads=navigator.getGamepads?.()||[];}catch{/* Teclado e toque permanecem disponíveis. */}for(const p of pads)if(p?.connected){if(Math.abs(p.axes[1]||0)>.2)y=p.axes[1];if(p.buttons[12]?.pressed)y=-1;if(p.buttons[13]?.pressed)y=1;jump||=Boolean(p.buttons[0]?.pressed||p.buttons[2]?.pressed);}return{...input,y,jump:this.blockJumpUntilRelease?false:jump};}
}
