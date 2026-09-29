// As coordenadas continuam no canvas; apenas os elementos narrativos são reposicionados.
const probes = new WeakMap();

export function intersectCanvasSafeArea(canvas, rect, viewport, insets = {}) {
  const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
  const left = Math.max(rect.left, viewport.left + (insets.left || 0));
  const top = Math.max(rect.top, viewport.top + (insets.top || 0));
  const right = Math.min(rect.left + rect.width, viewport.left + viewport.width - (insets.right || 0));
  const bottom = Math.min(rect.top + rect.height, viewport.top + viewport.height - (insets.bottom || 0));
  return { left: (left-rect.left)*sx, top: (top-rect.top)*sy,
    right: (right-rect.left)*sx, bottom: (bottom-rect.top)*sy, marginX:16*sx, marginY:16*sy };
}

export function getDialogueSafeArea(canvas) {
  const fallback = {left:0,top:0,right:canvas.width,bottom:canvas.height,marginX:0,marginY:0};
  const nav = globalThis.navigator;
  const ios = /iPhone|iPad|iPod/.test(nav?.userAgent || '') || (nav?.platform === 'MacIntel' && nav?.maxTouchPoints > 1);
  if (!ios || !canvas.getBoundingClientRect || typeof document === 'undefined') return fallback;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return fallback;
  let probe = probes.get(document);
  if (!probe) {
    probe = document.createElement('div');
    probe.dataset.dialogueSafeArea = '';
    probe.setAttribute('aria-hidden','true');
    probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
    document.body.appendChild(probe);
    probes.set(document,probe);
  }
  const style = getComputedStyle(probe), visual = window.visualViewport;
  return intersectCanvasSafeArea(canvas, rect, {
    left:visual?.offsetLeft || 0, top:visual?.offsetTop || 0,
    width:visual?.width || window.innerWidth, height:visual?.height || window.innerHeight
  }, {left:parseFloat(style.paddingLeft),right:parseFloat(style.paddingRight),
    top:parseFloat(style.paddingTop),bottom:parseFloat(style.paddingBottom)});
}
