import { getDarkRoomScrollFrame } from './CameraPresentation.js';

/**
 * CameraController.js
 * Gerencia rolagem lateral no gameplay, enquadramento fixo por viewport e cortes narrativos.
 * Nunca corrige a posição ou a velocidade da personagem.
 */

export class CameraController {
  constructor(options = {}) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.targetY = options.targetY || 0;
    this.zoom = options.zoom || 1.0;
    this.targetZoom = options.targetZoom || 1.0;

    this.floorY = options.floorY || 450;
  }

  reset(x = 0, y = 0, zoom = 1.0) {
    this.x = x;
    this.y = y;
    this.targetY = y;
    this.zoom = zoom;
    this.targetZoom = zoom;
  }

  setZoom(zoom, immediate = false) {
    this.targetZoom = zoom;
    if (immediate) {
      this.zoom = zoom;
    }
  }

  setPosition(x, y, immediate = false) {
    this.targetZoom = immediate ? this.zoom : this.targetZoom;
    if (immediate) {
      this.x = x;
      this.y = y;
      this.targetY = y;
    } else {
      this.targetY = y;
    }
  }

  /**
   * Atualiza a rolagem lateral; zoom e movimentos livres pertencem somente às cenas
   * @param {number} dt Fator de variação de tempo
   * @param {object} state Instância atual do GameState
   * @param {HTMLCanvasElement} canvas Referência do Canvas
   * @param {object} callbacks Funções de retorno como onLagBehind / onGameOver
   */
  update(dt, state, canvas, callbacks = {}) {
    if (!state || !canvas) return;

    const baby = state.baby;
    const fairy = state.fairy;
    const isWide = canvas.width > 600;

    // 1. Enquadramento no estado de prontidão (Standby)
    if (state.isStandbyActive) {
      this.targetZoom = 1.25;
      this.zoom += (this.targetZoom - this.zoom) * 0.08;
      const targetCam = baby.x - (isWide ? canvas.width * 0.35 : canvas.width * 0.25);
      this.x += (targetCam - this.x) * 0.08;
      this.syncToState(state);
      return;
    }

    // 2. Transição de prontidão retornando ao zoom normal
    if (state.isStandbyTransitioning) {
      this.targetZoom = 1.0;
      this.zoom += (this.targetZoom - this.zoom) * 0.08;
      const targetCam = baby.x - (isWide ? 190 : 130);
      this.x += (targetCam - this.x) * 0.08;
      this.syncToState(state);
      return;
    }

    // 3. Enquadramento na Cinemática do Castelo
    if (state.cutsceneActive) {
      this.targetZoom = 1.45;
      this.zoom += (this.targetZoom - this.zoom) * 0.08;
      const cutsceneCamTarget = (baby.x + fairy.x) / 2 - (isWide ? 240 : 150);
      this.x += (cutsceneCamTarget - this.x) * 0.08;
      this.syncToState(state);
      return;
    }

    // 4. Enquadramento na Cinemática da Reviravolta (Plot Twist)
    if (state.plotTwistActive) {
      this.targetZoom = 1.25;
      this.zoom += (this.targetZoom - this.zoom) * 0.07;
      const targetCam = baby.x - (isWide ? 220 : 140);
      this.x += (targetCam - this.x) * 0.08;
      this.syncToState(state);
      return;
    }

    // 5. Enquadramento no Tutorial da Fase 3
    if (state.phase3TutorialActive) {
      this.targetZoom = 1.0;
      this.zoom += (this.targetZoom - this.zoom) * 0.08;
      const tutorialCam = baby.x - (isWide ? canvas.width - 240 : canvas.width - 150);
      this.x += (tutorialCam - this.x) * 0.08;
      this.syncToState(state);
      return;
    }

    // 6. Enquadramento na Transição para o Portal Verdadeiro
    if (state.truePortalTransitionActive) {
      this.targetZoom = 1.25;
      this.zoom += (this.targetZoom - this.zoom) * 0.06;
      const exitDoorCenterX = (callbacks.exitDoorX || 120) + (callbacks.exitDoorW || 58) / 2;
      const targetCamX = exitDoorCenterX - (isWide ? 250 : 160);
      this.x += (targetCamX - this.x) * 0.08 * dt;
      this.syncToState(state);
      return;
    }

    // 7. Recuperação do Zoom do Gameplay Normal
    this.targetZoom = 1.0;
    this.zoom = 1;

    // 8. Rastreamento Horizontal e Rolagem Automática por Fase
    if (state.isPhase3) {
      // Fase 3: Subida caótica para a esquerda
      state.currentScrollSpeed += (state.targetScrollSpeed - state.currentScrollSpeed) * 0.05 * dt;
      this.x += state.currentScrollSpeed * dt;
      const targetCamX = baby.x - (isWide ? canvas.width - 250 : canvas.width - 160);
      this.x += (targetCamX - this.x) * 0.08 * dt;

      // Verifica se a menininha ficou muito para trás da tela em movimento para a direita
      if (baby.x > this.x + canvas.width + 50) {
        if (typeof callbacks.onLagBehind === 'function') {
          callbacks.onLagBehind();
        }
        this.syncToState(state);
        return;
      }
    } else if (state.isEscapeMode) {
      // Fase 2: Fuga com rolagem automática para frente
      // A região horizontal do pedestal final encerra a pressão da aproximação.
      // Altura, pouso e índice do apoio não selecionam o enquadramento.
      if (Number.isFinite(callbacks.escapeEndPlatformX) && baby.x + baby.w >= callbacks.escapeEndPlatformX) {
        const targetCamX = baby.x - (isWide ? 170 : 120);
        this.x += (targetCamX - this.x) * 0.09 * dt;
      } else {
        state.currentScrollSpeed += (state.targetScrollSpeed - state.currentScrollSpeed) * 0.05 * dt;
        this.x += state.currentScrollSpeed * dt;
        const targetCamX = baby.x - (isWide ? 170 : 120);
        if (targetCamX > this.x) {
          this.x += (targetCamX - this.x) * 0.09 * dt;
        }

        // Verifica se a menininha ficou para trás da tela em movimento para a esquerda
        if (baby.x < this.x - 25) {
          if (typeof callbacks.onLagBehind === 'function') {
            callbacks.onLagBehind();
          }
          this.syncToState(state);
          return;
        }
      }
    } else {
      // Fase 1: Rastreamento frontal suave padrão
      let targetCamX = baby.x - (isWide ? 180 : 120);
      if (targetCamX < 0) targetCamX = 0;
      this.x += (targetCamX - this.x) * 0.08;
    }

    // O viewport define a altura uma única vez; o salto não dirige a câmera nem recebe correções dela.
    this.y = this.targetY = getDarkRoomScrollFrame({ x: this.x, width: canvas.width, height: canvas.height }).y;

    this.syncToState(state);
  }

  syncFromState(state) {
    if (!state) return;
    this.x = state.cameraX;
    this.y = state.cameraY;
    this.targetY = state.targetCameraY;
    this.zoom = state.cameraZoom;
    this.targetZoom = state.targetCameraZoom;
  }

  syncToState(state) {
    if (!state) return;
    state.cameraX = this.x;
    state.cameraY = this.y;
    state.targetCameraY = this.targetY;
    state.cameraZoom = this.zoom;
    state.targetCameraZoom = this.targetZoom;
  }

  /**
   * Aplica a transformação da câmera (centralização do zoom + translação) ao Contexto 2D do Canvas
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   * @param {object} baby Estado do jogador
   * @param {object} fairy Estado da fadinha
   */
  applyTransform(ctx, canvas, baby, fairy, presentationY = this.y, presentationX = this.x, sourceX = this.x) {
    if (!ctx) return;

    if (this.zoom !== 1.0 && baby && fairy) {
      const focusX = (baby.x + fairy.x) / 2 - presentationX;
      const focusY = (baby.y + fairy.y) / 2 - presentationY;
      ctx.translate(focusX, focusY);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-focusX, -focusY);
    }

    ctx.translate(sourceX - presentationX, -presentationY);
  }
}

export function createCameraController(options = {}) {
  return new CameraController(options);
}
