import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {PNG} from 'pngjs';
import {ARENA_GIRL_ANIMATION_FRAMES as FRAMES,ARENA_GIRL_REFERENCE_HEIGHT} from '../src/js/toy-room/ArenaGirlAnimationFrames.js';
import {createPlayerAnimation,beginArenaPlayerAttack,updateArenaPlayerAnimation,sampleArenaPlayerAnimation} from '../src/js/toy-room/ArenaPlayerAnimation.js';
import {ArenaPlayerRenderer} from '../src/js/toy-room/ArenaPlayerRenderer.js';
import {ToyRoomPhase} from '../src/js/toy-room/ToyRoomPhase.js';
const player={x:430,facing:'right',isMoving:false};
const state=()=>({mode:'BATTLE',elapsed:0,jump:0,jumpVelocity:0,crouching:false,attackTime:0,playerHitTime:0,enemy:{state:'IDLE'},playerAnimation:createPlayerAnimation()});
const images=new Map();
for(const pose of Object.values(FRAMES))for(const frame of pose){
 const path='assets/art/toy-room/battle/'+frame.file;
 if(!images.has(path))images.set(path,PNG.sync.read(fs.readFileSync(path)));
 const img=images.get(path);assert.ok(frame.x>=0&&frame.y>=0&&frame.x+frame.width<=img.width&&frame.y+frame.height<=img.height,'Recorte dentro da prancha.');
 assert.ok([...img.data].some((v,i)=>i%4===3&&v===0),'Transparência preservada.');
}
assert.equal(FRAMES.run.length,4,'Corrida possui contato, apoio, passagem e apoio oposto.');
assert.equal(FRAMES.crouch[0].pixelUnit,FRAMES.crouchEnter[0].pixelUnit,'Agachamento não reduz a escala corporal.');
assert.ok(FRAMES.crouch[0].height<FRAMES.crouchEnter[0].height,'O corpo dobrado ocupa menos altura.');
assert.ok(FRAMES.run.every(f=>f.sourceFacing===1));
assert.deepEqual(FRAMES.attack.map(f=>f.sourceFacing),[-1,1,1,1,1]);
const s=state();beginArenaPlayerAttack(s,-1);const phases=[];let swings=0;
for(let age=1;age<=24;age++){
 swings+=Number(updateArenaPlayerAnimation(s,player,1));const sample=sampleArenaPlayerAnimation(s,player);phases.push(sample.pose);
 if(age<4)assert.equal(sample.slash,null,'Sem rastro ofensivo durante antecipação.');
 if(age>=4&&age<10){assert.ok(sample.slash);assert.equal(sample.facing,-1,'Golpe segue a direção capturada, mesmo após mudar input.');}
 assert.ok(Math.abs(sample.layers.reduce((n,l)=>n+l.weight,0)-1)<1e-8,'Mistura mantém opacidade e massa visual.');
}
assert.equal(swings,1,'Efeito do corte é emitido uma única vez.');assert.ok(phases.includes('recovery'));assert.equal(phases.at(-1),'idle');
const coarse=state(),fine=state();beginArenaPlayerAttack(coarse,1);beginArenaPlayerAttack(fine,1);
for(let i=0;i<4;i++)updateArenaPlayerAnimation(coarse,player,1);for(let i=0;i<8;i++)updateArenaPlayerAnimation(fine,player,.5);
assert.equal(coarse.playerAnimation.attackAge,fine.playerAnimation.attackAge);
const snapshot=JSON.stringify(coarse);sampleArenaPlayerAnimation(coarse,player);assert.equal(JSON.stringify(coarse),snapshot,'Amostragem não altera o save.');
const low=state();low.crouching=true;low.enemy={state:'ATTACK',elapsed:54};updateArenaPlayerAnimation(low,player,1);
assert.ok(sampleArenaPlayerAnimation(low,player).layers.every(l=>l.frame===FRAMES.crouch[0]),'Sob golpe ativo, a pose de esquiva responde imediatamente.');
const legacyLow=state();delete legacyLow.playerAnimation;legacyLow.crouching=true;assert.equal(sampleArenaPlayerAnimation(legacyLow,player).pose,'crouch','Save antigo já desenha a postura correta antes do primeiro update.');
const rising=state();rising.crouching=true;updateArenaPlayerAnimation(rising,player,6);rising.crouching=false;updateArenaPlayerAnimation(rising,player,1);assert.equal(rising.playerAnimation.pose,'standUp');for(let i=0;i<9;i++)updateArenaPlayerAnimation(rising,player,1);assert.equal(rising.playerAnimation.pose,'idle','Levantamento termina em repouso sem pop de escala.');
const landed=state();landed.jump=50;updateArenaPlayerAnimation(landed,player,1);landed.jump=0;updateArenaPlayerAnimation(landed,player,1);assert.equal(landed.playerAnimation.pose,'landing');
const hurt=state();beginArenaPlayerAttack(hurt,1);hurt.playerHitTime=18;updateArenaPlayerAnimation(hurt,player,1);assert.equal(hurt.playerAnimation.pose,'damage');assert.equal(sampleArenaPlayerAnimation(hurt,player).slash,null);
// A escala de desenho é comum; somente a unidade de pixels da prancha muda.
const renderer=new ArenaPlayerRenderer();for(const f of Object.values(FRAMES).flat())renderer.images.set(f.file,{file:f.file});
const calls=[];const ctx={globalAlpha:1,save(){},restore(){},translate(){},scale(){},rotate(){},drawImage(...args){calls.push(args);},beginPath(){},arc(){},stroke(){}};
renderer.render(ctx,{player},low,690);const draw=calls[0];assert.ok(Math.abs(draw[8]/draw[4]-200/ARENA_GIRL_REFERENCE_HEIGHT*FRAMES.crouch[0].pixelUnit)<1e-8);
assert.equal(draw[6]+draw[8],0,'Pés permanecem no chão após articulação.');
// Exercita o golpe real e garante que apresentação não muda dano, alcance ou durações.
const makeRoom=()=>new ToyRoomPhase({width:960,height:540,getContext:()=>({}),removeEventListener(){}},null,null,()=>{},{bindInputs:false});
const room=makeRoom();room.story.state.swordEquipped=true;for(let i=0;i<310;i++)room.update();room.player.x=room.battle.state.enemy.x-100;room.player.facing='right';
const hp=room.battle.state.enemy.hp;room.triggerAction();for(let i=0;i<3;i++)room.update();assert.equal(room.battle.state.enemy.hp,hp,'Antecipação não adianta dano.');room.update();assert.equal(room.battle.state.enemy.hp,hp-1,'Dano continua no quarto quadro.');
const saved=JSON.parse(JSON.stringify(room.snapshot()));const restored=makeRoom();restored.restore(saved);assert.deepEqual(restored.battle.state.playerAnimation,room.battle.state.playerAnimation);
for(let i=0;i<10;i++){room.update();restored.update();}assert.deepEqual(restored.battle.state.playerAnimation,room.battle.state.playerAnimation,'Animação continua identicamente após recarga.');
assert.equal(room.battle.state.enemy.hp,restored.battle.state.enemy.hp);
const manifest=JSON.parse(fs.readFileSync('assets/art/toy-room/battle/girl/animation-v2/proveniencia.json'));
for(const [path,hash]of Object.entries(manifest.originals))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'),hash,'Arte original permanece intacta.');
console.log('APROVADO: poses intermediárias, orientação, escala corporal, pés, antecipação, recuperação, sincronização, save/load e preservação da arte original.');
