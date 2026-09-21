/**
 * DialogueRenderer.js
 * Renderizador de diálogos vitorianos e cutscenes:
 * - Retratos ilustrados desenhados à mão dos personagens (Bebê Mana, Fadinha Guia) com expressões e estados de humor
 * - Motor inteligente de quebra e ajuste de linhas de texto
 * - Moldura de veludo escuro semitranslúcido com detalhes ornamentados em dourado
 * - Faixas pretas cinematográficas (letterbox)
 * - Prompts dinâmicos com ícones sensíveis ao dispositivo conectado (Botão X do Xbox, Barra de Espaço, Toque na tela)
 */

export class DialogueRenderer {
  /**
   * Desenha o retrato vetorial ilustrado do personagem com expressões de humor
   * @param {CanvasRenderingContext2D} pCtx
   * @param {string} charType 'fairy' ou 'baby'
   * @param {number} px
   * @param {number} py
   * @param {number} radius
   * @param {string} [mood='normal'] 'normal', 'happy', 'shocked', 'annoyed', 'determined'
   * @param {number} [tick=0]
   */
  drawPortrait(pCtx, charType, px, py, radius, mood = 'normal', tick = 0) {
    pCtx.save();
    // 1. Halo ambiente etéreo atrás da moldura do retrato
    const glow = pCtx.createRadialGradient(px, py, radius * 0.3, px, py, radius + 6);
    if (charType === 'fairy') {
      glow.addColorStop(0, '#fef08a');
      glow.addColorStop(0.5, '#ec4899');
      glow.addColorStop(1, '#06b6d4');
    } else {
      glow.addColorStop(0, '#fed7aa');
      glow.addColorStop(0.6, '#f472b6');
      glow.addColorStop(1, '#8b5cf6');
    }
    pCtx.fillStyle = glow;
    pCtx.beginPath();
    pCtx.arc(px, py, radius + 4, 0, Math.PI * 2);
    pCtx.fill();

    // 2. Disco de fundo místico escuro
    pCtx.fillStyle = '#161024';
    pCtx.beginPath();
    pCtx.arc(px, py, radius, 0, Math.PI * 2);
    pCtx.fill();

    // 3. Anéis ornamentados dourados de moldura
    pCtx.strokeStyle = charType === 'fairy' ? '#fde047' : '#f472b6';
    pCtx.lineWidth = 2.4;
    pCtx.stroke();

    pCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    pCtx.lineWidth = 1;
    pCtx.beginPath();
    pCtx.arc(px, py, radius - 3, 0, Math.PI * 2);
    pCtx.stroke();

    if (charType === 'fairy') {
      // Asas diáfanas esvoaçantes animadas
      const wingFlap = Math.sin(tick * 0.35) * 8;
      pCtx.fillStyle = 'rgba(6, 182, 212, 0.85)';
      pCtx.beginPath();
      pCtx.ellipse(px - 11, py - 6, 12, 4 + Math.abs(wingFlap), -0.28, 0, Math.PI * 2);
      pCtx.ellipse(px + 11, py - 6, 12, 4 + Math.abs(wingFlap), 0.28, 0, Math.PI * 2);
      pCtx.fill();

      // Cabecinha e rosto dourados da fada
      pCtx.fillStyle = '#fef08a';
      pCtx.beginPath();
      pCtx.arc(px, py - 2, 9.5, 0, Math.PI * 2);
      pCtx.fill();

      // Rubor suave nas bochechas da fada
      pCtx.fillStyle = 'rgba(244, 114, 182, 0.65)';
      pCtx.beginPath();
      pCtx.arc(px - 6, py + 1, 2.2, 0, Math.PI * 2);
      pCtx.arc(px + 6, py + 1, 2.2, 0, Math.PI * 2);
      pCtx.fill();

      // Olhos expressivos estilo anime com pontos de brilho
      pCtx.fillStyle = '#311042';
      pCtx.beginPath();
      pCtx.ellipse(px - 3.8, py - 3, 1.8, 2.2, 0, 0, Math.PI * 2);
      pCtx.ellipse(px + 3.8, py - 3, 1.8, 2.2, 0, 0, Math.PI * 2);
      pCtx.fill();

      pCtx.fillStyle = '#ffffff';
      pCtx.beginPath();
      pCtx.arc(px - 4.2, py - 3.6, 0.75, 0, Math.PI * 2);
      pCtx.arc(px + 3.4, py - 3.6, 0.75, 0, Math.PI * 2);
      pCtx.fill();

      if (mood === 'annoyed' || mood === 'determined') {
        // Sobrancelha zangada e boquinha determinada
        pCtx.strokeStyle = '#991b1b';
        pCtx.lineWidth = 1.3;
        pCtx.beginPath();
        pCtx.moveTo(px - 6, py - 6.5); pCtx.lineTo(px - 1.5, py - 4.5);
        pCtx.moveTo(px + 6, py - 6.5); pCtx.lineTo(px + 1.5, py - 4.5);
        pCtx.stroke();

        pCtx.strokeStyle = '#dc2626';
        pCtx.lineWidth = 1.2;
        pCtx.beginPath();
        pCtx.arc(px, py + 1.2, 3.2, Math.PI + 0.3, Math.PI * 2 - 0.3);
        pCtx.stroke();
      } else {
        // Sorriso alegre da fada
        pCtx.strokeStyle = '#db2777';
        pCtx.lineWidth = 1.2;
        pCtx.beginPath();
        pCtx.arc(px, py - 0.5, 3.2, 0.2, Math.PI - 0.2);
        pCtx.stroke();
      }

      // Brilho estelar no canto da moldura do retrato
      const starPhase = (tick * 0.1) % (Math.PI * 2);
      pCtx.fillStyle = '#ffffff';
      pCtx.beginPath();
      pCtx.arc(px + radius - 4, py - radius + 5, 1.8 + Math.sin(starPhase) * 0.8, 0, Math.PI * 2);
      pCtx.fill();
    } else {
      // Avatar da Bebê (Chocada / Curiosa)
      pCtx.fillStyle = '#ffe0cb';
      pCtx.beginPath();
      pCtx.arc(px, py + 2, 15, 0, Math.PI * 2);
      pCtx.fill();

      // Cabelo lilás e faixa ciano
      pCtx.fillStyle = '#8b5cf6';
      pCtx.beginPath();
      pCtx.arc(px, py - 5, 13, Math.PI, Math.PI * 2);
      pCtx.fill();
      pCtx.fillStyle = '#06b6d4';
      pCtx.fillRect(px - 10, py - 7, 20, 3.2);

      // Olhos arregalados e surpresos
      pCtx.fillStyle = '#1e1b4b';
      pCtx.beginPath();
      pCtx.ellipse(px - 5, py + 1, 3.5, 4.2, 0, 0, Math.PI * 2);
      pCtx.ellipse(px + 5, py + 1, 3.5, 4.2, 0, 0, Math.PI * 2);
      pCtx.fill();
      pCtx.fillStyle = '#ffffff';
      pCtx.beginPath();
      pCtx.arc(px - 6, py - 1, 1.4, 0, Math.PI * 2);
      pCtx.arc(px + 4, py - 1, 1.4, 0, Math.PI * 2);
      pCtx.fill();

      // Boquinha aberta intrigada e confusa
      pCtx.fillStyle = '#991b1b';
      pCtx.beginPath();
      pCtx.ellipse(px, py + 9, 2.4, 3, 0, 0, Math.PI * 2);
      pCtx.fill();

      // Bochechas rosadas
      pCtx.fillStyle = 'rgba(244, 114, 182, 0.6)';
      pCtx.beginPath();
      pCtx.arc(px - 8, py + 5, 2.5, 0, Math.PI * 2);
      pCtx.arc(px + 8, py + 5, 2.5, 0, Math.PI * 2);
      pCtx.fill();

      // Gotinha de suor
      pCtx.fillStyle = '#38bdf8';
      pCtx.beginPath();
      pCtx.arc(px + 11, py - 2, 1.8, 0, Math.PI * 2);
      pCtx.fill();
    }
    pCtx.restore();
  }

  /**
   * Divide strings de diálogo com segurança entre as linhas sem quebrar palavras
   * @param {CanvasRenderingContext2D} pCtx
   * @param {string} text
   * @param {number} maxWidth
   * @returns {string[]}
   */
  wrapText(pCtx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = pCtx.measureText(testLine).width;
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  /**
   * Renderiza a janela de diálogo da cutscene, prompts de tutorial no modo de espera e faixas cinematográficas
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {object} state
   * @param {object} [options]
   */
  renderCutsceneDialogue(ctx, canvas, state = {}, options = {}) {
    if (!ctx || !canvas) return;

    const isStandbyActive = Boolean(state.isStandbyActive);
    const isStandbyTransitioning = Boolean(state.isStandbyTransitioning);
    const standbyDialogueAlpha = state.standbyDialogueAlpha ?? 1.0;
    const cutsceneActive = Boolean(state.cutsceneActive);
    const cutsceneStep = state.cutsceneStep || 0;
    const plotTwistActive = Boolean(state.plotTwistActive);
    const plotTwistStep = state.plotTwistStep || 0;
    const tick = state.tick || 0;
    const isPortrait = Boolean(state.isPortrait ?? (canvas.height > canvas.width || (canvas.width > 0 && canvas.height / canvas.width > 0.85)));

    const getActivePromptDevice = options.getActivePromptDevice || (() => 'touch');
    const drawDialoguePortrait = (pCtx, charType, px, py, radius, mood) => this.drawPortrait(pCtx, charType, px, py, radius, mood, tick);
    const wrapDialogueText = (pCtx, text, maxWidth) => this.wrapText(pCtx, text, maxWidth);

    const isStandbyShowing = isStandbyActive || (isStandbyTransitioning && standbyDialogueAlpha > 0.01);
    // Exibe diálogo apenas quando cutscene estiver ativa, durante standby ou nos passos 4 (Bebê) e 5 (Fada) da reviravolta
    if (!cutsceneActive && (!plotTwistActive || plotTwistStep < 4) && !isStandbyShowing) return;

    ctx.save();
    if (isStandbyShowing) {
      ctx.globalAlpha = standbyDialogueAlpha;
    }

    // 1. Faixas pretas cinematográficas (letterbox)
    ctx.fillStyle = '#06040a';
    ctx.fillRect(0, 0, canvas.width, 42);
    ctx.fillRect(0, canvas.height - 42, canvas.width, 42);

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 42);
    ctx.lineTo(canvas.width, 42);
    ctx.moveTo(0, canvas.height - 42);
    ctx.lineTo(canvas.width, canvas.height - 42);
    ctx.stroke();

    // Determina o interlocutor ativo, texto e expressão
    let speaker = 'fairy';
    let speakerName = '✦ FADINHA ✦';
    let speakerColor = '#fef08a';
    let mood = 'normal';
    let dialogueText = '';
    let advancePrompt = 'Toque / Espaço / (X) ➔';

    if (isStandbyShowing) {
      speaker = 'fairy';
      speakerName = '✦ FADINHA ✦';
      speakerColor = '#fef08a';
      mood = 'normal';
      dialogueText = '"Você está bem? Vamos tentar novamente!"';
      const activeDev = getActivePromptDevice();
      if (activeDev === 'gamepad') {
        advancePrompt = '(X) para continuar ➔';
      } else if (activeDev === 'keyboard') {
        advancePrompt = 'Espaço para continuar ➔';
      } else if (activeDev === 'touch') {
        advancePrompt = 'Toque na tela para continuar ➔';
      } else {
        advancePrompt = 'Toque / Espaço / (X) para continuar ➔';
      }
    } else if (plotTwistActive && plotTwistStep === 4) {
      speaker = 'baby';
      speakerName = '✦ MENININHA ✦';
      speakerColor = '#fed7aa';
      mood = 'shocked';
      dialogueText = '"Mas ali não era a porta...?"';
      advancePrompt = 'Toque / Espaço / (X) para continuar ➔';
    } else if (plotTwistActive && plotTwistStep === 5) {
      speaker = 'fairy';
      speakerName = '✦ FADINHA ✦';
      speakerColor = '#fef08a';
      mood = 'annoyed';
      dialogueText = '"Droga! Como se virar em toda essa bagunça? Vamos tentar novamente por ali!"';
      advancePrompt = 'Toque / Espaço / (X) para iniciar a subida ➔';
    } else if (cutsceneStep === 1) {
      speaker = 'fairy';
      speakerName = '✦ FADINHA ✦';
      speakerColor = '#fef08a';
      mood = 'normal';
      dialogueText = '"O quarto está escuro, mas lá fora temos muita coisa pra ver. Vamos logo sair daqui. Não aguento essa bagunça! Quem fez tudo isso?"';
      advancePrompt = 'Toque / Espaço / (X) para continuar ➔';
    } else if (cutsceneStep === 2) {
      speaker = 'fairy';
      speakerName = '✦ FADINHA ✦';
      speakerColor = '#fef08a';
      mood = 'normal';
      dialogueText = '"Claro que fomos nós duas brincando! *risos*. Mas não vamos mais perder tempo. A saída é logo ali."';
      advancePrompt = 'Toque / Espaço / (X) para continuar ➔';
    }

    // 2. Dimensionamento adaptativo do container e quebra de palavras para evitar transbordamento
    const boxW = Math.min(canvas.width - 24, 760);
    const boxX = (canvas.width - boxW) / 2;
    const portR = isPortrait ? 28 : 32;
    const portPadX = isPortrait ? 12 : 18;
    const textX = boxX + portPadX + portR * 2 + 16;
    const textMaxW = boxW - (textX - boxX) - 20;

    // Escala dinâmica de tamanho de fonte e quebra de linha
    let fontSize = isPortrait ? 14.5 : 16;
    ctx.font = `italic ${fontSize}px Palatino, Georgia, serif`;
    let lines = wrapDialogueText(ctx, dialogueText, textMaxW);

    // Ajuste automático: reduz fonte caso o texto ultrapasse 3 linhas (horizontal) ou 4 (vertical)
    const maxAllowedLines = isPortrait ? 4 : 3;
    while (lines.length > maxAllowedLines && fontSize > 12) {
      fontSize -= 0.5;
      ctx.font = `italic ${fontSize}px Palatino, Georgia, serif`;
      lines = wrapDialogueText(ctx, dialogueText, textMaxW);
    }

    const lineHeight = Math.round(fontSize * 1.44);
    const contentH = lines.length * lineHeight;
    const boxH = Math.max(isPortrait ? 122 : 110, contentH + 52, portR * 2 + 48);
    const boxY = canvas.height - boxH - 12;

    // Desenha o container da caixa de diálogo
    const bgGrad = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxH);
    bgGrad.addColorStop(0, 'rgba(26, 20, 38, 0.97)');
    bgGrad.addColorStop(1, 'rgba(13, 9, 20, 0.99)');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 12);
    ctx.fill();

    ctx.strokeStyle = (plotTwistActive ? '#ef4444' : '#d97706');
    ctx.lineWidth = 2.4;
    ctx.stroke();

    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.roundRect(boxX + 4, boxY + 4, boxW - 8, boxH - 8, 8);
    ctx.stroke();

    // Joias decorativas nos cantos
    const corners = [
      { x: boxX + 7, y: boxY + 7 },
      { x: boxX + boxW - 7, y: boxY + 7 },
      { x: boxX + 7, y: boxY + boxH - 7 },
      { x: boxX + boxW - 7, y: boxY + boxH - 7 }
    ];
    ctx.fillStyle = '#facc15';
    corners.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 2.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Desenha retrato e distintivo do nome com consistência visual
    const portX = boxX + portPadX + portR;
    const portY = boxY + portR + 14;
    drawDialoguePortrait(ctx, speaker, portX, portY, portR, mood);

    ctx.fillStyle = speakerColor;
    ctx.font = 'bold 10px Palatino, Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(speakerName, portX, portY + portR + 13);

    // 4. Desenha as linhas de texto com destaque especial para *risos*
    const textStartY = boxY + 28;
    ctx.textAlign = 'left';
    ctx.font = `italic ${fontSize}px Palatino, Georgia, serif`;

    lines.forEach((lineStr, lineIdx) => {
      const curY = textStartY + lineIdx * lineHeight;
      if (lineStr.includes('*risos*')) {
        const parts = lineStr.split('*risos*');
        let curX = textX;
        if (parts[0]) {
          ctx.fillStyle = '#fef9c3';
          ctx.fillText(parts[0], curX, curY);
          curX += ctx.measureText(parts[0]).width;
        }
        ctx.fillStyle = '#f472b6';
        ctx.font = `bold italic ${fontSize}px Palatino, Georgia, serif`;
        ctx.fillText('*risos*', curX, curY);
        curX += ctx.measureText('*risos*').width;
        ctx.font = `italic ${fontSize}px Palatino, Georgia, serif`;
        if (parts[1]) {
          ctx.fillStyle = '#fef9c3';
          ctx.fillText(parts[1], curX, curY);
        }
      } else {
        ctx.fillStyle = (speaker === 'fairy' && mood === 'annoyed' && lineIdx === 0) ? '#fde047' : '#fef9c3';
        ctx.fillText(lineStr, textX, curY);
      }
    });

    // 5. Prompt de avanço (posicionado no canto inferior direito sem sobreposição)
    const blink = Math.sin(tick * 0.1) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(253, 224, 71, ${blink})`;
    ctx.font = 'bold 11.5px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(advancePrompt, boxX + boxW - 14, boxY + boxH - 10);

    ctx.restore();
  }
}

export const dialogueRenderer = new DialogueRenderer();
