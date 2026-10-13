/** Trilha procedural própria, regida pela simulação, sem timers em segundo plano. */
export class ArenaAudioProfile {
  constructor(audio) { this.audio = audio; this.mode = 'ROOM'; this.beat = 0; this.clock = 0; }
  transform() { this.mode = 'TRANSFORM'; this.audio?.setToyRoomMusicFade?.(0.25); this.audio?.playCombatSound?.('arena_start'); }
  enter() {
    if (this.mode === 'ARENA') return;
    this.mode = 'ARENA'; this.audio?.stopToyRoomMusic?.();
  }
  update(dt) {
    if (this.mode !== 'ARENA') return;
    this.clock += dt;
    while (this.clock >= 24) { this.clock -= 24; this.audio?.playArenaMusicBeat?.(this.beat++); }
  }
  sound(event) {
    if (this.audio?.playArenaSound) this.audio.playArenaSound(event);
    else this.audio?.playCombatSound?.(event);
  }
  leave({ resume = true } = {}) {
    this.audio?.stopArenaMusic?.();
    if (this.mode !== 'ROOM' && resume) { this.audio?.startToyRoomMusic?.(); this.audio?.setToyRoomMusicFade?.(1); }
    this.mode = 'ROOM';
  }
  snapshot() { return { mode: this.mode, beat: this.beat, clock: this.clock }; }
  restore(saved) {
    if (!saved) return;
    this.beat = saved.beat || 0; this.clock = saved.clock || 0;
    if (saved.mode === 'ARENA') this.enter(); else if (saved.mode === 'TRANSFORM') this.transform();
  }
}
