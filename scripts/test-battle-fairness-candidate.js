// Ensaio isolado de alcance: o candidato nunca substitui a implementação ativa.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';
import { ToyRoomBattle } from '../src/js/toy-room/ToyRoomBattle.js';
import { runBattleGameplay } from '../tests/battle-gameplay-runner.js';
const sourceURL = new URL('../src/js/toy-room/ToyRoomBattle.js', import.meta.url);
const candidateURL = new URL('../src/js/toy-room/.ToyRoomBattle-fairness-candidate.js', import.meta.url);
const source = await fs.readFile(sourceURL, 'utf8');
const search = "e.attack === 'Rocket Punch' ? 280";
assert.equal(source.split(search).length, 2, 'Alteração limitada a um único alcance.');
// Aproxima o limite da soma entre punho visível e meia largura da menina em 2×.
const candidate = source.replace(search, "e.attack === 'Rocket Punch' ? 140");
const roomFor = Battle => {
  const room = new ToyRoomPhase({ width: 960, height: 540, getContext: () => ({}), removeEventListener() {} }, null, null, () => {}, { bindInputs: false });
  room.battle = new Battle(room, { loadAssets: false });
  room.story.state.swordEquipped = true; room.update();
  return room;
};
try {
  await fs.writeFile(candidateURL, candidate, { flag: 'wx' });
  const { ToyRoomBattle: Candidate } = await import(candidateURL.href);
  const results = [];
  for (const [name, Battle] of [['anterior', ToyRoomBattle], ['candidato', Candidate]]) {
    const full = roomFor(Battle);
    const campaign = runBattleGameplay(full, { restore: true });
    assert.equal(campaign.result, 'PASS');
    full.destroy();
    const room = roomFor(Battle);
    room.battle.state.index = 1; room.battle.spawn();
    const enemy = room.battle.state.enemy;
    enemy.attackIndex = 1; // Fixture seleciona o Rocket Punch; a IA decide quando disparar.
    room.battle.setEnemyState('APPROACH');
    room.player.x = enemy.x - 270;
    room.update();
    assert.equal(enemy.attack, 'Rocket Punch');
    for (let i = 0; i < 108; i++) room.update();
    results.push({ version: name, campaign, playerHpAtEngagementDistance: room.battle.state.player.hp });
    room.destroy();
  }
  assert.equal(results[0].playerHpAtEngagementDistance, 2);
  assert.equal(results[1].playerHpAtEngagementDistance, 3);
  const report = { result: 'ROLLED BACK', candidateRange: 140, activeRange: 280,
    reason: 'A IA dispara à distância original, mas o alcance reduzido não atinge uma menina parada. Ajustar somente a colisão enfraquece o inimigo e altera o balanceamento.', results };
  await fs.writeFile('docs/battle-mode/hitbox-candidate-comparison.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  // Remove exclusivamente a cópia temporária deste ensaio, preservando o módulo ativo.
  const contents = await fs.readFile(candidateURL, 'utf8').catch(() => null);
  if (contents === candidate) await fs.unlink(candidateURL);
}
