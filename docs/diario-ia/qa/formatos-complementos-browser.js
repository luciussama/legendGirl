import {spawnSync} from 'node:child_process';
const commands=[
 ['toque','docs/diario-ia/qa/formatos-toque-browser.js'],
 ['tutorial','docs/diario-ia/qa/jogabilidade-tutorial-producao-browser.js'],
 ['persistencia','docs/diario-ia/qa/jogabilidade-persistencia-browser.js'],
 ['camera','docs/diario-ia/qa/camera-retorno-browser.js'],
 ['bailarina','docs/diario-ia/qa/bailarina-browser.js']
];
const failures=[];for(const [area,script]of commands){console.log('INÍCIO: '+area);const result=spawnSync(process.execPath,[script],{stdio:'inherit'});if(result.status!==0)failures.push({area,status:result.status,error:result.error?.message});}
console.log('RESULTADO DOS COMPLEMENTOS: '+JSON.stringify({areas:commands.length,failures}));process.exitCode=failures.length?1:0;
