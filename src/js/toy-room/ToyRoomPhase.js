/**
 * ToyRoomPhase.js
 * Core controller for the Toy Room Phase (Top-Down 2D Legend of Mana style).
 * Integrates room environment, interactive toys, 2.5D character movement,
 * collision resolution, pick & drop mechanics, particle effects, and responsive controls.
 */

import { roomEnvironmentRenderer } from './RoomEnvironmentRenderer.js';
import { toyRenderer } from './ToyRenderer.js';
import { toyRoomEntities } from './ToyRoomEntities.js';
import { toyRoomUI } from './ToyRoomUI.js';

export class ToyRoomPhase {
  constructor(canvas, audio, uiFeedback, onReturnToTitle) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.uiFeedback = uiFeedback;
    this.onReturnToTitle = onReturnToTitle;

    // Room Dimensions
    this.ROOM_W = 1600;
    this.ROOM_H = 1200;

    // Camera tracking
    this.cameraX = 0;
    this.cameraY = 0;

    // Narrative & Transition State
    this.introAlpha = 1.0;
    this.introBannerTimer = 240;
    this.victoryBannerActive = false;
    this.victoryBannerTimer = 0;

    // Particle Systems
    this.sunMotes = [];
    this.sparkles = [];
    this.confetti = [];
    this.footstepPuffs = [];

    for (let i = 0; i < 45; i++) {
      this.sunMotes.push({
        x: Math.random() * this.ROOM_W,
        y: Math.random() * this.ROOM_H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.15 - Math.random() * 0.25,
        radius: 1.2 + Math.random() * 2.2,
        alpha: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Player Character
    this.player = {
      x: 280,
      y: 640,
      vx: 0,
      vy: 0,
      speed: 3.8,
      radius: 20,
      facing: 'down',
      facingAngle: Math.PI / 2,
      animTime: 0,
      isMoving: false,
      carriedItem: null,
      stepTimer: 0
    };

    // Companion Fairy
    this.fairy = {
      x: 290,
      y: 600,
      targetX: 300,
      targetY: 600,
      flutterTime: 0,
      wingAngle: 0,
      particles: []
    };

    // Furniture / Navigation Obstacles
    this.furniture = [
      {
        id: 'toy-chest',
        type: 'chest',
        x: 1040,
        y: 190,
        w: 190,
        h: 115,
        isTarget: true,
        lidOpen: 0.0,
        glowAlpha: 0.0
      },
      {
        id: 'bookshelf',
        type: 'shelf',
        x: 380,
        y: 170,
        w: 220,
        h: 90
      },
      {
        id: 'armchair',
        type: 'armchair',
        x: 180,
        y: 840,
        w: 130,
        h: 120
      },
      {
        id: 'block-fortress',
        type: 'fortress',
        x: 1240,
        y: 800,
        w: 220,
        h: 170
      },
      {
        id: 'table',
        type: 'table',
        x: 620,
        y: 780,
        w: 160,
        h: 110
      },
      {
        id: 'rocking-horse',
        type: 'rocking-horse',
        x: 480,
        y: 420,
        w: 100,
        h: 80
      },
      {
        id: 'wardrobe',
        type: 'wardrobe',
        x: 740,
        y: 170,
        w: 140,
        h: 90
      }
    ];

    // Interactive Toys
    this.toys = [
      {
        id: 'teddy',
        name: 'Ursinho Pipoca',
        type: 'teddy',
        x: 340,
        y: 480,
        w: 42,
        h: 46,
        weight: 0.94,
        isCarried: false,
        isOrganized: false,
        bounceOffset: 0
      },
      {
        id: 'train',
        name: 'Trenzinho Real a Vapor',
        type: 'train',
        x: 760,
        y: 520,
        w: 48,
        h: 36,
        weight: 0.90,
        isCarried: false,
        isOrganized: false,
        bounceOffset: 0
      },
      {
        id: 'robot',
        name: 'Robô Estelar Faísca',
        type: 'robot',
        x: 1140,
        y: 540,
        w: 40,
        h: 46,
        weight: 0.92,
        isCarried: false,
        isOrganized: false,
        bounceOffset: 0
      },
      {
        id: 'bunny',
        name: 'Coelhinho de Algodão',
        type: 'bunny',
        x: 460,
        y: 980,
        w: 38,
        h: 44,
        weight: 0.96,
        isCarried: false,
        isOrganized: false,
        bounceOffset: 0
      },
      {
        id: 'duck',
        name: 'Patinho de Banho Imperial',
        type: 'duck',
        x: 940,
        y: 840,
        w: 42,
        h: 40,
        weight: 0.95,
        isCarried: false,
        isOrganized: false,
        bounceOffset: 0
      },
      {
        id: 'blocks',
        name: 'Torre de Blocos Coloridos',
        type: 'blocks',
        x: 1180,
        y: 720,
        w: 44,
        h: 52,
        weight: 0.85,
        isCarried: false,
        isOrganized: false,
        bounceOffset: 0
      },
      {
        id: 'drum',
        name: 'Tamborzinho Encantado',
        type: 'drum',
        x: 640,
        y: 960,
        w: 44,
        h: 38,
        weight: 0.93,
        isCarried: false,
        isOrganized: false,
        bounceOffset: 0
      },
      {
        id: 'jack',
        name: 'Caixinha de Surpresa da Fada',
        type: 'jack',
        x: 880,
        y: 360,
        w: 40,
        h: 46,
        weight: 0.91,
        isCarried: false,
        isOrganized: false,
        bounceOffset: 0
      }
    ];

    this.organizedCount = 0;
    this.lastActionTime = 0;
    this.ACTION_DEBOUNCE_MS = 250;

    this.keysDown = {};
    this.isTouchDevice = false;
    this.touchState = {
      active: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      pointerId: null
    };

    // Bind event handlers
    this.onKeyDown = this.handleKeyDown.bind(this);
    this.onKeyUp = this.handleKeyUp.bind(this);
    this.handlePointerDown = this.onPointerDown.bind(this);
    this.handlePointerMove = this.onPointerMove.bind(this);
    this.handlePointerUp = this.onPointerUp.bind(this);

    this.setupListeners();
  }

  setupListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('pointermove', this.handlePointerMove);
      window.addEventListener('pointerup', this.handlePointerUp);
      window.addEventListener('pointercancel', this.handlePointerUp);
    }
    if (this.canvas) {
      this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    }
  }

  handleKeyDown(e) {
    if (this.audio && this.audio.initAudio) this.audio.initAudio();
    this.keysDown[e.code] = true;

    if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter' || e.code === 'KeyF') {
      if (e.preventDefault) e.preventDefault();
      this.triggerAction();
    }
  }

  handleKeyUp(e) {
    this.keysDown[e.code] = false;
  }

  onPointerDown(e) {
    if (this.audio && this.audio.initAudio) this.audio.initAudio();
    this.isTouchDevice = true;

    const rect = this.canvas.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    const touchY = e.clientY - rect.top;

    const actionBtnX = this.canvas.width - 80;
    const actionBtnY = this.canvas.height - 80;
    const distToActionBtn = Math.hypot(touchX - actionBtnX, touchY - actionBtnY);

    if (distToActionBtn < 60) {
      if (e.preventDefault) e.preventDefault();
      this.triggerAction();
      return;
    }

    if (touchX < this.canvas.width * 0.55 && touchY > this.canvas.height * 0.25) {
      this.touchState.active = true;
      this.touchState.pointerId = e.pointerId;
      this.touchState.startX = touchX;
      this.touchState.startY = touchY;
      this.touchState.currentX = touchX;
      this.touchState.currentY = touchY;
    }
  }

  onPointerMove(e) {
    if (!this.touchState.active || e.pointerId !== this.touchState.pointerId) return;
    const rect = this.canvas.getBoundingClientRect();
    this.touchState.currentX = e.clientX - rect.left;
    this.touchState.currentY = e.clientY - rect.top;
  }

  onPointerUp(e) {
    if (this.touchState.pointerId === e.pointerId) {
      this.touchState.active = false;
      this.touchState.pointerId = null;
    }
  }

  spawnSparkles(x, y, count = 12, hue = '#facc15') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 3.5;
      this.sparkles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2.5,
        alpha: 1.0,
        decay: 0.02 + Math.random() * 0.03,
        color: hue
      });
    }
  }

  spawnConfetti(x, y, count = 35) {
    const colors = ['#f43f5e', '#38bdf8', '#facc15', '#10b981', '#c084fc', '#fb923c'];
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
      const speed = 2.5 + Math.random() * 5.0;
      this.confetti.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 5 + Math.random() * 5,
        h: 7 + Math.random() * 7,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.3,
        color: colors[(Math.random() * colors.length) | 0],
        alpha: 1.0,
        decay: 0.012 + Math.random() * 0.015
      });
    }
  }

  triggerAction() {
    const now = performance.now();
    if (now - this.lastActionTime < this.ACTION_DEBOUNCE_MS) {
      return;
    }
    this.lastActionTime = now;

    // Carrying an item -> drop or organize in chest
    if (this.player.carriedItem) {
      const item = this.player.carriedItem;
      const chest = this.furniture.find(f => f.id === 'toy-chest');
      const chestCenterX = chest.x + chest.w / 2;
      const chestCenterY = chest.y + chest.h / 2;
      const distToChest = Math.hypot(this.player.x - chestCenterX, this.player.y - chestCenterY);

      if (distToChest < 130) {
        item.isCarried = false;
        item.isOrganized = true;
        item.x = chestCenterX + (Math.random() - 0.5) * 60;
        item.y = chest.y + 45;
        this.player.carriedItem = null;

        if (this.audio && this.audio.playOrganizeChime) this.audio.playOrganizeChime();
        chest.lidOpen = 1.0;
        chest.glowAlpha = 1.0;
        this.spawnSparkles(chestCenterX, chest.y + 30, 24, '#fde047');
        this.spawnConfetti(chestCenterX, chest.y + 30, 30);

        this.organizedCount++;
        if (this.organizedCount >= this.toys.length) {
          this.victoryBannerActive = true;
          this.victoryBannerTimer = 360;
          if (this.audio && this.audio.playToyRoomVictory) this.audio.playToyRoomVictory();
          if (this.uiFeedback) {
            this.uiFeedback.innerText = '🌟 PARABÉNS! Todos os brinquedos foram carinhosamente guardados no baú!';
            this.uiFeedback.style.color = '#fde047';
          }
        } else {
          if (this.uiFeedback) {
            this.uiFeedback.innerText = `✨ ${item.name} guardado no baú! (${this.organizedCount}/${this.toys.length} arrumados)`;
            this.uiFeedback.style.color = '#a7f3d0';
          }
        }
        return;
      }

      // Otherwise: Drop in front of player on the floor
      const dropDist = 42;
      let dropX = this.player.x + Math.cos(this.player.facingAngle) * dropDist;
      let dropY = this.player.y + Math.sin(this.player.facingAngle) * dropDist;

      dropX = Math.max(90, Math.min(this.ROOM_W - 90, dropX));
      dropY = Math.max(260, Math.min(this.ROOM_H - 90, dropY));

      item.x = dropX;
      item.y = dropY;
      item.isCarried = false;
      this.player.carriedItem = null;

      if (this.audio && this.audio.playDropSound) this.audio.playDropSound();
      this.spawnSparkles(dropX, dropY, 8, '#fef08a');
      if (this.uiFeedback) {
        this.uiFeedback.innerText = `📦 Você colocou ${item.name} no chão.`;
        this.uiFeedback.style.color = '#fef08a';
      }
      return;
    }

    // Not carrying -> Find closest toy to pick up
    let closestToy = null;
    let closestDist = 65;

    for (let i = 0; i < this.toys.length; i++) {
      const t = this.toys[i];
      if (t.isOrganized) continue;
      const d = Math.hypot(this.player.x - t.x, this.player.y - t.y);
      if (d < closestDist) {
        closestDist = d;
        closestToy = t;
      }
    }

    if (closestToy) {
      closestToy.isCarried = true;
      this.player.carriedItem = closestToy;
      if (this.audio && this.audio.playPickUpSound) this.audio.playPickUpSound();
      this.spawnSparkles(this.player.x, this.player.y - 30, 16, '#38bdf8');
      if (this.uiFeedback) {
        this.uiFeedback.innerText = `✋ Você pegou: ${closestToy.name}! Leve até o Baú de Brinquedos!`;
        this.uiFeedback.style.color = '#38bdf8';
      }
    }
  }

  resolveCollisions(px, py, r) {
    let nx = px;
    let ny = py;

    const minX = 75 + r;
    const maxX = this.ROOM_W - 75 - r;
    const minY = 250 + r;
    const maxY = this.ROOM_H - 75 - r;

    nx = Math.max(minX, Math.min(maxX, nx));
    ny = Math.max(minY, Math.min(maxY, ny));

    for (let i = 0; i < this.furniture.length; i++) {
      const f = this.furniture[i];
      const boxLeft = f.x - r;
      const boxRight = f.x + f.w + r;
      const boxTop = f.y - r;
      const boxBottom = f.y + f.h + r;

      if (nx > boxLeft && nx < boxRight && ny > boxTop && ny < boxBottom) {
        const penLeft = nx - boxLeft;
        const penRight = boxRight - nx;
        const penTop = ny - boxTop;
        const penBottom = boxBottom - ny;

        const minPen = Math.min(penLeft, penRight, penTop, penBottom);

        if (minPen === penLeft) nx = boxLeft;
        else if (minPen === penRight) nx = boxRight;
        else if (minPen === penTop) ny = boxTop;
        else ny = boxBottom;
      }
    }

    return { x: nx, y: ny };
  }

  update(dt = 1.0) {
    // Banner timers
    if (this.introAlpha > 0) {
      this.introAlpha = Math.max(0, this.introAlpha - 0.02 * dt);
    }
    if (this.introBannerTimer > 0) {
      this.introBannerTimer -= dt;
    }
    if (this.victoryBannerActive && this.victoryBannerTimer > 0) {
      this.victoryBannerTimer -= dt;
    }

    // Input vector
    let moveX = 0;
    let moveY = 0;

    if (this.keysDown['KeyW'] || this.keysDown['ArrowUp']) moveY -= 1;
    if (this.keysDown['KeyS'] || this.keysDown['ArrowDown']) moveY += 1;
    if (this.keysDown['KeyA'] || this.keysDown['ArrowLeft']) moveX -= 1;
    if (this.keysDown['KeyD'] || this.keysDown['ArrowRight']) moveX += 1;

    if (this.touchState.active) {
      const dx = this.touchState.currentX - this.touchState.startX;
      const dy = this.touchState.currentY - this.touchState.startY;
      const d = Math.hypot(dx, dy);
      const maxRadius = 50;

      if (d > 8) {
        const clampedD = Math.min(d, maxRadius);
        moveX = (dx / d) * (clampedD / maxRadius);
        moveY = (dy / d) * (clampedD / maxRadius);
      }
    }

    const len = Math.hypot(moveX, moveY);
    if (len > 1.0) {
      moveX /= len;
      moveY /= len;
    }

    const weightFactor = this.player.carriedItem ? this.player.carriedItem.weight : 1.0;
    const finalSpeed = this.player.speed * weightFactor;

    this.player.vx = moveX * finalSpeed;
    this.player.vy = moveY * finalSpeed;
    this.player.isMoving = len > 0.05;

    if (this.player.isMoving) {
      this.player.facingAngle = Math.atan2(moveY, moveX);
      this.player.animTime += 0.22 * dt;

      if (Math.abs(moveX) > Math.abs(moveY)) {
        this.player.facing = moveX > 0 ? 'right' : 'left';
      } else {
        this.player.facing = moveY > 0 ? 'down' : 'up';
      }

      this.player.stepTimer += dt;
      if (this.player.stepTimer > 12) {
        this.player.stepTimer = 0;
        this.footstepPuffs.push({
          x: this.player.x + (Math.random() - 0.5) * 10,
          y: this.player.y + 12,
          radius: 3 + Math.random() * 3,
          alpha: 0.5,
          color: '#fef3c7'
        });
      }
    }

    // Resolve collisions & move
    const rawX = this.player.x + this.player.vx * dt;
    const rawY = this.player.y + this.player.vy * dt;
    const resolved = this.resolveCollisions(rawX, rawY, this.player.radius);
    this.player.x = resolved.x;
    this.player.y = resolved.y;

    // Carried toy position
    if (this.player.carriedItem) {
      this.player.carriedItem.x = this.player.x;
      this.player.carriedItem.y = this.player.y - 38 + Math.sin(this.player.animTime * 1.5) * 3;
    }

    // Fairy companion update
    const fairyHoverOffsetX = this.player.facing === 'left' ? 24 : -24;
    this.fairy.targetX = this.player.x + fairyHoverOffsetX + Math.cos(this.fairy.flutterTime * 0.08) * 12;
    this.fairy.targetY = this.player.y - 32 + Math.sin(this.fairy.flutterTime * 0.12) * 8;

    this.fairy.flutterTime += dt;
    this.fairy.x += (this.fairy.targetX - this.fairy.x) * 0.12 * dt;
    this.fairy.y += (this.fairy.targetY - this.fairy.y) * 0.12 * dt;

    if (Math.random() < 0.4) {
      this.fairy.particles.push({
        x: this.fairy.x + (Math.random() - 0.5) * 12,
        y: this.fairy.y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 - 0.4,
        alpha: 0.85,
        radius: 1.5 + Math.random() * 2,
        color: '#fef08a'
      });
    }

    for (let i = this.fairy.particles.length - 1; i >= 0; i--) {
      const p = this.fairy.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha -= 0.035 * dt;
      if (p.alpha <= 0) {
        this.fairy.particles.splice(i, 1);
      }
    }

    // Chest lid animation
    const chest = this.furniture.find(f => f.id === 'toy-chest');
    if (chest) {
      if (chest.lidOpen > 0) chest.lidOpen = Math.max(0, chest.lidOpen - 0.015 * dt);
      if (chest.glowAlpha > 0) chest.glowAlpha = Math.max(0, chest.glowAlpha - 0.02 * dt);
    }

    // Particle updates
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const s = this.sparkles[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.alpha -= s.decay * dt;
      if (s.alpha <= 0) this.sparkles.splice(i, 1);
    }

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vy += 0.08 * dt;
      c.rot += c.vrot * dt;
      c.alpha -= c.decay * dt;
      if (c.alpha <= 0) this.confetti.splice(i, 1);
    }

    for (let i = this.footstepPuffs.length - 1; i >= 0; i--) {
      const fp = this.footstepPuffs[i];
      fp.alpha -= 0.03 * dt;
      fp.radius += 0.2 * dt;
      if (fp.alpha <= 0) this.footstepPuffs.splice(i, 1);
    }

    for (let i = 0; i < this.sunMotes.length; i++) {
      const sm = this.sunMotes[i];
      sm.x += sm.vx * dt;
      sm.y += sm.vy * dt;
      sm.phase += 0.03 * dt;
      if (sm.y < 200) sm.y = this.ROOM_H - 50;
      if (sm.x < 50) sm.x = this.ROOM_W - 50;
      if (sm.x > this.ROOM_W - 50) sm.x = 50;
    }

    // Camera tracking
    const targetCamX = this.player.x - this.canvas.width / 2;
    const targetCamY = this.player.y - this.canvas.height / 2;

    const maxCamX = Math.max(0, this.ROOM_W - this.canvas.width);
    const maxCamY = Math.max(0, this.ROOM_H - this.canvas.height);

    const clampedTargetCamX = Math.max(0, Math.min(maxCamX, targetCamX));
    const clampedTargetCamY = Math.max(0, Math.min(maxCamY, targetCamY));

    this.cameraX += (clampedTargetCamX - this.cameraX) * 0.12 * dt;
    this.cameraY += (clampedTargetCamY - this.cameraY) * 0.12 * dt;
  }

  render() {
    const ctx = this.ctx;
    ctx.save();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Camera Transform
    ctx.save();
    ctx.translate(-this.cameraX, -this.cameraY);

    // 1. Background
    roomEnvironmentRenderer.renderBackground(ctx, this.ROOM_W, this.ROOM_H);

    // 2. Footstep puffs
    for (let i = 0; i < this.footstepPuffs.length; i++) {
      const fp = this.footstepPuffs[i];
      ctx.fillStyle = `rgba(254, 243, 199, ${fp.alpha})`;
      ctx.beginPath();
      ctx.arc(fp.x, fp.y, fp.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Sort entities by Y for depth
    const renderList = [];

    for (let i = 0; i < this.furniture.length; i++) {
      const f = this.furniture[i];
      renderList.push({
        type: 'furniture',
        y: f.y + f.h,
        item: f
      });
    }

    for (let i = 0; i < this.toys.length; i++) {
      const t = this.toys[i];
      if (!t.isCarried) {
        renderList.push({
          type: 'toy',
          y: t.y,
          item: t
        });
      }
    }

    renderList.push({
      type: 'player',
      y: this.player.y
    });

    renderList.sort((a, b) => a.y - b.y);

    const now = performance.now();
    for (let i = 0; i < renderList.length; i++) {
      const node = renderList[i];
      if (node.type === 'furniture') {
        roomEnvironmentRenderer.renderFurniture(ctx, node.item);
      } else if (node.type === 'toy') {
        toyRenderer.renderToy(ctx, node.item, this.player.x, this.player.y, Boolean(this.player.carriedItem), now);
      } else if (node.type === 'player') {
        toyRoomEntities.renderPlayer(ctx, this.player);
        if (this.player.carriedItem) {
          toyRenderer.renderToy(ctx, this.player.carriedItem, this.player.x, this.player.y, true, now);
        }
      }
    }

    // 4. Fairy companion
    toyRoomEntities.renderFairy(ctx, this.fairy);

    // 5. Fairy sparkle trail
    for (let i = 0; i < this.fairy.particles.length; i++) {
      const p = this.fairy.particles[i];
      ctx.fillStyle = `rgba(254, 240, 138, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Sparkles & Confetti
    for (let i = 0; i < this.sparkles.length; i++) {
      const s = this.sparkles[i];
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    for (let i = 0; i < this.confetti.length; i++) {
      const c = this.confetti[i];
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = Math.max(0, c.alpha);
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    }
    ctx.globalAlpha = 1.0;

    // 7. Floating sun motes
    for (let i = 0; i < this.sunMotes.length; i++) {
      const sm = this.sunMotes[i];
      ctx.fillStyle = `rgba(254, 240, 138, ${sm.alpha * (0.6 + Math.sin(sm.phase) * 0.4)})`;
      ctx.beginPath();
      ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore(); // End camera transform

    // 8. UI in screen coordinates
    toyRoomUI.renderUI(ctx, this.canvas, {
      organizedCount: this.organizedCount,
      totalToys: this.toys.length,
      isTouchDevice: this.isTouchDevice,
      touchState: this.touchState,
      player: this.player,
      introAlpha: this.introAlpha,
      introBannerTimer: this.introBannerTimer,
      victoryBannerActive: this.victoryBannerActive,
      victoryBannerTimer: this.victoryBannerTimer
    });

    ctx.restore();
  }

  destroy() {
    if (this.audio && this.audio.stopToyRoomMusic) {
      this.audio.stopToyRoomMusic();
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('keyup', this.onKeyUp);
      window.removeEventListener('pointermove', this.handlePointerMove);
      window.removeEventListener('pointerup', this.handlePointerUp);
      window.removeEventListener('pointercancel', this.handlePointerUp);
    }
    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    }
  }
}

export function createToyRoom(canvas, audio, uiFeedback, onReturnToTitle) {
  const toyRoom = new ToyRoomPhase(canvas, audio, uiFeedback, onReturnToTitle);
  return {
    update: (dt) => toyRoom.update(dt),
    render: () => toyRoom.render(),
    triggerAction: () => toyRoom.triggerAction(),
    destroy: () => toyRoom.destroy(),
    instance: toyRoom
  };
}
