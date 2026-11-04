/**
 * AudioController.js
 * Controlador unificado de áudio responsável pelos efeitos sonoros e trilha musical,
 * gerenciamento de mudo em segundo plano/mudança de visibilidade da aba e controles de volume master.
 */

import {
  createAudioSystem
} from '../audio.js';

export class AudioController {
  /**
   * Usa o sistema de áudio recebido ou cria o compartilhado, registra a política de pausa por perda de
   * foco e prepara listeners.
   */
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

  /**
   * Registra mudanças de visibilidade e foco para pausar ou retomar o áudio conforme a política
   * configurada.
   */
  init() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.boundHandleVisibilityChange);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('blur', this.boundHandleWindowBlur);
      window.addEventListener('focus', this.boundHandleWindowFocus);
    }
  }

  /**
   * Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners.
   */
  handleVisibilityChange() {
    if (typeof document === 'undefined') return;
    if (document.hidden) {
      this.onBackground();
    } else {
      this.onForeground();
    }
  }

  /**
   * Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners.
   */
  handleWindowBlur() {
    if (this.autoPauseOnBlur) {
      this.onBackground();
    }
  }

  /**
   * Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners.
   */
  handleWindowFocus() {
    if (this.autoPauseOnBlur) {
      this.onForeground();
    }
  }

  /**
   * Marca a aba como oculta uma única vez, pausa a música e silencia o sistema compartilhado.
   */
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

  /**
   * Restaura o áudio apenas se a aba estava oculta e o usuário não escolheu mudo; retoma ou inicializa a
   * música.
   */
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

  /**
   * Define o volume mestre no sistema compartilhado e devolve o resultado dele; sem suporte, retorna o
   * valor solicitado.
   */
  setMasterVolume(volume) {
    if (this.system && typeof this.system.setMasterVolume === 'function') {
      return this.system.setMasterVolume(volume);
    }
    return volume;
  }

  /**
   * Consulta o volume mestre do sistema e usa 1 como padrão quando a implementação não oferece essa
   * leitura.
   */
  getMasterVolume() {
    if (this.system && typeof this.system.getMasterVolume === 'function') {
      return this.system.getMasterVolume();
    }
    return 1.0;
  }

  /** Expõe o contexto compartilhado para reprodução de amostras locais, sem criar outro mixer. */
  getAudioContext() {
    return this.system?.getAudioContext?.() || null;
  }

  /**
   * Registra a preferência explícita de mudo do usuário e a encaminha ao sistema de áudio.
   */
  setMuted(muted) {
    this.isMutedByUser = Boolean(muted);
    if (this.system && typeof this.system.setMuted === 'function') {
      return this.system.setMuted(this.isMutedByUser);
    }
    return this.isMutedByUser;
  }

  /**
   * Informa se o usuário silenciou o jogo ou se o próprio sistema de áudio está mudo.
   */
  isMuted() {
    return this.isMutedByUser || (this.system && typeof this.system.isMuted === 'function' && this.system.isMuted());
  }

  /**
   * Alterna a preferência explícita de mudo sem confundi-la com o silenciamento temporário por aba
   * oculta.
   */
  toggleMute() {
    return this.setMuted(!this.isMutedByUser);
  }

  // --- Delegações de Sons e Músicas ---
  /**
   * Solicita ao sistema compartilhado a inicialização necessária à reprodução, sem criar outro contexto
   * de áudio.
   */
  initAudio() {
    if (this.system && typeof this.system.initAudio === 'function') {
      this.system.initAudio();
    }
  }

  /**
   * Inicia a music e prepara o estado necessário para a sequência subsequente.
   */
  startMusic() {
    if (this.system && typeof this.system.startMusic === 'function') {
      this.system.startMusic();
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playOpeningAmbience() {
    this.system?.playOpeningAmbience?.();
  }

  /**
   * Inicia a music box e prepara o estado necessário para a sequência subsequente.
   */
  startMusicBox() {
    if (this.system && typeof this.system.startMusicBox === 'function') {
      this.system.startMusicBox();
    }
  }

  /**
   * Interrompe a music e encerra os recursos ativos sob responsabilidade do componente.
   */
  stopMusic() {
    if (this.system && typeof this.system.stopMusic === 'function') {
      this.system.stopMusic();
    }
  }

  /**
   * Interrompe a all audio e encerra os recursos ativos sob responsabilidade do componente.
   */
  stopAllAudio() {
    if (this.system && typeof this.system.stopAllAudio === 'function') {
      this.system.stopAllAudio();
    }
  }

  /**
   * Limpa a active sounds e remove os dados temporários que não devem persistir após esta etapa.
   */
  clearActiveSounds() {
    if (this.system && typeof this.system.clearActiveSounds === 'function') {
      this.system.clearActiveSounds();
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playJumpSound() {
    if (this.system && typeof this.system.playJumpSound === 'function') {
      this.system.playJumpSound();
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playLongJumpSound(progress) {
    if (this.system && typeof this.system.playLongJumpSound === 'function') {
      this.system.playLongJumpSound(progress);
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playLevelUpChime(level) {
    if (this.system && typeof this.system.playLevelUpChime === 'function') {
      this.system.playLevelUpChime(level);
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playFairyVoiceBlip(freq) {
    if (this.system && typeof this.system.playFairyVoiceBlip === 'function') {
      this.system.playFairyVoiceBlip(freq);
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playFairyLaugh() {
    if (this.system && typeof this.system.playFairyLaugh === 'function') {
      this.system.playFairyLaugh();
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playEscapePowerUp() {
    if (this.system && typeof this.system.playEscapePowerUp === 'function') {
      this.system.playEscapePowerUp();
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playFallFailSound() {
    if (this.system && typeof this.system.playFallFailSound === 'function') {
      this.system.playFallFailSound();
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playTapeRipSound() {
    if (this.system && typeof this.system.playTapeRipSound === 'function') {
      this.system.playTapeRipSound();
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playDramaticTumbleSound() {
    if (this.system && typeof this.system.playDramaticTumbleSound === 'function') {
      this.system.playDramaticTumbleSound();
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playBabyThudSound() {
    if (this.system && typeof this.system.playBabyThudSound === 'function') {
      this.system.playBabyThudSound();
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playBabyShockVoice() {
    if (this.system && typeof this.system.playBabyShockVoice === 'function') {
      this.system.playBabyShockVoice();
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playFairyFrustratedSound() {
    if (this.system && typeof this.system.playFairyFrustratedSound === 'function') {
      this.system.playFairyFrustratedSound();
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playPhase3StartFanfare() {
    if (this.system && typeof this.system.playPhase3StartFanfare === 'function') {
      this.system.playPhase3StartFanfare();
    }
  }

  /**
   * Define a intensidade gradual da trilha do quarto de brinquedos no sistema de áudio.
   */
  setToyRoomMusicFade(value) {
    this.system.setToyRoomMusicFade(value);
  }
  /**
   * Encaminha o nível de intensidade da trilha do quarto de brinquedos ao sistema de áudio.
   */
  setToyRoomMusicIntensity(value) {
    this.system.setToyRoomMusicIntensity?.(value);
  }
  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playArenaMusicBeat(beat) {
    return this.system.playArenaMusicBeat?.(beat);
  }
  /**
   * Interrompe a arena music e encerra os recursos ativos sob responsabilidade do componente.
   */
  stopArenaMusic() {
    this.system.stopArenaMusic?.();
  }
  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playArenaSound(event) {
    return this.system.playArenaSound?.(event);
  }
  /**
   * Seleciona no sistema compartilhado a faixa indicada para o quarto de brinquedos.
   */
  setToyRoomMusicTrack(track) {
    if (this.system && typeof this.system.setToyRoomMusicTrack === 'function') {
      this.system.setToyRoomMusicTrack(track);
    }
  }
  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playPortalExitWhoosh() {
    this.system.playPortalExitWhoosh();
  }
  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playSoftMagicBurst() {
    this.system.playSoftMagicBurst();
  }

  /**
   * Inicia a toy room music e prepara o estado necessário para a sequência subsequente.
   */
  startToyRoomMusic(options) {
    if (this.system && typeof this.system.startToyRoomMusic === 'function') {
      this.system.startToyRoomMusic(options);
    }
  }

  /**
   * Interrompe a toy room music e encerra os recursos ativos sob responsabilidade do componente.
   */
  stopToyRoomMusic() {
    if (this.system && typeof this.system.stopToyRoomMusic === 'function') {
      this.system.stopToyRoomMusic();
    }
  }

  /**
   * Pausa a trilha musical ativa no sistema de áudio compartilhado.
   */
  pauseMusic() {
    if (this.system && typeof this.system.pauseMusic === 'function') {
      this.system.pauseMusic();
    }
  }

  /**
   * Retoma a trilha pausada pelo sistema de áudio compartilhado, se houver uma faixa ativa.
   */
  resumeMusic() {
    if (this.system && typeof this.system.resumeMusic === 'function') {
      this.system.resumeMusic();
    }
  }

  /**
   * Devolve o elemento de áudio da trilha do quarto de brinquedos para ajustes pontuais de reprodução.
   */
  getToyRoomAudioElement() {
    if (this.system && typeof this.system.getToyRoomAudioElement === 'function') {
      return this.system.getToyRoomAudioElement();
    }
    return null;
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playPickUpSound() {
    if (this.system && typeof this.system.playPickUpSound === 'function') {
      this.system.playPickUpSound();
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playDropSound() {
    if (this.system && typeof this.system.playDropSound === 'function') {
      this.system.playDropSound();
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playOrganizeChime(streak) {
    if (this.system && typeof this.system.playOrganizeChime === 'function') {
      this.system.playOrganizeChime(streak);
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playToyRoomVictory() {
    if (this.system && typeof this.system.playToyRoomVictory === 'function') {
      this.system.playToyRoomVictory();
    }
  }

  /**
   * Aciona o som/cue correspondente ou sua delegação de áudio.
   */
  playCombatSound(event) {
    if (this.system && typeof this.system.playCombatSound === 'function') {
      this.system.playCombatSound(event);
    }
  }

  /**
   * Remove os recursos/listeners previstos na implementação; audite o ciclo de vida.
   */
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
