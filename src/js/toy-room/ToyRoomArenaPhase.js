import { beginArenaSpecial, renderArenaSpecialBeam } from './arenaSpecialAttack.js';
import { beginArenaPlayerAttack, updateArenaPlayerAnimation } from './arenaPlayerAnimation.js';
import { arenaEnemyContact } from './arenaCombatContact.js';
import { ArenaBoss } from './ArenaBoss.js';
import { renderArenaEnemyPresence } from './arenaEnemies.js';
import { renderArenaHUD } from './arenaHUD.js';
import { ArenaAudioProfile } from './ArenaAudioProfile.js';
import { ImpactFX } from './ImpactFX.js';
import { ArenaPlayerController } from './ArenaPlayerController.js';
import { PlayerController } from './PlayerController.js';
import { BATTLE_ORDER, BATTLE_TUNING } from './battleConfig.js';
import { ArenaCamera } from './ArenaCamera.js';
import { ARENA_SCALE } from './arenaScale.js';
import { renderArenaEnvironment, renderArenaTemple } from './arenaEnvironment.js';
import { ArenaPlayerRenderer } from './ArenaPlayerRenderer.js';
import { ToyRoomArenaBuilder } from './ToyRoomArenaBuilder.js';
import { arenaDifficulty } from './arenaDifficulty.js';
export const ARENA_TRANSFORMATION_DURATION = 180;
export const ARENA_VICTORY_FADE_DURATION = 30;

/** Fase imaginária que reutiliza o combate da sala sem criar outro jogo. */
export class ToyRoomArenaPhase {
  /** Monta os sistemas da arena e prepara os recursos sem iniciar o combate. */
  constructor(room) {
    this.room = room;
    this.battle = room.battle;
    this.state = {
      status: 'IDLE',
      elapsed: 0,
      completed: false,
    };
    this.exploration = null;
    this.boss = new ArenaBoss();
    this.audioProfile = new ArenaAudioProfile(room.audio);
    this.fx = new ImpactFX();
    this.camera = new ArenaCamera();
    this.playerRenderer = new ArenaPlayerRenderer();
    this.assetError = null;
    this.readyPromise = this.playerRenderer.load().catch((error) => {
      this.assetError = error.message;
    });
    this.layout = new ToyRoomArenaBuilder().build(room);
  }

  /** Indica se a transformação, o combate ou o retorno ainda estão em andamento. */
  get active() {
    return !['IDLE', 'COMPLETE'].includes(this.state.status);
  }

  /** Captura a exploração e inicia a transição; retorna falso se a arena não puder começar. */
  start() {
    if (this.active || this.state.completed) return false;
    this.exploration = this.room.snapshot({
      includeArena: false,
    });
    this.state = {
      status: 'TRANSFORMING',
      elapsed: 0,
      completed: false,
    };
    this.room.clearInput();
    this.configurePresentation();
    this.room.gameplayState = 'TOY_ROOM_TRANSFORMING';
    this.audioProfile.transform();
    return true;
  }

  /** Instala regras e callbacks de apresentação específicos para o combate imaginário. */
  configurePresentation() {
    const profile = arenaDifficulty(this.room.gameDifficulty);
    this.battle.tuning = profile.tuning;
    this.battle.playerController = new ArenaPlayerController();
    this.battle.presentation = {
      /** Atualiza animação de ataque e emite rastro quando a espada está em movimento. */
      updateAnimation: (dt) => {
        const state = this.battle.state;
        if (updateArenaPlayerAnimation(state, this.room.player, dt)) {
          const direction = state.playerAnimation.attackDirection;
          this.fx.emit('trail', this.room.player.x + direction * 165, state.crouching ? 640 : 590);
        }
      },
      enemyContact: arenaEnemyContact,
      enemies: profile.enemies,
      renderEnemyPresence: renderArenaEnemyPresence,
      /** Desenha HUD com estado da batalha e apresentação do guardião. */
      renderHUD: (ctx, layout, state) => renderArenaHUD(ctx, this.room, state, layout, this.boss),
      /** Calcula o enquadramento usando o layout e o estado corrente do combate. */
      cameraFrame: (layout) => this.camera.frame(layout, this.room, this.battle.state),
      /** Encaminha sons e sincroniza sinais visuais disparados pelos eventos de combate. */
      onSound: (sound) => {
        this.audioProfile.sound(sound);
        if (sound === 'player_attack')
          beginArenaPlayerAttack(this.battle.state, this.room.story.state.attackDirection);
        const kind = sound === 'player_jump' ? 'jump' : sound === 'player_land' ? 'land' : null;
        if (kind)
          this.fx.emit(kind, this.room.player.x, kind === 'trail' ? 580 : 680, kind === 'land');
      },
      /** Cria efeito visual na posição de um impacto. */
      onImpact: (x, y, heavy) => this.fx.emit('impact', x, y, heavy),
      /** Cria efeito de bloqueio no ponto de contato. */
      onBlock: (x, y) => this.fx.emit('block', x, y),
      /** Compõe efeitos transitórios junto ao feixe do ataque especial. */
      renderFX: (ctx) => {
        this.fx.render(ctx);
        renderArenaSpecialBeam(ctx, this.room, this.battle.state, this.battle.tuning.ground);
      },
      enemyScale: ARENA_SCALE.enemy,
      /** Fornece a origem de transporte derivada da mobília convertida da sala. */
      transportOrigin: () => this.layout.transportOrigin,
      /** Desenha o templo sobre o fundo quando um ator está em transição. */
      renderForeground: (ctx) => {
        if (this.battle.state.transition) renderArenaTemple(ctx, this.room, this.layout, true);
      },
      /** Compõe o ambiente temático da arena sem alterar o cenário de exploração. */
      renderBackground: (ctx) =>
        renderArenaEnvironment(ctx, this.room, this.layout, this.state.elapsed),
      /** Desenha a personagem com o renderer e os recursos carregados para a arena. */
      renderPlayer: (ctx, state, ground) =>
        this.playerRenderer.render(ctx, this.room, state, ground),
    };
  }

  /** Restaura a exploração depois do resultado, podendo manter o áudio suspenso sob um fade. */
  restoreReality({ resumeAudio = true } = {}) {
    if (this.state.realityRestored || !this.exploration) return;
    this.room.restore(this.exploration, {
      preserveArena: true,
    });
    this.state.realityRestored = true;
    this.battle.state = null;
    this.battle.presentation = null;
    this.battle.tuning = BATTLE_TUNING;
    this.battle.playerController = new PlayerController();
    this.room.story.state.recurrenceActive = false;
    this.room.story.state.pendingReturns = [];
    if (this.state.outcome === 'VICTORY') {
      for (const toy of this.room.toys) {
        toy.isOrganized = true;
        toy.isCarried = false;
      }
      this.room.player.carriedItem = null;
      this.room.organizedCount = this.room.toys.length;
      this.room.story.state.arenaCompleted = true;
      this.room.victoryBannerActive = resumeAudio;
      this.room.victoryBannerTimer = resumeAudio ? 240 : 0;
    }
    this.room.gameplayState = 'TOY_ROOM_GAMEPLAY';
    this.audioProfile.leave({
      resume: resumeAudio,
    });
  }

  /** Restaura a sala e marca a arena como concluída após o retorno. */
  finish() {
    if (!this.active) return false;
    this.restoreReality();
    this.battle.state = null;
    this.state.status = 'COMPLETE';
    this.state.completed = true;
    this.room.clearInput();
    return true;
  }

  /** Armazena o resultado e escolhe retorno à sala ou transição para a perseguição. */
  beginReturn() {
    const s = this.battle.state;
    this.state.outcome = s.mode;
    this.state.result = {
      outcome: s.mode,
      hp: s.player.hp,
      history: JSON.parse(JSON.stringify(s.history)),
    };
    this.state.status = 'RETURNING';
    this.state.destination = s.mode === 'VICTORY' ? 'CHASE' : 'ROOM';
    this.state.returnElapsed = 0;
    this.state.transitionElapsed = 0;
    this.room.clearInput();
  }

  /** Avança transformação, combate ou retorno em passos limitados para manter contatos estáveis. */
  update(dt = 1) {
    if (!this.active) return;
    const step = Math.max(0, Math.min(12, Number.isFinite(dt) ? dt : 1));
    this.state.elapsed += step;
    if (this.state.status === 'RETURNING') {
      this.room.clearInput();
      if (this.state.destination === 'CHASE') {
        this.state.transitionElapsed += step;
        if (this.state.transitionElapsed >= ARENA_VICTORY_FADE_DURATION) {
          this.restoreReality({
            resumeAudio: false,
          });
          this.state.status = 'COMPLETE';
          this.state.completed = true;
          this.room.startChaseCampaign();
        }
        return;
      }
      this.state.returnElapsed += step;
      if (this.state.returnElapsed >= 90) this.restoreReality();
      if (this.state.returnElapsed >= 180) this.finish();
      return;
    }
    if (this.state.status === 'TRANSFORMING') {
      this.room.clearInput();
      if (
        this.state.elapsed >= ARENA_TRANSFORMATION_DURATION &&
        this.battle.ready &&
        this.playerRenderer.ready &&
        !this.battle.error &&
        !this.assetError
      ) {
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
      this.camera.update(
        step,
        this.room.player,
        s.enemy,
        s.jump,
        s.combatShake ||
          (this.fx.shake > 0
            ? {
                strength: this.fx.shake,
                elapsed: 0,
                duration: 1,
              }
            : null),
        s,
      );
      if (s.mode === 'BATTLE' && s.enemy.actor === 'bear' && s.enemy.hp === 0) {
        // O último golpe já entrega a abertura ilustrada; o Urso não volta ao baú aqui.
        if (s.index < BATTLE_ORDER.length)
          s.history.push({
            event: 'DEFEATED',
            enemy: 'bear',
          });
        s.index = BATTLE_ORDER.length;
        s.transition = null;
        s.mode = 'VICTORY';
        s.ending = 0;
        this.battle.playCombatSound('victory');
      }
      if (s.mode === 'VICTORY') this.beginReturn();
    }
  }
  /** Desenha transformação, combate ou retorno conforme a etapa ativa da arena. */
  render() {
    if (!this.active) return;
    if (this.state.status === 'RETURNING') {
      if (this.state.destination === 'CHASE') {
        this.battle.render();
        const { ctx, canvas } = this.room;
        const alpha = Math.min(1, this.state.transitionElapsed / ARENA_VICTORY_FADE_DURATION);
        ctx.save();
        ctx.fillStyle = `rgba(20,14,19,${alpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        return;
      }
      if (this.state.realityRestored)
        this.room.render({
          arenaBackdrop: true,
        });
      else this.battle.render();
      const { ctx, canvas } = this.room,
        p = this.state.returnElapsed / 180;
      ctx.save();
      ctx.fillStyle = `rgba(24,14,38,${Math.sin(p * Math.PI) * 0.95})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      return;
    }
    if (this.state.status !== 'TRANSFORMING') {
      this.battle.render();
      this.playerRenderer.renderSpecialCloseup(this.room.ctx, this.room.canvas, this.battle.state);
      if (this.fx.flash > 0) {
        this.room.ctx.save();
        this.room.ctx.fillStyle = `rgba(255,231,188,${this.fx.flash})`;
        this.room.ctx.fillRect(0, 0, this.room.canvas.width, this.room.canvas.height);
        this.room.ctx.restore();
      }
      return;
    }
    const { ctx, canvas } = this.room;
    const progress = Math.min(1, this.state.elapsed / ARENA_TRANSFORMATION_DURATION);
    const zoom = 1 + Math.sin(progress * Math.PI) * 0.22;
    const shake = Math.sin(this.state.elapsed * 1.9) * 5 * Math.sin(progress * Math.PI);
    ctx.save();
    ctx.translate(canvas.width / 2 + shake, canvas.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    this.room.render({
      arenaBackdrop: true,
    });
    ctx.restore();
    ctx.save();
    ctx.fillStyle = `rgba(20,10,35,${progress * 0.85})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffe9ac';
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px Georgia';
    ctx.fillText(
      this.assetError || this.battle.error || 'O quarto desperta na sua imaginação…',
      canvas.width / 2,
      canvas.height * 0.46,
      canvas.width - 32,
    );
    ctx.restore();
  }

  /** Copia o estado da arena e os subsistemas necessários para continuar a sessão. */
  snapshot() {
    return JSON.parse(
      JSON.stringify({
        version: 1,
        state: this.state,
        exploration: this.exploration,
        camera: this.camera.snapshot(),
        fx: this.fx.snapshot(),
        audio: this.audioProfile.snapshot(),
        boss: this.boss.snapshot(),
      }),
    );
  }
  /** Reinicializa componentes e valida/aplica a arena salva ou o save legado da sala. */
  restore(saved, roomSave = null) {
    this.audioProfile.leave({
      resume: false,
    });
    this.state = {
      status: 'IDLE',
      elapsed: 0,
      completed: false,
    };
    this.camera = new ArenaCamera();
    this.fx = new ImpactFX();
    this.boss = new ArenaBoss();
    this.audioProfile = new ArenaAudioProfile(this.room.audio);
    this.exploration = null;
    this.battle.presentation = null;
    this.battle.tuning = BATTLE_TUNING;
    this.battle.playerController = new PlayerController();
    if (!saved && roomSave?.toyRoomBattle) {
      // Saves anteriores não tinham uma posição de retorno: conserva os brinquedos e usa o ponto inicial seguro.
      const exploration = JSON.parse(JSON.stringify(roomSave));
      delete exploration.toyRoomArena;
      exploration.toyRoomBattle = null;
      exploration.player.x = 300;
      exploration.player.y = 650;
      exploration.cameraX = 0;
      exploration.cameraY = 0;
      saved = {
        state: {
          status: 'COMBAT',
          elapsed: 0,
          completed: false,
        },
        exploration,
        audio: {
          mode: 'ARENA',
        },
      };
    }
    if (saved) {
      if (
        !['IDLE', 'TRANSFORMING', 'COMBAT', 'RETURNING', 'COMPLETE'].includes(saved.state?.status)
      )
        throw new TypeError('Estado da arena inválido no save.');
      this.state = JSON.parse(JSON.stringify(saved.state));
      this.camera.restore(saved.camera);
      this.fx.restore(saved.fx);
      this.boss.restore(saved.boss);
      this.audioProfile.restore(saved.audio);
      this.exploration = saved.exploration;
      if (this.active && !this.state.realityRestored) this.configurePresentation();
    } else if (roomSave?.toyRoomStory?.arenaCompleted) {
      this.state = {
        status: 'COMPLETE',
        elapsed: 0,
        completed: true,
      };
    }
    if (this.state.completed) {
      this.room.audio?.startToyRoomMusic?.();
      this.room.audio?.setToyRoomMusicFade?.(1);
    }
    this.layout = new ToyRoomArenaBuilder().build(this.room);
    this.room.clearInput();
  }
  /** Encaminha o ataque ao sistema de combate enquanto a arena estiver ativa. */
  attack() {
    if (this.state.status !== 'COMBAT') return false;
    const s = this.battle.state;
    if (s.mode === 'VICTORY') {
      this.beginReturn();
      return true;
    }
    if (s.mode === 'DEFEAT') {
      if (s.ending < 90) return false;
      return this.retry();
    }
    return this.battle.attack();
  }
  /** Reinicia a tentativa de combate, conservando a exploração capturada pela arena. */
  retry() {
    if (this.battle.state?.mode !== 'DEFEAT') return false;
    this.battle.state = null;
    this.boss = new ArenaBoss();
    this.fx = new ImpactFX();
    this.battle.activate();
    return true;
  }
  /** Solicita o especial do combate quando a fase já chegou à etapa de luta. */
  special() {
    if (this.state.status !== 'COMBAT') return false;
    return beginArenaSpecial(this.battle);
  }
}
