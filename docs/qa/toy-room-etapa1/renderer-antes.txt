/**
 * RoomEnvironmentRenderer.js
 * Cenário 2D visto de cima da Sala de Brinquedos estilo Legend of Mana:
 * - Tábuas de piso em carvalho dourado com nós e veios orgânicos de madeira
 * - Papel de parede ensolarado em tons de rosa e pêssego com estêncil floral e rodapé esculpido
 * - Janelas em arco com vitrais projetando feixes volumétricos de luz solar
 * - Portal de entrada iluminado
 * - Tapetes ornamentados (Mandala radiante, tapete de brincar floral e tapete de cabeceira com franjas)
 * - Circuito de trilhos de trem de madeira
 * - Móveis robustos e detalhados (Baú com tampa móvel, estante de livros, poltrona, fortaleza, mesa, cavalinho de pau, armário)
 */

export class RoomEnvironmentRenderer {
  /**
   * Renderiza o piso, paredes, janelas, portais, tapetes e trilhos do quarto
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} roomW
   * @param {number} roomH
   */
  renderBackground(ctx, roomW, roomH, options = {}) {
    if (!ctx) return;

    const floorTile = options.assets && options.assets.get('toy-room-floor-tile');
    const environmentTile = options.environmentSheet;

    if (environmentTile) {
      this.renderPerspectiveFloor(ctx, environmentTile, roomW, roomH);
    } else if (floorTile) {
      const pattern = ctx.createPattern(environmentTile || floorTile, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 240, roomW, roomH - 240);
      }
    }

    // Piso: Tábuas de carvalho dourado com veios desenhados à mão
    if (!floorTile) {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(0, 0, roomW, roomH);
    }

    const frameGradient = ctx.createLinearGradient(0, 0, 0, 54);
    frameGradient.addColorStop(0, '#5b2d16');
    frameGradient.addColorStop(0.45, '#8a4a20');
    frameGradient.addColorStop(1, '#3b1d12');
    ctx.fillStyle = frameGradient;
    ctx.fillRect(0, 0, roomW, 54);
    ctx.fillRect(0, roomH - 54, roomW, 54);
    ctx.fillRect(0, 0, 54, roomH);
    ctx.fillRect(roomW - 54, 0, 54, roomH);

    ctx.strokeStyle = 'rgba(255, 214, 126, 0.38)';
    ctx.lineWidth = 2;
    ctx.strokeRect(27, 27, roomW - 54, roomH - 54);
    ctx.strokeStyle = 'rgba(45, 20, 10, 0.7)';
    ctx.lineWidth = 5;
    ctx.strokeRect(58, 58, roomW - 116, roomH - 116);

    for (let x = 72; x < roomW - 72; x += 128) {
      ctx.fillStyle = 'rgba(35, 16, 9, 0.38)';
      ctx.fillRect(x, 17, 84, 3);
      ctx.fillStyle = 'rgba(255, 201, 106, 0.16)';
      ctx.fillRect(x + 4, 21, 76, 2);
      ctx.fillStyle = 'rgba(35, 16, 9, 0.38)';
      ctx.fillRect(x, roomH - 21, 84, 3);
    }

    // Linhas de tábuas de madeira no chão
    const plankHeight = 48;
    for (let y = 240; y < roomH; y += plankHeight) {
      if (floorTile) continue;
      ctx.fillStyle = (y / plankHeight) % 2 === 0 ? '#fde68a' : '#fef08a';
      ctx.fillRect(0, y, roomW, plankHeight);

      // Ranhura divisória da tábua
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(roomW, y);
      ctx.stroke();

      // Nós orgânicos e detalhes de veios de madeira
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.22)';
      ctx.lineWidth = 1.0;
      for (let x = (y * 7) % 120; x < roomW; x += 180) {
        ctx.beginPath();
        ctx.ellipse(x + 35, y + 24, 18, 5, 0.05, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.fillStyle = '#6b3518';
    ctx.fillRect(54, 74, roomW - 108, 9);
    ctx.fillStyle = '#d18a3b';
    ctx.fillRect(54, 74, roomW - 108, 2);

    // Janelas em arco na parede trazendo iluminação dourada natural
    this.drawArchedWindow(ctx, 520, 30);
    this.drawArchedWindow(ctx, 1280, 30);

    // Porta aberta à esquerda (por onde a garotinha emergiu)
    this.drawEntrancePortal(ctx, 50, 550, options.environmentDoor);

    // Tapetes decorativos no chão
    if (options.environmentRug) {
      ctx.drawImage(options.environmentRug, 650, 555, 300, 255);
    } else {
      this.drawCentralMandalaRug(ctx, 800, 700);
    }
    this.drawFloralPlayMat(ctx, 1180, 520);
    this.drawBedsideFringeRug(ctx, 280, 920);

    // Circuito de trilhos de trem de madeira
    this.drawTrainTracks(ctx);

    if (options.environmentDetails) {
      options.environmentDetails.forEach((detail) => {
        if (detail.image) {
          ctx.drawImage(detail.image, detail.x, detail.y, detail.width, detail.height);
        }
      });
    }
  }

  renderPerspectiveFloor(ctx, tile, roomW, roomH) {
    const floorTop = 240;
    const floorHeight = roomH - floorTop;
    const bandCount = 18;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, floorTop, roomW, floorHeight);
    ctx.clip();

    for (let band = 0; band < bandCount; band++) {
      const near = band / bandCount;
      const far = (band + 1) / bandCount;
      const y = floorTop + floorHeight * near;
      const nextY = floorTop + floorHeight * far;
      const depthScale = 0.52 + near * 0.95;
      const tileWidth = tile.width * depthScale;
      const tileHeight = Math.max(1, nextY - y + 1);

      for (let x = -tileWidth; x < roomW + tileWidth; x += tileWidth) {
        ctx.drawImage(tile, x, y, tileWidth + 1, tileHeight);
      }

      ctx.fillStyle = `rgba(72, 35, 16, ${0.12 - near * 0.06})`;
      ctx.fillRect(0, y, roomW, 1.5);
    }

    const depthShade = ctx.createLinearGradient(0, floorTop, 0, roomH);
    depthShade.addColorStop(0, 'rgba(42, 20, 10, 0.22)');
    depthShade.addColorStop(0.45, 'rgba(255, 201, 106, 0.02)');
    depthShade.addColorStop(1, 'rgba(68, 26, 10, 0.12)');
    ctx.fillStyle = depthShade;
    ctx.fillRect(0, floorTop, roomW, floorHeight);
    ctx.restore();
  }

  drawArchedWindow(ctx, wx, wy) {
    ctx.save();
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(wx + 80, wy + 80, 80, Math.PI, 0, false);
    ctx.rect(wx, wy + 80, 160, 90);
    ctx.fill();

    const glassGrad = ctx.createLinearGradient(wx, wy, wx, wy + 170);
    glassGrad.addColorStop(0, '#38bdf8');
    glassGrad.addColorStop(0.6, '#a7f3d0');
    glassGrad.addColorStop(1, '#fef08a');
    ctx.fillStyle = glassGrad;
    ctx.beginPath();
    ctx.arc(wx + 80, wy + 80, 68, Math.PI, 0, false);
    ctx.rect(wx + 12, wy + 80, 136, 80);
    ctx.fill();

    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(wx + 80, wy + 12);
    ctx.lineTo(wx + 80, wy + 160);
    ctx.moveTo(wx + 12, wy + 90);
    ctx.lineTo(wx + 148, wy + 90);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.moveTo(wx + 10, wy + 40);
    ctx.quadraticCurveTo(wx + 35, wy + 100, wx + 15, wy + 170);
    ctx.lineTo(wx + 10, wy + 170);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(wx + 150, wy + 40);
    ctx.quadraticCurveTo(wx + 125, wy + 100, wx + 145, wy + 170);
    ctx.lineTo(wx + 150, wy + 170);
    ctx.fill();

    // Feixe de luz solar volumétrico projetando diagonalmente no chão
    const beamGrad = ctx.createLinearGradient(wx + 80, wy + 160, wx - 180, wy + 620);
    beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.38)');
    beamGrad.addColorStop(0.4, 'rgba(253, 224, 71, 0.18)');
    beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(wx + 10, wy + 160);
    ctx.lineTo(wx + 150, wy + 160);
    ctx.lineTo(wx + 40, wy + 640);
    ctx.lineTo(wx - 260, wy + 640);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawEntrancePortal(ctx, dx, dy, environmentDoor = null) {
    if (environmentDoor) {
      ctx.drawImage(environmentDoor, dx, dy, 88, 136);
      return;
    }
    ctx.save();
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(dx + 25, dy + 50, 50, -Math.PI / 2, Math.PI / 2);
    ctx.rect(dx, dy, 25, 100);
    ctx.fill();

    const portalGlow = ctx.createRadialGradient(dx + 20, dy + 50, 10, dx + 20, dy + 50, 65);
    portalGlow.addColorStop(0, '#ffffff');
    portalGlow.addColorStop(0.5, '#fde047');
    portalGlow.addColorStop(1, '#fb923c');
    ctx.fillStyle = portalGlow;
    ctx.beginPath();
    ctx.arc(dx + 20, dy + 50, 42, -Math.PI / 2, Math.PI / 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.fillRect(dx + 25, dy + 15, 45, 70);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(dx + 27, dy + 17, 41, 66);
    ctx.restore();
  }

  drawCentralMandalaRug(ctx, cx, cy) {
    ctx.save();
    ctx.fillStyle = 'rgba(120, 53, 15, 0.25)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, 226, 176, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 222, 172, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 210, 160, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 175, 130, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 120, 90, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#be185d';
    ctx.lineWidth = 3;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const rx1 = cx + Math.cos(a) * 40;
      const ry1 = cy + Math.sin(a) * 30;
      const rx2 = cx + Math.cos(a) * 110;
      const ry2 = cy + Math.sin(a) * 80;
      ctx.beginPath();
      ctx.moveTo(rx1, ry1);
      ctx.lineTo(rx2, ry2);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawFloralPlayMat(ctx, rx, ry) {
    ctx.save();
    ctx.fillStyle = 'rgba(53, 24, 11, 0.34)';
    ctx.beginPath();
    ctx.ellipse(rx + 125, ry + 88, 135, 84, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#bd3f54';
    ctx.beginPath();
    ctx.ellipse(rx + 125, ry + 80, 128, 78, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6f2c25';
    ctx.lineWidth = 7;
    ctx.stroke();

    ctx.fillStyle = '#198b91';
    ctx.beginPath();
    ctx.ellipse(rx + 125, ry + 80, 103, 59, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d58b39';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#e7ad43';
    ctx.beginPath();
    ctx.ellipse(rx + 125, ry + 80, 63, 37, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8f4b28';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(111, 44, 37, 0.62)';
    ctx.lineWidth = 2;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      ctx.beginPath();
      ctx.moveTo(rx + 125 + Math.cos(angle) * 12, ry + 80 + Math.sin(angle) * 8);
      ctx.lineTo(rx + 125 + Math.cos(angle) * 50, ry + 80 + Math.sin(angle) * 29);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawBedsideFringeRug(ctx, bx, by) {
    ctx.save();
    ctx.fillStyle = 'rgba(120, 53, 15, 0.2)';
    ctx.fillRect(bx - 4, by - 4, 188, 128);

    ctx.fillStyle = '#2f8d79';
    ctx.fillRect(bx, by, 180, 120);
    ctx.strokeStyle = '#174f4b';
    ctx.lineWidth = 5;
    ctx.strokeRect(bx + 3, by + 3, 174, 114);

    ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx + 12, by + 12, 156, 96);

    ctx.fillStyle = '#f2c05e';
    for (let fx = bx + 6; fx < bx + 174; fx += 8) {
      ctx.fillRect(fx, by - 6, 4, 6);
      ctx.fillRect(fx, by + 120, 4, 6);
    }
    ctx.restore();
  }

  drawTrainTracks(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(53, 24, 11, 0.38)';
    ctx.lineWidth = 24;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(350, 420);
    ctx.lineTo(820, 420);
    ctx.quadraticCurveTo(980, 420, 980, 580);
    ctx.lineTo(980, 920);
    ctx.quadraticCurveTo(980, 1040, 840, 1040);
    ctx.lineTo(440, 1040);
    ctx.quadraticCurveTo(320, 1040, 320, 920);
    ctx.lineTo(320, 560);
    ctx.quadraticCurveTo(320, 420, 350, 420);
    ctx.stroke();

    ctx.strokeStyle = '#6f351b';
    ctx.lineWidth = 8;
    ctx.translate(0, -7);
    ctx.stroke();
    ctx.translate(0, 14);
    ctx.stroke();

    ctx.translate(0, -7);
    ctx.strokeStyle = '#d58b39';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 28]);
    ctx.stroke();
    ctx.translate(0, 14);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  /**
   * Renderiza um obstáculo ou móvel específico
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} f Objeto do móvel
   */
  renderFurniture(ctx, f, options = {}) {
    if (!ctx || !f) return;

    if (f.type === 'chest' && options.environmentChest) {
      ctx.drawImage(options.environmentChest, f.x - 4, f.y - 10, f.w + 8, f.h + 22);
      return;
    }

    if (f.type === 'table' && options.environmentTable) {
      ctx.save();
      ctx.fillStyle = 'rgba(53, 24, 11, 0.3)';
      ctx.beginPath();
      ctx.ellipse(f.x + f.w / 2, f.y + f.h - 2, f.w / 2 + 18, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.drawImage(options.environmentTable, f.x - 4, f.y - 16, f.w + 8, f.h + 28);
      ctx.restore();
      return;
    }

    ctx.save();
    // Sombra projetada no chão
    ctx.fillStyle = 'rgba(80, 35, 10, 0.35)';
    ctx.beginPath();
    ctx.ellipse(f.x + f.w / 2, f.y + f.h - 4, f.w / 2 + 12, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    if (f.type === 'chest') {
      // Caixa base do baú
      ctx.fillStyle = '#92400e';
      ctx.fillRect(f.x, f.y + 25, f.w, f.h - 25);

      // Placas e tachas douradas nos cantos
      ctx.fillStyle = '#facc15';
      ctx.fillRect(f.x, f.y + 25, 18, f.h - 25);
      ctx.fillRect(f.x + f.w - 18, f.y + 25, 18, f.h - 25);
      ctx.fillRect(f.x + f.w / 2 - 12, f.y + 25, 24, f.h - 25);

      // Placa de fechadura frontal e buraco da chave
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(f.x + f.w / 2, f.y + 55, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(f.x + f.w / 2, f.y + 53, 5, 0, Math.PI * 2);
      ctx.rect(f.x + f.w / 2 - 3, f.y + 53, 6, 12);
      ctx.fill();

      // Tampa arredondada do baú
      const lidLift = (f.lidOpen || 0) * 25;
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(f.x + f.w / 2, f.y + 25 - lidLift, f.w / 2, Math.PI, 0, false);
      ctx.fill();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 6;
      ctx.stroke();

      if ((f.lidOpen || 0) > 0.05) {
        ctx.fillStyle = 'rgba(236, 72, 153, 0.85)';
        ctx.fillRect(f.x + 12, f.y + 15 - lidLift, f.w - 24, 18);
      }

      if ((f.glowAlpha || 0) > 0.05) {
        ctx.strokeStyle = `rgba(250, 204, 21, ${f.glowAlpha})`;
        ctx.lineWidth = 4;
        ctx.strokeRect(f.x - 6, f.y - 6, f.w + 12, f.h + 12);
      }

      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 13px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧸 BAÚ DE BRINQUEDOS', f.x + f.w / 2, f.y - 12);
    } else if (f.type === 'shelf') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(f.x, f.y, f.w, f.h);

      ctx.fillStyle = '#b45309';
      ctx.fillRect(f.x + 8, f.y + 8, f.w - 16, f.h - 16);

      const bookColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      for (let bx = f.x + 14; bx < f.x + f.w - 22; bx += 16) {
        ctx.fillStyle = bookColors[(bx / 16) % bookColors.length | 0];
        const bh = 30 + (bx % 14);
        ctx.fillRect(bx, f.y + f.h - 14 - bh, 13, bh);
      }
    } else if (f.type === 'armchair') {
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.arc(f.x + f.w / 2, f.y + 40, f.w / 2, Math.PI, 0, false);
      ctx.rect(f.x, f.y + 40, f.w, f.h - 40);
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.fillRect(f.x + 16, f.y + 35, f.w - 32, 45);

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(f.x + f.w / 2, f.y + 55, 14, 0, Math.PI * 2);
      ctx.fill();
    } else if (f.type === 'fortress') {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(f.x, f.y + 35, f.w, f.h - 35);

      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(f.x, f.y + 35);
      ctx.lineTo(f.x + 45, f.y - 15);
      ctx.lineTo(f.x + 90, f.y + 35);
      ctx.fill();

      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.moveTo(f.x + f.w - 90, f.y + 35);
      ctx.lineTo(f.x + f.w - 45, f.y - 15);
      ctx.lineTo(f.x + f.w, f.y + 35);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      for (let bx = f.x + 95; bx < f.x + f.w - 95; bx += 24) {
        ctx.fillRect(bx, f.y + 15, 14, 20);
      }
    } else if (f.type === 'table') {
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(f.x + f.w / 2, f.y + f.h / 2, f.w / 2, f.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(f.x + 35, f.y + 25, 45, 32);
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(f.x + 55, f.y + 40, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (f.type === 'rocking-horse') {
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(f.x + 50, f.y + 40, 38, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(f.x + 50, f.y + 50, 48, 0.2, Math.PI - 0.2, false);
      ctx.stroke();
    } else if (f.type === 'wardrobe') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(f.x, f.y, f.w, f.h);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(f.x + 8, f.y + 8, f.w / 2 - 12, f.h - 16);
      ctx.fillRect(f.x + f.w / 2 + 4, f.y + 8, f.w / 2 - 12, f.h - 16);

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(f.x + f.w / 2 - 10, f.y + f.h / 2, 4, 0, Math.PI * 2);
      ctx.arc(f.x + f.w / 2 + 10, f.y + f.h / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export const roomEnvironmentRenderer = new RoomEnvironmentRenderer();
