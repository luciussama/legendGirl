/**
 * AtlasDebugger.js
 * Ferramenta visual de depuração para inspeção e teste de todas as regiões do darkRoomAtlas.
 * Permite visualizar cada sprite individualmente, verificar limites e confirmar ausência de cortes.
 */

import { darkRoomAtlas, SHEET_WIDTH, SHEET_HEIGHT, validateAtlasRegion } from '../assets/darkRoomAtlas.js';

export class AtlasDebugger {
  constructor(options = {}) {
    this.assets = options.assets || null;
    this.sheetKey = options.sheetKey || 'dark-room-environment-sheet';
    this.isOpen = false;
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.selectedKey = 'all';
    this.validationResults = [];
  }

  setAssets(assets) {
    this.assets = assets;
  }

  /**
   * Executa a bateria de testes de limites e integridade em todas as 27 regiões.
   */
  validateAllRegions() {
    const results = [];
    const entries = Object.entries(darkRoomAtlas);

    for (const [key, region] of entries) {
      const isValid = validateAtlasRegion(region, SHEET_WIDTH, SHEET_HEIGHT);
      const boundsError = region.x < 0 || region.y < 0
        ? 'Coordenada negativa'
        : (region.x + region.width > SHEET_WIDTH || region.y + region.height > SHEET_HEIGHT)
          ? 'Ultrapassa limites do sheet'
          : (region.width <= 0 || region.height <= 0)
            ? 'Dimensão inválida'
            : null;

      results.push({
        key,
        label: region.label || key,
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height,
        valid: isValid,
        error: boundsError
      });

      // Valida sub-regiões se existirem
      if (region.items) {
        for (const [subKey, subRegion] of Object.entries(region.items)) {
          const subValid = validateAtlasRegion(subRegion, SHEET_WIDTH, SHEET_HEIGHT);
          const subError = subRegion.x < 0 || subRegion.y < 0
            ? 'Coordenada negativa'
            : (subRegion.x + subRegion.width > SHEET_WIDTH || subRegion.y + subRegion.height > SHEET_HEIGHT)
              ? 'Ultrapassa limites'
              : null;
          results.push({
            key: `${key}.${subKey}`,
            label: `${region.label} > ${subRegion.label || subKey}`,
            x: subRegion.x,
            y: subRegion.y,
            width: subRegion.width,
            height: subRegion.height,
            valid: subValid,
            error: subError
          });
        }
      }
    }

    this.validationResults = results;
    return results;
  }

  /**
   * Cria os elementos DOM da interface de depuração do atlas
   */
  initDOM() {
    if (this.container || typeof document === 'undefined') return;

    const overlay = document.createElement('div');
    overlay.id = 'atlas-debug-overlay';
    overlay.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(10, 15, 29, 0.95);
      backdrop-filter: blur(8px);
      z-index: 99999;
      overflow-y: auto;
      color: #e2e8f0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      padding: 20px;
      box-sizing: border-box;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      padding-bottom: 12px;
      margin-bottom: 16px;
    `;
    header.innerHTML = `
      <div>
        <h2 style="margin: 0; font-size: 20px; color: #38bdf8;">🗺️ Dark Room Atlas Inspector (Fase 1)</h2>
        <span style="font-size: 13px; color: #94a3b8;">Asset: environment-assets.png (1536 × 1024) | 27 Regiões Mapeadas</span>
      </div>
      <button id="atlas-debug-close" style="
        background: #ef4444;
        color: #fff;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
      ">✕ Fechar (Esc)</button>
    `;

    const controls = document.createElement('div');
    controls.style.cssText = 'margin-bottom: 16px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center;';
    controls.innerHTML = `
      <span style="font-size: 13px; color: #e2e8f0; font-weight: bold;">Status da Validação:</span>
      <span id="atlas-test-status" style="background: #10b981; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">
        Verificando...
      </span>
      <span style="color: #64748b; font-size: 12px;">| Atalho: Shift + A para abrir/fechar</span>
    `;

    const canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = `
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
    `;

    const canvas = document.createElement('canvas');
    canvas.id = 'atlas-debug-canvas';
    canvasContainer.appendChild(canvas);

    overlay.appendChild(header);
    overlay.appendChild(controls);
    overlay.appendChild(canvasContainer);
    document.body.appendChild(overlay);

    this.container = overlay;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    const closeBtn = document.getElementById('atlas-debug-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.toggle(false));
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.toggle(false);
      } else if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        this.toggle();
      }
    });
  }

  toggle(forceState = null) {
    this.initDOM();
    this.isOpen = forceState !== null ? forceState : !this.isOpen;
    if (this.container) {
      this.container.style.display = this.isOpen ? 'block' : 'none';
    }
    if (this.isOpen) {
      this.render();
    }
  }

  render() {
    if (!this.canvas || !this.ctx) return;

    const results = this.validateAllRegions();
    const allValid = results.every(r => r.valid);
    const statusEl = document.getElementById('atlas-test-status');
    if (statusEl) {
      if (allValid) {
        statusEl.textContent = `✅ 100% APROVADO: ${results.length} regiões testadas (0 overflow, 0 negativas, 0 cortadas)`;
        statusEl.style.background = '#059669';
      } else {
        statusEl.textContent = `❌ FALHA NA VALIDAÇÃO`;
        statusEl.style.background = '#dc2626';
      }
    }

    const sheet = this.assets ? (this.assets.get('dark-room-production-spritesheet') || this.assets.get(this.sheetKey)) : null;
    const padding = 16;
    const cardWidth = 320;
    const cardHeight = 260;
    const columns = 4;
    const totalItems = results.length;
    const rows = Math.ceil(totalItems / columns);

    const canvasWidth = columns * (cardWidth + padding) + padding;
    const canvasHeight = rows * (cardHeight + padding) + padding;

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    const ctx = this.ctx;

    // Fundo geral do grid
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    results.forEach((item, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const cardX = padding + col * (cardWidth + padding);
      const cardY = padding + row * (cardHeight + padding);

      // Cartão
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = item.valid ? '#3b82f6' : '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 8);
      ctx.fill();
      ctx.stroke();

      // Cabeçalho do cartão
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText(item.label, cardX + 10, cardY + 22);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px ui-monospace, monospace';
      ctx.fillText(`key: ${item.key}`, cardX + 10, cardY + 38);
      ctx.fillText(`x:${item.x} y:${item.y} w:${item.width} h:${item.height}`, cardX + 10, cardY + 52);

      // Área do Sprite
      const spriteAreaX = cardX + 10;
      const spriteAreaY = cardY + 62;
      const spriteAreaW = cardWidth - 20;
      const spriteAreaH = cardHeight - 74;

      // Fundo xadrez para verificar transparência alfa
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(spriteAreaX, spriteAreaY, spriteAreaW, spriteAreaH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(spriteAreaX, spriteAreaY, spriteAreaW, spriteAreaH);

      if (sheet) {
        // Obter região
        const regCanvas = this.assets ? (
          this.assets.get('dark-room-sprite-' + item.key.replace(/_/g, '-')) ||
          this.assets.getRegion('dark-room-production-spritesheet', item) ||
          this.assets.getRegion(this.sheetKey, item)
        ) : null;
        if (regCanvas) {
          const scale = Math.min((spriteAreaW - 16) / item.width, (spriteAreaH - 16) / item.height, 1.2);
          const dw = item.width * scale;
          const dh = item.height * scale;
          const dx = spriteAreaX + (spriteAreaW - dw) / 2;
          const dy = spriteAreaY + (spriteAreaH - dh) / 2;

          ctx.drawImage(regCanvas, dx, dy, dw, dh);
        } else {
          ctx.fillStyle = '#f59e0b';
          ctx.font = '12px sans-serif';
          ctx.fillText('Região vazia / Erro', spriteAreaX + 20, spriteAreaY + spriteAreaH / 2);
        }
      } else {
        ctx.fillStyle = '#64748b';
        ctx.font = '12px sans-serif';
        ctx.fillText('Asset carregando...', spriteAreaX + 20, spriteAreaY + spriteAreaH / 2);
      }

      // Selo de status
      ctx.fillStyle = item.valid ? '#10b981' : '#ef4444';
      ctx.beginPath();
      ctx.roundRect(cardX + cardWidth - 68, cardY + 10, 58, 18, 4);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(item.valid ? '✓ OK' : '✕ ERRO', cardX + cardWidth - 56, cardY + 23);
    });
  }
}

export function createAtlasDebugger(options) {
  const debuggerInstance = new AtlasDebugger(options);
  if (typeof window !== 'undefined') {
    window.darkRoomAtlasDebugger = debuggerInstance;
    window.toggleAtlasDebug = () => debuggerInstance.toggle();
  }
  return debuggerInstance;
}
