import assert from 'node:assert/strict';
import { arenaMobileControlsLayout, calculateMobileUILayout, getMobileUILayout, hitArenaMobileControl, isActionControlHit } from '../src/js/ui/MobileUILayout.js';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';
import { toyRoomUI } from '../src/js/toy-room/ToyRoomUI.js';
import { renderArenaHUD } from '../src/js/toy-room/ArenaHUD.js';

// Simula recortes e barras com as mesmas unidades e conversões usadas no navegador.
let profile;
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { userAgent: 'Android' } });
globalThis.window = { visualViewport: {}, innerWidth: 0, innerHeight: 0 };
globalThis.document = { createElement: () => ({ dataset: {}, style: {}, setAttribute() {} }), body: { appendChild() {} } };
globalThis.getComputedStyle = () => ({ paddingTop: String(profile.top), paddingRight: String(profile.right),
  paddingBottom: String(profile.bottom), paddingLeft: String(profile.left) });

function recordingContext() {
  const circles = [], labels = [], stack = [];
  let x = 0, y = 0, scale = 1;
  const gradient = { addColorStop() {} };
  const ctx = new Proxy({
    circles, labels,
    save() { stack.push([x, y, scale]); },
    restore() { [x, y, scale] = stack.pop(); },
    translate(dx, dy) { x += dx * scale; y += dy * scale; },
    scale(s) { scale *= s; },
    arc(cx, cy, radius) { circles.push({ x: x + cx * scale, y: y + cy * scale, radius: radius * scale }); },
    fillText(text, cx, cy) { labels.push({ text, x: x + cx * scale, y: y + cy * scale }); },
    measureText(text) { return { width: text.length * 8 }; },
    createLinearGradient: () => gradient,
    createRadialGradient: () => gradient
  }, { get: (target, key) => key in target ? target[key] : () => {} });
  return ctx;
}

let checks = 0;
for (let rotation = 0; rotation < 4; rotation++) {
  for (const [width, height, top, right, bottom, left] of [
    [390, 744, 24, 0, 34, 0], [844, 340, 0, 47, 21, 47], [375, 567, 0, 0, 0, 0], [667, 325, 0, 0, 0, 0]
  ]) {
    profile = { top, right, bottom, left };
    Object.assign(window.visualViewport, { width, height, offsetTop: 0, offsetLeft: 0 });
    const ratio = width < height ? 540 / width : 540 / (height + 100);
    const context = recordingContext();
    const canvas = { width: Math.round(width * ratio), height: Math.round((height + 100) * ratio), clientWidth: width,
      getBoundingClientRect: () => ({ left: 0, top: 0, width, height: height + 100 }),
      getContext: () => context, addEventListener() {} };
    const layout = getMobileUILayout(canvas);
    assert(layout.usableHeight < canvas.height, 'A barra encoberta deve ficar fora da área útil.');
    const room = new ToyRoomPhase(canvas, null, null, null, { bindInputs: false });
    room.introAlpha = 0; room.introBannerTimer = 0; room.tutorial.active = false;
    let actions = 0; room.triggerAction = () => actions++;
    const eventAt = (x, y) => ({ clientX: x * width / canvas.width, clientY: y * (height + 100) / canvas.height,
      pointerType: 'touch', pointerId: 1, preventDefault() {}, stopPropagation() {} });
    room.onPointerDown(eventAt(layout.action.x, layout.action.y));
    assert.equal(actions, 1, 'O centro desenhado deve acionar o botão.');
    assert(!room.isActionButtonHit({ x: layout.safeRight + 1, y: layout.action.y }), 'Recortes não devem receber ação.');
    assert(!isActionControlHit(layout, layout.action.x - layout.action.radius - 1, layout.action.y),
      'A região além do círculo desenhado não deve acionar o botão.');
    room.actionBtnPressed = false;
    room.onPointerDown(eventAt(layout.safeLeft + 1, layout.safeBottom - 1));
    assert(room.touchState.active, 'O toque na área esquerda deve iniciar joystick.');
    room.onPointerMove(eventAt(layout.safeLeft + 31, layout.safeBottom - 1));
    assert(room.touchState.vectorX > 0, 'Limitar a origem visual não deve inverter a direção do gesto.');
    toyRoomUI.renderUI(context, canvas, { touchState: room.touchState, player: room.player, canInteract: true });
    const label = context.labels.find(item => item.text === 'PEGAR');
    assert.equal(label.x, layout.action.x, 'A renderização deve usar o centro da área clicável.');
    for (const circle of context.circles) {
      assert(circle.x - circle.radius >= layout.safeLeft - 1 && circle.x + circle.radius <= layout.safeRight + 1 &&
        circle.y - circle.radius >= layout.safeTop - 1 && circle.y + circle.radius <= layout.safeBottom + 1,
      'Botão, pulso, sombra e joystick devem ficar inteiros na área segura.');
    }
    room.onPointerUp({});
    assert(!room.touchState.active && room.touchState.vectorX === 0, 'Recalcular a orientação deve encerrar o gesto.');

    room.arena.state.status = 'COMBAT';
    const arenaControls = arenaMobileControlsLayout(layout);
    for (const [direction, button] of Object.entries(arenaControls.directions)) {
      assert.equal(hitArenaMobileControl(layout, button.x, button.y), direction, `${direction}: área clicável alinhada com a seta.`);
      assert(button.x - button.radius >= layout.safeLeft && button.x + button.radius <= layout.safeRight &&
        button.y - button.radius >= layout.safeTop && button.y + button.radius <= layout.safeBottom,
      `${direction}: botão inteiro dentro da área segura.`);
    }
    for (const name of ['sword', 'special']) {
      const button = arenaControls[name];
      assert.equal(hitArenaMobileControl(layout, button.x, button.y), name, `${name}: botão clicável alinhado com o HUD.`);
      assert(button.x - button.width / 2 >= layout.safeLeft && button.x + button.width / 2 <= layout.safeRight &&
        button.y - button.height / 2 >= layout.safeTop && button.y + button.height / 2 <= layout.safeBottom,
      `${name}: botão inteiro dentro da área segura.`);
    }
    const touchEventAt = (x, y, pointerId) => ({ ...eventAt(x, y), pointerId });
    room.onPointerDown(touchEventAt(arenaControls.directions.left.x, arenaControls.directions.left.y, 11));
    room.onPointerDown(touchEventAt(arenaControls.directions.right.x, arenaControls.directions.right.y, 12));
    assert(room.arenaTouchButtons.left && room.arenaTouchButtons.right, 'Dois direcionais podem ser mantidos simultaneamente.');
    room.onPointerUp({ pointerId:11 });
    assert(!room.arenaTouchButtons.left && room.arenaTouchButtons.right, 'Soltar um dedo preserva o outro direcional.');
    room.onPointerUp({ pointerId:12 });
    assert(!Object.values(room.arenaTouchButtons).some(Boolean), 'Soltar os dedos encerra os direcionais.');
    const attackCount = actions;
    room.onPointerDown(touchEventAt(arenaControls.sword.x, arenaControls.sword.y, 13));
    assert.equal(actions, attackCount + 1, 'O botão Espada encaminha o golpe.');
    let specialCount = 0;
    room.arena.special = () => { specialCount++; return false; };
    room.onPointerDown(touchEventAt(arenaControls.special.x, arenaControls.special.y, 14));
    assert.equal(specialCount, 1, 'O botão Especial encaminha para o espaço reservado sem iniciar um golpe.');
    const hudState = { player:{hp:3}, enemy:{hp:2,maxHp:2,actor:'train',state:'IDLE'}, index:0, transition:null, mode:'BATTLE' };
    renderArenaHUD(context, room, hudState, layout);
    assert(context.labels.some(item => item.text === 'ESPADA') && context.labels.some(item => item.text === 'ESPECIAL'),
      'A HUD exibe os botões de combate com nomes visíveis.');
    room.arena.state.status = 'IDLE';

    room.player.x = 800; room.player.y = 650;
    for (let frame = 0; frame < 160; frame++) room.update(1);
    const expectedX = Math.max(-layout.safeLeft, Math.min(Math.max(-layout.safeLeft, room.ROOM_W - layout.safeRight), room.player.x - layout.centerX));
    const expectedY = Math.max(-layout.safeTop, Math.min(Math.max(-layout.safeTop, room.ROOM_H - layout.safeBottom), room.player.y - layout.centerY));
    assert(Math.abs(room.cameraX - expectedX) < 0.001 && Math.abs(room.cameraY - expectedY) < 0.001,
      'A câmera deve convergir para o centro da região útil respeitando os limites da sala.');
    checks++;
  }
}
const desktop = calculateMobileUILayout({ width: 960, height: 540 }, { left: 0, top: 0, right: 960, bottom: 540 }, 1, false);
assert.equal(desktop.centerX, 480, 'O centro do desktop permanece preservado.');
console.log(`APROVADO: ${checks} perfis alternados; área segura, círculos completos, toque alinhado, joystick e câmera da sala.`);
