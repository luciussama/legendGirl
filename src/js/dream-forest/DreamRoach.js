import {DREAM_NIGHTMARE_ART as ART} from './DreamNightmareArt.js';
/** Juntas medidas na pintura preservada; raízes permanecem debaixo do casco. */
export const ROACH_JOINTS=Object.freeze([
 {name:'esquerda-traseira',hip:[500,430],knee:[372,369],tip:[56,697],polygon:[[508,402],[511,444],[455,453],[390,406],[354,467],[318,558],[228,629],[157,668],[60,725],[30,719],[32,682],[87,654],[168,628],[235,550],[292,450],[346,359],[372,344],[423,367]],lower:[[-30,389],[380,389],[380,1040],[-30,1040]]},
 {name:'esquerda-frontal',hip:[535,563],knee:[370,518],tip:[144,904],polygon:[[553,539],[553,592],[478,625],[413,574],[374,577],[341,657],[287,746],[242,815],[199,869],[130,935],[108,930],[114,881],[156,844],[190,792],[220,720],[255,638],[310,565],[344,507],[371,489],[428,509],[489,557]],lower:[[-30,533],[410,533],[410,1040],[-30,1040]]},
 {name:'esquerda-interna',hip:[588,612],knee:[480,650],tip:[367,722],polygon:[[597,588],[606,637],[542,679],[488,674],[453,687],[407,728],[365,737],[348,722],[365,686],[401,674],[432,636],[479,620],[543,592]],lower:[[300,652],[480,652],[480,800],[300,800]]},
 {name:'direita-traseira',hip:[1205,443],knee:[1350,446],tip:[1500,621],polygon:[[1190,421],[1232,409],[1294,384],[1339,384],[1381,432],[1398,487],[1437,551],[1498,580],[1524,610],[1530,656],[1500,663],[1480,630],[1433,613],[1383,585],[1350,537],[1317,487],[1290,449],[1230,468]],lower:[[1320,424],[1550,424],[1550,1040],[1320,1040]]},
 {name:'direita-media',hip:[1002,533],knee:[1220,492],tip:[1483,832],polygon:[[978,510],[1034,498],[1110,472],[1195,461],[1245,462],[1260,520],[1260,614],[1295,682],[1365,735],[1455,765],[1508,785],[1534,825],[1520,873],[1475,864],[1460,828],[1400,817],[1310,790],[1230,758],[1180,712],[1148,635],[1118,579],[1050,567],[1015,584]],lower:[[1150,528],[1550,528],[1550,1040],[1150,1040]]},
 {name:'direita-frontal',hip:[785,592],knee:[947,610],tip:[1273,956],polygon:[[760,555],[845,548],[920,561],[973,582],[994,646],[1035,735],[1120,805],[1230,862],[1308,907],[1338,945],[1326,994],[1252,1003],[1220,954],[1138,933],[1060,900],[978,858],[918,799],[870,724],[837,668],[780,656]],lower:[[850,639],[1550,639],[1550,1040],[850,1040]]}
].map(Object.freeze));
const HEAD={pivot:[650,480],polygon:[[527,459],[599,450],[702,456],[774,484],[811,548],[781,635],[736,706],[667,740],[585,731],[542,677],[505,595],[501,523]]};
const ANTENNAE=[
 {pivot:[420,250],polygon:[[441,255],[421,275],[351,176],[282,111],[213,80],[161,76],[110,96],[60,140],[28,212],[17,303],[3,303],[6,212],[40,139],[82,91],[143,57],[205,58],[283,88],[361,156]]},
 {pivot:[1206,156],polygon:[[1188,145],[1265,101],[1359,64],[1453,61],[1505,93],[1531,161],[1535,296],[1521,298],[1517,178],[1490,111],[1450,78],[1364,82],[1276,117],[1212,169]]}
];
function path(ctx,points){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();}
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function crop(image,polygon){const left=Math.max(0,Math.floor(Math.min(...polygon.map(p=>p[0])))),top=Math.max(0,Math.floor(Math.min(...polygon.map(p=>p[1])))),right=Math.min(image.width,Math.ceil(Math.max(...polygon.map(p=>p[0])))),bottom=Math.min(image.height,Math.ceil(Math.max(...polygon.map(p=>p[1])))),bitmap=canvas(right-left,bottom-top),ctx=bitmap.getContext('2d');ctx.translate(-left,-top);path(ctx,polygon);ctx.clip();ctx.drawImage(image,0,0);return{left,top,bitmap};}
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
export const ROACH_STEP_SECONDS=1.3;
const tripods=[0,0,1,1,0,1];
/** Cinemática de duas juntas com sentido de flexão anatômico e alvo limitado ao alcance real. */
export function solveRoachLeg(j,target){
 const u=[j.knee[0]-j.hip[0],j.knee[1]-j.hip[1]],v=[j.tip[0]-j.knee[0],j.tip[1]-j.knee[1]],a=Math.hypot(...u),b=Math.hypot(...v),dx=target[0]-j.hip[0],dy=target[1]-j.hip[1],d=clamp(Math.hypot(dx,dy),Math.abs(a-b)+.01,a+b-.01),bend=Math.sign(u[0]*v[1]-u[1]*v[0])||1,beta=bend*Math.acos(clamp((d*d-a*a-b*b)/(2*a*b),-1,1)),theta=Math.atan2(dy,dx)-Math.atan2(b*Math.sin(beta),a+b*Math.cos(beta)),upper=theta-Math.atan2(u[1],u[0]),lower=theta+beta-Math.atan2(v[1],v[0])-upper;
 return{upper:Math.atan2(Math.sin(upper),Math.cos(upper)),lower:Math.atan2(Math.sin(lower),Math.cos(lower))};
}
/** Juntas e ponta seguem exatamente os mesmos comprimentos usados pelos segmentos rígidos. */
export function dreamRoachLegPoints(j,a,b){const c=Math.cos(a),sn=Math.sin(a),kx=j.hip[0]+(j.knee[0]-j.hip[0])*c-(j.knee[1]-j.hip[1])*sn,ky=j.hip[1]+(j.knee[0]-j.hip[0])*sn+(j.knee[1]-j.hip[1])*c,angle=a+b;return{hip:j.hip,knee:[kx,ky],tip:[kx+(j.tip[0]-j.knee[0])*Math.cos(angle)-(j.tip[1]-j.knee[1])*Math.sin(angle),ky+(j.tip[0]-j.knee[0])*Math.sin(angle)+(j.tip[1]-j.knee[1])*Math.cos(angle)]};}
/** Segmentos se sobrepõem na junta real; um disco de quitina cobre a dobra sem frestas. */
function prepareLeg(image,j){
 const full=crop(image,j.polygon),dx=j.tip[0]-j.knee[0],dy=j.tip[1]-j.knee[1],length=Math.hypot(dx,dy),v=[dx/length,dy/length],u=[v[1],-v[0]];
 const segment=(side)=>{const bitmap=canvas(full.bitmap.width,full.bitmap.height),ctx=bitmap.getContext('2d'),offset=side<0?14:-14,k=[j.knee[0]+v[0]*offset,j.knee[1]+v[1]*offset];ctx.translate(-full.left,-full.top);path(ctx,[[k[0]+u[0]*2000,k[1]+u[1]*2000],[k[0]-u[0]*2000,k[1]-u[1]*2000],[k[0]-u[0]*2000+v[0]*2000*side,k[1]-u[1]*2000+v[1]*2000*side],[k[0]+u[0]*2000+v[0]*2000*side,k[1]+u[1]*2000+v[1]*2000*side]]);ctx.clip();ctx.drawImage(full.bitmap,full.left,full.top);return bitmap;};
 const upper=segment(-1),lower=segment(1),joint=canvas(64,64),ctx=joint.getContext('2d');ctx.beginPath();ctx.arc(32,32,32,0,Math.PI*2);ctx.clip();ctx.drawImage(full.bitmap,full.left-j.knee[0]+32,full.top-j.knee[1]+32);full.bitmap.width=1;full.bitmap.height=1;
 return{...j,left:full.left,top:full.top,upper,lower,joint};
}
/** Prepara juntas, casco, cabeça e antenas uma vez; as pinturas originais ficam intactas. */
export function prepareDreamRoach(image){
 const body=canvas(image.width,image.height),ctx=body.getContext('2d');ctx.drawImage(image,0,0);
 const legs=ROACH_JOINTS.map(j=>prepareLeg(image,j)),head={...HEAD,...crop(image,HEAD.polygon)},antennae=ANTENNAE.map(a=>({...a,...crop(image,a.polygon)}));
 ctx.globalCompositeOperation='destination-out';for(const part of [...ROACH_JOINTS,HEAD,...ANTENNAE]){path(ctx,part.polygon);ctx.fill();}ctx.globalCompositeOperation='source-over';
 for(const hip of [...ROACH_JOINTS.map(j=>j.hip),HEAD.pivot]){ctx.save();ctx.beginPath();ctx.arc(...hip,32,0,Math.PI*2);ctx.clip();ctx.drawImage(image,0,0);ctx.restore();}
 return{body,legs,head,antennae,width:image.width,height:image.height};
}
/** Tripés anatômicos alternam apoio longo e transferência curta; os pés não giram no vazio. */
export function dreamRoachPose(time,velocity=160){
 const energy=Math.min(1,Math.abs(velocity)/200),stride=80*clamp(velocity/200,-1,1);
 const legs=ROACH_JOINTS.map((j,i)=>{const reach=Math.hypot(j.knee[0]-j.hip[0],j.knee[1]-j.hip[1])+Math.hypot(j.tip[0]-j.knee[0],j.tip[1]-j.knee[1])-.05,span=Math.sqrt(Math.max(0,reach*reach-(j.tip[1]-j.hip[1])**2)),step=Math.min(Math.abs(stride),span*1.6)*Math.sign(stride),center=clamp(j.tip[0],j.hip[0]-span+Math.abs(step)/2+.02,j.hip[0]+span-Math.abs(step)/2-.02),phase=((time/ROACH_STEP_SECONDS+tripods[i]*.5)%1+1)%1,stance=phase<.65,q=stance?phase/.65:(phase-.65)/.35,travel=stance?.5-q:-.5+smooth(q),target=[center+step*travel,j.tip[1]-(stance?0:Math.sin(Math.PI*q)*(18+30*energy))*energy],angles=solveRoachLeg(j,target);return{...angles,...dreamRoachLegPoints(j,angles.upper,angles.lower),phase,stance};});
 return{head:Math.sin(time*.95)*.035+Math.sin(time*2.1)*.012,antennae:[Math.sin(time*1.7)*.04,Math.sin(time*1.45+.8)*.035],legs,lift:Math.sin(time*5.4*2)*2.8*(.35+.65*energy)};
}
/** Converte um ponto da pintura para o mundo com a mesma articulação usada no desenho. */
export function dreamRoachPoint(p,u,v,{head=false}={}){const width=p.width,height=width*ART.roach.height/ART.roach.width;let x=u*ART.roach.width,y=v*ART.roach.height;if(head){const dx=x-HEAD.pivot[0],dy=y-HEAD.pivot[1],a=p.pose.head;x=HEAD.pivot[0]+dx*Math.cos(a)-dy*Math.sin(a);y=HEAD.pivot[1]+dx*Math.sin(a)+dy*Math.cos(a);}return{x:p.x+(x/ART.roach.width-ART.roach.head[0])*width,y:p.y+(y/ART.roach.height-ART.roach.head[1])*height};}
function begin(ctx,p,rig){ctx.translate(p.x-ART.roach.head[0]*p.width,p.y-ART.roach.head[1]*p.width*rig.height/rig.width);ctx.scale(p.width/rig.width,p.width/rig.width);}
function leg(ctx,j,a,b){ctx.save();ctx.translate(...j.hip);ctx.rotate(a);ctx.drawImage(j.upper,j.left-j.hip[0],j.top-j.hip[1]);ctx.translate(j.knee[0]-j.hip[0],j.knee[1]-j.hip[1]);ctx.save();ctx.rotate(b);ctx.drawImage(j.lower,j.left-j.knee[0],j.top-j.knee[1]);ctx.restore();ctx.rotate(b*.5);ctx.drawImage(j.joint,-32,-32);ctx.restore();}
/** Desenha pernas articuladas atrás do casco e cabeça/antenas móveis sobre a pintura original. */
export function drawDreamRoach(ctx,rig,p,{reaching=false}={}){if(!rig)return;ctx.save();begin(ctx,p,rig);for(let i=0;i<rig.legs.length;i++)if(!(reaching&&i===1))leg(ctx,rig.legs[i],p.pose.legs[i].upper,p.pose.legs[i].lower);ctx.drawImage(rig.body,0,0);const h=rig.head;ctx.save();ctx.translate(...h.pivot);ctx.rotate(p.pose.head);ctx.drawImage(h.bitmap,h.left-h.pivot[0],h.top-h.pivot[1]);ctx.restore();rig.antennae.forEach((a,i)=>{ctx.save();ctx.translate(...a.pivot);ctx.rotate(p.pose.antennae[i]);ctx.drawImage(a.bitmap,a.left-a.pivot[0],a.top-a.pivot[1]);ctx.restore();});ctx.restore();}
/** A pata chega pelo corpo, com duas juntas reais; não há recorte retangular flutuando na captura. */
export function drawDreamRoachReach(ctx,rig,p,target,q){if(!rig||q<=0)return;const j=rig.legs[1],walk=p.pose.legs[1],scale=p.width/rig.width,origin={x:p.x-ART.roach.head[0]*p.width,y:p.y-ART.roach.head[1]*p.width*rig.height/rig.width},x=walk.tip[0]+((target.x-origin.x)/scale-walk.tip[0])*q,y=walk.tip[1]+((target.y-origin.y)/scale-walk.tip[1])*q,angles=solveRoachLeg(j,[x,y]);ctx.save();begin(ctx,p,rig);leg(ctx,j,angles.upper,angles.lower);ctx.restore();}
/** Libera todas as camadas preparadas, inclusive a captura em andamento. */
export function destroyDreamRoach(rig){if(!rig)return;for(const bitmap of [rig.body,rig.head.bitmap,...rig.antennae.map(a=>a.bitmap),...rig.legs.flatMap(j=>[j.upper,j.lower,j.joint])]){bitmap.width=1;bitmap.height=1;}}
