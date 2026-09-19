export function createAudioSystem() {
  const state = {
    audioCtx: null,
    musicTrack: null
  };

  let isMusicWanted = false;
  let isToyRoomMusicWanted = false;
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
        const fallbackUrl = new URL('../audio/High-Frequency%20Violin.mp3', import.meta.url).href;
        const primaryUrl = '/assets/audio/High-Frequency%20Violin.mp3';
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
        state.musicTrack.volume = 0.55;
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
    try {
      isMusicWanted = true;
      stopToyRoomMusic(); // Garante que a música da sala de brinquedos pare

      if (state.audioCtx && state.audioCtx.state === 'suspended') {
        state.audioCtx.resume().catch(() => {});
      }

      const track = getMusicTrack();
      if (track) {
        track.volume = 0.55;
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
      gain.connect(state.audioCtx.destination);
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

      // Layer 1: Airy deep sweep, ascending higher as jump power upgrades
      const osc1 = state.audioCtx.createOscillator();
      const gain1 = state.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(420 * pitchScale, now);
      osc1.frequency.exponentialRampToValueAtTime(840 * pitchScale, now + 0.22);
      gain1.gain.setValueAtTime(0.16, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc1.connect(gain1);
      gain1.connect(state.audioCtx.destination);
      registerActiveNode(osc1);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Layer 2: Shimmering high harmonics
      const osc2 = state.audioCtx.createOscillator();
      const gain2 = state.audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1050 * pitchScale, now);
      osc2.frequency.exponentialRampToValueAtTime(1750 * pitchScale, now + 0.18);
      gain2.gain.setValueAtTime(0.09, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc2.connect(gain2);
      gain2.connect(state.audioCtx.destination);
      registerActiveNode(osc2);
      osc2.start(now);
      osc2.stop(now + 0.22);
    } catch (e) {}
  }

  function playLevelUpChime(level = 0) {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;

      const now = state.audioCtx.currentTime;
      const baseFreq = 587 + Math.min(level, 11) * 45; // D5 up to high notes
      const freqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];

      freqs.forEach((f, i) => {
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.045);
        gain.gain.setValueAtTime(0.08, now + i * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.18);
        osc.connect(gain);
        gain.connect(state.audioCtx.destination);
        registerActiveNode(osc);
        osc.start(now + i * 0.045);
        osc.stop(now + i * 0.045 + 0.2);
      });
    } catch (e) {}
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
      gain.connect(state.audioCtx.destination);
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
        gain.connect(state.audioCtx.destination);
        registerActiveNode(osc);
        osc.start(startTime);
        osc.stop(startTime + 0.12);
      });
    } catch (e) {}
  }

  function playEscapePowerUp() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;

      const chords = [523.25, 659.25, 783.99, 1046.5]; // C5 major triumphant fanfarre
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
        gain.connect(state.audioCtx.destination);
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
      gain.connect(state.audioCtx.destination);
      registerActiveNode(osc);
      osc.start(now);
      osc.stop(now + 0.42);
    } catch (e) {}
  }

  function playTapeRipSound() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Filtered noise burst simulating paper tape peeling off wall
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
      gain.connect(state.audioCtx.destination);

      registerActiveNode(noise);
      noise.start(now);
      noise.stop(now + 0.2);
    } catch (e) {}
  }

  function playDramaticTumbleSound() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Descending whistle / swoosh
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.55);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
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
      gain.connect(state.audioCtx.destination);
      registerActiveNode(osc);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  function playBabyShockVoice() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Innocent questioning high chirp
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
        gain.connect(state.audioCtx.destination);
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

      // Hurried, annoyed high staccato flutter
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
        gain.connect(state.audioCtx.destination);
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

      // Dramatic minor-to-major mystical fanfare for the chaotic climb
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
        gain.connect(state.audioCtx.destination);
        registerActiveNode(osc);
        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch (e) {}
  }

  // --- SEGUNDA FASE: SALA DE BRINQUEDOS / SALA ILUMINADA (TRILHA ANEXADA) ---
  let toyRoomAudio = null;

  function getToyRoomAudioElement() {
    if (!toyRoomAudio) {
      try {
        const fallbackUrl = new URL('../audio/toy_room_theme.mp3', import.meta.url).href;
        const primaryUrl = '/assets/audio/toy_room_theme.mp3';
        toyRoomAudio = new Audio(primaryUrl);
        toyRoomAudio.onerror = () => {
          if (toyRoomAudio && toyRoomAudio.src !== fallbackUrl) {
            toyRoomAudio.src = fallbackUrl;
            if (isToyRoomMusicWanted) {
              toyRoomAudio.play().catch(() => {});
            }
          }
        };
        toyRoomAudio.loop = true;
        toyRoomAudio.volume = 0.58;
        toyRoomAudio.preload = 'auto';

        // Loop contínuo e sem interrupções
        toyRoomAudio.addEventListener('ended', () => {
          if (isToyRoomMusicWanted) {
            toyRoomAudio.currentTime = 0;
            toyRoomAudio.play().catch(() => {});
          }
        });
      } catch (err) {
        console.warn('Trilha da sala de brinquedos não pôde ser inicializada:', err);
      }
    }
    return toyRoomAudio;
  }

  function startToyRoomMusic() {
    isToyRoomMusicWanted = true;
    stopMusic(); // Interrompe a trilha do quarto escuro

    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume().catch(() => {});
    }

    const audioEl = getToyRoomAudioElement();
    if (audioEl) {
      audioEl.volume = 0.58;
      if (audioEl.paused) {
        audioEl.play().catch(() => {
          // Bloqueio de autoplay prevenido
        });
      }
    }
  }

  function stopToyRoomMusic() {
    isToyRoomMusicWanted = false;
    if (toyRoomAudio) {
      try {
        toyRoomAudio.pause();
        toyRoomAudio.currentTime = 0;
      } catch (e) {}
    }
  }

  function playPickUpSound() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Cheerful rising 3-tone arpeggio
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const startTime = now + idx * 0.055;
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.14, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

        osc.connect(gain);
        gain.connect(state.audioCtx.destination);
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

      // Soft organic toy placement thud
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.11);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      registerActiveNode(osc);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  }

  function playOrganizeChime() {
    try {
      if (!state.audioCtx || state.audioCtx.state !== 'running') return;
      const now = state.audioCtx.currentTime;

      // Sparkling magical chime when putting toy in the toy chest
      const chord = [523.25, 659.25, 783.99, 1046.5]; // C major glockenspiel
      chord.forEach((freq, idx) => {
        const startTime = now + idx * 0.06;
        const osc = state.audioCtx.createOscillator();
        const gain = state.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(state.audioCtx.destination);
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

      // Triumphant playful fanfare
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
        gain.connect(state.audioCtx.destination);
        registerActiveNode(osc);
        osc.start(startTime);
        osc.stop(startTime + n.d + 0.05);
      });
    } catch (e) {}
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
    stopToyRoomMusic,
    playPickUpSound,
    playDropSound,
    playOrganizeChime,
    playToyRoomVictory
  };
}
