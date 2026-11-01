# Capítulos e passagem para o sonho

Direção recebida em 29/10/2026. A separação narrativa mantém as fases existentes e acrescenta as cenas abaixo. Cenas, textos e apresentação aprovados pelo usuário em 29/10/2026, após a correção do encerramento pela bandeira. A fase do sonho e seu desfecho foram implementados nas revisões de30/10 abaixo.

## Capítulo 1 — Quarto de brinquedos

Depois de a menina levantar da cama, começa a música de fundo. Antes de liberar a primeira fase, a pintura do quarto apresenta **CAPÍTULO 1 - Quarto de brinquedos**. O capítulo reúne a aventura atual até o fim da perseguição do urso.

Depois de guardar o urso, o quarto reaparece arrumado, com o baú fechado e nenhum brinquedo ou objeto solto no chão. A menina está cansada. Nanda diz: “Ufa, conseguimos. Guardamos os brinquedos a tempo. Agora podemos brincar.”

O narrador acompanha a mudança de expressão:

> A menina sorriu.
> De canto a canto, passeou os olhos pelo quarto.
>
> Onde antes havia brinquedos, agora havia espaço.
> O sorriso ficou pequeno. Uma pergunta cresceu no lugar.

A menina pergunta: “Mas… agora todos os brinquedos estão guardados. Como vamos brincar? Vamos pegar os brinquedos de novo?”

Nanda leva a mão à testa. O plano silencioso conserva seu tempo enquanto a câmera se aproxima dela. Em seguida, abre a gravura do jardim.

## Capítulo 2 — Dia de piquenique no jardim

A gravura apresenta **CAPÍTULO 2 - DIA DE PIQUENIQUE NO JARDIM**. Seguem a saída de casa, o percurso e o piquenique existentes. Nanda continua revelando o nome de Yuna na entrada do jardim.

Depois das falas atuais, Yuna come mais pão na chapa e bebe suco de laranja. O narrador conduz o sono:

> Veio outro pão na chapa. E mais um gole de laranja.
> Na toalha, a tarde foi ficando macia.
>
> A barriga ficou quentinha. As pálpebras, pesadas.
> Yuna tentou guardar um último sorriso.
>
> O sono chegou sem fazer barulho.
> Nanda dobrou as asas e se aconchegou ao lado dela.
>
> Lá fora, o jardim continuou do mesmo tamanho.
> Dentro do sonho, uma folha já podia ser floresta.

As duas ficam adormecidas na toalha, com respiração discreta. Não inventar um botão de saída ou um combate para encerrar a cena.

## Direção atual do sonho — revisão de 30/10/2026

O usuário substituiu o plano de jardim 3D por uma **floresta lateral 2D**, considerando o orçamento de GPU. A meta escolhida é cerca de cinco minutos. A travessia é primariamente aérea: Yuna agarra e escala gramas paralelas que curvam com o vento, espera a aproximação e salta entre elas. Insetos gigantes funcionam como plataformas móveis escaláveis. Um trecho usa quatro besouros que partem com Yuna e fazem viagens curvas até o próximo apoio. Depois da folha aprovada após as abelhas, seis aranhinhas descem e sobem deixando seda escalável; tocar no corpo causa dano e queda. A travessia exige sincronizar saltos e termina no grande galho de árvore. Depois do galho, uma folha vira planador: avanço automático, inércia vertical e grandes mudanças de altitude entre espinhos. Não há combate, espada nem pisão ofensivo.

A atmosfera é de sonho, com pintura de floresta gigantesca e luz azulada, mística e levemente spooky. A trilha é **Misty Blues.mp3**, enviada pelo usuário, em loop. Esta decisão substitui os antigos requisitos de 3D e de furtividade como mecânica principal; eles não devem reaparecer por leitura de versões históricas.

## Contrato das novas cenas

As gravuras duram cinco segundos e permitem adiantar a leitura. As falas do epílogo usam 7, 6, 7 e 8 segundos; o facepalm silencioso dura 4,5 segundos. As quatro falas novas do piquenique duram sete segundos cada. O avanço automático continua ativo; clique/toque ou Enter adianta somente o quadro visível, consumindo o gesto. O facepalm não é abreviado pelo avanço de fala.

Pausa congela os relógios; a cena de organização guarda índice e idade no save. A revisão 11 do jardim retoma o sono novo em saves já concluídos da revisão 10, preservando o percurso e as falas já lidas. Os relógios narrativos não avançam física nem corrigem câmeras de gameplay.


## Passagem para a floresta

Depois de `GardenPhase` chegar a COMPLETE/endingDone, as duas permanecem dormindo por quatro segundos. `ToyRoomPhase` entrega o controle a `DreamPhase`, preservando a origem campanha/prévia. A nova fase tem simulação, controles, áudio, pausa, checkpoint, save/restore e descarte próprios. Saves antigos do piquenique continuam válidos e alcançam o sonho por essa passagem. O seletor “Jardim dos sonhos” permite revisar a entrada sem alterar a campanha salva.

O final do voo conduz agora à floresta escura e ao despertar descritos abaixo. Não há capítulo3 adicional. Consulte o [guia da floresta](../dream-forest/GUIA-SONHO.md) para controles e contratos.


## Final do pesadelo — direção de 30/10/2026

A aprovação do usuário cobre a entrega até os espinhos. Depois deles, Yuna cai numa floresta com pedras grandes. A câmera se aproxima durante o corte e passa a enquadrar a caminhada no chão. Uma barata enorme ocupa o fundo e patrulha a área; seus olhos projetam luz e as pedras bloqueiam os feixes, formando sombras que escondem a menina. Ser iluminada causa um golpe da barata e game over, com retomada local.

Depois da última pedra, Yuna encontra uma área sem abrigo. A atuação assume o controle: ela para, vê a barata avançar e é alcançada. No exato instante da captura, corta para a toalha do piquenique. Yuna acorda com um grito de susto; Nanda desperta logo depois, acordada por ele. O instante inicial do grito dura1,5s e não pode ser abreviado. Seguem os quadros:

- Narrador,5s: “O susto saiu num grito. Nanda abriu os olhos.”
- Nanda,5s: “Yuna… estou aqui.”
- Narrador,7s: “Era a toalha. Era o sol. O pesadelo tinha ficado do outro lado do sono.”

Um gesto adianta somente o quadro atual. A captura final tem6s obrigatórios e não é uma derrota. Após a última fala, a composição permanece viva com as duas acordadas. Esse final substitui o repouso provisório entre galhos; não muda as cenas anteriores do sono ou o percurso aprovado.

### Revisão do final do sonho — 30/10/2026

Após pousar, a música para. Yuna anda olhando para os lados: “Será que os bichos foram embora?” O narrador diz: “Um cheiro repugnante aparece no ar. Cheiro de comida que ninguém quer, cheiro de luz apagada, cheiro de vontade de ir pra casa, cheiro de tristeza.” A barata aparece; começa Bug attack, trilha contínua até a captura. A aproximação tem8s próprios, independentemente da faixa.

Yuna se esconde agachada junto às pedras e troncos, mãos nos ouvidos, e anda encurvada na ponta dos pés. Salta para subir relevos naturais, sempre sustentados por terra contínua. Na parte final da perseguição, mergulha nas poças de lama para escapar dos olhos luminosos. Somente ao acabar o caminho e faltar qualquer abrigo ocorre a captura autorada, seguida do grito no piquenique que acorda Nanda. Tempos, leitura e controles detalhados no guia do sonho.

Na floresta do sonho, a saída completa pela margem direita do quarto lago dispara imediatamente a cena em todo o canvas: Yuna caminha sozinha no escuro, a barata surge e a pega. O instante da captura corta diretamente para Yuna acordando na toalha do piquenique. A luz dos olhos tem laterais difusas, penumbra nos abrigos e reflexo sobre a lama.

O final do pesadelo corta do último lago para uma cinemática na altura dos olhos, em cenário próprio: Yuna caminha sozinha (0–2,2s), olha para trás (até3,1s), o rosto enorme da barata é revelado em close (até4,1s), e a criatura avança e a captura (até6s). Corte direto para a toalha de piquenique. Esse plano não desenha o mapa, as poças nem os controles da exploração.


### Chegada à barata — revisão de31/10/2026

Após os espinhos, a folha pousa num planalto. Yuna solta a folha e fica em terra antes do corte cinematográfico, quando Bug attack começa. Mantidas as falas de dúvida e cheiro repugnante, a barata sai por trás das árvores; Yuna olha, se assusta, corre e se esconde numa pedra. A perseguição jogável começa nesse abrigo. Poeira, impactos e tremor mostram o peso da criatura, com contato final mais forte e o despertar já estabelecido.


Após os espinhos do voo, o vento termina: Yuna se preocupa, perde a folha e cai no meio de terra firme. Ela amortece o pouso e se levanta, antes da caminhada e da revelação da barata já autoradas. A futura abertura do sonho com Nanda do mesmo tamanho foi apenas solicitada como próximo passo no diário humano; não é uma cena implementada nesta revisão.


## Abertura do sonho — implementada em 01/11/2026

Sem música, um zunido discreto acompanha a floresta fria. Yuna olha para trás e encontra Nanda dormindo, com o mesmo tamanho dela. A menina ajoelha e balança a irmã.

— Nanda, onde estamos? Está frio aqui.

Nanda não responde. Depois de uma pausa, Yuna insiste:

— Nanda, estou com medo! Me fale como sair daqui.

Perdida sem a orientação da irmã fadinha, Yuna hesita e decide seguir sozinha, deixando Nanda dormindo. A música começa no escurecimento final e a jogabilidade assume. A cena possui sete momentos de3/6/7/3/7/8/4s, com leitura automática e avanço individual que conserva o mínimo dos gestos.

## Brinquedão: o convite depois do pesadelo

Depois de acordar do susto, Yuna continua abraçada a si mesma, assustada e desanimada: “Eu não gostei daquele sonho…”. Nanda a tranquiliza: “Eu estou aqui, Yuna. Já passou.” Para animá-la, convida: “Vamos ao Brinquedão? A gente pode escorregar e mergulhar nas bolinhas!” Yuna pergunta se a irmã vai junto. Nanda promete acompanhá-la até o último escorregador. A música começa nesse convite. O jardim é alegre e ensolarado; Nanda tem novamente seu tamanho habitual.

A cinemática corta do piquenique para o brinquedão, com atuação em camadas e leitura automática. O circuito começa em passarelas acolchoadas coloridas, desce em escorregadores até piscinas de bolinhas e atravessa pontes de madeira. A chegada encerra esse passeio com a narração “Entre uma ponte e um escorregador, o dia voltou a caber num sorriso.” Não há um capítulo posterior definido por esta implementação.

### Continuação do passeio: camas elásticas e castelos

Ao terminar a corrida inicial, Yuna desce por um escorregador gigante até um conjunto de camas elásticas. Os impulsos levam às torres de castelo acolchoadas; as pontes cedem sob os pés. Da terceira torre, a queda encontra outro escorregador e um painel elástico lateral que devolve energia para a rampa reversa. O lançamento leva ao céu, até camas e castelos mais altos.

O jogador controla direção e altura dos impulsos, atravessa pontes antes de caírem e salta vãos. Errar os apoios e cair do brinquedão causa Game Over; a tentativa volta ao último terraço alcançado. Não há cinemática intermediária que retire esse controle nem capítulo posterior definido por essa extensão.

### Uma segunda chance antes de cair do Brinquedão

Abaixo das torres, Yuna pode encontrar plataformas e escorregadores de recuperação. Calhas inferiores têm camas elásticas nas paredes: o embalo a devolve de uma lateral à outra, subindo e descendo antes de recuperar a direção. Frear e saltar pela borda dá acesso a patamares e lonas que a lançam de volta às torres. Perder também esses apoios ainda causa Game Over. Essa recuperação acontece na jogabilidade, mantendo a sensação de descontrole.


Antes da chegada do Brinquedão: três seções internas, cada qual com três tubos de curvas rápidas e três piscinas de bolinhas com peixinhos de brinquedo. A velocidade dá lugar à espera e ao controle dos saltos. Dois acertos encerram a tentativa; a retomada é na piscina atual. Só depois da nona piscina Yuna volta ao jardim.
