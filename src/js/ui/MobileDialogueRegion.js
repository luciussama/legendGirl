import { isMobileDevice } from '../controllers/MobileZoom.js';

const scenes = new WeakMap();

/** Duas regiões sem interseção, em coordenadas de apresentação do canvas. */
export function getMobileDialogueRegions(safe, contentHeight) {
  const gap = Math.max(12, safe.marginY);
  const available = safe.bottom - safe.top;
  const bottom = safe.bottom - Math.max(gap * 2, available * 0.12);
  // Reserva constante entre falas; cresce apenas se o conteúdo realmente exigir.
  const panelHeight = Math.max(180, contentHeight + 24);
  const panelTop = bottom - panelHeight;
  return {
    scene: { x: safe.left, y: safe.top + gap, width: safe.right - safe.left,
      height: Math.max(1, panelTop - gap - (safe.top + gap)) },
    panel: { x: safe.left, y: panelTop, width: safe.right - safe.left, height: panelHeight },
    boxY: panelTop + (panelHeight - contentHeight) / 2
  };
}

/** A cena recebe um viewport próprio; o painel nunca é desenhado sobre a fase. */
export function renderMobileDialogueRegion(ctx, canvas, safe, contentHeight, anchor = {}) {
  if (!isMobileDevice() || typeof document === 'undefined') return null;
  const layout = getMobileDialogueRegions(safe, contentHeight);
  let scene = scenes.get(canvas);
  if (!scene) { scene = document.createElement('canvas'); scenes.set(canvas, scene); }
  if (scene.width !== canvas.width) scene.width = canvas.width;
  if (scene.height !== canvas.height) scene.height = canvas.height;
  const source = scene.getContext('2d');
  source.clearRect(0, 0, scene.width, scene.height);
  source.drawImage(canvas, 0, 0);

  const region = layout.scene;
  const top = Number.isFinite(anchor.top) ? anchor.top : canvas.height * 0.35;
  const bottom = Number.isFinite(anchor.bottom) ? anchor.bottom : canvas.height * 0.65;
  const focusY = (top + bottom) / 2;
  const scale = Math.min(1, region.height / Math.max(1, bottom - top + 32));
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#08070b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.beginPath();ctx.rect(region.x, region.y, region.width, region.height);ctx.clip();
  ctx.translate(canvas.width / 2, region.y + region.height / 2);
  ctx.scale(scale, scale);
  ctx.drawImage(scene, -canvas.width / 2, -focusY);
  ctx.restore();
  ctx.fillStyle = '#100c1a';
  ctx.fillRect(layout.panel.x, layout.panel.y, layout.panel.width, layout.panel.height);
  ctx.restore();
  return layout;
}
