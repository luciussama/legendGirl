// Executa o protocolo completo e registra somente exceções preexistentes autorizadas.
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const defect=process.argv[2];
if(!/^DEFECT-00[1-8]$/.test(defect||''))throw Error('Informe um defeito de DEFECT-001 a DEFECT-008.');
let root=`docs/battle-mode/certification-evidence/${defect}`;
try{await fs.access(root+'/results.json');let revision=2;while(true){try{await fs.access(root+'/pass-'+revision+'/results.json');revision++;}catch{root+='/pass-'+revision;break;}}}catch{}
await fs.mkdir(root,{recursive:true});
const commands=[['test'],['run','test:toy-room:qa'],['run','test:toy-room:battle'],['run','test:battle:polish'],['run','test:battle:fairness'],['run','build']];
const results=[];
for(const args of commands){
 const result=spawnSync('npm',args,{encoding:'utf8'}), output=result.stdout+result.stderr;
 const name=args.at(-1).replaceAll(':','-');await fs.writeFile(`${root}/${name}.log`,output);
 let allowed=false;
 if(args.at(-1)==='test:battle:fairness'&&result.status===1&&process.argv.includes('--allow-known-fairness')){
  const begin=output.indexOf('\n{');
  try {
   const evidence=begin>=0?JSON.parse(output.slice(begin+1)):null;
   const known=['rocket','laser'];
   allowed=Boolean(evidence)&&known.some(k=>evidence[k]?.result==='MISMATCH')&&known.every(k=>['MISMATCH','PASS'].includes(evidence[k]?.result)) && !evidence.failure;
  } catch { allowed=false; }
 }
 results.push({command:'npm '+args.join(' '),exitCode:result.status,result:result.status===0?'PASS':allowed?'KNOWN_FAIL':'FAIL'});
 console.log(`${defect}: ${results.at(-1).command} = ${results.at(-1).result}`);
}
await fs.writeFile(`${root}/results.json`,JSON.stringify(results,null,2)+'\n');
if(results.some(r=>r.result==='FAIL'))process.exitCode=1;
