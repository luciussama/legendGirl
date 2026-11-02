/** Desafios encadeados entre quatro tobogãs; todas as medidas são de objetos visíveis. */
export const BRINQUEDAO_GAUNTLET=Object.freeze({floor:850,runWidth:2200,runSpeed:900,launchSpeed:760,acceleration:1250,drag:480,jump:730,gravity:1500,triangle:{x:1120,width:170,height:94},blocks:{from:300,to:2100,count:15,delay:.55,step:.15},finishWidth:1800});
export const BRINQUEDAO_REBOUNDS=Object.freeze([[140,850],[1120,1030],[140,1240],[1120,1430],[140,1640],[1120,1830],[1660,1960]].map(Object.freeze));
/** A onda de colapso começa ao entrar no trecho de blocos, e pausa junto com o jogo. */
export function brinquedaoBlockSolid(i,index,time,difficulty='NORMAL'){const b=BRINQUEDAO_GAUNTLET.blocks;return i.bridgeStarted===null||time-i.bridgeStarted<(b.delay+index*b.step)*(difficulty==='EASY'?1.3:1);}
/** Colisão do tronco/pés com o perfil triangular, sem caixa retangular invisível sobre o vértice. */
export function brinquedaoTriangleTouches(p){const t=BRINQUEDAO_GAUNTLET.triangle,left=t.x-t.width/2,right=t.x+t.width/2;if(p.x+17<left||p.x-17>right)return false;const x=Math.max(p.x-17,Math.min(p.x+17,t.x)),height=Math.max(0,t.height*(1-Math.abs(x-t.x)/(t.width/2)));return p.y-6>BRINQUEDAO_GAUNTLET.floor-height&&p.y-86<BRINQUEDAO_GAUNTLET.floor;}
/** Cada voo liga duas lonas; o último termina no bocal do terceiro cano. */
export function brinquedaoReboundPose(index,u){const a=BRINQUEDAO_REBOUNDS[index],b=BRINQUEDAO_REBOUNDS[index+1],t=Math.max(0,Math.min(1,u)),duration=.65;return{x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t-Math.sin(t*Math.PI)*125,vx:(b[0]-a[0])/duration,vy:(b[1]-a[1]-Math.cos(t*Math.PI)*Math.PI*125)/duration,facing:Math.sign(b[0]-a[0])};}
