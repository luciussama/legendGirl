import { createChaseState, restoreChaseState, stepChase } from './ChaseSimulation.js';
import { CHASE_CONFIG as C } from './ChaseConfig.js';
import { ChaseInput } from './ChaseInput.js';
import { ChaseAudio } from './ChaseAudio.js';
import { renderChaseHUD } from './ChaseHUD.js';
import { ChaseIntroRenderer, isChaseIntro, chaseIntroFade } from './ChaseIntroRenderer.js';

/** Coordenador da fase integrada; depende de portas específicas, nunca da sala inteira. */
export class BearChasePhase {
  /** Recebe portas mínimas; a campanha mantém o fade até arte e renderer estarem prontos. */
  constructor({ canvas, audio, enabled, difficulty = 'NORMAL', campaign = false, onCampaignError = null }) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.enabled = enabled;
    this.difficulty = difficulty; this.state = createChaseState(); this.accumulator = 0;
    this.campaign = campaign; this.onCampaignError = onCampaignError;
    this.handoffFade = campaign ? 1 : 0;
    this.audio = new ChaseAudio(audio); this.ready = false; this.disposed = false; this.error = null;
    this.intro = new ChaseIntroRenderer();
    this.input = new ChaseInput(canvas, enabled, () => this.audio.unlock());
    this.onBlur = () => this.setPaused(true);
    this.onFocus = () => { if (enabled()) this.setPaused(false); };
  }
  /** Mantém o resultado visível até sair da perseguição, inclusive após a sequência do baú. */
  get active() { return !this.disposed; }
  /** Prepara GPU/artes e instala controles sem criar outro requestAnimationFrame. */
  async start(saved = null) {
    try {
      if (saved) this.restore(saved);
      if (!this.campaign) this.input.install();
      this.audio.unlock();
      if (typeof window !== 'undefined') {
        window.addEventListener('blur', this.onBlur); window.addEventListener('focus', this.onFocus);
      }
      const { ChaseRenderer3D } = await import('./ChaseRenderer3D.js');
      if (this.disposed) return;
      this.renderer = new ChaseRenderer3D();
      await Promise.all([this.renderer.load(), this.intro.load()]);
      if (!this.disposed) this.ready = true;
    } catch (error) {
      this.error = saved
        ? `Não foi possível restaurar a fuga salva: ${error.message}`
        : 'Não foi possível preparar a abertura ilustrada e o cenário 3D. Verifique a conexão e o suporte a WebGL 2.';
      console.warn('Preparação da perseguição interrompida:', error.message);
      this.renderer?.destroy(); this.renderer = null;
      if (this.campaign && !this.disposed) this.onCampaignError?.(this.error);
    }
  }
  /** Converte o dt legado de 60 Hz para segundos e consome passos fixos limitados. */
  update(dt) {
    if (!this.ready || this.paused || !this.enabled() || this.renderer?.contextLost) return;
    if (this.handoffFade > 0) {
      this.handoffFade = Math.max(0, this.handoffFade - Math.min(.2, Math.max(0, Number.isFinite(dt) ? dt / 60 : 0)) / .4);
      this.input.clear();
      if (this.handoffFade === 0) this.input.install();
      return;
    }
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
    this.ctx.fillStyle = this.campaign && !this.ready ? '#140e13' : '#f3dfb8';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const intro = isChaseIntro(this.state.stage);
    if (this.ready && intro) this.intro.render(this.ctx, this.canvas, this.state);
    else if (this.ready) this.renderer?.render(this.ctx, this.canvas, this.state);
    const message = this.renderer?.contextLost ? 'O contexto 3D foi interrompido; aguardando recuperação.' : this.error;
    if ((!intro || !this.ready || message) && !(this.campaign && !this.ready)) {
      renderChaseHUD(this.ctx, this.canvas, this.state, message || (!this.ready ? 'Preparando o quarto…' : null), this.audio.error, this.difficulty);
    }
    const fade = this.ready ? Math.max(chaseIntroFade(this.state), this.handoffFade) : this.campaign ? 1 : 0;
    if (fade > 0) {
      this.ctx.fillStyle = `rgba(20,14,19,${fade})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.ctx.restore();
  }
  /** Congela entradas, acumulador e áudio; retomada não acumula passos perdidos. */
  setPaused(value) {
    this.paused = Boolean(value); this.input.clear(); this.accumulator = 0; this.audio.setPaused(value);
  }
  /** Tenta a fuga novamente; a ajuda mantém o percurso já alcançado e recupera as vidas. */
  retry({ resume = false } = {}) {
    if (this.state.stage !== 'GAME_OVER') return false;
    if (resume) {
      Object.assign(this.state, { stage: 'RUNNING', age: 0, hits: 0, stumble: 0, immunity: 2 });
    } else {
      this.state = createChaseState();
      this.audio.restore({ time: 0, started: false });
    }
    this.handoffFade = 0;
    this.setPaused(false);
    this.audio.unlock();
    return true;
  }
  /** Exporta somente dados versionados e posição musical para as verificações da perseguição. */
  snapshot() { return { version: 1, difficulty: this.difficulty, state: structuredClone(this.state), audio: this.audio.snapshot() }; }
  /** Restaura dados validados; a campanha antiga não é migrada nesta prova isolada. */
  restore(saved) {
    if (saved?.version !== 1) throw new TypeError('Versão da perseguição de perseguição incompatível.');
    if (saved.difficulty !== undefined && !['NORMAL', 'EASY'].includes(saved.difficulty)) throw new TypeError('Dificuldade da perseguição inválida.');
    if (saved.difficulty !== undefined) this.difficulty = saved.difficulty;
    this.state = restoreChaseState(saved.state); this.accumulator = 0;
    this.audio.restore(saved.audio); this.input.clear();
  }
  /** Libera recursos próprios e cancela instalações pendentes, sem tocar no save da campanha. */
  destroy() {
    this.disposed = true; this.input.destroy(); this.audio.destroy(); this.renderer?.destroy(); this.intro.destroy();
    if (typeof window !== 'undefined') {
      window.removeEventListener('blur', this.onBlur); window.removeEventListener('focus', this.onFocus);
    }
  }
}
