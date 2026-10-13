import { roomEnvironmentRenderer } from './RoomEnvironmentRenderer.js';

/** A fantasia usa materiais, desenhos e objetos reconhecíveis da própria sala. */
export function renderArenaEnvironment(ctx, room, arena, time = 0) {
  const sky = ctx.createLinearGradient(0, 0, 0, 900);
  sky.addColorStop(0, '#211735'); sky.addColorStop(0.55, '#71506e'); sky.addColorStop(1, '#c89659');
  ctx.fillStyle = sky; ctx.fillRect(-1000, -1000, arena.width + 2000, 2600);
  const wallpaper = room.assets?.get('toy-room-wallpaper-v1');
  if (wallpaper) {
    ctx.save(); ctx.globalAlpha = 0.13;
    for (let x = -512; x < arena.width + 512; x += 512) ctx.drawImage(wallpaper, x, -80, 512, 512);
    ctx.restore();
  }
  const p = arena.portal;
  const glow = ctx.createRadialGradient(p.x + p.w / 2, p.y + p.h / 2, 10, p.x + p.w / 2, p.y + p.h / 2, 570);
  glow.addColorStop(0, 'rgba(255,226,146,.65)'); glow.addColorStop(1, 'rgba(255,211,134,0)');
  ctx.fillStyle = glow; ctx.fillRect(-200, -300, arena.width + 400, 1200);
  const windowImage = room.assets?.get(p.sourceId);
  if (windowImage) ctx.drawImage(windowImage, p.x, p.y, p.w, p.h);
  for (const structure of arena.structures) {
    if (structure.sourceId === 'toy-chest') continue;
    ctx.save(); ctx.translate(structure.x, structure.y); ctx.scale(structure.scale, structure.scale);
    roomEnvironmentRenderer.renderFurniture(ctx, { ...structure.source, x: 0, y: 0 }, {
      assets: room.assets, environmentTable: room.environmentTable, environmentChest: room.environmentChest });
    ctx.restore();
  }
  const rug = room.assets?.get('toy-room-oval-rug-v1') || room.environmentRug;
  if (rug) ctx.drawImage(rug, arena.rug.x, arena.rug.y, arena.rug.w, arena.rug.h);
  else { ctx.fillStyle = '#886572'; ctx.fillRect(-100, arena.ground, arena.width + 200, 300); }
  renderArenaTemple(ctx, room, arena);
  // Brilhos suspensos reforçam a imaginação sem desenhar guias de colisão.
  ctx.fillStyle = 'rgba(255,231,161,.55)';
  for (let i = 0; i < 20; i++) {
    ctx.beginPath(); ctx.arc((i * 137 + time * 0.12) % arena.width, 70 + (i * 73) % 430, 1.5 + i % 3, 0, Math.PI * 2); ctx.fill();
  }
}

/** A frente do templo encobre os brinquedos durante sua entrada e seu retorno. */
export function renderArenaTemple(ctx, room, arena) {
  const chest = arena.structures.find(item => item.sourceId === 'toy-chest');
  ctx.save(); ctx.translate(chest.x, chest.y); ctx.scale(chest.scale, chest.scale);
  roomEnvironmentRenderer.renderFurniture(ctx, { ...chest.source, x: 0, y: 0 }, {
    assets: room.assets, environmentChest: room.environmentChest }); ctx.restore();
}
