import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const out = 'docs/qa/narrador-poetico';
await fs.mkdir(out, {recursive:true});
const httpPort = process.env.TOY_REVIEW_HTTP_PORT || '3001';
const cdp = `http://127.0.0.1:${process.env.TOY_REVIEW_CDP_PORT || '9222'}`;
const page = await (await fetch(`${cdp}/json/new?about:blank`, {method:'PUT'})).json();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(resolve => ws.onopen = resolve);
let seq = 0;
const pending = new Map(), exceptions = [], results = [];
ws.onmessage = ({data}) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params);
  if (pending.has(message.id)) {pending.get(message.id)(message);pending.delete(message.id);}
};
const send = (method, params={}) => new Promise(resolve => {
  const id = ++seq; pending.set(id,resolve); ws.send(JSON.stringify({id,method,params}));
});
const evaluate = async expression => {
  const message = await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
  if (message.error || message.result.exceptionDetails) throw Error(JSON.stringify(message));
  return message.result.result.value;
};
const capture = async name => {
  const response = await send('Page.captureScreenshot',{format:'png'});
  await fs.writeFile(`${out}/${name}.png`,Buffer.from(response.result.data,'base64'));
};
try {
 await send('Page.enable');await send('Runtime.enable');
 for(const [profile,width,height,mobile] of [['desktop',960,540,false],['retrato',390,844,true],['paisagem',915,412,true],['retrato-320',320,568,true]]) {
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
  await send('Emulation.setUserAgentOverride',{userAgent:mobile?'Mozilla/5.0 (Linux; Android 14) Mobile':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'});
  await send('Page.navigate',{url:`http://127.0.0.1:${httpPort}/index.html`});
  for(let i=0;i<200;i++){if(await evaluate('Boolean(window.game)'))break;await new Promise(r=>setTimeout(r,100));}
  await evaluate(`(async()=>{
   await game.assetsReady;game.setPaused(true);
   const old=document.getElementById('gameCanvas');window.c=document.createElement('canvas');c.width=old.width;c.height=old.height;window.ctx=c.getContext('2d');
   const base=document.createElement('canvas');base.width=c.width;base.height=c.height;base.getContext('2d').drawImage(c,0,0);window.base=base;
   document.body.replaceChildren(c);document.body.style='margin:0;background:#08070b';c.style='position:static;display:block;width:100vw;height:100vh;max-width:none;max-height:none;border-radius:0';
   window.Opening=(await import('/src/js/cinematics/OpeningSequence.js')).OpeningSequence;
   window.dialogue=(await import('/src/js/ui/DialogueRenderer.js')).dialogueRenderer;
   window.Phase=(await import('/src/js/toy-room/ToyRoomPhase.js')).ToyRoomPhase;
   window.Intro=(await import('/src/js/cinematics/ToyRoomIntroduction.js')).ToyRoomIntroduction;
   window.fairyRenderer=(await import('/src/js/entities/index.js')).fairyRenderer;
   window.phase=new Phase(c,null,null,null,{assets:game.assets,bindInputs:false});
   phase.introAlpha=0;phase.introBannerTimer=0;phase.render();base.getContext('2d').drawImage(c,0,0);
   window.intro=new Intro();intro.start({phase,departure:base,audio:null});
   window.opening=new Opening({storage:null});
  })()`);
  for(const [name,expression] of [
   ['abertura-narrador',`opening.time=16;opening.render(ctx,c,{assets:game.assets,drawRoom:()=>ctx.drawImage(base,0,0),lighting:game.lighting,fairyRenderer})`],
   ['abertura-nanda',`opening.time=22;opening.render(ctx,c,{assets:game.assets,drawRoom:()=>ctx.drawImage(base,0,0),lighting:game.lighting,fairyRenderer})`],
   ['castelo-narrador',`dialogue.renderCutsceneDialogue(ctx,c,{cutsceneActive:true,cutsceneStep:1,cutsceneTimer:90},{assets:game.assets})`],
   ['castelo-nanda',`dialogue.renderCutsceneDialogue(ctx,c,{cutsceneActive:true,cutsceneStep:1,cutsceneTimer:250},{assets:game.assets})`],
   ['castelo-menina',`dialogue.renderCutsceneDialogue(ctx,c,{cutsceneActive:true,cutsceneStep:2,cutsceneTimer:90},{assets:game.assets})`],
   ['porta-menina',`dialogue.renderCutsceneDialogue(ctx,c,{plotTwistActive:true,plotTwistStep:4,plotTwistTimer:90},{assets:game.assets})`],
   ['porta-narrador',`dialogue.renderCutsceneDialogue(ctx,c,{plotTwistActive:true,plotTwistStep:5,plotTwistTimer:90},{assets:game.assets})`],
   ['porta-nanda',`dialogue.renderCutsceneDialogue(ctx,c,{plotTwistActive:true,plotTwistStep:5,plotTwistTimer:220},{assets:game.assets})`],
   ['toy-room-menina',`intro.time=8;intro.render(ctx,c)`],
   ['toy-room-narrador',`intro.time=12.5;intro.render(ctx,c)`],
   ['toy-room-narrador-lugar',`intro.time=16;intro.render(ctx,c)`],
   ['toy-room-nanda',`intro.time=19;intro.render(ctx,c)`],
   ['conclusao',`phase.victoryBannerActive=true;phase.victoryBannerTimer=360;phase.render()`]
  ]) {
   const record=await evaluate(`(()=>{
    ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(base,0,0);
    const records=[],original=ctx.fillText;ctx.fillText=function(text,x,y,max){
     const m=this.measureText(text),w=max?Math.min(max,m.width):m.width;
     const left=this.textAlign==='center'?x-w/2:this.textAlign==='right'?x-w:x;
     records.push({text,left,right:left+w,y,font:this.font});return original.call(this,text,x,y,max);
    };try{${expression}}finally{ctx.fillText=original;}
    return {canvas:{width:c.width,height:c.height},records};
   })()`);
   assert(record.records.length>0,'Cena contém texto');
   for(const text of record.records){assert(text.left>=-1&&text.right<=record.canvas.width+1,profile+' '+name+' sem corte horizontal: '+text.text);assert(text.y>=0&&text.y<=record.canvas.height,profile+' '+name+' sem corte vertical');}
   results.push({profile,name,...record});await capture(profile+'-'+name);
  }
  const active=await evaluate(`(()=>{ctx.clearRect(0,0,c.width,c.height);const records=[],original=ctx.fillText;ctx.fillText=function(t,...args){records.push(t);return original.call(this,t,...args)};try{dialogue.renderCutsceneDialogue(ctx,c,{plotTwistActive:true,plotTwistStep:3},{});}finally{ctx.fillText=original;}return records;})()`);
  assert.deepEqual(active,[],'Nenhum narrador na queda ou gameplay');
 }
 assert.equal(exceptions.length,0);
 await fs.writeFile(out+'/navegador.json',JSON.stringify({results,exceptions,result:'aprovado'},null,2)+'\n');
 console.log('APROVADO: cinco cenas, três vozes, quatro formatos, texto sem corte e ausência durante movimento da porta.');
}finally{ws.close();await fetch(cdp+'/json/close/'+page.id).catch(()=>{});}
