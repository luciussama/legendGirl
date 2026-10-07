import { getDialogueSafeArea, getDialogueBoxY } from '../ui/DialogueSafeArea.js';
import { renderMobileDialogueRegion } from '../ui/MobileDialogueRegion.js';

export const POETIC_LINES = Object.freeze({
  openingYesterday: 'Ontem, os pés sabiam onde chegar.',
  openingPath: 'Os brinquedos ficaram.\nO caminho entre eles escapou.',
  castle: 'A porta cabia no olhar.\nO caminho, ainda não.',
  falseDoor: 'A porta mudou de lugar.',
  toyRoomPlay: 'Entre os brinquedos,\ncabia outra brincadeira.',
  toyRoomPlace: 'Faltava um lugar para começar.',
  ending: 'O chão guardou espaço.\nA brincadeira ainda não tinha começado.'
});

export function getPauseNarration(state) {
  if (state.isStandbyActive) return null;
  if (state.plotTwistActive) return state.plotTwistStep === 5 && state.plotTwistTimer < 180 ? POETIC_LINES.falseDoor : null;
  return state.cutsceneActive && state.cutsceneStep === 1 && state.cutsceneTimer < 210 ? POETIC_LINES.castle : null;
}

/** Legenda sem retrato, nome ou comando; chamada somente pelas cenas narrativas. */
export function renderPoeticNarration(ctx, canvas, text, options = {}) {
  const safe = getDialogueSafeArea(canvas);
  const scale = canvas.width / (canvas.clientWidth || canvas.getBoundingClientRect?.().width || canvas.width);
  const width = Math.min(680 * scale, safe.right - safe.left - 32 * scale);
  const font = 17 * scale, lineHeight = 25 * scale;
  ctx.save(); ctx.font = `italic ${font}px Georgia, serif`;
  const lines = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > width - 32 * scale) { lines.push(line); line = word; }
      else line = next;
    }
    lines.push(line);
  }
  const height = (lines.length * 25 + (options.heading ? 68 : 32)) * scale;
  const regions = options.separateScene ? renderMobileDialogueRegion(ctx, canvas, safe, height, options.anchor) : null;
  const x = (safe.left + safe.right) / 2;
  const y = options.panel ? options.panel.y + (options.panel.height - height) / 2
    : options.center ? Math.max(safe.top, (safe.top + safe.bottom - height) / 2)
    : regions?.boxY ?? getDialogueBoxY(safe, height, 28 * scale, options.anchor);
  ctx.fillStyle = 'rgba(12, 10, 20, 0.92)';
  ctx.beginPath(); ctx.roundRect(x - width / 2, y, width, height, 10 * scale); ctx.fill();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#f5eddf';
  if (options.heading) {
    ctx.font = `bold ${18 * scale}px Georgia, serif`;
    ctx.fillStyle = '#f3d58f'; ctx.fillText(options.heading, x, y + 26 * scale, width - 24 * scale);
    ctx.font = `italic ${font}px Georgia, serif`; ctx.fillStyle = '#f5eddf';
  }
  const start = y + (options.heading ? 66 : 28) * scale;
  lines.forEach((line, i) => ctx.fillText(line, x, start + i * lineHeight));
  ctx.restore();
  return {x, y, width, height, font, lines};
}
