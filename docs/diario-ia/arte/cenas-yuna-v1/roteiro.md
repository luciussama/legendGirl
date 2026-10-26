# Jardim — o nome no primeiro passo

Proposta de roteiro e direção de cena criada na sessão `20261026T024507-0319b7e6042c`. O usuário definiu o nome **Yuna**, revelado pela fada na saída de casa, e a chegada exausta ao piquenique com a fada sentada ao lado dela. A fala de convite abaixo é literal do usuário. As demais falas e a narração são propostas novas, ainda sem aprovação humana. Este material ainda não está integrado ao jogo.

Ilustrações propostas: [saída da casa](abertura-yuna-v1.png) e [descanso no piquenique](piquenique-descanso-v2.png). Prompts completos nos JSONs adjacentes. A primeira variante do piquenique também fica preservada; a segunda explicita melhor o cansaço pedido.

## Cena inicial — do lado de fora

**Atuação:** a porta se abre. A menina desce a escada e hesita no último degrau. A fada, Nanda, voa à altura de seu rosto, empolgada. O jardim oferece flores, movimento, grama e pedrinhas; o inseto é pequeno, mas prende a atenção da menina. A ilustração acompanha esse instante, sem textos pintados.

**Narração**

A porta se abriu para uma manhã cheia de coisas.
O sol aquecia o último degrau. Mais adiante, a grama se mexia, as pedrinhas brilhavam e alguma coisa zumbia entre as flores.

**Fada, empolgada**

— Vamos, Yuna, vamos no piquenique, vai ser divertido!

**Narração**

Yuna.
Seu nome atravessou a porta antes dos seus pés.

Ela sorriu para a fada. Queria o piquenique, os amigos, o pão quentinho.
Mas o jardim chegava todo de uma vez.
A grama roçava suas pernas. As pedrinhas faziam cada passo parecer diferente. Um inseto levantou voo, e seus ombros subiram junto.

Dentro dela, a alegria dava pulinhos. O medo também.

**Yuna**

— Eu quero ir… mas o jardim faz tanta coisa ao mesmo tempo.

**Fada, aproximando-se com carinho**

— Então vamos um pedacinho de cada vez. Eu vou com você.

**Narração**

Yuna olhou o caminho.
A vontade de ir e a vontade de ficar couberam no mesmo passo.
E ela desceu.

## Cena final — um lugar para descansar

**Atuação:** após as quatro nuvens finais e a conclusão da perseguição, transição para a clareira ilustrada inteira. Yuna chega exausta, abaixa-se e se senta na toalha, ao lado dos amigos. Ombros relaxados, pernas descansando, rosto cansado com pequeno sorriso. Sem sofrimento exagerado. Urso com lenço, dinossauro verde, robô vermelho e trem preservados. Nanda pousa e se senta ao lado de Yuna; suas asas descansam. Ela tem um pão e um copinho de suco de laranja, cada um na escala de sua mãozinha. Nada fica suspenso sobre o chão ou a toalha.

**Narração**

Quando a toalha apareceu, Yuna soltou um suspiro comprido.
Tinha trazido o jardim inteiro nas pernas.

Sentou-se devagar entre os amigos. Por um instante, só ficou ali, sentindo o chão quietinho debaixo dela.

**Yuna, sem fôlego**

— Cheguei… mas minhas pernas ainda estão correndo.

**Fada**

— Então deixa que elas descansem. Hoje eu sento aqui.

**Narração**

Nanda pousou ao seu lado e dobrou as perninhas.
Para ela havia um pão do tamanho de sua mãozinha e um copinho de suco miudinho. Um piquenique inteiro cabia naquele pedacinho de toalha.

Yuna segurou seu pão com as duas mãos.

**Yuna**

— O jardim foi bonito. E foi muito.

**Fada, baixinho**

— Eu sei.

**Narração**

As folhas continuaram conversando lá no alto.
O pão estava morno. O suco, fresquinho.

Por enquanto, Yuna não precisava dar mais nenhum passo.
Ficou ali, comendo devagar, com a fada sentada ao seu lado.

## Continuidade e preparação da integração

- Antes da fala de convite, interface, legenda e narração voltadas ao jogador continuam dizendo “menina”; nenhum título antecipa a revelação. A primeira ocorrência diegética de “Yuna” é a fala literal da fada. Depois dela, usar “Yuna” nos novos textos e nas referências futuras à personagem.
- Nanda é o nome já existente da fada; não confundir a revelação de Yuna com uma renomeação da fada. Identificadores técnicos legados não precisam ser renomeados para revelar o nome ao jogador.
- O convite tem entusiasmo; a resposta ao desconforto tem acolhimento. Não atribuir diagnóstico, não minimizar sensações nem exigir que Yuna deixe de ter medo para merecer o piquenique.
- A abertura acontece na saída da casa, antes de liberar a travessia. Preservar a escada assentada e o fluxo de saída já existentes ao preparar a integração.
- O encerramento conserva a clareira inteira aprovada, chão contínuo, toalha apoiada e separação das raízes. A nova atuação sentada substitui, nessa proposta de encerramento, a menina chegando em corrida e a fada pairando.
- Ilustrações inteiras, sem texto embutido: falas e narração devem poder ser apresentadas separadamente, com leitura confortável em desktop, retrato e paisagem. Não desenhar sprites ativos duplicados sobre personagens já pintadas.
- Estes quadros são cenas narrativas; não alteram a câmera de gameplay, a física, os apoios ou o desenho da fase. Não tratá-los como novos sprites jogáveis.
- A nova atuação da menina exausta e da fada comendo está solicitada; o acabamento destas novas imagens e as falas propostas ainda aguardam avaliação do usuário. A aprovação anterior da clareira v2 permanece preservada e não certifica automaticamente esta variante.
