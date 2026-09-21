/**
 * AudioController.js
 * Controlador unificado de áudio responsável pelos efeitos sonoros e trilha musical,
 * gerenciamento de mudo em segundo plano/mudança de visibilidade da aba e controles de volume master.
 */

import { createAudioSystem } from '../audio.js';

export class AudioController {
  constructor(options = {}) {
    this.system = options.system || createAudioSystem();
    this.autoPauseOnBlur = options.autoPauseOnBlur !== false;

    this.isMutedByUser = false;
    this.isTabHidden = false;

    this.boundHandleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.boundHandleWindowBlur = this.handleWindowBlur.bind(this);
    this.boundHandleWindowFocus = this.handleWindowFocus.bind(this);

    this.init();
  }

  init() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.boundHandleVisibilityChange);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('blur', this.boundHandleWindowBlur);
      window.addEventListener('focus', this.boundHandleWindowFocus);
    }
  }

  handleVisibilityChange() {
    if (typeof document === 'undefined') return;
    if (document.hidden) {
      this.onBackground();
    } else {
      this.onForeground();
    }
  }

  handleWindowBlur() {
    if (this.autoPauseOnBlur) {
      this.onBackground();
    }
  }

  handleWindowFocus() {
    if (this.autoPauseOnBlur) {
      this.onForeground();
    }
  }

  onBackground() {
    if (this.isTabHidden) return;
    this.isTabHidden = true;
    // Pausa a execução contínua de áudio quando a aba perde o foco ou é minimizada
    if (this.system && typeof this.system.pauseMusic === 'function') {
      this.system.pauseMusic();
    }
    // Silencia o sistema quando o jogo é minimizado ou enviado para segundo plano
    if (this.system && typeof this.system.setMuted === 'function') {
      this.system.setMuted(true);
    }
  }

  onForeground() {
    if (!this.isTabHidden) return;
    this.isTabHidden = false;
    // Restaura o som e retoma a reprodução da trilha sonora se o jogador não tiver mutado explicitamente
    if (!this.isMutedByUser) {
      if (this.system && typeof this.system.setMuted === 'function') {
        this.system.setMuted(false);
      }
      if (this.system && typeof this.system.resumeMusic === 'function') {
        this.system.resumeMusic();
      } else if (typeof this.system.initAudio === 'function') {
        this.system.initAudio();
      }
    }
  }

  setMasterVolume(volume) {
    if (this.system && typeof this.system.setMasterVolume === 'function') {
      return this.system.setMasterVolume(volume);
    }
    return volume;
  }

  getMasterVolume() {
    if (this.system && typeof this.system.getMasterVolume === 'function') {
      return this.system.getMasterVolume();
    }
    return 1.0;
  }

  setMuted(muted) {
    this.isMutedByUser = Boolean(muted);
    if (this.system && typeof this.system.setMuted === 'function') {
      return this.system.setMuted(this.isMutedByUser);
    }
    return this.isMutedByUser;
  }

  isMuted() {
    return this.isMutedByUser || (this.system && typeof this.system.isMuted === 'function' && this.system.isMuted());
  }

  toggleMute() {
    return this.setMuted(!this.isMutedByUser);
  }

  // --- Delegações de Sons e Músicas ---
  initAudio() {
    if (this.system && typeof this.system.initAudio === 'function') {
      this.system.initAudio();
    }
  }

  startMusic() {
    if (this.system && typeof this.system.startMusic === 'function') {
      this.system.startMusic();
    }
  }

  startMusicBox() {
    if (this.system && typeof this.system.startMusicBox === 'function') {
      this.system.startMusicBox();
    }
  }

  stopMusic() {
    if (this.system && typeof this.system.stopMusic === 'function') {
      this.system.stopMusic();
    }
  }

  stopAllAudio() {
    if (this.system && typeof this.system.stopAllAudio === 'function') {
      this.system.stopAllAudio();
    }
  }

  clearActiveSounds() {
    if (this.system && typeof this.system.clearActiveSounds === 'function') {
      this.system.clearActiveSounds();
    }
  }

  playJumpSound() {
    if (this.system && typeof this.system.playJumpSound === 'function') {
      this.system.playJumpSound();
    }
  }

  playLongJumpSound(progress) {
    if (this.system && typeof this.system.playLongJumpSound === 'function') {
      this.system.playLongJumpSound(progress);
    }
  }

  playLevelUpChime(level) {
    if (this.system && typeof this.system.playLevelUpChime === 'function') {
      this.system.playLevelUpChime(level);
    }
  }

  playFairyVoiceBlip(freq) {
    if (this.system && typeof this.system.playFairyVoiceBlip === 'function') {
      this.system.playFairyVoiceBlip(freq);
    }
  }

  playFairyLaugh() {
    if (this.system && typeof this.system.playFairyLaugh === 'function') {
      this.system.playFairyLaugh();
    }
  }

  playEscapePowerUp() {
    if (this.system && typeof this.system.playEscapePowerUp === 'function') {
      this.system.playEscapePowerUp();
    }
  }

  playFallFailSound() {
    if (this.system && typeof this.system.playFallFailSound === 'function') {
      this.system.playFallFailSound();
    }
  }

  playTapeRipSound() {
    if (this.system && typeof this.system.playTapeRipSound === 'function') {
      this.system.playTapeRipSound();
    }
  }

  playDramaticTumbleSound() {
    if (this.system && typeof this.system.playDramaticTumbleSound === 'function') {
      this.system.playDramaticTumbleSound();
    }
  }

  playBabyThudSound() {
    if (this.system && typeof this.system.playBabyThudSound === 'function') {
      this.system.playBabyThudSound();
    }
  }

  playBabyShockVoice() {
    if (this.system && typeof this.system.playBabyShockVoice === 'function') {
      this.system.playBabyShockVoice();
    }
  }

  playFairyFrustratedSound() {
    if (this.system && typeof this.system.playFairyFrustratedSound === 'function') {
      this.system.playFairyFrustratedSound();
    }
  }

  playPhase3StartFanfare() {
    if (this.system && typeof this.system.playPhase3StartFanfare === 'function') {
      this.system.playPhase3StartFanfare();
    }
  }

  startToyRoomMusic() {
    if (this.system && typeof this.system.startToyRoomMusic === 'function') {
      this.system.startToyRoomMusic();
    }
  }

  stopToyRoomMusic() {
    if (this.system && typeof this.system.stopToyRoomMusic === 'function') {
      this.system.stopToyRoomMusic();
    }
  }

  pauseMusic() {
    if (this.system && typeof this.system.pauseMusic === 'function') {
      this.system.pauseMusic();
    }
  }

  resumeMusic() {
    if (this.system && typeof this.system.resumeMusic === 'function') {
      this.system.resumeMusic();
    }
  }

  getToyRoomAudioElement() {
    if (this.system && typeof this.system.getToyRoomAudioElement === 'function') {
      return this.system.getToyRoomAudioElement();
    }
    return null;
  }

  playPickUpSound() {
    if (this.system && typeof this.system.playPickUpSound === 'function') {
      this.system.playPickUpSound();
    }
  }

  playDropSound() {
    if (this.system && typeof this.system.playDropSound === 'function') {
      this.system.playDropSound();
    }
  }

  playOrganizeChime(streak) {
    if (this.system && typeof this.system.playOrganizeChime === 'function') {
      this.system.playOrganizeChime(streak);
    }
  }

  playToyRoomVictory() {
    if (this.system && typeof this.system.playToyRoomVictory === 'function') {
      this.system.playToyRoomVictory();
    }
  }

  destroy() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.boundHandleVisibilityChange);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('blur', this.boundHandleWindowBlur);
      window.removeEventListener('focus', this.boundHandleWindowFocus);
    }
    this.stopAllAudio();
  }
}

export function createAudioController(options = {}) {
  return new AudioController(options);
}
