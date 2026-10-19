# Progressão dos saltos após o clímax — 18/10/2026

Sessão: `20261019T024019-e67b866342e7`. O responsável autorizou preservar o castelo como repouso e as primeiras margens generosas, reduzindo a tolerância gradualmente, sobretudo após a queda da porta falsa. Alterações anteriores da arena foram preservadas. Sem commit, push ou publicação.

## Implementação

`config.js` concentra os alcances fixos da aproximação em `getApproachJumpSpeed` e os do retorno em `getPhase3Stats(level, fromFloor)`. `game.js` consulta esses valores ao iniciar o salto. Cada saída tem velocidade aérea fixa, independente da posição do comando.

Os dois primeiros saltos conservam as velocidades e margens. As saídas seguintes exigem maior precisão, eliminando o aumento de tolerância na Caixa de Música. Castelo, pausa e saída assistida para o trem foram preservados, assim como a progressão da fuga posterior ao trem.

Após a porta falsa, a curva nominal do NORMAL passa de aproximadamente 456 ms na entrada a 100 ms na chegada ao portal. A entrada pelo chão tem alcance próprio, separado do salto entre o primeiro e o segundo apoio. Gravidade, impulso vertical, corrida, câmera, geometria/hitboxes e artes conservam os valores anteriores. A velocidade horizontal aérea muda, produzindo saltos mais curtos em algumas saídas. A assistência adicional de pouso do EASY continua disponível.

## Medições

Varredura das posições válidas sobre cada apoio usando os trechos reais de salto, integração e pouso. Os intervalos espaciais são convertidos em tempo pela corrida a 60 Hz, dt=1; não representam tempo de voo. Amostragem de uma unidade e arredondamento podem diferir alguns milissegundos de medições de percurso contínuo.

| Destino | Antes | Depois |
| --- | ---: | ---: |
| Primeiro apoio | 1.162 ms | 1.162 ms |
| Segundo apoio | 845 ms | 845 ms |
| Caixa de Música | 845 ms | 223 ms |
| Castelo | 528 ms | 188 ms |
| Primeiro apoio após a porta falsa | 1.053 ms | 456 ms |
| Sexto apoio do retorno | 615 ms | 283 ms |
| Décimo apoio do retorno | 361 ms | 195 ms |
| Décimo quinto apoio do retorno | 153 ms | 118 ms |
| Chegada ao portal | 86 ms | 100 ms |

Janelas do retorno, na ordem: **456, 412, 381, 345, 312, 283, 256, 232, 216, 195, 176, 164, 148, 132, 118 e 100 ms**.

O último salto era um gargalo de aproximadamente 86 ms; foi ajustado para 100 ms, enquanto os anteriores ficaram mais restritivos. Nos extremos de dt, o teste admite variação de até 20 ms entre apoios vizinhos devido à discretização, sem permitir novos aumentos grandes de tolerância. A comparação completa está no JSON associado.

## Validação realizada

- `npm test`: aprovado, incluindo a nova regressão `test:saltos:progressao`, combate, tutorial, persistência, arte e controles existentes.
- `test:saltos:progressao`: 26 saltos × NORMAL/EASY × dt 0,5/1/1,2 = 156 combinações; saídas viáveis, início acessível e retorno progressivo.
- Verificador do quarto: trajetos contínuos e transições em três dt aprovados, com as verificações de castelo e fuga preservadas.
- `test:jogabilidade:browser`: seis campanhas completas, NORMAL/EASY × desktop/Android/iPhone; 228 apoios percorridos, investigação, espada, quatro inimigos, saves intermediários e retorno. As verificações de exceções e carregamento de recursos passaram.
- Build, sintaxe dos módulos alterados e `git diff --check`: aprovados.

As comparações históricas de física permitem somente as alterações autorizadas de alcance: aproximação e distinção da entrada pelo chão no retorno. Colisão, gravidade, impulso vertical, bloqueios de entrada e parâmetros da fuga continuam protegidos. Referências históricas imutáveis não foram sobrescritas. A regressão da curva integra a suíte padrão.

## Fontes e manutenção

- `src/js/config.js`: tabelas `APPROACH_AIR_SPEEDS` e `PHASE3_AIR_SPEEDS`, `getApproachJumpSpeed` e `getPhase3Stats`.
- `src/js/game.js`: seleção do alcance no início do salto.
- `docs/diario-ia/qa/fisica-janelas-saltos.js` e `testar-progressao-saltos.js`: medição e proteção da curva.
- `docs/diario-ia/qa/calibrar-janelas-saltos.js`: calibração em memória; não altera produção automaticamente.
- Fontes atualizadas do verificador e de dificuldade no diário; versões anteriores preservadas nos pacotes.

Guias de arquitetura, métodos, desenvolvimento e comandos foram atualizados. Os resultados detalhados estão no JSON associado e nos registros de QA.

## Limites

Os perfis móveis são emulados no Chrome. A dificuldade percebida, a ergonomia e a sensação dos saltos mais curtos precisam de nova rodada humana, especialmente nos apoios finais do retorno. A aprovação determinística prova viabilidade técnica; não representa um jogador aprendendo sem estratégias conhecidas.
