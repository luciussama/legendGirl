import { BrinquedaoLook, BRINQUEDAO_LOOK_THEMES } from './BrinquedaoLook.js';
import { isMobileDevice } from '../controllers/mobileZoom.js';
import { brinquedaoFishImpactAge } from './brinquedaoFish.js';
import {
  prepareBrinquedaoInterior,
  drawBrinquedaoInteriorDoor,
  renderBrinquedaoInterior,
} from './brinquedaoInteriorRenderer.js';
import { brinquedaoRicochetAge } from './brinquedaoRecovery.js';
import {
  prepareBrinquedaoAttractions,
  drawBrinquedaoCastles,
  drawBrinquedaoElastic,
  drawBrinquedaoSideMats,
  drawBrinquedaoBridgeFish,
} from './brinquedaoAttractions.js';
import { BRINQUEDAO_ART as ART } from './brinquedaoArt.js';
import {
  BRINQUEDAO as C,
  BRINQUEDAO_TRACKS,
  BRINQUEDAO_SECTIONS,
  BRINQUEDAO_CHECKPOINTS,
  BRINQUEDAO_STEPS,
  BRINQUEDAO_BY_ID,
  brinquedaoSurface,
  brinquedaoSlope,
} from './brinquedaoLevel.js';
import { prepareBrinquedaoParts, drawBrinquedaoTerrain } from './brinquedaoTerrain.js';
import {
  drawBrinquedaoGirl,
  drawBrinquedaoFairy,
  renderBrinquedaoCinematic,
} from './brinquedaoCinematic.js';
import { GARDEN_ART } from '../garden/gardenArt.js';
import { gardenControls } from '../garden/GardenInput.js';
import { drawMobileGameControls } from '../ui/touchGameControls.js';
import { getDialogueSafeArea } from '../ui/dialogueSafeArea.js';
import { beginDialogueFrame, endDialogueFrame } from '../narrative/dialogueFlow.js';
import { renderPoeticNarration } from '../narrative/poeticNarrator.js';
const root = new URL('../../../assets/art/', import.meta.url);
/** Materiais ilustrados; câmera lateral inicial e altitude na continuação, com escala fixa por viewport. */
export class BrinquedaoRenderer {
  /** Inicializa caches e buffers de arte, mantendo o canvas fornecido pelo host. */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.images = new Map();
    this.disposed = false;
    this.parts = [];
    this.attractions = [];
    this.insideParts = [];
  }
  /** Carrega pinturas e prepara módulos recortados antes de remover fontes temporárias. */
  async load() {
    const files = [
      ...BRINQUEDAO_LOOK_THEMES.map((t) => t.file),
      ART.background.file,
      ART.kit.file,
      ART.girl.file,
      ART.slide.file,
      ART.attractions.file,
      ART.insideTubes.file,
      ART.fish.file,
      'garden/cinematic/picnic-without-yuna-v1.png',
      'toy-room/stage3/illustrated-fairy-v1.png',
      'garden/runtime/girl-running-v1.png',
      'garden/runtime/girl-actions-v1.png',
      'toy-room/stage3/stacking-blocks-v1.png',
      'toy-room/bear-chase/materials/blocks-atlas-v1.png',
    ];
    await Promise.all(
      files.map(async (file) => {
        const image = new Image();
        image.src = new URL(file, root).href;
        await image.decode();
        if (!this.disposed) this.images.set(file, image);
      }),
    );
    if (!this.disposed) {
      this.parts = prepareBrinquedaoParts(
        this.images.get(ART.kit.file),
        this.images.get(ART.slide.file),
      );
      this.attractions = prepareBrinquedaoAttractions(this.images.get(ART.attractions.file));
      this.insideParts = prepareBrinquedaoInterior(this.images);
      this.look = new BrinquedaoLook(this.images, this.parts, this.insideParts);
      for (const theme of BRINQUEDAO_LOOK_THEMES) this.images.delete(theme.file);
    }
  }
  /** O jardim recua suavemente sob os saltos altos, revelando céu; não há troca brusca de paleta. */
  backdrop(s, frame) {
    const ctx = this.ctx,
      { width, height } = this.canvas,
      bg = this.look.outside,
      lift = s.player.x < 14800 ? 0 : Math.max(0, Math.min(1, (700 - s.player.y) / 1850)),
      gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#9dd7ef');
    gradient.addColorStop(1, '#e7f3cf');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    const k = Math.max(width / bg.width, height / bg.height) * 1.08,
      bw = bg.width * k,
      drift = Math.sin(frame.left / 3500) * (bw - width) * 0.45;
    ctx.save();
    ctx.drawImage(
      lift > 0 ? this.look.sky : bg,
      (width - bw) / 2 - drift,
      (height - bg.height * k) / 2 + lift * height * 0.87,
      bw,
      bg.height * k,
    );
    ctx.restore();
    if (lift > 0) {
      ctx.save();
      ctx.globalAlpha = lift * 0.6;
      ctx.filter = 'blur(8px)';
      ctx.fillStyle = '#fffef0';
      for (let i = 0; i < 5; i++) {
        const x =
            ((((i * 370 - frame.left * 0.06) % (width + 500)) + width + 500) % (width + 500)) - 250,
          y = height * (0.17 + i * 0.11);
        ctx.beginPath();
        ctx.ellipse(x, y, 90, 20, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 45, y - 14, 50, 26, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.fillStyle = 'rgba(255,250,219,.06)';
    ctx.fillRect(0, 0, width, height);
  }
  /** Calcula os controles móveis usando a mesma área segura da interface narrativa. */
  controls() {
    return gardenControls(this.canvas, getDialogueSafeArea(this.canvas));
  }
  /** Calcula escala e rolagem horizontal/vertical conforme viewport e estado do percurso. */
  frame(s, touch = false) {
    const { width, height } = this.canvas,
      safe = getDialogueSafeArea(this.canvas),
      css = width / (this.canvas.clientWidth || width),
      portrait = height > width,
      scale = Math.min(
        (safe.right - safe.left) / 750,
        (safe.bottom - safe.top - (portrait ? 205 * css : 40 * css)) / 1050,
      ),
      worldWidth = width / scale,
      mobile = touch || isMobileDevice();
    const follow = Math.max(0, Math.min(1, (s.player.x - 14800) / 650)),
      rawTop = portrait ? safe.bottom - 205 * css - 950 * scale : height * 0.83 - 950 * scale,
      controls = mobile
        ? gardenControls(this.canvas, safe, {
            mobile: true,
          })
        : null,
      controlTop = mobile ? Math.min(...Object.values(controls).map((c) => c.hitBox.top)) : height,
      oldTop = mobile && portrait ? Math.min(rawTop, controlTop - 1135 * scale) : rawTop,
      anchor = safe.top + (safe.bottom - safe.top - (portrait ? 205 * css : 40 * css)) * 0.52;
    return {
      scale,
      left: Math.max(0, Math.min(C.width - worldWidth, s.player.x - worldWidth * 0.4)),
      top: oldTop * (1 - follow) + (anchor - s.player.y * scale) * follow,
    };
  }
  /** Desenha Yuna com pose, inclinação e reação sincronizadas ao apoio e aos impactos. */
  girl(ctx, s) {
    const p = s.player;
    if (p.mode === 'slide') {
      drawBrinquedaoGirl(ctx, this.images, 3, p.x, p.y, C.bodyHeight, {
        flip: p.facing,
        tilt: Math.atan(brinquedaoSlope(BRINQUEDAO_BY_ID.get(p.support), p.x)) * 0.7,
        seat: true,
      });
      return;
    }
    const running = p.support && Math.abs(p.vx) > 35,
      key = running ? 'girl-running-v1' : 'girl-actions-v1',
      set = GARDEN_ART.sets[key],
      index = running ? Math.floor(p.animTime) % 8 : p.support ? 7 : p.vy < 0 ? 1 : 3,
      f = set.frames[index],
      k = C.bodyHeight / GARDEN_ART.referenceHeight;
    ctx.save();
    ctx.translate(p.x, p.y);
    const fishAge = brinquedaoFishImpactAge(s);
    if (p.mode === 'air' && fishAge < 0.95) {
      ctx.translate(0, -45);
      ctx.rotate(-Math.sin((fishAge / 0.95) * Math.PI) * 1.4);
      ctx.translate(0, 45);
    }
    const recoil = brinquedaoRicochetAge(s);
    if (p.mode === 'air' && recoil < 0.35)
      ctx.rotate(Math.sin(recoil * 18) * 0.22 * (1 - recoil / 0.35));
    ctx.scale(p.facing, 1);
    ctx.drawImage(
      this.images.get('garden/' + set.file),
      f.x,
      f.y,
      f.w,
      f.h,
      -f.anchorX * k,
      -f.anchorY * k,
      f.w * k,
      f.h * k,
    );
    ctx.restore();
  }
  /** Compõe narrativa, interior ou percurso e respeita os controles e pausas recebidos. */
  render(
    s,
    { ready = true, error = null, paused = false, touch = false, onAdvance = () => {} } = {},
  ) {
    const canvas = this.canvas,
      ctx = this.ctx,
      { width, height } = canvas;
    beginDialogueFrame(canvas);
    try {
      ctx.fillStyle = '#ddf0c0';
      ctx.fillRect(0, 0, width, height);
      if (!ready || error) {
        ctx.fillStyle = '#466c43';
        ctx.font = '18px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText(error || 'Abrindo o Brinquedão…', width / 2, height / 2, width - 30);
        return;
      }
      if (s.interior) {
        renderBrinquedaoInterior(this, s, {
          touch,
          paused,
          onAdvance,
        });
        return;
      }
      if (s.stage === 'INTRO') {
        renderBrinquedaoCinematic(ctx, canvas, s, this.images, onAdvance);
      } else {
        const frame = this.frame(s, touch);
        this.backdrop(s, frame);
        ctx.save();
        ctx.translate(-frame.left * frame.scale, frame.top);
        ctx.scale(frame.scale, frame.scale);
        const right = frame.left + width / frame.scale;
        // Torre só acompanha uma entrada ligada a um patamar real; quedas e recuperações não recebem escadas soltas.
        for (const p of BRINQUEDAO_TRACKS)
          if (
            p.kind === 'slide' &&
            !p.recovery &&
            BRINQUEDAO_TRACKS.some(
              (a) => ['pad', 'castle'].includes(a.kind) && a.to === p.from && a.end === p.y,
            ) &&
            p.from > frame.left - 500 &&
            p.from < right + 500
          ) {
            const tower = this.parts[3].canvas,
              w = 285,
              h = (w * tower.height) / tower.width;
            ctx.drawImage(tower, p.from - w * 0.64, p.y - h + 30, w, h);
          }
        drawBrinquedaoCastles(ctx, this.attractions, frame.left, right);
        drawBrinquedaoTerrain(
          ctx,
          this.parts,
          frame.left,
          right,
          s,
          this.attractions,
          this.look,
          (height - frame.top) / frame.scale,
        );
        drawBrinquedaoElastic(ctx, this.attractions, s, frame.left, right);
        drawBrinquedaoSideMats(ctx, this.attractions, s, frame.left, right);
        if (right > 35100) drawBrinquedaoInteriorDoor(ctx, this.insideParts, this.parts);
        for (let i = 1; i < BRINQUEDAO_CHECKPOINTS.length; i++) {
          const x = BRINQUEDAO_CHECKPOINTS[i];
          if (x < frame.left - 30 || x > right + 30) continue;
          const p = BRINQUEDAO_TRACKS.find((t) => !t.upper && x >= t.from && x <= t.to),
            y = brinquedaoSurface(p, x);
          ctx.strokeStyle = '#c38d56';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(x, y - 6);
          ctx.lineTo(x, y - 120);
          ctx.stroke();
          ctx.fillStyle = i <= s.checkpoint ? '#58bca1' : '#efad5e';
          ctx.beginPath();
          ctx.moveTo(x, y - 120);
          ctx.quadraticCurveTo(x + 27, y - 134, x + 54, y - 116);
          ctx.lineTo(x + 48, y - 81);
          ctx.quadraticCurveTo(x + 23, y - 99, x, y - 88);
          ctx.fill();
        }
        this.girl(ctx, s);
        drawBrinquedaoBridgeFish(
          ctx,
          this.insideParts,
          s,
          frame.left,
          right,
          (height - frame.top) / frame.scale,
        );
        drawBrinquedaoFairy(
          ctx,
          this.images.get('toy-room/stage3/illustrated-fairy-v1.png'),
          s.player.x - 95 * s.player.facing,
          s.player.y - 135 + Math.sin(s.time * 3) * 8,
          49,
          s.time,
        );
        ctx.restore();
        const safe = getDialogueSafeArea(canvas),
          css = width / (canvas.clientWidth || width),
          rect = canvas.getBoundingClientRect(),
          bar = document.querySelector('.top-controls-bar')?.getBoundingClientRect(),
          top = Math.max(
            safe.top + 26 * css,
            bar ? ((bar.bottom - rect.top) * height) / rect.height + 24 * css : 0,
          ),
          section = BRINQUEDAO_SECTIONS.findLast((v) => s.player.x >= v.x);
        const hudWidth = Math.min(safe.right - safe.left - 20 * css, 520 * css);
        ctx.fillStyle = 'rgba(255,250,230,.84)';
        ctx.beginPath();
        ctx.roundRect((width - hudWidth) / 2, top - 23 * css, hudWidth, 60 * css, 14 * css);
        ctx.fill();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#426b54';
        ctx.font = `bold ${17 * css}px Georgia`;
        ctx.fillText(
          s.stage === 'COMPLETE' ? 'De volta ao jardim' : section.name,
          width / 2,
          top,
          width - 32 * css,
        );
        ctx.font = `${12 * css}px sans-serif`;
        if (
          s.stage === 'RUNNING' &&
          BRINQUEDAO_STEPS.some((v) => v.x - s.player.x > 0 && v.x - s.player.x < 280)
        )
          ctx.fillText(
            'Salte para a passarela mais alta!',
            width / 2,
            top + 24 * css,
            width - 30 * css,
          );
        else if (s.stage === 'RUNNING' && s.player.x >= 14800) {
          const lower =
            BRINQUEDAO_BY_ID.get(s.player.support)?.recovery ||
            (s.player.x >= 26800 && s.player.y > 0);
          const hint =
            s.player.x >= 34080 && !lower
              ? 'Entre na torre para descer aos tubos.'
              : lower
                ? 'Após duas rebatidas, siga → para a lona de saída.'
                : s.player.x < 23300
                  ? 'PULAR na lona dá mais altura!'
                  : s.player.x < 26700
                    ? 'Pegue embalo e suba a rampa!'
                    : 'Ajuste no ar. As pontes cedem!';
          ctx.fillText(hint, width / 2, top + 24 * css, width - 30 * css);
        } else if (s.stage === 'RUNNING' && s.age < 8)
          ctx.fillText(
            touch
              ? 'Use o direcional e PULAR. Pegue embalo nas descidas!'
              : 'A/D ou ← → · Espaço para pular · Pegue embalo nas descidas!',
            width / 2,
            top + 24 * css,
            width - 30 * css,
          );
        if (touch && s.stage === 'RUNNING') drawMobileGameControls(ctx, canvas, this.controls());
        if (s.stage === 'RECOVER') {
          ctx.fillStyle = `rgba(255,249,219,${Math.sin((s.age / 0.75) * Math.PI) * 0.8})`;
          ctx.fillRect(0, 0, width, height);
        }
        if (s.stage === 'COMPLETE' && !s.story.endingDone)
          renderPoeticNarration(
            ctx,
            canvas,
            'Entre uma ponte e um escorregador,\no dia voltou a caber num sorriso.',
            {
              heading: 'UM POUCO MAIS LEVE',
              onAdvance,
              topInset: top - safe.top,
            },
          );
      }
      if (paused) {
        ctx.fillStyle = 'rgba(31,58,48,.38)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#fff9df';
        ctx.font = '22px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText('Pausa', width / 2, height / 2);
      }
    } finally {
      endDialogueFrame(canvas);
    }
  }
  /** Descarta canvases e caches de arte preparados para a fase. */
  destroy() {
    if (this.disposed) return;
    this.disposed = true;
    for (const p of [...this.parts, ...this.attractions, ...this.insideParts]) {
      p.canvas.width = 1;
      p.canvas.height = 1;
      if (p.ribbon) {
        p.ribbon.canvas.width = 1;
        p.ribbon.canvas.height = 1;
      }
    }
    this.parts = [];
    this.attractions = [];
    this.insideParts = [];
    if (this.backdropCanvas) {
      this.backdropCanvas.width = 1;
      this.backdropCanvas.height = 1;
      this.backdropCanvas = null;
    }
    this.look?.destroy();
    this.look = null;
    this.images.clear();
  }
}
