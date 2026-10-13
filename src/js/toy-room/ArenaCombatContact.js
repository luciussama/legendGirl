/** Envelope vertical dos golpes heroicos, compartilhado com sua apresentação. */
export function arenaEnemyContact(state, enemy) {
  const playerBottom = state.jump, playerTop = state.jump + (state.crouching ? 92 : 200);
  const bands = { 'Laser Beam':[141,149], 'Rocket Punch':[92,145], 'Steam Blast':[0,85], 'Toy Leap':[0,140] };
  const [bottom,top] = bands[enemy.attack] || [0,140];
  return playerBottom < top && playerTop > bottom;
}
