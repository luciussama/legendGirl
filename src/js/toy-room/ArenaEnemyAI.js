const BEHAVIOR_MEMORY = 180;
const ADAPTIVE_ENEMIES = new Set(['robot', 'dinosaur', 'bear']);
const ATTACK_STRATEGY = Object.freeze({
  'Steam Blast': { range: 1, pressure: 0, antiJump: 0.05 },
  'Front Charge': { range: 0.4, pressure: 1, antiJump: 0.35 },
  'Laser Beam': { range: 1, pressure: 0.15, antiJump: 0.25 },
  'Rocket Punch': { range: 0.78, pressure: 0.65, antiJump: 0.6 },
  Bite: { range: 0.3, pressure: 0, antiJump: 0.1 },
  Rush: { range: 0.55, pressure: 1, antiJump: 0.75 },
  'Bear Hug': { range: 0.25, pressure: 0.15, antiJump: 0.1 },
  'Belly Charge': { range: 0.72, pressure: 1, antiJump: 0.45 },
  'Toy Leap': { range: 0.38, pressure: 0.5, antiJump: 1 }
});

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function updatePlayerBehavior(battle, dt) {
  const { state: s, room } = battle;
  const enemy = s.enemy;
  const contact = battle.getEnemyCollisionDistance(enemy.actor);
  const distance = Math.abs(room.player.x - enemy.x);
  const memory = s.playerBehavior ??= { samples: 0, jumping: 0, attacking: 0, distant: 0 };
  const alpha = 1 - Math.exp(-dt / BEHAVIOR_MEMORY);
  const observations = {
    jumping: s.jump > 45 ? 1 : 0,
    attacking: s.attackTime > 0 ? 1 : 0,
    distant: distance > contact + 150 ? 1 : 0
  };

  memory.samples = Math.min(BEHAVIOR_MEMORY, memory.samples + dt);
  for (const [behavior, value] of Object.entries(observations))
    memory[behavior] += (value - memory[behavior]) * alpha;
}

/** Seleciona um golpe existente conforme o espaçamento, os hábitos recentes e a variedade. */
export function selectArenaEnemyAttack(battle, distance, attacks) {
  const enemy = battle.state.enemy;
  if (!battle.presentation || !ADAPTIVE_ENEMIES.has(enemy.actor)) return null;

  const behavior = battle.state.playerBehavior;
  if (!behavior || behavior.samples < 30) return null;

  const contact = battle.getEnemyCollisionDistance(enemy.actor);
  const rangePressure = Math.max(
    behavior.distant,
    clamp((distance - contact - 90) / 220, 0, 1)
  );
  let bestAttack = null;
  let bestScore = -Infinity;
  for (const attack of attacks) {
    const strategy = ATTACK_STRATEGY[attack];
    if (!strategy) continue;
    const repeatPenalty = enemy.lastAIChoice === attack ? 0.18 : (enemy.recentAIChoices ?? []).includes(attack) ? 0.08 : 0;
    const crouchPenalty = battle.state.crouching && ['Laser Beam', 'Rocket Punch'].includes(attack) ? 0.8 : 0;
    const recoveryPressure = battle.state.cooldown > battle.state.attackTime ? 0.35 : 0;
    const score = rangePressure * strategy.range
      + (behavior.attacking + recoveryPressure) * strategy.pressure
      + behavior.jumping * strategy.antiJump
      - repeatPenalty - crouchPenalty;
    if (score > bestScore) {
      bestAttack = attack;
      bestScore = score;
    }
  }
  return bestAttack;
}

/** Reage à preparação visível da espada e mantém uma memória curta dos hábitos da jogadora. */
export function updateArenaEnemyAI(battle, dt) {
  const s = battle.state, e = s.enemy, p = battle.presentation?.enemies?.[e.actor];
  updatePlayerBehavior(battle, dt);
  if (!p?.evadeSpeed) return false;

  e.evadeCooldown = Math.max(0, (e.evadeCooldown || 0) - dt);
  const player = battle.room.player, side = player.x < e.x ? 1 : -1;
  const distance = Math.abs(player.x - e.x), contact = battle.getEnemyCollisionDistance(e.actor);
  if (e.state === 'EVADE') {
    e.facing = -side;
    const speed = p.evadeSpeed * (e.enrage ? 1.1 : 1);
    e.x = clamp(e.x + side * speed * dt,
      battle.tuning.left + p.bodyWidth / 2, battle.tuning.right - p.bodyWidth / 2);
    if (e.elapsed >= p.evadeTime) {
      e.facing = player.x < e.x ? -1 : 1;
      const counterDistance = Math.abs(player.x - e.x);
      const attacks = {
        robot: ['Laser Beam', 'Rocket Punch'],
        dinosaur: ['Bite', 'Rush'],
        bear: ['Bear Hug', 'Belly Charge', 'Toy Leap']
      }[e.actor];
      const attack = selectArenaEnemyAttack(battle, counterDistance, attacks)
        ?? (e.actor === 'robot' ? (s.crouching ? 'Rocket Punch' : 'Laser Beam')
          : e.actor === 'dinosaur' ? (counterDistance > contact + 95 ? 'Rush' : 'Bite')
            : s.jump > 45 ? 'Toy Leap' : counterDistance > contact + 80 ? 'Belly Charge' : 'Bear Hug');
      e.counterAttacks = (e.counterAttacks || 0) + 1;
      e.responseAttack = true;
      battle.beginEnemyAttack(attack);
    }
    return true;
  }

  const visibleThreat = s.attackTime > (battle.tuning.swordDuration ?? 12) - (battle.tuning.swordWindup ?? 4)
    && battle.room.story.state.attackDirection === side
    && distance < Math.max(battle.tuning.swordRange ?? 240, contact + 40) + 30;
  const canRetreat = side > 0
    ? e.x < battle.tuning.right - p.bodyWidth / 2 - 35
    : e.x > battle.tuning.left + p.bodyWidth / 2 + 35;
  if (['IDLE', 'APPROACH'].includes(e.state) && visibleThreat && !e.evadeCooldown) {
    e.evadeCooldown = p.evadeCooldown * (e.enrage ? 0.8 : 1);
    if (canRetreat) {
      e.evasions = (e.evasions || 0) + 1;
      battle.setEnemyState('EVADE');
      // Começa a retirada no mesmo subpasso em que a antecipação é percebida.
      e.x = clamp(e.x + side * p.evadeSpeed * dt,
        battle.tuning.left + p.bodyWidth / 2, battle.tuning.right - p.bodyWidth / 2);
    } else if (battle.beginEnemyResponse) battle.beginEnemyResponse();
    else return false;
    return true;
  }
  return false;
}
