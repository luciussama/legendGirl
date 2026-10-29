/** Impacto e reação de dor sintetizados, sem vozes externas ou timers. */
export const DAMAGE_AUDIO_PROFILES = Object.freeze({
  player: { pitch:390, end:245, duration:0.28, formants:[850,1450], material:950, impact:115 },
  train: { pitch:650, end:260, duration:0.25, formants:[1400,2200], material:680, impact:145 },
  robot: { pitch:540, end:180, duration:0.25, formants:[1100,2400], material:2300, impact:210 },
  dinosaur: { pitch:270, end:165, duration:0.32, formants:[650,1200], material:750, impact:95 },
  bear: { pitch:160, end:100, duration:0.36, formants:[430,850], material:420, impact:70 }
});

export function scheduleDamageSound(ctx, destination, register, actor, arena = false) {
  const profile = DAMAGE_AUDIO_PROFILES[actor];
  if (!profile) throw new RangeError(`Reação de dano desconhecida: ${actor}`);
  // O contato da espada fica à frente da reação; mantém margem na soma com morte/música.
  const now = ctx.currentTime, power = arena ? (actor === 'player' ? 1.15 : .85) : 1;
  const connectVoice = (source, nodes, start, end) => {
    let previous = source;
    for (const node of nodes) { previous.connect(node); previous=node; }
    previous.connect(destination);
    register(source);
    source.addEventListener('ended', () => {
      source.disconnect(); for (const node of nodes) node.disconnect();
    }, { once:true });
    source.start(start); source.stop(end);
  };
  const envelope = (volume, start, duration, attack = 0.004) => {
    const gain=ctx.createGain();
    gain.gain.setValueAtTime(0.0001,start);
    gain.gain.exponentialRampToValueAtTime(volume*power,start+attack);
    gain.gain.exponentialRampToValueAtTime(0.0001,start+duration);
    return gain;
  };

  // Estalo de contato e corpo grave do golpe: materiais distintos para cada brinquedo.
  const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*0.12),ctx.sampleRate);
  const samples=buffer.getChannelData(0);let seed=12345;
  for(let i=0;i<samples.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;samples[i]=seed/2147483648-1;}
  const noise=ctx.createBufferSource();noise.buffer=buffer;
  const material=ctx.createBiquadFilter();material.type='lowpass';material.frequency.value=profile.material;material.Q.value=0.7;
  connectVoice(noise,[material,envelope(0.22,now,0.11)],now,now+0.12);
  const thud=ctx.createOscillator();thud.type='sine';
  thud.frequency.setValueAtTime(profile.impact,now);
  thud.frequency.exponentialRampToValueAtTime(45,now+0.1);
  connectVoice(thud,[envelope(0.16,now,0.13)],now,now+0.14);

  // A reação começa logo após o contato, deixando o ataque do golpe legível.
  const start=now+0.025,end=start+profile.duration;
  for(const [index,formant] of profile.formants.entries()) {
    const voice=ctx.createOscillator();voice.type=actor==='robot'?'square':'sawtooth';
    voice.frequency.setValueAtTime(profile.pitch*(index?1.008:1),start);
    voice.frequency.exponentialRampToValueAtTime(profile.end,end);
    if(actor==='robot') {
      // Queda eletrônica em dois degraus no painel do robô.
      voice.frequency.setValueAtTime(profile.pitch*0.65,start+0.09);
      voice.frequency.exponentialRampToValueAtTime(profile.end,end);
    }
    const mouth=ctx.createBiquadFilter();mouth.type='bandpass';mouth.frequency.value=formant;mouth.Q.value=actor==='train'?3:2;
    connectVoice(voice,[mouth,envelope(index?0.1:0.16,start,profile.duration,0.015)],start,end+0.01);
  }
  return true;
}
