import fs from 'node:fs/promises';
import { ToyRoomPhase } from '../src/js/toy-room/ToyRoomPhase.js';
import { runToyRoomQA } from '../tests/toy-room-qa-runner.js';
const results = [];
for (const gameDifficulty of ['NORMAL', 'EASY']) {
  for (const [width, height, mobile] of [[960,540,false],[540,1030,true],[1110,540,true],[1340,540,true],[540,816,true],[540,1200,true]]) {
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
      userAgent: mobile ? 'Mozilla/5.0 (Linux; Android 14) Mobile' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    } });
    for (const dt of [0.5, 1, 1.2]) {
      const canvas = { width, height, getContext: () => ({}), addEventListener() {} };
      const room = new ToyRoomPhase(canvas, null, null, null, { gameDifficulty, bindInputs: false });
      try { results.push(runToyRoomQA(room, { dt })); }
      catch (error) { throw Error(`${gameDifficulty} ${width}×${height}, dt=${dt}: ${error.message}`, { cause: error }); }
    }
  }
}
await fs.mkdir('docs/qa/toy-room-playthrough', { recursive: true });
await fs.writeFile('docs/qa/toy-room-playthrough/resultados.json', JSON.stringify(results, null, 2) + '\n');
console.log(`APROVADO: ${results.length} percursos completos com coleta, baú, recorrência, diálogos, espada e saves intermediários.`);
