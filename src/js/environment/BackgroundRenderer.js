/**
 * BackgroundRenderer.js
 * Renders the atmospheric Victorian nursery background wall, wainscoting,
 * wallpaper patterns, windows, and detailed room scenery items.
 */

import { FLOOR_Y, roomScenery as defaultRoomScenery } from '../config.js';

export class BackgroundRenderer {
  constructor(options = {}) {
    this.floorY = options.floorY ?? FLOOR_Y;
  }

  /**
   * Renders the Victorian nursery wallpaper, wood paneling, windows, and floor
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {number} camX
   * @param {object} [options]
   */
  renderWall(ctx, canvas, camX = 0, options = {}) {
    if (!ctx || !canvas) return;
    const FLOOR_Y = this.floorY;
    const tick = options.tick || 0;

    // Deep atmospheric nursery background
    ctx.fillStyle = '#110e19';
    ctx.fillRect(0, -600, canvas.width, canvas.height + 1200);

    // Wallpaper stripes & diamond pattern with parallax
    const bgOffset = (camX * 0.15) % 80;
    ctx.fillStyle = '#161220';
    for (let x = -80; x < canvas.width + 80; x += 80) {
      ctx.fillRect(x - bgOffset, -400, 40, FLOOR_Y + 400);
    }

    // Faint golden wallpaper stars
    ctx.fillStyle = 'rgba(250, 204, 21, 0.07)';
    for (let x = -80; x < canvas.width + 80; x += 80) {
      const sx = x - bgOffset + 20;
      for (let y = 50; y < FLOOR_Y; y += 65) {
        ctx.beginPath();
        ctx.arc(sx, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Bunting garland / pennant flags hanging across the room
    const garlandOffset = (camX * 0.2) % 360;
    ctx.strokeStyle = 'rgba(120, 100, 150, 0.4)';
    ctx.lineWidth = 1.2;
    for (let gx = -360; gx < canvas.width + 360; gx += 180) {
      const sx = gx - garlandOffset;
      ctx.beginPath();
      ctx.moveTo(sx, 70);
      ctx.quadraticCurveTo(sx + 90, 110, sx + 180, 70);
      ctx.stroke();

      // Colorful hanging pennant triangles
      const colors = ['#f43f5e', '#facc15', '#06b6d4', '#a855f7', '#10b981', '#fb923c'];
      for (let p = 0; p < 5; p++) {
        const t = (p + 0.5) / 5;
        const px = sx + t * 180;
        const py = 70 + (4 * t * (1 - t)) * 40;
        ctx.fillStyle = colors[(Math.floor(gx / 180) * 5 + p) % colors.length];
        ctx.beginPath();
        ctx.moveTo(px - 7, py);
        ctx.lineTo(px + 7, py);
        ctx.lineTo(px, py + 14);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Windows to starry night sky
    const windowLocations = [780, 1950];
    windowLocations.forEach((wx) => {
      const sx = wx - camX * 0.3;
      if (sx < -140 || sx > canvas.width + 140) return;

      // Window frame
      ctx.fillStyle = '#1c152b';
      ctx.strokeStyle = '#42335f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(sx, 80, 90, 130, [45, 45, 4, 4]);
      ctx.fill();
      ctx.stroke();

      // Glasspane midnight sky
      ctx.fillStyle = '#06050e';
      ctx.beginPath();
      ctx.roundRect(sx + 6, 86, 78, 118, [40, 40, 2, 2]);
      ctx.fill();

      // Crescent Moon
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(sx + 35, 115, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#06050e';
      ctx.beginPath();
      ctx.arc(sx + 39, 113, 10, 0, Math.PI * 2);
      ctx.fill();

      // Twinkling stars in window
      ctx.fillStyle = '#ffffff';
      const tw = Math.sin(tick * 0.05 + wx) * 0.5 + 0.5;
      ctx.fillRect(sx + 60, 110, 2, 2);
      ctx.fillRect(sx + 22, 145, 1.5, 1.5);
      ctx.fillRect(sx + 65, 160, 2 * tw, 2 * tw);

      // Window cross panes
      ctx.strokeStyle = '#322549';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx + 45, 86);
      ctx.lineTo(sx + 45, 204);
      ctx.moveTo(sx + 6, 140);
      ctx.lineTo(sx + 84, 140);
      ctx.stroke();

      // Sheer lilac curtains with soft folds
      ctx.fillStyle = 'rgba(168, 85, 247, 0.28)';
      ctx.beginPath();
      ctx.moveTo(sx - 4, 80);
      ctx.quadraticCurveTo(sx + 15, 140, sx + 5, 215);
      ctx.lineTo(sx - 4, 215);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(sx + 94, 80);
      ctx.quadraticCurveTo(sx + 75, 140, sx + 85, 215);
      ctx.lineTo(sx + 94, 215);
      ctx.closePath();
      ctx.fill();
    });

    // Wall peg hooks with hanging items
    const wallPegs = [
      { x: 300, item: 'wizard_hat' },
      { x: 1250, item: 'cape' },
      { x: 2200, item: 'scarf' }
    ];
    wallPegs.forEach(peg => {
      const sx = peg.x - camX * 0.45;
      if (sx < -60 || sx > canvas.width + 60) return;

      // Wooden peg knob
      ctx.fillStyle = '#854d0e';
      ctx.beginPath();
      ctx.arc(sx, 165, 4, 0, Math.PI * 2);
      ctx.fill();

      if (peg.item === 'wizard_hat') {
        // Pointy child wizard hat with yellow stars
        ctx.fillStyle = '#6b21a8';
        ctx.beginPath();
        ctx.ellipse(sx, 205, 16, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(sx - 12, 204);
        ctx.quadraticCurveTo(sx - 3, 175, sx + 8, 168);
        ctx.quadraticCurveTo(sx + 4, 185, sx + 12, 204);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.fillRect(sx, 186, 3, 3);
      } else if (peg.item === 'cape') {
        // Little hero cape
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(sx, 165);
        ctx.lineTo(sx + 16, 212);
        ctx.quadraticCurveTo(sx + 5, 218, sx - 10, 212);
        ctx.closePath();
        ctx.fill();
      } else {
        // Striped winter scarf
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(sx - 4, 168, 8, 38);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(sx - 4, 178, 8, 5);
        ctx.fillRect(sx - 4, 192, 8, 5);
      }
    });

    // Framed children's crayon drawings on the wall
    const wallDrawings = [
      { x: 420, y: 140, type: 'sun' },
      { x: 980, y: 130, type: 'castle' },
      { x: 1600, y: 140, type: 'rainbow' },
      { x: 2360, y: 130, type: 'cat' }
    ];
    wallDrawings.forEach(d => {
      const sx = d.x - camX * 0.45;
      if (sx < -70 || sx > canvas.width + 70) return;

      // Wooden picture frame
      ctx.fillStyle = '#451a03';
      ctx.fillRect(sx - 2, d.y - 2, 48, 44);
      // Paper sheet
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(sx + 2, d.y + 2, 40, 36);

      if (d.type === 'sun') {
        // Big yellow smiley sun with crayon rays
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(sx + 22, d.y + 20, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2;
        for (let a = 0; a < 8; a++) {
          const ang = a * (Math.PI / 4);
          ctx.beginPath();
          ctx.moveTo(sx + 22 + Math.cos(ang) * 9, d.y + 20 + Math.sin(ang) * 9);
          ctx.lineTo(sx + 22 + Math.cos(ang) * 14, d.y + 20 + Math.sin(ang) * 14);
          ctx.stroke();
        }
        // Smiley face
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(sx + 19, d.y + 18, 1.5, 1.5);
        ctx.fillRect(sx + 24, d.y + 18, 1.5, 1.5);
        ctx.beginPath();
        ctx.arc(sx + 22, d.y + 21, 3, 0.2, Math.PI - 0.2);
        ctx.stroke();
      } else if (d.type === 'castle') {
        // Little purple crayon castle
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(sx + 10, d.y + 14, 24, 18);
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.moveTo(sx + 22, d.y + 6);
        ctx.lineTo(sx + 13, d.y + 14);
        ctx.lineTo(sx + 31, d.y + 14);
        ctx.closePath();
        ctx.fill();
      } else if (d.type === 'rainbow') {
        // Crayon rainbow
        ctx.lineWidth = 2;
        const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];
        colors.forEach((c, idx) => {
          ctx.strokeStyle = c;
          ctx.beginPath();
          ctx.arc(sx + 22, d.y + 32, 15 - idx * 2.5, Math.PI, 0);
          ctx.stroke();
        });
      } else {
        // Crayon cat
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(sx + 22, d.y + 22, 7, 0, Math.PI * 2);
        ctx.fill();
        // Ears
        ctx.beginPath();
        ctx.moveTo(sx + 17, d.y + 17);
        ctx.lineTo(sx + 15, d.y + 11);
        ctx.lineTo(sx + 20, d.y + 16);
        ctx.moveTo(sx + 24, d.y + 16);
        ctx.lineTo(sx + 29, d.y + 11);
        ctx.lineTo(sx + 27, d.y + 17);
        ctx.fill();
      }
    });

    // High floating wall shelf with miniature toys
    const wallShelves = [580, 1400, 2100];
    wallShelves.forEach(wx => {
      const sx = wx - camX * 0.4;
      if (sx < -120 || sx > canvas.width + 120) return;

      // Wooden shelf board
      ctx.fillStyle = '#312117';
      ctx.fillRect(sx, 160, 95, 8);
      // Metal shelf bracket supports
      ctx.strokeStyle = '#1e140d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx + 12, 168);
      ctx.lineTo(sx + 12, 184);
      ctx.lineTo(sx + 26, 168);
      ctx.moveTo(sx + 83, 168);
      ctx.lineTo(sx + 83, 184);
      ctx.lineTo(sx + 69, 168);
      ctx.stroke();

      // Books leaning on shelf
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(sx + 12, 134, 7, 26);
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(sx + 20, 138, 6, 22);

      // Glass snowglobe
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sx + 45, 144, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#451a03';
      ctx.fillRect(sx + 38, 154, 14, 6);

      // Miniature wooden sailboat
      ctx.fillStyle = '#854d0e';
      ctx.beginPath();
      ctx.moveTo(sx + 68, 156);
      ctx.lineTo(sx + 86, 156);
      ctx.lineTo(sx + 81, 160);
      ctx.lineTo(sx + 72, 160);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(sx + 77, 156);
      ctx.lineTo(sx + 77, 140);
      ctx.lineTo(sx + 84, 153);
      ctx.closePath();
      ctx.fill();
    });

    // --- FLOOR & BASEBOARDS ---
    ctx.fillStyle = '#1c1726';
    ctx.fillRect(0, FLOOR_Y, canvas.width, canvas.height - FLOOR_Y + 700);

    // Dark wood baseboard molding
    ctx.fillStyle = '#2b2138';
    ctx.fillRect(0, FLOOR_Y - 8, canvas.width, 8);
    ctx.strokeStyle = '#3e3152';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, FLOOR_Y - 8);
    ctx.lineTo(canvas.width, FLOOR_Y - 8);
    ctx.stroke();

    // Wooden plank seams on floor
    ctx.strokeStyle = '#15111e';
    ctx.lineWidth = 2;
    for (let x = -80; x < canvas.width + 80; x += 70) {
      const sx = x - (camX % 70);
      ctx.beginPath();
      ctx.moveTo(sx, FLOOR_Y);
      ctx.lineTo(sx - 28, canvas.height + 700);
      ctx.stroke();
    }
  }

  /**
   * Renders toys, rugs, books, and scattered clutter across the floor
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {Array} [scenery]
   * @param {number} [camX]
   */
  renderScenery(ctx, canvas, scenery = defaultRoomScenery, camX = 0) {
    if (!ctx || !canvas || !Array.isArray(scenery)) return;
    const roomScenery = scenery;
    const FLOOR_Y = this.floorY;

    roomScenery.forEach((item) => {
      const sx = item.x - camX;
      if (sx < -160 || sx > canvas.width + 160) return;

      ctx.save();

      switch (item.type) {
        case 'fluffy_rug': {
          // Large round pastel mandala rug on floor
          ctx.fillStyle = '#4a2840';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y + 18, 55, 16, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#9d4edd';
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.fillStyle = '#7b2cbf';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y + 18, 38, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'striped_rug': {
          // Oval striped runner rug
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y + 20, 60, 15, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.strokeStyle = '#facc15';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y + 20, 42, 10, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }

        case 'dropped_sweater': {
          // Dropped kid's soft cozy knit sweater
          ctx.fillStyle = '#ec4899';
          ctx.strokeStyle = '#9d174d';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 9, 16, 9, 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Crumpled sleeves
          ctx.beginPath();
          ctx.ellipse(sx - 14, FLOOR_Y - 5, 8, 4.5, -0.4, 0, Math.PI * 2);
          ctx.ellipse(sx + 14, FLOOR_Y - 6, 8, 4.5, 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Little buttons
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 1, FLOOR_Y - 12, 2, 2);
          ctx.fillRect(sx - 1, FLOOR_Y - 7, 2, 2);
          break;
        }

        case 'striped_socks': {
          // Pair of colorful kid socks tossed on floor
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.roundRect(sx - 8, FLOOR_Y - 6, 14, 6, 3);
          ctx.roundRect(sx + 6, FLOOR_Y - 8, 12, 6, 3);
          ctx.fill();
          // Stripes
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx - 4, FLOOR_Y - 6, 3, 6);
          ctx.fillRect(sx + 10, FLOOR_Y - 8, 3, 6);
          break;
        }

        case 'spilled_crayons': {
          // Box of crayons tipped over with crayons rolled out & scribbles
          // Crayon scribble on the floor
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sx - 20, FLOOR_Y - 2);
          ctx.lineTo(sx - 8, FLOOR_Y - 4);
          ctx.lineTo(sx + 12, FLOOR_Y - 1);
          ctx.stroke();

          // Yellow box
          ctx.fillStyle = '#eab308';
          ctx.strokeStyle = '#854d0e';
          ctx.lineWidth = 1;
          ctx.fillRect(sx - 18, FLOOR_Y - 14, 18, 12);
          ctx.strokeRect(sx - 18, FLOOR_Y - 14, 18, 12);
          ctx.fillStyle = '#1e3a8a';
          ctx.fillRect(sx - 18, FLOOR_Y - 10, 18, 3);

          // Individual crayons rolling on the floor
          const crayonColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
          crayonColors.forEach((col, idx) => {
            ctx.fillStyle = col;
            ctx.fillRect(sx + 2 + idx * 7, FLOOR_Y - 4, 10, 3);
            ctx.beginPath();
            ctx.moveTo(sx + 12 + idx * 7, FLOOR_Y - 4);
            ctx.lineTo(sx + 14 + idx * 7, FLOOR_Y - 2.5);
            ctx.lineTo(sx + 12 + idx * 7, FLOOR_Y - 1);
            ctx.fill();
          });
          break;
        }

        case 'paper_airplane': {
          // White paper glider resting nose-down
          ctx.fillStyle = '#f8fafc';
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx - 12, FLOOR_Y - 10);
          ctx.lineTo(sx + 8, FLOOR_Y - 2);
          ctx.lineTo(sx - 4, FLOOR_Y - 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(sx - 10, FLOOR_Y - 6);
          ctx.lineTo(sx + 8, FLOOR_Y - 2);
          ctx.lineTo(sx - 4, FLOOR_Y - 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        }

        case 'toy_car': {
          // Wooden retro red toy racecar
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.roundRect(sx - 14, FLOOR_Y - 12, 28, 9, [4, 4, 2, 2]);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 8, 4, 0, Math.PI * 2);
          ctx.fill();
          // Black wooden wheels
          ctx.fillStyle = '#18181b';
          ctx.beginPath();
          ctx.arc(sx - 8, FLOOR_Y - 3, 4, 0, Math.PI * 2);
          ctx.arc(sx + 8, FLOOR_Y - 3, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'scattered_blocks': {
          // Scattered wooden alphabet blocks
          const blocks = [
            { x: sx - 10, y: FLOOR_Y - 14, col: '#ef4444', letter: 'A' },
            { x: sx + 4, y: FLOOR_Y - 12, col: '#3b82f6', letter: 'B' },
            { x: sx - 2, y: FLOOR_Y - 24, col: '#eab308', letter: 'C' }
          ];
          blocks.forEach(b => {
            ctx.fillStyle = b.col;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.fillRect(b.x, b.y, 12, 12);
            ctx.strokeRect(b.x, b.y, 12, 12);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px sans-serif';
            ctx.fillText(b.letter, b.x + 2, b.y + 9);
          });
          break;
        }

        case 'cardboard_box_floor': {
          // Open cardboard box on the floor with plushies peeking out
          ctx.fillStyle = '#926038';
          ctx.strokeStyle = '#5f3c1f';
          ctx.lineWidth = 1.4;
          ctx.fillRect(sx - 20, FLOOR_Y - 26, 40, 26);
          ctx.strokeRect(sx - 20, FLOOR_Y - 26, 40, 26);
          // Open flaps
          ctx.beginPath();
          ctx.moveTo(sx - 20, FLOOR_Y - 26);
          ctx.lineTo(sx - 28, FLOOR_Y - 34);
          ctx.lineTo(sx - 10, FLOOR_Y - 26);
          ctx.moveTo(sx + 20, FLOOR_Y - 26);
          ctx.lineTo(sx + 28, FLOOR_Y - 34);
          ctx.lineTo(sx + 10, FLOOR_Y - 26);
          ctx.stroke();
          // Cute teddy bear head inside
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 28, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.arc(sx - 6, FLOOR_Y - 34, 3.5, 0, Math.PI * 2);
          ctx.arc(sx + 6, FLOOR_Y - 34, 3.5, 0, Math.PI * 2);
          ctx.fill();
          // Label tape
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 12, FLOOR_Y - 16, 24, 7);
          ctx.fillStyle = '#1e1b4b';
          ctx.font = '6px sans-serif';
          ctx.fillText('BRINQUEDOS', sx - 11, FLOOR_Y - 11);
          break;
        }

        case 'dinosaur_felt': {
          // Little green felt dinosaur toy
          ctx.fillStyle = '#16a34a';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 10, 14, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          // Neck & head
          ctx.beginPath();
          ctx.moveTo(sx + 8, FLOOR_Y - 12);
          ctx.lineTo(sx + 14, FLOOR_Y - 24);
          ctx.arc(sx + 16, FLOOR_Y - 24, 4, 0, Math.PI * 2);
          ctx.lineTo(sx + 10, FLOOR_Y - 8);
          ctx.fill();
          // Yellow back spikes
          ctx.fillStyle = '#facc15';
          for (let s = 0; s < 4; s++) {
            ctx.beginPath();
            ctx.moveTo(sx - 8 + s * 5, FLOOR_Y - 16);
            ctx.lineTo(sx - 6 + s * 5, FLOOR_Y - 21);
            ctx.lineTo(sx - 4 + s * 5, FLOOR_Y - 16);
            ctx.fill();
          }
          break;
        }

        case 'slinky': {
          // Rainbow coil slinky stretched on floor
          const slinkyColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6'];
          ctx.lineWidth = 1.8;
          for (let i = 0; i < 10; i++) {
            ctx.strokeStyle = slinkyColors[i % slinkyColors.length];
            ctx.beginPath();
            ctx.ellipse(sx - 18 + i * 4, FLOOR_Y - 9, 3.5, 9, 0.2, 0, Math.PI * 2);
            ctx.stroke();
          }
          break;
        }

        case 'wooden_spinning_top': {
          // Colorful spinning top with wound string
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.moveTo(sx - 9, FLOOR_Y - 18);
          ctx.lineTo(sx + 9, FLOOR_Y - 18);
          ctx.lineTo(sx, FLOOR_Y - 3);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(sx - 9, FLOOR_Y - 18, 18, 4);
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx - 2, FLOOR_Y - 24, 4, 6);
          break;
        }

        case 'plush_bunny': {
          // Soft plush bunny with floppy ears
          ctx.fillStyle = '#f1f5f9';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 10, 11, 9, 0, 0, Math.PI * 2);
          ctx.arc(sx + 8, FLOOR_Y - 18, 7, 0, Math.PI * 2);
          ctx.fill();
          // Long floppy ear
          ctx.fillStyle = '#fed7aa';
          ctx.beginPath();
          ctx.ellipse(sx + 4, FLOOR_Y - 27, 3, 8, -0.3, 0, Math.PI * 2);
          ctx.fill();
          // Eye & pink nose
          ctx.fillStyle = '#db2777';
          ctx.beginPath();
          ctx.arc(sx + 14, FLOOR_Y - 18, 1.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'puzzle_pieces': {
          // Scattered jigsaw puzzle pieces
          const pCols = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'];
          pCols.forEach((col, i) => {
            ctx.fillStyle = col;
            ctx.fillRect(sx - 12 + i * 8, FLOOR_Y - 5, 6, 5);
            ctx.beginPath();
            ctx.arc(sx - 9 + i * 8, FLOOR_Y - 5, 2, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }

        case 'toy_train': {
          // Classic wooden toy locomotive
          ctx.fillStyle = '#1d4ed8';
          ctx.fillRect(sx - 14, FLOOR_Y - 16, 22, 12);
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(sx + 8, FLOOR_Y - 22, 10, 18);
          // Smokestack
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx - 10, FLOOR_Y - 22, 5, 7);
          // Wheels
          ctx.fillStyle = '#18181b';
          ctx.beginPath();
          ctx.arc(sx - 6, FLOOR_Y - 4, 4, 0, Math.PI * 2);
          ctx.arc(sx + 4, FLOOR_Y - 4, 4, 0, Math.PI * 2);
          ctx.arc(sx + 13, FLOOR_Y - 4, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'open_story_book': {
          // Open picture book on floor with ribbon bookmark
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.moveTo(sx, FLOOR_Y - 4);
          ctx.quadraticCurveTo(sx - 12, FLOOR_Y - 12, sx - 22, FLOOR_Y - 4);
          ctx.lineTo(sx - 22, FLOOR_Y - 1);
          ctx.lineTo(sx, FLOOR_Y - 1);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(sx, FLOOR_Y - 4);
          ctx.quadraticCurveTo(sx + 12, FLOOR_Y - 12, sx + 22, FLOOR_Y - 4);
          ctx.lineTo(sx + 22, FLOOR_Y - 1);
          ctx.lineTo(sx, FLOOR_Y - 1);
          ctx.fill();
          // Red bookmark ribbon
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx, FLOOR_Y - 4);
          ctx.quadraticCurveTo(sx + 4, FLOOR_Y + 4, sx + 10, FLOOR_Y + 6);
          ctx.stroke();
          break;
        }

        case 'spilled_marbles': {
          // Translucent glass marbles reflecting light
          const mColors = ['#06b6d4', '#f43f5e', '#a855f7', '#22c55e', '#eab308'];
          mColors.forEach((mc, i) => {
            const mx = sx - 15 + i * 8;
            const my = FLOOR_Y - 4;
            ctx.fillStyle = mc;
            ctx.beginPath();
            ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
            ctx.fill();
            // Highlight
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(mx - 1, my - 1, 1, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }

        case 'toy_soldier': {
          // Tin guard with red coat and tall black bearskin hat
          ctx.fillStyle = '#1e1b4b'; // tall hat
          ctx.fillRect(sx - 3, FLOOR_Y - 32, 6, 12);
          ctx.fillStyle = '#fed7aa'; // face
          ctx.fillRect(sx - 3, FLOOR_Y - 20, 6, 5);
          ctx.fillStyle = '#dc2626'; // coat
          ctx.fillRect(sx - 4, FLOOR_Y - 15, 8, 8);
          ctx.fillStyle = '#facc15'; // belt
          ctx.fillRect(sx - 4, FLOOR_Y - 11, 8, 2);
          ctx.fillStyle = '#1e293b'; // boots
          ctx.fillRect(sx - 3, FLOOR_Y - 7, 6, 7);
          break;
        }

        case 'retro_robot': {
          // Mint green tin robot with winding key & antenna
          ctx.fillStyle = '#0d9488';
          ctx.fillRect(sx - 7, FLOOR_Y - 24, 14, 12); // head
          ctx.fillRect(sx - 9, FLOOR_Y - 12, 18, 10); // body
          // Yellow dial
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 4, FLOOR_Y - 10, 8, 6);
          // Antenna with red bead
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(sx, FLOOR_Y - 24);
          ctx.lineTo(sx, FLOOR_Y - 30);
          ctx.stroke();
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 31, 2.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'jack_in_box': {
          // Jack in the box clown
          ctx.fillStyle = '#8b5cf6';
          ctx.fillRect(sx - 12, FLOOR_Y - 20, 24, 20);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(sx - 12, FLOOR_Y - 20, 24, 20);
          // Spring
          ctx.strokeStyle = '#94a3b8';
          ctx.beginPath();
          for (let s = 0; s < 4; s++) {
            ctx.lineTo(sx + (s % 2 === 0 ? -6 : 6), FLOOR_Y - 20 - s * 5);
          }
          ctx.stroke();
          // Clown head
          ctx.fillStyle = '#fdf4ff';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 44, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 43, 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'rattle': {
          // Pastel baby rattle
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 18, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 18, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx - 2, FLOOR_Y - 10, 4, 10);
          break;
        }

        case 'windup_mouse': {
          // Tiny grey clockwork mouse with brass winding key
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 6, 9, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          // Round ear
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.arc(sx - 4, FLOOR_Y - 10, 3, 0, Math.PI * 2);
          ctx.fill();
          // Winding key
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(sx + 6, FLOOR_Y - 11, 3.5, 0, Math.PI * 2);
          ctx.moveTo(sx + 6, FLOOR_Y - 8);
          ctx.lineTo(sx + 6, FLOOR_Y - 5);
          ctx.stroke();
          break;
        }

        case 'cradle': {
          // Antique wooden rocking cradle
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx - 24, FLOOR_Y - 35, 48, 26);
          // Rocker curved base
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 5, 28, 0.2, Math.PI - 0.2);
          ctx.stroke();
          // Pillow & blanket
          ctx.fillStyle = '#fce7f3';
          ctx.fillRect(sx - 20, FLOOR_Y - 32, 40, 10);
          break;
        }

        case 'giant_spool': {
          // Giant spool of thread
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 14, FLOOR_Y - 24, 28, 4);
          ctx.fillRect(sx - 14, FLOOR_Y - 4, 28, 4);
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(sx - 10, FLOOR_Y - 20, 20, 16);
          break;
        }

        case 'wooden_horse': {
          // Rocking horse on floor
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 18, 16, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          // Horse head
          ctx.beginPath();
          ctx.moveTo(sx + 10, FLOOR_Y - 20);
          ctx.lineTo(sx + 18, FLOOR_Y - 36);
          ctx.lineTo(sx + 24, FLOOR_Y - 32);
          ctx.lineTo(sx + 16, FLOOR_Y - 16);
          ctx.closePath();
          ctx.fill();
          // Rocker runners
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 3, 26, 0.25, Math.PI - 0.25);
          ctx.stroke();
          break;
        }

        default:
          break;
      }

      ctx.restore();
    });
  }

  /**
   * Convenience render method that draws both background wall and room clutter
   */
  render(ctx, canvas, camX = 0, options = {}) {
    this.renderWall(ctx, canvas, camX, options);
    this.renderScenery(ctx, canvas, options.roomScenery || defaultRoomScenery, camX);
  }
}

export const backgroundRenderer = new BackgroundRenderer();
