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
export function installDialogueAdvance(canvas,{enabled=()=>true,advance=()=>false,isModal=()=>true}={}){
 if(!canvas?.addEventListener)return()=>{};const f=flow(canvas);if(f.installed)return()=>{};f.installed=true;
 const down=e=>{if(e.target!==canvas||e.isPrimary===false||e.button>0||!enabled()||!f.current)return;
  const current=f.current;
  if(!isModal()&&current.bounds){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*canvas.width/r.width,y=(e.clientY-r.top)*canvas.height/r.height,b=current.bounds;if(x<b.left||x>b.right||y<b.top||y>b.bottom)return;}
  f.current=null;e.preventDefault?.();e.stopImmediatePropagation?.();
  if(!(current.onAdvance??advance)(e)){f.hidden=true;}
 };
 canvas.addEventListener('pointerdown',down,{capture:true,passive:false});
 return()=>{canvas.removeEventListener('pointerdown',down,true);f.installed=false;f.current=null;};
}
