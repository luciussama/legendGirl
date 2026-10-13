// Reproduz a pendência de impacto do Urso; não modifica combate ou arte.
import fs from 'node:fs';
import {PNG} from 'pngjs';
import {ToyRoomPhase} from '../src/js/toy-room/ToyRoomPhase.js';
import {battleAnimationFrame} from '../src/js/toy-room/ToyRoomBattle.js';
import {BATTLE_PLAYER_BOUNDS} from '../src/js/toy-room/BattlePlayerBounds.js';
const root='assets/art/toy-room/battle/',m=JSON.parse(fs.readFileSync(root+'remediation/manifest.json'));
const room=new ToyRoomPhase({width:960,height:540,getContext:()=>({}),removeEventListener(){}},null,null,()=>{},{bindInputs:false});
room.story.state.swordEquipped=true;room.update();room.battle.state.index=3;room.battle.spawn();
const s=room.battle.state,e=s.enemy;
e.facing=1;e.attack='Toy Leap';room.battle.setEnemyState('ATTACK');e.elapsed=83;
room.player.x=e.x+154.9;room.player.facing='left';s.elapsed=-1;room.update();
const animation=m.actors.bear.animations['Toy Leap'],f=animation.frames[battleAnimationFrame(animation,e,108)];
const reference=m.actors.bear.animations.Idle.frames[0],png=PNG.sync.read(fs.readFileSync(root+f.file));
let edge=0;
for(let y=0;y<png.height;y++)for(let x=0;x<png.width;x++)if(png.data[(y*png.width+x)*4+3]>=128)edge=Math.max(edge,x+1);
const scale=f.displayScale*130/((reference.height-24)*reference.displayScale),body=BATTLE_PLAYER_BOUNDS.idle[0];
const near=-Math.max(...body.rows.filter(Boolean).map(row=>row[1])),gap=154.9+near-(edge-f.anchor.x)*scale;
const result={attack:e.attack,elapsed:e.elapsed,distance:154.9,playerHp:s.player.hp,bearFrame:f.file,
 bearVisibleRight:(edge-f.anchor.x)*scale,girlNearEdge:near,visibleGap:gap,impactEffectRendered:false,
 result:gap>0&&s.player.hp===2?'MISMATCH':'REVIEW'};
fs.mkdirSync('docs/battle-mode/certification-evidence/DEFECT-008',{recursive:true});
fs.writeFileSync('docs/battle-mode/certification-evidence/DEFECT-008/toy-leap-contact.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));room.destroy();
if(process.argv.includes('--strict')&&result.result!=='PASS')process.exitCode=1;
