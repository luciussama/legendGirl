import * as T from '../../../vendor/three/three.module.js';

/** Cria volumes macios com resolução suficiente para não facetar cabeça, pelúcia e borracha. */
export function oval(p,m,at,size,rotation=[0,0,0]) {
  const g=new T.SphereGeometry(1,32,24);g.scale(...size);p.add(g,m,at,rotation);
}
/** Extruda um perfil desenhado, preservando volume, chanfro e UVs por face em vez de cartões. */
export function profile(p,m,shape,depth,at=[0,0,0],bevel=.012) {
  const g=new T.ExtrudeGeometry(shape,{depth:depth-2*bevel,bevelEnabled:bevel>0,bevelSize:bevel,bevelThickness:bevel,bevelSegments:3,curveSegments:18});
  g.translate(0,0,-depth/2+bevel);g.computeBoundingBox();
  const b=g.boundingBox,span=b.getSize(new T.Vector3()),pos=g.getAttribute('position'),normal=g.getAttribute('normal'),uv=g.getAttribute('uv');
  for(let i=0;i<uv.count;i++){
    const nx=Math.abs(normal.getX(i)),ny=Math.abs(normal.getY(i)),nz=Math.abs(normal.getZ(i));
    uv.setXY(i,(nz>=nx&&nz>=ny?pos.getX(i)-b.min.x:pos.getZ(i)-b.min.z)/(nz>=nx&&nz>=ny?span.x:span.z),
      ny>nx&&ny>nz?(pos.getX(i)-b.min.x)/span.x:(pos.getY(i)-b.min.y)/span.y);
  }
  p.add(g,m,at);return g;
}
/** Desenha um retângulo de cantos realmente circulares, adequado a lata e almofadas. */
export function rounded(p,m,at,size,radius=.05,bevel=.012) {
  const [w,h,d]=size,r=Math.min(radius,w/2,h/2),x=-w/2,y=-h/2,s=new T.Shape();
  s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);
  s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);
  s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);s.closePath();return profile(p,m,s,d,at,bevel);
}
/** Modela costuras, arreios e suportes com continuidade suave, sem junções entre cilindros. */
export function curve(p,m,points,radius=.012,closed=false) {
  const path=new T.CatmullRomCurve3(points.map(a=>new T.Vector3(...a)),closed,'centripetal');
  p.add(new T.TubeGeometry(path,Math.max(32,points.length*5),radius,8,closed),m,[0,0,0]);
}
/** Une pontos por uma haste volumétrica orientada, incluindo cordas e eixos. */
export function rod(p,m,a,b,r=.018) {
  const from=new T.Vector3(...a),to=new T.Vector3(...b),delta=to.clone().sub(from);
  const g=new T.CylinderGeometry(r,r,delta.length(),16);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize()));
  p.add(g,m,from.add(to).multiplyScalar(.5).toArray());
}
/** Registra um perfil com comandos compactos, mantendo o desenho específico de cada objeto explícito. */
export function outline(commands) {
  const s=new T.Shape();for(const [op,...v]of commands){if(op==='M')s.moveTo(...v);else if(op==='L')s.lineTo(...v);else if(op==='Q')s.quadraticCurveTo(...v);else if(op==='C')s.bezierCurveTo(...v);else s.closePath();}return s;
}
