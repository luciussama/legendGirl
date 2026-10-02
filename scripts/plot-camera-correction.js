// Gráficos comparativos das transformações realmente desenhadas, em pixels visuais e percentuais.
import fs from 'node:fs/promises';
const root='assets/qa-testers/camera-stability/correction';
for(const profile of ['desktop','android','iphone']){
 const sets=await Promise.all(['antes','depois'].map(async label=>JSON.parse(await fs.readFile(`${root}/${label}/${profile}/frames.json`))));
 const series=sets.map(rows=>rows.filter(r=>r.phase3||r.plotTwistActive).map(r=>({frame:r.frame,zoom:r.transform?.a??1,
  x:r.cameraX-(r.transform?.e??0)/(r.transform?.a??1),y:-(r.transform?.f??0)/(r.transform?.d??1)})));
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="840" viewBox="0 0 1100 840"><rect width="1100" height="840" fill="white"/><g font-family="sans-serif" font-size="16"><text x="45" y="30">QA-CAMERA-002C — ${profile} — transformação visual efetiva (60 Hz simulados)</text><text x="45" y="55" fill="#bb4422">Antes</text><text x="140" y="55" fill="#2463ad">Depois</text>`;
 const panels=[['Zoom efetivo',r=>r.zoom],['Origem visual X (unidades do mundo)',r=>r.x],['Origem visual Y (unidades do mundo)',r=>r.y]];
 panels.forEach(([name,get],index)=>{
  const vals=series.flatMap(rows=>rows.map(get)),low=Math.min(...vals),high=Math.max(...vals),top=100+index*240;
  svg+=`<text x="45" y="${top-15}">${name}: ${low.toFixed(3)} a ${high.toFixed(3)}</text><path d="M60 ${top}v170h990" fill="none" stroke="#aaa"/>`;
  series.forEach((rows,k)=>{const first=rows[0].frame,last=rows.at(-1).frame,points=rows.map(r=>`${60+990*(r.frame-first)/(last-first)},${top+170-170*(get(r)-low)/(high-low||1)}`).join(' ');
   svg+=`<polyline points="${points}" fill="none" stroke="${k?'#2463ad':'#bb4422'}" stroke-width="1.5" opacity=".85"/>`;
  });
  svg+=`<text x="60" y="${top+195}">Frame ${series[0][0].frame}</text><text x="890" y="${top+195}">Frame ${series[0].at(-1).frame}</text>`;
 });
 await fs.writeFile(`${root}/comparacao-${profile}.svg`,svg+'</g></svg>');
}
console.log('Gráficos comparativos gerados nos três perfis.');
