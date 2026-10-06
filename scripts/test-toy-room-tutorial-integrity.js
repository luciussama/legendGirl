import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';
const directory='docs/qa/toy-room-tutorial';
const source=(await fs.readFile(`${directory}/ToyRoomPhase-antes.txt`,'utf8'))
 .replaceAll("'../",`'${new URL('../src/js/',import.meta.url).href}`)
 .replaceAll("'./",`'${new URL('../src/js/toy-room/',import.meta.url).href}`);
const {ToyRoomPhase:Baseline}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const canvas={width:960,height:540,getContext:()=>({}),addEventListener(){},removeEventListener(){}};
const before=new Baseline(canvas,null,null,null,{bindInputs:false});
const after=new ToyRoomPhase(canvas,null,null,null,{bindInputs:false});
assert.equal(after.resolveCollisions.toString(),before.resolveCollisions.toString());
assert.deepEqual(after.furniture,before.furniture);assert.deepEqual(after.toys,before.toys);
let collisions=0;
for(let x=0;x<=1600;x+=20)for(let y=0;y<=1200;y+=20){assert.deepEqual(after.resolveCollisions(x,y,20),before.resolveCollisions(x,y,20));collisions++;}
const state=p=>({player:p.player,toys:p.toys,furniture:p.furniture,count:p.organizedCount,victory:p.victoryBannerActive});
const initial=before.snapshot();after.restore(initial);
for(let i=0;i<960;i++){
 for(const p of [before,after]){p.keysDown={[["KeyD","KeyS","KeyA","KeyW"][Math.floor(i/120)%4]]:true};p.update(1);}
 assert.deepEqual(state(after),state(before));
}
let collections=0,stores=0,drops=0;
const random=Math.random;
const seeded=fn=>{let seed=7;Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);try{fn();}finally{Math.random=random;}};
for(let index=0;index<8;index++){
 for(const p of [before,after]){p.restore(initial);p.player.x=p.toys[index].x;p.player.y=p.toys[index].y;p.lastActionTime=-Infinity;seeded(()=>p.triggerAction());}
 assert.deepEqual(state(after),state(before));collections++;
 for(const p of [before,after]){p.lastActionTime=-Infinity;seeded(()=>p.triggerAction());}
 assert.deepEqual(state(after),state(before));drops++;
 for(const p of [before,after]){p.player.x=p.toys[index].x;p.player.y=p.toys[index].y;p.lastActionTime=-Infinity;seeded(()=>p.triggerAction());const c=p.furniture.find(f=>f.id==='toy-chest');p.player.x=c.x+c.w/2;p.player.y=c.y+c.h/2;p.lastActionTime=-Infinity;seeded(()=>p.triggerAction());}
 assert.deepEqual(state(after),state(before));stores++;
}
await fs.writeFile(`${process.env.TOY_INTEGRITY_EVIDENCE || directory}/integridade.json`,JSON.stringify({collisions,movementFrames:960,collections,drops,stores,layout:'idêntico',result:'aprovado'},null,2)+'\n');
console.log('APROVADO: 4.941 colisões, 960 quadros de movimento, 8 coletas, solturas e armazenamentos iguais à versão anterior.');
