import { PNG } from 'pngjs';

function parseColor(str) {
  if (!str) return [0, 0, 0, 255];
  str = String(str).trim();
  if (str.startsWith('#')) {
    if (str.length === 4) {
      const r = parseInt(str[1] + str[1], 16);
      const g = parseInt(str[2] + str[2], 16);
      const b = parseInt(str[3] + str[3], 16);
      return [r, g, b, 255];
    }
    const r = parseInt(str.slice(1, 3), 16);
    const g = parseInt(str.slice(3, 5), 16);
    const b = parseInt(str.slice(5, 7), 16);
    return [r, g, b, 255];
  }
  const m = str.match(/rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)/);
  if (m) {
    const r = Math.round(Number(m[1]));
    const g = Math.round(Number(m[2]));
    const b = Math.round(Number(m[3]));
    const a = m[4] !== undefined ? Math.round(Number(m[4]) * 255) : 255;
    return [r, g, b, a];
  }
  return [255, 255, 255, 255];
}

export class SoftwareCanvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.png = new PNG({ width, height });
    this.png.data.fill(0);
    this._stack = [];
    this._tx = 0;
    this._ty = 0;
    this._sx = 1;
    this._sy = 1;
    this.fillStyle = '#ffffff';
    this.strokeStyle = '#000000';
    this.lineWidth = 1;
    this._path = [];
  }

  save() {
    this._stack.push({
      tx: this._tx, ty: this._ty,
      sx: this._sx, sy: this._sy,
      fillStyle: this.fillStyle,
      strokeStyle: this.strokeStyle,
      lineWidth: this.lineWidth
    });
  }

  restore() {
    if (this._stack.length > 0) {
      const s = this._stack.pop();
      this._tx = s.tx; this._ty = s.ty;
      this._sx = s.sx; this._sy = s.sy;
      this.fillStyle = s.fillStyle;
      this.strokeStyle = s.strokeStyle;
      this.lineWidth = s.lineWidth;
    }
  }

  translate(x, y) {
    this._tx += x * this._sx;
    this._ty += y * this._sy;
  }

  scale(sx, sy) {
    this._sx *= sx;
    this._sy *= sy;
  }

  rotate(rad) {
    // Rotation stub - maintains current scale and translation
  }

  setTransform(a, b, c, d, e, f) {
    this._tx = e;
    this._ty = f;
    this._sx = a;
    this._sy = d;
  }

  clearRect(x, y, w, h) {
    const x0 = Math.max(0, Math.floor(this._tx + x * this._sx));
    const y0 = Math.max(0, Math.floor(this._ty + y * this._sy));
    const x1 = Math.min(this.width, Math.ceil(this._tx + (x + w) * this._sx));
    const y1 = Math.min(this.height, Math.ceil(this._ty + (y + h) * this._sy));
    for (let py = y0; py < y1; py++) {
      for (let px = x0; px < x1; px++) {
        const idx = (py * this.width + px) * 4;
        this.png.data[idx] = 0;
        this.png.data[idx + 1] = 0;
        this.png.data[idx + 2] = 0;
        this.png.data[idx + 3] = 0;
      }
    }
  }

  fillRect(x, y, w, h) {
    const [cr, cg, cb, ca] = parseColor(this.fillStyle);
    if (ca === 0) return;
    const x0 = Math.max(0, Math.floor(this._tx + x * this._sx));
    const y0 = Math.max(0, Math.floor(this._ty + y * this._sy));
    const x1 = Math.min(this.width, Math.ceil(this._tx + (x + w) * this._sx));
    const y1 = Math.min(this.height, Math.ceil(this._ty + (y + h) * this._sy));

    const normA = ca / 255;
    for (let py = y0; py < y1; py++) {
      for (let px = x0; px < x1; px++) {
        const idx = (py * this.width + px) * 4;
        if (ca === 255) {
          this.png.data[idx] = cr;
          this.png.data[idx + 1] = cg;
          this.png.data[idx + 2] = cb;
          this.png.data[idx + 3] = 255;
        } else {
          const dstA = this.png.data[idx + 3] / 255;
          const outA = normA + dstA * (1 - normA);
          if (outA > 0) {
            this.png.data[idx] = Math.round((cr * normA + this.png.data[idx] * dstA * (1 - normA)) / outA);
            this.png.data[idx + 1] = Math.round((cg * normA + this.png.data[idx + 1] * dstA * (1 - normA)) / outA);
            this.png.data[idx + 2] = Math.round((cb * normA + this.png.data[idx + 2] * dstA * (1 - normA)) / outA);
            this.png.data[idx + 3] = Math.round(outA * 255);
          }
        }
      }
    }
  }

  strokeRect(x, y, w, h) {
    const lw = Math.max(1, Math.round(this.lineWidth));
    this.fillRect(x, y, w, lw);
    this.fillRect(x, y + h - lw, w, lw);
    this.fillRect(x, y, lw, h);
    this.fillRect(x + w - lw, y, lw, h);
  }

  roundRect(x, y, w, h, radii) {
    // Approximated as rect for hit testing / fill
    this._path = [
      { type: 'rect', x: this._tx + x * this._sx, y: this._ty + y * this._sy, w: w * this._sx, h: h * this._sy }
    ];
  }

  rect(x, y, w, h) {
    this._path.push(
      { type: 'rect', x: this._tx + x * this._sx, y: this._ty + y * this._sy, w: w * this._sx, h: h * this._sy }
    );
  }

  beginPath() {
    this._path = [];
  }

  moveTo(x, y) {
    this._path.push({ type: 'move', x: this._tx + x * this._sx, y: this._ty + y * this._sy });
  }

  lineTo(x, y) {
    this._path.push({ type: 'line', x: this._tx + x * this._sx, y: this._ty + y * this._sy });
  }

  quadraticCurveTo(cpx, cpy, x, y) {
    this._path.push({
      type: 'line',
      x: this._tx + x * this._sx,
      y: this._ty + y * this._sy
    });
  }

  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    this._path.push({
      type: 'line',
      x: this._tx + x * this._sx,
      y: this._ty + y * this._sy
    });
  }

  closePath() {
    this._path.push({ type: 'close' });
  }

  arc(cx, cy, r, sa, ea) {
    this._path.push({
      type: 'circle',
      cx: this._tx + cx * this._sx,
      cy: this._ty + cy * this._sy,
      r: r * Math.abs(this._sx)
    });
  }

  ellipse(cx, cy, rx, ry, rot, sa, ea) {
    this._path.push({
      type: 'ellipse',
      cx: this._tx + cx * this._sx,
      cy: this._ty + cy * this._sy,
      rx: rx * Math.abs(this._sx),
      ry: ry * Math.abs(this._sy),
      rot: rot || 0
    });
  }

  fill() {
    const [cr, cg, cb, ca] = parseColor(this.fillStyle);
    if (ca === 0) return;
    const normA = ca / 255;

    for (const item of this._path) {
      if (item.type === 'rect') {
        const x0 = Math.max(0, Math.floor(item.x));
        const y0 = Math.max(0, Math.floor(item.y));
        const x1 = Math.min(this.width, Math.ceil(item.x + item.w));
        const y1 = Math.min(this.height, Math.ceil(item.y + item.h));
        for (let py = y0; py < y1; py++) {
          for (let px = x0; px < x1; px++) {
            const idx = (py * this.width + px) * 4;
            this._blendPixel(idx, cr, cg, cb, normA);
          }
        }
      } else if (item.type === 'circle') {
        const x0 = Math.max(0, Math.floor(item.cx - item.r));
        const y0 = Math.max(0, Math.floor(item.cy - item.r));
        const x1 = Math.min(this.width, Math.ceil(item.cx + item.r));
        const y1 = Math.min(this.height, Math.ceil(item.cy + item.r));
        const r2 = item.r * item.r;
        for (let py = y0; py < y1; py++) {
          for (let px = x0; px < x1; px++) {
            const dx = px - item.cx;
            const dy = py - item.cy;
            if (dx * dx + dy * dy <= r2) {
              const idx = (py * this.width + px) * 4;
              this._blendPixel(idx, cr, cg, cb, normA);
            }
          }
        }
      } else if (item.type === 'ellipse') {
        const maxR = Math.max(item.rx, item.ry);
        const x0 = Math.max(0, Math.floor(item.cx - maxR));
        const y0 = Math.max(0, Math.floor(item.cy - maxR));
        const x1 = Math.min(this.width, Math.ceil(item.cx + maxR));
        const y1 = Math.min(this.height, Math.ceil(item.cy + maxR));
        const cos = Math.cos(-item.rot);
        const sin = Math.sin(-item.rot);
        for (let py = y0; py < y1; py++) {
          for (let px = x0; px < x1; px++) {
            const dx = px - item.cx;
            const dy = py - item.cy;
            const rx = dx * cos - dy * sin;
            const ry = dx * sin + dy * cos;
            if ((rx * rx) / (item.rx * item.rx) + (ry * ry) / (item.ry * item.ry) <= 1.0) {
              const idx = (py * this.width + px) * 4;
              this._blendPixel(idx, cr, cg, cb, normA);
            }
          }
        }
      }
    }
  }

  stroke() {
    const [cr, cg, cb, ca] = parseColor(this.strokeStyle);
    if (ca === 0) return;
    const normA = ca / 255;
    const lw = Math.max(1, Math.round(this.lineWidth * Math.abs(this._sx)));

    // Line segments
    let lastX = 0, lastY = 0;
    for (const item of this._path) {
      if (item.type === 'move') {
        lastX = item.x; lastY = item.y;
      } else if (item.type === 'line') {
        this._drawLine(lastX, lastY, item.x, item.y, cr, cg, cb, normA, lw);
        lastX = item.x; lastY = item.y;
      }
    }
  }

  _drawLine(x0, y0, x1, y1, r, g, b, normA, lw) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.ceil(dist * 2);
    const halfLw = lw / 2;
    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 0 : i / steps;
      const cx = x0 + (x1 - x0) * t;
      const cy = y0 + (y1 - y0) * t;
      const px0 = Math.max(0, Math.floor(cx - halfLw));
      const py0 = Math.max(0, Math.floor(cy - halfLw));
      const px1 = Math.min(this.width, Math.ceil(cx + halfLw));
      const py1 = Math.min(this.height, Math.ceil(cy + halfLw));
      for (let py = py0; py < py1; py++) {
        for (let px = px0; px < px1; px++) {
          const idx = (py * this.width + px) * 4;
          this._blendPixel(idx, r, g, b, normA);
        }
      }
    }
  }

  _blendPixel(idx, cr, cg, cb, normA) {
    if (normA >= 1) {
      this.png.data[idx] = cr;
      this.png.data[idx + 1] = cg;
      this.png.data[idx + 2] = cb;
      this.png.data[idx + 3] = 255;
    } else {
      const dstA = this.png.data[idx + 3] / 255;
      const outA = normA + dstA * (1 - normA);
      if (outA > 0) {
        this.png.data[idx] = Math.round((cr * normA + this.png.data[idx] * dstA * (1 - normA)) / outA);
        this.png.data[idx + 1] = Math.round((cg * normA + this.png.data[idx + 1] * dstA * (1 - normA)) / outA);
        this.png.data[idx + 2] = Math.round((cb * normA + this.png.data[idx + 2] * dstA * (1 - normA)) / outA);
        this.png.data[idx + 3] = Math.round(outA * 255);
      }
    }
  }

  drawImage(img, ...args) {
    if (!img) return;
    let sx = 0, sy = 0, sw = img.width, sh = img.height;
    let dx = 0, dy = 0, dw = img.width, dh = img.height;
    if (args.length === 2) {
      [dx, dy] = args;
    } else if (args.length === 4) {
      [dx, dy, dw, dh] = args;
    } else if (args.length === 8) {
      [sx, sy, sw, sh, dx, dy, dw, dh] = args;
    }

    const targetX = this._tx + dx * this._sx;
    const targetY = this._ty + dy * this._sy;
    const targetW = dw * this._sx;
    const targetH = dh * this._sy;

    const x0 = Math.max(0, Math.floor(targetX));
    const y0 = Math.max(0, Math.floor(targetY));
    const x1 = Math.min(this.width, Math.ceil(targetX + targetW));
    const y1 = Math.min(this.height, Math.ceil(targetY + targetH));

    for (let py = y0; py < y1; py++) {
      const srcY = sy + Math.floor(((py - targetY) / targetH) * sh);
      if (srcY < 0 || srcY >= img.height) continue;
      for (let px = x0; px < x1; px++) {
        const srcX = sx + Math.floor(((px - targetX) / targetW) * sw);
        if (srcX < 0 || srcX >= img.width) continue;
        const sIdx = (srcY * img.width + srcX) * 4;
        const sa = img.data[sIdx + 3];
        if (sa <= 10) continue;
        const dIdx = (py * this.width + px) * 4;
        const normA = sa / 255;
        this._blendPixel(dIdx, img.data[sIdx], img.data[sIdx + 1], img.data[sIdx + 2], normA);
      }
    }
  }

  fillText(text, x, y) {
    // Fill text stub for visual labeling
  }

  clip() {}

  createLinearGradient() {
    return { addColorStop() {} };
  }

  createRadialGradient() {
    return { addColorStop() {} };
  }

  getImageData(x, y, w, h) {
    const data = new Uint8ClampedArray(w * h * 4);
    for (let py = 0; py < h; py++) {
      const srcY = y + py;
      if (srcY < 0 || srcY >= this.height) continue;
      for (let px = 0; px < w; px++) {
        const srcX = x + px;
        if (srcX < 0 || srcX >= this.width) continue;
        const sIdx = (srcY * this.width + srcX) * 4;
        const dIdx = (py * w + px) * 4;
        data[dIdx] = this.png.data[sIdx];
        data[dIdx + 1] = this.png.data[sIdx + 1];
        data[dIdx + 2] = this.png.data[sIdx + 2];
        data[dIdx + 3] = this.png.data[sIdx + 3];
      }
    }
    return { data };
  }
}
