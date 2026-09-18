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
    playFallFailSound,
    startMusicBox
  };
}
