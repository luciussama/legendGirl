/** Rotas inferiores são brinquedos físicos: ainda há vãos depois da segunda chance. */
const tracks=[],walls=[];
const add=(id,from,to,y,end,kind,extra={})=>tracks.push({id,from,to,y,end,kind,upper:true,recovery:true,...extra});
for(const [i,from,flat,to,y,end]of [[1,17600,17950,19000,1770,1500],[2,19750,20100,21180,1800,1500],[3,22000,22400,23300,1900,1200]]){
 add('apoio-inferior-'+i,from,flat,y,y,'pad');
 add('retorno-inferior-'+i,flat,to,y,end,'slide');
}
for(const [i,from,to,y,depth]of [[1,26900,28400,350,500],[2,29200,30500,200,500],[3,31600,33500,150,650]]){
 add('calha-elastica-'+i,from,to,y,y,'slide',{bowlDepth:depth});
 for(const side of[-1,1])for(let row=0;row<3;row++)walls.push({id:`lateral-${i}-${side}-${row}`,x:side<0?from:to,side,top:y+row*300,bottom:y+300+row*300,impulse:[900,1120,1350][row]});
}
add('beira-calha-1',26800,26900,350,350,'pad');
add('patamar-recuperacao-1',28400,28580,350,350,'pad');
add('lona-retorno-1',28580,28900,350,350,'spring',{impulse:2200,vertical:true});
add('saida-recuperacao-1',28900,29100,350,350,'pad');
add('rampa-recuperacao-1',29100,29200,350,200,'slide');
add('patamar-recuperacao-2',30500,30600,200,200,'pad');
add('lona-retorno-2',30600,30900,200,200,'spring',{impulse:2250,vertical:true});
add('saida-recuperacao-2',30900,31100,200,200,'pad');
add('rampa-recuperacao-2',31100,31600,200,150,'slide');
add('patamar-recuperacao-3',33500,34080,150,150,'pad');
add('lona-retorno-3',34080,34580,150,150,'spring',{impulse:2300,vertical:true});
add('saida-recuperacao-3',34580,35150,150,150,'pad');
export const BRINQUEDAO_RECOVERY_TRACKS=Object.freeze(tracks.map(Object.freeze));
export const BRINQUEDAO_SIDE_MATS=Object.freeze(walls.map(Object.freeze));
/** Tempo desde a última rebatida: pausa/save preservam a recuperação gradual da direção. */
export function brinquedaoRicochetAge(s){const hits=Object.values(s.obstacles.bumpers).filter(t=>t!==null);return hits.length?s.time-Math.max(...hits):Infinity;}
/** Contato lateral varrido muda velocidade, nunca transporta Yuna até outro brinquedo. */
export function hitBrinquedaoSideMat(s,previous,events){const p=s.player;
 for(const wall of BRINQUEDAO_SIDE_MATS){
  const outward=wall.side<0?p.vx<0&&previous.x>=wall.x&&p.x<=wall.x:p.vx>0&&previous.x<=wall.x&&p.x>=wall.x;
  const hit=s.obstacles.bumpers[wall.id];
  if(!outward||p.y<wall.top||p.y-96>wall.bottom||hit!==null&&s.time-hit<.16)continue;
  p.x=wall.x-wall.side*18;p.vx=-wall.side*Math.min(1550,Math.max(1280,Math.abs(p.vx)*.95));p.vy=-(wall.impulse+(p.jumpHeld?180:0));p.support=null;p.mode='air';p.coyote=0;p.buffer=0;p.facing=-wall.side;
  s.obstacles.bumpers[wall.id]=s.time;s.obstacles.ricochets++;events.push({type:'side-spring',id:wall.id});return true;
 }
 return false;
}
