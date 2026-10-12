// Extrai e empacota os desenhos gerados; não cria poses nem altera as regras de gameplay.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';
const root = 'assets/art/toy-room/battle';
const definitions = [
  { id: 'train', source: 'train-v1.png', rows: 7, columns: 6, clips: ['Idle','Walk','Steam Blast','Front Charge','Hit','Death',null] },
  { id: 'robot', source: 'robot-v2.png', rows: 6, columns: 6, clips: ['Idle','Walk','Laser Beam',null,'Hit','Death'] },
  { id: 'dinosaur', source: 'dinosaur-v2.png', rows: 6, columns: 6, clips: ['Idle','Walk','Bite','Rush','Hit','Death'], selectedColumns: [1,2,3,4] },
  { id: 'bear', source: 'bear-v1.png', rows: 8, columns: 6, clips: ['Idle','Walk','Bear Hug','Belly Charge','Toy Leap','Hit','Enrage','Death'] },
  { id: 'robot', source: 'robot-rocket-punch-v2.png', rows: 2, columns: 3, clips: ['Rocket Punch','Rocket Punch'], displayScale: 0.46 }
];
function isolate(png) {
  const size = png.width * png.height, labels = new Int32Array(size), seen = new Uint8Array(size);
  const queue = new Int32Array(size), components = [];
  const neighbors = n => { const x = n % png.width, y = Math.floor(n / png.width); return [x ? n-1 : -1,x < png.width-1 ? n+1 : -1,y ? n-png.width : -1,y < png.height-1 ? n+png.width : -1]; };
  for (let i = 0; i < size; i++) {
    if (seen[i] || png.data[i*4+3] < 128) continue;
    let head = 0, tail = 1; queue[0] = i; seen[i] = 1;
    while (head < tail) for (const n of neighbors(queue[head++])) {
      if (n < 0 || seen[n] || png.data[n*4+3] < 128) continue;
      seen[n] = 1; queue[tail++] = n;
    }
    if (tail < 1500) continue;
    const id = components.length+1;
    let x=png.width,y=png.height,right=0,bottom=0;
    for (let j=0;j<tail;j++) {const n=queue[j],px=n%png.width,py=Math.floor(n/png.width);labels[n]=id;x=Math.min(x,px);right=Math.max(right,px);y=Math.min(y,py);bottom=Math.max(bottom,py);}
    components.push({id,x,y,right,bottom});
  }
  // Propaga a propriedade das bordas transparentes sem misturar desenhos vizinhos.
  let head=0,tail=0;
  for (let i=0;i<size;i++) if(labels[i])queue[tail++]=i;
  while(head<tail) {const n=queue[head++];for(const k of neighbors(n))if(k>=0&&!labels[k]){labels[k]=labels[n];queue[tail++]=k;}}
  for(let i=0;i<size;i++) if(png.data[i*4+3]>=8) {const c=components[labels[i]-1],x=i%png.width,y=Math.floor(i/png.width);c.x=Math.min(c.x,x);c.right=Math.max(c.right,x);c.y=Math.min(c.y,y);c.bottom=Math.max(c.bottom,y);}
  return {labels,components};
}
const manifest={version:'1.0',status:'Produzido; revisão visual humana pendente',tool:'image_gen',gameplayIntegrated:false,previewFps:6,previewFpsIsGameplayRule:false,actors:{}};
for(const def of definitions) {
  const input=PNG.sync.read(await fs.readFile(`${root}/sources/${def.source}`));
  const {labels,components}=isolate(input);
  if(components.length!==def.rows*def.columns)throw Error(`${def.source}: quantidade de desenhos inesperada (${components.length}).`);
  // Cada linha é identificada pela ordem espacial dos centros, e não por cortes de grade presumidos.
  components.sort((a,b)=>(a.y+a.bottom)/2-(b.y+b.bottom)/2);
  const actor=manifest.actors[def.id]??={animations:{}};
  for(let row=0;row<def.rows;row++) {
    const name=def.clips[row];if(!name)continue;
    const group=components.slice(row*def.columns,(row+1)*def.columns).sort((a,b)=>a.x-b.x);
    const columns=def.selectedColumns??group.map((_,i)=>i);
    const ground=Math.max(...group.map(c=>c.bottom));
    const animation=actor.animations[name]??={frames:[],loop:['Idle','Walk','Enrage'].includes(name)};
    for(const col of columns) {
      const c=group[col],padding=12;
      const w=c.right-c.x+1,h=c.bottom-c.y+1;
      const out=new PNG({width:w+padding*2,height:h+padding*2});
      for(let y=c.y;y<=c.bottom;y++)for(let x=c.x;x<=c.right;x++) {
        const n=y*input.width+x;if(labels[n]!==c.id)continue;
        input.data.copy(out.data,((y-c.y+padding)*out.width+x-c.x+padding)*4,n*4,n*4+4);
      }
      const dir=`${root}/${def.id}/${name.toLowerCase().replaceAll(' ','-')}`;
      await fs.mkdir(dir,{recursive:true});
      const number=animation.frames.length+1,file=`${dir}/${String(number).padStart(2,'0')}.png`;
      await fs.writeFile(file,PNG.sync.write(out));
      animation.frames.push({file:file.slice(root.length+1),width:out.width,height:out.height,
        anchor:{x:padding+(def.source.startsWith('robot-rocket')?120:(def.id==='robot'&&name==='Laser Beam'?65:(def.id==='train'&&name==='Steam Blast'?88:w/2))),y:padding+ground-c.y},displayScale:def.displayScale??1,
        source:def.source,sourceComponent:c.id,sha256:createHash('sha256').update(out.data).digest('hex')});
    }
  }
}
await fs.writeFile(`${root}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
console.log('Preparação concluída: desenhos separados por componente, transparência preservada e âncoras explícitas.');
