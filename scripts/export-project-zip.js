import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ZipArchive } from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const outputPath = path.join(projectRoot, 'o-quarto-dos-brinquedos.zip');
const output = fs.createWriteStream(outputPath);

const archive = new ZipArchive({
  zlib: { level: 9 }
});

output.on('close', () => {
  const sizeMb = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✅ Arquivo ZIP gerado com sucesso!`);
  console.log(`📦 Arquivo: ${outputPath}`);
  console.log(`📊 Tamanho: ${sizeMb} MB (${archive.pointer()} bytes)`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('Aviso:', err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  console.error('Erro ao gerar ZIP:', err);
  process.exit(1);
});

archive.pipe(output);

archive.glob('**/*', {
  cwd: projectRoot,
  ignore: [
    'node_modules/**',
    '.git/**',
    '.cache/**',
    'tmp/**',
    '.temp/**',
    '*.zip'
  ],
  dot: true
});

archive.finalize();
