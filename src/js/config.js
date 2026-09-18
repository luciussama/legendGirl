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
    baseVx: 1.42,
    escapeVx: 2.9,
    vy: 0,
    gravity: 0.28,
    jumpPower: -7.2,
    escapeJumpPower: -8.6,
    onGround: true,
    animTime: 0,
    currentPlatformIndex: -1,
    isEscaping: false,
    longJumpUnlocked: false
  };
}

export const CUTSCENE_DIALOGUE = {
  step1: "O quarto está escuro, mas lá fora temos muita coisa pra ver. Vamos logo sair daqui. Não aguento essa bagunça! Quem fez tudo isso?",
  step2: "Claro que fomos nós duas brincando! *risos*. Mas não vamos mais perder tempo. A saída é logo ali."
};

/**
 * Progressive stats for the 12-platform escape sequence.
 * level: 0 to 11
 * Level 0 is when standing at Castle (platform 9), leaping to 1/12.
 * Level 11 is when standing at Wardrobe Ledge (platform 20), leaping to the Grand Portal (platform 21).
 */
export function getEscapeStats(level) {
  const lvl = Math.max(0, Math.min(11, Math.floor(level)));
  const t = lvl / 11; // 0.0 to 1.0
  return {
    levelIndex: lvl,
    jumpPower: -7.30 - t * 2.45,       // -7.30 to -9.75
    airVx: 2.10 + t * 2.90,           // 2.10 to 5.00 px/frame
    runVx: 1.65 + t * 1.10,           // 1.65 to 2.75 px/frame
    scrollSpeed: 1.50 + t * 2.25,     // 1.50 to 3.75 px/frame
    pitchMult: 1.0 + t * 0.55,        // 1.0x to 1.55x audio pitch
    trailIntensity: 1 + Math.floor(t * 3) // 1 to 4 particles per burst
  };
}

export function createFairyState() {
  return {
    x: 110,
    y: FLOOR_Y - 90,
    vx: 0,
    vy: 0,
    targetX: 160,
    targetY: FLOOR_Y - 90,
    floatAngle: 0,
    flutterPhase: 0,
    dartTimer: 0,
    dartOffsetX: 0,
    dartOffsetY: 0,
    particles: [],
    beaconGlow: 0,
    spinAnim: 0,
    investigateAngle: 0
  };
}

export const platforms = [
  // 10 primeiras plataformas até o topo do castelo (0 a 9)
  { x: 220, y: 435, w: 120, h: 45, style: 'giant_bear', label: 'Cabeça do Urso de Pelúcia' },
  { x: 380, y: 414, w: 110, h: 65, style: 'open_books', label: 'Pilha de Livros Ilustrados' },
  { x: 530, y: 393, w: 125, h: 85, style: 'vanity_table', label: 'Penteadeira Encantada' },
  { x: 695, y: 372, w: 115, h: 105, style: 'cardboard_box', label: 'Caixa de Papelão Aberta' },
  { x: 850, y: 351, w: 120, h: 125, style: 'messy_blocks', label: 'Pilha de Blocos ABC' },
  { x: 1010, y: 330, w: 115, h: 145, style: 'toy_drum', label: 'Tamborito de Marcha' },
  { x: 1165, y: 309, w: 120, h: 165, style: 'satin_cushion', label: 'Almofadão de Veludo' },
  { x: 1325, y: 288, w: 125, h: 185, style: 'stepped_dresser', label: 'Gavetas da Cômoda' },
  { x: 1490, y: 267, w: 120, h: 205, style: 'music_box', label: 'Caixa de Música da Bailarina' },
  { x: 1650, y: 246, w: 140, h: 228, style: 'block_castle', label: 'Castelinho de Blocos (Cena Cinemática)' },

  // SEQUÊNCIA EXATA DE 12 PLATAFORMAS DEPOIS DA CENA
  // Espaçamento e altitude matematicamente proporcionais à evolução do pulo:
  // 1/12 (gap 70px)
  { x: 1860, y: 244, w: 115, h: 230, style: 'train_trestle', label: '1/12 Pista Elevada do Trem' },
  // 2/12 (gap 80px)
  { x: 2055, y: 236, w: 110, h: 238, style: 'wall_shelf', label: '2/12 Prateleira de Brinquedos' },
  // 3/12 (gap 92px)
  { x: 2257, y: 224, w: 105, h: 250, style: 'mushroom_lamp', label: '3/12 Abajur Cogumelo' },
  // 4/12 (gap 105px)
  { x: 2467, y: 210, w: 100, h: 264, style: 'dollhouse_roof', label: '4/12 Telhado da Casa de Bonecas' },
  // 5/12 (gap 120px)
  { x: 2687, y: 218, w: 95, h: 256, style: 'spinning_globe', label: '5/12 Globo Terrestre Ilustrado' },
  // 6/12 (gap 135px)
  { x: 2917, y: 196, w: 90, h: 278, style: 'kite_frame', label: '6/12 Pipa Encantada de Bambu' },
  // 7/12 (gap 152px)
  { x: 3159, y: 184, w: 85, h: 290, style: 'floating_books', label: '7/12 Livro de Gravuras Flutuante' },
  // 8/12 (gap 170px)
  { x: 3414, y: 168, w: 80, h: 306, style: 'chandelier_crystals', label: '8/12 Lustre de Cristais' },
  // 9/12 (gap 192px)
  { x: 3686, y: 158, w: 76, h: 316, style: 'curtain_rod', label: '9/12 Varão de Cortina Estrelada' },
  // 10/12 (gap 218px)
  { x: 3980, y: 168, w: 75, h: 306, style: 'cuckoo_clock', label: '10/12 Relógio Cuco Vintage' },
  // 11/12 (gap 245px)
  { x: 4300, y: 156, w: 72, h: 318, style: 'wardrobe_ledge', label: '11/12 Beiral do Grande Guarda-Roupa' },
  // 12/12 (gap 278px: o grande abismo final vencido no ápice do Pulo Máximo)
  { x: 4650, y: 148, w: 270, h: 326, style: 'grand_portal_pedestal', label: '12/12 O Portal dos Sonhos (Saída)' }
];

export const exitDoor = {
  x: 4770,
  y: 148 - 120,
  w: 86,
  h: 120
};

export const roomScenery = [
  { x: 90, type: 'fluffy_rug' },
  { x: 130, type: 'dropped_sweater' },
  { x: 170, type: 'spilled_crayons' },
  { x: 280, type: 'paper_airplane' },
  { x: 340, type: 'striped_socks' },
  { x: 460, type: 'toy_car' },
  { x: 520, type: 'striped_rug' },
  { x: 610, type: 'scattered_blocks' },
  { x: 740, type: 'cardboard_box_floor' },
  { x: 820, type: 'dinosaur_felt' },
  { x: 920, type: 'slinky' },
  { x: 1040, type: 'wooden_spinning_top' },
  { x: 1130, type: 'plush_bunny' },
  { x: 1220, type: 'puzzle_pieces' },
  { x: 1370, type: 'toy_train' },
  { x: 1440, type: 'open_story_book' },
  { x: 1550, type: 'spilled_marbles' },
  { x: 1670, type: 'toy_soldier' },
  { x: 1780, type: 'retro_robot' },
  { x: 1910, type: 'jack_in_box' },
  { x: 2020, type: 'rattle' },
  { x: 2150, type: 'windup_mouse' },
  { x: 2320, type: 'cradle' },
  { x: 2480, type: 'giant_spool' },
  { x: 2620, type: 'wooden_horse' },
  { x: 2800, type: 'striped_rug' },
  { x: 2980, type: 'spilled_marbles' },
  { x: 3140, type: 'toy_car' },
  { x: 3300, type: 'paper_airplane' },
  { x: 3480, type: 'scattered_blocks' },
  { x: 3660, type: 'toy_soldier' },
  { x: 3840, type: 'retro_robot' },
  { x: 4020, type: 'dinosaur_felt' },
  { x: 4200, type: 'plush_bunny' },
  { x: 4380, type: 'slinky' },
  { x: 4560, type: 'fluffy_rug' },
  { x: 4740, type: 'open_story_book' },
  { x: 4900, type: 'toy_car' },
  { x: 5060, type: 'striped_rug' }
];

