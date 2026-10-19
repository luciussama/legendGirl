import * as T from '/src/vendor/three/three.module.js';
import { ChaseRenderer3D } from '/src/js/bear-chase/ChaseRenderer3D.js';
import { ChaseGirlModel } from '/src/js/bear-chase/ChaseGirlModel.js';
import { ChaseGirlAnimation } from '/src/js/bear-chase/ChaseGirlAnimation.js';
import { createChaseState } from '/src/js/bear-chase/ChaseSimulation.js';
const resources=new Set(),scene=new T.Scene();scene.background=new T.Color('#e9dfd0');
const model=new ChaseGirlModel(r=>{resources.add(r);return r;});scene.add(model.root);
scene.add(new T.HemisphereLight('#ffffff','#b3a19b',1.8));
const light=new T.DirectionalLight('#ffffff',2.4);light.position.set(-3,6,-4);scene.add(light);
const fill=new T.DirectionalLight('#ffffff',.8);fill.position.set(3,3,5);scene.add(fill);
const renderer=new T.WebGLRenderer({canvas:document.querySelector('#neutral'),antialias:true});renderer.setSize(540,340,false);
const camera=new T.PerspectiveCamera(57,540/340,.1,30),animator=new ChaseGirlAnimation(model);
const sourceCanvas=document.querySelector('#sources'),sourceCtx=sourceCanvas.getContext('2d');
const refCanvas=document.querySelector('#referenceRoom'),modelCanvas=document.querySelector('#modelRoom');
const ref=new ChaseRenderer3D(),room=new ChaseRenderer3D();
/** Carrega uma fonte atual sem modificar seu arquivo nem sua transparência. */
function image(path){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=path;});}
const [sheet,official]=await Promise.all([image('/assets/art/toy-room/battle/girl/animation-v2/run-sheet.png'),image('/assets/art/dark-room/sprites/official-character.png'),ref.load(),room.load()]);
const crop=document.createElement('canvas');crop.width=580;crop.height=550;crop.getContext('2d').drawImage(sheet,70,35,580,550,0,0,580,550);
const reference=ref.actor(ref.texture(crop),1.73,1.64);reference.position.set(0,.82,0);
const state=createChaseState();Object.assign(state,{stage:'RUNNING',distance:180.15,gap:23,time:25,age:25});
let animated=true,last=null;
/** Compõe referências em tamanho de leitura e duas cenas com os mesmos parâmetros da prévia. */
function draw(time){
  if(animated&&last!==null){const dt=Math.min(.05,(time-last)/1000);state.time+=dt;state.age+=dt;state.distance+=dt*8;}last=time;
  state.stage=document.querySelector('#pose').value;
  animator.apply(state);model.root.position.x=0;
  const angle=document.querySelector('#angle').value,zoom=Number(document.querySelector('#zoom').value);
  camera.position.set(...({three:[4.1,1.5,-6.2],side:[7.4,1.1,0],front:[0,1.1,-7.4],back:[0,1.1,7.4]}[angle]).map((v,i)=>i===1?.8+(v-.8)/zoom:v/zoom));camera.lookAt(0,.82+.53/zoom,0);renderer.render(scene,camera);
  sourceCtx.fillStyle='#e9dfd0';sourceCtx.fillRect(0,0,540,340);
  sourceCtx.fillStyle='#473027';sourceCtx.font='15px system-ui';sourceCtx.textAlign='center';
  sourceCtx.fillText('Exploração',145,80);sourceCtx.fillText('Arena com espada',385,80);
  const bottom=230+(zoom-1)*24;
  sourceCtx.drawImage(official,0,0,34,49,145-24.5*zoom,bottom-70*zoom,49*zoom,70*zoom);sourceCtx.drawImage(crop,385-37*zoom,bottom-70*zoom,74*zoom,70*zoom);
  room.render(modelCanvas.getContext('2d'),modelCanvas,state);
  ref.render(refCanvas.getContext('2d'),refCanvas,state);
  ref.girl.visible=false;reference.position.set(0,.82,0);
  ref.renderer.render(ref.scene,ref.camera);refCanvas.getContext('2d').drawImage(ref.renderer.domElement,0,0,540,340);
  requestAnimationFrame(draw);
}
document.querySelector('#motion').onclick=()=>{animated=!animated;document.querySelector('#motion').textContent=animated?'Congelar':'Animar';};
document.querySelector('#status').textContent='Comparação pronta · revisão 3 aguardando avaliação humana.';
window.comparison={model,room,ref,state,resources};requestAnimationFrame(draw);
/** Libera os recursos da página de comparação ao sair. */
function dispose(){room.destroy();ref.destroy();for(const r of resources)r.dispose();renderer.dispose();}
window.addEventListener('pagehide',dispose,{once:true});
