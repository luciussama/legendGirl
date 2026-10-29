import { roomEnvironmentRenderer } from './RoomEnvironmentRenderer.js';
import { toyRenderer } from './ToyRenderer.js';
import { toyRoomEntities } from './ToyRoomEntities.js';
import { toyRoomUI } from './ToyRoomUI.js';
import { renderToyRoomShadows } from './ToyRoomShadows.js';

/** Compõe cenário, entidades, efeitos e HUD na ordem original de desenho. */
export function renderToyRoomScene(scene, options = {}) {
  const ctx = scene.ctx;
  ctx.save();
  ctx.clearRect(0, 0, scene.canvas.width, scene.canvas.height);

  // Transformação da câmera baseada exclusivamente no alvo vigente.
  ctx.save();
  let frame = scene.getCameraFrame();
  // Retorno visual do panorama ao enquadramento normal, sem tocar na câmera lógica.
  if (options.overviewBlend > 0) {
    const blend = Math.min(1, options.overviewBlend);
    const zoom = Math.min(scene.canvas.width / scene.ROOM_W, scene.canvas.height / scene.ROOM_H) * 0.94;
    const x = (scene.canvas.width - scene.ROOM_W * zoom) / 2 + scene.cameraX * zoom;
    const y = (scene.canvas.height - scene.ROOM_H * zoom) / 2 + scene.cameraY * zoom;
    frame = { x: frame.x + (x - frame.x) * blend,
      y: frame.y + (y - frame.y) * blend, zoom: frame.zoom + (zoom - frame.zoom) * blend };
  }
  ctx.translate(frame.x, frame.y);
  ctx.scale(frame.zoom, frame.zoom);
  ctx.translate(-scene.cameraX, -scene.cameraY);
  scene.story.recordViewport(frame);

  // 1. Cenário de Fundo
  roomEnvironmentRenderer.renderBackground(ctx, scene.ROOM_W, scene.ROOM_H, {
    assets: scene.assets,
    environmentSheet: scene.environmentFloorTile,
    environmentRug: scene.environmentRug,
    environmentDoor: scene.environmentDoor,
    environmentDetails: scene.environmentDetails
  });

  const floorShadows = options.groundShadows !== false && !options.arenaBackdrop;
  if (floorShadows) renderToyRoomShadows(ctx, scene);

  // 2. Poeirinhas de passos
  for (let i = 0; i < scene.footstepPuffs.length; i++) {
    const fp = scene.footstepPuffs[i];
    ctx.fillStyle = `rgba(254, 243, 199, ${fp.alpha})`;
    ctx.beginPath();
    ctx.arc(fp.x, fp.y, fp.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Ordenação das entidades pelo eixo Y para profundidade 2.5D
  const renderList = [];

  for (let i = 0; i < scene.furniture.length; i++) {
    const f = scene.furniture[i];
    renderList.push({
      type: 'furniture',
      y: f.y + f.h,
      item: f
    });
  }

  for (let i = 0; i < scene.toys.length; i++) {
    const t = scene.toys[i];
    if (!t.isCarried) {
      renderList.push({
        type: 'toy',
        y: t.y,
        item: t
      });
    }
  }

  if (scene.story.state.sword?.visible) {
    renderList.push({ type: 'story-sword', y: scene.story.state.sword.y });
  }

  renderList.push({
    type: 'player',
    y: scene.player.y
  });

  renderList.sort((a, b) => a.y - b.y);

  const now = performance.now();
  for (let i = 0; i < renderList.length; i++) {
    const node = renderList[i];
    if (node.type === 'furniture') {
      roomEnvironmentRenderer.renderFurniture(ctx, node.item, {
        assets: scene.assets,
        environmentChest: scene.environmentChest,
        environmentTable: scene.environmentTable,
        groundShadows: !floorShadows
      });
    } else if (node.type === 'toy') {
      toyRenderer.renderToy(ctx, node.item, scene.player.x, scene.player.y, Boolean(scene.player.carriedItem), now, {
        assets: scene.assets,
        environmentTeddy: scene.environmentTeddy,
        environmentTrain: scene.environmentTrain,
        groundShadows: !floorShadows
      });
    } else if (node.type === 'player') {
      const showingAttack = scene.story.renderAttackSprite(ctx);
      if (!showingAttack) {
        toyRoomEntities.renderPlayer(ctx, scene.player, {
          assets: scene.assets,
          swordEquipped: Boolean(scene.story.state.swordEquipped),
          environmentTeddy: scene.environmentTeddy,
          environmentTrain: scene.environmentTrain
        });
        scene.story.renderHeldObject(ctx);
      }
    } else if (node.type === 'story-sword') {
      scene.story.renderWorldObject(ctx);
    }
  }

  // 4. Fadinha companheira
  toyRoomEntities.renderFairy(ctx, scene.fairy, { assets: scene.assets });

  // 5. Rastro de brilho da fada
  for (let i = 0; i < scene.fairy.particles.length; i++) {
    const p = scene.fairy.particles[i];
    ctx.fillStyle = `rgba(254, 240, 138, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Faíscas e Confetes
  for (let i = 0; i < scene.sparkles.length; i++) {
    const s = scene.sparkles[i];
    ctx.fillStyle = s.color;
    ctx.globalAlpha = Math.max(0, s.alpha);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  for (let i = 0; i < scene.confetti.length; i++) {
    const c = scene.confetti[i];
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.fillStyle = c.color;
    ctx.globalAlpha = Math.max(0, c.alpha);
    ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
    ctx.restore();
  }
  ctx.globalAlpha = 1.0;

  // 7. Partículas de poeira dourada flutuando na luz do sol
  for (let i = 0; i < scene.sunMotes.length; i++) {
    const sm = scene.sunMotes[i];
    ctx.fillStyle = `rgba(254, 240, 138, ${sm.alpha * (0.6 + Math.sin(sm.phase) * 0.4)})`;
    ctx.beginPath();
    ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore(); // Fim da transformação da câmera

  // 8. Interface de Usuário (HUD) em coordenadas de tela
  toyRoomUI.renderUI(ctx, scene.canvas, {
    organizedCount: scene.organizedCount,
    totalToys: scene.toys.length,
    isTouchDevice: scene.isTouchDevice,
    touchState: scene.touchState,
    player: scene.player,
    introAlpha: scene.introAlpha,
    introBannerTimer: scene.introBannerTimer,
    victoryBannerActive: scene.victoryBannerActive,
    victoryBannerTimer: scene.victoryBannerTimer,
    actionBtnPressed: scene.actionBtnPressed,
    canInteract: scene.canInteract,
    isNearChest: scene.isNearChest,
    swordEquipped: scene.story.swordEquipped,
    seekingSword: scene.story.state.sword?.visible && !scene.story.swordEquipped
  });

  scene.tutorial.render(ctx, scene.canvas, frame);
  scene.story.renderNarrative(ctx, scene.canvas);
  ctx.restore();
}
