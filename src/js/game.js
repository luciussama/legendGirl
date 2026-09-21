import { GAME_CONFIG, FLOOR_Y, platforms, exitDoor, phase3Platforms, trueExitDoor, roomScenery, createBabyState, createFairyState, CUTSCENE_DIALOGUE, getEscapeStats, getPhase3Stats } from './config.js';
import { createAudioController } from './controllers/AudioController.js';
import { createCameraController } from './controllers/CameraController.js';
import { bindInput, InputController } from './controllers/InputController.js';
import { createToyRoom } from './toyRoom.js';
import { createGameState } from './state/GameState.js';
import { babyRenderer, fairyRenderer } from './entities/index.js';
import { backgroundRenderer, platformRenderer, createLightingSystem } from './environment/index.js';
import { createParticleSystem, transitionEffects } from './effects/index.js';
import { hudRenderer, dialogueRenderer } from './ui/index.js';

export function createGame(canvas, uiFeedback, callbacks = {}) {
  const ctx = canvas.getContext('2d');
  const audio = createAudioController();
  const state = createGameState(canvas, uiFeedback, callbacks);
  const camera = createCameraController({ floorY: FLOOR_Y });
  const lighting = createLightingSystem({ floorY: FLOOR_Y });
  const particles = createParticleSystem({ babyJumpDust: state.babyJumpDust, speedRibbons: state.speedRibbons });
  const baby = state.baby;
  const fairy = state.fairy;

  baby.facing = 1; // 1 = facing right, -1 = facing left
  baby.isShocked = false;
  baby.isLyingDown = false;
  baby.isCrouching = true;
  baby.controlsLocked = true;

  let currentPhaseMode = 'bedroom'; // 'bedroom' | 'toy-room'
  let toyRoomInstance = null;

  let cameraX = 0;
  let cameraY = 0;
  let targetCameraY = 0;
  let cameraZoom = 1.0;
  let targetCameraZoom = 1.0;
  let isPortrait = false;
  let gameWon = false;
  let isGameOver = false;
  let gameStarted = false;
  let loopStarted = false;
  let lastJumpTime = 0;
  let lastDialogueAdvanceTime = 0;
  let lastTime = performance.now();
  const TARGET_FPS = 60;
  const STEP_MS = 1000 / TARGET_FPS;
  let failMessageTimer = null;
  let firstPlatformCleared = false;
  let tick = 0;

  // --- STANDBY & DIEGETIC PREPARATION STATE ---
  let isStandbyActive = false;
  let isStandbyTransitioning = false;
  let standbyTransitionTimer = 0;
  let standbyTransitionProgress = 0;
  let standbyStandUpProgress = 0;
  let standbyDialogueAlpha = 1.0;
  let standbyActivatedTime = 0;
  let lastUsedInputDevice = 'keyboard'; // 'keyboard' | 'gamepad' | 'touch'

  function syncStateToLocals() {
    currentPhaseMode = state.currentPhaseMode;
    toyRoomInstance = state.toyRoomInstance;
    cameraX = state.cameraX;
    cameraY = state.cameraY;
    targetCameraY = state.targetCameraY;
    cameraZoom = state.cameraZoom;
    targetCameraZoom = state.targetCameraZoom;
    isPortrait = state.isPortrait;
    gameWon = state.gameWon;
    isGameOver = state.isGameOver;
    gameStarted = state.gameStarted;
    loopStarted = state.loopStarted;
    lastJumpTime = state.lastJumpTime;
    lastDialogueAdvanceTime = state.lastDialogueAdvanceTime;
    lastTime = state.lastTime;
    firstPlatformCleared = state.firstPlatformCleared;
    tick = state.tick;
    isStandbyActive = state.isStandbyActive;
    isStandbyTransitioning = state.isStandbyTransitioning;
    standbyTransitionTimer = state.standbyTransitionTimer;
    standbyTransitionProgress = state.standbyTransitionProgress;
    standbyStandUpProgress = state.standbyStandUpProgress;
    standbyDialogueAlpha = state.standbyDialogueAlpha;
    standbyActivatedTime = state.standbyActivatedTime;
    lastUsedInputDevice = state.lastUsedInputDevice;
    cutsceneActive = state.cutsceneActive;
    cutsceneTriggered = state.cutsceneTriggered;
    cutsceneCompleted = state.cutsceneCompleted;
    cutsceneStep = state.cutsceneStep;
    cutsceneTimer = state.cutsceneTimer;
    isEscapeMode = state.isEscapeMode;
    escapeLevel = state.escapeLevel;
    currentScrollSpeed = state.currentScrollSpeed;
    targetScrollSpeed = state.targetScrollSpeed;
    escapeBannerTimer = state.escapeBannerTimer;
    escapeBannerText = state.escapeBannerText;
    isPhase3 = state.isPhase3;
    phase3Level = state.phase3Level;
    plotTwistActive = state.plotTwistActive;
    plotTwistTriggered = state.plotTwistTriggered;
    plotTwistStep = state.plotTwistStep;
    plotTwistTimer = state.plotTwistTimer;
    fakeDoorRevealed = state.fakeDoorRevealed;
    fakeDoorSlideY = state.fakeDoorSlideY;
    fakeDoorRotation = state.fakeDoorRotation;
    phase3TutorialActive = state.phase3TutorialActive;
    phase3TutorialProgress = state.phase3TutorialProgress;
    truePortalTransitionActive = state.truePortalTransitionActive;
    truePortalTransitionTimer = state.truePortalTransitionTimer;
    trueDoorOpenAngle = state.trueDoorOpenAngle;
    transitionWipeAlpha = state.transitionWipeAlpha;
  }

  function syncLocalsToState() {
    state.currentPhaseMode = currentPhaseMode;
    state.toyRoomInstance = toyRoomInstance;
    state.cameraX = cameraX;
    state.cameraY = cameraY;
    state.targetCameraY = targetCameraY;
    state.cameraZoom = cameraZoom;
    state.targetCameraZoom = targetCameraZoom;
    state.isPortrait = isPortrait;
    state.gameWon = gameWon;
    state.isGameOver = isGameOver;
    state.gameStarted = gameStarted;
    state.loopStarted = loopStarted;
    state.lastJumpTime = lastJumpTime;
    state.lastDialogueAdvanceTime = lastDialogueAdvanceTime;
    state.lastTime = lastTime;
    state.firstPlatformCleared = firstPlatformCleared;
    state.tick = tick;
    state.isStandbyActive = isStandbyActive;
    state.isStandbyTransitioning = isStandbyTransitioning;
    state.standbyTransitionTimer = standbyTransitionTimer;
    state.standbyTransitionProgress = standbyTransitionProgress;
    state.standbyStandUpProgress = standbyStandUpProgress;
    state.standbyDialogueAlpha = standbyDialogueAlpha;
    state.standbyActivatedTime = standbyActivatedTime;
    state.lastUsedInputDevice = lastUsedInputDevice;
    state.cutsceneActive = cutsceneActive;
    state.cutsceneTriggered = cutsceneTriggered;
    state.cutsceneCompleted = cutsceneCompleted;
    state.cutsceneStep = cutsceneStep;
    state.cutsceneTimer = cutsceneTimer;
    state.isEscapeMode = isEscapeMode;
    state.escapeLevel = escapeLevel;
    state.currentScrollSpeed = currentScrollSpeed;
    state.targetScrollSpeed = targetScrollSpeed;
    state.escapeBannerTimer = escapeBannerTimer;
    state.escapeBannerText = escapeBannerText;
    state.isPhase3 = isPhase3;
    state.phase3Level = phase3Level;
    state.plotTwistActive = plotTwistActive;
    state.plotTwistTriggered = plotTwistTriggered;
    state.plotTwistStep = plotTwistStep;
    state.plotTwistTimer = plotTwistTimer;
    state.fakeDoorRevealed = fakeDoorRevealed;
    state.fakeDoorSlideY = fakeDoorSlideY;
    state.fakeDoorRotation = fakeDoorRotation;
    state.phase3TutorialActive = phase3TutorialActive;
    state.phase3TutorialProgress = phase3TutorialProgress;
    state.truePortalTransitionActive = truePortalTransitionActive;
    state.truePortalTransitionTimer = truePortalTransitionTimer;
    state.trueDoorOpenAngle = trueDoorOpenAngle;
    state.transitionWipeAlpha = transitionWipeAlpha;
  }

  function setLastInputDevice(dev) {
    state.setLastInputDevice(dev);
    lastUsedInputDevice = state.lastUsedInputDevice;
  }

  function getActivePromptDevice() {
    return state.getActivePromptDevice();
  }

  function startStandbyPreparation() {
    syncLocalsToState();
    state.startStandbyPreparation(audio);
    syncStateToLocals();
  }

  function confirmStandby() {
    syncLocalsToState();
    state.confirmStandby(audio);
    syncStateToLocals();
  }

  // Rigid reset of physics components to prevent vector accumulation or delta spikes
  function resetBabyPhysicsBody(targetX, targetY, facing = 1) {
    syncLocalsToState();
    state.resetBabyPhysicsBody(targetX, targetY, facing);
    syncStateToLocals();
  }

  function triggerGameOver() {
    syncLocalsToState();
    state.triggerGameOver(audio);
    syncStateToLocals();
  }

  function retryGame() {
    syncLocalsToState();
    state.retryGame(audio);
    syncStateToLocals();
  }

  function restartToTitle() {
    syncLocalsToState();
    state.restartToTitle(audio);
    syncStateToLocals();
  }

  function startToyRoomPhase() {
    isGameOver = false;
    gameWon = false;
    gameStarted = true;
    audio.stopAllAudio();
    audio.clearActiveSounds();

    if (toyRoomInstance) {
      toyRoomInstance.destroy();
      toyRoomInstance = null;
    }

    currentPhaseMode = 'toy-room';
    toyRoomInstance = createToyRoom(canvas, audio, uiFeedback, () => {
      restartToTitle();
    });

    audio.startToyRoomMusic();
    if (!loopStarted) {
      loopStarted = true;
      requestAnimationFrame(loop);
    }
  }

  // Persistent offscreen canvas for dark atmosphere lighting (avoids GC per-frame allocations)
  const darkCanvas = document.createElement('canvas');
  const dctx = darkCanvas.getContext('2d');

  // Viewport and Resolution Adaptation (Zero distortion on Mobile Portrait and Desktop Landscape)
  function handleResize() {
    const rect = (canvas && typeof canvas.getBoundingClientRect === 'function') ? canvas.getBoundingClientRect() : null;
    const w = (rect && rect.width > 0) ? rect.width : (window.innerWidth || 960);
    const h = (rect && rect.height > 0) ? rect.height : (window.innerHeight || 540);
    const aspect = (w > 0 && h > 0) ? (w / h) : (16 / 9);
    isPortrait = aspect < 1.15;

    if (isPortrait) {
      // Mobile / Portrait: Maintain wide FoV (width 540) and scale height orthographically
      canvas.width = 540;
      canvas.height = Math.round(540 / aspect) || 960;
    } else {
      // Desktop / Landscape: Base height 540 and scale width orthographically
      canvas.height = 540;
      canvas.width = Math.round(540 * aspect) || 960;
    }

    darkCanvas.width = canvas.width;
    darkCanvas.height = canvas.height;
    lighting.resize(canvas.width, canvas.height);
  }

  window.addEventListener('resize', handleResize);
  if (window.ResizeObserver && canvas.parentElement) {
    const ro = new ResizeObserver(() => handleResize());
    ro.observe(canvas.parentElement);
  }
  handleResize();

  // Cutscene State (Fase 1 -> Fase 2 Castle)
  let cutsceneActive = false;
  let cutsceneTriggered = false;
  let cutsceneCompleted = false;
  let cutsceneStep = 1;
  let cutsceneTimer = 0;

  // Escape Mode State (Fase 2 - 12 Plataformas Subindo para a Direita)
  let isEscapeMode = false;
  let escapeLevel = 0; // 0 to 11
  let currentScrollSpeed = 1.5;
  let targetScrollSpeed = 1.5;
  let escapeBannerTimer = 0;
  let escapeBannerText = '';
  const speedRibbons = state.speedRibbons;
  const babyJumpDust = state.babyJumpDust;

  // FASE 3 & PLOT TWIST STATE
  let isPhase3 = false;
  let phase3Level = 0; // 0 to 14 (15 plataformas de brinquedos)
  let plotTwistActive = false;
  let plotTwistTriggered = false;
  let plotTwistStep = 0; // 1: queda da porta e tombo, 2: fadinha desce para checar, 3: fadinha sobe alto/close-up, 4: fala da criança, 5: vaivém e fala da fadinha
  let plotTwistTimer = 0;
  let fakeDoorRevealed = false;
  let fakeDoorSlideY = 0;
  let fakeDoorRotation = 0;
  let phase3TutorialActive = false;
  let phase3TutorialProgress = 0;
  let truePortalTransitionActive = false;
  let truePortalTransitionTimer = 0;
  let trueDoorOpenAngle = 0;
  let transitionWipeAlpha = 0;

  function startTruePortalTransition() {
    syncLocalsToState();
    state.startTruePortalTransition(audio);
    syncStateToLocals();
  }

  function showFailMessage() {
    state.showFailMessage();
  }

  function startCastleCutscene() {
    syncLocalsToState();
    state.startCastleCutscene(audio);
    syncStateToLocals();
  }

  function advanceCutscene() {
    syncLocalsToState();
    state.advanceCutscene(audio);
    syncStateToLocals();
  }

  function finishCutscene() {
    syncLocalsToState();
    state.finishCutscene(audio);
    syncStateToLocals();
  }

  // --- PLOT TWIST CINEMATIC (FASE 3 TRANSITION) ---
  function startPlotTwistCutscene() {
    syncLocalsToState();
    state.startPlotTwistCutscene(audio);
    syncStateToLocals();
  }

  function advancePlotTwist() {
    syncLocalsToState();
    state.advancePlotTwist(audio);
    syncStateToLocals();
  }

  function finishPlotTwistAndStartTutorial() {
    syncLocalsToState();
    state.finishPlotTwistAndStartTutorial(audio);
    syncStateToLocals();
  }

  function resetToStart(failedMidClimb = false, shouldPlayFailSound = true) {
    syncLocalsToState();
    state.resetToStart(failedMidClimb, shouldPlayFailSound, audio);
    syncStateToLocals();
  }

  function doJump() {
    audio.initAudio();

    if (isGameOver || !gameStarted) {
      return;
    }

    const now = performance.now();

    // Standby confirmation: Space, Button X, or Touch to commence gameplay
    if (isStandbyActive) {
      if (now - standbyActivatedTime < 220) return;
      confirmStandby();
      return;
    }

    if (isStandbyTransitioning) {
      return;
    }

    if (gameWon) {
      if (now - lastJumpTime < 400) return;
      lastJumpTime = now;
      gameWon = false;
      resetToStart(false, false);
      return;
    }

    // Advance cutscene on touch with anti-spam cooldown
    if (cutsceneActive) {
      if (now - lastDialogueAdvanceTime < 320) return;
      lastDialogueAdvanceTime = now;
      advanceCutscene();
      return;
    }

    // Advance plot twist cutscene on touch (only during dialogue steps 4 and 5) with anti-spam cooldown
    if (plotTwistActive) {
      if (plotTwistStep >= 4) {
        if (now - lastDialogueAdvanceTime < 320) return;
        lastDialogueAdvanceTime = now;
        advancePlotTwist();
      }
      return;
    }

    // Check if controls are locked or if baby is still settling from respawn or crouching
    if (baby.controlsLocked || baby.respawnLandingPending || baby.isCrouching) {
      return;
    }

    // Grounded check: strictly require onGround confirmed by collision solver
    if (!baby.onGround) {
      return;
    }

    // Physics jump with input debounce lock
    if (now - lastJumpTime < 160) {
      return;
    }
    lastJumpTime = now;

    // Immediately clear onGround to prevent multiple jump inputs stacking in a single frame
    baby.onGround = false;

    if (isPhase3) {
      const currentLvl = Math.max(0, Math.min(14, phase3Level || 0));
      const stats = getPhase3Stats(currentLvl);
      baby.vy = stats.jumpPower;
      baby.vx = stats.airVx; // Dynamic forward momentum impulse towards the left
      audio.playLongJumpSound(currentLvl / 14);
      fairy.vy -= 2.8;
      fairy.spinAnim = 1.6;

      // Visual sparkles burst & jump puff
      spawnBabyJumpPuff(baby.x + baby.w / 2, baby.y + baby.h, 6 + currentLvl);
      const burstCount = 6 + currentLvl * 2;
      spawnFairySparkles(baby.x + baby.w / 2, baby.y + baby.h, burstCount);
    } else if (baby.longJumpUnlocked) {
      const currentLvl = Math.max(0, Math.min(11, escapeLevel || 0));
      const stats = getEscapeStats(currentLvl);
      baby.vy = stats.jumpPower;
      baby.vx = stats.airVx; // Dynamic forward momentum impulse matching level
      audio.playLongJumpSound(currentLvl / 11);
      fairy.vy -= 2.8;
      fairy.spinAnim = 1.6;

      // Visual sparkles burst & jump puff
      spawnBabyJumpPuff(baby.x + baby.w / 2, baby.y + baby.h, 6 + currentLvl);
      const burstCount = 6 + currentLvl * 2;
      spawnFairySparkles(baby.x + baby.w / 2, baby.y + baby.h, burstCount);
    } else {
      baby.vy = baby.jumpPower;
      audio.playJumpSound();
      fairy.vy -= 2.2;
      fairy.spinAnim = 1.0;
      spawnBabyJumpPuff(baby.x + baby.w / 2, baby.y + baby.h, 5);
      spawnFairySparkles(fairy.x, fairy.y, 6);
    }
  }

  // --- FAIRY MAGIC DUST SYSTEM ---
  function spawnFairyFlightDust(fx, fy, fvx, fvy) {
    state.spawnFairyFlightDust(fx, fy, fvx, fvy);
  }

  function spawnFairySparkles(x, y, count = 2) {
    state.spawnFairySparkles(x, y, count);
  }

  function updateFairyParticles() {
    state.updateFairyParticles();
  }

  // --- SUBTLE BABY JUMP TRAIL SYSTEM ---
  function spawnBabyJumpDust(bx, bw, by, bh, bvx) {
    particles.spawnBabyJumpDust(bx, bw, by, bh, bvx, isEscapeMode, escapeLevel);
  }

  function spawnBabyJumpPuff(x, y, count = 5) {
    particles.spawnBabyJumpPuff(x, y, count);
  }

  function spawnBabyLandingPuff(x, y) {
    particles.spawnBabyLandingPuff(x, y);
  }

  function updateBabyJumpDust(dt = 1.0) {
    particles.updateBabyJumpDust(dt);
  }

  // --- ENVIRONMENT RENDERERS (Modularized in /environment) ---
  function drawBackgroundWall(camX) {
    backgroundRenderer.renderWall(ctx, canvas, camX, { tick });
  }

  function drawSceneryItems(camX) {
    backgroundRenderer.renderScenery(ctx, canvas, roomScenery, camX);
  }

  function drawPlatforms(camX) {
    platformRenderer.renderPlatforms(ctx, canvas, camX, {
      isPhase3,
      platforms: isPhase3 ? phase3Platforms : platforms,
      baby,
      tick
    });
  }

  function drawExitDoor(camX) {
    platformRenderer.renderExitDoor(ctx, canvas, camX, {
      exitDoor,
      fakeDoorRevealed,
      fakeDoorSlideY,
      fakeDoorRotation,
      tick
    });
  }

  function drawTrueExitDoor(camX) {
    platformRenderer.renderTrueExitDoor(ctx, canvas, camX, {
      trueExitDoor,
      trueDoorOpenAngle,
      tick
    });
  }

  // --- CHARACTER ENTITY RENDERERS (Modularized in /entities) ---
  function drawBabyManaStyle(camX) {
    syncLocalsToState();
    babyRenderer.render(ctx, baby, state, camX);
  }

  function drawFairy(camX) {
    syncLocalsToState();
    fairyRenderer.render(ctx, fairy, state, camX, { canvas, baby, platforms });
  }

  // --- ATMOSPHERIC DYNAMIC LIGHTING (Modularized in /environment) ---
  function applyDarkAtmosphereWithLights(camX, camY = 0) {
    syncLocalsToState();
    lighting.apply(ctx, canvas, state, baby, fairy, camX, camY, {
      platforms,
      phase3Platforms,
      exitDoor,
      trueExitDoor
    });
  }

  // --- PARTICLE EFFECTS RENDERING (Modularized in /effects) ---
  function drawSpeedRibbons(camX) {
    particles.renderSpeedRibbons(ctx, canvas, camX);
  }

  function drawBabyJumpDust(camX) {
    particles.renderBabyJumpDust(ctx, canvas, camX);
  }

  // --- UI & HUD RENDERING (Modularized in /ui) ---
  function drawEscapeBanner() {
    hudRenderer.renderEscapeBanner(ctx, canvas, state, cameraX, baby);
  }

  function drawDialoguePortrait(pCtx, charType, px, py, radius, mood = 'normal') {
    dialogueRenderer.drawPortrait(pCtx, charType, px, py, radius, mood, tick);
  }

  function wrapDialogueText(pCtx, text, maxWidth) {
    return dialogueRenderer.wrapText(pCtx, text, maxWidth);
  }

  function drawCutsceneDialogue() {
    dialogueRenderer.renderCutsceneDialogue(ctx, canvas, state, {
      getActivePromptDevice
    });
  }

  // --- TUTORIAL VISUAL GUIDE (Modularized in /environment) ---
  function drawTutorialArrow(camX) {
    platformRenderer.renderTutorialArrow(ctx, canvas, camX, {
      isPhase3,
      phase3Platforms,
      baby,
      tick
    });
  }

  // --- GAME UPDATE LOOP ---
  function update(dt = 1.0) {
    tick++;
    if (!gameStarted) return;
    if (gameWon) return;
    if (isGameOver) return;

    // Platform lighting fade-in transition
    const allPlatforms = isPhase3 ? phase3Platforms : platforms;
    for (let i = 0; i < allPlatforms.length; i++) {
      const p = allPlatforms[i];
      if (p.lightAlpha === undefined) p.lightAlpha = 0;
      const targetA = p.isLanded ? 1.0 : 0.0;
      p.lightAlpha += (targetA - p.lightAlpha) * 0.08;
    }

    // --- STANDBY PREPARATION & RESPAWN (FADINHA INTERATIVA) ---
    if (isStandbyActive) {
      baby.vx = 0;
      baby.vy = 0;
      baby.animTime = 0;
      baby.onGround = true;

      // Fadinha flutua acima dela emitindo pulsação suave
      const hoverX = baby.x + (baby.facing === -1 ? -18 : 18);
      const hoverY = baby.y - 75 + Math.sin(tick * 0.05) * 5;
      fairy.x += (hoverX - fairy.x) * 0.1;
      fairy.y += (hoverY - fairy.y) * 0.1;
      fairy.flutterPhase += 0.3;

      if (tick % 5 === 0) {
        spawnFairyFlightDust(fairy.x, fairy.y, 0, -0.2);
      }

      // Câmera acolhedora nas duas
      targetCameraZoom = 1.25;
      cameraZoom += (targetCameraZoom - cameraZoom) * 0.08;
      const targetCam = baby.x - (canvas.width > 600 ? canvas.width * 0.35 : canvas.width * 0.25);
      cameraX += (targetCam - cameraX) * 0.08;

      updateFairyParticles();
      updateBabyJumpDust();
      return;
    }

    if (isStandbyTransitioning) {
      standbyTransitionTimer += dt;
      standbyTransitionProgress = Math.min(1.0, standbyTransitionTimer / 24);
      standbyStandUpProgress = standbyTransitionProgress;
      standbyDialogueAlpha = Math.max(0, 1.0 - standbyTransitionProgress * 1.5);

      // Pirueta e faíscas da fadinha
      fairy.spinAnim = Math.max(0, fairy.spinAnim - 0.08);
      fairy.flutterPhase += 0.55;
      fairy.y += Math.sin(standbyTransitionProgress * Math.PI) * -0.4;

      if (tick % 3 === 0 && standbyTransitionProgress < 0.8) {
        spawnFairySparkles(fairy.x, fairy.y, 2);
      }

      // Câmera retorna ao zoom normal
      targetCameraZoom = 1.0;
      cameraZoom += (targetCameraZoom - cameraZoom) * 0.08;
      const targetCam = baby.x - (canvas.width > 600 ? 190 : 130);
      cameraX += (targetCam - cameraX) * 0.08;

      if (standbyTransitionProgress >= 1.0) {
        isStandbyTransitioning = false;
        baby.isCrouching = false;
        baby.controlsLocked = false;
        baby.onGround = true;
        baby.respawnLandingPending = false;

        if (isPhase3) {
          const stats = getPhase3Stats(0);
          baby.vx = stats.runVx;
        } else if (isEscapeMode) {
          const stats = getEscapeStats(escapeLevel);
          baby.vx = stats.runVx || 2.4;
        } else {
          baby.vx = baby.baseVx;
        }
        lastTime = performance.now();
      }

      updateFairyParticles();
      updateBabyJumpDust();
      return;
    }

    // --- PLOT TWIST CUTSCENE SEQUENCER ---
    if (plotTwistActive) {
      if (plotTwistStep === 1) {
        // Step 1: Porta falsa escorrega e descola; menina cai desequilibrada
        fakeDoorSlideY += 6.5;
        fakeDoorRotation += 0.024;
        baby.isShocked = true;
        baby.isLyingDown = false;
        baby.onGround = false;
        baby.vx = 0;
        baby.vy += 0.55;
        baby.y += baby.vy;
        baby.animTime += 0.22;
        targetCameraZoom = 1.35;
        cameraZoom += (targetCameraZoom - cameraZoom) * 0.09;
        const camTarget = baby.x - (canvas.width > 600 ? 220 : 130);
        cameraX += (camTarget - cameraX) * 0.09;

        // Fadinha acompanha em susto no alto
        fairy.x += (baby.x - 25 - fairy.x) * 0.08;
        fairy.y += (baby.y - 45 - fairy.y) * 0.08;
        fairy.flutterPhase += 0.45;

        // A queda deve finalizar por completo no chão antes de qualquer fala ou diálogo
        if (baby.y + baby.h >= FLOOR_Y) {
          baby.y = FLOOR_Y - baby.h;
          baby.vy = 0;
          baby.onGround = true;
          baby.isLyingDown = true; // Visivelmente estirada e esparramada no chão!
          spawnBabyLandingPuff(baby.x + baby.w / 2, baby.y + baby.h);
          audio.playBabyThudSound();
          plotTwistStep = 2; // Passa para a checagem da fadinha no chão
          plotTwistTimer = 0;
        }
      } else if (plotTwistStep === 2) {
        // Step 2: Menina estirada no chão. A fadinha desce ao chão perto dela para checar o que aconteceu.
        plotTwistTimer++;
        baby.isShocked = true;
        baby.isLyingDown = true;
        baby.onGround = true;
        baby.vx = 0;
        baby.vy = 0;

        targetCameraZoom = 1.55;
        cameraZoom += (targetCameraZoom - cameraZoom) * 0.07;
        const targetCam = baby.x - (canvas.width > 600 ? 190 : 130);
        cameraX += (targetCam - cameraX) * 0.08;

        // Fadinha desce até a altura do chão ao lado da menina
        const targetFairyX = baby.x + 35;
        const targetFairyY = FLOOR_Y - 22;
        fairy.x += (targetFairyX - fairy.x) * 0.09;
        fairy.y += (targetFairyY - fairy.y) * 0.09;
        fairy.flutterPhase += 0.35;

        if (tick % 3 === 0) {
          spawnFairyFlightDust(fairy.x, fairy.y, 0, -0.4);
        }

        // Após checar a menina no chão (~1.3s), a fadinha voa para cima
        if (plotTwistTimer > 80) {
          plotTwistStep = 3;
          plotTwistTimer = 0;
        }
      } else if (plotTwistStep === 3) {
        // Step 3: A fadinha voa para cima, posicionando-se acima da altura da cabeça da menina.
        plotTwistTimer++;
        baby.isShocked = true;
        baby.isLyingDown = true;
        baby.onGround = true;
        baby.vx = 0;
        baby.vy = 0;

        targetCameraZoom = 1.35;
        cameraZoom += (targetCameraZoom - cameraZoom) * 0.07;
        const targetCam = baby.x - (canvas.width > 600 ? 190 : 130);
        cameraX += (targetCam - cameraX) * 0.08;

        // A fadinha sobe alto acima da cabeça da menina
        const targetFairyX = baby.x + 10;
        const targetFairyY = baby.y - 105;
        fairy.x += (targetFairyX - fairy.x) * 0.08;
        fairy.y += (targetFairyY - fairy.y) * 0.08;
        fairy.flutterPhase += 0.45;

        if (tick % 2 === 0) {
          spawnFairyFlightDust(fairy.x, fairy.y, 0, -0.5);
        }

        // Quando a fadinha atinge a altura acima da cabeça, inicia o diálogo da menina
        if (plotTwistTimer > 70) {
          plotTwistStep = 4;
          plotTwistTimer = 0;
          audio.playBabyShockVoice();
          uiFeedback.innerText = 'Mas ali não era a porta...? A criança pergunta estirada no chão!';
          uiFeedback.style.color = '#fef08a';
        }
      } else if (plotTwistStep === 4) {
        // Step 4: Menina estirada no chão e fada no alto: diálogo da menina
        plotTwistTimer++;
        baby.isShocked = true;
        baby.isLyingDown = true;
        baby.onGround = true;

        targetCameraZoom = 1.35;
        cameraZoom += (targetCameraZoom - cameraZoom) * 0.07;
        const targetCam = baby.x - (canvas.width > 600 ? 190 : 130);
        cameraX += (targetCam - cameraX) * 0.08;

        // Fadinha flutua suavemente no alto, desobstruída acima da UI
        fairy.x += (baby.x + 10 - fairy.x) * 0.07;
        fairy.y += (baby.y - 105 - fairy.y) * 0.07;
        fairy.flutterPhase += 0.35;

        if (plotTwistTimer > 320) {
          advancePlotTwist();
        }
      } else if (plotTwistStep === 5) {
        // Step 5: Fadinha expressa frustração ("Droga! Como se virar em toda essa bagunça?...") e voa de um lado para o outro no ar
        plotTwistTimer++;
        baby.isShocked = true;
        baby.isLyingDown = true;
        baby.onGround = true;

        targetCameraZoom = 1.35;
        cameraZoom += (targetCameraZoom - cameraZoom) * 0.07;
        const targetCam = baby.x - (canvas.width > 600 ? 190 : 130);
        cameraX += (targetCam - cameraX) * 0.08;

        fairy.pacingPhase = (fairy.pacingPhase || 0) + 0.065;
        const pacingDist = Math.sin(fairy.pacingPhase) * 65;
        const targetFairyX = baby.x + pacingDist;
        const targetFairyY = baby.y - 105 + Math.abs(Math.sin(fairy.pacingPhase * 2)) * 6;
        fairy.vx += (targetFairyX - fairy.x) * 0.12;
        fairy.vy += (targetFairyY - fairy.y) * 0.12;
        fairy.vx *= 0.85;
        fairy.vy *= 0.85;
        fairy.x += fairy.vx;
        fairy.y += fairy.vy;
        fairy.flutterPhase += 0.55;

        if (tick % 2 === 0) {
          spawnFairyFlightDust(fairy.x, fairy.y, Math.cos(fairy.pacingPhase) * 1.5, 0);
        }

        if (plotTwistTimer > 380) {
          finishPlotTwistAndStartTutorial();
        }
      }

      updateFairyParticles();
      updateBabyJumpDust();
      return;
    }

    // --- FASE 3 TUTORIAL DEMONSTRATION (FADINHA SIMULA TRAJETÓRIA DO PRIMEIRO SALTO) ---
    if (phase3TutorialActive) {
      phase3TutorialProgress += 0.010; // ~2.5s de demonstração suave e clara
      const p0 = phase3Platforms[0];
      const startX = baby.x - 20;
      const startY = baby.y - 20;
      const endX = p0.x + p0.w / 2;
      const endY = p0.y - 30;

      // Trajetória em arco parabólico suave da fada voando até a primeira plataforma
      const t = Math.min(1.0, phase3TutorialProgress);
      const arcHeight = 110;
      fairy.x = startX + (endX - startX) * t;
      fairy.y = startY + (endY - startY) * t - Math.sin(t * Math.PI) * arcHeight;
      fairy.flutterPhase += 0.45;

      if (tick % 2 === 0) {
        spawnFairyFlightDust(fairy.x, fairy.y, -1.6, -0.3);
      }
      if (tick % 4 === 0) {
        spawnFairySparkles(fairy.x, fairy.y, 2);
      }

      // Câmera enquadra a demonstração com suavidade
      const tutorialCam = (baby.x * (1 - t * 0.7) + fairy.x * (t * 0.7)) - (canvas.width > 600 ? canvas.width * 0.45 : canvas.width * 0.4);
      cameraX += (tutorialCam - cameraX) * 0.08;

      updateFairyParticles();
      updateBabyJumpDust();

      if (phase3TutorialProgress >= 1.0) {
        // Demonstração finalizada: libera controles e inicia a corrida no chão livre
        phase3TutorialActive = false;
        baby.controlsLocked = false;
        const stats = getPhase3Stats(0);
        baby.vx = stats.runVx;
        uiFeedback.innerText = '⚡ Corra para a esquerda e salte na primeira plataforma!';
        uiFeedback.style.color = '#fde047';
        audio.playLevelUpChime(0);
      }
      return;
    }

    // --- CUTSCENE SEQUENCER ---
    if (cutsceneActive) {
      cutsceneTimer++;
      targetCameraZoom = 1.45;
      cameraZoom += (targetCameraZoom - cameraZoom) * 0.08;

      // Focus camera between fairy and baby
      const cutsceneCamTarget = (baby.x + fairy.x) / 2 - 200;
      cameraX += (cutsceneCamTarget - cameraX) * 0.08;

      if (cutsceneStep === 1) {
        // Fairy flies above the child's head, looking around investigatively
        fairy.investigateAngle = (fairy.investigateAngle || 0) + 0.038;
        const targetHoverX = baby.x + Math.sin(fairy.investigateAngle * 1.5) * 55;
        const targetHoverY = baby.y - 44 + Math.cos(fairy.investigateAngle * 3.0) * 14;

        fairy.vx += (targetHoverX - fairy.x) * 0.08;
        fairy.vy += (targetHoverY - fairy.y) * 0.08;
        fairy.vx *= 0.85;
        fairy.vy *= 0.85;
        fairy.x += fairy.vx;
        fairy.y += fairy.vy;
        fairy.flutterPhase += 0.35;

        if (tick % 2 === 0) {
          spawnFairyFlightDust(fairy.x, fairy.y, fairy.vx, fairy.vy);
        }
        if (cutsceneTimer > 450) {
          advanceCutscene();
        }
      } else if (cutsceneStep === 2) {
        // Fairy hovers to the right of baby pointing wand to the right
        fairy.flutterPhase += 0.45;
        const targetHoverX = baby.x + 65;
        const targetHoverY = baby.y - 42;

        fairy.vx += (targetHoverX - fairy.x) * 0.08;
        fairy.vy += (targetHoverY - fairy.y) * 0.08;
        fairy.vx *= 0.85;
        fairy.vy *= 0.85;
        fairy.x += fairy.vx;
        fairy.y += fairy.vy;

        if (tick % 2 === 0) {
          spawnFairyFlightDust(fairy.x, fairy.y, fairy.vx, fairy.vy);
        }
        if (cutsceneTimer > 420) {
          finishCutscene();
        }
      }

      // Update particles during cutscene
      updateFairyParticles();
      updateBabyJumpDust();

      return;
    }

    // --- TRUE PORTAL TOY ROOM TRANSITION SEQUENCER ---
    if (truePortalTransitionActive) {
      truePortalTransitionTimer += dt;

      // Rigid lock on baby side-scroller jump input and physics
      baby.controlsLocked = true;
      baby.vy = 0;
      baby.onGround = true;
      baby.facing = -1;

      // Baby walks steadily toward the portal doorway
      const targetBabyX = trueExitDoor.x + 24;
      if (baby.x > targetBabyX) {
        baby.x -= 1.4 * dt;
        baby.walkCycle = (baby.walkCycle || 0) + 0.2 * dt;
      } else {
        baby.walkCycle = 0;
      }

      // Smooth camera pan centering on the grand portal opening
      const targetCamX = trueExitDoor.x - canvas.width * 0.36;
      cameraX += (targetCamX - cameraX) * 0.08 * dt;

      // Open the ornate portal doors
      if (trueDoorOpenAngle < 1.0) {
        trueDoorOpenAngle = Math.min(1.0, trueDoorOpenAngle + 0.018 * dt);
      }

      // Fairy flutters in front of the door, then flies inside happily
      if (truePortalTransitionTimer < 65) {
        const fairyTargetX = trueExitDoor.x + 46;
        const fairyTargetY = trueExitDoor.y + 40;
        fairy.x += (fairyTargetX - fairy.x) * 0.1 * dt;
        fairy.y += (fairyTargetY - fairy.y) * 0.1 * dt;
        uiFeedback.innerText = '✨ O Verdadeiro Portal dos Sonhos se abriu!';
        uiFeedback.style.color = '#fde047';
      } else {
        const fairyTargetX = trueExitDoor.x - 35;
        const fairyTargetY = trueExitDoor.y + 25;
        fairy.x += (fairyTargetX - fairy.x) * 0.1 * dt;
        fairy.y += (fairyTargetY - fairy.y) * 0.1 * dt;
        uiFeedback.innerText = '✨ Entrando na Sala de Brinquedos...';
        uiFeedback.style.color = '#a7f3d0';
      }
      fairy.flutterPhase += 0.5 * dt;

      if (tick % 2 === 0) {
        spawnFairySparkles(fairy.x, fairy.y, 2);
        spawnFairyFlightDust(fairy.x, fairy.y, -1.2, 0);
      }

      // Golden light iris wipe expands across screen
      if (truePortalTransitionTimer > 60) {
        transitionWipeAlpha = Math.min(1.0, transitionWipeAlpha + 0.02 * dt);
      }

      // Transition complete: launch the Toy Room top-down phase
      if (truePortalTransitionTimer >= 125) {
        truePortalTransitionActive = false;
        startToyRoomPhase();
        return;
      }

      updateFairyParticles();
      updateBabyJumpDust();
      return;
    }

    // Ease camera zoom back to normal after cutscene
    targetCameraZoom = 1.0;
    cameraZoom += (targetCameraZoom - cameraZoom) * 0.08;

    // Baby physics
    baby.x += baby.vx * dt;
    baby.animTime += 0.15 * dt;
    baby.vy += baby.gravity * dt;
    baby.y += baby.vy * dt;

    // Subtle magic dust trail behind the little girl during jumps
    if (!baby.onGround) {
      if (tick % 2 === 0) {
        spawnBabyJumpDust(baby.x, baby.y, baby.w, baby.h, baby.vx, baby.vy);
      }
    }

    // Spawn speed ribbons scaling with escape level or Phase 3 level
    if (isPhase3 && !baby.onGround) {
      particles.spawnPhase3Ribbons(baby, phase3Level, getPhase3Stats(phase3Level), tick);
    } else if (isEscapeMode && !baby.onGround) {
      particles.spawnEscapeRibbons(baby, escapeLevel, getEscapeStats(escapeLevel), tick);
    }

    // --- ORGANIC FAIRY BEHAVIOR & GUIDING SYSTEM ---
    fairy.floatAngle += 0.05;
    fairy.flutterPhase += 0.35;

    // Target scouting calculation
    let targetX, targetY;

    if (isPhase3) {
      const nextIndex = baby.currentPlatformIndex + 1;
      if (nextIndex < phase3Platforms.length) {
        const nextPlat = phase3Platforms[nextIndex];
        const isCloseToNext = (baby.x < nextPlat.x + nextPlat.w + 120);
        if (isCloseToNext) {
          targetX = nextPlat.x + nextPlat.w / 2;
          targetY = nextPlat.y - 45;
        } else {
          targetX = baby.x - 75;
          targetY = baby.y - 50;
        }
      } else {
        targetX = trueExitDoor.x + 40;
        targetY = trueExitDoor.y + 45;
      }
    } else {
      const nextIndex = baby.currentPlatformIndex + 1;
      if (nextIndex < platforms.length) {
        const nextPlat = platforms[nextIndex];
        const isCloseToNext = (baby.x > nextPlat.x - 120);
        if (isCloseToNext) {
          targetX = nextPlat.x + 35;
          targetY = nextPlat.y - 45;
        } else {
          targetX = baby.x + (isEscapeMode ? 80 : 65);
          targetY = baby.y - 50;
        }
      } else {
        targetX = exitDoor.x + 30;
        targetY = exitDoor.y + 40;
      }
    }

    // Erratic micro-darts simulating insect / sprite curiosity
    fairy.dartTimer--;
    if (fairy.dartTimer <= 0) {
      fairy.dartTimer = 60 + Math.floor(Math.random() * 80);
      fairy.dartOffsetX = (Math.random() - 0.5) * 26;
      fairy.dartOffsetY = (Math.random() - 0.5) * 18;
    }

    // Multi-harmonic organic floating oscillations
    const organicOscY =
      Math.sin(fairy.floatAngle * 2.8) * 8 +
      Math.cos(fairy.floatAngle * 4.9) * 4 +
      Math.sin(fairy.floatAngle * 1.2) * 6;

    const organicOscX =
      Math.cos(fairy.floatAngle * 2.1) * 7 +
      Math.sin(fairy.floatAngle * 3.6) * 3;

    const finalTargetX = targetX + organicOscX + fairy.dartOffsetX;
    const finalTargetY = targetY + organicOscY + fairy.dartOffsetY;

    fairy.vx += (finalTargetX - fairy.x) * 0.045;
    fairy.vy += (finalTargetY - fairy.y) * 0.045;
    fairy.vx *= 0.86;
    fairy.vy *= 0.86;

    fairy.x += fairy.vx;
    fairy.y += fairy.vy;

    // Fairy flight dust trail that floats and swirls behind her
    if (tick % 2 === 0) {
      spawnFairyFlightDust(fairy.x, fairy.y, fairy.vx, fairy.vy);
    }
    if (Math.hypot(fairy.vx, fairy.vy) > 2.2 && tick % 2 === 1) {
      spawnFairyFlightDust(fairy.x, fairy.y, fairy.vx, fairy.vy);
    }

    updateFairyParticles();
    updateBabyJumpDust();

    // --- PLATFORM COLLISION & LANDING ---
    const activePlatforms = isPhase3 ? phase3Platforms : platforms;
    const wasInAir = !baby.onGround;
    let landedIdx = -1;
    for (let i = 0; i < activePlatforms.length; i++) {
      const p = activePlatforms[i];
      if (
        baby.x + baby.w > p.x &&
        baby.x < p.x + p.w &&
        baby.y + baby.h >= p.y &&
        baby.y + baby.h <= p.y + 16 &&
        baby.vy >= 0
      ) {
        landedIdx = i;
        break;
      }
    }

    if (landedIdx !== -1) {
      const landedPlat = activePlatforms[landedIdx];
      landedPlat.isLanded = true;
      baby.y = activePlatforms[landedIdx].y - baby.h;
      baby.vy = 0;
      baby.onGround = true;
      baby.respawnLandingPending = false;
      baby.currentPlatformIndex = landedIdx;

      if (wasInAir) {
        spawnBabyLandingPuff(baby.x + baby.w / 2, baby.y + baby.h);
      }

      if (isPhase3) {
        // Phase 3 progressive difficulty evolution across 15 platforms
        const newLevel = Math.min(14, Math.max(0, landedIdx));
        if (newLevel > phase3Level) {
          phase3Level = newLevel;
          const stats = getPhase3Stats(phase3Level);
          targetScrollSpeed = stats.scrollSpeed;
          baby.vx = stats.runVx;
          audio.playLevelUpChime(phase3Level);
          spawnFairySparkles(baby.x + baby.w / 2, baby.y + baby.h / 2, 14 + phase3Level * 2);

          if (phase3Level === 14) {
            uiFeedback.innerText = '⭐ TERRAÇO DO CASTELO ALCANÇADO! O Verdadeiro Portal está à vista!';
            uiFeedback.style.color = '#fde047';
            escapeBannerTimer = 180;
            escapeBannerText = '⭐ SUBIDA FINAL (NÍVEL 15/15): O VERDADEIRO PORTAL!';
          } else if (phase3Level >= 10) {
            uiFeedback.innerText = `🌪️ Plataformas Instáveis (Nível ${phase3Level + 1}/15): Alta precisão necessária!`;
            uiFeedback.style.color = '#f472b6';
          } else if (phase3Level >= 5) {
            uiFeedback.innerText = `⚡ Escalada Acelerando (Nível ${phase3Level + 1}/15): Ritmo e saltos aumentando!`;
            uiFeedback.style.color = '#c084fc';
          } else {
            uiFeedback.innerText = `Subida Caótica (Nível ${phase3Level + 1}/15): Saltando pelos brinquedos!`;
            uiFeedback.style.color = '#fef08a';
          }
        } else {
          const stats = getPhase3Stats(phase3Level);
          baby.vx = stats.runVx;
          targetScrollSpeed = stats.scrollSpeed;
        }

        if (landedIdx === 15) {
          spawnFairySparkles(baby.x + baby.w / 2, baby.y + baby.h / 2, 28);
        }
      } else if (baby.isEscaping) {
        // Re-establish horizontal speed upon landing and update progressive stats
        if (landedIdx >= 9) {
          const newLevel = Math.min(11, Math.max(0, landedIdx - 9));
          if (newLevel > escapeLevel) {
            escapeLevel = newLevel;
            const stats = getEscapeStats(escapeLevel);
            targetScrollSpeed = stats.scrollSpeed;
            baby.vx = stats.runVx;
            audio.playLevelUpChime(escapeLevel);
            spawnFairySparkles(baby.x + baby.w / 2, baby.y + baby.h / 2, 14 + escapeLevel * 2);

            if (escapeLevel === 11) {
              uiFeedback.innerText = '⚡ PULO MÁXIMO ATINGIDO! Salte no limite para alcançar o Portal!';
              uiFeedback.style.color = '#fde047';
              escapeBannerTimer = 160;
              escapeBannerText = '⚡ PULO MÁXIMO (NÍVEL 12/12): O GRANDE SALTO!';
            } else {
              uiFeedback.innerText = `⚡ Pulo Evoluído (Nível ${escapeLevel + 1}/12): Pulo mais alto e veloz!`;
              uiFeedback.style.color = '#fef08a';
            }
          } else {
            const stats = getEscapeStats(escapeLevel);
            baby.vx = stats.runVx;
            targetScrollSpeed = stats.scrollSpeed;
          }
        }
      }

      if (!isPhase3 && landedIdx === 0) {
        firstPlatformCleared = true;
      }

      // Cutscene Trigger: Topo do Castelo de Blocos (Plataforma 9)
      if (!isPhase3 && landedIdx === 9 && !cutsceneTriggered) {
        startCastleCutscene();
        return;
      }

      // Climax celebration when landing on the 12th escape platform (grand portal pedestal)
      if (!isPhase3 && landedIdx === 21) {
        spawnFairySparkles(baby.x + baby.w / 2, baby.y + baby.h / 2, 24);
      }
    } else if (baby.y + baby.h >= FLOOR_Y) {
      if (baby.currentPlatformIndex >= 0) {
        triggerGameOver();
        return;
      }

      baby.y = FLOOR_Y - baby.h;
      baby.vy = 0;
      baby.onGround = true;
      baby.respawnLandingPending = false;
      baby.currentPlatformIndex = -1;

      // Ground running speed in Phase 3
      if (isPhase3 && !baby.controlsLocked) {
        const stats = getPhase3Stats(phase3Level);
        baby.vx = stats.runVx;
      }

      if (wasInAir) {
        spawnBabyLandingPuff(baby.x + baby.w / 2, baby.y + baby.h);
      }
    } else {
      baby.onGround = false;
    }

    // Check if walked past first platform without jumping
    if (!isPhase3) {
      const firstPlatform = platforms[0];
      if (!firstPlatformCleared && baby.x > firstPlatform.x + firstPlatform.w) {
        triggerGameOver();
        return;
      }
    } else {
      // In Phase 3: Menina se deslocando para a esquerda no chão.
      // A regra de falha/reset só é acionada caso o jogador ultrapasse a primeira plataforma depois que ela for devidamente alcançada sem subir nela.
      const p0 = phase3Platforms[0];
      if (baby.currentPlatformIndex < 0 && baby.onGround && baby.x + baby.w < p0.x - 20) {
        triggerGameOver();
        return;
      }
    }

    if (baby.y > FLOOR_Y + 90) {
      triggerGameOver();
      return;
    }

    // Check victory condition or Plot Twist trigger
    if (isPhase3) {
      if (baby.x <= trueExitDoor.x + 55 && !truePortalTransitionActive) {
        startTruePortalTransition();
        return;
      }
    } else {
      // Reaching the exit door in Phase 1 / Phase 2: triggers Plot Twist!
      if (baby.x >= exitDoor.x - 10 && !plotTwistTriggered) {
        startPlotTwistCutscene();
        return;
      }
    }

    // Screen movement & Camera tracking via CameraController
    syncLocalsToState();
    camera.syncFromState(state);
    camera.update(dt, state, canvas, {
      onLagBehind: () => triggerGameOver(),
      exitDoorX: trueExitDoor.x,
      exitDoorW: trueExitDoor.w
    });
    syncStateToLocals();
  }

  // --- RENDER ---
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    camera.applyTransform(ctx, canvas, baby, fairy);

    drawBackgroundWall(cameraX);
    drawSceneryItems(cameraX);
    drawPlatforms(cameraX);
    drawExitDoor(cameraX);
    if (isPhase3) {
      drawTrueExitDoor(cameraX);
      drawTutorialArrow(cameraX);
    }
    drawSpeedRibbons(cameraX);
    drawBabyJumpDust(cameraX);
    drawFairy(cameraX);
    drawBabyManaStyle(cameraX);
    applyDarkAtmosphereWithLights(cameraX, cameraY);

    ctx.restore();

    // UI overlays rendered in crisp screen coordinates
    drawEscapeBanner();
    drawCutsceneDialogue();

    // True portal transition iris wipe (golden light envelope into Toy Room)
    transitionEffects.renderPortalWipe(ctx, canvas, cameraX, cameraY, trueExitDoor, transitionWipeAlpha, tick);

    if (gameWon) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 250, 240, 0.92)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#db2777';
      ctx.font = 'bold 30px Palatino, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('O VERDADEIRO PORTAL DOS SONHOS FOI ALCANÇADO!', canvas.width / 2, canvas.height / 2 - 25);

      ctx.fillStyle = '#26242c';
      ctx.font = '17px Palatino, Georgia, serif';
      ctx.fillText('A menininha e a fada venceram a grande bagunça e atravessaram para o mundo dos sonhos!', canvas.width / 2, canvas.height / 2 + 18);
      ctx.fillText('Toque na tela para brincar novamente desde o começo.', canvas.width / 2, canvas.height / 2 + 56);
      ctx.restore();
    }
  }

  function loop(currentTime = performance.now()) {
    const elapsed = currentTime - lastTime;
    lastTime = currentTime;

    // Strict delta time clamp:
    // Limit delta time ratio between 0.5 and 1.2 to prevent delta time spikes from pause/reload/lag
    const rawDt = elapsed / STEP_MS;
    const dt = Math.max(0.5, Math.min(1.2, isNaN(rawDt) || rawDt <= 0 ? 1.0 : rawDt));

    // Zero-latency gamepad input polling (Xbox Controller Button X) aligned with game loop
    if (inputHandler && typeof inputHandler.pollGamepad === 'function') {
      inputHandler.pollGamepad();
    }

    if (currentPhaseMode === 'toy-room' && toyRoomInstance) {
      toyRoomInstance.update(dt);
      toyRoomInstance.render();
      requestAnimationFrame(loop);
      return;
    }

    update(dt);
    syncLocalsToState();
    render();
    requestAnimationFrame(loop);
  }

  const inputHandler = bindInput({
    doJump,
    isGrounded: () => Boolean(baby && baby.onGround && !baby.controlsLocked && !baby.respawnLandingPending && !baby.isCrouching && !isStandbyActive),
    isCutsceneActive: () => Boolean(cutsceneActive || isStandbyActive || (plotTwistActive && plotTwistStep >= 4)),
    isGameOver: () => isGameOver,
    isToyRoomMode: () => currentPhaseMode === 'toy-room',
    setLastInputDevice,
    toggleMute: () => audio.toggleMute()
  });

  // Initial draw so the canvas renders the scene behind the title screen
  render();

  return {
    state,
    audio,
    camera,
    lighting,
    particles,
    transitions: transitionEffects,
    background: backgroundRenderer,
    platforms: platformRenderer,
    hud: hudRenderer,
    dialogue: dialogueRenderer,
    input: inputHandler,
    setMasterVolume: (v) => audio.setMasterVolume(v),
    getMasterVolume: () => audio.getMasterVolume(),
    setMuted: (m) => audio.setMuted(m),
    isMuted: () => audio.isMuted(),
    toggleMute: () => audio.toggleMute(),
    destroy() {
      if (inputHandler && typeof inputHandler.destroy === 'function') inputHandler.destroy();
      if (audio && typeof audio.destroy === 'function') audio.destroy();
    },
    start() {
      gameStarted = true;
      state.gameStarted = true;
      startStandbyPreparation();
      if (currentPhaseMode === 'toy-room') {
        audio.startToyRoomMusic();
      } else {
        audio.startMusic();
      }
      if (!loopStarted) {
        loopStarted = true;
        state.loopStarted = true;
        requestAnimationFrame(loop);
      }
    },
    doJump,
    isGrounded: () => Boolean(baby && baby.onGround && !baby.controlsLocked && !baby.respawnLandingPending && !baby.isCrouching && !isStandbyActive),
    isCutsceneActive: () => Boolean(cutsceneActive || isStandbyActive || (plotTwistActive && plotTwistStep >= 4)),
    setLastInputDevice,
    resetToStart,
    retry: retryGame,
    restartToTitle,
    isGameOver: () => isGameOver,
    startToyRoomPhase,
    isToyRoomMode: () => currentPhaseMode === 'toy-room'
  };
}
