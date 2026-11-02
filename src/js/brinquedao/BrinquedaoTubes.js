/** Quatro tobogãs contínuos; distância de arco mantém velocidade real mesmo nas curvas. */
export const BRINQUEDAO_INSIDE=Object.freeze({legs:4,bodyHeight:96,gravity:1500,walk:900,jump:730});
const routes=[[[0,0],[650,0],[1400,600],[2400,650],[2800,1500],[3800,1600],[4300,800],[5400,800],[6000,1400],[6900,1400]],[[0,0],[650,0],[1500,-750],[2300,-750],[2500,300],[1600,1200],[2500,2100],[3500,2100],[4000,800],[5200,800],[5800,1300],[6500,1300]],[[0,0],[700,0],[1300,1400],[2400,2200],[3500,1100],[4500,1800],[5400,2700],[6500,1800],[7400,1800]],[[0,0],[800,0],[1900,-900],[3100,-900],[3800,600],[4900,1500],[6000,400],[7300,-400],[8500,600],[9400,600]]];
const speeds=[2300,2950,3150,3450];
function buildTube(index){const points=routes[index],samples=[];let length=0;
 const push=(x,y)=>{const previous=samples.at(-1);if(previous)length+=Math.hypot(x-previous.x,y-previous.y);samples.push({x,y,distance:length});};
 const line=(point)=>{const from=samples.at(-1),n=Math.max(1,Math.ceil(Math.hypot(point[0]-from.x,point[1]-from.y)/18));for(let j=1;j<=n;j++)push(from.x+(point[0]-from.x)*j/n,from.y+(point[1]-from.y)*j/n);};
 push(...points[0]);
 for(let i=1;i<points.length-1;i++){const a=points[i-1],b=points[i],c=points[i+1],before=Math.hypot(b[0]-a[0],b[1]-a[1]),after=Math.hypot(c[0]-b[0],c[1]-b[1]),d=Math.min(before,after)*.43,entry=[b[0]-(b[0]-a[0])*d/before,b[1]-(b[1]-a[1])*d/before],exit=[b[0]+(c[0]-b[0])*d/after,b[1]+(c[1]-b[1])*d/after];line(entry);for(let j=1;j<=48;j++){const t=j/48,q=1-t;push(q*q*entry[0]+2*q*t*b[0]+t*t*exit[0],q*q*entry[1]+2*q*t*b[1]+t*t*exit[1]);}}
 line(points.at(-1));return Object.freeze({samples,length,speed:speeds[index],name:['Arrancada do Triângulo','Torre dos Rebotes','Corrida dos Blocos','Tobogã da Chegada'][index],diameter:196+(index%3)*18});
}
export const BRINQUEDAO_TUBES=Object.freeze(Array.from({length:4},(_,i)=>buildTube(i)));
/** Posição e tangente são compartilhadas pela personagem e pela parede pintada do tubo. */
export function brinquedaoTubePose(index,u){const tube=BRINQUEDAO_TUBES[index],distance=Math.max(0,Math.min(1,u))*tube.length,a=tube.samples;let lo=0,hi=a.length-1;while(lo+1<hi){const mid=(lo+hi)>>1;if(a[mid].distance<distance)lo=mid;else hi=mid;}const p=a[lo],q=a[hi],t=(distance-p.distance)/(q.distance-p.distance||1);return{x:p.x+(q.x-p.x)*t,y:p.y+(q.y-p.y)*t,angle:Math.atan2(q.y-p.y,q.x-p.x),distance};}
