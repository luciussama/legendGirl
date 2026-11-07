import {
  beginDialogueFrame,
  endDialogueFrame,
  installDialogueAdvance,
} from './narrative/dialogueFlow.js';
import { DarkRoomContact } from './environment/DarkRoomContact.js';
import { createRuntimeContext } from './runtime/runtimeContext.js';
import { updatePortalNarrative } from './narrative/darkRoomNarrative.js';
import { updateReturnTutorialNarrative } from './narrative/darkRoomNarrative.js';
import { updatePlotTwistNarrative } from './narrative/darkRoomNarrative.js';
import { updateCastleNarrative } from './narrative/darkRoomNarrative.js';
import { updateStandbyTransitionNarrative } from './narrative/darkRoomNarrative.js';
import { updateStandbyNarrative } from './narrative/darkRoomNarrative.js';
import { renderDarkRoom } from './rendering/darkRoomRenderPipeline.js';
import { createViewportController } from './controllers/viewportController.js';
import { createCameraQaObserver } from './debug/cameraQaObserver.js';
import { createCampaignProgress, captureState, restoreState } from './state/campaignProgress.js';
import { normalizeDifficulty } from './state/gameDifficulty.js';
import { recordCampaignDefeat, clearCampaignDefeat } from './state/campaignDefeats.js';
import { createDefaultStateVariables } from './state/stateVariables.js';
import { OpeningSequence } from './cinematics/OpeningSequence.js';
import { ToyRoomIntroduction } from './cinematics/ToyRoomIntroduction.js';
import { getEscapeGuideTarget, updateEscapeFairyGuide } from './controllers/escapeFairyGuide.js';
import {
  GAME_CONFIG,
  FLOOR_Y,
  platforms,
  exitDoor,
  phase3Platforms,
  trueExitDoor,
  roomScenery,
  createPlayerState,
  createFairyState,
  CUTSCENE_DIALOGUE,
  getEscapeStats,
  getPhase3Stats,
  getApproachJumpSpeed,
} from './config.js';
import { createAudioController } from './controllers/AudioController.js';
import { isMobileDevice } from './controllers/mobileZoom.js';
import { createAndroidFraming } from './controllers/androidFraming.js';
import { CameraPresentation } from './controllers/CameraPresentation.js';
import { createCameraController } from './controllers/CameraController.js';
import { bindInput, InputController } from './controllers/InputController.js';
import { createToyRoom } from './toyRoom.js';
import { createGameState } from './state/GameState.js';
import { girlRenderer, fairyRenderer } from './entities/index.js';
import { backgroundRenderer, platformRenderer, createLightingSystem } from './environment/index.js';
import { createParticleSystem, transitionEffects } from './effects/index.js';
import { hudRenderer, dialogueRenderer } from './ui/index.js';
import { createAssetManager, darkRoomAtlas } from './assets/index.js';
import { createAtlasDebugger } from './debug/AtlasDebugger.js';

export function createGame(canvas, uiFeedback, callbacks = {}) {
  const ctx = canvas.getContext('2d');
  const assets = createAssetManager();
  const platformContact = new DarkRoomContact(platformRenderer, assets);
  const assetsReady = assets
    .loadManifest()
    .then(() => assets.preload())
    .then(() => {
      platformContact.prepare([...platforms, ...phase3Platforms]);
    });
  const atlasDebugger = createAtlasDebugger({
    assets,
  });
  assetsReady.then(() => {
    atlasDebugger.setAssets(assets);
  });
  if (typeof window !== 'undefined') {
    window.darkRoomAtlas = darkRoomAtlas;
  }
  platformRenderer.setAssets?.(assets);
  backgroundRenderer.setAssets?.(assets);
  girlRenderer.setAssets?.(assets);
  const audio = createAudioController();
  const state = createGameState(canvas, uiFeedback, {
    ...callbacks,
    onGameOver: () => reportDefeat('bedroom'),
  });
  const campaign = createCampaignProgress();
  let lastSaveTime = 0;
  let debugSession = false;
  const camera = createCameraController({
    floorY: FLOOR_Y,
  });
  const cameraPresentation = new CameraPresentation();
  const androidFraming = createAndroidFraming(canvas);
  const mobilePresentation = {
    enabled: isMobileDevice(),
  };
  const lighting = createLightingSystem({
    floorY: FLOOR_Y,
  });
  const particles = createParticleSystem({
    playerJumpDust: state.playerJumpDust,
    speedRibbons: state.speedRibbons,
  });
  const player = state.player;
  const fairy = state.fairy;

  let introductionOverview = 0;
  const toyRoomIntroduction = new ToyRoomIntroduction({
    onComplete: () => {
      startToyRoomPhase({
        fromIntroduction: true,
      });
    },
    onEvent: (name) => {
      callbacks.onNarrativeEvent?.(name);
      canvas.dispatchEvent(new CustomEvent(name));
      if (name === 'TOY_ROOM_START') state.toyRoomInstance?.instance.startTutorial();
    },
  });

  /** Captura o quadro atual e inicia a introdução com controles da menina bloqueados. */
  function beginToyRoomIntroduction() {
    if (typeof toyRoomIntroduction !== 'undefined' && toyRoomIntroduction.active) return;
    render();
    const departure = document.createElement('canvas');
    departure.width = canvas.width;
    departure.height = canvas.height;
    departure.getContext('2d').drawImage(canvas, 0, 0);
    player.controlsLocked = true;
    toyRoomIntroduction.start({
      assets,
      departure,
      audio,
      canvas,
    });
  }

  let isPortrait = false;
  state.lastTime = performance.now();
  const TARGET_FPS = 60;
  const STEP_MS = 1000 / TARGET_FPS;
  let failMessageTimer = null;

  const opening = new OpeningSequence({
    onReveal: beginOpeningGameplay,
    onComplete: enterFirstJumpTutorial,
    onCue: (name) => {
      if (name === 'ambience') {
        audio.initAudio();
        audio.pauseMusic();
        audio.playOpeningAmbience();
      } else if (name === 'wake') audio.playLevelUpChime(0);
      else if (name === 'music') audio.startMusic();
      else audio.playFairyVoiceBlip(name === 'shout' ? 1180 : 780);
    },
  });

  /** Libera a jogabilidade após a abertura sem deslocar o corpo físico inicial. */
  function beginOpeningGameplay() {
    // A sequência não move o corpo físico real: libera-o na posição inicial,
    // com a velocidade normal de corrida já definida.
    state.isStandbyActive = false;
    state.isStandbyTransitioning = false;
    player.isCrouching = false;
    player.controlsLocked = false;
    player.respawnLandingPending = false;
    player.onGround = true;
    player.vx = player.baseVx;
    state.cameraX = 0;
    state.cameraY = 0;
    state.cameraZoom = 1;
    state.targetCameraZoom = 1;
    fairy.x = player.x + 65;
    fairy.y = player.y - 50;
    fairy.vx = 0;
    fairy.vy = 0;
    syncViewportToState();
    camera.syncFromState(state);
    if (uiFeedback) uiFeedback.innerText = GAME_CONFIG.uiMessage;
    state.lastTime = performance.now();
  }

  /** Entra no tutorial de salto sem avançar a simulação até a primeira entrada válida. */
  function enterFirstJumpTutorial() {
    if (state.firstJumpTutorialCompleted) {
      state.gameplayState = 'GAMEPLAY_NORMAL';
      player.controlsLocked = false;
      return;
    }
    // Suspende a simulação sem modificar velocidades, gravidade ou o layout.
    state.gameplayState = 'FIRST_JUMP_TUTORIAL';
    if (uiFeedback) uiFeedback.innerText = '';
    player.controlsLocked = true;
    state.lastTime = performance.now();
    syncViewportToState();
  }

  // A orientação conserva os pontos originais de publicação/restauração do viewport.
  // Os demais campos de gameplay são lidos e escritos diretamente em GameState.
  /** Atualiza a cópia local da orientação a partir do estado publicado. */
  function syncViewportFromState() {
    isPortrait = state.isPortrait;
  }

  /** Publica no estado a orientação mantida pelo adaptador de viewport. */
  function syncViewportToState() {
    state.isPortrait = isPortrait;
  }

  /** Registra no estado o dispositivo que forneceu a entrada mais recente. */
  function setLastInputDevice(dev) {
    state.setLastInputDevice(dev);
  }

  /** Delega ao estado a escolha do dispositivo cujas instruções devem aparecer. */
  function getActivePromptDevice() {
    return state.getActivePromptDevice();
  }

  /** Sincroniza orientação e solicita ao estado o início da preparação em standby. */
  function startStandbyPreparation() {
    syncViewportToState();
    state.startStandbyPreparation(audio);
    syncViewportFromState();
  }

  /** Confirma a saída do standby por meio do estado, mantendo a orientação sincronizada. */
  function confirmStandby() {
    syncViewportToState();
    state.confirmStandby(audio);
    syncViewportFromState();
  }

  // Reinicialização rígida dos componentes de física para evitar acúmulo vetorial ou picos de delta
  /** Reinicializa o corpo físico na posição e direção pedidas, sem acumular velocidades. */
  function resetPlayerPhysicsBody(targetX, targetY, facing = 1) {
    syncViewportToState();
    state.resetPlayerPhysicsBody(targetX, targetY, facing);
    syncViewportFromState();
  }

  /** Encaminha a derrota ao estado e sincroniza a orientação resultante. */
  function triggerGameOver() {
    syncViewportToState();
    state.triggerGameOver(audio);
    syncViewportFromState();
  }

  /** Consulta a derrota da fase ativa, sem confundir perda de coração com fim da tentativa. */
  function isGameOver() {
    if (state.currentPhaseMode !== 'toy-room') return state.isGameOver;
    const room = state.toyRoomInstance?.instance;
    return Boolean(
      room?.brinq?.active
        ? room.brinq.state.stage === 'GAME_OVER'
        : room?.dream?.active
          ? room.dream.state.stage === 'GAME_OVER'
          : room?.garden?.active
            ? room.garden.state.stage === 'GAME_OVER'
            : room?.chase?.active
              ? room.chase.state.stage === 'GAME_OVER'
              : room?.battle.state?.mode === 'DEFEAT',
    );
  }

  /** Publica uma derrota por tentativa e conserva a oferta de ajuda no save. */
  function reportDefeat(phase) {
    recordCampaignDefeat(state);
    state.toyRoomInstance?.instance.clearInput();
    saveProgress();
    callbacks.onGameOver?.({
      phase,
      offerEasy: state.easyOfferPending,
    });
  }

  /** Reinicia uma tentativa derrotada; retorna falso se não houver derrota elegível. */
  function retryGame() {
    if (!isGameOver() || state.easyOfferPending) return false;
    clearCampaignDefeat(state);
    isPaused = false;
    state.isPaused = false;
    if (state.currentPhaseMode === 'toy-room') state.toyRoomInstance.instance.retryDefeat();
    else {
      cameraPresentation.reset();
      syncViewportToState();
      state.retryGame(audio);
      syncViewportFromState();
    }
    state.lastTime = performance.now();
    saveProgress();
    return true;
  }

  /** Aceita ajuda na etapa atual: checkpoint do quarto ou retomada local do combate/fuga. */
  function continueOnEasy() {
    if (!state.easyOfferPending || !isGameOver()) return false;
    state.gameDifficulty = 'EASY';
    clearCampaignDefeat(state);
    const room = state.toyRoomInstance?.instance;
    room?.setDifficulty('EASY');
    isPaused = false;
    state.isPaused = false;
    if (state.currentPhaseMode === 'toy-room')
      room.retryDefeat({
        resume: true,
      });
    else {
      cameraPresentation.reset();
      syncViewportToState();
      state.retryGame(audio);
      syncViewportFromState();
    }
    state.lastTime = performance.now();
    saveProgress();
    return true;
  }

  /** Recusar mantém a dificuldade; uma nova oferta só ocorre após outras três derrotas. */
  function declineEasyOffer() {
    state.easyOfferPending = false;
    saveProgress();
  }

  /** Persiste a campanha, encerra as cenas em andamento e retorna ao título. */
  function restartToTitle() {
    saveProgress();
    toyRoomIntroduction.cancel();
    opening.cancel();
    isPaused = false;
    state.isPaused = false;
    syncViewportToState();
    state.restartToTitle(audio);
    syncViewportFromState();
    debugSession = false;
  }

  // Atalho do menu para testar a mesma introdução usada na saída do portal.
  /** Abre a introdução da sala de brinquedos pelo atalho de revisão, sem campanha nova. */
  function startToyRoomIntroduction() {
    if (toyRoomIntroduction.active) return;
    opening.cancel();
    state.toyRoomInstance?.destroy();
    state.toyRoomInstance = null;
    state.currentPhaseMode = 'bedroom';
    state.gameStarted = true;
    state.isGameOver = false;
    state.gameWon = false;
    isPaused = false;
    state.isPaused = false;
    audio.initAudio();
    beginToyRoomIntroduction();
    state.lastTime = performance.now();
    if (!state.loopStarted) {
      state.loopStarted = true;
      requestAnimationFrame(loop);
    }
  }

  /** Cria a sala de brinquedos e conecta callbacks de derrota, retorno e entrada. */
  function startToyRoomPhase({ fromIntroduction = false } = {}) {
    if (!fromIntroduction) toyRoomIntroduction.cancel();
    state.isGameOver = false;
    state.gameWon = false;
    state.gameStarted = true;
    if (!fromIntroduction) {
      audio.stopAllAudio();
      audio.clearActiveSounds();
    }

    if (state.toyRoomInstance) {
      state.toyRoomInstance.destroy();
      state.toyRoomInstance = null;
    }

    state.currentPhaseMode = 'toy-room';
    state.toyRoomInstance = createToyRoom(
      canvas,
      audio,
      uiFeedback,
      () => {
        restartToTitle();
      },
      {
        assets,
        gameDifficulty: state.gameDifficulty,
        isInputEnabled: () => !isPaused && !state.easyOfferPending && !isGameOver(),
        onDefeat: reportDefeat,
      },
    );

    if (fromIntroduction) {
      state.toyRoomInstance.instance.introAlpha = 1;
      state.toyRoomInstance.instance.introBannerTimer = 0;
      introductionOverview = 1;
    } else {
      introductionOverview = 0;
      audio.startToyRoomMusic();
    }
    if (!state.loopStarted) {
      state.loopStarted = true;
      requestAnimationFrame(loop);
    }
    saveProgress();
  }

  // Canvas persistente fora da tela para iluminação atmosférica escura (evita alocações no garbage collector)
  const darkCanvas = document.createElement('canvas');
  const dctx = darkCanvas.getContext('2d');

  // Adaptação de Resolução e Viewport (Zero distorção em Dispositivos Móveis e Desktop)
  const viewportController = createViewportController({
    canvas,
    darkCanvas,
    lighting,
    host: window,
    onOrientation: (portrait) => {
      isPortrait = portrait;
    },
  });

  /** Delega o redimensionamento ao controlador responsável pelo viewport. */
  function handleResize() {
    viewportController.resize();
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
  window.visualViewport?.addEventListener('resize', handleResize);
  if (window.ResizeObserver && canvas.parentElement) {
    const ro = new ResizeObserver(() => handleResize());
    ro.observe(canvas.parentElement);
  }
  handleResize();

  // Buffers compartilhados com o sistema de partículas.
  const speedRibbons = state.speedRibbons;
  const playerJumpDust = state.playerJumpDust;

  /** Inicia a transição narrativa do portal com o estado de viewport sincronizado. */
  function startTruePortalTransition() {
    syncViewportToState();
    state.startTruePortalTransition(audio);
    syncViewportFromState();
  }

  /** Solicita ao estado a apresentação da mensagem de falha vigente. */
  function showFailMessage() {
    state.showFailMessage();
  }

  /** Inicia a cena do castelo preservando a orientação publicada no estado. */
  function startCastleCutscene() {
    syncViewportToState();
    state.startCastleCutscene(audio);
    syncViewportFromState();
  }

  /** Avança a etapa narrativa do castelo pelo controlador de estado. */
  function advanceCutscene() {
    syncViewportToState();
    state.advanceCutscene(audio);
    syncViewportFromState();
  }

  /** Finaliza a cena do castelo e aplica as transições associadas no estado. */
  function finishCutscene() {
    syncViewportToState();
    state.finishCutscene(audio);
    syncViewportFromState();
  }

  // --- CENA DA REVIRAVOLTA (TRANSIÇÃO PARA A FASE 3) ---
  /** Prepara a cena da reviravolta antes de delegar sua progressão narrativa. */
  function startPlotTwistCutscene() {
    syncViewportToState();
    state.startPlotTwistCutscene(audio);
    syncViewportFromState();
  }

  /** Avança a etapa atual da reviravolta sem atualizar a simulação principal. */
  function advancePlotTwist() {
    syncViewportToState();
    state.advancePlotTwist(audio);
    syncViewportFromState();
  }

  /** Encerra a reviravolta e inicia o tutorial de retorno em uma única transição. */
  function finishPlotTwistAndStartTutorial() {
    syncViewportToState();
    state.finishPlotTwistAndStartTutorial(audio);
    syncViewportFromState();
  }

  /** Restaura o ponto inicial e o viewport, permitindo controlar som e origem da falha. */
  function resetToStart(failedMidClimb = false, shouldPlayFailSound = true) {
    cameraPresentation.reset();
    syncViewportToState();
    state.resetToStart(failedMidClimb, shouldPlayFailSound, audio);
    syncViewportFromState();
  }

  /** Valida a origem e o estado de jogo antes de aplicar um salto ou avançar uma cena. */
  function doJump(inputSource) {
    if (typeof toyRoomIntroduction !== 'undefined' && toyRoomIntroduction.active) return;
    if (opening.active) return;
    const firstJump = state.gameplayState === 'FIRST_JUMP_TUTORIAL';
    if (firstJump && (isPaused || !['touch', 'mouse', 'keyboard', 'gamepad'].includes(inputSource)))
      return;
    audio.initAudio();

    if (state.isGameOver || !state.gameStarted) {
      return;
    }

    const now = performance.now();

    // Confirmação de standby: Espaço, Botão X ou Toque na tela para iniciar a jogabilidade
    if (state.isStandbyActive) {
      if (now - state.standbyActivatedTime < 220) return;
      confirmStandby();
      return;
    }

    if (state.isStandbyTransitioning) {
      return;
    }

    if (state.gameWon) {
      if (now - state.lastJumpTime < 400) return;
      state.lastJumpTime = now;
      state.gameWon = false;
      resetToStart(false, false);
      return;
    }

    // Avança cena cinemática com toque na tela respeitando tempo de recarga
    if (state.cutsceneActive) {
      if (now - state.lastDialogueAdvanceTime < 320) return;
      state.lastDialogueAdvanceTime = now;
      advanceCutscene();
      state.lastJumpTime = now + 240;
      return;
    }

    // Avança cena da reviravolta no toque (apenas durante os diálogos dos passos 4 e 5) com recarga anti-spam
    if (state.plotTwistActive) {
      if (state.plotTwistStep >= 4) {
        if (now - state.lastDialogueAdvanceTime < 320) return;
        state.lastDialogueAdvanceTime = now;
        advancePlotTwist();
      }
      return;
    }

    // Verifica se os controles estão travados ou se a menina ainda está se levantando/agachada
    if (
      (!firstJump && player.controlsLocked) ||
      player.respawnLandingPending ||
      player.isCrouching
    ) {
      return;
    }

    // Verificação de chão: requer estritamente onGround confirmado pelo resolvedor de colisões
    if (!player.onGround) {
      return;
    }

    // Salto físico com bloqueio de debounce para entrada
    if (now - state.lastJumpTime < 160) {
      return;
    }
    state.lastJumpTime = now;

    // Limpa imediatamente onGround para evitar acúmulo de múltiplos saltos em um único frame
    player.onGround = false;

    if (state.isPhase3) {
      const currentLvl = Math.max(0, Math.min(14, state.phase3Level || 0));
      const stats = getPhase3Stats(
        currentLvl,
        player.currentPlatformIndex < 0,
        state.gameDifficulty,
      );
      player.vy = stats.jumpPower;
      player.vx = stats.airVx; // Impulso horizontal dinâmico em direção à esquerda
      audio.playLongJumpSound(currentLvl / 14);
      fairy.vy -= 2.8;
      fairy.spinAnim = 1.6;

      // Explosão visual de faíscas e poeirinha do pulo
      spawnPlayerJumpPuff(player.x + player.w / 2, player.y + player.h, 6 + currentLvl);
      const burstCount = 6 + currentLvl * 2;
      spawnFairySparkles(player.x + player.w / 2, player.y + player.h, burstCount);
    } else if (
      player.longJumpUnlocked ||
      (typeof state.isEscapeMode !== 'undefined' && state.isEscapeMode)
    ) {
      const currentLvl = Math.max(0, Math.min(11, state.escapeLevel || 0));
      const stats = getEscapeStats(currentLvl, state.gameDifficulty);
      player.vy = stats.jumpPower;
      player.vx = stats.airVx; // Impulso horizontal dinâmico proporcional ao nível
      // Efeito de gameplay escondido para o início da segunda parte:
      // O apoio estreito do castelo deixa um vão de 196 px até o trem.
      // Primeiro pulo 100% calibrado para pousar com perfeição no centro da pista do trem (plataforma 10)
      if (player.currentPlatformIndex === 9) {
        const nextP = platforms[10];
        const nextCenterX = nextP.standRegion
          ? nextP.standRegion.x + nextP.standRegion.w / 2
          : nextP.x + nextP.w / 2;
        const targetX = nextCenterX - player.w / 2;
        const targetY =
          nextP.surfaceTopY !== undefined
            ? nextP.surfaceTopY
            : nextP.standRegion && nextP.standRegion.y !== undefined
              ? nextP.standRegion.y
              : nextP.y;
        const deltaY = targetY - player.h - player.y;
        const grav = player.gravity || 0.28;
        const disc = Math.max(0, player.vy * player.vy + 2 * grav * deltaY);
        const flightTime = (-player.vy + Math.sqrt(disc)) / grav;
        if (flightTime > 0) {
          player.vx = (targetX - player.x) / flightTime;
        } else {
          player.vx = 5.09;
        }
        if (typeof state.targetScrollSpeed !== 'undefined') {
          state.targetScrollSpeed = stats.scrollSpeed;
        }
        if (typeof state.currentScrollSpeed !== 'undefined') {
          state.currentScrollSpeed = stats.scrollSpeed;
        }
      }
      audio.playLongJumpSound(currentLvl / 11);
      fairy.vy -= 2.8;
      fairy.spinAnim = 1.6;

      // Explosão visual de faíscas e poeirinha do pulo
      spawnPlayerJumpPuff(player.x + player.w / 2, player.y + player.h, 6 + currentLvl);
      const burstCount = 6 + currentLvl * 2;
      spawnFairySparkles(player.x + player.w / 2, player.y + player.h, burstCount);
    } else {
      player.vy = player.jumpPower;
      // Velocidade fixa por saída: o clique determina o alcance, sem mirar
      // automaticamente o centro do próximo apoio. Só o castelo tem assistência.
      player.vx = getApproachJumpSpeed(player.currentPlatformIndex, state.gameDifficulty);
      audio.playJumpSound();
      fairy.vy -= 2.2;
      fairy.spinAnim = 1.0;
      spawnPlayerJumpPuff(player.x + player.w / 2, player.y + player.h, 5);
      spawnFairySparkles(fairy.x, fairy.y, 6);
    }
    // Conclui somente após o impulso físico aceito; tentativas inválidas não consomem o tutorial.
    if (firstJump) {
      player.controlsLocked = false;
      state.firstJumpTutorialCompleted = true;
      state.gameplayState = 'GAMEPLAY_NORMAL';
      state.lastTime = performance.now();
      saveProgress();
    }
    return true;
  }

  // --- SISTEMA DE POEIRA MÁGICA DA FADA ---
  /** Encaminha posição e velocidade da fada ao sistema de partículas de voo. */
  function spawnFairyFlightDust(fx, fy, fvx, fvy) {
    state.spawnFairyFlightDust(fx, fy, fvx, fvy);
  }

  /** Emite um grupo de brilhos na posição indicada, com quantidade configurável. */
  function spawnFairySparkles(x, y, count = 2) {
    state.spawnFairySparkles(x, y, count);
  }

  /** Avança a vida e a posição das partículas próprias da fada. */
  function updateFairyParticles() {
    state.updateFairyParticles();
  }

  // --- SISTEMA DE RASTRO SUTIL DO SALTO DA MENINA ---
  /** Gera poeira de salto levando em conta a velocidade e o nível de fuga atual. */
  function spawnPlayerJumpDust(bx, bw, by, bh, bvx) {
    particles.spawnPlayerJumpDust(bx, bw, by, bh, bvx, state.isEscapeMode, state.escapeLevel);
  }

  /** Emite a nuvem de partida do salto sem alterar a trajetória física. */
  function spawnPlayerJumpPuff(x, y, count = 5) {
    particles.spawnPlayerJumpPuff(x, y, count);
  }

  /** Emite o efeito de aterrissagem no ponto de contato calculado pela física. */
  function spawnPlayerLandingPuff(x, y) {
    particles.spawnPlayerLandingPuff(x, y);
  }

  /** Atualiza poeira e rastros mesmo quando a jogabilidade está em pausa narrativa. */
  function updatePlayerJumpDust(dt = 1.0) {
    // Avança o tempo de vida da poeira e dos rastros de velocidade, inclusive durante cenas e tutoriais.
    particles.update(dt);
  }

  // --- RENDERIZADORES DE CENÁRIO (Modularizados em /environment) ---
  /** Desenha a parede de fundo usando a coordenada horizontal da câmera. */
  function drawBackgroundWall(camX) {
    backgroundRenderer.renderWall(ctx, canvas, camX, {
      tick: state.tick,
      assets,
    });
  }

  /** Compõe os elementos de cenário com o deslocamento lateral vigente. */
  function drawSceneryItems(camX) {
    backgroundRenderer.renderScenery(ctx, canvas, roomScenery, camX, {
      assets,
    });
  }

  /** Renderiza apenas o conjunto de plataformas da fase ativa e seus estados visuais. */
  function drawPlatforms(camX) {
    platformRenderer.renderPlatforms(ctx, canvas, camX, {
      isPhase3: state.isPhase3,
      cameraVisibility: state.isPhase3,
      platforms: state.isPhase3 ? phase3Platforms : platforms,
      player,
      tick: state.tick,
      assets,
    });
  }

  /** Desenha a saída falsa considerando revelação, deslocamento e rotação atuais. */
  function drawExitDoor(camX) {
    platformRenderer.renderExitDoor(ctx, canvas, camX, {
      exitDoor,
      fakeDoorRevealed: state.fakeDoorRevealed,
      fakeDoorSlideY: state.fakeDoorSlideY,
      fakeDoorRotation: state.fakeDoorRotation,
      tick: state.tick,
      assets,
    });
  }

  /** Desenha o portal verdadeiro com o ângulo de abertura narrativo atual. */
  function drawTrueExitDoor(camX) {
    platformRenderer.renderTrueExitDoor(ctx, canvas, camX, {
      trueExitDoor,
      trueDoorOpenAngle: state.trueDoorOpenAngle,
      tick: state.tick,
      assets,
    });
  }

  // --- RENDERIZADORES DE ENTIDADES E PERSONAGENS (Modularizados em /entities) ---
  /** Desenha a menina e aplica escala somente na aproximação inicial, sem mover os pés físicos. */
  function drawPlayerManaStyle(camX) {
    syncViewportToState();
    // Ajuste de arte exclusivo da primeira etapa; o ponto de contato dos pés não muda.
    girlRenderer.render(ctx, player, state, camX, {
      assets,
      visualScale: !state.isEscapeMode && !state.isPhase3 ? 1.08 : 1,
    });
  }

  /** Desenha a fada com acesso às plataformas e à menina para compor sua pose. */
  function drawFairy(camX) {
    syncViewportToState();
    fairyRenderer.render(ctx, fairy, state, camX, {
      canvas,
      player,
      platforms,
      assets,
    });
  }

  // --- ILUMINAÇÃO DINÂMICA ATMOSFÉRICA (Modularizada em /environment) ---
  /** Aplica iluminação atmosférica usando a câmera e os apoios de ambas as fases. */
  function applyDarkAtmosphereWithLights(camX, camY = 0) {
    syncViewportToState();
    lighting.apply(ctx, canvas, state, player, fairy, camX, camY, {
      platforms,
      phase3Platforms,
      exitDoor,
      trueExitDoor,
    });
  }

  // --- RENDERIZAÇÃO DE EFEITOS DE PARTÍCULAS (Modularizada em /effects) ---
  /** Compõe os rastros de velocidade no referencial da câmera. */
  function drawSpeedRibbons(camX) {
    particles.renderSpeedRibbons(ctx, canvas, camX);
  }

  /** Desenha poeira de salto e rastros sem participar da resolução de colisões. */
  function drawPlayerJumpDust(camX) {
    particles.renderPlayerJumpDust(ctx, canvas, camX);
  }

  // --- RENDERIZAÇÃO DE INTERFACE E HUD (Modularizada em /ui) ---
  /** Apresenta a faixa de progressão de fuga sobre a cena atual. */
  function drawEscapeBanner() {
    hudRenderer.renderEscapeBanner(ctx, canvas, state, state.cameraX, player);
  }

  /** Desenha o retrato de diálogo usando humor, escala e relógio visual atuais. */
  function drawDialoguePortrait(pCtx, charType, px, py, radius, mood = 'normal') {
    dialogueRenderer.drawPortrait(pCtx, charType, px, py, radius, mood, state.tick, {
      assets,
    });
  }

  /** Quebra o texto em linhas que respeitam a largura disponível no diálogo. */
  function wrapDialogueText(pCtx, text, maxWidth) {
    return dialogueRenderer.wrapText(pCtx, text, maxWidth);
  }

  /** Renderiza a fala da cena e limita sua âncora ao espaço dos personagens transformados. */
  function drawCutsceneDialogue(transform) {
    dialogueRenderer.renderCutsceneDialogue(ctx, canvas, state, {
      assets,
      getActivePromptDevice,
      characterAnchor: {
        top: Math.min(
          transform.transformPoint({
            x: player.x - state.cameraX,
            y: player.y - 20,
          }).y,
          transform.transformPoint({
            x: fairy.x - state.cameraX,
            y: fairy.y - 28,
          }).y,
        ),
        bottom: transform.transformPoint({
          x: player.x - state.cameraX,
          y: player.y + player.h,
        }).y,
      },
    });
  }

  // --- GUIA VISUAL DE TUTORIAL (Modularizado em /environment) ---
  /** Desenha a indicação visual do próximo salto no sistema de coordenadas da câmera. */
  function drawTutorialArrow(camX) {
    platformRenderer.renderTutorialArrow(ctx, canvas, camX, {
      isPhase3: state.isPhase3,
      phase3Platforms,
      player,
      tick: state.tick,
    });
  }

  // --- LOOP DE ATUALIZAÇÃO DO JOGO ---
  /** Avança narrativa, física, colisões, progressão e efeitos usando delta em quadros. */
  function update(dt = 1.0) {
    if (toyRoomIntroduction.active) {
      toyRoomIntroduction.update(dt);
      return;
    }
    // O tutorial pausa relógio, IA, câmera e progressão antes de qualquer atualização.
    if (state.gameplayState === 'FIRST_JUMP_TUTORIAL') return;
    state.tick++;
    if (!state.gameStarted) return;
    if (state.gameWon) return;
    if (state.isGameOver) return;

    if (opening.active) {
      // Aguarda o recurso real; nunca encerra uma abertura não exibida durante o carregamento.
      if (assets.get('opening-waking-up')) opening.update(dt);
      return;
    }

    // Transição gradual de iluminação das plataformas
    const allPlatforms = state.isPhase3 ? phase3Platforms : platforms;
    for (let i = 0; i < allPlatforms.length; i++) {
      const p = allPlatforms[i];
      if (p.lightAlpha === undefined) p.lightAlpha = 0;
      const targetA = p.isLanded ? 1.0 : 0.0;
      p.lightAlpha += (targetA - p.lightAlpha) * 0.08;
    }

    // --- PREPARAÇÃO, PRONTIDÃO E RENASCIMENTO (FADINHA INTERATIVA) ---
    if (state.isStandbyActive) {
      updateStandbyNarrative(narrativeContext, dt);
      return;
    }

    if (state.isStandbyTransitioning) {
      updateStandbyTransitionNarrative(narrativeContext, dt);
      return;
    }

    // --- SEQUENCIADOR DA CENA DA REVIRAVOLTA ---
    if (state.plotTwistActive) {
      updatePlotTwistNarrative(narrativeContext, dt);
      return;
    }

    // --- DEMONSTRAÇÃO DO TUTORIAL DA FASE 3 (FADINHA SIMULA TRAJETÓRIA DO PRIMEIRO SALTO) ---
    if (state.phase3TutorialActive) {
      updateReturnTutorialNarrative(narrativeContext, dt);
      return;
    }

    // --- SEQUENCIADOR DA CENA CINEMÁTICA ---
    if (state.cutsceneActive) {
      updateCastleNarrative(narrativeContext, dt);
      return;
    }

    // --- SEQUENCIADOR DE TRANSIÇÃO DO VERDADEIRO PORTAL PARA A SALA DE BRINQUEDOS ---
    if (state.truePortalTransitionActive) {
      updatePortalNarrative(narrativeContext, dt);
      return;
    }

    // Suaviza o zoom da câmera de volta ao normal após a cena
    state.targetCameraZoom = 1.0;
    state.cameraZoom += (state.targetCameraZoom - state.cameraZoom) * 0.08;

    // Física da menina: na plataforma 9 (castelinho pequeno), aguarda pausada a interação do jogador sem andar sozinha
    if (state.isEscapeMode && player.currentPlatformIndex === 9 && player.onGround) {
      const castle = platforms[9];
      const castleCenterX = castle.standRegion
        ? castle.standRegion.x + castle.standRegion.w / 2
        : castle.x + castle.w / 2;
      const castleTopY = castle.surfaceTopY !== undefined ? castle.surfaceTopY : castle.y;
      player.x = castleCenterX - player.w / 2;
      player.y = castleTopY - player.h;
      player.vx = 0;
      // Cancela exatamente a gravidade deste frame, inclusive com dt variável.
      player.vy = -player.gravity * dt;
      player.animTime = 0;
      state.currentScrollSpeed = 0;
      state.targetScrollSpeed = 0;
    }
    // No NORMAL, o passo de aproximação acompanha o salto, sem frenagem ao sair do apoio.
    if (
      player.onGround &&
      !state.isEscapeMode &&
      !state.isPhase3 &&
      state.gameDifficulty !== 'EASY'
    )
      player.vx = 2;
    const walkStartX = player.x;
    const walkStartedGrounded = player.onGround;
    player.x += player.vx * dt;
    player.vy += player.gravity * dt;
    player.y += player.vy * dt;

    // Rastro de poeira mágica sutil atrás da garotinha durante os saltos
    if (!player.onGround) {
      if (state.tick % 2 === 0) {
        spawnPlayerJumpDust(player.x, player.y, player.w, player.h, player.vx, player.vy);
      }
    }

    // Emite faixas de velocidade proporcionais ao nível de fuga ou da Fase 3
    if (state.isPhase3 && !player.onGround) {
      particles.spawnPhase3Ribbons(
        player,
        state.phase3Level,
        getPhase3Stats(state.phase3Level, false, state.gameDifficulty),
        state.tick,
      );
    } else if (state.isEscapeMode && !player.onGround) {
      particles.spawnEscapeRibbons(
        player,
        state.escapeLevel,
        getEscapeStats(state.escapeLevel, state.gameDifficulty),
        state.tick,
      );
    }

    // --- COMPORTAMENTO ORGÂNICO E SISTEMA GUIA DA FADA ---
    fairy.floatAngle += 0.05;
    fairy.flutterPhase += 0.35;

    if (state.isEscapeMode && !state.isPhase3) {
      updateEscapeFairyGuide(fairy, getEscapeGuideTarget(player, platforms, exitDoor), dt);
    } else {
      // Cálculo da posição de exploração do alvo
      let targetX, targetY;

      if (state.isPhase3) {
        const nextIndex = player.currentPlatformIndex + 1;
        if (nextIndex < phase3Platforms.length) {
          const nextPlat = phase3Platforms[nextIndex];
          const isCloseToNext = player.x < nextPlat.x + nextPlat.w + 120;
          if (isCloseToNext) {
            targetX = nextPlat.x + nextPlat.w / 2;
            targetY = nextPlat.y - 45;
          } else {
            targetX = player.x - 75;
            targetY = player.y - 50;
          }
        } else {
          targetX = trueExitDoor.x + 40;
          targetY = trueExitDoor.y + 45;
        }
      } else {
        const nextIndex = player.currentPlatformIndex + 1;
        if (nextIndex < platforms.length) {
          const nextPlat = platforms[nextIndex];
          const isCloseToNext = player.x > nextPlat.x - 120;
          if (isCloseToNext) {
            targetX = nextPlat.x + 35;
            targetY = nextPlat.y - 45;
          } else {
            targetX = player.x + (state.isEscapeMode ? 80 : 65);
            targetY = player.y - 50;
          }
        } else {
          targetX = exitDoor.x + 30;
          targetY = exitDoor.y + 40;
        }
      }

      // Micro-movimentos rápidos simulando a curiosidade natural de uma fada
      fairy.dartTimer--;
      if (fairy.dartTimer <= 0) {
        fairy.dartTimer = 60 + Math.floor(Math.random() * 80);
        fairy.dartOffsetX = (Math.random() - 0.5) * 26;
        fairy.dartOffsetY = (Math.random() - 0.5) * 18;
      }

      // Oscilações orgânicas multifrequenciais de flutuação
      const organicOscY =
        Math.sin(fairy.floatAngle * 2.8) * 8 +
        Math.cos(fairy.floatAngle * 4.9) * 4 +
        Math.sin(fairy.floatAngle * 1.2) * 6;

      const organicOscX =
        Math.cos(fairy.floatAngle * 2.1) * 7 + Math.sin(fairy.floatAngle * 3.6) * 3;

      const finalTargetX = targetX + organicOscX + fairy.dartOffsetX;
      const finalTargetY = targetY + organicOscY + fairy.dartOffsetY;

      fairy.vx += (finalTargetX - fairy.x) * 0.045;
      fairy.vy += (finalTargetY - fairy.y) * 0.045;
      fairy.vx *= 0.86;
      fairy.vy *= 0.86;

      fairy.x += fairy.vx;
      fairy.y += fairy.vy;
    }

    // Rastro de poeira luminosa que paira e rodopia atrás da fada
    if (state.tick % 2 === 0) {
      spawnFairyFlightDust(fairy.x, fairy.y, fairy.vx, fairy.vy);
    }
    if (Math.hypot(fairy.vx, fairy.vy) > 2.2 && state.tick % 2 === 1) {
      spawnFairyFlightDust(fairy.x, fairy.y, fairy.vx, fairy.vy);
    }

    updateFairyParticles();
    updatePlayerJumpDust();

    // --- COLISÃO COM PLATAFORMAS E ATERRISSAGEM ---
    const activePlatforms = state.isPhase3 ? phase3Platforms : platforms;
    const wasInAir = !player.onGround;
    const contact = platformContact.resolve(player, state, activePlatforms, dt);
    let landedIdx = contact?.index ?? -1;
    // Garantia de 100% de acerto no primeiro salto do castelo para a pista do trem (plataforma 10)
    const isEscapingState =
      typeof state.isEscapeMode !== 'undefined'
        ? state.isEscapeMode
        : Boolean(player.isEscaping || player.longJumpUnlocked);
    if (
      !state.isPhase3 &&
      isEscapingState &&
      player.currentPlatformIndex === 9 &&
      wasInAir &&
      player.vy >= 0
    ) {
      const p10 = platforms[10];
      const support = p10.standRegion || p10;
      const p10Y = p10.surfaceTopY ?? support.y ?? p10.y;
      if (player.y + player.h >= p10Y) {
        // Somente a saída do castelo tem pouso assistido. Mantém a hitbox real
        // do trem e finaliza o arco no centro, mesmo com variação de frames.
        player.x = support.x + (support.w - player.w) / 2;
        landedIdx = 10;
      }
    }

    if (landedIdx !== -1) {
      const landedPlat = activePlatforms[landedIdx];
      landedPlat.isLanded = true;
      const landingY =
        landedIdx === contact?.index
          ? contact.y
          : (landedPlat.surfaceTopY ?? landedPlat.standRegion?.y ?? landedPlat.y);
      player.y = landingY - player.h;
      player.vy = 0;
      if (!state.isEscapeMode && !state.isPhase3) {
        player.vx = state.gameDifficulty === 'EASY' ? player.baseVx : 2;
      }
      player.onGround = true;
      player.respawnLandingPending = false;
      player.currentPlatformIndex = landedIdx;

      if (wasInAir) {
        spawnPlayerLandingPuff(player.x + player.w / 2, player.y + player.h);
      }

      if (state.isPhase3) {
        // Evolução progressiva de dificuldade da Fase 3 ao longo de 15 plataformas
        const newLevel = Math.min(14, Math.max(0, landedIdx));
        if (newLevel > state.phase3Level) {
          state.phase3Level = newLevel;
          const stats = getPhase3Stats(state.phase3Level, false, state.gameDifficulty);
          state.targetScrollSpeed = stats.scrollSpeed;
          player.vx = stats.runVx;
          audio.playLevelUpChime(state.phase3Level);
          spawnFairySparkles(
            player.x + player.w / 2,
            player.y + player.h / 2,
            14 + state.phase3Level * 2,
          );

          if (state.phase3Level === 14) {
            uiFeedback.innerText =
              '⭐ TERRAÇO DO CASTELO ALCANÇADO! O Verdadeiro Portal está à vista!';
            uiFeedback.style.color = '#fde047';
            state.escapeBannerTimer = 180;
            state.escapeBannerText = '⭐ SUBIDA FINAL (NÍVEL 15/15): O VERDADEIRO PORTAL!';
          } else if (state.phase3Level >= 10) {
            uiFeedback.innerText = `🌪️ Plataformas Instáveis (Nível ${state.phase3Level + 1}/15): Alta precisão necessária!`;
            uiFeedback.style.color = '#f472b6';
          } else if (state.phase3Level >= 5) {
            uiFeedback.innerText = `⚡ Escalada Acelerando (Nível ${state.phase3Level + 1}/15): Ritmo e saltos aumentando!`;
            uiFeedback.style.color = '#c084fc';
          } else {
            uiFeedback.innerText = `Subida Caótica (Nível ${state.phase3Level + 1}/15): Saltando pelos brinquedos!`;
            uiFeedback.style.color = '#fef08a';
          }
        } else {
          const stats = getPhase3Stats(state.phase3Level, false, state.gameDifficulty);
          player.vx = stats.runVx;
          state.targetScrollSpeed = stats.scrollSpeed;
        }

        if (landedIdx === 15) {
          spawnFairySparkles(player.x + player.w / 2, player.y + player.h / 2, 28);
        }
      } else if (player.isEscaping) {
        // Restabelece a velocidade horizontal ao pousar e atualiza atributos progressivos
        if (landedIdx >= 9) {
          if (landedIdx === 9) {
            // Efeito escondido na plataforma 9 (castelo estreito):
            // A personagem NÃO deve andar sozinha de forma alguma.
            // Fica pausada (vx = 0, scroll = 0) aguardando a interação do jogador!
            player.vx = 0;
            player.vy = 0;
            player.animTime = 0;
            state.currentScrollSpeed = 0;
            state.targetScrollSpeed = 0;
          } else {
            const newLevel = Math.min(11, Math.max(0, landedIdx - 9));
            if (newLevel > state.escapeLevel) {
              state.escapeLevel = newLevel;
              const stats = getEscapeStats(state.escapeLevel, state.gameDifficulty);
              state.targetScrollSpeed = stats.scrollSpeed;
              player.vx = stats.runVx;
              audio.playLevelUpChime(state.escapeLevel);
              spawnFairySparkles(
                player.x + player.w / 2,
                player.y + player.h / 2,
                14 + state.escapeLevel * 2,
              );

              if (state.escapeLevel === 11) {
                uiFeedback.innerText =
                  '⚡ PULO MÁXIMO ATINGIDO! Salte no limite para alcançar o Portal!';
                uiFeedback.style.color = '#fde047';
                state.escapeBannerTimer = 160;
                state.escapeBannerText = '⚡ PULO MÁXIMO (NÍVEL 12/12): O GRANDE SALTO!';
              } else {
                uiFeedback.innerText = `⚡ Pulo Evoluído (Nível ${state.escapeLevel + 1}/12): Pulo mais alto e veloz!`;
                uiFeedback.style.color = '#fef08a';
              }
            } else {
              const stats = getEscapeStats(state.escapeLevel, state.gameDifficulty);
              player.vx = stats.runVx;
              state.targetScrollSpeed = stats.scrollSpeed;
            }
          }
        }
      }

      if (!state.isPhase3 && (landedIdx === 0 || landedPlat.contactGroup === 'urso-livros')) {
        state.firstPlatformCleared = true;
      }

      // Gatilho de Cena Cinemática: Topo do Castelo de Blocos (Plataforma 9)
      if (!state.isPhase3 && landedIdx === 9 && !state.cutsceneTriggered) {
        startCastleCutscene();
        return;
      }

      // Celebração de ápice ao aterrissar na 12ª plataforma de fuga (pedestal do grande portal)
      if (!state.isPhase3 && landedIdx === 21) {
        spawnFairySparkles(player.x + player.w / 2, player.y + player.h / 2, 24);
      }
    } else if (player.y + player.h >= FLOOR_Y) {
      if (player.currentPlatformIndex >= 0) {
        triggerGameOver();
        return;
      }

      player.y = FLOOR_Y - player.h;
      player.vy = 0;
      player.onGround = true;
      player.respawnLandingPending = false;
      player.currentPlatformIndex = -1;

      // Velocidade de corrida no chão na Fase 3
      if (state.isPhase3 && !player.controlsLocked) {
        const stats = getPhase3Stats(state.phase3Level, false, state.gameDifficulty);
        player.vx = stats.runVx;
      }

      if (wasInAir) {
        spawnPlayerLandingPuff(player.x + player.w / 2, player.y + player.h);
      }
    } else {
      player.onGround = false;
    }

    // Só a distância percorrida sobre o apoio avança os passos. Saltos,
    // pousos assistidos e reposicionamento no castelo não contam como caminhada.
    if (dt > 0 && walkStartedGrounded && player.onGround) {
      player.animTime += Math.abs(player.x - walkStartX) * (0.15 / player.baseVx);
    }
    if (dt > 0) {
      const running = player.onGround && Math.abs(player.vx) > 0.05;
      const blend = player.runBlend ?? 0;
      player.runBlend = running ? Math.min(1, blend + dt / 8) : Math.max(0, blend - dt / 8);
    }

    // Verifica se passou direto da primeira plataforma sem pular
    if (!state.isPhase3) {
      const firstPlatform = platforms[0];
      if (!state.firstPlatformCleared && player.x > firstPlatform.x + firstPlatform.w) {
        triggerGameOver();
        return;
      }
    } else {
      // Na Fase 3: Menina se deslocando para a esquerda no chão.
      // A regra de falha/reset só é acionada caso o jogador ultrapasse a primeira plataforma depois que ela for devidamente alcançada sem subir nela.
      const p0 = phase3Platforms[0];
      if (player.currentPlatformIndex < 0 && player.onGround && player.x + player.w < p0.x - 20) {
        triggerGameOver();
        return;
      }
    }

    if (player.y > FLOOR_Y + 90) {
      triggerGameOver();
      return;
    }

    // Verifica condição de vitória ou gatilho da reviravolta
    if (state.isPhase3) {
      if (player.x <= trueExitDoor.x + 55 && !state.truePortalTransitionActive) {
        startTruePortalTransition();
        return;
      }
    } else {
      // Alcançar a porta de saída na Fase 1 / Fase 2: ativa a reviravolta!
      if (player.x >= exitDoor.x - 10 && !state.plotTwistTriggered) {
        startPlotTwistCutscene();
        return;
      }
    }

    // Contagem regressiva suave do banner de fuga / subida de nível
    if (state.escapeBannerTimer > 0) {
      state.escapeBannerTimer--;
    }

    // Movimento de tela e rastreamento de câmera via CameraController
    syncViewportToState();
    camera.syncFromState(state);
    camera.update(dt, state, canvas, {
      onLagBehind: () => triggerGameOver(),
      escapeEndPlatformX: platforms.at(-1).x,
      exitDoorX: trueExitDoor.x,
      exitDoorW: trueExitDoor.w,
    });
    syncViewportFromState();
  }

  // --- RENDERIZAÇÃO ---
  /** Compõe a fase ativa com escopo de diálogo temporário e encerra-o mesmo se o desenho falhar. */
  function render() {
    beginDialogueFrame(canvas);
    try {
      renderDarkRoom({
        ...runtimeContext,
        ctx,
        canvas,
        toyRoomIntroduction,
        opening,
        assets,
        lighting,
        fairyRenderer,
        cameraPresentation,
        camera,
        androidFraming,
        mobilePresentation,
        player,
        fairy,
        cameraX: state.cameraX,
        cameraY: state.cameraY,
        cameraZoom: state.cameraZoom,
        targetCameraY: state.targetCameraY,
        targetScrollSpeed: state.targetScrollSpeed,
        isPhase3: state.isPhase3,
        plotTwistActive: state.plotTwistActive,
        phase3TutorialActive: state.phase3TutorialActive,
        truePortalTransitionActive: state.truePortalTransitionActive,
        tick: state.tick,
        gameWon: state.gameWon,
        transitionWipeAlpha: state.transitionWipeAlpha,
        inputHandler,
        recordCameraQa,
        drawBackgroundWall,
        drawSceneryItems,
        drawPlatforms,
        drawExitDoor,
        drawTrueExitDoor,
        drawTutorialArrow,
        drawSpeedRibbons,
        drawPlayerJumpDust,
        drawFairy,
        drawPlayerManaStyle,
        applyDarkAtmosphereWithLights,
        drawEscapeBanner,
        drawCutsceneDialogue,
        state,
      });
    } finally {
      endDialogueFrame(canvas);
    }
  }

  let isPaused = false;

  /** Alterna pausa global e comunica o mesmo estado à perseguição 3D e ao áudio legado. */
  function togglePause() {
    isPaused = !isPaused;
    state.isPaused = isPaused;
    state.toyRoomInstance?.instance.chase?.setPaused(isPaused);
    state.toyRoomInstance?.instance.garden?.setPaused(isPaused);
    state.toyRoomInstance?.instance.dream?.setPaused(isPaused);
    state.toyRoomInstance?.instance.brinq?.setPaused(isPaused);
    if (isPaused) {
      state.toyRoomInstance?.instance.clearInput();
      if (audio && typeof audio.pauseMusic === 'function') {
        audio.pauseMusic();
      }
    } else {
      state.lastTime = performance.now();
      if (audio && typeof audio.resumeMusic === 'function') {
        audio.resumeMusic();
      }
    }
    return isPaused;
  }

  /** Define a pausa explicitamente sem repetir efeitos quando o estado já coincide. */
  function setPaused(value) {
    const shouldPause = Boolean(value);
    if (isPaused === shouldPause) return isPaused;
    return togglePause();
  }

  /** Salva campanha, abertura e snapshots da fase; ignora sessões de depuração. */
  function saveProgress() {
    if (debugSession || !state.gameStarted || toyRoomIntroduction.active) return;
    syncViewportToState();
    const persisted = campaign.write({
      state: captureState(state),
      opening: opening.snapshot(),
      platforms: [platforms, phase3Platforms].map((group) =>
        group.map((p) => ({
          isLanded: !!p.isLanded,
          lightAlpha: p.lightAlpha || 0,
        })),
      ),
      toyRoom: state.toyRoomInstance?.instance.snapshot() || null,
    });
    callbacks.onSaveStatus?.(persisted);
    lastSaveTime = performance.now();
  }

  /** Restaura estado, progressos visuais e cena a partir do envelope salvo. */
  function restoreProgress(saved) {
    cameraPresentation.reset();
    state.gameDifficulty = normalizeDifficulty(saved.state.gameDifficulty);
    if (saved.state.currentPhaseMode === 'toy-room') {
      startToyRoomPhase();
      state.toyRoomInstance.instance.restore(saved.toyRoom);
    }
    restoreState(state, saved.state);
    state.gameStarted = true;
    state.lastTime = performance.now();
    state.lastJumpTime = 0;
    state.lastDialogueAdvanceTime = 0;
    state.standbyActivatedTime = 0;
    syncViewportFromState();
    camera.syncFromState(state);
    opening.restore(saved.opening);
    [platforms, phase3Platforms].forEach((group, index) =>
      group.forEach((p, i) => {
        Object.assign(
          p,
          saved.platforms?.[index]?.[i] || {
            isLanded: false,
            lightAlpha: 0,
          },
        );
      }),
    );
    if (state.isGameOver)
      callbacks.onGameOver?.({
        phase: 'bedroom',
        offerEasy: state.easyOfferPending,
      });
    if (state.currentPhaseMode === 'bedroom') {
      if (opening.active && opening.time < 33.5) {
        audio.initAudio();
        audio.playOpeningAmbience();
      } else audio.startMusic();
    }
  }

  /** Descarta o estado de gameplay e seus recursos; pode preservar o save para revisão. */
  function newCampaign({ preserveProgress = false } = {}) {
    toyRoomIntroduction.cancel();
    introductionOverview = 0;
    state.gameStarted = false;
    cameraPresentation.reset();
    debugSession = preserveProgress;
    if (preserveProgress) opening.cancel();
    else {
      campaign.clear();
      opening.reset();
    }
    state.toyRoomInstance?.destroy();
    state.toyRoomInstance = null;
    audio.stopAllAudio();
    clearTimeout(failMessageTimer);
    restoreState(state, captureState(createDefaultStateVariables()));
    state.toyRoomInstance = null;
    state.gameStarted = false;
    state.lastTime = performance.now();
    state.lastJumpTime = 0;
    state.lastDialogueAdvanceTime = 0;
    state.standbyActivatedTime = 0;
    state.failMessageTimer = null;
    syncViewportFromState();
    camera.syncFromState(state);
    isPaused = false;
    state.isPaused = false;
    [platforms, phase3Platforms].forEach((group) =>
      group.forEach((p) => {
        p.isLanded = false;
        p.lightAlpha = 0;
      }),
    );
  }

  /** Reproduz a entrada da fase para revisão, sem gravar sobre a campanha normal. */
  function startDebugPhase(phase, difficulty = state.gameDifficulty) {
    if (
      ![
        'bedroom',
        'toy-room',
        'arena',
        'bear-chase',
        'garden',
        'dream-forest',
        'brinquedao',
      ].includes(phase)
    )
      return false;
    saveProgress();
    newCampaign({
      preserveProgress: true,
    });
    state.gameDifficulty = normalizeDifficulty(difficulty);
    state.gameStarted = true;
    audio.initAudio();
    if (phase === 'bedroom') {
      opening.start({
        replay: true,
      });
    } else if (phase === 'toy-room') {
      startToyRoomIntroduction();
    } else {
      startToyRoomPhase();
      if (phase === 'brinquedao')
        state.toyRoomInstance.instance.startBrinquedao(null, {
          campaign: false,
        });
      if (phase === 'dream-forest')
        state.toyRoomInstance.instance.startDream(null, {
          campaign: false,
        });
      if (phase === 'garden')
        state.toyRoomInstance.instance.startGarden(null, {
          campaign: false,
        });
      if (phase === 'bear-chase') {
        const room = state.toyRoomInstance.instance;
        room.startChasePreview();
      }
      if (phase === 'arena') {
        const room = state.toyRoomInstance.instance;
        room.tutorial.finish();
        room.story.state.investigationStage = 'EQUIPPED';
        room.story.state.swordEquipped = true;
        room.introAlpha = 0;
        room.introBannerTimer = 0;
        audio.setToyRoomMusicTrack('sword');
        room.arena.start();
      }
    }
    state.lastTime = performance.now();
    // O debug não salva campanha, mas deve publicar a fase no estado da simulação.
    syncViewportToState();
    if (!state.loopStarted) {
      state.loopStarted = true;
      requestAnimationFrame(loop);
    }
    return true;
  }

  /** Persiste a campanha quando o documento deixa de estar visível. */
  const saveOnHide = () => {
    if (document.visibilityState === 'hidden') saveProgress();
  };
  window.addEventListener('pagehide', saveProgress);
  document.addEventListener('visibilitychange', saveOnHide);

  const cameraQaObserver = createCameraQaObserver({
    host: window,
    snapshot: (transform) => ({
      cameraX: state.cameraX,
      cameraY: state.cameraY,
      cameraZoom: state.cameraZoom,
      playerX: player.x,
      playerY: player.y,
      fairyX: fairy.x,
      fairyY: fairy.y,
      onGround: player.onGround,
      platform: player.currentPlatformIndex,
      phase3: state.isPhase3,
      narrative: Boolean(
        opening.active ||
        state.isStandbyActive ||
        state.isStandbyTransitioning ||
        state.cutsceneActive ||
        state.plotTwistActive ||
        state.phase3TutorialActive ||
        state.truePortalTransitionActive,
      ),
      plotTwistActive: state.plotTwistActive,
      plotTwistStep: state.plotTwistStep,
      phase3TutorialActive: state.phase3TutorialActive,
      truePortalTransitionActive: state.truePortalTransitionActive,
      width: canvas.width,
      height: canvas.height,
      cssWidth: canvas.getBoundingClientRect().width,
      cssHeight: canvas.getBoundingClientRect().height,
      transform: transform
        ? {
            a: transform.a,
            d: transform.d,
            e: transform.e,
            f: transform.f,
          }
        : null,
    }),
  });

  /** Registra uma amostra de câmera e personagem no observador de QA, quando ativo. */
  function recordCameraQa(transform = null) {
    cameraQaObserver.record(transform);
  }

  /** Executa o ciclo de frame, limitando atualização e mantendo a apresentação sincronizada. */
  function loop(currentTime = performance.now()) {
    if (state.gameStarted && currentTime - lastSaveTime >= 1000) saveProgress();
    const elapsed = currentTime - state.lastTime;
    state.lastTime = currentTime;

    if (isPaused) {
      if (state.currentPhaseMode === 'toy-room' && state.toyRoomInstance) {
        state.toyRoomInstance.instance.render({
          overviewBlend: introductionOverview,
        });
      } else {
        render();
      }
      requestAnimationFrame(loop);
      return;
    }

    // Limite estrito de delta time:
    // Limita a razão de delta time entre 0.5 e 1.2 para prevenir picos causados por pausa, recarga ou lag
    const rawDt = elapsed / STEP_MS;
    const dt = Math.max(0.5, Math.min(1.2, isNaN(rawDt) || rawDt <= 0 ? 1.0 : rawDt));

    // Leitura de gamepad com latência zero (Botão X do controle) sincronizada ao loop do jogo
    if (inputHandler && typeof inputHandler.pollGamepad === 'function') {
      inputHandler.pollGamepad();
    }

    if (state.currentPhaseMode === 'toy-room' && state.toyRoomInstance) {
      state.toyRoomInstance.update(dt);
      introductionOverview = Math.max(0, introductionOverview - dt / 90);
      state.toyRoomInstance.instance.render({
        overviewBlend: introductionOverview,
      });
      requestAnimationFrame(loop);
      return;
    }

    update(dt);
    syncViewportToState();
    render();
    requestAnimationFrame(loop);
  }

  const inputHandler = bindInput({
    isFirstJumpTutorial: () => state.gameplayState === 'FIRST_JUMP_TUTORIAL',
    doJump,
    isGrounded: () =>
      Boolean(
        !opening.active &&
        player &&
        player.onGround &&
        !player.controlsLocked &&
        !player.respawnLandingPending &&
        !player.isCrouching &&
        !state.isStandbyActive,
      ),
    isCutsceneActive: () =>
      Boolean(
        state.toyRoomInstance?.instance?.brinq?.reading() ||
        state.toyRoomInstance?.instance?.dream?.reading() ||
        state.toyRoomInstance?.instance?.epilogue?.active ||
        opening.active ||
        state.cutsceneActive ||
        state.isStandbyActive ||
        (state.plotTwistActive && state.plotTwistStep >= 4),
      ),
    isGameOver: () => state.isGameOver,
    isToyRoomMode: () => state.currentPhaseMode === 'toy-room',
    setLastInputDevice,
    toggleMute: () => audio.toggleMute(),
  });

  /** Encaminha apenas a fala visível; nunca avança física ou ações de combate. */
  function advanceDialogue(event) {
    if (isPaused || !state.gameStarted) return false;
    if (opening.active) return opening.advanceDialogue();
    if (toyRoomIntroduction.active) return toyRoomIntroduction.advanceDialogue();
    if (state.currentPhaseMode === 'toy-room') {
      const room = state.toyRoomInstance?.instance;
      if (room?.epilogue?.active) return room.epilogue.advanceDialogue();
      if (room?.brinq?.active) return room.brinq.advanceDialogue();
      if (room?.dream?.active) return room.dream.advanceDialogue();
      if (room?.garden?.active) return room.garden.requestDialogueAdvance(event);
      if (room?.introBannerTimer > 0) {
        room.introBannerTimer = 0;
        return true;
      }
      if (room?.victoryBannerTimer > 0) {
        room.victoryBannerTimer = 0;
        return true;
      }
      if (room?.story?.advanceDialogue()) return true;
      return false;
    }
    if (state.isStandbyActive) {
      confirmStandby();
      return true;
    }
    if (state.cutsceneActive) {
      if (state.cutsceneStep === 1 && state.cutsceneTimer < 210) state.cutsceneTimer = 210;
      else if (state.cutsceneStep === 1) advanceCutscene();
      else finishCutscene();
      return true;
    }
    if (state.plotTwistActive && state.plotTwistStep >= 4) {
      if (state.plotTwistStep === 4) advancePlotTwist();
      else if (state.plotTwistTimer < 210) state.plotTwistTimer = 210;
      else finishPlotTwistAndStartTutorial();
      return true;
    }
    return false;
  }
  const removeDialogueAdvance = installDialogueAdvance(canvas, {
    enabled: () => !isPaused && state.gameStarted && !state.isGameOver,
    isModal: () =>
      Boolean(
        opening.active ||
        toyRoomIntroduction.active ||
        (state.currentPhaseMode !== 'toy-room' &&
          (state.isStandbyActive || state.cutsceneActive || state.plotTwistActive)) ||
        state.toyRoomInstance?.instance?.epilogue?.active ||
        state.toyRoomInstance?.instance?.brinq?.reading() ||
        state.toyRoomInstance?.instance?.dream?.reading() ||
        state.toyRoomInstance?.instance?.garden?.reading() ||
        state.toyRoomInstance?.instance?.story?.inputLocked,
      ),
    advance: advanceDialogue,
  });
  const runtimeContext = createRuntimeContext({
    state,
    audio,
    camera,
    assets,
    input: inputHandler,
    effects: particles,
    campaign,
  });
  const narrativeContext = {
    ...runtimeContext,
    state,
    player,
    fairy,
    canvas,
    audio,
    uiFeedback,
    spawnPlayerLandingPuff,
    spawnFairyFlightDust,
    spawnFairySparkles,
    updateFairyParticles,
    updatePlayerJumpDust,
    advanceCutscene,
    finishCutscene,
    advancePlotTwist,
    finishPlotTwistAndStartTutorial,
    startStandbyPreparation,
    confirmStandby,
    saveProgress,
    beginToyRoomIntroduction,
  };

  // Desenho inicial para renderizar o cenário por trás da tela de título
  render();

  return {
    state,
    audio,
    toyRoomIntroduction,
    /** Encaminha a ação somente ao diálogo ativo e evita avançar física durante a leitura. */
    advanceDialogue,
    camera,
    lighting,
    particles,
    transitions: transitionEffects,
    background: backgroundRenderer,
    platforms: platformRenderer,
    hud: hudRenderer,
    dialogue: dialogueRenderer,
    assets,
    platformContact,
    assetsReady,
    darkRoomAtlas,
    atlasDebugger,
    input: inputHandler,
    /** Pausa a música se o controlador de áudio ainda estiver disponível. */
    pauseMusic: () => audio && typeof audio.pauseMusic === 'function' && audio.pauseMusic(),
    /** Retoma a música solicitada pelo modo atual, sem alterar o estado de gameplay. */
    resumeMusic: () => audio && typeof audio.resumeMusic === 'function' && audio.resumeMusic(),
    /** Define o volume mestre do áudio e propaga o ajuste às trilhas. */
    setMasterVolume: (v) => audio.setMasterVolume(v),
    /** Consulta o volume mestre configurado no controlador de áudio. */
    getMasterVolume: () => audio.getMasterVolume(),
    /** Altera o estado de mudo e devolve o resultado do controlador de áudio. */
    setMuted: (m) => audio.setMuted(m),
    /** Consulta se os efeitos e as trilhas estão silenciados. */
    isMuted: () => audio.isMuted(),
    /** Alterna o mudo sem expor o estado interno do controlador de áudio. */
    toggleMute: () => audio.toggleMute(),
    /** Consulta o estado de pausa mantido pela sessão principal do jogo. */
    isPaused: () => isPaused,
    /** Alterna a pausa da simulação e sincroniza os componentes dependentes. */
    togglePause,
    /** Define explicitamente a pausa da simulação e sincroniza o estado público. */
    setPaused,
    /** Informa se existe progresso recuperável ou uma abertura já concluída. */
    hasProgress: () => Boolean(campaign.read() || opening.hasCompleted()),
    /** Informa se há uma campanha salva, sem contar apenas a abertura concluída. */
    hasSavedCampaign: () => Boolean(campaign.read()),
    /** Resolve a dificuldade efetiva da sessão ou da campanha salva. */
    getDifficulty: () =>
      normalizeDifficulty(
        state.gameStarted
          ? state.gameDifficulty
          : (campaign.read()?.state.gameDifficulty ?? state.gameDifficulty),
      ),
    /** Aceita a oferta de ajuda e retoma a tentativa atual em EASY. */
    continueOnEasy,
    /** Recusa a oferta de ajuda sem mudar a dificuldade escolhida. */
    declineEasyOffer,
    /** Persiste o estado recuperável da campanha ativa. */
    saveProgress,
    /** Inicia uma campanha nova e limpa o progresso anterior de acordo com o fluxo do jogo. */
    newCampaign,
    /** Remove listeners e encerra os recursos de áudio e da sala antes de descartar o jogo. */
    destroy() {
      removeDialogueAdvance();
      saveProgress();
      toyRoomIntroduction.cancel();
      window.removeEventListener('pagehide', saveProgress);
      document.removeEventListener('visibilitychange', saveOnHide);
      opening.cancel();
      if (inputHandler && typeof inputHandler.destroy === 'function') inputHandler.destroy();
      state.toyRoomInstance?.destroy();
      state.toyRoomInstance = null;
      if (audio && typeof audio.destroy === 'function') audio.destroy();
    },
    /** Inicia ou restaura a sessão e garante que o ciclo de atualização esteja ativo. */
    start(difficulty = 'NORMAL') {
      debugSession = false;
      const saved = campaign.read();
      if (saved) restoreProgress(saved);
      else state.gameDifficulty = normalizeDifficulty(difficulty);
      state.gameStarted = true;
      if (saved) {
        // O estado restaurado já contém posição, narrativa e fase; não o reinicializa.
      } else if (state.currentPhaseMode === 'toy-room') {
        audio.startToyRoomMusic();
      } else if (!opening.start()) {
        beginOpeningGameplay();
        enterFirstJumpTutorial();
        audio.startMusic();
      }
      if (!state.loopStarted) {
        state.loopStarted = true;
        requestAnimationFrame(loop);
      }
      saveProgress();
    },
    /** Solicita o salto usando a origem de entrada para aplicar as regras correspondentes. */
    doJump,
    /** Consulta se a personagem pode receber uma nova entrada de salto. */
    isGrounded: () =>
      Boolean(
        !opening.active &&
        player &&
        player.onGround &&
        !player.controlsLocked &&
        !player.respawnLandingPending &&
        !player.isCrouching &&
        !state.isStandbyActive,
      ),
    /** Consulta se uma fala ou cena modal está bloqueando a jogabilidade. */
    isCutsceneActive: () =>
      Boolean(
        state.toyRoomInstance?.instance?.brinq?.reading() ||
        state.toyRoomInstance?.instance?.dream?.reading() ||
        state.toyRoomInstance?.instance?.epilogue?.active ||
        opening.active ||
        state.cutsceneActive ||
        state.isStandbyActive ||
        (state.plotTwistActive && state.plotTwistStep >= 4),
      ),
    /** Registra o dispositivo de entrada mais recente para selecionar as instruções adequadas. */
    setLastInputDevice,
    /** Reposiciona e reinicializa o corpo físico no ponto inicial da tentativa. */
    resetToStart,
    /** Reinicia a fase após uma derrota válida, preservando a campanha. */
    retry: retryGame,
    /** Encerra a sessão atual e retorna à tela de título. */
    restartToTitle,
    /** Consulta se a fase ou modo de jogo atual chegou ao estado de derrota. */
    isGameOver,
    /** Abre a sala de brinquedos, opcionalmente após a introdução narrativa. */
    startToyRoomPhase,
    /** Reproduz a introdução da sala de brinquedos sem reiniciar a campanha. */
    startToyRoomIntroduction,
    /** Inicia a fase de depuração solicitada, sem alterar o fluxo normal do menu. */
    startDebugPhase,
    /** Consulta se a sessão atual está executando a sala de brinquedos. */
    isToyRoomMode: () => state.currentPhaseMode === 'toy-room',
  };
}
