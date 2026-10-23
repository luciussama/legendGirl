/**
 * PlatformRenderer.js
 * Renderiza as 20+ plataformas interativas de estilo único, a porta de saída (pôster falso/desenho),
 * o celestial Verdadeiro Portal de Saída (portal dos sonhos da Fase 3) e a seta guia tutorial da Fase 3.
 */

import {
  FLOOR_Y,
  platforms as defaultPlatforms,
  phase3Platforms as defaultPhase3Platforms,
  exitDoor as defaultExitDoor,
  trueExitDoor as defaultTrueExitDoor,
  DEBUG_COLLISIONS
} from '../config.js';
import { darkRoomAtlas } from '../assets/index.js';
import { drawStorybookPlatform, drawContactEdge } from './StorybookPlatforms.js';

const REMOVED_PLATFORM_FALLBACKS = new Set(["block_castle", "chandelier_crystals", "cuckoo_clock", "curtain_rod", "dollhouse_roof", "floating_books", "giant_bear", "grand_portal_pedestal", "kite_frame", "messy_blocks", "mushroom_lamp", "music_box", "open_books", "satin_cushion", "small_dresser", "spinning_globe", "stepped_dresser", "toy_drum", "train_trestle", "vanity_table", "wall_shelf", "wardrobe_ledge"]);

export const PLATFORM_SURFACES = {
  giant_bear: { surfaceY: 139, surfaceX: 460, surfaceW: 1000, origW: 1922, origH: 818, bottom: 755, floorFit: true },
  open_books: { surfaceY: 2, surfaceX: 2, surfaceW: 272, origW: 276, origH: 300, floorFit: true },
  vanity_table: { surfaceY: 250, surfaceX: 2, surfaceW: 294, origW: 298, origH: 475, floorFit: true },
  small_dresser: { surfaceY: 0, surfaceX: 2, surfaceW: 414, origW: 418, origH: 411, floorFit: true },
  cardboard_box: { surfaceY: 0, surfaceX: 2, surfaceW: 414, origW: 418, origH: 411 },
  messy_blocks: { surfaceY: 4, surfaceX: 60, surfaceW: 98, origW: 235, origH: 253, floorFit: true },
  toy_drum: { surfaceY: 100, surfaceX: 35, surfaceW: 210, origW: 292, origH: 296, support: 'stand' },
  satin_cushion: { surfaceY: 145, surfaceX: 550, surfaceW: 880, origW: 1983, origH: 793, bottom: 660, support: 'stand' },
  stepped_dresser: { surfaceY: 46, surfaceX: 25, surfaceW: 250, origW: 304, origH: 484, floorFit: true },
  music_box: { surfaceY: 192, surfaceX: 23, surfaceW: 154, origW: 259, origH: 322, support: 'stand' },
  block_castle: { surfaceY: 227, surfaceX: 125, surfaceW: 80, origW: 436, origH: 572 },
  train_trestle: { surfaceY: 205, surfaceX: 2, surfaceW: 444, origW: 464, origH: 350, clipBottom: 205, support: 'table' },
  wall_shelf: { surfaceY: 205, surfaceX: 14, surfaceW: 374, origW: 392, origH: 286, clipBottom: 205, support: 'shelf', excludeRects: [[0, 0, 104, 34], [0, 34, 15, 14]] },
  // O abajur completo fica atrás da mesa que serve de apoio, alinhado pela base.
  mushroom_lamp: { surfaceY: 342, surfaceX: -86, surfaceW: 460, origW: 288, origH: 342, support: 'shelf', cap: true },
  dollhouse_roof: { surfaceY: 104, surfaceX: 112, surfaceW: 380, origW: 582, origH: 337, support: 'house', cap: true },
  spinning_globe: { surfaceY: 863, surfaceX: 50, surfaceW: 1145, origW: 1245, origH: 1263 },
  kite_frame: { surfaceY: -275, surfaceX: 0, surfaceW: 490, origW: 490, origH: 322, support: 'shelf' },
  // Os pés ficam dentro das páginas ilustradas; a curvatura delas é intencionalmente decorativa.
  floating_books: { surfaceY: 2, surfaceX: 2, surfaceW: 406, origW: 410, origH: 279 },
  chandelier_crystals: { surfaceY: 205, surfaceX: 3, surfaceW: 287, origW: 292, origH: 335 },
  curtain_rod: { surfaceY: 2, surfaceX: 2, surfaceW: 487, origW: 491, origH: 351 },
  cuckoo_clock: { surfaceY: -60, surfaceX: 0, surfaceW: 194, origW: 196, origH: 334 },
  wardrobe_ledge: { surfaceY: 72, surfaceX: 3, surfaceW: 557, origW: 560, origH: 200 },
  grand_portal_pedestal: { surfaceY: 330, surfaceX: 3, surfaceW: 515, origW: 518, origH: 365, excludeRects: [[404, 0, 114, 34]] }
};

export class PlatformRenderer {
  constructor(options = {}) {
    this.floorY = options.floorY ?? FLOOR_Y;
    this.assets = options.assets || null;
  }

  setAssets(assets) {
    this.assets = assets;
  }

  /**
   * Renderiza a plataforma utilizando o spritesheet dark-room/environment-assets.png se disponível.
   * Retorna true se o asset foi desenhado com sucesso, ou false caso contrário (ativando a alternativa).
   */
  drawAtlasPlatformSprite(ctx, assets, style, sx, p, tick = 0) {
    if (!assets) return false;
    const styleClean = style === 'true_portal_balcony' ? 'grand_portal_pedestal' : (style || '').toLowerCase();
    const individualKey = 'dark-room-sprite-' + styleClean.replace(/_/g, '-');
    let sprite = assets.get(individualKey);
    let region = darkRoomAtlas && (darkRoomAtlas[styleClean] || darkRoomAtlas[style]);

    if (!sprite && region) {
      sprite = assets.getRegion('dark-room-production-spritesheet', region) ||
               assets.getRegion('dark-room-environment-sheet', region);
    }
    if (!sprite) return false;

    // A FÍSICA É A FONTE DA VERDADE ABSOLUTA:
    // O sprite se adapta com precisão milimétrica à hitbox física (p.x, p.y, p.w, p.h).
    // A superfície de apoio visual (superfície de apoio) do sprite DEVE coincidir exatamente com:
    // - Início horizontal = sx (p.x - camX)
    // - Fim horizontal    = sx + p.w
    // - Altura de apoio   = p.y
    // Nenhuma posição, altura, distância ou área de pouso é alterada.


    const spriteW = sprite.naturalWidth || sprite.width || (region ? region.width : p.w);
    const spriteH = sprite.naturalHeight || sprite.height || (region ? region.height : p.h);

    const s = PLATFORM_SURFACES[styleClean] || {
      surfaceY: 0,
      surfaceX: 0,
      surfaceW: spriteW,
      origW: spriteW,
      origH: spriteH
    };

    const platX = p.standRegion ? p.standRegion.x : p.x;
    const platW = p.standRegion ? p.standRegion.w : p.w;
    const platY = (p.surfaceTopY !== undefined)
      ? p.surfaceTopY
      : ((p.standRegion && p.standRegion.y !== undefined) ? p.standRegion.y : p.y);
    const camXFromSx = p.x - sx;
    const sxSurface = platX - camXFromSx;

    // Escala estritamente calibrada pela largura da superfície de apoio em relação a platW
    const scale = platW / (s.surfaceW || spriteW);
    const dw = styleClean === 'spinning_globe' ? spriteW * scale : Math.round(spriteW * scale);
    const scaleY = s.floorFit ? Math.min(scale, (this.floorY - platY) / ((s.bottom ?? spriteH) - s.surfaceY)) : scale;
    const dh = styleClean === 'spinning_globe' ? spriteH * scaleY : Math.round(spriteH * scaleY);

    // O início horizontal da superfície de apoio coincide com sx (ou sxSurface com standRegion)
    const dx = Math.round(sxSurface - (s.surfaceX * scale));

    // A superfície de apoio do sprite coincide exatamente com a altura platY
    const dy = Math.round(platY - (s.surfaceY * scaleY));

    // A mobília sob o objeto faz parte do cenário e nunca constitui uma superfície extra de pouso.
    if (s.support === 'stand') {
      if (styleClean === 'music_box') {
        const top = dy + Math.round(282 * scaleY);
        const legHeight = Math.max(0, this.floorY - top);
        const legW = Math.max(7, Math.round(11 * scale));
        const leg1X = dx + Math.round(39 * scale);
        const leg2X = dx + Math.round(151 * scale);

        for (const legX of [leg1X, leg2X]) {
          // Bloco superior de fixação sob a gaveta
          ctx.fillStyle = '#3a1f14';
          ctx.fillRect(legX, top, legW, 10);
          ctx.fillStyle = '#613821';
          ctx.fillRect(legX + 1, top, 2, 10);

          // Haste torneada de madeira nobre
          const shaftW = legW - 2;
          const shaftX = legX + 1;
          ctx.fillStyle = '#2b150c';
          ctx.fillRect(shaftX, top + 10, shaftW, legHeight - 20);
          ctx.fillStyle = '#542d18';
          ctx.fillRect(shaftX + 1, top + 10, 2, legHeight - 20);
          ctx.fillStyle = '#7a4225';
          ctx.fillRect(shaftX + shaftW - 2, top + 10, 1, legHeight - 20);

          // Anéis ornamentais torneados
          for (const ringY of [top + 24, top + 60, top + 98]) {
            if (ringY < this.floorY - 20) {
              ctx.fillStyle = '#7a4225';
              ctx.fillRect(shaftX - 1, ringY, shaftW + 2, 4);
              ctx.fillStyle = '#a66138';
              ctx.fillRect(shaftX - 1, ringY, shaftW + 2, 1);
              ctx.fillStyle = '#1e0c06';
              ctx.fillRect(shaftX - 1, ringY + 3, shaftW + 2, 1);
            }
          }

          // Pata torneada apoiada no chão
          ctx.fillStyle = '#422213';
          ctx.fillRect(legX - 1, this.floorY - 10, legW + 2, 10);
          ctx.fillStyle = '#7a4225';
          ctx.fillRect(legX - 1, this.floorY - 10, legW + 2, 2);
          ctx.fillStyle = '#1a0b06';
          ctx.fillRect(legX - 1, this.floorY - 2, legW + 2, 2);
        }

        // Travessa / prateleira inferior de madeira conectando as pernas
        const shelfY = this.floorY - 30;
        ctx.fillStyle = '#3a1f14';
        ctx.fillRect(leg1X + legW, shelfY, leg2X - (leg1X + legW), 5);
        ctx.fillStyle = '#6e3c23';
        ctx.fillRect(leg1X + legW, shelfY, leg2X - (leg1X + legW), 1);
        ctx.fillStyle = '#1e0c06';
        ctx.fillRect(leg1X + legW, shelfY + 4, leg2X - (leg1X + legW), 1);

        // Sombra sutil de contato no piso
        ctx.fillStyle = 'rgba(15, 9, 22, 0.4)';
        ctx.fillRect(leg1X - 3, this.floorY, legW + 6, 3);
        ctx.fillRect(leg2X - 3, this.floorY, legW + 6, 3);
      } else {
        const left = dx + 4, width = dw - 8, top = dy + Math.round((s.bottom ?? spriteH) * scaleY) - 2;
        const legHeight = Math.max(0, this.floorY - top - 8);
        ctx.fillStyle = '#291b20';
        ctx.fillRect(left + 8, top + 7, 7, legHeight);
        ctx.fillRect(left + width - 15, top + 7, 7, legHeight);
        ctx.fillStyle = '#61402d';
        ctx.fillRect(left + 9, top + 7, 2, legHeight);
        ctx.fillRect(left + width - 14, top + 7, 2, legHeight);
        ctx.fillStyle = '#493022';
        ctx.fillRect(left, top, width, 9);
        ctx.fillStyle = '#957044';
        ctx.fillRect(left, top, width, 2);
        ctx.fillStyle = '#21151b';
        ctx.fillRect(left + 4, top + 8, width - 8, 2);
      }
    }

    if (s.support === 'table') {
      // Mesa alta de cabeceira vitoriana em mogno nobre com pernas torneadas até o piso (floorY)
      // O abajur cogumelo repousa sobre o tampo sólido no plano de apoio (platY = 224).
      const tabX = sxSurface;
      const tabY = platY;
      const tabW = platW;
      const tabFloor = this.floorY;
      const legHeight = Math.max(0, tabFloor - (tabY + 36));

      // 1. Pernas Torneadas Vitorianas (pernas torneadas até FLOOR_Y)
      const legW = 12;
      const leg1X = tabX + 9;
      const leg2X = tabX + tabW - 21;

      // Sombra sutil projetada na parede de fundo entre as pernas
      ctx.fillStyle = 'rgba(18, 10, 14, 0.35)';
      ctx.fillRect(tabX + 16, tabY + 36, tabW - 32, tabFloor - (tabY + 36));

      for (const lx of [leg1X, leg2X]) {
        // Bloco superior de montagem sob a saia
        ctx.fillStyle = '#3a1f14';
        ctx.fillRect(lx, tabY + 36, legW, 12);
        ctx.fillStyle = '#5c321d';
        ctx.fillRect(lx + 1, tabY + 36, 2, 12);
        ctx.fillStyle = '#1e0c06';
        ctx.fillRect(lx + legW - 1, tabY + 36, 1, 12);

        // Haste principal torneada em mogno polido
        const shaftX = lx + 1;
        const shaftW = legW - 2;
        ctx.fillStyle = '#2d160c';
        ctx.fillRect(shaftX, tabY + 48, shaftW, legHeight - 20);
        ctx.fillStyle = '#542d18';
        ctx.fillRect(shaftX + 1, tabY + 48, 2, legHeight - 20);
        ctx.fillStyle = '#7a4225';
        ctx.fillRect(shaftX + 3, tabY + 48, 2, legHeight - 20);
        ctx.fillStyle = '#1a0b06';
        ctx.fillRect(shaftX + shaftW - 2, tabY + 48, 2, legHeight - 20);

        // Anéis e discos ornamentais torneados (colares vitorianos)
        for (const ringY of [tabY + 62, tabY + 104, tabY + 148, tabY + 192]) {
          if (ringY < tabFloor - 25) {
            ctx.fillStyle = '#7a4225';
            ctx.fillRect(shaftX - 2, ringY, shaftW + 4, 5);
            ctx.fillStyle = '#b8683b';
            ctx.fillRect(shaftX - 2, ringY, shaftW + 4, 1);
            ctx.fillStyle = '#df9b68';
            ctx.fillRect(shaftX, ringY + 1, 2, 3);
            ctx.fillStyle = '#1e0c06';
            ctx.fillRect(shaftX - 2, ringY + 4, shaftW + 4, 1);
          }
        }

        // Pata torneada / sapata almofadada no piso
        ctx.fillStyle = '#3a1f14';
        ctx.fillRect(lx - 1, tabFloor - 12, legW + 2, 12);
        ctx.fillStyle = '#7a4225';
        ctx.fillRect(lx - 1, tabFloor - 12, legW + 2, 2);
        ctx.fillStyle = '#a85f38';
        ctx.fillRect(lx + 1, tabFloor - 10, 3, 8);
        ctx.fillStyle = '#180a05';
        ctx.fillRect(lx - 1, tabFloor - 2, legW + 2, 2);

        // Sombra suave de contato no assoalho
        ctx.fillStyle = 'rgba(15, 8, 20, 0.45)';
        ctx.fillRect(lx - 3, tabFloor, legW + 6, 3);
      }

      // 2. Travessa inferior de sustentação travessa de sustentação conectando as pernas
      const stretcherY = tabFloor - 32;
      ctx.fillStyle = '#3a1f14';
      ctx.fillRect(leg1X + legW, stretcherY, leg2X - (leg1X + legW), 6);
      ctx.fillStyle = '#6e3c23';
      ctx.fillRect(leg1X + legW, stretcherY, leg2X - (leg1X + legW), 1);
      ctx.fillStyle = '#94532e';
      ctx.fillRect(Math.round((leg1X + leg2X + legW) / 2) - 8, stretcherY - 1, 16, 8);
      ctx.fillStyle = '#1e0c06';
      ctx.fillRect(leg1X + legW, stretcherY + 5, leg2X - (leg1X + legW), 1);

      // 3. Saia Frontal e Gaveta em Mogno com Puxador de Latão
      const apronX = tabX + 4;
      const apronW = tabW - 8;
      const apronY = tabY + 10;
      const apronH = 26;

      ctx.fillStyle = '#2b140b';
      ctx.fillRect(apronX, apronY, apronW, apronH);

      const drawerX = tabX + 11;
      const drawerW = tabW - 22;
      const drawerY = apronY + 3;
      const drawerH = apronH - 6;

      ctx.fillStyle = '#542d18';
      ctx.fillRect(drawerX, drawerY, drawerW, drawerH);
      ctx.fillStyle = '#7a4225';
      ctx.fillRect(drawerX, drawerY, drawerW, 1);
      ctx.fillRect(drawerX, drawerY, 1, drawerH);
      ctx.fillStyle = '#1a0b06';
      ctx.fillRect(drawerX, drawerY + drawerH - 1, drawerW, 1);
      ctx.fillRect(drawerX + drawerW - 1, drawerY, 1, drawerH);

      ctx.fillStyle = '#3a1b0e';
      ctx.fillRect(drawerX + 2, drawerY + 2, drawerW - 4, drawerH - 4);
      ctx.fillStyle = '#4a2515';
      ctx.fillRect(drawerX + 3, drawerY + 3, drawerW - 6, 2);

      const handleCenterX = drawerX + Math.round(drawerW / 2);
      const handleCenterY = drawerY + Math.round(drawerH / 2);

      ctx.fillStyle = '#78350f';
      ctx.fillRect(handleCenterX - 9, handleCenterY - 3, 18, 6);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(handleCenterX - 8, handleCenterY - 2, 16, 4);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(handleCenterX - 6, handleCenterY - 1, 12, 2);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(handleCenterX - 2, handleCenterY - 1, 4, 1);

      ctx.fillStyle = '#d4a457';
      ctx.fillRect(handleCenterX - 5, handleCenterY + 2, 10, 4);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(handleCenterX - 4, handleCenterY + 2, 8, 2);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(handleCenterX - 3, handleCenterY + 3, 6, 1);
      ctx.fillStyle = '#160803';
      ctx.fillRect(handleCenterX - 5, handleCenterY + 6, 10, 1);

      // 4. Tampo da Mesa Sólido e Polido (tampo em y = platY)
      // 100% de cobertura sólida opaca ao longo de toda a largura platW (105 px)
      ctx.fillStyle = '#9e5a32';
      ctx.fillRect(tabX, tabY, tabW, 2);
      ctx.fillStyle = '#c57d4e';
      ctx.fillRect(tabX + 1, tabY, tabW - 2, 1);
      ctx.fillStyle = '#e8a87c';
      ctx.fillRect(tabX + 24, tabY, tabW - 48, 1);

      ctx.fillStyle = '#542d18';
      ctx.fillRect(tabX, tabY + 2, tabW, 4);
      ctx.fillStyle = '#7a4225';
      ctx.fillRect(tabX + 1, tabY + 2, tabW - 2, 1);
      ctx.fillStyle = '#3a1f14';
      ctx.fillRect(tabX, tabY + 6, tabW, 3);
      ctx.fillStyle = '#1c0c06';
      ctx.fillRect(tabX, tabY + 9, tabW, 2);

      ctx.fillStyle = 'rgba(254, 215, 170, 0.15)';
      ctx.fillRect(tabX + 15, tabY, tabW - 30, 8);
    }

    if (s.support === 'house') {
      // Mansão de Bonecas Georgiana / Vitoriana até o assoalho (FLOOR_Y)
      // Fachada cenográfica rica em detalhes de época: alvenaria de tijolos entalhados,
      // pilastras clássicas com cantoneiras de cantaria, cornija intermediária em dente de serra,
      // quatro janelas de guilhotina com iluminação mágica quente de lamparina interior e cortinas,
      // e pórtico de entrada clássico com porta de mogno almofadada, bandeira em arco bandeira semicircular e puxadores de latão.
      const left = dx + 13, width = dw - 26;
      const top = dy + Math.round(dh * 0.72);
      const floor = this.floorY;
      const houseH = floor - top;

      // 1. Paredes de Alvenaria / Tabuado Nobre
      ctx.fillStyle = '#642f23';
      ctx.fillRect(left, top, width, houseH);

      // Textura de fiadas de tijolos / tábuas sobrepostas com iluminação e chanfros horizontais
      for (let y = top + 4; y < floor - 8; y += 7) {
        ctx.fillStyle = '#7a3b2c';
        ctx.fillRect(left + 8, y, width - 16, 5);
        ctx.fillStyle = '#4a2017';
        ctx.fillRect(left + 8, y + 5, width - 16, 1);
        ctx.fillStyle = '#8e4737';
        ctx.fillRect(left + 8, y, width - 16, 1);

        const row = Math.floor((y - top) / 7);
        const shift = (row % 2) * 11;
        for (let bx = left + 14 + shift; bx < left + width - 14; bx += 22) {
          ctx.fillStyle = '#3c1810';
          ctx.fillRect(bx, y, 1, 5);
        }
      }

      // Sombra sob os beirais do telhado
      ctx.fillStyle = 'rgba(18, 7, 5, 0.6)';
      ctx.fillRect(left, top, width, 8);
      ctx.fillStyle = 'rgba(18, 7, 5, 0.3)';
      ctx.fillRect(left, top + 8, width, 6);

      // 2. Pilastras Clássicas / Cantoneiras de Cantaria nos Cantos
      const quoinW = 9;
      for (const qx of [left, left + width - quoinW]) {
        ctx.fillStyle = '#46271c';
        ctx.fillRect(qx, top, quoinW, houseH);
        for (let qy = top; qy < floor - 8; qy += 14) {
          const isProtruding = Math.floor((qy - top) / 14) % 2 === 0;
          const qw = isProtruding ? quoinW : quoinW - 2;
          const posX = (qx === left) ? qx : qx + (quoinW - qw);
          ctx.fillStyle = '#6e4030';
          ctx.fillRect(posX, qy, qw, 12);
          ctx.fillStyle = '#965a45';
          ctx.fillRect(posX, qy, qw, 1);
          ctx.fillStyle = '#2d160e';
          ctx.fillRect(posX, qy + 11, qw, 1);
        }
      }

      // 3. Cornija Intermediária Clássica (cornija denticulada entre o 1º e 2º Andar)
      const corniceY = top + Math.round(houseH * 0.44);
      ctx.fillStyle = '#26120b';
      ctx.fillRect(left + 2, corniceY - 1, width - 4, 10);
      ctx.fillStyle = '#5c3220';
      ctx.fillRect(left + 2, corniceY, width - 4, 8);
      ctx.fillStyle = '#8f5238';
      ctx.fillRect(left + 2, corniceY, width - 4, 2);
      ctx.fillStyle = '#b87050';
      ctx.fillRect(left + 4, corniceY, width - 8, 1);

      for (let dxTooth = left + 10; dxTooth < left + width - 12; dxTooth += 7) {
        ctx.fillStyle = '#9e5e43';
        ctx.fillRect(dxTooth, corniceY + 3, 4, 4);
        ctx.fillStyle = '#1e0c06';
        ctx.fillRect(dxTooth, corniceY + 7, 4, 1);
      }
      ctx.fillStyle = '#1a0b06';
      ctx.fillRect(left + 2, corniceY + 8, width - 4, 2);

      // 4. Quatro Janelas Georgianas Iluminadas
      const winTop1 = top + 14;
      const winH1 = corniceY - winTop1 - 10;
      const winW = 24;
      const winX1 = left + 16;
      const winX2 = left + width - winW - 16;

      const winTop2 = corniceY + 16;
      const winH2 = floor - winTop2 - 20;

      const windowCoords = [
        [winX1, winTop1, winW, winH1],
        [winX2, winTop1, winW, winH1],
        [winX1, winTop2, winW, winH2],
        [winX2, winTop2, winW, winH2]
      ];

      for (const [wx, wy, ww, wh] of windowCoords) {
        ctx.fillStyle = '#3a1f14';
        ctx.fillRect(wx - 3, wy - 4, ww + 6, 4);
        ctx.fillStyle = '#6b3a24';
        ctx.fillRect(wx - 2, wy - 4, ww + 4, 1);
        ctx.fillStyle = '#180a05';
        ctx.fillRect(wx - 3, wy, ww + 6, 1);

        ctx.fillStyle = '#160803';
        ctx.fillRect(wx - 2, wy, ww + 4, wh);

        ctx.fillStyle = '#422214';
        ctx.fillRect(wx - 1, wy + 1, ww + 2, wh - 2);

        ctx.fillStyle = '#b45309';
        ctx.fillRect(wx, wy + 2, ww, wh - 4);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(wx + 2, wy + 4, ww - 4, wh - 8);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(wx + 4, wy + 6, ww - 8, wh - 12);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(wx + 6, wy + 8, ww - 12, wh - 16);

        ctx.fillStyle = '#831843';
        ctx.fillRect(wx + 1, wy + 3, 3, wh - 6);
        ctx.fillRect(wx + ww - 4, wy + 3, 3, wh - 6);
        ctx.fillStyle = '#9f1239';
        ctx.fillRect(wx + 1, wy + 3, 2, 4);
        ctx.fillRect(wx + ww - 3, wy + 3, 2, 4);

        const midX = wx + Math.round(ww / 2);
        const rowH = Math.round((wh - 4) / 3);

        ctx.fillStyle = '#2c150b';
        ctx.fillRect(midX - 1, wy + 2, 2, wh - 4);
        ctx.fillRect(wx, wy + 2 + rowH, ww, 2);
        ctx.fillRect(wx, wy + 2 + rowH * 2, ww, 2);

        ctx.fillStyle = '#5c301a';
        ctx.fillRect(midX, wy + 2, 1, wh - 4);
        ctx.fillRect(wx, wy + 2 + rowH, ww, 1);
        ctx.fillRect(wx, wy + 2 + rowH * 2, ww, 1);

        ctx.fillStyle = '#5c3220';
        ctx.fillRect(wx - 4, wy + wh - 2, ww + 8, 4);
        ctx.fillStyle = '#8f5238';
        ctx.fillRect(wx - 4, wy + wh - 2, ww + 8, 1);
        ctx.fillStyle = '#160803';
        ctx.fillRect(wx - 4, wy + wh + 2, ww + 8, 2);
      }

      // 5. Entrada Principal Majestosa (entrada georgiana imponente)
      const doorW = 26;
      const doorX = left + Math.round((width - doorW) / 2);
      const doorTop = corniceY + 12;
      const doorH = floor - doorTop - 6;

      ctx.fillStyle = '#3a1f14';
      ctx.fillRect(doorX - 4, doorTop - 4, doorW + 8, doorH + 4);
      ctx.fillStyle = '#6b3a24';
      ctx.fillRect(doorX - 4, doorTop - 4, doorW + 8, 2);
      ctx.fillRect(doorX - 4, doorTop - 4, 2, doorH + 4);
      ctx.fillRect(doorX + doorW + 2, doorTop - 4, 2, doorH + 4);

      const fanlightH = 14;
      ctx.fillStyle = '#160803';
      ctx.fillRect(doorX, doorTop, doorW, fanlightH);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(doorX + 2, doorTop + 2, doorW - 4, fanlightH - 2);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(doorX + 5, doorTop + 4, doorW - 10, fanlightH - 5);

      ctx.fillStyle = '#2c150b';
      const fanMidX = doorX + Math.round(doorW / 2);
      ctx.fillRect(fanMidX - 1, doorTop + 1, 2, fanlightH - 1);
      ctx.fillRect(doorX + 5, doorTop + 4, 2, fanlightH - 4);
      ctx.fillRect(doorX + doorW - 7, doorTop + 4, 2, fanlightH - 4);

      ctx.fillStyle = '#422214';
      ctx.fillRect(doorX - 1, doorTop + fanlightH, doorW + 2, 3);
      ctx.fillStyle = '#7a4026';
      ctx.fillRect(doorX - 1, doorTop + fanlightH, doorW + 2, 1);

      const leafTop = doorTop + fanlightH + 3;
      const leafH = floor - leafTop - 6;
      ctx.fillStyle = '#241008';
      ctx.fillRect(doorX, leafTop, doorW, leafH);

      const pW = Math.round((doorW - 6) / 2);
      const pH = Math.round((leafH - 8) / 2);

      for (let col = 0; col < 2; col++) {
        for (let r = 0; r < 2; r++) {
          const px = doorX + 2 + col * (pW + 2);
          const py = leafTop + 2 + r * (pH + 3);
          ctx.fillStyle = '#140703';
          ctx.fillRect(px, py, pW, pH);
          ctx.fillStyle = '#3c1b0e';
          ctx.fillRect(px + 1, py + 1, pW - 2, pH - 2);
          ctx.fillStyle = '#542916';
          ctx.fillRect(px + 1, py + 1, pW - 2, 1);
          ctx.fillRect(px + 1, py + 1, 1, pH - 2);
        }
      }

      const knobX = doorX + doorW - 6;
      const knobY = leafTop + Math.round(leafH * 0.48);

      ctx.fillStyle = '#78350f';
      ctx.fillRect(knobX - 1, knobY - 1, 4, 4);
      ctx.fillStyle = '#d4a457';
      ctx.fillRect(knobX, knobY, 2, 2);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(knobX, knobY, 1, 1);

      const knockerX = doorX + Math.round(doorW / 2);
      const knockerY = leafTop + Math.round(leafH * 0.28);
      ctx.fillStyle = '#a67b3d';
      ctx.fillRect(knockerX - 2, knockerY - 2, 4, 5);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(knockerX - 1, knockerY - 1, 2, 2);

      // 6. Soleira / Degraus de Cantaria na Base
      ctx.fillStyle = '#2c1c15';
      ctx.fillRect(doorX - 6, floor - 6, doorW + 12, 3);
      ctx.fillStyle = '#4a3227';
      ctx.fillRect(doorX - 6, floor - 6, doorW + 12, 1);
      ctx.fillStyle = '#221510';
      ctx.fillRect(doorX - 8, floor - 3, doorW + 16, 3);
      ctx.fillStyle = '#3d281f';
      ctx.fillRect(doorX - 8, floor - 3, doorW + 16, 1);

      ctx.fillStyle = '#231610';
      ctx.fillRect(left - 2, floor - 4, width + 4, 4);
      ctx.fillStyle = '#422c21';
      ctx.fillRect(left - 2, floor - 4, width + 4, 1);
    }

    // Suporte sutil de sombra/madeira até o piso para plataformas altas
    if (dy + dh < this.floorY && ['train_trestle'].includes(styleClean) && !s.support) {
      ctx.fillStyle = 'rgba(20, 14, 28, 0.45)';
      ctx.fillRect(sx + 8, dy + dh - 4, p.w - 16, this.floorY - (dy + dh - 4));
    }

    if (styleClean === 'wardrobe_ledge') {
      // Armário fixado à parede abaixo da cornija existente. A cornija mantém
      // seu plano original de pouso; as portas e ferragens de fixação fazem parte do cenário.
      const left=sxSurface+3, top=platY+8, width=platW-6, height=128;
      const wood=ctx.createLinearGradient(left,top,left+width,top);
      wood.addColorStop(0,'#382419');wood.addColorStop(.18,'#98643b');
      wood.addColorStop(.5,'#634025');wood.addColorStop(.86,'#855431');
      wood.addColorStop(1,'#342218');ctx.fillStyle=wood;
      ctx.fillRect(left,top,width,height);
      ctx.fillStyle='#241b17';ctx.fillRect(left+5,top+7,width-10,height-16);
      const doorW=(width-15)/2;
      for(let door=0;door<2;door++) {
        const x=left+6+door*(doorW+3);
        const face=ctx.createLinearGradient(x,top,x+doorW,top);
        face.addColorStop(0,'#a57346');face.addColorStop(.3,'#704729');
        face.addColorStop(1,'#493021');ctx.fillStyle=face;
        ctx.fillRect(x,top+8,doorW,height-18);
        for(const [offset,panelH] of [[15,48],[70,35]]) {
          ctx.fillStyle='#b17c49';ctx.fillRect(x+3,top+offset,doorW-6,panelH);
          ctx.fillStyle='#38251c';ctx.fillRect(x+4,top+offset+1,doorW-8,panelH-2);
          ctx.fillStyle='#795030';ctx.fillRect(x+5,top+offset+3,doorW-10,panelH-6);
          for(let grain=0;grain<3;grain++) {
            ctx.beginPath();ctx.moveTo(x+7+grain*4,top+offset+6);
            ctx.lineTo(x+6+grain*4,top+offset+panelH-8);
            ctx.strokeStyle='#654029';ctx.lineWidth=.7;ctx.stroke();
          }
        }
        const handleX=door===0?x+doorW-4:x+2;
        ctx.fillStyle='#342b20';ctx.fillRect(handleX-1,top+58,4,8);
        ctx.fillStyle='#c19b57';ctx.fillRect(handleX,top+59,2,5);
        for(const y of [top+22,top+94]) {
          ctx.fillStyle='#a48550';ctx.fillRect(door===0?x:x+doorW-2,y,2,6);
        }
      }
      ctx.fillStyle='#a67546';ctx.fillRect(left,top+height-5,width,3);
      ctx.fillStyle='#3d291e';ctx.fillRect(left+2,top+height-2,width-4,5);
      for(const x of [left+7,left+width-11]) {
        ctx.fillStyle='#55402b';ctx.fillRect(x,top+height+3,4,9);
        ctx.fillStyle='#a8874c';ctx.fillRect(x+1,top+height+6,2,2);
      }
    }

    const falseDoorPedestal = style === 'grand_portal_pedestal';
    if (styleClean === 'cuckoo_clock') {
      // O trilho de fixação à parede e as mísulas ficam atrás do relógio suspenso.
      ctx.fillStyle='#493022';ctx.fillRect(sxSurface+5,platY+7,platW-10,14);
      ctx.fillStyle='#805334';ctx.fillRect(sxSurface+7,platY+9,platW-14,9);
      for (const x of [sxSurface+10,sxSurface+platW-12]) {
        ctx.beginPath();ctx.moveTo(x,platY+9);ctx.lineTo(x,platY+31);
        ctx.lineTo(x+6,platY+12);
        ctx.strokeStyle='#3d291e';ctx.lineWidth=5;ctx.stroke();
        ctx.strokeStyle='#8d603d';ctx.lineWidth=2;ctx.stroke();
        ctx.fillStyle='#b39a68';ctx.fillRect(x-1,platY+13,2,2);
      }
      const center=sxSurface+platW/2;
      ctx.beginPath();ctx.moveTo(center,platY+15);ctx.lineTo(center,dy+10);
      ctx.strokeStyle='#463b2a';ctx.lineWidth=3;ctx.stroke();
      ctx.strokeStyle='#ad8c4e';ctx.lineWidth=1;ctx.stroke();
    }
    const clipSprite = falseDoorPedestal || s.trimAboveSupport || s.clipBottom !== undefined || s.excludeRects;
    if (clipSprite) {
      const clipTop = (falseDoorPedestal || s.trimAboveSupport) ? platY : dy;
      const clipEnd = dy + (s.clipBottom ?? spriteH) * scaleY;
      ctx.save();ctx.beginPath();ctx.rect(dx, clipTop, dw, clipEnd - clipTop);
      // Exclui os objetos vizinhos incorporados ao recorte do atlas, sem
      // esticar a ilustração nem alterar a geometria de colisão.
      for (const [x, y, w, h] of (falseDoorPedestal ? [] : s.excludeRects) || []) {
        ctx.rect(dx + x * dw / spriteW, dy + y * dh / spriteH,
          w * dw / spriteW, h * dh / spriteH);
      }
      ctx.clip('evenodd');
    }
    ctx.drawImage(sprite, dx, dy, dw, dh);
    if (clipSprite) ctx.restore();

    // Para o abajur cogumelo, garantir o debrum frontal do tampo da mesa
    // na linha exata de pouso dos pés (platY), unindo a base do abajur ao tampo.
    if (styleClean === 'mushroom_lamp') {
      const tabX = sxSurface;
      const tabY = platY;
      const tabW = platW;
      ctx.fillStyle = '#9e5a32';
      ctx.fillRect(tabX, tabY, tabW, 2);
      ctx.fillStyle = '#c57d4e';
      ctx.fillRect(tabX + 1, tabY, tabW - 2, 1);
      ctx.fillStyle = '#542d18';
      ctx.fillRect(tabX, tabY + 2, tabW, 3);
      ctx.fillStyle = '#3a1f14';
      ctx.fillRect(tabX, tabY + 5, tabW, 2);
    }

    if (styleClean === 'dollhouse_roof') {
      const ridgeX = sxSurface;
      const ridgeY = platY;
      const ridgeW = platW;
      ctx.fillStyle = '#78350f';
      ctx.fillRect(ridgeX, ridgeY, ridgeW, 3);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(ridgeX, ridgeY, ridgeW, 2);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(ridgeX, ridgeY, ridgeW, 1);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(ridgeX + 10, ridgeY, ridgeW - 20, 1);
      ctx.fillStyle = '#1c0c06';
      ctx.fillRect(ridgeX, ridgeY + 3, ridgeW, 1);
    }
    if (s.support === 'shelf' && styleClean !== 'kite_frame') {
      drawContactEdge(ctx,sxSurface,platY,platW,'wood',12);
      for (const xx of [sxSurface+9,sxSurface+platW-17]) {
        ctx.fillStyle='#493021';ctx.fillRect(xx,platY+12,8,26);
        ctx.fillStyle='#b6854e';ctx.fillRect(xx+1,platY+12,2,23);
        ctx.beginPath();ctx.moveTo(xx+6,platY+33);ctx.lineTo(xx+16,platY+12);
        ctx.lineWidth=4;ctx.strokeStyle='#493021';ctx.stroke();
        ctx.lineWidth=1.5;ctx.strokeStyle='#b6854e';ctx.stroke();
      }
    }
    if (styleClean === 'kite_frame') {
      // Prateleira com cabideiro: painel traseiro visível, ganchos de metal e uma argola
      // que conecta a pipa ao gancho esquerdo. Todas as ferragens ficam abaixo do apoio.
      const wood = ctx.createLinearGradient(0,platY+10,0,platY+34);
      wood.addColorStop(0,'#684327');wood.addColorStop(.45,'#8b5a32');
      wood.addColorStop(1,'#42291e');ctx.fillStyle=wood;
      ctx.fillRect(sxSurface+3,platY+10,platW-6,24);
      for (let row=0;row<5;row++) {
        ctx.beginPath();ctx.moveTo(sxSurface+6,platY+15+row*3);
        ctx.lineTo(sxSurface+platW-7,platY+16+row*3);
        ctx.strokeStyle=row%2?'#704527':'#986337';ctx.lineWidth=.6;ctx.stroke();
      }
      // Tampo espesso de madeira, sem guia de pouso separado sobre a superfície.
      drawContactEdge(ctx,sxSurface,platY,platW,'wood',10);
      for (const offset of [13,platW/2,platW-13]) {
        const x=sxSurface+offset;
        ctx.fillStyle='#382f25';ctx.fillRect(x-3,platY+15,6,12);
        ctx.fillStyle='#9a8054';ctx.fillRect(x-2,platY+16,4,9);
        ctx.fillStyle='#322b24';ctx.fillRect(x-.7,platY+17,1.4,1.4);
        ctx.beginPath();ctx.moveTo(x,platY+23);ctx.lineTo(x,platY+30);
        ctx.lineTo(x-2,platY+32);ctx.lineTo(x-4,platY+30);ctx.lineTo(x-4,platY+27);
        ctx.strokeStyle='#30291f';ctx.lineWidth=3;ctx.stroke();
        ctx.strokeStyle='#b29a6b';ctx.lineWidth=1.3;ctx.stroke();
      }
      // A argola fechada é distinta do suporte e alcança a ponta da pipa.
      const tipX=dx+38*scale, tipY=dy+3*scaleY;
      const hookX=sxSurface+11;
      ctx.beginPath();ctx.moveTo(tipX,tipY);
      ctx.lineTo(hookX-3,platY+36);ctx.lineTo(hookX-3,platY+30);
      ctx.lineTo(hookX,platY+28);ctx.lineTo(hookX+3,platY+31);
      ctx.lineTo(hookX+2,platY+37);ctx.lineTo(tipX,tipY);
      ctx.strokeStyle='#d1b37b';ctx.lineWidth=1;ctx.stroke();
    }
    if (styleClean === 'cuckoo_clock') {
      // Este tampo robusto de madeira faz parte da fixação à parede, não é uma guia de salto.
      drawContactEdge(ctx,sxSurface,platY,platW,'wood',10);
      ctx.fillStyle='#513420';ctx.fillRect(sxSurface+3,platY+10,platW-6,3);
    }
    return true;
  }

  /**
   * Renderiza plataformas de acordo com seus estilos visuais temáticos individuais
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {number} camX
   * @param {object} [options]
   */
  renderPlatforms(ctx, canvas, camX = 0, options = {}) {
    if (!ctx || !canvas) return;
    const isPhase3 = Boolean(options.isPhase3);
    const activePlatforms = options.platforms || (isPhase3 ? defaultPhase3Platforms : defaultPlatforms);
    const baby = options.baby || {};
    const tick = options.tick || 0;
    const assets = options.assets || this.assets || null;
    const FLOOR_Y = this.floorY;

    ctx.save();
    activePlatforms.forEach((p, idx) => {
      const sx = p.x - camX;
      // A visibilidade considera o zoom e os offsets reais, sem alterar o objeto ou sua hitbox.
      const cameraMatrix = options.cameraVisibility ? ctx.getTransform?.() : null;
      const left = cameraMatrix ? cameraMatrix.a * sx + cameraMatrix.e : sx;
      const right = cameraMatrix ? cameraMatrix.a * (sx + p.w) + cameraMatrix.e : sx + p.w;
      if (right < -80 || left > canvas.width + 80) return;

      const isDebugHitbox = !options.contactMask && ((typeof window !== 'undefined' && typeof window.DEBUG_COLLISIONS === 'boolean')
        ? window.DEBUG_COLLISIONS
        : (typeof DEBUG_COLLISIONS === 'boolean' ? DEBUG_COLLISIONS : false));

      const platX = p.standRegion ? p.standRegion.x : p.x;
      const platW = p.standRegion ? p.standRegion.w : p.w;
      const platY = p.surfaceTopY ?? p.standRegion?.y ?? p.y;
      const platH = (p.standRegion && p.standRegion.h !== undefined) ? p.standRegion.h : p.h;
      const sxBox = platX - camX;

      // 1. Sobreposição de depuração: Desenha a plataforma física em verde por baixo
      if (isDebugHitbox) {
        ctx.save();
        // Área sólida da hitbox física em verde translúcido
        ctx.fillStyle = 'rgba(34, 197, 94, 0.45)';
        ctx.fillRect(sxBox, platY, platW, platH);
        ctx.strokeStyle = '#16a34a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(sxBox, platY, platW, platH);
        ctx.restore();
      }

      // 2. Sprite renderizado por cima da plataforma física
      const renderedSprite = drawStorybookPlatform(ctx, assets, p, sx, tick) ||
        this.drawAtlasPlatformSprite(ctx, assets, p.style, sx, p, tick);

      // 3. Validação do topo da hitbox: traço verde luminoso na superfície de pouso
      if (isDebugHitbox) {
        ctx.save();
        // Linha da superfície física de aterrissagem (y = platY)
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(sxBox, platY);
        ctx.lineTo(sxBox + platW, platY);
        ctx.stroke();

        // Marcadores nos limites exatos esquerdo e direito de pouso
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sxBox, platY - 6);
        ctx.lineTo(sxBox, platY + 6);
        ctx.moveTo(sxBox + platW, platY - 6);
        ctx.lineTo(sxBox + platW, platY + 6);
        ctx.stroke();

        // Rótulo da plataforma para inspeção rigorosa
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#052e16';
        ctx.lineWidth = 2.5;
        ctx.font = 'bold 9.5px monospace';
        const label = `${p.style} [y:${platY} w:${platW}]`;
        ctx.strokeText(label, sxBox + 4, platY - 8);
        ctx.fillText(label, sxBox + 4, platY - 8);
        ctx.restore();
      }

      if (renderedSprite) {
        return;
      }

      // Estilos removidos usam exclusivamente as ilustrações atuais.
      if (REMOVED_PLATFORM_FALLBACKS.has(p.style)) return;

      // Alternativas dos estilos não selecionados na revisão
      switch (p.style) {
        case 'cardboard_box': {
          // 4. Cômoda Pequena de Madeira Nobre (Topo Plano e Estável)
          const woodDark = '#3b180a';
          const woodMid = '#6c2e12';
          const woodLight = '#9a431c';
          const woodHighlight = '#c2622d';
          const brassColor = '#f59e0b';
          const brassDark = '#b45309';

          // Corpo da cômoda
          ctx.fillStyle = woodMid;
          ctx.fillRect(sx + 2, p.y + 12, p.w - 4, p.h - 12);
          ctx.strokeStyle = woodDark;
          ctx.lineWidth = 2;
          ctx.strokeRect(sx + 2, p.y + 12, p.w - 4, p.h - 12);

          // Pés de suporte robustos (bracket feet)
          ctx.fillStyle = woodDark;
          ctx.fillRect(sx + 4, p.y + p.h - 8, 14, 8);
          ctx.fillRect(sx + p.w - 18, p.y + p.h - 8, 14, 8);

          // Gavetas decorativas (3 gavetas elegantes)
          const drawerCount = 3;
          const drawerH = Math.floor((p.h - 26) / drawerCount);
          for (let d = 0; d < drawerCount; d++) {
            const dy = p.y + 16 + d * (drawerH + 3);
            ctx.fillStyle = woodLight;
            ctx.fillRect(sx + 8, dy, p.w - 16, drawerH);
            ctx.strokeStyle = woodDark;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(sx + 8, dy, p.w - 16, drawerH);

            // Puxadores de latão dourado polido
            const pullY = dy + drawerH / 2;
            ctx.fillStyle = brassColor;
            ctx.strokeStyle = brassDark;
            ctx.lineWidth = 1;
            // Puxador esquerdo
            ctx.beginPath();
            ctx.arc(sx + 26, pullY, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // Puxador direito
            ctx.beginPath();
            ctx.arc(sx + p.w - 26, pullY, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Buraco de fechadura decorativo no centro
            ctx.fillStyle = '#1e0802';
            ctx.beginPath();
            ctx.arc(sx + p.w / 2, pullY - 1, 1.5, 0, Math.PI * 2);
            ctx.rect(sx + p.w / 2 - 1, pullY, 2, 2.5);
            ctx.fill();
          }

          // Topo de madeira polida COMPLETAMENTE PLANO onde a personagem pisa (p.y)
          ctx.fillStyle = woodHighlight;
          ctx.fillRect(sx - 2, p.y, p.w + 4, 12);
          ctx.strokeStyle = woodDark;
          ctx.lineWidth = 2;
          ctx.strokeRect(sx - 2, p.y, p.w + 4, 12);

          // Linha de reflexo dourado suave na superfície horizontal
          ctx.fillStyle = '#fef08a';
          ctx.globalAlpha = 0.5;
          ctx.fillRect(sx, p.y + 1, p.w, 2);
          ctx.globalAlpha = 1.0;
          break;
        }

        case 'wardrobe_portal': {
          // Topo do Guarda-Roupa Clássico
          ctx.fillStyle = '#3b1808';
          ctx.fillRect(sx, p.y, p.w, p.h);
          ctx.fillStyle = '#59250b';
          ctx.fillRect(sx - 8, p.y - 4, p.w + 16, 10);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 4, p.y + 6, p.w + 8, 8);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2.4;
          ctx.strokeRect(sx + 10, p.y + 20, p.w - 20, 28);
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 13px Palatino, Georgia, serif';
          ctx.fillText('✧  O  PORTAL  DOS  SONHOS  ✧', sx + p.w / 2 - 105, p.y + 38);
          break;
        }

        case 'toppled_blocks': {
          // 1/15 Pilha de Blocos Tombada
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(sx, p.y, 44, 22);
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(sx + 40, p.y - 4, 46, 26);
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx + 82, p.y + 2, p.w - 82, 20);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('A', sx + 16, p.y + 16);
          ctx.fillText('B', sx + 58, p.y + 14);
          ctx.fillText('C', sx + 98, p.y + 17);
          break;
        }

        case 'floppy_ragdoll': {
          // 2/15 Boneca de Pano Desconjuntada
          ctx.fillStyle = '#be185d';
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y + 12, p.w / 2, 10, -0.05, 0, Math.PI * 2);
          ctx.fill();

          // Olhos de botão
          ctx.fillStyle = '#18181b';
          ctx.beginPath();
          ctx.arc(sx + 24, p.y + 8, 3.5, 0, Math.PI * 2);
          ctx.arc(sx + 36, p.y + 8, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Cabelo de fios de lã vermelha
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 2.2;
          for (let h = 0; h < 6; h++) {
            ctx.beginPath();
            ctx.moveTo(sx + 14 + h * 5, p.y + 4);
            ctx.lineTo(sx + 10 + h * 5, p.y - 8);
            ctx.stroke();
          }

          // Perninhas listradas
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(sx + p.w - 32, p.y + 12, 28, 8);
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(sx + p.w - 24, p.y + 12, 8, 8);
          break;
        }

        case 'spilled_crayons_box': {
          // 3/15 Caixa de Giz de Cera Aberta
          ctx.fillStyle = '#ca8a04';
          ctx.fillRect(sx, p.y, p.w, 14);
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx + 4, p.y + 2, p.w - 8, 10);

          // Bastões de giz de cera rolando para fora
          const crayonColors = ['#ec4899', '#06b6d4', '#10b981', '#a855f7'];
          crayonColors.forEach((c, idx) => {
            ctx.fillStyle = c;
            ctx.fillRect(sx + 10 + idx * 24, p.y + 12, 18, 5);
            ctx.beginPath();
            ctx.moveTo(sx + 10 + idx * 24, p.y + 12);
            ctx.lineTo(sx + 6 + idx * 24, p.y + 14.5);
            ctx.lineTo(sx + 10 + idx * 24, p.y + 17);
            ctx.closePath();
            ctx.fill();
          });
          break;
        }

        case 'crooked_fairytales': {
          // 4/15 Pilha Torta de Contos de Fada
          const bookHues = ['#4338ca', '#b91c1c', '#047857', '#6b21a8'];
          bookHues.forEach((bh, bIdx) => {
            const shift = (bIdx % 2 === 0 ? 3 : -3);
            ctx.fillStyle = bh;
            ctx.fillRect(sx + shift, p.y + bIdx * 6, p.w - 4, 6);
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(sx + p.w - 12 + shift, p.y + bIdx * 6 + 1, 8, 4);
          });
          break;
        }

        case 'dented_drum': {
          // 5/15 Tamborzinho Amassado
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(sx + 6, p.y + 6, p.w - 12, 14);
          // Aro dourado
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx, p.y, p.w, 6);
          // Baquetas de madeira cruzadas
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sx + 12, p.y + 3); ctx.lineTo(sx + p.w - 12, p.y - 6);
          ctx.moveTo(sx + 12, p.y - 6); ctx.lineTo(sx + p.w - 12, p.y + 3);
          ctx.stroke();
          break;
        }

        case 'slumped_bear': {
          // 6/15 Urso de Pelúcia Desmoronado
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y + 10, p.w / 2, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          // Orelhas de veludo
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.arc(sx + 12, p.y + 2, 6, 0, Math.PI * 2);
          ctx.arc(sx + p.w - 12, p.y + 2, 6, 0, Math.PI * 2);
          ctx.fill();
          // Focinho
          ctx.fillStyle = '#fde68a';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 11, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'tilted_xylophone': {
          // 7/15 Xilofone Colorido Inclinado
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx, p.y + 8, p.w, 4);
          const rainbow = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6'];
          rainbow.forEach((col, i) => {
            const barW = Math.max(8, (p.w - 12) / rainbow.length);
            ctx.fillStyle = col;
            ctx.fillRect(sx + 4 + i * barW, p.y, barW - 2, 10 - i * 0.8);
          });
          break;
        }

        case 'derailed_train': {
          // 8/15 Locomotiva Descarrilada
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(sx, p.y + 2, p.w - 14, 14);
          // Chaminé
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(sx + 8, p.y - 7, 7, 9);
          // Rodas vermelhas
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(sx + 14, p.y + 18, 5, 0, Math.PI * 2);
          ctx.arc(sx + p.w - 22, p.y + 18, 5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'wobbly_card_house': {
          // 9/15 Castelo de Cartas Bamboleante
          const sway = Math.sin(tick * 0.15) * 2;
          ctx.fillStyle = '#f8fafc';
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 1;
          // Cartas inclinadas apoiadas
          ctx.beginPath();
          ctx.moveTo(sx + 4 + sway, p.y + 14);
          ctx.lineTo(sx + p.w / 2, p.y);
          ctx.lineTo(sx + p.w - 4 - sway, p.y + 14);
          ctx.stroke();
          // Símbolo de copas
          ctx.fillStyle = '#ef4444';
          ctx.font = '10px sans-serif';
          ctx.fillText('♥', sx + p.w / 2 - 4, p.y + 11);
          break;
        }

        case 'leaning_music_box': {
          // 10/15 Caixa de Música Desregulada
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx, p.y + 4, p.w, 14);
          ctx.fillStyle = '#facc15';
          // Silhueta da bailarina dourada
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y - 2, 3, 0, Math.PI * 2);
          ctx.rect(sx + p.w / 2 - 2, p.y + 1, 4, 5);
          ctx.fill();
          break;
        }

        case 'loose_robot': {
          // 11/15 Robô de Lata Desparafusado
          ctx.fillStyle = '#0891b2';
          ctx.fillRect(sx, p.y, p.w, 12);
          // Antena com esfera brilhante
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(sx + p.w / 2, p.y); ctx.lineTo(sx + p.w / 2, p.y - 7);
          ctx.stroke();
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y - 8, 2.5, 0, Math.PI * 2);
          ctx.fill();
          // Medidores dos olhos
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx + 8, p.y + 3, 5, 4);
          ctx.fillRect(sx + p.w - 13, p.y + 3, 5, 4);
          break;
        }

        case 'spinning_top': {
          // 12/15 Pião de Madeira Rodopiante
          const topPhase = Math.sin(tick * 0.3) * 3;
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(sx + p.w / 2 + topPhase, p.y - 6);
          ctx.lineTo(sx + p.w - 4, p.y + 5);
          ctx.lineTo(sx + p.w / 2, p.y + 15);
          ctx.lineTo(sx + 4, p.y + 5);
          ctx.closePath();
          ctx.fill();
          // Faixa circular
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 2;
          ctx.stroke();
          break;
        }

        case 'floating_spool': {
          // 13/15 Carretel com Fita Flutuante
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx, p.y, p.w, 4);
          ctx.fillRect(sx, p.y + 12, p.w, 4);
          // Linha roxa enrolada
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(sx + 4, p.y + 4, p.w - 8, 8);
          // Fita flutuante
          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          const rPhase = Math.sin(tick * 0.18) * 5;
          ctx.moveTo(sx + p.w - 4, p.y + 4);
          ctx.quadraticCurveTo(sx + p.w + 10, p.y - 8 + rPhase, sx + p.w + 16, p.y - 18);
          ctx.stroke();
          break;
        }

        case 'unbalanced_mobile': {
          // 14/15 Móbile Desequilibrado
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(sx, p.y);
          ctx.lineTo(sx + p.w, p.y + 3);
          ctx.stroke();
          // Estrela pendurada balançando
          ctx.fillStyle = '#fef08a';
          ctx.font = '10px sans-serif';
          ctx.fillText('★', sx + p.w / 2 - 4, p.y + 14);
          break;
        }

        case 'levitating_grimoire': {
          // 15/15 Livro de Feitiços no Vácuo (O Salto Quase Impossível!)
          const gPulse = Math.sin(tick * 0.2) * 3;
          // Aura luminosa
          ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 6, p.w / 2 + 8, 0, Math.PI * 2);
          ctx.fill();

          // Capa do grimório
          ctx.fillStyle = '#701a75';
          ctx.beginPath();
          ctx.roundRect(sx, p.y + gPulse, p.w, 12, 3);
          ctx.fill();

          // Páginas douradas
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx + 3, p.y + 3 + gPulse, p.w - 6, 6);

          // Runa mística flutuando acima
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('⚡', sx + p.w / 2 - 5, p.y - 4 + gPulse);
          break;
        }

        case 'true_portal_balcony': {
          // Balcão do Verdadeiro Portal dos Sonhos (Destino da Fase 3)
          ctx.fillStyle = '#18182e';
          ctx.fillRect(sx, p.y, p.w, p.h);

          // Terraço de mármore dourado
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx - 10, p.y - 4, p.w + 20, 10);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 6, p.y + 6, p.w + 12, 6);

          // Runas e inscrição
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 12px Palatino, Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillText('✦   O  VERDADEIRO  PORTAL  DOS  SONHOS   ✦', sx + p.w / 2, p.y + 36);

          // Tocheiras de farol de cristal
          const t1 = sx + 25;
          const t2 = sx + p.w - 25;
          [t1, t2].forEach(tx => {
            ctx.fillStyle = '#475569';
            ctx.fillRect(tx - 5, p.y - 24, 10, 24);
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(tx, p.y - 28, 7, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }

        default: {
          ctx.fillStyle = '#1c1924';
          ctx.fillRect(sx, p.y, p.w, p.h);
          break;
        }
      }

      // Iluminação Dinâmica dos Obstáculos: Penumbra na Borda Superior e Revelação Gradual ao Pousar
      ctx.save();
      const isMagicalPhase = isPhase3;
      const alpha = p.lightAlpha || 0;

      // Estado Ativado: Revelação visual suave e gradual do corpo do brinquedo/objeto por inteiro ao pousar
      if (alpha > 0.01) {
        const bodyGlow = ctx.createLinearGradient(sx, p.y, sx, p.y + p.h);
        if (isMagicalPhase) {
          bodyGlow.addColorStop(0, `rgba(233, 213, 255, ${0.28 * alpha})`);
          bodyGlow.addColorStop(1, `rgba(168, 85, 247, ${0.09 * alpha})`);
        } else {
          bodyGlow.addColorStop(0, `rgba(254, 240, 138, ${0.30 * alpha})`);
          bodyGlow.addColorStop(1, `rgba(245, 158, 11, ${0.09 * alpha})`);
        }
        ctx.fillStyle = bodyGlow;
        ctx.fillRect(sxBox, platY, platW, platH);
      }

      ctx.restore();

      // Pequeno indicador cintilante para o próximo alvo
      if (idx === baby.currentPlatformIndex + 1) {
        const bounce = Math.sin(tick * 0.1) * 4;
        ctx.fillStyle = '#fef08a';
        ctx.font = '16px sans-serif';
        ctx.fillText('▼', sxBox + platW / 2 - 6, platY - 16 + bounce);
      }
    });
    ctx.restore();
  }

  /**
   * Renderiza a Porta de Saída (portal do quarto na Plataforma 9 / quadro falso descascando)
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {number} camX
   * @param {object} [options]
   */
  renderExitDoor(ctx, canvas, camX = 0, options = {}) {
    if (!ctx || !canvas) return;
    const exitDoor = options.exitDoor || defaultExitDoor;
    const fakeDoorRevealed = Boolean(options.fakeDoorRevealed);
    const fakeDoorSlideY = options.fakeDoorSlideY || 0;
    const fakeDoorRotation = options.fakeDoorRotation || 0;
    const assets = options.assets || this.assets;
    const sprite = assets?.get('dark-room-sprite-false-door');
    if (!sprite) return;

    const sx = exitDoor.x - camX;
    if (sx < -200 || sx > canvas.width + 200) return;

    ctx.save();

    if (fakeDoorRevealed) {
      // Contorno da parede com marcas de fita adesiva descascada e desenho engraçado
      ctx.fillStyle = 'rgba(254, 243, 199, 0.15)';
      ctx.fillRect(sx, exitDoor.y, exitDoor.w, exitDoor.h);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, exitDoor.y, exitDoor.w, exitDoor.h);

      // 4 pedaços amarelados de fita crepe colados na parede
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(sx - 4, exitDoor.y - 4, 18, 8);
      ctx.fillRect(sx + exitDoor.w - 14, exitDoor.y - 4, 18, 8);
      ctx.fillRect(sx - 4, exitDoor.y + exitDoor.h - 4, 18, 8);
      ctx.fillRect(sx + exitDoor.w - 14, exitDoor.y + exitDoor.h - 4, 18, 8);

      // Escrita a giz de cera na parede vazia
      ctx.fillStyle = 'rgba(239, 68, 68, 0.75)';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ERA SÓ UM QUADRO!', sx + exitDoor.w / 2, exitDoor.y + exitDoor.h / 2);

    }

    // A pintura aprovada acompanha a animação de revelação existente. Sua proporção
    // e o retângulo de chegada do jogo permanecem independentes.
    const height = exitDoor.h;
    const width = height * (sprite.naturalWidth || sprite.width) /
      (sprite.naturalHeight || sprite.height);
    ctx.translate(sx + exitDoor.w / 2,
      exitDoor.y + height / 2 + (fakeDoorRevealed ? fakeDoorSlideY : 0));
    ctx.rotate(fakeDoorRevealed ? fakeDoorRotation : 0);
    ctx.drawImage(sprite, -width / 2, -height / 2, width, height);

    ctx.restore();
  }

  /**
   * Renderiza o celestial Verdadeiro Portal de Saída da Fase 3
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {number} camX
   * @param {object} [options]
   */
  renderTrueExitDoor(ctx, canvas, camX = 0, options = {}) {
    if (!ctx || !canvas) return;
    const trueExitDoor = options.trueExitDoor || defaultTrueExitDoor;
    const trueDoorOpenAngle = options.trueDoorOpenAngle || 0;
    const tick = options.tick || 0;

    const sx = trueExitDoor.x - camX;
    if (sx < -200 || sx > canvas.width + 200) return;

    ctx.save();
    const pulse = Math.sin(tick * 0.08) * 22;
    const glow = ctx.createRadialGradient(
      sx + trueExitDoor.w / 2, trueExitDoor.y + trueExitDoor.h / 2, 16,
      sx + trueExitDoor.w / 2, trueExitDoor.y + trueExitDoor.h / 2, 170 + pulse
    );
    glow.addColorStop(0, 'rgba(255, 245, 180, 0.98)');
    glow.addColorStop(0.3, 'rgba(168, 85, 247, 0.65)');
    glow.addColorStop(0.65, 'rgba(56, 189, 248, 0.4)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(sx - 120, trueExitDoor.y - 100, trueExitDoor.w + 240, trueExitDoor.h + 200);

    // Arco do portal cósmico
    ctx.fillStyle = '#4c1d95';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(sx, trueExitDoor.y, trueExitDoor.w, trueExitDoor.h, [48, 48, 8, 8]);
    ctx.fill();
    ctx.stroke();

    // Vórtice giratório do portal
    const vortex = ctx.createLinearGradient(sx, trueExitDoor.y, sx, trueExitDoor.y + trueExitDoor.h);
    vortex.addColorStop(0, '#fde047');
    vortex.addColorStop(0.25, '#c084fc');
    vortex.addColorStop(0.6, '#38bdf8');
    vortex.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = vortex;
    ctx.beginPath();
    ctx.roundRect(sx + 8, trueExitDoor.y + 12, trueExitDoor.w - 16, trueExitDoor.h - 18, [38, 38, 6, 6]);
    ctx.fill();

    // Animação da porta abrindo durante a transição de fase para o Quarto de Brinquedos
    if (trueDoorOpenAngle > 0.02) {
      // 1. Raios volumétricos radiantes de sol se espalhando em leque pela plataforma
      const beamCount = 6;
      for (let b = 0; b < beamCount; b++) {
        const bAngle = -0.35 + (b / (beamCount - 1)) * 0.7;
        const bLen = 140 + Math.sin(tick * 0.15 + b) * 20;
        const beamGrad = ctx.createLinearGradient(
          sx + trueExitDoor.w / 2, trueExitDoor.y + trueExitDoor.h / 2,
          sx + trueExitDoor.w / 2 + Math.sin(bAngle) * bLen,
          trueExitDoor.y + trueExitDoor.h + Math.cos(bAngle) * 35
        );
        beamGrad.addColorStop(0, `rgba(255, 250, 200, ${0.75 * trueDoorOpenAngle})`);
        beamGrad.addColorStop(0.6, `rgba(250, 204, 21, ${0.45 * trueDoorOpenAngle})`);
        beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(sx + 16, trueExitDoor.y + trueExitDoor.h - 10);
        ctx.lineTo(sx + trueExitDoor.w - 16, trueExitDoor.y + trueExitDoor.h - 10);
        ctx.lineTo(sx + trueExitDoor.w / 2 + Math.sin(bAngle) * bLen + 40, trueExitDoor.y + trueExitDoor.h + 40);
        ctx.lineTo(sx + trueExitDoor.w / 2 + Math.sin(bAngle) * bLen - 40, trueExitDoor.y + trueExitDoor.h + 40);
        ctx.closePath();
        ctx.fill();
      }

      // 2. Vislumbre do Quarto de Brinquedos vibrante e ensolarado dentro do vão da porta
      const roomGlimpse = ctx.createLinearGradient(sx, trueExitDoor.y, sx, trueExitDoor.y + trueExitDoor.h);
      roomGlimpse.addColorStop(0, '#fef08a');
      roomGlimpse.addColorStop(0.4, '#fcd34d');
      roomGlimpse.addColorStop(0.7, '#6ee7b7');
      roomGlimpse.addColorStop(1, '#bbf7d0');
      ctx.fillStyle = roomGlimpse;
      ctx.beginPath();
      ctx.roundRect(sx + 10, trueExitDoor.y + 14, trueExitDoor.w - 20, trueExitDoor.h - 22, [36, 36, 4, 4]);
      ctx.fill();

      // 3. Folhas ornadas da porta em arco abrindo em perspectiva
      const leafW = Math.max(2, (trueExitDoor.w / 2 - 12) * (1 - trueDoorOpenAngle));
      // Folha esquerda da porta
      ctx.fillStyle = '#b45309';
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(sx + 10, trueExitDoor.y + 14, leafW, trueExitDoor.h - 22, [32, 4, 4, 4]);
      ctx.fill();
      ctx.stroke();

      // Folha direita da porta
      ctx.beginPath();
      ctx.roundRect(sx + trueExitDoor.w - 10 - leafW, trueExitDoor.y + 14, leafW, trueExitDoor.h - 22, [4, 32, 4, 4]);
      ctx.fill();
      ctx.stroke();
    }

    // Estrelas douradas flutuando no portal
    const sBob = Math.sin(tick * 0.12) * 5;
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px sans-serif';
    ctx.fillText('⭐', sx + trueExitDoor.w / 2 - 12, trueExitDoor.y + 44 + sBob);
    ctx.fillText('✨', sx + trueExitDoor.w / 2 - 12, trueExitDoor.y + 88 - sBob);

    ctx.restore();
  }

  /**
   * Renderiza o guia visual do tutorial apontando para a primeira plataforma na Fase 3
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {number} camX
   * @param {object} [options]
   */
  renderTutorialArrow(ctx, canvas, camX = 0, options = {}) {
    if (!ctx || !canvas) return;
    const isPhase3 = Boolean(options.isPhase3);
    const phase3Platforms = options.phase3Platforms || defaultPhase3Platforms;
    const baby = options.baby || {};
    const tick = options.tick || 0;

    if (!isPhase3 || baby.currentPlatformIndex >= 0 || phase3Platforms.length === 0) return;
    const p0 = phase3Platforms[0];
    const sx = p0.x - camX + p0.w / 2;
    const sy = p0.y;

    ctx.save();
    // Zona alvo de pouso pulsante luminosa na primeira plataforma
    const pulse = Math.sin(tick * 0.1) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(250, 204, 21, ${0.4 * pulse})`;
    ctx.beginPath();
    ctx.ellipse(sx, sy + 6, p0.w * 0.42, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Seta guia flutuante quicando
    const bob = Math.sin(tick * 0.12) * 5;
    const arrowY = sy - 26 + bob;

    // Balão de etiqueta
    ctx.fillStyle = 'rgba(15, 12, 24, 0.92)';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(sx - 52, arrowY - 22, 104, 22, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 10.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('▼ SUBA AQUI!', sx, arrowY - 7);

    // Triângulo apontando para baixo
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(sx - 7, arrowY + 3);
    ctx.lineTo(sx + 7, arrowY + 3);
    ctx.lineTo(sx, arrowY + 11);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

export const platformRenderer = new PlatformRenderer();
