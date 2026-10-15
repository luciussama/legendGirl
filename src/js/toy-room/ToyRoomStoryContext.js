import { createToyRoomWorldQueries } from './ToyRoomWorldQueries.js';
import { releaseCarriedToy, returnToyToFloor } from './ToyRoomToyActions.js';

/** Adapta a fase aos acessos da narrativa, sem expor a sala completa.
 * Os getters consultam os objetos atuais, inclusive após restore substituir seus dados.
 */
export function createToyRoomStoryContext(room) {
  return Object.freeze({
    world: createToyRoomWorldQueries({
      getDimensions: () => ({ width: room.ROOM_W, height: room.ROOM_H }),
      getPlayer: () => room.player,
      resolvePosition: (x, y, radius) => room.resolveCollisions(x, y, radius),
      getCameraFrame: () => room.getCameraFrame(),
      getCameraBounds: () => ({ x: room.cameraX, y: room.cameraY, width: room.canvas.width, height: room.canvas.height })
    }),
    actors: {
      get player() { return room.player; },
      get fairy() { return room.fairy; },
      get difficulty() { return room.gameDifficulty; }
    },
    exploration: {
      get toys() { return room.toys; },
      get furniture() { return room.furniture; },
      returnToy(toy, point) {
        returnToyToFloor(toy, point);
        room.organizedCount = room.toys.filter(item => item.isOrganized).length;
      },
      releaseCarriedToy() {
        const player = room.player;
        if (!player.carriedItem) return;
        const point = room.resolveCollisions(player.x, player.y, 32);
        releaseCarriedToy(player, point);
      }
    },
    flow: {
      get tutorialActive() { return room.tutorial.active; },
      get introductionActive() { return room.introAlpha > 0.02 || room.introBannerTimer > 0; }
    },
    controls: {
      clear() {
        // A fase real também libera a captura; conserva a limpeza para salas sem esse método.
        room.clearInput?.();
        room.keysDown = {};
        room.touchState.active = false;
        room.touchState.pointerId = null;
        room.touchState.vectorX = 0;
        room.touchState.vectorY = 0;
        room.player.vx = 0;
        room.player.vy = 0;
        room.player.isMoving = false;
        room.actionBtnPressed = false;
      }
    },
    audio: {
      playPickup() { room.audio?.playPickUpSound?.(); },
      useSwordTrack() { room.audio?.setToyRoomMusicTrack?.('sword'); }
    },
    presentation: {
      get assets() { return room.assets; },
      get mobile() { return room.mobilePresentation; }
    }
  });
}
