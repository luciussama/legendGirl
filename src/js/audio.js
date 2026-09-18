export function createAudioSystem() {
  const state = {
    audioCtx: null,
    musicTimer: null,
    noteIndex: 0,
    musicBoxNotes: [
      587.33, 698.46, 880.0, 1108.73,
      1174.66, 932.33, 783.99, 554.37,
      587.33, 880.0, 1046.5, 932.33,
      783.99, 659.25, 554.37, 440.0
    ],
    musicTrack: null
  };

  function startFallbackMusic() {
    if (state.musicTimer) return;

    state.musicTimer = setInterval(() => {
      if (state.audioCtx && state.audioCtx.state === 'running') {
        playMusicBoxTink(state.musicBoxNotes[state.noteIndex]);
        state.noteIndex = (state.noteIndex + 1) % state.musicBoxNotes.length;
      }
    }, 340);
  }

  function initAudio() {
    if (!state.audioCtx) {
      state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }

    startMusicBox();
  }

  function playMusicBoxTink(freq) {
    if (!state.audioCtx || state.audioCtx.state !== 'running') return;

    const now = state.audioCtx.currentTime;
    const osc1 = state.audioCtx.createOscillator();
    const osc2 = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 3.01, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(state.audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.35);
    osc2.stop(now + 1.35);
  }

  function playJumpSound() {
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
    osc.start(now);
    osc.stop(now + 0.15);
  }

  function playLongJumpSound(progress = 0) {
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
    osc2.start(now);
    osc2.stop(now + 0.22);
  }

  function playLevelUpChime(level = 0) {
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
      osc.start(now + i * 0.045);
      osc.stop(now + i * 0.045 + 0.2);
    });
  }

  function playFairyVoiceBlip(freq = 920) {
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
    osc.start(now);
    osc.stop(now + 0.08);
  }

  function playFairyLaugh() {
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
      osc.start(startTime);
      osc.stop(startTime + 0.12);
    });
  }

  function playEscapePowerUp() {
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
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  function playFallFailSound() {
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
    osc.start(now);
    osc.stop(now + 0.42);
  }

  function startMusicBox() {
    if (state.musicTrack) {
      state.musicTrack.volume = 0.55;

      if (state.musicTrack.paused) {
        state.musicTrack.play().catch(() => {
          startFallbackMusic();
        });
      }

      return;
    }

    try {
      const trackUrl = new URL('../audio/High-Frequency%20Violin.mp3', import.meta.url);
      state.musicTrack = new Audio(trackUrl.href);
      state.musicTrack.loop = true;
      state.musicTrack.volume = 0.55;

      state.musicTrack.play().catch(() => {
        startFallbackMusic();
      });
    } catch (error) {
      startFallbackMusic();
    }
  }

  return {
    initAudio,
    playMusicBoxTink,
    playJumpSound,
    playLongJumpSound,
    playLevelUpChime,
    playFairyVoiceBlip,
    playFairyLaugh,
    playEscapePowerUp,
    playFallFailSound,
    startMusicBox
  };
}
