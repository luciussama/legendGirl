import { GameSoundEffects, preloadGameSounds } from '../audio/GameSoundEffects.js';
import { audibleInsects } from '../audio/insectSoundscape.js';
import { scheduleDamageSound } from '../toy-room/damageAudio.js';
/** Trilha fornecida pelo usuário em loop e sinais curtos, seguindo as opções do host. */
export class GardenAudio {
  /** Cria trilha em loop, vozes curtas e handlers de erro seguindo o host de áudio. */
  constructor(
    host,
    {
      track = new URL('../../../assets/audio/Blues Shuffle Loop.mp3', import.meta.url),
      label = 'do jardim',
      wingScene = 'garden',
    } = {},
  ) {
    this.host = host;
    this.samples = new GameSoundEffects();
    this.wingScene = wingScene;
    this.voices = new Set();
    this.paused = false;
    this.disposed = false;
    this.playPending = false;
    this.wantsMusic = false;
    this.music = new Audio(track);
    this.music.preload = 'auto';
    this.music.loop = true;
    this.music.volume = 0;
    this.onError = () => {
      this.error = `A trilha ${label} não pôde ser carregada.`;
    };
    this.music.addEventListener('error', this.onError);
  }
  /** Libera o host de áudio, prepara amostras e tenta iniciar a trilha. */
  unlock() {
    if (this.disposed) return;
    this.host?.initAudio?.();
    this.samplesContext = this.host?.getAudioContext?.();
    preloadGameSounds(this.samplesContext);
    this.playMusic();
  }
  /** Toca um tom sintetizado com volume do host e libera nós ao terminar. */
  tone(frequency, duration = 0.25, volume = 0.035, slide = frequency) {
    const ctx = this.host?.getAudioContext?.();
    if (this.disposed || !ctx || ctx.state !== 'running' || this.paused || this.host?.isMuted?.())
      return;
    const oscillator = ctx.createOscillator(),
      gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(slide, ctx.currentTime + duration);
    gain.gain.setValueAtTime(volume * (this.host?.getMasterVolume?.() ?? 1), ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    const voice = {
      oscillator,
      gain,
    };
    this.voices.add(voice);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
      this.voices.delete(voice);
    };
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  }
  /** Contato seco e reação curta da menina; usa o mesmo volume e ciclo de pausa da fase. */
  hurt() {
    const ctx = this.host?.getAudioContext?.();
    if (this.disposed || !ctx || ctx.state !== 'running' || this.paused || this.host?.isMuted?.())
      return;
    const gain = ctx.createGain(),
      active = new Set();
    gain.gain.value = (this.host?.getMasterVolume?.() ?? 1) * 0.8;
    gain.connect(ctx.destination);
    scheduleDamageSound(
      ctx,
      gain,
      (source) => {
        const voice = {
          oscillator: source,
          gain,
        };
        active.add(voice);
        this.voices.add(voice);
        source.addEventListener(
          'ended',
          () => {
            active.delete(voice);
            this.voices.delete(voice);
            if (!active.size) gain.disconnect();
          },
          {
            once: true,
          },
        );
      },
      'player',
    );
  }
  /** Tenta novamente após uma interação quando o navegador bloquear autoplay. */
  playMusic() {
    if (this.disposed || !this.wantsMusic || !this.music.paused || this.playPending) return;
    this.playPending = true;
    this.music
      .play()
      .then(() => {
        if (this.disposed || !this.wantsMusic) this.music.pause();
      })
      .catch(() => {
        /* O próximo gesto do jogador permite retomar. */
      })
      .finally(() => {
        this.playPending = false;
      });
  }
  /** Sincroniza mudo, pausa, volume, trilha e emissores de asas com o estado da fase. */
  update(state, paused = false) {
    if (this.disposed) return;
    this.paused = paused;
    const muted = Boolean(this.host?.isMuted?.());
    this.music.muted = muted;
    this.music.volume = Math.max(0, Math.min(1, (this.host?.getMasterVolume?.() ?? 1) * 0.35));
    this.wantsMusic = !paused && !muted;
    if (this.wantsMusic) this.playMusic();
    else this.music.pause();
    if (paused || muted) this.clear();
    else this.updateWings(state);
  }
  /** Mapeia eventos de jogo para amostras ou tons sem contornar as opções de áudio. */
  event(type, { mudTakeoff = false } = {}) {
    if (type === 'jump') this.sample('jump', 0.325, mudTakeoff);
    else if (type === 'mud-impact') this.sample('mud', 0.8);
    else if (type === 'stomp') this.tone(680, 0.12, 0.055, 1000);
    else if (type === 'hurt') this.hurt();
    else if (type === 'fall') this.tone(280, 0.2, 0.04, 150);
    else if (type === 'checkpoint' || type === 'complete') this.tone(1046, 0.5, 0.04, 1318);
  }
  /** As amostras usam o mesmo volume, mudo e pausa da trilha da fase. */
  sample(name, volume, deduplicate = false) {
    const ctx = this.host?.getAudioContext?.();
    if (this.disposed || this.paused || this.host?.isMuted?.() || !ctx) return false;
    if (deduplicate && name === 'jump' && ctx.currentTime - (this.lastJumpTime ?? -Infinity) < 0.18)
      return false;
    const played = this.samples.play(ctx, ctx.destination, name, {
      volume: volume * (this.host?.getMasterVolume?.() ?? 1),
    });
    if (played && name === 'jump') this.lastJumpTime = ctx.currentTime;
    return played;
  }
  /** Atualiza emissores próximos e encerra loops que deixaram de ser audíveis. */
  updateWings(state) {
    const ctx = this.host?.getAudioContext?.();
    if (!ctx || ctx.state !== 'running') return;
    if (this.samplesContext !== ctx) {
      this.samplesContext = ctx;
      preloadGameSounds(ctx);
    }
    const audible = audibleInsects(state, this.wingScene),
      wanted = new Set();
    for (const e of audible) {
      const channel = `asa-${e.id}-${e.kind}`;
      wanted.add(channel);
      const volume =
        e.volume *
        (e.kind === 'bee' || e.kind === 'dive' ? 2 : 1) *
        (this.host?.getMasterVolume?.() ?? 1);
      this.samples.play(ctx, ctx.destination, e.kind, {
        volume,
        rate: e.rate,
        pan: e.pan,
        loop: true,
        channel,
      });
      this.samples.update(channel, volume, e.pan, e.rate);
    }
    for (const [key, v] of this.samples.voices)
      if (v.loop && !wanted.has(key)) this.samples.stop(key, 0.12);
    for (const [key, v] of this.samples.voices)
      if (!v.loop)
        this.samples.update(
          key,
          (v.name === 'mud' ? 0.8 : 0.325) * (this.host?.getMasterVolume?.() ?? 1),
        );
  }
  /** Interrompe vozes e reinicia a deduplicação de salto. */
  clear() {
    this.lastJumpTime = -Infinity;
    this.samples.stop();
    for (const voice of this.voices) {
      voice.oscillator.onended = null;
      try {
        voice.oscillator.stop();
      } catch {}
      voice.oscillator.disconnect();
      voice.gain.disconnect();
    }
    this.voices.clear();
  }
  /** Descarta trilha e recursos de áudio de forma idempotente. */
  destroy() {
    if (this.disposed) return;
    this.disposed = true;
    this.wantsMusic = false;
    this.music.pause();
    this.music.removeEventListener('error', this.onError);
    this.music.removeAttribute('src');
    this.music.load();
    this.clear();
  }
}
