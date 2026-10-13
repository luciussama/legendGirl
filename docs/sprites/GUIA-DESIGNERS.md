# Guia de edição de sprites para designers e desenvolvimento

Antes de editar, consulte `docs/diario-ia/CONTEXTO-ATUAL.md`. O [mapa completo](MAPA-SPRITES.md) identifica cada imagem existente, dimensões, nomes usados pelo carregador e consumidores no código. O [inventário JSON](inventario.json) contém hashes e referências completas. O [mapa de recortes](RECORTES.md) localiza poses e objetos dentro das pranchas.

## Localização e consumidores

| Arte / fase | Arquivos que a equipe pode editar | Integração e metadados |
| --- | --- | --- |
| Menina oficial na exploração/plataformas | `assets/art/dark-room/sprites/official-character.png`; origem `assets/art/dark-room/official-sprites.png` | `src/js/assets/officialCharacter.js`, `src/js/entities/BabyRenderer.js`, `src/js/toy-room/ToyRoomEntities.js`. Extração: `scripts/generate-dream-girl-sprites.js`. |
| Menina na arena | `assets/art/toy-room/battle/girl/runtime/` e `assets/art/toy-room/battle/girl/animation-v2/` | `ArenaGirlAnimationFrames.js`, `ArenaPlayerRenderer.js`, `BattleGirlFrames.js`, `ToyRoomBattle.js` e manifestos dedicados em `assets/art/toy-room/battle/`. Consulte `docs/arena/animacao-menina.md` para poses, antecipação e âncoras. |
| Inimigos: trem, robô, dinossauro e urso | `assets/art/toy-room/battle/`, subpastas de cada personagem | `ToyRoomBattle.js`, `BattlePresentation.js`; manifests dedicados e `docs/battle-mode/battle-sprite-production.md`. Animação e eventos de dano não são definidos apenas pelas imagens. |
| Plataformas do quarto escuro | `assets/art/dark-room/platforms/`, `sprites/`, `modern/`, `corrections/` | `src/js/environment/PlatformRenderer.js`, `PLATFORM_SURFACES`, `StorybookPlatforms.js`, `src/js/assets/darkRoomAtlas.js`, `src/js/config.js`. Metadados de superfície conservam apoio dos pés. |
| Atlas consolidado do quarto escuro | `assets/art/dark-room/production-spritesheet.png` | Gerado por `scripts/build-dark-room-atlas.js`; coordenadas em `darkRoomAtlas.js` e `assets/art/dark-room/darkRoomAtlas.json`. Evite editar só a prancha gerada e deixar os PNGs de origem divergentes. |
| Cenário decorativo atual | `assets/art/dark-room/scenery-current/` | `src/js/assets/currentScenery.js`, `BackgroundRenderer.js`, `assets/manifest.json`. Dez PNGs novos e sete ilustrações reutilizadas; a lista exata está em `currentScenery.js`. |
| Piso, paredes, tapetes e detalhes da Toy Room | `assets/art/toy-room/stage1/`, `environment-sheet.png` | `RoomEnvironmentRenderer.js`, `ToyRoomPhase.js`, `assets/manifest.json`. `ToyRoomPhase.js` recorta objetos da prancha; não mover suas regiões sem atualizar os consumidores. |
| Transporte e móveis da Toy Room | `stage2/`, `stage3/`, `chest-brinquedos-v1.png` | `ToyRenderer.js`, `RoomEnvironmentRenderer.js`, `ToyRoomPhase.js`; READMEs e prompts dentro das pastas stage1/2/3. |
| Fada ilustrada | `assets/art/toy-room/stage3/illustrated-fairy-v1.png` | `src/js/entities/FairyRenderer.js` e `src/js/toy-room/ToyRoomEntities.js`. Mesma arte usada nas duas fases, com escalas de apresentação diferentes. |
| Arena heroica e estruturas | Artes consumidas por `ArenaEnvironment.js` e `ToyRoomArenaBuilder.js` | A arena reaproveita a sala, com transformações, escala e câmera próprias. Revise esses módulos antes de substituir uma arte compartilhada; não presumir que cada estrutura possui um PNG exclusivo. |
| Abertura | `assets/art/dark-room/opening/` | `src/js/cinematics/OpeningSequence.js` e consumidores localizados no mapa; README da pasta informa origem e composição. |
| Retratos e efeitos de interface | [Desenhos em código](DESENHOS-EM-CODIGO.md) | `src/js/ui/DialogueRenderer.js`, HUDs e efeitos Canvas. Não há necessariamente um PNG para editar; mudanças precisam de integração com desenvolvimento. |

## Como editar sem quebrar o jogo

1. Identifique o arquivo e todos os usos no mapa. Uma imagem compartilhada pode afetar exploração, abertura e arena. Use `rg -n 'nome-da-chave|nome-do-arquivo' src assets scripts tests` para confirmar.
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

Entregue lista de arquivos, indicação de quais derivados foram reconstruídos, mudanças em dimensões/âncoras, testes executados com resultado e capturas das cenas afetadas. Registre separadamente aprovação técnica e aprovação humana.
