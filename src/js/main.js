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

const canvas = document.getElementById('gameCanvas');
const uiFeedback = document.getElementById('ui-feedback') || {
  innerText: '',
  textContent: '',
  style: {}
};
const startOverlay = document.getElementById('start-overlay');
const btnSkipPhase2 = document.getElementById('btn-skip-phase2');
const gameoverOverlay = document.getElementById('gameover-overlay');
const btnRetry = document.getElementById('btn-retry');
const btnRestart = document.getElementById('btn-restart');
const btnSoundToggle = document.getElementById('btn-sound-toggle');
const soundIcon = document.getElementById('sound-icon');

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
  }
});

let started = false;
let isStarting = false;
let isActionLocked = false;
let lastActionTime = 0;

const game = createGame(canvas, uiFeedback, {
  onGameOver: () => {
    // Reativa os botões e exibe a tela de sobreposição de forma limpa
    isActionLocked = false;
    if (btnRetry) btnRetry.disabled = false;
    if (btnRestart) btnRestart.disabled = false;
    if (gameoverOverlay) {
      gameoverOverlay.classList.remove('hidden');
    }
  },
  onRestartToTitle: () => {
    started = false;
    isStarting = false;
    isActionLocked = false;
    if (btnRetry) btnRetry.disabled = false;
    if (btnRestart) btnRestart.disabled = false;
    if (startOverlay) {
      startOverlay.style.pointerEvents = 'auto';
      startOverlay.classList.remove('hidden');
    }
  }
});

function startGame(event) {
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
  }

  game.start();

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
    gameoverOverlay.classList.add('hidden');
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
    gameoverOverlay.classList.add('hidden');
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

  if (startOverlay) {
    startOverlay.style.pointerEvents = 'none';
    startOverlay.classList.add('hidden');
  }
  if (gameoverOverlay) {
    gameoverOverlay.classList.add('hidden');
  }

  started = true;
  game.startToyRoomPhase();

  setTimeout(() => {
    isActionLocked = false;
  }, 450);
}

if (btnSkipPhase2) {
  addSafeAction(btnSkipPhase2, (e) => {
    handleToyRoomSwitch(e);
  });
}

if (startOverlay) {
  addSafeAction(startOverlay, (e) => {
    if (e && e.target && e.target.closest('#btn-skip-phase2')) {
      return;
    }
    startGame(e);
  });
}

if (btnRetry) {
  addSafeAction(btnRetry, handleRetry);
}

if (btnRestart) {
  addSafeAction(btnRestart, handleRestart);
}

window.addEventListener('keydown', (event) => {
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
    if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'Enter') {
      startGame(event);
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
        startGame();
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

