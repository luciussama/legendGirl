import assert from 'node:assert/strict';
import { platforms, exitDoor, createBabyState, getEscapeStats } from '../src/js/config.js';
import { getEscapeGuideTarget, updateEscapeFairyGuide } from '../src/js/controllers/EscapeFairyGuide.js';
const support = p => p.surfaceTopY ?? p.standRegion?.y ?? p.y;
const before = JSON.stringify(platforms);
let checks=0, maxArrival=0;
for (let index=9; index<platforms.length-1; index++) for(const dt of [0.5,1,1.2]) {
  const p=platforms[index], next=platforms[index+1];
  const baby={...createBabyState(),currentPlatformIndex:index,x:p.x,y:support(p)-44};
  const babyBefore=JSON.stringify(baby);
  const target=getEscapeGuideTarget(baby,platforms,exitDoor);
  assert.equal(target.landingY,support(next));
  assert.equal(target.x,(next.standRegion?.x??next.x)+(next.standRegion?.w??next.w)/2);
  const fairy={x:baby.x+35,y:baby.y-40,vx:0,vy:0,flutterPhase:0};
  let arrived=null, landed=null, y=baby.y, vy=getEscapeStats(index-9).jumpPower;
  for(let t=dt;t<150;t+=dt){
    updateEscapeFairyGuide(fairy,target,dt);
    if(arrived===null&&Math.hypot(fairy.x-target.x,fairy.y-target.y)<3)arrived=t;
    vy+=baby.gravity*dt;y+=vy*dt;
    if(landed===null&&vy>0&&y+baby.h>=target.landingY)landed=t;
  }
  assert(arrived!==null&&landed!==null&&arrived<landed,`Platform ${index}: fairy ${arrived}, descent ${landed}`);
  assert(Math.hypot(fairy.x-target.x,fairy.y-target.y)<0.01,'Wait at landing without random drift');
  assert.equal(JSON.stringify(baby),babyBefore);
  maxArrival=Math.max(maxArrival,arrived);checks++;
}
const target={x:300,y:200};
const a={x:0,y:0,vx:0,vy:0,flutterPhase:0},b={...a};
for(let i=0;i<20;i++)updateEscapeFairyGuide(a,target,1);
for(let i=0;i<40;i++)updateEscapeFairyGuide(b,target,0.5);
assert(Math.hypot(a.x-b.x,a.y-b.y)<1e-8,'Frame-rate independent navigation');
assert.equal(JSON.stringify(platforms),before);
console.log(`PASS: ${checks} escape targets; fairy arrives before descending child (max ${maxArrival.toFixed(1)} frames), waits, preserves player/platform state.`);
