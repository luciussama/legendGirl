import { babyRenderer } from '../entities/BabyRenderer.js';

/** Official protagonist sprites and companion fairy rendering. */

export class ToyRoomEntities {
  /**
   * Desenha a garotinha vista de cima
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} player
   */
  renderPlayer(ctx, player, options = {}) {
    if (!ctx || !player) return;
    const pose = player.carriedItem ? 'collect' : player.isMoving ? 'run' : 'idle';
    const frame = Math.floor((player.animTime || 0) * 0.9);
    babyRenderer.renderPose(ctx, options.assets, pose, frame,
      player.x, player.y + 28, 80, player.facing === 'left' ? -1 : 1);
  }

  renderFairy(ctx, fairy, options = {}) {
    if (!ctx || !fairy) return;

    const fairyImage = options.assets && options.assets.get('toy-room-fairy');
    if (fairyImage) {
      ctx.drawImage(fairyImage, fairy.x - 30, fairy.y - 30, 60, 60);
      return;
    }

    ctx.save();
    const fx = fairy.x;
    const fy = fairy.y;

    // Aura dourada brilhante
    const aura = ctx.createRadialGradient(fx, fy, 4, fx, fy, 24);
    aura.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    aura.addColorStop(0.4, 'rgba(254, 240, 138, 0.75)');
    aura.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(fx, fy, 24, 0, Math.PI * 2);
    ctx.fill();

    // Asas diáfanas da fada com animação esvoaçante
    const wingFlap = Math.sin((fairy.flutterTime || 0) * 0.4) * 6;
    ctx.fillStyle = 'rgba(199, 210, 254, 0.85)';
    ctx.beginPath();
    ctx.ellipse(fx - 7, fy - 4, 7, 12 + wingFlap, -0.4, 0, Math.PI * 2);
    ctx.ellipse(fx + 7, fy - 4, 7, 12 + wingFlap, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Corpinho brilhante da fada
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(fx, fy, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Núcleo interno reluzente
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fx, fy, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

export const toyRoomEntities = new ToyRoomEntities();
