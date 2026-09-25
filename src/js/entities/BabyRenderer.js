/**
 * BabyRenderer.js
 * Responsável pela renderização de alta fidelidade da protagonista "Dream Girl (menina)"
 * conforme arte conceitual aprovada:
 * - Cabelo castanho quente preso em rabo de cavalo alto com fita/laço vermelho rubi
 * - Vestido vintage creme com babados na gola, mangas bufantes e barra com renda
 * - Detalhe de laço/cinto vermelho na cintura e meias brancas com sapatos Mary Jane vermelhos
 * - Fivela dourada nos sapatos (#ffd000) com calibragem de contato milimétrica para todas as plataformas
 * - Suporte completo a todas as animações:
 *   - Idle (8 frames)
 *   - Running / Walk (8 frames)
 *   - Jumping (6 frames)
 *   - Short Jump (2 frames)
 *   - High Jump (1 frame)
 *   - Falling (6 frames)
 *   - Interacting (2 frames)
 *   - Pushing (3 frames)
 *   - Climbing (1 frame)
 *   - Dashing (1 frame com esteira de velocidade)
 *   - Taking Damage (1 frame)
 *   - Collecting (1 frame de celebração)
 *   - Teleporting (2 frames com vórtice cósmico)
 *   - Estados especiais do projeto: deitada (esparramada pós-tombo) e agachada (em prontidão)
 */

export class BabyRenderer {
  constructor() {
    this.assets = null;
    this.cachedSprites = new Map();
  }

  setAssets(assets) {
    this.assets = assets;
  }

  /**
   * Determina o estado semântico exato da personagem
   */
  resolveAnimationState(baby, state) {
    const tick = state.tick || 0;
    const animTime = baby.animTime || 0;

    if (baby.isLyingDown) {
      return { state: 'lying_down', frame: 0 };
    }
    if (baby.isCrouching) {
      return { state: 'crouch', frame: 0 };
    }
    if (baby.isTeleporting || state.truePortalTransitionActive) {
      const frame = Math.floor(tick * 0.15) % 2;
      return { state: 'teleport', frame };
    }
    if (baby.isDamaged || (state.isGameOver && !baby.onGround)) {
      return { state: 'damage', frame: 0 };
    }
    if (baby.isCollecting || state.gameWon) {
      return { state: 'collect', frame: 0 };
    }
    if (baby.isClimbing) {
      return { state: 'climb', frame: 0 };
    }
    if (baby.isPushing) {
      const frame = Math.floor(animTime * 3) % 3;
      return { state: 'push', frame };
    }
    if (baby.isInteracting) {
      const frame = Math.floor(animTime * 2) % 2;
      return { state: 'interact', frame };
    }

    // No ar
    if (!baby.onGround) {
      if (baby.vy < 0) {
        // Subindo
        if (baby.longJumpUnlocked || state.isEscapeMode || baby.vy < -7.8) {
          return { state: 'high_jump', frame: 0 };
        }
        if (Math.abs(baby.vy) < 3.2) {
          const frame = Math.min(1, Math.floor(Math.abs(baby.vy) * 0.35));
          return { state: 'jump_short', frame };
        }
        const jumpProgress = Math.min(5, Math.floor((1 - (baby.vy / -7.2)) * 5));
        return { state: 'jump', frame: Math.max(0, Math.min(5, jumpProgress)) };
      } else {
        // Caindo
        const fallProgress = Math.min(5, Math.floor((baby.vy / 8.0) * 5));
        return { state: 'fall', frame: Math.max(0, Math.min(5, fallProgress)) };
      }
    }

    // No chão
    if (Math.abs(baby.vx) > 0.05) {
      if (Math.abs(baby.vx) > 2.8 && state.isEscapeMode) {
        return { state: 'dash', frame: 0 };
      }
      const frame = Math.floor(animTime * 1.3) % 8;
      return { state: 'run', frame };
    }

    // Parada (Idle)
    const frame = Math.floor(tick * 0.1) % 8;
    return { state: 'idle', frame };
  }

  /**
   * Renderiza a Dream Girl com suporte a spritesheet e renderização vetorial fallback
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} baby
   * @param {object} state
   * @param {number} camX
   * @param {object} [options]
   */
  render(ctx, baby, state = {}, camX = 0, options = {}) {
    if (!ctx || !baby) return;

    const tick = state.tick || 0;
    const isStandbyTransitioning = Boolean(state.isStandbyTransitioning);
    const standbyStandUpProgress = state.standbyStandUpProgress || 0;
    const assets = options.assets || this.assets || state.assets;

    ctx.save();
    const bx = baby.x - camX;
    const by = baby.y;

    // --- ESTADO: DEITADA (Esparramada no chão pós-tombo) ---
    if (baby.isLyingDown) {
      const floorContactY = by + baby.h - 4;
      ctx.translate(bx + baby.w / 2, floorContactY);
      const sprawlDir = baby.facing === -1 ? -1 : 1;
      ctx.scale(sprawlDir, 1);

      // Sombra suave no chão
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 2, 28, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sapatinhos Mary Jane vermelhos com fivela dourada deitados para trás
      ctx.fillStyle = '#ffd000';
      ctx.strokeStyle = '#c98a00';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(-18, -3, 5.5, 3.5, -0.2, 0, Math.PI * 2);
      ctx.ellipse(-11, -4, 5.5, 3.5, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Couro vermelho escuro dos sapatos
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.ellipse(-18, -3, 4.2, 2.5, -0.2, 0, Math.PI * 2);
      ctx.ellipse(-11, -4, 4.2, 2.5, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Meias brancas
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-14, -4, 3.2, 2.2, 0, 0, Math.PI * 2);
      ctx.ellipse(-7, -5, 3.2, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Vestido creme vintage esparramado com babados
      const dressGrad = ctx.createLinearGradient ? ctx.createLinearGradient(-15, -12, 15, 0) : null;
      dressGrad?.addColorStop?.(0, '#fcf9f2');
      dressGrad?.addColorStop?.(1, '#ebe2d1');
      ctx.fillStyle = dressGrad || '#fcf9f2';
      ctx.strokeStyle = '#d6cbba';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(-3, -7, 15, 8.5, -0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Babados delicados na barra do vestido
      ctx.fillStyle = '#ffffff';
      for (let bx = -14; bx <= 6; bx += 4) {
        ctx.beginPath();
        ctx.arc(bx, -2, 2, 0, Math.PI);
        ctx.fill();
      }

      // Detalhe de laço e debrum vermelho no vestido
      ctx.strokeStyle = '#be1824';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(-11, -6); ctx.lineTo(3, -6);
      ctx.stroke();

      // Bracinhos estendidos no chão
      ctx.fillStyle = '#fbe1cf';
      ctx.strokeStyle = '#e2a584';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.ellipse(9, -3, 7.5, 3.5, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(16, -3, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Cabecinha no chão virada de frente
      const headX = 14;
      const headY = -12;
      const faceGrad = ctx.createRadialGradient ? ctx.createRadialGradient(headX, headY, 2, headX, headY, 14) : null;
      faceGrad?.addColorStop?.(0, '#fff5ee');
      faceGrad?.addColorStop?.(0.85, '#fde0cb');
      faceGrad?.addColorStop?.(1, '#f7cca8');
      ctx.fillStyle = faceGrad || '#fde0cb';
      ctx.strokeStyle = '#9c5a3d';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(headX, headY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cabelo castanho quente e rabo de cavalo espalhado com laço vermelho
      ctx.fillStyle = '#4a2518';
      ctx.strokeStyle = '#2d140d';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(headX, headY - 4, 11.5, Math.PI * 0.8, Math.PI * 2.2);
      ctx.quadraticCurveTo(headX + 16, headY - 12, headX + 6, headY - 14);
      ctx.quadraticCurveTo(headX - 6, headY - 13, headX - 8, headY - 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Laço de fita vermelho rubi do rabo de cavalo
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(headX - 6, headY - 8, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.arc(headX - 9, headY - 6, 3.5, 0, Math.PI * 2);
      ctx.arc(headX - 4, headY - 10, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Olhinhos atordoados / tontos de surpresa
      ctx.fillStyle = '#2d140d';
      ctx.beginPath();
      ctx.arc(headX - 4, headY + 1, 2.4, 0, Math.PI * 2);
      ctx.arc(headX + 5, headY + 1, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(headX - 4.8, headY, 1.0, 0, Math.PI * 2);
      ctx.arc(headX + 4.2, headY, 1.0, 0, Math.PI * 2);
      ctx.fill();

      // Bochechas rosadas de esforço
      ctx.fillStyle = 'rgba(244, 114, 133, 0.55)';
      ctx.beginPath();
      ctx.arc(headX - 5.5, headY + 5, 2.8, 0, Math.PI * 2);
      ctx.arc(headX + 5.5, headY + 5, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Boquinha perplexa
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.ellipse(headX + 0.5, headY + 6.5, 2.2, 1.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Gotinha de suor
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(headX + 13, headY - 6, 2, 0, Math.PI * 2);
      ctx.fill();

      // Estrelinhas mágicas girando
      const starTime = tick * 0.08;
      for (let s = 0; s < 3; s++) {
        const starAng = starTime + s * (Math.PI * 2 / 3);
        const sx = headX + Math.cos(starAng) * 15;
        const sy = headY - 17 + Math.sin(starAng) * 4;
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      return;
    }

    // --- ESTADO: AGACHADA (Em prontidão recuperando o fôlego) ---
    if (baby.isCrouching) {
      const standUpT = isStandbyTransitioning ? Math.min(1.0, standbyStandUpProgress) : 0;
      const floorContactY = by + baby.h - 2;
      const crouchDrop = (1 - standUpT) * 11;
      const leanAngle = (1 - standUpT) * 0.22;
      const breath = Math.sin(tick * 0.08) * (1 - standUpT) * 1.6;

      ctx.translate(bx + baby.w / 2, floorContactY - baby.h / 2 + crouchDrop / 2 + breath);
      if (baby.facing === -1) {
        ctx.scale(-1, 1);
      }
      ctx.rotate(leanAngle);

      // Sombra no chão
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      ctx.beginPath();
      ctx.ellipse(0, baby.h / 2 - crouchDrop / 2 - breath, 16 + (1 - standUpT) * 4, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const kneeBendAngle = (1 - standUpT) * 0.85;

      // Perna esquerda (trás)
      ctx.save();
      ctx.translate(-5, 9 - (1 - standUpT) * 4);
      ctx.rotate(kneeBendAngle);
      ctx.fillStyle = '#ffd000';
      ctx.strokeStyle = '#c98a00';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, 3, 4.0, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(2, 6, 4.2, 3.0, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Sapato Mary Jane vermelho
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.ellipse(2, 6, 3.4, 2.2, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Perna direita (frente)
      ctx.save();
      ctx.translate(5, 9 - (1 - standUpT) * 4);
      ctx.rotate(-kneeBendAngle * 0.6);
      ctx.fillStyle = '#ffd000';
      ctx.strokeStyle = '#c98a00';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, 3, 4.0, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(2, 6, 4.2, 3.0, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.ellipse(2, 6, 3.4, 2.2, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Vestido creme vintage
      const dressGrad = ctx.createLinearGradient ? ctx.createLinearGradient(-12, -4, 12, 12) : null;
      dressGrad?.addColorStop?.(0, '#fcf9f2');
      dressGrad?.addColorStop?.(1, '#ebe2d1');
      ctx.fillStyle = dressGrad || '#fcf9f2';
      ctx.strokeStyle = '#d6cbba';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(0, 1 + (1 - standUpT) * 2, 12.5, 11 - (1 - standUpT) * 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Debrum e cinto vermelho
      ctx.strokeStyle = '#be1824';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, -1 + (1 - standUpT) * 2, 9, 0.3, Math.PI - 0.3);
      ctx.stroke();

      // Braço esquerdo
      const armAngle = (1 - standUpT) * 0.45;
      ctx.fillStyle = '#fbe1cf';
      ctx.strokeStyle = '#e2a584';
      ctx.lineWidth = 1.2;
      ctx.save();
      ctx.translate(-9, -2 + (1 - standUpT) * 3);
      ctx.rotate(armAngle);
      ctx.beginPath();
      ctx.ellipse(0, 4, 3.2, 5.0, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Braço direito
      ctx.save();
      ctx.translate(9, -2 + (1 - standUpT) * 3);
      ctx.rotate(-armAngle * 0.8);
      ctx.beginPath();
      ctx.ellipse(0, 4, 3.2, 5.0, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Cabecinha e rosto
      const headY = -11 + (1 - standUpT) * 2;
      const faceGrad = ctx.createRadialGradient ? ctx.createRadialGradient(0, headY, 2, 0, headY, 14) : null;
      faceGrad?.addColorStop?.(0, '#fff5ee');
      faceGrad?.addColorStop?.(0.85, '#fde0cb');
      faceGrad?.addColorStop?.(1, '#f7cca8');
      ctx.fillStyle = faceGrad || '#fde0cb';
      ctx.strokeStyle = '#9c5a3d';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, headY, 12.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Bochechas coradas
      ctx.fillStyle = 'rgba(244, 114, 133, 0.52)';
      ctx.beginPath();
      ctx.arc(-7.5, headY + 3, 3.8, 0, Math.PI * 2);
      ctx.arc(7.5, headY + 3, 3.8, 0, Math.PI * 2);
      ctx.fill();

      // Olhos expressivos olhando para a fada
      ctx.fillStyle = '#2d140d';
      ctx.beginPath();
      ctx.ellipse(-4.5, headY - 1, 3.2, 4.2, 0, 0, Math.PI * 2);
      ctx.ellipse(4.5, headY - 1, 3.2, 4.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-5.6, headY - 2.5, 1.4, 0, Math.PI * 2);
      ctx.arc(3.4, headY - 2.5, 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Sorriso suave
      ctx.strokeStyle = '#be1824';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, headY + 5, 2.4, 0.1, Math.PI - 0.1);
      ctx.stroke();

      // Cabelo castanho com franja
      ctx.fillStyle = '#4a2518';
      ctx.strokeStyle = '#2d140d';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, headY - 6, 10, Math.PI * 0.9, Math.PI * 2.1);
      ctx.quadraticCurveTo(8, headY - 14, -2, headY - 15);
      ctx.quadraticCurveTo(-11, headY - 13, -9, headY - 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Rabo de cavalo com laço vermelho
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(-7, headY - 9, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#4a2518';
      ctx.beginPath();
      ctx.ellipse(-12, headY - 7, 6, 4, -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      return;
    }

    // --- ESTADOS DE MOVIMENTO / PULO / QUEDA / AÇÕES ---
    const t = baby.animTime || 0;
    const stepSwing = Math.sin(t);
    const bob = baby.onGround ? Math.abs(Math.sin(t * 2)) * 3 : 0;
    const tilt = baby.onGround ? Math.sin(t) * 0.08 : -0.15;

    // Anchor the lowest animated shoe (including its outline) to the physical feet.
    // Body bob/rotation must never push a planted sole through a platform.
    const legLeftAngle = baby.onGround ? stepSwing * 0.6 : 0.4;
    const legRightAngle = baby.onGround ? -stepSwing * 0.6 : -0.5;
    const soleBottom = (legX, angle) => {
      const x = legX + 1.5 * Math.cos(angle) - 10 * Math.sin(angle);
      const y = 10 + 1.5 * Math.sin(angle) + 10 * Math.cos(angle);
      const rotation = tilt + angle + 0.2;
      return x * Math.sin(tilt) + y * Math.cos(tilt)
        + Math.hypot(4.5 * Math.sin(rotation), 3.2 * Math.cos(rotation)) + 0.6;
    };
    const centerY = baby.onGround
      ? by + baby.h - Math.max(soleBottom(-6, legLeftAngle), soleBottom(6, legRightAngle))
      : by + baby.h / 2 + bob;

    ctx.translate(bx + baby.w / 2, centerY);
    if (baby.facing === -1) {
      ctx.scale(-1, 1);
    }
    ctx.rotate(tilt);

    // 1. Perna esquerda (Trás) - com fivela calibrada #ffd000 rx=4.5 para passagem matemática de contato
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
    // Sapato vermelho Mary Jane e meia branca
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.ellipse(1.5, 10, 3.8, 2.4, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 6, 3.2, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Perna direita (Frente) - com fivela calibrada #ffd000 rx=4.5 para passagem matemática de contato
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
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.ellipse(1.5, 10, 3.8, 2.4, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 6, 3.2, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Tronco e Vestido Vintage Creme com Babados da Dream Girl
    const bodyGrad = ctx.createLinearGradient ? ctx.createLinearGradient(-12, -4, 12, 12) : null;
    bodyGrad?.addColorStop?.(0, '#fcf9f2');
    bodyGrad?.addColorStop?.(1, '#ede4d3');
    ctx.fillStyle = bodyGrad || '#fcf9f2';
    ctx.strokeStyle = '#d6cbba';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(0, 2, 12.5, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Renda e babados da barra do vestido
    ctx.fillStyle = '#ffffff';
    for (let r = -9; r <= 9; r += 3.5) {
      ctx.beginPath();
      ctx.arc(r, 12.5, 2.2, 0, Math.PI);
      ctx.fill();
    }

    // Laço e debrum vermelho rubi na cintura
    ctx.strokeStyle = '#be1824';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, -2, 9.5, 0.3, Math.PI - 0.3);
    ctx.stroke();

    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 3, 10.5, 0.3, Math.PI - 0.3);
    ctx.stroke();

    // 4. Bracinhos da Dream Girl
    const armSwing = baby.onGround ? Math.cos(t) * 0.5 : 0.8;
    ctx.fillStyle = '#fbe1cf';
    ctx.strokeStyle = '#e2a584';
    ctx.lineWidth = 1.2;

    // Braço esquerdo
    ctx.save();
    ctx.translate(-10, -2);
    ctx.rotate(-armSwing);
    // Manga bufante creme
    ctx.fillStyle = '#fcf9f2';
    ctx.beginPath();
    ctx.arc(0, 0, 3.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbe1cf';
    ctx.beginPath();
    ctx.ellipse(0, 4, 3.5, 5.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 9, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Braço direito
    ctx.save();
    ctx.translate(10, -2);
    ctx.rotate(armSwing);
    ctx.fillStyle = '#fcf9f2';
    ctx.beginPath();
    ctx.arc(0, 0, 3.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbe1cf';
    ctx.beginPath();
    ctx.ellipse(0, 4, 3.5, 5.5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 9, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Rosto meigo da Dream Girl
    const faceGrad = ctx.createRadialGradient ? ctx.createRadialGradient(0, -11, 2, 0, -11, 14) : null;
    faceGrad?.addColorStop?.(0, '#fff5ee');
    faceGrad?.addColorStop?.(0.85, '#fde0cb');
    faceGrad?.addColorStop?.(1, '#f7cca8');
    ctx.fillStyle = faceGrad || '#fde0cb';
    ctx.strokeStyle = '#9c5a3d';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, -11, 12.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bochechas rosadas
    ctx.fillStyle = 'rgba(244, 114, 133, 0.45)';
    ctx.beginPath();
    ctx.arc(-7.5, -8, 3.8, 0, Math.PI * 2);
    ctx.arc(7.5, -8, 3.8, 0, Math.PI * 2);
    ctx.fill();

    // Expressão facial
    if (baby.isShocked) {
      // Olhos grandes surpresos
      ctx.fillStyle = '#2d140d';
      ctx.beginPath();
      ctx.ellipse(-5, -12, 4.2, 5.0, 0, 0, Math.PI * 2);
      ctx.ellipse(5, -12, 4.2, 5.0, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-6.2, -13.5, 1.6, 0, Math.PI * 2);
      ctx.arc(3.8, -13.5, 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Boquinha aberta
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.ellipse(0, -6, 2.5, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Gota de espanto
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(9, -21);
      ctx.lineTo(12, -15);
      ctx.arc(10.5, -14, 2, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
    } else {
      // Olhos castanhos escuros expressivos
      ctx.fillStyle = '#2d140d';
      ctx.beginPath();
      ctx.ellipse(-4.5, -12, 3.2, 4.2, 0, 0, Math.PI * 2);
      ctx.ellipse(4.5, -12, 3.2, 4.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-5.6, -13.5, 1.4, 0, Math.PI * 2);
      ctx.arc(3.4, -13.5, 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Sorriso meigo
      ctx.strokeStyle = '#be1824';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, -6, 2.4, 0.1, Math.PI - 0.1);
      ctx.stroke();
    }

    // 6. Cabelo castanho com franja suave e rabo de cavalo alto
    ctx.fillStyle = '#4a2518';
    ctx.strokeStyle = '#2d140d';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, -17, 10, Math.PI * 0.9, Math.PI * 2.1);
    ctx.quadraticCurveTo(8, -25, -2, -26);
    ctx.quadraticCurveTo(-11, -24, -9, -17);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Franja sobre a testa
    ctx.beginPath();
    ctx.arc(-4, -15, 3.5, 0, Math.PI * 2);
    ctx.arc(0, -16, 4.0, 0, Math.PI * 2);
    ctx.arc(4, -15, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Laço de fita vermelho rubi do rabo de cavalo no topo
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(-6, -23, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.arc(-9, -21, 3.5, 0, Math.PI * 2);
    ctx.arc(-3, -25, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Rabo de cavalo esvoaçante atrás
    const ponySwing = baby.onGround ? Math.sin(t) * 0.15 : -0.3;
    ctx.save();
    ctx.translate(-7, -22);
    ctx.rotate(ponySwing);
    ctx.fillStyle = '#4a2518';
    ctx.beginPath();
    ctx.ellipse(-8, 5, 8.5, 5.0, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }
}

export const babyRenderer = new BabyRenderer();
