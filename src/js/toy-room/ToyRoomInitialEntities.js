/** Cria atores, móveis e brinquedos próprios de cada sala, conservando o catálogo e a geometria. */
export function createToyRoomInitialEntities() {
  // Personagem Jogável (Menininha)
  const player = {
    x: 280,
    y: 640,
    vx: 0,
    vy: 0,
    speed: 3.8,
    radius: 20,
    direction: 'down',
    facing: 'right',
    facingAngle: Math.PI / 2,
    animTime: 0,
    isMoving: false,
    carriedItem: null,
    stepTimer: 0
  };

  // Fadinha Companheira
  const fairy = {
    x: 290,
    y: 600,
    targetX: 300,
    targetY: 600,
    flutterTime: 0,
    wingAngle: 0,
    particles: []
  };

  // Móveis e Obstáculos do Cenário
  const furniture = [
    {
      id: 'toy-chest',
      type: 'chest',
      x: 1040,
      y: 190,
      w: 190,
      h: 115,
      isTarget: true,
      lidOpen: 0.0,
      glowAlpha: 0.0
    },
    {
      id: 'bookshelf',
      type: 'shelf',
      x: 380,
      y: 170,
      w: 220,
      h: 90
    },
    {
      id: 'armchair',
      type: 'armchair',
      x: 180,
      y: 840,
      w: 130,
      h: 120
    },
    {
      id: 'block-fortress',
      type: 'fortress',
      x: 1240,
      y: 800,
      w: 220,
      h: 170
    },
    {
      id: 'table',
      type: 'table',
      x: 620,
      y: 780,
      w: 160,
      h: 110
    },
    {
      id: 'rocking-horse',
      type: 'rocking-horse',
      x: 480,
      y: 420,
      w: 100,
      h: 80
    },
    {
      id: 'wardrobe',
      type: 'wardrobe',
      x: 740,
      y: 170,
      w: 140,
      h: 90
    }
  ];

  // Brinquedos Interativos
  const toys = [
    {
      id: 'teddy',
      name: 'Ursinho Pipoca',
      type: 'teddy',
      x: 340,
      y: 480,
      w: 42,
      h: 46,
      weight: 0.94,
      isCarried: false,
      isOrganized: false,
      bounceOffset: 0
    },
    {
      id: 'train',
      name: 'Trenzinho Real a Vapor',
      type: 'train',
      x: 760,
      y: 520,
      w: 48,
      h: 36,
      weight: 0.90,
      isCarried: false,
      isOrganized: false,
      bounceOffset: 0
    },
    {
      id: 'robot',
      name: 'Robô Estelar Faísca',
      type: 'robot',
      x: 1140,
      y: 540,
      w: 40,
      h: 46,
      weight: 0.92,
      isCarried: false,
      isOrganized: false,
      bounceOffset: 0
    },
    {
      id: 'bunny',
      name: 'Coelhinho de Algodão',
      type: 'bunny',
      x: 460,
      y: 980,
      w: 38,
      h: 44,
      weight: 0.96,
      isCarried: false,
      isOrganized: false,
      bounceOffset: 0
    },
    {
      id: 'duck',
      name: 'Patinho de Banho Imperial',
      type: 'duck',
      x: 940,
      y: 840,
      w: 42,
      h: 40,
      weight: 0.95,
      isCarried: false,
      isOrganized: false,
      bounceOffset: 0
    },
    {
      id: 'blocks',
      name: 'Torre de Blocos Coloridos',
      type: 'blocks',
      x: 1180,
      y: 720,
      w: 44,
      h: 52,
      weight: 0.85,
      isCarried: false,
      isOrganized: false,
      bounceOffset: 0
    },
    {
      id: 'drum',
      name: 'Tamborzinho Encantado',
      type: 'drum',
      x: 640,
      y: 960,
      w: 44,
      h: 38,
      weight: 0.93,
      isCarried: false,
      isOrganized: false,
      bounceOffset: 0
    },
    {
      id: 'jack',
      name: 'Caixinha de Surpresa da Fada',
      type: 'jack',
      x: 880,
      y: 360,
      w: 40,
      h: 46,
      weight: 0.91,
      isCarried: false,
      isOrganized: false,
      bounceOffset: 0
    }
  ];

  return { player, fairy, furniture, toys };
}
