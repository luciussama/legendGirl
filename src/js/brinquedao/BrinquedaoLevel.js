import {BRINQUEDAO_RECOVERY_TRACKS} from './BrinquedaoRecovery.js';
import {BRINQUEDAO_EXTENSION_TRACKS} from './BrinquedaoExtension.js';
/** Circuito próprio de brinquedão: passarelas, pontes de madeira, escorregadores e bolinhas. */
export const BRINQUEDAO=Object.freeze({width:35600,height:2200,bodyHeight:96,gravity:1500,jump:730,acceleration:1350,maxSpeed:700,slideSpeed:980,elasticSpeed:2400});
const data=[
 ['passeio',0,950,650,650,'pad'],['subida',950,1550,650,380,'pad'],['escorrega-sol',1550,2550,380,830,'slide'],['bolinhas-sol',2550,3350,830,830,'balls'],['volta-sol',3350,3700,830,720,'pad'],['degrau-sol',3700,4100,620,600,'pad'],['ponte-jardim',4100,4950,600,600,'bridge'],['torre-vento',4950,5600,600,430,'pad'],['escorrega-vento',5600,6650,430,860,'slide'],['bolinhas-vento',6650,7500,860,860,'balls'],['subida-arco',7500,7900,860,650,'pad'],['degrau-arco',7900,8300,550,520,'pad'],['ponte-arco',8300,9150,520,520,'bridge'],['subida-alta',9150,9850,520,370,'pad'],['escorrega-grande',9850,11100,370,840,'slide'],['bolinhas-grande',11100,11900,840,840,'balls'],['volta-grande',11900,12300,840,720,'pad'],['degrau-grande',12300,13000,620,550,'pad'],['ponte-final',13000,13700,550,550,'bridge'],['chegada',13700,14800,550,550,'pad'],
 ['atalho-sol',4140,4910,440,440,'pad',true],['atalho-arco',8260,9070,360,360,'pad',true]
];
export const BRINQUEDAO_TRACKS=Object.freeze([...data.map(([id,from,to,y,end,kind,upper=false])=>Object.freeze({id,from,to,y,end,kind,upper})),...BRINQUEDAO_EXTENSION_TRACKS,...BRINQUEDAO_RECOVERY_TRACKS]);
export const BRINQUEDAO_STEPS=Object.freeze([{x:3700,top:620,bottom:720},{x:7900,top:550,bottom:650},{x:12300,top:620,bottom:720}].map(Object.freeze));
export const BRINQUEDAO_BY_ID=new Map(BRINQUEDAO_TRACKS.map(p=>[p.id,p]));
export const BRINQUEDAO_CHECKPOINTS=Object.freeze([120,3900,7800,12100,14300,18100,20350,22550,28800,30700,33100]);
export const BRINQUEDAO_SECTIONS=Object.freeze([{x:0,name:'Passarelas ao sol'},{x:3900,name:'Pontes e gargalhadas'},{x:7800,name:'Lá do alto'},{x:11900,name:'Mais um escorregador'},{x:14800,name:'O grande mergulho'},{x:17000,name:'Um mar de camas elásticas'},{x:23300,name:'Paredes que devolvem o impulso'},{x:25100,name:'De volta ao céu!'},{x:27700,name:'Castelos nas alturas'},{x:34080,name:'Entrada dos túneis'}].map(Object.freeze));
/** Superfície autorada; a arte acompanha esta curva sem linhas auxiliares de pouso. */
export function brinquedaoSurface(p,x){const u=Math.max(0,Math.min(1,(x-p.from)/(p.to-p.from))),q=p.kind==='reverse'?u*u:u*u*(3-2*u);return p.y+(p.end-p.y)*q+((p.bowlDepth??0)*Math.sin(Math.PI*u))+(p.kind==='bridge'?Math.sin(Math.PI*u)*26:p.kind==='balls'?Math.sin(Math.PI*u)*32:0);}
export function brinquedaoSlope(p,x){return(brinquedaoSurface(p,x+2)-brinquedaoSurface(p,x-2))/4;}
export function brinquedaoMainAt(x){return BRINQUEDAO_TRACKS.find(p=>!p.upper&&x>=p.from&&x<=p.to)??null;}
export function brinquedaoNearby(left,right){return BRINQUEDAO_TRACKS.filter(p=>p.to>=left&&p.from<=right);}
