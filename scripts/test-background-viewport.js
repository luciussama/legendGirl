import assert from 'node:assert/strict';
import { getBackgroundViewport, BackgroundRenderer } from '../src/js/environment/BackgroundRenderer.js';
const canvas={width:540,height:1169};
for(const m of [{a:.8,b:0,c:0,d:.8,e:172.8,f:395.54},{a:1.18,b:0,c:0,d:1.18,e:-210,f:-730},{a:1,b:.1,c:-.1,d:1,e:40,f:-80}]){
 const bounds=getBackgroundViewport({getTransform:()=>m},canvas),det=m.a*m.d-m.b*m.c;
 for(const [x,y] of [[0,0],[canvas.width,0],[0,canvas.height],[canvas.width,canvas.height]]){
  const wx=(m.d*(x-m.e)-m.c*(y-m.f))/det,wy=(-m.b*(x-m.e)+m.a*(y-m.f))/det;
  assert.ok(wx>bounds.left&&wx<bounds.right&&wy>bounds.top&&wy<bounds.bottom,'A cobertura inclui cada canto inversamente projetado');
 }
 const fills=[];const ctx=new Proxy({getTransform:()=>m,fillRect:(...r)=>fills.push(r),createLinearGradient:()=>({addColorStop(){}})}, {get:(o,k)=>o[k]??(()=>{})});
 const renderer=new BackgroundRenderer();const before=JSON.stringify(renderer);renderer.renderWall(ctx,canvas,1234);
 const [left,top,w,h]=fills[0];assert.ok(left<=bounds.left&&top<=bounds.top&&left+w>=bounds.right&&top+h>=bounds.bottom,'A base opaca cobre todo o viewport transformado');
 assert.equal(JSON.stringify(renderer),before,'Desenhar o fundo não modifica seu estado');
}
assert.deepEqual(getBackgroundViewport({},canvas),{left:0,right:540,top:0,bottom:1169});
assert.deepEqual(getBackgroundViewport({getTransform:()=>({a:0,b:0,c:0,d:0,e:0,f:0})},canvas),{left:0,right:540,top:0,bottom:1169});
console.log('APROVADO: cobertura do fundo com zoom, offsets e matriz inclinada; estado preservado.');
