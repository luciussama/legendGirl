// Ajuste do piloto em execução usando exclusivamente teclas reais, sem alterar o estado da campanha.
const pages=await(await fetch('http://127.0.0.1:9222/json')).json();const page=pages.find(p=>p.type==='page'&&p.url.includes('127.0.0.1'));
const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const calls=new Map();ws.onmessage=({data})=>{const m=JSON.parse(data);if(calls.has(m.id)){calls.get(m.id)(m.result);calls.delete(m.id)}};
const send=(method,params)=>new Promise(resolve=>{calls.set(++id,resolve);ws.send(JSON.stringify({id,method,params}))});
const evaluate=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true})).result.value;
const keys=new Set();
try{
 console.log('ANTES',await evaluate('JSON.stringify(game.state.toyRoomInstance.instance.player)'));
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowUp',code:'ArrowUp',windowsVirtualKeyCode:38});
 await new Promise(r=>setTimeout(r,45));
 await send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowUp',code:'ArrowUp',windowsVirtualKeyCode:38});
 await new Promise(r=>setTimeout(r,900));
 console.log('DEPOIS',await evaluate('JSON.stringify(game.state.toyRoomInstance.instance.player)'));
}finally{ws.close()}
