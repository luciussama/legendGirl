/** Recuperação de enquadramento exclusivamente visual; não escreve na câmera da simulação. */
export class CameraPresentation {
  constructor() { this.reset(); }
  reset() { this.pose = null; this.layout = null; }
  snapshot() { return { pose: this.pose ? { ...this.pose } : null, layout: this.layout ? { ...this.layout } : null }; }
  restore(saved) { this.pose = saved?.pose ? { ...saved.pose } : null; this.layout = saved?.layout ? { ...saved.layout } : null; }

  mobileFrame({ target, enabled, stable, anticipate, tick, width, height }) {
    if (!enabled || !stable) {
      this.layout = { ...target, tick, key: null, untilTick: tick };
      return target;
    }
    const key = anticipate ? 'subida' : 'reviravolta';
    if (!this.layout) {
      this.layout = { ...target, key, tick, untilTick: tick };
      return target;
    }
    const previous = this.layout;
    const untilTick = previous.key === key ? previous.untilTick : tick + 60;
    if (tick >= untilTick) {
      this.layout = { ...target, key, tick, untilTick };
      return target;
    }
    // Suaviza apenas a entrada do enquadramento; durante os saltos não acrescenta outra camada de damping.
    const dt = Math.max(0, Math.min(1.2, tick - previous.tick));
    const rate = Math.pow(1.015, dt);
    const zoom = Math.max(previous.zoom / rate, Math.min(previous.zoom * rate, target.zoom));
    const step = (from, to, dimension) => {
      const error = to - from;
      const change = Math.abs(error) <= 0.25 ? error : error * (1 - Math.pow(0.65, dt));
      const limit = dimension * 0.02 * dt;
      return from + Math.max(-limit, Math.min(limit, change));
    };
    this.layout = { zoom, x: step(previous.x, target.x, width), y: step(previous.y, target.y, height), key, tick, untilTick };
    return { zoom: this.layout.zoom, x: this.layout.x, y: this.layout.y };
  }

  frame({ x, y, playerX, groundLead, targetY, onGround, active, narrative, tick,
    width, height, cssWidth, cssHeight, zoom }) {
    if (!this.pose || !active) {
      this.pose = { x, y, lead: playerX - x, tick };
      return { x, y };
    }
    const dt = Math.max(0, Math.min(1.2, tick - this.pose.tick));
    if (!dt) return { x: this.pose.x, y: this.pose.y };
    const blend = 1 - Math.pow(0.65, dt);
    const toleranceX = 0.5 * width / Math.max(1, cssWidth) / zoom;
    const toleranceY = 0.5 * height / Math.max(1, cssHeight) / zoom;
    if (narrative) {
      // A narrativa pode reposicionar os atores; apenas o enquadramento interpola essa mudança.
      const move = (from, to, dimension, tolerance) => {
        const error = to - from;
        const delta = Math.abs(error) <= tolerance ? error : error * blend;
        const limit = dimension / zoom * 0.03 * dt;
        return from + Math.max(-limit, Math.min(limit, delta));
      };
      const nextX = move(this.pose.x, x, width, toleranceX);
      const nextY = move(this.pose.y, y, height, toleranceY);
      this.pose = { x: nextX, y: nextY, lead: playerX - nextX, tick };
      return { x: nextX, y: nextY };
    }
    const wantedLead = onGround ? groundLead : playerX - x;
    const leadError = wantedLead - this.pose.lead;
    const lead = Math.abs(leadError) <= toleranceX ? wantedLead : this.pose.lead + leadError * blend;
    const target = onGround ? targetY : y;
    const errorY = target - this.pose.y;
    const wantedY = onGround
      ? (Math.abs(errorY) <= toleranceY ? target : this.pose.y + errorY * blend)
      : y;
    // Limita deslocamentos e encerra a cauda de subpixel após o pouso.
    const clamp = (delta, limit) => Math.max(-limit, Math.min(limit, delta));
    const nextX = this.pose.x + clamp(playerX - lead - this.pose.x, width / zoom * 0.049);
    const nextY = this.pose.y + clamp(wantedY - this.pose.y, height / zoom * 0.049);
    this.pose = { x: nextX, y: nextY, lead: playerX - nextX, tick };
    return { x: nextX, y: nextY };
  }
}
