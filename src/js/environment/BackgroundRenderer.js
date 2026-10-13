import { drawCurrentScenery } from '../assets/currentScenery.js';
import { NIGHT_WINDOWS } from './nightWindows.js';
/**
 * BackgroundRenderer.js
 * Renderiza a parede de fundo atmosférica do berçário vitoriano, lambris de madeira,
 * padrões de papel de parede, janelas e itens decorativos detalhados do quarto.
 */

import { FLOOR_Y, roomScenery as defaultRoomScenery } from '../config.js';
import { darkRoomAtlas } from '../assets/index.js';

/** Limites visíveis no espaço de desenho, incluindo zoom e translação já aplicados ao contexto. */
export function getBackgroundViewport(ctx, canvas) {
  const m = ctx.getTransform?.();
  const determinant = m ? m.a * m.d - m.b * m.c : 0;
  if (!Number.isFinite(determinant) || Math.abs(determinant) < 1e-12) {
    return { left: 0, right: canvas.width, top: 0, bottom: canvas.height };
  }
  const corners = [[0, 0], [canvas.width, 0], [0, canvas.height], [canvas.width, canvas.height]]
    .map(([x, y]) => ({ x: (m.d * (x - m.e) - m.c * (y - m.f)) / determinant,
      y: (-m.b * (x - m.e) + m.a * (y - m.f)) / determinant }));
  // Uma unidade de margem evita uma costura de antialiasing na extremidade do canvas.
  return { left: Math.floor(Math.min(...corners.map(p => p.x))) - 1,
    right: Math.ceil(Math.max(...corners.map(p => p.x))) + 1,
    top: Math.floor(Math.min(...corners.map(p => p.y))) - 1,
    bottom: Math.ceil(Math.max(...corners.map(p => p.y))) + 1 };
}

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
   * Retorna true se o item foi desenhado com sucesso, ou false caso contrário (ativando a alternativa).
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
    const viewport = getBackgroundViewport(ctx, canvas);
    const left = Math.min(0, viewport.left), right = Math.max(canvas.width, viewport.right);
    const top = Math.min(-600, viewport.top), bottom = Math.max(canvas.height + 600, viewport.bottom);
    const span = right - left;

    // Fundo atmosférico profundo do berçário, mantendo a assinatura lúdica da playroom em tom escuro
    ctx.fillStyle = '#0d0a14';
    ctx.fillRect(left, top, span, bottom - top);

    // Listras do papel de parede e padrão de losangos com paralaxe
    const bgOffset = (camX * 0.15) % 80;
    ctx.fillStyle = '#17131d';
    for (let x = Math.floor(left / 80) * 80 - 80; x < right + 80; x += 80) {
      const stripeTop = Math.min(-400, viewport.top);
      ctx.fillRect(x - bgOffset, stripeTop, 40, FLOOR_Y - stripeTop);
    }

    // Reflexo ambiente frio quase imperceptível; a luz principal permanece localizada.
    const topGlow = ctx.createLinearGradient(0, 0, 0, FLOOR_Y);
    topGlow.addColorStop(0, 'rgba(150, 175, 220, 0.015)');
    topGlow.addColorStop(0.38, 'rgba(135, 145, 200, 0.012)');
    topGlow.addColorStop(1, 'rgba(13, 10, 20, 0)');
    ctx.fillStyle = topGlow;
    ctx.fillRect(left, 0, span, FLOOR_Y + 50);

    // Estrelas douradas suaves no papel de parede, com brilho mais íntimo e velado
    ctx.fillStyle = 'rgba(250, 204, 21, 0.065)';
    for (let x = Math.floor(left / 80) * 80 - 80; x < right + 80; x += 80) {
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
    for (let gx = Math.floor(left / 180) * 180 - 360; gx < right + 360; gx += 180) {
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
      if (sx < left - 140 || sx > right + 140) return;

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
      if (sx < left - 60 || sx > right + 60) return;

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
      if (sx < left - 70 || sx > right + 70) return;

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
      if (sx < left - 120 || sx > right + 120) return;

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
    ctx.fillRect(left, FLOOR_Y, span, Math.max(canvas.height + 700, viewport.bottom) - FLOOR_Y);

    const assets = options.assets || this.assets || null;
    const floorTileRegion = darkRoomAtlas && (darkRoomAtlas.floorTiles?.plank || darkRoomAtlas.floorTiles);
    const floorTileSprite = assets && floorTileRegion && assets.getRegion('dark-room-environment-sheet', floorTileRegion);

    if (floorTileSprite) {
      const tileW = 140;
      const tileH = Math.round(tileW * (floorTileRegion.height / floorTileRegion.width));
      const tileOffset = (camX * 0.8) % tileW;
      for (let tx = Math.floor(left / tileW) * tileW - tileW; tx < right + tileW; tx += tileW) {
        ctx.drawImage(floorTileSprite, tx - tileOffset, FLOOR_Y, tileW, tileH);
      }
    }

    // Moldura do rodapé de madeira escura
    ctx.fillStyle = '#2b2138';
    ctx.fillRect(left, FLOOR_Y - 8, span, 8);
    ctx.strokeStyle = '#3e3152';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(left, FLOOR_Y - 8);
    ctx.lineTo(right, FLOOR_Y - 8);
    ctx.stroke();

    // Junções das tábuas de madeira no chão (quando utiliza a alternativa procedural)
    if (!floorTileSprite) {
      ctx.strokeStyle = '#15111e';
      ctx.lineWidth = 2;
      for (let x = -80 + Math.floor(left / 70) * 70; x < right + 80; x += 70) {
        const sx = x - (camX % 70);
        ctx.beginPath();
        ctx.moveTo(sx, FLOOR_Y);
        ctx.lineTo(sx - 28, Math.max(canvas.height + 700, viewport.bottom));
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
      if (drawCurrentScenery(ctx, assets, item.type, sx, FLOOR_Y) ||
          this.drawAtlasSceneryItem(ctx, assets, item.type, sx, item, FLOOR_Y)) {
        ctx.restore();
        return;
      }

      // 2. Alternativa procedural
      switch (item.type) {
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
