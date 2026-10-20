const ART = new URL('../../../assets/art/title-screen/', import.meta.url);

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

  /** Compõe em Full HD na proporção 16:9 e reenquadra a menina acima do menu no retrato. */
  render(time) {
    const rect = this.overlay.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const aspect = rect.width / rect.height, w = aspect >= 1 ? 1920 : 1080, h = Math.round(w / aspect);
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
    const ctx = this.ctx, room = this.images.room;
    ctx.clearRect(0, 0, w, h);
    const cover = Math.max(w / room.width, h / room.height);
    ctx.drawImage(room, (w - room.width * cover) * (aspect < 1 ? .72 : .5), (h - room.height * cover) / 2, room.width * cover, room.height * cover);
    const scale = aspect < 1 ? Math.min(w * .84 / 701, h * .48 / 703) : Math.min(w * .43 / 701, h * .78 / 703);
    const origin = { x: aspect < 1 ? (w - 701 * scale) / 2 : w * .55, y: aspect < 1 ? h * .06 : h * .15 };
    ctx.drawImage(this.images.girl, 175, 15, 702, 704, origin.x, origin.y, 702 * scale, 704 * scale);
    const swing = this.motion.matches ? 0 : Math.sin(time * 2.6);
    // Os joelhos já pertencem à pintura sentada; somente meias e sapatos entram nas camadas móveis.
    this.leg(ctx, { x: 1078, y: 405, w: 193, h: 220, pivot: 123 }, { x: 491, y: 482 }, -.10 + swing * .13, scale, origin);
    this.leg(ctx, { x: 1752, y: 408, w: 190, h: 221, pivot: 76 }, { x: 565, y: 486 }, .08 - swing * .11, scale, origin);
  }

  /** Remove observadores e cancela o quadro pendente sem tocar nos recursos do jogo. */
  destroy() {
    this.disposed = true; if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null; this.observer.disconnect(); this.resize.disconnect();
    document.removeEventListener('visibilitychange', this.sync); this.motion.removeEventListener('change', this.sync); this.images = {};
  }
}
