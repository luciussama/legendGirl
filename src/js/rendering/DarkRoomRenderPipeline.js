import { FLOOR_Y, platforms, phase3Platforms, trueExitDoor } from '../config.js';
import { getMobileZoomFrame } from '../controllers/MobileZoom.js';
import { renderFirstJumpTutorial } from '../ui/FirstJumpTutorial.js';
import { applyArtFinish } from '../effects/ArtFinish.js';
import { transitionEffects } from '../effects/index.js';

// Composição visual: a atualização da simulação permanece no fluxo do jogo.
export function renderDarkRoom(context) {
  const { ctx, canvas, toyRoomIntroduction, opening, assets, lighting, fairyRenderer, cameraPresentation, camera, androidFraming, mobilePresentation, baby, fairy, cameraX, cameraY, cameraZoom, targetCameraY, targetScrollSpeed, isPhase3, plotTwistActive, phase3TutorialActive, truePortalTransitionActive, tick, gameWon, transitionWipeAlpha, inputHandler, recordCameraQa, drawBackgroundWall, drawSceneryItems, drawPlatforms, drawExitDoor, drawTrueExitDoor, drawTutorialArrow, drawSpeedRibbons, drawBabyJumpDust, drawFairy, drawBabyManaStyle, applyDarkAtmosphereWithLights, drawEscapeBanner, drawCutsceneDialogue, state } = context;

    if (toyRoomIntroduction.active) { toyRoomIntroduction.render(ctx, canvas); return; }
    if (opening.active && !opening.revealing) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      recordCameraQa();
      opening.render(ctx, canvas, {assets, lighting, fairyRenderer,
        drawRoom: () => { drawBackgroundWall(0); drawSceneryItems(0); drawPlatforms(0); }
      });
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // A translação de apresentação fica fora da câmera usada pela física.
    const cameraNarrative = Boolean(opening.active || plotTwistActive || phase3TutorialActive || truePortalTransitionActive);
    // Alvo visual de regime permanente do follow existente (fator lógico de 0.08), sem mudar sua atualização.
    const groundLead = (canvas.width > 600 ? canvas.width - 250 : canvas.width - 160)
      + 11.5 * (baby.vx - targetScrollSpeed);
    // Normaliza a pose efetivamente desenhada também nos ramos narrativos que atualizam valores locais.
    const renderCameraX = cameraX + (1 - camera.zoom) * (camera.x - cameraX);
    const presentation = cameraPresentation.frame({ x: renderCameraX, y: camera.y,
      playerX: baby.x, groundLead, targetY: targetCameraY,
      onGround: baby.onGround, active: isPhase3 || plotTwistActive,
      narrative: cameraNarrative, tick, width: canvas.width, height: canvas.height,
      cssWidth: canvas.getBoundingClientRect().width, cssHeight: canvas.getBoundingClientRect().height, zoom: camera.zoom });
    const presentationY = presentation.y;
    const presentationX = isPhase3 || plotTwistActive ? presentation.x : cameraX;
    const focusY = (baby.y + fairy.y) / 2 - presentationY;
    const screenY = y => focusY + (y - presentationY - focusY) * camera.zoom;
    const visiblePlatforms = (isPhase3 ? phase3Platforms : platforms).filter(p =>
      p.x + p.w >= cameraX && p.x <= cameraX + canvas.width && screenY(p.y) >= 0);
    const topY = Math.min(screenY(baby.y - 20), screenY(fairy.y - 24),
      ...visiblePlatforms.map(p => screenY(p.y - 64)));
    const framingOffset = androidFraming.offset(screenY(FLOOR_Y), topY);
    const focusX = (baby.x + fairy.x) / 2 - presentationX;
    const screenX = x => focusX + (x - presentationX - focusX) * camera.zoom;
    const activePlatforms = isPhase3 ? phase3Platforms : platforms;
    const next = activePlatforms[baby.currentPlatformIndex + 1];
    const points = [
      [baby.x - 12, baby.y - 20], [baby.x + baby.w + 12, baby.y + baby.h + 8],
      [fairy.x - 28, fairy.y - 28], [fairy.x + 28, fairy.y + 28]
    ];
    if (next) {
      const support = next.standRegion || next;
      const y = next.surfaceTopY ?? support.y;
      // Apoios largos podem continuar além da tela; preserva a região de chegada do salto.
      const landingWidth = Math.min(support.w, 96);
      const landingX = isPhase3 ? support.x + support.w - landingWidth : support.x;
      points.push([landingX, y - 24], [landingX + landingWidth, y + 24]);
    }
    const bounds = {
      left: Math.min(...points.map(p => screenX(p[0]))), right: Math.max(...points.map(p => screenX(p[0]))),
      top: Math.min(...points.map(p => screenY(p[1]) - framingOffset)),
      bottom: Math.max(...points.map(p => screenY(p[1]) - framingOffset))
    };
    const mobileTarget = getMobileZoomFrame({ enabled: mobilePresentation.enabled, stable: isPhase3 || plotTwistActive, anticipate: isPhase3,
      width: canvas.width, height: canvas.height, bounds,
      anchor: { x: screenX(baby.x + baby.w / 2), y: screenY(baby.y + baby.h) - framingOffset } });
    const mobileFrame = cameraPresentation.mobileFrame({ target: mobileTarget, enabled: mobilePresentation.enabled,
      stable: isPhase3 || plotTwistActive, anticipate: isPhase3, tick, width: canvas.width, height: canvas.height });
    ctx.save();
    ctx.translate(mobileFrame.x, mobileFrame.y);
    ctx.scale(mobileFrame.zoom, mobileFrame.zoom);
    ctx.translate(0, -framingOffset);
    camera.applyTransform(ctx, canvas, baby, fairy, presentationY, presentation.x, cameraX);
    recordCameraQa(ctx.getTransform());

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

    const presentationTransform = ctx.getTransform();
    ctx.restore();

    // Elementos de interface (HUD) renderizados em coordenadas nítidas de tela
    applyArtFinish(ctx, canvas);
    drawEscapeBanner();
    renderFirstJumpTutorial(ctx, canvas, { state, baby, fairy, platform: platforms[0], cameraX,
      transform: presentationTransform, device: inputHandler.controller.promptDevice });
    drawCutsceneDialogue(presentationTransform);
    if (opening.active) opening.renderFade(ctx, canvas);

    // Transição de íris do portal verdadeiro (envelope de luz dourada para a Sala de Brinquedos)
    transitionEffects.renderPortalWipe(ctx, canvas, cameraX, cameraY + framingOffset, trueExitDoor, transitionWipeAlpha, tick, mobilePresentation.enabled ? presentationTransform : null);

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
