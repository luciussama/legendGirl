/**
 * FairyRenderer.js
 * Responsável pela renderização da fadinha guia etérea, suas asas luminosas,
 * auréola pulsante, rastro de poeira estelar e feixe guia da cinemática.
 */

import { platforms as defaultPlatforms } from '../config.js';

export class FairyRenderer {
  /**
   * Renderiza a fadinha e seus efeitos de partículas
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} fairy
   * @param {object} state
   * @param {number} camX
   * @param {object} [options]
   */
  render(ctx, fairy, state = {}, camX = 0, options = {}) {
    if (!ctx || !fairy) return;

    const canvasWidth = options.canvasWidth || options.canvas?.width || 960;
    const canvas = options.canvas || { width: canvasWidth };
    const baby = options.baby || state.baby || {};
    const platforms = options.platforms || defaultPlatforms;
    const tick = state.tick || 0;
    const cutsceneActive = Boolean(state.cutsceneActive);
    const cutsceneStep = state.cutsceneStep || 0;

    ctx.save();

    // Desenha partículas de poeira mágica da fada com aura luminosa e brilhos cintilantes em estrela
    for (let i = 0; i < fairy.particles.length; i++) {
      const p = fairy.particles[i];
      const sx = p.x - camX;
      const sy = p.y;
      if (sx < -40 || sx > canvas.width + 40) continue;

      // Aura luminosa suave
      const glowSize = p.size * (1.8 + Math.sin(p.wobble || 0) * 0.4) * p.life;
      ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${p.life * 0.38})`;
      ctx.beginPath();
      ctx.arc(sx, sy, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Estrela brilhante central
      ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${p.life * 0.95})`;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(0.8, p.size * 0.65 * p.life), 0, Math.PI * 2);
      ctx.fill();

      // Brilho cintilante de estrela de 4 pontas para partículas cintilantes
      if (p.twinkle && p.life > 0.25) {
        const glintArm = p.size * (1.8 + Math.sin((p.wobble || 0) * 2.5) * 0.6) * p.life;
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.life * 0.85})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(sx - glintArm, sy);
        ctx.lineTo(sx + glintArm, sy);
        ctx.moveTo(sx, sy - glintArm);
        ctx.lineTo(sx, sy + glintArm);
        ctx.stroke();
      }
    }

    const fx = fairy.x - camX;
    const fy = fairy.y;

    // Auréola Dourada e Ciano
    const haloRadius = 16 + Math.sin(fairy.floatAngle * 3) * 3;
    const fairyAura = ctx.createRadialGradient(fx, fy, 2, fx, fy, haloRadius);
    fairyAura.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
    fairyAura.addColorStop(0.5, 'rgba(236, 72, 153, 0.45)');
    fairyAura.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = fairyAura;
    ctx.beginPath();
    ctx.arc(fx, fy, haloRadius, 0, Math.PI * 2);
    ctx.fill();

    // Faíscas guias sutis apontando para a próxima plataforma
    if (tick % 4 === 0) {
      const nextP = platforms[baby.currentPlatformIndex + 1];
      if (nextP) {
        const guideAngle = Math.atan2((nextP.y - 20) - fairy.y, (nextP.x + 30) - fairy.x);
        const gDist = 12 + Math.random() * 18;
        ctx.fillStyle = 'rgba(250, 204, 21, 0.8)';
        ctx.beginPath();
        ctx.arc(
          fx + Math.cos(guideAngle) * gDist + (Math.random() - 0.5) * 6,
          fy + Math.sin(guideAngle) * gDist + (Math.random() - 0.5) * 6,
          1.6, 0, Math.PI * 2
        );
        ctx.fill();
      }
    }

    // Asas com batimento dinâmico rápido vinculado à velocidade
    const flutterSpeed = 0.35 + Math.hypot(fairy.vx, fairy.vy) * 0.15;
    const wingFlap = Math.sin(fairy.flutterPhase) * 10;

    // Asas translúcidas delicadas
    ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
    ctx.beginPath();
    // Asas superiores
    ctx.ellipse(fx - 4, fy - 6, 9, 3.5 + Math.abs(wingFlap), -0.4, 0, Math.PI * 2);
    ctx.ellipse(fx + 4, fy - 6, 9, 3.5 + Math.abs(wingFlap), 0.4, 0, Math.PI * 2);
    // Asas secundárias inferiores
    ctx.ellipse(fx - 5, fy + 3, 6, 2.2 + Math.abs(wingFlap) * 0.7, 0.35, 0, Math.PI * 2);
    ctx.ellipse(fx + 5, fy + 3, 6, 2.2 + Math.abs(wingFlap) * 0.7, -0.35, 0, Math.PI * 2);
    ctx.fill();

    // Brilhos na ponta das asas
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fx - 9, fy - 7 - Math.abs(wingFlap) * 0.5, 1.4, 0, Math.PI * 2);
    ctx.arc(fx + 9, fy - 7 - Math.abs(wingFlap) * 0.5, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Cabeça brilhante dourada da fada
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(fx, fy - 3, 4.8, 0, Math.PI * 2);
    ctx.fill();

    // Vestido / túnica da fada
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(fx, fy - 1);
    ctx.lineTo(fx + 5, fy + 9);
    ctx.lineTo(fx - 5, fy + 9);
    ctx.closePath();
    ctx.fill();

    // Varinha mágica diminuta apontando à frente
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(fx + 3, fy + 3);
    ctx.lineTo(fx + 11, fy + 1);
    ctx.stroke();
    // Estrela na ponta da varinha
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fx + 12, fy + 1, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Etapa 1 da Cinemática: Faíscas de curiosidade investigativa e ponto de interrogação
    if (cutsceneActive && cutsceneStep === 1) {
      const qFloat = Math.sin(tick * 0.12) * 3;
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('?', fx + 9, fy - 12 + qFloat);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(fx - 10, fy - 10 - qFloat, 1.5, 0, Math.PI * 2);
      ctx.arc(fx + 16, fy - 6 + qFloat, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Etapa 2 da Cinemática: Feixe guia apontando para a saída ("A saída é logo ali!")
    if (cutsceneActive && cutsceneStep === 2) {
      const beamGrad = ctx.createLinearGradient(fx + 12, fy + 1, fx + 220, fy + 1);
      beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
      beamGrad.addColorStop(0.3, 'rgba(236, 72, 153, 0.7)');
      beamGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.strokeStyle = beamGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(fx + 12, fy + 1);
      ctx.lineTo(fx + 220, fy + 1);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(fx + 12, fy + 1, 3.2, 0, Math.PI * 2);
      ctx.fill();

      const noteBob = Math.sin(tick * 0.16) * 4;
      ctx.fillStyle = '#f472b6';
      ctx.font = '13px sans-serif';
      ctx.fillText('♪', fx - 14, fy - 15 + noteBob);
      ctx.fillText('♫', fx + 18, fy - 18 - noteBob);
    }

    ctx.restore();
  }
}

export const fairyRenderer = new FairyRenderer();
