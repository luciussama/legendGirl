// QA-CAMERA-002B: evidência causal por intervenção visual, com invariantes de simulação.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root='assets/qa-testers/camera-stability/ablation';
const variants=['todos','sem-zoom','sem-damping','sem-offsets','todos-restaurados','sem-zoom-offsets'];
const profiles=['desktop','android','iphone'];
const summaries=[];
for(const variant of variants){
 const result=spawnSync(process.execPath,['scripts/analyze-camera-stability.js'],{env:{...process.env,CAMERA_QA_OUTPUT:`${root}/${variant}`},encoding:'utf8'});
 assert.equal(result.status,0,'Análise das métricas concluída: '+variant);
 const metrics=JSON.parse(await fs.readFile(`${root}/${variant}/resumo.json`));
 assert.equal(metrics.length,3,'Todos os perfis possuem evidências: '+variant);
 for(const profile of profiles){
  const rows=JSON.parse(await fs.readFile(`${root}/${variant}/${profile}/frames.json`));
  const control=JSON.parse(await fs.readFile(`${root}/todos/${profile}/frames.json`));
  const projection=row=>[row.playerX,row.playerY,row.fairyX,row.fairyY,row.playerVx,row.playerVy,
    row.onGround,row.platform,row.phase3,row.narrative,row.targetCameraY,row.targetCameraZoom,row.originalCamera];
  assert.deepEqual(rows.map(projection),control.map(projection),
    'Personagem, fada, sequência narrativa e câmera da simulação preservadas: '+variant+'/'+profile);
  const path=JSON.parse(await fs.readFile(`${root}/${variant}/${profile}/percurso.json`));
  assert.equal(path.length,38,'Os 38 apoios foram percorridos: '+variant+'/'+profile);
  assert.deepEqual(path,JSON.parse(await fs.readFile(`${root}/todos/${profile}/percurso.json`)),
    'Os mesmos saltos percorrem a fase: '+variant+'/'+profile);
  if(variant==='todos-restaurados')assert.deepEqual(rows.map(r=>r.transform),control.map(r=>r.transform),
    'Restaurar os sistemas reproduz o enquadramento original: '+profile);
  if(['sem-zoom','sem-zoom-offsets'].includes(variant))assert.ok(rows.every(r=>!r.transform||r.transform.a===1),
    'O zoom foi desabilitado somente na apresentação: '+profile);
  const s=metrics.find(s=>s.profile===profile);
  summaries.push({variant,profile,frames:rows.length,trajectorySha256:createHash('sha256').update(JSON.stringify(rows.map(projection))).digest('hex'),
    simulationPreserved:true,subida:s.subida,zoomEvents:s.zooms.filter(r=>r.phase3),
    visualJumpEvents:s.visualJumps.filter(r=>r.phase3),
    landingFailures:s.landings.filter(r=>r.phase3&&r.status.startsWith('falha')).length});
 }
}
await fs.writeFile(`${root}/comparacao.json`,JSON.stringify(summaries,null,2));
const colors={'todos':'#b34a32','sem-zoom':'#23804c','sem-damping':'#805ab0','sem-offsets':'#245d9f','todos-restaurados':'#b67e19','sem-zoom-offsets':'#191919'};
let svg='<svg xmlns="http://www.w3.org/2000/svg" width="1140" height="1040"><rect width="1140" height="1040" fill="white"/><text x="20" y="24" font-family="sans-serif">QA-CAMERA-002B — comparação no perfil Android emulado, sem eventos narrativos</text>';
const data={};for(const variant of variants)data[variant]=JSON.parse(await fs.readFile(`${root}/${variant}/android/frames.json`));
// Usa o mesmo ponto fixo do mundo em todas as curvas; janela de um pouso confirmado.
const first=6900,last=7000,anchor=data.todos[first];
const coordinate=(r,axis)=>axis==='zoom'?r.transform.a:axis==='X'?(r.transform.e+r.transform.a*(anchor.playerX-r.cameraX))*r.cssWidth/r.width:(r.transform.f+r.transform.d*anchor.playerY)*r.cssHeight/r.height;
for(const [j,axis] of ['zoom','X','Y'].entries()){
 const y=80+j*285;
 const vals=variants.flatMap(v=>data[v].slice(first,last+1).map(r=>coordinate(r,axis)));
 const lo=Math.min(...vals),hi=Math.max(...vals);
 svg+=`<text x="20" y="${y-15}" font-family="sans-serif">${axis==='zoom'?'Zoom efetivo':'Posição visual '+axis+' de ponto fixo (px CSS)'} — ${lo.toFixed(2)} a ${hi.toFixed(2)}</text>`;
 for(const variant of variants){
  const points=data[variant].slice(first,last+1).map((r,i)=>`${70+i/(last-first)*1000},${y+180-(coordinate(r,axis)-lo)/(hi-lo||1)*180}`).join(' ');
  svg+=`<polyline fill="none" stroke="${colors[variant]}" stroke-width="2" ${variant==='todos-restaurados'?'stroke-dasharray="5 4"':''} points="${points}"/>`;
 }
 const landing=6953;
 svg+=`<path stroke="#666" stroke-dasharray="4 3" d="M${70+(landing-first)/(last-first)*1000} ${y}v200"/><text x="${70+(landing-first)/(last-first)*1000}" y="${y+215}" font-family="sans-serif">Pouso: frame ${landing}</text><text x="70" y="${y+240}">${first}</text><text x="1020" y="${y+240}">${last}</text>`;
}
variants.forEach((v,i)=>svg+=`<text x="20" y="${940+i*16}" fill="${colors[v]}" font-family="sans-serif">${v}</text>`);
await fs.writeFile(`${root}/comparacao.svg`,svg+'</svg>');
console.log(JSON.stringify(summaries.map(s=>({variant:s.variant,profile:s.profile,frames:s.frames,simulacaoPreservada:s.simulationPreserved,...s.subida})),null,2));
