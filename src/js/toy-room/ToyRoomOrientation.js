/** Orientação visual independente de coleta, armazenamento e persistência. */
export function nearestToyGuide(player, toys, previous) {
  const available = toys.filter(toy => !toy.isOrganized && !toy.isCarried);
  const distance = toy => Math.hypot(player.x - toy.x, player.y - toy.y);
  const nearest = available.reduce((best, toy) =>
    !best || distance(toy) < distance(best) ? toy : best, null);
  // Empates visuais de até seis unidades conservam o alvo, sem temporizador de bloqueio.
  if (available.includes(previous) && nearest && distance(previous) <= distance(nearest) + 6) return previous;
  return nearest;
}

