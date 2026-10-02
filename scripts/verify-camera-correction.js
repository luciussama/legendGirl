// QA-CAMERA-002C: validação do percurso, leitura e apresentação, sem modificar o gameplay.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { platforms, phase3Platforms } from '../src/js/config.js';
const root='assets/qa-testers/camera-stability/correction';
const std=a=>{const mean=a.reduce((s,v)=>s+v,0)/a.length;return Math.sqrt(a.reduce((s,v)=>s+(v-mean)**2,0)/a.length);};
const point=(r,x,y)=>({x:(r.transform.e+r.transform.a*(x-r.cameraX))*r.cssWidth/r.width,
 y:(r.transform.f+r.transform.d*y)*r.cssHeight/r.height});
const tracked=r=>point(r,r.playerX+19,r.playerY+44);
const inside=(r,left,top,right,bottom)=>left>=0&&top>=0&&right<=r.cssWidth&&bottom<=r.cssHeight;
const result=[];
for(const suffix of ['','-repeticao']){
 for(const label of ['antes','depois']){
  const analysis=spawnSync(process.execPath,['scripts/analyze-camera-stability.js'],{env:{...process.env,CAMERA_QA_OUTPUT:`${root}/${label}${suffix}`},encoding:'utf8'});
  assert.equal(analysis.status,0,'Métricas geradas: '+label+suffix);
 }
 for(const profile of ['desktop','android','iphone']){
  const before=JSON.parse(await fs.readFile(`${root}/antes${suffix}/${profile}/frames.json`));
  const after=JSON.parse(await fs.readFile(`${root}/depois${suffix}/${profile}/frames.json`));
  const projection=r=>[r.playerX,r.playerY,r.fairyX,r.fairyY,r.playerVx,r.playerVy,r.onGround,r.platform,r.phase3,
    r.narrative,r.plotTwistStep,r.targetCameraY,r.targetCameraZoom,r.originalCamera];
  assert.deepEqual(after.map(projection),before.map(projection),'Simulação e atores idênticos: '+profile+suffix);
  const path=JSON.parse(await fs.readFile(`${root}/depois${suffix}/${profile}/percurso.json`));
  assert.equal(path.length,38,'Os 38 apoios foram percorridos');
  assert.deepEqual(path,JSON.parse(await fs.readFile(`${root}/antes${suffix}/${profile}/percurso.json`)), 'Mesmos saltos e chegadas');
  const metrics=JSON.parse(await fs.readFile(`${root}/depois${suffix}/${profile}/metrics.json`));
  const prior=JSON.parse(await fs.readFile(`${root}/antes${suffix}/${profile}/metrics.json`));
  const measure=rows=>{
   let idleJitter=0,idleWindows=0,fairyVisible=0,fairyFrames=0,maxDx=0,maxDy=0,maxZoom=0;
   const jumps=[],landings=[];
   for(let i=0;i<rows.length;i++){
    const r=rows[i];if(!r.transform)continue;
    if(r.plotTwistActive){const a=point(r,r.fairyX-28,r.fairyY-28),b=point(r,r.fairyX+28,r.fairyY+28);
     fairyFrames++;if(inside(r,a.x,a.y,b.x,b.y))fairyVisible++;
    }
    // Cena parada nas falas: a reorientação narrativa já terminou, sem congelar a fada.
    if(i>=59&&r.plotTwistActive&&r.plotTwistStep>=4){const w=rows.slice(i-59,i+1);
     if(w.every(a=>a.transform&&a.plotTwistStep===r.plotTwistStep&&a.playerX===r.playerX&&a.playerY===r.playerY)){
      const p=w.map(a=>point(a,r.playerX,r.playerY));idleJitter=Math.max(idleJitter,std(p.map(v=>v.x)),std(p.map(v=>v.y)));idleWindows++;
     }
    }
    if(!(r.phase3||r.plotTwistActive)||!i)continue;
    const a=rows[i-1];if(!a.transform)continue;
    const p=point(a,a.playerX,a.playerY),q=point(r,a.playerX,a.playerY);
    maxDx=Math.max(maxDx,Math.abs(q.x-p.x)/r.cssWidth);maxDy=Math.max(maxDy,Math.abs(q.y-p.y)/r.cssHeight);
    if(!r.narrative&&!a.narrative)maxZoom=Math.max(maxZoom,Math.abs(r.transform.a/a.transform.a-1));
    if(r.narrative||a.narrative)continue;
    if(a.onGround&&!r.onGround){
     const next=phase3Platforms[a.platform+1];if(next){const support=next.standRegion||next,w=Math.min(support.w,96),x=support.x+support.w-w,y=next.surfaceTopY??support.y;
      const start=point(a,x,y-24),end=point(a,x+w,y+24);
      jumps.push({frame:a.frame,target:a.platform+1,visible:inside(a,start.x,start.y,end.x,end.y)});
     }
    }
    if(!a.onGround&&r.onGround){
     let end=i+1;while(end<rows.length&&rows[end].onGround&&!rows[end].narrative&&rows[end].platform===r.platform)end++;
     let stable=null;
     for(let start=i;start+6<end;start++){
      const values=rows.slice(start,end).map(tracked);
      const spanX=Math.max(...values.map(p=>p.x))-Math.min(...values.map(p=>p.x));
      const spanY=Math.max(...values.map(p=>p.y))-Math.min(...values.map(p=>p.y));
      if(spanX<=1&&spanY<=1){stable=rows[start].timeMs-r.timeMs;break;}
     }
     landings.push({platform:r.platform,frame:r.frame,stableMs:stable,observedMs:rows[Math.min(end,rows.length-1)].timeMs-r.timeMs});
    }
   }
   return {idleJitter,idleWindows,fairyFrames,fairyPercent:fairyFrames?fairyVisible/fairyFrames*100:null,maxDx,maxDy,maxZoom,
    visibleDestinations:jumps.filter(j=>j.visible).length,jumps,landings};
  };
  const measured=measure(after),old=measure(before);
  assert.ok(measured.idleWindows>0&&measured.idleJitter<=1,'Jitter parado <= 1 px: '+profile+suffix);
  assert.ok(measured.maxDx<=.05&&measured.maxDy<=.05,'Saltos visuais <= 5%: '+profile+suffix);
  assert.ok(measured.maxZoom<=.02,'Zoom <= 2%: '+profile+suffix);
  assert.equal(measured.visibleDestinations,16,'As 16 regiões de chegada permanecem visíveis antes do salto: '+profile+suffix);
  assert.ok(measured.fairyPercent>=95,'Fada visível em pelo menos 95% da narrativa: '+profile+suffix);
  const failures=measured.landings.filter(l=>(l.stableMs===null&&l.observedMs>300)||(l.stableMs!==null&&l.stableMs>300));
  assert.equal(failures.length,0,'Estabilização após pouso <= 300 ms: '+profile+suffix);
  result.push({profile,repeticao:!!suffix,frames:after.length,gameplayIdentical:true,before:old,after:measured,
   stabilizationFailures:failures,highFrequency:metrics.subida,beforeHighFrequency:prior.subida});
 }
}
await fs.writeFile(`${root}/validacao.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify(result.map(r=>({perfil:r.profile,repeticao:r.repeticao,frames:r.frames,antes:r.before,
 depois:r.after,falhasEstabilizacao:r.stabilizationFailures})),null,2));
