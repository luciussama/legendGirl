import { getDialogueSafeArea, getDialogueBoxY } from '../ui/DialogueSafeArea.js';
import { applyArtFinish } from '../effects/ArtFinish.js';

export const OPENING_STORAGE_KEY = 'legendGirl.bedroom-opening.completed.v1';
let completedInSession = false;
const smooth = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
export const OPENING_DIALOGUE = [
  [4, 9, 'Levanta, dorminhoca.\nTemos que brincar.\nVocê dormiu demais.'],
  [10, 13, 'Nossa...\nO seu quarto está uma bagunça.'],
  [14, 20, 'Pra chegar na porta do quarto,\nvamos ter que saltar sobre os brinquedos.'],
  [21, 24, 'LEVANTA, SUA PREGUIÇOSA!'],
  [25, 29, 'SENÃO A GENTE NÃO SAI DAQUI NUNQUINHA!']
];

/** Relógio narrativo independente; nunca controla nem avança a física da personagem. */
export class OpeningSequence {
  constructor({storage, onReveal = () => {}, onComplete = () => {}, onCue = () => {}} = {}) {
    if (storage === undefined) { try { storage = globalThis.localStorage; } catch {} }
    this.storage = storage;
    this.onReveal = onReveal;
    this.onComplete = onComplete;
    this.onCue = onCue;
    this.active = false;
    this.time = 0;
    this.cues = new Set();
  }
  hasCompleted() {
    if (this.completedOverride !== undefined) return this.completedOverride;
    try { return completedInSession || this.storage?.getItem(OPENING_STORAGE_KEY) === '1'; }
    catch { return completedInSession; }
  }
  start() {
    if (this.active) return true;
    if (this.hasCompleted()) return false;
    this.time = 0; this.active = true; this.cues.clear();
    this.onCue('ambience');
    return true;
  }
  cancel() { this.active = false; }
  reset() {
    this.cancel(); this.time = 0; this.cues.clear(); completedInSession = false; this.completedOverride = false;
    try { this.storage?.removeItem(OPENING_STORAGE_KEY); } catch {}
  }
  snapshot() {
    return { active: this.active, time: this.time, cues: [...this.cues], completed: this.hasCompleted() };
  }
  restore(saved) {
    this.active = saved.active; this.time = saved.time;
    this.cues = new Set(saved.cues); completedInSession = saved.completed; this.completedOverride = saved.completed;
    try {
      if (saved.completed) this.storage?.setItem(OPENING_STORAGE_KEY, '1');
      else this.storage?.removeItem(OPENING_STORAGE_KEY);
    } catch {}
  }
  get revealing() { return this.time >= 36; }
  update(dt) {
    if (!this.active) return;
    this.time += Math.max(0, dt) / 60;
    for (const [at, name] of [[4,'voice'],[10,'voice'],[14,'voice'],[21,'shout'],[25,'shout'],[29,'wake'],[36,'reveal']]) {
      if (this.time >= at && !this.cues.has(name+at)) {
        this.cues.add(name+at);
        if (name === 'reveal') this.onReveal(); else this.onCue(name);
      }
    }
    if (this.time >= 37.5) {
      completedInSession = true; this.completedOverride = true;
      try { this.storage?.setItem(OPENING_STORAGE_KEY, '1'); } catch { /* alternativa restrita à sessão */ }
      this.active = false;
      this.onComplete();
    }
  }
  renderFade(ctx, canvas) {
    const opacity = this.revealing ? 1 - smooth((this.time - 36) / 1.5) :
      this.time < 2 ? 1 - smooth(this.time / 2) : smooth((this.time - 35) / 1);
    if (!opacity) return;
    ctx.save(); ctx.fillStyle = `rgba(3,5,12,${opacity})`;
    ctx.fillRect(0,0,canvas.width,canvas.height); ctx.restore();
  }
  render(ctx, canvas, {assets, drawRoom, lighting, fairyRenderer}) {
    const t = this.time, floor = Math.min(470, canvas.height - 90);
    const bedWidth = Math.min(310, canvas.width * 0.55);
    const bedX = Math.max(24, canvas.width * 0.13), bedY = floor - bedWidth * 364 / 510;
    const entry = smooth((t - 1.5) / 2.5), urgent = t >= 21 && t < 29;
    const fx = bedX + 80 + (urgent ? 0 : Math.sin(t * 1.4) * 28) + (1-entry)*180 + smooth((t-32)/2)*100;
    const fy = bedY + (urgent ? 75 : 30) + Math.sin(t*2)*4;
    const fairy = {x:fx,y:fy,vx:urgent?3:0,vy:0,floatAngle:t,flutterPhase:t*(urgent?30:18),particles:[],spinAnim:0};
    const child = {x:bedX+65,y:bedY+75,w:38,h:44,currentPlatformIndex:-1};
    ctx.save();
    const zoom = 1 + (urgent ? 0.07*smooth((t-21)/0.8) : 0);
    ctx.translate(canvas.width/2,canvas.height/2);ctx.scale(zoom,zoom);ctx.translate(-canvas.width/2,-canvas.height/2);
    drawRoom();
    const sheet = assets.get('opening-waking-up');
    if (sheet) {
      const frame = t<29?0:t<30.5?1:t<32.5?2:3;
      // O recorte e a linha de base compartilhados mantêm a cama fixa em todas as poses do despertar.
      ctx.drawImage(sheet, frame*543+20,200,510,364,bedX,bedY,bedWidth,bedWidth*364/510);
    }
    ctx.save();ctx.globalAlpha=entry;
    fairyRenderer.render(ctx,fairy,{tick:Math.floor(t*60)},0,{canvas,baby:child,platforms:[]});
    ctx.restore();
    lighting.apply(ctx,canvas,{tick:Math.floor(t*60),plotTwistActive:true},child,
      {...fairy,y:fy+(1-entry)*900},0,0,{platforms:[]});
    ctx.restore();
    const line = OPENING_DIALOGUE.find(([from,to])=>t>=from&&t<to);
    applyArtFinish(ctx, canvas);
    if (line) {
      ctx.save();
      const safe=getDialogueSafeArea(canvas);
      const width=Math.min(680,canvas.width-40,safe.right-safe.left-2*Math.max(20,safe.marginX)), font=canvas.width<600?20:23;
      const centerX=(safe.left+safe.right)/2;
      ctx.font=`${urgent?'bold ':''}${font}px Georgia, serif`;
      const lines=[];
      for(const paragraph of line[2].split('\n')) {
        let current='';
        for(const word of paragraph.split(' ')) {
          const next=current?current+' '+word:word;
          if(ctx.measureText(next).width>width-40&&current){lines.push(current);current=word;}else current=next;
        }
        lines.push(current);
      }
      const height=lines.length*(font+9)+54, y=getDialogueBoxY(safe,height,24,{
        top:canvas.height/2+(child.y-canvas.height/2)*zoom,
        bottom:canvas.height/2+(child.y+child.h-canvas.height/2)*zoom
      });
      ctx.fillStyle='rgba(7,10,20,0.94)';ctx.beginPath();ctx.roundRect(centerX-width/2,y,width,height,16);ctx.fill();
      ctx.textAlign='center';ctx.fillStyle='#b9c9e7';ctx.font='13px sans-serif';ctx.fillText('FADINHA',centerX,y+24);
      ctx.font=`${urgent?'bold ':''}${font}px Georgia, serif`;ctx.fillStyle='#f5eddf';
      lines.forEach((text,i)=>ctx.fillText(text,centerX,y+54+i*(font+9)));
      ctx.restore();
    }
    this.renderFade(ctx,canvas);
  }
}
