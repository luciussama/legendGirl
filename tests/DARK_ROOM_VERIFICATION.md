# Verificação atual das plataformas

Referência artística: `assets/art/dark-room/environment-assets-concept.png`.

Executar `npm run verify:dark-room` e `npm run check-assets`.
A referência `fixtures/dark-room-physics.json` não deve ser atualizada para
acomodar uma mudança artística: geometria e parâmetros continuam preservados.

O verificador Node executa os trechos de salto, movimento e colisão de produção;
o navegador executa o loop real pela instrumentação isolada em
`tests/dark-room-playthrough.html?verify=1`. Essa página agora inclui todas as
38 plataformas das três fases, com dt 0,5/1/1,2 (114 transições), e 900 frames
de pausa no castelo. A fase 3 inclui a faixa de sobreposição corporal à esquerda
porque essa faixa já é aceita pela colisão real.

A saída do castelo continua sendo a única assistida. A personagem espera parada
após o diálogo; as demais saídas mantêm os coeficientes fixos/progressivos atuais.
A arte nova não muda esse comportamento.

Renderização: a torre do castelo usa um PNG separado do atlas, com apoio de 28 px.
O pião usa outro PNG novo. A fase 3 usa desenhos de materiais no Canvas e sprites
oficiais reaproveitados; superfícies de contato ficam estáveis mesmo quando
ornamentos ou brilho se animam.

Evidências atualizadas:
- `tmp/dark-room-review/RELATORIO.md`: comparação por elemento e limitações.
- `tmp/dark-room-review/evidencias.html`: galeria antes/depois das 38 plataformas.
- `tmp/dark-room-review/runtime-metricas.json`: 114 resultados reais.
- `tmp/dark-room-review/metricas-visuais.json`: cobertura de apoio por coluna/tick.
- `tmp/dark-room/review/`: cenas, hitboxes, detalhes e JSONs das 22 plataformas
  das fases 1/2, regenerados pelo script de revisão.

Limitação herdada: o corpo pode manter contato mínimo com a hitbox enquanto os
sapatos ficam fora da borda. Não foi modificada na revisão artística para não
alterar navegabilidade/dificuldade. Igualdade entre o plano dos pés e a altura
física não prova igualdade com a arte; por isso as imagens devem ser inspecionadas.
