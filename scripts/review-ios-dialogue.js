// Requer servidor local :3000 e Chrome de teste com depuração remota :9222.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
const ws = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
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
const directory = 'assets/qa-testers/current-screenshots/dialogos/' + (process.argv[3] === 'android' ? 'android' : 'iphone');
await fs.mkdir(directory,{recursive:true});
try {
  await send('Page.enable');
  await send('Emulation.setUserAgentOverride',{userAgent:process.argv[3] === 'android' ? 'Mozilla/5.0 (Linux; Android 14) Mobile' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'});
  const results=[];
  const scenarios=[
    ['notch-retrato',390,744,[47,0,34,0]],
    ['notch-paisagem',844,340,[0,47,21,47]],
    ['sem-notch-retrato',375,567,[0,0,0,0]],
    ['sem-notch-paisagem',667,325,[0,0,0,0]]
  ];
  for(const [name,width,height,insets] of scenarios) {
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
    await send('Page.navigate',{url:'http://127.0.0.1:3000/tests/dark-room-playthrough.html'});
    for(let i=0;i<200;i++) {
      if(await evaluate('Boolean(window.review)')) break;
      await new Promise(r=>setTimeout(r,100));
    }
    // Canvas propositalmente maior que o viewport: reproduz a região sob a barra do Safari.
    await evaluate(`document.head.insertAdjacentHTML('beforeend','<meta name="viewport" content="width=device-width,initial-scale=1"><style>canvas{width:${width}px;height:${height+100}px}p{display:none}</style>')`);
    await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
    await evaluate(`(async()=>{
      const {getDialogueSafeArea}=await import('/src/js/ui/DialogueSafeArea.js');
      const canvas=document.querySelector('canvas');
      getDialogueSafeArea(canvas);
      document.querySelector('[data-dialogue-safe-area]').style.padding='${insets.map(x=>x+'px').join(' ')}';
      window.checkDialogue=(kind)=>{
        const ctx=canvas.getContext('2d'), calls=[],original=ctx.fillText;
        ctx.fillText=function(text,x,y,...args){
          const m=this.measureText(text);
          calls.push({text,font:this.font,left:x-m.actualBoundingBoxLeft,right:x+m.actualBoundingBoxRight,
            top:y-m.actualBoundingBoxAscent,bottom:y+m.actualBoundingBoxDescent});
          return original.call(this,text,x,y,...args);
        };
        try {
          ctx.clearRect(0,0,canvas.width,canvas.height);
          const game=window.review.game;
          if(kind.startsWith('abertura')) game.review.openingFrame(Number(kind.split('-')[1]));
          else {
            const state={isPortrait:canvas.height>canvas.width,tick:60};
            if(kind==='espera')state.isStandbyActive=true;
            else if(kind.startsWith('reviravolta'))Object.assign(state,{plotTwistActive:true,plotTwistStep:Number(kind.split('-')[1])});
            else Object.assign(state,{cutsceneActive:true,cutsceneStep:Number(kind.split('-')[1])});
            game.dialogue.renderCutsceneDialogue(ctx,canvas,state);
          }
        } finally {ctx.fillText=original;}
        return {calls:kind.startsWith('abertura')?calls.slice(calls.findIndex(c=>c.text==='FADINHA')):calls,safe:getDialogueSafeArea(canvas)};
      };
    })()`);
    for(const kind of ['abertura-5','abertura-11','abertura-15','abertura-22','abertura-26','espera','cena-1','cena-2','reviravolta-4','reviravolta-5']) {
      const baseline=await evaluate(`(()=>{
        Object.defineProperty(navigator,'userAgent',{configurable:true,value:'Teste sem ajuste iOS'});
        try{return window.checkDialogue('${kind}');}finally{delete navigator.userAgent;}
      })()`);
      const result=await evaluate(`window.checkDialogue('${kind}')`);
      const textOf = frame => frame.calls.map(call=>call.text).join('').replace(/\s/g,'');
      assert.equal(textOf(result),textOf(baseline),'Texto integral preservado');
      assert.deepEqual([...new Set(result.calls.map(c=>c.font))],[...new Set(baseline.calls.map(c=>c.font))],'Fontes preservadas');
      assert.ok(result.calls.length>0,'Fala renderizada');
      for(const text of result.calls) {
        assert.ok(text.left>=result.safe.left && text.right<=result.safe.right,`${name}/${kind}: texto dentro das laterais: ${text.text}`);
        assert.ok(text.top>=result.safe.top && text.bottom<=result.safe.bottom-result.safe.marginY,`${name}/${kind}: texto acima da margem inferior: ${text.text}`);
      }
      results.push({cenario:name,fala:kind,...result});
      if(['abertura-15','cena-1'].includes(kind)) {
        const {data}=await send('Page.captureScreenshot',{format:'png'});
        await fs.writeFile(`${directory}/${name}-${kind}.png`,Buffer.from(data,'base64'));
      }
    }
  }
  await fs.writeFile(`${directory}/resultados.json`,JSON.stringify(results,null,2)+'\n');
  console.log('Diálogos móveis: 40 quadros validados e 8 capturas geradas.');
} finally { ws.close(); }
