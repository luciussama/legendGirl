import { OFFICIAL_FRAMES } from '../assets/officialCharacter.js';

/** Renders only crops of the supplied official artwork. */
export class BabyRenderer {
  constructor() { this.assets = null; }
  setAssets(assets) { this.assets = assets; }
  resolveAnimationState(baby, state) {
    const tick = state.tick || 0;
    const animTime = baby.animTime || 0;

    if (baby.isLyingDown) {
      return { state: 'lying_down', frame: 0 };
    }
    if (baby.isCrouching) {
      return { state: 'crouch', frame: 0 };
    }
    if (baby.isTeleporting || state.truePortalTransitionActive) {
      const frame = Math.floor(tick * 0.15) % 2;
      return { state: 'teleport', frame };
    }
    if (baby.isDamaged || (state.isGameOver && !baby.onGround)) {
      return { state: 'damage', frame: 0 };
    }
    if (baby.isCollecting || state.gameWon) {
      return { state: 'collect', frame: 0 };
    }
    if (baby.isClimbing) {
      return { state: 'climb', frame: 0 };
    }
    if (baby.isPushing) {
      const frame = Math.floor(animTime * 3) % 3;
      return { state: 'push', frame };
    }
    if (baby.isInteracting) {
      const frame = Math.floor(animTime * 2) % 2;
      return { state: 'interact', frame };
    }

    // No ar
    if (!baby.onGround) {
      if (baby.vy < 0) {
        // Subindo
        if (baby.longJumpUnlocked || state.isEscapeMode || baby.vy < -7.8) {
          return { state: 'high_jump', frame: 0 };
        }
        if (Math.abs(baby.vy) < 3.2) {
          const frame = Math.min(1, Math.floor(Math.abs(baby.vy) * 0.35));
          return { state: 'jump_short', frame };
        }
        const jumpProgress = Math.min(5, Math.floor((1 - (baby.vy / -7.2)) * 5));
        return { state: 'jump', frame: Math.max(0, Math.min(5, jumpProgress)) };
      } else {
        // Caindo
        const fallProgress = Math.min(5, Math.floor((baby.vy / 8.0) * 5));
        return { state: 'fall', frame: Math.max(0, Math.min(5, fallProgress)) };
      }
    }

    // No chão
    if (Math.abs(baby.vx) > 0.05) {
      if (Math.abs(baby.vx) > 2.8 && state.isEscapeMode) {
        return { state: 'dash', frame: 0 };
      }
      const frame = Math.floor(animTime * 1.3) % 9;
      return { state: 'run', frame };
    }

    // Parada (Idle)
    const frame = Math.floor(tick * 0.1) % 9;
    return { state: 'idle', frame };
  }

  renderPose(ctx, assets, pose, frameIndex, centerX, feetY, height, facing = 1) {
    const image = assets?.get('official-character');
    if (!ctx || !image) return; // Never replace missing official art with a redesign.
    const frames = OFFICIAL_FRAMES[pose] || OFFICIAL_FRAMES.idle;
    const frame = frames[((frameIndex % frames.length) + frames.length) % frames.length];
    // Add exactly one visual pixel in height, preserving proportions and foot anchor.
    const scale = height / 50 + 1 / frame.h;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(centerX, feetY);
    if (facing === -1) ctx.scale(-1, 1);
    ctx.drawImage(image, frame.x, frame.y, frame.w, frame.h,
      -frame.anchorX * scale, -frame.anchorY * scale, frame.w * scale, frame.h * scale);
    ctx.restore();
  }

  render(ctx, baby, state = {}, camX = 0, options = {}) {
    if (!ctx || !baby) return;
    const animation = this.resolveAnimationState(baby, state);
    this.renderPose(ctx, options.assets || this.assets || state.assets,
      animation.state, animation.frame, baby.x - camX + baby.w / 2,
      baby.y + baby.h, baby.h, baby.facing);
  }
}
export const babyRenderer = new BabyRenderer();
