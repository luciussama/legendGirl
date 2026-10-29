/** Geometria visual compartilhada pelas janelas e suas sombras no piso. */
export const TOY_ROOM_WINDOWS = Object.freeze([
  Object.freeze({ x: 520, y: 30 }), Object.freeze({ x: 1280, y: 30 })
]);

/** Luz solar paralela: acompanha a diagonal dos feixes já pintados no cenário. */
export function getToyRoomFloorLight(x, y) {
  const slope = -190 / 480;
  let strength = 0, windowIndex = 0;
  TOY_ROOM_WINDOWS.forEach((window, index) => {
    const depth = Math.max(0, y - window.y - 160);
    const center = window.x + 80 + slope * depth;
    const halfWidth = 105 + Math.min(120, depth * .17);
    const incidence = 1 / (1 + Math.pow((x - center) / halfWidth, 2));
    const light = incidence / (1 + Math.max(0, depth - 380) / 620);
    if (light > strength) { strength = light; windowIndex = index; }
  });
  return { slope, opacity: .20 + strength * .16, stretch: .8 + strength * .3, windowIndex };
}
