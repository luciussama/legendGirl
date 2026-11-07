/** Conta uma derrota por tentativa, somando as fases da mesma campanha. */
export function recordCampaignDefeat(state) {
  if (state.defeatPending) return false;
  state.defeatCount += 1;
  state.defeatPending = true;
  state.easyOfferPending = state.gameDifficulty !== 'EASY' && state.defeatCount % 3 === 0;
  return true;
}

/** Libera a próxima tentativa sem perder o total de derrotas da campanha. */
export function clearCampaignDefeat(state) {
  state.defeatPending = false;
  state.easyOfferPending = false;
}
