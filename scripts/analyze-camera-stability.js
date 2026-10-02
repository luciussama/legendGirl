// QA-CAMERA-002A: análise das capturas, sem intervenção na simulação.
import fs from 'node:fs/promises';
const root=process.env.CAMERA_QA_OUTPUT || 'assets/qa-testers/camera-stability';
const summaries=[];
const std=values=>{const mean=values.reduce((a,b)=>a+b,0)/values.length;return Math.sqrt(values.reduce((a,b)=>a+(b-mean)**2,0)/values.length);};
const residual=values=>{const n=values.length,mean=values.reduce((a,b)=>a+b,0)/n,center=(n-1)/2;let num=0,den=0;values.forEach((v,i)=>{num+=(i-center)*(v-mean);den+=(i-center)**2;});return std(values.map((v,i)=>v-mean-num/den*(i-center)));};
for(const profile of ['desktop','android','iphone']){
 let rows;try{rows=JSON.parse(await fs.readFile(`${root}/${profile}/frames.json`));}catch{continue;}
 const jumps=[],visualJumps=[],zooms=[],windows=[],landings=[];
 const visual=(r,anchor={x:0,y:0})=>{const t=r.transform;return t?{x:(t.e+t.a*(anchor.x-r.cameraX))*r.cssWidth/r.width,y:(t.f+t.d*anchor.y)*r.cssHeight/r.height,z:t.a}:null;};
 for(let i=1;i<rows.length;i++){
  const a=rows[i-1],b=rows[i],v=visual(b),u=visual(a);if(!v||!u)continue;
  const narrative=a.narrative||b.narrative;
  const reference={x:a.playerX,y:a.playerY};
  const before=visual(a,reference),after=visual(b,reference);
  if(!narrative&&(Math.abs(after.x-before.x)>b.cssWidth*.05||Math.abs(after.y-before.y)>b.cssHeight*.05))
    visualJumps.push({frame:b.frame,phase3:b.phase3,dx:Math.abs(after.x-before.x),dy:Math.abs(after.y-before.y)});
  const dx=Math.abs(b.cameraX-a.cameraX),dy=Math.abs(b.cameraY-a.cameraY);
  if(!narrative&&(dx>b.width/v.z*.05||dy>b.height/v.z*.05))jumps.push({frame:b.frame,phase3:b.phase3,dx,dy});
  const logical=Math.abs(b.cameraZoom/a.cameraZoom-1),effective=Math.abs(v.z/u.z-1);
  if(!narrative&&(logical>.02||effective>.02))zooms.push({frame:b.frame,phase3:b.phase3,logical,effective});
  if(i>=59){const w=rows.slice(i-59,i+1);if(w.every(r=>!r.narrative&&r.transform&&r.phase3===b.phase3)){
   const anchor={x:w[0].playerX,y:w[0].playerY};
   const xs=w.map(r=>visual(r,anchor).x),ys=w.map(r=>visual(r,anchor).y);
   const hf=values=>std(values.slice(2).map((v,k)=>v-2*values[k+1]+values[k]))/Math.sqrt(6);
   windows.push({highFrequencyX:hf(xs),highFrequencyY:hf(ys),frame:b.frame,phase3:b.phase3,cameraStdX:std(w.map(r=>r.cameraX))*b.transform.a*b.cssWidth/b.width,cameraStdY:std(w.map(r=>r.cameraY))*b.transform.d*b.cssHeight/b.height,rawX:std(xs),rawY:std(ys),residualX:residual(xs),residualY:residual(ys)});
  }}
  if(!a.onGround&&b.onGround&&!narrative){
   const anchor={x:b.playerX,y:b.playerY};
   let stable=null,end=i+1;
   // Estabilidade: deslocamento visual <= 1 px em cada eixo por 6 frames consecutivos.
   for(;end<rows.length;end++){
    if(!rows[end].onGround||rows[end].narrative||rows[end].platform!==b.platform)break;
    if(end>=i+6&&rows.slice(end-5,end+1).every((r,k)=>{const p=visual(rows[end-6+k],anchor),q=visual(r,anchor);return p&&q&&Math.abs(q.x-p.x)<=1&&Math.abs(q.y-p.y)<=1;})){stable=rows[end-5].timeMs-b.timeMs;break;}
   }
   const observed=(rows[Math.min(end,rows.length-1)].timeMs-b.timeMs);
   landings.push({frame:b.frame,phase3:b.phase3,platform:b.platform,stableMs:stable,observedMs:observed,status:stable!==null?(stable>300?'falha':'aprovado'):(observed>300?'falha; estabilização não observada':'inconclusivo; novo salto ou evento')});
  }
 }
 const max=k=>Math.max(0,...windows.map(w=>w[k]));
 const summary={profile,execution:'Chrome desktop; relógio simulado de 60 Hz; Android/iOS apenas emulados',frames:rows.length,jumps,visualJumps,zooms,jitter:{windows:windows.length,maxRawX:max('rawX'),maxRawY:max('rawY'),maxResidualX:max('residualX'),maxResidualY:max('residualY'),rawFailures:windows.filter(w=>w.rawX>1||w.rawY>1).length,residualCandidates:windows.filter(w=>w.residualX>1||w.residualY>1).length},landings};
 summary.subida={saltosVisuais:visualJumps.filter(x=>x.phase3).length,maxHighFrequencyX:Math.max(0,...windows.filter(x=>x.phase3).map(x=>x.highFrequencyX)),maxHighFrequencyY:Math.max(0,...windows.filter(x=>x.phase3).map(x=>x.highFrequencyY)),saltos:jumps.filter(x=>x.phase3).length,zoom:zooms.filter(x=>x.phase3).length,janelas:windows.filter(x=>x.phase3).length,maxStdCameraX:Math.max(0,...windows.filter(x=>x.phase3).map(x=>x.cameraStdX)),maxStdCameraY:Math.max(0,...windows.filter(x=>x.phase3).map(x=>x.cameraStdY)),maxResidualX:Math.max(0,...windows.filter(x=>x.phase3).map(x=>x.residualX)),maxResidualY:Math.max(0,...windows.filter(x=>x.phase3).map(x=>x.residualY))};
 summaries.push(summary);await fs.writeFile(`${root}/${profile}/janelas.json`,JSON.stringify(windows));await fs.writeFile(`${root}/${profile}/metrics.json`,JSON.stringify(summary,null,2));
 const series=[['cameraX',r=>r.cameraX],['cameraY',r=>r.cameraY],['zoom lógico',r=>r.cameraZoom],['zoom visível',r=>r.transform?.a??1]];
 let svg='<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="840"><rect width="1100" height="840" fill="white"/><text x="20" y="24">QA-CAMERA-002A — '+profile+' — frames aceitos do percurso (60 Hz simulados)</text>';
 series.forEach(([label,get],j)=>{const vals=rows.map(get),lo=Math.min(...vals),hi=Math.max(...vals),y=60+j*190;const pts=vals.map((v,i)=>`${50+i/(vals.length-1)*1000},${y+140-(v-lo)/(hi-lo||1)*130}`).join(' ');svg+=`<text x="20" y="${y}">${label}: ${lo.toFixed(3)} a ${hi.toFixed(3)}</text><polyline fill="none" stroke="#365b99" stroke-width="1" points="${pts}"/>`;rows.forEach((r,i)=>{if(r.plotTwistActive&&!rows[i-1]?.plotTwistActive||r.phase3&&!rows[i-1]?.phase3)svg+=`<path stroke="#b95132" d="M${50+i/(rows.length-1)*1000} ${y}v150"/><text x="${50+i/(rows.length-1)*1000}" y="${y+160}">${r.plotTwistActive?'Reviravolta':'Subida'}</text>`;});});
 await fs.writeFile(`${root}/${profile}/graficos.svg`,svg+'</svg>');
}
await fs.writeFile(`${root}/resumo.json`,JSON.stringify(summaries,null,2));
console.log(JSON.stringify(summaries.map(s=>({profile:s.profile,frames:s.frames,jumps:s.jumps.length,zooms:s.zooms.length,jitter:s.jitter,landings:s.landings})),null,2));
