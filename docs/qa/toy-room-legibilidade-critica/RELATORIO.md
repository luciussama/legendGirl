# Toy Room — auditoria crítica de legibilidade e coerência artística

Data: 5 de outubro de 2026. Trabalho exclusivamente de auditoria: nenhum código, asset de jogo, posição do mapa, colisão ou mecânica foi alterado.

**Legibilidade geral: D — Precisa revisão. Coerência artística geral: D — Precisa revisão. Apresentação de carregar: E — Inaceitável para comunicar apoio e contato.**

A sala permite jogar, mas isso não prova que seus objetos sejam imediatamente compreensíveis. O coelho é reconhecível como animal e, ao mesmo tempo, inadequado como arte final. A poltrona vermelha e o cavalinho amarelo têm problemas de identidade visual, além do acabamento inferior. A montagem dos objetos carregados falha mesmo quando utiliza o urso e o trem ilustrados de referência.

## Evidências e limites da avaliação

- [Oito brinquedos carregados, personagem voltada à direita e à esquerda](carregar-oito-direcoes.png).
- [Coelho carregado dentro da fase](coelho-carregado-jogo.png). A protagonista chegou ao coelho por movimentos normais e acionou a coleta existente, sem rearranjar a sala.
- [Poltrona, cavalinho e baú de referência](objetos-criticos.png).
- [Sala completa atual](../toy-room-pos-correcao/depois.png).
- [Registro da captura em jogo](captura.json).

A prancha dos oito estados usa os renderizadores atuais, na escala usada pela fase, sobre fundo uniforme para examinar contato e oclusão. É uma apresentação de evidências, não um novo asset de jogo. A captura do coelho complementa essa inspeção com o cenário real.

O texto recebido menciona uma captura, mas não veio acompanhado de uma imagem adicional. Nesta auditoria, **“asset vermelho” designa a forma vermelha grande na região inferior esquerda, identificada no código como `armchair`**. O baú vermelho da região superior direita é outro objeto e foi incluído na comparação para evitar confusão. O oval amarelo com arco marrom corresponde a `rocking-horse`.

O reconhecimento em menos de um segundo é uma **estimativa de inspeção visual**, não um tempo medido com jogadores novos. As legendas das pranchas identificam os objetos, mas as notas consideram a forma sem depender desses nomes. Não foi realizado estudo de usuários que permita afirmar taxas ou tempos empíricos de reconhecimento.

## 1. Sistema de carregar brinquedos — E

| Pergunta | Resultado observado |
|---|---|
| As mãos parecem segurar o objeto? | Não. As mãos ficam nas laterais superiores, sem envolver, apoiar ou tocar os brinquedos de forma convincente. |
| Os braços estão posicionados corretamente para o transporte? | Não. A pose de braços erguidos comunica coleta ou celebração; não adapta o apoio ao objeto. |
| O brinquedo parece carregado? | Acompanhamento de movimento sugere posse, mas a imagem não comunica sustentação física. |
| Parece anexado ao sprite? | Sim. O objeto aparece como uma camada frontal sobre cabeça, peito e vestido. |
| Há sensação visual de peso? | Insuficiente. Não há postura de esforço, apoio inferior ou reação corporal ao formato e tamanho. |
| Há contato personagem–objeto? | Não há contato consistente entre mãos e superfície do brinquedo. |

### Causas verificáveis na implementação

`ToyRoomEntities.js` escolhe `collect` sempre que existe `carriedItem`, inclusive durante o movimento. Essa animação tem apenas um quadro. Portanto, a protagonista não usa a animação de corrida enquanto transporta um brinquedo.

Em `ToyRoomPhase.js`, o objeto recebe `x = player.x` e `y = player.y - 38 + sin(animTime × 1,5) × 3`. Essa ancoragem não usa coordenadas das mãos, não se adapta à direção e só acrescenta uma oscilação vertical de três pixels.

O renderizador desenha primeiro a personagem e depois o brinquedo inteiro. Não existe uma camada de mãos ou braços à frente do objeto. Ao virar para a esquerda, a personagem é espelhada; o brinquedo conserva sua própria orientação e ancoragem central.

Há uma redução mecânica de velocidade pelo campo `weight`. Para o coelho, o fator é 0,96: a velocidade-base de 3,8 passa a 3,648 unidades por atualização. Isso demonstra peso na lógica, **mas não demonstra peso visual**. A auditoria não recomenda alterar essa mecânica.

### Gravidade por brinquedo

| Objeto transportado | Nota da apresentação | Falha específica |
|---|:---:|---|
| Urso | E | Imagem de 64 × 90 cobre grande parte do corpo; mãos levantadas não oferecem apoio à base ou às laterais. |
| Trem | E | Imagem de 84 × 64 atravessa a região do rosto e tronco, sem plataforma de apoio nas mãos. |
| Robô | E | Bloco frontal sobre o peito; braços da protagonista afastados do objeto. |
| Coelho | E | Orelhas sobre o rosto e corpo sobre o vestido; não há envolvimento das mãos. |
| Patinho | D | Forma menor facilita distinguir personagem e objeto, mas o pato continua flutuando diante do corpo. |
| Blocos | D | Pilha frontal sem apoio inferior; posição dos braços não sustenta a torre. |
| Tambor | D | Menor cobertura do rosto, porém ausência de mãos segurando a borda ou a base. |
| Caixa de surpresa | D | Caixa sobre o tronco e esfera perto do rosto, sem contato ou orientação de apoio. |

As notas E se referem à montagem de carregar, não à qualidade do urso e do trem isoladamente. Esses dois assets continuam referências artísticas adequadas. A falha viola a assinatura de volume e material crível: objetos bem pintados ficam sem suporte espacial ao serem unidos à personagem.

**Ação recomendada, sem executar:** reconstruir a apresentação de transporte com pose apropriada, ancoragem visual por objeto e direção, e ordem de camadas que permita mãos em contato. Preservar a identidade da protagonista, a física, os pesos e a lógica de coleta.

## 2. Coelhinho de Algodão — E como arte final

**Parece um placeholder.** A silhueta permite reconhecer um coelho, mas a qualidade de acabamento não é equivalente à do urso e do trem.

| Critério | Coelho atual | Urso e trem de referência |
|---|---|---|
| Textura | Preenchimento rosa uniforme; nenhuma fibra de pelúcia. | Urso com textura e variações de pelo; trem com materiais pintados e detalhes. |
| Volume | Cabeça e corpo sem planos claros ou luz modelando a forma. | Saliências, recessos, bordas e sombras incorporadas à ilustração. |
| Silhueta | Orelhas identificáveis; corpo formado por círculos, sem patas ou braços definidos. | Anatomia e peças reconhecíveis, com apoios e articulações. |
| Material | Não distingue pelúcia, borracha ou recorte de papel. | Pelúcia e construção de brinquedo distinguíveis. |
| Detalhe | Orelhas, cabeça, corpo e três pequenos traços faciais. | Rosto, focinho, laço, patas; cabine, rodas, chaminé e peças do trem. |
| Acabamento | Linguagem de pictograma geométrico. | Pintura digital texturizada, contorno orgânico e volume. |

O problema não é exigir detalhe excessivo em um brinquedo pequeno. Faltam os sinais essenciais de material, anatomia e iluminação que permanecem legíveis nos assets de referência. O nome “Algodão” não é sustentado pelo desenho.

Ao carregar, a falta de patas e braços do próprio coelho agrava a leitura de contato. Na captura logo após a coleta, a fada e faíscas também se aproximam do conjunto cabeça–orelhas; esse efeito é transitório e não é a causa estrutural do problema.

**Recomendação:** refazer a arte do coelho mantendo sua identidade de brinquedo e área de uso; tratar sua montagem de transporte como problema separado. Acrescentar apenas textura ao desenho atual não resolve anatomia e apoio.

## 3. Asset vermelho: poltrona — E como arte final; D para reconhecimento

**O que representa no código:** uma poltrona, `armchair`, em (180, 840), com dimensões de configuração 130 × 120.

**O que comunica visualmente:** uma forma vermelha arredondada com placa amarela e círculo azul. Sem o nome, pode ser interpretada como cápsula, porta de brinquedo, armário ou elemento de interface. A presença de uma sombra indica objeto no chão, mas não identifica um assento.

**Um jogador novo entenderia imediatamente? Não há indicação visual suficiente para prever isso.** Faltam assento em perspectiva, braços, encosto separado, pés e profundidade do estofado. A mancha amarela com círculo azul não tem função material clara.

**Coerência temática:** uma poltrona seria apropriada a um quarto infantil. **Coerência artística:** a representação atual não pertence à família pictórica da mesa, do baú ou dos tecidos dos tapetes.

**Escala:** a área de configuração já é maior que a altura visual da protagonista parada. O arco superior do desenho ainda se estende 25 pixels acima de `y`, fazendo a forma vermelha ocupar aproximadamente 145 pixels de altura. Isso torna sua ambiguidade muito visível. Não há anatomia do móvel suficiente para avaliar proporção de assento, criança e encosto de maneira convincente.

**Posição:** estar junto à lateral esquerda é plausível para um móvel. O problema compositivo é a aproximação com o trilho e a sobreposição à borda do tapete retangular, sem uma leitura convincente de pés ou apoio. Não há evidência de que mover o objeto resolveria sua identidade.

**Parece placeholder? Sim. Parece da mesma equipe de arte? Não pelo acabamento observável.** A forma viola material têxtil, volume, contorno orgânico e leitura arquitetônica dos objetos de referência.

**Recomendação:** refazer a representação da poltrona dentro da geometria autorizada. Reavaliar depois sua relação visual com o tapete, sem presumir necessidade de reposicionamento.

O baú superior direito tem pintura, planos e material; não deve ser confundido com essa poltrona. Seu detalhe de tampa, caixa e base oferece mais pistas de objeto físico, embora o papel de recipiente de organização ainda dependa do contexto da missão.

## 4. Oval amarelo com arco marrom: cavalinho — E

**O que deveria representar:** um cavalinho de balanço, `rocking-horse`, em (480, 420), com configuração de 100 × 80.

**O que comunica sem o código:** uma elipse amarela sobre um arco marrom. Pode sugerir uma tigela, um prato, um balanço ou um símbolo abstrato. O arco sugere uma base curva, mas não identifica o objeto como cavalo.

Não existem cabeça, pescoço, focinho, crina, pernas, sela, alças ou apoios que liguem o corpo à base. A elipse isolada não tem anatomia nem material. A composição não comunica como alguém sentaria ou utilizaria o objeto.

**É facilmente identificável? Não. A silhueta comunica a função? Não. A forma é suficiente? Não. Parece arte final? Não; parece um conceito incompleto.**

A nota E é motivada por ausência de identidade e construção, não por diferença de cor. Viola os mesmos critérios de material crível e volume demonstrados pela mesa e pelo trem, além de não apresentar uma silhueta de brinquedo acabado.

**Recomendação:** refazer o asset com anatomia e estrutura de balanço reconhecíveis, preservando o espaço e as colisões. Não acrescentar somente textura à elipse atual.

## 5. Inventário de identificação imediata

Legenda exclusiva desta tabela: A — reconhecimento imediato; B — reconhecimento rápido; C — aceitável; D — ambíguo; E — incompreensível quanto à identidade pretendida. “<1 s” é previsão visual, não resultado de teste de usuários. Qualidade de arte final é avaliada separadamente.

| Asset | Leitura provável sem legenda | <1 s, estimativa | Silhueta | Papel compreensível? | Parece finalizado? | Reconhecimento |
|---|---|---|---|---|---|:---:|
| Protagonista parada | Menina/personagem jogável | Provável | Clara | Sim, pelo controle | Sim | A |
| Protagonista transportando | Menina com objeto sobreposto | Posse: provável; apoio: não | Comprometida | Posse sim; sustentação não | Não como montagem | D |
| Fada | Pequena fada ou figura alada | Provável com contexto | Clara como figura alada | Acompanhante; função exata depende do contexto | Acabamento inferior | B |
| Urso | Ursinho de pelúcia | Provável | Clara | Brinquedo; coleta indicada ao aproximar | Sim | A |
| Trem | Locomotiva de brinquedo | Provável | Clara | Brinquedo; não está colocado sobre os trilhos | Sim | A |
| Robô | Aparelho com antena; possivelmente robô | Incerto | Parcial, sem membros | Coleta só com indicador | Não | D |
| Coelho | Coelho rosa | Provável | Orelhas claras | Brinquedo; coleta indicada ao aproximar | Não | A |
| Patinho | Pato amarelo ou patinho de banho | Provável | Clara | Brinquedo; coleta indicada ao aproximar | Parcial | B |
| Torre de blocos | Pilha colorida ou miniatura de casa | Provável como pilha | Clara como formas; material ausente | Coleta só com indicador | Não | B |
| Tambor | Tambor pequeno | Provável | Elipse e corpo reconhecíveis | Brinquedo; coleta indicada ao aproximar | Parcial | B |
| Caixa de surpresa | Caixa com esfera e haste; brinquedo indefinido | Improvável para a identidade exata | Parcial | Coleta só com indicador | Não | D |
| Baú | Caixa/baú de tampa arredondada; possível casinha | Provável para recipiente; tipo exato incerto | Boa | Destino de organização depende da missão | Sim, como ilustração | B |
| Estante | Prateleira ou caixa com livros coloridos | Provável com contexto | Retangular | Móvel/obstáculo, sem uso próprio | Não | B |
| Armário | Gabinete baixo de duas portas | Provável como gabinete | Clara como caixa; fraca como guarda-roupa | Obstáculo, sem uso próprio | Não | C |
| Poltrona vermelha | Cápsula, porta de brinquedo ou armário | Improvável como poltrona | Forte, mas sem anatomia de assento | Apenas obstáculo evidente pelo contato | Não | D |
| Fortaleza | Casa/castelo geométrico | Provável como construção; blocos incertos | Parcial | Obstáculo/decoração, sem uso próprio | Não | C |
| Cavalinho | Elipse com arco; objeto indefinido | Improvável como cavalo | Não identifica cavalo | Não visualmente | Não | E |
| Mesa | Mesa redonda de madeira | Provável | Clara | Móvel/obstáculo; sem uso próprio | Sim | A |
| Tapete central | Tapete circular | Provável | Clara | Decoração de chão | Sim | A |
| Tapete oval | Tapete oval bordado | Provável | Clara | Decoração de chão | Sim | A |
| Tapete retangular | Tapete com franjas | Provável | Clara | Decoração de chão | Sim | A |
| Trilhos | Circuito de trem de brinquedo | Provável | Clara | Decoração; não guia o trem coletável | Sim | B |
| Porta verde | Porta de madeira com arco | Provável | Clara | Entrada visual; não assumir interação só pelo desenho | Sim | A |
| Janelas | Janelas arqueadas | Provável | Clara | Arquitetura/fonte visual de luz | Sim | A |
| Cortinas | Cortinas claras | Provável | Clara dentro da janela | Decoração/tecido | Sim | B |
| Piso | Tábuas de madeira | Provável | Superfície reconhecível | Área de circulação | Sim | A |
| Parede | Papel de parede floral | Provável | Superfície reconhecível | Arquitetura | Sim | A |
| Rodapés e frisos | Molduras de madeira | Provável | Clara | Acabamento arquitetônico | Sim | B |
| Cubo azul decorativo | Bloco de brinquedo | Provável | Clara | Decoração; não há a mesma interação dos coletáveis | Sim | A |
| Bloco vermelho em arco | Peça de construção de brinquedo | Provável | Clara | Decoração | Sim | B |
| Bola listrada | Bola de brinquedo | Provável | Clara | Decoração; pode ser confundida com coletável | Sim | A |
| Livro com urso | Livro ou álbum ilustrado | Provável com contexto | Parcial na escala pequena | Decoração; pode ser confundido com coletável | Sim | B |

**Distinção importante:** reconhecer “coelho” ou “blocos” não implica qualidade artística A. Também reconhecer uma bola como brinquedo não permite deduzir se ela pode ser coletada. A sala mistura brinquedos decorativos ilustrados e brinquedos interativos chapados, sem uma regra visual única para essa diferença.

Partículas e interface não são objetos físicos da sala: a poeira e o rastro são legíveis como atmosfera; as faíscas como feedback; confetes como celebração. O indicador `PEGAR` esclarece a interação ao aproximar, mas não resolve a identidade ambígua da poltrona ou do cavalinho.

## 6. Coerência de posicionamento e decoração

Notas desta seção: A — Excelente; B — Bom; C — Aceitável; D — Precisa revisão; E — Inaceitável. Julgam a composição, não a qualidade do desenho isolado.

| Ocorrência | Nota | Evidência e interpretação |
|---|:---:|---|
| Poltrona, tapete retangular e trilho | D | Poltrona em x=180–310, tapete em x=280–460 e trilho lateral próximo de x=320. Há sobreposição à borda do tapete e proximidade extrema do circuito. Sem pés/assento legíveis, a montagem parece uma forma inserida sobre a decoração. |
| Cavalinho dentro da região superior do circuito | D | Posição em (480, 420), próxima ao trecho superior do trilho. Um brinquedo de balanço seria tematicamente plausível, mas o símbolo atual ocupa espaço sem comunicar uso ou apoio. A ambiguidade da arte é o fator dominante. |
| Circuito sobre o tapete retangular | C | A curva e o trecho inferior atravessam o tapete. É possível montar trilhos sobre tecido, mas a sobreposição densa reduz a separação visual entre os dois. Não é prova de erro físico. |
| Mesa junto à borda inferior do tapete central | C | A imagem da mesa começa em y=764, enquanto o recorte do tapete termina em y=810. A proximidade é plausível, mas a borda, as franjas e o tampo disputam o mesmo trecho da composição. |
| Fortaleza grande na região direita | C | A posição periférica funciona como área de brincar. A grande massa laranja, sem volume, domina a leitura; o problema é hierarquia e acabamento, não necessariamente a posição. |
| Armário e estante na parede superior | B | Alinhamento tem função arquitetônica clara. A altura e a profundidade pouco legíveis do armário são problemas de representação. |
| Baú na parede superior direita | B | Posição de recipiente organizador é plausível. Seu papel de objetivo depende da instrução da fase. |
| Urso, trem e outros coletáveis espalhados | B | Dispersão é coerente com a missão de arrumar brinquedos. Não deve ser tratada automaticamente como colocação aleatória sem justificativa. |
| Trem fora dos trilhos | C | Está em (760, 520), abaixo do trecho superior em y=420. Pode ser um brinquedo largado para coleta, mas o circuito não implica movimentação ferroviária. |
| Bloco azul, bola e livro decorativos | C | Distribuição temática plausível, porém parecem candidatos à coleta tanto quanto vários brinquedos interativos. A diferença de função não é dedutível só pelo acabamento. |
| Coelho junto ao tapete retangular | B | Local de brinquedo largado é plausível. A falha de apresentação ao carregá-lo não resulta de sua posição inicial. |
| Fada próxima ao conjunto cabeça–objeto | D | Acompanhamento concentra asas, cabeça, brinquedo e partículas em uma área pequena; dificulta separar as figuras, sobretudo com o coelho. |

Não foi identificada obrigação de reposicionar todos os objetos. Refazer identidade, apoio e perspectiva deve anteceder qualquer conclusão sobre rearranjo, que exigiria uma autorização e validação próprias.

## 7. Comparação com a assinatura visual oficial

A assinatura exige pintura digital ilustrada, textura, material crível, volume, iluminação integrada, cores quentes e acabamento storybook. Tapete, baú, mesa, urso, trem, porta e piso são as referências preservadas.

| Item problemático | Mesma família visual? | Qualidade equivalente? | Aparência de mesma equipe? | Nota artística e violação |
|---|---|---|---|---|
| Coelho | Não | Não | Não | E: pictograma sem pelúcia, anatomia ou volume. |
| Poltrona | Não | Não | Não | E: assento não reconhecível, cores planas e material indefinido. |
| Cavalinho | Não | Não | Não | E: identidade anatômica ausente, corpo e base sem construção. |
| Estante | Não | Não | Não | E: livros e madeira sem profundidade ou textura. |
| Armário | Não | Não | Não | E: caixa frontal sem material, perspectiva e proporção de guarda-roupa. |
| Fortaleza | Não | Não | Não | E: massa geométrica plana, sem leitura de construção por peças. |
| Robô | Não | Não | Não | E: aparelho retangular sem membros ou modelagem material. |
| Torre de blocos | Não | Não | Não | E: faces e madeira ausentes; incompatível com os blocos decorativos raster. |
| Caixa de surpresa | Não | Não | Não | E: identidade incompleta de figura, mecanismo e caixa; acabamento de símbolo. |
| Patinho | Parcial | Não | Fraca | D: silhueta serve, mas faltam olho, luz modelando a forma e material de borracha. |
| Tambor | Parcial | Não | Fraca | D: volume inicial pelas elipses, mas faltam construção, bordas e material coerente. |
| Fada | Parcial pela paleta | Não | Fraca | D: preenchimentos vetoriais e pouca modelagem junto da personagem ilustrada. |
| Montagem de carregar | Não como conjunto físico | Não | Inconsistente | E: contato, apoio, oclusão e direção não acompanham o volume dos objetos. |

As cores temáticas não compensam essas violações. A diferença se mantém mesmo removendo o fundo, como demonstra a prancha de carregamento.

## 8. Tabela final de ações recomendadas

Legenda desta tabela: A — Excelente; B — Bom; C — Aceitável; D — Precisa revisão; E — Deve ser refeito. As ações são recomendações, sem implementação nesta tarefa.

| Asset ou apresentação | Nota | Problema principal | Ação recomendada |
|---|:---:|---|---|
| Montagem de carregar | E | Objeto frontal sem mãos, peso ou apoio | Refazer apresentação de transporte por objeto e direção, preservando mecânicas. |
| Coelho | E | Placeholder sem material de pelúcia | Refazer anatomia, material e volume; depois integrar às mãos. |
| Poltrona vermelha | E | Não comunica assento | Refazer desenho com encosto, braços, assento, pés e tecido. |
| Cavalinho amarelo | E | Não comunica cavalo | Refazer anatomia e estrutura de balanço. |
| Estante | E | Caixa e livros chapados | Refazer madeira, profundidade e construção dos livros. |
| Armário | E | Caixa baixa sem material ou volume | Refazer representação e proporções visuais dentro da geometria autorizada. |
| Fortaleza | E | Grande bloco plano sem peças | Refazer construção por blocos, faces e encaixes. |
| Robô | E | Identidade incompleta e cor plana | Refazer anatomia mecânica, membros e material de brinquedo. |
| Torre de blocos | E | Sem faces ou material | Refazer as peças no padrão dos blocos decorativos. |
| Caixa de surpresa | E | Mecanismo e personagem indefinidos | Refazer figura, caixa e mecanismo reconhecíveis. |
| Patinho | D | Borracha e rosto pouco definidos | Preservar silhueta; completar rosto, luz e acabamento. |
| Tambor | D | Construção/material insuficientes | Preservar forma básica; completar bordas, amarração e textura. |
| Fada | D | Acabamento vetorial e concentração junto à cabeça | Adaptar material/volume e revisar apresentação sem alterar seu comportamento. |
| Protagonista em deslocamento vertical | C | Orientação lateral pouco coerente com a sala | Avaliar apresentação direcional mantendo identidade e movimento. |
| Urso | B | Boa arte; escala e montagem de transporte inadequadas | Preservar asset e revisar exclusivamente sua apresentação ao carregar. |
| Trem | B | Boa arte; rosto encoberto ao transportar | Preservar asset e revisar exclusivamente sua apresentação ao carregar. |
| Baú, mesa e porta | B | Papel e composição dependem parcialmente do contexto | Preservar arte; revisar clareza contextual se necessário. |
| Piso | B | Repetição forte de tábuas | Avaliar hierarquia e repetição numa tarefa posterior. |
| Tapete central | A | Referência consistente | Preservar. |
| Tapetes secundários | B | Bordado mais pronunciado e sobreposição com circuito | Preservar; avaliar integração compositiva. |
| Parede, janelas, cortinas, rodapés e frisos | B | Repetição e detalhe periférico | Preservar; considerar redução de competição visual se necessária. |
| Trilhos | B | Proximidade de móveis e passagem sobre tapete | Preservar arte; revisar somente clareza compositiva em tarefa autorizada. |
| Decoração raster pequena | B | Função de decoração confundível com coletável | Preservar arte; estabelecer regra visual de interação. |
| Feixes e sombras dos móveis | D | Luz e apoio espacial inconsistentes | Rever integração visual em etapa própria; não adicionar réguas de contato. |
| Aura de seleção | D | Anel geométrico alheio ao acabamento pintado | Rever linguagem do destaque interativo. |
| Sombras dos brinquedos, poeira de passos, faíscas e confetes | C | Acabamento genérico e escala desigual | Harmonizar feedback e apoio visual em etapa própria. |
| Poeira dourada, rastro da fada e flash de entrada | B | Integração temática adequada | Preservar; avaliar apenas competição local durante a coleta. |
| Interface e indicador `PEGAR` | C | Linguagem diferente da pintura do cenário | Harmonizar acabamento e iconografia sem perder legibilidade. |

Feixes, sombras e aura recebem D porque sua geometria e materialidade não acompanham as referências ilustradas: feixes não integram o objeto iluminado, sombras variam em tratamento e peso, e o anel usa espessura uniforme típica de interface. Esses pontos já existiam e não foram corrigidos nesta auditoria.

## 9. Assets que devem ser refeitos

Para atingir a assinatura visual exigida, a recomendação é **refazer nove assets de objeto**: coelho, poltrona, cavalinho, estante, armário, fortaleza, robô, torre de blocos e caixa de surpresa. Suas estruturas visuais são insuficientes; uma camada de textura não resolve os problemas de identidade, anatomia e construção.

Também deve ser refeita a **montagem de transporte**, como apresentação visual. Isso não implica refazer o urso, o trem ou toda a protagonista, nem alterar coleta, peso ou colisões.

## 10. Itens que precisam de ajustes, sem substituição integral obrigatória

- Patinho e tambor: estrutura reconhecível que permite completar rosto, material e construção.
- Fada: identidade alada preservável; necessita acabamento compatível e revisão da sobreposição visual.
- Urso e trem: boa arte; ajustar escala aparente e apoio durante o transporte.
- Apresentação direcional da protagonista: revisar leitura durante movimento vertical, preservando sua identidade.
- Luz, sombras e aura: integração e acabamento visual em tarefa específica.
- Decoração versus coletáveis: melhorar clareza de papel, sem concluir que objetos espalhados são erros de posicionamento.
- Relações poltrona–tapete–trilho e mesa–tapete: avaliar composição depois que os móveis tiverem anatomia legível.
- Repetição de piso/frisos, partículas e interface: harmonizar hierarquia e acabamento se a próxima revisão confirmar necessidade.

## 11. Ranking dos dez maiores problemas visuais

1. **Transporte sem apoio das mãos:** afeta todos os oito brinquedos e uma ação central da fase.
2. **Coelho:** alta discrepância frente ao urso, agravada por cobertura do rosto ao carregar.
3. **Cavalinho:** identidade pretendida não é comunicada pela forma.
4. **Poltrona vermelha:** objeto grande e contrastante sem anatomia de assento.
5. **Fortaleza:** grande massa plana que domina a região direita e quebra o acabamento da sala.
6. **Robô e caixa de surpresa:** identidade parcial e acabamento de símbolos junto dos brinquedos ilustrados.
7. **Estante e armário:** móveis chapados imediatamente próximos de referências ilustradas.
8. **Torre de blocos:** incompatibilidade direta com os blocos decorativos da mesma fase; patinho e tambor também permanecem inferiores.
9. **Fada, cabeça e brinquedo sobrepostos:** excesso de figuras e feedback na região mais importante da personagem.
10. **Papel dos objetos e apoio espacial:** brinquedos decorativos confundíveis com coletáveis; sombras, luz e sobreposições não estabelecem uma hierarquia comum.

## Parecer final

**Legibilidade: D.** Muitos objetos são reconhecidos rapidamente, mas dois móveis destacados falham em comunicar identidade, outros dependem de contexto e a ação de carregar não comunica contato. Isso impede uma leitura instantânea consistente da fase. A nota considera reconhecimento e apresentação de ação; não substitui a avaliação funcional anterior, em que as mecânicas passaram.

**Coerência artística: D.** A Etapa 1 melhorou parede, janelas, tecidos, tapetes e trilhos, mas nove objetos ainda exigem reconstrução visual para acompanhar a família de referência. A boa qualidade do ambiente torna a diferença dos placeholders mais evidente.

A próxima implementação deveria priorizar apresentação de carregar, coelho, cavalinho e poltrona, antes de novo enriquecimento decorativo. As recomendações não autorizam alterações nesta tarefa. Não foram iniciadas correções.
