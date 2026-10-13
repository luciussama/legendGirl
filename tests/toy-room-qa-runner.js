// Percurso de QA compartilhado entre Node e navegador: movimenta a fase real por caminhos livres.
export function runToyRoomQA(room, { draw = false, dt = 1 } = {}) {
  let frames = 0, collections = 0, reloads = 0;
  const stages = new Set();
  const check = (condition, message) => { if (!condition) throw Error(message); };
  const tick = () => {
    room.update(dt); frames++;
    stages.add(room.story.state.investigationStage);
    check([room.player.x, room.player.y, room.cameraX, room.cameraY].every(Number.isFinite), 'Coordenadas inválidas.');
    check(room.organizedCount === room.toys.filter(t => t.isOrganized).length, 'Contador diverge dos brinquedos guardados.');
    check(room.toys.filter(t => t.isCarried).length === (room.player.carriedItem ? 1 : 0), 'Carregamento duplicado ou órfão.');
    check(!room.player.carriedItem || room.toys.includes(room.player.carriedItem), 'Referência de brinquedo carregado inválida.');
    if (draw && frames % 30 === 0) room.render();
  };
  const reload = () => {
    const saved = JSON.parse(JSON.stringify(room.snapshot()));
    room.restore(saved); reloads++;
    check(room.player.carriedItem?.id === saved.carriedItemId || (!room.player.carriedItem && !saved.carriedItemId), 'Save perdeu o brinquedo carregado.');
  };
  const wait = duration => { for (let i = 0; i < Math.ceil(duration / dt); i++) tick(); };
  const walk = (tx, ty, radius) => {
    const free = (x, y) => { const p = room.resolveCollisions(x, y, 24); return Math.hypot(p.x - x, p.y - y) < 0.1; };
    const key = p => p.join(',');
    const start = [Math.round(room.player.x / 20), Math.round(room.player.y / 20)];
    const queue = [start], seen = new Map([[key(start), null]]);
    let end;
    for (let i = 0; i < queue.length; i++) {
      const p = queue[i];
      if (Math.hypot(p[0] * 20 - tx, p[1] * 20 - ty) < radius) { end = p; break; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const n = [p[0] + dx, p[1] + dy];
        if (seen.has(key(n)) || !free(n[0] * 20, n[1] * 20)) continue;
        seen.set(key(n), p); queue.push(n);
      }
    }
    check(end, 'Não há caminho acessível até o objetivo.');
    const path = [];
    for (let p = end; p; p = seen.get(key(p))) path.unshift(p);
    for (const [gx, gy] of path) for (let f = 0; f < 200; f++) {
      if (room.story.inputLocked) { room.story.clearInput(); return; }
      const dx = gx * 20 - room.player.x, dy = gy * 20 - room.player.y, d = Math.hypot(dx, dy);
      if (d < 2) break;
      check(f < 199, 'Movimento bloqueado no percurso.');
      room.touchState.active = true;
      room.touchState.vectorX = dx / Math.max(d, 5 * dt);
      room.touchState.vectorY = dy / Math.max(d, 5 * dt);
      tick();
    }
    room.onPointerUp({}); tick();
  };
  const action = () => { room.lastActionTime = -Infinity; room.triggerAction(); };
  room.introAlpha = 0; room.introBannerTimer = 0;
  room.startTutorial();
  for (let cycle = 0; cycle < 40 && room.story.state.investigationStage === 'COLLECTING'; cycle++) {
    const toy = room.toys.find(t => !t.isOrganized && !t.isCarried);
    if (!toy) { wait(180); continue; }
    walk(toy.x, toy.y, 60); action();
    check(room.player.carriedItem === toy, 'A coleta não pegou o brinquedo esperado.');
    check(!room.tutorial.active, 'Tutorial não terminou após a primeira coleta.');
    collections++;
    if (cycle === 0) reload();
    const chest = room.furniture.find(f => f.id === 'toy-chest');
    walk(chest.x + chest.w / 2, chest.y + chest.h / 2, 130); action();
    check(toy.isOrganized || room.toys.find(t => t.id === toy.id).isOrganized, 'Armazenamento falhou.');
    wait(180);
    if (cycle === 5) reload();
  }
  check(room.story.state.investigationStage === 'INVESTIGATION', 'Recorrência não iniciou a investigação.');
  reload(); wait(2100);
  check(room.story.state.investigationStage === 'SEEKING_SWORD', 'Diálogo não liberou o controle.');
  check(room.story.cameraTarget() === room.player, 'Câmera não voltou à protagonista.');
  reload(); wait(120);
  const sword = room.story.state.sword;
  walk(sword.x, sword.y, 20);
  check(room.story.state.investigationStage === 'PICKUP', 'A espada não foi alcançada.');
  wait(100); reload(); wait(220);
  check(room.story.swordEquipped, 'Espada não foi equipada após save intermediário.');
  for (let i = 0; room.arena?.state.status === 'TRANSFORMING' && i < Math.ceil(600 / dt); i++) tick();
  check(room.battle.state?.mode === 'BATTLE', 'O término da cena não ativou a arena.');
  check(room.battle.state.enemy.actor === 'train', 'A arena não começou pelo Trem.');
  reload();
  check(room.battle.state?.enemy.actor === 'train', 'Save perdeu o primeiro confronto.');
  return { difficulty: room.gameDifficulty, width: room.canvas.width, height: room.canvas.height,
    dt, frames, collections, reloads, stages: [...stages], result: 'aprovado' };
}
