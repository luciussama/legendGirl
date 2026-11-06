/** Integra os controles com a fase sem copiar estado ou reter atores substituídos por restore. */
export function createToyRoomInputContext(room) {
  return {
    state: {
      /** Expõe o mapa atual de teclas para que a entrada acompanhe restaurações da sala. */
      get keysDown() {
        return room.keysDown;
      },
      /** Substitui o mapa de teclas da sala sem manter uma cópia local. */
      set keysDown(value) {
        room.keysDown = value;
      },
      /** Consulta se o último dispositivo de entrada foi toque. */
      get isTouchDevice() {
        return room.isTouchDevice;
      },
      /** Atualiza a marca de uso de toque observada pela sala. */
      set isTouchDevice(value) {
        room.isTouchDevice = value;
      },
      /** Lê o sinal visual transitório do botão de ação. */
      get actionBtnPressed() {
        return room.actionBtnPressed;
      },
      /** Atualiza o sinal visual do botão sem duplicar o estado da interface. */
      set actionBtnPressed(value) {
        room.actionBtnPressed = value;
      },
      /** Fornece o vetor e o identificador do toque atualmente capturado. */
      get touchState() {
        return room.touchState;
      },
      /** Fornece o estado dos eixos e botões do gamepad ativo. */
      get gamepadState() {
        return room.gamepadState;
      },
      /** Expõe os ponteiros direcionais independentes da arena. */
      get arenaTouchPointers() {
        return room.arenaTouchPointers;
      },
      /** Expõe os botões direcionais derivados dos ponteiros da arena. */
      get arenaTouchButtons() {
        return room.arenaTouchButtons;
      },
      /** Expõe os botões especiais mantidos por cada gamepad conectado. */
      get arenaSpecialButtons() {
        return room.arenaSpecialButtons;
      },
    },
    /** Mantém acesso ao canvas atual do host sem guardar uma referência paralela. */
    get canvas() {
      return room.canvas;
    },
    /** Fornece o jogador atual, inclusive quando um restore substitui a entidade. */
    get player() {
      return room.player;
    },
    /** Informa se a apresentação da sala foi configurada para dispositivo móvel. */
    get mobile() {
      return room.mobilePresentation;
    },
    /** Consulta o dispositivo selecionado para as instruções do tutorial. */
    get device() {
      return room.tutorial.device;
    },
    /** Fornece handlers vinculados atuais para instalação e remoção coerentes de listeners. */
    get handlers() {
      return {
        onKeyDown: room.onKeyDown,
        onKeyUp: room.onKeyUp,
        handlePointerDown: room.handlePointerDown,
        handlePointerMove: room.handlePointerMove,
        handlePointerUp: room.handlePointerUp,
        handleBlur: room.handleBlur,
      };
    },
    /** Consulta o bloqueio global de entrada definido pelo host. */
    isEnabled: () => room.isInputEnabled(),
    /** Consulta se a narrativa da espada bloqueia as ações de exploração. */
    isLocked: () => room.story?.inputLocked,
    /** Distingue o combate ativo da arena dos outros modos da sala. */
    isArenaCombat: () => room.arena?.state.status === 'COMBAT',
    /** Atualiza o rótulo de dispositivo usado pelo tutorial. */
    setDevice: (device) => room.tutorial.setDevice(device),
    /** Inicializa o áudio somente quando o host disponibiliza o método correspondente. */
    initAudio: () => {
      if (room.audio && room.audio.initAudio) room.audio.initAudio();
    },
    /** Encaminha a ação para o modo atualmente ativo da sala. */
    action: () => room.triggerAction(),
    /** Encaminha o golpe especial para o controlador da arena. */
    special: () => room.arena.special(),
  };
}
