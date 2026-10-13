const LIMIT = 80;
/** Efeitos determinísticos e limitados; nenhum efeito altera a simulação. */
export class ImpactFX {
  constructor() { this.particles = []; this.flash = 0; this.shake = 0; this.serial = 0; }
  emit(kind, x, y, heavy = false) {
    const count = kind === 'impact' ? 18 : kind === 'trail' ? 3 : 10;
    this.serial++;
    for (let i = 0; i < count; i++) {
      const angle = (i / count * Math.PI * 2) + this.serial * 0.7;
      const speed = (heavy ? 5 : 3) + (i % 3);
      this.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: -Math.abs(Math.sin(angle)) * speed,
        life: 26 + i % 8, maxLife: 34, size: kind === 'trail' ? 3 : heavy ? 7 : 4, kind });
    }
    if (this.particles.length > LIMIT) this.particles.splice(0, this.particles.length - LIMIT);
    if (kind === 'impact' || kind === 'land') { this.flash = heavy ? 0.2 : 0.08; this.shake = heavy ? 9 : 5; }
  }
  update(dt) {
    for (const p of this.particles) { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 0.1 * dt; }
    this.particles = this.particles.filter(p => p.life > 0);
    this.flash = Math.max(0, this.flash - dt * 0.015);
    this.shake = Math.max(0, this.shake - dt * 0.8);
  }
  render(ctx) {
    ctx.save();
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.kind === 'impact' ? '#ffdfa0' : p.kind === 'trail' ? '#fff1cf' : '#d8b28b';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  snapshot() { return JSON.parse(JSON.stringify({particles:this.particles,flash:this.flash,shake:this.shake,serial:this.serial})); }
  restore(saved) { if (saved) { this.particles = (saved.particles || []).slice(-LIMIT); this.flash = saved.flash || 0; this.shake = saved.shake || 0; this.serial = saved.serial || 0; } }
}
