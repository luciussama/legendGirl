export const DEBUG_COLLISIONS = false;

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
  step2: "Claro que fomos nós duas brincando! *risos*. Mas não vamos mais perder tempo. A saída é logo ali.",
  plotTwistBaby: "Mas ali não era a porta...?",
  plotTwistFairy: "Droga! Como se virar em toda essa bagunça? Vamos tentar novamente por ali!"
};

/**
 * Atributos progressivos para a sequência de fuga com 12 plataformas (Fase 2).
 * nível: 0 a 11
 * Nível 0 ocorre ao estar sobre o Castelo (plataforma 9), saltando para a plataforma 1/12.
 * Nível 11 ocorre na borda do Guarda-Roupa (plataforma 20), saltando para o Grande Portal (plataforma 21).
 */
export function getEscapeStats(level) {
  const lvl = Math.max(0, Math.min(11, Math.floor(level)));
  const t = lvl / 11; // 0.0 a 1.0
  return {
    levelIndex: lvl,
    jumpPower: -7.20 - t * 2.10,       // -7.20 a -9.30 px/frame (ápice vertical controlado)
    airVx: 2.10 + t * 3.10,           // 2.10 a 5.20 px/frame
    runVx: 1.65 + t * 1.10,           // 1.65 a 2.75 px/frame
    scrollSpeed: 1.50 + t * 2.25,     // 1.50 a 3.75 px/frame
    pitchMult: 1.0 + t * 0.55,        // multiplicador de tom sonoro de 1.0x a 1.55x
    trailIntensity: 1 + Math.floor(t * 3) // 1 a 4 partículas por emissão
  };
}

/**
 * Atributos progressivos para a sequência de subida caótica com 15 plataformas (Fase 3).
 * Movimento da Direita para a Esquerda (airVx, runVx e scrollSpeed são NEGATIVOS).
 * nível: 0 a 14 (15 plataformas)
 */
export function getPhase3Stats(level) {
  const lvl = Math.max(0, Math.min(14, Math.floor(level)));
  const t = lvl / 14; // 0.0 a 1.0
  return {
    levelIndex: lvl,
    jumpPower: -7.40 - t * 2.20,       // -7.40 a -9.60 px/frame (arco suave e elegante sem ultrapassar o teto)
    airVx: -(2.60 + t * 4.60),         // -2.60 a -7.20 px/frame (salto horizontal responsivo)
    runVx: -(1.90 + t * 1.60),         // -1.90 a -3.50 px/frame
    scrollSpeed: -(1.80 + t * 2.40),   // -1.80 a -4.20 px/frame
    pitchMult: 1.0 + t * 0.65,
    trailIntensity: 1 + Math.floor(t * 4)
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
  { x: 220, y: 410, w: 120, h: 60, style: 'giant_bear', label: 'Cabeça do Urso de Pelúcia' },
  { x: 380, y: 414, w: 110, h: 65, style: 'open_books', label: 'Pilha de Livros Ilustrados' },
  { x: 530, y: 393, w: 125, h: 85, surfaceTopY: 393, style: 'vanity_table', label: 'Penteadeira Encantada' },
  { x: 695, y: 372, w: 115, h: 105, style: 'small_dresser', label: 'Cômoda Pequena de Madeira' },
  {
    x: 850,
    y: 351,
    w: 120,
    h: 125,
    surfaceTopY: 351,
    style: 'messy_blocks',
    label: 'Pilha de Blocos ABC',
    standRegion: { x: 881, y: 351, w: 50, h: 125 }
  },
  {
    x: 1010,
    y: 330,
    w: 115,
    h: 145,
    surfaceTopY: 330,
    style: 'toy_drum',
    label: 'Tamborito de Marcha',
    standRegion: { x: 1030, y: 330, w: 71, h: 145 }
  },
  {
    x: 1165,
    y: 309,
    w: 120,
    h: 165,
    surfaceTopY: 309,
    style: 'satin_cushion',
    label: 'Almofadão de Veludo',
    standRegion: { x: 1203, y: 309, w: 44, h: 165 }
  },
  { x: 1325, y: 288, w: 125, h: 185, style: 'stepped_dresser', label: 'Gavetas da Cômoda' },
  {
    x: 1475,
    y: 267,
    w: 115,
    h: 205,
    style: 'music_box',
    label: 'Caixa de Música da Bailarina',
    standRegion: { x: 1485, y: 267, w: 90, h: 205 }
  },
  {
    x: 1588,
    y: 236,
    w: 154,
    h: 244,
    surfaceTopY: 236,
    style: 'block_castle',
    label: 'Castelinho de Blocos (Cena Cinemática)',
    standRegion: { x: 1636, y: 236, w: 28, h: 244 }
  },

  // SEQUÊNCIA EXATA DE 12 PLATAFORMAS DEPOIS DA CENA
  // Espaçamento e altitude matematicamente proporcionais à evolução do pulo:
  // 1/12 (gap 70px)
  {
    x: 1860,
    y: 244,
    w: 115,
    h: 230,
    style: 'train_trestle',
    label: '1/12 Pista Elevada do Trem',
    standRegion: { x: 1860, y: 244, w: 115, h: 230 }
  },
  // 2/12 (gap 80px)
  {
    x: 2055,
    y: 236,
    w: 110,
    h: 238,
    style: 'wall_shelf',
    label: '2/12 Prateleira de Brinquedos',
    standRegion: { x: 2055, y: 236, w: 110, h: 238 }
  },
  // 3/12 (gap 92px)
  {
    x: 2257,
    y: 224,
    w: 105,
    h: 250,
    style: 'mushroom_lamp',
    label: '3/12 Abajur Cogumelo',
    // The entire table is walkable; the lamp is scenery behind it.
    standRegion: { x: 2257, y: 224, w: 105, h: 250 }
  },
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

// ==========================================
// FASE 3: A SUBIDA CAÓTICA (DIREITA PARA A ESQUERDA)
// Exatamente 15 plataformas até a nova porta no topo
// ==========================================
export const phase3Platforms = [
  // PLATAFORMAS INICIAIS (1 A 5):
  // Zona segura com grande buffer de chão plano antes da primeira plataforma (x = 4040, baby surge em 4640).
  // Saltos seguros, apoios largos e tolerância generosa para assimilação do sentido e controle do pulo.
  // 1/15 (Início da escalada nos brinquedos caídos)
  { x: 4040, y: 420, w: 130, h: 50, style: 'toppled_blocks', label: '1/15 Pilha de Blocos Tombada' },
  // 2/15 (gap 72px, alcance perfeito com nível 0)
  { x: 3848, y: 402, w: 120, h: 68, style: 'floppy_ragdoll', label: '2/15 Boneca de Pano Desconjuntada' },
  // 3/15 (gap 95px, alcance seguro com nível 1)
  { x: 3638, y: 384, w: 115, h: 86, style: 'spilled_crayons_box', label: '3/15 Caixa de Giz de Cera Aberta' },
  // 4/15 (gap 118px, alcance seguro com nível 2)
  { x: 3410, y: 366, w: 110, h: 104, style: 'crooked_fairytales', label: '4/15 Pilha Torta de Contos de Fada' },
  // 5/15 (gap 145px, alcance seguro com nível 3)
  { x: 3160, y: 348, w: 105, h: 122, style: 'dented_drum', label: '5/15 Tamborzinho Amassado' },

  // PLATAFORMAS INTERMEDIÁRIAS (6 A 10):
  // Exigência moderada de timing e espaçamento dinâmico, sem exigir o limite exato do pulo.
  // 6/15 (gap 170px, transição fluida com nível 4)
  { x: 2892, y: 330, w: 98, h: 140, style: 'slumped_bear', label: '6/15 Urso de Pelúcia Desmoronado' },
  // 7/15 (gap 200px, ritmo intermediário com nível 5)
  { x: 2602, y: 313, w: 90, h: 157, style: 'tilted_xylophone', label: '7/15 Xilofone Colorido Inclinado' },
  // 8/15 (gap 230px, ritmo firme com nível 6)
  { x: 2288, y: 296, w: 84, h: 174, style: 'derailed_train', label: '8/15 Locomotiva Descarrilada' },
  // 9/15 (gap 260px, ritmo acelerado com nível 7)
  { x: 1950, y: 279, w: 78, h: 191, style: 'wobbly_card_house', label: '9/15 Castelo de Cartas Bamboleante' },
  // 10/15 (gap 290px, ritmo empolgante com nível 8)
  { x: 1586, y: 263, w: 74, h: 207, style: 'leaning_music_box', label: '10/15 Caixa de Música Desregulada' },

  // PLATAFORMAS FINAIS (11 A 15):
  // Desafiadoras com margem de erro reduzida (exigindo o limite do alcance), rigorosamente testadas pela física da parábola.
  // 11/15 (gap 324px, alta velocidade com nível 9)
  { x: 1192, y: 247, w: 70, h: 223, style: 'loose_robot', label: '11/15 Robô de Lata Desparafusado' },
  // 12/15 (gap 355px, timing refinado com nível 10)
  { x: 772, y: 231, w: 65, h: 239, style: 'spinning_top', label: '12/15 Pião de Madeira Rodopiante' },
  // 13/15 (gap 390px, salto largo com nível 11)
  { x: 322, y: 216, w: 60, h: 254, style: 'floating_spool', label: '13/15 Carretel com Fita Flutuante' },
  // 14/15 (gap 425px, limiar de precisão com nível 12)
  { x: -159, y: 201, w: 56, h: 269, style: 'unbalanced_mobile', label: '14/15 Móbile Desequilibrado' },
  // 15/15 (gap 460px, o grande salto culminante com nível 13)
  { x: -669, y: 187, w: 50, h: 283, style: 'levitating_grimoire', label: '15/15 Livro de Feitiços no Vácuo (O Grande Salto!)' },

  // Plataforma do Portal Definitivo (onde repousa a Verdadeira Porta) (gap 480px, pouso triunfante no terraço)
  { x: -1419, y: 144, w: 270, h: 326, style: 'true_portal_balcony', label: 'O Verdadeiro Portal dos Sonhos' }
];

export const trueExitDoor = {
  x: -1334,
  y: 144 - 120,
  w: 92,
  h: 120
};

export const roomScenery = [
  // Ala esquerda caótica (Fase 3)
  { x: -1700, type: 'striped_rug' },
  { x: -1550, type: 'open_story_book' },
  { x: -1400, type: 'spilled_marbles' },
  { x: -1250, type: 'retro_robot' },
  { x: -1100, type: 'toy_soldier' },
  { x: -950, type: 'fluffy_rug' },
  { x: -800, type: 'cardboard_box_floor' },
  { x: -650, type: 'wooden_horse' },
  { x: -500, type: 'spilled_crayons' },
  { x: -350, type: 'toy_car' },
  { x: -200, type: 'striped_socks' },
  { x: -50, type: 'fluffy_rug' },
  // Ala central e direita (Fases 1 e 2)
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

