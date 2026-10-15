/** Limita a orientação a atores, brinquedos, câmera e dois campos de progresso.
 * Os getters consultam os objetos atuais após restore substituir os dados da sala.
 */
export function createToyRoomTutorialContext(room) {
  return Object.freeze({
    get mobilePresentation() { return room.mobilePresentation; },
    get player() { return room.player; },
    get fairy() { return room.fairy; },
    get toys() { return room.toys; },
    get cameraX() { return room.cameraX; },
    get cameraY() { return room.cameraY; },
    get toyRoomTutorialCompleted() { return room.toyRoomTutorialCompleted; },
    set toyRoomTutorialCompleted(value) { room.toyRoomTutorialCompleted = value; },
    get gameplayState() { return room.gameplayState; },
    set gameplayState(value) { room.gameplayState = value; }
  });
}
