import { getMobileZoomFrame } from '../controllers/MobileZoom.js';
import { renderPoeticNarration } from '../narrative/PoeticNarrator.js';
import { toyGuideBlend } from '../state/GameDifficulty.js';

const FLOOR_SPAWN_POINTS = Object.freeze(
  [140, 300, 460, 620, 780, 940, 1100, 1260, 1420].flatMap(x =>
    [330, 410, 490, 570, 650, 730, 810, 890, 970, 1050].map(y => ({ x, y })))
);

const INVESTIGATION_BEATS = Object.freeze([
  { duration: 180, speaker: 'NANDA', text: 'Tem alguma coisa estranha...', focus: 'toys' },
  { duration: 60, text: '', focus: 'toys' },
  { duration: 240, speaker: 'MENINA', text: 'Estamos vendo os mesmos brinquedos de novo.', focus: 'toys' },
  { duration: 360, text: 'Os brinquedos continuavam voltando.\nComo se o quarto esquecesse que alguém tinha acabado de guardá-los.', focus: 'toys' },
  { duration: 120, text: '', focus: 'sword' },
  { duration: 300, text: 'Foi então que uma coisa nova apareceu.\nOu talvez estivesse ali desde sempre.', focus: 'sword', reveal: true },
  { duration: 90, speaker: 'MENINA', text: 'Hm?', focus: 'sword' },
  { duration: 180, speaker: 'NANDA', text: 'Que brinquedo é esse?', focus: 'sword' },
  { duration: 150, speaker: 'MENINA', text: 'Eu não lembro dele.', focus: 'sword' },
  { duration: 150, speaker: 'NANDA', text: 'E eu lembraria.', focus: 'sword' }
]);
const INVESTIGATION_DURATION = INVESTIGATION_BEATS.reduce((total, beat) => total + beat.duration, 0);
const RETURN_DIALOGUE_BEATS = Object.freeze([
  { start: 0, end: 60, speaker: 'NANDA', text: 'Estranho...' },
  { start: 90, end: 360, speaker: 'MENINA', text: 'Acho que esse brinquedo já tinha sido guardado.' }
]);
const SWORD_PICKUP_DURATION = 300;
const SWORD_ATTACK_DURATION = 12;
const SWORD_ATTACK_FRAME_SIZE = { width: 144, height: 192, y: 288 };
const SWORD_ATTACK_FRAME_COUNT = 8;

export const createToyRoomStoryState = () => ({
  recurrenceActive: false,
  returnedToyCount: 0,
  pendingReturns: [],
  returnDialogueElapsed: -1,
  investigationStage: 'COLLECTING',
  investigationElapsed: 0,
  sword: null,
  swordPickupElapsed: 0,
  swordEquipped: false,
  attackElapsed: 0,
  attackDirection: 1
});

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const key = point => `${point.x},${point.y}`;

function isFree(room, point, radius = 24) {
  const resolved = room.resolveCollisions(point.x, point.y, radius);
  return resolved.x === point.x && resolved.y === point.y;
}

function reachableFloor(room) {
  const nodes = [];
  for (let x = 120; x <= room.ROOM_W - 120; x += 40) {
    for (let y = 320; y <= room.ROOM_H - 120; y += 40) {
      const point = { x, y };
      if (isFree(room, point)) nodes.push(point);
    }
  }

  const nodesByKey = new Map(nodes.map(point => [key(point), point]));
  const start = nodes.reduce((nearest, point) =>
    !nearest || distance(point, room.player) < distance(nearest, room.player) ? point : nearest, null);
  if (!start) return [];

  const visited = new Set([key(start)]);
  const queue = [start];
  for (let index = 0; index < queue.length; index++) {
    const point = queue[index];
    for (const [dx, dy] of [[40, 0], [-40, 0], [0, 40], [0, -40]]) {
      const next = { x: point.x + dx, y: point.y + dy };
      const nextKey = key(next);
      if (!nodesByKey.has(nextKey) || visited.has(nextKey)) continue;
      if (![0.25, 0.5, 0.75].every(amount =>
        isFree(room, { x: point.x + dx * amount, y: point.y + dy * amount }))) continue;
      visited.add(nextKey);
      queue.push(next);
    }
  }
  return queue;
}

function getWorldViewport(room) {
  const playerX = room.player.x - room.cameraX;
  const playerY = room.player.y - room.cameraY;
  const fairyX = room.fairy.x - room.cameraX;
  const fairyY = room.fairy.y - room.cameraY;
  const frame = getMobileZoomFrame({
    enabled: room.mobilePresentation,
    width: room.canvas.width,
    height: room.canvas.height,
    anchor: { x: playerX, y: playerY },
    bounds: {
      left: Math.min(playerX - 100, fairyX - 28),
      right: Math.max(playerX + 100, fairyX + 28),
      top: Math.min(playerY - 120, fairyY - 28),
      bottom: Math.max(playerY + 80, fairyY + 28)
    }
  });
  return {
    left: room.cameraX - frame.x / frame.zoom,
    top: room.cameraY - frame.y / frame.zoom,
    right: room.cameraX + (room.canvas.width - frame.x) / frame.zoom,
    bottom: room.cameraY + (room.canvas.height - frame.y) / frame.zoom
  };
}

function outsideViewport(point, viewport, margin = 72) {
  return point.x + margin < viewport.left || point.x - margin > viewport.right ||
    point.y + margin < viewport.top || point.y - margin > viewport.bottom;
}

function getBeat(beats, elapsed) {
  let remaining = elapsed;
  for (const beat of beats) {
    if (remaining < beat.duration) return beat;
    remaining -= beat.duration;
  }
  return null;
}

function drawToySword(ctx, x, y, angle, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#765139';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#e8c990';
  ctx.beginPath();
  ctx.moveTo(-4, 1);
  ctx.lineTo(-5, -25);
  ctx.lineTo(0, -41);
  ctx.lineTo(5, -25);
  ctx.lineTo(4, 1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#83c5c8';
  ctx.beginPath();
  ctx.roundRect(-12, -2, 24, 5, 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#c77768';
  ctx.beginPath();
  ctx.roundRect(-3, 2, 6, 12, 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/** Coordena a recorrência dos brinquedos e o arco narrativo da espada de brinquedo. */
export class ToyRoomStory {
  constructor(room) {
    this.room = room;
    this.state = createToyRoomStoryState();
    this.attackFrames = Array.from({ length: SWORD_ATTACK_FRAME_COUNT }, (_, index) =>
      room.assets?.getRegion('toy-room-sword-attack-sheet', {
        x: index * SWORD_ATTACK_FRAME_SIZE.width,
        y: SWORD_ATTACK_FRAME_SIZE.y,
        width: SWORD_ATTACK_FRAME_SIZE.width,
        height: SWORD_ATTACK_FRAME_SIZE.height
      }) || null);
    this.reachablePoints = [];
    this.lastViewport = null;
    this.refreshReachablePoints();
  }

  refreshReachablePoints() {
    const reachable = reachableFloor(this.room);
    this.reachablePoints = FLOOR_SPAWN_POINTS.filter(point =>
      isFree(this.room, point, 48) &&
      reachable.some(node => distance(node, point) <= 30));
  }

  recordViewport(frame) {
    const room = this.room;
    this.lastViewport = {
      left: room.cameraX - frame.x / frame.zoom,
      top: room.cameraY - frame.y / frame.zoom,
      right: room.cameraX + (room.canvas.width - frame.x) / frame.zoom,
      bottom: room.cameraY + (room.canvas.height - frame.y) / frame.zoom
    };
  }

  onToyStored(toy) {
    const state = this.state;
    if (!state.recurrenceActive) {
      if (state.investigationStage !== 'COLLECTING') return;
      if (this.room.toys.filter(item => !item.isOrganized).length <= 2) {
        state.recurrenceActive = true;
      }
      return;
    }

    state.pendingReturns.push({ toyId: toy.id, remaining: 90 });
    if (state.investigationStage === 'COLLECTING' && (toy.returnGeneration || 0) > 0) {
      state.returnedToyCount++;
      if (state.returnedToyCount === 2) state.returnDialogueElapsed = 0;
    }
  }

  update(dt) {
    const state = this.state;
    if (state.returnDialogueElapsed >= 0) {
      state.returnDialogueElapsed = Math.min(360, state.returnDialogueElapsed + dt);
    }

    if (state.investigationStage === 'INVESTIGATION') {
      this.updateInvestigation(dt);
      return true;
    }
    if (state.investigationStage === 'PICKUP') {
      state.swordPickupElapsed = Math.min(SWORD_PICKUP_DURATION, state.swordPickupElapsed + dt);
      if (state.swordPickupElapsed >= SWORD_PICKUP_DURATION) {
        state.investigationStage = 'EQUIPPED';
        state.swordEquipped = true;
        this.clearInput();
      }
      return true;
    }

    this.updateReturns(dt);
    if (state.investigationStage === 'COLLECTING') {
      if (state.returnedToyCount >= 4 && state.returnDialogueElapsed >= 360 &&
        !this.room.tutorial.active) {
        if (this.beginInvestigation()) {
          this.updateInvestigation(dt);
          return true;
        }
      }
    } else if (state.investigationStage === 'SEEKING_SWORD') {
      this.updateSwordGuide();
    } else if (state.investigationStage === 'EQUIPPED') {
      state.attackElapsed = Math.max(0, state.attackElapsed - dt);
    }
    return false;
  }

  updateReturns(dt) {
    const state = this.state;
    if (!state.recurrenceActive || !state.pendingReturns.length ||
      this.room.tutorial.active || this.room.introAlpha > 0.02 || this.room.introBannerTimer > 0) return;

    const pending = state.pendingReturns[0];
    pending.remaining = Math.max(0, pending.remaining - dt);
    if (pending.remaining > 0) return;

    const currentViewport = getWorldViewport(this.room);
    const candidates = this.reachablePoints.filter(point =>
      outsideViewport(point, currentViewport) &&
      (!this.lastViewport || outsideViewport(point, this.lastViewport)) &&
      distance(point, this.room.player) > 160 &&
      !this.room.toys.some(toy => !toy.isOrganized && distance(point, toy) < 144) &&
      !this.room.furniture.some(item => {
        const nearestX = Math.max(item.x, Math.min(point.x, item.x + item.w));
        const nearestY = Math.max(item.y, Math.min(point.y, item.y + item.h));
        return Math.hypot(point.x - nearestX, point.y - nearestY) < 72;
      }));

    if (!candidates.length) return;
    const toy = this.room.toys.find(item => item.id === pending.toyId);
    if (!toy || !toy.isOrganized) {
      state.pendingReturns.shift();
      return;
    }

    const point = candidates[Math.floor(Math.random() * candidates.length)];
    toy.x = point.x;
    toy.y = point.y;
    toy.isOrganized = false;
    toy.isCarried = false;
    toy.returnGeneration = (toy.returnGeneration || 0) + 1;
    toy.bounceOffset = 0;
    this.room.organizedCount = this.room.toys.filter(item => item.isOrganized).length;
    state.pendingReturns.shift();
  }

  beginInvestigation() {
    const room = this.room;
    this.refreshReachablePoints();
    const candidates = this.reachablePoints.filter(point =>
      distance(point, room.player) > 240 &&
      !room.toys.some(toy => !toy.isOrganized && distance(point, toy) < 96));
    if (!candidates.length) return false;

    const sword = candidates.reduce((furthest, point) =>
      !furthest || distance(point, room.player) > distance(furthest, room.player) ? point : furthest, null);
    this.state.investigationStage = 'INVESTIGATION';
    this.state.investigationElapsed = 0;
    this.state.sword = { ...sword, visible: false };
    this.clearInput();
    return true;
  }

  updateInvestigation(dt) {
    const room = this.room;
    const state = this.state;
    state.investigationElapsed = Math.min(INVESTIGATION_DURATION,
      state.investigationElapsed + dt);
    const beat = getBeat(INVESTIGATION_BEATS, state.investigationElapsed);
    if (!beat) {
      state.investigationStage = 'SEEKING_SWORD';
      if (state.sword) state.sword.visible = true;
      this.clearInput();
      return;
    }

    const toys = room.toys.filter(toy => !toy.isOrganized && !toy.isCarried);
    const focus = beat.focus === 'sword' || !toys.length
      ? state.sword
      : toys[Math.floor(state.investigationElapsed / 180) % toys.length];
    if (beat.reveal && state.sword) state.sword.visible = true;

    if (focus) {
      const orbit = state.investigationElapsed * 0.018;
      const targetX = focus.x + Math.cos(orbit) * 45;
      const targetY = focus.y - 60 + Math.sin(orbit) * 22;
      const blend = 1 - Math.pow(0.97, dt);
      room.fairy.x += (targetX - room.fairy.x) * blend;
      room.fairy.y += (targetY - room.fairy.y) * blend;

      const targetCameraX = Math.max(0, Math.min(room.ROOM_W - room.canvas.width,
        focus.x - room.canvas.width / 2));
      const targetCameraY = Math.max(0, Math.min(room.ROOM_H - room.canvas.height,
        focus.y - room.canvas.height / 2));
      const cameraBlend = 1 - Math.pow(0.96, dt);
      room.cameraX += (targetCameraX - room.cameraX) * cameraBlend;
      room.cameraY += (targetCameraY - room.cameraY) * cameraBlend;
    }
    room.fairy.flutterTime += 0.6 * dt;
    room.player.vx = 0;
    room.player.vy = 0;
    room.player.isMoving = false;
  }

  updateSwordGuide() {
    const room = this.room;
    const target = this.state.sword;
    if (!target) return;
    room.fairy.targetX = target.x;
    room.fairy.targetY = target.y - 80;
    const blend = toyGuideBlend(room.gameDifficulty, 1);
    room.fairy.x += (room.fairy.targetX - room.fairy.x) * blend;
    room.fairy.y += (room.fairy.targetY - room.fairy.y) * blend;
  }

  updateAfterMovement() {
    const state = this.state;
    if (state.investigationStage !== 'SEEKING_SWORD' || !state.sword ||
      distance(this.room.player, state.sword) > this.room.player.radius + 16) return;

    const carried = this.room.player.carriedItem;
    if (carried) {
      const point = this.room.resolveCollisions(this.room.player.x, this.room.player.y, 32);
      carried.x = point.x;
      carried.y = point.y;
      carried.isCarried = false;
      this.room.player.carriedItem = null;
    }
    state.investigationStage = 'PICKUP';
    state.swordPickupElapsed = 0;
    state.sword.visible = false;
    this.clearInput();
    this.room.audio?.playPickUpSound?.();
  }

  clearInput() {
    const room = this.room;
    room.keysDown = {};
    room.touchState.active = false;
    room.touchState.pointerId = null;
    room.touchState.vectorX = 0;
    room.touchState.vectorY = 0;
    room.player.vx = 0;
    room.player.vy = 0;
    room.player.isMoving = false;
    room.actionBtnPressed = false;
  }

  get inputLocked() {
    return this.state.investigationStage === 'INVESTIGATION' ||
      this.state.investigationStage === 'PICKUP';
  }

  get swordEquipped() {
    return this.state.swordEquipped;
  }

  attack() {
    const state = this.state;
    if (!state.swordEquipped || state.attackElapsed > 0) return false;
    state.attackElapsed = SWORD_ATTACK_DURATION;
    state.attackDirection = this.room.player.facing === 'left' ? -1 : 1;
    this.room.audio?.playPickUpSound?.();
    return true;
  }

  guidePosition() {
    if (this.state.investigationStage === 'SEEKING_SWORD' && this.state.sword) {
      return { x: this.state.sword.x, y: this.state.sword.y - 80 };
    }
    return null;
  }

  cameraTarget() {
    if (this.state.investigationStage !== 'SEEKING_SWORD' || !this.state.sword) return null;
    return {
      x: (this.room.player.x + this.state.sword.x) / 2,
      y: (this.room.player.y + this.state.sword.y) / 2
    };
  }

  renderWorldObject(ctx) {
    const state = this.state;
    if (state.sword?.visible) drawToySword(ctx, state.sword.x, state.sword.y, 0.6, 0.8);
  }

  renderAttackSprite(ctx) {
    if (!this.state.swordEquipped || this.state.attackElapsed <= 0) return false;
    const room = this.room;
    const progress = 1 - this.state.attackElapsed / SWORD_ATTACK_DURATION;
    const frameIndex = Math.min(SWORD_ATTACK_FRAME_COUNT - 1,
      Math.floor(progress * SWORD_ATTACK_FRAME_COUNT));
    const frame = this.attackFrames[frameIndex];
    if (!frame) return false;

    const width = 72;
    const height = 96;
    ctx.save();
    ctx.translate(room.player.x, 0);
    if (this.state.attackDirection < 0) ctx.scale(-1, 1);
    ctx.drawImage(frame, -width / 2, room.player.y + 28 - height, width, height);
    ctx.restore();
    return true;
  }

  renderHeldObject(ctx) {
    if (!this.state.swordEquipped && this.state.investigationStage !== 'PICKUP') return;
    if (this.renderAttackSprite(ctx)) return;
    const room = this.room;

    const elapsed = this.state.attackElapsed > 0
      ? SWORD_ATTACK_DURATION - this.state.attackElapsed
      : 0;
    const direction = this.state.swordEquipped
      ? (this.state.attackElapsed > 0
        ? (this.state.attackDirection < 0 ? Math.PI : 0) +
          (elapsed / SWORD_ATTACK_DURATION - 0.5) * 1.7 * this.state.attackDirection
        : room.player.facingAngle)
      : -Math.PI / 2;
    const handX = room.player.x + Math.cos(direction) * 24;
    const handY = room.player.y - 13 + Math.sin(direction) * 12;
    const shoulderX = room.player.x + Math.cos(direction) * 9;
    const shoulderY = room.player.y - 13 + Math.sin(direction) * 5;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#95613f';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(handX, handY);
    ctx.stroke();
    ctx.strokeStyle = '#e7b58b';
    ctx.lineWidth = 6;
    ctx.stroke();
    drawToySword(ctx, handX, handY, direction + Math.PI / 2, 0.72);
    ctx.restore();
  }

  renderNarrative(ctx, canvas) {
    const state = this.state;
    if (state.returnDialogueElapsed >= 0 && state.returnDialogueElapsed < 360 &&
      state.investigationStage === 'COLLECTING') {
      const beat = RETURN_DIALOGUE_BEATS.find(item =>
        state.returnDialogueElapsed >= item.start && state.returnDialogueElapsed < item.end);
      if (beat) renderPoeticNarration(ctx, canvas, beat.text, { heading: beat.speaker, center: true });
    }

    if (state.investigationStage === 'INVESTIGATION') {
      const beat = getBeat(INVESTIGATION_BEATS, state.investigationElapsed);
      if (beat?.text) {
        renderPoeticNarration(ctx, canvas, beat.text,
          { heading: beat.speaker, center: true });
      }
    } else if (state.investigationStage === 'PICKUP') {
      const text = state.swordPickupElapsed < 120
        ? 'Ela não estava procurando por aquilo.'
        : 'Mas algumas coisas parecem encontrar a gente primeiro.';
      renderPoeticNarration(ctx, canvas, text, { center: true });
    }
  }

  restore(saved) {
    this.state = { ...createToyRoomStoryState(), ...(saved || {}) };
    this.state.pendingReturns = Array.isArray(this.state.pendingReturns)
      ? this.state.pendingReturns
      : [];
    if (!saved && this.room.toys.filter(toy => !toy.isOrganized).length <= 2) {
      this.state.recurrenceActive = true;
    }
    this.refreshReachablePoints();
    if (this.inputLocked) this.clearInput();
    this.lastViewport = null;
  }

  snapshot() {
    return JSON.parse(JSON.stringify(this.state));
  }
}
