// Ajuste do piloto em execução usando exclusivamente teclas reais, sem alterar o estado da campanha.
const pages=await(await fetch('http://127.0.0.1:9222/json')).json();const page=pages.find(p=>p.type==='page'&&p.url.includes('127.0.0.1'));
const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const calls=new Map();ws.onmessage=({data})=>{const m=JSON.parse(data);if(calls.has(m.id)){calls.get(m.id)(m.result);calls.delete(m.id)}};
const send=(method,params)=>new Promise(resolve=>{calls.set(++id,resolve);ws.send(JSON.stringify({id,method,params}))});
const evaluate=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true})).result.value;
const keys=new Set();
try{
 const before=await evaluate(`(()=>{const r=game.state.toyRoomInstance.instance;return {player:{x:r.player.x,y:r.player.y},sword:r.story.state.sword,stage:r.story.state.investigationStage}})()`);console.log('ANTES',JSON.stringify(before));
 for(let n=0;n<60;n++){
  const r=await evaluate(`(()=>{const r=game.state.toyRoomInstance.instance;return {x:r.player.x,y:r.player.y,target:r.story.state.sword,stage:r.story.state.investigationStage}})()`);if(r.stage!=='SEEKING_SWORD')break;
  const dx=r.target.x-r.x,dy=r.target.y-r.y;if(Math.hypot(dx,dy)<30)break;
  const code=Math.abs(dx)>Math.abs(dy)?dx>0?'ArrowRight':'ArrowLeft':dy>0?'ArrowDown':'ArrowUp';
  if(!keys.has(code)){for(const k of keys)await send('Input.dispatchKeyEvent',{type:'keyUp',key:k,code:k});keys.clear();await send('Input.dispatchKeyEvent',{type:'keyDown',key:code,code});keys.add(code)}
  await new Promise(r=>setTimeout(r,25));
 }
 console.log('DEPOIS',await evaluate('game.state.toyRoomInstance.instance.story.state.investigationStage'));
}finally{for(const code of keys)await send('Input.dispatchKeyEvent',{type:'keyUp',key:code,code});ws.close()}
