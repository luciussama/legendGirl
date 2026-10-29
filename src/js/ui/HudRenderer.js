import { getMobileUILayout } from './MobileUILayout.js';
import { isMobileDevice } from '../controllers/MobileZoom.js';
/**
 * HudRenderer.js
 * Renderiza componentes de HUD de alta resolução no espaço de tela:
 * - Indicadores de urgência do Modo Fuga e Fase 3 com barra de evolução do pulo
 * - Banners de aumento de nível e melhorias
 * - Linhas dinâmicas de vento e velocidade proporcionais à velocidade da rolagem
 * - Gradientes de perigo nas bordas da tela alertando quando o jogador fica para trás
 */

export class HudRenderer {
  /**
   * Renderiza os banners de HUD e linhas de velocidade do Modo Fuga e Fase 3
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {object} state
   * @param {number} [cameraX]
   * @param {object} [baby]
   */
  renderEscapeBanner(ctx, canvas, state = {}, cameraX = 0, baby = {}) {
    if (!ctx || !canvas) return;
    const isEscapeMode = Boolean(state.isEscapeMode);
    const isPhase3 = Boolean(state.isPhase3);
    if (!isEscapeMode && !isPhase3) return;

    const phase3Level = state.phase3Level || 0;
    const escapeLevel = state.escapeLevel || 0;
    const escapeBannerText = state.escapeBannerText || '';
    const currentScrollSpeed = state.currentScrollSpeed || 0;
    const tick = state.tick || 0;

    ctx.save();
    // Emblema de urgência no canto superior direito com medidor progressivo de pulo
    const layout = getMobileUILayout(canvas);
    const mobile = isMobileDevice();
    const uiScale = mobile ? layout.scale : 1;
    const landscape = mobile && layout.usableWidth > layout.usableHeight;
    // Reserva as laterais do topo para os três botões HTML também em celulares menores.
    const badgeW = Math.min(270 * uiScale, layout.usableWidth - 32 * uiScale,
      landscape ? Math.max(128 * uiScale, layout.usableWidth - 340 * uiScale) : Infinity);
    const badgeH = 42 * uiScale;
    const badgeX = landscape ? layout.centerX - badgeW / 2 : layout.safeRight - badgeW - 16 * uiScale;
    const badgeY = layout.safeTop + (mobile && !landscape ? 72 : 14) * uiScale;

    ctx.fillStyle = 'rgba(15, 12, 24, 0.92)';
    ctx.strokeStyle = (isPhase3 ? (phase3Level >= 14 ? '#fde047' : '#c084fc') : (escapeLevel >= 11 ? '#fde047' : '#f59e0b'));
    ctx.lineWidth = (isPhase3 ? (phase3Level >= 14 ? 2.4 : 1.6) : (escapeLevel >= 11 ? 2.2 : 1.5));
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = (isPhase3 ? (phase3Level >= 14 ? '#fde047' : '#f5d0fe') : (escapeLevel >= 11 ? '#fde047' : '#fef08a'));
    ctx.font = `bold ${12 * uiScale}px sans-serif`;
    ctx.textAlign = 'left';
    if (isPhase3) {
      ctx.fillText(`🌪️ SUBIDA CAÓTICA: NÍVEL ${phase3Level + 1}/15`, badgeX + 14 * uiScale, badgeY + 18 * uiScale, badgeW - 28 * uiScale);
    } else {
      ctx.fillText(`⚡ FUGA: PULO NÍVEL ${escapeLevel + 1}/12`, badgeX + 14 * uiScale, badgeY + 18 * uiScale, badgeW - 28 * uiScale);
    }

    // Mini barra de progresso para a evolução do pulo
    const pBarX = badgeX + 14 * uiScale;
    const pBarY = badgeY + 25 * uiScale;
    const pBarW = badgeW - 28 * uiScale;
    const pBarH = 6 * uiScale;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.fillRect(pBarX, pBarY, pBarW, pBarH);

    const maxLevels = isPhase3 ? 15 : 12;
    const currentLevel = isPhase3 ? phase3Level + 1 : escapeLevel + 1;
    const progFill = (currentLevel / maxLevels) * pBarW;
    const barGrad = ctx.createLinearGradient(pBarX, pBarY, pBarX + pBarW, pBarY);
    if (isPhase3) {
      barGrad.addColorStop(0, '#c084fc');
      barGrad.addColorStop(0.5, '#f472b6');
      barGrad.addColorStop(1, '#fde047');
    } else {
      barGrad.addColorStop(0, '#38bdf8');
      barGrad.addColorStop(0.5, '#facc15');
      barGrad.addColorStop(1, '#ec4899');
    }
    ctx.fillStyle = barGrad;
    ctx.fillRect(pBarX, pBarY, progFill, pBarH);

    // Banner de inicialização / subida de nível
    if (state.escapeBannerTimer > 0) {
      state.escapeBannerTimer--;
      const alpha = Math.min(1.0, state.escapeBannerTimer / 30);
      ctx.fillStyle = `rgba(0, 0, 0, ${0.65 * alpha})`;
      const noticeX = landscape ? badgeX : layout.safeLeft;
      const noticeW = landscape ? badgeW : layout.usableWidth;
      const noticeY = badgeY + badgeH + 8 * uiScale;
      ctx.fillRect(noticeX, noticeY, noticeW, 56 * uiScale);

      ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
      ctx.textAlign = 'center';
      if (landscape) {
        // Mensagem legível no centro, sem atravessar a área ocupada pelos atores.
        ctx.font = `bold ${12 * uiScale}px Palatino, Georgia, serif`;
        const lines = [];let line = '';
        for (const word of escapeBannerText.split(/\s+/)) {
          const next = line ? line + ' ' + word : word;
          if (line && ctx.measureText(next).width > noticeW - 20 * uiScale) { lines.push(line);line = word; }
          else line = next;
        }
        if (line) lines.push(line);
        for (const [index, text] of lines.slice(0,3).entries())
          ctx.fillText(text, layout.centerX, noticeY + (15 + index * 14) * uiScale, noticeW - 20 * uiScale);
      } else {
        ctx.font = `bold ${19 * uiScale}px Palatino, Georgia, serif`;
        ctx.fillText(escapeBannerText, layout.centerX, badgeY + badgeH + 43 * uiScale, layout.usableWidth - 32 * uiScale);
      }
    }

    // Linhas dinâmicas de vento na tela proporcionais à velocidade de rolagem
    const intensityFactor = isPhase3 ? (phase3Level / 14) : (escapeLevel / 11);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + Math.min(0.18, intensityFactor * 0.14)})`;
    ctx.lineWidth = 1.4 + intensityFactor * 0.9;
    const speedTime = tick * (12 + Math.abs(currentScrollSpeed) * 3);
    const streakCount = 5 + Math.floor(intensityFactor * 4);
    for (let i = 0; i < streakCount; i++) {
      const sx = (speedTime + i * 140) % (canvas.width + 220) - 100;
      const sy = 50 + i * 65;
      const streakLen = 60 + Math.abs(currentScrollSpeed) * 18;
      ctx.beginPath();
      if (isPhase3) {
        // Linhas se movendo para a direita à medida que a câmera se desloca para a esquerda
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + streakLen, sy);
      } else {
        ctx.moveTo(canvas.width - sx, sy);
        ctx.lineTo(canvas.width - sx - streakLen, sy);
      }
      ctx.stroke();
    }

    if (isPhase3) {
      // Na Fase 3: jogadora se move para a esquerda, câmera para a esquerda. Se ficar para trás à direita:
      const distToRight = (cameraX + canvas.width) - (baby.x || 0);
      if (distToRight < 170) {
        const danger = (170 - distToRight) / 170;
        const shadowGrad = ctx.createLinearGradient(canvas.width, 0, canvas.width - 130, 0);
        shadowGrad.addColorStop(0, `rgba(220, 38, 38, ${0.48 * danger})`);
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(canvas.width - 130, 0, 130, canvas.height);
      }
    } else {
      // Na Fase 2: Alerta sombrio na borda esquerda se o bebê estiver ficando para trás da câmera acelerada
      const distToLeft = (baby.x || 0) - cameraX;
      if (distToLeft < 170) {
        const danger = (170 - distToLeft) / 170;
        const shadowGrad = ctx.createLinearGradient(0, 0, 130, 0);
        shadowGrad.addColorStop(0, `rgba(220, 38, 38, ${0.48 * danger})`);
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(0, 0, 130, canvas.height);
      }
    }

    ctx.restore();
  }
}

export const hudRenderer = new HudRenderer();
