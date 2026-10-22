const ART = new URL('../../../assets/art/title-screen/', import.meta.url);

// Poltrona e tapete pertencem à mesma composição, em coordenadas do quarto.
export const TITLE_SCENE_LAYOUT = Object.freeze({ width: 1920, height: 1080,
  chairX: 1056, chairY: 162, chairScale: Math.min(1920 * .43 / 701, 1080 * .78 / 703) });

/** Reenquadra o quarto inteiro: no retrato, o recorte se aproxima da menina. */
export function titleSceneFrame(width, height) {
  const scale = Math.max(width / TITLE_SCENE_LAYOUT.width, height / TITLE_SCENE_LAYOUT.height);
  const portrait = Math.max(0, Math.min(1, (16 / 9 - width / height) / (16 / 9 - 1)));
  const focusX = 960 + (1460 - 960) * portrait;
  return { scale, x: Math.max(width - 1920 * scale, Math.min(0, width / 2 - focusX * scale)),
    y: (height - 1080 * scale) / 2 };
}

/** Apresenta a cena ilustrada do menu sem depender da simulação nem dos sprites de gameplay. */
export class TitleScene {
  /** Observa somente a visibilidade do menu; a animação para ao iniciar a partida ou ocultar a aba. */
  constructor(canvas, overlay) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.overlay = overlay;
    this.images = {}; this.frame = null; this.disposed = false;
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.sync = this.sync.bind(this); this.tick = this.tick.bind(this);
    this.observer = new MutationObserver(this.sync);
    this.observer.observe(overlay, { attributes: true, attributeFilter: ['class', 'style'] });
    this.resize = new ResizeObserver(this.sync); this.resize.observe(overlay);
    document.addEventListener('visibilitychange', this.sync);
    this.motion.addEventListener('change', this.sync);
  }

  /** Carrega as duas pinturas locais; uma falha deixa o menu operacional com o fundo CSS. */
  async load() {
    try {
      await Promise.all([['room', 'reading-room-v1.png'], ['girl', 'reading-girl-layers-v1.png']].map(async ([key, name]) => {
        const image = new Image(); image.src = new URL(name, ART).href; await image.decode();
        if (!this.disposed) this.images[key] = image;
      }));
      this.sync();
    } catch (error) {
      console.warn('Não foi possível preparar a ilustração animada do menu:', error.message);
    }
  }

  /** Mantém no máximo um RAF e respeita a preferência de movimento reduzido. */
  sync() {
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
    if (this.disposed || document.hidden || this.overlay.classList.contains('hidden') || this.overlay.style.display === 'none') return;
    if (!this.images.room || !this.images.girl) return;
    this.render(this.motion.matches ? 0 : performance.now() / 1000);
    if (!this.motion.matches) this.frame = requestAnimationFrame(this.tick);
  }

  /** Desenha apenas a apresentação enquanto a tela inicial está visível. */
  tick(time) {
    this.frame = null;
    if (this.disposed) return;
    this.render(time / 1000);
    this.frame = requestAnimationFrame(this.tick);
  }

  /** Articula uma canela ao redor do joelho, conservando o desenho e a escala do sapato. */
  leg(ctx, source, knee, angle, scale, origin) {
    ctx.save(); ctx.translate(origin.x + (knee.x - 175) * scale, origin.y + (knee.y - 15) * scale);
    ctx.rotate(angle); ctx.scale(scale * .58, scale * .58);
    ctx.drawImage(this.images.girl, source.x, source.y, source.w, source.h, -source.pivot, -5, source.w, source.h);
    ctx.restore();
  }

  /** Mantém a poltrona sobre o tapete; somente a câmera muda com o formato da tela. */
  render(time) {
    const rect = this.overlay.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const aspect = rect.width / rect.height, w = aspect >= 1 ? 1920 : 1080, h = Math.round(w / aspect);
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
    const ctx = this.ctx, room = this.images.room;
    ctx.clearRect(0, 0, w, h);
    const frame = titleSceneFrame(w, h);
    ctx.save(); ctx.translate(frame.x, frame.y); ctx.scale(frame.scale, frame.scale);
    ctx.drawImage(room, 0, 0, TITLE_SCENE_LAYOUT.width, TITLE_SCENE_LAYOUT.height);
    const scale = TITLE_SCENE_LAYOUT.chairScale;
    const origin = { x: TITLE_SCENE_LAYOUT.chairX, y: TITLE_SCENE_LAYOUT.chairY };
    ctx.drawImage(this.images.girl, 175, 15, 702, 704, origin.x, origin.y, 702 * scale, 704 * scale);
    const swing = this.motion.matches ? 0 : Math.sin(time * 2.6);
    // Os joelhos já pertencem à pintura sentada; somente meias e sapatos entram nas camadas móveis.
    this.leg(ctx, { x: 1078, y: 405, w: 193, h: 220, pivot: 123 }, { x: 491, y: 482 }, -.10 + swing * .13, scale, origin);
    this.leg(ctx, { x: 1752, y: 408, w: 190, h: 221, pivot: 76 }, { x: 565, y: 486 }, .08 - swing * .11, scale, origin);
    ctx.restore();
  }

  /** Remove observadores e cancela o quadro pendente sem tocar nos recursos do jogo. */
  destroy() {
    this.disposed = true; if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null; this.observer.disconnect(); this.resize.disconnect();
    document.removeEventListener('visibilitychange', this.sync); this.motion.removeEventListener('change', this.sync); this.images = {};
  }
}
