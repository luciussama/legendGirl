import { pickUpToy, releaseCarriedToy, storeToyInChest } from './ToyRoomToyActions.js';

/** Decide coleta, armazenamento, soltura e disponibilidade do botão de ação. */
export class ToyRoomInteraction {
  constructor(context) { this.context = context; }

  triggerAction() {
    if (!this.context.isInputEnabled() || this.context.story?.inputLocked) return;
    if (this.context.arena?.active) { this.context.arena.attack(); return; }
    if (this.context.battle?.state) { this.context.battle.attack(); return; }
    const now = performance.now();
    if (now - this.context.lastActionTime < this.context.ACTION_DEBOUNCE_MS) {
      return;
    }
    this.context.lastActionTime = now;

    // Carregando um item -> soltar ou guardar no baú
    if (this.context.player.carriedItem) {
      const item = this.context.player.carriedItem;
      const chest = this.context.furniture.find(f => f.id === 'toy-chest');
      const chestCenterX = chest.x + chest.w / 2;
      const chestCenterY = chest.y + chest.h / 2;
      const distToChest = Math.hypot(this.context.player.x - chestCenterX, this.context.player.y - chestCenterY);

      if (distToChest < 160) {
        storeToyInChest(this.context.player, chest);

        if (this.context.audio && this.context.audio.playOrganizeChime) this.context.audio.playOrganizeChime();
        chest.lidOpen = 1.0;
        chest.glowAlpha = 1.0;
        this.context.spawnSparkles(chestCenterX, chest.y + 30, 24, '#fde047');
        this.context.spawnConfetti(chestCenterX, chest.y + 30, 30);

        this.context.story?.onToyStored(item);
        this.context.organizedCount++;
        if (this.context.organizedCount >= this.context.toys.length && !this.context.story?.state.recurrenceActive) {
          this.context.victoryBannerActive = true;
          this.context.victoryBannerTimer = 360;
          if (this.context.audio && this.context.audio.playToyRoomVictory) this.context.audio.playToyRoomVictory();
          if (this.context.uiFeedback) {
            this.context.uiFeedback.innerText = '🌟 PARABÉNS! Todos os brinquedos foram carinhosamente guardados no baú!';
            this.context.uiFeedback.style.color = '#fde047';
          }
        } else {
          if (this.context.uiFeedback) {
            this.context.uiFeedback.innerText = `✨ ${item.name} guardado no baú! (${this.context.organizedCount}/${this.context.toys.length} arrumados)`;
            this.context.uiFeedback.style.color = '#a7f3d0';
          }
        }
        return;
      }

      // Caso contrário: Solta o brinquedo à frente do jogador no chão
      const dropDist = 42;
      let dropX = this.context.player.x + (this.context.player.facing === 'left' ? -dropDist : dropDist);
      let dropY = this.context.player.y;

      dropX = Math.max(90, Math.min(this.context.ROOM_W - 90, dropX));
      dropY = Math.max(260, Math.min(this.context.ROOM_H - 90, dropY));

      releaseCarriedToy(this.context.player, { x: dropX, y: dropY });

      if (this.context.audio && this.context.audio.playDropSound) this.context.audio.playDropSound();
      this.context.spawnSparkles(dropX, dropY, 8, '#fef08a');
      if (this.context.uiFeedback) {
        this.context.uiFeedback.innerText = `📦 Você colocou ${item.name} no chão.`;
        this.context.uiFeedback.style.color = '#fef08a';
      }
      return;
    }

    // Não está carregando -> Encontra o brinquedo mais próximo para pegar (raio amplo de 88px)
    let closestToy = null;
    let closestDist = 88;

    for (let i = 0; i < this.context.toys.length; i++) {
      const t = this.context.toys[i];
      if (t.isOrganized) continue;
      const d = Math.hypot(this.context.player.x - t.x, this.context.player.y - t.y);
      if (d < closestDist) {
        closestDist = d;
        closestToy = t;
      }
    }

    if (closestToy) {
      pickUpToy(this.context.player, closestToy);
      if (this.context.tutorial.active) this.context.tutorial.finish();
      if (this.context.audio && this.context.audio.playPickUpSound) this.context.audio.playPickUpSound();
      this.context.spawnSparkles(this.context.player.x, this.context.player.y - 30, 16, '#38bdf8');
      if (this.context.uiFeedback) {
        this.context.uiFeedback.innerText = `✋ Você pegou: ${closestToy.name}! Leve até o Baú de Brinquedos!`;
        this.context.uiFeedback.style.color = '#38bdf8';
      }
      return;
    }

    this.context.story?.attack();
  }


  updateProximity() {
    // Verificação de proximidade interativa para enriquecer o feedback do Botão de Ação
    let canInteract = false;
    let isNearChest = false;

    const chest = this.context.furniture.find(f => f.id === 'toy-chest');
    if (chest) {
      const chestCenterX = chest.x + chest.w / 2;
      const chestCenterY = chest.y + chest.h / 2;
      const distToChest = Math.hypot(this.context.player.x - chestCenterX, this.context.player.y - chestCenterY);
      if (distToChest < 160) {
        isNearChest = true;
        if (this.context.player.carriedItem) canInteract = true;
      }
    }

    if (!this.context.player.carriedItem) {
      for (let i = 0; i < this.context.toys.length; i++) {
        const t = this.context.toys[i];
        if (!t.isOrganized && Math.hypot(this.context.player.x - t.x, this.context.player.y - t.y) < 88) {
          canInteract = true;
          break;
        }
      }
    }

    this.context.canInteract = canInteract;
    this.context.isNearChest = isNearChest;

    return chest;
  }
}
