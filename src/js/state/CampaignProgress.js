import { createDefaultStateVariables } from './StateVariables.js';

export const CAMPAIGN_STORAGE_KEY = 'legendGirl.campaign.v1';
const excluded = new Set(['toyRoomInstance', 'gameStarted', 'loopStarted', 'lastTime', 'lastJumpTime', 'lastDialogueAdvanceTime', 'standbyActivatedTime', 'failMessageTimer', 'isPortrait', 'lastUsedInputDevice']);
const keys = Object.keys(createDefaultStateVariables()).filter(key => !excluded.has(key));
const clone = value => JSON.parse(JSON.stringify(value));

// Lista explícita: referências ao DOM, áudio, entradas e relógios da página não são saves.
export function captureState(state) {
  return Object.fromEntries(keys.map(key => [key, clone(state[key])]));
}
export function restoreState(state, saved) {
  for (const key of keys) {
    if (!(key in saved)) continue;
    const value = clone(saved[key]);
    if (Array.isArray(state[key])) state[key].splice(0, state[key].length, ...value);
    else if (state[key] && typeof state[key] === 'object') Object.assign(state[key], value);
    else state[key] = value;
  }
}
export function createCampaignProgress(storage) {
  if (storage === undefined) { try { storage = globalThis.localStorage; } catch {} }
  let memory = null;
  let memoryOnly = false;
  return {
    read() {
      if (memoryOnly) return memory ? clone(memory) : null;
      try {
        const raw = storage?.getItem(CAMPAIGN_STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          // Aberturas antigas ainda em andamento precisam chegar ao primeiro salto.
          // Campanhas que já avançaram conservam o gameplay iniciado.
          if (data.state && typeof data.state === 'object' && !('gameplayState' in data.state)) {
            data.state.gameplayState = data.opening?.active && !data.opening?.completed
              ? 'CUTSCENE' : 'GAMEPLAY_NORMAL';
          }
          if (data.state && typeof data.state === 'object' && !('firstJumpTutorialCompleted' in data.state)) {
            data.state.firstJumpTutorialCompleted = data.state.gameplayState === 'GAMEPLAY_NORMAL';
          }
          // Recupera também saves gravados pela migração anterior durante a abertura.
          // Uma abertura inicial incompleta não pode ter consumido o primeiro salto.
          if (data.state && typeof data.state === 'object' &&
              data.opening?.active === true && data.opening?.completed === false) {
            data.state.gameplayState = 'CUTSCENE';
            data.state.firstJumpTutorialCompleted = false;
          }
          const defaults = captureState(createDefaultStateVariables());
          if (data.version !== 1 || !data.state || !data.opening ||
              !['CUTSCENE', 'FIRST_JUMP_TUTORIAL', 'GAMEPLAY_NORMAL'].includes(data.state.gameplayState) ||
              typeof data.opening.active !== 'boolean' || typeof data.opening.completed !== 'boolean' ||
              !Number.isFinite(data.opening.time) || !Array.isArray(data.opening.cues) ||
              !['bedroom', 'toy-room'].includes(data.state.currentPhaseMode) ||
              Object.keys(defaults).some(key => !(key in data.state) || data.state[key] === null || typeof data.state[key] !== typeof defaults[key] || (Array.isArray(defaults[key]) && !Array.isArray(data.state[key]))) ||
              !Number.isFinite(data.state.baby?.x) || !Number.isFinite(data.state.baby?.y) ||
              (data.state.currentPhaseMode === 'toy-room' && !data.toyRoom)) return null;
          memory = data;
        } else memory = null;
      } catch { /* Mantém o último save válido desta sessão. */ }
      return memory ? clone(memory) : null;
    },
    write(data) {
      memory = clone({ ...data, version: 1 });
      try { storage?.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(memory)); memoryOnly = !storage; return Boolean(storage); }
      catch { memoryOnly = true; return false; }
    },
    clear() {
      memory = null;
      // Somente as chaves da campanha; preferências e dados de outros aplicativos ficam intactos.
      try { storage?.removeItem(CAMPAIGN_STORAGE_KEY); } catch { memoryOnly = true; }
    }
  };
}
