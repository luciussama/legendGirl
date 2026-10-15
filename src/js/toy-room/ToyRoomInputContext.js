/** Integra os controles com a fase sem copiar estado ou reter atores substituídos por restore. */
export function createToyRoomInputContext(room) {
  return {
    state: {
      get keysDown() { return room.keysDown; },
      set keysDown(value) { room.keysDown = value; },
      get isTouchDevice() { return room.isTouchDevice; },
      set isTouchDevice(value) { room.isTouchDevice = value; },
      get actionBtnPressed() { return room.actionBtnPressed; },
      set actionBtnPressed(value) { room.actionBtnPressed = value; },
      get touchState() { return room.touchState; },
      get gamepadState() { return room.gamepadState; },
      get arenaTouchPointers() { return room.arenaTouchPointers; },
      get arenaTouchButtons() { return room.arenaTouchButtons; },
      get arenaSpecialButtons() { return room.arenaSpecialButtons; }
    },
    get canvas() { return room.canvas; },
    get player() { return room.player; },
    get mobile() { return room.mobilePresentation; },
    get device() { return room.tutorial.device; },
    get handlers() {
      return {
        onKeyDown: room.onKeyDown, onKeyUp: room.onKeyUp,
        handlePointerDown: room.handlePointerDown, handlePointerMove: room.handlePointerMove,
        handlePointerUp: room.handlePointerUp, handleBlur: room.handleBlur
      };
    },
    isEnabled: () => room.isInputEnabled(),
    isLocked: () => room.story?.inputLocked,
    isArenaCombat: () => room.arena?.state.status === 'COMBAT',
    setDevice: device => room.tutorial.setDevice(device),
    initAudio: () => { if (room.audio && room.audio.initAudio) room.audio.initAudio(); },
    action: () => room.triggerAction(),
    special: () => room.arena.special()
  };
}
