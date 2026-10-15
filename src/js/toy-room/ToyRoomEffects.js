/** Efeitos da exploração; opera sobre as coleções atuais, mantendo a ordem aleatória. */
export function spawnToyRoomSparkles(sparkles, x, y, count = 12, hue = '#facc15') {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.0 + Math.random() * 3.5;
    sparkles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 1.5 + Math.random() * 2.5,
      alpha: 1.0,
      decay: 0.02 + Math.random() * 0.03,
      color: hue
    });
  }
}

export function spawnToyRoomConfetti(confetti, x, y, count = 35) {
  const colors = ['#f43f5e', '#38bdf8', '#facc15', '#10b981', '#c084fc', '#fb923c'];
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
    const speed = 2.5 + Math.random() * 5.0;
    confetti.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: 5 + Math.random() * 5,
      h: 7 + Math.random() * 7,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.3,
      color: colors[(Math.random() * colors.length) | 0],
      alpha: 1.0,
      decay: 0.012 + Math.random() * 0.015
    });
  }
}


export function initializeToyRoomSunMotes(sunMotes, width, height) {
  for (let i = 0; i < 45; i++) {
    sunMotes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.15 - Math.random() * 0.25,
      radius: 1.2 + Math.random() * 2.2,
      alpha: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2
    });
  }

}

export function updateToyRoomEffects({ chest, sparkles, confetti, footstepPuffs, sunMotes, width, height }, dt) {
  // Animação da tampa do baú
  if (chest) {
    if (chest.lidOpen > 0) chest.lidOpen = Math.max(0, chest.lidOpen - 0.015 * dt);
    if (chest.glowAlpha > 0) chest.glowAlpha = Math.max(0, chest.glowAlpha - 0.02 * dt);
  }

  // Atualização de partículas
  for (let i = sparkles.length - 1; i >= 0; i--) {
    const s = sparkles[i];
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.alpha -= s.decay * dt;
    if (s.alpha <= 0) sparkles.splice(i, 1);
  }

  for (let i = confetti.length - 1; i >= 0; i--) {
    const c = confetti[i];
    c.x += c.vx * dt;
    c.y += c.vy * dt;
    c.vy += 0.08 * dt;
    c.rot += c.vrot * dt;
    c.alpha -= c.decay * dt;
    if (c.alpha <= 0) confetti.splice(i, 1);
  }

  for (let i = footstepPuffs.length - 1; i >= 0; i--) {
    const fp = footstepPuffs[i];
    fp.alpha -= 0.03 * dt;
    fp.radius += 0.2 * dt;
    if (fp.alpha <= 0) footstepPuffs.splice(i, 1);
  }

  for (let i = 0; i < sunMotes.length; i++) {
    const sm = sunMotes[i];
    sm.x += sm.vx * dt;
    sm.y += sm.vy * dt;
    sm.phase += 0.03 * dt;
    if (sm.y < 200) sm.y = height - 50;
    if (sm.x < 50) sm.x = width - 50;
    if (sm.x > width - 50) sm.x = 50;
  }

}
