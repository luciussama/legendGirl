import { renderToyRoomTutorial } from './ToyRoomTutorialRenderer.js';
/** Orientação visual; não executa movimento, coleta nem armazenamento. */
import { TOY_ROOM_INPUT } from './ToyRoomInputBindings.js';
export { TOY_ROOM_INPUT } from './ToyRoomInputBindings.js';
export class ToyRoomTutorial {
  constructor(context) {
    this.context=context;
    this.active=false;
    this.step='movement';
    this.device=context.mobilePresentation?'MOBILE_TOUCH':'DESKTOP_KEYBOARD_MOUSE';
    this.target=null;
    this.cooldown=0;
  }
  start() {
    if(this.context.toyRoomTutorialCompleted)return;
    this.active=true;this.step='movement';this.target=null;
    this.origin={x:this.context.player.x,y:this.context.player.y};
    this.context.gameplayState='TOY_ROOM_TUTORIAL';
  }
  setDevice(device){this.device=device;}
  nearest(){
    const p=this.context.player;
    return this.context.toys.filter(t=>!t.isOrganized&&!t.isCarried)
      .reduce((best,t)=>!best||Math.hypot(p.x-t.x,p.y-t.y)<Math.hypot(p.x-best.x,p.y-best.y)?t:best,null);
  }
  finish(){
    this.active=false;this.target=null;
    this.context.toyRoomTutorialCompleted=true;
    this.context.gameplayState='TOY_ROOM_GAMEPLAY';
  }
  update(dt){
    if(!this.active)return;
    const p=this.context.player;
    if(p.carriedItem){this.finish();return;}
    if(this.step==='movement'&&Math.hypot(p.x-this.origin.x,p.y-this.origin.y)>2)this.step='pickup';
    if(this.step!=='pickup')return;
    this.cooldown=Math.max(0,this.cooldown-dt);
    const nearest=this.nearest();
    const distance=t=>t?Math.hypot(p.x-t.x,p.y-t.y):Infinity;
    if(!this.target||this.target.isOrganized||this.target.isCarried||
      (this.cooldown===0&&distance(this.target)>280&&nearest!==this.target&&distance(nearest)+40<distance(this.target))){
      this.target=nearest;this.cooldown=30;
    }
  }
  guidePosition(){
    if(!this.active||!this.target)return null;
    // Margem acima do recorte mais alto, da placa existente e das asas da fadinha.
    return {x:this.target.x,y:this.target.y-105};
  }
  get message(){
    if(this.step==='movement')return {
      MOBILE_TOUCH:'TOQUE E ARRASTE NA TELA PARA ANDAR',
      DESKTOP_KEYBOARD_MOUSE:'USE W A S D OU AS SETAS PARA ANDAR',
      GAMEPAD:'USE O ANALÓGICO ESQUERDO PARA ANDAR'
    }[this.device];
    const guide=this.guidePosition();
    if(!guide||Math.hypot(this.context.fairy.x-guide.x,this.context.fairy.y-guide.y)>14)
      return 'VENHA COMIGO ATÉ O BRINQUEDO';
    return {
      MOBILE_TOUCH:'TOQUE NO BOTÃO PEGAR',
      DESKTOP_KEYBOARD_MOUSE:`PRESSIONE ${TOY_ROOM_INPUT.actionLabel} PARA PEGAR`,
      GAMEPAD:`PRESSIONE ${TOY_ROOM_INPUT.gamepadLabel} PARA PEGAR`
    }[this.device];
  }
  render(ctx,canvas,frame){
    if(!this.active)return;
    renderToyRoomTutorial(ctx, canvas, frame, {
      fairy: this.context.fairy, cameraX: this.context.cameraX, cameraY: this.context.cameraY,
      message: this.message, step: this.step, device: this.device
    });
  }
}
