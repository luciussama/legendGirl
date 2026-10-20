import { CHASE_CONFIG as C } from './ChaseConfig.js';

const MESSAGES = { BEAR_DOWN: 'O urso caiu…', GIRL_APPROACH: 'Ela se aproxima devagar.',
  BEAR_RISE: 'Ele está se levantando!', CHASE_START: 'Não deixe o urso escapar!',
  CAUGHT: 'Você alcançou o urso!', CHEST_RETURN: 'De volta ao baú.', COMPLETE: 'Prévia concluída.' };

/** Desenha a interface da prévia em pixels do canvas, sem alterar a simulação. */
export function renderChaseHUD(ctx, canvas, state, error, audioError) {
  const w = canvas.width, h = canvas.height, ui = Math.max(.7, Math.min(1.3, w / 900));
  ctx.save(); ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(47,25,23,.8)'; ctx.fillRect(0, 0, w, 70 * ui);
  ctx.fillStyle = '#ffe6b1'; ctx.font = `bold ${18 * ui}px Georgia`;
  ctx.fillText('Perseguição no quarto · prévia', w / 2, 26 * ui, w - 30);
  ctx.font = `${12 * ui}px sans-serif`; ctx.fillStyle = '#fff2d9';
  ctx.fillText('Menina 3D · arte em avaliação · 90 segundos de corrida', w / 2, 49 * ui, w - 30);
  const text = error || MESSAGES[state.stage];
  if (text) {
    ctx.fillStyle = 'rgba(47,25,23,.85)'; ctx.fillRect(w * .06, 78 * ui, w * .88, (error ? 80 : 48) * ui);
    ctx.fillStyle = '#fff0c8'; ctx.font = `bold ${20 * ui}px Georgia`;
    ctx.fillText(text, w / 2, 108 * ui, w * .8);
    if (error) { ctx.font = `${13 * ui}px sans-serif`; ctx.fillText('Use o seletor de fases para tentar novamente.', w / 2, 139 * ui, w * .8); }
  }
  if (state.stage === 'RUNNING') {
    ctx.fillStyle='rgba(47,25,23,.72)';ctx.fillRect(w*.24,75*ui,w*.52,29*ui);
    ctx.font = `bold ${17 * ui}px sans-serif`; ctx.fillStyle = '#fff0c8';
    ctx.fillText(`${Math.floor(state.distance / C.length * 100)}% · Urso a ${state.gap.toFixed(1)} m`, w / 2, 95 * ui, w - 28);
    if (state.stumble > 0) { ctx.fillStyle = '#ffdd94'; ctx.shadowColor='#241b18';ctx.shadowBlur=4*ui;ctx.fillText('Cuidado com os brinquedos!', w / 2, 119 * ui); }
  }
  ctx.fillStyle = 'rgba(47,25,23,.8)'; ctx.fillRect(0, h - 58 * ui, w, 58 * ui);
  ctx.font = `${14 * ui}px sans-serif`; ctx.fillStyle = '#ffedc5';
  ctx.fillText('← A · desvie · D →', w / 2, h - 32 * ui, w - 25);
  ctx.font = `${11 * ui}px sans-serif`;
  ctx.fillText(audioError || 'Toque e segure nas laterais · P pausa · M som', w / 2, h - 12 * ui, w - 25);
  ctx.restore();
}
