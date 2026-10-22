import { getMobileUILayout, hitArenaMobileControl, isActionControlHit, arenaDirectionVector } from '../ui/MobileUILayout.js';
import { TOY_ROOM_INPUT } from './ToyRoomInputBindings.js';

/** Processa entradas da sala e da arena; consulta o estado atual pelo contrato recebido. */
export class ToyRoomInputController {
  constructor(context) {
    this.context = context;
    this.state = context.state;
  }

  setupListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.context.handlers.onKeyDown);
      window.addEventListener('keyup', this.context.handlers.onKeyUp);
      window.addEventListener('pointermove', this.context.handlers.handlePointerMove, { passive: false });
      window.addEventListener('pointerup', this.context.handlers.handlePointerUp);
      window.addEventListener('pointercancel', this.context.handlers.handlePointerUp);
      window.addEventListener('blur', this.context.handlers.handleBlur);
    }
    if (this.context.canvas) {
      this.context.canvas.addEventListener('uilayoutchange', this.context.handlers.handlePointerUp);
      this.context.canvas.addEventListener('pointerdown', this.context.handlers.handlePointerDown, { passive: false });
      this.context.canvas.addEventListener('lostpointercapture', this.context.handlers.handlePointerUp);
    }
  }

  /**
   * Converte coordenadas de toque da tela (CSS Pixels) para coordenadas internas do Canvas
   * garantindo precisão milimétrica em qualquer resolução ou orientação de dispositivo móvel.
   */
  getCanvasCoordinates(e) {
    if (!this.context.canvas) return { x: 0, y: 0, relX: 0.5, relY: 0.5 };
    const rect = this.context.canvas.getBoundingClientRect();
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    const scaleX = rect.width > 0 ? this.context.canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? this.context.canvas.height / rect.height : 1;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    const relX = rect.width > 0 ? (clientX - rect.left) / rect.width : 0.5;
    const relY = rect.height > 0 ? (clientY - rect.top) / rect.height : 0.5;
    return { x, y, relX, relY };
  }

  /**
   * Verifica se o toque atingiu a zona dedicada do Botão de Ação no canto inferior direito
   * A área de toque coincide com o círculo externo calculado pelo layout compartilhado.
   */
  isActionButtonHit(coords) {
    return isActionControlHit(getMobileUILayout(this.context.canvas), coords.x, coords.y);
  }

  handleKeyDown(e) {
    if (!this.context.isEnabled()) return;
    this.context.setDevice('DESKTOP_KEYBOARD_MOUSE');
    this.context.initAudio();
    this.state.keysDown[e.code] = true;

    if (e.code === 'KeyR' && this.context.isArenaCombat()) {
      e.preventDefault?.();
      if (!e.repeat) this.context.special();
      return;
    }

    if (TOY_ROOM_INPUT.actionCodes.includes(e.code)) {
      if (e.preventDefault) e.preventDefault();
      if (!e.repeat) this.context.action();
    }
  }

  handleKeyUp(e) {
    this.state.keysDown[e.code] = false;
  }

  pollGamepad() {
    const input = this.state.gamepadState;
    input.x = 0; input.y = 0; input.active = false; input.jump = false;
    let pads;
    try { pads = globalThis.navigator?.getGamepads?.() || []; } catch (_) { pads = []; }
    const connected = new Set();
    const arenaCombat = this.context.isArenaCombat();
    for (const pad of pads) {
      if (!pad || pad.connected === false || (pad.mapping && pad.mapping !== 'standard')) continue;
      connected.add(pad.index);
      const held = index => Boolean(pad.buttons?.[index]?.pressed || pad.buttons?.[index]?.value > 0.5);
      const dpadX = Number(held(15)) - Number(held(14));
      const dpadY = Number(held(13)) - Number(held(12));
      const x = arenaCombat ? dpadX : dpadX || pad.axes?.[0] || 0;
      const y = arenaCombat ? dpadY : dpadY || pad.axes?.[1] || 0;
      const moving = Math.hypot(x, y) > 0.18;
      const button = pad.buttons?.[TOY_ROOM_INPUT.gamepadButton];
      const pressed = Boolean(button?.pressed || button?.value > 0.5);
      const jump = arenaCombat && held(0);
      const special = arenaCombat && held(3);
      const wasSpecial = this.state.arenaSpecialButtons.get(pad.index) || false;
      if (moving || pressed || jump || special || !input.buttons.has(pad.index)) this.context.setDevice('GAMEPAD');
      if (moving && !input.active) { input.x = x; input.y = y; input.active = true; }
      if (jump) input.jump = true;
      if (pressed && !input.buttons.get(pad.index)) {
        this.context.initAudio();
        this.context.action();
      }
      input.buttons.set(pad.index, pressed);
      if (arenaCombat && special && !wasSpecial) this.context.special();
      this.state.arenaSpecialButtons.set(pad.index, special);
    }
    for (const index of input.buttons.keys()) if (!connected.has(index)) input.buttons.delete(index);
    for (const index of this.state.arenaSpecialButtons.keys()) if (!connected.has(index)) this.state.arenaSpecialButtons.delete(index);
    if (!connected.size && this.context.device === 'GAMEPAD')
      this.context.setDevice(this.context.mobile ? 'MOBILE_TOUCH' : 'DESKTOP_KEYBOARD_MOUSE');
  }

  onPointerDown(e) {
    if (!this.context.isEnabled() || this.context.isLocked()) return;
    this.context.setDevice(e.pointerType === 'mouse' ? 'DESKTOP_KEYBOARD_MOUSE' : 'MOBILE_TOUCH');
    this.context.initAudio();
    this.state.isTouchDevice = e.pointerType === 'touch' || this.context.mobile;

    const coords = this.getCanvasCoordinates(e);

    const layout = getMobileUILayout(this.context.canvas);
    if (!layout.contains(coords.x, coords.y)) return;

    if (this.context.isArenaCombat() && (this.context.mobile || e.pointerType === 'touch' || this.state.isTouchDevice)) {
      const control = hitArenaMobileControl(layout, coords.x, coords.y);
      if (control) {
        if (e.preventDefault && e.cancelable !== false) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        if (control === 'sword') this.context.action();
        else if (control === 'special') this.context.special();
        else {
          const pointerId = e.pointerId ?? 'touch';
          if (this.state.arenaTouchPointers.size) return;
          this.state.arenaTouchPointers.set(pointerId, arenaDirectionVector(layout,coords.x,coords.y));
          this.refreshArenaTouchButtons();
          if (this.context.canvas && typeof this.context.canvas.setPointerCapture === 'function' && typeof e.pointerId === 'number') {
            try { this.context.canvas.setPointerCapture(e.pointerId); } catch (_) {}
          }
        }
        return;
      }
      return;
    }

    // 1. Prioridade Total: Zona do Botão de Ação (Canto Inferior Direito)
    if (this.isActionButtonHit(coords)) {
      if (e.preventDefault && e.cancelable) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      this.state.actionBtnPressed = true;
      setTimeout(() => {
        this.state.actionBtnPressed = false;
      }, 180);
      this.context.action();
      return;
    }

    // 2. Joystick Virtual Flutuante Dinâmico (Metade Esquerda da Tela)
    // A origem visual fica dentro da área segura; o vetor continua relativo ao primeiro toque.
    if (coords.x < layout.safeLeft + layout.usableWidth * 0.55) {
      if (this.state.touchState.active) return;
      if (e.preventDefault && e.cancelable) e.preventDefault();
      if (this.context.canvas && typeof this.context.canvas.setPointerCapture === 'function' && e.pointerId !== undefined) {
        try {
          this.context.canvas.setPointerCapture(e.pointerId);
        } catch (_) {}
      }

      this.state.touchState.active = true;
      this.state.touchState.pointerId = e.pointerId !== undefined ? e.pointerId : 'touch';
      const origin = layout.joystickOrigin(coords.x, coords.y);
      this.state.touchState.startX = origin.x;
      this.state.touchState.startY = origin.y;
      this.state.touchState.pointerStartX = coords.x;
      this.state.touchState.pointerStartY = coords.y;
      this.state.touchState.currentX = origin.x;
      this.state.touchState.currentY = origin.y;
      this.state.touchState.vectorX = 0;
      this.state.touchState.vectorY = 0;
    }
  }

  onPointerMove(e) {
    if (!this.context.isEnabled() || this.context.isLocked()) return;
    const pointerId=e.pointerId??'touch';
    if(this.state.arenaTouchPointers.has(pointerId)) {
      if(e.preventDefault&&e.cancelable)e.preventDefault();
      const coords=this.getCanvasCoordinates(e);
      this.state.arenaTouchPointers.set(pointerId,arenaDirectionVector(getMobileUILayout(this.context.canvas),coords.x,coords.y));
      this.refreshArenaTouchButtons();
      return;
    }
    if (!this.state.touchState.active) return;
    if (e.pointerId !== undefined && this.state.touchState.pointerId !== null && e.pointerId !== this.state.touchState.pointerId) return;

    if (e.preventDefault && e.cancelable) e.preventDefault();
    const coords = this.getCanvasCoordinates(e);
    this.state.touchState.currentX = this.state.touchState.startX + coords.x - this.state.touchState.pointerStartX;
    this.state.touchState.currentY = this.state.touchState.startY + coords.y - this.state.touchState.pointerStartY;

    const dx = this.state.touchState.currentX - this.state.touchState.startX;
    const dy = this.state.touchState.currentY - this.state.touchState.startY;
    const dist = Math.hypot(dx, dy);
    const controlScale = getMobileUILayout(this.context.canvas).action.scale;
    const deadzone = 8 * controlScale;
    const maxRadius = 50 * controlScale;

    if (dist < deadzone) {
      this.state.touchState.vectorX = 0;
      this.state.touchState.vectorY = 0;
    } else {
      // Vetor de movimento com quantização estrita em 8 direções
      const angle = Math.atan2(dy, dx);
      const sector = Math.round(angle / (Math.PI / 4));
      const snappedAngle = sector * (Math.PI / 4);
      const intensity = Math.min(1.0, (dist - deadzone) / (maxRadius - deadzone));

      this.state.touchState.vectorX = Math.cos(snappedAngle) * intensity;
      this.state.touchState.vectorY = Math.sin(snappedAngle) * intensity;
    }
  }

  onPointerUp(e) {
    const pointerId = e.pointerId ?? 'touch';
    if(this.state.arenaTouchPointers.has(pointerId)&&typeof e.pointerId==='number') {
      try { this.context.canvas?.releasePointerCapture?.(pointerId); } catch (_) {}
    }
    if (e.pointerId === undefined) this.state.arenaTouchPointers.clear();
    else this.state.arenaTouchPointers.delete(pointerId);
    this.refreshArenaTouchButtons();
    if (this.state.touchState.active) {
      if (e.pointerId === undefined || this.state.touchState.pointerId === null || e.pointerId === this.state.touchState.pointerId) {
        const pointerId = e.pointerId ?? this.state.touchState.pointerId;
        if (this.context.canvas && typeof this.context.canvas.releasePointerCapture === 'function' && typeof pointerId === 'number') {
          try {
            this.context.canvas.releasePointerCapture(pointerId);
          } catch (_) {}
        }
        // Oculta/remove completamente o joystick visual e zera o vetor de velocidade
        this.state.touchState.active = false;
        this.state.touchState.pointerId = null;
        this.state.touchState.vectorX = 0;
        this.state.touchState.vectorY = 0;
        this.context.player.vx = 0;
        this.context.player.vy = 0;
        this.context.player.isMoving = false;
      }
    }
  }

  clearInput() {
    this.onPointerUp({});
    this.state.arenaTouchPointers.clear();
    this.refreshArenaTouchButtons();
    this.state.keysDown = {};
    this.context.player.vx = 0;
    this.context.player.vy = 0;
    this.context.player.isMoving = false;
    this.state.actionBtnPressed = false;
  }

  refreshArenaTouchButtons() {
    const values=[...this.state.arenaTouchPointers.values()];
    const vectors=values.filter(value=>value&&typeof value==='object');
    for (const direction of Object.keys(this.state.arenaTouchButtons)) {
      const active=vectors.some(v=>direction==='left'?v.x<-.18:direction==='right'?v.x>.18
        :direction==='up'?v.y<-.18:v.y>.18);
      this.state.arenaTouchButtons[direction] = values.includes(direction)||active;
    }
  }

  removeListeners() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.context.handlers.onKeyDown);
      window.removeEventListener('keyup', this.context.handlers.onKeyUp);
      window.removeEventListener('pointermove', this.context.handlers.handlePointerMove);
      window.removeEventListener('pointerup', this.context.handlers.handlePointerUp);
      window.removeEventListener('pointercancel', this.context.handlers.handlePointerUp);
      window.removeEventListener('blur', this.context.handlers.handleBlur);
    }
    if (this.context.canvas) {
      this.context.canvas.removeEventListener('uilayoutchange', this.context.handlers.handlePointerUp);
      this.context.canvas.removeEventListener('pointerdown', this.context.handlers.handlePointerDown);
      this.context.canvas.removeEventListener('lostpointercapture', this.context.handlers.handlePointerUp);
    }
  }
}
