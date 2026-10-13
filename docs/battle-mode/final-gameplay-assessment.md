# Decisão da avaliação de gameplay — Prompt 16

**PASS WITH OBSERVATIONS, no alcance do playtest controlado.**

A implementação permite terminar a aquisição da espada, entrar na arena, derrotar Trem, Robô, Dinossauro e Urso e chegar à conclusão. Derrota, transferência de corações, limites de HP, Enrage e persistência passaram nos testes executados. A menina foi ampliada em 2× exclusivamente no desenho da batalha, com espada e ataques acompanhando a escala.

Pode prosseguir a avaliação de gameplay autorizada. Esta decisão não é homologação artística do Prompt 14 nem aprovação final para publicação: permanecem as pendências do [backlog](known-issues-backlog.md), o balanceamento humano e testes em hardware móvel/gamepad real. A justiça de todas as colisões em relação à silhueta ampliada não foi certificada por teste com jogadores.

Evidências e parâmetros estão na [revisão de gameplay](gameplay-review-report.md) e no [relatório de playtest](battle-playtest-report.md). Reprodução: `npm run test:toy-room:battle`, `npm run test:toy-room:qa` e, com `npm run dev`, `/tests/battle-gameplay.html`.

## Achados posteriores — Prompt 17

A [revisão de polimento](post-playtest-polish-report.md) manteve a conclusão dos percursos funcionais, mas confirmou divergências entre desenho e colisão no Rocket Punch e no laser durante agachamento. A justiça de hitboxes foi reaberta e está **reprovada**; a tentativa isolada de reduzir alcance foi descartada por alterar a eficácia do inimigo. O PASS WITH OBSERVATIONS acima registra o alcance da avaliação anterior e não aprova os novos casos identificados. A aprovação final de release continua impedida até tratar essas divergências.

## Entrada e retorno à caixa

As trocas instantâneas foram substituídas por transporte animado: o derrotado volta à caixa enquanto o próximo entra; o Urso é guardado antes da vitória. As novas transições e as regressões funcionais passaram no alcance dos testes executados. O [relatório da alteração](toy-box-transition-review.md) contém comportamento, matriz, evidências e reprodução. As divergências anteriores de hitbox continuam reprovadas.

## Certificação de justiça — Prompt 18

O [relatório de certificação](fairness-certification-report.md) registra as correções locais de Rocket Punch, laser e transmissão do Trem, com regressões funcionais aprovadas. A matriz ampliada verifica 886 amostras do punho e 336 do laser. **O resultado geral continua FAIL**: Robot Walk não foi homologado e Toy Leap causa dano sem representação correspondente da extensão do impacto. Os resultados anteriores permanecem históricos; não há aprovação final para publicação nem encerramento de DEFECT-008.
