import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const page=await(await fetch('http://127.0.0.1:9222/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
let id=0;const pending=new Map(),errors=[];
ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
try {
 await send('Page.enable');await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:960,height:640,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:'http://127.0.0.1:3000/docs/diario-ia/qa/jogabilidade-dificuldade.html'});
 let result;for(let i=0;i<900;i++){result=await evaluate('({status:document.body?.dataset.result,text:document.querySelector("#result")?.textContent})');if(result.status)break;await new Promise(r=>setTimeout(r,100));}
 assert.equal(result.status,'passed',result.text);assert.deepEqual(errors,[]);
 await fs.mkdir('docs/diario-ia/qa-resultados/jogabilidade-persistencia',{recursive:true});await fs.writeFile('docs/diario-ia/qa-resultados/jogabilidade-persistencia/resultado.json',JSON.stringify(result,null,2));console.log(result.text);
}finally{ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
