import { clamp } from './ChaseConfig.js';

/** Entrada exclusiva da prévia; o host desliga os listeners antigos antes de instalar. */
export class ChaseInput {
  /** Recebe canvas, disponibilidade e desbloqueio de áudio por portas pequenas. */
  constructor(canvas, enabled, unlock) {
    this.canvas = canvas; this.enabled = enabled; this.unlock = unlock;
    this.keys = new Set(); this.pointers = new Map(); this.touch = false;
    this.keyDown = this.onKeyDown.bind(this); this.keyUp = this.onKeyUp.bind(this);
    this.pointer = this.onPointer.bind(this); this.release = this.onRelease.bind(this);
    this.blur = this.clear.bind(this);
  }
  /** Instala apenas uma vez os eventos que pertencem a esta fase. */
  install() {
    if (this.installed) return;
    this.installed = true;
    window.addEventListener('keydown', this.keyDown); window.addEventListener('keyup', this.keyUp);
    this.canvas.addEventListener('pointerdown', this.pointer);
    window.addEventListener('pointermove', this.pointer);
    window.addEventListener('pointerup', this.release); window.addEventListener('pointercancel', this.release);
    this.canvas.addEventListener('lostpointercapture', this.release);
    window.addEventListener('blur', this.blur); window.addEventListener('resize', this.blur);
  }
  /** Captura setas/A/D e evita rolagem, respeitando pausa e foco de formulários. */
  onKeyDown(event) {
    if (!this.enabled() || /INPUT|SELECT|TEXTAREA|BUTTON/.test(event.target?.tagName)) return;
    if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(event.code)) {
      event.preventDefault(); this.keys.add(event.code); this.unlock();
    }
  }
  /** Solta teclas mesmo que a pausa tenha começado enquanto estavam pressionadas. */
  onKeyUp(event) { this.keys.delete(event.code); }
  /** Mantém esquerda/direita com um dedo, permitindo arrastar para mudar de direção. */
  onPointer(event) {
    if (!this.enabled() || (event.type !== 'pointerdown' && !this.pointers.has(event.pointerId))) return;
    if (event.type === 'pointerdown' && event.target !== this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.touch = true; this.unlock();
    this.pointers.set(event.pointerId, event.clientX < rect.left + rect.width / 2 ? -1 : 1);
    if (event.cancelable) event.preventDefault();
    if (event.type === 'pointerdown') this.canvas.setPointerCapture?.(event.pointerId);
  }
  /** Libera somente o ponteiro encerrado e não deixa direção presa. */
  onRelease(event) { this.pointers.delete(event.pointerId); }
  /** Produz intenção lateral comum a teclado, toque e gamepad padrão. */
  sample() {
    if (!this.enabled()) return 0;
    const key = Number(this.keys.has('KeyD') || this.keys.has('ArrowRight')) -
      Number(this.keys.has('KeyA') || this.keys.has('ArrowLeft'));
    if (key) return key;
    if (this.pointers.size) return [...this.pointers.values()].at(-1);
    let pads = [];
    try { pads = navigator.getGamepads?.() || []; } catch (_) { return 0; }
    for (const pad of pads) {
      if (!pad?.connected || (pad.mapping && pad.mapping !== 'standard')) continue;
      const x = Number(Boolean(pad.buttons[15]?.pressed)) - Number(Boolean(pad.buttons[14]?.pressed)) || pad.axes[0] || 0;
      if (Math.abs(x) > .18) { this.unlock(); return clamp(x, -1, 1); }
    }
    return 0;
  }
  /** Limpa ponteiros e teclas em pausa, perda de foco e redimensionamento. */
  clear() {
    for (const id of this.pointers.keys()) {
      try { if (this.canvas.hasPointerCapture?.(id)) this.canvas.releasePointerCapture(id); } catch (_) { /* Captura já liberada. */ }
    }
    this.pointers.clear(); this.keys.clear();
  }
  /** Remove todos os listeners e permite destruir/reabrir a prévia sem duplicá-los. */
  destroy() {
    this.clear(); this.installed = false;
    window.removeEventListener('keydown', this.keyDown); window.removeEventListener('keyup', this.keyUp);
    this.canvas.removeEventListener('pointerdown', this.pointer);
    window.removeEventListener('pointermove', this.pointer);
    window.removeEventListener('pointerup', this.release); window.removeEventListener('pointercancel', this.release);
    this.canvas.removeEventListener('lostpointercapture', this.release);
    window.removeEventListener('blur', this.blur); window.removeEventListener('resize', this.blur);
  }
}
