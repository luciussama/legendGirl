import assert from 'node:assert/strict';import fs from 'node:fs';import{PNG}from'pngjs';
import{OFFICIAL_FRAMES}from'../src/js/assets/officialCharacter.js';
import{ToyRoomPhase}from'../src/js/toy-room/ToyRoomPhase.js';
import{BATTLE_CROUCH_FRAME,laserProjection,battlePlayerJumpOffset}from'../src/js/toy-room/BattlePresentation.js';
const official=PNG.sync.read(fs.readFileSync('assets/art/dark-room/sprites/official-character.png'));
const low=PNG.sync.read(fs.readFileSync(`assets/art/toy-room/battle/${BATTLE_CROUCH_FRAME.file}`));
function execute(distance,crouch,i,jump=0){
 const room=new ToyRoomPhase({width:960,height:540,getContext:()=>({}),removeEventListener(){}},null,null,()=>{}, {bindInputs:false, arenaEnabled:false});
 room.story.state.swordEquipped=true;room.update();room.battle.state.index=1;room.battle.spawn();
 const s=room.battle.state,e=s.enemy;e.facing=i%2?-1:1;e.attack='Laser Beam';room.battle.setEnemyState('ATTACK');e.elapsed=53;
 room.player.x=e.x+e.facing*distance;room.player.facing=i%3?'right':'left';s.elapsed=i*6;s.jump=jump;s.jumpVelocity=jump?.3:0;
 room.keysDown=crouch?{ArrowDown:true}:{};room.update();
 const beam=laserProjection(s,room.player,e,room.story.state.attackDirection);
 const pose=s.jump>0?(s.jumpVelocity>0?'jump':'fall'):'idle';
 const f=crouch?{...BATTLE_CROUCH_FRAME,anchorX:BATTLE_CROUCH_FRAME.w/2,anchorY:BATTLE_CROUCH_FRAME.h}:OFFICIAL_FRAMES[pose][Math.floor(s.elapsed/6)%OFFICIAL_FRAMES[pose].length];
 const image=crouch?low:official,scale=crouch?f.displayHeight/f.h:(80/50+1/f.h)*2;
 const feet=690-battlePlayerJumpOffset(s,room.player,room.story.state.attackDirection);
 const a=e.x+e.facing*beam.start,b=e.x+e.facing*beam.end,minX=Math.min(a,b),maxX=Math.max(a,b);
 let contact=false;const facing=room.player.facing==='left'?-1:1;
 for(let y=0;y<f.h;y++)for(let x=0;x<f.w;x++){
  if(image.data[((f.y+y)*image.width+f.x+x)*4+3]<128)continue;
  const rowTop=feet+(y-f.anchorY)*scale,rowBottom=rowTop+scale;
  const px=room.player.x+facing*(x-f.anchorX)*scale,px2=px+facing*scale;
  if(rowTop<690-beam.height+4 && rowBottom>690-beam.height-4 && Math.min(px,px2)<maxX && Math.max(px,px2)>minX)contact=true;
 }
 assert.equal(s.player.hp===2,contact,`Laser divergente: distância ${distance}, crouch ${crouch}, salto ${jump}, índice ${i}.`);
 room.destroy();
}
for(let i=0;i<100;i++)execute(50+i*2.4,false,i);
for(let i=0;i<100;i++)execute(50+i*2.4,true,i);
for(let i=0;i<100;i++)execute(i<50?340+(i%2?.02:-.02):-35+(i%2?.02:-.02),false,i);
for(const jump of[60,64.5,65.1,90])for(let i=0;i<9;i++)execute(250,false,i,jump);
console.log('APROVADO: Laser Beam — 100 impactos em pé, 100 esquivas agachadas, 100 contatos de borda e 36 verificações de salto; conteúdo alfa concorda com dano.');
