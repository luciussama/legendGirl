import { GAME_CONFIG, FLOOR_Y, platforms, exitDoor, roomScenery, createBabyState, createFairyState, CUTSCENE_DIALOGUE, getEscapeStats } from './config.js';
import { createAudioSystem } from './audio.js';
import { bindInput } from './input.js';

export function createGame(canvas, uiFeedback) {
  const ctx = canvas.getContext('2d');
  const audio = createAudioSystem();
  const baby = createBabyState();
  const fairy = createFairyState();

  let cameraX = 0;
  let cameraZoom = 1.0;
  let targetCameraZoom = 1.0;
  let gameWon = false;
  let failMessageTimer = null;
  let firstPlatformCleared = false;
  let tick = 0;

  // Cutscene State
  let cutsceneActive = false;
  let cutsceneTriggered = false;
  let cutsceneCompleted = false;
  let cutsceneStep = 1;
  let cutsceneTimer = 0;

  // Escape Mode State (Progressive Jump Ability & Speed)
  let isEscapeMode = false;
  let escapeLevel = 0; // 0 to 11
  let currentScrollSpeed = 1.5;
  let targetScrollSpeed = 1.5;
  let escapeBannerTimer = 0;
  let escapeBannerText = '';
  const speedRibbons = [];

  function showFailMessage() {
    uiFeedback.innerText = 'Falhou ao seguir a fadinha... Ela voltou para esperar você.';
    uiFeedback.style.color = '#f87171';

    if (failMessageTimer) {
      clearTimeout(failMessageTimer);
    }

    failMessageTimer = setTimeout(() => {
      uiFeedback.innerText = 'Toque na tela para dar um pulinho e seguir a fadinha';
      uiFeedback.style.color = '#e6dfd5';
    }, 2800);
  }

  function startCastleCutscene() {
    cutsceneActive = true;
    cutsceneTriggered = true;
    cutsceneStep = 1;
    cutsceneTimer = 0;
    targetCameraZoom = 1.45;
    baby.vx = 0;
    baby.vy = 0;
    audio.playFairyVoiceBlip(880);
    uiFeedback.innerText = 'A fadinha quer falar com você! Toque na tela para conversar.';
    uiFeedback.style.color = '#fef08a';
  }

  function advanceCutscene() {
    if (cutsceneStep === 1) {
      cutsceneStep = 2;
      cutsceneTimer = 0;
      audio.playFairyLaugh();
      fairy.spinAnim = 2.8;
      spawnFairySparkles(fairy.x, fairy.y, 22);
    } else if (cutsceneStep === 2) {
      finishCutscene();
    }
  }

  function finishCutscene() {
    cutsceneActive = false;
    cutsceneCompleted = true;
    isEscapeMode = true;
    targetCameraZoom = 1.0;

    escapeLevel = 0;
    const stats = getEscapeStats(0);
    baby.isEscaping = true;
    baby.longJumpUnlocked = true;
    baby.vx = stats.runVx;
    baby.jumpPower = stats.jumpPower;
    currentScrollSpeed = stats.scrollSpeed;
    targetScrollSpeed = stats.scrollSpeed;

    audio.playEscapePowerUp();
    escapeBannerTimer = 220;
    escapeBannerText = '⚡ MODO FUGA ATIVADO! PULO PROGRESSIVO DESBLOQUEADO!';
    uiFeedback.innerText = '⚡ MODO FUGA! A cada plataforma o seu pulo e a velocidade aumentam!';
    uiFeedback.style.color = '#fef08a';

    spawnFairySparkles(baby.x + baby.w / 2, baby.y + baby.h / 2, 30);
  }

  function resetToStart(failedMidClimb = false) {
    if (cutsceneCompleted || isEscapeMode) {
      // Checkpoint: Topo do Castelo (Plataforma 9)
      const castle = platforms[9];
      baby.x = castle.x + 35;
      baby.y = castle.y - baby.h;
      baby.vy = 0;
      escapeLevel = 0;
      const stats = getEscapeStats(0);
      baby.vx = stats.runVx;
      baby.jumpPower = stats.jumpPower;
      baby.currentPlatformIndex = 9;
      baby.onGround = true;
      baby.longJumpUnlocked = true;
      baby.isEscaping = true;
      isEscapeMode = true;
      currentScrollSpeed = stats.scrollSpeed;
      targetScrollSpeed = stats.scrollSpeed;
      targetCameraZoom = 1.0;
      cameraZoom = 1.0;
      cameraX = castle.x - 140;

      fairy.x = castle.x + 60;
      fairy.y = castle.y - 45;
      fairy.vx = 0;
      fairy.vy = 0;
      fairy.particles = [];

      if (failedMidClimb) {
        audio.playFallFailSound();
        uiFeedback.innerText = 'Cuidado com o abismo! Mantenha o ritmo e sinta o pulo crescer!';
        uiFeedback.style.color = '#f87171';
      }
      return;
    }

    baby.x = 60;
    baby.y = FLOOR_Y - baby.h;
    baby.vy = 0;
    baby.vx = baby.baseVx;
    baby.jumpPower = -7.2;
    baby.currentPlatformIndex = -1;
    baby.onGround = true;
    baby.longJumpUnlocked = false;
    baby.isEscaping = false;
    isEscapeMode = false;
    escapeLevel = 0;
    currentScrollSpeed = 1.5;
    targetScrollSpeed = 1.5;
    firstPlatformCleared = false;
    cutsceneActive = false;
    cutsceneTriggered = false;
    cutsceneCompleted = false;
    targetCameraZoom = 1.0;
    cameraZoom = 1.0;

    // Reset fairy near the baby
    fairy.x = 110;
    fairy.y = FLOOR_Y - 90;
    fairy.vx = 0;
    fairy.vy = 0;
    fairy.targetX = 160;
    fairy.targetY = FLOOR_Y - 90;
    fairy.particles = [];
    fairy.dartTimer = 0;
    fairy.dartOffsetX = 0;
    fairy.dartOffsetY = 0;

    if (failedMidClimb) {
      audio.playFallFailSound();
      showFailMessage();
    }
  }

  function doJump() {
    audio.initAudio();

    if (gameWon) {
      gameWon = false;
      resetToStart(false);
      uiFeedback.innerText = 'Toque na tela para dar um pulinho e seguir a fadinha';
      return;
    }

    // Advance cutscene on touch
    if (cutsceneActive) {
      advanceCutscene();
      return;
    }

    if (baby.onGround) {
      if (baby.longJumpUnlocked) {
        const stats = getEscapeStats(escapeLevel);
        baby.vy = stats.jumpPower;
        baby.vx = stats.airVx; // Dynamic forward momentum impulse matching level
        baby.onGround = false;
        audio.playLongJumpSound(escapeLevel / 11);
        fairy.vy -= 2.8;
        fairy.spinAnim = 1.6;

        // Visual sparkles burst scaled to progressive strength
        const burstCount = 6 + escapeLevel * 2;
        spawnFairySparkles(baby.x + baby.w / 2, baby.y + baby.h, burstCount);
      } else {
        baby.vy = baby.jumpPower;
        baby.onGround = false;
        audio.playJumpSound();
        fairy.vy -= 2.2;
        fairy.spinAnim = 1.0;
        spawnFairySparkles(fairy.x, fairy.y, 6);
      }
    }
  }

  function spawnFairySparkles(x, y, count = 2) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      fairy.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.3,
        size: 1.8 + Math.random() * 2.5,
        hue: 45 + Math.random() * 290,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.025
      });
    }
  }

  // --- BACKGROUND & WALLPAPER ---
  function drawBackgroundWall(camX) {
    // Deep atmospheric nursery background
    ctx.fillStyle = '#110e19';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Wallpaper stripes & diamond pattern with parallax
    const bgOffset = (camX * 0.15) % 80;
    ctx.fillStyle = '#161220';
    for (let x = -80; x < canvas.width + 80; x += 80) {
      ctx.fillRect(x - bgOffset, 0, 40, FLOOR_Y);
    }

    // Faint golden wallpaper stars
    ctx.fillStyle = 'rgba(250, 204, 21, 0.07)';
    for (let x = -80; x < canvas.width + 80; x += 80) {
      const sx = x - bgOffset + 20;
      for (let y = 50; y < FLOOR_Y; y += 65) {
        ctx.beginPath();
        ctx.arc(sx, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Bunting garland / pennant flags hanging across the room
    const garlandOffset = (camX * 0.2) % 360;
    ctx.strokeStyle = 'rgba(120, 100, 150, 0.4)';
    ctx.lineWidth = 1.2;
    for (let gx = -360; gx < canvas.width + 360; gx += 180) {
      const sx = gx - garlandOffset;
      ctx.beginPath();
      ctx.moveTo(sx, 70);
      ctx.quadraticCurveTo(sx + 90, 110, sx + 180, 70);
      ctx.stroke();

      // Colorful hanging pennant triangles
      const colors = ['#f43f5e', '#facc15', '#06b6d4', '#a855f7', '#10b981', '#fb923c'];
      for (let p = 0; p < 5; p++) {
        const t = (p + 0.5) / 5;
        const px = sx + t * 180;
        const py = 70 + (4 * t * (1 - t)) * 40;
        ctx.fillStyle = colors[(Math.floor(gx / 180) * 5 + p) % colors.length];
        ctx.beginPath();
        ctx.moveTo(px - 7, py);
        ctx.lineTo(px + 7, py);
        ctx.lineTo(px, py + 14);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Windows to starry night sky
    const windowLocations = [780, 1950];
    windowLocations.forEach((wx) => {
      const sx = wx - camX * 0.3;
      if (sx < -140 || sx > canvas.width + 140) return;

      // Window frame
      ctx.fillStyle = '#1c152b';
      ctx.strokeStyle = '#42335f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(sx, 80, 90, 130, [45, 45, 4, 4]);
      ctx.fill();
      ctx.stroke();

      // Glasspane midnight sky
      ctx.fillStyle = '#06050e';
      ctx.beginPath();
      ctx.roundRect(sx + 6, 86, 78, 118, [40, 40, 2, 2]);
      ctx.fill();

      // Crescent Moon
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(sx + 35, 115, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#06050e';
      ctx.beginPath();
      ctx.arc(sx + 39, 113, 10, 0, Math.PI * 2);
      ctx.fill();

      // Twinkling stars in window
      ctx.fillStyle = '#ffffff';
      const tw = Math.sin(tick * 0.05 + wx) * 0.5 + 0.5;
      ctx.fillRect(sx + 60, 110, 2, 2);
      ctx.fillRect(sx + 22, 145, 1.5, 1.5);
      ctx.fillRect(sx + 65, 160, 2 * tw, 2 * tw);

      // Window cross panes
      ctx.strokeStyle = '#322549';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx + 45, 86);
      ctx.lineTo(sx + 45, 204);
      ctx.moveTo(sx + 6, 140);
      ctx.lineTo(sx + 84, 140);
      ctx.stroke();

      // Sheer lilac curtains with soft folds
      ctx.fillStyle = 'rgba(168, 85, 247, 0.28)';
      ctx.beginPath();
      ctx.moveTo(sx - 4, 80);
      ctx.quadraticCurveTo(sx + 15, 140, sx + 5, 215);
      ctx.lineTo(sx - 4, 215);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(sx + 94, 80);
      ctx.quadraticCurveTo(sx + 75, 140, sx + 85, 215);
      ctx.lineTo(sx + 94, 215);
      ctx.closePath();
      ctx.fill();
    });

    // Wall peg hooks with hanging items
    const wallPegs = [
      { x: 300, item: 'wizard_hat' },
      { x: 1250, item: 'cape' },
      { x: 2200, item: 'scarf' }
    ];
    wallPegs.forEach(peg => {
      const sx = peg.x - camX * 0.45;
      if (sx < -60 || sx > canvas.width + 60) return;

      // Wooden peg knob
      ctx.fillStyle = '#854d0e';
      ctx.beginPath();
      ctx.arc(sx, 165, 4, 0, Math.PI * 2);
      ctx.fill();

      if (peg.item === 'wizard_hat') {
        // Pointy child wizard hat with yellow stars
        ctx.fillStyle = '#6b21a8';
        ctx.beginPath();
        ctx.ellipse(sx, 205, 16, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(sx - 12, 204);
        ctx.quadraticCurveTo(sx - 3, 175, sx + 8, 168);
        ctx.quadraticCurveTo(sx + 4, 185, sx + 12, 204);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.fillRect(sx, 186, 3, 3);
      } else if (peg.item === 'cape') {
        // Little hero cape
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(sx, 165);
        ctx.lineTo(sx + 16, 212);
        ctx.quadraticCurveTo(sx + 5, 218, sx - 10, 212);
        ctx.closePath();
        ctx.fill();
      } else {
        // Striped winter scarf
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(sx - 4, 168, 8, 38);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(sx - 4, 178, 8, 5);
        ctx.fillRect(sx - 4, 192, 8, 5);
      }
    });

    // Framed children's crayon drawings on the wall
    const wallDrawings = [
      { x: 420, y: 140, type: 'sun' },
      { x: 980, y: 130, type: 'castle' },
      { x: 1600, y: 140, type: 'rainbow' },
      { x: 2360, y: 130, type: 'cat' }
    ];
    wallDrawings.forEach(d => {
      const sx = d.x - camX * 0.45;
      if (sx < -70 || sx > canvas.width + 70) return;

      // Wooden picture frame
      ctx.fillStyle = '#451a03';
      ctx.fillRect(sx - 2, d.y - 2, 48, 44);
      // Paper sheet
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(sx + 2, d.y + 2, 40, 36);

      if (d.type === 'sun') {
        // Big yellow smiley sun with crayon rays
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(sx + 22, d.y + 20, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2;
        for (let a = 0; a < 8; a++) {
          const ang = a * (Math.PI / 4);
          ctx.beginPath();
          ctx.moveTo(sx + 22 + Math.cos(ang) * 9, d.y + 20 + Math.sin(ang) * 9);
          ctx.lineTo(sx + 22 + Math.cos(ang) * 14, d.y + 20 + Math.sin(ang) * 14);
          ctx.stroke();
        }
        // Smiley face
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(sx + 19, d.y + 18, 1.5, 1.5);
        ctx.fillRect(sx + 24, d.y + 18, 1.5, 1.5);
        ctx.beginPath();
        ctx.arc(sx + 22, d.y + 21, 3, 0.2, Math.PI - 0.2);
        ctx.stroke();
      } else if (d.type === 'castle') {
        // Little purple crayon castle
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(sx + 10, d.y + 14, 24, 18);
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.moveTo(sx + 22, d.y + 6);
        ctx.lineTo(sx + 13, d.y + 14);
        ctx.lineTo(sx + 31, d.y + 14);
        ctx.closePath();
        ctx.fill();
      } else if (d.type === 'rainbow') {
        // Crayon rainbow
        ctx.lineWidth = 2;
        const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];
        colors.forEach((c, idx) => {
          ctx.strokeStyle = c;
          ctx.beginPath();
          ctx.arc(sx + 22, d.y + 32, 15 - idx * 2.5, Math.PI, 0);
          ctx.stroke();
        });
      } else {
        // Crayon cat
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(sx + 22, d.y + 22, 7, 0, Math.PI * 2);
        ctx.fill();
        // Ears
        ctx.beginPath();
        ctx.moveTo(sx + 17, d.y + 17);
        ctx.lineTo(sx + 15, d.y + 11);
        ctx.lineTo(sx + 20, d.y + 16);
        ctx.moveTo(sx + 24, d.y + 16);
        ctx.lineTo(sx + 29, d.y + 11);
        ctx.lineTo(sx + 27, d.y + 17);
        ctx.fill();
      }
    });

    // High floating wall shelf with miniature toys
    const wallShelves = [580, 1400, 2100];
    wallShelves.forEach(wx => {
      const sx = wx - camX * 0.4;
      if (sx < -120 || sx > canvas.width + 120) return;

      // Wooden shelf board
      ctx.fillStyle = '#312117';
      ctx.fillRect(sx, 160, 95, 8);
      // Metal shelf bracket supports
      ctx.strokeStyle = '#1e140d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx + 12, 168);
      ctx.lineTo(sx + 12, 184);
      ctx.lineTo(sx + 26, 168);
      ctx.moveTo(sx + 83, 168);
      ctx.lineTo(sx + 83, 184);
      ctx.lineTo(sx + 69, 168);
      ctx.stroke();

      // Books leaning on shelf
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(sx + 12, 134, 7, 26);
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(sx + 20, 138, 6, 22);

      // Glass snowglobe
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sx + 45, 144, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#451a03';
      ctx.fillRect(sx + 38, 154, 14, 6);

      // Miniature wooden sailboat
      ctx.fillStyle = '#854d0e';
      ctx.beginPath();
      ctx.moveTo(sx + 68, 156);
      ctx.lineTo(sx + 86, 156);
      ctx.lineTo(sx + 81, 160);
      ctx.lineTo(sx + 72, 160);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(sx + 77, 156);
      ctx.lineTo(sx + 77, 140);
      ctx.lineTo(sx + 84, 153);
      ctx.closePath();
      ctx.fill();
    });

    // --- FLOOR & BASEBOARDS ---
    ctx.fillStyle = '#1c1726';
    ctx.fillRect(0, FLOOR_Y, canvas.width, canvas.height - FLOOR_Y);

    // Dark wood baseboard molding
    ctx.fillStyle = '#2b2138';
    ctx.fillRect(0, FLOOR_Y - 8, canvas.width, 8);
    ctx.strokeStyle = '#3e3152';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, FLOOR_Y - 8);
    ctx.lineTo(canvas.width, FLOOR_Y - 8);
    ctx.stroke();

    // Wooden plank seams on floor
    ctx.strokeStyle = '#15111e';
    ctx.lineWidth = 2;
    for (let x = -80; x < canvas.width + 80; x += 70) {
      const sx = x - (camX % 70);
      ctx.beginPath();
      ctx.moveTo(sx, FLOOR_Y);
      ctx.lineTo(sx - 28, canvas.height);
      ctx.stroke();
    }
  }

  // --- DETAILED ROOM SCENERY ITEMS (BAGUNÇA DO QUARTO) ---
  function drawSceneryItems(camX) {
    roomScenery.forEach((item) => {
      const sx = item.x - camX;
      if (sx < -160 || sx > canvas.width + 160) return;

      ctx.save();

      switch (item.type) {
        case 'fluffy_rug': {
          // Large round pastel mandala rug on floor
          ctx.fillStyle = '#4a2840';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y + 18, 55, 16, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#9d4edd';
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.fillStyle = '#7b2cbf';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y + 18, 38, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'striped_rug': {
          // Oval striped runner rug
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y + 20, 60, 15, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.strokeStyle = '#facc15';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y + 20, 42, 10, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }

        case 'dropped_sweater': {
          // Dropped kid's soft cozy knit sweater
          ctx.fillStyle = '#ec4899';
          ctx.strokeStyle = '#9d174d';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 9, 16, 9, 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Crumpled sleeves
          ctx.beginPath();
          ctx.ellipse(sx - 14, FLOOR_Y - 5, 8, 4.5, -0.4, 0, Math.PI * 2);
          ctx.ellipse(sx + 14, FLOOR_Y - 6, 8, 4.5, 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Little buttons
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 1, FLOOR_Y - 12, 2, 2);
          ctx.fillRect(sx - 1, FLOOR_Y - 7, 2, 2);
          break;
        }

        case 'striped_socks': {
          // Pair of colorful kid socks tossed on floor
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.roundRect(sx - 8, FLOOR_Y - 6, 14, 6, 3);
          ctx.roundRect(sx + 6, FLOOR_Y - 8, 12, 6, 3);
          ctx.fill();
          // Stripes
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx - 4, FLOOR_Y - 6, 3, 6);
          ctx.fillRect(sx + 10, FLOOR_Y - 8, 3, 6);
          break;
        }

        case 'spilled_crayons': {
          // Box of crayons tipped over with crayons rolled out & scribbles
          // Crayon scribble on the floor
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sx - 20, FLOOR_Y - 2);
          ctx.lineTo(sx - 8, FLOOR_Y - 4);
          ctx.lineTo(sx + 12, FLOOR_Y - 1);
          ctx.stroke();

          // Yellow box
          ctx.fillStyle = '#eab308';
          ctx.strokeStyle = '#854d0e';
          ctx.lineWidth = 1;
          ctx.fillRect(sx - 18, FLOOR_Y - 14, 18, 12);
          ctx.strokeRect(sx - 18, FLOOR_Y - 14, 18, 12);
          ctx.fillStyle = '#1e3a8a';
          ctx.fillRect(sx - 18, FLOOR_Y - 10, 18, 3);

          // Individual crayons rolling on the floor
          const crayonColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
          crayonColors.forEach((col, idx) => {
            ctx.fillStyle = col;
            ctx.fillRect(sx + 2 + idx * 7, FLOOR_Y - 4, 10, 3);
            ctx.beginPath();
            ctx.moveTo(sx + 12 + idx * 7, FLOOR_Y - 4);
            ctx.lineTo(sx + 14 + idx * 7, FLOOR_Y - 2.5);
            ctx.lineTo(sx + 12 + idx * 7, FLOOR_Y - 1);
            ctx.fill();
          });
          break;
        }

        case 'paper_airplane': {
          // White paper glider resting nose-down
          ctx.fillStyle = '#f8fafc';
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx - 12, FLOOR_Y - 10);
          ctx.lineTo(sx + 8, FLOOR_Y - 2);
          ctx.lineTo(sx - 4, FLOOR_Y - 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(sx - 10, FLOOR_Y - 6);
          ctx.lineTo(sx + 8, FLOOR_Y - 2);
          ctx.lineTo(sx - 4, FLOOR_Y - 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        }

        case 'toy_car': {
          // Wooden retro red toy racecar
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.roundRect(sx - 14, FLOOR_Y - 12, 28, 9, [4, 4, 2, 2]);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 8, 4, 0, Math.PI * 2);
          ctx.fill();
          // Black wooden wheels
          ctx.fillStyle = '#18181b';
          ctx.beginPath();
          ctx.arc(sx - 8, FLOOR_Y - 3, 4, 0, Math.PI * 2);
          ctx.arc(sx + 8, FLOOR_Y - 3, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'scattered_blocks': {
          // Scattered wooden alphabet blocks
          const blocks = [
            { x: sx - 10, y: FLOOR_Y - 14, col: '#ef4444', letter: 'A' },
            { x: sx + 4, y: FLOOR_Y - 12, col: '#3b82f6', letter: 'B' },
            { x: sx - 2, y: FLOOR_Y - 24, col: '#eab308', letter: 'C' }
          ];
          blocks.forEach(b => {
            ctx.fillStyle = b.col;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.fillRect(b.x, b.y, 12, 12);
            ctx.strokeRect(b.x, b.y, 12, 12);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px sans-serif';
            ctx.fillText(b.letter, b.x + 2, b.y + 9);
          });
          break;
        }

        case 'cardboard_box_floor': {
          // Open cardboard box on the floor with plushies peeking out
          ctx.fillStyle = '#926038';
          ctx.strokeStyle = '#5f3c1f';
          ctx.lineWidth = 1.4;
          ctx.fillRect(sx - 20, FLOOR_Y - 26, 40, 26);
          ctx.strokeRect(sx - 20, FLOOR_Y - 26, 40, 26);
          // Open flaps
          ctx.beginPath();
          ctx.moveTo(sx - 20, FLOOR_Y - 26);
          ctx.lineTo(sx - 28, FLOOR_Y - 34);
          ctx.lineTo(sx - 10, FLOOR_Y - 26);
          ctx.moveTo(sx + 20, FLOOR_Y - 26);
          ctx.lineTo(sx + 28, FLOOR_Y - 34);
          ctx.lineTo(sx + 10, FLOOR_Y - 26);
          ctx.stroke();
          // Cute teddy bear head inside
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 28, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.arc(sx - 6, FLOOR_Y - 34, 3.5, 0, Math.PI * 2);
          ctx.arc(sx + 6, FLOOR_Y - 34, 3.5, 0, Math.PI * 2);
          ctx.fill();
          // Label tape
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 12, FLOOR_Y - 16, 24, 7);
          ctx.fillStyle = '#1e1b4b';
          ctx.font = '6px sans-serif';
          ctx.fillText('BRINQUEDOS', sx - 11, FLOOR_Y - 11);
          break;
        }

        case 'dinosaur_felt': {
          // Little green felt dinosaur toy
          ctx.fillStyle = '#16a34a';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 10, 14, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          // Neck & head
          ctx.beginPath();
          ctx.moveTo(sx + 8, FLOOR_Y - 12);
          ctx.lineTo(sx + 14, FLOOR_Y - 24);
          ctx.arc(sx + 16, FLOOR_Y - 24, 4, 0, Math.PI * 2);
          ctx.lineTo(sx + 10, FLOOR_Y - 8);
          ctx.fill();
          // Yellow back spikes
          ctx.fillStyle = '#facc15';
          for (let s = 0; s < 4; s++) {
            ctx.beginPath();
            ctx.moveTo(sx - 8 + s * 5, FLOOR_Y - 16);
            ctx.lineTo(sx - 6 + s * 5, FLOOR_Y - 21);
            ctx.lineTo(sx - 4 + s * 5, FLOOR_Y - 16);
            ctx.fill();
          }
          break;
        }

        case 'slinky': {
          // Rainbow coil slinky stretched on floor
          const slinkyColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6'];
          ctx.lineWidth = 1.8;
          for (let i = 0; i < 10; i++) {
            ctx.strokeStyle = slinkyColors[i % slinkyColors.length];
            ctx.beginPath();
            ctx.ellipse(sx - 18 + i * 4, FLOOR_Y - 9, 3.5, 9, 0.2, 0, Math.PI * 2);
            ctx.stroke();
          }
          break;
        }

        case 'wooden_spinning_top': {
          // Colorful spinning top with wound string
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.moveTo(sx - 9, FLOOR_Y - 18);
          ctx.lineTo(sx + 9, FLOOR_Y - 18);
          ctx.lineTo(sx, FLOOR_Y - 3);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(sx - 9, FLOOR_Y - 18, 18, 4);
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx - 2, FLOOR_Y - 24, 4, 6);
          break;
        }

        case 'plush_bunny': {
          // Soft plush bunny with floppy ears
          ctx.fillStyle = '#f1f5f9';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 10, 11, 9, 0, 0, Math.PI * 2);
          ctx.arc(sx + 8, FLOOR_Y - 18, 7, 0, Math.PI * 2);
          ctx.fill();
          // Long floppy ear
          ctx.fillStyle = '#fed7aa';
          ctx.beginPath();
          ctx.ellipse(sx + 4, FLOOR_Y - 27, 3, 8, -0.3, 0, Math.PI * 2);
          ctx.fill();
          // Eye & pink nose
          ctx.fillStyle = '#db2777';
          ctx.beginPath();
          ctx.arc(sx + 14, FLOOR_Y - 18, 1.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'puzzle_pieces': {
          // Scattered jigsaw puzzle pieces
          const pCols = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'];
          pCols.forEach((col, i) => {
            ctx.fillStyle = col;
            ctx.fillRect(sx - 12 + i * 8, FLOOR_Y - 5, 6, 5);
            ctx.beginPath();
            ctx.arc(sx - 9 + i * 8, FLOOR_Y - 5, 2, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }

        case 'toy_train': {
          // Classic wooden toy locomotive
          ctx.fillStyle = '#1d4ed8';
          ctx.fillRect(sx - 14, FLOOR_Y - 16, 22, 12);
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(sx + 8, FLOOR_Y - 22, 10, 18);
          // Smokestack
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx - 10, FLOOR_Y - 22, 5, 7);
          // Wheels
          ctx.fillStyle = '#18181b';
          ctx.beginPath();
          ctx.arc(sx - 6, FLOOR_Y - 4, 4, 0, Math.PI * 2);
          ctx.arc(sx + 4, FLOOR_Y - 4, 4, 0, Math.PI * 2);
          ctx.arc(sx + 13, FLOOR_Y - 4, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'open_story_book': {
          // Open picture book on floor with ribbon bookmark
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.moveTo(sx, FLOOR_Y - 4);
          ctx.quadraticCurveTo(sx - 12, FLOOR_Y - 12, sx - 22, FLOOR_Y - 4);
          ctx.lineTo(sx - 22, FLOOR_Y - 1);
          ctx.lineTo(sx, FLOOR_Y - 1);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(sx, FLOOR_Y - 4);
          ctx.quadraticCurveTo(sx + 12, FLOOR_Y - 12, sx + 22, FLOOR_Y - 4);
          ctx.lineTo(sx + 22, FLOOR_Y - 1);
          ctx.lineTo(sx, FLOOR_Y - 1);
          ctx.fill();
          // Red bookmark ribbon
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx, FLOOR_Y - 4);
          ctx.quadraticCurveTo(sx + 4, FLOOR_Y + 4, sx + 10, FLOOR_Y + 6);
          ctx.stroke();
          break;
        }

        case 'spilled_marbles': {
          // Translucent glass marbles reflecting light
          const mColors = ['#06b6d4', '#f43f5e', '#a855f7', '#22c55e', '#eab308'];
          mColors.forEach((mc, i) => {
            const mx = sx - 15 + i * 8;
            const my = FLOOR_Y - 4;
            ctx.fillStyle = mc;
            ctx.beginPath();
            ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
            ctx.fill();
            // Highlight
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(mx - 1, my - 1, 1, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }

        case 'toy_soldier': {
          // Tin guard with red coat and tall black bearskin hat
          ctx.fillStyle = '#1e1b4b'; // tall hat
          ctx.fillRect(sx - 3, FLOOR_Y - 32, 6, 12);
          ctx.fillStyle = '#fed7aa'; // face
          ctx.fillRect(sx - 3, FLOOR_Y - 20, 6, 5);
          ctx.fillStyle = '#dc2626'; // coat
          ctx.fillRect(sx - 4, FLOOR_Y - 15, 8, 8);
          ctx.fillStyle = '#facc15'; // belt
          ctx.fillRect(sx - 4, FLOOR_Y - 11, 8, 2);
          ctx.fillStyle = '#1e293b'; // boots
          ctx.fillRect(sx - 3, FLOOR_Y - 7, 6, 7);
          break;
        }

        case 'retro_robot': {
          // Mint green tin robot with winding key & antenna
          ctx.fillStyle = '#0d9488';
          ctx.fillRect(sx - 7, FLOOR_Y - 24, 14, 12); // head
          ctx.fillRect(sx - 9, FLOOR_Y - 12, 18, 10); // body
          // Yellow dial
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 4, FLOOR_Y - 10, 8, 6);
          // Antenna with red bead
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(sx, FLOOR_Y - 24);
          ctx.lineTo(sx, FLOOR_Y - 30);
          ctx.stroke();
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 31, 2.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'jack_in_box': {
          // Jack in the box clown
          ctx.fillStyle = '#8b5cf6';
          ctx.fillRect(sx - 12, FLOOR_Y - 20, 24, 20);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(sx - 12, FLOOR_Y - 20, 24, 20);
          // Spring
          ctx.strokeStyle = '#94a3b8';
          ctx.beginPath();
          for (let s = 0; s < 4; s++) {
            ctx.lineTo(sx + (s % 2 === 0 ? -6 : 6), FLOOR_Y - 20 - s * 5);
          }
          ctx.stroke();
          // Clown head
          ctx.fillStyle = '#fdf4ff';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 44, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 43, 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'rattle': {
          // Pastel baby rattle
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 18, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 18, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx - 2, FLOOR_Y - 10, 4, 10);
          break;
        }

        case 'windup_mouse': {
          // Tiny grey clockwork mouse with brass winding key
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 6, 9, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          // Round ear
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.arc(sx - 4, FLOOR_Y - 10, 3, 0, Math.PI * 2);
          ctx.fill();
          // Winding key
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(sx + 6, FLOOR_Y - 11, 3.5, 0, Math.PI * 2);
          ctx.moveTo(sx + 6, FLOOR_Y - 8);
          ctx.lineTo(sx + 6, FLOOR_Y - 5);
          ctx.stroke();
          break;
        }

        case 'cradle': {
          // Antique wooden rocking cradle
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx - 24, FLOOR_Y - 35, 48, 26);
          // Rocker curved base
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 5, 28, 0.2, Math.PI - 0.2);
          ctx.stroke();
          // Pillow & blanket
          ctx.fillStyle = '#fce7f3';
          ctx.fillRect(sx - 20, FLOOR_Y - 32, 40, 10);
          break;
        }

        case 'giant_spool': {
          // Giant spool of thread
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 14, FLOOR_Y - 24, 28, 4);
          ctx.fillRect(sx - 14, FLOOR_Y - 4, 28, 4);
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(sx - 10, FLOOR_Y - 20, 20, 16);
          break;
        }

        case 'wooden_horse': {
          // Rocking horse on floor
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.ellipse(sx, FLOOR_Y - 18, 16, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          // Horse head
          ctx.beginPath();
          ctx.moveTo(sx + 10, FLOOR_Y - 20);
          ctx.lineTo(sx + 18, FLOOR_Y - 36);
          ctx.lineTo(sx + 24, FLOOR_Y - 32);
          ctx.lineTo(sx + 16, FLOOR_Y - 16);
          ctx.closePath();
          ctx.fill();
          // Rocker runners
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(sx, FLOOR_Y - 3, 26, 0.25, Math.PI - 0.25);
          ctx.stroke();
          break;
        }

        default:
          break;
      }

      ctx.restore();
    });
  }

  // --- PLATFORM DRAWING WITH DEDICATED THEMES ---
  function drawPlatforms(camX) {
    ctx.save();
    platforms.forEach((p, idx) => {
      const sx = p.x - camX;
      if (sx + p.w < -80 || sx > canvas.width + 80) return;

      switch (p.style) {
        case 'giant_bear': {
          // 1. Cabeça do Urso de Pelúcia Gigante
          // Rounded plush head
          const bearGrad = ctx.createRadialGradient(
            sx + p.w / 2, p.y + 35, 10,
            sx + p.w / 2, p.y + 35, 65
          );
          bearGrad.addColorStop(0, '#d97706');
          bearGrad.addColorStop(0.7, '#b45309');
          bearGrad.addColorStop(1, '#78350f');
          ctx.fillStyle = bearGrad;
          ctx.beginPath();
          ctx.roundRect(sx, p.y, p.w, p.h + 20, [30, 30, 8, 8]);
          ctx.fill();

          // Felt ear with cross-stitches on left
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.arc(sx + 18, p.y - 6, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fde68a';
          ctx.beginPath();
          ctx.arc(sx + 18, p.y - 6, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx + 14, p.y - 9); ctx.lineTo(sx + 22, p.y - 3);
          ctx.moveTo(sx + 22, p.y - 9); ctx.lineTo(sx + 14, p.y - 3);
          ctx.stroke();

          // Felt ear on right
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.arc(sx + p.w - 18, p.y - 6, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fde68a';
          ctx.beginPath();
          ctx.arc(sx + p.w - 18, p.y - 6, 9, 0, Math.PI * 2);
          ctx.fill();

          // Big black button eye visible on side
          ctx.fillStyle = '#18181b';
          ctx.beginPath();
          ctx.arc(sx + 35, p.y + 22, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(sx + 33, p.y + 20, 2, 0, Math.PI * 2);
          ctx.fill();

          // Soft embroidered muzzle
          ctx.fillStyle = '#fef3c7';
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y + 36, 22, 14, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 32, 5, 0, Math.PI * 2);
          ctx.fill();

          // Red satin ribbon bow
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + p.h + 8, 8, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'open_books': {
          // 2. Pilha de Livros Ilustrados
          // Book 1 (bottom green book)
          ctx.fillStyle = '#065f46';
          ctx.fillRect(sx - 4, p.y + 36, p.w + 8, p.h - 36);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 2, p.y + 38, 5, p.h - 40);

          // Book 2 (middle crimson leather book)
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(sx + 4, p.y + 18, p.w - 2, 20);
          ctx.fillStyle = '#fef9c3';
          ctx.fillRect(sx + 6, p.y + 20, p.w - 12, 16);
          ctx.fillStyle = '#7f1d1d';
          ctx.fillRect(sx + 2, p.y + 18, 8, 20); // spine

          // Book 3 (top sapphire fairy tale book)
          ctx.fillStyle = '#1e40af';
          ctx.beginPath();
          ctx.roundRect(sx, p.y, p.w, 18, [4, 4, 0, 0]);
          ctx.fill();
          // Gold foil title & stars on cover
          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 9px Georgia, serif';
          ctx.fillText('✦ CONTOS DE NINAR ✦', sx + 8, p.y + 12);
          // Silk bookmark ribbon hanging down
          ctx.fillStyle = '#e11d48';
          ctx.fillRect(sx + p.w - 24, p.y + 16, 6, 24);
          break;
        }

        case 'vanity_table': {
          // 3. Penteadeira com Espelho Encantado
          // Wooden carved table base
          ctx.fillStyle = '#581c87';
          ctx.fillRect(sx, p.y + 20, p.w, p.h - 20);
          ctx.fillStyle = '#6b21a8';
          ctx.fillRect(sx - 4, p.y + 12, p.w + 8, 10);

          // Ornate Oval Mirror standing up at the back
          ctx.fillStyle = '#e9d5ff';
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y - 14, 28, 32, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Magical reflection inside mirror
          const mirrorGrad = ctx.createLinearGradient(sx + 20, p.y - 40, sx + p.w - 20, p.y + 10);
          mirrorGrad.addColorStop(0, 'rgba(192, 132, 252, 0.4)');
          mirrorGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
          mirrorGrad.addColorStop(1, 'rgba(6, 182, 212, 0.3)');
          ctx.fillStyle = mirrorGrad;
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y - 14, 24, 28, 0, 0, Math.PI * 2);
          ctx.fill();

          // Little perfume bottles on table top
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(sx + 8, p.y + 2, 7, 10);
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(sx + p.w - 16, p.y + 2, 8, 10);

          // Pearl necklace draped over drawer
          ctx.fillStyle = '#f8fafc';
          for (let b = 0; b < 7; b++) {
            ctx.beginPath();
            ctx.arc(sx + 25 + b * 5, p.y + 26 + Math.sin(b * 0.5) * 6, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case 'cardboard_box': {
          // 4. Caixa de Papelão Aberta
          ctx.fillStyle = '#a16207';
          ctx.fillRect(sx, p.y + 10, p.w, p.h - 10);
          ctx.strokeStyle = '#713f12';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx, p.y + 10, p.w, p.h - 10);

          // Cardboard flaps open forming the top walking surface
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.moveTo(sx - 8, p.y);
          ctx.lineTo(sx + p.w / 2, p.y + 10);
          ctx.lineTo(sx + p.w + 8, p.y);
          ctx.lineTo(sx + p.w, p.y + 12);
          ctx.lineTo(sx, p.y + 12);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // "FRÁGIL" tape and stickers
          ctx.fillStyle = '#fee2e2';
          ctx.fillRect(sx + 14, p.y + 28, 42, 14);
          ctx.fillStyle = '#dc2626';
          ctx.font = 'bold 8px sans-serif';
          ctx.fillText('FRÁGIL ⬆', sx + 18, p.y + 38);

          // Plush bear arm peeking out
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.ellipse(sx + p.w - 18, p.y + 6, 9, 5, -0.4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'messy_blocks': {
          // 5. Pilha Desordenada de Blocos ABC
          // Jumbled stack of giant wooden toy blocks
          const bW = 36;
          const bH = 34;

          // Block 1: Red 'A'
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(sx + 4, p.y + 24, bW, bH);
          ctx.strokeStyle = '#b91c1c';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx + 4, p.y + 24, bW, bH);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText('A', sx + 14, p.y + 48);

          // Block 2: Blue 'B'
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(sx + 42, p.y + 28, bW, bH);
          ctx.strokeStyle = '#1d4ed8';
          ctx.strokeRect(sx + 42, p.y + 28, bW, bH);
          ctx.fillStyle = '#ffffff';
          ctx.fillText('B', sx + 52, p.y + 52);

          // Block 3: Yellow 'C'
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx + 80, p.y + 24, bW - 4, bH);
          ctx.strokeStyle = '#a16207';
          ctx.strokeRect(sx + 80, p.y + 24, bW - 4, bH);
          ctx.fillStyle = '#1e1b4b';
          ctx.fillText('C', sx + 88, p.y + 48);

          // Top walking platform block
          ctx.fillStyle = '#10b981';
          ctx.fillRect(sx + 16, p.y, p.w - 32, 24);
          ctx.strokeStyle = '#047857';
          ctx.strokeRect(sx + 16, p.y, p.w - 32, 24);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('★ 1 2 3 ★', sx + 24, p.y + 16);
          break;
        }

        case 'toy_drum': {
          // 6. Tamborito de Marcha
          // Drum body
          ctx.fillStyle = '#b91c1c';
          ctx.fillRect(sx, p.y + 14, p.w, p.h - 14);

          // Zigzag tension cords
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let z = 0; z < p.w; z += 18) {
            ctx.lineTo(sx + z, p.y + 16 + ((z / 18) % 2 === 0 ? 0 : p.h - 30));
          }
          ctx.stroke();

          // Brass bottom rim
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(sx - 2, p.y + p.h - 12, p.w + 4, 10);

          // Top white drumhead (landing surface)
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(sx, p.y + 4, p.w, 10);
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(sx - 4, p.y, p.w + 8, 6);

          // Crossed wooden drumsticks
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(sx + 12, p.y + 2); ctx.lineTo(sx + p.w - 12, p.y + 10);
          ctx.moveTo(sx + 12, p.y + 10); ctx.lineTo(sx + p.w - 12, p.y + 2);
          ctx.stroke();
          break;
        }

        case 'satin_cushion': {
          // 7. Almofadão de Veludo com Borlas
          // Plush tufted velvet cushion
          const cushGrad = ctx.createRadialGradient(
            sx + p.w / 2, p.y + 16, 12,
            sx + p.w / 2, p.y + 16, p.w / 2
          );
          cushGrad.addColorStop(0, '#c026d3');
          cushGrad.addColorStop(0.7, '#86198f');
          cushGrad.addColorStop(1, '#4a044e');
          ctx.fillStyle = cushGrad;
          ctx.beginPath();
          ctx.roundRect(sx, p.y, p.w, p.h, 16);
          ctx.fill();

          // Golden tufted buttons
          ctx.fillStyle = '#facc15';
          const btnX = [sx + 24, sx + p.w / 2, sx + p.w - 24];
          btnX.forEach(bx => {
            ctx.beginPath();
            ctx.arc(bx, p.y + 18, 3.5, 0, Math.PI * 2);
            ctx.fill();
            // Creases radiating from button
            ctx.strokeStyle = 'rgba(74, 4, 78, 0.4)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(bx, p.y + 18); ctx.lineTo(bx - 8, p.y + 6);
            ctx.moveTo(bx, p.y + 18); ctx.lineTo(bx + 8, p.y + 6);
            ctx.stroke();
          });

          // Gold corner tassels
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(sx + 4, p.y + 4, 4, 0, Math.PI * 2);
          ctx.arc(sx + p.w - 4, p.y + 4, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'stepped_dresser': {
          // 8. Gavetas da Cômoda como Degraus
          // Dresser frame
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx, p.y, p.w, p.h);

          // Top open drawer (highest step)
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 6, p.y, p.w + 12, 18);
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 9, 3, 0, Math.PI * 2);
          ctx.fill();

          // Second drawer pulled out forward
          ctx.fillStyle = '#5f2709';
          ctx.fillRect(sx + 8, p.y + 24, p.w - 8, 22);
          // Colorful socks hanging from drawer
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(sx + 22, p.y + 36, 12, 14);
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(sx + 40, p.y + 34, 10, 18);
          break;
        }

        case 'music_box': {
          // 9. Caixa de Música da Bailarina
          // Mahogany box
          ctx.fillStyle = '#422006';
          ctx.fillRect(sx, p.y + 16, p.w, p.h - 16);
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx, p.y + 16, p.w, p.h - 16);

          // Golden musical clef & notes carved on front
          ctx.fillStyle = '#facc15';
          ctx.font = '14px sans-serif';
          ctx.fillText('♫ 𝄞 ♬', sx + p.w / 2 - 20, p.y + 44);

          // Top brass platform
          ctx.fillStyle = '#d97706';
          ctx.fillRect(sx - 2, p.y + 8, p.w + 4, 8);

          // Rotating gold key on the side
          const keyAngle = tick * 0.05;
          ctx.save();
          ctx.translate(sx - 8, p.y + 32);
          ctx.rotate(keyAngle);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, -6, 5, 0, Math.PI * 2);
          ctx.moveTo(0, -1); ctx.lineTo(0, 8);
          ctx.stroke();
          ctx.restore();

          // Spinning miniature porcelain ballerina
          const bPhase = Math.sin(tick * 0.08);
          ctx.fillStyle = '#fce7f3';
          ctx.beginPath();
          // Tutu
          ctx.ellipse(sx + p.w / 2, p.y + 2, 12 * Math.abs(bPhase) + 4, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          // Ballerina torso & head
          ctx.fillStyle = '#fdf2f8';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y - 10, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'block_castle': {
          // 10. Castelinho de Blocos
          ctx.fillStyle = '#475569';
          ctx.fillRect(sx, p.y + 12, p.w, p.h - 12);

          // Turret battlements along top
          ctx.fillStyle = '#334155';
          const crenWidth = 14;
          for (let cx = 0; cx < p.w; cx += crenWidth * 2) {
            ctx.fillRect(sx + cx, p.y, crenWidth, 14);
          }

          // Arched doorway
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + p.h - 16, 12, Math.PI, 0);
          ctx.rect(sx + p.w / 2 - 12, p.y + p.h - 16, 24, 16);
          ctx.fill();

          // Waving blue banner flag
          ctx.fillStyle = '#0284c7';
          const flagWave = Math.sin(tick * 0.08) * 3;
          ctx.beginPath();
          ctx.moveTo(sx + 14, p.y - 16);
          ctx.quadraticCurveTo(sx + 26, p.y - 16 + flagWave, sx + 34, p.y - 12);
          ctx.lineTo(sx + 14, p.y - 6);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx + 14, p.y + 4); ctx.lineTo(sx + 14, p.y - 18);
          ctx.stroke();
          break;
        }

        case 'train_trestle': {
          // 11. Pista Elevada do Trenzinho
          // Wooden railway trestle bents
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(sx + 16, p.y + 12); ctx.lineTo(sx + 16, p.y + p.h);
          ctx.moveTo(sx + p.w - 16, p.y + 12); ctx.lineTo(sx + p.w - 16, p.y + p.h);
          // Diagonal cross braces
          ctx.moveTo(sx + 16, p.y + 20); ctx.lineTo(sx + p.w - 16, p.y + 50);
          ctx.moveTo(sx + p.w - 16, p.y + 20); ctx.lineTo(sx + 16, p.y + 50);
          ctx.stroke();

          // Wooden rails & ties
          ctx.fillStyle = '#92400e';
          for (let rx = 0; rx < p.w; rx += 14) {
            ctx.fillRect(sx + rx, p.y + 4, 10, 8);
          }
          // Steel track rails
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(sx, p.y, p.w, 4);

          // Parked colorful toy locomotive
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(sx + p.w / 2 - 14, p.y - 14, 28, 14);
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx + p.w / 2 - 8, p.y - 20, 6, 6);
          break;
        }

        case 'wall_shelf': {
          // 12. Prateleira de Brinquedos da Parede
          // Heavy pine shelf
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx, p.y, p.w, 14);
          ctx.fillStyle = '#92400e';
          ctx.fillRect(sx, p.y + 14, p.w, p.h - 14);

          // Wrought iron scrollwork brackets
          ctx.strokeStyle = '#18181b';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(sx + 14, p.y + 14);
          ctx.quadraticCurveTo(sx + 24, p.y + 36, sx + 14, p.y + 50);
          ctx.moveTo(sx + p.w - 14, p.y + 14);
          ctx.quadraticCurveTo(sx + p.w - 24, p.y + 36, sx + p.w - 14, p.y + 50);
          ctx.stroke();

          // Decorative items on shelf
          // Snowglobe
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.strokeStyle = '#93c5fd';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(sx + 28, p.y - 12, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Alarm clock
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(sx + p.w - 26, p.y - 9, 8, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'mushroom_lamp': {
          // 13. Abajur Cogumelo Brilhante
          // Glowing polka-dot mushroom cap
          const lampGrad = ctx.createRadialGradient(
            sx + p.w / 2, p.y + 10, 10,
            sx + p.w / 2, p.y + 10, p.w / 2
          );
          lampGrad.addColorStop(0, '#fda4af');
          lampGrad.addColorStop(0.5, '#f43f5e');
          lampGrad.addColorStop(1, '#9f1239');
          ctx.fillStyle = lampGrad;
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y + 12, p.w / 2, 16, 0, 0, Math.PI * 2);
          ctx.fill();

          // White polka dots
          ctx.fillStyle = '#fff1f2';
          const dots = [
            { x: sx + 22, y: p.y + 8, r: 4 },
            { x: sx + p.w / 2, y: p.y + 6, r: 5 },
            { x: sx + p.w - 24, y: p.y + 9, r: 4 },
            { x: sx + 40, y: p.y + 16, r: 3.5 }
          ];
          dots.forEach(d => {
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
          });

          // Soft light bulb glow beneath cap
          ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
          ctx.beginPath();
          ctx.ellipse(sx + p.w / 2, p.y + 18, p.w / 2 - 8, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Mushroom stalk
          ctx.fillStyle = '#fdf4ff';
          ctx.fillRect(sx + p.w / 2 - 12, p.y + 20, 24, p.h - 20);
          break;
        }

        case 'dollhouse_roof': {
          // 14. Telhado da Casa de Bonecas
          // Scalloped shingle roof
          ctx.fillStyle = '#be123c';
          ctx.fillRect(sx, p.y, p.w, p.h);

          // Miniature scalloped shingles
          ctx.fillStyle = '#9f1239';
          for (let sy = p.y + 8; sy < p.y + p.h; sy += 12) {
            for (let shx = sx; shx < sx + p.w; shx += 16) {
              ctx.beginPath();
              ctx.arc(shx + 8, sy, 8, 0, Math.PI);
              ctx.fill();
            }
          }

          // Miniature brick chimney
          ctx.fillStyle = '#b91c1c';
          ctx.fillRect(sx + p.w - 24, p.y - 18, 16, 24);
          ctx.fillStyle = '#450a0a';
          ctx.fillRect(sx + p.w - 26, p.y - 20, 20, 4);

          // Dormer window
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(sx + 30, p.y + 16, 8, Math.PI, 0);
          ctx.rect(sx + 22, p.y + 16, 16, 12);
          ctx.fill();
          break;
        }

        case 'wardrobe_portal': {
          // Topo do Guarda-Roupa Clássico
          ctx.fillStyle = '#3b1808';
          ctx.fillRect(sx, p.y, p.w, p.h);
          ctx.fillStyle = '#59250b';
          ctx.fillRect(sx - 8, p.y - 4, p.w + 16, 10);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 4, p.y + 6, p.w + 8, 8);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2.4;
          ctx.strokeRect(sx + 10, p.y + 20, p.w - 20, 28);
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 13px Palatino, Georgia, serif';
          ctx.fillText('✧  O  PORTAL  DOS  SONHOS  ✧', sx + p.w / 2 - 105, p.y + 38);
          break;
        }

        case 'spinning_globe': {
          // 5/12 Globo Terrestre Ilustrado
          ctx.fillStyle = '#3f1d0b';
          ctx.fillRect(sx + 10, p.y + p.h - 18, p.w - 20, 18);
          ctx.fillStyle = '#5c2b10';
          ctx.fillRect(sx + 20, p.y + p.h - 32, p.w - 40, 14);

          // Brass semi-meridian arch
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 44, 34, 0.4, Math.PI - 0.4);
          ctx.stroke();

          // Globe sphere
          const gx = sx + p.w / 2;
          const gy = p.y + 42;
          const globeGrad = ctx.createRadialGradient(gx - 8, gy - 8, 4, gx, gy, 30);
          globeGrad.addColorStop(0, '#38bdf8');
          globeGrad.addColorStop(0.7, '#0284c7');
          globeGrad.addColorStop(1, '#0369a1');
          ctx.fillStyle = globeGrad;
          ctx.beginPath();
          ctx.arc(gx, gy, 28, 0, Math.PI * 2);
          ctx.fill();

          // Green continents
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.ellipse(gx - 8, gy - 6, 10, 7, 0.3, 0, Math.PI * 2);
          ctx.ellipse(gx + 10, gy + 8, 8, 5, -0.2, 0, Math.PI * 2);
          ctx.fill();

          // Top platform brass bar
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx + 4, p.y, p.w - 8, 12);
          ctx.fillStyle = '#ca8a04';
          ctx.fillRect(sx, p.y + 12, p.w, 4);
          break;
        }

        case 'kite_frame': {
          // 6/12 Pipa Encantada de Bambu
          ctx.fillStyle = '#fde047';
          ctx.fillRect(sx, p.y, p.w, 10);

          const kx = sx + p.w / 2;
          const ky = p.y + 24;
          ctx.save();
          // 4 vivid segments
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.moveTo(kx, ky - 18);
          ctx.lineTo(kx + p.w / 2 - 6, ky);
          ctx.lineTo(kx, ky);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.moveTo(kx, ky - 18);
          ctx.lineTo(kx - p.w / 2 + 6, ky);
          ctx.lineTo(kx, ky);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.moveTo(kx, ky);
          ctx.lineTo(kx - p.w / 2 + 6, ky);
          ctx.lineTo(kx, ky + 32);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.moveTo(kx, ky);
          ctx.lineTo(kx + p.w / 2 - 6, ky);
          ctx.lineTo(kx, ky + 32);
          ctx.closePath();
          ctx.fill();

          // Bamboo crossed struts
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(kx, ky - 18);
          ctx.lineTo(kx, ky + 32);
          ctx.moveTo(kx - p.w / 2 + 6, ky);
          ctx.lineTo(kx + p.w / 2 - 6, ky);
          ctx.stroke();

          // Trailing ribbon tail
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          const sway = Math.sin(tick * 0.12) * 8;
          ctx.moveTo(kx, ky + 32);
          ctx.quadraticCurveTo(kx + sway, ky + 55, kx - sway * 0.5, ky + 80);
          ctx.stroke();

          ctx.fillStyle = '#fb923c';
          ctx.fillRect(kx + sway * 0.5 - 4, ky + 46, 8, 4);
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(kx - 4, ky + 66, 8, 4);
          ctx.restore();
          break;
        }

        case 'floating_books': {
          // 7/12 Livro de Gravuras Flutuante
          ctx.fillStyle = '#831843';
          ctx.beginPath();
          ctx.roundRect(sx, p.y, p.w, 14, [4, 4, 2, 2]);
          ctx.fill();

          // Gilded page block
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx + 6, p.y + 3, p.w - 12, 8);

          // Open parchment pages
          ctx.fillStyle = '#fdf4ff';
          ctx.fillRect(sx + 8, p.y + 4, (p.w - 20) / 2, 6);
          ctx.fillRect(sx + p.w / 2 + 2, p.y + 4, (p.w - 20) / 2, 6);

          // Spine ribbing
          ctx.fillStyle = '#500724';
          ctx.fillRect(sx + p.w / 2 - 3, p.y, 6, 14);

          // Trailing golden bookmark ribbon
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(sx + p.w / 2, p.y + 12);
          ctx.quadraticCurveTo(sx + p.w / 2 + 8, p.y + 35, sx + p.w / 2 - 4, p.y + 50);
          ctx.stroke();

          // Floating fairy runes
          ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
          ctx.font = '10px sans-serif';
          ctx.fillText('✧', sx + 12, p.y - 6);
          ctx.fillText('✦', sx + p.w - 18, p.y - 8);
          break;
        }

        case 'chandelier_crystals': {
          // 8/12 Lustre de Cristais
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx, p.y, p.w, 12);
          ctx.fillStyle = '#ca8a04';
          ctx.fillRect(sx, p.y + 12, p.w, 5);

          // Hanging multifaceted crystals
          for (let cx = sx + 8; cx <= sx + p.w - 8; cx += 13) {
            ctx.fillStyle = 'rgba(224, 242, 254, 0.88)';
            ctx.strokeStyle = '#bae6fd';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx, p.y + 17);
            ctx.lineTo(cx + 4, p.y + 28);
            ctx.lineTo(cx, p.y + 36);
            ctx.lineTo(cx - 4, p.y + 28);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          // Candle flames
          const flame = Math.sin(tick * 0.25) * 2;
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.ellipse(sx + 14, p.y - 6, 3, 5 + flame, 0, 0, Math.PI * 2);
          ctx.ellipse(sx + p.w - 14, p.y - 6, 3, 5 + flame, 0, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'curtain_rod': {
          // 9/12 Varão de Cortina Estrelada
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx, p.y, p.w, 10);
          ctx.fillStyle = '#b45309';
          ctx.fillRect(sx, p.y + 10, p.w, 4);

          // Golden finials
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(sx - 4, p.y + 5, 7, 0, Math.PI * 2);
          ctx.arc(sx + p.w + 4, p.y + 5, 7, 0, Math.PI * 2);
          ctx.fill();

          // Velvet curtain swag
          ctx.fillStyle = '#1e1b4b';
          ctx.beginPath();
          ctx.moveTo(sx + 4, p.y + 14);
          ctx.quadraticCurveTo(sx + p.w / 2, p.y + 44, sx + p.w - 4, p.y + 14);
          ctx.lineTo(sx + p.w - 4, p.y + 56);
          ctx.quadraticCurveTo(sx + p.w / 2, p.y + 76, sx + 4, p.y + 56);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#fde047';
          ctx.font = '10px sans-serif';
          ctx.fillText('★', sx + p.w / 2 - 5, p.y + 40);
          break;
        }

        case 'cuckoo_clock': {
          // 10/12 Relógio Cuco Vintage
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx, p.y, p.w, 12);
          ctx.fillStyle = '#92400e';
          ctx.fillRect(sx + 6, p.y + 12, p.w - 12, p.h - 12);

          // Clock face
          ctx.fillStyle = '#fef3c7';
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 40, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Hands
          ctx.strokeStyle = '#18181b';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(sx + p.w / 2, p.y + 40);
          ctx.lineTo(sx + p.w / 2, p.y + 29);
          ctx.moveTo(sx + p.w / 2, p.y + 40);
          ctx.lineTo(sx + p.w / 2 + 7, p.y + 40);
          ctx.stroke();

          // Bird door
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx + p.w / 2 - 8, p.y + 14, 16, 11);
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(sx + p.w / 2, p.y + 19, 4, 0, Math.PI * 2);
          ctx.fill();

          // Swinging pendulum
          const pendAngle = Math.sin(tick * 0.08) * 0.28;
          const pendLen = 30;
          const px = sx + p.w / 2 + Math.sin(pendAngle) * pendLen;
          const py = p.y + 62 + Math.cos(pendAngle) * pendLen;
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(sx + p.w / 2, p.y + 62);
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(px, py, 5.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'wardrobe_ledge': {
          // 11/12 Beiral do Grande Guarda-Roupa (Antes do Clímax)
          ctx.fillStyle = '#451a03';
          ctx.fillRect(sx, p.y, p.w, p.h);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(sx - 4, p.y, p.w + 8, 10);

          // Brass corner reinforcements
          ctx.fillStyle = '#eab308';
          ctx.fillRect(sx, p.y + 10, 8, 8);
          ctx.fillRect(sx + p.w - 8, p.y + 10, 8, 8);

          // Climax warning text
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚡ SALTO FINAL ➔', sx + p.w / 2, p.y - 12);
          break;
        }

        case 'grand_portal_pedestal': {
          // 12/12 O Portal dos Sonhos (O Clímax Alcançado!)
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(sx, p.y, p.w, p.h);

          // Upper golden terrace
          ctx.fillStyle = '#facc15';
          ctx.fillRect(sx - 8, p.y - 4, p.w + 16, 12);
          ctx.fillStyle = '#ca8a04';
          ctx.fillRect(sx - 4, p.y + 8, p.w + 8, 8);

          // Gilded Mana Runes along the terrace
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2;
          ctx.strokeRect(sx + 12, p.y + 22, p.w - 24, 30);

          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 13px Palatino, Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillText('✧   O   GRANDE   PORTAL   DOS   SONHOS   ✧', sx + p.w / 2, p.y + 42);

          // Beacon pillars on both sides
          const torchLeftX = sx + 22;
          const torchRightX = sx + p.w - 22;
          [torchLeftX, torchRightX].forEach(tx => {
            ctx.fillStyle = '#78350f';
            ctx.fillRect(tx - 6, p.y - 28, 12, 28);
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(tx, p.y - 32, 9, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }

        default: {
          ctx.fillStyle = '#1c1924';
          ctx.fillRect(sx, p.y, p.w, p.h);
          break;
        }
      }

      // Little sparkling indicator for next target
      if (idx === baby.currentPlatformIndex + 1) {
        const bounce = Math.sin(tick * 0.1) * 4;
        ctx.fillStyle = '#fef08a';
        ctx.font = '16px sans-serif';
        ctx.fillText('▼', sx + p.w / 2 - 6, p.y - 16 + bounce);
      }
    });
    ctx.restore();
  }

  // --- EXIT DOOR (PORTA MÁGICA DOS SONHOS) ---
  function drawExitDoor(camX) {
    const sx = exitDoor.x - camX;
    if (sx < -180 || sx > canvas.width + 180) return;

    ctx.save();

    const pulse = Math.sin(tick * 0.05) * 18;
    const glow = ctx.createRadialGradient(
      sx + exitDoor.w / 2, exitDoor.y + exitDoor.h / 2, 12,
      sx + exitDoor.w / 2, exitDoor.y + exitDoor.h / 2, 140 + pulse
    );
    glow.addColorStop(0, 'rgba(255, 240, 160, 0.95)');
    glow.addColorStop(0.35, 'rgba(255, 80, 200, 0.55)');
    glow.addColorStop(0.7, 'rgba(0, 230, 255, 0.3)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(sx - 100, exitDoor.y - 80, exitDoor.w + 200, exitDoor.h + 160);

    // Carved door frame
    ctx.fillStyle = '#db2777';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.roundRect(sx, exitDoor.y, exitDoor.w, exitDoor.h, [42, 42, 6, 6]);
    ctx.fill();
    ctx.stroke();

    // Stained glass arch
    const vitral = ctx.createLinearGradient(sx, exitDoor.y, sx, exitDoor.y + exitDoor.h);
    vitral.addColorStop(0, '#fde047');
    vitral.addColorStop(0.3, '#f43f5e');
    vitral.addColorStop(0.65, '#8b5cf6');
    vitral.addColorStop(1, '#06b6d4');
    ctx.fillStyle = vitral;
    ctx.beginPath();
    ctx.roundRect(sx + 8, exitDoor.y + 12, exitDoor.w - 16, exitDoor.h - 18, [34, 34, 4, 4]);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '22px sans-serif';
    ctx.fillText('✨', sx + exitDoor.w / 2 - 12, exitDoor.y + 40);
    ctx.fillText('🌿', sx + exitDoor.w / 2 - 12, exitDoor.y + 82);

    ctx.restore();
  }

  // --- BABY MANA SPRITE ---
  function drawBabyManaStyle(camX) {
    ctx.save();
    const bx = baby.x - camX;
    const by = baby.y;
    const t = baby.animTime;
    const stepSwing = Math.sin(t);
    const bob = baby.onGround ? Math.abs(Math.sin(t * 2)) * 3 : 0;
    const tilt = baby.onGround ? Math.sin(t) * 0.08 : -0.15;

    ctx.translate(bx + baby.w / 2, by + baby.h / 2 + bob);
    ctx.rotate(tilt);

    const legLeftAngle = baby.onGround ? stepSwing * 0.6 : 0.4;
    const legRightAngle = baby.onGround ? -stepSwing * 0.6 : -0.5;

    ctx.save();
    ctx.translate(-6, 10);
    ctx.rotate(legLeftAngle);
    ctx.fillStyle = '#ffd000';
    ctx.strokeStyle = '#c98a00';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 5, 4.2, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(1.5, 10, 4.5, 3.2, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(6, 10);
    ctx.rotate(legRightAngle);
    ctx.fillStyle = '#ffd000';
    ctx.strokeStyle = '#c98a00';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 5, 4.2, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(1.5, 10, 4.5, 3.2, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Body & tunic
    const bodyGrad = ctx.createLinearGradient(-12, -4, 12, 12);
    bodyGrad.addColorStop(0, '#ff2a85');
    bodyGrad.addColorStop(1, '#d80064');
    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = '#8a003d';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(0, 2, 12.5, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, -2, 9.5, 0.3, Math.PI - 0.3);
    ctx.stroke();

    ctx.strokeStyle = '#ffea00';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, 3, 10.5, 0.3, Math.PI - 0.3);
    ctx.stroke();

    const armSwing = baby.onGround ? Math.cos(t) * 0.5 : 0.8;
    ctx.fillStyle = '#ff3d94';
    ctx.strokeStyle = '#8a003d';
    ctx.lineWidth = 1.2;

    ctx.save();
    ctx.translate(-10, -2);
    ctx.rotate(-armSwing);
    ctx.beginPath();
    ctx.ellipse(0, 4, 3.5, 5.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffe0cb';
    ctx.beginPath();
    ctx.arc(0, 9, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(10, -2);
    ctx.rotate(armSwing);
    ctx.fillStyle = '#ff3d94';
    ctx.beginPath();
    ctx.ellipse(0, 4, 3.5, 5.5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffe0cb';
    ctx.beginPath();
    ctx.arc(0, 9, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Face
    const faceGrad = ctx.createRadialGradient(0, -11, 2, 0, -11, 14);
    faceGrad.addColorStop(0, '#fff1e6');
    faceGrad.addColorStop(0.85, '#fcd2be');
    faceGrad.addColorStop(1, '#f7bca1');
    ctx.fillStyle = faceGrad;
    ctx.strokeStyle = '#9c5a3d';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, -11, 12.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Blushing cheeks
    ctx.fillStyle = 'rgba(255, 60, 110, 0.45)';
    ctx.beginPath();
    ctx.arc(-7.5, -8, 3.8, 0, Math.PI * 2);
    ctx.arc(7.5, -8, 3.8, 0, Math.PI * 2);
    ctx.fill();

    // Big anime eyes
    ctx.fillStyle = '#21102e';
    ctx.beginPath();
    ctx.ellipse(-4.5, -12, 3.2, 4.2, 0, 0, Math.PI * 2);
    ctx.ellipse(4.5, -12, 3.2, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.ellipse(-4.5, -11, 2.2, 2.6, 0, 0, Math.PI * 2);
    ctx.ellipse(4.5, -11, 2.2, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-5.6, -13.5, 1.4, 0, Math.PI * 2);
    ctx.arc(3.4, -13.5, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Cute smile
    ctx.strokeStyle = '#c0264b';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, -6, 2.4, 0.1, Math.PI - 0.1);
    ctx.stroke();

    // Mana hair
    ctx.fillStyle = '#8b5cf6';
    ctx.strokeStyle = '#4c1d95';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, -17, 10, Math.PI * 0.9, Math.PI * 2.1);
    ctx.quadraticCurveTo(8, -25, -2, -26);
    ctx.quadraticCurveTo(-11, -24, -9, -17);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Hairband
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.roundRect(-9.5, -19, 19, 3.5, 2);
    ctx.fill();

    ctx.restore();
  }

  // --- ORGANIC FAIRY FLIGHT, GUIDANCE & PARTICLES ---
  function drawFairy(camX) {
    ctx.save();

    // Draw fairy magic dust particles
    fairy.particles.forEach((p) => {
      ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${p.life})`;
      ctx.beginPath();
      ctx.arc(p.x - camX, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    });

    const fx = fairy.x - camX;
    const fy = fairy.y;

    // Golden & Cyan Aura Halo
    const haloRadius = 16 + Math.sin(fairy.floatAngle * 3) * 3;
    const fairyAura = ctx.createRadialGradient(fx, fy, 2, fx, fy, haloRadius);
    fairyAura.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
    fairyAura.addColorStop(0.5, 'rgba(236, 72, 153, 0.45)');
    fairyAura.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = fairyAura;
    ctx.beginPath();
    ctx.arc(fx, fy, haloRadius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle guide sparkles pointing toward the next platform
    if (tick % 4 === 0) {
      const nextP = platforms[baby.currentPlatformIndex + 1];
      if (nextP) {
        const guideAngle = Math.atan2((nextP.y - 20) - fairy.y, (nextP.x + 30) - fairy.x);
        const gDist = 12 + Math.random() * 18;
        ctx.fillStyle = 'rgba(250, 204, 21, 0.8)';
        ctx.beginPath();
        ctx.arc(
          fx + Math.cos(guideAngle) * gDist + (Math.random() - 0.5) * 6,
          fy + Math.sin(guideAngle) * gDist + (Math.random() - 0.5) * 6,
          1.6, 0, Math.PI * 2
        );
        ctx.fill();
      }
    }

    // Wings with rapid dynamic flutter tied to speed
    const flutterSpeed = 0.35 + Math.hypot(fairy.vx, fairy.vy) * 0.15;
    const wingFlap = Math.sin(fairy.flutterPhase) * 10;

    // Translucent gossamer wings
    ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
    ctx.beginPath();
    // Top wings
    ctx.ellipse(fx - 4, fy - 6, 9, 3.5 + Math.abs(wingFlap), -0.4, 0, Math.PI * 2);
    ctx.ellipse(fx + 4, fy - 6, 9, 3.5 + Math.abs(wingFlap), 0.4, 0, Math.PI * 2);
    // Lower secondary wings
    ctx.ellipse(fx - 5, fy + 3, 6, 2.2 + Math.abs(wingFlap) * 0.7, 0.35, 0, Math.PI * 2);
    ctx.ellipse(fx + 5, fy + 3, 6, 2.2 + Math.abs(wingFlap) * 0.7, -0.35, 0, Math.PI * 2);
    ctx.fill();

    // Wing edge sparkles
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fx - 9, fy - 7 - Math.abs(wingFlap) * 0.5, 1.4, 0, Math.PI * 2);
    ctx.arc(fx + 9, fy - 7 - Math.abs(wingFlap) * 0.5, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Fairy golden glowing head
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(fx, fy - 3, 4.8, 0, Math.PI * 2);
    ctx.fill();

    // Fairy dress / tunic
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(fx, fy - 1);
    ctx.lineTo(fx + 5, fy + 9);
    ctx.lineTo(fx - 5, fy + 9);
    ctx.closePath();
    ctx.fill();

    // Fairy tiny magic wand pointing ahead
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(fx + 3, fy + 3);
    ctx.lineTo(fx + 11, fy + 1);
    ctx.stroke();
    // Wand star tip
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fx + 12, fy + 1, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Cutscene Step 1: Investigative curiosity sparkles & question mark
    if (cutsceneActive && cutsceneStep === 1) {
      const qFloat = Math.sin(tick * 0.12) * 3;
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('?', fx + 9, fy - 12 + qFloat);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(fx - 10, fy - 10 - qFloat, 1.5, 0, Math.PI * 2);
      ctx.arc(fx + 16, fy - 6 + qFloat, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cutscene Step 2: Guiding beam pointing to the exit ("A saída é logo ali!")
    if (cutsceneActive && cutsceneStep === 2) {
      const beamGrad = ctx.createLinearGradient(fx + 12, fy + 1, fx + 220, fy + 1);
      beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
      beamGrad.addColorStop(0.3, 'rgba(236, 72, 153, 0.7)');
      beamGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.strokeStyle = beamGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(fx + 12, fy + 1);
      ctx.lineTo(fx + 220, fy + 1);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(fx + 12, fy + 1, 3.2, 0, Math.PI * 2);
      ctx.fill();

      const noteBob = Math.sin(tick * 0.16) * 4;
      ctx.fillStyle = '#f472b6';
      ctx.font = '13px sans-serif';
      ctx.fillText('♪', fx - 14, fy - 15 + noteBob);
      ctx.fillText('♫', fx + 18, fy - 18 - noteBob);
    }

    ctx.restore();
  }

  // --- ATMOSPHERIC DYNAMIC LIGHTING ---
  function applyDarkAtmosphereWithLights(camX) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';

    const darkCanvas = document.createElement('canvas');
    darkCanvas.width = canvas.width;
    darkCanvas.height = canvas.height;
    const dctx = darkCanvas.getContext('2d');

    dctx.fillStyle = '#0a0812';
    dctx.fillRect(0, 0, canvas.width, canvas.height);
    dctx.globalCompositeOperation = 'destination-out';

    // Light around baby
    const bx = baby.x - camX + baby.w / 2;
    const by = baby.y + baby.h / 2;
    const babyLight = dctx.createRadialGradient(bx, by, 12, bx, by, 170);
    babyLight.addColorStop(0, 'rgba(0,0,0,0.95)');
    babyLight.addColorStop(0.5, 'rgba(0,0,0,0.65)');
    babyLight.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = babyLight;
    dctx.beginPath();
    dctx.arc(bx, by, 170, 0, Math.PI * 2);
    dctx.fill();

    // Vibrant light aura around the fairy
    const fx = fairy.x - camX;
    const fy = fairy.y;
    const fairyLight = dctx.createRadialGradient(fx, fy, 8, fx, fy, 160);
    fairyLight.addColorStop(0, 'rgba(0,0,0,0.96)');
    fairyLight.addColorStop(0.4, 'rgba(0,0,0,0.75)');
    fairyLight.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = fairyLight;
    dctx.beginPath();
    dctx.arc(fx, fy, 160, 0, Math.PI * 2);
    dctx.fill();

    // Exit door beacon light
    const px = exitDoor.x - camX + exitDoor.w / 2;
    const py = exitDoor.y + exitDoor.h / 2;
    const doorLight = dctx.createRadialGradient(px, py, 20, px, py, 280);
    doorLight.addColorStop(0, 'rgba(0,0,0,1)');
    doorLight.addColorStop(0.6, 'rgba(0,0,0,0.7)');
    doorLight.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = doorLight;
    dctx.beginPath();
    dctx.arc(px, py, 280, 0, Math.PI * 2);
    dctx.fill();

    // Mushroom lamp glow
    const mushPlat = platforms.find(p => p.style === 'mushroom_lamp');
    if (mushPlat) {
      const mx = mushPlat.x - camX + mushPlat.w / 2;
      const my = mushPlat.y + 12;
      const mushLight = dctx.createRadialGradient(mx, my, 6, mx, my, 90);
      mushLight.addColorStop(0, 'rgba(0,0,0,0.85)');
      mushLight.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = mushLight;
      dctx.beginPath();
      dctx.arc(mx, my, 90, 0, Math.PI * 2);
      dctx.fill();
    }

    ctx.drawImage(darkCanvas, 0, 0);

    // Warm atmospheric vignette
    const vignette = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, canvas.width * 0.35,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.65
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(3,2,6,0.8)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();
  }

  // --- SPEED RIBBONS & TRAIL EFFECTS ---
  function drawSpeedRibbons(camX) {
    ctx.save();
    for (let i = speedRibbons.length - 1; i >= 0; i--) {
      const r = speedRibbons[i];
      r.x += r.vx;
      r.y += r.vy;
      r.life -= r.decay;
      if (r.life <= 0) {
        speedRibbons.splice(i, 1);
        continue;
      }
      ctx.fillStyle = r.color;
      ctx.globalAlpha = r.life * 0.85;
      ctx.beginPath();
      ctx.arc(r.x - camX, r.y, r.size * r.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- ESCAPE MODE HUD BANNER & SPEED LINES ---
  function drawEscapeBanner() {
    if (!isEscapeMode) return;

    ctx.save();
    // Top right urgency badge with progressive jump meter
    const badgeW = 250;
    const badgeH = 42;
    const badgeX = canvas.width - badgeW - 16;
    const badgeY = 14;

    ctx.fillStyle = 'rgba(15, 12, 24, 0.90)';
    ctx.strokeStyle = escapeLevel >= 11 ? '#fde047' : '#f59e0b';
    ctx.lineWidth = escapeLevel >= 11 ? 2.2 : 1.5;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = escapeLevel >= 11 ? '#fde047' : '#fef08a';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`⚡ FUGA: PULO NÍVEL ${escapeLevel + 1}/12`, badgeX + 14, badgeY + 18);

    // Mini progress bar for jump evolution
    const pBarX = badgeX + 14;
    const pBarY = badgeY + 25;
    const pBarW = badgeW - 28;
    const pBarH = 6;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.fillRect(pBarX, pBarY, pBarW, pBarH);

    const progFill = ((escapeLevel + 1) / 12) * pBarW;
    const barGrad = ctx.createLinearGradient(pBarX, pBarY, pBarX + pBarW, pBarY);
    barGrad.addColorStop(0, '#38bdf8');
    barGrad.addColorStop(0.5, '#facc15');
    barGrad.addColorStop(1, '#ec4899');
    ctx.fillStyle = barGrad;
    ctx.fillRect(pBarX, pBarY, progFill, pBarH);

    // Initial / Level-up powerup banner
    if (escapeBannerTimer > 0) {
      escapeBannerTimer--;
      const alpha = Math.min(1.0, escapeBannerTimer / 30);
      ctx.fillStyle = `rgba(0, 0, 0, ${0.55 * alpha})`;
      ctx.fillRect(0, 66, canvas.width, 54);

      ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
      ctx.font = 'bold 20px Palatino, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(escapeBannerText, canvas.width / 2, 100);
    }

    // Dynamic wind speed streaks across screen scaling with scroll speed
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + Math.min(0.16, (escapeLevel / 11) * 0.14)})`;
    ctx.lineWidth = 1.4 + (escapeLevel / 11) * 0.8;
    const speedTime = tick * (12 + currentScrollSpeed * 3);
    const streakCount = 5 + Math.floor(escapeLevel * 0.4);
    for (let i = 0; i < streakCount; i++) {
      const sx = (speedTime + i * 140) % (canvas.width + 220) - 100;
      const sy = 50 + i * 65;
      const streakLen = 60 + currentScrollSpeed * 18;
      ctx.beginPath();
      ctx.moveTo(canvas.width - sx, sy);
      ctx.lineTo(canvas.width - sx - streakLen, sy);
      ctx.stroke();
    }

    // Warning left-edge night shadow if baby is lagging behind the accelerated camera
    const distToLeft = baby.x - cameraX;
    if (distToLeft < 170) {
      const danger = (170 - distToLeft) / 170;
      const shadowGrad = ctx.createLinearGradient(0, 0, 130, 0);
      shadowGrad.addColorStop(0, `rgba(220, 38, 38, ${0.48 * danger})`);
      shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(0, 0, 130, canvas.height);
    }

    ctx.restore();
  }

  // --- CUTSCENE DIALOGUE WINDOW & CINEMATIC BARS ---
  function drawCutsceneDialogue() {
    if (!cutsceneActive) return;

    ctx.save();
    // 1. Cinematic letterbox bars
    ctx.fillStyle = '#06040a';
    ctx.fillRect(0, 0, canvas.width, 46);
    ctx.fillRect(0, canvas.height - 46, canvas.width, 46);

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 46);
    ctx.lineTo(canvas.width, 46);
    ctx.moveTo(0, canvas.height - 46);
    ctx.lineTo(canvas.width, canvas.height - 46);
    ctx.stroke();

    // 2. Dialogue Box
    const boxW = Math.min(canvas.width - 80, 800);
    const boxH = 114;
    const boxX = (canvas.width - boxW) / 2;
    const boxY = canvas.height - 150;

    const bgGrad = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxH);
    bgGrad.addColorStop(0, 'rgba(26, 20, 38, 0.96)');
    bgGrad.addColorStop(1, 'rgba(13, 9, 20, 0.98)');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 12);
    ctx.fill();

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(boxX + 4, boxY + 4, boxW - 8, boxH - 8, 8);
    ctx.stroke();

    // Corner decorative gems
    const corners = [
      { x: boxX + 8, y: boxY + 8 },
      { x: boxX + boxW - 8, y: boxY + 8 },
      { x: boxX + 8, y: boxY + boxH - 8 },
      { x: boxX + boxW - 8, y: boxY + boxH - 8 }
    ];
    ctx.fillStyle = '#facc15';
    corners.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Fairy Portrait (Left side)
    const portX = boxX + 54;
    const portY = boxY + boxH / 2 - 4;
    const portR = 34;

    const portGlow = ctx.createRadialGradient(portX, portY, 8, portX, portY, portR + 4);
    portGlow.addColorStop(0, '#fef08a');
    portGlow.addColorStop(0.5, '#ec4899');
    portGlow.addColorStop(1, '#06b6d4');
    ctx.fillStyle = portGlow;
    ctx.beginPath();
    ctx.arc(portX, portY, portR + 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e1429';
    ctx.beginPath();
    ctx.arc(portX, portY, portR, 0, Math.PI * 2);
    ctx.fill();

    // Fairy portrait avatar
    const portWing = Math.sin(tick * 0.4) * 8;
    ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
    ctx.beginPath();
    ctx.ellipse(portX - 10, portY - 6, 11, 4 + Math.abs(portWing), -0.3, 0, Math.PI * 2);
    ctx.ellipse(portX + 10, portY - 6, 11, 4 + Math.abs(portWing), 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(portX, portY - 2, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4c1d95';
    ctx.beginPath();
    ctx.arc(portX - 3.5, portY - 3, 1.6, 0, Math.PI * 2);
    ctx.arc(portX + 3.5, portY - 3, 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#db2777';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(portX, portY - 1, 3.5, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(portX + 14, portY + 6, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 11px Palatino, Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ FADINHA ✦', portX, boxY + boxH - 10);

    // 4. Text lines
    const textX = boxX + 114;
    const textY = boxY + 36;
    ctx.textAlign = 'left';

    if (cutsceneStep === 1) {
      ctx.fillStyle = '#fef9c3';
      ctx.font = '16px Palatino, Georgia, serif';
      ctx.fillText('"O quarto está escuro, mas lá fora temos muita coisa pra ver.', textX, textY);
      ctx.fillText('Vamos logo sair daqui. Não aguento essa bagunça! Quem fez tudo isso?"', textX, textY + 26);
    } else if (cutsceneStep === 2) {
      ctx.fillStyle = '#fef9c3';
      ctx.font = '16px Palatino, Georgia, serif';
      ctx.fillText('"Claro que fomos nós duas brincando! ', textX, textY);
      const prefixWidth = ctx.measureText('"Claro que fomos nós duas brincando! ').width;
      ctx.fillStyle = '#f472b6';
      ctx.font = 'bold 16px Palatino, Georgia, serif';
      ctx.fillText('*risos*', textX + prefixWidth, textY);
      ctx.fillStyle = '#fef9c3';
      ctx.font = '16px Palatino, Georgia, serif';
      ctx.fillText('. Mas não vamos mais perder tempo.', textX + prefixWidth + 50, textY);
      ctx.fillStyle = '#fde047';
      ctx.fillText('A saída é logo ali."', textX, textY + 26);
    }

    // 5. Prompt to advance
    const blink = Math.sin(tick * 0.1) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(253, 224, 71, ${blink})`;
    ctx.font = 'bold 12.5px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Toque para continuar ➔', boxX + boxW - 20, boxY + boxH - 14);

    ctx.restore();
  }

  // --- GAME UPDATE LOOP ---
  function update() {
    tick++;
    if (gameWon) return;

    // --- CUTSCENE SEQUENCER ---
    if (cutsceneActive) {
      cutsceneTimer++;
      targetCameraZoom = 1.45;
      cameraZoom += (targetCameraZoom - cameraZoom) * 0.08;

      // Focus camera between fairy and baby
      const cutsceneCamTarget = (baby.x + fairy.x) / 2 - 200;
      cameraX += (cutsceneCamTarget - cameraX) * 0.08;

      if (cutsceneStep === 1) {
        // Fairy flies above the child's head, looking around investigatively
        fairy.investigateAngle = (fairy.investigateAngle || 0) + 0.038;
        const targetHoverX = baby.x + Math.sin(fairy.investigateAngle * 1.5) * 55;
        const targetHoverY = baby.y - 44 + Math.cos(fairy.investigateAngle * 3.0) * 14;

        fairy.vx += (targetHoverX - fairy.x) * 0.08;
        fairy.vy += (targetHoverY - fairy.y) * 0.08;
        fairy.vx *= 0.85;
        fairy.vy *= 0.85;
        fairy.x += fairy.vx;
        fairy.y += fairy.vy;
        fairy.flutterPhase += 0.35;

        if (tick % 3 === 0) {
          spawnFairySparkles(fairy.x, fairy.y, 1);
        }
        if (cutsceneTimer > 450) {
          advanceCutscene();
        }
      } else if (cutsceneStep === 2) {
        // Fairy hovers to the right of baby pointing wand to the right
        fairy.flutterPhase += 0.45;
        const targetHoverX = baby.x + 65;
        const targetHoverY = baby.y - 42;

        fairy.vx += (targetHoverX - fairy.x) * 0.08;
        fairy.vy += (targetHoverY - fairy.y) * 0.08;
        fairy.vx *= 0.85;
        fairy.vy *= 0.85;
        fairy.x += fairy.vx;
        fairy.y += fairy.vy;

        if (tick % 2 === 0) {
          spawnFairySparkles(fairy.x, fairy.y, 2);
        }
        if (cutsceneTimer > 420) {
          finishCutscene();
        }
      }

      // Update fairy particles during cutscene
      for (let i = fairy.particles.length - 1; i >= 0; i--) {
        const p = fairy.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          fairy.particles.splice(i, 1);
        }
      }

      return;
    }

    // Ease camera zoom back to normal after cutscene
    targetCameraZoom = 1.0;
    cameraZoom += (targetCameraZoom - cameraZoom) * 0.08;

    // Baby physics
    baby.x += baby.vx;
    baby.animTime += 0.15;
    baby.vy += baby.gravity;
    baby.y += baby.vy;

    // Spawn long jump speed ribbons scaling with escape level
    if (isEscapeMode && !baby.onGround) {
      const ribbonRate = escapeLevel >= 8 ? 1 : 2;
      if (tick % ribbonRate === 0) {
        const stats = getEscapeStats(escapeLevel);
        const palette = ['#facc15', '#38bdf8', '#f472b6', '#a855f7', '#34d399'];
        const chosenColor = palette[Math.floor(Math.random() * Math.min(palette.length, 2 + Math.floor(escapeLevel / 3)))];
        for (let s = 0; s < stats.trailIntensity; s++) {
          speedRibbons.push({
            x: baby.x + 4 + Math.random() * 8,
            y: baby.y + baby.h - 6 + (Math.random() - 0.5) * 6,
            vx: -baby.vx * (0.35 + Math.random() * 0.25),
            vy: (Math.random() - 0.5) * 1.5,
            size: 3.5 + Math.random() * (3 + escapeLevel * 0.35),
            color: chosenColor,
            life: 1.0,
            decay: 0.038
          });
        }
      }
    }

    // --- ORGANIC FAIRY BEHAVIOR & GUIDING SYSTEM ---
    fairy.floatAngle += 0.05;
    fairy.flutterPhase += 0.35;

    // Target scouting calculation
    const nextIndex = baby.currentPlatformIndex + 1;
    let targetX, targetY;

    if (nextIndex < platforms.length) {
      const nextPlat = platforms[nextIndex];
      const isCloseToNext = (baby.x > nextPlat.x - 120);
      if (isCloseToNext) {
        targetX = nextPlat.x + 35;
        targetY = nextPlat.y - 45;
      } else {
        targetX = baby.x + (isEscapeMode ? 80 : 65);
        targetY = baby.y - 50;
      }
    } else {
      targetX = exitDoor.x + 30;
      targetY = exitDoor.y + 40;
    }

    // Erratic micro-darts simulating insect / sprite curiosity
    fairy.dartTimer--;
    if (fairy.dartTimer <= 0) {
      fairy.dartTimer = 60 + Math.floor(Math.random() * 80);
      fairy.dartOffsetX = (Math.random() - 0.5) * 26;
      fairy.dartOffsetY = (Math.random() - 0.5) * 18;
    }

    // Multi-harmonic organic floating oscillations
    const organicOscY =
      Math.sin(fairy.floatAngle * 2.8) * 8 +
      Math.cos(fairy.floatAngle * 4.9) * 4 +
      Math.sin(fairy.floatAngle * 1.2) * 6;

    const organicOscX =
      Math.cos(fairy.floatAngle * 2.1) * 7 +
      Math.sin(fairy.floatAngle * 3.6) * 3;

    const finalTargetX = targetX + organicOscX + fairy.dartOffsetX;
    const finalTargetY = targetY + organicOscY + fairy.dartOffsetY;

    fairy.vx += (finalTargetX - fairy.x) * 0.045;
    fairy.vy += (finalTargetY - fairy.y) * 0.045;
    fairy.vx *= 0.86;
    fairy.vy *= 0.86;

    fairy.x += fairy.vx;
    fairy.y += fairy.vy;

    if (tick % 2 === 0) {
      spawnFairySparkles(fairy.x, fairy.y, 1);
    }

    for (let i = fairy.particles.length - 1; i >= 0; i--) {
      const p = fairy.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) {
        fairy.particles.splice(i, 1);
      }
    }

    // --- PLATFORM COLLISION & LANDING ---
    let landedIdx = -1;
    for (let i = 0; i < platforms.length; i++) {
      const p = platforms[i];
      if (
        baby.x + baby.w > p.x &&
        baby.x < p.x + p.w &&
        baby.y + baby.h >= p.y &&
        baby.y + baby.h <= p.y + 16 &&
        baby.vy >= 0
      ) {
        landedIdx = i;
        break;
      }
    }

    if (landedIdx !== -1) {
      baby.y = platforms[landedIdx].y - baby.h;
      baby.vy = 0;
      baby.onGround = true;
      baby.currentPlatformIndex = landedIdx;

      // Re-establish horizontal speed upon landing and update progressive stats
      if (baby.isEscaping) {
        if (landedIdx >= 9) {
          const newLevel = Math.min(11, Math.max(0, landedIdx - 9));
          if (newLevel > escapeLevel) {
            escapeLevel = newLevel;
            const stats = getEscapeStats(escapeLevel);
            targetScrollSpeed = stats.scrollSpeed;
            baby.vx = stats.runVx;
            audio.playLevelUpChime(escapeLevel);
            spawnFairySparkles(baby.x + baby.w / 2, baby.y + baby.h / 2, 14 + escapeLevel * 2);

            if (escapeLevel === 11) {
              uiFeedback.innerText = '⚡ PULO MÁXIMO ATINGIDO! Salte no limite para alcançar o Portal!';
              uiFeedback.style.color = '#fde047';
              escapeBannerTimer = 160;
              escapeBannerText = '⚡ PULO MÁXIMO (NÍVEL 12/12): O GRANDE SALTO!';
            } else {
              uiFeedback.innerText = `⚡ Pulo Evoluído (Nível ${escapeLevel + 1}/12): Pulo mais alto e veloz!`;
              uiFeedback.style.color = '#fef08a';
            }
          } else {
            const stats = getEscapeStats(escapeLevel);
            baby.vx = stats.runVx;
            targetScrollSpeed = stats.scrollSpeed;
          }
        }
      }

      if (landedIdx === 0) {
        firstPlatformCleared = true;
      }

      // Cutscene Trigger: Topo do Castelo de Blocos (Plataforma 9)
      if (landedIdx === 9 && !cutsceneTriggered) {
        startCastleCutscene();
        return;
      }

      // Climax celebration when landing on the 12th escape platform (grand portal pedestal)
      if (landedIdx === 21) {
        spawnFairySparkles(baby.x + baby.w / 2, baby.y + baby.h / 2, 24);
      }
    } else if (baby.y + baby.h >= FLOOR_Y) {
      if (baby.currentPlatformIndex >= 0) {
        resetToStart(true);
        return;
      }

      baby.y = FLOOR_Y - baby.h;
      baby.vy = 0;
      baby.onGround = true;
      baby.currentPlatformIndex = -1;
    } else {
      baby.onGround = false;
    }

    // Check if walked past first platform without jumping
    const firstPlatform = platforms[0];
    if (!firstPlatformCleared && baby.x > firstPlatform.x + firstPlatform.w) {
      resetToStart(true);
      return;
    }

    if (baby.y > FLOOR_Y + 90) {
      resetToStart(true);
      return;
    }

    // Check victory condition at Exit Door
    if (baby.x >= exitDoor.x + 12) {
      gameWon = true;
      uiFeedback.innerText = 'A porta mágica se abriu! Toque para sonhar novamente.';
      uiFeedback.style.color = '#fef08a';
      audio.initAudio();
    }

    // Screen movement & Camera tracking
    if (isEscapeMode) {
      // Screen autoscrolls forward with gradual progression
      currentScrollSpeed += (targetScrollSpeed - currentScrollSpeed) * 0.05;
      cameraX += currentScrollSpeed;
      const targetCamX = baby.x - 170;
      if (targetCamX > cameraX) {
        cameraX += (targetCamX - cameraX) * 0.09;
      }

      // If player lags too far behind the moving screen, reset to castle checkpoint
      if (baby.x < cameraX - 25) {
        resetToStart(true);
        return;
      }
    } else {
      let targetCamX = baby.x - 180;
      if (targetCamX < 0) targetCamX = 0;
      cameraX += (targetCamX - cameraX) * 0.08;
    }
  }

  // --- RENDER ---
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Cinematic camera zoom during cutscene
    if (cameraZoom !== 1.0) {
      const focusX = (baby.x + fairy.x) / 2 - cameraX;
      const focusY = (baby.y + fairy.y) / 2;
      ctx.translate(focusX, focusY);
      ctx.scale(cameraZoom, cameraZoom);
      ctx.translate(-focusX, -focusY);
    }

    drawBackgroundWall(cameraX);
    drawSceneryItems(cameraX);
    drawPlatforms(cameraX);
    drawExitDoor(cameraX);
    drawSpeedRibbons(cameraX);
    drawFairy(cameraX);
    drawBabyManaStyle(cameraX);
    applyDarkAtmosphereWithLights(cameraX);

    ctx.restore();

    // UI overlays rendered in crisp screen coordinates
    drawEscapeBanner();
    drawCutsceneDialogue();

    if (gameWon) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 250, 240, 0.92)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#db2777';
      ctx.font = 'bold 30px Palatino, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('A SAÍDA DOS SONHOS FOI ALCANÇADA!', canvas.width / 2, canvas.height / 2 - 25);

      ctx.fillStyle = '#26242c';
      ctx.font = '17px Palatino, Georgia, serif';
      ctx.fillText('A menininha e a fada superaram o grande abismo e atravessaram o portal!', canvas.width / 2, canvas.height / 2 + 18);
      ctx.fillText('Toque na tela para brincar de novo.', canvas.width / 2, canvas.height / 2 + 56);
      ctx.restore();
    }
  }

  function loop() {
    update();
    render();
    requestAnimationFrame(loop);
  }

  bindInput({ doJump });

  return {
    start() {
      loop();
    },
    doJump,
    resetToStart
  };
}
