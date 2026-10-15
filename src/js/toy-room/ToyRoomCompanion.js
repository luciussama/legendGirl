import { nearestToyGuide } from './ToyRoomOrientation.js';
import { toyGuideBlend } from '../state/GameDifficulty.js';

/** Atualiza guia, voo e rastro da fada com os atores do quadro atual. */
export function updateToyRoomCompanion({ player, fairy, toys, tutorial, story, gameDifficulty, guideToy }, dt) {
  // Atualização da fadinha companheira
  const fairyHoverOffsetX = player.facing === 'left' ? 24 : -24;
  fairy.targetX = player.x + fairyHoverOffsetX + Math.cos(fairy.flutterTime * 0.08) * 12;
  fairy.targetY = player.y - 32 + Math.sin(fairy.flutterTime * 0.12) * 8;
  tutorial.update(dt);
  // O tutorial conserva sua orientação; no gameplay o alvo depende da protagonista.
  guideToy = nearestToyGuide(player, toys, guideToy);
  const guide = story.guidePosition() || tutorial.guidePosition() || (guideToy && {
    x: guideToy.x, y: guideToy.y - 105
  });
  if (guide) { fairy.targetX = guide.x; fairy.targetY = guide.y; }

  fairy.flutterTime += dt;
  const guideBlend = guide ? toyGuideBlend(gameDifficulty, dt) : 0.12 * dt;
  fairy.x += (fairy.targetX - fairy.x) * guideBlend;
  fairy.y += (fairy.targetY - fairy.y) * guideBlend;

  if (Math.random() < 0.4) {
    fairy.particles.push({
      x: fairy.x + (Math.random() - 0.5) * 12,
      y: fairy.y + (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8 - 0.4,
      alpha: 0.85,
      radius: 1.5 + Math.random() * 2,
      color: '#fef08a'
    });
  }

  for (let i = fairy.particles.length - 1; i >= 0; i--) {
    const p = fairy.particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.alpha -= 0.035 * dt;
    if (p.alpha <= 0) {
      fairy.particles.splice(i, 1);
    }
  }

  return guideToy;
}
