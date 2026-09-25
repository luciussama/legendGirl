import { getEscapeGuideTarget } from '../controllers/EscapeFairyGuide.js';
/** Local moonlight and fairy light; render-only, with no gameplay state writes. */
import {
  platforms as defaultPlatforms,
  phase3Platforms as defaultPhase3Platforms,
  exitDoor as defaultExitDoor,
  trueExitDoor as defaultTrueExitDoor
} from '../config.js';
import { NIGHT_WINDOWS } from './nightWindows.js';

export class LightingSystem {
  constructor(options = {}) {
    this.darkCanvas = options.darkCanvas || (typeof document !== 'undefined' ? document.createElement('canvas') : null);
    this.dctx = this.darkCanvas?.getContext('2d');
  }

  resize(width, height) {
    if (!this.darkCanvas) return;
    this.darkCanvas.width = width;
    this.darkCanvas.height = height;
  }

  apply(ctx, canvas, state = {}, baby = {}, fairy = {}, camX = 0, camY = 0, options = {}) {
    if (!ctx || !canvas) return;
    if (!this.darkCanvas && typeof document !== 'undefined') {
      this.darkCanvas = document.createElement('canvas');
      this.dctx = this.darkCanvas.getContext('2d');
    }
    const mask = this.dctx;
    if (!mask) return;
    if (this.darkCanvas.width !== canvas.width || this.darkCanvas.height !== canvas.height) this.resize(canvas.width, canvas.height);
    const tick = state.tick || 0;
    const dramatic = Boolean(state.plotTwistActive);
    const active = state.isPhase3 ? (options.phase3Platforms || defaultPhase3Platforms) : (options.platforms || defaultPlatforms);
    const fx = fairy.x - camX, fy = fairy.y;
    const bx = baby.x - camX + baby.w / 2, by = baby.y + baby.h / 2;

    // Rebuild every frame. Leaving destination-out active here gradually erased
    // the old darkness mask and made the entire room uniformly bright.
    mask.save();
    mask.setTransform(1, 0, 0, 1, 0, 0);
    mask.globalCompositeOperation = 'source-over';
    mask.globalAlpha = 1;
    mask.clearRect(0, 0, canvas.width, canvas.height);
    mask.fillStyle = dramatic ? '#080b14' : '#101522';
    mask.fillRect(0, 0, canvas.width, canvas.height);
    // Use the actual scene transform so light stays attached during camera zoom
    // and vertical travel, including the third stage and cinematic close-ups.
    const transform = ctx.getTransform?.();
    if (transform) mask.setTransform(transform.a, transform.b, transform.c, transform.d, transform.e, transform.f);
    else mask.translate(0, -camY);
    mask.globalCompositeOperation = 'destination-out';

    const pool = (x, y, rx, ry, strength) => {
      if (![x, y, rx, ry].every(Number.isFinite)) return;
      mask.save();
      mask.translate(x, y);
      mask.scale(rx, ry);
      const g = mask.createRadialGradient(0, 0, 0, 0, 0, 1);
      g.addColorStop(0, `rgba(0,0,0,${strength})`);
      g.addColorStop(0.3, `rgba(0,0,0,${strength * 0.78})`);
      g.addColorStop(0.65, `rgba(0,0,0,${strength * 0.28})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      mask.fillStyle = g;
      mask.fillRect(-1, -1, 2, 2);
      mask.restore();
    };

    // Broad, very faint material visibility, never a landing line or a rim drawn
    // over the illustration. Existing activation is read, not changed.
    for (const p of active) {
      const x = p.x - camX + p.w / 2;
      if (x < -p.w - 180 || x > canvas.width + p.w + 180) continue;
      pool(x, p.y + Math.min(p.h * 0.25, 28), Math.max(65, p.w * 0.8), 78,
        0.17 + Math.min(1, p.lightAlpha || 0) * 0.055);
    }

    // The fairy is the strongest nearby source. No cone or hard spotlight.
    const breath = Math.sin(tick * 0.025) * 3;
    pool(fx, fy, 162 + breath, 140 + breath, 0.94);
    pool(fx, fy, 32, 32, 0.7);
    // During the escape, project the fairy's guidance ahead immediately while
    // she travels. Soft pools reveal existing artwork, never draw landing marks.
    if (state.isEscapeMode && !state.isPhase3 && !state.plotTwistActive) {
      const target = getEscapeGuideTarget(baby, active, options.exitDoor || defaultExitDoor);
      pool(target.x - camX, target.landingY + 6, 102, 75, 0.68);
      pool((bx + target.x - camX) / 2, Math.min(by, target.y) - 15, 110, 70, 0.20);
    }
    // Small silhouette lift only; the child does not illuminate the room.
    pool(bx, by, 37, 49, 0.48);

    for (const wx of NIGHT_WINDOWS) {
      const x = wx - camX * 0.3;
      if (x < -260 || x > canvas.width + 160) continue;
      pool(x + 45, 142, 65, 88, 0.62);
      pool(x + 88, 261, 90, 115, dramatic ? 0.12 : 0.23);
    }
    const lamp = active.find(p => p.style === 'mushroom_lamp');
    if (lamp) pool(lamp.x - camX + lamp.w / 2, lamp.y + 12, 74, 66, 0.48);
    const door = state.isPhase3 ? (options.trueExitDoor || defaultTrueExitDoor) : (options.exitDoor || defaultExitDoor);
    if (door) pool(door.x - camX + door.w / 2, door.y + door.h / 2, 115, 140, 0.58);
    mask.restore();

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(this.darkCanvas, 0, 0);
    ctx.restore();

    // Silver airborne light, confined to the existing windows. Layered beams
    // feather the sides; their opacity falls to zero before reaching the floor.
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (const wx of NIGHT_WINDOWS) {
      const x = wx - camX * 0.3;
      if (x < -260 || x > canvas.width + 160) continue;
      for (let layer = 0; layer < 5; layer++) {
        const inset = layer * 4;
        const beam = ctx.createLinearGradient(0, 175, 0, 365);
        beam.addColorStop(0, 'rgba(179,204,235,0.012)');
        beam.addColorStop(0.35, 'rgba(179,204,235,0.019)');
        beam.addColorStop(1, 'rgba(179,204,235,0)');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(x + 12 + inset, 184);
        ctx.lineTo(x + 77 - inset, 184);
        ctx.lineTo(x + 177 - inset, 365);
        ctx.lineTo(x + 48 + inset, 365);
        ctx.closePath();
        ctx.fill();
      }
      // Deterministic dust: visual time only, no shared random/gameplay state.
      for (let i = 0; i < 12; i++) {
        const t = ((i * 0.083 + tick * 0.00045) % 1);
        const xDust = x + 28 + t * 72 + Math.sin(i * 9.7) * 23;
        ctx.fillStyle = `rgba(211,226,246,${Math.sin(t * Math.PI) * 0.18})`;
        ctx.beginPath();
        ctx.arc(xDust, 192 + t * 155, 0.55 + (i % 3) * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const glow = ctx.createRadialGradient(fx, fy, 0, fx, fy, 50);
    glow.addColorStop(0, 'rgba(240,230,194,0.13)');
    glow.addColorStop(0.35, 'rgba(192,202,243,0.045)');
    glow.addColorStop(1, 'rgba(192,202,243,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(fx - 50, fy - 50, 100, 100);
    ctx.restore();

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    const radius = Math.hypot(canvas.width, canvas.height) / 2;
    const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, radius * 0.42,
      canvas.width / 2, canvas.height / 2, radius);
    vignette.addColorStop(0, 'rgba(3,5,12,0)');
    vignette.addColorStop(0.7, 'rgba(3,5,12,0.10)');
    vignette.addColorStop(1, 'rgba(3,5,12,0.5)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}

export function createLightingSystem(options = {}) {
  return new LightingSystem(options);
}
