/**
 * InputController.js
 * Abstração de eventos de Teclado, Gamepad (Xbox) e Toque Móvel
 * com debounce, prevenção de disparo acidental e filtragem de ponteiro primário.
 */

export class InputController {
  constructor(game, options = {}) {
    this.game = game;
    this.minInputInterval = options.minInputInterval || 140; // Intervalo mínimo contra toques repetidos (ms)
    this.lastInputTime = 0;

    // Rastreia o estado anterior dos botões por gamepad para garantir pulo único por pressionamento (borda de subida)
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

    // Ignora entrada se o jogo terminou ou se estiver no modo Quarto de Brinquedos
    if ((this.game.isGameOver && this.game.isGameOver()) || (this.game.isToyRoomMode && this.game.isToyRoomMode())) {
      return;
    }

    const now = performance.now();
    if (now - this.lastInputTime < this.minInputInterval) {
      return;
    }

    // No gameplay normal (fora de cutscenes e do modo de prontidão), garante que a personagem esteja no chão para evitar pulo duplo no ar
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

    // Registra o tipo de dispositivo
    if (typeof this.game.setLastInputDevice === 'function') {
      const isTouch = event.pointerType === 'touch' || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      this.game.setLastInputDevice(isTouch ? 'touch' : 'keyboard');
    }

    // Processa apenas o ponteiro primário (previne disparo por múltiplos toques)
    if (event.isPrimary === false) {
      return;
    }

    // Se o clique for diretamente nos botões superiores de pausa ou som, não interfere
    if (event.target && event.target.closest('.top-controls-bar')) {
      return;
    }

    // Se um overlay interativo estiver realmente visível e ativo, ignora o pulo
    const startOv = document.getElementById('start-overlay');
    const goOv = document.getElementById('gameover-overlay');
    const isStartVisible = startOv && !startOv.classList.contains('hidden') && startOv.style.display !== 'none';
    const isGameOverVisible = goOv && !goOv.classList.contains('hidden') && goOv.style.display !== 'none';

    if (isStartVisible || isGameOverVisible) {
      return;
    }

    if (event.cancelable) {
      event.preventDefault();
    }
    this.triggerJump();
  }

  handleKeyDown(event) {
    // Ignora repetição automática do teclado ao segurar a tecla
    if (event.repeat) {
      return;
    }

    if (this.game && typeof this.game.setLastInputDevice === 'function') {
      this.game.setLastInputDevice('keyboard');
    }

    // Alterna mudo na tecla 'M'
    if (event.code === 'KeyM' || event.key === 'm' || event.key === 'M') {
      if (this.game && typeof this.game.toggleMute === 'function') {
        this.game.toggleMute();
      }
      return;
    }

    if (this.game && ((this.game.isGameOver && this.game.isGameOver()) || (this.game.isToyRoomMode && this.game.isToyRoomMode()))) {
      return;
    }

    // Mapeamento: Barra de espaço (tecla padrão de pulo) e Seta para Cima
    if (event.code === 'Space' || event.key === ' ' || event.code === 'ArrowUp') {
      if (event.cancelable) {
        event.preventDefault();
      }
      this.triggerJump();
    }
  }

  // --- LEITURA DO GAMEPAD (CONTROLE XBOX) ---
  // Mapeamento padrão W3C para controles Xbox / XInput:
  // Botão 0: A (Inferior)
  // Botão 1: B (Direita)
  // Botão 2: X (Esquerda) -> Botão de Pulo Solicitado
  // Botão 3: Y (Superior)
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

      // O botão X do Xbox é o índice 2
      const btnX = gp.buttons[2];
      const isPressed = Boolean(btnX && (btnX.pressed || btnX.value > 0.5));
      const wasPressed = this.prevGamepadButtonX.get(i) || false;

      if (isPressed && !wasPressed) {
        if (this.game && typeof this.game.setLastInputDevice === 'function') {
          this.game.setLastInputDevice('gamepad');
        }
        // Borda de subida: acionado exatamente uma vez ao pressionar o botão
        this.prevGamepadButtonX.set(i, true);
        this.triggerJump();
      } else if (!isPressed && wasPressed) {
        // Botão liberado
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
 * Fábrica funcional para retrocompatibilidade
 */
export function bindInput(game) {
  const controller = new InputController(game);
  return {
    controller,
    pollGamepad: () => controller.pollGamepad(),
    destroy: () => controller.destroy()
  };
}
