/** Primeiro grande guardião: o urso reconhecível, com entrada e fúria próprias. */
export class ArenaBoss {
  constructor() { this.introduced = false; this.titleTime = 0; }
  update(dt, battle) {
    const enemy=battle.state?.enemy;
    this.titleTime=Math.max(0,this.titleTime-dt);
    if(enemy?.actor!=='bear') return;
    if(!this.introduced) {
      this.introduced=true;this.titleTime=150;
      battle.presentation?.onImpact?.(enemy.x,690,true);
      battle.playCombatSound('bear_enrage');
    }
    if(enemy.hp>0 && enemy.hp<=Math.ceil(enemy.maxHp/2)) enemy.enrage=true;
  }
  snapshot() { return { introduced:this.introduced,titleTime:this.titleTime }; }
  restore(saved) { if(saved){this.introduced=Boolean(saved.introduced);this.titleTime=saved.titleTime||0;} }
}
