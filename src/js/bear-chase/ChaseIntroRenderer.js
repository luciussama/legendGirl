import { CHASE_CONFIG as C, clamp } from './ChaseConfig.js';

const ROOT = 'assets/art/toy-room/';
const SOURCES = {
  actors: ROOT + 'bear-chase/cinematic/approach-atlas-v1.png',
  reach: ROOT + 'bear-chase/cinematic/reach-atlas-v1.png',
  wallpaper: ROOT + 'stage1/wallpaper-v1.png',
  trim: ROOT + 'stage1/oak-trim-v1.png',
  window: ROOT + 'stage1/window-curtains-v1.png',
  floor: ROOT + 'environment-sheet.png',
  rug: ROOT + 'stage1/rectangular-rug-v1.png',
  chair: ROOT + 'stage3/armchair-v1.png',
  fairy: ROOT + 'stage3/illustrated-fairy-v1.png',
};

/** Identifica a atuação ilustrada anterior à largada, sem depender do renderizador 3D. */
export function isChaseIntro(stage) {
  return ['BEAR_DOWN', 'GIRL_APPROACH', 'BEAR_RISE'].includes(stage);
}

/** Calcula o corte após o urso levantar e a revelação do 3D durante a largada. */
export function chaseIntroFade(state) {
  if (state.stage === 'BEAR_RISE') return clamp((state.age - C.stages.BEAR_RISE + .25) / .25, 0, 1);
  if (state.stage === 'CHASE_START') return 1 - clamp(state.age / .4, 0, 1);
  return 0;
}

/** Compõe a cutscene em pintura 2D; recebe o relógio do domínio e nunca avança a simulação. */
export class ChaseIntroRenderer {
  /** Mantém apenas imagens próprias; não instala eventos, controles ou outro laço de animação. */
  constructor() {
    this.images = {}; this.frames = []; this.reachFrames = []; this.disposed = false;
  }

  /** Carrega as artes antes da primeira apresentação, inclusive ao restaurar um save da abertura. */
  async load() {
    await Promise.all(Object.entries(SOURCES).map(async ([key, src]) => {
      const image = new Image(); image.src = src;
      await image.decode();
      if (!this.disposed) this.images[key] = image;
    }));
    if (!this.disposed) {
      this.frames = this.measureFrames(this.images.actors);
      this.reachFrames = this.measureFrames(this.images.reach, [0, 545 / 2172, 1100 / 2172, 1690 / 2172, 1], [0, 1]);
    }
  }

  /** Recorta cada célula pela transparência, preservando o bitmap e uma escala constante por ator. */
  measureFrames(image, columns = [0, 490 / 1774, 920 / 1774, 1340 / 1774, 1], rows = [0, 505 / 887, 1]) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width; canvas.height = image.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    // A prancha gerada possui margens desiguais; estas divisões ficam nos vãos transparentes.
    return Array.from({ length: (columns.length - 1) * (rows.length - 1) }, (_, index) => {
      const col = index % 4, row = Math.floor(index / 4);
      const left = Math.round(columns[col] * image.width), right = Math.round(columns[col + 1] * image.width);
      const top = Math.round(rows[row] * image.height), bottom = Math.round(rows[row + 1] * image.height);
      let x0 = right, y0 = bottom, x1 = left, y1 = top;
      for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) {
        if (pixels[(y * image.width + x) * 4 + 3] > 32) {
          x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
        }
      }
      if (x0 > x1) throw new Error('Pose ilustrada ausente na abertura da perseguição.');
      if (x0 === left || x1 === right - 1 || y0 === top || y1 === bottom - 1) {
        throw new Error('O recorte da abertura está cortando uma pose ilustrada.');
      }
      // O apoio usa a região dos sapatos para o braço estendido não deslocar o corpo para trás.
      let footLeft = x1, footRight = x0;
      for (let y = Math.floor(y1 - (y1 - y0) * .08); y <= y1; y++) for (let x = x0; x <= x1; x++) {
        if (pixels[(y * image.width + x) * 4 + 3] > 32) {
          footLeft = Math.min(footLeft, x); footRight = Math.max(footRight, x);
        }
      }
      return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1, anchorX: (footLeft + footRight) / 2 - x0 };
    });
  }

  /** Desenha uma ilustração de cenário por sua altura, sem deformar suas proporções. */
  picture(ctx, key, x, bottom, height) {
    const image = this.images[key], width = height * image.width / image.height;
    ctx.drawImage(image, x - width / 2, bottom - height, width, height);
  }

  /** Reutiliza parede, madeira e móveis do quarto original em uma composição lateral cinematográfica. */
  backdrop(ctx, w, h) {
    const horizon = h * .48, unit = Math.min(w, h);
    ctx.fillStyle = ctx.createPattern(this.images.wallpaper, 'repeat'); ctx.fillRect(0, 0, w, h);
    this.picture(ctx, 'window', w * .65, horizon - unit * .04, unit * .44);
    ctx.drawImage(this.images.trim, 0, horizon - unit * .07, w, unit * .08);
    this.floor(ctx, w, h, horizon, unit);
    ctx.globalAlpha = .7;
    ctx.drawImage(this.images.rug, w * .2, h * .65, w * .64, unit * .23);
    ctx.globalAlpha = 1;
    this.picture(ctx, 'chair', w * .1, horizon + unit * .16, unit * .29);
    const shade = ctx.createLinearGradient(0, 0, 0, h);
    shade.addColorStop(0, 'rgba(44,25,30,.2)'); shade.addColorStop(.5, 'rgba(255,225,171,.08)'); shade.addColorStop(1, 'rgba(45,24,28,.3)');
    ctx.fillStyle = shade; ctx.fillRect(0, 0, w, h);
  }

  /** Usa o mesmo recorte do quarto e preserva a largura dos veios, sem comprimir várias tábuas em faixas finas. */
  floor(ctx, w, h, horizon, unit) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, horizon, w, h - horizon); ctx.clip();
    let y = horizon, row = 0;
    while (y < h) {
      const near = (y - horizon) / (h - horizon);
      const scale = unit / 600 * (.8 + near * .8);
      const width = 186 * scale, height = 48 * scale * .8;
      const offset = row % 2 ? width * .5 : 0;
      for (let x = -width + offset; x < w; x += width) {
        ctx.drawImage(this.images.floor, 27, 151, 186, 48, x, y, width + 1, height + 1);
      }
      y += height; row++;
    }
    ctx.restore();
  }

  /** Ancora os pés na mesma linha e conserva escala ao alternar caminhada, repouso e levantar. */
  actor(ctx, index, x, baseline, height, first, reaching = false) {
    const frames = reaching ? this.reachFrames : this.frames, frame = frames[index];
    const maxHeight = Math.max(...frames.slice(first, first + 4).map(item => item.h));
    const scale = height / maxHeight;
    const anchor = first === 4 ? frame.w / 2 : frame.anchorX;
    ctx.drawImage(reaching ? this.images.reach : this.images.actors, frame.x, frame.y, frame.w, frame.h,
      x - anchor * scale, baseline - frame.h * scale, frame.w * scale, frame.h * scale);
  }

  /** Sincroniza o quase toque com a reação do urso; a distância final deixa os dedos perto da pelúcia. */
  pose(canvas, state) {
    const w = canvas.width, h = canvas.height, unit = Math.min(w, h);
    const approach = state.stage === 'BEAR_DOWN' ? 0 : state.stage === 'GIRL_APPROACH' ? clamp(state.age / C.stages.GIRL_APPROACH, 0, 1) : 1;
    const travel = clamp(approach / .73, 0, 1), progress = travel * travel * (3 - 2 * travel);
    const reaching = (state.stage === 'GIRL_APPROACH' && approach >= .73) || (state.stage === 'BEAR_RISE' && state.age < .58);
    const walking = state.stage === 'GIRL_APPROACH' && approach < .73;
    const reach = this.reachFrames[2], girlScale = unit * .32 / Math.max(...this.reachFrames.map(item => item.h));
    const bearScale = unit * .34 / Math.max(...this.frames.slice(4).map(item => item.h));
    const bearOrigin = w * .74, bearLeft = bearOrigin - this.frames[4].w * bearScale / 2;
    const target = bearLeft - (reach.w - reach.anchorX) * girlScale - unit * .012;
    const girlX = w * .19 + (target - w * .19) * progress;
    const girlFrame = reaching ? (state.stage === 'BEAR_RISE' ? (state.age < .15 ? 2 : 3) : Math.min(2, Math.floor((approach - .73) / .09))) : walking ? [0, 1, 2, 1][Math.floor(state.age * 4) % 4] : 3;
    const bearFrame = state.stage === 'BEAR_RISE' ? (state.age < .15 ? 4 : state.age < .4 ? 5 : state.age < .67 ? 6 : 7) : 4;
    const flee = state.stage === 'BEAR_RISE' ? clamp((state.age - .82) / .43, 0, 1) : 0;
    return { unit, progress, girlX, girlFrame, reaching, walking, bearFrame, flee,
      bearX: bearOrigin + unit * .16 * flee * flee, baseline: h * (w < h ? .66 : .79),
      handGap: bearLeft - (girlX + (reach.w - reach.anchorX) * girlScale) };
  }

  /** Apresenta aproximação, reação e levantar em desenho, com enquadramento adaptado ao retrato. */
  render(ctx, canvas, state) {
    if (!this.frames.length || this.disposed) return;
    const w = canvas.width, h = canvas.height;
    const { unit, progress, girlX, girlFrame, reaching, walking, bearFrame, flee, bearX, baseline } = this.pose(canvas, state);
    ctx.save();
    const zoom = 1 + .025 * progress;
    ctx.translate(w / 2, h / 2); ctx.scale(zoom, zoom); ctx.translate(-w / 2, -h / 2);
    this.backdrop(ctx, w, h);
    this.actor(ctx, girlFrame, girlX, baseline - (walking ? Math.sin(state.age * Math.PI * 8) * unit * .002 : 0), unit * .32, 0, reaching);
    ctx.save(); ctx.translate(bearX, 0);
    if (flee > 0) ctx.scale(-1, 1);
    this.actor(ctx, bearFrame, 0, baseline - Math.sin(flee * Math.PI) * unit * .02, unit * .34, 4);
    ctx.restore();
    this.picture(ctx, 'fairy', girlX - unit * .09 + Math.sin(state.time * 1.5) * unit * .015,
      baseline - unit * .34 + Math.sin(state.time * 2.5) * unit * .012, unit * .075);
    ctx.restore();
    // Barras cinematográficas pertencem à apresentação; não substituem controles do host.
    ctx.fillStyle = '#211a1c'; ctx.fillRect(0, 0, w, h * .075); ctx.fillRect(0, h * .925, w, h * .075);
  }

  /** Descarta referências e impede que um carregamento atrasado reinstale imagens após a saída. */
  destroy() { this.disposed = true; this.images = {}; this.frames = []; this.reachFrames = []; }
}
