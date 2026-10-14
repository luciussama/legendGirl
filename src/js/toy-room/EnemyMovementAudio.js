/** Passos e mecanismos dos brinquedos, disparados somente quando há deslocamento real. */
export function scheduleEnemyMovement(ctx,destination,register,actor) {
  const profiles={train:[72,0.18,0.12,650],robot:[155,0.12,0.11,2100],dinosaur:[92,0.1,0.13,900],bear:[58,0.16,0.16,450]};
  const p=profiles[actor];if(!p)return false;
  const now=ctx.currentTime,[pitch,volume,duration,filterFrequency]=p;
  const sound=ctx.createOscillator(),gain=ctx.createGain();
  sound.type=actor==='train'?'sawtooth':actor==='robot'?'triangle':'sine';
  sound.frequency.setValueAtTime(pitch,now);sound.frequency.exponentialRampToValueAtTime(pitch*.45,now+duration);
  gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.004);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
  sound.connect(gain);gain.connect(destination);register(sound);
  sound.addEventListener('ended',()=>{sound.disconnect();gain.disconnect();},{once:true});sound.start(now);sound.stop(now+duration+.01);
  const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);
  let seed=729;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=seed/2147483648-1;}
  const noise=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),rustle=ctx.createGain();noise.buffer=buffer;
  filter.type=actor==='robot'?'bandpass':'lowpass';filter.frequency.value=filterFrequency;filter.Q.value=actor==='robot'?4:.7;
  rustle.gain.setValueAtTime(.0001,now);rustle.gain.exponentialRampToValueAtTime(actor==='bear'?.13:.075,now+.006);rustle.gain.exponentialRampToValueAtTime(.0001,now+duration);
  noise.connect(filter);filter.connect(rustle);rustle.connect(destination);register(noise);
  noise.addEventListener('ended',()=>{noise.disconnect();filter.disconnect();rustle.disconnect();},{once:true});noise.start(now);noise.stop(now+duration);
  return true;
}
