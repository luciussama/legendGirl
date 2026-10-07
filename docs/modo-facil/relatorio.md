# Modo FÁCIL — implementação e validação

Data: 07/10/2026. Mapeamento prévio: [mapeamento.md](mapeamento.md).

## Implementação

A tela inicial permite escolher NORMAL ou FÁCIL antes de começar. A campanha salva conserva a escolha ao continuar; uma nova dificuldade pode ser escolhida no diálogo de RECOMEÇAR. O save armazena `state.gameDifficulty` como `NORMAL` ou `EASY`. Saves anteriores e valores desconhecidos usam NORMAL. A dificuldade é restaurada antes de construir a Toy Room.

Somente `EASY` habilita margem de pouso de quatro unidades por borda e janela vertical de 24 unidades. O resolvedor continua exigindo pés no topo ou abaixo dele, velocidade vertical não negativa e proximidade horizontal do apoio. Não altera `baby.x`, não gera impulso, não completa saltos e não permite pousar durante a subida. A resolução vertical continua sendo a resolução normal de contato com o topo.

Na Toy Room, a fadinha se aproxima do alvo já selecionado mais rapidamente. A seleção continua sendo o brinquedo disponível mais próximo; coleta, transporte, colisão e armazenamento continuam manuais. A ilustração das plataformas permanece intacta, sem marcações de apoio ou hitboxes visíveis.

## Comparação final

| Sistema | NORMAL | FÁCIL | Diferença |
| --- | --- | --- | --- |
| Geometria e desenho das plataformas | Atual, 100% | Atual, 100% | Nenhuma |
| Margem horizontal de contato | Sobreposição estrita | Mais 4 unidades por borda | +8 unidades de intervalo total |
| Janela vertical de pouso | 16 unidades | 24 unidades | +8 unidades (+50%) |
| Guia da Toy Room, resposta por frame em `dt=1` | 12% da distância ao alvo | 20% | +8 pontos percentuais |
| Gravidade, velocidade e impulso de salto | Atuais | Atuais | Nenhuma |
| Checkpoints e retries | Atuais | Atuais | Nenhuma |
| Abertura, tutorial, castelo, porta falsa, portal e diálogos | Atuais | Atuais | Nenhuma |
| Exploração e organização dos brinquedos | Manuais | Manuais | Nenhuma |

## Sistemas alterados

Menu e diálogo de nova campanha (`index.html`, `main.js`, estilos dos novos controles), schema e migração do save (`StateVariables.js`, `CampaignProgress.js`), política isolada (`GameDifficulty.js`), alternativa de pouso condicionada em `game.js` e interpolação da fada em `ToyRoomPhase.js`. Também foram adicionados testes e uma referência congelada de NORMAL.

## Sistemas preservados

Configuração das plataformas, gravidade, salto, integração do movimento, progressão de velocidade, obstáculos, checkpoints, punições existentes, câmera, cenas, narrativa, áudio, renderizadores de plataformas, mecânicas de coleta e organização. A assistência histórica do castelo para o trem continua exatamente como antes; esta implementação não adiciona teletransporte.

## Evidências e testes

- `npm test`: aprovado. Inclui 1.153 verificações de colisão/renderização, 66 combinações de salto e passo de tempo, 5.280 contatos dos pés, pausa de 300 frames no castelo, referência de física, persistência, enquadramento e tutorial.
- `npm run test:difficulty`: aprovado. Compara 10.640 cenários de pouso de NORMAL contra o código anterior congelado em `tests/fixtures/game-difficulty-normal.json` (referência `5c94ad4`). Resultados e coordenadas coincidem. EASY recuperou 3.063 casos sintéticos de erros pequenos; essa contagem não representa taxa de sucesso de jogadores.
- O mesmo teste executa a guia real da Toy Room, saves das duas fases nas duas dificuldades, restore, nova instância de armazenamento, migração de saves antigos e valores inválidos. Confirma que a guia não organiza brinquedos automaticamente.
- `node scripts/test-opening-sequence.js`: aprovado.
- `node scripts/test-toy-room-introduction.js`: aprovado.
- `node scripts/test-toy-room-tutorial.js`: aprovado.
- `node scripts/test-toy-room-orientation.js`: aprovado.
- `tests/game-difficulty.html`: campanha real executada no Chrome para NORMAL e EASY, com abertura, tutorial, 22 apoios de ida, 16 de retorno, castelo, porta falsa, verdadeiro portal, Toy Room e save/restore de produção. Os oito brinquedos foram buscados por caminhos navegáveis e guardados por ações de coleta/transporte, em cada modo. A instrumentação procura momentos de salto por tentativas restauradas; é um teste automatizado de alcance e progressão, não um playtest humano.
- Interface de produção: NORMAL aparece como padrão; FÁCIL pode ser selecionado e iniciado. Após recarga real da página, o menu mostra FÁCIL e CONTINUAR, com a escolha bloqueada para preservar a campanha salva.
- A campanha automatizada também recarregou o documento do jogo nos dois modos: dificuldade, Toy Room e oito brinquedos organizados foram restaurados. Resultado registrado em `docs/qa/modo-facil/campanha-browser.json`: `APROVADO`, com os 76 saltos e as etapas de cada modo.
- `node --check` dos scripts alterados e `git diff --check`: aprovados.

Os logs locais de `npm test` e `test:difficulty` estão em `docs/qa/modo-facil/`. Essa pasta segue a regra existente de evidências regeneráveis e é ignorada pelo Git. A página de QA apresenta seu resultado e o percurso em texto.

Para reproduzir a evidência de navegador, execute `node scripts/serve-difficulty-qa.js` e abra `http://127.0.0.1:3019/tests/game-difficulty.html?report=1`. O servidor de QA escreve o resultado localmente e escuta apenas em `127.0.0.1`. A origem/porta é exclusiva do teste; o teste reinicia campanhas nessa origem.

## Confirmação e decisão

NORMAL mantém o mesmo código de salto e integração física, os mesmos parâmetros e os mesmos resultados de contato em todos os cenários comparados. A campanha completa nos dois modos chegou ao final da Toy Room. A mudança visível comum é a escolha de dificuldade no menu e a nova chave no save.

Aprovação técnica da implementação; sem rollback. A preferência de jogadores experientes e a eficácia para diferentes necessidades de acessibilidade exigem playtests com pessoas; os testes automatizados não comprovam essas preferências. As assistências pequenas podem ser calibradas futuramente exclusivamente na política EASY, preservando a referência NORMAL.

Para desligar as assistências sem alterar saves, faça os parâmetros EASY coincidirem com os atuais de NORMAL em `GameDifficulty.js`. Para desfazer a implementação, reverta somente os arquivos da dificuldade, preservando qualquer trabalho independente de narrativa.
