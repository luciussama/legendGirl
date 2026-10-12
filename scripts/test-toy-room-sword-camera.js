import assert from 'node:assert/strict';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';

const createPhase = (width, height, difficulty) => {
  const canvas = { width, height, getContext: () => ({}), addEventListener() {} };
  const phase = new ToyRoomPhase(canvas, null, null, null,
    { bindInputs: false, gameDifficulty: difficulty });
  phase.introAlpha = 0;
  phase.introBannerTimer = 0;
  phase.toyRoomTutorialCompleted = true;
  phase.tutorial.active = false;
  phase.player.x = 700;
  phase.player.y = 700;
  return phase;
};
const near = (actual, expected, message) =>
  assert(Math.abs(actual - expected) < 0.001, message);
const target = phase => ({
  x: Math.max(0, Math.min(Math.max(0, phase.ROOM_W - phase.canvas.width),
    phase.player.x - phase.canvas.width / 2)),
  y: Math.max(0, Math.min(Math.max(0, phase.ROOM_H - phase.canvas.height),
    phase.player.y - phase.canvas.height / 2))
});

for (const difficulty of ['NORMAL', 'EASY']) {
  for (const [width, height] of [[960, 540], [540, 1030]]) {
    const phase = createPhase(width, height, difficulty);
    assert(phase.story.beginInvestigation(), 'A investigação deve iniciar pela lógica real.');
    // Percorre os diálogos sem deslocar a menina, até a liberação dos controles.
    let previous;
    for (let frame = 0; frame < 2200; frame++) {
      previous = { x: phase.cameraX, y: phase.cameraY };
      phase.update(1);
      if (phase.story.state.investigationStage === 'SEEKING_SWORD') break;
    }
    assert.equal(phase.story.state.investigationStage, 'SEEKING_SWORD');
    near(phase.cameraX, previous.x, 'Encerrar o diálogo não deve teleportar a câmera horizontal.');
    near(phase.cameraY, previous.y, 'Encerrar o diálogo não deve teleportar a câmera vertical.');
    assert.equal(phase.story.cameraTarget(), phase.player, 'O foco explícito deve ser a protagonista.');
    const sword = { ...phase.story.state.sword };
    assert.deepEqual(phase.story.guidePosition(), { x: sword.x, y: sword.y - 80 },
      'A fada mantém seu alvo independente junto à espada.');

    // Salva imediatamente após a conversa e recria a fase, incluindo a câmera em transição.
    const saved = JSON.parse(JSON.stringify(phase.snapshot()));
    const loaded = createPhase(width, height, difficulty);
    loaded.restore(saved);
    assert.equal(loaded.story.cameraTarget(), loaded.player, 'O save carregado segue a menina recriada.');
    near(loaded.cameraX, phase.cameraX, 'O save preserva a posição interpolada horizontal.');
    near(loaded.cameraY, phase.cameraY, 'O save preserva a posição interpolada vertical.');

    for (const current of [phase, loaded]) {
      const before = { x: current.cameraX, y: current.cameraY };
      const expected = target(current);
      current.update(1);
      near(current.cameraX, before.x + (expected.x - before.x) * 0.12,
        'O retorno conserva a interpolação horizontal existente.');
      near(current.cameraY, before.y + (expected.y - before.y) * 0.12,
        'O retorno conserva a interpolação vertical existente.');
      for (let frame = 0; frame < 120; frame++) current.update(1);
      near(current.cameraX, expected.x, 'A câmera converge para a menina respeitando os limites da sala.');
      near(current.cameraY, expected.y, 'O enquadramento vertical converge para a menina.');
      near(current.fairy.x, sword.x, 'A fada continua próxima à espada.');
      near(current.fairy.y, sword.y - 80, 'A fada conserva a altura de orientação.');
      current.keysDown = { KeyD: true };
      for (let frame = 0; frame < 12; frame++) {
        const beforeMove = { x: current.cameraX, y: current.cameraY };
        current.update(1);
        const movedTarget = target(current);
        near(current.cameraX, beforeMove.x + (movedTarget.x - beforeMove.x) * 0.12,
          'Durante o movimento, a câmera segue a menina sem usar o ponto médio com a espada.');
      }
      current.keysDown = {};
      for (const stage of ['COLLECTING', 'INVESTIGATION', 'PICKUP', 'EQUIPPED']) {
        current.story.state.investigationStage = stage;
        assert.equal(current.story.cameraTarget(), null,
          `O contrato anterior de cameraTarget deve permanecer em ${stage}.`);
      }
    }
  }
}
console.log('APROVADO: fim dos diálogos, retorno suave à menina, movimento, guia da fada e save/load em NORMAL e EASY, retrato e paisagem.');
