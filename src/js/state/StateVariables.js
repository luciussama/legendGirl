import { createBabyState, createFairyState } from '../config.js';

/**
 * Default initial values and structures for GameState
 */
export function createDefaultStateVariables() {
  const baby = createBabyState();
  const fairy = createFairyState();

  baby.facing = 1; // 1 = facing right, -1 = facing left
  baby.isShocked = false;
  baby.isLyingDown = false;
  baby.isCrouching = true;
  baby.controlsLocked = true;

  return {
    // Player and Guide Entities
    baby,
    fairy,

    // Phase and Room modes
    currentPhaseMode: 'bedroom', // 'bedroom' | 'toy-room'
    toyRoomInstance: null,
    isEscapeMode: false,
    escapeLevel: 0, // 0 to 11
    currentScrollSpeed: 1.5,
    targetScrollSpeed: 1.5,
    escapeBannerTimer: 0,
    escapeBannerText: '',
    firstPlatformCleared: false,

    // Phase 3 & Plot Twist
    isPhase3: false,
    phase3Level: 0, // 0 to 14
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

    // Cutscene (Phase 1 -> Phase 2 Castle)
    cutsceneActive: false,
    cutsceneTriggered: false,
    cutsceneCompleted: false,
    cutsceneStep: 1,
    cutsceneTimer: 0,

    // Camera & Viewport
    cameraX: 0,
    cameraY: 0,
    targetCameraY: 0,
    cameraZoom: 1.0,
    targetCameraZoom: 1.0,
    isPortrait: false,

    // Standby & Diegetic Preparation
    isStandbyActive: false,
    isStandbyTransitioning: false,
    standbyTransitionTimer: 0,
    standbyTransitionProgress: 0,
    standbyStandUpProgress: 0,
    standbyDialogueAlpha: 1.0,
    standbyActivatedTime: 0,
    lastUsedInputDevice: 'keyboard', // 'keyboard' | 'gamepad' | 'touch'

    // Game lifecycle & Timers
    gameWon: false,
    isGameOver: false,
    gameStarted: false,
    loopStarted: false,
    tick: 0,
    lastTime: typeof performance !== 'undefined' ? performance.now() : Date.now(),
    lastJumpTime: 0,
    lastDialogueAdvanceTime: 0,
    failMessageTimer: null,

    // Particle & Trail Buffers
    speedRibbons: [],
    babyJumpDust: []
  };
}
