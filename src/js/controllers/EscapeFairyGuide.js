/** Scout navigation used only between the castle escape and the plot twist. */
export function getEscapeGuideTarget(baby, platforms, exitDoor) {
  const index = baby.currentPlatformIndex + 1;
  const platform = platforms[index];
  if (!platform) return { x: exitDoor.x + 30, y: exitDoor.y + 40, landingY: exitDoor.y + 80 };
  const support = platform.standRegion;
  const x = (support?.x ?? platform.x) + (support?.w ?? platform.w) / 2;
  const landingY = platform.surfaceTopY ?? support?.y ?? platform.y;
  return { x, y: landingY - 35, landingY };
}

export function updateEscapeFairyGuide(fairy, target, dt = 1) {
  // Exact critically damped motion: quick acceleration, smooth braking and no
  // random detours. Target remains the next landing until the child lands.
  const omega = 0.38;
  const decay = Math.exp(-omega * dt);
  for (const [axis, velocity] of [['x', 'vx'], ['y', 'vy']]) {
    const offset = fairy[axis] - target[axis];
    const rate = (fairy[velocity] || 0) + omega * offset;
    fairy[axis] = target[axis] + (offset + rate * dt) * decay;
    fairy[velocity] = ((fairy[velocity] || 0) - omega * rate * dt) * decay;
  }
  fairy.flutterPhase += 0.18 * dt;
}
