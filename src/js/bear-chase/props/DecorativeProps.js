import * as T from '../../../vendor/three/three.module.js';
import { PropParts } from './ChasePropResources.js';
import { oval,profile,rounded,curve,rod,outline } from './DecorativeGeometry.js';

/** Ursinho sentado, com cabeça larga, patas grandes, focinho caramelo e bordados da fonte. */
function teddy(p,m) {
  oval(p,m.fur,[0,.36,0],[.255,.29,.19]);oval(p,m.fur,[0,.76,.015],[.265,.24,.215]);
  for(const side of [-1,1]){
    oval(p,m.fur,[side*.205,.94,.005],[.105,.105,.073]);oval(p,m.pad,[side*.205,.944,.068],[.065,.065,.018]);
    oval(p,m.fur,[side*.255,.36,.055],[.098,.215,.10],[0,0,-side*.20]);
    oval(p,m.fur,[side*.18,.125,.17],[.15,.125,.175]);oval(p,m.pad,[side*.18,.13,.32],[.105,.086,.025]);
    oval(p,m.dark,[side*.087,.80,.218],[.024,.029,.019]);oval(p,m.glint,[side*.092,.81,.234],[.006,.007,.004]);
    const bow=outline([['M',0,0],['Q',side*.15,.09,side*.145,.015],['Q',side*.14,-.09,0,0],['Z']]);profile(p,m.saddle,bow,.033,[0,.55,.20],.004);
  }
  oval(p,m.pad,[0,.687,.207],[.138,.10,.065]);oval(p,m.dark,[0,.72,.268],[.044,.029,.017]);
  curve(p,m.thread,[[0,.70,.273],[0,.67,.275],[-.045,.65,.259]],.005);curve(p,m.thread,[[0,.67,.275],[.045,.65,.259]],.005);
  oval(p,m.saddle,[0,.55,.222],[.032,.04,.026]);
  for(let i=0;i<6;i++)rod(p,m.thread,[-.012,.22+i*.035,.182],[.012,.23+i*.035,.19],.003);
}
/** Robô de lata: cabeça arredondada, rosto de latão, membros articulados e chave de corda. */
function robot(p,m) {
  rounded(p,m.teal,[0,.51,0],[.35,.34,.25],.055,.018);rounded(p,m.brass,[0,.51,.135],[.29,.28,.025],.035,.003);
  rounded(p,m.teal,[0,.51,.151],[.25,.24,.02],.025,.003);rounded(p,m.teal,[0,.87,0],[.43,.29,.30],.07,.018);
  rounded(p,m.brass,[0,.87,.16],[.34,.20,.023],.045,.003);
  for(const side of [-1,1]){
    p.cylinder(m.brass,[side*.24,.87,0],.075,.075,.055,[0,0,Math.PI/2]);p.cylinder(m.saddle,[side*.27,.87,0],.05,.05,.02,[0,0,Math.PI/2]);
    oval(p,m.dark,[side*.09,.895,.18],[.022,.028,.014]);oval(p,m.glint,[side*.095,.904,.193],[.005,.006,.003]);
    oval(p,m.brass,[side*.23,.65,0],[.075,.075,.075]);rounded(p,m.teal,[side*.265,.54,0],[.09,.15,.11],.035);
    oval(p,m.brass,[side*.265,.43,0],[.057,.057,.057]);rounded(p,m.teal,[side*.265,.34,.015],[.085,.13,.10],.025);
    oval(p,m.saddle,[side*.265,.25,.025],[.061,.060,.057]);
    rounded(p,m.teal,[side*.105,.265,0],[.105,.16,.12],.025);p.cylinder(m.brass,[side*.105,.175,0],.06,.06,.065,[Math.PI/2,0,0]);
    rounded(p,m.teal,[side*.105,.11,.025],[.105,.10,.13],.02);rounded(p,m.saddle,[side*.105,.035,.065],[.19,.07,.27],.025);
    rounded(p,m.teal,[side*.105,.075,.05],[.17,.035,.24],.02,.005);
  }
  curve(p,m.dark,[[-.045,.847,.18],[0,.832,.184],[.045,.847,.18]],.005);
  p.cylinder(m.brass,[0,.55,.175],.07,.07,.023,[Math.PI/2,0,0]);p.cylinder(m.saddle,[0,.55,.19],.047,.047,.018,[Math.PI/2,0,0]);
  for(const y of [.40,.43,.46])rounded(p,m.brass,[0,y,.178],[.13,.014,.016],.004,.002);
  rod(p,m.brass,[0,1.02,0],[0,1.12,0],.014);oval(p,m.brass,[0,1.13,0],[.035,.035,.035]);
  rod(p,m.brass,[.16,.51,-.10],[.32,.51,-.10],.021);for(const y of [.46,.57])p.ring(m.brass,[.32,y,-.10],.044,.015,[0,Math.PI/2,0]);
}
/** Patinho de perfil: corpo baixo e largo, cauda levantada, bico bipartido e asas esculpidas. */
function duck(p,m) {
  oval(p,m.rubber,[-.035,.245,0],[.37,.245,.265]);oval(p,m.rubber,[.20,.565,0],[.245,.245,.222]);
  oval(p,m.rubber,[-.345,.355,0],[.19,.075,.13],[0,0,-.8]);oval(p,m.rubber,[-.45,.45,0],[.07,.06,.085]);
  oval(p,m.beak,[.425,.493,0],[.125,.052,.113]);oval(p,m.beak,[.425,.452,0],[.105,.028,.09]);
  curve(p,m.beakShade,[[.54,.47,0],[.49,.467,.09],[.40,.469,.103]],.004);
  for(const side of [-1,1]){
    oval(p,m.dark,[.29,.60,side*.202],[.026,.033,.012]);oval(p,m.glint,[.299,.613,side*.212],[.007,.009,.004]);
    oval(p,m.rubber,[-.14,.275,side*.235],[.205,.125,.055],[0,0,-.2]);
    for(let i=0;i<3;i++)curve(p,m.rubberShade,[[-.29+i*.02,.325-i*.038,side*.274],[-.16,.27-i*.03,side*.293],[.025,.29-i*.031,side*.27]],.009);
  }
  p.cylinder(m.brass,[.20,.802,0],.12,.13,.045);p.ring(m.brass,[.20,.83,0],.12,.013,[Math.PI/2,0,0]);
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3,x=.20+Math.cos(a)*.095,z=Math.sin(a)*.095,y=.91+(i===0?.025:0);
    p.cylinder(m.brass,[x,(.83+y)/2,z],.018,.035,y-.83);oval(p,m.brass,[x,y,z],[.035,.035,.035]);}
}
/** Tambor de madeira pintada, pele tensionada e cordas alternadas presas aos aros. */
function drum(p,m) {
  p.cylinder(m.drum,[0,.255,0],.325,.31,.43,[0,0,0],48);p.cylinder(m.skin,[0,.486,0],.315,.315,.022,[0,0,0],48);
  for(const y of [.04,.465]){p.cylinder(m.brass,[0,y,0],.344,.344,.045,[0,0,0],48);p.ring(m.brass,[0,y+.023,0],.326,.018,[Math.PI/2,0,0]);}
  for(let i=0;i<12;i++){const a=i*Math.PI/6,b=(i+1)*Math.PI/6,y=i%2?.09:.425,yy=i%2?.425:.09;
    rod(p,m.brass,[Math.cos(a)*.335,y,Math.sin(a)*.335],[Math.cos(b)*.335,yy,Math.sin(b)*.335],.012);
    oval(p,m.brass,[Math.cos(a)*.338,y,Math.sin(a)*.338],[.024,.024,.024]);}
}
/** Bobo com gola recortada e gorro curvo, ligado por mola à caixa roxa com losango e rebites. */
function jack(p,m) {
  rounded(p,m.purple,[0,.25,0],[.54,.50,.46],.018,.01);
  for(const x of [-.26,.26])for(const z of [-.22,.22])rounded(p,m.brass,[x,.25,z],[.025,.50,.025],.004,.002);
  for(const y of [.025,.485])rounded(p,m.brass,[0,y,0],[.56,.035,.48],.01,.004);
  const diamond=outline([['M',0,.105],['L',.095,0],['L',0,-.105],['L',-.095,0],['Z']]);profile(p,m.brass,diamond,.018,[0,.25,.24],.003);
  for(const x of [-.22,.22])for(const y of [.08,.42])oval(p,m.brass,[x,y,.238],[.014,.014,.012]);
  rounded(p,m.purple,[0,.66,-.26],[.53,.33,.035],.015,.004);
  for(const x of [-.26,.26])rounded(p,m.brass,[x,.66,-.23],[.02,.34,.02],.004,.002);
  const spring=[];for(let i=0;i<=100;i++){const a=i*Math.PI*6/100;spring.push([Math.cos(a)*.075,.50+i*.0027,Math.sin(a)*.075]);}curve(p,m.brass,spring,.012);
  oval(p,m.pink,[0,.83,0],[.145,.125,.11]);oval(p,m.face,[0,1.035,.02],[.155,.15,.13]);
  for(const side of [-1,1]){
    curve(p,m.pink,[[side*.08,.87,0],[side*.18,.845,.01],[side*.25,.94,.025]],.035);oval(p,m.face,[side*.25,.95,.025],[.047,.047,.04]);
    oval(p,m.dark,[side*.05,1.065,.143],[.018,.022,.011]);oval(p,m.pink,[side*.09,1.015,.134],[.03,.023,.009]);
    const hat=outline([['M',side*.01,1.15],['Q',side*.12,1.39,side*.235,1.19],['Q',side*.25,1.15,side*.20,1.14],['Q',side*.16,1.24,side*.12,1.13],['Z']]);profile(p,side<0?m.pink:m.saddle,hat,.14,[0,0,.01],.012);oval(p,m.brass,[side*.22,1.17,.015],[.034,.034,.034]);
  }
  for(let i=0;i<7;i++){const a=i*Math.PI*2/7;oval(p,m.brass,[Math.cos(a)*.13,.92+Math.sin(a)*.035,Math.sin(a)*.09],[.036,.025,.025]);}
  oval(p,m.saddle,[0,1.03,.159],[.027,.028,.022]);curve(p,m.dark,[[-.045,.99,.14],[0,.973,.15],[.045,.99,.14]],.004);
}
/** Poltrona larga: encosto em arco, almofada, braços enrolados, vivo costurado e capitonê. */
function armchair(p,m) {
  for(const x of [-.46,.46])for(const z of [-.32,.32])p.cylinder(m.oak,[x,.075,z],.095,.10,.15,[0,0,0],28);
  rounded(p,m.fabric,[0,.32,.01],[1.17,.34,.92],.09,.035);rounded(p,m.fabric,[0,.51,.09],[.94,.22,.79],.10,.045);
  const back=outline([['M',-.56,.36],['L',-.56,.90],['C',-.56,1.58,.56,1.58,.56,.90],['L',.56,.36],['Z']]);
  profile(p,m.fabric,back,.25,[0,0,-.33],.035);
  curve(p,m.piping,[[-.51,.54,-.175],[-.51,.96,-.175],[-.34,1.29,-.175],[0,1.39,-.175],[.34,1.29,-.175],[.51,.96,-.175],[.51,.54,-.175]],.009);
  for(const side of [-1,1]){
    rounded(p,m.fabric,[side*.55,.54,.04],[.29,.62,.88],.12,.035);
    p.cylinder(m.fabric,[side*.55,.78,.04],.166,.166,.86,[Math.PI/2,0,0],36);
    p.ring(m.piping,[side*.55,.78,.476],.14,.009);
    curve(p,m.piping,[[side*.64,.65,.48],[side*.64,.39,.48],[side*.59,.24,.48]],.007);
  }
  curve(p,m.piping,[[-.44,.51,.49],[-.30,.47,.50],[.30,.47,.50],[.44,.51,.49]],.007);
  for(const x of [-.21,.21])for(const y of [.85,1.13]){
    oval(p,m.piping,[x,y,-.18],[.026,.026,.015]);
    for(const side of [-1,1])curve(p,m.fabricShade,[[x+side*.065,y+.07,-.182],[x+side*.025,y+.025,-.178],[x,y,-.175]],.003);
  }
}
/** Cavalinho esculpido de perfil: pescoço integrado, crina contínua, sela e patins de madeira maciça. */
function horse(p,m) {
  for(const side of [-1,1]){
    const rocker=outline([['M',-.94,.26],['Q',0,-.13,.94,.26],['L',.96,.35],['Q',0,-.015,-.96,.35],['Z']]);profile(p,m.horse,rocker,.105,[0,0,side*.27],.012);
    for(const x of [-.43,.43]){
      rounded(p,m.horse,[x,.48,side*.23],[.12,.58,.12],.045,.015);p.parts[p.parts.length-1].rotation[2]=Math.sign(x)*.40;
      p.cylinder(m.brass,[x,.25,side*.335],.035,.035,.016,[Math.PI/2,0,0]);
    }
  }
  const body=outline([['M',.45,.65],['C',.0,.52,-.36,.55,-.44,.67],['Q',-.49,.79,-.50,1.03],['L',-.69,1.00],['Q',-.88,.97,-.84,1.12],['L',-.65,1.28],['Q',-.60,1.38,-.49,1.30],['Q',-.34,1.25,-.32,1.11],['L',-.25,.93],['Q',-.01,.84,.27,.94],['Q',.59,1.00,.52,.77],['Q',.50,.68,.45,.65],['Z']]);
  profile(p,m.horse,body,.37,[0,0,0],.035);
  oval(p,m.horse,[.02,.745,0],[.465,.205,.222]);
  const muzzle=outline([['M',-.81,1.03],['Q',-.87,1.13,-.76,1.18],['L',-.67,1.15],['L',-.70,1.02],['Q',-.77,.97,-.81,1.03],['Z']]);profile(p,m.face,muzzle,.415,[0,0,0],.018);
  const mane=outline([['M',-.48,1.31],['Q',-.30,1.34,-.28,1.16],['Q',-.18,1.11,-.21,1.01],['Q',-.10,.94,-.18,.85],['L',-.31,.86],['Q',-.39,1.05,-.42,1.18],['Z']]);profile(p,m.mane,mane,.40,[0,0,0],.017);
  const tail=outline([['M',.39,.86],['C',.67,1.16,.72,.75,.98,.93],['Q',1.11,1.04,1.08,.91],['C',.93,.58,.64,.53,.44,.66],['Z']]);profile(p,m.mane,tail,.18,[0,0,0],.018);
  const forelock=outline([['M',-.63,1.27],['Q',-.74,1.37,-.57,1.40],['Q',-.40,1.35,-.52,1.25],['Z']]);profile(p,m.mane,forelock,.415,[0,0,0],.012);
  oval(p,m.teal,[.07,.90,0],[.31,.07,.23]);oval(p,m.saddle,[.07,.935,0],[.27,.065,.20]);
  for(const side of [-1,1]){
    oval(p,m.horse,[-.50,1.36,side*.105],[.048,.12,.035],[0,0,-.25]);oval(p,m.mane,[-.50,1.37,side*.129],[.022,.068,.009],[0,0,-.25]);
    oval(p,m.dark,[-.63,1.20,side*.20],[.023,.029,.012]);oval(p,m.glint,[-.635,1.21,side*.21],[.006,.007,.003]);
    oval(p,m.dark,[-.79,1.095,side*.221],[.014,.019,.009]);
    curve(p,m.saddle,[[-.73,1.18,side*.19],[-.68,1.10,side*.20],[-.67,1.02,side*.18]],.014);
    curve(p,m.saddle,[[-.69,1.10,side*.20],[-.55,1.16,side*.20],[-.49,1.26,side*.18]],.009);
    p.cylinder(m.brass,[-.69,1.08,side*.217],.021,.021,.013,[Math.PI/2,0,0]);
    p.cylinder(m.brass,[.29,.89,side*.222],.026,.026,.018,[Math.PI/2,0,0]);
  }
  rod(p,m.horse,[-.48,1.12,-.28],[-.48,1.12,.28],.029);
}
/** Mesa com tampo espesso, borda torneada e suportes curvos cruzados largos como no original. */
function table(p,m) {
  p.cylinder(m.table,[0,.85,0],.55,.56,.13,[0,0,0],64);p.ring(m.oak,[0,.795,0],.54,.022,[Math.PI/2,0,0]);
  p.cylinder(m.oak,[0,.045,0],.42,.44,.09,[0,0,0],48);p.ring(m.horse,[0,.08,0],.41,.018,[Math.PI/2,0,0]);
  for(const side of [-1,1])for(const z of [-.20,.20]){
    const support=outline([['M',side*.33,.09],['Q',-side*.01,.34,-side*.26,.77],['L',-side*.36,.77],['Q',-side*.16,.34,side*.22,.09],['Z']]);profile(p,m.tableSupport,support,.09,[0,0,z],.013);
  }
  for(const z of [-.25,.25])p.cylinder(m.brass,[0,.40,z],.042,.042,.014,[Math.PI/2,0,0]);
}
/** Constrói oito objetos distintos; atlas, GPU e ciclo de vida continuam pertencendo ao catálogo. */
export function decorativeFactories(resources) {
  const mat=(region,tint)=>resources.pictorialMaterial('decorative',region,tint);
  const m={horse:mat(0),mane:mat(1),saddle:mat(2),teal:mat(3),rubber:mat(4),rubberShade:mat(4,'#e2bd68'),beak:mat(5),beakShade:mat(5,'#9f6547'),
    robot:mat(6),brass:mat(7),fur:mat(8),pad:mat(9),purple:mat(10),pink:mat(11),fabric:mat(12),fabricShade:mat(12,'#a67c79'),piping:mat(12,'#c7a392'),skin:mat(13),drum:mat(14),table:mat(15),tableSupport:mat(2,'#966e52'),oak:mat(0,'#b39369'),
    face:mat(13,'#e5c49b'),dark:resources.material('decorativos-bordado-escuro','#302118'),thread:resources.material('ursinho-linha','#603d24'),glint:resources.material('decorativos-brilho-olhos','#fff0bf')};
  return Object.fromEntries(Object.entries({teddy,robot,duck,drum,jack,armchair,'rocking-horse':horse,table}).map(([id,build])=>{
    const p=new PropParts();build(p,id==='robot'?{...m,teal:m.robot}:m);const prototype=resources.bake(p.parts,id+' — revisão fiel às fontes',true);
    if(id==='duck')prototype.scale.x=.88;
    if(id==='teddy')prototype.scale.x=1.08;
    prototype.position.y=-new T.Box3().setFromObject(prototype).min.y;
    return [id,{/** Instancia mantendo materiais e malhas compartilhados. */create(){return prototype.clone(true);}}];
  }));
}
