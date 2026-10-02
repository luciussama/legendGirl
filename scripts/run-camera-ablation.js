// QA-CAMERA-002B: seis rodadas isoladas, preservando o controle antes e depois das intervenções.
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
const root='assets/qa-testers/camera-stability/ablation';
for(const variant of ['todos','sem-zoom','sem-damping','sem-offsets','sem-zoom-offsets','todos-restaurados']) {
 console.log('Iniciando comparação: '+variant);
 const results=await Promise.all(['desktop','android','iphone'].map(async profile=>{
  const directory=`${root}/${variant}/${profile}`;
  await fs.mkdir(directory,{recursive:true});
  const processVariant=variant==='todos-restaurados'?'todos':variant;
  return new Promise((resolve,reject)=>{
   const child=spawn(process.execPath,['scripts/qa-camera-stability.js',profile],{env:{...process.env,CAMERA_QA_VARIANT:processVariant,CAMERA_QA_OUTPUT:`${root}/${variant}`}});
   let log='';child.stdout.on('data',d=>log+=d);child.stderr.on('data',d=>log+=d);
   const timeout=setTimeout(()=>child.kill('SIGTERM'),180000);
   child.on('error',reject);
   child.on('close',async code=>{
    clearTimeout(timeout);await fs.writeFile(`${directory}/execucao.log`,log);
    if(code!==0){reject(Error('Falha na comparação '+variant+'/'+profile+': consulte execucao.log'));return;}
    await fs.rm(`${directory}/falha.json`,{force:true});
    console.log('Percurso completo: '+variant+'/'+profile);resolve({variant,profile});
   });
  });
 }));
}
console.log('As seis rodadas de comparação foram concluídas.');
