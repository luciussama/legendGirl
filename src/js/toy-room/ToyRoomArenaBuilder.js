const clone = value => JSON.parse(JSON.stringify(value));

/** Reinterpreta a mobília existente; não altera o layout nem as colisões da exploração. */
export class ToyRoomArenaBuilder {
  build({ furniture, ROOM_W = 1600 }) {
    if (!Array.isArray(furniture) || !Number.isFinite(ROOM_W) || ROOM_W <= 0)
      throw new TypeError('Layout da Toy Room inválido.');
    const required = ['bookshelf', 'toy-chest'];
    for (const id of required) if (!furniture.some(item => item.id === id))
      throw new TypeError(`Referência obrigatória ausente: ${id}`);
    // A base visual, incluindo a sombra pintada, define o plano de cada objeto.
    const positions = {
      bookshelf: { role: 'fortaleza', x: 55, footY: 552, scale: 2 },
      'toy-chest': { role: 'templo', x: 1280, footY: 610, scale: 1.6 },
      wardrobe: { role: 'torre', x: 1020, footY: 552, scale: 1.8 },
      'block-fortress': { role: 'cidadela', x: -90, footY: 620, scale: 1.15 },
      table: { role: 'monumento', x: 1560, footY: 565, scale: 1.1 },
      armchair: { role: 'trono', x: -225, footY: 625, scale: 1.3 },
      'rocking-horse': { role: 'sentinela', x: 600, footY: 590, scale: 1.25 }
    };
    const structures = furniture.map(item => {
      if (![item.x, item.y, item.w, item.h].every(Number.isFinite) || item.w <= 0 || item.h <= 0)
        throw new TypeError(`Geometria inválida: ${item.id}`);
      const p = positions[item.id] || { role: 'monumento', x: item.x, footY: 560, scale: 1.5 };
      const bottomPadding = item.type === 'rocking-horse' ? 21
        : ['chest', 'table'].includes(item.type) ? 12 : 14;
      return { sourceId: item.id, role: p.role, source: clone(item),
        x: p.x / 1600 * ROOM_W, y: p.footY - (item.h + bottomPadding) * p.scale,
        footY: p.footY, w: item.w * p.scale, h: item.h * p.scale, scale: p.scale };
    }).sort((a, b) => a.footY - b.footY || a.x - b.x);
    const chest = structures.find(item => item.sourceId === 'toy-chest');
    const floorProjection = 0.7;
    const rugWidth = ROOM_W * 0.86;
    return { version: 1, width: ROOM_W, ground: 690, wallBase: 500, floorProjection, structures,
      rug: { role: 'planicie', x: (ROOM_W - rugWidth) / 2, y: 575,
        w: rugWidth, h: rugWidth * 326 / 526 * floorProjection },
      portal: { sourceId: 'toy-room-window-curtains-v1', role: 'portal',
        x: ROOM_W / 2 - 150, y: 110, w: 300, h: 300 * 340 / 320 },
      transportOrigin: { x: chest.x + chest.w * .48, y: chest.footY - (chest.w + 8 * chest.scale) * .21,
        emergenceLift: (chest.w + 8 * chest.scale) * .33 } };
  }
}
