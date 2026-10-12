
const results=[];const out=document.querySelector('#result');
const wait=()=>new Promise(r=>requestAnimationFrame(r));
addEventListener('error',event=>{out.textContent='FALHA: '+event.message;document.body.dataset.result='failed';});
addEventListener('unhandledrejection',event=>{out.textContent='FALHA: '+event.reason;document.body.dataset.result='failed';});
// Executa renderizadores reais em viewports isolados, incluindo barras móveis e notch.
for(const [width,height,device,insets] of [[390,744,'Android',[0,0,0,0]],[375,567,'Android',[0,0,0,0]],[667,325,'Android',[0,0,0,0]],[844,340,'Android',[0,0,0,0]],[960,540,'Desktop',[0,0,0,0]],[390,744,'iPhone',[47,0,34,0]],[844,340,'iPhone',[0,47,21,47]]]) {
 const f=document.createElement('iframe');f.width=width;f.height=height;document.querySelector('#frames').append(f);
 let html=await(await fetch('../index.html')).text();
 html=html.replace('<head>','<head><base href="/">');
 html=html.replace('<script type="module" src="src/js/main.js"></script>',`<script>Object.defineProperty(navigator,'userAgent',{configurable:true,value:'${device==='Desktop'?'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)':device==='iPhone'?'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile':'Mozilla/5.0 (Linux; Android 14) Mobile'}'});window.qaErrors=[];addEventListener('error',e=>qaErrors.push(e.message));<\/script><script type="module" src="src/js/main.js"><\/script>`);
 f.srcdoc=html;await new Promise(r=>f.onload=r);for(let attempt=0;!f.contentWindow.game;attempt++){if(attempt>600)throw Error('A inicialização do jogo excedeu o tempo de espera.');await wait();}
 const w=f.contentWindow,d=f.contentDocument,c=d.querySelector('canvas'),ctx=c.getContext('2d');
 const menu=[...d.querySelectorAll('.start-card button,.start-card select')].filter(e=>!e.hidden).map(e=>({id:e.id,top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom}));
 const controls=[];
 for(const selector of ['.start-card',' .gameover-card','#restart-campaign-dialog']) {
  const panel=d.querySelector(selector);
  if(selector.includes('gameover')){d.querySelector('#gameover-overlay').classList.remove('hidden');d.querySelector('#gameover-overlay').style.display='flex';}
  if(selector.includes('dialog'))panel.showModal();
  for(const e of panel.querySelectorAll('button,select'))if(!e.hidden){e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect();controls.push({id:e.id||e.textContent.trim(),reachable:r.top>=0&&r.bottom<=height&&r.left>=0&&r.right<=width});}
  if(selector.includes('dialog'))panel.close();
 }
 const {getDialogueSafeArea}=await w.eval("import('/src/js/ui/DialogueSafeArea.js')");
 if(device!=='Desktop')c.style.height=(height+100)+'px';w.dispatchEvent(new w.Event('resize'));await wait();
 getDialogueSafeArea(c);const probe=d.querySelector('[data-dialogue-safe-area]');if(probe)probe.style.padding=insets.map(v=>v+'px').join(' ');
 const calls=[];const original=ctx.fillText;ctx.fillText=function(text,x,y,...args){const m=this.measureText(text),t=this.getTransform();calls.push({text,left:t.a*(x-m.actualBoundingBoxLeft)+t.e,right:t.a*(x+m.actualBoundingBoxRight)+t.e,top:t.d*(y-m.actualBoundingBoxAscent)+t.f,bottom:t.d*(y+m.actualBoundingBoxDescent)+t.f,font:this.font});return original.call(this,text,x,y,...args)};
 const scenarios=[];
 const {DialogueRenderer}=await w.eval("import('/src/js/ui/DialogueRenderer.js')");const dialogue=new DialogueRenderer(w.game.assets);
 for(const state of [{isStandbyActive:true},{cutsceneActive:true,cutsceneStep:1},{cutsceneActive:true,cutsceneStep:2},...Array.from({length:6},(_,plotTwistStep)=>({plotTwistActive:true,plotTwistStep}))]){
 calls.length=0;dialogue.renderCutsceneDialogue(ctx,c,{...state,isPortrait:height>width,tick:60});const safe=getDialogueSafeArea(c);
 scenarios.push({state,calls:[...calls],outside:calls.filter(a=>a.left<safe.left-1||a.right>safe.right+1||a.top<safe.top-1||a.bottom>safe.bottom-safe.marginY+1)});
 }
 const {OpeningSequence,OPENING_DIALOGUE}=await w.eval("import('/src/js/cinematics/OpeningSequence.js')");
 const opening=new OpeningSequence({storage:null});
 for(const [start] of OPENING_DIALOGUE){opening.time=start+0.5;calls.length=0;opening.render(ctx,c,{assets:w.game.assets,drawRoom(){},lighting:{apply(){}},fairyRenderer:{render(){}}});const safe=getDialogueSafeArea(c);scenarios.push({state:'abertura '+start,calls:[...calls],outside:calls.filter(a=>a.left<safe.left-1||a.right>safe.right+1||a.top<safe.top-1||a.bottom>safe.bottom-safe.marginY+1)});}
 const {ToyRoomIntroduction}=await w.eval("import('/src/js/cinematics/ToyRoomIntroduction.js')");
 const intro=new ToyRoomIntroduction({});
 const register=(state)=>{const safe=getDialogueSafeArea(c);scenarios.push({state,calls:[...calls],outside:calls.filter(a=>a.left<safe.left-1||a.right>safe.right+1||a.top<safe.top-1||a.bottom>safe.bottom-safe.marginY+1)});};
 for(let time=0;time<23.3;time+=0.5){intro.time=time;if(intro.dialogue){calls.length=0;intro.drawDialogue(ctx,c,intro.dialogue);register('introdução '+time);}}
 const {ToyRoomPhase}=await w.eval("import('/src/js/toy-room/ToyRoomPhase.js')");
 const room=new ToyRoomPhase(c,null,null,null,{bindInputs:false});
 room.tutorial.active=true;
 for(const step of ['movement','pickup']){room.tutorial.step=step;calls.length=0;room.tutorial.render(ctx,c,{x:0,y:0,zoom:1});register('tutorial '+step);}
 room.story.state.investigationStage='INVESTIGATION';
 for(let time=0;time<2000;time+=30){room.story.state.investigationElapsed=time;calls.length=0;room.story.renderNarrative(ctx,c);if(calls.length)register('investigação '+time);}
 room.story.state.investigationStage='PICKUP';
 for(const time of [0,180]){room.story.state.swordPickupElapsed=time;calls.length=0;room.story.renderNarrative(ctx,c);register('espada '+time);}
 // Confere HUD, desenho e eventos reais após simular barras e recortes.
 w.dispatchEvent(new w.Event('orientationchange'));
 await wait();await wait();
 const {getMobileUILayout}=await w.eval("import('/src/js/ui/MobileUILayout.js')");
 const {toyRoomUI}=await w.eval("import('/src/js/toy-room/ToyRoomUI.js')");
 const {hudRenderer}=await w.eval("import('/src/js/ui/HudRenderer.js')");
 const layout=getMobileUILayout(c);
 const safeControl=(element)=>{const r=element.getBoundingClientRect();const cr=c.getBoundingClientRect();const sx=c.width/cr.width,sy=c.height/cr.height;return (r.left-cr.left)*sx>=layout.safeLeft-1&&(r.right-cr.left)*sx<=layout.safeRight+1&&(r.top-cr.top)*sy>=layout.safeTop-1&&(r.bottom-cr.top)*sy<=layout.safeBottom+1;};
 for(const element of d.querySelectorAll('.top-controls-bar button'))if(element.getBoundingClientRect().width)
   controls.push({id:element.id+' com barras/recorte',reachable:safeControl(element)});
 calls.length=0;toyRoomUI.renderUI(ctx,c,{player:room.player,introBannerTimer:10,canInteract:true});register('HUD da sala');
 calls.length=0;hudRenderer.renderEscapeBanner(ctx,c,{isEscapeMode:true,escapeBannerTimer:10,escapeBannerText:'Um novo salto para encontrar o caminho.'});register('HUD da fuga');
 calls.length=0;hudRenderer.renderEscapeBanner(ctx,c,{isPhase3:true,phase3Level:14});register('HUD do retorno');
 ctx.fillText=original;
 const {runToyRoomQA}=await w.eval("import('/tests/toy-room-qa-runner.js')");
 const playRoom=new ToyRoomPhase(c,null,null,null,{assets:w.game.assets,bindInputs:false,gameDifficulty:'EASY'});
 const playthrough=runToyRoomQA(playRoom,{draw:true});
 controls.push({id:'percurso completo da Toy Room: '+playthrough.collections+' coletas e '+playthrough.reloads+' restores',reachable:playthrough.result==='aprovado'});
 room.story.state.investigationStage='COLLECTING';
 const cr=c.getBoundingClientRect();let actions=0;room.triggerAction=()=>actions++;
 room.onPointerDown({pointerType:'touch',pointerId:1,clientX:cr.left+layout.action.x*cr.width/c.width,clientY:cr.top+layout.action.y*cr.height/c.height});
 controls.push({id:'botão de ação: desenho e toque',reachable:actions===1});
 room.setupListeners();
 for(const [rw,rh] of [[390,744],[844,340],[390,744],[844,340]]){
   f.width=rw;f.height=rh;c.style.height=(rh+100)+'px';
   w.dispatchEvent(new w.Event('resize'));w.dispatchEvent(new w.Event('orientationchange'));
   await wait();await wait();
   const rotated=getMobileUILayout(c),rr=c.getBoundingClientRect();
   const touch=(x,y)=>({pointerType:'touch',pointerId:7,clientX:rr.left+x*rr.width/c.width,clientY:rr.top+y*rr.height/c.height});
   room.onPointerDown(touch(rotated.safeLeft+1,rotated.safeBottom-1));
   w.dispatchEvent(new w.Event('orientationchange'));
   controls.push({id:'gesto encerrado ao girar '+rw,reachable:!room.touchState.active});
   const before=actions;room.onPointerDown(touch(rotated.action.x,rotated.action.y));
   controls.push({id:'toque alinhado após girar '+rw,reachable:actions===before+1});
 }
 room.destroy();
 ctx.fillText=original;
 results.push({width,height,device,menu,controls,scenarios,errors:w.qaErrors});
 out.textContent=JSON.stringify(results,null,2);
}
window.auditResults=results;out.textContent='CONCLUÍDO\n'+JSON.stringify(results.map(r=>({device:r.device,width:r.width,height:r.height,controles:r.controls.filter(c=>!c.reachable),fora:r.scenarios.filter(s=>s.outside.length).map(s=>({state:s.state,outside:s.outside})),errors:r.errors})),null,2);

for(const r of results){const p=document.createElement('p');p.textContent=JSON.stringify({tela:[r.device,r.width,r.height],controles:r.controls.filter(c=>!c.reachable),fora:r.scenarios.filter(s=>s.outside.length).map(s=>({state:s.state,textos:s.outside.map(c=>c.text)})),errors:r.errors});out.after(p)}

document.body.dataset.result=results.every(r=>r.controls.every(c=>c.reachable)&&r.scenarios.every(s=>s.outside.length===0)&&r.errors.length===0)?'passed':'failed';

const status=document.createElement('p');status.textContent=(document.body.dataset.result==='passed'?'APROVADO':'FALHA')+': '+results.length+' perfis; '+results.reduce((n,r)=>n+r.scenarios.length,0)+' amostras de legendas; menus de início, derrota e reinício.';out.before(status);
