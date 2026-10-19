import {spawnSync} from 'node:child_process';
const profiles=['desktop','android','iphone','android_paisagem','iphone_paisagem','tablet','tablet_paisagem','compacto'];
const failures=[];
for(const profile of profiles)for(const difficulty of ['NORMAL','EASY']){
 console.log('INÍCIO: '+profile+' '+difficulty);
 const result=spawnSync(process.execPath,['docs/diario-ia/qa/jogabilidade-percurso-browser.js',profile,difficulty],{stdio:'inherit',env:{...process.env,FORMATOS_CAPTURES:'1'}});
 if(result.status!==0)failures.push({profile,difficulty,status:result.status,error:result.error?.message});
}
console.log('RESULTADO DA BATERIA: '+JSON.stringify({cases:profiles.length*2,failures}));process.exitCode=failures.length?1:0;
