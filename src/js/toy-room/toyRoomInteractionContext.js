/** Contrato de interação: acessa o estado vigente sem copiar atores ou brinquedos. */
export function createToyRoomInteractionContext(room) {
  return {
    /** Lê o intervalo de debounce compartilhado pela exploração. */
    get ACTION_DEBOUNCE_MS() {
      return room.ACTION_DEBOUNCE_MS;
    },
    /** Expõe a altura lógica da sala para verificações de interação. */
    get ROOM_H() {
      return room.ROOM_H;
    },
    /** Expõe a largura lógica da sala para verificações de interação. */
    get ROOM_W() {
      return room.ROOM_W;
    },
    /** Consulta a arena ativa sem manter uma referência obsoleta. */
    get arena() {
      return room.arena;
    },
    /** Consulta o serviço de áudio usado para feedback da interação. */
    get audio() {
      return room.audio;
    },
    /** Consulta o estado atual do combate para priorizar seus comandos. */
    get battle() {
      return room.battle;
    },
    /** Lê a disponibilidade visual do botão de interação. */
    get canInteract() {
      return room.canInteract;
    },
    /** Atualiza na sala a disponibilidade do botão de interação. */
    set canInteract(value) {
      room.canInteract = value;
    },
    /** Fornece móveis atuais para localizar o baú sem copiar a coleção. */
    get furniture() {
      return room.furniture;
    },
    /** Consulta a política de entrada do host, repassando argumentos sem filtrá-los. */
    isInputEnabled: (...args) => room.isInputEnabled(...args),
    /** Lê se a personagem está próxima do baú para feedback contextual. */
    get isNearChest() {
      return room.isNearChest;
    },
    /** Atualiza na sala o indicador de proximidade do baú. */
    set isNearChest(value) {
      room.isNearChest = value;
    },
    /** Consulta o instante da última ação para aplicar debounce. */
    get lastActionTime() {
      return room.lastActionTime;
    },
    /** Registra o instante da ação processada na sala. */
    set lastActionTime(value) {
      room.lastActionTime = value;
    },
    /** Lê a contagem atual sem duplicar o progresso da organização. */
    get organizedCount() {
      return room.organizedCount;
    },
    /** Atualiza o progresso de organização no estado da sala. */
    set organizedCount(value) {
      room.organizedCount = value;
    },
    /** Fornece a entidade de jogador atual para cálculos de distância. */
    get player() {
      return room.player;
    },
    /** Encaminha a emissão de confetes ao buffer de efeitos da sala. */
    spawnConfetti: (...args) => room.spawnConfetti(...args),
    /** Encaminha a emissão de brilhos ao buffer de efeitos da sala. */
    spawnSparkles: (...args) => room.spawnSparkles(...args),
    /** Consulta o estado narrativo que pode restringir a coleta. */
    get story() {
      return room.story;
    },
    /** Fornece a lista atual de brinquedos para detectar elegíveis à coleta. */
    get toys() {
      return room.toys;
    },
    /** Consulta o tutorial atual para encerrá-lo após a primeira coleta. */
    get tutorial() {
      return room.tutorial;
    },
    /** Fornece o elemento de feedback da interface, se houver. */
    get uiFeedback() {
      return room.uiFeedback;
    },
    /** Consulta se a faixa de vitória está visível. */
    get victoryBannerActive() {
      return room.victoryBannerActive;
    },
    /** Atualiza a visibilidade da faixa de vitória na sala. */
    set victoryBannerActive(value) {
      room.victoryBannerActive = value;
    },
    /** Lê o tempo restante da faixa de vitória. */
    get victoryBannerTimer() {
      return room.victoryBannerTimer;
    },
    /** Atualiza o relógio de exibição da faixa de vitória. */
    set victoryBannerTimer(value) {
      room.victoryBannerTimer = value;
    },
  };
}
