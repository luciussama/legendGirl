# Guia de edição de sprites para designers e desenvolvimento

Antes de editar, consulte `docs/diario-ia/CONTEXTO-ATUAL.md`. O [mapa completo](MAPA-SPRITES.md) identifica cada imagem existente, dimensões, nomes usados pelo carregador e consumidores no código. O [inventário JSON](inventario.json) contém hashes e referências completas. O [mapa de recortes](RECORTES.md) localiza poses e objetos dentro das pranchas.

## Localização e consumidores

| Arte / fase | Arquivos que a equipe pode editar | Integração e metadados |
| --- | --- | --- |
| Menina oficial na exploração/plataformas | `assets/art/characters/girl-v2/source/` e `runtime/`; atlas oficial anterior preservado | `src/js/assets/officialCharacter.js`, `src/js/entities/BabyRenderer.js`, `src/js/toy-room/ToyRoomEntities.js`. Metadados: `illustratedGirl.js`; preparação: `scripts/prepare-illustrated-girl.js`. A extração oficial anterior continua disponível. |
| Menina na arena | `assets/art/characters/girl-v2/` (poses) e `assets/art/toy-room/battle/girl/special/` (close do especial) | `ArenaGirlAnimationFrames.js`, `ArenaPlayerRenderer.js`, `BattleGirlFrames.js`, `ToyRoomBattle.js` e manifestos dedicados em `assets/art/toy-room/battle/`. Consulte `docs/arena/GUIA-ANIMACAO.md` para poses, antecipação e âncoras. |
| Inimigos: trem, robô, dinossauro e urso | `assets/art/toy-room/battle/`, subpastas de cada personagem | `BattleAssets.js` carrega os recursos; `BattleRenderer.js` e `BattlePresentation.js` apresentam os quadros; `ToyRoomBattle.js` mantém a simulação. Manifestos dedicados e `docs/battle-mode/battle-sprite-production.md`. Animação e eventos de dano não são definidos apenas pelas imagens. |
| Plataformas do quarto escuro | `assets/art/dark-room/platforms/`, `sprites/`, `modern/`, `corrections/` | `src/js/environment/PlatformRenderer.js`, `PLATFORM_SURFACES`, `StorybookPlatforms.js`, `src/js/assets/darkRoomAtlas.js`, `src/js/config.js`. Metadados calibram o desenho; `DarkRoomContact` extrai o contorno de apoio da arte carregada. |
| Atlas consolidado do quarto escuro | `assets/art/dark-room/production-spritesheet.png` | Gerado por `scripts/build-dark-room-atlas.js`; coordenadas em `darkRoomAtlas.js` e `assets/art/dark-room/darkRoomAtlas.json`. Evite editar só a prancha gerada e deixar os PNGs de origem divergentes. |
| Cenário decorativo atual | `assets/art/dark-room/scenery-current/` | `src/js/assets/currentScenery.js`, `BackgroundRenderer.js`, `assets/manifest.json`. Dez PNGs novos e sete ilustrações reutilizadas; a lista exata está em `currentScenery.js`. |
| Piso, paredes, tapetes e detalhes da Toy Room | `assets/art/toy-room/stage1/`, `environment-sheet.png` | `RoomEnvironmentRenderer.js`, `ToyRoomEnvironmentAssets.js`, `ToyRoomPhase.js`, `assets/manifest.json`. `ToyRoomEnvironmentAssets.js` resolve os recortes da prancha para a fase; não mover suas regiões sem atualizar os consumidores. |
| Transporte e móveis da Toy Room | `stage2/`, `stage3/`, `chest-brinquedos-v1.png` | `ToyRenderer.js`, `RoomEnvironmentRenderer.js`, `ToyRoomPhase.js`; READMEs e prompts dentro das pastas stage1/2/3. |
| Fada ilustrada | `assets/art/toy-room/stage3/illustrated-fairy-v1.png` | `src/js/entities/FairyRenderer.js` e `src/js/toy-room/ToyRoomEntities.js`. Mesma arte usada nas duas fases, com escalas de apresentação diferentes. |
| Arena heroica e estruturas | Artes consumidas por `ArenaEnvironment.js` e `ToyRoomArenaBuilder.js` | A arena reaproveita a sala, com transformações, escala e câmera próprias. Revise esses módulos antes de substituir uma arte compartilhada; não presumir que cada estrutura possui um PNG exclusivo. |
| Abertura | `assets/art/dark-room/opening/` | `src/js/cinematics/OpeningSequence.js` e consumidores localizados no mapa; README da pasta informa origem e composição. |
| Retratos e efeitos de interface | [Desenhos em código](DESENHOS-EM-CODIGO.md) | `src/js/ui/DialogueRenderer.js`, HUDs e efeitos Canvas. Não há necessariamente um PNG para editar; mudanças precisam de integração com desenvolvimento. |

## Como editar sem quebrar o jogo

1. Identifique o arquivo e todos os usos no mapa. Uma imagem compartilhada pode afetar exploração, abertura e arena. Use `rg -n 'nome-da-chave|nome-do-arquivo' src assets scripts` para confirmar.
2. Preserve identidade da menina, paleta, materiais e assinatura gráfica aprovada. Use as artes atuais como referência; nomes parecidos e documentos históricos não certificam que um recurso antigo pode voltar ao jogo.
3. Para substituição direta, mantenha caminho, formato, tamanho do canvas, transparência e enquadramento. Se precisar mudar isso, entregue também novos metadados: coordenadas de recorte, dimensões, âncoras dos pés/mãos e escalas de apresentação.
4. Nos atlas, conserve espaçamento entre quadros e evite pixels fora do recorte. Em poses agachadas, articule o corpo mantendo proporções; não reduza a personagem inteira. Ataques exigem antecipação, trajetória, impacto e recuperação sincronizados com o código.
5. Preserve a geometria lógica: colisões, distâncias de salto, posicionamento e dificuldade são responsabilidade do gameplay. Nenhuma linha, barra ou régua de contato deve aparecer sobre plataformas no jogo normal. A exceção do relógio cuco está em `AGENTS.md`.
6. A equipe de design entrega a arte e uma nota do que mudou. Desenvolvimento atualiza manifestos, recortes e renderizadores quando necessário, reconstrói derivados e executa os testes.
7. Atualize o mapa com `npm run docs:sprites` e registre caminhos, decisões, evidências e pendências no diário. Não apague relatórios anteriores nem reescreva uma aprovação técnica como aprovação artística.

## Originais, derivados e recursos aposentados

Os geradores em `scripts/` e os READMEs das pastas de arte documentam a origem de cada recurso. Antes de executar um exportador, leia seu código: ele pode sobrescrever arquivos. Edição de atlas requer coordenação entre arte original, PNGs extraídos, manifestos e coordenadas.

A limpeza de 13/10/2026 removeu 33 imagens e 46 assinaturas procedurais conforme `docs/sprite-review/selecoes-exclusao.json`. Esse JSON é uma decisão histórica, não um comando para remover imagens novas. Consulte os relatórios de limpeza e substituição. Não restaurar variantes aposentadas como fallback. A quarentena local não é uma fonte de produção.

## Validação e entrega

Para todas as mudanças: `npm run check-assets`, `npm run build` e testes relevantes. Para personagens ou gameplay, execute `npm test`. Use `npm run test:arena:animation` para a menina da arena, `npm run test:current-art` para os cenários substitutos e `npm run verify:dark-room` para plataformas e contato dos pés.

Os testes de navegador exigem servidor e Chrome de QA nas portas documentadas nos scripts. `npm run test:toy-room:arena:browser` percorre exploração, transformação, combate, save/load e retorno. `npm run test:current-art:browser` cobre o percurso de plataformas e os elementos decorativos. Emulação Android não equivale a teste em aparelho físico.

Registre no diário a lista de arquivos, derivados reconstruídos, mudanças em dimensões/âncoras, testes reais e limites. Capturas regeneráveis são produzidas temporariamente e identificadas por caminho/hash/tamanho; não versionar bitmaps de evidência. Registre aprovação humana separadamente da validação técnica.

## Consumidores após a separação de responsabilidades

`ToyRoomInitialEntities` mantém o catálogo e as medidas lógicas; `ToyRoomMovement` resolve colisões. O desenho da sala é composto por `ToyRoomSceneRenderer` com dados de `ToyRoomSceneFrame`, usando os renderizadores de móveis/brinquedos/atores existentes. `ToyRoomEnvironmentAssets` resolve os recortes. A espada e seus quadros são apresentados por `ToyRoomStoryRenderer`; mensagens de orientação, por `ToyRoomTutorialRenderer`. `ToyCarryPresentation` compõe a pose de transporte. Nenhuma dessas extrações cria autorização para mudar medidas físicas por uma alteração artística.

Na arena, BattleAssets lê `battle/remediation/manifest.json` e substitui Hit por DamageSpriteFrames; ArenaPlayerRenderer carrega as poses próprias da menina. Consulte [arquitetura e proprietários](../ARQUITETURA.md), [guia da arena](../arena/GUIA-ARENA.md) e [comandos](../COMANDOS.md) antes de reconstruir derivados. Para descobrir fontes/testes que já não estão na árvore, use journal:search/journal:show.

## Tela inicial e perseguição

A tela inicial consome `assets/art/title-screen/` por `TitleScene`, com fontes, prompts e resolução nativa registrados em `prompts.json`. O tamanho de composição do canvas não muda a resolução da fonte. `TITLE_SCENE_LAYOUT` fixa a poltrona sobre o tapete em coordenadas 1920×1080. `titleSceneFrame` aplica uma única câmera ao quarto, à poltrona e às pernas animadas; no retrato, desloca o foco horizontal para a menina. Ajustes responsivos devem reenquadrar a composição inteira, sem reposicionar ou redimensionar a poltrona separadamente do piso.

A fuga combina introdução ilustrada em `assets/art/toy-room/bear-chase/cinematic/` com modelos locais e materiais ilustrados de `assets/models/bear-chase/` e `assets/art/toy-room/bear-chase/`. `ChaseIntroRenderer`, `ChaseGirlModel`, `ChaseBearModel` e as fábricas em `bear-chase/props/` são consumidores distintos. Na corrida WebGL, `ChaseFairyModel` constrói um pequeno núcleo branco/ciano com aura azul, quatro asas peroladas e voo orbital ao redor da menina; `ChaseLighting` fornece luz e sombras locais. A ilustração compartilhada continua nas fases 2D e na entrada ilustrada. Consulte o [guia da fuga](../bear-chase/GUIA-PREVIA.md) antes de alterar poses, modelos ou atlas.

O piso 3D usa o recorte (27,151), 186×48, de `environment-sheet.png`; a cópia RGBA 256×64 e seus mipmaps são preparados em memória por `ChaseRenderer3D`, sem novo PNG. A GPU valida esse piso antes de liberar a sala; uma alternativa usa o mesmo recorte em canvas com filtro linear quando a cadeia manual não funciona. Não modificar a prancha para resolver um problema de upload. Paleta e GLB da menina têm exportadores próprios; leia os scripts antes de executá-los. A aprovação da arena ou de versões anteriores não homologa automaticamente novos modelos e poses.

O especial da arena usa `girl/special/eyes-power-v1.png` como corte de anime exclusivo da carga. A arte frontal conserva os dois olhos visíveis, cabelo e íris castanhos, expressão de determinação e reflexos arco-íris. O recorte animado usa foco vertical em 57,5% da imagem; preserve a região dos olhos ao substituir. O prompt e a proveniência ficam em `girl/special/prompts.json`. Esse recurso é arte consumida pelo jogo, não evidência descartável.


## Introdução da sala de brinquedos

`assets/art/toy-room/introduction/room-v1.png` é uma pintura em perspectiva na altura dos olhos; `girl-acting-v1.png` reúne quatro poses expressivas transparentes. `ToyRoomIntroduction` consome ambas pelo manifesto principal, sem desenhar sprites nem mapa da exploração. Os recortes e âncoras dos sapatos estão no módulo e em `prompts.json`; preservar margens acima do cabelo. A fada conserva a arte ilustrada compartilhada. O quadro superior da narração é desenhado em Canvas por `PoeticNarrator`, com papel creme, rosa/sálvia e fonte Caveat local; não faz parte do bitmap do cenário.

## Superfícies do quarto escuro

`DarkRoomContact.prepare` mede os pixels opacos dos objetos a partir da altura nominal de apoio. Mudanças de transparência, recorte ou largura podem alterar a superfície física; revise também bordas e travessias com `journal:qa -- test:contato:browser`. Não estique `standRegion` para corrigir uma colisão: ele também calibra a escala da imagem. Urso/livros compartilham apoio contínuo. Os sapatos completos contam nas duas direções, com envelope estável entre quadros.

## Direção compartilhada da menina e baú aberto

A menina usa a qualidade da pose de transporte aprovada em 23/10/2026 em todas as poses 2D jogáveis. Consulte `assets/art/characters/girl-v2/README.md`. Expressão brava é exclusiva da arena/poses com espada; exploração mantém expressão suave. Não sobrescrever o atlas oficial nem as pranchas-fonte. O modelo da corrida interpreta a mesma roupa e proporções em volume, com duas marias-chiquinhas e laços; detalhes rígidos são agrupados por material e articulação, bordado é instanciado com baixa tesselação.

`assets/art/toy-room/chest-brinquedos-open-v2.png` é a pintura aberta da arena, com origem/prompt no JSON adjacente. A cavidade e a tampa ficam atrás dos inimigos; um polígono acompanha a borda frontal e a lateral pintadas em `ArenaEnvironment`. Ao editar a perspectiva, recalibrar esse recorte e `transportOrigin` no layout. O baú fechado da exploração conserva sua arte. Tempos de transporte e combate não são definidos pela imagem.

## Jardim e roupa do dia seguinte

`assets/art/garden/` preserva fontes, prompts, duas pranchas da menina (16 poses), cenário e atlas de objetos (nove elementos). `scripts/prepare-garden-art.js` gera runtime, manifesto e `GardenArt.js`; `GardenRenderer` é o consumidor. A árvore pode atravessar a divisão nominal da prancha e exige recorte por alfa conectado. Preserve o rosto/proporções girl-v2 e a roupa inspirada na foto: camiseta amarela, salopete turquesa com doces e calçado rosa/branco. A fotografia pessoal não integra o acervo. Verifique poses e transparência antes de substituir as pinturas. O guia completo está em `docs/garden/GUIA-JARDIM.md`.

Jardim v2: `menina-desconforto-v1.png` fornece passos altos e expressões preocupadas; `ambiente-v2.png` contém casa, grama alta, pedrinhas e piquenique; `lagarta-vermelha-v1.png` contém duas poses do primeiro dano. Fontes e prompts em `assets/art/garden/`. A massa de chão fixo é contínua: não repetir as extremidades arredondadas de plataformas isoladas. Toalha e convidados ficam no chão ao lado das raízes, sem cobrir a árvore.

Atuação das pedrinhas: quatro poses em `source/menina-pedrinhas-v2.png`, com prompt correspondente e runtime de 2×2 células. A grama de primeiro plano deve ocultar sapatos sem reposicionar o corpo. Bases rochosas e água frontal fecham o contato visual do rio sem mudar os apoios. Conservar acabamento só nas bordas externas e junção suave de materiais do chão único.

Jardim atual: `source/terra-continua-v1.png` é o material contínuo do subsolo (prompt em `prompts-terra-v1.json`). A faixa de folhas baixas continua sob a grama; morros arredondados usam pequenas faixas altas, sem cobertura integral. Após modificar os sapatos ou apoios, `prepare-garden-contact.js` recompõe os dados físicos por pixels. Revise poses, superfícies, equilíbrio nas bordas e transporte das rodas; não substituir esse contrato por centro/insets genéricos.


A revisão vegetal do jardim usa `source/parede-vegetal-v1.png` e os recortes decorativos de `runtime/vida-aquatica-v1.png`; fontes e prompts em `assets/art/garden/`. `prepare-garden-visuals.js` prepara pilar, peixes e plantas em `GardenVisualArt.js`, sem alterar a superfície física dos tampos. A cobertura verde reveste faces e laterais; a grama alta nasce na folhagem baixa. Preserve a geometria dos apoios e a câmera lateral ao editar esses recursos.

## Cenas narrativas de Yuna no jardim

A menina tem seu nome revelado como Yuna pela fala de Nanda na saída de casa. As cenas atuais usam `GardenCinematic.js`, seguindo a atuação em camadas de `ToyRoomIntroduction`. Em `assets/art/garden/cinematic/`, dois cenários conservam lugares vazios para Yuna/Nanda e a prancha transparente fornece oito atuações; prompts integrais no mesmo diretório. `prepare-garden-cinematic.js` isola os componentes, evitando fragmentos da pose vizinha, e gera o atlas/âncoras em `GardenCinematicArt.js`. Preserve roupa, escala relativa e identidade. No final, Yuna descansa sentada e Nanda pousa ao lado, com pão e suco na escala da sua mãozinha. As composições antigas em `narrative/` e `docs/diario-ia/arte/cenas-yuna-v1/` permanecem como referências. Planos cinematográficos podem reenquadrar a atuação; a câmera jogável continua somente lateral. As falas respeitam a barra superior.

`source/abelha-camadas-v2.png` separa corpo e asas. `GardenBeeRenderer` desenha o mesmo corpo em todos os quadros e articula as asas pela raiz, com escala fixa. Não voltar a alternar as duas poses antigas: a diferença de corpo/âncora causa tremor. O preparador cinematográfico mede estas camadas, preservando o alfa; o prompt está em `prompts-abelha-camadas-v2.json`. Não recalibrar hitboxes para uma correção de batimento.

Os novos bichos usam `source/insetos-v1.png`, `runtime/insetos-v1.png` e `GardenInsectArt.js`, preparados por `prepare-garden-insects.js`. A abelha usa corpo para contato, sem incluir asas; a minhoca colide apenas com a parte exposta, sem suas pedras decorativas. O besouro voa e é inofensivo. Medo de Yuna usa fonte `source/menina-medo-v1.png` e quatro pranchas geradas por `prepare-garden-fear.js`. A preparação troca a região da cabeça e preserva o restante do corpo e os sapatos pixel a pixel; não exige recalcular as solas nem modifica a velocidade. Suor e oscilação do tronco são apenas visuais. Prompts completos em `prompts-insetos-v1.json` e `prompts-medo-v1.json`.
