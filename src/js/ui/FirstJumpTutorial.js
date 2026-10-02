import { isMobileDevice } from '../controllers/MobileZoom.js';
import { getDialogueSafeArea } from './DialogueSafeArea.js';

export const FIRST_JUMP_MESSAGES = Object.freeze({
  touch: 'TOQUE NA TELA PARA PULAR', keyboard: 'PRESSIONE ESPAÇO',
  mouse: 'CLIQUE COM O MOUSE', gamepad: 'PRESSIONE A'
});

/** Detecta a entrada atual sem modificar estado, física ou mapeamento do gameplay. */
export function getFirstJumpTutorialDevice({ device, nav = globalThis.navigator, coarse } = {}) {
  let connected = false;
  try { connected = Array.from(nav?.getGamepads?.() || []).some(p => p?.connected); } catch { /* API indisponível. */ }
  if (device === 'gamepad' && connected) return 'gamepad';
  if (['touch', 'mouse', 'keyboard'].includes(device)) return device;
  if (connected) return 'gamepad';
  const touch = coarse ?? globalThis.matchMedia?.('(pointer: coarse)')?.matches;
  return touch || isMobileDevice(nav) ? 'touch' : 'keyboard';
}

/** Relógio somente visual: a pulsação continua mesmo com o tick da simulação congelado. */
export function getFirstJumpFeedback(timeMs, reducedMotion = false) {
  const wave = reducedMotion ? 0 : Math.sin(timeMs * Math.PI * 2 / 1600);
  return { scale: 1 + wave * 0.04, glow: 0.16 + wave * 0.04, bob: wave * 3 };
}

function drawInputIcon(ctx, kind, x, y, unit, pulse) {
  ctx.save();ctx.translate(x, y);ctx.scale(unit * pulse.scale, unit * pulse.scale);
  ctx.strokeStyle = '#fff3cb';ctx.fillStyle = '#fff3cb';ctx.lineWidth = 1.8;
  ctx.shadowColor = kind === 'gamepad' ? '#7cdda0' : '#f5d994';ctx.shadowBlur = 5;
  if (kind === 'gamepad') {
    ctx.fillStyle = '#238b45';ctx.beginPath();ctx.arc(0, 0, 13, 0, Math.PI * 2);ctx.fill();
    ctx.shadowBlur = 0;ctx.strokeStyle = '#9ce4ab';ctx.stroke();
    ctx.fillStyle = '#fff';ctx.font = 'bold 16px system-ui, sans-serif';ctx.textAlign = 'center';ctx.textBaseline = 'middle';ctx.fillText('A', 0, 1);
  } else if (kind === 'keyboard') {
    ctx.beginPath();ctx.roundRect(-23, -11, 46, 22, 4);ctx.stroke();
    ctx.shadowBlur = 0;ctx.font = 'bold 9px system-ui, sans-serif';ctx.textAlign = 'center';ctx.textBaseline = 'middle';ctx.fillText('ESPAÇO', 0, 0);
  } else if (kind === 'mouse') {
    ctx.beginPath();ctx.roundRect(-9, -14, 18, 28, 9);ctx.stroke();
    ctx.globalAlpha = 0.35;ctx.beginPath();ctx.roundRect(-7, -11, 6, 10, 3);ctx.fill();ctx.globalAlpha = 1;
    ctx.beginPath();ctx.moveTo(0, -12);ctx.lineTo(0, -2);ctx.stroke();
  } else {
    // Dedo indicador erguido e palma pequena; os arcos representam o toque.
    ctx.beginPath();ctx.moveTo(-3, 9);ctx.lineTo(-10, 0);ctx.quadraticCurveTo(-11, -4, -7, -3);
    ctx.lineTo(-3, 1);ctx.lineTo(-3, -12);ctx.quadraticCurveTo(0, -17, 3, -12);
    ctx.lineTo(3, -2);ctx.quadraticCurveTo(12, -3, 11, 6);ctx.lineTo(8, 13);ctx.lineTo(-1, 13);ctx.closePath();ctx.stroke();
    ctx.globalAlpha = 0.6;ctx.beginPath();ctx.arc(0, -13, 8, Math.PI, Math.PI * 2);ctx.stroke();
  }
  ctx.restore();
}

/** Sobreposição compacta em tela, ancorada à pose realmente desenhada da personagem. */
export function renderFirstJumpTutorial(ctx, canvas, { state, baby, fairy, platform, cameraX, transform, device, timeMs = globalThis.performance?.now?.() || 0,
  reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false }) {
  if (state.gameplayState !== 'FIRST_JUMP_TUTORIAL' || !platform) return null;
  const kind = getFirstJumpTutorialDevice({ device });
  const text = FIRST_JUMP_MESSAGES[kind];
  const pulse = getFirstJumpFeedback(timeMs, reducedMotion);
  const safe = getDialogueSafeArea(canvas);
  const ratio = canvas.width / (canvas.getBoundingClientRect?.().width || canvas.width);
  const scale = Math.max(1, ratio), gap = 16 * scale;
  const project = (x, y) => ({ x: transform.a * (x - cameraX) + transform.c * y + transform.e,
    y: transform.b * (x - cameraX) + transform.d * y + transform.f });
  const player = [project(baby.x, baby.y), project(baby.x + baby.w, baby.y + baby.h)];
  const support = platform.standRegion || platform;
  const target = project(support.x + support.w / 2, platform.surfaceTopY ?? support.y);
  const fairyTop = fairy ? project(fairy.x, fairy.y - 28).y : Infinity;
  const head = Math.min(player[0].y, player[1].y), left = Math.min(player[0].x, player[1].x);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `bold ${16 * scale}px system-ui, sans-serif`;
  const iconWidth = (kind === 'keyboard' ? 54 : 38) * scale;
  const width = Math.min(ctx.measureText(text).width + iconWidth + 24 * scale, safe.right - safe.left - 16 * scale);
  const height = 42 * scale;
  const x = Math.max(safe.left + 8 * scale, Math.min(left, safe.right - width - 8 * scale));
  // Fica acima da menina e do destino; nunca ocupa o corpo ou a superfície de chegada.
  const y = Math.max(safe.top + 8 * scale, Math.min(head, target.y, fairyTop) - gap - height);
  ctx.shadowColor = `rgba(245,217,148,${pulse.glow})`;ctx.shadowBlur = 8 * scale;
  ctx.fillStyle = 'rgba(15, 10, 25, 0.78)';
  ctx.beginPath();ctx.roundRect(x, y, width, height, 8 * scale);ctx.fill();
  ctx.shadowBlur = 0;
  drawInputIcon(ctx, kind, x + iconWidth / 2 + 8 * scale, y + height / 2, scale, pulse);
  ctx.fillStyle = '#fff3cb';ctx.textAlign = 'center';ctx.textBaseline = 'middle';
  ctx.fillText(text, x + iconWidth + (width - iconWidth) / 2, y + height / 2, width - iconWidth - 16 * scale);
  // Seta flutuante sobre o destino, sem traços sobre a superfície ilustrada.
  ctx.save();ctx.translate(target.x, target.y - (26 + pulse.bob) * scale);
  ctx.scale(scale * pulse.scale, scale * pulse.scale);
  ctx.strokeStyle = '#f5d994';ctx.lineWidth = 2.5;ctx.lineCap = 'round';ctx.lineJoin = 'round';
  ctx.shadowColor = `rgba(245,217,148,${pulse.glow + 0.12})`;ctx.shadowBlur = 7;
  ctx.beginPath();ctx.moveTo(0, -11);ctx.lineTo(0, 10);
  ctx.moveTo(-7, 3);ctx.lineTo(0, 10);ctx.lineTo(7, 3);ctx.stroke();ctx.restore();
  ctx.restore();
  return { device: kind, text, box: { x, y, width, height }, player, target, feedback: pulse, icon: kind };
}
