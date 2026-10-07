import { roomEnvironmentRenderer } from '../toy-room/RoomEnvironmentRenderer.js';
import { toyRenderer } from '../toy-room/ToyRenderer.js';
import { toyRoomEntities } from '../toy-room/ToyRoomEntities.js';
import { POETIC_LINES, renderPoeticNarration } from '../narrative/PoeticNarrator.js';
const smooth = p => { p = Math.max(0, Math.min(1, p)); return p*p*(3-2*p); };
const along = (points, p) => { const q = Math.min(points.length-1.000001, p*(points.length-1)), i = Math.floor(q), t = smooth(q-i); return {x:points[i][0]+(points[i+1][0]-points[i][0])*t,y:points[i][1]+(points[i+1][1]-points[i][1])*t}; };
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
      this.layers = []; this.phase = null; this.departure = null;
    }
  }
  prepare({ phase, departure, audio }) {
    this.phase = phase;
    this.departure = departure;
    this.audio = audio;
    this.musicStarted = false;
    this.layers = [];
    const options = { assets: phase.assets, environmentSheet: phase.environmentFloorTile,
      environmentRug: phase.environmentRug, environmentDoor: phase.environmentDoor,
      environmentDetails: phase.environmentDetails };
    const layer = draw => {
      const c = document.createElement('canvas'); c.width = phase.ROOM_W; c.height = phase.ROOM_H;
      draw(c.getContext('2d')); this.layers.push(c);
    };
    layer(ctx => roomEnvironmentRenderer.renderBackground(ctx, phase.ROOM_W, phase.ROOM_H,
      { ...options, introductionFloorOnly: true }));
    layer(ctx => roomEnvironmentRenderer.drawTrainTracks(ctx, phase.assets.get('toy-room-wooden-track-v1')));
    layer(ctx => {
      if (phase.environmentRug) ctx.drawImage(phase.environmentRug, 650, 555, 300, 255);
      else roomEnvironmentRenderer.drawCentralMandalaRug(ctx, 800, 700);
      roomEnvironmentRenderer.drawFloralPlayMat(ctx, 1180, 520, phase.assets.get('toy-room-oval-rug-v1'));
      roomEnvironmentRenderer.drawBedsideFringeRug(ctx, 280, 920, phase.assets.get('toy-room-rectangular-rug-v1'));
    });
    layer(ctx => phase.toys.forEach(t => toyRenderer.renderToy(ctx, t, -10000, -10000, false, 0,
      { assets: phase.assets, environmentTeddy: phase.environmentTeddy, environmentTrain: phase.environmentTrain })));
    layer(ctx => phase.furniture.forEach(f => roomEnvironmentRenderer.renderFurniture(ctx, f,
      { assets: phase.assets, environmentChest: phase.environmentChest, environmentTable: phase.environmentTable })));
    layer(ctx => {
      roomEnvironmentRenderer.renderBackground(ctx, phase.ROOM_W, phase.ROOM_H, options);
      const nodes = [...phase.furniture.map(f => ({ y: f.y + f.h, f })),
        ...phase.toys.map(t => ({ y: t.y, t }))].sort((a, b) => a.y - b.y);
      nodes.forEach(node => node.f ? roomEnvironmentRenderer.renderFurniture(ctx, node.f,
        { assets: phase.assets, environmentChest: phase.environmentChest, environmentTable: phase.environmentTable })
        : toyRenderer.renderToy(ctx, node.t, -10000, -10000, false, 0,
          { assets: phase.assets, environmentTeddy: phase.environmentTeddy, environmentTrain: phase.environmentTrain }));
    });
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

  cameraFrame(canvas) {
    const { id, time, duration } = this.stage;
    const fit = Math.min(canvas.width / 1600, canvas.height / 1200) * 0.94;
    const medium = Math.min(0.9, canvas.width / 1000, canvas.height / 750);
    const closed = { x: 280, y: 610, zoom: 1.35 };
    const surprised = { x: 450, y: 580, zoom: medium };
    const inspection = { x: 1130, y: 670, zoom: medium };
    if (id === 'TR_005') {
      const fairy = this.fairyPosition(), follow = smooth(Math.min(1, time / 0.3));
      return { x: surprised.x + (fairy.x - surprised.x) * follow,
        y: surprised.y + (fairy.y - surprised.y) * follow, zoom: medium };
    }
    const reflection = { x: 280, y: 610, zoom: 1.2 };
    const overview = { x: 800, y: 600, zoom: fit };
    const pairs = { TR_004: [closed, surprised], TR_005: [surprised, inspection],
      TR_006: [inspection, reflection], TR_007: [reflection, reflection], TR_008: [reflection, overview] };
    const [a, b] = pairs[id] || [closed, closed];
    const p = smooth(Math.min(1, time / (id === 'TR_006' ? 1.2 : duration)));
    return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p,
      zoom: a.zoom + (b.zoom - a.zoom) * p };
  }

  fairyPosition() {
    const { id, time, duration } = this.stage;
    const routes = {
      TR_004: [[220,580],[420,560],[446,442],[403,480],[530,572],[350,550],[230,580]],
      TR_005: [[230,580],[235,350],[780,360],[1440,370],[1280,310],[1130,670]],
      TR_006: [[1130,670],[750,430],[220,585]]
    };
    const route = routes[id];
    if (route) return along(route, Math.min(1, time / (id === 'TR_006' ? 1.2 : duration)));
    return { x: 220 + Math.sin(this.time * 5) * 3,
      y: 585 + Math.sin(this.time * 4) * 3 - (id === 'TR_007' ? Math.sin(Math.min(1, time / 0.6) * Math.PI) * 24 : 0) };
  }

  render(ctx, canvas) {
    if (!this.active || !this.phase) return;
    const { id, time, duration } = this.stage;
    ctx.save();
    ctx.fillStyle = '#fffaf0'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (id === 'TR_002') {
      ctx.drawImage(this.departure, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = `rgba(255,255,255,${smooth(time / duration)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore(); return;
    }
    const frame = this.cameraFrame(canvas);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(frame.zoom, frame.zoom); ctx.translate(-frame.x, -frame.y);
    if (id === 'TR_003') {
      const p = time / duration;
      ctx.filter = `blur(${(1 - p) * 3}px) contrast(${0.3 + p * 0.7}) brightness(${1 + (1 - p) * 1.4})`;
      this.layers.slice(0, 5).forEach((layer, i) => {
        ctx.globalAlpha = smooth(Math.max(0, Math.min(1, (p - i * 0.16) / 0.36)));
        ctx.drawImage(layer, 0, 0);
      });
      ctx.globalAlpha = 1; ctx.filter = 'none';
    } else {
      ctx.drawImage(this.layers[5], 0, 0);
    }
    toyRoomEntities.renderPlayer(ctx, this.phase.player, { assets: this.phase.assets });
    const fairy = this.fairyPosition();
    const image = this.phase.assets.get('toy-room-illustrated-fairy-v1');
    if (!image) {
      toyRoomEntities.renderFairy(ctx, fairy, { assets: this.phase.assets });
    } else {
    ctx.save(); ctx.translate(fairy.x, fairy.y);
    const tilt = id === 'TR_004' ? Math.sin(time * 17) * 0.3 : id === 'TR_005' ? Math.sin(time * 12) * 0.12 : 0;
    ctx.rotate(tilt);
    const scale = 40 / Math.max(image.width, image.height), w = image.width * scale, h = image.height * scale;
    if (id === 'TR_007') {
      // Recortes externos das asas oscilam; corpo e identidade do PNG aprovado são conservados.
      const beat = 0.72 + 0.28 * Math.abs(Math.sin(time * 32));
      const left = image.width * 0.24, right = image.width * 0.77;
      ctx.drawImage(image, left, 0, right-left, image.height, -w/2+left*scale, -h/2, (right-left)*scale, h);
      ctx.drawImage(image, 0, 0, left, image.height, -w/2+left*scale-left*scale*beat, -h/2, left*scale*beat, h);
      ctx.drawImage(image, right, 0, image.width-right, image.height, -w/2+right*scale, -h/2, (image.width-right)*scale*beat, h);
    } else ctx.drawImage(image, -w/2, -h/2, w, h);
    ctx.restore();
    }
    ctx.restore();
    if (id === 'TR_003') {
      ctx.fillStyle = `rgba(255,255,255,${Math.pow(1 - time/duration, 1.5)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (this.dialogue) this.drawDialogue(ctx, canvas, this.dialogue);
    ctx.restore();
  }

  drawDialogue(ctx, canvas, text) {
    if (this.stage.id === 'TR_006') {
      renderPoeticNarration(ctx, canvas, text);
      return;
    }
    text = `${this.stage.id === 'TR_007' ? 'NANDA' : 'MENINA'} · ${text}`;
    const cssWidth = canvas.clientWidth || canvas.width;
    const scale = canvas.width / cssWidth;
    const fontSize = Math.min(20 * scale, canvas.width * 0.045);
    const maxWidth = canvas.width - 40 * scale;
    ctx.font = `bold ${fontSize}px Georgia, serif`;
    const lines = [], words = text.split(' '); let line = '';
    for (const word of words) {
      const next = line ? line + ' ' + word : word;
      if (line && ctx.measureText(next).width > maxWidth - 28 * scale) { lines.push(line); line = word; }
      else line = next;
    }
    if (line) lines.push(line);
    const lineHeight = fontSize * 1.35;
    const height = lineHeight * lines.length + 32 * scale;
    const y = canvas.height - height - 24 * scale;
    ctx.fillStyle = 'rgba(38,24,31,0.9)'; ctx.beginPath();
    ctx.roundRect(20 * scale, y, maxWidth, height, 12 * scale); ctx.fill();
    ctx.fillStyle = '#fff2bd'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    lines.forEach((l, i) => ctx.fillText(l, canvas.width/2, y+16*scale+i*lineHeight));
  }
  cancel() {
    if (this.active) this.audio?.stopToyRoomMusic();
    this.active = false; this.time = 0; this.layers = []; this.phase = null; this.departure = null;
  }
}
