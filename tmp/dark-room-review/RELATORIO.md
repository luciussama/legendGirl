# Revisão artística e validação funcional

## Resultado atual

As 38 plataformas foram revistas segundo `assets/art/dark-room/environment-assets-concept.png`. Castelo e pião receberam PNGs novos; os elementos procedurais da fase 3 foram redesenhados com materiais, contornos, texturas e detalhes. Assets recentes adequados foram mantidos. Foram preservados os detalhes de mobiliário que entraram na revisão `7579102` durante o trabalho.

A linguagem adotada usa luz âmbar, madeira escura, tecidos envelhecidos, papel creme, cantaria e latão. Não foram recebidos anexos adicionais nesta rodada; a comparação usa o conceito oficial e as capturas existentes.

**Física preservada byte a byte:** `game.js`, `config.js`, os dois módulos de estado, `BabyRenderer.js` e a referência de física. Nenhuma hitbox, coordenada funcional, gravidade, velocidade ou janela de salto foi alterada. Mudanças estão nos renderizadores, manifesto, assets, testes e evidências.

## Validações

- 114 transições no loop real: 38 destinos × dt 0,5/1/1,2, incluindo fase 3.
- 900 frames de espera no castelo e salto assistido exclusivo dessa saída passaram.
- 38 superfícies × 3 ticks: 100% das colunas com arte opaca a até 1 px da linha física. Complementado por inspeção visual: alfa sozinho não prova material sólido.
- Testes de hitbox, progressão, contato dos sapatos e manifesto passaram.
- As 22 revisões antigas foram regeneradas em `../dark-room/review`, incluindo cenas, hitboxes, detalhes e JSONs. Fase 3 nas capturas 2/3 e em `runtime-metricas.json`.

## Limitação preservada por exigência funcional

A colisão existente admite apoio por pequena sobreposição do corpo mesmo quando os sapatos estão fora da borda (5,44–8,44 px de separação na pose medida). Não foi alterada porque isso mudaria a jogabilidade. O contato central e os apoios locais foram alinhados; não se afirma que todos os pousos extremos dessa tolerância herdada tenham contato visual perfeito. O salto final da fase 3 mantém a margem anterior de 71–119 ms.

## Comparação por elemento

|Fase/índice|Elemento|Auditoria anterior|Atualização e motivo|
|---|---|---|---|
|1/0|giant_bear|Válida|Mantido: urso ilustrado recente.|
|1/1|open_books|Suspeita|Borda de papel nivelada com páginas texturizadas.|
|1/2|vanity_table|Válida|Mantido: tampo e acessórios ilustrados recentes.|
|1/3|small_dresser|Suspeita|Acabamento de madeira no plano do tampo.|
|1/4|messy_blocks|Suspeita|Face de apoio do bloco A nivelada nos 50 px existentes.|
|1/5|toy_drum|Válida|Mantido: aro e tambor ilustrado.|
|1/6|satin_cushion|Válida|Mantido: veludo recente e apoio revalidado.|
|1/7|stepped_dresser|Suspeita|Acabamento do tampo alinhado a toda a largura física.|
|1/8|music_box|Válida|Mantido: caixa, bailarina e vidro recentes.|
|1/9|block_castle|Válida|Novo PNG de cantaria ilustrada e bandeira; torre central mantém apoio de 28 px.|
|2/10|train_trestle|Válida|Trem atrás de tampo contínuo; detalhes da mesa nova preservados.|
|2/11|wall_shelf|Válida|Prateleira com frente contínua e suportes abaixo dos brinquedos.|
|2/12|mushroom_lamp|Válida|Abajur atrás de prateleira de madeira, com suportes abaixo.|
|2/13|dollhouse_roof|Válida|Fachada detalhada da revisão recente preservada; cumeeira revalidada.|
|2/14|spinning_globe|Válida|Travessa ligada a uma armação de latão.|
|2/15|kite_frame|Válida|Travessa ligada à pipa por amarrações.|
|2/16|floating_books|Suspeita|Livro remodelado com capa, páginas, lombada e marcador, sem apoio no vazio.|
|2/17|chandelier_crystals|Suspeita|Aro alinhado aos pés; velas atrás e cristais abaixo.|
|2/18|curtain_rod|Suspeita|Varão de latão nivelado.|
|2/19|cuckoo_clock|Suspeita|Apoio de madeira com suportes ligados ao corpo do relógio.|
|2/20|wardrobe_ledge|Válida|Mantido: beiral recente.|
|2/21|grand_portal_pedestal|Inválida|Pedestal alinhado aos pés, arco acima e recorte vizinho removido.|
|3/0|toppled_blocks|Suspeita|Blocos com pintura gasta, letras, madeira e faces niveladas.|
|3/1|floppy_ragdoll|Suspeita|Boneca com rosto, lã, tecido sombreado e costuras; vestido dobrado como apoio.|
|3/2|spilled_crayons_box|Válida|Caixa de madeira com giz revestido em papel e sombreado.|
|3/3|crooked_fairytales|Suspeita|Capas, páginas, cantoneiras e topo contínuo.|
|3/4|dented_drum|Válida|Corpo, cordas e aros de latão texturizados.|
|3/5|slumped_bear|Suspeita|Urso ilustrado oficial reaproveitado na escala local.|
|3/6|tilted_xylophone|Suspeita|Lâminas envelhecidas, fixações e base de madeira contínua.|
|3/7|derailed_train|Inválida|Trem ilustrado sobre pequeno estrado.|
|3/8|wobbly_card_house|Inválida|Cartas com volume e teto de carta horizontal.|
|3/9|leaning_music_box|Inválida|Caixa com painel, ornamentos dourados e tampa nivelada.|
|3/10|loose_robot|Válida|Metal envelhecido, olhos de vidro, rebites e topo plano.|
|3/11|spinning_top|Suspeita|Novo PNG de madeira e latão com topo adaptado à hitbox.|
|3/12|floating_spool|Válida|Madeira, fio texturizado e fita abaixo da tampa estável.|
|3/13|unbalanced_mobile|Suspeita|Travessa estável com ornamentos animados abaixo.|
|3/14|levitating_grimoire|Suspeita|Capa, páginas, marcador e cantoneiras; somente o brilho oscila.|
|3/15|true_portal_balcony|Suspeita|Portal ilustrado substitui retângulos antigos; pedestal no apoio existente.|

## Evidências

- [Galeria antes/depois](evidencias.html).
- `visual-grupo-0.png` a `visual-grupo-3.png`: todas as plataformas atualizadas.
- `antes/`: comparação histórica com a auditoria original.
- `metricas-visuais.json`: dados novos por coluna/tick; `plataformas-consolidado.json`: alterações por elemento.
- `metricas-saltos.json` e `transicoes.csv`: medidas anteriores revalidadas por identidade do código físico e testes de navegação.
- `runtime-metricas.json`: 114 aterrissagens observadas no navegador.
- `integridade-final.json` e `fisica-validacao.txt`: prova da preservação funcional.

## Produção da arte e limites

Gerados `assets/art/dark-room/modern/block_castle.png` e `spinning_top.png` pela imagegen integrada. A ferramenta atingiu o limite depois dessas duas imagens; o restante foi concluído com sprites oficiais e desenhos nativos do Canvas. Nenhuma API alternativa foi usada. Prompts e proveniência em `assets/art/dark-room/modern/README.md`.

A cobertura raster usa três instantes de animação, não prova todas as oclusões/câmeras. Os testes de navegador buscam uma saída válida por transição; as taxas do CSV vêm da varredura de posições anterior, não de testes humanos. A limitação corporal de borda acima continua documentada, apesar da melhora do apoio visual.

## Porta falsa aprovada — aplicada

O quadro `assets/art/dark-room/corrections/false_door.png` substitui o portal luminoso da primeira saída. O arco decorativo antigo foi removido nessa plataforma; a base e sua linha de apoio em y=148 permanecem. O quadro mantém sua proporção original e acompanha os valores existentes de rotação e queda durante a revelação. O portal verdadeiro da fase 3 conserva seu desenho.

Evidência atual: `../dark-room/review/21-scene.png`, `21-hitbox.png` e `21-support.png`. Validação: 66 cenários de salto no navegador até a primeira saída, todos aprovados; contato final dos pés em y=148. `npm run verify:dark-room` e `npm run check-assets` aprovados. Os seis arquivos protegidos pelo manifesto `fisica-antes.sha256` continuam com hashes idênticos. Registro dos testes: `testes-porta.txt`.

## Remoção de traços artificiais sobre os objetos

Removida a aplicação genérica de barras de contato sobre sprites (incluindo livros, banquinho, ABC e estante), assim como a linha luminosa auxiliar dos desenhos procedurais. Os tampos e prateleiras estruturais permanecem. A proibição de acrescentar marcadores de pouso sobre ilustrações foi registrada em `AGENTS.md`.

Verificação: suíte `verify:dark-room` aprovada (`testes-sem-tracos.txt`); 15 cenários de salto no navegador até os blocos ABC aprovados; imagem atual em `../dark-room/review/04-scene.png`. Os seis hashes de física protegidos permanecem idênticos.
