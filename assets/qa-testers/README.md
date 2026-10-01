# Evidências atuais de QA

Esta é a única localização oficial de evidências. O Git conserva o histórico; não manter versões anteriores, comparações antes/depois, cópias de segurança ou arquivos substituídos.

- `current-reports/`: relatório da validação atual e inventário desta limpeza.
- `current-screenshots/`: capturas regeneradas do código atual e recortes verificados do atlas.
- `current-logs/`: saída das verificações atuais, substituída a cada execução.
- `validation/`: identificação do código validado e integridade dos artefatos.
- `active-test-assets/`: referência de física consumida pela suíte; preservar seu conteúdo.

Consulte o [relatório atual](current-reports/relatorio.md). Sprites e recursos de runtime continuam em seus caminhos de produção.

## Reprodução

Execute na raiz: `npm test`, `npm run build`, `npm run check-assets` e `npm run lint`. Redirecione as saídas para os arquivos correspondentes em `current-logs/`, sobrescrevendo-os.

As capturas usam Chrome isolado com depuração local na porta 9222. `node scripts/review-protagonist-scale.js` requer servidor local na porta 3001; `node scripts/verify-full-browser.js android` requer a porta 3000. Vincule ambos os servidores a `127.0.0.1`. Os scripts gravam nos destinos oficiais e substituem capturas de mesmo nome.

Ao mudar o jogo, exclua evidências que não tenham sido regeneradas. Não altere a referência física para acomodar mudanças apenas visuais. A emulação Android não substitui testes em aparelhos reais.
