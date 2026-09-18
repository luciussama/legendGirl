import { GAME_CONFIG, FLOOR_Y, platforms, exitDoor, roomScenery, createBabyState, createFairyState } from './config.js';
import { createAudioSystem } from './audio.js';
import { bindInput } from './input.js';

export function createGame(canvas, uiFeedback) {
  const ctx = canvas.getContext('2d');
  const audio = createAudioSystem();
  const baby = createBabyState();
  const fairy = createFairyState();

  let cameraX = 0;
  let gameWon = false;
  let failMessageTimer = null;
  let firstPlatformCleared = false;

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

  function resetToStart(failedMidClimb = false) {
    baby.x = 60;
    baby.y = FLOOR_Y - baby.h;
    baby.vy = 0;
    baby.currentPlatformIndex = -1;
    baby.onGround = true;
    firstPlatformCleared = false;

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

    if (baby.onGround) {
      baby.vy = baby.jumpPower;
      baby.onGround = false;
      audio.playJumpSound();
    }
  }

  function drawManaCurve(x1, y1, cx, cy, x2, y2, color = '#383344', width = 2) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cx, cy, x2, y2);
    ctx.stroke();
  }

  function drawDetailedRoom(camX) {
    ctx.fillStyle = '#15131b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#221f2b';
    ctx.lineWidth = 1.5;
    for (let x = -100; x < canvas.width + 100; x += 110) {
      let sx = x - (camX * 0.18 % 110);
      ctx.beginPath();
      ctx.arc(sx + 40, 180, 50, Math.PI, 0);
      ctx.stroke();
      ctx.strokeRect(sx, 180, 80, 160);

      for (let bx = sx + 8; bx < sx + 74; bx += 11) {
        const bHeight = 25 + ((bx * 7) % 25);
        ctx.strokeRect(bx, 240 - bHeight, 8, bHeight);
      }
    }

    ctx.fillStyle = '#110f17';
    ctx.fillRect(0, FLOOR_Y, canvas.width, canvas.height - FLOOR_Y);
    ctx.strokeStyle = '#282433';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, FLOOR_Y);
    ctx.lineTo(canvas.width, FLOOR_Y);
    ctx.stroke();

    for (let x = -80; x < canvas.width + 80; x += 75) {
      const sx = x - (camX % 75);
      ctx.strokeStyle = '#201d2a';
      ctx.lineWidth = 1.6;
      drawManaCurve(sx, FLOOR_Y, sx - 20, FLOOR_Y + 35, sx - 40, canvas.height);
    }

    roomScenery.forEach((item) => {
      const sx = item.x - camX;
      if (sx < -140 || sx > canvas.width + 140) return;

      ctx.strokeStyle = '#3e374d';
      ctx.fillStyle = '#171520';
      ctx.lineWidth = 1.8;

      if (item.type === 'cradle') {
        ctx.strokeRect(sx, FLOOR_Y - 80, 95, 80);
        ctx.beginPath();
        ctx.arc(sx + 20, FLOOR_Y - 95, 18, 0, Math.PI * 2);
        ctx.arc(sx + 75, FLOOR_Y - 95, 18, 0, Math.PI * 2);
        ctx.stroke();
      } else if (item.type === 'windup_key') {
        ctx.beginPath();
        ctx.arc(sx, FLOOR_Y - 26, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeRect(sx - 4, FLOOR_Y - 16, 8, 16);
      } else if (item.type === 'jack_in_box') {
        ctx.strokeRect(sx - 16, FLOOR_Y - 32, 32, 32);
        ctx.beginPath();
        for (let m = 0; m < 5; m++) {
          ctx.lineTo(sx + (m % 2 === 0 ? -8 : 8), FLOOR_Y - 32 - m * 8);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(sx, FLOOR_Y - 76, 10, 0, Math.PI * 2);
        ctx.stroke();
      } else if (item.type === 'wooden_dragon') {
        ctx.strokeRect(sx - 15, FLOOR_Y - 25, 30, 20);
        ctx.beginPath();
        ctx.arc(sx + 18, FLOOR_Y - 30, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeRect(sx - 24, FLOOR_Y - 14, 10, 6);
      } else if (item.type === 'teether' || item.type === 'teether_ring') {
        ctx.beginPath();
        ctx.arc(sx, FLOOR_Y - 14, 13, 0, Math.PI * 2);
        ctx.arc(sx, FLOOR_Y - 14, 7, 0, Math.PI * 2);
        ctx.stroke();
      } else if (item.type === 'rattle') {
        ctx.beginPath();
        ctx.arc(sx, FLOOR_Y - 24, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(sx, FLOOR_Y - 14);
        ctx.lineTo(sx, FLOOR_Y - 2);
        ctx.stroke();
      } else {
        ctx.strokeRect(sx - 12, FLOOR_Y - 22, 22, 22);
        ctx.strokeRect(sx + 8, FLOOR_Y - 16, 16, 16);
      }
    });
  }

  function drawPlatforms(camX) {
    ctx.save();
    platforms.forEach((p, idx) => {
      const sx = p.x - camX;
      if (sx + p.w < -60 || sx > canvas.width + 60) return;

      ctx.fillStyle = '#1c1924';
      ctx.fillRect(sx, p.y, p.w, p.h);

      ctx.strokeStyle = '#433c52';
      ctx.lineWidth = 2.2;
      ctx.strokeRect(sx, p.y, p.w, p.h);

      ctx.strokeStyle = '#6c6280';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(sx, p.y);
      ctx.lineTo(sx + p.w, p.y);
      ctx.stroke();

      if (p.style === 'drum') {
        ctx.strokeStyle = '#322d3d';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let z = 0; z < p.w; z += 18) {
          ctx.lineTo(sx + z, p.y + ((z / 18) % 2 === 0 ? 8 : 34));
        }
        ctx.stroke();
      } else if (p.style === 'chest') {
        ctx.strokeStyle = '#5a516e';
        ctx.strokeRect(sx + p.w / 2 - 8, p.y + 12, 16, 18);
        ctx.beginPath();
        ctx.arc(sx + p.w / 2, p.y + 19, 3, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#2d2738';
        ctx.lineWidth = 1.2;
        for (let yOff = 14; yOff < p.h; yOff += 16) {
          ctx.beginPath();
          ctx.moveTo(sx + 6, p.y + yOff);
          ctx.lineTo(sx + p.w - 6, p.y + yOff);
          ctx.stroke();
        }
      }

      ctx.fillStyle = '#7a6f91';
      ctx.font = 'bold 12px Palatino, Georgia, serif';
      const runes = ['✧', '☽', '✿', '★', '♫', '⚜', '♣', '☀', '♥', 'Ω', '♦'];
      ctx.fillText(runes[idx % runes.length], sx + p.w / 2 - 5, p.y + 20);
    });
    ctx.restore();
  }

  function drawExitDoor(camX) {
    const sx = exitDoor.x - camX;
    if (sx < -180 || sx > canvas.width + 180) return;

    ctx.save();

    const pulse = Math.sin(Date.now() * 0.005) * 15;
    const glow = ctx.createRadialGradient(
      sx + exitDoor.w / 2, exitDoor.y + exitDoor.h / 2, 12,
      sx + exitDoor.w / 2, exitDoor.y + exitDoor.h / 2, 130 + pulse
    );
    glow.addColorStop(0, 'rgba(255, 240, 160, 0.95)');
    glow.addColorStop(0.35, 'rgba(255, 80, 200, 0.55)');
    glow.addColorStop(0.7, 'rgba(0, 230, 255, 0.3)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(sx - 100, exitDoor.y - 80, exitDoor.w + 200, exitDoor.h + 160);

    ctx.fillStyle = '#db2777';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.roundRect(sx, exitDoor.y, exitDoor.w, exitDoor.h, [42, 42, 6, 6]);
    ctx.fill();
    ctx.stroke();

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
    ctx.fillText('✨', sx + exitDoor.w / 2 - 12, exitDoor.y + 42);
    ctx.fillText('🌿', sx + exitDoor.w / 2 - 12, exitDoor.y + 88);

    ctx.restore();
  }

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

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 11, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

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

    ctx.fillStyle = 'rgba(255, 60, 110, 0.45)';
    ctx.beginPath();
    ctx.arc(-7.5, -8, 3.8, 0, Math.PI * 2);
    ctx.arc(7.5, -8, 3.8, 0, Math.PI * 2);
    ctx.fill();

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
    ctx.arc(-3.5, -10.5, 0.7, 0, Math.PI * 2);
    ctx.arc(5.5, -10.5, 0.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#c0264b';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, -6, 2.4, 0.1, Math.PI - 0.1);
    ctx.stroke();

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

    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.roundRect(-9.5, -19, 19, 3.5, 2);
    ctx.fill();

    ctx.fillStyle = '#00f7ff';
    ctx.strokeStyle = '#0891b2';
    ctx.beginPath();
    ctx.arc(-4, -28, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  function drawFairy(camX) {
    ctx.save();
    const fx = fairy.x - camX;
    const fy = fairy.y + Math.sin(fairy.floatAngle) * 9;

    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = `hsla(${290 + i * 30}, 100%, 75%, 0.85)`;
      const px = fx - 10 - i * 6 + Math.sin(fairy.floatAngle + i) * 3;
      const py = fy + 4 + Math.cos(fairy.floatAngle + i) * 4;
      ctx.beginPath();
      ctx.arc(px, py, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    const flap = Math.sin(fairy.floatAngle * 5) * 7;
    ctx.fillStyle = 'rgba(0, 245, 255, 0.85)';
    ctx.beginPath();
    ctx.ellipse(fx - 4, fy - 6, 8, 3.5 + Math.abs(flap), -0.35, 0, Math.PI * 2);
    ctx.ellipse(fx - 6, fy + 2, 6, 2.5 + Math.abs(flap), 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(fx + 2, fy - 3, 4.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff00aa';
    ctx.beginPath();
    ctx.moveTo(fx, fy - 1);
    ctx.lineTo(fx + 6, fy + 10);
    ctx.lineTo(fx - 4, fy + 10);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

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

    const bx = baby.x - camX + baby.w / 2;
    const by = baby.y + baby.h / 2;
    const babyLight = dctx.createRadialGradient(bx, by, 12, bx, by, 160);
    babyLight.addColorStop(0, 'rgba(0,0,0,0.95)');
    babyLight.addColorStop(0.5, 'rgba(0,0,0,0.65)');
    babyLight.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = babyLight;
    dctx.beginPath();
    dctx.arc(bx, by, 160, 0, Math.PI * 2);
    dctx.fill();

    const fx = fairy.x - camX;
    const fy = fairy.y;
    const fairyLight = dctx.createRadialGradient(fx, fy, 6, fx, fy, 135);
    fairyLight.addColorStop(0, 'rgba(0,0,0,0.92)');
    fairyLight.addColorStop(0.6, 'rgba(0,0,0,0.5)');
    fairyLight.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = fairyLight;
    dctx.beginPath();
    dctx.arc(fx, fy, 135, 0, Math.PI * 2);
    dctx.fill();

    const px = exitDoor.x - camX + exitDoor.w / 2;
    const py = exitDoor.y + exitDoor.h / 2;
    const doorLight = dctx.createRadialGradient(px, py, 20, px, py, 250);
    doorLight.addColorStop(0, 'rgba(0,0,0,1)');
    doorLight.addColorStop(0.6, 'rgba(0,0,0,0.7)');
    doorLight.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = doorLight;
    dctx.beginPath();
    dctx.arc(px, py, 250, 0, Math.PI * 2);
    dctx.fill();

    ctx.drawImage(darkCanvas, 0, 0);

    const vignette = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, canvas.width * 0.35,
      canvas.width / 2, canvas.height / 2, canvas.width * 0.65
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(3,2,6,0.85)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();
  }

  function update() {
    if (gameWon) return;

    baby.x += baby.vx;
    baby.animTime += 0.15;

    baby.vy += baby.gravity;
    baby.y += baby.vy;

    fairy.x = baby.x + 55;
    fairy.y = baby.y - 48;
    fairy.floatAngle += 0.08;

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

      if (landedIdx === 0) {
        firstPlatformCleared = true;
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

    const firstPlatform = platforms[0];
    if (!firstPlatformCleared && baby.x > firstPlatform.x + firstPlatform.w) {
      resetToStart(true);
      return;
    }

    if (baby.y > FLOOR_Y + 90) {
      resetToStart(true);
      return;
    }

    if (baby.x >= exitDoor.x + 12) {
      gameWon = true;
      uiFeedback.innerText = 'A porta mágica se abriu! Toque para sonhar novamente.';
      uiFeedback.style.color = '#fef08a';
    }

    let targetCamX = baby.x - 180;
    if (targetCamX < 0) targetCamX = 0;
    cameraX += (targetCamX - cameraX) * 0.08;
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDetailedRoom(cameraX);
    drawPlatforms(cameraX);
    drawExitDoor(cameraX);
    drawFairy(cameraX);
    drawBabyManaStyle(cameraX);
    applyDarkAtmosphereWithLights(cameraX);

    if (gameWon) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 250, 240, 0.88)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#db2777';
      ctx.font = 'bold 32px Palatino, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('A SAÍDA DOS SONHOS FOI ALCANÇADA!', canvas.width / 2, canvas.height / 2 - 25);

      ctx.fillStyle = '#26242c';
      ctx.font = '18px Palatino, Georgia, serif';
      ctx.fillText('A menininha e a fada atravessaram a porta juntas.', canvas.width / 2, canvas.height / 2 + 18);
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
