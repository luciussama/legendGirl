/**
 * ToyRenderer.js
 * Renderiza brinquedos interativos individuais no estilo estético de Legend of Mana:
 * - Ursinho de pelúcia, locomotiva de madeira, robô retro turquesa, coelhinho pastel, patinho real de borracha,
 *   torre de blocos coloridos, tamborzinho encantado, palhacinho na caixa de surpresa.
 * - Auras de pulso dourado interativas e indicadores visuais "▼ PEGAR".
 */

export class ToyRenderer {
  /**
   * Renderiza um brinquedo individual
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} t Objeto de dados do brinquedo
   * @param {number} playerX
   * @param {number} playerY
   * @param {boolean} isCarrying
   * @param {number} [time]
   */
  renderToy(ctx, t, playerX = 0, playerY = 0, isCarrying = false, time = performance.now()) {
    if (!ctx || !t || t.isOrganized) return;

    ctx.save();
    const tx = t.x;
    const ty = t.y;

    // Verifica a distância até a jogadora para exibir o brilho de destaque interativo
    const distToPlayer = Math.hypot(playerX - tx, playerY - ty);
    const isTargeted = !isCarrying && distToPlayer < 88;

    // Sombra suave no chão se o brinquedo não estiver sendo carregado
    if (!t.isCarried) {
      ctx.fillStyle = 'rgba(100, 45, 10, 0.3)';
      ctx.beginPath();
      ctx.ellipse(tx, ty + (t.h || 20) / 2 - 2, (t.w || 20) / 2 + 3, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Aura interativa dourada pulsante e indicador flutuante
    if (isTargeted) {
      const pulse = Math.sin(time * 0.008) * 4;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(tx, ty, 30 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      // Indicador flutuante "▼ PEGAR"
      const bounceY = ty - 42 + Math.sin(time * 0.01) * 4;
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(tx - 32, bounceY - 14, 64, 20);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(tx - 32, bounceY - 14, 64, 20);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 11px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('▼ PEGAR', tx, bounceY);
    }

    // Desenho artístico de cada brinquedo
    if (t.type === 'teddy') {
      // Ursinho Felpudo
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(tx - 14, ty - 16, 8, 0, Math.PI * 2);
      ctx.arc(tx + 14, ty - 16, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(tx, ty - 8, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(tx, ty + 12, 16, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.ellipse(tx, ty - 5, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(tx, ty - 7, 3, 0, Math.PI * 2);
      ctx.arc(tx - 6, ty - 11, 2.5, 0, Math.PI * 2);
      ctx.arc(tx + 6, ty - 11, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(tx - 9, ty + 1);
      ctx.lineTo(tx + 9, ty + 1);
      ctx.lineTo(tx, ty - 2);
      ctx.closePath();
      ctx.fill();
    } else if (t.type === 'train') {
      // Locomotiva de Trem de Madeira
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(tx - 20, ty - 14, 20, 26);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(tx, ty - 6, 22, 18);

      ctx.fillStyle = '#facc15';
      ctx.fillRect(tx + 12, ty - 18, 6, 12);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(tx - 10, ty + 14, 7, 0, Math.PI * 2);
      ctx.arc(tx + 10, ty + 14, 7, 0, Math.PI * 2);
      ctx.fill();
    } else if (t.type === 'robot') {
      // Robô Retrô Faísca
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(tx - 14, ty - 18, 28, 24);

      ctx.fillStyle = '#facc15';
      ctx.fillRect(tx - 2, ty - 25, 4, 8);
      ctx.beginPath();
      ctx.arc(tx, ty - 27, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.fillRect(tx - 10, ty - 12, 20, 8);

      ctx.fillStyle = '#0891b2';
      ctx.fillRect(tx - 12, ty + 6, 24, 20);

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(tx, ty + 16, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (t.type === 'bunny') {
      // Coelhinho de Pelúcia
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.ellipse(tx - 8, ty - 24, 6, 16, -0.2, 0, Math.PI * 2);
      ctx.ellipse(tx + 8, ty - 24, 6, 16, 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(tx, ty - 6, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(tx, ty + 12, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#db2777';
      ctx.beginPath();
      ctx.arc(tx - 5, ty - 8, 2, 0, Math.PI * 2);
      ctx.arc(tx + 5, ty - 8, 2, 0, Math.PI * 2);
      ctx.arc(tx, ty - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (t.type === 'duck') {
      // Patinho Real de Borracha
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(tx, ty - 6, 14, 0, Math.PI * 2);
      ctx.ellipse(tx - 4, ty + 10, 18, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.ellipse(tx + 14, ty - 4, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.moveTo(tx - 8, ty - 18);
      ctx.lineTo(tx - 5, ty - 25);
      ctx.lineTo(tx, ty - 20);
      ctx.lineTo(tx + 5, ty - 25);
      ctx.lineTo(tx + 8, ty - 18);
      ctx.closePath();
      ctx.fill();
    } else if (t.type === 'blocks') {
      // Torre de Blocos Coloridos
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(tx - 16, ty + 8, 32, 14);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(tx - 14, ty - 4, 28, 12);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(tx - 10, ty - 16, 20, 12);
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(tx - 10, ty - 16);
      ctx.lineTo(tx, ty - 28);
      ctx.lineTo(tx + 10, ty - 16);
      ctx.closePath();
      ctx.fill();
    } else if (t.type === 'drum') {
      // Tamborzinho Encantado
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(tx, ty + 8, 18, 8, 0, 0, Math.PI * 2);
      ctx.rect(tx - 18, ty - 6, 36, 14);
      ctx.fill();

      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.ellipse(tx, ty - 6, 18, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tx - 16, ty - 4);
      ctx.lineTo(tx - 6, ty + 8);
      ctx.lineTo(tx + 4, ty - 4);
      ctx.lineTo(tx + 14, ty + 8);
      ctx.stroke();
    } else if (t.type === 'jack') {
      // Palhacinho na Caixa de Surpresa
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(tx - 14, ty + 2, 28, 24);

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(tx, ty + 6);
      ctx.lineTo(tx + 8, ty + 14);
      ctx.lineTo(tx, ty + 22);
      ctx.lineTo(tx - 8, ty + 14);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tx, ty + 2);
      ctx.lineTo(tx - 4, ty - 4);
      ctx.lineTo(tx + 4, ty - 8);
      ctx.lineTo(tx, ty - 14);
      ctx.stroke();

      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(tx, ty - 16, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export const toyRenderer = new ToyRenderer();
