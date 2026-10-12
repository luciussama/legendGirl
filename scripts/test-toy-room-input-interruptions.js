import assert from 'node:assert/strict';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';
import { getMobileUILayout } from '../src/js/ui/MobileUILayout.js';
let enabled = true;
const listeners = new Map();
Object.defineProperty(globalThis, 'window', { configurable: true, value: {
  addEventListener: (name, handler) => listeners.set(name, handler),
  removeEventListener: (name, handler) => { if (listeners.get(name) === handler) listeners.delete(name); }
} });
const canvas = { width: 960, height: 540, getContext: () => ({}), addEventListener() {}, removeEventListener() {},
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 960, height: 540 }) };
const room = new ToyRoomPhase(canvas, null, null, null, { bindInputs: false, isInputEnabled: () => enabled });
room.setupListeners(); room.tutorial.active = false;
const toy = room.toys[0]; room.player.x = toy.x; room.player.y = toy.y;
enabled = false; room.lastActionTime = -Infinity;
room.handleKeyDown({ code: 'KeyE' });
assert.equal(room.player.carriedItem, null, 'Pausa deve impedir coleta por teclado.');
const action = getMobileUILayout(canvas).action;
room.onPointerDown({ pointerId: 3, pointerType: 'touch', clientX: action.x, clientY: action.y });
assert.equal(room.player.carriedItem, null, 'Pausa deve impedir coleta por toque.');
assert.equal(room.actionBtnPressed, false, 'Pausa não deve acender o botão de ação.');
const paused = JSON.stringify(room.snapshot());
room.update(1);
assert.equal(JSON.stringify(room.snapshot()), paused, 'Pausa conserva narrativa e posição.');
enabled = true; room.handleKeyDown({ code: 'KeyE' });
assert.equal(room.player.carriedItem, toy);
room.lastActionTime = -Infinity; room.handleKeyDown({ code: 'KeyE', repeat: true });
assert.equal(room.player.carriedItem, toy, 'Segurar E não deve soltar involuntariamente o brinquedo.');
room.handleKeyDown({ code: 'ArrowLeft' });
room.onPointerDown({ pointerId: 1, pointerType: 'touch', clientX: 200, clientY: 300 });
room.onPointerMove({ pointerId: 1, clientX: 150, clientY: 300 });
room.onPointerDown({ pointerId: 2, pointerType: 'touch', clientX: 220, clientY: 320 });
assert.equal(room.touchState.pointerId, 1, 'Segundo toque não deve sequestrar o joystick.');
assert(listeners.has('blur'), 'Perda de foco precisa encerrar o input.');
listeners.get('blur')();
assert.deepEqual(room.keysDown, {}); assert.equal(room.touchState.active, false);
const position = [room.player.x, room.player.y]; room.update(1);
assert.deepEqual([room.player.x, room.player.y], position, 'Voltar à janela não mantém movimento residual.');
room.handleKeyDown({ code: 'ArrowRight' }); room.update(1);
room.restore(JSON.parse(JSON.stringify(room.snapshot())));
const restored = [room.player.x, room.player.y]; room.update(1);
assert.deepEqual([room.player.x, room.player.y], restored, 'Restore não reaplica teclas anteriores.');
room.destroy(); assert.equal(listeners.size, 0, 'Destroy remove todos os listeners.');
console.log('APROVADO: pausa, repetição de tecla, multitoque, perda de foco e limpeza dos listeners.');
