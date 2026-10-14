# Guia da arena imaginária

O fluxo é exploração, espada, transformação, arena heroica, combate e retorno. A arena reinterpreta a Toy Room; não substitui a sala nem cria um jogo de luta separado.

`ToyRoomPhase.js` controla a exploração. `ToyRoomArenaPhase.js` gerencia transformação, arena e retorno. `ToyRoomArenaBuilder.js` deriva as estruturas da sala. `ArenaEnvironment.js` desenha o cenário heroico e reutiliza os materiais dos móveis. A câmera, o controller, o HUD, os efeitos e o perfil de áudio da arena têm responsabilidades próprias.

`ToyRoomBattle.js` mantém a simulação e os recursos dos inimigos. `ArenaPlayerRenderer.js` cuida da apresentação da menina. Alterações visuais preservam colisões, apoios e dificuldade. Salvar e carregar precisa funcionar antes, durante e depois da transformação e do combate.

O [guia de designers](../sprites/GUIA-DESIGNERS.md) identifica recursos e metadados. O [diário humano](../DIARIO-HUMANO.md) acompanha as decisões de produto. Relatórios de implementação, execução dos cards e validação ficam no diário de IA.
# Corpos e comportamento dos inimigos

Na arena, o contato sólido considera o tamanho ampliado dos corpos e impede a travessia em ambos os sentidos, incluindo investidas. A espada e os efeitos ofensivos têm alcance próprio e não fazem parte do corpo sólido.

O trem mantém o ritmo introdutório. Robô, dinossauro e Urso aumentam gradualmente a pressão. Os três inimigos avançados podem recuar diante da antecipação da espada e tentar um contra-ataque; o intervalo entre evasões conserva oportunidades de acertá-los. O Urso combina a maior pressão com seus oito corações e a fúria existente. Não se deve interpretar as evasões como invulnerabilidade.

Os movimentos têm identidade sonora: motor do trem, juntas do robô, passos do dinossauro e passos pesados com tecido do Urso. O áudio acompanha deslocamento efetivo e respeita o volume e o silenciamento do jogador.
