import { arenaEnemyContact } from './ArenaCombatContact.js';
import { ArenaBoss } from './ArenaBoss.js';
import { ARENA_ENEMIES, renderArenaEnemyPresence } from './ArenaEnemies.js';
import { renderArenaHUD } from './ArenaHUD.js';
import { ArenaAudioProfile } from './ArenaAudioProfile.js';
import { ImpactFX } from './ImpactFX.js';
import { ArenaPlayerController, ARENA_TUNING } from './ArenaPlayerController.js';
import { PlayerController } from './PlayerController.js';
import { BATTLE_TUNING } from './ToyRoomBattle.js';
import { ArenaCamera } from './ArenaCamera.js';
import { ARENA_SCALE } from './ArenaScale.js';
import { renderArenaEnvironment, renderArenaTemple } from './ArenaEnvironment.js';
import { ArenaPlayerRenderer } from './ArenaPlayerRenderer.js';
import { ToyRoomArenaBuilder } from './ToyRoomArenaBuilder.js';
export const ARENA_TRANSFORMATION_DURATION = 180;

/** Fase imaginária que reutiliza o combate da sala sem criar outro jogo. */
export class ToyRoomArenaPhase {
  constructor(room) {
    this.room = room;
    this.battle = room.battle;
    this.state = { status: 'IDLE', elapsed: 0, completed: false };
    this.exploration = null;
    this.boss = new ArenaBoss();
    this.audioProfile = new ArenaAudioProfile(room.audio);
    this.fx = new ImpactFX();
    this.camera = new ArenaCamera();
    this.playerRenderer = new ArenaPlayerRenderer();
    this.assetError = null;
    this.readyPromise = this.playerRenderer.load().catch(error => { this.assetError = error.message; });
    this.layout = new ToyRoomArenaBuilder().build(room);
  }

  get active() { return !['IDLE', 'COMPLETE'].includes(this.state.status); }

  start() {
    if (this.active || this.state.completed) return false;
    this.exploration = this.room.snapshot({ includeArena: false });
    this.state = { status: 'TRANSFORMING', elapsed: 0, completed: false };
    this.room.clearInput();
    this.configurePresentation();
    this.room.gameplayState = 'TOY_ROOM_TRANSFORMING';
    this.audioProfile.transform();
    return true;
  }

  configurePresentation() {
    this.battle.tuning = ARENA_TUNING;
    this.battle.playerController = new ArenaPlayerController();
    this.battle.presentation = {
      enemyContact: arenaEnemyContact,
      enemies: ARENA_ENEMIES,
      renderEnemyPresence: renderArenaEnemyPresence,
      renderHUD: (ctx, layout, state) => renderArenaHUD(ctx, this.room, state, layout, this.boss),
      cameraFrame: layout => this.camera.frame(layout, this.room, this.battle.state),
      onSound: sound => {
        this.audioProfile.sound(sound);
        const kind = sound === 'player_jump' ? 'jump' : sound === 'player_land' ? 'land' : sound === 'player_attack' ? 'trail' : null;
        if (kind) this.fx.emit(kind, this.room.player.x, kind === 'trail' ? 580 : 680, kind === 'land');
      },
      onImpact: (x, y, heavy) => this.fx.emit('impact', x, y, heavy),
      renderFX: ctx => this.fx.render(ctx),
      enemyScale: ARENA_SCALE.enemy,
      renderForeground: ctx => { if(this.battle.state.transition)renderArenaTemple(ctx, this.room, this.layout); },
      renderBackground: ctx => renderArenaEnvironment(ctx, this.room, this.layout, this.state.elapsed),
      renderPlayer: (ctx, state, ground) => this.playerRenderer.render(ctx, this.room, state, ground)
    };
  }

  restoreReality() {
    if (this.state.realityRestored || !this.exploration) return;
    this.room.restore(this.exploration, { preserveArena: true });
    this.state.realityRestored = true;
    this.battle.state = null; this.battle.presentation = null;
    this.battle.tuning = BATTLE_TUNING; this.battle.playerController = new PlayerController();
    this.room.story.state.recurrenceActive = false;
    this.room.story.state.pendingReturns = [];
    if (this.state.outcome === 'VICTORY') {
      for (const toy of this.room.toys) { toy.isOrganized = true; toy.isCarried = false; }
      this.room.player.carriedItem = null;
      this.room.organizedCount = this.room.toys.length;
      this.room.story.state.arenaCompleted = true;
      this.room.victoryBannerActive = true; this.room.victoryBannerTimer = 240;
    }
    this.room.gameplayState = 'TOY_ROOM_GAMEPLAY';
    this.audioProfile.leave();
  }

  finish() {
    if (!this.active) return false;
    this.restoreReality();
    this.battle.state = null;
    this.state.status = 'COMPLETE'; this.state.completed = true;
    this.room.clearInput();
    return true;
  }

  beginReturn() {
    this.state.status = 'RETURNING'; this.state.returnElapsed = 0;
    const s = this.battle.state;
    this.state.outcome = s.mode;
    this.state.result = { outcome:s.mode, hp:s.player.hp, history:JSON.parse(JSON.stringify(s.history)) };
    this.room.clearInput();
  }

  update(dt = 1) {
    if (!this.active) return;
    const step = Math.max(0, Math.min(12, Number.isFinite(dt) ? dt : 1));
    this.state.elapsed += step;
    if (this.state.status === 'RETURNING') {
      this.state.returnElapsed += step;
      this.room.clearInput();
      if (this.state.returnElapsed >= 90) this.restoreReality();
      if (this.state.returnElapsed >= 180) this.finish();
      return;
    }
    if (this.state.status === 'TRANSFORMING') {
      this.room.clearInput();
      if (this.state.elapsed >= ARENA_TRANSFORMATION_DURATION && this.battle.ready && this.playerRenderer.ready && !this.battle.error && !this.assetError) {
        this.state.status = 'COMBAT';
        this.battle.activate();
        this.room.gameplayState = 'TOY_ROOM_ARENA';
        this.audioProfile.enter();
      }
    } else {
      this.boss.update(step, this.battle);
      this.audioProfile.update(step);
      this.fx.update(step);
      this.battle.update(step);
      const s = this.battle.state;
      this.camera.update(step, this.room.player, s.enemy, s.jump, s.combatShake || (this.fx.shake > 0 ? { strength: this.fx.shake, elapsed: 0, duration: 1 } : null));
      if (s.mode === 'VICTORY' && s.ending >= 150) this.beginReturn();
    }
  }
  render() {
    if (!this.active) return;
    if (this.state.status === 'RETURNING') {
      if (this.state.realityRestored) this.room.render({arenaBackdrop:true}); else this.battle.render();
      const { ctx, canvas } = this.room, p = this.state.returnElapsed / 180;
      ctx.save();ctx.fillStyle=`rgba(24,14,38,${Math.sin(p*Math.PI)*0.95})`;ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='#ffe5a6';ctx.textAlign='center';ctx.font='bold 22px Georgia';
      ctx.fillText('Tudo ainda cabe no seu quarto.',canvas.width/2,canvas.height*.45,canvas.width-32);ctx.restore();
      return;
    }
    if (this.state.status !== 'TRANSFORMING') {
      this.battle.render();
      if (this.fx.flash > 0) { this.room.ctx.save(); this.room.ctx.fillStyle = `rgba(255,231,188,${this.fx.flash})`; this.room.ctx.fillRect(0,0,this.room.canvas.width,this.room.canvas.height); this.room.ctx.restore(); }
      return;
    }
    const { ctx, canvas } = this.room;
    const progress = Math.min(1, this.state.elapsed / ARENA_TRANSFORMATION_DURATION);
    const zoom = 1 + Math.sin(progress * Math.PI) * 0.22;
    const shake = Math.sin(this.state.elapsed * 1.9) * 5 * Math.sin(progress * Math.PI);
    ctx.save();
    ctx.translate(canvas.width / 2 + shake, canvas.height / 2);
    ctx.scale(zoom, zoom); ctx.translate(-canvas.width / 2, -canvas.height / 2);
    this.room.render({ arenaBackdrop: true }); ctx.restore();
    ctx.save(); ctx.fillStyle = `rgba(20,10,35,${progress * 0.85})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffe9ac'; ctx.textAlign = 'center'; ctx.font = 'bold 24px Georgia';
    ctx.fillText(this.assetError || this.battle.error || 'O quarto desperta na sua imaginação…', canvas.width / 2, canvas.height * 0.46, canvas.width - 32);
    ctx.restore();
  }

  snapshot() { return JSON.parse(JSON.stringify({ version: 1, state: this.state, exploration: this.exploration, camera: this.camera.snapshot(), fx: this.fx.snapshot(), audio: this.audioProfile.snapshot(), boss: this.boss.snapshot() })); }
  restore(saved, roomSave = null) {
    this.audioProfile.leave({ resume: false });
    this.state = { status: 'IDLE', elapsed: 0, completed: false };
    this.camera = new ArenaCamera(); this.fx = new ImpactFX(); this.boss = new ArenaBoss();
    this.audioProfile = new ArenaAudioProfile(this.room.audio);
    this.exploration = null;
    this.battle.presentation = null; this.battle.tuning = BATTLE_TUNING; this.battle.playerController = new PlayerController();
    if (!saved && roomSave?.toyRoomBattle) {
      // Saves anteriores não tinham uma posição de retorno: conserva os brinquedos e usa o ponto inicial seguro.
      const exploration = JSON.parse(JSON.stringify(roomSave));
      delete exploration.toyRoomArena; exploration.toyRoomBattle = null;
      exploration.player.x = 300; exploration.player.y = 650;
      exploration.cameraX = 0; exploration.cameraY = 0;
      saved = { state: { status:'COMBAT', elapsed:0, completed:false }, exploration, audio:{mode:'ARENA'} };
    }
    if (saved) {
      if (!['IDLE','TRANSFORMING','COMBAT','RETURNING','COMPLETE'].includes(saved.state?.status))
        throw new TypeError('Estado da arena inválido no save.');
      this.state = JSON.parse(JSON.stringify(saved.state));
      this.camera.restore(saved.camera); this.fx.restore(saved.fx); this.boss.restore(saved.boss);
      this.audioProfile.restore(saved.audio); this.exploration = saved.exploration;
      if (this.active && !this.state.realityRestored) this.configurePresentation();
    } else if (roomSave?.toyRoomStory?.arenaCompleted) {
      this.state = {status:'COMPLETE',elapsed:0,completed:true};
    }
    if (this.state.completed) { this.room.audio?.startToyRoomMusic?.(); this.room.audio?.setToyRoomMusicFade?.(1); }
    this.layout = new ToyRoomArenaBuilder().build(this.room);
    this.room.clearInput();
  }
  attack() {
    if (this.state.status !== 'COMBAT') return false;
    const s=this.battle.state;
    if (s.mode === 'VICTORY') { if(s.ending>=90)this.beginReturn();return true; }
    if (s.mode === 'DEFEAT') {
      if (s.ending < 90) return false;
      this.battle.state=null;this.boss=new ArenaBoss();this.fx=new ImpactFX();this.battle.activate();
      return true;
    }
    return this.battle.attack();
  }
}
