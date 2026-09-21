/**
 * TransitionEffects.js
 * Renders cinematic scene transitions:
 * - Golden Iris Wipe (expanding radiant circle that envelops the screen)
 * - Celebratory Ascension Sparkles orbiting the portal
 * - Full-screen soft light flush
 */

export class TransitionEffects {
  /**
   * Renders the true portal golden iris wipe and orbiting ascension sparkles
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {number} cameraX
   * @param {number} cameraY
   * @param {object} trueExitDoor
   * @param {number} transitionWipeAlpha
   * @param {number} tick
   */
  renderPortalWipe(ctx, canvas, cameraX, cameraY, trueExitDoor, transitionWipeAlpha, tick = 0) {
    if (!ctx || !canvas || transitionWipeAlpha <= 0 || !trueExitDoor) return;

    ctx.save();
    const originX = trueExitDoor.x + trueExitDoor.w / 2 - cameraX;
    const originY = trueExitDoor.y + trueExitDoor.h / 2 - cameraY;
    const maxDist = Math.hypot(canvas.width, canvas.height);
    const radius = maxDist * Math.min(1.0, transitionWipeAlpha * 1.25);

    const wipeGrad = ctx.createRadialGradient(originX, originY, 0, originX, originY, Math.max(1, radius));
    wipeGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    wipeGrad.addColorStop(0.35, 'rgba(254, 240, 138, 0.98)');
    wipeGrad.addColorStop(0.75, 'rgba(251, 191, 36, 0.95)');
    wipeGrad.addColorStop(0.95, 'rgba(217, 119, 6, 0.9)');
    wipeGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');

    ctx.fillStyle = wipeGrad;
    ctx.beginPath();
    ctx.arc(originX, originY, radius, 0, Math.PI * 2);
    ctx.fill();

    if (transitionWipeAlpha > 0.6) {
      const fullAlpha = (transitionWipeAlpha - 0.6) / 0.4;
      ctx.fillStyle = `rgba(255, 250, 230, ${fullAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Floating celebratory ascension sparkles
    const pCount = 20;
    for (let i = 0; i < pCount; i++) {
      const angle = (i / pCount) * Math.PI * 2 + tick * 0.05;
      const dist = (radius * 0.42) + Math.sin(tick * 0.1 + i) * 25;
      const px = originX + Math.cos(angle) * dist;
      const py = originY + Math.sin(angle) * dist;
      ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#fef08a';
      ctx.beginPath();
      ctx.arc(px, py, 2.5 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

export const transitionEffects = new TransitionEffects();
