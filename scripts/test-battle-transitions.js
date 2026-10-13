import assert from 'node:assert/strict';
import fs from 'node:fs';
const manifest=JSON.parse(fs.readFileSync('assets/art/toy-room/battle/remediation/manifest.json','utf8'));
const insideChest=(battle, actor, pose) => {
 const chest=battle.arenaChest(), data=manifest.actors[actor.actor];
 const frame=pose==='Death'?data.animations.Death.frames.at(-1):data.animations.Walk.frames[0];
 const ref=data.animations.Idle.frames[0], height={train:90,robot:100,dinosaur:100,bear:130}[actor.actor];
 const factor=frame.displayScale*height/((ref.height-24)*ref.displayScale)*actor.transportScale;
 const left=actor.x+(actor.facing<0?frame.anchor.x-frame.width:-frame.anchor.x)*factor;
 const top=actor.y-frame.anchor.y*factor;
 assert.ok(left>=chest.x-4 && left+frame.width*factor<=chest.x+chest.w+4, 'Brinquedo inteiramente encoberto pela caixa na extremidade horizontal.');
 assert.ok(top>=chest.y-10 && top+frame.height*factor<=chest.y+chest.h+12, 'Brinquedo inteiramente encoberto pela caixa na extremidade vertical.');
};
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';
import { BATTLE_TRANSITION_DURATION, BATTLE_ORDER, BATTLE_TUNING } from '../src/js/toy-room/ToyRoomBattle.js';
import { runBattleGameplay } from '../tests/battle-gameplay-runner.js';
const make = () => {
 const room = new ToyRoomPhase({width:960,height:540,getContext:()=>({})},null,null,()=>{}, {bindInputs:false});
 room.story.state.swordEquipped=true; room.update(); return room;
};
const initial=make();
assert.ok(initial.battle.state.transition.incoming);
insideChest(initial.battle,initial.battle.transitionPlacement(true),'Walk');
assert.equal(initial.battle.state.transition.outgoing,null);
assert.equal(initial.battle.attack(),false,'Ataque bloqueado durante entrada.');
const position=initial.player.x; initial.keysDown={ArrowRight:true,ArrowUp:true};
initial.update(12); assert.equal(initial.player.x,position); assert.equal(initial.battle.state.jump,0);
for(const index of [0,1,2,3]) {
 const room=make(), b=room.battle, s=b.state;
 s.index=index; b.spawn(); s.enemy.hp=0; b.setEnemyState('DEATH');
 const outgoing={...s.enemy};
 for(let frame=0;frame<BATTLE_TUNING.death;frame++)room.update();
 assert.equal(s.history.filter(event=>event.event==='DEFEATED').length,1);
 assert.equal(s.transition.outgoing.actor,BATTLE_ORDER[index]);
 assert.equal(s.transition.incoming?.actor,BATTLE_ORDER[index+1]);
 if(s.transition.incoming)insideChest(b,b.transitionPlacement(true),'Walk');
 const start=b.transitionPlacement(false);
 assert.equal(start.x,outgoing.x); assert.equal(start.y,BATTLE_TUNING.ground);
 assert.equal(start.facing,outgoing.facing);
 room.update(12);
 const first=b.transitionPlacement(false); assert.ok(Math.hypot(first.x-start.x,first.y-start.y)>0);
 const hp=s.player.hp; assert.equal(b.attack(),false);
 // Salvar e carregar em quatro momentos da mesma transição não duplica derrota.
 for(const target of [24,48,72,96]) {
  while(b.state.transition.elapsed<target)room.update();
  const saved=room.snapshot(), pose=b.transitionPlacement(false);
  room.restore(saved); assert.deepEqual(b.transitionPlacement(false),pose);
  assert.equal(b.state.history.filter(event=>event.event==='DEFEATED').length,1);
 }
 const restored=b.state;
 const elapsed=restored.transition.elapsed;restored.transition.elapsed=120;
 insideChest(b,b.transitionPlacement(false),'Death');
 restored.transition.elapsed=elapsed;
 while(restored.transition)room.update();
 assert.equal(restored.player.hp,hp);
 assert.equal(restored.mode,index===3?'VICTORY':'BATTLE');
 if(index<3) {assert.equal(restored.enemy.state,'IDLE');assert.equal(restored.enemy.elapsed,0);}
 else assert.equal(restored.ending,0,'Vitória somente após guardar o Urso.');
 assert.equal(BATTLE_TRANSITION_DURATION,120);
}
for(const dt of [.5,1,3,12])console.log(JSON.stringify(runBattleGameplay(make(),{dt,restore:true})));
console.log('APROVADO: entrada inicial, transporte simultâneo, quatro retornos à caixa, bloqueio de impactos, persistência e vitória após guardar o Urso.');
