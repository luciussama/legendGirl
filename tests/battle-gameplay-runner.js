import { BATTLE_ORDER, BATTLE_TUNING } from '../src/js/toy-room/ToyRoomBattle.js';

/** Joga a simulação real usando somente movimento e ataque, sem alterar HP ou inimigos. */
export function runBattleGameplay(room, { draw = false, dt = 1, restore = false } = {}) {
  const battle = room.battle, check = (ok, text) => { if (!ok) throw Error(text); };
  check(battle.state?.mode === 'BATTLE', 'A cena da espada deve preceder o combate.');
  const camera = [room.cameraX, room.cameraY];
  let frames = 0, reloaded = false;
  while (battle.state.mode === 'BATTLE' && frames < 18000 / dt) {
    const s = battle.state, e = s.enemy, delta = e.x - room.player.x;
    room.keysDown = Math.abs(delta) > 90 ? { [delta > 0 ? 'ArrowRight' : 'ArrowLeft']: true } : {};
    if (Math.abs(delta) <= 105) {
      room.player.facing = delta > 0 ? 'right' : 'left';
      room.triggerAction();
    }
    room.update(dt); frames++;
    check(s.player.hp >= 0 && s.player.hp <= 3, 'HP da menina fora dos limites.');
    check(e.hp >= 0 && e.hp <= e.maxHp, 'HP do inimigo fora dos limites.');
    check(room.player.y === BATTLE_TUNING.ground - 28, 'Movimento em profundidade na arena.');
    check([room.player.x, room.player.y, e.x, s.jump].every(Number.isFinite), 'Coordenadas inválidas.');
    if (draw && frames % 4 === 0) room.render();
    if (restore && !reloaded && s.index === 2) {
      const saved = room.snapshot(); room.restore(saved); reloaded = true;
      check(JSON.stringify(room.battle.state.history) === JSON.stringify(saved.toyRoomBattle.history), 'Histórico perdido no save.');
    }
  }
  check(battle.state.mode === 'VICTORY', 'O percurso não terminou em vitória.');
  const order = battle.state.history.filter(event => event.event === 'DEFEATED').map(event => event.enemy);
  check(JSON.stringify(order) === JSON.stringify(BATTLE_ORDER), 'Sequência de inimigos incorreta.');
  check(camera[0] === room.cameraX && camera[1] === room.cameraY, 'A câmera seguiu o jogador em combate.');
  room.clearInput();
  return { frames, dt, order, hp: battle.state.player.hp, reload: reloaded, result: 'PASS' };
}
