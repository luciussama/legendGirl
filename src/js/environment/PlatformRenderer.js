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

export const PLATFORM_SURFACES = {
  giant_bear: { surfaceY: 139, surfaceX: 460, surfaceW: 1000, origW: 1922, origH: 818, bottom: 755, floorFit: true },
  open_books: { surfaceY: 2, surfaceX: 2, surfaceW: 272, origW: 276, origH: 300, floorFit: true },
  vanity_table: { surfaceY: 250, surfaceX: 2, surfaceW: 294, origW: 298, origH: 475, floorFit: true },
  small_dresser: { surfaceY: 0, surfaceX: 2, surfaceW: 414, origW: 418, origH: 411, floorFit: true },
  cardboard_box: { surfaceY: 0, surfaceX: 2, surfaceW: 414, origW: 418, origH: 411 },
  messy_blocks: { surfaceY: 4, surfaceX: 60, surfaceW: 98, origW: 235, origH: 253, floorFit: true },
  toy_drum: { surfaceY: 100, surfaceX: 35, surfaceW: 210, origW: 292, origH: 296, support: 'stand' },
  satin_cushion: { surfaceY: 145, surfaceX: 550, surfaceW: 880, origW: 1983, origH: 793, bottom: 660, support: 'stand' },
  stepped_dresser: { surfaceY: 88, surfaceX: 30, surfaceW: 260, origW: 304, origH: 351, trimAboveSupport: true, cap: 'wood', support: 'stand' },
  music_box: { surfaceY: 192, surfaceX: 23, surfaceW: 154, origW: 259, origH: 322, support: 'stand' },
  block_castle: { surfaceY: 227, surfaceX: 125, surfaceW: 80, origW: 436, origH: 572 },
  train_trestle: { surfaceY: 160, surfaceX: 2, surfaceW: 444, origW: 464, origH: 350, bottom: 290, clipBottom: 290, support: 'stand', cap: 'wood' },
  wall_shelf: { surfaceY: 168, surfaceX: 14, surfaceW: 374, origW: 392, origH: 286, cap: 'wood', excludeRects: [[0, 0, 104, 34], [0, 34, 15, 14]] },
  // The complete lamp sits behind the walkable table, aligned by its base.
  mushroom_lamp: { surfaceY: 342, surfaceX: -86, surfaceW: 460, origW: 288, origH: 342, support: 'foreground-table', cap: 'wood' },
  dollhouse_roof: { surfaceY: 104, surfaceX: 112, surfaceW: 380, origW: 582, origH: 337, support: 'house', cap: 'roof' },
  spinning_globe: { surfaceY: 0, surfaceX: 0, surfaceW: 212, origW: 214, origH: 309, support: 'stand', frame: 'brass', cap: 'brass' },
  kite_frame: { surfaceY: 0, surfaceX: 20, surfaceW: 155, origW: 490, origH: 322, cap: 'bamboo' },
  // Feet sit within the illustrated pages; their curvature is intentionally decorative.
  floating_books: { surfaceY: 90, surfaceX: 95, surfaceW: 240, origW: 410, origH: 279 },
  chandelier_crystals: { surfaceY: 130, surfaceX: 3, surfaceW: 287, origW: 292, origH: 335 },
  curtain_rod: { surfaceY: 2, surfaceX: 2, surfaceW: 487, origW: 491, origH: 351 },
  cuckoo_clock: { surfaceY: 66, surfaceX: 0, surfaceW: 194, origW: 196, origH: 334 },
  wardrobe_ledge: { surfaceY: 72, surfaceX: 3, surfaceW: 557, origW: 560, origH: 200 },
  grand_portal_pedestal: { surfaceY: 140, surfaceX: 3, surfaceW: 515, origW: 518, origH: 365 }
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
   * Retorna true se o asset foi desenhado com sucesso, ou false caso contrário (ativando fallback).
   */
  drawAtlasPlatformSprite(ctx, assets, style, sx, p, tick = 0) {
    if (!assets) return false;
    const styleClean = (style || '').toLowerCase();
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
    // A superfície de apoio visual (walkable surface) do sprite DEVE coincidir exatamente com:
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
    const dw = Math.round(spriteW * scale);
    const scaleY = s.floorFit ? Math.min(scale, (this.floorY - platY) / ((s.bottom ?? spriteH) - s.surfaceY)) : scale;
    const dh = Math.round(spriteH * scaleY);

    // O início horizontal da superfície de apoio coincide com sx (ou sxSurface com standRegion)
    const dx = Math.round(sxSurface - (s.surfaceX * scale));

    // A superfície de apoio do sprite coincide exatamente com a altura platY
    const dy = Math.round(platY - (s.surfaceY * scaleY));

    // Furniture under the object is scenery, never an extra landing surface.
    if (s.support === 'stand') {
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

    if (s.support === 'house') {
      // The roof belongs to a dollhouse rooted on the floor. Draw its facade
      // behind the sloping eaves; it is scenery, not another landing area.
      const left = dx + 13, width = dw - 26;
      const top = dy + Math.round(dh * 0.72);
      ctx.fillStyle = '#b98d70';ctx.fillRect(left, top, width, this.floorY - top);
      ctx.fillStyle = '#77503b';
      ctx.fillRect(left, top, 5, this.floorY - top);
      ctx.fillRect(left + width - 5, top, 5, this.floorY - top);
      for (let y = top + 18; y < this.floorY - 50; y += 49) {
        ctx.fillStyle = '#78513c';ctx.fillRect(left + 4, y + 32, width - 8, 4);
        for (const x of [left + 17, left + width - 35]) {
          ctx.fillStyle = '#533b38';ctx.fillRect(x - 2, y - 2, 22, 28);
          ctx.fillStyle = '#f1c778';ctx.fillRect(x, y, 18, 24);
          ctx.fillStyle = '#9e7150';ctx.fillRect(x + 8, y, 2, 24);ctx.fillRect(x, y + 11, 18, 2);
        }
      }
      ctx.fillStyle = '#634638';ctx.fillRect(left + width / 2 - 13, this.floorY - 38, 26, 38);
      ctx.fillStyle = '#e7bf71';ctx.fillRect(left + width / 2 + 6, this.floorY - 20, 3, 3);
      ctx.fillStyle = '#876047';ctx.fillRect(left - 3, this.floorY - 4, width + 6, 4);
    }

    // Suporte sutil de sombra/madeira até o piso para plataformas altas
    if (dy + dh < this.floorY && ['stepped_dresser', 'train_trestle'].includes(styleClean) && s.support !== 'stand') {
      ctx.fillStyle = 'rgba(20, 14, 28, 0.45)';
      ctx.fillRect(sx + 8, dy + dh - 4, p.w - 16, this.floorY - (dy + dh - 4));
    }

    if (s.frame === 'brass') {
      // A flat handle carried by the globe's frame. The sphere stays round;
      // the brass crossbar, not empty space above its curved sides, is walkable.
      const frameBottom = dy + Math.round(dh * 0.80);
      ctx.fillStyle = '#77512b';
      ctx.fillRect(sxSurface, platY + 5, 4, frameBottom - platY - 5);
      ctx.fillRect(sxSurface + platW - 4, platY + 5, 4, frameBottom - platY - 5);
      ctx.fillRect(sxSurface, frameBottom - 4, platW, 4);
      ctx.fillStyle = '#d4a457';
      ctx.fillRect(sxSurface + 1, platY + 5, 1, frameBottom - platY - 5);
      ctx.fillRect(sxSurface + platW - 3, platY + 5, 1, frameBottom - platY - 5);
    }

    const clipSprite = s.trimAboveSupport || s.clipBottom !== undefined || s.excludeRects;
    if (clipSprite) {
      const clipTop = s.trimAboveSupport ? platY : dy;
      const clipEnd = dy + (s.clipBottom ?? spriteH) * scaleY;
      ctx.save();ctx.beginPath();ctx.rect(dx, clipTop, dw, clipEnd - clipTop);
      // Exclude neighbouring objects baked into an atlas cutout, without
      // stretching the artwork or touching the collision geometry.
      for (const [x, y, w, h] of s.excludeRects || []) {
        ctx.rect(dx + x * dw / spriteW, dy + y * dh / spriteH,
          w * dw / spriteW, h * dh / spriteH);
      }
      ctx.clip('evenodd');
    }
    ctx.drawImage(sprite, dx, dy, dw, dh);
    if (clipSprite) ctx.restore();
    if (s.support === 'foreground-table') {
      // Draw after the lamp so the front apron occludes its base. The character
      // is rendered later, walking along the table in front of the whole lamp.
      const legTop = platY + 12;
      ctx.fillStyle = '#4c3025';
      for (const x of [sxSurface + 7, sxSurface + platW - 18]) {
        ctx.fillRect(x, legTop, 11, this.floorY - legTop);
        ctx.fillStyle = '#987044';ctx.fillRect(x + 2, legTop, 3, this.floorY - legTop - 5);
        ctx.fillStyle = '#4c3025';
      }
      ctx.fillStyle = '#67482e';ctx.fillRect(sxSurface + 5, platY + 7, platW - 10, 22);
      ctx.fillStyle = '#aa8050';ctx.fillRect(sxSurface + 10, platY + 11, platW - 20, 2);
      ctx.fillStyle = '#3b281f';ctx.fillRect(sxSurface + 10, platY + 24, platW - 20, 3);
      ctx.fillStyle = '#d5af6d';ctx.fillRect(sxSurface + platW / 2 - 4, platY + 16, 8, 3);
      ctx.fillStyle = '#67482e';ctx.fillRect(sxSurface + 14, this.floorY - 38, platW - 28, 6);
    }
    if (s.cap === 'bamboo') {
      // The enchanted kite carries a horizontal bamboo spar. Bridle lines
      // attach it to the existing frame; the tail remains purely decorative.
      const knotX = dx + 85 * dw / spriteW;
      const knotY = dy + 78 * dh / spriteH;
      ctx.save();ctx.strokeStyle = '#c8a568';ctx.lineWidth = 1.5;
      ctx.beginPath();ctx.moveTo(sxSurface + 3, platY + 5);
      ctx.lineTo(knotX, knotY);ctx.lineTo(sxSurface + platW - 3, platY + 5);
      ctx.stroke();ctx.restore();
    }
    if (s.cap) {
      const colors = s.cap === 'roof' ? ['#a84e2a', '#ed9c59', '#71351f']
        : s.cap === 'brass' ? ['#a67b3d', '#edc781', '#674624']
        : s.cap === 'bamboo' ? ['#ae833d', '#efd392', '#76522b']
        : ['#68462c', '#b38b50', '#2e1c1b'];
      ctx.fillStyle = colors[0];ctx.fillRect(sxSurface, platY, platW, 5);
      ctx.fillStyle = colors[1];ctx.fillRect(sxSurface, platY, platW, 1.5);
      ctx.fillStyle = colors[2];ctx.fillRect(sxSurface, platY + 5, platW, 2);
      if (s.cap === 'bamboo') {
        // Nodes stay below the contact line so they do not suggest extra height.
        ctx.fillStyle = '#76522b';
        for (const fraction of [0.08, 0.35, 0.65, 0.92]) {
          ctx.fillRect(sxSurface + Math.round(platW * fraction), platY + 1.5, 2, 5.5);
        }
      }
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
      if (sx + p.w < -80 || sx > canvas.width + 80) return;

      const isDebugHitbox = (typeof window !== 'undefined' && typeof window.DEBUG_COLLISIONS === 'boolean')
        ? window.DEBUG_COLLISIONS
        : (typeof DEBUG_COLLISIONS === 'boolean' ? DEBUG_COLLISIONS : false);

      const platX = p.standRegion ? p.standRegion.x : p.x;
      const platW = p.standRegion ? p.standRegion.w : p.w;
      const platY = p.surfaceTopY ?? p.standRegion?.y ?? p.y;
      const platH = (p.standRegion && p.standRegion.h !== undefined) ? p.standRegion.h : p.h;
      const sxBox = platX - camX;

      // 1. Debug overlay: Desenha a plataforma física em verde por baixo
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
      const renderedSprite = this.drawAtlasPlatformSprite(ctx, assets, p.style, sx, p, tick);

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

      // 2. Fallback procedimental caso o asset ainda não esteja carregado
      switch (p.style) {
        case 'giant_bear': {
          // 1. Cabeça do Urso de Pelúcia Gigante
          // Rounded plush head
          const bearGrad = ctx.createRadialGradient(
            sx + p.w / 2, p.y + 35, 10,
            sx + p.w / 2, p.y + 35, 65
          );
          bearGrad.addColorStop(0, '#d97706');
          bearGrad.addColorStop(0.7, '#b45309');
          bearGrad.addColorStop(1, '#78350f');
          ctx.fillStyle = bearGrad;
          ctx.beginPath();
          ctx.roundRect(sx, p.y, p.w, p.h + 20, [30, 30, 8, 8]);
          ctx.fill();

          // Orelha de feltro com pontos cruzados à esquerda
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.arc(sx + 18, p.y - 6, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fde68a';
          ctx.beginPath();
          ctx.arc(sx + 18, p.y - 6, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx + 14, p.y - 9); ctx.lineTo(sx + 22, p.y - 3);
          ctx.moveTo(sx + 22, p.y - 9); ctx.lineTo(sx + 14, p.y - 3);
          ctx.stroke();

          // Orelha de feltro à direita
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.arc(sx + p.w - 18, p.y - 6, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fde68a';
          ctx.beginPath();
          ctx.arc(sx + p.w - 18, p.y - 6, 9, 0, Math.PI * 2);
          ctx.fill();

          // Olho de botão preto visível na lateral
          ctx.fillStyle = '#18181b';
          ctx.beginPath();
          ctx.arc(sx + 35, p.y + 22, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(sx + 33, p.y + 20, 2, 0, Math.PI * 2);
          ctx.fill();

          // Focinho bordado macio
          ctx.fillStyle = '#fef3c7';
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y + 36, 22, 14, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 32, 5, 0, Math.PI * 2);
          ctx.fill();

          // Laço de fita de cetim vermelho
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + p.h + 8, 8, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'open_books': {
          // 2. Pilha de Livros Ilustrados
          // Livro 1 (livro verde inferior)
          ctx.fillStyle = '#065f46';
          ctx.fillRect(sx - 4, p.y + 36, p.w + 8, p.h - 36);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 2, p.y + 38, 5, p.h - 40);

          // Livro 2 (livro intermediário de couro carmesim)
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(sx + 4, p.y + 18, p.w - 2, 20);
          ctx.fillStyle = '#fef9c3';
          ctx.fillRect(sx + 6, p.y + 20, p.w - 12, 16);
          ctx.fillStyle = '#7f1d1d';
          ctx.fillRect(sx + 2, p.y + 18, 8, 20); // lombada

          // Livro 3 (livro de contos de fadas safira superior)
          ctx.fillStyle = '#1e40af';
          ctx.beginPath();
          ctx.roundRect(sx, p.y, p.w, 18, [4, 4, 0, 0]);
          ctx.fill();
          // Título em folha dourada e estrelas na capa
          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 9px Georgia, serif';
          ctx.fillText('✦ CONTOS DE NINAR ✦', sx + 8, p.y + 12);
          // Fita marcadora de seda pendurada
          ctx.fillStyle = '#e11d48';
          ctx.fillRect(sx + p.w - 24, p.y + 16, 6, 24);
          break;
        }

        case 'vanity_table': {
          // 3. Penteadeira com Espelho Encantado
          // Base de madeira entalhada da mesa
          ctx.fillStyle = '#581c87';
          ctx.fillRect(sx, p.y + 20, p.w, p.h - 20);
          ctx.fillStyle = '#6b21a8';
          ctx.fillRect(sx - 4, p.y + 12, p.w + 8, 10);

          // Espelho oval trabalhado erguido ao fundo
          ctx.fillStyle = '#e9d5ff';
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y - 14, 28, 32, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Reflexo mágico dentro do espelho
          const mirrorGrad = ctx.createLinearGradient(sx + 20, p.y - 40, sx + p.w - 20, p.y + 10);
          mirrorGrad.addColorStop(0, 'rgba(192, 132, 252, 0.4)');
          mirrorGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
          mirrorGrad.addColorStop(1, 'rgba(6, 182, 212, 0.3)');
          ctx.fillStyle = mirrorGrad;
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y - 14, 24, 28, 0, 0, Math.PI * 2);
          ctx.fill();

          // Pequenos frascos de perfume sobre o tampo da mesa
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(sx + 8, p.y + 2, 7, 10);
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(sx + p.w - 16, p.y + 2, 8, 10);

          // Colar de pérolas pendurado sobre a gaveta
          ctx.fillStyle = '#f8fafc';
          for (let b = 0; b < 7; b++) {
            ctx.beginPath();
            ctx.arc(sx + 25 + b * 5, p.y + 26 + Math.sin(b * 0.5) * 6, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case 'small_dresser':
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

        case 'messy_blocks': {
          // 5. Pilha Desordenada de Blocos ABC
          // Pilha empilhada de grandes blocos de madeira
          const bW = 36;
          const bH = 34;

          // Bloco 1: Vermelho 'A'
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(sx + 4, p.y + 24, bW, bH);
          ctx.strokeStyle = '#b91c1c';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx + 4, p.y + 24, bW, bH);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText('A', sx + 14, p.y + 48);

          // Bloco 2: Azul 'B'
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(sx + 42, p.y + 28, bW, bH);
          ctx.strokeStyle = '#1d4ed8';
          ctx.strokeRect(sx + 42, p.y + 28, bW, bH);
          ctx.fillStyle = '#ffffff';
          ctx.fillText('B', sx + 52, p.y + 52);

          // Bloco 3: Amarelo 'C'
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx + 80, p.y + 24, bW - 4, bH);
          ctx.strokeStyle = '#a16207';
          ctx.strokeRect(sx + 80, p.y + 24, bW - 4, bH);
          ctx.fillStyle = '#1e1b4b';
          ctx.fillText('C', sx + 88, p.y + 48);

          // Bloco superior de plataforma de apoio
          ctx.fillStyle = '#10b981';
          ctx.fillRect(sx + 16, p.y, p.w - 32, 24);
          ctx.strokeStyle = '#047857';
          ctx.strokeRect(sx + 16, p.y, p.w - 32, 24);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('★ 1 2 3 ★', sx + 24, p.y + 16);
          break;
        }

        case 'toy_drum': {
          // 6. Tamborito de Marcha
          // Corpo do tambor
          ctx.fillStyle = '#b91c1c';
          ctx.fillRect(sx, p.y + 14, p.w, p.h - 14);

          // Cordas de tensão em zigue-zague
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let z = 0; z < p.w; z += 18) {
            ctx.lineTo(sx + z, p.y + 16 + ((z / 18) % 2 === 0 ? 0 : p.h - 30));
          }
          ctx.stroke();

          // Aro inferior de latão
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(sx - 2, p.y + p.h - 12, p.w + 4, 10);

          // Pele superior branca do tambor (superfície de pouso)
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(sx, p.y + 4, p.w, 10);
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(sx - 4, p.y, p.w + 8, 6);

          // Baquetas de madeira cruzadas
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(sx + 12, p.y + 2); ctx.lineTo(sx + p.w - 12, p.y + 10);
          ctx.moveTo(sx + 12, p.y + 10); ctx.lineTo(sx + p.w - 12, p.y + 2);
          ctx.stroke();
          break;
        }

        case 'satin_cushion': {
          // 7. Almofadão de Veludo com Borlas
          // Almofadão fofo de veludo capitonê
          const cushGrad = ctx.createRadialGradient(
            sx + p.w / 2, p.y + 16, 12,
            sx + p.w / 2, p.y + 16, p.w / 2
          );
          cushGrad.addColorStop(0, '#c026d3');
          cushGrad.addColorStop(0.7, '#86198f');
          cushGrad.addColorStop(1, '#4a044e');
          ctx.fillStyle = cushGrad;
          ctx.beginPath();
          ctx.roundRect(sx, p.y, p.w, p.h, 16);
          ctx.fill();

          // Botões dourados de capitonê
          ctx.fillStyle = '#facc15';
          const btnX = [sx + 24, sx + p.w / 2, sx + p.w - 24];
          btnX.forEach(bx => {
            ctx.beginPath();
            ctx.arc(bx, p.y + 18, 3.5, 0, Math.PI * 2);
            ctx.fill();
            // Rugas e dobras irradiando a partir do botão
            ctx.strokeStyle = 'rgba(74, 4, 78, 0.4)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(bx, p.y + 18); ctx.lineTo(bx - 8, p.y + 6);
            ctx.moveTo(bx, p.y + 18); ctx.lineTo(bx + 8, p.y + 6);
            ctx.stroke();
          });

          // Borlas douradas nos cantos
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(sx + 4, p.y + 4, 4, 0, Math.PI * 2);
          ctx.arc(sx + p.w - 4, p.y + 4, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'stepped_dresser': {
          // 8. Gavetas da Cômoda como Degraus
          // Estrutura da cômoda
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx, p.y, p.w, p.h);

          // Gaveta superior aberta (degrau mais alto)
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 6, p.y, p.w + 12, 18);
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 9, 3, 0, Math.PI * 2);
          ctx.fill();

          // Segunda gaveta puxada para a frente
          ctx.fillStyle = '#5f2709';
          ctx.fillRect(sx + 8, p.y + 24, p.w - 8, 22);
          // Meias coloridas penduradas na gaveta
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(sx + 22, p.y + 36, 12, 14);
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(sx + 40, p.y + 34, 10, 18);
          break;
        }

        case 'music_box': {
          // 9. Caixa de Música da Bailarina
          // Caixa de mogno
          ctx.fillStyle = '#422006';
          ctx.fillRect(sx, p.y + 16, p.w, p.h - 16);
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx, p.y + 16, p.w, p.h - 16);

          // Clave de sol dourada e notas musicais entalhadas na frente
          ctx.fillStyle = '#facc15';
          ctx.font = '14px sans-serif';
          ctx.fillText('♫ 𝄞 ♬', sx + p.w / 2 - 20, p.y + 44);

          // Plataforma superior de latão
          ctx.fillStyle = '#d97706';
          ctx.fillRect(sx - 2, p.y + 8, p.w + 4, 8);

          // Chave dourada de corda giratória na lateral
          const keyAngle = tick * 0.05;
          ctx.save();
          ctx.translate(sx - 8, p.y + 32);
          ctx.rotate(keyAngle);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, -6, 5, 0, Math.PI * 2);
          ctx.moveTo(0, -1); ctx.lineTo(0, 8);
          ctx.stroke();
          ctx.restore();

          // Bailarina de porcelana em miniatura rodopiando
          const bPhase = Math.sin(tick * 0.08);
          ctx.fillStyle = '#fce7f3';
          ctx.beginPath();
          // Tutu da bailarina
          ctx.ellipse(sx + p.w / 2, p.y + 2, 12 * Math.abs(bPhase) + 4, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          // Tronco e cabeça da bailarina
          ctx.fillStyle = '#fdf2f8';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y - 10, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'block_castle': {
          // The narrow central tower is the only landing area. Lower wings
          // remain visibly below it instead of suggesting a 150px-wide top.
          const support = p.standRegion || p;
          const top = p.surfaceTopY ?? support.y ?? p.y;
          const base = Math.min(FLOOR_Y, p.y + p.h);
          const tier = (x, y, w, h) => {
            ctx.fillStyle = '#756575'; ctx.fillRect(x, y, w, h);
            ctx.fillStyle = '#a09199'; ctx.fillRect(x, y, w, 3);
            ctx.fillStyle = '#43374a'; ctx.fillRect(x + w - 5, y + 3, 5, h - 3);
            ctx.strokeStyle = '#544557'; ctx.lineWidth = 1;
            for (let row = y + 14; row < y + h; row += 14) {
              ctx.beginPath(); ctx.moveTo(x, row); ctx.lineTo(x + w, row); ctx.stroke();
              for (let col = x + (Math.round((row-y)/14)%2 ? 9 : 18); col < x+w-5; col += 18) {
                ctx.beginPath();ctx.moveTo(col,row-13);ctx.lineTo(col,row);ctx.stroke();
              }
            }
          };
          tier(sx, top + 105, p.w, base - top - 105);
          tier(sx + 22, top + 62, p.w - 44, base - top - 62);
          const towerX = sx + support.x - p.x;
          tier(towerX, top, support.w, base - top);
          ctx.fillStyle = '#c1a286';ctx.fillRect(towerX,top,support.w,3);
          ctx.fillStyle = '#241f32';
          for (const y of [top+24,top+65,top+106]) ctx.fillRect(towerX+support.w/2-3,y,6,12);
          ctx.fillStyle = '#302839';ctx.fillRect(sx+p.w/2-12,base-38,24,38);
          ctx.strokeStyle = '#a8bac3';ctx.lineWidth = 2;
          ctx.beginPath();ctx.moveTo(sx+12,top+105);ctx.lineTo(sx+12,top+69);ctx.stroke();
          ctx.fillStyle = '#2582a9';ctx.beginPath();ctx.moveTo(sx+13,top+69);
          ctx.lineTo(sx+32,top+75+Math.sin(tick*0.08)*2);ctx.lineTo(sx+13,top+82);ctx.fill();
          break;
        }

        case 'train_trestle': {
          // 11. Pista Elevada do Trenzinho
          // Pilares de cavalete de madeira da ferrovia
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(sx + 16, p.y + 12); ctx.lineTo(sx + 16, p.y + p.h);
          ctx.moveTo(sx + p.w - 16, p.y + 12); ctx.lineTo(sx + p.w - 16, p.y + p.h);
          // Travessas diagonais cruzadas
          ctx.moveTo(sx + 16, p.y + 20); ctx.lineTo(sx + p.w - 16, p.y + 50);
          ctx.moveTo(sx + p.w - 16, p.y + 20); ctx.lineTo(sx + 16, p.y + 50);
          ctx.stroke();

          // Dormentes de madeira
          ctx.fillStyle = '#92400e';
          for (let rx = 0; rx < p.w; rx += 14) {
            ctx.fillRect(sx + rx, p.y + 4, 10, 8);
          }
          // Trilhos de aço
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(sx, p.y, p.w, 4);

          // Locomotiva de brinquedo colorida estacionada
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(sx + p.w / 2 - 14, p.y - 14, 28, 14);
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx + p.w / 2 - 8, p.y - 20, 6, 6);
          break;
        }

        case 'wall_shelf': {
          // 12. Prateleira de Brinquedos da Parede
          // Prateleira robusta de pinho
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx, p.y, p.w, 14);
          ctx.fillStyle = '#92400e';
          ctx.fillRect(sx, p.y + 14, p.w, p.h - 14);

          // Suportes decorativos de ferro forjado
          ctx.strokeStyle = '#18181b';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(sx + 14, p.y + 14);
          ctx.quadraticCurveTo(sx + 24, p.y + 36, sx + 14, p.y + 50);
          ctx.moveTo(sx + p.w - 14, p.y + 14);
          ctx.quadraticCurveTo(sx + p.w - 24, p.y + 36, sx + p.w - 14, p.y + 50);
          ctx.stroke();

          // Itens decorativos sobre a prateleira
          // Globo de neve
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.strokeStyle = '#93c5fd';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(sx + 28, p.y - 12, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Relógio despertador
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(sx + p.w - 26, p.y - 9, 8, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'mushroom_lamp': {
          // 13. Abajur Cogumelo Brilhante
          // Chapéu brilhante do cogumelo com bolinhas
          const lampGrad = ctx.createRadialGradient(
            sx + p.w / 2, p.y + 10, 10,
            sx + p.w / 2, p.y + 10, p.w / 2
          );
          lampGrad.addColorStop(0, '#fda4af');
          lampGrad.addColorStop(0.5, '#f43f5e');
          lampGrad.addColorStop(1, '#9f1239');
          ctx.fillStyle = lampGrad;
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y + 12, p.w / 2, 16, 0, 0, Math.PI * 2);
          ctx.fill();

          // Bolinhas brancas
          ctx.fillStyle = '#fff1f2';
          const dots = [
            { x: sx + 22, y: p.y + 8, r: 4 },
            { x: sx + p.w / 2, y: p.y + 6, r: 5 },
            { x: sx + p.w - 24, y: p.y + 9, r: 4 },
            { x: sx + 40, y: p.y + 16, r: 3.5 }
          ];
          dots.forEach(d => {
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
          });

          // Brilho suave da lâmpada sob o chapéu do cogumelo
          ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y + 18, p.w / 2 - 8, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Haste do cogumelo
          ctx.fillStyle = '#fdf4ff';
          ctx.fillRect(sx + p.w / 2 - 12, p.y + 20, 24, p.h - 20);
          break;
        }

        case 'dollhouse_roof': {
          // 14. Telhado da Casa de Bonecas
          // Telhado de telhas onduladas
          ctx.fillStyle = '#be123c';
          ctx.fillRect(sx, p.y, p.w, p.h);

          // Telhas em miniatura onduladas
          ctx.fillStyle = '#9f1239';
          for (let sy = p.y + 8; sy < p.y + p.h; sy += 12) {
            for (let shx = sx; shx < sx + p.w; shx += 16) {
              ctx.beginPath();
              ctx.arc(shx + 8, sy, 8, 0, Math.PI);
              ctx.fill();
            }
          }

          // Chaminé de tijolos em miniatura
          ctx.fillStyle = '#b91c1c';
          ctx.fillRect(sx + p.w - 24, p.y - 18, 16, 24);
          ctx.fillStyle = '#450a0a';
          ctx.fillRect(sx + p.w - 26, p.y - 20, 20, 4);

          // Mansarda / claraboia
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(sx + 30, p.y + 16, 8, Math.PI, 0);
          ctx.rect(sx + 22, p.y + 16, 16, 12);
          ctx.fill();
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

        case 'spinning_globe': {
          // 5/12 Globo Terrestre Ilustrado
          ctx.fillStyle = '#3f1d0b';
          ctx.fillRect(sx + 10, p.y + p.h - 18, p.w - 20, 18);
          ctx.fillStyle = '#5c2b10';
          ctx.fillRect(sx + 20, p.y + p.h - 32, p.w - 40, 14);

          // Arco semi-meridiano de latão
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 44, 34, 0.4, Math.PI - 0.4);
          ctx.stroke();

          // Esfera do globo
          const gx = sx + p.w / 2;
          const gy = p.y + 42;
          const globeGrad = ctx.createRadialGradient(gx - 8, gy - 8, 4, gx, gy, 30);
          globeGrad.addColorStop(0, '#38bdf8');
          globeGrad.addColorStop(0.7, '#0284c7');
          globeGrad.addColorStop(1, '#0369a1');
          ctx.fillStyle = globeGrad;
          ctx.beginPath();
          ctx.arc(gx, gy, 28, 0, Math.PI * 2);
          ctx.fill();

          // Continentes verdes
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.ellipse(gx - 8, gy - 6, 10, 7, 0.3, 0, Math.PI * 2);
          ctx.ellipse(gx + 10, gy + 8, 8, 5, -0.2, 0, Math.PI * 2);
          ctx.fill();

          // Barra superior de latão da plataforma
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx + 4, p.y, p.w - 8, 12);
          ctx.fillStyle = '#ca8a04';
          ctx.fillRect(sx, p.y + 12, p.w, 4);
          break;
        }

        case 'kite_frame': {
          // 6/12 Pipa Encantada de Bambu
          ctx.fillStyle = '#fde047';
          ctx.fillRect(sx, p.y, p.w, 10);

          const kx = sx + p.w / 2;
          const ky = p.y + 24;
          ctx.save();
          // 4 vivid segments
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.moveTo(kx, ky - 18);
          ctx.lineTo(kx + p.w / 2 - 6, ky);
          ctx.lineTo(kx, ky);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.moveTo(kx, ky - 18);
          ctx.lineTo(kx - p.w / 2 + 6, ky);
          ctx.lineTo(kx, ky);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.moveTo(kx, ky);
          ctx.lineTo(kx - p.w / 2 + 6, ky);
          ctx.lineTo(kx, ky + 32);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.moveTo(kx, ky);
          ctx.lineTo(kx + p.w / 2 - 6, ky);
          ctx.lineTo(kx, ky + 32);
          ctx.closePath();
          ctx.fill();

          // Varetas cruzadas de bambu
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(kx, ky - 18);
          ctx.lineTo(kx, ky + 32);
          ctx.moveTo(kx - p.w / 2 + 6, ky);
          ctx.lineTo(kx + p.w / 2 - 6, ky);
          ctx.stroke();

          // Cauda de fita ondulando
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          const sway = Math.sin(tick * 0.12) * 8;
          ctx.moveTo(kx, ky + 32);
          ctx.quadraticCurveTo(kx + sway, ky + 55, kx - sway * 0.5, ky + 80);
          ctx.stroke();

          ctx.fillStyle = '#fb923c';
          ctx.fillRect(kx + sway * 0.5 - 4, ky + 46, 8, 4);
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(kx - 4, ky + 66, 8, 4);
          ctx.restore();
          break;
        }

        case 'floating_books': {
          // 7/12 Livro de Gravuras Flutuante
          ctx.fillStyle = '#831843';
          ctx.beginPath();
          ctx.roundRect(sx, p.y, p.w, 14, [4, 4, 2, 2]);
          ctx.fill();

          // Bloco de páginas douradas
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx + 6, p.y + 3, p.w - 12, 8);

          // Páginas abertas de pergaminho
          ctx.fillStyle = '#fdf4ff';
          ctx.fillRect(sx + 8, p.y + 4, (p.w - 20) / 2, 6);
          ctx.fillRect(sx + p.w / 2 + 2, p.y + 4, (p.w - 20) / 2, 6);

          // Nervuras da lombada
          ctx.fillStyle = '#500724';
          ctx.fillRect(sx + p.w / 2 - 3, p.y, 6, 14);

          // Fita marcadora de página dourada ondulando
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(sx + p.w / 2, p.y + 12);
          ctx.quadraticCurveTo(sx + p.w / 2 + 8, p.y + 35, sx + p.w / 2 - 4, p.y + 50);
          ctx.stroke();

          // Runas feéricas flutuantes
          ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
          ctx.font = '10px sans-serif';
          ctx.fillText('✧', sx + 12, p.y - 6);
          ctx.fillText('✦', sx + p.w - 18, p.y - 8);
          break;
        }

        case 'chandelier_crystals': {
          // 8/12 Lustre de Cristais
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx, p.y, p.w, 12);
          ctx.fillStyle = '#ca8a04';
          ctx.fillRect(sx, p.y + 12, p.w, 5);

          // Cristais multifacetados pendurados
          for (let cx = sx + 8; cx <= sx + p.w - 8; cx += 13) {
            ctx.fillStyle = 'rgba(224, 242, 254, 0.88)';
            ctx.strokeStyle = '#bae6fd';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx, p.y + 17);
            ctx.lineTo(cx + 4, p.y + 28);
            ctx.lineTo(cx, p.y + 36);
            ctx.lineTo(cx - 4, p.y + 28);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          // Chamas das velas
          const flame = Math.sin(tick * 0.25) * 2;
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.ellipse(sx + 14, p.y - 6, 3, 5 + flame, 0, 0, Math.PI * 2);
          ctx.ellipse(sx + p.w - 14, p.y - 6, 3, 5 + flame, 0, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'curtain_rod': {
          // 9/12 Varão de Cortina Estrelada
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx, p.y, p.w, 10);
          ctx.fillStyle = '#b45309';
          ctx.fillRect(sx, p.y + 10, p.w, 4);

          // Ponteiras douradas decorativas
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(sx - 4, p.y + 5, 7, 0, Math.PI * 2);
          ctx.arc(sx + p.w + 4, p.y + 5, 7, 0, Math.PI * 2);
          ctx.fill();

          // Bandô de cortina de veludo
          ctx.fillStyle = '#1e1b4b';
          ctx.beginPath();
          ctx.moveTo(sx + 4, p.y + 14);
          ctx.quadraticCurveTo(sx + p.w / 2, p.y + 44, sx + p.w - 4, p.y + 14);
          ctx.lineTo(sx + p.w - 4, p.y + 56);
          ctx.quadraticCurveTo(sx + p.w / 2, p.y + 76, sx + 4, p.y + 56);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#fde047';
          ctx.font = '10px sans-serif';
          ctx.fillText('★', sx + p.w / 2 - 5, p.y + 40);
          break;
        }

        case 'cuckoo_clock': {
          // 10/12 Relógio Cuco Vintage
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx, p.y, p.w, 12);
          ctx.fillStyle = '#92400e';
          ctx.fillRect(sx + 6, p.y + 12, p.w - 12, p.h - 12);

          // Mostrador do relógio
          ctx.fillStyle = '#fef3c7';
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 40, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Ponteiros
          ctx.strokeStyle = '#18181b';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(sx + p.w / 2, p.y + 40);
          ctx.lineTo(sx + p.w / 2, p.y + 29);
          ctx.moveTo(sx + p.w / 2, p.y + 40);
          ctx.lineTo(sx + p.w / 2 + 7, p.y + 40);
          ctx.stroke();

          // Portinha do cuco
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx + p.w / 2 - 8, p.y + 14, 16, 11);
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 19, 4, 0, Math.PI * 2);
          ctx.fill();

          // Pêndulo balançando
          const pendAngle = Math.sin(tick * 0.08) * 0.28;
          const pendLen = 30;
          const px = sx + p.w / 2 + Math.sin(pendAngle) * pendLen;
          const py = p.y + 62 + Math.cos(pendAngle) * pendLen;
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(sx + p.w / 2, p.y + 62);
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(px, py, 5.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'wardrobe_ledge': {
          // 11/12 Beiral do Grande Guarda-Roupa (Antes do Clímax)
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx, p.y, p.w, p.h);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 4, p.y, p.w + 8, 10);

          // Reforços de canto em latão
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx, p.y + 10, 8, 8);
          ctx.fillRect(sx + p.w - 8, p.y + 10, 8, 8);

          // Aviso de clímax
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚡ SALTO FINAL ➔', sx + p.w / 2, p.y - 12);
          break;
        }

        case 'grand_portal_pedestal': {
          // 12/12 O Portal dos Sonhos (O Clímax Alcançado!)
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(sx, p.y, p.w, p.h);

          // Terraço dourado superior
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx - 8, p.y - 4, p.w + 16, 12);
          ctx.fillStyle = '#ca8a04';
          ctx.fillRect(sx - 4, p.y + 8, p.w + 8, 8);

          // Runas Mana folheadas a ouro ao longo do terraço
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx + 12, p.y + 22, p.w - 24, 30);

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 13px Palatino, Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillText('✧   O   GRANDE   PORTAL   DOS   SONHOS   ✧', sx + p.w / 2, p.y + 42);

          // Pilares e tocheiras nas duas extremidades
          const torchLeftX = sx + 22;
          const torchRightX = sx + p.w - 22;
          [torchLeftX, torchRightX].forEach(tx => {
            ctx.fillStyle = '#78350f';
            ctx.fillRect(tx - 6, p.y - 28, 12, 28);
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(tx, p.y - 32, 9, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }

        // ==========================================
        // FASE 3: PLATAFORMAS CAÓTICAS (15 BRINQUEDOS)
        // ==========================================
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

      // Brilho Direcional sutil e suave restrito EXCLUSIVAMENTE à borda superior
      if (alpha > 0.05) {
        // Estado ativado ao pousar: confirmação acolhedora e calorosa
        ctx.strokeStyle = isMagicalPhase
          ? `rgba(245, 208, 254, ${0.45 + 0.50 * alpha})`
          : `rgba(254, 240, 138, ${0.45 + 0.50 * alpha})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = isMagicalPhase
          ? 'rgba(216, 180, 254, 0.75)'
          : 'rgba(250, 204, 21, 0.85)';
        ctx.shadowBlur = 6 * alpha;
      } else {
        // Estado inicial na penumbra: luz guia direcional sutil para cálculo do salto
        ctx.strokeStyle = isMagicalPhase
          ? 'rgba(233, 213, 255, 0.38)'
          : 'rgba(254, 240, 138, 0.38)';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = isMagicalPhase
          ? 'rgba(192, 132, 252, 0.22)'
          : 'rgba(250, 204, 21, 0.22)';
        ctx.shadowBlur = 2.5;
      }
      ctx.beginPath();
      ctx.moveTo(sxBox + 1, platY + 0.7);
      ctx.lineTo(sxBox + platW - 1, platY + 0.7);
      ctx.stroke();
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
    const tick = options.tick || 0;

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

      // Pôster descolando e caindo
      ctx.save();
      ctx.translate(sx + exitDoor.w / 2, exitDoor.y + fakeDoorSlideY + exitDoor.h / 2);
      ctx.rotate(fakeDoorRotation);
      ctx.translate(-exitDoor.w / 2, -exitDoor.h / 2);

      // Sombra do papel do pôster
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(4, 6, exitDoor.w, exitDoor.h);

      // Verso enrolado do papel do pôster
      ctx.fillStyle = '#f5f5f4';
      ctx.fillRect(0, 0, exitDoor.w, exitDoor.h);

      // Ilustração da porta pintada no pôster
      ctx.fillStyle = '#db2777';
      ctx.fillRect(4, 4, exitDoor.w - 8, exitDoor.h - 8);
      const vitral = ctx.createLinearGradient(0, 0, 0, exitDoor.h);
      vitral.addColorStop(0, '#fde047');
      vitral.addColorStop(0.5, '#f43f5e');
      vitral.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = vitral;
      ctx.fillRect(10, 10, exitDoor.w - 20, exitDoor.h - 20);

      // Canto dobrado em orelha de livro
      ctx.fillStyle = '#e7e5e4';
      ctx.beginPath();
      ctx.moveTo(exitDoor.w - 16, 0);
      ctx.lineTo(exitDoor.w, 16);
      ctx.lineTo(exitDoor.w - 16, 16);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    } else {
      // Porta de saída normal majestosa e brilhante
      const pulse = Math.sin(tick * 0.05) * 18;
      const glow = ctx.createRadialGradient(
        sx + exitDoor.w / 2, exitDoor.y + exitDoor.h / 2, 12,
        sx + exitDoor.w / 2, exitDoor.y + exitDoor.h / 2, 140 + pulse
      );
      glow.addColorStop(0, 'rgba(255, 240, 160, 0.95)');
      glow.addColorStop(0.35, 'rgba(255, 80, 200, 0.55)');
      glow.addColorStop(0.7, 'rgba(0, 230, 255, 0.3)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(sx - 100, exitDoor.y - 80, exitDoor.w + 200, exitDoor.h + 160);

      // Moldura entalhada da porta
      ctx.fillStyle = '#db2777';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.roundRect(sx, exitDoor.y, exitDoor.w, exitDoor.h, [42, 42, 6, 6]);
      ctx.fill();
      ctx.stroke();

      // Arco de vitral colorido
      const vitral = ctx.createLinearGradient(sx, exitDoor.y, sx, exitDoor.y + exitDoor.h);
      vitral.addColorStop(0, '#fde047');
      vitral.addColorStop(0.3, '#f43f5e');
      vitral.addColorStop(0.65, '#8b5cf6');
      vitral.addColorStop(1, '#06b6d4');
      ctx.fillStyle = vitral;
      ctx.beginPath();
      ctx.roundRect(sx + 8, exitDoor.y + 12, exitDoor.w - 16, exitDoor.h - 18, [34, 34, 4, 4]);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '22px sans-serif';
      ctx.fillText('✨', sx + exitDoor.w / 2 - 12, exitDoor.y + 40);
      ctx.fillText('🌿', sx + exitDoor.w / 2 - 12, exitDoor.y + 82);
    }

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
