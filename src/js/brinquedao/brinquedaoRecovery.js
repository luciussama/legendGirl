/** Rotas inferiores são brinquedos físicos: ainda há vãos depois da segunda chance. */
const tracks = [],
  walls = [];
const add = (id, from, to, y, end, kind, extra = {}) =>
  tracks.push({
    id,
    from,
    to,
    y,
    end,
    kind,
    upper: true,
    recovery: true,
    ...extra,
  });
for (const [i, from, flat, to, y, end] of [
  [1, 17600, 17950, 19000, 1770, 1500],
  [2, 19750, 20100, 21180, 1800, 1500],
  [3, 22000, 22400, 23350, 1900, 1200],
]) {
  add('apoio-inferior-' + i, from, flat, y, y, 'pad');
  add('retorno-inferior-' + i, flat, to, y, end, 'slide');
}
// Rampas desenhadas ligam a segunda chance ao próximo brinquedo, sem vão oculto.
add('ligacao-inferior-1', 19000, 19180, 1500, 1350, 'slide');
add('ligacao-inferior-2', 21180, 21350, 1500, 1350, 'slide');
add('patamar-retorno-3', 23350, 23750, 1200, 1200, 'pad');
add('ligacao-inferior-3', 23750, 25100, 1200, 1700, 'slide');
for (const [i, from, to, y, depth] of [
  [1, 26900, 28400, 350, 500],
  [2, 29200, 30500, 200, 500],
  [3, 31600, 33500, 150, 650],
]) {
  add('calha-elastica-' + i, from, to, y, y, 'slide', {
    bowlDepth: depth,
  });
  for (const side of [-1, 1])
    for (let row = 0; row < 3; row++)
      walls.push({
        id: `lateral-${i}-${side}-${row}`,
        group: i,
        x: side < 0 ? from : to,
        side,
        top: y + row * 300,
        bottom: y + 300 + row * 300,
        impulse: [900, 1120, 1350][row],
      });
}
add('beira-calha-1', 26800, 26900, 350, 350, 'pad');
add('patamar-recuperacao-1', 28400, 28580, 350, 350, 'pad');
add('lona-retorno-1', 28580, 28900, 350, 350, 'spring', {
  impulse: 2200,
  vertical: true,
});
add('saida-recuperacao-1', 28900, 29100, 350, 350, 'pad');
add('rampa-recuperacao-1', 29100, 29200, 350, 200, 'slide');
add('patamar-recuperacao-2', 30500, 30600, 200, 200, 'pad');
add('lona-retorno-2', 30600, 30900, 200, 200, 'spring', {
  impulse: 2250,
  vertical: true,
});
add('saida-recuperacao-2', 30900, 31100, 200, 200, 'pad');
add('rampa-recuperacao-2', 31100, 31600, 200, 150, 'slide');
add('patamar-recuperacao-3', 33500, 34080, 150, 150, 'pad');
add('lona-retorno-3', 34080, 34580, 150, 150, 'spring', {
  impulse: 2300,
  vertical: true,
});
add('saida-recuperacao-3', 34580, 35150, 150, 150, 'pad');
export const BRINQUEDAO_RECOVERY_TRACKS = Object.freeze(tracks.map(Object.freeze));
export const BRINQUEDAO_SIDE_MATS = Object.freeze(walls.map(Object.freeze));
/** Duas rebatidas preparam a saída da calha; relógios permitem salvar no meio do lançamento. */
export function brinquedaoOutletReady(s, group) {
  return s.obstacles.outlets[group].hits >= 2;
}
/** Lançamento balístico até a lona: direção para trás freia; a direção para frente conserva o impulso. */
export function brinquedaoOutletFlight(s) {
  if (s.player.support !== null) return false;
  for (const [group, outlet] of Object.entries(s.obstacles.outlets)) {
    if (
      outlet.launch !== null &&
      s.time - outlet.launch < 2.2 &&
      (s.obstacles.springs['lona-retorno-' + group] === null ||
        s.obstacles.springs['lona-retorno-' + group] < outlet.launch)
    )
      return true;
  }
  return false;
}
/** Tempo desde a última rebatida: pausa/save preservam a recuperação gradual da direção. */
export function brinquedaoRicochetAge(s) {
  const hits = Object.values(s.obstacles.bumpers).filter((t) => t !== null);
  return hits.length ? s.time - Math.max(...hits) : Infinity;
}
/** Contato lateral varrido muda velocidade, nunca transporta Yuna até outro brinquedo. */
export function hitBrinquedaoSideMat(s, previous, events) {
  const p = s.player;
  for (const wall of BRINQUEDAO_SIDE_MATS) {
    const outward =
      wall.side < 0
        ? p.vx < 0 && previous.x >= wall.x && p.x <= wall.x
        : p.vx > 0 && previous.x <= wall.x && p.x >= wall.x;
    const hit = s.obstacles.bumpers[wall.id];
    if (
      !outward ||
      p.y < wall.top ||
      p.y - 96 > wall.bottom ||
      (hit !== null && s.time - hit < 0.16)
    )
      continue;
    const outlet = s.obstacles.outlets[wall.group],
      exit = wall.side > 0 && brinquedaoOutletReady(s, wall.group);
    if (exit) {
      const bowl = tracks.find((t) => t.id === 'calha-elastica-' + wall.group),
        spring = tracks.find((t) => t.id === 'lona-retorno-' + wall.group),
        speed = Math.sqrt(3000 * (Math.max(0, p.y - bowl.y) + 140)),
        duration = (speed + Math.sqrt(420000)) / 1500;
      p.x = wall.x + 18;
      p.vx = ((spring.from + spring.to) / 2 - p.x) / duration;
      p.vy = -speed;
      outlet.launch = s.time;
    } else {
      p.x = wall.x - wall.side * 18;
      p.vx = -wall.side * Math.min(1550, Math.max(1280, Math.abs(p.vx) * 0.95));
      p.vy = -(wall.impulse + (p.jumpHeld ? 180 : 0));
    }
    p.support = null;
    p.mode = 'air';
    p.coyote = 0;
    p.buffer = 0;
    p.facing = exit ? 1 : -wall.side;
    outlet.hits = Math.min(2, outlet.hits + 1);
    s.obstacles.bumpers[wall.id] = s.time;
    s.obstacles.ricochets++;
    events.push({
      type: 'side-spring',
      id: wall.id,
      exit,
    });
    return true;
  }
  return false;
}
