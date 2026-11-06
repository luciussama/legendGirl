import { installDialogueAdvance } from '../narrative/dialogueFlow.js';
import {
  createGardenState,
  restoreGardenState,
  stepGarden,
  retryGarden,
} from './gardenSimulation.js';
import { GardenRenderer } from './GardenRenderer.js';
import { GardenInput } from './GardenInput.js';
import { GardenAudio } from './GardenAudio.js';
/** Fase isolada: o host fornece canvas, pausa, áudio e dificuldade, sem compartilhar corpos. */
export class GardenPhase {
  /** Cria estado isolado e conecta apresentação, áudio e entrada aos serviços do host. */
  constructor({ canvas, audio, enabled = () => true, difficulty = 'NORMAL', campaign = false }) {
    this.canvas = canvas;
    this.enabled = enabled;
    this.difficulty = difficulty;
    this.campaign = campaign;
    this.state = createGardenState(difficulty);
    this.ready = false;
    this.error = null;
    this.disposed = false;
    this.paused = false;
    this.removeDialogueAdvance = installDialogueAdvance(canvas, {
      /** Só aceita avanço depois da carga, fora de pausa e enquanto o host permite entrada. */
      enabled: () => this.ready && !this.paused && this.enabled(),
      /** Mantém controles de diálogo modais durante abertura e encerramento. */
      isModal: () => Boolean(this.reading()),
      /** Encaminha o gesto do diálogo para a fila de avanço ou de pulo da cena. */
      advance: (event) => this.requestDialogueAdvance(event),
    });
    this.onBlur = () => this.setPaused(true);
    this.onFocus = () => {
      if (this.enabled()) this.setPaused(false);
    };
    this.onVisibility = () => {
      if (document.hidden) this.onBlur();
      else this.onFocus();
    };
    this.renderer = new GardenRenderer(canvas);
    this.audio = new GardenAudio(audio);
    this.input = new GardenInput(
      canvas,
      () => this.ready && !this.paused && this.enabled(),
      () => this.renderer.controls(),
      () => this.audio.unlock(),
      () => this.reading(),
    );
  }
  /** Encaminha gestos narrativos e bloqueia o pulo até a tecla/controle ser solto. */
  requestDialogueAdvance(event = {}) {
    if (event.pointerType === 'touch') this.input.touch = true;
    const reading = this.reading();
    if (!this.ready || this.paused || this.error || !this.enabled() || !reading) return false;
    const box = reading.skipBox,
      rect = this.canvas.getBoundingClientRect(),
      x = ((event.clientX - rect.left) * this.canvas.width) / rect.width,
      y = ((event.clientY - rect.top) * this.canvas.height) / rect.height;
    if (reading.seen && box && x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h)
      this.input.skipQueued = true;
    else this.input.advanceQueued = true;
    this.input.blockJumpUntilRelease = true;
    return true;
  }
  /** Retorna os dados da abertura ou encerramento enquanto a leitura estiver ativa. */
  reading() {
    const s = this.state;
    return s.stage === 'INTRO' && !s.story.openingDone
      ? {
          seen: s.story.seenOpening,
          skipBox: this.renderer.storyControls?.skip,
        }
      : s.stage === 'COMPLETE' && !s.story.endingDone
        ? {
            seen: s.story.seenEnding,
            skipBox: this.renderer.storyControls?.skip,
          }
        : null;
  }
  /** Indica se a fase ainda aceita sua própria atualização e renderização. */
  get active() {
    return !this.disposed;
  }
  /** Restaura save e cenas vistas, carrega recursos e só então habilita entrada. */
  async start(saved = null) {
    try {
      if (saved) this.state = restoreGardenState(saved.state ?? saved, this.difficulty);
      try {
        const seen = JSON.parse(localStorage.getItem('legendgirl:garden:scenes:v1') || '{}');
        this.state.story.seenOpening ||= seen.opening === true;
        this.state.story.seenEnding ||= seen.ending === true;
      } catch {
        /* O save da fase permanece suficiente quando o armazenamento está bloqueado. */
      }
      await this.renderer.load();
      if (this.disposed) return;
      this.ready = true;
      this.input.install();
      window.addEventListener('blur', this.onBlur);
      window.addEventListener('focus', this.onFocus);
      document.addEventListener('visibilitychange', this.onVisibility);
    } catch (error) {
      this.error = 'Não foi possível abrir o jardim: ' + error.message;
      this.input.destroy();
    }
  }
  /** Consome entradas, avança a simulação e encaminha seus eventos ao áudio. */
  update(dt = 1) {
    if (
      !this.ready ||
      this.disposed ||
      this.paused ||
      (!this.enabled() && !['FALLING', 'GAME_OVER'].includes(this.state.stage))
    ) {
      this.input.clear();
      this.audio.update(this.state, true);
      return;
    }
    const input = this.input.sample();
    for (const event of stepGarden(this.state, input, Math.max(0, dt) / 60, this.difficulty)) {
      if (event.type === 'scene-seen') {
        try {
          localStorage.setItem(
            'legendgirl:garden:scenes:v1',
            JSON.stringify({
              opening: this.state.story.seenOpening,
              ending: this.state.story.seenEnding,
            }),
          );
        } catch {
          /* Cenas vistas também integram o snapshot. */
        }
        this.input.clear();
      } else this.audio.event(event.type);
    }
    this.audio.update(this.state);
  }
  /** Atualiza o áudio e desenha cena ou gameplay conforme estado e disponibilidade. */
  render() {
    this.audio.update(
      this.state,
      !this.ready ||
        this.disposed ||
        Boolean(this.error) ||
        this.paused ||
        (!this.enabled() && !['FALLING', 'GAME_OVER'].includes(this.state.stage)),
    );
    this.renderer.render(this.state, {
      ready: this.ready,
      error: this.error,
      touch: this.input.touch,
      paused: this.paused,
    });
  }
  /** Pausa a fase, limpa controles retidos e sincroniza a trilha com a pausa. */
  setPaused(value) {
    this.paused = Boolean(value);
    this.input.clear();
    this.audio.update(
      this.state,
      this.paused || !this.ready || this.disposed || Boolean(this.error),
    );
  }
  /** Gera envelope versionado com cópia independente do estado da fase. */
  snapshot() {
    return {
      version: 1,
      state: JSON.parse(JSON.stringify(this.state)),
    };
  }
  /** Tenta retomar no checkpoint e remove a pausa somente quando a simulação aceita. */
  retry() {
    const retried = retryGarden(this.state, this.difficulty);
    if (retried) this.setPaused(false);
    return retried;
  }
  /** Remove handlers globais e descarta entrada, áudio e renderer uma única vez. */
  destroy() {
    if (this.disposed) return;
    this.disposed = true;
    this.removeDialogueAdvance();
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('focus', this.onFocus);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.input.destroy();
    this.audio.destroy();
    this.renderer.destroy();
  }
}
