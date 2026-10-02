# QA-CAMERA-002A — diagnóstico de câmera

Data: 02/10/2026. Nenhuma correção aplicada à câmera, física, hitboxes ou gameplay. A única alteração no jogo é um observador temporário, condicionado ao parâmetro `?cameraQa=1` e ao callback `window.cameraQaRecord`.

A evidência mais específica do trecho afetado é uma mudança abrupta no **zoom de apresentação móvel durante o pouso**, sem alteração de `cameraZoom`. Isso reproduz uma instabilidade visível na subida final. Não há histórico comparável nesta captura que permita afirmar quando a regressão foi introduzida.

## Execução e limites

| Perfil | Execução | Percurso | Frames |
| --- | --- | --- | --- |
| Desktop | Chrome headless no macOS, 960 × 540 | 22 apoios de ida, porta falsa, reviravolta, 16 apoios de retorno e portal verdadeiro | 7.181 |
| Android | Chrome com UA Android e viewport 390 × 844; canvas 540 × 1169 | Mesmo percurso completo | 7.181 |
| iOS (`iphone`) | Chrome com UA iPhone e viewport 390 × 844; canvas 540 × 1169 | Mesmo percurso completo | 7.181 |

**Etapa 2 parcialmente atendida:** os perfis móveis são emulação, não Android real nem Safari/WebKit no iOS. `adb` não está no PATH e `xcrun simctl` está indisponível. Não foram usados dispositivos físicos. Compatibilidade e estabilidade nativas permanecem pendentes.

A automação reutiliza o percurso de `verify-full-browser.js`, com atualização real do jogo em passos de `dt=1`, renderização em cada passo e busca de momento viável para saltar. Tentativas rejeitadas são removidas do log ao restaurar o checkpoint; os frames publicados formam o percurso aceito. Não há teletransporte de personagem no percurso aceito. As falas interativas são avançadas automaticamente, encurtando a narrativa: 185 frames da reviravolta, frames 5295–5479. A fase 3 começa no frame 5480. A execução termina após entrar na sala de brinquedos; a câmera desta sala não integra o diagnóstico solicitado.

`timeMs` é **tempo simulado a 60 Hz**, não duração real de execução nem medição de FPS/latência do aparelho. O observador registra cada renderização do quarto escuro, inclusive narrativa. A matriz é nula na abertura, cujo desenho tem câmera própria; essas amostras não entram nas métricas visuais.

## Métricas da subida final

| Métrica | Desktop | Android emulado | iOS emulado |
| --- | ---: | ---: | ---: |
| Saltos lógicos > 5% da dimensão visível, fora de narrativa | 0 | 0 | 0 |
| Máximo desvio padrão de cameraX, janela de 60 frames, px CSS | 123,69 | 105,41 | 105,41 |
| Máximo desvio padrão de cameraY, janela de 60 frames, px CSS | 40,24 | 34,28 | 34,28 |
| Máximo resíduo visual após remoção de tendência linear, X / Y, px CSS | 11,44 / 28,96 | 34,26 / 39,11 | 34,26 / 39,17 |
| Pousos sem estabilização observada após 300 ms | 15 | 8 | 8 |
| Pousos estabilizados em até 300 ms | 0 | 7 | 7 |
| Pousos inconclusivos por início de evento | 1 | 1 | 1 |
| Variações de cameraZoom > 2%, fora de narrativa | 0 | 0 | 0 |
| Variações de zoom visível > 2%, fora de narrativa | 0 | 10 | 10 |

As 1.417 janelas válidas da subida têm 60 frames consecutivos sem narrativa. Para o desvio padrão da câmera lógica, o desvio em coordenadas do mundo é convertido em pixels CSS pelo zoom efetivo e escala CSS do último frame da janela. Para a posição visual, acompanha-se um ponto fixo do mundo na posição inicial da personagem, aplicando a matriz final de cada frame. O resíduo desconta uma tendência linear da trajetória desse ponto.

**Interpretação do jitter:** o critério literal de desvio padrão > 1 px é excedido, mas a fase tem deslocamento contínuo, saltos e mudanças de enquadramento. Mesmo o resíduo pode representar movimento curvo suave. Estes números não provam microtremulação periódica ou alternância de alta frequência. A evidência objetiva de instabilidade nesta captura é a descontinuidade de zoom no pouso. Não se deve atribuir todos os desvios a jitter.

**Estabilização:** como o pedido não definiu tolerância, foi adotado deslocamento de um ponto fixo do cenário de até 1 px CSS por eixo por 6 frames consecutivos (100 ms de confirmação). O tempo informado começa no primeiro frame desse intervalo após pousar. Observação termina em novo salto, narrativa ou mudança de apoio. Valores nulos são limites inferiores, não tempos inventados. No Desktop, a rolagem contínua impede estabilidade absoluta; não se pode interpretar todas essas falhas como amortecimento defeituoso. No móvel, apoios 0–6 estabilizam entre 16,67 e 250 ms; apoios 7–14 continuam em movimento por 316,67–350 ms, e o apoio 15 inicia transição após 16,67 ms.

O teste de salto lógico compara |ΔcameraX| e |ΔcameraY| com 5% de `canvas.width / zoomEfetivo` e `canvas.height / zoomEfetivo`. A ausência de falhas neste critério não exclui saltos visuais provocados pela matriz de apresentação. Eventos narrativos no frame atual ou anterior excluem a comparação. A métrica de zoom usa |zoomAtual / zoomAnterior − 1| para o zoom lógico e o efetivo.

## Trecho afetado e possível causa raiz

### Depois da porta falsa e durante a reviravolta

Os movimentos de `cameraX` e `cameraZoom` neste trecho estão marcados como narrativos e são preservados nos gráficos e nos logs. Não são classificados como falhas pelos critérios 1 e 4. `game.js` possui um sequenciador próprio da reviravolta, com zoom alvo 1,35 → 1,55 → 1,35 e movimento da fada; vários ramos retornam antes da sincronização normal do `CameraController`.

Há uma hipótese secundária de divergência entre valores locais e o controlador: a renderização usa `camera.zoom`/`camera.y`, enquanto a narrativa modifica `cameraZoom`/`cameraY` locais. Na saída da cinemática do castelo, fora do trecho principal, o frame 4174 registra zoom lógico 1,45 e zoom renderizado 1 no Desktop; no 4175 o renderizado passa a 1,38088, uma variação de 38,09%. O percurso completo registra 7 alertas de zoom no Desktop e 20 em cada móvel; 10 dos alertas móveis pertencem à subida final. A saída da narrativa exige interpretação contextual, pois a recuperação do zoom pode ser intencional. Não foi modificada nem classificada como causa confirmada da terceira parte.

### Subida final — hipótese sustentada pela captura

Em `game.js`, os limites visuais incluem personagem, fada e **próximo apoio**, selecionado por `baby.currentPlatformIndex + 1`. No pouso, esse índice muda e o apoio seguinte entra no cálculo imediatamente. `getMobileZoomFrame` em `MobileZoom.js` calcula o zoom diretamente a partir desses limites, com intervalo 1–1,18, sem memória temporal. A matriz muda mesmo quando `cameraZoom` é 1.

| Frame | Apoio de pouso | Zoom efetivo anterior → atual | Variação |
| --- | ---: | --- | ---: |
| 6223 | 5 | 1,18000 → 1,12593 | 4,58% |
| 6303 | 6 | 1,18000 → 1,08781 | 7,81% |
| 6382 | 7 | 1,18000 → 1,04493 | 11,45% |
| 6461 | 8 | 1,18000 → 1,00052 | 15,21% |
| 6541, 6622, 6703, 6785, 6868, 6953 | 9–14 | 1,18000 → 1,00000 | 15,25% cada |

Os eventos são idênticos nos dois perfis móveis, sem evento narrativo e com variação lógica de zoom igual a zero. A coincidência entre troca de apoio e zoom calculado sustenta **recalcular o enquadramento móvel com um conjunto descontínuo de limites** como possível causa raiz da instabilidade de zoom. O deslocamento Android em `AndroidFraming.js` também depende dos objetos visíveis e de um limite por `min/max`; pode contribuir para variações verticais, mas não explica os eventos comuns ao iPhone e ao Android. Não houve experimento alterando esses cálculos, conforme a proibição de corrigir nesta etapa.

## Evidências e reprodução

Cada pasta contém `frames.json` (sete campos solicitados mais contexto narrativo, apoio, dimensões e matriz), `percurso.json`, `metrics.json`, `janelas.json`, capturas PNG e gráficos SVG:

- [Desktop: gráficos](desktop/graficos.svg), [métricas](desktop/metrics.json), [frames](desktop/frames.json).
- [Android emulado: gráficos](android/graficos.svg), [métricas](android/metrics.json), [frames](android/frames.json).
- [iOS emulado: gráficos](iphone/graficos.svg), [métricas](iphone/metrics.json), [frames](iphone/frames.json).
- [Resumo estruturado](resumo.json).

Os gráficos mostram `cameraX`, `cameraY`, zoom lógico e zoom visível; linhas verticais identificam reviravolta e início da fase 3. Os frames detalhados das métricas permitem localizar cada ocorrência.

Com servidor em `:3000` e Chrome de teste com depuração remota em `:9222`:

```sh
node scripts/qa-camera-stability.js desktop
node scripts/qa-camera-stability.js android
node scripts/qa-camera-stability.js iphone
node scripts/analyze-camera-stability.js
```

Validação: verificação sintática dos scripts e de `game.js`; testes existentes `test-final-pedestal-camera.js`, `test-mobile-zoom.js` e `test-android-framing.js` aprovados. Não foram alterados os controladores de câmera ou de apresentação. Para remover a instrumentação temporária, retirar o observador e suas duas chamadas em `game.js`; os scripts e evidências podem permanecer para auditoria.
