import {
  BRINQUEDAO_RECOVERY_TRACKS
} from './BrinquedaoRecovery.js';
import {
  BRINQUEDAO_EXTENSION_TRACKS
} from './BrinquedaoExtension.js';
/** Circuito próprio de brinquedão: passarelas, pontes de madeira, escorregadores e bolinhas. */
export const BRINQUEDAO = Object.freeze({
  width: 35600,
  height: 2200,
  bodyHeight: 96,
  gravity: 1500,
  jump: 730,
  acceleration: 1350,
  maxSpeed: 700,
  slideSpeed: 980,
  elasticSpeed: 2400
});
const data = [
  ['passeio', 0, 950, 650, 650, 'pad'],
  ['subida', 950, 1550, 650, 380, 'pad'],
  ['escorrega-sol', 1550, 2550, 380, 830, 'slide'],
  ['bolinhas-sol', 2550, 3350, 830, 830, 'fish-bridge'],
  ['volta-sol', 3350, 3700, 830, 720, 'pad'],
  ['degrau-sol', 3700, 4100, 620, 600, 'pad'],
  ['ponte-jardim', 4100, 4950, 600, 600, 'bridge'],
  ['torre-vento', 4950, 5600, 600, 430, 'pad'],
  ['escorrega-vento', 5600, 6650, 430, 860, 'slide'],
  ['bolinhas-vento', 6650, 7500, 860, 860, 'fish-bridge'],
  ['subida-arco', 7500, 7900, 860, 650, 'pad'],
  ['degrau-arco', 7900, 8300, 550, 520, 'pad'],
  ['ponte-arco', 8300, 9150, 520, 520, 'bridge'],
  ['subida-alta', 9150, 9850, 520, 370, 'pad'],
  ['escorrega-grande', 9850, 11100, 370, 840, 'slide'],
  ['bolinhas-grande', 11100, 11900, 840, 840, 'fish-bridge'],
  ['volta-grande', 11900, 12300, 840, 720, 'pad'],
  ['degrau-grande', 12300, 13000, 620, 550, 'pad'],
  ['ponte-final', 13000, 13700, 550, 550, 'bridge'],
  ['chegada', 13700, 14800, 550, 550, 'pad'],
  ['atalho-sol', 4100, 4950, 440, 440, 'pad', true],
  ['atalho-arco', 8300, 9150, 360, 360, 'pad', true]
];
export const BRINQUEDAO_TRACKS = Object.freeze([...data.map(([id, from, to, y, end, kind, upper = false]) => Object.freeze({
  id,
  from,
  to,
  y,
  end,
  kind,
  upper
})), ...BRINQUEDAO_EXTENSION_TRACKS, ...BRINQUEDAO_RECOVERY_TRACKS]);
export const BRINQUEDAO_STEPS = Object.freeze([{
  x: 3700,
  top: 620,
  bottom: 720
}, {
  x: 7900,
  top: 550,
  bottom: 650
}, {
  x: 12300,
  top: 620,
  bottom: 720
}].map(Object.freeze));
export const BRINQUEDAO_FOUNDATIONS = Object.freeze([{
  from: 0,
  to: 14800,
  y: 1140
}, {
  from: 14800,
  to: BRINQUEDAO.width,
  y: 2200
}].map(Object.freeze));
const BRINQUEDAO_BRIDGE_END_MARGIN = 150;
export const BRINQUEDAO_BY_ID = new Map(BRINQUEDAO_TRACKS.map(p => [p.id, p]));
export const BRINQUEDAO_CHECKPOINTS = Object.freeze([120, 3900, 7800, 12100, 14300, 18100, 20350, 22550, 28800, 30700, 33100]);
export const BRINQUEDAO_SECTIONS = Object.freeze([{
  x: 0,
  name: 'Passarelas ao sol'
}, {
  x: 3900,
  name: 'Pontes e gargalhadas'
}, {
  x: 7800,
  name: 'Lá do alto'
}, {
  x: 11900,
  name: 'Mais um escorregador'
}, {
  x: 14800,
  name: 'O grande mergulho'
}, {
  x: 17000,
  name: 'Um mar de camas elásticas'
}, {
  x: 23300,
  name: 'Paredes que devolvem o impulso'
}, {
  x: 25100,
  name: 'De volta ao céu!'
}, {
  x: 27700,
  name: 'Castelos nas alturas'
}, {
  x: 34080,
  name: 'Entrada dos túneis'
}].map(Object.freeze));
/** Superfície autorada; a arte acompanha esta curva sem linhas auxiliares de pouso. */
export function brinquedaoSurface(p, x) {
  const u = Math.max(0, Math.min(1, (x - p.from) / (p.to - p.from))),
    q = p.kind === 'reverse' ? u * u : u * u * (3 - 2 * u),
    curve = Math.sin(Math.PI * u) ** 2;
  return p.y + (p.end - p.y) * q + ((p.bowlDepth ?? 0) * curve) + (p.kind === 'bridge' ? curve * 26 : p.kind === 'balls' ? curve * 32 : 0);
}
export function brinquedaoFoundationY(x) {
  const foundation = BRINQUEDAO_FOUNDATIONS.find(f => x >= f.from && x <= f.to);
  if (!foundation) throw RangeError('Pilar fora das fundações do Brinquedão.');
  return foundation.y;
}

function springSupportSides(p) {
  const sides = p.supportSides ?? ['left', 'right'];
  if (!Array.isArray(sides) || !sides.length || new Set(sides)
    .size !== sides.length || sides.some(side => side !== 'left' && side !== 'right')) throw TypeError(`Lados de apoio inválidos para ${p.id}.`);
  return sides;
}

function supportAnchors(p) {
  if (p.kind === 'spring') return springSupportSides(p)
    .map(side => ({
      x: side === 'left' ? p.from + 50 : p.to - 50,
      top: p.y + 100
    }));
  if (['bridge', 'fish-bridge'].includes(p.kind)) return [p.from + 12, p.to - 12].map(x => ({
    x,
    top: brinquedaoSurface(p, x) + 20
  }));
  if (p.kind === 'fragile') return [...(p.id.endsWith('-0') ? [{
    x: p.from,
    top: brinquedaoSurface(p, p.from) + 30
  }] : []), ...(p.id.endsWith('-3') ? [{
    x: p.to,
    top: brinquedaoSurface(p, p.to) + 30
  }] : [])];
  return Array.from({
    length: Math.max(0, Math.ceil((p.to - 30 - (p.from + 70)) / 360))
  }, (_, i) => {
    const x = p.from + 70 + i * 360;
    return {
      x,
      top: brinquedaoSurface(p, x) + 50
    };
  });
}
/** Apoios terminam na fundação declarada e não invadem o vão central de pontes. */
export function brinquedaoSupports(p) {
  const bridge = ['bridge', 'fish-bridge'].includes(p.kind);
  return supportAnchors(p)
    .filter(({
      x
    }) => bridge || !BRINQUEDAO_TRACKS.some(other => other !== p && ['bridge', 'fish-bridge'].includes(other.kind) && x > other.from + BRINQUEDAO_BRIDGE_END_MARGIN && x < other.to - BRINQUEDAO_BRIDGE_END_MARGIN))
    .map(({
      x,
      top
    }) => {
      const bottom = brinquedaoFoundationY(x);
      if (bottom <= top + 30) throw RangeError(`Apoio sem fundação abaixo de ${p.id}.`);
      return Object.freeze({
        x,
        top,
        bottom
      });
    });
}
export function validateBrinquedaoStructure() {
  for (const p of BRINQUEDAO_TRACKS) {
    const supports = brinquedaoSupports(p);
    if (['bridge', 'fish-bridge'].includes(p.kind) && (supports.length !== 2 || supports[0].x !== p.from + 12 || supports[1].x !== p.to - 12)) throw TypeError(`Ponte com apoio intermediário ou sem ancoragem: ${p.id}.`);
    if (p.kind === 'spring') {
      const sides = springSupportSides(p),
        expected = sides.map(side => side === 'left' ? p.from + 50 : p.to - 50);
      if (supports.length !== expected.length || supports.some((support, index) => support.x !== expected[index])) throw TypeError(`Apoios da lona inconsistentes para ${p.id}.`);
      for (const side of ['left', 'right'])
        if (!sides.includes(side)) {
          const x = side === 'left' ? p.from : p.to,
            connected = BRINQUEDAO_TRACKS.some(other => other !== p && (side === 'left' ? other.to === x : other.from === x) && Math.abs(brinquedaoSurface(other, x) - brinquedaoSurface(p, x)) <= 1);
          if (!connected) throw TypeError(`Lona sem estrutura conectada no lado ${side}: ${p.id}.`);
        }
    }
  }
  for (const bridge of BRINQUEDAO_TRACKS.filter(p => ['bridge', 'fish-bridge'].includes(p.kind)))
    for (const track of BRINQUEDAO_TRACKS)
      if (track !== bridge && brinquedaoSupports(track)
        .some(s => s.x > bridge.from + BRINQUEDAO_BRIDGE_END_MARGIN && s.x < bridge.to - BRINQUEDAO_BRIDGE_END_MARGIN)) throw TypeError(`Pilar no vão central de ${bridge.id}: ${track.id}.`);
  for (const shortcut of BRINQUEDAO_TRACKS.filter(p => p.upper && !p.recovery && p.kind === 'pad')) {
    const bridge = BRINQUEDAO_TRACKS.find(p => !p.upper && !p.recovery && ['bridge', 'fish-bridge'].includes(p.kind) && p.from <= shortcut.from && p.to >= shortcut.to);
    if (!bridge || shortcut.from !== bridge.from || shortcut.to !== bridge.to) throw TypeError(`Atalho elevado desalinhado com a ponte: ${shortcut.id}.`);
  }
  for (const step of BRINQUEDAO_STEPS) {
    const lower = BRINQUEDAO_TRACKS.find(p => !p.upper && !p.recovery && p.to === step.x),
      upper = BRINQUEDAO_TRACKS.find(p => !p.upper && !p.recovery && p.from === step.x);
    if (!lower || !upper || Math.abs(brinquedaoSurface(lower, step.x) - step.bottom) > 1 || Math.abs(brinquedaoSurface(upper, step.x) - step.top) > 1 || step.bottom <= step.top) throw TypeError(`Degrau sem contato físico e visual alinhado: ${step.x}.`);
  }
  for (const p of BRINQUEDAO_TRACKS.filter(p => p.bowlDepth || ['bridge', 'fish-bridge', 'balls'].includes(p.kind)))
    if (Math.abs(brinquedaoSlope(p, p.from)) > .02 || Math.abs(brinquedaoSlope(p, p.to)) > .02) throw TypeError(`Curva sem tangentes suaves nas extremidades: ${p.id}.`);
  return true;
}
validateBrinquedaoStructure();
export function brinquedaoSlope(p, x) {
  return (brinquedaoSurface(p, x + 2) - brinquedaoSurface(p, x - 2)) / 4;
}
export function brinquedaoMainAt(x) {
  return BRINQUEDAO_TRACKS.find(p => !p.upper && x >= p.from && x <= p.to) ?? null;
}
export function brinquedaoNearby(left, right) {
  return BRINQUEDAO_TRACKS.filter(p => p.to >= left && p.from <= right);
}
