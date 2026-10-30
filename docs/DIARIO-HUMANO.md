# Diário do projeto para pessoas

Este diário acompanha as decisões e mudanças do produto em linguagem humana. Guias de desenvolvimento, design e arquitetura continuam na documentação. Resultados de máquina, testes, medições, homologações e registros de evidências ficam exclusivamente no diário de IA.

## A experiência atual

A tela inicial oferece Novo jogo, Carregar e Modo fácil para a nova aventura. A menina atravessa o quarto escuro e seu retorno de plataformas, explora uma sala de brinquedos, interage com os objetos e recebe uma espada. A imaginação transforma a mesma sala numa arena heroica: móveis e brinquedos ganham escala épica. A vitória sobre o urso conduz à perseguição: a menina se aproxima da pelúcia caída, ele se levanta e foge. Ela corre desviando dos brinquedos até alcançá-lo e levá-lo ao baú. Exploração, arena e fuga pertencem à mesma campanha.

## 13 de outubro de 2026 — organização do trabalho visual

Foi criado um guia para a equipe de design localizar imagens, poses e consumidores no código. O README ganhou “Orientações para o designer”. A equipe deve preservar a identidade da menina, os materiais ilustrados e as proporções, além de coordenar mudanças em recortes e âncoras com desenvolvimento.

As imagens e os desenhos antigos classificados pelo responsável foram retirados. Alguns elementos receberam novos sprites com a assinatura atual; outros reutilizam artes existentes. A aprovação artística de mudanças novas precisa ser registrada explicitamente, sem presumir que a aprovação anterior da arena vale para cada recurso novo.

## 13 de outubro de 2026 — contexto compartilhado entre pessoas e IAs

O projeto passou a ter um diário de IA com documentos e instruções preservados, histórico disponível no Git e registros por sessão. Toda IA começa consultando esse acervo e registra as mudanças ao concluir. As regras vigentes e o contexto atual são as entradas para interpretar o histórico.

## 13 de outubro de 2026 — separação da documentação e dos registros de máquina

Relatórios técnicos e arquivos de QA foram retirados das pastas do projeto após registro no acervo. O código das verificações pode ser recuperado em ambiente temporário; os resultados voltam para o diário de IA. Capturas regeneráveis são descartadas, mantendo sua identificação e hash para consulta. Artes de produção continuam no jogo, mesmo quando antes estavam agrupadas com materiais de homologação.

Essa organização evita que designers e desenvolvedores precisem navegar por relatórios de máquina para entender o produto. Para detalhes técnicos históricos, consulte o [diário de IA](diario-ia/README.md); para editar o visual, consulte o [guia de designers](sprites/GUIA-DESIGNERS.md).

## 13 de outubro de 2026 — diálogos consistentes entre as fases

As falas da Toy Room passaram a usar a mesma caixa com retrato e nome do interlocutor da primeira fase. Nanda e a menina conversam em uma faixa ampla, em vez do quadrado central. No celular, a caixa respeita o espaço dos controles. Os textos e o ritmo da história permanecem iguais; trechos do narrador continuam distintos das falas dos personagens.

## 14 de outubro de 2026 — inimigos que leem o estilo da jogadora

Robô, dinossauro e Urso agora ajustam a escolha dos golpes existentes ao jeito recente de jogar: observam se a menina costuma ficar longe, pular ou atacar com frequência. O Trem mantém sua sequência introdutória. As decisões são determinísticas e usam uma memória curta, sem mudar os golpes, tempos, corações ou regras de combate. A intenção é aumentar o desafio sem retirar da jogadora oportunidades de leitura e resposta.

## 14 de outubro de 2026 — esquivar para abrir o contra-ataque

A arena passa a exigir leitura do adversário: Robô, dinossauro e Urso respondem aos golpes recebidos e protegem a preparação dessa resposta. A menina precisa abaixar, pular ou recuar e atacar na abertura seguinte. Insistir contra a proteção não recupera corações e prolonga a recuperação da espada. O HUD anuncia a ameaça e a abertura; a evasão dos inimigos considera o alcance real e tem alternativa nas bordas. O Trem conserva seu papel introdutório, e os corações e as artes permanecem os mesmos.

## 14 de outubro de 2026 — peso e clareza da espada

A espada ganhou 10% de alcance e um contato mais claro. O som diferencia o corte no ar, o acerto com peso e o ricochete contra a proteção. Faíscas e efeitos acompanham a lâmina; os acertos têm uma pausa e um tremor um pouco mais marcados. A menina continua precisando esquivar e aproveitar a abertura do inimigo, com os mesmos corações e recuo.

## 15 de outubro de 2026 — organização da arquitetura e documentação

A sala passou a separar controles, movimento, interação, história, tutorial, câmera, efeitos, desenho e persistência em componentes com responsabilidades explícitas. A integração conserva o fluxo da aventura e os mesmos recursos visuais. Os adaptadores consultam os atores e brinquedos atuais ao restaurar a campanha.

A documentação tem agora um [catálogo da arquitetura e entidades](ARQUITETURA.md), uma [referência de métodos](REFERENCIA-METODOS.md) e um [catálogo de comandos](COMANDOS.md). O design inicial de batalha permanece identificado como origem histórica, com diferenças para a arena atual descritas no guia vigente. A separação de responsabilidades continua no combate, na arena e no coordenador principal; não foi declarada uma nova engine genérica.

## 19 a 21 de outubro de 2026 — menu e continuidade da aventura

A tela inicial ganhou a cena da menina lendo e opções para iniciar ou carregar a aventura. O modo fácil acompanha a campanha salva. A vitória da arena agora entrega diretamente à introdução da fuga, com escurecimento durante a troca e preservação do progresso. A conclusão da perseguição ainda precisa de navegação própria; sua derrota agora oferece nova tentativa.

O NORMAL exige desvios sucessivos na fuga: nos trechos densos há até três brinquedos, e o final alterna pares com um corredor mais amplo. O EASY conserva sua distribuição anterior e recebe mais vidas; na arena, oferece maior alcance e mais tempo para reagir.

Os pousos do retorno passaram a reconhecer o contato durante a descida, evitando perder um apoio que foi cruzado entre quadros. A apresentação móvel usa um enquadramento contínuo. O piso da fuga recebeu um ajuste de compatibilidade de textura; o relato de ausência da madeira no Safari ainda aguarda confirmação. Novas artes e modelos continuam sujeitos à aprovação específica do responsável.

## 21 de outubro de 2026 — ajuda após três derrotas

A perseguição passa a perguntar “A menina não alcançou o urso. Tentar novamente?” quando a tentativa termina. É possível tentar essa fase de novo sem voltar ao menu.

Depois de três derrotas completas na campanha, em qualquer parte da aventura, o jogo pergunta “deseja tentar no fácil?”. Aceitar muda a dificuldade e mantém a parte atual: checkpoint do quarto, adversário da arena ou progresso na perseguição. Recusar mantém o NORMAL; outras três derrotas permitem nova oferta. A contagem e a escolha acompanham a aventura salva.

## 21 de outubro de 2026 — composição da arena

A arena ganhou um piso contínuo de madeira e móveis apoiados em planos coerentes. A janela central fica livre, o armário ocupa a lateral e o cavalinho tem espaço próprio. O tapete aparece sob os móveis, com proporções compatíveis com o piso. O enquadramento mostra mais do quarto e mantém os nomes dos adversários abaixo dos botões superiores. A entrada e a saída dos brinquedos acompanham o baú visível. As artes e as regras de combate foram preservadas.

## Próximas entradas

Acrescente uma entrada quando mudar a experiência, a direção visual ou a forma de trabalho. Descreva o impacto para pessoas; não copie logs, métricas ou saídas de testes para este arquivo.

## 21/10/2026 — Especial da menina na arena

A espada arco-íris pode ser usada uma vez na batalha inteira, por R, Y ou ESPECIAL no touch. A câmera aproxima do rosto durante a preparação e retorna antes do corte que lança o raio. O golpe elimina um brinquedo comum ou deixa o Urso com um coração. A troca de adversário e o carregamento preservam o consumo; uma nova tentativa completa renova o uso. A sequência reaproveita as poses da menina e acrescenta efeitos em Canvas.

### Close dramático do especial

O enquadramento da carga passou a usar um corte de anime centrado nos dois olhos, com expressão intensa e reflexos arco-íris, conforme a referência enviada. Uma ilustração frontal própria substitui a ampliação do sprite como foco da cena. O corte sai rapidamente antes do retorno à arena e do disparo.

### Saída direta da arena

Ao perder o último coração, o Urso encerra a arena e a cena passa à ilustração dele caído. Foram retirados os textos de vitória e retorno da fantasia, a espera pelo transporte ao baú e a pausa para confirmação. A breve passagem escura continua ocultando o carregamento da próxima cena. O usuário também aprovou o close de anime do especial (“ah, gostei!”); essa aprovação se refere à arte e composição do close apresentado.

## 22 de outubro de 2026 — som, defesa e enquadramento

A arena passou a usar os efeitos gravados por personagem, incluindo a defesa e o especial da menina. Ao recuar, ela move os pés normalmente; durante a ofensiva inimiga, firma a base para defender e depois retoma a caminhada. A tela inicial mantém poltrona e tapete no mesmo lugar do quarto, mudando apenas o enquadramento para o celular.

A cena obrigatória da menina verificando o urso caído também serve de carregamento da perseguição. Se faltar recurso visual, ela aguarda nessa cena antes de o urso levantar. A corrida só começa depois da preparação do cenário e da verificação do piso. A confirmação do piso no Safari continua pendente. O design inicial de batalha foi preservado no diário de IA; os guias atuais concentram as instruções de manutenção.


### 22/10/2026 — Entrada ilustrada e narração

A chegada à sala de brinquedos passa a usar cenário ilustrado na altura dos olhos e poses próprias da menina para chegada, surpresa, reflexão e decisão. Os cortes acompanham a conversa e o voo de Nanda. Falas, tempos e progressão permanecem os mesmos; a exploração surge após o fade final.

A narração ganha quadro superior em papel creme, moldura rosa e sálvia, pequenas flores e escrita manuscrita Caveat. A fonte é local e mantém os acentos. No celular, o quadro narrativo deixa o rodapé; a atuação se apresenta abaixo dele quando a cena exige regiões separadas. Aprovação artística humana continua distinta dos testes técnicos.


### 22/10/2026 — Revisão das cenas pelo seletor

O seletor do topo começa cada fase por sua cena de entrada: despertar, chegada à sala, transformação da arena ou urso caído. É possível escolher a mesma fase novamente para rever. A revisão mantém a campanha salva e não marca o despertar como concluído na campanha.


### 22/10/2026 — Câmera lateral durante os saltos

A regra de câmera do quarto escuro passa a ser explícita: a jogabilidade usa somente rolagem lateral, com altura e escala fixas por viewport. Pousar ou mudar de plataforma não reajusta o quadro. A câmera também deixa de corrigir a posição e a subida da menina. Cenas narrativas mantêm seus cortes; correções de salto devem atuar no salto ou nas superfícies físicas, conforme registrado em AGENTS.md.


## 22/10/2026 — Fadinha luminosa na perseguição

A corrida em 3D passa a apresentar a fadinha com corpo, coque, vestido, varinha e quatro asas em volume. Ela acompanha a menina acima da cabeça; sua luz dourada ilumina a personagem e os objetos próximos, com sombras reais. Para conservar o orçamento de renderização, essa luz ocupa o passe de sombra da janela dominante, mantendo duas fontes com sombra. A abertura ilustrada e as fases 2D mantêm sua linguagem própria. A aparência desta nova interpretação ainda depende de revisão artística do usuário.


### Revisão da fadinha — núcleo de luz e voo livre

A direção foi ajustada pela referência enviada pelo usuário: pequeno núcleo de luz branco/ciano, aura azul e asas peroladas maiores. A fada circula ao redor da menina, passando pelos dois lados, à frente e atrás, com variação de altura. A luz e suas sombras acompanham o núcleo. Essa revisão substitui o modelo humanoide e o voo estacionado acima da cabeça descritos na entrada anterior.

## 23 de outubro de 2026 — apoio que acompanha o desenho

O urso e os livros do começo do quarto passam a funcionar como um apoio contínuo. As plataformas consideram a extensão visível de suas superfícies, e os sapatos completos da menina contam para o contato. Isso permite caminhar e saltar nas bordas que parecem firmes, sem depender de manter o centro do corpo sobre uma faixa estreita. A câmera continua com rolagem somente lateral.

## 23/10/2026 — Menina e brinquedos

A pose de carregar brinquedos passa a apoiar o objeto nas palmas, com braços dobrados e dedos na frente. A qualidade detalhada escolhida para essa pose foi estendida às poses jogáveis 2D da menina. Na arena, ela mantém expressão brava, com olhos estreitos e sobrancelhas voltadas para o centro.

O baú da arena aparece aberto: os adversários sobem de dentro da caixa antes de entrar no combate. Na corrida 3D, a menina acompanha o novo vestido creme com detalhes rosa, as duas marias-chiquinhas e as proporções da versão ilustrada. A fada luminosa continua circulando ao redor dela.

## 23/10/2026 — Orientação na organização e descoberta da espada

Enquanto carrega um brinquedo, a menina precisa levá-lo ao baú: não pode largá-lo no chão nem trocar por outro. Nanda indica o baú durante a entrega e, assim que o brinquedo é guardado, segue para o brinquedo disponível mais próximo da menina.

A espada aparece à direita do baú, no piso abaixo da janela direita. Desde sua revelação, Nanda permanece sobre a espada e os brinquedos comuns ficam indisponíveis. A investigação aguarda a entrega do brinquedo atual antes de começar.

## 23/10/2026 — Um dia no jardim

O dia seguinte leva a menina para um jardim ensolarado, com roupa nova inspirada na foto: camiseta amarela e vestido turquesa estampado. Ela anda e pula em rolagem lateral, vence formigas e lagartas pulando por cima e atravessa grama, madeira, pedras, água e nuvens. Uma roda de quatro apoios oferece outro caminho. O destino é um lugar para brincar sob uma árvore.

Bandeirinhas marcam pontos de retomada. A fase tem controles de teclado, gamepad e botões simultâneos de andar/pular no celular. Pode ser revista pela bandeira → Um dia no jardim; na campanha, começa depois da conclusão da perseguição e do retorno do urso ao baú.

### 23/10/2026 — Caminho longo até o piquenique

O jardim passa por madeira, grama alta com marcha lenta e desconfortável, pedras no rio e pedrinhas rápidas com saltos irregulares. Roda e nuvens temporárias antecedem o grande trecho misto; lagartas mudam para vermelho no primeiro dos dois pisões, e formigas também saltam entre pedras. Nanda acompanha e indica o próximo apoio. O modo fácil é imortal, com resgate de quedas e desorientação após um golpe que seria fatal. A chegada reúne os quatro brinquedos, pão na chapa e suco de laranja; os diálogos serão escritos posteriormente. O chão fixo forma faixas contínuas, e a toalha fica no chão, separada das raízes da árvore.

O acabamento foi ampliado com bordas naturais, transição de materiais e pedras conectadas à água. A lagarta vermelha passa a perseguir a menina. Na grama os sapatos ficam encobertos; nas pedrinhas a atuação ganha quatro poses de desequilíbrio e suor de esforço, conservando o controle de parada imediata.


## 26/10/2026 — Yuna, o jardim e o descanso

Na saída de casa, Nanda convida a menina para o piquenique e revela seu nome: Yuna. A abertura mistura a vontade de ir com a intensidade das texturas e o receio dos insetos. A chegada tem uma clareira ilustrada inteira: Yuna, exausta, senta-se entre os amigos; Nanda se senta ao lado e come seu pequeno pão com suco.

Abelhas dão um breve aviso antes dos rasantes e podem voltar a atacar; um pisão na cabeça as derrota. Minhocas emergem do pedregulho com a aproximação e devem ser evitadas como espinhos. O besouro é inofensivo, mas o medo faz Yuna correr para frente durante seis segundos, deixando o pulo com o jogador. Sua velocidade continua normal; expressão, movimento desajeitado e suor transmitem a urgência. São três encontros, um deles nas quatro nuvens finais. A perseguição se repete nas tentativas e permanece igual no modo fácil, com a ajuda já existente da fada.

As cenas foram revistas para seguir a linguagem das fases anteriores: personagens separados do cenário, expressões e gestos, voo e pouso de Nanda e planos na altura dos olhos. No descanso, Yuna e Nanda levam o pão à boca. As falas permanecem poéticas. O voo da abelhinha agora mantém corpo e rosto estáveis enquanto apenas as asas se articulam, preservando seu comportamento no jogo.

A toalha vista na chegada foi refeita em perspectiva lateral e assentada no chão, com espaço livre em relação às raízes. Nas cenas, o jardim preenche o fundo atrás do quadro de diálogo, sem a antiga faixa clara. A cena permanece no piquenique ao terminar, preparando a continuidade para fases futuras.

### Jardim — leitura e atuação

As falas de abertura e do piquenique passam a avançar por toque/tecla, com animações contínuas e opção de pular cenas já vistas. O final permanece no piquenique. Narrador explica o pulo no primeiro susto; Nanda tranquiliza Yuna em todos os encontros com o besouro. Medo e passadas ganham expressão visual sem mudar velocidade ou saltos. Besouro voa com corpo estável, HUD fica mais legível, perigos recebem pistas naturais e a composição vegetal varia por setor.

### Padrão de leitura do jogo

Decisão posterior: preservar os tempos automáticos das falas e permitir clique/toque para adiantar um balão, tanto para narrador quanto personagens. Esse é o padrão geral; substitui a espera manual do jardim. A transição da casa voltou a mostrar a descida, a abelha alterna parábolas entre dois pontos de repouso e o besouro entra por fora da tela. Especificação permanente em `docs/diario-ia/padroes/DIALOGOS-E-CENAS.md`.


## 27/10/2026 — Resposta ao dano no jardim

Yuna passa a reagir aos golpes com um recuo visível do tronco, um pequeno sinal de contato e um som de impacto acompanhado da reação da menina. O piscar permanece como indicação de proteção após o golpe. A mudança preserva o caminho dos saltos e o controle; o modo fácil mantém os resgates. Esta é a primeira etapa da revisão dos feedbacks, ainda sujeita à avaliação e aprovação do usuário.


## 28/10/2026 — Derrota dos insetos no jardim

Formigas e lagartas deixam um corpo comprimido por um breve intervalo antes de sair gradualmente da cena. Abelhas e formigas das pedras do rio caem girando, em vez de desaparecer logo após o pisão. Os corpos deixam de oferecer risco imediatamente; os saltos de Yuna e a dificuldade permanecem os mesmos. A revisão está em validação e será apresentada para aprovação antes do próximo item da pipeline.


## 28/10/2026 — Besouros e chegada à outra margem

As duas fugas do besouro sobre rios passam a terminar quando Yuna pousa com os pés seguros na outra margem, devolvendo o movimento ao jogador. A travessia não perde a corrida automática ao completar seis segundos no ar. O encontro das nuvens finais mantém os seis segundos anteriores, e o pulo continua manual. Saves anteriores retomam na mesma posição; o formato atual conserva fugas mais longas. A revisão será apresentada para aprovação antes dos ajustes da arena.

## 28/10/2026 — Espada e resposta dos brinquedos na arena

A travessia dos besouros foi aprovada pelo usuário. A próxima entrega reforça o corte da espada desde o primeiro ataque, mantém o som durante o lançamento do especial e dá prioridade ao impacto sobre as confirmações de corações. Trem, Robô, Dinossauro e Urso inclinam e comprimem o corpo ao receber o golpe, inclusive quando a borda limita o recuo. A reação reaproveita as pinturas existentes e mantém as regras, os tempos de recuperação e o recuo físico. O enquadramento da arena pertence a outra etapa. A entrega passou pelos testes completos e está registrada no diário de IA para aprovação própria antes da próxima etapa.

### Revisão — soco do Robô

O usuário apontou um punch atrasado na segunda luta. O som vinha da preparação do contra-ataque do Robô, pouco depois de receber a espadada. O soco passa a acompanhar o avanço da luva, e o bloqueio encerra sua cauda para destacar o choque da defesa. A reação ao dano continua no contato da espada. A revisão concluiu a validação de jogabilidade e aguarda o usuário conferir novamente o áudio para aprovação; a próxima tarefa não foi iniciada.

## 28/10/2026 — Espaço para tocar no quarto escuro

O usuário aprovou a revisão do áudio do Robô. A etapa seguinte abre uma área inferior para os dedos no quarto escuro e indica onde tocar para pular, mantendo a tela inteira sensível. Em retrato, a cena sobe sem reduzir a escala anterior; em paisagem, o quadro abre para conter o salto inteiro acima da área de toque. O nível fica no topo central, com largura adaptada a telas menores. A altura e a escala continuam fixas durante cada viewport: salto e pouso não reenquadram a ação. Física, apoios e dificuldade permanecem os mesmos. A implementação concluiu os testes de jogabilidade e foi aprovada pelo usuário. O relatório e as evidências estão no diário de IA.


## 28/10/2026 — Aproximação dos lutadores na arena

O usuário aprovou a área de toque do quarto escuro e autorizou a etapa da câmera da arena. O quadro aproxima os lutadores no corpo a corpo e abre quando se afastam, com aproximação mais lenta para reduzir oscilações. Margens conservam as pinturas, os golpes e o salto; HUD e controles mantêm sua área. A abertura para o baú começa na derrota do brinquedo e conserva a troca visível. O corte da espada arco-íris mantém sua sequência. Física, alcance e dificuldade permanecem os mesmos. A entrega concluiu a validação de jogabilidade e foi aprovada pelo usuário. O relatório completo está no diário de IA.


## 28/10/2026 — Aprovações consolidadas e revisão da caminhada

Estão aprovados os ajustes de dano e derrota dos insetos no jardim, encerramento das fugas dos besouros nas margens, espada e impacto dos brinquedos (incluindo a revisão do soco do Robô), área útil do quarto móvel e câmera da arena. Decisões, alterações, testes e limitações foram consolidados no diário de IA, preservando os registros anteriores. O usuário autorizou continuar com a caminhada do quarto escuro e da sala de brinquedos: reduzir patinação e revisar os passos com e sem carga, preservando física, peso e câmeras. Essa etapa terá validação completa e aprovação própria antes das sombras2D.

## 28/10/2026 — Passos ligados ao deslocamento

Na sala de brinquedos, a menina passa a repousar quando o móvel ou a parede bloqueia seu movimento; carregar peso e usar o analógico parcialmente também desacelera as passadas. A poeira acompanha o percurso e nasce junto aos pés. No quarto escuro, o relógio da caminhada acompanha o deslocamento apoiado e fica suspenso no ar. As pinturas atuais foram reaproveitadas, sem alterar peso, velocidade, saltos, colisões ou câmeras. A validação e a aprovação desta etapa são registradas separadamente no diário de IA.

## 28/10/2026 — Revisão das pernas após avaliação do usuário

A cadência por distância não resolveu a percepção de corrida: o usuário observou que as pernas ainda pareciam um GIF repetido incorretamente. A etapa foi reaberta. A exploração passou a compor as pernas por articulações contínuas, com fases de apoio e retorno, usando peças pintadas próprias e o corpo/rosto existentes. A corrida rápida também ganha movimento, e a partida/parada deixa as pernas assentarem gradualmente. Com carga, o movimento é mais contido e as mãos acompanham o brinquedo. A avaliação visual desta revisão permanece com o usuário; a próxima etapa aguarda essa aprovação.

## 28/10/2026 — Caminhada aprovada; sombras da sala2D

O usuário aprovou a revisão das pernas (“boa. Pode passar para a próxima tarefa”). A etapa seguinte trata da profundidade visual durante a organização dos brinquedos: contato sob Yuna, móveis e brinquedos e projeções coerentes com as duas janelas. As sombras usam as pinturas existentes, acompanham a carga e os retornos ao chão e aparecem também sobre tapetes. As elipses genéricas são substituídas nesse passe para evitar duplicação; as sombras já pintadas são preservadas. Física, peso, câmera e funcionamento dos objetos continuam os mesmos. A nova apresentação das sombras aguarda avaliação própria do usuário.


### 29/10/2026 — aparência das pernas na caminhada

Após apontamento do usuário, a caminhada passou a reaproveitar a pele, as meias e as botas das poses originais. A variante de peças novas deixou de ser carregada; suas fontes continuam preservadas. O movimento contínuo foi mantido e a parada volta à pintura original. A avaliação visual desta correção permanece com o usuário; a próxima etapa não foi iniciada.


### 29/10/2026 — passada com reação do corpo

A revisão da exploração passou a coordenar contato dos pés, absorção do peso e impulso com o quadril e o tronco. A cadência visual foi reduzida sem alterar o deslocamento do jogo. Braços alternam, cabeça compensa parte da inclinação e cabelo/vestido acompanham discretamente. Na sala, o apoio segue a direção percorrida; mãos e brinquedo permanecem juntos durante o transporte. A aparência usa as pinturas existentes. Avaliação visual do usuário ainda pendente.


### 29/10/2026 — perspectiva uniforme na caminhada

O usuário aprovou a atuação lateral e apontou contorção ao subir/descer: as pernas mudavam de orientação sem uma vista correspondente do torso. A sala passou a conservar corpo e pernas no mesmo perfil também nos movimentos verticais e diagonais. A caminhada lateral e a primeira fase foram preservadas. O deslocamento continua livre no piso; avaliação visual da correção ainda pendente.


### 29/10/2026 — comandos de leitura

A caminhada foi aprovada pelo usuário, que autorizou continuar para a etapa de leitura. Quadros de narrador e personagem passaram a indicar o avanço automático e o gesto de adiantar uma fala. Enter também funciona nas cenas de leitura bloqueadas, sem repetição por tecla mantida. No jardim, a opção de pular uma cena já vista ganhou botão separado dentro da moldura. Os tempos, as ações obrigatórias e os controles de jogo permanecem com seus donos existentes. A etapa está pronta para avaliação visual do usuário. A caminhada aprovada foi preservada; a etapa seguinte aguarda aprovação própria.


### 29/10/2026 — proporção da menina na perseguição

Os comandos de leitura foram aprovados pelo usuário. A revisão seguinte compara a menina3D com a pintura: cabeça e cabelo mais contidos, tronco e membros alongados, franja curva e botas apoiadas pela sola. A articulação usa os novos comprimentos e mantém a espada na mão. A mudança é de apresentação; as regras da perseguição são preservadas. A nova interpretação aguarda avaliação artística do usuário.


### 29/10/2026 — aprovação da revisão3D

O usuário aprovou a proporção e a articulação revisadas da menina3D. A etapa encerra a implementação do plano de feedbacks. O próximo passo recomendado é validar a experiência com jogadores e aparelhos reais antes de preparar a versão para publicação.


### 29/10/2026 — versão disponível para teste no celular

Os ajustes do ciclo de feedbacks foram integrados à branch principal e publicados pelo CI/CD, conforme autorização do usuário. A versão permite agora a avaliação em celular e a nova rodada com jogadores.


### 29/10/2026 — separação dos capítulos e passagem para o sonho

A aventura passa a apresentar gravuras de abertura para “Quarto de brinquedos” e “Dia de piquenique no jardim”. Depois do urso, uma nova cena mostra a menina cansada no quarto arrumado; sua pergunta sobre voltar a pegar os brinquedos termina no facepalm de Nanda. O piquenique agora conduz ao sono das duas. Os novos diálogos e pinturas aguardam avaliação artística. O jardim3D do sonho foi descrito como travessia de fuga e esconderijos, com Yuna minúscula diante de insetos gigantes; o usuário confirmou que sua construção ficará para depois da conclusão destas cenas.


### 29/10/2026 — encerramento acessível pela bandeira

A perseguição iniciada pelo seletor de fases passa a mostrar também o quarto arrumado, a pergunta da menina e o facepalm de Nanda. O percurso de revisão continua separado da campanha salva.


### 29/10/2026 — capítulos aprovados e próximo ciclo organizado

O usuário aprovou as cenas entregues, incluindo o encerramento do capítulo 1 acessível pela bandeira. A entrega contempla a música após levantar, as duas gravuras de capítulo, o quarto arrumado com a pergunta da menina e o facepalm de Nanda, e o piquenique que termina com Yuna e Nanda adormecidas. O roteiro consolida a versão atual e o ponto de passagem para o sonho.

A próxima construção será o jardim 3D: Yuna minúscula precisa atravessar a vegetação fugindo e se escondendo de insetos gigantes, sem combate. O plano começa por um trecho com grama alta e uma formiga; depois vêm integração ao sono, outros insetos e ampliação do percurso. A fase ainda não foi implementada. O contexto de IA foi consolidado, preservando a versão anterior no acervo, para evitar retomar filas antigas já resolvidas.


### 29/10/2026 — documentação contínua e preparação de commits

A revisão documental passou a cobrir os módulos e métodos atuais, as classes da perseguição/jardim/capítulos, os fluxos de persistência e as ferramentas de manutenção. O usuário tornou obrigatória a atualização da documentação em cada implementação autorizada. Também determinou que cada pedido de commit inclua a limpeza de relatórios, imagens de aprovação e arquivos dispensáveis, preservando o acervo recuperável e os recursos necessários ao projeto. As regras vigentes estão na entrada obrigatória do diário de IA.


### 29/10/2026 — capítulos integrados e publicados

Os capítulos aprovados e a documentação atualizada foram integrados à main e enviados ao GitHub após a validação geral da campanha. A aventura publicada inclui o encerramento do quarto arrumado, as duas gravuras e o sono de Yuna e Nanda no piquenique, pronta para teste humano no celular. O sonho no jardim 3D continua como a próxima construção planejada. Endereço do jogo: https://luciussama.github.io/legendGirl/ .
