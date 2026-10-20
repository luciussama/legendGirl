import express from 'express';
import {spawn} from 'node:child_process';
const app=express();app.use(express.static(process.cwd()));const server=app.listen(0,'127.0.0.1');
await new Promise((resolve,reject)=>{server.once('listening',resolve);server.once('error',reject);});
try{const child=spawn(process.execPath,['docs/diario-ia/qa/tela-inicial-20261020/browser.js'],{env:{...process.env,TITLE_QA_URL:'http://127.0.0.1:'+server.address().port},stdio:'inherit'});process.exitCode=await new Promise((resolve,reject)=>{child.once('exit',resolve);child.once('error',reject);});}finally{server.close();}
