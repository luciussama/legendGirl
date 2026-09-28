// Prepara uma distribuição estática; as adaptações não modificam os arquivos de origem.
import fs from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZipArchive } from 'archiver';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, '_site');
const zipName = 'o-quarto-dos-brinquedos.zip';
await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });
for (const item of ['index.html', 'baixar.html', 'src', 'assets']) {
  await fs.cp(path.join(root, item), path.join(output, item), { recursive: true });
}

// Inclui somente os arquivos do projeto, sem segredos locais, dependências ou relatórios temporários.
const archive = new ZipArchive({ zlib: { level: 9 } });
const stream = createWriteStream(path.join(output, zipName));
const complete = new Promise((resolve, reject) => {
  stream.on('close', resolve);
  stream.on('error', reject);
  archive.on('error', reject);
  archive.on('warning', reject);
});
archive.pipe(stream);
for (const folder of ['src', 'assets', 'scripts', 'tests', '.github']) {
  archive.directory(path.join(root, folder), folder);
}
for (const file of ['index.html', 'baixar.html', 'server.js', 'package.json',
  'AGENTS.md', '.gitignore', '.env.example', 'metadata.json']) {
  archive.file(path.join(root, file), { name: file });
}
try {
  await fs.access(path.join(root, 'package-lock.json'));
  archive.file(path.join(root, 'package-lock.json'), { name: 'package-lock.json' });
} catch { /* O workflow gera o arquivo de controle quando ele não está versionado. */ }
await Promise.all([complete, archive.finalize()]);
const zipBytes = (await fs.stat(path.join(output, zipName))).size;
const zipSize = `${(zipBytes / 1024 / 1024).toFixed(1)} MB`;

async function adapt(file, replacements) {
  const target = path.join(output, file);
  let content = await fs.readFile(target, 'utf8');
  for (const [from, to] of replacements) {
    if (!content.includes(from)) {
      throw new Error(`Adaptação de publicação desatualizada em ${file}: ${from}`);
    }
    content = content.replaceAll(from, to);
  }
  await fs.writeFile(target, content);
}

for (const file of ['index.html', 'baixar.html']) {
  await adapt(file, [
    ['href="/api/download-zip"', `href="./${zipName}"`],
    ['51.5 MB', zipSize]
  ]);
}
await adapt('index.html', [['href="/baixar"', 'href="./baixar.html"']]);
await adapt('baixar.html', [
  ["window.location.origin + '/api/download-zip'", `new URL('./${zipName}', document.baseURI).href`],
  ['51.54 MB (54.043.665 bytes)', `${zipSize} (${zipBytes.toLocaleString('pt-BR')} bytes)`]
]);
await adapt('src/js/main.js', [
  ['`${origin}/api/download-zip`', `new URL('./${zipName}', document.baseURI).href`],
  ['`${origin}/baixar`', "new URL('./baixar.html', document.baseURI).href"],
  ["fetch('/api/download-zip')", `fetch(new URL('./${zipName}', document.baseURI))`],
  ["fetch('/o-quarto-dos-brinquedos.zip')", `fetch(new URL('./${zipName}', document.baseURI))`],
  ['`${window.location.origin}/api/download-zip`', `new URL('./${zipName}', document.baseURI).href`],
  ['${window.location.origin}/api/download-zip', `\${new URL('./${zipName}', document.baseURI).href}`],
  ['54043665', String(zipBytes)]
]);
await adapt('src/js/audio.js', [
  ["'/src/audio/The%20Circle%20Game.mp3'", "new URL('../audio/The%20Circle%20Game.mp3', import.meta.url).href"]
]);
await fs.writeFile(path.join(output, '.nojekyll'), '');
console.log(`Site estático preparado em _site/. ZIP gerado: ${zipSize}.`);
