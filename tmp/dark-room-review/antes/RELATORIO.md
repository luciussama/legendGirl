# Auditoria técnica das plataformas de salto

Revisão do estado local no commit `da91211`. Nenhuma correção ou proposta de implementação faz parte deste relatório.

## Escopo e método

**38 plataformas, 38 transições de entrada, 114 combinações transição/dt.** Fase 1: 0–9; fase 2: 10–21; fase 3: 0–15 (índices reiniciam). O chão inicial é origem, não plataforma numerada. A sala superior de brinquedos usa navegação própria e não contém plataformas de salto identificadas nos módulos `src/js/toy-room`; não foi contada como fase de salto.

Os trechos reais de `doJump`, integração de movimento e seleção de aterrissagem foram executados em memória, sem editar arquivos de código. Amostragem horizontal em passos de 1 px, dt=0,5/1/1,2 (limites do runtime). Nos apoios, foi incluída toda posição com pelo menos 1 px de sobreposição do corpo de 38 px. O corredor inicial foi limitado a x=60..219 (fase 1) e x=4170..4639 (fase 3). A geometria e os coeficientes usados estão no JSON.

**Taxa estimada = saídas bem-sucedidas / posições amostradas**, com distribuição uniforme espacial. Não é probabilidade medida em jogadores. A janela em ms é a largura amostrada / velocidade de corrida, assumindo 60 unidades de atualização por segundo. Não inclui latência humana, câmera, input ou jitter real. O castelo fica parado e tem tempo de espera ilimitado; sua taxa de 100% é intencional. Os intervalos por transição não demonstram uma partida contínua nem todas as sequências de input.

Critério de alcance: Inválida se nenhuma saída alcança; Suspeita se janela <120 ms ou sucesso >85% fora do castelo; Válida nos demais casos. Esses limiares são critérios desta auditoria, não requisitos internos do jogo. Geometria visual tem classificação independente: Inválida quando há superfície física claramente em área sem suporte visual; Suspeita em curvas, pequenas divergências, animação ou leitura semântica ambígua.

Renderização real em Canvas, assets do manifesto, capturas das 38 plataformas. Medição de alfa >=128 a cada coluna, buscando o pixel mais próximo em ±32 px; momentos tick=0/8/24. Offset positivo significa arte abaixo da linha física, negativo acima. **Alfa detecta arte, não solidez**: brilho, decoração e preenchimento podem mascarar flutuação ou afundamento. Capturas e análise do renderer prevalecem nessas situações. Pontos isolados vazios nas bordas podem ser antialiasing. A linha verde das capturas foi adicionada só ao relatório e não entra nas medições.

O renderer da personagem foi exercitado em 38 plataformas × 2 sentidos × 120 frames = **9.120 contatos**. A sola mais baixa coincide com o plano físico em erro <1e−8 px. Isso não assegura coincidência com a arte da plataforma. Os offsets horizontais de borda foram medidos separadamente.

## Resultado consolidado

Geometria/contato local: **17 válidas, 17 suspeitas e 4 inválidas**. O problema geral G-01 aplica-se inclusive às plataformas localmente válidas.

Alcance: nenhuma transição impossível na amostragem; 37 válidas e 1 suspeita (fase 3, entrada no portal final). Nenhum salto comum teve 100% de sucesso no domínio amostrado. A saída do castelo teve 100%, conforme a regra especial.

## Inconsistências gerais

- **G-01 — apoio pelo corpo, não pelos sapatos.** A condição compara `baby.x + baby.w > platX` e `baby.x < platX + platW`. Com 1 px de sobreposição corporal, ambos os sapatos podem estar totalmente fora: distância de 5,444 a 8,444 px à borda em animTime=0, conforme sentido. Evidência por plataforma em `contato-bordas.json`. Isso explica apoios visualmente invisíveis em todas as plataformas.
- **G-02 — tolerância vertical da colisão.** O resolvedor aceita pés de y até y+16 durante a descida e depois reposiciona a personagem para y. É uma tolerância de pouso de 16 px abaixo do topo, não uma colisão volumétrica com toda a altura desenhada. Não foi considerada sozinha um bug, mas amplia a margem física e pode aceitar contato depois de atravessar o plano.
- **G-03 — cobertura insuficiente dos testes existentes.** Testes atuais passam, mas o teste de pés verifica o plano numérico, não os pixels da superfície. A sequência existente de alcance usa somente o array das fases 1/2; a fase 3 foi incluída nesta auditoria em memória. Por isso PASS não elimina os problemas visuais listados.
- **G-04 — sensibilidade temporal no final da fase 3.** Último salto: 25/87 saídas (28,74%, 119,05 ms) em dt=0,5; 18/87 (20,69%, 85,71 ms) em dt=1; 15/87 (17,24%, 71,43 ms) em dt=1,2. Há saídas possíveis, mas a margem cai ~40% entre os extremos de dt.

## Progressão de dificuldade

Fase 1 tem variação deliberada, sem monotonicidade: em dt=1 as janelas variam de ~317 a 1.162 ms. A passagem para a caixa de música volta a ~845 ms após ~340 ms para as gavetas. Não há requisito de progressão estrita estabelecido para essa fase.

Fase 2: corrida cresce de 1,75 até 2,75 px/unidade nas saídas após o trem; janela cai de ~676 para ~176 ms em dt=1. A exceção do castelo não tem prazo para clicar. Fase 3: janelas caem até ~86 ms; velocidade de saída final de corrida é 3,5 px/unidade. Essa aceleração foi medida sem alterar parâmetros.

## Fase 1 — métricas por transição

Δx é o vão entre bordas físicas no sentido do movimento; subida positiva em Δy. Janela e taxa são de dt=1; intervalo ms inclui os três dt. Margem espacial é a quantidade de posições de saída válidas em passos de 1 px.

|Destino|Objeto|Δx / Δy (px)|Margem (px)|Janela ms (min–max)|Sucesso estimado|Salto|Visual|
|---|---|---:|---:|---:|---:|---|---|
|0|giant_bear|corredor / 60|99|1138–1162|61.9% (99/160)|Válida|Válida|
|1|open_books|40 / -4|72|833–845|45.9% (72/157)|Válida|Suspeita|
|2|vanity_table|40 / 21|67|786–798|45.6% (67/147)|Válida|Válida|
|3|small_dresser|40 / 21|67|786–810|41.4% (67/162)|Válida|Suspeita|
|4|messy_blocks|71 / 21|36|423–446|23.7% (36/152)|Válida|Suspeita|
|5|toy_drum|99 / 21|27|317–329|31.0% (27/87)|Válida|Válida|
|6|satin_cushion|102 / 21|31|364–387|28.7% (31/108)|Válida|Válida|
|7|stepped_dresser|78 / 21|29|340–364|35.8% (29/81)|Válida|Suspeita|
|8|music_box|35 / 21|72|845–869|44.4% (72/162)|Válida|Válida|
|9|block_castle|61 / 31|45|505–528|35.4% (45/127)|Válida|Válida|

### Fase 1 — evidências individuais

#### 0 — giant_bear

**Visual: Válida; salto: Válida.** Contato central e faixa de apoio coerentes; laterais arredondadas e orelhas não são apoio adicional.

Apoio físico: x=220..340, y=410, largura=120 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=121..219; sobreposição corporal no pouso=0.06..38.00 px. Velocidade no ar=1.420; impulso vertical=-7.200. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-0.png](visual-grupo-0.png); `src/js/config.js:103`; `src/js/environment/PlatformRenderer.js:18`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 1 — open_books

**Visual: Suspeita; salto: Válida.** Topo ilustrado irregular: apenas 24,5% das colunas têm pixel opaco a até 1 px do apoio. Em colunas extremas, a arte está até 26 px abaixo; 3 colunas não têm opacidade suficiente em ±32 px.

Apoio físico: x=380..490, y=414, largura=110 px. Cobertura mínima em ±1 px: 24.5%. Pixel opaco próximo: 0..26 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=268..339; sobreposição corporal no pouso=0.42..38.00 px. Velocidade no ar=1.420; impulso vertical=-7.200. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-0.png](visual-grupo-0.png); `src/js/config.js:104`; `src/js/environment/PlatformRenderer.js:19`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 2 — vanity_table

**Visual: Válida; salto: Válida.** Tampo acompanha o apoio. Espelho e objetos são decoração atravessável.

Apoio físico: x=530..655, y=393, largura=125 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..1 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=423..489; sobreposição corporal no pouso=0.16..38.00 px. Velocidade no ar=1.420; impulso vertical=-7.200. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-0.png](visual-grupo-0.png); `src/js/config.js:105`; `src/js/environment/PlatformRenderer.js:20`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 3 — small_dresser

**Visual: Suspeita; salto: Válida.** Bordas do tampo chanfradas: regiões do apoio chegam a 10 px acima da arte; cobertura próxima de 81,7%.

Apoio físico: x=695..810, y=372, largura=115 px. Cobertura mínima em ±1 px: 81.7%. Pixel opaco próximo: 0..10 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=588..654; sobreposição corporal no pouso=0.16..38.00 px. Velocidade no ar=1.420; impulso vertical=-7.200. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-0.png](visual-grupo-0.png); `src/js/config.js:106`; `src/js/environment/PlatformRenderer.js:21`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 4 — messy_blocks

**Visual: Suspeita; salto: Válida.** Topo do bloco A oblíquo: apoio horizontal de 50 px, cobertura próxima de 58%; separação até 9 px em parte das colunas.

Apoio físico: x=881..931, y=351, largura=50 px. Cobertura mínima em ±1 px: 58.0%. Pixel opaco próximo: 0..9 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=774..809; sobreposição corporal no pouso=0.16..34.16 px. Velocidade no ar=1.420; impulso vertical=-7.200. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-0.png](visual-grupo-0.png); `src/js/config.js:113`; `src/js/environment/PlatformRenderer.js:23`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 5 — toy_drum

**Visual: Válida; salto: Válida.** Faixa do tambor coincide com apoio; baquetas elevadas são decoração.

Apoio físico: x=1030..1101, y=330, largura=71 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=904..930; sobreposição corporal no pouso=0.20..24.40 px. Velocidade no ar=1.800; impulso vertical=-7.200. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-0.png](visual-grupo-0.png); `src/js/config.js:123`; `src/js/environment/PlatformRenderer.js:24`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 6 — satin_cushion

**Visual: Válida; salto: Válida.** Contato próximo do topo da almofada, dentro de 1 px em toda a faixa.

Apoio físico: x=1203..1247, y=309, largura=44 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..1 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=1070..1100; sobreposição corporal no pouso=0.55..28.60 px. Velocidade no ar=1.950; impulso vertical=-7.200. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-0.png](visual-grupo-0.png); `src/js/config.js:133`; `src/js/environment/PlatformRenderer.js:25`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 7 — stepped_dresser

**Visual: Suspeita; salto: Válida.** Contato predominantemente contínuo (99,2%), mas 1 coluna chega a 10 px de separação. Arte do fundo do móvel cruza a altura física: opacidade não prova que seja tampo.

Apoio físico: x=1325..1450, y=288, largura=125 px. Cobertura mínima em ±1 px: 99.2%. Pixel opaco próximo: 0..10 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=1218..1246; sobreposição corporal no pouso=0.16..27.16 px. Velocidade no ar=1.420; impulso vertical=-7.200. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-0.png](visual-grupo-0.png); `src/js/config.js:137`; `src/js/environment/PlatformRenderer.js:26`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 8 — music_box

**Visual: Válida; salto: Válida.** Contato na caixa; bailarina e vidro são decoração.

Apoio físico: x=1485..1575, y=267, largura=90 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=1378..1449; sobreposição corporal no pouso=0.16..38.00 px. Velocidade no ar=1.420; impulso vertical=-7.200. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-0.png](visual-grupo-0.png); `src/js/config.js:143`; `src/js/environment/PlatformRenderer.js:27`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 9 — block_castle

**Visual: Válida; salto: Válida.** Torre estreita de 28 px tem topo visual horizontal coincidente. Pausa e salto assistido documentados.

Apoio físico: x=1636..1664, y=236, largura=28 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=1530..1574; sobreposição corporal no pouso=0.16..28.00 px. Velocidade no ar=1.420; impulso vertical=-7.200. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-0.png](visual-grupo-0.png); `src/js/config.js:153`; `src/js/environment/PlatformRenderer.js:28`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

## Fase 2 — métricas por transição

Δx é o vão entre bordas físicas no sentido do movimento; subida positiva em Δy. Janela e taxa são de dt=1; intervalo ms inclui os três dt. Margem espacial é a quantidade de posições de saída válidas em passos de 1 px.

|Destino|Objeto|Δx / Δy (px)|Margem (px)|Janela ms (min–max)|Sucesso estimado|Salto|Visual|
|---|---|---:|---:|---:|---:|---|---|
|10|train_trestle|196 / -8|65|sem prazo|100.0% (65/65)|Válida|Válida|
|11|wall_shelf|80 / 8|71|667–695|46.7% (71/152)|Válida|Válida|
|12|mushroom_lamp|92 / 12|65|586–604|44.2% (65/147)|Válida|Válida|
|13|dollhouse_roof|105 / 14|60|513–530|42.3% (60/142)|Válida|Válida|
|14|spinning_globe|120 / -8|54|431–463|39.4% (54/137)|Válida|Válida|
|15|kite_frame|135 / 22|50|372–395|37.9% (50/132)|Válida|Válida|
|16|floating_books|152 / 12|45|326–341|35.4% (45/127)|Válida|Suspeita|
|17|chandelier_crystals|170 / 16|38|262–291|31.1% (38/122)|Válida|Suspeita|
|18|curtain_rod|192 / 10|37|231–259|31.6% (37/117)|Válida|Suspeita|
|19|cuckoo_clock|218 / -10|33|216–242|29.2% (33/113)|Válida|Suspeita|
|20|wardrobe_ledge|245 / 12|31|189–220|27.7% (31/112)|Válida|Válida|
|21|grand_portal_pedestal|278 / 8|29|176–188|26.6% (29/109)|Válida|Inválida|

### Fase 2 — evidências individuais

#### 10 — train_trestle

**Visual: Válida; salto: Válida.** Frente da mesa contínua; trem desenhado atrás, sem colisão própria.

Apoio físico: x=1860..1975, y=244, largura=115 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=1599..1663; sobreposição corporal no pouso=38.00..38.00 px. Velocidade no ar=4.484; impulso vertical=-7.200. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-1.png](visual-grupo-1.png); `src/js/config.js:166`; `src/js/environment/PlatformRenderer.js:29`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 11 — wall_shelf

**Visual: Válida; salto: Válida.** Frente da prateleira contínua; relógio e globo ao fundo.

Apoio físico: x=2055..2165, y=236, largura=110 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=1904..1974; sobreposição corporal no pouso=0.15..38.00 px. Velocidade no ar=2.176; impulso vertical=-7.391. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-1.png](visual-grupo-1.png); `src/js/config.js:176`; `src/js/environment/PlatformRenderer.js:30`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 12 — mushroom_lamp

**Visual: Válida; salto: Válida.** Borda da prateleira de madeira corresponde ao apoio; abajur atrás da personagem.

Apoio físico: x=2257..2362, y=224, largura=105 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=2100..2164; sobreposição corporal no pouso=0.26..38.00 px. Velocidade no ar=2.255; impulso vertical=-7.582. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-1.png](visual-grupo-1.png); `src/js/config.js:186`; `src/js/environment/PlatformRenderer.js:32`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 13 — dollhouse_roof

**Visual: Válida; salto: Válida.** Travessa horizontal visível sobre o telhado sustenta a faixa física; telhado inclinado é decorativo.

Apoio físico: x=2467..2567, y=210, largura=100 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=2302..2361; sobreposição corporal no pouso=0.12..38.00 px. Velocidade no ar=2.354; impulso vertical=-7.773. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-1.png](visual-grupo-1.png); `src/js/config.js:192`; `src/js/environment/PlatformRenderer.js:33`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 14 — spinning_globe

**Visual: Válida; salto: Válida.** Travessa da armação de metal corresponde à hitbox; não se caminha na esfera.

Apoio físico: x=2687..2782, y=218, largura=95 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=2513..2566; sobreposição corporal no pouso=0.52..38.00 px. Velocidade no ar=2.360; impulso vertical=-7.964. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-1.png](visual-grupo-1.png); `src/js/config.js:194`; `src/js/environment/PlatformRenderer.js:34`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 15 — kite_frame

**Visual: Válida; salto: Válida.** Travessa de bambu corresponde à faixa física; corpo e cauda da pipa não são apoio.

Apoio físico: x=2917..3007, y=196, largura=90 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=2732..2781; sobreposição corporal no pouso=0.11..38.00 px. Velocidade no ar=2.627; impulso vertical=-8.155. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-1.png](visual-grupo-1.png); `src/js/config.js:196`; `src/js/environment/PlatformRenderer.js:35`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 16 — floating_books

**Visual: Suspeita; salto: Válida.** Livro aberto inclinado/curvo: há pixels em toda a linha física, mas a personagem aparece dentro do desenho das páginas, não em um contorno superior horizontal. Evidência visual, offset de borda semântico não isolável por alfa.

Apoio físico: x=3159..3244, y=184, largura=85 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=2962..3006; sobreposição corporal no pouso=0.48..38.00 px. Velocidade no ar=2.703; impulso vertical=-8.345. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-1.png](visual-grupo-1.png); `src/js/config.js:198`; `src/js/environment/PlatformRenderer.js:37`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 17 — chandelier_crystals

**Visual: Suspeita; salto: Válida.** Lustre não oferece superfície horizontal contínua: cobertura 68,8%, offsets próximos -3 a +6 px e uma coluna vazia em ±32 px.

Apoio físico: x=3414..3494, y=168, largura=80 px. Cobertura mínima em ±1 px: 68.8%. Pixel opaco próximo: -3..6 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=3206..3243; sobreposição corporal no pouso=0.27..37.27 px. Velocidade no ar=2.886; impulso vertical=-8.536. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-1.png](visual-grupo-1.png); `src/js/config.js:200`; `src/js/environment/PlatformRenderer.js:38`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 18 — curtain_rod

**Visual: Suspeita; salto: Válida.** Varão possui ornamentação curva: cobertura 77,6%, até 4 px de separação; uma coluna vazia em ±32 px.

Apoio físico: x=3686..3762, y=158, largura=76 px. Cobertura mínima em ±1 px: 77.6%. Pixel opaco próximo: 0..4 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=3457..3493; sobreposição corporal no pouso=0.00..33.00 px. Velocidade no ar=3.082; impulso vertical=-8.727. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-1.png](visual-grupo-1.png); `src/js/config.js:202`; `src/js/environment/PlatformRenderer.js:39`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 19 — cuckoo_clock

**Visual: Suspeita; salto: Válida.** Telhado pontudo do cuco cruza a linha horizontal: cobertura 69,3%, offsets próximos -9 a +11 px; topo e corpo são atravessados pela linha de pouso.

Apoio físico: x=3980..4055, y=168, largura=75 px. Cobertura mínima em ±1 px: 69.3%. Pixel opaco próximo: -9..11 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=3729..3761; sobreposição corporal no pouso=0.43..29.43 px. Velocidade no ar=3.288; impulso vertical=-8.918. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-1.png](visual-grupo-1.png); `src/js/config.js:204`; `src/js/environment/PlatformRenderer.js:40`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 20 — wardrobe_ledge

**Visual: Válida; salto: Válida.** Faixa do beiral visualmente coerente; variação raster até 1 px.

Apoio físico: x=4300..4372, y=156, largura=72 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..1 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=4024..4054; sobreposição corporal no pouso=0.12..27.12 px. Velocidade no ar=3.732; impulso vertical=-9.109. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-2.png](visual-grupo-2.png); `src/js/config.js:206`; `src/js/environment/PlatformRenderer.js:41`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 21 — grand_portal_pedestal

**Visual: Inválida; salto: Válida.** Apoio y=148 atravessa o interior do arco/efeito do portal, acima do pedestal desenhado. Centro da personagem flutua dentro do arco. A cobertura alfa de 86,7% inclui brilho, não superfície sólida; 22 colunas vazias em ±32 px. Recorte também contém fragmentos de outro objeto no canto superior direito.

Apoio físico: x=4650..4920, y=148, largura=270 px. Cobertura mínima em ±1 px: 86.7%. Pixel opaco próximo: -3..14 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=4343..4371; sobreposição corporal no pouso=0.20..24.20 px. Velocidade no ar=4.080; impulso vertical=-9.300. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-2.png](visual-grupo-2.png); `src/js/config.js:208`; `src/js/environment/PlatformRenderer.js:42`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

## Fase 3 — métricas por transição

Δx é o vão entre bordas físicas no sentido do movimento; subida positiva em Δy. Janela e taxa são de dt=1; intervalo ms inclui os três dt. Margem espacial é a quantidade de posições de saída válidas em passos de 1 px.

|Destino|Objeto|Δx / Δy (px)|Margem (px)|Janela ms (min–max)|Sucesso estimado|Salto|Visual|
|---|---|---:|---:|---:|---:|---|---|
|0|toppled_blocks|corredor / 50|120|1044–1079|25.5% (120/470)|Válida|Suspeita|
|1|floppy_ragdoll|72 / 18|98|851–886|58.7% (98/167)|Válida|Suspeita|
|2|spilled_crayons_box|95 / 18|95|778–811|60.5% (95/157)|Válida|Válida|
|3|crooked_fairytales|118 / 18|92|713–744|60.5% (92/152)|Válida|Suspeita|
|4|dented_drum|145 / 18|86|639–669|58.5% (86/147)|Válida|Válida|
|5|slumped_bear|170 / 18|87|594–629|61.3% (87/142)|Válida|Suspeita|
|6|tilted_xylophone|200 / 17|79|519–546|58.5% (79/135)|Válida|Suspeita|
|7|derailed_train|230 / 17|73|458–483|57.5% (73/127)|Válida|Inválida|
|8|wobbly_card_house|260 / 17|67|407–438|55.4% (67/121)|Válida|Inválida|
|9|leaning_music_box|290 / 16|61|361–391|53.0% (61/115)|Válida|Inválida|
|10|loose_robot|324 / 16|52|296–330|46.8% (52/111)|Válida|Válida|
|11|spinning_top|355 / 16|53|274–307|49.5% (53/107)|Válida|Suspeita|
|12|floating_spool|390 / 15|45|227–253|44.1% (45/102)|Válida|Válida|
|13|unbalanced_mobile|425 / 15|38|183–209|39.2% (38/97)|Válida|Suspeita|
|14|levitating_grimoire|460 / 14|31|153–187|33.3% (31/93)|Válida|Suspeita|
|15|true_portal_balcony|480 / 43|18|71–119|20.7% (18/87)|Suspeita|Suspeita|

### Fase 3 — evidências individuais

#### 0 — toppled_blocks

**Visual: Suspeita; salto: Válida.** Blocos têm topos em y, y−4 e y+2; colisão permanece em y. Afundamento local de 4 px no bloco central e flutuação de 2 px no direito.

Apoio físico: x=4040..4170, y=420, largura=130 px. Cobertura mínima em ±1 px: 66.2%. Pixel opaco próximo: 0..2 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=4170..4289; sobreposição corporal no pouso=0.00..38.00 px. Velocidade no ar=-2.600; impulso vertical=-7.400. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-2.png](visual-grupo-2.png); `src/js/config.js:227`; `src/js/environment/PlatformRenderer.js:1327`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 1 — floppy_ragdoll

**Visual: Suspeita; salto: Válida.** Corpo elíptico em y+12, raio vertical 10: centro do corpo ~2 px abaixo dos pés. Lã chega a y−8. Apoio cobre também regiões vazias laterais; cobertura 18,3%.

Apoio físico: x=3848..3968, y=402, largura=120 px. Cobertura mínima em ±1 px: 18.3%. Pixel opaco próximo: -7..14 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=4003..4100; sobreposição corporal no pouso=0.60..38.00 px. Velocidade no ar=-2.600; impulso vertical=-7.400. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-2.png](visual-grupo-2.png); `src/js/config.js:229`; `src/js/environment/PlatformRenderer.js:1344`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 2 — spilled_crayons_box

**Visual: Válida; salto: Válida.** Borda horizontal da caixa em y cobre a largura física.

Apoio físico: x=3638..3753, y=384, largura=115 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=3811..3905; sobreposição corporal no pouso=0.29..38.00 px. Velocidade no ar=-2.929; impulso vertical=-7.557. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-2.png](visual-grupo-2.png); `src/js/config.js:231`; `src/js/environment/PlatformRenderer.js:1376`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 3 — crooked_fairytales

**Visual: Suspeita; salto: Válida.** Livro superior desenhado de x+3 a x+w−1; hitbox começa em x. Excedente físico de 3 px à esquerda e 1 px à direita; livros inferiores são deslocados.

Apoio físico: x=3410..3520, y=366, largura=110 px. Cobertura mínima em ±1 px: 96.4%. Pixel opaco próximo: 0..6 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=3601..3692; sobreposição corporal no pouso=0.37..38.00 px. Velocidade no ar=-3.257; impulso vertical=-7.714. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-2.png](visual-grupo-2.png); `src/js/config.js:233`; `src/js/environment/PlatformRenderer.js:1398`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 4 — dented_drum

**Visual: Válida; salto: Válida.** Aro horizontal em y cobre a largura; baquetas decorativas acima.

Apoio físico: x=3160..3265, y=348, largura=105 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=3373..3458; sobreposição corporal no pouso=0.04..38.00 px. Velocidade no ar=-3.586; impulso vertical=-7.871. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-2.png](visual-grupo-2.png); `src/js/config.js:235`; `src/js/environment/PlatformRenderer.js:1411`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 5 — slumped_bear

**Visual: Suspeita; salto: Válida.** Corpo oval começa em y+1 no centro e desce nas bordas; só 55,1% do apoio fica junto à arte. Orelhas sobem até y−4 e não mudam o apoio.

Apoio físico: x=2892..2990, y=330, largura=98 px. Cobertura mínima em ±1 px: 55.1%. Pixel opaco próximo: 0..9 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=3123..3209; sobreposição corporal no pouso=0.20..38.00 px. Velocidade no ar=-3.914; impulso vertical=-8.029. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-2.png](visual-grupo-2.png); `src/js/config.js:240`; `src/js/environment/PlatformRenderer.js:1428`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 6 — tilted_xylophone

**Visual: Suspeita; salto: Válida.** Lâminas separadas por vãos de 2 px; base em y+8. Faixa física contínua inclui os vãos e margens sem lâmina.

Apoio físico: x=2602..2692, y=313, largura=90 px. Cobertura mínima em ±1 px: 73.3%. Pixel opaco próximo: 0..8 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=2855..2933; sobreposição corporal no pouso=0.60..38.00 px. Velocidade no ar=-4.243; impulso vertical=-8.186. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-2.png](visual-grupo-2.png); `src/js/config.js:242`; `src/js/environment/PlatformRenderer.js:1448`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 7 — derailed_train

**Visual: Inválida; salto: Válida.** Corpo do trem começa em y+2 e termina em x+w−14. Colisão em y e largura w: excedente vazio de 14 px à direita e flutuação de 2 px sobre o corpo. Chaminé isolada não sustenta o resto da faixa.

Apoio físico: x=2288..2372, y=296, largura=84 px. Cobertura mínima em ±1 px: 8.3%. Pixel opaco próximo: 0..2 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=2565..2637; sobreposição corporal no pouso=0.14..38.00 px. Velocidade no ar=-4.571; impulso vertical=-8.343. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-2.png](visual-grupo-2.png); `src/js/config.js:244`; `src/js/environment/PlatformRenderer.js:1461`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 8 — wobbly_card_house

**Visual: Inválida; salto: Válida.** Duas linhas de cartas encontram-se só no centro em y; extremidades ficam em y+14. Faixa física plana cobre espaço vazio acima das cartas (87,2% fora da vizinhança de 1 px). Balanço não acompanha a colisão.

Apoio físico: x=1950..2028, y=279, largura=78 px. Cobertura mínima em ±1 px: 12.8%. Pixel opaco próximo: 0..13 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=2251..2317; sobreposição corporal no pouso=0.10..38.00 px. Velocidade no ar=-4.900; impulso vertical=-8.500. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-3.png](visual-grupo-3.png); `src/js/config.js:246`; `src/js/environment/PlatformRenderer.js:1477`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 9 — leaning_music_box

**Visual: Inválida; salto: Válida.** Tampo da caixa desenhado em y+4, colisão em y. Personagem fica 4 px acima da caixa; pequena bailarina central é a única arte próxima do plano físico.

Apoio físico: x=1586..1660, y=263, largura=74 px. Cobertura mínima em ±1 px: 8.1%. Pixel opaco próximo: -1..4 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=1913..1973; sobreposição corporal no pouso=0.49..38.00 px. Velocidade no ar=-5.229; impulso vertical=-8.657. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-3.png](visual-grupo-3.png); `src/js/config.js:248`; `src/js/environment/PlatformRenderer.js:1496`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 10 — loose_robot

**Visual: Válida; salto: Válida.** Corpo retangular do robô em y acompanha o apoio. Antena é decoração elevada.

Apoio físico: x=1192..1262, y=247, largura=70 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=1549..1600; sobreposição corporal no pouso=0.99..38.00 px. Velocidade no ar=-5.557; impulso vertical=-8.814. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-3.png](visual-grupo-3.png); `src/js/config.js:253`; `src/js/environment/PlatformRenderer.js:1509`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 11 — spinning_top

**Visual: Suspeita; salto: Válida.** Pião triangular tem vértice em y−6, laterais em y+5 e recuo de 4 px em cada lado. Apoio horizontal atravessa a forma; animação desloca o vértice em ±3 px.

Apoio físico: x=772..837, y=231, largura=65 px. Cobertura mínima em ±1 px: 69.2%. Pixel opaco próximo: 0..4 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=1155..1207; sobreposição corporal no pouso=0.80..38.00 px. Velocidade no ar=-5.886; impulso vertical=-8.971. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-3.png](visual-grupo-3.png); `src/js/config.js:255`; `src/js/environment/PlatformRenderer.js:1530`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 12 — floating_spool

**Visual: Válida; salto: Válida.** Topo retangular do carretel em y; fita é decoração sem apoio.

Apoio físico: x=322..382, y=216, largura=60 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=735..779; sobreposição corporal no pouso=0.50..38.00 px. Velocidade no ar=-6.214; impulso vertical=-9.129. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-3.png](visual-grupo-3.png); `src/js/config.js:257`; `src/js/environment/PlatformRenderer.js:1548`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 13 — unbalanced_mobile

**Visual: Suspeita; salto: Válida.** Haste vai de y a y+3; hitbox permanece horizontal. Diferença geométrica chega a 3 px à direita, reduzida no raster pela espessura de 1,8 px.

Apoio físico: x=-159..-103, y=201, largura=56 px. Cobertura mínima em ±1 px: 85.7%. Pixel opaco próximo: 0..2 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=285..322; sobreposição corporal no pouso=0.29..30.74 px. Velocidade no ar=-6.543; impulso vertical=-9.286. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-3.png](visual-grupo-3.png); `src/js/config.js:259`; `src/js/environment/PlatformRenderer.js:1567`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 14 — levitating_grimoire

**Visual: Suspeita; salto: Válida.** Capa oscila verticalmente em ±3 px (sin(tick*0.2)*3), hitbox permanece em y. Aura translúcida interfere na opacidade: alfa 100% no plano não valida contato com a capa.

Apoio físico: x=-669..-619, y=187, largura=50 px. Cobertura mínima em ±1 px: 96.0%. Pixel opaco próximo: 0..3 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=-196..-166; sobreposição corporal no pouso=0.51..23.64 px. Velocidade no ar=-6.871; impulso vertical=-9.443. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-3.png](visual-grupo-3.png); `src/js/config.js:261`; `src/js/environment/PlatformRenderer.js:1582`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

#### 15 — true_portal_balcony

**Visual: Suspeita; salto: Suspeita.** Terraço desenhado em x−10..x+w+10 e y−4; colisão x..x+w, y. Faixa visível não colide nos 10 px laterais e pés afundam 4 px no topo. Último salto também tem margem temporal crítica.

Apoio físico: x=-1419..-1149, y=144, largura=270 px. Cobertura mínima em ±1 px: 100.0%. Pixel opaco próximo: 0..0 px (não equivale a contorno sólido). Sola/plano: <1e−8 px; discrepância horizontal de borda G-01 registrada individualmente.

Saídas de sucesso em dt=1: x=-706..-689; sobreposição corporal no pouso=0.60..10.60 px. Velocidade no ar=-7.200; impulso vertical=-9.600. No castelo, a velocidade calculada depende da posição sintética de saída; o runtime centraliza a espera.

Evidência: [visual-grupo-3.png](visual-grupo-3.png); `src/js/config.js:264`; `src/js/environment/PlatformRenderer.js:1608`. Arrays completos de offsets, por coluna/tick, em `metricas-visuais.json`.

## Limitações e integridade

Não houve teste humano de dificuldade. A busca é discreta (1 px) e usa três dt constantes, não todas as sequências possíveis de frame time. O render é inspecionado em poses centrais, com medição separada das bordas e de três ticks; não cobre todos os efeitos de câmera, oclusões ou frames de animação. Fase 3 inclui análise do renderer procedural e simulação dos trechos de produção; não foi executada uma partida humana contínua até o portal.

A pasta solicitada não existia no início: não havia relatórios antigos nela a substituir. `tmp/dark-room/review` é outro caminho e não foi alterado. A comprovação final de arquivos/hashes está em `integridade-final.json`. Nenhum código, asset, hitbox, parâmetro ou posicionamento foi editado nesta auditoria.
