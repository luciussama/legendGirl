import {
  createStoryAttackFrames, renderStoryWorldObject, renderStoryAttackSprite,
  renderStoryHeldObject, renderStoryBeat
} from './ToyRoomStoryRenderer.js';
export { drawToySword } from './ToyRoomStoryRenderer.js';

const FLOOR_SPAWN_POINTS = Object.freeze(
  [140, 300, 460, 620, 780, 940, 1100, 1260, 1420].flatMap(x =>
    [330, 410, 490, 570, 650, 730, 810, 890, 970, 1050].map(y => ({ x, y })))
);

const INVESTIGATION_BEATS = Object.freeze([
  { duration: 180, speaker: 'NANDA', text: 'Tem alguma coisa estranha...', focus: 'toys' },
  { duration: 60, text: '', focus: 'toys' },
  { duration: 240, speaker: 'MENINA', text: 'Estamos vendo os mesmos brinquedos de novo.', focus: 'toys' },
  { duration: 360, text: 'Os brinquedos continuavam voltando.\nComo se o quarto esquecesse que alguém tinha acabado de guardá-los.', focus: 'toys' },
  { duration: 120, text: '', focus: 'sword' },
  { duration: 300, text: 'Foi então que uma coisa nova apareceu.\nOu talvez estivesse ali desde sempre.', focus: 'sword', reveal: true },
  { duration: 90, speaker: 'MENINA', text: 'Hm?', focus: 'sword' },
  { duration: 180, speaker: 'NANDA', text: 'Que brinquedo é esse?', focus: 'sword' },
  { duration: 150, speaker: 'MENINA', text: 'Eu não lembro dele.', focus: 'sword' },
  { duration: 150, speaker: 'NANDA', text: 'E eu lembraria.', focus: 'sword' }
]);
const INVESTIGATION_DURATION = INVESTIGATION_BEATS.reduce((total, beat) => total + beat.duration, 0);
const RETURN_DIALOGUE_BEATS = Object.freeze([
  { start: 0, end: 60, speaker: 'NANDA', text: 'Estranho...' },
  { start: 90, end: 360, speaker: 'MENINA', text: 'Acho que esse brinquedo já tinha sido guardado.' }
]);
const SWORD_PICKUP_DURATION = 300;
const SWORD_ATTACK_DURATION = 12;

export const createToyRoomStoryState = () => ({
  recurrenceActive: false,
  returnedToyCount: 0,
  pendingReturns: [],
  returnDialogueElapsed: -1,
  investigationStage: 'COLLECTING',
  investigationElapsed: 0,
  sword: null,
  swordPickupElapsed: 0,
  swordEquipped: false,
  attackElapsed: 0,
  attackDirection: 1
});

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function outsideViewport(point, viewport, margin = 72) {
  return point.x + margin < viewport.left || point.x - margin > viewport.right ||
    point.y + margin < viewport.top || point.y - margin > viewport.bottom;
}

function getBeat(beats, elapsed) {
  let remaining = elapsed;
  for (const beat of beats) {
    if (remaining < beat.duration) return beat;
    remaining -= beat.duration;
  }
  return null;
}

/** Coordena a recorrência dos brinquedos e o arco narrativo da espada de brinquedo. */
export class ToyRoomStory {
  constructor({ world, actors, exploration, flow, controls, audio, presentation }) {
    this.world = world;
    this.actors = actors;
    this.exploration = exploration;
    this.flow = flow;
    this.controls = controls;
    this.audio = audio;
    this.presentation = presentation;
    this.state = createToyRoomStoryState();
    this.attackFrames = createStoryAttackFrames(presentation.assets);
    this.reachablePoints = [];
    this.lastViewport = null;
    this.refreshReachablePoints();
  }

  refreshReachablePoints() {
    const reachable = this.world.reachableFloor();
    this.reachablePoints = FLOOR_SPAWN_POINTS.filter(point =>
      this.world.isFree(point, 48) &&
      reachable.some(node => distance(node, point) <= 30));
  }

  recordViewport(frame) {
    this.lastViewport = this.world.viewport(frame);
  }

  onToyStored(toy) {
    const state = this.state;
    if (!state.recurrenceActive) {
      if (state.investigationStage !== 'COLLECTING') return;
      if (this.exploration.toys.filter(item => !item.isOrganized).length <= 2) {
        state.recurrenceActive = true;
      }
      return;
    }

    state.pendingReturns.push({ toyId: toy.id, remaining: 90 });
    if (state.investigationStage === 'COLLECTING' && (toy.returnGeneration || 0) > 0) {
      state.returnedToyCount++;
      if (state.returnedToyCount === 2) state.returnDialogueElapsed = 0;
    }
  }

  update(dt) {
    const state = this.state;
    if (state.returnDialogueElapsed >= 0) {
      state.returnDialogueElapsed = Math.min(360, state.returnDialogueElapsed + dt);
    }

    if (state.investigationStage === 'INVESTIGATION') {
      this.updateInvestigation(dt);
      return true;
    }
    if (state.investigationStage === 'PICKUP') {
      state.swordPickupElapsed = Math.min(SWORD_PICKUP_DURATION, state.swordPickupElapsed + dt);
      if (state.swordPickupElapsed >= SWORD_PICKUP_DURATION) {
        state.investigationStage = 'EQUIPPED';
        state.swordEquipped = true;
        this.clearInput();
      }
      return true;
    }

    this.updateReturns(dt);
    if (state.investigationStage === 'COLLECTING') {
      if (state.returnedToyCount >= 4 && state.returnDialogueElapsed >= 360 &&
        !this.flow.tutorialActive) {
        if (this.beginInvestigation()) {
          this.updateInvestigation(dt);
          return true;
        }
      }
    } else if (state.investigationStage === 'SEEKING_SWORD') {
      this.updateSwordGuide();
    } else if (state.investigationStage === 'EQUIPPED') {
      state.attackElapsed = Math.max(0, state.attackElapsed - dt);
    }
    return false;
  }

  updateReturns(dt) {
    const state = this.state;
    if (!state.recurrenceActive || !state.pendingReturns.length ||
      this.flow.tutorialActive || this.flow.introductionActive) return;

    const pending = state.pendingReturns[0];
    pending.remaining = Math.max(0, pending.remaining - dt);
    if (pending.remaining > 0) return;

    const currentViewport = this.world.viewport();
    const candidates = this.reachablePoints.filter(point =>
      outsideViewport(point, currentViewport) &&
      (!this.lastViewport || outsideViewport(point, this.lastViewport)) &&
      distance(point, this.actors.player) > 160 &&
      !this.exploration.toys.some(toy => !toy.isOrganized && distance(point, toy) < 144) &&
      !this.exploration.furniture.some(item => {
        const nearestX = Math.max(item.x, Math.min(point.x, item.x + item.w));
        const nearestY = Math.max(item.y, Math.min(point.y, item.y + item.h));
        return Math.hypot(point.x - nearestX, point.y - nearestY) < 72;
      }));

    if (!candidates.length) return;
    const toy = this.exploration.toys.find(item => item.id === pending.toyId);
    if (!toy || !toy.isOrganized) {
      state.pendingReturns.shift();
      return;
    }

    const point = candidates[Math.floor(Math.random() * candidates.length)];
    this.exploration.returnToy(toy, point);
    state.pendingReturns.shift();
  }

  beginInvestigation() {
    const { player } = this.actors;
    // A investigação espera a entrega atual; nenhuma cena força o brinquedo a cair.
    if (player.carriedItem) return false;
    const chest = this.exploration.furniture.find(item => item.id === 'toy-chest');
    if (!chest) return false;
    // À direita do baú, no piso logo abaixo da janela direita (centro x=1360).
    const sword = { x: chest.x + chest.w + 130, y: chest.y + chest.h + 25 };
    if (!this.world.isFree(sword, 48)) return false;
    this.state.investigationStage = 'INVESTIGATION';
    this.state.investigationElapsed = 0;
    this.state.sword = { ...sword, visible: false };
    this.clearInput();
    return true;
  }

  updateInvestigation(dt) {
    const { player, fairy } = this.actors;
    const state = this.state;
    state.investigationElapsed = Math.min(INVESTIGATION_DURATION,
      state.investigationElapsed + dt);
    const beat = getBeat(INVESTIGATION_BEATS, state.investigationElapsed);
    if (!beat) {
      state.investigationStage = 'SEEKING_SWORD';
      if (state.sword) state.sword.visible = true;
      this.clearInput();
      return;
    }

    const toys = this.exploration.toys.filter(toy => !toy.isOrganized && !toy.isCarried);
    const focus = beat.focus === 'sword' || !toys.length
      ? state.sword
      : toys[Math.floor(state.investigationElapsed / 180) % toys.length];
    if (beat.reveal && state.sword) state.sword.visible = true;

    if (state.sword?.visible) {
      this.updateSwordGuide();
    } else if (focus) {
      const orbit = state.investigationElapsed * 0.018;
      const targetX = focus.x + Math.cos(orbit) * 45;
      const targetY = focus.y - 60 + Math.sin(orbit) * 22;
      const blend = 1 - Math.pow(0.97, dt);
      fairy.x += (targetX - fairy.x) * blend;
      fairy.y += (targetY - fairy.y) * blend;

    }
    fairy.flutterTime += 0.6 * dt;
    player.vx = 0;
    player.vy = 0;
    player.isMoving = false;
  }

  updateSwordGuide() {
    const { fairy } = this.actors;
    const target = this.state.sword;
    if (!target) return;
    fairy.targetX = fairy.x = target.x;
    fairy.targetY = fairy.y = target.y - 80;
  }

  updateAfterMovement() {
    const state = this.state;
    if (state.investigationStage !== 'SEEKING_SWORD' || !state.sword ||
      distance(this.actors.player, state.sword) > this.actors.player.radius + 16) return;

    if (this.actors.player.carriedItem) return;
    state.investigationStage = 'PICKUP';
    state.swordPickupElapsed = 0;
    state.sword.visible = false;
    this.clearInput();
    this.audio.playPickup();
    this.audio.useSwordTrack();
  }

  clearInput() {
    this.controls.clear();
  }

  get inputLocked() {
    return this.state.investigationStage === 'INVESTIGATION' ||
      this.state.investigationStage === 'PICKUP';
  }

  get swordEquipped() {
    return this.state.swordEquipped;
  }

  attack() {
    const state = this.state;
    if (!state.swordEquipped || state.attackElapsed > 0) return false;
    state.attackElapsed = SWORD_ATTACK_DURATION;
    state.attackDirection = this.actors.player.facing === 'left' ? -1 : 1;
    return true;
  }

  /** Brinquedos comuns ficam indisponíveis desde a revelação até o combate. */
  get canCollectToys() {
    return this.state.investigationStage === 'COLLECTING' && !this.state.sword?.visible && !this.state.swordEquipped;
  }

  guidePosition() {
    if (this.state.sword && (this.state.sword.visible || this.state.investigationStage === 'PICKUP')) {
      return { x: this.state.sword.x, y: this.state.sword.y - 80 };
    }
    if (this.actors.player.carriedItem) {
      const chest = this.exploration.furniture.find(item => item.id === 'toy-chest');
      if (chest) return { x: chest.x + chest.w / 2, y: chest.y - 75 };
    }
    return null;
  }

  cameraTarget() {
    // Única exceção: a descoberta da espada. Nas demais falas e na exploração,
    // a fada pode guiar livremente sem deslocar o enquadramento da menina.
    if (this.state.investigationStage === 'INVESTIGATION' && this.state.sword?.visible &&
        getBeat(INVESTIGATION_BEATS, this.state.investigationElapsed)?.reveal) {
      return this.actors.fairy;
    }
    return this.actors.player;
  }

  renderWorldObject(ctx) {
    return renderStoryWorldObject(ctx, this.state);
  }

  renderAttackSprite(ctx) {
    return renderStoryAttackSprite(ctx, {
      state: this.state, player: this.actors.player, attackFrames: this.attackFrames,
      attackDuration: SWORD_ATTACK_DURATION
    });
  }

  renderHeldObject(ctx) {
    return renderStoryHeldObject(ctx, {
      state: this.state, player: this.actors.player, attackFrames: this.attackFrames,
      attackDuration: SWORD_ATTACK_DURATION
    });
  }

  advanceDialogue(){
    if(!this.narrativeBeat())return false;const state=this.state;
    if(state.investigationStage==='COLLECTING'){
      const index=RETURN_DIALOGUE_BEATS.findIndex(b=>state.returnDialogueElapsed>=b.start&&state.returnDialogueElapsed<b.end);
      state.returnDialogueElapsed=RETURN_DIALOGUE_BEATS[index+1]?.start??360;
    }else if(state.investigationStage==='INVESTIGATION'){
      let end=0;for(const beat of INVESTIGATION_BEATS){end+=beat.duration;if(end>state.investigationElapsed){state.investigationElapsed=end;break;}}
    }else if(state.investigationStage==='PICKUP')state.swordPickupElapsed=state.swordPickupElapsed<120?120:SWORD_PICKUP_DURATION;
    return true;
  }
  narrativeBeat() {
    const state = this.state;
    if (state.returnDialogueElapsed >= 0 && state.returnDialogueElapsed < 360 &&
      state.investigationStage === 'COLLECTING') {
      const beat = RETURN_DIALOGUE_BEATS.find(item =>
        state.returnDialogueElapsed >= item.start && state.returnDialogueElapsed < item.end);
      if (beat) return beat;
    }

    if (state.investigationStage === 'INVESTIGATION') {
      const beat = getBeat(INVESTIGATION_BEATS, state.investigationElapsed);
      if (beat?.text) return beat;
    } else if (state.investigationStage === 'PICKUP') {
      const text = state.swordPickupElapsed < 120
        ? 'Ela não estava procurando por aquilo.'
        : 'Mas algumas coisas parecem encontrar a gente primeiro.';
      return { text };
    }
    return null;
  }

  renderNarrative(ctx, canvas) {
    const beat = this.narrativeBeat();
    if (beat) this.renderStoryBeat(ctx, canvas, beat);
  }

  renderStoryBeat(ctx, canvas, beat) {
    return renderStoryBeat(ctx, canvas, beat, {
      mobile: this.presentation.mobile, assets: this.presentation.assets,
      tick: this.state.investigationElapsed
    });
  }

  restore(saved) {
    this.state = { ...createToyRoomStoryState(), ...(saved || {}) };
    this.state.pendingReturns = Array.isArray(this.state.pendingReturns)
      ? this.state.pendingReturns
      : [];
    if (this.state.swordEquipped || this.state.investigationStage === 'PICKUP') {
      this.audio.useSwordTrack();
    }
    if (!saved && this.exploration.toys.filter(toy => !toy.isOrganized).length <= 2) {
      this.state.recurrenceActive = true;
    }
    this.refreshReachablePoints();
    if (this.inputLocked) this.clearInput();
    this.lastViewport = null;
  }

  snapshot() {
    return JSON.parse(JSON.stringify(this.state));
  }
}
