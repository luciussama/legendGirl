/** Enquadramento visual: nunca participa da simulação nem altera coordenadas do mundo. */
export function androidFrameOffset({ enabled, height, cssHeight, bottomInset = 0, topInset = 0, feetY, topY }) {
  if (!enabled || !height || !cssHeight) return 0;
  const scale = height / cssHeight;
  // Reserva para o polegar mesmo quando o navegador não informa os insets do sistema.
  const bottom = Math.max(height * 0.30, (72 + bottomInset) * scale);
  const desired = Math.max(0, feetY - (height - bottom));
  // Não retirar do topo os apoios ou a personagem que já estavam visíveis.
  return Math.min(desired, Math.max(0, topY - (16 + topInset) * scale));
}

export function createAndroidFraming(canvas) {
  const nav = globalThis.navigator;
  const enabled = /Android/i.test(nav?.userAgent || '') || nav?.userAgentData?.platform === 'Android';
  let probe;
  if (enabled && typeof document !== 'undefined') {
    probe = document.createElement('div');
    probe.dataset.androidSafeArea = '';
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding-bottom:env(safe-area-inset-bottom,0px);padding-top:env(safe-area-inset-top,0px)';
    document.body.appendChild(probe);
  }
  return {
    offset(feetY, topY) {
      if (!enabled) return 0;
      const style = probe ? getComputedStyle(probe) : null;
      return androidFrameOffset({ enabled, height: canvas.height,
        cssHeight: canvas.getBoundingClientRect().height,
        bottomInset: parseFloat(style?.paddingBottom) || 0,
        topInset: parseFloat(style?.paddingTop) || 0, feetY, topY });
    }
  };
}
