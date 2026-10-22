import { FLOOR_Y } from '../config.js';

/** Enquadramento de gameplay por viewport: só a coordenada horizontal pode rolar. */
export function getDarkRoomScrollFrame({ x, width, height }) {
  const y = width <= 600 && height > FLOOR_Y + 90
    ? FLOOR_Y - (height - 110)
    : Math.min(0, FLOOR_Y - height + 16);
  return { x, y };
}

/** Mantém o contrato do retorno com a mesma altura fixa das demais seções. */
export function getPhase3ScrollFrame(viewport) {
  return getDarkRoomScrollFrame(viewport);
}

/** Pose fixa no gameplay e interpolação exclusivamente narrativa, sem escrever na simulação. */
export class CameraPresentation {
  constructor() { this.reset(); }
  reset() { this.pose = null; this.layout = null; }
  snapshot() { return { pose: this.pose ? { ...this.pose } : null, layout: this.layout ? { ...this.layout } : null }; }
  restore(saved) { this.pose = saved?.pose ? { ...saved.pose } : null; this.layout = saved?.layout ? { ...saved.layout } : null; }

  mobileFrame({ target, enabled, stable, anticipate, tick, width, height, fixed = false }) {
    if (fixed || !enabled || !stable) {
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

  /** Só interpola cortes narrativos; gameplay devolve a pose fixa recebida. */
  frame({ x, y, active, narrative, tick, width, height, cssWidth, cssHeight, zoom }) {
    if (!this.pose || !active || !narrative) {
      this.pose = { x, y, lead: 0, tick };
      return { x, y };
    }
    const dt = Math.max(0, Math.min(1.2, tick - this.pose.tick));
    if (!dt) return { x: this.pose.x, y: this.pose.y };
    const blend = 1 - Math.pow(0.65, dt);
    const move = (from, to, dimension, cssDimension) => {
      const tolerance = 0.5 * dimension / Math.max(1, cssDimension) / zoom;
      const error = to - from;
      const delta = Math.abs(error) <= tolerance ? error : error * blend;
      const limit = dimension / zoom * 0.03 * dt;
      return from + Math.max(-limit, Math.min(limit, delta));
    };
    const nextX = move(this.pose.x, x, width, cssWidth);
    const nextY = move(this.pose.y, y, height, cssHeight);
    this.pose = { x: nextX, y: nextY, lead: 0, tick };
    return { x: nextX, y: nextY };
  }
}
