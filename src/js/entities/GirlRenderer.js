import { OFFICIAL_FRAMES } from '../assets/officialCharacter.js';
import { GIRL_V2_FRAMES, GIRL_V2_REFERENCE_HEIGHT } from '../assets/illustratedGirl.js';
import { renderGirlRun } from './girlLocomotion.js';

/** Renderiza somente recortes da ilustração oficial fornecida. */
export class GirlRenderer {
  /**
   * Inicializa sem carregar arte própria; os assets são ligados depois pelo ciclo de vida do jogo.
   */
  constructor() {
    this.assets = null;
  }
  /**
   * Atualiza o provedor de imagens consultado ao desenhar a personagem.
   */
  setAssets(assets) {
    this.assets = assets;
  }
  /**
   * Escolhe animação oficial conforme ação e flags do estado.
   */
  resolveAnimationState(player, state) {
    if (state.gameplayState === 'FIRST_JUMP_TUTORIAL')
      return {
        state: 'idle',
        frame: 0,
      };
    const tick = state.tick || 0;
    const animTime = player.animTime || 0;

    if (player.isLyingDown) {
      return {
        state: 'lying_down',
        frame: 0,
      };
    }
    if (player.isCrouching) {
      return {
        state: 'crouch',
        frame: 0,
      };
    }
    if (player.isTeleporting || state.truePortalTransitionActive) {
      const frame = Math.floor(tick * 0.15) % 2;
      return {
        state: 'teleport',
        frame,
      };
    }
    if (player.isDamaged || (state.isGameOver && !player.onGround)) {
      return {
        state: 'damage',
        frame: 0,
      };
    }
    if (state.gameWon || (player.isCollecting && player.onGround && Math.abs(player.vx) <= 0.05)) {
      return {
        state: 'collect',
        frame: 0,
      };
    }
    if (player.isClimbing) {
      return {
        state: 'climb',
        frame: 0,
      };
    }
    if (player.isPushing) {
      const frame = Math.floor(animTime * 3) % 3;
      return {
        state: 'push',
        frame,
      };
    }
    if (player.isInteracting) {
      const frame = Math.floor(animTime * 2) % 2;
      return {
        state: 'interact',
        frame,
      };
    }

    // No ar
    if (!player.onGround) {
      if (player.vy < 0) {
        // Subindo
        if (player.longJumpUnlocked || state.isEscapeMode || player.vy < -7.8) {
          return {
            state: 'high_jump',
            frame: 0,
          };
        }
        if (Math.abs(player.vy) < 3.2) {
          const frame = Math.min(1, Math.floor(Math.abs(player.vy) * 0.35));
          return {
            state: 'jump_short',
            frame,
          };
        }
        const jumpProgress = Math.min(5, Math.floor((1 - player.vy / -7.2) * 5));
        return {
          state: 'jump',
          frame: Math.max(0, Math.min(5, jumpProgress)),
        };
      } else {
        // Caindo
        const fallProgress = Math.min(5, Math.floor((player.vy / 8.0) * 5));
        return {
          state: 'fall',
          frame: Math.max(0, Math.min(5, fallProgress)),
        };
      }
    }

    // No chão
    if (Math.abs(player.vx) > 0.05) {
      if (Math.abs(player.vx) > 2.8 && state.isEscapeMode) {
        return {
          state: 'dash',
          frame: 0,
        };
      }
      const frame = Math.floor(animTime * 1.3) % 9;
      return {
        state: 'run',
        frame,
      };
    }

    // Parada (repouso)
    const frame = Math.floor(tick * 0.1) % 9;
    return {
      state: 'idle',
      frame,
    };
  }

  /**
   * Desenha recorte ancorado no centro/pés, com escala visual.
   */
  renderPose(ctx, assets, pose, frameIndex, centerX, feetY, height, facing = 1, visualScale = 1) {
    const illustratedFrames = GIRL_V2_FRAMES[pose];
    const illustrated =
      illustratedFrames?.[
        ((frameIndex % illustratedFrames.length) + illustratedFrames.length) %
          illustratedFrames.length
      ];
    const detailedImage = illustrated && assets?.get(illustrated.key);
    if (ctx && detailedImage) {
      // Uma escala corporal por conjunto mantém cabeça, pés e proporções entre poses articuladas.
      const scale = (height / GIRL_V2_REFERENCE_HEIGHT) * visualScale;
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.translate(centerX, feetY);
      if (facing === -1) ctx.scale(-1, 1);
      ctx.drawImage(
        detailedImage,
        illustrated.x,
        illustrated.y,
        illustrated.w,
        illustrated.h,
        -illustrated.anchorX * scale,
        -illustrated.anchorY * scale,
        illustrated.w * scale,
        illustrated.h * scale,
      );
      ctx.restore();
      return;
    }
    const image = assets?.get('official-character');
    if (!ctx || !image) return; // Nunca substitui a arte oficial ausente por um novo desenho.
    const frames = OFFICIAL_FRAMES[pose] || OFFICIAL_FRAMES.idle;
    const frame = frames[((frameIndex % frames.length) + frames.length) % frames.length];
    // Preserva o pixel adicional da escala-base e aplica o fator artístico em torno dos pés.
    const scale = (height / 50 + 1 / frame.h) * visualScale;
    ctx.save();
    // Suaviza a reamostragem, preservando os recortes e a ancoragem dos pés.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.translate(centerX, feetY);
    if (facing === -1) ctx.scale(-1, 1);
    ctx.drawImage(
      image,
      frame.x,
      frame.y,
      frame.w,
      frame.h,
      -frame.anchorX * scale,
      -frame.anchorY * scale,
      frame.w * scale,
      frame.h * scale,
    );
    ctx.restore();
  }

  /**
   * Compõe a personagem com a pose e os recursos atuais, preservando a ancoragem visual definida pelo
   * estado.
   */
  render(ctx, player, state = {}, camX = 0, options = {}) {
    if (!ctx || !player) return;
    const animation = this.resolveAnimationState(player, state);
    const assets = options.assets || this.assets || state.assets;
    if (
      !player.controlsLocked &&
      (animation.state === 'run' ||
        animation.state === 'dash' ||
        (animation.state === 'idle' && player.runBlend > 0)) &&
      renderGirlRun(
        ctx,
        assets,
        player,
        player.x - camX + player.w / 2,
        player.y + player.h,
        player.h,
        player.facing,
        options.visualScale ?? 1,
      )
    )
      return;
    this.renderPose(
      ctx,
      assets,
      animation.state,
      animation.frame,
      player.x - camX + player.w / 2,
      player.y + player.h,
      player.h,
      player.facing,
      options.visualScale ?? 1,
    );
  }
}
export const girlRenderer = new GirlRenderer();
