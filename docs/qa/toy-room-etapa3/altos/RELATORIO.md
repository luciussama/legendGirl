# Toy Room — Etapa 3: conclusão dos grupos autorizados

6 de outubro de 2026. Os críticos foram aprovados pelo usuário. Antes de retomar a arte, o recurso de exportação foi removido e testado. Em seguida, os grupos altos foram executados na ordem móveis → brinquedos → fada, com validação antes de cada avanço. **Entrega para revisão; nenhuma próxima etapa foi iniciada.**

## Resultado artístico

| IDs | Elemento | Nota anterior | Nota atual, inspeção interna | Evidência de melhoria |
| --- | --- | --- | --- | --- |
| V22/V23 | Estante e livros | E/E | B/B | Tábuas, prateleiras, fundo, veios, lombadas e páginas substituem os retângulos/barras. |
| V25/V26 | Castelo e ameias | E/E | B/B | Blocos de madeira pintada com espessura, encaixes, torres e passagem em arco. |
| V28/V29 | Armário e puxadores | E/D | B/B | Portas emolduradas, topo, lateral, pés, dobradiças e metal dos puxadores. |
| V33 | Robô | E | B | Rosto, antena, braços, juntas, pés e metal pintado; silhueta estreita preservada. |
| V35 | Patinho | D | B | Olho, bico, asa, cauda, coroa conectada e relevo de borracha. |
| V36 | Torre de blocos | E | B | Quatro peças conectadas com quinas, faces e madeira reconhecíveis. |
| V37 | Tambor | D | B | Pele, casco cilíndrico, aros e amarrações com material e iluminação. |
| V38 | Caixa de surpresa | E | B | Palhacinho com rosto, mola conectada, tampa e caixa de madeira pintada. |
| V49 | Fada | E | B, asset | Rosto, cabelo, vestido, asas e varinha ilustrados no universo da protagonista. |

São nove novas ilustrações. As referências de baú, mesa, porta, tapete central, Ursinho e Trem foram conservadas. A comparação de coleção inclui os oito brinquedos em ampliação uniforme e na escala de jogo.

Somados aos [quatro críticos aprovados](../criticos/RELATORIO.md), **os 13 IDs originalmente E atingem B na avaliação interna de seus assets/composição corrigidos**. Os móveis e brinquedos normais já não usam os placeholders geométricos substituídos. A fada normal usa raster ilustrado. Permanecem os mecanismos antigos de fallback para falha de recurso; a inspeção carregou todos os recursos sem falha.

Não houve teste de reconhecimento com crianças ou novos jogadores. As identidades são claras na inspeção, mas “reconhecimento imediato” não foi certificado por tempo medido. A sala inteira não recebeu uma nova nota global nesta entrega: existem pendências D de efeitos, interface e composição.

## Comparações

- [Página comparativa](comparacao.html).
- [Móveis antes](moveis-detalhes-antes.png) / [depois](moveis-detalhes-depois.png).
- [Coleção antes](colecao-antes.png) / [depois](colecao-depois.png).
- [Fada antes](fada-detalhes-antes.png) / [depois](fada-detalhes-depois.png), incluindo sua composição com a protagonista.
- [Sala antes dos grupos altos](final-antes.png) / [sala final](final-depois.png).
- [32 estados de transporte](transporte-32-estados.png): oito brinquedos, esquerda/direita, parada/movimento.
- Aplicação final real: [desktop](../../remocao-exportacao/desktop-sala.png), [retrato](../../remocao-exportacao/retrato-sala.png), [paisagem](../../remocao-exportacao/paisagem-sala.png).

As capturas por grupo são cumulativas contra a referência pós-críticos congelada: [móveis](moveis-depois.png), [brinquedos](brinquedos-depois.png), [fada na primeira integração](fada-depois.png). A captura `final-depois.png` é a apresentação definitiva da fada, após ajustar seu conteúdo sólido para não preencher a área antes ocupada pela aura.

## Preservação da fase

A integração está restrita a `RoomEnvironmentRenderer.renderFurniture()`, `ToyRenderer.renderToy()`, `ToyRoomEntities.renderFairy()` e manifesto. `ToyRoomPhase.js` e `ToyRoomUI.js` permanecem idênticos à referência pós-críticos. Nenhuma configuração de posição, dimensão lógica, peso, velocidade, coleta, colisão, navegação, IA ou progressão foi alterada.

Móveis mantêm a imagem proporcional dentro das áreas anteriores de desenho/sombra: estante 244×104, armário 164×104 e castelo 244×199, sem linhas auxiliares. Os brinquedos conservam seus limites visuais anteriores e a base usada pelas mãos: robô 28×57/base +26; patinho 44×47/+22; blocos 32×50/+22; tambor 36×30/+16; caixa 28×51/+26. A imagem natural é ajustada dentro desses limites, sem deformação. `ToyCarryPresentation.js` e seus parâmetros não mudaram.

A fada conserva centro e acompanhamento lógico. Seu desenho sólido tem dimensão máxima de 40 px dentro do antigo limite de 60×60; os 60 px antigos incluíam a aura SVG. A primeira integração preenchia esse limite com corpo e asas, ampliando o ruído sobre o cabelo; isso foi revisto antes da entrega. A relação V51 de sobreposição continua pendente, explicitada nas imagens, e não recebe nota B por consequência da arte nova.

## Testes e performance

Validações individuais: [móveis](moveis-validacao.json), [brinquedos](brinquedos-validacao.json), [fada](fada-validacao.json) e [final](final-validacao.json).

Cada teste funcional confrontou o controlador atual com a referência congelada. A validação final aprovou:

- 4.941 amostras de colisão e 960 quadros de movimento determinístico iguais.
- Oito coletas, oito solturas, oito armazenamentos e vitória.
- Métodos `update`, `triggerAction`, `resolveCollisions`, `snapshot` e `restore` idênticos; render sem mutação de estado.
- 32 estados de transporte sem sobreposição na região superior da cabeça avaliada.
- 63 casos de contagem/texto de HUD em sete tamanhos internos de Canvas.
- 86 recursos carregados sem falha.
- 87.495 pixels alterados na sala; zero fora das regiões autorizadas dos móveis, brinquedos e fada.

Medição da sala inteira em Canvas de 1600×1200: mediana de render **0,5 → 0,6 ms**. P90: **1,1 → 0,9 ms**. Cadência mediana: **16,7 ms em ambas**. Não foi detectada regressão nessa amostra local; isso não certifica equivalência em toda GPU ou celular físico.

Os nove assets acrescentam **693.155 bytes** (aproximadamente 677 KiB), com orçamento nominal RGBA de **1.678.392 bytes** (aproximadamente 1,6 MiB). Não é medição de memória total. Imagens são pré-carregadas e reutilizadas, sem decodificação por quadro. [Hashes, dimensões e custo](integridade-e-recursos.json). As três imagens críticas anteriores têm custo adicional registrado no relatório próprio.

`npm test`, lint, check-assets, sintaxe dos arquivos alterados e `git diff --check` aprovados. [Suíte final](testes.log). Scripts específicos: `test-toy-room-stage3-high-browser.js` e `capture-toy-room-stage3-review.js`; requerem servidor :8765 e Chrome isolado com CDP :9223.

## Exportação removida e teste de ponta a ponta

Foram excluídos o pacote gerado, página dedicada, botões, modal, estilos, eventos, streaming, rotas, geração automática, scripts e dependência `archiver`; lockfile e documentação ativa foram atualizados. Três testes visuais passaram a usar `index.html`. O servidor retorna 404 para as antigas rotas; o acesso ao jogo continua pela página principal. Evidências históricas de QA permanecem registros de versões anteriores.

O teste integrado foi aprovado antes de iniciar a arte e repetido na versão final. Nas três telas reais: início pela interface, pausa/continuação, som, movimento por teclado CDP, 24 coletas/armazenamentos no total, vitória e restauração após recarga. Zero exceções JavaScript. As posições junto aos brinquedos/baú foram preparadas para exercitar ações; não se afirma percurso completo da campanha ou entre todos os objetos. [Relatório da remoção](../../remocao-exportacao/RELATORIO.md) e [resultados finais](../../remocao-exportacao/ponta-a-ponta.json).

## Pendências e próxima revisão

Continuam pendentes: família de sombras V15/V16/V21/V30/V39; feixes solares; composição fada/cabeça V51 e rastro; faíscas azuis; auras/placa PEGAR; estilo artístico do HUD, joystick e botões; zona pontilhada de toque; introdução/vitória; feedback próprio do baú ilustrado; distinção entre decoração e coletáveis; continuidade de escala chão/mãos e composição da pose de transporte. As sombras incorporadas aos móveis novos melhoram esses três objetos, mas não concluem a família geral de sombras.

A aura SVG antiga não aparece com o novo sprite; a iluminação da fada faz parte da pintura. Não foram redesenhados os demais efeitos. A remoção do recurso também retirou da apresentação os antigos itens de download V82/V86/V87.

Recomendação: revisar as comparações e aprovar os grupos altos antes de definir a próxima intervenção. Priorizar composição ao redor da protagonista e feedback/legibilidade de interação, com escopo próprio. **Nenhuma próxima etapa começou automaticamente.**

## Origem

Arte gerada com a habilidade `imagegen` e referência `assets/art/toy-room/environment-sheet.png`; sprites recortados pela transparência, reduzidos e copiados para `assets/art/toy-room/stage3/`. Os originais de referência não foram sobrescritos. [Prompts dos grupos altos](../../../../assets/art/toy-room/stage3/prompts-altos.json). Os novos comentários, diagnósticos e documentação estão em português do Brasil; prompts originais preservados para rastreabilidade.
