import { PlayerController } from './PlayerController.js';
import { BATTLE_TUNING } from './ToyRoomBattle.js';
import { ARENA_SWORD } from './ArenaCombatRules.js';

/** Parâmetros próprios da fantasia; não modifica a configuração da exploração. */
export const ARENA_TUNING = Object.freeze({ ...BATTLE_TUNING,
  speed: 6.2, jumpSpeed: 11, gravity: 0.32, swordRange: 209, swordContactScale: 1.1, swordCooldown: ARENA_SWORD.cooldown, hitRecovery: 24, attackScale: 1.8,
  swordDuration: ARENA_SWORD.duration, swordWindup: ARENA_SWORD.windup, swordActive: ARENA_SWORD.active,
  attackMoveScale: 0.2, recoveryMoveScale: 0.55, blockRecovery: ARENA_SWORD.blockRecovery,
  // Dois passos de 14 quadros na velocidade da menina: separação clara após o golpe.
  knockbackDistance: 6.2 * 14 * 2 });
export class ArenaPlayerController extends PlayerController {
  update(battle, dt) {
    super.update(battle, dt);
    battle.state.stride = battle.room.player.isMoving ? Math.sin(battle.state.elapsed * 0.3) : 0;
  }
}
