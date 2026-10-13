import { getMobileUILayout } from '../src/js/ui/MobileUILayout.js';
import { AssetManager } from '../src/js/assets/AssetManager.js';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';
import { runToyRoomQA } from './toy-room-qa-runner.js';
import { runBattleGameplay } from './battle-gameplay-runner.js';
const canvas=document.querySelector('canvas'), status=document.querySelector('#status');
const assets=new AssetManager({manifestUrl:'../assets/manifest.json'});
let room, automatic=false, last=0, returned=0;
let renderSamples=[], rendered=0, renderMetric='';
const baselinePresentation=new URLSearchParams(location.search).get('baseline')==='1';
async function selectPresentation(phase) {
 if(!baselinePresentation)return;
 const root='../assets/art/toy-room/battle/';
 const response=await fetch(root+'polish/baseline-manifest.json');
 if(!response.ok)throw Error('Referência anterior de polimento ausente.');
 const manifest=await response.json();
 const files=new Set(Object.values(manifest.actors).flatMap(a=>Object.values(a.animations).flatMap(c=>c.frames.map(f=>f.file))));
 await Promise.all([...files].filter(f=>!phase.battle.images.has(f)).map(file=>new Promise((resolve,reject)=>{
  const img=new Image();img.onload=()=>{phase.battle.images.set(file,img);resolve();};img.onerror=()=>reject(Error('Referência ausente: '+file));img.src=root+file;
 })));
 phase.battle.manifest=manifest;
}
function drawZoom() {
 const state=room?.battle.state;if(!state)return;
 const layout=getMobileUILayout(canvas),stageTop=layout.hudBottom+72*layout.scale,stageBottom=layout.safeBottom-16*layout.scale;
 const scale=Math.max(.05,Math.min(layout.usableWidth/1440,Math.max(1,stageBottom-stageTop)/400));
 const ox=layout.centerX-800*scale,oy=(stageTop+stageBottom)/2-550*scale;
 const preview=document.querySelector('#zoom'),ctx=preview.getContext('2d');
 ctx.clearRect(0,0,preview.width,preview.height);
 ctx.drawImage(canvas,ox+(state.enemy.x-110)*scale,oy+(690-160)*scale,220*scale,180*scale,0,0,preview.width,preview.height);
}
function info() {
 const s=room.battle.state;
 status.textContent=room.battle.error || (s ? `${s.mode} · ${s.enemy.actor} · ${s.enemy.state} · ${s.enemy.attack||''} · quadro ${s.enemy.elapsed.toFixed(1)}\nMenina: ${s.player.hp}/3 · Inimigo: ${s.enemy.hp}/${s.enemy.maxHp}\nRetornos ao início: ${returned}${s.transition ? `\nTransição: ${s.transition.outgoing?.actor||'caixa'} → ${s.transition.incoming?.actor||'caixa'} · ${s.transition.elapsed.toFixed(1)}/120` : ''}${renderMetric}` : `Cena da espada: ${room.story.state.swordPickupElapsed.toFixed(0)}/300`);
}
try {
 await assets.loadManifest();
 assets.manifest.images=Object.fromEntries(Object.entries(assets.manifest.images).map(([key,path])=>[key,new URL(path,new URL('../',location.href)).href]));
 await assets.preload();
 room=new ToyRoomPhase(canvas,null,null,()=>{returned++; info();},{assets});
 await room.battle.readyPromise;
 if(room.battle.error)throw Error(room.battle.error);
 await selectPresentation(room);
 function swordScene() {
  room.clearInput(); room.battle.state=null; room.story.state.investigationStage='PICKUP';
  room.story.state.swordPickupElapsed=0; room.story.state.swordEquipped=false;
  room.story.state.sword={x:room.player.x,y:room.player.y,visible:false};
  room.introAlpha=0; room.introBannerTimer=0; room.tutorial.active=false; automatic=false; info();
 }
 document.querySelector('#start').onclick=swordScene;
 document.querySelector('#attack').onclick=()=>room.triggerAction();
 for(const button of document.querySelectorAll('[data-key]')) {
  button.onpointerdown=e=>{button.setPointerCapture(e.pointerId);room.keysDown[button.dataset.key]=true;};
  button.onpointerup=button.onpointercancel=()=>{room.keysDown[button.dataset.key]=false;};
 }
 document.querySelector('#auto').onclick=async()=>{
  try {
   automatic=true;
   const fresh=new ToyRoomPhase(canvas,null,null,()=>{returned++;},{assets});
   room.destroy(); room=fresh;
   await room.battle.readyPromise;
   if(room.battle.error)throw Error(room.battle.error);
   await selectPresentation(room);
   const exploration=runToyRoomQA(room,{draw:true});
   const battle=runBattleGameplay(room,{draw:true,restore:true});
   room.render();drawZoom(); status.textContent=JSON.stringify({exploration,battle,assets:room.battle.images.size},null,2);
   document.body.dataset.result='passed'; automatic=true;
  }catch(error){status.textContent='FAIL: '+error.stack;document.body.dataset.result='failed';automatic=true;}
 };
 document.querySelector('#defeat').onclick=()=>{swordScene();room.story.update(300);room.battle.activate();automatic='defeat';};
 document.querySelector('#observe').onclick=()=>{
  swordScene();room.story.update(300);room.battle.activate();
  room.battle.state.index=Number(document.querySelector('#enemy').value);room.battle.spawn();automatic='observe';
  renderSamples=[];rendered=0;renderMetric='';
 };
 // Inspeção da simulação real, sem modificar o estado ou os tempos do golpe.
 document.querySelector('#inspect').onclick=()=>{automatic='inspect';};
 document.querySelector('#dinosaurRush').onclick=()=>{swordScene();room.story.update(300);room.battle.activate();room.battle.state.index=2;room.battle.spawn();room.battle.state.enemy.attackIndex=1;room.player.x=room.battle.state.enemy.x-120;room.clearInput();automatic='inspect';};
 document.querySelector('#trainWalk').onclick=()=>{swordScene();room.story.update(300);room.battle.activate();room.battle.spawn();room.player.x=180;room.clearInput();automatic='walkInspect';};
 document.querySelector('#robotWalk').onclick=()=>{swordScene();room.story.update(300);room.battle.activate();room.battle.state.index=1;room.battle.spawn();room.player.x=180;room.clearInput();automatic='walkInspect';};
 for (const id of ['laserCrouch','laserStanding']) document.querySelector('#'+id).onclick=()=>{swordScene();room.story.update(300);room.battle.activate();room.battle.state.index=1;room.battle.spawn();room.player.x=room.battle.state.enemy.x-250;room.clearInput();if(id==='laserCrouch')room.keysDown.ArrowDown=true;automatic='laserInspect';};
 document.querySelector('#rocket').onclick=()=>{swordScene();room.story.update(300);room.battle.activate();room.battle.state.index=1;room.battle.spawn();room.battle.state.enemy.attackIndex=1;room.player.x=room.battle.state.enemy.x-250;room.clearInput();automatic='rocketInspect';};
 document.querySelector('#transport').onclick=()=>{swordScene();room.story.update(300);room.battle.activate();automatic='transport';};
 document.querySelector('#step').onclick=()=>{automatic=true;room.clearInput();room.update(1);room.render();drawZoom();info();};
 swordScene();
 function tick(now) {
  const dt=Math.min(3,Math.max(0,(now-last)/1000*60));last=now;
  if(automatic!==true) {
   if(automatic==='defeat' && room.battle.state.mode==='BATTLE') {const e=room.battle.state.enemy;room.player.x=e.x+e.facing*75;}
   if(['observe','inspect','transport'].includes(automatic) && room.battle.state?.mode==='BATTLE') {
    const e=room.battle.state.enemy,delta=e.x-room.player.x;
    room.keysDown=Math.abs(delta)>90 ? {[delta>0?'ArrowRight':'ArrowLeft']:true} : {};
    if(automatic==='transport' && Math.abs(delta)<=105){room.player.facing=delta>0?'right':'left';room.triggerAction();}
    if(automatic!=='transport' && e.state==='ATTACK' && e.elapsed>(e.attack==='Toy Leap'?60:25) && e.elapsed<(e.attack==='Toy Leap'?90:55))room.keysDown.ArrowUp=true;
   }
   room.update(dt);
   const renderStart=performance.now();room.render();drawZoom();const renderTime=performance.now()-renderStart;
   if(automatic==='observe' && ++rendered>30 && renderSamples.length<180) {
    renderSamples.push(renderTime);
    if(renderSamples.length===180) {
     const sorted=[...renderSamples].sort((a,b)=>a-b);
     renderMetric=`\nDesenho ${baselinePresentation?'anterior':'atual'}: 180 amostras; mediana ${sorted[90].toFixed(2)} ms; p95 ${sorted[171].toFixed(2)} ms`;
    }
   }
   info();
   if(automatic==='walkInspect' && room.battle.state?.enemy.state==='APPROACH' && room.battle.state.enemy.elapsed>=7)automatic=true;
   if(automatic==='laserInspect' && room.battle.state?.enemy.attack==='Laser Beam' && room.battle.state.enemy.elapsed>=54)automatic=true;
   if(automatic==='rocketInspect' && room.battle.state?.enemy.attack==='Rocket Punch' && room.battle.state.enemy.elapsed>=54)automatic=true;
   if(automatic==='transport' && room.battle.state?.transition?.outgoing && room.battle.state.transition.elapsed>=60)automatic=true;
   if(automatic==='inspect' && room.battle.state?.enemy.state==='ATTACK' && room.battle.state.enemy.elapsed>=36)automatic=true;
  }
  requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
} catch(error){status.textContent='FAIL: '+error.stack;document.body.dataset.result='failed';}
