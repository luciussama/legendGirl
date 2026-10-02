# QA-CAMERA-002C — correção de estabilidade da câmera

Data: 02/10/2026. **Correção implementada; métricas aprovadas no Desktop/Chrome e nos perfis Android/iPhone emulados no Chrome. Aprovação nativa e avaliação humana de jogabilidade pendentes.**

## Causa raiz e correção

A investigação [QA-CAMERA-002B](../ablation/RELATORIO-QA-CAMERA-002B.md) confirmou que `getMobileZoomFrame` recalculava escala e offsets a partir de limites contendo a fadinha e o próximo apoio. A troca de apoio no pouso alterava esses limites instantaneamente; a transformação adicional aplicada ao canvas não participava do damping lógico. A movimentação da fadinha também movimentava esses limites durante falas com a menina parada. A coleta integral desta etapa mediu jitter parado de 2,3303 px nos perfis móveis.

Foi confirmado um segundo salto visual na saída do plot twist: o reposicionamento narrativo dos atores atualizava a câmera local abruptamente. No Desktop, esse salto atingia 66,79% da largura da tela. O reposicionamento original dos atores foi preservado; somente a câmera desenhada passou a interpolar essa transição.

A seção afetada agora usa um enquadramento móvel amplo e estável, com escala 0,8, em vez de recomputar zoom a cada troca do próximo apoio. As entradas de enquadramento têm interpolação própria. Uma apresentação visual independente encerra a cauda de subpixel do follow após o pouso, limita deslocamentos e interpola transições narrativas. A câmera lógica mantém sua atualização original, incluindo as interações já existentes com o limite vertical da personagem. O descarte de plataformas fora da tela considera a transformação visual aplicada, para não ocultar apoios que passaram a caber no enquadramento.

## Arquivos e configurações

Arquivos de produção alterados exclusivamente para apresentação/observação da câmera:

- `src/js/controllers/CameraPresentation.js`: nova pose visual e transição do enquadramento móvel; histórico recuperável em checkpoints.
- `src/js/controllers/MobileZoom.js`: enquadramento estável da terceira parte e da reviravolta.
- `src/js/controllers/CameraController.js`: `applyTransform` aceita pose visual; `update` permanece intacto.
- `src/js/game.js`: composição da apresentação, reinicialização do histórico e telemetria optativa por `cameraQa`.
- `src/js/environment/PlatformRenderer.js`: descarte por viewport com a matriz real do canvas; desenhos, geometria e hitboxes preservados.

Configurações visuais: escala móvel 0,8; antecipação horizontal de até 32% do canvas na subida; interpolação com retenção 0,65 por tick; término da cauda dentro de 0,5 pixel CSS; limite da pose normal de 4,9% por frame; limite narrativo de 3% por tick; entrada móvel com variação de escala de até 1,5% por tick e translação de até 2% por tick. A composição efetiva, e não apenas esses limites isolados, foi medida nos testes.

Ferramentas/evidências acrescentadas ou atualizadas: `scripts/qa-camera-stability.js`, `scripts/run-camera-correction.js`, `scripts/verify-camera-correction.js`, `scripts/plot-camera-correction.js`, `scripts/analyze-camera-stability.js`, `scripts/test-camera-presentation.js`, `scripts/test-mobile-zoom.js`, `tests/dark-room-camera-ablation.html` e `tests/dark-room-playthrough.html`. Os arquivos e relatórios das etapas A/B permanecem como evidência histórica.

## Métricas antes e depois

Máximos das duas passagens; ambas produziram os mesmos resultados. Pixels visuais são pixels CSS, não unidades do mundo. Mudanças de posição incluem os frames narrativos do trecho afetado; zoom exclui eventos narrativos conforme o critério. O limite de posição é avaliado projetando o mesmo ponto do mundo em dois frames consecutivos, incorporando zoom e offsets.

| Métrica | Desktop antes → depois | Android emulado antes → depois | iPhone emulado antes → depois |
| --- | ---: | ---: | ---: |
| Jitter parado, desvio padrão/60 frames | 0,000023 → 0,000023 px | 2,3303 → <0,000001 px | 2,3303 → <0,000001 px |
| Maior deslocamento X / largura | 66,79% → 4,90% | 71,23% → 4,40% | 71,23% → 4,40% |
| Maior deslocamento Y / altura | 1,01% → 2,33% | 0,68% → 1,35% | 0,68% → 1,04% |
| Variação de zoom/frame sem narrativa | 0% → 0% | 15,25% → 0% | 15,25% → 0% |
| Maior tempo de estabilização confirmado | 400 → 150 ms | 350 → 133,33 ms | 350 → 133,33 ms |
| Regiões de chegada visíveis antes do salto | 16/16 → 16/16 | 12/16 → 16/16 | 12/16 → 16/16 |
| Fadinha completamente visível no plot twist | 100% → 100% | 100% → 100% | 100% → 100% |

Antes da correção, vários pousos não atingiam estabilidade em todo o intervalo disponível; o máximo confirmado da tabela não é um limite superior desses casos. A lista completa de pousos, intervalos observados e valores não estabilizados consta em [validacao.json](validacao.json).

Depois, 15 pousos por passagem tiveram estabilidade confirmada entre 50 e 150 ms. No último pedestal, a transição do portal começa cerca de 16,67 ms após o pouso: não existe uma janela de 300 ms de gameplay para avaliar esse pouso separadamente. Esse caso permanece sem medição de estabilização pós-pouso; a transição é incluída no limite de movimento visual.

## Método e preservação do gameplay

Foram executados 12 percursos aceitos: antes/depois × duas sementes × três perfis. Cada percurso contém 7.882 frames a 60 Hz simulados, os mesmos 38 apoios (22 de ida e 16 de subida) e toda a narrativa, com 885 frames de plot twist. A busca automatizada de momento de salto restaura checkpoints e descarta tentativas malsucedidas; os logs contêm somente o percurso aceito. Não é um teste humano de decisão ou dificuldade.

A variante `antes` desativa somente a apresentação nova, o enquadramento estável e o descarte com a transformação visual, reproduzindo a composição anterior. A fixture fixa/restaura a sequência aleatória e isola os sorteios de desenho. Compara o estado completo da menina e da fada antes/depois de cada renderização para detectar escritas indevidas.

A validação compara exatamente, em todos os frames antes/depois: posição e velocidade da menina, posição da fadinha, contato com o chão, índice do apoio, fase, eventos narrativos, alvos e pose original completa da câmera lógica. Também compara os mesmos momentos de salto, duração de voo e posições de chegada. Todas as comparações passaram. Nenhum arquivo de configuração de física, layout, hitboxes ou comportamento da fada foi alterado.

Jitter: desvio padrão de um ponto do mundo durante janelas de 60 frames com menina parada nas falas 4/5. Pouso: estabilidade da projeção dos pés em relação ao acompanhamento, com amplitude horizontal/vertical <=1 px durante todo o restante do contato e pelo menos seis frames de confirmação. Essa medida separa a recuperação do follow do deslocamento legítimo da personagem/rolagem automática; desvio padrão bruto da posição mundial durante movimento não representa jitter parado.

Visibilidade dos destinos: área de chegada de até 96 unidades no extremo direito do apoio seguinte, com margem vertical de 24 unidades, inteiramente dentro da tela no frame anterior a cada decolagem. Isso confirma a região de pouso e sua altura; não certifica a visibilidade de toda a largura de ilustrações maiores que essa região. Fadinha: caixa visual conservadora de 56 × 56 unidades inteiramente dentro do viewport em cada frame de plot twist.

## Evidências e reprodução

- [Comparação visual antes/depois](comparacao.html): capturas dos mesmos apoios, antes da porta falsa, após o plot twist e durante a subida.
- Gráficos da transformação efetiva: [Desktop](comparacao-desktop.svg), [Android emulado](comparacao-android.svg), [iPhone emulado](comparacao-iphone.svg).
- [Métricas, pousos e invariância frame a frame](validacao.json).
- Logs separados: `antes/`, `depois/`, `antes-repeticao/`, `depois-repeticao/`, cada um com `desktop/`, `android/`, `iphone/`; cada perfil contém `frames.json`, `percurso.json`, `metrics.json`, `janelas.json`, `graficos.svg`, capturas PNG e `execucao.log`.
- [Ambiente e disponibilidade nativa](ambiente.json).

Reprodução: servidor do projeto em `127.0.0.1:3000`, Chrome com CDP em `127.0.0.1:9222`; executar `node scripts/run-camera-correction.js`, `node scripts/verify-camera-correction.js` e `node scripts/plot-camera-correction.js`. Testes adicionais aprovados: apresentação de câmera, zoom móvel, pedestal final, enquadramento Android, área segura de diálogo e 86 combinações de escala da protagonista. Verificação sintática e `git diff --check` aprovados.

## Confirmações e limites da aprovação

**Nenhum parâmetro de gameplay foi alterado.**

**A dificuldade da fase permaneceu inalterada.** Esta confirmação refere-se à dificuldade mecânica: física, velocidades, layout, distâncias e os mesmos saltos/chegadas foram preservados exatamente. A percepção humana da dificuldade e a neutralidade da câmera na tomada de decisão ainda exigem teste de jogabilidade em aparelhos reais.

**A correção foi realizada exclusivamente no sistema de câmera.** O ajuste do descarte visual de plataformas faz parte da aplicação do viewport; não altera plataformas nem suas colisões.

Desktop executado em Chrome, viewport 960 × 540. Android/iPhone executados com viewport 390 × 844 e user agents móveis no mesmo Chrome. `adb devices -l` não lista dispositivos; `xcrun simctl` está indisponível. Não foram executados Android nativo, iPhone/Safari/WebView nem medidas de frame pacing em hardware. Portanto, a validação obrigatória nativa das duas plataformas móveis está **pendente**, e não deve ser tratada como concluída pela emulação. Não se declara aprovação integral da tarefa até essas execuções e a avaliação humana solicitada.
