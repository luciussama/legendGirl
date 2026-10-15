import { getMobileUILayout } from '../ui/MobileUILayout.js';
import { getMobileZoomFrame } from '../controllers/MobileZoom.js';

/** Calcula câmera e enquadramento com um único alvo fornecido pela narrativa. */
export function updateToyRoomCamera({ target, canvas, width, height, cameraX, cameraY }, dt) {
  // Câmera e ampliação compartilham o mesmo alvo, sem influência da guia da fada.
  const cameraTarget = target;
  const layout = getMobileUILayout(canvas);
  const targetCamX = cameraTarget.x - layout.centerX;
  const targetCamY = cameraTarget.y - layout.centerY;

  const minCamX = -layout.safeLeft, minCamY = -layout.safeTop;
  const maxCamX = Math.max(minCamX, width - layout.safeRight);
  const maxCamY = Math.max(minCamY, height - layout.safeBottom);

  const clampedTargetCamX = Math.max(minCamX, Math.min(maxCamX, targetCamX));
  const clampedTargetCamY = Math.max(minCamY, Math.min(maxCamY, targetCamY));

  const blend = 1 - Math.pow(0.88, dt);
  cameraX += (clampedTargetCamX - cameraX) * blend;
  cameraY += (clampedTargetCamY - cameraY) * blend;
  return { cameraX, cameraY };
}

export function getToyRoomCameraFrame({ target, canvas, cameraX, cameraY, mobilePresentation }) {
  const px = target.x - cameraX, py = target.y - cameraY;
  const layout = getMobileUILayout(canvas);
  const relativeBounds = {
    left: px - 100 - layout.safeLeft,
    right: px + 100 - layout.safeLeft,
    top: py - 120 - layout.safeTop,
    bottom: py + 80 - layout.safeTop
  };
  const frame = getMobileZoomFrame({ enabled: mobilePresentation,
    width: layout.usableWidth, height: layout.usableHeight,
    anchor: { x: px - layout.safeLeft, y: py - layout.safeTop }, bounds: relativeBounds });
  frame.x += layout.safeLeft * (1 - frame.zoom);
  frame.y += layout.safeTop * (1 - frame.zoom);
  return frame;
}
