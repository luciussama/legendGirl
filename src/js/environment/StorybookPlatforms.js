/** Visual-only toys. Every contact edge is derived from the existing support. */
const INK = '#2c1b22';
const palettes = {
  wood: ['#d3a061', '#87512e', '#3c2521'],
  brass: ['#f4d084', '#b68739', '#584126'],
  paper: ['#ecd7a1', '#baa071', '#6a4a38'],
  cloth: ['#bd7680', '#793c56', '#382339'],
  stone: ['#cab18b', '#8b7769', '#423a40'],
  purple: ['#b888b5', '#67406e', '#322638']
};
function gradient(ctx,y,h,colors) {
  const g=ctx.createLinearGradient(0,y,0,y+h);
  colors.forEach((c,i)=>g.addColorStop(i/(colors.length-1),c));return g;
}
function box(ctx,x,y,w,h,material='wood',radius=3) {
  ctx.fillStyle=gradient(ctx,y,h,palettes[material]);
  ctx.beginPath();ctx.roundRect(x,y,w,h,radius);ctx.fill();
  ctx.strokeStyle=INK;ctx.lineWidth=1.3;ctx.stroke();
  ctx.save();ctx.clip();
  // Stable, fine material marks: no random flicker and no painted pixels beyond
  // the object's outline. Warm grain and stitching replace flat UI-like fills.
  for(let i=0;i<Math.floor(w*h/28);i++) {
    const xx=x+2+((i*31+7) % Math.max(1,Math.floor(w-4)));
    const yy=y+3+((i*17+11) % Math.max(1,Math.floor(h-6)));
    ctx.fillStyle=i%3?'rgba(30,15,18,0.12)':'rgba(255,216,150,0.18)';
    ctx.fillRect(xx,yy,material==='cloth'?1:2+i%5,.55);
  }
  ctx.restore();
  line(ctx,[[x+3,y+2],[x+w-4,y+2]],palettes[material][0],.8);
}
function line(ctx,points,color=INK,width=1) {
  ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
}
function ellipse(ctx,x,y,rx,ry,color) {
  ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
  ctx.strokeStyle=INK;ctx.lineWidth=1;ctx.stroke();
}
export function drawContactEdge(ctx,x,y,w,material='wood',depth=5) {
  const colors=palettes[material]||palettes.wood;
  ctx.fillStyle=gradient(ctx,y,depth,colors);ctx.fillRect(x,y,w,depth);
  ctx.fillStyle=colors[0];ctx.fillRect(x,y,w,1);
  ctx.fillStyle=colors[2];ctx.fillRect(x,y+depth-1,w,1);
  // Small finish marks live below the contact plane; never imply extra support.
  for(let i=7;i<w-4;i+=19)line(ctx,[[x+i,y+2],[x+Math.min(w-2,i+9),y+3]],colors[1],.6);
}
function book(ctx,x,y,w,h,material='purple') {
  box(ctx,x,y+2,w,h,material,2);
  box(ctx,x+3,y+5,w-6,h-9,'paper',1);
  for(let yy=y+8;yy<y+h-4;yy+=3)line(ctx,[[x+5,yy],[x+w-5,yy]],'#8d704d',.6);
  for(const xx of [x+2,x+w-9]){ctx.fillStyle='#bd9457';ctx.fillRect(xx,y+3,7,3);}
  drawContactEdge(ctx,x,y,w,material,4);
}
function drawToy(ctx,p,w,assets,tick) {
  switch(p.style) {
    case 'toppled_blocks': {
      const colors=['#8f4140','#36576c','#967b38'];
      for(let i=0;i<3;i++) {
        const x=i*w/3,bw=w/3;box(ctx,x,0,bw,30,'wood',3);
        ctx.fillStyle=colors[i];ctx.fillRect(x+4,4,bw-8,21);
        ctx.strokeStyle='#d1aa6e';ctx.strokeRect(x+6,6,bw-12,17);
        ctx.fillStyle='#efd49c';ctx.font='bold 15px Georgia';ctx.textAlign='center';ctx.fillText('ABC'[i],x+bw/2,21);
        drawContactEdge(ctx,x,0,bw,'wood',3);
      }return true;
    }
    case 'floppy_ragdoll': {
      // The folded dress forms a broad level cushion; limbs hang below it.
      ellipse(ctx,17,23,15,17,'#c5a17c');
      for(let i=0;i<7;i++)line(ctx,[[5+i*4,12],[1+i*4,25]],'#684331',2);
      ellipse(ctx,12,22,2,2,'#33242b');ellipse(ctx,22,22,2,2,'#33242b');
      line(ctx,[[12,30],[17,32],[22,30]],'#734239');
      box(ctx,28,4,w-45,30,'cloth',8);
      box(ctx,w-23,11,18,11,'paper',4);box(ctx,w-25,24,22,10,'paper',4);
      for(let x=35;x<w-25;x+=7)line(ctx,[[x,8],[x+2,28]],'#ce9a8c',.7);
      box(ctx,0,0,w,9,'cloth',3);drawContactEdge(ctx,0,0,w,'cloth',3);
      for(let x=4;x<w;x+=6)line(ctx,[[x,5],[x+2,7]],'#e7bea0',.7);
      return true;
    }
    case 'spilled_crayons_box': {
      box(ctx,0,0,w,25,'wood',3);
      const hues=['#a74555','#497c87','#8c9a64','#77618d'];
      for(let i=0;i<4;i++){
        ctx.save();ctx.translate(10+i*(w-25)/4,16);ctx.rotate((i-1.5)*.12);
        box(ctx,0,0,12,31,'paper',2);ctx.fillStyle=hues[i];ctx.fillRect(1,6,10,18);
        line(ctx,[[1,9],[11,9]],'#dfc798',1);ctx.restore();
      }drawContactEdge(ctx,0,0,w,'wood',6);return true;
    }
    case 'crooked_fairytales': {
      book(ctx,2,20,w-4,18,'cloth');book(ctx,-2,11,w+2,16,'wood');book(ctx,0,0,w,18,'purple');return true;
    }
    case 'floating_books': {
      book(ctx,0,0,w,27,'wood');
      ctx.fillStyle='#eed6a4';ctx.fillRect(5,6,w-10,15);
      line(ctx,[[w/2,5],[w/2,22]],'#765137',1.5);
      for(let y=9;y<20;y+=3)for(const x of [8,w/2+4])
        line(ctx,[[x,y],[x+w/2-13,y]],'#b09265',.7);
      ctx.fillStyle='#8e3949';ctx.fillRect(w*.7,24,5,14);
      return true;
    }
    case 'dented_drum': {
      box(ctx,3,2,w-6,47,'cloth',7);
      for(let x=7;x<w-8;x+=14)line(ctx,[[x,6],[x+7,39],[x+14,6]],'#d5b66f',1.3);
      drawContactEdge(ctx,2,40,w-4,'brass',6);drawContactEdge(ctx,0,0,w,'brass',7);
      ctx.fillStyle='#4c2933';ctx.fillRect(7,8,w-14,3);return true;
    }
    case 'slumped_bear': {
      const img=assets?.get('dark-room-sprite-giant-bear');
      if(img){const scale=w/1000;ctx.drawImage(img,-460*scale,-139*scale,img.width*scale,img.height*scale);}
      else {box(ctx,0,0,w,35,'wood',12);ellipse(ctx,w/2,20,12,9,'#d0ae7b');}
      drawContactEdge(ctx,0,0,w,'wood',3);return true;
    }
    case 'tilted_xylophone': {
      box(ctx,0,7,w,20,'wood',4);
      const hues=['#aa5350','#b27a44','#bfa958','#6e916b','#4d7e85','#76648c'];
      for(let i=0;i<6;i++){
        const x=i*w/6;box(ctx,x,0,w/6,19-i,'brass',2);
        ctx.fillStyle=hues[i];ctx.fillRect(x+1,0,w/6-2,14-i);
        ellipse(ctx,x+w/12,9,1.4,1.4,'#dfc18a');
      }drawContactEdge(ctx,0,0,w,'wood',2);return true;
    }
    case 'derailed_train': {
      const img=assets?.get('dark-room-sprite-train-trestle');
      if(img)ctx.drawImage(img,0,0,464,205,0,-w*205/464,w,w*205/464);
      drawContactEdge(ctx,0,0,w,'wood',10);
      for(const x of [8,w-17]){box(ctx,x,10,9,32,'wood',2);line(ctx,[[x+7,35],[x+21,11]],'#b48a51',3);}
      return true;
    }
    case 'wobbly_card_house': {
      for(const [x,angle] of [[w*.26,-.38],[w*.69,.38]]) {
        ctx.save();ctx.translate(x,7);ctx.rotate(angle);box(ctx,-10,0,20,38,'paper',2);
        ctx.fillStyle='#8f3e4b';ctx.font='15px Georgia';ctx.fillText('♥',-6,24);ctx.restore();
      }
      box(ctx,0,0,w,7,'paper',1);drawContactEdge(ctx,0,0,w,'paper',3);return true;
    }
    case 'leaning_music_box': {
      box(ctx,0,0,w,35,'wood',5);box(ctx,4,8,w-8,20,'purple',3);
      for(const x of [7,w-14]){ellipse(ctx,x,18,3,5,'#b98b43');line(ctx,[[x-2,19],[x+3,15]],'#f0cf8b');}
      ctx.fillStyle='#e7c875';ctx.font='18px Georgia';ctx.textAlign='center';ctx.fillText('♫',w/2,25);
      drawContactEdge(ctx,0,0,w,'brass',5);return true;
    }
    case 'loose_robot': {
      box(ctx,3,0,w-6,40,'stone',7);box(ctx,7,7,w-14,20,'brass',4);
      ellipse(ctx,w*.32,17,5,5,'#4b777c');ellipse(ctx,w*.68,17,5,5,'#4b777c');
      for(let x=16;x<w-12;x+=6)line(ctx,[[x,31],[x+2,34]],'#392d2b');
      for(const x of [7,w-10])ellipse(ctx,x,35,2,2,'#b88d50');
      drawContactEdge(ctx,0,0,w,'brass',5);return true;
    }
    case 'spinning_top': {
      const img=assets?.get('dark-room-modern-spinning-top');
      if(img){ctx.save();ctx.beginPath();ctx.rect(0,0,w,w);ctx.clip();
        ctx.drawImage(img,57,425,1141,633,0,0,w,w*633/1141);ctx.restore();}
      else {box(ctx,0,0,w,14,'brass');}
      drawContactEdge(ctx,0,0,w,'brass',3);return true;
    }
    case 'floating_spool': {
      box(ctx,5,5,w-10,37,'purple',5);
      for(let y=10;y<38;y+=3)line(ctx,[[8,y],[w-8,y+1]],y%2?'#ad83ad':'#482c50',1);
      box(ctx,0,35,w,9,'wood');drawContactEdge(ctx,0,0,w,'wood',8);
      ctx.beginPath();ctx.moveTo(w-6,20);ctx.bezierCurveTo(w+18,26,w+10,38,w+21,46);
      ctx.strokeStyle='#b981a7';ctx.lineWidth=2;ctx.stroke();return true;
    }
    case 'unbalanced_mobile': {
      drawContactEdge(ctx,0,0,w,'brass',7);
      for(let i=0;i<3;i++){
        const x=w*(i+1)/4,y=26+i%2*12+Math.sin(tick*.04+i)*2;
        line(ctx,[[x,7],[x,y]],'#b59158',.8);ellipse(ctx,x,y+4,5,5,i%2?'#7b718d':'#c3a56c');
        ellipse(ctx,x-1,y+3,1,1,'#ecd394');
      }return true;
    }
    case 'levitating_grimoire': {
      book(ctx,0,0,w,21,'purple');ctx.fillStyle='#c6a263';ctx.font='12px Georgia';ctx.fillText('✦',w/2-5,15);
      ctx.fillStyle='#873a51';ctx.fillRect(w*.72,20,5,14);
      // Only the light moves; the physical cover stays aligned with the feet.
      ctx.save();ctx.globalAlpha=.35+.15*Math.sin(tick*.06);ctx.strokeStyle='#f5d890';ctx.lineWidth=.8;ctx.strokeRect(2,2,w-4,17);ctx.restore();return true;
    }
    default:return false;
  }
}
export function drawStorybookPlatform(ctx,assets,p,sx,tick=0) {
  const support=p.standRegion||p, x=sx+support.x-p.x,y=p.surfaceTopY??support.y??p.y,w=support.w;
  if(p.style==='block_castle') {
    const img=assets?.get('dark-room-modern-castle');if(!img)return false;
    // Narrow tower is the only top; lower battlements remain decorative.
    ctx.save();const scale=w/318, height=Math.min(220,470-y);
    ctx.drawImage(img,42,324,1171,769,x-(468-42)*scale,y,1171*scale,height);
    drawContactEdge(ctx,x,y,w,'stone',3);ctx.restore();return true;
  }
  if(p.style==='true_portal_balcony')return false; // Shared painted portal renderer.
  ctx.save();ctx.translate(x,y);const drawn=drawToy(ctx,p,w,assets,tick);ctx.restore();return drawn;
}
