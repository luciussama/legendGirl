// Extrai limites de colisão dos mesmos quadros conceituais usados na batalha.
import fs from 'node:fs';import {PNG} from 'pngjs';import{BATTLE_GIRL_FRAMES}from'../src/js/toy-room/BattleGirlFrames.js';
const data={};
function maskBounds(image,frame,scale){const rows=[];let bottom=-1;for(let y=0;y<frame.height;y++){let left=Infinity,right=-Infinity;for(let x=0;x<frame.width;x++)if(image.data[((frame.y??0+y)*image.width+(frame.x??0)+x)*4+3]>=128){left=Math.min(left,(x-frame.anchorX)*scale);right=Math.max(right,(x+1-frame.anchorX)*scale);bottom=y;}rows.push(Number.isFinite(left)?[left,right]:null);}return {rows,pixelHeight:scale,anchorOffsetY:frame.anchorY*scale,footPadding:(frame.anchorY-bottom-1)*scale};}
for(const pose of['idle','run','jump','fall','crouch','attack','damage'])data[pose]=BATTLE_GIRL_FRAMES[pose].map(frame=>{const image=PNG.sync.read(fs.readFileSync(`assets/art/toy-room/battle/${frame.file}`));return {...frame,...maskBounds(image,frame,(pose==='crouch'?80:160)/frame.height)};});
const manifest=JSON.parse(fs.readFileSync('assets/art/toy-room/battle/remediation/manifest.json'));
const f=manifest.actors.robot.animations['Rocket Punch'].frames[3];
const glove=PNG.sync.read(fs.readFileSync('assets/art/toy-room/battle/'+f.file));
const gloveBounds=maskBounds(glove,{x:460,y:185,width:f.width-460,height:92,anchorX:f.anchor.x-460,anchorY:f.anchor.y-185},1);
fs.writeFileSync('src/js/toy-room/BattlePlayerBounds.js','// Metadados extraídos por scripts/generate-battle-player-bounds.js.\nexport const BATTLE_PLAYER_BOUNDS = '+JSON.stringify(data)+';\nexport const BATTLE_ROCKET_GLOVE_BOUNDS = '+JSON.stringify(gloveBounds)+';\n');
console.log('Metadados de contato da menina atualizados a partir da arte conceitual da batalha.');
