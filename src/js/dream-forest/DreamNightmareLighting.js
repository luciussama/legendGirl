import {NIGHTMARE,nightmareBeam,nightmareRayEnd} from './DreamNightmare.js';
import {DREAM_MUD_LAKES,mudWaterline} from './DreamMud.js';
import {stealthGround} from './DreamStealthLevel.js';

const surfaceHeight=x=>{const lake=DREAM_MUD_LAKES.find(l=>x>=l.from&&x<=l.to);return lake?mudWaterline(lake,x):stealthGround(x);};
// Limite conservador para não marchar raios no espaço acima de qualquer superfície.
const surfaceMinimum=Math.min(...Array.from({length:Math.ceil(NIGHTMARE.width/2)+1},(_,i)=>surfaceHeight(i*2)))-16;

/** Luz em camadas: volume no ar, penumbra e resposta difusa/especular dos materiais. */
export class DreamNightmareLighting{
  constructor(){this.buffer=document.createElement('canvas');this.ctx=this.buffer.getContext('2d');}
  /** A luz visível termina na superfície, sem atravessar a água nem o chão ilustrado. */
  surfaceEnd(light,angle){
    const end=nightmareRayEnd(light,angle),dx=Math.cos(angle),dy=Math.sin(angle);
    if(dy<=0)return end;
    for(let d=Math.max(8,Math.floor((surfaceMinimum-light.y)/dy/8)*8);d<=end.distance+8;d+=8){const far=Math.min(d,end.distance);if(light.y+dy*far<surfaceHeight(light.x+dx*far))continue;let lo=Math.max(0,far-8),hi=far;for(let i=0;i<10;i++){const mid=(lo+hi)/2;if(light.y+dy*mid>=surfaceHeight(light.x+dx*mid))hi=mid;else lo=mid;}return{x:light.x+dx*hi,y:light.y+dy*hi,distance:hi};}
    return end;
  }
  /** Buffer reutilizado em meia resolução; desfoque expresso em unidades do mundo. */
  begin(canvas,frame){const w=Math.ceil(canvas.width/2),h=Math.ceil(canvas.height/2);if(this.buffer.width!==w||this.buffer.height!==h){this.buffer.width=w;this.buffer.height=h;}const c=this.ctx;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,w,h);c.setTransform(frame.scale/2,0,0,frame.scale/2,-frame.left*frame.scale/2,frame.top/2);return c;}
  /** Cones em camadas com emissão extensa: bordas suaves e sombra de contato preservada. */
  air(ctx,canvas,frame,lights){const c=this.begin(canvas,frame);
    c.globalCompositeOperation='lighter';
    for(const light of lights)for(let source=-1;source<=1;source++){
      const emitter={...light,x:light.x+source*5},samples=nightmareBeam(emitter).slice(1).map(p=>{const angle=Math.atan2(p.y-emitter.y,p.x-emitter.x);return{angle,point:this.surfaceEnd(emitter,angle)};});
      for(let layer=1;layer<=12;layer++){
        const half=light.half*(.18+.82*layer/12),from=light.angle-half,to=light.angle+half,points=[this.surfaceEnd(emitter,from),...samples.filter(p=>p.angle>from&&p.angle<to).map(p=>p.point),this.surfaceEnd(emitter,to)];
        const g=c.createRadialGradient(emitter.x,emitter.y,8,emitter.x,emitter.y,NIGHTMARE.range);g.addColorStop(0,'rgba(255,225,169,.018)');g.addColorStop(.35,'rgba(235,218,179,.009)');g.addColorStop(1,'rgba(212,220,202,0)');c.fillStyle=g;c.beginPath();c.moveTo(emitter.x,emitter.y);for(const p of points)c.lineTo(p.x,p.y);c.closePath();c.fill();
      }
    }
    c.globalCompositeOperation='source-over';ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='screen';ctx.filter=`blur(${Math.max(.6,frame.scale*2)}px)`;ctx.drawImage(this.buffer,0,0,canvas.width,canvas.height);ctx.restore();
  }
  /** O material conserva seus pigmentos; somente a área atingida recebe luz. */
  receiver(ctx,light,draw){const c=this.ctx;c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,this.buffer.width,this.buffer.height);c.restore();draw(c);c.save();c.globalCompositeOperation='destination-in';const g=c.createRadialGradient(light.x,light.y,8,light.x,light.y,NIGHTMARE.range);g.addColorStop(0,'rgba(255,227,170,.8)');g.addColorStop(1,'rgba(237,211,158,0)');c.fillStyle=g;c.beginPath();c.moveTo(light.x,light.y);for(const p of nightmareBeam(light).slice(1)){const a=Math.atan2(p.y-light.y,p.x-light.x);c.lineTo(p.x+Math.cos(a)*45,p.y+Math.sin(a)*45);}c.closePath();c.fill();c.globalCompositeOperation='source-in';const edge=light.half/(Math.PI*2),angular=c.createConicGradient(light.angle-Math.PI,light.x,light.y);angular.addColorStop(0,'rgba(255,226,162,0)');angular.addColorStop(.5-edge,'rgba(255,226,162,0)');angular.addColorStop(.5,'rgba(255,226,162,.9)');angular.addColorStop(.5+edge,'rgba(255,226,162,0)');angular.addColorStop(1,'rgba(255,226,162,0)');c.fillStyle=angular;c.fillRect(light.x-NIGHTMARE.range,light.y-NIGHTMARE.range,NIGHTMARE.range*2,NIGHTMARE.range*2);c.restore();ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='soft-light';ctx.filter='blur(3px)';ctx.drawImage(this.buffer,0,0,this.buffer.width*2,this.buffer.height*2);ctx.restore();}
  /** Mancha difusa sobre terra e relevos, orientada pela inclinação da superfície atingida. */
  ground(ctx,lights){ctx.save();ctx.globalCompositeOperation='soft-light';for(const light of lights)for(let i=1;i<24;i++){const angle=light.angle-light.half+2*light.half*i/24,p=this.surfaceEnd(light,angle);if(DREAM_MUD_LAKES.some(l=>p.x>=l.from&&p.x<=l.to)||Math.abs(p.y-stealthGround(p.x))>1)continue;const strength=Math.sin(Math.PI*i/24)**2*Math.max(0,1-p.distance/NIGHTMARE.range);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(stealthGround(p.x+4)-stealthGround(p.x-4),8));ctx.scale(1,.28);const g=ctx.createRadialGradient(0,0,0,0,0,55);g.addColorStop(0,`rgba(255,222,160,${strength*.18})`);g.addColorStop(1,'rgba(255,222,160,0)');ctx.fillStyle=g;ctx.fillRect(-55,-55,110,110);ctx.restore();}ctx.restore();}
  /** Reflexo achatado e fragmentado por ondulações, limitado ao contorno líquido da pintura. */
  water(ctx,lights,lake,time){ctx.save();ctx.beginPath();lake.path.forEach(([u,v],i)=>i?ctx.lineTo(lake.paintX+u*lake.w,lake.top+v*lake.h):ctx.moveTo(lake.paintX+u*lake.w,lake.top+v*lake.h));ctx.lineTo(lake.to,lake.top+lake.h*.82);ctx.lineTo(lake.from,lake.top+lake.h*.82);ctx.closePath();ctx.clip();ctx.globalCompositeOperation='screen';
    for(const light of lights)for(let i=0;i<=32;i++){const angle=light.angle-light.half+2*light.half*i/32,p=this.surfaceEnd(light,angle);if(p.x<lake.from||p.x>lake.to||Math.abs(p.y-mudWaterline(lake,p.x))>1)continue;const strength=Math.pow(Math.sin(Math.PI*i/32),2)*Math.max(0,1-p.distance/NIGHTMARE.range);ctx.save();ctx.translate(p.x,p.y+5);ctx.scale(1,.2);const g=ctx.createRadialGradient(0,0,0,0,0,62);g.addColorStop(0,`rgba(255,226,160,${strength*.14})`);g.addColorStop(1,'rgba(237,210,151,0)');ctx.fillStyle=g;ctx.fillRect(-62,-62,124,124);ctx.restore();for(let r=0;r<5;r++){const x=p.x+Math.sin(time*1.7+r*2+i*.6)*(3+r),y=p.y+3+r*4;ctx.strokeStyle=`rgba(255,231,175,${strength*.12*(1-r/6)})`;ctx.lineWidth=1.1;ctx.beginPath();ctx.ellipse(x,y,7+r*2,1,0,0,Math.PI);ctx.stroke();}}
    ctx.restore();
  }
  destroy(){this.buffer.width=1;this.buffer.height=1;}
}
