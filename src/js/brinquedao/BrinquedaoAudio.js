import { GardenAudio } from '../garden/GardenAudio.js';
/** Trilha enviada pelo usuário; entra com o convite de Nanda e acompanha o circuito em loop. */
export class BrinquedaoAudio extends GardenAudio {
  /** Configura a trilha própria do circuito sem substituir as opções globais do host. */
  constructor(host) {
    super(host, {
      track: new URL('../../../assets/audio/Brinquedao.mp3', import.meta.url),
      label: 'do Brinquedão',
    });
  }
  /** Mantém a trilha em pausa na introdução inicial e na derrota; esmaece suavemente na conclusão. */
  update(state, paused = false) {
    super.update(
      state,
      paused || state.stage === 'GAME_OVER' || (state.stage === 'INTRO' && state.story.index < 3),
    );
    if (!paused && state?.stage === 'COMPLETE' && state.age > 8.5 && this.music) {
      const fade = Math.max(0, 1 - Math.min(1, (state.age - 8.5) / 3.0));
      this.music.volume = Math.max(
        0,
        Math.min(1, (this.host?.getMasterVolume?.() ?? 1) * 0.35 * fade),
      );
    }
  }
  /** Não mantém loops de insetos herdados do áudio do jardim. */
  updateWings() {
    /* O brinquedão não recebe emissores de insetos de outras fases. */
  }
  /** Associa eventos do circuito a tons próprios e delega os demais ao áudio base. */
  event(type) {
    if (type === 'tube-start') {
      this.tone(320, 0.3, 0.025, 1100);
      return;
    }
    if (type === 'side-spring') {
      this.tone(130, 0.23, 0.055, 580);
      return;
    }
    if (type === 'spring') {
      this.tone(110, 0.24, 0.055, 490);
      return;
    }
    if (type === 'elastic-wall') {
      this.tone(95, 0.27, 0.055, 620);
      return;
    }
    if (type === 'sky-launch') {
      this.tone(360, 0.32, 0.025, 1100);
      return;
    }
    if (type === 'bridge-creak') {
      this.tone(180, 0.12, 0.02, 95);
      return;
    }
    if (type === 'bridge-fall') {
      this.tone(95, 0.15, 0.02, 45);
      return;
    }
    if (type === 'balls') this.tone(280, 0.16, 0.035, 530);
    else if (type === 'soft-landing') this.tone(250, 0.2, 0.025, 180);
    else super.event(type);
  }
}
