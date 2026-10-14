const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/** Movimento lateral original; os parâmetros pertencem à instância de combate. */
export class PlayerController {
  update(battle, dt) {
    const s = battle.state, r = battle.room, t = battle.tuning;
    const input = battle.input();
    if (input.up && !s.upHeld && s.jump === 0) {
      s.jumpVelocity = t.jumpSpeed;
      battle.playCombatSound('player_jump');
    }
    s.upHeld = input.up;
    const wasAirborne = s.jump > 0;
    if (s.jumpVelocity !== 0 || s.jump > 0) {
      s.jump += s.jumpVelocity * dt; s.jumpVelocity -= t.gravity * dt;
      if (s.jump <= 0) {
        s.jump = 0; s.jumpVelocity = 0;
        if (wasAirborne) battle.playCombatSound('player_land');
      }
    }
    s.crouching = input.down && s.jump === 0;
    if (input.x) r.player.facing = input.x > 0 ? 'right' : 'left';
    r.player.isMoving = Boolean(input.x && !s.crouching && s.playerHitTime <= 0);
    if (s.playerHitTime > 0 && s.playerKnockback) {
      r.player.x = clamp(r.player.x + s.playerHitDirection * s.playerKnockback * dt, t.left + 35, t.right - 35);
      s.playerKnockback *= Math.pow(0.82, dt);
    } else if (!s.crouching && input.x && s.playerHitTime <= 0) {
      r.player.x = clamp(r.player.x + input.x * t.speed * dt, t.left + 35, t.right - 35);
    }
    const e = s.enemy;
    if (e && e.hp > 0 && e.state !== 'DEATH' && !s.transition && s.jump <= 55) {
      const minDist = battle.getEnemyCollisionDistance ? battle.getEnemyCollisionDistance(e.actor) : 54;
      if (r.player.x < e.x && r.player.x > e.x - minDist) {
        r.player.x = e.x - minDist;
      } else if (r.player.x > e.x && r.player.x < e.x + minDist) {
        r.player.x = e.x + minDist;
      }
    }
    r.player.x = clamp(r.player.x, t.left + 35, t.right - 35);
    r.player.y = t.ground - 28;
    r.player.animTime += dt * 0.22;
    s.playerStepTimer = Math.max(0, s.playerStepTimer - dt);
    if (r.player.isMoving && s.playerStepTimer === 0) {
      battle.playCombatSound('player_walk');
      s.playerStepTimer = 14;
    }
  }
}
