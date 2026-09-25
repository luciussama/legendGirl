import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

async function verifyDownload() {
  console.log('=== TESTE DE DOWNLOAD, TAMANHO E CONTEÚDO DO ARQUIVO ZIP ===');

  const testEndpoints = [
    'http://localhost:3000/api/download-zip',
    'http://localhost:3000/download',
    'http://localhost:3000/o-quarto-dos-brinquedos.zip'
  ];

  for (const ep of testEndpoints) {
    console.log(`[HTTP GET] Verificando endpoint: ${ep}`);
    const res = await fetch(ep);
    if (!res.ok) {
      throw new Error(`Falha no download via HTTP: status ${res.status}`);
    }
    const contentType = res.headers.get('content-type');
    const contentLength = Number(res.headers.get('content-length'));
    console.log(`  -> Status: ${res.status} OK`);
    console.log(`  -> Content-Type: ${contentType}`);
    console.log(`  -> Content-Length: ${contentLength} bytes (${(contentLength / 1024 / 1024).toFixed(2)} MB)`);

    if (contentType !== 'application/zip') {
      throw new Error(`Content-Type inesperado: ${contentType}`);
    }
    if (contentLength < 50000000) {
      throw new Error(`Tamanho insuficiente: ${contentLength} bytes`);
    }
  }

  // 1. Download do arquivo real via HTTP
  const targetUrl = 'http://localhost:3000/o-quarto-dos-brinquedos.zip';
  console.log(`\n1. Efetuando download completo de ${targetUrl}...`);
  const response = await fetch(targetUrl);
  const arrayBuffer = await response.arrayBuffer();
  const tempZipPath = '/tmp/download-verification-test.zip';
  fs.writeFileSync(tempZipPath, Buffer.from(arrayBuffer));

  // 2. Validação de tamanho
  const downloadedSizeBytes = fs.statSync(tempZipPath).size;
  const downloadedSizeMb = (downloadedSizeBytes / 1024 / 1024).toFixed(2);
  console.log(`2. Validando tamanho do arquivo baixado:`);
  console.log(`   -> Tamanho em bytes: ${downloadedSizeBytes}`);
  console.log(`   -> Tamanho em MB: ${downloadedSizeMb} MB`);
  if (downloadedSizeBytes !== 54041837 && downloadedSizeBytes < 50000000) {
    throw new Error(`Tamanho do arquivo baixado inválido: ${downloadedSizeBytes}`);
  }
  console.log(`   -> Validação de tamanho: APROVADO!`);

  // 3. Validação de integridade do ZIP
  console.log(`\n3. Validando integridade estrutural do ZIP via unzip -t:`);
  const unzipTest = execSync(`unzip -t ${tempZipPath}`).toString();
  if (!unzipTest.includes('No errors detected in compressed data')) {
    throw new Error('Falha na integridade estrutural do arquivo ZIP');
  }
  console.log(`   -> Teste estrutural: APROVADO (Zero erros detectados).`);

  // 4. Validação do conteúdo interno do ZIP
  console.log(`\n4. Validando conteúdo interno do ZIP:`);
  const extractDir = '/tmp/extracted-verification-test';
  if (fs.existsSync(extractDir)) {
    fs.rmSync(extractDir, { recursive: true, force: true });
  }
  fs.mkdirSync(extractDir, { recursive: true });
  execSync(`unzip -q ${tempZipPath} -d ${extractDir}`);

  const requiredFiles = [
    { file: 'index.html', minSize: 1000 },
    { file: 'package.json', minSize: 500 },
    { file: 'server.js', minSize: 2000 },
    { file: 'metadata.json', minSize: 200 },
    { file: 'src/css/styles.css', minSize: 5000 },
    { file: 'src/js/game.js', minSize: 30000 },
    { file: 'src/js/main.js', minSize: 10000 },
    { file: 'src/js/config.js', minSize: 5000 },
    { file: 'src/js/state/GameState.js', minSize: 10000 },
    { file: 'src/js/toy-room/ToyRoomPhase.js', minSize: 20000 },
    { file: 'assets/art/dark-room/darkRoomAtlas.json', minSize: 5000 },
    { file: 'assets/art/dark-room/production-spritesheet.png', minSize: 1000000 },
    { file: 'assets/audio/Circular Dissonance (1).mp3', minSize: 500000 },
    { file: 'assets/audio/toy_room_theme.mp3', minSize: 1000000 },
    { file: 'scripts/verify-dark-room.js', minSize: 5000 },
    { file: 'tests/DARK_ROOM_VERIFICATION.md', minSize: 2000 }
  ];

  for (const item of requiredFiles) {
    const full = path.join(extractDir, item.file);
    if (!fs.existsSync(full)) {
      throw new Error(`Arquivo essencial ausente no ZIP extraído: ${item.file}`);
    }
    const sz = fs.statSync(full).size;
    if (sz < item.minSize) {
      throw new Error(`Arquivo ${item.file} muito pequeno no ZIP (${sz} < ${item.minSize})`);
    }
    console.log(`   [CONFIRMADO] ${item.file.padEnd(45)} -> ${sz.toLocaleString()} bytes`);
  }

  const fileCount = execSync(`find ${extractDir} -type f | wc -l`).toString().trim();
  console.log(`\n   -> Total de arquivos verificados dentro do ZIP: ${fileCount}`);
  console.log('\n=== CONCLUSÃO: ARQUIVO BAIXADO, TAMANHO E CONTEÚDO 100% VALIDADOS! ===');
}

verifyDownload().catch(err => {
  console.error('ERRO:', err);
  process.exit(1);
});
