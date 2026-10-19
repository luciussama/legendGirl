import { arenaMobileControlsLayout } from '../ui/MobileUILayout.js';
import { arenaEnemyImpactEnd, arenaEnemyGuarding } from './ArenaCombatRules.js';

export const ARENA_ENEMY_NAMES = Object.freeze({ train:'Locomotiva de Cerco', robot:'Sentinela de Lata', dinosaur:'Dragão de Brinquedo', bear:'Guardião de Pelúcia' });

export function arenaHUDLayout(layout) {
  const pad = 12 * layout.scale, gap = 22 * layout.scale;
  const width = (layout.usableWidth - pad * 2 - gap) / 2;
  const y = layout.safeTop + 42 * layout.scale;
  return { player: { x:layout.safeLeft+pad, y, width, height:16*layout.scale },
    enemy: { x:layout.centerX+gap/2, y, width, height:16*layout.scale },
    labelY: y-10*layout.scale, subtitleY:y+36*layout.scale };
}

function renderArenaMobileControls(ctx, layout, room) {
  const controls = arenaMobileControlsLayout(layout), unit = controls.unit;
  const held = room.arenaTouchButtons ?? {};
  ctx.save();
  ctx.textAlign = 'center';
  const pad=controls.dpad,r=66*unit,h=22*unit;
  ctx.fillStyle='rgba(29,25,39,.72)';ctx.beginPath();ctx.arc(pad.x,pad.y,pad.hitRadius,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.translate(pad.x,pad.y);
  ctx.fillStyle='#494451';ctx.strokeStyle='#c0b7c9';ctx.lineWidth=2*unit;
  ctx.beginPath();ctx.moveTo(-h,-r);ctx.lineTo(h,-r);ctx.lineTo(h,-h);ctx.lineTo(r,-h);
  ctx.lineTo(r,h);ctx.lineTo(h,h);ctx.lineTo(h,r);ctx.lineTo(-h,r);ctx.lineTo(-h,h);
  ctx.lineTo(-r,h);ctx.lineTo(-r,-h);ctx.lineTo(-h,-h);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.restore();
  for (const [direction, button] of Object.entries(controls.directions)) {
    const active = Boolean(held[direction]);
    if(active){ctx.fillStyle='#f5ca72';ctx.beginPath();ctx.roundRect(button.x-18*unit,button.y-18*unit,36*unit,36*unit,5*unit);ctx.fill();}
    ctx.fillStyle = active ? '#35243e' : '#f4ecff';
    ctx.font = `bold ${25*unit}px system-ui`;
    ctx.fillText(({left:'←',right:'→',up:'↑',down:'↓'})[direction], button.x, button.y+8*unit);
  }
  ctx.fillStyle='#2b2533';ctx.beginPath();ctx.arc(pad.x,pad.y,11*unit,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff1d2';ctx.font=`bold ${9*unit}px system-ui`;
  ctx.fillText('↑ PULAR · ↓ ABAIXAR',pad.x,pad.y-pad.hitRadius-9*unit);
  ctx.font=`bold ${8*unit}px system-ui`;ctx.fillText('TRÁS: DEFENDER',pad.x,pad.y+pad.hitRadius+5*unit);

  const drawAction = (button, title, badge, special = false) => {
    const left = button.x - button.width / 2, top = button.y - button.height / 2;
    ctx.fillStyle = special ? 'rgba(69,57,81,.9)' : '#f5ca72';
    ctx.strokeStyle = special ? 'rgba(244,234,213,.72)' : '#fff0c6';
    ctx.lineWidth = 2 * unit;
    ctx.beginPath(); ctx.roundRect(left, top, button.width, button.height, 13 * unit); ctx.fill(); ctx.stroke();
    ctx.fillStyle = special ? '#d8cddd' : '#39263f';
    ctx.font = `bold ${9 * unit}px system-ui`; ctx.fillText(badge, button.x, top + 14 * unit);
    ctx.font = `bold ${10 * unit}px system-ui`; ctx.fillText(title, button.x, top + 31 * unit);
    if (special) {
      ctx.font = `${7 * unit}px system-ui`; ctx.fillText('EM BREVE', button.x, top + 45 * unit);
    }
  };
  drawAction(controls.sword, 'ESPADA', 'X');
  drawAction(controls.special, 'ESPECIAL', 'Y', true);
  ctx.restore();
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
  const e = state.enemy;
  const recoveryStart = arenaEnemyImpactEnd(e);
  const guarded = arenaEnemyGuarding(e);
  const attackHint = ['Laser Beam', 'Rocket Punch'].includes(e.attack) ? 'ABAIXE OU DEFENDA' : 'PULE OU DEFENDA';
  const subtitle=state.transition?'OS BRINQUEDOS GANHAM VIDA':state.guarding?'DEFESA · ESPADA À FRENTE':e.state==='ENRAGE'?'O GUARDIÃO DESPERTOU'
    :guarded?(e.state === 'HIT' ? 'PREPARANDO RESPOSTA · AGUARDE' : `RESPOSTA PROTEGIDA · ${attackHint}`)
    :e.state==='ATTACK'&&e.elapsed>=recoveryStart?'ABERTURA · CONTRA-ATAQUE'
    :boss?.titleTime>0?'O GUARDIÃO DE PELÚCIA':`O QUARTO LENDÁRIO · ${Math.min(4,state.index+1)} / 4`;
  ctx.fillText(subtitle,layout.centerX,boxes.subtitleY,layout.usableWidth-24*ui);
  if (room.mobilePresentation || room.isTouchDevice) {
    renderArenaMobileControls(ctx, layout, room);
  }
  if (state.mode==='VICTORY'||state.mode==='DEFEAT') {
    ctx.fillStyle='rgba(25,15,37,.85)';ctx.fillRect(layout.safeLeft,layout.centerY-55*ui,layout.usableWidth,115*ui);
    ctx.fillStyle='#ffe5a6';ctx.font=`bold ${24*ui}px Georgia`;ctx.textAlign='center';
    ctx.fillText(state.mode==='VICTORY'?'A imaginação venceu.':'Sua aventura ainda não acabou.',layout.centerX,layout.centerY-8*ui,layout.usableWidth-24*ui);
    ctx.font=`${15*ui}px system-ui`;ctx.fillText(state.mode==='DEFEAT'?'Pressione ESPADA para tentar novamente.':'O quarto está chamando você de volta…',layout.centerX,layout.centerY+25*ui,layout.usableWidth-24*ui);
  }
  ctx.restore();
}
