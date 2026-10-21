import { chaseLives, chaseMaxLives, isChaseDefeat } from './ChaseHealth.js';

const MESSAGES = { BEAR_DOWN: 'O urso caiu…', GIRL_APPROACH: 'Ela se aproxima devagar.',
  BEAR_RISE: 'Ele está se levantando!',
  CAUGHT: 'Você alcançou o urso!', CHEST_RETURN: 'De volta ao baú.', COMPLETE: 'Perseguição concluída!',
  GAME_OVER: 'Fim de jogo' };

/** Desenha os corações restantes e vazios no lugar dos textos técnicos da perseguição. */
function renderLives(ctx, w, ui, state, difficulty) {
  const total = chaseMaxLives(difficulty), remaining = chaseLives(state, difficulty);
  const spacing = 30 * ui, width = total * spacing + 22 * ui, x0 = (w - width) / 2;
  ctx.fillStyle = 'rgba(47,25,23,.78)'; ctx.fillRect(x0, 14 * ui, width, 44 * ui);
  for (let i = 0; i < total; i++) {
    const x = x0 + 26 * ui + i * spacing, y = 32 * ui, r = 10 * ui;
    ctx.beginPath(); ctx.moveTo(x, y + r);
    ctx.bezierCurveTo(x - r * 2, y - r * .3, x - r, y - r * 1.4, x, y - r * .4);
    ctx.bezierCurveTo(x + r, y - r * 1.4, x + r * 2, y - r * .3, x, y + r);
    ctx.fillStyle = i < remaining ? '#e48a8c' : '#5b4240'; ctx.fill();
    ctx.strokeStyle = i < remaining ? '#ffe5c1' : '#99736b'; ctx.lineWidth = 1.2 * ui; ctx.stroke();
  }
}

/** Desenha a interface da perseguição em pixels do canvas, sem alterar a simulação. */
export function renderChaseHUD(ctx, canvas, state, error, audioError, difficulty = 'NORMAL') {
  const w = canvas.width, h = canvas.height, ui = Math.max(.7, Math.min(1.3, w / 900));
  ctx.save(); ctx.textAlign = 'center';
  if (!error) renderLives(ctx, w, ui, state, difficulty);
  const text = error || MESSAGES[state.stage];
  if (text) {
    ctx.fillStyle = 'rgba(47,25,23,.85)'; ctx.fillRect(w * .06, 78 * ui, w * .88, (error ? 80 : 48) * ui);
    ctx.fillStyle = '#fff0c8'; ctx.font = `bold ${20 * ui}px Georgia`;
    ctx.fillText(text, w / 2, 108 * ui, w * .8);
    if (error) { ctx.font = `${13 * ui}px sans-serif`; ctx.fillText('Use o seletor de fases para tentar novamente.', w / 2, 139 * ui, w * .8); }
  }
  ctx.fillStyle = 'rgba(47,25,23,.8)'; ctx.fillRect(0, h - 58 * ui, w, 58 * ui);
  ctx.font = `${14 * ui}px sans-serif`; ctx.fillStyle = '#ffedc5';
  ctx.fillText(isChaseDefeat(state.stage) ? 'A menina caiu.' : '← A · desvie · D →', w / 2, h - 32 * ui, w - 25);
  ctx.font = `${11 * ui}px sans-serif`;
  ctx.fillText(audioError || (isChaseDefeat(state.stage) ? 'Escolha a fase novamente no seletor para tentar de novo.' : 'Toque e segure nas laterais · P pausa · M som'), w / 2, h - 12 * ui, w - 25);
  ctx.restore();
}
