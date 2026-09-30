import assert from 'node:assert/strict';
import { BabyRenderer } from '../src/js/entities/BabyRenderer.js';
import { OFFICIAL_FRAMES } from '../src/js/assets/officialCharacter.js';
const renderer=new BabyRenderer(),assets={get:()=>({})};
let total=0;
for(const [pose,frames] of Object.entries(OFFICIAL_FRAMES))for(let i=0;i<frames.length;i++)for(const facing of [1,-1]){
  const capture=visualScale=>{
    const calls={};
    const ctx={save(){},restore(){},translate(x,y){calls.anchor=[x,y];},scale(x,y){calls.facing=[x,y];},drawImage(...args){calls.draw=args.slice(1);}};
    renderer.renderPose(ctx,assets,pose,i,120,410,44,facing,visualScale);
    return calls;
  };
  const before=capture(1),after=capture(1.08);
  assert.deepEqual(after.anchor,before.anchor,'Ponto dos pés preservado');
  assert.deepEqual(after.facing,before.facing,'Direção preservada');
  assert.deepEqual(after.draw.slice(0,4),before.draw.slice(0,4),'Quadro original da animação preservado');
  for(let j=4;j<8;j++)assert.ok(Math.abs(after.draw[j]-before.draw[j]*1.08)<1e-9,'Ampliação visual exata de 8%');
  const frame=frames[i];
  assert.ok(Math.abs(after.draw[5]+frame.anchorY*(after.draw[7]/frame.h))<1e-9,'Âncora vertical permanece em zero');
  total++;
}
console.log(`Escala visual: ${total} combinações de quadro/direção aprovadas, sem alteração dos recortes ou âncoras.`);
