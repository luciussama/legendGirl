// Dados compartilhados pelo combate e seus perfis; não carregam imagens nem criam a fase.
export const BATTLE_ORDER = ['train', 'robot', 'dinosaur', 'bear'];
export const BATTLE_PLAYER_VISUAL_SCALE = 2;
// Parâmetros provisórios autorizados para avaliação, em quadros de 60 Hz.
export const BATTLE_TUNING = { left: 160, right: 1440, ground: 690, speed: 4,
  jumpSpeed: 8.5, gravity: 0.3, swordRange: 112, swordCooldown: 26,
  windup: 54, active: 18, recovery: 36, immunity: 48, hitRecovery: 28, death: 60 };
export const BATTLE_TRANSITION_DURATION = 120;
