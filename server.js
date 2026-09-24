import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ZipArchive } from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const ZIP_FILE_PATH = path.join(__dirname, 'o-quarto-dos-brinquedos.zip');

// Middleware global de CORS para permitir acesso seguro a partir de qualquer contexto/iframe
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length, Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

let zipGenerationPromise = null;

function ensureZipReady() {
  if (fs.existsSync(ZIP_FILE_PATH) && fs.statSync(ZIP_FILE_PATH).size > 10000000) {
    return Promise.resolve(ZIP_FILE_PATH);
  }

  if (zipGenerationPromise) {
    return zipGenerationPromise;
  }

  console.log('[ZIP] Iniciando geração do arquivo ZIP do projeto...');
  zipGenerationPromise = new Promise((resolve, reject) => {
    const tempPath = path.join(__dirname, 'o-quarto-dos-brinquedos.tmp.zip');
    const output = fs.createWriteStream(tempPath);
    const archive = new ZipArchive({
      zlib: { level: 6 }
    });

    output.on('close', () => {
      try {
        fs.renameSync(tempPath, ZIP_FILE_PATH);
        const finalSize = fs.statSync(ZIP_FILE_PATH).size;
        console.log(`[ZIP] Arquivo ZIP gerado com sucesso: ${(finalSize / 1024 / 1024).toFixed(2)} MB (${finalSize} bytes)`);
        resolve(ZIP_FILE_PATH);
      } catch (renameErr) {
        reject(renameErr);
      } finally {
        zipGenerationPromise = null;
      }
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('[ZIP] Aviso:', err);
      } else {
        throw err;
      }
    });

    archive.on('error', (err) => {
      try {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      } catch (_) {}
      console.error('[ZIP] Erro ao compactar:', err);
      zipGenerationPromise = null;
      reject(err);
    });

    archive.pipe(output);

    archive.glob('**/*', {
      cwd: __dirname,
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
  });

  return zipGenerationPromise;
}

// Garante que o arquivo ZIP exista no disco logo na inicialização
ensureZipReady().catch(console.error);

// Endpoint de status / verificação do ZIP
app.get('/api/zip-info', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (fs.existsSync(ZIP_FILE_PATH)) {
    const stat = fs.statSync(ZIP_FILE_PATH);
    res.json({
      ready: true,
      filename: 'o-quarto-dos-brinquedos.zip',
      sizeBytes: stat.size,
      sizeMb: (stat.size / 1024 / 1024).toFixed(2),
      modified: stat.mtime
    });
  } else {
    res.json({
      ready: false,
      isGenerating: Boolean(zipGenerationPromise)
    });
  }
});

const serveZipFile = (req, res) => {
  try {
    const zipPath = path.join(__dirname, 'o-quarto-dos-brinquedos.zip');
    if (!fs.existsSync(zipPath)) {
      return res.status(404).send('Arquivo ZIP não encontrado no servidor.');
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length, Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=120');

    res.download(zipPath, 'o-quarto-dos-brinquedos.zip', (err) => {
      if (err) {
        if (!res.headersSent) {
          console.error('[ZIP] Erro ao enviar download:', err);
          res.status(500).send('Erro ao enviar o arquivo ZIP.');
        }
      }
    });
  } catch (error) {
    console.error('Download route exception:', error);
    if (!res.headersSent) {
      res.status(500).send('Erro interno ao obter o arquivo ZIP.');
    }
  }
};

// Endpoints e rotas equivalentes para download do projeto compactado em formato ZIP
app.get('/api/download-zip', serveZipFile);
app.get('/api/download-zip/*', serveZipFile);
app.get('/download-zip', serveZipFile);
app.get('/download', serveZipFile);
app.get('/o-quarto-dos-brinquedos.zip', serveZipFile);
app.head('/api/download-zip', serveZipFile);
app.head('/o-quarto-dos-brinquedos.zip', serveZipFile);

// Página dedicada e independente de download para abrir fora do iframe
app.get(['/baixar', '/download-direct', '/download-center'], (req, res) => {
  res.sendFile(path.join(__dirname, 'baixar.html'));
});

// Fornece arquivos estáticos a partir do diretório raiz
app.use(express.static(__dirname));

// Redirecionamento fallback para index.html em roteamento de cliente/SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

