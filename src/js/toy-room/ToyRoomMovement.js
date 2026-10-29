/** Movimento da exploração: recebe as referências vigentes a cada atualização, sem reter a fase. */
export function updateToyRoomMovement({ player, keysDown, gamepadState, touchState, footstepPuffs, resolveCollisions }, dt) {
  if (!(dt > 0)) return;
  // Vetor de movimentação do jogador
  let moveX = 0;
  let moveY = 0;

  if (keysDown['KeyW'] || keysDown['ArrowUp']) moveY -= 1;
  if (keysDown['KeyS'] || keysDown['ArrowDown']) moveY += 1;
  if (keysDown['KeyA'] || keysDown['ArrowLeft']) moveX -= 1;
  if (keysDown['KeyD'] || keysDown['ArrowRight']) moveX += 1;
  if (gamepadState.active) {
    moveX = gamepadState.x;
    moveY = gamepadState.y;
  }

  // Movimentação por Joystick Virtual Flutuante Dinâmico (8 direções)
  if (touchState.active) {
    moveX = touchState.vectorX;
    moveY = touchState.vectorY;
  }

  const len = Math.hypot(moveX, moveY);
  if (len > 1.0) {
    moveX /= len;
    moveY /= len;
  }

  const weightFactor = player.carriedItem ? player.carriedItem.weight : 1.0;
  const finalSpeed = player.speed * weightFactor;

  player.vx = moveX * finalSpeed;
  player.vy = moveY * finalSpeed;
  if (len > 0.05) {
    player.facingAngle = Math.atan2(moveY, moveX);

    // Ignora apenas o resíduo trigonométrico do joystick em movimento vertical.
    if (Math.abs(moveX) > 1e-6) player.facing = moveX > 0 ? 'right' : 'left';

    if (Math.abs(moveX) > Math.abs(moveY)) {
      player.direction = moveX > 0 ? 'right' : 'left';
    } else {
      player.direction = moveY > 0 ? 'down' : 'up';
    }
  }

  // Resolução de colisões e movimentação
  const rawX = player.x + player.vx * dt;
  const rawY = player.y + player.vy * dt;
  const resolved = resolveCollisions(rawX, rawY, player.radius);
  const distance = Math.hypot(resolved.x - player.x, resolved.y - player.y);
  player.x = resolved.x;
  player.y = resolved.y;
  player.isMoving = len > 0.05 && distance > 1e-6;
  const blend = player.runBlend ?? 0;
  player.runBlend = player.isMoving ? Math.min(1, blend + dt / 8) : Math.max(0, blend - dt / 8);

  if (player.isMoving) {
    // Cadência por distância resolvida: peso, analógico e deslize na parede
    // reduzem a passada na mesma proporção, sem mudar velocidade ou colisões.
    const travelTime = distance / 3.8;
    player.animTime = (player.animTime || 0) + 0.22 * travelTime;
    player.stepTimer = (player.stepTimer || 0) + travelTime;
    if (player.stepTimer >= 12) {
      player.stepTimer %= 12;
      footstepPuffs.push({
        x: player.x + (Math.random() - 0.5) * 10,
        y: player.y + 28,
        radius: 3 + Math.random() * 3,
        alpha: 0.5,
        color: '#fef3c7'
      });
    }
  }
}

/** Conserva a ordem dos móveis, os limites da sala e o desempate das penetrações. */
export function resolveToyRoomCollisions({ width, height, furniture }, px, py, r) {
  let nx = px;
  let ny = py;

  const minX = 75 + r;
  const maxX = width - 75 - r;
  const minY = 250 + r;
  const maxY = height - 75 - r;

  nx = Math.max(minX, Math.min(maxX, nx));
  ny = Math.max(minY, Math.min(maxY, ny));

  for (let i = 0; i < furniture.length; i++) {
    const f = furniture[i];
    const boxLeft = f.x - r;
    const boxRight = f.x + f.w + r;
    const boxTop = f.y - r;
    const boxBottom = f.y + f.h + r;

    if (nx > boxLeft && nx < boxRight && ny > boxTop && ny < boxBottom) {
      const penLeft = nx - boxLeft;
      const penRight = boxRight - nx;
      const penTop = ny - boxTop;
      const penBottom = boxBottom - ny;

      const minPen = Math.min(penLeft, penRight, penTop, penBottom);

      if (minPen === penLeft) nx = boxLeft;
      else if (minPen === penRight) nx = boxRight;
      else if (minPen === penTop) ny = boxTop;
      else ny = boxBottom;
    }
  }

  return { x: nx, y: ny };
}
