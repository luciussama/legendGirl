export const ARENA_ENEMY_NAMES = Object.freeze({ train:'Locomotiva de Cerco', robot:'Sentinela de Lata', dinosaur:'Dragão de Brinquedo', bear:'Guardião de Pelúcia' });

export function arenaHUDLayout(layout) {
  const pad = 12 * layout.scale, gap = 22 * layout.scale;
  const width = (layout.usableWidth - pad * 2 - gap) / 2;
  const y = layout.safeTop + 42 * layout.scale;
  return { player: { x:layout.safeLeft+pad, y, width, height:16*layout.scale },
    enemy: { x:layout.centerX+gap/2, y, width, height:16*layout.scale },
    labelY: y-10*layout.scale, subtitleY:y+36*layout.scale };
}

/** A vida continua sendo a mesma transferência de corações, com leitura de arena. */
export function renderArenaHUD(ctx, room, state, layout, boss = null) {
  const ui = layout.scale, boxes = arenaHUDLayout(layout);
  ctx.save();
  const shade = ctx.createLinearGradient(0,layout.safeTop,0,layout.safeTop+106*ui);
  shade.addColorStop(0,'rgba(20,12,32,.96)');shade.addColorStop(1,'rgba(20,12,32,0)');
  ctx.fillStyle=shade;ctx.fillRect(layout.safeLeft,layout.safeTop,layout.usableWidth,106*ui);
  const bar = (b,hp,max,color,reverse) => {
    ctx.fillStyle='#382a49';ctx.fillRect(b.x,b.y,b.width,b.height);
    const amount=b.width*Math.max(0,hp/max);ctx.fillStyle=color;
    ctx.fillRect(reverse?b.x+b.width-amount:b.x,b.y,amount,b.height);
    ctx.strokeStyle='#dbb77a';ctx.lineWidth=1.5*ui;ctx.strokeRect(b.x,b.y,b.width,b.height);
  };
  bar(boxes.player,state.player.hp,3,'#f4ca75',false);
  bar(boxes.enemy,state.enemy.hp,state.enemy.maxHp,'#cb748b',true);
  ctx.fillStyle='#fff1d2';ctx.font=`bold ${Math.min(15,layout.usableWidth/26)*ui}px system-ui`;
  ctx.textAlign='left';ctx.fillText('MENINA · A ESPADA DA IMAGINAÇÃO',boxes.player.x,boxes.labelY,boxes.player.width);
  ctx.textAlign='right';ctx.fillText(ARENA_ENEMY_NAMES[state.enemy.actor],boxes.enemy.x+boxes.enemy.width,boxes.labelY,boxes.enemy.width);
  ctx.textAlign='center';ctx.font=`bold ${14*ui}px Georgia`;
  const subtitle=boss?.titleTime>0?'O GUARDIÃO DE PELÚCIA':state.enemy.state==='ENRAGE'?'O GUARDIÃO DESPERTOU':state.transition?'OS BRINQUEDOS GANHAM VIDA':`O QUARTO LENDÁRIO · ${Math.min(4,state.index+1)} / 4`;
  ctx.fillText(subtitle,layout.centerX,boxes.subtitleY,layout.usableWidth-24*ui);
  if (room.mobilePresentation || room.isTouchDevice) {
    const a=layout.action;ctx.fillStyle='rgba(39,24,53,.86)';ctx.beginPath();ctx.arc(a.x,a.y,a.radius,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#e5bd79';ctx.lineWidth=2*ui;ctx.stroke();
    ctx.fillStyle='#fff1d2';ctx.font=`bold ${16*ui}px system-ui`;ctx.fillText('ESPADA',a.x,a.y+5*ui);
    const p=room.touchState, radius=layout.joystickRadius;
    const origin=p.active?{x:p.startX,y:p.startY}:{x:layout.safeLeft+radius+8*ui,y:layout.safeBottom-radius-8*ui};
    ctx.fillStyle='rgba(32,21,48,.58)';ctx.beginPath();ctx.arc(origin.x,origin.y,radius,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(229,189,121,.6)';ctx.stroke();
    ctx.fillStyle='rgba(255,233,183,.65)';ctx.beginPath();ctx.arc(origin.x+(p.active?p.vectorX:0)*radius*.5,origin.y+(p.active?p.vectorY:0)*radius*.5,radius*.28,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff1d2';ctx.font=`${11*ui}px system-ui`;ctx.fillText('PULAR ↑',origin.x,origin.y-radius*.65);ctx.fillText('↓ ABAIXAR',origin.x,origin.y+radius*.8);
  }
  if (state.mode==='VICTORY'||state.mode==='DEFEAT') {
    ctx.fillStyle='rgba(25,15,37,.85)';ctx.fillRect(layout.safeLeft,layout.centerY-55*ui,layout.usableWidth,115*ui);
    ctx.fillStyle='#ffe5a6';ctx.font=`bold ${24*ui}px Georgia`;ctx.textAlign='center';
    ctx.fillText(state.mode==='VICTORY'?'A imaginação venceu.':'Sua aventura ainda não acabou.',layout.centerX,layout.centerY-8*ui,layout.usableWidth-24*ui);
    ctx.font=`${15*ui}px system-ui`;ctx.fillText(state.mode==='DEFEAT'?'Pressione ESPADA para tentar novamente.':'O quarto está chamando você de volta…',layout.centerX,layout.centerY+25*ui,layout.usableWidth-24*ui);
  }
  ctx.restore();
}
