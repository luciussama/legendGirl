import { FLOOR_Y, platforms, phase3Platforms, exitDoor, trueExitDoor, getEscapeStats, getPhase3Stats } from '../config.js';

// Sequências narrativas preservadas; não executa a atualização normal de física.

export function updateStandbyNarrative(context, dt) {
  const { state, baby, fairy, canvas, audio, uiFeedback, spawnFairyFlightDust, spawnFairySparkles, updateFairyParticles, updateBabyJumpDust, advanceCutscene, finishCutscene, advancePlotTwist, finishPlotTwistAndStartTutorial, startStandbyPreparation, saveProgress, beginToyRoomIntroduction } = context;

      baby.vx = 0;
      baby.vy = 0;
      baby.animTime = 0;
      baby.onGround = true;

      // Fadinha flutua acima dela emitindo pulsação suave
      const hoverX = baby.x + (baby.facing === -1 ? -18 : 18);
      const hoverY = baby.y - 75 + Math.sin(state.tick * 0.05) * 5;
      fairy.x += (hoverX - fairy.x) * 0.1;
      fairy.y += (hoverY - fairy.y) * 0.1;
      fairy.flutterPhase += 0.3;

      if (state.tick % 5 === 0) {
        spawnFairyFlightDust(fairy.x, fairy.y, 0, -0.2);
      }

      // Câmera acolhedora nas duas
      state.targetCameraZoom = 1.25;
      state.cameraZoom += (state.targetCameraZoom - state.cameraZoom) * 0.08;
      const targetCam = baby.x - (canvas.width > 600 ? canvas.width * 0.35 : canvas.width * 0.25);
      state.cameraX += (targetCam - state.cameraX) * 0.08;

      updateFairyParticles();
      updateBabyJumpDust();
      return;
    }

export function updateTransicaoStandbyNarrative(context, dt) {
  const { state, baby, fairy, canvas, audio, uiFeedback, spawnFairyFlightDust, spawnFairySparkles, updateFairyParticles, updateBabyJumpDust, advanceCutscene, finishCutscene, advancePlotTwist, finishPlotTwistAndStartTutorial, startStandbyPreparation, saveProgress, beginToyRoomIntroduction } = context;

      state.standbyTransitionTimer += dt;
      state.standbyTransitionProgress = Math.min(1.0, state.standbyTransitionTimer / 24);
      state.standbyStandUpProgress = state.standbyTransitionProgress;
      state.standbyDialogueAlpha = Math.max(0, 1.0 - state.standbyTransitionProgress * 1.5);

      // Pirueta e faíscas da fadinha
      fairy.spinAnim = Math.max(0, fairy.spinAnim - 0.08);
      fairy.flutterPhase += 0.55;
      fairy.y += Math.sin(state.standbyTransitionProgress * Math.PI) * -0.4;

      if (state.tick % 3 === 0 && state.standbyTransitionProgress < 0.8) {
        spawnFairySparkles(fairy.x, fairy.y, 2);
      }

      // Câmera retorna ao zoom normal
      state.targetCameraZoom = 1.0;
      state.cameraZoom += (state.targetCameraZoom - state.cameraZoom) * 0.08;
      const targetCam = baby.x - (canvas.width > 600 ? 190 : 130);
      state.cameraX += (targetCam - state.cameraX) * 0.08;

      if (state.standbyTransitionProgress >= 1.0) {
        state.isStandbyTransitioning = false;
        baby.isCrouching = false;
        baby.controlsLocked = false;
        baby.onGround = true;
        baby.respawnLandingPending = false;

        if (state.isPhase3) {
          const stats = getPhase3Stats(0);
          baby.vx = stats.runVx;
        } else if (state.isEscapeMode) {
          if (baby.currentPlatformIndex === 9) {
            // Efeito escondido: no castelo, aguarda o jogador apertar para dar o pulo
            baby.vx = 0;
            state.currentScrollSpeed = 0;
            state.targetScrollSpeed = 0;
          } else {
            const stats = getEscapeStats(state.escapeLevel);
            baby.vx = stats.runVx || 2.4;
          }
        } else {
          baby.vx = baby.baseVx;
        }
        state.lastTime = performance.now();
      }

      updateFairyParticles();
      updateBabyJumpDust();
      return;
    }

export function updateCasteloNarrative(context, dt) {
  const { state, baby, fairy, canvas, audio, uiFeedback, spawnFairyFlightDust, spawnFairySparkles, updateFairyParticles, updateBabyJumpDust, advanceCutscene, finishCutscene, advancePlotTwist, finishPlotTwistAndStartTutorial, startStandbyPreparation, saveProgress, beginToyRoomIntroduction } = context;

      state.cutsceneTimer++;
      state.targetCameraZoom = 1.45;
      state.cameraZoom += (state.targetCameraZoom - state.cameraZoom) * 0.08;

      // Foca a câmera suavemente entre a fada e a menina
      const cutsceneCamTarget = (baby.x + fairy.x) / 2 - 200;
      state.cameraX += (cutsceneCamTarget - state.cameraX) * 0.08;

      if (state.cutsceneStep === 1) {
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

        if (state.tick % 2 === 0) {
          spawnFairyFlightDust(fairy.x, fairy.y, fairy.vx, fairy.vy);
        }
        if (state.cutsceneTimer > 450) {
          advanceCutscene();
        }
      } else if (state.cutsceneStep === 2) {
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

        if (state.tick % 2 === 0) {
          spawnFairyFlightDust(fairy.x, fairy.y, fairy.vx, fairy.vy);
        }
        if (state.cutsceneTimer > 420) {
          finishCutscene();
        }
      }

      // Atualiza partículas durante a cena cinemática
      updateFairyParticles();
      updateBabyJumpDust();

      return;
    }

export function updateReviravoltaNarrative(context, dt) {
  const { state, baby, fairy, canvas, audio, uiFeedback, spawnBabyLandingPuff, spawnFairyFlightDust, spawnFairySparkles, updateFairyParticles, updateBabyJumpDust, advanceCutscene, finishCutscene, advancePlotTwist, finishPlotTwistAndStartTutorial, startStandbyPreparation, saveProgress, beginToyRoomIntroduction } = context;

      if (state.plotTwistStep === 1) {
        // Step 1: Porta falsa escorrega e descola; menina cai desequilibrada
        state.fakeDoorSlideY += 6.5;
        state.fakeDoorRotation += 0.024;
        baby.isShocked = true;
        baby.isLyingDown = false;
        baby.onGround = false;
        baby.vx = 0;
        baby.vy += 0.55;
        baby.y += baby.vy;
        baby.animTime += 0.22;
        state.targetCameraZoom = 1.35;
        state.cameraZoom += (state.targetCameraZoom - state.cameraZoom) * 0.09;
        const camTarget = baby.x - (canvas.width > 600 ? 220 : 130);
        state.cameraX += (camTarget - state.cameraX) * 0.09;

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
          state.plotTwistStep = 2; // Passa para a checagem da fadinha no chão
          state.plotTwistTimer = 0;
        }
      } else if (state.plotTwistStep === 2) {
        // Step 2: Menina estirada no chão. A fadinha desce ao chão perto dela para checar o que aconteceu.
        state.plotTwistTimer++;
        baby.isShocked = true;
        baby.isLyingDown = true;
        baby.onGround = true;
        baby.vx = 0;
        baby.vy = 0;

        state.targetCameraZoom = 1.55;
        state.cameraZoom += (state.targetCameraZoom - state.cameraZoom) * 0.07;
        const targetCam = baby.x - (canvas.width > 600 ? 190 : 130);
        state.cameraX += (targetCam - state.cameraX) * 0.08;

        // Fadinha desce até a altura do chão ao lado da menina
        const targetFairyX = baby.x + 35;
        const targetFairyY = FLOOR_Y - 22;
        fairy.x += (targetFairyX - fairy.x) * 0.09;
        fairy.y += (targetFairyY - fairy.y) * 0.09;
        fairy.flutterPhase += 0.35;

        if (state.tick % 3 === 0) {
          spawnFairyFlightDust(fairy.x, fairy.y, 0, -0.4);
        }

        // Após checar a menina no chão (~1.3s), a fadinha voa para cima
        if (state.plotTwistTimer > 80) {
          state.plotTwistStep = 3;
          state.plotTwistTimer = 0;
        }
      } else if (state.plotTwistStep === 3) {
        // Step 3: A fadinha voa para cima, posicionando-se acima da altura da cabeça da menina.
        state.plotTwistTimer++;
        baby.isShocked = true;
        baby.isLyingDown = true;
        baby.onGround = true;
        baby.vx = 0;
        baby.vy = 0;

        state.targetCameraZoom = 1.35;
        state.cameraZoom += (state.targetCameraZoom - state.cameraZoom) * 0.07;
        const targetCam = baby.x - (canvas.width > 600 ? 190 : 130);
        state.cameraX += (targetCam - state.cameraX) * 0.08;

        // A fadinha sobe alto acima da cabeça da menina
        const targetFairyX = baby.x + 10;
        const targetFairyY = baby.y - 105;
        fairy.x += (targetFairyX - fairy.x) * 0.08;
        fairy.y += (targetFairyY - fairy.y) * 0.08;
        fairy.flutterPhase += 0.45;

        if (state.tick % 2 === 0) {
          spawnFairyFlightDust(fairy.x, fairy.y, 0, -0.5);
        }

        // Quando a fadinha atinge a altura acima da cabeça, inicia o diálogo da menina
        if (state.plotTwistTimer > 70) {
          state.plotTwistStep = 4;
          state.plotTwistTimer = 0;
          audio.playBabyShockVoice();
          uiFeedback.innerText = 'Mas ali não era a porta...? A criança pergunta estirada no chão!';
          uiFeedback.style.color = '#fef08a';
        }
      } else if (state.plotTwistStep === 4) {
        // Step 4: Menina estirada no chão e fada no alto: diálogo da menina
        state.plotTwistTimer++;
        baby.isShocked = true;
        baby.isLyingDown = true;
        baby.onGround = true;

        state.targetCameraZoom = 1.35;
        state.cameraZoom += (state.targetCameraZoom - state.cameraZoom) * 0.07;
        const targetCam = baby.x - (canvas.width > 600 ? 190 : 130);
        state.cameraX += (targetCam - state.cameraX) * 0.08;

        // Fadinha flutua suavemente no alto, desobstruída acima da UI
        fairy.x += (baby.x + 10 - fairy.x) * 0.07;
        fairy.y += (baby.y - 105 - fairy.y) * 0.07;
        fairy.flutterPhase += 0.35;

        if (state.plotTwistTimer > 320) {
          advancePlotTwist();
        }
      } else if (state.plotTwistStep === 5) {
        // Step 5: Fadinha expressa frustração ("Droga! Como se virar em toda essa bagunça?...") e voa de um lado para o outro no ar
        state.plotTwistTimer++;
        baby.isShocked = true;
        baby.isLyingDown = true;
        baby.onGround = true;

        state.targetCameraZoom = 1.35;
        state.cameraZoom += (state.targetCameraZoom - state.cameraZoom) * 0.07;
        const targetCam = baby.x - (canvas.width > 600 ? 190 : 130);
        state.cameraX += (targetCam - state.cameraX) * 0.08;

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

        if (state.tick % 2 === 0) {
          spawnFairyFlightDust(fairy.x, fairy.y, Math.cos(fairy.pacingPhase) * 1.5, 0);
        }

        if (state.plotTwistTimer > 380) {
          finishPlotTwistAndStartTutorial();
        }
      }

      updateFairyParticles();
      updateBabyJumpDust();
      return;
    }

export function updateTutorialRetornoNarrative(context, dt) {
  const { state, baby, fairy, canvas, audio, uiFeedback, spawnBabyLandingPuff, spawnFairyFlightDust, spawnFairySparkles, updateFairyParticles, updateBabyJumpDust, advanceCutscene, finishCutscene, advancePlotTwist, finishPlotTwistAndStartTutorial, startStandbyPreparation, saveProgress, beginToyRoomIntroduction } = context;

      state.phase3TutorialProgress += 0.010; // ~2.5s de demonstração suave e clara
      const p0 = phase3Platforms[0];
      const startX = baby.x - 20;
      const startY = baby.y - 20;
      const endX = p0.x + p0.w / 2;
      const endY = p0.y - 30;

      // Trajetória em arco parabólico suave da fada voando até a primeira plataforma
      const t = Math.min(1.0, state.phase3TutorialProgress);
      const arcHeight = 110;
      fairy.x = startX + (endX - startX) * t;
      fairy.y = startY + (endY - startY) * t - Math.sin(t * Math.PI) * arcHeight;
      fairy.flutterPhase += 0.45;

      if (state.tick % 2 === 0) {
        spawnFairyFlightDust(fairy.x, fairy.y, -1.6, -0.3);
      }
      if (state.tick % 4 === 0) {
        spawnFairySparkles(fairy.x, fairy.y, 2);
      }

      // Câmera enquadra a demonstração com suavidade
      const tutorialCam = (baby.x * (1 - t * 0.7) + fairy.x * (t * 0.7)) - (canvas.width > 600 ? canvas.width * 0.45 : canvas.width * 0.4);
      state.cameraX += (tutorialCam - state.cameraX) * 0.08;

      updateFairyParticles();
      updateBabyJumpDust();

      if (state.phase3TutorialProgress >= 1.0) {
        // Demonstração finalizada: libera controles e inicia a corrida no chão livre
        state.phase3TutorialActive = false;
        baby.controlsLocked = false;
        const stats = getPhase3Stats(0);
        baby.vx = stats.runVx;
        uiFeedback.innerText = '⚡ Corra para a esquerda e salte na primeira plataforma!';
        uiFeedback.style.color = '#fde047';
        audio.playLevelUpChime(0);
      }
      return;
    }

export function updatePortalNarrative(context, dt) {
  const { state, baby, fairy, canvas, audio, uiFeedback, spawnBabyLandingPuff, spawnFairyFlightDust, spawnFairySparkles, updateFairyParticles, updateBabyJumpDust, advanceCutscene, finishCutscene, advancePlotTwist, finishPlotTwistAndStartTutorial, startStandbyPreparation, saveProgress, beginToyRoomIntroduction } = context;

      state.truePortalTransitionTimer += dt;

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
      state.cameraX += (targetCamX - state.cameraX) * 0.08 * dt;

      // Abre as portas ornamentadas do portal
      if (state.trueDoorOpenAngle < 1.0) {
        state.trueDoorOpenAngle = Math.min(1.0, state.trueDoorOpenAngle + 0.018 * dt);
      }

      // Fada adeja em frente à porta e voa alegremente para dentro
      if (state.truePortalTransitionTimer < 65) {
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

      if (state.tick % 2 === 0) {
        spawnFairySparkles(fairy.x, fairy.y, 2);
        spawnFairyFlightDust(fairy.x, fairy.y, -1.2, 0);
      }

      if (state.truePortalTransitionTimer >= 125) {
        saveProgress();
        state.truePortalTransitionActive = false;
        beginToyRoomIntroduction();
        return;
      }

      updateFairyParticles();
      updateBabyJumpDust();
      return;
    }
