# Verificação da fase dark-room

Executar `npm run verify:dark-room` após cada alteração de plataforma.

A referência em `fixtures/dark-room-physics.json` preserva geometria, áreas de
apoio, estado inicial da personagem e atributos dos 12 níveis de fuga. Não
atualizar essa referência automaticamente para fazer uma alteração visual passar.

O verificador executa trechos extraídos de `game.js`: `doJump`, integração de
movimento e seleção da plataforma de pouso. Usa a personagem real de 38 × 44 px.
Áudio, partículas e condições de interface são substituídos por controles de teste.
Não executa o loop completo, cenas, câmera ou navegador.

Cobertura:
- Limites esquerdo/direito, contato sem sobreposição e sobreposição mínima.
- Passagem ascendente e contato descendente.
- Queda no centro e nas duas extremidades de cada plataforma.
- Varredura de pontos de saída em passos de 1 px, com movimento a 60 Hz,
  exigindo aterrissagem na próxima plataforma, inclusive do chão para o urso.
- Renderizador real com dimensões dos PNGs, limites do atlas e ausência de
  alterações na geometria física durante o desenho.

## Resultado inicial (antes das correções)

528 verificações de hitbox/renderização passaram. Das 22 transições, 21
apresentaram pelo menos uma posição de saída que alcança o destino.

**Castelo → trem falha**, antes de qualquer alteração de arte ou física:
- Apoio do castelo: x=1636 até 1664, y=236.
- Apoio do trem: x=1860 até 1975, y=244.
- Nível 0 da fuga: velocidade horizontal 2,10 px/frame e impulso -7,20.
- Gravidade: 0,28 px/frame².
- `GameState.finishCutscene` libera o salto longo no nível 0, sem reposicionar
  a personagem. A simulação não cobre a execução completa dessa cena.

O teste inicialmente retornava erro nesta travessia. A correção funcional foi
aplicada separadamente das correções visuais, após autorização para corrigir os
problemas encontrados.

O teste antigo (`scripts/test-physics-scenarios.js`) passa 293 verificações,
mas usava largura de personagem de 28 px e calcula `reachedPlatform` sem exigir
que seja verdadeiro. Seu sucesso não comprova a travessia entre plataformas.

## Critério para mudanças visuais

Após cada plataforma: executar os dois verificadores; conferir no navegador o
salto de entrada e saída, pouso central e bordas, com `DEBUG_COLLISIONS`; comparar
a superfície desenhada com os pés da personagem e a linha de apoio. Os testes
automatizados não validam o contorno visível nem substituem essa inspeção.

## Correções e resultado final

- Impulso horizontal de 3,6 px/frame exclusivamente no salto do castelo no nível
  0 da fuga. Antes era 2,1 e não cobria o vão de 196 px. Arco vertical, posições,
  dimensões, regiões de apoio e atributos dos outros saltos foram preservados.
- Corrigidas cinco associações de sprites no manifesto e nos dois atlas:
  cômoda, caixa de música, castelo, pipa e livro. Os arquivos PNG existentes não
  foram editados; alguns nomes físicos antigos não correspondem ao conteúdo.
- Calibradas as superfícies visuais desses cinco objetos para as hitboxes
  existentes. A configuração de superfícies agora é compartilhada pelos testes
  e pelo renderizador, evitando cópias divergentes.
- Debug respeita `surfaceTopY`, assim como a colisão; sombra de suporte considera
  a posição real do sprite, inclusive seu deslocamento vertical.
- Teste antigo atualizado para a largura real de 38 px. A comprovação de
  travessias fica a cargo de `verify:dark-room`, não do teste antigo.

Resultado: **671 verificações** de hitbox, renderização, transição da cena e
bloqueios de salto passaram; **22 travessias × 3 valores de dt = 66** combinações
alcançáveis. Valores de dt: 0,5; 1; 1,2, cobrindo os extremos aceitos pelo loop.
A bateria anterior passou 293 verificações. Lint, sintaxe e 57 assets passaram.

Inspeção visual executada no Chrome headless pela página
`tests/dark-room-hitboxes.html`, com sprites reais, renderizador de produção,
linha de apoio e corpo de 38 × 44 px. Isso é uma inspeção estática no navegador;
os saltos foram verificados pela execução dos trechos de produção em Node,
não por uma partida completa automatizada com câmera, entrada e cenas.

A silhueta orgânica dos objetos não é uma hitbox por pixel. As áreas físicas
retangulares continuam sendo a referência: bandeiras, caudas, espelhos e
ornamentos são decoração. Halos claros e fragmentos presentes nos recortes
originais permanecem como trabalho de arte, sem ampliar o escopo desta correção.
Antes de regenerar os assets com scripts antigos, revisar suas associações:
esses scripts não foram executados nem modificados nesta correção.
