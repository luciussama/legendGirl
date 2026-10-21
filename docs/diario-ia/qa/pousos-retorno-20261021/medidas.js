import {scan} from '../balanceamento-20261020/fisica.js';
for(const dt of [.5,1,1.2])for(const mode of ['NORMAL','EASY']){const rows=Array.from({length:16},(_,target)=>({target,...scan(target,true,undefined,dt,mode)}));console.log(JSON.stringify({dt,mode,rows,total:rows.reduce((s,r)=>s+r.ms,0)}));}
