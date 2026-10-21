# Guia de edição de sprites para designers e desenvolvimento

Antes de editar, consulte `docs/diario-ia/CONTEXTO-ATUAL.md`. O [mapa completo](MAPA-SPRITES.md) identifica cada imagem existente, dimensões, nomes usados pelo carregador e consumidores no código. O [inventário JSON](inventario.json) contém hashes e referências completas. O [mapa de recortes](RECORTES.md) localiza poses e objetos dentro das pranchas.

## Localização e consumidores

| Arte / fase | Arquivos que a equipe pode editar | Integração e metadados |
| --- | --- | --- |
| Menina oficial na exploração/plataformas | `assets/art/dark-room/sprites/official-character.png`; origem `assets/art/dark-room/official-sprites.png` | `src/js/assets/officialCharacter.js`, `src/js/entities/BabyRenderer.js`, `src/js/toy-room/ToyRoomEntities.js`. Extração: `scripts/generate-dream-girl-sprites.js`. |
| Menina na arena | `assets/art/toy-room/battle/girl/runtime/` e `assets/art/toy-room/battle/girl/animation-v2/` | `ArenaGirlAnimationFrames.js`, `ArenaPlayerRenderer.js`, `BattleGirlFrames.js`, `ToyRoomBattle.js` e manifestos dedicados em `assets/art/toy-room/battle/`. Consulte `docs/arena/GUIA-ANIMACAO.md` para poses, antecipação e âncoras. |
| Inimigos: trem, robô, dinossauro e urso | `assets/art/toy-room/battle/`, subpastas de cada personagem | `BattleAssets.js` carrega os recursos; `BattleRenderer.js` e `BattlePresentation.js` apresentam os quadros; `ToyRoomBattle.js` mantém a simulação. Manifestos dedicados e `docs/battle-mode/battle-sprite-production.md`. Animação e eventos de dano não são definidos apenas pelas imagens. |
| Plataformas do quarto escuro | `assets/art/dark-room/platforms/`, `sprites/`, `modern/`, `corrections/` | `src/js/environment/PlatformRenderer.js`, `PLATFORM_SURFACES`, `StorybookPlatforms.js`, `src/js/assets/darkRoomAtlas.js`, `src/js/config.js`. Metadados de superfície conservam apoio dos pés. |
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

A tela inicial consome `assets/art/title-screen/` por `TitleScene`, com fontes, prompts e resolução nativa registrados em `prompts.json`. O tamanho de composição do canvas não muda a resolução da fonte.

A fuga combina introdução ilustrada em `assets/art/toy-room/bear-chase/cinematic/` com modelos locais e materiais ilustrados de `assets/models/bear-chase/` e `assets/art/toy-room/bear-chase/`. `ChaseIntroRenderer`, `ChaseGirlModel`, `ChaseBearModel` e as fábricas em `bear-chase/props/` são consumidores distintos. A fada permanece ilustrada. Consulte o [guia da fuga](../bear-chase/GUIA-PREVIA.md) antes de alterar poses, modelos ou atlas.

O piso 3D usa o recorte (27,151), 186×48, de `environment-sheet.png`; a cópia RGBA 256×64 e seus mipmaps são preparados em memória por `ChaseRenderer3D`, sem novo PNG. Não modificar a prancha para resolver um problema de upload. Paleta e GLB da menina têm exportadores próprios; leia os scripts antes de executá-los. A aprovação da arena ou de versões anteriores não homologa automaticamente novos modelos e poses.
