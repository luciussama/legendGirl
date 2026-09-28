// Valida o artefato publicado sob uma subpasta e sob a raiz de um domínio próprio.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = path.join(root, '_site');
const main = await fs.readFile(path.join(site, 'src/js/main.js'), 'utf8');
const download = await fs.readFile(path.join(site, 'baixar.html'), 'utf8');
const index = await fs.readFile(path.join(site, 'index.html'), 'utf8');
const manifest = JSON.parse(await fs.readFile(path.join(site, 'assets/manifest.json'), 'utf8'));

for (const base of ['https://exemplo.github.io/legendGirl/', 'https://jogo.example/']) {
  async function checkResource(relative) {
    const url = new URL(relative, base);
    assert(url.href.startsWith(base), `Recurso fora da base publicada: ${url}`);
    await fs.access(path.join(site, decodeURIComponent(url.href.slice(base.length))));
  }
  for (const html of [index, download]) {
    for (const match of html.matchAll(/(?:src|href)="(\.[^"]*|[^/:#"\s][^:"]*)"/g)) {
      await checkResource(match[1]);
    }
  }
  for (const resource of Object.values(manifest.images)) await checkResource(resource);
  for (const [source, variable] of [[main, 'directUrl'], [main, 'pageUrl'], [download, 'directUrl']]) {
    const expression = source.match(new RegExp(`const ${variable} = ([^;]+);`))?.[1];
    assert(expression, `Endereço não encontrado: ${variable}`);
    const url = vm.runInNewContext(expression, { URL, document: { baseURI: base } });
    await checkResource(url);
  }
}

for (const source of [main, download, index]) {
  assert(!source.includes('/api/'), 'A distribuição estática não deve depender do Express');
  assert(!/href="\//.test(source), 'Links não devem escapar da subpasta do projeto');
}
for (const file of ['src/js/main.js', 'src/js/audio.js']) {
  execFileSync(process.execPath, ['--check', path.join(site, file)]);
}
for (const match of download.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
  execFileSync(process.execPath, ['--check'], { input: match[1] });
}

// A preparação pode adaptar endereços; todos os demais arquivos do jogo devem ser cópias exatas.
async function checkCopies(directory) {
  for (const item of await fs.readdir(path.join(root, directory), { withFileTypes: true })) {
    const relative = path.join(directory, item.name);
    if (item.isDirectory()) await checkCopies(relative);
    else if (!['src/js/main.js', 'src/js/audio.js'].includes(relative)) {
      assert.deepEqual(await fs.readFile(path.join(root, relative)),
        await fs.readFile(path.join(site, relative)), `Arquivo do jogo alterado: ${relative}`);
    }
  }
}
await checkCopies('src');
await checkCopies('assets');
for (const excluded of ['server.js', 'node_modules', 'tmp', '.env', '.git', 'scripts']) {
  await assert.rejects(fs.access(path.join(site, excluded)), { code: 'ENOENT' });
}
const zip = await fs.stat(path.join(site, 'o-quarto-dos-brinquedos.zip'));
assert(zip.size > 0, 'O pacote de download não pode estar vazio');
console.log('APROVADO: endereços em subpasta e domínio próprio, recursos presentes, sintaxe válida e arquivos do jogo preservados.');
