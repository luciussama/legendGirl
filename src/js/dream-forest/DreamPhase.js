import { isMobileDevice } from '../controllers/mobileZoom.js';
import { DREAM_GLIDE } from './dreamGlider.js';
import { DreamAudio } from './DreamAudio.js';
import { nightmareReading } from './dreamNightmare.js';
import { DreamInput, dreamMobileWebInput, dreamControls, nightmareControls } from './DreamInput.js';
import { DreamRenderer } from './DreamRenderer.js';
import {
  createDreamState,
  restoreDreamState,
  advanceDreamDialogue,
  stepDream,
  retryDream,
} from './dreamSimulation.js';
/** Sonho lateral isolado: carga sob demanda, ciclo de vida e origem de campanha próprios. */
export class DreamPhase {
  /**
   * Cria o estado e os serviços do sonho com a dificuldade e a origem recebidas; coordena carregamento,
   * entrada, áudio e renderização.
   */
  constructor({ canvas, audio, enabled = () => true, difficulty = 'NORMAL', campaign = false }) {
    this.canvas = canvas;
    this.enabled = enabled;
    this.campaign = campaign;
    this.difficulty = difficulty;
    this.state = createDreamState(difficulty);
    this.ready = false;
    this.error = null;
    this.disposed = false;
    this.paused = false;
    this.renderer = new DreamRenderer(canvas);
    this.audio = new DreamAudio(audio);
    this.input = new DreamInput(
      canvas,
      () => this.ready && !this.paused && this.enabled(),
      () => this.audio.unlock(),
      () => this.reading(),
    );
    this.input.controls = () =>
      this.state.nightmare
        ? nightmareControls(canvas)
        : dreamControls(canvas, {
            stage: this.state.stage,
          });
    this.onBlur = () => this.setPaused(true);
    this.onFocus = () => {
      if (this.enabled()) this.setPaused(false);
    };
    this.onVisibility = () => (document.hidden ? this.onBlur() : this.onFocus());
  }
  /**
   * Indica se a instância ainda está ativa; após o descarte, retorna falso.
   */
  get active() {
    return !this.disposed;
  }
  /**
   * Devolve os dados da fala em leitura durante a abertura, a introdução ou o encerramento; retorna null
   * durante a exploração.
   */
  reading() {
    if (this.state.nightmare) return nightmareReading(this.state);
    return this.state.stage === 'OPENING' ||
      this.state.stage === 'INTRO' ||
      (this.state.stage === 'COMPLETE' && this.state.age < 7)
      ? {
          seen: false,
        }
      : null;
  }
  /**
   * Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva
   * temporização autorada.
   */
  advanceDialogue() {
    if (!this.ready || this.paused || !this.enabled()) return false;
    const advanced = advanceDreamDialogue(this.state);
    if (advanced) {
      this.input.clear();
      this.input.blockJumpUntilRelease = true;
    }
    return advanced;
  }
  /**
   * Inicia o estado e dados do componente e prepara o estado necessário para a sequência subsequente.
   */
  async start(saved = null) {
    try {
      if (saved) this.state = restoreDreamState(saved.state ?? saved, this.difficulty);
      await this.renderer.load();
      if (this.disposed) return;
      if (this.state.nightmare) await this.renderer.nightmare.load();
      if (this.disposed) return;
      this.ready = true;
      this.input.install();
      window.addEventListener('blur', this.onBlur);
      window.addEventListener('focus', this.onFocus);
      document.addEventListener('visibilitychange', this.onVisibility);
      this.audio.selectTrack(this.state);
      if (Number.isFinite(saved?.musicTime) && saved.musicTime >= 0)
        this.audio.music.currentTime = saved.musicTime;
    } catch (e) {
      this.error = 'Não foi possível abrir o sonho: ' + e.message;
      this.input.destroy();
    }
  }
  /**
   * Avança o estado do subsistema; não é uma operação somente de desenho.
   */
  update(dt = 1) {
    if (!this.ready || this.disposed || this.paused || !this.enabled()) {
      this.input.clear();
      this.audio.update(this.state, true);
      return;
    }
    if (
      !this.renderer.nightmare.loading &&
      (this.state.stage === 'GLIDE_LANDING' ||
        (this.state.stage === 'GLIDING' &&
          this.state.player.x > DREAM_GLIDE.start + DREAM_GLIDE.length - 2000))
    )
      this.renderer.nightmare.load().catch((e) => {
        this.error = e.message;
      });
    if (this.state.nightmare && !this.renderer.nightmare.ready) {
      this.renderer.nightmare.load().catch((e) => {
        this.error = e.message;
      });
      this.input.clear();
      this.audio.update(this.state, true);
      return;
    }
    const seconds = Math.max(0, dt) / 60,
      input = dreamMobileWebInput(this.state, this.input.sample(), {
        seconds,
      });
    const wasOpening = this.state.stage === 'OPENING';
    for (const event of stepDream(this.state, input, seconds)) this.audio.event(event.type, event);
    if (wasOpening && this.state.stage !== 'OPENING') {
      this.input.clear();
      this.input.blockJumpUntilRelease = true;
    }
    this.audio.update(this.state);
  }
  /**
   * Atualiza o áudio conforme prontidão e pausa e delega a composição do estado atual ao renderizador.
   */
  render() {
    this.audio.update(
      this.state,
      !this.ready || this.disposed || this.paused || Boolean(this.error) || !this.enabled(),
    );
    this.renderer.render(this.state, {
      ready: this.ready,
      error: this.error,
      paused: this.paused,
      /**
       * Encaminha a solicitação de avanço narrativo ao controlador da fase, que aplica as regras de leitura
       * e consumo de entrada.
       */
      onAdvance: () => this.advanceDialogue(),
      touch: this.input.touch || isMobileDevice() || this.canvas.clientWidth < 900,
    });
  }
  /**
   * Altera o estado de pausa, limpa entradas acumuladas e silencia a cena enquanto a fase não pode
   * avançar.
   */
  setPaused(value) {
    this.paused = Boolean(value);
    this.input.clear();
    this.audio.update(this.state, this.paused || !this.ready || this.disposed);
  }
  /**
   * Produz captura recuperável do estado específico deste componente.
   */
  snapshot() {
    return {
      version: 1,
      state: structuredClone(this.state),
      musicTime: Number.isFinite(this.audio.music.currentTime) ? this.audio.music.currentTime : 0,
    };
  }
  /**
   * Delega a recuperação do estado da fase ao simulador, sem recriar recursos de apresentação.
   */
  retry() {
    return retryDream(this.state);
  }
  /**
   * Remove os recursos/listeners previstos na implementação; audite o ciclo de vida.
   */
  destroy() {
    if (this.disposed) return;
    this.disposed = true;
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('focus', this.onFocus);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.input.destroy();
    this.audio.destroy();
    this.renderer.destroy();
  }
}
