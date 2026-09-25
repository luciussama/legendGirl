import { NIGHT_WINDOWS } from './nightWindows.js';
/**
 * BackgroundRenderer.js
 * Renderiza a parede de fundo atmosférica do berçário vitoriano, lambris de madeira,
 * padrões de papel de parede, janelas e itens decorativos detalhados do quarto.
 */

import { FLOOR_Y, roomScenery as defaultRoomScenery } from '../config.js';
import { darkRoomAtlas } from '../assets/index.js';

export class BackgroundRenderer {
  constructor(options = {}) {
    this.floorY = options.floorY ?? FLOOR_Y;
    this.assets = options.assets || null;
  }

  setAssets(assets) {
    this.assets = assets;
  }

  /**
   * Renderiza item de cenário utilizando os sprites de environment-assets.png se disponíveis.
   * Retorna true se o item foi desenhado com sucesso, ou false caso contrário (ativando fallback).
   */
  drawAtlasSceneryItem(ctx, assets, type, sx, item, floorY) {
    if (!assets || !darkRoomAtlas) return false;
    const sheetKey = 'dark-room-environment-sheet';

    let region = null;
    let dw = 40;
    let dh = 40;
    let yOffset = 0;

    switch (type) {
      case 'fluffy_rug': {
        region = darkRoomAtlas.rugs?.roundSmall || darkRoomAtlas.rugs;
        dw = 140;
        dh = 54;
        yOffset = -12;
        break;
      }
      case 'striped_rug': {
        region = darkRoomAtlas.rugs?.largeVictorian || darkRoomAtlas.rugs;
        dw = 220;
        dh = 70;
        yOffset = -14;
        break;
      }
      case 'toy_car': {
        region = darkRoomAtlas.roomScenery?.items?.toy_car;
        dw = 48;
        dh = 40;
        yOffset = -dh + 4;
        break;
      }
      case 'paper_airplane': {
        region = darkRoomAtlas.roomScenery?.items?.paper_airplane;
        dw = 38;
        dh = 40;
        yOffset = -dh + 4;
        break;
      }
      case 'spilled_crayons': {
        region = darkRoomAtlas.roomScenery?.items?.spilled_crayons;
        dw = 50;
        dh = 35;
        yOffset = -dh + 4;
        break;
      }
      case 'scattered_blocks': {
        region = darkRoomAtlas.roomScenery?.items?.scattered_blocks;
        dw = 52;
        dh = 42;
        yOffset = -dh + 4;
        break;
      }
      case 'striped_socks': {
        region = darkRoomAtlas.roomScenery?.items?.striped_socks;
        dw = 38;
        dh = 34;
        yOffset = -dh + 3;
        break;
      }
      case 'toy_soldier': {
        region = darkRoomAtlas.roomScenery?.items?.toy_soldier;
        dw = 36;
        dh = 44;
        yOffset = -dh + 4;
        break;
      }
      case 'wooden_spinning_top': {
        region = darkRoomAtlas.roomScenery?.items?.wooden_spinning_top;
        dw = 36;
        dh = 44;
        yOffset = -dh + 4;
        break;
      }
      case 'spilled_marbles': {
        region = darkRoomAtlas.roomScenery?.items?.spilled_marbles;
        dw = 44;
        dh = 48;
        yOffset = -dh + 4;
        break;
      }
      case 'retro_robot': {
        region = darkRoomAtlas.roomScenery?.items?.retro_robot;
        dw = 38;
        dh = 50;
        yOffset = -dh + 4;
        break;
      }
      case 'plush_bunny': {
        region = darkRoomAtlas.roomScenery?.items?.plush_bunny;
        dw = 38;
        dh = 40;
        yOffset = -dh + 4;
        break;
      }
      case 'puzzle_pieces': {
        region = darkRoomAtlas.roomScenery?.items?.puzzle_pieces;
        dw = 44;
        dh = 48;
        yOffset = -dh + 4;
        break;
      }
      default:
        return false;
    }

    if (!region) return false;
    const sprite = assets.get('dark-room-sprite-' + type.replace(/_/g, '-')) ||
                   assets.getRegion('dark-room-production-spritesheet', region) ||
                   assets.getRegion(sheetKey, region);
    if (!sprite) return false;

    ctx.drawImage(sprite, Math.round(sx - dw / 2), Math.round(floorY + yOffset), dw, dh);
    return true;
  }

  /**
   * Renderiza o papel de parede do berçário vitoriano, painéis de madeira, janelas e piso
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {number} camX
   * @param {object} [options]
   */
  renderWall(ctx, canvas, camX = 0, options = {}) {
    if (!ctx || !canvas) return;
    const FLOOR_Y = this.floorY;
    const tick = options.tick || 0;

    // Fundo atmosférico profundo do berçário, mantendo a assinatura lúdica da playroom em tom escuro
    ctx.fillStyle = '#0d0a14';
    ctx.fillRect(0, -600, canvas.width, canvas.height + 1200);

    // Listras do papel de parede e padrão de losangos com paralaxe
    const bgOffset = (camX * 0.15) % 80;
    ctx.fillStyle = '#17131d';
    for (let x = -80; x < canvas.width + 80; x += 80) {
      ctx.fillRect(x - bgOffset, -400, 40, FLOOR_Y + 400);
    }

    // Reflexo ambiente frio quase imperceptível; a luz principal permanece localizada.
    const topGlow = ctx.createLinearGradient(0, 0, 0, FLOOR_Y);
    topGlow.addColorStop(0, 'rgba(150, 175, 220, 0.015)');
    topGlow.addColorStop(0.38, 'rgba(135, 145, 200, 0.012)');
    topGlow.addColorStop(1, 'rgba(13, 10, 20, 0)');
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, canvas.width, FLOOR_Y + 50);

    // Estrelas douradas suaves no papel de parede, com brilho mais íntimo e velado
    ctx.fillStyle = 'rgba(250, 204, 21, 0.065)';
    for (let x = -80; x < canvas.width + 80; x += 80) {
      const sx = x - bgOffset + 20;
      for (let y = 50; y < FLOOR_Y; y += 65) {
        ctx.beginPath();
        ctx.arc(sx, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Guirlanda de bandeirolas pendurada pelo quarto
    const garlandOffset = (camX * 0.2) % 360;
    ctx.strokeStyle = 'rgba(120, 100, 150, 0.4)';
    ctx.lineWidth = 1.2;
    for (let gx = -360; gx < canvas.width + 360; gx += 180) {
      const sx = gx - garlandOffset;
      ctx.beginPath();
      ctx.moveTo(sx, 70);
      ctx.quadraticCurveTo(sx + 90, 110, sx + 180, 70);
      ctx.stroke();

      // Triângulos coloridos de bandeirolas penduradas
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

    // Janelas para o céu estrelado da noite
    const windowLocations = NIGHT_WINDOWS;
    windowLocations.forEach((wx) => {
      const sx = wx - camX * 0.3;
      if (sx < -140 || sx > canvas.width + 140) return;

      // Moldura da janela em tom mais profundo, mantendo o visual delicado do berçário
      ctx.fillStyle = '#1a1325';
      ctx.strokeStyle = '#4d3c68';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(sx, 80, 90, 130, [45, 45, 4, 4]);
      ctx.fill();
      ctx.stroke();

      // Vidro com o céu da meia-noite em azul nocturno sutil
      ctx.fillStyle = '#090b14';
      ctx.beginPath();
      ctx.roundRect(sx + 6, 86, 78, 118, [40, 40, 2, 2]);
      ctx.fill();

      // Lua crescente prateada, coerente com os feixes frios das janelas.
      ctx.fillStyle = '#dce7f5';
      ctx.beginPath();
      ctx.arc(sx + 35, 115, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#090b14';
      ctx.beginPath();
      ctx.arc(sx + 39, 113, 10, 0, Math.PI * 2);
      ctx.fill();

      // Estrelas cintilando na janela
      ctx.fillStyle = '#f8fafc';
      const tw = Math.sin(tick * 0.05 + wx) * 0.5 + 0.5;
      ctx.fillRect(sx + 60, 110, 2, 2);
      ctx.fillRect(sx + 22, 145, 1.5, 1.5);
      ctx.fillRect(sx + 65, 160, 2 * tw, 2 * tw);

      // Divisórias em cruz da vidraça
      ctx.strokeStyle = '#322549';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx + 45, 86);
      ctx.lineTo(sx + 45, 204);
      ctx.moveTo(sx + 6, 140);
      ctx.lineTo(sx + 84, 140);
      ctx.stroke();

      // Cortinas translúcidas lilases com dobras suaves e tom mais elegante
      ctx.fillStyle = 'rgba(168, 85, 247, 0.20)';
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

    // Ganchos de parede com itens pendurados
    const wallPegs = [
      { x: 300, item: 'wizard_hat' },
      { x: 1250, item: 'cape' },
      { x: 2200, item: 'scarf' }
    ];
    wallPegs.forEach(peg => {
      const sx = peg.x - camX * 0.45;
      if (sx < -60 || sx > canvas.width + 60) return;

      // Puxador/gancho de madeira
      ctx.fillStyle = '#854d0e';
      ctx.beginPath();
      ctx.arc(sx, 165, 4, 0, Math.PI * 2);
      ctx.fill();

      if (peg.item === 'wizard_hat') {
        // Chapéu pontudo de bruxinho infantil com estrelas amarelas
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
        // Capinha de herói infantil
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(sx, 165);
        ctx.lineTo(sx + 16, 212);
        ctx.quadraticCurveTo(sx + 5, 218, sx - 10, 212);
        ctx.closePath();
        ctx.fill();
      } else {
        // Cachecol listrado de inverno
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(sx - 4, 168, 8, 38);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(sx - 4, 178, 8, 5);
        ctx.fillRect(sx - 4, 192, 8, 5);
      }
    });

    // Desenhos em giz de cera emoldurados na parede
    const wallDrawings = [
      { x: 420, y: 140, type: 'sun' },
      { x: 980, y: 130, type: 'castle' },
      { x: 1600, y: 140, type: 'rainbow' },
      { x: 2360, y: 130, type: 'cat' }
    ];
    wallDrawings.forEach(d => {
      const sx = d.x - camX * 0.45;
      if (sx < -70 || sx > canvas.width + 70) return;

      // Moldura de madeira do quadro
      ctx.fillStyle = '#451a03';
      ctx.fillRect(sx - 2, d.y - 2, 48, 44);
      // Folha de papel
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(sx + 2, d.y + 2, 40, 36);

      if (d.type === 'sun') {
        // Sol amarelo sorridente com raios de giz de cera
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
        // Rostinho sorridente
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(sx + 19, d.y + 18, 1.5, 1.5);
        ctx.fillRect(sx + 24, d.y + 18, 1.5, 1.5);
        ctx.beginPath();
        ctx.arc(sx + 22, d.y + 21, 3, 0.2, Math.PI - 0.2);
        ctx.stroke();
      } else if (d.type === 'castle') {
        // Castelo roxo em giz de cera
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
        // Arco-íris em giz de cera
        ctx.lineWidth = 2;
        const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];
        colors.forEach((c, idx) => {
          ctx.strokeStyle = c;
          ctx.beginPath();
          ctx.arc(sx + 22, d.y + 32, 15 - idx * 2.5, Math.PI, 0);
          ctx.stroke();
        });
      } else {
        // Gatinho em giz de cera
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(sx + 22, d.y + 22, 7, 0, Math.PI * 2);
        ctx.fill();
        // Orelhas
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

    // Prateleira alta flutuante na parede com brinquedos em miniatura
    const wallShelves = [580, 1400, 2100];
    wallShelves.forEach(wx => {
      const sx = wx - camX * 0.4;
      if (sx < -120 || sx > canvas.width + 120) return;

      // Prancha de madeira da prateleira
      ctx.fillStyle = '#312117';
      ctx.fillRect(sx, 160, 95, 8);
      // Mão-francesa / suportes metálicos da prateleira
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

      // Livros inclinados na prateleira
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(sx + 12, 134, 7, 26);
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(sx + 20, 138, 6, 22);

      // Globo de neve de vidro
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sx + 45, 144, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#451a03';
      ctx.fillRect(sx + 38, 154, 14, 6);

      // Barco à vela de madeira em miniatura
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

    // --- PISO E RODAPÉS ---
    ctx.fillStyle = '#1c1726';
    ctx.fillRect(0, FLOOR_Y, canvas.width, canvas.height - FLOOR_Y + 700);

    const assets = options.assets || this.assets || null;
    const floorTileRegion = darkRoomAtlas && (darkRoomAtlas.floorTiles?.plank || darkRoomAtlas.floorTiles);
    const floorTileSprite = assets && floorTileRegion && assets.getRegion('dark-room-environment-sheet', floorTileRegion);

    if (floorTileSprite) {
      const tileW = 140;
      const tileH = Math.round(tileW * (floorTileRegion.height / floorTileRegion.width));
      const tileOffset = (camX * 0.8) % tileW;
      for (let tx = -tileW; tx < canvas.width + tileW; tx += tileW) {
        ctx.drawImage(floorTileSprite, tx - tileOffset, FLOOR_Y, tileW, tileH);
      }
    }

    // Moldura do rodapé de madeira escura
    ctx.fillStyle = '#2b2138';
    ctx.fillRect(0, FLOOR_Y - 8, canvas.width, 8);
    ctx.strokeStyle = '#3e3152';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, FLOOR_Y - 8);
    ctx.lineTo(canvas.width, FLOOR_Y - 8);
    ctx.stroke();

    // Junções das tábuas de madeira no chão (quando em fallback procedimental)
    if (!floorTileSprite) {
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
  }

  /**
   * Renderiza brinquedos, tapetes, livros e objetos espalhados pelo chão
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {Array} [scenery]
   * @param {number} [camX]
   * @param {object} [options]
   */
  renderScenery(ctx, canvas, scenery = defaultRoomScenery, camX = 0, options = {}) {
    if (!ctx || !canvas || !Array.isArray(scenery)) return;
    const roomScenery = scenery;
    const FLOOR_Y = this.floorY;
    const assets = options.assets || this.assets || null;

    roomScenery.forEach((item) => {
      const sx = item.x - camX;
      if (sx < -160 || sx > canvas.width + 160) return;

      ctx.save();

      // 1. Tenta desenhar com o sprite do atlas de arte do dark-room
      if (this.drawAtlasSceneryItem(ctx, assets, item.type, sx, item, FLOOR_Y)) {
        ctx.restore();
        return;
      }

      // 2. Fallback procedimental
      switch (item.type) {
        case 'fluffy_rug': {
          // Grande tapete mandala pastel redondo no chão
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
          // Passadeira oval listrada
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
          // Suéter infantil de tricô macio e quentinho jogado
          ctx.fillStyle = '#ec4899';
          ctx.strokeStyle = '#9d174d';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 9, 16, 9, 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Mangas amassadas
          ctx.beginPath();
          ctx.ellipse(sx - 14, FLOOR_Y - 5, 8, 4.5, -0.4, 0, Math.PI * 2);
          ctx.ellipse(sx + 14, FLOOR_Y - 6, 8, 4.5, 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Botõezinhos
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 1, FLOOR_Y - 12, 2, 2);
          ctx.fillRect(sx - 1, FLOOR_Y - 7, 2, 2);
          break;
        }

        case 'striped_socks': {
          // Par de meias infantis coloridas jogadas no chão
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.roundRect(sx - 8, FLOOR_Y - 6, 14, 6, 3);
          ctx.roundRect(sx + 6, FLOOR_Y - 8, 12, 6, 3);
          ctx.fill();
          // Listras
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx - 4, FLOOR_Y - 6, 3, 6);
          ctx.fillRect(sx + 10, FLOOR_Y - 8, 3, 6);
          break;
        }

        case 'spilled_crayons': {
          // Caixa de giz de cera tombada com gizes rolando e rabiscos
          // Rabisco de giz de cera no chão
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sx - 20, FLOOR_Y - 2);
          ctx.lineTo(sx - 8, FLOOR_Y - 4);
          ctx.lineTo(sx + 12, FLOOR_Y - 1);
          ctx.stroke();

          // Caixa amarela
          ctx.fillStyle = '#eab308';
          ctx.strokeStyle = '#854d0e';
          ctx.lineWidth = 1;
          ctx.fillRect(sx - 18, FLOOR_Y - 14, 18, 12);
          ctx.strokeRect(sx - 18, FLOOR_Y - 14, 18, 12);
          ctx.fillStyle = '#1e3a8a';
          ctx.fillRect(sx - 18, FLOOR_Y - 10, 18, 3);

          // Gizes de cera individuais rolando pelo chão
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
          // Aviãozinho de papel branco pousado de bico
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
          // Carro de corrida retrô de madeira vermelho
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.roundRect(sx - 14, FLOOR_Y - 12, 28, 9, [4, 4, 2, 2]);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 8, 4, 0, Math.PI * 2);
          ctx.fill();
          // Rodas de madeira pretas
          ctx.fillStyle = '#18181b';
          ctx.beginPath();
          ctx.arc(sx - 8, FLOOR_Y - 3, 4, 0, Math.PI * 2);
          ctx.arc(sx + 8, FLOOR_Y - 3, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'scattered_blocks': {
          // Blocos de madeira com letras espalhados
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
          // Caixa de papelão aberta no chão com bichinhos de pelúcia espiando
          ctx.fillStyle = '#926038';
          ctx.strokeStyle = '#5f3c1f';
          ctx.lineWidth = 1.4;
          ctx.fillRect(sx - 20, FLOOR_Y - 26, 40, 26);
          ctx.strokeRect(sx - 20, FLOOR_Y - 26, 40, 26);
          // Abas abertas
          ctx.beginPath();
          ctx.moveTo(sx - 20, FLOOR_Y - 26);
          ctx.lineTo(sx - 28, FLOOR_Y - 34);
          ctx.lineTo(sx - 10, FLOOR_Y - 26);
          ctx.moveTo(sx + 20, FLOOR_Y - 26);
          ctx.lineTo(sx + 28, FLOOR_Y - 34);
          ctx.lineTo(sx + 10, FLOOR_Y - 26);
          ctx.stroke();
          // Cabecinha fofa de ursinho de pelúcia dentro
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 28, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.arc(sx - 6, FLOOR_Y - 34, 3.5, 0, Math.PI * 2);
          ctx.arc(sx + 6, FLOOR_Y - 34, 3.5, 0, Math.PI * 2);
          ctx.fill();
          // Fita com etiqueta
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 12, FLOOR_Y - 16, 24, 7);
          ctx.fillStyle = '#1e1b4b';
          ctx.font = '6px sans-serif';
          ctx.fillText('BRINQUEDOS', sx - 11, FLOOR_Y - 11);
          break;
        }

        case 'dinosaur_felt': {
          // Dinossaurinho de brinquedo de feltro verde
          ctx.fillStyle = '#16a34a';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 10, 14, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          // Pescoço e cabeça
          ctx.beginPath();
          ctx.moveTo(sx + 8, FLOOR_Y - 12);
          ctx.lineTo(sx + 14, FLOOR_Y - 24);
          ctx.arc(sx + 16, FLOOR_Y - 24, 4, 0, Math.PI * 2);
          ctx.lineTo(sx + 10, FLOOR_Y - 8);
          ctx.fill();
          // Espinhos amarelos no dorso
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
          // Mola maluca espiral arco-íris esticada no chão
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
          // Pião de madeira colorido com cordão enrolado
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
          // Coelhinho de pelúcia fofo com orelhas caídas
          ctx.fillStyle = '#f1f5f9';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 10, 11, 9, 0, 0, Math.PI * 2);
          ctx.arc(sx + 8, FLOOR_Y - 18, 7, 0, Math.PI * 2);
          ctx.fill();
          // Orelha longa caída
          ctx.fillStyle = '#fed7aa';
          ctx.beginPath();
          ctx.ellipse(sx + 4, FLOOR_Y - 27, 3, 8, -0.3, 0, Math.PI * 2);
          ctx.fill();
          // Olho e narizinho cor-de-rosa
          ctx.fillStyle = '#db2777';
          ctx.beginPath();
          ctx.arc(sx + 14, FLOOR_Y - 18, 1.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'puzzle_pieces': {
          // Peças de quebra-cabeça espalhadas
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
          // Locomotiva de madeira clássica de brinquedo
          ctx.fillStyle = '#1d4ed8';
          ctx.fillRect(sx - 14, FLOOR_Y - 16, 22, 12);
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(sx + 8, FLOOR_Y - 22, 10, 18);
          // Chaminé
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx - 10, FLOOR_Y - 22, 5, 7);
          // Rodas
          ctx.fillStyle = '#18181b';
          ctx.beginPath();
          ctx.arc(sx - 6, FLOOR_Y - 4, 4, 0, Math.PI * 2);
          ctx.arc(sx + 4, FLOOR_Y - 4, 4, 0, Math.PI * 2);
          ctx.arc(sx + 13, FLOOR_Y - 4, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'open_story_book': {
          // Livro de histórias aberto no chão com fita marcadora
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
          // Fita marcadora vermelha
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx, FLOOR_Y - 4);
          ctx.quadraticCurveTo(sx + 4, FLOOR_Y + 4, sx + 10, FLOOR_Y + 6);
          ctx.stroke();
          break;
        }

        case 'spilled_marbles': {
          // Bolinhas de gude de vidro translúcido refletindo a luz
          const mColors = ['#06b6d4', '#f43f5e', '#a855f7', '#22c55e', '#eab308'];
          mColors.forEach((mc, i) => {
            const mx = sx - 15 + i * 8;
            const my = FLOOR_Y - 4;
            ctx.fillStyle = mc;
            ctx.beginPath();
            ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
            ctx.fill();
            // Brilho especular
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(mx - 1, my - 1, 1, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }

        case 'toy_soldier': {
          // Soldadinho de chumbo com casaca vermelha e barretina alta
          ctx.fillStyle = '#1e1b4b'; // barretina alta
          ctx.fillRect(sx - 3, FLOOR_Y - 32, 6, 12);
          ctx.fillStyle = '#fed7aa'; // rosto
          ctx.fillRect(sx - 3, FLOOR_Y - 20, 6, 5);
          ctx.fillStyle = '#dc2626'; // casaca
          ctx.fillRect(sx - 4, FLOOR_Y - 15, 8, 8);
          ctx.fillStyle = '#facc15'; // cinto
          ctx.fillRect(sx - 4, FLOOR_Y - 11, 8, 2);
          ctx.fillStyle = '#1e293b'; // botas
          ctx.fillRect(sx - 3, FLOOR_Y - 7, 6, 7);
          break;
        }

        case 'retro_robot': {
          // Robô de lata retrô verde com chave de corda e antena
          ctx.fillStyle = '#0d9488';
          ctx.fillRect(sx - 7, FLOOR_Y - 24, 14, 12); // cabeça
          ctx.fillRect(sx - 9, FLOOR_Y - 12, 18, 10); // corpo
          // Mostrador amarelo
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 4, FLOOR_Y - 10, 8, 6);
          // Antena com ponta vermelha
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
          // Palhaço da caixa de surpresa
          ctx.fillStyle = '#8b5cf6';
          ctx.fillRect(sx - 12, FLOOR_Y - 20, 24, 20);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(sx - 12, FLOOR_Y - 20, 24, 20);
          // Mola
          ctx.strokeStyle = '#94a3b8';
          ctx.beginPath();
          for (let s = 0; s < 4; s++) {
            ctx.lineTo(sx + (s % 2 === 0 ? -6 : 6), FLOOR_Y - 20 - s * 5);
          }
          ctx.stroke();
          // Cabeça do palhaço
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
          // Chocalho de bebê pastel
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
          // Ratinho cinza de corda com chave de latão
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 6, 9, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          // Orelha redonda
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.arc(sx - 4, FLOOR_Y - 10, 3, 0, Math.PI * 2);
          ctx.fill();
          // Chave de corda
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
          // Berço de balanço de madeira antigo
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx - 24, FLOOR_Y - 35, 48, 26);
          // Base curvada do balanço
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 5, 28, 0.2, Math.PI - 0.2);
          ctx.stroke();
          // Travesseiro e cobertor
          ctx.fillStyle = '#fce7f3';
          ctx.fillRect(sx - 20, FLOOR_Y - 32, 40, 10);
          break;
        }

        case 'giant_spool': {
          // Carretel gigante de linha
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 14, FLOOR_Y - 24, 28, 4);
          ctx.fillRect(sx - 14, FLOOR_Y - 4, 28, 4);
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(sx - 10, FLOOR_Y - 20, 20, 16);
          break;
        }

        case 'wooden_horse': {
          // Cavalinho de pau / balanço no chão
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 18, 16, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          // Cabeça do cavalo
          ctx.beginPath();
          ctx.moveTo(sx + 10, FLOOR_Y - 20);
          ctx.lineTo(sx + 18, FLOOR_Y - 36);
          ctx.lineTo(sx + 24, FLOOR_Y - 32);
          ctx.lineTo(sx + 16, FLOOR_Y - 16);
          ctx.closePath();
          ctx.fill();
          // Lâminas curvadas do balanço
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
   * Método de renderização conveniente que desenha a parede de fundo e os objetos do quarto
   */
  render(ctx, canvas, camX = 0, options = {}) {
    this.renderWall(ctx, canvas, camX, options);
    this.renderScenery(ctx, canvas, options.roomScenery || defaultRoomScenery, camX);
  }
}

export const backgroundRenderer = new BackgroundRenderer();
