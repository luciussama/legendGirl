import assert from 'node:assert/strict';
import { ToyRoomStory } from '../src/js/toy-room/ToyRoomStory.js';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';

const makeToy = (id, x, y, isOrganized = false, returnGeneration = 0) => ({
  id, x, y, isOrganized, isCarried: false, returnGeneration
});

const makeRoom = () => {
  const musicTracks = [];
  return ({
  ROOM_W: 1600,
  ROOM_H: 1200,
  canvas: { width: 640, height: 480 },
  player: { x: 280, y: 640, radius: 24, facingAngle: 0, carriedItem: null, vx: 0, vy: 0 },
  fairy: { x: 250, y: 600, targetX: 0, targetY: 0, flutterTime: 0 },
  cameraX: 0,
  cameraY: 0,
  mobilePresentation: false,
  gameDifficulty: 'NORMAL',
  toys: [makeToy('bear', 400, 400, true, 1)],
  furniture: [],
  organizedCount: 1,
  tutorial: { active: false },
  introAlpha: 0,
  introBannerTimer: 0,
  touchState: { active: false, pointerId: null, vectorX: 0, vectorY: 0 },
  keysDown: {},
  actionBtnPressed: false,
  resolveCollisions: (x, y) => ({ x, y }),
  audio: {
    playPickUpSound() {},
    setToyRoomMusicTrack: track => musicTracks.push(track)
  },
  musicTracks
  });
};

const room = makeRoom();
const story = new ToyRoomStory(room);
story.state.recurrenceActive = true;
story.state.pendingReturns.push({ toyId: 'bear', remaining: 0 });
story.state.returnedToyCount = 1;
story.lastViewport = { left: 0, top: 0, right: 640, bottom: 480 };
const originalRandom = Math.random;
Math.random = () => 0;
try {
  story.update(1);
} finally {
  Math.random = originalRandom;
}
assert.equal(room.toys[0].isOrganized, false, 'O brinquedo reaparece no chão.');
assert.equal(room.toys[0].returnGeneration, 2, 'A reaparição avança a geração do brinquedo.');
assert.equal(room.organizedCount, 0, 'O contador acompanha o brinquedo que voltou.');
assert.equal(story.state.returnedToyCount, 1);

room.toys[0].isOrganized = true;
story.onToyStored(room.toys[0]);
assert.equal(story.state.pendingReturns.length, 1);
assert.equal(story.state.returnedToyCount, 2);
assert.equal(story.state.returnDialogueElapsed, 0, 'O diálogo do segundo retorno começa.');

story.state.returnedToyCount = 4;
story.state.returnDialogueElapsed = 360;
assert.equal(story.update(1), true, 'A investigação bloqueia o controle durante a cena.');
assert.equal(story.state.investigationStage, 'INVESTIGATION');
assert.equal(room.keysDown.KeyW, undefined, 'A cena interrompe movimento anterior.');

for (let i = 0; i < 10; i++) {
  assert.equal(story.update(200), true);
}
assert.equal(story.state.investigationStage, 'SEEKING_SWORD');
assert.equal(story.state.sword.visible, true, 'A espada fica disponível após a cena.');

room.player.x = story.state.sword.x;
room.player.y = story.state.sword.y;
story.updateAfterMovement();
assert.equal(story.state.investigationStage, 'PICKUP');
assert.equal(story.state.sword.visible, false);
assert.deepEqual(room.musicTracks, ['sword'], 'A música troca no instante em que a menina pega a espada.');
assert.equal(story.update(299), true);
assert.equal(room.musicTracks.length, 1, 'A trilha permanece durante a animação de coleta.');
assert.equal(story.update(1), true);
assert.equal(story.state.investigationStage, 'EQUIPPED');
assert.equal(story.swordEquipped, true);
assert.deepEqual(room.musicTracks, ['sword'], 'A trilha troca quando a espada é pega.');
assert.equal(story.attack(), true, 'A espada executa um golpe visual.');
assert.equal(story.attack(), false, 'O golpe tem intervalo para evitar repetição.');
story.update(12);
assert.equal(story.attack(), true);

const restored = new ToyRoomStory(makeRoom());
restored.restore(story.snapshot());
assert.equal(restored.swordEquipped, true, 'O equipamento sobrevive ao save/restore.');
assert.equal(restored.state.returnedToyCount, 4);
assert.deepEqual(restored.room.musicTracks, ['sword'], 'O save equipado restaura a trilha da espada.');

const legacyRoom = makeRoom();
legacyRoom.toys.push(makeToy('ball', 500, 500, false), makeToy('blocks', 600, 600, false));
const legacy = new ToyRoomStory(legacyRoom);
legacy.restore(undefined);
assert.equal(legacy.state.recurrenceActive, true, 'Saves antigos entram no ciclo de retorno.');

const canvas = { width: 960, height: 540, getContext: () => ({}), addEventListener() {} };
const phase = new ToyRoomPhase(canvas, null, null, null, { bindInputs: false });
assert(phase.story.reachablePoints.length > 0, 'A geometria atual fornece posições alcançáveis.');
phase.introAlpha = 0;
phase.introBannerTimer = 0;
const returningToy = phase.toys[0];
phase.toys.forEach(toy => { toy.isOrganized = true; });
phase.story.state.recurrenceActive = true;
phase.story.state.pendingReturns = [{ toyId: returningToy.id, remaining: 0 }];
phase.story.state.returnedToyCount = 1;
phase.story.lastViewport = { left: 0, top: 0, right: 960, bottom: 540 };
phase.story.update(1);
assert.equal(returningToy.isOrganized, false, 'A integração real reaparece com o cenário.');
assert.deepEqual(
  phase.resolveCollisions(returningToy.x, returningToy.y, 48),
  { x: returningToy.x, y: returningToy.y },
  'O brinquedo reaparece fora dos móveis e dentro do piso alcançável.'
);

const postSwordRoom = makeRoom();
const postSword = new ToyRoomStory(postSwordRoom);
postSword.state.recurrenceActive = true;
postSword.state.investigationStage = 'EQUIPPED';
postSword.lastViewport = { left: 0, top: 0, right: 640, bottom: 480 };
postSword.onToyStored(postSwordRoom.toys[0]);
postSword.state.pendingReturns[0].remaining = 0;
assert.equal(postSword.update(1), false, 'O ciclo de brinquedos continua após a espada.');
assert.equal(postSwordRoom.toys[0].isOrganized, false);
assert.equal(postSword.state.returnedToyCount, 0, 'A narrativa não reinicia após obter a espada.');

const spriteRoom = makeRoom();
const requestedFrames = [];
spriteRoom.assets = {
  getRegion: (name, region) => {
    requestedFrames.push({ name, ...region });
    return { frame: region.x / region.width };
  }
};
const spriteStory = new ToyRoomStory(spriteRoom);
assert.equal(requestedFrames.length, 8, 'A história carrega os oito quadros do ataque.');
assert(requestedFrames.every((frame, index) =>
  frame.name === 'toy-room-sword-attack-sheet' &&
  frame.x === index * 144 && frame.y === 288 &&
  frame.width === 144 && frame.height === 192));
spriteStory.state.investigationStage = 'EQUIPPED';
spriteStory.state.swordEquipped = true;
spriteRoom.player.facing = 'left';
assert.equal(spriteStory.attack(), true);
const drawnFrames = [];
const scales = [];
const drawContext = {
  save() {},
  restore() {},
  translate() {},
  scale: (...values) => scales.push(values),
  drawImage: (image, ...args) => drawnFrames.push({ image, args })
};
spriteStory.renderHeldObject(drawContext);
assert.equal(drawnFrames[0].image.frame, 0, 'O golpe começa pelo primeiro quadro.');
assert(scales.some(([x, y]) => x === -1 && y === 1), 'O ataque à esquerda espelha a sequência.');
drawnFrames.length = 0;
assert.equal(spriteStory.renderAttackSprite(drawContext), true,
  'O quadro de ataque substitui o sprite normal da personagem.');
assert.equal(drawnFrames[0].image.frame, 0);
spriteStory.state.attackElapsed = 1;
drawnFrames.length = 0;
assert.equal(spriteStory.renderAttackSprite(drawContext), true);
assert.equal(drawnFrames[0].image.frame, 7, 'O último quadro encerra o golpe.');

console.log('Aprovado: recorrência fora da tela, narrativa, espada, oito quadros de golpe e espelhamento à esquerda.');
