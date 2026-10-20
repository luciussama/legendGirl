import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';
const source = 'assets/art/toy-room/battle/girl/animation-v2/run-sheet.png';
const bytes = await fs.readFile(source), image = PNG.sync.read(bytes);
const points = { skin: [400,240], cream: [300,390], pink: [350,440], rose: [250,400],
  hair: [320,125], lock: [375,130], boot: [145,533], sole: [150,548],
  white: [373,217], eye: [385,228], black: [300,200], blush: [445,240], guard: [465,352] };
const colors = {};
for (const [name, [x,y]] of Object.entries(points)) {
  const samples = [[],[],[]];
  for(let dy=-3;dy<=3;dy++) for(let dx=-3;dx<=3;dx++) {
    const i=((y+dy)*image.width+x+dx)*4;
    if(image.data[i+3]>=240) for(let c=0;c<3;c++) samples[c].push(image.data[i+c]);
  }
  if (!samples[0].length) throw new Error('Região sem pixels válidos: '+name);
  const rgb=samples.map(channel=>channel.sort((a,b)=>a-b)[Math.floor(channel.length/2)]);
  colors[name]='#'+rgb.map(c=>c.toString(16).padStart(2,'0')).join('');
}
const data={source,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),method:'Mediana por canal de janela com alfa ≥ 240 7×7; amostras regionais, sujeitas à revisão artística.',points,colors};
await fs.writeFile('assets/models/bear-chase/paleta-menina.json',JSON.stringify(data,null,2)+'\n');
await fs.writeFile('src/js/bear-chase/ChaseGirlPalette.js','/** Paleta regional extraída; regenerar com scripts/prepare-chase-palette.js. */\nexport const GIRL_PALETTE = Object.freeze('+JSON.stringify(colors,null,2)+');\n');
console.log('Paleta regional extraída:',colors);
