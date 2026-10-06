import { createRuntimeContext } from './runtime/RuntimeContext.js';
import { updatePortalNarrative } from './narrative/DarkRoomNarrative.js';
import { updateTutorialRetornoNarrative } from './narrative/DarkRoomNarrative.js';
import { updateReviravoltaNarrative } from './narrative/DarkRoomNarrative.js';
import { updateCasteloNarrative } from './narrative/DarkRoomNarrative.js';
import { updateTransicaoStandbyNarrative } from './narrative/DarkRoomNarrative.js';
import { updateStandbyNarrative } from './narrative/DarkRoomNarrative.js';
import { renderDarkRoom } from './rendering/DarkRoomRenderPipeline.js';
import { createViewportController } from './controllers/ViewportController.js';
import { createCameraQaObserver } from './debug/CameraQaObserver.js';
import { createCampaignProgress, captureState, restoreState } from './state/CampaignProgress.js';
import { createDefaultStateVariables } from './state/StateVariables.js';
import { OpeningSequence } from './cinematics/OpeningSequence.js';
import { ToyRoomIntroduction } from './cinematics/ToyRoomIntroduction.js';
import { getEscapeGuideTarget, updateEscapeFairyGuide } from './controllers/EscapeFairyGuide.js';
import { GAME_CONFIG, FLOOR_Y, platforms, exitDoor, phase3Platforms, trueExitDoor, roomScenery, createBabyState, createFairyState, CUTSCENE_DIALOGUE, getEscapeStats, getPhase3Stats } from './config.js';
import { createAudioController } from './controllers/AudioController.js';
import { isMobileDevice } from './controllers/MobileZoom.js';
import { createAndroidFraming } from './controllers/AndroidFraming.js';
import { CameraPresentation } from './controllers/CameraPresentation.js';
import { createCameraController } from './controllers/CameraController.js';
import { bindInput, InputController } from './controllers/InputController.js';
import { createToyRoom, ToyRoomPhase } from './toyRoom.js';
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
  const campaign = createCampaignProgress();
  let lastSaveTime = 0;
  const camera = createCameraController({ floorY: FLOOR_Y });
  const cameraPresentation = new CameraPresentation();
  const androidFraming = createAndroidFraming(canvas);
  const mobilePresentation = { enabled: isMobileDevice() };
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
  let introductionView = null;
  let introductionOverview = 0;
  const toyRoomIntroduction = new ToyRoomIntroduction({
    onComplete: () => {
      startToyRoomPhase({ fromIntroduction: true });
      introductionView = null;
    },
    onEvent: name => {
      callbacks.onNarrativeEvent?.(name);
      canvas.dispatchEvent(new CustomEvent(name));
      if (name === 'TOY_ROOM_START') toyRoomInstance?.instance.startTutorial();
    }
  });

  function beginToyRoomIntroduction() {
    if (typeof toyRoomIntroduction !== 'undefined' && toyRoomIntroduction.active) return;
    render();
    const departure = document.createElement('canvas');
    departure.width = canvas.width; departure.height = canvas.height;
    departure.getContext('2d').drawImage(canvas, 0, 0);
    introductionView = new ToyRoomPhase(canvas, null, null, null, { assets, bindInputs: false });
    baby.controlsLocked = true;
    toyRoomIntroduction.start({ phase: introductionView, departure, audio, canvas });
  }

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
  let standbyActivatedTime = 0;

  const opening = new OpeningSequence({
    onReveal: beginOpeningGameplay,
    onComplete: enterFirstJumpTutorial,
    onCue: name => {
      if (name === 'ambience') { audio.initAudio(); audio.pauseMusic(); audio.playOpeningAmbience(); }
      else if (name === 'wake') { audio.playLevelUpChime(0); audio.startMusic(); }
      else audio.playFairyVoiceBlip(name === 'shout' ? 1180 : 780);
    }
  });

  function beginOpeningGameplay() {
    // A sequência nunca move o corpo físico real. Libera-o na mesma
    // coordenada inicial existente, com a velocidade normal de corrida já definida.
    isStandbyActive = false;
    isStandbyTransitioning = false;
    baby.isCrouching = false;
    baby.controlsLocked = false;
    baby.respawnLandingPending = false;
    baby.onGround = true;
    baby.vx = baby.baseVx;
    cameraX = 0; cameraY = 0; cameraZoom = 1; targetCameraZoom = 1;
    fairy.x = baby.x + 65; fairy.y = baby.y - 50;
    fairy.vx = 0; fairy.vy = 0;
    syncLocalsToState(); camera.syncFromState(state);
    if (uiFeedback) uiFeedback.innerText = GAME_CONFIG.uiMessage;
    lastTime = performance.now();
  }

  function enterFirstJumpTutorial() {
    if (state.firstJumpTutorialCompleted) {
      state.gameplayState = 'GAMEPLAY_NORMAL';
      baby.controlsLocked = false;
      return;
    }
    // Suspende a simulação sem modificar velocidades, gravidade ou o layout.
    state.gameplayState = 'FIRST_JUMP_TUTORIAL';
    if (uiFeedback) uiFeedback.innerText = '';
    baby.controlsLocked = true;
    lastTime = performance.now();
    syncLocalsToState();
  }

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
    standbyActivatedTime = state.standbyActivatedTime;
    cutsceneActive = state.cutsceneActive;
    cutsceneTriggered = state.cutsceneTriggered;
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
    state.standbyActivatedTime = standbyActivatedTime;
    state.cutsceneActive = cutsceneActive;
    state.cutsceneTriggered = cutsceneTriggered;
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
    saveProgress();
    toyRoomIntroduction.cancel(); introductionView = null;
    opening.cancel();
    isPaused = false;
    state.isPaused = false;
    syncLocalsToState();
    state.restartToTitle(audio);
    syncStateToLocals();
  }

  // Atalho do menu para testar a mesma introdução usada na saída do portal.
  function startToyRoomIntroduction() {
    if (toyRoomIntroduction.active) return;
    opening.cancel();
    toyRoomInstance?.destroy();
    toyRoomInstance = null;
    currentPhaseMode = 'bedroom';
    gameStarted = true;
    isGameOver = false;
    gameWon = false;
    isPaused = false;
    state.isPaused = false;
    audio.initAudio();
    beginToyRoomIntroduction();
    lastTime = performance.now();
    if (!loopStarted) {
      loopStarted = true;
      requestAnimationFrame(loop);
    }
  }

  function startToyRoomPhase({ fromIntroduction = false } = {}) {
    if (!fromIntroduction) toyRoomIntroduction.cancel();
    isGameOver = false;
    gameWon = false;
    gameStarted = true;
    if (!fromIntroduction) {
      audio.stopAllAudio();
      audio.clearActiveSounds();
    }

    if (toyRoomInstance) {
      toyRoomInstance.destroy();
      toyRoomInstance = null;
    }

    currentPhaseMode = 'toy-room';
    toyRoomInstance = createToyRoom(canvas, audio, uiFeedback, () => {
      restartToTitle();
    }, { assets });

    if (fromIntroduction) {
      toyRoomInstance.instance.introAlpha = 0;
      toyRoomInstance.instance.introBannerTimer = 0;
      introductionOverview = 1;
    } else {
      introductionOverview = 0;
      audio.startToyRoomMusic();
    }
    if (!loopStarted) {
      loopStarted = true;
      requestAnimationFrame(loop);
    }
    saveProgress();
  }

  // Canvas persistente fora da tela para iluminação atmosférica escura (evita alocações no garbage collector)
  const darkCanvas = document.createElement('canvas');
  const dctx = darkCanvas.getContext('2d');

  // Adaptação de Resolução e Viewport (Zero distorção em Dispositivos Móveis e Desktop)
  const viewportController = createViewportController({
    canvas, darkCanvas, lighting, host: window,
    onOrientation: portrait => { isPortrait = portrait; }
  });
  function handleResize() {
    viewportController.resize();
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

  // --- CENA DA REVIRAVOLTA (TRANSIÇÃO PARA A FASE 3) ---
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
    cameraPresentation.reset();
    syncLocalsToState();
    state.resetToStart(failedMidClimb, shouldPlayFailSound, audio);
    syncStateToLocals();
  }

  function doJump(inputSource) {
    if (typeof toyRoomIntroduction !== 'undefined' && toyRoomIntroduction.active) return;
    if (opening.active) return;
    const firstJump = state.gameplayState === 'FIRST_JUMP_TUTORIAL';
    if (firstJump && (isPaused || !['touch', 'mouse', 'keyboard', 'gamepad'].includes(inputSource))) return;
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
    if ((!firstJump && baby.controlsLocked) || baby.respawnLandingPending || baby.isCrouching) {
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
    // Conclui somente após o impulso físico aceito; tentativas inválidas não consomem o tutorial.
    if (firstJump) {
      baby.controlsLocked = false;
      state.firstJumpTutorialCompleted = true;
      state.gameplayState = 'GAMEPLAY_NORMAL';
      lastTime = performance.now();
      saveProgress();
    }
    return true;
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
    // Avança o tempo de vida da poeira e dos rastros de velocidade, inclusive durante cenas e tutoriais.
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
      cameraVisibility: isPhase3,
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
    // Ajuste de arte exclusivo da primeira etapa; o ponto de contato dos pés não muda.
    babyRenderer.render(ctx, baby, state, camX, { assets, visualScale: !isEscapeMode && !isPhase3 ? 1.08 : 1 });
  }

  function drawFairy(camX) {
    syncLocalsToState();
    fairyRenderer.render(ctx, fairy, state, camX, { canvas, baby, platforms, assets });
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
    dialogueRenderer.drawPortrait(pCtx, charType, px, py, radius, mood, tick, { assets });
  }

  function wrapDialogueText(pCtx, text, maxWidth) {
    return dialogueRenderer.wrapText(pCtx, text, maxWidth);
  }

  function drawCutsceneDialogue(transform) {
    dialogueRenderer.renderCutsceneDialogue(ctx, canvas, state, {
      assets,
      getActivePromptDevice,
      characterAnchor: {
        top: Math.min(transform.transformPoint({x:baby.x-cameraX,y:baby.y-20}).y,
          transform.transformPoint({x:fairy.x-cameraX,y:fairy.y-28}).y),
        bottom: transform.transformPoint({x:baby.x-cameraX,y:baby.y+baby.h}).y
      }
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
  // Adaptador transitório sem armazenamento: conserva as barreiras de sincronização
  // existentes até a migração dos domínios de alto risco para GameState.
  const narrativeBindings = {
    currentPhaseMode: { get: () => currentPhaseMode, set: value => { currentPhaseMode = value; } },
    toyRoomInstance: { get: () => toyRoomInstance, set: value => { toyRoomInstance = value; } },
    cameraX: { get: () => cameraX, set: value => { cameraX = value; } },
    cameraY: { get: () => cameraY, set: value => { cameraY = value; } },
    targetCameraY: { get: () => targetCameraY, set: value => { targetCameraY = value; } },
    cameraZoom: { get: () => cameraZoom, set: value => { cameraZoom = value; } },
    targetCameraZoom: { get: () => targetCameraZoom, set: value => { targetCameraZoom = value; } },
    isPortrait: { get: () => isPortrait, set: value => { isPortrait = value; } },
    gameWon: { get: () => gameWon, set: value => { gameWon = value; } },
    isGameOver: { get: () => isGameOver, set: value => { isGameOver = value; } },
    gameStarted: { get: () => gameStarted, set: value => { gameStarted = value; } },
    loopStarted: { get: () => loopStarted, set: value => { loopStarted = value; } },
    lastJumpTime: { get: () => lastJumpTime, set: value => { lastJumpTime = value; } },
    lastDialogueAdvanceTime: { get: () => lastDialogueAdvanceTime, set: value => { lastDialogueAdvanceTime = value; } },
    lastTime: { get: () => lastTime, set: value => { lastTime = value; } },
    firstPlatformCleared: { get: () => firstPlatformCleared, set: value => { firstPlatformCleared = value; } },
    tick: { get: () => tick, set: value => { tick = value; } },
    isStandbyActive: { get: () => isStandbyActive, set: value => { isStandbyActive = value; } },
    isStandbyTransitioning: { get: () => isStandbyTransitioning, set: value => { isStandbyTransitioning = value; } },
    standbyTransitionTimer: { get: () => standbyTransitionTimer, set: value => { standbyTransitionTimer = value; } },
    standbyTransitionProgress: { get: () => standbyTransitionProgress, set: value => { standbyTransitionProgress = value; } },
    standbyActivatedTime: { get: () => standbyActivatedTime, set: value => { standbyActivatedTime = value; } },
    cutsceneActive: { get: () => cutsceneActive, set: value => { cutsceneActive = value; } },
    cutsceneTriggered: { get: () => cutsceneTriggered, set: value => { cutsceneTriggered = value; } },
    cutsceneStep: { get: () => cutsceneStep, set: value => { cutsceneStep = value; } },
    cutsceneTimer: { get: () => cutsceneTimer, set: value => { cutsceneTimer = value; } },
    isEscapeMode: { get: () => isEscapeMode, set: value => { isEscapeMode = value; } },
    escapeLevel: { get: () => escapeLevel, set: value => { escapeLevel = value; } },
    currentScrollSpeed: { get: () => currentScrollSpeed, set: value => { currentScrollSpeed = value; } },
    targetScrollSpeed: { get: () => targetScrollSpeed, set: value => { targetScrollSpeed = value; } },
    escapeBannerTimer: { get: () => escapeBannerTimer, set: value => { escapeBannerTimer = value; } },
    escapeBannerText: { get: () => escapeBannerText, set: value => { escapeBannerText = value; } },
    isPhase3: { get: () => isPhase3, set: value => { isPhase3 = value; } },
    phase3Level: { get: () => phase3Level, set: value => { phase3Level = value; } },
    plotTwistActive: { get: () => plotTwistActive, set: value => { plotTwistActive = value; } },
    plotTwistTriggered: { get: () => plotTwistTriggered, set: value => { plotTwistTriggered = value; } },
    plotTwistStep: { get: () => plotTwistStep, set: value => { plotTwistStep = value; } },
    plotTwistTimer: { get: () => plotTwistTimer, set: value => { plotTwistTimer = value; } },
    fakeDoorRevealed: { get: () => fakeDoorRevealed, set: value => { fakeDoorRevealed = value; } },
    fakeDoorSlideY: { get: () => fakeDoorSlideY, set: value => { fakeDoorSlideY = value; } },
    fakeDoorRotation: { get: () => fakeDoorRotation, set: value => { fakeDoorRotation = value; } },
    phase3TutorialActive: { get: () => phase3TutorialActive, set: value => { phase3TutorialActive = value; } },
    phase3TutorialProgress: { get: () => phase3TutorialProgress, set: value => { phase3TutorialProgress = value; } },
    truePortalTransitionActive: { get: () => truePortalTransitionActive, set: value => { truePortalTransitionActive = value; } },
    truePortalTransitionTimer: { get: () => truePortalTransitionTimer, set: value => { truePortalTransitionTimer = value; } },
    trueDoorOpenAngle: { get: () => trueDoorOpenAngle, set: value => { trueDoorOpenAngle = value; } },
    transitionWipeAlpha: { get: () => transitionWipeAlpha, set: value => { transitionWipeAlpha = value; } }
  };
  const narrativeState = new Proxy(state, {
    get: (target, name) => narrativeBindings[name] ? narrativeBindings[name].get() : Reflect.get(target, name),
    set: (target, name, value) => {
      if (narrativeBindings[name]) { narrativeBindings[name].set(value); return true; }
      return Reflect.set(target, name, value);
    }
  });


  function update(dt = 1.0) {
    if (toyRoomIntroduction.active) { toyRoomIntroduction.update(dt); return; }
    // O tutorial pausa relógio, IA, câmera e progressão antes de qualquer atualização.
    if (state.gameplayState === 'FIRST_JUMP_TUTORIAL') return;
    tick++;
    if (!gameStarted) return;
    if (gameWon) return;
    if (isGameOver) return;

    if (opening.active) {
      // Aguarda o recurso real; nunca encerra uma abertura não exibida durante o carregamento.
      if (assets.get('opening-waking-up')) opening.update(dt);
      return;
    }

    // Transição gradual de iluminação das plataformas
    const allPlatforms = isPhase3 ? phase3Platforms : platforms;
    for (let i = 0; i < allPlatforms.length; i++) {
      const p = allPlatforms[i];
      if (p.lightAlpha === undefined) p.lightAlpha = 0;
      const targetA = p.isLanded ? 1.0 : 0.0;
      p.lightAlpha += (targetA - p.lightAlpha) * 0.08;
    }

    // --- PREPARAÇÃO, PRONTIDÃO E RENASCIMENTO (FADINHA INTERATIVA) ---
    if (isStandbyActive) {
      updateStandbyNarrative(narrativeContext, dt);
      return;
    }

    if (isStandbyTransitioning) {
      updateTransicaoStandbyNarrative(narrativeContext, dt);
      return;
    }

    // --- SEQUENCIADOR DA CENA DA REVIRAVOLTA ---
    if (plotTwistActive) {
      updateReviravoltaNarrative(narrativeContext, dt);
      return;
    }

    // --- DEMONSTRAÇÃO DO TUTORIAL DA FASE 3 (FADINHA SIMULA TRAJETÓRIA DO PRIMEIRO SALTO) ---
    if (phase3TutorialActive) {
      updateTutorialRetornoNarrative(narrativeContext, dt);
      return;
    }

    // --- SEQUENCIADOR DA CENA CINEMÁTICA ---
    if (cutsceneActive) {
      updateCasteloNarrative(narrativeContext, dt);
      return;
    }

    // --- SEQUENCIADOR DE TRANSIÇÃO DO VERDADEIRO PORTAL PARA A SALA DE BRINQUEDOS ---
    if (truePortalTransitionActive) {
      updatePortalNarrative(narrativeContext, dt);
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
      escapeEndPlatformIndex: platforms.length - 1,
      exitDoorX: trueExitDoor.x,
      exitDoorW: trueExitDoor.w
    });
    syncStateToLocals();
  }

  // --- RENDERIZAÇÃO ---
  function render() {
    renderDarkRoom({
      ...runtimeContext,
      ctx, canvas, toyRoomIntroduction, opening, assets, lighting, fairyRenderer, cameraPresentation, camera, androidFraming, mobilePresentation, baby, fairy, cameraX, cameraY, cameraZoom, targetCameraY, targetScrollSpeed, isPhase3, plotTwistActive, phase3TutorialActive, truePortalTransitionActive, tick, gameWon, transitionWipeAlpha, inputHandler, recordCameraQa, drawBackgroundWall, drawSceneryItems, drawPlatforms, drawExitDoor, drawTrueExitDoor, drawTutorialArrow, drawSpeedRibbons, drawBabyJumpDust, drawFairy, drawBabyManaStyle, applyDarkAtmosphereWithLights, drawEscapeBanner, drawCutsceneDialogue, state
    });
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

  function saveProgress() {
    if (!gameStarted || toyRoomIntroduction.active) return;
    syncLocalsToState();
    const persisted = campaign.write({
      state: captureState(state), opening: opening.snapshot(),
      platforms: [platforms, phase3Platforms].map(group => group.map(p => ({ isLanded: !!p.isLanded, lightAlpha: p.lightAlpha || 0 }))),
      toyRoom: toyRoomInstance?.instance.snapshot() || null
    });
    callbacks.onSaveStatus?.(persisted);
    lastSaveTime = performance.now();
  }

  function restoreProgress(saved) {
    cameraPresentation.reset();
    if (saved.state.currentPhaseMode === 'toy-room') {
      startToyRoomPhase();
      toyRoomInstance.instance.restore(saved.toyRoom);
    }
    restoreState(state, saved.state);
    state.toyRoomInstance = toyRoomInstance;
    state.gameStarted = true;
    state.loopStarted = loopStarted;
    state.lastTime = performance.now();
    state.lastJumpTime = 0; state.lastDialogueAdvanceTime = 0; state.standbyActivatedTime = 0;
    syncStateToLocals();
    camera.syncFromState(state);
    opening.restore(saved.opening);
    [platforms, phase3Platforms].forEach((group, index) => group.forEach((p, i) => {
      Object.assign(p, saved.platforms?.[index]?.[i] || { isLanded: false, lightAlpha: 0 });
    }));
    if (isGameOver) callbacks.onGameOver?.();
    if (currentPhaseMode === 'bedroom') {
      if (opening.active && opening.time < 29) { audio.initAudio(); audio.playOpeningAmbience(); }
      else audio.startMusic();
    }
  }

  function newCampaign() {
    toyRoomIntroduction.cancel(); introductionView = null; introductionOverview = 0;
    gameStarted = false;
    cameraPresentation.reset();
    campaign.clear(); opening.reset();
    toyRoomInstance?.destroy(); toyRoomInstance = null;
    audio.stopAllAudio();
    clearTimeout(failMessageTimer);
    restoreState(state, captureState(createDefaultStateVariables()));
    state.toyRoomInstance = null; state.gameStarted = false; state.loopStarted = loopStarted;
    state.lastTime = performance.now(); state.lastJumpTime = 0; state.lastDialogueAdvanceTime = 0;
    state.standbyActivatedTime = 0; state.failMessageTimer = null;
    syncStateToLocals(); camera.syncFromState(state);
    isPaused = false; state.isPaused = false;
    [platforms, phase3Platforms].forEach(group => group.forEach(p => { p.isLanded = false; p.lightAlpha = 0; }));
  }

  const saveOnHide = () => { if (document.visibilityState === 'hidden') saveProgress(); };
  window.addEventListener('pagehide', saveProgress);
  document.addEventListener('visibilitychange', saveOnHide);

  const cameraQaObserver = createCameraQaObserver({
    host: window,
    snapshot: transform => ({
      cameraX, cameraY, cameraZoom, playerX: baby.x, playerY: baby.y,
      fairyX: fairy.x, fairyY: fairy.y, onGround: baby.onGround,
      platform: baby.currentPlatformIndex, phase3: isPhase3,
      narrative: Boolean(opening.active || isStandbyActive || isStandbyTransitioning ||
        cutsceneActive || plotTwistActive || phase3TutorialActive || truePortalTransitionActive),
      plotTwistActive, plotTwistStep, phase3TutorialActive, truePortalTransitionActive,
      width: canvas.width, height: canvas.height,
      cssWidth: canvas.getBoundingClientRect().width, cssHeight: canvas.getBoundingClientRect().height,
      transform: transform ? {a: transform.a, d: transform.d, e: transform.e, f: transform.f} : null
    })
  });
  function recordCameraQa(transform = null) {
    cameraQaObserver.record(transform);
  }

  function loop(currentTime = performance.now()) {
    if (gameStarted && currentTime - lastSaveTime >= 1000) saveProgress();
    const elapsed = currentTime - lastTime;
    lastTime = currentTime;

    if (isPaused) {
      if (currentPhaseMode === 'toy-room' && toyRoomInstance) {
        toyRoomInstance.instance.render({ overviewBlend: introductionOverview });
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
      introductionOverview = Math.max(0, introductionOverview - dt / 90);
      toyRoomInstance.instance.render({ overviewBlend: introductionOverview });
      requestAnimationFrame(loop);
      return;
    }

    update(dt);
    syncLocalsToState();
    render();
    requestAnimationFrame(loop);
  }

  const inputHandler = bindInput({
    isFirstJumpTutorial: () => state.gameplayState === 'FIRST_JUMP_TUTORIAL',
    doJump,
    isGrounded: () => Boolean(!opening.active && baby && baby.onGround && !baby.controlsLocked && !baby.respawnLandingPending && !baby.isCrouching && !isStandbyActive),
    isCutsceneActive: () => Boolean(opening.active || cutsceneActive || isStandbyActive || (plotTwistActive && plotTwistStep >= 4)),
    isGameOver: () => isGameOver,
    isToyRoomMode: () => currentPhaseMode === 'toy-room',
    setLastInputDevice,
    toggleMute: () => audio.toggleMute()
  });

  const runtimeContext = createRuntimeContext({ state, audio, camera, assets, input: inputHandler, effects: particles, campaign });
  const narrativeContext = { ...runtimeContext, state: narrativeState, baby, fairy, canvas, audio, uiFeedback, spawnBabyLandingPuff, spawnFairyFlightDust, spawnFairySparkles, updateFairyParticles, updateBabyJumpDust, advanceCutscene, finishCutscene, advancePlotTwist, finishPlotTwistAndStartTutorial, startStandbyPreparation, saveProgress, beginToyRoomIntroduction };

  // Desenho inicial para renderizar o cenário por trás da tela de título
  render();

  return {
    state,
    audio,
    toyRoomIntroduction,
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
    hasProgress: () => Boolean(campaign.read() || opening.hasCompleted()),
    saveProgress,
    newCampaign,
    destroy() {
      saveProgress();
      toyRoomIntroduction.cancel(); introductionView = null;
      window.removeEventListener('pagehide', saveProgress);
      document.removeEventListener('visibilitychange', saveOnHide);
      opening.cancel();
      if (inputHandler && typeof inputHandler.destroy === 'function') inputHandler.destroy();
      if (audio && typeof audio.destroy === 'function') audio.destroy();
    },
    start() {
      const saved = campaign.read();
      if (saved) restoreProgress(saved);
      gameStarted = true;
      state.gameStarted = true;
      if (saved) {
        // O estado restaurado já contém posição, narrativa e fase; não o reinicializa.
      } else if (currentPhaseMode === 'toy-room') {
        audio.startToyRoomMusic();
      } else if (!opening.start()) {
        beginOpeningGameplay();
        enterFirstJumpTutorial();
        audio.startMusic();
      }
      if (!loopStarted) {
        loopStarted = true;
        state.loopStarted = true;
        requestAnimationFrame(loop);
      }
      saveProgress();
    },
    doJump,
    isGrounded: () => Boolean(!opening.active && baby && baby.onGround && !baby.controlsLocked && !baby.respawnLandingPending && !baby.isCrouching && !isStandbyActive),
    isCutsceneActive: () => Boolean(opening.active || cutsceneActive || isStandbyActive || (plotTwistActive && plotTwistStep >= 4)),
    setLastInputDevice,
    resetToStart,
    retry: retryGame,
    restartToTitle,
    isGameOver: () => isGameOver,
    startToyRoomPhase,
    startToyRoomIntroduction,
    isToyRoomMode: () => currentPhaseMode === 'toy-room'
  };
}
