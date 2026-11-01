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

A menina usa a qualidade da pose de transporte aprovada em 23/10/2026 em todas as poses 2D jogáveis. Consulte `assets/art/characters/girl-v2/README.md`. Expressão brava é exclusiva da arena/poses com espada; exploração mantém expressão suave. Não sobrescrever o atlas oficial nem as pranchas-fonte. O modelo da corrida interpreta a mesma roupa em volume, com duas marias-chiquinhas e laços. A revisão5 distribui proporções entre cabeça/cabelo, tronco e membros; sola e comprimentos do rig são compartilhados com o solver de apoio. Sua aprovação artística continua específica; detalhes rígidos são agrupados por material e articulação, bordado é instanciado com baixa tesselação.

`assets/art/toy-room/chest-brinquedos-open-v2.png` é a pintura aberta da arena, com origem/prompt no JSON adjacente. A cavidade e a tampa ficam atrás dos inimigos; um polígono acompanha a borda frontal e a lateral pintadas em `ArenaEnvironment`. Ao editar a perspectiva, recalibrar esse recorte e `transportOrigin` no layout. O baú fechado da exploração conserva sua arte. Tempos de transporte e combate não são definidos pela imagem.

## Jardim e roupa do dia seguinte

`assets/art/garden/` preserva fontes, prompts, duas pranchas da menina (16 poses), cenário e atlas de objetos (nove elementos). `scripts/prepare-garden-art.js` gera runtime, manifesto e `GardenArt.js`; `GardenRenderer` é o consumidor. A árvore pode atravessar a divisão nominal da prancha e exige recorte por alfa conectado. Preserve o rosto/proporções girl-v2 e a roupa inspirada na foto: camiseta amarela, salopete turquesa com doces e calçado rosa/branco. A fotografia pessoal não integra o acervo. Verifique poses e transparência antes de substituir as pinturas. O guia completo está em `docs/garden/GUIA-JARDIM.md`.

Jardim v2: `menina-desconforto-v1.png` fornece passos altos e expressões preocupadas; `ambiente-v2.png` contém casa, grama alta, pedrinhas e piquenique; `lagarta-vermelha-v1.png` contém duas poses do primeiro dano. Fontes e prompts em `assets/art/garden/`. A massa de chão fixo é contínua: não repetir as extremidades arredondadas de plataformas isoladas. Toalha e convidados ficam no chão ao lado das raízes, sem cobrir a árvore.

Atuação das pedrinhas: quatro poses em `source/menina-pedrinhas-v2.png`, com prompt correspondente e runtime de 2×2 células. A grama de primeiro plano deve ocultar sapatos sem reposicionar o corpo. Bases rochosas e água frontal fecham o contato visual do rio sem mudar os apoios. Conservar acabamento só nas bordas externas e junção suave de materiais do chão único.

Jardim atual: `source/terra-continua-v1.png` é o material contínuo do subsolo (prompt em `prompts-terra-v1.json`). A faixa de folhas baixas continua sob a grama; morros arredondados usam pequenas faixas altas, sem cobertura integral. Após modificar os sapatos ou apoios, `prepare-garden-contact.js` recompõe os dados físicos por pixels. Revise poses, superfícies, equilíbrio nas bordas e transporte das rodas; não substituir esse contrato por centro/insets genéricos.


A revisão vegetal do jardim usa `source/parede-vegetal-v1.png` e os recortes decorativos de `runtime/vida-aquatica-v1.png`; fontes e prompts em `assets/art/garden/`. `prepare-garden-visuals.js` prepara pilar, peixes e plantas em `GardenVisualArt.js`, sem alterar a superfície física dos tampos. A cobertura verde reveste faces e laterais; a grama alta nasce na folhagem baixa. Preserve a geometria dos apoios e a câmera lateral ao editar esses recursos.

## Cenas narrativas de Yuna no jardim

Na chegada jogável, o piquenique usa `source/piquenique-lateral-v3.png`, preparado por `prepare-garden-picnic.js` em `runtime/piquenique-lateral-v3.png`/`GardenPicnicArt.js`. A perspectiva é baixa e a toalha fica no plano do chão, sem usar a borda frontal da franja como única âncora. Preserve a separação horizontal das raízes. Não mudar hitbox, meta ou plataformas para corrigir apoio visual. As cenas mostram somente o quadro de diálogo sobre a pintura inteira, sem tarja clara de largura total, tanto para narrador quanto para personagens.

A menina tem seu nome revelado como Yuna pela fala de Nanda na saída de casa. As cenas atuais usam `GardenCinematic.js`, seguindo a atuação em camadas de `ToyRoomIntroduction`. Em `assets/art/garden/cinematic/`, dois cenários conservam lugares vazios para Yuna/Nanda e a prancha transparente fornece oito atuações; prompts integrais no mesmo diretório. `prepare-garden-cinematic.js` isola os componentes, evitando fragmentos da pose vizinha, e gera o atlas/âncoras em `GardenCinematicArt.js`. Preserve roupa, escala relativa e identidade. No final, Yuna descansa sentada e Nanda pousa ao lado, com pão e suco na escala da sua mãozinha. As composições antigas em `narrative/` e `docs/diario-ia/arte/cenas-yuna-v1/` permanecem como referências. Planos cinematográficos podem reenquadrar a atuação; a câmera jogável continua somente lateral. As falas respeitam a barra superior.

`source/abelha-camadas-v2.png` separa corpo e asas. `GardenBeeRenderer` desenha o mesmo corpo em todos os quadros e articula as asas pela raiz, com escala fixa. Não voltar a alternar as duas poses antigas: a diferença de corpo/âncora causa tremor. O preparador cinematográfico mede estas camadas, preservando o alfa; o prompt está em `prompts-abelha-camadas-v2.json`. Não recalibrar hitboxes para uma correção de batimento.

Os novos bichos usam `source/insetos-v1.png`, `runtime/insetos-v1.png` e `GardenInsectArt.js`, preparados por `prepare-garden-insects.js`. A abelha usa corpo para contato, sem incluir asas; a minhoca colide apenas com a parte exposta, sem suas pedras decorativas. O besouro voa e é inofensivo. Medo de Yuna usa a fonte atual `source/menina-medo-v2.png` e quatro pranchas `runtime/medo-v2-*`, geradas por `prepare-garden-fear.js`. São poses completas, com rosto, braços e passadas exageradas; o preparador registra escala/âncoras pela referência do apoio e mantém margem para a silhueta. `FEAR_FRAMES` possui recortes próprios. A fonte v1 permanece preservada. Não recalcular `GardenContactData` a partir desta atuação: física, seleção das solas e trajetória mantêm os dados originais. Suor e oscilação são exclusivamente visuais. Prompts completos em `prompts-insetos-v1.json` e `prompts-medo-v1.json`.

O besouro atual usa `source/besouro-camadas-v2.png`, `prepare-garden-beetle.js`, `GardenBeetleArt.js` e `GardenBeetleRenderer.js`: corpo único e par de asas isolado, com raiz e escala estáveis. Prompts integrais das duas novas fontes em `assets/art/garden/prompts-polimento-v2.json`, geradas com `image_gen` integrada. Os originais anteriores continuam preservados, sem carregar as quatro pranchas antigas de medo no manifesto atual. Cenas manuais mantêm somente a moldura opaca; o lembrete de avanço/skip pertence ao quadro, não a outra tarja sobre os atores.

## Atuação articulada da exploração

`GirlLocomotion` usa a pele da pose original de repouso e um recorte completo da meia/bota da corrida original. A preparação é em memória, com cache por carregador; as pranchas não são repintadas. A superfície da perna acompanha o joelho sem separar blocos de textura e as botas giram inteiras. A parada assenta na camada original antes de voltar à pintura integral. `GirlGait` coordena quadril/tronco, apoio e impulso na perspectiva lateral da pintura; `GirlBodyLayers` mantém recortes de braços, torso, saia, cabeça e cabelo. A divisão no pescoço conserva uma cabeça única, com compensação da inclinação; braços alternam e cabelo/saia têm atraso discreto. Mãos/carga/dedos usam a mesma transformação. O vetor físico para cima/baixo ou diagonal não deve reorientar apenas as pernas: sem vistas correspondentes do torso, toda a atuação conserva o perfil lateral aprovado. Os polígonos de recorte precisam conter a pintura inteira dos membros para evitar fragmentos parados. Conferir aparência em escala real e ampliada, dois sentidos, oito direções, cargas e transições.

A prancha `girl-v2/source/pernas-articuladas-v1.png`, prompt, derivado, preparador e metadados ficam preservados como variante histórica, retirada do manifesto após o usuário apontar diferença de aparência. Não usar essa variante para reconstruir a caminhada atual. Não substituir `GIRL_V2_FOOT_BOUNDS` por recortes de apresentação: física e contato conservam o envelope aprovado.

## Sombras no piso da sala2D

A exploração projeta as silhuetas das artes existentes por `ToyRoomShadows`, sem gerar PNGs novos. Alterar transparência ou a base de um móvel/brinquedo exige revisar os apoios visuais e a projeção. Alfa opaco fornece a silhueta; a penumbra translúcida pintada é preservada e recebe contato adicional mais discreto. Evite incluir sombra opaca longa na arte nova, pois ela pode parecer parte do objeto na máscara. As imagens atuais não foram repintadas. Ao carregar, o brinquedo entra na sombra de Yuna; não desenhar também uma sombra de chão na posição antiga. Tapetes recebem sombra; corpos/móveis a ocultam. Física e câmeras permanecem independentes desse acabamento.


## Gravuras e atuação dos capítulos

`assets/art/chapters/` contém a sala arrumada sem objetos soltos no chão, a menina cansada/feliz/confusa, Nanda em facepalm/sono e Yuna sonolenta/adormecida. Fontes anteriores permanecem preservadas. `prepare-chapter-art.js` localiza os vãos transparentes e mede os recortes de `ChapterArt.js`, sem editar os PNGs. `ChapterCard` desenha títulos em cima das gravuras existentes; `ToyRoomEpilogue` e `GardenCinematic` compõem a atuação em camadas. Consulte o [roteiro](../capitulos/ROTEIRO.md) e a proveniência em `assets/art/chapters/prompts.json`.

## Floresta dos sonhos

Fundo azul e quatro poses próprias de escalada em `assets/art/dream-forest/`, com proveniência e aprovação pendente. DreamArt é gerado por `scripts/prepare-dream-art.js`; também mede o contorno superior das pinturas de besouro, abelha, formiga e minhoca reaproveitadas. DreamRenderer conserva proporções e usa o mesmo perfil da física. Gramas continuam Canvas com curvas compartilhadas. Folhas estáveis agora são sprites registrados na superfície anterior, sem réguas de contato. Consultar o [guia do sonho](../dream-forest/GUIA-SONHO.md).

No sonho, os quatro besouros usam articulação em `DreamBeetle.js`: máscaras de cabeça/patas e recorte original das asas. Alterar a fonte exige revisar pivôs, polígonos e perfil de apoio; o casco deve continuar coerente com a superfície física. Não sobrepor linhas de contato.

`dream-forest/folha-plataforma-v1.png` e `abelhinha-do-bem-v1.png` têm prompts próprios na mesma pasta. A folha conserva o apoio por registro visual em cache; o caule prolonga a pintura abaixo do viewport. Na abelha, manter cotonete conectado ao abdômen, corpo íntegro e asas em camada separada. `prepare-dream-art.js` mede recortes e âncoras; trocar a arte não autoriza recalcular física, hitboxes ou distâncias.

No trecho posterior à folha aprovada rest-4, aranhinha-v1.png é nociva e o fio é escalável. Manter os oito membros dentro do recorte/hazard definido; alterações visuais não recalibram dano ou alcance por conta própria. Galho-vento-v1.png inclui tronco e superfície de madeira; a pintura é registrada no relevo físico em cache. Não desenhar barras ou linhas auxiliares sobre o topo. Prompts em prompts-teias-galhos-v1.json na pasta de arte do sonho.

A escalada atual de Yuna usa yuna-escalada-v2.png, com quatro poses de flexão/extensão e duas de chegada ao topo. Manter mãos e sapatos completos e silhuetas de pernas visivelmente distintas; não aprovar só mudança de braços. prepare-dream-art.js extrai componentes completos, âncoras das mãos e contornos visuais dos insetos. A mão, e não o centro do sprite, ancora o desenho. Os contornos visuais não substituem a física e não usam asas móveis como apoio. A versão1 permanece fonte histórica de identidade.

No planador do sonho, `yuna-planador-v1.png` integra folha, haste e mãos; preserve a conexão ao editar. `galho-espinhos-v1.png` fornece os obstáculos. Reconstruir `DreamGliderArt` com `scripts/prepare-dream-glider.js`: as máscaras de alfa e a âncora/escala em dreamGliderPose acompanham as pinturas. Novas geometrias exigem revisão das passagens; não alterar a física anterior nem desenhar réguas sobre a arte.


No final furtivo, `barata-pesadelo-v1.png` é a criatura monumental ao fundo; conservar os olhos medidos e os seis membros. `pedras-pesadelo-v1.png` contém três abrigos opacos: os contornos de alfa recortam luz e determinam detecção. `yuna-despertar-v1.png` tem três atuações sentadas com mesma escala. Execute `prepare-dream-nightmare.js` após trocar fontes; olhos e cabeça da barata têm âncoras autoradas no preparador. Confira sombras e amostras do corpo real, sem criar réguas de contato. O cenário/sono de Nanda no piquenique são reutilizados, sem sobrescrever fontes anteriores. Prompts completos em prompts-pesadelo-v1.json.


`yuna-susto-em-pe-v1.png` acrescenta duas poses completas, com os pés no chão: mãos junto ao peito e mãos protegendo o rosto. A cena final alterna a caminhada assustada com essas reações antes da captura. Recortes e escala comum são gerados por `prepare-dream-nightmare.js`; as poses não alteram a detecção do trecho jogável. Fonte/prompt preservados em `assets/art/dream-forest/prompts-pesadelo-v1.json`.

## Profundidade da furtividade revisada

A barata ocupa o plano distante; as pedras estão no plano intermediário (base25unidades atrás dos pés) e Yuna no caminho próximo (pés850). O desenho de Yuna vem depois das pedras: o jogador enxerga a personagem protegida. Feixes partem dos olhos articulados e são interrompidos pelos contornos das rochas; a sombra avança para o caminho da frente. O chão pintado `chao-floresta-sombria-v1.png` mantém a paleta azul da floresta existente; proveniência e prompt completo em `assets/art/dream-forest/prompts-profundidade-v1.json`.

`DreamRoach` preserva o PNG original e prepara segmentos em Canvas. Seis patas alternam tripés; cabeça e antenas investigam, e a pata frontal alcança Yuna por duas juntas na captura. A patrulha percorre o fundo acompanhando o avanço lateral da cena, com oscilação e varredura próprias. Pose, olhos físicos e sombras usam o mesmo relógio salvo. A geometria nova usa `nightmare.version=4`; saves anteriores seguros conservam o ponto e saves furtivos antigos que ficariam iluminados retornam à primeira pedra. Domínio5/envelope1 e trecho aéreo preservados.

O final ampliado usa yuna-furtiva-v2 (grade3×2) e abrigos-floresta-v2 (grade2×2), medidos por prepare-dream-nightmare.js. Preservar escala da cabeça e flexionar o corpo para abaixar; as mãos cobrem os ouvidos na pose de abrigo. As variantes1 são referências. Terra contínua sustenta os relevos, cujo perfil opaco define o apoio, sem linhas auxiliares. Lama opaca encobre a menina somente ao mergulhar; o restante conserva Yuna na frente dos objetos. Prompts/hashes em assets/art/dream-forest/prompts-furtividade-v3.json.

Lagos atuais usam lagos-lama-v2 e yuna-nado-v2. O modo de entrada salta para a lama e produz respingos no impacto; a saída emerge antes de apoiar as palmas na terra e puxar o corpo pelas seis poses próprias de yuna-saida-lama-v2. As âncoras de água/mão são compartilhadas com os pontos opacos da detecção. Morro-terra-v1 fornece massa de solo contínua, recortada na geometria já existente. Figurino selecionado: furtiva-v4, susto/despertar-v2; prompts-consistencia-figurino-v1 documenta as iterações.

A saída da lama possui recortes pelos vãos transparentes de cada linha, pois a grade nominal não pode cortar dedos ou sapatos. `prepare-dream-nightmare.js` registra palmas, sola e apoio por pose; as primeiras cinco usam a palma, a última transfere peso à sola. Escorregão, joelho e arrasto pertencem a essa atuação de1,9s; a escalada aérea original permanece em `yuna-escalada-v2.png`.

`yuna-salto-lama-v1.png` fornece quatro poses de impulso/voo/queda/imersão; `respingo-lama-v1.png` é a arte transparente da coroa de lama e gotas, acionada no contato em0,68s. `floresta-cinematica-v1.png` e `yuna-cinematica-pesadelo-v2.png` pertencem aos planos próprios da captura, sem lago ou câmera de exploração. O topo dos recortes de atuação usa a silhueta do componente original para excluir solas da célula vizinha. Prompts integrais, referências e hashes em assets/art/dream-forest/prompts-entrada-cinematica-v1.json.

Nos três barrancos antes das poças, `DreamNightmareRenderer.prepareTerrain` reaproveita `morro-terra-v1` e registra a borda opaca no apoio físico existente. A face de solo aparece somente a partir da subida sólida e a base se mistura ao chão, com luz ambiente comum. A crista física continua derivada dos dados originais de `abrigos-floresta-v2`; o bitmap de apresentação não deve recalcular hitboxes. Não acrescentar réguas de contato ou faixas de cor sobre o cenário para indicar o salto.


No pouso após os espinhos, a queda ocupa uma cena própria sobre o chão cinematográfico; não desenhar um retângulo de morro-terra-v1 no corredor. A entrada usa as pinturas cinematográficas existentes com árvores em primeiro plano, seguida de Yuna atrás da pedra. Pivôs de ROACH_JOINTS devem cair em quitina opaca; joelhos sobrepostos evitam membros partidos. Conferir as seis pernas, passadas e a garra na captura. A atuação não recalibra origem dos olhos, feixe visual ou apoios do caminho.


A queda após o planador usa yuna-queda-vento-v1: quatro componentes completos medidos em windFall, com rowMask de cada linha para excluir cabelo/sapato da pose vizinha. Preservar preocupação, mãos abertas na perda da folha, pernas de amortecimento e figurino. Fonte, referências e prompt em prompts-queda-vento-v1.json. Não reapresentar morro-terra como retângulo no fim do voo. O D-pad é desenho Canvas compartilhado, sem bitmap novo. O pântano compõe o solo central e os troncos existentes em planos, sem mudar silhuetas físicas.


Abertura do sonho: yuna-abertura-sonho-v1 fornece olhar para trás, duas poses ajoelhadas com mãos de contato e partida hesitante. Dados openingGirl em DreamNightmareArt são preparados por prepare-dream-nightmare.js, incluindo rowMask e hand por pose. Prompt/referências em prompts-abertura-sonho-v1.json. Nanda usa a pose adormecida existente de nanda-gestos-v1, em escala corporal comparável à menina; não usar a altura das asas como régua de tamanho. Conferir os dois rostos visíveis, contato de mãos e pés/joelhos inteiros em retrato e paisagem.

## Brinquedão e descoberta de Nanda

Arte do novo circuito em `assets/art/brinquedao/`; [origem e funções](../../assets/art/brinquedao/README.md). `prepare-brinquedao.js` gera BrinquedaoArt; Terrain/Renderer preparam material e máscaras em memória. A prancha v2 é a fonte das quatro atuações; v1 permanece como referência. Passarelas, postes, pontes e escorregadores têm materiais pintados, sem réguas de contato.

`assets/art/dream-forest/yuna-olhar-nanda-v2.png` corrige a torção da pose de descoberta. Cabeça, ombros, tronco e pés devem compartilhar a mesma orientação; não girar pescoço separadamente. `prepare-dream-nightmare.js` mede `openingLook` como componente completo. Cabelo, mãos, vestido e sapatos não devem ser cortados.

A continuação usa `atracoes-elasticas-v1.png`: lona, torre de castelo, painel elástico inclinado e rampa reversa, todos em componentes separados. prepare-brinquedao mede suas máscaras; BrinquedaoAttractions prepara os recortes em memória. Lonas e painel respondem visualmente ao relógio de impacto salvo. BrinquedaoTerrain mantém postes fixos e deixa as peças das pontes caírem. A pose sentada se ancora no assento ao descer/subir rampas. O catálogo gerado agora resolve BRINQUEDAO_ART para marcar recursos em runtime e catalogar os12recortes das três pranchas.

Na recuperação inferior, calhas em U reutilizam o escorregador pintado com amostragem espelhada nas duas metades. BrinquedaoAttractions gira a lona existente para formar18camas laterais, preservando molas e apoios para fora. Compressão e recuo usam o relógio do impacto; o corpo inteiro inclina brevemente sem separar cabeça/pescoço. Não foram gerados ou alterados PNGs nesta expansão; reconstruir o mapa para atualizar consumidores e referências.


Interior do Brinquedão: interior-brinquedao-v1.png é o fundo coberto e ensolarado; tubos-interior-v1.png tem cilindro reto e boca isolados em alfa; peixinhos-brinquedo-v1.png tem quatro poses completas de peixes de corda. Os tubos são curvados em memória, com cantos arredondados para conservar material e volume. Não pintar trajetórias ou réguas sobre as superfícies. Prompts e hashes estão em assets/art/brinquedao/prompts-interior-v1.json.
