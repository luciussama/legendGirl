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

/** Direcional fixo compacto: a mesma geometria serve ao desenho e ao toque analógico. */
export function arenaMobileControlsLayout(layout) {
  const unit = Math.max(0.1, Math.min(layout.scale, layout.usableWidth / 360, layout.usableHeight / 240));
  const dpadSize = 44 * unit, dpadGap = 0;
  const dpadCenterX = layout.safeLeft + 88 * unit;
  const dpadCenterY = layout.safeBottom - 90 * unit;
  const actionHeight = 58 * unit;
  const actionGap = 8 * unit;
  const swordWidth = 84 * unit, specialWidth = 72 * unit;
  const actionBottom = layout.safeBottom - 16 * unit;
  const special = { x:layout.safeRight - (specialWidth / 2 + 8 * unit), y:actionBottom - actionHeight / 2,
    width:specialWidth, height:actionHeight };
  const sword = { x:special.x - specialWidth / 2 - actionGap - swordWidth / 2, y:special.y,
    width:swordWidth, height:actionHeight };
  return {
    unit, dpadSize, dpadGap,
    dpad: { x:dpadCenterX, y:dpadCenterY, radius:72*unit, hitRadius:80*unit, deadzone:12*unit },
    directions: {
      left: { x:dpadCenterX - 43*unit, y:dpadCenterY, radius:dpadSize / 2 },
      right: { x:dpadCenterX + 43*unit, y:dpadCenterY, radius:dpadSize / 2 },
      up: { x:dpadCenterX, y:dpadCenterY - 43*unit, radius:dpadSize / 2 },
      down: { x:dpadCenterX, y:dpadCenterY + 43*unit, radius:dpadSize / 2 }
    },
    sword, special
  };
}

export function hitArenaMobileControl(layout, x, y) {
  if (!layout.contains(x, y)) return null;
  const controls = arenaMobileControlsLayout(layout);
  for (const name of ['sword', 'special']) {
    const button = controls[name];
    if (x >= button.x - button.width / 2 && x <= button.x + button.width / 2 &&
        y >= button.y - button.height / 2 && y <= button.y + button.height / 2) return name;
  }
  if (Math.hypot(x-controls.dpad.x,y-controls.dpad.y)<=controls.dpad.hitRadius) {
    const vector=arenaDirectionVector(layout,x,y);
    if(Math.abs(vector.x)<0.01&&vector.y<0)return 'up';
    if(Math.abs(vector.x)<0.01&&vector.y>0)return 'down';
    if(Math.abs(vector.y)<0.01&&vector.x<0)return 'left';
    if(Math.abs(vector.y)<0.01&&vector.x>0)return 'right';
    return 'dpad';
  }
  return null;
}

/** O centro nunca muda; arrastar o polegar atravessa as oito direções sem soltar. */
export function arenaDirectionVector(layout,x,y) {
  const {dpad}=arenaMobileControlsLayout(layout),dx=x-dpad.x,dy=y-dpad.y;
  const distance=Math.hypot(dx,dy);
  if(distance<=dpad.deadzone)return {x:0,y:0};
  const angle=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4;
  const intensity=Math.min(1,(distance-dpad.deadzone)/(dpad.radius-dpad.deadzone));
  return {x:Math.cos(angle)*intensity,y:Math.sin(angle)*intensity};
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
