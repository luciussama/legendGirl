/**
 * ParticleSystem.js
 * Motor de simulação e renderização de partículas para:
 * - Rastros de pulo e partículas de poeira do bebê
 * - Nuvenzinhas de aterrissagem e decolagem com brilhos estelares cintilantes de 4 pontas
 * - Fitas celestiais de alta velocidade para o Modo Fuga e Fase 3
 */

export class ParticleSystem {
  constructor(options = {}) {
    this.babyJumpDust = options.babyJumpDust || [];
    this.speedRibbons = options.speedRibbons || [];
  }

  /**
   * Redefine todas as partículas ativas
   */
  clear() {
    this.babyJumpDust.length = 0;
    this.speedRibbons.length = 0;
  }

  /**
   * Gera poeira celestial flutuante atrás do bebê enquanto pula/corre
   */
  spawnBabyJumpDust(bx, bw, by, bh, bvx, isEscapeMode = false, escapeLevel = 0) {
    const palette = [
      '254, 240, 138', // Dourado quente suave
      '233, 213, 255', // Roxo suave de fada
      '186, 230, 253', // Ciano celestial suave
      '251, 207, 232', // Rosa pastel suave
      '255, 255, 255'  // Branco brilhante
    ];
    const count = isEscapeMode ? (escapeLevel >= 6 ? 2 : 1) : 1;
    for (let i = 0; i < count; i++) {
      const rgb = palette[Math.floor(Math.random() * palette.length)];
      this.babyJumpDust.push({
        x: bx + bw * (0.2 + Math.random() * 0.6),
        y: by + bh - 2 + (Math.random() - 0.5) * 3,
        vx: -bvx * (0.22 + Math.random() * 0.18) + (Math.random() - 0.5) * 0.35,
        vy: -0.12 + (Math.random() - 0.5) * 0.35,
        size: 1.3 + Math.random() * 1.5,
        rgb,
        twinkle: Math.random() > 0.6,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.05 + Math.random() * 0.05,
        life: 1.0,
        decay: 0.024 + Math.random() * 0.016
      });
    }
  }

  /**
   * Gera uma nuvenzinha etérea de poeira ao iniciar um pulo
   */
  spawnBabyJumpPuff(x, y, count = 5) {
    const palette = ['254, 240, 138', '233, 213, 255', '186, 230, 253', '255, 255, 255'];
    for (let i = 0; i < count; i++) {
      const rgb = palette[Math.floor(Math.random() * palette.length)];
      const angle = Math.PI + (Math.random() - 0.5) * 1.6;
      const speed = 0.4 + Math.random() * 1.1;
      this.babyJumpDust.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y - 2 + (Math.random() - 0.5) * 3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.15,
        size: 1.4 + Math.random() * 1.5,
        rgb,
        twinkle: Math.random() > 0.5,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.06 + Math.random() * 0.05,
        life: 1.0,
        decay: 0.028 + Math.random() * 0.018
      });
    }
  }

  /**
   * Gera nuvenzinha bilateral de poeira ao aterrissar em uma plataforma
   */
  spawnBabyLandingPuff(x, y, count = 5) {
    const palette = ['254, 240, 138', '186, 230, 253', '255, 255, 255'];
    for (let i = 0; i < count; i++) {
      const rgb = palette[Math.floor(Math.random() * palette.length)];
      const dir = Math.random() > 0.5 ? 1 : -1;
      this.babyJumpDust.push({
        x: x + dir * (3 + Math.random() * 7),
        y: y - 2,
        vx: dir * (0.5 + Math.random() * 0.8),
        vy: -0.2 - Math.random() * 0.5,
        size: 1.3 + Math.random() * 1.3,
        rgb,
        twinkle: Math.random() > 0.5,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.06 + Math.random() * 0.06,
        life: 1.0,
        decay: 0.035 + Math.random() * 0.02
      });
    }
  }

  /**
   * Gera fitas de velocidade na Fase 3
   */
  spawnPhase3Ribbons(baby, phase3Level, stats, tick) {
    const ribbonRate = stats?.ribbonRate ?? 2;
    if (tick % ribbonRate === 0) {
      const palette = ['#c084fc', '#f472b6', '#38bdf8', '#facc15', '#34d399'];
      const chosenColor = palette[Math.floor(Math.random() * Math.min(palette.length, 2 + Math.floor(phase3Level / 4)))];
      const intensity = stats?.trailIntensity ?? 2;
      for (let s = 0; s < intensity; s++) {
        this.speedRibbons.push({
          x: baby.x + baby.w + Math.random() * 8,
          y: baby.y + baby.h - 6 + (Math.random() - 0.5) * 6,
          vx: Math.abs(baby.vx) * (0.35 + Math.random() * 0.25),
          vy: (Math.random() - 0.5) * 1.5,
          size: 3.5 + Math.random() * (3 + phase3Level * 0.35),
          color: chosenColor,
          life: 1.0,
          decay: 0.038 + Math.random() * 0.025
        });
      }
    }
  }

  /**
   * Gera fitas de velocidade no Modo Fuga
   */
  spawnEscapeRibbons(baby, escapeLevel, stats, tick) {
    const ribbonRate = stats?.ribbonRate ?? 2;
    if (tick % ribbonRate === 0) {
      const palette = ['#facc15', '#38bdf8', '#f472b6', '#a855f7', '#34d399'];
      const chosenColor = palette[Math.floor(Math.random() * Math.min(palette.length, 2 + Math.floor(escapeLevel / 3)))];
      const intensity = stats?.trailIntensity ?? 2;
      for (let s = 0; s < intensity; s++) {
        this.speedRibbons.push({
          x: baby.x + 4 + Math.random() * 8,
          y: baby.y + baby.h - 6 + (Math.random() - 0.5) * 6,
          vx: -baby.vx * (0.35 + Math.random() * 0.25),
          vy: (Math.random() - 0.5) * 1.5,
          size: 3.5 + Math.random() * (3 + escapeLevel * 0.35),
          color: chosenColor,
          life: 1.0,
          decay: 0.045 + Math.random() * 0.03
        });
      }
    }
  }

  /**
   * Atualização de física para todas as partículas ativas
   */
  update(dt = 1.0) {
    this.updateBabyJumpDust(dt);
    this.updateSpeedRibbons(dt);
  }

  updateBabyJumpDust(dt = 1.0) {
    for (let i = this.babyJumpDust.length - 1; i >= 0; i--) {
      const p = this.babyJumpDust[i];
      p.wobble += p.wobbleSpeed * dt;
      p.x += (p.vx + Math.sin(p.wobble) * 0.2) * dt;
      p.y += p.vy * dt;
      p.vy += 0.01 * dt;
      p.life -= p.decay * dt;
      if (p.life <= 0) {
        this.babyJumpDust.splice(i, 1);
      }
    }
  }

  updateSpeedRibbons(dt = 1.0) {
    for (let i = this.speedRibbons.length - 1; i >= 0; i--) {
      const r = this.speedRibbons[i];
      r.x += r.vx * dt;
      r.y += r.vy * dt;
      r.life -= r.decay * dt;
      if (r.life <= 0) {
        this.speedRibbons.splice(i, 1);
      }
    }
  }

  /**
   * Desenha fitas de velocidade com brilho aditivo suave
   */
  renderSpeedRibbons(ctx, canvas, camX) {
    if (!ctx || this.speedRibbons.length === 0) return;
    ctx.save();
    for (let i = 0; i < this.speedRibbons.length; i++) {
      const r = this.speedRibbons[i];
      const sx = r.x - camX;
      if (canvas && (sx < -40 || sx > canvas.width + 40)) continue;

      ctx.fillStyle = r.color;
      ctx.globalAlpha = r.life * 0.85;
      ctx.beginPath();
      ctx.arc(sx, r.y, r.size * r.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Desenha partículas de poeira de pulo do bebê com aura exterior suave e cintilações de 4 pontas
   */
  renderBabyJumpDust(ctx, canvas, camX) {
    if (!ctx || this.babyJumpDust.length === 0) return;
    ctx.save();
    for (let i = 0; i < this.babyJumpDust.length; i++) {
      const p = this.babyJumpDust[i];
      const sx = p.x - camX;
      const sy = p.y;
      if (canvas && (sx < -30 || sx > canvas.width + 30)) continue;

      // Aura exterior etérea suave
      ctx.fillStyle = `rgba(${p.rgb}, ${p.life * 0.32})`;
      ctx.beginPath();
      ctx.arc(sx, sy, p.size * (1.7 + Math.sin(p.wobble) * 0.3) * p.life, 0, Math.PI * 2);
      ctx.fill();

      // Núcleo luminoso nítido da partícula
      ctx.fillStyle = `rgba(${p.rgb}, ${p.life * 0.92})`;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(0.6, p.size * 0.68 * p.life), 0, Math.PI * 2);
      ctx.fill();

      // Microbrilho estelar de 4 pontas para partículas cintilantes
      if (p.twinkle && p.life > 0.35) {
        const glintArm = p.size * (1.5 + Math.sin(p.wobble * 2) * 0.5) * p.life;
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.life * 0.75})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(sx - glintArm, sy);
        ctx.lineTo(sx + glintArm, sy);
        ctx.moveTo(sx, sy - glintArm);
        ctx.lineTo(sx, sy + glintArm);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  /**
   * Renderiza todas as camadas de partículas
   */
  render(ctx, canvas, camX) {
    this.renderSpeedRibbons(ctx, canvas, camX);
    this.renderBabyJumpDust(ctx, canvas, camX);
  }
}

export function createParticleSystem(options = {}) {
  return new ParticleSystem(options);
}
