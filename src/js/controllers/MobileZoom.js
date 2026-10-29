/** Ampliação exclusiva de apresentação, sem participação na câmera da simulação. */
export function isMobileDevice(nav = globalThis.navigator) {
  return /Android|iPhone|iPad|iPod/i.test(nav?.userAgent || '') ||
    nav?.userAgentData?.mobile === true ||
    (nav?.platform === 'MacIntel' && nav?.maxTouchPoints > 1);
}

/** Composição fixa por viewport: reserva o rodapé ao toque e inclui todo o arco autorado. */
export function getDarkRoomMobileFrame({ width, height, cameraY, floorY, layout, anticipate = false }) {
  const fit = Math.min(layout.usableWidth / width, layout.usableHeight / height);
  const originY = layout.centerY - height * fit / 2;
  const landscape = layout.usableWidth > layout.usableHeight;
  const touchCenter = layout.safeBottom - Math.min(60 * layout.scale, layout.usableHeight * .12);
  const groundScreen = Math.min(layout.safeTop + layout.usableHeight * (landscape ? .75 : .70),
    touchCenter - 44 * layout.scale);
  const ground = (groundScreen - originY) / fit;
  // Retrato conserva também o espaço das mensagens de nível abaixo dos botões.
  const top = (layout.safeTop + (landscape ? 64 : 178) * layout.scale - originY) / fit;
  // O topo -64 contém o maior salto do mapa, com folga para a pintura da menina.
  // Nenhum ator, apoio ou estado aéreo participa desta escolha.
  const zoom = Math.max(.1, Math.min(.8, (ground - top) / (floorY + 64)));
  // Abrir o quadro não deve trazer a borda de derrota para o meio da imagem.
  const x = anticipate ? Math.max(width * .32, width * (1.02 - zoom)) : width * .1;
  return { zoom, x,
    y: ground - zoom * (floorY - cameraY) };
}

export function getMobileZoomFrame({ enabled, width, height, bounds, anchor, margin = 24, stable = false, anticipate = false }) {
  // Gameplay usa a composição fixa, sem consultar limites de atores ou do próximo apoio.
  if (!enabled) return { zoom: 1, x: 0, y: 0 };
  if (stable) {
    // Enquadramento único para toda a seção, sem recentralizar a menina por salto.
    const zoom = 0.8;
    const x = anticipate ? width * 0.32 : (1 - zoom) * width / 2;
    return { zoom, x, y: (1 - zoom) * height / 2 };
  }
  if (!bounds) return { zoom: 1, x: 0, y: 0 };
  const spanX = Math.max(1, bounds.right - bounds.left);
  const spanY = Math.max(1, bounds.bottom - bounds.top);
  // Até 18% de aproximação; abre o enquadramento se fada e próximo apoio exigirem espaço.
  const zoom = Math.max(1, Math.min(1.18, (width - 2 * margin) / spanX, (height - 2 * margin) / spanY));
  if (zoom === 1) return { zoom: 1, x: 0, y: 0 };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  return { zoom,
    x: clamp(anchor.x * (1 - zoom), margin - bounds.left * zoom, width - margin - bounds.right * zoom),
    y: clamp(anchor.y * (1 - zoom), margin - bounds.top * zoom, height - margin - bounds.bottom * zoom)
  };
}
