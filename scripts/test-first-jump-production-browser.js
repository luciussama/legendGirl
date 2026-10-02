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

const results=[];
try {
 await send('Page.enable'); await send('Runtime.enable');
 for(const profile of [{name:'Android',width:390,height:844,mobile:true,ua:'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36'}, {name:'iPhone',width:390,height:844,mobile:true,ua:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1'}, {name:'Desktop',width:960,height:640,mobile:false,ua:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}]) {
  await send('Emulation.setDeviceMetricsOverride',{width:profile.width,height:profile.height,deviceScaleFactor:2,mobile:profile.mobile});
  await send('Emulation.setTouchEmulationEnabled',{enabled:profile.mobile});
  await send('Emulation.setUserAgentOverride',{userAgent:profile.ua});
  for(const scenario of (process.argv.includes('--capture-only') ? ['abertura-antiga'] : process.argv.includes('--repair-only') ? ['abertura-migrada-incorretamente'] : ['nova','abertura-migrada-incorretamente','abertura-antiga','abertura-concluida-sem-save','tutorial-restaurado','concluido'])) {
   await send('Page.navigate',{url:'http://127.0.0.1:3000/'});await new Promise(r=>setTimeout(r,500));
   for(let i=0;i<200;i++){if(await evaluate("typeof window.game?.start === 'function'"))break;await new Promise(r=>setTimeout(r,100));}
   await evaluate(`(async()=>{
    const {createDefaultStateVariables}=await import('/src/js/state/StateVariables.js');
    const {captureState}=await import('/src/js/state/CampaignProgress.js');
    localStorage.removeItem('legendGirl.campaign.v1');localStorage.removeItem('legendGirl.bedroom-opening.completed.v1');
    if('${scenario}'==='abertura-concluida-sem-save')localStorage.setItem('legendGirl.bedroom-opening.completed.v1','1');
    if(['abertura-migrada-incorretamente','abertura-antiga','tutorial-restaurado','concluido'].includes('${scenario}')){
     const state=captureState(createDefaultStateVariables());
     let opening={active:false,time:37.5,completed:true,cues:[]};
     if(['abertura-antiga','abertura-migrada-incorretamente'].includes('${scenario}')){if('${scenario}'==='abertura-antiga'){delete state.gameplayState;delete state.firstJumpTutorialCompleted;}else{state.gameplayState='GAMEPLAY_NORMAL';state.firstJumpTutorialCompleted=true;}opening={active:true,time:35.9,completed:false,cues:['voice4','voice10','voice14','shout21','shout25','wake29']};}
     else {state.gameplayState='${scenario}'==='concluido'?'GAMEPLAY_NORMAL':'FIRST_JUMP_TUTORIAL';state.firstJumpTutorialCompleted='${scenario}'==='concluido';state.baby.isCrouching=false;state.baby.controlsLocked='${scenario}'!=='concluido';state.baby.onGround=true;}
     localStorage.setItem('legendGirl.campaign.v1',JSON.stringify({version:1,state,opening,toyRoom:null}));
    }
   })()`);
   await evaluate('window.game = null');await send('Page.reload',{ignoreCache:true});await new Promise(r=>setTimeout(r,500));
   for(let i=0;i<200;i++){if(await evaluate("typeof window.game?.start === 'function'"))break;await new Promise(r=>setTimeout(r,100));}
   await evaluate('window.game.assetsReady');
   await evaluate("document.getElementById('btn-start-phase1').click()");
   if(scenario==='concluido'){
    assert.equal(await evaluate('window.game.state.firstJumpTutorialCompleted'),true);results.push({plataforma:profile.name,cenario:scenario,aprovado:true});continue;
   }
   for(let i=0;i<450;i++){if(await evaluate("window.game.state.gameplayState === 'FIRST_JUMP_TUTORIAL'"))break;await new Promise(r=>setTimeout(r,100));}
   assert.equal(await evaluate("window.game.state.gameplayState === 'FIRST_JUMP_TUTORIAL'"),true,profile.name+' / '+scenario);
   const pose=await evaluate('JSON.stringify({x:window.game.state.baby.x,y:window.game.state.baby.y,tick:window.game.state.tick})');
   await new Promise(r=>setTimeout(r,400));assert.equal(await evaluate('JSON.stringify({x:window.game.state.baby.x,y:window.game.state.baby.y,tick:window.game.state.tick})'),pose);
   if(scenario==='nova'||process.argv.includes('--capture-only')){await fs.mkdir('assets/qa-testers/current-screenshots/first-jump-production',{recursive:true});const shot=await evaluate("({data:document.getElementById('gameCanvas').toDataURL('image/png').split(',')[1]})");await fs.writeFile('assets/qa-testers/current-screenshots/first-jump-production/'+profile.name+'.png',Buffer.from(shot.data,'base64'));}
   if(profile.mobile) {
    await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:profile.width/2,y:profile.height*0.65}]});
    await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   } else {
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
   }
   assert.equal(await evaluate('window.game.state.firstJumpTutorialCompleted'),true,profile.name+' entrada real CDP');
   assert.equal(await evaluate('window.game.state.gameplayState'),'GAMEPLAY_NORMAL');
   results.push({plataforma:profile.name,cenario:scenario,aprovado:true});
   console.log('APROVADO: '+profile.name+' / '+scenario);
  }
 }
 await fs.writeFile('assets/qa-testers/current-logs/'+(process.argv.includes('--capture-only')?'first-jump-production-captures.json':process.argv.includes('--repair-only')?'first-jump-production-repair.json':'first-jump-production.json'),JSON.stringify(results,null,2));
} finally {ws.close();await fetch('http://127.0.0.1:9222/json/close/'+page.id);}
