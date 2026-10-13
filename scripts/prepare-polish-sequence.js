// Recorta uma única sequência; nunca redesenha poses nem altera parâmetros de combate.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';
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

const [actor, animation, stem, columnsText, landmarksText] = process.argv.slice(2);
const root = 'assets/art/toy-room/battle';
const columns = Number(columnsText);
const landmarks = JSON.parse(landmarksText);
const sheet = PNG.sync.read(await fs.readFile(`${root}/polish/${stem}.png`));
const manifest = JSON.parse(await fs.readFile(`${root}/remediation/manifest.json`, 'utf8'));
const previous = manifest.actors[actor].animations[animation];
if (landmarks.length !== previous.frames.length) throw Error('A quantidade de quadros não pode mudar neste passe.');
const { labels, components } = isolate(sheet);
if (components.length !== landmarks.length) throw Error('Quantidade de corpos completos incompatível.');
components.sort((a, b) => (a.y + a.bottom) - (b.y + b.bottom));
const sorted = [];
for (let start = 0; start < components.length; start += columns)
  sorted.push(...components.slice(start, start + columns).sort((a, b) => a.x - b.x));
const frames = [];
for (let i = 0; i < landmarks.length; i++) {
  const c = sorted[i], left = c.x, right = c.right, top = c.y, bottom = c.bottom;
  const out = new PNG({ width: right - left + 25, height: bottom - top + 25 });
  for (let y = top; y <= bottom; y++) for (let x = left; x <= right; x++) {
    const n = y * sheet.width + x;
    if (labels[n] !== c.id) continue;
    sheet.data.copy(out.data, ((y - top + 12) * out.width + x - left + 12) * 4, n * 4, n * 4 + 4);
  }
  const file = `polish/${stem}/${String(i + 1).padStart(2, '0')}.png`;
  await fs.mkdir(`${root}/polish/${stem}`, { recursive: true });
  await fs.writeFile(`${root}/${file}`, PNG.sync.write(out));
  // A escala e a referência corporal são declaradas pela revisão, nunca pelo centro do punho.
  const mark = landmarks[i];
  frames.push({ file, width: out.width, height: out.height,
    anchor: { x: mark.x - left + 12, y: mark.y - top + 12 },
    bodyReference: 'torso-ground', bodyLandmark: mark,
    displayScale: mark.scale, source: `polish/${stem}.png`,
    sha256: createHash('sha256').update(out.data).digest('hex') });
}
manifest.actors[actor].animations[animation] = { ...previous, frames, polish: stem };
await fs.writeFile(`${root}/remediation/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Candidato aplicado isoladamente: ${actor}/${animation}. Validação e playtest obrigatórios.`);
