/**
 * BabyRenderer.js
 * Responsável pela renderização de alta fidelidade no estilo Mana da menininha protagonista.
 * Gerencia os estados deitada (esparramada pós-tombo), agachada (em prontidão), transição levantando,
 * correndo, saltando e expressões faciais.
 */

export class BabyRenderer {
  /**
   * Renderiza a sprite da menininha no estilo Mana
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} baby
   * @param {object} state
   * @param {number} camX
   */
  render(ctx, baby, state = {}, camX = 0) {
    if (!ctx || !baby) return;

    const tick = state.tick || 0;
    const isStandbyTransitioning = Boolean(state.isStandbyTransitioning);
    const standbyStandUpProgress = state.standbyStandUpProgress || 0;

    ctx.save();
    const bx = baby.x - camX;
    const by = baby.y;

    if (baby.isLyingDown) {
      // Menina visivelmente estirada e esparramada no chão após o tombo
      const floorContactY = by + baby.h - 4;
      ctx.translate(bx + baby.w / 2, floorContactY);
      const sprawlDir = baby.facing === -1 ? -1 : 1;
      ctx.scale(sprawlDir, 1);

      // Sombra suave da criança caída no chão
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 2, 28, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sapatinhos amarelos deitados para trás no chão
      ctx.fillStyle = '#ffd000';
      ctx.strokeStyle = '#c98a00';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(-18, -3, 5.5, 3.5, -0.2, 0, Math.PI * 2);
      ctx.ellipse(-11, -4, 5.5, 3.5, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Túnica e corpo estirado horizontalmente
      const bodyGrad = ctx.createLinearGradient(-15, -12, 15, 0);
      bodyGrad.addColorStop(0, '#ff2a85');
      bodyGrad.addColorStop(1, '#d80064');
      ctx.fillStyle = bodyGrad;
      ctx.strokeStyle = '#8a003d';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(-3, -7, 15, 8.5, -0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Faixa ciano e detalhe dourado na túnica
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-11, -6); ctx.lineTo(3, -6);
      ctx.stroke();

      // Bracinhos estendidos para frente no chão
      ctx.fillStyle = '#ff3d94';
      ctx.strokeStyle = '#8a003d';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.ellipse(9, -3, 7.5, 3.5, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffe0cb';
      ctx.beginPath();
      ctx.arc(16, -3, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Cabeça descansando no chão virada de frente
      const headX = 14;
      const headY = -12;
      const faceGrad = ctx.createRadialGradient(headX, headY, 2, headX, headY, 14);
      faceGrad.addColorStop(0, '#fff1e6');
      faceGrad.addColorStop(0.85, '#fcd2be');
      faceGrad.addColorStop(1, '#f7bca1');
      ctx.fillStyle = faceGrad;
      ctx.strokeStyle = '#9c5a3d';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(headX, headY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cabelo lilás espalhado pelo chão ao redor da cabeça
      ctx.fillStyle = '#8b5cf6';
      ctx.strokeStyle = '#4c1d95';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(headX, headY - 4, 11.5, Math.PI * 0.8, Math.PI * 2.2);
      ctx.quadraticCurveTo(headX + 16, headY - 12, headX + 6, headY - 14);
      ctx.quadraticCurveTo(headX - 6, headY - 13, headX - 8, headY - 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Faixinha ciano no cabelo
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(headX - 8, headY - 8, 16, 3.2);

      // Olhos atordoados / tontos de surpresa
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(headX - 4, headY + 1, 2.4, 0, Math.PI * 2);
      ctx.arc(headX + 5, headY + 1, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(headX - 4.8, headY, 1.0, 0, Math.PI * 2);
      ctx.arc(headX + 4.2, headY, 1.0, 0, Math.PI * 2);
      ctx.fill();

      // Bochechinhas coradas de impacto
      ctx.fillStyle = 'rgba(255, 60, 110, 0.55)';
      ctx.beginPath();
      ctx.arc(headX - 5.5, headY + 5, 2.8, 0, Math.PI * 2);
      ctx.arc(headX + 5.5, headY + 5, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Boquinha perplexa / confusa
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.ellipse(headX + 0.5, headY + 6.5, 2.2, 1.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Gotinha de suor/susto
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(headX + 13, headY - 6, 2, 0, Math.PI * 2);
      ctx.fill();

      // Estrelinhas orbitando a cabeça da menina estirada
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

    if (baby.isCrouching) {
      // Menina abaixada/agachada no chão, recuperando o fôlego
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

      // Sombra suave no chão
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      ctx.beginPath();
      ctx.ellipse(0, baby.h / 2 - crouchDrop / 2 - breath, 16 + (1 - standUpT) * 4, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Perninhas dobradas / agachadas
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
      ctx.restore();

      // Túnica recolhida / agachada com detalhes mágicos
      const bodyGrad = ctx.createLinearGradient(-12, -4, 12, 12);
      bodyGrad.addColorStop(0, '#ff2a85');
      bodyGrad.addColorStop(1, '#d80064');
      ctx.fillStyle = bodyGrad;
      ctx.strokeStyle = '#8a003d';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(0, 1 + (1 - standUpT) * 2, 12.5, 11 - (1 - standUpT) * 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Faixa ciano e detalhe dourado na túnica
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, -1 + (1 - standUpT) * 2, 9, 0.3, Math.PI - 0.3);
      ctx.stroke();

      // Bracinhos: apoiados nos joelhos recuperando o fôlego
      const armAngle = (1 - standUpT) * 0.45;
      ctx.fillStyle = '#ff3d94';
      ctx.strokeStyle = '#8a003d';
      ctx.lineWidth = 1.2;

      // Braço esquerdo
      ctx.save();
      ctx.translate(-9, -2 + (1 - standUpT) * 3);
      ctx.rotate(armAngle);
      ctx.beginPath();
      ctx.ellipse(0, 4, 3.2, 5.0, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffe0cb';
      ctx.beginPath();
      ctx.arc(0, 8, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Braço direito (apoiado no joelho à frente)
      ctx.save();
      ctx.translate(9, -2 + (1 - standUpT) * 3);
      ctx.rotate(-armAngle * 0.8);
      ctx.fillStyle = '#ff3d94';
      ctx.beginPath();
      ctx.ellipse(0, 4, 3.2, 5.0, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffe0cb';
      ctx.beginPath();
      ctx.arc(0, 8, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Rostinho: olhando para cima em direção à fadinha com carinho
      const headY = -11 + (1 - standUpT) * 2;
      const faceGrad = ctx.createRadialGradient(0, headY, 2, 0, headY, 14);
      faceGrad.addColorStop(0, '#fff1e6');
      faceGrad.addColorStop(0.85, '#fcd2be');
      faceGrad.addColorStop(1, '#f7bca1');
      ctx.fillStyle = faceGrad;
      ctx.strokeStyle = '#9c5a3d';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, headY, 12.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Bochechas coradas de esforço/recuperação
      ctx.fillStyle = 'rgba(255, 60, 110, 0.52)';
      ctx.beginPath();
      ctx.arc(-7.5, headY + 3, 3.8, 0, Math.PI * 2);
      ctx.arc(7.5, headY + 3, 3.8, 0, Math.PI * 2);
      ctx.fill();

      // Olhos: olhando suavemente para cima (em direção à fadinha)
      if (standUpT < 0.6) {
        ctx.fillStyle = '#21102e';
        ctx.beginPath();
        ctx.ellipse(-4.5, headY - 1, 3.0, 3.8, 0, 0, Math.PI * 2);
        ctx.ellipse(4.5, headY - 1, 3.0, 3.8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#7c3aed';
        ctx.beginPath();
        ctx.ellipse(-4.5, headY - 1.8, 2.0, 2.3, 0, 0, Math.PI * 2);
        ctx.ellipse(4.5, headY - 1.8, 2.0, 2.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Brilho nos olhos
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-5.4, headY - 2.8, 1.3, 0, Math.PI * 2);
        ctx.arc(3.6, headY - 2.8, 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Boquinha respirando suavemente
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.ellipse(0, headY + 5.2, 1.8, 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Sorriso animado ao se levantar
        ctx.fillStyle = '#21102e';
        ctx.beginPath();
        ctx.ellipse(-4.5, headY - 1, 3.2, 4.2, 0, 0, Math.PI * 2);
        ctx.ellipse(4.5, headY - 1, 3.2, 4.2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#7c3aed';
        ctx.beginPath();
        ctx.ellipse(-4.5, headY - 1, 2.2, 2.6, 0, 0, Math.PI * 2);
        ctx.ellipse(4.5, headY - 1, 2.2, 2.6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-5.6, headY - 2.5, 1.4, 0, Math.PI * 2);
        ctx.arc(3.4, headY - 2.5, 1.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#c0264b';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(0, headY + 5, 2.4, 0.1, Math.PI - 0.1);
        ctx.stroke();
      }

      // Cabelo lilás
      ctx.fillStyle = '#8b5cf6';
      ctx.strokeStyle = '#4c1d95';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, headY - 6, 10, Math.PI * 0.9, Math.PI * 2.1);
      ctx.quadraticCurveTo(8, headY - 14, -2, headY - 15);
      ctx.quadraticCurveTo(-11, headY - 13, -9, headY - 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Faixinha de cabelo ciano
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(-8, headY - 10, 16, 3.2);

      ctx.restore();
      return;
    }

    const t = baby.animTime;
    const stepSwing = Math.sin(t);
    const bob = baby.onGround ? Math.abs(Math.sin(t * 2)) * 3 : 0;
    const tilt = baby.onGround ? Math.sin(t) * 0.08 : -0.15;

    // Anchor the lowest animated shoe (including its outline) to the physical
    // feet. Body bob/rotation must never push a planted sole through a platform.
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

    // Tronco e túnica mágica
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

    // Rosto
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

    // Bochechas coradas
    ctx.fillStyle = 'rgba(255, 60, 110, 0.45)';
    ctx.beginPath();
    ctx.arc(-7.5, -8, 3.8, 0, Math.PI * 2);
    ctx.arc(7.5, -8, 3.8, 0, Math.PI * 2);
    ctx.fill();

    if (baby.isShocked) {
      // Olhos arregalados e surpresos
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.ellipse(-5, -12, 4.2, 5.0, 0, 0, Math.PI * 2);
      ctx.ellipse(5, -12, 4.2, 5.0, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pupilas grandes
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.arc(-5, -12, 2.5, 0, Math.PI * 2);
      ctx.arc(5, -12, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Brilho nos olhos
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-6.2, -13.5, 1.6, 0, Math.PI * 2);
      ctx.arc(3.8, -13.5, 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Boquinha redonda de perplexidade e questionamento
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.ellipse(0, -6, 2.5, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Gota de suor de espanto e perplexidade
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(9, -21);
      ctx.lineTo(12, -15);
      ctx.arc(10.5, -14, 2, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
    } else {
      // Olhos grandes expressivos em estilo anime
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

      // Sorriso meigo
      ctx.strokeStyle = '#c0264b';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, -6, 2.4, 0.1, Math.PI - 0.1);
      ctx.stroke();
    }

    // Cabelo lilás estilo Mana
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

    // Faixinha de cabelo
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.roundRect(-9.5, -19, 19, 3.5, 2);
    ctx.fill();

    ctx.restore();
  }
}

export const babyRenderer = new BabyRenderer();
