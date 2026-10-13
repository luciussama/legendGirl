// Diagnóstico ampliado de silhuetas; registra reprovações sem mudar a simulação.
import fs from 'node:fs';
import {PNG} from 'pngjs';
import {ToyRoomPhase} from '../src/js/toy-room/ToyRoomPhase.js';
import {OFFICIAL_FRAMES} from '../src/js/assets/officialCharacter.js';
import {BATTLE_CROUCH_FRAME,battlePlayerJumpOffset,renderRocketPunch,rocketPunchTouchesPlayer} from '../src/js/toy-room/BattlePresentation.js';
const root='assets/art/toy-room/battle/',m=JSON.parse(fs.readFileSync(root+'remediation/manifest.json'));
const f=m.actors.robot.animations['Rocket Punch'].frames[3],reference=m.actors.robot.animations.Idle.frames[0];
const glove=PNG.sync.read(fs.readFileSync(root+f.file)),official=PNG.sync.read(fs.readFileSync('assets/art/dark-room/sprites/official-character.png'));
const low=PNG.sync.read(fs.readFileSync(root+BATTLE_CROUCH_FRAME.file)),sword=PNG.sync.read(fs.readFileSync(root+'../sword-attack-sheet.png'));
const samples=[];
function rows(image,frame,scale){
 const result=[];
 for(let y=0;y<frame.h;y++){
  let left=Infinity,right=-Infinity;
  for(let x=0;x<frame.w;x++)if(image.data[((frame.y+y)*image.width+frame.x+x)*4+3]>=128){left=Math.min(left,(x-frame.anchorX)*scale);right=Math.max(right,(x+1-frame.anchorX)*scale);}
  if(Number.isFinite(left))result.push({left,right,top:(y-frame.anchorY)*scale,bottom:(y+1-frame.anchorY)*scale});
 }
 return result;
}
const cases=[];
for(const enemyFacing of[-1,1])for(const playerFacing of['left','right'])for(const pose of['idle','run','crouch','attack','jump','highJump'])for(const distance of[250,279.9,280.1])for(let index=0;index<(pose==='attack'?8:9);index++)cases.push({enemyFacing,playerFacing,pose,distance,index,group:'poses'});
for(const [group,count] of Object.entries({close:100,max:100,edge:50}))for(let i=0;i<count;i++)cases.push({group,enemyFacing:i%2?-1:1,playerFacing:i%3?'right':'left',pose:'idle',index:i%9,
 distance:group==='close'?50+i*.6:group==='max'?279.5+i*.01:i<25?280+(i%2?.02:-.02):-35+(i%2?.02:-.02)});
for(const {enemyFacing,playerFacing,pose,distance,index,group} of cases){
 const room=new ToyRoomPhase({width:960,height:540,getContext:()=>({}),removeEventListener(){}},null,null,()=>{}, {bindInputs:false});
 room.story.state.swordEquipped=true;room.update();room.battle.state.index=1;room.battle.spawn();
 room.battle.manifest=m;
 const s=room.battle.state,e=s.enemy;e.facing=enemyFacing;e.attack='Rocket Punch';room.battle.setEnemyState('ATTACK');e.elapsed=53;
 room.player.x=e.x+enemyFacing*distance;room.player.facing=playerFacing;s.elapsed=index*6;
 if(pose==='crouch')room.keysDown.ArrowDown=true;
 if(pose==='crouch')s.crouching=true;
 if(pose==='run'){const direction=playerFacing==='left'?-1:1;room.keysDown[direction<0?'ArrowLeft':'ArrowRight']=true;room.player.x-=direction*4;room.player.isMoving=true;}
 if(pose==='jump'||pose==='highJump'){s.jump=pose==='jump'?60:66;s.jumpVelocity=.3;}
 if(pose==='attack'){s.attackTime=12-index*1.5;room.story.state.attackDirection=playerFacing==='left'?-1:1;}
 const moveX=pose==='run'?(playerFacing==='left'?-1:1):0;
 const projectedPlayer={...room.player,x:room.player.x+moveX*4,isMoving:Boolean(moveX)};
 const projectedState={...s,elapsed:s.elapsed+1,attackTime:Math.max(0,s.attackTime-1),
  jump:Math.max(0,s.jump+s.jumpVelocity),jumpVelocity:s.jumpVelocity-.3};
 const actual=pose==='attack'?'attack':pose==='jump'||pose==='highJump'?'fall':pose;
 let frame,image,scale;
 if(actual==='crouch'){frame={...BATTLE_CROUCH_FRAME,anchorX:BATTLE_CROUCH_FRAME.w/2,anchorY:BATTLE_CROUCH_FRAME.h};image=low;scale=frame.displayHeight/frame.h;}
 else if(actual==='attack'){frame={x:Math.min(7,Math.floor((1-projectedState.attackTime/12)*8))*144,y:288,w:144,h:192,anchorX:72,anchorY:192};image=sword;scale=1;}
 else {frame=OFFICIAL_FRAMES[actual][Math.floor(projectedState.elapsed/6)%OFFICIAL_FRAMES[actual].length];image=official;scale=(80/50+1/frame.h)*2;}
 const model=rows(image,frame,scale),jump=battlePlayerJumpOffset(projectedState,projectedPlayer,room.story.state.attackDirection);
 const projectedContact=rocketPunchTouchesPlayer(f,reference,54,distance,{state:projectedState,player:projectedPlayer,attackDirection:room.story.state.attackDirection,enemyFacing:e.facing});
 const calls=[],ctx={save(){},restore(){},translate(){},rotate(){},beginPath(){},rect(){},clip(){},drawImage(...args){calls.push(args);}};
 renderRocketPunch(ctx,glove,f,reference,54,distance,{state:projectedState,player:projectedPlayer,attackDirection:room.story.state.attackDirection,enemyFacing:e.facing});
 const[,sx,sy,sw,sh,dx,dy,dw,dh]=calls.at(-1);let contact=false;
 const facing=(projectedPlayer.facing==='left'?-1:1)*enemyFacing;
 const body=model.map(row=>({left:distance+(facing<0?-row.right:row.left),right:distance+(facing<0?-row.left:row.right),top:row.top-jump,bottom:row.bottom-jump}));
 for(let y=0;y<sh&&!contact;y++)for(let x=0;x<sw&&!contact;x++)if(glove.data[((sy+y)*glove.width+sx+x)*4+3]>=128){
  const a=dx+x*dw/sw,b=a+dw/sw,c=dy+y*dh/sh,d=c+dh/sh;
  // Tangência de precisão numérica não constitui sobreposição de pixels.
  contact=body.some(row=>a<row.right-1e-8&&b>row.left+1e-8&&c<row.bottom-1e-8&&d>row.top+1e-8);
 }
 room.update();
 const damage=s.player.hp===2;
 samples.push({group,pose,index,distance,enemyFacing,playerFacing,visibleContact:contact,projectedContact,damage,
  result:contact===projectedContact&&projectedContact===damage?'PASS':'MISMATCH'});
 room.destroy();
}
const failed=samples.filter(s=>s.result==='MISMATCH');
const report={result:failed.length?'FAIL':'PASS',scope:'Conteúdo alfa por linha de Rocket Punch nas poses idle, run, crouch, attack, salto baixo e salto de esquiva; ambos os sentidos do inimigo e da menina.',count:samples.length,mismatches:failed.length,samples};
fs.mkdirSync('docs/battle-mode/certification-evidence/DEFECT-008',{recursive:true});
fs.writeFileSync('docs/battle-mode/certification-evidence/DEFECT-008/pose-contact.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({result:report.result,count:report.count,mismatches:report.mismatches,firstFailures:failed.slice(0,6)},null,2));
if(process.argv.includes('--strict')&&failed.length)process.exitCode=1;
