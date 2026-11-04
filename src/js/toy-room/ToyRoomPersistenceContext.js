/** Acesso explícito aos campos persistidos e à retomada dos subsistemas. */
export function createToyRoomPersistenceContext(room) {
  return {
    /** Consulta a fase do Brinquedão atual para coordenar sua restauração. */
    get brinq() {
      return room.brinq;
    },
    /** Substitui a referência da fase do Brinquedão na sala. */
    set brinq(value) {
      room.brinq = value;
    },
    /** Reabre a fase do Brinquedão com o estado salvo encaminhado. */
    startBrinquedao: saved => room.startBrinquedao(saved),
    /** Consulta a fase do sonho atual para coordenar sua restauração. */
    get dream() {
      return room.dream;
    },
    /** Substitui a referência da fase do sonho na sala. */
    set dream(value) {
      room.dream = value;
    },
    /** Reabre o sonho com o estado salvo encaminhado. */
    startDream: saved => room.startDream(saved),
    /** Consulta o epílogo ativo sem manter uma referência paralela. */
    get epilogue() {
      return room.epilogue;
    },
    /** Atualiza a referência do epílogo na sala. */
    set epilogue(value) {
      room.epilogue = value;
    },
    /** Reabre o epílogo usando a captura fornecida, quando disponível. */
    startEpilogue: saved => room.startEpilogue(saved),
    /** Consulta a arena para restaurar o estado de combate ou conclusão. */
    get arena() {
      return room.arena;
    },
    /** Consulta o combate atual para reaplicar seu estado persistido. */
    get battle() {
      return room.battle;
    },
    /** Consulta a fase do jardim atualmente conectada à sala. */
    get garden() {
      return room.garden;
    },
    /** Substitui a referência da fase do jardim na sala. */
    set garden(value) {
      room.garden = value;
    },
    /** Reabre o jardim com o estado salvo encaminhado. */
    startGarden: saved => room.startGarden(saved),
    /** Consulta a perseguição atual para decidir se ela deve ser reconstruída. */
    get chase() {
      return room.chase;
    },
    /** Substitui a referência da perseguição na sala. */
    set chase(value) {
      room.chase = value;
    },
    /** Lê a rolagem horizontal salva da exploração. */
    get cameraX() {
      return room.cameraX;
    },
    /** Restaura a rolagem horizontal da exploração. */
    set cameraX(value) {
      room.cameraX = value;
    },
    /** Lê a rolagem vertical salva da exploração. */
    get cameraY() {
      return room.cameraY;
    },
    /** Restaura a rolagem vertical da exploração. */
    set cameraY(value) {
      room.cameraY = value;
    },
    /** Libera entradas pendentes antes de retomar qualquer modo persistido. */
    clearInput: () => room.clearInput(),
    /** Fornece a referência atual da fada sem copiar seu estado. */
    get fairy() {
      return room.fairy;
    },
    /** Substitui a fada da sala pela referência restaurada. */
    set fairy(value) {
      room.fairy = value;
    },
    /** Consulta móveis atuais que participam do save da exploração. */
    get furniture() {
      return room.furniture;
    },
    /** Substitui a coleção de móveis restaurada. */
    set furniture(value) {
      room.furniture = value;
    },
    /** Lê o modo de jogo que será retomado após a restauração. */
    get gameplayState() {
      return room.gameplayState;
    },
    /** Atualiza o modo de jogo consistente com o subsistema restaurado. */
    set gameplayState(value) {
      room.gameplayState = value;
    },
    /** Lê a opacidade restante da introdução visual. */
    get introAlpha() {
      return room.introAlpha;
    },
    /** Restaura a opacidade da introdução. */
    set introAlpha(value) {
      room.introAlpha = value;
    },
    /** Consulta o relógio do aviso inicial da sala. */
    get introBannerTimer() {
      return room.introBannerTimer;
    },
    /** Restaura o relógio do aviso inicial. */
    set introBannerTimer(value) {
      room.introBannerTimer = value;
    },
    /** Lê o relógio da última ação para restabelecer o debounce. */
    get lastActionTime() {
      return room.lastActionTime;
    },
    /** Restaura o instante da última ação processada. */
    set lastActionTime(value) {
      room.lastActionTime = value;
    },
    /** Consulta quantos brinquedos foram organizados no baú. */
    get organizedCount() {
      return room.organizedCount;
    },
    /** Restaura a contagem derivada do progresso da exploração. */
    set organizedCount(value) {
      room.organizedCount = value;
    },
    /** Fornece o jogador atual para religar o item carregado por ID. */
    get player() {
      return room.player;
    },
    /** Substitui o jogador pela entidade desserializada. */
    set player(value) {
      room.player = value;
    },
    /** Inicia novamente a orientação caso o save ainda não a tenha concluído. */
    startTutorial: () => room.startTutorial(),
    /** Reabre a campanha da perseguição após validar a origem da arena. */
    startChaseCampaign: saved => room.startChaseCampaign(saved),
    /** Consulta o estado narrativo associado à exploração salva. */
    get story() {
      return room.story;
    },
    /** Lê a marca persistida de conclusão do tutorial. */
    get toyRoomTutorialCompleted() {
      return room.toyRoomTutorialCompleted;
    },
    /** Restaura a marca que decide se a orientação deve ser reapresentada. */
    set toyRoomTutorialCompleted(value) {
      room.toyRoomTutorialCompleted = value;
    },
    /** Consulta a coleção atual de brinquedos para religações após restore. */
    get toys() {
      return room.toys;
    },
    /** Substitui a coleção pela versão desserializada antes de religar referências. */
    set toys(value) {
      room.toys = value;
    },
    /** Consulta o tutorial que pode precisar ser reaberto após a restauração. */
    get tutorial() {
      return room.tutorial;
    },
    /** Lê se a faixa de vitória deve ser desenhada. */
    get victoryBannerActive() {
      return room.victoryBannerActive;
    },
    /** Restaura a visibilidade da faixa de vitória. */
    set victoryBannerActive(value) {
      room.victoryBannerActive = value;
    },
    /** Lê o tempo restante da faixa de vitória. */
    get victoryBannerTimer() {
      return room.victoryBannerTimer;
    },
    /** Restaura o relógio da faixa de vitória. */
    set victoryBannerTimer(value) {
      room.victoryBannerTimer = value;
    },
  };
}
