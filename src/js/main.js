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
const uiFeedback = document.getElementById('ui-feedback') || {
  innerText: '',
  textContent: '',
  style: {}
};
const startOverlay = document.getElementById('start-overlay');
const btnStartPhase1 = document.getElementById('btn-start-phase1');
const btnSkipPhase2 = document.getElementById('btn-skip-phase2');
const gameoverOverlay = document.getElementById('gameover-overlay');
const btnRetry = document.getElementById('btn-retry');
const btnRestart = document.getElementById('btn-restart');
const btnSoundToggle = document.getElementById('btn-sound-toggle');
const soundIcon = document.getElementById('sound-icon');
const btnPauseToggle = document.getElementById('btn-pause-toggle');
const pauseIcon = document.getElementById('pause-icon');
const btnDownloadZip = document.getElementById('btn-download-zip');
const btnStartDownloadZip = document.getElementById('btn-start-download-zip');

// Elementos do Modal Central de Download
const downloadModal = document.getElementById('download-modal');
const modalBtnCloseX = document.getElementById('modal-btn-close-x');
const modalBtnCloseFooter = document.getElementById('modal-btn-close-footer');
const modalBtnDownloadTab = document.getElementById('modal-btn-download-tab');
const modalBtnDownloadPage = document.getElementById('modal-btn-download-page');
const modalDirectUrlInput = document.getElementById('modal-direct-url-input');
const modalBtnCopyUrl = document.getElementById('modal-btn-copy-url');
const modalCopyUrlFeedback = document.getElementById('modal-copy-url-feedback');
const modalCurlCommandInput = document.getElementById('modal-curl-command-input');
const modalBtnCopyCurl = document.getElementById('modal-btn-copy-curl');
const modalCopyCurlFeedback = document.getElementById('modal-copy-curl-feedback');
const modalBtnStreamDownload = document.getElementById('modal-btn-stream-download');
const modalStreamProgress = document.getElementById('modal-stream-progress');
const modalStreamFill = document.getElementById('modal-stream-fill');
const modalStreamText = document.getElementById('modal-stream-text');
const modalStreamStatus = document.getElementById('modal-stream-status');

function openDownloadModal() {
  if (!downloadModal) return;
  const origin = window.location.origin;
  const directUrl = `${origin}/api/download-zip`;
  const pageUrl = `${origin}/baixar`;
  const curlCmd = `curl -L -O "${directUrl}" -o o-quarto-dos-brinquedos.zip`;

  if (modalDirectUrlInput) modalDirectUrlInput.value = directUrl;
  if (modalCurlCommandInput) modalCurlCommandInput.value = curlCmd;
  if (modalBtnDownloadTab) modalBtnDownloadTab.href = directUrl;
  if (modalBtnDownloadPage) modalBtnDownloadPage.href = pageUrl;
  if (modalCopyUrlFeedback) modalCopyUrlFeedback.textContent = '';
  if (modalCopyCurlFeedback) modalCopyCurlFeedback.textContent = '';

  downloadModal.classList.remove('hidden');
}

function closeDownloadModal() {
  if (!downloadModal) return;
  downloadModal.classList.add('hidden');
}

function copyToClipboard(text, feedbackEl, successMsg = '✅ Copiado!') {
  if (!text) return;
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(text).then(() => {
      if (feedbackEl) {
        feedbackEl.textContent = successMsg;
        setTimeout(() => { if (feedbackEl) feedbackEl.textContent = ''; }, 3500);
      }
    }).catch(() => {
      fallbackCopy(text, feedbackEl, successMsg);
    });
  } else {
    fallbackCopy(text, feedbackEl, successMsg);
  }
}

function fallbackCopy(text, feedbackEl, successMsg) {
  try {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    if (feedbackEl) {
      feedbackEl.textContent = successMsg;
      setTimeout(() => { if (feedbackEl) feedbackEl.textContent = ''; }, 3500);
    }
  } catch (_e) {
    if (feedbackEl) feedbackEl.textContent = 'Pressione Ctrl+C para copiar.';
  }
}

function showDownloadToast(message, isError = false) {
  let toast = document.getElementById('download-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'download-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid #10b981;
      border-radius: 12px;
      padding: 14px 20px;
      color: #f8fafc;
      font-family: inherit;
      font-size: 14px;
      z-index: 999999;
      box-shadow: 0 10px 25px rgba(0,0,0,0.6), 0 0 20px rgba(16, 185, 129, 0.2);
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 90vw;
      width: 440px;
      text-align: center;
      pointer-events: auto;
    `;
    document.body.appendChild(toast);
  }

  toast.style.borderColor = isError ? '#f87171' : '#34d399';
  toast.innerHTML = `
    <div style="font-weight: 600; color: ${isError ? '#fca5a5' : '#a7f3d0'};">${message}</div>
  `;

  setTimeout(() => {
    if (toast && toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
      }, 500);
    }
  }, 5000);
}

async function performStreamDownloadInModal() {
  if (!modalBtnStreamDownload) return;
  modalBtnStreamDownload.disabled = true;
  modalBtnStreamDownload.style.opacity = '0.6';
  if (modalStreamProgress) modalStreamProgress.classList.remove('hidden');
  if (modalStreamStatus) modalStreamStatus.textContent = '⏳ Conectando ao servidor...';
  if (modalStreamFill) modalStreamFill.style.width = '0%';
  if (modalStreamText) modalStreamText.textContent = '0%';

  try {
    let response;
    try {
      response = await fetch('/api/download-zip');
      if (!response.ok) throw new Error(`Status ${response.status}`);
    } catch (_err) {
      response = await fetch('/o-quarto-dos-brinquedos.zip');
    }

    if (!response.ok) {
      throw new Error(`Servidor retornou status ${response.status}`);
    }

    const contentLength = Number(response.headers.get('content-length')) || 54043665;
    const reader = response.body.getReader();
    let receivedBytes = 0;
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      receivedBytes += value.length;
      const pct = Math.min(100, Math.round((receivedBytes / contentLength) * 100));
      const mb = (receivedBytes / 1024 / 1024).toFixed(1);
      if (modalStreamFill) modalStreamFill.style.width = `${pct}%`;
      if (modalStreamText) modalStreamText.textContent = `${pct}% (${mb} MB)`;
    }

    if (modalStreamStatus) modalStreamStatus.textContent = '💾 Gravando arquivo no computador...';
    const blob = new Blob(chunks, { type: 'application/zip' });

    let saved = false;
    if (typeof window.showSaveFilePicker === 'function') {
      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: 'o-quarto-dos-brinquedos.zip',
          types: [{
            description: 'Arquivo ZIP do Projeto',
            accept: { 'application/zip': ['.zip'] }
          }]
        });
        const writableStream = await fileHandle.createWritable();
        await writableStream.write(blob);
        await writableStream.close();
        saved = true;
      } catch (pickerErr) {
        console.warn('showSaveFilePicker não disponível no iframe:', pickerErr);
      }
    }

    if (!saved) {
      try {
        const blobUrl = URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.download = 'o-quarto-dos-brinquedos.zip';
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
      } catch (blobErr) {
        console.warn('Falha no fallback de Blob URL:', blobErr);
      }
    }

    if (modalStreamStatus) {
      modalStreamStatus.innerHTML = `
        <span style="color: #34d399; font-weight: 600;">✅ ${(blob.size / 1024 / 1024).toFixed(2)} MB baixados com sucesso!</span><br>
        <span style="color: #94a3b8; font-size: 11px;">Se o navegador bloqueou o arquivo no seu disco, clique no botão verde <strong>"Baixar ZIP em Nova Aba"</strong> acima.</span>
      `;
    }
    showDownloadToast(`✅ Pacote completo (${(blob.size / 1024 / 1024).toFixed(1)} MB) transferido com sucesso!`);
  } catch (err) {
    console.error('Erro no download streaming:', err);
    if (modalStreamStatus) {
      modalStreamStatus.innerHTML = `
        <span style="color: #fca5a5; font-weight: 600;">⚠️ O navegador restringiu a gravação dentro do iframe.</span><br>
        <span style="color: #e2e8f0; font-size: 11px;">Por favor, utilize o botão verde <strong>"Baixar ZIP em Nova Aba"</strong> acima para baixar diretamente para seu computador sem restrições.</span>
      `;
    }
  } finally {
    modalBtnStreamDownload.disabled = false;
    modalBtnStreamDownload.style.opacity = '1';
  }
}

// Eventos do Modal
if (modalBtnCloseX) modalBtnCloseX.addEventListener('click', closeDownloadModal);
if (modalBtnCloseFooter) modalBtnCloseFooter.addEventListener('click', closeDownloadModal);
if (downloadModal) {
  downloadModal.addEventListener('click', (e) => {
    if (e.target === downloadModal) closeDownloadModal();
  });
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && downloadModal && !downloadModal.classList.contains('hidden')) {
    closeDownloadModal();
  }
});

if (modalBtnCopyUrl) {
  modalBtnCopyUrl.addEventListener('click', () => {
    const url = modalDirectUrlInput ? modalDirectUrlInput.value : `${window.location.origin}/api/download-zip`;
    copyToClipboard(url, modalCopyUrlFeedback, '✅ Link copiado!');
  });
}

if (modalBtnCopyCurl) {
  modalBtnCopyCurl.addEventListener('click', () => {
    const cmd = modalCurlCommandInput ? modalCurlCommandInput.value : `curl -L -O "${window.location.origin}/api/download-zip" -o o-quarto-dos-brinquedos.zip`;
    copyToClipboard(cmd, modalCopyCurlFeedback, '✅ Comando cURL copiado!');
  });
}

if (modalBtnStreamDownload) {
  modalBtnStreamDownload.addEventListener('click', performStreamDownloadInModal);
}

// Botões principais de Download na interface do jogo
if (btnDownloadZip) {
  btnDownloadZip.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
  });
  btnDownloadZip.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openDownloadModal();
  });
}

if (btnStartDownloadZip) {
  btnStartDownloadZip.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
  });
  btnStartDownloadZip.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openDownloadModal();
  });
}
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
  game.startToyRoomPhase();

  setTimeout(() => {
    isActionLocked = false;
  }, 450);
}

if (btnStartPhase1) {
  addSafeAction(btnStartPhase1, (e) => {
    startGame(e);
  });
}

if (btnSkipPhase2) {
  addSafeAction(btnSkipPhase2, (e) => {
    handleToyRoomSwitch(e);
  });
}

if (startOverlay) {
  addSafeAction(startOverlay, (e) => {
    if (e && e.target && (e.target.closest('#btn-skip-phase2') || e.target.closest('#btn-start-phase1') || e.target.closest('#btn-start-download-zip') || e.target.closest('.start-download-btn'))) {
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
    if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'Enter' || event.code === 'Digit1') {
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

