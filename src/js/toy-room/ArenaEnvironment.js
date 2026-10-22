import { roomEnvironmentRenderer } from './RoomEnvironmentRenderer.js';

const floorPatterns = new WeakMap();

/** Constrói parede e piso contínuos com as mesmas artes da sala, sem alterar colisões. */
function renderArenaRoom(ctx, room, arena) {
  const left = -1200, width = arena.width + 2400, base = arena.wallBase;
  ctx.fillStyle = '#6a4b61';
  ctx.fillRect(left, -1200, width, 3600);
  const wallpaper = room.assets?.get('toy-room-wallpaper-v1');
  if (wallpaper) {
    ctx.save(); ctx.beginPath(); ctx.rect(left, -1200, width, base + 1200); ctx.clip();
    ctx.globalAlpha = 0.55;
    for (let y = -1024; y < base; y += 512)
      for (let x = -1536; x < arena.width + 1536; x += 512) ctx.drawImage(wallpaper, x, y, 512, 512);
    ctx.restore();
  }
  ctx.fillStyle = '#b6844f'; ctx.fillRect(left, base, width, 2200);
  const tile = room.environmentFloorTile;
  if (tile) {
    let cached = floorPatterns.get(ctx);
    if (!cached || cached.image !== tile) {
      cached = { image: tile, pattern: ctx.createPattern(tile, 'repeat') };
      floorPatterns.set(ctx, cached);
    }
    if (cached.pattern) {
      ctx.save(); ctx.translate(left, base); ctx.scale(1.5, 1.5 * arena.floorProjection);
      ctx.fillStyle = cached.pattern; ctx.fillRect(0, 0, width / 1.5, 2200 / (1.5 * arena.floorProjection));
      ctx.restore();
    }
  }
  const shade = ctx.createLinearGradient(0, base, 0, base + 850);
  shade.addColorStop(0, 'rgba(45,24,36,.3)');
  shade.addColorStop(.3, 'rgba(45,24,36,.08)');
  shade.addColorStop(1, 'rgba(45,24,36,.2)');
  ctx.fillStyle = shade; ctx.fillRect(left, base, width, 2200);
  const trim = room.assets?.get('toy-room-oak-trim-v1');
  if (trim) roomEnvironmentRenderer.drawWoodStrip(ctx, trim, left, base - 22, width, 26, true);
}

/** Apresenta uma peça a partir da base visual definida no layout, sobre o piso/tapete. */
function renderArenaStructure(ctx, room, structure) {
  ctx.save();
  const center = structure.x + structure.w / 2;
  const shadow = ctx.createRadialGradient(center, structure.footY - 3, 1, center, structure.footY - 3, structure.w * .6);
  shadow.addColorStop(0, 'rgba(43,22,15,.25)'); shadow.addColorStop(1, 'rgba(43,22,15,0)');
  ctx.translate(center, structure.footY - 3); ctx.scale(1, .07);
  ctx.fillStyle = shadow; ctx.beginPath(); ctx.arc(0, 0, structure.w * .6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.translate(structure.x, structure.y); ctx.scale(structure.scale, structure.scale);
  roomEnvironmentRenderer.renderFurniture(ctx, { ...structure.source, x: 0, y: 0 }, {
    assets: room.assets, environmentTable: room.environmentTable, environmentChest: room.environmentChest });
  ctx.restore();
}

/** Compõe arquitetura, tapete e móveis por profundidade antes de apresentar os lutadores. */
export function renderArenaEnvironment(ctx, room, arena, time = 0) {
  renderArenaRoom(ctx, room, arena);
  const p = arena.portal;
  const glow = ctx.createRadialGradient(p.x + p.w / 2, p.y + p.h / 2, 10, p.x + p.w / 2, p.y + p.h / 2, 500);
  glow.addColorStop(0, 'rgba(255,226,146,.24)'); glow.addColorStop(1, 'rgba(255,211,134,0)');
  ctx.fillStyle = glow; ctx.fillRect(-200, -300, arena.width + 400, 1100);
  const windowImage = room.assets?.get(p.sourceId);
  if (windowImage) ctx.drawImage(windowImage, p.x, p.y, p.w, p.h);
  const rug = room.assets?.get('toy-room-oval-rug-v1') || room.environmentRug;
  if (rug) {
    // A mesma projeção vertical do piso é aplicada à ilustração inteira.
    const height = arena.rug.w * rug.height / rug.width * arena.floorProjection;
    ctx.drawImage(rug, arena.rug.x, arena.rug.y, arena.rug.w, height);
  }
  for (const structure of arena.structures) renderArenaStructure(ctx, room, structure);
  ctx.fillStyle = 'rgba(255,231,161,.38)';
  for (let i = 0; i < 20; i++) {
    ctx.beginPath(); ctx.arc((i * 137 + time * 0.12) % arena.width, 70 + (i * 73) % 350, 1.5 + i % 3, 0, Math.PI * 2); ctx.fill();
  }
}

/** Desenha só a frente do baú sobre os brinquedos em trânsito, preservando a menina à frente. */
export function renderArenaTemple(ctx, room, arena, foreground = false) {
  const chest = arena.structures.find(item => item.sourceId === 'toy-chest');
  ctx.save();
  if (foreground) {
    ctx.beginPath();
    ctx.rect(chest.x - 8 * chest.scale, arena.transportOrigin.y - chest.h * .18,
      chest.w + 16 * chest.scale, chest.footY - arena.transportOrigin.y + chest.h * .18 + 20);
    ctx.clip();
  }
  ctx.translate(chest.x, chest.y); ctx.scale(chest.scale, chest.scale);
  roomEnvironmentRenderer.renderFurniture(ctx, { ...chest.source, x: 0, y: 0 }, {
    assets: room.assets, environmentChest: room.environmentChest }); ctx.restore();
}
