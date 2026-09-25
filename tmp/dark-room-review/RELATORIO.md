## Plataforma 20 — armário de parede completo

O beiral existente agora integra um armário suspenso de madeira com duas portas, painéis, dobradiças, puxadores e fixações inferiores. O desenho do beiral e o apoio físico permanecem na posição original: x=4300, y=156, largura=72. Não foram criadas novas colisões ou linhas auxiliares de pouso.

Capturas atualizadas: `../dark-room/review/20-scene.png`, `20-hitbox.png`, `20-support.png`. Suíte aprovada (`testes-armario.txt`); 63 cenários até a plataforma 20 e três saídas para a 21 aprovados no navegador. Física e estados preservados por SHA-256.

## Relógio cuco (19) — apoio integrado à fixação

Relógio suspenso por fixação central sob uma estrutura de madeira com travessa, parafusos e mãos-francesas. O tampo dessa estrutura serve de apoio para os pés, conforme exceção visual autorizada. Apoio físico preservado em x=3980, y=168, largura=75. A métrica visual da auditoria anterior para o cuco está superada.

Capturas atuais: `../dark-room/review/19-scene.png`, `19-hitbox.png` e `19-support.png`. Suíte aprovada (`testes-cuco.txt`); 60 cenários de chegada e três saídas para a plataforma 20 aprovados no navegador. Física e estados preservados por SHA-256.

## Fixação da pipa — referência com ganchos

A plataforma 15 recebeu uma tábua traseira sob o tampo, três ganchos metálicos e uma alça visível conectando a ponta da pipa ao gancho esquerdo. A pipa foi afastada do tampo para tornar a suspensão legível. O apoio continua em x=2917, y=196, largura=90. Capturas `15-scene.png`, `15-hitbox.png` e `15-support.png` atualizadas. Suíte de testes aprovada, 48 cenários de chegada e três de saída aprovados. Física e estados preservados por SHA-256.

## Atualização posterior — pipa guardada sob prateleira (plataforma 15)

A pipa existente foi preservada e reposicionada visualmente abaixo de uma prateleira sólida de madeira, presa por um cordão curto. A personagem caminha no tampo da prateleira. Apoio físico inalterado: x=2917, y=196, largura=90. Sem marcadores de salto sobrepostos ao desenho. A classificação visual histórica da pipa abaixo refere-se ao estado anterior.

Evidências atuais: `../dark-room/review/15-scene.png`, `15-hitbox.png` e `15-support.png`. Suíte `verify:dark-room` aprovada; navegador: 48 cenários até a plataforma 15 e três saídas para a 16 aprovados. Contato dos pés confirmado nas três posições de apoio. Física e arquivos de estado idênticos por SHA-256. Registro: `testes-pipa.txt`.

## Atualização posterior — globo sobre mesa (plataforma 14)

Novo sprite baseado na referência enviada: globo azul e oliva com suporte dourado sobre mesa de madeira. A personagem caminha na frente do globo, sobre o tampo. Apoio físico preservado: x=2687, y=218, largura=95. Nenhum traço auxiliar foi acrescentado. Capturas atuais: `../dark-room/review/14-scene.png`, `14-hitbox.png` e `14-support.png`. A medição visual histórica de 9,5% abaixo refere-se ao sprite anterior e está superada por esta atualização; não representa a mesa atual.

Validação: suíte `verify:dark-room` aprovada; 45 cenários de chegada até a plataforma 14 e três cenários de saída para a 15 aprovados no navegador. Física e arquivos de estado preservados por comparação SHA-256. Testes em `testes-globo.txt`.

# Avaliação das condições atuais

Coleta: 2026-09-25T15:44:07.610933+00:00. Nenhum código, sprite, parâmetro físico ou hitbox foi alterado nesta revisão. O caminho `src/tmp` não existe neste checkout; as evidências atuais estão em `tmp/dark-room` e `tmp/dark-room-review`.

## Cobertura e método

38 plataformas: 22 nas fases 1/2 e 16 na fase 3. Cada uma possui captura de cenário, hitbox e detalhe dos pés nas posições esquerda/centro/direita. As primeiras 22 também possuem painéis e imagens individuais de posição em `gameplay-inspection`. A saída do castelo inclui espera, decolagem, voo e pouso em `reviewed`.

As capturas usam o jogo real com instrumentação de inspeção já existente, que posiciona a personagem nos estados avaliados. Não representam uma partida humana contínua. Linhas verdes são sobreposições técnicas de diagnóstico; as imagens `*-scene.png` estão sem elas. Os painéis de grupos isolam plataformas; a porta falsa aparece nas capturas de cenário da plataforma 21.

114 cenários de salto (38 destinos × dt 0,5 / 1 / 1,2) encontraram pouso válido, com os pés físicos na altura de apoio. A varredura adicional testa lançamentos a cada 1 px, incluindo sobreposição corporal de 37 px nas bordas. Todos os destinos são alcançáveis na amostragem. A taxa geométrica não é taxa de sucesso de jogadores e não comprova dificuldade adequada. Dados completos em `metricas-saltos.json` e `transicoes.csv`.

No último salto da fase 3, a taxa geométrica varia de 17,24% a 28,74%; a faixa entre o primeiro e o último lançamento bem-sucedido varia de 14 a 24 px.

## Discrepâncias visuais observadas

A medição procura pixels com alfa ≥128 em cada coluna do apoio, nos ticks 0, 8 e 24, até 32 px acima ou abaixo. Cobertura menor que 99% é sinalizada como suspeita para inspeção visual, sem declarar automaticamente colisão inválida. Valores positivos de offset indicam pixels abaixo da linha física. Não foram adicionadas barras para ocultar diferenças.

| Fase | Índice | Objeto | Cobertura em ±1 px | Offset mínimo/máximo (px) |
|---|---:|---|---:|---:|
| 1 | 1 | open_books | 24.5% | 0 / 26 |
| 1 | 3 | small_dresser | 81.7% | 0 / 10 |
| 1 | 4 | messy_blocks | 58.0% | 0 / 9 |
| 2 | 14 | spinning_globe | 9.5% | 0 / 32 |
| 2 | 15 | kite_frame | 0.0% | 2 / 22 |
| 2 | 17 | chandelier_crystals | 98.8% | 0 / 1 |
| 2 | 18 | curtain_rod | 77.6% | 0 / 4 |
| 2 | 19 | cuckoo_clock | 1.3% | 1 / 30 |
| 2 | 21 | grand_portal_pedestal | 95.9% | 0 / 10 |
| 3 | 15 | true_portal_balcony | 95.9% | 0 / 10 |

Demais plataformas: cobertura ≥99% nesta amostragem, sem garantia de coincidência em todas as poses. Pixels decorativos podem interferir na métrica; as imagens devem ser avaliadas junto dos dados. Não foi medida taxa humana nem margem temporal de reação.

## Verificação

`npm run verify:dark-room` e `npm run check-assets` aprovados. Integridade comparada ao início desta execução em `integridade-final.json`. Evidências antigas de comparação foram retiradas para evitar mistura de estados; os relatórios e as capturas atuais substituem os anteriores. Nenhuma correção foi executada.
