# QA-Gameplay-001 — Aproximação da porta falsa

Data: 30/09/2026. Referência anterior: commit `1d11d1e`.

## Diagnóstico

O QA localizou a ocorrência na última plataforma antes da porta falsa. A reprodução separou dois eventos: o salto do beiral (20) ao pedestal (21) e a aproximação da porta após pousar.

**Não foi reproduzida falta de alcance físico no salto 20 → 21.** Foi reproduzida derrota pela câmera depois de um pouso válido: a rolagem continuava a 3,75 unidades por quadro, enquanto a personagem caminhava a 2,75. No percurso contínuo de referência, a câmera ultrapassava a menina antes do gatilho da porta, situado em `x = 4760`, disparando `onLagBehind`.

Exemplo antes da correção: saída em `x = 4343,428`, pouso em `x = 4612,708`, derrota em `x = 4722,708` com câmera em `x = 4748,623`. O jogador tinha alcançado o apoio, mas ainda faltavam aproximadamente 37,3 unidades até o gatilho. Um salto adicional após pousar contornava o problema; o ajuste elimina essa exigência na aproximação narrativa final.

O histórico recente não contém alteração em `config.js`; a evidência não permite atribuir essa falha especificamente aos ajustes móveis. A conclusão se limita ao comportamento reproduzido.

## Correção localizada

Somente depois de `baby.currentPlatformIndex` identificar o pedestal final conquistado, a câmera da fuga passa a acompanhar a personagem. Até o pouso, permanecem a rolagem e a penalidade de atraso originais. O índice final é fornecido por `game.js` a partir de `platforms.length - 1`.

**Saltos modificados: nenhum.** Não houve mudança de espaçamento, objetos, plataformas, hitboxes, força de salto, gravidade, velocidade, aceleração, tempo de suspensão ou tolerância de pouso. A mudança corrige a derrota indevida no segmento pedestal → porta falsa.

## Último salto: antes e depois

A partir do mesmo estado alcançado por um percurso desde a abertura, foram testados 46 momentos de entrada. Em ambos os estados do código, 11 entradas resultaram em pouso no pedestal, e as demais 35 continuaram sem esse pouso. Os 11 resultados tiveram coordenadas e quadros de aterrissagem idênticos.

| Medida | Antes | Depois |
| --- | --- | --- |
| Momentos testados | 46 | 46 |
| Pousos válidos no pedestal | 11 | 11 |
| Espera antes de saltar | 29–39 quadros | 29–39 quadros |
| Posições de saída válidas | 4343,428–4370,928 | 4343,428–4370,928 |
| Pousos seguidos de derrota antes da porta | 11 | 0 |
| Pousos seguidos do início da reviravolta, sem salto extra | 0 | 11 |

Os 11 instantes amostrados ocupam um intervalo de aproximadamente 166,7 ms entre o primeiro e o último em `dt = 1`. A janela não foi ampliada, e entradas antecipadas/tardias continuam falhando.

Evidências: [antes](ultimo-salto-antes.json) e [depois](final/ultimo-salto.json).

## Inspeção de alcance

333 combinações verificadas no código real do navegador: desktop, Android e iPhone emulados, com `dt` de 0,5, 1 e 1,2. Esses valores representam passos de simulação e não medições de FPS de aparelhos.

Para as transições 0 → 1 até 8 → 9, foram examinadas posições de saída em incrementos de uma unidade, incluindo aproximações das bordas que ainda têm contato físico. Para os 12 alvos restantes da fuga e os 16 do retorno, foi buscada uma saída válida por combinação. Todos os 333 resultados de alcance foram idênticos antes/depois, sem falhas.

Amostra em desktop, `dt = 1`:

| Transição | Posições válidas amostradas | Intervalo X | Resultado |
| --- | --- | --- | --- |
| 0 → 1 | 72 | 268–339 | Preservado |
| 1 → 2 | 67 | 423–489 | Preservado |
| 2 → 3 | 67 | 588–654 | Preservado |
| 3 → 4 | 36 | 774–809 | Preservado |
| 4 → 5 | 27 | 904–930 | Preservado |
| 5 → 6 | 31 | 1070–1100 | Preservado |
| 6 → 7 | 29 | 1218–1246 | Preservado |
| 7 → 8 | 72 | 1378–1449 | Preservado |
| 8 → 9 | 45 | 1530–1574 | Preservado |

O intervalo usa a coordenada esquerda da personagem; contato parcial com a borda é válido no resolvedor existente. Não houve ampliação de hitbox para produzir esses resultados.

Evidências: [matriz anterior](alcance-antes.json) e [matriz posterior](alcance.json).

## Playtest integrado e regressões

- Campanha completa em desktop, Android e iPhone emulados: abertura, 22 apoios de ida, porta falsa/reviravolta, 16 apoios de retorno, portal verdadeiro e oito brinquedos guardados até a vitória.
- A chegada à porta falsa agora é testada caminhando após o pouso final. O script não usa mais o salto extra como desvio desse problema.
- `npm test`: aprovado, incluindo referência de geometria/configuração, saltos, guia da fada, estado, narrativa e apresentação móvel.
- Novo teste `test-final-pedestal-camera.js`: verifica chegada ao gatilho, ausência de mutação da personagem pela correção e preservação da penalidade antes do último pedestal, com três passos de tempo e duas larguras.
- O comportamento assistido preexistente do castelo → trem (9 → 10) não foi criado, ampliado ou removido nesta correção. Não há assistência nova ao último salto.

[Percurso Android](percurso/percurso.json) · [Desktop](percurso/desktop/percurso.json) · [iPhone](percurso/iphone/percurso.json).

## Critério de aprovação e limites

Todos os trechos testados permanecem alcançáveis; as janelas medidas não mudaram e nenhum salto ganhou capacidade adicional. Somente a pressão da câmera após conquistar o pedestal final foi retirada, permitindo concluir a aproximação da porta. A equivalência de dificuldade está demonstrada para os saltos medidos; a sensação subjetiva de desafio exige playtest humano.

As execuções usam Chrome desktop com perfis móveis emulados e instrumentação de teste. O percurso busca tempos de salto por snapshots entre tentativas; não teletransporta a personagem entre apoios. Não comprova comportamento de toque, FPS variável ou Safari em aparelhos reais.

Se o relato do QA se referir a cair **antes** do pouso no pedestal, esse caso permanece não reproduzido e requer a condição específica de entrada/dispositivo. Não foram alterados saltos por hipótese.

Reprodução: servidor `node server.js` e Chrome dedicado em `--remote-debugging-port=9222`; executar `node scripts/audit-gameplay-reachability.js`, `node scripts/audit-final-jump.js` e `node scripts/verify-full-browser.js android docs/qa-gameplay-001/percurso`. A comparação anterior foi preservada em arquivos separados.
