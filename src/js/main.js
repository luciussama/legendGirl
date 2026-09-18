import { createGame } from './game.js';

const canvas = document.getElementById('gameCanvas');
const uiFeedback = document.getElementById('ui-feedback');
const startOverlay = document.getElementById('start-overlay');

const game = createGame(canvas, uiFeedback);

let started = false;

function startGame(event) {
  if (event) {
    event.preventDefault();
  }

  if (started) return;

  started = true;
  startOverlay.classList.add('hidden');

  game.start();
  game.doJump();
}

startOverlay.addEventListener('pointerdown', startGame);
window.addEventListener('pointerdown', startGame, { once: true });
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    startGame();
  }
}, { once: true });
