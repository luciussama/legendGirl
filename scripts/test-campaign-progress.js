import assert from 'node:assert/strict';
import { createCampaignProgress, captureState, restoreState, CAMPAIGN_STORAGE_KEY } from '../src/js/state/CampaignProgress.js';
import { createDefaultStateVariables } from '../src/js/state/StateVariables.js';
import { OpeningSequence, OPENING_STORAGE_KEY } from '../src/js/cinematics/OpeningSequence.js';

const data = new Map([['preferencia', 'preservar']]);
const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
const progress = createCampaignProgress(storage);
assert.equal(progress.read(), null);
const state = createDefaultStateVariables();
state.baby.x = 1800; state.cutsceneCompleted = true; state.isEscapeMode = true;
const opening = new OpeningSequence({ storage });
opening.reset(); opening.start(); opening.update(600);
const saved = { state: captureState(state), opening: opening.snapshot(), toyRoom: null };
assert(progress.write(saved));
assert.deepEqual(createCampaignProgress(storage).read().state, saved.state, 'Recarga preserva posição e narrativa');
const target = createDefaultStateVariables(), baby = target.baby, ribbons = target.speedRibbons;
restoreState(target, progress.read().state);
assert.equal(target.baby, baby, 'Referência da personagem deve permanecer compartilhada');
assert.equal(target.speedRibbons, ribbons, 'Referência das partículas deve permanecer compartilhada');
assert.equal(target.baby.x, 1800); assert(target.cutsceneCompleted);
const resume = new OpeningSequence({ storage }); resume.restore(progress.read().opening);
assert.equal(resume.time, 10); assert(resume.active);
progress.clear(); opening.reset();
assert.equal(progress.read(), null); assert.equal(data.get('preferencia'), 'preservar');
assert(opening.start()); assert.equal(opening.time, 0);
opening.update(2300); assert.equal(data.get(OPENING_STORAGE_KEY), '1');
opening.reset(); assert(opening.start(), 'Recomeçar limpa também a flag em memória');
for (const invalid of ['{', JSON.stringify({ version: 99 }), JSON.stringify({ version: 1, state: null })]) {
 data.set(CAMPAIGN_STORAGE_KEY, invalid);
 assert.equal(createCampaignProgress(storage).read(), null, 'Save inválido não deve derrubar o menu');
}
const denied = {getItem: () => JSON.stringify({...saved,version:1}),setItem(){throw Error('sem espaço');},removeItem(){throw Error('negado');}};
const fallback = createCampaignProgress(denied);
fallback.read(); fallback.clear(); assert.equal(fallback.read(), null);
assert.equal(fallback.write(saved), false); assert.deepEqual(fallback.read().state, saved.state);
const deniedOpening = new OpeningSequence({storage:{getItem:()=> '1',removeItem(){throw Error('negado');}}});
deniedOpening.reset(); assert(deniedOpening.start(), 'Reinício funciona na sessão mesmo com armazenamento bloqueado');
console.log('APROVADO: campanha persistente, recarga, referências compartilhadas, abertura, limpeza seletiva, saves inválidos e armazenamento bloqueado.');
