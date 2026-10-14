# Guia da arena imaginária

O fluxo é exploração, espada, transformação, arena heroica, combate e retorno. A arena reinterpreta a Toy Room; não substitui a sala nem cria um jogo de luta separado.

`ToyRoomPhase.js` controla a exploração. `ToyRoomArenaPhase.js` gerencia transformação, arena e retorno. `ToyRoomArenaBuilder.js` deriva as estruturas da sala. `ArenaEnvironment.js` desenha o cenário heroico e reutiliza os materiais dos móveis. A câmera, o controller, o HUD, os efeitos e o perfil de áudio da arena têm responsabilidades próprias.

`ToyRoomBattle.js` mantém a simulação e os recursos dos inimigos. `ArenaPlayerRenderer.js` cuida da apresentação da menina. Alterações visuais preservam colisões, apoios e dificuldade. Salvar e carregar precisa funcionar antes, durante e depois da transformação e do combate.

O [guia de designers](../sprites/GUIA-DESIGNERS.md) identifica recursos e metadados. O [diário humano](../DIARIO-HUMANO.md) acompanha as decisões de produto. Relatórios de implementação, execução dos cards e validação ficam no diário de IA.
# Corpos e comportamento dos inimigos

Na arena, o contato sólido considera o tamanho ampliado dos corpos e impede a travessia em ambos os sentidos, incluindo investidas. A espada e os efeitos ofensivos têm alcance próprio e não fazem parte do corpo sólido.

O trem mantém o ritmo introdutório e a sequência previsível de golpes. Robô, dinossauro e Urso aumentam gradualmente a pressão. Escolhem entre seus golpes existentes considerando distância, ataques e saltos recentes, agachamento e recuperação da espada. A memória é curta e as decisões são determinísticas; repetir um golpe tem uma penalidade suave, sem impedir uma resposta adequada à situação. O Urso conserva seus oito corações e a fúria existente.

Acertar um inimigo posterior ao Trem abre uma reação de dano seguida de resposta protegida, com preparação completa. Durante a reação e a preparação dessa resposta, insistir com a espada não causa dano nem cura; o HUD avisa quando aguardar, esquivar ou contra-atacar. Nos ataques iniciados normalmente, os primeiros 18 quadros ainda permitem interrupção; depois, a proteção dura até terminar a ameaça. Esquivar libera a recuperação vulnerável. Quando o inimigo acerta a menina, pode encadear uma única continuação, também com preparação completa; a segunda execução sempre oferece recuperação. O salto do Urso tem uma recuperação própria após a aterrissagem.

A espada da arena tem seis quadros de antecipação, seis de contato e disponibilidade a cada 36 quadros. O movimento reduz durante o golpe e a recuperação; golpes contra a proteção exigem recuperação maior, e a menina não ataca durante sua reação de dano. O alcance considera as bordas dos corpos sólidos. A evasão começa na antecipação visível e sai do alcance real; quando encurralado, o inimigo prepara uma resposta em vez de recuar para fora da arena. Evasão não concede invulnerabilidade.

A transferência de corações conserva suas regras: acertos válidos curam, golpes bloqueados não transferem vida. A exploração e o combate legado conservam seus parâmetros. Os tempos da apresentação acompanham as janelas da simulação; as artes e hitboxes dos corpos permanecem as mesmas.

Os movimentos têm identidade sonora: motor do trem, juntas do robô, passos do dinossauro e passos pesados com tecido do Urso. O áudio acompanha deslocamento efetivo e respeita o volume e o silenciamento do jogador.
