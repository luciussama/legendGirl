import express from 'express';
import { createReviewStore, installReviewRoutes } from './tools/sprite-review/store.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global de CORS para permitir acesso seguro a partir de qualquer contexto/iframe
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Fornece arquivos estáticos a partir do diretório raiz
installReviewRoutes(app, createReviewStore({
  catalogPath: path.join(__dirname, 'docs/sprite-review/catalogo.json'),
  selectionPath: process.env.SPRITE_REVIEW_SELECTION_PATH || path.join(__dirname, 'docs/sprite-review/selecoes-exclusao.json')
}), express);

app.use(express.static(__dirname));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor em execução em http://0.0.0.0:${PORT}`);
});

