import { getDialogueSafeArea } from './DialogueSafeArea.js';
import { isMobileDevice } from '../controllers/MobileZoom.js';

const clamp = (value, min, max) => Math.max(min, Math.min(Math.max(min, max), value));

/** Layout único em coordenadas do canvas; medidas dos controles são pixels CSS. */
export function calculateMobileUILayout(canvas, safe, scale = 1, mobile = true) {
  const safeLeft = safe.left, safeRight = safe.right;
  const safeTop = safe.top, safeBottom = safe.bottom;
  const usableWidth = Math.max(1, safeRight - safeLeft);
  const usableHeight = Math.max(1, safeBottom - safeTop);
  const controlScale = mobile ? Math.min(scale, usableWidth / 220, usableHeight / 220) : 1;
  const padding = 8 * controlScale;
  const radius = 78 * controlScale;
  const action = { x: safeRight - radius - padding, y: safeBottom - radius - padding,
    radius, scale: controlScale };
  const joystickRadius = 74 * controlScale;
  return { safeTop, safeBottom, safeLeft, safeRight, usableWidth, usableHeight, scale,
    centerX: (safeLeft + safeRight) / 2, centerY: (safeTop + safeBottom) / 2,
    hudBottom: safeTop + (usableWidth / scale < 600 ? 134 : 72) * scale,
    action, joystickRadius,
    contains: (x, y) => x >= safeLeft && x <= safeRight && y >= safeTop && y <= safeBottom,
    joystickOrigin: (x, y) => ({
      x: clamp(x, safeLeft + joystickRadius + padding, safeLeft + usableWidth * 0.55 - joystickRadius - padding),
      y: clamp(y, safeTop + joystickRadius + padding, safeBottom - joystickRadius - padding)
    }) };
}

export function getMobileUILayout(canvas) {
  const rect = canvas.getBoundingClientRect?.();
  const scale = canvas.width / (canvas.clientWidth || rect?.width || canvas.width);
  return calculateMobileUILayout(canvas, getDialogueSafeArea(canvas), scale, isMobileDevice());
}

export function isActionControlHit(layout, x, y) {
  return layout.contains(x, y) && Math.hypot(x - layout.action.x, y - layout.action.y) <= layout.action.radius;
}

/** Recalcula os controles HTML quando barras móveis ou orientação mudam. */
export function attachMobileUILayout(canvas, host = window) {
  const update = () => {
    const layout = getMobileUILayout(canvas);
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = canvas.getBoundingClientRect(), container = parent.getBoundingClientRect();
    const sx = rect.width / canvas.width, sy = rect.height / canvas.height;
    const values = {
      top: rect.top - container.top + layout.safeTop * sy,
      right: container.right - (rect.left + layout.safeRight * sx),
      bottom: container.bottom - (rect.top + layout.safeBottom * sy),
      left: rect.left - container.left + layout.safeLeft * sx
    };
    for (const [side, value] of Object.entries(values))
      parent.style.setProperty(`--ui-safe-${side}`, `${Math.max(0, value)}px`);
    canvas.dispatchEvent(new Event('uilayoutchange'));
  };
  host.addEventListener('resize', update);
  host.addEventListener('orientationchange', update);
  host.visualViewport?.addEventListener('resize', update);
  host.visualViewport?.addEventListener('scroll', update);
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
  observer?.observe(canvas);
  update();
  return update;
}
