import express from 'express';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const baseline = JSON.parse(await fs.readFile('docs/diario-ia/qa/perseguicao-20261020/baseline.json', 'utf8'));
for (const [path, expected] of Object.entries(baseline)) {
  const raw = await fs.readFile(path);
  if (crypto.createHash('sha256').update(raw).digest('hex') !== expected.sha256) throw Error('Fonte ou contrato alterado: ' + path);
}
console.log('Integridade: fontes originais, simulação, configuração e renderer existentes preservados.');
const app = express(); app.use(express.static(process.cwd()));
const server = app.listen(0, '127.0.0.1');
await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
try {
  const child = spawn(process.execPath, ['docs/diario-ia/qa/perseguicao-20261020/props-browser.js'], {
    env: { ...process.env, PILOT_REVIEW_URL: 'http://127.0.0.1:' + server.address().port }, stdio: 'inherit',
  });
  process.exitCode = await new Promise((resolve, reject) => { child.once('exit', resolve); child.once('error', reject); });
} finally { server.close(); }
