import {beginDialogueFrame,endDialogueFrame} from '../narrative/DialogueFlow.js';
import { GardenPhase } from '../garden/GardenPhase.js';
import { createToyRoomTutorialContext } from './ToyRoomTutorialContext.js';
import { ToyRoomPersistence } from './ToyRoomPersistence.js';
import { createToyRoomPersistenceContext } from './ToyRoomPersistenceContext.js';
import { createToyRoomInitialEntities } from './ToyRoomInitialEntities.js';
import { renderToyRoomScene } from './ToyRoomSceneRenderer.js';
import { prepareToyRoomShadows } from './ToyRoomShadows.js';
import { createToyRoomSceneFrame } from './ToyRoomSceneFrame.js';
import { updateToyRoomCamera, getToyRoomCameraFrame } from './ToyRoomCamera.js';
import { updateToyRoomCompanion } from './ToyRoomCompanion.js';
import { spawnToyRoomSparkles, spawnToyRoomConfetti, initializeToyRoomSunMotes, updateToyRoomEffects } from './ToyRoomEffects.js';
import { ToyRoomInteraction } from './ToyRoomInteraction.js';
import { createToyRoomInteractionContext } from './ToyRoomInteractionContext.js';
import { updateToyRoomMovement, resolveToyRoomCollisions } from './ToyRoomMovement.js';
import { ToyRoomInputController } from './ToyRoomInputController.js';
import { createToyRoomInputContext } from './ToyRoomInputContext.js';
/**
 * ToyRoomPhase.js
 * Controlador principal da Fase da Sala de Brinquedos (estilo Top-Down 2D Legend of Mana).
 * Integra cenário da sala, brinquedos interativos, movimento 2.5D dos personagens,
 * resolução de colisões, mecânicas de pegar e guardar, efeitos de partículas e controles responsivos.
 */

import { isMobileDevice } from '../controllers/MobileZoom.js';
import { createToyRoomEnvironmentAssets } from './ToyRoomEnvironmentAssets.js';
import { ToyRoomTutorial } from './ToyRoomTutorial.js';
import { normalizeDifficulty } from '../state/GameDifficulty.js';
import { ToyRoomStory } from './ToyRoomStory.js';
import { createToyRoomStoryContext } from './ToyRoomStoryContext.js';
import { ToyRoomArenaPhase } from './ToyRoomArenaPhase.js';
import { ToyRoomBattle } from './ToyRoomBattle.js';
import { BearChasePhase } from '../bear-chase/BearChasePhase.js';

export class ToyRoomPhase {
  /** Compõe os sistemas da sala e mantém a perseguição 3D inativa até seleção explícita. */
  constructor(canvas, audio, uiFeedback, onReturnToTitle, options = {}) {
    this.canvas = canvas;
    this.gameDifficulty = normalizeDifficulty(options.gameDifficulty);
    this.mobilePresentation = isMobileDevice();
    this.ctx = canvas.getContext('2d');
    this.audio = audio;
    this.uiFeedback = uiFeedback;
    this.onReturnToTitle = onReturnToTitle;
    this.assets = options.assets || null;
    this.isInputEnabled = options.isInputEnabled || (() => true);
    this.onDefeat = options.onDefeat;
    this.reportedDefeat = null;
    this.bindInputs = options.bindInputs !== false;
    this.createChasePhase = options.createChasePhase || (config => new BearChasePhase(config));
    Object.assign(this, createToyRoomEnvironmentAssets(this.assets));

    // Dimensões da Sala
    this.ROOM_W = 1600;
    this.ROOM_H = 1200;

    // Rastreamento da Câmera
    this.cameraX = 0;
    this.cameraY = 0;

    // Estado Narrativo e de Transição
    this.introAlpha = 1.0;
    this.introBannerTimer = 240;
    this.victoryBannerActive = false;
    this.victoryBannerTimer = 0;

    // Sistemas de Partículas
    this.sunMotes = [];
    this.sparkles = [];
    this.confetti = [];
    this.footstepPuffs = [];

    initializeToyRoomSunMotes(this.sunMotes, this.ROOM_W, this.ROOM_H);

    Object.assign(this, createToyRoomInitialEntities());

    this.organizedCount = 0;
    this.lastActionTime = 0;
    this.ACTION_DEBOUNCE_MS = 250;

    this.keysDown = {};
    this.isTouchDevice = false;
    this.actionBtnPressed = false;
    this.canInteract = false;
    this.isNearChest = false;

    this.touchState = {
      active: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      vectorX: 0,
      vectorY: 0,
      pointerId: null
    };
    this.arenaTouchPointers = new Map();
    this.arenaTouchButtons = { left:false, right:false, up:false, down:false };
    this.arenaSpecialButtons = new Map();

    // Vincula manipuladores de eventos
    this.onKeyDown = this.handleKeyDown.bind(this);
    this.onKeyUp = this.handleKeyUp.bind(this);
    this.handlePointerDown = this.onPointerDown.bind(this);
    this.handlePointerMove = this.onPointerMove.bind(this);
    this.handlePointerUp = this.onPointerUp.bind(this);
    this.handleBlur = this.clearInput.bind(this);

    if (this.bindInputs) this.setupListeners();
    this.toyRoomTutorialCompleted = false;
    this.gameplayState = 'TOY_ROOM_GAMEPLAY';
    this.tutorial = new ToyRoomTutorial(createToyRoomTutorialContext(this));
    this.gamepadState = { x: 0, y: 0, active: false, buttons: new Map() };
    this.story = new ToyRoomStory(createToyRoomStoryContext(this));
    this.battle = new ToyRoomBattle(this, { loadAssets: typeof Image !== 'undefined' });
    this.arena = options.arenaEnabled !== false ? new ToyRoomArenaPhase(this) : null;
    this.chase = null;
    prepareToyRoomShadows(this.assets);
  }

  get inputController() {
    if (!this._inputController) {
      this._inputController = new ToyRoomInputController(createToyRoomInputContext(this));
    }
    return this._inputController;
  }

  setupListeners() { return this.inputController.setupListeners(); }

  getCanvasCoordinates(e) { return this.inputController.getCanvasCoordinates(e); }

  isActionButtonHit(coords) { return this.inputController.isActionButtonHit(coords); }

  handleKeyDown(e) { return this.inputController.handleKeyDown(e); }

  handleKeyUp(e) { return this.inputController.handleKeyUp(e); }

  pollGamepad() { return this.inputController.pollGamepad(); }

  onPointerDown(e) { return this.inputController.onPointerDown(e); }

  onPointerMove(e) { return this.inputController.onPointerMove(e); }

  onPointerUp(e) { return this.inputController.onPointerUp(e); }

  clearInput() { return this.inputController.clearInput(); }

  refreshArenaTouchButtons() { return this.inputController.refreshArenaTouchButtons(); }

  spawnSparkles(x, y, count = 12, hue = '#facc15') {
    return spawnToyRoomSparkles(this.sparkles, x, y, count, hue);
  }

  spawnConfetti(x, y, count = 35) {
    return spawnToyRoomConfetti(this.confetti, x, y, count);
  }

  get interaction() {
    if (!this._interaction) this._interaction = new ToyRoomInteraction(createToyRoomInteractionContext(this));
    return this._interaction;
  }

  /** Encaminha ações da sala; a perseguição 3D usa somente seus controles laterais. */
  triggerAction() { if (!this.garden?.active && !this.chase?.active) return this.interaction.triggerAction(); }

  /** Abre a prova isolada sem migrar saves ou antecipar a nova transição de campanha. */
  startChasePreview(saved = null) {
    this.chase?.destroy();
    this.clearInput(); this.inputController.removeListeners();
    this.arena?.audioProfile.leave({ resume: false });
    this.audio?.stopAllAudio?.(); this.audio?.stopToyRoomMusic?.();
    this.chase = this.createChasePhase({ canvas: this.canvas, audio: this.audio,
      enabled: this.isInputEnabled, difficulty: this.gameDifficulty });
    this.gameplayState = 'BEAR_CHASE_PREVIEW';
    return this.chase.start(saved);
  }

  /** Inicia a perseguição da campanha sob o fade da vitória, sem reutilizar o seletor de debug. */
  startChaseCampaign(saved = null) {
    if (this.chase?.campaign && this.chase.active) return false;
    this.chase?.destroy();
    this.clearInput(); this.inputController.removeListeners();
    this.arena?.audioProfile.leave({ resume: false });
    this.audio?.stopAllAudio?.(); this.audio?.stopToyRoomMusic?.();
    let chase;
    try {
      chase = this.createChasePhase({ canvas: this.canvas, audio: this.audio,
        enabled: this.isInputEnabled, difficulty: this.gameDifficulty, campaign: true,
        onCampaignError: message => this.handleCampaignChaseError(chase, message) });
    } catch (error) {
      const message = `Não foi possível preparar a fuga: ${error.message}`;
      console.warn('Preparação da fuga interrompida:', error.message);
      this.handleCampaignChaseError(null, message);
      return false;
    }
    this.chase = chase;
    this.gameplayState = 'BEAR_CHASE_CAMPAIGN';
    if (this.uiFeedback) this.uiFeedback.innerText = '';
    return chase.start(saved);
  }

  /** Recupera a sala e informa explicitamente caso os recursos da fuga não carreguem. */
  handleCampaignChaseError(chase, message) {
    if (chase && (this.chase !== chase || chase.disposed)) return;
    chase?.destroy();
    this.chase = null;
    this.gameplayState = 'TOY_ROOM_GAMEPLAY';
    if (this.bindInputs) this.setupListeners();
    // O feedback legado fica oculto na interface; o diálogo torna a falha visível e acessível.
    if (typeof document !== 'undefined') {
      const dialog = document.getElementById('chase-error-dialog');
      if (dialog) {
        document.getElementById('chase-error-message').textContent = message;
        if (!dialog.open) dialog.showModal();
      }
    }
    if (this.uiFeedback) {
      this.uiFeedback.innerText = `A fuga não pôde ser iniciada. ${message}`;
      this.uiFeedback.style.color = '#fca5a5';
    }
  }

  /** Abre o dia seguinte com física e roupa próprias, descartando controles do quarto. */
  startGarden(saved = null, { campaign = true } = {}) {
    this.garden?.destroy();this.garden = null;
    this.chase?.destroy();this.chase = null;
    this.clearInput();this.inputController.removeListeners();
    this.arena?.audioProfile.leave({resume:false});this.audio?.stopAllAudio?.();this.audio?.stopToyRoomMusic?.();
    this.garden = new GardenPhase({canvas:this.canvas,audio:this.audio,enabled:this.isInputEnabled,difficulty:this.gameDifficulty,campaign});
    this.gameplayState='GARDEN';return this.garden.start(saved);
  }

  resolveCollisions(px, py, r) {
    return resolveToyRoomCollisions({
      width: this.ROOM_W, height: this.ROOM_H, furniture: this.furniture
    }, px, py, r);
  }

  /** Atualiza exclusivamente o modo ativo, sem compartilhar física entre 2D e 3D. */
  update(dt = 1.0) {
    this.updateActiveMode(dt);
    const defeat = this.garden?.active && this.garden.state.stage === 'GAME_OVER'
      ? { state:this.garden.state, phase:'garden' }
      : this.chase?.active && this.chase.state.stage === 'GAME_OVER'
      ? { state: this.chase.state, phase: 'bear-chase' }
      : this.battle.state?.mode === 'DEFEAT' ? { state: this.battle.state, phase: 'arena' } : null;
    if (defeat && this.reportedDefeat !== defeat.state) {
      this.reportedDefeat = defeat.state;
      this.clearInput();
      this.onDefeat?.(defeat.phase);
    }
  }

  /** Executa a etapa ativa; a notificação de derrota acontece depois de sua simulação. */
  updateActiveMode(dt) {
    if (this.garden?.active) { this.garden.update(dt);return; }
    if (!this.isInputEnabled()) { this.clearInput(); return; }
    if (this.chase?.active) {
      this.chase.update(dt);
      if(this.chase.campaign && this.chase.state.stage==='COMPLETE') {
        this.gardenTransition=(this.gardenTransition||0)+dt;
        if(this.gardenTransition>=150)this.startGarden();
      } else this.gardenTransition=0;
      return;
    }
    this.pollGamepad();
    if (this.arena?.active) { this.arena.update(dt); return; }
    if (!this.battle.state && this.story.swordEquipped && !this.arena?.state.completed) {
      if (this.arena) { this.arena.start(); this.arena.update(dt); return; }
      this.battle.activate();
    }
    if (this.battle.state) { this.battle.update(dt); return; }
    // Temporizadores de faixas e transição
    if (this.introAlpha > 0) {
      this.introAlpha = Math.max(0, this.introAlpha - 0.02 * dt);
    }
    if (this.introBannerTimer > 0) {
      this.introBannerTimer -= dt;
    }
    if (this.victoryBannerActive && this.victoryBannerTimer > 0) {
      this.victoryBannerTimer -= dt;
    }
    if (this.story?.update(dt)) {
      // A narrativa suspende o movimento, mas permite concluir o assentamento visual dos pés.
      this.player.runBlend = Math.max(0, (this.player.runBlend ?? 0) - Math.max(0, dt) / 8);
      if (this.story.swordEquipped && !this.battle.state && !this.arena?.state.completed) {
        if (this.arena) this.arena.start(); else this.battle.activate();
      }
      if (!this.arena?.active && !this.battle.state) this.updateCamera(dt);
      return;
    }

    const chest = this.interaction.updateProximity();

    updateToyRoomMovement({
      player: this.player,
      keysDown: this.keysDown,
      gamepadState: this.gamepadState,
      touchState: this.touchState,
      footstepPuffs: this.footstepPuffs,
      resolveCollisions: (x, y, radius) => this.resolveCollisions(x, y, radius)
    }, dt);
    this.story?.updateAfterMovement();

    // Posição do brinquedo carregado acima da cabeça
    if (this.player.carriedItem) {
      this.player.carriedItem.x = this.player.x;
      this.player.carriedItem.y = this.player.y - 38 + Math.sin(this.player.animTime * 1.5) * 3;
    }

    this.guideToy = updateToyRoomCompanion({ player: this.player, fairy: this.fairy,
      toys: this.toys, tutorial: this.tutorial, story: this.story,
      gameDifficulty: this.gameDifficulty, guideToy: this.guideToy }, dt);

    updateToyRoomEffects({ chest, sparkles: this.sparkles, confetti: this.confetti,
      footstepPuffs: this.footstepPuffs, sunMotes: this.sunMotes,
      width: this.ROOM_W, height: this.ROOM_H }, dt);

    this.updateCamera(dt);
  }

  /** Reaplica a dificuldade à etapa atual, conservando atores, posição e narrativa. */
  setDifficulty(difficulty) {
    this.gameDifficulty = normalizeDifficulty(difficulty);
    if (this.chase?.active) this.chase.difficulty = this.gameDifficulty;
    if (this.garden?.active) this.garden.difficulty = this.gameDifficulty;
    if (this.arena?.active && !this.arena.state.realityRestored) this.arena.configurePresentation();
  }

  /** Recupera a tentativa atual; ao aceitar ajuda, conserva o adversário ou percurso. */
  retryDefeat({ resume = false } = {}) {
    if (this.garden?.active) {const retried=this.garden.retry();if(retried)this.reportedDefeat=null;return retried;}
    if (this.chase?.active) {
      const retried = this.chase.retry({ resume });
      if (retried) this.reportedDefeat = null;
      return retried;
    }
    const s = this.battle.state;
    if (s?.mode !== 'DEFEAT') return false;
    if (resume) {
      Object.assign(s, { mode: 'BATTLE', ending: 0, hitPause: 0, playerHitTime: 0,
        playerKnockback: 0, attackTime: 0, cooldown: 0, immunity: this.battle.tuning.immunity });
      s.player.hp = s.player.maxHp;
      this.story.state.attackElapsed = 0;
    } else if (this.arena?.active) {
      this.arena.retry();
    } else {
      this.battle.state = null;
      this.battle.activate();
    }
    this.reportedDefeat = null;
    this.clearInput();
    return true;
  }

  updateCamera(dt) {
    const camera = updateToyRoomCamera({ target: this.story.cameraTarget() || this.player,
      canvas: this.canvas, width: this.ROOM_W, height: this.ROOM_H,
      cameraX: this.cameraX, cameraY: this.cameraY }, dt);
    this.cameraX = camera.cameraX;
    this.cameraY = camera.cameraY;
  }

  getCameraFrame() {
    return getToyRoomCameraFrame({ target: this.story.cameraTarget() || this.player,
      canvas: this.canvas, cameraX: this.cameraX, cameraY: this.cameraY,
      mobilePresentation: this.mobilePresentation });
  }

  /** Desenha o modo ativo; o renderer 3D compõe sua saída no canvas já existente. */
  render(options = {}) {
    beginDialogueFrame(this.canvas);try{
    if (this.garden?.active && !options.arenaBackdrop) {this.garden.render();return;}
    if (this.chase?.active && !options.arenaBackdrop) { this.chase.render(); return; }
    if (this.arena?.active && !options.arenaBackdrop) { this.arena.render(); return; }
    if (this.battle.state && !options.arenaBackdrop) { this.battle.render(); return; }
    return renderToyRoomScene(createToyRoomSceneFrame(this), options);
    }finally{endDialogueFrame(this.canvas);}
  }

  startTutorial() { this.tutorial.start(); }

  get persistence() {
    if (!this._persistence) this._persistence = new ToyRoomPersistence(createToyRoomPersistenceContext(this));
    return this._persistence;
  }

  snapshot(options) { return this.persistence.snapshot(options); }

  restore(saved, options) { return this.persistence.restore(saved, options); }

  /** Encerra todos os sistemas ativos, incluindo listeners e recursos da perseguição. */
  destroy() {
    this.garden?.destroy();this.garden=null;
    this.chase?.destroy(); this.chase = null;
    this.arena?.audioProfile.leave({ resume: false });
    this.clearInput();
    if (this.audio && this.audio.stopToyRoomMusic) {
      this.audio.stopToyRoomMusic();
    }
    this.inputController.removeListeners();
  }
}

export function createToyRoom(canvas, audio, uiFeedback, onReturnToTitle, options) {
  const toyRoom = new ToyRoomPhase(canvas, audio, uiFeedback, onReturnToTitle, options);
  return {
    update: (dt) => toyRoom.update(dt),
    render: () => toyRoom.render(),
    triggerAction: () => toyRoom.triggerAction(),
    destroy: () => toyRoom.destroy(),
    instance: toyRoom
  };
}
