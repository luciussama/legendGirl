/**
 * CameraController.js
 * Manages viewport framing, dynamic zoom levels, smooth camera tracking,
 * vertical headroom adjustment, and canvas matrix transformations.
 */

export class CameraController {
  constructor(options = {}) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.targetY = options.targetY || 0;
    this.zoom = options.zoom || 1.0;
    this.targetZoom = options.targetZoom || 1.0;

    this.floorY = options.floorY || 450;
    this.ceilingClampOffset = options.ceilingClampOffset || 44;
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
    if (immediate) {
      this.x = x;
      this.y = y;
      this.targetY = y;
    } else {
      this.targetY = y;
    }
  }

  /**
   * Updates camera framing, horizontal/vertical tracking, and zoom interpolation
   * @param {number} dt Delta time factor
   * @param {object} state Current GameState instance
   * @param {HTMLCanvasElement} canvas Canvas reference
   * @param {object} callbacks Callbacks like onLagBehind / onGameOver
   */
  update(dt, state, canvas, callbacks = {}) {
    if (!state || !canvas) return;

    const baby = state.baby;
    const fairy = state.fairy;
    const isWide = canvas.width > 600;

    // 1. Standby state framing
    if (state.isStandbyActive) {
      this.targetZoom = 1.25;
      this.zoom += (this.targetZoom - this.zoom) * 0.08;
      const targetCam = baby.x - (isWide ? canvas.width * 0.35 : canvas.width * 0.25);
      this.x += (targetCam - this.x) * 0.08;
      this.syncToState(state);
      return;
    }

    // 2. Standby transition return to normal zoom
    if (state.isStandbyTransitioning) {
      this.targetZoom = 1.0;
      this.zoom += (this.targetZoom - this.zoom) * 0.08;
      const targetCam = baby.x - (isWide ? 190 : 130);
      this.x += (targetCam - this.x) * 0.08;
      this.syncToState(state);
      return;
    }

    // 3. Castle Cutscene Framing
    if (state.cutsceneActive) {
      this.targetZoom = 1.45;
      this.zoom += (this.targetZoom - this.zoom) * 0.08;
      const cutsceneCamTarget = (baby.x + fairy.x) / 2 - (isWide ? 240 : 150);
      this.x += (cutsceneCamTarget - this.x) * 0.08;
      this.syncToState(state);
      return;
    }

    // 4. Plot Twist Cutscene Framing
    if (state.plotTwistActive) {
      this.targetZoom = 1.25;
      this.zoom += (this.targetZoom - this.zoom) * 0.07;
      const targetCam = baby.x - (isWide ? 220 : 140);
      this.x += (targetCam - this.x) * 0.08;
      this.syncToState(state);
      return;
    }

    // 5. Phase 3 Tutorial Framing
    if (state.phase3TutorialActive) {
      this.targetZoom = 1.0;
      this.zoom += (this.targetZoom - this.zoom) * 0.08;
      const tutorialCam = baby.x - (isWide ? canvas.width - 240 : canvas.width - 150);
      this.x += (tutorialCam - this.x) * 0.08;
      this.syncToState(state);
      return;
    }

    // 6. True Portal Transition Framing
    if (state.truePortalTransitionActive) {
      this.targetZoom = 1.25;
      this.zoom += (this.targetZoom - this.zoom) * 0.06;
      const exitDoorCenterX = (callbacks.exitDoorX || 120) + (callbacks.exitDoorW || 58) / 2;
      const targetCamX = exitDoorCenterX - (isWide ? 250 : 160);
      this.x += (targetCamX - this.x) * 0.08 * dt;
      this.syncToState(state);
      return;
    }

    // 7. Normal Gameplay Zoom Recovery
    this.targetZoom = 1.0;
    this.zoom += (this.targetZoom - this.zoom) * 0.08;

    // 8. Horizontal Tracking & Autoscroll per Phase
    if (state.isPhase3) {
      // Phase 3: Leftward chaotic climb
      state.currentScrollSpeed += (state.targetScrollSpeed - state.currentScrollSpeed) * 0.05 * dt;
      this.x += state.currentScrollSpeed * dt;
      const targetCamX = baby.x - (isWide ? canvas.width - 250 : canvas.width - 160);
      this.x += (targetCamX - this.x) * 0.08 * dt;

      // Check if baby fell too far behind the moving screen to the right
      if (baby.x > this.x + canvas.width + 50) {
        if (typeof callbacks.onLagBehind === 'function') {
          callbacks.onLagBehind();
        }
        this.syncToState(state);
        return;
      }
    } else if (state.isEscapeMode) {
      // Phase 2: Forward autoscroll escape
      state.currentScrollSpeed += (state.targetScrollSpeed - state.currentScrollSpeed) * 0.05 * dt;
      this.x += state.currentScrollSpeed * dt;
      const targetCamX = baby.x - (isWide ? 170 : 120);
      if (targetCamX > this.x) {
        this.x += (targetCamX - this.x) * 0.09 * dt;
      }

      // Check if baby fell behind the moving screen to the left
      if (baby.x < this.x - 25) {
        if (typeof callbacks.onLagBehind === 'function') {
          callbacks.onLagBehind();
        }
        this.syncToState(state);
        return;
      }
    } else {
      // Phase 1: Standard smooth forward tracking
      let targetCamX = baby.x - (isWide ? 180 : 120);
      if (targetCamX < 0) targetCamX = 0;
      this.x += (targetCamX - this.x) * 0.08;
    }

    // 9. Vertical tracking with dynamic headroom
    const minCeilingHeadroom = state.isPortrait ? 130 : 90;
    let baseFloorCamY = 0;
    if (state.isPortrait && canvas.height > this.floorY + 90) {
      baseFloorCamY = this.floorY - (canvas.height - 110);
    }

    const babyApexTargetY = baby.y - minCeilingHeadroom;
    this.targetY = Math.min(baseFloorCamY, babyApexTargetY);
    this.y += (this.targetY - this.y) * 0.12;

    // Hard visual ceiling clamp: guarantees player never ascends beyond the illuminated viewport
    const ceilingClampY = this.y + this.ceilingClampOffset;
    if (baby.y < ceilingClampY) {
      baby.y = ceilingClampY;
      if (baby.vy < 0) baby.vy = 0;
    }

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
   * Applies camera transformation (zoom centering + translation) to the Canvas 2D Context
   * @param {CanvasRenderingContext2D} ctx 
   * @param {HTMLCanvasElement} canvas 
   * @param {object} baby Player state
   * @param {object} fairy Fairy state
   */
  applyTransform(ctx, canvas, baby, fairy) {
    if (!ctx) return;

    if (this.zoom !== 1.0 && baby && fairy) {
      const focusX = (baby.x + fairy.x) / 2 - this.x;
      const focusY = (baby.y + fairy.y) / 2 - this.y;
      ctx.translate(focusX, focusY);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-focusX, -focusY);
    }

    ctx.translate(0, -this.y);
  }
}

export function createCameraController(options = {}) {
  return new CameraController(options);
}
