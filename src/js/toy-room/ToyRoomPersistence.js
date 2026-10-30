/** Preserva o formato dos saves e a ordem de restauração da sala e dos modos. */
export class ToyRoomPersistence {
  constructor(context) { this.context = context; }

  snapshot({ includeArena = true } = {}) {
    const keys = ['cameraX', 'cameraY', 'introAlpha', 'introBannerTimer', 'victoryBannerActive',
      'victoryBannerTimer', 'player', 'fairy', 'furniture', 'toys', 'organizedCount', 'toyRoomTutorialCompleted'];
    const saved = JSON.parse(JSON.stringify(Object.fromEntries(keys.map(key => [key, this.context[key]]))));
    saved.carriedItemId = this.context.player.carriedItem?.id ?? null;
    saved.toyRoomStory = this.context.story.snapshot();
    saved.toyRoomBattle = this.context.battle.snapshot();
    if (includeArena && this.context.arena) saved.toyRoomArena = this.context.arena.snapshot();
    if (includeArena && this.context.chase?.campaign) saved.toyRoomChaseCampaign = this.context.chase.snapshot();
    if (includeArena && this.context.garden?.campaign) saved.toyRoomGarden = this.context.garden.snapshot();
    if(includeArena&&this.context.epilogue?.active&&this.context.epilogue.campaign)saved.toyRoomEpilogue=this.context.epilogue.snapshot();
    return saved;
  }

  restore(saved, { preserveArena = false } = {}) {
    if(!preserveArena)this.context.epilogue=null;
    if (!preserveArena && this.context.garden) {this.context.garden.destroy();this.context.garden=null;}
    if (!preserveArena && this.context.chase) {
      this.context.chase.destroy();
      this.context.chase = null;
    }
    const keys = ['cameraX', 'cameraY', 'introAlpha', 'introBannerTimer', 'victoryBannerActive',
      'victoryBannerTimer', 'player', 'fairy', 'furniture', 'toys', 'organizedCount', 'toyRoomTutorialCompleted'];
    for (const key of keys) {
      if (key in saved) this.context[key] = JSON.parse(JSON.stringify(saved[key]));
    }
    // Saves antigos armazenavam a direção de movimento em facing.
    this.context.player.direction ??= this.context.player.facing;
    if (this.context.player.facing !== 'left' && this.context.player.facing !== 'right') {
      const horizontal = Math.cos(this.context.player.facingAngle ?? Math.PI / 2);
      this.context.player.facing = horizontal < -1e-6 ? 'left' : 'right';
    }
    this.context.player.carriedItem = this.context.toys.find(toy => toy.id === saved.carriedItemId) || null;
    this.context.story.restore(saved.toyRoomStory);
    this.context.clearInput();
    this.context.lastActionTime = 0;
    this.context.tutorial.active = false;
    this.context.gameplayState = 'TOY_ROOM_GAMEPLAY';
    this.context.battle.restore(saved.toyRoomBattle);
    if (!preserveArena) this.context.arena?.restore(saved.toyRoomArena, saved);
    if (saved.toyRoomGarden) {
      this.context.startGarden(saved.toyRoomGarden);
    } else if(saved.toyRoomEpilogue){
      this.context.startEpilogue(saved.toyRoomEpilogue);
    } else if (saved.toyRoomChaseCampaign) {
      if (this.context.arena?.active || !this.context.story.state.arenaCompleted)
        throw new TypeError('Save de campanha incompatível com a etapa da arena.');
      this.context.startChaseCampaign(saved.toyRoomChaseCampaign);
    } else if (this.context.arena?.active) {
      this.context.gameplayState = this.context.arena.state.status === 'TRANSFORMING' ? 'TOY_ROOM_TRANSFORMING' : 'TOY_ROOM_ARENA';
    } else if (this.context.battle.state) this.context.gameplayState = 'TOY_ROOM_BATTLE';
    else if (!this.context.toyRoomTutorialCompleted && !this.context.story.swordEquipped) this.context.startTutorial();
  }

}
