// Extrai metadados de transparência; não modifica imagens nem colisões.
import fs from 'node:fs';import {PNG} from 'pngjs';import{OFFICIAL_FRAMES}from'../src/js/assets/officialCharacter.js';
const official=PNG.sync.read(fs.readFileSync('assets/art/dark-room/sprites/official-character.png'));
const attack=PNG.sync.read(fs.readFileSync('assets/art/toy-room/sword-attack-sheet.png'));
const data={};
function bounds(image,f,scale){const rows=[];let bottom=-1;for(let y=0;y<f.h;y++){let left=Infinity,right=-Infinity;for(let x=0;x<f.w;x++)if(image.data[((f.y+y)*image.width+f.x+x)*4+3]>=128){left=Math.min(left,(x-f.anchorX)*scale);right=Math.max(right,(x+1-f.anchorX)*scale);bottom=y;}rows.push(Number.isFinite(left)?[left,right]:null);}return {rows,pixelHeight:scale,anchorY:f.anchorY*scale,footPadding:(f.anchorY-bottom-1)*scale};}
for(const pose of['idle','run','jump','fall'])data[pose]=OFFICIAL_FRAMES[pose].map(f=>bounds(official,f,(80/50+1/f.h)*2));
data.attack=Array.from({length:8},(_,i)=>bounds(attack,{x:i*144,y:288,w:144,h:192,anchorX:72,anchorY:192},1));
const low=PNG.sync.read(fs.readFileSync('assets/art/toy-room/battle/certification/girl-low-crouch-v1.png'));
data.crouch=[bounds(low,{x:329,y:357,w:973,h:634,anchorX:973/2,anchorY:634},80/634)];
const manifest=JSON.parse(fs.readFileSync('assets/art/toy-room/battle/remediation/manifest.json'));
const f=manifest.actors.robot.animations['Rocket Punch'].frames[3];
const glove=PNG.sync.read(fs.readFileSync('assets/art/toy-room/battle/'+f.file));
const gloveBounds=bounds(glove,{x:460,y:185,w:f.width-460,h:92,anchorX:f.anchor.x-460,anchorY:f.anchor.y-185},1);
fs.writeFileSync('src/js/toy-room/BattlePlayerBounds.js','// Metadados extraídos por scripts/generate-battle-player-bounds.js.\nexport const BATTLE_PLAYER_BOUNDS = '+JSON.stringify(data)+';\nexport const BATTLE_ROCKET_GLOVE_BOUNDS = '+JSON.stringify(gloveBounds)+';\n');
console.log('Metadados de transparência da protagonista atualizados.');
