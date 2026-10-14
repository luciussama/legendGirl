/** Corte de ar, impacto e bloqueio com camadas curtas; respeitam o ganho mestre e a pausa. */
export function scheduleSwordSound(ctx, destination, register, event) {
  if (!['player_attack', 'sword_impact', 'sword_block'].includes(event))
    throw new RangeError(`Som de espada desconhecido: ${event}`);
  const now = ctx.currentTime;
  const voice = (source, nodes, duration, delay = 0) => {
    let previous = source;
    for (const node of nodes) { previous.connect(node); previous = node; }
    previous.connect(destination);
    register(source);
    source.addEventListener('ended', () => {
      source.disconnect();
      for (const node of nodes) node.disconnect();
    }, { once: true });
    source.start(now + delay);
    source.stop(now + delay + duration);
  };
  const envelope = (volume, duration, attack = 0.003, delay = 0) => {
    const gain = ctx.createGain(), start = now + delay;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    return gain;
  };
  const noise = (volume, duration, frequency, end, attack = 0.003) => {
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
    const samples = buffer.getChannelData(0); let seed = 74821;
    for (let i = 0; i < samples.length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      samples[i] = seed / 2147483648 - 1;
    }
    const source = ctx.createBufferSource(); source.buffer = buffer;
    const filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.Q.value = 0.7;
    filter.frequency.setValueAtTime(frequency, now);
    filter.frequency.exponentialRampToValueAtTime(end, now + duration);
    voice(source, [filter, envelope(volume, duration, attack)], duration);
  };
  const tone = (frequency, end, volume, duration, type = 'sine', delay = 0) => {
    const oscillator = ctx.createOscillator(); oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now + delay);
    oscillator.frequency.exponentialRampToValueAtTime(end, now + delay + duration);
    voice(oscillator, [envelope(volume, duration, 0.003, delay)], duration + 0.01, delay);
  };
  if (event === 'player_attack') {
    // A passagem cresce durante a antecipação e chega ao pico junto do corte, no quadro 6.
    noise(0.42, 0.24, 2100, 520, 0.1);
    tone(310, 110, 0.085, 0.15, 'triangle', 0.07);
    tone(1650, 700, 0.045, 0.12, 'sine', 0.08);
  } else if (event === 'sword_impact') {
    // Estalo seco, corpo grave e ressonância da lâmina; a reação do brinquedo continua própria.
    noise(0.38, 0.09, 3100, 850);
    tone(180, 48, 0.29, 0.17, 'triangle');
    tone(960, 740, 0.065, 0.13);
    tone(1720, 1250, 0.04, 0.1);
  } else {
    // O ricochete agudo comunica proteção sem usar o som de dano ou transferir vida.
    noise(0.3, 0.055, 4600, 1700);
    for (const [index, frequency] of [1280, 2070, 3260].entries())
      tone(frequency, frequency * 0.84, 0.12 / (index + 1), 0.2 - index * 0.035);
    tone(230, 95, 0.12, 0.09, 'triangle');
  }
  return true;
}
