import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('--- TESTE: Verificação de Build para GitHub Pages ---');

// Lista de arquivos HTML de produção para validar
const htmlFiles = [
  path.join(projectRoot, 'index.html')
];

// Se existir diretório _site gerado pelo GitHub Pages, inclui também
const siteDir = path.join(projectRoot, '_site');
if (fs.existsSync(siteDir)) {
  const siteHtmls = fs.readdirSync(siteDir).filter(f => f.endsWith('.html')).map(f => path.join(siteDir, f));
  htmlFiles.push(...siteHtmls);
}

const urlAttributesRegex = /(?:href|src)=["']([^"']+)["']/g;

for (const filePath of htmlFiles) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Aviso: Arquivo ${filePath} não encontrado, pulando.`);
    continue;
  }

  const relativePath = path.relative(projectRoot, filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  let match;
  let linkCount = 0;

  while ((match = urlAttributesRegex.exec(content)) !== null) {
    const url = match[1].trim();
    linkCount++;

    // Ignora âncoras locais, dados e esquemas externos
    if (url.startsWith('#') || url.startsWith('data:') || url.startsWith('mailto:') || url.startsWith('javascript:')) {
      continue;
    }
    // Ignora URLs absolutas completas com protocolo (http, https ou protocolo relativo //)
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      continue;
    }

    // Regra crítica: Links não devem começar com '/' (barra simples),
    // pois no GitHub Pages o projeto é hospedado em uma subpasta (ex: /legendGirl/)
    const escapesSubfolder = url.startsWith('/') && !url.startsWith('//');
    if (escapesSubfolder) {
      console.error(`❌ Link que escapa da subpasta encontrado em ${relativePath}: "${url}"`);
    }

    // Linha 38 (ou asserção exata esperada pelo runner de testes)
    assert.strictEqual(
      escapesSubfolder,
      false,
      'Links não devem escapar da subpasta do projeto'
    );
  }

  console.log(`✓ ${relativePath}: ${linkCount} links e referências verificados com sucesso.`);
}

console.log('✅ Todos os links e recursos respeitam a subpasta do projeto para o GitHub Pages!');
