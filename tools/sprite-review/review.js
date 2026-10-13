import {platforms,roomScenery} from '../../src/js/config.js';
import {PlatformRenderer} from '../../src/js/environment/PlatformRenderer.js';
import {BackgroundRenderer} from '../../src/js/environment/BackgroundRenderer.js';
import {dialogueRenderer} from '../../src/js/ui/DialogueRenderer.js';
import {toyRenderer} from '../../src/js/toy-room/ToyRenderer.js';
import {roomEnvironmentRenderer} from '../../src/js/toy-room/RoomEnvironmentRenderer.js';
import {toyRoomEntities} from '../../src/js/toy-room/ToyRoomEntities.js';
import {fairyRenderer} from '../../src/js/entities/FairyRenderer.js';
const root=new URL('../../',import.meta.url),endpoint=p=>new URL('api/sprite-review/'+p,root);
const $=id=>document.getElementById(id);
const usageNames={runtime:'Referência no jogo',preload:'Manifesto/preload',apoio:'Ferramentas/QA','nao-localizado':'Referência não localizada'};
const kindNames={file:'Imagem inteira',region:'Recorte individual',code:'Desenho por código'};
const cacheKey='legendGirl.spriteReview.choices.v1';
let catalog,decisions={},revision=0,page=0,dirty=false,saving=false,timer,savedDocument;
const PAGE_SIZE=36;
function status(text,error=false){$('save-status').textContent=text;$('save-status').dataset.error=String(error);}
const el=(tag,text,cls)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;};
function summary(){
 const values=catalog.items.map(i=>decisions[i.id]||'pending'),old=values.filter(v=>v==='old').length,current=values.filter(v=>v==='current').length;
 $('counts').textContent=catalog.counts.files+' imagens · '+catalog.counts.regions+' recortes · '+catalog.counts.code+' desenhos · '+old+' antigas · '+current+' atuais · '+(values.length-old-current)+' pendentes';
}
function filtered(){const query=$('search').value.toLocaleLowerCase('pt-BR');return catalog.items.filter(i=>
 ($('kind').value==='all'||i.kind===$('kind').value)&&($('classification').value==='all'||(decisions[i.id]||'pending')===$('classification').value)&&($('usage').value==='all'||i.usage===$('usage').value)
 &&(!query||(i.path+' '+i.title+' '+i.aliases?.join(' ')+' '+i.references.map(r=>r.file).join(' ')).toLocaleLowerCase('pt-BR').includes(query)));}
function procedural(item){
 const canvas=el('canvas');canvas.width=320;canvas.height=240;const ctx=canvas.getContext('2d'),s=item.signature;
 if(s.preview==='platform'){
  const p=platforms.find(p=>p.style===s.variant),scale=Math.min(260/(p.w+100),180/(Math.max(p.h,474-p.y)+80));
  ctx.translate(160-(70+p.w/2)*scale,20-p.y*scale);ctx.scale(scale,scale);
  new PlatformRenderer().renderPlatforms(ctx,{width:320,height:480},p.x-70,{platforms:[p],baby:{},tick:0});
 }else if(s.preview==='scenery'){
  const item=roomScenery.find(p=>p.type===s.variant);ctx.translate(90,-190);ctx.scale(.85,.85);
  new BackgroundRenderer().renderScenery(ctx,{width:320,height:480},[item],item.x-80,{});
 }else if(s.preview==='portrait'){
  const [type,mood]=s.variant.split(':');dialogueRenderer.drawPortrait(ctx,type,160,120,78,mood,0,{});
 }else if(s.preview==='toy'){ctx.translate(160,125);ctx.scale(2.4,2.4);toyRenderer.renderToy(ctx,{type:s.variant,x:0,y:0,w:42,h:46,isOrganized:false,isCarried:false},1000,1000,false,0,{});}
 else if(s.preview==='furniture'){ctx.translate(40,70);ctx.scale(.95,.95);roomEnvironmentRenderer.renderFurniture(ctx,{type:s.variant,x:0,y:0,w:190,h:115,lidOpen:0,glowAlpha:0},{});}
 else if(s.preview==='toy-fairy'){ctx.translate(160,120);ctx.scale(2.5,2.5);toyRoomEntities.renderFairy(ctx,{x:0,y:0,flutterTime:0},{});}
 else if(s.preview==='room-background'){ctx.scale(.2,.2);roomEnvironmentRenderer.renderBackground(ctx,1600,1200,{});}
 else {ctx.translate(160,120);ctx.scale(2,2);fairyRenderer.render(ctx,{x:0,y:0,floatAngle:0,wingAngle:0,particles:[]},{tick:0},0,{canvasWidth:320});}
 return canvas;
}
function visual(item){
 if(item.kind==='code'){try{return procedural(item);}catch(error){const n=el('p','Prévia indisponível: '+error.message);n.dataset.previewError='true';return n;}}
 if(item.kind==='region'){
  const c=el('canvas');c.width=item.region.width;c.height=item.region.height;const image=new Image();
  image.onload=()=>c.getContext('2d').drawImage(image,item.region.x,item.region.y,item.region.width,item.region.height,0,0,c.width,c.height);
  image.onerror=()=>{c.dataset.previewError='true';c.title='Não foi possível carregar a prancha.';};image.src=new URL(item.path,root);return c;
 }
 const image=el('img');image.alt=item.title;image.loading='lazy';image.src=new URL(item.path,root);image.onerror=()=>{image.dataset.previewError='true';image.alt='Imagem ausente: '+item.path;};return image;
}
function openPreview(item){$('preview-title').textContent=item.title;$('preview-path').textContent=item.path;$('preview-image').replaceChildren(visual(item));$('preview').showModal();}
function select(id,value,card){
 decisions[id]=value;dirty=true;card.dataset.choice=value;
 localStorage.setItem(cacheKey,JSON.stringify({catalogVersion:catalog.version,decisions}));
 summary();status('Salvando escolhas…');clearTimeout(timer);timer=setTimeout(save,250);
 // Mantém a imagem sob o cursor até o usuário navegar novamente.
}
async function save(){
 if(saving||!dirty)return;saving=true;
 while(dirty){
  dirty=false;const snapshot={...decisions};
  try{const response=await fetch(endpoint('selections'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({catalogVersion:catalog.version,revision,decisions:snapshot})});
   const data=await response.json();if(!response.ok)throw Error(data.error||'Falha ao salvar.');
   revision=data.revision;savedDocument=data;status('Salvo automaticamente em docs/sprite-review/selecoes-exclusao.json');
   localStorage.removeItem(cacheKey);
  }catch(error){dirty=true;status(error.message+' As escolhas continuam neste navegador; use Baixar JSON.',true);break;}
 }
 saving=false;
}
function card(item){
 const box=el('article',undefined,'card');box.dataset.id=item.id;box.dataset.choice=decisions[item.id]||'pending';
 const image=el('div',undefined,'image');image.append(visual(item));image.tabIndex=0;image.setAttribute('role','button');image.setAttribute('aria-label','Ampliar '+item.title);image.onclick=()=>openPreview(item);image.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPreview(item);}};
 const body=el('div',undefined,'body');body.append(el('h2',item.title),el('p',item.path,'path'));
 const tags=el('div',undefined,'tags');for(const tag of [kindNames[item.kind],usageNames[item.usage],item.width&&item.height?item.width+' × '+item.height:null])if(tag)tags.append(el('span',tag,'tag'));body.append(tags);
 if(item.hints.length)body.append(el('p',item.hints.join(' '),'hints'));
 const choices=el('fieldset');choices.append(el('legend','Esta imagem é antiga?'));
 for(const [value,label]of [['old','Antiga — excluir'],['current','Atual — manter'],['pending','Não analisada']]){
  const row=el('label'),input=el('input');input.type='radio';input.name='choice-'+item.id;input.value=value;input.checked=(decisions[item.id]||'pending')===value;input.onchange=()=>select(item.id,value,box);row.append(input,document.createTextNode(label));choices.append(row);
 }body.append(choices);
 const details=el('details');details.append(el('summary',item.references.length+' referências encontradas'));const list=el('ul');
 for(const ref of item.references){const row=el('li');const link=el('a',ref.file+':'+ref.line);link.href=new URL(ref.file,root);link.target='_blank';link.rel='noopener';row.append(link,document.createTextNode(' · '+ref.type+(ref.alias?' · '+ref.alias:'')));list.append(row);}details.append(list);body.append(details);box.append(image,body);return box;
}
function render(){const items=filtered(),pages=Math.max(1,Math.ceil(items.length/PAGE_SIZE));page=Math.min(page,pages-1);
 $('grid').replaceChildren(...items.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE).map(card));$('page').textContent='Página '+(page+1)+' de '+pages+' · '+items.length+' recursos';$('previous').disabled=page===0;$('next').disabled=page===pages-1;$('empty').hidden=items.length!==0;summary();
}
function exportDocument(){
 const selected=catalog.items.filter(i=>decisions[i.id]==='old');
 return {schemaVersion:1,catalogVersion:catalog.version,revision,updatedAt:new Date().toISOString(),decisions:{...decisions},
  selectedForDeletion:selected.filter(i=>i.kind==='file').map(i=>({id:i.id,path:i.path,sha256:i.sha256,usage:i.usage,references:i.references})),
  selectedRegions:selected.filter(i=>i.kind==='region').map(i=>({id:i.id,path:i.path,sha256:i.sha256,region:i.region,action:'recompor-prancha'})),
  selectedCode:selected.filter(i=>i.kind==='code').map(i=>({id:i.id,path:i.path,sha256:i.sha256,signature:i.signature,action:'remover-desenho-especifico'}))};
}
$('download').onclick=async()=>{await save();const blob=new Blob([JSON.stringify(exportDocument(),null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='selecoes-exclusao.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('selected').onclick=()=>{$('classification').value='old';page=0;render();};
for(const id of ['search','kind','classification','usage'])$(id).addEventListener(id==='search'?'input':'change',()=>{page=0;render();});
$('background').onchange=()=>{document.body.dataset.background=$('background').value;};
$('previous').onclick=()=>{page--;render();window.scrollTo(0,0);};$('next').onclick=()=>{page++;render();window.scrollTo(0,0);};$('close-preview').onclick=()=>$('preview').close();
window.addEventListener('beforeunload',e=>{if(dirty||saving){e.preventDefault();e.returnValue='';}});
try{
 const response=await fetch(endpoint('catalog'));if(!response.ok)throw Error('Gere o catálogo e inicie o servidor local para abrir a revisão.');catalog=await response.json();
 const saved=await fetch(endpoint('selections')).then(r=>r.json());revision=saved.revision||0;decisions=Object.fromEntries(Object.entries(saved.decisions||{}).filter(([id])=>catalog.items.some(i=>i.id===id)));savedDocument=saved;
 const cached=JSON.parse(localStorage.getItem(cacheKey)||'null');if(cached?.catalogVersion===catalog.version){decisions={...decisions,...cached.decisions};dirty=true;status('Recuperando escolhas ainda não gravadas…');await save();}
 else status('As escolhas serão salvas automaticamente no projeto.');
 catalog.items.sort((a,b)=>(b.hints.length-a.hints.length)||a.path.localeCompare(b.path));render();document.body.dataset.ready='true';
 window.spriteReview={catalog,get decisions(){return decisions;},save,exportDocument,render,procedural};
}catch(error){status(error.message,true);}
