import { getEscapeGuideTarget, updateEscapeFairyGuide } from './controllers/EscapeFairyGuide.js';
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
import { createAssetManager, darkRoomAtlas } from './assets/index.js';
import { createAtlasDebugger } from './debug/AtlasDebugger.js';

export function createGame(canvas, uiFeedback, callbacks = {}) {
  const ctx = canvas.getContext('2d');
  const assets = createAssetManager();
  const assetsReady = assets.loadManifest().then(() => assets.preload());
  const atlasDebugger = createAtlasDebugger({ assets });
  assetsReady.then(() => {
    atlasDebugger.setAssets(assets);
  });
  if (typeof window !== 'undefined') {
    window.darkRoomAtlas = darkRoomAtlas;
  }
  platformRenderer.setAssets?.(assets);
  backgroundRenderer.setAssets?.(assets);
  babyRenderer.setAssets?.(assets);
  const audio = createAudioController();
  const state = createGameState(canvas, uiFeedback, callbacks);
  const camera = createCameraController({ floorY: FLOOR_Y });
  const lighting = createLightingSystem({ floorY: FLOOR_Y });
  const particles = createParticleSystem({ babyJumpDust: state.babyJumpDust, speedRibbons: state.speedRibbons });
  const baby = state.baby;
  const fairy = state.fairy;

  baby.facing = 1; // 1 = virada para a direita, -1 = virada para a esquerda
  baby.isShocked = false;
  baby.isLyingDown = false;
  baby.isCrouching = true;
  baby.controlsLocked = true;

  let currentPhaseMode = 'bedroom'; // 'bedroom' (quarto) | 'toy-room' (sala de brinquedos)
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

  // --- ESTADO DE PREPARAÇÃO DIALÓGICA E STANDBY ---
  let isStandbyActive = false;
  let isStandbyTransitioning = false;
  let standbyTransitionTimer = 0;
  let standbyTransitionProgress = 0;
  let standbyStandUpProgress = 0;
  let standbyDialogueAlpha = 1.0;
  let standbyActivatedTime = 0;
  let lastUsedInputDevice = 'keyboard'; // 'keyboard' (teclado) | 'gamepad' (controle) | 'touch' (toque)

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

  // Reinicialização rígida dos componentes de física para evitar acúmulo vetorial ou picos de delta
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
    isPaused = false;
    state.isPaused = false;
    syncLocalsToState();
    state.retryGame(audio);
    syncStateToLocals();
  }

  function restartToTitle() {
    isPaused = false;
    state.isPaused = false;
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
    }, { assets });

    audio.startToyRoomMusic();
    if (!loopStarted) {
      loopStarted = true;
      requestAnimationFrame(loop);
    }
  }

  // Canvas persistente fora da tela para iluminação atmosférica escura (evita alocações no garbage collector)
  const darkCanvas = document.createElement('canvas');
  const dctx = darkCanvas.getContext('2d');

  // Adaptação de Resolução e Viewport (Zero distorção em Dispositivos Móveis e Desktop)
  function handleResize() {
    const rect = (canvas && typeof canvas.getBoundingClientRect === 'function') ? canvas.getBoundingClientRect() : null;
    const w = (rect && rect.width > 0) ? rect.width : (window.innerWidth || 960);
    const h = (rect && rect.height > 0) ? rect.height : (window.innerHeight || 540);
    const aspect = (w > 0 && h > 0) ? (w / h) : (16 / 9);
    isPortrait = aspect < 1.15;

    if (isPortrait) {
      // Mobile / Retrato: Mantém FoV amplo (largura 540) e dimensiona a altura ortograficamente
      canvas.width = 540;
      canvas.height = Math.round(540 / aspect) || 960;
    } else {
      // Desktop / Paisagem: Altura base de 540 e dimensiona a largura ortograficamente
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

  // Estado de Cena Cinemática (Fase 1 -> Castelo da Fase 2)
  let cutsceneActive = false;
  let cutsceneTriggered = false;
  let cutsceneCompleted = false;
  let cutsceneStep = 1;
  let cutsceneTimer = 0;

  // Estado do Modo de Fuga (Fase 2 - 12 Plataformas Subindo para a Direita)
  let isEscapeMode = false;
  let escapeLevel = 0; // 0 a 11
  let currentScrollSpeed = 1.5;
  let targetScrollSpeed = 1.5;
  let escapeBannerTimer = 0;
  let escapeBannerText = '';
  const speedRibbons = state.speedRibbons;
  const babyJumpDust = state.babyJumpDust;

  // ESTADO DA FASE 3 E DA REVIRAVOLTA (PLOT TWIST)
  let isPhase3 = false;
  let phase3Level = 0; // 0 a 14 (15 plataformas de brinquedos)
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

    // Confirmação de standby: Espaço, Botão X ou Toque na tela para iniciar a jogabilidade
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

    // Avança cena cinemática com toque na tela respeitando tempo de recarga
    if (cutsceneActive) {
      if (now - lastDialogueAdvanceTime < 320) return;
      lastDialogueAdvanceTime = now;
      advanceCutscene();
      lastJumpTime = now + 240;
      return;
    }

    // Avança cena da reviravolta no toque (apenas durante os diálogos dos passos 4 e 5) com recarga anti-spam
    if (plotTwistActive) {
      if (plotTwistStep >= 4) {
        if (now - lastDialogueAdvanceTime < 320) return;
        lastDialogueAdvanceTime = now;
        advancePlotTwist();
      }
      return;
    }

    // Verifica se os controles estão travados ou se a menina ainda está se levantando/agachada
    if (baby.controlsLocked || baby.respawnLandingPending || baby.isCrouching) {
      return;
    }

    // Verificação de chão: requer estritamente onGround confirmado pelo resolvedor de colisões
    if (!baby.onGround) {
      return;
    }

    // Salto físico com bloqueio de debounce para entrada
    if (now - lastJumpTime < 160) {
      return;
    }
    lastJumpTime = now;

    // Limpa imediatamente onGround para evitar acúmulo de múltiplos saltos em um único frame
    baby.onGround = false;

    if (isPhase3) {
      const currentLvl = Math.max(0, Math.min(14, phase3Level || 0));
      const stats = getPhase3Stats(currentLvl);
      baby.vy = stats.jumpPower;
      baby.vx = stats.airVx; // Impulso horizontal dinâmico em direção à esquerda
      audio.playLongJumpSound(currentLvl / 14);
      fairy.vy -= 2.8;
      fairy.spinAnim = 1.6;

      // Explosão visual de faíscas e poeirinha do pulo
      spawnBabyJumpPuff(baby.x + baby.w / 2, baby.y + baby.h, 6 + currentLvl);
      const burstCount = 6 + currentLvl * 2;
      spawnFairySparkles(baby.x + baby.w / 2, baby.y + baby.h, burstCount);
    } else if (baby.longJumpUnlocked || (typeof isEscapeMode !== 'undefined' && isEscapeMode)) {
      const currentLvl = Math.max(0, Math.min(11, escapeLevel || 0));
      const stats = getEscapeStats(currentLvl);
      baby.vy = stats.jumpPower;
      baby.vx = stats.airVx; // Impulso horizontal dinâmico proporcional ao nível
      // Efeito de gameplay escondido para o início da segunda parte:
      // O apoio estreito do castelo deixa um vão de 196 px até o trem.
      // Primeiro pulo 100% calibrado para pousar com perfeição no centro da pista do trem (plataforma 10)
      if (baby.currentPlatformIndex === 9) {
        const nextP = platforms[10];
        const nextCenterX = nextP.standRegion ? nextP.standRegion.x + nextP.standRegion.w / 2 : nextP.x + nextP.w / 2;
        const targetX = nextCenterX - baby.w / 2;
        const targetY = (nextP.surfaceTopY !== undefined)
          ? nextP.surfaceTopY
          : ((nextP.standRegion && nextP.standRegion.y !== undefined) ? nextP.standRegion.y : nextP.y);
        const deltaY = (targetY - baby.h) - baby.y;
        const grav = baby.gravity || 0.28;
        const disc = Math.max(0, baby.vy * baby.vy + 2 * grav * deltaY);
        const flightTime = (-baby.vy + Math.sqrt(disc)) / grav;
        if (flightTime > 0) {
          baby.vx = (targetX - baby.x) / flightTime;
        } else {
          baby.vx = 5.09;
        }
        if (typeof targetScrollSpeed !== 'undefined') {
          targetScrollSpeed = stats.scrollSpeed;
        }
        if (typeof currentScrollSpeed !== 'undefined') {
          currentScrollSpeed = stats.scrollSpeed;
        }
      }
      audio.playLongJumpSound(currentLvl / 11);
      fairy.vy -= 2.8;
      fairy.spinAnim = 1.6;

      // Explosão visual de faíscas e poeirinha do pulo
      spawnBabyJumpPuff(baby.x + baby.w / 2, baby.y + baby.h, 6 + currentLvl);
      const burstCount = 6 + currentLvl * 2;
      spawnFairySparkles(baby.x + baby.w / 2, baby.y + baby.h, burstCount);
    } else {
      baby.vy = baby.jumpPower;
      // Velocidade fixa por saída: o clique determina o alcance, sem mirar
      // automaticamente o centro do próximo apoio. Só o castelo tem assistência.
      baby.vx = baby.currentPlatformIndex === 4 ? 1.8
        : baby.currentPlatformIndex === 5 ? 1.95
        : baby.baseVx;
      audio.playJumpSound();
      fairy.vy -= 2.2;
      fairy.spinAnim = 1.0;
      spawnBabyJumpPuff(baby.x + baby.w / 2, baby.y + baby.h, 5);
      spawnFairySparkles(fairy.x, fairy.y, 6);
    }
  }

  // --- SISTEMA DE POEIRA MÁGICA DA FADA ---
  function spawnFairyFlightDust(fx, fy, fvx, fvy) {
    state.spawnFairyFlightDust(fx, fy, fvx, fvy);
  }

  function spawnFairySparkles(x, y, count = 2) {
    state.spawnFairySparkles(x, y, count);
  }

  function updateFairyParticles() {
    state.updateFairyParticles();
  }

  // --- SISTEMA DE RASTRO SUTIL DO SALTO DA MENINA ---
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
    // Age both dust and speed trails, including during cutscenes/tutorials.
    particles.update(dt);
  }

  // --- RENDERIZADORES DE CENÁRIO (Modularizados em /environment) ---
  function drawBackgroundWall(camX) {
    backgroundRenderer.renderWall(ctx, canvas, camX, { tick, assets });
  }

  function drawSceneryItems(camX) {
    backgroundRenderer.renderScenery(ctx, canvas, roomScenery, camX, { assets });
  }

  function drawPlatforms(camX) {
    platformRenderer.renderPlatforms(ctx, canvas, camX, {
      isPhase3,
      platforms: isPhase3 ? phase3Platforms : platforms,
      baby,
      tick,
      assets
    });
  }

  function drawExitDoor(camX) {
    platformRenderer.renderExitDoor(ctx, canvas, camX, {
      exitDoor,
      fakeDoorRevealed,
      fakeDoorSlideY,
      fakeDoorRotation,
      tick,
      assets
    });
  }

  function drawTrueExitDoor(camX) {
    platformRenderer.renderTrueExitDoor(ctx, canvas, camX, {
      trueExitDoor,
      trueDoorOpenAngle,
      tick,
      assets
    });
  }

  // --- RENDERIZADORES DE ENTIDADES E PERSONAGENS (Modularizados em /entities) ---
  function drawBabyManaStyle(camX) {
    syncLocalsToState();
    babyRenderer.render(ctx, baby, state, camX, { assets });
  }

  function drawFairy(camX) {
    syncLocalsToState();
    fairyRenderer.render(ctx, fairy, state, camX, { canvas, baby, platforms });
  }

  // --- ILUMINAÇÃO DINÂMICA ATMOSFÉRICA (Modularizada em /environment) ---
  function applyDarkAtmosphereWithLights(camX, camY = 0) {
    syncLocalsToState();
    lighting.apply(ctx, canvas, state, baby, fairy, camX, camY, {
      platforms,
      phase3Platforms,
      exitDoor,
      trueExitDoor
    });
  }

  // --- RENDERIZAÇÃO DE EFEITOS DE PARTÍCULAS (Modularizada em /effects) ---
  function drawSpeedRibbons(camX) {
    particles.renderSpeedRibbons(ctx, canvas, camX);
  }

  function drawBabyJumpDust(camX) {
    particles.renderBabyJumpDust(ctx, canvas, camX);
  }

  // --- RENDERIZAÇÃO DE INTERFACE E HUD (Modularizada em /ui) ---
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

  // --- GUIA VISUAL DE TUTORIAL (Modularizado em /environment) ---
  function drawTutorialArrow(camX) {
    platformRenderer.renderTutorialArrow(ctx, canvas, camX, {
      isPhase3,
      phase3Platforms,
      baby,
      tick
    });
  }

  // --- LOOP DE ATUALIZAÇÃO DO JOGO ---
  function update(dt = 1.0) {
    tick++;
    if (!gameStarted) return;
    if (gameWon) return;
    if (isGameOver) return;

    // Transição gradual de iluminação das plataformas
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
          if (baby.currentPlatformIndex === 9) {
            // Efeito escondido: no castelo, aguarda o jogador apertar para dar o pulo
            baby.vx = 0;
            currentScrollSpeed = 0;
            targetScrollSpeed = 0;
          } else {
            const stats = getEscapeStats(escapeLevel);
            baby.vx = stats.runVx || 2.4;
          }
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

    // --- SEQUENCIADOR DA CENA CINEMÁTICA ---
    if (cutsceneActive) {
      cutsceneTimer++;
      targetCameraZoom = 1.45;
      cameraZoom += (targetCameraZoom - cameraZoom) * 0.08;

      // Foca a câmera suavemente entre a fada e a menina
      const cutsceneCamTarget = (baby.x + fairy.x) / 2 - 200;
      cameraX += (cutsceneCamTarget - cameraX) * 0.08;

      if (cutsceneStep === 1) {
        // Fada voa acima da cabeça da criança, olhando ao redor com curiosidade
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
        // Fada paira à direita da menina apontando a varinha para a direita
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

      // Atualiza partículas durante a cena cinemática
      updateFairyParticles();
      updateBabyJumpDust();

      return;
    }

    // --- SEQUENCIADOR DE TRANSIÇÃO DO VERDADEIRO PORTAL PARA A SALA DE BRINQUEDOS ---
    if (truePortalTransitionActive) {
      truePortalTransitionTimer += dt;

      // Bloqueio rígido de comandos e física de pulo lateral da menina
      baby.controlsLocked = true;
      baby.vy = 0;
      baby.onGround = true;
      baby.facing = -1;

      // Menina caminha com firmeza em direção ao portal
      const targetBabyX = trueExitDoor.x + 24;
      if (baby.x > targetBabyX) {
        baby.x -= 1.4 * dt;
        baby.walkCycle = (baby.walkCycle || 0) + 0.2 * dt;
      } else {
        baby.walkCycle = 0;
      }

      // Movimento suave de câmera centralizando na abertura do grande portal
      const targetCamX = trueExitDoor.x - canvas.width * 0.36;
      cameraX += (targetCamX - cameraX) * 0.08 * dt;

      // Abre as portas ornamentadas do portal
      if (trueDoorOpenAngle < 1.0) {
        trueDoorOpenAngle = Math.min(1.0, trueDoorOpenAngle + 0.018 * dt);
      }

      // Fada adeja em frente à porta e voa alegremente para dentro
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

      // Efeito de íris de luz dourada se expande pela tela
      if (truePortalTransitionTimer > 60) {
        transitionWipeAlpha = Math.min(1.0, transitionWipeAlpha + 0.02 * dt);
      }

      // Transição concluída: inicia a fase de visão superior da Sala de Brinquedos
      if (truePortalTransitionTimer >= 125) {
        truePortalTransitionActive = false;
        startToyRoomPhase();
        return;
      }

      updateFairyParticles();
      updateBabyJumpDust();
      return;
    }

    // Suaviza o zoom da câmera de volta ao normal após a cena
    targetCameraZoom = 1.0;
    cameraZoom += (targetCameraZoom - cameraZoom) * 0.08;

    // Física da menina: na plataforma 9 (castelinho pequeno), aguarda pausada a interação do jogador sem andar sozinha
    if (isEscapeMode && baby.currentPlatformIndex === 9 && baby.onGround) {
      const castle = platforms[9];
      const castleCenterX = castle.standRegion ? castle.standRegion.x + castle.standRegion.w / 2 : castle.x + castle.w / 2;
      const castleTopY = (castle.surfaceTopY !== undefined ? castle.surfaceTopY : castle.y);
      baby.x = castleCenterX - baby.w / 2;
      baby.y = castleTopY - baby.h;
      baby.vx = 0;
      // Cancela exatamente a gravidade deste frame, inclusive com dt variável.
      baby.vy = -baby.gravity * dt;
      baby.animTime = 0;
      currentScrollSpeed = 0;
      targetScrollSpeed = 0;
    }
    baby.x += baby.vx * dt;
    baby.animTime += (baby.vx !== 0 ? 0.15 : 0) * dt;
    baby.vy += baby.gravity * dt;
    baby.y += baby.vy * dt;

    // Rastro de poeira mágica sutil atrás da garotinha durante os saltos
    if (!baby.onGround) {
      if (tick % 2 === 0) {
        spawnBabyJumpDust(baby.x, baby.y, baby.w, baby.h, baby.vx, baby.vy);
      }
    }

    // Emite faixas de velocidade proporcionais ao nível de fuga ou da Fase 3
    if (isPhase3 && !baby.onGround) {
      particles.spawnPhase3Ribbons(baby, phase3Level, getPhase3Stats(phase3Level), tick);
    } else if (isEscapeMode && !baby.onGround) {
      particles.spawnEscapeRibbons(baby, escapeLevel, getEscapeStats(escapeLevel), tick);
    }

    // --- COMPORTAMENTO ORGÂNICO E SISTEMA GUIA DA FADA ---
    fairy.floatAngle += 0.05;
    fairy.flutterPhase += 0.35;

    if (isEscapeMode && !isPhase3) {
      updateEscapeFairyGuide(fairy, getEscapeGuideTarget(baby, platforms, exitDoor), dt);
    } else {
      // Cálculo da posição de exploração do alvo
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

      // Micro-movimentos rápidos simulando a curiosidade natural de uma fada
      fairy.dartTimer--;
      if (fairy.dartTimer <= 0) {
        fairy.dartTimer = 60 + Math.floor(Math.random() * 80);
        fairy.dartOffsetX = (Math.random() - 0.5) * 26;
        fairy.dartOffsetY = (Math.random() - 0.5) * 18;
      }

      // Oscilações orgânicas multifrequenciais de flutuação
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

    }

    // Rastro de poeira luminosa que paira e rodopia atrás da fada
    if (tick % 2 === 0) {
      spawnFairyFlightDust(fairy.x, fairy.y, fairy.vx, fairy.vy);
    }
    if (Math.hypot(fairy.vx, fairy.vy) > 2.2 && tick % 2 === 1) {
      spawnFairyFlightDust(fairy.x, fairy.y, fairy.vx, fairy.vy);
    }

    updateFairyParticles();
    updateBabyJumpDust();

    // --- COLISÃO COM PLATAFORMAS E ATERRISSAGEM ---
    const activePlatforms = isPhase3 ? phase3Platforms : platforms;
    const wasInAir = !baby.onGround;
    let landedIdx = -1;
    for (let i = 0; i < activePlatforms.length; i++) {
      const p = activePlatforms[i];
      const platX = p.standRegion ? p.standRegion.x : p.x;
      const platW = p.standRegion ? p.standRegion.w : p.w;
      const platY = (p.surfaceTopY !== undefined)
        ? p.surfaceTopY
        : ((p.standRegion && p.standRegion.y !== undefined) ? p.standRegion.y : p.y);
      if (
        baby.x + baby.w > platX &&
        baby.x < platX + platW &&
        baby.y + baby.h >= platY &&
        baby.y + baby.h <= platY + 16 &&
        baby.vy >= 0
      ) {
        landedIdx = i;
        break;
      }
    }
    // Garantia de 100% de acerto no primeiro salto do castelo para a pista do trem (plataforma 10)
    const isEscapingState = (typeof isEscapeMode !== 'undefined' ? isEscapeMode : Boolean(baby.isEscaping || baby.longJumpUnlocked));
    if (!isPhase3 && isEscapingState && baby.currentPlatformIndex === 9 && wasInAir && baby.vy >= 0) {
      const p10 = platforms[10];
      const support = p10.standRegion || p10;
      const p10Y = p10.surfaceTopY ?? support.y ?? p10.y;
      if (baby.y + baby.h >= p10Y) {
        // Somente a saída do castelo tem pouso assistido. Mantém a hitbox real
        // do trem e finaliza o arco no centro, mesmo com variação de frames.
        baby.x = support.x + (support.w - baby.w) / 2;
        landedIdx = 10;
      }
    }

    if (landedIdx !== -1) {
      const landedPlat = activePlatforms[landedIdx];
      landedPlat.isLanded = true;
      const landingY = (landedPlat.surfaceTopY !== undefined)
        ? landedPlat.surfaceTopY
        : ((landedPlat.standRegion && landedPlat.standRegion.y !== undefined)
          ? landedPlat.standRegion.y
          : landedPlat.y);
      baby.y = landingY - baby.h;
      baby.vy = 0;
      if (!isEscapeMode && !isPhase3) {
        baby.vx = baby.baseVx;
      }
      baby.onGround = true;
      baby.respawnLandingPending = false;
      baby.currentPlatformIndex = landedIdx;

      if (wasInAir) {
        spawnBabyLandingPuff(baby.x + baby.w / 2, baby.y + baby.h);
      }

      if (isPhase3) {
        // Evolução progressiva de dificuldade da Fase 3 ao longo de 15 plataformas
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
        // Restabelece a velocidade horizontal ao pousar e atualiza atributos progressivos
        if (landedIdx >= 9) {
          if (landedIdx === 9) {
            // Efeito escondido na plataforma 9 (castelo estreito):
            // A personagem NÃO deve andar sozinha de forma alguma.
            // Fica pausada (vx = 0, scroll = 0) aguardando a interação do jogador!
            baby.vx = 0;
            baby.vy = 0;
            baby.animTime = 0;
            currentScrollSpeed = 0;
            targetScrollSpeed = 0;
          } else {
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
      }

      if (!isPhase3 && landedIdx === 0) {
        firstPlatformCleared = true;
      }

      // Gatilho de Cena Cinemática: Topo do Castelo de Blocos (Plataforma 9)
      if (!isPhase3 && landedIdx === 9 && !cutsceneTriggered) {
        startCastleCutscene();
        return;
      }

      // Celebração de ápice ao aterrissar na 12ª plataforma de fuga (pedestal do grande portal)
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

      // Velocidade de corrida no chão na Fase 3
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

    // Verifica se passou direto da primeira plataforma sem pular
    if (!isPhase3) {
      const firstPlatform = platforms[0];
      if (!firstPlatformCleared && baby.x > firstPlatform.x + firstPlatform.w) {
        triggerGameOver();
        return;
      }
    } else {
      // Na Fase 3: Menina se deslocando para a esquerda no chão.
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

    // Verifica condição de vitória ou gatilho da reviravolta
    if (isPhase3) {
      if (baby.x <= trueExitDoor.x + 55 && !truePortalTransitionActive) {
        startTruePortalTransition();
        return;
      }
    } else {
      // Alcançar a porta de saída na Fase 1 / Fase 2: ativa a reviravolta!
      if (baby.x >= exitDoor.x - 10 && !plotTwistTriggered) {
        startPlotTwistCutscene();
        return;
      }
    }

    // Contagem regressiva suave do banner de fuga / subida de nível
    if (escapeBannerTimer > 0) {
      escapeBannerTimer--;
    }

    // Movimento de tela e rastreamento de câmera via CameraController
    syncLocalsToState();
    camera.syncFromState(state);
    camera.update(dt, state, canvas, {
      onLagBehind: () => triggerGameOver(),
      exitDoorX: trueExitDoor.x,
      exitDoorW: trueExitDoor.w
    });
    syncStateToLocals();
  }

  // --- RENDERIZAÇÃO ---
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

    // Elementos de interface (HUD) renderizados em coordenadas nítidas de tela
    drawEscapeBanner();
    drawCutsceneDialogue();

    // Transição de íris do portal verdadeiro (envelope de luz dourada para a Sala de Brinquedos)
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

  let isPaused = false;

  function togglePause() {
    isPaused = !isPaused;
    state.isPaused = isPaused;
    if (isPaused) {
      if (audio && typeof audio.pauseMusic === 'function') {
        audio.pauseMusic();
      }
    } else {
      lastTime = performance.now();
      if (audio && typeof audio.resumeMusic === 'function') {
        audio.resumeMusic();
      }
    }
    return isPaused;
  }

  function setPaused(value) {
    const shouldPause = Boolean(value);
    if (isPaused === shouldPause) return isPaused;
    return togglePause();
  }

  function loop(currentTime = performance.now()) {
    const elapsed = currentTime - lastTime;
    lastTime = currentTime;

    if (isPaused) {
      if (currentPhaseMode === 'toy-room' && toyRoomInstance) {
        toyRoomInstance.render();
      } else {
        render();
      }
      requestAnimationFrame(loop);
      return;
    }

    // Limite estrito de delta time:
    // Limita a razão de delta time entre 0.5 e 1.2 para prevenir picos causados por pausa, recarga ou lag
    const rawDt = elapsed / STEP_MS;
    const dt = Math.max(0.5, Math.min(1.2, isNaN(rawDt) || rawDt <= 0 ? 1.0 : rawDt));

    // Leitura de gamepad com latência zero (Botão X do controle) sincronizada ao loop do jogo
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

  // Desenho inicial para renderizar o cenário por trás da tela de título
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
    assets,
    assetsReady,
    darkRoomAtlas,
    atlasDebugger,
    input: inputHandler,
    audio,
    pauseMusic: () => audio && typeof audio.pauseMusic === 'function' && audio.pauseMusic(),
    resumeMusic: () => audio && typeof audio.resumeMusic === 'function' && audio.resumeMusic(),
    setMasterVolume: (v) => audio.setMasterVolume(v),
    getMasterVolume: () => audio.getMasterVolume(),
    setMuted: (m) => audio.setMuted(m),
    isMuted: () => audio.isMuted(),
    toggleMute: () => audio.toggleMute(),
    isPaused: () => isPaused,
    togglePause,
    setPaused,
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
