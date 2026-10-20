import { TitleScene } from './TitleScene.js';

/** Coordena escolhas do menu por callbacks; não conhece física, saves ou transições internas da campanha. */
export class TitleScreen {
  /** Recebe consultas de progresso e ações explícitas para iniciar ou carregar uma aventura. */
  constructor({ game, onNew, onLoad }) {
    this.game = game; this.onNew = onNew; this.onLoad = onLoad;
    this.overlay = document.getElementById('start-overlay');
    this.newButton = document.getElementById('btn-start-phase1'); this.loadButton = document.getElementById('btn-load-game');
    this.easyButton = document.getElementById('btn-easy-mode'); this.difficulty = document.getElementById('game-difficulty');
    this.confirm = document.getElementById('restart-campaign-dialog'); this.options = document.getElementById('title-options-dialog');
    this.newButton.addEventListener('click', () => this.requestNew());
    this.loadButton.addEventListener('click', () => { if (!this.loadButton.disabled) this.onLoad(); });
    this.easyButton.addEventListener('click', () => this.setEasy(this.difficulty.value !== 'EASY'));
    document.getElementById('btn-title-options').addEventListener('click', () => this.options.showModal());
    document.getElementById('btn-close-title-options').addEventListener('click', () => this.options.close());
    this.confirm.addEventListener('close', () => { if (this.confirm.returnValue === 'restart') this.onNew(); });
    for (const dialog of [this.options, this.confirm]) {
      dialog.addEventListener('keydown', event => {
        event.stopPropagation();
        if (event.key === 'Escape') { event.preventDefault(); dialog.close('cancel'); }
      });
      dialog.addEventListener('keyup', event => event.stopPropagation());
    }
    this.overlay.addEventListener('keydown', event => this.navigate(event));
    this.scene = new TitleScene(document.getElementById('title-scene'), this.overlay); this.scene.load();
    this.setEasy(false); this.refresh();
  }

  /** Atualiza a disponibilidade de carregar sem alterar a escolha de dificuldade da próxima partida. */
  refresh() {
    const exists = this.game.hasSavedCampaign();
    this.loadButton.disabled = !exists;
    this.loadButton.setAttribute('aria-describedby', exists ? 'load-game-hint' : 'no-save-hint');
    document.getElementById('no-save-hint').hidden = exists;
    document.getElementById('load-game-hint').hidden = !exists;
  }

  /** Alterna somente a dificuldade de uma aventura nova; carregar conserva a dificuldade do save. */
  setEasy(enabled) {
    this.difficulty.value = enabled ? 'EASY' : 'NORMAL';
    this.easyButton.setAttribute('aria-pressed', String(enabled));
    document.getElementById('easy-mode-status').textContent = enabled ? 'Ativado' : 'Desativado';
  }

  /** Pede confirmação antes de substituir progresso; cancelamento nunca apaga o save. */
  requestNew() {
    if (this.options.open || this.confirm.open) return;
    if (!this.game.hasProgress()) { this.onNew(); return; }
    this.confirm.returnValue = 'cancel'; this.confirm.showModal();
  }

  /** Move o foco entre as opções com setas, mantendo Enter e Espaço nativos dos botões. */
  navigate(event) {
    if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;
    const buttons = [this.newButton, this.loadButton, this.easyButton].filter(button => !button.disabled);
    const index = buttons.indexOf(document.activeElement);
    event.preventDefault(); event.stopPropagation();
    buttons[(index + (event.key === 'ArrowDown' ? 1 : buttons.length - 1) + buttons.length) % buttons.length].focus();
  }

  /** Ativa a opção focada pelo controle, sem iniciar uma partida por trás de um diálogo. */
  activateFocused() {
    if (this.options.open || this.confirm.open) return;
    const active = document.activeElement;
    if (active?.matches('#start-overlay button')) active.click(); else this.requestNew();
  }
}
