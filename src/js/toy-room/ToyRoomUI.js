/**
 * ToyRoomUI.js
 * User interface overlay for Toy Room:
 * - Top-right progress card: Toys sorted counter and emerald progress bar
 * - Touch virtual joystick and tactile PEGAR / SOLTAR action button
 * - Narrative intro flash & banner
 * - Victory celebration banner and prompt
 */

export class ToyRoomUI {
  /**
   * Renders the Toy Room HUD & Overlays
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {object} state UI state
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

    // Top Right: Toys Organized Progress Card
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

    // Progress Bar
    const barW = 188;
    const barH = 8;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(cardX + 16, cardY + 28, barW, barH);
    ctx.fillStyle = '#10b981';
    const progressRatio = totalToys > 0 ? Math.min(1, organizedCount / totalToys) : 0;
    ctx.fillRect(cardX + 16, cardY + 28, barW * progressRatio, barH);

    // Mobile On-Screen Virtual Joystick (Bottom Left)
    if (isTouchDevice || touchState.active) {
      const joyBaseX = touchState.active ? touchState.startX : 90;
      const joyBaseY = touchState.active ? touchState.startY : canvas.height - 90;

      // Base Circle
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.beginPath();
      ctx.arc(joyBaseX, joyBaseY, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Thumb Stick
      const stickX = touchState.active ? touchState.currentX : joyBaseX;
      const stickY = touchState.active ? touchState.currentY : joyBaseY;
      ctx.fillStyle = 'rgba(250, 204, 21, 0.85)';
      ctx.beginPath();
      ctx.arc(stickX, stickY, 24, 0, Math.PI * 2);
      ctx.fill();
    }

    // On-Screen Tactile Action Button (Bottom Right)
    const btnRadius = 40;
    const btnX = canvas.width - 70;
    const btnY = canvas.height - 70;

    const isCarrying = Boolean(player.carriedItem);
    const btnGrad = ctx.createLinearGradient(btnX - btnRadius, btnY - btnRadius, btnX + btnRadius, btnY + btnRadius);
    if (isCarrying) {
      btnGrad.addColorStop(0, '#10b981');
      btnGrad.addColorStop(1, '#059669');
    } else {
      btnGrad.addColorStop(0, '#facc15');
      btnGrad.addColorStop(1, '#f59e0b');
    }

    ctx.fillStyle = btnGrad;
    ctx.beginPath();
    ctx.arc(btnX, btnY, btnRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = isCarrying ? '#ffffff' : '#451a03';
    ctx.font = 'bold 13px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(isCarrying ? 'SOLTAR' : 'PEGAR', btnX, btnY + 5);

    // Narrative Intro Flash & Banner
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

    // Victory Celebration Banner
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
