/** Reage à antecipação visível da espada; evasões limitadas deixam janelas de punição. */
export function updateArenaEnemyAI(battle, dt) {
  const s=battle.state,e=s.enemy,p=battle.presentation?.enemies?.[e.actor];
  if(!p?.evadeSpeed)return false;
  e.evadeCooldown=Math.max(0,(e.evadeCooldown||0)-dt);
  const player=battle.room.player,side=player.x<e.x?1:-1;
  const distance=Math.abs(player.x-e.x),contact=battle.getEnemyCollisionDistance(e.actor);
  if(e.state==='EVADE') {
    e.facing=-side;
    const speed=p.evadeSpeed*(e.enrage?1.1:1);
    e.x=Math.max(battle.tuning.left+p.bodyWidth/2,Math.min(battle.tuning.right-p.bodyWidth/2,e.x+side*speed*dt));
    if(e.elapsed>=p.evadeTime) {
      e.facing=player.x<e.x?-1:1;
      const attack=e.actor==='robot'?(s.crouching?'Rocket Punch':'Laser Beam')
        :e.actor==='dinosaur'?(distance>contact+95?'Rush':'Bite')
        :s.jump>45?'Toy Leap':distance>contact+80?'Belly Charge':'Bear Hug';
      e.counterAttacks=(e.counterAttacks||0)+1;
      battle.beginEnemyAttack(attack);
    }
    return true;
  }
  const visibleThreat=s.attackTime>8&&battle.room.story.state.attackDirection===side&&distance<contact+100;
  const canRetreat=side>0?e.x<battle.tuning.right-p.bodyWidth/2-35:e.x>battle.tuning.left+p.bodyWidth/2+35;
  if(['IDLE','APPROACH'].includes(e.state)&&visibleThreat&&!e.evadeCooldown&&canRetreat) {
    e.evadeCooldown=p.evadeCooldown*(e.enrage ? .8 : 1);
    e.evasions=(e.evasions||0)+1;
    battle.setEnemyState('EVADE');
    return true;
  }
  return false;
}
