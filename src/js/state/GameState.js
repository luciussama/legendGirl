import {
  FLOOR_Y,
  platforms,
  phase3Platforms,
  trueExitDoor,
  getEscapeStats,
  getPhase3Stats
} from '../config.js';
import { createDefaultStateVariables } from './StateVariables.js';

export class GameState {
  constructor(canvas, uiFeedback, callbacks = {}) {
    this.canvas = canvas;
    this.uiFeedback = uiFeedback;
    this.callbacks = callbacks;

    // Inicializa todas as variáveis padrão de estado
    Object.assign(this, createDefaultStateVariables());
  }

  setLastInputDevice(dev) {
    if (dev === 'keyboard' || dev === 'gamepad' || dev === 'touch') {
      this.lastUsedInputDevice = dev;
    }
  }

  getActivePromptDevice() {
    if (this.lastUsedInputDevice === 'gamepad') return 'gamepad';
    if (this.lastUsedInputDevice === 'touch') return 'touch';
    if (typeof window !== 'undefined') {
      try {
        const gps = navigator.getGamepads ? navigator.getGamepads() : null;
        if (gps && Array.from(gps).some(gp => gp && gp.connected)) {
          if (this.lastUsedInputDevice === 'gamepad') return 'gamepad';
        }
      } catch (e) {}
      if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
        return 'touch';
      }
    }
    return 'keyboard';
  }

  spawnFairySparkles(x, y, count = 2) {
    const fairyHues = [48, 52, 192, 330, 280];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.6;
      const chosenHue = fairyHues[Math.floor(Math.random() * fairyHues.length)];
      this.fairy.particles.push({
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

  spawnFairyFlightDust(fx, fy, fvx, fvy) {
    const fairyHues = [48, 52, 192, 330, 280]; // Warm Gold, Ethereal Cyan, Rose, Violet
    const chosenHue = fairyHues[Math.floor(Math.random() * fairyHues.length)];
    const angle = Math.random() * Math.PI * 2;
    const driftSpeed = 0.2 + Math.random() * 0.45;
    this.fairy.particles.push({
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

  updateFairyParticles() {
    for (let i = this.fairy.particles.length - 1; i >= 0; i--) {
      const p = this.fairy.particles[i];
      p.wobble = (p.wobble || 0) + (p.wobbleSpeed || 0.06);
      p.x += p.vx + Math.sin(p.wobble) * 0.25;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) {
        this.fairy.particles.splice(i, 1);
      }
    }
  }

  startStandbyPreparation(audio) {
    this.isStandbyActive = true;
    this.isStandbyTransitioning = false;
    this.standbyTransitionTimer = 0;
    this.standbyTransitionProgress = 0;
    this.standbyStandUpProgress = 0;
    this.standbyDialogueAlpha = 1.0;
    this.standbyActivatedTime = performance.now();

    this.baby.vx = 0;
    this.baby.vy = 0;
    this.baby.isCrouching = true;
    this.baby.controlsLocked = true;
    this.baby.onGround = true;
    this.baby.respawnLandingPending = false;
    this.baby.animTime = 0;

    // Posiciona a fadinha flutuando logo acima da menininha, emitindo luz reconfortante
    const fairyOffsetX = this.baby.facing === -1 ? -18 : 18;
    this.fairy.x = this.baby.x + fairyOffsetX;
    this.fairy.y = this.baby.y - 75;
    this.fairy.vx = 0;
    this.fairy.vy = 0;
    this.fairy.spinAnim = 0;

    this.targetCameraZoom = 1.25;
    this.cameraZoom = 1.25;
    const targetCam = this.baby.x - (this.canvas.width > 600 ? this.canvas.width * 0.35 : this.canvas.width * 0.25);
    this.cameraX = targetCam;

    if (audio) {
      audio.playFairyVoiceBlip(780);
    }
  }

  confirmStandby(audio) {
    if (!this.isStandbyActive || this.isStandbyTransitioning) return;
    this.isStandbyActive = false;
    this.isStandbyTransitioning = true;
    this.standbyTransitionTimer = 0;
    this.standbyTransitionProgress = 0;
    this.standbyStandUpProgress = 0;
    this.standbyDialogueAlpha = 1.0;

    // Gesto diegético de encorajamento: pirueta graciosa e explosão de brilhos
    this.fairy.spinAnim = 3.2;
    this.fairy.vy = -2.8;
    this.spawnFairySparkles(this.fairy.x, this.fairy.y, 22);
    if (audio) {
      audio.playFairyVoiceBlip(980);
    }
  }

  resetBabyPhysicsBody(targetX, targetY, facing = 1) {
    this.baby.x = targetX;
    this.baby.y = targetY;
    // 1. Zeração rígida de velocidade linear e forças externas
    this.baby.vx = 0;
    this.baby.vy = 0;
    this.baby.facing = facing;
    this.baby.isShocked = false;
    this.baby.isLyingDown = false;
    // 2. O estado de apoio no chão (onGround) SÓ deve ser validado após o solucionador de colisão confirmar contato com piso/plataforma
    this.baby.onGround = false;
    this.baby.respawnLandingPending = true;
    this.baby.controlsLocked = false;
    // Limpa buffers de impulso e fitas de movimento ativas
    this.speedRibbons.length = 0;
    this.babyJumpDust.length = 0;
    // 3. Tempo de tolerância (240ms) prevenindo acúmulo de entrada de pulo ou clique acidental no renascimento
    this.lastJumpTime = performance.now() + 240;
    // 4. Reinicia o relógio de delta time para eliminar picos de frame rate
    this.lastTime = performance.now();
  }

  triggerGameOver(audio) {
    if (this.isGameOver) return;
    this.isGameOver = true;
    // Interrompe imediatamente qualquer velocidade de queda na derrota
    this.baby.vx = 0;
    this.baby.vy = 0;
    this.baby.onGround = false;
    this.baby.respawnLandingPending = true;
    if (audio) {
      audio.clearActiveSounds();
      audio.playFallFailSound();
    }
    if (this.uiFeedback) {
      this.uiFeedback.innerText = 'Você não conseguiu sair do quarto.';
      this.uiFeedback.style.color = '#f87171';
    }
    const overlay = document.getElementById('gameover-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
    }
    if (this.callbacks && this.callbacks.onGameOver) {
      this.callbacks.onGameOver();
    }
  }

  retryGame(audio) {
    this.isGameOver = false;
    const overlay = document.getElementById('gameover-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
    if (audio) {
      audio.clearActiveSounds();
      audio.startMusic();
    }
    this.lastTime = performance.now();
    // Checkpoint retry: reinicia o jogador diretamente no início da seção da Fase 3 sem som de falha redundante
    this.resetToStart(true, false, audio);
  }

  restartToTitle(audio) {
    this.isGameOver = false;
    this.gameStarted = false;
    if (this.toyRoomInstance) {
      this.toyRoomInstance.destroy();
      this.toyRoomInstance = null;
    }
    this.currentPhaseMode = 'bedroom';
    if (audio) {
      audio.stopToyRoomMusic();
    }
    const overlay = document.getElementById('gameover-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
    if (audio) {
      audio.stopAllAudio(); // Interrompe imediatamente trilha sonora e efeitos
    }
    this.resetToStart(false, false, audio);
    if (this.uiFeedback) {
      this.uiFeedback.innerText = 'Toque na tela para dar um pulinho e seguir a fadinha';
      this.uiFeedback.style.color = '#e2dcd0';
    }
    if (this.callbacks && this.callbacks.onRestartToTitle) {
      this.callbacks.onRestartToTitle();
    }
  }

  showFailMessage() {
    if (this.uiFeedback) {
      this.uiFeedback.innerText = 'Falhou ao seguir a fadinha... Ela voltou para esperar você.';
      this.uiFeedback.style.color = '#f87171';
    }
    if (this.failMessageTimer) {
      clearTimeout(this.failMessageTimer);
    }
    this.failMessageTimer = setTimeout(() => {
      if (this.uiFeedback) {
        this.uiFeedback.innerText = 'Toque na tela para dar um pulinho e seguir a fadinha';
        this.uiFeedback.style.color = '#e6dfd5';
      }
    }, 2800);
  }

  startCastleCutscene(audio) {
    if (audio) audio.clearActiveSounds();
    this.cutsceneActive = true;
    this.cutsceneTriggered = true;
    this.cutsceneStep = 1;
    this.cutsceneTimer = 0;
    this.targetCameraZoom = 1.45;
    this.baby.vx = 0;
    this.baby.vy = 0;
    if (audio) audio.playFairyVoiceBlip(880);
    if (this.uiFeedback) {
      this.uiFeedback.innerText = 'A fadinha quer falar com você! Toque na tela para conversar.';
      this.uiFeedback.style.color = '#fef08a';
    }
  }

  advanceCutscene(audio) {
    if (this.cutsceneStep === 1) {
      this.cutsceneStep = 2;
      this.cutsceneTimer = 0;
      if (audio) audio.playFairyLaugh();
      this.fairy.spinAnim = 2.8;
      this.spawnFairySparkles(this.fairy.x, this.fairy.y, 22);
    } else if (this.cutsceneStep === 2) {
      this.finishCutscene(audio);
    }
  }

  finishCutscene(audio) {
    if (audio) audio.clearActiveSounds();
    this.cutsceneActive = false;
    this.cutsceneCompleted = true;
    this.isEscapeMode = true;
    this.targetCameraZoom = 1.0;
    this.escapeLevel = 0;
    const stats = getEscapeStats(0);
    this.baby.isEscaping = true;
    this.baby.longJumpUnlocked = true;
    this.baby.vx = stats.runVx;
    this.baby.jumpPower = stats.jumpPower;
    this.currentScrollSpeed = stats.scrollSpeed;
    this.targetScrollSpeed = stats.scrollSpeed;
    if (audio) audio.playEscapePowerUp();
    this.escapeBannerTimer = 220;
    this.escapeBannerText = '⚡ MODO FUGA ATIVADO! PULO PROGRESSIVO DESBLOQUEADO!';
    if (this.uiFeedback) {
      this.uiFeedback.innerText = '⚡ MODO FUGA! A cada plataforma o seu pulo e a velocidade aumentam!';
      this.uiFeedback.style.color = '#fef08a';
    }
    this.spawnFairySparkles(this.baby.x + this.baby.w / 2, this.baby.y + this.baby.h / 2, 30);
  }

  startPlotTwistCutscene(audio) {
    if (audio) audio.clearActiveSounds();
    this.plotTwistActive = true;
    this.plotTwistTriggered = true;
    this.plotTwistStep = 1; // 1: Porta falsa escorrega e descola; menina cai
    this.plotTwistTimer = 0;
    this.fakeDoorRevealed = true;
    this.fakeDoorSlideY = 0;
    this.fakeDoorRotation = 0;
    this.baby.isShocked = true;
    this.baby.isLyingDown = false;
    this.baby.vx = 0;
    this.baby.vy = 2.2;
    this.baby.onGround = false;
    this.baby.controlsLocked = true;
    this.targetCameraZoom = 1.25;
    if (audio) {
      audio.playTapeRipSound();
      audio.playDramaticTumbleSound();
    }
    if (this.uiFeedback) {
      this.uiFeedback.innerText = 'Espere... A porta está deslizando pela parede?!';
      this.uiFeedback.style.color = '#f87171';
    }
  }

  advancePlotTwist(audio) {
    if (this.plotTwistStep === 4) {
      // Avança para o diálogo e vaivém da fadinha no ar
      this.plotTwistStep = 5;
      this.plotTwistTimer = 0;
      this.fairy.pacingPhase = 0;
      if (audio) audio.playFairyFrustratedSound();
      if (this.uiFeedback) {
        this.uiFeedback.innerText = 'A fadinha está procurando outro caminho!';
        this.uiFeedback.style.color = '#fef08a';
      }
    } else if (this.plotTwistStep === 5) {
      this.finishPlotTwistAndStartTutorial(audio);
    }
  }

  finishPlotTwistAndStartTutorial(audio) {
    if (audio) audio.clearActiveSounds();
    this.plotTwistActive = false;
    this.plotTwistStep = 0;
    this.isPhase3 = true;
    this.isEscapeMode = false;
    // A menina se levanta do chão e permanece parada com controles bloqueados
    this.baby.isShocked = false;
    this.baby.isLyingDown = false;
    this.baby.facing = -1; // Inverte orientação: voltada para a esquerda!
    this.baby.x = 4640;
    this.baby.y = FLOOR_Y - this.baby.h;
    this.baby.vx = 0;
    this.baby.vy = 0;
    this.baby.onGround = true;
    this.baby.currentPlatformIndex = -1;
    this.baby.controlsLocked = true; // Bloqueio temporário durante demonstração visual
    this.phase3TutorialActive = true;
    this.phase3TutorialProgress = 0;
    this.targetCameraZoom = 1.0;
    this.cameraZoom = 1.0;
    this.cameraX = this.baby.x - (this.canvas.width > 600 ? this.canvas.width - 250 : this.canvas.width - 150);
    this.fairy.x = this.baby.x - 20;
    this.fairy.y = this.baby.y - 15;
    this.fairy.vx = 0;
    this.fairy.vy = 0;
    if (audio) audio.playPhase3StartFanfare();
    this.escapeBannerTimer = 220;
    this.escapeBannerText = '🌪️ FASE 3: A SUBIDA CAÓTICA! ESCALADA RUMO À ESQUERDA!';
    if (this.uiFeedback) {
      this.uiFeedback.innerText = '✨ Observe a fadinha indicando a trajetória do salto...';
      this.uiFeedback.style.color = '#fef08a';
    }
    this.spawnFairySparkles(this.baby.x + this.baby.w / 2, this.baby.y + this.baby.h / 2, 35);
  }

  startTruePortalTransition(audio) {
    if (this.truePortalTransitionActive) return;
    this.truePortalTransitionActive = true;
    this.truePortalTransitionTimer = 0;
    this.trueDoorOpenAngle = 0;
    this.transitionWipeAlpha = 0;
    // Bloqueia imediatamente as entradas de pulo no modo de rolagem lateral
    this.baby.controlsLocked = true;
    this.baby.vx = -1.2;
    this.baby.vy = 0;
    this.baby.facing = -1;
    if (audio) {
      audio.clearActiveSounds();
      audio.playLevelUpChime(14);
    }
    if (this.uiFeedback) {
      this.uiFeedback.innerText = '✨ O Verdadeiro Portal dos Sonhos se abriu!';
      this.uiFeedback.style.color = '#fde047';
    }
    this.spawnFairySparkles(trueExitDoor.x + trueExitDoor.w / 2, trueExitDoor.y + trueExitDoor.h / 2, 40);
  }

  resetToStart(failedMidClimb = false, shouldPlayFailSound = true, audio) {
    if (audio) audio.clearActiveSounds();
    // Redefine a iluminação em todas as plataformas para retornarem ao estado de penumbra
    platforms.forEach(p => { p.isLanded = false; p.lightAlpha = 0; });
    phase3Platforms.forEach(p => { p.isLanded = false; p.lightAlpha = 0; });

    if (failedMidClimb && this.isPhase3) {
      // Checkpoint: recomeça do ponto em que a menina se levanta no início dessa subida
      this.resetBabyPhysicsBody(4640, FLOOR_Y - this.baby.h, -1);
      this.baby.currentPlatformIndex = -1;
      this.phase3TutorialActive = false;
      this.phase3Level = 0;
      const stats = getPhase3Stats(0);
      this.baby.jumpPower = stats.jumpPower;
      this.currentScrollSpeed = stats.scrollSpeed;
      this.targetScrollSpeed = stats.scrollSpeed;
      if (shouldPlayFailSound && audio) {
        audio.playFallFailSound();
      }
      this.startStandbyPreparation(audio);
      return;
    }

    if (failedMidClimb && (this.cutsceneCompleted || this.isEscapeMode)) {
      // Checkpoint: Topo do Castelo (Plataforma 9)
      const castle = platforms[9];
      castle.isLanded = true;
      castle.lightAlpha = 1.0;
      this.resetBabyPhysicsBody(castle.x + 35, castle.y - this.baby.h, 1);
      this.escapeLevel = 0;
      const stats = getEscapeStats(0);
      this.baby.jumpPower = stats.jumpPower;
      this.baby.currentPlatformIndex = 9;
      this.baby.longJumpUnlocked = true;
      this.baby.isEscaping = true;
      this.isEscapeMode = true;
      this.currentScrollSpeed = stats.scrollSpeed;
      this.targetScrollSpeed = stats.scrollSpeed;
      if (shouldPlayFailSound && audio) {
        audio.playFallFailSound();
      }
      this.startStandbyPreparation(audio);
      return;
    }

    this.resetBabyPhysicsBody(60, FLOOR_Y - this.baby.h, 1);
    this.baby.vx = 0;
    this.baby.vy = 0;
    this.baby.jumpPower = -7.2;
    this.baby.currentPlatformIndex = -1;
    this.baby.longJumpUnlocked = false;
    this.baby.isEscaping = false;
    this.isEscapeMode = false;
    this.escapeLevel = 0;
    this.currentScrollSpeed = 1.5;
    this.targetScrollSpeed = 1.5;
    this.firstPlatformCleared = false;
    this.cutsceneActive = false;
    this.cutsceneTriggered = false;
    this.cutsceneCompleted = false;
    this.plotTwistActive = false;
    this.plotTwistTriggered = false;
    this.plotTwistStep = 0;
    this.phase3TutorialActive = false;
    this.isPhase3 = false;
    this.truePortalTransitionActive = false;
    this.truePortalTransitionTimer = 0;
    this.trueDoorOpenAngle = 0;
    this.transitionWipeAlpha = 0;
    this.fakeDoorRevealed = false;
    this.fakeDoorSlideY = 0;
    this.fakeDoorRotation = 0;
    if (failedMidClimb) {
      if (shouldPlayFailSound && audio) {
        audio.playFallFailSound();
      }
    }
    this.startStandbyPreparation(audio);
  }
}

export function createGameState(canvas, uiFeedback, callbacks) {
  return new GameState(canvas, uiFeedback, callbacks);
}
