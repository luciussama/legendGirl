import {DREAM_GLIDER_ART} from './DreamGliderArt.js';
/** Traçado do voo: a segunda metade troca grandes altitudes sem alterar a travessia aprovada. */
export const DREAM_GLIDE=Object.freeze({start:28228,length:11200,speed:220,maxVertical:400,acceleration:400,knots:Object.freeze([[0,420],[1000,420],[2400,280],[3800,510],[4800,240],[6200,-650],[7700,790],[9200,-700],[10600,670],[11200,350]].map(Object.freeze))});
/** Centro de referência usado apenas para construir os obstáculos; não conduz a personagem. */
export function dreamGlideRoute(x){const d=x-DREAM_GLIDE.start,k=DREAM_GLIDE.knots;for(let i=1;i<k.length;i++)if(d<=k[i][0]){const [a,b]=[k[i-1],k[i]],t=Math.max(0,Math.min(1,(d-a[0])/(b[0]-a[0])));return a[1]+(b[1]-a[1])*t*t*(3-2*t);}return k.at(-1)[1];}
/** Galhos vêm de cima/baixo, com um vão real entre as pontas e silhueta de alfa compartilhada. */
export const DREAM_GLIDE_THORNS=Object.freeze(Array.from({length:21},(_,i)=>{const x=DREAM_GLIDE.start+1000+i*480,y=dreamGlideRoute(x),gap=i<8?300:340;return[-1,1].map(side=>Object.freeze({x:x-150,y:y+(side<0?-gap-900:240),w:300,h:900,side}));}).flat());
const girl=DREAM_GLIDER_ART.girl,thorn=DREAM_GLIDER_ART.thorn;
/** Registro comum de pés, escala e inclinação para desenho e contato da pintura inteira. */
export function dreamGliderPose(p){return{scale:88/700,anchorX:650,anchorY:1180,angle:Math.max(-.18,Math.min(.18,p.vy/2200))};}
/** Confere amostras opacas das duas pinturas; névoa/transparência não causam dano. */
export function dreamGliderContact(p){const pose=dreamGliderPose(p),cos=Math.cos(pose.angle),sin=Math.sin(pose.angle);for(const o of DREAM_GLIDE_THORNS){if(p.x+180<o.x||p.x-180>o.x+o.w)continue;for(let j=0;j<girl.mask.length;j++){if(girl.mask[j]!=='1')continue;const a=((j%girl.columns+.5)*girl.width/girl.columns-pose.anchorX)*pose.scale,b=((Math.floor(j/girl.columns)+.5)*girl.height/girl.rows-pose.anchorY)*pose.scale,x=p.x+a*cos-b*sin,y=p.y+a*sin+b*cos,u=(x-o.x)/o.w,v=o.side<0?(y-o.y)/o.h:1-(y-o.y)/o.h;const sourceV=v<0?((v*thorn.height%80)+80)%80/thorn.height:v;if(u>=0&&u<1&&sourceV>=0&&sourceV<1&&thorn.mask[Math.floor(sourceV*thorn.rows)*thorn.columns+Math.floor(u*thorn.columns)]==='1')return true;}}return false;}
/** Estado exclusivo do voo; câmera acompanha altitude só nesta seção e é restaurável. */
export function beginDreamGlide(s){s.stage='GLIDE_APPROACH';s.age=0;s.glider={cameraY:450};s.checkpoint='rest-5';s.fallCause=null;s.player.climb=null;}
/** Caminhada, rajada, voo pesado e queda com reinício automático no galho de lançamento. */
export function stepDreamGlide(s,input,dt,branch,surface,events,finish){const p=s.player,g=s.glider,tip=branch.x+branch.w*.84;
 if(s.stage==='GLIDE_APPROACH'){p.x=Math.min(tip,p.x+115*dt);p.y=surface(branch,p.x);p.vx=115;p.vy=0;p.facing=1;p.animTime+=115*dt/32;if(p.x>=tip){s.stage='GLIDE_GUST';s.age=0;p.vx=0;}return;}
 if(s.stage==='GLIDE_GUST'){p.x=tip;p.y=surface(branch,p.x);if(s.age>=1.1){s.stage='GLIDING';s.age=0;p.support=null;p.vx=DREAM_GLIDE.speed;p.vy=-110;events.push({type:'jump'});}return;}
 if(s.stage==='GLIDE_LANDING'){const t=Math.min(1,s.age/2.4),q=t*t*(3-2*t),x=finish.x+finish.w*.45;p.x=g.landing.x+(x-g.landing.x)*q;p.y=g.landing.y+(surface(finish,x)-g.landing.y)*q;p.vy=0;g.cameraY+=(p.y-100-g.cameraY)*Math.min(1,dt*3);if(t===1){p.support=finish.id;p.vx=0;}if(s.age>=3.6){s.stage='COMPLETE';s.age=0;events.push({type:'complete'});}return;}
 if(s.stage==='GLIDE_FALLING'){p.vy+=700*dt;p.y+=p.vy*dt;p.x+=70*dt;if(s.age>=1.35){p.x=branch.x+branch.w*.45;p.y=surface(branch,p.x);p.support=branch.id;p.vx=0;p.vy=0;beginDreamGlide(s);events.push({type:'checkpoint'});}return;}
 const y=Math.max(-1,Math.min(1,Number(input.y)||0)),target=y*DREAM_GLIDE.maxVertical+(!y?35:0),change=Math.max(-DREAM_GLIDE.acceleration*dt,Math.min(DREAM_GLIDE.acceleration*dt,(target-p.vy)*1.7));p.vy+=change;p.vx=DREAM_GLIDE.speed;p.x+=p.vx*dt;p.y+=p.vy*dt;
 g.cameraY+=(p.y-100-g.cameraY)*Math.min(1,dt*3);
 if(dreamGliderContact(p)||p.y< -1700||p.y>1900){s.stage='GLIDE_FALLING';s.age=0;s.falls++;s.hits++;s.fallCause='thorn';p.vy=80;events.push({type:'hurt'},{type:'fall'});return;}
 if(p.x>=DREAM_GLIDE.start+DREAM_GLIDE.length){s.stage='GLIDE_LANDING';s.age=0;g.landing={x:p.x,y:p.y};}
}
