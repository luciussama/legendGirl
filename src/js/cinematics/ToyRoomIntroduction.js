import { POETIC_LINES, renderPoeticNarration } from '../narrative/PoeticNarrator.js';
const smooth = p => { p = Math.max(0, Math.min(1, p)); return p*p*(3-2*p); };
const GIRL_FRAMES = [{"x": 116, "y": 113, "w": 329, "h": 552, "anchorX": 169.5}, {"x": 666, "y": 99, "w": 310, "h": 561, "anchorX": 187}, {"x": 1215, "y": 140, "w": 274, "h": 522, "anchorX": 140.5}, {"x": 1723, "y": 112, "w": 372, "h": 555, "anchorX": 165}];

/** Sequência exclusiva de entrada pelo portal; não atualiza a simulação da sala. */
export const TOY_ROOM_INTRO_STAGES = Object.freeze([
  { id: 'TR_002', duration: 0.8 },
  { id: 'TR_003', duration: 2.5 },
  { id: 'TR_004', duration: 4 },
  { id: 'TR_005', duration: 4 },
  { id: 'TR_006', duration: 7 },
  { id: 'TR_007', duration: 2 },
  { id: 'TR_008', duration: 3 }
]);
export class ToyRoomIntroduction {
  constructor({ onComplete = () => {}, onEvent = () => {} } = {}) {
    this.onComplete = onComplete;
    this.onEvent = onEvent;
    this.active = false;
    this.time = 0;
  }
  start(context) {
    if (this.active) return false;
    this.active = true;
    this.time = 0;
    if (context) this.prepare(context);
    this.onEvent('PHASE1_COMPLETE');
    return true;
  }
  get stage() {
    let start = 0;
    for (const stage of TOY_ROOM_INTRO_STAGES) {
      if (this.time < start + stage.duration) return { ...stage, time: this.time - start };
      start += stage.duration;
    }
    return { id: 'TR_009', duration: 0, time: 0 };
  }
  update(dt) {
    if (!this.active) return;
    this.time += Math.max(0, dt) / 60;
    if (this.stage.id === 'TR_008' && !this.musicStarted) {
      this.musicStarted = true;
      this.audio?.startToyRoomMusic({ fade: 0 });
    }
    if (this.musicStarted) this.audio?.setToyRoomMusicFade(Math.min(1, this.stage.time / 3));
    if (this.stage.id === 'TR_009') {
      this.audio?.setToyRoomMusicFade(1);
      this.active = false;
      this.onComplete();
      this.onEvent('TOY_ROOM_START');
      this.assets = null; this.departure = null;
    }
  }
  advanceDialogue(){
    if(!this.active||!this.dialogue)return false;
    const stage=this.stage;
    if(stage.id==='TR_006'&&stage.time<3.1)this.time+=3.9-stage.time;
    else this.time+=stage.duration-stage.time;
    return true;
  }
  prepare({ assets, phase, departure, audio }) {
    this.assets = assets || phase?.assets;
    this.departure = departure;
    this.audio = audio;
    this.musicStarted = false;
    audio?.stopAllAudio();
    audio?.playPortalExitWhoosh();
    audio?.playSoftMagicBurst();
  }

  get dialogue() {
    const { id, time } = this.stage;
    if (id === 'TR_004') return 'Aqui também...';
    if (id === 'TR_005') return 'Eu queria espaço pra brincar.';
    if (id === 'TR_006') return time < 3.1
      ? POETIC_LINES.toyRoomPlay
      : time < 3.9 ? '' : POETIC_LINES.toyRoomPlace;
    if (id === 'TR_007') return 'Vamos. Um de cada vez!';
    return '';
  }

  /** Planos na altura dos olhos; a câmera enquadra a atuação, sem usar o mapa da exploração. */
  cameraFrame(canvas) {
    const { id, time, duration } = this.stage;
    const portrait = canvas.height > canvas.width;
    const cssScale = canvas.width / (canvas.clientWidth || canvas.width);
    const header = Math.min(136 * cssScale, canvas.height * .34);
    const height = Math.min(canvas.height - header - 16 * cssScale, canvas.width * (portrait ? .82 : 9 / 16));
    const viewport = { x: 0, y: header + (canvas.height - header - height) * (portrait ? .25 : .5), width: canvas.width, height };
    const shots = {
      TR_003: [800, 490, 1, 1.08],
      TR_004: [805, 510, 1.42, 1.48],
      TR_005: [950, 485, 1.14, 1.22],
      TR_006: [795, 510, 1.48, 1.57],
      TR_007: [820, 510, 1.38, 1.42],
      TR_008: [820, 490, 1.15, 1]
    };
    const [x, y, from, to] = shots[id] || shots.TR_003;
    const zoom = portrait ? Math.min(1.12, from + (to - from) * smooth(time / duration))
      : from + (to - from) * smooth(time / duration);
    const desiredScale = Math.max(canvas.width / (portrait ? 1050 : 1672), height / 941) * zoom;
    // Em paisagem baixa, abre o plano para conservar a cabeça e as asas de Nanda.
    const scale = portrait ? desiredScale : Math.min(desiredScale, Math.max(canvas.width / 1672, height / 470));
    const halfW = viewport.width / scale / 2, halfH = height / scale / 2;
    return { viewport, zoom: scale, x: Math.max(halfW, Math.min(1672 - halfW, portrait ? 840 : x)),
      y: Math.max(halfH, Math.min(941 - halfH, y)) };
  }

  fairyPosition() {
    const { id, time, duration } = this.stage;
    const p = smooth(time / duration);
    // Nanda observa a sala e volta à altura do olhar da menina antes de falar.
    const x = id === 'TR_005' ? 990 + Math.sin(p * Math.PI) * 170 : 990;
    return { x, y: 385 + Math.sin(this.time * 3) * 9 - (id === 'TR_005' ? Math.sin(p * Math.PI) * 80 : 0) };
  }

  /** Mantém os pés no tapete; respiração altera só a altura, nunca desloca a base. */
  drawGirl(ctx) {
    const { id, time } = this.stage;
    const pose = id === 'TR_003' ? 0 : id === 'TR_004' || id === 'TR_005' ? 1 : id === 'TR_006' ? 2 : 3;
    const frame = GIRL_FRAMES[pose], image = this.assets.get('toy-room-intro-girl-v1');
    if (!image) return;
    const scale = 485 / 561;
    const breath = 1 + Math.sin(this.time * 2.1) * .003;
    const entry = id === 'TR_003' ? 1 - smooth(time / 1.8) : 0;
    const x = 710 - entry * 110, base = 805;
    ctx.save();
    ctx.fillStyle = 'rgba(49,27,15,.22)';
    ctx.beginPath();ctx.ellipse(x, base - 4, 78, 15, 0, 0, Math.PI * 2);ctx.fill();
    ctx.drawImage(image, frame.x, frame.y, frame.w, frame.h,
      x - frame.anchorX * scale, base - frame.h * scale * breath, frame.w * scale, frame.h * scale * breath);
    ctx.restore();
  }

  drawFairy(ctx) {
    const image = this.assets.get('toy-room-illustrated-fairy-v1');
    if (!image) return;
    const fairy = this.fairyPosition();
    ctx.save();ctx.translate(fairy.x, fairy.y);
    ctx.rotate(Math.sin(this.time * 3) * .045);
    const scale = 120 / image.height, left = image.width * .24, right = image.width * .77;
    const beat = .72 + .28 * Math.abs(Math.sin(this.time * (this.stage.id === 'TR_007' ? 32 : 18)));
    const x = -image.width * scale / 2, y = -60;
    ctx.shadowColor = '#ffdb84';ctx.shadowBlur = 16;
    ctx.drawImage(image, left, 0, right-left, image.height, x+left*scale, y, (right-left)*scale, 120);
    ctx.shadowBlur = 0;
    ctx.drawImage(image, 0, 0, left, image.height, x+left*scale-left*scale*beat, y, left*scale*beat, 120);
    ctx.drawImage(image, right, 0, image.width-right, image.height, x+right*scale, y, (image.width-right)*scale*beat, 120);
    ctx.restore();
  }

  render(ctx, canvas) {
    if (!this.active || !this.assets) return;
    const { id, time, duration } = this.stage;
    ctx.save();
    ctx.fillStyle = '#100c10'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (id === 'TR_002') {
      if (this.departure) ctx.drawImage(this.departure, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = `rgba(255,250,240,${smooth(time / duration)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore(); return;
    }
    const frame = this.cameraFrame(canvas), v = frame.viewport;
    ctx.save();ctx.beginPath();ctx.rect(v.x, v.y, v.width, v.height);ctx.clip();
    ctx.translate(v.width / 2, v.y + v.height / 2);
    ctx.scale(frame.zoom, frame.zoom);ctx.translate(-frame.x, -frame.y);
    const room = this.assets.get('toy-room-intro-room-v1');
    if (room) ctx.drawImage(room, 0, 0, 1672, 941);
    this.drawGirl(ctx);
    this.drawFairy(ctx);
    ctx.restore();
    if (id === 'TR_003' || id === 'TR_008') {
      const alpha = id === 'TR_003' ? 1 - smooth(time / 1.1) : smooth((time - duration + .65) / .65);
      ctx.fillStyle = `rgba(255,250,240,${alpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (this.dialogue) this.drawDialogue(ctx, canvas, this.dialogue);
    ctx.restore();
  }

  drawDialogue(ctx, canvas, text) {
    renderPoeticNarration(ctx, canvas, text, this.stage.id === 'TR_006' ? {}
      : { heading: this.stage.id === 'TR_007' ? 'Nanda' : 'Menina' });
  }
  cancel() {
    if (this.active) this.audio?.stopToyRoomMusic();
    this.active = false; this.time = 0; this.assets = null; this.departure = null;
  }
}
