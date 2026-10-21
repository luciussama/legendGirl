# Guia da arena imaginária

Revisão: 18/10/2026. Esta é a descrição do runtime atual. O [design inicial](../battle-mode/battle-mode-rules.md) e seus JSONs preservam a concepção anterior; não são a configuração de execução. Para o conjunto do aplicativo, consulte [ARQUITETURA](../ARQUITETURA.md).

O fluxo é exploração, espada, transformação, arena heroica, combate e retorno. A arena reinterpreta a Toy Room; não substitui a sala nem cria um jogo de luta separado.

`ToyRoomPhase.js` controla a exploração. `ToyRoomArenaPhase.js` gerencia transformação, arena e retorno. `ToyRoomArenaBuilder.js` deriva as estruturas da sala. `ArenaEnvironment.js` desenha o cenário heroico e reutiliza os materiais dos móveis. A câmera, o controller, o HUD, os efeitos e o perfil de áudio da arena têm responsabilidades próprias.

`ToyRoomBattle.js` mantém a simulação e coordena o combate. `BattleConfig.js` fornece os parâmetros compartilhados sem carregar a implementação da batalha; `BattleAssets.js` carrega o manifesto e as imagens existentes; `BattleRenderer.js` apresenta inimigos, combate legado, HUD e impactos. Os métodos públicos `render` e `renderImpact` e os exports anteriores de `ToyRoomBattle.js` permanecem compatíveis. `ArenaPlayerRenderer.js` cuida da apresentação da menina. Alterações visuais preservam colisões, apoios e dificuldade. Salvar e carregar precisa funcionar antes, durante e depois da transformação e do combate.

Os carregadores preservam as URLs relativas ao módulo e os manifestos atuais. Antes de mover qualquer arquivo de código, verificar também essa resolução, os recortes, as âncoras e os consumidores das imagens. A separação de responsabilidades não autoriza excluir assets ou substituir sprites por desenhos procedurais.

O [guia de designers](../sprites/GUIA-DESIGNERS.md) identifica recursos e metadados. O [diário humano](../DIARIO-HUMANO.md) acompanha as decisões de produto. Relatórios de implementação, execução dos cards e validação ficam no diário de IA.
# Corpos e comportamento dos inimigos

Na arena, encostar no corpo de um inimigo ou ele surgir sobre a menina não causa dano: apenas golpes em sua janela ativa podem ferir. O contato sólido considera o tamanho ampliado dos corpos e impede a travessia em ambos os sentidos, incluindo investidas. A espada e os efeitos ofensivos têm alcance próprio e não fazem parte do corpo sólido.

O trem mantém o ritmo introdutório e a sequência previsível de golpes. Robô, dinossauro e Urso aumentam gradualmente a pressão. Escolhem entre seus golpes existentes considerando distância, ataques e saltos recentes, agachamento e recuperação da espada. A memória é curta e as decisões são determinísticas; repetir um golpe tem uma penalidade suave, sem impedir uma resposta adequada à situação. O Urso conserva seus oito corações e a fúria existente.

Acertar um inimigo posterior ao Trem abre uma reação de dano seguida de resposta protegida, com preparação completa. Durante a reação e a preparação dessa resposta, insistir com a espada não causa dano nem cura; o HUD avisa quando aguardar, esquivar ou contra-atacar. Nos ataques iniciados normalmente, os primeiros 18 quadros ainda permitem interrupção; depois, a proteção dura até terminar a ameaça. Esquivar libera a recuperação vulnerável. Quando o inimigo acerta a menina, pode encadear uma única continuação, também com preparação completa; a segunda execução sempre oferece recuperação. O salto do Urso tem uma recuperação própria após a aterrissagem.

A espada da arena tem seis quadros de antecipação, seis de contato e disponibilidade a cada 36 quadros. O movimento reduz durante o golpe e a recuperação; golpes contra a proteção exigem recuperação maior, e a menina não ataca durante sua reação de dano. O alcance considera as bordas dos corpos sólidos. A evasão começa na antecipação visível e sai do alcance real; quando encurralado, o inimigo prepara uma resposta em vez de recuar para fora da arena. Evasão não concede invulnerabilidade.

A transferência de corações conserva suas regras: acertos válidos curam, golpes bloqueados não transferem vida. A exploração e o combate legado conservam seus parâmetros. Os tempos da apresentação acompanham as janelas da simulação; as artes e hitboxes dos corpos permanecem as mesmas.

O alcance efetivo da espada foi ampliado em 10% sobre o balanceamento anterior, tanto no valor nominal (190 para 209) quanto no mínimo derivado dos corpos. `getSwordRange` compartilha esse cálculo com a evasão. A retirada rápida do Robô foi compatibilizada com esse alcance; tempos e recuperação da espada continuam os mesmos.

O som da espada distingue passagem de ar, acerto e bloqueio. Um acerto combina estalo, corpo grave e ressonância da lâmina com a reação própria do brinquedo; um bloqueio tem ricochete metálico e faíscas claras, sem emitir dano ou cura. Os efeitos ficam na região de contato da lâmina, acompanhando salto e agachamento. Arco, partículas, pausa breve do impacto e tremor foram reforçados, mantendo corações, recuo e hitboxes dos corpos. Volume mestre, mudo, pausa e transições continuam controlando os sons.

Os movimentos têm identidade sonora: motor do trem, juntas do robô, passos do dinossauro e passos pesados com tecido do Urso. O áudio acompanha deslocamento efetivo e respeita o volume e o silenciamento do jogador.

## Perfis e parâmetros atuais

| Perfil | Menina | Trem | Robô | Dinossauro | Urso | Câmera / configuração |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Arena imaginária | 3 | 3 | 4 | 4 | 8 | ArenaCamera, ARENA_TUNING e ARENA_ENEMIES |
| Combate legado | 3 | 2 | 2 | 2 | 4 | BATTLE_TUNING; usado sem perfil de apresentação de arena |

A ordem é Trem → Robô → Dinossauro → Urso, um por vez. O eixo é horizontal; salto/agachamento não movem em profundidade. A arena usa limites x=160..1440 e chão y=690, velocidade da menina 6,2, impulso 11 e gravidade 0,32. O gesto da espada dura 18 quadros, com 6 de antecipação e 6 de contato; cooldown 36 e recuperação de bloqueio 48. Movimento usa 20% da velocidade durante gesto e 55% na recuperação. São unidades da simulação de 60 Hz; a integração usa dt.

`getSwordRange` calcula max(209, (distância de colisão do ator + 40) × 1,1): Trem 297, Robô 209, Dinossauro 247,5 e Urso 239,25. O recuo de dano é 173,6 unidades, limitado pelas bordas. Não usar dimensões visuais dos sprites como novas hitboxes. Os perfis de corpo, pressão, evasão e cadência estão em `ARENA_ENEMIES`; [configuracao-atual.json](configuracao-atual.json) documenta os valores e fontes desta revisão, sem ser carregado pelo jogo.

`ArenaBoss` introduz o Urso e aciona fúria quando HP ≤ ceil(maxHp/2), portanto a partir de 4 na arena. A flag não é desligada pela cura. `ToyRoomBattle` apresenta ENRAGE uma vez e conserva o repertório. O perfil legado conserva o gatilho de HP=1. A proteção e as janelas de abertura vêm de `ArenaCombatRules`, também lidas pelo HUD.

## Entrada e estado

A menina acompanha o lado do inimigo e mantém o rosto voltado para ele, inclusive ao recuar ou atravessá-lo por cima. Segurar a direção oposta ao inimigo no chão ativa defesa com espada e permite recuar a 55% da velocidade. A defesa bloqueia os golpes existentes sem retirar ou transferir corações; cada golpe produz um único efeito de bloqueio e segue para sua recuperação. Atacar, saltar, agachar ou receber dano interrompe a defesa. Não há defesa aérea.

Teclado: A/D ou esquerda/direita andam; W/cima pula; S/baixo agacha; E/Espaço/Enter/F ataca. No gamepad padrão da arena, o D-pad fornece direção, A também pula e X ataca; o analógico continua sendo movimento da exploração. No touch, o direcional fixo em cruz calculado por MobileUILayout aceita arraste analógico em oito direções, com zona morta central. As diagonais superiores combinam salto e deslocamento para frente ou para trás; as inferiores combinam direção e agachamento. O centro desenhado não acompanha o dedo. Espada aceita um segundo toque simultâneo. Soltar, cancelar, perder a captura do ponteiro ou mudar a orientação libera as direções. A ação especial/Y possui entrada reservada, mas `special()` retorna false e não altera a luta.

A fase usa IDLE → TRANSFORMING → COMBAT → RETURNING → COMPLETE. Transformação dura 180 quadros e aguarda artes prontas; erros de recursos impedem a entrada pronta. BATTLE/VICTORY/DEFEAT pertencem à simulação de batalha. Após derrota, ataque aceito depois da espera reinicia a luta; após vitória, conduz ao retorno. O retorno restaura a exploração intermediariamente e termina a apresentação sem criar uma campanha nova.

A câmera da arena enquadra atores e tremor em ArenaCamera. Em celular na orientação paisagem, reserva as laterais ocupadas pelo direcional e pelos botões para manter os atores visíveis entre os polegares. O panorama da transformação usa o desenho da sala como fundo por `arenaBackdrop`; não reutiliza a física de exploração. A câmera fixa do documento de design inicial não é o enquadramento implementado neste perfil.

## Saves, retorno e áudio

A entrada captura a sala com `snapshot({includeArena:false})`. O save da arena inclui versão, state, exploration, camera, fx, audio e boss; a batalha é salva no pacote da sala. No retorno, `restore(exploration,{preserveArena:true})` evita recursão. Vitória marca os brinquedos organizados, interrompe a recorrência e registra arenaCompleted. Saves antigos sem arena recebem a adaptação existente com ponto seguro de retorno. Não serializar imagens, nós de áudio, controllers ou callbacks.

A música `Circular Dissonance (1).mp3`, iniciada na espada, continua sem reinício na transformação/combate. Intensidade passa a 1,2 e 1,4; a percussão procedural se soma à trilha. Ao sair, volta a 1 e retoma o fluxo da sala. Ganho mestre, mudo, pausa e foco continuam válidos. Reações, passos/motor e espada têm módulos de síntese próprios e liberação das vozes.

## Fronteiras de integração e manutenção

`ToyRoomPhase` compõe a exploração com contextos restritos; `ToyRoomArenaPhase` e `ToyRoomBattle` ainda retêm a sala inteira. `configurePresentation` instala controller, tuning e callbacks da arena sobre a simulação existente; restoreReality devolve o perfil legado. Essa integração ampla permanece como próximo trabalho de desacoplamento, não como uma interface genérica já implantada.

Use os [comandos documentados](../COMANDOS.md): test:toy-room:arena, test:toy-room:arena:browser, test:arena:balance, test:arena:enemies, test:arena:animation, test:arena:refinements, test:arena:defesa, test:arena:defesa:browser e comparações test:refact:browser. O executor recupera fontes em diretório temporário e registra saídas no diário. Validação determinística/emulada não substitui aparelhos físicos ou avaliação humana da dificuldade.

## Diferenças entre NORMAL e EASY

`ArenaDifficulty.arenaDifficulty` mantém os perfis originais no NORMAL. No EASY, o alcance nominal e o mínimo derivado dos corpos crescem 30%: Trem 386,1; Robô 271,7; Dinossauro 321,75; Urso 311,025. O arco desenhado acompanha esse alcance.

Os inimigos do EASY caminham a 80% e investem a 85% da velocidade normal. Esperas entre aproximações duram 1,7×; retiradas, 1,5×; recuperação, 1,55×; intervalo entre evasões, 1,6×. A sequência extra de pressão após acertar a menina fica desativada. HP, transferência de corações e preparação/contato dos golpes permanecem iguais, preservando os sinais visuais para esquiva. O perfil é aplicado tanto ao entrar na arena quanto ao restaurar sua apresentação.
