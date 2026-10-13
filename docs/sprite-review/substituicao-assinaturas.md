# Substituição das assinaturas antigas

As **46 assinaturas** marcadas como antigas em `selectedCode` foram removidas, preservando as escolhas originais no JSON. A limpeza abrange os desenhos selecionados, sem excluir os módulos compartilhados ou desenhos classificados como atuais.

## Destino de cada família

| Família | Quantidade | Substituição |
| --- | ---: | --- |
| Plataformas | 22 | Ilustrações aprovadas dos atlas e recursos atuais; removidos os respectivos casos de desenho antigo e sua alternativa genérica. |
| Cenário do quarto escuro | 17 | Sete ilustrações/recortes aprovados reutilizados e dez PNGs criados com imagegen. |
| Móveis da Toy Room | 6 | Baú, estante, poltrona, fortaleza, mesa e cavalinho usam as ilustrações atuais; removidos seus corpos procedurais antigos. |
| Fada do quarto escuro | 1 | Ilustração aprovada já usada no layout atual; removido o corpo geométrico antigo. Efeitos e feixe narrativo permanecem. |

Os estilos não selecionados mantêm seus desenhos. O corpo compartilhado de `cardboard_box` e `small_dresser` foi preservado apenas para `cardboard_box`, que não foi selecionado. Física, colisões, apoio dos pés, posições e dificuldade não foram alterados. Não foram acrescentadas linhas ou guias sobre plataformas.

## Novos recursos

Gerados pelo **imagegen integrado**, individualmente, com transparência real, usando `royal-duck-v1.png` e `stacking-blocks-v1.png` como referências da assinatura atual. Os PNGs estão em `assets/art/dark-room/scenery-current/`:

- `toy_soldier.png`: soldadinho de madeira.
- `spilled_crayons.png`: gizes de cera espalhados.
- `striped_socks.png`: meias de tricô.
- `dropped_sweater.png`: casaquinho de tricô.
- `paper_airplane.png`: avião de papel.
- `dinosaur_felt.png`: dinossauro de feltro.
- `slinky.png`: mola arco-íris.
- `puzzle_pieces.png`: peças de quebra-cabeça.
- `toy_car.png`: carrinho de madeira.
- `cardboard_box_floor.png`: caixa aberta com ursinho.

A conferência visual revelou que dois recursos existentes não representavam seus nomes: o recorte de “carrinho” era um bloco, e a imagem de “caixa” era uma cômoda. Foram gerados substitutos específicos para esses objetos, sem mudar as ilustrações existentes de blocos ou cômodas.

Os prompts completos e os caminhos de origem constam em `prompts-substitutos.json`. O manifesto pré-carrega os novos recursos; `currentScenery.js` mantém dimensões e posições decorativas e conserva as proporções das imagens. Ausência de recurso não reativa desenhos antigos.

## Validação

- `npm test`: suíte existente e teste específico das substituições.
- `npm run build`, `npm run check-assets` e `npm run test:sprite-cleanup`.
- `npm run test:current-art:browser`: 114 saltos, pausa no castelo, plataformas e conteúdo visível nos 17 elementos de cenário, sem falhas HTTP ou exceções JavaScript.
- `npm run test:toy-room:arena:browser`: exploração, espada, transformação, quatro inimigos, save/load, nova tentativa, vitória e retorno, em desktop e Android em retrato/paisagem.

As evidências de navegador estão em `docs/qa/assinaturas-atuais/` e `docs/qa/toy-room-arena/`. A seleção histórica não foi reescrita para marcar as substituições como aprovadas pelo usuário.
