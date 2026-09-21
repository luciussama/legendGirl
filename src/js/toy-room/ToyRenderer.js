/**
 * ToyRenderer.js
 * Renders individual handcrafted interactive toys in Legend of Mana aesthetic:
 * - Teddy bear, wooden locomotive, turquoise retro robot, pastel bunny, royal rubber duck,
 *   rainbow blocks, enchanted marching drum, jester Jack-in-the-box.
 * - Interactive golden pulse auras and bouncing "▼ PEGAR" pointer glyphs.
 */

export class ToyRenderer {
  /**
   * Renders an individual toy item
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} t Toy data object
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

    // Check distance to player for interactive highlight glow
    const distToPlayer = Math.hypot(playerX - tx, playerY - ty);
    const isTargeted = !isCarrying && distToPlayer < 55;

    // Soft drop shadow if on floor
    if (!t.isCarried) {
      ctx.fillStyle = 'rgba(100, 45, 10, 0.3)';
      ctx.beginPath();
      ctx.ellipse(tx, ty + (t.h || 20) / 2 - 2, (t.w || 20) / 2 + 3, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Interactive Golden Pulse Aura & Bouncing Indicator Glyph
    if (isTargeted) {
      const pulse = Math.sin(time * 0.008) * 4;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(tx, ty, 30 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      // Bouncing "▼ PEGAR" Pointer
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

    // Draw individual toy artwork
    if (t.type === 'teddy') {
      // Ursinho Felpudo (Teddy Bear)
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
      // Wooden Train Locomotive
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
      // Retro Star Robot Faísca
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
      // Plush Bunny
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
      // Royal Rubber Duck
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
      // Rainbow Block Stack
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
      // Enchanted Toy Drum
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
      // Jack-in-the-Box
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
