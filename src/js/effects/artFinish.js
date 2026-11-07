/** Acabamento comum da abertura e do quarto, aplicado antes da interface. */
export function applyArtFinish(ctx, canvas) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // Atenua 12% da saturação sem levantar o preto nem acrescentar iluminação.
  // A composição preserva a luminosidade e aproxima os materiais da mesma paleta.
  ctx.globalCompositeOperation = 'saturation';
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}
