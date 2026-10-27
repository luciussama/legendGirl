 # Padrão vigente de diálogos e cenas

Decisão explícita do usuário em 26/10/2026, na sessão `20261026T181721-3f1802024697`. Aplica-se ao jogo inteiro e a novas fases. Substitui a resposta anterior do quiz que mantinha as cenas do jardim esperando indefinidamente uma interação. O histórico dessa resposta não deve ser reescrito.

## Comportamento de leitura

- Toda fala de personagem ou narrador avança automaticamente ao terminar seu tempo autorado. Clique/toque permite adiantar **um balão**, antes desse prazo. Ler não exige clicar.
- Preservar os tempos existentes de cada sequência. Não trocar todas as falas por uma duração única, nem aumentar a velocidade de gameplay para compensar leitura.
- Na ausência de tempo autorado, usar quatro segundos como ponto inicial, coerente com o aviso de entrada da sala de brinquedos. O acolhimento de retomada da fada, antes sem prazo, usa esse tempo. Textos extensos precisam de tempo próprio definido e registrado.
- Durante gameplay, clicar no próprio quadro dispensa/adianta a fala; controles de pulo, direção e ação continuam independentes. Nas cenas bloqueadas para leitura, o clique pode ocorrer em qualquer parte do canvas.
- Um gesto avança uma vez; segurar não atravessa falas. Consumir a entrada para não produzir salto, ataque, coleta, organização de brinquedos ou movimento na volta ao controle.
- O quadro desaparece depois da última fala temporizada. A atuação/cena final pode continuar: o piquenique permanece animado, sem inventar botões de saída ou próxima fase.
- A opção de pular uma cena inteira já vista é separada do clique de avançar um balão. Preservar essa opção onde existe. Tutoriais que exigem executar uma ação, HUD, indicadores de controle, erros e menus não são balões de história: dispensar texto não executa a ação nem ignora o desafio.

## Tempos e referências existentes

| Sequência | Temporização autorada que deve ser preservada |
| --- | --- |
| Despertar no quarto | Falas em 4–9, 10–13, 14–20, 21–24 e 25–29 segundos; ações/revelação posteriores conservadas. |
| Entrada da sala | TR_004 e TR_005: 4 s cada; TR_006: duas falas de 3,1 s com intervalo de 0,8 s; TR_007: 2 s. |
| Retorno dos brinquedos | 1 s e 4,5 s, com intervalo de 0,5 s. |
| Investigação/espada | Tempos por beat em `ToyRoomStory.js`; preservar também ações silenciosas e revelação da espada. |
| Castelo e porta falsa | Relógios existentes em `DarkRoomNarrative.js`; clique separa narrador inicial de 210 ticks e a fala seguinte, sem saltar as duas juntas. |
| Jardim: saída de casa | 5, 5, 5, 6, 8, 5, 5, 5 e 6 s. |
| Jardim: piquenique | 6, 6, 5, 5, 8, 5, 4, 3, 6 e 8 s. |

Ticks dessas sequências legadas representam a base autorada de 60 Hz; não confundir com segundos. O jardim usa segundos. Pausa/perda de foco segue o contrato da fase e suspende os relógios de leitura; não usar `setTimeout` para avançar falas do jogo.

## Apresentação e atuação

Preservar o tom poético, identidade e roupa dos personagens, revelação do nome de Yuna por Nanda e a estética da fase. Usar atuação e cenário em camadas quando esse é o padrão da cena, evitando substituir uma cena animada por texto sobre imagem fixa.

O quadro de diálogo deve ser a moldura visível sobre a ilustração. Não acrescentar uma tarja branca sob ele. Comandos de leitura devem ser discretos e fazer parte do quadro, quando necessários. Conferir área segura, botões globais, rostos e próximos apoios em desktop/retrato/paisagem.

Relógio de atuação e progresso da fala são responsabilidades distintas. Antecipar texto não avança física, colisão, dano, combate, resgate, relógio de nuvem ou duração da perseguição. A câmera de gameplay permanece somente lateral; enquadramentos narrativos não corrigem saltos.

## Implementação compartilhada

`src/js/narrative/DialogueFlow.js` registra os quadros visíveis por canvas e consome `pointerdown` em captura. `beginDialogueFrame`/`endDialogueFrame` tratam composições aninhadas; quadros ausentes não deixam entradas antigas ativas. Medições em canvases virtuais não registram controles.

`PoeticNarrator` e `DialogueRenderer` usam esse contrato. `game.advanceDialogue` encaminha a leitura ao dono atual: `OpeningSequence`, `ToyRoomIntroduction`, história da sala, cenas do quarto ou jardim. Cada dono conserva suas transições e seus tempos. Uma mensagem informativa isolada pode ser dispensada visualmente, conservando a ação que a originou. Mensagens futuras com vários balões precisam fornecer o avanço ao próprio controlador; não criar um segundo listener concorrente.

No jardim, Enter/Espaço e gamepad já existentes continuam disponíveis. O clique/toque padrão não depende deles. Persistir índice da fala e tempo restante/decorrido no domínio quando a fase já oferece save; não salvar DOM, callbacks, imagens ou listeners. Restaurar não deve mudar checkpoint, posição da menina ou inimigos por uma mudança de leitura.

## QA obrigatório

1. Observar a sequência sem clicar e verificar cada prazo e o encerramento automático.
2. Clicar/tocar antes do prazo: verificar exatamente uma próxima fala, incluindo narrador e personagem.
3. Conferir ausência de salto/ataque/coleta involuntários e que um próximo clique de gameplay continua funcionando.
4. Testar pausa/foco, save/load, cena já vista e repetição de encontros.
5. Inspecionar os quadros intermediários de entrada e saída, não apenas os estados inicial/final. A regressão da tela branca do jardim apareceu justamente durante a descida de três segundos.
6. Executar pelo diário em ambiente temporário; preservar fontes, resultados e metadados de capturas. Não atribuir aprovação artística humana a testes técnicos.
