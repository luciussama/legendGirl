# Auditoria da dificuldade dos saltos no NORMAL

Sessão: `20261019T023417-7d4a862551ef` (18/10/2026 no horário de São Paulo). Solicitação: verificar se os saltos do quarto escuro ficaram mais fáceis por regressão. O responsável confirmou que jogou no NORMAL; não testou o FÁCIL. Dispositivo e trecho específico não foram informados.

## Conclusão

Não foi encontrada redução recente da dificuldade dos saltos por alteração de código. Os ajustes da luta não modificaram os módulos de física, configuração, input da plataforma ou seleção de dificuldade. Os testes atuais mantêm o NORMAL compatível com a referência anterior. Isso não certifica que o balanceamento existente seja suficientemente desafiador: a medição mostra janelas generosas em vários saltos iniciais do próprio NORMAL.

Nenhum parâmetro de dificuldade foi alterado nesta investigação.

## Comparação com o histórico

- `src/js/config.js` é idêntico, byte a byte, à revisão imediatamente anterior à introdução do FÁCIL (`3744a8d^`, de 07/10). SHA-256 em ambas: `97b49d0262b1ace2c747c0d19d39afeae59f3c05814e87f88d2f9b5b0b8757c4`. Inclui personagem, gravidade, impulsos, velocidades progressivas e geometria dos apoios de ida/retorno.
- `src/js/game.js`, `config.js`, `state/GameDifficulty.js`, `main.js`, `input.js` e `controllers/InputController.js` não têm diferenças entre o workspace e HEAD (`a068e6e`). Portanto, as alterações pendentes da arena não mexeram nesses arquivos.
- `PlayerController` e `ArenaPlayerController` alterados na luta pertencem à Toy Room/arena; o quarto escuro aplica sua física em `game.js` e recebe os parâmetros de `config.js`.
- `test:difficulty` compara a seleção de pouso real extraída de produção com a referência NORMAL, incluindo as duas direções/fases, bordas, alturas e velocidades. Também compara trechos de salto e integração física, normalizando apenas os acessos a campos migrados pela refatoração.

## Valores atuais

| Regra | NORMAL |
| --- | --- |
| Movimento inicial | 1,42 unidades/quadro |
| Gravidade | 0,28 |
| Impulso inicial | −7,2 |
| Pouso comum | Sobreposição horizontal do corpo; pés de 0 a 16 unidades abaixo da superfície; movimento descendente |
| Impulso na fuga | −7,2 a −9,3 por nível |
| Velocidade aérea na fuga | 1,85 a 4,08 por nível |
| Impulso no retorno | −7,4 a −9,6 por nível |
| Velocidade aérea no retorno | −2,6 a −7,2 por nível |

Não há ajuste automático de mira nos saltos comuns. Existe uma exceção explícita e antiga: castelo → pista do trem. O código calcula a velocidade para alcançar o próximo centro e garante o pouso durante a descida. O histórico aponta essa assistência desde `41ce5f1`, em 24/09; ela também vale no NORMAL. É uma facilidade localizada, não um efeito novo da arena.

## Janelas medidas no NORMAL

`verify:dark-room` percorreu as saídas reais em sequência e mediu o intervalo de acionamento que alcança o próximo apoio. Valores em simulação de 60 Hz, dt=1, escolhendo o meio da janela anterior:

| Destino | Janela de acerto aproximada |
| --- | ---: |
| Cabeça do Urso | 1.167 ms |
| Pilha de Livros | 850 ms |
| Penteadeira | 783 ms |
| Cômoda Pequena | 800 ms |
| Blocos ABC | 433 ms |
| Tambor | 317 ms |
| Almofadão | 367 ms |
| Gavetas | 350 ms |
| Caixa de Música | 867 ms |
| Castelo | 533 ms |

Assim, o desafio inicial não cresce de maneira uniforme: a Caixa de Música volta a oferecer uma janela maior depois de apoios mais restritivos. O primeiro salto aceita cerca de 1,17 segundo de variação no momento do comando. Isso pode explicar a sensação relatada mesmo sem regressão recente.

Na fuga depois do trem, o teste confirmou que a janela temporal diminui progressivamente. Pela quantidade de posições válidas e a velocidade de corrida, a estimativa passa de aproximadamente 676 ms para a prateleira até 176 ms para o pedestal final (dt=1, amostragem espacial de uma unidade). Essa estimativa não inclui o salto assistido de saída do castelo e não substitui medição humana.

O retorno também conserva a configuração histórica. Seus primeiros apoios foram desenhados com margem generosa, conforme os comentários da configuração. Esta investigação não produziu uma nova tabela temporal completa do retorno; a comparação de colisões cobre seus 16 apoios, e a geometria/atributos permanecem idênticos à referência.

## FÁCIL e persistência

Somente `gameDifficulty === 'EASY'` ativa assistência extra: quatro unidades laterais por borda e profundidade de pouso de 24, contra 16 no NORMAL. Não existe ativação automática baseada em derrotas. Continuar conserva a dificuldade salva; saves antigos ou inválidos usam NORMAL. Como o responsável confirmou NORMAL, o FÁCIL não foi tratado como causa da partida relatada.

## Verificações executadas nesta sessão

- `npm run test:difficulty`: aprovado; 10.640 comparações de pouso NORMAL com a referência anterior e 3.063 casos adicionais recuperados exclusivamente pelo EASY na malha de teste. Esses casos não são participantes, tentativas de jogo nem taxa de sucesso humana.
- `npm run verify:dark-room`: aprovado; 1.153 verificações de colisão/renderização, geometria/configuração preservadas, 66 combinações de transição/dt, nove percursos contínuos e janela temporal progressivamente menor na fuga. A suíte também validou contatos dos pés, poses e guia da fuga.
- Comparação Git/hashes dos módulos relevantes e `git diff --check`: aprovados.

Os logs foram preservados pelos registros de QA no diário. Os dados de comparação estão em `20261018-auditoria-saltos-normal.json`.

## Consequência para o balanceamento

Restaurar o desafio exige decidir sobre o balanceamento já existente no NORMAL, sobretudo as janelas iniciais e a exceção castelo→trem. Não há evidência que justifique reverter a luta ou aplicar uma correção automática de física. Também não se pode inferir a dificuldade percebida apenas porque um agente determinístico conseguiu concluir o percurso.
