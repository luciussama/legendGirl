/**
 * ToyRoomUI.js
 * Interface de usuário da Sala de Brinquedos:
 * - Card de progresso no canto superior direito: contador de brinquedos arrumados e barra esmeralda
 * - Joystick virtual tátil e botão de ação PEGAR / SOLTAR para dispositivos touch
 * - Flash narrativo de introdução e faixa comemorativa
 * - Faixa festiva de celebração de vitória
 */

export class ToyRoomUI {
  /**
   * Renderiza a interface (HUD) e sobreposições da Sala de Brinquedos
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {object} state Estado da interface
   */
  renderUI(ctx, canvas, state) {
    if (!ctx || !canvas || !state) return;

    ctx.save();
    const {
      organizedCount = 0,
      totalToys = 8,
      isTouchDevice = false,
      touchState = {},
      player = {},
      introAlpha = 0,
      introBannerTimer = 0,
      victoryBannerActive = false,
      victoryBannerTimer = 0
    } = state;

    // Canto Superior Direito: Card de Progresso dos Brinquedos Arrumados
    const cardW = 220;
    const cardH = 46;
    const cardX = canvas.width - cardW - 16;
    const cardY = 16;

    ctx.fillStyle = 'rgba(26, 16, 38, 0.82)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 12);
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 13px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🧸 Brinquedos Arrumados: ${organizedCount}/${totalToys}`, cardX + 16, cardY + 22);

    // Barra de Progresso
    const barW = 188;
    const barH = 8;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(cardX + 16, cardY + 28, barW, barH);
    ctx.fillStyle = '#10b981';
    const progressRatio = totalToys > 0 ? Math.min(1, organizedCount / totalToys) : 0;
    ctx.fillRect(cardX + 16, cardY + 28, barW * progressRatio, barH);

    // 1. Joystick Virtual Dinâmico e Flutuante (Lado Esquerdo da Tela)
    // Instanciado e exibido exclusivamente enquanto o dedo estiver na tela (touchState.active)
    if (touchState && touchState.active) {
      const joyBaseX = touchState.startX;
      const joyBaseY = touchState.startY;

      ctx.save();
      // Aura e Círculo Base Dinâmico
      const baseGrad = ctx.createRadialGradient(joyBaseX, joyBaseY, 10, joyBaseX, joyBaseY, 58);
      baseGrad.addColorStop(0, 'rgba(30, 27, 75, 0.65)');
      baseGrad.addColorStop(1, 'rgba(15, 23, 42, 0.45)');
      ctx.fillStyle = baseGrad;
      ctx.beginPath();
      ctx.arc(joyBaseX, joyBaseY, 56, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Indicadores das 8 Direções Cardeais e Diagonais
      for (let i = 0; i < 8; i++) {
        const tickAngle = i * (Math.PI / 4);
        const innerR = 46;
        const outerR = 56;
        ctx.strokeStyle = (i % 2 === 0) ? 'rgba(254, 240, 138, 0.85)' : 'rgba(254, 240, 138, 0.45)';
        ctx.lineWidth = (i % 2 === 0) ? 2 : 1.5;
        ctx.beginPath();
        ctx.moveTo(joyBaseX + Math.cos(tickAngle) * innerR, joyBaseY + Math.sin(tickAngle) * innerR);
        ctx.lineTo(joyBaseX + Math.cos(tickAngle) * outerR, joyBaseY + Math.sin(tickAngle) * outerR);
        ctx.stroke();
      }

      // Alavanca do Joystick (Limitada pelo raio máximo)
      const dx = (touchState.currentX || joyBaseX) - joyBaseX;
      const dy = (touchState.currentY || joyBaseY) - joyBaseY;
      const dist = Math.hypot(dx, dy);
      const maxRadius = 46;
      const clampedD = Math.min(dist, maxRadius);
      const stickX = dist > 0 ? joyBaseX + (dx / dist) * clampedD : joyBaseX;
      const stickY = dist > 0 ? joyBaseY + (dy / dist) * clampedD : joyBaseY;

      // Sombra da Alavanca
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(stickX + 2, stickY + 3, 24, 0, Math.PI * 2);
      ctx.fill();

      // Corpo da Alavanca em Dourado / Âmbar
      const stickGrad = ctx.createRadialGradient(stickX - 5, stickY - 5, 2, stickX, stickY, 24);
      stickGrad.addColorStop(0, '#fef08a');
      stickGrad.addColorStop(0.65, '#facc15');
      stickGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = stickGrad;
      ctx.beginPath();
      ctx.arc(stickX, stickY, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    }

    // 2. Botão de Ação Tátil (Canto Inferior Direito) com Hitbox Ampla e Clara
    const btnRadius = state.actionBtnPressed ? 42 : 48;
    const btnX = canvas.width - 85;
    const btnY = canvas.height - 85;

    const isCarrying = Boolean(player && player.carriedItem);
    const isNearChest = Boolean(state.isNearChest);
    const canInteract = Boolean(state.canInteract);

    ctx.save();

    // Delimitação sutil e elegante da Zona de Toque Ampla (Hitbox Generosa)
    ctx.strokeStyle = canInteract || isCarrying ? 'rgba(250, 204, 21, 0.35)' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(btnX, btnY, 78, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Pulso luminoso de destaque quando há interação disponível
    if (canInteract || isCarrying) {
      const pulse = Math.sin(performance.now() * 0.008) * 5;
      ctx.strokeStyle = isCarrying ? 'rgba(52, 211, 153, 0.65)' : 'rgba(250, 204, 21, 0.75)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(btnX, btnY, btnRadius + 8 + pulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Sombra do botão
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.arc(btnX + 3, btnY + 4, btnRadius, 0, Math.PI * 2);
    ctx.fill();

    // Gradiente do botão baseado no estado
    const btnGrad = ctx.createLinearGradient(btnX - btnRadius, btnY - btnRadius, btnX + btnRadius, btnY + btnRadius);
    if (isNearChest && isCarrying) {
      btnGrad.addColorStop(0, '#38bdf8');
      btnGrad.addColorStop(1, '#0284c7');
    } else if (isCarrying) {
      btnGrad.addColorStop(0, '#34d399');
      btnGrad.addColorStop(1, '#059669');
    } else {
      btnGrad.addColorStop(0, '#fde047');
      btnGrad.addColorStop(1, '#d97706');
    }

    ctx.fillStyle = btnGrad;
    ctx.beginPath();
    ctx.arc(btnX, btnY, btnRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = state.actionBtnPressed ? '#fef08a' : '#ffffff';
    ctx.lineWidth = state.actionBtnPressed ? 4 : 3;
    ctx.stroke();

    // Tipografia nítida e ícone explicativo
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let mainText = 'PEGAR';
    let subText = '✋ TOQUE';
    let textColor = '#451a03';

    if (isNearChest && isCarrying) {
      mainText = 'GUARDAR';
      subText = '🎁 NO BAÚ';
      textColor = '#ffffff';
    } else if (isCarrying) {
      mainText = 'SOLTAR';
      subText = '📦 NO CHÃO';
      textColor = '#ffffff';
    }

    ctx.fillStyle = textColor;
    ctx.font = 'bold 14px Georgia, serif';
    ctx.fillText(mainText, btnX, btnY - 7);

    ctx.font = 'bold 10px Georgia, serif';
    ctx.fillText(subText, btnX, btnY + 11);

    ctx.restore();

    // Efeito de Transição Narrativa e Faixa Inicial
    if (introAlpha > 0.02) {
      ctx.fillStyle = `rgba(255, 250, 235, ${introAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (introBannerTimer > 0) {
      ctx.fillStyle = 'rgba(24, 16, 35, 0.88)';
      ctx.fillRect(canvas.width / 2 - 260, 80, 520, 58);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(canvas.width / 2 - 260, 80, 520, 58);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 18px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ BEM-VINDA À SALA DE BRINQUEDOS! ✨', canvas.width / 2, 106);
      ctx.fillStyle = '#f9fafb';
      ctx.font = '13px Georgia, serif';
      ctx.fillText('Explore livremente o chão colorido e guarde os brinquedos no baú!', canvas.width / 2, 126);
    }

    // Faixa Comemorativa de Vitória
    if (victoryBannerActive && victoryBannerTimer > 0) {
      ctx.fillStyle = 'rgba(24, 16, 35, 0.92)';
      ctx.fillRect(canvas.width / 2 - 280, canvas.height / 2 - 70, 560, 140);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.strokeRect(canvas.width / 2 - 280, canvas.height / 2 - 70, 560, 140);

      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 24px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎉 MISSÃO CUMPRIDA COM AMOR! 🎉', canvas.width / 2, canvas.height / 2 - 25);
      ctx.fillStyle = '#fef3c7';
      ctx.font = '15px Georgia, serif';
      ctx.fillText('A Sala de Brinquedos está toda arrumada e cheia de luz!', canvas.width / 2, canvas.height / 2 + 10);
      ctx.fillText('A menininha e sua fadinha podem brincar felizes para sempre!', canvas.width / 2, canvas.height / 2 + 38);
    }

    ctx.restore();
  }
}

export const toyRoomUI = new ToyRoomUI();
