// ============================================================================
// FASE DA SALA DE BRINQUEDOS (TOY ROOM PHASE)
// Perspectiva Top-Down 2D / 2.5D Estilo Legend of Mana
// Cores Hipersaturadas, Iluminação Aberta, Movimentação 2D Livre & Mecânica Pick & Drop
// ============================================================================

export function createToyRoom(canvas, audio, uiFeedback, onReturnToTitle) {
  const ctx = canvas.getContext('2d');

  // Room Dimensions (Expansive 2D Top-Down Playroom)
  const ROOM_W = 1600;
  const ROOM_H = 1200;

  // Camera tracking
  let cameraX = 0;
  let cameraY = 0;

  // Narrative / Transition State
  let introAlpha = 1.0; // Fades out golden portal flash
  let introBannerTimer = 240;
  let victoryBannerActive = false;
  let victoryBannerTimer = 0;

  // Particle Systems (Floating dust motes in sunlight, sparkles, confetti)
  const sunMotes = [];
  const sparkles = [];
  const confetti = [];
  const footstepPuffs = [];

  for (let i = 0; i < 45; i++) {
    sunMotes.push({
      x: Math.random() * ROOM_W,
      y: Math.random() * ROOM_H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.15 - Math.random() * 0.25,
      radius: 1.2 + Math.random() * 2.2,
      alpha: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2
    });
  }

  // Player Character (Top-down Mana-Style Little Girl)
  const player = {
    x: 280,
    y: 640,
    vx: 0,
    vy: 0,
    speed: 3.8,
    radius: 20,
    facing: 'down', // 'down', 'up', 'left', 'right', 'down-left', etc.
    facingAngle: Math.PI / 2,
    animTime: 0,
    isMoving: false,
    carriedItem: null,
    stepTimer: 0
  };

  // Companion Fairy
  const fairy = {
    x: 290,
    y: 600,
    targetX: 300,
    targetY: 600,
    flutterTime: 0,
    wingAngle: 0,
    particles: []
  };

  // Furniture / Solid Navigation Obstacles
  const furniture = [
    // Top Walls & Molding are bounds
    // Big Toy Chest (Target for sorting toys)
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
    // Enchanted Bookshelf & Storybook Cupboard
    {
      id: 'bookshelf',
      type: 'shelf',
      x: 380,
      y: 170,
      w: 220,
      h: 90
    },
    // Cozy Plush Armchair
    {
      id: 'armchair',
      type: 'armchair',
      x: 180,
      y: 840,
      w: 130,
      h: 120
    },
    // Giant Building Block Fortress
    {
      id: 'block-fortress',
      type: 'fortress',
      x: 1240,
      y: 800,
      w: 220,
      h: 170
    },
    // Wooden Activity Table & Craft Station
    {
      id: 'table',
      type: 'table',
      x: 620,
      y: 780,
      w: 160,
      h: 110
    },
    // Rocking Wooden Giraffe / Horse
    {
      id: 'rocking-horse',
      type: 'rocking-horse',
      x: 480,
      y: 420,
      w: 100,
      h: 80
    },
    // Wardrobe Cabinet
    {
      id: 'wardrobe',
      type: 'wardrobe',
      x: 740,
      y: 170,
      w: 140,
      h: 90
    }
  ];

  // Interactive Toys (Pick & Drop Objects)
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

  // State
  let organizedCount = 0;
  let lastActionTime = 0;
  const ACTION_DEBOUNCE_MS = 250;

  // Movement input vector (-1 to 1)
  const inputVector = { x: 0, y: 0 };

  // Mobile virtual joystick & action button state
  const touchState = {
    active: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    pointerId: null
  };

  // Keyboard keys down
  const keysDown = {};

  // Window resize handler
  function handleResize() {
    // Canvas adapts smoothly without blurriness
  }
  window.addEventListener('resize', handleResize);

  // --- AUDIO INITIALIZATION ---
  audio.startToyRoomMusic();
  uiFeedback.innerText = '🧸 SALA DE BRINQUEDOS: Use WASD/Setas ou o Joystick para caminhar e pegar os brinquedos!';
  uiFeedback.style.color = '#fef08a';

  // --- HELPER MATH ---
  function dist(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function spawnSparkles(x, y, count = 12, hue = '#facc15') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 1.0 + Math.random() * 3.5;
      sparkles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color: hue,
        radius: 2 + Math.random() * 3,
        alpha: 1.0,
        decay: 0.02 + Math.random() * 0.03
      });
    }
  }

  function spawnConfetti(x, y, count = 35) {
    const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#facc15', '#fb923c'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 2.0 + Math.random() * 5.0;
      confetti.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 2.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.2,
        alpha: 1.0,
        decay: 0.012 + Math.random() * 0.015
      });
    }
  }

  // --- INTERACTION: PICK & DROP ---
  function triggerAction() {
    const now = performance.now();
    if (now - lastActionTime < ACTION_DEBOUNCE_MS) {
      return;
    }
    lastActionTime = now;

    // If currently carrying an item -> DROP or ORGANIZE
    if (player.carriedItem) {
      const item = player.carriedItem;
      const chest = furniture.find(f => f.id === 'toy-chest');
      const chestCenterX = chest.x + chest.w / 2;
      const chestCenterY = chest.y + chest.h / 2;
      const distToChest = dist(player.x, player.y, chestCenterX, chestCenterY);

      // Check if dropped near the Big Toy Chest
      if (distToChest < 130) {
        // Place neatly inside the Toy Chest!
        item.isCarried = false;
        item.isOrganized = true;
        item.x = chestCenterX + (Math.random() - 0.5) * 60;
        item.y = chest.y + 45;
        player.carriedItem = null;

        audio.playOrganizeChime();
        chest.lidOpen = 1.0;
        chest.glowAlpha = 1.0;
        spawnSparkles(chestCenterX, chest.y + 30, 24, '#fde047');
        spawnConfetti(chestCenterX, chest.y + 30, 30);

        organizedCount++;
        if (organizedCount >= toys.length) {
          victoryBannerActive = true;
          victoryBannerTimer = 360;
          audio.playToyRoomVictory();
          uiFeedback.innerText = '🌟 PARABÉNS! Todos os brinquedos foram carinhosamente guardados no baú!';
          uiFeedback.style.color = '#fde047';
        } else {
          uiFeedback.innerText = `✨ ${item.name} guardado no baú! (${organizedCount}/${toys.length} arrumados)`;
          uiFeedback.style.color = '#a7f3d0';
        }
        return;
      }

      // Check if dropped near the central Mandala Rug
      const rugCenterX = 800;
      const rugCenterY = 700;
      const distToRug = dist(player.x, player.y, rugCenterX, rugCenterY);

      // Otherwise: Place in front of the player on the floor
      let dropDist = 42;
      let dropX = player.x + Math.cos(player.facingAngle) * dropDist;
      let dropY = player.y + Math.sin(player.facingAngle) * dropDist;

      // Clamp within room borders
      dropX = Math.max(90, Math.min(ROOM_W - 90, dropX));
      dropY = Math.max(260, Math.min(ROOM_H - 90, dropY));

      item.x = dropX;
      item.y = dropY;
      item.isCarried = false;
      player.carriedItem = null;

      audio.playDropSound();
      spawnSparkles(dropX, dropY, 8, '#fef08a');
      uiFeedback.innerText = `📦 Você colocou ${item.name} no chão.`;
      uiFeedback.style.color = '#fef08a';
      return;
    }

    // If NOT carrying an item -> find closest interactive toy to PICK UP
    let closestToy = null;
    let closestDist = 65; // Pickup range (pixels)

    for (let i = 0; i < toys.length; i++) {
      const t = toys[i];
      if (t.isOrganized) continue;
      const d = dist(player.x, player.y, t.x, t.y);
      if (d < closestDist) {
        closestDist = d;
        closestToy = t;
      }
    }

    if (closestToy) {
      closestToy.isCarried = true;
      player.carriedItem = closestToy;
      audio.playPickUpSound();
      spawnSparkles(player.x, player.y - 30, 16, '#38bdf8');
      uiFeedback.innerText = `✋ Você pegou: ${closestToy.name}! Leve até o Baú de Brinquedos!`;
      uiFeedback.style.color = '#38bdf8';
    }
  }

  // --- COLLISION RESOLUTION ---
  function resolveCollisions(px, py, r) {
    let nx = px;
    let ny = py;

    // Room boundaries (Walls and baseboards)
    const minX = 75 + r;
    const maxX = ROOM_W - 75 - r;
    const minY = 250 + r; // Upper wall height
    const maxY = ROOM_H - 75 - r;

    nx = Math.max(minX, Math.min(maxX, nx));
    ny = Math.max(minY, Math.min(maxY, ny));

    // Collisions against furniture obstacles (AABB with circle)
    for (let i = 0; i < furniture.length; i++) {
      const f = furniture[i];
      // Expand box by radius
      const boxLeft = f.x - r;
      const boxRight = f.x + f.w + r;
      const boxTop = f.y - r;
      const boxBottom = f.y + f.h + r;

      if (nx > boxLeft && nx < boxRight && ny > boxTop && ny < boxBottom) {
        // Find penetration depth on each axis
        const penLeft = nx - boxLeft;
        const penRight = boxRight - nx;
        const penTop = ny - boxTop;
        const penBottom = boxBottom - ny;

        const minPen = Math.min(penLeft, penRight, penTop, penBottom);

        if (minPen === penLeft) nx = boxLeft;
        else if (minPen === penRight) nx = boxRight;
        else if (minPen === penTop) ny = boxTop;
        else ny = boxBottom;
      }
    }

    return { x: nx, y: ny };
  }

  // --- KEYBOARD CONTROLS ---
  function onKeyDown(e) {
    audio.initAudio();
    keysDown[e.code] = true;

    if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter' || e.code === 'KeyF') {
      e.preventDefault();
      triggerAction();
    }
  }

  function onKeyUp(e) {
    keysDown[e.code] = false;
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // --- TOUCH / MOUSE JOYSTICK CONTROLS ---
  let isTouchDevice = false;

  function handlePointerDown(e) {
    audio.initAudio();
    isTouchDevice = true;

    // Action button hit check (bottom right screen area)
    const rect = canvas.getBoundingClientRect();
    const touchX = e.clientX - rect.left;
    const touchY = e.clientY - rect.top;

    const actionBtnX = canvas.width - 80;
    const actionBtnY = canvas.height - 80;
    const distToActionBtn = dist(touchX, touchY, actionBtnX, actionBtnY);

    if (distToActionBtn < 60) {
      e.preventDefault();
      triggerAction();
      return;
    }

    // Left half: Virtual Joystick start
    if (touchX < canvas.width * 0.55 && touchY > canvas.height * 0.25) {
      touchState.active = true;
      touchState.pointerId = e.pointerId;
      touchState.startX = touchX;
      touchState.startY = touchY;
      touchState.currentX = touchX;
      touchState.currentY = touchY;
    }
  }

  function handlePointerMove(e) {
    if (!touchState.active || e.pointerId !== touchState.pointerId) return;
    const rect = canvas.getBoundingClientRect();
    touchState.currentX = e.clientX - rect.left;
    touchState.currentY = e.clientY - rect.top;
  }

  function handlePointerUp(e) {
    if (touchState.pointerId === e.pointerId) {
      touchState.active = false;
      touchState.pointerId = null;
      inputVector.x = 0;
      inputVector.y = 0;
    }
  }

  canvas.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('pointercancel', handlePointerUp);

  // --- UPDATE LOOP ---
  function update(dt = 1.0) {
    // Intro banner transition
    if (introAlpha > 0) {
      introAlpha = Math.max(0, introAlpha - 0.02 * dt);
    }
    if (introBannerTimer > 0) {
      introBannerTimer -= dt;
    }
    if (victoryBannerActive && victoryBannerTimer > 0) {
      victoryBannerTimer -= dt;
    }

    // 1. Process Input Vector (Desktop Keyboard & Mobile Joystick)
    let moveX = 0;
    let moveY = 0;

    if (keysDown['KeyW'] || keysDown['ArrowUp']) moveY -= 1;
    if (keysDown['KeyS'] || keysDown['ArrowDown']) moveY += 1;
    if (keysDown['KeyA'] || keysDown['ArrowLeft']) moveX -= 1;
    if (keysDown['KeyD'] || keysDown['ArrowRight']) moveX += 1;

    if (touchState.active) {
      const dx = touchState.currentX - touchState.startX;
      const dy = touchState.currentY - touchState.startY;
      const d = Math.sqrt(dx * dx + dy * dy);
      const maxRadius = 50;

      if (d > 8) {
        const clampedD = Math.min(d, maxRadius);
        moveX = (dx / d) * (clampedD / maxRadius);
        moveY = (dy / d) * (clampedD / maxRadius);
      }
    }

    // Normalize diagonal velocity
    const len = Math.sqrt(moveX * moveX + moveY * moveY);
    if (len > 1.0) {
      moveX /= len;
      moveY /= len;
    }

    // 2. Apply Speed and Weight Modifier if carrying
    const weightFactor = player.carriedItem ? player.carriedItem.weight : 1.0;
    const finalSpeed = player.speed * weightFactor;

    player.vx = moveX * finalSpeed;
    player.vy = moveY * finalSpeed;

    player.isMoving = len > 0.05;

    // Facing direction
    if (player.isMoving) {
      player.facingAngle = Math.atan2(moveY, moveX);
      player.animTime += 0.22 * dt;

      // Classify 4/8 cardinal directions for sprite rendering
      if (Math.abs(moveX) > Math.abs(moveY)) {
        player.facing = moveX > 0 ? 'right' : 'left';
      } else {
        player.facing = moveY > 0 ? 'down' : 'up';
      }

      // Spawn footstep puffs
      player.stepTimer += dt;
      if (player.stepTimer > 12) {
        player.stepTimer = 0;
        footstepPuffs.push({
          x: player.x + (Math.random() - 0.5) * 10,
          y: player.y + 12,
          radius: 3 + Math.random() * 3,
          alpha: 0.5,
          color: '#fef3c7'
        });
      }
    }

    // 3. Move Player & Resolve Obstacle Collisions
    const rawX = player.x + player.vx * dt;
    const rawY = player.y + player.vy * dt;
    const resolved = resolveCollisions(rawX, rawY, player.radius);
    player.x = resolved.x;
    player.y = resolved.y;

    // 4. Update Carried Toy Position
    if (player.carriedItem) {
      // Bobbing animation above player's head
      player.carriedItem.x = player.x;
      player.carriedItem.y = player.y - 38 + Math.sin(player.animTime * 1.5) * 3;
    }

    // 5. Update Fairy companion
    // Fairy hovers playfully beside the girl
    const fairyHoverOffsetX = player.facing === 'left' ? 24 : -24;
    fairy.targetX = player.x + fairyHoverOffsetX + Math.cos(fairy.flutterTime * 0.08) * 12;
    fairy.targetY = player.y - 32 + Math.sin(fairy.flutterTime * 0.12) * 8;

    fairy.flutterTime += dt;
    fairy.x += (fairy.targetX - fairy.x) * 0.12 * dt;
    fairy.y += (fairy.targetY - fairy.y) * 0.12 * dt;

    if (Math.random() < 0.4) {
      fairy.particles.push({
        x: fairy.x + (Math.random() - 0.5) * 12,
        y: fairy.y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 - 0.4,
        alpha: 0.85,
        radius: 1.5 + Math.random() * 2,
        color: '#fef08a'
      });
    }

    // Update fairy sparkle particles
    for (let i = fairy.particles.length - 1; i >= 0; i--) {
      const p = fairy.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha -= 0.035 * dt;
      if (p.alpha <= 0) {
        fairy.particles.splice(i, 1);
      }
    }

    // 6. Update Toy Chest Animation
    const chest = furniture.find(f => f.id === 'toy-chest');
    if (chest) {
      if (chest.lidOpen > 0) chest.lidOpen = Math.max(0, chest.lidOpen - 0.015 * dt);
      if (chest.glowAlpha > 0) chest.glowAlpha = Math.max(0, chest.glowAlpha - 0.02 * dt);
    }

    // 7. Update Particles
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.alpha -= s.decay * dt;
      if (s.alpha <= 0) sparkles.splice(i, 1);
    }

    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i];
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.vy += 0.08 * dt; // Gravity
      c.rot += c.vrot * dt;
      c.alpha -= c.decay * dt;
      if (c.alpha <= 0) confetti.splice(i, 1);
    }

    for (let i = footstepPuffs.length - 1; i >= 0; i--) {
      const fp = footstepPuffs[i];
      fp.alpha -= 0.03 * dt;
      fp.radius += 0.2 * dt;
      if (fp.alpha <= 0) footstepPuffs.splice(i, 1);
    }

    // Update floating sun motes
    for (let i = 0; i < sunMotes.length; i++) {
      const sm = sunMotes[i];
      sm.x += sm.vx * dt;
      sm.y += sm.vy * dt;
      sm.phase += 0.03 * dt;
      if (sm.y < 200) sm.y = ROOM_H - 50;
      if (sm.x < 50) sm.x = ROOM_W - 50;
      if (sm.x > ROOM_W - 50) sm.x = 50;
    }

    // 8. Smooth Camera Tracking (Top-Down Focus on Player)
    const targetCamX = player.x - canvas.width / 2;
    const targetCamY = player.y - canvas.height / 2;

    const maxCamX = Math.max(0, ROOM_W - canvas.width);
    const maxCamY = Math.max(0, ROOM_H - canvas.height);

    const clampedTargetCamX = Math.max(0, Math.min(maxCamX, targetCamX));
    const clampedTargetCamY = Math.max(0, Math.min(maxCamY, targetCamY));

    cameraX += (clampedTargetCamX - cameraX) * 0.12 * dt;
    cameraY += (clampedTargetCamY - cameraY) * 0.12 * dt;
  }

  // --- RENDER METHODS ---

  // 1. Hand-Painted Sunny Room Floor & Wallpaper (Legend of Mana Style)
  function drawRoomBackground() {
    // Floor: Golden honey-oak planks with hand-drawn grain
    ctx.fillStyle = '#fef3c7'; // Base sunny warm cream
    ctx.fillRect(0, 0, ROOM_W, ROOM_H);

    // Hardwood floor plank lines
    const plankHeight = 48;
    for (let y = 240; y < ROOM_H; y += plankHeight) {
      // Alternating subtle tone
      ctx.fillStyle = (y / plankHeight) % 2 === 0 ? '#fde68a' : '#fef08a';
      ctx.fillRect(0, y, ROOM_W, plankHeight);

      // Plank separator groove
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ROOM_W, y);
      ctx.stroke();

      // Handcrafted organic wood knots & grain accents
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.22)';
      ctx.lineWidth = 1.0;
      for (let x = (y * 7) % 120; x < ROOM_W; x += 180) {
        ctx.beginPath();
        ctx.ellipse(x + 35, y + 24, 18, 5, 0.05, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Top Wallpaper (Sunny coral/peach watercolor wall with whimsical floral patterns)
    const wallGrad = ctx.createLinearGradient(0, 0, 0, 240);
    wallGrad.addColorStop(0, '#f472b6'); // Radiant rose pink top
    wallGrad.addColorStop(0.5, '#fb923c'); // Warm sunny peach
    wallGrad.addColorStop(1, '#fde047'); // Golden light baseline
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, ROOM_W, 240);

    // Whimsical floral / diamond stencils on wallpaper
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    for (let wx = 60; wx < ROOM_W; wx += 90) {
      for (let wy = 40; wy < 210; wy += 60) {
        ctx.beginPath();
        ctx.arc(wx, wy, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(wx + 10, wy, 4, 0, Math.PI * 2);
        ctx.arc(wx - 10, wy, 4, 0, Math.PI * 2);
        ctx.arc(wx, wy + 10, 4, 0, Math.PI * 2);
        ctx.arc(wx, wy - 10, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Carved Wooden Baseboard separating wall and floor
    ctx.fillStyle = '#b45309'; // Rich warm mahogany
    ctx.fillRect(0, 228, ROOM_W, 16);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 240, ROOM_W, 6);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(0, 226, ROOM_W, 2);

    // Left, Right and Bottom Outer Wall Moldings
    ctx.fillStyle = '#92400e';
    ctx.fillRect(0, 0, 50, ROOM_H);
    ctx.fillRect(ROOM_W - 50, 0, 50, ROOM_H);
    ctx.fillRect(0, ROOM_H - 50, ROOM_W, 50);

    // Gold trim inner border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 246, ROOM_W - 100, ROOM_H - 296);

    // Arched Windows in the Wall letting in brilliant golden daylight
    drawArchedWindow(520, 30);
    drawArchedWindow(1280, 30);

    // Open Doorway on the Left (from which the girl emerged)
    drawEntrancePortal(50, 550);

    // Ornate Woven Rugs on the Floor
    drawCentralMandalaRug(800, 700);
    drawFloralPlayMat(1180, 520);
    drawBedsideFringeRug(280, 920);

    // Train Track Corridor Loop (Scenery obstacles creating natural navigation paths)
    drawTrainTracks();
  }

  // Arched Stained-Glass Window with Volumetric Sun Rays
  function drawArchedWindow(wx, wy) {
    ctx.save();
    // Window Frame
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(wx + 80, wy + 80, 80, Math.PI, 0, false);
    ctx.rect(wx, wy + 80, 160, 90);
    ctx.fill();

    // Sky Glass (Brilliant Cyan & Sunny Gold)
    const glassGrad = ctx.createLinearGradient(wx, wy, wx, wy + 170);
    glassGrad.addColorStop(0, '#38bdf8');
    glassGrad.addColorStop(0.6, '#a7f3d0');
    glassGrad.addColorStop(1, '#fef08a');
    ctx.fillStyle = glassGrad;
    ctx.beginPath();
    ctx.arc(wx + 80, wy + 80, 68, Math.PI, 0, false);
    ctx.rect(wx + 12, wy + 80, 136, 80);
    ctx.fill();

    // Window Mullions (Muntins)
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(wx + 80, wy + 12);
    ctx.lineTo(wx + 80, wy + 160);
    ctx.moveTo(wx + 12, wy + 90);
    ctx.lineTo(wx + 148, wy + 90);
    ctx.stroke();

    // Sheer Curtains with bows
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.moveTo(wx + 10, wy + 40);
    ctx.quadraticCurveTo(wx + 35, wy + 100, wx + 15, wy + 170);
    ctx.lineTo(wx + 10, wy + 170);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(wx + 150, wy + 40);
    ctx.quadraticCurveTo(wx + 125, wy + 100, wx + 145, wy + 170);
    ctx.lineTo(wx + 150, wy + 170);
    ctx.fill();

    // Volumetric Sunlight Beam casting diagonally onto floor
    const beamGrad = ctx.createLinearGradient(wx + 80, wy + 160, wx - 180, wy + 620);
    beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.38)');
    beamGrad.addColorStop(0.4, 'rgba(253, 224, 71, 0.18)');
    beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(wx + 10, wy + 160);
    ctx.lineTo(wx + 150, wy + 160);
    ctx.lineTo(wx + 40, wy + 640);
    ctx.lineTo(wx - 260, wy + 640);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Entrance Portal Doorway (where the girl entered from the dark bedroom)
  function drawEntrancePortal(dx, dy) {
    ctx.save();
    // Portal Arch Frame
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(dx + 25, dy + 50, 50, -Math.PI / 2, Math.PI / 2);
    ctx.rect(dx, dy, 25, 100);
    ctx.fill();

    // Portal Interior: Golden glowing threshold
    const portalGlow = ctx.createRadialGradient(dx + 20, dy + 50, 10, dx + 20, dy + 50, 65);
    portalGlow.addColorStop(0, '#ffffff');
    portalGlow.addColorStop(0.5, '#fde047');
    portalGlow.addColorStop(1, '#fb923c');
    ctx.fillStyle = portalGlow;
    ctx.beginPath();
    ctx.arc(dx + 20, dy + 50, 42, -Math.PI / 2, Math.PI / 2);
    ctx.fill();

    // Soft welcome rug at doorway
    ctx.fillStyle = '#10b981';
    ctx.fillRect(dx + 25, dy + 15, 45, 70);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(dx + 27, dy + 17, 41, 66);
    ctx.restore();
  }

  // Large Mandala Sunburst Rug (Center of the room)
  function drawCentralMandalaRug(cx, cy) {
    ctx.save();
    // Shadow under rug
    ctx.fillStyle = 'rgba(120, 53, 15, 0.25)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, 226, 176, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outer Fringe
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 222, 172, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outer Vibrant Magenta Band
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 210, 160, 0, 0, Math.PI * 2);
    ctx.fill();

    // Turquoise Ring
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 175, 130, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden Sun Core
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 120, 90, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mandala Sun Rays
    ctx.strokeStyle = '#be185d';
    ctx.lineWidth = 3;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const rx1 = cx + Math.cos(a) * 40;
      const ry1 = cy + Math.sin(a) * 30;
      const rx2 = cx + Math.cos(a) * 110;
      const ry2 = cy + Math.sin(a) * 80;
      ctx.beginPath();
      ctx.moveTo(rx1, ry1);
      ctx.lineTo(rx2, ry2);
      ctx.stroke();
    }

    // Inner Star
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Rectangular Floral Play Mat
  function drawFloralPlayMat(rx, ry) {
    ctx.save();
    ctx.fillStyle = 'rgba(120, 53, 15, 0.2)';
    ctx.fillRect(rx - 8, ry - 8, 266, 186);

    ctx.fillStyle = '#8b5cf6'; // Royal Violet
    ctx.fillRect(rx, ry, 250, 170);

    ctx.fillStyle = '#c084fc';
    ctx.fillRect(rx + 10, ry + 10, 230, 150);

    // Colorful check pattern
    const colors = ['#f43f5e', '#38bdf8', '#facc15', '#10b981'];
    for (let x = rx + 20; x < rx + 220; x += 45) {
      for (let y = ry + 20; y < ry + 140; y += 40) {
        ctx.fillStyle = colors[((x + y) / 20) % colors.length | 0];
        ctx.beginPath();
        ctx.arc(x + 12, y + 12, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // Bedside Fringe Rug
  function drawBedsideFringeRug(bx, by) {
    ctx.save();
    ctx.fillStyle = 'rgba(120, 53, 15, 0.2)';
    ctx.fillRect(bx - 4, by - 4, 188, 128);

    ctx.fillStyle = '#10b981'; // Emerald Green
    ctx.fillRect(bx, by, 180, 120);

    // Warm fringe accents
    ctx.fillStyle = '#fef08a';
    for (let fx = bx + 6; fx < bx + 174; fx += 8) {
      ctx.fillRect(fx, by - 6, 4, 6);
      ctx.fillRect(fx, by + 120, 4, 6);
    }
    ctx.restore();
  }

  // Wooden Train Tracks Looping around creating natural corridors
  function drawTrainTracks() {
    ctx.save();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(350, 420);
    ctx.lineTo(820, 420);
    ctx.quadraticCurveTo(980, 420, 980, 580);
    ctx.lineTo(980, 920);
    ctx.quadraticCurveTo(980, 1040, 840, 1040);
    ctx.lineTo(440, 1040);
    ctx.quadraticCurveTo(320, 1040, 320, 920);
    ctx.lineTo(320, 560);
    ctx.quadraticCurveTo(320, 420, 350, 420);
    ctx.stroke();

    // Inner rail groove
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.restore();
  }

  // 2. Draw Furniture & Playroom Obstacles (Mana Style Handcrafted)
  function drawFurnitureItem(f) {
    ctx.save();

    // Drop Shadow
    ctx.fillStyle = 'rgba(80, 35, 10, 0.35)';
    ctx.beginPath();
    ctx.ellipse(f.x + f.w / 2, f.y + f.h - 4, f.w / 2 + 12, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    if (f.type === 'chest') {
      // Grande Baú de Brinquedos (Great Toy Chest)
      // Base Box
      ctx.fillStyle = '#92400e'; // Mahogany Wood
      ctx.fillRect(f.x, f.y + 25, f.w, f.h - 25);

      // Gold / Brass Corner Plates & Studs
      ctx.fillStyle = '#facc15';
      ctx.fillRect(f.x, f.y + 25, 18, f.h - 25);
      ctx.fillRect(f.x + f.w - 18, f.y + 25, 18, f.h - 25);
      ctx.fillRect(f.x + f.w / 2 - 12, f.y + 25, 24, f.h - 25);

      // Front Lock plate & Keyhole
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(f.x + f.w / 2, f.y + 55, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(f.x + f.w / 2, f.y + 53, 5, 0, Math.PI * 2);
      ctx.rect(f.x + f.w / 2 - 3, f.y + 53, 6, 12);
      ctx.fill();

      // Rounded Lid
      const lidLift = f.lidOpen * 25;
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(f.x + f.w / 2, f.y + 25 - lidLift, f.w / 2, Math.PI, 0, false);
      ctx.fill();

      // Gold arched rim
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Velvet Interior glow if lid open
      if (f.lidOpen > 0.05) {
        ctx.fillStyle = 'rgba(236, 72, 153, 0.85)';
        ctx.fillRect(f.x + 12, f.y + 15 - lidLift, f.w - 24, 18);
      }

      // Sparkle Aura when near or depositing
      if (f.glowAlpha > 0.05) {
        ctx.strokeStyle = `rgba(250, 204, 21, ${f.glowAlpha})`;
        ctx.lineWidth = 4;
        ctx.strokeRect(f.x - 6, f.y - 6, f.w + 12, f.h + 12);
      }

      // Floating Title Tag
      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 13px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧸 BAÚ DE BRINQUEDOS', f.x + f.w / 2, f.y - 12);
    } else if (f.type === 'shelf') {
      // Enchanted Bookshelf
      ctx.fillStyle = '#78350f';
      ctx.fillRect(f.x, f.y, f.w, f.h);

      // Shelves
      ctx.fillStyle = '#b45309';
      ctx.fillRect(f.x + 8, f.y + 8, f.w - 16, f.h - 16);

      // Colorful books & figurines
      const bookColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      for (let bx = f.x + 14; bx < f.x + f.w - 22; bx += 16) {
        ctx.fillStyle = bookColors[(bx / 16) % bookColors.length | 0];
        const bh = 30 + (bx % 14);
        ctx.fillRect(bx, f.y + f.h - 14 - bh, 13, bh);
      }
    } else if (f.type === 'armchair') {
      // Plush Crimson Armchair
      ctx.fillStyle = '#be123c'; // Rich Ruby Red
      ctx.beginPath();
      ctx.arc(f.x + f.w / 2, f.y + 40, f.w / 2, Math.PI, 0, false);
      ctx.rect(f.x, f.y + 40, f.w, f.h - 40);
      ctx.fill();

      // Soft gold cushion
      ctx.fillStyle = '#fde047';
      ctx.fillRect(f.x + 16, f.y + 35, f.w - 32, 45);

      // Star pillow
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(f.x + f.w / 2, f.y + 55, 14, 0, Math.PI * 2);
      ctx.fill();
    } else if (f.type === 'fortress') {
      // Giant Wooden Building Block Fortress
      ctx.fillStyle = '#f59e0b'; // Amber wooden blocks
      ctx.fillRect(f.x, f.y + 35, f.w, f.h - 35);

      // Towers on Left and Right
      ctx.fillStyle = '#dc2626'; // Red Tower Cap Left
      ctx.beginPath();
      ctx.moveTo(f.x, f.y + 35);
      ctx.lineTo(f.x + 45, f.y - 15);
      ctx.lineTo(f.x + 90, f.y + 35);
      ctx.fill();

      ctx.fillStyle = '#2563eb'; // Blue Tower Cap Right
      ctx.beginPath();
      ctx.moveTo(f.x + f.w - 90, f.y + 35);
      ctx.lineTo(f.x + f.w - 45, f.y - 15);
      ctx.lineTo(f.x + f.w, f.y + 35);
      ctx.fill();

      // Battlements
      ctx.fillStyle = '#10b981';
      for (let bx = f.x + 95; bx < f.x + f.w - 95; bx += 24) {
        ctx.fillRect(bx, f.y + 15, 14, 20);
      }
    } else if (f.type === 'table') {
      // Round Wooden Activity Table
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(f.x + f.w / 2, f.y + f.h / 2, f.w / 2, f.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Colorful crayons & paper drawings on table
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(f.x + 35, f.y + 25, 45, 32);
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(f.x + 55, f.y + 40, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (f.type === 'rocking-horse') {
      // Rocking Wooden Horse / Giraffe
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(f.x + 50, f.y + 40, 38, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      // Curved Rockers
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(f.x + 50, f.y + 50, 48, 0.2, Math.PI - 0.2, false);
      ctx.stroke();
    } else if (f.type === 'wardrobe') {
      // Wardrobe Cabinet
      ctx.fillStyle = '#78350f';
      ctx.fillRect(f.x, f.y, f.w, f.h);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(f.x + 8, f.y + 8, f.w / 2 - 12, f.h - 16);
      ctx.fillRect(f.x + f.w / 2 + 4, f.y + 8, f.w / 2 - 12, f.h - 16);
      // Gold Handles
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(f.x + f.w / 2 - 10, f.y + f.h / 2, 4, 0, Math.PI * 2);
      ctx.arc(f.x + f.w / 2 + 10, f.y + f.h / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // 3. Draw Interactive Toys (Pick & Drop Items with Mana Aesthetic)
  function drawToy(t) {
    if (t.isOrganized) return; // Organized items resting in baú

    ctx.save();
    const tx = t.x;
    const ty = t.y;

    // Check distance to player for interactive highlight glow
    const distToPlayer = dist(player.x, player.y, tx, ty);
    const isTargeted = !player.carriedItem && distToPlayer < 55;

    // Soft drop shadow if on floor
    if (!t.isCarried) {
      ctx.fillStyle = 'rgba(100, 45, 10, 0.3)';
      ctx.beginPath();
      ctx.ellipse(tx, ty + t.h / 2 - 2, t.w / 2 + 3, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Interactive Golden Pulse Aura & Bouncing Indicator Glyph
    if (isTargeted) {
      const pulse = Math.sin(performance.now() * 0.008) * 4;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(tx, ty, 30 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      // Bouncing "▼ PEGAR" Pointer
      const bounceY = ty - 42 + Math.sin(performance.now() * 0.01) * 4;
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(tx - 32, bounceY - 14, 64, 20);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(tx - 32, bounceY - 14, 64, 20);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 11px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('▼ PEGAR', tx, bounceY);
    }

    // Draw individual toy artwork
    if (t.type === 'teddy') {
      // Ursinho Felpudo (Teddy Bear)
      ctx.fillStyle = '#b45309'; // Golden-brown fur
      // Ears
      ctx.beginPath();
      ctx.arc(tx - 14, ty - 16, 8, 0, Math.PI * 2);
      ctx.arc(tx + 14, ty - 16, 8, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.arc(tx, ty - 8, 18, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.beginPath();
      ctx.ellipse(tx, ty + 12, 16, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      // Snout
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.ellipse(tx, ty - 5, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Button Nose & Eyes
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(tx, ty - 7, 3, 0, Math.PI * 2);
      ctx.arc(tx - 6, ty - 11, 2.5, 0, Math.PI * 2);
      ctx.arc(tx + 6, ty - 11, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Red Bowtie Ribbon
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(tx - 9, ty + 1);
      ctx.lineTo(tx + 9, ty + 1);
      ctx.lineTo(tx, ty - 2);
      ctx.closePath();
      ctx.fill();
    } else if (t.type === 'train') {
      // Wooden Train Locomotive
      ctx.fillStyle = '#2563eb'; // Royal Blue Cab
      ctx.fillRect(tx - 20, ty - 14, 20, 26);
      ctx.fillStyle = '#dc2626'; // Red Boiler
      ctx.fillRect(tx, ty - 6, 22, 18);
      // Smokestack
      ctx.fillStyle = '#facc15';
      ctx.fillRect(tx + 12, ty - 18, 6, 12);
      // Wheels
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(tx - 10, ty + 14, 7, 0, Math.PI * 2);
      ctx.arc(tx + 10, ty + 14, 7, 0, Math.PI * 2);
      ctx.fill();
    } else if (t.type === 'robot') {
      // Retro Star Robot Faísca
      ctx.fillStyle = '#06b6d4'; // Bright Turquoise
      ctx.fillRect(tx - 14, ty - 18, 28, 24);
      // Star Antenna
      ctx.fillStyle = '#facc15';
      ctx.fillRect(tx - 2, ty - 25, 4, 8);
      ctx.beginPath();
      ctx.arc(tx, ty - 27, 4, 0, Math.PI * 2);
      ctx.fill();
      // Cute glowing visor
      ctx.fillStyle = '#fde047';
      ctx.fillRect(tx - 10, ty - 12, 20, 8);
      // Metal Body
      ctx.fillStyle = '#0891b2';
      ctx.fillRect(tx - 12, ty + 6, 24, 20);
      // Gauge dial
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(tx, ty + 16, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (t.type === 'bunny') {
      // Plush Bunny
      ctx.fillStyle = '#fbcfe8'; // Pastel Pink
      // Floppy Ears
      ctx.beginPath();
      ctx.ellipse(tx - 8, ty - 24, 6, 16, -0.2, 0, Math.PI * 2);
      ctx.ellipse(tx + 8, ty - 24, 6, 16, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.arc(tx, ty - 6, 16, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.beginPath();
      ctx.arc(tx, ty + 12, 14, 0, Math.PI * 2);
      ctx.fill();
      // Eyes & Pink Nose
      ctx.fillStyle = '#db2777';
      ctx.beginPath();
      ctx.arc(tx - 5, ty - 8, 2, 0, Math.PI * 2);
      ctx.arc(tx + 5, ty - 8, 2, 0, Math.PI * 2);
      ctx.arc(tx, ty - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (t.type === 'duck') {
      // Royal Rubber Duck
      ctx.fillStyle = '#facc15'; // Sunshine Yellow
      ctx.beginPath();
      ctx.arc(tx, ty - 6, 14, 0, Math.PI * 2); // Head
      ctx.ellipse(tx - 4, ty + 10, 18, 12, 0, 0, Math.PI * 2); // Body
      ctx.fill();
      // Orange Bill
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.ellipse(tx + 14, ty - 4, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Little Gold Crown
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.moveTo(tx - 8, ty - 18);
      ctx.lineTo(tx - 5, ty - 25);
      ctx.lineTo(tx, ty - 20);
      ctx.lineTo(tx + 5, ty - 25);
      ctx.lineTo(tx + 8, ty - 18);
      ctx.closePath();
      ctx.fill();
    } else if (t.type === 'blocks') {
      // Rainbow Block Stack
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(tx - 16, ty + 8, 32, 14);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(tx - 14, ty - 4, 28, 12);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(tx - 10, ty - 16, 20, 12);
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(tx - 10, ty - 16);
      ctx.lineTo(tx, ty - 28);
      ctx.lineTo(tx + 10, ty - 16);
      ctx.closePath();
      ctx.fill();
    } else if (t.type === 'drum') {
      // Enchanted Toy Drum
      ctx.fillStyle = '#ef4444'; // Red Cylinder
      ctx.beginPath();
      ctx.ellipse(tx, ty + 8, 18, 8, 0, 0, Math.PI * 2);
      ctx.rect(tx - 18, ty - 6, 36, 14);
      ctx.fill();
      // White drumhead
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.ellipse(tx, ty - 6, 18, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Zigzag straps
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tx - 16, ty - 4);
      ctx.lineTo(tx - 6, ty + 8);
      ctx.lineTo(tx + 4, ty - 4);
      ctx.lineTo(tx + 14, ty + 8);
      ctx.stroke();
    } else if (t.type === 'jack') {
      // Jack-in-the-Box
      ctx.fillStyle = '#8b5cf6'; // Violet Box
      ctx.fillRect(tx - 14, ty + 2, 28, 24);
      // Harlequin diamonds
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(tx, ty + 6);
      ctx.lineTo(tx + 8, ty + 14);
      ctx.lineTo(tx, ty + 22);
      ctx.lineTo(tx - 8, ty + 14);
      ctx.closePath();
      ctx.fill();
      // Spring & Star Jester Head
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tx, ty + 2);
      ctx.lineTo(tx - 4, ty - 4);
      ctx.lineTo(tx + 4, ty - 8);
      ctx.lineTo(tx, ty - 14);
      ctx.stroke();

      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(tx, ty - 16, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // 4. Draw Top-Down Little Girl (Legend of Mana 3/4 Perspective)
  function drawPlayerTopDown() {
    ctx.save();
    const px = player.x;
    const py = player.y;

    // Drop Shadow on floor
    ctx.fillStyle = 'rgba(70, 30, 10, 0.35)';
    ctx.beginPath();
    ctx.ellipse(px, py + 14, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Walking animation sway
    const walkBob = player.isMoving ? Math.sin(player.animTime * 2) * 2.5 : 0;
    const stepSwing = player.isMoving ? Math.sin(player.animTime * 2) * 4 : 0;

    // Shoes & Little Feet
    ctx.fillStyle = '#78350f'; // Brown little shoes
    if (player.facing === 'left' || player.facing === 'right') {
      ctx.beginPath();
      ctx.ellipse(px - 5 + stepSwing, py + 14, 5, 3, 0, 0, Math.PI * 2);
      ctx.ellipse(px + 5 - stepSwing, py + 14, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(px - 6, py + 14 + stepSwing, 4, 3, 0, 0, Math.PI * 2);
      ctx.ellipse(px + 6, py + 14 - stepSwing, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Little Dress (Warm Coral Red with delicate golden embroidery)
    const dressGrad = ctx.createLinearGradient(px, py - 12 + walkBob, px, py + 12 + walkBob);
    dressGrad.addColorStop(0, '#f43f5e'); // Rose Coral
    dressGrad.addColorStop(1, '#e11d48');
    ctx.fillStyle = dressGrad;

    ctx.beginPath();
    ctx.moveTo(px - 14, py + 12 + walkBob);
    ctx.lineTo(px + 14, py + 12 + walkBob);
    ctx.lineTo(px + 8, py - 8 + walkBob);
    ctx.lineTo(px - 8, py - 8 + walkBob);
    ctx.closePath();
    ctx.fill();

    // White Apron Overlay
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(px - 7, py - 4 + walkBob, 14, 12);
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(px, py + 2 + walkBob, 3, 0, Math.PI * 2);
    ctx.fill();

    // Little Girl's Round Head & Cheeks
    ctx.fillStyle = '#ffedd5'; // Soft warm peach skin
    ctx.beginPath();
    ctx.arc(px, py - 16 + walkBob, 14, 0, Math.PI * 2);
    ctx.fill();

    // Cute rosy blush on cheeks
    ctx.fillStyle = 'rgba(251, 113, 133, 0.45)';
    ctx.beginPath();
    ctx.arc(px - 7, py - 14 + walkBob, 3, 0, Math.PI * 2);
    ctx.arc(px + 7, py - 14 + walkBob, 3, 0, Math.PI * 2);
    ctx.fill();

    // Facial features depending on facing
    if (player.facing === 'down') {
      ctx.fillStyle = '#1e1b4b'; // Big anime eyes
      ctx.beginPath();
      ctx.ellipse(px - 5, py - 17 + walkBob, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.ellipse(px + 5, py - 17 + walkBob, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Eye highlights
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px - 6, py - 18 + walkBob, 1, 0, Math.PI * 2);
      ctx.arc(px + 4, py - 18 + walkBob, 1, 0, Math.PI * 2);
      ctx.fill();
    } else if (player.facing === 'left') {
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.ellipse(px - 7, py - 17 + walkBob, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (player.facing === 'right') {
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.ellipse(px + 7, py - 17 + walkBob, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hair & Pigtails (Dark Chestnut / Warm Chocolate)
    ctx.fillStyle = '#78350f';
    // Bangs & Hair Crown
    ctx.beginPath();
    ctx.arc(px, py - 21 + walkBob, 14, Math.PI, 0, false);
    ctx.fill();

    // Bouncing Pigtails on both sides
    const pigtailWave = player.isMoving ? Math.sin(player.animTime * 2.5) * 3 : 0;
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(px - 16, py - 16 + walkBob + pigtailWave, 6, 9, -0.3, 0, Math.PI * 2);
    ctx.ellipse(px + 16, py - 16 + walkBob - pigtailWave, 6, 9, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Yellow ribbons in pigtails
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(px - 13, py - 21 + walkBob, 3.5, 0, Math.PI * 2);
    ctx.arc(px + 13, py - 21 + walkBob, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Arms: If carrying a toy, arms are held straight up holding the toy!
    ctx.fillStyle = '#ffedd5';
    if (player.carriedItem) {
      ctx.beginPath();
      ctx.ellipse(px - 10, py - 22 + walkBob, 4, 10, -0.4, 0, Math.PI * 2);
      ctx.ellipse(px + 10, py - 22 + walkBob, 4, 10, 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(px - 11, py - 2 + walkBob, 3.5, 6, 0.1, 0, Math.PI * 2);
      ctx.ellipse(px + 11, py - 2 + walkBob, 3.5, 6, -0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // 5. Draw Companion Fairy
  function drawFairyTopDown() {
    ctx.save();
    const fx = fairy.x;
    const fy = fairy.y;

    // Glowing Golden Aura
    const aura = ctx.createRadialGradient(fx, fy, 4, fx, fy, 24);
    aura.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    aura.addColorStop(0.4, 'rgba(254, 240, 138, 0.75)');
    aura.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(fx, fy, 24, 0, Math.PI * 2);
    ctx.fill();

    // Translucent Fairy Wings with fluttering animation
    const wingFlap = Math.sin(fairy.flutterTime * 0.4) * 6;
    ctx.fillStyle = 'rgba(199, 210, 254, 0.85)';
    ctx.beginPath();
    ctx.ellipse(fx - 7, fy - 4, 7, 12 + wingFlap, -0.4, 0, Math.PI * 2);
    ctx.ellipse(fx + 7, fy - 4, 7, 12 + wingFlap, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Fairy Body
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(fx, fy, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Bright inner core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fx, fy, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 6. Draw HUD & Mobile Virtual Controls
  function drawUI() {
    ctx.save();

    // Top Right: Toys Organized Progress Card
    const cardW = 220;
    const cardH = 46;
    const cardX = canvas.width - cardW - 16;
    const cardY = 16;

    ctx.fillStyle = 'rgba(26, 16, 38, 0.82)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 12);
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 13px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🧸 Brinquedos Arrumados: ${organizedCount}/${toys.length}`, cardX + 16, cardY + 22);

    // Progress Bar
    const barW = 188;
    const barH = 8;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(cardX + 16, cardY + 28, barW, barH);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(cardX + 16, cardY + 28, barW * (organizedCount / toys.length), barH);

    // Mobile On-Screen Virtual Joystick (Bottom Left)
    if (isTouchDevice || touchState.active) {
      const joyBaseX = touchState.active ? touchState.startX : 90;
      const joyBaseY = touchState.active ? touchState.startY : canvas.height - 90;

      // Base Circle
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.beginPath();
      ctx.arc(joyBaseX, joyBaseY, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Thumb Stick
      const stickX = touchState.active ? touchState.currentX : joyBaseX;
      const stickY = touchState.active ? touchState.currentY : joyBaseY;
      ctx.fillStyle = 'rgba(250, 204, 21, 0.85)';
      ctx.beginPath();
      ctx.arc(stickX, stickY, 24, 0, Math.PI * 2);
      ctx.fill();
    }

    // On-Screen Tactile Action Button (Bottom Right)
    const btnRadius = 40;
    const btnX = canvas.width - 70;
    const btnY = canvas.height - 70;

    const isCarrying = !!player.carriedItem;
    const btnGrad = ctx.createLinearGradient(btnX - btnRadius, btnY - btnRadius, btnX + btnRadius, btnY + btnRadius);
    if (isCarrying) {
      btnGrad.addColorStop(0, '#10b981'); // Emerald: Drop
      btnGrad.addColorStop(1, '#059669');
    } else {
      btnGrad.addColorStop(0, '#facc15'); // Gold: Pick
      btnGrad.addColorStop(1, '#f59e0b');
    }

    ctx.fillStyle = btnGrad;
    ctx.beginPath();
    ctx.arc(btnX, btnY, btnRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = isCarrying ? '#ffffff' : '#451a03';
    ctx.font = 'bold 13px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(isCarrying ? 'SOLTAR' : 'PEGAR', btnX, btnY + 5);

    // Narrative Intro Flash & Banner
    if (introAlpha > 0.02) {
      ctx.fillStyle = `rgba(255, 250, 235, ${introAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (introBannerTimer > 0) {
      ctx.fillStyle = 'rgba(24, 16, 35, 0.88)';
      ctx.fillRect(canvas.width / 2 - 260, 80, 520, 58);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(canvas.width / 2 - 260, 80, 520, 58);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 18px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ BEM-VINDA À SALA DE BRINQUEDOS! ✨', canvas.width / 2, 106);
      ctx.fillStyle = '#f9fafb';
      ctx.font = '13px Georgia, serif';
      ctx.fillText('Explore livremente o chão colorido e guarde os brinquedos no baú!', canvas.width / 2, 126);
    }

    // Victory Celebration Banner
    if (victoryBannerActive && victoryBannerTimer > 0) {
      ctx.fillStyle = 'rgba(24, 16, 35, 0.92)';
      ctx.fillRect(canvas.width / 2 - 280, canvas.height / 2 - 70, 560, 140);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.strokeRect(canvas.width / 2 - 280, canvas.height / 2 - 70, 560, 140);

      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 24px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎉 MISSÃO CUMPRIDA COM AMOR! 🎉', canvas.width / 2, canvas.height / 2 - 25);
      ctx.fillStyle = '#fef3c7';
      ctx.font = '15px Georgia, serif';
      ctx.fillText('A Sala de Brinquedos está toda arrumada e cheia de luz!', canvas.width / 2, canvas.height / 2 + 10);
      ctx.fillText('A menininha e sua fadinha podem brincar felizes para sempre!', canvas.width / 2, canvas.height / 2 + 38);
    }

    ctx.restore();
  }

  // --- MAIN RENDER ---
  function render() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply Camera Transform
    ctx.save();
    ctx.translate(-cameraX, -cameraY);

    // 1. Background (Floor, Walls, Windows, Rugs)
    drawRoomBackground();

    // 2. Footstep puffs
    for (let i = 0; i < footstepPuffs.length; i++) {
      const fp = footstepPuffs[i];
      ctx.fillStyle = `rgba(254, 243, 199, ${fp.alpha})`;
      ctx.beginPath();
      ctx.arc(fp.x, fp.y, fp.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Furniture (Sorted by Y for correct isometric/2.5D depth)
    const renderList = [];

    for (let i = 0; i < furniture.length; i++) {
      const f = furniture[i];
      renderList.push({
        type: 'furniture',
        y: f.y + f.h,
        item: f
      });
    }

    // 4. Toys (Sorted by Y for depth)
    for (let i = 0; i < toys.length; i++) {
      const t = toys[i];
      if (!t.isCarried) {
        renderList.push({
          type: 'toy',
          y: t.y,
          item: t
        });
      }
    }

    // 5. Player (Sorted by Y for depth)
    renderList.push({
      type: 'player',
      y: player.y
    });

    // Sort depth list back to front
    renderList.sort((a, b) => a.y - b.y);

    // Render sorted entities
    for (let i = 0; i < renderList.length; i++) {
      const node = renderList[i];
      if (node.type === 'furniture') {
        drawFurnitureItem(node.item);
      } else if (node.type === 'toy') {
        drawToy(node.item);
      } else if (node.type === 'player') {
        drawPlayerTopDown();
        // If carrying a toy, draw carried toy above player
        if (player.carriedItem) {
          drawToy(player.carriedItem);
        }
      }
    }

    // 6. Fairy companion (flutters in the air above entities)
    drawFairyTopDown();

    // 7. Fairy sparkle trail
    for (let i = 0; i < fairy.particles.length; i++) {
      const p = fairy.particles[i];
      ctx.fillStyle = `rgba(254, 240, 138, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 8. Sparkles & Confetti
    for (let i = 0; i < sparkles.length; i++) {
      const s = sparkles[i];
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    for (let i = 0; i < confetti.length; i++) {
      const c = confetti[i];
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rot);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = Math.max(0, c.alpha);
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    }
    ctx.globalAlpha = 1.0;

    // 9. Floating sun motes
    for (let i = 0; i < sunMotes.length; i++) {
      const sm = sunMotes[i];
      ctx.fillStyle = `rgba(254, 240, 138, ${sm.alpha * (0.6 + Math.sin(sm.phase) * 0.4)})`;
      ctx.beginPath();
      ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore(); // End camera transform

    // 10. UI & On-Screen Controls in screen coordinates
    drawUI();

    ctx.restore();
  }

  // --- CLEANUP ---
  function destroy() {
    audio.stopToyRoomMusic();
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    canvas.removeEventListener('pointerdown', handlePointerDown);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);
  }

  return {
    update,
    render,
    triggerAction,
    destroy
  };
}
