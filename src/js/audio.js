import { GameSoundEffects, preloadGameSounds } from './audio/GameSoundEffects.js';
import { scheduleDamageSound } from './toy-room/damageAudio.js';
import { scheduleSwordSound } from './toy-room/swordAudio.js';
import { scheduleEnemyMovement } from './toy-room/enemyMovementAudio.js';
import { ArenaSoundEffects } from './toy-room/ArenaSoundEffects.js';

export function createAudioSystem() {
  const arenaEffects = new ArenaSoundEffects();
  const gameEffects = new GameSoundEffects();
  let effectsPaused = false;
  const state = {
    audioCtx: null,
    musicTrack: null,
    masterGainNode: null,
  };

  let masterVolume = 1.0;
  let isMuted = false;

  /** Obtém o nó mestre de saída, criando-o sob demanda e usando destino direto se falhar. */
  function getDestination() {
    if (!state.audioCtx) return null;
    if (!state.masterGainNode) {
      try {
        state.masterGainNode = state.audioCtx.createGain();
        state.masterGainNode.gain.setValueAtTime(
          isMuted ? 0 : masterVolume,
          state.audioCtx.currentTime,
        );
        state.masterGainNode.connect(state.audioCtx.destination);
      } catch (e) {
        return state.audioCtx.destination;
      }
    }
    return state.masterGainNode;
  }

  /** Recalcula volumes das trilhas com mudo, fade e intensidade sem exceder o intervalo válido. */
  function updateMusicVolumes() {
    const effectiveVol = isMuted ? 0 : masterVolume;
    if (state.musicTrack) {
      state.musicTrack.volume = Math.max(0, Math.min(1, 0.55 * effectiveVol));
    }
    if (toyRoomAudio) {
      toyRoomAudio.volume = Math.max(
        0,
        Math.min(1, 0.58 * effectiveVol * toyRoomMusicFade * toyRoomMusicIntensity),
      );
    }
  }

  /** Limita e aplica o volume mestre; valores não numéricos restauram o padrão máximo. */
  function setMasterVolume(vol) {
    masterVolume = Math.max(0, Math.min(1, typeof vol === 'number' ? vol : 1.0));
    if (state.audioCtx && state.masterGainNode) {
      state.masterGainNode.gain.setValueAtTime(
        isMuted ? 0 : masterVolume,
        state.audioCtx.currentTime,
      );
    }
    updateMusicVolumes();
    return masterVolume;
  }

  /** Retorna o volume mestre atual, independente do estado de mudo. */
  function getMasterVolume() {
    return masterVolume;
  }

  /** Atualiza mudo, interrompe efeitos especializados e sincroniza o ganho e as trilhas. */
  function setMuted(muted) {
    isMuted = Boolean(muted);
    if (isMuted) {
      arenaEffects.stop();
      gameEffects.stop();
    }
    if (state.audioCtx && state.masterGainNode) {
      state.masterGainNode.gain.setValueAtTime(
        isMuted ? 0 : masterVolume,
        state.audioCtx.currentTime,
      );
    }
    updateMusicVolumes();
    return isMuted;
  }

  /** Inverte mudo por meio do mesmo caminho de atualização de volume. */
  function toggleMute() {
    return setMuted(!isMuted);
  }

  /** Consulta o estado de mudo sem alterar a reprodução. */
  function getIsMuted() {
    return isMuted;
  }

  let isMusicWanted = false;
  let isToyRoomMusicWanted = false;
  let toyRoomMusicFade = 1;
  let toyRoomMusicIntensity = 1;
  const activeAudioNodes = new Set();

  /** Mantém nós de efeito rastreáveis e os remove do conjunto quando terminam. */
  function registerActiveNode(node) {
    if (!node) return;
    activeAudioNodes.add(node);
    const cleanup = () => {
      activeAudioNodes.delete(node);
    };
    if ('onended' in node) {
      node.onended = cleanup;
    }
  }

  /** Interrompe e desconecta efeitos ativos, limpando também os sintetizadores especializados. */
  function clearActiveSounds() {
    arenaEffects.stop();
    gameEffects.stop();
    activeAudioNodes.forEach((node) => {
      try {
        if (typeof node.stop === 'function') node.stop();
        if (typeof node.disconnect === 'function') node.disconnect();
      } catch (e) {}
    });
    activeAudioNodes.clear();
  }

  // --- PRIMEIRA FASE: TRILHA SONORA DO QUARTO ESCURO (ORIGINAL INALTERADA) ---
  /** Cria uma única trilha do quarto escuro e configura fallback, loop e volume inicial. */
  function getMusicTrack() {
    if (!state.musicTrack) {
      try {
        const fallbackUrl = new URL(
          '../../assets/audio/High-Frequency%20Violin.mp3',
          import.meta.url,
        ).href;
        const primaryUrl = new URL(
          '../../assets/audio/High-Frequency%20Violin.mp3',
          import.meta.url,
        ).href;
        state.musicTrack = new Audio(primaryUrl);
        state.musicTrack.onerror = () => {
          if (state.musicTrack && state.musicTrack.src !== fallbackUrl) {
            state.musicTrack.src = fallbackUrl;
            if (isMusicWanted && !isToyRoomMusicWanted) {
              state.musicTrack.play().catch(() => {});
            }
          }
        };
        state.musicTrack.loop = true;
        state.musicTrack.volume = Math.max(0, Math.min(1, 0.55 * (isMuted ? 0 : masterVolume)));
        state.musicTrack.preload = 'auto';

        // Evento de continuidade de loop seguro
        state.musicTrack.addEventListener('ended', () => {
          if (isMusicWanted && !isToyRoomMusicWanted) {
            state.musicTrack.currentTime = 0;
            state.musicTrack.play().catch(() => {});
          }
        });
      } catch (error) {
        console.warn('Trilha sonora do quarto escuro não pôde ser carregada:', error);
      }
    }
    return state.musicTrack;
  }

  /** Inicializa/retoma Web Audio, prepara amostras e retoma apenas a trilha solicitada. */
  function initAudio() {
    try {
      if (!state.audioCtx) {
        state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (state.audioCtx && state.audioCtx.state === 'suspended') {
        state.audioCtx.resume().catch(() => {});
      }

      arenaEffects.preload(state.audioCtx);
      preloadGameSounds(state.audioCtx, ['jump']);

      // Inicializa ou retoma a trilha correspondente à fase atual se estiver pausada
      if (isToyRoomMusicWanted) {
        if (toyRoomAudio && toyRoomAudio.paused) {
          toyRoomAudio.play().catch(() => {});
        }
      } else if (isMusicWanted) {
        if (state.musicTrack && state.musicTrack.paused) {
          state.musicTrack.play().catch(() => {});
        }
      }
    } catch (e) {}
  }

  /** Solicita a música do quarto escuro e encerra a trilha concorrente da sala de brinquedos. */
  function startMusic() {
    effectsPaused = false;
    try {
      isMusicWanted = true;
      stopToyRoomMusic(); // Garante que a música da sala de brinquedos pare

      if (state.audioCtx && state.audioCtx.state === 'suspended') {
        state.audioCtx.resume().catch(() => {});
      }

      const track = getMusicTrack();
      if (track) {
        track.volume = Math.max(0, Math.min(1, 0.55 * (isMuted ? 0 : masterVolume)));
        if (track.paused) {
          track.play().catch(() => {});
        }
      }
    } catch (e) {}
  }

  /** Cancela a solicitação e reinicia a posição da trilha principal. */
  function stopMusic() {
    isMusicWanted = false;
    if (state.musicTrack) {
      try {
        state.musicTrack.pause();
        state.musicTrack.currentTime = 0;
      } catch (e) {}
    }
  }

  /** Encerra ambas as trilhas e limpa efeitos, apropriado para troca ou descarte de fase. */
  function stopAllAudio() {
    stopMusic();
    stopToyRoomMusic();
    clearActiveSounds();
  }

  /** Mesmo pulo gravado em todas as fases, inclusive nos saltos longos e na arena. */
  function playJumpSound() {
    if (effectsPaused || isMuted || !state.audioCtx) return false;
    return gameEffects.play(state.audioCtx, getDestination(), 'jump', {
      volume: 0.325,
    });
  }

  /** Preserva a API histórica do salto longo usando o mesmo som de salto em todas as fases. */
  function playLongJumpSound(progress = 0) {
    return playJumpSound();
  }

  /** Produz um acorde ascendente cuja frequência base cresce até o limite do nível. */
  function playLevelUpChime(level = 0) {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;

      const now = state.audioCtx.currentTime;
      const baseFreq = 587 + Math.min(level, 11) * 45; // Ré5 até notas mais agudas
      const freqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];

      freqs.forEach((f, i) => {
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.045);
        gain.gain.setValueAtTime(0.08, now + i * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.18);
        osc.connect(gain);
        gain.connect(getDestination() || state.audioCtx.destination);
        registerActiveNode(osc);
        osc.start(now + i * 0.045);
        osc.stop(now + i * 0.045 + 0.2);
      });
    } catch (e) {}
  }

  /** Emite duas notas sustentadas para a abertura, sem iniciar uma trilha musical. */
  function playOpeningAmbience() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;
      for (const frequency of [146.83, 220]) {
        const oscillator = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.012, now + 1.5);
        gain.gain.linearRampToValueAtTime(0, now + 4);
        oscillator.connect(gain);
        gain.connect(getDestination());
        registerActiveNode(oscillator);
        oscillator.start(now);
        oscillator.stop(now + 4.1);
      }
    } catch {}
  }

  /** Sintetiza um blip vocal curto na frequência pedida; requer contexto ativo. */
  function playFairyVoiceBlip(freq = 920) {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;

      const now = state.audioCtx.currentTime;
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.05);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(getDestination() || state.audioCtx.destination);
      registerActiveNode(osc);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  /** Sintetiza uma risada curta em notas ascendentes com decaimento individual. */
  function playFairyLaugh() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;

      const notes = [987, 1174, 1318, 1567, 1760, 2093];
      const baseTime = state.audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        const startTime = baseTime + idx * 0.055;
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.1, startTime + 0.08);

        gain.gain.setValueAtTime(0.09, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

        osc.connect(gain);
        gain.connect(getDestination() || state.audioCtx.destination);
        registerActiveNode(osc);
        osc.start(startTime);
        osc.stop(startTime + 0.12);
      });
    } catch (e) {}
  }

  /** Emite uma fanfarra em acorde para sinalizar a ativação de energia da fuga. */
  function playEscapePowerUp() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;

      const chords = [523.25, 659.25, 783.99, 1046.5]; // Fanfarra triunfante em Dó Maior (C5)
      const baseTime = state.audioCtx.currentTime;

      chords.forEach((freq, idx) => {
        const startTime = baseTime + idx * 0.08;
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.14, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(getDestination() || state.audioCtx.destination);
        registerActiveNode(osc);
        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch (e) {}
  }

  /** Sintetiza um tom descendente de falha apenas enquanto Web Audio está ativo. */
  function playFallFailSound() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;

      const now = state.audioCtx.currentTime;
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.38);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(getDestination() || state.audioCtx.destination);
      registerActiveNode(osc);
      osc.start(now);
      osc.stop(now + 0.42);
    } catch (e) {}
  }

  /** Gera ruído filtrado e curto para representar fita adesiva sendo removida. */
  function playTapeRipSound() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Rajada de ruído filtrado simulando o descolar de fita adesiva da parede
      const bufferSize = Math.floor(state.audioCtx.sampleRate * 0.18);
      const buffer = state.audioCtx.createBuffer(1, bufferSize, state.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      const noise = state.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = state.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.16);
      filter.Q.setValueAtTime(3.5, now);

      const gain = state.audioCtx.createGain();
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(getDestination() || state.audioCtx.destination);

      registerActiveNode(noise);
      noise.start(now);
      noise.stop(now + 0.2);
    } catch (e) {}
  }

  /** Combina tom descendente e envelope breve para marcar uma queda dramática. */
  function playDramaticTumbleSound() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Assobio descendente e swoosh de queda
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.55);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

      osc.connect(gain);
      gain.connect(getDestination() || state.audioCtx.destination);
      registerActiveNode(osc);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {}
  }

  /** Sintetiza um impacto grave e curto para o contato da menina com o chão. */
  function playPlayerThudSound() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.22);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(getDestination() || state.audioCtx.destination);
      registerActiveNode(osc);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  /** Produz dois tons ascendentes para a reação de surpresa da menina. */
  function playPlayerShockVoice() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Piu agudo inocente de questionamento
      const freqs = [620, 780];
      freqs.forEach((f, idx) => {
        const startTime = now + idx * 0.08;
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, startTime);
        osc.frequency.exponentialRampToValueAtTime(f * 1.25, startTime + 0.09);
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
        osc.connect(gain);
        gain.connect(getDestination() || state.audioCtx.destination);
        registerActiveNode(osc);
        osc.start(startTime);
        osc.stop(startTime + 0.14);
      });
    } catch (e) {}
  }

  /** Emite notas agudas em sequência rápida para expressar frustração da fada. */
  function playFairyFrustratedSound() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Batimento rápido e agitado em staccato agudo
      const notes = [1046, 880, 1174, 783, 987];
      notes.forEach((f, idx) => {
        const startTime = now + idx * 0.045;
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, startTime);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);
        osc.connect(gain);
        gain.connect(getDestination() || state.audioCtx.destination);
        registerActiveNode(osc);
        osc.start(startTime);
        osc.stop(startTime + 0.08);
      });
    } catch (e) {}
  }

  /** Toca a fanfarra que marca o início da subida da terceira fase. */
  function playPhase3StartFanfare() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Fanfarra mística dramática de menor para maior para a subida caótica
      const chords = [440, 554, 659, 880, 1108];
      chords.forEach((freq, idx) => {
        const startTime = now + idx * 0.07;
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.16, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        osc.connect(gain);
        gain.connect(getDestination() || state.audioCtx.destination);
        registerActiveNode(osc);
        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch (e) {}
  }

  // --- SEGUNDA FASE: SALA DE BRINQUEDOS / SALA ILUMINADA (TRILHA OFICIAL) ---
  let toyRoomAudio = null;
  let toyRoomMusicTrack = 'theme';
  let toyRoomTrackFallbackIndex = 0;
  let wasToyRoomAudioPlaying = false;
  let wasMusicTrackPlaying = false;

  /** Resolve URLs em ordem de fallback para a faixa temática ou de espada. */
  function getToyRoomTrackUrls(track) {
    const fileName = track === 'sword' ? 'Circular Dissonance (1).mp3' : 'The Circle Game.mp3';
    const encodedFileName = encodeURIComponent(fileName);
    return [
      new URL(`../../assets/audio/${encodedFileName}`, import.meta.url).href,
      new URL(`../audio/${encodedFileName}`, import.meta.url).href,
      `/src/audio/${encodedFileName}`,
    ];
  }

  /** Cria uma única mídia HTML da sala e instala fallback, loop e volume inicial. */
  function getToyRoomAudioElement() {
    if (!toyRoomAudio) {
      try {
        const trackUrls = getToyRoomTrackUrls(toyRoomMusicTrack);
        toyRoomAudio = new Audio(trackUrls[0]);
        toyRoomAudio.onerror = () => {
          const currentTrackUrls = getToyRoomTrackUrls(toyRoomMusicTrack);
          toyRoomTrackFallbackIndex++;
          if (toyRoomTrackFallbackIndex >= currentTrackUrls.length) {
            console.warn(`Trilha da Toy Room não pôde ser carregada: ${toyRoomMusicTrack}`);
            return;
          }
          toyRoomAudio.src = currentTrackUrls[toyRoomTrackFallbackIndex];
          if (isToyRoomMusicWanted && !isMuted) {
            toyRoomAudio.play().catch(() => {});
          }
        };
        toyRoomAudio.loop = true;
        toyRoomAudio.volume = Math.max(
          0,
          Math.min(
            1,
            0.58 * (isMuted ? 0 : masterVolume) * toyRoomMusicFade * toyRoomMusicIntensity,
          ),
        );
        toyRoomAudio.preload = 'auto';

        // Loop contínuo e sem interrupções
        toyRoomAudio.addEventListener('ended', () => {
          if (isToyRoomMusicWanted && !isMuted) {
            toyRoomAudio.currentTime = 0;
            toyRoomAudio.play().catch(() => {});
          }
        });
      } catch (err) {
        console.warn('Trilha da Fase 2 (The Circle Game.mp3) não pôde ser inicializada:', err);
      }
    }
    return toyRoomAudio;
  }

  /** Troca a faixa validada, reinicia a posição e tenta reproduzi-la se estiver solicitada. */
  function setToyRoomMusicTrack(track) {
    if (track !== 'theme' && track !== 'sword') {
      throw new RangeError(`Trilha desconhecida da Toy Room: ${track}`);
    }
    if (toyRoomMusicTrack === track) return;

    toyRoomMusicTrack = track;
    toyRoomTrackFallbackIndex = 0;
    const audioEl = getToyRoomAudioElement();
    const [primaryUrl] = getToyRoomTrackUrls(track);
    audioEl.src = primaryUrl;
    audioEl.currentTime = 0;
    audioEl.load();
    audioEl.volume = Math.max(
      0,
      Math.min(1, 0.58 * (isMuted ? 0 : masterVolume) * toyRoomMusicFade * toyRoomMusicIntensity),
    );
    if (isToyRoomMusicWanted && !isMuted) {
      audioEl.play().catch(() => {});
    }
  }

  /** Ativa a trilha da sala com fade inicial e encerra música e efeitos da fase anterior. */
  function startToyRoomMusic({ fade = 1 } = {}) {
    effectsPaused = false;
    if (toyRoomMusicTrack !== 'theme') setToyRoomMusicTrack('theme');
    toyRoomMusicFade = Math.max(0, Math.min(1, fade));
    isToyRoomMusicWanted = true;
    stopMusic(); // Interrompe qualquer trilha da fase anterior
    clearActiveSounds(); // Limpa efeitos sonoros remanescentes da fase anterior

    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume().catch(() => {});
    }

    const audioEl = getToyRoomAudioElement();
    if (audioEl) {
      audioEl.loop = true;
      audioEl.volume = Math.max(
        0,
        Math.min(1, 0.58 * (isMuted ? 0 : masterVolume) * toyRoomMusicFade * toyRoomMusicIntensity),
      );
      if (audioEl.paused && !isMuted) {
        audioEl.play().catch(() => {
          // Bloqueio de reprodução automática prevenido até a primeira interação
        });
      }
    }
  }

  // Envelope da entrada separado do volume escolhido pelo jogador e do estado de mudo.
  /** Ajusta o envelope de entrada da sala, separado do volume escolhido pelo jogador. */
  function setToyRoomMusicFade(value) {
    toyRoomMusicFade = Math.max(0, Math.min(1, value));
    updateMusicVolumes();
  }

  /** Limita a intensidade musical da sala e reaplica o volume efetivo. */
  function setToyRoomMusicIntensity(value) {
    toyRoomMusicIntensity = Math.max(1, Math.min(1.4, Number.isFinite(value) ? value : 1));
    updateMusicVolumes();
  }

  /** Sintetiza uma varredura de ruído filtrado para a saída pelo portal. */
  function playPortalExitWhoosh() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;
      const buffer = state.audioCtx.createBuffer(
        1,
        state.audioCtx.sampleRate * 0.8,
        state.audioCtx.sampleRate,
      );
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++)
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const source = state.audioCtx.createBufferSource(),
        filter = state.audioCtx.createBiquadFilter(),
        gain = state.audioCtx.createGain();
      source.buffer = buffer;
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.8);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
      gain.gain.linearRampToValueAtTime(0, now + 0.8);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(getDestination());
      source.onended = () => {
        activeAudioNodes.delete(source);
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
      };
      activeAudioNodes.add(source);
      source.start(now);
      source.stop(now + 0.8);
    } catch (error) {
      console.warn('Não foi possível reproduzir portal_exit_whoosh:', error);
    }
  }

  /** Emite um pequeno acorde mágico e desconecta os nós ao fim de cada nota. */
  function playSoftMagicBurst() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;
      for (const frequency of [659.25, 987.77, 1318.51]) {
        const oscillator = state.audioCtx.createOscillator(),
          gain = state.audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        oscillator.connect(gain);
        gain.connect(getDestination());
        oscillator.onended = () => {
          activeAudioNodes.delete(oscillator);
          oscillator.disconnect();
          gain.disconnect();
        };
        activeAudioNodes.add(oscillator);
        oscillator.start(now);
        oscillator.stop(now + 0.7);
      }
    } catch (error) {
      console.warn('Não foi possível reproduzir soft_magic_burst:', error);
    }
  }

  /** Cancela a trilha da sala e reinicia a mídia sem afetar a música principal. */
  function stopToyRoomMusic() {
    isToyRoomMusicWanted = false;
    wasToyRoomAudioPlaying = false;
    if (toyRoomAudio) {
      try {
        toyRoomAudio.pause();
        toyRoomAudio.currentTime = 0;
      } catch (e) {}
    }
  }

  /** Pausa as trilhas e efeitos especializados, guardando quais mídias estavam tocando. */
  function pauseMusic() {
    effectsPaused = true;
    arenaEffects.stop();
    gameEffects.stop();
    if (toyRoomAudio && !toyRoomAudio.paused) {
      wasToyRoomAudioPlaying = true;
      try {
        toyRoomAudio.pause();
      } catch (e) {}
    }
    if (state.musicTrack && !state.musicTrack.paused) {
      wasMusicTrackPlaying = true;
      try {
        state.musicTrack.pause();
      } catch (e) {}
    }
  }

  /** Retoma somente a trilha solicitada antes da pausa e não inicia áudio em modo mudo. */
  function resumeMusic() {
    effectsPaused = false;
    if (isMuted) return;
    if (isToyRoomMusicWanted && toyRoomAudio) {
      if (wasToyRoomAudioPlaying || toyRoomAudio.paused) {
        toyRoomAudio.play().catch(() => {});
        wasToyRoomAudioPlaying = false;
      }
    } else if (isMusicWanted && state.musicTrack) {
      if (wasMusicTrackPlaying || state.musicTrack.paused) {
        state.musicTrack.play().catch(() => {});
        wasMusicTrackPlaying = false;
      }
    }
  }

  /** Emite um arpejo ascendente ao recolher um brinquedo. */
  function playPickUpSound() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Arpejo alegre ascendente de 3 tons
      const notes = [523.25, 659.25, 783.99]; // Dó5, Mi5, Sol5
      notes.forEach((freq, idx) => {
        const startTime = now + idx * 0.055;
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.14, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

        osc.connect(gain);
        gain.connect(getDestination() || state.audioCtx.destination);
        registerActiveNode(osc);
        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
    } catch (e) {}
  }

  /** Toca o impacto suave associado a soltar um brinquedo no chão. */
  function playDropSound() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Toque suave e orgânico ao pousar o brinquedo no chão
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.11);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(getDestination() || state.audioCtx.destination);
      registerActiveNode(osc);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  }

  /** Toca um acorde cintilante quando um brinquedo é guardado no baú. */
  function playOrganizeChime() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Sino mágico cintilante ao guardar o brinquedo dentro do baú
      const chord = [523.25, 659.25, 783.99, 1046.5]; // Glockenspiel em Dó maior
      chord.forEach((freq, idx) => {
        const startTime = now + idx * 0.06;
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(getDestination() || state.audioCtx.destination);
        registerActiveNode(osc);
        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch (e) {}
  }

  /** Emite uma fanfarra em notas escalonadas para a conclusão da sala. */
  function playToyRoomVictory() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Fanfarra triunfante e festiva
      const notes = [
        {
          f: 523.25,
          t: 0.0,
          d: 0.18,
        },
        {
          f: 659.25,
          t: 0.16,
          d: 0.18,
        },
        {
          f: 783.99,
          t: 0.32,
          d: 0.18,
        },
        {
          f: 1046.5,
          t: 0.48,
          d: 0.55,
        },
        {
          f: 1318.5,
          t: 0.72,
          d: 0.85,
        },
      ];

      notes.forEach((n) => {
        const startTime = now + n.t;
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, startTime);

        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.d);

        osc.connect(gain);
        gain.connect(getDestination() || state.audioCtx.destination);
        registerActiveNode(osc);
        osc.start(startTime);
        osc.stop(startTime + n.d + 0.05);
      });
    } catch (e) {}
  }

  /** Resolve o perfil de som de combate e encaminha eventos especiais aos sintetizadores próprios. */
  function playCombatSound(event, arena = false) {
    const sounds = {
      player_walk: [150, 92, 'triangle', 0.045, 0.055],
      player_jump: [390, 650, 'sine', 0.1, 0.14],
      player_land: [190, 78, 'triangle', 0.12, 0.12],
      player_attack: [420, 170, 'sawtooth', 0.09, 0.12],
      player_special: [660, 1320, 'sawtooth', 0.16, 0.7],
      player_hit: [220, 92, 'sawtooth', 0.14, 0.18],
      player_death: [180, 48, 'sawtooth', 0.16, 0.48],
      train_walk: [118, 164, 'square', 0.055, 0.09],
      train_steam: [720, 260, 'sawtooth', 0.095, 0.32],
      train_charge: [170, 62, 'square', 0.12, 0.28],
      train_hit: [280, 110, 'triangle', 0.13, 0.22],
      train_death: [240, 65, 'triangle', 0.14, 0.42],
      robot_walk: [210, 130, 'square', 0.05, 0.08],
      robot_laser: [980, 470, 'sawtooth', 0.085, 0.24],
      robot_punch: [340, 92, 'square', 0.13, 0.2],
      robot_hit: [360, 145, 'square', 0.14, 0.2],
      robot_death: [310, 70, 'square', 0.15, 0.42],
      dinosaur_walk: [110, 75, 'triangle', 0.065, 0.11],
      dinosaur_bite: [310, 120, 'sawtooth', 0.12, 0.2],
      dinosaur_rush: [205, 72, 'sawtooth', 0.12, 0.3],
      dinosaur_hit: [245, 92, 'triangle', 0.15, 0.25],
      dinosaur_death: [190, 52, 'triangle', 0.16, 0.48],
      bear_walk: [92, 58, 'triangle', 0.075, 0.13],
      bear_hug: [150, 72, 'triangle', 0.14, 0.3],
      bear_charge: [135, 48, 'sawtooth', 0.16, 0.34],
      bear_leap: [260, 55, 'sawtooth', 0.17, 0.38],
      bear_hit: [170, 56, 'triangle', 0.17, 0.3],
      bear_enrage: [130, 520, 'sawtooth', 0.15, 0.48],
      bear_death: [210, 42, 'triangle', 0.18, 0.58],
      enemy_entry: [480, 760, 'triangle', 0.1, 0.34],
      enemy_return: [520, 180, 'triangle', 0.09, 0.3],
      arena_start: [330, 590, 'triangle', 0.1, 0.4],
      victory: [523, 1047, 'triangle', 0.16, 0.7],
      defeat: [220, 55, 'sawtooth', 0.16, 0.65],
      heart_gain: [660, 990, 'sine', 0.11, 0.22],
      heart_loss: [240, 100, 'triangle', 0.12, 0.22],
    };
    const swordEvent = arena && ['player_attack', 'sword_impact', 'sword_block'].includes(event);
    const profile = sounds[event];
    if (!profile && !swordEvent) throw new RangeError(`Som de combate desconhecido: ${event}`);
    if (!state.audioCtx || state.audioCtx.state !== 'running') return false;

    if (event === 'player_jump') return playJumpSound();

    if (arena) {
      if (effectsPaused || isMuted) return false;
      // O corte tem resposta imediata mesmo no primeiro golpe, antes de decodificar o MP3.
      // A amostra acrescenta o timbre; não substitui o início sincronizado do gesto.
      if (event === 'player_attack') {
        scheduleSwordSound(
          state.audioCtx,
          getDestination() || state.audioCtx.destination,
          registerActiveNode,
          event,
        );
        arenaEffects.play(state.audioCtx, getDestination(), event);
        return true;
      }
      if (arenaEffects.play(state.audioCtx, getDestination(), event)) return true;
    }

    if (swordEvent)
      return scheduleSwordSound(
        state.audioCtx,
        getDestination() || state.audioCtx.destination,
        registerActiveNode,
        event,
      );

    if (event.endsWith('_hit')) {
      return scheduleDamageSound(
        state.audioCtx,
        getDestination() || state.audioCtx.destination,
        registerActiveNode,
        event.slice(0, -4),
        arena,
      );
    }
    if (event.endsWith('_walk') && event !== 'player_walk') {
      return scheduleEnemyMovement(
        state.audioCtx,
        getDestination() || state.audioCtx.destination,
        registerActiveNode,
        event.slice(0, -5),
      );
    }

    let [startFrequency, endFrequency, waveform, volume, duration] = profile;
    if (arena) {
      startFrequency *= 0.7;
      endFrequency *= 0.65;
      volume = Math.min(0.24, volume * 1.35);
      duration *= 1.2;
    }
    // A transferência continua audível, abaixo do contato e da reação do brinquedo.
    if (arena && (event === 'heart_gain' || event === 'heart_loss')) volume *= 0.25;
    const now = state.audioCtx.currentTime;
    const oscillator = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(startFrequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain);
    gain.connect(getDestination() || state.audioCtx.destination);
    registerActiveNode(oscillator);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.01);
    return true;
  }

  const arenaVoices = new Set();

  /** Acrescenta reforço percussivo discreto ao compasso sem criar melodia concorrente. */
  function playArenaMusicBeat(beat) {
    if (!state.audioCtx || state.audioCtx.state !== 'running') return false;
    const now = state.audioCtx.currentTime;
    // Reforço percussivo discreto, sem uma segunda melodia disputando a música da espada.
    for (const [frequency, waveform, volume, duration] of [
      [beat % 4 === 0 ? 80 : 120, 'sine', beat % 4 === 0 ? 0.1 : 0.055, 0.12],
      [beat % 2 === 0 ? 650 : 950, 'triangle', 0.018, 0.045],
    ]) {
      const osc = state.audioCtx.createOscillator(),
        gain = state.audioCtx.createGain();
      osc.type = waveform;
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.35, now + duration);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(getDestination());
      registerActiveNode(osc);
      arenaVoices.add(osc);
      osc.onended = () => {
        activeAudioNodes.delete(osc);
        arenaVoices.delete(osc);
        osc.disconnect();
        gain.disconnect();
      };
      osc.start(now);
      osc.stop(now + duration);
    }
    return true;
  }

  /** Para as vozes percussivas da arena e libera os nós que ainda estiverem ativos. */
  function stopArenaMusic() {
    arenaEffects.stop();
    gameEffects.stop();
    for (const voice of arenaVoices) {
      try {
        voice.stop();
      } catch (_) {}
    }
    arenaVoices.clear();
  }

  return {
    /** Cria ou retoma o contexto de áudio e prepara os sons para reprodução. */
    initAudio,
    /** Inicia ou retoma a trilha do quarto escuro, respeitando o modo musical ativo. */
    startMusic,
    /** Mantém o nome legado da trilha da caixa de música para chamadas existentes. */
    startMusicBox: startMusic,
    /** Interrompe apenas a trilha principal do quarto escuro. */
    stopMusic,
    /** Encerra trilhas e efeitos ativos ao trocar de fase ou descartar a sessão. */
    stopAllAudio,
    /** Para e desconecta os nós de áudio registrados, além de silenciar os efeitos especializados. */
    clearActiveSounds,
    /** Toca o efeito curto do salto quando o contexto de áudio está disponível. */
    playJumpSound,
    /** Toca o som de salto longo com intensidade proporcional ao progresso informado. */
    playLongJumpSound,
    /** Toca o sinal de avanço de nível, variando o motivo conforme o nível. */
    playLevelUpChime,
    /** Emite uma sílaba curta da fada com a frequência solicitada. */
    playFairyVoiceBlip,
    /** Inicia a ambiência da abertura sem depender da trilha de gameplay. */
    playOpeningAmbience,
    /** Toca a risada da fada em uma sequência breve de notas. */
    playFairyLaugh,
    /** Emite a fanfarra de energia usada na fuga. */
    playEscapePowerUp,
    /** Toca o efeito descendente de falha/queda. */
    playFallFailSound,
    /** Simula o rasgo de fita com ruído filtrado e decaimento curto. */
    playTapeRipSound,
    /** Combina assobio e ruído para acentuar uma queda dramática. */
    playDramaticTumbleSound,
    /** Emite o impacto grave do pouso da menina. */
    playPlayerThudSound,
    /** Toca a voz aguda de surpresa da menina. */
    playPlayerShockVoice,
    /** Emite a sequência acelerada associada à frustração da fada. */
    playFairyFrustratedSound,
    /** Marca o início da terceira fase com uma fanfarra crescente. */
    playPhase3StartFanfare,
    /** Ativa a música da sala de brinquedos usando o estado atual de reprodução. */
    startToyRoomMusic,
    /** Seleciona a faixa da sala e atualiza o recurso de áudio associado. */
    setToyRoomMusicTrack,
    /** Ajusta o fade da música da sala, limitado à faixa de volume válida. */
    setToyRoomMusicFade,
    /** Ajusta a intensidade da música da sala sem alterar o volume mestre. */
    setToyRoomMusicIntensity,
    /** Toca o efeito de saída do portal. */
    playPortalExitWhoosh,
    /** Emite a explosão mágica suave usada nas transições. */
    playSoftMagicBurst,
    /** Interrompe a música e os efeitos próprios da sala de brinquedos. */
    stopToyRoomMusic,
    /** Pausa as trilhas em execução sem descartar a posição de reprodução. */
    pauseMusic,
    /** Retoma as trilhas solicitadas antes da pausa. */
    resumeMusic,
    /** Devolve o elemento de áudio da sala para consulta ou integração. */
    getToyRoomAudioElement,
    /** Toca o efeito de pegar um brinquedo. */
    playPickUpSound,
    /** Toca o efeito de soltar um brinquedo. */
    playDropSound,
    /** Toca o sinal musical de organização dos brinquedos. */
    playOrganizeChime,
    /** Executa o acorde de vitória da sala de brinquedos. */
    playToyRoomVictory,
    /** Encaminha o evento de combate ao efeito correspondente, respeitando o contexto ativo. */
    playCombatSound,
    /** Usa a variação de arena do efeito de combate para o evento informado. */
    playArenaSound: (event) => playCombatSound(event, true),
    /** Agenda o pulso musical correspondente ao compasso da arena. */
    playArenaMusicBeat,
    /** Para a trilha específica da arena e libera seus nós ativos. */
    stopArenaMusic,
    /** Define o volume mestre e atualiza trilhas e efeitos ligados ao controlador. */
    setMasterVolume,
    /** Consulta o volume mestre normalizado. */
    getMasterVolume,
    /** Atualiza o estado de mudo e interrompe efeitos quando o áudio é desativado. */
    setMuted,
    /** Informa se o controlador está silenciado. */
    isMuted: getIsMuted,
    /** Alterna o estado de mudo e devolve o novo valor. */
    toggleMute,
    /** Expõe o contexto Web Audio atual, que pode ainda não ter sido inicializado. */
    getAudioContext: () => state.audioCtx,
  };
}
