/** Traçado compartilhado pela simulação e apresentação; distâncias longitudinais em metros. */
export const ROUTE_NODES = Object.freeze([
  [ -32,0,0 ],[0,0,0],[40,0,0],[100,22,2.8],[165,-6,.5],[225,-28,-2.2],
  [290,8,3.8],[355,30,1],[420,-12,-2.8],[485,-30,1.4],[555,16,4.2],
  [620,28,-1.5],[680,0,0],[720,0,0],[800,0,0],
]);
/** Interpola pontos com tangentes contínuas, sem degraus entre setores ou retornos ao módulo inicial. */
function coordinate(s, axis) {
  const nodes=ROUTE_NODES;let i=0;while(i<nodes.length-2&&s>nodes[i+1][0])i++;
  const a=nodes[i],b=nodes[i+1],prev=nodes[Math.max(0,i-1)],next=nodes[Math.min(nodes.length-1,i+2)];
  const span=b[0]-a[0],t=Math.max(0,Math.min(1,(s-a[0])/span));
  const m0=i===0?0:(b[axis]-prev[axis])/(b[0]-prev[0]);
  const m1=i+1===nodes.length-1?0:(next[axis]-a[axis])/(next[0]-a[0]);
  return (2*t**3-3*t*t+1)*a[axis]+(t**3-2*t*t+t)*span*m0+(-2*t**3+3*t*t)*b[axis]+(t**3-t*t)*span*m1;
}
/** Retorna centro, tangente, inclinação e curvatura, sem dependência de Three.js ou estado mutável. */
export function routeFrame(s) {
  const x=coordinate(s,1),y=coordinate(s,2),h=.05;
  const dx=(coordinate(s+h,1)-coordinate(s-h,1))/(2*h),dy=(coordinate(s+h,2)-coordinate(s-h,2))/(2*h);
  const ddx=(coordinate(s+h,1)-2*x+coordinate(s-h,1))/(h*h);
  return {x,y,z:-s,yaw:-Math.atan(dx),pitch:Math.atan2(dy,Math.hypot(1,dx)),slope:dy,
    curvature:ddx/(1+dx*dx)**1.5};
}
/** Converte faixa lateral/altura no mesmo piso curvo usado por atores, paredes e obstáculos. */
export function routePoint(s,lateral=0,height=0) {
  const f=routeFrame(s);return {x:f.x+Math.cos(f.yaw)*lateral,y:f.y+height,z:f.z-Math.sin(f.yaw)*lateral};
}
/** Marca emboscadas nas entradas de curva, com aviso antes do ponto de colisão. */
export const ROUTE_AMBUSHES=Object.freeze([82,148,208,274,338,404,468,538,603]);
