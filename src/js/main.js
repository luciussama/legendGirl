import { attachMobileUILayout } from './ui/MobileUILayout.js';
import { TitleScreen } from './ui/TitleScreen.js';
// Previne que rejeições assíncronas do navegador ou iframes acionem o coletor de erros da plataforma
window.addEventListener('unhandledrejection', (event) => {
  if (event) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  if (event && event.preventDefault) {
    event.preventDefault();
  }
});

import { createGame } from './game.js';
import { DEBUG_COLLISIONS } from './config.js';

const canvas = document.getElementById('gameCanvas');
attachMobileUILayout(canvas);
const uiFeedback = document.getElementById('ui-feedback') || {
  innerText: '',
  textContent: '',
  style: {}
};
const startOverlay = document.getElementById('start-overlay');
const difficultySelect = document.getElementById('game-difficulty');
const restartCampaignDialog = document.getElementById('restart-campaign-dialog');

let titleScreen;
/** Atualiza a disponibilidade de carregar ao retornar ao título. */
function refreshCampaignMenu() { titleScreen?.refresh(); }

const debugPhaseSelect = document.getElementById('debug-phase-select');
const debugPhaseToggle = document.getElementById('btn-debug-phase-toggle');
const debugPhasePanel = document.getElementById('debug-phase-panel');
const gameoverOverlay = document.getElementById('gameover-overlay');
const btnRetry = document.getElementById('btn-retry');
const btnRestart = document.getElementById('btn-restart');
const btnSoundToggle = document.getElementById('btn-sound-toggle');
const soundIcon = document.getElementById('sound-icon');
const btnPauseToggle = document.getElementById('btn-pause-toggle');
const pauseIcon = document.getElementById('pause-icon');
// DEBUG_COLLISIONS = false: nenhuma hitbox, nome ou coordenada deve ser visível para o jogador
window.DEBUG_COLLISIONS = false;
window.SHOW_HITBOXES = false;

function updatePauseButtonState() {
  const isPaused = game.isPaused && game.isPaused();
  if (btnPauseToggle) {
    if (isPaused) {
      btnPauseToggle.classList.add('paused');
      btnPauseToggle.title = 'Continuar Jogo (P)';
      btnPauseToggle.setAttribute('aria-label', 'Continuar jogo');
      if (pauseIcon) pauseIcon.textContent = '▶️';
    } else {
      btnPauseToggle.classList.remove('paused');
      btnPauseToggle.title = 'Pausar Jogo (P)';
      btnPauseToggle.setAttribute('aria-label', 'Pausar jogo');
      if (pauseIcon) pauseIcon.textContent = '⏸️';
    }
  }
}

function toggleGamePause() {
  if (typeof game.togglePause === 'function') {
    game.togglePause();
    updatePauseButtonState();
  }
}

if (btnPauseToggle) {
  btnPauseToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleGamePause();
  });
}

function updateSoundButtonState() {
  const isMuted = game.isMuted && game.isMuted();
  if (btnSoundToggle) {
    if (isMuted) {
      btnSoundToggle.classList.add('muted');
      btnSoundToggle.title = 'Ativar Som (M)';
      btnSoundToggle.setAttribute('aria-label', 'Ativar som');
      if (soundIcon) soundIcon.textContent = '🔇';
    } else {
      btnSoundToggle.classList.remove('muted');
      btnSoundToggle.title = 'Mudo (M)';
      btnSoundToggle.setAttribute('aria-label', 'Desativar som');
      if (soundIcon) soundIcon.textContent = '🔊';
    }
  }
}

if (btnSoundToggle) {
  btnSoundToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof game.toggleMute === 'function') {
      game.toggleMute();
      updateSoundButtonState();
    }
  });
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyM' || e.key === 'm' || e.key === 'M') {
    setTimeout(updateSoundButtonState, 10);
  } else if (e.code === 'KeyP' || e.key === 'p' || e.key === 'P' || e.key === 'Pause') {
    e.preventDefault();
    toggleGamePause();
  }
});

let started = false;
let isStarting = false;
let isActionLocked = false;
let lastActionTime = 0;

const game = createGame(canvas, uiFeedback, {
  onSaveStatus: persisted => {
    const status = document.getElementById('campaign-save-status');
    status.hidden = persisted;
    status.textContent = persisted ? '' : 'Não foi possível salvar neste navegador. O progresso está disponível somente nesta sessão.';
  },
  onGameOver: () => {
    // Reativa os botões e exibe a tela de sobreposição de forma limpa
    isActionLocked = false;
    updatePauseButtonState();
    if (btnRetry) btnRetry.disabled = false;
    if (btnRestart) btnRestart.disabled = false;
    if (gameoverOverlay) {
      gameoverOverlay.style.display = 'flex';
      gameoverOverlay.style.pointerEvents = 'auto';
      gameoverOverlay.classList.remove('hidden');
    }
  },
  onRestartToTitle: () => {
    refreshCampaignMenu();
    started = false;
    isStarting = false;
    isActionLocked = false;
    updatePauseButtonState();
    if (btnRetry) btnRetry.disabled = false;
    if (btnRestart) btnRestart.disabled = false;
    if (gameoverOverlay) {
      gameoverOverlay.style.pointerEvents = 'none';
      gameoverOverlay.classList.add('hidden');
      gameoverOverlay.style.display = 'none';
    }
    if (startOverlay) {
      startOverlay.style.display = 'flex';
      startOverlay.style.pointerEvents = 'auto';
      startOverlay.classList.remove('hidden');
    }
  }
});

function startGame(event) {
  if (restartCampaignDialog.open || document.getElementById('title-options-dialog').open) return;
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const now = performance.now();
  if (started || isStarting || now - lastActionTime < 450) {
    return;
  }

  isStarting = true;
  lastActionTime = now;

  if (startOverlay) {
    startOverlay.style.pointerEvents = 'none';
    startOverlay.classList.add('hidden');
    startOverlay.style.display = 'none';
  }

  game.start(difficultySelect.value);

  setTimeout(() => {
    started = true;
    isStarting = false;
  }, 350);
}

function handleRetry(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const now = performance.now();
  if (isActionLocked || now - lastActionTime < 450) {
    return;
  }
  isActionLocked = true;
  lastActionTime = now;

  // Desativa imediatamente os botões para evitar cliques repetidos acidentais
  if (btnRetry) btnRetry.disabled = true;
  if (btnRestart) btnRestart.disabled = true;

  if (gameoverOverlay) {
    gameoverOverlay.style.pointerEvents = 'none';
    gameoverOverlay.classList.add('hidden');
    gameoverOverlay.style.display = 'none';
  }

  game.retry();

  setTimeout(() => {
    if (btnRetry) btnRetry.disabled = false;
    if (btnRestart) btnRestart.disabled = false;
    isActionLocked = false;
  }, 450);
}

function handleRestart(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const now = performance.now();
  if (isActionLocked || now - lastActionTime < 450) {
    return;
  }
  isActionLocked = true;
  lastActionTime = now;

  // Desativa imediatamente os botões para evitar cliques repetidos acidentais
  if (btnRetry) btnRetry.disabled = true;
  if (btnRestart) btnRestart.disabled = true;

  if (gameoverOverlay) {
    gameoverOverlay.style.pointerEvents = 'none';
    gameoverOverlay.classList.add('hidden');
    gameoverOverlay.style.display = 'none';
  }

  game.restartToTitle();

  setTimeout(() => {
    if (btnRetry) btnRetry.disabled = false;
    if (btnRestart) btnRestart.disabled = false;
    isActionLocked = false;
  }, 450);
}

// Utilitário para vincular eventos de forma segura entre pointerdown e click sem disparos duplicados
function addSafeAction(element, handler) {
  if (!element) return;
  let lastEventTime = 0;
  const safeHandler = (event) => {
    const now = performance.now();
    if (now - lastEventTime < 450) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }
    lastEventTime = now;
    handler(event);
  };

  element.addEventListener('pointerdown', safeHandler);
  element.addEventListener('click', safeHandler);
}

function handleToyRoomSwitch(event) {
  if (restartCampaignDialog.open) return;
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Proteção absoluta: impede mudar de fase se o jogo já estiver rodando ou o menu estiver fechado
  if (started || isStarting || (startOverlay && (startOverlay.classList.contains('hidden') || startOverlay.style.display === 'none'))) {
    return;
  }

  const now = performance.now();
  if (isActionLocked || now - lastActionTime < 450) {
    return;
  }
  isActionLocked = true;
  lastActionTime = now;

  if (startOverlay) {
    startOverlay.style.pointerEvents = 'none';
    startOverlay.classList.add('hidden');
    startOverlay.style.display = 'none';
  }
  if (gameoverOverlay) {
    gameoverOverlay.style.pointerEvents = 'none';
    gameoverOverlay.classList.add('hidden');
    gameoverOverlay.style.display = 'none';
  }

  started = true;
  game.startToyRoomIntroduction();

  setTimeout(() => {
    isActionLocked = false;
  }, 450);
}

titleScreen = new TitleScreen({ game,
  onNew: () => { if (started || isStarting) return; game.newCampaign(); lastActionTime = 0; startGame(); },
  onLoad: () => startGame()
});

// Mantém atalhos de gameplay fora do diálogo de recuperação; Escape conserva o fechamento nativo.
for (const type of ['keydown', 'keyup']) {
  document.getElementById('chase-error-dialog').addEventListener(type, event => event.stopPropagation());
}

if (debugPhaseSelect) {
  const menu = debugPhaseToggle?.closest('.phase-debug-menu');
  const setDebugPhaseMenuOpen = (open, restoreFocus = false) => {
    if (!debugPhasePanel || !debugPhaseToggle) return;
    debugPhasePanel.hidden = !open;
    debugPhaseToggle.setAttribute('aria-expanded', String(open));
    if (open) debugPhaseSelect.focus({ preventScroll: true });
    else if (restoreFocus) debugPhaseToggle.focus({ preventScroll: true });
  };
  debugPhaseToggle?.addEventListener('click', event => {
    event.stopPropagation();
    setDebugPhaseMenuOpen(debugPhasePanel.hidden);
  });
  // Interagir com a ferramenta não dispara atalhos nem movimento da partida.
  menu?.addEventListener('keydown', event => {
    event.stopPropagation();
    if (event.key === 'Escape') {
      event.preventDefault();
      setDebugPhaseMenuOpen(false, true);
    }
  });
  menu?.addEventListener('keyup', event => event.stopPropagation());
  menu?.addEventListener('pointerdown', event => event.stopPropagation());
  document.addEventListener('pointerdown', event => {
    if (!menu?.contains(event.target)) setDebugPhaseMenuOpen(false);
  });
  debugPhaseSelect.addEventListener('change', event => {
    event.stopPropagation();
    const phase = debugPhaseSelect.value;
    if (!phase || restartCampaignDialog.open || isStarting) return;
    if (!game.startDebugPhase(phase, difficultySelect.value)) return;
    for (const overlay of [startOverlay,gameoverOverlay]) {
      if (!overlay) continue;
      overlay.classList.add('hidden'); overlay.style.display = 'none'; overlay.style.pointerEvents = 'none';
    }
    started = true; isStarting = false; isActionLocked = false;
    updatePauseButtonState();
    debugPhaseSelect.value = ''; debugPhaseSelect.blur();
    setDebugPhaseMenuOpen(false);
  });
}

refreshCampaignMenu();

if (btnRetry) {
  addSafeAction(btnRetry, handleRetry);
}

if (btnRestart) {
  addSafeAction(btnRestart, handleRestart);
}

window.addEventListener('keydown', (event) => {
  if (restartCampaignDialog.open || document.getElementById('title-options-dialog').open || event.target.closest?.('button, a, input, select, dialog')) return;
  // Evita disparo contínuo por repetição de tecla pressionada
  if (event.repeat) {
    return;
  }

  // Atalho de troca rápida para testar a Sala de Brinquedos diretamente
  if (event.code === 'KeyT' || event.code === 'Digit4') {
    handleToyRoomSwitch(event);
    return;
  }

  if (!started) {
    if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'Enter' || event.code === 'Digit1') {
      event.preventDefault(); titleScreen.requestNew();
    }
    return;
  }

  if (game.isGameOver && game.isGameOver()) {
    if (event.code === 'Space' || event.key === ' ' || event.code === 'Enter' || event.code === 'ArrowUp') {
      handleRetry(event);
    } else if (event.code === 'Escape' || event.code === 'KeyR') {
      handleRestart(event);
    }
  }
});

// Navegação via Gamepad para telas de Início e Fim de Jogo (Botão X e Botão A do controle Xbox)
let prevOverlayButtonX = false;
let prevOverlayButtonA = false;

function pollOverlayGamepad() {
  if (restartCampaignDialog.open || document.getElementById('title-options-dialog').open) return;
  if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') return;
  let gamepads;
  try {
    gamepads = navigator.getGamepads();
  } catch (e) {
    return;
  }
  if (!gamepads) return;

  for (let i = 0; i < gamepads.length; i++) {
    const gp = gamepads[i];
    if (!gp || !gp.connected || !gp.buttons) continue;

    const btnA = gp.buttons[0]; // Xbox A
    const btnX = gp.buttons[2]; // Xbox X
    const isAPressed = Boolean(btnA && (btnA.pressed || btnA.value > 0.5));
    const isXPressed = Boolean(btnX && (btnX.pressed || btnX.value > 0.5));

    if ((isXPressed && !prevOverlayButtonX) || (isAPressed && !prevOverlayButtonA)) {
      if (typeof game.setLastInputDevice === 'function') {
        game.setLastInputDevice('gamepad');
      }
      if (!started) {
        titleScreen.activateFocused();
      } else if (game.isGameOver && game.isGameOver()) {
        handleRetry();
      }
    }

    prevOverlayButtonX = isXPressed;
    prevOverlayButtonA = isAPressed;
  }
}

setInterval(pollOverlayGamepad, 80);

if (typeof window !== 'undefined') {
  window.game = game;
}
