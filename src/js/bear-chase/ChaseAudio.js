const ROOT = new URL('../../../assets/audio/bear-chase/', import.meta.url);

/** Reproduz somente arquivos fornecidos pelo usuário, sem síntese de passos ou serviços externos. */
export class ChaseAudio {
  /** Recebe o sistema mestre para consultar contexto, mudo e volume sem expor a fase. */
  constructor(audio) {
    this.host = audio; this.music = new Audio(new URL('Chase.mp3', ROOT));
    this.music.preload = 'auto'; this.music.loop = true;
    this.buffers = new Map(); this.voices = new Map(); this.indices = { menina: 0, urso: 0 };
    this.started = false; this.paused = false; this.disposed = false; this.loading = null;
    this.musicTime = 0; this.playPending = false; this.error = null;
    this.music.addEventListener('error', () => { this.error = 'A trilha não pôde ser carregada.'; });
  }
  /** Desbloqueia áudio em gesto do usuário e carrega as pequenas amostras uma única vez. */
  unlock() {
    this.host?.initAudio?.();
    const ctx = this.host?.getAudioContext?.();
    if (!ctx || this.loading || this.disposed) return;
    this.loading = Promise.all(['menina', 'urso'].flatMap(actor => Array.from({ length: 6 }, async (_, i) => {
      const key = actor + '-' + String(i + 1).padStart(2, '0');
      const response = await fetch(new URL('passos/' + key + '.wav', ROOT));
      if (!response.ok) throw new Error('Passo não encontrado: ' + key);
      const buffer = await ctx.decodeAudioData(await response.arrayBuffer());
      if (!this.disposed) this.buffers.set(key, buffer);
    }))).catch(() => { this.error = 'Alguns passos não puderam ser carregados.'; });
  }
  /** Toca uma variação de passo com ganho limitado, acompanhando a distância do urso. */
  step(actor, gap) {
    const ctx = this.host?.getAudioContext?.();
    if (this.paused || this.host?.isMuted?.() || ctx?.state !== 'running' || this.voices.size >= 8) return;
    const index = this.indices[actor]++ % 6;
    const buffer = this.buffers.get(actor + '-' + String(index + 1).padStart(2, '0'));
    if (!buffer) return;
    const source = ctx.createBufferSource(), gain = ctx.createGain();
    source.buffer = buffer;
    const distanceGain = actor === 'urso' ? Math.max(.12, 1 / (1 + gap * .12)) : .6;
    gain.gain.value = distanceGain * .65 * (this.host?.getMasterVolume?.() ?? 1);
    source.connect(gain); gain.connect(ctx.destination); this.voices.set(source, { gain, level: distanceGain * .65 });
    source.onended = () => { source.disconnect(); gain.disconnect(); this.voices.delete(source); };
    source.start();
  }
  /** Atualiza trilha e volumes pelo estado; a repetição integral é provisória nesta prova. */
  update(state) {
    if (this.disposed) return;
    const shouldStart = ['CHASE_START', 'RUNNING', 'CAUGHT', 'CHEST_RETURN'].includes(state.stage);
    if (shouldStart && !this.started) {
      this.host?.stopToyRoomMusic?.(); this.host?.stopArenaMusic?.();
      this.started = true;
    }
    const fade = state.stage === 'CAUGHT' ? Math.max(0, 1 - state.age / 1.4)
      : ['CHEST_RETURN', 'COMPLETE'].includes(state.stage) ? 0 : 1;
    const muted = this.host?.isMuted?.();
    this.music.volume = (muted ? 0 : this.host?.getMasterVolume?.() ?? 1) * .35 * fade;
    // Atualiza também vozes existentes ao mutar: pausa imediatamente evita caudas audíveis.
    if (muted) this.stopSteps();
    else for (const { gain, level } of this.voices.values()) gain.gain.value = level * (this.host?.getMasterVolume?.() ?? 1);
    if (this.started && !this.paused && fade > 0 && !muted && this.music.paused && !this.playPending) {
      this.playPending = true;
      this.music.play().catch(() => { /* Nova interação permite tentar novamente. */ }).finally(() => { this.playPending = false; });
    }
    if (fade === 0 || this.paused) this.music.pause();
  }
  /** Interrompe fontes curtas, incluindo caudas, sem fechar o contexto compartilhado. */
  stopSteps() {
    for (const source of this.voices.keys()) { try { source.stop(); } catch (_) { /* Fonte já encerrada. */ } }
    this.voices.clear();
  }
  /** Congela ou retoma música; o update decide quando a etapa permite reprodução. */
  setPaused(value) { this.paused = Boolean(value); if (value) { this.music.pause(); this.stopSteps(); } }
  /** Guarda somente posição musical e intenção, sem serializar elementos de mídia. */
  snapshot() { return { time: this.music.currentTime || 0, started: this.started }; }
  /** Retoma posição quando os metadados ficam disponíveis, sem disparar reprodução. */
  restore(saved) {
    this.started = Boolean(saved?.started);
    const seek = () => { if (!this.disposed) this.music.currentTime = Math.max(0, Number(saved?.time) || 0) % (this.music.duration || 94.08); };
    if (this.music.readyState) seek(); else this.music.addEventListener('loadedmetadata', seek, { once: true });
  }
  /** Libera elementos e buffers próprios sem alterar outros recursos de áudio do jogo. */
  destroy() {
    this.disposed = true; this.music.pause(); this.music.removeAttribute('src'); this.music.load();
    this.stopSteps(); this.buffers.clear();
  }
}
