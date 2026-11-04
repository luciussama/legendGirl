import {
  GardenInput
} from '../garden/GardenInput.js';
import {
  isMobileDevice
} from '../controllers/MobileZoom.js';
import {
  BrinquedaoAudio
} from './BrinquedaoAudio.js';
import {
  BrinquedaoRenderer
} from './BrinquedaoRenderer.js';
import {
  createBrinquedaoState,
  restoreBrinquedaoState,
  stepBrinquedao,
  recoverBrinquedao
} from './BrinquedaoSimulation.js';
import {
  advanceBrinquedaoStory
} from './BrinquedaoStory.js';
/** Fase isolada com circuito próprio, pausa, leitura, áudio e persistência de campanha. */
export class BrinquedaoPhase {
  /** Inicializa simulação isolada e cria os serviços de apresentação e entrada. */
  constructor({
    canvas,
    audio,
    enabled = () => true,
    difficulty = 'NORMAL',
    campaign = false
  }) {
    this.canvas = canvas;
    this.enabled = enabled;
    this.campaign = campaign;
    this.difficulty = difficulty;
    this.state = createBrinquedaoState(difficulty);
    this.ready = false;
    this.error = null;
    this.disposed = false;
    this.paused = false;
    this.renderer = new BrinquedaoRenderer(canvas);
    this.audio = new BrinquedaoAudio(audio);
    this.input = new GardenInput(canvas, () => this.ready && !this.error && !this.paused && this.enabled(), () => this.renderer.controls(), () => this.audio.unlock(), () => this.reading());
    this.onBlur = () => this.setPaused(true);
    this.onFocus = () => {
      if (this.enabled()) this.setPaused(false);
    };
    this.onVisibility = () => document.hidden ? this.onBlur() : this.onFocus();
  }
  /** Indica se a fase ainda não foi descartada. */
  get active() {
    return !this.disposed;
  }
  /** Expõe se a etapa atual aceita leitura ou avanço narrativo. */
  reading() {
    return this.state.stage === 'INTRO' || this.state.stage === 'COMPLETE' && !this.state.story.endingDone ? {
      seen: false
    } : null;
  }
  /** Avança a fala e impede que o mesmo gesto seja interpretado como salto. */
  advanceDialogue() {
    if (!this.ready || this.paused || !this.enabled()) return false;
    const changed = advanceBrinquedaoStory(this.state);
    if (changed) {
      this.input.clear();
      this.input.blockJumpUntilRelease = true;
    }
    return changed;
  }
  /** Restaura save, carrega ilustrações e instala entrada apenas se a fase continuar ativa. */
  async start(saved = null) {
    try {
      if (saved) this.state = restoreBrinquedaoState(saved.state ?? saved, this.difficulty);
      await this.renderer.load();
      if (this.disposed) return;
      this.ready = true;
      this.input.install();
      window.addEventListener('blur', this.onBlur);
      window.addEventListener('focus', this.onFocus);
      document.addEventListener('visibilitychange', this.onVisibility);
      if (Number.isFinite(saved?.musicTime) && saved.musicTime >= 0) this.audio.music.currentTime = saved.musicTime;
    } catch (e) {
      this.error = 'Não foi possível abrir o Brinquedão: ' + e.message;
      this.input.destroy();
    }
  }
  /** Avança a simulação e seus eventos sonoros quando controles e recursos estão liberados. */
  update(dt = 1) {
    if (!this.ready || this.error || this.disposed || this.paused || !this.enabled()) {
      this.input.clear();
      this.audio.update(this.state, true);
      return;
    }
    const wasIntro = this.state.stage === 'INTRO';
    for (const event of stepBrinquedao(this.state, this.input.sample(), Math.max(0, dt) / 60)) this.audio.event(event.type);
    if (wasIntro && this.state.stage !== 'INTRO') {
      this.input.clear();
      this.input.blockJumpUntilRelease = true;
    }
    this.audio.update(this.state);
  }
  /** Sincroniza áudio e compõe cena, interior ou circuito conforme o estado atual. */
  render() {
    this.audio.update(this.state, !this.ready || Boolean(this.error) || this.paused || this.disposed || !this.enabled());
    this.renderer.render(this.state, {
      ready: this.ready,
      error: this.error,
      paused: this.paused,
      touch: this.input.touch || isMobileDevice(),
      /** Encaminha a confirmação narrativa e impede que o mesmo gesto vire pulo. */
      onAdvance: () => this.advanceDialogue()
    });
  }
  /** Pausa a trilha e limpa entradas retidas ao mudar o foco da página. */
  setPaused(value) {
    this.paused = Boolean(value);
    this.input.clear();
    this.audio.update(this.state, this.paused || !this.ready || this.disposed);
  }
  /** Captura estado da fase e posição musical em um envelope versionado. */
  snapshot() {
    return {
      version: 1,
      state: structuredClone(this.state),
      musicTime: Number.isFinite(this.audio.music.currentTime) ? this.audio.music.currentTime : 0
    };
  }
  /** Retoma somente em recuperação/derrota e devolve a personagem ao checkpoint válido. */
  retry() {
    if (!['RECOVER', 'GAME_OVER'].includes(this.state.stage)) return false;
    recoverBrinquedao(this.state);
    return true;
  }
  /** Remove handlers e descarta entrada, áudio e recursos gráficos de forma idempotente. */
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
