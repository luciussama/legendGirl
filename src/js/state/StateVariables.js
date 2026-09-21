import { createBabyState, createFairyState } from '../config.js';

/**
 * Estruturas e valores iniciais padrão para o GameState
 */
export function createDefaultStateVariables() {
  const baby = createBabyState();
  const fairy = createFairyState();

  baby.facing = 1; // 1 = olhando para a direita, -1 = olhando para a esquerda
  baby.isShocked = false;
  baby.isLyingDown = false;
  baby.isCrouching = true;
  baby.controlsLocked = true;

  return {
    // Entidades do Jogador e da Guia
    baby,
    fairy,

    // Modos de Fase e Sala
    currentPhaseMode: 'bedroom', // 'bedroom' | 'toy-room'
    toyRoomInstance: null,
    isEscapeMode: false,
    escapeLevel: 0, // 0 a 11
    currentScrollSpeed: 1.5,
    targetScrollSpeed: 1.5,
    escapeBannerTimer: 0,
    escapeBannerText: '',
    firstPlatformCleared: false,

    // Fase 3 e Reviravolta (Plot Twist)
    isPhase3: false,
    phase3Level: 0, // 0 a 14
    plotTwistActive: false,
    plotTwistTriggered: false,
    plotTwistStep: 0,
    plotTwistTimer: 0,
    fakeDoorRevealed: false,
    fakeDoorSlideY: 0,
    fakeDoorRotation: 0,
    phase3TutorialActive: false,
    phase3TutorialProgress: 0,
    truePortalTransitionActive: false,
    truePortalTransitionTimer: 0,
    trueDoorOpenAngle: 0,
    transitionWipeAlpha: 0,

    // Cinemática (Fase 1 -> Castelo da Fase 2)
    cutsceneActive: false,
    cutsceneTriggered: false,
    cutsceneCompleted: false,
    cutsceneStep: 1,
    cutsceneTimer: 0,

    // Câmera e Viewport
    cameraX: 0,
    cameraY: 0,
    targetCameraY: 0,
    cameraZoom: 1.0,
    targetCameraZoom: 1.0,
    isPortrait: false,

    // Prontidão (Standby) e Preparação Diegética
    isStandbyActive: false,
    isStandbyTransitioning: false,
    standbyTransitionTimer: 0,
    standbyTransitionProgress: 0,
    standbyStandUpProgress: 0,
    standbyDialogueAlpha: 1.0,
    standbyActivatedTime: 0,
    lastUsedInputDevice: 'keyboard', // 'keyboard' | 'gamepad' | 'touch'

    // Ciclo de Vida do Jogo e Temporizadores
    gameWon: false,
    isGameOver: false,
    gameStarted: false,
    loopStarted: false,
    tick: 0,
    lastTime: typeof performance !== 'undefined' ? performance.now() : Date.now(),
    lastJumpTime: 0,
    lastDialogueAdvanceTime: 0,
    failMessageTimer: null,

    // Buffers de Partículas e Rastros de Movimento
    speedRibbons: [],
    babyJumpDust: []
  };
}
