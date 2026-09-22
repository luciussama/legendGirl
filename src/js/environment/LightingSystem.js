/**
 * LightingSystem.js
 * Gerencia o buffer de canvas fora da tela de escuridão e renderiza
 * penumbra dinâmica volumétrica, auréolas acolhedoras de abajur, iluminação de lanterna
 * e vazamentos mágicos de luz do portal dos sonhos.
 */

import {
  FLOOR_Y,
  platforms as defaultPlatforms,
  phase3Platforms as defaultPhase3Platforms,
  exitDoor as defaultExitDoor,
  trueExitDoor as defaultTrueExitDoor
} from '../config.js';

export class LightingSystem {
  constructor(options = {}) {
    this.floorY = options.floorY ?? FLOOR_Y;
    this.darkCanvas = options.darkCanvas || (typeof document !== 'undefined' ? document.createElement('canvas') : null);
    this.dctx = this.darkCanvas ? this.darkCanvas.getContext('2d') : null;
  }

  /**
   * Redimensiona o buffer interno darkCanvas para coincidir com o canvas principal
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    if (this.darkCanvas) {
      this.darkCanvas.width = width;
      this.darkCanvas.height = height;
    }
  }

  /**
   * Aplica a atmosfera de escuridão e recorta cones de luz volumétricos e auréolas
   * @param {CanvasRenderingContext2D} ctx Contexto do canvas principal
   * @param {HTMLCanvasElement} canvas Elemento do canvas principal
   * @param {object} state Estado global do jogo
   * @param {object} baby Estado da protagonista
   * @param {object} fairy Estado da fadinha guia
   * @param {number} [camX] Deslocamento horizontal da câmera
   * @param {number} [camY] Deslocamento vertical da câmera
   * @param {object} [options]
   */
  apply(ctx, canvas, state = {}, baby = {}, fairy = {}, camX = 0, camY = 0, options = {}) {
    if (!ctx || !canvas) return;

    if (!this.darkCanvas) {
      if (typeof document !== 'undefined') {
        this.darkCanvas = document.createElement('canvas');
        this.dctx = this.darkCanvas.getContext('2d');
      } else {
        return;
      }
    }

    if (this.darkCanvas.width !== canvas.width || this.darkCanvas.height !== canvas.height) {
      this.resize(canvas.width, canvas.height);
    }

    const darkCanvas = this.darkCanvas;
    const dctx = this.dctx;
    if (!dctx) return;

    const tick = state.tick || 0;
    const isStandbyActive = Boolean(state.isStandbyActive);
    const isStandbyTransitioning = Boolean(state.isStandbyTransitioning);
    const isPhase3 = Boolean(state.isPhase3);
    const isEscapeMode = Boolean(state.isEscapeMode);
    const plotTwistActive = Boolean(state.plotTwistActive);
    const plotTwistStep = state.plotTwistStep || 0;
    const fakeDoorRevealed = Boolean(state.fakeDoorRevealed);

    const platforms = options.platforms || defaultPlatforms;
    const phase3Platforms = options.phase3Platforms || defaultPhase3Platforms;
    const exitDoor = options.exitDoor || defaultExitDoor;
    const trueExitDoor = options.trueExitDoor || defaultTrueExitDoor;
    const FLOOR_Y = this.floorY;


    if (isStandbyActive || isStandbyTransitioning) {
      // Pulsação sutil e acolhedora de luz que ilumina apenas a menina e a fadinha no quarto escuro
      dctx.fillStyle = '#090611';
      dctx.fillRect(0, 0, canvas.width, canvas.height);
      dctx.globalCompositeOperation = 'destination-out';

      const bx = baby.x - camX + baby.w / 2;
      const by = baby.y - camY + baby.h / 2;
      const fx = fairy.x - camX;
      const fy = fairy.y - camY;

      // Pulsação suave (senoidal) da fadinha acolhedora, em tom quente e lilás
      const pulse = Math.sin(tick * 0.06) * 14;
      const midX = (bx + fx) / 2;
      const midY = (by + fy) / 2;
      const cozyRadius = 150 + pulse;

      // Luz acolhedora envolvente das duas
      const cozySpot = dctx.createRadialGradient(midX, midY, 15, midX, midY, cozyRadius);
      cozySpot.addColorStop(0, 'rgba(0,0,0,1)');
      cozySpot.addColorStop(0.5, 'rgba(0,0,0,0.85)');
      cozySpot.addColorStop(0.85, 'rgba(0,0,0,0.4)');
      cozySpot.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = cozySpot;
      dctx.beginPath();
      dctx.arc(midX, midY, cozyRadius, 0, Math.PI * 2);
      dctx.fill();

      // Luz pontual brilhante da fadinha
      const fairySpot = dctx.createRadialGradient(fx, fy, 5, fx, fy, 95 + pulse * 0.5);
      fairySpot.addColorStop(0, 'rgba(0,0,0,1)');
      fairySpot.addColorStop(0.6, 'rgba(0,0,0,0.8)');
      fairySpot.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = fairySpot;
      dctx.beginPath();
      dctx.arc(fx, fy, 95 + pulse * 0.5, 0, Math.PI * 2);
      dctx.fill();

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(darkCanvas, 0, 0);

      // Preserva a assinatura visual da playroom com uma luz quente, suave e acolhedora em volta das protagonistas
      const warmGlow = ctx.createRadialGradient(midX, midY, 20, midX, midY, 220);
      warmGlow.addColorStop(0, 'rgba(254, 240, 138, 0.10)');
      warmGlow.addColorStop(0.35, 'rgba(196, 181, 253, 0.08)');
      warmGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = warmGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Vignette suave ao redor da tela, mantendo a luz familiar da playroom e a atmosfera do quarto
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.25,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.65
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(0.72, 'rgba(9, 7, 15, 0.35)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      return;
    }

    if (plotTwistActive) {
      // Penumbra cinematográfica: o ambiente ao redor mergulha em escuridão profunda
      dctx.fillStyle = '#030208';
      dctx.fillRect(0, 0, canvas.width, canvas.height);
      dctx.globalCompositeOperation = 'destination-out';

      const bx = baby.x - camX + baby.w / 2;
      const by = baby.y - camY + baby.h / 2;

      if (plotTwistStep === 2) {
        // Holofote dramático isolado focado exclusivamente no rosto assustado da menina no chão
        const spot = dctx.createRadialGradient(bx, by, 10, bx, by, 140);
        spot.addColorStop(0, 'rgba(0,0,0,1)');
        spot.addColorStop(0.5, 'rgba(0,0,0,0.85)');
        spot.addColorStop(1, 'rgba(0,0,0,0)');
        dctx.fillStyle = spot;
        dctx.beginPath();
        dctx.arc(bx, by, 140, 0, Math.PI * 2);
        dctx.fill();
      } else {
        // Holofote iluminando tanto a menina quanto a fadinha agitada e preocupada
        const spotBaby = dctx.createRadialGradient(bx, by, 10, bx, by, 150);
        spotBaby.addColorStop(0, 'rgba(0,0,0,1)');
        spotBaby.addColorStop(0.55, 'rgba(0,0,0,0.8)');
        spotBaby.addColorStop(1, 'rgba(0,0,0,0)');
        dctx.fillStyle = spotBaby;
        dctx.beginPath();
        dctx.arc(bx, by, 150, 0, Math.PI * 2);
        dctx.fill();

        const fx = fairy.x - camX;
        const fy = fairy.y - camY;
        const spotFairy = dctx.createRadialGradient(fx, fy, 8, fx, fy, 130);
        spotFairy.addColorStop(0, 'rgba(0,0,0,1)');
        spotFairy.addColorStop(0.6, 'rgba(0,0,0,0.75)');
        spotFairy.addColorStop(1, 'rgba(0,0,0,0)');
        dctx.fillStyle = spotFairy;
        dctx.beginPath();
        dctx.arc(fx, fy, 130, 0, Math.PI * 2);
        dctx.fill();
      }

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(darkCanvas, 0, 0);

      // Mantém o gesto visual da playroom mesmo em cena dramática, com luz quente a destacar a menina e a fada
      const focusGlow = ctx.createRadialGradient(bx, by, 25, bx, by, 220);
      focusGlow.addColorStop(0, 'rgba(254, 240, 138, 0.09)');
      focusGlow.addColorStop(0.35, 'rgba(192, 132, 252, 0.07)');
      focusGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = focusGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sombra dramática pronunciada nas bordas
      const dramaticVignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.6
      );
      dramaticVignette.addColorStop(0, 'rgba(0,0,0,0)');
      dramaticVignette.addColorStop(1, 'rgba(0,0,0,0.92)');
      ctx.fillStyle = dramaticVignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      return;
    }

    dctx.fillStyle = '#0b0912';
    dctx.fillRect(0, 0, canvas.width, canvas.height);
    dctx.globalCompositeOperation = 'destination-out';

    // Luz em volta da menininha em tom quente e acolhedor, mesmo no quarto escuro
    const bx = baby.x - camX + baby.w / 2;
    const by = baby.y - camY + baby.h / 2;
    const babyLight = dctx.createRadialGradient(bx, by, 12, bx, by, 175);
    babyLight.addColorStop(0, 'rgba(0,0,0,0.96)');
    babyLight.addColorStop(0.5, 'rgba(0,0,0,0.68)');
    babyLight.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = babyLight;
    dctx.beginPath();
    dctx.arc(bx, by, 175, 0, Math.PI * 2);
    dctx.fill();

    // Aura vibrante de luz ao redor da fadinha
    const fx = fairy.x - camX;
    const fy = fairy.y - camY;
    const fairyLight = dctx.createRadialGradient(fx, fy, 8, fx, fy, 160);
    fairyLight.addColorStop(0, 'rgba(0,0,0,0.96)');
    fairyLight.addColorStop(0.4, 'rgba(0,0,0,0.75)');
    fairyLight.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = fairyLight;
    dctx.beginPath();
    dctx.arc(fx, fy, 160, 0, Math.PI * 2);
    dctx.fill();

    // Iluminação Dinâmica dos Obstáculos: Penumbra inicial com luz guia no topo e ativação gradual ao pousar
    const activePlats = isPhase3 ? phase3Platforms : platforms;
    for (let i = 0; i < activePlats.length; i++) {
      const p = activePlats[i];
      const leftX = p.x - camX;
      const topY = p.y - camY;
      if (leftX + p.w < -120 || leftX > canvas.width + 120) continue;

      const alpha = p.lightAlpha || 0;

      // 1. Estado Inicial (Penumbra com Luz Guia no Topo):
      // Fenda muito sutil e estreita restrita exclusivamente à borda superior
      const topSlit = dctx.createLinearGradient(0, topY - 2, 0, topY + 6);
      topSlit.addColorStop(0, 'rgba(0,0,0,0)');
      topSlit.addColorStop(0.5, 'rgba(0,0,0,0.36)');
      topSlit.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = topSlit;
      dctx.fillRect(leftX, topY - 2, p.w, 8);

      // 2. Estado Ativado (Iluminação Total ao Pousar):
      // Fade-in de luz quente/pontual revelando o corpo do objeto por inteiro
      if (alpha > 0.01) {
        const cx = leftX + p.w / 2;
        const cy = topY + p.h * 0.45;
        const rad = Math.max(54, p.w * 0.72 + 28);
        const spot = dctx.createRadialGradient(cx, cy, 6, cx, cy, rad);
        spot.addColorStop(0, `rgba(0,0,0,${0.92 * alpha})`);
        spot.addColorStop(0.55, `rgba(0,0,0,${0.60 * alpha})`);
        spot.addColorStop(1, 'rgba(0,0,0,0)');
        dctx.fillStyle = spot;
        dctx.beginPath();
        dctx.arc(cx, cy, rad, 0, Math.PI * 2);
        dctx.fill();
      }
    }

    if (isPhase3) {
      // Luz de farol para o Verdadeiro Portal de Saída no terraço à extrema esquerda
      const tx = trueExitDoor.x - camX + trueExitDoor.w / 2;
      const ty = trueExitDoor.y - camY + trueExitDoor.h / 2;
      const trueDoorLight = dctx.createRadialGradient(tx, ty, 25, tx, ty, 300);
      trueDoorLight.addColorStop(0, 'rgba(0,0,0,1)');
      trueDoorLight.addColorStop(0.65, 'rgba(0,0,0,0.75)');
      trueDoorLight.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = trueDoorLight;
      dctx.beginPath();
      dctx.arc(tx, ty, 300, 0, Math.PI * 2);
      dctx.fill();
    } else {
      // Luz de farol da porta de saída (Fases 1 e 2)
      const px = exitDoor.x - camX + exitDoor.w / 2;
      const py = exitDoor.y - camY + exitDoor.h / 2;
      const doorLight = dctx.createRadialGradient(px, py, 20, px, py, 280);
      doorLight.addColorStop(0, 'rgba(0,0,0,1)');
      doorLight.addColorStop(0.6, 'rgba(0,0,0,0.7)');
      doorLight.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = doorLight;
      dctx.beginPath();
      dctx.arc(px, py, 280, 0, Math.PI * 2);
      dctx.fill();
    }

    // Brilho do abajur de cogumelo
    const mushPlat = platforms.find(p => p.style === 'mushroom_lamp');
    if (mushPlat) {
      const mx = mushPlat.x - camX + mushPlat.w / 2;
      const my = mushPlat.y - camY + 12;
      const mushLight = dctx.createRadialGradient(mx, my, 6, mx, my, 90);
      mushLight.addColorStop(0, 'rgba(0,0,0,0.85)');
      mushLight.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = mushLight;
      dctx.beginPath();
      dctx.arc(mx, my, 90, 0, Math.PI * 2);
      dctx.fill();
    }

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(darkCanvas, 0, 0);

    // Vinheta atmosférica calorosa
    const vignette = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, canvas.width * 0.35,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.65
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(3,2,6,0.8)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}

export function createLightingSystem(options = {}) {
  return new LightingSystem(options);
}
