/**
 * ToyRoomEntities.js
 * Renderiza personagens no estilo 2.5D visto de cima (Mana):
 * - Menininha: Animação de caminhar, balanço dos pezinhos, vestido coral com avental bordado,
 *   bochechas coradas, cabelo castanho com maria-chiquinhas e fitinhas amarelas,
 *   olhar direcional e bracinhos erguidos ao carregar brinquedos.
 * - Fadinha Companheira: Aura radial dourada, asas diáfanas esvoaçantes com bater sinusoidal,
 *   núcleo radiante iluminado.
 */

export class ToyRoomEntities {
  /**
   * Desenha a garotinha vista de cima
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} player
   */
  renderPlayer(ctx, player, options = {}) {
    if (!ctx || !player) return;

    const sheetImage = options.assets && options.assets.get('toy-room-player-sheet');
    if (sheetImage) {
      const frameWidth = Math.floor((sheetImage.width || sheetImage.naturalWidth) / 4);
      const frameHeight = Math.floor((sheetImage.height || sheetImage.naturalHeight) / 4);
      const frame = player.isMoving ? Math.floor((player.animTime || 0) * 0.9) % 4 : 0;
      const backSheet = options.assets && options.assets.get('toy-room-player-back-sheet');
      const isBack = !player.carriedItem && player.facing === 'up' && backSheet;
      const activeSheet = isBack ? backSheet : sheetImage;
      const activeFrameWidth = isBack ? Math.floor((backSheet.width || backSheet.naturalWidth) / 4) : frameWidth;
      const activeFrameHeight = isBack ? (backSheet.height || backSheet.naturalHeight) : frameHeight;
      const row = player.carriedItem ? 2 : ({ down: 0, up: 1, left: 3, right: 3 }[player.facing] ?? 0);
      const isRight = player.facing === 'right';
      const bob = player.isMoving ? Math.abs(Math.sin((player.animTime || 0) * 1.8)) * 1.5 : 0;
      const sourceInset = 3;
      const sourceTopInset = !isBack && row === 3 ? 12 : sourceInset;

      ctx.save();
      ctx.translate(player.x, player.y + 28);
      if (isRight) {
        ctx.scale(-1, 1);
      }
      ctx.drawImage(
        activeSheet,
        frame * activeFrameWidth + sourceInset,
        (isBack ? 0 : row * activeFrameHeight) + sourceTopInset,
        activeFrameWidth - sourceInset * 2,
        activeFrameHeight - sourceTopInset - sourceInset,
        -32,
        -81 - bob,
        64,
        82
      );
      ctx.restore();
      return;
    }

    const walkFrame = player.isMoving ? Math.floor((player.animTime || 0) * 0.9) % 3 + 1 : 0;
    const direction = player.facing;
    const imageKey = player.carriedItem
      ? 'toy-room-player-carry'
      : direction === 'down' && walkFrame > 0
        ? `toy-room-player-down-${walkFrame}`
        : direction === 'up' && walkFrame > 0
          ? `toy-room-player-up-${walkFrame}`
          : direction === 'left' && walkFrame > 0
        ? `toy-room-player-right-${walkFrame}`
        : direction === 'right' && walkFrame > 0
          ? `toy-room-player-left-${walkFrame}`
          : ({ up: 'toy-room-player-up', left: 'toy-room-player-right', right: 'toy-room-player-left' }[direction] || 'toy-room-player');
    const playerImage = options.assets && options.assets.get(imageKey);
    if (playerImage) {
      const walkPhase = (player.animTime || 0) * 1.8;
      const walkBob = player.isMoving ? Math.abs(Math.sin(walkPhase)) * 2.2 : 0;
      const bodySway = player.isMoving ? Math.sin(walkPhase) * 0.035 : 0;

      ctx.save();
      ctx.translate(player.x, player.y + 28);
      ctx.rotate(bodySway);
      ctx.drawImage(
        playerImage,
        -30,
        -80 - walkBob,
        60,
        80
      );
      ctx.restore();
      return;
    }

    ctx.save();
    const px = player.x;
    const py = player.y;

    // Sombra no chão
    ctx.fillStyle = 'rgba(70, 30, 10, 0.35)';
    ctx.beginPath();
    ctx.ellipse(px, py + 14, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Oscilação da animação de caminhada
    const walkBob = player.isMoving ? Math.sin((player.animTime || 0) * 2) * 2.5 : 0;
    const stepSwing = player.isMoving ? Math.sin((player.animTime || 0) * 2) * 4 : 0;

    // Sapatinhos e pezinhos
    ctx.fillStyle = '#78350f';
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

    // Vestidinho Vintage Creme com babados e debrum vermelho da Dream Girl
    const dressGrad = ctx.createLinearGradient(px, py - 12 + walkBob, px, py + 12 + walkBob);
    dressGrad.addColorStop(0, '#fcf9f2');
    dressGrad.addColorStop(1, '#ede4d3');
    ctx.fillStyle = dressGrad;

    ctx.beginPath();
    ctx.moveTo(px - 14, py + 12 + walkBob);
    ctx.lineTo(px + 14, py + 12 + walkBob);
    ctx.lineTo(px + 8, py - 8 + walkBob);
    ctx.lineTo(px - 8, py - 8 + walkBob);
    ctx.closePath();
    ctx.fill();

    // Babados delicados na barra do vestido
    ctx.fillStyle = '#ffffff';
    for (let bx = -12; bx <= 12; bx += 4) {
      ctx.beginPath();
      ctx.arc(px + bx, py + 12 + walkBob, 2.2, 0, Math.PI);
      ctx.fill();
    }

    // Fita/cinto vermelho rubi na cintura
    ctx.fillStyle = '#be1824';
    ctx.fillRect(px - 9, py + 2 + walkBob, 18, 2.5);

    // Cabecinha redonda
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.arc(px, py - 16 + walkBob, 14, 0, Math.PI * 2);
    ctx.fill();

    // Bochechas rosadas
    ctx.fillStyle = 'rgba(251, 113, 133, 0.45)';
    ctx.beginPath();
    ctx.arc(px - 7, py - 14 + walkBob, 3, 0, Math.PI * 2);
    ctx.arc(px + 7, py - 14 + walkBob, 3, 0, Math.PI * 2);
    ctx.fill();

    // Olhos castanhos escuros
    if (player.facing === 'down') {
      ctx.fillStyle = '#28140e';
      ctx.beginPath();
      ctx.ellipse(px - 5, py - 17 + walkBob, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.ellipse(px + 5, py - 17 + walkBob, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px - 6, py - 18 + walkBob, 1, 0, Math.PI * 2);
      ctx.arc(px + 4, py - 18 + walkBob, 1, 0, Math.PI * 2);
      ctx.fill();
    } else if (player.facing === 'left') {
      ctx.fillStyle = '#28140e';
      ctx.beginPath();
      ctx.ellipse(px - 7, py - 17 + walkBob, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (player.facing === 'right') {
      ctx.fillStyle = '#28140e';
      ctx.beginPath();
      ctx.ellipse(px + 7, py - 17 + walkBob, 2.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cabelo castanho quente e rabo de cavalo alto
    ctx.fillStyle = '#4a2518';
    ctx.beginPath();
    ctx.arc(px, py - 21 + walkBob, 14, Math.PI, 0, false);
    ctx.fill();

    // Franja suave sobre a testa
    ctx.beginPath();
    ctx.arc(px - 5, py - 19 + walkBob, 4, 0, Math.PI * 2);
    ctx.arc(px, py - 20 + walkBob, 4.5, 0, Math.PI * 2);
    ctx.arc(px + 5, py - 19 + walkBob, 4, 0, Math.PI * 2);
    ctx.fill();

    // Rabo de cavalo alto com laço vermelho rubi
    const ponyWave = player.isMoving ? Math.sin((player.animTime || 0) * 2.5) * 3 : 0;
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(px - 9, py - 25 + walkBob, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4a2518';
    ctx.beginPath();
    ctx.ellipse(px - 14, py - 22 + walkBob + ponyWave, 5, 8, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(px - 13, py - 21 + walkBob, 3.5, 0, Math.PI * 2);
    ctx.arc(px + 13, py - 21 + walkBob, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Braços: Se estiver carregando um brinquedo, os bracinhos ficam erguidos segurando o item!
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

  /**
   * Desenha a fadinha companheira
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} fairy
   */
  renderFairy(ctx, fairy, options = {}) {
    if (!ctx || !fairy) return;

    const fairyImage = options.assets && options.assets.get('toy-room-fairy');
    if (fairyImage) {
      ctx.drawImage(fairyImage, fairy.x - 30, fairy.y - 30, 60, 60);
      return;
    }

    ctx.save();
    const fx = fairy.x;
    const fy = fairy.y;

    // Aura dourada brilhante
    const aura = ctx.createRadialGradient(fx, fy, 4, fx, fy, 24);
    aura.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    aura.addColorStop(0.4, 'rgba(254, 240, 138, 0.75)');
    aura.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(fx, fy, 24, 0, Math.PI * 2);
    ctx.fill();

    // Asas diáfanas da fada com animação esvoaçante
    const wingFlap = Math.sin((fairy.flutterTime || 0) * 0.4) * 6;
    ctx.fillStyle = 'rgba(199, 210, 254, 0.85)';
    ctx.beginPath();
    ctx.ellipse(fx - 7, fy - 4, 7, 12 + wingFlap, -0.4, 0, Math.PI * 2);
    ctx.ellipse(fx + 7, fy - 4, 7, 12 + wingFlap, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Corpinho brilhante da fada
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(fx, fy, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Núcleo interno reluzente
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fx, fy, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

export const toyRoomEntities = new ToyRoomEntities();
