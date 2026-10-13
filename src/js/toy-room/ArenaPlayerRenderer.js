import { BATTLE_GIRL_FRAMES } from './BattleGirlFrames.js';
import { ARENA_PLAYER_HEIGHT } from './ArenaScale.js';

/** Usa recortes detalhados existentes; a prancha antiga continua disponível à exploração. */
export class ArenaPlayerRenderer {
  constructor() { this.images = new Map(); this.ready = typeof Image === 'undefined'; }
  async load() {
    if (this.ready) return;
    const files = new Set(Object.values(BATTLE_GIRL_FRAMES).flat().map(frame => frame.file));
    await Promise.all([...files].map(file => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => { this.images.set(file, image); resolve(); };
      image.onerror = () => reject(new Error(`Sprite detalhada da arena ausente: ${file}`));
      image.src = new URL('../../../assets/art/toy-room/battle/' + file, import.meta.url).href;
    })));
    this.ready = true;
  }
  render(ctx, room, state, ground) {
    const pose = state.mode === 'DEFEAT' ? 'damage' : state.playerHitTime > 0 ? 'damage'
      : state.crouching ? 'crouch' : state.attackTime > 0 ? 'attack'
      : state.jump > 0 ? (state.jumpVelocity > 0 ? 'jump' : 'fall') : room.player.isMoving ? 'run' : 'idle';
    const frames = BATTLE_GIRL_FRAMES[pose];
    const index = pose === 'attack' ? Math.min(frames.length - 1, Math.floor((1 - state.attackTime / 12) * frames.length))
      : Math.floor(state.elapsed / 9) % frames.length;
    const frame = frames[index], image = this.images.get(frame.file);
    if (!image) return;
    const height = state.crouching ? ARENA_PLAYER_HEIGHT * 0.46 : ARENA_PLAYER_HEIGHT;
    const scale = height / frame.height;
    ctx.save(); ctx.translate(room.player.x, ground - state.jump);
    ctx.scale(room.player.facing === 'left' ? -1 : 1, 1);
    if (state.playerHitTime > 0 && Math.floor(state.playerHitTime / 2) % 2 === 0) ctx.globalAlpha = 0.55;
    if (state.mode === 'DEFEAT') { ctx.rotate(-0.9); ctx.translate(-40, -25); }
    ctx.drawImage(image, -frame.anchorX * scale, -frame.anchorY * scale, frame.width * scale, frame.height * scale);
    ctx.restore();
  }
}
