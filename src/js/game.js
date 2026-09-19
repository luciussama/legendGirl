import { GAME_CONFIG, FLOOR_Y, platforms, exitDoor, phase3Platforms, trueExitDoor, roomScenery, createBabyState, createFairyState, CUTSCENE_DIALOGUE, getEscapeStats, getPhase3Stats } from './config.js';
import { createAudioSystem } from './audio.js';
import { bindInput } from './input.js';
import { createToyRoom } from './toyRoom.js';

export function createGame(canvas, uiFeedback, callbacks = {}) {
  const ctx = canvas.getContext('2d');
  const audio = createAudioSystem();
  const baby = createBabyState();
  const fairy = createFairyState();

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

  function setLastInputDevice(dev) {
    if (dev === 'keyboard' || dev === 'gamepad' || dev === 'touch') {
      lastUsedInputDevice = dev;
    }
  }

  function getActivePromptDevice() {
    if (lastUsedInputDevice === 'gamepad') return 'gamepad';
    if (lastUsedInputDevice === 'touch') return 'touch';
    if (typeof window !== 'undefined') {
      try {
        const gps = navigator.getGamepads ? navigator.getGamepads() : null;
        if (gps && Array.from(gps).some(gp => gp && gp.connected)) {
          if (lastUsedInputDevice === 'gamepad') return 'gamepad';
        }
      } catch (e) {}
      if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
        return 'touch';
      }
    }
    return 'keyboard';
  }

  function startStandbyPreparation() {
    isStandbyActive = true;
    isStandbyTransitioning = false;
    standbyTransitionTimer = 0;
    standbyTransitionProgress = 0;
    standbyStandUpProgress = 0;
    standbyDialogueAlpha = 1.0;
    standbyActivatedTime = performance.now();

    baby.vx = 0;
    baby.vy = 0;
    baby.isCrouching = true;
    baby.controlsLocked = true;
    baby.onGround = true;
    baby.respawnLandingPending = false;
    baby.animTime = 0;

    // Position fairy hovering right above the baby emitting comforting light
    const fairyOffsetX = baby.facing === -1 ? -18 : 18;
    fairy.x = baby.x + fairyOffsetX;
    fairy.y = baby.y - 75;
    fairy.vx = 0;
    fairy.vy = 0;
    fairy.spinAnim = 0;

    targetCameraZoom = 1.25;
    cameraZoom = 1.25;
    const targetCam = baby.x - (canvas.width > 600 ? canvas.width * 0.35 : canvas.width * 0.25);
    cameraX = targetCam;

    audio.playFairyVoiceBlip(780);
  }

  function confirmStandby() {
    if (!isStandbyActive || isStandbyTransitioning) return;
    isStandbyActive = false;
    isStandbyTransitioning = true;
    standbyTransitionTimer = 0;
    standbyTransitionProgress = 0;
    standbyStandUpProgress = 0;
    standbyDialogueAlpha = 1.0;

    // Diegetic gesture of encouragement: graceful pirouette and sparkle burst
    fairy.spinAnim = 3.2;
    fairy.vy = -2.8;
    spawnFairySparkles(fairy.x, fairy.y, 22);
    audio.playFairyVoiceBlip(980);
  }

  // Rigid reset of physics components to prevent vector accumulation or delta spikes
  function resetBabyPhysicsBody(targetX, targetY, facing = 1) {
    baby.x = targetX;
    baby.y = targetY;
    // 1. Rigid zeroing of linear velocity and external forces
    baby.vx = 0;
    baby.vy = 0;
    baby.facing = facing;
    baby.isShocked = false;
    baby.isLyingDown = false;
    // 2. Physics Grounded state must ONLY be validated once the collision solver confirms floor/platform contact
    baby.onGround = false;
    baby.respawnLandingPending = true;
    baby.controlsLocked = false;
    // Clear impulse buffers and active motion ribbons
    speedRibbons.length = 0;
    babyJumpDust.length = 0;
    // 3. Grace cooldown (240ms) preventing input buffering or click bleedthrough into a jump
    lastJumpTime = performance.now() + 240;
    // 4. Reset delta time clock to strictly eliminate any delta time spikes
    lastTime = performance.now();
  }

  function triggerGameOver() {
    if (isGameOver) return;
    isGameOver = true;
    // Immediately stop runaway velocity on death
    baby.vx = 0;
    baby.vy = 0;
    baby.onGround = false;
    baby.respawnLandingPending = true;
    audio.clearActiveSounds();
    audio.playFallFailSound();
    uiFeedback.innerText = 'Você não conseguiu sair do quarto.';
    uiFeedback.style.color = '#f87171';

    const overlay = document.getElementById('gameover-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
    }
    if (callbacks && callbacks.onGameOver) {
      callbacks.onGameOver();
    }
  }

  function retryGame() {
    isGameOver = false;
    const overlay = document.getElementById('gameover-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
    audio.clearActiveSounds();
    audio.startMusic();
    lastTime = performance.now();
    // Checkpoint retry: reinicia o jogador diretamente no início da seção da Fase 3 sem som de falha redundante
    resetToStart(true, false);
  }

  function restartToTitle() {
    isGameOver = false;
    gameStarted = false;
    if (toyRoomInstance) {
      toyRoomInstance.destroy();
      toyRoomInstance = null;
    }
    currentPhaseMode = 'bedroom';
    audio.stopToyRoomMusic();
    const overlay = document.getElementById('gameover-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
    audio.stopAllAudio(); // Interrompe imediatamente trilha sonora e efeitos
    resetToStart(false, false);
    uiFeedback.innerText = 'Toque na tela para dar um pulinho e seguir a fadinha';
    uiFeedback.style.color = '#e2dcd0';
    if (callbacks && callbacks.onRestartToTitle) {
      callbacks.onRestartToTitle();
    }
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
  const speedRibbons = [];
  const babyJumpDust = [];

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
    if (truePortalTransitionActive) return;
    truePortalTransitionActive = true;
    truePortalTransitionTimer = 0;
    trueDoorOpenAngle = 0;
    transitionWipeAlpha = 0;

    // Immediately lock side-scroller jump input
    baby.controlsLocked = true;
    baby.vx = -1.2;
    baby.vy = 0;
    baby.facing = -1;

    audio.clearActiveSounds();
    audio.playLevelUpChime(14);

    uiFeedback.innerText = '✨ O Verdadeiro Portal dos Sonhos se abriu!';
    uiFeedback.style.color = '#fde047';

    spawnFairySparkles(trueExitDoor.x + trueExitDoor.w / 2, trueExitDoor.y + trueExitDoor.h / 2, 40);
  }

  function showFailMessage() {
    uiFeedback.innerText = 'Falhou ao seguir a fadinha... Ela voltou para esperar você.';
    uiFeedback.style.color = '#f87171';

    if (failMessageTimer) {
      clearTimeout(failMessageTimer);
    }

    failMessageTimer = setTimeout(() => {
      uiFeedback.innerText = 'Toque na tela para dar um pulinho e seguir a fadinha';
      uiFeedback.style.color = '#e6dfd5';
    }, 2800);
  }

  function startCastleCutscene() {
    audio.clearActiveSounds();
    cutsceneActive = true;
    cutsceneTriggered = true;
    cutsceneStep = 1;
    cutsceneTimer = 0;
    targetCameraZoom = 1.45;
    baby.vx = 0;
    baby.vy = 0;
    audio.playFairyVoiceBlip(880);
    uiFeedback.innerText = 'A fadinha quer falar com você! Toque na tela para conversar.';
    uiFeedback.style.color = '#fef08a';
  }

  function advanceCutscene() {
    if (cutsceneStep === 1) {
      cutsceneStep = 2;
      cutsceneTimer = 0;
      audio.playFairyLaugh();
      fairy.spinAnim = 2.8;
      spawnFairySparkles(fairy.x, fairy.y, 22);
    } else if (cutsceneStep === 2) {
      finishCutscene();
    }
  }

  function finishCutscene() {
    audio.clearActiveSounds();
    cutsceneActive = false;
    cutsceneCompleted = true;
    isEscapeMode = true;
    targetCameraZoom = 1.0;

    escapeLevel = 0;
    const stats = getEscapeStats(0);
    baby.isEscaping = true;
    baby.longJumpUnlocked = true;
    baby.vx = stats.runVx;
    baby.jumpPower = stats.jumpPower;
    currentScrollSpeed = stats.scrollSpeed;
    targetScrollSpeed = stats.scrollSpeed;

    audio.playEscapePowerUp();
    escapeBannerTimer = 220;
    escapeBannerText = '⚡ MODO FUGA ATIVADO! PULO PROGRESSIVO DESBLOQUEADO!';
    uiFeedback.innerText = '⚡ MODO FUGA! A cada plataforma o seu pulo e a velocidade aumentam!';
    uiFeedback.style.color = '#fef08a';

    spawnFairySparkles(baby.x + baby.w / 2, baby.y + baby.h / 2, 30);
  }

  // --- PLOT TWIST CINEMATIC (FASE 3 TRANSITION) ---
  function startPlotTwistCutscene() {
    audio.clearActiveSounds();
    plotTwistActive = true;
    plotTwistTriggered = true;
    plotTwistStep = 1; // 1: Porta falsa escorrega e descola; menina cai
    plotTwistTimer = 0;
    fakeDoorRevealed = true;
    fakeDoorSlideY = 0;
    fakeDoorRotation = 0;

    baby.isShocked = true;
    baby.isLyingDown = false;
    baby.vx = 0;
    baby.vy = 2.2;
    baby.onGround = false;
    baby.controlsLocked = true;
    targetCameraZoom = 1.25;

    audio.playTapeRipSound();
    audio.playDramaticTumbleSound();

    uiFeedback.innerText = 'Espere... A porta está deslizando pela parede?!';
    uiFeedback.style.color = '#f87171';
  }

  function advancePlotTwist() {
    if (plotTwistStep === 4) {
      // Avança para o diálogo e vaivém da fadinha no ar
      plotTwistStep = 5;
      plotTwistTimer = 0;
      fairy.pacingPhase = 0;
      audio.playFairyFrustratedSound();
      uiFeedback.innerText = 'A fadinha está procurando outro caminho!';
      uiFeedback.style.color = '#fef08a';
    } else if (plotTwistStep === 5) {
      finishPlotTwistAndStartTutorial();
    }
  }

  function finishPlotTwistAndStartTutorial() {
    audio.clearActiveSounds();
    plotTwistActive = false;
    plotTwistStep = 0;
    isPhase3 = true;
    isEscapeMode = false;

    // A menina se levanta do chão e permanece parada com controles bloqueados
    baby.isShocked = false;
    baby.isLyingDown = false;
    baby.facing = -1; // Inverte orientação: voltada para a esquerda!
    baby.x = 4640;
    baby.y = FLOOR_Y - baby.h;
    baby.vx = 0;
    baby.vy = 0;
    baby.onGround = true;
    baby.currentPlatformIndex = -1;
    baby.controlsLocked = true; // Bloqueio temporário durante demonstração visual

    phase3TutorialActive = true;
    phase3TutorialProgress = 0;

    targetCameraZoom = 1.0;
    cameraZoom = 1.0;
    cameraX = baby.x - (canvas.width > 600 ? canvas.width - 250 : canvas.width - 150);

    fairy.x = baby.x - 20;
    fairy.y = baby.y - 15;
    fairy.vx = 0;
    fairy.vy = 0;

    audio.playPhase3StartFanfare();
    escapeBannerTimer = 220;
    escapeBannerText = '🌪️ FASE 3: A SUBIDA CAÓTICA! ESCALADA RUMO À ESQUERDA!';
    uiFeedback.innerText = '✨ Observe a fadinha indicando a trajetória do salto...';
    uiFeedback.style.color = '#fef08a';

    spawnFairySparkles(baby.x + baby.w / 2, baby.y + baby.h / 2, 35);
  }

  function resetToStart(failedMidClimb = false, shouldPlayFailSound = true) {
    audio.clearActiveSounds();
    // Reset lighting on all platforms so they return to penumbra state
    platforms.forEach(p => { p.isLanded = false; p.lightAlpha = 0; });
    phase3Platforms.forEach(p => { p.isLanded = false; p.lightAlpha = 0; });

    if (failedMidClimb && isPhase3) {
      // Checkpoint: recomeça do ponto em que a menina se levanta no início dessa subida
      resetBabyPhysicsBody(4640, FLOOR_Y - baby.h, -1);
      baby.currentPlatformIndex = -1;
      phase3TutorialActive = false;

      phase3Level = 0;
      const stats = getPhase3Stats(0);
      baby.jumpPower = stats.jumpPower;
      currentScrollSpeed = stats.scrollSpeed;
      targetScrollSpeed = stats.scrollSpeed;

      if (shouldPlayFailSound) {
        audio.playFallFailSound();
      }

      startStandbyPreparation();
      return;
    }

    if (failedMidClimb && (cutsceneCompleted || isEscapeMode)) {
      // Checkpoint: Topo do Castelo (Plataforma 9)
      const castle = platforms[9];
      castle.isLanded = true;
      castle.lightAlpha = 1.0;
      resetBabyPhysicsBody(castle.x + 35, castle.y - baby.h, 1);
      escapeLevel = 0;
      const stats = getEscapeStats(0);
      baby.jumpPower = stats.jumpPower;
      baby.currentPlatformIndex = 9;
      baby.longJumpUnlocked = true;
      baby.isEscaping = true;
      isEscapeMode = true;
      currentScrollSpeed = stats.scrollSpeed;
      targetScrollSpeed = stats.scrollSpeed;

      if (shouldPlayFailSound) {
        audio.playFallFailSound();
      }

      startStandbyPreparation();
      return;
    }

    resetBabyPhysicsBody(60, FLOOR_Y - baby.h, 1);
    baby.vx = 0;
    baby.vy = 0;
    baby.jumpPower = -7.2;
    baby.currentPlatformIndex = -1;
    baby.longJumpUnlocked = false;
    baby.isEscaping = false;
    isEscapeMode = false;
    escapeLevel = 0;
    currentScrollSpeed = 1.5;
    targetScrollSpeed = 1.5;
    firstPlatformCleared = false;
    cutsceneActive = false;
    cutsceneTriggered = false;
    cutsceneCompleted = false;
    plotTwistActive = false;
    plotTwistTriggered = false;
    plotTwistStep = 0;
    phase3TutorialActive = false;
    isPhase3 = false;
    truePortalTransitionActive = false;
    truePortalTransitionTimer = 0;
    trueDoorOpenAngle = 0;
    transitionWipeAlpha = 0;
    fakeDoorRevealed = false;
    fakeDoorSlideY = 0;
    fakeDoorRotation = 0;

    if (failedMidClimb) {
      if (shouldPlayFailSound) {
        audio.playFallFailSound();
      }
    }

    startStandbyPreparation();
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
    const fairyHues = [48, 52, 192, 330, 280]; // Warm Gold, Ethereal Cyan, Rose, Violet
    const chosenHue = fairyHues[Math.floor(Math.random() * fairyHues.length)];
    const angle = Math.random() * Math.PI * 2;
    const driftSpeed = 0.2 + Math.random() * 0.45;

    fairy.particles.push({
      x: fx + (Math.random() - 0.5) * 8,
      y: fy + (Math.random() - 0.5) * 8,
      vx: -fvx * 0.22 + Math.cos(angle) * driftSpeed,
      vy: -fvy * 0.18 + Math.sin(angle) * driftSpeed + 0.08,
      size: 1.4 + Math.random() * 2.2,
      hue: chosenHue,
      twinkle: Math.random() > 0.45,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.06 + Math.random() * 0.06,
      life: 1.0,
      decay: 0.018 + Math.random() * 0.015
    });
  }

  function spawnFairySparkles(x, y, count = 2) {
    const fairyHues = [48, 52, 192, 330, 280];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.6;
      const chosenHue = fairyHues[Math.floor(Math.random() * fairyHues.length)];
      fairy.particles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.15,
        size: 1.8 + Math.random() * 2.4,
        hue: chosenHue,
        twinkle: Math.random() > 0.4,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.08 + Math.random() * 0.08,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.02
      });
    }
  }

  function updateFairyParticles() {
    for (let i = fairy.particles.length - 1; i >= 0; i--) {
      const p = fairy.particles[i];
      p.wobble = (p.wobble || 0) + (p.wobbleSpeed || 0.06);
      p.x += p.vx + Math.sin(p.wobble) * 0.25;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) {
        fairy.particles.splice(i, 1);
      }
    }
  }

  // --- SUBTLE BABY JUMP TRAIL SYSTEM ---
  function spawnBabyJumpDust(bx, by, bw, bh, bvx, bvy) {
    const palette = [
      '254, 240, 138', // Golden fairy dust
      '233, 213, 255', // Dreamy lavender
      '186, 230, 253', // Soft celestial cyan
      '251, 207, 232', // Soft pastel pink
      '255, 255, 255'  // Sparkle white
    ];
    const count = isEscapeMode ? (escapeLevel >= 6 ? 2 : 1) : 1;
    for (let i = 0; i < count; i++) {
      const rgb = palette[Math.floor(Math.random() * palette.length)];
      babyJumpDust.push({
        x: bx + bw * (0.2 + Math.random() * 0.6),
        y: by + bh - 2 + (Math.random() - 0.5) * 3,
        vx: -bvx * (0.22 + Math.random() * 0.18) + (Math.random() - 0.5) * 0.35,
        vy: -0.12 + (Math.random() - 0.5) * 0.35,
        size: 1.3 + Math.random() * 1.5,
        rgb,
        twinkle: Math.random() > 0.6,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.05 + Math.random() * 0.05,
        life: 1.0,
        decay: 0.024 + Math.random() * 0.016
      });
    }
  }

  function spawnBabyJumpPuff(x, y, count = 5) {
    const palette = ['254, 240, 138', '233, 213, 255', '186, 230, 253', '255, 255, 255'];
    for (let i = 0; i < count; i++) {
      const rgb = palette[Math.floor(Math.random() * palette.length)];
      const angle = Math.PI + (Math.random() - 0.5) * 1.6;
      const speed = 0.4 + Math.random() * 1.1;
      babyJumpDust.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y - 2 + (Math.random() - 0.5) * 3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.15,
        size: 1.4 + Math.random() * 1.5,
        rgb,
        twinkle: Math.random() > 0.5,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.06 + Math.random() * 0.05,
        life: 1.0,
        decay: 0.028 + Math.random() * 0.018
      });
    }
  }

  function spawnBabyLandingPuff(x, y) {
    const palette = ['254, 240, 138', '186, 230, 253', '255, 255, 255'];
    for (let i = 0; i < 5; i++) {
      const rgb = palette[Math.floor(Math.random() * palette.length)];
      const dir = Math.random() > 0.5 ? 1 : -1;
      babyJumpDust.push({
        x: x + dir * (3 + Math.random() * 7),
        y: y - 2,
        vx: dir * (0.5 + Math.random() * 0.8),
        vy: -0.2 - Math.random() * 0.5,
        size: 1.3 + Math.random() * 1.3,
        rgb,
        twinkle: Math.random() > 0.5,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.06 + Math.random() * 0.06,
        life: 1.0,
        decay: 0.035 + Math.random() * 0.02
      });
    }
  }

  function updateBabyJumpDust() {
    for (let i = babyJumpDust.length - 1; i >= 0; i--) {
      const p = babyJumpDust[i];
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 0.2;
      p.y += p.vy;
      p.vy += 0.01;
      p.life -= p.decay;
      if (p.life <= 0) {
        babyJumpDust.splice(i, 1);
      }
    }
  }

  // --- BACKGROUND & WALLPAPER ---
  function drawBackgroundWall(camX) {
    // Deep atmospheric nursery background
    ctx.fillStyle = '#110e19';
    ctx.fillRect(0, -600, canvas.width, canvas.height + 1200);

    // Wallpaper stripes & diamond pattern with parallax
    const bgOffset = (camX * 0.15) % 80;
    ctx.fillStyle = '#161220';
    for (let x = -80; x < canvas.width + 80; x += 80) {
      ctx.fillRect(x - bgOffset, -400, 40, FLOOR_Y + 400);
    }

    // Faint golden wallpaper stars
    ctx.fillStyle = 'rgba(250, 204, 21, 0.07)';
    for (let x = -80; x < canvas.width + 80; x += 80) {
      const sx = x - bgOffset + 20;
      for (let y = 50; y < FLOOR_Y; y += 65) {
        ctx.beginPath();
        ctx.arc(sx, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Bunting garland / pennant flags hanging across the room
    const garlandOffset = (camX * 0.2) % 360;
    ctx.strokeStyle = 'rgba(120, 100, 150, 0.4)';
    ctx.lineWidth = 1.2;
    for (let gx = -360; gx < canvas.width + 360; gx += 180) {
      const sx = gx - garlandOffset;
      ctx.beginPath();
      ctx.moveTo(sx, 70);
      ctx.quadraticCurveTo(sx + 90, 110, sx + 180, 70);
      ctx.stroke();

      // Colorful hanging pennant triangles
      const colors = ['#f43f5e', '#facc15', '#06b6d4', '#a855f7', '#10b981', '#fb923c'];
      for (let p = 0; p < 5; p++) {
        const t = (p + 0.5) / 5;
        const px = sx + t * 180;
        const py = 70 + (4 * t * (1 - t)) * 40;
        ctx.fillStyle = colors[(Math.floor(gx / 180) * 5 + p) % colors.length];
        ctx.beginPath();
        ctx.moveTo(px - 7, py);
        ctx.lineTo(px + 7, py);
        ctx.lineTo(px, py + 14);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Windows to starry night sky
    const windowLocations = [780, 1950];
    windowLocations.forEach((wx) => {
      const sx = wx - camX * 0.3;
      if (sx < -140 || sx > canvas.width + 140) return;

      // Window frame
      ctx.fillStyle = '#1c152b';
      ctx.strokeStyle = '#42335f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(sx, 80, 90, 130, [45, 45, 4, 4]);
      ctx.fill();
      ctx.stroke();

      // Glasspane midnight sky
      ctx.fillStyle = '#06050e';
      ctx.beginPath();
      ctx.roundRect(sx + 6, 86, 78, 118, [40, 40, 2, 2]);
      ctx.fill();

      // Crescent Moon
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(sx + 35, 115, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#06050e';
      ctx.beginPath();
      ctx.arc(sx + 39, 113, 10, 0, Math.PI * 2);
      ctx.fill();

      // Twinkling stars in window
      ctx.fillStyle = '#ffffff';
      const tw = Math.sin(tick * 0.05 + wx) * 0.5 + 0.5;
      ctx.fillRect(sx + 60, 110, 2, 2);
      ctx.fillRect(sx + 22, 145, 1.5, 1.5);
      ctx.fillRect(sx + 65, 160, 2 * tw, 2 * tw);

      // Window cross panes
      ctx.strokeStyle = '#322549';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx + 45, 86);
      ctx.lineTo(sx + 45, 204);
      ctx.moveTo(sx + 6, 140);
      ctx.lineTo(sx + 84, 140);
      ctx.stroke();

      // Sheer lilac curtains with soft folds
      ctx.fillStyle = 'rgba(168, 85, 247, 0.28)';
      ctx.beginPath();
      ctx.moveTo(sx - 4, 80);
      ctx.quadraticCurveTo(sx + 15, 140, sx + 5, 215);
      ctx.lineTo(sx - 4, 215);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(sx + 94, 80);
      ctx.quadraticCurveTo(sx + 75, 140, sx + 85, 215);
      ctx.lineTo(sx + 94, 215);
      ctx.closePath();
      ctx.fill();
    });

    // Wall peg hooks with hanging items
    const wallPegs = [
      { x: 300, item: 'wizard_hat' },
      { x: 1250, item: 'cape' },
      { x: 2200, item: 'scarf' }
    ];
    wallPegs.forEach(peg => {
      const sx = peg.x - camX * 0.45;
      if (sx < -60 || sx > canvas.width + 60) return;

      // Wooden peg knob
      ctx.fillStyle = '#854d0e';
      ctx.beginPath();
      ctx.arc(sx, 165, 4, 0, Math.PI * 2);
      ctx.fill();

      if (peg.item === 'wizard_hat') {
        // Pointy child wizard hat with yellow stars
        ctx.fillStyle = '#6b21a8';
        ctx.beginPath();
        ctx.ellipse(sx, 205, 16, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(sx - 12, 204);
        ctx.quadraticCurveTo(sx - 3, 175, sx + 8, 168);
        ctx.quadraticCurveTo(sx + 4, 185, sx + 12, 204);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.fillRect(sx, 186, 3, 3);
      } else if (peg.item === 'cape') {
        // Little hero cape
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(sx, 165);
        ctx.lineTo(sx + 16, 212);
        ctx.quadraticCurveTo(sx + 5, 218, sx - 10, 212);
        ctx.closePath();
        ctx.fill();
      } else {
        // Striped winter scarf
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(sx - 4, 168, 8, 38);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(sx - 4, 178, 8, 5);
        ctx.fillRect(sx - 4, 192, 8, 5);
      }
    });

    // Framed children's crayon drawings on the wall
    const wallDrawings = [
      { x: 420, y: 140, type: 'sun' },
      { x: 980, y: 130, type: 'castle' },
      { x: 1600, y: 140, type: 'rainbow' },
      { x: 2360, y: 130, type: 'cat' }
    ];
    wallDrawings.forEach(d => {
      const sx = d.x - camX * 0.45;
      if (sx < -70 || sx > canvas.width + 70) return;

      // Wooden picture frame
      ctx.fillStyle = '#451a03';
      ctx.fillRect(sx - 2, d.y - 2, 48, 44);
      // Paper sheet
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(sx + 2, d.y + 2, 40, 36);

      if (d.type === 'sun') {
        // Big yellow smiley sun with crayon rays
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(sx + 22, d.y + 20, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2;
        for (let a = 0; a < 8; a++) {
          const ang = a * (Math.PI / 4);
          ctx.beginPath();
          ctx.moveTo(sx + 22 + Math.cos(ang) * 9, d.y + 20 + Math.sin(ang) * 9);
          ctx.lineTo(sx + 22 + Math.cos(ang) * 14, d.y + 20 + Math.sin(ang) * 14);
          ctx.stroke();
        }
        // Smiley face
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(sx + 19, d.y + 18, 1.5, 1.5);
        ctx.fillRect(sx + 24, d.y + 18, 1.5, 1.5);
        ctx.beginPath();
        ctx.arc(sx + 22, d.y + 21, 3, 0.2, Math.PI - 0.2);
        ctx.stroke();
      } else if (d.type === 'castle') {
        // Little purple crayon castle
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(sx + 10, d.y + 14, 24, 18);
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.moveTo(sx + 22, d.y + 6);
        ctx.lineTo(sx + 13, d.y + 14);
        ctx.lineTo(sx + 31, d.y + 14);
        ctx.closePath();
        ctx.fill();
      } else if (d.type === 'rainbow') {
        // Crayon rainbow
        ctx.lineWidth = 2;
        const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];
        colors.forEach((c, idx) => {
          ctx.strokeStyle = c;
          ctx.beginPath();
          ctx.arc(sx + 22, d.y + 32, 15 - idx * 2.5, Math.PI, 0);
          ctx.stroke();
        });
      } else {
        // Crayon cat
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(sx + 22, d.y + 22, 7, 0, Math.PI * 2);
        ctx.fill();
        // Ears
        ctx.beginPath();
        ctx.moveTo(sx + 17, d.y + 17);
        ctx.lineTo(sx + 15, d.y + 11);
        ctx.lineTo(sx + 20, d.y + 16);
        ctx.moveTo(sx + 24, d.y + 16);
        ctx.lineTo(sx + 29, d.y + 11);
        ctx.lineTo(sx + 27, d.y + 17);
        ctx.fill();
      }
    });

    // High floating wall shelf with miniature toys
    const wallShelves = [580, 1400, 2100];
    wallShelves.forEach(wx => {
      const sx = wx - camX * 0.4;
      if (sx < -120 || sx > canvas.width + 120) return;

      // Wooden shelf board
      ctx.fillStyle = '#312117';
      ctx.fillRect(sx, 160, 95, 8);
      // Metal shelf bracket supports
      ctx.strokeStyle = '#1e140d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx + 12, 168);
      ctx.lineTo(sx + 12, 184);
      ctx.lineTo(sx + 26, 168);
      ctx.moveTo(sx + 83, 168);
      ctx.lineTo(sx + 83, 184);
      ctx.lineTo(sx + 69, 168);
      ctx.stroke();

      // Books leaning on shelf
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(sx + 12, 134, 7, 26);
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(sx + 20, 138, 6, 22);

      // Glass snowglobe
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sx + 45, 144, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#451a03';
      ctx.fillRect(sx + 38, 154, 14, 6);

      // Miniature wooden sailboat
      ctx.fillStyle = '#854d0e';
      ctx.beginPath();
      ctx.moveTo(sx + 68, 156);
      ctx.lineTo(sx + 86, 156);
      ctx.lineTo(sx + 81, 160);
      ctx.lineTo(sx + 72, 160);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(sx + 77, 156);
      ctx.lineTo(sx + 77, 140);
      ctx.lineTo(sx + 84, 153);
      ctx.closePath();
      ctx.fill();
    });

    // --- FLOOR & BASEBOARDS ---
    ctx.fillStyle = '#1c1726';
    ctx.fillRect(0, FLOOR_Y, canvas.width, canvas.height - FLOOR_Y + 700);

    // Dark wood baseboard molding
    ctx.fillStyle = '#2b2138';
    ctx.fillRect(0, FLOOR_Y - 8, canvas.width, 8);
    ctx.strokeStyle = '#3e3152';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, FLOOR_Y - 8);
    ctx.lineTo(canvas.width, FLOOR_Y - 8);
    ctx.stroke();

    // Wooden plank seams on floor
    ctx.strokeStyle = '#15111e';
    ctx.lineWidth = 2;
    for (let x = -80; x < canvas.width + 80; x += 70) {
      const sx = x - (camX % 70);
      ctx.beginPath();
      ctx.moveTo(sx, FLOOR_Y);
      ctx.lineTo(sx - 28, canvas.height + 700);
      ctx.stroke();
    }
  }

  // --- DETAILED ROOM SCENERY ITEMS (BAGUNÇA DO QUARTO) ---
  function drawSceneryItems(camX) {
    roomScenery.forEach((item) => {
      const sx = item.x - camX;
      if (sx < -160 || sx > canvas.width + 160) return;

      ctx.save();

      switch (item.type) {
        case 'fluffy_rug': {
          // Large round pastel mandala rug on floor
          ctx.fillStyle = '#4a2840';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y + 18, 55, 16, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#9d4edd';
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.fillStyle = '#7b2cbf';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y + 18, 38, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'striped_rug': {
          // Oval striped runner rug
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y + 20, 60, 15, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.strokeStyle = '#facc15';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y + 20, 42, 10, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }

        case 'dropped_sweater': {
          // Dropped kid's soft cozy knit sweater
          ctx.fillStyle = '#ec4899';
          ctx.strokeStyle = '#9d174d';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 9, 16, 9, 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Crumpled sleeves
          ctx.beginPath();
          ctx.ellipse(sx - 14, FLOOR_Y - 5, 8, 4.5, -0.4, 0, Math.PI * 2);
          ctx.ellipse(sx + 14, FLOOR_Y - 6, 8, 4.5, 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Little buttons
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 1, FLOOR_Y - 12, 2, 2);
          ctx.fillRect(sx - 1, FLOOR_Y - 7, 2, 2);
          break;
        }

        case 'striped_socks': {
          // Pair of colorful kid socks tossed on floor
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.roundRect(sx - 8, FLOOR_Y - 6, 14, 6, 3);
          ctx.roundRect(sx + 6, FLOOR_Y - 8, 12, 6, 3);
          ctx.fill();
          // Stripes
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx - 4, FLOOR_Y - 6, 3, 6);
          ctx.fillRect(sx + 10, FLOOR_Y - 8, 3, 6);
          break;
        }

        case 'spilled_crayons': {
          // Box of crayons tipped over with crayons rolled out & scribbles
          // Crayon scribble on the floor
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sx - 20, FLOOR_Y - 2);
          ctx.lineTo(sx - 8, FLOOR_Y - 4);
          ctx.lineTo(sx + 12, FLOOR_Y - 1);
          ctx.stroke();

          // Yellow box
          ctx.fillStyle = '#eab308';
          ctx.strokeStyle = '#854d0e';
          ctx.lineWidth = 1;
          ctx.fillRect(sx - 18, FLOOR_Y - 14, 18, 12);
          ctx.strokeRect(sx - 18, FLOOR_Y - 14, 18, 12);
          ctx.fillStyle = '#1e3a8a';
          ctx.fillRect(sx - 18, FLOOR_Y - 10, 18, 3);

          // Individual crayons rolling on the floor
          const crayonColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
          crayonColors.forEach((col, idx) => {
            ctx.fillStyle = col;
            ctx.fillRect(sx + 2 + idx * 7, FLOOR_Y - 4, 10, 3);
            ctx.beginPath();
            ctx.moveTo(sx + 12 + idx * 7, FLOOR_Y - 4);
            ctx.lineTo(sx + 14 + idx * 7, FLOOR_Y - 2.5);
            ctx.lineTo(sx + 12 + idx * 7, FLOOR_Y - 1);
            ctx.fill();
          });
          break;
        }

        case 'paper_airplane': {
          // White paper glider resting nose-down
          ctx.fillStyle = '#f8fafc';
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx - 12, FLOOR_Y - 10);
          ctx.lineTo(sx + 8, FLOOR_Y - 2);
          ctx.lineTo(sx - 4, FLOOR_Y - 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(sx - 10, FLOOR_Y - 6);
          ctx.lineTo(sx + 8, FLOOR_Y - 2);
          ctx.lineTo(sx - 4, FLOOR_Y - 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        }

        case 'toy_car': {
          // Wooden retro red toy racecar
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.roundRect(sx - 14, FLOOR_Y - 12, 28, 9, [4, 4, 2, 2]);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 8, 4, 0, Math.PI * 2);
          ctx.fill();
          // Black wooden wheels
          ctx.fillStyle = '#18181b';
          ctx.beginPath();
          ctx.arc(sx - 8, FLOOR_Y - 3, 4, 0, Math.PI * 2);
          ctx.arc(sx + 8, FLOOR_Y - 3, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'scattered_blocks': {
          // Scattered wooden alphabet blocks
          const blocks = [
            { x: sx - 10, y: FLOOR_Y - 14, col: '#ef4444', letter: 'A' },
            { x: sx + 4, y: FLOOR_Y - 12, col: '#3b82f6', letter: 'B' },
            { x: sx - 2, y: FLOOR_Y - 24, col: '#eab308', letter: 'C' }
          ];
          blocks.forEach(b => {
            ctx.fillStyle = b.col;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.fillRect(b.x, b.y, 12, 12);
            ctx.strokeRect(b.x, b.y, 12, 12);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px sans-serif';
            ctx.fillText(b.letter, b.x + 2, b.y + 9);
          });
          break;
        }

        case 'cardboard_box_floor': {
          // Open cardboard box on the floor with plushies peeking out
          ctx.fillStyle = '#926038';
          ctx.strokeStyle = '#5f3c1f';
          ctx.lineWidth = 1.4;
          ctx.fillRect(sx - 20, FLOOR_Y - 26, 40, 26);
          ctx.strokeRect(sx - 20, FLOOR_Y - 26, 40, 26);
          // Open flaps
          ctx.beginPath();
          ctx.moveTo(sx - 20, FLOOR_Y - 26);
          ctx.lineTo(sx - 28, FLOOR_Y - 34);
          ctx.lineTo(sx - 10, FLOOR_Y - 26);
          ctx.moveTo(sx + 20, FLOOR_Y - 26);
          ctx.lineTo(sx + 28, FLOOR_Y - 34);
          ctx.lineTo(sx + 10, FLOOR_Y - 26);
          ctx.stroke();
          // Cute teddy bear head inside
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 28, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.arc(sx - 6, FLOOR_Y - 34, 3.5, 0, Math.PI * 2);
          ctx.arc(sx + 6, FLOOR_Y - 34, 3.5, 0, Math.PI * 2);
          ctx.fill();
          // Label tape
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 12, FLOOR_Y - 16, 24, 7);
          ctx.fillStyle = '#1e1b4b';
          ctx.font = '6px sans-serif';
          ctx.fillText('BRINQUEDOS', sx - 11, FLOOR_Y - 11);
          break;
        }

        case 'dinosaur_felt': {
          // Little green felt dinosaur toy
          ctx.fillStyle = '#16a34a';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 10, 14, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          // Neck & head
          ctx.beginPath();
          ctx.moveTo(sx + 8, FLOOR_Y - 12);
          ctx.lineTo(sx + 14, FLOOR_Y - 24);
          ctx.arc(sx + 16, FLOOR_Y - 24, 4, 0, Math.PI * 2);
          ctx.lineTo(sx + 10, FLOOR_Y - 8);
          ctx.fill();
          // Yellow back spikes
          ctx.fillStyle = '#facc15';
          for (let s = 0; s < 4; s++) {
            ctx.beginPath();
            ctx.moveTo(sx - 8 + s * 5, FLOOR_Y - 16);
            ctx.lineTo(sx - 6 + s * 5, FLOOR_Y - 21);
            ctx.lineTo(sx - 4 + s * 5, FLOOR_Y - 16);
            ctx.fill();
          }
          break;
        }

        case 'slinky': {
          // Rainbow coil slinky stretched on floor
          const slinkyColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6'];
          ctx.lineWidth = 1.8;
          for (let i = 0; i < 10; i++) {
            ctx.strokeStyle = slinkyColors[i % slinkyColors.length];
            ctx.beginPath();
            ctx.ellipse(sx - 18 + i * 4, FLOOR_Y - 9, 3.5, 9, 0.2, 0, Math.PI * 2);
            ctx.stroke();
          }
          break;
        }

        case 'wooden_spinning_top': {
          // Colorful spinning top with wound string
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.moveTo(sx - 9, FLOOR_Y - 18);
          ctx.lineTo(sx + 9, FLOOR_Y - 18);
          ctx.lineTo(sx, FLOOR_Y - 3);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(sx - 9, FLOOR_Y - 18, 18, 4);
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx - 2, FLOOR_Y - 24, 4, 6);
          break;
        }

        case 'plush_bunny': {
          // Soft plush bunny with floppy ears
          ctx.fillStyle = '#f1f5f9';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 10, 11, 9, 0, 0, Math.PI * 2);
          ctx.arc(sx + 8, FLOOR_Y - 18, 7, 0, Math.PI * 2);
          ctx.fill();
          // Long floppy ear
          ctx.fillStyle = '#fed7aa';
          ctx.beginPath();
          ctx.ellipse(sx + 4, FLOOR_Y - 27, 3, 8, -0.3, 0, Math.PI * 2);
          ctx.fill();
          // Eye & pink nose
          ctx.fillStyle = '#db2777';
          ctx.beginPath();
          ctx.arc(sx + 14, FLOOR_Y - 18, 1.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'puzzle_pieces': {
          // Scattered jigsaw puzzle pieces
          const pCols = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'];
          pCols.forEach((col, i) => {
            ctx.fillStyle = col;
            ctx.fillRect(sx - 12 + i * 8, FLOOR_Y - 5, 6, 5);
            ctx.beginPath();
            ctx.arc(sx - 9 + i * 8, FLOOR_Y - 5, 2, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }

        case 'toy_train': {
          // Classic wooden toy locomotive
          ctx.fillStyle = '#1d4ed8';
          ctx.fillRect(sx - 14, FLOOR_Y - 16, 22, 12);
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(sx + 8, FLOOR_Y - 22, 10, 18);
          // Smokestack
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx - 10, FLOOR_Y - 22, 5, 7);
          // Wheels
          ctx.fillStyle = '#18181b';
          ctx.beginPath();
          ctx.arc(sx - 6, FLOOR_Y - 4, 4, 0, Math.PI * 2);
          ctx.arc(sx + 4, FLOOR_Y - 4, 4, 0, Math.PI * 2);
          ctx.arc(sx + 13, FLOOR_Y - 4, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'open_story_book': {
          // Open picture book on floor with ribbon bookmark
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.moveTo(sx, FLOOR_Y - 4);
          ctx.quadraticCurveTo(sx - 12, FLOOR_Y - 12, sx - 22, FLOOR_Y - 4);
          ctx.lineTo(sx - 22, FLOOR_Y - 1);
          ctx.lineTo(sx, FLOOR_Y - 1);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(sx, FLOOR_Y - 4);
          ctx.quadraticCurveTo(sx + 12, FLOOR_Y - 12, sx + 22, FLOOR_Y - 4);
          ctx.lineTo(sx + 22, FLOOR_Y - 1);
          ctx.lineTo(sx, FLOOR_Y - 1);
          ctx.fill();
          // Red bookmark ribbon
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx, FLOOR_Y - 4);
          ctx.quadraticCurveTo(sx + 4, FLOOR_Y + 4, sx + 10, FLOOR_Y + 6);
          ctx.stroke();
          break;
        }

        case 'spilled_marbles': {
          // Translucent glass marbles reflecting light
          const mColors = ['#06b6d4', '#f43f5e', '#a855f7', '#22c55e', '#eab308'];
          mColors.forEach((mc, i) => {
            const mx = sx - 15 + i * 8;
            const my = FLOOR_Y - 4;
            ctx.fillStyle = mc;
            ctx.beginPath();
            ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
            ctx.fill();
            // Highlight
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(mx - 1, my - 1, 1, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }

        case 'toy_soldier': {
          // Tin guard with red coat and tall black bearskin hat
          ctx.fillStyle = '#1e1b4b'; // tall hat
          ctx.fillRect(sx - 3, FLOOR_Y - 32, 6, 12);
          ctx.fillStyle = '#fed7aa'; // face
          ctx.fillRect(sx - 3, FLOOR_Y - 20, 6, 5);
          ctx.fillStyle = '#dc2626'; // coat
          ctx.fillRect(sx - 4, FLOOR_Y - 15, 8, 8);
          ctx.fillStyle = '#facc15'; // belt
          ctx.fillRect(sx - 4, FLOOR_Y - 11, 8, 2);
          ctx.fillStyle = '#1e293b'; // boots
          ctx.fillRect(sx - 3, FLOOR_Y - 7, 6, 7);
          break;
        }

        case 'retro_robot': {
          // Mint green tin robot with winding key & antenna
          ctx.fillStyle = '#0d9488';
          ctx.fillRect(sx - 7, FLOOR_Y - 24, 14, 12); // head
          ctx.fillRect(sx - 9, FLOOR_Y - 12, 18, 10); // body
          // Yellow dial
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 4, FLOOR_Y - 10, 8, 6);
          // Antenna with red bead
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(sx, FLOOR_Y - 24);
          ctx.lineTo(sx, FLOOR_Y - 30);
          ctx.stroke();
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 31, 2.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'jack_in_box': {
          // Jack in the box clown
          ctx.fillStyle = '#8b5cf6';
          ctx.fillRect(sx - 12, FLOOR_Y - 20, 24, 20);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(sx - 12, FLOOR_Y - 20, 24, 20);
          // Spring
          ctx.strokeStyle = '#94a3b8';
          ctx.beginPath();
          for (let s = 0; s < 4; s++) {
            ctx.lineTo(sx + (s % 2 === 0 ? -6 : 6), FLOOR_Y - 20 - s * 5);
          }
          ctx.stroke();
          // Clown head
          ctx.fillStyle = '#fdf4ff';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 44, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 43, 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'rattle': {
          // Pastel baby rattle
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 18, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 18, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx - 2, FLOOR_Y - 10, 4, 10);
          break;
        }

        case 'windup_mouse': {
          // Tiny grey clockwork mouse with brass winding key
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 6, 9, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          // Round ear
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.arc(sx - 4, FLOOR_Y - 10, 3, 0, Math.PI * 2);
          ctx.fill();
          // Winding key
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(sx + 6, FLOOR_Y - 11, 3.5, 0, Math.PI * 2);
          ctx.moveTo(sx + 6, FLOOR_Y - 8);
          ctx.lineTo(sx + 6, FLOOR_Y - 5);
          ctx.stroke();
          break;
        }

        case 'cradle': {
          // Antique wooden rocking cradle
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx - 24, FLOOR_Y - 35, 48, 26);
          // Rocker curved base
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 5, 28, 0.2, Math.PI - 0.2);
          ctx.stroke();
          // Pillow & blanket
          ctx.fillStyle = '#fce7f3';
          ctx.fillRect(sx - 20, FLOOR_Y - 32, 40, 10);
          break;
        }

        case 'giant_spool': {
          // Giant spool of thread
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 14, FLOOR_Y - 24, 28, 4);
          ctx.fillRect(sx - 14, FLOOR_Y - 4, 28, 4);
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(sx - 10, FLOOR_Y - 20, 20, 16);
          break;
        }

        case 'wooden_horse': {
          // Rocking horse on floor
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 18, 16, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          // Horse head
          ctx.beginPath();
          ctx.moveTo(sx + 10, FLOOR_Y - 20);
          ctx.lineTo(sx + 18, FLOOR_Y - 36);
          ctx.lineTo(sx + 24, FLOOR_Y - 32);
          ctx.lineTo(sx + 16, FLOOR_Y - 16);
          ctx.closePath();
          ctx.fill();
          // Rocker runners
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 3, 26, 0.25, Math.PI - 0.25);
          ctx.stroke();
          break;
        }

        default:
          break;
      }

      ctx.restore();
    });
  }

  // --- PLATFORM DRAWING WITH DEDICATED THEMES ---
  function drawPlatforms(camX) {
    ctx.save();
    const activePlatforms = isPhase3 ? phase3Platforms : platforms;
    activePlatforms.forEach((p, idx) => {
      const sx = p.x - camX;
      if (sx + p.w < -80 || sx > canvas.width + 80) return;

      switch (p.style) {
        case 'giant_bear': {
          // 1. Cabeça do Urso de Pelúcia Gigante
          // Rounded plush head
          const bearGrad = ctx.createRadialGradient(
            sx + p.w / 2, p.y + 35, 10,
            sx + p.w / 2, p.y + 35, 65
          );
          bearGrad.addColorStop(0, '#d97706');
          bearGrad.addColorStop(0.7, '#b45309');
          bearGrad.addColorStop(1, '#78350f');
          ctx.fillStyle = bearGrad;
          ctx.beginPath();
          ctx.roundRect(sx, p.y, p.w, p.h + 20, [30, 30, 8, 8]);
          ctx.fill();

          // Felt ear with cross-stitches on left
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.arc(sx + 18, p.y - 6, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fde68a';
          ctx.beginPath();
          ctx.arc(sx + 18, p.y - 6, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx + 14, p.y - 9); ctx.lineTo(sx + 22, p.y - 3);
          ctx.moveTo(sx + 22, p.y - 9); ctx.lineTo(sx + 14, p.y - 3);
          ctx.stroke();

          // Felt ear on right
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.arc(sx + p.w - 18, p.y - 6, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fde68a';
          ctx.beginPath();
          ctx.arc(sx + p.w - 18, p.y - 6, 9, 0, Math.PI * 2);
          ctx.fill();

          // Big black button eye visible on side
          ctx.fillStyle = '#18181b';
          ctx.beginPath();
          ctx.arc(sx + 35, p.y + 22, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(sx + 33, p.y + 20, 2, 0, Math.PI * 2);
          ctx.fill();

          // Soft embroidered muzzle
          ctx.fillStyle = '#fef3c7';
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y + 36, 22, 14, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 32, 5, 0, Math.PI * 2);
          ctx.fill();

          // Red satin ribbon bow
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + p.h + 8, 8, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'open_books': {
          // 2. Pilha de Livros Ilustrados
          // Book 1 (bottom green book)
          ctx.fillStyle = '#065f46';
          ctx.fillRect(sx - 4, p.y + 36, p.w + 8, p.h - 36);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 2, p.y + 38, 5, p.h - 40);

          // Book 2 (middle crimson leather book)
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(sx + 4, p.y + 18, p.w - 2, 20);
          ctx.fillStyle = '#fef9c3';
          ctx.fillRect(sx + 6, p.y + 20, p.w - 12, 16);
          ctx.fillStyle = '#7f1d1d';
          ctx.fillRect(sx + 2, p.y + 18, 8, 20); // spine

          // Book 3 (top sapphire fairy tale book)
          ctx.fillStyle = '#1e40af';
          ctx.beginPath();
          ctx.roundRect(sx, p.y, p.w, 18, [4, 4, 0, 0]);
          ctx.fill();
          // Gold foil title & stars on cover
          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 9px Georgia, serif';
          ctx.fillText('✦ CONTOS DE NINAR ✦', sx + 8, p.y + 12);
          // Silk bookmark ribbon hanging down
          ctx.fillStyle = '#e11d48';
          ctx.fillRect(sx + p.w - 24, p.y + 16, 6, 24);
          break;
        }

        case 'vanity_table': {
          // 3. Penteadeira com Espelho Encantado
          // Wooden carved table base
          ctx.fillStyle = '#581c87';
          ctx.fillRect(sx, p.y + 20, p.w, p.h - 20);
          ctx.fillStyle = '#6b21a8';
          ctx.fillRect(sx - 4, p.y + 12, p.w + 8, 10);

          // Ornate Oval Mirror standing up at the back
          ctx.fillStyle = '#e9d5ff';
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y - 14, 28, 32, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Magical reflection inside mirror
          const mirrorGrad = ctx.createLinearGradient(sx + 20, p.y - 40, sx + p.w - 20, p.y + 10);
          mirrorGrad.addColorStop(0, 'rgba(192, 132, 252, 0.4)');
          mirrorGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
          mirrorGrad.addColorStop(1, 'rgba(6, 182, 212, 0.3)');
          ctx.fillStyle = mirrorGrad;
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y - 14, 24, 28, 0, 0, Math.PI * 2);
          ctx.fill();

          // Little perfume bottles on table top
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(sx + 8, p.y + 2, 7, 10);
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(sx + p.w - 16, p.y + 2, 8, 10);

          // Pearl necklace draped over drawer
          ctx.fillStyle = '#f8fafc';
          for (let b = 0; b < 7; b++) {
            ctx.beginPath();
            ctx.arc(sx + 25 + b * 5, p.y + 26 + Math.sin(b * 0.5) * 6, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case 'cardboard_box': {
          // 4. Caixa de Papelão Aberta
          ctx.fillStyle = '#a16207';
          ctx.fillRect(sx, p.y + 10, p.w, p.h - 10);
          ctx.strokeStyle = '#713f12';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx, p.y + 10, p.w, p.h - 10);

          // Cardboard flaps open forming the top walking surface
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.moveTo(sx - 8, p.y);
          ctx.lineTo(sx + p.w / 2, p.y + 10);
          ctx.lineTo(sx + p.w + 8, p.y);
          ctx.lineTo(sx + p.w, p.y + 12);
          ctx.lineTo(sx, p.y + 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // "FRÁGIL" tape and stickers
          ctx.fillStyle = '#fee2e2';
          ctx.fillRect(sx + 14, p.y + 28, 42, 14);
          ctx.fillStyle = '#dc2626';
          ctx.font = 'bold 8px sans-serif';
          ctx.fillText('FRÁGIL ⬆', sx + 18, p.y + 38);

          // Plush bear arm peeking out
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.ellipse(sx + p.w - 18, p.y + 6, 9, 5, -0.4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'messy_blocks': {
          // 5. Pilha Desordenada de Blocos ABC
          // Jumbled stack of giant wooden toy blocks
          const bW = 36;
          const bH = 34;

          // Block 1: Red 'A'
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(sx + 4, p.y + 24, bW, bH);
          ctx.strokeStyle = '#b91c1c';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx + 4, p.y + 24, bW, bH);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText('A', sx + 14, p.y + 48);

          // Block 2: Blue 'B'
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(sx + 42, p.y + 28, bW, bH);
          ctx.strokeStyle = '#1d4ed8';
          ctx.strokeRect(sx + 42, p.y + 28, bW, bH);
          ctx.fillStyle = '#ffffff';
          ctx.fillText('B', sx + 52, p.y + 52);

          // Block 3: Yellow 'C'
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx + 80, p.y + 24, bW - 4, bH);
          ctx.strokeStyle = '#a16207';
          ctx.strokeRect(sx + 80, p.y + 24, bW - 4, bH);
          ctx.fillStyle = '#1e1b4b';
          ctx.fillText('C', sx + 88, p.y + 48);

          // Top walking platform block
          ctx.fillStyle = '#10b981';
          ctx.fillRect(sx + 16, p.y, p.w - 32, 24);
          ctx.strokeStyle = '#047857';
          ctx.strokeRect(sx + 16, p.y, p.w - 32, 24);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('★ 1 2 3 ★', sx + 24, p.y + 16);
          break;
        }

        case 'toy_drum': {
          // 6. Tamborito de Marcha
          // Drum body
          ctx.fillStyle = '#b91c1c';
          ctx.fillRect(sx, p.y + 14, p.w, p.h - 14);

          // Zigzag tension cords
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let z = 0; z < p.w; z += 18) {
            ctx.lineTo(sx + z, p.y + 16 + ((z / 18) % 2 === 0 ? 0 : p.h - 30));
          }
          ctx.stroke();

          // Brass bottom rim
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(sx - 2, p.y + p.h - 12, p.w + 4, 10);

          // Top white drumhead (landing surface)
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(sx, p.y + 4, p.w, 10);
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(sx - 4, p.y, p.w + 8, 6);

          // Crossed wooden drumsticks
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(sx + 12, p.y + 2); ctx.lineTo(sx + p.w - 12, p.y + 10);
          ctx.moveTo(sx + 12, p.y + 10); ctx.lineTo(sx + p.w - 12, p.y + 2);
          ctx.stroke();
          break;
        }

        case 'satin_cushion': {
          // 7. Almofadão de Veludo com Borlas
          // Plush tufted velvet cushion
          const cushGrad = ctx.createRadialGradient(
            sx + p.w / 2, p.y + 16, 12,
            sx + p.w / 2, p.y + 16, p.w / 2
          );
          cushGrad.addColorStop(0, '#c026d3');
          cushGrad.addColorStop(0.7, '#86198f');
          cushGrad.addColorStop(1, '#4a044e');
          ctx.fillStyle = cushGrad;
          ctx.beginPath();
          ctx.roundRect(sx, p.y, p.w, p.h, 16);
          ctx.fill();

          // Golden tufted buttons
          ctx.fillStyle = '#facc15';
          const btnX = [sx + 24, sx + p.w / 2, sx + p.w - 24];
          btnX.forEach(bx => {
            ctx.beginPath();
            ctx.arc(bx, p.y + 18, 3.5, 0, Math.PI * 2);
            ctx.fill();
            // Creases radiating from button
            ctx.strokeStyle = 'rgba(74, 4, 78, 0.4)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(bx, p.y + 18); ctx.lineTo(bx - 8, p.y + 6);
            ctx.moveTo(bx, p.y + 18); ctx.lineTo(bx + 8, p.y + 6);
            ctx.stroke();
          });

          // Gold corner tassels
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(sx + 4, p.y + 4, 4, 0, Math.PI * 2);
          ctx.arc(sx + p.w - 4, p.y + 4, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'stepped_dresser': {
          // 8. Gavetas da Cômoda como Degraus
          // Dresser frame
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx, p.y, p.w, p.h);

          // Top open drawer (highest step)
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 6, p.y, p.w + 12, 18);
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 9, 3, 0, Math.PI * 2);
          ctx.fill();

          // Second drawer pulled out forward
          ctx.fillStyle = '#5f2709';
          ctx.fillRect(sx + 8, p.y + 24, p.w - 8, 22);
          // Colorful socks hanging from drawer
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(sx + 22, p.y + 36, 12, 14);
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(sx + 40, p.y + 34, 10, 18);
          break;
        }

        case 'music_box': {
          // 9. Caixa de Música da Bailarina
          // Mahogany box
          ctx.fillStyle = '#422006';
          ctx.fillRect(sx, p.y + 16, p.w, p.h - 16);
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx, p.y + 16, p.w, p.h - 16);

          // Golden musical clef & notes carved on front
          ctx.fillStyle = '#facc15';
          ctx.font = '14px sans-serif';
          ctx.fillText('♫ 𝄞 ♬', sx + p.w / 2 - 20, p.y + 44);

          // Top brass platform
          ctx.fillStyle = '#d97706';
          ctx.fillRect(sx - 2, p.y + 8, p.w + 4, 8);

          // Rotating gold key on the side
          const keyAngle = tick * 0.05;
          ctx.save();
          ctx.translate(sx - 8, p.y + 32);
          ctx.rotate(keyAngle);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, -6, 5, 0, Math.PI * 2);
          ctx.moveTo(0, -1); ctx.lineTo(0, 8);
          ctx.stroke();
          ctx.restore();

          // Spinning miniature porcelain ballerina
          const bPhase = Math.sin(tick * 0.08);
          ctx.fillStyle = '#fce7f3';
          ctx.beginPath();
          // Tutu
          ctx.ellipse(sx + p.w / 2, p.y + 2, 12 * Math.abs(bPhase) + 4, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          // Ballerina torso & head
          ctx.fillStyle = '#fdf2f8';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y - 10, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'block_castle': {
          // 10. Castelinho de Blocos
          ctx.fillStyle = '#475569';
          ctx.fillRect(sx, p.y + 12, p.w, p.h - 12);

          // Turret battlements along top
          ctx.fillStyle = '#334155';
          const crenWidth = 14;
          for (let cx = 0; cx < p.w; cx += crenWidth * 2) {
            ctx.fillRect(sx + cx, p.y, crenWidth, 14);
          }

          // Arched doorway
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + p.h - 16, 12, Math.PI, 0);
          ctx.rect(sx + p.w / 2 - 12, p.y + p.h - 16, 24, 16);
          ctx.fill();

          // Waving blue banner flag
          ctx.fillStyle = '#0284c7';
          const flagWave = Math.sin(tick * 0.08) * 3;
          ctx.beginPath();
          ctx.moveTo(sx + 14, p.y - 16);
          ctx.quadraticCurveTo(sx + 26, p.y - 16 + flagWave, sx + 34, p.y - 12);
          ctx.lineTo(sx + 14, p.y - 6);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx + 14, p.y + 4); ctx.lineTo(sx + 14, p.y - 18);
          ctx.stroke();
          break;
        }

        case 'train_trestle': {
          // 11. Pista Elevada do Trenzinho
          // Wooden railway trestle bents
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(sx + 16, p.y + 12); ctx.lineTo(sx + 16, p.y + p.h);
          ctx.moveTo(sx + p.w - 16, p.y + 12); ctx.lineTo(sx + p.w - 16, p.y + p.h);
          // Diagonal cross braces
          ctx.moveTo(sx + 16, p.y + 20); ctx.lineTo(sx + p.w - 16, p.y + 50);
          ctx.moveTo(sx + p.w - 16, p.y + 20); ctx.lineTo(sx + 16, p.y + 50);
          ctx.stroke();

          // Wooden rails & ties
          ctx.fillStyle = '#92400e';
          for (let rx = 0; rx < p.w; rx += 14) {
            ctx.fillRect(sx + rx, p.y + 4, 10, 8);
          }
          // Steel track rails
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(sx, p.y, p.w, 4);

          // Parked colorful toy locomotive
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(sx + p.w / 2 - 14, p.y - 14, 28, 14);
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx + p.w / 2 - 8, p.y - 20, 6, 6);
          break;
        }

        case 'wall_shelf': {
          // 12. Prateleira de Brinquedos da Parede
          // Heavy pine shelf
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx, p.y, p.w, 14);
          ctx.fillStyle = '#92400e';
          ctx.fillRect(sx, p.y + 14, p.w, p.h - 14);

          // Wrought iron scrollwork brackets
          ctx.strokeStyle = '#18181b';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(sx + 14, p.y + 14);
          ctx.quadraticCurveTo(sx + 24, p.y + 36, sx + 14, p.y + 50);
          ctx.moveTo(sx + p.w - 14, p.y + 14);
          ctx.quadraticCurveTo(sx + p.w - 24, p.y + 36, sx + p.w - 14, p.y + 50);
          ctx.stroke();

          // Decorative items on shelf
          // Snowglobe
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.strokeStyle = '#93c5fd';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(sx + 28, p.y - 12, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Alarm clock
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(sx + p.w - 26, p.y - 9, 8, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'mushroom_lamp': {
          // 13. Abajur Cogumelo Brilhante
          // Glowing polka-dot mushroom cap
          const lampGrad = ctx.createRadialGradient(
            sx + p.w / 2, p.y + 10, 10,
            sx + p.w / 2, p.y + 10, p.w / 2
          );
          lampGrad.addColorStop(0, '#fda4af');
          lampGrad.addColorStop(0.5, '#f43f5e');
          lampGrad.addColorStop(1, '#9f1239');
          ctx.fillStyle = lampGrad;
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y + 12, p.w / 2, 16, 0, 0, Math.PI * 2);
          ctx.fill();

          // White polka dots
          ctx.fillStyle = '#fff1f2';
          const dots = [
            { x: sx + 22, y: p.y + 8, r: 4 },
            { x: sx + p.w / 2, y: p.y + 6, r: 5 },
            { x: sx + p.w - 24, y: p.y + 9, r: 4 },
            { x: sx + 40, y: p.y + 16, r: 3.5 }
          ];
          dots.forEach(d => {
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
          });

          // Soft light bulb glow beneath cap
          ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y + 18, p.w / 2 - 8, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Mushroom stalk
          ctx.fillStyle = '#fdf4ff';
          ctx.fillRect(sx + p.w / 2 - 12, p.y + 20, 24, p.h - 20);
          break;
        }

        case 'dollhouse_roof': {
          // 14. Telhado da Casa de Bonecas
          // Scalloped shingle roof
          ctx.fillStyle = '#be123c';
          ctx.fillRect(sx, p.y, p.w, p.h);

          // Miniature scalloped shingles
          ctx.fillStyle = '#9f1239';
          for (let sy = p.y + 8; sy < p.y + p.h; sy += 12) {
            for (let shx = sx; shx < sx + p.w; shx += 16) {
              ctx.beginPath();
              ctx.arc(shx + 8, sy, 8, 0, Math.PI);
              ctx.fill();
            }
          }

          // Miniature brick chimney
          ctx.fillStyle = '#b91c1c';
          ctx.fillRect(sx + p.w - 24, p.y - 18, 16, 24);
          ctx.fillStyle = '#450a0a';
          ctx.fillRect(sx + p.w - 26, p.y - 20, 20, 4);

          // Dormer window
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(sx + 30, p.y + 16, 8, Math.PI, 0);
          ctx.rect(sx + 22, p.y + 16, 16, 12);
          ctx.fill();
          break;
        }

        case 'wardrobe_portal': {
          // Topo do Guarda-Roupa Clássico
          ctx.fillStyle = '#3b1808';
          ctx.fillRect(sx, p.y, p.w, p.h);
          ctx.fillStyle = '#59250b';
          ctx.fillRect(sx - 8, p.y - 4, p.w + 16, 10);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 4, p.y + 6, p.w + 8, 8);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2.4;
          ctx.strokeRect(sx + 10, p.y + 20, p.w - 20, 28);
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 13px Palatino, Georgia, serif';
          ctx.fillText('✧  O  PORTAL  DOS  SONHOS  ✧', sx + p.w / 2 - 105, p.y + 38);
          break;
        }

        case 'spinning_globe': {
          // 5/12 Globo Terrestre Ilustrado
          ctx.fillStyle = '#3f1d0b';
          ctx.fillRect(sx + 10, p.y + p.h - 18, p.w - 20, 18);
          ctx.fillStyle = '#5c2b10';
          ctx.fillRect(sx + 20, p.y + p.h - 32, p.w - 40, 14);

          // Brass semi-meridian arch
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 44, 34, 0.4, Math.PI - 0.4);
          ctx.stroke();

          // Globe sphere
          const gx = sx + p.w / 2;
          const gy = p.y + 42;
          const globeGrad = ctx.createRadialGradient(gx - 8, gy - 8, 4, gx, gy, 30);
          globeGrad.addColorStop(0, '#38bdf8');
          globeGrad.addColorStop(0.7, '#0284c7');
          globeGrad.addColorStop(1, '#0369a1');
          ctx.fillStyle = globeGrad;
          ctx.beginPath();
          ctx.arc(gx, gy, 28, 0, Math.PI * 2);
          ctx.fill();

          // Green continents
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.ellipse(gx - 8, gy - 6, 10, 7, 0.3, 0, Math.PI * 2);
          ctx.ellipse(gx + 10, gy + 8, 8, 5, -0.2, 0, Math.PI * 2);
          ctx.fill();

          // Top platform brass bar
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx + 4, p.y, p.w - 8, 12);
          ctx.fillStyle = '#ca8a04';
          ctx.fillRect(sx, p.y + 12, p.w, 4);
          break;
        }

        case 'kite_frame': {
          // 6/12 Pipa Encantada de Bambu
          ctx.fillStyle = '#fde047';
          ctx.fillRect(sx, p.y, p.w, 10);

          const kx = sx + p.w / 2;
          const ky = p.y + 24;
          ctx.save();
          // 4 vivid segments
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.moveTo(kx, ky - 18);
          ctx.lineTo(kx + p.w / 2 - 6, ky);
          ctx.lineTo(kx, ky);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.moveTo(kx, ky - 18);
          ctx.lineTo(kx - p.w / 2 + 6, ky);
          ctx.lineTo(kx, ky);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.moveTo(kx, ky);
          ctx.lineTo(kx - p.w / 2 + 6, ky);
          ctx.lineTo(kx, ky + 32);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.moveTo(kx, ky);
          ctx.lineTo(kx + p.w / 2 - 6, ky);
          ctx.lineTo(kx, ky + 32);
          ctx.closePath();
          ctx.fill();

          // Bamboo crossed struts
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(kx, ky - 18);
          ctx.lineTo(kx, ky + 32);
          ctx.moveTo(kx - p.w / 2 + 6, ky);
          ctx.lineTo(kx + p.w / 2 - 6, ky);
          ctx.stroke();

          // Trailing ribbon tail
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          const sway = Math.sin(tick * 0.12) * 8;
          ctx.moveTo(kx, ky + 32);
          ctx.quadraticCurveTo(kx + sway, ky + 55, kx - sway * 0.5, ky + 80);
          ctx.stroke();

          ctx.fillStyle = '#fb923c';
          ctx.fillRect(kx + sway * 0.5 - 4, ky + 46, 8, 4);
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(kx - 4, ky + 66, 8, 4);
          ctx.restore();
          break;
        }

        case 'floating_books': {
          // 7/12 Livro de Gravuras Flutuante
          ctx.fillStyle = '#831843';
          ctx.beginPath();
          ctx.roundRect(sx, p.y, p.w, 14, [4, 4, 2, 2]);
          ctx.fill();

          // Gilded page block
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx + 6, p.y + 3, p.w - 12, 8);

          // Open parchment pages
          ctx.fillStyle = '#fdf4ff';
          ctx.fillRect(sx + 8, p.y + 4, (p.w - 20) / 2, 6);
          ctx.fillRect(sx + p.w / 2 + 2, p.y + 4, (p.w - 20) / 2, 6);

          // Spine ribbing
          ctx.fillStyle = '#500724';
          ctx.fillRect(sx + p.w / 2 - 3, p.y, 6, 14);

          // Trailing golden bookmark ribbon
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(sx + p.w / 2, p.y + 12);
          ctx.quadraticCurveTo(sx + p.w / 2 + 8, p.y + 35, sx + p.w / 2 - 4, p.y + 50);
          ctx.stroke();

          // Floating fairy runes
          ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
          ctx.font = '10px sans-serif';
          ctx.fillText('✧', sx + 12, p.y - 6);
          ctx.fillText('✦', sx + p.w - 18, p.y - 8);
          break;
        }

        case 'chandelier_crystals': {
          // 8/12 Lustre de Cristais
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx, p.y, p.w, 12);
          ctx.fillStyle = '#ca8a04';
          ctx.fillRect(sx, p.y + 12, p.w, 5);

          // Hanging multifaceted crystals
          for (let cx = sx + 8; cx <= sx + p.w - 8; cx += 13) {
            ctx.fillStyle = 'rgba(224, 242, 254, 0.88)';
            ctx.strokeStyle = '#bae6fd';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx, p.y + 17);
            ctx.lineTo(cx + 4, p.y + 28);
            ctx.lineTo(cx, p.y + 36);
            ctx.lineTo(cx - 4, p.y + 28);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          // Candle flames
          const flame = Math.sin(tick * 0.25) * 2;
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.ellipse(sx + 14, p.y - 6, 3, 5 + flame, 0, 0, Math.PI * 2);
          ctx.ellipse(sx + p.w - 14, p.y - 6, 3, 5 + flame, 0, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'curtain_rod': {
          // 9/12 Varão de Cortina Estrelada
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx, p.y, p.w, 10);
          ctx.fillStyle = '#b45309';
          ctx.fillRect(sx, p.y + 10, p.w, 4);

          // Golden finials
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(sx - 4, p.y + 5, 7, 0, Math.PI * 2);
          ctx.arc(sx + p.w + 4, p.y + 5, 7, 0, Math.PI * 2);
          ctx.fill();

          // Velvet curtain swag
          ctx.fillStyle = '#1e1b4b';
          ctx.beginPath();
          ctx.moveTo(sx + 4, p.y + 14);
          ctx.quadraticCurveTo(sx + p.w / 2, p.y + 44, sx + p.w - 4, p.y + 14);
          ctx.lineTo(sx + p.w - 4, p.y + 56);
          ctx.quadraticCurveTo(sx + p.w / 2, p.y + 76, sx + 4, p.y + 56);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#fde047';
          ctx.font = '10px sans-serif';
          ctx.fillText('★', sx + p.w / 2 - 5, p.y + 40);
          break;
        }

        case 'cuckoo_clock': {
          // 10/12 Relógio Cuco Vintage
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx, p.y, p.w, 12);
          ctx.fillStyle = '#92400e';
          ctx.fillRect(sx + 6, p.y + 12, p.w - 12, p.h - 12);

          // Clock face
          ctx.fillStyle = '#fef3c7';
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 40, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Hands
          ctx.strokeStyle = '#18181b';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(sx + p.w / 2, p.y + 40);
          ctx.lineTo(sx + p.w / 2, p.y + 29);
          ctx.moveTo(sx + p.w / 2, p.y + 40);
          ctx.lineTo(sx + p.w / 2 + 7, p.y + 40);
          ctx.stroke();

          // Bird door
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx + p.w / 2 - 8, p.y + 14, 16, 11);
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 19, 4, 0, Math.PI * 2);
          ctx.fill();

          // Swinging pendulum
          const pendAngle = Math.sin(tick * 0.08) * 0.28;
          const pendLen = 30;
          const px = sx + p.w / 2 + Math.sin(pendAngle) * pendLen;
          const py = p.y + 62 + Math.cos(pendAngle) * pendLen;
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(sx + p.w / 2, p.y + 62);
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(px, py, 5.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'wardrobe_ledge': {
          // 11/12 Beiral do Grande Guarda-Roupa (Antes do Clímax)
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx, p.y, p.w, p.h);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 4, p.y, p.w + 8, 10);

          // Brass corner reinforcements
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx, p.y + 10, 8, 8);
          ctx.fillRect(sx + p.w - 8, p.y + 10, 8, 8);

          // Climax warning text
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚡ SALTO FINAL ➔', sx + p.w / 2, p.y - 12);
          break;
        }

        case 'grand_portal_pedestal': {
          // 12/12 O Portal dos Sonhos (O Clímax Alcançado!)
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(sx, p.y, p.w, p.h);

          // Upper golden terrace
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx - 8, p.y - 4, p.w + 16, 12);
          ctx.fillStyle = '#ca8a04';
          ctx.fillRect(sx - 4, p.y + 8, p.w + 8, 8);

          // Gilded Mana Runes along the terrace
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx + 12, p.y + 22, p.w - 24, 30);

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 13px Palatino, Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillText('✧   O   GRANDE   PORTAL   DOS   SONHOS   ✧', sx + p.w / 2, p.y + 42);

          // Beacon pillars on both sides
          const torchLeftX = sx + 22;
          const torchRightX = sx + p.w - 22;
          [torchLeftX, torchRightX].forEach(tx => {
            ctx.fillStyle = '#78350f';
            ctx.fillRect(tx - 6, p.y - 28, 12, 28);
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(tx, p.y - 32, 9, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }

        // ==========================================
        // FASE 3: PLATAFORMAS CAÓTICAS (15 BRINQUEDOS)
        // ==========================================
        case 'toppled_blocks': {
          // 1/15 Pilha de Blocos Tombada
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(sx, p.y, 44, 22);
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(sx + 40, p.y - 4, 46, 26);
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx + 82, p.y + 2, p.w - 82, 20);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('A', sx + 16, p.y + 16);
          ctx.fillText('B', sx + 58, p.y + 14);
          ctx.fillText('C', sx + 98, p.y + 17);
          break;
        }

        case 'floppy_ragdoll': {
          // 2/15 Boneca de Pano Desconjuntada
          ctx.fillStyle = '#be185d';
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y + 12, p.w / 2, 10, -0.05, 0, Math.PI * 2);
          ctx.fill();

          // Button eyes
          ctx.fillStyle = '#18181b';
          ctx.beginPath();
          ctx.arc(sx + 24, p.y + 8, 3.5, 0, Math.PI * 2);
          ctx.arc(sx + 36, p.y + 8, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Red yarn hair
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 2.2;
          for (let h = 0; h < 6; h++) {
            ctx.beginPath();
            ctx.moveTo(sx + 14 + h * 5, p.y + 4);
            ctx.lineTo(sx + 10 + h * 5, p.y - 8);
            ctx.stroke();
          }

          // Striped legs
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(sx + p.w - 32, p.y + 12, 28, 8);
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(sx + p.w - 24, p.y + 12, 8, 8);
          break;
        }

        case 'spilled_crayons_box': {
          // 3/15 Caixa de Giz de Cera Aberta
          ctx.fillStyle = '#ca8a04';
          ctx.fillRect(sx, p.y, p.w, 14);
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx + 4, p.y + 2, p.w - 8, 10);

          // Wax crayons rolling out
          const crayonColors = ['#ec4899', '#06b6d4', '#10b981', '#a855f7'];
          crayonColors.forEach((c, idx) => {
            ctx.fillStyle = c;
            ctx.fillRect(sx + 10 + idx * 24, p.y + 12, 18, 5);
            ctx.beginPath();
            ctx.moveTo(sx + 10 + idx * 24, p.y + 12);
            ctx.lineTo(sx + 6 + idx * 24, p.y + 14.5);
            ctx.lineTo(sx + 10 + idx * 24, p.y + 17);
            ctx.closePath();
            ctx.fill();
          });
          break;
        }

        case 'crooked_fairytales': {
          // 4/15 Pilha Torta de Contos de Fada
          const bookHues = ['#4338ca', '#b91c1c', '#047857', '#6b21a8'];
          bookHues.forEach((bh, bIdx) => {
            const shift = (bIdx % 2 === 0 ? 3 : -3);
            ctx.fillStyle = bh;
            ctx.fillRect(sx + shift, p.y + bIdx * 6, p.w - 4, 6);
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(sx + p.w - 12 + shift, p.y + bIdx * 6 + 1, 8, 4);
          });
          break;
        }

        case 'dented_drum': {
          // 5/15 Tamborzinho Amassado
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(sx + 6, p.y + 6, p.w - 12, 14);
          // Golden rim
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx, p.y, p.w, 6);
          // Crossed wooden sticks
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sx + 12, p.y + 3); ctx.lineTo(sx + p.w - 12, p.y - 6);
          ctx.moveTo(sx + 12, p.y - 6); ctx.lineTo(sx + p.w - 12, p.y + 3);
          ctx.stroke();
          break;
        }

        case 'slumped_bear': {
          // 6/15 Urso de Pelúcia Desmoronado
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y + 10, p.w / 2, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          // Velvet ears
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.arc(sx + 12, p.y + 2, 6, 0, Math.PI * 2);
          ctx.arc(sx + p.w - 12, p.y + 2, 6, 0, Math.PI * 2);
          ctx.fill();
          // Snout
          ctx.fillStyle = '#fde68a';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 11, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'tilted_xylophone': {
          // 7/15 Xilofone Colorido Inclinado
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx, p.y + 8, p.w, 4);
          const rainbow = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6'];
          rainbow.forEach((col, i) => {
            const barW = Math.max(8, (p.w - 12) / rainbow.length);
            ctx.fillStyle = col;
            ctx.fillRect(sx + 4 + i * barW, p.y, barW - 2, 10 - i * 0.8);
          });
          break;
        }

        case 'derailed_train': {
          // 8/15 Locomotiva Descarrilada
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(sx, p.y + 2, p.w - 14, 14);
          // Chimney
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(sx + 8, p.y - 7, 7, 9);
          // Red wheels
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(sx + 14, p.y + 18, 5, 0, Math.PI * 2);
          ctx.arc(sx + p.w - 22, p.y + 18, 5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'wobbly_card_house': {
          // 9/15 Castelo de Cartas Bamboleante
          const sway = Math.sin(tick * 0.15) * 2;
          ctx.fillStyle = '#f8fafc';
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 1;
          // Angled leaning cards
          ctx.beginPath();
          ctx.moveTo(sx + 4 + sway, p.y + 14);
          ctx.lineTo(sx + p.w / 2, p.y);
          ctx.lineTo(sx + p.w - 4 - sway, p.y + 14);
          ctx.stroke();
          // Heart symbol
          ctx.fillStyle = '#ef4444';
          ctx.font = '10px sans-serif';
          ctx.fillText('♥', sx + p.w / 2 - 4, p.y + 11);
          break;
        }

        case 'leaning_music_box': {
          // 10/15 Caixa de Música Desregulada
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx, p.y + 4, p.w, 14);
          ctx.fillStyle = '#facc15';
          // Golden ballerina silhouette
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y - 2, 3, 0, Math.PI * 2);
          ctx.rect(sx + p.w / 2 - 2, p.y + 1, 4, 5);
          ctx.fill();
          break;
        }

        case 'loose_robot': {
          // 11/15 Robô de Lata Desparafusado
          ctx.fillStyle = '#0891b2';
          ctx.fillRect(sx, p.y, p.w, 12);
          // Antenna with glowing ball
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(sx + p.w / 2, p.y); ctx.lineTo(sx + p.w / 2, p.y - 7);
          ctx.stroke();
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y - 8, 2.5, 0, Math.PI * 2);
          ctx.fill();
          // Eye meters
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx + 8, p.y + 3, 5, 4);
          ctx.fillRect(sx + p.w - 13, p.y + 3, 5, 4);
          break;
        }

        case 'spinning_top': {
          // 12/15 Pião de Madeira Rodopiante
          const topPhase = Math.sin(tick * 0.3) * 3;
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(sx + p.w / 2 + topPhase, p.y - 6);
          ctx.lineTo(sx + p.w - 4, p.y + 5);
          ctx.lineTo(sx + p.w / 2, p.y + 15);
          ctx.lineTo(sx + 4, p.y + 5);
          ctx.closePath();
          ctx.fill();
          // Ring stripe
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 2;
          ctx.stroke();
          break;
        }

        case 'floating_spool': {
          // 13/15 Carretel com Fita Flutuante
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx, p.y, p.w, 4);
          ctx.fillRect(sx, p.y + 12, p.w, 4);
          // Wound purple thread
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(sx + 4, p.y + 4, p.w - 8, 8);
          // Floating ribbon
          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          const rPhase = Math.sin(tick * 0.18) * 5;
          ctx.moveTo(sx + p.w - 4, p.y + 4);
          ctx.quadraticCurveTo(sx + p.w + 10, p.y - 8 + rPhase, sx + p.w + 16, p.y - 18);
          ctx.stroke();
          break;
        }

        case 'unbalanced_mobile': {
          // 14/15 Móbile Desequilibrado
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(sx, p.y);
          ctx.lineTo(sx + p.w, p.y + 3);
          ctx.stroke();
          // Hanging dangling star
          ctx.fillStyle = '#fef08a';
          ctx.font = '10px sans-serif';
          ctx.fillText('★', sx + p.w / 2 - 4, p.y + 14);
          break;
        }

        case 'levitating_grimoire': {
          // 15/15 Livro de Feitiços no Vácuo (O Salto Quase Impossível!)
          const gPulse = Math.sin(tick * 0.2) * 3;
          // Luminous aura
          ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 6, p.w / 2 + 8, 0, Math.PI * 2);
          ctx.fill();

          // Grimoire cover
          ctx.fillStyle = '#701a75';
          ctx.beginPath();
          ctx.roundRect(sx, p.y + gPulse, p.w, 12, 3);
          ctx.fill();

          // Gold pages
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx + 3, p.y + 3 + gPulse, p.w - 6, 6);

          // Mystical rune floating above
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('⚡', sx + p.w / 2 - 5, p.y - 4 + gPulse);
          break;
        }

        case 'true_portal_balcony': {
          // Balcão do Verdadeiro Portal dos Sonhos (Destino da Fase 3)
          ctx.fillStyle = '#18182e';
          ctx.fillRect(sx, p.y, p.w, p.h);

          // Gilded marble terrace
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx - 10, p.y - 4, p.w + 20, 10);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 6, p.y + 6, p.w + 12, 6);

          // Runes & text
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 12px Palatino, Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillText('✦   O  VERDADEIRO  PORTAL  DOS  SONHOS   ✦', sx + p.w / 2, p.y + 36);

          // Crystal beacon torches
          const t1 = sx + 25;
          const t2 = sx + p.w - 25;
          [t1, t2].forEach(tx => {
            ctx.fillStyle = '#475569';
            ctx.fillRect(tx - 5, p.y - 24, 10, 24);
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(tx, p.y - 28, 7, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }

        default: {
          ctx.fillStyle = '#1c1924';
          ctx.fillRect(sx, p.y, p.w, p.h);
          break;
        }
      }

      // Iluminação Dinâmica dos Obstáculos: Penumbra na Borda Superior e Revelação Gradual ao Pousar
      ctx.save();
      const isMagicalPhase = isPhase3;
      const alpha = p.lightAlpha || 0;

      // Estado Ativado: Revelação visual suave e gradual do corpo do brinquedo/objeto por inteiro ao pousar
      if (alpha > 0.01) {
        const bodyGlow = ctx.createLinearGradient(sx, p.y, sx, p.y + p.h);
        if (isMagicalPhase) {
          bodyGlow.addColorStop(0, `rgba(233, 213, 255, ${0.28 * alpha})`);
          bodyGlow.addColorStop(1, `rgba(168, 85, 247, ${0.09 * alpha})`);
        } else {
          bodyGlow.addColorStop(0, `rgba(254, 240, 138, ${0.30 * alpha})`);
          bodyGlow.addColorStop(1, `rgba(245, 158, 11, ${0.09 * alpha})`);
        }
        ctx.fillStyle = bodyGlow;
        ctx.fillRect(sx, p.y, p.w, p.h);
      }

      // Brilho Direcional sutil e suave restrito EXCLUSIVAMENTE à borda superior
      if (alpha > 0.05) {
        // Estado ativado ao pousar: confirmação acolhedora e calorosa
        ctx.strokeStyle = isMagicalPhase
          ? `rgba(245, 208, 254, ${0.45 + 0.50 * alpha})`
          : `rgba(254, 240, 138, ${0.45 + 0.50 * alpha})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = isMagicalPhase
          ? 'rgba(216, 180, 254, 0.75)'
          : 'rgba(250, 204, 21, 0.85)';
        ctx.shadowBlur = 6 * alpha;
      } else {
        // Estado inicial na penumbra: luz guia direcional sutil para cálculo do salto
        ctx.strokeStyle = isMagicalPhase
          ? 'rgba(233, 213, 255, 0.38)'
          : 'rgba(254, 240, 138, 0.38)';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = isMagicalPhase
          ? 'rgba(192, 132, 252, 0.22)'
          : 'rgba(250, 204, 21, 0.22)';
        ctx.shadowBlur = 2.5;
      }
      ctx.beginPath();
      ctx.moveTo(sx + 1, p.y + 0.7);
      ctx.lineTo(sx + p.w - 1, p.y + 0.7);
      ctx.stroke();
      ctx.restore();

      // Little sparkling indicator for next target
      if (idx === baby.currentPlatformIndex + 1) {
        const bounce = Math.sin(tick * 0.1) * 4;
        ctx.fillStyle = '#fef08a';
        ctx.font = '16px sans-serif';
        ctx.fillText('▼', sx + p.w / 2 - 6, p.y - 16 + bounce);
      }
    });
    ctx.restore();
  }

  // --- EXIT DOOR (PORTA MÁGICA DOS SONHOS / QUADRO FALSO) ---
  function drawExitDoor(camX) {
    const sx = exitDoor.x - camX;
    if (sx < -200 || sx > canvas.width + 200) return;

    ctx.save();

    if (fakeDoorRevealed) {
      // Wall outline with peeling tape marks & silly drawing
      ctx.fillStyle = 'rgba(254, 243, 199, 0.15)';
      ctx.fillRect(sx, exitDoor.y, exitDoor.w, exitDoor.h);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, exitDoor.y, exitDoor.w, exitDoor.h);

      // 4 yellowed masking tape remnants stuck to the wall
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(sx - 4, exitDoor.y - 4, 18, 8);
      ctx.fillRect(sx + exitDoor.w - 14, exitDoor.y - 4, 18, 8);
      ctx.fillRect(sx - 4, exitDoor.y + exitDoor.h - 4, 18, 8);
      ctx.fillRect(sx + exitDoor.w - 14, exitDoor.y + exitDoor.h - 4, 18, 8);

      // Crayon handwriting on empty wall
      ctx.fillStyle = 'rgba(239, 68, 68, 0.75)';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ERA SÓ UM QUADRO!', sx + exitDoor.w / 2, exitDoor.y + exitDoor.h / 2);

      // Peeling poster falling down
      ctx.save();
      ctx.translate(sx + exitDoor.w / 2, exitDoor.y + fakeDoorSlideY + exitDoor.h / 2);
      ctx.rotate(fakeDoorRotation);
      ctx.translate(-exitDoor.w / 2, -exitDoor.h / 2);

      // Poster paper shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(4, 6, exitDoor.w, exitDoor.h);

      // Poster paper back curled
      ctx.fillStyle = '#f5f5f4';
      ctx.fillRect(0, 0, exitDoor.w, exitDoor.h);

      // Door illustration painted on the poster
      ctx.fillStyle = '#db2777';
      ctx.fillRect(4, 4, exitDoor.w - 8, exitDoor.h - 8);
      const vitral = ctx.createLinearGradient(0, 0, 0, exitDoor.h);
      vitral.addColorStop(0, '#fde047');
      vitral.addColorStop(0.5, '#f43f5e');
      vitral.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = vitral;
      ctx.fillRect(10, 10, exitDoor.w - 20, exitDoor.h - 20);

      // Curled dog-eared corner
      ctx.fillStyle = '#e7e5e4';
      ctx.beginPath();
      ctx.moveTo(exitDoor.w - 16, 0);
      ctx.lineTo(exitDoor.w, 16);
      ctx.lineTo(exitDoor.w - 16, 16);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    } else {
      // Normal majestic glowing exit door
      const pulse = Math.sin(tick * 0.05) * 18;
      const glow = ctx.createRadialGradient(
        sx + exitDoor.w / 2, exitDoor.y + exitDoor.h / 2, 12,
        sx + exitDoor.w / 2, exitDoor.y + exitDoor.h / 2, 140 + pulse
      );
      glow.addColorStop(0, 'rgba(255, 240, 160, 0.95)');
      glow.addColorStop(0.35, 'rgba(255, 80, 200, 0.55)');
      glow.addColorStop(0.7, 'rgba(0, 230, 255, 0.3)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(sx - 100, exitDoor.y - 80, exitDoor.w + 200, exitDoor.h + 160);

      // Carved door frame
      ctx.fillStyle = '#db2777';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.roundRect(sx, exitDoor.y, exitDoor.w, exitDoor.h, [42, 42, 6, 6]);
      ctx.fill();
      ctx.stroke();

      // Stained glass arch
      const vitral = ctx.createLinearGradient(sx, exitDoor.y, sx, exitDoor.y + exitDoor.h);
      vitral.addColorStop(0, '#fde047');
      vitral.addColorStop(0.3, '#f43f5e');
      vitral.addColorStop(0.65, '#8b5cf6');
      vitral.addColorStop(1, '#06b6d4');
      ctx.fillStyle = vitral;
      ctx.beginPath();
      ctx.roundRect(sx + 8, exitDoor.y + 12, exitDoor.w - 16, exitDoor.h - 18, [34, 34, 4, 4]);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '22px sans-serif';
      ctx.fillText('✨', sx + exitDoor.w / 2 - 12, exitDoor.y + 40);
      ctx.fillText('🌿', sx + exitDoor.w / 2 - 12, exitDoor.y + 82);
    }

    ctx.restore();
  }

  // --- TRUE EXIT DOOR (O VERDADEIRO PORTAL DOS SONHOS NA FASE 3) ---
  function drawTrueExitDoor(camX) {
    const sx = trueExitDoor.x - camX;
    if (sx < -200 || sx > canvas.width + 200) return;

    ctx.save();
    const pulse = Math.sin(tick * 0.08) * 22;
    const glow = ctx.createRadialGradient(
      sx + trueExitDoor.w / 2, trueExitDoor.y + trueExitDoor.h / 2, 16,
      sx + trueExitDoor.w / 2, trueExitDoor.y + trueExitDoor.h / 2, 170 + pulse
    );
    glow.addColorStop(0, 'rgba(255, 245, 180, 0.98)');
    glow.addColorStop(0.3, 'rgba(168, 85, 247, 0.65)');
    glow.addColorStop(0.65, 'rgba(56, 189, 248, 0.4)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(sx - 120, trueExitDoor.y - 100, trueExitDoor.w + 240, trueExitDoor.h + 200);

    // Cosmic portal archway
    ctx.fillStyle = '#4c1d95';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(sx, trueExitDoor.y, trueExitDoor.w, trueExitDoor.h, [48, 48, 8, 8]);
    ctx.fill();
    ctx.stroke();

    // Swirling portal vortex
    const vortex = ctx.createLinearGradient(sx, trueExitDoor.y, sx, trueExitDoor.y + trueExitDoor.h);
    vortex.addColorStop(0, '#fde047');
    vortex.addColorStop(0.25, '#c084fc');
    vortex.addColorStop(0.6, '#38bdf8');
    vortex.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = vortex;
    ctx.beginPath();
    ctx.roundRect(sx + 8, trueExitDoor.y + 12, trueExitDoor.w - 16, trueExitDoor.h - 18, [38, 38, 6, 6]);
    ctx.fill();

    // Opening door animation during the level transition into the Toy Room
    if (trueDoorOpenAngle > 0.02) {
      // 1. Radiant volumetric sunlight beams fanning out across the platform
      const beamCount = 6;
      for (let b = 0; b < beamCount; b++) {
        const bAngle = -0.35 + (b / (beamCount - 1)) * 0.7;
        const bLen = 140 + Math.sin(tick * 0.15 + b) * 20;
        const beamGrad = ctx.createLinearGradient(
          sx + trueExitDoor.w / 2, trueExitDoor.y + trueExitDoor.h / 2,
          sx + trueExitDoor.w / 2 + Math.sin(bAngle) * bLen,
          trueExitDoor.y + trueExitDoor.h + Math.cos(bAngle) * 35
        );
        beamGrad.addColorStop(0, `rgba(255, 250, 200, ${0.75 * trueDoorOpenAngle})`);
        beamGrad.addColorStop(0.6, `rgba(250, 204, 21, ${0.45 * trueDoorOpenAngle})`);
        beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(sx + 16, trueExitDoor.y + trueExitDoor.h - 10);
        ctx.lineTo(sx + trueExitDoor.w - 16, trueExitDoor.y + trueExitDoor.h - 10);
        ctx.lineTo(sx + trueExitDoor.w / 2 + Math.sin(bAngle) * bLen + 40, trueExitDoor.y + trueExitDoor.h + 40);
        ctx.lineTo(sx + trueExitDoor.w / 2 + Math.sin(bAngle) * bLen - 40, trueExitDoor.y + trueExitDoor.h + 40);
        ctx.closePath();
        ctx.fill();
      }

      // 2. Glimpse into the sunlit, vibrant Toy Room inside the doorway
      const roomGlimpse = ctx.createLinearGradient(sx, trueExitDoor.y, sx, trueExitDoor.y + trueExitDoor.h);
      roomGlimpse.addColorStop(0, '#fef08a');
      roomGlimpse.addColorStop(0.4, '#fcd34d');
      roomGlimpse.addColorStop(0.7, '#6ee7b7');
      roomGlimpse.addColorStop(1, '#bbf7d0');
      ctx.fillStyle = roomGlimpse;
      ctx.beginPath();
      ctx.roundRect(sx + 10, trueExitDoor.y + 14, trueExitDoor.w - 20, trueExitDoor.h - 22, [36, 36, 4, 4]);
      ctx.fill();

      // 3. Ornate arched door leaves swinging open with perspective
      const leafW = Math.max(2, (trueExitDoor.w / 2 - 12) * (1 - trueDoorOpenAngle));
      // Left door leaf
      ctx.fillStyle = '#b45309';
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(sx + 10, trueExitDoor.y + 14, leafW, trueExitDoor.h - 22, [32, 4, 4, 4]);
      ctx.fill();
      ctx.stroke();

      // Right door leaf
      ctx.beginPath();
      ctx.roundRect(sx + trueExitDoor.w - 10 - leafW, trueExitDoor.y + 14, leafW, trueExitDoor.h - 22, [4, 32, 4, 4]);
      ctx.fill();
      ctx.stroke();
    }

    // Floating golden stars in portal
    const sBob = Math.sin(tick * 0.12) * 5;
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px sans-serif';
    ctx.fillText('⭐', sx + trueExitDoor.w / 2 - 12, trueExitDoor.y + 44 + sBob);
    ctx.fillText('✨', sx + trueExitDoor.w / 2 - 12, trueExitDoor.y + 88 - sBob);

    ctx.restore();
  }

  // --- BABY MANA SPRITE ---
  function drawBabyManaStyle(camX) {
    ctx.save();
    const bx = baby.x - camX;
    const by = baby.y;

    if (baby.isLyingDown) {
      // Menina visivelmente estirada e esparramada no chão após o tombo
      const floorContactY = by + baby.h - 4;
      ctx.translate(bx + baby.w / 2, floorContactY);
      const sprawlDir = baby.facing === -1 ? -1 : 1;
      ctx.scale(sprawlDir, 1);

      // Sombra suave da criança caída no chão
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 2, 28, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sapatinhos amarelos deitados para trás no chão
      ctx.fillStyle = '#ffd000';
      ctx.strokeStyle = '#c98a00';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(-18, -3, 5.5, 3.5, -0.2, 0, Math.PI * 2);
      ctx.ellipse(-11, -4, 5.5, 3.5, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Túnica e corpo estirado horizontalmente
      const bodyGrad = ctx.createLinearGradient(-15, -12, 15, 0);
      bodyGrad.addColorStop(0, '#ff2a85');
      bodyGrad.addColorStop(1, '#d80064');
      ctx.fillStyle = bodyGrad;
      ctx.strokeStyle = '#8a003d';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(-3, -7, 15, 8.5, -0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Faixa ciano e detalhe dourado na túnica
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-11, -6); ctx.lineTo(3, -6);
      ctx.stroke();

      // Bracinhos estendidos para frente no chão
      ctx.fillStyle = '#ff3d94';
      ctx.strokeStyle = '#8a003d';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.ellipse(9, -3, 7.5, 3.5, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffe0cb';
      ctx.beginPath();
      ctx.arc(16, -3, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Cabeça descansando no chão virada de frente
      const headX = 14;
      const headY = -12;
      const faceGrad = ctx.createRadialGradient(headX, headY, 2, headX, headY, 14);
      faceGrad.addColorStop(0, '#fff1e6');
      faceGrad.addColorStop(0.85, '#fcd2be');
      faceGrad.addColorStop(1, '#f7bca1');
      ctx.fillStyle = faceGrad;
      ctx.strokeStyle = '#9c5a3d';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(headX, headY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cabelo lilás espalhado pelo chão ao redor da cabeça
      ctx.fillStyle = '#8b5cf6';
      ctx.strokeStyle = '#4c1d95';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(headX, headY - 4, 11.5, Math.PI * 0.8, Math.PI * 2.2);
      ctx.quadraticCurveTo(headX + 16, headY - 12, headX + 6, headY - 14);
      ctx.quadraticCurveTo(headX - 6, headY - 13, headX - 8, headY - 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Faixinha ciano no cabelo
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(headX - 8, headY - 8, 16, 3.2);

      // Olhos atordoados / tontos de surpresa
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(headX - 4, headY + 1, 2.4, 0, Math.PI * 2);
      ctx.arc(headX + 5, headY + 1, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(headX - 4.8, headY, 1.0, 0, Math.PI * 2);
      ctx.arc(headX + 4.2, headY, 1.0, 0, Math.PI * 2);
      ctx.fill();

      // Bochechinhas coradas de impacto
      ctx.fillStyle = 'rgba(255, 60, 110, 0.55)';
      ctx.beginPath();
      ctx.arc(headX - 5.5, headY + 5, 2.8, 0, Math.PI * 2);
      ctx.arc(headX + 5.5, headY + 5, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Boquinha perplexa / confusa
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.ellipse(headX + 0.5, headY + 6.5, 2.2, 1.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Gotinha de suor/susto
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(headX + 13, headY - 6, 2, 0, Math.PI * 2);
      ctx.fill();

      // Estrelinhas orbitando a cabeça da menina estirada
      const starTime = tick * 0.08;
      for (let s = 0; s < 3; s++) {
        const starAng = starTime + s * (Math.PI * 2 / 3);
        const sx = headX + Math.cos(starAng) * 15;
        const sy = headY - 17 + Math.sin(starAng) * 4;
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      return;
    }

    if (baby.isCrouching) {
      // Menina abaixada/agachada no chão, recuperando o fôlego
      const standUpT = isStandbyTransitioning ? Math.min(1.0, standbyStandUpProgress) : 0;
      const floorContactY = by + baby.h - 2;
      const crouchDrop = (1 - standUpT) * 11;
      const leanAngle = (1 - standUpT) * 0.22;
      const breath = Math.sin(tick * 0.08) * (1 - standUpT) * 1.6;

      ctx.translate(bx + baby.w / 2, floorContactY - baby.h / 2 + crouchDrop / 2 + breath);
      if (baby.facing === -1) {
        ctx.scale(-1, 1);
      }
      ctx.rotate(leanAngle);

      // Sombra suave no chão
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      ctx.beginPath();
      ctx.ellipse(0, baby.h / 2 - crouchDrop / 2 - breath, 16 + (1 - standUpT) * 4, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Perninhas dobradas / agachadas
      const kneeBendAngle = (1 - standUpT) * 0.85;

      // Perna esquerda (trás)
      ctx.save();
      ctx.translate(-5, 9 - (1 - standUpT) * 4);
      ctx.rotate(kneeBendAngle);
      ctx.fillStyle = '#ffd000';
      ctx.strokeStyle = '#c98a00';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, 3, 4.0, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(2, 6, 4.2, 3.0, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Perna direita (frente)
      ctx.save();
      ctx.translate(5, 9 - (1 - standUpT) * 4);
      ctx.rotate(-kneeBendAngle * 0.6);
      ctx.fillStyle = '#ffd000';
      ctx.strokeStyle = '#c98a00';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, 3, 4.0, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(2, 6, 4.2, 3.0, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Túnica recolhida / agachada com detalhes mágicos
      const bodyGrad = ctx.createLinearGradient(-12, -4, 12, 12);
      bodyGrad.addColorStop(0, '#ff2a85');
      bodyGrad.addColorStop(1, '#d80064');
      ctx.fillStyle = bodyGrad;
      ctx.strokeStyle = '#8a003d';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(0, 1 + (1 - standUpT) * 2, 12.5, 11 - (1 - standUpT) * 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Faixa ciano e detalhe dourado na túnica
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, -1 + (1 - standUpT) * 2, 9, 0.3, Math.PI - 0.3);
      ctx.stroke();

      // Bracinhos: apoiados nos joelhos recuperando o fôlego
      const armAngle = (1 - standUpT) * 0.45;
      ctx.fillStyle = '#ff3d94';
      ctx.strokeStyle = '#8a003d';
      ctx.lineWidth = 1.2;

      // Braço esquerdo
      ctx.save();
      ctx.translate(-9, -2 + (1 - standUpT) * 3);
      ctx.rotate(armAngle);
      ctx.beginPath();
      ctx.ellipse(0, 4, 3.2, 5.0, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffe0cb';
      ctx.beginPath();
      ctx.arc(0, 8, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Braço direito (apoiado no joelho à frente)
      ctx.save();
      ctx.translate(9, -2 + (1 - standUpT) * 3);
      ctx.rotate(-armAngle * 0.8);
      ctx.fillStyle = '#ff3d94';
      ctx.beginPath();
      ctx.ellipse(0, 4, 3.2, 5.0, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffe0cb';
      ctx.beginPath();
      ctx.arc(0, 8, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Rostinho: olhando para cima em direção à fadinha com carinho
      const headY = -11 + (1 - standUpT) * 2;
      const faceGrad = ctx.createRadialGradient(0, headY, 2, 0, headY, 14);
      faceGrad.addColorStop(0, '#fff1e6');
      faceGrad.addColorStop(0.85, '#fcd2be');
      faceGrad.addColorStop(1, '#f7bca1');
      ctx.fillStyle = faceGrad;
      ctx.strokeStyle = '#9c5a3d';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, headY, 12.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Bochechas coradas de esforço/recuperação
      ctx.fillStyle = 'rgba(255, 60, 110, 0.52)';
      ctx.beginPath();
      ctx.arc(-7.5, headY + 3, 3.8, 0, Math.PI * 2);
      ctx.arc(7.5, headY + 3, 3.8, 0, Math.PI * 2);
      ctx.fill();

      // Olhos: olhando suavemente para cima (em direção à fadinha)
      if (standUpT < 0.6) {
        ctx.fillStyle = '#21102e';
        ctx.beginPath();
        ctx.ellipse(-4.5, headY - 1, 3.0, 3.8, 0, 0, Math.PI * 2);
        ctx.ellipse(4.5, headY - 1, 3.0, 3.8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#7c3aed';
        ctx.beginPath();
        ctx.ellipse(-4.5, headY - 1.8, 2.0, 2.3, 0, 0, Math.PI * 2);
        ctx.ellipse(4.5, headY - 1.8, 2.0, 2.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Brilho nos olhos
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-5.4, headY - 2.8, 1.3, 0, Math.PI * 2);
        ctx.arc(3.6, headY - 2.8, 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Boquinha respirando suavemente
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.ellipse(0, headY + 5.2, 1.8, 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Sorriso animado ao se levantar
        ctx.fillStyle = '#21102e';
        ctx.beginPath();
        ctx.ellipse(-4.5, headY - 1, 3.2, 4.2, 0, 0, Math.PI * 2);
        ctx.ellipse(4.5, headY - 1, 3.2, 4.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#7c3aed';
        ctx.beginPath();
        ctx.ellipse(-4.5, headY - 1, 2.2, 2.6, 0, 0, Math.PI * 2);
        ctx.ellipse(4.5, headY - 1, 2.2, 2.6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-5.6, headY - 2.5, 1.4, 0, Math.PI * 2);
        ctx.arc(3.4, headY - 2.5, 1.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#c0264b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(0, headY + 5, 2.4, 0.1, Math.PI - 0.1);
        ctx.stroke();
      }

      // Cabelo lilás
      ctx.fillStyle = '#8b5cf6';
      ctx.strokeStyle = '#4c1d95';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, headY - 6, 10, Math.PI * 0.9, Math.PI * 2.1);
      ctx.quadraticCurveTo(8, headY - 14, -2, headY - 15);
      ctx.quadraticCurveTo(-11, headY - 13, -9, headY - 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Faixinha de cabelo ciano
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(-8, headY - 10, 16, 3.2);

      ctx.restore();
      return;
    }

    const t = baby.animTime;
    const stepSwing = Math.sin(t);
    const bob = baby.onGround ? Math.abs(Math.sin(t * 2)) * 3 : 0;
    const tilt = baby.onGround ? Math.sin(t) * 0.08 : -0.15;

    ctx.translate(bx + baby.w / 2, by + baby.h / 2 + bob);
    if (baby.facing === -1) {
      ctx.scale(-1, 1);
    }
    ctx.rotate(tilt);

    const legLeftAngle = baby.onGround ? stepSwing * 0.6 : 0.4;
    const legRightAngle = baby.onGround ? -stepSwing * 0.6 : -0.5;

    ctx.save();
    ctx.translate(-6, 10);
    ctx.rotate(legLeftAngle);
    ctx.fillStyle = '#ffd000';
    ctx.strokeStyle = '#c98a00';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 5, 4.2, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(1.5, 10, 4.5, 3.2, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(6, 10);
    ctx.rotate(legRightAngle);
    ctx.fillStyle = '#ffd000';
    ctx.strokeStyle = '#c98a00';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 5, 4.2, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(1.5, 10, 4.5, 3.2, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Body & tunic
    const bodyGrad = ctx.createLinearGradient(-12, -4, 12, 12);
    bodyGrad.addColorStop(0, '#ff2a85');
    bodyGrad.addColorStop(1, '#d80064');
    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = '#8a003d';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(0, 2, 12.5, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, -2, 9.5, 0.3, Math.PI - 0.3);
    ctx.stroke();

    ctx.strokeStyle = '#ffea00';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, 3, 10.5, 0.3, Math.PI - 0.3);
    ctx.stroke();

    const armSwing = baby.onGround ? Math.cos(t) * 0.5 : 0.8;
    ctx.fillStyle = '#ff3d94';
    ctx.strokeStyle = '#8a003d';
    ctx.lineWidth = 1.2;

    ctx.save();
    ctx.translate(-10, -2);
    ctx.rotate(-armSwing);
    ctx.beginPath();
    ctx.ellipse(0, 4, 3.5, 5.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffe0cb';
    ctx.beginPath();
    ctx.arc(0, 9, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(10, -2);
    ctx.rotate(armSwing);
    ctx.fillStyle = '#ff3d94';
    ctx.beginPath();
    ctx.ellipse(0, 4, 3.5, 5.5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffe0cb';
    ctx.beginPath();
    ctx.arc(0, 9, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Face
    const faceGrad = ctx.createRadialGradient(0, -11, 2, 0, -11, 14);
    faceGrad.addColorStop(0, '#fff1e6');
    faceGrad.addColorStop(0.85, '#fcd2be');
    faceGrad.addColorStop(1, '#f7bca1');
    ctx.fillStyle = faceGrad;
    ctx.strokeStyle = '#9c5a3d';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, -11, 12.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Blushing cheeks
    ctx.fillStyle = 'rgba(255, 60, 110, 0.45)';
    ctx.beginPath();
    ctx.arc(-7.5, -8, 3.8, 0, Math.PI * 2);
    ctx.arc(7.5, -8, 3.8, 0, Math.PI * 2);
    ctx.fill();

    if (baby.isShocked) {
      // Wide startled round eyes
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.ellipse(-5, -12, 4.2, 5.0, 0, 0, Math.PI * 2);
      ctx.ellipse(5, -12, 4.2, 5.0, 0, 0, Math.PI * 2);
      ctx.fill();

      // Big pupils
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.arc(-5, -12, 2.5, 0, Math.PI * 2);
      ctx.arc(5, -12, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Gleam
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-6.2, -13.5, 1.6, 0, Math.PI * 2);
      ctx.arc(3.8, -13.5, 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Shocked small round questioning mouth
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.ellipse(0, -6, 2.5, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sweat drop of bewilderment
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(9, -21);
      ctx.lineTo(12, -15);
      ctx.arc(10.5, -14, 2, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
    } else {
      // Big anime eyes
      ctx.fillStyle = '#21102e';
      ctx.beginPath();
      ctx.ellipse(-4.5, -12, 3.2, 4.2, 0, 0, Math.PI * 2);
      ctx.ellipse(4.5, -12, 3.2, 4.2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.ellipse(-4.5, -11, 2.2, 2.6, 0, 0, Math.PI * 2);
      ctx.ellipse(4.5, -11, 2.2, 2.6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-5.6, -13.5, 1.4, 0, Math.PI * 2);
      ctx.arc(3.4, -13.5, 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Cute smile
      ctx.strokeStyle = '#c0264b';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, -6, 2.4, 0.1, Math.PI - 0.1);
      ctx.stroke();
    }

    // Mana hair
    ctx.fillStyle = '#8b5cf6';
    ctx.strokeStyle = '#4c1d95';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, -17, 10, Math.PI * 0.9, Math.PI * 2.1);
    ctx.quadraticCurveTo(8, -25, -2, -26);
    ctx.quadraticCurveTo(-11, -24, -9, -17);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Hairband
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.roundRect(-9.5, -19, 19, 3.5, 2);
    ctx.fill();

    ctx.restore();
  }

  // --- ORGANIC FAIRY FLIGHT, GUIDANCE & PARTICLES ---
  function drawFairy(camX) {
    ctx.save();

    // Draw fairy magic dust particles with luminous aura and twinkling star glints
    for (let i = 0; i < fairy.particles.length; i++) {
      const p = fairy.particles[i];
      const sx = p.x - camX;
      const sy = p.y;
      if (sx < -40 || sx > canvas.width + 40) continue;

      // Soft luminous aura
      const glowSize = p.size * (1.8 + Math.sin(p.wobble || 0) * 0.4) * p.life;
      ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${p.life * 0.38})`;
      ctx.beginPath();
      ctx.arc(sx, sy, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Core bright starlet
      ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${p.life * 0.95})`;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(0.8, p.size * 0.65 * p.life), 0, Math.PI * 2);
      ctx.fill();

      // 4-point star sparkle glint for twinkling motes
      if (p.twinkle && p.life > 0.25) {
        const glintArm = p.size * (1.8 + Math.sin((p.wobble || 0) * 2.5) * 0.6) * p.life;
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.life * 0.85})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(sx - glintArm, sy);
        ctx.lineTo(sx + glintArm, sy);
        ctx.moveTo(sx, sy - glintArm);
        ctx.lineTo(sx, sy + glintArm);
        ctx.stroke();
      }
    }

    const fx = fairy.x - camX;
    const fy = fairy.y;

    // Golden & Cyan Aura Halo
    const haloRadius = 16 + Math.sin(fairy.floatAngle * 3) * 3;
    const fairyAura = ctx.createRadialGradient(fx, fy, 2, fx, fy, haloRadius);
    fairyAura.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
    fairyAura.addColorStop(0.5, 'rgba(236, 72, 153, 0.45)');
    fairyAura.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = fairyAura;
    ctx.beginPath();
    ctx.arc(fx, fy, haloRadius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle guide sparkles pointing toward the next platform
    if (tick % 4 === 0) {
      const nextP = platforms[baby.currentPlatformIndex + 1];
      if (nextP) {
        const guideAngle = Math.atan2((nextP.y - 20) - fairy.y, (nextP.x + 30) - fairy.x);
        const gDist = 12 + Math.random() * 18;
        ctx.fillStyle = 'rgba(250, 204, 21, 0.8)';
        ctx.beginPath();
        ctx.arc(
          fx + Math.cos(guideAngle) * gDist + (Math.random() - 0.5) * 6,
          fy + Math.sin(guideAngle) * gDist + (Math.random() - 0.5) * 6,
          1.6, 0, Math.PI * 2
        );
        ctx.fill();
      }
    }

    // Wings with rapid dynamic flutter tied to speed
    const flutterSpeed = 0.35 + Math.hypot(fairy.vx, fairy.vy) * 0.15;
    const wingFlap = Math.sin(fairy.flutterPhase) * 10;

    // Translucent gossamer wings
    ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
    ctx.beginPath();
    // Top wings
    ctx.ellipse(fx - 4, fy - 6, 9, 3.5 + Math.abs(wingFlap), -0.4, 0, Math.PI * 2);
    ctx.ellipse(fx + 4, fy - 6, 9, 3.5 + Math.abs(wingFlap), 0.4, 0, Math.PI * 2);
    // Lower secondary wings
    ctx.ellipse(fx - 5, fy + 3, 6, 2.2 + Math.abs(wingFlap) * 0.7, 0.35, 0, Math.PI * 2);
    ctx.ellipse(fx + 5, fy + 3, 6, 2.2 + Math.abs(wingFlap) * 0.7, -0.35, 0, Math.PI * 2);
    ctx.fill();

    // Wing edge sparkles
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fx - 9, fy - 7 - Math.abs(wingFlap) * 0.5, 1.4, 0, Math.PI * 2);
    ctx.arc(fx + 9, fy - 7 - Math.abs(wingFlap) * 0.5, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Fairy golden glowing head
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(fx, fy - 3, 4.8, 0, Math.PI * 2);
    ctx.fill();

    // Fairy dress / tunic
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(fx, fy - 1);
    ctx.lineTo(fx + 5, fy + 9);
    ctx.lineTo(fx - 5, fy + 9);
    ctx.closePath();
    ctx.fill();

    // Fairy tiny magic wand pointing ahead
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(fx + 3, fy + 3);
    ctx.lineTo(fx + 11, fy + 1);
    ctx.stroke();
    // Wand star tip
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fx + 12, fy + 1, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Cutscene Step 1: Investigative curiosity sparkles & question mark
    if (cutsceneActive && cutsceneStep === 1) {
      const qFloat = Math.sin(tick * 0.12) * 3;
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('?', fx + 9, fy - 12 + qFloat);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(fx - 10, fy - 10 - qFloat, 1.5, 0, Math.PI * 2);
      ctx.arc(fx + 16, fy - 6 + qFloat, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cutscene Step 2: Guiding beam pointing to the exit ("A saída é logo ali!")
    if (cutsceneActive && cutsceneStep === 2) {
      const beamGrad = ctx.createLinearGradient(fx + 12, fy + 1, fx + 220, fy + 1);
      beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
      beamGrad.addColorStop(0.3, 'rgba(236, 72, 153, 0.7)');
      beamGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.strokeStyle = beamGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(fx + 12, fy + 1);
      ctx.lineTo(fx + 220, fy + 1);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(fx + 12, fy + 1, 3.2, 0, Math.PI * 2);
      ctx.fill();

      const noteBob = Math.sin(tick * 0.16) * 4;
      ctx.fillStyle = '#f472b6';
      ctx.font = '13px sans-serif';
      ctx.fillText('♪', fx - 14, fy - 15 + noteBob);
      ctx.fillText('♫', fx + 18, fy - 18 - noteBob);
    }

    ctx.restore();
  }

  // --- ATMOSPHERIC DYNAMIC LIGHTING ---
  function applyDarkAtmosphereWithLights(camX, camY = 0) {
    dctx.clearRect(0, 0, darkCanvas.width, darkCanvas.height);

    if (isStandbyActive || isStandbyTransitioning) {
      // Pulsação sutil e acolhedora de luz que ilumina apenas a menina e a fadinha no quarto escuro
      dctx.fillStyle = '#05040a';
      dctx.fillRect(0, 0, canvas.width, canvas.height);
      dctx.globalCompositeOperation = 'destination-out';

      const bx = baby.x - camX + baby.w / 2;
      const by = baby.y - camY + baby.h / 2;
      const fx = fairy.x - camX;
      const fy = fairy.y - camY;

      // Pulsação suave (senoidal) da fadinha acolhedora
      const pulse = Math.sin(tick * 0.06) * 14;
      const midX = (bx + fx) / 2;
      const midY = (by + fy) / 2;
      const cozyRadius = 150 + pulse;

      // Luz acolhedora envolvente das duas
      const cozySpot = dctx.createRadialGradient(midX, midY, 15, midX, midY, cozyRadius);
      cozySpot.addColorStop(0, 'rgba(0,0,0,1)');
      cozySpot.addColorStop(0.5, 'rgba(0,0,0,0.85)');
      cozySpot.addColorStop(0.85, 'rgba(0,0,0,0.4)');
      cozySpot.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = cozySpot;
      dctx.beginPath();
      dctx.arc(midX, midY, cozyRadius, 0, Math.PI * 2);
      dctx.fill();

      // Luz pontual brilhante da fadinha
      const fairySpot = dctx.createRadialGradient(fx, fy, 5, fx, fy, 95 + pulse * 0.5);
      fairySpot.addColorStop(0, 'rgba(0,0,0,1)');
      fairySpot.addColorStop(0.6, 'rgba(0,0,0,0.8)');
      fairySpot.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = fairySpot;
      dctx.beginPath();
      dctx.arc(fx, fy, 95 + pulse * 0.5, 0, Math.PI * 2);
      dctx.fill();

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(darkCanvas, 0, 0);

      // Vignette suave ao redor da tela
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.25,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.65
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      return;
    }

    if (plotTwistActive) {
      // Cinematic penumbra: surroundings are plunged into deep dark penumbra
      dctx.fillStyle = '#030208';
      dctx.fillRect(0, 0, canvas.width, canvas.height);
      dctx.globalCompositeOperation = 'destination-out';

      const bx = baby.x - camX + baby.w / 2;
      const by = baby.y - camY + baby.h / 2;

      if (plotTwistStep === 2) {
        // Dramatic isolated spotlight solely on the startled baby's face on the floor
        const spot = dctx.createRadialGradient(bx, by, 10, bx, by, 140);
        spot.addColorStop(0, 'rgba(0,0,0,1)');
        spot.addColorStop(0.5, 'rgba(0,0,0,0.85)');
        spot.addColorStop(1, 'rgba(0,0,0,0)');
        dctx.fillStyle = spot;
        dctx.beginPath();
        dctx.arc(bx, by, 140, 0, Math.PI * 2);
        dctx.fill();
      } else {
        // Spotlight on both child and the worried pacing fairy
        const spotBaby = dctx.createRadialGradient(bx, by, 10, bx, by, 150);
        spotBaby.addColorStop(0, 'rgba(0,0,0,1)');
        spotBaby.addColorStop(0.55, 'rgba(0,0,0,0.8)');
        spotBaby.addColorStop(1, 'rgba(0,0,0,0)');
        dctx.fillStyle = spotBaby;
        dctx.beginPath();
        dctx.arc(bx, by, 150, 0, Math.PI * 2);
        dctx.fill();

        const fx = fairy.x - camX;
        const fy = fairy.y - camY;
        const spotFairy = dctx.createRadialGradient(fx, fy, 8, fx, fy, 130);
        spotFairy.addColorStop(0, 'rgba(0,0,0,1)');
        spotFairy.addColorStop(0.6, 'rgba(0,0,0,0.75)');
        spotFairy.addColorStop(1, 'rgba(0,0,0,0)');
        dctx.fillStyle = spotFairy;
        dctx.beginPath();
        dctx.arc(fx, fy, 130, 0, Math.PI * 2);
        dctx.fill();
      }

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(darkCanvas, 0, 0);

      // Deep dramatic edge shadow
      const dramaticVignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.6
      );
      dramaticVignette.addColorStop(0, 'rgba(0,0,0,0)');
      dramaticVignette.addColorStop(1, 'rgba(0,0,0,0.92)');
      ctx.fillStyle = dramaticVignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      return;
    }

    dctx.fillStyle = '#0a0812';
    dctx.fillRect(0, 0, canvas.width, canvas.height);
    dctx.globalCompositeOperation = 'destination-out';

    // Light around baby (always tracking vertical camera position)
    const bx = baby.x - camX + baby.w / 2;
    const by = baby.y - camY + baby.h / 2;
    const babyLight = dctx.createRadialGradient(bx, by, 12, bx, by, 175);
    babyLight.addColorStop(0, 'rgba(0,0,0,0.96)');
    babyLight.addColorStop(0.5, 'rgba(0,0,0,0.68)');
    babyLight.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = babyLight;
    dctx.beginPath();
    dctx.arc(bx, by, 175, 0, Math.PI * 2);
    dctx.fill();

    // Vibrant light aura around the fairy
    const fx = fairy.x - camX;
    const fy = fairy.y - camY;
    const fairyLight = dctx.createRadialGradient(fx, fy, 8, fx, fy, 160);
    fairyLight.addColorStop(0, 'rgba(0,0,0,0.96)');
    fairyLight.addColorStop(0.4, 'rgba(0,0,0,0.75)');
    fairyLight.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = fairyLight;
    dctx.beginPath();
    dctx.arc(fx, fy, 160, 0, Math.PI * 2);
    dctx.fill();

    // Iluminação Dinâmica dos Obstáculos: Penumbra inicial com luz guia no topo e ativação gradual ao pousar
    const activePlats = isPhase3 ? phase3Platforms : platforms;
    for (let i = 0; i < activePlats.length; i++) {
      const p = activePlats[i];
      const leftX = p.x - camX;
      const topY = p.y - camY;
      if (leftX + p.w < -120 || leftX > canvas.width + 120) continue;

      const alpha = p.lightAlpha || 0;

      // 1. Estado Inicial (Penumbra com Luz Guia no Topo):
      // Fenda muito sutil e estreita restrita exclusivamente à borda superior
      const topSlit = dctx.createLinearGradient(0, topY - 2, 0, topY + 6);
      topSlit.addColorStop(0, 'rgba(0,0,0,0)');
      topSlit.addColorStop(0.5, 'rgba(0,0,0,0.36)');
      topSlit.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = topSlit;
      dctx.fillRect(leftX, topY - 2, p.w, 8);

      // 2. Estado Ativado (Iluminação Total ao Pousar):
      // Fade-in de luz quente/pontual revelando o corpo do objeto por inteiro
      if (alpha > 0.01) {
        const cx = leftX + p.w / 2;
        const cy = topY + p.h * 0.45;
        const rad = Math.max(54, p.w * 0.72 + 28);
        const spot = dctx.createRadialGradient(cx, cy, 6, cx, cy, rad);
        spot.addColorStop(0, `rgba(0,0,0,${0.92 * alpha})`);
        spot.addColorStop(0.55, `rgba(0,0,0,${0.60 * alpha})`);
        spot.addColorStop(1, 'rgba(0,0,0,0)');
        dctx.fillStyle = spot;
        dctx.beginPath();
        dctx.arc(cx, cy, rad, 0, Math.PI * 2);
        dctx.fill();
      }
    }

    if (isPhase3) {
      // Beacon light for the True Exit Door on the far left terrace
      const tx = trueExitDoor.x - camX + trueExitDoor.w / 2;
      const ty = trueExitDoor.y - camY + trueExitDoor.h / 2;
      const trueDoorLight = dctx.createRadialGradient(tx, ty, 25, tx, ty, 300);
      trueDoorLight.addColorStop(0, 'rgba(0,0,0,1)');
      trueDoorLight.addColorStop(0.65, 'rgba(0,0,0,0.75)');
      trueDoorLight.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = trueDoorLight;
      dctx.beginPath();
      dctx.arc(tx, ty, 300, 0, Math.PI * 2);
      dctx.fill();
    } else {
      // Exit door beacon light (Phase 1 & 2)
      const px = exitDoor.x - camX + exitDoor.w / 2;
      const py = exitDoor.y - camY + exitDoor.h / 2;
      const doorLight = dctx.createRadialGradient(px, py, 20, px, py, 280);
      doorLight.addColorStop(0, 'rgba(0,0,0,1)');
      doorLight.addColorStop(0.6, 'rgba(0,0,0,0.7)');
      doorLight.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = doorLight;
      dctx.beginPath();
      dctx.arc(px, py, 280, 0, Math.PI * 2);
      dctx.fill();
    }

    // Mushroom lamp glow
    const mushPlat = platforms.find(p => p.style === 'mushroom_lamp');
    if (mushPlat) {
      const mx = mushPlat.x - camX + mushPlat.w / 2;
      const my = mushPlat.y - camY + 12;
      const mushLight = dctx.createRadialGradient(mx, my, 6, mx, my, 90);
      mushLight.addColorStop(0, 'rgba(0,0,0,0.85)');
      mushLight.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = mushLight;
      dctx.beginPath();
      dctx.arc(mx, my, 90, 0, Math.PI * 2);
      dctx.fill();
    }

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(darkCanvas, 0, 0);

    // Warm atmospheric vignette
    const vignette = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, canvas.width * 0.35,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.65
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(3,2,6,0.8)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  // --- SPEED RIBBONS & TRAIL EFFECTS ---
  function drawSpeedRibbons(camX) {
    ctx.save();
    for (let i = speedRibbons.length - 1; i >= 0; i--) {
      const r = speedRibbons[i];
      r.x += r.vx;
      r.y += r.vy;
      r.life -= r.decay;
      if (r.life <= 0) {
        speedRibbons.splice(i, 1);
        continue;
      }
      ctx.fillStyle = r.color;
      ctx.globalAlpha = r.life * 0.85;
      ctx.beginPath();
      ctx.arc(r.x - camX, r.y, r.size * r.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- SUBTLE JUMP TRAIL RENDERING ---
  function drawBabyJumpDust(camX) {
    if (babyJumpDust.length === 0) return;
    ctx.save();
    for (let i = 0; i < babyJumpDust.length; i++) {
      const p = babyJumpDust[i];
      const sx = p.x - camX;
      const sy = p.y;
      if (sx < -30 || sx > canvas.width + 30) continue;

      // Soft ethereal outer aura
      ctx.fillStyle = `rgba(${p.rgb}, ${p.life * 0.32})`;
      ctx.beginPath();
      ctx.arc(sx, sy, p.size * (1.7 + Math.sin(p.wobble) * 0.3) * p.life, 0, Math.PI * 2);
      ctx.fill();

      // Crisp luminous core mote
      ctx.fillStyle = `rgba(${p.rgb}, ${p.life * 0.92})`;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(0.6, p.size * 0.68 * p.life), 0, Math.PI * 2);
      ctx.fill();

      // Micro 4-point sparkle for twinkling motes
      if (p.twinkle && p.life > 0.35) {
        const glintArm = p.size * (1.5 + Math.sin(p.wobble * 2) * 0.5) * p.life;
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.life * 0.75})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(sx - glintArm, sy);
        ctx.lineTo(sx + glintArm, sy);
        ctx.moveTo(sx, sy - glintArm);
        ctx.lineTo(sx, sy + glintArm);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // --- ESCAPE MODE & PHASE 3 HUD BANNER & SPEED LINES ---
  function drawEscapeBanner() {
    if (!isEscapeMode && !isPhase3) return;

    ctx.save();
    // Top right urgency badge with progressive jump meter
    const badgeW = 270;
    const badgeH = 42;
    const badgeX = canvas.width - badgeW - 16;
    const badgeY = 14;

    ctx.fillStyle = 'rgba(15, 12, 24, 0.92)';
    ctx.strokeStyle = (isPhase3 ? (phase3Level >= 14 ? '#fde047' : '#c084fc') : (escapeLevel >= 11 ? '#fde047' : '#f59e0b'));
    ctx.lineWidth = (isPhase3 ? (phase3Level >= 14 ? 2.4 : 1.6) : (escapeLevel >= 11 ? 2.2 : 1.5));
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = (isPhase3 ? (phase3Level >= 14 ? '#fde047' : '#f5d0fe') : (escapeLevel >= 11 ? '#fde047' : '#fef08a'));
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    if (isPhase3) {
      ctx.fillText(`🌪️ SUBIDA CAÓTICA: NÍVEL ${phase3Level + 1}/15`, badgeX + 14, badgeY + 18);
    } else {
      ctx.fillText(`⚡ FUGA: PULO NÍVEL ${escapeLevel + 1}/12`, badgeX + 14, badgeY + 18);
    }

    // Mini progress bar for jump evolution
    const pBarX = badgeX + 14;
    const pBarY = badgeY + 25;
    const pBarW = badgeW - 28;
    const pBarH = 6;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.fillRect(pBarX, pBarY, pBarW, pBarH);

    const maxLevels = isPhase3 ? 15 : 12;
    const currentLevel = isPhase3 ? phase3Level + 1 : escapeLevel + 1;
    const progFill = (currentLevel / maxLevels) * pBarW;
    const barGrad = ctx.createLinearGradient(pBarX, pBarY, pBarX + pBarW, pBarY);
    if (isPhase3) {
      barGrad.addColorStop(0, '#c084fc');
      barGrad.addColorStop(0.5, '#f472b6');
      barGrad.addColorStop(1, '#fde047');
    } else {
      barGrad.addColorStop(0, '#38bdf8');
      barGrad.addColorStop(0.5, '#facc15');
      barGrad.addColorStop(1, '#ec4899');
    }
    ctx.fillStyle = barGrad;
    ctx.fillRect(pBarX, pBarY, progFill, pBarH);

    // Initial / Level-up powerup banner
    if (escapeBannerTimer > 0) {
      escapeBannerTimer--;
      const alpha = Math.min(1.0, escapeBannerTimer / 30);
      ctx.fillStyle = `rgba(0, 0, 0, ${0.65 * alpha})`;
      ctx.fillRect(0, 64, canvas.width, 56);

      ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
      ctx.font = 'bold 19px Palatino, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(escapeBannerText, canvas.width / 2, 99);
    }

    // Dynamic wind speed streaks across screen scaling with scroll speed
    const intensityFactor = isPhase3 ? (phase3Level / 14) : (escapeLevel / 11);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + Math.min(0.18, intensityFactor * 0.14)})`;
    ctx.lineWidth = 1.4 + intensityFactor * 0.9;
    const speedTime = tick * (12 + Math.abs(currentScrollSpeed) * 3);
    const streakCount = 5 + Math.floor(intensityFactor * 4);
    for (let i = 0; i < streakCount; i++) {
      const sx = (speedTime + i * 140) % (canvas.width + 220) - 100;
      const sy = 50 + i * 65;
      const streakLen = 60 + Math.abs(currentScrollSpeed) * 18;
      ctx.beginPath();
      if (isPhase3) {
        // Streaks moving towards right as camera moves left
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + streakLen, sy);
      } else {
        ctx.moveTo(canvas.width - sx, sy);
        ctx.lineTo(canvas.width - sx - streakLen, sy);
      }
      ctx.stroke();
    }

    if (isPhase3) {
      // In Phase 3: player moving left, camera moving left. If player lags behind to the right:
      const distToRight = (cameraX + canvas.width) - baby.x;
      if (distToRight < 170) {
        const danger = (170 - distToRight) / 170;
        const shadowGrad = ctx.createLinearGradient(canvas.width, 0, canvas.width - 130, 0);
        shadowGrad.addColorStop(0, `rgba(220, 38, 38, ${0.48 * danger})`);
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(canvas.width - 130, 0, 130, canvas.height);
      }
    } else {
      // In Phase 2: Warning left-edge night shadow if baby is lagging behind the accelerated camera
      const distToLeft = baby.x - cameraX;
      if (distToLeft < 170) {
        const danger = (170 - distToLeft) / 170;
        const shadowGrad = ctx.createLinearGradient(0, 0, 130, 0);
        shadowGrad.addColorStop(0, `rgba(220, 38, 38, ${0.48 * danger})`);
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(0, 0, 130, canvas.height);
      }
    }

    ctx.restore();
  }

  // --- UNIFIED DIALOGUE PORTRAIT RENDERER ---
  function drawDialoguePortrait(pCtx, charType, px, py, radius, mood = 'normal') {
    pCtx.save();
    // 1. Ethereal ambient halo behind portrait frame
    const glow = pCtx.createRadialGradient(px, py, radius * 0.3, px, py, radius + 6);
    if (charType === 'fairy') {
      glow.addColorStop(0, '#fef08a');
      glow.addColorStop(0.5, '#ec4899');
      glow.addColorStop(1, '#06b6d4');
    } else {
      glow.addColorStop(0, '#fed7aa');
      glow.addColorStop(0.6, '#f472b6');
      glow.addColorStop(1, '#8b5cf6');
    }
    pCtx.fillStyle = glow;
    pCtx.beginPath();
    pCtx.arc(px, py, radius + 4, 0, Math.PI * 2);
    pCtx.fill();

    // 2. Deep mystical background disc
    pCtx.fillStyle = '#161024';
    pCtx.beginPath();
    pCtx.arc(px, py, radius, 0, Math.PI * 2);
    pCtx.fill();

    // 3. Ornate golden bezel rings
    pCtx.strokeStyle = charType === 'fairy' ? '#fde047' : '#f472b6';
    pCtx.lineWidth = 2.4;
    pCtx.stroke();

    pCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    pCtx.lineWidth = 1;
    pCtx.beginPath();
    pCtx.arc(px, py, radius - 3, 0, Math.PI * 2);
    pCtx.stroke();

    if (charType === 'fairy') {
      // Animated fluttering gossamer wings
      const wingFlap = Math.sin(tick * 0.35) * 8;
      pCtx.fillStyle = 'rgba(6, 182, 212, 0.85)';
      pCtx.beginPath();
      pCtx.ellipse(px - 11, py - 6, 12, 4 + Math.abs(wingFlap), -0.28, 0, Math.PI * 2);
      pCtx.ellipse(px + 11, py - 6, 12, 4 + Math.abs(wingFlap), 0.28, 0, Math.PI * 2);
      pCtx.fill();

      // Golden fairy head & face
      pCtx.fillStyle = '#fef08a';
      pCtx.beginPath();
      pCtx.arc(px, py - 2, 9.5, 0, Math.PI * 2);
      pCtx.fill();

      // Soft fairy blush
      pCtx.fillStyle = 'rgba(244, 114, 182, 0.65)';
      pCtx.beginPath();
      pCtx.arc(px - 6, py + 1, 2.2, 0, Math.PI * 2);
      pCtx.arc(px + 6, py + 1, 2.2, 0, Math.PI * 2);
      pCtx.fill();

      // Anime eyes with specular catchlights
      pCtx.fillStyle = '#311042';
      pCtx.beginPath();
      pCtx.ellipse(px - 3.8, py - 3, 1.8, 2.2, 0, 0, Math.PI * 2);
      pCtx.ellipse(px + 3.8, py - 3, 1.8, 2.2, 0, 0, Math.PI * 2);
      pCtx.fill();

      pCtx.fillStyle = '#ffffff';
      pCtx.beginPath();
      pCtx.arc(px - 4.2, py - 3.6, 0.75, 0, Math.PI * 2);
      pCtx.arc(px + 3.4, py - 3.6, 0.75, 0, Math.PI * 2);
      pCtx.fill();

      if (mood === 'annoyed' || mood === 'determined') {
        // Exasperated brow & determined mouth
        pCtx.strokeStyle = '#991b1b';
        pCtx.lineWidth = 1.3;
        pCtx.beginPath();
        pCtx.moveTo(px - 6, py - 6.5); pCtx.lineTo(px - 1.5, py - 4.5);
        pCtx.moveTo(px + 6, py - 6.5); pCtx.lineTo(px + 1.5, py - 4.5);
        pCtx.stroke();

        pCtx.strokeStyle = '#dc2626';
        pCtx.lineWidth = 1.2;
        pCtx.beginPath();
        pCtx.arc(px, py + 1.2, 3.2, Math.PI + 0.3, Math.PI * 2 - 0.3);
        pCtx.stroke();
      } else {
        // Cheerful fairy smile
        pCtx.strokeStyle = '#db2777';
        pCtx.lineWidth = 1.2;
        pCtx.beginPath();
        pCtx.arc(px, py - 0.5, 3.2, 0.2, Math.PI - 0.2);
        pCtx.stroke();
      }

      // Corner twinkle sparkle on portrait frame
      const starPhase = (tick * 0.1) % (Math.PI * 2);
      pCtx.fillStyle = '#ffffff';
      pCtx.beginPath();
      pCtx.arc(px + radius - 4, py - radius + 5, 1.8 + Math.sin(starPhase) * 0.8, 0, Math.PI * 2);
      pCtx.fill();
    } else {
      // Baby Girl Avatar (Shocked / Inquiring)
      pCtx.fillStyle = '#ffe0cb';
      pCtx.beginPath();
      pCtx.arc(px, py + 2, 15, 0, Math.PI * 2);
      pCtx.fill();

      // Lilac hair & cyan hairband
      pCtx.fillStyle = '#8b5cf6';
      pCtx.beginPath();
      pCtx.arc(px, py - 5, 13, Math.PI, Math.PI * 2);
      pCtx.fill();
      pCtx.fillStyle = '#06b6d4';
      pCtx.fillRect(px - 10, py - 7, 20, 3.2);

      // Wide shocked anime eyes
      pCtx.fillStyle = '#1e1b4b';
      pCtx.beginPath();
      pCtx.ellipse(px - 5, py + 1, 3.5, 4.2, 0, 0, Math.PI * 2);
      pCtx.ellipse(px + 5, py + 1, 3.5, 4.2, 0, 0, Math.PI * 2);
      pCtx.fill();
      pCtx.fillStyle = '#ffffff';
      pCtx.beginPath();
      pCtx.arc(px - 6, py - 1, 1.4, 0, Math.PI * 2);
      pCtx.arc(px + 4, py - 1, 1.4, 0, Math.PI * 2);
      pCtx.fill();

      // Bewildered questioning open mouth
      pCtx.fillStyle = '#991b1b';
      pCtx.beginPath();
      pCtx.ellipse(px, py + 9, 2.4, 3, 0, 0, Math.PI * 2);
      pCtx.fill();

      // Blushed cheeks
      pCtx.fillStyle = 'rgba(244, 114, 182, 0.6)';
      pCtx.beginPath();
      pCtx.arc(px - 8, py + 5, 2.5, 0, Math.PI * 2);
      pCtx.arc(px + 8, py + 5, 2.5, 0, Math.PI * 2);
      pCtx.fill();

      // Sweat droplet
      pCtx.fillStyle = '#38bdf8';
      pCtx.beginPath();
      pCtx.arc(px + 11, py - 2, 1.8, 0, Math.PI * 2);
      pCtx.fill();
    }
    pCtx.restore();
  }

  // Helper to split text into wrapped lines fitting within maxWidth
  function wrapDialogueText(pCtx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = pCtx.measureText(testLine).width;
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  // --- CUTSCENE DIALOGUE WINDOW & CINEMATIC BARS ---
  function drawCutsceneDialogue() {
    const isStandbyShowing = isStandbyActive || (isStandbyTransitioning && standbyDialogueAlpha > 0.01);
    // Only show dialogue when cutscene is active, during standby, or during plot twist steps 4 (Baby) and 5 (Fairy)
    if (!cutsceneActive && (!plotTwistActive || plotTwistStep < 4) && !isStandbyShowing) return;

    ctx.save();
    if (isStandbyShowing) {
      ctx.globalAlpha = standbyDialogueAlpha;
    }

    // 1. Cinematic letterbox bars
    ctx.fillStyle = '#06040a';
    ctx.fillRect(0, 0, canvas.width, 42);
    ctx.fillRect(0, canvas.height - 42, canvas.width, 42);

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 42);
    ctx.lineTo(canvas.width, 42);
    ctx.moveTo(0, canvas.height - 42);
    ctx.lineTo(canvas.width, canvas.height - 42);
    ctx.stroke();

    // Determine active dialogue speaker, text, and mood
    let speaker = 'fairy';
    let speakerName = '✦ FADINHA ✦';
    let speakerColor = '#fef08a';
    let mood = 'normal';
    let dialogueText = '';
    let advancePrompt = 'Toque / Espaço / (X) ➔';

    if (isStandbyShowing) {
      speaker = 'fairy';
      speakerName = '✦ FADINHA ✦';
      speakerColor = '#fef08a';
      mood = 'normal';
      dialogueText = '"Você está bem? Vamos tentar novamente!"';
      const activeDev = getActivePromptDevice();
      if (activeDev === 'gamepad') {
        advancePrompt = '(X) para continuar ➔';
      } else if (activeDev === 'keyboard') {
        advancePrompt = 'Espaço para continuar ➔';
      } else if (activeDev === 'touch') {
        advancePrompt = 'Toque na tela para continuar ➔';
      } else {
        advancePrompt = 'Toque / Espaço / (X) para continuar ➔';
      }
    } else if (plotTwistActive && plotTwistStep === 4) {
      speaker = 'baby';
      speakerName = '✦ MENININHA ✦';
      speakerColor = '#fed7aa';
      mood = 'shocked';
      dialogueText = '"Mas ali não era a porta...?"';
      advancePrompt = 'Toque / Espaço / (X) para continuar ➔';
    } else if (plotTwistActive && plotTwistStep === 5) {
      speaker = 'fairy';
      speakerName = '✦ FADINHA ✦';
      speakerColor = '#fef08a';
      mood = 'annoyed';
      dialogueText = '"Droga! Como se virar em toda essa bagunça? Vamos tentar novamente por ali!"';
      advancePrompt = 'Toque / Espaço / (X) para iniciar a subida ➔';
    } else if (cutsceneStep === 1) {
      speaker = 'fairy';
      speakerName = '✦ FADINHA ✦';
      speakerColor = '#fef08a';
      mood = 'normal';
      dialogueText = '"O quarto está escuro, mas lá fora temos muita coisa pra ver. Vamos logo sair daqui. Não aguento essa bagunça! Quem fez tudo isso?"';
      advancePrompt = 'Toque / Espaço / (X) para continuar ➔';
    } else if (cutsceneStep === 2) {
      speaker = 'fairy';
      speakerName = '✦ FADINHA ✦';
      speakerColor = '#fef08a';
      mood = 'normal';
      dialogueText = '"Claro que fomos nós duas brincando! *risos*. Mas não vamos mais perder tempo. A saída é logo ali."';
      advancePrompt = 'Toque / Espaço / (X) para continuar ➔';
    }

    // 2. Adaptive container sizing & Word wrapping to prevent any overflow
    const boxW = Math.min(canvas.width - 24, 760);
    const boxX = (canvas.width - boxW) / 2;
    const portR = isPortrait ? 28 : 32;
    const portPadX = isPortrait ? 12 : 18;
    const textX = boxX + portPadX + portR * 2 + 16;
    const textMaxW = boxW - (textX - boxX) - 20;

    // Dynamic font scaling & word wrap
    let fontSize = isPortrait ? 14.5 : 16;
    ctx.font = `italic ${fontSize}px Palatino, Georgia, serif`;
    let lines = wrapDialogueText(ctx, dialogueText, textMaxW);

    // Auto-fit: scale font down if text exceeds 3 lines on landscape or 4 on portrait
    const maxAllowedLines = isPortrait ? 4 : 3;
    while (lines.length > maxAllowedLines && fontSize > 12) {
      fontSize -= 0.5;
      ctx.font = `italic ${fontSize}px Palatino, Georgia, serif`;
      lines = wrapDialogueText(ctx, dialogueText, textMaxW);
    }

    const lineHeight = Math.round(fontSize * 1.44);
    const contentH = lines.length * lineHeight;
    const boxH = Math.max(isPortrait ? 122 : 110, contentH + 52, portR * 2 + 48);
    const boxY = canvas.height - boxH - 12;

    // Draw Dialogue Box Container
    const bgGrad = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxH);
    bgGrad.addColorStop(0, 'rgba(26, 20, 38, 0.97)');
    bgGrad.addColorStop(1, 'rgba(13, 9, 20, 0.99)');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 12);
    ctx.fill();

    ctx.strokeStyle = (plotTwistActive ? '#ef4444' : '#d97706');
    ctx.lineWidth = 2.4;
    ctx.stroke();

    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.roundRect(boxX + 4, boxY + 4, boxW - 8, boxH - 8, 8);
    ctx.stroke();

    // Corner decorative gems
    const corners = [
      { x: boxX + 7, y: boxY + 7 },
      { x: boxX + boxW - 7, y: boxY + 7 },
      { x: boxX + 7, y: boxY + boxH - 7 },
      { x: boxX + boxW - 7, y: boxY + boxH - 7 }
    ];
    ctx.fillStyle = '#facc15';
    corners.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 2.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Draw Portrait & Badge with guaranteed visual consistency
    const portX = boxX + portPadX + portR;
    const portY = boxY + portR + 14;
    drawDialoguePortrait(ctx, speaker, portX, portY, portR, mood);

    ctx.fillStyle = speakerColor;
    ctx.font = 'bold 10px Palatino, Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(speakerName, portX, portY + portR + 13);

    // 4. Draw Wrapped Dialogue Text Lines with *risos* highlighting
    const textStartY = boxY + 28;
    ctx.textAlign = 'left';
    ctx.font = `italic ${fontSize}px Palatino, Georgia, serif`;

    lines.forEach((lineStr, lineIdx) => {
      const curY = textStartY + lineIdx * lineHeight;
      if (lineStr.includes('*risos*')) {
        const parts = lineStr.split('*risos*');
        let curX = textX;
        if (parts[0]) {
          ctx.fillStyle = '#fef9c3';
          ctx.fillText(parts[0], curX, curY);
          curX += ctx.measureText(parts[0]).width;
        }
        ctx.fillStyle = '#f472b6';
        ctx.font = `bold italic ${fontSize}px Palatino, Georgia, serif`;
        ctx.fillText('*risos*', curX, curY);
        curX += ctx.measureText('*risos*').width;
        ctx.font = `italic ${fontSize}px Palatino, Georgia, serif`;
        if (parts[1]) {
          ctx.fillStyle = '#fef9c3';
          ctx.fillText(parts[1], curX, curY);
        }
      } else {
        ctx.fillStyle = (speaker === 'fairy' && mood === 'annoyed' && lineIdx === 0) ? '#fde047' : '#fef9c3';
        ctx.fillText(lineStr, textX, curY);
      }
    });

    // 5. Advance prompt (dedicated bottom right corner, guaranteed non-overlapping)
    const blink = Math.sin(tick * 0.1) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(253, 224, 71, ${blink})`;
    ctx.font = 'bold 11.5px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(advancePrompt, boxX + boxW - 14, boxY + boxH - 10);

    ctx.restore();
  }

  // --- TUTORIAL VISUAL GUIDE (PRIMEIRA PLATAFORMA DA FASE 3) ---
  function drawTutorialArrow(camX) {
    if (!isPhase3 || baby.currentPlatformIndex >= 0 || phase3Platforms.length === 0) return;
    const p0 = phase3Platforms[0];
    const sx = p0.x - camX + p0.w / 2;
    const sy = p0.y;

    ctx.save();
    // Glowing pulsing landing target zone on the first platform
    const pulse = Math.sin(tick * 0.1) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(250, 204, 21, ${0.4 * pulse})`;
    ctx.beginPath();
    ctx.ellipse(sx, sy + 6, p0.w * 0.42, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Floating bouncing guide arrow
    const bob = Math.sin(tick * 0.12) * 5;
    const arrowY = sy - 26 + bob;

    // Tag bubble
    ctx.fillStyle = 'rgba(15, 12, 24, 0.92)';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(sx - 52, arrowY - 22, 104, 22, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 10.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('▼ SUBA AQUI!', sx, arrowY - 7);

    // Downward triangle
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(sx - 7, arrowY + 3);
    ctx.lineTo(sx + 7, arrowY + 3);
    ctx.lineTo(sx, arrowY + 11);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
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
      const ribbonRate = phase3Level >= 10 ? 1 : 2;
      if (tick % ribbonRate === 0) {
        const stats = getPhase3Stats(phase3Level);
        const palette = ['#c084fc', '#f472b6', '#38bdf8', '#facc15', '#34d399'];
        const chosenColor = palette[Math.floor(Math.random() * Math.min(palette.length, 2 + Math.floor(phase3Level / 4)))];
        for (let s = 0; s < stats.trailIntensity; s++) {
          speedRibbons.push({
            x: baby.x + baby.w + Math.random() * 8,
            y: baby.y + baby.h - 6 + (Math.random() - 0.5) * 6,
            vx: Math.abs(baby.vx) * (0.35 + Math.random() * 0.25),
            vy: (Math.random() - 0.5) * 1.5,
            size: 3.5 + Math.random() * (3 + phase3Level * 0.35),
            color: chosenColor,
            life: 1.0,
            decay: 0.038
          });
        }
      }
    } else if (isEscapeMode && !baby.onGround) {
      const ribbonRate = escapeLevel >= 8 ? 1 : 2;
      if (tick % ribbonRate === 0) {
        const stats = getEscapeStats(escapeLevel);
        const palette = ['#facc15', '#38bdf8', '#f472b6', '#a855f7', '#34d399'];
        const chosenColor = palette[Math.floor(Math.random() * Math.min(palette.length, 2 + Math.floor(escapeLevel / 3)))];
        for (let s = 0; s < stats.trailIntensity; s++) {
          speedRibbons.push({
            x: baby.x + 4 + Math.random() * 8,
            y: baby.y + baby.h - 6 + (Math.random() - 0.5) * 6,
            vx: -baby.vx * (0.35 + Math.random() * 0.25),
            vy: (Math.random() - 0.5) * 1.5,
            size: 3.5 + Math.random() * (3 + escapeLevel * 0.35),
            color: chosenColor,
            life: 1.0,
            decay: 0.038
          });
        }
      }
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

    // Screen movement & Camera tracking
    if (isPhase3) {
      // Leftward autoscroll: targetScrollSpeed is negative (e.g. -1.8 to -4.4)
      currentScrollSpeed += (targetScrollSpeed - currentScrollSpeed) * 0.05 * dt;
      cameraX += currentScrollSpeed * dt;
      const targetCamX = baby.x - (canvas.width > 600 ? canvas.width - 250 : canvas.width - 160);
      cameraX += (targetCamX - cameraX) * 0.08 * dt;

      // If player lags too far behind to the right of the moving screen, trigger Game Over
      if (baby.x > cameraX + canvas.width + 50) {
        triggerGameOver();
        return;
      }
    } else if (isEscapeMode) {
      // Screen autoscrolls forward with gradual progression
      currentScrollSpeed += (targetScrollSpeed - currentScrollSpeed) * 0.05 * dt;
      cameraX += currentScrollSpeed * dt;
      const targetCamX = baby.x - (canvas.width > 600 ? 170 : 120);
      if (targetCamX > cameraX) {
        cameraX += (targetCamX - cameraX) * 0.09 * dt;
      }

      // If player lags too far behind the moving screen, trigger Game Over
      if (baby.x < cameraX - 25) {
        triggerGameOver();
        return;
      }
    } else {
      let targetCamX = baby.x - (canvas.width > 600 ? 180 : 120);
      if (targetCamX < 0) targetCamX = 0;
      cameraX += (targetCamX - cameraX) * 0.08;
    }

    // Vertical camera tracking with dynamic headroom (keeps baby safely framed in illuminated area)
    const minCeilingHeadroom = isPortrait ? 130 : 90;
    let baseFloorCamY = 0;
    if (isPortrait && canvas.height > FLOOR_Y + 90) {
      baseFloorCamY = FLOOR_Y - (canvas.height - 110);
    }

    // Dynamic vertical tracking: if baby jumps or reaches high platforms, camera smoothly ascends
    const babyApexTargetY = baby.y - minCeilingHeadroom;
    targetCameraY = Math.min(baseFloorCamY, babyApexTargetY);
    cameraY += (targetCameraY - cameraY) * 0.12;

    // Hard visual ceiling clamp: guarantees the character sprite NEVER leaves the illuminated viewport
    const ceilingClampY = cameraY + 44;
    if (baby.y < ceilingClampY) {
      baby.y = ceilingClampY;
      if (baby.vy < 0) baby.vy = 0;
    }
  }

  // --- RENDER ---
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Cinematic camera zoom during cutscene
    if (cameraZoom !== 1.0) {
      const focusX = (baby.x + fairy.x) / 2 - cameraX;
      const focusY = (baby.y + fairy.y) / 2 - cameraY;
      ctx.translate(focusX, focusY);
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(-focusX, -focusY);
    }
    ctx.translate(0, -cameraY);

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
    if (transitionWipeAlpha > 0) {
      ctx.save();
      const originX = trueExitDoor.x + trueExitDoor.w / 2 - cameraX;
      const originY = trueExitDoor.y + trueExitDoor.h / 2 - cameraY;
      const maxDist = Math.hypot(canvas.width, canvas.height);
      const radius = maxDist * Math.min(1.0, transitionWipeAlpha * 1.25);

      const wipeGrad = ctx.createRadialGradient(originX, originY, 0, originX, originY, Math.max(1, radius));
      wipeGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      wipeGrad.addColorStop(0.35, 'rgba(254, 240, 138, 0.98)');
      wipeGrad.addColorStop(0.75, 'rgba(251, 191, 36, 0.95)');
      wipeGrad.addColorStop(0.95, 'rgba(217, 119, 6, 0.9)');
      wipeGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');

      ctx.fillStyle = wipeGrad;
      ctx.beginPath();
      ctx.arc(originX, originY, radius, 0, Math.PI * 2);
      ctx.fill();

      if (transitionWipeAlpha > 0.6) {
        const fullAlpha = (transitionWipeAlpha - 0.6) / 0.4;
        ctx.fillStyle = `rgba(255, 250, 230, ${fullAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Floating celebratory ascension sparkles
      const pCount = 20;
      for (let i = 0; i < pCount; i++) {
        const angle = (i / pCount) * Math.PI * 2 + tick * 0.05;
        const dist = (radius * 0.42) + Math.sin(tick * 0.1 + i) * 25;
        const px = originX + Math.cos(angle) * dist;
        const py = originY + Math.sin(angle) * dist;
        ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#fef08a';
        ctx.beginPath();
        ctx.arc(px, py, 2.5 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

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
    render();
    requestAnimationFrame(loop);
  }

  const inputHandler = bindInput({
    doJump,
    isGrounded: () => Boolean(baby && baby.onGround && !baby.controlsLocked && !baby.respawnLandingPending && !baby.isCrouching && !isStandbyActive),
    isCutsceneActive: () => Boolean(cutsceneActive || isStandbyActive || (plotTwistActive && plotTwistStep >= 4)),
    isGameOver: () => isGameOver,
    isToyRoomMode: () => currentPhaseMode === 'toy-room',
    setLastInputDevice
  });

  // Initial draw so the canvas renders the scene behind the title screen
  render();

  return {
    start() {
      gameStarted = true;
      startStandbyPreparation();
      if (currentPhaseMode === 'toy-room') {
        audio.startToyRoomMusic();
      } else {
        audio.startMusic();
      }
      if (!loopStarted) {
        loopStarted = true;
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
