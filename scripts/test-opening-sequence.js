import assert from 'node:assert/strict';
import { PNG } from 'pngjs';
import fs from 'node:fs';
const values = new Map();
const storage = {getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)};
let {OpeningSequence,OPENING_STORAGE_KEY,OPENING_DIALOGUE} = await import('../src/js/cinematics/OpeningSequence.js?first');
let revealed=0, completed=0;const cues=[];
const opening=new OpeningSequence({storage,onReveal:()=>revealed++,onComplete:()=>completed++,onCue:cue=>cues.push(cue)});
assert(opening.start());
opening.update(600);
assert.equal(values.size,0,'Uma cena incompleta não deve ser marcada como concluída');
opening.cancel();
assert(opening.start());
assert.equal(opening.time,0,'Uma entrada interrompida reinicia pela transição de aparecimento');
for(let i=0;i<2249;i++)opening.update(1);
assert(opening.active);assert.equal(completed,0);assert.equal(revealed,1);
opening.update(2);
assert(!opening.active);assert.equal(completed,1);
assert.equal(storage.getItem(OPENING_STORAGE_KEY),'1');
opening.update(600);assert.equal(completed,1,'A conclusão ocorre uma única vez');
assert(!opening.start());
({OpeningSequence}=await import('../src/js/cinematics/OpeningSequence.js?reload'));
assert(!new OpeningSequence({storage}).start(),'Um novo módulo ou página respeita a conclusão persistida');
({OpeningSequence}=await import('../src/js/cinematics/OpeningSequence.js?denied'));
const denied={getItem(){throw Error('acesso negado');},setItem(){throw Error('acesso negado');}};
const fallback=new OpeningSequence({storage:denied});assert(fallback.start());fallback.update(2300);
assert(!new OpeningSequence({storage:denied}).start(),'Alternativa restrita à sessão quando o armazenamento está bloqueado');
const sheet=PNG.sync.read(fs.readFileSync('assets/art/dark-room/opening/waking-up.png'));
assert.equal(sheet.width,2172);assert.equal(sheet.height,724);
assert(sheet.data.some((v,i)=>i%4===3&&v===0),'Transparência real');
assert.equal(OPENING_DIALOGUE.length,5);
assert(cues.includes('wake')&&cues.includes('shout'));
// Renderiza a sequência completa em dimensões de computador e de tela vertical, usando os tamanhos reais das imagens.
const gradient={addColorStop(){}};
const ctx=new Proxy({measureText:text=>({width:text.length*11}),createRadialGradient:()=>gradient,createLinearGradient:()=>gradient},
 {get:(o,k)=>k in o?o[k]:()=>{}});
for(const width of [540,960])for(const time of [0,3,5,11,16,22,26,29.5,31,34,35.5,36.5]){
 fallback.time=time;
 fallback.render(ctx,{width,height:width===540?960:540},{assets:{get:()=>sheet},drawRoom(){},lighting:{apply(){}},fairyRenderer:{render(){}}});
}
console.log('APROVADO: sequência da abertura, todas as poses, diálogo responsivo, interrupção, conclusão persistente e alternativa ao armazenamento.');
