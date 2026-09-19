export function bindInput(game) {
  let lastInputTime = 0;
  const MIN_INPUT_INTERVAL = 140; // Cooldown against input spam (ms)

  // Track previous button states per gamepad to enforce clean single-press (edge-triggered) jumps
  const prevGamepadButtonX = new Map();
  let gamepadPollRafId = null;
  let isDestroyed = false;

  function triggerJump() {
    // Ignore input if game is over or in Toy Room mode
    if ((game.isGameOver && game.isGameOver()) || (game.isToyRoomMode && game.isToyRoomMode())) {
      return;
    }

    const now = performance.now();
    if (now - lastInputTime < MIN_INPUT_INTERVAL) {
      return;
    }

    // In normal gameplay (outside cutscenes and standby state), ensure character is grounded to prevent mid-air multi-jumps
    const inCutscene = typeof game.isCutsceneActive === 'function' && game.isCutsceneActive();
    if (!inCutscene && typeof game.isGrounded === 'function' && !game.isGrounded()) {
      return;
    }

    lastInputTime = now;
    game.doJump();
  }

  const handlePointerDown = (event) => {
    if ((game.isGameOver && game.isGameOver()) || (game.isToyRoomMode && game.isToyRoomMode())) {
      return;
    }

    // Record device type
    if (typeof game.setLastInputDevice === 'function') {
      const isTouch = event.pointerType === 'touch' || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      game.setLastInputDevice(isTouch ? 'touch' : 'keyboard');
    }

    // Only process primary pointer (prevents multi-touch gesture spam)
    if (event.isPrimary === false) {
      return;
    }

    // Prevent interfering with UI buttons or overlay dialogs
    if (event.target && (
      event.target.tagName === 'BUTTON' ||
      event.target.closest('button') ||
      event.target.closest('#start-overlay') ||
      event.target.closest('#gameover-overlay')
    )) {
      return;
    }

    event.preventDefault();
    triggerJump();
  };

  const handleKeyDown = (event) => {
    // Ignore keyboard auto-repeat when holding down a key
    if (event.repeat) {
      return;
    }

    if (typeof game.setLastInputDevice === 'function') {
      game.setLastInputDevice('keyboard');
    }

    if ((game.isGameOver && game.isGameOver()) || (game.isToyRoomMode && game.isToyRoomMode())) {
      return;
    }

    // Mapped: Space bar (standard jump key) as requested, plus ArrowUp
    if (event.code === 'Space' || event.key === ' ' || event.code === 'ArrowUp') {
      event.preventDefault();
      triggerJump();
    }
  };

  // --- GAMEPAD (XBOX CONTROLLER) POLLING ---
  // Standard W3C mapping for Xbox / XInput controllers:
  // Button 0: A (Bottom)
  // Button 1: B (Right)
  // Button 2: X (Left) -> Requested Jump Button
  // Button 3: Y (Top)
  function pollGamepad() {
    if (isDestroyed) return;
    if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') {
      return;
    }

    let gamepads;
    try {
      gamepads = navigator.getGamepads();
    } catch (e) {
      return;
    }

    if (!gamepads) return;

    for (let i = 0; i < gamepads.length; i++) {
      const gp = gamepads[i];
      if (!gp || !gp.connected || !gp.buttons) continue;

      // Xbox X button is button index 2
      const btnX = gp.buttons[2];
      const isPressed = Boolean(btnX && (btnX.pressed || btnX.value > 0.5));
      const wasPressed = prevGamepadButtonX.get(i) || false;

      if (isPressed && !wasPressed) {
        if (typeof game.setLastInputDevice === 'function') {
          game.setLastInputDevice('gamepad');
        }
        // Edge triggered: fired exactly once upon button down
        prevGamepadButtonX.set(i, true);
        triggerJump();
      } else if (!isPressed && wasPressed) {
        // Button released
        prevGamepadButtonX.set(i, false);
      }
    }
  }

  function startGamepadPollingLoop() {
    function loop() {
      if (isDestroyed) return;
      pollGamepad();
      gamepadPollRafId = requestAnimationFrame(loop);
    }
    gamepadPollRafId = requestAnimationFrame(loop);
  }

  const handleGamepadDisconnected = (event) => {
    if (event && event.gamepad) {
      prevGamepadButtonX.delete(event.gamepad.index);
    }
  };

  window.addEventListener('pointerdown', handlePointerDown, { passive: false });
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);
  startGamepadPollingLoop();

  return {
    pollGamepad,
    destroy() {
      isDestroyed = true;
      if (gamepadPollRafId) {
        cancelAnimationFrame(gamepadPollRafId);
        gamepadPollRafId = null;
      }
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
      prevGamepadButtonX.clear();
    }
  };
}
