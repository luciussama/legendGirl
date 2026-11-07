/** A música da espada continua; a arena acrescenta intensidade e percussão. */
export class ArenaAudioProfile {
  /** Inicializa o perfil no modo da sala e zera os relógios da arena. */
  constructor(audio) {
    this.audio = audio;
    this.mode = 'ROOM';
    this.beat = 0;
    this.clock = 0;
  }
  /** Eleva a intensidade musical e dispara a transição sonora para a arena. */
  transform() {
    this.mode = 'TRANSFORM';
    this.audio?.setToyRoomMusicFade?.(1);
    this.audio?.setToyRoomMusicIntensity?.(1.2);
    this.audio?.playCombatSound?.('arena_start');
  }
  /** Entra na arena uma única vez, evitando reaplicar a intensidade de entrada. */
  enter() {
    if (this.mode === 'ARENA') return;
    this.mode = 'ARENA';
    this.audio?.setToyRoomMusicIntensity?.(1.4);
  }
  /** Emite batidas em intervalos fixos, preservando o excedente de dt entre quadros. */
  update(dt) {
    if (this.mode !== 'ARENA') return;
    this.clock += dt;
    while (this.clock >= 24) {
      this.clock -= 24;
      this.audio?.playArenaMusicBeat?.(this.beat++);
    }
  }
  /** Encaminha o evento ao mixer da arena ou usa o som de combate como alternativa. */
  sound(event) {
    if (this.audio?.playArenaSound) this.audio.playArenaSound(event);
    else this.audio?.playCombatSound?.(event);
  }
  /** Encerra a camada da arena e, se solicitado, retoma a música da sala. */
  leave({ resume = true } = {}) {
    this.audio?.stopArenaMusic?.();
    this.audio?.setToyRoomMusicIntensity?.(1);
    if (this.mode !== 'ROOM' && resume) {
      this.audio?.startToyRoomMusic?.();
      this.audio?.setToyRoomMusicFade?.(1);
    }
    this.mode = 'ROOM';
  }
  /** Captura modo e posição rítmica para persistir a continuidade da música. */
  snapshot() {
    return {
      mode: this.mode,
      beat: this.beat,
      clock: this.clock,
    };
  }
  /** Restaura relógios salvos e reaplica o perfil musical correspondente ao modo. */
  restore(saved) {
    if (!saved) return;
    this.beat = saved.beat || 0;
    this.clock = saved.clock || 0;
    if (saved.mode === 'ARENA') this.enter();
    else if (saved.mode === 'TRANSFORM') this.transform();
  }
}
