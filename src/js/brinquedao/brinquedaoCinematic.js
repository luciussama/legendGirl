import { BRINQUEDAO_ART as ART } from './brinquedaoArt.js';
import { BRINQUEDAO_INTRO, BRINQUEDAO_ENDING } from './brinquedaoStory.js';
import { getDialogueSafeArea } from '../ui/dialogueSafeArea.js';
import { renderPoeticNarration } from '../narrative/poeticNarrator.js';
import { CHAPTER_ART } from '../chapters/chapterArt.js';
const measurements = new WeakMap();
const smooth = (t) => {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
};
/** Pose completa com a mesma escala corporal; máscaras não deixam aparecer pixels de outra célula. */
export function drawBrinquedaoGirl(
  ctx,
  images,
  index,
  x,
  base,
  height,
  { flip = 1, tilt = 0, time = 0, seat = false } = {},
) {
  const f = ART.girl.frames[index],
    scale = height / ART.girl.referenceHeight;
  ctx.save();
  ctx.translate(x, base);
  ctx.rotate(tilt);
  ctx.scale(flip * scale, scale * (1 + Math.sin(time * 1.8) * 0.002));
  ctx.translate(seat ? -f.w * 0.32 : -f.anchorX, seat ? -f.h * 0.78 : -f.h);
  ctx.beginPath();
  f.rowMask.forEach((r, y) => (y ? ctx.lineTo(r[0], y) : ctx.moveTo(r[0], y)));
  for (let y = f.rowMask.length - 1; y >= 0; y--) ctx.lineTo(f.rowMask[y][1] + 1, y + 1);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(images.get(ART.girl.file), f.x, f.y, f.w, f.h, 0, 0, f.w, f.h);
  ctx.restore();
}
/** Nanda acompanha em tamanho normal, com asas separadas do corpo e batimento suave. */
export function drawBrinquedaoFairy(ctx, image, x, y, height, time) {
  const k = height / image.height,
    left = image.width * 0.24,
    right = image.width * 0.77,
    beat = 0.72 + 0.28 * Math.abs(Math.sin(time * 18));
  ctx.save();
  ctx.translate(x, y);
  ctx.drawImage(
    image,
    left,
    0,
    right - left,
    image.height,
    (-image.width / 2 + left) * k,
    -height / 2,
    (right - left) * k,
    height,
  );
  ctx.drawImage(
    image,
    0,
    0,
    left,
    image.height,
    (-image.width / 2 + left - left * beat) * k,
    -height / 2,
    left * k * beat,
    height,
  );
  ctx.drawImage(
    image,
    right,
    0,
    image.width - right,
    image.height,
    (-image.width / 2 + right) * k,
    -height / 2,
    (image.width - right) * k * beat,
    height,
  );
  ctx.restore();
}
/** Medo no piquenique, convite de Nanda e revelação ensolarada do brinquedão, fora do mapa jogável. */
export function renderBrinquedaoCinematic(ctx, canvas, s, images, onAdvance) {
  const { width, height } = canvas,
    card = BRINQUEDAO_INTRO[s.story.index],
    safe = getDialogueSafeArea(canvas),
    css = width / (canvas.clientWidth || width),
    rect = canvas.getBoundingClientRect(),
    bar = document.querySelector('.top-controls-bar')?.getBoundingClientRect(),
    inset = Math.max(
      safe.top,
      bar ? ((bar.bottom - rect.top) * height) / rect.height + 12 * css : 0,
    ),
    low = width > height && (canvas.clientHeight || height) < 480,
    textCanvas = {
      width: safe.right - safe.left,
      height: height - inset,
      dialogueControlScale: css,
      clientWidth: (safe.right - safe.left) / (css * (low ? 0.8 : 1)),
    },
    key = [width, height, inset, css, document.fonts?.status].join(':');
  let cached = measurements.get(canvas);
  if (cached?.key !== key) {
    const measure = document.createElement('canvas').getContext('2d'),
      bottom = Math.max(
        ...BRINQUEDAO_INTRO.map((c) => {
          const b = renderPoeticNarration(measure, textCanvas, c.text, {
            heading: c.speaker,
            interactive: false,
          });
          return b.y + b.height + 48 * css;
        }),
      );
    cached = {
      key,
      bottom,
    };
    measurements.set(canvas, cached);
  }
  const portrait = height > width,
    showPlayground = s.story.index >= 5,
    scale = Math.max(width / 1652, height / 952),
    halfW = width / scale / 2,
    halfH = height / scale / 2,
    focusX = Math.max(
      halfW,
      Math.min(
        1652 - halfW,
        portrait
          ? s.story.index < 3
            ? 850
            : s.story.index === 3
              ? 850 + 100 * smooth(s.story.age / 1.2)
              : 950
          : 1000,
      ),
    ),
    focusY = Math.max(halfH, Math.min(952 - halfH, portrait ? 476 : 530)),
    base = showPlayground ? 840 : 735,
    bottom = height / 2 + (base - focusY) * scale,
    factor = Math.min(
      1,
      Math.max(0.35, (bottom - inset - cached.bottom - 12 * css) / (360 * scale)),
    ),
    t = s.story.index * 6 + s.story.age;
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(scale, scale);
  ctx.translate(-focusX, -focusY);
  ctx.drawImage(
    images.get(
      showPlayground ? ART.background.file : 'garden/cinematic/picnic-without-yuna-v1.png',
    ),
    0,
    0,
    1652,
    952,
  );
  drawBrinquedaoGirl(ctx, images, card.pose, 895, base, 340 * factor, {
    time: t,
  });
  drawBrinquedaoFairy(
    ctx,
    images.get('toy-room/stage3/illustrated-fairy-v1.png'),
    s.story.index < 3 ? 700 : s.story.index === 3 ? 700 + 360 * smooth(s.story.age / 1.2) : 1060,
    base - 205 * factor + Math.sin(t * 2) * 5,
    145 * factor,
    t,
  );
  ctx.restore();
  ctx.save();
  ctx.translate(safe.left, inset);
  renderPoeticNarration(ctx, textCanvas, card.text, {
    heading: card.speaker,
    advanceCanvas: canvas,
    onAdvance,
  });
  ctx.restore();
}

/** Encerramento canônico do Brinquedão em tela cheia na altura dos olhos, com cortes de plano e fade. */
export function renderBrinquedaoEndingCinematic(ctx, canvas, s, images, onAdvance) {
  const { width, height } = canvas,
    safe = getDialogueSafeArea(canvas),
    css = width / (canvas.clientWidth || width),
    rect = canvas.getBoundingClientRect(),
    bar = document.querySelector('.top-controls-bar')?.getBoundingClientRect(),
    inset = Math.max(
      safe.top,
      bar ? ((bar.bottom - rect.top) * height) / rect.height + 12 * css : 0,
    ),
    low = width > height && (canvas.clientHeight || height) < 480,
    textCanvas = {
      width: safe.right - safe.left,
      height: height - inset,
      dialogueControlScale: css,
      clientWidth: (safe.right - safe.left) / (css * (low ? 0.8 : 1)),
    },
    endingIdx = Math.min(BRINQUEDAO_ENDING.length - 1, Math.max(0, s.story.endingIndex ?? 0)),
    beat = BRINQUEDAO_ENDING[endingIdx],
    beatAge = s.story.endingAge ?? s.age,
    p = smooth(beatAge / beat.duration);

  // --- CÂMERA E PLANOS DE CORTE (SHOTS) ---
  const [shotX, shotY, fromZoom, toZoom] = beat.shot,
    zoom = fromZoom + (toZoom - fromZoom) * p,
    scale = Math.max(width / 1652, height / 952) * zoom,
    halfW = width / scale / 2,
    halfH = height / scale / 2,
    portrait = height > width,
    focusX = Math.max(halfW, Math.min(1652 - halfW, portrait ? 920 : shotX)),
    focusY = Math.max(halfH, Math.min(952 - halfH, shotY)),
    base = 840,
    bottom = height / 2 + (base - focusY) * scale,
    factor = Math.min(1, Math.max(0.35, (bottom - inset - 140 * css) / (340 * scale))),
    t = s.time;

  ctx.save();
  ctx.fillStyle = '#0f1412';
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(scale, scale);
  ctx.translate(-focusX, -focusY);

  const bg = images.get(ART.background.file);
  if (bg) ctx.drawImage(bg, 0, 0, 1652, 952);

  // --- ALMOFADAS E COLCHONETES COLORIDOS NO GRAMADO ---
  const matX = 895,
    matY = base - 6 * factor,
    mf = factor;
  ctx.save();
  ctx.translate(matX, matY);
  ctx.fillStyle = '#61b0c6';
  ctx.beginPath();
  ctx.roundRect(-210 * mf, -16 * mf, 420 * mf, 32 * mf, 16 * mf);
  ctx.fill();
  ctx.strokeStyle = '#4e95a8';
  ctx.lineWidth = 2 * mf;
  ctx.stroke();
  ctx.fillStyle = '#f5d359';
  ctx.beginPath();
  ctx.roundRect(-180 * mf, -36 * mf, 360 * mf, 26 * mf, 13 * mf);
  ctx.fill();
  ctx.strokeStyle = '#d9b33a';
  ctx.lineWidth = 2 * mf;
  ctx.stroke();
  ctx.fillStyle = '#e86e58';
  ctx.beginPath();
  ctx.roundRect(-160 * mf, -54 * mf, 120 * mf, 30 * mf, 15 * mf);
  ctx.fill();
  ctx.fillStyle = '#f2b53f';
  ctx.beginPath();
  ctx.roundRect(40 * mf, -50 * mf, 105 * mf, 28 * mf, 14 * mf);
  ctx.fill();
  ctx.restore();

  // --- ATUAÇÃO DAS PERSONAGENS ---
  const sleepImg = images.get('chapters/yuna-sleeping-v1.png'),
    fairyImg = images.get('chapters/nanda-gestures-v1.png'),
    fairyFlying = images.get('toy-room/stage3/illustrated-fairy-v1.png');

  if (endingIdx === 0) {
    const walkProg = smooth(beatAge / 2.8),
      curX = 760 + (895 - 760) * walkProg;
    if (walkProg < 0.82) {
      drawBrinquedaoGirl(ctx, images, 2, curX, base, 340 * factor, {
        time: t,
      });
    } else {
      const sitProg = smooth((walkProg - 0.82) / 0.18),
        f0 = CHAPTER_ART.sleep.frames[0],
        k0 = (340 * factor) / CHAPTER_ART.sleep.referenceHeight,
        breath0 = 1 + Math.sin(t * 1.5) * 0.003;
      if (sleepImg) {
        ctx.save();
        ctx.globalAlpha = sitProg;
        ctx.drawImage(
          sleepImg,
          f0.x,
          f0.y,
          f0.w,
          f0.h,
          895 - f0.anchorX * k0,
          base - f0.h * k0 * breath0,
          f0.w * k0,
          f0.h * k0 * breath0,
        );
        ctx.restore();
      }
      if (sitProg < 1) {
        ctx.save();
        ctx.globalAlpha = 1 - sitProg;
        drawBrinquedaoGirl(ctx, images, 2, 895, base, 340 * factor, {
          time: t,
        });
        ctx.restore();
      }
    }
    drawBrinquedaoFairy(
      ctx,
      fairyFlying,
      curX - 85,
      base - 180 * factor + Math.sin(t * 2.2) * 6,
      145 * factor,
      t,
    );
  } else if (endingIdx === 1) {
    const f0 = CHAPTER_ART.sleep.frames[0],
      k0 = (340 * factor) / CHAPTER_ART.sleep.referenceHeight,
      breath0 = 1 + Math.sin(t * 1.5) * 0.003;
    if (sleepImg) {
      ctx.drawImage(
        sleepImg,
        f0.x,
        f0.y,
        f0.w,
        f0.h,
        895 - f0.anchorX * k0,
        base - f0.h * k0 * breath0,
        f0.w * k0,
        f0.h * k0 * breath0,
      );
    }
    drawBrinquedaoFairy(
      ctx,
      fairyFlying,
      810 + Math.sin(t * 1.8) * 4,
      base - 150 * factor + Math.sin(t * 2.5) * 4,
      140 * factor,
      t,
    );
  } else if (endingIdx === 2) {
    const f1 = CHAPTER_ART.sleep.frames[1],
      k1 = (340 * factor) / CHAPTER_ART.sleep.referenceHeight,
      breath1 = 1 + Math.sin(t * 1.2) * 0.002;
    if (sleepImg) {
      ctx.drawImage(
        sleepImg,
        f1.x,
        f1.y,
        f1.w,
        f1.h,
        895 - f1.anchorX * k1,
        base - f1.h * k1 * breath1,
        f1.w * k1,
        f1.h * k1 * breath1,
      );
    }
    const flight = smooth(beatAge / 3.5),
      fStartX = 810,
      fStartY = base - 150 * factor,
      fEndX = 815,
      fEndY = base - 15 * factor,
      fX = fStartX + (fEndX - fStartX) * flight,
      fY = fStartY + (fEndY - fStartY) * flight - Math.sin(flight * Math.PI) * 20 * factor;
    if (flight < 0.95 && fairyFlying) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - (flight - 0.7) / 0.25);
      drawBrinquedaoFairy(
        ctx,
        fairyFlying,
        fX,
        fY,
        (140 - 20 * flight) * factor,
        t * (1 - flight * 0.75),
      );
      ctx.restore();
    }
    if (flight > 0.7 && fairyImg) {
      const alphaFairy = smooth((flight - 0.7) / 0.25),
        ff = CHAPTER_ART.fairy.frames[1],
        kF = (115 * factor) / CHAPTER_ART.fairy.referenceHeight,
        breathF = 1 + Math.sin(t * 1.2) * 0.003;
      ctx.save();
      ctx.globalAlpha = alphaFairy;
      ctx.drawImage(
        fairyImg,
        ff.x,
        ff.y,
        ff.w,
        ff.h,
        815 - ff.anchorX * kF,
        base - ff.h * kF * breathF,
        ff.w * kF,
        ff.h * kF * breathF,
      );
      ctx.restore();
    }
  } else if (endingIdx === 3) {
    const f1 = CHAPTER_ART.sleep.frames[1],
      k1 = (340 * factor) / CHAPTER_ART.sleep.referenceHeight,
      breath1 = 1 + Math.sin(t * 1.2) * 0.002;
    if (sleepImg) {
      ctx.drawImage(
        sleepImg,
        f1.x,
        f1.y,
        f1.w,
        f1.h,
        895 - f1.anchorX * k1,
        base - f1.h * k1 * breath1,
        f1.w * k1,
        f1.h * k1 * breath1,
      );
    }
    const ff = CHAPTER_ART.fairy.frames[1],
      kF = (115 * factor) / CHAPTER_ART.fairy.referenceHeight,
      breathF = 1 + Math.sin(t * 1.2) * 0.003;
    if (fairyImg) {
      ctx.drawImage(
        fairyImg,
        ff.x,
        ff.y,
        ff.w,
        ff.h,
        815 - ff.anchorX * kF,
        base - ff.h * kF * breathF,
        ff.w * kF,
        ff.h * kF * breathF,
      );
    }
  }

  // --- ILUMINAÇÃO DE FIM DE TARDE / DOURADA ---
  const sunset = ctx.createLinearGradient(0, 0, 1652, 952);
  sunset.addColorStop(0, 'rgba(255, 220, 140, 0.12)');
  sunset.addColorStop(0.5, 'rgba(255, 175, 90, 0.10)');
  sunset.addColorStop(1, 'rgba(80, 50, 100, 0.16)');
  ctx.fillStyle = sunset;
  ctx.fillRect(0, 0, 1652, 952);

  // --- BRILHOS MÁGICOS DOURADOS DA FADINHA ---
  ctx.save();
  for (let n = 0; n < 8; n++) {
    const sparkT = t * 1.5 + n * 0.8,
      sx = 830 + Math.sin(sparkT * 1.1 + n) * 90 * factor,
      sy = base - 80 * factor + Math.cos(sparkT * 1.4 + n * 2) * 50 * factor,
      sa = 0.35 + 0.35 * Math.sin(sparkT * 2.5 + n),
      sr = (2 + (n % 3)) * factor;
    ctx.fillStyle = `rgba(255, 240, 170, ${sa})`;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.restore();

  // --- MOLDURA POÉTICA NARRATIVA ---
  ctx.save();
  ctx.translate(safe.left, inset);
  renderPoeticNarration(ctx, textCanvas, beat.text, {
    heading: beat.speaker,
    advanceCanvas: canvas,
    onAdvance,
  });
  ctx.restore();

  // --- TRANSIÇÕES DE FADE ---
  if (endingIdx === 0 && beatAge < 0.8) {
    const alphaIn = 1 - smooth(beatAge / 0.8);
    ctx.fillStyle = `rgba(15,20,18,${alphaIn})`;
    ctx.fillRect(0, 0, width, height);
  }
  if (endingIdx === 3 && beatAge > beat.duration - 3.2) {
    const alphaOut = smooth((beatAge - (beat.duration - 3.2)) / 3.0);
    ctx.fillStyle = `rgba(15,20,18,${alphaOut})`;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
}
