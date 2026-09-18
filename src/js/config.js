export const GAME_CONFIG = {
  canvasWidth: 960,
  canvasHeight: 540,
  floorY: 470,
  uiMessage: 'Toque na tela para dar um pulinho e seguir a fadinha'
};

export const FLOOR_Y = GAME_CONFIG.floorY;

export function createBabyState() {
  return {
    x: 60,
    y: FLOOR_Y - 44,
    w: 38,
    h: 44,
    vx: 1.42,
    vy: 0,
    gravity: 0.28,
    jumpPower: -7.2,
    onGround: true,
    animTime: 0,
    currentPlatformIndex: -1
  };
}

export function createFairyState() {
  return {
    x: 125,
    y: FLOOR_Y - 80,
    floatAngle: 0
  };
}

export const platforms = [
  { x: 260, y: 435, w: 105, h: 45, style: 'drum', label: 'Tamborito' },
  { x: 410, y: 405, w: 100, h: 75, style: 'blocks', label: 'Torre de Cubos' },
  { x: 560, y: 375, w: 110, h: 105, style: 'chest', label: 'Caixa de Música' },
  { x: 720, y: 345, w: 105, h: 135, style: 'pillow', label: 'Almofadão' },
  { x: 880, y: 315, w: 110, h: 165, style: 'jackbox', label: 'Boneco de Mola' },
  { x: 1040, y: 285, w: 115, h: 195, style: 'books', label: 'Livro de Feitiços' },
  { x: 1200, y: 255, w: 110, h: 225, style: 'dresser', label: 'Cômoda Barroca' },
  { x: 1360, y: 225, w: 120, h: 255, style: 'blocks', label: 'Pilha Orgânica' },
  { x: 1530, y: 195, w: 120, h: 285, style: 'drum', label: 'Tambor Mágico' },
  { x: 1700, y: 165, w: 130, h: 315, style: 'chest', label: 'Baú das Relíquias' },
  { x: 1880, y: 140, w: 260, h: 340, style: 'portalbase', label: 'Plataforma Final' }
];

export const exitDoor = {
  x: 1970,
  y: 140 - 132,
  w: 86,
  h: 132
};

export const roomScenery = [
  { x: 90, type: 'cradle' },
  { x: 180, type: 'windup_doll' },
  { x: 280, type: 'teether' },
  { x: 350, type: 'stack_dice' },
  { x: 480, type: 'wooden_dragon' },
  { x: 650, type: 'rattle' },
  { x: 770, type: 'jack_in_box' },
  { x: 930, type: 'giant_spool' },
  { x: 1100, type: 'clockwork_bird' },
  { x: 1280, type: 'teether_ring' },
  { x: 1450, type: 'wooden_train' },
  { x: 1620, type: 'stacked_cards' },
  { x: 1790, type: 'windup_key' }
];
