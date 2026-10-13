# Entrada na arena e retorno à caixa — implementação e regressão

**Resultado das novas transições: PASS nos testes executados. A aprovação geral de hitboxes continua FAIL.**

## Comportamento entregue

Após a cena da espada, o Trem sai da caixa e percorre uma trajetória até a arena. Cada inimigo executa primeiro sua sequência Death; em seguida, o derrotado é transportado para a caixa enquanto o próximo sai dela com seu ciclo Walk. A ordem permanece Trem → Robô → Dinossauro → Urso. A vitória só começa depois que o Urso termina de voltar à caixa.

Cada transporte dura 120 quadros de simulação, aproximadamente dois segundos a 60 Hz. A trajetória usa interpolação suave, arco e redução/aumento contínuo de escala para representar profundidade junto à caixa. O derrotado permanece inerte, com oscilação durante o transporte; essa pose não representa caminhada. O próximo utiliza os quadros de locomoção existentes. A frente ilustrada da caixa encobre os brinquedos nas extremidades do percurso: não há dissolução por transparência nem substituição imediata do desenho.

A mesma ilustração da caixa é apresentada em posição visível na arena, sem alterar a posição lógica do móvel durante exploração. Nenhum recurso raster novo foi necessário. A câmera permanece fixa, e a escala 2× da protagonista foi preservada.

Durante o transporte, movimento, ataques e simulação ofensiva ficam suspensos. Corações, imunidade, cooldown e estados ofensivos não avançam nesse intervalo. Ao finalizar, inputs são limpos para evitar movimento residual. HP, repertórios, alcance, velocidades e janelas ofensivas dos confrontos permanecem iguais.

O estado da transição inclui os dois brinquedos e o tempo decorrido. Save/load retoma o mesmo ponto, sem duplicar a derrota nem antecipar vitória. Saves antigos sem esse campo continuam seguindo seu estado anterior.

## Matriz de verificação

| Verificação | Resultado / evidência |
| --- | --- |
| Entrada inicial e entradas de todos os adversários | PASS; posições de origem encobertas pela caixa. |
| Quatro transportes de derrotados | PASS; posição inicial conserva corpo/facing; posição final encoberta pela caixa. |
| Saída e chegada simultâneas | PASS; objetos independentes durante a mesma transição. |
| Inputs e impactos durante transporte | PASS; ataque recusado, movimento/salto suspensos e HP preservado. |
| Save/load durante cada retorno | PASS nos quadros 24, 48, 72 e 96; mesma posição e somente um evento DEFEATED. |
| Último retorno / vitória | PASS; vitória começa somente após guardar o Urso. |
| Conclusão, derrota e retorno ao título | PASS nas suítes de combate; derrota e callback também revisados no Chrome. |
| Transferência, limites de HP e Enrage | PASS; testes existentes preservados. |
| Nove ataques dos quatro inimigos, salto e agachamento | PASS nos testes de combate existentes. |
| Exploração, espada, câmera, orientação, teclado/joystick/gamepad | PASS nas suítes automatizadas da Toy Room. |
| Plataformas, campanha, dificuldade, menus/recursos, diálogos e layout móvel | PASS no alcance coberto por `npm test`, QA e build. |
| Sprite manifest / polimento anterior | PASS técnico; 144 PNGs e 26 sequências. Não representa homologação artística. |
| Justiça de Rocket Punch e laser | FAIL já existente; diagnóstico estrito continua reprovado. |

## Playtest e comparação

O percurso com investigação real da espada terminou em vitória para dt 0,5 / 1 / 3: 2326 / 1164 / 392 atualizações, menina com 3 HP, ordem correta e recarga aprovada. A duração aumentou intencionalmente com cinco transportes: entrada inicial, três trocas e retorno final. Não se espera igualdade do número de atualizações com o playtest anterior.

A suíte dedicada, iniciada com a espada equipada, também concluiu com dt 12, cobrindo atualizações lentas e subpassos. Foram 2364 / 1183 / 400 / 104 atualizações para dt 0,5 / 1 / 3 / 12. Nenhum softlock ou duplicação de dano/progressão apareceu nesses percursos.

No Chrome, `/tests/battle-gameplay.html` executou exploração e campanha reais com desenho: 11 coletas, seis recargas durante exploração, 1164 atualizações na batalha, 3 HP, recarga e vitória. A inspeção pausada confirmou Trem voltando e Robô entrando simultaneamente. A página inclui o botão **Pausar no transporte para a caixa** e avanço quadro a quadro para reproduzir a revisão.

## Reprodução e evidências

- `npm test`: regressões gerais do projeto.
- `npm run test:toy-room:qa`: narrativa, tutorial, câmera, orientação e controles.
- `npm run test:toy-room:battle`: combate e nova suíte de transições.
- `npm run test:battle:polish`: invariantes de arte, arquivos e combate.
- `npm run test:mobile-ui` e `npm run build`: layout móvel e referências da publicação.
- `npm run test:battle:fairness`: **falha esperada atualmente**, pelos dois defeitos confirmados; não é teste aprovado.

Registros: [regressões gerais](transition-evidence/regression.log), [QA da Toy Room](transition-evidence/toy-room-qa.log), [combate e transições](transition-evidence/battle-transitions.log), [layout móvel](transition-evidence/mobile-ui.log). Implementação: `src/js/toy-room/ToyRoomBattle.js`; testes novos: `scripts/test-battle-transitions.js`.

## Pendências e limites

Rocket Punch ainda pode causar dano além do punho visível; o laser ainda cruza visualmente a menina agachada sem causar dano. Esses casos antecedem a alteração e seguem no [backlog](remaining-backlog.md). Não foram alteradas colisões para encobrir a reprovação.

Os ciclos de locomoção e demais pendências artísticas anteriores continuam sujeitos à revisão. Não houve playtest com pessoas, Android físico ou gamepad físico, nem certificação de todas as combinações possíveis de mecânicas. Os resultados aprovam a mudança no alcance observado e automatizado; não constituem aprovação final de release.
