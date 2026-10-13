# Guia da arena imaginária

O fluxo é exploração, espada, transformação, arena heroica, combate e retorno. A arena reinterpreta a Toy Room; não substitui a sala nem cria um jogo de luta separado.

`ToyRoomPhase.js` controla a exploração. `ToyRoomArenaPhase.js` gerencia transformação, arena e retorno. `ToyRoomArenaBuilder.js` deriva as estruturas da sala. `ArenaEnvironment.js` desenha o cenário heroico e reutiliza os materiais dos móveis. A câmera, o controller, o HUD, os efeitos e o perfil de áudio da arena têm responsabilidades próprias.

`ToyRoomBattle.js` mantém a simulação e os recursos dos inimigos. `ArenaPlayerRenderer.js` cuida da apresentação da menina. Alterações visuais preservam colisões, apoios e dificuldade. Salvar e carregar precisa funcionar antes, durante e depois da transformação e do combate.

O [guia de designers](../sprites/GUIA-DESIGNERS.md) identifica recursos e metadados. O [diário humano](../DIARIO-HUMANO.md) acompanha as decisões de produto. Relatórios de implementação, execução dos cards e validação ficam no diário de IA.
