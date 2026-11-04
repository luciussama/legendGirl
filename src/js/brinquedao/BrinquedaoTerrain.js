import {
  brinquedaoBridgeSolid
} from './BrinquedaoObstacles.js';
import {
  drawBrinquedaoSpring
} from './BrinquedaoAttractions.js';
import {
  BRINQUEDAO_ART as ART
} from './BrinquedaoArt.js';
import {
  BRINQUEDAO_STEPS,
  BRINQUEDAO_TRACKS,
  brinquedaoSlope,
  brinquedaoSurface,
  brinquedaoNearby,
  brinquedaoFoundationY,
  brinquedaoSupports
} from './BrinquedaoLevel.js';
/** Extrai apenas o componente medido, sem pixels de módulos vizinhos. */
export function prepareBrinquedaoParts(image, slide) {
  const parts = ART.kit.frames.map((f, index) => {
    const canvas = document.createElement('canvas');
    canvas.width = f.w;
    canvas.height = f.h;
    const ctx = canvas.getContext('2d');
    if (f.rowMask) {
      ctx.beginPath();
      f.rowMask.forEach((r, y) => y ? ctx.lineTo(r[0], y) : ctx.moveTo(r[0], y));
      for (let y = f.rowMask.length - 1; y >= 0; y--) ctx.lineTo(f.rowMask[y][1] + 1, y + 1);
      ctx.closePath();
      ctx.clip();
    }
    ctx.drawImage(image, f.x, f.y, f.w, f.h, 0, 0, f.w, f.h);
    const pixels = ctx.getImageData(0, 0, f.w, f.h)
      .data,
      surface = [];
    for (let x = 0; x < f.w; x++) {
      let found = Math.floor(f.h * .74);
      for (let y = Math.floor(f.h * .56); y < f.h - 20; y++) {
        let count = 0,
          total = 0;
        for (let yy = y; yy < y + 18; yy += 3)
          for (let xx = Math.max(0, x - 4); xx <= Math.min(f.w - 1, x + 4); xx += 2) {
            total++;
            if (pixels[(yy * f.w + xx) * 4 + 3] > 160) count++;
          }
        if (count / total > .9) {
          found = y + 3;
          break;
        }
      }
      surface.push(found);
    }
    const smooth = surface.map((v, x) => {
      const values = surface.slice(Math.max(0, x - 12), x + 13)
        .sort((a, b) => a - b);
      return values[Math.floor(values.length / 2)];
    });
    return {
      canvas,
      index,
      surface: smooth
    };
  });
  const canvas = document.createElement('canvas');
  canvas.width = slide.width;
  canvas.height = slide.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(slide, 0, 0);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
    .data,
    surface = [];
  for (let x = 0; x < canvas.width; x++) {
    let y = 0;
    while (y < canvas.height && pixels[(y * canvas.width + x) * 4 + 3] < 160) y++;
    surface.push(y + 22);
  }
  const smooth = surface.map((v, x) => {
    const a = surface.slice(Math.max(0, x - 6), x + 7)
      .sort((a, b) => a - b);
    return a[Math.floor(a.length / 2)];
  });
  const slidePart = {
      canvas,
      surface: smooth
    },
    ribbon = document.createElement('canvas');
  ribbon.width = 240;
  ribbon.height = 155;
  const rc = ribbon.getContext('2d');
  // Recorte central sem pés/postes; reflexão da textura torna as emendas periódicas contínuas.
  for (let x = 0; x < 240; x++) {
    const sx = 320 + (x < 120 ? x : 239 - x),
      anchor = surfaceAt(slidePart, sx);
    rc.drawImage(canvas, sx, anchor - 22, 1, 155, x, 0, 1, 155);
  }
  slidePart.ribbon = {
    canvas: ribbon,
    surface: Array(240)
      .fill(22)
  };
  parts.push(slidePart);
  return parts;
}

function pillar(ctx, support, parts, viewportBottom) {
  const {
    x,
    top,
    bottom
  } = support, image = parts[4].canvas, renderBottom = Number.isFinite(viewportBottom) ? Math.max(bottom, viewportBottom + 64) : bottom;
  if (renderBottom <= top + 30) return;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x - 16, top, 32, renderBottom - top, 15);
  ctx.clip();
  ctx.drawImage(image, image.width * .087, image.height * .31, image.width * .039, image.height * .53, x - 16, top, 32, renderBottom - top);
  ctx.restore();
  const foot = 18;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x - 25, renderBottom - foot, 50, foot, 8);
  ctx.clip();
  ctx.drawImage(image, image.width * .087, image.height * .31, image.width * .039, image.height * .53, x - 25, renderBottom - foot, 50, foot);
  ctx.restore();
}

function trackSupports(ctx, p, parts, viewportBottom) {
  for (const support of brinquedaoSupports(p)) pillar(ctx, support, parts, viewportBottom);
}
/** Amostra contínua evita os degraus de pixels causados por arredondar cada coluna da ilustração. */
function surfaceAt(part, x) {
  const a = Math.max(0, Math.min(part.surface.length - 1, x)),
    i = Math.floor(a),
    u = a - i;
  return part.surface[i] * (1 - u) + part.surface[Math.min(i + 1, part.surface.length - 1)] * u;
}
/** Recuo do acabamento mantém toda a espuma arredondada dentro do apoio físico. */
function drawPaddedEnd(ctx, part, p, x, side) {
  const image = part.canvas,
    margin = .15,
    sw = image.width * (1 - 2 * margin),
    sampleWidth = 40,
    center = image.width * margin + (side < 0 ? 0 : sw),
    sx = Math.max(0, Math.min(image.width - sampleWidth, center - sampleWidth / 2)),
    sample = sx + sampleWidth / 2,
    anchor = surfaceAt(part, sample),
    sourceTop = Math.max(0, anchor - 18),
    sourceHeight = Math.min(108, image.height - sourceTop),
    k = 250 / image.height,
    width = 38,
    y = (sourceTop - anchor) * k,
    height = sourceHeight * k;
  const centerX = x - side * width / 2;
  if (centerX - width / 2 < p.from || centerX + width / 2 > p.to) throw RangeError(`Acabamento visual fora do apoio físico de ${p.id}.`);
  ctx.save();
  ctx.translate(centerX, brinquedaoSurface(p, centerX));
  ctx.rotate(Math.atan(brinquedaoSlope(p, centerX)));
  ctx.beginPath();
  ctx.roundRect(-width / 2, y, width, height, 14);
  ctx.clip();
  ctx.drawImage(image, sx, sourceTop, sampleWidth, sourceHeight, -width / 2, y, width, height);
  ctx.restore();
}
/** Deforma cada faixa por uma transformação afim, conservando a tangente entre suas extremidades. */
export function drawBrinquedaoSurfaceStrip(ctx, part, sx, nextSx, x, nextX, y, nextY, k, height) {
  const anchor = surfaceAt(part, sx),
    nextAnchor = surfaceAt(part, nextSx),
    w = nextX - x;
  if (w <= 0) return;
  ctx.save();
  ctx.transform(1, (nextY - y - (nextAnchor - anchor) * k) / w, 0, 1, x, y - anchor * k);
  ctx.drawImage(part.canvas, sx, 0, Math.max(.01, nextSx - sx), height, 0, 0, w + .35, height * k);
  ctx.restore();
}
/** Desníveis são degraus acolchoados com espelho e base comuns, não peças cortadas no ar. */
function stepJoint(ctx, parts, step, viewportBottom) {
  const part = parts[0],
    im = part.canvas,
    sx = im.width * .48,
    sy = surfaceAt(part, sx) + 22,
    sh = Math.min(70, im.height - sy - 2),
    x = step.x,
    y = step.top,
    h = step.bottom - step.top;
  pillar(ctx, {
    x,
    top: y + 30,
    bottom: brinquedaoFoundationY(x)
  }, parts, viewportBottom);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + 32, y + 8);
  ctx.lineTo(x + 32, y + h + 58);
  ctx.lineTo(x - 30, y + h + 58);
  ctx.lineTo(x - 30, y + h + 8);
  ctx.quadraticCurveTo(x - 9, y + h + 5, x - 9, y + h - 16);
  ctx.lineTo(x - 9, y + 25);
  ctx.quadraticCurveTo(x - 9, y + 8, x + 8, y + 8);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(im, sx, sy, 90, sh, x - 30, y + 8, 62, h + 50);
  ctx.restore();
}
/** Madeira, redes e acolchoados são material real do brinquedo, sem marcações auxiliares de salto. */
export function drawBrinquedaoTerrain(ctx, parts, left, right, s, attractions, look = null, viewportBottom = null) {
  for (const p of brinquedaoNearby(left - 150, right + 150)
      .sort((a, b) => Math.max(b.y, b.end) - Math.max(a.y, a.end))) {
    if (p.kind === 'spring') {
      trackSupports(ctx, p, parts, viewportBottom);
      drawBrinquedaoSpring(ctx, attractions[0].canvas, p, s);
      continue;
    }

    trackSupports(ctx, p, parts, viewportBottom);
    if (p.kind === 'slide' || p.kind === 'reverse') {
      const k = .78,
        part = parts[4].ribbon,
        image = part.canvas,
        tile = image.width * k;
      // O mesmo material percorre todas as curvas; a textura segue a posição do mundo, sem reiniciar em cada peça.
      for (let x = Math.max(p.from, left - 6); x < p.to && x < right + 6;) {
        const sx = ((x % tile) + tile) % tile / k,
          w = Math.min(4, p.to - x, (image.width - sx) * k),
          nx = x + w;
        if (w < .00001) {
          x += .00001;
          continue;
        }
        drawBrinquedaoSurfaceStrip(ctx, part, sx, sx + w / k, x, nx, brinquedaoSurface(p, x), brinquedaoSurface(p, nx), k, image.height);
        x = nx;
      }
      continue;
    }
    const fallen = p.kind === 'fragile' && !brinquedaoBridgeSolid(s, p),
      age = fallen ? s.time - s.obstacles.bridges[p.id] - p.delay * (s.difficulty === 'EASY' ? 1.6 : 1) : 0;
    if (fallen && age > 1.5) continue;
    ctx.save();
    if (fallen) {
      ctx.translate(p.from, p.y + 400 * age * age);
      ctx.rotate(age * .32);
      ctx.translate(-p.from, -p.y);
      ctx.globalAlpha = Math.max(0, 1 - age / 1.5);
    }
    const part = p.kind === 'fragile' && look ? look.fragile : ['bridge', 'fragile', 'fish-bridge'].includes(p.kind) ? parts[1] : look?.quiet ?? parts[0],
      image = part.canvas,
      margin = .15,
      sw = image.width * (1 - 2 * margin),
      height = p.kind === 'fragile' ? 145 : ['bridge', 'fish-bridge'].includes(p.kind) ? 215 : 250,
      k = height / image.height;
    // Registra o topo pintado no apoio físico; postes e rede permanecem atrás dos pés.
    for (let x = Math.max(p.from, left - 6); x < p.to && x < right + 6; x += 4) {
      const nx = Math.min(p.to, x + 4),
        sx = image.width * margin + sw * (x - p.from) / (p.to - p.from),
        nsx = image.width * margin + sw * (nx - p.from) / (p.to - p.from);
      drawBrinquedaoSurfaceStrip(ctx, part, sx, nsx, x, nx, brinquedaoSurface(p, x), brinquedaoSurface(p, nx), k, image.height);
    }
    ctx.restore();
    if (p.upper && !p.recovery && p.kind === 'pad') {
      const endPart = look?.quiet ?? parts[0];
      drawPaddedEnd(ctx, endPart, p, p.from, -1);
      drawPaddedEnd(ctx, endPart, p, p.to, 1);
    }
  }
  for (const step of BRINQUEDAO_STEPS)
    if (step.x >= left - 100 && step.x <= right + 100) stepJoint(ctx, parts, step, viewportBottom);
  drawConnections(ctx, parts, look, left, right);
}

/** Presilhas cobrem somente encontros reais; o bocal arredondado conserva o fim físico da rampa. */
function drawConnections(ctx, parts, look, left, right) {
  if (!look) return;
  if (!parts.connections) parts.connections = BRINQUEDAO_TRACKS.filter(p => ['slide', 'reverse'].includes(p.kind))
    .flatMap(p => [p.from, p.to].filter(x => BRINQUEDAO_TRACKS.some(a => a !== p && !['fragile', 'spring'].includes(a.kind) && x >= a.from && x <= a.to && Math.abs(brinquedaoSurface(a, x) - brinquedaoSurface(p, x)) < 2))
      .map(x => ({
        x,
        y: brinquedaoSurface(p, x),
        angle: Math.atan(brinquedaoSlope(p, x))
      })));
  for (const v of parts.connections)
    if (v.x > left - 80 && v.x < right + 80) look.joint(ctx, v.x, v.y, v.angle);
  const p = BRINQUEDAO_TRACKS.find(p => p.id === 'rampa-reversa');
  if (p.to > left - 100 && p.to < right + 100) look.joint(ctx, p.to, p.end, Math.atan((p.end - brinquedaoSurface(p, p.to - 4)) / 4), true);
}
