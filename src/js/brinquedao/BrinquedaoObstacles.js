import {BRINQUEDAO_SIDE_MATS} from './BrinquedaoRecovery.js';
import {BRINQUEDAO_TRACKS,BRINQUEDAO_BY_ID,brinquedaoSurface} from './BrinquedaoLevel.js';
import {BRINQUEDAO_ELASTIC} from './BrinquedaoExtension.js';
/** Relógios persistidos fazem pontes e lonas retomarem a mesma deformação após pausa/save. */
export function createBrinquedaoObstacles(){return{bridges:Object.fromEntries(BRINQUEDAO_TRACKS.filter(p=>p.kind==='fragile').map(p=>[p.id,null])),springs:Object.fromEntries(BRINQUEDAO_TRACKS.filter(p=>p.kind==='spring').map(p=>[p.id,null])),bumpers:Object.fromEntries(BRINQUEDAO_SIDE_MATS.map(p=>[p.id,null])),ricochets:0,recoveryLandings:0,wall:null,bounces:0,launches:0};}
export function brinquedaoBridgeSolid(s,p){return p.kind!=='fragile'||s.obstacles.bridges[p.id]===null||s.time-s.obstacles.bridges[p.id]<p.delay*(s.difficulty==='EASY'?1.6:1);}
/** O impulso vem do contato descendente; direção no ar continua sob controle do jogador. */
export function contactBrinquedao(s,track,events){const p=s.player;p.support=track.id;p.y=brinquedaoSurface(track,p.x);p.vy=0;p.mode=track.kind==='balls'?'balls':['slide','reverse'].includes(track.kind)?'slide':'walk';
 if(track.recovery)s.obstacles.recoveryLandings++;
 if(track.kind==='fragile'&&s.obstacles.bridges[track.id]===null){s.obstacles.bridges[track.id]=s.time;events.push({type:'bridge-creak'});}
 if(track.kind==='spring'){s.obstacles.springs[track.id]=s.time;s.obstacles.bounces++;if(track.vertical)p.vx=0;p.support=null;p.mode='air';p.vy=-track.impulse*(p.jumpHeld?1.12:1);p.coyote=0;p.buffer=0;events.push({type:'spring'});}
 if(track.kind==='balls')events.push({type:'balls'});
}
/** A parede inclinada devolve a energia para a rampa ascendente, em contato real com a saída. */
export function hitBrinquedaoElastic(s,previous,events){const p=s.player,b=BRINQUEDAO_ELASTIC;if(p.support!=='rampa-reversa'&&previous.x<=b.x&&p.x>=b.x&&p.y>=b.y-35&&p.y<=b.y+90&&p.vx>0){s.obstacles.wall=s.time;p.x=b.x;p.y=b.y;p.vx=b.impulse;p.vy=0;p.support='rampa-reversa';p.mode='slide';events.push({type:'elastic-wall'});return true;}return false;}
/** A inclinação do lábio transforma embalo em lançamento; não corrige a posição no ar. */
export function launchBrinquedaoSky(s,events){const p=s.player;s.obstacles.launches++;p.support=null;p.mode='air';p.x=26700;p.y=-150;p.vx=Math.max(650,Math.min(850,Math.abs(p.vx)*.43));p.vy=-1550;p.coyote=0;p.buffer=0;events.push({type:'sky-launch'});}
export function validateBrinquedaoObstacles(s){const data=s.obstacles,expected=createBrinquedaoObstacles();if(!data)throw TypeError('Atrações salvas ausentes.');for(const key of ['bridges','springs','bumpers']){const map=data[key];if(!map||Object.keys(map).length!==Object.keys(expected[key]).length||Object.keys(map).some(id=>!Object.hasOwn(expected[key],id))||Object.values(map).some(t=>t!==null&&(!Number.isFinite(t)||t<0||t>s.time)))throw TypeError('Relógios de atrações salvos inválidos.');}if(data.wall!==null&&(!Number.isFinite(data.wall)||data.wall<0||data.wall>s.time)||!Number.isSafeInteger(data.bounces)||data.bounces<0||!Number.isSafeInteger(data.launches)||data.launches<0)throw TypeError('Impulsos salvos inválidos.');if(![data.ricochets,data.recoveryLandings].every(n=>Number.isSafeInteger(n)&&n>=0))throw TypeError('Histórico de recuperação salvo inválido.');const track=BRINQUEDAO_BY_ID.get(s.player.support);if(track&&!brinquedaoBridgeSolid(s,track))throw TypeError('Apoio salvo em ponte já caída.');}
