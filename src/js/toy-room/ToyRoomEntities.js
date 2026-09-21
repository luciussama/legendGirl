/**
 * ToyRoomEntities.js
 * Renders characters in the 2.5D top-down Mana style:
 * - Little Girl: Animated walking bob, feet swing, coral dress with embroidered apron,
 *   warm peach cheeks with rosy blush, dark chestnut hair with bouncing pigtails and yellow ribbons,
 *   directional eyes (down, left, right), and arms held overhead when carrying toys.
 * - Companion Fairy: Radial golden aura, translucent fluttering wings with sinusoidal flap,
 *   golden glowing core.
 */

export class ToyRoomEntities {
  /**
   * Draws the top-down little girl
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} player
   */
  renderPlayer(ctx, player) {
    if (!ctx || !player) return;

    ctx.save();
    const px = player.x;
    const py = player.y;

    // Drop Shadow on floor
    ctx.fillStyle = 'rgba(70, 30, 10, 0.35)';
    ctx.beginPath();
    ctx.ellipse(px, py + 14, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Walking animation sway
    const walkBob = player.isMoving ? Math.sin((player.animTime || 0) * 2) * 2.5 : 0;
    const stepSwing = player.isMoving ? Math.sin((player.animTime || 0) * 2) * 4 : 0;

    // Shoes & Little Feet
    ctx.fillStyle = '#78350f';
    if (player.facing === 'left' || player.facing === 'right') {
      ctx.beginPath();
      ctx.ellipse(px - 5 + stepSwing, py + 14, 5, 3, 0, 0, Math.PI * 2);
      ctx.ellipse(px + 5 - stepSwing, py + 14, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(px - 6, py + 14 + stepSwing, 4, 3, 0, 0, Math.PI * 2);
      ctx.ellipse(px + 6, py + 14 - stepSwing, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Little Dress (Warm Coral Red with delicate golden embroidery)
    const dressGrad = ctx.createLinearGradient(px, py - 12 + walkBob, px, py + 12 + walkBob);
    dressGrad.addColorStop(0, '#f43f5e');
    dressGrad.addColorStop(1, '#e11d48');
    ctx.fillStyle = dressGrad;

    ctx.beginPath();
    ctx.moveTo(px - 14, py + 12 + walkBob);
    ctx.lineTo(px + 14, py + 12 + walkBob);
    ctx.lineTo(px + 8, py - 8 + walkBob);
    ctx.lineTo(px - 8, py - 8 + walkBob);
    ctx.closePath();
    ctx.fill();

    // White Apron Overlay
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(px - 7, py - 4 + walkBob, 14, 12);
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(px, py + 2 + walkBob, 3, 0, Math.PI * 2);
    ctx.fill();

    // Round Head
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.arc(px, py - 16 + walkBob, 14, 0, Math.PI * 2);
    ctx.fill();

    // Rosy cheeks
    ctx.fillStyle = 'rgba(251, 113, 133, 0.45)';
    ctx.beginPath();
    ctx.arc(px - 7, py - 14 + walkBob, 3, 0, Math.PI * 2);
    ctx.arc(px + 7, py - 14 + walkBob, 3, 0, Math.PI * 2);
    ctx.fill();

    // Eyes depending on facing
    if (player.facing === 'down') {
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.ellipse(px - 5, py - 17 + walkBob, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.ellipse(px + 5, py - 17 + walkBob, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px - 6, py - 18 + walkBob, 1, 0, Math.PI * 2);
      ctx.arc(px + 4, py - 18 + walkBob, 1, 0, Math.PI * 2);
      ctx.fill();
    } else if (player.facing === 'left') {
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.ellipse(px - 7, py - 17 + walkBob, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (player.facing === 'right') {
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.ellipse(px + 7, py - 17 + walkBob, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hair & Pigtails (Dark Chestnut)
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(px, py - 21 + walkBob, 14, Math.PI, 0, false);
    ctx.fill();

    const pigtailWave = player.isMoving ? Math.sin((player.animTime || 0) * 2.5) * 3 : 0;
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(px - 16, py - 16 + walkBob + pigtailWave, 6, 9, -0.3, 0, Math.PI * 2);
    ctx.ellipse(px + 16, py - 16 + walkBob - pigtailWave, 6, 9, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Yellow ribbons in pigtails
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(px - 13, py - 21 + walkBob, 3.5, 0, Math.PI * 2);
    ctx.arc(px + 13, py - 21 + walkBob, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Arms: If carrying a toy, arms are held straight up holding the toy!
    ctx.fillStyle = '#ffedd5';
    if (player.carriedItem) {
      ctx.beginPath();
      ctx.ellipse(px - 10, py - 22 + walkBob, 4, 10, -0.4, 0, Math.PI * 2);
      ctx.ellipse(px + 10, py - 22 + walkBob, 4, 10, 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(px - 11, py - 2 + walkBob, 3.5, 6, 0.1, 0, Math.PI * 2);
      ctx.ellipse(px + 11, py - 2 + walkBob, 3.5, 6, -0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Draws the companion fairy
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} fairy
   */
  renderFairy(ctx, fairy) {
    if (!ctx || !fairy) return;

    ctx.save();
    const fx = fairy.x;
    const fy = fairy.y;

    // Glowing Golden Aura
    const aura = ctx.createRadialGradient(fx, fy, 4, fx, fy, 24);
    aura.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    aura.addColorStop(0.4, 'rgba(254, 240, 138, 0.75)');
    aura.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(fx, fy, 24, 0, Math.PI * 2);
    ctx.fill();

    // Translucent Fairy Wings with fluttering animation
    const wingFlap = Math.sin((fairy.flutterTime || 0) * 0.4) * 6;
    ctx.fillStyle = 'rgba(199, 210, 254, 0.85)';
    ctx.beginPath();
    ctx.ellipse(fx - 7, fy - 4, 7, 12 + wingFlap, -0.4, 0, Math.PI * 2);
    ctx.ellipse(fx + 7, fy - 4, 7, 12 + wingFlap, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Fairy Body
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(fx, fy, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Bright inner core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fx, fy, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

export const toyRoomEntities = new ToyRoomEntities();
