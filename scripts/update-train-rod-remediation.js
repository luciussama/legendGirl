// Atualiza apenas as marcações de chão da nova prancha da biela.
import fs from 'node:fs/promises';
const file='assets/art/toy-room/battle/remediation/body-landmarks.json';
const data=JSON.parse(await fs.readFile(file,'utf8'));
data['train-walk-remediation']=[{x:280,y:435},{x:790,y:435},{x:1300,y:435},{x:280,y:875},{x:790,y:875},{x:1300,y:875}];
await fs.writeFile(file,JSON.stringify(data,null,2)+'\n');
