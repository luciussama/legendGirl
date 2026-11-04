/** Primeiro grande guardião: o urso reconhecível, com entrada e fúria próprias. */
export class ArenaBoss {
  /** Inicializa o estado de apresentação do guardião sem iniciar um combate. */
  constructor() {
    this.introduced = false;
    this.titleTime = 0;
  }
  /** Atualiza entrada e fúria do urso usando o estado atual da batalha. */
  update(dt, battle) {
    const enemy = battle.state?.enemy;
    this.titleTime = Math.max(0, this.titleTime - dt);
    if (enemy?.actor !== 'bear') return;
    if (!this.introduced) {
      this.introduced = true;
      this.titleTime = 150;
      battle.presentation?.onImpact?.(enemy.x, 690, true);
      battle.playCombatSound('bear_enrage');
    }
    if (enemy.hp > 0 && enemy.hp <= Math.ceil(enemy.maxHp / 2)) enemy.enrage = true;
  }
  /** Salva a apresentação do guardião para retomá-la sem repetir a introdução. */
  snapshot() {
    return {
      introduced: this.introduced,
      titleTime: this.titleTime
    };
  }
  /** Reaplica o estado serializado, sem alterar a batalha quando não há save. */
  restore(saved) {
    if (saved) {
      this.introduced = Boolean(saved.introduced);
      this.titleTime = saved.titleTime || 0;
    }
  }
}
