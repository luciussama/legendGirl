/** Orientação visual; não executa movimento, coleta nem armazenamento. */
export const TOY_ROOM_INPUT = Object.freeze({actionCodes:['KeyE','Space','Enter','KeyF'], actionLabel:'E', gamepadButton:2, gamepadLabel:'X'});
export class ToyRoomTutorial {
  constructor(phase) {
    this.phase=phase;
    this.active=false;
    this.step='movement';
    this.device=phase.mobilePresentation?'MOBILE_TOUCH':'DESKTOP_KEYBOARD_MOUSE';
    this.target=null;
    this.cooldown=0;
  }
  start() {
    if(this.phase.toyRoomTutorialCompleted)return;
    this.active=true;this.step='movement';this.target=null;
    this.origin={x:this.phase.player.x,y:this.phase.player.y};
    this.phase.gameplayState='TOY_ROOM_TUTORIAL';
  }
  setDevice(device){this.device=device;}
  nearest(){
    const p=this.phase.player;
    return this.phase.toys.filter(t=>!t.isOrganized&&!t.isCarried)
      .reduce((best,t)=>!best||Math.hypot(p.x-t.x,p.y-t.y)<Math.hypot(p.x-best.x,p.y-best.y)?t:best,null);
  }
  finish(){
    this.active=false;this.target=null;
    this.phase.toyRoomTutorialCompleted=true;
    this.phase.gameplayState='TOY_ROOM_GAMEPLAY';
  }
  update(dt){
    if(!this.active)return;
    const p=this.phase.player;
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
    if(!guide||Math.hypot(this.phase.fairy.x-guide.x,this.phase.fairy.y-guide.y)>14)
      return 'VENHA COMIGO ATÉ O BRINQUEDO';
    return {
      MOBILE_TOUCH:'TOQUE NO BOTÃO PEGAR',
      DESKTOP_KEYBOARD_MOUSE:`PRESSIONE ${TOY_ROOM_INPUT.actionLabel} PARA PEGAR`,
      GAMEPAD:`PRESSIONE ${TOY_ROOM_INPUT.gamepadLabel} PARA PEGAR`
    }[this.device];
  }
  render(ctx,canvas,frame){
    if(!this.active)return;
    const phase=this.phase,fairy=phase.fairy;
    const x=frame.x+(fairy.x-phase.cameraX)*frame.zoom;
    const y=frame.y+(fairy.y-phase.cameraY)*frame.zoom;
    const scale=canvas.width/(canvas.getBoundingClientRect?.().width||canvas.width);
    const font=Math.max(12*scale,Math.min(17*scale,canvas.width/25));
    const width=Math.min(canvas.width-24*scale,360*scale);
    ctx.save();ctx.font=`bold ${font}px Georgia, serif`;ctx.textAlign='center';ctx.textBaseline='middle';
    const lines=[];let line='';
    for(const word of this.message.split(' ')){
      const candidate=line?line+' '+word:word;
      if(line&&ctx.measureText(candidate).width>width-24*scale){lines.push(line);line=word;}else line=candidate;
    }
    lines.push(line);
    const height=(lines.length*font*1.35)+42*scale;
    const left=Math.max(12*scale,Math.min(canvas.width-width-12*scale,x-width/2));
    const top=Math.max(85*scale,Math.min(canvas.height-height-160*scale,y-height-28*scale));
    ctx.fillStyle='rgba(57,35,22,0.94)';ctx.beginPath();ctx.roundRect(left,top,width,height,12*scale);ctx.fill();
    ctx.fillStyle='#fff4cb';lines.forEach((text,i)=>ctx.fillText(text,left+width/2,top+18*scale+i*font*1.35));
    ctx.font=`${Math.min(font,13*scale)}px Georgia, serif`;
    ctx.fillText('Pegue um brinquedo e leve ao baú.',left+width/2,top+height-17*scale);
    // O ponteiro pertence à fala da guia e não delimita superfícies ou áreas físicas.
    if(this.step==='pickup'){
      ctx.fillStyle='#fde4a2';ctx.beginPath();ctx.moveTo(x-5*scale,y+22*scale);ctx.lineTo(x+5*scale,y+22*scale);ctx.lineTo(x,y+31*scale);ctx.fill();
      ctx.font=`bold ${13*scale}px Georgia, serif`;
      ctx.fillStyle='#fff4cb';ctx.strokeStyle='#392316';ctx.lineWidth=4*scale;
      const action=this.device==='MOBILE_TOUCH'?'PEGAR ↓':`${this.device==='GAMEPAD'?TOY_ROOM_INPUT.gamepadLabel:TOY_ROOM_INPUT.actionLabel} · PEGAR ↓`;
      ctx.strokeText(action,canvas.width-85,canvas.height-145);
      ctx.fillText(action,canvas.width-85,canvas.height-145);
    }
    ctx.restore();
  }
}
