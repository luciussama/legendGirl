/** Limita a orientação a atores, brinquedos, câmera e dois campos de progresso.
 * Os getters consultam os objetos atuais após restore substituir os dados da sala.
 */
export function createToyRoomTutorialContext(room) {
  return Object.freeze({
    /** Consulta apresentação móvel ativa sem duplicar preferências da sala. */
    get mobilePresentation() {
      return room.mobilePresentation;
    },
    /** Fornece a entidade de jogador atual para detectar movimento e coleta. */
    get player() {
      return room.player;
    },
    /** Fornece a fada atual para posicionar as instruções de guia. */
    get fairy() {
      return room.fairy;
    },
    /** Fornece a coleção atual de brinquedos para escolher um alvo elegível. */
    get toys() {
      return room.toys;
    },
    /** Lê a rolagem horizontal usada para alinhar o guia ao viewport. */
    get cameraX() {
      return room.cameraX;
    },
    /** Lê a rolagem vertical da exploração. */
    get cameraY() {
      return room.cameraY;
    },
    /** Consulta se a orientação já foi concluída e deve permanecer oculta. */
    get toyRoomTutorialCompleted() {
      return room.toyRoomTutorialCompleted;
    },
    /** Persiste na sala a conclusão da orientação. */
    set toyRoomTutorialCompleted(value) {
      room.toyRoomTutorialCompleted = value;
    },
    /** Lê o modo ativo para alternar entre tutorial e exploração. */
    get gameplayState() {
      return room.gameplayState;
    },
    /** Atualiza o modo da sala ao abrir ou encerrar a orientação. */
    set gameplayState(value) {
      room.gameplayState = value;
    }
  });
}
