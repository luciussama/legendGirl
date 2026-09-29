import assert from 'node:assert/strict';
import { getMobileDialogueRegions } from '../src/js/ui/MobileDialogueRegion.js';
for (const [height,margin] of [[1080,24],[410,20],[730,20]]) {
  const safe={left:30,right:510,top:40,bottom:height,marginY:margin};
  const short=getMobileDialogueRegions(safe,110),long=getMobileDialogueRegions(safe,150);
  assert.equal(short.panel.y,long.panel.y,'Painel fixo entre falas curtas e longas');
  assert.ok(long.scene.y+long.scene.height<long.panel.y,'Cena não invade o painel');
  assert.ok(long.boxY>=long.panel.y&&long.boxY+150<=long.panel.y+long.panel.height,'Texto cabe integralmente no painel');
  assert.ok(long.panel.y+long.panel.height<=safe.bottom-2*margin,'Folga inferior preservada');
  assert.ok(long.scene.height>0,'Cena mantém região visível em paisagem');
}
console.log('Regiões móveis: separação, estabilidade e margens aprovadas.');
