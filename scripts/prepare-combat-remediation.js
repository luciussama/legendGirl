// Recorta pranchas corrigidas sem criar poses ou modificar regras de combate.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {PNG} from 'pngjs';
const root='assets/art/toy-room/battle';
const dir=`${root}/remediation`;
const jobs=[['robot','Walk','robot-walk-remediation'],['train','Front Charge','front-charge-remediation'],['robot','Rocket Punch','rocket-punch-remediation'],['train','Steam Blast','steam-blast-remediation'],['robot','Laser Beam','laser-beam-remediation'],['train','Walk','train-walk-remediation'],['dinosaur','Rush','dinosaur-rush-remediation']];
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
 const columns=stem==='robot-walk-remediation'?2:3;
 const expected=columns*2;
 if(components.length!==expected)throw Error(`${stem}: esperados ${expected} corpos completos, encontrados ${components.length}`);
 components.sort((a,b)=>(a.y+a.bottom)/2-(b.y+b.bottom)/2);
 const sorted=[...components.slice(0,columns).sort((a,b)=>a.x-b.x),...components.slice(columns).sort((a,b)=>a.x-b.x)];
 const marks=JSON.parse(await fs.readFile(`${dir}/body-landmarks.json`,'utf8'))[stem];
 if(!marks||marks.length!==expected)throw Error(`${stem}: marcações corporais obrigatórias ausentes`);
 const frames=[];
 const original=manifest.actors[actor].animations['Idle'].frames[0];
 const displayScale=(original.height-24)*original.displayScale/(sorted[0].bottom-sorted[0].y+1);

 for(let i=0;i<sorted.length;i++){
  const c=sorted[i],row=sorted.slice(Math.floor(i/columns)*columns,Math.floor(i/columns)*columns+columns),ground=Math.max(...row.map(v=>v.bottom));
  const out=new PNG({width:c.right-c.x+25,height:c.bottom-c.y+25});
  for(let y=c.y;y<=c.bottom;y++)for(let x=c.x;x<=c.right;x++){
   const n=y*png.width+x;if(labels[n]!==c.id)continue;
   png.data.copy(out.data,((y-c.y+12)*out.width+x-c.x+12)*4,n*4,n*4+4);
  }
  const file=`remediation/${stem}/${String(i+1).padStart(2,'0')}.png`;
  await fs.mkdir(`${dir}/${stem}`,{recursive:true});await fs.writeFile(`${root}/${file}`,PNG.sync.write(out));
  frames.push({file,width:out.width,height:out.height,anchor:{x:12+marks[i].x-c.x,y:12+marks[i].y-c.y},bodyReference:'torso-ground',bodyLandmark:marks[i],displayScale,source:`remediation/${stem}.png`,sourceComponent:c.id,sha256:createHash('sha256').update(out.data).digest('hex')});
 }
 manifest.actors[actor].animations[name]={frames,loop:name==='Walk',correction:stem};
}
manifest.status='Prompt 14B: revalidação pendente';
await fs.writeFile(`${dir}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
console.log('Manifesto corrigido separado do pacote anterior; revisão de âncoras e escala pendente.');
