import * as T from '/src/vendor/three/three.module.js';
import { PICTORIAL_ATLASES } from '/src/js/bear-chase/props/PictorialMaterialAssets.js';
import { ToyChestProp } from '/src/js/bear-chase/props/ToyChestProp.js';
import { ChasePropCatalog } from '/src/js/bear-chase/props/ChasePropCatalog.js';
import { ChaseRenderer3D } from '/src/js/bear-chase/ChaseRenderer3D.js';
import { createChaseState } from '/src/js/bear-chase/ChaseSimulation.js';
/** Carrega a fonte exata e apresenta falha explícita caso ela não esteja disponível. */
function loadImage(path) { return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Fonte ausente: '+path));i.src=path;}); }
const [sheet,wood,blocks,bunny,shelf,fortress,chest,...atlases]=await Promise.all([loadImage('/assets/art/toy-room/environment-sheet.png'),loadImage('/assets/art/toy-room/stage3/oak-cabinet-v1.png'),loadImage('/assets/art/toy-room/stage3/stacking-blocks-v1.png'),loadImage('/assets/art/toy-room/stage3/cotton-bunny-v1.png'),loadImage('/assets/art/toy-room/stage3/bookshelf-v1.png'),loadImage('/assets/art/toy-room/stage3/block-castle-v1.png'),loadImage('/assets/art/toy-room/chest-brinquedos-v1.png'),...Object.values(PICTORIAL_ATLASES).map(({path})=>loadImage('/assets/art/'+path))]);
const materialImages=Object.fromEntries(Object.values(PICTORIAL_ATLASES).map(({key},i)=>[key,atlases[i]]));
const extras={};
for(const [id,file] of Object.entries({robot:'retro-robot',duck:'royal-duck',drum:'enchanted-drum',jack:'fairy-jack-box',armchair:'armchair','rocking-horse':'rocking-horse'}))extras[id]=await loadImage('/assets/art/toy-room/stage3/'+file+'-v1.png');
const catalog=new ChasePropCatalog({cabinet:wood,bunny,armchair:extras.armchair,...materialImages}),resources=catalog.resources;
const prototypes=Object.fromEntries(['train','cabinet','blocks','bunny','shelf','fortress','chest','teddy','robot','duck','drum','jack','armchair','rocking-horse','table'].map(id=>[id,{
 /** Usa exatamente a mesma fábrica e escala da prévia jogável. */
 create(){return catalog.create(id==='cabinet'?'wardrobe':id);}
}]));
const presentation={train:{size:[1.07,.60],source:sheet,crop:[689,76,116,88],target:.27,height:54},
 cabinet:{size:[2.05,1.20],source:wood,target:.60,height:83},
 blocks:{size:[.67,1.05],source:blocks,target:.525,height:73},
 bunny:{size:[.65,1.06],source:bunny,target:.53,height:74},
 shelf:{size:[2.43,1.07],source:shelf,target:.53,height:64},
 fortress:{size:[2.29,1.895],source:fortress,target:.94,height:93},
 chest:{size:[1.94,1.33],source:chest,target:.665,height:80}};
for(const id of ['teddy','robot','duck','drum','jack','armchair','rocking-horse','table']){
 const entry=catalog.entries.get(id),height=entry.visualBounds.max[1];
 presentation[id]={size:[entry.visualBounds.max[0]-entry.visualBounds.min[0],height],source:extras[id]||sheet,target:height/2,height:height*70,
 ...(id==='teddy'?{crop:[424,44,86,120]}:id==='table'?{crop:[548,44,137,119]}:{})};
}
const scene=new T.Scene();scene.background=new T.Color('#e9dfd0');
scene.add(new T.HemisphereLight('#ffffff','#b3a19b',1.5));
const key=new T.DirectionalLight('#ffffff',2.1);key.position.set(-3,6,4);scene.add(key);
const fill=new T.DirectionalLight('#ffffff',.6);fill.position.set(3,2,-3);scene.add(fill);
const neutral=new T.WebGLRenderer({canvas:document.querySelector('#neutral'),antialias:true});neutral.setSize(540,340,false);
const camera=new T.PerspectiveCamera(57,540/340,.1,40);
const ref=new ChaseRenderer3D(),room=new ChaseRenderer3D();await Promise.all([ref.load(),room.load()]);
/** Retira apenas o fundo externo escuro conectado às bordas; preserva contornos coloridos internos. */
function trainCutout(){
 const c=document.createElement('canvas');c.width=116;c.height=88;const x=c.getContext('2d');x.drawImage(sheet,689,76,116,88,0,0,116,88);
 const image=x.getImageData(0,0,116,88),seen=new Uint8Array(116*88),queue=[];
 for(let i=0;i<116*88;i++)if(i<116||i>=116*87||i%116===0||i%116===115)queue.push(i);
 while(queue.length){const i=queue.pop();if(seen[i])continue;seen[i]=1;const p=i*4,r=image.data[p],g=image.data[p+1],b=image.data[p+2];
  if(Math.max(r,g,b)>32||Math.max(r,g,b)-Math.min(r,g,b)>12)continue;
  image.data[p+3]=0;const col=i%116;if(col>0)queue.push(i-1);if(col<115)queue.push(i+1);if(i>=116)queue.push(i-116);if(i<116*87)queue.push(i+116);
 }x.putImageData(image,0,0);return c;
}
const sourceTextures={train:ref.texture(trainCutout()),cabinet:ref.texture(wood),blocks:ref.texture(blocks),bunny:ref.texture(bunny),shelf:ref.texture(shelf),fortress:ref.texture(fortress),chest:ref.texture(chest)};
for(const id of ['teddy','robot','duck','drum','jack','armchair','rocking-horse','table'])sourceTextures[id]=ref.texture(presentation[id].source,presentation[id].crop?Object.fromEntries(['x','y','w','h'].map((key,i)=>[key,presentation[id].crop[i]])):null);
const state=createChaseState();Object.assign(state,{stage:'RUNNING',distance:180,gap:26,time:25,age:25,x:0});
const source=document.querySelector('#source'),ctx=source.getContext('2d');
let selected=null,model,roomModel,reference,spinning=false,spin=0,launchAt=null,disposed=false,lidOpen=false;
/** Troca só as instâncias da comparação, conservando todos os recursos compartilhados. */
function select(id){
  if(!prototypes[id]){document.querySelector('#prop').value='train';return;}
  scene.remove(model);room.scene.remove(roomModel);
  if(reference){ref.scene.remove(reference);reference.geometry.dispose();reference.material.dispose();ref.resources.delete(reference.geometry);ref.resources.delete(reference.material);}
  selected=id;model=prototypes[id].create();scene.add(model);roomModel=prototypes[id].create();room.scene.add(roomModel);
  const size=presentation[id].size;
  reference=ref.actor(sourceTextures[id],...size);
  reference.position.set(0,size[1]/2,-2.5);
}
/** Compõe as duas condições de luz e a trajetória visual sem tocar na simulação de jogo. */
function draw(time){
  if(disposed)return;
  const id=document.querySelector('#prop').value;if(selected!==id)select(id);
  const zoom=Number(document.querySelector('#zoom').value),angle=document.querySelector('#angle').value;
  if(spinning)spin+=.012;
  state.distance=Number(document.querySelector('#distance').value);
  const decorative=['cabinet','shelf','fortress','chest','armchair','rocking-horse','table'].includes(id);
  model.rotation.y=spin;roomModel.rotation.y=decorative?-Math.PI/2:0;
  if(id==='chest'){ToyChestProp.setOpening(model,lidOpen?1:0);ToyChestProp.setOpening(roomModel,lidOpen?1:0);}
  const target=presentation[id].target;
  const views={three:[2.6,id==='chest'?2.6:1.7,3.6],front:[0,1,4.5],side:[4.5,1,0],back:[0,1,-4.5]};
  if(id==='rocking-horse')views.three=[-1.7,1.7,4.4];
  if(id==='table')views.three=[2.6,2.7,3.6];
  const v=views[angle],distance=decorative?1.35:1;camera.position.set(v[0]*distance/zoom,target+(v[1]-target)*distance/zoom,v[2]*distance/zoom);camera.lookAt(0,target,0);neutral.render(scene,camera);
  ctx.fillStyle='#e9dfd0';ctx.fillRect(0,0,540,340);
  const info=presentation[id],height=info.height*zoom,width=height*(info.crop?info.crop[2]/info.crop[3]:info.source.width/info.source.height);
  if(info.crop)ctx.drawImage(sheet,...info.crop,270-width/2,170-height/2,width,height);
  else ctx.drawImage(info.source,270-width/2,170-height/2,width,height);
  const t=launchAt===null?1:Math.min(1,(time-launchAt)/650),y=(1-t)*1.2+Math.sin(t*Math.PI)*1.4,z=-2.5-(1-t)*5,x=decorative?(id==='chest'?4.74:4.95):1.45;
  if(t===1)launchAt=null;
  room.render(document.querySelector('#modelRoom').getContext('2d'),document.querySelector('#modelRoom'),state);
  ref.render(document.querySelector('#referenceRoom').getContext('2d'),document.querySelector('#referenceRoom'),state);
  roomModel.position.set(x,id==='train'?y:0,z);reference.position.set(x,presentation[id].size[1]/2+(id==='train'?y:0),z);
  reference.rotation.y=decorative?-Math.PI/2:0;
  room.placeOnRoute(roomModel,state.distance-z,x,id==='train'?y:0);
  ref.placeOnRoute(reference,state.distance-z,x,presentation[id].size[1]/2+(id==='train'?y:0));
  room.renderer.render(room.scene,room.camera);ref.renderer.render(ref.scene,ref.camera);
  document.querySelector('#modelRoom').getContext('2d').drawImage(room.renderer.domElement,0,0,540,340);
  document.querySelector('#referenceRoom').getContext('2d').drawImage(ref.renderer.domElement,0,0,540,340);
  requestAnimationFrame(draw);
}
document.querySelector('#rotate').onclick=()=>{spinning=!spinning;document.querySelector('#rotate').textContent=spinning?'Parar giro':'Girar';};
document.querySelector('#lid').onclick=()=>{document.querySelector('#prop').value='chest';lidOpen=!lidOpen;document.querySelector('#lid').textContent=lidOpen?'Fechar tampa do baú':'Abrir tampa do baú';};
document.querySelector('#launch').onclick=()=>{document.querySelector('#prop').value='train';launchAt=performance.now();};
select('train');window.propsReview={resources,prototypes,scene,camera,presentation,room,ref,state,select,/** Expõe a instância neutra para inspeção da prova. */ get model(){return model;},/** Expõe a instância do quarto para verificação de apoio. */ get roomModel(){return roomModel;},dispose};
document.querySelector('#status').textContent='Quinze modelos 3D · percurso contínuo com curvas e morros · use o controle de distância para acompanhar a sala.';requestAnimationFrame(draw);
/** Destrói as cenas e o proprietário comum; instâncias não descartam recursos compartilhados. */
function dispose(){if(disposed)return;disposed=true;ref.destroy();room.destroy();catalog.dispose();neutral.dispose();neutral.forceContextLoss();}
window.addEventListener('pagehide',dispose,{once:true});
