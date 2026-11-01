import {ROACH_STEP_SECONDS,dreamRoachPose,dreamRoachPoint} from './DreamRoach.js';
const clamp=v=>Math.max(0,Math.min(1,v));
/** O impacto coincide com a troca dos tripés; o relógio salvo torna pausa/retomada determinísticas. */
export function roachFootfall(time,velocity=160){const beat=ROACH_STEP_SECONDS/2,index=Math.floor(time/beat),age=time-index*beat;return{index,age,legs:index%2?[2,3,5]:[0,1,4],strength:Math.min(1,Math.abs(velocity)/160)};}
/** Tremor apenas da composição visual; não modifica câmera, posição, colisões ou controles. */
export function roachScreenShake(time,velocity=160,stompAge=-1){const step=roachFootfall(time,velocity),pulse=Math.exp(-step.age*12)*step.strength,stomp=stompAge>=0&&stompAge<.65?Math.exp(-stompAge*8):0,power=4.8*pulse+12*stomp;return{x:Math.sin(time*83)*power*.65,y:Math.cos(time*107)*power};}
function cloud(ctx,x,y,age,power,seed){if(age<0||age>.95||power<.02)return;ctx.save();for(let i=0;i<9;i++){const n=Math.sin(seed*17.3+i*9.7),spread=(20+age*90)*power,px=x+n*spread,py=y-5-age*(18+Math.abs(n)*18),r=(7+age*24)*(1+Math.abs(n)*.4)*power,g=ctx.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,`rgba(136,126,109,${.28*power*(1-clamp(age/.95))})`);g.addColorStop(1,'rgba(102,98,87,0)');ctx.fillStyle=g;ctx.fillRect(px-r,py-r,r*2,r*2);}ctx.restore();}
/** Poeira nasce nas pontas que tocaram o solo, sem prender a nuvem ao corpo em movimento. */
export function drawRoachDust(ctx,rig,p,time,{stompAge=-1,stompPoint=null}={}){if(!rig)return;const velocity=p.velocity??140,step=roachFootfall(time,velocity),beat=ROACH_STEP_SECONDS/2;for(let old=0;old<2;old++){const age=step.age+old*beat,fall=roachFootfall(time-age+.00001,velocity),pose=dreamRoachPose(time-age,velocity),past={...p,x:p.x-velocity*age,pose};for(const index of fall.legs){const tip=pose.legs[index].tip,point=dreamRoachPoint(past,tip[0]/rig.width,tip[1]/rig.height);cloud(ctx,point.x,point.y,age,(.65+.45*step.strength)*step.strength*p.width/1900,fall.index*7+index);}}
 if(stompPoint)cloud(ctx,stompPoint.x,stompPoint.y,stompAge,1.8,time-stompAge);
}
