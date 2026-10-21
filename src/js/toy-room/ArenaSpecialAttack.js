/** Especial único da sequência inteira da arena; relógio em quadros de 60 Hz. */
export const ARENA_SPECIAL = Object.freeze({ charge: 78, pullback: 88, launch: 94, impact: 118, fade: 138, duration: 156 });
export const RAINBOW_COLORS = Object.freeze(['#ff637d', '#ffa34e', '#ffe978', '#80edb1', '#74dbff', '#9292ff', '#e49aff']);
const clamp01 = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp01(value); return t * t * (3 - 2 * t); };

export function beginArenaSpecial(battle) {
  const s = battle.state;
  if (!battle.presentation || !battle.ready || battle.error || !s || s.mode !== 'BATTLE'
    || s.transition || s.specialUsed || s.specialAttack || s.enemy.hp <= 0
    || s.player.hp <= 0 || s.playerHitTime > 0 || s.attackTime > 0) return false;
  battle.faceEnemy();
  s.specialUsed = true;
  s.specialAttack = { elapsed: 0, direction: battle.room.player.facing === 'left' ? -1 : 1, impacted: false };
  s.attackTime = 0; s.guarding = false; s.crouching = false;
  s.hitPause = 0; s.impact = null; s.combatShake = null;
  battle.room.story.state.attackElapsed = 0;
  battle.room.clearInput();
  s.history.push({ event: 'SPECIAL_BEGIN', enemy: s.enemy.actor });
  battle.playCombatSound('heart_gain');
  return true;
}

/** Suspende física e IA durante a encenação; o dano acontece quando o raio chega. */
export function updateArenaSpecial(battle, dt) {
  const s = battle.state, special = s.specialAttack;
  if (!special) return false;
  const previous = special.elapsed;
  special.elapsed = Math.min(ARENA_SPECIAL.duration, special.elapsed + dt);
  battle.room.player.isMoving = false;
  if (previous < ARENA_SPECIAL.pullback && special.elapsed >= ARENA_SPECIAL.pullback) battle.playCombatSound('player_attack');
  if (!special.impacted && special.elapsed >= ARENA_SPECIAL.impact) {
    special.impacted = true;
    const e = s.enemy, before = e.hp;
    // O Urso nunca morre por este golpe, inclusive quando já tem apenas um coração.
    e.hp = e.actor === 'bear' ? 1 : 0;
    e.pressureChain = 0; e.responseAttack = false; e.knockbackVelocity = 0;
    e.attack = null; e.landed = false; e.blocked = false;
    if (e.actor === 'bear') e.enrage = true;
    battle.setEnemyState(e.hp === 0 ? 'DEATH' : 'HIT');
    battle.startImpact('enemy', e.x, battle.tuning.ground - 100, special.direction, true);
    battle.playCombatSound('sword_impact');
    battle.playCombatSound(`${e.actor}_${e.hp === 0 ? 'death' : 'hit'}`);
    s.history.push({ event: 'SPECIAL_HIT', enemy: e.actor, damage: before - e.hp, enemyHp: e.hp });
  }
  if (special.elapsed >= ARENA_SPECIAL.duration) {
    s.specialAttack = null; s.hitPause = 0; s.impact = null; s.combatShake = null;
    s.cooldown = battle.tuning.swordCooldown;
    // Evita reproduzir um ataque comum interrompido ao sair da sequência.
    s.playerAnimation = null;
    battle.room.clearInput();
  }
  return true;
}

/** Enquadramento do rosto com retorno rápido ao panorama antes da lâmina avançar. */
export function specialCameraFrame(frame, room, state) {
  const special = state.specialAttack;
  if (!special) return frame;
  const age = special.elapsed;
  const zoom = smooth(age / 44) * (1 - smooth((age - ARENA_SPECIAL.charge) / (ARENA_SPECIAL.pullback - ARENA_SPECIAL.charge)));
  const closeScale = Math.min((frame.right - frame.left) / 135, (frame.bottom - frame.top) / 110);
  const scale = frame.scale + (Math.max(frame.scale, closeScale) - frame.scale) * zoom;
  const faceX = room.player.x + special.direction * 19;
  const faceY = 690 - state.jump - 145;
  return { ...frame, scale,
    ox: frame.ox + ((frame.left + frame.right) / 2 - faceX * scale - frame.ox) * zoom,
    oy: frame.oy + ((frame.top + frame.bottom) / 2 - faceY * scale - frame.oy) * zoom };
}

/** Aura sobre a lâmina existente, sem substituir a arte da personagem. */
export function renderSpecialSwordAura(ctx, state) {
  const special = state.specialAttack;
  if (!special) return;
  const age = special.elapsed, swinging = age >= ARENA_SPECIAL.pullback;
  const alpha = age < ARENA_SPECIAL.fade ? 1 : 1 - clamp01((age - ARENA_SPECIAL.fade) / 18);
  ctx.save(); ctx.scale(special.direction, 1); ctx.globalAlpha *= alpha;
  ctx.lineCap = 'round';
  const from = swinging ? [60, -90] : [28, -86], to = swinging ? [143, -90] : [94, -126];
  const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const nx = -(to[1] - from[1]) / length, ny = (to[0] - from[0]) / length;
  for (let i = 0; i < RAINBOW_COLORS.length; i++) {
    const offset = (i - 3) * 3;
    ctx.strokeStyle = RAINBOW_COLORS[i]; ctx.shadowColor = RAINBOW_COLORS[i]; ctx.shadowBlur = 5;
    ctx.lineWidth = 3.5; ctx.globalAlpha = alpha * .65;
    ctx.beginPath(); ctx.moveTo(from[0] + nx * offset, from[1] + ny * offset);
    ctx.lineTo(to[0] + nx * offset, to[1] + ny * offset); ctx.stroke();
  }
  ctx.shadowBlur = 0; ctx.globalAlpha = alpha * .8;
  for (let i = 0; i < 14; i++) {
    const t = i / 13, orbit = age * .12 + i * 2.4;
    const x = from[0] + (to[0] - from[0]) * t + Math.cos(orbit) * 10;
    const y = from[1] + (to[1] - from[1]) * t + Math.sin(orbit) * 10;
    ctx.fillStyle = RAINBOW_COLORS[i % 7]; ctx.beginPath(); ctx.arc(x, y, 1.5 + Math.sin(orbit) ** 2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

export function renderArenaSpecialBeam(ctx, room, state, ground) {
  const special = state.specialAttack;
  if (!special || special.elapsed < ARENA_SPECIAL.launch) return;
  const age = special.elapsed, travel = clamp01((age - ARENA_SPECIAL.launch) / (ARENA_SPECIAL.impact - ARENA_SPECIAL.launch));
  const alpha = 1 - smooth((age - ARENA_SPECIAL.fade) / (ARENA_SPECIAL.duration - ARENA_SPECIAL.fade));
  const x = room.player.x + special.direction * 138, y = ground - state.jump - 90;
  const endX = x + (state.enemy.x - x) * travel, endY = y + (ground - 100 - y) * travel;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.lineCap = 'round';
  ctx.shadowColor = '#b3c9ff'; ctx.shadowBlur = 24;
  for (let i = 0; i < 7; i++) {
    const offset = (i - 3) * 5;
    ctx.strokeStyle = RAINBOW_COLORS[i]; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(x, y + offset); ctx.lineTo(endX, endY + offset); ctx.stroke();
  }
  ctx.shadowBlur = 0; ctx.strokeStyle = '#fff9ec'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(endX, endY); ctx.stroke();
  if (special.impacted) {
    const radius = 22 + (age - ARENA_SPECIAL.impact) * 3;
    for (let i = 0; i < 7; i++) {
      ctx.strokeStyle = RAINBOW_COLORS[i]; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(state.enemy.x, ground - 100, radius + i * 5, 0, Math.PI * 2); ctx.stroke();
    }
  }
  ctx.restore();
}

export const ARENA_SPECIAL_CLOSEUP_FILE = 'girl/special/eyes-power-v1.png';

/** Corte de anime em coordenadas de tela: ambos os olhos permanecem visíveis. */
export function renderArenaSpecialCloseup(ctx, canvas, state, image) {
  const special = state?.specialAttack;
  if (!special || !image || special.elapsed < 12 || special.elapsed >= ARENA_SPECIAL.pullback) return;
  const age = special.elapsed;
  const entrance = smooth((age - 12) / 8);
  const exit = smooth((age - ARENA_SPECIAL.charge) / (ARENA_SPECIAL.pullback - ARENA_SPECIAL.charge));
  const alpha = entrance * (1 - exit);
  const { width, height } = canvas;
  const progress = clamp01((age - 20) / (ARENA_SPECIAL.charge - 20));
  const panelHeight = Math.min(height * .72, width / 2.25);
  const panelY = (height - panelHeight) / 2;
  const sourceWidth = image.width * (1 - progress * .07);
  const sourceHeight = Math.min(image.height, sourceWidth * panelHeight / width);
  const sourceY = Math.max(0, Math.min(image.height - sourceHeight, image.height * .575 - sourceHeight / 2));
  const slide = (1 - entrance) * width * .18 - exit * width * .08;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = '#100b1b'; ctx.fillRect(0, 0, width, height);
  // Raias de energia enquadram o olhar sem atravessar as pupilas.
  for (let i = 0; i < 28; i++) {
    const x = ((i * .137 + age * .003) % 1) * width;
    const top = i % 2 === 0;
    const y = top ? panelY : panelY + panelHeight;
    ctx.strokeStyle = RAINBOW_COLORS[i % 7]; ctx.globalAlpha = alpha * (.1 + progress * .18);
    ctx.lineWidth = Math.max(1, width / 900);
    ctx.beginPath(); ctx.moveTo(x, top ? 0 : height);
    ctx.lineTo(width / 2 + (x - width / 2) * .72, y); ctx.stroke();
  }
  ctx.globalAlpha = alpha;
  ctx.save();
  ctx.translate(slide, 0);
  ctx.beginPath(); ctx.moveTo(0, panelY + 8); ctx.lineTo(width, panelY);
  ctx.lineTo(width, panelY + panelHeight - 8); ctx.lineTo(0, panelY + panelHeight); ctx.closePath(); ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(image, (image.width - sourceWidth) / 2, sourceY, sourceWidth, sourceHeight,
    0, panelY, width, panelHeight);
  const shade = ctx.createLinearGradient(0, 0, width, 0);
  shade.addColorStop(0, 'rgba(12,4,26,.65)'); shade.addColorStop(.18, 'rgba(12,4,26,0)');
  shade.addColorStop(.82, 'rgba(12,4,26,0)'); shade.addColorStop(1, 'rgba(12,4,26,.65)');
  ctx.fillStyle = shade; ctx.fillRect(0, panelY, width, panelHeight);
  ctx.restore();
  // A abertura e o fechamento rápidos substituem a ampliação do sprite como foco do poder.
  ctx.strokeStyle = '#e8c6ff'; ctx.lineWidth = Math.max(1, height / 550);
  ctx.globalAlpha = alpha * .65;
  ctx.beginPath(); ctx.moveTo(0, panelY + 8); ctx.lineTo(width, panelY);
  ctx.moveTo(0, panelY + panelHeight); ctx.lineTo(width, panelY + panelHeight - 8); ctx.stroke();
  ctx.restore();
}
