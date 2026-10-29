/** Entrada única de leitura: um toque avança um balão e nunca vira ação de gameplay. */
const flows=new WeakMap();
function flow(canvas){let f=flows.get(canvas);if(!f){f={depth:0,current:null,key:null,seen:false,hidden:false};flows.set(canvas,f);}return f;}
export function beginDialogueFrame(canvas){const f=flow(canvas);if(f.depth++===0){if(!f.seen){f.key=null;f.hidden=false;}f.current=null;f.seen=false;}}
export function endDialogueFrame(canvas){const f=flow(canvas);f.depth=Math.max(0,f.depth-1);}
/** Medições em canvases virtuais não registram entrada nem alteram a leitura. */
export function offerDialogue(canvas,text,onAdvance){
 if(!canvas?.addEventListener)return true;
 const f=flow(canvas);if(f.key!==text){f.key=text;f.hidden=false;}f.seen=true;
 if(f.hidden)return false;f.current={text,onAdvance};return true;
}
/** Limites em pixels do canvas, incluindo transformações de apresentação. */
export function setDialogueBounds(canvas,ctx,x,y,w,h){
 const f=flows.get(canvas);if(!f?.current)return;
 const m=ctx.getTransform?.()??{a:1,b:0,c:0,d:1,e:0,f:0},points=[[x,y],[x+w,y],[x,y+h],[x+w,y+h]].map(([x,y])=>({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f}));
 f.current.bounds={left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y))};
}
export function getDialogueBounds(canvas){return flows.get(canvas)?.current?.bounds??null;}
export function isDialogueModal(canvas){return Boolean(flows.get(canvas)?.isModal?.());}
export function installDialogueAdvance(canvas,{enabled=()=>true,advance=()=>false,isModal=()=>true}={}){
 if(!canvas?.addEventListener)return()=>{};const f=flow(canvas);if(f.installed)return()=>{};f.installed=true;
 f.isModal=isModal;
 const pointers=new Set(),keys=new Set();let suppressClick=false;
 const consume=e=>{e.preventDefault?.();e.stopImmediatePropagation?.();};
 const down=e=>{
  if(e.target!==canvas||e.isPrimary===false||e.button>0)return;
  if(pointers.has(e.pointerId)){consume(e);return;}
  suppressClick=false;if(!enabled()||!f.current)return;
  const current=f.current;
  if(!isModal()&&current.bounds){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*canvas.width/r.width,y=(e.clientY-r.top)*canvas.height/r.height,b=current.bounds;if(x<b.left||x>b.right||y<b.top||y>b.bottom)return;}
  pointers.add(e.pointerId);suppressClick=true;f.current=null;consume(e);
  if(!(current.onAdvance??advance)(e))f.hidden=true;
 };
 const release=e=>{if(pointers.delete(e.pointerId))consume(e);};
 const click=e=>{if(suppressClick){suppressClick=false;consume(e);}};
 const keydown=e=>{
  if(e.code!=='Enter'||e.target?.closest?.('button,input,textarea,select,[contenteditable="true"]'))return;
  if(keys.has(e.code)){consume(e);return;}
  if(!enabled()||!isModal()||!f.current)return;
  consume(e);if(e.repeat)return;keys.add(e.code);
  const current=f.current;f.current=null;if(!(current.onAdvance??advance)(e))f.hidden=true;
 };
 const keyup=e=>{if(keys.delete(e.code))consume(e);};
 const blur=()=>{pointers.clear();keys.clear();suppressClick=false;};
 canvas.addEventListener('pointerdown',down,{capture:true,passive:false});
 canvas.addEventListener('pointerup',release,{capture:true,passive:false});
 canvas.addEventListener('pointercancel',release,{capture:true,passive:false});
 canvas.addEventListener('click',click,true);
 if(typeof window!=='undefined'){window.addEventListener('keydown',keydown,true);window.addEventListener('keyup',keyup,true);window.addEventListener('pointerup',release,true);window.addEventListener('pointercancel',release,true);window.addEventListener('blur',blur);}
 return()=>{
  canvas.removeEventListener('pointerdown',down,true);canvas.removeEventListener('pointerup',release,true);canvas.removeEventListener('pointercancel',release,true);canvas.removeEventListener('click',click,true);
  if(typeof window!=='undefined'){window.removeEventListener('keydown',keydown,true);window.removeEventListener('keyup',keyup,true);window.removeEventListener('pointerup',release,true);window.removeEventListener('pointercancel',release,true);window.removeEventListener('blur',blur);}
  blur();f.installed=false;f.current=null;f.isModal=null;
 };
}
