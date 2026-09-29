import assert from 'node:assert/strict';
import { androidFrameOffset } from '../src/js/controllers/AndroidFraming.js';
const base = { enabled: true, height: 1080, cssHeight: 780, feetY: 970, topY: 740 };
for (const bottomInset of [0, 24, 48]) {
  const offset = androidFrameOffset({ ...base, bottomInset });
  assert.ok(base.feetY - offset <= base.height * 0.70, 'Chão afastado da navegação');
  assert.ok(base.topY - offset >= 16 * base.height / base.cssHeight, 'Topo preservado');
}
assert.equal(androidFrameOffset({ ...base, enabled: false }), 0, 'Outras plataformas preservadas');
assert.equal(androidFrameOffset({ ...base, topY: 10 }), 0, 'Não cortar conteúdo no topo');
for (const height of [540, 960, 1200]) {
  const offset = androidFrameOffset({ ...base, height, cssHeight: height / 1.5, feetY: height - 90, topY: 250 });
  assert.ok(offset >= 0 && offset <= 226, 'Rotação mantém margem superior');
}
console.log('Enquadramento Android: margens, proteção do topo e outras plataformas aprovadas.');
const landscape = { enabled: true, height: 540, cssHeight: 390, feetY: 470, topY: 300 };
assert.ok(androidFrameOffset({ ...landscape, bottomInset: 64 }) > androidFrameOffset({ ...landscape, bottomInset: 0 }), 'Inset maior aumenta a reserva inferior');
assert.ok(androidFrameOffset({ ...base, topY: 120, topInset: 40 }) < androidFrameOffset({ ...base, topY: 120, topInset: 0 }), 'Recorte superior limita a elevação');
