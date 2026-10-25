# Um dia no jardim

Depois da captura do urso e da ida ao baú, a campanha espera 2,5 segundos e abre o jardim. Para revisar diretamente, use bandeira → **Um dia no jardim**; essa entrada não altera a campanha salva. O destino é o piquenique com ursinho, dinossauro, robô e trem, tapete, pão na chapa e suco de laranja. As falas do piquenique aguardam definição posterior.

## Percurso e controles

A/D ou setas para andar; Espaço, W ou seta para cima para pular. Touch aceita ◀ ▶ e PULAR simultaneamente; gamepad usa direcional/analógico esquerdo e A/X. Soltar pulo encurta a subida; segurar não dispara saltos automáticos.

A saída da casa tem madeira e apoios suspensos. Seguem grama alta, pedras sobre água, outra grama e pedrinhas rápidas que conduzem à roda de quatro apoios. Os tampos da roda permanecem horizontais. Depois vêm nuvens temporárias e os primeiros inimigos. O trecho maior alterna chão normal, grama e travessias de rio em seis composições de paisagens diferentes. Três encontros têm formiga saltando entre pedras. No meio, uma travessia puramente aérea reúne três rodas consecutivas, seis nuvens temporárias e duas ilhas de terra com pedrinhas rápidas; não há chão sob esse trajeto. Entrada e saída têm chão firme e checkpoints. Ao final, quatro nuvens levam à árvore. O percurso é dimensionado para cerca de cinco minutos, sem contagem obrigatória ou espera artificial; o tempo humano varia com exploração e tentativas.

Cada faixa de terreno fixo é um corpo visual contínuo. A massa da terra é pintada em união, evitando frestas entre recortes de patamares; a pintura das raízes se dissolve no solo, sem placas arredondadas ou divisões de blocos. O miolo ilustrado do piso normal foi alinhado à altura física dos pés. As pedrinhas usam um trecho da pintura sem inclinação de perspectiva, repetido na altura do apoio. Pedras do rio, apoios suspensos, nuvens e rodas mantêm seus vãos reais. A terra inclui patamares com subidas e descidas de até 140 px, divididas em degraus de até 70 px, além de morros curvos de até 210 px. Os patamares têm faces laterais sólidas: é preciso saltar para subir. Clareiras curtas têm topos mais largos para combinar relevo e inimigos sem bloquear a entrada. Os perfis variam entre setores e retornam à cota das margens; a massa de terra continua conectada, sem fendas internas. A câmera não sobe nem muda o zoom.

| Superfície | Comportamento |
| --- | --- |
| Madeira, chão normal, pedras firmes e nuvens | Velocidade base de 220 px/s. |
| Grama alta | 100 px/s, passos com pés erguidos e expressão de desconforto. Ao sair do chão num salto, há mobilidade normal no ar. |
| Pedrinhas | 410 px/s, parada imediata ao soltar o comando; não derrapa. Impulso e velocidade aérea variam de forma determinística a cada salto, mantendo o comando do jogador. Rosto e pose desconfortáveis. |

As reações sensoriais retratam esta menina segundo a direção do usuário. Não são uma regra geral sobre pessoas autistas.

## Inimigos, nuvens e Nanda

Lagartas exigem dois pisões distintos: o primeiro deixa o corpo vermelho e inicia afastamento rápido para sair debaixo da menina; a lagarta faz uma breve preparação e investe de frente. O segundo pisão derrota. A reação e seus relógios são conservados no save. A direção reage ao lado da menina, usando o chão de origem inteiro e respeitando suas bordas. Há bloqueio curto contra contar o mesmo contato duas vezes. Formigas terrestres aproximam-se da menina, andam com pressão maior e saltam com mais frequência; um pisão na cabeça derrota. As formigas do rio seguem arcos entre pedras, com pousos e pausas. Não há espada nem exigência de derrotar todos os inimigos para liberar o final.

As nuvens armam no primeiro pouso, piscam localmente cada vez mais rápido e somem depois de 2,8 s no NORMAL ou 3,8 s no EASY. Somem também da colisão, retornam após quatro segundos e podem ser armadas novamente. Pausa congela todos esses tempos.

Nanda acompanha acima da cabeça durante toda a fase. Após sete segundos sem progresso, voa para o próximo apoio por até três segundos e retorna. Esse guia não modifica velocidade, pulo ou câmera.

## Dificuldades e retomada

No NORMAL há três corações. Água e queda são fatais mesmo com corações restantes; contato lateral tira um coração e dá imunidade temporária. Bandeirinhas em chão firme conservam o avanço e recuperam os corações. A derrota começa com a queda animada, seguida de “Game Over”; somente depois aparecem “Tentar novamente” e “Desistir”. O cenário e a música continuam durante essa sequência e no menu. Repetir retoma o checkpoint, conservando inimigos já derrotados. A campanha mantém sua oferta do modo fácil a cada três derrotas.

No EASY, a menina nunca morre. Queda e água acionam o resgate animado de Nanda até a última faixa de chão seguro. Um golpe que esgotaria os seis corações causa desorientação e retorno de aproximadamente dois apoios visitados. A recuperação devolve seis corações e quatro segundos de imunidade. Apoios temporários e a roda não são destinos de resgate; esse fluxo não aciona GAME_OVER do host.

## Implementação e persistência

`GardenLevel` define superfícies, materiais, águas, setores, inimigos, checkpoints e rodas. Consultas por faixas espaciais limitam os apoios considerados a cada subpasso. `GardenSimulation` é puro, usa segundos e subpassos de até 1/120 s, colisão varrida relativa a apoios/inimigos móveis, coyote de 120 ms e buffer de 140 ms. A câmera conserva altura/escala por viewport e acompanha somente x.

`GardenPhase` compõe entrada, simulação, pinturas e áudio. `ToyRoomPhase.startGarden` descarta o 3D. O domínio v6 serializa material/velocidade aérea, relógios das nuvens, vida/saltos dos inimigos, histórico de apoios, chão seguro, guia da fada e recuperação em andamento. `toyRoomGarden` é prioritário no restore da sala; não contém DOM, imagens, entradas ou nós de áudio. Save v1 do mapa curto migra ao início seguro; conclusão antiga abre o piquenique. Saves v4/v5 retomam o mesmo setor em chão seguro após a inclusão do trecho aéreo. Saves v2/v3 dos mapas longos retomam um checkpoint equivalente da mesma paisagem no mapa reduzido; inimigos vencidos são relacionados pelos setores antigos. Posições antigas de apoios, nuvens e resgates são recalculadas com segurança. Saves sem jardim conservam o fluxo anterior.

Perda de foco, aba oculta e pausa liberam comandos e congelam a fase. Descarte remove listeners, imagens, padrões de chão e vozes. `GardenRenderer` carrega apenas o manifesto dedicado ao entrar; recortes em `GardenArt` são gerados pelo preparador. A fada usa a pintura compartilhada; a lagarta vermelha tem pintura própria. `GardenAudio` reproduz `assets/audio/Blues Shuffle Loop.mp3`, fornecido pelo usuário, em repetição contínua desde a entrada pronta até o piquenique. Substitui a melodia sintetizada anterior, preservando sinais curtos de salto, pisão, dano e checkpoint. Respeita pausa/foco, mudo e volume do host; a trilha continua durante a queda e nas opções de derrota. Ao sair, libera o elemento de áudio e suas vozes. Bloqueio de autoplay permite nova tentativa na interação do jogador.

Artes, fontes e prompts: [README](../../assets/art/garden/README.md). QA e resultados pertencem somente ao diário de IA; Chrome emulado não substitui avaliação artística, conforto ou aparelho físico.

## Acabamento e atuação nos terrenos

Extremidades abertas recebem as pontas das pinturas e contorno de terra irregular; junções de materiais usam os mesmos recortes dissolvidos, sem reintroduzir placas de raízes. A massa da terra e a exclusão da água compartilham o contorno externo. A faixa fixa permanece única. As pedras têm bases rochosas e água de primeiro plano, ligando suas silhuetas ao rio. O nível visual da água foi aproximado das bases sem recalibrar o limite fatal ou os apoios físicos.

Na grama, a faixa inteira de vegetação é repetida em primeiro plano com 45% de opacidade, usando o mesmo recorte, escala e alinhamento do cenário. A menina aparece atrás da folhagem translúcida; a vegetação permanece fixa no mundo, inclusive durante saltos, sem recorte acompanhando os pés nem deslocamento do corpo físico. A pintura posterior da água se prolonga sob o contorno das margens próximas para evitar frestas de cenário; a água frontal exclui a silhueta da terra com a mesma máscara do terreno e não colore o interior da margem. O limite fatal continua inalterado. A textura central termina antes das pontas ilustradas, preservando o alfa das folhas nas extremidades. Nas pedrinhas, quatro poses distintas mostram pernas/joelhos alternando o desequilíbrio, com leve inclinação visual e gotas de suor junto ao rosto preocupado. A parada ao soltar continua imediata; esses efeitos não movem câmera ou hitbox. Pinturas e fontes adicionais estão em `menina-pedrinhas-v2.png` e `prompts-pedrinhas-v2.json` na pasta de arte.

O contato usa os pixels dos sapatos em 28 poses e perfis por coluna das pinturas de madeira, pedra e nuvem, preparados por `scripts/prepare-garden-contact.js`. A transparência e folhas decorativas não viram apoio. Qualquer parte real da sola pode sustentar o pouso; não há exigência de centro interno nem recuo percentual nas extremidades. A pose de equilíbrio conserva o contato real na borda sem trocar imediatamente por uma pose cujos pés já estariam fora. O transporte das rodas acompanha esse perfil. Em morros, a sola da pose desenhada e a curva física definem juntos a altura, evitando flutuar. A câmera não corrige pousos.

Árvores decorativas só aparecem quando toda a base cabe em um patamar; raízes acompanham sua altura, com margem nas duas pontas. Copas têm tamanho de mundo fixo que cabe verticalmente inclusive em paisagem móvel. Flores também respeitam a faixa de apoio. A árvore final está enraizada no chão do piquenique e cabe inteira verticalmente; a casa inicial conserva a base sobre a madeira. O fundo faz um deslocamento lento em uma única direção, e a identificação do setor fica no painel de leitura.

As laterais dos morros são sólidas durante os saltos: o bloqueio usa a altura dos pés no instante de cruzar a face. O topo do chão maciço sustenta a ponta dos pés ao raspar uma quina; apoios isolados usam a sola e a superfície ilustradas, em vez do centro do corpo. A câmera não corrige contatos.


A menina começa na porta/escada da casa e desce até o piso de madeira em uma breve atuação de abertura. A base da escada está assentada no solo. Morros arredondados alternam lombadas simples e duplas com patamares de formas variadas. Os morros mantêm inimigos e recebem apenas pequenas faixas de grama alta; fora delas o terreno é normal. A vegetação baixa de folhas permanece contínua sob as faixas e até as bordas de salto. Curvas são pré-compostas uma vez durante a carga; o gameplay reutiliza a pintura pronta, em vez de reconstruir centenas de tiras a cada quadro. A face e as laterais do chão são revestidas por uma parede contínua de vegetação. A textura terrosa anterior permanece preservada e aparece discretamente no leito dos rios. Pilares rochosos decorativos descem dos tampos existentes até o leito, sem modificar as colisões. Poucos peixes coloridos e plantas aquáticas esparsas completam os rios; somente elementos dentro do enquadramento são pintados. Fontes, prompts e preparação estão no README de arte.
