const ROOT = new URL('../../../assets/audio/arena/', import.meta.url);

// Trechos curtos acompanham os gestos; os MP3s originais permanecem intactos.
export const ARENA_SOUND_FILES = Object.freeze({
  player_attack: { file: 'girl attack.mp3', offset: .1, channel: 'sword', duration: .48, volume: .65 },
  sword_block: { file: 'girl defence.mp3', offset: .04, channel: 'block', duration: .55, volume: .6 },
  player_special: { file: 'girl special attack.mp3', offset: .05, channel: 'special', duration: 1.06, volume: .7 },
  train_charge: { file: 'train horn.mp3', offset: 1.26, channel: 'train', duration: 1.1, volume: .45 },
  train_steam: { file: 'train steam attack.mp3', offset: .08, channel: 'train', duration: .9, volume: .55 },
  robot_walk: { file: 'robot noises.mp3', offset: .08, channel: 'robot_move', duration: .45, volume: .22, keepPlaying: true },
  robot_laser: { file: 'robot laser attack.mp3', offset: .13, channel: 'robot', duration: 1.15, volume: .5 },
  robot_punch: { file: 'robot punch.mp3', offset: .35, channel: 'robot', duration: .7, volume: .6 },
  dinosaur_bite: { file: 'dinossaur attack.mp3', offset: .025, channel: 'dinosaur', duration: .8, volume: .5 },
  dinosaur_rush: { file: 'dinossaur attack.mp3', offset: .025, channel: 'dinosaur', duration: 1.1, volume: .5 },
  bear_hug: { file: 'bear attack.mp3', offset: .08, channel: 'bear', duration: .78, volume: .65 },
  bear_charge: { file: 'bear attack.mp3', offset: .08, channel: 'bear', duration: .78, volume: .65 },
  bear_leap: { file: 'bear attack.mp3', offset: .08, channel: 'bear', duration: .78, volume: .65 }
});

/** Amostras da arena no mixer mestre, sem disparar efeitos atrasados após o carregamento. */
export class ArenaSoundEffects {
  constructor() { this.buffers = new Map(); this.loading = null; this.voices = new Map(); }

  preload(ctx) {
    if (!ctx || this.loading) return this.loading;
    this.loading = Promise.all([...new Set(Object.values(ARENA_SOUND_FILES).map(p => p.file))].map(async file => {
      try {
        const response = await fetch(new URL(file, ROOT));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        this.buffers.set(file, await ctx.decodeAudioData(await response.arrayBuffer()));
      } catch (error) {
        console.warn(`Não foi possível carregar o efeito da arena: ${file}`, error);
      }
    }));
    return this.loading;
  }

  stop(channel) {
    for (const [key, voice] of this.voices) {
      if (channel && key !== channel) continue;
      try { voice.source.stop(); } catch { /* Fonte já encerrada. */ }
      voice.source.disconnect(); voice.gain.disconnect(); this.voices.delete(key);
    }
  }

  play(ctx, destination, event) {
    // Reações e transições interrompem caudas ofensivas do personagem anterior.
    // O lançamento não corta a cauda da espada iniciada seis quadros antes.
    if (event === 'player_special') {
      for (const channel of ['train', 'robot', 'robot_move', 'dinosaur', 'bear', 'block']) this.stop(channel);
    }
    if (['enemy_return', 'enemy_entry', 'victory', 'defeat', 'player_death'].includes(event)) this.stop();
    const actor = /^(train|robot|dinosaur|bear)_(hit|death)$/.exec(event)?.[1];
    if (actor) { this.stop(actor); this.stop(actor + '_move'); }
    // A colisão da defesa encerra o soco; sua cauda não compete com o ricochete.
    if (event === 'sword_block' && this.voices.get('robot')?.event === 'robot_punch') this.stop('robot');
    const profile = ARENA_SOUND_FILES[event];
    const buffer = profile && this.buffers.get(profile.file);
    if (!buffer) return false;
    if (profile.keepPlaying && this.voices.has(profile.channel)) return true;
    this.stop(profile.channel);
    const source = ctx.createBufferSource(), gain = ctx.createGain();
    const now = ctx.currentTime, duration = Math.min(buffer.duration - profile.offset, profile.duration);
    source.buffer = buffer;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(profile.volume, now + Math.min(.008, duration / 4));
    gain.gain.setValueAtTime(profile.volume, now + Math.max(.008, duration - .06));
    gain.gain.linearRampToValueAtTime(0, now + duration);
    source.connect(gain); gain.connect(destination);
    const voice = { source, gain, event };
    this.voices.set(profile.channel, voice);
    source.onended = () => {
      source.disconnect(); gain.disconnect();
      if (this.voices.get(profile.channel) === voice) this.voices.delete(profile.channel);
    };
    source.start(now, profile.offset); source.stop(now + duration);
    return true;
  }
}
