import fs from 'fs';
import { PNG } from 'pngjs';

const src = PNG.sync.read(fs.readFileSync('assets/art/dark-room/platforms/stepped_dresser.png'));
const W = src.width; // 304

function copyNonTransparent(srcPng, sx, sy, sw, sh, dstPng, dx, dy) {
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const sIdx = ((sy + y) * srcPng.width + (sx + x)) * 4;
      const dIdx = ((dy + y) * dstPng.width + (dx + x)) * 4;
      const sa = srcPng.data[sIdx + 3];
      if (sa > 15) {
        // Alpha blend over background
        const da = dstPng.data[dIdx + 3] / 255;
        const normSa = sa / 255;
        const outA = normSa + da * (1 - normSa);
        if (outA > 0) {
          dstPng.data[dIdx] = Math.round((srcPng.data[sIdx] * normSa + dstPng.data[dIdx] * da * (1 - normSa)) / outA);
          dstPng.data[dIdx + 1] = Math.round((srcPng.data[sIdx + 1] * normSa + dstPng.data[dIdx + 1] * da * (1 - normSa)) / outA);
          dstPng.data[dIdx + 2] = Math.round((srcPng.data[sIdx + 2] * normSa + dstPng.data[dIdx + 2] * da * (1 - normSa)) / outA);
          dstPng.data[dIdx + 3] = Math.round(outA * 255);
        }
      }
    }
  }
}

const dstH = 484;
const dst = new PNG({ width: W, height: dstH });
dst.data.fill(0);

// 1. Corpo base sólido da cômoda (caixa de madeira maciça escura com laterais chanfradas)
for (let y = 70; y < 440; y++) {
  for (let x = 32; x < 274; x++) {
    const idx = (y * W + x) * 4;
    const tX = (x - 32) / (274 - 32);
    // Madeira nobre rica em tom mogno/nogueira
    const grain = Math.sin(x * 0.15 + y * 0.1) * 6;
    let r = 85 + grain;
    let g = 44 + grain * 0.5;
    let b = 20 + grain * 0.2;
    // Sombra na lateral esquerda e profundidade
    if (tX < 0.08) {
      const f = tX / 0.08;
      r *= 0.5 + 0.5 * f;
      g *= 0.5 + 0.5 * f;
      b *= 0.5 + 0.5 * f;
    } else if (tX > 0.92) {
      const f = (1 - tX) / 0.08;
      r *= 0.7 + 0.3 * f;
      g *= 0.7 + 0.3 * f;
      b *= 0.7 + 0.3 * f;
    }
    dst.data[idx] = Math.min(255, Math.max(0, Math.round(r)));
    dst.data[idx + 1] = Math.min(255, Math.max(0, Math.round(g)));
    dst.data[idx + 2] = Math.min(255, Math.max(0, Math.round(b)));
    dst.data[idx + 3] = 255;
  }
}

// 2. Sobrepõe as seções da cômoda:
// Gavetas superiores (y: 78 .. 158)
copyNonTransparent(src, 0, 78, W, 80, dst, 0, 78);

// Gaveta média fechada 1 (y: 158 .. 224)
copyNonTransparent(src, 0, 158, W, 66, dst, 0, 158);

// Gaveta média fechada 2 (adicional) (y: 224 .. 290)
copyNonTransparent(src, 0, 158, W, 66, dst, 0, 224);

// Gaveta aberta com roupas (y: 290 .. 372)
copyNonTransparent(src, 0, 224, W, 82, dst, 0, 290);

// Gaveta inferior fechada 3 (adicional) (y: 372 .. 438)
copyNonTransparent(src, 0, 158, W, 66, dst, 0, 372);

// Base e pés bracket (y: 438 .. 483)
copyNonTransparent(src, 0, 306, W, 45, dst, 0, 438);

// 3. Constrói o tampo superior chanfrado em perspectiva diagonal isométrica (y: 0 .. 78):
for (let y = 0; y <= 78; y++) {
  for (let x = 0; x < W; x++) {
    const tX = (x - 20) / (272 - 20);
    if (tX < 0 || tX > 1) continue;

    // Diagonal isométrica natural da perspectiva da cômoda:
    // A borda sobe suavemente da esquerda para a direita
    const backY = 32 - tX * 12;
    const frontY = 68 - tX * 12;
    const lipBottomY = 78 - tX * 4;

    const dIdx = (y * W + x) * 4;

    if (y >= backY && y <= frontY) {
      const tDepth = (y - backY) / (frontY - backY);
      const woodGrain = Math.sin(x * 0.16 + y * 0.08) * 8 + Math.sin(x * 0.04) * 6;
      let r = Math.round(118 + tDepth * 32 + woodGrain - (1 - tX) * 14);
      let g = Math.round(58 + tDepth * 20 + woodGrain * 0.5 - (1 - tX) * 9);
      let b = Math.round(24 + tDepth * 10 + woodGrain * 0.2);

      if (tX < 0.05) {
        const f = tX / 0.05;
        r = Math.round(r * (0.65 + 0.35 * f));
        g = Math.round(g * (0.65 + 0.35 * f));
        b = Math.round(b * (0.65 + 0.35 * f));
      } else if (tX > 0.94) {
        const f = (1 - tX) / 0.06;
        r = Math.round(r * (0.8 + 0.2 * f));
        g = Math.round(g * (0.8 + 0.2 * f));
        b = Math.round(b * (0.8 + 0.2 * f));
      }

      // Reflexo acetinado de verniz polido no topo
      if (tDepth > 0.65 && tDepth < 0.85) {
        r = Math.min(255, r + 18);
        g = Math.min(255, g + 12);
        b = Math.min(255, b + 6);
      }

      dst.data[dIdx] = Math.min(255, Math.max(0, r));
      dst.data[dIdx + 1] = Math.min(255, Math.max(0, g));
      dst.data[dIdx + 2] = Math.min(255, Math.max(0, b));
      dst.data[dIdx + 3] = 255;
    } else if (y > frontY && y <= lipBottomY) {
      const lipT = (y - frontY) / (lipBottomY - frontY);
      let r, g, b;
      if (lipT < 0.22) {
        r = 225; g = 148; b = 76; // Destaque chanfrado no topo
      } else if (lipT < 0.65) {
        r = 142; g = 72; b = 32;  // Corpo entalhado da moldura
      } else {
        r = 48; g = 18; b = 8;    // Sombra projetada sob o tampo
      }
      const grain = Math.sin(x * 0.2) * 5;
      dst.data[dIdx] = Math.min(255, Math.max(0, r + grain));
      dst.data[dIdx + 1] = Math.min(255, Math.max(0, g + grain * 0.5));
      dst.data[dIdx + 2] = Math.min(255, Math.max(0, b + grain * 0.2));
      dst.data[dIdx + 3] = 255;
    }
  }
}

// Borda exterior suave e anti-aliasing na silhueta do tampo
for (let y = 1; y < 78; y++) {
  for (let x = 1; x < W - 1; x++) {
    const idx = (y * W + x) * 4;
    if (dst.data[idx + 3] === 255) {
      const neighbors = [
        dst.data[((y - 1) * W + x) * 4 + 3],
        dst.data[((y + 1) * W + x) * 4 + 3],
        dst.data[(y * W + (x - 1)) * 4 + 3],
        dst.data[(y * W + (x + 1)) * 4 + 3]
      ];
      if (neighbors.some(a => a === 0)) {
        dst.data[idx] = Math.round(dst.data[idx] * 0.42);
        dst.data[idx + 1] = Math.round(dst.data[idx + 1] * 0.42);
        dst.data[idx + 2] = Math.round(dst.data[idx + 2] * 0.42);
      }
    }
  }
}

// Salva tanto como preview quanto no caminho oficial do jogo
fs.writeFileSync('assets/art/dark-room/platforms/stepped_dresser.png', PNG.sync.write(dst));
console.log('Sucesso! Novo sprite salvo em assets/art/dark-room/platforms/stepped_dresser.png');
