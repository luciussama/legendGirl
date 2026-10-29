import { scheduleDamageSound } from './toy-room/DamageAudio.js';
import { scheduleSwordSound } from './toy-room/SwordAudio.js';
import { scheduleEnemyMovement } from './toy-room/EnemyMovementAudio.js';
import { ArenaSoundEffects } from './toy-room/ArenaSoundEffects.js';

export function createAudioSystem() {
  const arenaEffects = new ArenaSoundEffects();
  let effectsPaused = false;
  const state = {
    audioCtx: null,
    musicTrack: null,
    masterGainNode: null
  };

  let masterVolume = 1.0;
  let isMuted = false;

  function getDestination() {
    if (!state.audioCtx) return null;
    if (!state.masterGainNode) {
      try {
        state.masterGainNode = state.audioCtx.createGain();
        state.masterGainNode.gain.setValueAtTime(isMuted ? 0 : masterVolume, state.audioCtx.currentTime);
        state.masterGainNode.connect(state.audioCtx.destination);
      } catch (e) {
        return state.audioCtx.destination;
      }
    }
    return state.masterGainNode;
  }

  function updateMusicVolumes() {
    const effectiveVol = isMuted ? 0 : masterVolume;
    if (state.musicTrack) {
      state.musicTrack.volume = Math.max(0, Math.min(1, 0.55 * effectiveVol));
    }
    if (toyRoomAudio) {
      toyRoomAudio.volume = Math.max(0, Math.min(1, 0.58 * effectiveVol * toyRoomMusicFade * toyRoomMusicIntensity));
    }
  }

  function setMasterVolume(vol) {
    masterVolume = Math.max(0, Math.min(1, typeof vol === 'number' ? vol : 1.0));
    if (state.audioCtx && state.masterGainNode) {
      state.masterGainNode.gain.setValueAtTime(isMuted ? 0 : masterVolume, state.audioCtx.currentTime);
    }
    updateMusicVolumes();
    return masterVolume;
  }

  function getMasterVolume() {
    return masterVolume;
  }

  function setMuted(muted) {
    isMuted = Boolean(muted);
    if (isMuted) arenaEffects.stop();
    if (state.audioCtx && state.masterGainNode) {
      state.masterGainNode.gain.setValueAtTime(isMuted ? 0 : masterVolume, state.audioCtx.currentTime);
    }
    updateMusicVolumes();
    return isMuted;
  }

  function toggleMute() {
    return setMuted(!isMuted);
  }

  function getIsMuted() {
    return isMuted;
  }

  let isMusicWanted = false;
  let isToyRoomMusicWanted = false;
  let toyRoomMusicFade = 1;
  let toyRoomMusicIntensity = 1;
  const activeAudioNodes = new Set();

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

  function clearActiveSounds() {
    arenaEffects.stop();
    activeAudioNodes.forEach(node => {
      try {
        if (typeof node.stop === 'function') node.stop();
        if (typeof node.disconnect === 'function') node.disconnect();
      } catch (e) {}
    });
    activeAudioNodes.clear();
  }

  // --- PRIMEIRA FASE: TRILHA SONORA DO QUARTO ESCURO (ORIGINAL INALTERADA) ---
  function getMusicTrack() {
    if (!state.musicTrack) {
      try {
        const fallbackUrl = new URL('../../assets/audio/High-Frequency%20Violin.mp3', import.meta.url).href;
        const primaryUrl = new URL('../../assets/audio/High-Frequency%20Violin.mp3', import.meta.url).href;
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

  function initAudio() {
    try {
      if (!state.audioCtx) {
        state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (state.audioCtx && state.audioCtx.state === 'suspended') {
        state.audioCtx.resume().catch(() => {});
      }

      arenaEffects.preload(state.audioCtx);

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

  function stopMusic() {
    isMusicWanted = false;
    if (state.musicTrack) {
      try {
        state.musicTrack.pause();
        state.musicTrack.currentTime = 0;
      } catch (e) {}
    }
  }

  function stopAllAudio() {
    stopMusic();
    stopToyRoomMusic();
    clearActiveSounds();
  }

  function playJumpSound() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;

      const now = state.audioCtx.currentTime;
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.13);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(getDestination() || state.audioCtx.destination);
      registerActiveNode(osc);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  function playLongJumpSound(progress = 0) {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;

      const now = state.audioCtx.currentTime;
      const pitchScale = 1.0 + Math.max(0, Math.min(1, progress)) * 0.48;

      // Camada 1: Varredura profunda e suave, ascendendo à medida que a potência do salto evolui
      const osc1 = state.audioCtx.createOscillator();
      const gain1 = state.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(420 * pitchScale, now);
      osc1.frequency.exponentialRampToValueAtTime(840 * pitchScale, now + 0.22);
      gain1.gain.setValueAtTime(0.16, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc1.connect(gain1);
      gain1.connect(getDestination() || state.audioCtx.destination);
      registerActiveNode(osc1);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Camada 2: Harmônicos agudos cintilantes
      const osc2 = state.audioCtx.createOscillator();
      const gain2 = state.audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1050 * pitchScale, now);
      osc2.frequency.exponentialRampToValueAtTime(1750 * pitchScale, now + 0.18);
      gain2.gain.setValueAtTime(0.09, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc2.connect(gain2);
      gain2.connect(getDestination() || state.audioCtx.destination);
      registerActiveNode(osc2);
      osc2.start(now);
      osc2.stop(now + 0.22);
    } catch (e) {}
  }

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
        oscillator.connect(gain); gain.connect(getDestination());
        registerActiveNode(oscillator); oscillator.start(now); oscillator.stop(now + 4.1);
      }
    } catch {}
  }

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

  function playBabyThudSound() {
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

  function playBabyShockVoice() {
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

  function getToyRoomTrackUrls(track) {
    const fileName = track === 'sword' ? 'Circular Dissonance (1).mp3' : 'The Circle Game.mp3';
    const encodedFileName = encodeURIComponent(fileName);
    return [
      new URL(`../../assets/audio/${encodedFileName}`, import.meta.url).href,
      new URL(`../audio/${encodedFileName}`, import.meta.url).href,
      `/src/audio/${encodedFileName}`
    ];
  }

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
        toyRoomAudio.volume = Math.max(0, Math.min(1, 0.58 * (isMuted ? 0 : masterVolume) * toyRoomMusicFade * toyRoomMusicIntensity));
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
    audioEl.volume = Math.max(0, Math.min(1, 0.58 * (isMuted ? 0 : masterVolume) * toyRoomMusicFade * toyRoomMusicIntensity));
    if (isToyRoomMusicWanted && !isMuted) {
      audioEl.play().catch(() => {});
    }
  }

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
      audioEl.volume = Math.max(0, Math.min(1, 0.58 * (isMuted ? 0 : masterVolume) * toyRoomMusicFade * toyRoomMusicIntensity));
      if (audioEl.paused && !isMuted) {
        audioEl.play().catch(() => {
          // Bloqueio de reprodução automática prevenido até a primeira interação
        });
      }
    }
  }

  // Envelope da entrada separado do volume escolhido pelo jogador e do estado de mudo.
  function setToyRoomMusicFade(value) {
    toyRoomMusicFade = Math.max(0, Math.min(1, value));
    updateMusicVolumes();
  }

  function setToyRoomMusicIntensity(value) {
    toyRoomMusicIntensity = Math.max(1, Math.min(1.4, Number.isFinite(value) ? value : 1));
    updateMusicVolumes();
  }

  function playPortalExitWhoosh() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;
      const buffer = state.audioCtx.createBuffer(1, state.audioCtx.sampleRate * 0.8, state.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const source = state.audioCtx.createBufferSource(), filter = state.audioCtx.createBiquadFilter(), gain = state.audioCtx.createGain();
      source.buffer = buffer; filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now); filter.frequency.exponentialRampToValueAtTime(180, now + 0.8);
      gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(0.18, now + 0.08); gain.gain.linearRampToValueAtTime(0, now + 0.8);
      source.connect(filter); filter.connect(gain); gain.connect(getDestination());
      source.onended = () => { activeAudioNodes.delete(source); source.disconnect(); filter.disconnect(); gain.disconnect(); };
      activeAudioNodes.add(source); source.start(now); source.stop(now + 0.8);
    } catch (error) { console.warn('Não foi possível reproduzir portal_exit_whoosh:', error); }
  }

  function playSoftMagicBurst() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;
      for (const frequency of [659.25, 987.77, 1318.51]) {
        const oscillator = state.audioCtx.createOscillator(), gain = state.audioCtx.createGain();
        oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(0.045, now + 0.03); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        oscillator.connect(gain); gain.connect(getDestination());
        oscillator.onended = () => { activeAudioNodes.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
        activeAudioNodes.add(oscillator); oscillator.start(now); oscillator.stop(now + 0.7);
      }
    } catch (error) { console.warn('Não foi possível reproduzir soft_magic_burst:', error); }
  }

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

  function pauseMusic() {
    effectsPaused = true;
    arenaEffects.stop();
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

  function playToyRoomVictory() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Fanfarra triunfante e festiva
      const notes = [
        { f: 523.25, t: 0.0, d: 0.18 },
        { f: 659.25, t: 0.16, d: 0.18 },
        { f: 783.99, t: 0.32, d: 0.18 },
        { f: 1046.5, t: 0.48, d: 0.55 },
        { f: 1318.5, t: 0.72, d: 0.85 }
      ];

      notes.forEach(n => {
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
      heart_loss: [240, 100, 'triangle', 0.12, 0.22]
    };
    const swordEvent = arena && ['player_attack', 'sword_impact', 'sword_block'].includes(event);
    const profile = sounds[event];
    if (!profile && !swordEvent) throw new RangeError(`Som de combate desconhecido: ${event}`);
    if (!state.audioCtx || state.audioCtx.state !== 'running') return false;

    if (arena) {
      if (effectsPaused || isMuted) return false;
      // O corte tem resposta imediata mesmo no primeiro golpe, antes de decodificar o MP3.
      // A amostra acrescenta o timbre; não substitui o início sincronizado do gesto.
      if (event === 'player_attack') {
        scheduleSwordSound(state.audioCtx, getDestination() || state.audioCtx.destination,
          registerActiveNode, event);
        arenaEffects.play(state.audioCtx, getDestination(), event);
        return true;
      }
      if (arenaEffects.play(state.audioCtx, getDestination(), event)) return true;
    }

    if (swordEvent) return scheduleSwordSound(state.audioCtx, getDestination() || state.audioCtx.destination,
      registerActiveNode, event);

    if (event.endsWith('_hit')) {
      return scheduleDamageSound(state.audioCtx, getDestination() || state.audioCtx.destination,
        registerActiveNode, event.slice(0,-4), arena);
    }
    if (event.endsWith('_walk') && event !== 'player_walk') {
      return scheduleEnemyMovement(state.audioCtx,getDestination() || state.audioCtx.destination,
        registerActiveNode,event.slice(0,-5));
    }

    let [startFrequency, endFrequency, waveform, volume, duration] = profile;
    if (arena) { startFrequency *= 0.7; endFrequency *= 0.65; volume = Math.min(0.24, volume * 1.35); duration *= 1.2; }
    // A transferência continua audível, abaixo do contato e da reação do brinquedo.
    if (arena && (event === 'heart_gain' || event === 'heart_loss')) volume *= .25;
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
  function playArenaMusicBeat(beat) {
    if (!state.audioCtx || state.audioCtx.state !== 'running') return false;
    const now = state.audioCtx.currentTime;
    // Reforço percussivo discreto, sem uma segunda melodia disputando a música da espada.
    for (const [frequency, waveform, volume, duration] of [
      [beat % 4 === 0 ? 80 : 120, 'sine', beat % 4 === 0 ? 0.1 : 0.055, 0.12],
      [beat % 2 === 0 ? 650 : 950, 'triangle', 0.018, 0.045]
    ]) {
      const osc = state.audioCtx.createOscillator(), gain = state.audioCtx.createGain();
      osc.type = waveform; osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.35, now + duration);
      gain.gain.setValueAtTime(volume, now); gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain); gain.connect(getDestination()); registerActiveNode(osc); arenaVoices.add(osc);
      osc.onended = () => { activeAudioNodes.delete(osc); arenaVoices.delete(osc); osc.disconnect(); gain.disconnect(); };
      osc.start(now); osc.stop(now + duration);
    }
    return true;
  }
  function stopArenaMusic() {
    arenaEffects.stop();
    for (const voice of arenaVoices) { try { voice.stop(); } catch (_) {} }
    arenaVoices.clear();
  }

  return {
    initAudio,
    startMusic,
    startMusicBox: startMusic,
    stopMusic,
    stopAllAudio,
    clearActiveSounds,
    playJumpSound,
    playLongJumpSound,
    playLevelUpChime,
    playFairyVoiceBlip,
    playOpeningAmbience,
    playFairyLaugh,
    playEscapePowerUp,
    playFallFailSound,
    playTapeRipSound,
    playDramaticTumbleSound,
    playBabyThudSound,
    playBabyShockVoice,
    playFairyFrustratedSound,
    playPhase3StartFanfare,
    startToyRoomMusic,
    setToyRoomMusicTrack,
    setToyRoomMusicFade,
    setToyRoomMusicIntensity,
    playPortalExitWhoosh,
    playSoftMagicBurst,
    stopToyRoomMusic,
    pauseMusic,
    resumeMusic,
    getToyRoomAudioElement,
    playPickUpSound,
    playDropSound,
    playOrganizeChime,
    playToyRoomVictory,
    playCombatSound,
    playArenaSound: event => playCombatSound(event, true),
    playArenaMusicBeat,
    stopArenaMusic,
    setMasterVolume,
    getMasterVolume,
    setMuted,
    isMuted: getIsMuted,
    toggleMute,
    getAudioContext: () => state.audioCtx
  };
}
