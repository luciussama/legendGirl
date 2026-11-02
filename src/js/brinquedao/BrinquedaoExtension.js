/** Segunda metade: apoios separados por vãos reais, sem chão invisível entre brinquedos. */
const tracks=[];
const add=(id,from,to,y,end,kind,extra={})=>tracks.push({id,from,to,y,end,kind,...extra});
add('escorrega-gigante',14800,17000,550,1350,'slide');
for(const [i,x,towerY] of [[1,17000,850],[2,19180,850],[3,21350,800]]){
 add('cama-'+i,x,x+560,1350,1350,'spring',{impulse:i===3?1400:1350});
 const tower=x+800;
 add('castelo-'+i,tower,tower+600,towerY,towerY,'castle');
 for(let j=0;j<4;j++)add(`ponte-cai-${i}-${j}`,tower+600+j*150,tower+750+j*150,towerY,towerY,'fragile',{delay:.28});
}
add('escorrega-queda',23300,25100,1050,1700,'slide');
add('rampa-reversa',25100,26700,1700,-150,'reverse');
for(const [i,x,y,tx,ty,impulse]of [[1,27700,-650,28580,-1000,1150],[2,29600,-650,30500,-1150,1400],[3,31900,-700,32780,-1250,1450]]){
 add('cama-alta-'+i,x,x+650,y,y,'spring',{impulse});
 const width=i===2?400:600;
 add('castelo-alto-'+i,tx,tx+width,ty,ty,'castle');
 const bridgeX=tx+width+(i===2?120:0),bridgeY=ty-(i===2?130:0);
 for(let j=0;j<4;j++)add(`ponte-alta-${i}-${j}`,bridgeX+j*110,bridgeX+110+j*110,bridgeY,bridgeY,'fragile',{delay:.24});
}
add('terraço-final',34080,35600,-1250,-1250,'pad');
export const BRINQUEDAO_EXTENSION_TRACKS=Object.freeze(tracks.map(Object.freeze));
export const BRINQUEDAO_ELASTIC=Object.freeze({x:25100,y:1700,impulse:2350});
/** Limite de queda acompanha a estrutura inferior e depois a região elevada. */
export function brinquedaoDeathY(x){return x>=27000?1800:2200;}
