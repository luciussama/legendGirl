import { GIRL_V2_FOOT_BOUNDS, GIRL_V2_REFERENCE_HEIGHT } from '../assets/illustratedGirl.js';

/** Apoio físico derivado dos pixels realmente desenhados, sem alterar arte ou câmera. */
export class DarkRoomContact {
  constructor(renderer, assets) {
    this.renderer = renderer; this.assets = assets; this.profiles = new WeakMap();
  }

  /** Rasteriza cada objeto uma vez, em coordenadas do mundo; transparência não vira chão. */
  prepare(platforms) {
    if (typeof document === 'undefined') return;
    for (const platform of platforms) {
      const top = platform.surfaceTopY ?? platform.standRegion?.y ?? platform.y;
      const padding = Math.max(100, platform.w * 2);
      const left = Math.floor(platform.x - padding), y = Math.floor(top - 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(platform.w + padding * 2); canvas.height = Math.max(2, this.renderer.floorY - y);
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.translate(-left, -y);
      this.renderer.renderPlatforms(ctx, canvas, 0, { platforms: [platform], assets: this.assets,
        cameraVisibility: true, contactMask: true });
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const heights = new Float32Array(canvas.width); heights.fill(Infinity);
      let start = Infinity, end = -Infinity;
      for (let x = 0; x < canvas.width; x++) for (let row = 0; row < canvas.height; row++) {
        if (pixels[(row * canvas.width + x) * 4 + 3] < 160) continue;
        heights[x] = Math.max(top, y + row); start = Math.min(start, x); end = Math.max(end, x + 1); break;
      }
      if (Number.isFinite(start)) this.profiles.set(platform, { left, heights, x: left + start, right: left + end, y: top });
    }
  }

  /** Retorna limites de apoio; antes da prontidão das artes conserva a geometria declarada. */
  bounds(platform) {
    const profile = this.profiles.get(platform), support = platform.standRegion || platform;
    return profile || { x: support.x, right: support.x + support.w,
      y: platform.surfaceTopY ?? support.y ?? platform.y };
  }

  /** Busca o ponto mais alto sob qualquer parte dos sapatos, incluindo a borda extrema. */
  height(platform, feet) {
    const profile = this.profiles.get(platform);
    if (!profile) {
      const b = this.bounds(platform);
      return feet.right > b.x && feet.left < b.right ? b.y : Infinity;
    }
    let top = Infinity;
    const start = Math.max(0, Math.floor(feet.left - profile.left));
    const end = Math.min(profile.heights.length, Math.ceil(feet.right - profile.left));
    for (let x = start; x < end; x++) if (feet.right > profile.left + x && feet.left < profile.left + x + 1)
      top = Math.min(top, profile.heights[x]);
    return top;
  }

  /** Resolve descida varrida e caminhada no mesmo objeto; subida/entrada lateral não geram pouso. */
  resolve(baby, state, platforms, dt) {
    const feet = getDarkRoomFeet(baby, state), bottom = baby.y + baby.h;
    const previousBottom = bottom - baby.vy * dt;
    const travel = baby.vx * dt;
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(travel), Math.abs(baby.vy * dt))));
    let result = null;
    for (let index = 0; index < platforms.length; index++) {
      const p = platforms[index], bounds = this.bounds(p);
      if (Math.max(feet.right, feet.right - travel) <= bounds.x ||
          Math.min(feet.left, feet.left - travel) >= bounds.right) continue;
      const sameGroup = baby.onGround && baby.currentPlatformIndex >= 0 && p.contactGroup &&
        p.contactGroup === platforms[baby.currentPlatformIndex]?.contactGroup;
      const walking = baby.onGround && (baby.currentPlatformIndex === index || sameGroup);
      const topNow = this.height(p, feet);
      // Degraus pequenos do próprio contorno (e a união urso/livros) não soltam os pés.
      if (walking && baby.vy >= 0 && topNow <= bottom + 18 && topNow >= previousBottom - 8) {
        if (!result || topNow < result.y) result = { index, y: topNow, fraction: 0 };
        continue;
      }
      if (baby.vy < 0 || (walking && !Number.isFinite(topNow))) continue;
      // A altura e a posição horizontal são consultadas ao longo da descida, não só no fim do quadro.
      for (let step = 0; step <= steps; step++) {
        const fraction = step / steps;
        const offset = travel * (1 - fraction);
        const at = { left: feet.left - offset, right: feet.right - offset };
        const top = this.height(p, at);
        const y = previousBottom + (bottom - previousBottom) * fraction;
        const before = previousBottom + (bottom - previousBottom) * Math.max(0, (step - 1) / steps);
        if (top <= y + 1e-7 && top >= before - 1e-7 && previousBottom <= top + 1e-7) {
          // Depois do impacto, acompanha o contorno no restante horizontal do quadro.
          // Evita um quadro com os pés afundados numa borda curva.
          const landingY = Number.isFinite(topNow) && topNow >= top - 8 && topNow <= top + 18 ? topNow : top;
          if (!result || fraction < result.fraction || (fraction === result.fraction && landingY < result.y))
            result = { index, y: landingY, fraction };
          break;
        }
      }
    }
    return result;
  }
}

/** Envelope estável dos sapatos completos, medido nos nove quadros da corrida e no dash. */
export function getDarkRoomFeet(baby, state = {}) {
  const visualScale = !state.isEscapeMode && !state.isPhase3 ? 1.08 : 1;
  // Mede somente a faixa inferior dos sapatos; não usa braços/cabelo como apoio.
  const dash = baby.onGround && state.isEscapeMode && Math.abs(baby.vx) > 2.8;
  const scale = (baby.h / 50 + 1 / 40) * visualScale;
  let left = dash ? -42 : -19, right = dash ? 8 : 19;
  if (baby.facing === -1) [left, right] = [-right, -left];
  const center = baby.x + baby.w / 2;
  const feet = { left: center + left * scale, right: center + right * scale };
  // A pintura nova pode estender uma bota além do envelope antigo, sobretudo no dash.
  const painted = GIRL_V2_FOOT_BOUNDS[dash ? 'dash' : 'run'];
  const paintedScale = baby.h / GIRL_V2_REFERENCE_HEIGHT * visualScale;
  const paintedLeft = baby.facing === -1 ? -painted.right : painted.left;
  const paintedRight = baby.facing === -1 ? -painted.left : painted.right;
  feet.left = Math.min(feet.left, center + paintedLeft * paintedScale);
  feet.right = Math.max(feet.right, center + paintedRight * paintedScale);
  // EASY conserva a assistência lateral anterior, além de cobrir o sapato inteiro.
  if (state.gameDifficulty === 'EASY') {
    feet.left = Math.min(feet.left, baby.x - 4);
    feet.right = Math.max(feet.right, baby.x + baby.w + 4);
  }
  return feet;
}
