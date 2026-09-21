/**
 * InputController.js
 * Abstraction of Keyboard, Gamepad (Xbox), and Mobile Touch events
 * with debouncing, spam prevention, and primary pointer filtering.
 */

export class InputController {
  constructor(game, options = {}) {
    this.game = game;
    this.minInputInterval = options.minInputInterval || 140; // Cooldown against input spam (ms)
    this.lastInputTime = 0;

    // Track previous button states per gamepad to enforce clean single-press (edge-triggered) jumps
    this.prevGamepadButtonX = new Map();
    this.gamepadPollRafId = null;
    this.isDestroyed = false;

    this.boundHandlePointerDown = this.handlePointerDown.bind(this);
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.boundHandleGamepadDisconnected = this.handleGamepadDisconnected.bind(this);
    this.boundGamepadLoop = this.gamepadLoop.bind(this);

    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    window.addEventListener('pointerdown', this.boundHandlePointerDown, { passive: false });
    window.addEventListener('keydown', this.boundHandleKeyDown);
    window.addEventListener('gamepaddisconnected', this.boundHandleGamepadDisconnected);

    this.startGamepadPollingLoop();
  }

  triggerJump() {
    if (!this.game) return;

    // Ignore input if game is over or in Toy Room mode
    if ((this.game.isGameOver && this.game.isGameOver()) || (this.game.isToyRoomMode && this.game.isToyRoomMode())) {
      return;
    }

    const now = performance.now();
    if (now - this.lastInputTime < this.minInputInterval) {
      return;
    }

    // In normal gameplay (outside cutscenes and standby state), ensure character is grounded to prevent mid-air multi-jumps
    const inCutscene = typeof this.game.isCutsceneActive === 'function' && this.game.isCutsceneActive();
    if (!inCutscene && typeof this.game.isGrounded === 'function' && !this.game.isGrounded()) {
      return;
    }

    this.lastInputTime = now;
    if (typeof this.game.doJump === 'function') {
      this.game.doJump();
    }
  }

  handlePointerDown(event) {
    if (!this.game) return;
    if ((this.game.isGameOver && this.game.isGameOver()) || (this.game.isToyRoomMode && this.game.isToyRoomMode())) {
      return;
    }

    // Record device type
    if (typeof this.game.setLastInputDevice === 'function') {
      const isTouch = event.pointerType === 'touch' || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      this.game.setLastInputDevice(isTouch ? 'touch' : 'keyboard');
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

    if (event.cancelable) {
      event.preventDefault();
    }
    this.triggerJump();
  }

  handleKeyDown(event) {
    // Ignore keyboard auto-repeat when holding down a key
    if (event.repeat) {
      return;
    }

    if (this.game && typeof this.game.setLastInputDevice === 'function') {
      this.game.setLastInputDevice('keyboard');
    }

    // Toggle mute on 'M' key
    if (event.code === 'KeyM' || event.key === 'm' || event.key === 'M') {
      if (this.game && typeof this.game.toggleMute === 'function') {
        this.game.toggleMute();
      }
      return;
    }

    if (this.game && ((this.game.isGameOver && this.game.isGameOver()) || (this.game.isToyRoomMode && this.game.isToyRoomMode()))) {
      return;
    }

    // Mapped: Space bar (standard jump key) as requested, plus ArrowUp
    if (event.code === 'Space' || event.key === ' ' || event.code === 'ArrowUp') {
      if (event.cancelable) {
        event.preventDefault();
      }
      this.triggerJump();
    }
  }

  // --- GAMEPAD (XBOX CONTROLLER) POLLING ---
  // Standard W3C mapping for Xbox / XInput controllers:
  // Button 0: A (Bottom)
  // Button 1: B (Right)
  // Button 2: X (Left) -> Requested Jump Button
  // Button 3: Y (Top)
  pollGamepad() {
    if (this.isDestroyed) return;
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
      const wasPressed = this.prevGamepadButtonX.get(i) || false;

      if (isPressed && !wasPressed) {
        if (this.game && typeof this.game.setLastInputDevice === 'function') {
          this.game.setLastInputDevice('gamepad');
        }
        // Edge triggered: fired exactly once upon button down
        this.prevGamepadButtonX.set(i, true);
        this.triggerJump();
      } else if (!isPressed && wasPressed) {
        // Button released
        this.prevGamepadButtonX.set(i, false);
      }
    }
  }

  gamepadLoop() {
    if (this.isDestroyed) return;
    this.pollGamepad();
    this.gamepadPollRafId = requestAnimationFrame(this.boundGamepadLoop);
  }

  startGamepadPollingLoop() {
    if (typeof requestAnimationFrame === 'function') {
      this.gamepadPollRafId = requestAnimationFrame(this.boundGamepadLoop);
    }
  }

  handleGamepadDisconnected(event) {
    if (event && event.gamepad) {
      this.prevGamepadButtonX.delete(event.gamepad.index);
    }
  }

  destroy() {
    this.isDestroyed = true;
    if (this.gamepadPollRafId && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.gamepadPollRafId);
      this.gamepadPollRafId = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('pointerdown', this.boundHandlePointerDown);
      window.removeEventListener('keydown', this.boundHandleKeyDown);
      window.removeEventListener('gamepaddisconnected', this.boundHandleGamepadDisconnected);
    }
    this.prevGamepadButtonX.clear();
  }
}

/**
 * Functional factory for backwards compatibility
 */
export function bindInput(game) {
  const controller = new InputController(game);
  return {
    controller,
    pollGamepad: () => controller.pollGamepad(),
    destroy: () => controller.destroy()
  };
}
