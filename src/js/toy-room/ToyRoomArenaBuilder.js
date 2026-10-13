const clone = value => JSON.parse(JSON.stringify(value));

/** Reinterpreta a mobília existente; não altera o layout nem as colisões da exploração. */
export class ToyRoomArenaBuilder {
  build({ furniture, ROOM_W = 1600 }) {
    if (!Array.isArray(furniture) || !Number.isFinite(ROOM_W) || ROOM_W <= 0)
      throw new TypeError('Layout da Toy Room inválido.');
    const required = ['bookshelf', 'toy-chest'];
    for (const id of required) if (!furniture.some(item => item.id === id))
      throw new TypeError(`Referência obrigatória ausente: ${id}`);
    const positions = {
      bookshelf: { role: 'fortaleza', x: -100, y: 280, scale: 3.2 },
      'toy-chest': { role: 'templo', x: 1170, y: 390, scale: 2.2 },
      wardrobe: { role: 'torre', x: 720, y: 250, scale: 3 },
      'block-fortress': { role: 'cidadela', x: 30, y: 445, scale: 2 },
      table: { role: 'monumento', x: 1350, y: 350, scale: 2.4 },
      armchair: { role: 'trono', x: -240, y: 510, scale: 2 },
      'rocking-horse': { role: 'sentinela', x: 925, y: 460, scale: 2 }
    };
    const structures = furniture.map(item => {
      if (![item.x, item.y, item.w, item.h].every(Number.isFinite) || item.w <= 0 || item.h <= 0)
        throw new TypeError(`Geometria inválida: ${item.id}`);
      const p = positions[item.id] || { role: 'monumento', x: item.x, y: 380, scale: 2 };
      return { sourceId: item.id, role: p.role, source: clone(item),
        x: p.x / 1600 * ROOM_W, y: p.y, w: item.w * p.scale, h: item.h * p.scale, scale: p.scale };
    });
    return { version: 1, width: ROOM_W, ground: 690, structures,
      rug: { role: 'planicie', x: -120, y: 590, w: ROOM_W + 240, h: 330 },
      portal: { sourceId: 'toy-room-window-curtains-v1', role: 'portal', x: 530, y: 10, w: 540, h: 590 } };
  }
}
