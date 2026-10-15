/** Consultas geométricas da exploração; dependências consultadas novamente após restore. */
export function createToyRoomWorldQueries({ getDimensions, getPlayer, resolvePosition, getCameraFrame, getCameraBounds }) {
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const key = point => `${point.x},${point.y}`;
  function isFree(point, radius = 24) {
    const resolved = resolvePosition(point.x, point.y, radius);
    return resolved.x === point.x && resolved.y === point.y;
  }

  function reachableFloor() {
    const { width, height } = getDimensions();
    const player = getPlayer();
    const nodes = [];
    for (let x = 120; x <= width - 120; x += 40) {
      for (let y = 320; y <= height - 120; y += 40) {
        const point = { x, y };
        if (isFree(point)) nodes.push(point);
      }
    }

    const nodesByKey = new Map(nodes.map(point => [key(point), point]));
    const start = nodes.reduce((nearest, point) =>
      !nearest || distance(point, player) < distance(nearest, player) ? point : nearest, null);
    if (!start) return [];

    const visited = new Set([key(start)]);
    const queue = [start];
    for (let index = 0; index < queue.length; index++) {
      const point = queue[index];
      for (const [dx, dy] of [[40, 0], [-40, 0], [0, 40], [0, -40]]) {
        const next = { x: point.x + dx, y: point.y + dy };
        const nextKey = key(next);
        if (!nodesByKey.has(nextKey) || visited.has(nextKey)) continue;
        if (![0.25, 0.5, 0.75].every(amount =>
          isFree({ x: point.x + dx * amount, y: point.y + dy * amount }))) continue;
        visited.add(nextKey);
        queue.push(next);
      }
    }
    return queue;
  }

  function viewport(frame = getCameraFrame()) {
    const { x, y, width, height } = getCameraBounds();
    return {
      left: x - frame.x / frame.zoom,
      top: y - frame.y / frame.zoom,
      right: x + (width - frame.x) / frame.zoom,
      bottom: y + (height - frame.y) / frame.zoom
    };
  }

  return Object.freeze({ isFree, reachableFloor, viewport });
}
