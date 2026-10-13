import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PNG } from 'pngjs';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';
import { renderRocketPunch,BATTLE_PLAYER_HALF_WIDTH } from '../src/js/toy-room/BattlePresentation.js';
const m=JSON.parse(fs.readFileSync('assets/art/toy-room/battle/remediation/manifest.json','utf8'));
const f=m.actors.robot.animations['Rocket Punch'].frames[3], ref=m.actors.robot.animations.Idle.frames[0];
const image=PNG.sync.read(fs.readFileSync(`assets/art/toy-room/battle/${f.file}`));
const samples={close:100,max:100,edge:50};
for(const [group,count] of Object.entries(samples))for(let i=0;i<count;i++){
 const facing=i%2?1:-1;
 const distance=group==='close'?50+i*.6:group==='max'?279.5+i*.01:i<25?280+(i%2?.02:-.02):-35+(i%2?.02:-.02);
 const room=new ToyRoomPhase({width:960,height:540,getContext:()=>({}),removeEventListener(){}},null,null,()=>{}, {bindInputs:false, arenaEnabled:false});
 room.story.state.swordEquipped=true;room.update();room.battle.state.index=1;room.battle.spawn();
 const e=room.battle.state.enemy;e.facing=facing;e.attack='Rocket Punch';room.battle.setEnemyState('ATTACK');e.elapsed=53;
 room.player.x=e.x+facing*distance;room.update();
 const draws=[],ctx={save(){},restore(){},translate(){},rotate(){},beginPath(){},rect(){},clip(){},drawImage(...args){draws.push(args);}};
 renderRocketPunch(ctx,image,f,ref,54,distance);
 // Mede o conteúdo alfa da luva a partir da chamada realmente usada pelo renderizador.
 const [,sx,sy,sw,sh,dx,,dw]=draws.at(-1);let left=Infinity,right=-Infinity;
 for(let y=sy;y<sy+sh;y++)for(let x=sx;x<sx+sw;x++)if(image.data[(y*image.width+x)*4+3]>=128){
  left=Math.min(left,dx+(x-sx)*dw/sw);right=Math.max(right,dx+(x-sx)*dw/sw);
 }
 const contact=left<=distance+BATTLE_PLAYER_HALF_WIDTH+1e-8&&right>distance-BATTLE_PLAYER_HALF_WIDTH;
 assert.equal(room.battle.state.player.hp===2,contact,`Contato divergente em ${group}, distância ${distance}, facing ${facing}.`);
 assert.equal(room.battle.state.enemy.x,1120,'A apresentação não move o torso.');room.destroy();
}
console.log('APROVADO: Rocket Punch — 100 ataques próximos, 100 no limite máximo e 50 contatos de borda, nos dois sentidos; alfa da luva concorda com dano.');
