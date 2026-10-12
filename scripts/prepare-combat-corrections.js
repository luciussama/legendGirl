// Recorta pranchas corrigidas sem criar poses ou modificar regras de combate.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {PNG} from 'pngjs';
const root='assets/art/toy-room/battle';
const dir=`${root}/corrections`;
const jobs=[['robot','Walk','robot-walk-correction'],['train','Front Charge','front-charge-correction'],['robot','Rocket Punch','rocket-punch-correction'],['train','Steam Blast','steam-blast-correction'],['robot','Laser Beam','laser-beam-correction'],['train','Walk','train-walk-review'],['dinosaur','Rush','dinosaur-rush-review']];
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

const manifest=JSON.parse(await fs.readFile(`${root}/manifest.json`,'utf8'));
for(const [actor,name,stem] of jobs){
 const png=PNG.sync.read(await fs.readFile(`${dir}/${stem}.png`));
 const {labels,components}=isolate(png);
 if(components.length!==6)throw Error(`${stem}: esperados 6 corpos completos, encontrados ${components.length}`);
 components.sort((a,b)=>(a.y+a.bottom)/2-(b.y+b.bottom)/2);
 const sorted=[...components.slice(0,3).sort((a,b)=>a.x-b.x),...components.slice(3).sort((a,b)=>a.x-b.x)];
 const frames=[];
 const original=manifest.actors[actor].animations['Idle'].frames[0];
 const displayScale=(original.height-24)*original.displayScale/(sorted[0].bottom-sorted[0].y+1);

 for(let i=0;i<sorted.length;i++){
  const c=sorted[i],row=sorted.slice(Math.floor(i/3)*3,Math.floor(i/3)*3+3),ground=Math.max(...row.map(v=>v.bottom));
  const out=new PNG({width:c.right-c.x+25,height:c.bottom-c.y+25});
  for(let y=c.y;y<=c.bottom;y++)for(let x=c.x;x<=c.right;x++){
   const n=y*png.width+x;if(labels[n]!==c.id)continue;
   png.data.copy(out.data,((y-c.y+12)*out.width+x-c.x+12)*4,n*4,n*4+4);
  }
  const file=`corrections/${stem}/${String(i+1).padStart(2,'0')}.png`;
  await fs.mkdir(`${dir}/${stem}`,{recursive:true});await fs.writeFile(`${root}/${file}`,PNG.sync.write(out));
  frames.push({file,width:out.width,height:out.height,anchor:{x:out.width/2,y:12+ground-c.y},displayScale,source:`corrections/${stem}.png`,sourceComponent:c.id,sha256:createHash('sha256').update(out.data).digest('hex')});
 }
 manifest.actors[actor].animations[name]={frames,loop:name==='Walk',correction:stem};
}
manifest.status='Prompt 14A: revalidação pendente';
await fs.writeFile(`${dir}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
console.log('Manifesto corrigido separado do pacote anterior; revisão de âncoras e escala pendente.');
