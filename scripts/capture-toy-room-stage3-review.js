// Ampliações e matriz de transporte para revisão artística, sem alterar a fase.
import fs from 'node:fs/promises';
const output='docs/qa/toy-room-etapa3/altos';
const pages=await(await fetch('http://127.0.0.1:9223/json')).json();
let target;
for(const page of pages.filter(p=>p.type==='page')){
 const probe=new WebSocket(page.webSocketDebuggerUrl);await new Promise(r=>probe.onopen=r);
 const found=await new Promise(resolve=>{probe.onmessage=({data})=>resolve(JSON.parse(data).result?.result?.value);probe.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression:'typeof useBefore === "function"',returnByValue:true}}))});probe.close();if(found){target=page;break;}
}
if(!target)throw Error('Execute primeiro o teste dos grupos altos para preparar a bancada.');
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let seq=0;const pending=new Map();ws.onmessage=({data})=>{const m=JSON.parse(data);if(pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id)}};
const send=(method,params={})=>new Promise(r=>{const id=++seq;pending.set(id,r);ws.send(JSON.stringify({id,method,params}))});
const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
const save=async name=>fs.writeFile(`${output}/${name}.png`,Buffer.from(await ev('review.toDataURL().split(",")[1]'),'base64'));
try{
for(const before of [true,false]){
await ev(`(()=>{useBefore(${before});window.review=makeCanvas(1200,940);const ctx=review.getContext('2d');ctx.fillStyle='#bb8d58';ctx.fillRect(0,0,1200,940);initial.toys.forEach((toy,i)=>{const x=150+(i%4)*300,y=170+Math.floor(i/4)*450;ctx.fillStyle='#372413';ctx.font='16px Georgia';ctx.textAlign='center';ctx.fillText(toy.name,x,y-140);ctx.save();ctx.translate(x,y+10);ctx.scale(2.5,2.5);toyRenderer.renderToy(ctx,{...toy,x:0,y:0,isOrganized:false,isCarried:true},0,0,true,0,options);ctx.restore();ctx.font='13px Georgia';ctx.fillText('Escala de jogo',x,y+160);toyRenderer.renderToy(ctx,{...toy,x,y:y+210,isOrganized:false,isCarried:true},x,y+210,true,0,options)});return true})()`);await save(before?'colecao-antes':'colecao-depois');
}
await ev(`(()=>{useBefore(false);window.review=makeCanvas(1120,1080);const ctx=review.getContext('2d');ctx.fillStyle='#bb8d58';ctx.fillRect(0,0,1120,1080);initial.toys.forEach((toy,i)=>{['right','left'].forEach((facing,j)=>{[false,true].forEach((moving,k)=>{const x=140+(j*2+k)*280,y=85+i*130;ctx.fillStyle='#372413';ctx.font='13px Georgia';ctx.textAlign='center';ctx.fillText(({teddy:'Ursinho',train:'Trem',robot:'Robô',bunny:'Coelhinho',duck:'Patinho',blocks:'Blocos',drum:'Tambor',jack:'Caixa surpresa'})[toy.type]+' — '+(facing==='left'?'esquerda':'direita')+' / '+(moving?'movimento':'parada'),x,y-50);entities.renderPlayer(ctx,{...initial.player,x,y,facing,isMoving:moving,animTime:4.5,carriedItem:{...toy,isOrganized:false,isCarried:true}},options)})})});return true})()`);await save('transporte-32-estados');
for(const before of [true,false]){
await ev(`(()=>{useBefore(${before});window.review=makeCanvas(1050,430);const ctx=review.getContext('2d');ctx.fillStyle='#bb8d58';ctx.fillRect(0,0,1050,430);const types=['shelf','fortress','wardrobe'];types.forEach((type,i)=>{const f=initial.furniture.find(f=>f.type===type);ctx.fillStyle='#372413';ctx.font='18px Georgia';ctx.textAlign='center';ctx.fillText(['Estante e livros','Castelo e ameias','Armário e puxadores'][i],175+i*350,30);ctx.save();ctx.translate(175+i*350,110);ctx.scale(1.3,1.3);env.renderFurniture(ctx,{...f,x:-f.w/2,y:0},options);ctx.restore()});return true})()`);await save(before?'moveis-detalhes-antes':'moveis-detalhes-depois');
await ev(`(()=>{useBefore(${before});window.review=makeCanvas(700,280);const ctx=review.getContext('2d');ctx.fillStyle='#bb8d58';ctx.fillRect(0,0,700,280);ctx.fillStyle='#372413';ctx.font='16px Georgia';ctx.fillText('Fada — ampliação para inspeção',35,28);ctx.save();ctx.translate(180,145);ctx.scale(4,4);entities.renderFairy(ctx,{...initial.fairy,x:0,y:0},options);ctx.restore();ctx.fillText('Escala de jogo e composição atual',350,28);entities.renderPlayer(ctx,{...initial.player,x:430,y:160,carriedItem:null},options);entities.renderFairy(ctx,{...initial.fairy,x:454,y:128},options);return true})()`);await save(before?'fada-detalhes-antes':'fada-detalhes-depois');
}
await ev('useBefore(false)');
console.log('Coleção antes/depois e 32 estados de transporte registrados.');
}finally{ws.close()}
