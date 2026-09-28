import fs from 'node:fs';
import { PNG } from 'pngjs';

// Lê o sprite atual e produz uma versão refinada, sem resíduos.
const srcPath = 'assets/art/dark-room/sprites/block_castle.png';
const src = PNG.sync.read(fs.readFileSync(srcPath));
const W = src.width, H = src.height;

const out = new PNG({ width: W, height: H });
// Inicia com transparência.
out.data.fill(0);

// Funções auxiliares
function getSrc(x, y) {
  if (x < 0 || x >= W || y < 0 || y >= H) return [0, 0, 0, 0];
  const idx = (y * W + x) * 4;
  return [src.data[idx], src.data[idx+1], src.data[idx+2], src.data[idx+3]];
}

// 1. Identifica o fundo externo por preenchimento a partir das bordas externas.
const isOuterBg = new Uint8Array(W * H);
const q = [];

function isWhiteLike(x, y) {
  const [r, g, b, a] = getSrc(x, y);
  if (a < 20) return true;
  return (r > 185 && g > 185 && b > 180);
}

for (let x = 0; x < W; x++) {
  if (isWhiteLike(x, 0)) { isOuterBg[x] = 1; q.push(x, 0); }
  if (isWhiteLike(x, H - 1)) { isOuterBg[(H - 1) * W + x] = 1; q.push(x, H - 1); }
}
for (let y = 0; y < H; y++) {
  if (isWhiteLike(0, y) && !isOuterBg[y * W]) { isOuterBg[y * W] = 1; q.push(0, y); }
  if (isWhiteLike(W - 1, y) && !isOuterBg[y * W + W - 1]) { isOuterBg[y * W + W - 1] = 1; q.push(W - 1, y); }
}

let head = 0;
while (head < q.length) {
  const cx = q[head++], cy = q[head++];
  for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
    const nx = cx + dx, ny = cy + dy;
    if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
      const nIdx = ny * W + nx;
      if (!isOuterBg[nIdx] && isWhiteLike(nx, ny)) {
        isOuterBg[nIdx] = 1;
        q.push(nx, ny);
      }
    }
  }
}

// 2. Processa cada pixel.
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4;
    const [r, g, b, a] = getSrc(x, y);

    // Remove completamente o resíduo da prancha à direita.
    if (x >= 196) continue;

    // Remove o fundo externo.
    if (isOuterBg[y * W + x]) continue;

    // Remove o preenchimento de papel branco retido dentro da cúpula (y < 175).
    if (y < 175) {
      // Verifica se este pixel pertence ao preenchimento de papel quase branco.
      const isWhitePaper = (r > 185 && g > 185 && b > 180 && Math.abs(r - g) < 20 && Math.abs(r - b) < 20);
      if (isWhitePaper) {
        // Diferencia o reflexo especular suave do vidro do papel sem tratamento:
        // O arco da cúpula de vidro tem um brilho delicado ao longo da curvatura:
        // Distância ao centro x=100.5
        const dxFromCenter = Math.abs(x - 100.5);
        const isDomeArch = (dxFromCenter > 60 && dxFromCenter < 78 && y > 25 && y < 165);
        if (isDomeArch) {
          // Reflexo sutil e delicado do cristal.
          out.data[idx] = 210;
          out.data[idx+1] = 230;
          out.data[idx+2] = 245;
          out.data[idx+3] = 45; // brilho translúcido muito sutil
        }
        continue;
      }
    }

    // Remove os blocos brancos inferiores ao redor das pernas (y > 280).
    if (y > 280) {
      if (r > 175 && g > 175 && b > 165) continue;
      // Remove também os fragmentos de pernas cortadas abaixo de y=285 para unir corretamente as pernas torneadas contínuas.
      if (y > 285) continue;
    }

    // Remove os halos da suavização de bordas sobre o fundo branco:
    // Se o pixel tem alta luminância e toca uma área vazia, ajusta seu alfa para remover o halo branco.
    let hasEmptyNeighbor = false;
    for (const [ndx, ndy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nx = x + ndx, ny = y + ndy;
      if (nx < 0 || nx >= W || ny < 0 || ny >= H || isOuterBg[ny * W + nx]) {
        hasEmptyNeighbor = true;
        break;
      }
    }

    if (hasEmptyNeighbor && r > 180 && g > 180 && b > 175) {
      // Se o pixel pertence à borda de vidro.
      if (y < 175) {
        out.data[idx] = Math.min(200, r);
        out.data[idx+1] = Math.min(220, g);
        out.data[idx+2] = Math.min(235, b);
        out.data[idx+3] = 90; // borda translúcida suave
      } else {
        // Remoção de halos nas bordas de madeira.
        out.data[idx] = 90;
        out.data[idx+1] = 50;
        out.data[idx+2] = 30;
        out.data[idx+3] = 160;
      }
      continue;
    }

    // Copia o pixel original do objeto.
    out.data[idx] = r;
    out.data[idx+1] = g;
    out.data[idx+2] = b;
    out.data[idx+3] = a;
  }
}

// 3. Adiciona blocos de fixação de madeira na base da gaveta (y = 280..285)
// para que as pernas se conectem naturalmente:
// Bloco esquerdo: x = 36..52
// Bloco direito: x = 149..165
for (let y = 280; y <= 285; y++) {
  for (let x = 36; x <= 52; x++) {
    const idx = (y * W + x) * 4;
    const isEdge = (x === 36 || x === 52 || y === 285);
    out.data[idx] = isEdge ? 45 : 75;
    out.data[idx+1] = isEdge ? 22 : 40;
    out.data[idx+2] = isEdge ? 14 : 25;
    out.data[idx+3] = 255;
  }
  for (let x = 149; x <= 165; x++) {
    const idx = (y * W + x) * 4;
    const isEdge = (x === 149 || x === 165 || y === 285);
    out.data[idx] = isEdge ? 45 : 85;
    out.data[idx+1] = isEdge ? 22 : 48;
    out.data[idx+2] = isEdge ? 14 : 30;
    out.data[idx+3] = 255;
  }
}

// Salva o sprite refinado em block_castle.png e também em music_box.png.
const outBuf = PNG.sync.write(out);
fs.writeFileSync(srcPath, outBuf);
console.log(`Successfully updated ${srcPath} (${W}x${H})`);

// Salva também em assets/art/dark-room/sprites/music_box_refined.png para registro e comparação.
fs.writeFileSync('tmp/music_box_refined.png', outBuf);
