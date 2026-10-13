/** As ameaças são os brinquedos conhecidos, reinterpretados pela protagonista. */
export const ARENA_ENEMIES = Object.freeze({
  train: Object.freeze({ title:'Locomotiva de Cerco', role:'cerco', hp:3, speed:3, chargeSpeed:7, color:'#e8a660' }),
  robot: Object.freeze({ title:'Sentinela de Lata', role:'sentinela', hp:4, speed:2.8, chargeSpeed:7, color:'#73d9d4' }),
  dinosaur: Object.freeze({ title:'Dragão de Brinquedo', role:'dragao', hp:4, speed:3.1, chargeSpeed:7.4, color:'#9bcf75' }),
  bear: Object.freeze({ title:'Guardião de Pelúcia', role:'guardiao', hp:8, speed:2.6, chargeSpeed:6.6, color:'#f3cf8b' })
});
export function renderArenaEnemyPresence(ctx, enemy, ground) {
  const profile=ARENA_ENEMIES[enemy.actor];
  ctx.save();
  const shadow=ctx.createRadialGradient(enemy.x,ground,4,enemy.x,ground,140);
  shadow.addColorStop(0,'rgba(24,12,30,.65)');shadow.addColorStop(1,'rgba(24,12,30,0)');
  ctx.translate(enemy.x,ground);ctx.scale(1,.23);ctx.fillStyle=shadow;
  ctx.beginPath();ctx.arc(0,0,140,0,Math.PI*2);ctx.fill();ctx.restore();
  if(enemy.state==='ENRAGE') {
    ctx.save();ctx.globalAlpha=.25+.15*Math.sin(enemy.elapsed*.15);ctx.fillStyle=profile.color;
    ctx.beginPath();ctx.ellipse(enemy.x,ground-120,150,180,0,0,Math.PI*2);ctx.fill();ctx.restore();
  }
}
