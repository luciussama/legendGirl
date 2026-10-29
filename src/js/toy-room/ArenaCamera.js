import { specialCameraFrame } from './ArenaSpecialAttack.js';
import { arenaActorBounds } from './ArenaScale.js';
import { arenaMobileControlsLayout } from '../ui/MobileUILayout.js';

// Envelopes de pintura, incluindo as poses mais largas/altas; não são hitboxes.
const ENEMY_FRAME = { train: [540, 340], robot: [460, 280], dinosaur: [400, 290], bear: [450, 425] };

/** Câmera suave em coordenadas lógicas; todos os atores cabem na área jogável. */
export class ArenaCamera {
  constructor() { this.x = 800; this.y = 510; this.width = 1300; this.shake = 0; this.time = 0; }
  update(dt, player, enemy, jump = 0, impact = null, battle = null) {
    const step = Math.max(0, Math.min(12, Number.isFinite(dt) ? dt : 0));
    if (!step) return;
    const envelope = this.envelope(player, enemy, jump, battle, true);
    const targetX = (envelope.left + envelope.right) / 2;
    const targetWidth = Math.max(760, envelope.right - envelope.left + 120);
    const blend = 1 - Math.exp(-step / 15);
    this.x += (targetX - this.x) * blend;
    // Abre durante a antecipação; aproxima mais devagar para não pulsar a cada recuo.
    this.width += (targetWidth - this.width) * (1 - Math.exp(-step / (targetWidth > this.width ? 10 : 28)));
    this.y += ((690 + envelope.top) / 2 - this.y) * (1 - Math.exp(-step / 20));
    this.time += step;
    this.shake = impact ? Math.max(0, impact.strength * (1 - impact.elapsed / impact.duration)) : this.shake * Math.exp(-step / 5);
  }
  envelope(player, enemy, jump, battle = null, anticipate = false) {
    const [width, height] = ENEMY_FRAME[enemy?.actor] ?? ENEMY_FRAME.robot;
    const p = arenaActorBounds(player.x, 690, jump, 240, 420);
    const e = arenaActorBounds(enemy?.x ?? 1120, 690, 0, height, width);
    const envelope = { left: Math.min(p.left, e.left), right: Math.max(p.right, e.right), top: Math.min(p.top, e.top) };
    // O baú e a trajetória de transporte pedem panorama; a morte antecipa a abertura.
    if (battle?.transition || (anticipate && enemy?.state === 'DEATH')) {
      envelope.left = Math.min(0, envelope.left); envelope.right = Math.max(1600, envelope.right);
      envelope.top = Math.min(110, envelope.top);
    }
    const reach = { 'Laser Beam': 620, 'Steam Blast': 620, 'Rocket Punch': 520 }[enemy?.attack];
    if (reach && enemy.state === 'ATTACK' && (anticipate || enemy.elapsed >= 44)) {
      const tip = enemy.x + enemy.facing * reach;
      envelope.left = Math.min(envelope.left, tip); envelope.right = Math.max(envelope.right, tip);
    }
    return envelope;
  }
  frame(layout, room, battle) {
    const mobile = room.mobilePresentation || room.isTouchDevice;
    const landscape = mobile && layout.usableWidth > layout.usableHeight;
    const controls = mobile ? arenaMobileControlsLayout(layout) : null;
    // Em paisagem, enquadra os atores entre os polegares, sem cobrir a menina.
    const left = landscape ? controls.dpad.x + controls.dpad.hitRadius + 12 * controls.unit : layout.safeLeft;
    const right = landscape ? controls.sword.x - controls.sword.width / 2 - 12 * controls.unit : layout.safeRight;
    const top = layout.safeTop + 150 * layout.scale;
    const bottom = Math.max(top + 40, controls && !landscape
      ? controls.dpad.y - controls.dpad.hitRadius - 24 * controls.unit : layout.safeBottom - 24 * layout.scale);
    const envelope = this.envelope(room.player, battle.enemy, battle.jump, battle);
    const span = Math.max(760, this.width, envelope.right - envelope.left + 120);
    const cx = Math.max(envelope.right - span / 2 + 60, Math.min(envelope.left + span / 2 - 60, this.x));
    // A altura acompanha o enquadramento suavizado; a folga contém salto e pintura.
    const viewTop = Math.min(330, envelope.top - 48, 2 * this.y - 690 - 48);
    const height = 750 - viewTop;
    const scale = Math.max(0.01, Math.min((right - left) / span, (bottom - top) / height));
    const shakeX = Math.sin(this.time * 2.7) * this.shake * scale;
    const shakeY = Math.cos(this.time * 2.1) * this.shake * scale * 0.3;
    return specialCameraFrame({ scale, ox: (left + right) / 2 - cx * scale + shakeX,
      oy: (top + bottom) / 2 - (viewTop + 750) / 2 * scale + shakeY,
      top, bottom, left, right, envelope }, room, battle);
  }
  snapshot() { return { x: this.x, y: this.y, width: this.width, shake: this.shake, time: this.time }; }
  restore(saved) { if (saved) for (const key of ['x','y','width','shake','time']) if (Number.isFinite(saved[key])) this[key] = saved[key]; }
}
