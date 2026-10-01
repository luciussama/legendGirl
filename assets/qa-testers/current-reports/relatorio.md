# Refactor-QA-002 — Estado atual

Evidências centralizadas em `assets/qa-testers/`. Relatórios e capturas anteriores foram excluídos, sem arquivo histórico, backup ou cópia de retenção. Todas as imagens e saídas mantidas foram geradas nesta validação; a referência física ativa foi transferida sem modificar um byte.

## Verificação

- `npm test`: aprovado (suíte completa definida pelo projeto).
- `npm run build`, `npm run check-assets` e `npm run lint`: aprovados.
- Testes adicionais de abertura e iluminação: aprovados.
- `test-physics-scenarios.js`: 293/293 aprovados.
- Chrome com Android emulado: percurso completo aprovado, 38 apoios, portais e 8 brinquedos guardados.
- Capturas da escala atual: desktop e Android emulado.
- Imports locais e referências aos caminhos removidos: aprovados; consulte `../current-logs/referencias.log`.
- Sprites, gameplay, física, manifesto, áudio e demais arquivos de runtime: preservados. A referência de física é idêntica à versão anterior no Git.

A auditoria auxiliar `test-audit-measure.js` retorna 30 apoios válidos, 2 suspeitos e 6 inválidos. Esse diagnóstico visual não é uma aprovação: o script termina com código zero mesmo nesses casos. Os resultados constam em `../current-logs/medidas.log`; nenhuma correção visual ou física foi feita nesta limpeza. Emulação não equivale a teste em aparelho real.

## Artefatos

- [Captura desktop](../current-screenshots/escala/desktop-atual.png).
- [Captura Android](../current-screenshots/escala/android-atual.png).
- [Recortes do atlas atual](../current-screenshots/personagem/crops.png).
- [Percurso atual](../current-screenshots/percurso/percurso.json).
- [Estado do código e hashes das evidências](../validation/estado-atual.json).
- [Inventário completo de arquivos removidos e mantidos, pastas removidas e consolidadas](inventario-limpeza.json).

## Limpeza

635 arquivos excluídos; 32 pastas removidas. Consolidados `tmp/`, `docs/` e `tests/fixtures/`.

Bytes excluídos: 134,650,709. Espaço líquido liberado pelas evidências: 132,474,568 bytes (126.34 MiB), descontando os novos artefatos e a referência transferida. Medida por tamanho lógico; o histórico em `.git` permanece intacto.

A documentação funcional em `README.md`, `tests/DARK_ROOM_VERIFICATION.md` e nos diretórios de arte permanece ativa. Os scripts de revisão usam os destinos oficiais e não geram mais capturas “antes”. O ZIP de distribuição e assets de produção foram preservados; a inspeção do ZIP não encontrou entradas em `tmp/` ou `docs/`.
