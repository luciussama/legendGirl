import { createChaseState, restoreChaseState, stepChase } from './ChaseSimulation.js';
import { CHASE_CONFIG as C } from './ChaseConfig.js';
import { ChaseInput } from './ChaseInput.js';
import { ChaseAudio } from './ChaseAudio.js';
import { renderChaseHUD } from './ChaseHUD.js';

/** Coordenador da prova integrada; depende de portas específicas, nunca da sala inteira. */
export class BearChasePhase {
  /** Recebe apresentação e serviços mínimos; o renderer pesado só é importado no início. */
  constructor({ canvas, audio, enabled, difficulty = 'NORMAL' }) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.enabled = enabled;
    this.difficulty = difficulty; this.state = createChaseState(); this.accumulator = 0;
    this.audio = new ChaseAudio(audio); this.ready = false; this.disposed = false; this.error = null;
    this.input = new ChaseInput(canvas, enabled, () => this.audio.unlock());
    this.onBlur = () => this.setPaused(true);
    this.onFocus = () => { if (enabled()) this.setPaused(false); };
  }
  /** Mantém o resultado visível até sair da prévia, inclusive após a sequência do baú. */
  get active() { return !this.disposed; }
  /** Prepara GPU/artes e instala controles sem criar outro requestAnimationFrame. */
  async start(saved = null) {
    if (saved) this.restore(saved);
    this.input.install(); this.audio.unlock();
    window.addEventListener('blur', this.onBlur); window.addEventListener('focus', this.onFocus);
    try {
      const { ChaseRenderer3D } = await import('./ChaseRenderer3D.js');
      if (this.disposed) return;
      this.renderer = new ChaseRenderer3D(); await this.renderer.load();
      if (!this.disposed) this.ready = true;
    } catch (error) {
      this.error = 'Não foi possível preparar o cenário 3D. Verifique o suporte a WebGL 2.';
      console.warn('Preparação da perseguição interrompida:', error.message);
      this.renderer?.destroy(); this.renderer = null;
    }
  }
  /** Converte o dt legado de 60 Hz para segundos e consome passos fixos limitados. */
  update(dt) {
    if (!this.ready || this.paused || !this.enabled() || this.renderer?.contextLost) return;
    this.accumulator += Math.min(.2, Math.max(0, Number.isFinite(dt) ? dt / 60 : 0));
    const input = this.input.sample();
    while (this.accumulator + 1e-9 >= C.step) {
      const events = stepChase(this.state, input, C.step, this.difficulty);
      for (const event of events) if (event.type === 'step') this.audio.step(event.actor, this.state.gap);
      this.accumulator = Math.max(0, this.accumulator - C.step);
    }
    this.audio.update(this.state);
  }
  /** Renderiza o estado atual sem avançar tempo; funciona também durante a pausa. */
  render() {
    // Mesmo pausado, o host continua desenhando; mantém mudo/volume e pausa do áudio coerentes.
    this.audio.setPaused(this.paused || Boolean(this.renderer?.contextLost) || !this.enabled());
    this.audio.update(this.state);
    this.ctx.save(); this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = '#f3dfb8'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderer?.render(this.ctx, this.canvas, this.state);
    const message = this.renderer?.contextLost ? 'O contexto 3D foi interrompido; aguardando recuperação.' : this.error;
    renderChaseHUD(this.ctx, this.canvas, this.state, message || (!this.ready ? 'Preparando o quarto…' : null), this.audio.error);
    this.ctx.restore();
  }
  /** Congela entradas, acumulador e áudio; retomada não acumula passos perdidos. */
  setPaused(value) {
    this.paused = Boolean(value); this.input.clear(); this.accumulator = 0; this.audio.setPaused(value);
  }
  /** Exporta somente dados versionados e posição musical para as verificações da prévia. */
  snapshot() { return { version: 1, state: structuredClone(this.state), audio: this.audio.snapshot() }; }
  /** Restaura dados validados; a campanha antiga não é migrada nesta prova isolada. */
  restore(saved) {
    if (saved?.version !== 1) throw new TypeError('Versão da prévia de perseguição incompatível.');
    this.state = restoreChaseState(saved.state); this.accumulator = 0;
    this.audio.restore(saved.audio); this.input.clear();
  }
  /** Libera recursos próprios e cancela instalações pendentes, sem tocar no save da campanha. */
  destroy() {
    this.disposed = true; this.input.destroy(); this.audio.destroy(); this.renderer?.destroy();
    window.removeEventListener('blur', this.onBlur); window.removeEventListener('focus', this.onFocus);
  }
}
