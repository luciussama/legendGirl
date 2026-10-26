import {offerDialogue,setDialogueBounds} from './DialogueFlow.js';
import { getDialogueSafeArea } from '../ui/DialogueSafeArea.js';
import { renderMobileDialogueRegion } from '../ui/MobileDialogueRegion.js';

// A fonte é local; o carregamento começa antes de qualquer fala da campanha.
if (typeof document !== 'undefined') document.fonts?.load('600 25px "Caveat"').catch(() => {});

export const POETIC_LINES = Object.freeze({
  openingYesterday: 'O quarto era o mesmo.\nSó não a reconhecia.',
  openingPath: 'Cada coisa guardava seu nome.\nEntre elas, nada dizia por onde ir.',
  castle: 'De longe, a porta ainda cumpria sua promessa.',
  falseDoor: 'A madeira caiu.\nA promessa ficou de pé.',
  toyRoomPlay: 'A sala estava cheia.\nNenhum lugar esperava por ela.',
  toyRoomPlace: 'A caixa tinha um fundo.\nO resto está vazio.',
  ending: 'Agora havia espaço no chão.\nNem tudo que ficara de fora era brinquedo.'
});

export function getPauseNarration(state) {
  if (state.isStandbyActive) return null;
  if (state.plotTwistActive) return state.plotTwistStep === 5 && state.plotTwistTimer < 180 ? POETIC_LINES.falseDoor : null;
  return state.cutsceneActive && state.cutsceneStep === 1 && state.cutsceneTimer < 210 ? POETIC_LINES.castle : null;
}

/** Quadro de papel e moldura pastel; a narração ocupa o topo da área segura. */
export function renderPoeticNarration(ctx, canvas, text, options = {}) {
  if(options.interactive!==false&&!offerDialogue(options.advanceCanvas??canvas,text,options.onAdvance))return null;
  const safe = getDialogueSafeArea(canvas);
  const scale = canvas.width / (canvas.clientWidth || canvas.getBoundingClientRect?.().width || canvas.width);
  const width = Math.min(680 * scale, safe.right - safe.left - 32 * scale);
  const font = Math.min(25 * scale, canvas.width * .061), lineHeight = font * 1.22;
  ctx.save();ctx.font = `600 ${font}px "Caveat", "Segoe Print", cursive`;
  const lines = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > width - 56 * scale) { lines.push(line); line = word; }
      else line = next;
    }
    lines.push(line);
  }
  const headingHeight = options.heading ? 30 * scale : 0;
  const height = lines.length * lineHeight + 38 * scale + headingHeight;
  const regions = options.separateScene
    ? renderMobileDialogueRegion(ctx, canvas, safe, height, options.anchor, 'top') : null;
  const x = (safe.left + safe.right) / 2;
  const y = regions?.boxY ?? safe.top + Math.max(16 * scale, safe.marginY);
  const left = x - width / 2, radius = 16 * scale;
  ctx.shadowColor = 'rgba(57,36,34,.2)';ctx.shadowBlur = 12 * scale;ctx.shadowOffsetY = 3 * scale;
  ctx.fillStyle = '#fff5e5';ctx.beginPath();ctx.roundRect(left, y, width, height, radius);ctx.fill();
  ctx.shadowBlur = 0;ctx.shadowOffsetY = 0;
  ctx.strokeStyle = '#d6aeb1';ctx.lineWidth = 3 * scale;ctx.stroke();
  ctx.strokeStyle = '#b8c9bb';ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();ctx.roundRect(left + 7 * scale, y + 7 * scale, width - 14 * scale, height - 14 * scale, 10 * scale);ctx.stroke();
  // Pequenas pétalas nas quinas acompanham o rosa, sálvia e creme do cenário.
  for (const side of [-1, 1]) {
    const px = x + side * (width / 2 - 15 * scale), py = y + 15 * scale;
    ctx.fillStyle = '#e5bec3';
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2;
      ctx.beginPath();ctx.ellipse(px + Math.cos(a) * 4 * scale, py + Math.sin(a) * 4 * scale, 3 * scale, 3 * scale, 0, 0, Math.PI * 2);ctx.fill(); }
    ctx.fillStyle = '#c6ae79';ctx.beginPath();ctx.arc(px, py, 2 * scale, 0, Math.PI * 2);ctx.fill();
  }
  ctx.textAlign = 'center';ctx.textBaseline = 'middle';
  if (options.heading) {
    ctx.font = `600 ${Math.min(21 * scale, font)}px "Caveat", "Segoe Print", cursive`;
    ctx.fillStyle = '#846467';ctx.fillText(options.heading, x, y + 25 * scale, width - 52 * scale);
  }
  ctx.font = `600 ${font}px "Caveat", "Segoe Print", cursive`;ctx.fillStyle = '#513e38';
  const start = y + 19 * scale + headingHeight + lineHeight / 2;
  lines.forEach((line, i) => ctx.fillText(line, x, start + i * lineHeight));
  setDialogueBounds(options.advanceCanvas??canvas,ctx,left,y,width,height);
  ctx.restore();
  return {x, y, width, height, font, lines};
}
