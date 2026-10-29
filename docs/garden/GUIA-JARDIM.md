# Um dia no jardim

Revisão: 26/10/2026. Fonte: módulos atuais de `src/js/garden/` e integração em `ToyRoomPhase`/`ToyRoomPersistence`.

Depois da captura do urso e da ida ao baú, a campanha espera 2,5 segundos e abre o jardim. Para revisar diretamente, use bandeira → **Um dia no jardim**; essa entrada não altera a campanha salva. Na saída da casa, Nanda revela o nome da menina: “Vamos, Yuna, vamos no piquenique, vai ser divertido!”. A narração acolhe alegria, receio dos insetos e desconforto com as texturas. As cenas seguem a introdução da sala de brinquedos: cenário e personagens em camadas na altura dos olhos, atuação, voo da fada e mudanças de plano. Depois da abertura, Yuna desce a escada e a travessia começa. O destino é o piquenique com ursinho, dinossauro, robô e trem, pão na chapa e suco de laranja. Na conclusão, Yuna descansa sentada e come; Nanda pousa e se senta ao lado dela, com pão e suco na escala da própria mãozinha. Texto no topo e enquadramento cinematográfico se adaptam à tela, sem afetar a câmera jogável. Não se usa mais uma única imagem fixa sob as falas.

A abelha mantém corpo e rosto estáveis durante o voo; somente as asas articuladas batem continuamente. `GardenBeeRenderer` utiliza as camadas de `source/abelha-camadas-v2.png`, em vez de alternar dois desenhos com caixas diferentes. O aviso inclina o conjunto sem trocar sua pintura. O repouso é fixo e os rasantes alternam A/B, conforme os tempos descritos adiante.

O piquenique visto durante os últimos passos usa uma composição lateral de perspectiva baixa, ancorada no plano da toalha e separada das raízes da árvore. Não há alteração da meta nem do chão físico. Nas cenas, a ilustração ocupa o fundo inteiro: só o quadro do diálogo aparece sobre ela, sem faixa clara abaixo ou ao redor. Depois da última fala, a cena permanece no piquenique; não oferecer saída/replay ou antecipar fases futuras ainda inexistentes.

## Percurso e controles

A/D ou setas para andar; Espaço, W ou seta para cima para pular. Touch aceita ◀ ▶ e PULAR simultaneamente; gamepad usa direcional/analógico esquerdo e A/X. Soltar pulo encurta a subida; segurar não dispara saltos automáticos.

A saída da casa tem madeira e apoios suspensos. Seguem grama alta, pedras sobre água, outra grama e pedrinhas rápidas que conduzem à roda de quatro apoios. Os tampos da roda permanecem horizontais. Depois vêm nuvens temporárias e os primeiros inimigos. O trecho maior alterna chão normal, grama e travessias de rio em seis composições de paisagens diferentes. Três encontros têm formiga saltando entre pedras. No meio, uma travessia puramente aérea reúne três rodas consecutivas, seis nuvens temporárias e duas ilhas de terra com pedrinhas rápidas; não há chão sob esse trajeto. Entrada e saída têm chão firme e checkpoints. Ao final, quatro nuvens levam à árvore. O percurso é dimensionado para cerca de cinco minutos, sem contagem obrigatória ou espera artificial; o tempo humano varia com exploração e tentativas.

Cada faixa de terreno fixo é um corpo visual contínuo. A face e as laterais usam parede vegetal conectada à cobertura baixa, evitando frestas entre patamares e placas de terra sob a grama alta. As pedrinhas usam um trecho da pintura sem inclinação de perspectiva, repetido na altura do apoio. Pedras do rio, apoios suspensos, nuvens e rodas mantêm seus vãos reais. A terra inclui patamares com subidas e descidas de até 140 px, divididas em degraus de até 70 px, além de morros curvos de até 210 px. Os patamares têm faces laterais sólidas: é preciso saltar para subir. Clareiras curtas têm topos mais largos para combinar relevo e inimigos sem bloquear a entrada. Os perfis variam entre setores e retornam à cota das margens; a massa de terra continua conectada, sem fendas internas. A câmera não sobe nem muda o zoom.

| Superfície | Comportamento |
| --- | --- |
| Madeira, chão normal, pedras firmes e nuvens | Velocidade base de 220 px/s. |
| Grama alta | 100 px/s, passos com pés erguidos e expressão de desconforto. Ao sair do chão num salto, há mobilidade normal no ar. |
| Pedrinhas | 410 px/s, parada imediata ao soltar o comando; não derrapa. Impulso e velocidade aérea variam de forma determinística a cada salto, mantendo o comando do jogador. Rosto e pose desconfortáveis. |

As reações sensoriais retratam esta menina segundo a direção do usuário. Não são uma regra geral sobre pessoas autistas.

## Inimigos, nuvens e Nanda

Lagartas exigem dois pisões distintos: o primeiro deixa o corpo vermelho e inicia afastamento rápido para sair debaixo da menina; a lagarta faz uma breve preparação e investe de frente. O segundo pisão derrota. A reação e seus relógios são conservados no save. A direção reage ao lado da menina, usando o chão de origem inteiro e respeitando suas bordas. Há bloqueio curto contra contar o mesmo contato duas vezes. Formigas terrestres aproximam-se da menina, andam com pressão maior e saltam com mais frequência; um pisão na cabeça derrota. As formigas do rio seguem arcos entre pedras, com pousos e pausas. Não há espada nem exigência de derrotar todos os inimigos para liberar o final.

A derrota dos insetos tem apresentação própria: formigas terrestres e lagartas ficam comprimidas no apoio por um breve intervalo e saem gradualmente, com duração total de até 1,6 s. A lagarta derrotada conserva a cor vermelha do segundo pisão. Abelhas e formigas das pedras do rio fazem uma pequena impulsão e caem girando à frente do cenário; as asas da abelha deixam de bater. As trajetórias dos corpos são somente visuais: a colisão perigosa cessa no pisão, sem alterar o salto de Yuna, apoios ou dificuldade. Minhocas e besouros mantêm suas regras próprias e não recebem uma derrota por pisão.

`GardenDefeatPresentation` calcula essas poses a partir de `defeatAge`, já persistido desde o domínio v9. O relógio dos corpos é atualizado uma vez por subpasso por `GardenSimulation`, inclusive longe da menina e durante encerramento/derrota; pausa do host o congela. A remoção visual não depende de manter o inimigo na vizinhança nem acumula objetos novos. Save/load conserva o progresso da apresentação e retry conserva a condição de inimigo derrotado.

As nuvens armam no primeiro pouso, piscam localmente cada vez mais rápido e somem depois de 2,8 s no NORMAL ou 3,8 s no EASY. Somem também da colisão, retornam após quatro segundos e podem ser armadas novamente. Pausa congela todos esses tempos.

Cinco abelhas aguardam em posições fixas acima de trechos de chão amplo. Ao perceber Yuna, inclinam o corpo por 0,5 s antes do rasante saltável de 1,25 s até o outro ponto de repouso. Aguardam pelo menos 1,8 s antes de poder preparar o arco reverso; não há retorno automático separado. O identificador interno `patrol` representa esse repouso. Contato lateral ou por baixo tira um coração; pisão descendente derrota a abelha de uma vez e conserva a reação de salto dos pisões. A colisão varre o movimento relativo dos dois corpos.

Quatro minhocas fazem o papel de espinhos vivos nos trechos principais de pedregulho. Ficam recolhidas longe, começam a emergir a menos de 280 px e recolhem depois de 360 px, evitando oscilar no limite. A exposição leva 0,22 s. O corpo exposto causa um ponto de dano por qualquer lado, inclusive por cima; não há derrota por pisão. Pedrinhas decorativas e parte enterrada não colidem; o buraco não remove a superfície física.

Três besouros inofensivos provocam perseguições: dois perto de rios e um nas quatro nuvens finais. As duas perseguições sobre rios terminam quando Yuna pousa em chão firme na outra margem, com os pés inteiramente além da borda. O encontro das nuvens finais mantém seis segundos ativos. Yuna corre automaticamente para frente e o jogador controla somente o pulo; a velocidade normal e as regras de cada terreno continuam iguais. Rosto assustado, oscilação desajeitada do tronco e suor criam urgência visual. Poses completas mostram rosto assustado, braços desajeitados e passadas exageradas. As novas pinturas são registradas pelas âncoras de apoio; física, seleção das poses de contato e trajetória continuam usando a referência original. O besouro desiste e vai embora, devolvendo o controle. A sequência repete ao retornar ao checkpoint; o EASY usa as mesmas condições de chegada/duração e mantém a ajuda existente de Nanda. Uma recuperação durante a perseguição devolve Yuna a uma posição segura antes do gatilho quando esse ponto cabe no mesmo chão de resgate.

Nanda acompanha acima da cabeça durante toda a fase. Após sete segundos sem progresso, voa para o próximo apoio por até três segundos e retorna. Esse guia não modifica velocidade, pulo ou câmera.

## Dificuldades e retomada

No NORMAL há três corações. Água e queda são fatais mesmo com corações restantes; contato lateral tira um coração e dá imunidade temporária. Bandeirinhas em chão firme conservam o avanço e recuperam os corações. A derrota começa com a queda animada, seguida de “Game Over”; somente depois aparecem “Tentar novamente” e “Desistir”. O cenário e a música continuam durante essa sequência e no menu. Repetir retoma o checkpoint, conservando inimigos já derrotados. A campanha mantém sua oferta do modo fácil a cada três derrotas.

Ao receber dano, Yuna reage com um recuo visual do tronco por até 0,48 s e um pequeno sinal de contato, sem mover as solas nem modificar trajetória, velocidade ou colisões. Durante a reação inicial ela permanece opaca; depois, o piscar indica a imunidade restante. O áudio combina contato e reação curta da menina, respeitando volume, mudo e pausa. Cada contato emite o som uma única vez, inclusive no golpe fatal. O save v10 conserva tempo e direção da reação; saves anteriores à apresentação usam estado neutro, e uma nova tentativa limpa o efeito.

No EASY, a menina nunca morre. Queda e água acionam o resgate animado de Nanda até a última faixa de chão seguro. Um golpe que esgotaria os seis corações causa desorientação e retorno de aproximadamente dois apoios visitados. A recuperação devolve seis corações e quatro segundos de imunidade. Apoios temporários e a roda não são destinos de resgate; esse fluxo não aciona GAME_OVER do host.

## Implementação e persistência

`GardenLevel` define superfícies, materiais, águas, setores, inimigos, checkpoints e rodas. Consultas por faixas espaciais limitam os apoios considerados a cada subpasso. `GardenSimulation` é puro, usa segundos e subpassos de até 1/120 s, colisão varrida relativa a apoios/inimigos móveis, coyote de 120 ms e buffer de 140 ms. A câmera conserva altura/escala por viewport e acompanha somente x.

`GardenPhase` compõe entrada, simulação, pinturas e áudio. `ToyRoomPhase.startGarden` descarta o 3D. O domínio v10 serializa material/velocidade aérea, relógios das nuvens, vida/saltos dos inimigos, histórico de apoios, chão seguro, guia da fada, recuperação, encontros e leitura. `toyRoomGarden` é prioritário no restore da sala; não contém DOM, imagens, entradas ou nós de áudio. O envelope da fase tem versão 1 (`{version:1,state}`), o domínio usa `state.version:10` e a configuração `GARDEN.version` vale 7. Esses números têm finalidades distintas.

| Save de origem | Restauração atual |
| --- | --- |
| v1 | Mapa curto volta ao início seguro; uma conclusão antiga abre o piquenique. |
| v2/v3 | Checkpoint equivalente da mesma paisagem no mapa reduzido; inimigos vencidos relacionados pelos setores antigos. |
| v4/v5 | Retomada no setor seguro equivalente, incluindo entrada/saída da seção aérea quando aplicável. |
| v6 | Conserva posição, inimigos e relógios compatíveis e acrescenta os encontros/cenas atuais com defaults. |
| v7 | Conserva abelhas, exposição das minhocas, encontros consumidos e perseguição em andamento; converte o relógio narrativo anterior para índice/tempo de fala. |
| v8 | Conserva leitura e cenas vistas; abelha em voo migra a partir da posição atual para o arco alternado v9. |
| v9 | Conserva leitura, corpos, checkpoints e arcos A/B; a perseguição de rio em andamento passa a aguardar a margem, sem mover a menina. |
| v10 | Conserva os dados anteriores e permite perseguição de rio com tempo decorrido superior a seis segundos, até o pouso seguro; nuvens mantêm o prazo de seis segundos. |

Saves sem jardim conservam o fluxo anterior. O render não reinicia encontros. Apoios e destinos incompatíveis são validados pelo domínio, sem aproveitar posições antigas cegamente.

Perda de foco, aba oculta e pausa liberam comandos e congelam a fase. Descarte remove listeners, imagens, padrões de chão e vozes. `GardenRenderer` carrega apenas o manifesto dedicado ao entrar; recortes em `GardenArt` são gerados pelo preparador. A fada usa a pintura compartilhada; a lagarta vermelha tem pintura própria. `GardenAudio` reproduz `assets/audio/Blues Shuffle Loop.mp3`, fornecido pelo usuário, em repetição contínua desde a entrada pronta até o piquenique. Substitui a melodia sintetizada anterior, preservando sinais curtos de salto, pisão, dano e checkpoint. Respeita pausa/foco, mudo e volume do host; a trilha continua durante a queda e nas opções de derrota. Ao sair, libera o elemento de áudio e suas vozes. Bloqueio de autoplay permite nova tentativa na interação do jogador.

Artes, fontes e prompts: [README](../../assets/art/garden/README.md). QA e resultados pertencem somente ao diário de IA; Chrome emulado não substitui avaliação artística, conforto ou aparelho físico.

## Acabamento e atuação nos terrenos

Extremidades abertas recebem pontas naturais das pinturas e contorno irregular; junções de materiais usam recortes dissolvidos, sem placas de raízes. A massa do terreno e a exclusão da água compartilham o contorno externo. A faixa fixa permanece única. As pedras têm pilares rochosos decorativos até o leito e água de primeiro plano; peixes e plantas permanecem esparsos. O nível visual da água não redefine o limite fatal nem os apoios físicos.

Na grama, a faixa inteira de vegetação é repetida em primeiro plano com 45% de opacidade, usando o mesmo recorte, escala e alinhamento do cenário. A menina aparece atrás da folhagem translúcida; a vegetação permanece fixa no mundo, inclusive durante saltos, sem recorte acompanhando os pés nem deslocamento do corpo físico. A pintura posterior da água se prolonga sob o contorno das margens próximas para evitar frestas de cenário; a água frontal exclui a silhueta da terra com a mesma máscara do terreno e não colore o interior da margem. O limite fatal continua inalterado. A textura central termina antes das pontas ilustradas, preservando o alfa das folhas nas extremidades. Nas pedrinhas, quatro poses distintas mostram pernas/joelhos alternando o desequilíbrio, com leve inclinação visual e gotas de suor junto ao rosto preocupado. A parada ao soltar continua imediata; esses efeitos não movem câmera ou hitbox. Pinturas e fontes adicionais estão em `menina-pedrinhas-v2.png` e `prompts-pedrinhas-v2.json` na pasta de arte.

O contato usa os pixels dos sapatos em 28 poses e perfis por coluna das pinturas de madeira, pedra e nuvem, preparados por `scripts/prepare-garden-contact.js`. A transparência e folhas decorativas não viram apoio. Qualquer parte real da sola pode sustentar o pouso; não há exigência de centro interno nem recuo percentual nas extremidades. A pose de equilíbrio conserva o contato real na borda sem trocar imediatamente por uma pose cujos pés já estariam fora. O transporte das rodas acompanha esse perfil. Em morros, a sola da pose desenhada e a curva física definem juntos a altura, evitando flutuar. A câmera não corrige pousos.

Árvores decorativas só aparecem quando toda a base cabe em um patamar; raízes acompanham sua altura, com margem nas duas pontas. Copas têm tamanho de mundo fixo que cabe verticalmente inclusive em paisagem móvel. Flores também respeitam a faixa de apoio. A árvore final está enraizada no chão do piquenique e cabe inteira verticalmente; a casa inicial conserva a base sobre a madeira. O fundo faz um deslocamento lento em uma única direção, e a identificação do setor fica no painel de leitura.

As laterais dos morros são sólidas durante os saltos: o bloqueio usa a altura dos pés no instante de cruzar a face. O topo do chão maciço sustenta a ponta dos pés ao raspar uma quina; apoios isolados usam a sola e a superfície ilustradas, em vez do centro do corpo. A câmera não corrige contatos.


A menina começa na porta/escada da casa e desce até o piso de madeira em uma breve atuação de abertura. A base da escada está assentada no solo. Morros arredondados alternam lombadas simples e duplas com patamares de formas variadas. Os morros mantêm inimigos e recebem apenas pequenas faixas de grama alta; fora delas o terreno é normal. A vegetação baixa de folhas permanece contínua sob as faixas e até as bordas de salto. Curvas são pré-compostas uma vez durante a carga; o gameplay reutiliza a pintura pronta, em vez de reconstruir centenas de tiras a cada quadro. A face e as laterais do chão são revestidas por uma parede contínua de vegetação. A textura terrosa anterior permanece preservada e aparece discretamente no leito dos rios. Pilares rochosos decorativos descem dos tampos existentes até o leito, sem modificar as colisões. Poucos peixes coloridos e plantas aquáticas esparsas completam os rios; somente elementos dentro do enquadramento são pintados. Fontes, prompts e preparação estão no README de arte.

## Leitura e apresentação atuais

Na abertura e no piquenique, cada fala avança automaticamente pelo prazo autorado. Toque no canvas, Enter ou Espaço adianta uma fala por interação; a atuação continua. O lembrete de avanço opcional fica dentro da moldura, sem faixa de fundo adicional. Cenas já vistas oferecem “Pular (S)” na própria moldura; também aceitam S. Ao terminar ou pular o final, a apresentação fica no piquenique com Yuna e Nanda sentadas/comendo, sem menu ou próxima fase. A abertura usa plano fixo e corte para a descida jogável, evitando o deslizamento da pose.

O save v10 conserva índice da fala, tempo da atuação e cenas vistas, migrando a apresentação v7/v8/v9 sem alterar corpos, checkpoint ou encontros. A marca de cena vista também é conservada localmente no navegador; bloqueio de armazenamento não impede o snapshot. Pausa/perda de foco suspendem atualização e liberam entradas. A entrada de fechar a abertura é consumida antes do retorno ao controle.

Antes do primeiro encontro efetivamente vivido, o narrador informa que Yuna corre sozinha e o jogador controla o pulo. Em todo encontro, Nanda diz “calma, Yuna, é só um besouro. Ele não vai te fazer mal”. São falas não modais durante gameplay; acompanham a fuga até a margem nos dois rios e por seis segundos no encontro das nuvens. O besouro tem corpo estável e asas articuladas em `GardenBeetleRenderer`; o HUD mantém texto de 12 px CSS no celular. Terra em movimento e preparação mais expressiva das asas da abelha antecipam perigos sem novas falas. Agrupamentos vegetais e borboletas variam por setor e ficam mais esparsos perto dos rios, preservando mapa e dificuldade.

### Rasantes alternados e entrada dos besouros

As abelhas ficam em repouso fixo no ar entre os ataques, com asas animadas. Depois do aviso de 0,5 s, percorrem uma parábola baixa de A para B em 1,25 s e permanecem em B; o próximo rasante, após o intervalo de 1,8 s e nova aproximação, faz B para A pela mesma parábola. Não há retorno automático separado nem desaparecimento. Dano de 1 ponto e derrota por pisão continuam. O save v10 conserva ponto de repouso, origem/destino, duração e profundidade do arco; saves v8 em voo migram a partir da posição atual da abelha.

O besouro entra pela esquerda a partir de fora do viewport e alcança a posição de perseguição em 0,85 s visuais, incluindo em retrato/paisagem. Essa apresentação não modifica o gatilho, a direção automática ou o pulo. Nos dois rios, o encerramento depende do pouso seguro na margem de destino; nas nuvens finais, mantém os seis segundos ativos. O save v10 conserva `elapsed` real e `remaining` limitado a zero após seis segundos no rio, sem confundir prazo expirado com fuga encerrada.

O padrão geral vigente é [diálogos e cenas](../diario-ia/padroes/DIALOGOS-E-CENAS.md): automático pelo prazo de cada fala, com clique/toque opcional para adiantar. O encerramento temporizado retira o último quadro e conserva o piquenique animado.
