# QA-CAMERA-002B — sistema responsável pela instabilidade

Data: 02/10/2026. **Nenhuma correção aplicada.** Os ajustes iniciados para QA-CAMERA-002C foram retirados ao receber a instrução de executar esta etapa. `CameraController.js`, `MobileZoom.js`, física, velocidades, pulos, plataformas, layout e lógica da fada permanecem iguais aos originais. Em `game.js` permanece apenas a telemetria temporária de QA-CAMERA-002A.

**Causa confirmada, dentro do percurso e dos perfis medidos:** a transformação móvel calculada por `getMobileZoomFrame` muda sua escala e seus deslocamentos de forma descontínua quando os limites visuais da cena mudam. Na subida final, a troca do próximo apoio ao pousar provoca dez mudanças de escala acima de 2%; os deslocamentos contextuais também produzem saltos visuais. A suavização da câmera lógica não suaviza essa transformação adicional.

## Comparação dos sistemas

Foram executados os três testes solicitados, um controle com todos os sistemas ligados antes das intervenções e outro com todos reabilitados. Uma intervenção adicional, removendo zoom e offsets conjuntamente, separou a instabilidade da transformação móvel do movimento normal de acompanhamento.

| Variante | Zoom visível > 2%, Android / iOS | Saltos visuais > 5% da tela, Android / iOS | Indicador de alta frequência X / Y, Android, px CSS |
| --- | ---: | ---: | ---: |
| Todos habilitados — controle | 10 / 10 | 16 / 16 | 8,22 / 1,87 |
| Teste 1 — somente zoom desabilitado | 0 / 0 | 22 / 22 | 9,73 / 6,34 |
| Teste 2 — zoom ligado, damping desabilitado | 10 / 10 | 14 / 14 | 5,42 / 1,87 |
| Teste 3 — damping ligado, offsets desabilitados | 10 / 10 | 9 / 9 | 7,31 / 8,31 |
| Teste 4 — todos reabilitados | 10 / 10 | 16 / 16 | 8,22 / 1,87 |
| Complemento — zoom e offsets desabilitados juntos | 0 / 0 | 0 / 0 | 0,10 / 0,00 |

No Desktop, todas as variantes tiveram zero eventos de zoom > 2% e zero saltos visuais > 5% na subida final. O indicador X / Y ficou em 0,059 / 0,179 px, exceto sem damping, quando subiu para 0,268 / 0,544 px. No iOS emulado, os indicadores são praticamente iguais aos do Android, exceto no teste sem zoom: Y = 8,74 px. As diferenças verticais entre os perfis decorrem da presença do enquadramento específico de Android.

**Remover somente o zoom não estabiliza a posição.** O teste 1 preserva os offsets calculados para o enquadramento original e remove apenas suas escalas. Como escala e translação eram coordenadas, retirar uma delas pode aumentar o deslocamento percebido. O teste 3 também mantém o zoom ao retirar os offsets. A intervenção conjunta demonstra que a composição adicional é a origem comum dos eventos medidos, sem estabelecer que desativá-la seja a correção apropriada.

O controle reabilitado reproduziu **exatamente todas as matrizes de renderização** do controle inicial, em cada perfil. Isso confirma a reversibilidade das intervenções e a reprodução da instabilidade ao restaurar os sistemas.

## Sistema responsável por cada sintoma

| Sintoma | Resultado causal |
| --- | --- |
| Oscilação de zoom | `getMobileZoomFrame().zoom`. Dez eventos desaparecem ao retirar as escalas e permanecem ao retirar damping ou offsets. Na subida, `cameraZoom` da simulação é constante nos frames desses eventos. |
| Saltos bruscos de posição | Composição de `getMobileZoomFrame().x/y` e sua escala. Retirar só offsets reduz 16 eventos para 9; retirar só zoom mantém/aumenta eventos. Retirar ambos elimina os 16 eventos do controle. A câmera lógica, por si, não ultrapassa o limite de 5%. |
| Componente de alta frequência / tremulação visual | A transformação móvel é responsável pela componente acima de 1 px do indicador suplementar: com ambos os componentes retirados, cai para menos de 0,10 px. Retirar damping não elimina a instabilidade; no Desktop, a remoção aumenta esse indicador. |
| Movimento vertical específico de Android | `AndroidFraming.offset` contribui para a diferença vertical entre perfis, mas não é a causa comum: iPhone, que não usa esse sistema, reproduz os mesmos eventos de zoom e de salto horizontal. |

Não há evidência de que o damping lógico tenha introduzido a regressão. Ele altera a amplitude e a contagem de alguns saltos visuais quando removido, mas não elimina sua fonte.

## Trecho afetado e mecanismo

O trecho com confirmação experimental é a **subida final da terceira parte**, após a porta falsa e a reviravolta.

Em `game.js`, o cálculo dos limites usa personagem, fada e a região de chegada do próximo apoio, escolhido por `baby.currentPlatformIndex + 1`. Quando o índice muda no pouso, a composição dos limites muda imediatamente. Em `MobileZoom.js`, `getMobileZoomFrame` calcula diretamente:

- `zoom` a partir da largura/altura desses limites, entre 1 e 1,18;
- `x` e `y` a partir do ponto de ancoragem da personagem e das margens dos limites, usando `clamp`;
- a transformação final é aplicada depois da câmera lógica, a cada renderização, sem histórico temporal próprio.

No pouso do apoio 14, frame **6953**, o zoom efetivo passa de **1,18 para 1,00**: **15,25% em um frame**, sem evento narrativo e sem mudança de zoom lógico. Os dez eventos de escala acontecem nos frames 6223, 6303, 6382, 6461, 6541, 6622, 6703, 6785, 6868 e 6953. A amplitude cresce de 4,58% a 15,25% conforme aumenta o espaço exigido pelo apoio seguinte.

Os 16 saltos de posição do controle incluem pousos, recuperação do enquadramento durante saltos e a saída do tutorial. O maior salto horizontal foi **109,67 px CSS**, aproximadamente **28,12%** de uma tela com largura de 390 px. Não houve salto da posição lógica acima do limite, mostrando por que medir somente `cameraX`/`cameraY` não detectava esse sintoma.

Após a porta falsa e durante a reviravolta, os movimentos estão marcados como narrativos nos logs. Eles foram preservados e plotados, mas excluídos dos limites de salto/zoom, conforme QA-CAMERA-002A. Os diálogos são avançados automaticamente pelo percurso: a captura inclui 185 frames da reviravolta, não toda a permanência possível em cada fala. Portanto, **não se confirma por esta coleta uma regressão independente durante a narrativa**, nem se identifica o commit ou a data que introduziu o sistema. A divergência entre câmera local e controlador durante cinematização, registrada em QA-CAMERA-002A, continua sendo hipótese separada.

## Como os testes preservaram o gameplay

As intervenções existem somente na página de diagnóstico `tests/dark-room-camera-ablation.html`. Ela importa o jogo real e envolve a renderização com restauração em `finally`.

No teste de zoom, o cálculo original dos offsets é mantido, mas a escala móvel e a escala do controlador não são aplicadas ao canvas. No teste de damping, uma cópia do controlador tem seus fatores de interpolação retirados; ela recebe uma cópia do estado e dos atores para calcular apenas a pose a desenhar. A câmera original continua atualizando a simulação normalmente. Isso evita alterar seu limite vertical, que escreve em `baby.y`/`baby.vy`. Nos ramos narrativos, a pose de diagnóstico usa o alvo de zoom e o enquadramento narrativo genérico do controlador; conclusões quantitativas deste relatório restringem-se ao gameplay da subida.

No teste de offsets, são retirados o deslocamento de apresentação Android e os deslocamentos `x/y` móveis; o pivô contextual de zoom baseado na dupla personagem/fada é substituído pelo centro fixo do viewport. Os alvos de acompanhamento usados pela simulação continuam intactos. O teste combinado retira também as duas escalas.

Cada renderização compara o estado completo da personagem e da fada antes/depois e falha se houver escrita. Para comparar execuções, a fixture fixa a sequência pseudoaleatória, restaura o estado dessa sequência nos checkpoints e isola os sorteios do desenho. O redimensionamento é explícito na página de teste, impedindo callbacks tardios de `ResizeObserver`. Essas medidas são exclusivas da fixture; não foram inseridas no jogo distribuído.

Os **18 conjuntos finais** — seis variantes em três perfis — têm 7.181 frames cada e percorrem os mesmos 38 apoios até entrar na sala de brinquedos. Em cada perfil, uma comparação frame a frame confirmou igualdade de:

- posições da personagem e da fada;
- velocidades da personagem, contato com o chão e índice do apoio;
- sequência de fases/eventos narrativos e alvos da câmera lógica;
- pose completa original da câmera, tanto os valores locais quanto os do controlador;
- momento de cada salto, sua duração e posição de chegada.

Os resumos registram hashes SHA-256 dessas trajetórias. Não houve correção permanente ou alteração de física, velocidades, pulos, plataformas, layout ou lógica da fada.

## Métricas e limites de interpretação

O salto visual aplica as matrizes de dois frames ao **mesmo ponto do mundo**, na posição da personagem no frame anterior. Compara |ΔX| e |ΔY| com 5% da largura/altura CSS. Isso mede movimento do enquadramento, sem confundir com o deslocamento físico da personagem entre frames.

A oscilação de escala usa `|zoomAtual / zoomAnterior − 1|`, observando a escala final da matriz. Os eventos narrativos no frame atual ou anterior excluem ambas as comparações.

O desvio padrão bruto em 60 frames e o resíduo após tendência linear continuam disponíveis em `metrics.json`/`janelas.json`. Na subida, a câmera se desloca continuamente, e esses números podem exceder 1 px mesmo sem tremulação. Para separar a componente rápida desse movimento, a comparação adiciona o **indicador suplementar** `std(p[i] − 2p[i−1] + p[i−2]) / sqrt(6)`, calculado em janelas de 60 frames de um ponto fixo do mundo. Ele tem unidades de pixels CSS e realça descontinuidades; **não substitui a métrica original nem comprova sozinho jitter periódico**. Não se declara aprovação do critério absoluto de desvio padrão ≤ 1 px durante uma rolagem contínua.

`timeMs` representa tempo simulado a 60 Hz. Esta etapa não valida FPS, duração real de estabilização no aparelho ou adequação de uma futura correção.

## Plataformas e evidências

O motor usado foi **Chrome headless 154.0.8037.93 no macOS**. Desktop: viewport/canvas 960 × 540. Android e iOS: UA correspondente e viewport 390 × 844, canvas 540 × 1169. Os dois perfis móveis são **emulação no Chrome**. Não houve execução nativa em Android ou Safari/WebKit de iOS; essa confirmação permanece pendente.

- [Gráfico comparativo SVG](comparacao.svg) e [PNG verificado visualmente](comparacao.png): zoom e posição visual de um ponto fixo em torno do pouso do frame 6953, perfil Android.
- [Comparação estruturada e hashes](comparacao.json).
- [Controle original](todos/resumo.json), [sem zoom](sem-zoom/resumo.json), [sem damping](sem-damping/resumo.json), [sem offsets](sem-offsets/resumo.json), [todos reabilitados](todos-restaurados/resumo.json), [intervenção conjunta](sem-zoom-offsets/resumo.json).

Cada variante possui pastas `desktop`, `android` e `iphone`, contendo frames, métricas, janelas, percurso, gráficos e capturas. Nos frames da intervenção de damping, `cameraX`/`cameraY` representam a pose de diagnóstico durante o desenho; `originalCamera` guarda a câmera real preservada. A matriz `transform` é a referência para as métricas visuais de todas as variantes.

Reprodução, com servidor local em `:3000` e Chrome com depuração remota em `:9222`:

```sh
node scripts/run-camera-ablation.js
node scripts/analyze-camera-ablation.js
```

O primeiro comando executa controles, as três intervenções individuais, a intervenção conjunta e a restauração final. O segundo verifica invariantes, produz as métricas e o gráfico SVG e falha se alguma trajetória ou matriz restaurada divergir.

Verificações concluídas: análise comparativa com todas as invariantes aprovada; verificações sintáticas dos scripts; `git diff --check`; testes existentes de câmera do pedestal final, zoom móvel e enquadramento Android aprovados.
