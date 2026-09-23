import assert from 'node:assert/strict';
import { BabyRenderer } from '../src/js/entities/BabyRenderer.js';
import { createBabyState, platforms } from '../src/js/config.js';

// Record the actual Canvas transforms and shoe ellipses, not a second copy of
// the renderer's contact calculation. Both facings and a full stride are tested.
const renderer = new BabyRenderer();
let checks = 0;
for (const p of platforms) for (const facing of [-1, 1]) for (let frame = 0; frame < 120; frame++) {
  const supportY = p.surfaceTopY ?? p.standRegion?.y ?? p.y;
  const baby = {...createBabyState(), x:100, y:supportY-44, facing,
    onGround:true, animTime:frame*Math.PI*2/120};
  let matrix=[1,0,0,1,0,0], stack=[], bottoms=[];
  const multiply=([a,b,c,d,e,f])=>{
    const [A,B,C,D,E,F]=matrix;
    matrix=[A*a+C*b,B*a+D*b,A*c+C*d,B*c+D*d,A*e+C*f+E,B*e+D*f+F];
  };
  const ctx=new Proxy({
    save(){stack.push([...matrix]);}, restore(){matrix=stack.pop();},
    translate(x,y){multiply([1,0,0,1,x,y]);},
    rotate(t){multiply([Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t),0,0]);},
    scale(x,y){multiply([x,0,0,y,0,0]);},
    ellipse(x,y,rx,ry,r){
      if(this.fillStyle!=='#ffd000'||rx!==4.5)return;
      const [,b,,d,,f]=matrix;
      const extent=Math.hypot(rx*(b*Math.cos(r)+d*Math.sin(r)),ry*(-b*Math.sin(r)+d*Math.cos(r)));
      bottoms.push(b*x+d*y+f+extent+this.lineWidth/2);
    },
    createLinearGradient(){return {addColorStop(){}};},
    createRadialGradient(){return {addColorStop(){}};}
  },{get:(o,k)=>k in o?o[k]:()=>{}});
  renderer.render(ctx,baby);
  assert.equal(bottoms.length,2);
  assert(Math.abs(Math.max(...bottoms)-supportY)<1e-8,`${p.style}, facing ${facing}, frame ${frame}: shoe contact`);
  checks++;
}
console.log(`PASS: ${checks} rendered shoe contacts across 22 platforms, both facings and 120 animation frames.`);
