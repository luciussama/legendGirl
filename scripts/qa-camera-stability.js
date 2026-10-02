// Requer servidor local :3000 e Chrome de teste com depuração remota :9222.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
// Cada captura usa uma aba isolada para preservar a integridade dos logs.
const page = await (await fetch('http://127.0.0.1:9222/json/new?about:blank', {method:'PUT'})).json();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let sequence = 0;
const pending = new Map();
ws.onmessage = ({data}) => { const m = JSON.parse(data); if (pending.has(m.id)) {
  const {resolve,reject} = pending.get(m.id); pending.delete(m.id);
  m.error ? reject(Error(JSON.stringify(m.error))) : resolve(m.result);
}};
const send = (method, params = {}) => new Promise((resolve,reject) => {
  const id = ++sequence; pending.set(id,{resolve,reject}); ws.send(JSON.stringify({id,method,params}));
});
async function evaluate(expression) {
  const result = await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
  if(result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const profile=process.argv[2]||'android';
const profiles={android:{width:390,height:844,mobile:true,ua:'Mozilla/5.0 (Linux; Android 14) Mobile'},
  iphone:{width:390,height:844,mobile:true,ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile'},
  desktop:{width:960,height:540,mobile:false,ua:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}};
assert.ok(profiles[profile],'Perfil de teste válido');
const device=profiles[profile];
const directory=(process.env.CAMERA_QA_OUTPUT || 'assets/qa-testers/camera-stability')+'/'+profile;
await fs.mkdir(directory,{recursive:true});
try {
  await send('Page.enable');await send('Runtime.enable');
  await send('Page.addScriptToEvaluateOnNewDocument',{source:"window.cameraQaErrors=[];window.addEventListener('error',event=>window.cameraQaErrors.push(event.message));"});
  await send('Emulation.setUserAgentOverride',{userAgent:device.ua});
  await send('Emulation.setDeviceMetricsOverride',{width:device.width,height:device.height,deviceScaleFactor:1,mobile:device.mobile});
  const variant=process.env.CAMERA_QA_VARIANT;
  const testPage=variant?'dark-room-camera-ablation.html':'dark-room-playthrough.html';
  await send('Page.navigate',{url:`http://127.0.0.1:3000/tests/${testPage}?cameraQa=1${variant?'&variant='+variant:''}${process.env.CAMERA_QA_SEED?'&seed='+process.env.CAMERA_QA_SEED:''}`});
  for(let i=0;i<200;i++){if(await evaluate('Boolean(window.review)'))break;const errors=await evaluate('window.cameraQaErrors||[]');if(errors.length)throw Error('A página de teste falhou: '+errors.join('; '));await new Promise(r=>setTimeout(r,100));}
  assert.ok(await evaluate('Boolean(window.review)'), 'A página de teste deve inicializar em até 20 segundos');
  await evaluate(`document.head.insertAdjacentHTML('beforeend','<meta name="viewport" content="width=device-width,initial-scale=1"><style>canvas{width:100vw;height:100dvh}p{display:none}</style>')`);
  // O redimensionamento é síncrono também em abas de teste em segundo plano.
  await evaluate("window.dispatchEvent(new Event('resize'))");
  await evaluate(`(()=>{
    window.cameraQaFrames=[];
    window.cameraQaRecord=row=>window.cameraQaFrames.push({...row,frame:window.cameraQaFrames.length,timeMs:window.cameraQaFrames.length*1000/60});
    const r=window.review.game.review,step=r.frameManual,save=r.saveManual,restore=r.restoreManual;
    r.frameManual=()=>step(true);
    r.saveManual=()=>({...save(),qaLength:window.cameraQaFrames.length});
    r.restoreManual=s=>{restore(s);window.cameraQaFrames.length=s.qaLength;};
    r.beginManual();
    window.dispatchEvent(new Event('resize'));
    r.inspectManual();
  })()`);
  const report=[];
  async function capture(name){const {data}=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(`${directory}/${name}.png`,Buffer.from(data,'base64'));}
  async function settle(){return evaluate(`(()=>{
    const r=window.review.game.review;
    for(let i=0;i<5000;i++){
      const s=r.inspectManual();
      if(s.over)throw Error('Falha durante narrativa: '+JSON.stringify(s));
      if(s.mode==='toy-room')return s;
      if(s.standby${process.env.CAMERA_QA_FULL_NARRATIVE?'':'||(s.plot&&s.plotStep>=4)'})r.actionManual();
      if(!s.opening&&!s.standby&&!s.transition&&!s.cutscene&&!s.plot&&!s.tutorial&&!s.portal)return s;
      r.frameManual(i%30===0);
    }throw Error('Narrativa não terminou');
  })()`);}
  await settle();await capture('01-inicio');
  for(const phase3 of [false,true]){
    for(let target=0;target<(phase3?16:22);target++){
      const result=await evaluate(`(()=>{
        const r=window.review.game.review,saved=r.saveManual();
        for(let delay=0;delay<240;delay++){
          r.restoreManual(saved);
          for(let f=0;f<delay;f++)r.frameManual(false);
          if(r.inspectManual().over)break;
          r.actionManual();
          for(let f=0;f<250;f++){
            r.frameManual(f%15===0);const s=r.inspectManual();
            if(s.over)break;
            if(s.baby.onGround){
              if(s.baby.currentPlatformIndex===${target})return {target:${target},phase3:${phase3},delay,frames:f+1,x:s.baby.x,y:s.baby.y};
              break;
            }
          }
        }
        throw Error('Sem continuação do percurso: alvo '+${target}+' fase3='+${phase3}+' origem='+JSON.stringify(saved.state.baby));
      })()`);
      report.push(result);console.log(JSON.stringify(result));
      await settle();
      if([9,21,15].includes(target))await capture(`apoio-${phase3?'retorno':'ida'}-${target}`);
    }
    await evaluate(`(()=>{const r=window.review.game.review;if(${phase3})r.actionManual();for(let i=0;i<600;i++){const s=r.inspectManual();if(s.plot||s.portal||s.mode==='toy-room')return;r.frameManual(i%15===0);if(r.inspectManual().over)throw Error('Falha ao caminhar até o portal');}throw Error('Portal não iniciou');})()`);
    await settle();if(phase3)await evaluate('(()=>{for(let i=0;i<180;i++)window.review.game.review.frameManual(i===179);})()');await capture(phase3?'04-sala-brinquedos':'03-retorno');
  }
  assert.equal(await evaluate('window.review.game.isToyRoomMode()'),true,'Campanha alcançou a sala de brinquedos');
  await fs.writeFile(`${directory}/percurso.json`,JSON.stringify(report,null,2)+'\n');
  await fs.writeFile(`${directory}/frames.json`,JSON.stringify(await evaluate('window.cameraQaFrames'))+'\n');
  console.log('Percurso do quarto escuro concluído — '+profile+'.');
}catch(error){
  await fs.writeFile(`${directory}/falha.json`,JSON.stringify({mensagem:error.message,perfil:profile},null,2));
  await fs.writeFile(`${directory}/frames.json`,JSON.stringify(await evaluate('window.cameraQaFrames'))+'\n');
  throw error;
}finally{ws.close();await fetch(`http://127.0.0.1:9222/json/close/${page.id}`).catch(()=>{});}

