/**
 * scripts/generate-dream-girl-sprites.js
 * Generates the complete "Dream Girl (menina)" sprite sheets and individual frames
 * matching the concept art with high visual fidelity:
 * - IDLE (8 frames)
 * - RUNNING (8 frames)
 * - JUMPING (6 frames) + SHORT JUMP (2 frames) + HIGH JUMP (1 frame)
 * - FALLING (6 frames)
 * - SPECIAL ACTIONS (Interacting, Pushing, Climbing, Dashing)
 * - STATES & EFFECTS (Taking Damage, Collecting, Teleporting)
 * - EXPRESSIONS (12 facial expressions)
 */

import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

// Drawing primitives for PNG buffer
class PixelCanvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.png = new PNG({ width, height });
    // Fill transparent by default
    this.png.data.fill(0);
  }

  setPixel(x, y, r, g, b, a = 255) {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || x >= this.width || y < 0 || y >= this.height || a <= 0) return;
    const idx = (y * this.width + x) * 4;
    if (a >= 255 || this.png.data[idx + 3] === 0) {
      this.png.data[idx] = r;
      this.png.data[idx + 1] = g;
      this.png.data[idx + 2] = b;
      this.png.data[idx + 3] = a;
    } else {
      // Alpha blend
      const sa = a / 255;
      const da = this.png.data[idx + 3] / 255;
      const outA = sa + da * (1 - sa);
      this.png.data[idx] = Math.round((r * sa + this.png.data[idx] * da * (1 - sa)) / outA);
      this.png.data[idx + 1] = Math.round((g * sa + this.png.data[idx + 1] * da * (1 - sa)) / outA);
      this.png.data[idx + 2] = Math.round((b * sa + this.png.data[idx + 2] * da * (1 - sa)) / outA);
      this.png.data[idx + 3] = Math.round(outA * 255);
    }
  }

  fillCircle(cx, cy, radius, r, g, b, a = 255) {
    this.fillEllipse(cx, cy, radius, radius, r, g, b, a);
  }

  fillEllipse(cx, cy, rx, ry, r, g, b, a = 255) {
    const minX = Math.max(0, Math.floor(cx - rx - 1));
    const maxX = Math.min(this.width - 1, Math.ceil(cx + rx + 1));
    const minY = Math.max(0, Math.floor(cy - ry - 1));
    const maxY = Math.min(this.height - 1, Math.ceil(cy + ry + 1));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        const distSq = dx * dx + dy * dy;
        if (distSq <= 1.0) {
          // Anti-aliasing edge
          const edge = Math.sqrt(distSq);
          const alpha = edge > 0.85 ? Math.max(0, Math.min(1, (1.0 - edge) / 0.15)) * a : a;
          this.setPixel(x, y, r, g, b, Math.round(alpha));
        }
      }
    }
  }

  strokeEllipse(cx, cy, rx, ry, width, r, g, b, a = 255) {
    const minX = Math.max(0, Math.floor(cx - rx - width - 1));
    const maxX = Math.min(this.width - 1, Math.ceil(cx + rx + width + 1));
    const minY = Math.max(0, Math.floor(cy - ry - width - 1));
    const maxY = Math.min(this.height - 1, Math.ceil(cy + ry + width + 1));

    const innerRx = Math.max(0.1, rx - width);
    const innerRy = Math.max(0.1, ry - width);

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const dxOut = (x - cx) / rx;
        const dyOut = (y - cy) / ry;
        const dOut = dxOut * dxOut + dyOut * dyOut;

        const dxIn = (x - cx) / innerRx;
        const dyIn = (y - cy) / innerRy;
        const dIn = dxIn * dxIn + dyIn * dyIn;

        if (dOut <= 1.05 && dIn >= 0.95) {
          this.setPixel(x, y, r, g, b, a);
        }
      }
    }
  }

  fillRect(x, y, w, h, r, g, b, a = 255) {
    const minX = Math.max(0, Math.floor(x));
    const maxX = Math.min(this.width - 1, Math.floor(x + w));
    const minY = Math.max(0, Math.floor(y));
    const maxY = Math.min(this.height - 1, Math.floor(y + h));
    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        this.setPixel(px, py, r, g, b, a);
      }
    }
  }

  fillRoundRect(x, y, w, h, radius, r, g, b, a = 255) {
    for (let py = Math.floor(y); py <= Math.floor(y + h); py++) {
      for (let px = Math.floor(x); px <= Math.floor(x + w); px++) {
        let inside = true;
        if (px < x + radius && py < y + radius) {
          inside = Math.hypot(px - (x + radius), py - (y + radius)) <= radius;
        } else if (px > x + w - radius && py < y + radius) {
          inside = Math.hypot(px - (x + w - radius), py - (y + radius)) <= radius;
        } else if (px < x + radius && py > y + h - radius) {
          inside = Math.hypot(px - (x + radius), py - (y + h - radius)) <= radius;
        } else if (px > x + w - radius && py > y + h - radius) {
          inside = Math.hypot(px - (x + w - radius), py - (y + h - radius)) <= radius;
        }
        if (inside) this.setPixel(px, py, r, g, b, a);
      }
    }
  }

  drawLine(x0, y0, x1, y1, width, r, g, b, a = 255) {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.ceil(dist * 2);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      this.fillCircle(x, y, width / 2, r, g, b, a);
    }
  }

  blit(other, dx, dy) {
    for (let y = 0; y < other.height; y++) {
      for (let x = 0; x < other.width; x++) {
        const idx = (y * other.width + x) * 4;
        const a = other.png.data[idx + 3];
        if (a > 0) {
          this.setPixel(dx + x, dy + y, other.png.data[idx], other.png.data[idx + 1], other.png.data[idx + 2], a);
        }
      }
    }
  }

  save(filePath) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, PNG.sync.write(this.png));
  }
}

// Color palette constants for Dream Girl
const PALETTE = {
  // Hair
  hairDark: [45, 22, 14],
  hairBase: [75, 38, 25],
  hairHighlight: [115, 62, 42],
  hairShine: [155, 95, 70],
  // Ribbon
  ribbonBase: [195, 28, 38],
  ribbonDark: [140, 16, 25],
  ribbonLight: [235, 65, 75],
  // Skin
  skinBase: [253, 230, 212],
  skinShadow: [232, 188, 160],
  skinHighlight: [255, 245, 238],
  blush: [244, 114, 133],
  // Eyes
  eyeDark: [35, 18, 12],
  eyeIris: [75, 42, 28],
  eyeHighlight: [255, 255, 255],
  // Dress
  dressBase: [250, 246, 238],
  dressShadow: [215, 205, 190],
  dressRuffle: [255, 255, 255],
  dressTrim: [195, 28, 38], // Red piping
  // Socks & Shoes
  sockBase: [255, 255, 255],
  sockShadow: [205, 215, 225],
  shoeBase: [120, 24, 30],
  shoeDark: [75, 12, 18],
  shoeHighlight: [170, 45, 52],
  buckle: [255, 208, 0], // Gold Mary Jane buckle #ffd000
};

/**
 * Draws a high-fidelity Dream Girl sprite frame.
 * Coordinates are relative to frame width 64, height 64.
 * The feet bottom contacts platform surface at y = 58.
 */
function drawDreamGirlFrame(options = {}) {
  const {
    pose = 'idle',
    frameIndex = 0,
    width = 64,
    height = 64,
    facing = 1,
    expression = 'happy',
    blink = false,
  } = options;

  const canvas = new PixelCanvas(width, height);
  const cx = width / 2; // 32
  const groundY = 58;

  // Animation parameter variations based on pose & frame
  let bobY = 0;
  let legLeftAngle = 0;
  let legRightAngle = 0;
  let armLeftAngle = 0;
  let armRightAngle = 0;
  let ponytailAngle = 0;
  let bodyLean = 0;
  let headTilt = 0;
  let eyesClosed = blink;
  let mouthType = 'smile';
  let dressSway = 0;
  let isCrouch = false;
  let isAir = false;
  let showVortex = false;
  let showDamageEffect = false;
  let showDashTrails = false;
  let handsUp = false;
  let ladderBackView = false;
  let pushingBox = false;

  switch (pose) {
    case 'idle': {
      // 8 frames
      const cycle = frameIndex / 8;
      bobY = Math.sin(cycle * Math.PI * 2) * 1.5;
      ponytailAngle = Math.sin(cycle * Math.PI * 2) * 0.12;
      dressSway = Math.sin(cycle * Math.PI * 2) * 0.8;
      if (frameIndex === 4) eyesClosed = true;
      if (frameIndex === 6) {
        // Soft hand to cheek
        armRightAngle = -1.2;
        headTilt = 0.08;
      }
      break;
    }
    case 'run': {
      // 8 frames run cycle
      const cycle = frameIndex / 8;
      const t = cycle * Math.PI * 2;
      bobY = Math.abs(Math.sin(t)) * 2.5;
      legLeftAngle = Math.sin(t) * 0.75;
      legRightAngle = -Math.sin(t) * 0.75;
      armLeftAngle = -Math.sin(t) * 0.85;
      armRightAngle = Math.sin(t) * 0.85;
      ponytailAngle = -0.45 + Math.sin(t * 2) * 0.18; // streaming behind
      bodyLean = 0.12;
      dressSway = Math.sin(t) * 2.2;
      break;
    }
    case 'jump': {
      isAir = true;
      if (frameIndex === 0) {
        // Crouch windup
        isCrouch = true;
        bobY = 5;
        legLeftAngle = 0.6;
        legRightAngle = 0.6;
        armLeftAngle = -0.4;
        armRightAngle = -0.4;
        ponytailAngle = 0.1;
      } else if (frameIndex === 1) {
        // Launch spring
        bobY = -2;
        legLeftAngle = -0.3;
        legRightAngle = 0.2;
        armLeftAngle = 0.8;
        armRightAngle = 0.8;
        ponytailAngle = 0.35;
      } else if (frameIndex === 2 || frameIndex === 3) {
        // Apex / floating reach
        bobY = -5;
        legLeftAngle = 0.3;
        legRightAngle = -0.3;
        armLeftAngle = 1.2;
        armRightAngle = 1.3;
        handsUp = true;
        ponytailAngle = 0.2;
        dressSway = 1.5;
      } else if (frameIndex === 4) {
        // Descent
        bobY = -2;
        legLeftAngle = 0.4;
        legRightAngle = 0.2;
        armLeftAngle = 0.6;
        armRightAngle = 0.7;
        ponytailAngle = -0.2;
      } else {
        // Landing touch
        bobY = 3;
        legLeftAngle = 0.5;
        legRightAngle = 0.5;
        armLeftAngle = 0.2;
        armRightAngle = 0.2;
      }
      break;
    }
    case 'jump_short': {
      isAir = true;
      bobY = frameIndex === 0 ? 3 : -3;
      legLeftAngle = 0.3;
      legRightAngle = -0.2;
      armLeftAngle = 0.6;
      armRightAngle = 0.7;
      ponytailAngle = 0.15;
      break;
    }
    case 'high_jump': {
      isAir = true;
      bobY = -6;
      handsUp = true;
      armLeftAngle = 1.5;
      armRightAngle = 1.6;
      legLeftAngle = 0.5;
      legRightAngle = -0.4;
      ponytailAngle = 0.4;
      dressSway = 3.0;
      break;
    }
    case 'fall': {
      isAir = true;
      const f = frameIndex % 6;
      bobY = f < 5 ? -1 + f * 0.8 : 4;
      if (f === 2 || f === 3) {
        // Surprised flailing / alarmed
        mouthType = 'open_gasp';
        armLeftAngle = 1.1;
        armRightAngle = 1.1;
        ponytailAngle = -0.3;
      } else if (f === 5) {
        // Impact crouch
        isCrouch = true;
        bobY = 5;
        legLeftAngle = 0.7;
        legRightAngle = 0.7;
      } else {
        armLeftAngle = 0.8;
        armRightAngle = 0.5;
        ponytailAngle = -0.25;
      }
      break;
    }
    case 'push': {
      pushingBox = true;
      bodyLean = 0.28;
      bobY = 1;
      armLeftAngle = 0.9;
      armRightAngle = 1.0;
      legLeftAngle = -0.4 + (frameIndex % 3) * 0.3;
      legRightAngle = 0.4 - (frameIndex % 3) * 0.3;
      ponytailAngle = -0.2;
      break;
    }
    case 'climb': {
      ladderBackView = true;
      legLeftAngle = 0.4;
      legRightAngle = -0.4;
      armLeftAngle = 1.4;
      armRightAngle = 1.2;
      break;
    }
    case 'dash': {
      showDashTrails = true;
      bodyLean = 0.32;
      bobY = 1;
      armLeftAngle = -0.8;
      armRightAngle = 0.9;
      legLeftAngle = 0.8;
      legRightAngle = -0.7;
      ponytailAngle = -0.6;
      break;
    }
    case 'damage': {
      showDamageEffect = true;
      bodyLean = -0.25;
      eyesClosed = true;
      mouthType = 'hurt';
      armLeftAngle = -0.6;
      armRightAngle = 0.5;
      legLeftAngle = -0.4;
      legRightAngle = 0.3;
      ponytailAngle = 0.35;
      break;
    }
    case 'collect': {
      handsUp = true;
      armLeftAngle = 1.4;
      armRightAngle = 1.4;
      mouthType = 'happy_open';
      bobY = -2;
      ponytailAngle = 0.15;
      break;
    }
    case 'teleport': {
      showVortex = true;
      bobY = frameIndex === 0 ? 0 : -8;
      ponytailAngle = 0.5;
      armLeftAngle = 1.1;
      armRightAngle = 0.9;
      break;
    }
    case 'interact': {
      bodyLean = 0.15;
      bobY = 3;
      armLeftAngle = 0.5;
      armRightAngle = 0.7;
      headTilt = 0.15;
      break;
    }
  }

  // Draw background effect (Dash trails or Vortex)
  if (showDashTrails) {
    for (let i = 1; i <= 3; i++) {
      const trailX = cx - i * 8;
      canvas.fillRoundRect(trailX - 6, groundY - 32 + bobY, 12, 18, 4, 255, 230, 200, 70 / i);
      canvas.drawLine(trailX - 10, groundY - 20 + bobY, trailX + 4, groundY - 20 + bobY, 2, 255, 255, 255, 100 / i);
    }
  }

  if (showVortex) {
    const vortexColor = [56, 189, 248]; // Cyan/blue mystical vortex
    for (let r = 26; r >= 6; r -= 4) {
      canvas.strokeEllipse(cx, groundY - 24, r, r * 1.3, 2, ...vortexColor, 120);
    }
    canvas.fillCircle(cx, groundY - 24, 6, 255, 255, 255, 180);
  }

  // Center coordinates of the girl
  const girlY = groundY - 22 + bobY + (isCrouch ? 6 : 0);
  const headY = girlY - 14;

  // 1. Ponytail (Behind head)
  const ponyBaseX = cx - 7 + Math.sin(bodyLean) * 4;
  const ponyBaseY = headY - 4;
  const pAngle = ponytailAngle + bodyLean;

  // Ribbon bow
  canvas.fillCircle(ponyBaseX, ponyBaseY, 3.5, ...PALETTE.ribbonBase);
  canvas.strokeEllipse(ponyBaseX - 2, ponyBaseY - 2, 3, 2, 1, ...PALETTE.ribbonLight);
  canvas.strokeEllipse(ponyBaseX + 2, ponyBaseY - 2, 3, 2, 1, ...PALETTE.ribbonLight);

  // Ponytail strands
  const ponyLength = 16;
  const ponyTipX = ponyBaseX - Math.cos(pAngle) * ponyLength;
  const ponyTipY = ponyBaseY - Math.sin(pAngle) * ponyLength + 6;

  canvas.fillCircle(ponyBaseX - 3, ponyBaseY + 2, 4.5, ...PALETTE.hairBase);
  canvas.fillEllipse(ponyBaseX - 7, ponyBaseY + 5, 5.5, 4.5, ...PALETTE.hairBase);
  canvas.fillEllipse(ponyTipX, ponyTipY, 4.0, 3.0, ...PALETTE.hairHighlight);
  canvas.drawLine(ponyBaseX, ponyBaseY, ponyTipX, ponyTipY, 5, ...PALETTE.hairBase);

  // 2. Legs & Shoes
  const legLen = isCrouch ? 6 : 10;
  const leftLegX = cx - 4 + Math.sin(bodyLean) * 2;
  const rightLegX = cx + 4 + Math.sin(bodyLean) * 2;
  const legStartY = girlY + 8;

  // Left Leg (Back)
  const leftFootX = leftLegX + Math.sin(legLeftAngle) * legLen;
  const leftFootY = legStartY + Math.cos(legLeftAngle) * legLen;
  canvas.drawLine(leftLegX, legStartY, leftFootX, leftFootY, 3.8, ...PALETTE.skinBase);
  // White sock
  canvas.fillEllipse(leftFootX, leftFootY - 2, 3.0, 2.5, ...PALETTE.sockBase);
  // Mary Jane shoe
  canvas.fillEllipse(leftFootX + 1, leftFootY + 1, 4.5, 3.0, ...PALETTE.shoeBase);
  canvas.strokeEllipse(leftFootX + 1, leftFootY + 1, 4.5, 3.0, 0.8, ...PALETTE.shoeDark);
  // Buckle (Gold #ffd000)
  canvas.fillCircle(leftFootX, leftFootY, 1.2, ...PALETTE.buckle);

  // Right Leg (Front)
  const rightFootX = rightLegX + Math.sin(legRightAngle) * legLen;
  const rightFootY = legStartY + Math.cos(legRightAngle) * legLen;
  canvas.drawLine(rightLegX, legStartY, rightFootX, rightFootY, 3.8, ...PALETTE.skinBase);
  // White sock
  canvas.fillEllipse(rightFootX, rightFootY - 2, 3.0, 2.5, ...PALETTE.sockBase);
  // Mary Jane shoe
  canvas.fillEllipse(rightFootX + 1, rightFootY + 1, 4.5, 3.0, ...PALETTE.shoeBase);
  canvas.strokeEllipse(rightFootX + 1, rightFootY + 1, 4.5, 3.0, 0.8, ...PALETTE.shoeDark);
  // Buckle (Gold #ffd000)
  canvas.fillCircle(rightFootX, rightFootY, 1.2, ...PALETTE.buckle);

  // 3. Dress / Tunic (Cream vintage puff-sleeve dress with ruffled hem & red ribbon)
  const dressTopY = girlY - 3;
  const dressBotY = girlY + 9;
  const dressWidth = 14 + (isCrouch ? 3 : 0);

  // Skirt body
  canvas.fillRoundRect(cx - dressWidth / 2 + dressSway * 0.3, dressTopY, dressWidth, 12, 4, ...PALETTE.dressBase);
  canvas.fillEllipse(cx + dressSway * 0.5, dressBotY, dressWidth / 2 + 1, 3.5, ...PALETTE.dressShadow);
  canvas.fillEllipse(cx + dressSway * 0.5, dressBotY - 1, dressWidth / 2, 3.0, ...PALETTE.dressBase);

  // Ruffled hem (delicate scallops)
  for (let s = -dressWidth / 2; s <= dressWidth / 2; s += 3.5) {
    canvas.fillCircle(cx + s + dressSway * 0.5, dressBotY + 1, 2.0, ...PALETTE.dressRuffle);
  }

  // Red waist ribbon & bow
  canvas.fillRoundRect(cx - dressWidth / 2 + 1, dressTopY + 4, dressWidth - 2, 2.2, 1, ...PALETTE.dressTrim);
  canvas.fillCircle(cx, dressTopY + 5, 1.8, ...PALETTE.ribbonLight);

  // Bodice and neckline ruffle
  canvas.fillRoundRect(cx - 5.5, dressTopY - 4, 11, 7, 2, ...PALETTE.dressBase);
  canvas.fillCircle(cx, dressTopY - 3, 2.5, ...PALETTE.dressRuffle);

  // 4. Arms
  const armLen = 8;
  const shoulderY = dressTopY - 2;

  // Left Arm (Back)
  const leftArmX = cx - 6;
  const leftHandX = leftArmX + Math.sin(armLeftAngle) * armLen;
  const leftHandY = shoulderY + Math.cos(armLeftAngle) * armLen;
  // Puffed sleeve
  canvas.fillCircle(leftArmX, shoulderY, 3.2, ...PALETTE.dressBase);
  canvas.drawLine(leftArmX, shoulderY, leftHandX, leftHandY, 2.8, ...PALETTE.skinBase);
  canvas.fillCircle(leftHandX, leftHandY, 1.8, ...PALETTE.skinBase);

  // Right Arm (Front)
  const rightArmX = cx + 6;
  const rightHandX = rightArmX + Math.sin(armRightAngle) * armLen;
  const rightHandY = shoulderY + Math.cos(armRightAngle) * armLen;
  // Puffed sleeve
  canvas.fillCircle(rightArmX, shoulderY, 3.2, ...PALETTE.dressBase);
  canvas.drawLine(rightArmX, shoulderY, rightHandX, rightHandY, 2.8, ...PALETTE.skinBase);
  canvas.fillCircle(rightHandX, rightHandY, 1.8, ...PALETTE.skinBase);

  // 5. Head & Face
  const headRadius = 9.5;
  const headCenterX = cx + Math.sin(bodyLean) * 2;
  const headCenterY = headY;

  // Head base (Skin)
  canvas.fillCircle(headCenterX, headCenterY, headRadius, ...PALETTE.skinBase);
  canvas.fillCircle(headCenterX, headCenterY + 1, headRadius - 0.5, ...PALETTE.skinHighlight);

  if (ladderBackView) {
    // Back of head (Brown hair covers everything)
    canvas.fillCircle(headCenterX, headCenterY, headRadius, ...PALETTE.hairBase);
    canvas.fillCircle(headCenterX - 2, headCenterY - 3, headRadius - 2, ...PALETTE.hairHighlight);
  } else {
    // Cheeks blush
    canvas.fillCircle(headCenterX - 4.5, headCenterY + 2.5, 2.5, ...PALETTE.blush, 180);
    canvas.fillCircle(headCenterX + 4.5, headCenterY + 2.5, 2.5, ...PALETTE.blush, 180);

    // Eyes
    if (eyesClosed) {
      // Gentle closed happy arc or blinking line
      canvas.drawLine(headCenterX - 6, headCenterY - 1, headCenterX - 2, headCenterY - 1, 1.4, ...PALETTE.eyeDark);
      canvas.drawLine(headCenterX + 2, headCenterY - 1, headCenterX + 6, headCenterY - 1, 1.4, ...PALETTE.eyeDark);
    } else {
      // Big expressive anime eyes
      // Left eye
      canvas.fillEllipse(headCenterX - 4.2, headCenterY - 1.2, 2.2, 3.2, ...PALETTE.eyeDark);
      canvas.fillCircle(headCenterX - 4.2, headCenterY - 0.8, 1.5, ...PALETTE.eyeIris);
      canvas.fillCircle(headCenterX - 4.8, headCenterY - 2.2, 0.9, ...PALETTE.eyeHighlight);
      // Right eye
      canvas.fillEllipse(headCenterX + 4.2, headCenterY - 1.2, 2.2, 3.2, ...PALETTE.eyeDark);
      canvas.fillCircle(headCenterX + 4.2, headCenterY - 0.8, 1.5, ...PALETTE.eyeIris);
      canvas.fillCircle(headCenterX + 3.6, headCenterY - 2.2, 0.9, ...PALETTE.eyeHighlight);
    }

    // Mouth
    if (mouthType === 'open_gasp') {
      canvas.fillCircle(headCenterX, headCenterY + 4.0, 1.8, 150, 20, 30);
    } else if (mouthType === 'happy_open') {
      canvas.fillEllipse(headCenterX, headCenterY + 3.8, 2.0, 1.6, 180, 30, 45);
    } else if (mouthType === 'hurt') {
      canvas.drawLine(headCenterX - 2, headCenterY + 4, headCenterX + 2, headCenterY + 4, 1.2, 140, 20, 30);
    } else {
      // Sweet smile
      canvas.strokeEllipse(headCenterX, headCenterY + 3.2, 2.2, 1.5, 1.0, 180, 40, 50);
    }

    // Hair: Bangs and front strands
    canvas.fillEllipse(headCenterX, headCenterY - 6.5, headRadius + 0.5, 4.5, ...PALETTE.hairBase);
    canvas.fillCircle(headCenterX - 3, headCenterY - 6, 4.0, ...PALETTE.hairHighlight);
    // Soft bangs framing forehead
    canvas.fillCircle(headCenterX - 5, headCenterY - 4.5, 3.0, ...PALETTE.hairBase);
    canvas.fillCircle(headCenterX, headCenterY - 5.5, 3.2, ...PALETTE.hairBase);
    canvas.fillCircle(headCenterX + 5, headCenterY - 4.5, 3.0, ...PALETTE.hairBase);
    // Hair highlight sheen
    canvas.drawLine(headCenterX - 4, headCenterY - 7.5, headCenterX + 4, headCenterY - 7.5, 1.5, ...PALETTE.hairShine);
  }

  // Damage effect spark
  if (showDamageEffect) {
    canvas.strokeEllipse(headCenterX + 7, headCenterY - 4, 4, 4, 1.5, 255, 200, 50);
    canvas.drawLine(headCenterX + 8, headCenterY - 8, headCenterX + 12, headCenterY - 12, 1.5, 255, 240, 100);
  }

  return canvas;
}

/**
 * Builds all sprite files and sheets.
 */
function buildAllSprites() {
  console.log('Building Dream Girl sprite sheets and individual assets...');

  const spritesDir = 'assets/art/dark-room/sprites';
  fs.mkdirSync(spritesDir, { recursive: true });

  // 1. IDLE SHEET (8 frames) - 512 x 64
  const idleSheet = new PixelCanvas(512, 64);
  for (let i = 0; i < 8; i++) {
    const f = drawDreamGirlFrame({ pose: 'idle', frameIndex: i });
    idleSheet.blit(f, i * 64, 0);
  }
  idleSheet.save(path.join(spritesDir, 'dream_girl_idle.png'));
  // Save frame 0 as character_stand.png (canonical stand frame)
  drawDreamGirlFrame({ pose: 'idle', frameIndex: 0 }).save(path.join(spritesDir, 'character_stand.png'));

  // 2. RUNNING SHEET (8 frames) - 512 x 64
  const runSheet = new PixelCanvas(512, 64);
  for (let i = 0; i < 8; i++) {
    const f = drawDreamGirlFrame({ pose: 'run', frameIndex: i });
    runSheet.blit(f, i * 64, 0);
  }
  runSheet.save(path.join(spritesDir, 'dream_girl_run.png'));
  // Save as character_run.png
  runSheet.save(path.join(spritesDir, 'character_run.png'));

  // 3. JUMPING SHEET (6 frames jump + 2 frames short jump + 1 frame high jump) - 576 x 64
  const jumpSheet = new PixelCanvas(576, 64);
  for (let i = 0; i < 6; i++) {
    const f = drawDreamGirlFrame({ pose: 'jump', frameIndex: i });
    jumpSheet.blit(f, i * 64, 0);
  }
  for (let i = 0; i < 2; i++) {
    const f = drawDreamGirlFrame({ pose: 'jump_short', frameIndex: i });
    jumpSheet.blit(f, (6 + i) * 64, 0);
  }
  const highJumpFrame = drawDreamGirlFrame({ pose: 'high_jump', frameIndex: 0 });
  jumpSheet.blit(highJumpFrame, 8 * 64, 0);
  jumpSheet.save(path.join(spritesDir, 'dream_girl_jump.png'));
  // Save jump apex as character_jump.png
  drawDreamGirlFrame({ pose: 'jump', frameIndex: 2 }).save(path.join(spritesDir, 'character_jump.png'));

  // 4. FALLING SHEET (6 frames) - 384 x 64
  const fallSheet = new PixelCanvas(384, 64);
  for (let i = 0; i < 6; i++) {
    const f = drawDreamGirlFrame({ pose: 'fall', frameIndex: i });
    fallSheet.blit(f, i * 64, 0);
  }
  fallSheet.save(path.join(spritesDir, 'dream_girl_fall.png'));

  // 5. SPECIAL ACTIONS & STATES (Interacting 2f, Pushing 3f, Climbing 1f, Dashing 1f, Damage 1f, Collect 1f, Teleport 2f) - 704 x 64
  const actionSheet = new PixelCanvas(704, 64);
  let ax = 0;
  // Interact (2 frames)
  for (let i = 0; i < 2; i++) {
    actionSheet.blit(drawDreamGirlFrame({ pose: 'interact', frameIndex: i }), ax, 0);
    ax += 64;
  }
  // Push (3 frames)
  for (let i = 0; i < 3; i++) {
    actionSheet.blit(drawDreamGirlFrame({ pose: 'push', frameIndex: i }), ax, 0);
    ax += 64;
  }
  // Climb (1 frame)
  actionSheet.blit(drawDreamGirlFrame({ pose: 'climb', frameIndex: 0 }), ax, 0); ax += 64;
  // Dash (1 frame)
  actionSheet.blit(drawDreamGirlFrame({ pose: 'dash', frameIndex: 0 }), ax, 0); ax += 64;
  // Damage (1 frame)
  actionSheet.blit(drawDreamGirlFrame({ pose: 'damage', frameIndex: 0 }), ax, 0); ax += 64;
  // Collect (1 frame)
  actionSheet.blit(drawDreamGirlFrame({ pose: 'collect', frameIndex: 0 }), ax, 0); ax += 64;
  // Teleport (2 frames)
  for (let i = 0; i < 2; i++) {
    actionSheet.blit(drawDreamGirlFrame({ pose: 'teleport', frameIndex: i }), ax, 0);
    ax += 64;
  }
  actionSheet.save(path.join(spritesDir, 'dream_girl_actions.png'));

  // 6. MASTER SPRITESHEET (All in one grid) - 512 x 384 (6 rows of 8 columns)
  const masterSheet = new PixelCanvas(512, 384);
  // Row 0: Idle 8 frames
  for (let i = 0; i < 8; i++) masterSheet.blit(drawDreamGirlFrame({ pose: 'idle', frameIndex: i }), i * 64, 0);
  // Row 1: Run 8 frames
  for (let i = 0; i < 8; i++) masterSheet.blit(drawDreamGirlFrame({ pose: 'run', frameIndex: i }), i * 64, 64);
  // Row 2: Jump (6 frames) + Short jump (2 frames)
  for (let i = 0; i < 6; i++) masterSheet.blit(drawDreamGirlFrame({ pose: 'jump', frameIndex: i }), i * 64, 128);
  for (let i = 0; i < 2; i++) masterSheet.blit(drawDreamGirlFrame({ pose: 'jump_short', frameIndex: i }), (6 + i) * 64, 128);
  // Row 3: High jump (1 frame) + Fall (6 frames) + Collect (1 frame)
  masterSheet.blit(drawDreamGirlFrame({ pose: 'high_jump', frameIndex: 0 }), 0, 192);
  for (let i = 0; i < 6; i++) masterSheet.blit(drawDreamGirlFrame({ pose: 'fall', frameIndex: i }), (1 + i) * 64, 192);
  masterSheet.blit(drawDreamGirlFrame({ pose: 'collect', frameIndex: 0 }), 7 * 64, 192);
  // Row 4: Special actions: Interact (2), Push (3), Climb (1), Dash (1), Damage (1)
  masterSheet.blit(drawDreamGirlFrame({ pose: 'interact', frameIndex: 0 }), 0 * 64, 256);
  masterSheet.blit(drawDreamGirlFrame({ pose: 'interact', frameIndex: 1 }), 1 * 64, 256);
  masterSheet.blit(drawDreamGirlFrame({ pose: 'push', frameIndex: 0 }), 2 * 64, 256);
  masterSheet.blit(drawDreamGirlFrame({ pose: 'push', frameIndex: 1 }), 3 * 64, 256);
  masterSheet.blit(drawDreamGirlFrame({ pose: 'push', frameIndex: 2 }), 4 * 64, 256);
  masterSheet.blit(drawDreamGirlFrame({ pose: 'climb', frameIndex: 0 }), 5 * 64, 256);
  masterSheet.blit(drawDreamGirlFrame({ pose: 'dash', frameIndex: 0 }), 6 * 64, 256);
  masterSheet.blit(drawDreamGirlFrame({ pose: 'damage', frameIndex: 0 }), 7 * 64, 256);
  // Row 5: Teleport (2 frames) + Expressions closeups (6 frames)
  masterSheet.blit(drawDreamGirlFrame({ pose: 'teleport', frameIndex: 0 }), 0 * 64, 320);
  masterSheet.blit(drawDreamGirlFrame({ pose: 'teleport', frameIndex: 1 }), 1 * 64, 320);
  masterSheet.save(path.join(spritesDir, 'dream_girl_sheet.png'));

  // 7. FACIAL EXPRESSIONS & CLOSE-UPS SHEET (3x4 grid) - 256 x 192
  const facesSheet = new PixelCanvas(256, 192);
  const expressions = [
    'happy', 'talking', 'joy', 'confident',
    'surprised', 'nervous', 'sleepy', 'pouting',
    'starry', 'determined', 'shocked', 'blushing'
  ];
  for (let idx = 0; idx < 12; idx++) {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const fx = col * 64;
    const fy = row * 64;
    // Draw close-up face
    const faceCanvas = drawDreamGirlFrame({ pose: 'idle', frameIndex: 0, expression: expressions[idx] });
    facesSheet.blit(faceCanvas, fx, fy);
  }
  facesSheet.save(path.join(spritesDir, 'dream_girl_faces.png'));

  // 8. Phase 1 (Toy Room) player-sheet.png update with Dream Girl design
  // 4 columns x 4 rows of 32x32 frames (Down, Up, Carry, Right/Left)
  const toyRoomSheet = new PixelCanvas(128, 128);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      let pose = 'idle';
      if (row === 0) pose = col === 0 ? 'idle' : 'run';
      else if (row === 1) pose = 'climb'; // back
      else if (row === 2) pose = 'collect'; // carry
      else pose = 'run'; // side
      const frame = drawDreamGirlFrame({ pose, frameIndex: col, width: 32, height: 32 });
      toyRoomSheet.blit(frame, col * 32, row * 32);
    }
  }
  toyRoomSheet.save('assets/art/toy-room/player-sheet.png');

  console.log('✓ All Dream Girl sprite sheets and individual frames successfully built!');
}

buildAllSprites();
