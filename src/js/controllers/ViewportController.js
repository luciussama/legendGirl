// Dimensionamento de apresentação; não atualiza física nem câmera lógica.
export function createViewportController({ canvas, darkCanvas, lighting, host, onOrientation }) {
  function resize() {
    const rect = (canvas && typeof canvas.getBoundingClientRect === 'function') ? canvas.getBoundingClientRect() : null;
    const w = (rect && rect.width > 0) ? rect.width : (host.innerWidth || 960);
    const h = (rect && rect.height > 0) ? rect.height : (host.innerHeight || 540);
    const aspect = (w > 0 && h > 0) ? (w / h) : (16 / 9);
    const isPortrait = aspect < 1.15;
    onOrientation(isPortrait);

    if (isPortrait) {
      // Mobile / Retrato: Mantém FoV amplo (largura 540) e dimensiona a altura ortograficamente
      canvas.width = 540;
      canvas.height = Math.round(540 / aspect) || 960;
    } else {
      // Desktop / Paisagem: Altura base de 540 e dimensiona a largura ortograficamente
      canvas.height = 540;
      canvas.width = Math.round(540 * aspect) || 960;
    }

    darkCanvas.width = canvas.width;
    darkCanvas.height = canvas.height;
    lighting.resize(canvas.width, canvas.height);
  }
  return { resize };
}
