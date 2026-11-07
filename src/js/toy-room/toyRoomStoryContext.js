import { createToyRoomWorldQueries } from './toyRoomWorldQueries.js';
import { releaseCarriedToy, returnToyToFloor } from './toyRoomToyActions.js';

/** Adapta a fase aos acessos da narrativa, sem expor a sala completa.
 * Os getters consultam os objetos atuais, inclusive após restore substituir seus dados.
 */
export function createToyRoomStoryContext(room) {
  return Object.freeze({
    world: createToyRoomWorldQueries({
      /** Consulta as dimensões atuais usadas pelos limites navegáveis. */
      getDimensions: () => ({
        width: room.ROOM_W,
        height: room.ROOM_H,
      }),
      /** Fornece o jogador vigente sem reter uma referência substituída pelo restore. */
      getPlayer: () => room.player,
      /** Encaminha a resolução de colisão à fase que mantém a geometria da sala. */
      resolvePosition: (x, y, radius) => room.resolveCollisions(x, y, radius),
      /** Obtém a transformação atual da câmera da sala. */
      getCameraFrame: () => room.getCameraFrame(),
      /** Consulta posição e dimensões visíveis do viewport para orientar a narrativa. */
      getCameraBounds: () => ({
        x: room.cameraX,
        y: room.cameraY,
        width: room.canvas.width,
        height: room.canvas.height,
      }),
    }),
    actors: {
      /** Acessa o jogador atual da sala sem copiar seus dados mutáveis. */
      get player() {
        return room.player;
      },
      /** Acessa a fada atual da sala, inclusive após restauração. */
      get fairy() {
        return room.fairy;
      },
      /** Consulta a dificuldade ativa para adaptar o comportamento narrativo. */
      get difficulty() {
        return room.gameDifficulty;
      },
    },
    exploration: {
      /** Fornece brinquedos atuais para selecionar coleta e retorno. */
      get toys() {
        return room.toys;
      },
      /** Fornece móveis atuais para localizar o baú e validar posições. */
      get furniture() {
        return room.furniture;
      },
      /** Retorna um brinquedo ao piso e recalcula a contagem derivada do baú. */
      returnToy(toy, point) {
        returnToyToFloor(toy, point);
        room.organizedCount = room.toys.filter((item) => item.isOrganized).length;
      },
      /** Solta o objeto carregado apenas em uma posição aprovada pelas colisões da sala. */
      releaseCarriedToy() {
        const player = room.player;
        if (!player.carriedItem) return;
        const point = room.resolveCollisions(player.x, player.y, 32);
        releaseCarriedToy(player, point);
      },
    },
    flow: {
      /** Informa se a orientação está bloqueando a progressão narrativa. */
      get tutorialActive() {
        return room.tutorial.active;
      },
      /** Consulta os relógios da introdução que ainda suspendem a exploração. */
      get introductionActive() {
        return room.introAlpha > 0.02 || room.introBannerTimer > 0;
      },
    },
    controls: {
      /** Libera listeners/capturas e zera movimento antes de uma cena narrativa. */
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
      },
    },
    audio: {
      /** Reproduz o som de coleta pela interface de áudio do host, se disponível. */
      playPickup() {
        room.audio?.playPickUpSound?.();
      },
      /** Seleciona a faixa musical da espada sem criar um serviço de áudio separado. */
      useSwordTrack() {
        room.audio?.setToyRoomMusicTrack?.('sword');
      },
    },
    presentation: {
      /** Expõe os recursos visuais atuais sem copiá-los para o contexto narrativo. */
      get assets() {
        return room.assets;
      },
      /** Informa se a apresentação móvel precisa adaptar orientação e escala de UI. */
      get mobile() {
        return room.mobilePresentation;
      },
    },
  });
}
