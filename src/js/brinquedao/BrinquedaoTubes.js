/** Três seções de três tubos; distância de arco mantém velocidade real mesmo nas curvas. */
export const BRINQUEDAO_INSIDE=Object.freeze({sections:3,legs:3,poolWidth:2600,floor:900,bodyHeight:96,gravity:1500,walk:220,jump:620});
const base=[[0,0],[700,0],[1250,650],[650,1350],[1350,2000],[2300,1400],[1900,600],[2800,0],[3800,550],[3250,1350],[4300,2050],[5200,1400],[6100,1800],[6900,1800]];
function buildTube(index){const points=base.map(([x,y],i)=>[x*(1+Math.floor(index/3)*.05),y*(index%2?-1:1)+(i>0&&i<base.length-1?Math.sin(i+index)*80:0)]),samples=[];let length=0;
 const push=(x,y)=>{const previous=samples.at(-1);if(previous)length+=Math.hypot(x-previous.x,y-previous.y);samples.push({x,y,distance:length});};
 const line=(point)=>{const from=samples.at(-1),n=Math.max(1,Math.ceil(Math.hypot(point[0]-from.x,point[1]-from.y)/18));for(let j=1;j<=n;j++)push(from.x+(point[0]-from.x)*j/n,from.y+(point[1]-from.y)*j/n);};
 push(...points[0]);
 for(let i=1;i<points.length-1;i++){const a=points[i-1],b=points[i],c=points[i+1],before=Math.hypot(b[0]-a[0],b[1]-a[1]),after=Math.hypot(c[0]-b[0],c[1]-b[1]),d=Math.min(before,after)*.43,entry=[b[0]-(b[0]-a[0])*d/before,b[1]-(b[1]-a[1])*d/before],exit=[b[0]+(c[0]-b[0])*d/after,b[1]+(c[1]-b[1])*d/after];line(entry);for(let j=1;j<=48;j++){const t=j/48,q=1-t;push(q*q*entry[0]+2*q*t*b[0]+t*t*exit[0],q*q*entry[1]+2*q*t*b[1]+t*t*exit[1]);}}
 line(points.at(-1));return Object.freeze({samples,length,speed:2300+Math.floor(index/3)*200});
}
export const BRINQUEDAO_TUBES=Object.freeze(Array.from({length:9},(_,i)=>buildTube(i)));
/** Posição e tangente são compartilhadas pela personagem e pela parede pintada do tubo. */
export function brinquedaoTubePose(index,u){const tube=BRINQUEDAO_TUBES[index],distance=Math.max(0,Math.min(1,u))*tube.length,a=tube.samples;let lo=0,hi=a.length-1;while(lo+1<hi){const mid=(lo+hi)>>1;if(a[mid].distance<distance)lo=mid;else hi=mid;}const p=a[lo],q=a[hi],t=(distance-p.distance)/(q.distance-p.distance||1);return{x:p.x+(q.x-p.x)*t,y:p.y+(q.y-p.y)*t,angle:Math.atan2(q.y-p.y,q.x-p.x),distance};}
export function brinquedaoInsideFloor(x){const smooth=t=>t*t*(3-2*t);if(x<240||x>2360)return 850;if(x<420)return 850+50*smooth((x-240)/180);if(x>2180)return 900-50*smooth((x-2180)/180);return 900;}
