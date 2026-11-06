import { BRINQUEDAO_ART as ART } from './brinquedaoArt.js';

export const BRINQUEDAO_LOOK_THEMES = Object.freeze(
  [
    {
      name: 'Oficina dos blocos',
      wash: '#f6e8c9',
      accent: '#c68443',
      file: 'brinquedao/interior-blocks-v2.jpg',
    },
    {
      name: 'Pista das bolinhas',
      wash: '#d8efeb',
      accent: '#4c9eab',
      file: 'brinquedao/interior-balls-v2.jpg',
    },
    {
      name: 'Salão musical',
      wash: '#e7e1f2',
      accent: '#8c72a8',
      file: 'brinquedao/interior-musical-v2.jpg',
    },
    {
      name: 'Nuvens de espuma',
      wash: '#f5e4df',
      accent: '#c58791',
      file: 'brinquedao/interior-foam-v2.jpg',
    },
  ].map(Object.freeze),
);

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function rounded(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}
/** Materiais e atmosfera preparados uma vez; nenhuma imagem nova, colisor ou estado de gameplay. */
export class BrinquedaoLook {
  /** Prepara fundos e materiais reutilizáveis sem adicionar recursos ou estado de jogo. */
  constructor(images, parts, inside) {
    this.parts = parts;
    this.backgrounds = [];
    this.canvases = [];
    this.outside = this.grade(images.get(ART.background.file), '#fff4d7', false);
    this.sky = this.copy(this.outside);
    const c = this.sky.getContext('2d');
    c.globalCompositeOperation = 'destination-in';
    const g = c.createLinearGradient(0, 0, 0, this.sky.height * 0.24);
    g.addColorStop(0, 'transparent');
    g.addColorStop(1, '#000');
    c.fillStyle = g;
    c.fillRect(0, 0, this.sky.width, this.sky.height);
    for (const theme of BRINQUEDAO_LOOK_THEMES)
      this.backgrounds.push(this.grade(images.get(theme.file), theme.wash, true));
    this.quiet = {
      canvas: this.copy(parts[0].canvas),
      surface: parts[0].surface,
    };
    const q = this.quiet.canvas.getContext('2d'),
      net = q.getImageData(0, 0, this.quiet.canvas.width, this.quiet.canvas.height);
    for (let x = 0; x < this.quiet.canvas.width; x++)
      for (let y = 0; y < this.quiet.canvas.height; y++) {
        const u = Math.max(0, Math.min(1, (y - (parts[0].surface[x] - 70)) / 40)),
          alpha = 0.22 + 0.78 * u * u * (3 - 2 * u);
        net.data[(y * this.quiet.canvas.width + x) * 4 + 3] *= alpha;
      }
    q.putImageData(net, 0, 0);
    this.fragile = this.prepareFragile(parts[1]);
    this.tube = this.prepareTube(inside[0].canvas);
    this.well = canvas(320, 190);
    this.canvases.push(this.well);
    const w = this.well.getContext('2d'),
      shade = w.createRadialGradient(160, 95, 10, 160, 95, 150);
    shade.addColorStop(0, 'rgba(20,44,55,.76)');
    shade.addColorStop(0.6, 'rgba(20,44,55,.58)');
    shade.addColorStop(1, 'rgba(20,44,55,0)');
    w.fillStyle = shade;
    w.fillRect(0, 0, 320, 190);
  }
  /** Clona um canvas e registra a cópia para descarte no encerramento. */
  copy(source) {
    const c = canvas(source.width, source.height);
    c.getContext('2d').drawImage(source, 0, 0);
    this.canvases.push(c);
    return c;
  }
  /** Ajusta cor e foco da pintura para o ambiente interno ou externo. */
  grade(source, wash, inside) {
    const c = canvas(960, Math.round((960 * source.height) / source.width)),
      ctx = c.getContext('2d');
    this.canvases.push(c);
    ctx.filter = `blur(${inside ? 1.1 : 1.4}px) saturate(${inside ? 0.58 : 0.48}) contrast(${inside ? 0.68 : 0.66})`;
    ctx.drawImage(source, 0, 0, c.width, c.height);
    ctx.filter = 'none';
    ctx.globalAlpha = inside ? 0.19 : 0.23;
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, 960, 640);
    ctx.globalAlpha = 1;
    // O véu amplo dissolve plataformas falsas da pintura sem desenhar um retângulo sobre a pista.
    const veil = ctx.createRadialGradient(520, 370, 50, 520, 370, 570);
    veil.addColorStop(0, inside ? 'rgba(251,246,224,.08)' : 'rgba(255,247,218,.08)');
    veil.addColorStop(1, 'rgba(255,248,225,0)');
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, 960, 640);
    return c;
  }
  /** Prepara a aparência quebradiça sem modificar a superfície usada pela física. */
  prepareFragile(part) {
    const c = canvas(part.canvas.width, part.canvas.height),
      ctx = c.getContext('2d');
    this.canvases.push(c);
    ctx.filter = 'saturate(.55) brightness(.91)';
    ctx.drawImage(part.canvas, 0, 0);
    ctx.filter = 'none';
    // Rachaduras e fibras pertencem às ripas; não marcam a hitbox nem a superfície de salto.
    for (const u of [0.24, 0.4, 0.58, 0.76]) {
      const x = Math.floor(c.width * u),
        y = part.surface[x] + 3;
      ctx.strokeStyle = '#513c29';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 13, y + 5);
      ctx.lineTo(x, y + 13);
      ctx.lineTo(x - 4, y + 23);
      ctx.lineTo(x + 13, y + 31);
      ctx.stroke();
      ctx.strokeStyle = '#d3b78d';
      ctx.lineWidth = 1.4;
      for (let n = 0; n < 4; n++) {
        ctx.beginPath();
        ctx.moveTo(x + 17, y + 25);
        ctx.quadraticCurveTo(x + 31 + n * 3, y + 34, x + 22 + n * 5, y + 45 + n * 3);
        ctx.stroke();
      }
    }
    return {
      canvas: c,
      surface: part.surface,
    };
  }
  /** Atenua reflexos no interior do tubo sem apagar moldura, abraçadeiras ou piso. */
  prepareTube(source) {
    const c = this.copy(source),
      ctx = c.getContext('2d');
    // Atenua o miolo reflexivo sem apagar braçadeiras, moldura ou piso do tubo.
    ctx.globalCompositeOperation = 'source-atop';
    const g = ctx.createLinearGradient(0, 0, 0, c.height);
    g.addColorStop(0, 'rgba(27,61,67,0)');
    g.addColorStop(0.22, 'rgba(27,61,67,.26)');
    g.addColorStop(0.67, 'rgba(27,61,67,.26)');
    g.addColorStop(0.84, 'rgba(27,61,67,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);
    return c;
  }
  /** Recorta a área ao redor da pose e compõe o fundo sombreado da piscina. */
  focus(ctx, pose, diameter) {
    ctx.save();
    ctx.translate(pose.x, pose.y);
    ctx.rotate(pose.angle);
    ctx.beginPath();
    ctx.roundRect(-150, -diameter * 0.35, 300, diameter * 0.7, 35);
    ctx.clip();
    ctx.drawImage(this.well, -160, -diameter * 0.42, 320, diameter * 0.84);
    ctx.restore();
  }
  /** Desenha bloco em queda com textura, sombra e acabamento musical. */
  block(ctx, image, x, y, w, index, age) {
    const cell = image.width / 2,
      sx = (index % 2) * cell + 12,
      sy = (Math.floor(index / 2) % 2) * cell + 12,
      colors = ['#d96650', '#efbd43', '#328f87', '#4d7d9f'];
    ctx.save();
    ctx.translate(x, y + Math.max(0, age) ** 2 * 620);
    ctx.rotate(Math.max(0, age) * 0.7 * (index % 2 ? 1 : -1));
    ctx.fillStyle = 'rgba(32,49,51,.2)';
    ctx.beginPath();
    ctx.ellipse(w / 2, 111, w * 0.46, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, w, 108, 10);
    ctx.clip();
    ctx.fillStyle = colors[index % 4];
    ctx.fillRect(0, 0, w, 108);
    ctx.globalAlpha = 0.23;
    ctx.drawImage(image, sx, sy, cell - 24, cell - 24, 0, 0, w, 108);
    ctx.globalAlpha = 1;
    const g = ctx.createLinearGradient(0, 0, 0, 108);
    g.addColorStop(0, 'rgba(255,249,214,.35)');
    g.addColorStop(0.18, 'rgba(255,249,214,.08)');
    g.addColorStop(0.84, 'rgba(30,49,52,.08)');
    g.addColorStop(1, 'rgba(30,49,52,.32)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, 108);
    rounded(ctx, 7, 5, w - 14, 12, 5, 'rgba(255,249,217,.25)');
    rounded(ctx, w - 10, 15, 10, 86, 5, 'rgba(36,53,55,.15)');
    ctx.restore();
    // A marca musical é estampada na face, abaixo do apoio, e liga os blocos ao salão.
    ctx.fillStyle = 'rgba(34,55,57,.4)';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, 69, 9, 6, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w * 0.5 + 6, 43, 3, 26);
    ctx.restore();
  }
  /** Compõe a rampa triangular texturizada sobre a superfície física fornecida. */
  triangle(ctx, image, t, floor) {
    ctx.save();
    ctx.translate(t.x, floor);
    ctx.beginPath();
    ctx.moveTo(-t.width / 2, 0);
    ctx.lineTo(0, -t.height);
    ctx.lineTo(t.width / 2, 0);
    ctx.closePath();
    ctx.clip();
    const g = ctx.createLinearGradient(-t.width / 2, -t.height, t.width / 2, 0);
    g.addColorStop(0, '#fff0a4');
    g.addColorStop(0.5, '#e9b44c');
    g.addColorStop(1, '#b8533d');
    ctx.fillStyle = g;
    ctx.fillRect(-t.width / 2, -t.height, t.width, t.height);
    ctx.globalAlpha = 0.15;
    ctx.drawImage(image, 9, 0, 43, 28, -t.width / 2, -t.height, t.width, t.height);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#793c32';
    ctx.lineWidth = 12;
    for (let x = -t.width; x < t.width; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 28, -28);
      ctx.stroke();
    }
    rounded(ctx, -7, -t.height + 34, 14, 30, 5, '#55372e');
    ctx.fillStyle = '#55372e';
    ctx.beginPath();
    ctx.arc(0, -20, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  /** Desenha a junção tubular e destaca a saída quando ela serve de lançamento. */
  joint(ctx, x, y, angle = 0, launch = false) {
    const image = this.parts[0].canvas;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    const w = launch ? 54 : 30,
      h = launch ? 126 : 108;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-w / 2, -12, w, h, launch ? 25 : 13);
    ctx.clip();
    ctx.drawImage(
      image,
      image.width * 0.48,
      image.height * 0.72,
      image.width * 0.13,
      image.height * 0.26,
      -w / 2,
      -12,
      w,
      h,
    );
    const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
    g.addColorStop(0, 'rgba(29,71,72,.35)');
    g.addColorStop(0.4, 'rgba(255,250,214,.2)');
    g.addColorStop(1, 'rgba(29,71,72,.3)');
    ctx.fillStyle = g;
    ctx.fillRect(-w / 2, -12, w, h);
    ctx.restore();
    if (launch) {
      ctx.fillStyle = '#e9b849';
      ctx.beginPath();
      ctx.ellipse(8, 40, 20, 54, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#355d60';
      ctx.beginPath();
      ctx.ellipse(12, 40, 9, 39, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  /** Descarta canvases transitórios e as referências às camadas preparadas. */
  destroy() {
    for (const c of this.canvases) {
      c.width = 1;
      c.height = 1;
    }
    this.canvases = [];
    this.backgrounds = [];
  }
}
