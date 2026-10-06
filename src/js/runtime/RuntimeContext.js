// Agregação explícita das instâncias existentes; não possui lógica de jogo.
export function createRuntimeContext({ state, audio, camera, assets, input, effects, campaign }) {
  return { state, audio, camera, assets, input, effects, campaign };
}
