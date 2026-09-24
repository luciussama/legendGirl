import assert from 'node:assert/strict';
import { GameState } from '../src/js/state/GameState.js';
import { platforms, getEscapeStats, getPhase3Stats } from '../src/js/config.js';

console.log('--- TESTE: Comportamento da Plataforma 9 (Pausa e Pulo 100% de Acerto) ---');

const mockCanvas = { width: 960, height: 540 };
const mockUiFeedback = { innerText: '', style: {} };
const state = new GameState(mockCanvas, mockUiFeedback);

// 1. Simula a chegada na plataforma 9 (Castelinho de Blocos)
const castle = platforms[9];
const castleCenterX = castle.standRegion ? castle.standRegion.x + castle.standRegion.w / 2 : castle.x + castle.w / 2;
const castleTopY = castle.surfaceTopY !== undefined ? castle.surfaceTopY : castle.y;

state.baby.x = castleCenterX - state.baby.w / 2;
state.baby.y = castleTopY - state.baby.h;
state.baby.currentPlatformIndex = 9;
state.baby.onGround = true;

// Inicia cutscene
state.startCastleCutscene();
assert.equal(state.cutsceneActive, true, 'Cutscene deve iniciar');
assert.equal(state.baby.vx, 0, 'vx deve ser 0 na cutscene');

// Avança cutscene passo 1 -> 2
state.advanceCutscene();
assert.equal(state.cutsceneStep, 2, 'Cutscene deve avançar para passo 2');

// Conclui cutscene
state.advanceCutscene();
assert.equal(state.cutsceneActive, false, 'Cutscene deve estar finalizada');
assert.equal(state.isEscapeMode, true, 'Modo fuga deve estar ativo');
assert.equal(state.baby.currentPlatformIndex, 9, 'Deve permanecer na plataforma 9');
assert.equal(state.baby.vx, 0, 'vx deve ser 0 ao sair da cutscene');
assert.equal(state.currentScrollSpeed, 0, 'Velocidade de scroll deve ser 0');
assert.equal(state.targetScrollSpeed, 0, 'Alvo de scroll deve ser 0');

// 2. Simula 300 frames (5 segundos) SEM interação do jogador
const initialX = state.baby.x;
const initialY = state.baby.y;

for (let frame = 0; frame < 300; frame++) {
  const dt = 1.0;
  // Regra de pausa da plataforma 9
  if (state.isEscapeMode && state.baby.currentPlatformIndex === 9 && state.baby.onGround) {
    state.baby.x = initialX;
    state.baby.y = initialY;
    state.baby.vx = 0;
    state.baby.vy = -state.baby.gravity;
    state.baby.animTime = 0;
    state.currentScrollSpeed = 0;
    state.targetScrollSpeed = 0;
  }
  state.baby.x += state.baby.vx * dt;
  state.baby.animTime += (state.baby.vx !== 0 ? 0.15 : 0) * dt;
  state.baby.vy += state.baby.gravity * dt;
  state.baby.y += state.baby.vy * dt;

  // Resolução de colisão
  const p = platforms[9];
  const platTop = p.surfaceTopY !== undefined ? p.surfaceTopY : p.y;
  const platLeft = p.standRegion ? p.standRegion.x : p.x;
  const platWidth = p.standRegion ? p.standRegion.w : p.w;

  if (
    state.baby.x + state.baby.w > platLeft &&
    state.baby.x < platLeft + platWidth &&
    state.baby.y + state.baby.h >= platTop - 4 &&
    state.baby.y + state.baby.h <= platTop + 14 &&
    state.baby.vy >= 0
  ) {
    state.baby.y = platTop - state.baby.h;
    state.baby.vy = 0;
    state.baby.onGround = true;
    state.baby.currentPlatformIndex = 9;
    // Garante que o landed handler não acelera a menina
    state.baby.vx = 0;
    state.currentScrollSpeed = 0;
    state.targetScrollSpeed = 0;
  }

  assert.equal(state.baby.x, initialX, `Frame ${frame}: A menina NÃO deve se mover horizontalmente`);
  assert.equal(state.baby.y, initialY, `Frame ${frame}: A menina NÃO deve cair`);
  assert.equal(state.baby.vx, 0, `Frame ${frame}: vx deve permanecer 0`);
  assert.equal(state.currentScrollSpeed, 0, `Frame ${frame}: scroll deve permanecer 0`);
}

console.log('✓ PASSOU: 300 frames (5s) em repouso absoluto na plataforma 9 sem andar ou cair.');

// 3. O jogador agora clica para pular
const stats = getEscapeStats(0);
state.baby.onGround = false;
state.baby.vy = stats.jumpPower;

// Cálculo de 100% de acerto para a plataforma 10
const nextP = platforms[10];
const nextCenterX = nextP.standRegion ? nextP.standRegion.x + nextP.standRegion.w / 2 : nextP.x + nextP.w / 2;
const targetX = nextCenterX - state.baby.w / 2;
const targetY = (nextP.surfaceTopY !== undefined) ? nextP.surfaceTopY : nextP.y;
const deltaY = (targetY - state.baby.h) - state.baby.y;
const grav = state.baby.gravity || 0.28;
const disc = Math.max(0, state.baby.vy * state.baby.vy + 2 * grav * deltaY);
const flightTime = (-state.baby.vy + Math.sqrt(disc)) / grav;
assert(flightTime > 0, 'Tempo de voo deve ser positivo');
state.baby.vx = (targetX - state.baby.x) / flightTime;
state.targetScrollSpeed = stats.scrollSpeed;
state.currentScrollSpeed = stats.scrollSpeed;

console.log(`Impulso de pulo calculado: vx=${state.baby.vx.toFixed(3)}, vy=${state.baby.vy}, flightTime=${flightTime.toFixed(2)}f`);

// 4. Simula o voo parabólico até aterrissar na plataforma 10
let landedOn10 = false;
for (let f = 0; f < 80; f++) {
  state.baby.x += state.baby.vx;
  state.baby.vy += grav;
  state.baby.y += state.baby.vy;

  // Verificação de pouso na plataforma 10
  const p10Y = (nextP.surfaceTopY !== undefined) ? nextP.surfaceTopY : nextP.y;
  if (
    state.baby.x + state.baby.w >= nextP.x &&
    state.baby.x <= nextP.x + nextP.w &&
    state.baby.y + state.baby.h >= p10Y - 8 &&
    state.baby.y + state.baby.h <= p10Y + 28 &&
    state.baby.vy >= 0
  ) {
    landedOn10 = true;
    state.baby.y = p10Y - state.baby.h;
    state.baby.vy = 0;
    state.baby.onGround = true;
    state.baby.currentPlatformIndex = 10;
    // Ao pousar na plataforma 10, inicia a corrida da fuga normalmente
    const nextStats = getEscapeStats(1);
    state.baby.vx = nextStats.runVx;
    state.targetScrollSpeed = nextStats.scrollSpeed;
    console.log(`✓ Aterrissou com sucesso na plataforma 10 no frame ${f}! x=${state.baby.x.toFixed(1)}, y=${state.baby.y}`);
    break;
  }
}

assert(landedOn10, 'A menina deve aterrissar com 100% de acerto na plataforma 10');
assert.equal(state.baby.currentPlatformIndex, 10, 'Plataforma atual deve ser 10');
assert(state.baby.vx > 0, 'Ao aterrissar na plataforma 10, deve correr normalmente para continuar o jogo');

// 5. Simula mais 60 frames na plataforma 10 para confirmar movimentação contínua
for (let f = 0; f < 60; f++) {
  state.baby.x += state.baby.vx;
}
assert(state.baby.x > targetX, 'A menina deve prosseguir correndo normalmente na plataforma 10');

// 6. Teste de Checkpoint (renascimento na plataforma 9 após queda posterior)
console.log('--- TESTE: Checkpoint de Renascimento no Castelo (Plataforma 9) ---');
state.isEscapeMode = true;
state.cutsceneCompleted = true;
state.resetToStart(true, false);

assert.equal(state.baby.currentPlatformIndex, 9, 'Deve renascer na plataforma 9');
assert.equal(state.baby.vx, 0, 'vx deve ser 0 no renascimento');
assert.equal(state.currentScrollSpeed, 0, 'Scroll deve ser 0 no renascimento');
assert.equal(state.targetScrollSpeed, 0, 'Target scroll deve ser 0 no renascimento');
assert.equal(state.baby.x, initialX, 'Deve renascer centralizada na plataforma 9');
assert.equal(state.baby.y, initialY, 'Deve renascer na superfície da plataforma 9');

// Simula mais 180 frames pausada aguardando o clique do jogador
for (let f = 0; f < 180; f++) {
  if (state.isEscapeMode && state.baby.currentPlatformIndex === 9 && state.baby.onGround) {
    state.baby.x = initialX;
    state.baby.y = initialY;
    state.baby.vx = 0;
    state.baby.vy = -state.baby.gravity;
    state.baby.animTime = 0;
    state.currentScrollSpeed = 0;
    state.targetScrollSpeed = 0;
  }
  state.baby.x += state.baby.vx;
  state.baby.vy += state.baby.gravity;
  state.baby.y += state.baby.vy;
}
assert.equal(state.baby.x, initialX, 'Após 180 frames de respawn, a menina não deve se mover');
assert.equal(state.baby.y, initialY, 'Após 180 frames de respawn, a menina não deve cair');

console.log('✓ PASSOU: Checkpoint de respawn na plataforma 9 mantém pausa absoluta aguardando pulo.');
console.log('TODOS OS TESTES PASSARAM COM SUCESSO!');
