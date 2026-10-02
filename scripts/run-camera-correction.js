// QA-CAMERA-002C: comparação visual antes/depois, com duas passagens e narrativa integral.
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
const root='assets/qa-testers/camera-stability/correction';
for(const [label,variant,seed] of [['antes','antes',0x002BCAFE],['depois','todos',0x002BCAFE],['antes-repeticao','antes',0x002BCAFF],['depois-repeticao','todos',0x002BCAFF]]){
 console.log('Iniciando passagem: '+label);
 await Promise.all(['desktop','android','iphone'].map(async profile=>{
  const directory=`${root}/${label}/${profile}`;await fs.mkdir(directory,{recursive:true});
  await new Promise((resolve,reject)=>{
   const child=spawn(process.execPath,['scripts/qa-camera-stability.js',profile],{env:{...process.env,
    CAMERA_QA_OUTPUT:`${root}/${label}`,CAMERA_QA_VARIANT:variant,CAMERA_QA_SEED:String(seed),CAMERA_QA_FULL_NARRATIVE:'1'}});
   let log='';child.stdout.on('data',d=>log+=d);child.stderr.on('data',d=>log+=d);
   const timeout=setTimeout(()=>child.kill('SIGTERM'),180000);
   child.on('error',reject);child.on('close',async code=>{clearTimeout(timeout);await fs.writeFile(`${directory}/execucao.log`,log);
    if(code!==0)return reject(Error('Falha na passagem '+label+'/'+profile+': consulte execucao.log'));
    await fs.rm(`${directory}/falha.json`,{force:true});console.log('Percurso concluído: '+label+'/'+profile);resolve();
   });
  });
 }));
}
console.log('Comparações e repetições concluídas nos três perfis.');
