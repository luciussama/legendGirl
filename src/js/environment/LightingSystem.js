import { getEscapeGuideTarget } from '../controllers/EscapeFairyGuide.js';
/** Luz local da lua e da fada; atua somente na renderização, sem modificar o estado do jogo. */
import {
  FLOOR_Y,
  platforms as defaultPlatforms,
  phase3Platforms as defaultPhase3Platforms,
  exitDoor as defaultExitDoor,
  trueExitDoor as defaultTrueExitDoor
} from '../config.js';
import { NIGHT_WINDOWS } from './nightWindows.js';

// Compensação ambiental restrita aos materiais apontados no QA-002.
const SOFT_AMBIENT_STYLES = new Set(['messy_blocks', 'toy_drum', 'satin_cushion', 'stepped_dresser']);

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

    // Reconstrói a cada quadro. Manter destination-out ativo aqui apagava gradualmente
    // a máscara de escuridão anterior e deixava todo o quarto uniformemente claro.
    mask.save();
    mask.setTransform(1, 0, 0, 1, 0, 0);
    mask.globalCompositeOperation = 'source-over';
    mask.globalAlpha = 1;
    mask.clearRect(0, 0, canvas.width, canvas.height);
    mask.fillStyle = dramatic ? '#080b14' : '#101522';
    mask.fillRect(0, 0, canvas.width, canvas.height);
    // Usa a transformação real da cena para que a luz acompanhe a ampliação da câmera
    // e o deslocamento vertical, incluindo a terceira fase e os enquadramentos próximos das cenas.
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

    // Visibilidade ampla e muito sutil do material, sem desenhar linha de pouso ou contorno
    // sobre a ilustração. O estado de ativação existente é apenas lido, sem alteração.
    for (const p of active) {
      const x = p.x - camX + p.w / 2;
      if (x < -p.w - 180 || x > canvas.width + p.w + 180) continue;
      pool(x, p.y + Math.min(p.h * 0.25, 28), Math.max(65, p.w * 0.8), 78,
        0.17 + Math.min(1, p.lightAlpha || 0) * 0.055);
      if (!state.isPhase3 && SOFT_AMBIENT_STYLES.has(p.style)) {
        // Recupera discretamente os tons das bases e tampos com transição ampla,
        // sem desenhar bordas, faixas de contato ou uma nova fonte aparente.
        const height = Math.max(1, FLOOR_Y - p.y);
        pool(x, p.y + height * 0.55, Math.max(75, p.w * 0.85),
          Math.max(100, height * 0.95), 0.065);
      }
    }

    // A fada é a fonte próxima mais intensa. Não há cone de luz nem foco com bordas rígidas.
    const breath = Math.sin(tick * 0.025) * 3;
    pool(fx, fy, 162 + breath, 140 + breath, 0.94);
    pool(fx, fy, 32, 32, 0.7);
    // Durante a fuga, projeta imediatamente a orientação da fada à frente enquanto
    // ela se desloca. Áreas suaves de luz revelam a arte existente, sem desenhar marcas de pouso.
    if (state.isEscapeMode && !state.isPhase3 && !state.plotTwistActive) {
      const target = getEscapeGuideTarget(baby, active, options.exitDoor || defaultExitDoor);
      pool(target.x - camX, target.landingY + 6, 102, 75, 0.68);
      pool((bx + target.x - camX) / 2, Math.min(by, target.y) - 15, 110, 70, 0.20);
    }
    // Apenas um leve realce da silhueta; a criança não ilumina o quarto.
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

    // Luz prateada suspensa, restrita às janelas existentes. Os feixes em camadas
    // suavizam as laterais; sua opacidade cai a zero antes de atingir o piso.
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
      // Poeira determinística: usa somente o tempo visual, sem compartilhar aleatoriedade ou estado do jogo.
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
