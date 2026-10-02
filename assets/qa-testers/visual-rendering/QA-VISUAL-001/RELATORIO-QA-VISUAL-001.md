# QA-VISUAL-001 — artefato de renderização da terceira parte

Data: 02/10/2026. Referência anterior: `7b51b60`. **Corrigido no renderizador do fundo. Validação aprovada no Desktop/Chrome e nos perfis Android/iPhone emulados; aprovação em aparelhos reais pendente.**

## Camada responsável e causa raiz

A camada responsável é o **background de parede/piso**, em `BackgroundRenderer.renderWall`. A faixa cinza é a consequência de compor a máscara de escuridão sobre pixels em que esse background não foi desenhado.

O fundo usava retângulos limitados horizontalmente a `0..canvas.width`, embora o contexto já contivesse zoom e offsets de apresentação. Na terceira parte móvel, a escala 0,8 e a translação horizontal de 172,8 unidades deixam visíveis coordenadas negativas do espaço de desenho. Os retângulos, loops de repetição e critérios de descarte ignoravam essa extensão. Ficavam pixels transparentes à esquerda, com bordas perfeitamente verticais; no iPhone emulado, a extensão vertical também excedia o início fixo de -600 unidades.

A máscara de iluminação é reconstruída em um canvas de tamanho igual ao viewport e aplicada com `multiply` em coordenadas de tela. Sobre cenário opaco, ela escurece o material; sobre transparência, a cor da própria máscara aparece como superfície azul-acinzentada. Seus recortes de luz deixam outras partes dessa região transparentes, explicando as formas retangulares e os contrastes interrompidos. O acabamento final não foi identificado como origem do defeito.

O fundo isolado [antes, Android, apoio 9](antes/android/controle/fundo-9.png) mostra diretamente a falta de cobertura; a [captura composta anterior](antes/android/controle/apoio-9.png) mostra a faixa resultante. O [fundo corrigido](depois/android/controle/fundo-9.png) e a [captura composta corrigida](depois/android/controle/apoio-9.png) demonstram sua remoção mantendo as luzes ativas.

## Mapeamento das camadas e isolamento

| Ordem / sistema | Responsável | Espaço e composição |
| --- | --- | --- |
| Background principal | `BackgroundRenderer.renderWall` | Parede, reflexo ambiente, piso e rodapé sob a matriz visual da cena. |
| Parallax | Mesmo renderizador | Papel de parede, estrelas, guirlandas, janelas, ganchos, desenhos e prateleiras; fatores horizontais distintos são intencionais. |
| Background secundário | `BackgroundRenderer.renderScenery` | Objetos decorativos do piso, sprites do atlas e alternativas procedurais. |
| Plataformas / portas | `PlatformRenderer` | Sprites, suportes e sombras locais desenhadas dentro da ilustração; sem pass separado de sombras. |
| Partículas / atores | `ParticleSystem`, renderizadores da menina/fada | Poeira, rastros, partículas e personagens sob a transformação da cena. |
| Canvas intermediário / máscara de luz | `LightingSystem.darkCanvas` | Base opaca em tela; recortes `destination-out` usam a mesma matriz real da cena. Composição `multiply` no viewport. |
| Luzes sobrepostas | `LightingSystem` | Feixes suaves, poeira e brilho da fada com `screen` sob a matriz da cena. |
| Vinheta | `LightingSystem` | Gradiente radial de tela com `source-over`. |
| Acabamento / pós-processamento | `ArtFinish` | Dessaturação por `saturation` em tela; não existe pipeline WebGL adicional nesse trecho. |
| Overlays | HUD, diálogos, abertura e transição do portal | Interface em tela; diálogos/portal recebem a matriz visual quando necessário. |

Foram feitos dez controles/intervenções independentes × três posições (apoios 0, 9 e 15) × três perfis: **90 capturas antes**, com fundo isolado e diagnóstico por variante. Nenhuma intervenção é inserida no jogo distribuído. Cada renderização da fixture verifica que não escreveu nos atores nem na câmera lógica.

| Desativação temporária | Resultado causal |
| --- | --- |
| Parallax | Não elimina a falta de cobertura; retirar decorações expõe mais transparência. |
| Sombras | Retiradas as sombras procedurais de contato/projeção identificadas no código. Não muda o defeito. Sombreamento pintado dentro de sprites não é uma camada independente e foi preservado. |
| Iluminação dinâmica | Retirados os recortes locais de luz. A máscara fica opaca, mas a região continua sem background e recebe a cor da máscara. Não corrige a origem. |
| Background secundário | Retirados os objetos decorativos do piso. Não elimina a faixa. |
| Vinheta | Retirado somente o gradiente radial final. A falha de cobertura permanece. |
| Canvas de efeitos | Retirada a chamada completa de atmosfera/iluminação. Expõe a transparência do cenário; não restaura o background ausente. |
| Máscara de luz | Retirada somente a composição de `darkCanvas`, preservando feixes/brilho/vinheta. Expõe a transparência original. |
| Acabamento final | Retirado `ArtFinish`. A falha de cobertura permanece. |
| Partículas de salto/velocidade | Sem efeito na origem da faixa. |

Capturas individuais estão em `antes/<perfil>/<variante>/apoio-<índice>.png`; os pixels do fundo antes das outras camadas estão em `fundo-<índice>.png`. [Comparação e links dos testes isolados](comparacao.html).

## Investigação da câmera e correção

Não foi encontrada aplicação dupla de zoom ou offset na máscara: `LightingSystem` copia a matriz real de `ctx.getTransform()` para seus recortes e compõe o resultado com identidade, corretamente. O erro era usar dimensões de viewport como limites do background no espaço transformado.

A correção calcula os quatro cantos do viewport pela inversa da matriz real do contexto, acrescenta uma unidade de margem contra costuras de antialiasing e cobre essa região com o background opaco. Parede, piso, rodapé e loops de repetição usam os novos limites; o descarte dos elementos decorativos também considera essa região. A fase e os fatores de parallax permanecem ancorados aos mesmos múltiplos, preservando a posição dos elementos já existentes. Não foi alterada a intensidade das luzes, o zoom, o follow ou qualquer offset da câmera.

Exemplo medido no apoio 9: `cameraY = -589`, zoom efetivo ≈0,8, translação X ≈172,8 no canvas 540 × 1169. No Android, translação Y ≈395,54; no iPhone, ≈588,10. A faixa horizontal sem fundo termina aproximadamente em X=173 do canvas, equivalente a **125 px CSS** no viewport de 390 px. No iPhone, há também uma faixa superior de aproximadamente **78 px CSS**, decorrente do antigo limite vertical. As posições da câmera e as matrizes completas estão nos diagnósticos JSON.

## Compatibilidade e intensidade

Medidas do apoio 9, antes → depois. A intensidade é a média de luminância RGB ponderada (0–255) na região esquerda X=0..173, Y=100..299 do bitmap do canvas; serve como comparação objetiva da região, sem impor um novo limite artístico.

| Perfil | Pixels sem background | Intensidade da região | Resultado visual |
| --- | ---: | ---: | --- |
| Android emulado | 168.886 → 0 | 14,90 → 1,79 | Faixa cinza eliminada, materiais e luzes preservados. |
| iPhone emulado | 209.130 → 0 | 19,12 → 1,79 | Faixa lateral e área superior sem fundo eliminadas. |
| Desktop / Chrome | 0 → 0 | Não aplicável | Defeito não reproduzido nas três posições medidas; cobertura permanece integral. |

Nos nove controles corrigidos (três apoios × três perfis), todos os pixels do background são opacos, a cena continua opaca antes do acabamento e a composição final não tem transparência. Isso elimina o mecanismo que produzia a borda artificial; não remove listras, rodapés ou limites intencionais das ilustrações. As capturas corrigidas foram inspecionadas e preservam a atmosfera escura, a iluminação local e os elementos do cenário.

## Arquivos alterados e preservação das mecânicas

**Único arquivo de produção alterado:** `src/js/environment/BackgroundRenderer.js`.

Ferramentas de QA acrescentadas: `tests/dark-room-visual-layers.html`, `scripts/qa-visual-layers.js`, `scripts/verify-visual-layers.js`, `scripts/test-background-viewport.js`. Evidências em `assets/qa-testers/visual-rendering/QA-VISUAL-001/`. A cópia `fontes/BackgroundRenderer-antes.js` conserva o renderizador da referência anterior somente para reprodução de testes.

**Nenhuma mecânica foi alterada.** Física, personagens, plataformas, hitboxes, layout, dificuldade e lógica da câmera permanecem intactos. Não foram adicionadas linhas técnicas às ilustrações.

Dois percursos completos foram executados por perfil após a correção. O percurso de comparação usa a mesma semente `2870014` da referência QA-CAMERA-002C: **7.882 frames e 38 apoios por perfil**. A comparação exata passou para posição/velocidade da menina, posição da fadinha, contato/apoio, posição/zoom originais da câmera e matriz visual aplicada ao canvas, além de momento de salto, duração do voo e chegada. [Invariância do percurso](invariancia-percurso.json). Os dados estão em `comparacao-percurso/<perfil>/`; a segunda semente está em `percurso/<perfil>/`.

Testes aprovados: cobertura com zoom/offsets/matriz inclinada, reconstrução da máscara de iluminação sem alteração de estado, apresentação da câmera, verificação sintática e `git diff --check`. [Validação e intensidade por captura](validacao.json).

## Reprodução e limite da aprovação

Com servidor local em `127.0.0.1:3000` e Chrome de QA com CDP em `127.0.0.1:9222`: executar `node scripts/qa-visual-layers.js antes`, `node scripts/qa-visual-layers.js depois`, `node scripts/verify-visual-layers.js`, `node scripts/test-background-viewport.js` e `node scripts/test-lighting.js`. A verificação de invariância usa os logs completos já entregues em `comparacao-percurso/` e a referência em `assets/qa-testers/camera-stability/correction/depois/`.

As capturas de isolamento são exportadas diretamente do canvas no mesmo frame das métricas, incluindo o HUD, para evitar imagens atrasadas do compositor durante redimensionamento da aba de teste. Os percursos completos incluem capturas adicionais do viewport.

Android/iPhone foram emulados no Chrome com viewport 390 × 844 e user agents móveis; Desktop usa 960 × 540. **Não se declara aprovação nativa de Android/iOS:** `adb devices -l` não lista aparelhos, e `xcrun simctl` está indisponível. A validação em Android real e iPhone/Safari/WebView permanece pendente, incluindo eventuais diferenças de composição da GPU. Desktop/Chrome e os dois perfis emulados estão aprovados para o defeito reproduzido.
