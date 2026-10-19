import { arenaActorBounds } from './ArenaScale.js';
import { arenaMobileControlsLayout } from '../ui/MobileUILayout.js';

/** Câmera suave em coordenadas lógicas; todos os atores cabem na área jogável. */
export class ArenaCamera {
  constructor() { this.x = 800; this.y = 510; this.width = 1300; this.shake = 0; this.time = 0; }
  update(dt, player, enemy, jump = 0, impact = null) {
    const step = Math.max(0, Math.min(12, dt));
    const envelope = this.envelope(player, enemy, jump);
    const targetX = (envelope.left + envelope.right) / 2;
    const targetWidth = Math.max(680, envelope.right - envelope.left + 100);
    const blend = 1 - Math.exp(-step / 15);
    this.x += (targetX - this.x) * blend;
    this.width += (targetWidth - this.width) * blend;
    this.y += ((690 + envelope.top) / 2 - this.y) * blend;
    this.time += step;
    this.shake = impact ? Math.max(0, impact.strength * (1 - impact.elapsed / impact.duration)) : this.shake * Math.exp(-step / 5);
  }
  envelope(player, enemy, jump) {
    const p = arenaActorBounds(player.x, 690, jump);
    const e = arenaActorBounds(enemy?.x ?? 1120, 690, 0, enemy?.actor === 'bear' ? 325 : 250, 360);
    return { left: Math.min(p.left, e.left), right: Math.max(p.right, e.right), top: Math.min(p.top, e.top) };
  }
  frame(layout, room, battle) {
    const mobile = room.mobilePresentation || room.isTouchDevice;
    const landscape = mobile && layout.usableWidth > layout.usableHeight;
    const controls = landscape ? arenaMobileControlsLayout(layout) : null;
    // Em paisagem, enquadra os atores entre os polegares, sem cobrir a menina.
    const left = controls ? controls.dpad.x + controls.dpad.hitRadius + 12 * controls.unit : layout.safeLeft;
    const right = controls ? controls.sword.x - controls.sword.width / 2 - 12 * controls.unit : layout.safeRight;
    const top = layout.safeTop + 94 * layout.scale;
    const bottom = Math.max(top + 80, layout.safeBottom - (mobile ? (layout.usableWidth > layout.usableHeight ? 32 : 150) : 24) * layout.scale);
    const envelope = this.envelope(room.player, battle.enemy, battle.jump);
    const cx = Math.max(envelope.right - this.width / 2, Math.min(envelope.left + this.width / 2, this.x));
    const span = Math.max(this.width, envelope.right - envelope.left + 90);
    const height = 690 - envelope.top + 90;
    const scale = Math.max(0.01, Math.min((right - left) / span, (bottom - top) / height));
    const shakeX = Math.sin(this.time * 2.7) * this.shake * scale;
    const shakeY = Math.cos(this.time * 2.1) * this.shake * scale * 0.3;
    return { scale, ox: (left + right) / 2 - cx * scale + shakeX,
      oy: (top + bottom) / 2 - (envelope.top + 690) / 2 * scale + shakeY,
      top, bottom, left, right, envelope };
  }
  snapshot() { return { x: this.x, y: this.y, width: this.width, shake: this.shake, time: this.time }; }
  restore(saved) { if (saved) for (const key of ['x','y','width','shake','time']) if (Number.isFinite(saved[key])) this[key] = saved[key]; }
}
