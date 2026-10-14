/** As ameaças são os brinquedos conhecidos, reinterpretados pela protagonista. */
export const ARENA_ENEMIES = Object.freeze({
  train: Object.freeze({ title:'Locomotiva de Cerco', role:'cerco', hp:3, speed:3, chargeSpeed:7, color:'#e8a660', idleTime:45, retreatTime:30, recovery:36, bodyWidth:340, bodyHeight:225, stepTime:18 }),
  robot: Object.freeze({ title:'Sentinela de Lata', role:'sentinela', hp:4, speed:3.8, chargeSpeed:7.5, color:'#73d9d4', idleTime:30, retreatTime:24, recovery:32, evadeSpeed:14, evadeTime:8, evadeCooldown:150, bodyWidth:140, bodyHeight:250, stepTime:16 }),
  dinosaur: Object.freeze({ title:'Dragão de Brinquedo', role:'dragao', hp:4, speed:4.8, chargeSpeed:8.2, color:'#9bcf75', idleTime:20, retreatTime:18, recovery:28, evadeSpeed:11.5, evadeTime:8, evadeCooldown:120, bodyWidth:250, bodyHeight:250, stepTime:12 }),
  bear: Object.freeze({ title:'Guardião de Pelúcia', role:'guardiao', hp:8, speed:5.4, chargeSpeed:9, color:'#f3cf8b', idleTime:12, retreatTime:14, recovery:24, evadeSpeed:12.5, evadeTime:8, evadeCooldown:95, bodyWidth:235, bodyHeight:325, stepTime:14 })
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
